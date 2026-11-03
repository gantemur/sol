"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const model = require("./sound-model.js");
const transientModel = require("./sound-transient.js");
const sustainModel = require("./sound-sustain.js");
const spectrumModel = require("./sound-spectrum.js");
const motionModel = require("./sound-motion.js");
const beatsModel = require("./sound-beats.js");
const intervalModel = require("./sound-intervals.js");
const harmonicModel = require("./sound-harmonics.js");
const noiseModel = require("./sound-noise.js");
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
  assert.match(html, /id="modeStrike"[^>]*>Цохих\/татах<\/button>/);
  assert.match(html, /id="modeSustain"[^>]*>Үлээх\/нумдах<\/button>/);
  assert.match(html, /id="fixedTimeCheck" checked/);
  assert.match(html, /src="sound-string\.js\?v=s017"/);
  assert.match(html, /src="sound-piano\.js\?v=s019"/);
  assert.match(html, /src="sound-transient\.js\?v=s019"/);
  assert.match(html, /src="sound-sustain\.js\?v=s020b"/);
  assert.match(html, /src="sound-spectrum\.js\?v=s017"/);
  assert.match(html, /src="sound-motion\.js\?v=s020c"/);
  assert.match(html, /src="sound-beats\.js"/);
  assert.match(html, /src="sound-intervals\.js\?v=s021"/);
  assert.match(html, /src="sound-harmonics\.js"/);
  assert.match(html, /src="sound-noise\.js"/);
  assert.match(html, /src="sound-lab\.js\?v=s021"/);
  assert.match(html, /href="sound-lab\.css\?v=s021"/);
  assert.match(html, /src="sound-recorder\.js"/);
  assert.match(html, /id="recordPreview"[^>]*controls/);
  assert.match(html, /id="recordDownload"[^>]*download="sound-lab\.wav"/);
  assert.match(html, /class="top-actions"[\s\S]*id="recordButton"[\s\S]*id="stopAll"/);
  assert.doesNotMatch(html, /class="record-panel"/);
  assert.match(html, /id="recordResult"[^>]*hidden/);
  assert.match(html, /id="strikeWorkspace"[^>]*hidden/);
  assert.match(html, /id="sustainWorkspace"[^>]*hidden/);
  assert.match(html, /id="sustainChallenge"[^>]*hidden/);
  assert.match(html, /id="sustainExplanation"[^>]*hidden/);
  assert.match(html, /id="motionWorkspace"[^>]*hidden/);
  assert.match(html, /id="mixWorkspace"[^>]*hidden/);
  assert.match(html, /id="mixExplanation"[^>]*hidden/);
  assert.match(html, /id="mixChallenge"[^>]*hidden/);
  assert.match(html, /id="harmonicWorkspace"[^>]*hidden/);
  assert.match(html, /id="intervalWorkspace"[^>]*hidden/);
  const intervalMarkup = html.slice(html.indexOf('id="intervalWorkspace"'), html.indexOf('id="harmonicWorkspace"'));
  assert.ok(intervalMarkup.indexOf('id="intervalButton"') < intervalMarkup.indexOf('id="intervalPresets"'),
    "Interval Play must appear immediately below the sub-tabs, before the settings");
  assert.ok(intervalMarkup.indexOf('id="intervalStatus"') < intervalMarkup.indexOf('id="intervalPresets"'),
    "Interval playback status belongs with its Play button above the settings");
  assert.match(html, /id="intervalChallenge"[^>]*hidden/);
  assert.match(html, /id="intervalExplanation"[^>]*hidden/);
  assert.match(html, /id="noiseWorkspace"[^>]*hidden/);
  assert.match(html, /id="harmonicChallenge"[^>]*hidden/);
  assert.match(html, /id="noiseChallenge"[^>]*hidden/);
  assert.doesNotMatch(html, /id="mixExperimentSwitch"/);
  assert.equal([...html.matchAll(/class="experiment-switch"/g)].length, 4);
  assert.equal([...html.matchAll(/data-mix-kind="/g)].length, 16);
  for (const kind of ["beats", "harmonics", "intervals", "noise"]) {
    assert.equal([...html.matchAll(new RegExp('data-mix-kind="' + kind + '"', 'g'))].length, 4);
  }
  assert.ok(html.indexOf('id="mixWorkspace"') < html.indexOf('class="experiment-switch"'),
    "Experiment choices belong within left panels, not under the four main tabs");
  for (const kind of transientModel.KINDS) assert.match(html, new RegExp('data-strike="' + kind + '"'));
  for (const chord of Object.keys(transientModel.STRUM_CHORDS)) {
    assert.match(html, new RegExp('data-guitar-chord="' + chord + '"'));
  }
  for (const touch of transientModel.PIANO_TOUCHES) {
    assert.match(html, new RegExp('data-piano-touch="' + touch + '"'));
  }
  assert.doesNotMatch(html, /id="pianoKeyboard"|class="piano-keys"/);
  for (const kind of sustainModel.KINDS) assert.match(html, new RegExp('data-sustain="' + kind + '"'));
  for (const gesture of ["hold", "toggle"]) assert.match(html, new RegExp('data-sustain-gesture="' + gesture + '"'));
  assert.match(html, /id="sustainBreath" type="range" min="0" max="100"/);
  assert.match(html, /id="sustainBowPressure" type="range" min="0" max="100"/);
  assert.ok(html.indexOf('id="modeStrike"') < html.indexOf('id="modeSustain"') &&
    html.indexOf('id="modeSustain"') < html.indexOf('id="modeMotion"'),
  "Held sound tab belongs between strike and moving pitch");
  assert.match(html, /id="modeMix"[^>]*data-i18n="modeMix"/);
  assert.match(html, /id="mixBaseInput"[^>]*type="number"/);
  assert.match(html, /data-i18n="unitHz">Гц<\/span>/);
  assert.match(html, /data-i18n="strikePresetOneSecond">1 сек<\/option>/);
  for (const pattern of motionModel.PATTERNS) {
    assert.match(html, new RegExp('data-siren-pattern="' + pattern + '"'));
  }
  for (const timbre of motionModel.TIMBRES) {
    assert.match(html, new RegExp('data-theremin-timbre="' + timbre + '"'));
  }
  for (const vowel of motionModel.VOWELS) {
    assert.match(html, new RegExp('data-theremin-vowel="' + vowel + '"'));
  }
  assert.match(html, /id="thereminHarmonic" type="range" min="2" max="12"/);
  assert.equal([...html.matchAll(/data-theremin-timbre="/g)].length, 4);
  assert.equal([...html.matchAll(/data-siren-pattern="/g)].length, 3);
  assert.equal([...html.matchAll(/data-mix-gap="/g)].length, 4);
  assert.equal([...html.matchAll(/data-interval-ratio="/g)].length, 6);
  assert.equal([...html.matchAll(/data-interval-tuning="/g)].length, 2);
  assert.equal([...html.matchAll(/data-interval-color="/g)].length, 2);
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
  const guitarPlayButtons = ["single", "strum"].map(guitarPlay => element({ guitarPlay }));
  const guitarChordButtons = Object.keys(transientModel.STRUM_CHORDS).map(guitarChord => element({ guitarChord }));
  const pianoTouchButtons = transientModel.PIANO_TOUCHES.map(pianoTouch => element({ pianoTouch }));
  const sustainButtons = sustainModel.KINDS.map(sustain => element({ sustain }));
  const sustainGestureButtons = ["hold", "toggle"].map(sustainGesture => element({ sustainGesture }));
  const drumButtons = Object.keys(transientModel.KICK_SIZES).map(drumSize => element({ drumSize }));
  const spectrumButtons = ["local", "overall"].map(spectrumView => element({ spectrumView }));
  const motionButtons = ["theremin", "siren"].map(motion => element({ motion }));
  const sirenPatternButtons = motionModel.PATTERNS.map(sirenPattern => element({ sirenPattern }));
  const timbreButtons = motionModel.TIMBRES.map(thereminTimbre => element({ thereminTimbre }));
  const vowelButtons = motionModel.VOWELS.map(thereminVowel => element({ thereminVowel }));
  const mixGapButtons = [0, 2, 4, 10].map(mixGap => element({ mixGap: String(mixGap) }));
  const mixKindButtons = Array.from({ length: 4 }, () =>
    ["beats", "harmonics", "intervals", "noise"].map(mixKind => element({ mixKind }))).flat();
  const intervalRatioButtons = intervalModel.PRESETS.map(preset => element({ intervalRatio: preset.ratio }));
  const intervalTuningButtons = ["just", "equal"].map(intervalTuning => element({ intervalTuning }));
  const intervalColorButtons = ["pure", "rich"].map(intervalColor => element({ intervalColor }));
  const harmonicPresetButtons = ["pure", "odd", "rich"].map(harmonicPreset => element({ harmonicPreset }));
  const harmonicLevelInputs = Array.from({ length: harmonicModel.COUNT }, (_, i) =>
    element({ harmonicLevel: String(i + 1) }));
  const noiseColorButtons = noiseModel.COLORS.map(noiseColor => element({ noiseColor }));
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
      if (selector === "[data-guitar-play]") return guitarPlayButtons;
      if (selector === "[data-guitar-chord]") return guitarChordButtons;
      if (selector === "[data-piano-touch]") return pianoTouchButtons;
      if (selector === "[data-sustain]") return sustainButtons;
      if (selector === "[data-sustain-gesture]") return sustainGestureButtons;
      if (selector === "[data-drum-size]") return drumButtons;
      if (selector === "[data-spectrum-view]") return spectrumButtons;
      if (selector === "[data-motion]") return motionButtons;
      if (selector === "[data-siren-pattern]") return sirenPatternButtons;
      if (selector === "[data-theremin-timbre]") return timbreButtons;
      if (selector === "[data-theremin-vowel]") return vowelButtons;
      if (selector === "[data-mix-gap]") return mixGapButtons;
      if (selector === "[data-mix-kind]") return mixKindButtons;
      if (selector === "[data-interval-ratio]") return intervalRatioButtons;
      if (selector === "[data-interval-tuning]") return intervalTuningButtons;
      if (selector === "[data-interval-color]") return intervalColorButtons;
      if (selector === "[data-harmonic-preset]") return harmonicPresetButtons;
      if (selector === "[data-harmonic-level]") return harmonicLevelInputs;
      if (selector === "[data-noise-color]") return noiseColorButtons;
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
    SoundLabSustain: sustainModel,
    SoundLabMotionModel: motionModel,
    SoundLabBeats: beatsModel,
    SoundLabIntervals: intervalModel,
    SoundLabHarmonics: harmonicModel,
    SoundLabNoise: noiseModel,
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
      this.periodicWaves = [];
      this.filters = [];
      this.shapers = [];
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
        setPeriodicWave(wave) { this.periodicWave = wave; },
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
    createPeriodicWave(real, imag, options = {}) {
      const wave = { real, imag, options };
      this.periodicWaves.push(wave);
      return wave;
    }
    createWaveShaper() {
      const shaper = { curve: null, oversample: "none", connect() {}, disconnect() {} };
      this.shapers.push(shaper);
      return shaper;
    }
    createBiquadFilter() {
      const filter = {
        type: "lowpass",
        Q: { value: 0,
          setValueAtTime(value) { this.value = value; },
          setTargetAtTime(value) { this.value = value; } },
        gain: { value: 0,
          setValueAtTime(value) { this.value = value; },
          setTargetAtTime(value) { this.value = value; } },
        frequency: { value: 0,
          setValueAtTime(value) { this.value = value; },
          setTargetAtTime(value) { this.value = value; } },
        connect(target) { this.connected = target; }, disconnect() { this.disconnected = true; }
      };
      this.filters.push(filter);
      return filter;
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
    contexts, elements, document, window, waveButtons, strikeButtons,
    guitarPlayButtons, guitarChordButtons, pianoTouchButtons, sustainButtons,
    sustainGestureButtons, drumButtons, spectrumButtons,
    motionButtons, sirenPatternButtons, timbreButtons, vowelButtons, mixGapButtons, mixKindButtons,
    intervalRatioButtons, intervalTuningButtons, intervalColorButtons,
    harmonicPresetButtons, harmonicLevelInputs, noiseColorButtons,
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

test("held flute plays only while pressed, and release follows the chosen decay", async () => {
  const app = fakePage();
  assert.equal(app.contexts.length, 0, "No audio until a deliberate gesture");
  app.fire("modeSustain", "click");
  assert.equal(app.elements.get("sustainWorkspace").hidden, false);
  assert.equal(app.elements.get("strikeWorkspace").hidden, true);
  assert.equal(app.elements.get("modeSustain").getAttribute("aria-pressed"), "true");
  assert.match(app.elements.get("pagePhase").textContent, /^03/);
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "false");

  // A normal pointer click after press/release must not restart hold mode.
  await app.fire("sustainButton", "pointerdown", { pointerId: 11 });
  assert.equal(app.contexts.length, 1);
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].started, true);
  assert.equal(context.oscillators[0].type, "sine");
  assert.equal(context.shapers.length, 1);
  assert.equal(context.shapers[0].curve.length, 2049);
  assert.equal(context.shapers[0].oversample, "4x");
  assert.equal(context.filters[0].type, "highpass");
  assert.equal(context.filters[1].type, "lowpass");
  assert.equal(context.filters[2].type, "lowpass", "the third filter colors breath noise");
  assert.equal(context.sources.length, 1, "Gentle breath noise is generated locally");
  assert.equal(context.sources[0].loop, true);
  assert.equal(app.elements.get("sustainBreathValue").textContent, "60%");
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "true");
  app.tick(.08);
  app.fire("sustainButton", "pointerup", { pointerId: 11 });
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "false");
  assert.equal(context.oscillators[0].stopped, true);
  assert.equal(context.sources[0].stopped, true);
  assert.match(app.elements.get("sustainStatus").textContent, /намдаж/);
  await app.fire("sustainButton", "click", { detail: 1 });
  assert.equal(context.oscillators.length, 1, "Pointer-generated click is ignored after release");

  // Bowed instruments now use two phase-locked stick/slip source waves,
  // blended smoothly and passed through a separate body-filter chain.
  app.sustainButtons[1].events.click();
  assert.equal(app.elements.get("sustainBreathGroup").hidden, true);
  assert.equal(app.elements.get("sustainBowGroup").hidden, false);
  assert.match(app.elements.get("sustainDescription").textContent, /хурц/);
  assert.equal(app.elements.get("sustainAttackValue").textContent, "0.18 сек");
  await app.fire("sustainButton", "pointerdown", { pointerId: 12 });
  assert.equal(context.oscillators.length, 3);
  assert.equal(context.periodicWaves.length, 2);
  assert.equal(context.periodicWaves[0].imag.length, sustainModel.BOW_PARTIALS + 1);
  assert.equal(context.periodicWaves[0].options.disableNormalization, true);
  assert.equal(context.filters[3].type, "peaking");
  assert.equal(context.filters[4].type, "peaking");
  assert.equal(context.filters[5].type, "lowpass");
  app.fire("stopAll", "click");
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "false");
  assert.equal(context.oscillators[1].stopped, true);
  assert.equal(context.oscillators[2].stopped, true);
});

test("bow pressure smoothly crossfades both bowed strings and keeps plots and language in sync", async () => {
  const app = fakePage();
  app.fire("modeSustain", "click");
  assert.equal(app.elements.get("sustainBowGroup").hidden, true, "flute has no bow control");
  app.sustainButtons[1].events.click();
  assert.equal(app.elements.get("sustainBowGroup").hidden, false);
  assert.equal(app.elements.get("sustainBowValue").textContent, "60%");
  assert.match(app.elements.get("sustainChallengeText").textContent, /нумын даралтыг/);
  await app.fire("sustainButton", "pointerdown", { pointerId: 24 });
  const context = app.contexts[0];
  const weights = sustainModel.bowPressureWeights(60);
  const soft = context.gains.find(g => Math.abs(g.gain.value - weights.soft) < 1e-9).gain;
  const hard = context.gains.find(g => Math.abs(g.gain.value - weights.hard) < 1e-9).gain;
  const noise = context.gains.find(g =>
    Math.abs(g.gain.value - sustainModel.bowNoiseGain("violin", 60)) < 1e-9).gain;
  assert.equal(context.oscillators.length, 2);
  assert.equal(context.periodicWaves.length, 2);
  app.elements.get("sustainBowPressure").value = "100";
  app.fire("sustainBowPressure", "input");
  assert.equal(soft.value, 0);
  assert.ok(hard.value > weights.hard);
  assert.ok(noise.value > sustainModel.bowNoiseGain("violin", 60));
  assert.equal(app.elements.get("sustainBowValue").textContent, "100%");
  assert.equal(context.oscillators.length, 2, "the held note is not restarted when pressure changes");
  app.elements.get("sustainFrequencyInput").value = "330";
  app.fire("sustainFrequencyInput", "change");
  assert.equal(context.oscillators[0].frequency.value, 330);
  assert.equal(context.oscillators[1].frequency.value, 330);
  app.elements.get("sustainBowPressure").value = "0";
  app.fire("sustainBowPressure", "input");
  assert.equal(soft.value, 0);
  assert.equal(hard.value, 0);
  assert.equal(noise.value, 0);
  app.fire("langEn", "click");
  assert.match(app.elements.get("sustainDescription").textContent, /stick–slip/);
  assert.match(app.elements.get("sustainDetailHint").textContent, /body filters/);
  assert.match(app.elements.get("sustainChallengeText").textContent, /bow pressure/);
  app.sustainButtons[2].events.click();
  assert.equal(context.oscillators[0].stopped, true);
  assert.equal(context.oscillators[1].stopped, true);
  assert.equal(app.elements.get("sustainBowValue").textContent, "0%");
  await app.fire("sustainButton", "pointerdown", { pointerId: 25 });
  assert.equal(context.oscillators.length, 4);
  assert.ok(context.filters.some(f => f.type === "peaking" && f.frequency.value === 310),
    "morin khuur has a distinct illustrative body response");
  app.fire("sustainReset", "click");
  assert.equal(app.elements.get("sustainBowGroup").hidden, true);
  assert.equal(app.elements.get("sustainBowValue").textContent, "60%");
  assert.ok(context.oscillators.every(osc => osc.stopped));
});

test("flute blowing strength alters the running jet smoothly and updates both plotted and spoken language", async () => {
  const app = fakePage();
  app.fire("modeSustain", "click");
  assert.equal(app.elements.get("sustainBreathGroup").hidden, false);
  assert.equal(app.elements.get("sustainBreathValue").textContent, "60%");
  assert.match(app.elements.get("sustainDetailHint").textContent, /агаарын баганын/);
  await app.fire("sustainButton", "pointerdown", { pointerId: 22 });
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  const drive = context.gains.find(gain =>
    Math.abs(gain.gain.value - sustainModel.fluteDrive(60)) < 1e-8).gain;
  const original = drive.value;
  const noise = context.gains.find(gain =>
    Math.abs(gain.gain.value - sustainModel.fluteNoiseGain(60)) < 1e-8).gain;
  app.elements.get("sustainBreath").value = "100";
  app.fire("sustainBreath", "input");
  assert.ok(drive.value > original);
  assert.ok(noise.value > sustainModel.fluteNoiseGain(60));
  assert.equal(app.elements.get("sustainBreathValue").textContent, "100%");
  assert.equal(context.oscillators.length, 1, "no oscillator restart while moving the breath slider");
  app.elements.get("sustainBreath").value = "0";
  app.fire("sustainBreath", "input");
  assert.equal(drive.value, 0);
  assert.equal(noise.value, 0);
  app.fire("langEn", "click");
  assert.match(app.elements.get("sustainDescription").textContent, /air-jet/);
  assert.match(app.elements.get("sustainDetailHint").textContent, /air-column/);
  assert.equal(app.elements.get("sustainBreathValue").textContent, "0%");
  app.fire("sustainReset", "click");
  assert.equal(app.elements.get("sustainBreathValue").textContent, "60%");
  assert.equal(context.oscillators[0].stopped, true);
});

test("held note toggle, keyboard access, pitch snap, language and mode cleanup", async () => {
  const app = fakePage();
  app.fire("modeSustain", "click");
  app.sustainGestureButtons[1].events.click();
  assert.equal(app.elements.get("sustainPlayLabel").textContent, "Тоглуулах");
  await app.fire("sustainButton", "click", { detail: 1 });
  const context = app.contexts[0];
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "true");
  assert.equal(app.elements.get("sustainPlayLabel").textContent, "Зогсоох");
  app.elements.get("sustainFrequencyInput").value = "437";
  app.fire("sustainFrequencyInput", "change");
  assert.equal(context.oscillators[0].frequency.value, 437);
  app.elements.get("sustainSnap").checked = true;
  app.fire("sustainSnap", "change");
  assert.equal(context.oscillators[0].frequency.value, 440);
  app.elements.get("sustainVolume").value = "70";
  app.fire("sustainVolume", "input");
  assert.equal(app.elements.get("sustainVolumeValue").textContent, "70%");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("sustainPlayLabel").textContent, "Stop");
  assert.match(app.elements.get("sustainEnvelopeBadge").textContent, /s/);
  await app.fire("sustainButton", "click", { detail: 1 });
  assert.equal(context.oscillators[0].stopped, true);

  app.sustainGestureButtons[0].events.click();
  await app.fire("sustainButton", "keydown", { key: " " });
  assert.equal(context.oscillators.length, 2);
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "true");
  app.fire("sustainButton", "keyup", { key: " " });
  assert.equal(context.oscillators[1].stopped, true);
  await app.fire("sustainButton", "click", { detail: 0 });
  assert.equal(context.oscillators.length, 3, "Assistive-technology click can toggle hold mode");
  app.fire("modeMotion", "click");
  assert.equal(context.oscillators[2].stopped, true);
  assert.equal(app.elements.get("sustainWorkspace").hidden, true);
  assert.equal(app.elements.get("modeMotion").getAttribute("aria-pressed"), "true");
});

test("quick lift cancels pending audio start; tab hide and blur silence held notes", async () => {
  const app = fakePage();
  app.fire("modeSustain", "click");
  const pending = app.fire("sustainButton", "pointerdown", { pointerId: 5 });
  app.fire("sustainButton", "pointercancel", { pointerId: 5 });
  await pending;
  assert.equal(app.contexts[0].oscillators.length, 0, "Released before resume; no late ghost note");

  await app.fire("sustainButton", "pointerdown", { pointerId: 6 });
  assert.equal(app.contexts[0].oscillators.length, 1);
  app.window.events.blur();
  assert.equal(app.contexts[0].oscillators[0].stopped, true);
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "false");

  app.sustainGestureButtons[1].events.click();
  await app.fire("sustainButton", "click", { detail: 1 });
  assert.equal(app.contexts[0].oscillators.length, 2);
  app.document.hidden = true;
  app.document.events.visibilitychange();
  assert.equal(app.contexts[0].oscillators[1].stopped, true);
  assert.equal(app.elements.get("sustainButton").getAttribute("aria-pressed"), "false");
});

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
  assert.equal(app.hzLabels.length, 8);
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
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "81 Гц");
  await app.fire("strikeButton", "click");
  assert.equal(app.contexts[0].sources.length, 1);
  app.drumButtons[2].events.click();
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "157 Гц");
  assert.equal(app.contexts[0].sources[0].stopped, true);
  await app.fire("strikeButton", "click");
  const first = app.contexts[0].buffers[0].getChannelData(0);
  const second = app.contexts[0].buffers[1].getChannelData(0);
  assert.notEqual(first[400], second[400], "Drum size changes actual audio samples");
});

test("guitar strum presets model separate strings without autoplay and share plotted audio", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  assert.equal(app.elements.get("strikeGuitarGroup").hidden, false);
  assert.equal(app.elements.get("strikeChordGroup").hidden, true);
  app.guitarPlayButtons[1].click();
  assert.equal(app.contexts.length, 0, "Choosing strum is silent");
  assert.equal(app.elements.get("strikePitchGroup").hidden, true);
  assert.equal(app.elements.get("strikeChordGroup").hidden, false);
  assert.equal(app.elements.get("strikeButtonLabel").textContent, "Цохих");
  await app.fire("strikeButton", "click");
  const em = app.contexts[0].buffers[0].getChannelData(0);
  assert.ok(em.some(value => Math.abs(value) > .02));
  app.guitarChordButtons[1].click();
  assert.equal(app.contexts[0].sources[0].stopped, true, "Chord change stops previous strum");
  await app.fire("strikeButton", "click");
  const g = app.contexts[0].buffers[1].getChannelData(0);
  assert.notEqual(em[3000], g[3000], "Different fret patterns produce different audio");
  app.elements.get("strikePluckPosition").value = "48";
  app.fire("strikePluckPosition", "input");
  assert.equal(app.elements.get("strikePluckPositionValue").textContent, "48%");
  app.guitarPlayButtons[0].click();
  assert.equal(app.elements.get("strikePitchGroup").hidden, false);
  assert.equal(app.elements.get("strikeChordGroup").hidden, true);
  app.strikeButtons[1].click();
  assert.equal(app.elements.get("strikeGuitarGroup").hidden, true);
  app.elements.get("strikeDrumTension").value = "200";
  app.fire("strikeDrumTension", "input");
  assert.equal(app.elements.get("strikeDrumTensionValue").textContent, "200%");
  assert.equal(app.elements.get("strikeDrumFrequencies").textContent, "158 Гц");
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
  assert.equal(app.elements.get("pagePhase").textContent, "04 · Хувирдаг давтамж");
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

test("theremin timbres are silent presets that crossfade when sounding and update harmonic plots", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  assert.equal(app.timbreButtons.length, 4);
  assert.equal(app.timbreButtons[0].getAttribute("aria-pressed"), "true");
  app.timbreButtons[2].events.click();
  assert.equal(app.contexts.length, 0, "Changing timbre does not autoplay");
  assert.equal(app.timbreButtons[2].getAttribute("aria-pressed"), "true");
  assert.equal(app.timbreButtons[0].getAttribute("aria-pressed"), "false");
  assert.ok(app.elements.get("motionSpectrumCanvas").drawnText.includes("4f₀"));
  assert.equal(app.elements.get("thereminVowelGroup").hidden, false);
  assert.equal(app.elements.get("thereminOvertoneGroup").hidden, true);

  await app.fire("thereminPad", "keydown", { key: " " });
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.periodicWaves.length, 1);
  assert.equal(context.oscillators[0].periodicWave.imag[3], Math.fround(Math.pow(3, -1.2)));
  assert.equal(context.filters.length, 4, "Three vocal formants and one lowpass filter");
  assert.equal(context.filters[0].type, "peaking");
  assert.equal(context.filters[0].frequency.value, 750);

  app.timbreButtons[1].events.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.oscillators.length, 2, "New color crossfades into a new oscillator");
  assert.equal(context.oscillators[0].stopped, true);
  assert.equal(context.oscillators[1].periodicWave.imag[2], Math.fround(.60));
  assert.equal(context.oscillators[1].frequency.value, 440);
  app.timbreButtons[0].events.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.oscillators.length, 3);
  assert.equal(context.oscillators[1].stopped, true);
  assert.equal(context.oscillators[2].type, "sine");
  assert.equal(app.elements.get("thereminPad").getAttribute("aria-pressed"), "true");
  app.fire("stopAll", "click");
  assert.ok(context.oscillators.every(osc => osc.stopped));

  app.fire("motionReset", "click");
  assert.equal(app.timbreButtons[0].getAttribute("aria-pressed"), "true");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("thereminTimbres").getAttribute("aria-label"), "Theremin timbre options");
});

test("vowel and overtone controls stay silent until played and shape the same source live", async () => {
  const app = fakePage();
  app.fire("modeMotion", "click");
  app.timbreButtons[2].events.click();
  app.vowelButtons[2].events.click(); // И
  assert.equal(app.contexts.length, 0);
  assert.equal(app.vowelButtons[2].getAttribute("aria-pressed"), "true");
  await app.fire("thereminPad", "keydown", { key: " " });
  const context = app.contexts[0];
  const firstOsc = context.oscillators[0];
  assert.equal(context.filters[0].frequency.value, 310);
  app.vowelButtons[4].events.click(); // У: formants change, no new oscillator
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.filters[0].frequency.value, 340);
  assert.equal(context.filters[1].frequency.value, 810);
  app.fire("thereminPad", "keydown", { key: "ArrowLeft" });
  assert.equal(context.filters[0].frequency.value, 340, "Formant Hz remains fixed when pitch changes");
  assert.ok(firstOsc.frequency.value < 440);

  app.timbreButtons[3].events.click(); // One glottal-like source, focus filter
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(firstOsc.stopped, true);
  assert.equal(app.elements.get("thereminVowelGroup").hidden, true);
  assert.equal(app.elements.get("thereminOvertoneGroup").hidden, false);
  assert.equal(context.oscillators.length, 2);
  assert.equal(context.filters.length, 6, "Overtone model adds one peaking and one lowpass filter");
  const focusFilter = context.filters[4];
  assert.equal(focusFilter.type, "peaking");
  const hz = context.oscillators[1].frequency.value;
  assert.ok(Math.abs(focusFilter.frequency.value - 6 * hz) < 1e-7);
  app.elements.get("thereminHarmonic").value = "9";
  app.fire("thereminHarmonic", "input");
  assert.equal(context.oscillators.length, 2, "Selecting a harmonic does not start a second voice");
  assert.ok(Math.abs(focusFilter.frequency.value - 9 * hz) < 1e-7);
  assert.match(app.elements.get("thereminHarmonicValue").textContent, /^9f₀ = /);
  app.fire("thereminPad", "keydown", { key: "ArrowRight" });
  assert.ok(Math.abs(focusFilter.frequency.value - 9 * context.oscillators[1].frequency.value) < 1e-7);
  app.fire("stopAll", "click");
  assert.ok(context.oscillators.every(osc => osc.stopped));
  assert.ok(context.filters.every(filter => filter.disconnected));
  app.fire("motionReset", "click");
  assert.equal(app.elements.get("thereminVowelGroup").hidden, true);
  assert.equal(app.elements.get("thereminOvertoneGroup").hidden, true);
  assert.equal(app.elements.get("thereminHarmonic").value, "6");
  assert.equal(app.vowelButtons[0].getAttribute("aria-pressed"), "true");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("thereminVowels").getAttribute("aria-label"), "Vowel resonance selection");
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
  assert.equal(app.elements.get("pagePhase").textContent, "05 · Хоёр авианы биение");
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

test("Combine Waves uses four synchronized left-panel choices and uniform Play/Stop labels", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  assert.equal(app.mixKindButtons.length, 16);
  assert.equal(app.elements.get("mixPlayLabel").textContent, "Тоглуулах");
  app.mixKindButtons[1].events.click();
  assert.equal(app.elements.get("harmonicWorkspace").hidden, false);
  assert.equal(app.elements.get("harmonicPlayLabel").textContent, "Тоглуулах");
  for (const index of [1, 5, 9, 13]) {
    assert.equal(app.mixKindButtons[index].getAttribute("aria-pressed"), "true");
  }
  app.mixKindButtons[2].events.click();
  assert.equal(app.elements.get("intervalWorkspace").hidden, false);
  assert.equal(app.elements.get("intervalPlayLabel").textContent, "Тоглуулах");
  for (const index of [2, 6, 10, 14]) {
    assert.equal(app.mixKindButtons[index].getAttribute("aria-pressed"), "true");
  }
  app.mixKindButtons[3].events.click();
  assert.equal(app.elements.get("noiseWorkspace").hidden, false);
  assert.equal(app.elements.get("noisePlayLabel").textContent, "Тоглуулах");
  for (const index of [3, 7, 11, 15]) {
    assert.equal(app.mixKindButtons[index].getAttribute("aria-pressed"), "true");
  }
  assert.equal(app.contexts.length, 0, "Changing sub-experiment does not autoplay");
  await app.fire("noiseButton", "click");
  assert.equal(app.elements.get("noisePlayLabel").textContent, "Зогсоох");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("noisePlayLabel").textContent, "Stop");
  app.mixKindButtons[0].events.click();
  assert.equal(app.elements.get("mixPlayLabel").textContent, "Play");
  assert.ok(app.contexts[0].sources.every(source => source.stopped));
});

test("S021 intervals switch exact/12-TET tuning and Pure/Rich voices without autoplay or leaks", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  app.mixKindButtons[2].events.click();
  assert.equal(app.contexts.length, 0, "Preset selection remains silent");
  assert.equal(app.elements.get("intervalName").textContent, "Цэвэр квинт · 3:2");
  assert.equal(app.elements.get("intervalNotesValue").textContent, "220 + 330 Гц");
  assert.equal(app.elements.get("intervalOverlapValue").textContent, "3f₁ = 2f₂ = 660 Гц");
  assert.match(app.elements.get("intervalWaveFoot").textContent, /доод нот 2, дээд нот 3/);
  assert.match(app.elements.get("intervalSpectrumFoot").textContent, /3 × 220 = 2 × 330/);
  assert.ok(app.elements.get("intervalWaveCanvas").drawnText.includes("f₁+f₂"));
  assert.ok(app.elements.get("intervalSpectrumCanvas").drawnText.includes("f₂"));

  app.intervalRatioButtons[4].events.click(); // 5:4
  assert.equal(app.elements.get("intervalNotesValue").textContent, "220 + 275 Гц");
  app.intervalTuningButtons[1].events.click(); // 12-TET
  assert.match(app.elements.get("intervalNotesValue").textContent, /277\.18 Гц/);
  assert.match(app.elements.get("intervalCents").textContent, /\+13\.686/);
  assert.match(app.elements.get("intervalCents").textContent, /8\.73 Гц/);
  assert.match(app.elements.get("intervalWaveFoot").textContent, /яг ижил давталт үгүй/);
  app.intervalColorButtons[0].events.click(); // Pure, still silent
  assert.equal(app.contexts.length, 0);
  assert.match(app.elements.get("intervalSpectrumFoot").textContent, /зөвхөн үндсэн давтамж/);

  await app.fire("intervalButton", "click");
  const ctx = app.contexts[0];
  assert.equal(ctx.oscillators.length, 2);
  assert.ok(ctx.oscillators.every(osc => osc.type === "sine" && osc.started));
  assert.ok(Math.abs(ctx.gains.at(-1).gain.value - 0.12 * 0.38) < 1e-12);
  assert.equal(app.elements.get("intervalPlayLabel").textContent, "Зогсоох");
  app.intervalRatioButtons[2].events.click(); // 3:2, retune without restart
  app.intervalTuningButtons[0].events.click();
  assert.equal(ctx.oscillators.length, 2);
  assert.deepEqual(ctx.oscillators.map(osc => osc.frequency.value), [220, 330]);
  app.intervalColorButtons[1].events.click(); // rich, crossfade
  assert.equal(ctx.oscillators.length, 4);
  assert.ok(ctx.oscillators.slice(0, 2).every(osc => osc.stopped));
  assert.ok(ctx.oscillators.slice(2).every(osc => osc.periodicWave?.options?.disableNormalization));
  app.elements.get("intervalBaseInput").value = "999";
  app.fire("intervalBaseInput", "change");
  assert.equal(app.elements.get("intervalBaseInput").value, "220");
  assert.equal(app.elements.get("intervalStatus").classList.contains("error"), true);
  app.fire("langEn", "click");
  assert.equal(app.elements.get("intervalName").textContent, "Perfect fifth · 3:2");
  assert.equal(app.elements.get("intervalPlayLabel").textContent, "Stop both");
  app.fire("intervalReset", "click");
  assert.ok(ctx.oscillators.every(osc => osc.stopped));
  assert.equal(app.elements.get("intervalPlayLabel").textContent, "Play both");
  assert.equal(app.elements.get("intervalVolumeValue").textContent, "38%");
  assert.equal(app.elements.get("intervalRatioValue").textContent, "3:2 = 1.5");
});

test("S021 interval playback reaches the shared recorder and cancels a pending start", async () => {
  const app = fakePage();
  await app.fire("recordButton", "click");
  app.fire("modeMix", "click");
  app.mixKindButtons[2].events.click();
  await app.fire("intervalButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 2);
  const capture = context.worklets[0];
  capture.send({ type: "samples", samples: new Float32Array([0.15, -0.15]) });
  app.fire("stopAll", "click");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
  assert.deepEqual(capture.port.lastPosted, { type: "stop" });
  capture.send({ type: "done" });
  assert.equal(app.elements.get("recordDownload").clickCount, 1);

  const pending = app.fire("intervalButton", "click");
  app.mixKindButtons[0].events.click(); // switch to beats before context resolves
  await pending;
  assert.equal(context.oscillators.length, 2, "No extra interval voices created after leaving the experiment");
  assert.equal(app.elements.get("intervalPlayLabel").textContent, "Тоглуулах");
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
  assert.equal(app.elements.get("pagePhase").textContent, "05 · Two-tone beats");
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

test("modeled piano has press and gentle tap gestures with matching audio and UI", async () => {
  const app = fakePage();
  app.fire("modeStrike", "click");
  const piano = app.strikeButtons.find(button => button.dataset.strike === "piano");
  piano.events.click();
  assert.equal(app.contexts.length, 0, "Switching instrument must stay silent");
  assert.equal(app.elements.get("strikePitchGroup").hidden, false);
  assert.equal(app.elements.get("strikeDrumSizeGroup").hidden, true);
  assert.equal(app.elements.get("strikeButtonLabel").textContent, "Дарах");
  assert.equal(app.elements.get("strikePianoTouchGroup").hidden, false);
  assert.equal(app.pianoTouchButtons[0].getAttribute("aria-pressed"), "true");
  assert.match(app.elements.get("strikeDescription").textContent, /Алх цохиход/);
  assert.equal(app.elements.get("strikeDecayValue").textContent, "0.8 сек");
  await app.fire("strikeButton", "click");
  const context = app.contexts[0];
  assert.equal(context.sources.length, 1);
  assert.equal(context.sources[0].started, true);
  assert.ok(context.buffers[0].getChannelData().some(sample => Math.abs(sample) > .005));
  assert.ok(app.elements.get("strikeSpectrumCanvas").drawnText.some(label => label.includes("кГц")));
  const softerBuffer = context.buffers[0].getChannelData().slice(0, 256);
  app.elements.get("strikeStrength").value = "90";
  app.fire("strikeStrength", "input");
  assert.equal(context.buffers.length, 1, "Changing strength alone must not start audio");
  await app.fire("strikeButton", "click");
  const harderBuffer = context.buffers[1].getChannelData();
  assert.ok(harderBuffer.some((sample, i) => i < 256 &&
    Math.abs(sample - softerBuffer[i]) > 0.001),
  "Hammer strength changes the underlying synthesized piano waveform");
  app.pianoTouchButtons[1].events.click();
  assert.equal(app.elements.get("strikeButtonLabel").textContent, "Товших");
  assert.equal(app.pianoTouchButtons[1].getAttribute("aria-pressed"), "true");
  assert.equal(context.buffers.length, 2, "Selecting touch should not autoplay");
  await app.fire("strikeButton", "click");
  const tapped = context.buffers[2].getChannelData();
  const rms = (buffer, start, count = 1024) => {
    const from = Math.round(start * context.sampleRate);
    let energy = 0;
    for (let i = from; i < from + count; i++) energy += buffer[i] * buffer[i];
    return Math.sqrt(energy / count);
  };
  assert.ok(rms(tapped, .05) < rms(harderBuffer, .05), "Tap uses a softer hammer");
  assert.ok(rms(tapped, .5) < .03 * rms(harderBuffer, .5),
    "The early-returning damper shortens a tapped note");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("strikeButtonLabel").textContent, "Tap");
  app.pianoTouchButtons[0].events.click();
  assert.equal(app.elements.get("strikeButtonLabel").textContent, "Press");
  assert.equal(app.elements.get("strikePianoTouchGroup").hidden, false);
  app.strikeButtons[1].events.click();
  assert.equal(app.elements.get("strikePianoTouchGroup").hidden, true);
  app.fire("stopAll", "click");
  assert.equal(context.sources[0].stopped, true);
});

test("harmonic builder is an interactive eight-partial synthesis without autoplay", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  app.mixKindButtons[1].events.click();
  assert.equal(app.contexts.length, 0);
  assert.equal(app.elements.get("mixWorkspace").hidden, true);
  assert.equal(app.elements.get("harmonicWorkspace").hidden, false);
  assert.equal(app.elements.get("harmonicExplanation").hidden, false);
  assert.equal(app.elements.get("noiseWorkspace").hidden, true);
  assert.equal(app.elements.get("pagePhase").textContent, "05 · Авиа бүтээх");
  assert.equal(app.harmonicLevelInputs.length, 8);
  assert.equal(app.elements.get("harmonicLevelValue1").textContent, "100%");
  app.harmonicPresetButtons[2].events.click();
  assert.equal(app.elements.get("harmonicLevelValue2").textContent, "50%");
  app.harmonicLevelInputs[2].events.input({ target: { value: "70" } });
  assert.equal(app.elements.get("harmonicLevelValue3").textContent, "70%");
  assert.ok(app.elements.get("harmonicWaveCanvas").drawnText.some(label => label.endsWith("мсек")));
  await app.fire("harmonicButton", "click");
  const context = app.contexts[0];
  assert.equal(context.oscillators.length, 1);
  assert.equal(context.oscillators[0].periodicWave.imag[3], Math.fround(0.7));
  assert.equal(context.oscillators[0].frequency.value, 220);
  assert.ok(Math.abs(context.gains.at(-1).gain.value - .084) < 1e-12);
  app.elements.get("harmonicBaseInput").value = "330";
  app.fire("harmonicBaseInput", "change");
  assert.equal(context.oscillators[0].frequency.value, 330);
  app.harmonicPresetButtons[0].events.click();
  assert.equal(context.oscillators.length, 2, "New periodic wave crossfades to a new oscillator");
  assert.equal(context.oscillators[0].stopped, true);
  app.elements.get("harmonicBaseInput").value = "9999";
  app.fire("harmonicBaseInput", "change");
  assert.equal(app.elements.get("harmonicBaseInput").value, "330");
  assert.equal(app.elements.get("harmonicStatus").classList.contains("error"), true);
  app.fire("harmonicReset", "click");
  assert.equal(app.elements.get("harmonicBaseInput").value, "220");
  assert.equal(app.elements.get("harmonicLevelValue3").textContent, "0%");
  assert.ok(context.oscillators.every(oscillator => oscillator.stopped));
});

test("noise colors loop filtered model buffers safely; changing experiment silences them", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  app.mixKindButtons[3].events.click();
  assert.equal(app.contexts.length, 0);
  assert.equal(app.elements.get("noiseWorkspace").hidden, false);
  assert.equal(app.elements.get("noiseChallenge").hidden, false);
  assert.equal(app.elements.get("pagePhase").textContent, "05 · Шуугиан судлах");
  assert.match(app.elements.get("noiseColorDescription").textContent, /герцийн зурвас/);
  assert.ok(app.elements.get("noiseSpectrumCanvas").drawnText.some(label => label.includes("Гц")));
  await app.fire("noiseButton", "click");
  const context = app.contexts[0];
  assert.equal(context.sources.length, 1);
  assert.equal(context.sources[0].loop, true);
  assert.equal(context.filters.length, 1);
  assert.equal(context.filters[0].type, "lowpass");
  assert.equal(context.gains.at(-1).gain.value, .2 * .25);
  app.noiseColorButtons[1].events.click();
  assert.equal(context.sources.length, 2);
  assert.equal(context.sources[0].stopped, true);
  assert.match(app.elements.get("noiseColorDescription").textContent, /октав/);
  app.elements.get("noiseCutoff").value = "1200";
  app.fire("noiseCutoff", "input");
  assert.equal(context.filters.at(-1).frequency.value, 1200);
  app.elements.get("noiseVolume").value = "100";
  app.fire("noiseVolume", "input");
  assert.equal(context.gains.at(-1).gain.value, .2);
  app.mixKindButtons[0].events.click();
  assert.ok(context.sources.every(source => source.stopped));
  assert.equal(app.elements.get("noiseButton").getAttribute("aria-pressed"), "false");
  assert.equal(app.elements.get("mixWorkspace").hidden, false);
  assert.equal(app.elements.get("noiseWorkspace").hidden, true);
});

test("harmonic and noise pending playback are canceled before any orphan sound starts", async () => {
  const app = fakePage();
  app.fire("modeMix", "click");
  app.mixKindButtons[1].events.click();
  const pendingHarmonics = app.fire("harmonicButton", "click");
  app.mixKindButtons[3].events.click();
  await pendingHarmonics;
  assert.equal(app.contexts[0].oscillators.length, 0);
  const pendingNoise = app.fire("noiseButton", "click");
  app.fire("modePure", "click");
  await pendingNoise;
  assert.equal(app.contexts[0].sources.length, 0);
  app.fire("modeMix", "click");
  app.mixKindButtons[1].events.click();
  await app.fire("harmonicButton", "click");
  app.fire("langEn", "click");
  assert.equal(app.elements.get("pagePhase").textContent, "05 · Build a sound");
  assert.equal(app.elements.get("harmonicPlayLabel").textContent, "Stop");
  app.fire("stopAll", "click");
  assert.equal(app.contexts[0].oscillators.at(-1).stopped, true);
});
