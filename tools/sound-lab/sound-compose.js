/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT
 * The Compose C1 user interface: one editable score and one instrument part.
 */
(function (root, factory) {
  const abc = typeof module === "object" && module.exports ? require("./sound-abc.js") : root.SoundLabABC;
  const scoreModel = typeof module === "object" && module.exports ? require("./sound-score.js") : root.SoundLabScore;
  const playerModel = typeof module === "object" && module.exports ?
    require("./sound-score-player.js") : root.SoundLabScorePlayer;
  const api = factory(abc, scoreModel, playerModel);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SoundLabCompose = api;
})(typeof window !== "undefined" ? window : null, function (abc, scoreModel, playerModel) {
  "use strict";

  const EXAMPLES = Object.freeze({
    first: "X:1\nT:First melody\nM:4/4\nL:1/4\nQ:1/4=96\nK:C\nC D E G | A2 G2 | E F G2 | C4 |]",
    rests: "X:2\nT:Listen to the rests\nM:4/4\nL:1/8\nQ:1/4=104\nK:C\nC2 z2 E2 G2 | A4 z G2 z | F2 E2 D2 C2 | C8 |]",
    waltz: "X:3\nT:Little waltz\nM:3/4\nL:1/4\nQ:1/4=108\nK:G\nG A B | d2 B | A G F | G3 |]",
    minor: "X:4\nT:Minor melody\nM:4/4\nL:1/4\nQ:1/4=88\nK:Am\nA B c d | e2 d2 | c B A G | A4 |]"
  });

  const UI = Object.freeze({
    en: {
      mode: "Compose", phase: "07 · Write a melody", title: "Make a melody",
      intro: "Write a short ABC score, choose one instrument and hear it follow your notes. No sound plays until you press Play.",
      example: "Example score", exampleFirst: "First melody", exampleRests: "Notes and rests",
      exampleWaltz: "Waltz in G", exampleMinor: "Minor tune",
      instrument: "Instrument", flute: "Flute", violin: "Violin", morin: "Morin khuur",
      guitar: "Guitar", piano: "Piano", chimes: "Chimes",
      tuning: "Tuning", equal: "Equal (12-TET)", pythagorean: "Pythagorean",
      just: "Just · C-centred", tuningHint: "The same written notes can sound different in another tuning. The just preset is centred on C; enharmonic spellings share a key in C1.",
      volume: "Volume", score: "ABC score", load: "Open .abc / .txt file",
      scoreHint: "C D E G = quarter notes when L:1/4. C2 lasts twice as long; z is a rest. Uppercase C is middle C; lowercase c is one octave higher.",
      play: "▶ Play", pause: "Ⅱ Pause", resume: "▶ Resume", stop: "■ Stop",
      staff: "Score and playhead", staffHint: "The highlighted note follows the modeled sound. A rest is shown as a small block; the note names remain visible below the staff.",
      ready: "Ready. Edit the melody or press Play.", starting: "Starting the instrument…",
      playing: "Playing the score.", paused: "Paused. Press Resume to continue.",
      stopped: "Stopped. Play starts from the beginning.", done: "The melody finished.",
      loadError: "Choose a small text score (.abc or .txt, up to 8 KB).",
      noAudio: "Sound could not start. Check the browser's audio settings.",
      parseError: "Score error", rangeError: "Note outside the selected instrument's range",
      bar: "Bar", rest: "Rest", notes: "notes", bars: "bars", seconds: "sec",
      empty: "No valid score yet", now: "Now", model: "Modeled instruments · one part · ABC subset",
      footer: "C1 plays one melody at a time. More instrument parts, chords and percussion rhythms will come in later passes; graphical note editing is optional."
    },
    mn: {
      mode: "Ая зохиох", phase: "07 · Ая зохиох", title: "Аялгуу зохиох",
      intro: "ABC тэмдэглэгээгээр богино ая бичиж, нэг хөгжмөөр тоглуулаарай. «Тоглуулах»-ыг дарахаас өмнө дуу гарахгүй.",
      example: "Жишээ ая", exampleFirst: "Энгийн аялгуу", exampleRests: "Нот ба завсарлага",
      exampleWaltz: "Соль мажор вальс", exampleMinor: "Минор аялгуу",
      instrument: "Хөгжмийн зэмсэг", flute: "Лимбэ", violin: "Хийл", morin: "Морин хуур",
      guitar: "Гитар", piano: "Төгөлдөр хуур", chimes: "Хоолойт хонх",
      tuning: "Хөг", equal: "Тэнцүү (12-TET)", pythagorean: "Пифагорын",
      just: "Цэвэр · До төвтэй", tuningHint: "Ижил нотыг өөр хөгөөр тоглуулахад өндөр нь бага зэрэг өөрчлөгдөнө. Цэвэр хувилбар нь До төвтэй; C1-д диез ба бемол ижил товчлуурт хамаарна.",
      volume: "Дууны хэмжээ", score: "ABC нотын бичиг", load: ".abc / .txt файл нээх",
      scoreHint: "L:1/4 үед C D E G нь дөрөвт нотууд; C2 нь хоёр дахин урт, z нь завсарлага. Том C нь До4, жижиг c нь До5.",
      play: "▶ Тоглуулах", pause: "Ⅱ Түр зогсоох", resume: "▶ Үргэлжлүүлэх", stop: "■ Зогсоох",
      staff: "Нотын мөр ба тоглуулах тэмдэг", staffHint: "Тоглож буй нот тодорно. Завсарлагыг жижиг дөрвөлжнөөр, нотын нэрийг доор нь харуулна.",
      ready: "Бэлэн. Аяыг өөрчлөх эсвэл тоглуулаарай.", starting: "Зэмсгийг бэлдэж байна…",
      playing: "Аялгуу тоглож байна.", paused: "Түр зогслоо. Үргэлжлүүлж болно.",
      stopped: "Зогслоо. Дахин тоглуулахад эхнээсээ эхэлнэ.", done: "Аялгуу дууслаа.",
      loadError: "8 КБ-аас бага хэмжээтэй .abc эсвэл .txt файл сонгоно уу.",
      noAudio: "Дуу эхэлсэнгүй. Хөтчийн аудио тохиргоог шалгана уу.",
      parseError: "Нотын бичгийн алдаа", rangeError: "Нотын өндөр сонгосон зэмсгийн хүрээнээс хэтэрлээ",
      bar: "Такт", rest: "Завсарлага", notes: "нот", bars: "такт", seconds: "сек",
      empty: "Зөв аялгуу хараахан байхгүй", now: "Одоо", model: "Загварчилсан зэмсгүүд · нэг хоолой · ABC-ийн үндсэн тэмдэглэгээ",
      footer: "C1-д нэг аялгуу тоглоно. Дараа нь олон хөгжмийн хоолой, аккорд, цохивор хэмнэл нэмж болно; дүрсээр нот засах хэсгийг хойшлуулж болно."
    }
  });

  function localError(error, lang) {
    const label = UI[lang].parseError;
    const prefix = error.line ? (lang === "mn" ? "Мөр " : "Line ") + error.line + ": " : "";
    if (lang === "en") return label + ": " + prefix + error.message;
    const msg = error.message;
    let translated;
    if (/^Unsupported symbol/.test(msg)) translated = "Дэмжигдээгүй тэмдэг байна: " + msg.match(/'[^']+'/)?.[0];
    else if (/^Bar \d+ has/.test(msg)) translated = "Такт дахь нотын урт хэмжээтэйгээ таарахгүй байна (" + msg + ")";
    else if (/^Empty bar/.test(msg)) translated = "Хоосон такт байна";
    else if (/^Include M:/.test(msg)) translated = "M: (хэмжээ), L: (нотны урт), Q: (хурд) гэсэн мөрүүдийг бичээрэй";
    else if (/^A key is required|^Add K:/.test(msg)) translated = "Нотын өмнө K:C зэрэг хөгийн мөр бичээрэй";
    else if (/^Q:/.test(msg)) translated = "Q:1/4=96 гэх мэт хурдаа тэмдэглээрэй";
    else if (/^L:/.test(msg)) translated = "L:1/4 эсвэл L:1/8 гэх мэт нотын уртыг бичээрэй";
    else if (/^M:/.test(msg)) translated = "M:4/4 эсвэл M:3/4 гэх мэт хэмжээг бичээрэй";
    else if (/^K:/.test(msg)) translated = "K:C, K:G, K:Am зэрэг одоогоор дэмжигдсэн хөг сонгоно уу";
    else if (/^The score must contain/.test(msg)) translated = "Ая 1–128 нотоос бүрдэж, 90 секундээс хэтрэхгүй байх ёстой";
    else translated = msg;
    return label + ": " + prefix + translated;
  }

  class Controller {
    constructor({ document, contextOwner, transientModel, sustainModel, temperamentModel }) {
      this.document = document;
      this.$ = id => document.getElementById(id);
      this.language = "mn";
      this.score = null;
      this.lastError = null;
      this.lastStatus = "ready";
      this.noteGroups = [];
      this.lastHighlighted = -2;
      this.parseTimer = null;
      this.player = new playerModel.Player({ contextOwner, transientModel, sustainModel,
        temperamentModel, onUpdate: info => this.onProgress(info) });
      this.$("composeText").value = EXAMPLES.first;
      this.$("composeInstrument").value = "flute";
      this.$("composeTuning").value = "equal";
      this.$("composeVolume").value = "38";
      this.$("composeExample").value = "first";
      this.$("composeText").addEventListener("input", () => {
        this.player.stop();
        if (this.parseTimer !== null) clearTimeout(this.parseTimer);
        this.parseTimer = setTimeout(() => { this.parseTimer = null; this.parseScore(); }, 180);
      });
      this.$("composeExample").addEventListener("change", () => {
        this.$("composeText").value = EXAMPLES[this.$("composeExample").value] || EXAMPLES.first;
        this.parseScore();
      });
      this.$("composeInstrument").addEventListener("change", () => this.parseScore());
      this.$("composeTuning").addEventListener("change", () => this.parseScore());
      this.$("composeVolume").addEventListener("input", () => this.parseScore());
      this.$("composePlayPause").addEventListener("click", () => this.togglePlay());
      this.$("composeStop").addEventListener("click", () => this.stop());
      this.$("composeLoad").addEventListener("change", event => this.loadFile(event.target.files?.[0]));
      this.parseScore();
      this.renderLanguage("mn");
    }

    t(key) { return UI[this.language][key]; }
    renderLanguage(language) {
      if (!UI[language]) return;
      this.language = language;
      if (typeof this.document.querySelectorAll === "function") {
        this.document.querySelectorAll("[data-compose-i18n]").forEach(node => {
          node.textContent = this.t(node.getAttribute("data-compose-i18n"));
        });
      }
      this.$("composePlayPause").textContent = this.t(this.player.status === "playing" ? "pause" :
        this.player.status === "paused" ? "resume" : "play");
      this.$("composeVolumeValue").textContent = this.$("composeVolume").value + "%";
      this.$("composeStatus").textContent = this.lastError ?
        this.errorText(this.lastError) : this.t(this.lastStatus) || this.t("ready");
      this.$("composeStatus").classList.toggle("error", Boolean(this.lastError));
      this.$("composeScoreSvg").setAttribute("aria-label", this.t("staff"));
      this.renderMeta();
      this.lastHighlighted = -2;
      this.highlight(this.player.currentBeat);
    }

    errorText(error) {
      return error instanceof abc.ABCError ? localError(error, this.language) :
        this.t("rangeError") + ": " + error.message;
    }

    parseScore() {
      if (this.parseTimer !== null) { clearTimeout(this.parseTimer); this.parseTimer = null; }
      this.player.stop();
      try {
        const score = abc.parse(this.$("composeText").value);
        this.player.configure({ score, instrument: this.$("composeInstrument").value,
          tuning: this.$("composeTuning").value, volume: Number(this.$("composeVolume").value) });
        this.score = score;
        this.lastError = null;
        this.lastStatus = "ready";
        this.$("composeStatus").textContent = this.t("ready");
        this.$("composeStatus").classList.toggle("error", false);
        this.$("composePlayPause").disabled = false;
        this.renderStaff();
      } catch (error) {
        this.score = null;
        this.lastError = error;
        this.lastStatus = "ready";
        this.$("composeStatus").textContent = this.errorText(error);
        this.$("composeStatus").classList.toggle("error", true);
        this.$("composePlayPause").disabled = true;
        this.noteGroups = [];
        if (typeof this.$("composeScoreSvg").replaceChildren === "function") {
          this.$("composeScoreSvg").replaceChildren();
        }
        this.$("composeNow").textContent = this.t("empty");
      }
      this.renderMeta();
      this.$("composeVolumeValue").textContent = this.$("composeVolume").value + "%";
      this.$("composePlayPause").textContent = this.t("play");
    }

    renderMeta() {
      this.$("composeMeta").textContent = this.score ?
        this.score.title + " · " + this.score.bars.length + " " + this.t("bars") +
        " · " + this.score.parts[0].events.filter(e => e.type === "note").length + " " +
        this.t("notes") + " · " + (this.score.totalBeats * scoreModel.secondsPerBeat(this.score)).toFixed(1) +
        " " + this.t("seconds") : this.t("empty");
    }

    async togglePlay() {
      this.parsePending();
      if (!this.score) return;
      if (this.player.status === "playing") { this.player.pause(); return; }
      try { await this.player.play(); }
      catch (error) {
        this.$("composeStatus").textContent = this.t("noAudio") + " (" + error.message + ")";
        this.$("composeStatus").classList.toggle("error", true);
      }
    }

    parsePending() { if (this.parseTimer !== null) this.parseScore(); }
    stop() { this.player.stop(); }
    hasSession() { return this.player.status !== "stopped"; }
    isPlaying() { return this.player.status === "playing" || this.player.status === "starting"; }

    async loadFile(file) {
      if (!file) return;
      this.player.stop();
      if (!/\.(abc|txt)$/i.test(file.name) || file.size > 8192 || file.size === 0) {
        this.$("composeStatus").textContent = this.t("loadError");
        this.$("composeStatus").classList.toggle("error", true);
        return;
      }
      try {
        const content = await file.text();
        if (content.length > 8192) throw new RangeError("Oversized score");
        this.$("composeText").value = content;
        this.parseScore();
      } catch (_) {
        this.$("composeStatus").textContent = this.t("loadError");
        this.$("composeStatus").classList.toggle("error", true);
      } finally { this.$("composeLoad").value = ""; }
    }

    onProgress({ status, beat }) {
      this.lastStatus = status === "starting" ? "starting" : status === "playing" ? "playing" :
        status === "paused" ? "paused" : "stopped";
      if (this.$("composeStatus")) {
        this.$("composeStatus").textContent = this.t(this.lastStatus);
        this.$("composeStatus").classList.toggle("error", false);
        this.$("composePlayPause").textContent = this.t(status === "playing" ? "pause" :
          status === "paused" ? "resume" : "play");
      }
      this.highlight(beat);
    }

    renderStaff() {
      const svg = this.$("composeScoreSvg");
      if (!this.score || typeof svg.appendChild !== "function" ||
          typeof this.document.createElementNS !== "function") return;
      svg.replaceChildren();
      this.noteGroups = [];
      this.lastHighlighted = -2;
      const ns = "http://www.w3.org/2000/svg", rowHeight = 142;
      const bars = this.score.bars;
      const rows = Math.ceil(bars.length / 4);
      svg.setAttribute("viewBox", "0 0 864 " + rows * rowHeight);
      svg.setAttribute("width", "864");
      svg.setAttribute("height", String(rows * rowHeight));
      const make = (tag, attrs, parent = svg, label = null) => {
        const node = this.document.createElementNS(ns, tag);
        for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
        if (label !== null) node.textContent = label;
        parent.appendChild(node);
        return node;
      };
      bars.forEach((bar, index) => {
        const row = Math.floor(index / 4), col = index % 4;
        const left = 16 + col * 210, y = row * rowHeight;
        make("text", { x: left + 6, y: y + 23, class: "compose-bar-number" }, svg, String(bar.number));
        for (let line = 0; line < 5; line++) {
          make("line", { x1: left, x2: left + 210, y1: y + 43 + line * 10,
            y2: y + 43 + line * 10, class: "compose-staff-line" });
        }
        make("line", { x1: left + 210, x2: left + 210, y1: y + 43, y2: y + 83,
          class: "compose-bar-line" });
      });
      this.score.parts[0].events.forEach((event, index) => {
        const bar = bars[event.bar - 1];
        const row = Math.floor((event.bar - 1) / 4), col = (event.bar - 1) % 4;
        const lineY = row * rowHeight;
        const x = 22 + col * 210 + (event.startBeat - bar.startBeat) /
          Math.max(bar.durationBeats, this.score.meter.quarterBeats) * 181;
        const group = make("g", { class: "compose-note", "data-note-index": index });
        let y = lineY + 65;
        if (event.type === "note") {
          const letters = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
          const diatonic = (event.pitch.octave - 4) * 7 + letters[event.pitch.letter];
          y = lineY + 83 - (diatonic - 2) * 5;
          for (let ledger = lineY + 93; ledger <= y; ledger += 10) {
            make("line", { x1: x - 7, x2: x + 16, y1: ledger, y2: ledger,
              class: "compose-ledger-line" }, group);
          }
          for (let ledger = lineY + 33; ledger >= y; ledger -= 10) {
            make("line", { x1: x - 7, x2: x + 16, y1: ledger, y2: ledger,
              class: "compose-ledger-line" }, group);
          }
          make("ellipse", { cx: x + 4, cy: y, rx: 6.2, ry: 4.6,
            transform: `rotate(-22 ${x + 4} ${y})` }, group);
          make("line", { x1: x + 10, x2: x + 10, y1: y, y2: y - 27,
            class: "compose-stem" }, group);
          if (event.pitch.accidental !== 0) {
            const accident = event.pitch.accidental < 0 ? "♭" : "♯";
            make("text", { x: x - 17, y: y + 4, class: "compose-accidental" }, group, accident);
          }
        } else {
          make("rect", { x, y: y - 5, width: 12, height: 6, rx: 1.2,
            class: "compose-rest" }, group);
        }
        make("text", { x: x + 4, y: lineY + 111, class: "compose-note-name",
          "text-anchor": "middle" }, group,
        event.type === "rest" ? "z" : scoreModel.pitchName(event.pitch));
        this.noteGroups.push({ node: group, event, x, row });
      });
      this.highlight(0);
    }

    highlight(beat) {
      if (!this.score) return;
      const events = this.score.parts[0].events;
      let index = events.findIndex(event => event.startBeat <= beat + 1e-6 &&
        beat < event.startBeat + event.durationBeats - 1e-6);
      if (beat >= this.score.totalBeats - 1e-6) index = -1;
      if (index === this.lastHighlighted) return;
      this.lastHighlighted = index;
      this.noteGroups.forEach(({ node }, i) => node.classList.toggle("active", i === index));
      const event = events[index];
      this.$("composeNow").textContent = event ?
        this.t("bar") + " " + event.bar + " · " +
        (event.type === "rest" ? this.t("rest") : scoreModel.pitchName(event.pitch)) +
        " · " + (beat * scoreModel.secondsPerBeat(this.score)).toFixed(1) + " " +
        this.t("seconds") : this.t("ready");
      if (event && this.noteGroups[index]) {
        const view = this.$("composeScoreScroll");
        if (typeof view.scrollTo === "function" && typeof view.clientWidth === "number") {
          view.scrollTo({ left: Math.max(0, this.noteGroups[index].x - view.clientWidth * .5),
            behavior: "auto" });
        }
      }
    }
  }

  return Object.freeze({ EXAMPLES, UI, Controller, localError });
});
