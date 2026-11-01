"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const sound = require("./sound-transient.js");

test("pluck and kick are distinct bounded mathematical signals with decaying envelopes", () => {
  for (const kind of sound.KINDS) {
    const decay = kind === "pluck" ? 0.65 : 0.3;
    assert.equal(sound.sampleAt(kind, 0, 220, decay), 0);
    assert.ok(sound.envelope(kind, 0.01, decay) > sound.envelope(kind, 1, decay));
    assert.equal(sound.plottedEnvelope(kind, sound.duration(decay), decay), 0);
    const samples = sound.makeSamples(kind, 220, decay, 16000);
    assert.ok(samples.length > 10000);
    assert.ok(samples.every(sample => Number.isFinite(sample) && Math.abs(sample) <= 1));
    assert.ok(Math.abs(samples.at(-1)) < 0.001, "Output fades at the end");
  }
  assert.notEqual(sound.sampleAt("pluck", 0.012, 220, 0.65), sound.sampleAt("kick", 0.012, 220, 0.65));
});

test("kick frequency falls while string pitch stays controllable", () => {
  assert.ok(sound.kickFrequency(0) > sound.kickFrequency(0.05));
  assert.ok(sound.kickFrequency(0.05) > sound.kickFrequency(0.3));
  assert.ok(Math.abs(sound.kickFrequency(0.3) - 48) < 0.1);
  for (const hz of [110, 220, 440, 880]) {
    assert.ok(Math.abs(sound.sliderToHz(sound.hzToSlider(hz)) - hz) < 1e-7);
  }
});

test("invalid or unbounded transient recipes are rejected", () => {
  assert.throws(() => sound.makeSamples("other", 220, 0.5, 44100), RangeError);
  assert.throws(() => sound.makeSamples("pluck", 2000, 0.5, 44100), RangeError);
  assert.throws(() => sound.makeSamples("pluck", 220, 10, 44100), RangeError);
  assert.throws(() => sound.makeSamples("kick", 220, 0.3, 0), RangeError);
  assert.ok(sound.duration(sound.MAX_DECAY) <= 3);
});
