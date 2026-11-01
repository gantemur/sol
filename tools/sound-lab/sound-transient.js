/* Small, deterministic models of a struck drum and a plucked string.
 * Both the speaker buffer and the explanatory plots use these same formulas.
 * This is a teaching model, not a recording or physical instrument simulation.
 */
(function (root, makeModel) {
  "use strict";
  const model = makeModel();
  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.SoundLabTransientModel = model;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TAU = 2 * Math.PI;
  const KINDS = Object.freeze(["pluck", "kick"]);
  const MIN_PITCH_HZ = 110;
  const MAX_PITCH_HZ = 880;
  const MIN_DECAY = 0.12;
  const MAX_DECAY = 1.2;
  const KICK_LOW_HZ = 48;
  const KICK_SWEEP_HZ = 128;
  const KICK_SWEEP_TIME = 0.04;
  const KICK_SIZES = Object.freeze({ large: 0.72, medium: 1, small: 1.4 });

  const pluckWeights = Array.from({ length: 8 }, (_, i) => {
    const n = i + 1;
    // A simple plucking-position spectrum: the point of pluck suppresses
    // some partials; higher partials become quieter.
    return Math.sin(Math.PI * n * 0.22) / Math.pow(n, 1.15);
  });
  const pluckNormalization = pluckWeights.reduce((sum, weight) => sum + Math.abs(weight), 0);

  function validate(kind, pitchHz, decaySec, kickSize = "medium") {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown transient sound");
    if (!Number.isFinite(decaySec) || decaySec < MIN_DECAY || decaySec > MAX_DECAY) {
      throw new RangeError("Decay outside the supported range");
    }
    if (kind === "pluck" && (!Number.isFinite(pitchHz) || pitchHz < MIN_PITCH_HZ || pitchHz > MAX_PITCH_HZ)) {
      throw new RangeError("Plucked-string frequency outside the supported range");
    }
    if (kind === "kick" && !Object.hasOwn(KICK_SIZES, kickSize)) {
      throw new RangeError("Unknown drum-size preset");
    }
  }

  function envelope(kind, time, decaySec) {
    if (time <= 0) return 0;
    const attack = kind === "kick" ? 0.0015 : 0.0025;
    return (1 - Math.exp(-time / attack)) * Math.exp(-time / decaySec);
  }

  function kickFrequency(time, size = "medium") {
    if (!Object.hasOwn(KICK_SIZES, size)) throw new RangeError("Unknown drum-size preset");
    return KICK_SIZES[size] * (KICK_LOW_HZ + KICK_SWEEP_HZ * Math.exp(-Math.max(0, time) / KICK_SWEEP_TIME));
  }

  function sampleAt(kind, time, pitchHz, decaySec, kickSize = "medium") {
    if (time <= 0) return 0;
    const level = envelope(kind, time, decaySec);
    if (kind === "kick") {
      // Integrate the falling frequency exactly, so the phase is continuous.
      const phase = TAU * KICK_SIZES[kickSize] * (KICK_LOW_HZ * time +
        KICK_SWEEP_HZ * KICK_SWEEP_TIME * (1 - Math.exp(-time / KICK_SWEEP_TIME)));
      return level * Math.sin(phase);
    }
    let value = 0;
    for (let i = 0; i < pluckWeights.length; i++) {
      const n = i + 1;
      const highPartialDecay = Math.exp(-i * time / 0.075);
      value += pluckWeights[i] * highPartialDecay * Math.sin(TAU * n * pitchHz * time);
    }
    return level * value / pluckNormalization;
  }

  function duration(decaySec) {
    return Math.max(0.35, Math.min(3, decaySec * 4));
  }

  function plottedEnvelope(kind, time, decaySec) {
    const length = duration(decaySec);
    if (time >= length) return 0;
    return envelope(kind, time, decaySec) * Math.min(1, (length - time) / 0.018);
  }

  function plottedSampleAt(kind, time, pitchHz, decaySec, kickSize = "medium") {
    const length = duration(decaySec);
    if (time <= 0 || time >= length) return 0;
    const fade = Math.min(1, (length - time) / 0.018);
    return sampleAt(kind, time, pitchHz, decaySec, kickSize) * fade;
  }

  function makeSamples(kind, pitchHz, decaySec, sampleRate, kickSize = "medium") {
    validate(kind, pitchHz, decaySec, kickSize);
    if (!Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
      throw new RangeError("Unsupported sampling rate");
    }
    const seconds = duration(decaySec);
    const count = Math.ceil(seconds * sampleRate);
    const samples = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const time = i / sampleRate;
      samples[i] = plottedSampleAt(kind, time, pitchHz, decaySec, kickSize);
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
    KINDS, KICK_SIZES, MIN_PITCH_HZ, MAX_PITCH_HZ, MIN_DECAY, MAX_DECAY,
    validate, envelope, plottedEnvelope, kickFrequency, sampleAt, plottedSampleAt,
    duration, makeSamples, sliderToHz, hzToSlider
  });
});
