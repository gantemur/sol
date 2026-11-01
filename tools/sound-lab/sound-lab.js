/* Sound Lab P1: browser UI and a single, safely bounded Web Audio tone. */
(() => {
  "use strict";
  const model = window.SoundLabModel;
  const $ = id => document.getElementById(id);

  const messages = {
    en: {
      backLabel: "Back to Sol tools", stop: "■ Stop", eyebrow: "EXPLORE SOUNDS · PURE TONES",
      title: "What does a wave sound like?",
      intro: "Play a simple sound, change its pitch or shape, and watch what happens to its wave and harmonics.",
      phase: "01 · Ideal signals", chooseShape: "Choose a wave shape",
      sine: "Sine", triangle: "Triangle", square: "Square", sawtooth: "Sawtooth",
      play: "Play tone", playCaption: "Tap or click to hear",
      stopTone: "Stop tone", stopCaption: "Sound is playing · tap to stop",
      frequency: "Frequency", snap: "Snap to notes",
      sliderHint: "The slider is logarithmic. Type a frequency for values outside its range.",
      sliderOutside: "The typed frequency is beyond the slider range; the exact value is still used.",
      tryNote: "Try a note:", volume: "Volume",
      safeVolume: "Starts quietly. Increase volume carefully, especially with headphones.",
      settings: "⚙ Settings", tuning: "Tuning for snapped notes",
      tuningHint: "The note names use 12-tone equal temperament for now.",
      equal: "12-tone equal", fixedTime: "Keep the time window fixed at 20 ms",
      fixedHint: "Uncheck to zoom into four periods and examine the wave shape. The time scale then changes with frequency.",
      waveTitle: "Waveform over time", waveSubtitle: "Same 20 ms at every frequency: higher pitch means more cycles.",
      waveSubtitleZoom: "Zoomed to four periods: the time scale now changes with frequency.",
      cyclesUnit: "cycles",
      spectrumTitle: "Harmonics", spectrumSubtitle: "Ideal frequency components, relative to the first",
      timeAxis: "time →", frequencyAxis: "frequency →",
      tryThis: "TRY THIS", reset: "↺ Reset",
      learnMore: "Why do the wave shapes sound different?",
      lessonOne: "Every repeating wave has a fundamental frequency. The higher harmonic peaks occur at whole-number multiples of it: 2f, 3f, 4f, and so on.",
      lessonTwo: "Changing the wave shape changes the strengths of those harmonics. The pitch can stay the same even when the sound's character changes.",
      lessonThree: "These plots show ideal mathematical signals, not a recording from your speakers. Actual loudness and high-frequency response depend on your device.",
      footer: "Sol Sound Lab · Sound is generated on your device; nothing is recorded or uploaded.",
      future: "More sounds and music-making are planned.",
      waveAria: "Modeled waveform over time", spectrumAria: "Modeled harmonic magnitude spectrum",
      sliderAria: "Logarithmic frequency slider", frequencyAria: "Exact frequency in hertz",
      presetsAria: "Musical note presets", waveGroupAria: "Waveform shape",
      langGroupAria: "Interface language", amplitude: "amplitude",
      ready: "Ready. Sound begins only when you press Play.",
      starting: "Starting sound…",
      playing: "Playing. Use the large button or Stop to silence it.",
      stopped: "Stopped. Press Play to hear this wave.",
      hidden: "Sound stopped when you left the page.",
      unsupported: "This browser does not support Web Audio playback.",
      blocked: "The sound could not start. Check browser audio permission and try Play again.",
      invalid: "Enter a frequency between 20 and 12,000 Hz.",
      desc: {
        sine: "One smooth vibration, with a single frequency.",
        triangle: "A gentle-edged wave with weak, odd-numbered harmonics.",
        square: "A bright wave with strong odd-numbered harmonics.",
        sawtooth: "A buzzy wave containing many harmonics."
      },
      insight: {
        sine: "Only the fundamental is present in an ideal sine wave.",
        triangle: "Odd harmonics are present, but fade very quickly.",
        square: "The 3rd, 5th, 7th… harmonics are present; even ones are absent.",
        sawtooth: "Every whole-number harmonic is present, decreasing in strength."
      },
      challenge: {
        sine: "Double the frequency. How do the pitch and period change?",
        triangle: "Compare triangle and square at the same frequency. Which has weaker high harmonics?",
        square: "Change from sine to square without changing frequency. Does the pitch stay the same?",
        sawtooth: "Compare the spectrum of a sine and a sawtooth. How many peaks appear?"
      }
    },
    mn: {
      backLabel: "Sol-ийн хэрэгслүүд рүү буцах", stop: "■ Зогсоох",
      eyebrow: "ДУУ АВИА СУДЛАХ · ЦЭВЭР АВИА",
      title: "Долгион ямар сонсогддог вэ?",
      intro: "Авиа тоглуулж, давтамж ба хэлбэрийг нь өөрчлөөд долгион, гармоникууд нь хэрхэн хувирахыг ажиглаарай.",
      phase: "01 · Энгийн дохионууд", chooseShape: "Долгионы хэлбэр сонгох",
      sine: "Синус", triangle: "Гурвалжин", square: "Тэгш өнцөгт", sawtooth: "Хөрөө",
      play: "Авиа тоглуулах", playCaption: "Сонсохын тулд товшино уу",
      stopTone: "Авиа зогсоох", stopCaption: "Авиа дуугарч байна · зогсоохын тулд товшино уу",
      frequency: "Давтамж", snap: "Нотод тааруулах",
      sliderHint: "Гулсуур нь логарифм хуваарьтай. Хязгаараас гадуур утгыг гараар оруулж болно.",
      sliderOutside: "Гараар оруулсан давтамж гулсуурын хязгаараас гадуур боловч яг тэр утгыг хэрэглэнэ.",
      tryNote: "Нот турших:", volume: "Дууны хэмжээ",
      safeVolume: "Эхэндээ аяархан дуугарна. Ялангуяа чихэвч хэрэглэвэл болгоомжтой нэмээрэй.",
      settings: "⚙ Тохиргоо", tuning: "Нотод тааруулах хөглөлт",
      tuningHint: "Одоохондоо 12 тэнцүү хагас авианы хөглөлт ашиглана.",
      equal: "12 тэнцүү хуваарь", fixedTime: "Хугацааны цонхыг 20 мс-д тогтмол байлгах",
      fixedHint: "Долгионы хэлбэрийг сайн харахын тулд тэмдэглэгээг арилгаж дөрвөн үеийг томруулна. Ингэвэл хугацааны хуваарь өөрчлөгдөнө.",
      waveTitle: "Хугацааны дагуух долгион", waveSubtitle: "Хугацаа 20 мс хэвээр: давтамж ихсэхэд олон үе багтана.",
      waveSubtitleZoom: "Дөрвөн үеийг томруулж харуулав. Давтамжтай хамт хугацааны хуваарь өөрчлөгдөнө.",
      cyclesUnit: "үе",
      spectrumTitle: "Гармоникууд", spectrumSubtitle: "Үндсэн давтамжтай харьцуулсан идеал бүрэлдэхүүн",
      timeAxis: "хугацаа →", frequencyAxis: "давтамж →",
      tryThis: "ТУРШИЖ ҮЗ", reset: "↺ Эхнээс нь",
      learnMore: "Долгионы хэлбэрүүд яагаад өөр сонсогддог вэ?",
      lessonOne: "Үелэх долгионд үндсэн давтамж байдаг. Дээд гармоникууд нь үндсэн давтамжийн бүхэл тоон үржвэрүүд: 2f, 3f, 4f гэх мэт.",
      lessonTwo: "Долгионы хэлбэр өөрчлөгдөхөд гармоникуудын хүч өөрчлөгдөнө. Авиа нэг өндөртэй атлаа өөр өнгөтэй сонсогдож болно.",
      lessonThree: "Эдгээр зураг нь чанга яригчаас бичиж авсан дохио биш, идеал математик загвар юм. Бодит дууны хэмжээ, өндөр давтамжийн чанар төхөөрөмжөөс хамаарна.",
      footer: "Sol Дууны лаборатори · Авиа зөвхөн таны төхөөрөмж дээр үүснэ. Бичиж авахгүй, илгээхгүй.",
      future: "Цаашид өөр авиа, хөгжим зохиох боломж нэмэгдэнэ.",
      waveAria: "Хугацааны дагуух долгионы загвар", spectrumAria: "Гармоникийн далайцын загвар",
      sliderAria: "Логарифм давтамжийн гулсуур", frequencyAria: "Давтамжийг герцээр оруулах",
      presetsAria: "Хөгжмийн нотын жишээ", waveGroupAria: "Долгионы хэлбэр",
      langGroupAria: "Хэл сонгох", amplitude: "далайц",
      ready: "Бэлэн. «Тоглуулах» товчийг дарахад л авиа гарна.",
      starting: "Авиа эхлүүлж байна…",
      playing: "Авиа дуугарч байна. Том товч эсвэл «Зогсоох»-ыг дарна уу.",
      stopped: "Зогслоо. «Тоглуулах» товчийг дарж сонсоорой.",
      hidden: "Хуудсаас гарахад авиа зогслоо.",
      unsupported: "Энэ хөтөч Web Audio-гаар авиа тоглуулах боломжгүй байна.",
      blocked: "Авиа эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгаад дахин оролдоно уу.",
      invalid: "20–12,000 Гц-ийн хооронд давтамж оруулна уу.",
      desc: {
        sine: "Нэг үндсэн давтамжтай жигд хэлбэлзэл.",
        triangle: "Дээд сондгой гармоникууд нь сул долгион.",
        square: "Сондгой гармоникууд нь хүчтэй, тод сонсогдох долгион.",
        sawtooth: "Олон гармониктой, баялаг өнгөтэй долгион."
      },
      insight: {
        sine: "Идеал синус долгион зөвхөн үндсэн давтамжтай.",
        triangle: "Сондгой гармоникууд бий, гэхдээ хурдан суларна.",
        square: "3, 5, 7…-р гармоникууд бий; тэгш дугаартай нь байхгүй.",
        sawtooth: "Бүхэл тоон гармоник бүр бий, хүч нь аажмаар суларна."
      },
      challenge: {
        sine: "Давтамжийг хоёр дахин өсгө. Авиа ба үе хэрхэн өөрчлөгдөх вэ?",
        triangle: "Ижил давтамжтай гурвалжин ба тэгш өнцөгт долгионыг харьцуул. Алиных нь дээд гармоник сул вэ?",
        square: "Давтамжаа өөрчлөхгүйгээр синусыг тэгш өнцөгт болго. Авиа өндөр хэвээр үлдэх үү?",
        sawtooth: "Синус ба хөрөө хэлбэрийн спектрийг харьцуул. Хэдэн оргил харагдаж байна вэ?"
      }
    }
  };

  const params = new URLSearchParams(window.location.search);
  const state = {
    language: params.get("lang") === "en" ? "en" : "mn",
    waveform: "sine",
    frequency: 440,
    volume: 40,
    snap: false,
    fixedTime: true,
    playing: false,
    status: "ready",
    error: false
  };
  const text = key => messages[state.language][key];
  const frequencyText = hz => Number(hz.toFixed(2)).toLocaleString("en-US", { maximumFractionDigits: 2 });

  class ToneEngine {
    constructor() {
      this.context = null;
      this.currentVoice = null;
      this.voices = new Set();
      this.generation = 0;
    }

    gainForVolume() {
      // Hard cap: a single oscillator cannot exceed 0.15 linear amplitude.
      return 0.15 * state.volume / 100;
    }

    createVoice() {
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = state.waveform;
      oscillator.frequency.setValueAtTime(state.frequency, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.gainForVolume(), now + 0.035);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      const voice = { oscillator: oscillator, gain: gain, stopping: false };
      this.voices.add(voice);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      oscillator.start(now);
      this.currentVoice = voice;
    }

    fadeAndStop(voice, immediate) {
      if (!this.context || (voice.stopping && !immediate)) return;
      if (voice.stopping && immediate) {
        const now = this.context.currentTime;
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(0, now);
        return;
      }
      voice.stopping = true;
      const now = this.context.currentTime;
      const param = voice.gain.gain;
      param.cancelScheduledValues(now);
      if (immediate) param.setValueAtTime(0, now);
      else param.setTargetAtTime(0, now, 0.012);
      try { voice.oscillator.stop(now + (immediate ? 0.001 : 0.09)); }
      catch (_) { /* A voice may already have stopped. */ }
    }

    async start() {
      const ticket = ++this.generation;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("unsupported");
      if (!this.context) this.context = new AudioContextClass();
      await this.context.resume();
      if (ticket !== this.generation) return false;
      if (this.context.state !== "running") throw new Error("blocked");
      this.createVoice();
      return true;
    }

    changeWaveform() {
      if (!this.currentVoice) return;
      const previous = this.currentVoice;
      this.createVoice();
      this.fadeAndStop(previous, false);
    }

    changeFrequency() {
      if (!this.currentVoice) return;
      const now = this.context.currentTime;
      this.currentVoice.oscillator.frequency.setTargetAtTime(state.frequency, now, 0.018);
    }

    changeVolume() {
      if (!this.currentVoice) return;
      const now = this.context.currentTime;
      const param = this.currentVoice.gain.gain;
      param.cancelScheduledValues(now);
      param.setTargetAtTime(this.gainForVolume(), now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
      if (immediate && this.context && this.context.state === "running") {
        this.context.suspend().catch(() => {});
      }
    }
  }

  const audio = new ToneEngine();

  function setStatus(status, error = false) {
    state.status = status;
    state.error = error;
    $("audioStatus").textContent = text(status);
    $("audioStatus").classList.toggle("error", error);
  }

  function renderTexts() {
    document.documentElement.lang = state.language;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if (typeof text(key) === "string") element.textContent = text(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
      element.setAttribute("aria-label", text(element.getAttribute("data-i18n-aria")));
    });
    $("langEn").classList.toggle("active", state.language === "en");
    $("langMn").classList.toggle("active", state.language === "mn");
    $("langEn").setAttribute("aria-pressed", String(state.language === "en"));
    $("langMn").setAttribute("aria-pressed", String(state.language === "mn"));
    $("soundDescription").textContent = text("desc")[state.waveform];
    $("harmonicInsight").textContent = text("insight")[state.waveform];
    $("challengeText").textContent = text("challenge")[state.waveform];
    $("waveCanvas").setAttribute("aria-label", text("waveAria"));
    $("spectrumCanvas").setAttribute("aria-label", text("spectrumAria"));
    $("frequencySlider").setAttribute("aria-label", text("sliderAria"));
    $("frequencyInput").setAttribute("aria-label", text("frequencyAria"));
    $("waveChoices").setAttribute("aria-label", text("waveGroupAria"));
    document.querySelector(".note-presets").setAttribute("aria-label", text("presetsAria"));
    document.querySelector(".lang-group").setAttribute("aria-label", text("langGroupAria"));
    setStatus(state.status, state.error);
  }

  function renderControls() {
    $("frequencySlider").value = String(Math.round(model.frequencyToSlider(state.frequency)));
    $("frequencyInput").value = String(Number(state.frequency.toFixed(6)));
    $("frequencyInput").setAttribute("aria-valuetext", String(Number(state.frequency.toFixed(6))) + " Hz");
    const note = model.nearestNote(state.frequency);
    const differenceCents = 1200 * Math.log2(state.frequency / note.frequency);
    const approx = !state.snap && Math.abs(differenceCents) >= 0.5 ? "≈ " : "";
    $("noteLabel").textContent = approx + note.english + " · " + note.mongolian;
    $("noteLabel").title = "12-TET: " + frequencyText(note.frequency) + " Hz";
    $("snapCheck").checked = state.snap;
    $("volumeSlider").value = String(state.volume);
    $("volumeReadout").textContent = state.volume + "%";
    $("fixedTimeCheck").checked = state.fixedTime;
    $("sliderHelp").textContent = state.frequency < model.SLIDER_MIN_HZ || state.frequency > model.SLIDER_MAX_HZ ?
      text("sliderOutside") : text("sliderHint");
    document.querySelectorAll("[data-wave]").forEach(button => {
      const active = button.dataset.wave === state.waveform;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("playButton").classList.toggle("playing", state.playing);
    $("playButton").setAttribute("aria-pressed", String(state.playing));
    $("playIcon").textContent = state.playing ? "■" : "▶";
    $("playLabel").textContent = state.playing ? text("stopTone") : text("play");
    $("playCaption").textContent = state.playing ? text("stopCaption") : text("playCaption");
  }

  function setFrequency(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < model.INPUT_MIN_HZ || value > model.INPUT_MAX_HZ) {
      setStatus("invalid", true);
      renderControls();
      return;
    }
    state.frequency = state.snap ? model.snapFrequency(value) : value;
    audio.changeFrequency();
    if (state.status === "invalid") setStatus(state.playing ? "playing" : "ready");
    renderControls();
    drawPlots();
  }

  function stopSound(immediate = false, message = "stopped") {
    audio.stop(immediate);
    state.playing = false;
    setStatus(message);
    renderControls();
  }

  async function toggleSound() {
    if (state.playing) {
      stopSound();
      return;
    }
    setStatus("starting");
    try {
      if (await audio.start()) {
        state.playing = true;
        setStatus("playing");
        renderControls();
      }
    } catch (error) {
      audio.stop(true);
      state.playing = false;
      setStatus(error.message === "unsupported" ? "unsupported" : "blocked", true);
      renderControls();
    }
  }

  function selectWaveform(waveform) {
    if (!model.WAVEFORMS.includes(waveform) || waveform === state.waveform) return;
    state.waveform = waveform;
    audio.changeWaveform();
    renderTexts();
    renderControls();
    drawPlots();
  }

  function setLanguage(language) {
    state.language = language;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", url);
    renderTexts();
    renderControls();
    drawPlots();
  }

  function reset() {
    stopSound();
    state.waveform = "sine";
    state.frequency = 440;
    state.volume = 40;
    state.snap = false;
    state.fixedTime = true;
    $("settings").open = false;
    renderTexts();
    renderControls();
    drawPlots();
  }

  function plotContext(canvas) {
    const width = Math.max(220, Math.round(canvas.getBoundingClientRect().width));
    const height = Math.max(120, Math.round(canvas.getBoundingClientRect().height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fbfdff";
    ctx.fillRect(0, 0, width, height);
    return { ctx: ctx, width: width, height: height };
  }

  function drawFrame(ctx, width, height, left, right, top, bottom) {
    const spanX = right - left, spanY = bottom - top;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e8eff7";
    for (let j = 0; j <= 4; j++) {
      const y = top + spanY * j / 4;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const x = left + spanX * i / 4;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    ctx.strokeStyle = "#a9bdd3";
    ctx.beginPath();
    ctx.moveTo(left, (top + bottom) / 2);
    ctx.lineTo(right, (top + bottom) / 2);
    ctx.stroke();
    ctx.fillStyle = "#788da2";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textBaseline = "middle";
  }

  function drawWave() {
    const data = plotContext($("waveCanvas"));
    const ctx = data.ctx, width = data.width, height = data.height;
    const left = 34, right = width - 15, top = 26, bottom = height - 30;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const duration = state.fixedTime ? 0.020 : 4 / state.frequency;
    const periodMs = 1000 / state.frequency;
    $("periodBadge").textContent = "T = " + frequencyText(periodMs) + " ms";
    $("windowLabel").textContent = "0–" + frequencyText(duration * 1000) + " ms · " +
      frequencyText(duration * state.frequency) + " " + text("cyclesUnit");
    $("waveSubtitle").textContent = text(state.fixedTime ? "waveSubtitle" : "waveSubtitleZoom");
    $("fundamentalBadge").textContent = "f₀ = " + frequencyText(state.frequency) + " Hz";
    ctx.fillStyle = "#7489a1";
    ctx.textAlign = "left";
    ctx.fillText(text("amplitude"), 9, 13);
    const middle = (top + bottom) / 2, amplitude = (bottom - top) * 0.46 * Math.sqrt(state.volume / 100);
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    // Avoid undersampling dense high-frequency traces on a fixed time axis.
    const points = Math.max(480, Math.round((right - left) * 1.5),
      Math.ceil(duration * state.frequency * 12));
    for (let i = 0; i <= points; i++) {
      const fraction = i / points;
      const phase = fraction * duration * state.frequency;
      const y = middle - amplitude * model.sampleWave(state.waveform, phase);
      const x = left + (right - left) * fraction;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#788da2";
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const x = left + (right - left) * i / 4;
      ctx.fillText(frequencyText(duration * 250 * i) + " ms", x, height - 12);
    }
  }

  function drawSpectrum() {
    const data = plotContext($("spectrumCanvas"));
    const ctx = data.ctx, width = data.width, height = data.height;
    const left = 36, right = width - 12, top = 14, bottom = height - 32;
    const spanX = right - left, spanY = bottom - top;
    ctx.strokeStyle = "#e8eff7";
    ctx.lineWidth = 1;
    for (let level = 0; level <= 4; level++) {
      const y = top + spanY * level / 4;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "#8297aa";
    ctx.fillText("1", left - 8, top + 4);
    ctx.fillText("0", left - 8, bottom + 3);
    const count = 12, slot = spanX / count;
    for (let n = 1; n <= count; n++) {
      const strength = model.harmonicMagnitude(state.waveform, n);
      if (strength <= 0) continue;
      const barWidth = Math.max(6, Math.min(28, slot * 0.48));
      const barHeight = strength * (spanY - 4);
      ctx.fillStyle = n === 1 ? "#4383d0" : "#27a59f";
      ctx.fillRect(left + (n - .5) * slot - barWidth / 2, bottom - barHeight, barWidth, barHeight);
    }
    ctx.fillStyle = "#758aa0";
    ctx.textAlign = "center";
    for (const n of [1, 4, 8, 12]) {
      const x = left + (n - .5) * slot;
      const hz = n * state.frequency;
      const label = hz < 1000 ? Math.round(hz) + " Hz" : (hz / 1000).toFixed(1) + " kHz";
      ctx.fillText(label, x, height - 13);
    }
  }

  function drawPlots() {
    drawWave();
    drawSpectrum();
  }

  document.querySelectorAll("[data-wave]").forEach(button => {
    button.addEventListener("click", () => selectWaveform(button.dataset.wave));
  });
  document.querySelectorAll("[data-note]").forEach(button => {
    button.addEventListener("click", () => setFrequency(model.hzFromMidi(Number(button.dataset.note))));
  });
  $("playButton").addEventListener("click", toggleSound);
  $("stopAll").addEventListener("click", () => stopSound());
  $("frequencySlider").addEventListener("input", event => setFrequency(model.sliderToFrequency(Number(event.target.value))));
  $("frequencyInput").addEventListener("change", event => setFrequency(event.target.value));
  $("snapCheck").addEventListener("change", event => {
    state.snap = event.target.checked;
    if (state.snap) setFrequency(state.frequency);
    else renderControls();
  });
  $("volumeSlider").addEventListener("input", event => {
    state.volume = Number(event.target.value);
    audio.changeVolume();
    renderControls();
    drawPlots();
  });
  $("fixedTimeCheck").addEventListener("change", event => {
    state.fixedTime = event.target.checked;
    drawPlots();
  });
  $("resetButton").addEventListener("click", reset);
  $("langEn").addEventListener("click", () => setLanguage("en"));
  $("langMn").addEventListener("click", () => setLanguage("mn"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSound(true, "hidden");
  });
  window.addEventListener("pagehide", () => stopSound(true, "hidden"));
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => drawPlots());
    observer.observe($("waveCanvas"));
    observer.observe($("spectrumCanvas"));
  } else window.addEventListener("resize", drawPlots);

  renderTexts();
  renderControls();
  drawPlots();
})();
