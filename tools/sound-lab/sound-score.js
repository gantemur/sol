/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT
 * Instrument-independent, spelled-pitch score events for Sound Lab Compose.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundLabScore = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  const LETTER_OFFSETS = Object.freeze({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 });
  const MIN_NOTE_HZ = 110;
  const MAX_NOTE_HZ = 880;
  const MAX_EVENTS = 128;
  const MAX_BEATS = 128;
  const MAX_SECONDS = 90;
  const TUNINGS = Object.freeze(["equal", "pythagorean", "just"]);
  const mod = (value, n) => ((value % n) + n) % n;

  function pitchNumber(pitch) {
    if (!pitch || !Object.hasOwn(LETTER_OFFSETS, pitch.letter) ||
        !Number.isInteger(pitch.accidental) || pitch.accidental < -2 || pitch.accidental > 2 ||
        !Number.isInteger(pitch.octave) || pitch.octave < 1 || pitch.octave > 7) {
      throw new RangeError("Invalid spelled pitch");
    }
    return 12 * (pitch.octave + 1) + LETTER_OFFSETS[pitch.letter] + pitch.accidental;
  }

  function pitchName(pitch) {
    const sign = pitch.accidental < 0 ? "♭".repeat(-pitch.accidental) :
      pitch.accidental > 0 ? "♯".repeat(pitch.accidental) : "";
    return pitch.letter + sign + pitch.octave;
  }

  function frequency(pitch, tuning = "equal", a4 = 440, temperamentModel = null) {
    if (!TUNINGS.includes(tuning) || !Number.isFinite(a4) || a4 < 400 || a4 > 480) {
      throw new RangeError("Invalid tuning or reference frequency");
    }
    const midi = pitchNumber(pitch);
    if (tuning === "equal") return a4 * 2 ** ((midi - 69) / 12);
    if (!temperamentModel || typeof temperamentModel.frequency !== "function") {
      throw new Error("Temperament model unavailable");
    }
    const normalizedOctave = Math.floor(midi / 12) - 1;
    return temperamentModel.frequency(tuning, mod(midi, 12), normalizedOctave, a4);
  }

  function secondsPerBeat(score) {
    return 60 / score.tempoQuarter;
  }

  function validate(score) {
    if (!score || score.version !== 1 || !Array.isArray(score.parts) || score.parts.length !== 1 ||
        !Array.isArray(score.parts[0].events) || !Number.isFinite(score.tempoQuarter) ||
        score.tempoQuarter < 30 || score.tempoQuarter > 320 ||
        !score.meter || !Number.isFinite(score.meter.quarterBeats) ||
        score.meter.quarterBeats <= 0) throw new RangeError("Invalid score structure");
    const events = score.parts[0].events;
    if (!events.length || events.length > MAX_EVENTS ||
        !Number.isFinite(score.totalBeats) || score.totalBeats <= 0 ||
        score.totalBeats > MAX_BEATS || score.totalBeats * secondsPerBeat(score) > MAX_SECONDS) {
      throw new RangeError("The score must contain 1–128 events and fit within 90 seconds");
    }
    let cursor = 0;
    for (const event of events) {
      if (!event || !["note", "rest"].includes(event.type) ||
          !Number.isFinite(event.startBeat) || Math.abs(event.startBeat - cursor) > 1e-7 ||
          !Number.isFinite(event.durationBeats) || event.durationBeats <= 0 ||
          event.durationBeats > 32 || !Number.isInteger(event.bar) || event.bar < 1) {
        throw new RangeError("Invalid event timing");
      }
      if (event.type === "note") pitchNumber(event.pitch);
      cursor += event.durationBeats;
    }
    if (Math.abs(cursor - score.totalBeats) > 1e-7) throw new RangeError("Score duration mismatch");
    return score;
  }

  return Object.freeze({ LETTER_OFFSETS, MIN_NOTE_HZ, MAX_NOTE_HZ, MAX_EVENTS,
    MAX_BEATS, MAX_SECONDS, TUNINGS, pitchNumber, pitchName, frequency, secondsPerBeat,
    validate });
});
