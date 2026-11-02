"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const model = require("./sound-model.js");
const transientModel = require("./sound-transient.js");
const spectrumModel = require("./sound-spectrum.js");
const motionModel = require("./sound-motion.js");

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
  assert.match(html, /src="sound-motion\.js"/);
  assert.match(html, /id="strikeWorkspace"[^>]*hidden/);
  assert.match(html, /id="motionWorkspace"[^>]*hidden/);
  assert.match(browserCode, /Нотод тааруулах/);
  assert.doesNotMatch(browserCode, /ноот/i);
});

test("compact header removes the redundant mode introductions but keeps one page heading", () => {
  assert.match(html, /<h1>Sound Lab<\/h1>/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /class="mode-bar"/);
  assert.doesNotMatch(html, /id="page(?:Eyebrow|Title|Intro)"/);
  assert.doesNotMatch(browserCode, /strikeEyebrow|strikeTitle|strikeIntro/);
  assert.match(html, /Дууны долгион яагаад өөр өөр сонсогддог вэ\?/);
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
      style: {},
      classList: classList(),
      setAttribute(name, value) { attributes[name] = String(value); },
      getAttribute(name) { return attributes[name]; },
      addEventListener(name, callback) { this.events[name] = callback; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 710, height: 210 }; },
      setPointerCapture() {}, releasePointerCapture() {},
      getContext() {
        const noop = () => {};
        return {
          setTransform: noop, clearRect: noop, fillRect: noop, beginPath: noop,
          moveTo: noop, lineTo: noop, stroke: noop, fillText: noop,
          arc: noop, fill: noop
        };
      }
    };
  }

  const elements = new Map(ids.map(id => [id, element()]));
  const waveButtons = model.WAVEFORMS.map(wave => element({ wave }));
  const strikeButtons = transientModel.KINDS.map(strike => element({ strike }));
  const drumButtons = Object.keys(transientModel.KICK_SIZES).map(drumSize => element({ drumSize }));
  const spectrumButtons = ["local", "overall"].map(spectrumView => element({ spectrumView }));
  const motionButtons = ["theremin", "siren"].map(motion => element({ motion }));
  const sirenPatternButtons = motionModel.PATTERNS.map(sirenPattern => element({ sirenPattern }));
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
      if (selector === "[data-motion]") return motionButtons;
      if (selector === "[data-siren-pattern]") return sirenPatternButtons;
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
    SoundLabMotionModel: motionModel,
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
      this.gains = [];
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
      const gain = {
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
      this.gains.push(gain);
      return gain;
    }
  }
  window.AudioContext = FakeAudioContext;
  const sandbox = { document, window, URL, URLSearchParams, ResizeObserver: undefined };
  vm.runInNewContext(browserCode, sandbox, { filename: "sound-lab.js" });
  return {
    contexts, elements, document, window, waveButtons, strikeButtons, drumButtons, spectrumButtons,
    motionButtons, sirenPatternButtons,
    analyzedAt,
    tick(seconds) {
      if (contexts[0]) contexts[0].currentTime += seconds;
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      callbacks.forEach(callback => callback());
    },
    fire(id, type, event) {
      const target = elements.get(id);
      return target.events[type]({ target, preventDefault() {}, button: 0, pointerId: 1, ...(event || {}) });
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

test("revised Mongolian wave descriptions, examples and mode labels render correctly", () => {
  const app = fakePage();
  assert.equal(app.elements.get("pagePhase").textContent, "01 · Энгийн дохионууд");
  assert.equal(app.elements.get("challengeText").textContent, "Давтамжийг хоёр дахин өсгө. Дууны өнгө болон үе хэрхэн өөрчлөгдөж байна вэ?");
  app.waveButtons[1].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Дээд сондгой гармоникууд нь сул");
  assert.match(app.elements.get("challengeText").textContent, /дөрвөлжин/);
  app.waveButtons[2].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Сондгой гармоникууд нь хүчтэй");
  app.waveButtons[3].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Олон гармониктой, баялаг өнгөтэй");
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("pagePhase").textContent, "02 · Загварчилсан дуу");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("pagePhase").textContent, "02 · Modeled sounds");
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

test("Moving Pitch theremin uses a pointer gesture, shared audio, live pitch and release-to-stop", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  assert.equal(app.elements.get("pureWorkspace").hidden, true);
  assert.equal(app.elements.get("motionWorkspace").hidden, false);
  assert.equal(app.elements.get("pagePhase").textContent, "03 · Хувирдаг давтамж");
  assert.match(app.elements.get("motionStatus").textContent, /^Бэлэн\./,
    "A newly opened sound category must say Ready, not Stopped");
  assert.equal(app.contexts.length, 0, "Mode switching remains silent");
  await app.fire("thereminPad", "pointerdown", { clientX: 355, clientY: 105 });
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].started, true);
  assert.equal(app.elements.get("thereminPad").getAttribute("aria-pressed"), "true");
  assert.match(app.elements.get("motionStatus").textContent, /Гараа авах/);
  const firstHz = context.oscillators[0].frequency.value;
  app.fire("thereminPad", "pointermove", { clientX: 600, clientY: 15 });
  assert.ok(context.oscillators[0].frequency.value > firstHz);
  assert.ok(context.gains[0].gain.value > 0);
  assert.ok(context.gains[0].gain.value <= 0.12);
  app.tick(0.05);
  assert.match(app.elements.get("motionPitchBadge").textContent, /Hz/);
  app.fire("thereminPad", "pointerup", { clientX: 600, clientY: 15 });
  assert.equal(context.oscillators[0].stopped, true);
  assert.equal(app.elements.get("thereminPad").getAttribute("aria-pressed"), "false");
});

