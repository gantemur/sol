/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const model = require("./model.js");

function nearbyAmplitude(spectrum, hertz) {
  const bin = Math.round(hertz / spectrum.binHz);
  return Math.max(...spectrum.magnitudes.slice(Math.max(0, bin - 1), bin + 2));
}
function strongestFrequency(spectrum, from = 100, to = 3000) {
  let bestBin = 0, best = -1;
  for (let bin = Math.ceil(from / spectrum.binHz); bin <= Math.floor(to / spectrum.binHz); bin++) {
    if (spectrum.magnitudes[bin] > best) { best = spectrum.magnitudes[bin]; bestBin = bin; }
  }
  return bestBin * spectrum.binHz;
}

for (const name of model.PRESETS) {
  const source = model.synthesize(name);
  assert.equal(source.samples.length, 3 * 44100, name + ": duration");
  assert.ok(source.samples.some(value => value !== 0), name + ": must not be silent");
  assert.ok(source.samples.every(value => Number.isFinite(value) && Math.abs(value) <= 1), name + ": PCM bounds");
}
const sine = model.synthesize("sine");
const avg = model.spectrumAverage(sine.samples, sine.sampleRate);
assert.ok(Math.abs(strongestFrequency(avg) - 440) < 12, "average finds 440 Hz");
assert.ok(Math.abs(nearbyAmplitude(avg, 440) - 0.36) < 0.035, "Hann magnitude scale is calibrated");
const local = model.spectrumLocal(sine.samples, sine.sampleRate, 1.25);
assert.ok(Math.abs(strongestFrequency(local) - 440) < 20, "local view finds 440 Hz");
assert.ok(Math.abs(nearbyAmplitude(local, 440) - 0.36) < 0.035, "local magnitude scale is calibrated");

const two = model.synthesize("two"), twoSpectrum = model.spectrumAverage(two.samples, two.sampleRate);
assert.ok(nearbyAmplitude(twoSpectrum, 440) > 0.16, "first tone is present");
assert.ok(nearbyAmplitude(twoSpectrum, 660) > 0.15, "second tone is present");
assert.ok(nearbyAmplitude(twoSpectrum, 1000) < 0.02, "no invented third tone");
const sweep = model.synthesize("sweep");
const early = strongestFrequency(model.spectrumLocal(sweep.samples, sweep.sampleRate, 0.40));
const late = strongestFrequency(model.spectrumLocal(sweep.samples, sweep.sampleRate, 2.50));
assert.ok(late - early > 1000, "local spectrum follows evolving frequency");
const range = model.localRange(sine.samples, sine.sampleRate, 0);
assert.equal(range.start, 0, "window clamps at the start");
assert.ok(range.end <= 0.051 && range.end >= 0.049, "window matches waveform zoom");
const endRange = model.localRange(sine.samples, sine.sampleRate, 3);
assert.equal(endRange.end, 3, "window clamps at the end");
const envelope = model.waveformEnvelope(sine.samples, sine.sampleRate, 0.5, 1, 320);
assert.ok(Math.max(...envelope.maxima) > 0.35, "waveform preserves positive peaks");
assert.ok(Math.min(...envelope.minima) < -0.35, "waveform preserves negative peaks");
assert.equal(model.waveformScale(0.3, "1"), 1, "manual unit scale remains physical amplitude");
assert.equal(model.waveformScale(0.02, "auto"), 45, "auto scales a small amplitude with headroom");
assert.equal(model.waveformScale(0, "auto"), 50, "auto is capped for near-silence");
assert.equal(model.waveformScale(1, "auto"), 1, "auto never shrinks a full-amplitude signal");
assert.equal(model.waveformScale(0.8, "20"), 20, "manual magnification is independent of amplitude");
assert.equal(model.waveformScale(0.8, "13"), 13, "slider supports intermediate magnification");
assert.equal(model.waveformScale(0.8, "50"), 50, "manual magnification reaches the cap");
assert.throws(() => model.waveformScale(0.2, "0"), RangeError, "zero is reserved for auto");
assert.throws(() => model.waveformScale(0.2, "2.5"), RangeError, "manual magnification uses slider steps");
assert.throws(() => model.waveformScale(0.2, "100"), RangeError, "unsupported scale is rejected");
const wav = model.encodeWav16(new Float32Array([-1, -0.5, 0, 0.5, 1]), 44100);
const wavView = new DataView(wav);
assert.equal(wav.byteLength, 54, "mono 16-bit WAV has a 44-byte header");
assert.equal(String.fromCharCode(...new Uint8Array(wav, 0, 4)), "RIFF", "RIFF marker");
assert.equal(String.fromCharCode(...new Uint8Array(wav, 8, 4)), "WAVE", "WAVE marker");
assert.equal(wavView.getUint32(24, true), 44100, "WAV sample rate");
assert.equal(wavView.getUint16(22, true), 1, "WAV channel count");
assert.equal(wavView.getUint16(34, true), 16, "WAV bit depth");
assert.equal(wavView.getUint32(40, true), 10, "WAV data length");
assert.deepEqual(Array.from({ length: 5 }, (_, i) => wavView.getInt16(44 + 2 * i, true)),
  [-32768, -16384, 0, 16384, 32767], "signed PCM values are encoded correctly");
assert.throws(() => model.synthesize("unknown"), RangeError, "unknown preset rejected");

// Worklet integration in an isolated audio-worklet-like environment.
let registeredName, Registered, portMessages;
class AudioWorkletProcessor {
  constructor() { this.port = { onmessage: null, postMessage: msg => portMessages.push(msg) }; }
}
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "microphone-worklet.js"), "utf8"), {
  AudioWorkletProcessor, Float32Array, Number, Math, sampleRate: 48000,
  registerProcessor: (name, ctor) => { registeredName = name; Registered = ctor; }
});
assert.equal(registeredName, "sol-short-mic");
for (const seconds of [1, 2, 3, 4]) {
  portMessages = [];
  const recorder = new Registered({ processorOptions: { seconds } });
  for (let step = 0; step < seconds * 375; step++) {
    const input = new Float32Array(128).fill(0.25);
    const output = new Float32Array(128).fill(1);
    recorder.process([[input]], [[output]]);
    assert.ok(output.every(x => x === 0), "worklet has no audible monitor output");
  }
  assert.equal(portMessages.filter(message => message.type === "ended").length, 1, "automatic stop happens once");
  assert.equal(portMessages.at(-1).reason, "limit", "automatic stop reason");
  assert.equal(portMessages.filter(m => m.type === "chunk").reduce((n, m) => n + m.samples.length, 0),
    seconds * 48000, `${seconds}-second PCM capture has exact sample count`);
}
portMessages = [];
const shortRecorder = new Registered({ processorOptions: { seconds: 4 } });
shortRecorder.process([[new Float32Array(128).fill(-0.1)]], [[new Float32Array(128)]]);
shortRecorder.port.onmessage({ data: { type: "stop" } });
assert.equal(portMessages.at(-1).reason, "manual", "manual stop handled");
assert.equal(portMessages.filter(m => m.type === "chunk").reduce((n, m) => n + m.samples.length, 0), 128);

console.log("Sound waveform/spectrum: presets, spectra, scaling, WAV playback, and 1–4 s PCM capture passed.");
