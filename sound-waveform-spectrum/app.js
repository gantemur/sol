/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Small Sound Lab-derived waveform/spectrum viewer, with short local mic capture.
 */
(() => {
  "use strict";
  const model = window.SoundWaveSpectrumModel;
  const $ = id => document.getElementById(id);
  const strings = Object.freeze({
    mn: {
      title: "Дуу · Долгион ба спектр", language: "Хэл сонгох", controls: "Дууны эх сурвалж",
      source: "Жишээ дуу", sine: "Синус долгион · 440 Гц", two: "Хоёр давтамж · 440 + 660 Гц",
      sweep: "Өөрчлөгдөх давтамж", noise: "Цагаан шуугиан", guitar: "Гитар", bell: "Хонх",
      recordedOption: "Миний бичлэг", play: "▶ Сонсох", stop: "■ Зогсоох",
      record: "● Бичих", recordStop: "■ Зогсоох", settings: "Тохиргоо",
      duration: "Бичлэгийн хугацаа", sec: "сек", ms: "мсек", hz: "Гц",
      waveTitle: "Долгион", spectrumTitle: "Спектр", zoom: "Томруулах", zoomOut: "Жижигрүүлэх",
      toAverage: "Дундаж руу", toLocal: "Агшин руу", local: "Агшин", live: "Шууд",
      amplitude: "Босоо масштаб", auto: "Автомат", scale: "Масштаб",
      waveHint: "Товшиж томруулна", zoomHint: "Чирж шилжүүлнэ", cursorHint: "Шугамыг чирнэ",
      recordingHint: "Бичиж байна", spectrumHint: "Товшиж горим солино", localHint: "Хэсгийн спектр",
      lockedHint: "Томруулсан хэсгийн спектр", liveHint: "Одоогийн хэсгийн спектр",
      waveAria: "Авианы далайц ба хугацааны график", spectrumAria: "Авианы давтамжийн спектр",
      requesting: "Микрофонд хандах зөвшөөрөл хүсэж байна…", recording: "Бичиж байна",
      recorded: "Бичлэг бэлэн. Сонсох товчоор тоглуулж болно.", short: "Бичлэг хэт богино байна. Дахин оролдоно уу.",
      hidden: "Хуудас далд орсон тул бичлэг зогслоо.",
      denied: "Микрофонд хандах зөвшөөрөл олдсонгүй.",
      micUnavailable: "Энэ хөтөч микрофоны бичлэгийг дэмжихгүй эсвэл HTTPS шаардлагатай.",
      micFailed: "Бичлэг эхэлсэнгүй. Микрофоноо шалгаад дахин оролдоно уу.",
      playFailed: "Авиа тоглуулах боломжгүй. Дахин оролдоно уу.",
      cancelled: "Бичлэг эхлэхээс өмнө цуцаллаа.",
      recordingSelection: "Бичиж байх үед эх сурвалжийг өөрчлөх боломжгүй."
    },
    en: {
      title: "Sound · Waveform and spectrum", language: "Choose language", controls: "Sound source",
      source: "Example sound", sine: "Sine wave · 440 Hz", two: "Two frequencies · 440 + 660 Hz",
      sweep: "Frequency sweep", noise: "White noise", guitar: "Guitar", bell: "Bell",
      recordedOption: "My recording", play: "▶ Listen", stop: "■ Stop",
      record: "● Record", recordStop: "■ Stop", settings: "Settings",
      duration: "Recording duration", sec: "s", ms: "ms", hz: "Hz",
      waveTitle: "Waveform", spectrumTitle: "Spectrum", zoom: "Zoom in", zoomOut: "Zoom out",
      toAverage: "To average", toLocal: "Localize", local: "Local", live: "Live",
      amplitude: "Vertical scale", auto: "Auto", scale: "Scale",
      waveHint: "Tap to zoom in", zoomHint: "Drag to move the window", cursorHint: "Drag the cursor",
      recordingHint: "Recording", spectrumHint: "Tap to switch mode", localHint: "Spectrum at cursor",
      lockedHint: "Spectrum of zoomed window", liveHint: "Spectrum of latest samples",
      waveAria: "Sound amplitude over time", spectrumAria: "Frequency spectrum of the sound",
      requesting: "Requesting microphone access…", recording: "Recording",
      recorded: "Recording ready. Press Listen to play it back.", short: "Recording too short. Please try again.",
      hidden: "Recording stopped when the page was hidden.",
      denied: "Microphone permission was not granted.",
      micUnavailable: "Microphone capture is unavailable in this browser or requires HTTPS.",
      micFailed: "Could not start recording. Check your microphone and try again.",
      playFailed: "Could not play the sound. Please try again.",
      cancelled: "Recording cancelled before starting.",
      recordingSelection: "Cannot switch sources during recording."
    }
  });
  const STORAGE_KEY = "sol-sound-waveform-spectrum-language";
  const state = {
    language: "mn", selected: "sine", duration: 3, spectrumMode: "average",
    verticalScale: "auto", zoom: false, cursor: 1.5, statusKey: "", statusDetail: "",
    micPending: false, recording: null
  };
  const presetCache = new Map();
  let recorded = null, pendingMicTicket = 0, pendingMicSession = null, drawRequested = false;
  const playback = { audio: null, url: null, pending: false, ticket: 0 };
  const pointer = { active: false, moved: false, startX: 0, cursor: 0, id: null };

  function t(key) { return strings[state.language][key]; }
  function fixed(value, digits = 2) { return Number(value.toFixed(digits)).toString(); }
  function seconds(value) { return fixed(value) + " " + t("sec"); }
  function getSource() {
    if (state.recording) {
      const mic = state.recording;
      return { id: "live", samples: mic.buffer.subarray(0, mic.written),
        sampleRate: mic.sampleRate, duration: mic.seconds, available: mic.written / mic.sampleRate };
    }
    if (state.selected === "recorded" && recorded) return recorded;
    if (!presetCache.has(state.selected)) presetCache.set(state.selected, model.synthesize(state.selected));
    return presetCache.get(state.selected);
  }
  function effectiveMode() { return state.recording || state.zoom ? "local" : state.spectrumMode; }

  function startLanguage() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (requested === "mn" || requested === "en") return requested;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "mn" || saved === "en") return saved;
    } catch (_) { /* Language storage is optional. */ }
    return "mn";
  }
  function setLanguage(language) {
    if (!Object.hasOwn(strings, language)) return;
    state.language = language;
    document.documentElement.lang = language;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => {
      node.setAttribute("aria-label", t(node.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang]").forEach(node => {
      node.setAttribute("aria-pressed", String(node.dataset.lang === language));
    });
    for (const option of $("durationSelect").options) option.textContent = option.value + " " + t("sec");
    const recordOption = $("sourceSelect").querySelector('[value="recorded"]');
    if (recordOption) recordOption.textContent = t("recordedOption");
    try { localStorage.setItem(STORAGE_KEY, language); } catch (_) { /* optional */ }
    try {
      const url = new URL(location.href);
      if (url.searchParams.has("lang")) url.searchParams.set("lang", language);
      history.replaceState(null, "", url);
    } catch (_) { /* file previews may have restricted URLs */ }
    renderControls(); requestDraw();
  }

  function renderControls() {
    const busy = state.micPending || Boolean(state.recording);
    $("sourceSelect").disabled = busy;
    $("sourceSelect").value = state.selected;
    $("durationSelect").disabled = busy;
    $("playButton").disabled = busy;
    $("playButton").textContent = t(playback.audio || playback.pending ? "stop" : "play");
    $("recordButton").disabled = false;
    $("recordButton").textContent = state.recording || state.micPending ? t("recordStop") :
      t("record") + " (" + state.duration + " " + t("sec") + ")";
    $("recordButton").setAttribute("aria-pressed", String(busy));
    $("zoomButton").textContent = t(state.zoom ? "zoomOut" : "zoom");
    $("zoomButton").disabled = busy;
    $("modeButton").textContent = t(state.recording ? "live" : state.zoom ? "local" :
      state.spectrumMode === "average" ? "toLocal" : "toAverage");
    $("modeButton").disabled = busy || state.zoom;
    if (state.recording) {
      const mic = state.recording;
      $("status").textContent = t("recording") + " · " +
        seconds(Math.min(mic.seconds, mic.written / mic.sampleRate)) + " / " + seconds(mic.seconds);
    } else if (state.micPending) $("status").textContent = t("requesting");
    else $("status").textContent = state.statusKey ? t(state.statusKey) +
      (state.statusDetail ? " [" + state.statusDetail + "]" : "") : "";
  }

  function prepare(canvas) {
    const width = Math.max(200, canvas.getBoundingClientRect().width), height = 190;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(width * scale), h = Math.round(height * scale);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.clearRect(0, 0, width, height);
    return { ctx, width, height, left: 28, right: width - 12, top: 13, bottom: height - 27 };
  }
  function frame(ctx, p, horizontalTicks) {
    ctx.lineWidth = 1; ctx.strokeStyle = "#2a3440";
    for (let i = 0; i <= horizontalTicks; i++) {
      const y = p.top + (p.bottom - p.top) * i / horizontalTicks;
      ctx.beginPath(); ctx.moveTo(p.left, y); ctx.lineTo(p.right, y); ctx.stroke();
    }
  }
  function axisText(ctx, text, x, y, align = "center") {
    ctx.fillStyle = "#b7c2cf"; ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = align; ctx.fillText(text, x, y);
  }

  function drawWave() {
    const p = prepare($("waveCanvas")), ctx = p.ctx, source = getSource();
    frame(ctx, p, 4);
    const span = p.right - p.left, mid = (p.top + p.bottom) / 2;
    let start = 0, end = source.duration;
    if (state.zoom && source.samples.length) {
      const view = model.localRange(source.samples, source.sampleRate, state.cursor);
      start = view.start; end = view.end;
    }
    const duration = end - start;
    const availableEnd = state.recording ? Math.min(end, source.available) : end;
    let envelope = null, filledWidth = 0, peak = 0;
    if (source.samples.length > 1 && availableEnd > start) {
      filledWidth = Math.max(1, Math.floor(span * (availableEnd - start) / duration));
      envelope = model.waveformEnvelope(source.samples, source.sampleRate, start, availableEnd, filledWidth);
      for (let x = 0; x < filledWidth; x++) {
        peak = Math.max(peak, Math.abs(envelope.minima[x]), Math.abs(envelope.maxima[x]));
      }
    }
    const scale = model.waveformScale(peak, state.verticalScale);
    const axisLimit = fixed(1 / scale, 3);
    axisText(ctx, "+" + axisLimit, p.left - 5, p.top + 4, "right");
    axisText(ctx, "0", p.left - 5, mid + 4, "right");
    axisText(ctx, "−" + axisLimit, p.left - 5, p.bottom + 4, "right");
    if (envelope) {
      ctx.save();
      ctx.beginPath(); ctx.rect(p.left, p.top, span, p.bottom - p.top); ctx.clip();
      ctx.strokeStyle = "#f1ce70"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < filledWidth; x++) {
        const top = mid - scale * envelope.maxima[x] * (p.bottom - p.top) * 0.48;
        const bottom = mid - scale * envelope.minima[x] * (p.bottom - p.top) * 0.48;
        const at = p.left + x + 0.5;
        ctx.moveTo(at, top); ctx.lineTo(at, bottom === top ? bottom + 0.5 : bottom);
      }
      ctx.stroke();
      ctx.restore();
    }
    if (state.recording) {
      const at = p.left + span * Math.min(1, source.available / source.duration);
      ctx.strokeStyle = "#d3a34f"; ctx.beginPath(); ctx.moveTo(at, p.top); ctx.lineTo(at, p.bottom); ctx.stroke();
    } else if (!state.zoom && effectiveMode() === "local" && source.samples.length > 1) {
      const view = model.localRange(source.samples, source.sampleRate, state.cursor);
      const x0 = p.left + span * view.start / source.duration;
      const x1 = p.left + span * view.end / source.duration;
      const center = p.left + span * view.center / source.duration;
      ctx.fillStyle = "#e6bd6250"; ctx.fillRect(x0, p.top, Math.max(2, x1 - x0), p.bottom - p.top);
      ctx.strokeStyle = "#f2d18a"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(center, p.top); ctx.lineTo(center, p.bottom); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const x = p.left + span * i / 4;
      axisText(ctx, fixed((start + duration * i / 4) * 1000, state.zoom ? 0 : 0) + " " + t("ms"),
        x, p.height - 8, i === 0 ? "left" : i === 4 ? "right" : "center");
    }
    $("waveCaption").textContent = (state.zoom ? seconds(start) + "–" + seconds(end) :
      "0–" + seconds(source.duration) +
        (effectiveMode() === "local" && !state.recording ? " · t = " + seconds(state.cursor) : "")) +
      " · " + t("scale") + " ×" + fixed(scale, 1) +
      (state.verticalScale === "auto" ? " (" + t("auto") + ")" : "");
    $("waveHint").textContent = t(state.recording ? "recordingHint" : state.zoom ? "zoomHint" :
      effectiveMode() === "local" ? "cursorHint" : "waveHint");
  }

  function maxMagnitudeInBand(spectrum, low, high) {
    const bins = spectrum.magnitudes, delta = spectrum.binHz;
    const first = Math.max(1, Math.ceil(low / delta)), last = Math.min(bins.length - 1, Math.floor(high / delta));
    if (first > last) return bins[Math.min(bins.length - 1, Math.max(1, Math.round(Math.sqrt(low * high) / delta)))];
    let maximum = 0;
    for (let bin = first; bin <= last; bin++) maximum = Math.max(maximum, bins[bin]);
    return maximum;
  }

  function drawSpectrum() {
    const p = prepare($("spectrumCanvas")), ctx = p.ctx, source = getSource();
    const width = p.right - p.left, height = p.bottom - p.top;
    for (const db of [0, -20, -40, -60, -80, -100]) {
      const y = p.top - db / 100 * height;
      ctx.strokeStyle = "#293542"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.left, y); ctx.lineTo(p.right, y); ctx.stroke();
      axisText(ctx, String(db), p.left - 5, y + 4, "right");
    }
    const low = 80, high = Math.min(8000, source.sampleRate / 2);
    const ratio = Math.log(high / low);
    for (const hz of [100, 200, 500, 1000, 2000, 4000, 8000]) {
      if (hz > high) continue;
      const x = p.left + Math.log(hz / low) / ratio * width;
      ctx.strokeStyle = "#202b35";
      ctx.beginPath(); ctx.moveTo(x, p.top); ctx.lineTo(x, p.bottom); ctx.stroke();
      axisText(ctx, hz >= 1000 ? hz / 1000 + "k" : String(hz), x, p.height - 8);
    }
    let spectrum = null;
    if (source.samples.length >= 4) {
      if (effectiveMode() === "local") {
        const cursor = state.recording ? source.available : state.cursor;
        spectrum = model.spectrumLocal(source.samples, source.sampleRate, cursor);
      } else {
        if (!source.average) source.average = model.spectrumAverage(source.samples, source.sampleRate);
        spectrum = source.average;
      }
    }
    if (spectrum) {
      ctx.strokeStyle = "#7dc7df"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= Math.ceil(width); i++) {
        const fraction = Math.min(1, i / width);
        const f1 = low * Math.exp(ratio * fraction);
        const f2 = low * Math.exp(ratio * Math.min(1, (i + 1) / width));
        const magnitude = maxMagnitudeInBand(spectrum, f1, f2);
        const db = 20 * Math.log10(Math.max(1e-6, magnitude));
        const y = p.top + Math.min(1, Math.max(0, -db / 100)) * height;
        if (i === 0) ctx.moveTo(p.left, y); else ctx.lineTo(p.left + i, y);
      }
      ctx.stroke();
    }
    $("spectrumCaption").textContent = "80–" + high + " " + t("hz") + " · dBFS";
    $("spectrumHint").textContent = t(state.recording ? "liveHint" : state.zoom ? "lockedHint" :
      effectiveMode() === "local" ? "localHint" : "spectrumHint");
  }

  function draw() { drawRequested = false; drawWave(); drawSpectrum(); }
  function requestDraw() {
    if (drawRequested) return;
    drawRequested = true;
    requestAnimationFrame(draw);
  }

  function stopPlayback() {
    playback.ticket++;
    const audio = playback.audio, url = playback.url;
    playback.audio = null; playback.url = null; playback.pending = false;
    if (audio) {
      audio.onended = null; audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    if (url) URL.revokeObjectURL(url);
    renderControls();
  }
  function playbackFailed(ticket, error) {
    if (ticket !== playback.ticket) return; // Stopped/replaced while play() was pending.
    stopPlayback();
    state.statusKey = "playFailed";
    state.statusDetail = error?.name || (error?.code ? "MediaError " + error.code : "unknown");
    renderControls();
  }
  function playSelected() {
    if (playback.audio || playback.pending) { stopPlayback(); return; }
    if (state.recording || state.micPending) return;
    const ticket = ++playback.ticket;
    playback.pending = true; state.statusKey = ""; state.statusDetail = ""; renderControls();
    try {
      const source = getSource();
      const wav = model.encodeWav16(source.samples, source.sampleRate);
      const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
      playback.url = url;
      const audio = document.createElement("audio");
      audio.preload = "auto";
      audio.src = url;
      audio.volume = 0.65;
      audio.onended = () => { if (playback.audio === audio) stopPlayback(); };
      audio.onerror = () => playbackFailed(ticket, audio.error);
      playback.audio = audio;
      // Call play() directly inside the click gesture (before any await):
      // Safari is stricter about activation after an asynchronous resume().
      const started = audio.play();
      if (started && typeof started.then === "function") {
        started.then(() => {
          if (ticket === playback.ticket) { playback.pending = false; renderControls(); }
        }).catch(error => playbackFailed(ticket, error));
      } else playback.pending = false;
      renderControls();
    } catch (error) {
      playbackFailed(ticket, error);
    }
  }

  function releaseMedia(owner) {
    const stream = owner.stream, context = owner.context;
    owner.stream = null; owner.context = null;
    if (stream) for (const track of stream.getTracks()) track.stop();
    if (context) context.close().catch(() => {});
  }
  function releasePendingMic() {
    const attempt = pendingMicSession;
    pendingMicSession = null;
    if (attempt) releaseMedia(attempt);
  }
  function disposeMic(mic) {
    clearInterval(mic.timer);
    if (mic.worklet) { mic.worklet.port.onmessage = null; try { mic.worklet.disconnect(); } catch (_) {} }
    if (mic.source) try { mic.source.disconnect(); } catch (_) {}
    if (mic.sink) try { mic.sink.disconnect(); } catch (_) {}
    releaseMedia(mic);
  }

  function finishMic(mic, reason = "manual") {
    if (state.recording !== mic) return;
    state.recording = null;
    disposeMic(mic); // Stop permission use immediately, before doing any analysis.
    if (mic.written >= Math.round(mic.sampleRate * 0.06)) {
      recorded = { id: "recorded", samples: mic.buffer.slice(0, mic.written), sampleRate: mic.sampleRate,
        duration: mic.written / mic.sampleRate };
      if (!$("sourceSelect").querySelector('[value="recorded"]')) {
        const option = document.createElement("option");
        option.value = "recorded"; option.textContent = t("recordedOption");
        $("sourceSelect").appendChild(option);
      }
      state.selected = "recorded";
      state.cursor = recorded.duration / 2;
      state.statusKey = reason === "hidden" ? "hidden" : "recorded";
    } else state.statusKey = reason === "hidden" ? "hidden" : "short";
    renderControls(); requestDraw();
  }

  function stopRecording() {
    const mic = state.recording;
    if (!mic) return;
    // Keep the PCM already delivered (at most one worklet chunk is in flight),
    // and release the device immediately rather than waiting for a port reply.
    finishMic(mic, "manual");
  }

  async function recordMic() {
    if (state.recording) { stopRecording(); return; }
    if (state.micPending) {
      pendingMicTicket++; // Any subsequently granted stream is stopped in finally.
      state.micPending = false;
      releasePendingMic(); // Also release a granted stream if worklet setup is still pending.
      state.statusKey = "cancelled";
      state.statusDetail = "";
      renderControls();
      return;
    }
    stopPlayback();
    state.statusKey = ""; state.statusDetail = "";
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioContextClass || !window.AudioWorkletNode) {
      state.statusKey = "micUnavailable"; renderControls(); return;
    }
    state.micPending = true;
    const ticket = ++pendingMicTicket;
    renderControls();
    const attempt = { context: null, stream: null };
    pendingMicSession = attempt;
    try {
      // Both calls originate in the user gesture (important on mobile browsers).
      attempt.context = new AudioContextClass();
      const resume = Promise.resolve(attempt.context.resume()).then(() => null, error => error);
      const permission = navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false
      });
      attempt.stream = await permission;
      if (ticket !== pendingMicTicket) return;
      const resumeError = await resume;
      if (resumeError) throw resumeError;
      if (ticket !== pendingMicTicket) return;
      if (!attempt.context.audioWorklet) throw new Error("unsupported");
      await attempt.context.audioWorklet.addModule("microphone-worklet.js");
      if (ticket !== pendingMicTicket) return;
      const mic = {
        context: attempt.context, stream: attempt.stream, seconds: state.duration,
        sampleRate: attempt.context.sampleRate,
        buffer: new Float32Array(Math.round(attempt.context.sampleRate * state.duration)),
        written: 0, source: null, worklet: null, sink: null, timer: null,
      };
      mic.worklet = new AudioWorkletNode(mic.context, "sol-short-mic", {
        numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1],
        processorOptions: { seconds: state.duration }
      });
      mic.source = mic.context.createMediaStreamSource(mic.stream);
      mic.sink = mic.context.createGain(); mic.sink.gain.value = 0;
      mic.source.connect(mic.worklet); mic.worklet.connect(mic.sink);
      mic.sink.connect(mic.context.destination);
      mic.worklet.port.onmessage = event => {
        if (state.recording !== mic) return;
        const data = event.data;
        if (data?.type === "chunk" && data.samples instanceof Float32Array) {
          const remaining = mic.buffer.length - mic.written;
          const length = Math.min(remaining, data.samples.length);
          mic.buffer.set(data.samples.subarray(0, length), mic.written);
          mic.written += length;
        } else if (data?.type === "ended") finishMic(mic, data.reason);
      };
      mic.stream.getAudioTracks().forEach(track => track.addEventListener("ended", () => {
        if (state.recording === mic) finishMic(mic);
      }));
      state.recording = mic;
      state.micPending = false;
      pendingMicSession = null;
      attempt.context = null; attempt.stream = null; // Ownership transferred to active mic.
      state.zoom = false;
      mic.timer = setInterval(() => { renderControls(); requestDraw(); }, 100);
      renderControls(); requestDraw();
    } catch (error) {
      if (ticket === pendingMicTicket) {
        state.micPending = false;
        state.statusKey = error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError" ?
          "denied" : error?.message === "unsupported" ? "micUnavailable" : "micFailed";
        renderControls();
      }
    } finally {
      if (pendingMicSession === attempt) pendingMicSession = null;
      releaseMedia(attempt);
    }
  }

  function toggleZoom() {
    if (state.recording || state.micPending) return;
    state.zoom = !state.zoom;
    renderControls(); requestDraw();
  }
  function toggleSpectrum() {
    if (state.recording || state.micPending || state.zoom) return;
    state.spectrumMode = state.spectrumMode === "average" ? "local" : "average";
    renderControls(); requestDraw();
  }
  function timeFromPointer(event) {
    const rect = $("waveCanvas").getBoundingClientRect();
    const fraction = model.clamp((event.clientX - rect.left - 28) / (rect.width - 40), 0, 1);
    return fraction * getSource().duration;
  }

  $("waveCanvas").addEventListener("pointerdown", event => {
    if (state.recording || state.micPending) return;
    pointer.active = true; pointer.moved = false; pointer.id = event.pointerId;
    pointer.startX = event.clientX; pointer.cursor = state.cursor;
    $("waveCanvas").setPointerCapture(event.pointerId);
    if (!state.zoom && effectiveMode() === "local") {
      state.cursor = timeFromPointer(event); requestDraw();
    }
  });
  $("waveCanvas").addEventListener("pointermove", event => {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    const delta = event.clientX - pointer.startX;
    if (Math.abs(delta) > 5) pointer.moved = true;
    if (state.zoom) {
      const width = Math.max(1, $("waveCanvas").getBoundingClientRect().width - 40);
      state.cursor = model.clamp(pointer.cursor - delta / width * model.LOCAL_SECONDS,
        0, getSource().duration);
      requestDraw();
    } else if (effectiveMode() === "local") {
      state.cursor = timeFromPointer(event); requestDraw();
    }
  });
  function releasePointer(event) {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    pointer.active = false;
    if (event.type === "pointerup" && !pointer.moved) {
      if (!state.zoom) state.cursor = timeFromPointer(event);
      toggleZoom();
    }
  }
  $("waveCanvas").addEventListener("pointerup", releasePointer);
  $("waveCanvas").addEventListener("pointercancel", releasePointer);
  $("waveCanvas").addEventListener("keydown", event => {
    if (state.recording || state.micPending) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); toggleZoom(); return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!state.zoom) state.spectrumMode = "local";
    const source = getSource();
    const step = state.zoom ? 0.01 : Math.max(0.02, source.duration / 60);
    if (event.key === "Home") state.cursor = 0;
    else if (event.key === "End") state.cursor = source.duration;
    else state.cursor = model.clamp(state.cursor + (event.key === "ArrowRight" ? step : -step), 0, source.duration);
    renderControls(); requestDraw();
  });
  $("spectrumCanvas").addEventListener("click", toggleSpectrum);
  $("zoomButton").addEventListener("click", toggleZoom);
  $("modeButton").addEventListener("click", toggleSpectrum);
  $("playButton").addEventListener("click", playSelected);
  $("recordButton").addEventListener("click", recordMic);
  $("sourceSelect").addEventListener("change", event => {
    if (state.recording || state.micPending) return;
    // Save the new value before stopping playback: stopPlayback renders controls,
    // which otherwise restores the previous select value mid-change event.
    const chosen = event.target.value;
    stopPlayback();
    state.selected = chosen;
    state.zoom = false;
    state.cursor = getSource().duration / 2;
    state.statusKey = ""; state.statusDetail = ""; renderControls(); requestDraw();
  });
  $("durationSelect").addEventListener("change", event => {
    const value = Number(event.target.value);
    if (Number.isInteger(value) && value >= 1 && value <= 4) state.duration = value;
    renderControls();
  });
  $("verticalScaleSelect").addEventListener("change", event => {
    const value = event.target.value;
    if (["auto", "1", "2", "5", "10", "20", "50"].includes(value)) state.verticalScale = value;
    $("verticalScaleSelect").value = state.verticalScale;
    requestDraw();
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    if (state.micPending) {
      pendingMicTicket++;
      state.micPending = false;
      releasePendingMic();
      state.statusKey = "hidden";
      renderControls();
    }
    if (state.recording) finishMic(state.recording, "hidden");
  });
  window.addEventListener("pagehide", () => {
    pendingMicTicket++;
    releasePendingMic();
    if (state.recording) { const mic = state.recording; state.recording = null; disposeMic(mic); }
    stopPlayback();
  });
  window.addEventListener("resize", requestDraw);

  setLanguage(startLanguage());
})();
