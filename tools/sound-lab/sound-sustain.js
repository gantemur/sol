/* Held wind and bowed-string teaching models. The flute uses an illustrative
 * nonlinear jet exciter followed by two bore/radiation filters. The Fourier
 * components below predict that Web Audio path for the plotted periodic tone.
 * This is not a self-oscillating, jet/bore-feedback physical flute model.
 * Bowed-string recipes remain intentionally stylized.
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
    violin: Object.freeze([.84, .72, .58, .47, .36, .27, .19, .12]),
    // A dark bowed-string illustration, with a strong second partial instead
    // of an unsupported assumption that a morin khuur stresses odd harmonics.
    morin: Object.freeze([.88, .92, .58, .32, .21, .12, .075, .045])
  });
  const DEFAULTS = Object.freeze({
    // Breath turbulence should be barely audible beside the radiated tone;
    // the earlier .016 mix sounded too hissy at ordinary listening distance.
    flute: Object.freeze({ attack: .08, release: .16, noise: .002, cutoff: 3600 }),
    violin: Object.freeze({ attack: .18, release: .29, noise: .024, cutoff: 4600 }),
    morin: Object.freeze({ attack: .11, release: .32, noise: .028, cutoff: 2600 })
  });
  const DEFAULT_BREATH = 60;
  const FLUTE_TONE_GAIN = 1.2;
  const FLUTE_HIGHPASS = 70;
  const FLUTE_LOWPASS = 3400;
  const FLUTE_Q = Math.SQRT1_2;
  const FLUTE_PLOT_SAMPLE_RATE = 48000;

  // The oscillator stands in for a periodic bore pressure. A smoothly driven
  // asymmetric polynomial represents jet-flow saturation, producing a 2f
  // component as well as weaker odd harmonics. No samples or STK code are used.
  function fluteDrive(breath = DEFAULT_BREATH) {
    if (!Number.isFinite(breath) || breath < 0 || breath > 100) {
      throw new RangeError("Blowing strength must be between 0 and 100");
    }
    return .95 * Math.pow(breath / 100, .65);
  }
  function fluteJetAt(x) {
    if (!Number.isFinite(x) || Math.abs(x) > 1.000001) throw new RangeError("Invalid jet input");
    const x2 = x * x;
    return x + .30 * x2 - .27 * x2 * x + .08 * x2 * x2 * x;
  }
  function fluteNoiseGain(breath = DEFAULT_BREATH) {
    fluteDrive(breath); // Validate, including the completely silent zero case.
    return DEFAULTS.flute.noise * Math.pow(breath / DEFAULT_BREATH, .8);
  }
  // Complex transfer function of Web Audio's standard RBJ biquad (Q=1/sqrt(2)).
  // Same coefficients as a lowpass/highpass BiquadFilterNode, up to Web Audio's
  // implementation and the audio device's sample rate.
  function biquadResponse(type, frequency, cutoff, sampleRate) {
    const omega = 2 * Math.PI * cutoff / sampleRate;
    const c = Math.cos(omega), alpha = Math.sin(omega) / (2 * FLUTE_Q);
    const b0 = (1 + (type === "highpass" ? c : -c)) / 2;
    const b1 = type === "highpass" ? -(1 + c) : 1 - c;
    const b2 = b0;
    const a0 = 1 + alpha, a1 = -2 * c, a2 = 1 - alpha;
    const angle = 2 * Math.PI * frequency / sampleRate;
    const br = b0 + b1 * Math.cos(angle) + b2 * Math.cos(2 * angle);
    const bi = -b1 * Math.sin(angle) - b2 * Math.sin(2 * angle);
    const ar = a0 + a1 * Math.cos(angle) + a2 * Math.cos(2 * angle);
    const ai = -a1 * Math.sin(angle) - a2 * Math.sin(2 * angle);
    const divisor = ar * ar + ai * ai;
    return { real: (br * ar + bi * ai) / divisor,
      imag: (bi * ar - br * ai) / divisor };
  }
  function fluteComponents(breath = DEFAULT_BREATH, hz = 440, sampleRate = FLUTE_PLOT_SAMPLE_RATE) {
    const a = fluteDrive(breath);
    if (!Number.isFinite(hz) || hz < MIN_HZ || hz > MAX_HZ ||
        !Number.isFinite(sampleRate) || sampleRate < 16000) {
      throw new RangeError("Invalid flute pitch or sample rate");
    }
    const a2 = a * a, a3 = a2 * a, a5 = a3 * a2;
    const sourceSin = [a - .2025 * a3 + .05 * a5, 0, .0675 * a3 - .025 * a5,
      0, .005 * a5, 0, 0, 0];
    const sourceCos = [0, -.15 * a2, 0, 0, 0, 0, 0, 0];
    return sourceSin.map((sin, index) => {
      const frequency = (index + 1) * hz;
      const hp = biquadResponse("highpass", frequency, FLUTE_HIGHPASS, sampleRate);
      const lp = biquadResponse("lowpass", frequency, FLUTE_LOWPASS, sampleRate);
      const real = hp.real * lp.real - hp.imag * lp.imag;
      const imag = hp.real * lp.imag + hp.imag * lp.real;
      const cos = sourceCos[index];
      return Object.freeze({ sin: FLUTE_TONE_GAIN * (sin * real - cos * imag),
        cos: FLUTE_TONE_GAIN * (sin * imag + cos * real) });
    });
  }
  function fluteWaveFromComponents(phase, components) {
    if (!Number.isFinite(phase) || !Array.isArray(components) || components.length !== 8) {
      throw new RangeError("Invalid flute phase or components");
    }
    return components.reduce((sum, c, index) =>
      sum + c.sin * Math.sin((index + 1) * phase) + c.cos * Math.cos((index + 1) * phase), 0);
  }
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
  function partials(kind, breath = DEFAULT_BREATH, hz = 440) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown held-sound model");
    if (kind === "flute") return fluteComponents(breath, hz).map(c => Math.hypot(c.sin, c.cos));
    return PARTIALS[kind];
  }
  function defaults(kind) {
    if (!KINDS.includes(kind)) throw new RangeError("Unknown held-sound model");
    return DEFAULTS[kind];
  }
  const PEAKS = Object.freeze(Object.fromEntries(["violin", "morin"].map(kind => {
    let peak = 0;
    for (let i = 0; i < 4096; i++) {
      const phase = 2 * Math.PI * i / 4096;
      const value = PARTIALS[kind].reduce((sum, strength, index) =>
        sum + strength * Math.sin((index + 1) * phase), 0);
      peak = Math.max(peak, Math.abs(value));
    }
    return [kind, peak];
  })));
  function waveAt(phase, kind, breath = DEFAULT_BREATH, hz = 440) {
    if (!Number.isFinite(phase)) throw new RangeError("Invalid wave phase");
    if (kind === "flute") return fluteWaveFromComponents(phase, fluteComponents(breath, hz));
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
    EXAMPLE_HOLD, DEFAULT_BREATH, FLUTE_TONE_GAIN, FLUTE_HIGHPASS, FLUTE_LOWPASS, FLUTE_Q,
    validate, defaults, partials, waveAt, fluteDrive, fluteJetAt, fluteNoiseGain,
    fluteComponents, fluteWaveFromComponents, smoothstep,
    attackLevelAt, releaseLevelAt, envelopeAt, sliderToHz, hzToSlider
  });
});
