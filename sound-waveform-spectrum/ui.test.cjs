/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const model = require("./model.js");

function harness({ permissionPending = false, workletPending = false } = {}) {
  const elements = new Map(), actions = [], captures = [], media = [];
  let grantPermission, finishWorklet;
  const track = { stop() { actions.push("track.stop"); }, addEventListener() {} };
  const stream = { getTracks() { return [track]; }, getAudioTracks() { return [track]; } };
  function element(id) {
    if (!elements.has(id)) {
      const listeners = new Map();
      elements.set(id, {
        id, value: "", textContent: "", disabled: false, dataset: {}, options: [],
        addEventListener(name, fn) { listeners.set(name, fn); },
        fire(name, value) {
          if (value !== undefined) this.value = value;
          const listener = listeners.get(name);
          assert.ok(listener, `listener for ${id}.${name}`);
          listener({ target: this });
        },
        setAttribute() {}, querySelector() { return null; }, appendChild() {},
        getBoundingClientRect() { return { width: 500 }; }
      });
    }
    return elements.get(id);
  }
  element("durationSelect").options = [1, 2, 3, 4].map(n => ({ value: String(n), textContent: "" }));
  const document = {
    getElementById: element, documentElement: { lang: "mn" },
    querySelectorAll() { return []; }, addEventListener() {},
    createElement(name) {
      if (name === "option") return { value: "", textContent: "" };
      assert.equal(name, "audio");
      const audio = {
        onended: null, onerror: null, volume: 1,
        play() { actions.push("audio.play"); return Promise.resolve(); },
        pause() { actions.push("audio.pause"); },
        removeAttribute() {}, load() {}
      };
      media.push(audio);
      return audio;
    }
  };
  class Context {
    constructor() {
      this.sampleRate = 48000; this.destination = {};
      this.audioWorklet = { addModule() {
        if (!workletPending) return Promise.resolve();
        return new Promise(resolve => { finishWorklet = resolve; });
      } };
    }
    resume() { return Promise.resolve(); }
    createMediaStreamSource() { return { connect() {}, disconnect() {} }; }
    createGain() { return { gain: { value: 1 }, connect() {}, disconnect() {} }; }
    close() { actions.push("context.close"); return Promise.resolve(); }
  }
  class Worklet {
    constructor() {
      this.port = { onmessage: null, postMessage() {} };
      captures.push(this);
    }
    connect() {} disconnect() {}
  }
  class TestURL extends URL {
    static createObjectURL() { actions.push("wav.url"); return "blob:local-test"; }
    static revokeObjectURL() { actions.push("wav.revoke"); }
  }
  const location = { search: "", href: "https://localhost/sound-waveform-spectrum/" };
  const window = {
    SoundWaveSpectrumModel: model, AudioContext: Context, AudioWorkletNode: Worklet,
    requestAnimationFrame() {}, devicePixelRatio: 1, addEventListener() {}
  };
  const navigator = { mediaDevices: {
    getUserMedia() {
      actions.push("mic.permission");
      if (!permissionPending) return Promise.resolve(stream);
      return new Promise(resolve => { grantPermission = () => resolve(stream); });
    }
  } };
  const storage = { getItem() { return null; }, setItem() {} };
  const sandbox = {
    document, window, navigator, location, localStorage: storage, history: { replaceState() {} },
    URL: TestURL, URLSearchParams, Float32Array, Blob, AudioWorkletNode: Worklet,
    requestAnimationFrame() {}, setInterval: () => 1,
    clearInterval() {}, setTimeout, clearTimeout, Promise
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "app.js"), "utf8"), sandbox,
    { filename: "sound-waveform-spectrum/app.js" });
  return { element, actions, captures, media,
    grant: () => grantPermission?.(), finishWorklet: () => finishWorklet?.() };
}

async function flush() { for (let i = 0; i < 8; i++) await Promise.resolve(); }

(async () => {
  const active = harness();
  active.element("recordButton").fire("click");
  await flush();
  assert.equal(active.captures.length, 1, "microphone capture starts");
  assert.match(active.element("recordButton").textContent, /Зогсоох/, "Stop is available during capture");
  active.captures[0].port.onmessage({ data: { type: "chunk", samples: new Float32Array(4800).fill(0.1) } });
  active.element("recordButton").fire("click");
  assert.ok(active.actions.includes("track.stop"), "Stop releases microphone track without worklet reply");
  assert.ok(active.actions.includes("context.close"), "Stop closes capture context");
  assert.match(active.element("recordButton").textContent, /Бичих/, "button returns to Record");
  assert.equal(active.element("sourceSelect").value, "recorded", "early stop keeps received PCM");
  active.element("playButton").fire("click");
  assert.ok(active.actions.includes("audio.play"), "recorded audio plays through native media element");
  assert.ok(active.actions.includes("wav.url"), "short PCM is converted to WAV for playback");
  active.element("playButton").fire("click");
  assert.ok(active.actions.includes("wav.revoke"), "Stop releases temporary playback URL");

  const pending = harness({ permissionPending: true });
  pending.element("recordButton").fire("click");
  assert.match(pending.element("recordButton").textContent, /Зогсоох/,
    "Stop remains available while permission is pending");
  pending.element("recordButton").fire("click");
  assert.ok(pending.actions.includes("context.close"), "cancel closes pending audio context immediately");
  pending.grant();
  await flush();
  assert.equal(pending.captures.length, 0, "cancelled permission does not start a recorder");
  assert.ok(pending.actions.includes("track.stop"), "late permission result releases microphone");
  const installing = harness({ workletPending: true });
  installing.element("recordButton").fire("click");
  await flush();
  installing.element("recordButton").fire("click");
  assert.ok(installing.actions.includes("track.stop"),
    "Stop immediately releases microphone even if audio worklet setup is stalled");
  assert.ok(installing.actions.includes("context.close"), "stalled worklet setup releases context");
  installing.finishWorklet();
  await flush();
  assert.equal(installing.captures.length, 0, "late worklet setup must not restart capture");
  console.log("Sound waveform/spectrum UI: immediate Stop, retained PCM, native playback, and pending cancellation passed.");
})().catch(error => { console.error(error); process.exitCode = 1; });
