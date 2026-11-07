/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";
const assert = require("node:assert/strict");
const Engine = require("../engine.js");

const exactOptions = {
  // Do not let the older assignment search conceal an incomplete or wrong DP.
  exactMaxPieces: 1,
  dpMaxStates: 100000,
  dpMaxPatterns: 4000,
  dpMaxPatternNodes: 100000,
  dpMaxTransitions: 2000000,
  dpTimeLimitMs: 600
};

function job(stockLength, pieces, kerf = 0) {
  return Engine.validateJob({
    stockLength, unit: "mm", kerf, diameter: 12,
    items: pieces.map(([length, quantity]) => ({ length, quantity }))
  });
}

function physicalCuts(data, sum, count) {
  // Independent of Engine.fits(): an uncut final end saves one blade-width.
  return sum + (count - 1) * data.kerf === data.stockLength ? count - 1 : count;
}

function checkPlan(data, plan) {
  const totals = data.items.map(() => 0);
  let bars = 0, products = 0, offcuts = 0, bladeLoss = 0, cuts = 0;
  for (const pattern of plan.patterns) {
    assert.ok(Number.isSafeInteger(pattern.repeats) && pattern.repeats > 0);
    assert.equal(pattern.counts.length, data.items.length);
    let sum = 0, count = 0;
    pattern.counts.forEach((quantity, i) => {
      assert.ok(Number.isSafeInteger(quantity) && quantity >= 0);
      totals[i] += quantity * pattern.repeats;
      sum += quantity * data.items[i].length;
      count += quantity;
    });
    assert.ok(count > 0);
    const neededCuts = physicalCuts(data, sum, count);
    const remaining = data.stockLength - sum - neededCuts * data.kerf;
    assert.ok(Number.isSafeInteger(remaining) && remaining >= 0);
    assert.equal(pattern.pieceLength, sum);
    assert.equal(pattern.pieceCount, count);
    assert.equal(pattern.cuts, neededCuts);
    assert.equal(pattern.offcut, remaining);
    assert.equal(pattern.kerfLoss, neededCuts * data.kerf);
    assert.equal(sum + pattern.offcut + pattern.kerfLoss, data.stockLength);
    bars += pattern.repeats;
    products += sum * pattern.repeats;
    offcuts += remaining * pattern.repeats;
    bladeLoss += neededCuts * data.kerf * pattern.repeats;
    cuts += neededCuts * pattern.repeats;
  }
  assert.deepEqual(totals, data.items.map((item) => item.quantity));
  assert.equal(products, data.totalLength);
  assert.equal(plan.pieceCount, data.totalCount);
  assert.equal(plan.stockCount, bars);
  assert.equal(plan.offcutTotal, offcuts);
  assert.equal(plan.kerfTotal, bladeLoss);
  assert.equal(plan.cutsTotal, cuts);
  assert.equal(plan.waste, offcuts + bladeLoss);
  assert.equal(plan.waste, bars * data.stockLength - products);
}

function checkResult(data, result) {
  checkPlan(data, result.best);
  checkPlan(data, result.greedy);
  assert.ok(result.best.stockCount <= result.greedy.stockCount);
  assert.ok(result.lowerBound <= result.best.stockCount);
  assert.ok(result.dp && typeof result.dp === "object");
  assert.ok(result.dp.stateCount === null || Number.isSafeInteger(result.dp.stateCount));
  for (const key of ["statesVisited", "patterns", "patternNodes", "transitions"]) {
    assert.ok(Number.isSafeInteger(result.dp[key]) && result.dp[key] >= 0, key);
  }
  if (result.optimal) {
    assert.ok(["length-bound", "count-dp", "branch-and-bound"].includes(result.proof));
  } else {
    assert.equal(result.proof, null);
  }
  if (result.proof === "count-dp") assert.equal(result.dp.status, "completed");
  if (result.dp.status === "completed") assert.equal(result.optimal, true);
}

function solveExact(data, extraOptions = {}) {
  const result = Engine.solve(data, Object.assign({}, exactOptions, extraOptions));
  checkResult(data, result);
  return result;
}

