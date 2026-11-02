"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const motion = require("./sound-motion.js");

test("theremin pad maps horizontal position logarithmically and vertical position to volume", () => {
  assert.equal(motion.padHz(0), 120);
  assert.equal(motion.padHz(1), 1600);
  assert.ok(Math.abs(motion.padHz(0.5) - Math.sqrt(120 * 1600)) < 1e-9);
  assert.ok(Math.abs(motion.padFraction(440) - Math.log(440 / 120) / Math.log(1600 / 120)) < 1e-12);
  assert.equal(motion.padLevel(0), 1);
  assert.equal(motion.padLevel(1), 0);
  assert.equal(motion.padLevel(0.25), 0.75);
  assert.equal(motion.padHz(-1), 120);
  assert.equal(motion.padHz(2), 1600);
});

test("two-tone siren alternates, while sweep continuously rises and falls", () => {
  const recipe = { lowHz: 440, highHz: 880, rate: 1, pattern: "two-tone" };
  assert.equal(motion.sirenHzAt(0, recipe), 440);
  assert.equal(motion.sirenHzAt(0.49, recipe), 440);
  assert.equal(motion.sirenHzAt(0.50, recipe), 880);
  assert.equal(motion.sirenHzAt(0.99, recipe), 880);
  assert.equal(motion.sirenHzAt(1, recipe), 440);
  recipe.pattern = "sweep";
  assert.equal(motion.sirenHzAt(0, recipe), 440);
  assert.equal(motion.sirenHzAt(0.25, recipe), 660);
  assert.equal(motion.sirenHzAt(0.5, recipe), 880);
  assert.equal(motion.sirenHzAt(0.75, recipe), 660);
  assert.equal(motion.sirenHzAt(1, recipe), 440);
});

test("moving-pitch recipes reject invalid sound parameters", () => {
  assert.throws(() => motion.padHz(NaN), RangeError);
  assert.throws(() => motion.padLevel(Infinity), RangeError);
  assert.throws(() => motion.padFraction(0), RangeError);
  const recipe = { lowHz: 440, highHz: 880, rate: 0.8, pattern: "sweep" };
  for (const bad of [
    { ...recipe, lowHz: 10 }, { ...recipe, highHz: 5000 },
    { ...recipe, highHz: 445 }, { ...recipe, rate: 0.1 },
    { ...recipe, rate: 4 }, { ...recipe, pattern: "noise" }
  ]) assert.throws(() => motion.sirenHzAt(0.1, bad), RangeError);
  assert.throws(() => motion.sirenHzAt(-0.01, recipe), RangeError);
});
