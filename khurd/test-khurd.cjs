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

// The hidden scroll (khurd app, docs/model.md): every syllable is written, in
// order, and a drum's count is the whole mantras its scroll has been given.
{
  const M = E.SYLLABLE_TEXT;
  eq(M.join(""), "ཨོཾམཎིཔདྨེཧཱུྃ", "the six syllables in Unicode");
  const sc = E.createScroll();
  eq(E.scrollLastWritten(sc), "", "nothing written yet");
  const seen = [];
  for (let i = 1; i <= 14; i += 1) { E.scrollMove(sc, i); seen.push(E.scrollLastWritten(sc)); }
  eq(seen.join(" "), M.concat(M, ["ཨོཾ", "མ"]).join(" "), "forward writes every syllable in reading order");
  eq(E.scrollMantras(sc), 2, "a mantra counts once ཧཱུྃ is written");

  const big = E.createScroll();
  E.scrollMove(big, 600000);
  eq(E.scrollMantras(big), 100000, "one long move: 100,000 mantras");
  eq(E.scrollLastWritten(big), "ཧཱུྃ", "ending on ཧཱུྃ");
  E.scrollMove(big, 600004);
  eq(E.scrollLastWritten(big), "པ", "ཨོཾ མ ཎི པ of the next");
  eq(E.scrollMantras(big), 100000, "a mantra under way is not counted");

  const back = E.createScroll();
  const seenBack = [];
  for (let i = -1; i >= -19; i -= 1) { E.scrollMove(back, i); seenBack.push(E.scrollLastWritten(back)); }
  const rev = M.slice().reverse();
  eq(seenBack.join(" "), rev.concat(rev, rev, ["ཧཱུྃ"]).join(" "), "backward writes in reverse order");
  eq(E.scrollMantras(back), -3, "subtract mode counts down, toward zero");

  // The target matches the counting rule for any accumulator and size.
  for (const n of E.SCROLL_SIZES) {
    for (const acc of [0, 0.3, 1, TAU / 3, TAU, 7.77 * TAU, -0.2, -TAU / 2, -3.3 * TAU]) {
      const tg = E.scrollTarget(acc, n);
      eq(Math.trunc(tg / 6) + 0, E.maniFor(acc, n), "target / 6 = count, acc " + acc + ", N " + n);
      ok(Math.abs(tg - 6 * E.maniFor(acc, n)) <= 5, "at most five syllables under way");
    }
  }

  // Driven through real turning, the written count equals the counting rule,
  // drum by drum, and banking keeps it so.
  for (const n of E.SCROLL_SIZES) {
    const wheels = [E.createWheel("subtract"), E.createWheel("subtract"), E.createWheel("subtract")];
    let banked = { turns: 0n, mani: 0n };
    const steps = [0.7, 1.3, -0.4, 2.9, 0.05, -1.7, 3.3];
    for (let r = 0; r < 40; r += 1) {
      wheels.forEach((w, i) => { E.rotate(w, steps[(r + i) % steps.length] * (i + 1)); E.syncScroll(w, n); });
      if (r % 13 === 12) banked = E.bankWholeTurns(banked, wheels, n);
      const a = E.writtenTotals(banked, wheels);
      const b = E.totals(banked, wheels, n);
      ok(a.mani === b.mani && a.turns === b.turns, "written = counted, N " + n + ", round " + r);
    }
    const third = [E.createWheel("ratchet"), E.createWheel("ratchet"), E.createWheel("ratchet")];
    third.forEach((w) => { E.rotate(w, TAU / 3); E.syncScroll(w, 1); });
    eq(E.writtenTotals({ turns: 0n, mani: 0n }, third).mani, 0n, "three thirds on three drums write no whole mantra");
    eq(third.map((w) => E.scrollLastWritten(w.scroll)).join(" "), "མ མ མ", "each drum wrote ཨོཾ and མ");
    const bk = E.bank({ turns: 0n, mani: 0n }, wheels, n);
    ok(wheels.every((w) => w.scroll.position === 0 && w.acc === 0), "a size change restarts every scroll");
    ok(typeof bk.mani === "bigint", "bank returns BigInt totals");
  }

  // Cost: at the speed limit, three drums of бум write 14.4 million syllables a
  // second; this must run well faster than real time.
  const drums = [E.createWheel("ratchet"), E.createWheel("ratchet"), E.createWheel("ratchet")];
  const t0 = Date.now();
  for (let f = 0; f < 60; f += 1) {
    for (const w of drums) { E.rotate(w, E.PHYSICS.maxOmega / 60); E.syncScroll(w, 1e5); }
  }
  const ms = Date.now() - t0;
  const written = drums.reduce((a, w) => a + w.scroll.position, 0);
  ok(written >= 14.4e6 - 6, "one second at the speed limit writes 14.4 million syllables (" + written + ")");
  ok(ms < 1000, "and takes less than a second (" + ms + " ms)");
}

