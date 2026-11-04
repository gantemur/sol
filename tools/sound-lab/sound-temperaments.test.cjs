"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const temp = require("./sound-temperaments.js");

function close(actual, expected, tolerance = 1e-7) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should equal ${expected}`);
}

test("all five systems close twelve fifths against exactly seven octaves", () => {
  assert.deepEqual(temp.SYSTEMS, ["equal", "pythagorean", "meantone", "werckmeister", "vallotti"]);
  for (const system of temp.SYSTEMS) {
    const fifths = temp.fifths(system);
    assert.equal(fifths.length, 12);
    close(fifths.reduce((sum, edge) => sum + edge.cents, 0), 8400);
    assert.deepEqual(fifths.map(edge => edge.from), temp.CIRCLE);
    for (const edge of fifths) {
      close(((temp.pitches(system)[temp.PITCH_CLASSES[(edge.index + 1) % 12]] -
        temp.pitches(system)[temp.PITCH_CLASSES[edge.index]] - edge.cents) % 1200 + 1200) % 1200, 0, 1e-6);
    }
  }
});

test("equal temperament has twelve 700-cent fifths, and A4=440 Hz in every system", () => {
  for (const edge of temp.fifths("equal")) close(edge.cents, 700);
  for (const system of temp.SYSTEMS) {
    close(temp.frequency(system, 9, 4), 440);
    close(temp.frequency(system, 9, 5), 880);
    close(temp.frequency(system, 9, 3), 220);
    close(temp.frequency(system, 0, 5) / temp.frequency(system, 0, 4), 2);
  }
});

test("Pythagorean and quarter-comma meantone place the wolf at G sharp to E flat", () => {
  const pyth = temp.fifths("pythagorean");
  const meantone = temp.fifths("meantone");
  for (const fifths of [pyth, meantone]) {
    assert.deepEqual(fifths.filter(edge => edge.wolf).map(edge => edge.from + "–" + edge.to), ["G♯–E♭"]);
    for (const edge of fifths.filter(edge => !edge.wolf)) assert.equal(edge.wolf, false);
  }
  for (let index = 0; index < 12; index++) {
    if (index === temp.WOLF_EDGE) continue;
    close(pyth[index].cents, temp.FIFTH_CENTS);
    close(meantone[index].cents, temp.FIFTH_CENTS - temp.SYNTONIC_COMMA / 4);
  }
  close(pyth[8].cents, temp.FIFTH_CENTS - temp.PYTHAGOREAN_COMMA);
  close(meantone[8].cents, 8400 - 11 * (temp.FIFTH_CENTS - temp.SYNTONIC_COMMA / 4));
  close(temp.chord("meantone", 0).thirdCents, temp.PURE_MAJOR_THIRD);
  assert.ok(temp.chord("meantone", 8).thirdCents > 420, "remote keys can have very different thirds");
});

test("Werckmeister III and Vallotti use distinct historically documented fifth allocations", () => {
  const werck = temp.fifths("werckmeister");
  const vallotti = temp.fifths("vallotti");
  assert.deepEqual(werck.filter(edge => edge.deviation < -.01).map(edge => edge.index), [0, 1, 2, 5]);
  assert.deepEqual(vallotti.filter(edge => edge.deviation < -.01).map(edge => edge.index), [0, 1, 2, 3, 4, 11]);
  for (const edge of werck) close(edge.cents, temp.FIFTH_CENTS -
    ([0, 1, 2, 5].includes(edge.index) ? temp.PYTHAGOREAN_COMMA / 4 : 0));
  for (const edge of vallotti) close(edge.cents, temp.FIFTH_CENTS -
    ([11, 0, 1, 2, 3, 4].includes(edge.index) ? temp.PYTHAGOREAN_COMMA / 6 : 0));
  assert.ok(werck.every(edge => !edge.wolf) && vallotti.every(edge => !edge.wolf));
});

test("major and minor chords transpose over octave boundaries and deviate from equal", () => {
  const major = temp.chord("equal", 11, "major");
  assert.deepEqual(major.notes.map(note => note.name), ["B4", "E♭5", "F♯5"]);
  close(major.thirdCents, 400);
  close(major.fifthCents, 700);
  for (const note of major.notes) close(note.deviation, 0);
  const minor = temp.chord("equal", 10, "minor");
  assert.deepEqual(minor.notes.map(note => note.name), ["B♭4", "C♯5", "F5"]);
  close(minor.thirdCents, 300);
  close(minor.fifthCents, 700);
  for (const system of temp.SYSTEMS.slice(1)) {
    assert.equal(temp.chord(system, 3, "minor").notes.length, 3);
    assert.ok(temp.deviations(system).some(note => Math.abs(note.centsFromEqual) > 0.01));
  }
});

test("invalid model input is rejected instead of silently producing NaN", () => {
  for (const system of ["unknown", "none", ""]) assert.throws(() => temp.widths(system), RangeError);
  for (const pc of [-1, 12, 1.25, NaN]) assert.throws(() => temp.frequency("equal", pc), RangeError);
  for (const octave of [1, 7, 4.5]) assert.throws(() => temp.frequency("equal", 0, octave), RangeError);
  for (const key of [-1, 12]) assert.throws(() => temp.chord("equal", key), RangeError);
  assert.throws(() => temp.chord("equal", 0, "seventh"), RangeError);
});
