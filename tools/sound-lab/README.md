# Sound Lab (P1 ideal signals + P2A modeled strikes and local spectra)

Standalone browser-based Sol tool. Open [index.html](index.html) from the site or serve the repository as a static website. No build, dependencies, recording, external API, microphone permission, uploads or server are required.

## Shipped in P1

- Sine, triangle, square and sawtooth using Web Audio's built-in oscillators.
- Explicit click/tap to start audio; large Play/Stop toggle and always-visible master Stop. Gain defaults to a conservative 0.06 maximum signal amplitude (40% of a 0.15 cap), with short ramps when sound starts, stops or changes shape. No simultaneous instrument tracks.
- Live smooth pitch changes, logarithmic 80–2,000 Hz slider, larger exact numeric field for 20–12,000 Hz, and optional 12-tone-equal note snapping (A4 = 440 Hz). When snap is off, exact Hz is preserved. Quick C4, A4 and C5 presets show English and Mongolian fixed-do names.
- Volume, reset, Mongolian by default (use `?lang=en` for English), and collapsed Settings containing the current tuning label and a time-window toggle.
- Two labeled **ideal mathematical** plots: a time-domain waveform and a relative-amplitude harmonic spectrum. The time plot defaults to the **same 20 ms window**, so higher frequencies visibly fit more oscillations; its caption gives the number of cycles. Uncheck the fixed-window setting to zoom to four periods for inspecting the wave shape. The plotted amplitudes, harmonic numbers and waveform shapes come from [sound-model.js](sound-model.js). These are **not** a microphone FFT or a live measurement of the speaker output.
- Small experiments and explanations about period, pitch, and harmonic content.

## Added in P2A: Strike & Pluck

- A second **Strike & Pluck / Цохих ба татах** mode with two **generated models**, not recorded instruments: a plucked string with decaying harmonics and a bass drum whose pitch falls as its amplitude decays.
- Tap-to-trigger interaction, adjustable impact strength and decay time, plus a logarithmic pitch control for the string. The drum has no misleading single-note selector.
- One shared browser AudioContext across Pure Tones and Strike & Pluck. Each strike is a short one-shot buffer. Up to four triggered voices may overlap, with a strict gain cap; the global Stop, category changes and page hiding silence them. No autoplay, microphone, recording or outside network calls.
- Independent [transient model tests](sound-transient.test.cjs) and extended [UI/audio simulation tests](sound-ui.test.cjs).

## P2A plot and controls refinement

- The transient mode now has **one navigable waveform plot**, replacing separate envelope and 20-ms charts. It opens with a fixed 0–3 s view; use +/- zoom, left/right pan, Fit, or 1 s / 200 ms / 20 ms presets. At full duration the min/max traces show the decay envelope without aliasing; zoom in to see the individual oscillations. The vertical cursor and blue-shaded analysis window remain visible when their time range intersects the plot.
- The **local Fourier spectrum** below uses a Hann-windowed 2048-point FFT (16 kHz model sampling; **128 ms analysis window**) of the same mathematical waveform as the speaker signal. Its analysis window is independent of waveform zoom. The fixed -60 to 0 dB relative scale lets fading harmonics visibly decrease rather than rescaling each frame to full height. Toggle to the time-averaged **Whole sound** spectrum for comparison.
- **Synchronization:** when the user taps Pluck/Strike, the time cursor and local spectrum follow the latest hit according to the Web Audio context clock. Another tap starts following the newest hit, even when earlier bounded voices still decay. On completion or Stop, the display remains available. Dragging the time slider or clicking the waveform switches to passive manual inspection without replaying or altering the actual audio. It never autoplays.
- The string pitch control now has an independent **Snap to notes** switch using the same 12-TET note resolution as Pure Tones. With Snap off, the exact entered frequency remains unchanged.
- The bass drum has **Large / Medium / Small** presets that scale its frequency trajectory (a deliberately stylized kick model, not a physical circular-membrane simulation). It deliberately does not display a spurious stable musical note. Changing a recipe control stops the previous triggered buffer so the plotted model cannot silently disagree with an earlier hit.
- [sound-spectrum.js](sound-spectrum.js) is a dependency-free analysis module. It and the updated [sound-transient.js](sound-transient.js) are testable without a browser. All graphics are modeled output or FFT of that model, not microphone measurements or the sound actually emitted by speakers.

