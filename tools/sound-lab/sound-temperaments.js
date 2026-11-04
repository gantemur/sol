/* Twelve-key historical temperament recipes, computed from fifth allocations.
 * Mathematical definitions follow Scholtz (Music Theory Online 4.4, 1998)
 * and Yamamoto (University of York thesis, 2015), linked in README.md.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundLabTemperaments = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  const CIRCLE = Object.freeze(["C", "G", "D", "A", "E", "B", "F♯", "C♯", "G♯", "E♭", "B♭", "F"]);
  const PITCH_CLASSES = Object.freeze([0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]);
  const NOTE_NAMES = Object.freeze(["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"]);
  const SYSTEMS = Object.freeze(["equal", "pythagorean", "meantone", "werckmeister", "vallotti"]);
  const SELECTABLE_SYSTEMS = Object.freeze([...SYSTEMS, "adjustable"]);
  const FIFTH_CENTS = 1200 * Math.log2(3 / 2);
  const PURE_MAJOR_THIRD = 1200 * Math.log2(5 / 4);
  const PYTHAGOREAN_COMMA = 12 * FIFTH_CENTS - 7 * 1200;
  const SYNTONIC_COMMA = 1200 * Math.log2(81 / 80);
  const PURE_MINOR_THIRD = 1200 * Math.log2(6 / 5);
  const EQUAL_NARROWING = PYTHAGOREAN_COMMA / 12;
  const WOLF_FREE_NARROWING = PYTHAGOREAN_COMMA / 11;
  const MEANTONE_NARROWING = SYNTONIC_COMMA / 4;
  const WOLF_EDGE = 8; // G♯ → E♭; enharmonic substitution at this twelve-key seam.
  const mod = (x, n) => ((x % n) + n) % n;

  function validateNarrowing(narrowing) {
    if (!Number.isFinite(narrowing) || narrowing < 0 || narrowing > 6) {
      throw new RangeError("Fifth narrowing must be between 0 and 6 cents");
    }
  }

  function widths(system, narrowing = MEANTONE_NARROWING) {
    if (!SELECTABLE_SYSTEMS.includes(system)) throw new RangeError("Unknown temperament");
    const result = Array(12).fill(FIFTH_CENTS);
    if (system === "equal") result.fill(700);
    if (system === "pythagorean" || system === "meantone" || system === "adjustable") {
      if (system === "adjustable") validateNarrowing(narrowing);
      const fifth = FIFTH_CENTS - (system === "pythagorean" ? 0 :
        system === "meantone" ? MEANTONE_NARROWING : narrowing);
      result.fill(fifth);
      result[WOLF_EDGE] = 8400 - 11 * fifth;
    }
    if (system === "werckmeister") for (const edge of [0, 1, 2, 5]) {
      result[edge] -= PYTHAGOREAN_COMMA / 4;
    }
    if (system === "vallotti") for (const edge of [11, 0, 1, 2, 3, 4]) {
      result[edge] -= PYTHAGOREAN_COMMA / 6;
    }
    if (Math.abs(result.reduce((a, b) => a + b, 0) - 8400) > 1e-8) {
      throw new Error("Fifths must close by seven octaves");
    }
    return result;
  }

  function fifths(system, narrowing) {
    return widths(system, narrowing).map((cents, index) => ({
      index, from: CIRCLE[index], to: CIRCLE[(index + 1) % 12], cents,
      deviation: cents - FIFTH_CENTS,
      closing: index === WOLF_EDGE,
      wolf: (system === "pythagorean" || system === "meantone" || system === "adjustable") &&
        index === WOLF_EDGE && Math.abs(cents - FIFTH_CENTS) > .05
    }));
  }

  function pitches(system, narrowing) {
    const span = widths(system, narrowing);
    const fromC = Array(12).fill(null);
    fromC[0] = 0;
    let position = 0;
    for (let step = 0; step < 11; step++) {
      position = mod(position + span[step], 1200);
      fromC[PITCH_CLASSES[step + 1]] = position;
    }
    if (fromC.some(value => value === null)) throw new Error("Missing pitch class");
    return fromC;
  }

  function frequency(system, pitchClass, octave = 4, a4 = 440, narrowing) {
    if (!Number.isInteger(pitchClass) || pitchClass < 0 || pitchClass > 11 ||
        !Number.isInteger(octave) || octave < 2 || octave > 6 ||
        !Number.isFinite(a4) || a4 < 400 || a4 > 480) throw new RangeError("Invalid pitch or reference A4");
    const fromC = pitches(system, narrowing);
    return a4 * 2 ** ((fromC[pitchClass] - fromC[9] + (octave - 4) * 1200) / 1200);
  }

  function chord(system, tonic = 0, quality = "major", a4 = 440, narrowing) {
    if (!Number.isInteger(tonic) || tonic < 0 || tonic > 11 ||
        !["major", "minor"].includes(quality)) throw new RangeError("Invalid chord");
    const offsets = quality === "major" ? [0, 4, 7] : [0, 3, 7];
    const notes = offsets.map(offset => {
      const index = tonic + offset;
      const pc = index % 12;
      const octave = 4 + Math.floor(index / 12);
      const hz = frequency(system, pc, octave, a4, narrowing);
      const equalHz = frequency("equal", pc, octave, a4);
      return { pc, octave, name: NOTE_NAMES[pc] + octave, hz, equalHz,
        deviation: 1200 * Math.log2(hz / equalHz) };
    });
    return { tonic, quality, notes,
      thirdCents: 1200 * Math.log2(notes[1].hz / notes[0].hz),
      fifthCents: 1200 * Math.log2(notes[2].hz / notes[0].hz) };
  }

  function deviations(system, a4 = 440, narrowing) {
    return NOTE_NAMES.map((name, pc) => {
      const hz = frequency(system, pc, 4, a4, narrowing);
      return { name, hz, centsFromEqual: 1200 * Math.log2(hz / frequency("equal", pc, 4, a4)) };
    });
  }

  // A stable Pythagorean *shadow* for each nominal note. A tempered pitch is
  // generally not a lattice point; its cents offset from this chosen shadow
  // does not determine a unique two-dimensional embedding.
  function latticeNotes(system, narrowing) {
    const pitch = pitches(system, narrowing);
    return CIRCLE.map((name, index) => {
      const pc = PITCH_CLASSES[index];
      const m = index <= WOLF_EDGE ? index : index - 12;
      const pureCents = mod(m * FIFTH_CENTS, 1200);
      const actualCents = mod(pitch[pc] - pitch[0], 1200);
      const deviation = mod(actualCents - pureCents + 600, 1200) - 600;
      return { pc, name, m, n: 0, pureCents, actualCents, deviation };
    });
  }

  function latticeChord(system, tonic = 0, quality = "major", narrowing) {
    const played = chord(system, tonic, quality, 440, narrowing);
    const rootM = latticeNotes(system, narrowing).find(note => note.pc === tonic).m;
    const major = quality === "major";
    const idealThird = major ? PURE_MAJOR_THIRD : PURE_MINOR_THIRD;
    return {
      played, rootM, idealThird,
      vertices: [
        { m: rootM, n: 0, deviation: 0, pc: played.notes[0].pc, name: played.notes[0].name },
        { m: rootM + (major ? 0 : 1), n: major ? 1 : -1,
          deviation: played.thirdCents - idealThird, pc: played.notes[1].pc, name: played.notes[1].name },
        { m: rootM + 1, n: 0, deviation: played.fifthCents - FIFTH_CENTS,
          pc: played.notes[2].pc, name: played.notes[2].name }
      ]
    };
  }

  // 12 fifths of 3:2 end at a *different lattice point*, not an off-lattice
  // point: octave reduction leaves the Pythagorean comma 23.46 cents.
  function closure() {
    return { start: { m: -3, n: 0, name: "E♭" },
      pureEnd: { m: 9, n: 0, name: "D♯" }, cents: PYTHAGOREAN_COMMA };
  }

  // The significant pair of near-overlapping partials for a fifth is 3f/2f;
  // for a major third it is 5f/4f. Both require richer sound than two partials.
  function partialGap(lowerHz, upperHz, interval = "fifth") {
    if (![lowerHz, upperHz].every(hz => Number.isFinite(hz) && hz > 0) ||
        !["fifth", "major", "minor"].includes(interval)) throw new RangeError("Invalid interval");
    const [lowerHarmonic, upperHarmonic] = interval === "fifth" ? [3, 2] :
      interval === "major" ? [5, 4] : [6, 5];
    const lowerPartial = lowerHarmonic * lowerHz;
    const upperPartial = upperHarmonic * upperHz;
    return { lowerHarmonic, upperHarmonic, lowerPartial, upperPartial,
      beatHz: Math.abs(lowerPartial - upperPartial) };
  }

  const SOUND_PARTIALS = Object.freeze([.68, .4, .36, .25, .23, .15]);
  function makeSamples(notes, sampleRate, mode = "chord", rich = true) {
    if (!Array.isArray(notes) || notes.length < 1 || notes.length > 3 ||
        notes.some(note => !Number.isFinite(note.hz) || note.hz < 100 || note.hz > 1800) ||
        !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000 ||
        !["chord", "melody"].includes(mode)) throw new RangeError("Invalid playback input");
    const step = .64, duration = mode === "melody" ? notes.length * step : 4;
    const samples = new Float32Array(Math.ceil(sampleRate * duration));
    const amplitudes = rich ? SOUND_PARTIALS : [1];
    const scale = rich ? .45 / notes.length : .48 / notes.length;
    for (let i = 0; i < samples.length; i++) {
      const t = i / sampleRate;
      const index = mode === "melody" ? Math.floor(t / step) : 0;
      const local = mode === "melody" ? t - index * step : t;
      const end = mode === "melody" ? step : duration;
      const env = Math.min(1, local / .025, (end - local) / .13);
      const list = mode === "melody" ? [notes[index]] : notes;
      for (const note of list) for (let h = 0; h < amplitudes.length; h++) {
        samples[i] += scale * env * amplitudes[h] * Math.sin(2 * Math.PI * (h + 1) * note.hz * local);
      }
    }
    return samples;
  }

  return Object.freeze({ CIRCLE, PITCH_CLASSES, NOTE_NAMES, SYSTEMS, SELECTABLE_SYSTEMS,
    FIFTH_CENTS, PURE_MAJOR_THIRD, PURE_MINOR_THIRD, PYTHAGOREAN_COMMA, SYNTONIC_COMMA,
    EQUAL_NARROWING, WOLF_FREE_NARROWING, MEANTONE_NARROWING, WOLF_EDGE,
    widths, fifths, pitches, frequency, chord, deviations, latticeNotes, latticeChord,
    closure, partialGap, makeSamples });
});
