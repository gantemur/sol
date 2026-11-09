/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const model = require("./model.js");

function harness({ permissionPending = false, workletPending = false } = {}) {
  const elements = new Map(), actions = [], captures = [], media = [], frames = [], timers = new Map();
  let grantPermission, finishWorklet, nextTimer = 0;
  const context2d = Object.fromEntries([
    "setTransform", "clearRect", "beginPath", "moveTo", "lineTo", "stroke", "fillText",
    "fillRect", "rect", "clip", "save", "restore", "fill"
  ].map(name => [name, () => {}]));
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
        getBoundingClientRect() { return { width: 500 }; },
        getContext() { return context2d; }
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
        onended: null, onerror: null, volume: 1, currentTime: 0,
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
    requestAnimationFrame(fn) { frames.push(fn); }, devicePixelRatio: 1, addEventListener() {}
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
    requestAnimationFrame(fn) { frames.push(fn); },
    setInterval(fn) { const id = ++nextTimer; timers.set(id, fn); return id; },
    clearInterval(id) { timers.delete(id); }, setTimeout, clearTimeout, Promise
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "app.js"), "utf8"), sandbox,
    { filename: "sound-waveform-spectrum/app.js" });
  function drawFrames() {
    // Draws scheduled while drawing will wait until the next browser frame.
    for (const frame of frames.splice(0)) frame();
  }
  return { element, actions, captures, media, drawFrames,
    tick(seconds) {
      for (const audio of media) audio.currentTime = seconds;
      for (const fn of [...timers.values()]) fn();
      drawFrames();
    },
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
  assert.match(active.element("status").textContent, /0\.1 сек/, "early Stop preserves a 0.1 s take, not the 3 s limit");
  active.element("playButton").fire("click");
  assert.ok(active.actions.includes("audio.play"), "recorded audio plays through native media element");
  assert.ok(active.actions.includes("wav.url"), "short PCM is converted to WAV for playback");
  assert.equal(active.media[0].volume, 0.65, "playback starts at the requested safe volume");
  active.element("volumeSlider").fire("input", "25");
  assert.equal(active.media[0].volume, 0.25, "live volume slider changes actual playback level");
  assert.equal(active.element("volumeReadout").textContent, "25%", "volume value is visible");
  active.element("playButton").fire("click");
  assert.ok(active.actions.includes("wav.revoke"), "Stop releases temporary playback URL");

  const playhead = harness();
  playhead.element("playButton").fire("click");
  playhead.tick(0.76);
  assert.match(playhead.element("waveCaption").textContent, /t = 0\.76 сек/,
    "playhead follows the media element's actual currentTime");
  playhead.element("verticalScaleSlider").fire("input", "13");
  playhead.drawFrames();
  assert.equal(playhead.element("verticalScaleReadout").textContent, "×13", "vertical slider updates the scale");
  playhead.element("verticalScaleSlider").fire("input", "0");
  playhead.drawFrames();
  assert.match(playhead.element("verticalScaleReadout").textContent, /Автомат \(×/, "zero restores automatic scaling");
  playhead.element("playButton").fire("click");

  const pointer = harness();
  pointer.element("recordButton").fire("click");
  await flush();
  pointer.captures[0].port.onmessage({ data: { type: "chunk", samples: new Float32Array(4800).fill(0.1) } });
  pointer.element("recordButton").fire("pointerdown");
  assert.ok(pointer.actions.includes("track.stop"), "pointer-down stops the mic before click dispatch");
  assert.match(pointer.element("status").textContent, /0\.1 сек/, "pointer Stop retains the partial take");
  pointer.element("recordButton").fire("click");
  assert.equal(pointer.actions.filter(action => action === "mic.permission").length, 1,
    "click following pointer-down Stop must not start a second recording");

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
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  assert.ok(html.indexOf('class="charts"') < html.indexOf('id="settings"'), "Settings is below both cards");
  console.log("Sound waveform/spectrum UI: pointer Stop, short takes, playback playhead, both sliders, and pending cancellation passed.");
})().catch(error => { console.error(error); process.exitCode = 1; });
