/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const model = require("./model.js");

function harness(resumeMode = "resolved") {
  const events = [], elements = new Map(), contexts = [], timers = [];
  const listeners = new Map();
  let resumeLater;
  class Context {
    constructor() { this.state = "suspended"; this.currentTime = 0; this.destination = {}; contexts.push(this); }
    createOscillator() {
      const oscillator = {
        type: "sine", frequency: { setValueAtTime() {}, setTargetAtTime() {} },
        connect() {}, disconnect() {}, onended: null,
        start() { events.push("oscillator.start"); },
        stop() { events.push("oscillator.stop"); }
      };
      return oscillator;
    }
    createGain() {
      return { gain: { setValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} },
        connect() {}, disconnect() {} };
    }
    resume() {
      events.push("context.resume");
      if (resumeMode === "rejected") {
        return Promise.reject(Object.assign(new Error("Not allowed"), { name: "NotAllowedError" }));
      }
      if (resumeMode === "pending") {
        return new Promise(resolve => { resumeLater = () => { this.state = "running"; resolve(); }; });
      }
      this.state = "running";
      return Promise.resolve();
    }
    close() { events.push("context.close"); this.state = "closed"; return Promise.resolve(); }
  }
  function element(id) {
    if (!elements.has(id)) {
      const callbacks = new Map();
      elements.set(id, {
        id, value: "", textContent: "", dataset: {},
        addEventListener(name, cb) { callbacks.set(name, cb); },
        fire(name, value) { if (value !== undefined) this.value = value;
          const cb = callbacks.get(name); assert.ok(cb, `listener for ${id}.${name}`); cb({ target: this }); },
        setAttribute() {}, getBoundingClientRect: () => ({ width: 500 })
      });
    }
    return elements.get(id);
  }
  const document = {
    getElementById: element,
    querySelectorAll: () => [], documentElement: { lang: "mn" },
    addEventListener(name, cb) { listeners.set(name, cb); }
  };
  const window = {
    PitchTimbreModel: model, AudioContext: Context, requestAnimationFrame() { return 1; },
    localStorage: { getItem() { return null; }, setItem() {} }, addEventListener() {}
  };
  const location = { search: "", href: "http://localhost/sound-pitch-timbre/" };
  window.location = location;
  function schedule(callback) { const timer = { callback, cancelled: false }; timers.push(timer); return timers.length - 1; }
  function cancel(index) { if (timers[index]) timers[index].cancelled = true; }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "app.js"), "utf8"), {
    document, window, URL, URLSearchParams, location, history: { replaceState() {} },
    localStorage: window.localStorage, setTimeout: schedule, clearTimeout: cancel, Promise
  }, { filename: "sound-pitch-timbre/app.js" });
  return { events, element, contexts, listeners, resolve: () => resumeLater?.(),
    runTimers() { for (const timer of timers) if (!timer.cancelled) timer.callback(); } };
}

(async () => {
  const ordinary = harness();
  ordinary.element("playButton").fire("click");
  assert.deepEqual(ordinary.events.slice(0, 2), ["oscillator.start", "context.resume"],
    "Web Audio source starts before the gesture is lost to an await");
  await Promise.resolve();
  assert.match(ordinary.element("playButton").textContent, /Зогсоох/, "playing control shows Stop");
  ordinary.element("frequencySlider").fire("input", "800");
  ordinary.element("volumeSlider").fire("input", "60");
  ordinary.element("playButton").fire("click");
  assert.ok(ordinary.events.includes("oscillator.stop"), "Stop ends the oscillator");
  assert.match(ordinary.element("playButton").textContent, /Тоглуулах/, "stopped control shows Play");

  const pending = harness("pending");
  pending.element("playButton").fire("click");
  assert.match(pending.element("playButton").textContent, /Зогсоох/, "Stop is active while resume is pending");
  pending.element("playButton").fire("click");
  assert.ok(pending.events.includes("context.close"), "Stop closes a pending audio context");
  pending.resolve();
  await Promise.resolve();
  assert.match(pending.element("playButton").textContent, /Тоглуулах/,
    "late resolution must not restart stopped sound");

  const stalled = harness("pending");
  stalled.element("playButton").fire("click");
  stalled.runTimers();
  assert.match(stalled.element("audioStatus").textContent, /audio context suspended/,
    "suspended audio start eventually reports an actionable reason");
  assert.ok(stalled.events.includes("context.close"), "stalled context is released");

  const blocked = harness("rejected");
  blocked.element("playButton").fire("click");
  await Promise.resolve();
  await Promise.resolve();
  assert.match(blocked.element("audioStatus").textContent, /NotAllowedError/,
    "a rejected browser audio start reports its actual reason");
  assert.ok(blocked.events.includes("context.close"), "failed context is released for retry");
  assert.match(blocked.element("playButton").textContent, /Тоглуулах/);
  console.log("Pitch/timbre: synchronous gesture start, Stop, cancellation, and rejection recovery passed.");
})().catch(error => { console.error(error); process.exitCode = 1; });
