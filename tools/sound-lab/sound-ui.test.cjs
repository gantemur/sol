"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const model = require("./sound-model.js");
const transientModel = require("./sound-transient.js");
const spectrumModel = require("./sound-spectrum.js");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const browserCode = fs.readFileSync(path.join(__dirname, "sound-lab.js"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);

test("the HTML has unique IDs and all scripted controls exist", () => {
  assert.equal(ids.length, new Set(ids).size);
  const usedIds = [...browserCode.matchAll(/\$\("([^"]+)"\)/g)].map(match => match[1]);
  for (const id of usedIds) assert.ok(ids.includes(id), "Missing #" + id);
  for (const wave of model.WAVEFORMS) assert.match(html, new RegExp('data-wave="' + wave + '"'));
  assert.match(html, /id="stopAll"/);
  assert.match(html, /id="frequencyInput"[^>]*type="number"/);
  assert.match(html, /<html lang="mn">/);
  assert.match(html, /id="fixedTimeCheck" checked/);
  assert.match(html, /src="sound-transient\.js"/);
  assert.match(html, /src="sound-spectrum\.js"/);
  assert.match(html, /id="strikeWorkspace"[^>]*hidden/);
  assert.match(browserCode, /Нотод тааруулах/);
  assert.doesNotMatch(browserCode, /ноот/i);
});

function fakePage(search = "") {
  const contexts = [];
  const analyzedAt = [];
  const animationFrames = new Map();
  let nextFrameId = 0;
  const classList = () => {
    const values = new Set();
    return {
      toggle(name, condition) {
        if (condition) values.add(name);
        else values.delete(name);
      },
      contains(name) { return values.has(name); }
    };
  };
  function element(dataset = {}) {
    const attributes = {};
    return {
      dataset,
      events: {},
      value: "",
      checked: false,
      textContent: "",
      classList: classList(),
      setAttribute(name, value) { attributes[name] = String(value); },
      getAttribute(name) { return attributes[name]; },
      addEventListener(name, callback) { this.events[name] = callback; },
      getBoundingClientRect() { return { width: 710, height: 210 }; },
      getContext() {
        const noop = () => {};
        return {
          setTransform: noop, clearRect: noop, fillRect: noop, beginPath: noop,
          moveTo: noop, lineTo: noop, stroke: noop, fillText: noop
        };
      }
    };
  }

  const elements = new Map(ids.map(id => [id, element()]));
  const waveButtons = model.WAVEFORMS.map(wave => element({ wave }));
  const strikeButtons = transientModel.KINDS.map(strike => element({ strike }));
  const drumButtons = Object.keys(transientModel.KICK_SIZES).map(drumSize => element({ drumSize }));
  const spectrumButtons = ["local", "overall"].map(spectrumView => element({ spectrumView }));
  const noteButtons = [60, 69, 72].map(note => element({ note: String(note) }));
  const noteGroup = element(), langGroup = element();
  const document = {
    documentElement: {},
    hidden: false,
    events: {},
    getElementById(id) { return elements.get(id) || null; },
    querySelectorAll(selector) {
      if (selector === "[data-wave]") return waveButtons;
      if (selector === "[data-strike]") return strikeButtons;
      if (selector === "[data-drum-size]") return drumButtons;
      if (selector === "[data-spectrum-view]") return spectrumButtons;
      if (selector === "[data-note]") return noteButtons;
      return [];
    },
    querySelector(selector) {
      if (selector === ".note-presets") return noteGroup;
      if (selector === ".lang-group") return langGroup;
      throw new Error("Unknown selector " + selector);
    },
    addEventListener(type, callback) { this.events[type] = callback; }
  };
  const window = {
    SoundLabModel: model,
    SoundLabTransientModel: transientModel,
    SoundLabSpectrum: {
      ...spectrumModel,
      spectrumAt(model, recipe, time) {
        analyzedAt.push(time);
        return spectrumModel.spectrumAt(model, recipe, time);
      }
    },
    location: { href: "https://example.org/sol/tools/sound-lab/" + search, search },
    history: { replaceState() {} },
    devicePixelRatio: 1,
    requestAnimationFrame(callback) {
      const id = ++nextFrameId;
      animationFrames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) { animationFrames.delete(id); },
    events: {},
    addEventListener(type, callback) { this.events[type] = callback; }
  };

  class FakeAudioContext {
    constructor() {
      this.state = "suspended";
      this.currentTime = 0;
      this.destination = {};
      this.oscillators = [];
      this.sampleRate = 44100;
      this.buffers = [];
      this.sources = [];
      contexts.push(this);
    }
    async resume() { this.state = "running"; }
    async suspend() { this.state = "suspended"; }
    createOscillator() {
      const osc = {
        type: "sine",
        frequency: {
          value: null,
          setValueAtTime(value) { this.value = value; },
          setTargetAtTime(value) { this.value = value; }
        },
        started: false,
        stopped: false,
        connect() {},
        disconnect() {},
        start() { this.started = true; },
        stop() {
          this.stopped = true;
          if (this.onended) this.onended();
        }
      };
      this.oscillators.push(osc);
      return osc;
    }
    createBuffer(channels, length, sampleRate) {
      const data = new Float32Array(length);
      const buffer = { channels, length, sampleRate, getChannelData() { return data; } };
      this.buffers.push(buffer);
      return buffer;
    }
    createBufferSource() {
      const source = {
        buffer: null, started: false, stopped: false,
        connect() {}, disconnect() {},
        start() { this.started = true; },
        stop() {
          this.stopped = true;
          if (this.onended) this.onended();
        }
      };
      this.sources.push(source);
      return source;
    }
    createGain() {
      return {
        gain: {
          value: 0,
          setValueAtTime(value) { this.value = value; },
          linearRampToValueAtTime(value) { this.value = value; },
          setTargetAtTime(value) { this.value = value; },
          cancelScheduledValues() {}
        },
        connect() {},
        disconnect() {}
      };
    }
  }
  window.AudioContext = FakeAudioContext;
  const sandbox = { document, window, URL, URLSearchParams, ResizeObserver: undefined };
  vm.runInNewContext(browserCode, sandbox, { filename: "sound-lab.js" });
  return {
    contexts, elements, document, window, waveButtons, strikeButtons, drumButtons, spectrumButtons,
    analyzedAt,
    tick(seconds) {
      if (contexts[0]) contexts[0].currentTime += seconds;
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      callbacks.forEach(callback => callback());
    },
    fire(id, type, event) {
      const target = elements.get(id);
      return target.events[type]({ target, ...(event || {}) });
    }
  };
}

test("initialization is silent; Play, live Hz, note snap, shape and Stop work", async () => {
  const app = fakePage();
  assert.equal(app.document.documentElement.lang, "mn", "Mongolian is the default");
  assert.equal(app.elements.get("langMn").getAttribute("aria-pressed"), "true");
  assert.equal(app.contexts.length, 0, "No AudioContext before Play");
  assert.equal(app.elements.get("playButton").getAttribute("aria-pressed"), "false");
  await app.fire("playButton", "click");
  assert.equal(app.contexts.length, 1);
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].type, "sine");
  assert.equal(context.oscillators[0].started, true);
  assert.equal(app.elements.get("playButton").getAttribute("aria-pressed"), "true");

  app.elements.get("frequencyInput").value = "437";
  app.fire("frequencyInput", "change");
  assert.equal(context.oscillators[0].frequency.value, 437);
  assert.equal(app.elements.get("frequencyInput").value, "437");

  app.elements.get("snapCheck").checked = true;
  app.fire("snapCheck", "change");
  assert.equal(context.oscillators[0].frequency.value, 440);
  assert.equal(app.elements.get("frequencyInput").value, "440");

  app.waveButtons[2].events.click();
  assert.equal(context.oscillators.length, 2);
  assert.equal(context.oscillators[1].type, "square");
  app.fire("stopAll", "click");
  assert.equal(app.elements.get("playButton").getAttribute("aria-pressed"), "false");
  assert.equal(context.oscillators[1].stopped, true);
});

