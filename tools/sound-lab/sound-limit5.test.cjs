"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const m = require("./sound-limit5.js");

test("five-limit lattice preserves rational pitches after octave folding", () => {
  const cases = [
    [[0, 0], [1, 1]], [[1, 0], [3, 2]], [[0, 1], [5, 4]],
    [[-1, 0], [4, 3]], [[2, 0], [9, 8]], [[4, 0], [81, 64]],
    [[-2, 1], [10, 9]], [[-1, 1], [5, 3]], [[1, 1], [15, 8]]
  ];
  for (const [[a, b], [p, q]] of cases) {
    const note = m.point(a, b);
    assert.equal(note.numerator, p);
    assert.equal(note.denominator, q);
    assert.ok(note.ratio >= 1 && note.ratio < 2);
  }
  assert.equal(m.lattice().length, 28);
  assert.throws(() => m.point(5, 0), RangeError);
  assert.throws(() => m.point(0, 0, 500), RangeError);
});

test("pure major/minor chords and G major/D minor use consistent ratio voicing", () => {
  for (const [preset, expected] of [
    ["major", [1, 5 / 4, 3 / 2]],
    ["minor", [1, 6 / 5, 3 / 2]],
    ["gmajor", [1, 5 / 4, 3 / 2]],
    ["dminor", [1, 6 / 5, 3 / 2]]
  ]) {
    const notes = m.chordVoicing(m.PRESETS[preset]);
    const root = notes[0].hz;
    assert.deepEqual(notes.map(note => Math.round(note.hz / root * 100000)),
      expected.map(ratio => Math.round(ratio * 100000)));
  }
  assert.deepEqual(m.selected(m.PRESETS.seven).map(note => note.numerator + "/" + note.denominator),
    ["1/1", "9/8", "5/4", "4/3", "3/2", "5/3", "15/8"]);
  assert.throws(() => m.selected([[0, 0], [0, 0]]), RangeError);
});

test("both routes E and D give exactly 81/80 syntonic comma", () => {
  assert.ok(Math.abs(m.COMMA_CENTS - 21.50628959671478) < 1e-10);
  for (const which of ["e", "d"]) {
    const pair = m.comparison(which);
    assert.ok(Math.abs(pair.ratio - 81 / 80) < 1e-12);
    assert.ok(Math.abs(pair.cents - m.COMMA_CENTS) < 1e-10);
    assert.equal(pair.just.tetStep, pair.pyth.tetStep);
    assert.ok(pair.just.hz < pair.pyth.hz);
  }
  assert.equal(m.comparison("e").beatHz, 3.4375);
  assert.ok(Math.abs(m.comparison("d").beatHz - 3.05555555556) < 1e-8);
});

test("5-limit playback is silent until explicitly generated and bounded", () => {
  const notes = m.selected(m.PRESETS.major);
  const melody = m.makeSamples(notes, 16000, "melody");
  const chord = m.makeSamples(m.chordVoicing(m.PRESETS.major), 16000, "chord");
  const comma = m.makeComparisonSamples("e", 220, 16000);
  assert.equal(melody.length, Math.ceil(notes.length * m.STEP_SECONDS * 16000));
  assert.equal(chord.length, Math.ceil(m.CHORD_SECONDS * 16000));
  assert.equal(comma.length, Math.ceil(m.COMPARE_SECONDS * 16000));
  for (const samples of [melody, chord, comma]) {
    assert.equal(samples[0], 0);
    assert.ok(samples.some(value => Math.abs(value) > 0.02));
    assert.ok(samples.every(value => Number.isFinite(value) && Math.abs(value) <= 1));
  }
  assert.throws(() => m.makeSamples(notes, 4000), RangeError);
});
