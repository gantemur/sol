"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const transient = require("./sound-transient.js");
const analysis = require("./sound-spectrum.js");

function peakHz(spectrum, min = 20, max = 8000) {
  let index = 0, amplitude = -Infinity;
  for (let i = Math.ceil(min / spectrum.binHz); i <= Math.min(spectrum.magnitudes.length - 1, Math.floor(max / spectrum.binHz)); i++) {
    if (spectrum.magnitudes[i] > amplitude) { amplitude = spectrum.magnitudes[i]; index = i; }
  }
  return index * spectrum.binHz;
}

test("short-time spectrum identifies plucked fundamentals and changing overtone strengths", () => {
  const recipe = { kind: "pluck", pitchHz: 220, decaySec: 0.65 };
  const early = analysis.spectrumAt(transient, recipe, 0.04);
  const later = analysis.spectrumAt(transient, recipe, 0.25);
  assert.ok(Math.abs(peakHz(early) - 220) < 15);
  const bandMax = (result, low, high) => Math.max(...result.magnitudes.slice(
    Math.round(low / result.binHz), Math.round(high / result.binHz)));
  const highEarly = bandMax(early, 640, 680);
  const highLate = bandMax(later, 640, 680);
  assert.ok(highEarly > highLate * 4, "Third harmonic fades more quickly than its early strength");
  assert.ok(early.magnitudes.every(Number.isFinite));
  const overall = analysis.spectrumOverall(transient, recipe);
  assert.ok(Math.abs(peakHz(overall) - 220) < 15);
});

test("kick size moves frequency range and its spectral peak descends during the hit", () => {
  const medium = { kind: "kick", pitchHz: 220, decaySec: 0.65, kickSize: "medium" };
  const early = analysis.spectrumAt(transient, medium, 0.04);
  const late = analysis.spectrumAt(transient, medium, 0.3);
  assert.ok(peakHz(early, 20, 350) > peakHz(late, 20, 350));
  assert.ok(transient.kickFrequency(0, "large") < transient.kickFrequency(0, "small"));
  assert.ok(transient.kickFrequency(0.5, "large") < transient.kickFrequency(0.5, "small"));
  const large = analysis.spectrumAt(transient, { ...medium, kickSize: "large" }, 0.1);
  const small = analysis.spectrumAt(transient, { ...medium, kickSize: "small" }, 0.1);
  assert.ok(peakHz(large, 20, 350) < peakHz(small, 20, 350));
});

test("Fourier analysis rejects invalid time and recipe inputs", () => {
  assert.equal(analysis.FFT_SIZE, 2048);
  assert.ok(Math.abs(analysis.WINDOW_SECONDS - 0.128) < 1e-9);
  assert.throws(() => analysis.spectrumAt(transient, { kind: "kick", decaySec: 0.3 }, -0.1), RangeError);
  assert.throws(() => analysis.spectrumAt(transient, { kind: "kick", decaySec: 0.3, kickSize: "huge" }, 0.1), RangeError);
});
