/* Deterministic mathematics for ear-tuning intervals and octave-folding fifth chains. */
((root, factory) => {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundLabEarTune = api;
})(typeof window === "undefined" ? null : window, () => {
  "use strict";

  const START_HZ = 261.63; // C4, with the practice octave [C4,C5).
  const TASKS = Object.freeze({
    fifth: Object.freeze({ steps: 1, ratio: 3 / 2, label: "C–G" }),
    third: Object.freeze({ steps: 1, ratio: 5 / 4, label: "C–E" }),
    chain2: Object.freeze({ steps: 2, ratio: 3 / 2, label: "C–G–D" }),
    chain3: Object.freeze({ steps: 3, ratio: 3 / 2, label: "C–G–D–A" })
  });
  // Hidden offsets keep the slider centered without making zero the correct answer.
  // They are reproducible for exercises/tests; the students do not see them.
  const OFFSETS = Object.freeze({
    fifth: Object.freeze([18]), third: Object.freeze([-16]),
    chain2: Object.freeze([-19, 21]), chain3: Object.freeze([20, -17, 15])
  });
  const NOTE_NAMES = Object.freeze(["C", "G", "D", "A"]);

  function cents(a, b) { return 1200 * Math.log2(a / b); }

  function foldOctave(hz, baseHz = START_HZ) {
    if (!(hz > 0) || !(baseHz > 0)) throw new RangeError("Frequencies must be positive");
    let foldedHz = hz;
    let shifts = 0;
    while (foldedHz >= 2 * baseHz) { foldedHz /= 2; shifts--; }
    while (foldedHz < baseHz) { foldedHz *= 2; shifts++; }
    return { foldedHz, shifts };
  }

  function parameters(taskId, index) {
    const task = TASKS[taskId];
    if (!task || !Number.isInteger(index) || index < 0 || index >= task.steps) {
      throw new RangeError("Invalid ear-tuning task or step");
    }
    const ratio = task.ratio;
    const [p, q] = ratio === 5 / 4 ? [5, 4] : [3, 2];
    return { ratio, p, q, hiddenOffset: OFFSETS[taskId][index], note: NOTE_NAMES[index + 1] };
  }

  function step({ taskId = "fifth", index = 0, lowHz = START_HZ, adjustment = 0 } = {}) {
    const { ratio, p, q, hiddenOffset, note } = parameters(taskId, index);
    if (!(lowHz > 0) || !Number.isFinite(adjustment) || Math.abs(adjustment) > 60) {
      throw new RangeError("Invalid tuning frequency or adjustment");
    }
    const targetHz = lowHz * ratio;
    const errorCents = hiddenOffset + adjustment;
    const highHz = targetHz * Math.pow(2, errorCents / 1200);
    const folded = foldOctave(highHz);
    return {
      note, ratio, p, q, lowHz, targetHz, highHz, errorCents,
      nearBeatHz: Math.abs(p * lowHz - q * highHz),
      lowPartialHz: p * lowHz, highPartialHz: q * highHz,
      ...folded
    };
  }

  function cumulativeCents(history, currentError = 0) {
    return history.reduce((total, entry) => total + entry.errorCents, currentError);
  }

  function rating(errorCents) {
    const magnitude = Math.abs(errorCents);
    return magnitude <= 5 ? "excellent" : magnitude <= 15 ? "close" : "retry";
  }

  return { START_HZ, TASKS, NOTE_NAMES, OFFSETS, cents, foldOctave,
    parameters, step, cumulativeCents, rating };
});
