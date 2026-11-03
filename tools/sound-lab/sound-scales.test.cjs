"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const scales = require("./sound-scales.js");

const close = (actual, expected, tolerance = 1e-7) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);

test("five exact fifths give the pentatonic classes, with a near-return at the sixth pitch", () => {
  const scale = scales.build();
  assert.equal(scale.count, 5);
  assert.deepEqual(scale.chain.map(n => n.k), [0, 1, 2, 3, 4]);
  assert.deepEqual(scale.notes.map(n => `${n.numerator}/${n.denominator}`),
    ["1/1", "9/8", "81/64", "3/2", "27/16"]);
  close(scale.closureCents, -90.2249956730628, 1e-5);
  close(scale.gaps.reduce((a, b) => a + b, 0), 1200);
  assert.equal(scale.gaps.filter(gap => gap > 250).length, 2);
});

test("one downward and five upward steps give a seven-note diatonic scale", () => {
  const scale = scales.build({ down: 1, up: 5 });
  assert.deepEqual(scale.chain.map(n => n.k), [-1, 0, 1, 2, 3, 4, 5]);
  assert.deepEqual(scale.notes.map(n => `${n.numerator}/${n.denominator}`),
    ["1/1", "9/8", "81/64", "4/3", "3/2", "27/16", "243/128"]);
  assert.equal(scale.gaps.filter(gap => gap < 100).length, 2);
  assert.equal(scale.gaps.filter(gap => gap > 190 && gap < 210).length, 5);
});

test("tonic changes the mode but never changes the generated pitch collection", () => {
  const major = scales.build({ down: 0, up: 4, tonicK: 0 });
  const minor = scales.build({ down: 0, up: 4, tonicK: 3 });
  assert.deepEqual(major.notes.map(note => note.hz), minor.notes.map(note => note.hz));
  close(major.tonicHz, 220);
  close(minor.tonicHz, 220 * 27 / 16);
  assert.deepEqual(minor.ordered.map(note => Math.round(note.relativeCents / 100)), [0, 3, 5, 7, 10]);
  close(minor.ordered[0].playingHz, minor.tonicHz);
});

test("up/down windows give five distinct modes relative to one fixed reference", () => {
  const patterns = ["0,2,4,7,9", "0,2,5,7,9", "0,2,5,7,10", "0,3,5,7,10", "0,3,5,8,10"];
  for (let down = 0; down < 5; down++) {
    const scale = scales.build({ down, up: 4 - down });
    assert.equal(scale.count, 5);
    const semitones = scale.ordered.map(note => Math.round(note.relativeCents / 100));
    assert.equal(semitones.join(","), patterns[down]);
  }
});

test("twelve consecutive fifths miss seven octaves by one Pythagorean comma", () => {
  const scale = scales.build({ down: 5, up: 6 });
  close(scale.closureCents, 23.460010384649, 1e-4);
  assert.equal(scale.octaveCount, 7);
  assert.equal(scale.count, 12);
  assert.equal(new Set(scale.notes.map(n => n.k)).size, 12);
});

test("scale melody starts and ends on the selected tonic and synthesizes bounded notes", () => {
  const scale = scales.build({ down: 1, up: 5, tonicK: -1 });
  const sequence = scales.melody(scale);
  const steps = scales.melodySteps(scale);
  assert.deepEqual(steps.map(note => note.hz), sequence);
  assert.equal(steps[0].k, scale.tonicK);
  assert.equal(steps[7].octaveUp, true);
  assert.equal(steps.at(-1).k, scale.tonicK);
  assert.equal(sequence.length, 15);
  close(sequence[0], scale.tonicHz);
  close(sequence[7], scale.tonicHz * 2);
  close(sequence.at(-1), scale.tonicHz);
  const audio = scales.makeSamples(scale, 22050);
  assert.equal(audio.length, Math.ceil(15 * scales.STEP_SECONDS * 22050));
  assert.equal(audio[0], 0);
  assert.ok(audio.every(sample => Math.abs(sample) <= 1));
  assert.ok(audio.some(sample => Math.abs(sample) > .5));
});

test("the spiral turn and adjacent Fourier partials come from exact fifths", () => {
  close(scales.FIFTH_TURN_DEGREES, 210.586500259, 1e-6);
  const scale = scales.build({ down: 3, up: 4 });
  for (let index = 0; index + 1 < scale.chain.length; index++) {
    // Unreduced frequencies ascend by a fifth; every adjacent pair shares 3f=2f'.
    const lower = (3 / 2) ** scale.chain[index].k;
    const higher = (3 / 2) ** scale.chain[index + 1].k;
    close(3 * lower, 2 * higher);
    const octavePosition = scale.chain[index].k * Math.log2(3 / 2);
    const angle = 360 * octavePosition;
    close((angle + scales.FIFTH_TURN_DEGREES) / 360,
      (scale.chain[index + 1].k) * Math.log2(3 / 2));
  }
});

test("invalid scale dimensions and pitches are rejected", () => {
  for (const options of [{ down: -1 }, { up: 12 }, { down: 6, up: 6 },
    { down: 1.5 }, { tonicK: -1 }, { tonicK: 6 }, { baseHz: Infinity },
    { baseHz: 109 }, { baseHz: 331 }]) {
    assert.throws(() => scales.build(options), RangeError);
  }
  assert.throws(() => scales.octaveFraction(12), RangeError);
  assert.throws(() => scales.makeSamples(scales.build(), 1000), RangeError);
});
