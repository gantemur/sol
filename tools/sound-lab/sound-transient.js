/* Deterministic models of a membrane drum, feedback-plucked strings and piano.
 * Playback and explanatory plots use precisely the same model samples.
 * These are simplified physical teaching models, not instrument recordings.
 */
(function (root, makeModel) {
  "use strict";
  const strings = typeof module === "object" && module.exports ? require("./sound-string.js") : root.SoundLabString;
  const piano = typeof module === "object" && module.exports ? require("./sound-piano.js") : root.SoundLabPiano;
  const model = makeModel(strings, piano);
  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.SoundLabTransientModel = model;
})(typeof globalThis !== "undefined" ? globalThis : this, function (strings, piano) {
  "use strict";

  if (!strings) throw new Error("String synthesis must load before transient synthesis");
  if (!piano) throw new Error("Piano synthesis must load before transient synthesis");

  const TAU = 2 * Math.PI;
  const KINDS = Object.freeze(["pluck", "kick", "piano"]);
  const MIN_PITCH_HZ = 110;
  const MAX_PITCH_HZ = 880;
  const MIN_DECAY = 0.12;
  const MAX_DECAY = 1.2;
  const DRUM_BASE_HZ = 112;
  const DRUM_ZEROS = Object.freeze([2.40483, 3.83171, 5.13562, 5.52008,
    6.38016, 7.01559, 7.58834, 8.41724]);
  const DRUM_WEIGHTS = Object.freeze([1, .39, .24, .28, .14, .12, .09, .075]);
  const DRUM_MIN_TENSION = .5;
  const DRUM_MAX_TENSION = 2;
  const KICK_SIZES = Object.freeze({ large: 0.72, medium: 1, small: 1.4 });

  function validate(kind, pitchHz, decaySec, kickSize = "medium", options = {}) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown transient sound");
    if (!Number.isFinite(decaySec) || decaySec < MIN_DECAY || decaySec > MAX_DECAY) {
      throw new RangeError("Decay outside the supported range");
    }
    if ((kind === "pluck" || kind === "piano") &&
        (!Number.isFinite(pitchHz) || pitchHz < MIN_PITCH_HZ || pitchHz > MAX_PITCH_HZ)) {
      throw new RangeError("Pitched-string frequency outside the supported range");
    }
    if (kind === "kick" && (!Object.hasOwn(KICK_SIZES, kickSize) ||
        !Number.isFinite(options.drumTension ?? 1) ||
        (options.drumTension ?? 1) < DRUM_MIN_TENSION ||
        (options.drumTension ?? 1) > DRUM_MAX_TENSION)) {
      throw new RangeError("Unknown drum-size preset");
    }
    if (kind === "pluck" && (!strings.validPosition(options.position ?? .22) ||
        (options.strumChord !== undefined && !Object.hasOwn(strings.CHORDS, options.strumChord)))) {
      throw new RangeError("Unknown pluck position or guitar chord");
    }
    if (kind === "piano" && (!piano.validVelocity(options.velocity ?? .55) ||
        !piano.validTouch(options.touch ?? "press"))) {
      throw new RangeError("Piano hammer velocity or touch outside the supported range");
    }
  }

  function envelope(kind, time, decaySec, options = {}) {
    if (time <= 0) return 0;
    if (kind === "piano") return piano.envelope(time, decaySec, options.touch ?? "press");
    const attack = kind === "kick" ? 0.0015 : 0.0025;
    return (1 - Math.exp(-time / attack)) * Math.exp(-time / decaySec);
  }

  function kickFrequency(time, size = "medium", tension = 1) {
    if (!Object.hasOwn(KICK_SIZES, size) || !Number.isFinite(tension) ||
        tension < DRUM_MIN_TENSION || tension > DRUM_MAX_TENSION) {
      throw new RangeError("Unknown membrane size or tension");
    }
    return DRUM_BASE_HZ * KICK_SIZES[size] * Math.sqrt(tension);
  }

  function drumModeFrequencies(size = "medium", tension = 1) {
    const fundamental = kickFrequency(0, size, tension);
    return DRUM_ZEROS.map(zero => fundamental * zero / DRUM_ZEROS[0]);
  }

  function sampleAt(kind, time, pitchHz, decaySec, kickSize = "medium", options = {}) {
    if (time <= 0) return 0;
    if (kind === "kick") {
      // Circular-membrane eigenfrequencies are Bessel zeros, not integer harmonics.
      // A slightly off-center strike excites non-axisymmetric modes as well.
      const base = kickFrequency(0, kickSize, options.drumTension ?? 1);
      let value = 0;
      for (let i = 0; i < DRUM_ZEROS.length; i++) {
        const modeDecay = decaySec / (1 + i * .16);
        const frequency = base * DRUM_ZEROS[i] / DRUM_ZEROS[0];
        value += DRUM_WEIGHTS[i] * Math.exp(-time / modeDecay) * Math.sin(TAU * frequency * time);
      }
      const knock = .1 * Math.exp(-time / .007) * Math.sin(TAU * 2300 * time);
      return (1 - Math.exp(-time / .0015)) * (value / 2.2 + knock);
    }
    if (kind === "pluck") {
      const position = options.position ?? .22;
      return options.strumChord ?
        strings.strumAt(time, options.strumChord, decaySec, position) :
        strings.pluckAt(time, pitchHz, decaySec, position);
    }
    return piano.sampleAt(time, pitchHz, decaySec, options.velocity ?? .55,
      options.touch ?? "press");
  }

  function duration(decaySec) {
    return Math.max(0.35, Math.min(3, decaySec * 4));
  }

  function plottedEnvelope(kind, time, decaySec, options = {}) {
    const length = duration(decaySec);
    if (time >= length) return 0;
    return envelope(kind, time, decaySec, options) * Math.min(1, (length - time) / 0.018);
  }

  function plottedSampleAt(kind, time, pitchHz, decaySec, kickSize = "medium", options = {}) {
    const length = duration(decaySec);
    if (time <= 0 || time >= length) return 0;
    const fade = Math.min(1, (length - time) / 0.018);
    return sampleAt(kind, time, pitchHz, decaySec, kickSize, options) * fade;
  }

  function makeSamples(kind, pitchHz, decaySec, sampleRate, kickSize = "medium", options = {}) {
    validate(kind, pitchHz, decaySec, kickSize, options);
    if (!Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
      throw new RangeError("Unsupported sampling rate");
    }
    const seconds = duration(decaySec);
    const count = Math.ceil(seconds * sampleRate);
    const samples = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const time = i / sampleRate;
      samples[i] = plottedSampleAt(kind, time, pitchHz, decaySec, kickSize, options);
    }
    return samples;
  }

  function sliderToHz(position) {
    return MIN_PITCH_HZ * Math.pow(MAX_PITCH_HZ / MIN_PITCH_HZ, position / 1000);
  }

  function hzToSlider(hz) {
    return 1000 * Math.log(hz / MIN_PITCH_HZ) / Math.log(MAX_PITCH_HZ / MIN_PITCH_HZ);
  }

  return Object.freeze({
    KINDS, KICK_SIZES, DRUM_MIN_TENSION, DRUM_MAX_TENSION, STRUM_CHORDS: strings.CHORDS,
    MIN_PITCH_HZ, MAX_PITCH_HZ, MIN_DECAY, MAX_DECAY,
    PIANO_STIFFNESS: piano.STIFFNESS, PIANO_TOUCHES: piano.TOUCHES,
    pianoPartialHz: piano.pianoPartialHz,
    validate, envelope, plottedEnvelope, kickFrequency, drumModeFrequencies, sampleAt, plottedSampleAt,
    duration, makeSamples, sliderToHz, hzToSlider
  });
});
