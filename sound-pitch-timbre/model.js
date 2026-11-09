/*
 * SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Small mathematical model adapted from gantemur/soundlab/sound-model.js.
 * These are ideal periodic waves, not measurements of the audio output.
 */
(function (root, factory) {
  "use strict";
  const model = factory();
  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.PitchTimbreModel = model;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TAU = 2 * Math.PI;
  const SHAPES = Object.freeze(["sine", "triangle", "square", "sawtooth"]);
  const MIN_HZ = 80;
  const MAX_HZ = 2000;

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function sampleWave(shape, cycles) {
    if (!SHAPES.includes(shape) || !Number.isFinite(cycles)) {
      throw new RangeError("Invalid waveform or phase");
    }
    const phase = ((cycles % 1) + 1) % 1;
    switch (shape) {
      case "sine": return Math.sin(TAU * phase);
      case "triangle": return (2 / Math.PI) * Math.asin(Math.sin(TAU * phase));
      case "square": return phase < 0.5 ? 1 : -1;
      case "sawtooth": return 2 * phase - 1;
    }
  }

  // Ideal Fourier magnitudes normalized to the fundamental (n = 1).
  // Phase is irrelevant to a magnitude-only spectrum.
  function harmonicMagnitude(shape, n) {
    if (!SHAPES.includes(shape)) throw new RangeError("Invalid waveform");
    if (!Number.isInteger(n) || n < 1) return 0;
    if (shape === "sine") return n === 1 ? 1 : 0;
    if (shape === "sawtooth") return 1 / n;
    if (n % 2 === 0) return 0;
    return shape === "square" ? 1 / n : 1 / (n * n);
  }

  function sliderToFrequency(position) {
    return MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, clamp(Number(position), 0, 1000) / 1000);
  }

  function frequencyToSlider(hz) {
    if (!Number.isFinite(hz) || hz <= 0) throw new RangeError("Invalid frequency");
    return 1000 * Math.log(clamp(hz, MIN_HZ, MAX_HZ) / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ);
  }

  return Object.freeze({ SHAPES, MIN_HZ, MAX_HZ, sampleWave, harmonicMagnitude,
    sliderToFrequency, frequencyToSlider });
});
