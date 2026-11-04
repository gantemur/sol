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
  const FIFTH_CENTS = 1200 * Math.log2(3 / 2);
  const PURE_MAJOR_THIRD = 1200 * Math.log2(5 / 4);
  const PYTHAGOREAN_COMMA = 12 * FIFTH_CENTS - 7 * 1200;
  const SYNTONIC_COMMA = 1200 * Math.log2(81 / 80);
  const WOLF_EDGE = 8; // G♯ → E♭; enharmonic substitution at this twelve-key seam.
  const mod = (x, n) => ((x % n) + n) % n;

  function widths(system) {
    if (!SYSTEMS.includes(system)) throw new RangeError("Unknown temperament");
    const result = Array(12).fill(FIFTH_CENTS);
    if (system === "equal") result.fill(700);
    if (system === "pythagorean" || system === "meantone") {
      const fifth = system === "pythagorean" ? FIFTH_CENTS : FIFTH_CENTS - SYNTONIC_COMMA / 4;
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

  function fifths(system) {
    return widths(system).map((cents, index) => ({
      index, from: CIRCLE[index], to: CIRCLE[(index + 1) % 12], cents,
      deviation: cents - FIFTH_CENTS,
      wolf: (system === "pythagorean" || system === "meantone") && index === WOLF_EDGE
    }));
  }

  function pitches(system) {
    const span = widths(system);
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

  function frequency(system, pitchClass, octave = 4, a4 = 440) {
    if (!Number.isInteger(pitchClass) || pitchClass < 0 || pitchClass > 11 ||
        !Number.isInteger(octave) || octave < 2 || octave > 6 ||
        !Number.isFinite(a4) || a4 < 400 || a4 > 480) throw new RangeError("Invalid pitch or reference A4");
    const fromC = pitches(system);
    return a4 * 2 ** ((fromC[pitchClass] - fromC[9] + (octave - 4) * 1200) / 1200);
  }

  function chord(system, tonic = 0, quality = "major", a4 = 440) {
    if (!Number.isInteger(tonic) || tonic < 0 || tonic > 11 ||
        !["major", "minor"].includes(quality)) throw new RangeError("Invalid chord");
    const offsets = quality === "major" ? [0, 4, 7] : [0, 3, 7];
    const notes = offsets.map(offset => {
      const index = tonic + offset;
      const pc = index % 12;
      const octave = 4 + Math.floor(index / 12);
      const hz = frequency(system, pc, octave, a4);
      const equalHz = frequency("equal", pc, octave, a4);
      return { pc, octave, name: NOTE_NAMES[pc] + octave, hz, equalHz,
        deviation: 1200 * Math.log2(hz / equalHz) };
    });
    return { tonic, quality, notes,
      thirdCents: 1200 * Math.log2(notes[1].hz / notes[0].hz),
      fifthCents: 1200 * Math.log2(notes[2].hz / notes[0].hz) };
  }

  function deviations(system, a4 = 440) {
    return NOTE_NAMES.map((name, pc) => {
      const hz = frequency(system, pc, 4, a4);
      return { name, hz, centsFromEqual: 1200 * Math.log2(hz / frequency("equal", pc, 4, a4)) };
    });
  }

  return Object.freeze({ CIRCLE, PITCH_CLASSES, NOTE_NAMES, SYSTEMS,
    FIFTH_CENTS, PURE_MAJOR_THIRD, PYTHAGOREAN_COMMA, SYNTONIC_COMMA, WOLF_EDGE,
    widths, fifths, pitches, frequency, chord, deviations });
});
