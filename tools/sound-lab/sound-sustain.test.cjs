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
    assert.ok(peak > .98 && peak <= 1.001, kind + " plot must be peak normalized");
  }
  assert.ok(sound.partials("violin")[1] > sound.partials("flute")[1] * 3,
    "bowed violin has much stronger second harmonic than flute");
  assert.ok(sound.partials("morin")[1] > sound.partials("morin")[0],
    "stylized morin khuur no longer assumes odd harmonics must dominate");
  assert.ok(sound.partials("morin")[6] < sound.partials("violin")[6],
    "morin khuur illustration is darker in the upper harmonics");
  assert.notEqual(sound.waveAt(.43, "violin"), sound.waveAt(.43, "morin"));
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
