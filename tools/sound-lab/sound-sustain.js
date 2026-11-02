/* Held wind and bowed-string teaching models. Harmonic recipes, attack/release
 * curves and plot samples are pure functions; playback uses the same recipes.
 * These are synthetic sounds, not sampled or physically faithful instruments.
 */
(function (root, makeModel) {
  "use strict";
  const model = makeModel();
  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.SoundLabSustain = model;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const KINDS = Object.freeze(["flute", "violin", "morin"]);
  const MIN_HZ = 110;
  const MAX_HZ = 880;
  const MIN_ATTACK = 0.02;
  const MAX_ATTACK = 0.6;
  const MIN_RELEASE = 0.04;
  const MAX_RELEASE = 1.2;
  const EXAMPLE_HOLD = 1.2;
  const PARTIALS = Object.freeze({
    flute: Object.freeze([1, .12, .035, .012, .005, 0, 0, 0]),
    violin: Object.freeze([.84, .72, .58, .47, .36, .27, .19, .12]),
    // A dark bowed-string illustration, with a strong second partial instead
    // of an unsupported assumption that a morin khuur stresses odd harmonics.
    morin: Object.freeze([.88, .92, .58, .32, .21, .12, .075, .045])
  });
  const DEFAULTS = Object.freeze({
    flute: Object.freeze({ attack: .08, release: .16, noise: .016, cutoff: 3600 }),
    violin: Object.freeze({ attack: .18, release: .29, noise: .024, cutoff: 4600 }),
    morin: Object.freeze({ attack: .11, release: .32, noise: .028, cutoff: 2600 })
  });
  function validate(kind, hz, attack, release) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown held-sound model");
    if (!Number.isFinite(hz) || hz < MIN_HZ || hz > MAX_HZ) {
      throw new RangeError("Held-sound pitch outside supported range");
    }
    if (!Number.isFinite(attack) || attack < MIN_ATTACK || attack > MAX_ATTACK ||
        !Number.isFinite(release) || release < MIN_RELEASE || release > MAX_RELEASE) {
      throw new RangeError("Held-sound envelope outside supported range");
    }
  }
  function partials(kind) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown held-sound model");
    return PARTIALS[kind];
  }
  function defaults(kind) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown held-sound model");
    return DEFAULTS[kind];
  }
  const PEAKS = Object.freeze(Object.fromEntries(KINDS.map(kind => {
    let peak = 0;
    for (let i = 0; i < 4096; i++) {
      const phase = 2 * Math.PI * i / 4096;
      const value = PARTIALS[kind].reduce((sum, strength, index) =>
        sum + strength * Math.sin((index + 1) * phase), 0);
      peak = Math.max(peak, Math.abs(value));
    }
    return [kind, peak];
  })));
  function waveAt(phase, kind) {
    if (!Number.isFinite(phase)) throw new RangeError("Invalid wave phase");
    return partials(kind).reduce((sum, strength, index) =>
      sum + strength * Math.sin((index + 1) * phase), 0) / PEAKS[kind];
  }
  function smoothstep(fraction) {
    const x = Math.max(0, Math.min(1, fraction));
    return x * x * (3 - 2 * x);
  }
  function attackLevelAt(elapsed, attack) {
    if (!Number.isFinite(elapsed) || !Number.isFinite(attack) || attack <= 0) {
      throw new RangeError("Invalid attack time");
    }
    return smoothstep(elapsed / attack);
  }
  function releaseLevelAt(elapsed, startLevel, release) {
    if (!Number.isFinite(elapsed) || !Number.isFinite(startLevel) ||
        !Number.isFinite(release) || release <= 0) throw new RangeError("Invalid release time");
    return startLevel * (1 - smoothstep(elapsed / release));
  }
  function envelopeAt(elapsed, attack, release, hold = EXAMPLE_HOLD) {
    if (!Number.isFinite(hold) || hold < 0) throw new RangeError("Invalid held duration");
    if (elapsed < hold) return attackLevelAt(elapsed, attack);
    return releaseLevelAt(elapsed - hold, attackLevelAt(hold, attack), release);
  }
  function sliderToHz(position) {
    return MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, position / 1000);
  }
  function hzToSlider(hz) {
    return 1000 * Math.log(hz / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ);
  }

  return Object.freeze({
    KINDS, MIN_HZ, MAX_HZ, MIN_ATTACK, MAX_ATTACK, MIN_RELEASE, MAX_RELEASE,
    EXAMPLE_HOLD, validate, defaults, partials, waveAt, smoothstep,
    attackLevelAt, releaseLevelAt, envelopeAt, sliderToHz, hzToSlider
  });
});
