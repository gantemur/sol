"use strict";
const assert = require("node:assert/strict");
const Engine = require("../engine.js");
const Legacy = require("../legacy/armatur.js");

function job(stockLength, pieces, options) {
  return Engine.validateJob(Object.assign({
    stockLength, unit: "mm", kerf: 0, diameter: 12,
    items: pieces.map((piece) => ({ length: piece[0], quantity: piece[1] }))
  }, options || {}));
}
function checkPlan(jobData, plan) {
  const quantities = Array(jobData.items.length).fill(0);
  let barCount = 0, productTicks = 0, offcutTicks = 0, kerfTicks = 0;
  for (const pattern of plan.patterns) {
    assert.ok(Number.isSafeInteger(pattern.repeats) && pattern.repeats > 0);
    assert.equal(pattern.counts.length, jobData.items.length);
    let sum = 0, count = 0;
    for (let type = 0; type < pattern.counts.length; type++) {
      assert.ok(Number.isSafeInteger(pattern.counts[type]) && pattern.counts[type] >= 0);
      quantities[type] += pattern.counts[type] * pattern.repeats;
      sum += pattern.counts[type] * jobData.items[type].length;
      count += pattern.counts[type];
    }
    assert.ok(count > 0);
    assert.ok(Engine.fits(sum, count, jobData.stockLength, jobData.kerf));
    assert.equal(pattern.pieceCount, count);
    assert.equal(pattern.pieceLength, sum);
    assert.equal(pattern.kerfLoss, pattern.cuts * jobData.kerf);
    assert.equal(sum + pattern.kerfLoss + pattern.offcut, jobData.stockLength);
    assert.ok(pattern.offcut >= 0);
    productTicks += pattern.repeats * sum;
    offcutTicks += pattern.repeats * pattern.offcut;
    kerfTicks += pattern.repeats * pattern.kerfLoss;
    barCount += pattern.repeats;
  }
  assert.deepEqual(quantities, jobData.items.map((item) => item.quantity));
  assert.equal(productTicks, jobData.totalLength);
  assert.equal(plan.stockCount, barCount);
  assert.equal(plan.waste, offcutTicks + kerfTicks);
  assert.equal(plan.waste, barCount * jobData.stockLength - productTicks);
}

function bruteMinimum(jobData) {
  // Independent set-partition DP, suitable only for the tiny test instances.
  const lengths = [];
  for (const item of jobData.items) {
    for (let i = 0; i < item.quantity; i++) lengths.push(item.length);
  }
  assert.ok(lengths.length <= 11);
  const full = (1 << lengths.length) - 1;
  const memo = new Map([[0, 0]]);
  function dp(mask) {
    if (memo.has(mask)) return memo.get(mask);
    const first = mask & -mask;
    let answer = lengths.length;
    for (let subset = mask; subset; subset = (subset - 1) & mask) {
      if (!(subset & first)) continue;
      let sum = 0, count = 0;
      for (let i = 0; i < lengths.length; i++) {
        if (subset & (1 << i)) { sum += lengths[i]; count++; }
      }
      if (!Engine.fits(sum, count, jobData.stockLength, jobData.kerf)) continue;
      answer = Math.min(answer, 1 + dp(mask ^ subset));
    }
    memo.set(mask, answer);
    return answer;
  }
  return dp(full);
}

// The original valid decimal input could run forever due to a positive residual.
{
  const data = job(.6, [[.1, 1], [.2, 1], [.3, 1]]);
  assert.equal(data.totalLength, data.stockLength);
  const greedy = Engine.greedyPlan(data);
  checkPlan(data, greedy);
  assert.equal(greedy.stockCount, 1);
  const old = Legacy.compute({
    stockLength: .6, unit: "mm", diameter: 12,
    items: [{ length: .1, quantity: 1 }, { length: .2, quantity: 1 }, { length: .3, quantity: 1 }]
  });
  assert.equal(old.stockCount, 1);
  assert.equal(old.waste, 0);
}