function partitionMinimum(data) {
  // Exhaustive labelled-subset oracle, separate from the production count states,
  // pattern enumeration, mixed-radix indexing, pruning and feasibility helper.
  const lengths = data.items.flatMap((item) => Array(item.quantity).fill(item.length));
  assert.ok(lengths.length <= 10);
  const size = 1 << lengths.length;
  const sums = new Array(size).fill(0);
  const counts = new Uint8Array(size);
  const feasible = new Uint8Array(size);
  const best = new Uint8Array(size);
  for (let mask = 1; mask < size; mask++) {
    const bit = mask & -mask;
    const i = 31 - Math.clz32(bit);
    sums[mask] = sums[mask ^ bit] + lengths[i];
    counts[mask] = counts[mask ^ bit] + 1;
    const cutCount = physicalCuts(data, sums[mask], counts[mask]);
    feasible[mask] = sums[mask] + cutCount * data.kerf <= data.stockLength ? 1 : 0;
    best[mask] = lengths.length;
    for (let subset = mask; subset; subset = (subset - 1) & mask) {
      if (!(subset & bit) || !feasible[subset]) continue;
      best[mask] = Math.min(best[mask], 1 + best[mask ^ subset]);
    }
  }
  return best[size - 1];
}

// A tight bound is a proof even with DP disabled; it should avoid needless work.
{
  const data = job(10, [[5, 2]]);
  const result = solveExact(data, { dpMaxStates: 0 });
  assert.equal(result.best.stockCount, 1);
  assert.equal(result.proof, "length-bound");
  assert.equal(result.optimal, true);
  assert.equal(result.dp.status, "not-needed");
  assert.equal(result.dp.statesVisited, 0);
  assert.equal(result.dp.patternNodes, 0);
}

// The volume bound is not tight: each rod holds at most two 4 mm pieces.
// There are more than 26 individual pieces, but only 28 count states.
for (const kerf of [0, 1]) {
  const data = job(10, [[4, 27]], kerf);
  const result = solveExact(data);
  assert.equal(result.best.stockCount, 14);
  assert.equal(result.lowerBound, 11);
  assert.equal(result.dp.stateCount, 28);
  assert.equal(result.dp.status, "completed");
  assert.equal(result.proof, "count-dp");
  assert.equal(result.optimal, true);
  assert.equal(result.best.patterns.length, 2);
}

// More than 26 pieces; all five old packing heuristics use 12 rods.
// Eleven suffice: 7*(12+11+2), 3*(12+11), 1*(12+12).
// The positive-kerf version needs the saved final cut on the seven triple rods.
for (const [stockLength, kerf] of [[25, 0], [25.2, 0.1]]) {
  const data = job(stockLength, [[12, 12], [11, 10], [2, 7]], kerf);
  const baseline = solveExact(data, { dpMaxStates: 0 });
  assert.equal(baseline.best.stockCount, 12);
  assert.equal(baseline.optimal, false);
  const result = solveExact(data);
  assert.equal(data.totalCount, 29);
  assert.equal(result.dp.stateCount, 1144);
  assert.equal(result.dp.status, "completed");
  assert.equal(result.best.stockCount, 11);
  assert.equal(result.optimal, true);
  if (kerf) {
    assert.ok(result.best.patterns.some((pattern) =>
      pattern.pieceCount === 3 && pattern.offcut === 0 && pattern.cuts === 2));
  }
}

// A 37-piece improvement whose optimality cannot follow from the length bound.
// Valid item weights 1/2,1/2,1/4 give total weight 15.5 and at most 1 per rod,
// proving a lower bound of 16. A 16-rod plan exists; the old heuristics use 17.
{
  const data = job(27, [[12, 11], [10, 14], [8, 12]]);
  const baseline = solveExact(data, { dpMaxStates: 0 });
  assert.equal(baseline.best.stockCount, 17);
  const result = solveExact(data);
  assert.equal(result.lowerBound, 14);
  assert.equal(result.best.stockCount, 16);
  assert.equal(result.dp.status, "completed");
  assert.equal(result.proof, "count-dp");
}

