/* Sound Lab: pure tones and short, modeled strike/pluck sounds. */
(() => {
  "use strict";
  const model = window.SoundLabModel;
  const transientModel = window.SoundLabTransientModel;
  const spectrumModel = window.SoundLabSpectrum;
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
      modePure: "Pure tones", modeStrike: "Strike & Pluck", modeSwitchAria: "Sound categories",
      strikeEyebrow: "EXPLORE SOUNDS · STRIKES & PLUCKS",
      strikeTitle: "What happens after a sound begins?",
      strikeIntro: "Pluck a string or strike a drum. Watch the vibration begin and fade away.",
      strikePhase: "02 · Modeled sounds", strikeChoose: "Choose a modeled sound",
      pluck: "Plucked string", kick: "Bass drum", strikeGroupAria: "Transient sound model",
      strikeCaption: "Tap to sound; tap again to repeat",
      strikePluckButton: "Pluck", strikeKickButton: "Strike",
      strikePitch: "String frequency", strikePitchSliderAria: "String pitch slider",
      strikePitchInputAria: "String frequency in hertz",
      strikeStrength: "Strength", strikeDecay: "Decay time",
      strikeDrumSize: "Drum size", strikeLarge: "Large", strikeMedium: "Medium", strikeSmall: "Small",
      strikeDrumHint: "Stylized bass-drum presets: larger sounds lower; these are not physical membrane simulations.",
      strikeWaveTitle: "Waveform · zoom and explore",
      strikeWaveSubtitle: "See the full decay; zoom in to reveal individual vibrations.",
      strikeZoomOutAria: "Zoom out", strikeZoomInAria: "Zoom in",
      strikePanLeftAria: "Move earlier", strikePanRightAria: "Move later",
      strikeFit: "Fit", strikeCustom: "Custom", strikeViewPresetLabel: "Visible time span",
      strikePlotToolsAria: "Waveform zoom and navigation",
      strikeTime: "Explore the sound at time", strikeTimeAria: "Time selected for the frequency spectrum",
      strikeTimeHint: "After Pluck or Strike, the spectrum follows the sound. Drag this slider to inspect any moment.",
      strikeLocalSpectrumTitle: "Frequency spectrum",
      strikeLocalSpectrumSubtitle: "Fourier analysis of a 128 ms window around the selected time",
      strikeSpectrumHere: "At selected time", strikeSpectrumWhole: "Whole sound",
      strikeSpectrumModesAria: "Spectrum time range",
      strikeSpectrumHint: "Higher string harmonics disappear earlier; a drum's pitch falls.",
      strikeSpectrumWholeHint: "Average frequency content across the whole modeled hit.",
      strikeWaveAria: "Modeled waveform with a movable time cursor",
      strikeSpectrumAria: "Short-time Fourier magnitude spectrum of the modeled sound",
      strikeSafety: "Each sound fades by itself. Begin quietly, especially with headphones.",
      strikeEnvelopeTitle: "How does the sound fade?",
      strikeEnvelopeSubtitle: "Same three-second time scale for every strike",
      strikeZoomTitle: "Waveform: first 20 ms",
      strikeZoomSubtitle: "A magnified view of the fast vibration",
      strikeEnvelopeAria: "Modeled decay envelope over time",
      strikeZoomAria: "Modeled waveform of the first 20 milliseconds",
      strikeChallenge: "Change the decay time. What happens to the sound and its envelope?",
      strikeLearnMore: "Why do these sounds fade away?",
      strikeLessonOne: "A plucked string vibrates at several frequencies. Its higher harmonics fade faster than its fundamental.",
      strikeLessonTwo: "The bass drum begins at a higher frequency, rapidly drops in pitch, and gradually fades.",
      strikeLessonThree: "These are simple mathematical models, not recorded instruments or microphone measurements.",
      strikeReady: "Ready. Sound starts only when you tap the pad.",
      strikeStarting: "Preparing the sound…", strikeDone: "Sound triggered. Tap again to repeat.",
      strikeStopped: "Stopped. Tap the pad to try again.",
      strikeHidden: "Sound stopped when you left the page.",
      strikeUnsupported: "This browser does not support synthesized sound playback.",
      strikeBlocked: "Sound could not start. Check browser audio permission and try again.",
      strikeInvalid: "Enter a string frequency between 110 and 880 Hz.",
      strikeDesc: {
        pluck: "A string begins vibrating after a pluck, then gradually becomes quieter.",
        kick: "A drum hit drops in pitch while its vibration fades."
      },
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
      modePure: "Цэвэр авиа", modeStrike: "Цохих ба татах", modeSwitchAria: "Дууны бүлэг",
      strikeEyebrow: "ДУУ АВИА СУДЛАХ · ЦОХИХ БА ТАТАХ",
      strikeTitle: "Дуу гарсны дараа юу болдог вэ?",
      strikeIntro: "Чавхдас татаж, бөмбөр цохиод хэлбэлзэл хэрхэн эхэлж, намддагийг ажиглаарай.",
      strikePhase: "02 · Загварчилсан дуу", strikeChoose: "Дууны загвар сонгох",
      pluck: "Татсан чавхдас", kick: "Басс бөмбөр", strikeGroupAria: "Цохилтын дууны загвар",
      strikeCaption: "Дарж сонсоод, дахин дарж давтаарай",
      strikePluckButton: "Татах", strikeKickButton: "Цохих",
      strikePitch: "Чавхдасны давтамж", strikePitchSliderAria: "Чавхдасны давтамжийн гулсуур",
      strikePitchInputAria: "Чавхдасны давтамжийг герцээр оруулах",
      strikeStrength: "Цохилтын хүч", strikeDecay: "Намдах хугацаа",
      strikeDrumSize: "Бөмбөрийн хэмжээ", strikeLarge: "Том", strikeMedium: "Дунд", strikeSmall: "Жижиг",
      strikeDrumHint: "Том бөмбөр нам, жижиг нь өндөр дуугарна. Энэ нь бодит мембраны бүрэн загвар биш.",
      strikeWaveTitle: "Дууны долгион · томруулж үзэх",
      strikeWaveSubtitle: "Бүхэлд нь намдлыг, томруулбал нэг нэг хэлбэлзлийг харна.",
      strikeZoomOutAria: "Томруулалтыг багасгах", strikeZoomInAria: "Томруулах",
      strikePanLeftAria: "Өмнөх хэсэг", strikePanRightAria: "Дараах хэсэг",
      strikeFit: "Бүгд", strikeCustom: "Өөр", strikeViewPresetLabel: "Хугацааны хуваарь",
      strikePlotToolsAria: "Долгионы графикийн удирдлага",
      strikeTime: "Дууны хугацааг шинжлэх", strikeTimeAria: "Спектрт шинжлэх хугацаа",
      strikeTimeHint: "Цохиход спектр дууг дагана. Дараа нь гулсуураар хугацааг сонгоорой.",
      strikeLocalSpectrumTitle: "Давтамжийн спектр",
      strikeLocalSpectrumSubtitle: "Сонгосон хугацааны орчмын 128 мс долгионы Фурье шинжилгээ",
      strikeSpectrumHere: "Энэ мөчид", strikeSpectrumWhole: "Бүх дуу",
      strikeSpectrumModesAria: "Спектрийн хугацааны сонголт",
      strikeSpectrumHint: "Чавхдасны дээд гармоник хурдан намдаж, бөмбөрийн давтамж буурна.",
      strikeSpectrumWholeHint: "Загварчилсан цохилтын турших хугацааны дундаж спектр.",
      strikeWaveAria: "Хугацаа сонгох тэмдэглэгээтэй загвар долгион",
      strikeSpectrumAria: "Загварчилсан дууны хугацааны хэсгийн Фурье спектр",
      strikeSafety: "Дуу өөрөө намдана. Ялангуяа чихэвчтэй бол эхэндээ аяархан сонсоорой.",
      strikeEnvelopeTitle: "Дууны хүч хэрхэн намдах вэ?",
      strikeEnvelopeSubtitle: "Бүх цохилтыг нэг ижил 3 секундийн хуваарьт харуулав",
      strikeZoomTitle: "Эхний 20 мс-ийн долгион",
      strikeZoomSubtitle: "Түргэн хэлбэлзлийг томруулж харах",
      strikeEnvelopeAria: "Намдах далайцын математик загвар",
      strikeZoomAria: "Эхний 20 мс-ийн долгионы загвар",
      strikeChallenge: "Намдах хугацааг өөрчил. Дуу болон график хэрхэн өөрчлөгдөж байна вэ?",
      strikeLearnMore: "Яагаад эдгээр дуу намддаг вэ?",
      strikeLessonOne: "Чавхдас олон давтамжаар хэлбэлзэнэ. Өндөр гармоникууд нь үндсэн давтамжаас хурдан намдана.",
      strikeLessonTwo: "Басс бөмбөрийн цохилтын давтамж эхлээд хурдан буурч, далайц нь аажмаар намдана.",
      strikeLessonThree: "Эдгээр нь бичлэг биш, энгийн математик загвар. График нь микрофоны хэмжилт биш.",
      strikeReady: "Бэлэн. Дарахад л дуу гарна.",
      strikeStarting: "Дууг бэлтгэж байна…", strikeDone: "Дуугарлаа. Дахин дарж болно.",
      strikeStopped: "Зогслоо. Дахин дарж сонсоорой.",
      strikeHidden: "Хуудсаас гарахад дуу зогслоо.",
      strikeUnsupported: "Энэ хөтөч дуу үүсгэж тоглуулах боломжгүй байна.",
      strikeBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгаад дахин оролдоно уу.",
      strikeInvalid: "Чавхдасны давтамжийг 110–880 Гц-ийн хооронд оруулна уу.",
      strikeDesc: {
        pluck: "Татаж тавьсан чавхдас хэлбэлзээд аажмаар намдана.",
        kick: "Бөмбөрийн цохилтын давтамж буурч, хэлбэлзэл нь намдана."
      },
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
    mode: "pure",
    waveform: "sine",
    frequency: 440,
    volume: 40,
    snap: false,
    fixedTime: true,
    playing: false,
    status: "ready",
    error: false,
    strikeKind: "pluck",
    strikePitch: 220,
    strikeSnap: false,
    strikeDrumSize: "medium",
    strikeStrength: 55,
    strikeDecay: 0.65,
    strikeStatus: "strikeReady",
    strikeError: false,
    strikeViewStart: 0,
    strikeViewSpan: 3,
    strikeCursor: 0,
    strikeSpectrumView: "local",
    strikeFollowing: false
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

    async readyContext() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("unsupported");
      if (!this.context) this.context = new AudioContextClass();
      await this.context.resume();
      if (this.context.state !== "running") throw new Error("blocked");
      return this.context;
    }

    async start() {
      const ticket = ++this.generation;
      await this.readyContext();
      if (ticket !== this.generation) return false;
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

  class TransientEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.generation = 0;
    }

    stopVoice(voice, immediate) {
      if (voice.stopping) return;
      voice.stopping = true;
      const now = this.contextOwner.context.currentTime;
      const gain = voice.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      try { voice.source.stop(now + (immediate ? 0.002 : 0.07)); }
      catch (_) { /* This one-shot voice may already have ended. */ }
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.stopVoice(voice, immediate);
    }

    async trigger() {
      const ticket = this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "strike") return false;
      const samples = transientModel.makeSamples(
        state.strikeKind, state.strikePitch, state.strikeDecay, context.sampleRate, state.strikeDrumSize);
      const buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.getChannelData(0).set(samples);
      const source = context.createBufferSource();
      const gain = context.createGain();
      const now = context.currentTime;
      source.buffer = buffer;
      gain.gain.setValueAtTime(0.12 * state.strikeStrength / 100, now);
      source.connect(gain);
      gain.connect(context.destination);

      // A drum roll can be tapped repeatedly, but cannot spawn unbounded voices.
      while (this.voices.size >= 4) {
        const oldest = this.voices.values().next().value;
        this.stopVoice(oldest, true);
        this.voices.delete(oldest);
      }
      const voice = { source, gain, stopping: false };
      this.voices.add(voice);
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
      };
      source.start(now);
      return { context, startedAt: now, duration: samples.length / context.sampleRate };
    }
  }

  const audio = new ToneEngine();
  const transientAudio = new TransientEngine(audio);
  let followFrame = null;
  let followInfo = null;
  let overallSpectrumCache = null;
  let lastAnimatedSpectrumTime = -1;
  let lastAnimatedWaveTime = -1;

  function strikeRecipe() {
    return { kind: state.strikeKind, pitchHz: state.strikePitch,
      decaySec: state.strikeDecay, kickSize: state.strikeDrumSize };
  }

  function stopStrikeFollow() {
    if (followFrame !== null) window.cancelAnimationFrame(followFrame);
    followFrame = null;
    followInfo = null;
    state.strikeFollowing = false;
  }

  function stopStrikeForEdit() {
    transientAudio.stop(false);
    stopStrikeFollow();
    overallSpectrumCache = null;
    setStrikeStatus("strikeReady");
  }

  function keepStrikeCursorVisible() {
    if (state.strikeViewSpan >= 3) return;
    const right = state.strikeViewStart + state.strikeViewSpan;
    if (state.strikeCursor < state.strikeViewStart || state.strikeCursor > right) {
      state.strikeViewStart = Math.max(0, Math.min(3 - state.strikeViewSpan,
        state.strikeCursor - state.strikeViewSpan * 0.5));
    }
  }

  function strikeTimeText(time) {
    return time < 0.1 ? frequencyText(time * 1000) + " ms" : frequencyText(time) + " s";
  }

  function renderStrikeTime() {
    $("strikeTimeSlider").value = String(Math.round(state.strikeCursor * 1000));
    $("strikeTimeValue").textContent = "t = " + state.strikeCursor.toFixed(2) + " s";
    $("strikeSpectrumBadge").textContent = state.strikeSpectrumView === "local" ?
      "t = " + state.strikeCursor.toFixed(2) + " s" : text("strikeSpectrumWhole");
    $("strikeSpectrumHint").textContent = text(state.strikeSpectrumView === "local" ?
      "strikeSpectrumHint" : "strikeSpectrumWholeHint");
  }

  function setStrikeView(span, center = state.strikeCursor) {
    state.strikeViewSpan = Math.max(0.01, Math.min(3, span));
    state.strikeViewStart = Math.max(0, Math.min(3 - state.strikeViewSpan,
      center - state.strikeViewSpan / 2));
    drawStrikeWave();
  }

  function panStrikeView(direction) {
    state.strikeViewStart = Math.max(0, Math.min(3 - state.strikeViewSpan,
      state.strikeViewStart + direction * state.strikeViewSpan / 2));
    drawStrikeWave();
  }

  function startStrikeFollow(info) {
    stopStrikeFollow();
    followInfo = info;
    state.strikeFollowing = true;
    state.strikeCursor = 0;
    lastAnimatedSpectrumTime = -1;
    lastAnimatedWaveTime = -1;
    renderStrikeTime();
    drawStrikeWave();
    drawStrikeSpectrum();
    const advance = () => {
      if (!state.strikeFollowing || !followInfo || state.mode !== "strike") return;
      const elapsed = Math.max(0, info.context.currentTime - info.startedAt);
      state.strikeCursor = Math.min(3, info.duration, elapsed);
      if (state.strikeViewSpan < 3 && state.strikeCursor >
          state.strikeViewStart + state.strikeViewSpan * 0.82) {
        state.strikeViewStart = Math.max(0, Math.min(3 - state.strikeViewSpan,
          state.strikeCursor - state.strikeViewSpan * 0.65));
      }
      renderStrikeTime();
      if (elapsed - lastAnimatedWaveTime >= 0.04) {
        drawStrikeWave();
        lastAnimatedWaveTime = elapsed;
      }
      if (elapsed - lastAnimatedSpectrumTime >= 0.045) {
        drawStrikeSpectrum();
        lastAnimatedSpectrumTime = elapsed;
      }
      if (elapsed >= info.duration) {
        stopStrikeFollow();
        drawStrikeWave();
        drawStrikeSpectrum();
      } else followFrame = window.requestAnimationFrame(advance);
    };
    followFrame = window.requestAnimationFrame(advance);
  }

  function setStatus(status, error = false) {
    state.status = status;
    state.error = error;
    $("audioStatus").textContent = text(status);
    $("audioStatus").classList.toggle("error", error);
  }

  function setStrikeStatus(status, error = false) {
    state.strikeStatus = status;
    state.strikeError = error;
    $("strikeStatus").textContent = text(status);
    $("strikeStatus").classList.toggle("error", error);
  }

  function renderMode() {
    const isStrike = state.mode === "strike";
    $("pureWorkspace").hidden = isStrike;
    $("pureChallenge").hidden = isStrike;
    $("pureExplanation").hidden = isStrike;
    $("strikeWorkspace").hidden = !isStrike;
    $("strikeChallenge").hidden = !isStrike;
    $("strikeExplanation").hidden = !isStrike;
    for (const [id, mode] of [["modePure", "pure"], ["modeStrike", "strike"]]) {
      const selected = state.mode === mode;
      $(id).classList.toggle("active", selected);
      $(id).setAttribute("aria-pressed", String(selected));
    }
    for (const [id, key, alternate] of [
      ["pageEyebrow", "eyebrow", "strikeEyebrow"],
      ["pageTitle", "title", "strikeTitle"],
      ["pageIntro", "intro", "strikeIntro"],
      ["pagePhase", "phase", "strikePhase"]
    ]) $(id).textContent = text(isStrike ? alternate : key);
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
    $("modeSwitch").setAttribute("aria-label", text("modeSwitchAria"));
    $("strikeChoices").setAttribute("aria-label", text("strikeGroupAria"));
    $("strikeFrequencySlider").setAttribute("aria-label", text("strikePitchSliderAria"));
    $("strikeFrequencyInput").setAttribute("aria-label", text("strikePitchInputAria"));
    $("strikeWaveCanvas").setAttribute("aria-label", text("strikeWaveAria"));
    $("strikeSpectrumCanvas").setAttribute("aria-label", text("strikeSpectrumAria"));
    $("strikeTimeSlider").setAttribute("aria-label", text("strikeTimeAria"));
    $("strikeViewPreset").setAttribute("aria-label", text("strikeViewPresetLabel"));
    $("strikePlotTools").setAttribute("aria-label", text("strikePlotToolsAria"));
    $("strikeDrumSizes").setAttribute("aria-label", text("strikeDrumSize"));
    $("strikeSpectrumChoices").setAttribute("aria-label", text("strikeSpectrumModesAria"));
    document.querySelector(".note-presets").setAttribute("aria-label", text("presetsAria"));
    document.querySelector(".lang-group").setAttribute("aria-label", text("langGroupAria"));
    setStatus(state.status, state.error);
    setStrikeStatus(state.strikeStatus, state.strikeError);
    renderMode();
    renderStrikeControls();
    renderStrikeTime();
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

  function renderStrikeControls() {
    $("strikeFrequencySlider").value = String(Math.round(transientModel.hzToSlider(state.strikePitch)));
    $("strikeFrequencyInput").value = String(Number(state.strikePitch.toFixed(2)));
    const note = model.nearestNote(state.strikePitch);
    const differenceCents = 1200 * Math.log2(state.strikePitch / note.frequency);
    const approx = !state.strikeSnap && Math.abs(differenceCents) >= 0.5 ? "≈ " : "";
    $("strikeNote").textContent = approx + note.english + " · " + note.mongolian;
    $("strikeSnap").checked = state.strikeSnap;
    $("strikePitchGroup").hidden = state.strikeKind !== "pluck";
    $("strikeDrumSizeGroup").hidden = state.strikeKind !== "kick";
    $("strikeDrumFrequencies").textContent =
      Math.round(transientModel.kickFrequency(0, state.strikeDrumSize)) + " → " +
      Math.round(transientModel.kickFrequency(3, state.strikeDrumSize)) + " Hz";
    $("strikeStrength").value = String(state.strikeStrength);
    $("strikeStrengthValue").textContent = state.strikeStrength + "%";
    $("strikeDecay").value = String(state.strikeDecay);
    $("strikeDecayValue").textContent = frequencyText(state.strikeDecay) + " s";
    $("strikeDescription").textContent = text("strikeDesc")[state.strikeKind];
    $("strikeButtonLabel").textContent = text(state.strikeKind === "pluck" ? "strikePluckButton" : "strikeKickButton");
    document.querySelectorAll("[data-strike]").forEach(button => {
      const selected = button.dataset.strike === state.strikeKind;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-drum-size]").forEach(button => {
      const selected = button.dataset.drumSize === state.strikeDrumSize;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
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

  function stopAllAudio(immediate = false, message = "stopped") {
    transientAudio.stop(immediate);
    stopStrikeFollow();
    stopSound(immediate, message);
    setStrikeStatus(message === "hidden" ? "strikeHidden" : "strikeStopped");
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

  function selectMode(mode) {
    if (mode === state.mode || !["pure", "strike"].includes(mode)) return;
    stopAllAudio(false);
    state.mode = mode;
    renderTexts();
    drawPlots();
  }

  function selectStrikeKind(kind) {
    if (!transientModel.KINDS.includes(kind) || kind === state.strikeKind) return;
    stopStrikeForEdit();
    state.strikeKind = kind;
    state.strikeDecay = kind === "pluck" ? 0.65 : 0.30;
    state.strikeCursor = 0;
    state.strikeViewStart = 0;
    state.strikeViewSpan = 3;
    state.strikeSpectrumView = "local";
    setStrikeStatus("strikeReady");
    renderStrikeControls();
    drawPlots();
  }

  function setStrikePitch(value) {
    const hz = Number(value);
    if (!Number.isFinite(hz) || hz < transientModel.MIN_PITCH_HZ || hz > transientModel.MAX_PITCH_HZ) {
      setStrikeStatus("strikeInvalid", true);
      renderStrikeControls();
      return;
    }
    stopStrikeForEdit();
    state.strikePitch = state.strikeSnap ? model.snapFrequency(hz) : hz;
    if (state.strikeStatus === "strikeInvalid") setStrikeStatus("strikeReady");
    renderStrikeControls();
    drawPlots();
  }

  async function triggerStrike() {
    setStrikeStatus("strikeStarting");
    try {
      const info = await transientAudio.trigger();
      if (info) {
        setStrikeStatus("strikeDone");
        startStrikeFollow(info);
      }
    } catch (error) {
      transientAudio.stop(true);
      stopStrikeFollow();
      setStrikeStatus(error.message === "unsupported" ? "strikeUnsupported" : "strikeBlocked", true);
    }
  }

  function resetStrike() {
    stopStrikeForEdit();
    state.strikeKind = "pluck";
    state.strikePitch = 220;
    state.strikeSnap = false;
    state.strikeDrumSize = "medium";
    state.strikeStrength = 55;
    state.strikeDecay = 0.65;
    state.strikeCursor = 0;
    state.strikeViewStart = 0;
    state.strikeViewSpan = 3;
    state.strikeSpectrumView = "local";
    setStrikeStatus("strikeReady");
    renderStrikeControls();
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

  function drawStrikeWave() {
    const { ctx, width, height } = plotContext($("strikeWaveCanvas"));
    const left = 44, right = width - 15, top = 26, bottom = height - 30;
    const span = state.strikeViewSpan, start = state.strikeViewStart;
    const plotWidth = right - left, middle = (top + bottom) / 2;
    const amplitude = (bottom - top) * 0.45 * Math.sqrt(state.strikeStrength / 100);
    drawFrame(ctx, width, height, left, right, top, bottom);
    $("strikeDurationBadge").textContent = "τ = " + frequencyText(state.strikeDecay) + " s";
    $("strikeWindowLabel").textContent = strikeTimeText(start) + " – " + strikeTimeText(start + span);
    $("strikeViewPreset").value = [3, 1, 0.2, 0.02].some(value => Math.abs(span - value) < 1e-7) ? String(span) : "custom";
    $("strikeViewZoomIn").disabled = span <= 0.0101;
    $("strikeViewZoomOut").disabled = span >= 2.999;
    $("strikeViewLeft").disabled = start <= 0.000001;
    $("strikeViewRight").disabled = start + span >= 2.999999;

    // The shaded Fourier window is fixed at 128 ms, independently of waveform zoom.
    const windowHalf = spectrumModel.WINDOW_SECONDS / 2;
    const from = Math.max(start, state.strikeCursor - windowHalf);
    const to = Math.min(start + span, state.strikeCursor + windowHalf);
    if (to > from) {
      ctx.fillStyle = "rgba(59, 129, 206, .09)";
      ctx.fillRect(left + (from - start) / span * plotWidth, top,
        (to - from) / span * plotWidth, bottom - top);
    }

    const sampleAt = time => transientModel.plottedSampleAt(state.strikeKind,
      time, state.strikePitch, state.strikeDecay, state.strikeDrumSize);
    ctx.strokeStyle = "#1a9b91";
    ctx.lineJoin = "round";
    if (span <= 0.12) {
      // At fine scales, every oscillation is drawn directly, with oversampling.
      const topFrequency = state.strikeKind === "pluck" ? state.strikePitch * 8 :
        transientModel.kickFrequency(0, state.strikeDrumSize);
      const points = Math.min(16000, Math.max(700, Math.round(plotWidth * 2),
        Math.ceil(span * topFrequency * 10)));
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const fraction = i / points;
        const x = left + fraction * plotWidth;
        const y = middle - amplitude * sampleAt(start + fraction * span);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      // Vertical min/max traces preserve oscillation envelopes at coarse scale.
      // Sparse point-to-point sampling would falsely show slow aliasing here.
      ctx.lineWidth = 1.45;
      const columns = Math.max(1, Math.floor(plotWidth));
      for (let i = 0; i < columns; i++) {
        let min = 1, max = -1;
        for (let j = 0; j <= 16; j++) {
          const sample = sampleAt(start + span * (i + j / 16) / columns);
          min = Math.min(min, sample);
          max = Math.max(max, sample);
        }
        const x = left + i;
        ctx.beginPath();
        ctx.moveTo(x, middle - amplitude * min);
        ctx.lineTo(x, middle - amplitude * max);
        ctx.stroke();
      }
    }
    if (state.strikeCursor >= start && state.strikeCursor <= start + span) {
      const x = left + (state.strikeCursor - start) / span * plotWidth;
      ctx.strokeStyle = "#d18c35";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    ctx.fillStyle = "#7489a1";
    ctx.textAlign = "left";
    ctx.fillText(text("amplitude"), 9, 13);
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const x = left + plotWidth * i / 4;
      ctx.fillText(strikeTimeText(start + span * i / 4), x, height - 12);
    }
  }

  function drawStrikeSpectrum() {
    const { ctx, width, height } = plotContext($("strikeSpectrumCanvas"));
    const left = 44, right = width - 16, top = 16, bottom = height - 30;
    const w = right - left, h = bottom - top;
    let spectrum;
    if (state.strikeSpectrumView === "overall") {
      if (!overallSpectrumCache) overallSpectrumCache = spectrumModel.spectrumOverall(transientModel, strikeRecipe());
      spectrum = overallSpectrumCache;
    } else spectrum = spectrumModel.spectrumAt(transientModel, strikeRecipe(), state.strikeCursor);
    renderStrikeTime();
    document.querySelectorAll("[data-spectrum-view]").forEach(button => {
      const selected = state.strikeSpectrumView === button.dataset.spectrumView;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const maxHz = state.strikeKind === "pluck" ?
      Math.min(8000, Math.max(1200, state.strikePitch * 8.3)) : 600;
    ctx.strokeStyle = "#e8eff7";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = top + i * h / 4;
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
      const x = left + i * w / 4;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    }
    const gain = state.strikeStrength / 100;
    ctx.strokeStyle = "#2d88c8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const count = Math.min(spectrum.magnitudes.length - 1, Math.floor(maxHz / spectrum.binHz));
    for (let i = 0; i <= count; i++) {
      const frequency = i * spectrum.binHz;
      // Fixed decibel scale: a fading note must not be normalized back to full height.
      const magnitude = spectrum.magnitudes[i] * gain;
      const decibels = 20 * Math.log10(Math.max(1e-6, magnitude) / 0.5);
      const level = Math.max(0, Math.min(1, (decibels + 60) / 60));
      const x = left + frequency / maxHz * w, y = bottom - level * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("0 dB", left - 5, top + 3);
    ctx.fillText("−60", left - 5, bottom);
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const hz = maxHz * i / 4;
      ctx.fillText(hz >= 1000 ? frequencyText(hz / 1000) + " kHz" : Math.round(hz) + " Hz",
        left + i * w / 4, height - 12);
    }
  }

  function drawPlots() {
    if (state.mode === "strike") {
      renderStrikeTime();
      drawStrikeWave();
      drawStrikeSpectrum();
    } else {
      drawWave();
      drawSpectrum();
    }
  }

  document.querySelectorAll("[data-wave]").forEach(button => {
    button.addEventListener("click", () => selectWaveform(button.dataset.wave));
  });
  document.querySelectorAll("[data-strike]").forEach(button => {
    button.addEventListener("click", () => selectStrikeKind(button.dataset.strike));
  });
  document.querySelectorAll("[data-drum-size]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.strikeDrumSize === button.dataset.drumSize) return;
      stopStrikeForEdit();
      state.strikeDrumSize = button.dataset.drumSize;
      renderStrikeControls();
      drawPlots();
    });
  });
  document.querySelectorAll("[data-spectrum-view]").forEach(button => {
    button.addEventListener("click", () => {
      state.strikeSpectrumView = button.dataset.spectrumView;
      drawStrikeSpectrum();
    });
  });
  $("modePure").addEventListener("click", () => selectMode("pure"));
  $("modeStrike").addEventListener("click", () => selectMode("strike"));
  $("strikeButton").addEventListener("click", triggerStrike);
  $("strikeFrequencySlider").addEventListener("input", event => {
    setStrikePitch(transientModel.sliderToHz(Number(event.target.value)));
  });
  $("strikeFrequencyInput").addEventListener("change", event => setStrikePitch(event.target.value));
  $("strikeSnap").addEventListener("change", event => {
    state.strikeSnap = event.target.checked;
    if (state.strikeSnap) setStrikePitch(state.strikePitch);
    else renderStrikeControls();
  });
  $("strikeStrength").addEventListener("input", event => {
    stopStrikeForEdit();
    state.strikeStrength = Number(event.target.value);
    renderStrikeControls();
    drawPlots();
  });
  $("strikeDecay").addEventListener("input", event => {
    stopStrikeForEdit();
    state.strikeDecay = Number(event.target.value);
    renderStrikeControls();
    drawPlots();
  });
  $("strikeViewZoomIn").addEventListener("click", () => setStrikeView(state.strikeViewSpan / 2));
  $("strikeViewZoomOut").addEventListener("click", () => setStrikeView(state.strikeViewSpan * 2));
  $("strikeViewLeft").addEventListener("click", () => panStrikeView(-1));
  $("strikeViewRight").addEventListener("click", () => panStrikeView(1));
  $("strikeViewFit").addEventListener("click", () => setStrikeView(3, 1.5));
  $("strikeViewPreset").addEventListener("change", event => {
    const selected = Number(event.target.value);
    if (selected > 0) setStrikeView(selected, selected === 3 ? 1.5 : state.strikeCursor);
  });
  $("strikeTimeSlider").addEventListener("input", event => {
    stopStrikeFollow(); // Direct inspection takes precedence over automatic playback following.
    state.strikeCursor = Math.max(0, Math.min(3, Number(event.target.value) / 1000));
    keepStrikeCursorVisible();
    drawPlots();
  });
  $("strikeWaveCanvas").addEventListener("click", event => {
    const width = $("strikeWaveCanvas").getBoundingClientRect().width;
    const fraction = Math.max(0, Math.min(1, (event.offsetX - 44) / Math.max(1, width - 59)));
    stopStrikeFollow();
    state.strikeCursor = state.strikeViewStart + fraction * state.strikeViewSpan;
    drawPlots();
  });
  $("strikeReset").addEventListener("click", resetStrike);
  document.querySelectorAll("[data-note]").forEach(button => {
    button.addEventListener("click", () => setFrequency(model.hzFromMidi(Number(button.dataset.note))));
  });
  $("playButton").addEventListener("click", toggleSound);
  $("stopAll").addEventListener("click", () => stopAllAudio());
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
    if (document.hidden) stopAllAudio(true, "hidden");
  });
  window.addEventListener("pagehide", () => stopAllAudio(true, "hidden"));
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => drawPlots());
    observer.observe($("waveCanvas"));
    observer.observe($("spectrumCanvas"));
    observer.observe($("strikeWaveCanvas"));
    observer.observe($("strikeSpectrumCanvas"));
  } else window.addEventListener("resize", drawPlots);

  renderTexts();
  renderControls();
  drawPlots();
})();
