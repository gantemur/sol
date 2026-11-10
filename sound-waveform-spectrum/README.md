# Sound · Waveform and spectrum / Дуу · Долгион ба спектр

A small, bilingual Sol tool for viewing the waveform and magnitude spectrum of
generated sounds or a short microphone recording. It is a lightweight adaptation
of **Sound Lab**'s microphone/analysis ideas, not a general audio editor.

- Entry: `index.html`, hosted at <https://gantemur.github.io/sol/sound-waveform-spectrum/>.
- Standalone: copy this entire folder; no backend, packages, CDN or build step.
- Language: Mongolian by default, English via the upper-right buttons or
  `?lang=en`; language preference can be stored locally (without audio).
- Status: live-first initial release.

## Controls and interpretation

- Select one of six locally synthesized, three-second examples, or use the
  microphone button to record. **Listen / Сонсох** plays the selected complete
  sound. The selected microphone take appears as **My recording / Миний бичлэг**;
  it is replaced if a new take is made.
- Two sliders span the widths of the waveform and spectrum columns on wider
  screens, controlling playback volume (0–100%, initially 65%) and
  **vertical waveform scale / Босоо масштаб**. The scale slider has **Auto**
  at its left end and manual ×1 through ×50 steps; Auto is the initial setting.
  These are independent: magnification never boosts the actual recording or sound.
- The example picker and the combined two-button action row have matching,
  compact widths, including on phones. **Settings / Тохиргоо**, below the
  two cards, expands to a four-position microphone-duration slider
  (1, 2, 3 or 4 s; default 3).
  Recording starts only after an explicit button press and a browser permission
  request. Capture stops automatically at the selected duration; pressing Stop
  (including touch/pointer-down without waiting for a synthesized click)
  releases the microphone immediately, retaining samples received so far. Stop
  also cancels a pending permission request; a late-granted stream is released.
  The status shows the actual retained duration, which may be shorter than the
  selected limit. Both graphs update during capture (~10 Hz).
- During Listen playback, a **moving cyan playhead** follows the media element's
  actual current time (not an independent wall clock). In local-spectrum mode
  the local position and spectrum follow playback; average spectrum remains
  averaged. Playback time is shown in the waveform caption.
- The waveform initially displays the full sound as per-pixel minimum/maximum
  amplitude (rather than visually aliasing thousands of oscillations). Tap the
  waveform or use **Zoom in / Томруулах** to see a fixed ~50 ms detail window.
  Drag the zoomed waveform to move that window in time; tap again to return.
- The spectrum card or its action button switches between **Average / Дундаж**
  (power-averaged across the whole recording) and **Local / Агшин**
  (Hann-window spectrum around the draggable waveform cursor). Zoomed waveform
  always forces local spectrum from that exact ~50 ms window. Returning to the
  full view restores the previously selected average/local mode. During recording
  the spectrum is live and local to the latest samples; after recording the same
  two cards analyze the completed take.
- Graph axes: waveform time in milliseconds and *actual* digital sample amplitude
  (normally in [-1,1]), with vertical display magnification shown in the caption;
  logarithmic frequency in hertz and magnitude in dBFS (decibels relative to
  full-scale digital amplitude). **dBFS is not a calibrated sound-level meter**.
  Auto vertical magnification brings a small signal into view up to ×50; the axis
  labels remain in original PCM amplitude units. Manual magnification may clip
  tall samples; it does not change the audio volume.

## Computation and limitations

The generated presets are sine 440 Hz, two sines 440/660 Hz, a 150–2050 Hz
linear sweep, deterministic white noise, a modeled plucked guitar and a modeled
bell. These are illustrative synthetic signals, not field recordings.

The FFT is an unnormalized radix-2 forward transform. A symmetric Hann window
is applied to PCM data; one-sided magnitudes are divided by its coherent gain.
The average is the square root of mean squared *window magnitudes* using 4096
samples and 50% overlap. A ~50 ms local spectrum uses a Hann window of the
corresponding physical duration and zero padding to the next power of two for
plot resolution; padding does **not** improve physical frequency resolution.
Thus broad/fast-changing signals can have broad averaged spectra, while
different source intervals give different local spectra. Devices may apply
hardware audio processing despite requesting no echo suppression, noise
suppression or automatic gain.

Microphone capture uses `getUserMedia` and a small bounded Web Audio worklet.
The microphone is disconnected, audio tracks stopped and its capture context
closed on completion, early stop, or a hidden page. Sound is never monitored
to speakers. All samples remain in **page memory only**: the tool does not
upload, save, or automatically export audio. Reloading discards the take.
For playback, the selected PCM is converted in memory to a temporary 16-bit
mono WAV and played with a native browser audio element on the button gesture.
The temporary object URL is revoked on Stop, completion, or source change.
Microphone permission requires a secure context (HTTPS or an accepted local
origin) and a browser supporting AudioWorklet. The page may use the Sol-wide,
privacy-limited *page-visit* counter when hosted on `gantemur.github.io`; it
does not record inputs, audio or interactions.

The spectrum is magnitude-only, not phase-sensitive; the logarithmic display
covers 80–8000 Hz (bounded by Nyquist) and clips below −100 dBFS. Onsets and
short recordings can cause spectral leakage or low resolution; the zoomed
50 ms interval resolves frequency differences only on roughly a 20 Hz scale.
Microphone input volume depends on device and distance; the tool does not
estimate physical sound pressure.

## Source, license and verification

Copyright © 2026 **Tsogtgerel Gantumur**, MIT license in [`LICENSE`](LICENSE).
Original implementation and compact algorithms are adapted from the author's
MIT-licensed [Sound Lab](https://github.com/gantemur/soundlab) source,
particularly `sound-fft.js`, `sound-analysis-dsp.js`,
`sound-analysis-examples.js` and `sound-mic-capture-worklet.js` (consulted at
blobs `b2b6d16`, `765f5f4`, `739383e`, `687949c`). The implementation contains
no third-party audio samples or other runtime dependencies.

Run from the Sol repository root:

```sh
node sound-waveform-spectrum/model.test.cjs
node sound-waveform-spectrum/ui.test.cjs
node scripts/check-static.js
node scripts/test-static-check.js
node scripts/test-homepage.cjs
node scripts/test-analytics.cjs
```

Browser checks should include microphone permission denial, repeated 1/2/3/4 s
recordings, pointer-down early stop (shorter retained duration), live charts,
volume adjustment during playback, playhead movement, magnification from Auto
through ×50, local cursor drag, zoom + local-spectrum coupling, page visibility
cleanup, MN/EN, and mobile layouts. Automated sample tests cannot establish that
a particular phone's microphone permission UX works.