test("fixed time view shows changing cycle counts; four-period zoom is optional", () => {
  const app = fakePage();
  assert.equal(app.elements.get("fixedTimeCheck").checked, true);
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 ms · 8.8 үе");
  app.elements.get("frequencyInput").value = "880";
  app.fire("frequencyInput", "change");
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 ms · 17.6 үе");
  assert.match(app.elements.get("waveSubtitle").textContent, /20 мс/);
  app.elements.get("fixedTimeCheck").checked = false;
  app.fire("fixedTimeCheck", "change");
  assert.equal(app.elements.get("windowLabel").textContent, "0–4.55 ms · 4 үе");
  assert.match(app.elements.get("waveSubtitle").textContent, /Дөрвөн үе/);
  app.fire("resetButton", "click");
  assert.equal(app.elements.get("fixedTimeCheck").checked, true);
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 ms · 8.8 үе");
});

test("language, volume, reset and hiding the page cannot trigger autoplay", async () => {
  const app = fakePage();
  app.fire("langEn", "click");
  assert.equal(app.document.documentElement.lang, "en");
  app.fire("langMn", "click");
  assert.equal(app.document.documentElement.lang, "mn");
  assert.equal(app.contexts.length, 0);
  app.elements.get("volumeSlider").value = "20";
  app.fire("volumeSlider", "input");
  assert.equal(app.elements.get("volumeReadout").textContent, "20%");
  await app.fire("playButton", "click");
  app.document.hidden = true;
  app.document.events.visibilitychange();
  assert.equal(app.elements.get("playButton").getAttribute("aria-pressed"), "false");
  app.fire("resetButton", "click");
  assert.equal(app.elements.get("frequencyInput").value, "440");
  assert.equal(app.elements.get("volumeReadout").textContent, "40%");
});

