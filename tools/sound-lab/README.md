# Sound Lab (P1 ideal signals + P2A strikes + P2B moving pitch)

Standalone browser-based Sol tool. Open [index.html](index.html) from the site or serve the repository as a static website. No build, external dependencies, microphone permission, uploads or server are required. Local WAV recording uses the browser's AudioWorklet API and requires a supported browser on a secure origin (as provided by the deployed site).

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
- One shared browser AudioContext across Pure Tones and Strike & Pluck. Each strike is a short one-shot buffer. Up to four triggered voices may overlap, with a strict gain cap; the global Stop, category changes and page hiding silence them. No autoplay, microphone or outside network calls.
- Independent [transient model tests](sound-transient.test.cjs) and extended [UI/audio simulation tests](sound-ui.test.cjs).

## P2A plot and controls refinement

- The transient mode now has **one navigable waveform plot**, replacing separate envelope and 20-ms charts. It opens with a fixed 0–3 s view; use +/- zoom, left/right pan, Fit, or 1 s / 200 ms / 20 ms presets. At full duration the min/max traces show the decay envelope without aliasing; zoom in to see the individual oscillations. The vertical cursor and blue-shaded analysis window remain visible when their time range intersects the plot.
- The **local Fourier spectrum** below uses a Hann-windowed 2048-point FFT (16 kHz model sampling; **128 ms analysis window**) of the same mathematical waveform as the speaker signal. Its analysis window is independent of waveform zoom. The fixed -60 to 0 dB relative scale lets fading harmonics visibly decrease rather than rescaling each frame to full height. Toggle to the time-averaged **Whole sound** spectrum for comparison.
- **Synchronization:** when the user taps Pluck/Strike, the time cursor and local spectrum follow the latest hit according to the Web Audio context clock. Another tap starts following the newest hit, even when earlier bounded voices still decay. On completion or Stop, the display remains available. Dragging the time slider or clicking the waveform switches to passive manual inspection without replaying or altering the actual audio. It never autoplays.
- The string pitch control now has an independent **Snap to notes** switch using the same 12-TET note resolution as Pure Tones. With Snap off, the exact entered frequency remains unchanged.
- The bass drum has **Large / Medium / Small** presets that scale its frequency trajectory (a deliberately stylized kick model, not a physical circular-membrane simulation). It deliberately does not display a spurious stable musical note. Changing a recipe control stops the previous triggered buffer so the plotted model cannot silently disagree with an earlier hit.
- [sound-spectrum.js](sound-spectrum.js) is a dependency-free analysis module. It and the updated [sound-transient.js](sound-transient.js) are testable without a browser. All graphics are modeled output or FFT of that model, not microphone measurements or the sound actually emitted by speakers.

## Added in P2B: Moving Pitch

- A third **Moving Pitch / Хувирдаг давтамж** mode illustrates changing frequency in two ways, without asking for microphone access or loading external sounds.
- **Theremin:** drag or hold a pointer on the rectangular pad. Horizontal position changes frequency **logarithmically from 120 to 1,600 Hz**; vertical position changes volume (top is louder). Releasing or cancelling the pointer stops the sound. Keyboard users can focus the pad, use the arrow keys to change the sound, Space/Enter to start or stop it, and Escape to stop.
- **Siren:** compare three frequency trajectories using the same low/high limits, repetitions per second (0.2–2), and volume: **Огцом / Abrupt** (a sharp two-tone alternation), **Аажим / Smooth** (sinusoidal frequency change: slow near either extreme, fastest midway), and **Шугаман / Linear** (geometric Hz interpolation: equal musical-pitch intervals per second). We removed the former linear-in-Hz option to keep the audible comparisons focused. Switching trajectories while playing updates the same oscillator without restarting it. The Siren Play/Stop button is always a deliberate user action; nothing starts on page load or when a trajectory changes.
- The **frequency-versus-time graph** has a logarithmic vertical scale. The linear-in-pitch path produces straight rising/falling lines, while the smooth path has rounded turning points; abrupt means instantaneous ideal jumps. All three are evaluations of one tested deterministic model shared by the graph and target audio frequency. Web Audio applies a short (~18 ms) smoothing time to live parameter updates, so physical playback approximates the ideal, especially at abrupt jumps.
- A **pitch-versus-time** graph shows the siren's mathematical four-second pattern or the theremin's actual browser-interaction history. Once playback exceeds four seconds, the graph advances as a rolling window. The lower plots show a **20 ms ideal sine wave** at the instantaneous frequency and a **single ideal spectral component** at that frequency; these are not sound-card or microphone measurements. The tone generator uses an actual sine oscillator whose frequency and gain are smoothed as controls move.
- Display units follow the interface language in **all three modes**, including controls, hints and chart axes: Mongolian uses **Гц**, **кГц**, **сек** and **мсек**; English uses **Hz**, **kHz**, **s** and **ms**. Changing language never alters the stored numerical frequency or time.
- Shares the existing browser AudioContext and master Stop. Audio has a 0.12 maximum linear amplitude, starts and ends with short gain ramps, is silent on mode changes or page hiding, and uses generation tokens to cancel pending starts safely. There is no autoplay, upload or network transmission.
- A separate dependency-free [motion model](sound-motion.js) and [motion model tests](sound-motion.test.cjs), plus simulated pointer, keyboard, siren and sound-lifecycle coverage in [UI tests](sound-ui.test.cjs).

## Local WAV recording