// Exact output is compared with a labelled-subset oracle over decimal lengths,
// duplicate demand rows, and zero/nonzero kerf. Branch-and-bound is disabled.
let certifiedByDP = 0;
for (let seed = 1; seed <= 180; seed++) {
  let state = seed;
  const random = (mod) => { state = state * 48271 % 2147483647; return state % mod; };
  const capacity = 80 + random(71);
  const kerfTicks = [0, 1, 5, 10, 20][seed % 5];
  const types = Array.from({ length: 2 + random(4) }, () => 1 + random(capacity - kerfTicks));
  const pieces = Array.from({ length: 5 + random(5) }, () => [types[random(types.length)] / 10, 1]);
  const data = job(capacity / 10, pieces, kerfTicks / 10);
  const result = solveExact(data);
  assert.equal(result.best.stockCount, partitionMinimum(data), "seed=" + seed);
  assert.equal(result.optimal, true, "seed=" + seed);
  if (result.proof === "count-dp") certifiedByDP++;
}
assert.ok(certifiedByDP > 0, "The independent oracle must exercise completed DP, not only the length bound");

// A truncated pattern set must never certify the heuristic incumbent. These
// orders cannot use the small assignment-search fallback or the length proof.
{
  const data = job(10, [[4, 27]]);
  const budgets = [
    [{ dpMaxStates: 0 }, "disabled"],
    [{ dpMaxStates: 27 }, "state-limit"],
    [{ dpMaxPatterns: 1 }, "pattern-limit"],
    [{ dpMaxPatterns: 0 }, "pattern-limit"],
    [{ dpMaxPatternNodes: 1 }, "pattern-node-limit"],
    [{ dpMaxPatternNodes: 0 }, "pattern-node-limit"],
    [{ dpMaxTransitions: 1 }, "transition-limit"],
    [{ dpMaxTransitions: 0 }, "transition-limit"],
    [{ dpTimeLimitMs: 0 }, "time-limit"]
  ];
  for (const [options, status] of budgets) {
    const result = solveExact(data, options);
    assert.equal(result.dp.status, status, JSON.stringify(options));
    assert.equal(result.best.stockCount, 14);
    assert.equal(result.optimal, false, JSON.stringify(options));
    assert.equal(result.proof, null);
  }
}

// The old small-case exact search remains available after DP is skipped.
{
  const data = job(10, [[6, 1], [5, 1], [3, 1], [2, 3]]);
  const complete = solveExact(data, { dpMaxStates: 0, exactMaxPieces: 26 });
  assert.equal(complete.dp.status, "disabled");
  assert.equal(complete.best.stockCount, 2);
  assert.equal(complete.optimal, true);
  assert.ok(complete.nodes > 0);
  const stopped = solveExact(data, { dpMaxStates: 0, exactMaxPieces: 26, nodeLimit: 1 });
  assert.equal(stopped.best.stockCount, 3);
  assert.equal(stopped.optimal, false);
  assert.equal(stopped.proof, null);
}

// A completed DP may contain more than 65535 rods: counters must not wrap, and
// reconstruction must not recurse once per rod or emit 70000 separate patterns.
{
  const data = job(10, [[6, 70000]]);
  const result = solveExact(data);
  assert.equal(result.dp.stateCount, 70001);
  assert.equal(result.dp.status, "completed");
  assert.equal(result.best.stockCount, 70000);
  assert.equal(result.best.patterns.length, 1);
  assert.equal(result.best.patterns[0].repeats, 70000);
  assert.equal(result.proof, "count-dp");
}

// Orders exceeding the state budget retain a valid grouped plan, without
// expanding one million identical pieces or allocating an enormous state grid.
{
  const data = job(10, [[6, 1000000]]);
  const result = solveExact(data);
  assert.equal(result.dp.status, "state-limit");
  assert.equal(result.best.stockCount, 1000000);
  assert.equal(result.best.patterns.length, 1);
  assert.equal(result.best.patterns[0].repeats, 1000000);
  assert.equal(result.optimal, false);
}

// Mixed-radix state products can exceed safe integer precision (2^60 here).
// The estimate must decline safely instead of using a rounded array length.
{
  const data = job(10000, Array.from({ length: 60 }, (_, i) => [6000 + i, 1]));
  const result = solveExact(data);
  assert.equal(result.dp.status, "state-limit");
  assert.equal(result.best.stockCount, 60);
  assert.equal(result.optimal, false);
}

console.log("Armatur count DP: exact/oracle, repeated-size, kerf, budget and grouping tests passed");
