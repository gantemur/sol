/* Sound Lab: pure tones and short, modeled strike/pluck sounds. */
(() => {
  "use strict";
  const model = window.SoundLabModel;
  const transientModel = window.SoundLabTransientModel;
  const spectrumModel = window.SoundLabSpectrum;
  const motionModel = window.SoundLabMotionModel;
  const $ = id => document.getElementById(id);

  const messages = {
    en: {
      backLabel: "Back to Sol tools", stop: "■ Stop",
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
      unitHz: "Hz", unitKHz: "kHz", unitSeconds: "s", unitMilliseconds: "ms",
      strikePresetOneSecond: "1 s", strikePreset200Ms: "200 ms", strikePreset20Ms: "20 ms",
      fixedHint: "Uncheck to zoom into four periods and examine the wave shape. The time scale then changes with frequency.",
      waveTitle: "Waveform over time", waveSubtitle: "Same 20 ms at every frequency: higher pitch means more cycles.",
      waveSubtitleZoom: "Zoomed to four periods: the time scale now changes with frequency.",
      cyclesUnit: "cycles",
      spectrumTitle: "Harmonics", spectrumSubtitle: "Ideal frequency components, relative to the first",
      timeAxis: "time →", frequencyAxis: "frequency →",
      tryThis: "TRY THIS", reset: "↺ Reset",
      learnMore: "Why do sound waves sound different?",
      lessonOne: "A periodic wave has a lowest frequency, called its fundamental. This determines the pitch we hear. Higher harmonics occur at whole-number multiples of it: 2f, 3f, 4f, and so on.",
      lessonTwo: "The wave shape determines the mixture of harmonics. A pure sine wave has only its fundamental. Two instruments can play the same pitch yet sound different because their harmonic mixtures are different.",
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
      modePure: "Pure tones", modeStrike: "Strike & Pluck", modeMotion: "Moving Pitch", modeSwitchAria: "Sound categories",
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
      strikeLessonTwo: "The bass drum begins at a higher frequency, rapidly drops in pitch, and gradually fades. Their overall waveforms can look similar, but their frequency content is very different. Zoom to 20 ms or compare their spectra to see the difference.",
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
      motionPhase: "03 · Moving frequency", motionChoose: "Choose a moving sound",
      theremin: "Theremin", siren: "Fire-truck siren",
      motionDesc: {
        theremin: "Move your finger to change the pitch and loudness continuously.",
        siren: "Hear how different paths between the same two frequencies change the sound."
      },
      motionGroupAria: "Moving sound choices", thereminHelp: "Press and move: right makes the pitch higher; up makes it louder. Release to stop.",
      padLoud: "Louder ↑", padStart: "Press and move", padHigh: "Higher pitch →",
      padAria: "Theremin touch pad", thereminKeyboardHelp: "Keyboard: use arrow keys to move; Space or Enter toggles the sound. Escape stops.",
      sirenPatternAria: "Frequency trajectory", sirenTwoTone: "Rectangular · two tones", sirenSweep: "Linear in Hz",
      sirenPitchSweep: "Linear in semitones", sirenSineSweep: "Sinusoidal",
      sirenPlay: "Play siren", sirenStop: "Stop siren", sirenCaption: "Tap again to stop",
      sirenLow: "Low frequency", sirenHigh: "High frequency", sirenRate: "Repetitions per second", sirenRateUnit: "/s",
      motionReady: "Ready. Press the pad or Play to hear.", motionStarting: "Starting sound…",
      motionPlayingTheremin: "Playing. Release the pad or press Stop.",
      motionPlayingSiren: "Siren playing. Press Stop siren or the red Stop button.",
      motionStopped: "Stopped. Try another pitch pattern.",
      motionHidden: "Sound stopped when you left the page.", motionUnsupported: "This browser does not support synthesized sound playback.",
      motionBlocked: "Sound could not start. Check browser sound permission and try again.",
      motionSafety: "Start quietly, especially with headphones. Changing category or pressing Stop ends playback.",
      motionPitchTitle: "Pitch over time", motionPitchTheremin: "The last four seconds of your finger movement.",
      motionPitchSiren: "Abruptly alternates two frequencies: a rectangular trajectory.",
      motionPitchSirenSweep: "Linear in Hz; the logarithmic vertical scale makes the sweep look curved.",
      motionPitchSirenPitch: "Equal semitones per second: a straight path on the logarithmic frequency chart.",
      motionPitchSirenSine: "Sinusoidal in Hz: slow near the extremes and fastest in the middle.",
      motionPitchScale: "Logarithmic frequency · 120–1600 Hz", motionPitchAria: "Ideal pitch path over time",
      motionDetailTitle: "At this moment", motionDetailHint: "The same sound as a waveform and its current ideal frequency component.",
      motionWaveTitle: "20 ms waveform", motionComponentTitle: "Frequency component",
      motionWaveAria: "Modeled 20 millisecond sine waveform at current pitch", motionComponentAria: "Current single ideal frequency component",
      motionChallenge: {
        theremin: "Move left and right without changing the loudness. What changes in the waveform?",
        siren: "Keep the low and high frequencies and speed fixed. How do the four trajectories sound different?"
      },
      motionLearnMore: "Why does moving the pitch change the sound?",
      motionLessonOne: "Moving to the right makes the oscillator vibrate faster, so its pitch rises. Up and down changes the amplitude, making the sound louder or softer.",
      motionLessonTwo: "The frequency trajectory changes what we hear. Rectangular jumps abruptly between two tones. Linear in Hz changes by equal frequency increments; linear in semitones changes by equal pitch intervals and looks straight on the logarithmic graph. Sinusoidal changes slow down at both extremes.",
      desc: {
        sine: "One smooth vibration, with a single frequency.",
        triangle: "Weak upper odd harmonics.",
        square: "Strong odd harmonics.",
        sawtooth: "Many harmonics, with a rich tone."
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
      phase: "01 · Энгийн дохионууд", chooseShape: "Долгионы хэлбэр сонгох",
      sine: "Синус", triangle: "Гурвалжин", square: "Дөрвөлжин", sawtooth: "Хөрөө",
      play: "Авиа тоглуулах", playCaption: "Сонсохын тулд товшино уу",
      stopTone: "Авиа зогсоох", stopCaption: "Авиа дуугарч байна · зогсоохын тулд товшино уу",
      frequency: "Давтамж", snap: "Нотод тааруулах",
      sliderHint: "Гулсуур нь логарифм хуваарьтай. Хязгаараас гадуур утгыг гараар оруулж болно.",
      sliderOutside: "Гараар оруулсан давтамж гулсуурын хязгаараас гадуур боловч яг тэр утгыг хэрэглэнэ.",
      tryNote: "Нот турших:", volume: "Дууны хэмжээ",
      safeVolume: "Эхэндээ аяархан дуугарна. Ялангуяа чихэвч хэрэглэвэл болгоомжтой нэмээрэй.",
      settings: "⚙ Тохиргоо", tuning: "Нотод тааруулах хөглөлт",
      tuningHint: "Одоохондоо 12 тэнцүү хагас авианы хөглөлт ашиглана.",
      equal: "12 тэнцүү хуваарь", fixedTime: "Хугацааны цонхыг 20 мсек-д тогтмол байлгах",
      unitHz: "Гц", unitKHz: "кГц", unitSeconds: "сек", unitMilliseconds: "мсек",
      strikePresetOneSecond: "1 сек", strikePreset200Ms: "200 мсек", strikePreset20Ms: "20 мсек",
      fixedHint: "Долгионы хэлбэрийг сайн харахын тулд тэмдэглэгээг арилгаж дөрвөн үеийг томруулна. Ингэвэл хугацааны хуваарь өөрчлөгдөнө.",
      waveTitle: "Хугацааны дагуух долгион", waveSubtitle: "Хугацаа 20 мсек хэвээр: давтамж ихсэхэд олон үе багтана.",
      waveSubtitleZoom: "Дөрвөн үеийг томруулж харуулав. Давтамжтай хамт хугацааны хуваарь өөрчлөгдөнө.",
      cyclesUnit: "үе",
      spectrumTitle: "Гармоникууд", spectrumSubtitle: "Үндсэн давтамжтай харьцуулсан идеал бүрэлдэхүүн",
      timeAxis: "хугацаа →", frequencyAxis: "давтамж →",
      tryThis: "ТУРШИЖ ҮЗ", reset: "↺ Эхнээс нь",
      learnMore: "Дууны долгион яагаад өөр өөр сонсогддог вэ?",
      lessonOne: "Үелэх долгионд хамгийн нам давтамж гэж байх ба үүнийг нь үндсэн давтамж гэдэг. Энэ нь дууны өндрийг тодорхойлно. Үүнээс өндөр давтамжууд буюу дээд гармоникууд нь үндсэн давтамжаасаа үргэлж бүхэл тоо дахин их: 2f, 3f, 4f гэх мэт.",
      lessonTwo: "Долгионы хэлбэрээс хамааран гармоникуудын найрлага өөрчлөгдөнө. Жишээ нь, цэвэр синусоид долгионд үндсэн давтамжаас өөр найрлага байхгүй. Өөр өөр хөгжмийн зэмсгүүд ижил өндөртэй авиа гаргасан ч ялгаатай сонсогддог нь гармоникуудынх нь найрлага өөр байгаа хэрэг.",
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
      modePure: "Цэвэр авиа", modeStrike: "Цохих ба татах", modeMotion: "Хувирдаг давтамж", modeSwitchAria: "Дууны бүлэг",
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
      strikeLocalSpectrumSubtitle: "Сонгосон хугацааны орчмын 128 мсек долгионы Фурье шинжилгээ",
      strikeSpectrumHere: "Энэ мөчид", strikeSpectrumWhole: "Бүх дуу",
      strikeSpectrumModesAria: "Спектрийн хугацааны сонголт",
      strikeSpectrumHint: "Чавхдасны дээд гармоник хурдан намдаж, бөмбөрийн давтамж буурна.",
      strikeSpectrumWholeHint: "Загварчилсан цохилтын турших хугацааны дундаж спектр.",
      strikeWaveAria: "Хугацаа сонгох тэмдэглэгээтэй загвар долгион",
      strikeSpectrumAria: "Загварчилсан дууны хугацааны хэсгийн Фурье спектр",
      strikeSafety: "Дуу өөрөө намдана. Ялангуяа чихэвчтэй бол эхэндээ аяархан сонсоорой.",
      strikeEnvelopeTitle: "Дууны хүч хэрхэн намдах вэ?",
      strikeEnvelopeSubtitle: "Бүх цохилтыг нэг ижил 3 секундийн хуваарьт харуулав",
      strikeZoomTitle: "Эхний 20 мсек-ийн долгион",
      strikeZoomSubtitle: "Түргэн хэлбэлзлийг томруулж харах",
      strikeEnvelopeAria: "Намдах далайцын математик загвар",
      strikeZoomAria: "Эхний 20 мсек-ийн долгионы загвар",
      strikeChallenge: "Намдах хугацааг өөрчил. Дуу болон график хэрхэн өөрчлөгдөж байна вэ?",
      strikeLearnMore: "Яагаад эдгээр дуу намддаг вэ?",
      strikeLessonOne: "Чавхдас олон давтамжаар хэлбэлзэнэ. Өндөр гармоникууд нь үндсэн давтамжаас хурдан намдана.",
      strikeLessonTwo: "Басс бөмбөрийн цохилтын давтамж эхлээд хурдан буурч, далайц нь аажмаар намдана. Эдгээрийн долгионы график ерөнхийдөө төстэй харагдах боловч давтамжийн найрлага нь тэс өөр. 20 мсек болгон томруулж эсвэл спектрийг нь харьцуулж ялгааг нь хараарай.",
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
      motionPhase: "03 · Хувирдаг давтамж", motionChoose: "Хөдөлгөөнт дуу сонгох",
      theremin: "Теремин", siren: "Галын машины дохио",
      motionDesc: {
        theremin: "Гараа хөдөлгөж давтамж ба дууны хэмжээг өөрчил.",
        siren: "Ижил хоёр давтамжийн хооронд өөр өөр замаар шилжүүлж сонсоорой."
      },
      motionGroupAria: "Хөдөлгөөнт дууны төрөл", thereminHelp: "Талбар дээр дарж хөдөлгөнө: баруун тийш өндөр, дээш чанга дуугарна. Гараа авахад зогсоно.",
      padLoud: "Чанга ↑", padStart: "Дараад хөдөлгөөрэй", padHigh: "Өндөр авиа →",
      padAria: "Теремин тоглох талбар", thereminKeyboardHelp: "Гарын товчлуураар: сумаар хөдөлгөж, Space/Enter-ээр дууг асааж эсвэл зогсооно. Escape зогсооно.",
      sirenPatternAria: "Давтамжийн замнал", sirenTwoTone: "Дөрвөлжин · хоёр авиа", sirenSweep: "Гц-ээр жигд",
      sirenPitchSweep: "Хагас тоноор жигд", sirenSineSweep: "Синусоид",
      sirenPlay: "Дохио тоглуулах", sirenStop: "Дохио зогсоох", sirenCaption: "Дахин дарж зогсооно",
      sirenLow: "Нам давтамж", sirenHigh: "Өндөр давтамж", sirenRate: "Давтах хурд", sirenRateUnit: "удаа/сек",
      motionReady: "Бэлэн. Талбар дээр дарж эсвэл дохиог тоглуулаарай.", motionStarting: "Дууг эхлүүлж байна…",
      motionPlayingTheremin: "Дуугарч байна. Гараа авах эсвэл Зогсоох дээр дарна уу.",
      motionPlayingSiren: "Дохио дуугарч байна. «Дохио зогсоох» эсвэл улаан «Зогсоох» товчийг дарна уу.",
      motionStopped: "Зогслоо. Өөр давтамж туршаарай.",
      motionHidden: "Хуудсаас гарахад авиа зогслоо.", motionUnsupported: "Энэ хөтөч дуу үүсгэж тоглуулах боломжгүй байна.",
      motionBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгаад дахин оролдоно уу.",
      motionSafety: "Ялангуяа чихэвчтэй бол эхэндээ аяархан сонсоорой. Өөр бүлэгт орох эсвэл Зогсоох дээр дарахад дуу зогсоно.",
      motionPitchTitle: "Давтамжийн өөрчлөлт", motionPitchTheremin: "Сүүлийн дөрвөн секундийн давтамжийг ажиглаарай.",
      motionPitchSiren: "Хоёр давтамжийн хооронд огцом шилжинэ: дөрвөлжин замнал.",
      motionPitchSirenSweep: "Давтамж Гц-ээр жигд өөрчлөгдөх боловч логарифм хуваарьт муруй харагдана.",
      motionPitchSirenPitch: "Хагас тоноор жигд өөрчлөгдөнө. Логарифм графикт шулуун харагдана.",
      motionPitchSirenSine: "Синусоид замналын захад удаан, дунд хэсэгт хурдан өөрчлөгдөнө.",
      motionPitchScale: "Логарифм давтамж · 120–1600 Гц", motionPitchAria: "Хугацаанд өөрчлөгдөх давтамжийн загвар",
      motionDetailTitle: "Энэ мөчийн дохио", motionDetailHint: "Ижил давтамжийг долгион болон нэг бүрэлдэхүүнээр харуулав.",
      motionWaveTitle: "20 мсек-ийн долгион", motionComponentTitle: "Давтамжийн бүрэлдэхүүн",
      motionWaveAria: "Тухайн мөчийн 20 миллисекундийн синус долгион", motionComponentAria: "Одоогийн нэг давтамжийн бүрэлдэхүүн",
      motionChallenge: {
        theremin: "Дууны хэмжээг өөрчлөхгүйгээр зүүн, баруун тийш хөдөлгө. Долгионы үе хэрхэн өөрчлөгдөв?",
        siren: "Хоёр захын давтамж, хурдыг өөрчлөхгүйгээр дөрвөн замналыг сонс. Ямар ялгаа байна вэ?"
      },
      motionLearnMore: "Давтамж өөрчлөгдөхөд яагаад авиа өөр сонсогддог вэ?",
      motionLessonOne: "Баруун тийш хөдөлгөхөд хэлбэлзэл түргэсэж, авиа өндөрсөж сонсогдоно. Дээш, доош хөдөлгөхөд далайц буюу дууны чанга сул өөрчлөгдөнө.",
      motionLessonTwo: "Давтамжийн замнал нь сонсогдох дуунд нөлөөлнө. Дөрвөлжин замналд хоёр авиа огцом солигдоно. Гц-ээр жигд эсвэл хагас тоноор жигд өсгөж бууруулж болно. Синусоид замнал захын цэгүүддээ удааширна. Логарифм графикт хагас тоноор жигд замнал шулуун харагдана.",
      desc: {
        sine: "Нэг үндсэн давтамжтай жигд хэлбэлзэл.",
        triangle: "Дээд сондгой гармоникууд нь сул",
        square: "Сондгой гармоникууд нь хүчтэй",
        sawtooth: "Олон гармониктой, баялаг өнгөтэй"
      },
      insight: {
        sine: "Идеал синус долгион зөвхөн үндсэн давтамжтай.",
        triangle: "Сондгой гармоникууд бий, гэхдээ хурдан суларна.",
        square: "3, 5, 7…-р гармоникууд бий; тэгш дугаартай нь байхгүй.",
        sawtooth: "Бүхэл тоон гармоник бүр бий, хүч нь аажмаар суларна."
      },
      challenge: {
        sine: "Давтамжийг хоёр дахин өсгө. Дууны өнгө болон үе хэрхэн өөрчлөгдөж байна вэ?",
        triangle: "Ижил давтамжтай гурвалжин ба дөрвөлжин долгионыг харьцуул. Алиных нь дээд гармоник сул вэ?",
        square: "Давтамжаа өөрчлөхгүйгээр синусыг дөрвөлжин болго. Авиа өндөр хэвээр үлдэх үү?",
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
    strikeFollowing: false,
    motionKind: "theremin",
    motionX: motionModel.padFraction(440),
    motionY: 0.5,
    motionHz: 440,
    motionLevel: 0.5,
    motionElapsed: 0,
    motionHistory: [],
    motionPlaying: false,
    motionStatus: "motionReady",
    motionError: false,
    sirenPattern: "two-tone",
    sirenLow: 440,
    sirenHigh: 880,
    sirenRate: 0.8,
    sirenVolume: 40
  };
  const text = key => messages[state.language][key];
  const frequencyText = hz => Number(hz.toFixed(2)).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const hzText = hz => frequencyText(hz) + " " + text("unitHz");
  const kHzText = (hz, oneDecimal = false) =>
    (oneDecimal ? (hz / 1000).toFixed(1) : frequencyText(hz / 1000)) + " " + text("unitKHz");
  const secondsText = seconds => frequencyText(seconds) + " " + text("unitSeconds");
  const secondsFixedText = seconds => seconds.toFixed(2) + " " + text("unitSeconds");
  const millisecondsText = ms => frequencyText(ms) + " " + text("unitMilliseconds");

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

  class MotionEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentVoice = null;
      this.generation = 0;
    }

    fadeAndStop(voice, immediate) {
      if (voice.stopping && !immediate) return;
      const now = this.contextOwner.context.currentTime;
      const gain = voice.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      if (voice.stopping) return;
      voice.stopping = true;
      try { voice.oscillator.stop(now + (immediate ? 0.002 : 0.09)); }
      catch (_) { /* An earlier stop may already be scheduled. */ }
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "motion") return false;
      for (const voice of this.voices) this.fadeAndStop(voice, false);
      while (this.voices.size >= 2) {
        const oldest = this.voices.values().next().value;
        this.fadeAndStop(oldest, true);
        this.voices.delete(oldest);
      }
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(state.motionHz, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12 * state.motionLevel, now + 0.035);
      oscillator.connect(gain);
      gain.connect(context.destination);
      const voice = { oscillator, gain, stopping: false };
      this.voices.add(voice);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      oscillator.start(now);
      this.currentVoice = voice;
      return { context, startedAt: now };
    }

    update() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      this.currentVoice.oscillator.frequency.setTargetAtTime(state.motionHz, now, 0.018);
      const gain = this.currentVoice.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(0.12 * state.motionLevel, now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
    }
  }

  const audio = new ToneEngine();
  const transientAudio = new TransientEngine(audio);
  const motionAudio = new MotionEngine(audio);
  let motionFrame = null;
  let motionStartedAt = 0;
  let motionLastDraw = -1;
  let motionPointerId = null;
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
    return time < 0.1 ? millisecondsText(time * 1000) : secondsText(time);
  }

  function renderStrikeTime() {
    $("strikeTimeSlider").value = String(Math.round(state.strikeCursor * 1000));
    $("strikeTimeValue").textContent = "t = " + secondsFixedText(state.strikeCursor);
    $("strikeSpectrumBadge").textContent = state.strikeSpectrumView === "local" ?
      "t = " + secondsFixedText(state.strikeCursor) : text("strikeSpectrumWhole");
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

  function setMotionStatus(status, error = false) {
    state.motionStatus = status;
    state.motionError = error;
    $("motionStatus").textContent = text(status);
    $("motionStatus").classList.toggle("error", error);
  }

  function sirenRecipe() {
    return { pattern: state.sirenPattern, lowHz: state.sirenLow,
      highHz: state.sirenHigh, rate: state.sirenRate };
  }

  function stopMotionFrame() {
    if (motionFrame !== null) window.cancelAnimationFrame(motionFrame);
    motionFrame = null;
  }

  function stopMotionSound(immediate = false, message = "motionStopped") {
    motionAudio.stop(immediate);
    stopMotionFrame();
    motionPointerId = null;
    state.motionPlaying = false;
    setMotionStatus(message);
    renderMotionControls();
    if (state.mode === "motion") drawMotionPlots();
  }

  function renderMotionControls() {
    const isTheremin = state.motionKind === "theremin";
    $("thereminControls").hidden = !isTheremin;
    $("sirenControls").hidden = isTheremin;
    $("motionDescription").textContent = text("motionDesc")[state.motionKind];
    const sirenHintKeys = {
      "two-tone": "motionPitchSiren", "sweep": "motionPitchSirenSweep",
      "pitch-sweep": "motionPitchSirenPitch", "sine-sweep": "motionPitchSirenSine"
    };
    $("motionPitchSubtitle").textContent = text(isTheremin ? "motionPitchTheremin" :
      sirenHintKeys[state.sirenPattern]);
    $("motionChallengeText").textContent = text("motionChallenge")[state.motionKind];
    document.querySelectorAll("[data-motion]").forEach(button => {
      const active = button.dataset.motion === state.motionKind;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-siren-pattern]").forEach(button => {
      const active = button.dataset.sirenPattern === state.sirenPattern;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("thereminCursor").style.left = (state.motionX * 100).toFixed(2) + "%";
    $("thereminCursor").style.top = (state.motionY * 100).toFixed(2) + "%";
    $("thereminPad").setAttribute("aria-pressed", String(isTheremin && state.motionPlaying));
    $("motionCurrentHz").textContent = hzText(state.motionHz);
    $("motionCurrentLevel").textContent = Math.round(state.motionLevel * 100) + "%";
    $("sirenLow").value = String(state.sirenLow);
    $("sirenHigh").value = String(state.sirenHigh);
    $("sirenRate").value = String(state.sirenRate);
    $("sirenVolume").value = String(state.sirenVolume);
    $("sirenLowValue").textContent = hzText(state.sirenLow);
    $("sirenHighValue").textContent = hzText(state.sirenHigh);
    $("sirenRateValue").textContent = frequencyText(state.sirenRate) + " " + text("sirenRateUnit");
    $("sirenVolumeValue").textContent = state.sirenVolume + "%";
    $("sirenButton").classList.toggle("playing", !isTheremin && state.motionPlaying);
    $("sirenButton").setAttribute("aria-pressed", String(!isTheremin && state.motionPlaying));
    $("sirenPlayIcon").textContent = state.motionPlaying ? "■" : "▶";
    $("sirenPlayLabel").textContent = text(state.motionPlaying ? "sirenStop" : "sirenPlay");
  }

  function setMotionKind(kind) {
    if (!motionModel || !["theremin", "siren"].includes(kind) || kind === state.motionKind) return;
    stopMotionSound();
    state.motionKind = kind;
    state.motionHistory = [];
    state.motionElapsed = 0;
    state.motionHz = kind === "theremin" ? motionModel.padHz(state.motionX) :
      motionModel.sirenHzAt(0, sirenRecipe());
    state.motionLevel = kind === "theremin" ? motionModel.padLevel(state.motionY) : state.sirenVolume / 100;
    setMotionStatus("motionReady");
    renderMotionControls();
    drawPlots();
  }

  function setPadPosition(x, y) {
    state.motionX = model.clamp(x, 0, 1);
    state.motionY = model.clamp(y, 0, 1);
    state.motionHz = motionModel.padHz(state.motionX);
    state.motionLevel = motionModel.padLevel(state.motionY);
    if (state.motionPlaying) motionAudio.update();
    renderMotionControls();
    if (state.mode === "motion") drawMotionPlots();
  }

  function readPadPointer(event) {
    const rect = $("thereminPad").getBoundingClientRect();
    setPadPosition((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  }

  function updateSiren() {
    state.motionLevel = state.sirenVolume / 100;
    state.motionHz = motionModel.sirenHzAt(state.motionElapsed, sirenRecipe());
    if (state.motionPlaying) motionAudio.update();
    renderMotionControls();
    if (state.mode === "motion") drawMotionPlots();
  }

  async function startMotionSound() {
    if (state.motionPlaying || state.mode !== "motion") return;
    setMotionStatus("motionStarting");
    try {
      const info = await motionAudio.start();
      if (!info) return;
      motionStartedAt = info.startedAt;
      motionLastDraw = -1;
      state.motionElapsed = 0;
      state.motionHistory = [];
      state.motionPlaying = true;
      setMotionStatus(state.motionKind === "theremin" ? "motionPlayingTheremin" : "motionPlayingSiren");
      renderMotionControls();
      drawMotionPlots();
      const advance = () => {
        if (!state.motionPlaying || state.mode !== "motion") return;
        const elapsed = Math.max(0, info.context.currentTime - motionStartedAt);
        state.motionElapsed = elapsed;
        if (state.motionKind === "siren") {
          state.motionHz = motionModel.sirenHzAt(elapsed, sirenRecipe());
          state.motionLevel = state.sirenVolume / 100;
        } else {
          state.motionHistory.push({ time: elapsed, hz: state.motionHz });
          while (state.motionHistory.length > 1 && state.motionHistory[1].time < elapsed - 4) {
            state.motionHistory.shift();
          }
        }
        motionAudio.update();
        if (elapsed - motionLastDraw >= 0.035) {
          renderMotionControls();
          drawMotionPlots();
          motionLastDraw = elapsed;
        }
        motionFrame = window.requestAnimationFrame(advance);
      };
      motionFrame = window.requestAnimationFrame(advance);
    } catch (error) {
      stopMotionSound(true, error.message === "unsupported" ? "motionUnsupported" : "motionBlocked");
      $("motionStatus").classList.toggle("error", true);
      state.motionError = true;
    }
  }

  function resetMotion() {
    stopMotionSound();
    state.motionKind = "theremin";
    state.motionX = motionModel.padFraction(440);
    state.motionY = 0.5;
    state.motionHz = 440;
    state.motionLevel = 0.5;
    state.motionElapsed = 0;
    state.motionHistory = [];
    state.sirenPattern = "two-tone";
    state.sirenLow = 440;
    state.sirenHigh = 880;
    state.sirenRate = 0.8;
    state.sirenVolume = 40;
    setMotionStatus("motionReady");
    renderMotionControls();
    drawPlots();
  }

  function renderMode() {
    const isStrike = state.mode === "strike";
    const isMotion = state.mode === "motion";
    $("pureWorkspace").hidden = isStrike || isMotion;
    $("pureChallenge").hidden = isStrike || isMotion;
    $("pureExplanation").hidden = isStrike || isMotion;
    $("strikeWorkspace").hidden = !isStrike;
    $("strikeChallenge").hidden = !isStrike;
    $("strikeExplanation").hidden = !isStrike;
    $("motionWorkspace").hidden = !isMotion;
    $("motionChallenge").hidden = !isMotion;
    $("motionExplanation").hidden = !isMotion;
    for (const [id, mode] of [["modePure", "pure"], ["modeStrike", "strike"], ["modeMotion", "motion"]]) {
      const selected = state.mode === mode;
      $(id).classList.toggle("active", selected);
      $(id).setAttribute("aria-pressed", String(selected));
    }
    $("pagePhase").textContent = text(isStrike ? "strikePhase" : isMotion ? "motionPhase" : "phase");
  }

  function renderTexts() {
    document.documentElement.lang = state.language;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if (typeof text(key) === "string") element.textContent = text(key);
    });
    document.querySelectorAll("[data-unit-hz]").forEach(element => {
      element.textContent = element.dataset.unitHz + " " + text("unitHz");
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
    $("motionChoices").setAttribute("aria-label", text("motionGroupAria"));
    $("sirenPatterns").setAttribute("aria-label", text("sirenPatternAria"));
    $("thereminPad").setAttribute("aria-label", text("padAria"));
    $("motionPitchCanvas").setAttribute("aria-label", text("motionPitchAria"));
    $("motionWaveCanvas").setAttribute("aria-label", text("motionWaveAria"));
    $("motionSpectrumCanvas").setAttribute("aria-label", text("motionComponentAria"));
    document.querySelector(".note-presets").setAttribute("aria-label", text("presetsAria"));
    document.querySelector(".lang-group").setAttribute("aria-label", text("langGroupAria"));
    setStatus(state.status, state.error);
    setStrikeStatus(state.strikeStatus, state.strikeError);
    setMotionStatus(state.motionStatus, state.motionError);
    renderMode();
    renderStrikeControls();
    renderMotionControls();
    renderStrikeTime();
  }

  function renderControls() {
    $("frequencySlider").value = String(Math.round(model.frequencyToSlider(state.frequency)));
    $("frequencyInput").value = String(Number(state.frequency.toFixed(6)));
    $("frequencyInput").setAttribute("aria-valuetext", String(Number(state.frequency.toFixed(6))) + " " + text("unitHz"));
    const note = model.nearestNote(state.frequency);
    const differenceCents = 1200 * Math.log2(state.frequency / note.frequency);
    const approx = !state.snap && Math.abs(differenceCents) >= 0.5 ? "≈ " : "";
    $("noteLabel").textContent = approx + note.english + " · " + note.mongolian;
    $("noteLabel").title = "12-TET: " + hzText(note.frequency);
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
      hzText(Math.round(transientModel.kickFrequency(3, state.strikeDrumSize)));
    $("strikeStrength").value = String(state.strikeStrength);
    $("strikeStrengthValue").textContent = state.strikeStrength + "%";
    $("strikeDecay").value = String(state.strikeDecay);
    $("strikeDecayValue").textContent = secondsText(state.strikeDecay);
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
    stopMotionSound(immediate, message === "hidden" ? "motionHidden" : "motionStopped");
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
    if (mode === state.mode || !["pure", "strike", "motion"].includes(mode)) return;
    stopAllAudio(false);
    state.mode = mode;
    if (mode === "motion") setMotionStatus("motionReady");
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
    $("periodBadge").textContent = "T = " + millisecondsText(periodMs);
    $("windowLabel").textContent = "0–" + millisecondsText(duration * 1000) + " · " +
      frequencyText(duration * state.frequency) + " " + text("cyclesUnit");
    $("waveSubtitle").textContent = text(state.fixedTime ? "waveSubtitle" : "waveSubtitleZoom");
    $("fundamentalBadge").textContent = "f₀ = " + hzText(state.frequency);
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
      ctx.fillText(millisecondsText(duration * 250 * i), x, height - 12);
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
      const label = hz < 1000 ? hzText(Math.round(hz)) : kHzText(hz, true);
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
    $("strikeDurationBadge").textContent = "τ = " + secondsText(state.strikeDecay);
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
      ctx.fillText(hz >= 1000 ? kHzText(hz) : hzText(Math.round(hz)),
        left + i * w / 4, height - 12);
    }
  }

  function drawMotionPitch() {
    const { ctx, width, height } = plotContext($("motionPitchCanvas"));
    const left = 47, right = width - 16, top = 19, bottom = height - 30;
    const w = right - left, h = bottom - top;
    const viewStart = Math.max(0, state.motionElapsed - 4);
    const yAt = hz => bottom - Math.log(hz / motionModel.MIN_HZ) /
      Math.log(motionModel.MAX_HZ / motionModel.MIN_HZ) * h;
    ctx.strokeStyle = "#e8eff7";
    ctx.lineWidth = 1;
    for (const hz of [120, 240, 480, 960, 1600]) {
      const y = yAt(hz);
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
      ctx.fillStyle = "#7489a1";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(hz), left - 6, y + 3);
    }
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const x = left + w * i / 4;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
      ctx.fillText(secondsText(viewStart + i), x, height - 12);
    }
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = state.motionKind === "siren" ? "#7861bb" : "#168f9b";
    ctx.beginPath();
    // Both modes show the most recent four seconds after playback passes 4 s.
    // A siren's audio phase must not appear to reset when its plot reaches the edge.
    if (state.motionKind === "siren") {
      const recipe = sirenRecipe();
      for (let i = 0; i <= 400; i++) {
        const t = i / 100;
        const x = left + t / 4 * w, y = yAt(motionModel.sirenHzAt(viewStart + t, recipe));
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (state.motionHistory.length) {
      let started = false;
      for (const point of state.motionHistory) {
        const x = left + (point.time - viewStart) / 4 * w;
        if (x < left || x > right) continue;
        if (!started) { ctx.moveTo(x, yAt(point.hz)); started = true; }
        else ctx.lineTo(x, yAt(point.hz));
      }
      if (started) ctx.stroke();
    }
    const x = left + Math.min(4, state.motionElapsed - viewStart) / 4 * w;
    if (state.motionPlaying || state.motionKind === "theremin") {
      ctx.fillStyle = "#df8738";
      ctx.beginPath();
      ctx.arc(x, yAt(state.motionHz), 5, 0, Math.PI * 2);
      ctx.fill();
    }
    $("motionPitchBadge").textContent = hzText(state.motionHz);
    $("motionDetailBadge").textContent = hzText(state.motionHz);
  }

  function drawMotionWave() {
    const { ctx, width, height } = plotContext($("motionWaveCanvas"));
    const left = 27, right = width - 12, top = 19, bottom = height - 27;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const middle = (top + bottom) / 2;
    const amplitude = (bottom - top) * 0.46 * state.motionLevel;
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 350; i++) {
      const fraction = i / 350;
      const x = left + fraction * (right - left);
      const y = middle - amplitude * Math.sin(2 * Math.PI * state.motionHz * fraction * 0.02);
      if (!i) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("0", left, height - 9);
    ctx.textAlign = "right";
    ctx.fillText(millisecondsText(20), right, height - 9);
  }

  function drawMotionComponent() {
    const { ctx, width, height } = plotContext($("motionSpectrumCanvas"));
    const left = 30, right = width - 15, top = 19, bottom = height - 27;
    ctx.strokeStyle = "#e8eff7";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = left + (right - left) * i / 4;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    }
    ctx.strokeStyle = "#a9bdd3";
    ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
    const x = left + (state.motionHz - motionModel.MIN_HZ) /
      (motionModel.MAX_HZ - motionModel.MIN_HZ) * (right - left);
    ctx.strokeStyle = "#278bb8";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, bottom); ctx.lineTo(x, bottom - (bottom - top) * state.motionLevel); ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(hzText(motionModel.MIN_HZ), left, height - 9);
    ctx.textAlign = "right";
    ctx.fillText(hzText(motionModel.MAX_HZ), right, height - 9);
  }

  function drawMotionPlots() {
    drawMotionPitch();
    drawMotionWave();
    drawMotionComponent();
  }

  function drawPlots() {
    if (state.mode === "strike") {
      renderStrikeTime();
      drawStrikeWave();
      drawStrikeSpectrum();
    } else if (state.mode === "motion") {
      drawMotionPlots();
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
  document.querySelectorAll("[data-motion]").forEach(button => {
    button.addEventListener("click", () => setMotionKind(button.dataset.motion));
  });
  document.querySelectorAll("[data-siren-pattern]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.sirenPattern === button.dataset.sirenPattern) return;
      state.sirenPattern = button.dataset.sirenPattern;
      updateSiren();
    });
  });
  const pad = $("thereminPad");
  pad.addEventListener("pointerdown", event => {
    if (state.mode !== "motion" || state.motionKind !== "theremin" || event.button > 0) return;
    event.preventDefault();
    motionPointerId = event.pointerId;
    if (pad.setPointerCapture) pad.setPointerCapture(event.pointerId);
    readPadPointer(event);
    return startMotionSound();
  });
  pad.addEventListener("pointermove", event => {
    if (motionPointerId !== event.pointerId || state.motionKind !== "theremin") return;
    event.preventDefault();
    readPadPointer(event);
  });
  const endPadTouch = event => {
    if (motionPointerId !== event.pointerId) return;
    if (pad.releasePointerCapture) {
      try { pad.releasePointerCapture(event.pointerId); }
      catch (_) { /* Capture may already have been released by the browser. */ }
    }
    stopMotionSound();
  };
  pad.addEventListener("pointerup", endPadTouch);
  pad.addEventListener("pointercancel", endPadTouch);
  pad.addEventListener("lostpointercapture", endPadTouch);
  pad.addEventListener("keydown", event => {
    const increments = {
      ArrowLeft: [-0.035, 0], ArrowRight: [0.035, 0],
      ArrowUp: [0, -0.05], ArrowDown: [0, 0.05]
    };
    if (event.key in increments) {
      event.preventDefault();
      const [dx, dy] = increments[event.key];
      setPadPosition(state.motionX + dx, state.motionY + dy);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (state.motionPlaying) stopMotionSound();
      else return startMotionSound();
    } else if (event.key === "Escape") {
      event.preventDefault();
      stopMotionSound();
    }
  });
  $("sirenButton").addEventListener("click", () => {
    if (state.motionPlaying) stopMotionSound();
    else return startMotionSound();
  });
  $("sirenLow").addEventListener("input", event => {
    state.sirenLow = Math.min(state.sirenHigh - 20, Math.max(motionModel.MIN_HZ, Number(event.target.value)));
    updateSiren();
  });
  $("sirenHigh").addEventListener("input", event => {
    state.sirenHigh = Math.max(state.sirenLow + 20, Math.min(motionModel.MAX_HZ, Number(event.target.value)));
    updateSiren();
  });
  $("sirenRate").addEventListener("input", event => {
    state.sirenRate = Math.min(motionModel.MAX_RATE, Math.max(motionModel.MIN_RATE, Number(event.target.value)));
    updateSiren();
  });
  $("sirenVolume").addEventListener("input", event => {
    state.sirenVolume = Math.min(100, Math.max(0, Number(event.target.value)));
    updateSiren();
  });
  $("motionReset").addEventListener("click", resetMotion);
  $("modePure").addEventListener("click", () => selectMode("pure"));
  $("modeStrike").addEventListener("click", () => selectMode("strike"));
  $("modeMotion").addEventListener("click", () => selectMode("motion"));
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
  window.addEventListener("blur", () => {
    if (state.motionPlaying) stopAllAudio(true, "hidden");
  });
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => drawPlots());
    observer.observe($("waveCanvas"));
    observer.observe($("spectrumCanvas"));
    observer.observe($("strikeWaveCanvas"));
    observer.observe($("strikeSpectrumCanvas"));
    observer.observe($("motionPitchCanvas"));
    observer.observe($("motionWaveCanvas"));
    observer.observe($("motionSpectrumCanvas"));
  } else window.addEventListener("resize", drawPlots);

  renderTexts();
  renderControls();
  drawPlots();
})();