test("theremin keyboard arrows change pitch; Space toggles and Escape safely stops", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  const before = parseFloat(app.elements.get("motionCurrentHz").textContent);
  app.fire("thereminPad", "keydown", { key: "ArrowRight" });
  assert.ok(parseFloat(app.elements.get("motionCurrentHz").textContent) > before);
  await app.fire("thereminPad", "keydown", { key: " " });
  assert.equal(app.contexts[0].oscillators[0].started, true);
  app.fire("thereminPad", "keydown", { key: "Escape" });
  assert.equal(app.contexts[0].oscillators[0].stopped, true);
});

test("siren changes two-tone/sweep pitch with its clock; Stop and mode switch cancel sound", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  app.motionButtons[1].events.click();
  assert.equal(app.elements.get("thereminControls").hidden, true);
  assert.equal(app.elements.get("sirenControls").hidden, false);
  app.elements.get("sirenHigh").value = "1000";
  app.fire("sirenHigh", "input");
  assert.equal(app.elements.get("sirenHighValue").textContent, "1000 Hz");
  await app.fire("sirenButton", "click");
  const context = app.contexts[0];
  assert.match(app.elements.get("motionStatus").textContent, /Дохио зогсоох/);
  assert.doesNotMatch(app.elements.get("motionStatus").textContent, /Гараа авах/);
  assert.equal(context.oscillators[0].frequency.value, 440);
  app.tick(0.7); // 0.8 cycles/s: after half a cycle, the high tone sounds.
  assert.equal(context.oscillators[0].frequency.value, 1000);
  app.sirenPatternButtons[1].events.click();
  app.tick(0.1);
  assert.ok(context.oscillators[0].frequency.value > 440);
  assert.ok(context.oscillators[0].frequency.value < 1000);
  app.fire("stopAll", "click");
  assert.equal(context.oscillators[0].stopped, true);
  assert.equal(app.elements.get("sirenButton").getAttribute("aria-pressed"), "false");
  await app.fire("sirenButton", "click");
  app.fire("modePure", "click");
  assert.equal(context.oscillators[1].stopped, true);
  assert.equal(app.elements.get("motionWorkspace").hidden, true);
});

test("pending siren start does not produce an orphan voice after leaving Moving Pitch", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  app.motionButtons[1].events.click();
  const pending = app.fire("sirenButton", "click");
  app.fire("modeStrike", "click");
  await pending;
  assert.equal(app.contexts[0].oscillators.length, 0);
});