// Milestones (khurd app, docs/model.md): ranks by mani, a symbol per power of
// ten, beads for the leading digit.
{
  for (const t of [0n, 1n, 99n]) {
    const m = E.milestone(t);
    ok(m.power === 2 && m.digit === 0 && E.milestoneSymbol(m) === 0, "below 100: the Three Jewels, no bead");
    eq(E.milestoneWords(m), null, "below 100: no words");
    eq(E.nextBead(m), 100n, "next bead at 100");
  }
  const m = E.milestone(347210n);
  ok(m.power === 5 && m.digit === 3, "owner's example: 347,210 is 3 beads at 10⁵");
  eq(E.milestoneSymbol(m), 3, "the treasure vase on бум");
  eq(E.milestoneValue(m), 300000n, "value 300,000");
  eq(E.nextBead(m), 400000n, "next bead 400,000");
  eq(E.nextSymbol(m), 1000000n, "next symbol 1,000,000");
  const w = E.milestoneWords(m);
  ok(w.count === 3n && w.name === "бум" && w.attributive === "буман", "3 буман");
  const ranks = [[100n, 0, "зуун"], [1000n, 1, "мянган"], [10000n, 2, "түмэн"], [100000n, 3, "буман"],
    [1000000n, 4, "сая"], [10n ** 7n, 5, "живаа"], [10n ** 8n, 6, "дүнчүүр"], [10n ** 9n, 7, "тэрбум"], [10n ** 10n, 8, "их тэрбум"]];
  for (const [total, symbol, word] of ranks) {
    const r = E.milestone(total);
    eq(E.milestoneSymbol(r), symbol, "symbol for " + total);
    eq(E.milestoneWords(r).attributive, word, "word for " + total);
    eq(E.milestoneRings(r), 0, "no ring up to 10¹⁰");
  }
  eq(E.milestone(999n).digit, 9, "999 lights nine beads");
  eq(E.milestone(9999999n).digit, 9, "9,999,999 lights nine beads");
  const r11 = E.milestone(10n ** 11n);
  ok(E.milestoneSymbol(r11) === 8 && E.milestoneRings(r11) === 1, "10¹¹: the wheel with one ring");
  eq(E.milestoneWords(r11).count, 10n, "10¹¹ is 10 их тэрбум");
  eq(E.symbolThreshold(0), 0n, "the Three Jewels from 0");
  eq(E.symbolThreshold(1), 1000n, "the parasol from мянга");
  eq(E.symbolThreshold(8), 10n ** 10n, "the wheel from их тэрбум");
  eq(E.milestoneCrossing(E.milestone(99999n), E.milestone(100000n)), "symbol", "into a new symbol");
  eq(E.milestoneCrossing(E.milestone(100000n), E.milestone(200000n)), "bead", "a new bead");
  eq(E.milestoneCrossing(E.milestone(200000n), E.milestone(150000n)), null, "lower: nothing");
  eq(E.milestoneCrossing(E.milestone(200000n), E.milestone(250000n)), null, "same bead: nothing");
}

console.log("khurd engine: " + checks + " checks passed.");
