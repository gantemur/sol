/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 * Run: node khurd/test-khurd.cjs */
"use strict";
const assert = require("node:assert/strict");
const E = require("./engine.js");
const { TAU } = E;
const zero = () => ({ turns: 0n, mani: 0n });
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks += 1; };
const eq = (a, b, msg) => { assert.equal(a, b, msg); checks += 1; };

// Ratchet: backward rotation is refused but produces a visible recoil.
{
  const w = E.createWheel("ratchet");
  eq(E.rotate(w, -1), 0, "ratchet refuses backward rotation");
  eq(w.acc, 0, "ratchet keeps the count");
  ok(w.recoil < 0, "ratchet recoils");
  for (let i = 0; i < 200; i += 1) E.step(w, 1 / 60);
  eq(w.recoil, 0, "recoil settles");
  E.drag(w, -0.5, 1 / 60);
  eq(w.omega, 0, "backward drag gives no speed under the ratchet");
  E.push(w, -10);
  eq(w.omega, 0, "backward push is refused under the ratchet");
}

// Subtract mode: backward turns count negatively, truncated toward zero.
{
  const w = E.createWheel("subtract");
  E.rotate(w, -0.1);
  eq(E.truncTurns(w.acc), 0, "small backward nudge is not -1");
  E.rotate(w, -1.5 * TAU + 0.1);
  eq(E.truncTurns(w.acc), -1, "one and a half turns back is -1");
  eq(E.maniFor(w.acc, 108), -162, "mani counts backward too");
  ok(w.angle >= 0 && w.angle < TAU, "display angle stays wrapped");
}

// Mani: one full turn reads exactly N mantras for every offered scroll size.
for (const n of E.SCROLL_SIZES) {
  eq(E.maniFor(TAU, n), n, "one turn = N mantras for N=" + n);
  eq(E.maniFor(TAU * 0.5, n), Math.trunc(n / 2), "half turn for N=" + n);
  eq(E.bandShift(TAU, n), n, "band moves N mantra widths per turn for N=" + n);
}
{
  // Many small steps that add up to whole turns.
  const w = E.createWheel("ratchet");
  for (let i = 0; i < 3600; i += 1) E.rotate(w, TAU / 360);
  eq(E.truncTurns(w.acc), 10, "3600 steps of one degree = 10 turns");
  eq(E.maniFor(w.acc, 108), 1080, "10 turns of 108 = 1080");
}

// Coasting: monotone, finite, bounded by the speed limit.
{
  const w = E.createWheel("ratchet");
  for (let i = 0; i < 10; i += 1) E.drag(w, 0.4, 1 / 60);
  ok(w.omega > 10, "drag velocity estimate is positive and sizable");
  E.release(w);
  let prev = w.omega;
  let t = 0;
  let turned = 0;
  while (E.isMoving(w) && t < 120) {
    turned += E.step(w, 1 / 60);
    ok(w.omega <= prev && w.omega >= 0, "speed decreases monotonically");
    prev = w.omega;
    t += 1 / 60;
  }
  ok(t < 30, "the wheel comes to rest in finite time (" + t.toFixed(1) + " s)");
  ok(turned > TAU, "a flick coasts more than one turn");
  E.drag(w, 1e6, 1 / 60);
  ok(w.omega <= E.PHYSICS.maxOmega + 1e-9, "speed is clamped");
}

// Holding stops the wheel.
{
  const w = E.createWheel("ratchet");
  E.push(w, 20);
  for (let i = 0; i < 30; i += 1) E.hold(w, 1 / 60);
  eq(w.omega, 0, "a held wheel stops");
}

// Banking keeps the totals exact and continues counting seamlessly.
for (const n of E.SCROLL_SIZES) {
  const wheels = [E.createWheel("subtract"), E.createWheel("subtract")];
  E.rotate(wheels[0], 1234.3712345678 * TAU);
  E.rotate(wheels[1], -56.8123456789 * TAU);
  const before = E.totals(zero(), wheels, n);
  const banked = E.bankWholeTurns(zero(), wheels, n);
  const after = E.totals(banked, wheels, n);
  eq(after.turns, before.turns, "whole-turn bank keeps turns, N=" + n);
  eq(after.mani, before.mani, "whole-turn bank keeps mani, N=" + n);
  ok(Math.abs(wheels[0].acc) < TAU && Math.abs(wheels[1].acc) < TAU, "partial turns remain");
}
{
  const wheels = [E.createWheel("ratchet")];
  E.rotate(wheels[0], 2.5 * TAU);
  const banked = E.bank(zero(), wheels, 1000);
  eq(banked.turns, 2n, "scroll-change bank keeps whole turns");
  eq(banked.mani, 2500n, "scroll-change bank keeps mantras read with the old scroll");
  eq(wheels[0].acc, 0, "accumulator restarts");
  E.rotate(wheels[0], TAU);
  eq(E.totals(banked, wheels, 108).mani, 2608n, "new scroll size counts from the bank");
}
{
  const wheels = [E.createWheel("ratchet")];
  E.rotate(wheels[0], 999 * TAU);
  ok(!E.needsBank(wheels), "no bank needed below threshold");
  E.rotate(wheels[0], 2 * TAU);
  ok(E.needsBank(wheels), "bank needed above threshold");
}

// Invalid input is ignored rather than corrupting the state.
{
  const w = E.createWheel("ratchet");
  E.rotate(w, NaN);
  E.rotate(w, Infinity);
  eq(w.acc, 0, "non-finite rotations are ignored");
  eq(E.step(w, -1), 0, "negative time step does nothing");
}

// Stage layout: the side view fits about 250 px per drum, up to six; the top
// view a row of wheels with slots at least 0.9 × the height, never more than
// the side view would show.
{
  eq(E.sideCount(390), 1, "phone portrait: one drum from the side");
  eq(E.sideCount(844), 3, "phone landscape: three drums from the side");
  eq(E.sideCount(3000), 6, "at most six drums");
  eq(E.topCount(390, 390), 1, "phone portrait: one wheel from above");
  eq(E.topCount(844, 250), 3, "short landscape stage: three wheels from above");
  eq(E.topCount(844, 330), 2, "taller landscape stage: two wheels from above");
  eq(E.topCount(960, 640), 1, "desktop stage: one wheel from above");
  eq(E.topCount(500, 100), 2, "never more than the side view would show");
  for (const [v, w, h] of [["side", 844, 300], ["top", 844, 250], ["top", 390, 390]]) {
    const L = E.stageLayout(v, w, h);
    const d = L.drums;
    ok(d.length >= 1, "layout has drums: " + v);
    for (let i = 0; i < d.length; i += 1) {
      ok(d[i].cx - d[i].R >= 0 && d[i].cx + d[i].R <= L.w + 1e-9, "drum inside the stage: " + v);
      if (i > 0) ok(d[i].cx - d[i - 1].cx >= 2 * d[i].R, "drums do not overlap: " + v);
    }
  }
  eq(E.stageLayout("top", 844, 250, 1).drums.length, 1, "a held count is kept");
}

console.log("khurd engine: " + checks + " checks passed.");
