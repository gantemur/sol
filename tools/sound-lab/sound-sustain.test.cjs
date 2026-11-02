"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const sound = require("./sound-sustain.js");

test("held instrument recipes are valid and spectrally distinct", () => {
  assert.deepEqual(sound.KINDS, ["flute", "violin", "morin"]);
  for (const kind of sound.KINDS) {
    const defaults = sound.defaults(kind);
    sound.validate(kind, 220, defaults.attack, defaults.release);
    assert.equal(sound.partials(kind).length, 8);
    assert.ok(defaults.noise > 0 && defaults.noise < .04);
    let peak = 0;
    for (let n = 0; n < 2048; n++) {
      const sample = sound.waveAt(2 * Math.PI * n / 2048, kind);
      peak = Math.max(peak, Math.abs(sample));
    }
    if (kind === "flute") {
      assert.ok(peak > .7 && peak < 1, "default flute includes its actual breath-driven amplitude");
    } else assert.ok(peak > .98 && peak <= 1.001, kind + " plot must be peak normalized");
  }
  assert.ok(sound.partials("violin")[1] > sound.partials("flute")[1] * 3,
    "bowed violin has much stronger second harmonic than flute");
  assert.ok(sound.partials("morin")[1] > sound.partials("morin")[0],
    "stylized morin khuur no longer assumes odd harmonics must dominate");
  assert.ok(sound.partials("morin")[6] < sound.partials("violin")[6],
    "morin khuur illustration is darker in the upper harmonics");
  assert.notEqual(sound.waveAt(.43, "violin"), sound.waveAt(.43, "morin"));
});

test("flute jet model grows from silence, responds to blowing and respects the pitch range", () => {
  assert.equal(sound.fluteDrive(0), 0);
  assert.equal(sound.fluteNoiseGain(0), 0);
  assert.deepEqual(sound.partials("flute", 0), Array(8).fill(0));
  assert.equal(sound.waveAt(1.8, "flute", 0), 0);
  assert.equal(sound.fluteJetAt(0), 0);
  for (const breath of [10, 20, 40, 60, 80, 100]) {
    assert.ok(sound.fluteDrive(breath) > 0 && sound.fluteDrive(breath) <= .95);
    assert.ok(sound.fluteNoiseGain(breath) > 0 && sound.fluteNoiseGain(breath) < .03);
    const components = sound.fluteComponents(breath, 440);
    assert.equal(components.length, 8);
    const magnitudes = sound.partials("flute", breath, 440);
    assert.ok(magnitudes[0] > magnitudes[1] && magnitudes[1] > magnitudes[2],
      "a flute-like sound retains a dominant fundamental");
    for (let j = 0; j < 8; j++) {
      assert.ok(Math.abs(Math.hypot(components[j].sin, components[j].cos) - magnitudes[j]) < 1e-12);
    }
  }
  const gentle = sound.partials("flute", 20, 440);
  const strong = sound.partials("flute", 100, 440);
  assert.ok(strong[0] > gentle[0] * 2);
  assert.ok(strong[1] / strong[0] > 2.5 * gentle[1] / gentle[0],
    "blowing harder should increase relative upper-harmonic strength");
  assert.ok(sound.partials("flute", 100, 880)[4] < sound.partials("flute", 100, 220)[4],
    "the fixed air-column filter attenuates high-frequency partials");
  assert.throws(() => sound.fluteDrive(-1), RangeError);
  assert.throws(() => sound.fluteDrive(101), RangeError);
  assert.throws(() => sound.fluteJetAt(NaN), RangeError);
  assert.throws(() => sound.fluteComponents(60, 2000), RangeError);
});

test("flute's plotted periodic waveform has exactly its predicted harmonic magnitudes", () => {
  const count = 2048;
  for (const breath of [20, 60, 100]) {
    const components = sound.fluteComponents(breath, 440);
    const expected = sound.partials("flute", breath, 440);
    const samples = Array.from({ length: count }, (_, i) =>
      sound.fluteWaveFromComponents(2 * Math.PI * i / count, components));
    for (const harmonic of [1, 2, 3, 4, 5, 8]) {
      let sine = 0, cosine = 0;
      for (let i = 0; i < count; i++) {
        const angle = 2 * Math.PI * harmonic * i / count;
        sine += samples[i] * Math.sin(angle);
        cosine += samples[i] * Math.cos(angle);
      }
      const measured = 2 * Math.hypot(sine, cosine) / count;
      assert.ok(Math.abs(measured - expected[harmonic - 1]) < 1e-10,
        `breath ${breath}, harmonic ${harmonic}: ${measured} vs ${expected[harmonic - 1]}`);
    }
  }
});

