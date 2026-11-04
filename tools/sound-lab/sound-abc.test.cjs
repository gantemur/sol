"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const abc = require("./sound-abc.js");
const score = require("./sound-score.js");
const temperaments = require("./sound-temperaments.js");
const { EXAMPLES } = require("./sound-compose.js");

const piece = (body, options = {}) => [
  "X:1", "T:A short piece", `M:${options.meter || "4/4"}`,
  `L:${options.unit || "1/4"}`, `Q:${options.tempo || "1/4=96"}`,
  `K:${options.key || "C"}`, body
].join("\n");

test("all Compose examples are valid measured single-part scores", () => {
  for (const [name, source] of Object.entries(EXAMPLES)) {
    const parsed = abc.parse(source);
    assert.equal(parsed.version, 1, name);
    assert.equal(parsed.parts.length, 1, name);
    assert.equal(parsed.bars.length, 4, name);
    assert.equal(parsed.totalBeats, name === "waltz" ? 12 : 16, name);
    assert.equal(parsed.parts[0].events[0].startBeat, 0, name);
    assert.equal(parsed.parts[0].events.at(-1).startBeat +
      parsed.parts[0].events.at(-1).durationBeats, parsed.totalBeats, name);
    assert.equal(score.validate(parsed), parsed);
  }
});

test("ABC note values, rests, split bars and double bars preserve exact timing", () => {
  const parsed = abc.parse(piece("C2 z D/ E/ | F G A B || c4 |]"));
  assert.deepEqual(parsed.parts[0].events.slice(0, 4).map(e =>
    [e.type, e.startBeat, e.durationBeats]), [
    ["note", 0, 2], ["rest", 2, 1], ["note", 3, .5], ["note", 3.5, .5]
  ]);
  assert.deepEqual(parsed.bars.map(b => b.startBeat), [0, 4, 8]);
  assert.equal(parsed.parts[0].events.at(-1).pitch.octave, 5);
  assert.equal(parsed.totalBeats, 12);
});

test("key signatures, explicit accidentals and octave markings are spelled, not flattened", () => {
  const parsed = abc.parse(piece("F ^F F =F | F _F F2 | C, C' c, c' | B4 |]", { key: "G" }));
  const pitches = parsed.parts[0].events.map(e => score.pitchName(e.pitch));
  assert.deepEqual(pitches, ["F♯4", "F♯4", "F♯4", "F4", "F♯4", "F♭4",
    "F♭4", "C3", "C5", "C4", "C6", "B4"]);
  assert.equal(parsed.key.fifths, 1);
  assert.equal(abc.parse(piece("B4 |]", { key: "Bb" })).parts[0].events[0].pitch.accidental, -1);
  assert.equal(abc.parse(piece("F4 |]", { key: "Em" })).parts[0].events[0].pitch.accidental, 1);
});

test("tempo units and meter denominators use quarter-beat timing", () => {
  const compound = abc.parse(piece("C3 D3 | E6 |]", {
    meter: "6/8", unit: "1/8", tempo: "1/8=144" }));
  assert.equal(compound.meter.quarterBeats, 3);
  assert.equal(compound.tempoQuarter, 72);
  assert.deepEqual(compound.parts[0].events.map(e => e.durationBeats), [1.5, 1.5, 3]);
  assert.equal(compound.totalBeats * score.secondsPerBeat(compound), 5);
});

test("different tunings change frequencies while preserving equal-temperature A4", () => {
  const a4 = { letter: "A", accidental: 0, octave: 4 };
  assert.equal(score.frequency(a4, "equal"), 440);
  for (const tuning of score.TUNINGS) {
    const a = score.frequency(a4, tuning, 440, temperaments);
    assert.ok(a > 435 && a < 445);
  }
  const e4 = { letter: "E", accidental: 0, octave: 4 };
  assert.notEqual(score.frequency(e4, "equal"),
    score.frequency(e4, "just", 440, temperaments));
  const c4 = { letter: "C", accidental: 0, octave: 4 };
  assert.ok(Math.abs(score.frequency({ ...c4, octave: 5 }, "pythagorean", 440, temperaments) /
    score.frequency(c4, "pythagorean", 440, temperaments) - 2) < 1e-12);
});

test("C1 parser rejects unsupported notation and visibly detects rhythm errors", () => {
  const invalid = [
    piece("C D E |]"), // incomplete non-final bar only? final partial allowed, so use non-final
    piece("C2 D | C4 |]"),
    piece("C D E F | [CE]2 |]"),
    piece("C D E F |: C4 :|"),
    piece("C D E F | (3CDE C |]"),
    piece("C D E F | C4 |]", { key: "H" }),
    piece("C D E F | C4 |]", { tempo: "1/4=600" }),
    piece("C D E F | C4 |]", { unit: "1/5" }),
    piece("C D E F | C4 |]", { meter: "27/4" }),
    piece("C D E F | C4 |]", { key: "C" }) + "\nC",
    piece("C D E F | C4 |]", { key: "C" }).replace("K:C", "K:C\nK:G")
  ];
  // A single final pickup/partial bar is permitted; check it explicitly.
  assert.equal(abc.parse(invalid.shift()).bars[0].partial, true);
  for (const source of invalid) assert.throws(() => abc.parse(source), abc.ABCError);
  assert.throws(() => abc.parse(piece("C8 |]")), /Bar 1 has 8 quarter beats/);
  assert.throws(() => abc.parse(piece("C D E F | C4 |]".repeat(17))), abc.ABCError);
  assert.throws(() => abc.parse(" ".repeat(8193)), abc.ABCError);
});
