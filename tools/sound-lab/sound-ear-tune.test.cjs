"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const model = require("./sound-ear-tune.js");

test("single interval exercises start mistuned and can be adjusted to exact 3:2 and 5:4", () => {
  for (const taskId of ["fifth", "third"]) {
    const before = model.step({ taskId });
    assert.ok(Math.abs(before.errorCents) >= 16);
    assert.ok(before.nearBeatHz > 1);
    const exact = model.step({ taskId, adjustment: -model.OFFSETS[taskId][0] });
    assert.ok(Math.abs(exact.errorCents) < 1e-12);
    assert.ok(Math.abs(exact.nearBeatHz) < 1e-9);
    assert.ok(Math.abs(exact.highHz / exact.lowHz - model.TASKS[taskId].ratio) < 1e-12);
    assert.equal(model.rating(exact.errorCents), "excellent");
  }
});

test("two fifths travel outside the C octave, then fold from 9/4 to 9/8", () => {
  const first = model.step({ taskId: "chain2", adjustment: 19 });
  const second = model.step({ taskId: "chain2", index: 1, lowHz: first.highHz, adjustment: -21 });
  assert.equal(first.shifts, 0);
  assert.equal(second.shifts, -1);
  assert.ok(Math.abs(second.highHz / model.START_HZ - 9 / 4) < 1e-12);
  assert.ok(Math.abs(second.foldedHz / model.START_HZ - 9 / 8) < 1e-12);
  assert.equal(second.highHz / second.foldedHz, 2);
  assert.equal(model.foldOctave(model.START_HZ / 3).shifts, 2);
});

test("three fifths create 27/16 A4 and errors accumulate through the chain", () => {
  const offsets = [20, -17, 15];
  let lowHz = model.START_HZ;
  const history = [];
  for (let i = 0; i < 3; i++) {
    const data = model.step({ taskId: "chain3", index: i, lowHz, adjustment: -offsets[i] });
    history.push(data);
    lowHz = data.foldedHz;
  }
  assert.ok(Math.abs(lowHz / model.START_HZ - 27 / 16) < 1e-12);
  assert.equal(model.cumulativeCents(history), 0);
  const imperfect = [model.step({ taskId: "chain3", adjustment: -17 })]; // +3 cents
  imperfect.push(model.step({ taskId: "chain3", index: 1, lowHz: imperfect[0].highHz,
    adjustment: 12 })); // -5 cents
  const result = model.step({ taskId: "chain3", index: 2, lowHz: imperfect[1].foldedHz,
    adjustment: -8 }); // +7 cents
  assert.equal(model.cumulativeCents(imperfect, result.errorCents), 5);
  assert.ok(Math.abs(model.cents(result.foldedHz, model.START_HZ * 27 / 16) - 5) < 1e-9);
});

test("invalid practice steps and frequencies are rejected", () => {
  assert.throws(() => model.step({ taskId: "unknown" }), RangeError);
  assert.throws(() => model.step({ taskId: "chain2", index: 2 }), RangeError);
  assert.throws(() => model.step({ adjustment: NaN }), RangeError);
  assert.throws(() => model.foldOctave(0), RangeError);
});
