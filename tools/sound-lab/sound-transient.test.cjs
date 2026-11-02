"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const sound = require("./sound-transient.js");
const spectrum = require("./sound-spectrum.js");

test("pluck, kick and modeled piano are distinct bounded decaying mathematical signals", () => {
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
  assert.notEqual(sound.sampleAt("piano", 0.012, 220, 0.65), sound.sampleAt("pluck", 0.012, 220, 0.65));
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
  assert.throws(() => sound.makeSamples("piano", 2000, 0.5, 44100), RangeError);
  assert.throws(() => sound.makeSamples("pluck", 220, 10, 44100), RangeError);
  assert.throws(() => sound.makeSamples("kick", 220, 0.3, 0), RangeError);
  assert.throws(() => sound.makeSamples("kick", 220, 0.3, 44100, "giant"), RangeError);
  assert.ok(sound.duration(sound.MAX_DECAY) <= 3);
});

test("modeled piano overtones are slightly inharmonic, unlike an ideal string", () => {
  assert.ok(sound.pianoPartialHz(440, 2) > 880);
  assert.ok(sound.pianoPartialHz(440, 8) > 3520);
  assert.ok(sound.pianoPartialHz(440, 8) < 3600);
  assert.throws(() => sound.pianoPartialHz(0, 3), RangeError);
  const t = 0.013, sr = 16000;
  const samples = sound.makeSamples("piano", 440, .65, sr);
  assert.ok(Math.abs(samples[Math.round(t * sr)] -
    sound.plottedSampleAt("piano", t, 440, .65)) < 1e-6);
});

test("pluck and hammer share decay controls but have measurably different early harmonic spectra", () => {
  const pitchHz = 440, decaySec = .65;
  const at = kind => spectrum.spectrumAt(sound, { kind, pitchHz, decaySec }, .03);
  const pluck = at("pluck"), piano = at("piano");
  const partial = (result, n) => result.magnitudes[Math.round(n * pitchHz / result.binHz)];
  assert.ok(partial(piano, 2) / partial(piano, 1) >
    1.2 * partial(pluck, 2) / partial(pluck, 1),
  "Hammered preset has a stronger second partial relative to its fundamental");
  assert.ok(partial(piano, 3) > partial(pluck, 3) * 1.3,
    "The third partial is audibly more prominent early in the piano model");
  // Both notes freely vibrate after the hammer/pluck event; neither is simply
  // forced silent at an arbitrary fixed note duration.
  for (const kind of ["pluck", "piano"]) {
    let energy = 0;
    for (let i = 0; i < 480; i++) {
      const sample = sound.sampleAt(kind, .4 + i / 16000, pitchHz, decaySec);
      energy += sample * sample;
    }
    assert.ok(energy > .01, kind + " still vibrates long after the initial excitation");
  }
});

test("kick-size presets change pitch and preserve modeled waveform/sample agreement", () => {
  assert.deepEqual(Object.keys(sound.KICK_SIZES), ["large", "medium", "small"]);
  assert.ok(sound.kickFrequency(0.02, "large") < sound.kickFrequency(0.02, "medium"));
  assert.ok(sound.kickFrequency(0.02, "medium") < sound.kickFrequency(0.02, "small"));
  const sampleRate = 16000, t = 0.016;
  for (const size of Object.keys(sound.KICK_SIZES)) {
    const samples = sound.makeSamples("kick", 220, 0.3, sampleRate, size);
    assert.ok(Math.abs(samples[Math.round(t * sampleRate)] -
      sound.plottedSampleAt("kick", t, 220, 0.3, size)) < 1e-6);
  }
  assert.equal(sound.plottedSampleAt("pluck", 3, 220, 0.65), 0);
});
