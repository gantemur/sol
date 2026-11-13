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

  // Map an interior point to the drawing plane ("net"). Floor and roof are
  // shown in plan (as seen from above, roof transparent), so rho is the
  // horizontal distance from the centre; the wall is folded outward around
  // the floor (rho = R + height). Compass direction is preserved everywhere.
  // The map is continuous across the floor/wall edge but not across the
  // eave (roof plan edge at R, wall head at R + wallH).
  function toNet(hit, g) {
    const [x, y, z] = hit.p;
    const r = Math.hypot(x, y);
    const az = Math.atan2(x, y);               // radians, clockwise from north
    let rho;
    if (hit.surf === 'wall') rho = g.R + Math.max(0, Math.min(g.wallH, z));
    else rho = Math.min(r, g.R);
    return { rho, az, surf: hit.surf };
  }

  // Trace from the toono centre (the "nodus"); returns a net point or null.
  function traceCentre(s, g) {
    const hit = trace([0, 0, g.toonoH], [-s[0], -s[1], -s[2]], g);
    return hit ? toNet(hit, g) : null;
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

  // Net radius of the edge between surface a and its neighbour b.
  function edgeRadius(a, b, g) { return (a === 'wall' && b === 'roof') ? g.R + g.wallH : g.R; }
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
  function patch(s, g, mode = 'full', doorAz = 180) {
    if (!(s[2] > 1e-6)) return null;
    const d = [-s[0], -s[1], -s[2]];
    const B = apertureBoundary(g, mode, doorAz);
    const at = (x, y) => trace([x, y, g.toonoH], d, g);
    const hits = B.map(([x, y]) => at(x, y));
    if (hits.some(h => !h)) return null;
    const n = B.length, seq = [];
    for (let i = 0; i < n; i++) {
      const a = hits[i], b = hits[(i + 1) % n];
      seq.push({ surf: a.surf, net: toNet(a, g) });
      if (a.surf !== b.surf) {
        const [x0, y0] = B[i], [x1, y1] = B[(i + 1) % n];
        let lo = 0, hi = 1, hlo = a, hhi = b;
        for (let k = 0; k < 40; k++) {
          const m = (lo + hi) / 2, h = at(x0 + (x1 - x0) * m, y0 + (y1 - y0) * m);
          if (h && h.surf === a.surf) { lo = m; hlo = h; } else if (h) { hi = m; hhi = h; } else break;
        }
        seq.push({ surf: a.surf, net: toNet(hlo, g), exitTo: hhi.surf });
        seq.push({ surf: hhi.surf, net: toNet(hhi, g), enterFrom: a.surf });
      }
    }
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
        pts.push(...edgeArc(a0.az, a1.az, edgeRadius(surf, r.exitTo, g), surf));
      });
      if (pts.length > 2) polys.push({ surf, pts });
    }
    return polys.length ? polys : null;
  }

  // ---------------------------------------------------- Overlay curves ---
  // Polylines are arrays of net points; visibility breaks start new lines.
  function sweep(samples, fn) {
    const lines = []; let cur = [];
    for (const v of samples) {
      const p = fn(v);
      if (p && cur.length) {
        const q = cur[cur.length - 1];
        if (q.surf !== p.surf && (q.surf === 'roof' || p.surf === 'roof')) { lines.push(cur); cur = []; }
      }
      if (p) cur.push(p); else if (cur.length) { lines.push(cur); cur = []; }
    }
    if (cur.length) lines.push(cur);
    return lines.filter(l => l.length > 1);
  }
  const range = (a, b, step) => { const out = []; for (let v = a; v <= b + 1e-9; v += step) out.push(v); return out; };

  // Path of the patch centre over a day at fixed declination.
  function declinationPath(lat, decl, g) {
    const phi = lat * D2R;
    return sweep(range(-180, 180, 0.5), H => {
      const s = sunVector(phi, H * D2R, decl);
      return s[2] > 1e-6 ? traceCentre(s, g) : null;
    });
  }

  // Fixed hour line for hour angle H (deg) over the whole year: the
  // intersection of the hour plane through the toono with the interior.
  function hourLine(lat, Hdeg, g) {
    const phi = lat * D2R;
    return sweep(range(-OBLIQUITY, OBLIQUITY, 0.25), dd => {
      const s = sunVector(phi, Hdeg * D2R, dd * D2R);
      return s[2] > 1e-6 ? traceCentre(s, g) : null;
    });
  }

  // Temporal (unequal) hour line: boundary j (1..5) of the six daylight
  // double hours that start at sunrise (geometric horizon).
  function temporalLine(lat, j, g) {
    const phi = lat * D2R;
    return sweep(range(-OBLIQUITY, OBLIQUITY, 0.25), dd => {
      const H0 = halfDayArc(lat, dd * D2R, 0);
      if (H0 === null) return null;
      const s = sunVector(phi, -H0 + j * H0 / 3, dd * D2R);
      return s[2] > 1e-6 ? traceCentre(s, g) : null;
    });
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
    VERSION: '0.1', D2R, R2D, OBLIQUITY, MOUSE, TIGER, RABBIT, HORSE, ROOSTER, mod,
    solar, sunVector, sunState, halfDayArc,
    PRESETS, validateGer, roofSlant, netMax, trace, toNet, traceCentre, apertureBoundary, patch, sweep,
    declinationPath, hourLine, temporalLine,
    clockHour, solarHour, directionHour, temporalHour,
    zoneParts, tzOffsetMin, zonedToUtc, validZone
  };
});