- One small **● REC** button lives in the sticky title bar beside the language switcher and global Stop. Press it, then play pure tones, strike instruments, move the theremin or play a siren. While recording, the same button switches to a **⬇ WAV** (Stop/Save) action with an elapsed-seconds counter. There is no permanently open recording panel occupying space below the mode tabs. Switching modes during a recording is supported; moments of silence are part of the file.
- Recordings are mono **16-bit PCM WAV**, capped at **15 seconds**. Pressing Stop/Save or the master Stop finalizes the capture and **initiates a local WAV download**. Reaching the cap also initiates a download. A small dismissible preview appears under the title-bar button, containing a built-in audio player and a repeat-download link if the browser blocks the automatic download. Timestamped `.wav` filenames identify captures. The browser keeps bytes locally (object URL); it never requests microphone access or transmits audio to a server. Hiding or leaving the page ends recording without an unsolicited automatic download.
- All modeled voices route to one shared gain bus that goes to the speakers and, while recording, to an [AudioWorklet capture processor](sound-recorder-worklet.js). The capture processor sends bounded Float32 sample chunks to the [recorder and WAV encoder](sound-recorder.js) and emits **silence** on its connected output so playback is not doubled. Worklet timing, the 15-second cap, PCM headers and playback/control lifecycle have automated tests in [sound-recorder.test.cjs](sound-recorder.test.cjs) and [sound-ui.test.cjs](sound-ui.test.cjs).
- This records **generated app audio**, not the microphone, external music, or ambient sounds. A browser without AudioWorklet support can still use the sound modes; the header recorder reports an error when recording is unavailable. On narrow phones, the control becomes an icon-only button with an accessible label.

## Future extension boundaries

Keep three concepts separate:

1. Pitch identity: symbolic note or explicitly entered Hz.
2. Tuning context: P1 resolves symbolic notes through 12-TET only; later just/Pythagorean/alternative scales change how notes resolve into frequencies, not the written score.
3. Sound recipe: waveform/timbre, modeled drums and plucked strings, and moving-pitch oscillator now; later envelopes, harmonic builder, richer modulation and score-driven instruments.

Later work will add Compose and Analyze **when usable**, rather than displaying disabled tabs now. Score-wide tunings belong in Compose; Explore tunings stay in Settings and only affect note snapping.

## Checks

From repository root, with Node.js:

    node tools/sound-lab/sound-model.test.cjs
    node tools/sound-lab/sound-transient.test.cjs
    node tools/sound-lab/sound-spectrum.test.cjs
    node tools/sound-lab/sound-motion.test.cjs
    node tools/sound-lab/sound-recorder.test.cjs
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
9. Enter Moving Pitch. Without a click, confirm silence. Hold and move around all four corners of the Theremin pad: right is higher frequency and top is louder. Release outside the pad; the sound should stop. Tab to the pad, use arrows, Space/Enter and Escape; check the focus indicator and `aria-pressed` state.
10. Switch to Siren. Play all three trajectories: **Огцом** (abrupt two-tone), **Аажим** (smooth sinusoidal), and **Шугаман** (linear in semitones). Keep the same limits and repetition rate while switching and compare their sound and graph curvature. Vary limits/speed while playing; verify the four-second graph, readout and instantaneous wave/component respond. Check that Stop, language changes, Reset, mode switching, browser tab hiding and the global Stop do not leave hidden audio playing. Confirm the rolling graph is continuous past four seconds.
11. Switch MN/EN while viewing each mode. Check that every numeric label (including the drum pitch, frequency axes, time zoom presets, siren rate, graph badges and tooltips) switches units without changing the value. Compare the trajectory captions with the logarithmic graph: linear in pitch is straight and sinusoidal slows at each endpoint. On narrow devices, verify the three trajectory choices and **мсек** ticks remain readable.
12. In the title bar, press REC while idle: confirm it does not play a tone or request microphone permission. The icon should become Save and the seconds count should advance. Start a pure tone, change its shape, switch to Strike & Pluck and tap, then try Siren/Theremin, all during one recording. Press the Save button: confirm a WAV download starts and a small preview opens under the header control. Play the downloaded file with an external audio player; confirm the recorded sound and silent intervals match. Use the popover download link if the browser blocked the automatic action. Dismiss the preview and repeat in EN and MN.
13. Use the master Stop to finalize and download while a recording is active. Leave REC running until it stops automatically at 15 seconds and saves. Check that hiding/closing the browser tab also stops capture **without an unsolicited download**, that a second recording replaces the preview/download, that the WAV is not unexpectedly loud, and that the speaker output is never doubled during capture. Verify unsupported-browser messaging if applicable. On phone-width screens, confirm the title bar, icon-only REC button and preview stay within the viewport.

## Scientific/technical limits

- Ideal Fourier magnitudes are relative to the fundamental; actual speaker/headphone responses, Nyquist filtering and hearing vary. The waveform plot is a mathematical model and the spectrum omits harmonic phase.
- There is no maximum listening-time or dB calibration; users should start at low volume, particularly with headphones.
- Higher frequencies may be outside the effective bandwidth of a device; avoid presenting them as proof of a child's individual hearing range.
- The local FFT analyzes a mathematically generated signal, not live microphone or sound-card audio. A short-time spectrum necessarily trades time resolution for frequency resolution; this release fixes its window at 128 ms, especially relevant for very low drum frequencies.
- This release has WAV export of locally generated sounds only; it has no microphone analysis, recording of external sounds, tuning comparison, chords or melody playback.
- The pluck is a damped harmonic sum, not a full physical string model. The drum is a decaying sinusoid with an idealized downward pitch sweep; neither is intended to sound like a professionally sampled instrument. A richer Karplus–Strong string model and noise-based snare may follow later.
- Theremin and siren sounds are **modeled moving-frequency sine oscillators**, not actual theremin or emergency-vehicle recordings. The siren's graphical path is a mathematical prediction and the moving single-component diagram is intentionally idealized: a real, rapidly frequency-changing oscillator creates additional time-dependent spectral spread and device-specific output.