test("an explicit English URL overrides the Mongolian default", () => {
  const app = fakePage("?lang=en");
  assert.equal(app.document.documentElement.lang, "en");
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 ms · 8.8 cycles");
});

test("Strike & Pluck begins silently, triggers modeled buffers and bounds simultaneous voices", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("pureWorkspace").hidden, true);
  assert.equal(app.elements.get("strikeWorkspace").hidden, false);
  assert.equal(app.contexts.length, 0, "Changing category does not initialize audio");

  await app.fire("strikeButton", "click");
  assert.equal(app.contexts.length, 1);
  const context = app.contexts[0];
  assert.equal(context.sources.length, 1);
  assert.equal(context.sources[0].started, true);
  assert.ok(context.buffers[0].length > 10000);
  assert.ok(context.buffers[0].getChannelData(0).some(x => Math.abs(x) > 0.05));

  app.strikeButtons[1].events.click();
  assert.equal(app.elements.get("strikePitchGroup").hidden, true, "Kick has no fake musical note control");
  await app.fire("strikeButton", "click");
  assert.equal(context.sources[0].stopped, true, "Switching recipes stops the old sound");
  for (let n = 0; n < 5; n++) await app.fire("strikeButton", "click");
  assert.ok(context.sources.filter(x => !x.stopped).length <= 4);
  app.fire("stopAll", "click");
  assert.ok(context.sources.every(x => x.stopped), "Master Stop silences all transient voices");

  app.fire("modePure", "click");
  await app.fire("playButton", "click");
  assert.equal(app.contexts.length, 1, "Both categories share one AudioContext");
  app.fire("stopAll", "click");
});

