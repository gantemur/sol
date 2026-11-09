/*
 * SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * A compact, standalone adaptation of Sound Lab's Waveforms experiment.
 */
(() => {
  "use strict";
  const model = window.PitchTimbreModel;
  const $ = id => document.getElementById(id);
  const strings = Object.freeze({
    mn: {
      title: "Дуу · Өндөр ба өнгө", language: "Хэл сонгох", controls: "Авиа үүсгэх",
      shape: "Долгионы хэлбэр (дууны өнгө)", sine: "Синус", triangle: "Гурвалжин",
      square: "Дөрвөлжин", sawtooth: "Хөрөө", play: "▶ Тоглуулах", stop: "■ Зогсоох",
      frequency: "Давтамж (дууны өндөр)", volume: "Чанга–сул", quiet: "Сул", loud: "Чанга",
      hz: "Гц", ms: "мсек", waveTitle: "Долгионы хэлбэр",
      harmonicsTitle: "Гармоникууд (өнгөний найрлага)", waveWindow: "0–20 мсек",
      spectrumNote: "Үндсэн гармониктай харьцуулсан хэмжээ", timeAxis: "хугацаа →",
      frequencyAxis: "давтамж →", waveAria: "20 миллисекунд доторх загвар долгион",
      harmonicsAria: "Эхний 12 идеал гармоникийн харьцангуй хэмжээ",
      unsupported: "Энэ хөтөч авиа тоглуулах боломжгүй.", blocked: "Авиа эхэлсэнгүй. Дахин оролдоно уу."
    },
    en: {
      title: "Sound · Pitch and timbre", language: "Choose language", controls: "Generate a sound",
      shape: "Waveform (timbre)", sine: "Sine", triangle: "Triangle",
      square: "Square", sawtooth: "Sawtooth", play: "▶ Play", stop: "■ Stop",
      frequency: "Frequency (pitch)", volume: "Volume", quiet: "Quiet", loud: "Loud",
      hz: "Hz", ms: "ms", waveTitle: "Waveform",
      harmonicsTitle: "Harmonics (timbre composition)", waveWindow: "0–20 ms",
      spectrumNote: "Magnitudes relative to the fundamental", timeAxis: "time →",
      frequencyAxis: "frequency →", waveAria: "Modeled waveform in a 20 millisecond window",
      harmonicsAria: "Relative magnitudes of the first 12 ideal harmonics",
      unsupported: "This browser cannot play synthesized sound.", blocked: "Sound could not start. Try again."
    }
  });
  const state = { language: "mn", shape: "sine", frequency: 440, volume: 40, error: "", errorDetail: "" };
  const engine = {
    context: null, oscillator: null, gain: null, playing: false, starting: false,
    generation: 0, resumeTimeout: null
  };
  const STORAGE_KEY = "sol-sound-pitch-timbre-language";
  const AUDIO_GAIN = 0.24; // Safe headroom for one continuous voice.

  function translation(key) { return strings[state.language][key]; }
  function hzLabel(hz) { return Math.round(hz) + " " + translation("hz"); }
  function msLabel(ms) { return Number(ms.toFixed(2)) + " " + translation("ms"); }

  function startingLanguage() {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (requested === "mn" || requested === "en") return requested;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "mn" || stored === "en") return stored;
    } catch (_) { /* The tool also works with storage disabled. */ }
    return "mn";
  }

  function setLanguage(lang) {
    if (!Object.hasOwn(strings, lang)) return;
    state.language = lang;
    document.documentElement.lang = lang;
    document.title = translation("title");
    document.querySelectorAll("[data-i18n]").forEach(element => {
      element.textContent = translation(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
      element.setAttribute("aria-label", translation(element.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* optional */ }
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("lang")) url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url);
    } catch (_) { /* May be unavailable for file:// pages. */ }
    renderControls();
    requestDraw();
  }

  function renderControls() {
    $("playButton").textContent = translation(engine.playing || engine.starting ? "stop" : "play");
    $("playButton").setAttribute("aria-pressed", String(engine.playing || engine.starting));
    $("frequencyReadout").textContent = hzLabel(state.frequency);
    $("volumeReadout").textContent = state.volume + "%";
    $("periodReadout").textContent = "T = " + msLabel(1000 / state.frequency);
    $("baseReadout").textContent = "f₀ = " + hzLabel(state.frequency);
    $("audioStatus").textContent = state.error ? translation(state.error) +
      (state.errorDetail ? " [" + state.errorDetail + "]" : "") : "";
    document.querySelectorAll("[data-shape]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.shape === state.shape));
    });
  }

  function failSound(ticket, error) {
    if (ticket !== engine.generation) return;
    const context = engine.context;
    stopSound(true);
    engine.context = null; // Retry on a fresh context after a failed or interrupted start.
    if (context && context.state !== "closed") context.close().catch(() => {});
    state.error = error?.message === "unsupported" ? "unsupported" : "blocked";
    state.errorDetail = state.error === "unsupported" ? "" :
      (error?.name && error.name !== "Error" ? error.name : error?.message || "unknown");
    renderControls();
  }

  function startSound() {
    const ticket = ++engine.generation;
    engine.starting = true;
    state.error = ""; state.errorDetail = "";
    renderControls();
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("unsupported");
      if (!engine.context || engine.context.state === "closed") engine.context = new AudioContextClass();
      const context = engine.context, now = context.currentTime;
      const oscillator = context.createOscillator(), gain = context.createGain();
      oscillator.type = state.shape;
      oscillator.frequency.setValueAtTime(state.frequency, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.setTargetAtTime(AUDIO_GAIN * state.volume / 100, now, 0.016);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        if (engine.oscillator === oscillator) {
          engine.oscillator = null;
          engine.gain = null;
          engine.playing = false;
          renderControls();
        }
      };
      engine.oscillator = oscillator;
      engine.gain = gain;
      // Connect, start and request resume synchronously in the button's click
      // event. Safari may lose transient user activation across an await.
      oscillator.start(now);
      const resuming = context.state === "running" ? Promise.resolve() : context.resume();
      engine.resumeTimeout = setTimeout(() => {
        if (ticket !== engine.generation) return;
        if (context.state !== "running") failSound(ticket, new Error("audio context " + context.state));
        else {
          // A browser may have made audio active without settling resume().
          engine.resumeTimeout = null;
          engine.starting = false;
          engine.playing = true;
          renderControls();
        }
      }, 2000);
      Promise.resolve(resuming).then(() => {
        if (ticket !== engine.generation) return;
        if (context.state !== "running") {
          failSound(ticket, new Error("audio context " + context.state));
          return;
        }
        clearTimeout(engine.resumeTimeout);
        engine.resumeTimeout = null;
        engine.starting = false;
        engine.playing = true;
        renderControls();
      }).catch(error => failSound(ticket, error));
    } catch (error) {
      failSound(ticket, error);
    }
  }

  function stopSound(immediate = false) {
    engine.generation++;
    clearTimeout(engine.resumeTimeout);
    engine.resumeTimeout = null;
    engine.starting = false;
    engine.playing = false;
    const oscillator = engine.oscillator, gain = engine.gain;
    engine.oscillator = null;
    engine.gain = null;
    if (oscillator && gain && engine.context) {
      const now = engine.context.currentTime;
      try {
        gain.gain.cancelScheduledValues(now);
        if (immediate) gain.gain.setValueAtTime(0, now);
        else gain.gain.setTargetAtTime(0, now, 0.012);
      } catch (_) { /* Context may already have been interrupted or closed. */ }
      try { oscillator.stop(now + (immediate ? 0.001 : 0.09)); } catch (_) { /* already stopped */ }
    }
    renderControls();
  }

  function updateAudio() {
    if (!engine.context || !engine.oscillator || !engine.gain) return;
    const now = engine.context.currentTime;
    engine.oscillator.type = state.shape;
    engine.oscillator.frequency.setTargetAtTime(state.frequency, now, 0.012);
    engine.gain.gain.setTargetAtTime(AUDIO_GAIN * state.volume / 100, now, 0.016);
  }

  function prepareCanvas(canvas) {
    const width = Math.max(220, canvas.getBoundingClientRect().width);
    const height = 190;
    const scale = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    return { ctx, width, height };
  }

  function plotFrame(ctx, left, top, right, bottom) {
    ctx.strokeStyle = "#27323e";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = top + (bottom - top) * i / 4;
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }
  }

  function drawWave() {
    const { ctx, width, height } = prepareCanvas($("waveCanvas"));
    const left = 13, right = width - 12, top = 12, bottom = height - 25;
    plotFrame(ctx, left, top, right, bottom);
    const mid = (top + bottom) / 2;
    const span = right - left, duration = 0.020;
    const amplitude = (bottom - top) * 0.46 * state.volume / 100;
    const points = Math.min(1600, Math.max(480, Math.ceil(duration * state.frequency * 20)));
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#f1ce70";
    for (let i = 0; i <= points; i++) {
      const fraction = i / points;
      const x = left + span * fraction;
      const y = mid - amplitude * model.sampleWave(state.shape, duration * state.frequency * fraction);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#b7c4d1";
    for (let i = 0; i <= 4; i++) {
      ctx.textAlign = i === 0 ? "left" : i === 4 ? "right" : "center";
      ctx.fillText((i * 5) + " " + translation("ms"), left + span * i / 4, height - 7);
    }
  }

  function drawHarmonics() {
    const { ctx, width, height } = prepareCanvas($("harmonicsCanvas"));
    const left = 15, right = width - 12, top = 13, bottom = height - 25;
    plotFrame(ctx, left, top, right, bottom);
    const count = 12, slot = (right - left) / count;
    for (let n = 1; n <= count; n++) {
      const magnitude = model.harmonicMagnitude(state.shape, n);
      if (magnitude <= 0) continue;
      const barHeight = magnitude * (bottom - top - 3);
      ctx.fillStyle = n === 1 ? "#f1ce70" : "#44b9cf";
      ctx.fillRect(left + (n - .5) * slot - Math.min(19, slot * .54) / 2,
        bottom - barHeight, Math.min(19, slot * .54), barHeight);
    }
    ctx.fillStyle = "#b7c4d1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    for (const n of [1, 4, 8, 12]) {
      ctx.fillText(n === 1 ? "f" : n + "f", left + (n - .5) * slot, height - 7);
    }
  }

  let drawScheduled = false;
  function requestDraw() {
    if (drawScheduled) return;
    drawScheduled = true;
    window.requestAnimationFrame(() => {
      drawScheduled = false;
      drawWave();
      drawHarmonics();
    });
  }

  $("playButton").addEventListener("click", () => {
    if (engine.playing || engine.starting) {
      const wasStarting = engine.starting;
      stopSound(wasStarting);
      if (wasStarting && engine.context) {
        const context = engine.context;
        engine.context = null;
        context.close().catch(() => {}); // Do not retain a suspended context after cancellation.
      }
    } else startSound();
  });
  document.querySelectorAll("[data-shape]").forEach(button => {
    button.addEventListener("click", () => {
      if (!model.SHAPES.includes(button.dataset.shape)) return;
      state.shape = button.dataset.shape;
      updateAudio();
      renderControls();
      requestDraw();
    });
  });
  $("frequencySlider").value = String(Math.round(model.frequencyToSlider(state.frequency)));
  $("frequencySlider").addEventListener("input", event => {
    state.frequency = model.sliderToFrequency(event.target.value);
    updateAudio();
    renderControls();
    requestDraw();
  });
  $("volumeSlider").addEventListener("input", event => {
    state.volume = Number(event.target.value);
    updateAudio();
    renderControls();
    requestDraw();
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSound(true); });
  window.addEventListener("pagehide", () => stopSound(true));
  window.addEventListener("resize", requestDraw);
  setLanguage(startingLanguage());
})();
