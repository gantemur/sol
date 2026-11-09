/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
const test = require("node:test");
const assert = require("node:assert/strict");
const model = require("./model.js");

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
}

test("four periodic waveforms retain their basic reference values", () => {
  assert.deepEqual(model.SHAPES, ["sine", "triangle", "square", "sawtooth"]);
  close(model.sampleWave("sine", .25), 1);
  close(model.sampleWave("triangle", .25), 1);
  close(model.sampleWave("triangle", .75), -1);
  close(model.sampleWave("square", .25), 1);
  close(model.sampleWave("square", .75), -1);
  close(model.sampleWave("sawtooth", .25), -.5);
  close(model.sampleWave("sawtooth", .75), .5);
  for (const shape of model.SHAPES) {
    for (const phase of [.037, .281, .749, 1.23]) {
      close(model.sampleWave(shape, phase + 4), model.sampleWave(shape, phase));
    }
  }
});

test("harmonics of sine, triangle, square and sawtooth are analytic", () => {
  for (const shape of model.SHAPES) close(model.harmonicMagnitude(shape, 1), 1);
  for (let n = 2; n <= 12; n++) {
    close(model.harmonicMagnitude("sine", n), 0);
    close(model.harmonicMagnitude("sawtooth", n), 1 / n);
    close(model.harmonicMagnitude("triangle", n), n % 2 ? 1 / (n * n) : 0);
    close(model.harmonicMagnitude("square", n), n % 2 ? 1 / n : 0);
  }
});

test("logarithmic slider covers 80–2000 Hz and maps 440 Hz back", () => {
  close(model.sliderToFrequency(0), 80);
  close(model.sliderToFrequency(1000), 2000);
  close(model.sliderToFrequency(model.frequencyToSlider(440)), 440);
  close(model.frequencyToSlider(model.sliderToFrequency(327)), 327);
});

test("bad waveform inputs are rejected", () => {
  assert.throws(() => model.sampleWave("other", .1), RangeError);
  assert.throws(() => model.sampleWave("sine", NaN), RangeError);
  assert.throws(() => model.harmonicMagnitude("other", 1), RangeError);
  assert.throws(() => model.frequencyToSlider(0), RangeError);
});