// Greedy 3 rods, optimal 2 rods (one 6+2+2, another 5+3+2).
{
  const data = job(10, [[2, 3], [3, 1], [5, 1], [6, 1]]);
  assert.equal(Engine.greedyPlan(data).stockCount, 3);
  const result = Engine.solve(data);
  assert.equal(result.best.stockCount, 2);
  assert.equal(result.lowerBound, 2);
  assert.equal(result.optimal, true);
  checkPlan(data, result.best);
}

// For a stock consumed exactly, no final sawcut is necessary.
{
  const data = job(1000, [[499.5, 2]], { kerf: 1 });
  const result = Engine.solve(data);
  assert.equal(result.best.stockCount, 1);
  assert.equal(result.best.patterns[0].cuts, 1);
  assert.equal(result.best.patterns[0].kerfLoss, 10);
  assert.equal(result.best.patterns[0].offcut, 0);
  checkPlan(data, result.best);
}

// If a non-exact offcut is shorter than the saw blade, the requested piece cannot be cut.
assert.throws(() => job(1000, [[999.5, 1]], { kerf: 1 }), /insufficient/);

// With stock entered in metres or millimetres, mass must be the same.
{
  const mm = job(6000, [[3000, 2]]);
  const metre = Engine.validateJob({
    stockLength: 6, unit: "m", diameter: 12, kerf: 0,
    items: [{ length: 3, quantity: 2 }]
  });
  assert.equal(Engine.greedyPlan(mm).massKg, 5.328);
  assert.equal(Engine.greedyPlan(metre).massKg, 5.328);
}

for (const bad of ["", 0, -1, "NaN", "Infinity", "1e100"]) {
  assert.throws(() => job(bad, [[1, 1]]));
}
assert.throws(() => job(10, [[5, 1.5]]), /whole number/);
assert.throws(() => job(10, [[11, 1]]), /exceeds/);
assert.throws(() => job(10, [[0, 1]]));
assert.throws(() => job(10, [[2, 0]]));
assert.throws(() => job(10, [[2, -2]]));
assert.throws(() => job(10, [[2, Infinity]]));
assert.throws(() => job(10, [[1.00001, 1]]), /precision/);
assert.throws(() => job(10, [[0.000000001, 1]]), /precision/);
assert.throws(() => job(10, [[5, 1]], { kerf: 0.000000001 }), /precision/);

// Big quantities remain grouped; no expansion into thousands of bar diagrams.
{
  const data = job(6000, [[600, 10000]]);
  const result = Engine.solve(data);
  assert.equal(result.best.stockCount, 1000);
  assert.equal(result.best.patterns.length, 1);
  assert.equal(result.best.patterns[0].repeats, 1000);
  assert.equal(result.optimal, true);
  checkPlan(data, result.best);
}

// Compare the corrected legacy algorithm with the new baseline, without kerf.
for (let seed = 1; seed <= 40; seed++) {
  let state = seed;
  const random = (mod) => { state = (state * 16807) % 2147483647; return state % mod; };
  const pieces = [];
  for (let i = 0; i < 3; i++) pieces.push([1 + random(9), 1 + random(3)]);
  const data = job(10, pieces);
  const baseline = Engine.greedyPlan(data);
  const old = Legacy.compute({
    stockLength: 10, unit: "mm", diameter: 12,
    items: pieces.map(([length, quantity]) => ({ length, quantity }))
  });
  assert.equal(old.stockCount, baseline.stockCount);
  assert.equal(old.waste, baseline.waste);
  checkPlan(data, baseline);
}

// Exact search is checked against independent brute-force enumeration.
for (let seed = 1; seed <= 70; seed++) {
  let state = seed;
  const random = (mod) => { state = (state * 48271) % 2147483647; return state % mod; };
  const kerf = random(3) * .5;
  const pieces = [];
  for (let i = 0; i < 5 + random(4); i++) {
    // Values fit individually even with kerf; avoid floating-point arithmetic in reference.
    pieces.push([1 + random(7), 1]);
  }
  const data = job(10, pieces, { kerf });
  const result = Engine.solve(data, { nodeLimit: 1000000, timeLimitMs: 10000 });
  assert.equal(result.best.stockCount, bruteMinimum(data), "seed=" + seed);
  assert.equal(result.optimal, true, "seed=" + seed);
  checkPlan(data, result.best);
}

console.log("Armatur engine and corrected legacy: all tests passed");
