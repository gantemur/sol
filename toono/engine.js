/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
   SPDX-License-Identifier: MIT

   toono engine: solar position, ger interior geometry, light-patch ray
   tracing through the toono, and the traditional 12 double-hour systems.
   Pure computation, no DOM. Works in browsers (window.ToonoEngine) and Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ToonoEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const OBLIQUITY = 23.44;            // degrees, for annual declination range
  const MOUSE = 0, TIGER = 2, RABBIT = 3, HORSE = 6, ROOSTER = 9;
  const mod = (a, n) => ((a % n) + n) % n;

  // ---------------------------------------------------------------- Sun ---
  // NOAA / Meeus low-precision solar coordinates (about 0.01 deg, 1 min).
  function solar(ms) {
    const jd = ms / 86400000 + 2440587.5;
    const T = (jd - 2451545) / 36525;
    const L0 = mod(280.46646 + T * (36000.76983 + 0.0003032 * T), 360);
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const Mr = M * D2R;
    const C = Math.sin(Mr) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
      Math.sin(2 * Mr) * (0.019993 - 0.000101 * T) + Math.sin(3 * Mr) * 0.000289;
    const omega = (125.04 - 1934.136 * T) * D2R;
    const lambda = (L0 + C - 0.00569 - 0.00478 * Math.sin(omega)) * D2R;
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
    const eps = (eps0 + 0.00256 * Math.cos(omega)) * D2R;
    const decl = Math.asin(Math.sin(eps) * Math.sin(lambda));
    const y = Math.tan(eps / 2) ** 2, L = L0 * D2R;
    const eot = 4 * R2D * (y * Math.sin(2 * L) - 2 * e * Math.sin(Mr) +
      4 * e * y * Math.sin(Mr) * Math.cos(2 * L) - 0.5 * y * y * Math.sin(4 * L) -
      1.25 * e * e * Math.sin(2 * Mr));
    return { decl, eot };                       // decl in rad, eot in minutes
  }

  // Unit vector toward the Sun in east-north-up coordinates.
  // phi: latitude (rad), H: hour angle (rad, + after noon), decl (rad).
  function sunVector(phi, H, decl) {
    const cd = Math.cos(decl), sd = Math.sin(decl);
    return [
      -cd * Math.sin(H),
      Math.cos(phi) * sd - Math.sin(phi) * cd * Math.cos(H),
      Math.sin(phi) * sd + Math.cos(phi) * cd * Math.cos(H)
    ];
  }

  // Full solar state at instant ms for latitude/longitude in degrees.
  function sunState(ms, lat, lon) {
    const { decl, eot } = solar(ms);
    const utcMin = mod(ms / 60000, 1440);
    const ast = mod(utcMin + 4 * lon + eot, 1440);          // apparent solar time, min
    const H = (ast / 4 - 180) * D2R;
    const s = sunVector(lat * D2R, H, decl);
    return {
      decl, eot, ast, H, s,
      alt: Math.asin(Math.max(-1, Math.min(1, s[2]))) * R2D,
      az: mod(Math.atan2(s[0], s[1]) * R2D, 360)
    };
  }

  // Half day arc (rad) for a given apparent altitude h0 (deg); null if the
  // Sun does not cross that altitude (polar day or night).
  function halfDayArc(lat, decl, h0 = 0) {
    const phi = lat * D2R;
    const c = (Math.sin(h0 * D2R) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
    if (c <= -1 || c >= 1) return null;
    return Math.acos(c);
  }

  // ---------------------------------------------------------------- Ger ---
  // Approximate dimensions in metres; all are editable in the tool.
  const PRESETS = {
    4: { khana: 4, R: 2.3, wallH: 1.45, toonoH: 2.3, toonoR: 0.6, uni: 60 },
    5: { khana: 5, R: 2.7, wallH: 1.5, toonoH: 2.45, toonoR: 0.65, uni: 81 },
    6: { khana: 6, R: 3.1, wallH: 1.55, toonoH: 2.6, toonoR: 0.7, uni: 96 }
  };

  function validateGer(g) {
    const errs = [];
    if (!(g.R > 0.5 && g.R <= 10)) errs.push('R');
    if (!(g.wallH > 0.3 && g.wallH < 5)) errs.push('wallH');
    if (!(g.toonoR > 0.05 && g.toonoR < g.R * 0.8)) errs.push('toonoR');
    if (!(g.toonoH > g.wallH + 0.05 && g.toonoH < 10)) errs.push('toonoH');
    if (!(g.uni >= 12 && g.uni <= 200)) errs.push('uni');
    return errs;
  }

  function roofSlant(g) { return Math.hypot(g.R - g.toonoR, g.toonoH - g.wallH); }
  function netMax(g) { return g.R + g.wallH; }

  // Trace a ray starting at point A on the toono plane (A[2] = toonoH),
  // direction d (pointing down into the ger). Returns the first interior
  // surface hit: floor (z=0, r<=R), wall (r=R, 0<=z<=wallH) or roof (straight
  // cone from the wall head up to the toono rim).
  function trace(A, d, g) {
    if (!(d[2] < -1e-12)) return null;
    const { R, wallH: Hw, toonoH: Ht, toonoR: rt } = g;
    let best = null;
    const consider = (t, surf) => { if (t > 1e-12 && (!best || t < best.t)) best = { t, surf }; };

    const tf = (A[2]) / -d[2];
    const fx = A[0] + tf * d[0], fy = A[1] + tf * d[1];
    if (fx * fx + fy * fy <= R * R * (1 + 1e-9)) consider(tf, 'floor');

    const a = d[0] * d[0] + d[1] * d[1];
    const adot = A[0] * d[0] + A[1] * d[1];
    const a2 = A[0] * A[0] + A[1] * A[1];
    if (a > 1e-14) {
      const b = 2 * adot, c = a2 - R * R, disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const tw = (-b + Math.sqrt(disc)) / (2 * a);
        const z = A[2] + tw * d[2];
        if (z >= -1e-9 && z <= Hw + 1e-9) consider(tw, 'wall');
      }
    }

    // Roof cone: radius r = rt + (Ht - z)/k with k = (Ht - Hw)/(R - rt).
    const k = (Ht - Hw) / (R - rt), cc = -d[2] / k;
    const qa = a - cc * cc, qb = 2 * (adot - rt * cc), qc = a2 - rt * rt;
    const roots = [];
    if (Math.abs(qa) < 1e-12) { if (Math.abs(qb) > 1e-14) roots.push(-qc / qb); }
    else {
      const disc = qb * qb - 4 * qa * qc;
      if (disc >= 0) {
        const sq = Math.sqrt(disc);
        roots.push((-qb - sq) / (2 * qa), (-qb + sq) / (2 * qa));
      }
    }
    for (const t of roots) {
      if (!(t > 1e-12)) continue;
      const z = A[2] + t * d[2];
      if (z >= Hw - 1e-9 && z <= Ht + 1e-9) consider(t, 'roof');
    }

    if (!best) return null;
    const p = [A[0] + best.t * d[0], A[1] + best.t * d[1], A[2] + best.t * d[2]];
    return { surf: best.surf, p, t: best.t };
  }

  // Drawing layouts. Every layout keeps compass direction (az, clockwise
  // from north) and maps a hit point to a radius rho.
  //  'plan'  : floor and roof in plan as seen from above (roof transparent),
  //            wall folded outward around the floor (foot inside, head
  //            outside). Discontinuous at the eave.
  //  'toono' : the interior as seen from the toono centre looking down
  //            (azimuthal equidistant about the nadir): rho is the angle
  //            from straight down, so floor, wall, uni and finally the
  //            toono rim (at 90 degrees) follow outward without breaks. The
  //            patch centre then sits at rho = 90 deg - solar altitude.
  function layout(g, view = 'plan') {
    if (view === 'toono') {
      const Ht = g.toonoH, aF = Math.atan2(g.R, Ht), aW = Math.atan2(g.R, Ht - g.wallH);
      return {
        view, continuous: true, max: Math.PI / 2, floorEdge: aF, wallFoot: aF, wallHead: aW, roofOuter: Math.PI / 2,
        rho: (surf, x, y, z) => Math.atan2(Math.hypot(x, y), Ht - z),
        wallRho: z => Math.atan2(g.R, Ht - z),
        roofRho: r => Math.atan2(r, (r - g.toonoR) * (Ht - g.wallH) / (g.R - g.toonoR)),
        edge: (a, b) => (a === 'floor' || b === 'floor') ? aF : aW
      };
    }
    return {
      view: 'plan', continuous: false, max: g.R + g.wallH, floorEdge: g.R, wallFoot: g.R, wallHead: g.R + g.wallH,
      rho: (surf, x, y, z) => surf === 'wall' ? g.R + Math.max(0, Math.min(g.wallH, z)) : Math.min(Math.hypot(x, y), g.R),
      wallRho: z => g.R + z,
      roofRho: r => r,
      edge: (a, b) => (a === 'wall' && b === 'roof') ? g.R + g.wallH : g.R
    };
  }

  function toNet(hit, g, view = 'plan') {
    const L = typeof view === 'object' ? view : layout(g, view);
    const [x, y, z] = hit.p;
    return { rho: L.rho(hit.surf, x, y, z), az: Math.atan2(x, y), surf: hit.surf, cont: L.continuous };
  }

  // Trace from the toono centre (the "nodus"); returns a net point or null.
  function traceCentre(s, g, view = 'plan') {
    const hit = trace([0, 0, g.toonoH], [-s[0], -s[1], -s[2]], g);
    return hit ? toNet(hit, g, view) : null;
  }

  // Aperture boundary: full open toono, or only the door-side half open
  // (the urkh felt pulled back over the far half).
  function apertureBoundary(g, mode, doorAz, n = 144) {
    const r = g.toonoR * 0.999, pts = [];
    if (mode === 'half') {
      const a0 = (doorAz - 90) * D2R;
      for (let i = 0; i <= n / 2; i++) {
        const a = a0 + Math.PI * i / (n / 2);
        pts.push([r * Math.sin(a), r * Math.cos(a)]);
      }
      const ex = pts[pts.length - 1], sx = pts[0];
      for (let i = 1; i < 24; i++) {
        const f = i / 24;
        pts.push([ex[0] + (sx[0] - ex[0]) * f, ex[1] + (sx[1] - ex[1]) * f]);
      }
    } else {
      for (let i = 0; i < n; i++) {
        const a = 2 * Math.PI * i / n;
        pts.push([r * Math.sin(a), r * Math.cos(a)]);
      }
    }
    return pts;
  }

  // Points along an edge circle from az0 to az1 the short way round.
  function edgeArc(az0, az1, rho, surf) {
    let dz = mod(az1 - az0 + Math.PI, 2 * Math.PI) - Math.PI;
    const n = Math.max(1, Math.ceil(Math.abs(dz) / (2 * D2R))), out = [];
    for (let i = 1; i < n; i++) out.push({ rho, az: az0 + dz * i / n, surf });
    return out;
  }

  // Light patch on each interior surface, as net polygons, or null when the
  // Sun is down. The aperture boundary is traced; where neighbouring
  // boundary rays land on different surfaces the transition is located by
  // bisection, and the pieces of each surface are closed along the shared
  // edge (eave or wall foot), so each polygon outlines the lit region.
  function patch(s, g, mode = 'full', doorAz = 180, view = 'plan') {
    const L = layout(g, view);
    if (!(s[2] > 1e-6)) return null;
    const d = [-s[0], -s[1], -s[2]];
    const B = apertureBoundary(g, mode, doorAz);
    const at = (x, y) => trace([x, y, g.toonoH], d, g);
    const hits = B.map(([x, y]) => at(x, y));
    if (hits.some(h => !h)) return null;
    const n = B.length, seq = [];
    for (let i = 0; i < n; i++) {
      const a = hits[i], b = hits[(i + 1) % n];
      seq.push({ surf: a.surf, net: toNet(a, g, L) });
      if (a.surf !== b.surf) {
        const [x0, y0] = B[i], [x1, y1] = B[(i + 1) % n];
        let lo = 0, hi = 1, hlo = a, hhi = b;
        for (let k = 0; k < 40; k++) {
          const m = (lo + hi) / 2, h = at(x0 + (x1 - x0) * m, y0 + (y1 - y0) * m);
          if (h && h.surf === a.surf) { lo = m; hlo = h; } else if (h) { hi = m; hhi = h; } else break;
        }
        seq.push({ surf: a.surf, net: toNet(hlo, g, L), exitTo: hhi.surf });
        seq.push({ surf: hhi.surf, net: toNet(hhi, g, L), enterFrom: a.surf });
      }
    }
    // In a continuous layout the image of the aperture boundary already
    // outlines the whole lit region, across surfaces.
    if (L.continuous) return [{ surf: seq.every(e => e.surf === seq[0].surf) ? seq[0].surf : 'mixed', pts: seq.map(e => e.net) }];
    const start = seq.findIndex(e => e.enterFrom);
    if (start < 0) return [{ surf: seq[0].surf, pts: seq.map(e => e.net) }];
    const runs = []; let cur = null;
    for (const e of seq.slice(start).concat(seq.slice(0, start))) {
      if (e.enterFrom || !cur) { cur = { surf: e.surf, pts: [], exitTo: null }; runs.push(cur); }
      cur.pts.push(e.net);
      if (e.exitTo) cur.exitTo = e.exitTo;
    }
    const bySurf = new Map();
    for (const r of runs) { if (!bySurf.has(r.surf)) bySurf.set(r.surf, []); bySurf.get(r.surf).push(r); }
    const polys = [];
    for (const [surf, rs] of bySurf) {
      const pts = [];
      rs.forEach((r, i) => {
        pts.push(...r.pts);
        const next = rs[(i + 1) % rs.length];
        const a0 = r.pts[r.pts.length - 1], a1 = next.pts[0];
        pts.push(...edgeArc(a0.az, a1.az, L.edge(surf, r.exitTo), surf));
      });
      if (pts.length > 2) polys.push({ surf, pts });
    }
    return polys.length ? polys : null;
  }

  // ---------------------------------------------------- Overlay curves ---
  // Polylines are arrays of net points; visibility breaks start new lines.
  // Sample fn over increasing parameter values; null means not visible.
  // Where visibility changes, or the drawing jumps (roof and wall in the plan
  // view), the edge is located by bisection so lines run right up to it.
  function sweep(samples, fn) {
    const jump = (q, p) => !p.cont && q.surf !== p.surf && (q.surf === 'roof' || p.surf === 'roof');
    const edge = (v0, p0, v1, p1) => {
      // Returns [last point on the v0 side, first point on the v1 side].
      let lo = v0, hi = v1, plo = p0, phi = p1;
      for (let k = 0; k < 30; k++) {
        const m = (lo + hi) / 2, pm = fn(m);
        const sameAsLo = plo ? (pm && !jump(plo, pm)) : !pm;
        if (sameAsLo) { lo = m; plo = pm; } else { hi = m; phi = pm; }
      }
      return [plo, phi];
    };
    const lines = [], links = []; let cur = [], prevV = null, prevP = null;
    for (const v of samples) {
      const p = fn(v);
      if (prevV !== null && ((!prevP) !== (!p) || (p && prevP && jump(prevP, p)))) {
        const [a, b] = edge(prevV, prevP, v, p);
        if (a && b) links.push([a, b]);       // same light position drawn twice
        if (a) cur.push(a);
        if (cur.length) lines.push(cur);
        cur = b ? [b] : [];
      }
      if (p) cur.push(p);
      prevV = v; prevP = p;
    }
    if (cur.length) lines.push(cur);
    const out = lines.filter(l => l.length > 1);
    out.links = links;
    return out;
  }
  const range = (a, b, step) => { const out = []; for (let v = a; v <= b + 1e-9; v += step) out.push(v); return out; };

  // Path of the patch centre over a day at fixed declination.
  function declinationPath(lat, decl, g, view = 'plan') {
    const phi = lat * D2R;
    return sweep(range(-180, 180, 0.5), H => {
      const s = sunVector(phi, H * D2R, decl);
      return s[2] > 1e-6 ? traceCentre(s, g, view) : null;
    });
  }

  // Fixed hour line for hour angle H (deg) over the whole year: the
  // intersection of the hour plane through the toono with the interior.
  function hourLine(lat, Hdeg, g, view = 'plan') {
    const phi = lat * D2R;
    return sweep(range(-OBLIQUITY, OBLIQUITY, 0.25), dd => {
      const s = sunVector(phi, Hdeg * D2R, dd * D2R);
      return s[2] > 1e-6 ? traceCentre(s, g, view) : null;
    });
  }

  // Temporal (unequal) hour line: boundary j (1..5) of the six daylight
  // double hours that start at sunrise (geometric horizon).
  function temporalLine(lat, j, g, view = 'plan') {
    const phi = lat * D2R;
    return sweep(range(-OBLIQUITY, OBLIQUITY, 0.25), dd => {
      const H0 = halfDayArc(lat, dd * D2R, 0);
      if (H0 === null) return null;
      const s = sunVector(phi, -H0 + j * H0 / 3, dd * D2R);
      return s[2] > 1e-6 ? traceCentre(s, g, view) : null;
    });
  }

  // Equal-hour line on the floor only (wall and roof ignored), for hour
  // angle Hdeg: the straight line where the hour plane through the toono
  // centre meets the floor. All such lines pass through the foot F of the
  // polar axis through the toono, toonoH * cot(latitude) towards the
  // equator from the centre. Returns floor points (x, y) for the part of the
  // ray from F that lies on the floor ('full') and the part the light can
  // actually reach between the solstices ('reach'), or null.
  function floorHourLine(lat, Hdeg, g) {
    const phi = lat * D2R, Ht = g.toonoH;
    if (Math.abs(Math.sin(phi)) < 0.05) return null;
    const F = [0, -Ht * Math.cos(phi) / Math.sin(phi)];
    const hits = [];
    for (let dd = -OBLIQUITY; dd <= OBLIQUITY + 1e-9; dd += 0.5) {
      const s = sunVector(phi, Hdeg * D2R, dd * D2R);
      if (s[2] > 1e-3) hits.push([-Ht * s[0] / s[2], -Ht * s[1] / s[2]]);
    }
    if (!hits.length) return null;
    let far = hits[0];
    for (const h of hits) if (Math.hypot(h[0] - F[0], h[1] - F[1]) > Math.hypot(far[0] - F[0], far[1] - F[1])) far = h;
    const len = Math.hypot(far[0] - F[0], far[1] - F[1]);
    if (len < 1e-9) return null;
    const u = [(far[0] - F[0]) / len, (far[1] - F[1]) / len];
    const at = t => [F[0] + t * u[0], F[1] + t * u[1]];
    // Ray inside the floor circle: |F + t u|^2 <= R^2, t >= 0.
    const b = F[0] * u[0] + F[1] * u[1], c = F[0] * F[0] + F[1] * F[1] - g.R * g.R, disc = b * b - c;
    if (disc <= 0) return null;
    const t0 = Math.max(0, -b - Math.sqrt(disc)), t1 = -b + Math.sqrt(disc);
    if (t1 <= t0) return null;
    const ts = hits.map(h => (h[0] - F[0]) * u[0] + (h[1] - F[1]) * u[1]);
    const r0 = Math.max(t0, Math.min(...ts)), r1 = Math.min(t1, Math.max(...ts));
    return { F, full: [at(t0), at(t1)], reach: r1 > r0 ? [at(r0), at(r1)] : null, footOnFloor: t0 === 0 };
  }

  // Sunrise and sunset (geometric horizon) within [start, start + 24 h],
  // located by scanning and bisection; either may be null.
  function sunEvents(start, lat, lon) {
    const alt = ms => sunState(ms, lat, lon).alt;
    let rise = null, set = null, prev = alt(start);
    for (let m = 5; m <= 1440; m += 5) {
      const ms = start + m * 60000, cur = alt(ms);
      if ((prev <= 0) !== (cur <= 0)) {
        let lo = ms - 300000, hi = ms;
        for (let k = 0; k < 25; k++) { const mid = (lo + hi) / 2; if ((alt(mid) <= 0) === (prev <= 0)) lo = mid; else hi = mid; }
        if (prev <= 0) { if (rise === null) rise = hi; } else if (set === null) set = hi;
      }
      prev = cur;
    }
    return { rise, set };
  }

  // -------------------------------------------------------- Hour systems ---
  // Indices into the animal cycle, 0 = Mouse ... 11 = Pig.
  // Clock convention: Mouse 23:40-01:40, ..., on the chosen zone's clock.
  function clockHour(minutesOfDay) { return Math.floor(mod(minutesOfDay - (23 * 60 + 40), 1440) / 120); }
  // True solar double hours, Horse centred on apparent noon.
  function solarHour(ast) { return Math.floor(mod(ast - 23 * 60, 1440) / 120); }
  // Direction of the Sun among 12 fixed 30-degree sectors of the ger; rot is
  // the ger's rotation from a south-facing door (doorAz - 180).
  function directionHour(az, rot = 0) { return Math.floor(mod(az - rot + 15, 360) / 30); }
  // Unequal hours: Rabbit begins at sunrise, Rooster at sunset; daylight and
  // night are each divided into six. Null during polar day/night.
  function temporalHour(lat, decl, H) {
    const H0 = halfDayArc(lat, decl, 0);
    if (H0 === null) return null;
    const h = mod(H + Math.PI, 2 * Math.PI) - Math.PI;     // -pi..pi
    if (h >= -H0 && h < H0) return RABBIT + Math.min(5, Math.floor((h + H0) / (H0 / 3)));
    const night = 2 * Math.PI - 2 * H0;
    const since = mod(h - H0, 2 * Math.PI);
    return mod(ROOSTER + Math.min(5, Math.floor(since / (night / 6))), 12);
  }

  // ---------------------------------------------------------- Time zones ---
  const fmtCache = new Map();
  function zoneParts(tz, ms) {
    let f = fmtCache.get(tz);
    if (!f) {
      f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric',
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      fmtCache.set(tz, f);
    }
    const p = {};
    for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
    return { y: +p.year, mo: +p.month, d: +p.day, h: (+p.hour) % 24, mi: +p.minute, s: +p.second };
  }
  function tzOffsetMin(tz, ms) {
    const p = zoneParts(tz, ms);
    const asUTC = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
    return Math.round((asUTC - Math.floor(ms / 1000) * 1000) / 60000);
  }
  function zonedToUtc(tz, y, mo, d, h, mi) {
    const naive = Date.UTC(y, mo - 1, d, h, mi);
    let guess = naive;
    for (let i = 0; i < 3; i++) guess = naive - tzOffsetMin(tz, guess) * 60000;
    return guess;
  }
  function validZone(tz) { try { zoneParts(tz, 0); return true; } catch (e) { return false; } }

  return {
    VERSION: '0.4', D2R, R2D, OBLIQUITY, MOUSE, TIGER, RABBIT, HORSE, ROOSTER, mod,
    solar, sunVector, sunState, halfDayArc,
    PRESETS, validateGer, roofSlant, netMax, layout, trace, toNet, traceCentre, apertureBoundary, patch, sweep,
    declinationPath, hourLine, temporalLine, floorHourLine, sunEvents,
    clockHour, solarHour, directionHour, temporalHour,
    zoneParts, tzOffsetMin, zonedToUtc, validZone
  };
});
