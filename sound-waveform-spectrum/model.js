/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Small PCM/FFT model adapted from the author's MIT-licensed Sound Lab analysis.
 * The waveform and spectrum always derive from the same unmodified PCM samples.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundWaveSpectrumModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PRESETS = Object.freeze(["sine", "two", "sweep", "noise", "guitar", "bell"]);
  const PRESET_DURATION = 3;
  const LOCAL_SECONDS = 0.05;
  const AVERAGE_FFT = 4096;
  const TAU = 2 * Math.PI;
  const windowCache = new Map();

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function validate(samples, sampleRate) {
    if (!(samples instanceof Float32Array || samples instanceof Float64Array) ||
        !samples.length || samples.length > 4 * 192000 + 1024 ||
        !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
      throw new RangeError("Expected at most four seconds of finite PCM at 8–192 kHz");
    }
  }

  function hann(size) {
    if (!windowCache.has(size)) {
      const values = Float64Array.from({ length: size }, (_, i) =>
        0.5 - 0.5 * Math.cos(TAU * i / (size - 1)));
      const sum = values.reduce((a, b) => a + b, 0);
      windowCache.set(size, { values, sum });
    }
    return windowCache.get(size);
  }

  // Dependency-free radix-2 FFT, as used by Sound Lab (forward, unnormalized).
  function fft(real, imag) {
    const n = real.length;
    if (n < 2 || n !== imag.length || (n & (n - 1))) throw new RangeError("Invalid FFT size");
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      while (j & bit) { j ^= bit; bit >>= 1; }
      j ^= bit;
      if (j > i) {
        [real[j], real[i]] = [real[i], real[j]];
        [imag[j], imag[i]] = [imag[i], imag[j]];
      }
    }
    for (let length = 2; length <= n; length *= 2) {
      const angle = -TAU / length, cosine = Math.cos(angle), sine = Math.sin(angle);
      for (let start = 0; start < n; start += length) {
        let wr = 1, wi = 0;
        for (let k = 0; k < length / 2; k++) {
          const a = start + k, b = a + length / 2;
          const br = real[b] * wr - imag[b] * wi;
          const bi = real[b] * wi + imag[b] * wr;
          real[b] = real[a] - br; imag[b] = imag[a] - bi;
          real[a] += br; imag[a] += bi;
          const next = wr * cosine - wi * sine;
          wi = wr * sine + wi * cosine; wr = next;
        }
      }
    }
  }

  function transformed(samples, first, windowSamples, fftSize) {
    const { values, sum } = hann(windowSamples);
    const real = new Float64Array(fftSize), imag = new Float64Array(fftSize);
    for (let i = 0; i < windowSamples; i++) {
      const frame = first + i;
      real[i] = frame >= 0 && frame < samples.length ? samples[frame] * values[i] : 0;
    }
    fft(real, imag);
    const magnitudes = new Float32Array(fftSize / 2 + 1);
    for (let bin = 0; bin < magnitudes.length; bin++) {
      const factor = bin === 0 || bin === fftSize / 2 ? 1 : 2;
      magnitudes[bin] = factor * Math.hypot(real[bin], imag[bin]) / sum;
    }
    return magnitudes;
  }

  function localRange(samples, sampleRate, centerSeconds, seconds = LOCAL_SECONDS) {
    validate(samples, sampleRate);
    if (!Number.isFinite(centerSeconds) || !Number.isFinite(seconds) || seconds <= 0) {
      throw new RangeError("Invalid local-spectrum cursor or duration");
    }
    const length = Math.min(samples.length, Math.max(4, Math.round(seconds * sampleRate)));
    const start = clamp(Math.round(centerSeconds * sampleRate) - Math.floor(length / 2),
      0, samples.length - length);
    return { first: start, last: start + length,
      start: start / sampleRate, end: (start + length) / sampleRate,
      center: (start + length / 2) / sampleRate, seconds: length / sampleRate };
  }

  function spectrumLocal(samples, sampleRate, centerSeconds, seconds = LOCAL_SECONDS) {
    const range = localRange(samples, sampleRate, centerSeconds, seconds);
    const windowSamples = range.last - range.first;
    // Extra FFT samples interpolate the bins, but do not improve true resolution.
    const fftSize = 2 ** Math.ceil(Math.log2(2 * windowSamples));
    return { magnitudes: transformed(samples, range.first, windowSamples, fftSize),
      binHz: sampleRate / fftSize, windowSeconds: range.seconds, ...range };
  }

  function spectrumAverage(samples, sampleRate) {
    validate(samples, sampleRate);
    const fftSize = AVERAGE_FFT, hop = fftSize / 2, starts = [];
    if (samples.length < fftSize) starts.push(Math.floor((samples.length - fftSize) / 2));
    else {
      for (let first = 0; first + fftSize <= samples.length; first += hop) starts.push(first);
      if (starts.at(-1) !== samples.length - fftSize) starts.push(samples.length - fftSize);
    }
    const power = new Float64Array(fftSize / 2 + 1);
    for (const first of starts) {
      const magnitudes = transformed(samples, first, fftSize, fftSize);
      for (let bin = 0; bin < power.length; bin++) power[bin] += magnitudes[bin] ** 2;
    }
    const magnitudes = Float32Array.from(power, sum => Math.sqrt(sum / starts.length));
    return { magnitudes, binHz: sampleRate / fftSize,
      windowSeconds: fftSize / sampleRate, windows: starts.length };
  }

  function waveformEnvelope(samples, sampleRate, startSeconds, endSeconds, width) {
    validate(samples, sampleRate);
    if (!Number.isInteger(width) || width < 1 || width > 4096 ||
        !Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) ||
        startSeconds < 0 || endSeconds > samples.length / sampleRate || startSeconds >= endSeconds) {
      throw new RangeError("Invalid waveform view");
    }
    const first = Math.floor(startSeconds * sampleRate);
    const last = Math.min(samples.length, Math.ceil(endSeconds * sampleRate));
    const minima = new Float32Array(width), maxima = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      const from = first + Math.floor((last - first) * x / width);
      const to = Math.min(last, Math.max(from + 1, first + Math.ceil((last - first) * (x + 1) / width)));
      let min = Infinity, max = -Infinity;
      for (let j = from; j < to; j++) { min = Math.min(min, samples[j]); max = Math.max(max, samples[j]); }
      minima[x] = Number.isFinite(min) ? min : 0;
      maxima[x] = Number.isFinite(max) ? max : 0;
    }
    return { minima, maxima };
  }

  // The plotted unit is normalized PCM amplitude. Automatic scaling leaves
  // headroom, but caps amplification so near-silence is not shown as full scale.
  function waveformScale(peak, choice = "auto") {
    if (!Number.isFinite(peak) || peak < 0 || peak > 1.001) throw new RangeError("Invalid PCM peak");
    if (choice === "auto") return clamp(0.9 / Math.max(peak, 1e-6), 1, 50);
    if (!["1", "2", "5", "10", "20", "50"].includes(String(choice))) {
      throw new RangeError("Invalid vertical waveform scale");
    }
    return Number(choice);
  }

  // A small mono PCM WAV works through the native media element, avoiding a
  // second Web Audio context just to listen to the captured/generated sample.
  function encodeWav16(samples, sampleRate) {
    validate(samples, sampleRate);
    const frames = samples.length;
    const dataBytes = frames * 2;
    const bytes = new ArrayBuffer(44 + dataBytes);
    const view = new DataView(bytes);
    const tag = (offset, label) => {
      for (let i = 0; i < label.length; i++) view.setUint8(offset + i, label.charCodeAt(i));
    };
    tag(0, "RIFF"); view.setUint32(4, 36 + dataBytes, true); tag(8, "WAVE");
    tag(12, "fmt "); view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); view.setUint16(22, 1, true); // PCM, mono
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    tag(36, "data"); view.setUint32(40, dataBytes, true);
    for (let i = 0; i < frames; i++) {
      const value = Number.isFinite(samples[i]) ? clamp(samples[i], -1, 1) : 0;
      view.setInt16(44 + i * 2, Math.round(value < 0 ? value * 32768 : value * 32767), true);
    }
    return bytes;
  }

  function synthesize(preset, sampleRate = 44100) {
    if (!PRESETS.includes(preset) || !Number.isInteger(sampleRate) ||
        sampleRate < 8000 || sampleRate > 192000) throw new RangeError("Unknown preset or sample rate");
    const samples = new Float32Array(PRESET_DURATION * sampleRate);
    let seed = 0x634af392;
    const noise = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return 2 * seed / 4294967296 - 1; };
    for (let i = 0; i < samples.length; i++) {
      const t = i / sampleRate;
      const gate = Math.min(1, t / 0.012, (PRESET_DURATION - t) / 0.012);
      let v = 0;
      switch (preset) {
        case "sine": v = 0.36 * Math.sin(TAU * 440 * t); break;
        case "two": v = 0.22 * Math.sin(TAU * 440 * t) + 0.2 * Math.sin(TAU * 660 * t); break;
        case "sweep": v = 0.32 * Math.sin(TAU * (150 * t + 0.5 * (1900 / PRESET_DURATION) * t * t)); break;
        case "noise": v = 0.24 * noise(); break;
        case "guitar": {
          const harmonics = [1, 0.59, 0.42, 0.27, 0.16, 0.10];
          for (let n = 1; n <= harmonics.length; n++) v += harmonics[n - 1] * Math.sin(TAU * 220 * n * t + 0.18 * n);
          v *= 0.20 * (1 - Math.exp(-t * 120)) * Math.exp(-t * 2.1);
          break;
        }
        case "bell": {
          const partials = [[523.25, 0.28, 2], [1182, 0.17, 2.8], [1797, 0.10, 4.2], [2481, 0.07, 6]];
          for (const [f, a, decay] of partials) v += a * Math.sin(TAU * f * t) * Math.exp(-decay * t);
          v *= 1 - Math.exp(-t * 150);
          break;
        }
      }
      samples[i] = clamp(gate, 0, 1) * v;
    }
    return { id: preset, samples, sampleRate, duration: PRESET_DURATION };
  }

  return Object.freeze({ PRESETS, PRESET_DURATION, LOCAL_SECONDS, synthesize,
    spectrumAverage, spectrumLocal, localRange, waveformEnvelope, waveformScale,
    encodeWav16, clamp });
});