## Future extension boundaries

Keep three concepts separate:

1. Pitch identity: symbolic note or explicitly entered Hz.
2. Tuning context: P1 resolves symbolic notes through 12-TET only; later just/Pythagorean/alternative scales change how notes resolve into frequencies, not the written score.
3. Sound recipe: waveform/timbre now; later envelopes, modeled drums and plucked strings, harmonic builder, siren and modulated sounds.

Later work will add Compose and Analyze **when usable**, rather than displaying disabled tabs now. Score-wide tunings belong in Compose; Explore tunings stay in Settings and only affect note snapping.

## Checks

From repository root, with Node.js:

    node tools/sound-lab/sound-model.test.cjs
    node tools/sound-lab/sound-transient.test.cjs
    node tools/sound-lab/sound-spectrum.test.cjs
    node tools/sound-lab/sound-ui.test.cjs
    node scripts/check-static.js
    node scripts/test-static-check.js

Manual browser checklist (not covered by Node model tests):

1. Open the page in Chrome/Firefox/Safari on desktop and phone; no sound before Play.
2. Start Play, change wave, pitch and volume while sounding, then Stop. Test rapid changes and visibility loss. Check headphone volume carefully.
3. Check raw 437 Hz stays 437 with Snap off; turn Snap on and verify it rounds to A4 = 440 Hz.
4. Compare sine (one modeled peak), triangle and square (odd peaks), and sawtooth (all peaks). Raise pitch and watch cycles pack into the fixed 20 ms window, then uncheck the fixed-window setting to see four large periods.
5. Confirm the bare URL opens in Mongolian and `?lang=en` opens in English; tab through controls with the keyboard, including Play and Stop; resize the page and ensure the charts remain readable.
6. Enter Strike & Pluck. Confirm switching modes is silent until a tap; try the string at 220 and 440 Hz with Snap off/on and all three drum-size presets. Verify the sound changes and the drum pitch controls are replaced by size choices.
7. Compare 0–3 s, 1 s, 200 ms and 20 ms waveform views. Zoom and pan across the decay, then Fit; use both the time slider and clicking the plot to inspect different moments. Confirm the local spectrum evolves and the Whole sound toggle stays constant.
8. Tap several times: the time cursor should follow the **latest** hit, reaching its end without unintended replay. On Stop, the cursor stops and manual scrubbing still works. Change strike strength/decay, switch back to Pure Tones, and check that no hidden voice or loop continues. Test on phone speakers and headphones at low volume.

## Scientific/technical limits

- Ideal Fourier magnitudes are relative to the fundamental; actual speaker/headphone responses, Nyquist filtering and hearing vary. The waveform plot is a mathematical model and the spectrum omits harmonic phase.
- There is no maximum listening-time or dB calibration; users should start at low volume, particularly with headphones.
- Higher frequencies may be outside the effective bandwidth of a device; avoid presenting them as proof of a child's individual hearing range.
- The local FFT analyzes a mathematically generated signal, not live microphone or sound-card audio. A short-time spectrum necessarily trades time resolution for frequency resolution; this release fixes its window at 128 ms, especially relevant for very low drum frequencies.
- This release has no audio export, recording, microphone analysis, tuning comparison, chords or melody playback.
- The pluck is a damped harmonic sum, not a full physical string model. The drum is a decaying sinusoid with an idealized downward pitch sweep; neither is intended to sound like a professionally sampled instrument. A richer Karplus–Strong string model and noise-based snare may follow later.
