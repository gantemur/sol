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

test("membrane fundamentals depend on size and the square root of tension", () => {
  assert.equal(sound.kickFrequency(0), sound.kickFrequency(.3));
  assert.ok(Math.abs(sound.kickFrequency(0) - 112) < 0.1);
  assert.ok(Math.abs(sound.kickFrequency(0, "medium", 2) / sound.kickFrequency(0) - Math.sqrt(2)) < 1e-9);
  const modes = sound.drumModeFrequencies("medium");
  assert.equal(modes.length, 8);
  assert.ok(modes[1] > 1.5 * modes[0] && modes[1] < 1.7 * modes[0]);
  assert.ok(modes[2] > 2.1 * modes[0] && modes[2] < 2.2 * modes[0]);
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
  assert.throws(() => sound.makeSamples("kick", 220, .3, 44100, "medium", { drumTension: 3 }), RangeError);
  assert.throws(() => sound.makeSamples("pluck", 220, .3, 44100, "medium", { strumChord: "other" }), RangeError);
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

test("one strum reuses the same plotted and audible wave, with chord-specific spectra", () => {
  const options = { strumChord: "em", position: .22 };
  const rate = 16000;
  const buffer = sound.makeSamples("pluck", 220, .65, rate, "medium", options);
  for (const index of [100, 400, 1200, 4000]) {
    assert.ok(Math.abs(buffer[index] - sound.plottedSampleAt("pluck", index / rate,
      220, .65, "medium", options)) < 1e-6);
  }
  assert.notEqual(sound.sampleAt("pluck", .1, 220, .65, "medium", options),
    sound.sampleAt("pluck", .1, 220, .65));
});
