/* Moving Pitch: small deterministic recipes shared by the audio and plots.
 * A theremin can use idealized harmonic mixtures while the siren stays a sine.
 * These are teaching timbres, not recordings or physical voice models.
 */
(function (root, makeModel) {
  "use strict";
  const model = makeModel();
  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.SoundLabMotionModel = model;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MIN_HZ = 120;
  const MAX_HZ = 1600;
  const MIN_RATE = 0.2;
  const MAX_RATE = 2;
  // Two tones are the rectangular trajectory; the others glide continuously.
  const PATTERNS = Object.freeze(["two-tone", "sine-sweep", "pitch-sweep"]);
  const TIMBRES = Object.freeze(["pure", "rich", "voice", "overtones"]);
  // Eight sine harmonics, at integer multiples of the moving fundamental.
  // Strong upper groups give a deliberately stylized voice/overtone color.
  const TIMBRE_PARTIALS = Object.freeze({
    pure: Object.freeze([1, 0, 0, 0, 0, 0, 0, 0]),
    rich: Object.freeze([1, .60, .45, .30, .22, .17, .12, .09]),
    voice: Object.freeze([.70, .22, .85, .62, .24, .05, 0, 0]),
    overtones: Object.freeze([.80, .12, .10, .08, .10, .65, .52, .23])
  });
  function timbrePartials(timbre) {
    if (!Object.hasOwn(TIMBRE_PARTIALS, timbre)) throw new RangeError("Unknown theremin timbre");
    return TIMBRE_PARTIALS[timbre];
  }
  // PeriodicWave uses peak-normalized harmonics; match it for the plot.
  const TIMBRE_PEAKS = Object.freeze(Object.fromEntries(TIMBRES.map(timbre => {
    const partials = timbrePartials(timbre);
    let peak = 0;
    for (let sample = 0; sample < 2048; sample++) {
      const phase = 2 * Math.PI * sample / 2048;
      const value = partials.reduce((sum, strength, i) =>
        sum + strength * Math.sin((i + 1) * phase), 0);
      peak = Math.max(peak, Math.abs(value));
    }
    return [timbre, peak];
  })));
  function timbreWaveAt(phase, timbre) {
    if (!Number.isFinite(phase)) throw new RangeError("Invalid wave phase");
    const partials = timbrePartials(timbre);
    return partials.reduce((sum, strength, i) =>
      sum + strength * Math.sin((i + 1) * phase), 0) / TIMBRE_PEAKS[timbre];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function padHz(xFraction) {
    if (!Number.isFinite(xFraction)) throw new RangeError("Invalid pad position");
    return MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, clamp(xFraction, 0, 1));
  }

  function padFraction(hz) {
    if (!Number.isFinite(hz) || hz <= 0) throw new RangeError("Invalid pad frequency");
    return clamp(Math.log(hz / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ), 0, 1);
  }

  function padLevel(yFraction) {
    if (!Number.isFinite(yFraction)) throw new RangeError("Invalid pad height");
    return 1 - clamp(yFraction, 0, 1);
  }

  function validateSiren(recipe) {
    if (!recipe || !PATTERNS.includes(recipe.pattern)) throw new RangeError("Invalid siren pattern");
    if (!Number.isFinite(recipe.lowHz) || !Number.isFinite(recipe.highHz) ||
        recipe.lowHz < MIN_HZ || recipe.highHz > MAX_HZ || recipe.highHz - recipe.lowHz < 20) {
      throw new RangeError("Siren pitches must be separated and within range");
    }
    if (!Number.isFinite(recipe.rate) || recipe.rate < MIN_RATE || recipe.rate > MAX_RATE) {
      throw new RangeError("Siren speed outside supported range");
    }
  }

  function sirenHzAt(time, recipe) {
    validateSiren(recipe);
    if (!Number.isFinite(time) || time < 0) throw new RangeError("Invalid siren time");
    const phase = (time * recipe.rate) % 1;
    if (recipe.pattern === "two-tone") return phase < 0.5 ? recipe.lowHz : recipe.highHz;
    const fraction = phase <= 0.5 ? 2 * phase : 2 * (1 - phase);
    if (recipe.pattern === "pitch-sweep") {
      // Constant semitones per second: geometric interpolation of frequency.
      return recipe.lowHz * Math.pow(recipe.highHz / recipe.lowHz, fraction);
    }
    // A smooth sinusoidal Hz trajectory, with zero slope at both extremes.
    return recipe.lowHz + (recipe.highHz - recipe.lowHz) * (1 - Math.cos(2 * Math.PI * phase)) / 2;
  }

  return Object.freeze({
    MIN_HZ, MAX_HZ, MIN_RATE, MAX_RATE, PATTERNS, TIMBRES,
    timbrePartials, timbreWaveAt,
    padHz, padFraction, padLevel, validateSiren, sirenHzAt
  });
});