test("transient controls change modeled decay and category changes cancel pending starts", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  app.elements.get("strikeDecay").value = "1.1";
  app.fire("strikeDecay", "input");
  assert.equal(app.elements.get("strikeDurationBadge").textContent, "τ = 1.1 s");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 ms – 3 s");
  app.elements.get("strikeFrequencyInput").value = "440";
  app.fire("strikeFrequencyInput", "change");
  assert.equal(app.elements.get("strikeNote").textContent, "A4 · Ля4");
  const pending = app.fire("strikeButton", "click");
  app.fire("modePure", "click");
  await pending;
  assert.equal(app.contexts[0].sources.length, 0, "No delayed sound after changing category");
  app.fire("modeStrike", "click");
  app.fire("strikeReset", "click");
  assert.equal(app.elements.get("strikeFrequencyInput").value, "220");
  assert.equal(app.elements.get("strikeDecayValue").textContent, "0.65 s");
});

test("string snap and small/medium/large drum recipes are separate controls", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  app.elements.get("strikeFrequencyInput").value = "437";
  app.fire("strikeFrequencyInput", "change");
  assert.equal(app.elements.get("strikeFrequencyInput").value, "437");
  app.elements.get("strikeSnap").checked = true;
  app.fire("strikeSnap", "change");
  assert.equal(app.elements.get("strikeFrequencyInput").value, "440");
  assert.equal(app.elements.get("strikeNote").textContent, "A4 · Ля4");
  app.strikeButtons[1].events.click();
  assert.equal(app.elements.get("strikePitchGroup").hidden, true);
  assert.equal(app.elements.get("strikeDrumSizeGroup").hidden, false);
  app.drumButtons[0].events.click();
  assert.equal(app.drumButtons[0].getAttribute("aria-pressed"), "true");
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "127 → 35 Hz");
  await app.fire("strikeButton", "click");
  assert.equal(app.contexts[0].sources.length, 1);
  app.drumButtons[2].events.click();
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "246 → 67 Hz");
  assert.equal(app.contexts[0].sources[0].stopped, true);
  await app.fire("strikeButton", "click");
  const first = app.contexts[0].buffers[0].getChannelData(0);
  const second = app.contexts[0].buffers[1].getChannelData(0);
  assert.notEqual(first[400], second[400], "Drum size changes actual audio samples");
});

test("one transient waveform supports zoom, pan, presets and time scrubbing", () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 ms – 3 s");
  app.elements.get("strikeViewPreset").value = "0.02";
  app.fire("strikeViewPreset", "change");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 ms – 20 ms");
  app.fire("strikeViewZoomOut", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 ms – 40 ms");
  app.fire("strikeViewRight", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "20 ms – 60 ms");
  app.fire("strikeViewFit", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 ms – 3 s");
  app.elements.get("strikeTimeSlider").value = "1500";
  app.fire("strikeTimeSlider", "input");
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 1.50 s");
  assert.equal(app.analyzedAt.at(-1), 1.5);
  app.spectrumButtons[1].events.click();
  assert.equal(app.spectrumButtons[1].getAttribute("aria-pressed"), "true");
  assert.match(app.elements.get("strikeSpectrumHint").textContent, /дундаж/);
});

test("Hit follows Web Audio playback time, then allows manual passive inspection", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  assert.equal(app.contexts.length, 0);
  await app.fire("strikeButton", "click");
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.00 s");
  app.tick(0.08);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.08 s");
  assert.ok(app.analyzedAt.at(-1) >= 0.08 - 1e-9);
  app.tick(0.15);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.23 s");
  app.elements.get("strikeTimeSlider").value = "450";
  app.fire("strikeTimeSlider", "input");
  assert.equal(app.analyzedAt.at(-1), 0.45);
  app.tick(0.3);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.45 s", "Manual scrub overrides visual follow");
  await app.fire("strikeButton", "click");
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.00 s", "New hit restarts follow");
  app.tick(0.10);
  app.fire("stopAll", "click");
  const stoppedAt = app.elements.get("strikeTimeValue").textContent;
  app.tick(0.1);
  assert.equal(app.elements.get("strikeTimeValue").textContent, stoppedAt);
});
