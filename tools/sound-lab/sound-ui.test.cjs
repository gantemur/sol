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
const beatsModel = require("./sound-beats.js");
const recorderModel = require("./sound-recorder.js");

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
  assert.match(html, /src="sound-beats\.js\?v=s013"/);
  assert.match(html, /src="sound-lab\.js\?v=s013"/);
  assert.match(html, /href="sound-lab\.css\?v=s013"/);
  assert.match(html, /src="sound-recorder\.js"/);
  assert.match(html, /id="recordPreview"[^>]*controls/);
  assert.match(html, /id="recordDownload"[^>]*download="sound-lab\.wav"/);
  assert.match(html, /class="top-actions"[\s\S]*id="recordButton"[\s\S]*id="stopAll"/);
  assert.doesNotMatch(html, /class="record-panel"/);
  assert.match(html, /id="recordResult"[^>]*hidden/);
  assert.match(html, /id="strikeWorkspace"[^>]*hidden/);
  assert.match(html, /id="motionWorkspace"[^>]*hidden/);
  assert.match(html, /id="mixWorkspace"[^>]*hidden/);
  assert.match(html, /id="mixExplanation"[^>]*hidden/);
  assert.match(html, /id="mixChallenge"[^>]*hidden/);
  assert.match(html, /id="modeMix"[^>]*data-i18n="modeMix"/);
  assert.match(html, /id="mixBaseInput"[^>]*type="number"/);
  assert.match(html, /data-i18n="unitHz">Гц<\/span>/);
  assert.match(html, /data-i18n="strikePresetOneSecond">1 сек<\/option>/);
  for (const pattern of motionModel.PATTERNS) {
    assert.match(html, new RegExp('data-siren-pattern="' + pattern + '"'));
  }
  assert.equal([...html.matchAll(/data-siren-pattern="/g)].length, 3);
  assert.equal([...html.matchAll(/data-mix-gap="/g)].length, 4);
  assert.match(html, /id="mixZoomIn"/);
  assert.match(html, /id="mixZoomOut"/);
  assert.match(html, /id="mixZoomValue"/);
  assert.doesNotMatch(html, /data-mix-window=/);
  assert.doesNotMatch(html, /data-siren-pattern="sweep"/);
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

function fakePage(search = "", supportWorklets = true) {
  const contexts = [];
  const analyzedAt = [];
  const objectUrls = [];
  const revokedUrls = [];
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
    const drawnText = [];
    return {
      dataset,
      drawnText,
      events: {},
      value: "",
      checked: false,
      textContent: "",
      style: {},
      classList: classList(),
      setAttribute(name, value) { attributes[name] = String(value); },
      getAttribute(name) { return attributes[name]; },
      addEventListener(name, callback) { this.events[name] = callback; },
      click() { this.clickCount = (this.clickCount || 0) + 1; if (this.events.click) this.events.click(); },
      getBoundingClientRect() { return { left: 0, top: 0, width: 710, height: 210 }; },
      setPointerCapture() {}, releasePointerCapture() {},
      pause() { this.paused = true; },
      getContext() {
        const noop = () => {};
        return {
          setTransform: noop, clearRect: noop, fillRect: noop, beginPath: noop,
          moveTo: noop, lineTo: noop, stroke: noop, fillText(value) { drawnText.push(String(value)); },
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
  const mixGapButtons = [0, 2, 4, 10].map(mixGap => element({ mixGap: String(mixGap) }));
  const noteButtons = [60, 69, 72].map(note => element({ note: String(note) }));
  const hzLabels = [...html.matchAll(/data-unit-hz="([^"]+)"/g)].map(match => element({ unitHz: match[1] }));
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
      if (selector === "[data-mix-gap]") return mixGapButtons;
      if (selector === "[data-note]") return noteButtons;
      if (selector === "[data-unit-hz]") return hzLabels;
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
    SoundLabBeats: beatsModel,
    SoundLabRecorder: recorderModel,
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
      this.worklets = [];
      this.constantSources = [];
      this.addedModules = [];
      this.audioWorklet = {
        addModule: async url => { this.addedModules.push(url); }
      };
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
    createConstantSource() {
      const source = {
        offset: { value: 1 }, started: false, stopped: false,
        connect() {}, disconnect() {},
        start() { this.started = true; },
        stop() { this.stopped = true; }
      };
      this.constantSources.push(source);
      return source;
    }
  }
  class FakeAudioWorkletNode {
    constructor(context, processorName, options) {
      this.processorName = processorName;
      this.options = options;
      this.port = {
        onmessage: null, lastPosted: null,
        postMessage(message) { this.lastPosted = message; },
        close() { this.closed = true; }
      };
      context.worklets.push(this);
    }
    connect() {} disconnect() {}
    send(message) { if (this.port.onmessage) this.port.onmessage({ data: message }); }
  }
  class FakeURL extends URL {
    static createObjectURL(blob) {
      const url = `blob:https://example.org/${objectUrls.length + 1}`;
      objectUrls.push({ url, blob });
      return url;
    }
    static revokeObjectURL(url) { revokedUrls.push(url); }
  }
  window.AudioContext = FakeAudioContext;
  window.AudioWorkletNode = supportWorklets ? FakeAudioWorkletNode : undefined;
  const sandbox = { document, window, URL: FakeURL, Blob, URLSearchParams, ResizeObserver: undefined };
  vm.runInNewContext(browserCode, sandbox, { filename: "sound-lab.js" });
  return {
    contexts, elements, document, window, waveButtons, strikeButtons, drumButtons, spectrumButtons,
    motionButtons, sirenPatternButtons, mixGapButtons,
    hzLabels, objectUrls, revokedUrls,
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

test("Record starts silently, captures generated sound, previews and downloads a valid WAV", async () => {
  const app = fakePage();
  assert.equal(app.elements.get("recordResult").hidden, true);
  assert.equal(app.elements.get("recordButton").getAttribute("aria-pressed"), "false");
  assert.equal(app.elements.get("recordButtonLabel").textContent, "REC");
  assert.equal(app.elements.get("recordSymbol").textContent, "●");
  assert.match(app.elements.get("recordButton").getAttribute("aria-label"), /15 сек/);
  assert.equal(app.contexts.length, 0);
  await app.fire("recordButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 0, "Recording alone must not start a tone");
  assert.deepEqual(context.addedModules, ["sound-recorder-worklet.js"]);
  assert.equal(context.worklets.length, 1);
  assert.equal(context.worklets[0].processorName, "sol-wav-capture");
  assert.equal(context.constantSources[0].started, true);
  assert.equal(app.elements.get("recordButton").getAttribute("aria-pressed"), "true");
  assert.equal(app.elements.get("recordButtonLabel").textContent, "WAV");
  assert.equal(app.elements.get("recordSymbol").textContent, "⬇");
  assert.match(app.elements.get("recordButton").getAttribute("aria-label"), /хадгалах/);
  assert.match(app.elements.get("recordStatus").textContent, /Дуу бичиж байна/);

  await app.fire("playButton", "click");
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].started, true);
  app.tick(0.12);
  assert.equal(app.elements.get("recordTimer").textContent, "0.1/15");
  assert.equal(app.elements.get("recordTimer").hidden, false);
  const capture = context.worklets[0];
  capture.send({ type: "samples", samples: new Float32Array([0, 0.5, -0.5, 1]) });
  await app.fire("recordButton", "click");
  assert.deepEqual(capture.port.lastPosted, { type: "stop" });
  assert.equal(app.elements.get("recordButton").disabled, true);
  capture.send({ type: "done" });
  assert.equal(context.constantSources[0].stopped, true);
  assert.equal(capture.port.closed, true);
  assert.equal(app.objectUrls.length, 1);
  assert.equal(app.objectUrls[0].blob.type, "audio/wav");
  const bytes = new Uint8Array(await app.objectUrls[0].blob.arrayBuffer());
  assert.equal(new TextDecoder().decode(bytes.subarray(0, 4)), "RIFF");
  assert.equal(new TextDecoder().decode(bytes.subarray(8, 12)), "WAVE");
  assert.equal(new DataView(bytes.buffer).getUint32(24, true), 44100);
  assert.equal(new DataView(bytes.buffer).getInt16(46, true), 16384);
  assert.equal(app.elements.get("recordResult").hidden, false);
  assert.equal(app.elements.get("recordDownload").clickCount, 1, "Stop/Save starts a real download");
  assert.equal(app.elements.get("recordPreview").src, app.objectUrls[0].url);
  assert.equal(app.elements.get("recordDownload").href, app.objectUrls[0].url);
  assert.match(app.elements.get("recordDownload").download, /^sound-lab-\d{4}-\d\d-\d\dT\d\d-\d\d-\d\d\.wav$/);
  assert.equal(app.elements.get("recordButton").disabled, false);
  assert.equal(app.elements.get("recordButton").getAttribute("aria-pressed"), "false");
  assert.equal(app.elements.get("recordButtonLabel").textContent, "REC");
  assert.equal(app.elements.get("recordTimer").hidden, true);
  app.fire("recordDismiss", "click");
  assert.equal(app.elements.get("recordResult").hidden, true, "The preview closes without clearing saved audio");
  app.fire("stopAll", "click");
  assert.equal(context.oscillators[0].stopped, true);
});

test("recording continues across modes, Stop ends it, and new captures replace old URLs", async () => {
  const app = fakePage();
  await app.fire("recordButton", "click");
  const context = app.contexts[0];
  app.fire("modeStrike", "click");
  await app.fire("strikeButton", "click");
  assert.equal(context.sources.length, 1);
  assert.equal(context.worklets.length, 1);
  assert.equal(app.elements.get("recordButton").getAttribute("aria-pressed"), "true");
  context.worklets[0].send({ type: "samples", samples: new Float32Array([0.2]) });
  app.fire("stopAll", "click");
  assert.equal(context.sources[0].stopped, true);
  assert.deepEqual(context.worklets[0].port.lastPosted, { type: "stop" });
  context.worklets[0].send({ type: "done" });
  const previous = app.elements.get("recordDownload").href;
  assert.equal(app.elements.get("recordDownload").clickCount, 1, "Master Stop saves an active recording");

  app.fire("modeMotion", "click");
  app.motionButtons[1].events.click();
  await app.fire("recordButton", "click");
  assert.equal(context.addedModules.length, 1, "The worklet module loads only once");
  await app.fire("sirenButton", "click");
  assert.equal(context.oscillators.length, 1);
  context.worklets[1].send({ type: "samples", samples: new Float32Array([0.3, -0.3]) });
  app.window.events.pagehide();
  assert.equal(context.oscillators[0].stopped, true);
  context.worklets[1].send({ type: "done" });
  assert.equal(app.objectUrls.length, 2);
  assert.equal(app.elements.get("recordDownload").clickCount, 1, "Page hiding finalizes without starting a new download");
  assert.deepEqual(app.revokedUrls, [previous]);
  assert.notEqual(app.elements.get("recordDownload").href, previous);
  app.fire("langEn", "click");
  assert.equal(app.elements.get("recordButtonLabel").textContent, "REC");
  assert.match(app.elements.get("recordButton").getAttribute("aria-label"), /15 seconds/);
  assert.equal(app.elements.get("recordTimer").hidden, true);
});

test("pagehide during recording preparation cancels before worklet installation", async () => {
  const app = fakePage();
  const pending = app.fire("recordButton", "click");
  app.window.events.pagehide();
  await pending;
  assert.equal(app.contexts[0].worklets.length, 0);
  assert.equal(app.elements.get("recordButton").getAttribute("aria-pressed"), "false");
  assert.equal(app.elements.get("recordResult").hidden, true);
});

test("the 15-second limit automatically downloads, and unsupported browsers show a visible error", async () => {
  const app = fakePage();
  await app.fire("recordButton", "click");
  const context = app.contexts[0];
  context.worklets[0].send({ type: "samples", samples: new Float32Array(44100 * 15) });
  context.worklets[0].send({ type: "done" });
  assert.equal(app.elements.get("recordResult").hidden, false);
  assert.equal(app.elements.get("recordDownload").clickCount, 1);
  assert.equal(app.objectUrls[0].blob.size, 44 + 44100 * 15 * 2);

  const unsupported = fakePage("", false);
  await unsupported.fire("recordButton", "click");
  assert.equal(unsupported.elements.get("recordButton").disabled, false);
  assert.match(unsupported.elements.get("recordStatus").textContent, /боломжгүй/);
  assert.equal(unsupported.elements.get("recordStatus").classList.contains("error"), true);
  assert.equal(unsupported.elements.get("recordStatus").classList.contains("sr-only"), false);
  assert.equal(unsupported.elements.get("recordResult").hidden, true);
});

test("fixed time view shows changing cycle counts; four-period zoom is optional", () => {
  const app = fakePage();
  assert.equal(app.elements.get("fixedTimeCheck").checked, true);
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 мсек · 8.8 үе");
  app.elements.get("frequencyInput").value = "880";
  app.fire("frequencyInput", "change");
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 мсек · 17.6 үе");
  assert.match(app.elements.get("waveSubtitle").textContent, /20 мсек/);
  app.elements.get("fixedTimeCheck").checked = false;
  app.fire("fixedTimeCheck", "change");
  assert.equal(app.elements.get("windowLabel").textContent, "0–4.55 мсек · 4 үе");
  assert.match(app.elements.get("waveSubtitle").textContent, /Дөрвөн үе/);
  app.fire("resetButton", "click");
  assert.equal(app.elements.get("fixedTimeCheck").checked, true);
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 мсек · 8.8 үе");
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

test("pure tones gain extra headroom without autoplay or exceeding the bounded peak", async () => {
  const app = fakePage();
  assert.equal(app.contexts.length, 0);
  await app.fire("playButton", "click");
  const context = app.contexts[0];
  assert.equal(context.gains.at(-1).gain.value, 0.12, "Default 40% produces 0.12 amplitude");
  app.elements.get("volumeSlider").value = "100";
  app.fire("volumeSlider", "input");
  assert.equal(context.gains.at(-1).gain.value, 0.3);
  app.fire("stopAll", "click");
  assert.equal(context.oscillators[0].stopped, true);
});

test("an explicit English URL overrides the Mongolian default", () => {
  const app = fakePage("?lang=en");
  assert.equal(app.document.documentElement.lang, "en");
  assert.equal(app.elements.get("windowLabel").textContent, "0–20 ms · 8.8 cycles");
});

test("Mongolian units cover static ranges, readouts and plotted axes; English remains unchanged", () => {
  const app = fakePage();
  assert.equal(app.hzLabels.length, 6);
  assert.ok(app.hzLabels.every(label => label.textContent.endsWith(" Гц")));
  assert.equal(app.elements.get("frequencyInput").getAttribute("aria-valuetext"), "440 Гц");
  assert.equal(app.elements.get("fundamentalBadge").textContent, "f₀ = 440 Гц");
  assert.match(app.elements.get("noteLabel").title, /440 Гц$/);
  assert.match(app.elements.get("periodBadge").textContent, /мсек$/);
  assert.ok(app.elements.get("spectrumCanvas").drawnText.some(label => label.endsWith(" кГц")));
  assert.ok(app.elements.get("waveCanvas").drawnText.some(label => label.endsWith(" мсек")));
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("strikeDecayValue").textContent, "0.65 сек");
  assert.ok(app.elements.get("strikeSpectrumCanvas").drawnText.some(label => label.endsWith(" Гц")));
  app.fire("modeMotion", "click");
  assert.equal(app.elements.get("motionCurrentHz").textContent, "440 Гц");
  assert.ok(app.elements.get("motionPitchCanvas").drawnText.some(label => label.endsWith(" сек")));
  assert.ok(app.elements.get("motionSpectrumCanvas").drawnText.some(label => label.endsWith(" Гц")));
  app.motionButtons[1].events.click();
  assert.equal(app.elements.get("sirenRateValue").textContent, "0.8 удаа/сек");
  app.sirenPatternButtons[1].events.click();
  assert.match(app.elements.get("motionPitchSubtitle").textContent, /Синусоид замнал/);
  app.sirenPatternButtons[2].events.click();
  assert.match(app.elements.get("motionPitchSubtitle").textContent, /Логарифм графикт шулуун/);
  app.fire("langEn", "click");
  assert.ok(app.hzLabels.every(label => label.textContent.endsWith(" Hz")));
  assert.equal(app.elements.get("sirenRateValue").textContent, "0.8 /s");
  assert.match(app.elements.get("motionPitchSubtitle").textContent, /semitones per second/);
  app.sirenPatternButtons[1].events.click();
  assert.match(app.elements.get("motionPitchSubtitle").textContent, /Sinusoidal in Hz/);
  assert.equal(app.elements.get("motionPitchBadge").textContent, "440 Hz");
  assert.equal(app.elements.get("strikeDecayValue").textContent, "0.65 s");
});

test("revised Mongolian wave descriptions, examples and mode labels render correctly", () => {
  const app = fakePage();
  assert.equal(app.elements.get("pagePhase").textContent, "01 · Энгийн дохионууд");
  assert.equal(app.elements.get("challengeText").textContent, "Давтамжийг хоёр дахин өсгө. Дууны өнгө болон үе хэрхэн өөрчлөгдөж байна вэ?");
  app.waveButtons[1].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Дээд сондгой гармоникууд нь сул.");
  assert.match(app.elements.get("challengeText").textContent, /дөрвөлжин/);
  app.waveButtons[2].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Сондгой гармоникууд нь хүчтэй.");
  app.waveButtons[3].events.click();
  assert.equal(app.elements.get("soundDescription").textContent, "Олон гармониктой, баялаг өнгөтэй.");
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
  assert.ok(Math.abs(context.gains.at(-1).gain.value - 0.1155) < 1e-10);
  assert.ok(context.buffers[0].length > 10000);
  assert.ok(context.buffers[0].getChannelData(0).some(x => Math.abs(x) > 0.05));

  app.elements.get("strikeStrength").value = "100";
  app.fire("strikeStrength", "input");
  await app.fire("strikeButton", "click");
  assert.equal(context.gains.at(-1).gain.value, 0.21, "Max impact keeps per-voice amplitude bounded");

  app.strikeButtons[1].events.click();
  assert.equal(app.elements.get("strikePitchGroup").hidden, true, "Kick has no fake musical note control");
  await app.fire("strikeButton", "click");
  assert.equal(context.sources[0].stopped, true, "Switching recipes stops the old sound");
  for (let n = 0; n < 5; n++) await app.fire("strikeButton", "click");
  assert.ok(context.sources.filter(x => !x.stopped).length <= 4);
  assert.ok(context.sources.filter(x => !x.stopped).length * 0.21 < 1);
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
  assert.equal(app.elements.get("strikeDurationBadge").textContent, "τ = 1.1 сек");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 мсек – 3 сек");
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
  assert.equal(app.elements.get("strikeDecayValue").textContent, "0.65 сек");
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
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "127 → 35 Гц");
  await app.fire("strikeButton", "click");
  assert.equal(app.contexts[0].sources.length, 1);
  app.drumButtons[2].events.click();
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "246 → 67 Гц");
  assert.equal(app.contexts[0].sources[0].stopped, true);
  await app.fire("strikeButton", "click");
  const first = app.contexts[0].buffers[0].getChannelData(0);
  const second = app.contexts[0].buffers[1].getChannelData(0);
  assert.notEqual(first[400], second[400], "Drum size changes actual audio samples");
});

test("one transient waveform supports zoom, pan, presets and time scrubbing", () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 мсек – 3 сек");
  app.elements.get("strikeViewPreset").value = "0.02";
  app.fire("strikeViewPreset", "change");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 мсек – 20 мсек");
  app.fire("strikeViewZoomOut", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 мсек – 40 мсек");
  app.fire("strikeViewRight", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "20 мсек – 60 мсек");
  app.fire("strikeViewFit", "click");
  assert.equal(app.elements.get("strikeWindowLabel").textContent, "0 мсек – 3 сек");
  app.elements.get("strikeTimeSlider").value = "1500";
  app.fire("strikeTimeSlider", "input");
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 1.50 сек");
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
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.00 сек");
  app.tick(0.08);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.08 сек");
  assert.ok(app.analyzedAt.at(-1) >= 0.08 - 1e-9);
  app.tick(0.15);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.23 сек");
  app.elements.get("strikeTimeSlider").value = "450";
  app.fire("strikeTimeSlider", "input");
  assert.equal(app.analyzedAt.at(-1), 0.45);
  app.tick(0.3);
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.45 сек", "Manual scrub overrides visual follow");
  await app.fire("strikeButton", "click");
  assert.equal(app.elements.get("strikeTimeValue").textContent, "t = 0.00 сек", "New hit restarts follow");
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
  assert.ok(context.gains.at(-1).gain.value > 0);
  assert.ok(context.gains.at(-1).gain.value <= 0.24);
  app.tick(0.05);
  assert.match(app.elements.get("motionPitchBadge").textContent, /Гц/);
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
  assert.equal(app.elements.get("sirenHighValue").textContent, "1,000 Гц");
  await app.fire("sirenButton", "click");
  const context = app.contexts[0];
  assert.equal(context.gains.at(-1).gain.value, 0.096, "Default siren level is louder but capped");
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

test("three siren trajectories change both the ideal readout and the playing oscillator without restarting audio", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  app.motionButtons[1].events.click();
  const patterns = motionModel.PATTERNS;
  assert.equal(app.sirenPatternButtons.length, 3);
  for (let i = 0; i < patterns.length; i++) {
    app.sirenPatternButtons[i].events.click();
    assert.equal(app.sirenPatternButtons[i].getAttribute("aria-pressed"), "true");
    for (let j = 0; j < patterns.length; j++) {
      if (j !== i) assert.equal(app.sirenPatternButtons[j].getAttribute("aria-pressed"), "false");
    }
  }
  assert.equal(app.contexts.length, 0, "Changing trajectory must not start sound");

  app.sirenPatternButtons[0].events.click();
  await app.fire("sirenButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  app.tick(0.15625); // 0.8 repetitions/s puts us one eighth of a cycle in.
  const observed = [];
  for (let i = 0; i < patterns.length; i++) {
    app.sirenPatternButtons[i].events.click();
    const expected = motionModel.sirenHzAt(0.15625, {
      pattern: patterns[i], lowHz: 440, highHz: 880, rate: 0.8
    });
    const actual = context.oscillators[0].frequency.value;
    assert.ok(Math.abs(actual - expected) < 1e-9, `${patterns[i]}: ${actual} != ${expected}`);
    assert.equal(app.elements.get("motionPitchBadge").textContent, `${Number(expected.toFixed(2)).toLocaleString("en-US")} Гц`);
    observed.push(actual);
  }
  assert.equal(new Set(observed.map(Math.round)).size, 3, "All three paths give distinct mid-sweep pitches");
  assert.equal(context.oscillators.length, 1, "Live switching reuses the same oscillator");
  app.fire("stopAll", "click");
  assert.equal(context.oscillators[0].stopped, true);
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

test("Combine Waves is silent until Play and begins with 440 + 444 Hz in one shared audio context", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  assert.equal(app.contexts.length, 0);
  assert.equal(app.elements.get("pureWorkspace").hidden, true);
  assert.equal(app.elements.get("mixWorkspace").hidden, false);
  assert.equal(app.elements.get("mixChallenge").hidden, false);
  assert.equal(app.elements.get("mixExplanation").hidden, false);
  assert.equal(app.elements.get("pagePhase").textContent, "04 · Хоёр авианы биение");
  assert.equal(app.elements.get("mixPairValue").textContent, "440 + 444 Гц");
  assert.equal(app.elements.get("mixBeatValue").textContent, "4 удаа/сек");
  assert.equal(app.mixGapButtons[2].getAttribute("aria-pressed"), "true");
  assert.equal(app.elements.get("mixButton").getAttribute("aria-pressed"), "false");
  await app.fire("mixButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 2);
  assert.ok(context.oscillators.every(oscillator => oscillator.type === "sine" && oscillator.started));
  assert.deepEqual(context.oscillators.map(oscillator => oscillator.frequency.value), [440, 444]);
  assert.equal(context.gains.at(-1).gain.value, 0.048);
  assert.equal(app.elements.get("mixButton").getAttribute("aria-pressed"), "true");
  assert.match(app.elements.get("mixStatus").textContent, /Зөрүүг өөрчилж/);
  await app.fire("mixButton", "click");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
  assert.equal(app.elements.get("mixButton").getAttribute("aria-pressed"), "false");
});

test("beating controls retune both voices; gap zero resynchronizes the pair without lingering voices", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  await app.fire("mixButton", "click");
  const context = app.contexts[0];
  app.elements.get("mixGapSlider").value = "10";
  app.fire("mixGapSlider", "input");
  assert.deepEqual(context.oscillators.map(oscillator => oscillator.frequency.value), [440, 450]);
  assert.equal(app.elements.get("mixBeatValue").textContent, "10 удаа/сек");
  assert.equal(app.mixGapButtons[3].getAttribute("aria-pressed"), "true");
  app.elements.get("mixBaseInput").value = "500";
  app.fire("mixBaseInput", "change");
  assert.deepEqual(context.oscillators.map(oscillator => oscillator.frequency.value), [500, 510]);
  assert.equal(app.elements.get("mixSpectrumBadge").textContent, "500 + 510 Гц");
  assert.equal(context.oscillators.length, 2, "Normal retuning preserves both oscillators");
  app.mixGapButtons[0].events.click();
  assert.equal(context.oscillators.length, 4, "Returning to zero resynchronizes the pair's relative phase");
  assert.ok(context.oscillators.slice(0, 2).every(oscillator => oscillator.stopped));
  assert.deepEqual(context.oscillators.slice(2).map(oscillator => oscillator.frequency.value), [500, 500]);
  assert.equal(app.elements.get("mixBeatValue").textContent, "0 удаа/сек");
  assert.match(app.elements.get("mixSpectrumFoot").textContent, /нэг оргил/);
  assert.equal(app.mixGapButtons[0].getAttribute("aria-pressed"), "true");
  app.elements.get("mixVolume").value = "100";
  app.fire("mixVolume", "input");
  assert.equal(context.gains.at(-1).gain.value, 0.12, "Each oscillator receives at most .12 amplitude");
  app.elements.get("mixBaseInput").value = "12";
  app.fire("mixBaseInput", "change");
  assert.equal(app.elements.get("mixBaseInput").value, "500", "Invalid input restores last valid frequency");
  assert.equal(app.elements.get("mixStatus").classList.contains("error"), true);
  app.mixGapButtons[2].events.click();
  assert.match(app.elements.get("mixSpectrumFoot").textContent, /хоёр давтамж/);
  assert.equal(context.oscillators.length, 4, "Leaving zero also reuses the synchronized pair");
  app.fire("mixReset", "click");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
  assert.equal(app.elements.get("mixBaseInput").value, "440");
  assert.equal(app.elements.get("mixGapValue").textContent, "4 Гц");
  assert.equal(app.elements.get("mixVolumeValue").textContent, "40%");
  assert.equal(app.elements.get("mixStatus").classList.contains("error"), false);
});

test("beats waveform zoom, pan and spectrum remain bilingual and show nearby frequencies", () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  assert.equal(app.elements.get("mixWindowLabel").textContent, "0 сек – 1 сек · 4 удаа/сек");
  assert.equal(app.elements.get("mixZoomValue").textContent, "1 сек");
  assert.equal(app.elements.get("mixZoomOut").disabled, false);
  assert.equal(app.elements.get("mixZoomIn").disabled, false);
  assert.ok(app.elements.get("mixSpectrumCanvas").drawnText.some(label => label.endsWith(" Гц")));
  assert.match(app.elements.get("mixWaveHint").textContent, /\+ дарж/);
  app.fire("mixZoomIn", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "250 мсек");
  app.fire("mixZoomIn", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "62.5 мсек");
  app.fire("mixZoomIn", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "15.63 мсек");
  assert.match(app.elements.get("mixWaveHint").textContent, /Цэнхэр шугам/);
  assert.equal(app.elements.get("mixViewLeft").disabled, true);
  app.fire("mixViewRight", "click");
  assert.equal(app.elements.get("mixWindowLabel").textContent, "7.81 мсек – 23.44 мсек · 4 удаа/сек");
  assert.equal(app.elements.get("mixViewLeft").disabled, false);
  app.fire("mixZoomIn", "click");
  app.fire("mixZoomIn", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "2 мсек");
  assert.equal(app.elements.get("mixZoomIn").disabled, true);
  assert.equal(app.elements.get("mixWindowLabel").textContent, "7.81 мсек – 9.81 мсек · 4 удаа/сек");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("pagePhase").textContent, "04 · Two-tone beats");
  assert.equal(app.elements.get("mixBeatValue").textContent, "4 pulses/s");
  assert.equal(app.elements.get("mixWindowLabel").textContent, "7.81 ms – 9.81 ms · 4 pulses/s");
  assert.equal(app.elements.get("mixZoomIn").getAttribute("aria-label"), "Zoom in to individual vibrations");
  assert.match(app.elements.get("mixWaveHint").textContent, /actual combined oscillation/);
  assert.equal(app.elements.get("mixBaseInput").getAttribute("aria-label"), "First frequency in hertz");
  for (let i = 0; i < 6; i++) app.fire("mixZoomOut", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "4 s");
  assert.equal(app.elements.get("mixZoomOut").disabled, true);
  assert.equal(app.elements.get("mixViewRight").disabled, true);
  assert.match(app.elements.get("mixWaveHint").textContent, /Press \+ to zoom/);
  app.fire("mixReset", "click");
  assert.equal(app.elements.get("mixZoomValue").textContent, "1 s");
  app.mixGapButtons[0].events.click();
  assert.match(app.elements.get("mixSpectrumFoot").textContent, /one spectral peak/);
  assert.match(browserCode, /recordSave: "Download WAV"/);
  assert.match(browserCode, /recordSave: "WAV татах"/);
  assert.doesNotMatch(browserCode, /Download WAV again|WAV дахин хадгалах/);
});

test("global Stop saves a recording of the combined tones, and modes cancel both voices", async () => {
  const app = fakePage();
  await app.fire("recordButton", "click");
  app.fire("modeMix", "click");
  await app.fire("mixButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 2);
  const capture = context.worklets[0];
  capture.send({ type: "samples", samples: new Float32Array([0.2, -0.2]) });
  app.fire("stopAll", "click");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
  assert.deepEqual(capture.port.lastPosted, { type: "stop" });
  capture.send({ type: "done" });
  assert.equal(app.elements.get("recordDownload").clickCount, 1);
  assert.equal(app.elements.get("recordResult").hidden, false);
  await app.fire("mixButton", "click");
  app.fire("modeMotion", "click");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
  assert.equal(app.elements.get("mixWorkspace").hidden, true);
  assert.equal(app.elements.get("motionWorkspace").hidden, false);
});

test("pending beat start is canceled when the tab changes or the page closes", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  const pending = app.fire("mixButton", "click");
  app.fire("modePure", "click");
  await pending;
  assert.equal(app.contexts[0].oscillators.length, 0);
  app.fire("modeMix", "click");
  await app.fire("mixButton", "click");
  assert.equal(app.contexts[0].oscillators.length, 2);
  app.window.events.pagehide();
  assert.ok(app.contexts[0].oscillators.every(oscillator => oscillator.stopped));
  assert.equal(app.elements.get("mixButton").getAttribute("aria-pressed"), "false");
});
