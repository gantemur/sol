# Дуу · Өндөр ба өнгө / Sound · Pitch and timbre

A deliberately small, browser-only Sol experiment adapted from Sound Lab's
**Pure tones → Waveforms** panel. The user can listen to four periodic waveforms,
change their fundamental frequency and loudness, and see an ideal 20 ms waveform
and its first twelve relative Fourier harmonic magnitudes.

## Run

Open `index.html` in a browser, or serve the folder statically. Its normal public
address is `https://gantemur.github.io/sol/sound-pitch-timbre/`. All dependencies
are local to this folder. No account, upload, external audio file or microphone
permission is needed. Audio starts only with the Play button.

Mongolian is the default; English is available with **MN / EN** or `?lang=en`.
An explicit URL choice takes precedence over the locally saved language choice.
Reloading returns the experiment controls to sine, 440 Hz and 40% loudness.

## Controls and model

- **Долгионы хэлбэр (дууны өнгө) / Waveform (timbre):** sine, triangle,
  square, and sawtooth, generated with a browser Web Audio oscillator.
- **Давтамж (дууны өндөр) / Frequency (pitch):** logarithmic slider over
  80–2000 Hz, initially 440 Hz. The fundamental period is `T = 1/f`.
- **Чанга–сул / Volume:** 0–100% with conservative single-oscillator gain
  (`maximum Web Audio gain = 0.24`, multiplied by the displayed fraction).
- **Waveform:** an ideal normalized mathematical wave displayed over a fixed
  20 ms window; its drawn amplitude scales with the volume control.
- **Harmonics:** ideal **relative magnitude coefficients**, normalized to the
  fundamental. Sine has only `f`; square has odd harmonics decreasing as `1/n`;
  triangle has odd harmonics decreasing as `1/n²`; sawtooth has all integer
  harmonics decreasing as `1/n`. The bar chart is **not a measured spectrum**.

The relative bar heights are independent of volume. The browser may band-limit
high-frequency oscillator harmonics, especially near the audio sampling limit;
the theoretical plot therefore need not exactly represent the audible output.
Pitch is modeled by the fundamental frequency and timbre by the periodic shape,
which is an intentionally limited introduction to real-world sounds.

For headphone safety, start at a low volume. Stopping, hiding the page or
leaving it ends playback. There is no recording, WAV export, note snapping,
custom harmonic editor or background microphone capture in this tool.

## Verification

From this folder:

```sh
node --test model.test.cjs
node --check model.js
node --check app.js
```

From the Sol repository root:

```sh
node scripts/check-static.js
node scripts/test-static-check.js
```

Check both languages and the 360–390 px layout in a browser, including
Play/Stop, all shapes, slider changes, playback while changing controls, and
backgrounding the tab. Automated numerical checks do not validate perceived
sound or browser audio permissions.

## Provenance and license

Copyright (c) 2026 Tsogtgerel Gantumur. This standalone package and ordinary
documentation use the included [MIT License](LICENSE).

The compact waveform and Fourier model was adapted from the author's
[Sound Lab](https://github.com/gantemur/soundlab) `sound-model.js` at
`8876d9ae839ec220a03769e83e04e2c5b678c7ec` (MIT), with a new minimal
interface and Web Audio controller. No external libraries, recordings, fonts
or third-party assets are bundled. This Sol clone does not share runtime code
with Sound Lab, and changes here do not change that standalone application.