test("flute spectral prediction agrees with an independently rendered jet and biquad signal", () => {
  // Verify the analytic phases/amplitudes against a sample-by-sample difference
  // equation, independently of fluteComponents and fluteWaveFromComponents.
  const sampleRate = 48000, hz = 440, count = 48000, window = 12000;
  function filter(input, type, cutoff) {
    const theta = 2 * Math.PI * cutoff / sampleRate;
    const c = Math.cos(theta), alpha = Math.sin(theta) / (2 * Math.SQRT1_2);
    const a0 = 1 + alpha, a1 = -2 * c, a2 = 1 - alpha;
    const b0 = (type === "highpass" ? 1 + c : 1 - c) / 2;
    const b1 = type === "highpass" ? -(1 + c) : 1 - c;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    const output = new Float64Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const x = input[i];
      const y = (b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2) / a0;
      output[i] = y;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
    }
    return output;
  }
  for (const breath of [20, 60, 100]) {
    const drive = sound.fluteDrive(breath);
    const jet = Float64Array.from({ length: count }, (_, i) =>
      sound.fluteJetAt(drive * Math.sin(2 * Math.PI * hz * i / sampleRate)));
    const hp = filter(jet, "highpass", sound.FLUTE_HIGHPASS);
    const output = filter(hp, "lowpass", sound.FLUTE_LOWPASS);
    const expected = sound.fluteComponents(breath, hz, sampleRate);
    for (const harmonic of [1, 2, 3, 5]) {
      let sine = 0, cosine = 0;
      for (let i = count - window; i < count; i++) {
        const theta = 2 * Math.PI * hz * harmonic * i / sampleRate;
        sine += output[i] * Math.sin(theta);
        cosine += output[i] * Math.cos(theta);
      }
      sine *= 2 * sound.FLUTE_TONE_GAIN / window;
      cosine *= 2 * sound.FLUTE_TONE_GAIN / window;
      assert.ok(Math.abs(sine - expected[harmonic - 1].sin) < 1e-5,
        `sine component ${harmonic} at blowing ${breath}`);
      assert.ok(Math.abs(cosine - expected[harmonic - 1].cos) < 1e-5,
        `cosine component ${harmonic} at blowing ${breath}`);
    }
  }
});

test("attack, sustain and release curve stays continuous and bounded", () => {
  const attack = .24, release = .48, hold = 1.2;
  assert.equal(sound.envelopeAt(0, attack, release, hold), 0);
  assert.ok(sound.envelopeAt(.06, attack, release, hold) > 0);
  assert.equal(sound.envelopeAt(attack, attack, release, hold), 1);
  assert.equal(sound.envelopeAt(hold - .01, attack, release, hold), 1);
  assert.equal(sound.envelopeAt(hold, attack, release, hold), 1);
  assert.equal(sound.envelopeAt(hold + release / 2, attack, release, hold), .5);
  assert.equal(sound.envelopeAt(hold + release, attack, release, hold), 0);
  assert.equal(sound.envelopeAt(hold + release + 1, attack, release, hold), 0);
  for (let t = 0; t <= 3; t += .005) {
    assert.ok(sound.envelopeAt(t, attack, release, hold) >= 0);
    assert.ok(sound.envelopeAt(t, attack, release, hold) <= 1);
  }
  const earlyRelease = .04;
  assert.equal(sound.envelopeAt(earlyRelease, attack, release, earlyRelease),
    sound.attackLevelAt(earlyRelease, attack), "early release must begin at the current attack level");
  assert.equal(sound.envelopeAt(earlyRelease + release, attack, release, earlyRelease), 0);
});

test("pitch slider, bounds and invalid values are handled safely", () => {
  for (const hz of [110, 220, 440, 880]) {
    assert.ok(Math.abs(sound.sliderToHz(sound.hzToSlider(hz)) - hz) < 1e-9);
  }
  assert.throws(() => sound.validate("unknown", 220, .2, .3), RangeError);
  assert.throws(() => sound.validate("flute", 5000, .2, .3), RangeError);
  assert.throws(() => sound.validate("flute", 220, 0, .3), RangeError);
  assert.throws(() => sound.validate("flute", 220, .2, 5), RangeError);
  assert.throws(() => sound.waveAt(NaN, "violin"), RangeError);
  assert.throws(() => sound.partials("unknown"), RangeError);
  assert.throws(() => sound.envelopeAt(0, .2, .3, -1), RangeError);
});
