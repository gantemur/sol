/* Sound Lab: pure tones, modeled transients, moving pitch, and two-tone interference. */
(() => {
  "use strict";
  const model = window.SoundLabModel;
  const transientModel = window.SoundLabTransientModel;
  const sustainModel = window.SoundLabSustain;
  const spectrumModel = window.SoundLabSpectrum;
  const motionModel = window.SoundLabMotionModel;
  const beatsModel = window.SoundLabBeats;
  const harmonicModel = window.SoundLabHarmonics;
  const noiseModel = window.SoundLabNoise;
  const recorderModel = window.SoundLabRecorder;
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
      safeVolume: "Start at a low volume and increase carefully, especially with headphones.",
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
      footer: "Sol Sound Lab · Sound and recordings stay on your device; nothing is uploaded.",
      recordStart: "REC", recordStop: "SAVE", recordSave: "Download WAV",
      recordStartAria: "Start recording up to 15 seconds of Sound Lab audio; no microphone",
      recordStopAria: "Stop recording and save the WAV file",
      recordSavedShort: "Your WAV is ready", recordResultAria: "Last recorded sound",
      recordDismissAria: "Close recorded sound preview",
      recordReady: "Press Record, then play a tone, strike, or move the theremin.",
      recordPreparing: "Preparing local recording…", recordRecording: "Recording this tool's sound…",
      recordSaving: "Preparing WAV…", recordSaved: "Ready. Listen or save the WAV file.",
      recordEmpty: "No samples captured. Try again.",
      recordUnsupported: "This browser does not support local sound recording.",
      recordError: "Recording failed. Please try again.", recordPreviewAria: "Recorded sound preview",
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
      modePure: "Pure tones", modeStrike: "Strike & Pluck", modeSustain: "Blow & Bow", modeMotion: "Moving Pitch",
      modeMix: "Combine waves", modeSwitchAria: "Sound categories",
      mixExperimentsAria: "Explore combined and complex sounds",
      mixExperimentBeats: "Two frequencies", mixExperimentHarmonics: "Build timbre",
      mixExperimentNoise: "Noise",
      harmonicPhase: "05 · Build a sound", noisePhase: "05 · Explore noise",
      harmonicChoose: "Add harmonics", harmonicDescription: "Combine whole-number multiples of a frequency to build a new sound.",
      harmonicPlay: "Play", harmonicStop: "Stop", harmonicBase: "Fundamental frequency",
      harmonicPresetsTitle: "Example mixtures", harmonicPure: "Pure", harmonicOdd: "Odd harmonics",
      harmonicRich: "Rich", harmonicStrengths: "Strength of each harmonic", harmonicNotation: "f, 2f, 3f…",
      harmonicWaveTitle: "Combined waveform", harmonicWaveHint: "Add harmonics and watch the wave change shape.",
      harmonicSpectrumTitle: "Harmonic ingredients", harmonicSpectrumHint: "Each bar represents a multiple of the fundamental frequency.",
      harmonicSpectrumFoot: "Change the pitch to shift all eight frequencies together.",
      harmonicChallenge: "Keep the fundamental fixed. Add the 3f and 5f harmonics. What changes in the sound?",
      harmonicLearnMore: "How do harmonics shape a sound?",
      harmonicLessonOne: "Adding waves at f, 2f, 3f and other whole-number multiples changes their combined waveform and timbre.",
      harmonicLessonTwo: "You control the strength of each harmonic, while its frequency stays an exact multiple of the fundamental.",
      harmonicReady: "Ready. Press Play to hear your mixture.", harmonicStarting: "Starting your sound…",
      harmonicPlaying: "Playing. Move any harmonic slider to hear the change.",
      harmonicStopped: "Stopped. Build another mixture.", harmonicUnsupported: "This browser cannot play synthesized sound.",
      harmonicBlocked: "Sound could not start. Try again after checking browser audio settings.",
      harmonicInvalid: "Use a fundamental between 120 and 1,000 Hz.",
      harmonicWaveAria: "Waveform generated by eight additive sine harmonics",
      harmonicSpectrumAria: "Strengths and frequencies of eight harmonics",
      harmonicPresetsAria: "Example harmonic mixtures", harmonicSlidersAria: "Eight harmonic strengths",
      noiseChoose: "Choose a noise color", noiseDescription: "Listen to random vibrations with different frequency mixtures.",
      noiseWhite: "White", noisePink: "Pink", noiseBrown: "Brown", noisePlay: "Play", noiseStop: "Stop",
      noiseColorDescription: {
        white: "Roughly equal power in each hertz-wide frequency band.",
        pink: "More power in low frequencies, with about equal power per octave.",
        brown: "Low frequencies dominate even more strongly."
      },
      noiseCutoff: "Filter high frequencies", noiseCutoffHint: "Move left to make the noise softer and less bright.",
      noiseSafety: "Noise can sound loud. Start at a low volume, especially with headphones.",
      noiseWaveTitle: "Noise waveform", noiseWaveHint: "An example 40 ms random segment, not a repeating cycle.",
      noiseSpectrumTitle: "Frequency distribution", noiseSpectrumHint: "A broad trend rather than individual harmonic peaks.",
      noiseSpectrumFoot: "The curve is a predicted overall shape, not a live measurement.",
      noiseChallenge: "Compare white, pink and brown noise at the same volume. Then lower the cutoff.",
      noiseLearnMore: "Why does noise sound unlike a pure tone?",
      noiseLessonOne: "Noise combines many random vibrations. Unlike a pure tone, it has no regular repeating period.",
      noiseLessonTwo: "White noise has roughly equal power per hertz. Pink and brown noise favor lower frequencies. Filtering the highs darkens the sound.",
      noiseReady: "Ready. Press Play to hear the noise.", noiseStarting: "Starting noise…",
      noisePlaying: "Playing. Try another color or move the filter.",
      noiseStopped: "Stopped. Explore another noise color.", noiseUnsupported: "This browser cannot play synthesized noise.",
      noiseBlocked: "Noise could not start. Check the browser's audio settings.",
      noiseWaveAria: "Modeled example of a nonperiodic noise waveform",
      noiseSpectrumAria: "Expected frequency magnitude profile of colored and filtered noise",
      noiseChoicesAria: "Noise color choices",
      mixPhase: "05 · Two-tone beats",
      mixChoose: "Combine two tones", mixDescription: "Two nearby frequencies reinforce and cancel, making the volume pulse.",
      mixPlay: "Play", mixStop: "Stop",
      mixBase: "First frequency", mixGap: "Frequency difference (Δf)",
      mixTryGap: "Try:", mixZeroGap: "0 Hz", mixTwoGap: "2 Hz", mixFourGap: "4 Hz", mixTenGap: "10 Hz",
      mixTwoFrequencies: "Two frequencies", mixBeatRate: "Volume pulses", mixBeatUnit: "pulses/s",
      mixWaveTitle: "Combined waveform", mixWaveHint: "Long windows show the loudness envelope. Press + to zoom in and see the actual vibrations.",
      mixWaveHintFine: "Blue: the actual combined oscillation. Green: its loudness envelope.",
      mixSpectrumTitle: "Frequency components", mixSpectrumHint: "Pulsing loudness does not create a new low-frequency tone.",
      mixSpectrumFoot: "Only the original two frequencies appear in the ideal spectrum.",
      mixSpectrumZeroFoot: "At zero difference, the two identical frequencies merge into one spectral peak.",
      mixZoomLabel: "Zoom", mixPanLabel: "Move", mixZoomValueAria: "Visible time span",
      mixZoomOutAria: "Zoom out in time", mixZoomInAria: "Zoom in to individual vibrations",
      mixWaveAria: "Sum of two sine waves and its ideal beat envelope over time",
      mixSpectrumAria: "Ideal spectrum with one or two distinct sine frequency components",
      mixBaseSliderAria: "First frequency slider", mixBaseInputAria: "First frequency in hertz",
      mixGapSliderAria: "Difference between two frequencies in hertz",
      mixGapPresetsAria: "Frequency difference examples", mixPlotToolsAria: "Waveform time zoom and navigation",
      mixLeftAria: "Show earlier time", mixRightAria: "Show later time",
      mixChallenge: "Try differences of 0, 2, 4 and 10 Hz. How does the pulsing change?",
      mixLearnMore: "Why do two nearby tones make the loudness pulse?",
      mixLessonOne: "When two sine waves have nearly the same frequency, their vibrations sometimes reinforce each other and sometimes nearly cancel. These changes in loudness are called beats.",
      mixLessonTwo: "The number of loudness pulses each second is the frequency difference Δf = |f₂ − f₁|. For 440 and 444 Hz, you hear four pulses per second. The ideal spectrum still contains just the original two frequencies, not an extra 4 Hz tone.",
      mixReady: "Ready. Press Play to hear the two tones.", mixStarting: "Starting both tones…",
      mixPlaying: "Playing. Adjust the difference to hear the pulses speed up or slow down.",
      mixStopped: "Stopped. Try another difference.", mixHidden: "Sound stopped when you left the page.",
      mixUnsupported: "This browser does not support synthesized sound playback.",
      mixBlocked: "Could not start sound. Check browser audio permission and try again.",
      mixInvalid: "Enter a first frequency between 120 and 1,000 Hz.",
      strikePhase: "02 · Modeled sounds", strikeChoose: "Choose a modeled sound",
      pluck: "Plucked string", kick: "Bass drum", piano: "Piano", strikeGroupAria: "Transient sound model",
      strikeCaption: "Tap to sound; tap again to repeat",
      strikePluckButton: "Pluck", strikeKickButton: "Strike", strikePianoButton: "Play note",
      strikePitch: "Note frequency", strikePitchSliderAria: "Note pitch slider",
      strikePitchInputAria: "Note frequency in hertz",
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
        kick: "A drum hit drops in pitch while its vibration fades.",
        piano: "A hammer excites slightly detuned strings together, with a bright onset and stretched overtones."
      },
      sustainPhase: "03 · Held sounds", sustainChoose: "Choose a held sound",
      sustainFlute: "Flute", sustainViolin: "Violin", sustainMorin: "Morin khuur",
      sustainGroupAria: "Held instrument models", sustainGestureTitle: "How to play",
      sustainGestureAria: "Hold or toggle the sound", sustainHold: "Press and hold", sustainToggle: "Tap to toggle",
      sustainPress: "Hold to play", sustainPressing: "Sounding…", sustainPressCaption: "Hold the button; release to fade.",
      sustainTogglePlay: "Play", sustainToggleStop: "Stop", sustainToggleCaption: "Tap again to release the note.",
      sustainPitch: "Note frequency", sustainPitchSliderAria: "Held note pitch slider",
      sustainPitchInputAria: "Held note frequency in hertz", sustainAttack: "Attack time", sustainRelease: "Release time",
      sustainEnvelopeHelp: "Attack applies to the next note; release applies when you let go.",
      sustainEnvelopeTitle: "Loudness over time", sustainEnvelopeHint: "Example: hold for 1.2 s, then release. Attack, sustain and release.",
      sustainEnvelopeFoot: "The vertical mark is the release at 1.2 s.",
      sustainDetailTitle: "Waveform and harmonics", sustainDetailHint: "20 ms periodic component. The soft breath/bow noise is omitted from these plots.",
      sustainWaveTitle: "Waveform", sustainSpectrumTitle: "Harmonics",
      sustainEnvelopeAria: "Example held-note attack, sustain and release curve",
      sustainWaveAria: "Modeled twenty millisecond sustained periodic waveform",
      sustainSpectrumAria: "Relative strengths of eight modeled harmonics",
      sustainChallenge: "Keep the same note. Compare flute, violin and morin khuur and change the attack and release times.",
      sustainLearnMore: "Why can these sounds continue?",
      sustainLessonOne: "Blowing a flute or bowing a string keeps feeding energy into its vibration. A plucked string is set moving once and then fades.",
      sustainLessonTwo: "These simple models combine harmonics with a small breath/bow noise component. They do not reproduce the full instrument body, bow or breath mechanics.",
      sustainReady: "Ready. Hold the button or use tap-to-toggle mode.", sustainStarting: "Starting the note…",
      sustainPlayingHold: "Sounding. Release the button to fade.", sustainPlayingToggle: "Sounding. Tap again to release.",
      sustainReleased: "Released. The sound fades away.", sustainStopped: "Stopped. Try another instrument.",
      sustainHidden: "Sound stopped when you left the page.",
      sustainUnsupported: "This browser cannot play generated instruments.",
      sustainBlocked: "The sound could not start. Check browser sound permission.",
      sustainInvalid: "Enter a frequency between 110 and 880 Hz.",
      sustainDesc: {
        flute: "A soft, nearly pure tone with a little modeled breath noise.",
        violin: "A bright bowed-string color rich in upper harmonics.",
        morin: "A darker bowed-string color with emphasized odd harmonics, inspired by the morin khuur."
      },
      motionPhase: "04 · Moving frequency", motionChoose: "Choose a moving sound",
      theremin: "Theremin", siren: "Fire-truck siren",
      motionDesc: {
        theremin: "Move your finger to change the pitch and loudness continuously.",
        siren: "Hear how different paths between the same two frequencies change the sound."
      },
      motionGroupAria: "Moving sound choices", thereminHelp: "Press and move: right makes the pitch higher; up makes it louder. Release to stop.",
      thereminTimbreLabel: "Sound color", thereminTimbresAria: "Theremin timbre options",
      timbrePure: "Pure", timbreRich: "Rich", timbreVoice: "Voice-like", timbreOvertones: "Overtones",
      padLoud: "Louder ↑", padStart: "Press and move", padHigh: "Higher pitch →",
      padAria: "Theremin touch pad", thereminKeyboardHelp: "Keyboard: use arrow keys to move; Space or Enter toggles the sound. Escape stops.",
      sirenPatternAria: "Frequency trajectory", sirenTwoTone: "Abrupt", sirenSineSweep: "Smooth",
      sirenPitchSweep: "Linear",
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
      motionPitchSirenPitch: "Equal semitones per second: a straight path on the logarithmic frequency chart.",
      motionPitchSirenSine: "Sinusoidal in Hz: slow near the extremes and fastest in the middle.",
      motionPitchScale: "Logarithmic frequency · 120–1600 Hz", motionPitchAria: "Ideal pitch path over time",
      motionDetailTitle: "At this moment", motionDetailHint: "Different harmonic colors at the same fundamental pitch, shown as waves and components.",
      motionWaveTitle: "20 ms waveform", motionComponentTitle: "Harmonics",
      motionWaveAria: "Modeled 20 millisecond waveform at current pitch and timbre", motionComponentAria: "Harmonics of the current moving sound",
      motionChallenge: {
        theremin: "Move left and right without changing the loudness. What changes in the waveform?",
        siren: "Keep the low and high frequencies and speed fixed. How do the three trajectories sound different?"
      },
      motionLearnMore: "Why does moving the pitch change the sound?",
      motionLessonOne: "Moving right raises the pitch; moving up makes the sound louder. Theremin color choices change the harmonic mixture at the same fundamental frequency.",
      motionLessonTwo: "Three paths connect the same two frequencies. Abrupt switches directly between two tones. Smooth follows a sinusoidal curve, slowing near the extremes. Linear changes by equal musical-pitch intervals and looks straight on the logarithmic graph.",
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
      safeVolume: "Ялангуяа чихэвч хэрэглэвэл дууны хэмжээг багаас эхлүүлж, болгоомжтой нэмээрэй.",
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
      footer: "Sol Дууны лаборатори · Дуу, бичлэг зөвхөн таны төхөөрөмж дээр байна. Хаашаа ч илгээхгүй.",
      recordStart: "REC", recordStop: "WAV", recordSave: "WAV татах",
      recordStartAria: "Дууны лабораторийн авиаг 15 сек хүртэл бичих. Микрофон ашиглахгүй",
      recordStopAria: "Бичлэг дуусгаж WAV файл хадгалах",
      recordSavedShort: "WAV бэлэн", recordResultAria: "Сүүлийн бичлэг",
      recordDismissAria: "Бичлэгийг сонсох цонхыг хаах",
      recordReady: "Бичлэг эхлүүлээд авиа тоглуулж эсвэл цохиж үзээрэй.",
      recordPreparing: "Бичлэг бэлтгэж байна…", recordRecording: "Дуу бичиж байна…",
      recordSaving: "WAV файл бэлдэж байна…", recordSaved: "Бичлэг бэлэн. Сонсоод WAV болгон хадгалж болно.",
      recordEmpty: "Бичлэг хоосон байна. Дахин туршаарай.",
      recordUnsupported: "Энэ хөтөч дуу бичих боломжгүй байна.",
      recordError: "Бичлэг амжилтгүй. Дахин оролдоно уу.", recordPreviewAria: "Бичлэгийг сонсох",
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
      modePure: "Цэвэр авиа", modeStrike: "Цохих ба татах", modeSustain: "Үлээх ба нумдах", modeMotion: "Хувирдаг давтамж",
      modeMix: "Долгион холих", modeSwitchAria: "Дууны бүлэг",
      mixExperimentsAria: "Холимог ба нийлмэл авианы туршилтууд",
      mixExperimentBeats: "Хоёр давтамж", mixExperimentHarmonics: "Өнгө бүтээх",
      mixExperimentNoise: "Шуугиан",
      harmonicPhase: "05 · Авиа бүтээх", noisePhase: "05 · Шуугиан судлах",
      harmonicChoose: "Гармоникуудыг нэмэх", harmonicDescription: "Нэг давтамжийн бүхэл тоон үржвэрүүдийг нийлүүлж шинэ авиа бүтээнэ.",
      harmonicPlay: "Тоглуулах", harmonicStop: "Зогсоох", harmonicBase: "Үндсэн давтамж",
      harmonicPresetsTitle: "Бэлэн найрлагууд", harmonicPure: "Цэвэр", harmonicOdd: "Сондгой",
      harmonicRich: "Олон гармоник", harmonicStrengths: "Гармоник бүрийн хүч", harmonicNotation: "f, 2f, 3f…",
      harmonicWaveTitle: "Нийлбэр долгион", harmonicWaveHint: "Гармоник нэмж, долгионы хэлбэр хэрхэн өөрчлөгдөхийг хараарай.",
      harmonicSpectrumTitle: "Гармоникийн найрлага", harmonicSpectrumHint: "Багана бүр f, 2f, 3f… давтамжийн хүчийг харуулна.",
      harmonicSpectrumFoot: "Үндсэн давтамжийг өөрчлөхөд бүх оргил хамт шилжинэ.",
      harmonicChallenge: "Үндсэн давтамжийг хэвээр үлдээгээд 3f, 5f гармоникуудыг нэм. Дууны өнгө хэрхэн өөрчлөгдөв?",
      harmonicLearnMore: "Гармоникууд дууны өнгийг хэрхэн бүтээдэг вэ?",
      harmonicLessonOne: "Үндсэн давтамж f дээр 2f, 3f, 4f… долгионуудыг нэмэхэд нийлбэр долгионы хэлбэр, дууны өнгө өөрчлөгдөнө.",
      harmonicLessonTwo: "Гармоник тус бүрийн хүчийг өөрчилж болно. Харин давтамж нь үндсэн давтамжийн бүхэл тоон үржвэр хэвээр байна.",
      harmonicReady: "Бэлэн. Авиа тоглуулах товчийг дарна уу.", harmonicStarting: "Авиа эхэлж байна…",
      harmonicPlaying: "Дуугарч байна. Гармоникийн хүчийг өөрчилж сонсоорой.",
      harmonicStopped: "Зогслоо. Өөр найрлага туршаарай.", harmonicUnsupported: "Энэ хөтөч загварчилсан авиа тоглуулах боломжгүй байна.",
      harmonicBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны тохиргоог шалгаад дахин оролдоно уу.",
      harmonicInvalid: "Үндсэн давтамжийг 120–1,000 Гц-ийн хооронд оруулна уу.",
      harmonicWaveAria: "Найман синус гармоникаар бүтсэн долгионы загвар",
      harmonicSpectrumAria: "Найман гармоникийн хүч болон давтамж",
      harmonicPresetsAria: "Гармоникийн бэлэн найрлага", harmonicSlidersAria: "Найман гармоникийн далайц",
      noiseChoose: "Шуугианы өнгө сонгох", noiseDescription: "Олон давтамжийн санамсаргүй хэлбэлзлийг сонсож, найрлагыг нь ажиглаарай.",
      noiseWhite: "Цагаан", noisePink: "Ягаан", noiseBrown: "Бор", noisePlay: "Тоглуулах", noiseStop: "Зогсоох",
      noiseColorDescription: {
        white: "Давтамжийн нэг герцийн зурвас бүрд ойролцоогоор ижил чадалтай.",
        pink: "Нам давтамж илүү хүчтэй; октав бүрийн чадал ойролцоогоор ижил.",
        brown: "Нам давтамжууд бүр ч хүчтэй давамгайлна."
      },
      noiseCutoff: "Өндөр давтамжийг шүүх", noiseCutoffHint: "Багасгахад дээд давтамж суларч, авиа бүдгэрнэ.",
      noiseSafety: "Шуугиан чанга сонсогдож болно. Ялангуяа чихэвчтэй бол багаас эхлээрэй.",
      noiseWaveTitle: "Шуугианы долгион", noiseWaveHint: "40 мсек үргэлжлэх санамсаргүй хэсгийн жишээ. Үелэхгүй.",
      noiseSpectrumTitle: "Давтамжийн тархалт", noiseSpectrumHint: "Нэг нэг оргил биш, олон давтамжийн ерөнхий чиг хандлага.",
      noiseSpectrumFoot: "Энэ нь хэмжилт биш, хүлээгдэх ерөнхий хэлбэр юм.",
      noiseChallenge: "Цагаан, ягаан, бор шуугианыг ижил хэмжээнд сонсоод харьцуул. Дараа нь шүүлтүүрийг багасга.",
      noiseLearnMore: "Шуугиан яагаад цэвэр авианаас өөр вэ?",
      noiseLessonOne: "Цэвэр авиа нэг давтамжтай. Харин шуугиан олон давтамжийн санамсаргүй хэлбэлзлээс бүтдэг тул тогтмол давтагдах үе байхгүй.",
      noiseLessonTwo: "Цагаан шуугианд давтамжийн нэг герцийн зурвас бүрийн чадал ойролцоогоор ижил. Ягаан, бор шуугианд нам давтамжууд харьцангуй хүчтэй. Дээд давтамжийг шүүхэд авиа бүдгэрнэ.",
      noiseReady: "Бэлэн. Шуугиан сонсох товчийг дарна уу.", noiseStarting: "Шуугиан эхэлж байна…",
      noisePlaying: "Шуугиан дуугарч байна. Өнгө, шүүлтүүрийг өөрчилж сонсоорой.",
      noiseStopped: "Зогслоо. Өөр шуугиан туршаарай.", noiseUnsupported: "Энэ хөтөч загварчилсан шуугиан тоглуулах боломжгүй байна.",
      noiseBlocked: "Шуугиан эхэлсэнгүй. Хөтчийн дууны тохиргоог шалгана уу.",
      noiseWaveAria: "Үелдэггүй шуугианы долгионы загвар",
      noiseSpectrumAria: "Өнгөт болон шүүсэн шуугианы давтамжийн хүлээгдэх тархалт",
      noiseChoicesAria: "Шуугианы өнгө сонгох",
      mixPhase: "05 · Хоёр авианы биение",
      mixChoose: "Хоёр авиа нийлүүлэх", mixDescription: "Ойролцоо хоёр давтамж нийлээд дууны чанга, сул нь ээлжлэн өөрчлөгдөнө.",
      mixPlay: "Тоглуулах", mixStop: "Зогсоох",
      mixBase: "Эхний давтамж", mixGap: "Давтамжийн зөрүү (Δf)",
      mixTryGap: "Туршиж үз:", mixZeroGap: "0 Гц", mixTwoGap: "2 Гц", mixFourGap: "4 Гц", mixTenGap: "10 Гц",
      mixTwoFrequencies: "Хоёр давтамж", mixBeatRate: "Чангарч, сулрах хурд", mixBeatUnit: "удаа/сек",
      mixWaveTitle: "Хоёр долгионы нийлбэр", mixWaveHint: "Том цонхонд дууны чанга, сулын хүрээ харагдана. + дарж томруулбал жинхэнэ хэлбэлзлийг харна.",
      mixWaveHintFine: "Цэнхэр шугам: хоёр долгионы жинхэнэ нийлбэр. Ногоон шугам: далайцын хүрээ.",
      mixSpectrumTitle: "Давтамжийн бүрэлдэхүүнүүд", mixSpectrumHint: "Чангарч, сулрах нь шинэ нам давтамж үүсгээгүй.",
      mixSpectrumFoot: "Спектрт зөвхөн анхныхаа хоёр давтамж харагдана.",
      mixSpectrumZeroFoot: "Зөрүү 0 байхад ижил хоёр давтамж спектрт нэг оргил болж нийлнэ.",
      mixZoomLabel: "Томруулах", mixPanLabel: "Шилжүүлэх", mixZoomValueAria: "Харагдах хугацаа",
      mixZoomOutAria: "Томруулалтыг багасгах", mixZoomInAria: "Долгионыг томруулах",
      mixWaveAria: "Хоёр синус долгионы нийлбэр ба цохилтын далайцын хээ",
      mixSpectrumAria: "Нэг эсвэл хоёр синус давтамжийн бүрэлдэхүүний идеал спектр",
      mixBaseSliderAria: "Эхний давтамжийн гулсуур", mixBaseInputAria: "Эхний давтамжийг герцээр оруулах",
      mixGapSliderAria: "Хоёр давтамжийн зөрүүг герцээр сонгох",
      mixGapPresetsAria: "Давтамжийн зөрүүний жишээ", mixPlotToolsAria: "Долгионы хугацааны хуваарь",
      mixLeftAria: "Өмнөх хугацааг харах", mixRightAria: "Дараах хугацааг харах",
      mixChallenge: "Зөрүүг 0, 2, 4, 10 Гц болгож сонсоод, чангарч сулрах хээ хэрхэн өөрчлөгдөхийг ажиглаарай.",
      mixLearnMore: "Хоёр авиа нийлээд яагаад чангарч, сулардаг вэ?",
      mixLessonOne: "Ойролцоо давтамжтай хоёр синус долгион зарим үед бие биеэ дэмжиж, зарим үед бие биеэ сулруулна. Дууны чанга, сул ээлжлэхийг биение буюу цохилт гэнэ.",
      mixLessonTwo: "Чангарч, сулрах хурд нь хоёр давтамжийн зөрүү: Δf = |f₂ − f₁|. Жишээ нь, 440 ба 444 Гц-д секундэд 4 удаа чангарч сонсогдоно. Спектрт харин 4 Гц-ийн гурав дахь авиа шинээр үүсэхгүй.",
      mixReady: "Бэлэн. Хоёр авиа тоглуулах товчийг дарна уу.", mixStarting: "Хоёр авиа эхэлж байна…",
      mixPlaying: "Авиа дуугарч байна. Зөрүүг өөрчилж чангарч, сулрах хурдыг сонсоорой.",
      mixStopped: "Зогслоо. Өөр давтамжийн зөрүү туршаарай.", mixHidden: "Хуудаснаас гарахад авиа зогслоо.",
      mixUnsupported: "Энэ хөтөч авиа тоглуулах боломжгүй байна.",
      mixBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгаад дахин оролдоно уу.",
      mixInvalid: "Эхний давтамжийг 120–1,000 Гц-ийн хооронд оруулна уу.",
      strikePhase: "02 · Загварчилсан дуу", strikeChoose: "Дууны загвар сонгох",
      pluck: "Татсан чавхдас", kick: "Басс бөмбөр", piano: "Төгөлдөр хуур", strikeGroupAria: "Цохилтын дууны загвар",
      strikeCaption: "Дарж сонсоод, дахин дарж давтаарай",
      strikePluckButton: "Татах", strikeKickButton: "Цохих", strikePianoButton: "Нот тоглуулах",
      strikePitch: "Нотын давтамж", strikePitchSliderAria: "Нотын давтамжийн гулсуур",
      strikePitchInputAria: "Нотын давтамжийг герцээр оруулах",
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
      strikeInvalid: "Нотын давтамжийг 110–880 Гц-ийн хооронд оруулна уу.",
      strikeDesc: {
        pluck: "Татаж тавьсан чавхдас хэлбэлзээд аажмаар намдана.",
        kick: "Бөмбөрийн цохилтын давтамж буурч, хэлбэлзэл нь намдана.",
        piano: "Алх цохиход өчүүхэн зөрүүтэй хэдэн чавхдас зэрэг хэлбэлзэж, эхэндээ хурц авиа үүсгэнэ."
      },
      sustainPhase: "03 · Үргэлжлэх авиа", sustainChoose: "Үргэлжлэх дуу сонгох",
      sustainFlute: "Лимбэ", sustainViolin: "Хийл", sustainMorin: "Морин хуур",
      sustainGroupAria: "Үргэлжлэх авианы загвар", sustainGestureTitle: "Дуугаргах арга",
      sustainGestureAria: "Дууг барих эсвэл товшиж асаах", sustainHold: "Дарж барих", sustainToggle: "Товшиж асаах",
      sustainPress: "Дарж дуугаргах", sustainPressing: "Дуугарч байна…", sustainPressCaption: "Дараад барина, тавихад аажмаар намдана.",
      sustainTogglePlay: "Тоглуулах", sustainToggleStop: "Зогсоох", sustainToggleCaption: "Дахин товшиж намдаана.",
      sustainPitch: "Нотын давтамж", sustainPitchSliderAria: "Нотын давтамжийн гулсуур",
      sustainPitchInputAria: "Нотын давтамжийг герцээр оруулах", sustainAttack: "Эхлэх хугацаа", sustainRelease: "Намдах хугацаа",
      sustainEnvelopeHelp: "Эхлэх хугацаа дараагийн нотод, намдах хугацаа тавихад үйлчилнэ.",
      sustainEnvelopeTitle: "Дууны хүч хугацаанд", sustainEnvelopeHint: "1.2 сек дараад тавьсан жишээ. Эхлэл, үргэлжлэх үе, намдалт.",
      sustainEnvelopeFoot: "Босоо шугам нь тавих мөч (1.2 сек).",
      sustainDetailTitle: "Долгион ба гармоникууд", sustainDetailHint: "20 мсек-ийн үелэх хэсэг. Амьсгаа, нумын зөөлөн шуугианыг энд зураагүй.",
      sustainWaveTitle: "Долгион", sustainSpectrumTitle: "Гармоникууд",
      sustainEnvelopeAria: "Дууг эхлүүлж, барьж, тавих үеийн далайцын загвар",
      sustainWaveAria: "20 мсек-ийн үргэлжлэх долгионы загвар",
      sustainSpectrumAria: "Найман гармоникийн харьцангуй хүч",
      sustainChallenge: "Ижил нот дээр лимбэ, хийл, морин хуурыг сонсож, эхлэл ба гармоникуудыг харьцуул.",
      sustainLearnMore: "Эдгээр дуу яагаад үргэлжилдэг вэ?",
      sustainLessonOne: "Лимбэ үлээх, хийл болон морин хуур нумдах үед хэлбэлзэлд энерги тасралтгүй өгөгдөнө. Татаж тавьсан чавхдас харин аажмаар намдана.",
      sustainLessonTwo: "Эдгээр нь гармоник, бага хэмжээний шуугианаар бүтээсэн хялбаршуулсан загвар. Жинхэнэ зэмсгийн их бие, нум болон амьсгалын нарийн хөдөлгөөнийг дуурайгаагүй.",
      sustainReady: "Бэлэн. Дарж барих эсвэл товшиж асаах аргыг сонгоорой.", sustainStarting: "Дууг эхлүүлж байна…",
      sustainPlayingHold: "Дуугарч байна. Гараа авахад намдана.", sustainPlayingToggle: "Дуугарч байна. Дахин товшиж намдаана.",
      sustainReleased: "Тавилаа. Дуу аажмаар намдаж байна.", sustainStopped: "Зогслоо. Өөр зэмсэг туршаарай.",
      sustainHidden: "Хуудаснаас гарахад авиа зогслоо.",
      sustainUnsupported: "Энэ хөтөч загварчилсан зэмсэг тоглуулах боломжгүй байна.",
      sustainBlocked: "Дуу эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгана уу.",
      sustainInvalid: "Нотын давтамжийг 110–880 Гц-ийн хооронд оруулна уу.",
      sustainDesc: {
        flute: "Нам гүм, цэвэрхэн өнгөтэй, бага зэрэг амьсгалын шуугиантай загвар.",
        violin: "Дээд гармоникууд баялаг, хурц өнгөтэй нумдсан чавхдасны загвар.",
        morin: "Сондгой гармоникууд нь тод, бараан өнгөтэй морин хуураас санаа авсан загвар."
      },
      motionPhase: "04 · Хувирдаг давтамж", motionChoose: "Хөдөлгөөнт дуу сонгох",
      theremin: "Теремин", siren: "Галын машины дохио",
      motionDesc: {
        theremin: "Гараа хөдөлгөж давтамж ба дууны хэмжээг өөрчил.",
        siren: "Ижил хоёр давтамжийн хооронд өөр өөр замаар шилжүүлж сонсоорой."
      },
      motionGroupAria: "Хөдөлгөөнт дууны төрөл", thereminHelp: "Талбар дээр дарж хөдөлгөнө: баруун тийш өндөр, дээш чанга дуугарна. Гараа авахад зогсоно.",
      thereminTimbreLabel: "Дууны өнгө", thereminTimbresAria: "Тереминий дууны өнгө сонгох",
      timbrePure: "Цэвэр", timbreRich: "Баян", timbreVoice: "Хоолой шиг", timbreOvertones: "Дээд авиа",
      padLoud: "Чанга ↑", padStart: "Дараад хөдөлгөөрэй", padHigh: "Өндөр авиа →",
      padAria: "Теремин тоглох талбар", thereminKeyboardHelp: "Гарын товчлуураар: сумаар хөдөлгөж, Space/Enter-ээр дууг асааж эсвэл зогсооно. Escape зогсооно.",
      sirenPatternAria: "Давтамжийн замнал", sirenTwoTone: "Огцом", sirenSineSweep: "Аажим",
      sirenPitchSweep: "Шугаман",
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
      motionPitchSirenPitch: "Хагас тоноор жигд өөрчлөгдөнө. Логарифм графикт шулуун харагдана.",
      motionPitchSirenSine: "Синусоид замналын захад удаан, дунд хэсэгт хурдан өөрчлөгдөнө.",
      motionPitchScale: "Логарифм давтамж · 120–1600 Гц", motionPitchAria: "Хугацаанд өөрчлөгдөх давтамжийн загвар",
      motionDetailTitle: "Энэ мөчийн дохио", motionDetailHint: "Ижил үндсэн давтамжтай өөр өөр өнгийн долгион ба гармоникууд.",
      motionWaveTitle: "20 мсек-ийн долгион", motionComponentTitle: "Гармоникууд",
      motionWaveAria: "Тухайн мөчийн давтамж ба өнгийн 20 мсек долгион", motionComponentAria: "Энэ мөчийн гармоникийн бүрэлдэхүүн",
      motionChallenge: {
        theremin: "Дууны хэмжээг өөрчлөхгүйгээр зүүн, баруун тийш хөдөлгө. Долгионы үе хэрхэн өөрчлөгдөв?",
        siren: "Хоёр захын давтамж, хурдыг өөрчлөхгүйгээр гурван замналыг сонс. Ямар ялгаа байна вэ?"
      },
      motionLearnMore: "Давтамж өөрчлөгдөхөд яагаад авиа өөр сонсогддог вэ?",
      motionLessonOne: "Баруун тийш хөдөлгөхөд давтамж өсөж, дээш хөдөлгөхөд авиа чангарна. Тереминий дууны өнгийг солиход үндсэн давтамж хэвээр боловч гармоникуудын найрлага өөрчлөгдөнө.",
      motionLessonTwo: "Ижил хоёр давтамжийг гурван замаар холбож болно. Огцом замналд хоёр авиа шууд солигдоно. Аажим замнал нь синусоид хэлбэрээр өсөж буурч, захын цэгүүддээ удааширна. Шугаман замналд авиа хагас тоноор жигд өөрчлөгдөж, логарифм графикт шулуун харагдана.",
      desc: {
        sine: "Нэг үндсэн давтамжтай жигд хэлбэлзэл.",
        triangle: "Дээд сондгой гармоникууд нь сул.",
        square: "Сондгой гармоникууд нь хүчтэй.",
        sawtooth: "Олон гармониктой, баялаг өнгөтэй."
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
    sustainKind: "flute",
    sustainGesture: "hold",
    sustainPitch: 440,
    sustainSnap: false,
    sustainAttack: sustainModel.defaults("flute").attack,
    sustainRelease: sustainModel.defaults("flute").release,
    sustainVolume: 40,
    sustainPlaying: false,
    sustainStatus: "sustainReady",
    sustainError: false,
    motionKind: "theremin",
    motionTimbre: "pure",
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
    sirenVolume: 40,
    mixBase: 440,
    mixGap: 4,
    mixVolume: 40,
    mixWindowStart: 0,
    mixWindowSpan: 1,
    mixPlaying: false,
    mixStatus: "mixReady",
    mixError: false,
    mixKind: "beats",
    harmonicBase: 220,
    harmonicPartials: harmonicModel.preset("pure"),
    harmonicPreset: "pure",
    harmonicVolume: 35,
    harmonicPlaying: false,
    harmonicStatus: "harmonicReady",
    harmonicError: false,
    noiseColor: "white",
    noiseCutoff: 8000,
    noiseVolume: 25,
    noisePlaying: false,
    noiseStatus: "noiseReady",
    noiseError: false
  };
  const text = key => messages[state.language][key];
  const frequencyText = hz => Number(hz.toFixed(2)).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const hzText = hz => frequencyText(hz) + " " + text("unitHz");
  const kHzText = (hz, oneDecimal = false) =>
    (oneDecimal ? (hz / 1000).toFixed(1) : frequencyText(hz / 1000)) + " " + text("unitKHz");
  const secondsText = seconds => frequencyText(seconds) + " " + text("unitSeconds");
  const secondsFixedText = seconds => seconds.toFixed(2) + " " + text("unitSeconds");
  const millisecondsText = ms => frequencyText(ms) + " " + text("unitMilliseconds");
  // More headroom for small built-in speakers; still bounded below full-scale output.
  // Four simultaneous triggered voices have a total worst-case gain below 1.
  const maxGain = Object.freeze({ tone: 0.30, transient: 0.21, sustain: 0.22, motion: 0.24,
    beatVoice: 0.12, harmonics: 0.24, noise: 0.20 });
  const MIX_MIN_VIEW_SECONDS = 0.002;
  const MIX_MAX_VIEW_SECONDS = 4;
  const MIX_ZOOM_FACTOR = 4;

  class ToneEngine {
    constructor() {
      this.context = null;
      this.output = null;
      this.currentVoice = null;
      this.voices = new Set();
      this.generation = 0;
    }

    gainForVolume() {
      return maxGain.tone * state.volume / 100;
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
      gain.connect(this.output);
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
      if (!this.context) {
        this.context = new AudioContextClass();
        this.output = this.context.createGain();
        this.output.connect(this.context.destination);
      }
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
      gain.gain.setValueAtTime(maxGain.transient * state.strikeStrength / 100, now);
      source.connect(gain);
      gain.connect(this.contextOwner.output);

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

  class SustainEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentVoice = null;
      this.generation = 0;
      this.noiseBuffer = null;
    }

    makeNoiseBuffer(context) {
      if (this.noiseBuffer && this.noiseBuffer.sampleRate === context.sampleRate) return this.noiseBuffer;
      const count = Math.round(context.sampleRate);
      const buffer = context.createBuffer(1, count, context.sampleRate);
      const samples = buffer.getChannelData(0);
      let seed = 0x518c3f27;
      for (let i = 0; i < count; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        samples[i] = (seed / 0x80000000 - 1) * 0.7;
      }
      this.noiseBuffer = buffer;
      return buffer;
    }

    volumeGain() {
      return maxGain.sustain * state.sustainVolume / 100;
    }

    // Piecewise Web Audio ramps approximate the same smoothstep curve as the plot.
    ramp(param, startLevel, endLevel, startTime, duration) {
      param.cancelScheduledValues(startTime);
      param.setValueAtTime(startLevel, startTime);
      for (let i = 1; i <= 12; i++) {
        const fraction = i / 12;
        const value = startLevel + (endLevel - startLevel) * sustainModel.smoothstep(fraction);
        param.linearRampToValueAtTime(value, startTime + duration * fraction);
      }
    }

    fadeAndStop(voice, immediate, duration = .05) {
      const now = this.contextOwner.context.currentTime;
      if (voice.stopping && !immediate) return;
      if (voice.stopping && immediate) {
        voice.envelope.gain.cancelScheduledValues(now);
        voice.envelope.gain.setValueAtTime(0, now);
        return;
      }
      voice.stopping = true;
      const held = Math.max(0, now - voice.startedAt);
      const level = sustainModel.attackLevelAt(held, voice.attack);
      if (immediate) {
        voice.envelope.gain.cancelScheduledValues(now);
        voice.envelope.gain.setValueAtTime(0, now);
      } else this.ramp(voice.envelope.gain, level, 0, now, duration);
      const stopAt = now + (immediate ? .002 : duration + .025);
      try { voice.oscillator.stop(stopAt); } catch (_) { /* May already be scheduled. */ }
      try { voice.noise.stop(stopAt); } catch (_) { /* May already be scheduled. */ }
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "sustain") return false;
      sustainModel.validate(state.sustainKind, state.sustainPitch,
        state.sustainAttack, state.sustainRelease);
      for (const voice of this.voices) this.fadeAndStop(voice, false);
      while (this.voices.size >= 2) {
        const oldest = this.voices.values().next().value;
        this.fadeAndStop(oldest, true);
        this.voices.delete(oldest);
      }
      const now = context.currentTime;
      const partials = sustainModel.partials(state.sustainKind);
      const oscillator = context.createOscillator();
      const real = new Float32Array(partials.length + 1);
      const imag = new Float32Array([0, ...partials]);
      oscillator.setPeriodicWave(context.createPeriodicWave(real, imag));
      oscillator.frequency.setValueAtTime(state.sustainPitch, now);
      const envelope = context.createGain();
      const volume = context.createGain();
      const defaults = sustainModel.defaults(state.sustainKind);
      volume.gain.setValueAtTime(this.volumeGain(), now);
      envelope.gain.setValueAtTime(0, now);
      this.ramp(envelope.gain, 0, 1, now, state.sustainAttack);
      oscillator.connect(envelope);

      // Gentle unpitched breath/bow texture, deliberately quieter than the tone.
      const noise = context.createBufferSource();
      noise.buffer = this.makeNoiseBuffer(context);
      noise.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(defaults.cutoff, now);
      const noiseGain = context.createGain();
      noiseGain.gain.setValueAtTime(defaults.noise, now);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(envelope);
      envelope.connect(volume);
      volume.connect(this.contextOwner.output);
      const voice = { oscillator, noise, noiseGain, filter, envelope, volume,
        startedAt: now, attack: state.sustainAttack, stopping: false };
      this.voices.add(voice);
      oscillator.onended = () => {
        for (const node of [oscillator, noise, noiseGain, filter, envelope, volume]) node.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      oscillator.start(now);
      noise.start(now);
      this.currentVoice = voice;
      return { context, startedAt: now };
    }

    release() {
      ++this.generation; // A quick press-and-release also cancels an async start.
      if (!this.currentVoice) return;
      this.fadeAndStop(this.currentVoice, false, state.sustainRelease);
      this.currentVoice = null;
    }

    update() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      this.currentVoice.oscillator.frequency.setTargetAtTime(state.sustainPitch, now, .018);
      this.currentVoice.volume.gain.setTargetAtTime(this.volumeGain(), now, .015);
    }

    stop(immediate = false) {
      ++this.generation;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
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
      if (state.motionKind === "theremin" && state.motionTimbre !== "pure") {
        const partials = motionModel.timbrePartials(state.motionTimbre);
        const real = new Float32Array(partials.length + 1);
        const imag = new Float32Array([0, ...partials]);
        oscillator.setPeriodicWave(context.createPeriodicWave(real, imag));
      }
      oscillator.frequency.setValueAtTime(state.motionHz, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(maxGain.motion * state.motionLevel, now + 0.035);
      oscillator.connect(gain);
      gain.connect(this.contextOwner.output);
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
      gain.setTargetAtTime(maxGain.motion * state.motionLevel, now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
    }
  }

  class BeatsEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentPair = null;
      this.generation = 0;
    }

    gainForVolume() {
      // Two simultaneous oscillators: combined steady-state peak stays at or below 0.24.
      return maxGain.beatVoice * state.mixVolume / 100;
    }

    fadeAndStop(pair, immediate) {
      const now = this.contextOwner.context.currentTime;
      const gain = pair.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      if (pair.stopping) return;
      pair.stopping = true;
      for (const oscillator of pair.oscillators) {
        try { oscillator.stop(now + (immediate ? 0.002 : 0.09)); }
        catch (_) { /* The oscillator may already have stopped. */ }
      }
    }

    createSyncedPair(context) {
      const now = context.currentTime;
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.gainForVolume(), now + 0.035);
      gain.connect(this.contextOwner.output);
      const pair = { oscillators: [], gain, stopping: false, ended: 0 };
      for (const hz of beatsModel.frequencies({ baseHz: state.mixBase, gapHz: state.mixGap })) {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(hz, now);
        oscillator.connect(gain);
        oscillator.onended = () => {
          oscillator.disconnect();
          pair.ended++;
          if (pair.ended === 2) {
            gain.disconnect();
            this.voices.delete(pair);
            if (this.currentPair === pair) this.currentPair = null;
          }
        };
        pair.oscillators.push(oscillator);
      }
      this.voices.add(pair);
      this.currentPair = pair;
      for (const oscillator of pair.oscillators) oscillator.start(now);
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "mix") return false;
      for (const pair of this.voices) this.fadeAndStop(pair, false);
      this.createSyncedPair(context);
      return true;
    }

    resyncAtZeroGap() {
      if (!this.currentPair) return;
      // Oscillators retain their relative phase after a pitch change. If the
      // gap reaches zero, that phase could freeze at near-perfect cancellation.
      // Start an aligned pair so 0 Hz difference always means a steady tone.
      const oldPair = this.currentPair;
      const context = this.contextOwner.context;
      this.createSyncedPair(context);
      const now = context.currentTime;
      const gain = oldPair.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(0, now, 0.006);
      oldPair.stopping = true;
      for (const oscillator of oldPair.oscillators) {
        try { oscillator.stop(now + 0.07); }
        catch (_) { /* The old pair may already have ended. */ }
      }
    }

    update() {
      if (!this.currentPair) return;
      const now = this.contextOwner.context.currentTime;
      const frequencies = beatsModel.frequencies({ baseHz: state.mixBase, gapHz: state.mixGap });
      this.currentPair.oscillators.forEach((oscillator, index) => {
        oscillator.frequency.setTargetAtTime(frequencies[index], now, 0.018);
      });
      const gain = this.currentPair.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(this.gainForVolume(), now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const pair of this.voices) this.fadeAndStop(pair, immediate);
      this.currentPair = null;
    }
  }

  class HarmonicEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentVoice = null;
      this.generation = 0;
    }

    gainForVolume() { return maxGain.harmonics * state.harmonicVolume / 100; }

    fadeAndStop(voice, immediate = false) {
      const now = this.contextOwner.context.currentTime;
      const gain = voice.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      if (voice.stopping) return;
      voice.stopping = true;
      try { voice.oscillator.stop(now + (immediate ? 0.002 : 0.09)); }
      catch (_) { /* A replaced sound might already be ending. */ }
    }

    createVoice(context) {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const coefficients = harmonicModel.periodicCoefficients(state.harmonicPartials);
      oscillator.setPeriodicWave(context.createPeriodicWave(coefficients.real, coefficients.imag));
      oscillator.frequency.setValueAtTime(state.harmonicBase, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.gainForVolume(), now + 0.035);
      oscillator.connect(gain);
      gain.connect(this.contextOwner.output);
      const voice = { oscillator, gain, stopping: false };
      this.voices.add(voice);
      this.currentVoice = voice;
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      oscillator.start(now);
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "mix" || state.mixKind !== "harmonics") return false;
      this.createVoice(context);
      return true;
    }

    changeMixture() {
      if (!this.currentVoice) return;
      const previous = this.currentVoice;
      this.createVoice(this.contextOwner.context);
      this.fadeAndStop(previous);
      while (this.voices.size > 3) {
        const oldest = this.voices.values().next().value;
        this.fadeAndStop(oldest, true);
        this.voices.delete(oldest);
      }
    }

    update() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      this.currentVoice.oscillator.frequency.setTargetAtTime(state.harmonicBase, now, 0.018);
      const gain = this.currentVoice.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(this.gainForVolume(), now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
    }
  }

  class NoiseEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentVoice = null;
      this.generation = 0;
      this.buffers = new Map();
    }

    gainForVolume() { return maxGain.noise * state.noiseVolume / 100; }

    getBuffer(context) {
      const key = state.noiseColor + ":" + context.sampleRate;
      if (this.buffers.has(key)) return this.buffers.get(key);
      const samples = noiseModel.makeSamples(state.noiseColor, context.sampleRate, 2);
      const buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.getChannelData(0).set(samples);
      this.buffers.set(key, buffer);
      return buffer;
    }

    fadeAndStop(voice, immediate = false) {
      const now = this.contextOwner.context.currentTime;
      const gain = voice.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      if (voice.stopping) return;
      voice.stopping = true;
      try { voice.source.stop(now + (immediate ? 0.002 : 0.09)); }
      catch (_) { /* A replaced buffer might already be ending. */ }
    }

    createVoice(context) {
      const now = context.currentTime;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = this.getBuffer(context);
      source.loop = true;
      filter.type = "lowpass";
      filter.Q.setValueAtTime(Math.SQRT1_2, now);
      filter.frequency.setValueAtTime(state.noiseCutoff, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.gainForVolume(), now + 0.035);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.contextOwner.output);
      const voice = { source, filter, gain, stopping: false };
      this.voices.add(voice);
      this.currentVoice = voice;
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      source.start(now);
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "mix" || state.mixKind !== "noise") return false;
      this.createVoice(context);
      return true;
    }

    changeColor() {
      if (!this.currentVoice) return;
      const previous = this.currentVoice;
      this.createVoice(this.contextOwner.context);
      this.fadeAndStop(previous);
      while (this.voices.size > 3) {
        const oldest = this.voices.values().next().value;
        this.fadeAndStop(oldest, true);
        this.voices.delete(oldest);
      }
    }

    update() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      this.currentVoice.filter.frequency.setTargetAtTime(state.noiseCutoff, now, 0.025);
      const gain = this.currentVoice.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(this.gainForVolume(), now, 0.012);
    }

    stop(immediate = false) {
      this.generation++;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
      this.currentVoice = null;
    }
  }

  const audio = new ToneEngine();
  const transientAudio = new TransientEngine(audio);
  const sustainAudio = new SustainEngine(audio);
  const motionAudio = new MotionEngine(audio);
  const mixAudio = new BeatsEngine(audio);
  const harmonicAudio = new HarmonicEngine(audio);
  const noiseAudio = new NoiseEngine(audio);
  const recorder = new recorderModel.Recorder(audio, window.AudioWorkletNode);
  let recordStatusKey = "recordReady";
  let recordError = false;
  let recordUrl = null;
  let showRecordResult = false;
  let saveWhenDone = false;
  let recordFrame = null;

  function stopRecordFrame() {
    if (recordFrame !== null) window.cancelAnimationFrame(recordFrame);
    recordFrame = null;
  }

  function renderRecordControls() {
    const active = recorder.state === "recording";
    const busy = recorder.state === "starting" || recorder.state === "stopping";
    const button = $("recordButton");
    button.disabled = busy;
    button.classList.toggle("recording", active);
    button.setAttribute("aria-pressed", String(active));
    const action = text(active ? "recordStopAria" : "recordStartAria");
    button.setAttribute("aria-label", action);
    button.title = action;
    $("recordSymbol").textContent = active ? "⬇" : "●";
    $("recordButtonLabel").textContent = text(active ? "recordStop" : "recordStart");
    $("recordTimer").hidden = !active;
    $("recordTimer").textContent = recorder.elapsed.toFixed(1) + "/" + recorderModel.MAX_SECONDS;
    $("recordStatus").textContent = text(recordStatusKey);
    $("recordStatus").classList.toggle("error", recordError);
    $("recordStatus").classList.toggle("sr-only", !recordError);
    $("recordResult").hidden = !showRecordResult;
  }

  function followRecording() {
    if (recorder.state !== "recording") return;
    renderRecordControls();
    recordFrame = window.requestAnimationFrame(followRecording);
  }

  function stopRecording(save = false) {
    if (recorder.state === "recording") saveWhenDone = save;
    if (!recorder.stop()) return;
    stopRecordFrame();
    recordStatusKey = recorder.state === "stopping" ? "recordSaving" : "recordReady";
    renderRecordControls();
  }

  recorder.onDone = (bytes, duration) => {
    stopRecordFrame();
    const download = saveWhenDone || duration >= recorderModel.MAX_SECONDS - 0.05;
    saveWhenDone = false;
    if (bytes && bytes.length > 44) {
      if (recordUrl) URL.revokeObjectURL(recordUrl);
      recordUrl = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
      $("recordPreview").src = recordUrl;
      $("recordDownload").href = recordUrl;
      $("recordDownload").download = "sound-lab-" +
        new Date().toISOString().slice(0, 19).replace(/:/g, "-") + ".wav";
      recordStatusKey = "recordSaved";
      showRecordResult = true;
    } else {
      recordStatusKey = "recordEmpty";
      showRecordResult = false;
    }
    recordError = false;
    renderRecordControls();
    // The action is the child's Stop/Save press. The visible link remains as a fallback
    // when a browser blocks a download begun after the worklet's async finalization.
    if (download && bytes && bytes.length > 44) $("recordDownload").click();
  };
  recorder.onError = () => {
    stopRecordFrame();
    saveWhenDone = false;
    recordStatusKey = "recordError";
    recordError = true;
    showRecordResult = false;
    renderRecordControls();
  };

  async function toggleRecording() {
    if (recorder.state === "recording") { stopRecording(true); return; }
    if (recorder.state !== "idle") return;
    showRecordResult = false;
    saveWhenDone = false;
    recordStatusKey = "recordPreparing";
    recordError = false;
    renderRecordControls();
    try {
      const started = await recorder.start();
      if (!started) { recordStatusKey = "recordReady"; renderRecordControls(); return; }
      $("recordPreview").pause();
      recordStatusKey = "recordRecording";
      renderRecordControls();
      followRecording();
    } catch (error) {
      recordStatusKey = error.message === "unsupported" ? "recordUnsupported" : "recordError";
      recordError = true;
      renderRecordControls();
    }
  }

  let motionFrame = null;
  let motionStartedAt = 0;
  let motionLastDraw = -1;
  let motionPointerId = null;
  let sustainPointerId = null;
  let sustainKeyboardHeld = false;
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

  function setSustainStatus(status, error = false) {
    state.sustainStatus = status;
    state.sustainError = error;
    $("sustainStatus").textContent = text(status);
    $("sustainStatus").classList.toggle("error", error);
  }

  function setMotionStatus(status, error = false) {
    state.motionStatus = status;
    state.motionError = error;
    $("motionStatus").textContent = text(status);
    $("motionStatus").classList.toggle("error", error);
  }

  function setMixStatus(status, error = false) {
    state.mixStatus = status;
    state.mixError = error;
    $("mixStatus").textContent = text(status);
    $("mixStatus").classList.toggle("error", error);
  }

  function setHarmonicStatus(status, error = false) {
    state.harmonicStatus = status;
    state.harmonicError = error;
    $("harmonicStatus").textContent = text(status);
    $("harmonicStatus").classList.toggle("error", error);
  }

  function setNoiseStatus(status, error = false) {
    state.noiseStatus = status;
    state.noiseError = error;
    $("noiseStatus").textContent = text(status);
    $("noiseStatus").classList.toggle("error", error);
  }

  function renderHarmonicControls() {
    $("harmonicBaseSlider").value = String(state.harmonicBase);
    $("harmonicBaseInput").value = String(state.harmonicBase);
    const note = model.nearestNote(state.harmonicBase);
    $("harmonicNote").textContent = note.english + " · " + note.mongolian;
    $("harmonicWaveBadge").textContent = "f = " + hzText(state.harmonicBase);
    $("harmonicSpectrumBadge").textContent = harmonicModel.COUNT + " × f";
    $("harmonicVolume").value = String(state.harmonicVolume);
    $("harmonicVolumeValue").textContent = state.harmonicVolume + "%";
    for (let i = 0; i < harmonicModel.COUNT; i++) {
      const strength = Math.round(state.harmonicPartials[i] * 100);
      $("harmonicLevel" + (i + 1)).value = String(strength);
      $("harmonicLevelValue" + (i + 1)).textContent = strength + "%";
    }
    document.querySelectorAll("[data-harmonic-preset]").forEach(button => {
      const selected = state.harmonicPreset === button.dataset.harmonicPreset;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("harmonicButton").classList.toggle("playing", state.harmonicPlaying);
    $("harmonicButton").setAttribute("aria-pressed", String(state.harmonicPlaying));
    $("harmonicPlayIcon").textContent = state.harmonicPlaying ? "■" : "▶";
    $("harmonicPlayLabel").textContent = text(state.harmonicPlaying ? "harmonicStop" : "harmonicPlay");
    $("harmonicPlayCaption").textContent = text(state.harmonicPlaying ? "stopCaption" : "playCaption");
  }

  function renderNoiseControls() {
    document.querySelectorAll("[data-noise-color]").forEach(button => {
      const selected = state.noiseColor === button.dataset.noiseColor;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("noiseColorDescription").textContent = text("noiseColorDescription")[state.noiseColor];
    $("noiseSpectrumBadge").textContent = text("noise" + state.noiseColor[0].toUpperCase() + state.noiseColor.slice(1));
    $("noiseWaveBadge").textContent = millisecondsText(40);
    $("noiseCutoff").value = String(state.noiseCutoff);
    $("noiseCutoffValue").textContent = hzText(state.noiseCutoff);
    $("noiseVolume").value = String(state.noiseVolume);
    $("noiseVolumeValue").textContent = state.noiseVolume + "%";
    $("noiseButton").classList.toggle("playing", state.noisePlaying);
    $("noiseButton").setAttribute("aria-pressed", String(state.noisePlaying));
    $("noisePlayIcon").textContent = state.noisePlaying ? "■" : "▶";
    $("noisePlayLabel").textContent = text(state.noisePlaying ? "noiseStop" : "noisePlay");
    $("noisePlayCaption").textContent = text(state.noisePlaying ? "stopCaption" : "playCaption");
  }

  function stopHarmonicSound(immediate = false, message = "harmonicStopped") {
    harmonicAudio.stop(immediate);
    state.harmonicPlaying = false;
    setHarmonicStatus(message);
    renderHarmonicControls();
  }

  function stopNoiseSound(immediate = false, message = "noiseStopped") {
    noiseAudio.stop(immediate);
    state.noisePlaying = false;
    setNoiseStatus(message);
    renderNoiseControls();
  }

  async function toggleHarmonicSound() {
    if (state.harmonicPlaying) { stopHarmonicSound(); return; }
    if (state.mode !== "mix" || state.mixKind !== "harmonics") return;
    setHarmonicStatus("harmonicStarting");
    try {
      if (await harmonicAudio.start()) {
        state.harmonicPlaying = true;
        setHarmonicStatus("harmonicPlaying");
        renderHarmonicControls();
      }
    } catch (error) {
      stopHarmonicSound(true, error.message === "unsupported" ? "harmonicUnsupported" : "harmonicBlocked");
      setHarmonicStatus(state.harmonicStatus, true);
    }
  }

  async function toggleNoiseSound() {
    if (state.noisePlaying) { stopNoiseSound(); return; }
    if (state.mode !== "mix" || state.mixKind !== "noise") return;
    setNoiseStatus("noiseStarting");
    try {
      if (await noiseAudio.start()) {
        state.noisePlaying = true;
        setNoiseStatus("noisePlaying");
        renderNoiseControls();
      }
    } catch (error) {
      stopNoiseSound(true, error.message === "unsupported" ? "noiseUnsupported" : "noiseBlocked");
      setNoiseStatus(state.noiseStatus, true);
    }
  }

  function setHarmonicBase(input) {
    const hz = Number(input);
    if (!Number.isFinite(hz) || hz < harmonicModel.MIN_HZ || hz > harmonicModel.MAX_HZ) {
      setHarmonicStatus("harmonicInvalid", true);
      renderHarmonicControls();
      return;
    }
    state.harmonicBase = hz;
    if (state.harmonicError) setHarmonicStatus(state.harmonicPlaying ? "harmonicPlaying" : "harmonicReady");
    harmonicAudio.update();
    renderHarmonicControls();
    if (state.mode === "mix" && state.mixKind === "harmonics") drawHarmonicPlots();
  }

  function setHarmonicPreset(name) {
    if (!Object.hasOwn(harmonicModel.PRESETS, name)) return;
    state.harmonicPartials = harmonicModel.preset(name);
    state.harmonicPreset = name;
    harmonicAudio.changeMixture();
    renderHarmonicControls();
    if (state.mode === "mix" && state.mixKind === "harmonics") drawHarmonicPlots();
  }

  function setHarmonicLevel(number, percent) {
    const index = Number(number) - 1;
    const level = Number(percent);
    if (!Number.isInteger(index) || index < 0 || index >= harmonicModel.COUNT || !Number.isFinite(level)) return;
    state.harmonicPartials[index] = Math.max(index === 0 ? 0.1 : 0, Math.min(1, level / 100));
    state.harmonicPreset = "custom";
    harmonicAudio.changeMixture();
    renderHarmonicControls();
    if (state.mode === "mix" && state.mixKind === "harmonics") drawHarmonicPlots();
  }

  function resetHarmonics() {
    stopHarmonicSound();
    state.harmonicBase = 220;
    state.harmonicPartials = harmonicModel.preset("pure");
    state.harmonicPreset = "pure";
    state.harmonicVolume = 35;
    setHarmonicStatus("harmonicReady");
    renderHarmonicControls();
    drawPlots();
  }

  function resetNoise() {
    stopNoiseSound();
    state.noiseColor = "white";
    state.noiseCutoff = 8000;
    state.noiseVolume = 25;
    setNoiseStatus("noiseReady");
    renderNoiseControls();
    drawPlots();
  }

  function mixRecipe() {
    return { baseHz: state.mixBase, gapHz: state.mixGap };
  }

  function mixBeatsText() {
    return frequencyText(state.mixGap) + " " + text("mixBeatUnit");
  }

  function renderMixView() {
    const span = state.mixWindowSpan, start = state.mixWindowStart;
    $("mixZoomValue").textContent = mixTimeLabel(span, span);
    $("mixZoomOut").disabled = span >= MIX_MAX_VIEW_SECONDS - 1e-9;
    $("mixZoomIn").disabled = span <= MIX_MIN_VIEW_SECONDS + 1e-9;
    $("mixViewLeft").disabled = start <= 1e-9;
    $("mixViewRight").disabled = start + span >= MIX_MAX_VIEW_SECONDS - 1e-9;
  }

  function renderMixControls() {
    $("mixBaseSlider").value = String(state.mixBase);
    $("mixBaseInput").value = String(state.mixBase);
    $("mixBaseInput").setAttribute("aria-valuetext", hzText(state.mixBase));
    $("mixBaseValue").textContent = hzText(state.mixBase);
    $("mixGapSlider").value = String(state.mixGap);
    $("mixGapValue").textContent = hzText(state.mixGap);
    const [first, second] = beatsModel.frequencies(mixRecipe());
    $("mixPairValue").textContent = frequencyText(first) + " + " + hzText(second);
    $("mixBeatValue").textContent = mixBeatsText();
    $("mixWaveBadge").textContent = mixBeatsText();
    $("mixSpectrumBadge").textContent = frequencyText(first) + " + " + hzText(second);
    $("mixSpectrumFoot").textContent = text(state.mixGap === 0 ? "mixSpectrumZeroFoot" : "mixSpectrumFoot");
    $("mixVolume").value = String(state.mixVolume);
    $("mixVolumeValue").textContent = state.mixVolume + "%";
    $("mixButton").classList.toggle("playing", state.mixPlaying);
    $("mixButton").setAttribute("aria-pressed", String(state.mixPlaying));
    $("mixPlayIcon").textContent = state.mixPlaying ? "■" : "▶";
    $("mixPlayLabel").textContent = text(state.mixPlaying ? "mixStop" : "mixPlay");
    $("mixPlayCaption").textContent = text(state.mixPlaying ? "stopCaption" : "playCaption");
    document.querySelectorAll("[data-mix-gap]").forEach(button => {
      const selected = Number(button.dataset.mixGap) === state.mixGap;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderMixView();
  }

  function stopMixSound(immediate = false, message = "mixStopped") {
    mixAudio.stop(immediate);
    state.mixPlaying = false;
    setMixStatus(message);
    renderMixControls();
  }

  async function toggleMixSound() {
    if (state.mixPlaying) { stopMixSound(); return; }
    if (state.mode !== "mix") return;
    setMixStatus("mixStarting");
    try {
      if (await mixAudio.start()) {
        state.mixPlaying = true;
        setMixStatus("mixPlaying");
        renderMixControls();
      }
    } catch (error) {
      stopMixSound(true, error.message === "unsupported" ? "mixUnsupported" : "mixBlocked");
      setMixStatus(state.mixStatus, true);
    }
  }

  function setMixBase(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < beatsModel.MIN_BASE_HZ || value > beatsModel.MAX_BASE_HZ) {
      setMixStatus("mixInvalid", true);
      renderMixControls();
      return;
    }
    state.mixBase = value;
    if (state.mixError) setMixStatus(state.mixPlaying ? "mixPlaying" : "mixReady");
    mixAudio.update();
    renderMixControls();
    if (state.mode === "mix") drawMixPlots();
  }

  function setMixGap(input) {
    const value = Number(input);
    if (!Number.isFinite(value)) return;
    const previousGap = state.mixGap;
    state.mixGap = Math.min(beatsModel.MAX_GAP_HZ, Math.max(beatsModel.MIN_GAP_HZ, value));
    if (state.mixPlaying && previousGap !== 0 && state.mixGap === 0) mixAudio.resyncAtZeroGap();
    else mixAudio.update();
    renderMixControls();
    if (state.mode === "mix") drawMixPlots();
  }

  function zoomMix(direction) {
    const span = state.mixWindowSpan;
    const next = direction > 0 ? Math.max(MIX_MIN_VIEW_SECONDS, span / MIX_ZOOM_FACTOR) :
      Math.min(MIX_MAX_VIEW_SECONDS, span * MIX_ZOOM_FACTOR);
    if (next === span) return;
    state.mixWindowSpan = next;
    // Preserve the left-hand time coordinate so successive zooms reveal the
    // same oscillations rather than unexpectedly jumping to a different phase.
    state.mixWindowStart = Math.min(state.mixWindowStart, MIX_MAX_VIEW_SECONDS - next);
    renderMixView();
    if (state.mode === "mix") drawMixWave();
  }

  function panMixWindow(direction) {
    const span = state.mixWindowSpan;
    state.mixWindowStart = Math.max(0, Math.min(MIX_MAX_VIEW_SECONDS - span,
      state.mixWindowStart + direction * span / 2));
    renderMixView();
    if (state.mode === "mix") drawMixWave();
  }

  function resetMix() {
    stopMixSound();
    state.mixBase = 440;
    state.mixGap = 4;
    state.mixVolume = 40;
    state.mixWindowStart = 0;
    state.mixWindowSpan = 1;
    setMixStatus("mixReady");
    renderMixControls();
    if (state.mode === "mix") drawMixPlots();
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
      "two-tone": "motionPitchSiren", "sine-sweep": "motionPitchSirenSine",
      "pitch-sweep": "motionPitchSirenPitch"
    };
    $("motionPitchSubtitle").textContent = text(isTheremin ? "motionPitchTheremin" :
      sirenHintKeys[state.sirenPattern]);
    $("motionChallengeText").textContent = text("motionChallenge")[state.motionKind];
    document.querySelectorAll("[data-motion]").forEach(button => {
      const active = button.dataset.motion === state.motionKind;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-theremin-timbre]").forEach(button => {
      const active = button.dataset.thereminTimbre === state.motionTimbre;
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

  function setMotionTimbre(timbre) {
    if (!motionModel.TIMBRES.includes(timbre) || timbre === state.motionTimbre) return;
    state.motionTimbre = timbre;
    if (state.motionPlaying && state.motionKind === "theremin") {
      // Crossfade one oscillator into the new harmonic color at the same pitch.
      motionAudio.start().catch(() => stopMotionSound(true, "motionBlocked"));
    }
    renderMotionControls();
    if (state.mode === "motion") drawMotionPlots();
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
    state.motionTimbre = "pure";
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
    const isSustain = state.mode === "sustain";
    const isMotion = state.mode === "motion";
    const isMix = state.mode === "mix";
    const isBeats = isMix && state.mixKind === "beats";
    const isHarmonics = isMix && state.mixKind === "harmonics";
    const isNoise = isMix && state.mixKind === "noise";
    $("pureWorkspace").hidden = isStrike || isSustain || isMotion || isMix;
    $("pureChallenge").hidden = isStrike || isSustain || isMotion || isMix;
    $("pureExplanation").hidden = isStrike || isSustain || isMotion || isMix;
    $("strikeWorkspace").hidden = !isStrike;
    $("strikeChallenge").hidden = !isStrike;
    $("strikeExplanation").hidden = !isStrike;
    $("sustainWorkspace").hidden = !isSustain;
    $("sustainChallenge").hidden = !isSustain;
    $("sustainExplanation").hidden = !isSustain;
    $("motionWorkspace").hidden = !isMotion;
    $("motionChallenge").hidden = !isMotion;
    $("motionExplanation").hidden = !isMotion;
    $("mixWorkspace").hidden = !isBeats;
    $("mixChallenge").hidden = !isBeats;
    $("mixExplanation").hidden = !isBeats;
    $("harmonicWorkspace").hidden = !isHarmonics;
    $("harmonicChallenge").hidden = !isHarmonics;
    $("harmonicExplanation").hidden = !isHarmonics;
    $("noiseWorkspace").hidden = !isNoise;
    $("noiseChallenge").hidden = !isNoise;
    $("noiseExplanation").hidden = !isNoise;
    document.querySelectorAll("[data-mix-kind]").forEach(button => {
      const selected = button.dataset.mixKind === state.mixKind;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    for (const [id, mode] of [["modePure", "pure"], ["modeStrike", "strike"], ["modeSustain", "sustain"],
      ["modeMotion", "motion"], ["modeMix", "mix"]]) {
      const selected = state.mode === mode;
      $(id).classList.toggle("active", selected);
      $(id).setAttribute("aria-pressed", String(selected));
    }
    $("pagePhase").textContent = text(isStrike ? "strikePhase" : isSustain ? "sustainPhase" : isMotion ? "motionPhase" :
      isHarmonics ? "harmonicPhase" : isNoise ? "noisePhase" : isMix ? "mixPhase" : "phase");
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
    $("sustainChoices").setAttribute("aria-label", text("sustainGroupAria"));
    $("sustainGestures").setAttribute("aria-label", text("sustainGestureAria"));
    $("sustainFrequencySlider").setAttribute("aria-label", text("sustainPitchSliderAria"));
    $("sustainFrequencyInput").setAttribute("aria-label", text("sustainPitchInputAria"));
    $("sustainEnvelopeCanvas").setAttribute("aria-label", text("sustainEnvelopeAria"));
    $("sustainWaveCanvas").setAttribute("aria-label", text("sustainWaveAria"));
    $("sustainSpectrumCanvas").setAttribute("aria-label", text("sustainSpectrumAria"));
    $("motionChoices").setAttribute("aria-label", text("motionGroupAria"));
    $("thereminTimbres").setAttribute("aria-label", text("thereminTimbresAria"));
    $("sirenPatterns").setAttribute("aria-label", text("sirenPatternAria"));
    $("thereminPad").setAttribute("aria-label", text("padAria"));
    $("motionPitchCanvas").setAttribute("aria-label", text("motionPitchAria"));
    $("motionWaveCanvas").setAttribute("aria-label", text("motionWaveAria"));
    $("motionSpectrumCanvas").setAttribute("aria-label", text("motionComponentAria"));
    $("mixWaveCanvas").setAttribute("aria-label", text("mixWaveAria"));
    $("mixSpectrumCanvas").setAttribute("aria-label", text("mixSpectrumAria"));
    $("mixBaseSlider").setAttribute("aria-label", text("mixBaseSliderAria"));
    $("mixBaseInput").setAttribute("aria-label", text("mixBaseInputAria"));
    $("mixGapSlider").setAttribute("aria-label", text("mixGapSliderAria"));
    $("mixGapPresets").setAttribute("aria-label", text("mixGapPresetsAria"));
    $("mixPlotTools").setAttribute("aria-label", text("mixPlotToolsAria"));
    for (const [id, key] of [["mixZoomOut", "mixZoomOutAria"], ["mixZoomIn", "mixZoomInAria"]]) {
      $(id).setAttribute("aria-label", text(key));
      $(id).setAttribute("title", text(key));
    }
    $("mixZoomValue").setAttribute("aria-label", text("mixZoomValueAria"));
    $("mixViewLeft").setAttribute("aria-label", text("mixLeftAria"));
    $("mixViewRight").setAttribute("aria-label", text("mixRightAria"));
    $("harmonicPresets").setAttribute("aria-label", text("harmonicPresetsAria"));
    $("harmonicSliders").setAttribute("aria-label", text("harmonicSlidersAria"));
    $("harmonicWaveCanvas").setAttribute("aria-label", text("harmonicWaveAria"));
    $("harmonicSpectrumCanvas").setAttribute("aria-label", text("harmonicSpectrumAria"));
    $("noiseChoices").setAttribute("aria-label", text("noiseChoicesAria"));
    $("noiseWaveCanvas").setAttribute("aria-label", text("noiseWaveAria"));
    $("noiseSpectrumCanvas").setAttribute("aria-label", text("noiseSpectrumAria"));
    document.querySelector(".note-presets").setAttribute("aria-label", text("presetsAria"));
    document.querySelector(".lang-group").setAttribute("aria-label", text("langGroupAria"));
    setStatus(state.status, state.error);
    setStrikeStatus(state.strikeStatus, state.strikeError);
    setSustainStatus(state.sustainStatus, state.sustainError);
    setMotionStatus(state.motionStatus, state.motionError);
    setMixStatus(state.mixStatus, state.mixError);
    setHarmonicStatus(state.harmonicStatus, state.harmonicError);
    setNoiseStatus(state.noiseStatus, state.noiseError);
    renderMode();
    renderStrikeControls();
    renderSustainControls();
    renderMotionControls();
    renderMixControls();
    renderHarmonicControls();
    renderNoiseControls();
    renderStrikeTime();
    renderRecordControls();
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
    $("strikePitchGroup").hidden = state.strikeKind === "kick";
    $("strikeDrumSizeGroup").hidden = state.strikeKind !== "kick";
    $("strikeDrumFrequencies").textContent =
      Math.round(transientModel.kickFrequency(0, state.strikeDrumSize)) + " → " +
      hzText(Math.round(transientModel.kickFrequency(3, state.strikeDrumSize)));
    $("strikeStrength").value = String(state.strikeStrength);
    $("strikeStrengthValue").textContent = state.strikeStrength + "%";
    $("strikeDecay").value = String(state.strikeDecay);
    $("strikeDecayValue").textContent = secondsText(state.strikeDecay);
    $("strikeDescription").textContent = text("strikeDesc")[state.strikeKind];
    $("strikeButtonLabel").textContent = text(state.strikeKind === "pluck" ? "strikePluckButton" :
      state.strikeKind === "piano" ? "strikePianoButton" : "strikeKickButton");
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

  function renderSustainControls() {
    $("sustainFrequencySlider").value = String(Math.round(sustainModel.hzToSlider(state.sustainPitch)));
    $("sustainFrequencyInput").value = String(Number(state.sustainPitch.toFixed(2)));
    const note = model.nearestNote(state.sustainPitch);
    const cents = 1200 * Math.log2(state.sustainPitch / note.frequency);
    $("sustainNote").textContent = (!state.sustainSnap && Math.abs(cents) >= .5 ? "≈ " : "") +
      note.english + " · " + note.mongolian;
    $("sustainSnap").checked = state.sustainSnap;
    $("sustainDescription").textContent = text("sustainDesc")[state.sustainKind];
    $("sustainAttack").value = String(state.sustainAttack);
    $("sustainAttackValue").textContent = secondsFixedText(state.sustainAttack);
    $("sustainRelease").value = String(state.sustainRelease);
    $("sustainReleaseValue").textContent = secondsFixedText(state.sustainRelease);
    $("sustainVolume").value = String(state.sustainVolume);
    $("sustainVolumeValue").textContent = state.sustainVolume + "%";
    $("sustainEnvelopeBadge").textContent = secondsFixedText(state.sustainAttack) + " / " +
      secondsFixedText(state.sustainRelease);
    $("sustainDetailBadge").textContent = hzText(state.sustainPitch);
    document.querySelectorAll("[data-sustain]").forEach(button => {
      const selected = button.dataset.sustain === state.sustainKind;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-sustain-gesture]").forEach(button => {
      const selected = button.dataset.sustainGesture === state.sustainGesture;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("sustainButton").classList.toggle("playing", state.sustainPlaying);
    $("sustainButton").setAttribute("aria-pressed", String(state.sustainPlaying));
    $("sustainPlayIcon").textContent = state.sustainPlaying ? "■" : "▶";
    $("sustainPlayLabel").textContent = text(state.sustainGesture === "hold" ?
      (state.sustainPlaying ? "sustainPressing" : "sustainPress") :
      (state.sustainPlaying ? "sustainToggleStop" : "sustainTogglePlay"));
    $("sustainPlayCaption").textContent = text(state.sustainGesture === "hold" ?
      "sustainPressCaption" : "sustainToggleCaption");
  }

  function stopSustainSound(immediate = false, status = "sustainStopped") {
    sustainAudio.stop(immediate);
    sustainPointerId = null;
    sustainKeyboardHeld = false;
    state.sustainPlaying = false;
    setSustainStatus(status);
    renderSustainControls();
  }

  function releaseSustainSound() {
    sustainAudio.release();
    state.sustainPlaying = false;
    setSustainStatus("sustainReleased");
    renderSustainControls();
  }

  async function startSustainSound() {
    if (state.mode !== "sustain" || state.sustainPlaying) return;
    setSustainStatus("sustainStarting");
    try {
      const info = await sustainAudio.start();
      if (!info) return;
      state.sustainPlaying = true;
      setSustainStatus(state.sustainGesture === "hold" ? "sustainPlayingHold" : "sustainPlayingToggle");
      renderSustainControls();
    } catch (error) {
      stopSustainSound(true, error.message === "unsupported" ? "sustainUnsupported" : "sustainBlocked");
      setSustainStatus(error.message === "unsupported" ? "sustainUnsupported" : "sustainBlocked", true);
    }
  }

  function selectSustainKind(kind) {
    if (!sustainModel.KINDS.includes(kind) || state.sustainKind === kind) return;
    stopSustainSound();
    state.sustainKind = kind;
    state.sustainAttack = sustainModel.defaults(kind).attack;
    state.sustainRelease = sustainModel.defaults(kind).release;
    setSustainStatus("sustainReady");
    renderSustainControls();
    drawPlots();
  }

  function setSustainPitch(value) {
    const hz = Number(value);
    if (!Number.isFinite(hz) || hz < sustainModel.MIN_HZ || hz > sustainModel.MAX_HZ) {
      setSustainStatus("sustainInvalid", true);
      renderSustainControls();
      return;
    }
    state.sustainPitch = state.sustainSnap ? model.snapFrequency(hz) : hz;
    sustainAudio.update();
    if (state.sustainStatus === "sustainInvalid") setSustainStatus("sustainReady");
    renderSustainControls();
    drawPlots();
  }

  function resetSustain() {
    stopSustainSound();
    state.sustainKind = "flute";
    state.sustainGesture = "hold";
    state.sustainPitch = 440;
    state.sustainSnap = false;
    state.sustainAttack = sustainModel.defaults("flute").attack;
    state.sustainRelease = sustainModel.defaults("flute").release;
    state.sustainVolume = 40;
    setSustainStatus("sustainReady");
    renderSustainControls();
    drawPlots();
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
    stopSustainSound(immediate, message === "hidden" ? "sustainHidden" : "sustainStopped");
    stopMotionSound(immediate, message === "hidden" ? "motionHidden" : "motionStopped");
    stopMixSound(immediate, message === "hidden" ? "mixHidden" : "mixStopped");
    stopHarmonicSound(immediate);
    stopNoiseSound(immediate);
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
    if (mode === state.mode || !["pure", "strike", "sustain", "motion", "mix"].includes(mode)) return;
    stopAllAudio(false);
    state.mode = mode;
    if (mode === "sustain") setSustainStatus("sustainReady");
    if (mode === "motion") setMotionStatus("motionReady");
    if (mode === "mix") setMixStatus("mixReady");
    renderTexts();
    drawPlots();
  }

  function selectMixKind(kind) {
    if (!["beats", "harmonics", "noise"].includes(kind) || kind === state.mixKind) return;
    stopAllAudio();
    state.mixKind = kind;
    if (kind === "beats") setMixStatus("mixReady");
    if (kind === "harmonics") setHarmonicStatus("harmonicReady");
    if (kind === "noise") setNoiseStatus("noiseReady");
    renderTexts();
    drawPlots();
  }

  function selectStrikeKind(kind) {
    if (!transientModel.KINDS.includes(kind) || kind === state.strikeKind) return;
    stopStrikeForEdit();
    state.strikeKind = kind;
    state.strikeDecay = kind === "pluck" ? 0.65 : kind === "piano" ? 0.8 : 0.30;
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
    const maxHz = state.strikeKind === "piano" ?
      Math.min(8000, Math.max(3000, state.strikePitch * 8.5)) :
      state.strikeKind === "pluck" ? Math.min(8000, Math.max(1200, state.strikePitch * 8.3)) : 600;
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

  function drawSustainEnvelope() {
    const { ctx, width, height } = plotContext($("sustainEnvelopeCanvas"));
    const left = 42, right = width - 16, top = 21, bottom = height - 31;
    const w = right - left, h = bottom - top;
    const span = sustainModel.EXAMPLE_HOLD + sustainModel.MAX_RELEASE + .2;
    const xAt = time => left + (time / span) * w;
    const yAt = level => bottom - level * h * .91;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const count = 360;
    ctx.fillStyle = "rgba(40, 150, 154, .12)";
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    for (let i = 0; i <= count; i++) {
      const time = span * i / count;
      ctx.lineTo(xAt(time), yAt(sustainModel.envelopeAt(time,
        state.sustainAttack, state.sustainRelease)));
    }
    ctx.lineTo(right, bottom);
    ctx.fill();
    ctx.strokeStyle = "#218f9b";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const time = span * i / count;
      if (!i) ctx.moveTo(left, yAt(0));
      else ctx.lineTo(xAt(time), yAt(sustainModel.envelopeAt(time,
        state.sustainAttack, state.sustainRelease)));
    }
    ctx.stroke();
    const releaseX = xAt(sustainModel.EXAMPLE_HOLD);
    ctx.strokeStyle = "#d58a3b";
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(releaseX, top); ctx.lineTo(releaseX, bottom); ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("1", left - 6, yAt(1));
    ctx.fillText("0", left - 6, bottom);
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const seconds = span * i / 4;
      ctx.fillText(secondsText(seconds), xAt(seconds), height - 12);
    }
  }

  function drawSustainWave() {
    const { ctx, width, height } = plotContext($("sustainWaveCanvas"));
    const left = 38, right = width - 13, top = 24, bottom = height - 28;
    const middle = (top + bottom) / 2, amp = (bottom - top) * .43;
    const w = right - left, span = .02;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const count = Math.max(700, Math.ceil(state.sustainPitch * 8 * span * 10));
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const t = span * i / count;
      const value = sustainModel.waveAt(2 * Math.PI * state.sustainPitch * t, state.sustainKind);
      if (!i) ctx.moveTo(left, middle - value * amp);
      else ctx.lineTo(left + w * i / count, middle - value * amp);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("0", left, height - 10);
    ctx.fillText(millisecondsText(20), right, height - 10);
  }

  function drawSustainSpectrum() {
    const { ctx, width, height } = plotContext($("sustainSpectrumCanvas"));
    const left = 36, right = width - 14, top = 21, bottom = height - 29;
    const partials = sustainModel.partials(state.sustainKind);
    const w = right - left, h = bottom - top, slot = w / partials.length;
    drawFrame(ctx, width, height, left, right, top, bottom);
    partials.forEach((strength, i) => {
      const size = Math.min(19, slot * .55);
      ctx.fillStyle = i === 0 ? "#367bd1" : "#159c91";
      ctx.fillRect(left + (i + .5) * slot - size / 2, bottom - strength * h * .91,
        size, strength * h * .91);
    });
    ctx.fillStyle = "#7489a1";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("1", left - 5, top + 2);
    ctx.textAlign = "center";
    const labels = w < 315 ? [0, 2, 4, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
    for (const i of labels) ctx.fillText(i === 0 ? "f" : (i + 1) + "f",
      left + (i + .5) * slot, height - 10);
  }

  function drawSustainPlots() {
    drawSustainEnvelope();
    drawSustainWave();
    drawSustainSpectrum();
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
    const timbre = state.motionKind === "theremin" ? state.motionTimbre : "pure";
    for (let i = 0; i <= 350; i++) {
      const fraction = i / 350;
      const x = left + fraction * (right - left);
      const phase = 2 * Math.PI * state.motionHz * fraction * 0.02;
      const y = middle - amplitude * motionModel.timbreWaveAt(phase, timbre);
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
    const left = 20, right = width - 15, top = 24, bottom = height - 32;
    const timbre = state.motionKind === "theremin" ? state.motionTimbre : "pure";
    const partials = motionModel.timbrePartials(timbre);
    const peak = Math.max(...partials);
    ctx.strokeStyle = "#e8eff7";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = left + (right - left) * i / 4;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    }
    ctx.strokeStyle = "#a9bdd3";
    ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
    for (let i = 0; i < partials.length; i++) {
      const x = left + (right - left) * (i + 1) / (partials.length + 1);
      if (partials[i] > 0) {
        ctx.strokeStyle = i === 0 ? "#278bb8" : "#16998f";
        ctx.lineWidth = 9;
        ctx.beginPath(); ctx.moveTo(x, bottom);
        ctx.lineTo(x, bottom - (bottom - top) * partials[i] / peak * state.motionLevel);
        ctx.stroke();
      }
      ctx.fillStyle = "#7489a1";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(i === 0 ? "f" : (i + 1) + "f", x, height - 11);
    }
    ctx.fillStyle = "#7489a1";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(hzText(state.motionHz) + " – " + hzText(8 * state.motionHz), left, 13);
  }

  function drawMotionPlots() {
    drawMotionPitch();
    drawMotionWave();
    drawMotionComponent();
  }

  function mixTimeLabel(seconds, span) {
    return span < 1 ? millisecondsText(seconds * 1000) : secondsText(seconds);
  }

  function drawMixWave() {
    const { ctx, width, height } = plotContext($("mixWaveCanvas"));
    const left = 43, right = width - 16, top = 24, bottom = height - 32;
    const start = state.mixWindowStart, span = state.mixWindowSpan;
    const w = right - left, middle = (top + bottom) / 2;
    const amplitude = (bottom - top) * 0.46;
    const recipe = mixRecipe();
    drawFrame(ctx, width, height, left, right, top, bottom);

    // On a long time scale we show the exact envelope rather than undersampling
    // hundreds of cycles into a misleading low-frequency waveform.
    const count = Math.max(500, Math.floor(w * 1.5));
    ctx.fillStyle = "rgba(47, 125, 203, .12)";
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const fraction = i / count;
      const envelope = beatsModel.envelopeAt(start + span * fraction, recipe);
      const x = left + w * fraction;
      const y = middle - amplitude * envelope;
      if (!i) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let i = count; i >= 0; i--) {
      const fraction = i / count;
      const envelope = beatsModel.envelopeAt(start + span * fraction, recipe);
      ctx.lineTo(left + w * fraction, middle + amplitude * envelope);
    }
    ctx.fill();
    ctx.strokeStyle = "#28918e";
    ctx.lineWidth = 1.5;
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const fraction = i / count;
        const envelope = beatsModel.envelopeAt(start + span * fraction, recipe);
        const x = left + w * fraction;
        const y = middle + sign * amplitude * envelope;
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const showOscillations = (state.mixBase + state.mixGap) * span <= Math.max(5, w / 20);
    if (showOscillations) {
      // Render a true sum only when the display can resolve individual cycles.
      const countWave = Math.max(1400, Math.ceil((state.mixBase + state.mixGap) * span * 24));
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#367bd1";
      for (let i = 0; i <= countWave; i++) {
        const fraction = i / countWave;
        const y = middle - amplitude * beatsModel.sampleAt(start + span * fraction, recipe);
        if (!i) ctx.moveTo(left, y);
        else ctx.lineTo(left + w * fraction, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = "#7489a1";
    ctx.textAlign = "left";
    ctx.fillText(text("amplitude"), 10, 13);
    ctx.textAlign = "center";
    const ticks = w < 320 ? 2 : 4;
    for (let i = 0; i <= ticks; i++) {
      ctx.fillText(mixTimeLabel(start + span * i / ticks, span), left + w * i / ticks, height - 12);
    }
    $("mixWindowLabel").textContent = mixTimeLabel(start, span) + " – " +
      mixTimeLabel(start + span, span) + " · " + mixBeatsText();
    $("mixWaveHint").textContent = text(showOscillations ? "mixWaveHintFine" : "mixWaveHint");
    renderMixView();
  }

  function drawMixSpectrum() {
    const { ctx, width, height } = plotContext($("mixSpectrumCanvas"));
    const left = 44, right = width - 16, top = 20, bottom = height - 33;
    const w = right - left, h = bottom - top;
    const lines = beatsModel.spectrumLines(mixRecipe());
    // Magnify the narrow interval: a 4 Hz separation must be distinguishable.
    const margin = Math.max(2, state.mixGap * 1.5);
    const lower = state.mixBase - margin;
    const upper = state.mixBase + state.mixGap + margin;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const xFor = hz => left + (hz - lower) / (upper - lower) * w;
    lines.forEach((line, index) => {
      const x = xFor(line.hz);
      const peak = bottom - line.amplitude * h * (lines.length === 1 ? 0.95 : 1.8);
      ctx.strokeStyle = index === 0 ? "#347cc9" : "#159c91";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, peak);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(x, peak, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#788da2";
    ctx.textAlign = "center";
    for (const i of (w < 290 ? [0, 4] : [0, 2, 4])) {
      const hz = lower + (upper - lower) * i / 4;
      ctx.fillText(hzText(Math.round(hz)), left + w * i / 4, height - 12);
    }
  }

  function drawMixPlots() {
    drawMixWave();
    drawMixSpectrum();
  }

  function drawHarmonicWave() {
    const { ctx, width, height } = plotContext($("harmonicWaveCanvas"));
    const left = 43, right = width - 16, top = 26, bottom = height - 32;
    const w = right - left, middle = (top + bottom) / 2, span = 0.02;
    const amplitude = (bottom - top) * 0.45;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const normalizer = harmonicModel.peak(state.harmonicPartials);
    const count = Math.max(900, Math.round(w * 2), Math.ceil(state.harmonicBase * 8 * span * 12));
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 2.1;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const fraction = i / count;
      const y = middle - amplitude * harmonicModel.sampleAt(span * fraction,
        state.harmonicBase, state.harmonicPartials, normalizer);
      if (!i) ctx.moveTo(left, y);
      else ctx.lineTo(left + w * fraction, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(text("amplitude"), 8, 14);
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      ctx.fillText(millisecondsText(5 * i), left + w * i / 4, height - 12);
    }
    $("harmonicWaveFoot").textContent = "0–" + millisecondsText(20);
  }

  function drawHarmonicSpectrum() {
    const { ctx, width, height } = plotContext($("harmonicSpectrumCanvas"));
    const left = 44, right = width - 16, top = 18, bottom = height - 33;
    const w = right - left, h = bottom - top, slot = w / harmonicModel.COUNT;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const lines = harmonicModel.spectralLines(state.harmonicBase, state.harmonicPartials);
    for (let i = 0; i < lines.length; i++) {
      const x = left + (i + 0.5) * slot;
      const barHeight = lines[i].strength * h * 0.94;
      ctx.fillStyle = i === 0 ? "#347cc9" : "#159c91";
      ctx.fillRect(x - Math.min(28, slot * 0.55) / 2, bottom - barHeight,
        Math.min(28, slot * 0.55), barHeight);
    }
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("1", left - 5, top + 4);
    ctx.fillText("0", left - 5, bottom + 2);
    ctx.textAlign = "center";
    const labels = w < 350 ? [0, 3, 7] : [0, 1, 3, 5, 7];
    for (const index of labels) {
      const hz = lines[index].hz;
      ctx.fillText(hz >= 1000 ? kHzText(hz, true) : hzText(hz),
        left + (index + 0.5) * slot, height - 12);
    }
  }

  function drawHarmonicPlots() {
    drawHarmonicWave();
    drawHarmonicSpectrum();
  }

  function drawNoiseWave() {
    const { ctx, width, height } = plotContext($("noiseWaveCanvas"));
    const left = 43, right = width - 16, top = 26, bottom = height - 32;
    const w = right - left, middle = (top + bottom) / 2;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const sampleRate = 32000;
    const samples = noiseModel.makeSamples(state.noiseColor, sampleRate, .2);
    // A two-pole approximation for a stable, illustrative filtered waveform.
    // Playback itself uses Web Audio's proper second-order biquad filter.
    const retention = Math.exp(-2 * Math.PI * state.noiseCutoff / sampleRate);
    const filtered = new Float32Array(samples.length);
    let first = 0, second = 0;
    for (let i = 0; i < samples.length; i++) {
      first = retention * first + (1 - retention) * samples[i];
      second = retention * second + (1 - retention) * first;
      filtered[i] = second;
    }
    const startSample = Math.round(.08 * sampleRate);
    const durationSamples = Math.round(.04 * sampleRate);
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i <= durationSamples; i++) {
      const x = left + w * i / durationSamples;
      const y = middle - filtered[startSample + i] * (bottom - top) * .47;
      if (!i) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(text("amplitude"), 8, 14);
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      ctx.fillText(millisecondsText(10 * i), left + w * i / 4, height - 12);
    }
    $("noiseWaveFoot").textContent = "0–" + millisecondsText(40);
  }

  function drawNoiseSpectrum() {
    const { ctx, width, height } = plotContext($("noiseSpectrumCanvas"));
    const left = 51, right = width - 18, top = 20, bottom = height - 33;
    const w = right - left, h = bottom - top;
    const minHz = 40, maxHz = 12000, logSpan = Math.log(maxHz / minHz);
    drawFrame(ctx, width, height, left, right, top, bottom);
    const xFor = hz => left + Math.log(hz / minHz) / logSpan * w;
    const yFor = magnitude => {
      // Reference white noise at 500 Hz = 0 dB, not per-curve normalized.
      const decibels = 20 * Math.log10(Math.max(1e-5, magnitude));
      return bottom - Math.max(0, Math.min(1, (decibels + 60) / 80)) * h;
    };
    ctx.strokeStyle = "#218f9b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 450; i++) {
      const hz = minHz * Math.exp(logSpan * i / 450);
      const mag = noiseModel.expectedMagnitude(state.noiseColor, hz, state.noiseCutoff);
      const x = xFor(hz), y = yFor(mag);
      if (!i) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    for (const db of [-60, -40, -20, 0, 20]) {
      ctx.fillText(db + " dB", left - 6, bottom - (db + 60) / 80 * h + 3);
    }
    ctx.textAlign = "center";
    const ticks = w < 340 ? [50, 500, 5000] : [50, 200, 1000, 4000, 12000];
    for (const hz of ticks) {
      ctx.fillText(hz >= 1000 ? kHzText(hz) : hzText(hz), xFor(hz), height - 12);
    }
  }

  function drawNoisePlots() {
    drawNoiseWave();
    drawNoiseSpectrum();
  }

  function drawPlots() {
    if (state.mode === "strike") {
      renderStrikeTime();
      drawStrikeWave();
      drawStrikeSpectrum();
    } else if (state.mode === "sustain") {
      drawSustainPlots();
    } else if (state.mode === "motion") {
      drawMotionPlots();
    } else if (state.mode === "mix") {
      if (state.mixKind === "harmonics") drawHarmonicPlots();
      else if (state.mixKind === "noise") drawNoisePlots();
      else drawMixPlots();
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
  document.querySelectorAll("[data-sustain]").forEach(button => {
    button.addEventListener("click", () => selectSustainKind(button.dataset.sustain));
  });
  document.querySelectorAll("[data-sustain-gesture]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.sustainGesture === button.dataset.sustainGesture) return;
      stopSustainSound();
      state.sustainGesture = button.dataset.sustainGesture;
      setSustainStatus("sustainReady");
      renderSustainControls();
    });
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
  document.querySelectorAll("[data-mix-gap]").forEach(button => {
    button.addEventListener("click", () => setMixGap(button.dataset.mixGap));
  });
  document.querySelectorAll("[data-mix-kind]").forEach(button => {
    button.addEventListener("click", () => selectMixKind(button.dataset.mixKind));
  });
  document.querySelectorAll("[data-theremin-timbre]").forEach(button => {
    button.addEventListener("click", () => setMotionTimbre(button.dataset.thereminTimbre));
  });
  document.querySelectorAll("[data-harmonic-preset]").forEach(button => {
    button.addEventListener("click", () => setHarmonicPreset(button.dataset.harmonicPreset));
  });
  document.querySelectorAll("[data-harmonic-level]").forEach(input => {
    input.addEventListener("input", event => setHarmonicLevel(input.dataset.harmonicLevel, event.target.value));
  });
  document.querySelectorAll("[data-noise-color]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.noiseColor === button.dataset.noiseColor) return;
      state.noiseColor = button.dataset.noiseColor;
      noiseAudio.changeColor();
      renderNoiseControls();
      if (state.mode === "mix" && state.mixKind === "noise") drawNoisePlots();
    });
  });
  $("harmonicButton").addEventListener("click", toggleHarmonicSound);
  $("harmonicBaseSlider").addEventListener("input", event => setHarmonicBase(event.target.value));
  $("harmonicBaseInput").addEventListener("change", event => setHarmonicBase(event.target.value));
  $("harmonicVolume").addEventListener("input", event => {
    state.harmonicVolume = Math.max(0, Math.min(100, Number(event.target.value)));
    harmonicAudio.update();
    renderHarmonicControls();
  });
  $("harmonicReset").addEventListener("click", resetHarmonics);
  $("noiseButton").addEventListener("click", toggleNoiseSound);
  $("noiseCutoff").addEventListener("input", event => {
    state.noiseCutoff = Math.max(noiseModel.MIN_CUTOFF, Math.min(noiseModel.MAX_CUTOFF, Number(event.target.value)));
    noiseAudio.update();
    renderNoiseControls();
    if (state.mode === "mix" && state.mixKind === "noise") drawNoisePlots();
  });
  $("noiseVolume").addEventListener("input", event => {
    state.noiseVolume = Math.max(0, Math.min(100, Number(event.target.value)));
    noiseAudio.update();
    renderNoiseControls();
  });
  $("noiseReset").addEventListener("click", resetNoise);
  $("mixZoomOut").addEventListener("click", () => zoomMix(-1));
  $("mixZoomIn").addEventListener("click", () => zoomMix(1));
  $("mixButton").addEventListener("click", toggleMixSound);
  $("mixBaseSlider").addEventListener("input", event => setMixBase(event.target.value));
  $("mixBaseInput").addEventListener("change", event => setMixBase(event.target.value));
  $("mixGapSlider").addEventListener("input", event => setMixGap(event.target.value));
  $("mixVolume").addEventListener("input", event => {
    state.mixVolume = Math.max(0, Math.min(100, Number(event.target.value)));
    mixAudio.update();
    renderMixControls();
  });
  $("mixViewLeft").addEventListener("click", () => panMixWindow(-1));
  $("mixViewRight").addEventListener("click", () => panMixWindow(1));
  $("mixReset").addEventListener("click", resetMix);
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
  $("modeSustain").addEventListener("click", () => selectMode("sustain"));
  $("modeMotion").addEventListener("click", () => selectMode("motion"));
  $("modeMix").addEventListener("click", () => selectMode("mix"));
  const sustainPad = $("sustainButton");
  sustainPad.addEventListener("pointerdown", event => {
    if (state.mode !== "sustain" || state.sustainGesture !== "hold" || event.button > 0 ||
        sustainPointerId !== null) return;
    event.preventDefault();
    sustainPointerId = event.pointerId;
    if (sustainPad.setPointerCapture) sustainPad.setPointerCapture(event.pointerId);
    return startSustainSound();
  });
  const endSustainPointer = event => {
    if (sustainPointerId !== event.pointerId) return;
    sustainPointerId = null;
    if (sustainPad.releasePointerCapture) {
      try { sustainPad.releasePointerCapture(event.pointerId); }
      catch (_) { /* Already released on some touch browsers. */ }
    }
    releaseSustainSound();
  };
  sustainPad.addEventListener("pointerup", endSustainPointer);
  sustainPad.addEventListener("pointercancel", endSustainPointer);
  sustainPad.addEventListener("lostpointercapture", endSustainPointer);
  sustainPad.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      stopSustainSound();
    } else if (state.sustainGesture === "hold" && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      if (!sustainKeyboardHeld) {
        sustainKeyboardHeld = true;
        return startSustainSound();
      }
    }
  });
  sustainPad.addEventListener("keyup", event => {
    if (state.sustainGesture !== "hold" || (event.key !== " " && event.key !== "Enter")) return;
    event.preventDefault();
    if (sustainKeyboardHeld) { sustainKeyboardHeld = false; releaseSustainSound(); }
  });
  sustainPad.addEventListener("blur", () => {
    if (sustainKeyboardHeld) { sustainKeyboardHeld = false; releaseSustainSound(); }
  });
  sustainPad.addEventListener("click", event => {
    if (state.mode !== "sustain") return;
    // Pointer actions are handled by pointerdown/up in hold mode. A click from
    // assistive technology (detail = 0) can still toggle an accessible note.
    if (state.sustainGesture !== "toggle" && event.detail !== 0) return;
    if (state.sustainPlaying) releaseSustainSound();
    else return startSustainSound();
  });
  $("sustainFrequencySlider").addEventListener("input", event =>
    setSustainPitch(sustainModel.sliderToHz(Number(event.target.value))));
  $("sustainFrequencyInput").addEventListener("change", event => setSustainPitch(event.target.value));
  $("sustainSnap").addEventListener("change", event => {
    state.sustainSnap = event.target.checked;
    if (state.sustainSnap) setSustainPitch(state.sustainPitch);
    else renderSustainControls();
  });
  $("sustainAttack").addEventListener("input", event => {
    state.sustainAttack = Math.max(sustainModel.MIN_ATTACK,
      Math.min(sustainModel.MAX_ATTACK, Number(event.target.value)));
    renderSustainControls();
    drawPlots();
  });
  $("sustainRelease").addEventListener("input", event => {
    state.sustainRelease = Math.max(sustainModel.MIN_RELEASE,
      Math.min(sustainModel.MAX_RELEASE, Number(event.target.value)));
    renderSustainControls();
    drawPlots();
  });
  $("sustainVolume").addEventListener("input", event => {
    state.sustainVolume = Math.max(0, Math.min(100, Number(event.target.value)));
    sustainAudio.update();
    renderSustainControls();
  });
  $("sustainReset").addEventListener("click", resetSustain);
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
  $("recordButton").addEventListener("click", toggleRecording);
  $("recordDismiss").addEventListener("click", () => {
    showRecordResult = false;
    renderRecordControls();
  });
  $("stopAll").addEventListener("click", () => { stopRecording(true); stopAllAudio(); });
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
    if (document.hidden) { stopRecording(); stopAllAudio(true, "hidden"); }
  });
  window.addEventListener("pagehide", () => { stopRecording(); stopAllAudio(true, "hidden"); });
  window.addEventListener("blur", () => {
    if (recorder.state === "recording") stopRecording();
    if (state.sustainPlaying || sustainPointerId !== null || sustainKeyboardHeld ||
        state.motionPlaying || state.mixPlaying || state.harmonicPlaying || state.noisePlaying) {
      stopAllAudio(true, "hidden");
    }
  });
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => drawPlots());
    observer.observe($("waveCanvas"));
    observer.observe($("spectrumCanvas"));
    observer.observe($("strikeWaveCanvas"));
    observer.observe($("strikeSpectrumCanvas"));
    observer.observe($("sustainEnvelopeCanvas"));
    observer.observe($("sustainWaveCanvas"));
    observer.observe($("sustainSpectrumCanvas"));
    observer.observe($("motionPitchCanvas"));
    observer.observe($("motionWaveCanvas"));
    observer.observe($("motionSpectrumCanvas"));
    observer.observe($("mixWaveCanvas"));
    observer.observe($("mixSpectrumCanvas"));
    observer.observe($("harmonicWaveCanvas"));
    observer.observe($("harmonicSpectrumCanvas"));
    observer.observe($("noiseWaveCanvas"));
    observer.observe($("noiseSpectrumCanvas"));
  } else window.addEventListener("resize", drawPlots);

  renderTexts();
  renderControls();
  drawPlots();
})();
