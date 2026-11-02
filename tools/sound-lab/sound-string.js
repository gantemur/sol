/* Deterministic, short-delay string synthesis for both single plucks and chords.
 * A two-tap loss filter recirculates a triangular initial displacement, with a
 * fractional delay for accurate tuning. No recordings, randomness or Web Audio
 * state are required: charts, live buffers and future scores share one signal.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundLabString = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const RATE = 48000;
  const TAU = 2 * Math.PI;
  // MIDI numbers for E2 A2 D3 G3 B3 E4, lowest string first.
  const TUNING = Object.freeze([40, 45, 50, 55, 59, 64]);
  // -1 means that the string is not sounded.
  const CHORDS = Object.freeze({
    em: Object.freeze([0, 2, 2, 0, 0, 0]),
    g: Object.freeze([3, 2, 0, 0, 0, 3]),
    c: Object.freeze([-1, 3, 2, 0, 1, 0])
  });
  const pluckCache = new Map();
  const strumCache = new Map();

  function validPosition(position) {
    return Number.isFinite(position) && position >= 0.08 && position <= 0.50;
  }

  function lengthFor(decay) {
    return Math.max(0.35, Math.min(3, decay * 4));
  }

  function midiHz(number) {
    return 440 * Math.pow(2, (number - 69) / 12);
  }

  function chordFrequencies(chord) {
    if (!Object.hasOwn(CHORDS, chord)) throw new RangeError("Unknown guitar chord");
    return CHORDS[chord].map((fret, index) => fret < 0 ? null : midiHz(TUNING[index] + fret));
  }

  function validate(frequency, decay, position) {
    if (!Number.isFinite(frequency) || frequency < 60 || frequency > 1400 ||
        !Number.isFinite(decay) || decay < 0.12 || decay > 1.2 ||
        !validPosition(position)) throw new RangeError("Invalid plucked-string parameters");
  }

  function makePluckWave(frequency, decay, position) {
    validate(frequency, decay, position);
    const count = Math.ceil(lengthFor(decay) * RATE);
    const result = new Float32Array(count);
    const exactDelay = RATE / frequency - 0.5; // average filter adds half a sample
    const integerDelay = Math.floor(exactDelay);
    const fraction = exactDelay - integerDelay;
    const feedback = Math.exp(-1 / (frequency * decay));
    // Triangular displacement of a string plucked at `position`, with zero mean.
    function history(index) {
      if (index >= 0) return result[index];
      const phase = ((index * frequency / RATE) % 1 + 1) % 1;
      const height = phase < position ? phase / position : (1 - phase) / (1 - position);
      return height - 0.5;
    }
    let peak = 0;
    for (let i = 0; i < count; i++) {
      const a = (1 - fraction) * history(i - integerDelay) +
        fraction * history(i - integerDelay - 1);
      const b = (1 - fraction) * history(i - integerDelay - 1) +
        fraction * history(i - integerDelay - 2);
      const time = i / RATE;
      const attack = 1 - Math.exp(-time / 0.0014);
      // The fast pick click is small compared with the ringing string.
      const click = 0.035 * Math.exp(-time / 0.003) * Math.sin(TAU * 3600 * time);
      result[i] = attack * feedback * (a + b) / 2 + click;
      peak = Math.max(peak, Math.abs(result[i]));
    }
    const scale = 0.86 / Math.max(0.0001, peak);
    for (let i = 0; i < count; i++) result[i] *= scale;
    return result;
  }

  function remember(cache, key, create, limit) {
    let samples = cache.get(key);
    if (!samples) {
      samples = create();
      if (cache.size >= limit) cache.delete(cache.keys().next().value);
      cache.set(key, samples);
    }
    return samples;
  }

  function pluckWave(frequency, decay, position = 0.22) {
    validate(frequency, decay, position);
    const key = [frequency, decay, position].join("|");
    return remember(pluckCache, key, () => makePluckWave(frequency, decay, position), 8);
  }

  function interpolate(samples, time) {
    if (!Number.isFinite(time) || time <= 0 || time * RATE >= samples.length - 1) return 0;
    const index = time * RATE, low = Math.floor(index), part = index - low;
    return samples[low] * (1 - part) + samples[low + 1] * part;
  }

  function pluckAt(time, frequency, decay, position = 0.22) {
    return interpolate(pluckWave(frequency, decay, position), time);
  }

  function makeStrumWave(chord, decay, position) {
    const frequencies = chordFrequencies(chord);
    const count = Math.ceil(lengthFor(decay) * RATE);
    const result = new Float32Array(count);
    // A plectrum reaches the strings in sequence, not simultaneously.
    frequencies.forEach((frequency, stringIndex) => {
      if (frequency === null) return;
      const string = pluckWave(frequency, decay, position);
      const offset = Math.round(stringIndex * 0.012 * RATE);
      const weight = stringIndex < 2 ? 0.82 : 1;
      for (let i = offset; i < count; i++) result[i] += weight * string[i - offset];
    });
    let peak = 0;
    for (const value of result) peak = Math.max(peak, Math.abs(value));
    const scale = 0.9 / Math.max(0.0001, peak);
    for (let i = 0; i < count; i++) result[i] *= scale;
    return result;
  }

  function strumWave(chord, decay, position = 0.22) {
    if (!Object.hasOwn(CHORDS, chord) || !Number.isFinite(decay) ||
        decay < 0.12 || decay > 1.2 || !validPosition(position)) {
      throw new RangeError("Invalid guitar-strum parameters");
    }
    const key = [chord, decay, position].join("|");
    return remember(strumCache, key, () => makeStrumWave(chord, decay, position), 3);
  }

  function strumAt(time, chord, decay, position = 0.22) {
    return interpolate(strumWave(chord, decay, position), time);
  }

  return Object.freeze({
    RATE, TUNING, CHORDS, midiHz, chordFrequencies, validate, pluckAt, strumAt,
    validPosition
  });
});
