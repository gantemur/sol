"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const guitar = require("./sound-string.js");

test("a feedback-plucked string is finite, pitched and decays", () => {
  for (const pitch of [110, 220, 440, 880]) {
    let early = 0, late = 0;
    for (let i = 0; i < 200; i++) {
      early += guitar.pluckAt(.05 + i / 48000, pitch, .65) ** 2;
      late += guitar.pluckAt(.5 + i / 48000, pitch, .65) ** 2;
    }
    assert.ok(early > late, "Vibrating string loses energy");
    assert.equal(guitar.pluckAt(0, pitch, .65), 0);
    assert.equal(guitar.pluckAt(3.1, pitch, .65), 0);
    for (let i = 1; i < 600; i++) {
      assert.ok(Math.abs(guitar.pluckAt(i / 48000, pitch, .65)) <= 1);
    }
  }
  assert.notEqual(guitar.pluckAt(.018, 220, .65, .12), guitar.pluckAt(.018, 220, .65, .45));
  assert.throws(() => guitar.pluckAt(.1, 40, .65), RangeError);
  assert.throws(() => guitar.pluckAt(.1, 220, .65, .65), RangeError);
});

test("strumming excites independently tuned and staggered strings", () => {
  assert.deepEqual(Object.keys(guitar.CHORDS), ["em", "g", "c"]);
  const em = guitar.chordFrequencies("em");
  assert.equal(em.length, 6);
  assert.ok(Math.abs(em[0] - 82.4069) < .01);
  assert.ok(Math.abs(em[5] - 329.6276) < .01);
  assert.equal(guitar.chordFrequencies("c")[0], null, "C chord mutes the low E string");
  // The first 10 ms of G and Em are the same low E string with different frets.
  assert.notEqual(guitar.strumAt(.008, "em", .65), guitar.strumAt(.008, "g", .65));
  assert.equal(guitar.strumAt(0, "em", .65), 0);
  assert.equal(guitar.strumAt(3.01, "em", .65), 0);
  const chord = ["em", "g", "c"].map(name => guitar.strumAt(.12, name, .65));
  assert.equal(new Set(chord).size, 3);
  for (const name of Object.keys(guitar.CHORDS)) {
    for (let i = 0; i < 1500; i += 7) {
      const value = guitar.strumAt(i / 48000, name, .65);
      assert.ok(Number.isFinite(value) && Math.abs(value) <= 1);
    }
  }
  assert.throws(() => guitar.chordFrequencies("wrong"), RangeError);
});
