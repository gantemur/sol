# Sound Lab (P1 — ideal signals)

Standalone browser-based Sol tool. Open [index.html](index.html) from the site or serve the repository as a static website. No build, dependencies, recording, external API, microphone permission, uploads or server are required.

## Shipped in P1

- Sine, triangle, square and sawtooth using Web Audio's built-in oscillators.
- Explicit click/tap to start audio; large Play/Stop toggle and always-visible master Stop. Gain defaults to a conservative 0.06 maximum signal amplitude (40% of a 0.15 cap), with short ramps when sound starts, stops or changes shape. No simultaneous instrument tracks.
- Live smooth pitch changes, logarithmic 80–2,000 Hz slider, larger exact numeric field for 20–12,000 Hz, and optional 12-tone-equal note snapping (A4 = 440 Hz). When snap is off, exact Hz is preserved. Quick C4, A4 and C5 presets show English and Mongolian fixed-do names.
- Volume, reset, English/Mongolian switch with optional ?lang=mn, and collapsed Settings containing the current tuning label and a fixed 20 ms plot-window toggle.
- Two labeled **ideal mathematical** plots: a time-domain waveform and a relative-amplitude harmonic spectrum. The plotted amplitudes, harmonic numbers and waveform shapes come from [sound-model.js](sound-model.js). These are **not** a microphone FFT or a live measurement of the speaker output.
- Small experiments and explanations about period, pitch, and harmonic content.

## Future extension boundaries

Keep three concepts separate:

1. Pitch identity: symbolic note or explicitly entered Hz.
2. Tuning context: P1 resolves symbolic notes through 12-TET only; later just/Pythagorean/alternative scales change how notes resolve into frequencies, not the written score.
3. Sound recipe: waveform/timbre now; later envelopes, modeled drums and plucked strings, harmonic builder, siren and modulated sounds.

Later work will add Compose and Analyze **when usable**, rather than displaying disabled tabs now. Score-wide tunings belong in Compose; Explore tunings stay in Settings and only affect note snapping.

## Checks

From repository root, with Node.js:

    node tools/sound-lab/sound-model.test.cjs
    node tools/sound-lab/sound-ui.test.cjs
    node scripts/check-static.js
    node scripts/test-static-check.js

Manual browser checklist (not covered by Node model tests):

1. Open the page in Chrome/Firefox/Safari on desktop and phone; no sound before Play.
2. Start Play, change wave, pitch and volume while sounding, then Stop. Test rapid changes and visibility loss. Check headphone volume carefully.
3. Check raw 437 Hz stays 437 with Snap off; turn Snap on and verify it rounds to A4 = 440 Hz.
4. Compare sine (one modeled peak), triangle and square (odd peaks), and sawtooth (all peaks); try fixed 20 ms window and watch the number of cycles change.
5. Toggle EN/MN; tab through controls with the keyboard, including Play and Stop; resize the page and ensure the charts remain readable.

## Scientific/technical limits

- Ideal Fourier magnitudes are relative to the fundamental; actual speaker/headphone responses, Nyquist filtering and hearing vary. The waveform plot is a mathematical model and the spectrum omits harmonic phase.
- There is no maximum listening-time or dB calibration; users should start at low volume, particularly with headphones.
- Higher frequencies may be outside the effective bandwidth of a device; avoid presenting them as proof of a child's individual hearing range.
- This release has no audio export, recording, live FFT, tuning comparison, chords or melody playback.
