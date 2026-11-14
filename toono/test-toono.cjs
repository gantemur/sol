// SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
// SPDX-License-Identifier: MIT
// Numerical checks for the toono engine. Run: node toono/test-toono.cjs
'use strict';
const E = require('./engine.js');
let fails = 0;
function check(name, cond, info = '') {
  if (cond) console.log('PASS', name);
  else { fails++; console.log('FAIL', name, info); }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const g = E.PRESETS[5];
const UB = { lat: 47.92, lon: 106.92, tz: 'Asia/Ulaanbaatar' };

// --- Solar position against standard references -------------------------
{
  const s = E.solar(Date.UTC(2026, 10, 3, 4));            // EoT maximum early November
  check('EoT about +16.4 min on 3 Nov', near(s.eot, 16.4, 0.4), s.eot);
  const f = E.solar(Date.UTC(2026, 1, 11, 4));
  check('EoT about -14.2 min on 11 Feb', near(f.eot, -14.2, 0.4), f.eot);
  const j = E.solar(Date.UTC(2026, 5, 21, 4));
  check('June solstice declination +23.44', near(j.decl * E.R2D, 23.44, 0.05), j.decl * E.R2D);
  const m = E.solar(Date.UTC(2026, 2, 20, 14, 46));        // 2026 March equinox 14:46 UTC
  check('March equinox declination ~0', near(m.decl * E.R2D, 0, 0.02), m.decl * E.R2D);
}
// Solar noon in Ulaanbaatar on 1 Nov 2026 about 12:36 local (UTC+8).
{
  let best = null;
  for (let mi = 0; mi < 240; mi++) {
    const ms = Date.UTC(2026, 10, 1, 3, mi);
    const st = E.sunState(ms, UB.lat, UB.lon);
    if (!best || st.alt > best.alt) best = { alt: st.alt, ms };
  }
  const p = E.zoneParts(UB.tz, best.ms);
  check('UB solar noon 1 Nov at 12:36 +-1 min', p.h === 12 && near(p.mi, 36, 1), `${p.h}:${p.mi}`);
}

// --- Ray tracing --------------------------------------------------------
{
  const hit = E.trace([0.3, -0.2, g.toonoH], [0, 0, -1], g);
  check('zenith sun hits floor directly below', hit && hit.surf === 'floor' &&
    near(hit.p[0], 0.3, 1e-9) && near(hit.p[1], -0.2, 1e-9) && near(hit.p[2], 0, 1e-9));
  // Sun due south at 45 deg: ray from the toono centre goes north and down.
  const s = [0, -Math.SQRT1_2, Math.SQRT1_2];               // vector toward Sun (south, up)
  const c = E.trace([0, 0, g.toonoH], [-s[0], -s[1], -s[2]], g);
  check('45 deg south sun lights the floor north of centre at distance toonoH',
    c && c.surf === 'floor' && near(c.p[1], g.toonoH, 1e-9) && near(c.p[0], 0, 1e-9));
  // Low sun: light lands on the roof (uni) opposite the Sun.
  const alt = 5 * E.D2R;
  const sl = [Math.cos(alt), 0, Math.sin(alt)];              // Sun low in the east
  const r = E.trace([0, 0, g.toonoH], [-sl[0], -sl[1], -sl[2]], g);
  check('5 deg sun in the east lights the western roof', r && r.surf === 'roof' && r.p[0] < 0);
  const roofSlope = Math.atan((g.toonoH - g.wallH) / (g.R - g.toonoR)) * E.R2D;
  const sw = [Math.cos(30 * E.D2R), 0, Math.sin(30 * E.D2R)];
  const w = E.trace([0, 0, g.toonoH], [-sw[0], -sw[1], -sw[2]], g);
  check(`30 deg sun (roof slope ${roofSlope.toFixed(1)} deg) reaches wall or floor`, w && w.surf !== 'roof');
}

// --- Net map continuity -------------------------------------------------
{
  const floorEdge = E.toNet({ surf: 'floor', p: [0, g.R, 0] }, g);
  const wallFoot = E.toNet({ surf: 'wall', p: [0, g.R, 0] }, g);
  const wallHead = E.toNet({ surf: 'wall', p: [g.R, 0, g.wallH] }, g);
  const eave = E.toNet({ surf: 'roof', p: [g.R, 0, g.wallH] }, g);
  const rim = E.toNet({ surf: 'roof', p: [g.toonoR, 0, g.toonoH] }, g);
  check('net continuous at floor/wall edge', near(floorEdge.rho, wallFoot.rho, 1e-12));
  check('wall head at outer net radius', near(wallHead.rho, E.netMax(g), 1e-12));
  check('roof shown in plan: eave at R, rim at toono radius', near(eave.rho, g.R, 1e-12) && near(rim.rho, g.toonoR, 1e-12));
}

// --- Toono-centred layout is continuous and encodes solar altitude -------
{
  const L = E.layout(g, 'toono');
  const at = (surf, p) => E.toNet({ surf, p }, g, 'toono').rho;
  check('toono view continuous at wall foot', near(at('floor', [0, g.R, 0]), at('wall', [0, g.R, 0]), 1e-12));
  check('toono view continuous at eave', near(at('wall', [g.R, 0, g.wallH]), at('roof', [g.R, 0, g.wallH]), 1e-12));
  check('toono rim at 90 deg', near(at('roof', [g.toonoR, 0, g.toonoH]), Math.PI / 2, 1e-9) && near(L.max, Math.PI / 2, 1e-12));
  const alt = 35 * E.D2R, sv = [0, -Math.cos(alt), Math.sin(alt)];
  const c = E.traceCentre(sv, g, 'toono');
  check('toono view: patch centre at 90 deg - altitude', c && near(c.rho, Math.PI / 2 - alt, 1e-9));
  const low = E.sunState(Date.UTC(2026, 2, 20, 1, 0), UB.lat, UB.lon);
  const lp = E.patch(low.s, g, 'full', 180, 'toono');
  check('toono view: split patch is one polygon', lp && lp.length === 1 && lp[0].surf === 'mixed');
}

// --- Noon patch on the north axis (khoimor) -----------------------------
{
  for (const day of [Date.UTC(2026, 5, 21), Date.UTC(2026, 2, 20), Date.UTC(2026, 11, 21)]) {
    let best = null;
    for (let mi = 0; mi < 360; mi++) {
      const st = E.sunState(day + (2 * 60 + mi) * 60000, UB.lat, UB.lon);
      if (!best || st.alt > best.alt) best = st;
    }
    const p = E.traceCentre(best.s, g);
    check(`noon patch centre due north (${new Date(day).toISOString().slice(0, 10)})`,
      p && Math.abs(p.az * E.R2D) < 0.5, p && p.az * E.R2D);
  }
}

// --- Equal-hour lines on the floor pass through the polar-axis foot ------
{
  const phi = UB.lat * E.D2R;
  const F = [0, -g.toonoH / Math.tan(phi)];                  // south of centre
  for (const H of [-30, 30, 60]) {
    const pts = [];
    for (const dd of [-10, 0, 15]) {
      const s = E.sunVector(phi, H * E.D2R, dd * E.D2R);
      const hit = E.trace([0, 0, g.toonoH], [-s[0], -s[1], -s[2]], g);
      if (hit && hit.surf === 'floor') pts.push(hit.p);
    }
    if (pts.length >= 2) {
      const [a, b] = pts;
      const cross = (a[0] - F[0]) * (b[1] - F[1]) - (a[1] - F[1]) * (b[0] - F[0]);
      check(`hour line H=${H} on floor is straight through polar foot`, near(cross, 0, 1e-9), cross);
    }
  }
}

// --- Floor-only sundial lines and edge-exact paths ---------------------
{
  const phi = UB.lat * E.D2R, Fy = -g.toonoH / Math.tan(phi);
  const fl = E.floorHourLine(UB.lat, -30, g);
  check('floor hour line starts at polar foot (inside floor)', fl && fl.footOnFloor && near(fl.full[0][1], Fy, 1e-9) && near(fl.full[0][0], 0, 1e-9));
  check('floor hour line ends on floor edge', fl && near(Math.hypot(...fl.full[1]), g.R, 1e-9));
  const noon = E.floorHourLine(UB.lat, 0, g);
  check('noon floor line runs north along the meridian', noon && near(noon.full[1][0], 0, 1e-9) && noon.full[1][1] > 0);
  // Whole sundial lines: from the foot over the floor, up the wall to the
  // wall head in the plan view, and on over the uni to the toono rim in the
  // toono view.
  for (const H of [-30, 0, 45]) {
    const pl = E.sundialLine(UB.lat, H, g, 'plan', true), pts = pl.flat();
    const far = Math.max(...pts.map(p => p.rho)), near0 = pts[0].rho;
    check(`plan sundial line ${H}° runs from the foot to the wall head`, pts.length && pts.every(p => p.surf !== 'roof') &&
      near(far, g.R + g.wallH, 1e-3) && near(near0, Math.abs(Fy), 2e-2) && near(Math.abs(pts[0].az), Math.PI, 2e-2), [near0, far]);
    const tv = E.sundialLine(UB.lat, H, g, 'toono').flat(), surfs = new Set(tv.map(p => p.surf));
    const rim = Math.max(...tv.map(p => p.rho)) * E.R2D;
    check(`toono-view sundial line ${H}° covers floor, wall and uni up to the rim`, surfs.has('floor') && surfs.has('wall') && surfs.has('roof') && rim > 88, rim);
  }
  // Today's path in plan view reaches the eave (rho = R) before jumping to the wall.
  const start = E.zonedToUtc(UB.tz, 2026, 7, 6, 0, 0), mins = []; for (let m = 0; m <= 1440; m += 3) mins.push(m);
  const path = E.sweep(mins, m => { const st = E.sunState(start + m * 60000, UB.lat, UB.lon); return st.alt > 0 ? E.traceCentre(st.s, g, 'plan') : null; });
  const roofEnds = path.filter(l => l[0].surf === 'roof').map(l => Math.max(l[0].rho, l[l.length - 1].rho));
  check('plan-view jumps come with eave-to-wall-head links', path.links.length >= 2 &&
    path.links.every(([a, b]) => { const r = [a.rho, b.rho].sort((x, y) => x - y); return near(r[0], g.R, 1e-3) && near(r[1], g.R + g.wallH, 1e-3); }), path.links.map(l => l.map(x => x.rho)));
  check('plan-view path on the uni runs to the eave', roofEnds.length && roofEnds.every(r => near(r, g.R, 1e-3)), roofEnds);
  const ev = E.sunEvents(E.zonedToUtc(UB.tz, 2026, 3, 20, 0, 0), UB.lat, UB.lon);
  const rp = E.zoneParts(UB.tz, ev.rise), sp = E.zoneParts(UB.tz, ev.set);
  check('UB equinox geometric sunrise ~07:02, sunset ~19:00', rp.h === 7 && rp.mi <= 6 && (sp.h === 18 && sp.mi >= 54 || sp.h === 19 && sp.mi <= 2), `${rp.h}:${rp.mi} ${sp.h}:${sp.mi}`);
}

// --- Hour systems -------------------------------------------------------
{
  check(':40 clock 11:40 is Horse', E.clockHour(11 * 60 + 40) === E.HORSE);
  check(':40 clock 11:39 is Snake', E.clockHour(11 * 60 + 39) === 5);
  check(':40 clock 23:40 is Mouse', E.clockHour(23 * 60 + 40) === E.MOUSE);
  check(':40 clock 00:30 is Mouse', E.clockHour(30) === E.MOUSE);
  check('true solar noon is Horse', E.solarHour(12 * 60) === E.HORSE);
  check('true solar 11:00 starts Horse', E.solarHour(11 * 60) === E.HORSE && E.solarHour(10 * 60 + 59) === 5);
  check('Sun due east is Rabbit (direction)', E.directionHour(90) === E.RABBIT);
  check('Sun due south is Horse (direction)', E.directionHour(180) === E.HORSE);
  check('azimuth 75 is the Tiger/Rabbit boundary', E.directionHour(74.9) === E.TIGER && E.directionHour(75) === E.RABBIT);
  check('rotated ger shifts sectors', E.directionHour(135, -45) === E.HORSE);
  const d0 = 0, H0 = E.halfDayArc(UB.lat, d0, 0);
  check('temporal: just after sunrise is Rabbit', E.temporalHour(UB.lat, d0, -H0 + 1e-6) === E.RABBIT);
  check('temporal: noon starts Horse', E.temporalHour(UB.lat, d0, 1e-9) === E.HORSE);
  check('temporal: just after sunset is Rooster', E.temporalHour(UB.lat, d0, H0 + 1e-6) === E.ROOSTER);
  check('temporal: midnight starts Mouse', E.temporalHour(UB.lat, d0, Math.PI - 1e-9) === 11 ||
    E.temporalHour(UB.lat, d0, Math.PI + 1e-9) === E.MOUSE);
  check('temporal: polar night returns null', E.temporalHour(80, -20 * E.D2R, 0) === null);
}

// --- Time zones ----------------------------------------------------------
{
  const ms = E.zonedToUtc(UB.tz, 2026, 3, 20, 12, 0);
  check('UB local noon = 04:00 UTC', ms === Date.UTC(2026, 2, 20, 4, 0));
  const tor = E.zonedToUtc('America/Toronto', 2026, 7, 1, 12, 0);
  check('Toronto summer noon = 16:00 UTC (DST)', tor === Date.UTC(2026, 6, 1, 16, 0));
}

// --- Patch sanity --------------------------------------------------------
{
  const st = E.sunState(Date.UTC(2026, 5, 21, 4, 50), UB.lat, UB.lon);
  const p = E.patch(st.s, g, 'full', 180);
  check('summer noon patch is one floor polygon', p && p.length === 1 && p[0].surf === 'floor' && p[0].pts.length > 100);
  const half = E.patch(st.s, g, 'half', 180);
  check('half-open urkh patch exists', half && half[0].pts.length > 50);
  // Low morning sun: patch split between roof and wall, each closed along the eave.
  const lowSun = E.sunState(Date.UTC(2026, 2, 20, 1, 0), UB.lat, UB.lon);     // 09:00 UB, alt ~19
  const lp = E.patch(lowSun.s, g, 'full', 180);
  const surfs = lp ? lp.map(q => q.surf).sort().join(',') : '';
  check(`low-sun patch split across surfaces (${surfs}, alt ${lowSun.alt.toFixed(1)})`, lp && lp.length >= 2 && surfs.includes('roof'));
  // Area of the floor patch at zenith equals the toono disk area (parallel beam).
  const zen = E.patch([0, 0, 1], g, 'full', 180);
  const area = q => { let a = 0; const pts = q.pts.map(n => [n.rho * Math.sin(n.az), n.rho * Math.cos(n.az)]);
    for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length]; a += x0 * y1 - x1 * y0; } return Math.abs(a) / 2; };
  check('zenith patch area equals toono area', zen && near(area(zen[0]), Math.PI * (g.toonoR * 0.999) ** 2, 1e-3), zen && area(zen[0]));
  const night = E.sunState(Date.UTC(2026, 5, 21, 16), UB.lat, UB.lon);
  check('no patch at night', E.patch(night.s, g) === null);
  check('preset geometry valid', Object.values(E.PRESETS).every(p => E.validateGer(p).length === 0));
}

console.log(fails ? `\n${fails} FAILED` : '\nAll toono checks passed');
process.exit(fails ? 1 : 0);
