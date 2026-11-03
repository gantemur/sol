/* Sound Lab: pure tones, modeled transients, moving pitch, and two-tone interference. */
(() => {
  "use strict";
  const model = window.SoundLabModel;
  const transientModel = window.SoundLabTransientModel;
  const sustainModel = window.SoundLabSustain;
  const spectrumModel = window.SoundLabSpectrum;
  const motionModel = window.SoundLabMotionModel;
  const beatsModel = window.SoundLabBeats;
  const intervalModel = window.SoundLabIntervals;
  const scaleModel = window.SoundLabScales;
  const limit5Model = window.SoundLabLimit5;
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
      modePure: "Pure tones", modeStrike: "Strike/Pluck", modeSustain: "Blow/Bow", modeMotion: "Moving Pitch",
      modeMix: "Combine waves", modeTuning: "Tuning", modeSwitchAria: "Sound categories",
      mixExperimentsAria: "Explore combined and complex sounds",
      mixExperimentBeats: "Two frequencies", mixExperimentHarmonics: "Build timbre",
      mixExperimentIntervals: "Interval", mixExperimentNoise: "Noise",
      harmonicPhase: "05 · Build a sound", noisePhase: "05 · Explore noise",
      intervalPhase: "06 · Musical intervals", scalePhase: "06 · 3-limit", limit5Phase: "06 · 5-limit",
      tuningExperimentsAria: "Tuning experiments", scaleExperiment: "3-limit", limit5Experiment: "5-limit",
      scaleChoose: "Build a scale with 3:2", scaleDescription: "Walk upward or downward by exact 3:2 steps. Fold the notes into one octave, then choose which note acts as the tonic.",
      scalePlay: "Hear the scale", scaleStop: "Stop", scalePlayCaption: "Play ascending and descending",
      scalePresetsTitle: "Scale patterns", scalePresetsAria: "Fifth-chain patterns",
      scaleFiveUp: "5 · Up", scaleFiveCenter: "5 · Both", scaleFiveDown: "5 · Down",
      scaleSeven: "7 notes", scaleTwelve: "12 notes", scaleNotesUnit: "notes",
      scaleGapToggle: "Show the return gap", scaleGapTitle: "How close is the ghost return?",
      scaleGapPlay: "Hear both pitches", scaleGapStop: "Stop comparison",
      scaleGapInfo: "After {count} fifths ({direction}), compare ghost step {ghost} with the starting pitch shifted by {octaves} octaves: {cents} cents ({angle}°) apart.",
      scaleGapDirectionUp: "up", scaleGapDirectionDown: "down",
      scaleGapPythagorean: "Pythagorean comma", scaleGapOther: "Return gap",
      scaleGapSummary: "{name}: {cents} cents · {angle}° · {beats} Hz apart",
      scaleGapFoot: "Magnified pitch comparison, not a spectrum. Play both octave-adjusted pitches together to hear their interference beats.",
      scaleGapFrom: "starting pitch", scaleGapGhost: "ghost return", scaleGapUnit: "cents",
      scaleGapCanvasAria: "Magnified cents comparison of the starting fifth-chain pitch with the octave-adjusted ghost return",
      scaleGrowTitle: "Grow the 3:2 chain", scaleDirectionsAria: "Add or remove fifth-chain steps",
      scaleAddDown: "← Down 3:2", scaleAddUp: "Up 3:2 →",
      scaleRemoveDownAria: "Remove the lowest fifth-chain step", scaleRemoveUpAria: "Remove the highest fifth-chain step",
      scaleGrowHint: "Each step is multiplied or divided by 3:2, then brought into one octave using powers of 2.",
      scaleBase: "Starting frequency", scaleBaseSliderAria: "Starting note frequency slider",
      scaleBaseInputAria: "Starting note frequency in hertz",
      scaleTonicTitle: "Choose the tonic", scaleTonicHint: "The generated pitch collection stays the same; choosing a different tonic changes the order and character of the scale.",
      scaleTonicAria: "Choose a scale tonic from the generated pitches",
      scaleTonicFact: "Tonic frequency", scaleReturnFact: "Distance from nearest octave",
      scaleStepsFact: "Adjacent pitch gaps", scaleOctaveFact: "Fifth steps · octaves",
      scaleSpiralTitle: "Octave spiral of 3:2 steps", scaleSpiralHint: "Start at step 0. Fifths spiral outward or inward; faint spokes show pitch order in an octave. Green marks the tonic; gold follows playback.",
      scaleSpiralAria: "Octave spiral: numbered 3:2 fifth steps across several octaves",
      scaleSpiralFoot: "Spiral steps show generation order; faint rays show the different ascending pitch order around one octave.",
      scaleSpiralAxis: "3:2 ↻ 210.6°",
      scaleFourierTitle: "Notes and harmonics", scaleFourierHint: "Each higher row is 3:2 above the one below. Circles: original fundamentals; diamonds: possible harmonics; gray dots: the same notes moved by octaves.",
      scaleFourierAria: "Log-frequency harmonic rows of the fifth chain with virtual octave references",
      scaleFourierAxis: "log₂ f →", scaleFourierFoot: "Read note pitches left to right inside the green one-octave window. Gray copies can be played after transposition; they are not extra simultaneous overtones. 3f₁ = 2f₂.",
      scaleWindowLabel: "one octave",
      scaleNowIdle: "Play to hear the notes in rising and falling pitch order.",
      scaleNowPlaying: "Playing: step {step} · {ratio}{octave}", scaleNowUpperOctave: " · upper octave",
      scaleChallenge: "Build five pitches, then add a step on either end to reach seven. Change the tonic: how does the melody sound?",
      scaleLearnMore: "How can the same notes make different scales?",
      scaleLessonOne: "Repeated exact 3:2 ratios create a chain of fifths. Dividing or multiplying by powers of two puts every generated pitch into one octave. A sequence of five consecutive fifths produces a pentatonic collection; seven produces a diatonic one.",
      scaleLessonTwo: "The tonic is a choice of musical center, not a new frequency ratio. For example, C–D–E–G–A is C major pentatonic, while the same pitches starting and ending on A form A minor pentatonic. Twelve exact fifths miss seven octaves by about 23.46 cents: the Pythagorean comma.",
      scaleReady: "Ready. Play the scale, or change its notes.", scaleStarting: "Preparing the melody…",
      scalePlaying: "Playing up and down. Press the large button to stop.",
      scaleGapPlaying: "Playing the starting pitch and ghost return together.",
      scaleGapDone: "Comparison finished. Change the number of fifths to hear another gap.",
      scaleStopped: "Stopped. Try another tonic or direction.", scaleHidden: "Melody stopped when you left the page.",
      scaleUnsupported: "This browser cannot play the generated scale.",
      scaleBlocked: "The melody could not start. Check your browser audio settings.",
      scaleInvalid: "Enter a starting frequency from 110 to 330 Hz.",
      limit5Choose: "Build notes with 3:2 and 5:4", limit5Description: "Move horizontally by a pure fifth (3:2), diagonally by a major third (5:4). Fold the points into one octave and choose your own notes.",
      limit5Play: "Hear the notes", limit5Stop: "Stop", limit5PlayCaption: "In sequence or together",
      limit5PresetsTitle: "Ratio-built examples", limit5PresetsAria: "Five-limit musical examples",
      limit5Major: "C major", limit5Minor: "E minor", limit5GMajor: "G major", limit5DMinor: "D minor", limit5Seven: "7 notes", limit5Fifths: "Only 3:2",
      limit5PickHint: "Tap a dot on the lattice to add or remove a note (up to 12). Green is the starting note C.",
      limit5BaseTitle: "Reference C frequency", limit5BaseHint: "261.63 Hz is middle C. Changing it transposes the entire tuning together.",
      limit5PlaybackTitle: "How to listen", limit5PlaybackAria: "Sequence or chord playback", limit5Melody: "In sequence", limit5Chord: "Together (chord)",
      limit5TetGuides: "Show sample 12-TET equivalent-pitch guides", limit5TetHint: "Ends of a dashed line have the same name in 12-TET, yet may have different exact frequencies.",
      limit5CommaTitle: "Syntonic comma · 81:80", limit5CommaAria: "Choose a syntonic comma comparison",
      limit5CommaE: "E: two paths", limit5CommaD: "D: two paths", limit5Compare: "Hear both pitches together", limit5CompareStop: "Stop comparison",
      limit5CommaFact: "{name}: {just} versus {pyth} · {cents} cents", limit5BeatFact: "{low} and {high} Hz · {beats} Hz beats",
      limit5LatticeTitle: "The 3–5 lattice", limit5LatticeHint: "→ is 3:2, ↗ is 5:4; the third edge is 6:5. Colored points form your selection.",
      limit5LatticeFoot: "The same 12-TET note name can correspond to different ratios. The gold link locates the syntonic comma.", limit5GridAxis: "→ 3:2 · ↗ 5:4",
      limit5LatticeAria: "3:2 and 5:4 lattice: tap a note; keyboard arrows move, Enter selects", limit5NowIdle: "Play to see the sounding notes.", limit5NowPlaying: "Playing {ratio} · {hz}",
      limit5NowChord: "Playing all selected notes together.", limit5NowCompare: "Two versions of {name} sound together.",
      limit5OctaveTitle: "Pitch order within one octave", limit5OctaveHint: "Octave-folded notes run from left to right. The 12-TET ticks are reference positions, not a requirement.",
      limit5OctaveFoot: "The two gold markers are different versions of the same note. Their tiny offset is magnified below.",
      limit5OctaveAria: "Selected pitches and a comma pair inside one octave, with reference semitones", limit5RulerTitle: "Magnified comma", limit5RulerValue: "81:80 ≈ {cents} cents",
      limit5Challenge: "Listen to the pure C–E–G chord, then play both E versions together. Next compare the two versions of D.",
      limit5LearnMore: "How can one note have two exact pitches?",
      limit5LessonOne: "The 3-limit uses powers of 2 and 3. The 5-limit adds pure 5:4 major thirds, creating a second direction on the lattice. Choosing which pitches make a useful scale is also a musical decision, not only mathematics.",
      limit5LessonTwo: "Four pure fifths produce 81:64, while one pure major third produces 5:4. Their ratio is 81:80, or about 21.51 cents: the syntonic comma. Equal temperament identifies these as one nominal note; pure ratios leave distinct lattice points.",
      limit5Ready: "Ready. Choose notes and press Play.", limit5Starting: "Preparing the sound…", limit5Playing: "Playing. Tap the large button to stop.",
      limit5Comparing: "Playing both comma pitches; listen for slow beats.", limit5Stopped: "Stopped. Try another chord or comma pair.",
      limit5Hidden: "Sound stopped when you left the page.", limit5Invalid: "Enter a starting frequency from 110 to 330 Hz.",
      limit5NoNotes: "Choose at least one note before playing.", limit5Blocked: "Cannot start playback. Check your browser sound settings.",
      limit5Limit: "You can choose at most 12 notes.",
      intervalChoose: "Two-note frequency ratios",
      intervalDescription: "Compare two independent notes in simple ratios and see where their harmonics overlap.",
      intervalPresetsTitle: "Ratio (upper : lower)", intervalPresetsAria: "Simple two-note frequency ratios",
      intervalNames: { "1:1": "Unison", "2:1": "Octave", "3:2": "Perfect fifth", "4:3": "Perfect fourth", "5:4": "Major third", "6:5": "Minor third" },
      intervalBase: "Lower-note pitch", intervalBaseSliderAria: "Lower note frequency slider",
      intervalBaseInputAria: "Lower note frequency in hertz",
      intervalTuningTitle: "Tuning", intervalTuningAria: "Two-note tuning system",
      intervalJust: "Just ratio", intervalEqual: "12-TET",
      intervalColorTitle: "Source color", intervalColorAria: "Pure or harmonic-rich tones",
      intervalPure: "Pure", intervalRich: "Rich",
      intervalColorHint: "Pure notes contain only their fundamentals. Rich notes contain upper harmonics, which can overlap or nearly overlap.",
      intervalPlay: "Play both", intervalStop: "Stop both",
      intervalNotes: "Two note pitches", intervalActualRatio: "Actual ratio",
      intervalPeriod: "Shared period", intervalReferencePeriod: "Just-ratio reference period",
      intervalOverlap: "First shared harmonics", intervalAlmost: "Near-shared partials",
      intervalJustStatus: "The chosen ratio is exact; these harmonics coincide.",
      intervalEqualStatus: "12-TET is {cents} cents from the just ratio. Near-shared partials differ by {hz}; in Rich mode they may beat.",
      intervalWaveTitle: "Two-note waveforms",
      intervalWaveHint: "Lower note, upper note, and their sum. An exact just interval repeats after a shared period.",
      intervalWaveFootJust: "Lower {low} cycles · upper {high} cycles in one shared period",
      intervalWaveFootEqual: "Window from just ratio: no exact joint repeat in 12-TET",
      intervalSpectrumTitle: "Harmonics of the two notes",
      intervalSpectrumHint: "Blue: lower note; orange: upper note. The first shared or near-shared partial pair is circled.",
      intervalSpectrumHintPure: "Pure sound has only two fundamental frequencies. Choose Rich to reveal matching upper harmonics.",
      intervalSpectrumJust: "{p} × {low} = {q} × {high} Hz",
      intervalSpectrumEqual: "{p} × {low} versus {q} × {high} Hz · difference {delta}",
      intervalSpectrumPure: "Only fundamentals are present in Pure mode; upper overlaps are hypothetical.",
      intervalChallenge: "Choose 4:3. Predict the shared period and matching harmonics, then compare with 12-TET.",
      intervalLearnMore: "How does a two-note ratio differ from one note's overtones?",
      intervalLessonOne: "A ratio such as 3:2 compares the fundamental frequencies of two separate notes. The overtones of one note instead occur at 2, 3, 4… times its own fundamental.",
      intervalLessonTwo: "At 3:2 the lower note's third harmonic equals the upper note's second harmonic. In 12-TET the frequencies differ slightly; with Rich tones the nearby harmonics may beat. Pleasantness is not determined by ratios alone.",
      intervalReady: "Ready. Play the two notes together.", intervalStarting: "Starting two notes…",
      intervalPlaying: "Playing. Compare ratios and tunings while the notes sound.",
      intervalStopped: "Stopped. Try another ratio.", intervalHidden: "Sound stopped when you left the page.",
      intervalUnsupported: "This browser cannot synthesize interval tones.",
      intervalBlocked: "The tones could not start. Check your browser's audio settings.",
      intervalInvalid: "Enter a lower-note frequency from 110 to 440 Hz.",
      intervalWaveAria: "Modeled lower, upper and summed note waveforms over a just-ratio reference period",
      intervalSpectrumAria: "Two harmonic ladders and their shared or near-shared partials",
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
      pluck: "Guitar string", kick: "Drum", piano: "Piano", strikeGroupAria: "Transient sound model",
      strikeCaption: "Tap to sound; tap again to repeat",
      strikePluckButton: "Pluck", strikeStrumButton: "Strum", strikeKickButton: "Strike",
      strikePianoButton: "Press", strikePianoTapButton: "Tap",
      strikePianoTouchTitle: "How to play", strikePianoPress: "Press", strikePianoTap: "Tap",
      strikePianoTouchHint: "Press models a held key with free decay. Tap is gentler and brings the damper back after a short press.",
      strikeGuitarPlay: "Play guitar", strikeSingle: "One string", strikeStrum: "Several strings",
      strikeChord: "Choose a chord", strikeChordHint: "The pick sweeps across the strings. Frets change each string's pitch; muted strings are skipped.",
      strikePluckPosition: "Pluck position", strikePluckPositionHint: "Plucking nearer the end brings out more high harmonics.",
      strikePitch: "Note frequency", strikePitchSliderAria: "Note pitch slider",
      strikePitchInputAria: "Note frequency in hertz",
      strikeStrength: "Strength", strikeDecay: "Decay time",
      strikeDrumSize: "Drum size", strikeLarge: "Large", strikeMedium: "Medium", strikeSmall: "Small",
      strikeDrumHint: "A larger membrane vibrates more slowly. Its natural modes are not integer harmonics.",
      strikeDrumTension: "Membrane tension", strikeDrumTensionHint: "Tighten the membrane to raise all its natural frequencies.",
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
      strikeSpectrumHint: "String harmonics fade at different speeds. Drum modes do not follow integer frequency ratios.",
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
      strikeLessonTwo: "A circular membrane has non-integer frequency ratios because its modes involve Bessel functions. Its size and tension change the frequencies, while a string produces nearly harmonic overtones. Compare their local spectra.",
      strikeReady: "Ready. Sound starts only when you tap the pad.",
      strikeStarting: "Preparing the sound…", strikeDone: "Sound triggered. Tap again to repeat.",
      strikeStopped: "Stopped. Tap the pad to try again.",
      strikeHidden: "Sound stopped when you left the page.",
      strikeUnsupported: "This browser does not support synthesized sound playback.",
      strikeBlocked: "Sound could not start. Check browser audio permission and try again.",
      strikeInvalid: "Enter a string frequency between 110 and 880 Hz.",
      strikeDesc: {
        pluck: "A plucked string repeatedly reflects its vibration, losing some energy each cycle. Several strings can form a chord.",
        kick: "A vibrating circular membrane has several natural modes, with frequencies set by its size and tension.",
        piano: "Hammer force changes the brightness of slightly detuned, stiff strings. Their overtones fade at different rates."
      },
      sustainPhase: "03 · Held sounds", sustainChoose: "Choose a held sound",
      sustainFlute: "Flute", sustainViolin: "Violin", sustainMorin: "Morin khuur",
      sustainGroupAria: "Held instrument models", sustainGestureTitle: "How to play",
      sustainGestureAria: "Hold or toggle the sound", sustainHold: "Press and hold", sustainToggle: "Tap to toggle",
      sustainPress: "Hold to play", sustainPressing: "Sounding…", sustainPressCaption: "Hold the button; release to fade.",
      sustainTogglePlay: "Play", sustainToggleStop: "Stop", sustainToggleCaption: "Tap again to release the note.",
      sustainPitch: "Note frequency", sustainPitchSliderAria: "Held note pitch slider",
      sustainPitchInputAria: "Held note frequency in hertz", sustainAttack: "Attack time", sustainRelease: "Release time",
      sustainBreath: "Blowing strength", sustainBreathHint: "A stronger air jet changes the flute's loudness, harmonics and breath noise.",
      sustainBow: "Bow pressure", sustainBowHint: "More bow pressure makes the tone stronger and sharpens the stick–slip harmonics in this simplified model.",
      sustainEnvelopeHelp: "Attack applies to the next note; release applies when you let go.",
      sustainEnvelopeTitle: "Loudness over time", sustainEnvelopeHint: "Normalized attack and release of a 1.2 s note; blowing or bow pressure also changes loudness.",
      sustainEnvelopeFoot: "The vertical mark is the release at 1.2 s.",
      sustainDetailTitle: "Waveform and harmonics", sustainDetailHint: "20 ms stick–slip approximation after illustrative body filters. Random bow noise is omitted.",
      sustainFluteDetailHint: "20 ms modeled flute tone after jet shaping and air-column filtering; random breath noise is omitted.",
      sustainWaveTitle: "Waveform", sustainSpectrumTitle: "Harmonics",
      sustainEnvelopeAria: "Example held-note attack, sustain and release curve",
      sustainWaveAria: "Modeled twenty millisecond sustained periodic waveform",
      sustainSpectrumAria: "Strengths of modeled periodic harmonics",
      sustainChallenge: "Keep the flute's pitch fixed. Try gentle and strong blowing: what happens to loudness and the upper harmonics?",
      sustainBowChallenge: "Keep the note fixed. Change bow pressure, then compare violin and morin khuur. Which harmonics stand out?",
      sustainLearnMore: "Why can these sounds continue?",
      sustainLessonOne: "Blowing a flute or bowing a string keeps feeding energy into its vibration. A plucked string is set moving once and then fades.",
      sustainLessonTwo: "The flute uses a nonlinear jet-like exciter and simple filters. For bowed strings, an idealized velocity alternates between sticking and a short reverse slip; body filters color its harmonics. Neither model solves the full self-oscillating physical feedback.",
      sustainReady: "Ready. Hold the button or use tap-to-toggle mode.", sustainStarting: "Starting the note…",
      sustainPlayingHold: "Sounding. Release the button to fade.", sustainPlayingToggle: "Sounding. Tap again to release.",
      sustainReleased: "Released. The sound fades away.", sustainStopped: "Stopped. Try another instrument.",
      sustainHidden: "Sound stopped when you left the page.",
      sustainUnsupported: "This browser cannot play generated instruments.",
      sustainBlocked: "The sound could not start. Check browser sound permission.",
      sustainInvalid: "Enter a frequency between 110 and 880 Hz.",
      sustainDesc: {
        flute: "A flute-like air-jet model: stronger blowing makes the sound louder and brings out more upper harmonics.",
        violin: "A bright bowed-string source with pressure-controlled stick–slip sharpness and illustrative body resonances.",
        morin: "The same bowed-string mechanism with a different slip duration and warmer body response, inspired by the morin khuur."
      },
      motionPhase: "04 · Moving frequency", motionChoose: "Choose a moving sound",
      theremin: "Theremin", siren: "Fire-truck siren",
      motionDesc: {
        theremin: "Move your finger to change the pitch and loudness continuously.",
        siren: "Hear how different paths between the same two frequencies change the sound."
      },
      motionGroupAria: "Moving sound choices", thereminHelp: "Press and move: right makes the pitch higher; up makes it louder. Release to stop.",
      thereminTimbreLabel: "Sound color", thereminTimbresAria: "Theremin timbre options",
      timbrePure: "Pure", timbreRich: "Rich", timbreVoice: "Vowels", timbreOvertones: "Focus overtone",
      timbreNotes: {
        pure: "A sine wave contains only its fundamental frequency f₀.",
        rich: "A harmonic-rich electronic tone contains f₀, 2f₀, 3f₀…",
        voice: "One harmonic-rich source is filtered by vowel resonances (formants), which stay at roughly fixed frequencies as the pitch moves.",
        overtones: "The same source contains many harmonics. A narrow resonance emphasizes one, as in a simplified overtone-singing demonstration."
      },
      thereminVowelLabel: "Choose vowel", thereminVowelsAria: "Vowel resonance selection",
      vowelA: "A", vowelE: "E", vowelI: "I", vowelO: "O", vowelU: "U",
      thereminVowelHint: "Vocal-tract resonances do not simply follow the sung pitch. Try 120–350 Hz for clearer vowels.",
      thereminHarmonicLabel: "Emphasized harmonic", thereminOvertoneHint: "A single source supplies f₀, 2f₀, 3f₀…; a filter emphasizes one upper harmonic. This is not two independent voices.",
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
        theremin: "At a low pitch, compare vowels A and I; then select an upper harmonic. Is the high note a second oscillator?",
        siren: "Keep the low and high frequencies and speed fixed. How do the three trajectories sound different?"
      },
      motionLearnMore: "Why does moving the pitch change the sound?",
      motionLessonOne: "Moving right raises pitch; moving up increases volume. Vowels have relatively fixed vocal-tract resonances (formants); overtone singing focuses one harmonic of a single voiced source.",
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
      modePure: "Цэвэр авиа", modeStrike: "Цохих/татах", modeSustain: "Үлээх/нумдах", modeMotion: "Хувирдаг давтамж",
      modeMix: "Долгион холих", modeTuning: "Хөг", modeSwitchAria: "Дууны бүлэг",
      mixExperimentsAria: "Холимог ба нийлмэл авианы туршилтууд",
      mixExperimentBeats: "Хоёр давтамж", mixExperimentHarmonics: "Өнгө бүтээх",
      mixExperimentIntervals: "Интервал", mixExperimentNoise: "Шуугиан",
      harmonicPhase: "05 · Авиа бүтээх", noisePhase: "05 · Шуугиан судлах",
      intervalPhase: "06 · Хөгжмийн интервал", scalePhase: "06 · 3-хязгаар", limit5Phase: "06 · 5-хязгаар",
      tuningExperimentsAria: "Хөгийн туршилтууд", scaleExperiment: "3-хязгаар", limit5Experiment: "5-хязгаар",
      scaleChoose: "3:2 харьцаагаар шатлал бүтээх", scaleDescription: "Эхлэх авианаас 3:2 алхмаар дээш, доош явж нот үүсгэ. Нэг октавт багтаагаад, дурын нотыг үндсэн нот болгон сонго.",
      scalePlay: "Шатлалыг сонсох", scaleStop: "Зогсоох", scalePlayCaption: "Өгсөж, уруудаж тоглоно",
      scalePresetsTitle: "Шатлалын жишээ", scalePresetsAria: "3:2 гинжийн жишээнүүд",
      scaleFiveUp: "5 · Дээш", scaleFiveCenter: "5 · Дундаас", scaleFiveDown: "5 · Доош",
      scaleSeven: "7 нот", scaleTwelve: "12 нот", scaleNotesUnit: "нот",
      scaleGapToggle: "Буцах зөрүүг харуулах", scaleGapTitle: "Буцах нот хэр ойр байна вэ?",
      scaleGapPlay: "Хоёр нотыг сонсох", scaleGapStop: "Харьцуулалтыг зогсоох",
      scaleGapInfo: "{count} квинтээр ({direction}) алхсан хийсвэр {ghost} нотыг эхлэх нотоос {octaves} октаваар шилжүүлсэн ноттой харьцуулбал: {cents} цент ({angle}°) зөрүүтэй.",
      scaleGapDirectionUp: "дээш", scaleGapDirectionDown: "доош",
      scaleGapPythagorean: "Пифагорын комма", scaleGapOther: "Буцах зөрүү",
      scaleGapSummary: "{name}: {cents} цент · {angle}° · {beats} Гц зөрүү",
      scaleGapFoot: "Центийн зайг томруулсан зураг, жинхэнэ спектр биш. Хоёр октаваар тохируулсан нотыг хамтад нь тоглуулж цохилтыг сонсоорой.",
      scaleGapFrom: "эхлэх нот", scaleGapGhost: "хийсвэр буцах нот", scaleGapUnit: "цент",
      scaleGapCanvasAria: "Эхлэх нот ба октаваар тохируулсан хийсвэр буцах нотын зайг центээр харьцуулсан зураг",
      scaleGrowTitle: "3:2 гинжийг сунгах", scaleDirectionsAria: "Гинжийн алхам нэмэх, хасах",
      scaleAddDown: "← Доош 3:2", scaleAddUp: "Дээш 3:2 →",
      scaleRemoveDownAria: "Доод захын алхмыг хасах", scaleRemoveUpAria: "Дээд захын алхмыг хасах",
      scaleGrowHint: "Алхам бүрийг 2-ын зэрэгт үржүүлж эсвэл хуваагаад нэг октавт оруулна.",
      scaleBase: "Эхлэх давтамж", scaleBaseSliderAria: "Эхлэх давтамжийн гулсуур",
      scaleBaseInputAria: "Эхлэх давтамжийг герцээр оруулах",
      scaleTonicTitle: "Үндсэн нотыг сонгох", scaleTonicHint: "Нотуудын давтамж хэвээр; харин аль нотыг төв болгосноос шатлалын эхлэл ба ая өөрчлөгдөнө.",
      scaleTonicAria: "Үүссэн нотоос үндсэн нот сонгох",
      scaleTonicFact: "Үндсэн нотын давтамж", scaleReturnFact: "Хамгийн ойр октаваас зөрөх зай",
      scaleStepsFact: "Зэргэлдээ нотын зай", scaleOctaveFact: "3:2 алхам · октав",
      scaleSpiralTitle: "3:2 алхмын октавын спираль", scaleSpiralHint: "0-ээс эхэлнэ. Квинтээр дээш, доош алхахад спираль гадагш, дотогш эргэнэ. Бүдэг цацрагууд нэг октав дахь нотын эрэмбийг харуулна.",
      scaleSpiralAria: "Олон октавын спираль дээр дугаарласан 3:2 квинтийн алхмууд",
      scaleSpiralFoot: "Спиралийн алхмууд үүсгэх дарааллыг, төвөөс татсан цацрагууд нэг октав дахь давтамжаар эрэмбэлэх дарааллыг заана.",
      scaleSpiralAxis: "3:2 ↻ 210.6°",
      scaleFourierTitle: "Нот ба гармоникууд", scaleFourierHint: "Дээд мөр нь доод мөрөөсөө 3:2 дахин өндөр. Дугуй нь анхны давтамж, ромбо нь үүсэж болох гармоник; саарал нь октаваар шилжүүлсэн мөнөөх нот.",
      scaleFourierAria: "Квинтийн гинжийн үндсэн давтамж, гармоник, октавын хийсвэр хуулбарууд",
      scaleFourierAxis: "log₂ f →", scaleFourierFoot: "Ногоон нэг октав доторх цэгүүдийг зүүнээс баруун тийш уншихад нотын эрэмбэ гарна. Саарал хуулбарыг октаваар шилжүүлж тоглож болно; нэмэлт зэрэг дуугарах гармоник биш. 3f₁ = 2f₂.",
      scaleWindowLabel: "нэг октав",
      scaleNowIdle: "Давтамжаар өсөх, буурах нотуудыг сонсохын тулд тоглуулна уу.",
      scaleNowPlaying: "Одоо: алхам {step} · {ratio}{octave}", scaleNowUpperOctave: " · дээд октав",
      scaleChallenge: "Таван нот үүсгээд гинжийн хоёр захад тус бүр нэгийг нэмэн долоон нот болго. Үндсэн нотыг сольж сонсоход юу өөрчлөгдөх вэ?",
      scaleLearnMore: "Ижил нотоор өөр шатлал яаж үүсэх вэ?",
      scaleLessonOne: "3:2 харьцааг давтан хэрэглэвэл квинтийн гинж үүснэ. Нотуудыг 2-ын зэрэгт үржүүлж, хувааж нэг октавт оруулна. Дараалсан таван квинтээс таван нотын, долоон квинтээс долоон нотын шатлал үүснэ.",
      scaleLessonTwo: "Үндсэн нот бол шинэ давтамжийн харьцаа биш, аяны төвийг сонгож буй хэрэг. Жишээ нь C–D–E–G–A нотуудыг C-ээс тогловол мажор пентатоник, A-гаас тогловол минор пентатоник болно. Яг 3:2 харьцааг 12 удаа хэрэглэхэд 7 октаваас 23.46 центээр зөрнө: Пифагорын комма.",
      scaleReady: "Бэлэн. Шатлалыг сонсож, нотуудыг өөрчилж үзээрэй.", scaleStarting: "Аяыг бэлтгэж байна…",
      scalePlaying: "Өгсөж, уруудаж тоглож байна. Том товчоор зогсооно.",
      scaleGapPlaying: "Эхлэх нот ба хийсвэр буцах нот хамт дуугарч байна.",
      scaleGapDone: "Харьцуулалт дууслаа. Өөр тооны квинтээр туршаарай.",
      scaleStopped: "Зогслоо. Өөр үндсэн нот, чиглэл туршаарай.", scaleHidden: "Хуудсаас гарахад ая зогслоо.",
      scaleUnsupported: "Энэ хөтөч шатлалын авиаг тоглуулах боломжгүй байна.",
      scaleBlocked: "Ая эхэлсэнгүй. Хөтчийн дууны тохиргоог шалгана уу.",
      scaleInvalid: "Эхлэх давтамж 110–330 Гц байх ёстой.",
      limit5Choose: "3:2 ба 5:4-өөр нот бүтээх", limit5Description: "Хэвтээ алхам нь 3:2 квинт, ташуу алхам нь 5:4 их терц. Нэг октавт шилжүүлсэн цэгүүдээс өөрийн хөгийг сонго.",
      limit5Play: "Нотуудыг сонсох", limit5Stop: "Зогсоох", limit5PlayCaption: "Ээлжлэн эсвэл хамтад нь",
      limit5PresetsTitle: "Харьцаагаар бүтээсэн жишээнүүд", limit5PresetsAria: "5-хязгаарын жишээнүүд",
      limit5Major: "До мажор", limit5Minor: "Ми минор", limit5GMajor: "Соль мажор", limit5DMinor: "Ре минор", limit5Seven: "7 нот", limit5Fifths: "Зөвхөн 3:2",
      limit5PickHint: "Тор дээрх дугуйг дарж нот нэмж, хасна (ихдээ 12). Ногоон нь До буюу эхлэх нот.",
      limit5BaseTitle: "До (C) нотын давтамж", limit5BaseHint: "261.63 Гц бол До4. Давтамжийг өөрчилбөл бүх шатлал хамт шилжинэ.",
      limit5PlaybackTitle: "Яаж сонсох вэ?", limit5PlaybackAria: "Ээлжлэх эсвэл хамт тоглох", limit5Melody: "Ээлжлэн", limit5Chord: "Хамт (аккорд)",
      limit5TetGuides: "12-TET-д ижил нэртэй нотын жишээг холбох", limit5TetHint: "Тасархай шугамын хоёр үзүүр 12-TET-д нэг нэртэй боловч цэвэр харьцаагаар өөр давтамжтай байж болно.",
      limit5CommaTitle: "Синтоник комма · 81:80", limit5CommaAria: "Синтоник коммагийн харьцуулалт",
      limit5CommaE: "Ми: 2 зам", limit5CommaD: "Ре: 2 зам", limit5Compare: "Хоёр давтамжийг хамт сонсох", limit5CompareStop: "Харьцуулалтыг зогсоох",
      limit5CommaFact: "{name}: {just} ба {pyth} · {cents} цент", limit5BeatFact: "{low} ба {high} Гц · {beats} Гц биение",
      limit5LatticeTitle: "3 ба 5-ын тор", limit5LatticeHint: "→ нь 3:2, ↗ нь 5:4, гурав дахь тал нь 6:5. Тэмдэглэсэн цэгүүд тоглоход оролцоно.",
      limit5LatticeFoot: "Ижил 12-TET нэртэй цэгүүд үнэндээ өөр байж болно. Алтан холбоос синтоник коммаг харуулна.", limit5GridAxis: "→ 3:2 · ↗ 5:4",
      limit5LatticeAria: "3:2 ба 5:4-ийн тор: цэг дарж нот сонго; гарын сум ба Enter-ээр бас сонгоно", limit5NowIdle: "Нотуудын эгшиглэх ээлжийг тоглуулахад харна.", limit5NowPlaying: "Эгшиглэж байна: {ratio} · {hz}",
      limit5NowChord: "Сонгосон бүх нот хамт эгшиглэж байна.", limit5NowCompare: "{name} нотын хоёр хувилбар хамт эгшиглэж байна.",
      limit5OctaveTitle: "Нэг октав дахь нотын эрэмбэ", limit5OctaveHint: "Нэг октавт шилжүүлсэн нотууд зүүнээс баруун тийш өснө. 12-TET тэмдэглэгээ нь зөвхөн жишиг.",
      limit5OctaveFoot: "Алтлаг хоёр цэг нь нэг нотын хоёр өөр хувилбар. Бяцхан зөрүүг доор томруулж харууллаа.",
      limit5OctaveAria: "Нэг октав дахь сонгосон нот ба коммагийн хоёр цэг", limit5RulerTitle: "Коммаг томруулбал", limit5RulerValue: "81:80 ≈ {cents} цент",
      limit5Challenge: "До–Ми–Соль мажор аккордыг сонсоод Ми нотын хоёр хувилбарыг хамт эгшиглүүл. Дараа нь Ре-ийн хоёр хувилбарыг харьцуул.",
      limit5LearnMore: "Яагаад нэг нотоос хоёр өөр давтамж үүсэв?",
      limit5LessonOne: "3-хязгаарын хөгт 2 ба 3-ын зэрэг хангалттай. 5-хязгаарын хөгт 5:4 их терцийг нэмж, торын нөгөө чиглэлд алхана. Нотуудаа сонгох нь зөвхөн математикийн биш, хөгжмийн шийдвэр.",
      limit5LessonTwo: "Дөрвөн цэвэр квинтээс 81:64, нэг цэвэр их терцээс 5:4 гарна. Тэдний харьцаа 81:80 буюу 21.51 цент — синтоник комма. Үүнийг 12-TET тэнцүү нот болгож авдаг бол цэвэр харьцаанд хоёр өөр цэг хэвээр үлдэнэ.",
      limit5Ready: "Бэлэн. Нотуудаа сонгоод тоглуулаарай.", limit5Starting: "Авиа бэлтгэж байна…", limit5Playing: "Тоглож байна. Зогсоохын тулд том товчийг дар.",
      limit5Comparing: "Коммагийн хоёр нот хамт эгшиглэж байна. Биений хэмнэлийг сонсоорой.", limit5Stopped: "Зогслоо. Өөр аккорд эсвэл комма сонго.",
      limit5Hidden: "Хуудсаас гарахад дуу зогслоо.", limit5Invalid: "Эхлэх давтамж 110–330 Гц байх ёстой.",
      limit5NoNotes: "Тоглуулахын өмнө ядаж нэг нот сонго.", limit5Blocked: "Дуу эхэлсэнгүй. Хөтчийн дууны тохиргоог шалгаарай.",
      limit5Limit: "Ихдээ 12 нот сонгож болно.",
      intervalChoose: "Хоёр нотын харьцаа",
      intervalDescription: "Хоёр тусдаа авианы давтамжийг энгийн харьцаагаар тохируулж, гармоникууд нь хаана давхцахыг харьцуул.",
      intervalPresetsTitle: "Давтамжийн харьцаа (дээд : доод)", intervalPresetsAria: "Хоёр нотын энгийн харьцаа",
      intervalNames: { "1:1": "Унисон", "2:1": "Октав", "3:2": "Цэвэр квинт", "4:3": "Цэвэр кварт", "5:4": "Их терц", "6:5": "Бага терц" },
      intervalBase: "Доод нотын давтамж", intervalBaseSliderAria: "Доод нотын давтамжийн гулсуур",
      intervalBaseInputAria: "Доод нотын давтамжийг герцээр оруулах",
      intervalTuningTitle: "Хөг", intervalTuningAria: "Хоёр нотын хөг сонгох",
      intervalJust: "Энгийн харьцаа", intervalEqual: "12-TET",
      intervalColorTitle: "Авианы найрлага", intervalColorAria: "Цэвэр эсвэл гармониктай авиа",
      intervalPure: "Цэвэр", intervalRich: "Гармониктай",
      intervalColorHint: "Цэвэр авиа зөвхөн үндсэн давтамжтай. Гармониктай хоёр авианы дээд хэсгүүд давхцах эсвэл ойртох боломжтой.",
      intervalPlay: "Тоглуулах", intervalStop: "Зогсоох",
      intervalNotes: "Хоёр нот", intervalActualRatio: "Бодит харьцаа",
      intervalPeriod: "Хамтын үе", intervalReferencePeriod: "Энгийн харьцааны жишиг үе",
      intervalOverlap: "Анхны давхцах гармоник", intervalAlmost: "Ойролцоо гармоникууд",
      intervalJustStatus: "Харьцаа яг таарсан тул эдгээр гармоник давхцана.",
      intervalEqualStatus: "12-TET хөг нь энгийн харьцаанаас {cents} центээр зөрнө. Ойролцоо гармоникуудын зөрүү {hz}; «Гармониктай» үед биение сонсогдож болно.",
      intervalWaveTitle: "Хоёр нотын долгион",
      intervalWaveHint: "Доод, дээд нот ба нийлбэр долгион. Энгийн харьцаанд хамтын үеийн дараа давтагдана.",
      intervalWaveFootJust: "Хамтын нэг үед доод нот {low}, дээд нот {high} бүтэн хэлбэлзэнэ",
      intervalWaveFootEqual: "Энгийн харьцааны жишиг цонх; 12-TET-д яг ижил давталт үгүй",
      intervalSpectrumTitle: "Хоёр нотын гармоникууд",
      intervalSpectrumHint: "Цэнхэр нь доод, улбар нь дээд нот. Давхцсан эсвэл ойртсон хосыг хүрээлэв.",
      intervalSpectrumHintPure: "«Цэвэр» авианд хоёр үндсэн давтамж л байна. Давхцах дээд гармоникийг «Гармониктай» үед харна.",
      intervalSpectrumJust: "{p} × {low} = {q} × {high} Гц",
      intervalSpectrumEqual: "{p} × {low} ба {q} × {high} Гц · зөрүү {delta}",
      intervalSpectrumPure: "«Цэвэр» үед зөвхөн үндсэн давтамжууд байна; дээд гармоникууд үүсээгүй.",
      intervalChallenge: "4:3 сонгоод хамтын үе, давхцах гармоникийг таа. Дараа нь 12-TET хөгтэй харьцуул.",
      intervalLearnMore: "Хоёр нотын харьцаа ба нэг нотын гармоник юугаараа ялгаатай вэ?",
      intervalLessonOne: "3:2 бол хоёр тусдаа нотын үндсэн давтамжийн харьцаа. Харин нэг нотын дээд гармоникууд нь өөрийн үндсэн давтамжаас 2, 3, 4… дахин их давтамжтай.",
      intervalLessonTwo: "3:2 үед доод нотын 3 дахь, дээд нотын 2 дахь гармоник давхцана. 12-TET хөгтэй бол эдгээр нь ойртож, бага зэрэг зөрнө. «Гармониктай» үед биение үүсч болно. Таатай эсэхийг ганц харьцаагаар тодорхойлохгүй.",
      intervalReady: "Бэлэн. Хоёр нотыг хамт сонсоорой.", intervalStarting: "Хоёр нот эхэлж байна…",
      intervalPlaying: "Дуугарч байна. Харьцаа, хөг солиж сонсоорой.",
      intervalStopped: "Зогслоо. Өөр харьцаа туршаарай.", intervalHidden: "Хуудсаас гарахад авиа зогслоо.",
      intervalUnsupported: "Энэ хөтөч хоёр нотын авиа үүсгэж чадахгүй байна.",
      intervalBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны тохиргоог шалгана уу.",
      intervalInvalid: "Доод нотын давтамж 110–440 Гц байх ёстой.",
      intervalWaveAria: "Доод, дээд болон нийлбэр нотын долгионы загвар",
      intervalSpectrumAria: "Хоёр нотын гармоникуудын давхцал ба ойролцоох хос",
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
      pluck: "Гитарын чавхдас", kick: "Бөмбөр", piano: "Төгөлдөр хуур", strikeGroupAria: "Цохилтын дууны загвар",
      strikeCaption: "Дарж сонсоод, дахин дарж давтаарай",
      strikePluckButton: "Татах", strikeStrumButton: "Цохих", strikeKickButton: "Цохих",
      strikePianoButton: "Дарах", strikePianoTapButton: "Товших",
      strikePianoTouchTitle: "Тоглох арга", strikePianoPress: "Дарах", strikePianoTap: "Товших",
      strikePianoTouchHint: "Дарахад товчлуурыг барьсан үеийн авиа чөлөөтэй намдана. Товшиход алх зөөлөн цохиж, намжаагч удахгүй буцна.",
      strikeGuitarPlay: "Гитар тоглуулах", strikeSingle: "Нэг чавхдас", strikeStrum: "Олон чавхдас",
      strikeChord: "Аккорд сонгох", strikeChordHint: "Цохиход чавхдасууд ээлжлэн дуугарна. Аккордоос хамаарч дарсан нот нь өөр, зарим чавхдас дуугарахгүй.",
      strikePluckPosition: "Татах байрлал", strikePluckPositionHint: "Үзүүрт нь ойр татахад дээд гармоникууд тодордог.",
      strikePitch: "Нотын давтамж", strikePitchSliderAria: "Нотын давтамжийн гулсуур",
      strikePitchInputAria: "Нотын давтамжийг герцээр оруулах",
      strikeStrength: "Цохилтын хүч", strikeDecay: "Намдах хугацаа",
      strikeDrumSize: "Бөмбөрийн хэмжээ", strikeLarge: "Том", strikeMedium: "Дунд", strikeSmall: "Жижиг",
      strikeDrumHint: "Том мембран нам хэлбэлзэнэ. Түүний давтамжууд үндсэн давтамжийн бүхэл тоон үржвэр биш.",
      strikeDrumTension: "Мембраны таталт", strikeDrumTensionHint: "Мембраныг чангалахад бүх хэлбэлзлийн давтамж өснө.",
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
      strikeSpectrumHint: "Чавхдасны гармоникууд өөр өөр хурдтай намдана. Бөмбөрийн модын давтамжууд бүхэл тоон харьцаатай биш.",
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
      strikeLessonTwo: "Дугуй мембраны хэлбэлзлийн давтамжууд Бесселийн функцийн тэгүүдээс хамаардаг тул бүхэл тоон харьцаатай биш. Хэмжээ ба таталтыг өөрчлөхөд давтамжууд хувирна. Харин чавхдасны дээд гармоникууд үндсэн давтамжийн ойролцоогоор бүхэл тоон үржвэр байдаг.",
      strikeReady: "Бэлэн. Дарахад л дуу гарна.",
      strikeStarting: "Дууг бэлтгэж байна…", strikeDone: "Дуугарлаа. Дахин дарж болно.",
      strikeStopped: "Зогслоо. Дахин дарж сонсоорой.",
      strikeHidden: "Хуудсаас гарахад дуу зогслоо.",
      strikeUnsupported: "Энэ хөтөч дуу үүсгэж тоглуулах боломжгүй байна.",
      strikeBlocked: "Авиа эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгаад дахин оролдоно уу.",
      strikeInvalid: "Нотын давтамжийг 110–880 Гц-ийн хооронд оруулна уу.",
      strikeDesc: {
        pluck: "Чавхдасны хэлбэлзэл эргэж ойж, энергиэ бага багаар алддаг. Хэд хэдэн чавхдас аккорд үүсгэнэ.",
        kick: "Дугуй мембран олон өөрийн модоор хэлбэлзэнэ. Давтамжууд нь хэмжээ ба таталтаас хамаарна.",
        piano: "Алх цохиход өчүүхэн зөрүүтэй чавхдас зэрэг хэлбэлзэнэ. Цохилтын хүчийг өсгөхөд дээд гармоникууд тодорч, авиа хурц болно."
      },
      sustainPhase: "03 · Үргэлжлэх авиа", sustainChoose: "Үргэлжлэх дуу сонгох",
      sustainFlute: "Лимбэ", sustainViolin: "Хийл", sustainMorin: "Морин хуур",
      sustainGroupAria: "Үргэлжлэх авианы загвар", sustainGestureTitle: "Дуугаргах арга",
      sustainGestureAria: "Дууг барих эсвэл товшиж асаах", sustainHold: "Дарж барих", sustainToggle: "Товшиж асаах",
      sustainPress: "Дарж дуугаргах", sustainPressing: "Дуугарч байна…", sustainPressCaption: "Дараад барина, тавихад аажмаар намдана.",
      sustainTogglePlay: "Тоглуулах", sustainToggleStop: "Зогсоох", sustainToggleCaption: "Дахин товшиж намдаана.",
      sustainPitch: "Нотын давтамж", sustainPitchSliderAria: "Нотын давтамжийн гулсуур",
      sustainPitchInputAria: "Нотын давтамжийг герцээр оруулах", sustainAttack: "Эхлэх хугацаа", sustainRelease: "Намдах хугацаа",
      sustainBreath: "Үлээлтийн хүч", sustainBreathHint: "Илүү хүчтэй үлээхэд дуу чангарч, гармоникууд болон амьсгалын шуугиан өөрчлөгдөнө.",
      sustainBow: "Нумын даралт", sustainBowHint: "Нумын даралтыг нэмэхэд авиа чангарч, наалдах–гулсах хэлбэлзлийн дээд гармоникууд тодорно. Энэ бол хялбаршуулсан загвар.",
      sustainEnvelopeHelp: "Эхлэх хугацаа дараагийн нотод, намдах хугацаа тавихад үйлчилнэ.",
      sustainEnvelopeTitle: "Дууны хүч хугацаанд", sustainEnvelopeHint: "1.2 сек үргэлжилсэн авианы хэвийн болгосон эхлэл, намдалт. Үлээлт, нумын даралт бас чанга сулд нөлөөлнө.",
      sustainEnvelopeFoot: "Босоо шугам нь тавих мөч (1.2 сек).",
      sustainDetailTitle: "Долгион ба гармоникууд", sustainDetailHint: "Чавхдасны наалдах–гулсах хөдөлгөөний хялбар загвар, их биеийн шүүлтүүрээр гаргасан 20 мсек долгион. Санамсаргүй шуугианыг зураагүй.",
      sustainFluteDetailHint: "Үлээлт ба агаарын баганын шүүлтүүрээр загварчилсан 20 мсек-ийн долгион. Санамсаргүй шуугианыг оруулаагүй.",
      sustainWaveTitle: "Долгион", sustainSpectrumTitle: "Гармоникууд",
      sustainEnvelopeAria: "Дууг эхлүүлж, барьж, тавих үеийн далайцын загвар",
      sustainWaveAria: "20 мсек-ийн үргэлжлэх долгионы загвар",
      sustainSpectrumAria: "Загварчилсан үелэх долгионы гармоникуудын хүч",
      sustainChallenge: "Лимбэний давтамжийг тогтмол байлгаад зөөлөн, хүчтэй үлээхийг харьцуул. Дээд гармоникууд хэрхэн өөрчлөгдөв?",
      sustainBowChallenge: "Нотын давтамжийг өөрчлөлгүй нумын даралтыг өсгөж, хийл ба морин хуурыг харьцуул. Аль гармоникууд тодров?",
      sustainLearnMore: "Эдгээр дуу яагаад үргэлжилдэг вэ?",
      sustainLessonOne: "Лимбэ үлээх, хийл болон морин хуур нумдах үед хэлбэлзэлд энерги тасралтгүй өгөгдөнө. Татаж тавьсан чавхдас харин аажмаар намдана.",
      sustainLessonTwo: "Лимбэний загварт үлээлтийн шугаман бус үйлчлэл, агаарын баганын шүүлтүүр бий. Нумдсан чавхдас нумтай ээлжлэн зууралдаж, гулсах үеийн хурдыг үелэх загвараар, их биеийг шүүлтүүрээр дүрсэлсэн. Аль аль нь жинхэнэ харилцан үйлчлэлийг бүрэн бодоогүй.",
      sustainReady: "Бэлэн. Дарж барих эсвэл товшиж асаах аргыг сонгоорой.", sustainStarting: "Дууг эхлүүлж байна…",
      sustainPlayingHold: "Дуугарч байна. Гараа авахад намдана.", sustainPlayingToggle: "Дуугарч байна. Дахин товшиж намдаана.",
      sustainReleased: "Тавилаа. Дуу аажмаар намдаж байна.", sustainStopped: "Зогслоо. Өөр зэмсэг туршаарай.",
      sustainHidden: "Хуудаснаас гарахад авиа зогслоо.",
      sustainUnsupported: "Энэ хөтөч загварчилсан зэмсэг тоглуулах боломжгүй байна.",
      sustainBlocked: "Дуу эхэлсэнгүй. Хөтчийн дууны зөвшөөрлийг шалгана уу.",
      sustainInvalid: "Нотын давтамжийг 110–880 Гц-ийн хооронд оруулна уу.",
      sustainDesc: {
        flute: "Үлээлтийн хүчнээс дууны хэмжээ, дээд гармоникууд нь өөрчлөгдөх лимбэний хялбаршуулсан загвар.",
        violin: "Нумын даралтаар наалдах–гулсах хөдөлгөөний хурц байдлыг өөрчилж, их биеийн шүүлтүүрээр өнгө оруулсан хийлийн загвар.",
        morin: "Нумдсан чавхдасны ижил зарчимтай боловч гулсах үе, их биеийн өнгө нь өөр морин хуураас санаа авсан загвар."
      },
      motionPhase: "04 · Хувирдаг давтамж", motionChoose: "Хөдөлгөөнт дуу сонгох",
      theremin: "Теремин", siren: "Галын машины дохио",
      motionDesc: {
        theremin: "Гараа хөдөлгөж давтамж ба дууны хэмжээг өөрчил.",
        siren: "Ижил хоёр давтамжийн хооронд өөр өөр замаар шилжүүлж сонсоорой."
      },
      motionGroupAria: "Хөдөлгөөнт дууны төрөл", thereminHelp: "Талбар дээр дарж хөдөлгөнө: баруун тийш өндөр, дээш чанга дуугарна. Гараа авахад зогсоно.",
      thereminTimbreLabel: "Дууны өнгө", thereminTimbresAria: "Тереминий дууны өнгө сонгох",
      timbrePure: "Цэвэр", timbreRich: "Баян", timbreVoice: "Эгшиг авиа", timbreOvertones: "Дээд гармоник",
      timbreNotes: {
        pure: "Синус долгион зөвхөн үндсэн давтамж f₀-той.",
        rich: "Баян авиа нь f₀, 2f₀, 3f₀… гармоникуудтай.",
        voice: "Нэг үелэх авиа амны хөндийн резонансаар (формант) шүүгдэж эгшиг шиг сонсогдоно. Резонанс нь нотын давтамжийг шууд дагахгүй.",
        overtones: "Нэг эх үүсвэрийн олон гармоникаас нарийн резонансаар нэгийг онцолно. Хөөмийн зарчмыг хялбарчилсан загвар."
      },
      thereminVowelLabel: "Эгшиг сонгох", thereminVowelsAria: "Эгшиг авиа сонгох",
      vowelA: "А", vowelE: "Э", vowelI: "И", vowelO: "О", vowelU: "У",
      thereminVowelHint: "Эгшгийн өнгө нь нотын давтамжтай хамт шилждэггүй амны хөндийн резонансаас үүснэ. 120–350 Гц-д туршаарай.",
      thereminHarmonicLabel: "Онцлох гармоник", thereminOvertoneHint: "Нэг эх үүсвэрийн f₀, 2f₀, 3f₀… гармоникуудаас нэгийг онцолно. Хоёр тусдаа хоолой биш.",
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
        theremin: "Нам нот дээр А ба И эгшгийн өнгийг харьцуулаад нэг дээд гармоник сонго. Өндөр авиа нь тусдаа эх үүсвэр үү?",
        siren: "Хоёр захын давтамж, хурдыг өөрчлөхгүйгээр гурван замналыг сонс. Ямар ялгаа байна вэ?"
      },
      motionLearnMore: "Давтамж өөрчлөгдөхөд яагаад авиа өөр сонсогддог вэ?",
      motionLessonOne: "Баруун тийш шилжихэд нот өндөрсөж, дээш шилжихэд авиа чангарна. Эгшгийн формант нь амны хөндийн резонанс; хөөмийд нэг эх үүсвэрийн дээд гармоникийг нарийн резонансаар онцолж болно.",
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
    strikeDrumTension: 1,
    strikeGuitarPlay: "single",
    strikeChord: "em",
    strikePluckPosition: .22,
    strikePianoTouch: "press",
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
    sustainBreath: sustainModel.DEFAULT_BREATH,
    sustainBowPressure: sustainModel.DEFAULT_BOW_PRESSURE,
    sustainAttack: sustainModel.defaults("flute").attack,
    sustainRelease: sustainModel.defaults("flute").release,
    sustainVolume: 40,
    sustainPlaying: false,
    sustainStatus: "sustainReady",
    sustainError: false,
    motionKind: "theremin",
    motionTimbre: "pure",
    motionVowel: "a",
    motionHarmonic: 6,
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
    tuningKind: "intervals",
    intervalRatio: "3:2",
    intervalBase: 220,
    intervalTuning: "just",
    intervalColor: "rich",
    intervalVolume: 38,
    intervalPlaying: false,
    intervalStatus: "intervalReady",
    intervalError: false,
    scaleDown: 0,
    scaleUp: 4,
    scaleTonicK: 0,
    scaleBase: 220,
    scaleVolume: 38,
    scaleShowGap: false,
    scalePlaying: false,
    scaleGapPlaying: false,
    scaleStatus: "scaleReady",
    scaleError: false,
    limit5Coords: limit5Model.PRESETS.major.map(pair => [...pair]),
    limit5Preset: "major",
    limit5Mode: "melody",
    limit5Base: 261.63,
    limit5Volume: 38,
    limit5Comma: "e",
    limit5TetGuides: false,
    limit5Playing: false,
    limit5Comparing: false,
    limit5Status: "limit5Ready",
    limit5Error: false,
    limit5Cursor: [0, 0],
    limit5GridFocused: false,
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
    beatVoice: 0.12, intervalVoice: 0.12, scaleVoice: 0.28, harmonics: 0.24, noise: 0.20 });
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
        state.strikeKind, state.strikePitch, state.strikeDecay, context.sampleRate,
        state.strikeDrumSize, strikeRecipe().options);
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
      if (voice.bowNodes) {
        try { voice.bowNodes.sharpOscillator.stop(stopAt); } catch (_) { /* May already be scheduled. */ }
      }
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
      const oscillator = context.createOscillator();
      let fluteNodes = null, bowNodes = null;
      if (state.sustainKind === "flute") {
        // Illustrative source-filter flute: sine bore pressure excites an
        // asymmetric, saturating jet; AC-coupling removes the jet's DC flow.
        // The two filters use the same coefficients as the plotted model.
        const drive = context.createGain();
        drive.gain.setValueAtTime(sustainModel.fluteDrive(state.sustainBreath), now);
        const shaper = context.createWaveShaper();
        const curve = new Float32Array(2049);
        for (let i = 0; i < curve.length; i++) {
          curve[i] = sustainModel.fluteJetAt(2 * i / (curve.length - 1) - 1);
        }
        shaper.curve = curve;
        shaper.oversample = "4x";
        const highpass = context.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.setValueAtTime(sustainModel.FLUTE_HIGHPASS, now);
        highpass.Q.setValueAtTime(sustainModel.FLUTE_Q, now);
        const lowpass = context.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(sustainModel.FLUTE_LOWPASS, now);
        lowpass.Q.setValueAtTime(sustainModel.FLUTE_Q, now);
        const toneGain = context.createGain();
        toneGain.gain.setValueAtTime(sustainModel.FLUTE_TONE_GAIN, now);
        oscillator.type = "sine";
        oscillator.connect(drive);
        drive.connect(shaper);
        shaper.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(toneGain);
        fluteNodes = { drive, shaper, highpass, lowpass, toneGain };
      } else {
        // The bow's soft and sharp periodic stick/slip velocity proxies run
        // phase-locked. Smooth gain interpolation changes bow pressure live,
        // avoiding clicks from replacing an audible oscillator's wavetable.
        const makeWave = edge => {
          const components = sustainModel.bowSourceComponents(state.sustainKind, edge);
          const real = new Float32Array([0, ...components.map(c => c.cos)]);
          const imag = new Float32Array([0, ...components.map(c => c.sin)]);
          return context.createPeriodicWave(real, imag, { disableNormalization: true });
        };
        oscillator.setPeriodicWave(makeWave("soft"));
        const sharpOscillator = context.createOscillator();
        sharpOscillator.setPeriodicWave(makeWave("hard"));
        sharpOscillator.frequency.setValueAtTime(state.sustainPitch, now);
        const weights = sustainModel.bowPressureWeights(state.sustainBowPressure);
        const softGain = context.createGain(), hardGain = context.createGain();
        softGain.gain.setValueAtTime(weights.soft, now);
        hardGain.gain.setValueAtTime(weights.hard, now);
        const body = sustainModel.bowBody(state.sustainKind);
        const peaks = body.peaks.map(peak => {
          const node = context.createBiquadFilter();
          node.type = "peaking";
          node.frequency.setValueAtTime(peak.frequency, now);
          node.Q.setValueAtTime(peak.q, now);
          node.gain.setValueAtTime(peak.gain, now);
          return node;
        });
        const lowpass = context.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(body.cutoff, now);
        lowpass.Q.setValueAtTime(sustainModel.FLUTE_Q, now);
        oscillator.connect(softGain);
        sharpOscillator.connect(hardGain);
        softGain.connect(peaks[0]);
        hardGain.connect(peaks[0]);
        peaks[0].connect(peaks[1]);
        peaks[1].connect(lowpass);
        bowNodes = { sharpOscillator, softGain, hardGain, peaks, lowpass };
      }
      oscillator.frequency.setValueAtTime(state.sustainPitch, now);
      const envelope = context.createGain();
      const volume = context.createGain();
      const defaults = sustainModel.defaults(state.sustainKind);
      volume.gain.setValueAtTime(this.volumeGain(), now);
      envelope.gain.setValueAtTime(0, now);
      this.ramp(envelope.gain, 0, 1, now, state.sustainAttack);
      if (fluteNodes) fluteNodes.toneGain.connect(envelope);
      else if (bowNodes) bowNodes.lowpass.connect(envelope);

      // Gentle unpitched breath/bow texture, deliberately quieter than the tone.
      const noise = context.createBufferSource();
      noise.buffer = this.makeNoiseBuffer(context);
      noise.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(defaults.cutoff, now);
      const noiseGain = context.createGain();
      noiseGain.gain.setValueAtTime(fluteNodes ?
        sustainModel.fluteNoiseGain(state.sustainBreath) :
        sustainModel.bowNoiseGain(state.sustainKind, state.sustainBowPressure), now);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(envelope);
      envelope.connect(volume);
      volume.connect(this.contextOwner.output);
      const voice = { oscillator, noise, noiseGain, filter, envelope, volume, fluteNodes, bowNodes,
        startedAt: now, attack: state.sustainAttack, stopping: false };
      this.voices.add(voice);
      oscillator.onended = () => {
        for (const node of [oscillator, noise, noiseGain, filter, envelope, volume,
          ...Object.values(fluteNodes || {}), ...(bowNodes ? [bowNodes.sharpOscillator,
            bowNodes.softGain, bowNodes.hardGain, ...bowNodes.peaks, bowNodes.lowpass] : [])]) {
          node.disconnect();
        }
        this.voices.delete(voice);
        if (this.currentVoice === voice) this.currentVoice = null;
      };
      oscillator.start(now);
      if (bowNodes) bowNodes.sharpOscillator.start(now);
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
      if (this.currentVoice.bowNodes) {
        const nodes = this.currentVoice.bowNodes;
        const weights = sustainModel.bowPressureWeights(state.sustainBowPressure);
        nodes.sharpOscillator.frequency.setTargetAtTime(state.sustainPitch, now, .018);
        nodes.softGain.gain.setTargetAtTime(weights.soft, now, .025);
        nodes.hardGain.gain.setTargetAtTime(weights.hard, now, .025);
        this.currentVoice.noiseGain.gain.setTargetAtTime(
          sustainModel.bowNoiseGain(state.sustainKind, state.sustainBowPressure), now, .025);
      }
      if (this.currentVoice.fluteNodes) {
        this.currentVoice.fluteNodes.drive.gain.setTargetAtTime(
          sustainModel.fluteDrive(state.sustainBreath), now, .025);
        this.currentVoice.noiseGain.gain.setTargetAtTime(
          sustainModel.fluteNoiseGain(state.sustainBreath), now, .025);
      }
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
      const color = state.motionKind === "theremin" ? state.motionTimbre : "pure";
      // Resonant vocal colors can exceed the excitation peak; leave headroom.
      const scale = color === "voice" ? .50 : color === "overtones" ? .48 : 1;
      gain.gain.linearRampToValueAtTime(maxGain.motion * scale * state.motionLevel, now + 0.035);
      const filters = [], formants = [];
      let tail = oscillator;
      const addFilter = (type, frequency, q, db = 0) => {
        const filter = context.createBiquadFilter();
        filter.type = type;
        filter.frequency.setValueAtTime(frequency, now);
        filter.Q.value = q;
        if (type === "peaking") filter.gain.value = db;
        tail.connect(filter);
        tail = filter;
        filters.push(filter);
        return filter;
      };
      let focus = null;
      if (color === "voice") {
        for (const [frequency, q, db] of motionModel.vowelFormants(state.motionVowel)) {
          formants.push(addFilter("peaking", frequency, q, db));
        }
        addFilter("lowpass", 4300, Math.SQRT1_2);
      } else if (color === "overtones") {
        const target = motionModel.overtoneFocus(state.motionHz, state.motionHarmonic);
        focus = addFilter("peaking", target.frequency, target.q, target.gain);
        addFilter("lowpass", 5800, Math.SQRT1_2);
      }
      tail.connect(gain);
      gain.connect(this.contextOwner.output);
      const voice = { oscillator, gain, filters, formants, focus, scale, stopping: false };
      this.voices.add(voice);
      oscillator.onended = () => {
        oscillator.disconnect();
        for (const filter of filters) filter.disconnect();
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
      if (this.currentVoice.formants.length) {
        motionModel.vowelFormants(state.motionVowel).forEach(([frequency, q, db], index) => {
          const filter = this.currentVoice.formants[index];
          filter.frequency.setTargetAtTime(frequency, now, 0.035);
          filter.Q.setTargetAtTime(q, now, 0.035);
          filter.gain.setTargetAtTime(db, now, 0.035);
        });
      }
      if (this.currentVoice.focus) {
        const focus = motionModel.overtoneFocus(state.motionHz, state.motionHarmonic);
        this.currentVoice.focus.frequency.setTargetAtTime(focus.frequency, now, 0.018);
        this.currentVoice.focus.gain.setTargetAtTime(focus.gain, now, 0.035);
      }
      const gain = this.currentVoice.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(maxGain.motion * this.currentVoice.scale * state.motionLevel, now, 0.012);
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

  class IntervalEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.voices = new Set();
      this.currentPair = null;
      this.generation = 0;
    }

    gainForVolume() {
      // Each modeled waveform has absolute amplitude at most 1; both together
      // therefore stay at or below 0.24 even at the maximum volume setting.
      return maxGain.intervalVoice * state.intervalVolume / 100;
    }

    fadeAndStop(pair, immediate = false) {
      const now = this.contextOwner.context.currentTime;
      const gain = pair.gain.gain;
      gain.cancelScheduledValues(now);
      if (immediate) gain.setValueAtTime(0, now);
      else gain.setTargetAtTime(0, now, 0.012);
      if (pair.stopping) return;
      pair.stopping = true;
      for (const oscillator of pair.oscillators) {
        try { oscillator.stop(now + (immediate ? 0.002 : 0.09)); }
        catch (_) { /* The oscillator might have been stopped already. */ }
      }
    }

    createPair(context) {
      const now = context.currentTime;
      const { baseHz, highHz } = intervalModel.analyze(intervalRecipe());
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.gainForVolume(), now + 0.035);
      gain.connect(this.contextOwner.output);
      const pair = { gain, oscillators: [], ended: 0, stopping: false };
      const { real, imag } = intervalModel.coefficients("rich");
      const wave = state.intervalColor === "rich" ?
        context.createPeriodicWave(real, imag, { disableNormalization: true }) : null;
      for (const hz of [baseHz, highHz]) {
        const oscillator = context.createOscillator();
        if (wave) oscillator.setPeriodicWave(wave);
        else oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(hz, now);
        oscillator.connect(gain);
        oscillator.onended = () => {
          oscillator.disconnect();
          pair.ended++;
          if (pair.ended === pair.oscillators.length) {
            gain.disconnect();
            this.voices.delete(pair);
            if (this.currentPair === pair) this.currentPair = null;
          }
        };
        pair.oscillators.push(oscillator);
      }
      this.currentPair = pair;
      this.voices.add(pair);
      pair.oscillators.forEach(oscillator => oscillator.start(now));
    }

    async start() {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "tuning" || state.tuningKind !== "intervals") return false;
      for (const pair of this.voices) this.fadeAndStop(pair);
      this.createPair(context);
      return true;
    }

    update() {
      if (!this.currentPair) return;
      const now = this.contextOwner.context.currentTime;
      const { baseHz, highHz } = intervalModel.analyze(intervalRecipe());
      this.currentPair.oscillators.forEach((oscillator, index) => {
        oscillator.frequency.setTargetAtTime(index === 0 ? baseHz : highHz, now, 0.018);
      });
      const gain = this.currentPair.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(this.gainForVolume(), now, 0.012);
    }

    changeColor() {
      if (!this.currentPair) return;
      const previous = this.currentPair;
      this.createPair(this.contextOwner.context);
      this.fadeAndStop(previous);
      while (this.voices.size > 3) {
        const oldest = this.voices.values().next().value;
        this.fadeAndStop(oldest, true);
        this.voices.delete(oldest);
      }
    }

    stop(immediate = false) {
      this.generation++;
      for (const pair of this.voices) this.fadeAndStop(pair, immediate);
      this.currentPair = null;
    }
  }

  class ScaleEngine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.generation = 0;
      this.voices = new Set();
      this.currentVoice = null;
    }

    fadeAndStop(voice, immediate = false) {
      const now = this.contextOwner.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      if (immediate) voice.gain.gain.setValueAtTime(0, now);
      else voice.gain.gain.setTargetAtTime(0, now, .012);
      if (voice.stopping) return;
      voice.stopping = true;
      try { voice.source.stop(now + (immediate ? .002 : .07)); }
      catch (_) { /* The buffer may already have finished. */ }
    }

    async startSampled(scale, comparison = false) {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "tuning" || state.tuningKind !== "scales") return false;
      for (const voice of this.voices) this.fadeAndStop(voice, true);
      const samples = comparison ? scaleModel.makeGapSamples(scale, context.sampleRate) :
        scaleModel.makeSamples(scale, context.sampleRate);
      const buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.getChannelData(0).set(samples);
      const source = context.createBufferSource();
      const gain = context.createGain();
      const now = context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(maxGain.scaleVoice * state.scaleVolume / 100, now + .016);
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(this.contextOwner.output);
      const voice = { source, gain, stopping: false, startedAt: now,
        steps: comparison ? [] : scaleModel.melodySteps(scale) };
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) {
          this.currentVoice = null;
          if (comparison) {
            state.scaleGapPlaying = false;
            setScaleStatus("scaleGapDone");
          } else {
            state.scalePlaying = false;
            stopScaleTracking();
            setScaleStatus("scaleStopped");
          }
          renderScaleControls();
        }
      };
      this.voices.add(voice);
      this.currentVoice = voice;
      source.start(now);
      return true;
    }

    async start(scale) { return this.startSampled(scale); }
    async startGap(scale) { return this.startSampled(scale, true); }

    updateVolume() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      const gain = this.currentVoice.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(maxGain.scaleVoice * state.scaleVolume / 100, now, .015);
    }

    stop(immediate = false) {
      this.generation++;
      this.currentVoice = null;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
    }
  }

  class Limit5Engine {
    constructor(contextOwner) {
      this.contextOwner = contextOwner;
      this.generation = 0;
      this.voices = new Set();
      this.currentVoice = null;
    }
    fadeAndStop(voice, immediate = false) {
      const now = this.contextOwner.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      if (immediate) voice.gain.gain.setValueAtTime(0, now);
      else voice.gain.gain.setTargetAtTime(0, now, .012);
      if (voice.stopping) return;
      voice.stopping = true;
      try { voice.source.stop(now + (immediate ? .002 : .08)); }
      catch (_) { /* The source may already have ended. */ }
    }
    async start(notes, mode, comparison = false) {
      const ticket = ++this.generation;
      const context = await this.contextOwner.readyContext();
      if (ticket !== this.generation || state.mode !== "tuning" || state.tuningKind !== "limit5") return false;
      for (const voice of this.voices) this.fadeAndStop(voice, true);
      const samples = comparison ? limit5Model.makeComparisonSamples(state.limit5Comma, state.limit5Base, context.sampleRate) :
        limit5Model.makeSamples(notes, context.sampleRate, mode);
      const buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.getChannelData(0).set(samples);
      const source = context.createBufferSource();
      const gain = context.createGain();
      const now = context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(maxGain.scaleVoice * state.limit5Volume / 100, now + .02);
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(this.contextOwner.output);
      const voice = { source, gain, notes, mode, comparison, startedAt: now, stopping: false };
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        this.voices.delete(voice);
        if (this.currentVoice === voice) {
          this.currentVoice = null;
          state.limit5Playing = false;
          state.limit5Comparing = false;
          stopLimit5Tracking();
          setLimit5Status("limit5Stopped");
          renderLimit5Controls();
        }
      };
      this.voices.add(voice);
      this.currentVoice = voice;
      source.start(now);
      return true;
    }
    updateVolume() {
      if (!this.currentVoice) return;
      const now = this.contextOwner.context.currentTime;
      this.currentVoice.gain.gain.cancelScheduledValues(now);
      this.currentVoice.gain.gain.setTargetAtTime(maxGain.scaleVoice * state.limit5Volume / 100, now, .015);
    }
    stop(immediate = false) {
      this.generation++;
      this.currentVoice = null;
      for (const voice of this.voices) this.fadeAndStop(voice, immediate);
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
  const intervalAudio = new IntervalEngine(audio);
  const scaleAudio = new ScaleEngine(audio);
  let scaleFrame = null;
  let scaleActive = null;
  const limit5Audio = new Limit5Engine(audio);
  let limit5Frame = null;
  let limit5Active = null;
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
      decaySec: state.strikeDecay, kickSize: state.strikeDrumSize,
      options: {
        position: state.strikePluckPosition,
        drumTension: state.strikeDrumTension,
        ...(state.strikeKind === "piano" ?
          { velocity: state.strikeStrength / 100, touch: state.strikePianoTouch } : {}),
        ...(state.strikeKind === "pluck" && state.strikeGuitarPlay === "strum" ?
          { strumChord: state.strikeChord } : {})
      } };
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

  function setIntervalStatus(status, error = false) {
    state.intervalStatus = status;
    state.intervalError = error;
    $("intervalStatus").textContent = text(status);
    $("intervalStatus").classList.toggle("error", error);
  }

  function setScaleStatus(status, error = false) {
    state.scaleStatus = status;
    state.scaleError = error;
    $("scaleStatus").textContent = text(status);
    $("scaleStatus").classList.toggle("error", error);
  }

  function setLimit5Status(status, error = false) {
    state.limit5Status = status;
    state.limit5Error = error;
    $("limit5Status").textContent = text(status);
    $("limit5Status").classList.toggle("error", error);
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

  function intervalRecipe() {
    return { ratio: state.intervalRatio, baseHz: state.intervalBase, tuning: state.intervalTuning };
  }

  function intervalAnalysis() { return intervalModel.analyze(intervalRecipe()); }

  function intervalPhrase(key, replacements) {
    return Object.entries(replacements).reduce((message, [name, value]) =>
      message.replaceAll("{" + name + "}", String(value)), text(key));
  }

  function renderIntervalControls() {
    const data = intervalAnalysis();
    $("intervalBaseSlider").value = String(state.intervalBase);
    $("intervalBaseInput").value = String(state.intervalBase);
    $("intervalBaseInput").setAttribute("aria-valuetext", hzText(state.intervalBase));
    $("intervalBaseValue").textContent = hzText(state.intervalBase);
    $("intervalName").textContent = text("intervalNames")[state.intervalRatio] + " · " + state.intervalRatio;
    $("intervalNotesValue").textContent = frequencyText(data.baseHz) + " + " + hzText(data.highHz);
    $("intervalRatioValue").textContent = state.intervalTuning === "just" ?
      state.intervalRatio + " = " + frequencyText(data.actualRatio) :
      "12-TET ≈ " + data.actualRatio.toFixed(5);
    $("intervalPeriodLabel").textContent = text(data.exactOverlap ? "intervalPeriod" : "intervalReferencePeriod");
    $("intervalPeriodValue").textContent = millisecondsText(data.referencePeriod * 1000);
    $("intervalOverlapValue").textContent = data.p + "f₁ " + (data.exactOverlap ? "= " : "≈ ") +
      data.q + "f₂" + (data.exactOverlap ? " = " + hzText(data.sharedLowHz) : "");
    $("intervalWaveBadge").textContent = "T* = " + millisecondsText(data.referencePeriod * 1000);
    $("intervalSpectrumBadge").textContent = data.p + "f₁ ↔ " + data.q + "f₂";
    const cents = (data.cents > 0 ? "+" : "") + data.cents.toFixed(3);
    $("intervalCents").textContent = data.exactOverlap ? text("intervalJustStatus") :
      intervalPhrase("intervalEqualStatus", { cents, hz: hzText(data.discrepancyHz) });
    $("intervalVolume").value = String(state.intervalVolume);
    $("intervalVolumeValue").textContent = state.intervalVolume + "%";
    $("intervalButton").classList.toggle("playing", state.intervalPlaying);
    $("intervalButton").setAttribute("aria-pressed", String(state.intervalPlaying));
    $("intervalPlayIcon").textContent = state.intervalPlaying ? "■" : "▶";
    $("intervalPlayLabel").textContent = text(state.intervalPlaying ? "intervalStop" : "intervalPlay");
    $("intervalPlayCaption").textContent = text(state.intervalPlaying ? "stopCaption" : "playCaption");
    for (const [selector, attribute, active] of [
      ["[data-interval-ratio]", "intervalRatio", state.intervalRatio],
      ["[data-interval-tuning]", "intervalTuning", state.intervalTuning],
      ["[data-interval-color]", "intervalColor", state.intervalColor]
    ]) {
      document.querySelectorAll(selector).forEach(button => {
        const selected = button.dataset[attribute] === active;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }
  }

  function stopIntervalSound(immediate = false, message = "intervalStopped") {
    intervalAudio.stop(immediate);
    state.intervalPlaying = false;
    setIntervalStatus(message);
    renderIntervalControls();
  }

  async function toggleIntervalSound() {
    if (state.intervalPlaying) { stopIntervalSound(); return; }
    if (state.mode !== "tuning" || state.tuningKind !== "intervals") return;
    setIntervalStatus("intervalStarting");
    try {
      if (await intervalAudio.start()) {
        state.intervalPlaying = true;
        setIntervalStatus("intervalPlaying");
        renderIntervalControls();
      }
    } catch (error) {
      stopIntervalSound(true, error.message === "unsupported" ? "intervalUnsupported" : "intervalBlocked");
      setIntervalStatus(state.intervalStatus, true);
    }
  }

  function setIntervalBase(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < intervalModel.MIN_BASE_HZ || value > intervalModel.MAX_BASE_HZ) {
      setIntervalStatus("intervalInvalid", true);
      renderIntervalControls();
      return;
    }
    state.intervalBase = value;
    if (state.intervalError) setIntervalStatus(state.intervalPlaying ? "intervalPlaying" : "intervalReady");
    intervalAudio.update();
    renderIntervalControls();
    if (state.mode === "tuning" && state.tuningKind === "intervals") drawIntervalPlots();
  }

  function selectIntervalRatio(ratio) {
    if (!intervalModel.PRESETS.some(preset => preset.ratio === ratio) || state.intervalRatio === ratio) return;
    state.intervalRatio = ratio;
    intervalAudio.update();
    renderIntervalControls();
    if (state.mode === "tuning" && state.tuningKind === "intervals") drawIntervalPlots();
  }

  function selectIntervalTuning(tuning) {
    if (!["just", "equal"].includes(tuning) || state.intervalTuning === tuning) return;
    state.intervalTuning = tuning;
    intervalAudio.update();
    renderIntervalControls();
    if (state.mode === "tuning" && state.tuningKind === "intervals") drawIntervalPlots();
  }

  function selectIntervalColor(color) {
    if (!["pure", "rich"].includes(color) || state.intervalColor === color) return;
    state.intervalColor = color;
    intervalAudio.changeColor();
    renderIntervalControls();
    if (state.mode === "tuning" && state.tuningKind === "intervals") drawIntervalPlots();
  }

  function resetInterval() {
    stopIntervalSound();
    state.intervalRatio = "3:2";
    state.intervalBase = 220;
    state.intervalTuning = "just";
    state.intervalColor = "rich";
    state.intervalVolume = 38;
    setIntervalStatus("intervalReady");
    renderIntervalControls();
    drawPlots();
  }

  function scaleAnalysis() {
    return scaleModel.build({ down: state.scaleDown, up: state.scaleUp,
      tonicK: state.scaleTonicK, baseHz: state.scaleBase });
  }

  function renderScaleControls() {
    const scale = scaleAnalysis();
    $("scaleBaseSlider").value = String(state.scaleBase);
    $("scaleBaseInput").value = String(state.scaleBase);
    $("scaleBaseInput").setAttribute("aria-valuetext", hzText(state.scaleBase));
    $("scaleBaseValue").textContent = hzText(state.scaleBase);
    $("scaleVolume").value = String(state.scaleVolume);
    $("scaleVolumeValue").textContent = state.scaleVolume + "%";
    $("scaleCountValue").textContent = scale.count + " " + text("scaleNotesUnit");
    $("scaleSpiralBadge").textContent = $("scaleCountValue").textContent;
    const range = "−" + scale.down + " … +" + scale.up;
    $("scaleRangeValue").textContent = range;
    $("scaleFourierBadge").textContent = range;
    $("scaleTonicValue").textContent = hzText(scale.tonicHz);
    $("scaleClosureValue").textContent = (scale.closureCents < 0 ? "−" : "+") +
      Math.abs(scale.closureCents).toFixed(2) + " " + (state.language === "mn" ? "цент" : "cents");
    $("scaleGapsValue").textContent = scale.gaps.map(gap => Math.round(gap)).join(" · ") +
      " " + (state.language === "mn" ? "цент" : "cents");
    $("scaleOctaveValue").textContent = scale.count + " · " + scale.octaveCount;
    $("scaleGapToggle").checked = state.scaleShowGap;
    $("scaleClosureFact").hidden = !state.scaleShowGap;
    $("scaleGapInfo").hidden = !state.scaleShowGap;
    $("scaleGapPanel").hidden = !state.scaleShowGap;
    if (state.scaleShowGap) {
      const gap = scaleModel.returnGap(scale);
      const signed = (value, decimals) => (value < 0 ? "−" : "+") + Math.abs(value).toFixed(decimals);
      const cents = signed(gap.signedCents, 2);
      const angle = signed(gap.angleDegrees, 2);
      $("scaleGapInfo").textContent = intervalPhrase("scaleGapInfo", {
        count: scale.count, direction: text(gap.direction < 0 ? "scaleGapDirectionDown" : "scaleGapDirectionUp"),
        ghost: (gap.ghostK > 0 ? "+" : "") + gap.ghostK,
        octaves: gap.octaveCount, cents, angle
      });
      $("scaleGapSummary").textContent = intervalPhrase("scaleGapSummary", {
        name: text(gap.isPythagoreanComma ? "scaleGapPythagorean" : "scaleGapOther"),
        cents, angle, beats: Math.abs(gap.toHz - gap.fromHz).toFixed(2)
      });
    }
    $("scaleGapButton").textContent = text(state.scaleGapPlaying ? "scaleGapStop" : "scaleGapPlay");
    $("scaleGapButton").classList.toggle("playing", state.scaleGapPlaying);
    $("scaleGapButton").setAttribute("aria-pressed", String(state.scaleGapPlaying));
    renderScaleNow();
    $("scaleButton").classList.toggle("playing", state.scalePlaying);
    $("scaleButton").setAttribute("aria-pressed", String(state.scalePlaying));
    $("scalePlayIcon").textContent = state.scalePlaying ? "■" : "▶";
    $("scalePlayLabel").textContent = text(state.scalePlaying ? "scaleStop" : "scalePlay");
    $("scalePlayCaption").textContent = text(state.scalePlaying ? "stopCaption" : "scalePlayCaption");
    $("scaleRemoveDown").disabled = state.scaleDown === 0;
    $("scaleRemoveUp").disabled = state.scaleUp === 0;
    $("scaleAddDown").disabled = scale.count >= scaleModel.MAX_NOTES || state.scaleDown >= 11;
    $("scaleAddUp").disabled = scale.count >= scaleModel.MAX_NOTES || state.scaleUp >= 11;
    document.querySelectorAll("[data-scale-preset]").forEach(button => {
      const preset = scaleModel.PRESETS.find(p => p.id === button.dataset.scalePreset);
      const selected = preset.down === state.scaleDown && preset.up === state.scaleUp;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-scale-tonic]").forEach(button => {
      const index = Number(button.dataset.scaleTonic);
      const note = scale.notes[index];
      button.hidden = !note;
      if (!note) return;
      button.textContent = (index + 1) + " · " + note.numerator + "/" + note.denominator;
      button.setAttribute("title", hzText(note.hz) + " · k=" + note.k);
      const selected = note.k === scale.tonicK;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function renderScaleNow() {
    const current = scaleActive;
    const label = $("scaleNowValue");
    if (state.scalePlaying && current) {
      const note = scaleAnalysis().chain.find(item => item.k === current.k);
      label.textContent = intervalPhrase("scaleNowPlaying", {
        step: (current.k > 0 ? "+" : "") + current.k,
        ratio: note.numerator + "/" + note.denominator,
        octave: current.octaveUp ? text("scaleNowUpperOctave") : ""
      });
    } else label.textContent = text("scaleNowIdle");
    label.classList.toggle("active", state.scalePlaying && Boolean(current));
  }

  function stopScaleTracking() {
    if (scaleFrame !== null) window.cancelAnimationFrame(scaleFrame);
    scaleFrame = null;
    scaleActive = null;
    renderScaleNow();
    if (state.mode === "tuning" && state.tuningKind === "scales") drawScalePlots();
  }

  function followScalePlayback() {
    scaleFrame = null;
    const voice = scaleAudio.currentVoice;
    if (!state.scalePlaying || !voice || state.mode !== "tuning" || state.tuningKind !== "scales") return;
    const elapsed = Math.max(0, audio.context.currentTime - voice.startedAt);
    const index = Math.floor(elapsed / scaleModel.STEP_SECONDS);
    const current = elapsed - index * scaleModel.STEP_SECONDS < scaleModel.NOTE_SECONDS ?
      voice.steps[index] || null : null;
    if (current !== scaleActive) {
      scaleActive = current;
      renderScaleNow();
      drawScalePlots();
    }
    if (index < voice.steps.length) scaleFrame = window.requestAnimationFrame(followScalePlayback);
  }

  function stopScaleSound(immediate = false, message = "scaleStopped") {
    scaleAudio.stop(immediate);
    state.scalePlaying = false;
    state.scaleGapPlaying = false;
    stopScaleTracking();
    setScaleStatus(message);
    renderScaleControls();
  }

  async function toggleScaleSound() {
    if (state.scalePlaying) { stopScaleSound(); return; }
    if (state.mode !== "tuning" || state.tuningKind !== "scales") return;
    if (state.scaleGapPlaying) stopScaleSound(true, "scaleReady");
    setScaleStatus("scaleStarting");
    try {
      if (await scaleAudio.start(scaleAnalysis())) {
        state.scalePlaying = true;
        setScaleStatus("scalePlaying");
        renderScaleControls();
        followScalePlayback();
      }
    } catch (error) {
      stopScaleSound(true, error.message === "unsupported" ? "scaleUnsupported" : "scaleBlocked");
      setScaleStatus(state.scaleStatus, true);
    }
  }

  async function toggleScaleGapSound() {
    if (state.scaleGapPlaying) { stopScaleSound(); return; }
    if (!state.scaleShowGap || state.mode !== "tuning" || state.tuningKind !== "scales") return;
    if (state.scalePlaying) stopScaleSound(true, "scaleReady");
    setScaleStatus("scaleStarting");
    try {
      if (await scaleAudio.startGap(scaleAnalysis())) {
        state.scaleGapPlaying = true;
        setScaleStatus("scaleGapPlaying");
        renderScaleControls();
      }
    } catch (error) {
      stopScaleSound(true, error.message === "unsupported" ? "scaleUnsupported" : "scaleBlocked");
      setScaleStatus(state.scaleStatus, true);
    }
  }

  function setScaleShowGap(checked) {
    if (state.scaleGapPlaying && !checked) stopScaleSound(true, "scaleReady");
    state.scaleShowGap = Boolean(checked);
    renderScaleControls();
    if (state.mode === "tuning" && state.tuningKind === "scales") drawScalePlots();
  }

  function setScaleBase(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < scaleModel.MIN_BASE_HZ || value > scaleModel.MAX_BASE_HZ) {
      setScaleStatus("scaleInvalid", true);
      renderScaleControls();
      return;
    }
    if (state.scaleBase === value) return;
    stopScaleSound();
    state.scaleBase = value;
    setScaleStatus("scaleReady");
    renderScaleControls();
    drawPlots();
  }

  function selectScalePreset(id) {
    const preset = scaleModel.PRESETS.find(item => item.id === id);
    if (!preset) return;
    stopScaleSound();
    state.scaleDown = preset.down;
    state.scaleUp = preset.up;
    if (state.scaleTonicK < -preset.down || state.scaleTonicK > preset.up) state.scaleTonicK = 0;
    setScaleStatus("scaleReady");
    renderScaleControls();
    drawPlots();
  }

  function changeScaleBoundary(direction, delta) {
    const field = direction === "down" ? "scaleDown" : "scaleUp";
    const next = state[field] + delta;
    if (!Number.isInteger(next) || next < 0 || next > 11 ||
        next + (direction === "down" ? state.scaleUp : state.scaleDown) + 1 > scaleModel.MAX_NOTES) return;
    stopScaleSound();
    state[field] = next;
    if (state.scaleTonicK < -state.scaleDown || state.scaleTonicK > state.scaleUp) state.scaleTonicK = 0;
    setScaleStatus("scaleReady");
    renderScaleControls();
    drawPlots();
  }

  function selectScaleTonic(index) {
    const note = scaleAnalysis().notes[index];
    if (!note || note.k === state.scaleTonicK) return;
    stopScaleSound();
    state.scaleTonicK = note.k;
    setScaleStatus("scaleReady");
    renderScaleControls();
    drawPlots();
  }

  function resetScale() {
    stopScaleSound();
    state.scaleDown = 0;
    state.scaleUp = 4;
    state.scaleTonicK = 0;
    state.scaleBase = 220;
    state.scaleVolume = 38;
    state.scaleShowGap = false;
    setScaleStatus("scaleReady");
    renderScaleControls();
    drawPlots();
  }

  function limit5Notes() {
    return state.limit5Coords.length ? limit5Model.selected(state.limit5Coords, state.limit5Base) : [];
  }

  function limit5Name(note) {
    return ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"][note.tetStep];
  }

  function limit5CommaName() {
    return state.language === "mn" ? state.limit5Comma === "e" ? "Ми" : "Ре" :
      state.limit5Comma.toUpperCase();
  }

  function renderLimit5Now() {
    const label = $("limit5Now");
    const active = limit5Active;
    if (state.limit5Comparing) {
      label.textContent = intervalPhrase("limit5NowCompare", { name: limit5CommaName() });
    } else if (state.limit5Playing && active === "all") label.textContent = text("limit5NowChord");
    else if (state.limit5Playing && active) {
      label.textContent = intervalPhrase("limit5NowPlaying", {
        ratio: active.numerator + "/" + active.denominator, hz: hzText(active.hz)
      });
    } else label.textContent = text("limit5NowIdle");
    label.classList.toggle("active", (state.limit5Playing || state.limit5Comparing) && Boolean(active));
  }

  function renderLimit5Controls() {
    const notes = limit5Notes();
    const countText = notes.length + " " + text("scaleNotesUnit");
    $("limit5Count").textContent = countText;
    $("limit5LatticeBadge").textContent = countText;
    $("limit5OctaveBadge").textContent = notes.map(limit5Name).join(" · ") || "—";
    $("limit5BaseSlider").value = String(state.limit5Base);
    $("limit5BaseInput").value = String(state.limit5Base);
    $("limit5BaseInput").setAttribute("aria-valuetext", hzText(state.limit5Base));
    $("limit5BaseValue").textContent = hzText(state.limit5Base);
    $("limit5Volume").value = String(state.limit5Volume);
    $("limit5VolumeValue").textContent = state.limit5Volume + "%";
    $("limit5TetGuides").checked = state.limit5TetGuides;
    $("limit5Button").classList.toggle("playing", state.limit5Playing);
    $("limit5Button").setAttribute("aria-pressed", String(state.limit5Playing));
    $("limit5PlayIcon").textContent = state.limit5Playing ? "■" : "▶";
    $("limit5PlayLabel").textContent = text(state.limit5Playing ? "limit5Stop" : "limit5Play");
    $("limit5PlayCaption").textContent = text(state.limit5Playing ? "stopCaption" : "limit5PlayCaption");
    $("limit5CompareButton").textContent = text(state.limit5Comparing ? "limit5CompareStop" : "limit5Compare");
    $("limit5CompareButton").setAttribute("aria-pressed", String(state.limit5Comparing));
    $("limit5CompareButton").classList.toggle("playing", state.limit5Comparing);
    document.querySelectorAll("[data-limit5-preset]").forEach(button => {
      const selected = button.dataset.limit5Preset === state.limit5Preset;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-limit5-mode]").forEach(button => {
      const selected = button.dataset.limit5Mode === state.limit5Mode;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-limit5-comma]").forEach(button => {
      const selected = button.dataset.limit5Comma === state.limit5Comma;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const gap = limit5Model.comparison(state.limit5Comma, state.limit5Base);
    const fraction = note => note.numerator + "/" + note.denominator;
    $("limit5CommaFact").textContent = intervalPhrase("limit5CommaFact", {
      name: limit5CommaName(), just: fraction(gap.just), pyth: fraction(gap.pyth), cents: gap.cents.toFixed(2)
    });
    $("limit5BeatFact").textContent = intervalPhrase("limit5BeatFact", {
      low: frequencyText(gap.just.hz), high: frequencyText(gap.pyth.hz), beats: gap.beatHz.toFixed(2)
    });
    $("limit5RulerJust").textContent = fraction(gap.just);
    $("limit5RulerPyth").textContent = fraction(gap.pyth);
    $("limit5RulerValue").textContent = intervalPhrase("limit5RulerValue", { cents: gap.cents.toFixed(2) });
    renderLimit5Now();
  }

  function stopLimit5Tracking() {
    if (limit5Frame !== null) window.cancelAnimationFrame(limit5Frame);
    limit5Frame = null;
    limit5Active = null;
    renderLimit5Now();
    if (state.mode === "tuning" && state.tuningKind === "limit5") drawLimit5Plots();
  }

  function followLimit5Playback() {
    limit5Frame = null;
    const voice = limit5Audio.currentVoice;
    if (!state.limit5Playing || !voice || state.mode !== "tuning" || state.tuningKind !== "limit5") return;
    const elapsed = Math.max(0, audio.context.currentTime - voice.startedAt);
    const next = voice.mode === "chord" ? "all" :
      elapsed % limit5Model.STEP_SECONDS < limit5Model.NOTE_SECONDS ?
        voice.notes[Math.floor(elapsed / limit5Model.STEP_SECONDS)] || null : null;
    if (next !== limit5Active) {
      limit5Active = next;
      renderLimit5Now();
      drawLimit5Plots();
    }
    const duration = voice.mode === "chord" ? limit5Model.CHORD_SECONDS : voice.notes.length * limit5Model.STEP_SECONDS;
    if (elapsed < duration) limit5Frame = window.requestAnimationFrame(followLimit5Playback);
  }

  function stopLimit5Sound(immediate = false, message = "limit5Stopped") {
    limit5Audio.stop(immediate);
    state.limit5Playing = false;
    state.limit5Comparing = false;
    stopLimit5Tracking();
    setLimit5Status(message);
    renderLimit5Controls();
  }

  async function toggleLimit5Sound() {
    if (state.limit5Playing) { stopLimit5Sound(); return; }
    if (state.mode !== "tuning" || state.tuningKind !== "limit5") return;
    if (!state.limit5Coords.length) { setLimit5Status("limit5NoNotes", true); return; }
    if (state.limit5Comparing) stopLimit5Sound(true);
    setLimit5Status("limit5Starting");
    try {
      const notes = state.limit5Mode === "chord" ? limit5Model.chordVoicing(state.limit5Coords, state.limit5Base) : limit5Notes();
      if (await limit5Audio.start(notes, state.limit5Mode)) {
        state.limit5Playing = true;
        setLimit5Status("limit5Playing");
        renderLimit5Controls();
        followLimit5Playback();
      }
    } catch (_) { stopLimit5Sound(true, "limit5Blocked"); setLimit5Status("limit5Blocked", true); }
  }

  async function toggleLimit5Compare() {
    if (state.limit5Comparing) { stopLimit5Sound(); return; }
    if (state.mode !== "tuning" || state.tuningKind !== "limit5") return;
    if (state.limit5Playing) stopLimit5Sound(true);
    setLimit5Status("limit5Starting");
    try {
      if (await limit5Audio.start([], "compare", true)) {
        state.limit5Comparing = true;
        limit5Active = "comma";
        setLimit5Status("limit5Comparing");
        renderLimit5Controls();
        drawLimit5Plots();
      }
    } catch (_) { stopLimit5Sound(true, "limit5Blocked"); setLimit5Status("limit5Blocked", true); }
  }

  function selectLimit5Preset(preset) {
    if (!limit5Model.PRESETS[preset]) return;
    stopLimit5Sound();
    state.limit5Coords = limit5Model.PRESETS[preset].map(pair => [...pair]);
    state.limit5Preset = preset;
    setLimit5Status("limit5Ready");
    renderLimit5Controls();
    drawPlots();
  }

  function toggleLimit5Point(m, n) {
    if (!limit5Model.within(m, n)) return;
    const index = state.limit5Coords.findIndex(pair => pair[0] === m && pair[1] === n);
    if (index < 0 && state.limit5Coords.length >= 12) { setLimit5Status("limit5Limit", true); return; }
    stopLimit5Sound();
    if (index >= 0) state.limit5Coords.splice(index, 1);
    else state.limit5Coords.push([m, n]);
    state.limit5Preset = null;
    setLimit5Status("limit5Ready");
    renderLimit5Controls();
    drawPlots();
  }

  function setLimit5Base(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < 110 || value > 330) {
      setLimit5Status("limit5Invalid", true); renderLimit5Controls(); return;
    }
    if (value === state.limit5Base) return;
    stopLimit5Sound();
    state.limit5Base = value;
    renderLimit5Controls();
    drawPlots();
  }

  function resetLimit5() {
    stopLimit5Sound();
    state.limit5Coords = limit5Model.PRESETS.major.map(pair => [...pair]);
    state.limit5Preset = "major";
    state.limit5Mode = "melody";
    state.limit5Base = 261.63;
    state.limit5Volume = 38;
    state.limit5Comma = "e";
    state.limit5TetGuides = false;
    state.limit5Cursor = [0, 0];
    setLimit5Status("limit5Ready");
    renderLimit5Controls();
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
    $("thereminTimbreHint").textContent = text("timbreNotes")[state.motionTimbre];
    $("thereminVowelGroup").hidden = !isTheremin || state.motionTimbre !== "voice";
    $("thereminOvertoneGroup").hidden = !isTheremin || state.motionTimbre !== "overtones";
    document.querySelectorAll("[data-theremin-vowel]").forEach(button => {
      const active = button.dataset.thereminVowel === state.motionVowel;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("thereminHarmonic").value = String(state.motionHarmonic);
    $("thereminHarmonicValue").textContent = state.motionHarmonic + "f₀ = " +
      hzText(state.motionHarmonic * state.motionHz);
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

  function setMotionVowel(vowel) {
    if (!motionModel.VOWELS.includes(vowel) || vowel === state.motionVowel) return;
    state.motionVowel = vowel;
    if (state.motionPlaying && state.motionKind === "theremin" && state.motionTimbre === "voice") {
      // Change the vocal-tract filter smoothly without restarting the note.
      motionAudio.update();
    }
    renderMotionControls();
    if (state.mode === "motion") drawMotionPlots();
  }

  function setMotionHarmonic(harmonic) {
    if (!Number.isInteger(harmonic) || harmonic < motionModel.MIN_OVERTONE ||
        harmonic > motionModel.MAX_OVERTONE || harmonic === state.motionHarmonic) return;
    state.motionHarmonic = harmonic;
    if (state.motionPlaying && state.motionKind === "theremin" && state.motionTimbre === "overtones") {
      // Move the focused formant to another existing harmonic, not a new voice.
      motionAudio.update();
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
    state.motionVowel = "a";
    state.motionHarmonic = 6;
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
    const isTuning = state.mode === "tuning";
    const isBeats = isMix && state.mixKind === "beats";
    const isHarmonics = isMix && state.mixKind === "harmonics";
    const isIntervals = isTuning && state.tuningKind === "intervals";
    const isScales = isTuning && state.tuningKind === "scales";
    const isLimit5 = isTuning && state.tuningKind === "limit5";
    const isNoise = isMix && state.mixKind === "noise";
    $("pureWorkspace").hidden = isStrike || isSustain || isMotion || isMix || isTuning;
    $("pureChallenge").hidden = isStrike || isSustain || isMotion || isMix || isTuning;
    $("pureExplanation").hidden = isStrike || isSustain || isMotion || isMix || isTuning;
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
    $("intervalWorkspace").hidden = !isIntervals;
    $("intervalChallenge").hidden = !isIntervals;
    $("intervalExplanation").hidden = !isIntervals;
    $("scaleWorkspace").hidden = !isScales;
    $("scaleChallenge").hidden = !isScales;
    $("scaleExplanation").hidden = !isScales;
    $("limit5Workspace").hidden = !isLimit5;
    $("limit5Challenge").hidden = !isLimit5;
    $("limit5Explanation").hidden = !isLimit5;
    $("noiseWorkspace").hidden = !isNoise;
    $("noiseChallenge").hidden = !isNoise;
    $("noiseExplanation").hidden = !isNoise;
    document.querySelectorAll("[data-mix-kind]").forEach(button => {
      const selected = button.dataset.mixKind === state.mixKind;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-tuning-kind]").forEach(button => {
      const selected = button.dataset.tuningKind === state.tuningKind;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    for (const [id, mode] of [["modePure", "pure"], ["modeStrike", "strike"], ["modeSustain", "sustain"],
      ["modeMotion", "motion"], ["modeMix", "mix"], ["modeTuning", "tuning"]]) {
      const selected = state.mode === mode;
      $(id).classList.toggle("active", selected);
      $(id).setAttribute("aria-pressed", String(selected));
    }
    $("pagePhase").textContent = text(isStrike ? "strikePhase" : isSustain ? "sustainPhase" : isMotion ? "motionPhase" :
      isHarmonics ? "harmonicPhase" : isIntervals ? "intervalPhase" : isScales ? "scalePhase" : isLimit5 ? "limit5Phase" :
        isNoise ? "noisePhase" : isMix ? "mixPhase" : "phase");
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
    $("thereminVowels").setAttribute("aria-label", text("thereminVowelsAria"));
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
    $("intervalPresets").setAttribute("aria-label", text("intervalPresetsAria"));
    $("intervalTunings").setAttribute("aria-label", text("intervalTuningAria"));
    $("intervalColors").setAttribute("aria-label", text("intervalColorAria"));
    $("intervalBaseSlider").setAttribute("aria-label", text("intervalBaseSliderAria"));
    $("intervalBaseInput").setAttribute("aria-label", text("intervalBaseInputAria"));
    $("intervalWaveCanvas").setAttribute("aria-label", text("intervalWaveAria"));
    $("intervalSpectrumCanvas").setAttribute("aria-label", text("intervalSpectrumAria"));
    $("scalePresets").setAttribute("aria-label", text("scalePresetsAria"));
    $("scaleTonicChoices").setAttribute("aria-label", text("scaleTonicAria"));
    $("scaleBaseSlider").setAttribute("aria-label", text("scaleBaseSliderAria"));
    $("scaleBaseInput").setAttribute("aria-label", text("scaleBaseInputAria"));
    $("scaleSpiralCanvas").setAttribute("aria-label", text("scaleSpiralAria"));
    $("scaleFourierCanvas").setAttribute("aria-label", text("scaleFourierAria"));
    $("scaleGapCanvas").setAttribute("aria-label", text("scaleGapCanvasAria"));
    $("limit5Presets").setAttribute("aria-label", text("limit5PresetsAria"));
    $("limit5PlaybackModes").setAttribute("aria-label", text("limit5PlaybackAria"));
    $("limit5Commas").setAttribute("aria-label", text("limit5CommaAria"));
    $("limit5LatticeCanvas").setAttribute("aria-label", text("limit5LatticeAria"));
    $("limit5OctaveCanvas").setAttribute("aria-label", text("limit5OctaveAria"));
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
    setIntervalStatus(state.intervalStatus, state.intervalError);
    setScaleStatus(state.scaleStatus, state.scaleError);
    setLimit5Status(state.limit5Status, state.limit5Error);
    setHarmonicStatus(state.harmonicStatus, state.harmonicError);
    setNoiseStatus(state.noiseStatus, state.noiseError);
    renderMode();
    renderStrikeControls();
    renderSustainControls();
    renderMotionControls();
    renderMixControls();
    renderIntervalControls();
    renderScaleControls();
    renderLimit5Controls();
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
    $("strikePitchGroup").hidden = state.strikeKind === "kick" ||
      (state.strikeKind === "pluck" && state.strikeGuitarPlay === "strum");
    $("strikeGuitarGroup").hidden = state.strikeKind !== "pluck";
    $("strikePianoTouchGroup").hidden = state.strikeKind !== "piano";
    $("strikeChordGroup").hidden = state.strikeKind !== "pluck" || state.strikeGuitarPlay !== "strum";
    $("strikePluckPositionGroup").hidden = state.strikeKind !== "pluck";
    $("strikePluckPosition").value = String(Math.round(100 * state.strikePluckPosition));
    $("strikePluckPositionValue").textContent = Math.round(100 * state.strikePluckPosition) + "%";
    $("strikeDrumSizeGroup").hidden = state.strikeKind !== "kick";
    $("strikeDrumTension").value = String(Math.round(state.strikeDrumTension * 100));
    $("strikeDrumTensionValue").textContent = Math.round(state.strikeDrumTension * 100) + "%";
    $("strikeDrumFrequencies").textContent = hzText(Math.round(
      transientModel.kickFrequency(0, state.strikeDrumSize, state.strikeDrumTension)));
    $("strikeStrength").value = String(state.strikeStrength);
    $("strikeStrengthValue").textContent = state.strikeStrength + "%";
    $("strikeDecay").value = String(state.strikeDecay);
    $("strikeDecayValue").textContent = secondsText(state.strikeDecay);
    $("strikeDescription").textContent = text("strikeDesc")[state.strikeKind];
    $("strikeButtonLabel").textContent = text(state.strikeKind === "pluck" ?
      state.strikeGuitarPlay === "strum" ? "strikeStrumButton" : "strikePluckButton" :
      state.strikeKind === "piano" ?
        state.strikePianoTouch === "tap" ? "strikePianoTapButton" : "strikePianoButton" :
        "strikeKickButton");
    document.querySelectorAll("[data-guitar-play]").forEach(button => {
      const selected = button.dataset.guitarPlay === state.strikeGuitarPlay;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-guitar-chord]").forEach(button => {
      const selected = button.dataset.guitarChord === state.strikeChord;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-piano-touch]").forEach(button => {
      const selected = button.dataset.pianoTouch === state.strikePianoTouch;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
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
    $("sustainBreathGroup").hidden = state.sustainKind !== "flute";
    $("sustainBowGroup").hidden = state.sustainKind === "flute";
    $("sustainBreath").value = String(state.sustainBreath);
    $("sustainBreathValue").textContent = state.sustainBreath + "%";
    $("sustainBowPressure").value = String(state.sustainBowPressure);
    $("sustainBowValue").textContent = state.sustainBowPressure + "%";
    $("sustainDetailHint").textContent = text(state.sustainKind === "flute" ?
      "sustainFluteDetailHint" : "sustainDetailHint");
    $("sustainChallengeText").textContent = text(state.sustainKind === "flute" ?
      "sustainChallenge" : "sustainBowChallenge");
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
    state.sustainBreath = sustainModel.DEFAULT_BREATH;
    state.sustainBowPressure = sustainModel.DEFAULT_BOW_PRESSURE;
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
    stopIntervalSound(immediate, message === "hidden" ? "intervalHidden" : "intervalStopped");
    stopScaleSound(immediate, message === "hidden" ? "scaleHidden" : "scaleStopped");
    stopLimit5Sound(immediate, message === "hidden" ? "limit5Hidden" : "limit5Stopped");
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
    if (mode === state.mode || !["pure", "strike", "sustain", "motion", "mix", "tuning"].includes(mode)) return;
    stopAllAudio(false);
    state.mode = mode;
    if (mode === "sustain") setSustainStatus("sustainReady");
    if (mode === "motion") setMotionStatus("motionReady");
    if (mode === "mix") setMixStatus("mixReady");
    if (mode === "tuning") {
      if (state.tuningKind === "intervals") setIntervalStatus("intervalReady");
      else if (state.tuningKind === "scales") setScaleStatus("scaleReady");
      else setLimit5Status("limit5Ready");
    }
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

  function selectTuningKind(kind) {
    if (!["intervals", "scales", "limit5"].includes(kind) || kind === state.tuningKind) return;
    stopAllAudio();
    state.tuningKind = kind;
    if (kind === "intervals") setIntervalStatus("intervalReady");
    else if (kind === "scales") setScaleStatus("scaleReady");
    else setLimit5Status("limit5Ready");
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
    state.strikeDrumTension = 1;
    state.strikeGuitarPlay = "single";
    state.strikeChord = "em";
    state.strikePluckPosition = .22;
    state.strikePianoTouch = "press";
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

    const options = strikeRecipe().options;
    const sampleAt = time => transientModel.plottedSampleAt(state.strikeKind,
      time, state.strikePitch, state.strikeDecay, state.strikeDrumSize, options);
    ctx.strokeStyle = "#1a9b91";
    ctx.lineJoin = "round";
    if (span <= 0.12) {
      // At fine scales, every oscillation is drawn directly, with oversampling.
      const topFrequency = state.strikeKind === "pluck" ?
        (state.strikeGuitarPlay === "strum" ? 4000 : state.strikePitch * 8) :
        state.strikeKind === "piano" ? state.strikePitch * 8.5 :
        transientModel.kickFrequency(0, state.strikeDrumSize, state.strikeDrumTension) * 3.6;
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
      state.strikeKind === "pluck" ?
        (state.strikeGuitarPlay === "strum" ? 4000 :
          Math.min(8000, Math.max(1200, state.strikePitch * 8.3))) :
        Math.max(600, transientModel.kickFrequency(0, state.strikeDrumSize, state.strikeDrumTension) * 4);
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
    const flute = state.sustainKind === "flute";
    const components = flute ? sustainModel.fluteComponents(state.sustainBreath, state.sustainPitch) :
      sustainModel.bowedComponents(state.sustainKind, state.sustainBowPressure, state.sustainPitch);
    ctx.strokeStyle = "#367bd1";
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const t = span * i / count;
      const phase = 2 * Math.PI * state.sustainPitch * t;
      const value = flute ? sustainModel.fluteWaveFromComponents(phase, components) :
        sustainModel.bowedWaveFromComponents(phase, components);
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
    const strength = state.sustainKind === "flute" ? state.sustainBreath : state.sustainBowPressure;
    const partials = sustainModel.partials(state.sustainKind, strength, state.sustainPitch);
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
    const labels = partials.length <= 8 ?
      (w < 315 ? [0, 2, 4, 7] : [0, 1, 2, 3, 4, 5, 6, 7]) :
      (w < 315 ? [0, 5, 11, 17, 23] : [0, 3, 7, 11, 15, 19, 23]);
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
    const sampleRate = motionAudio.contextOwner.context?.sampleRate || motionModel.PLOT_SAMPLE_RATE;
    const spectrum = motionModel.timbreSpectrum(timbre, state.motionHz,
      state.motionVowel, state.motionHarmonic, sampleRate);
    for (let i = 0; i <= 350; i++) {
      const fraction = i / 350;
      const x = left + fraction * (right - left);
      const phase = 2 * Math.PI * state.motionHz * fraction * 0.02;
      const y = middle - amplitude * motionModel.timbreWaveAt(phase, timbre, spectrum);
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
    const sampleRate = motionAudio.contextOwner.context?.sampleRate || motionModel.PLOT_SAMPLE_RATE;
    const partials = motionModel.timbreComponents(timbre, state.motionHz,
      state.motionVowel, state.motionHarmonic, sampleRate).slice(0, 16);
    const peak = Math.max(1e-9, ...partials.map(c => c.magnitude));
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
      if (partials[i].magnitude > 0) {
        const focused = timbre === "overtones" && i + 1 === state.motionHarmonic;
        ctx.strokeStyle = focused ? "#e18c30" : i === 0 ? "#278bb8" : "#16998f";
        ctx.lineWidth = Math.min(9, (right - left) / (partials.length * 2.4));
        ctx.beginPath(); ctx.moveTo(x, bottom);
        ctx.lineTo(x, bottom - (bottom - top) * partials[i].magnitude / peak * state.motionLevel);
        ctx.stroke();
      }
      ctx.fillStyle = "#7489a1";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      if (i === 0 || i === 1 || (i + 1) % 4 === 0 ||
          (timbre === "overtones" && i + 1 === state.motionHarmonic)) {
        ctx.fillText(i === 0 ? "f₀" : (i + 1) + "f₀", x, height - 11);
      }
    }
    ctx.fillStyle = "#7489a1";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(hzText(state.motionHz) + " – " + hzText(partials.length * state.motionHz), left, 13);
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

  function drawIntervalWave() {
    const { ctx, width, height } = plotContext($("intervalWaveCanvas"));
    const left = 61, right = width - 15, top = 25, bottom = height - 32;
    const w = right - left, h = bottom - top;
    const data = intervalAnalysis(), duration = data.referencePeriod;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const rows = [
      { label: "f₁", color: "#347cc9" },
      { label: "f₂", color: "#e09145" },
      { label: "f₁+f₂", color: "#19877d" }
    ];
    const count = Math.max(900, Math.ceil(data.highHz * intervalModel.PARTIAL_COUNT * duration * 14));
    const partials = intervalModel.partialAmplitudes(state.intervalColor);
    const samples = [new Float64Array(count + 1), new Float64Array(count + 1)];
    for (let i = 0; i <= count; i++) {
      const t = duration * i / count;
      for (let n = 0; n < partials.length; n++) {
        if (!partials[n]) continue;
        samples[0][i] += partials[n] * Math.sin(2 * Math.PI * (n + 1) * data.baseHz * t);
        samples[1][i] += partials[n] * Math.sin(2 * Math.PI * (n + 1) * data.highHz * t);
      }
    }
    rows.forEach(({ label, color }, row) => {
      const center = top + h * (row + 0.5) / 3;
      const amplitude = h / 3 * 0.36;
      ctx.strokeStyle = "#e2eaf1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, center);
      ctx.lineTo(right, center);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 7, center);
      ctx.strokeStyle = color;
      ctx.lineWidth = row === 2 ? 2.5 : 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const fraction = i / count;
        const low = samples[0][i], high = samples[1][i];
        const sample = row === 0 ? low : row === 1 ? high : (low + high) / 2;
        const x = left + w * fraction, y = center - amplitude * sample;
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.fillStyle = "#7489a1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    const ticks = width < 340 ? 2 : 4;
    for (let i = 0; i <= ticks; i++) {
      ctx.fillText(millisecondsText(duration * 1000 * i / ticks),
        left + w * i / ticks, height - 11);
    }
    $("intervalWaveFoot").textContent = data.exactOverlap ?
      intervalPhrase("intervalWaveFootJust", { low: data.lowerCycles, high: data.upperCycles }) :
      text("intervalWaveFootEqual");
  }

  function drawIntervalSpectrum() {
    const { ctx, width, height } = plotContext($("intervalSpectrumCanvas"));
    const left = 59, right = width - 14, top = 22, bottom = height - 32;
    const w = right - left, h = bottom - top;
    const data = intervalAnalysis();
    $("intervalSpectrumHint").textContent = text(state.intervalColor === "pure" ?
      "intervalSpectrumHintPure" : "intervalSpectrumHint");
    const maxHz = intervalModel.PARTIAL_COUNT * data.highHz * 1.06;
    drawFrame(ctx, width, height, left, right, top, bottom);
    const xFor = hz => left + hz / maxHz * w;
    const rows = [
      { label: "f₁", hz: data.baseHz, index: data.p, color: "#347cc9", y: top + h * 0.44 },
      { label: "f₂", hz: data.highHz, index: data.q, color: "#e09145", y: top + h * 0.89 }
    ];
    rows.forEach(row => {
      ctx.fillStyle = row.color;
      ctx.font = "12px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(row.label, 8, row.y - 11);
      ctx.strokeStyle = "#c7d5e3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, row.y);
      ctx.lineTo(right, row.y);
      ctx.stroke();
      const lines = intervalModel.spectrum(row.hz, state.intervalColor);
      for (const line of lines) {
        const x = xFor(line.hz);
        const length = h * 0.33 * line.strength;
        ctx.strokeStyle = row.color;
        ctx.lineWidth = line.harmonic === row.index ? 4 : 2.3;
        ctx.beginPath();
        ctx.moveTo(x, row.y);
        ctx.lineTo(x, row.y - length);
        ctx.stroke();
        if (line.harmonic === row.index) {
          ctx.strokeStyle = "#147d72";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(x, row.y - length, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });
    ctx.fillStyle = "#788da2";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    const ticks = width < 350 ? 2 : 4;
    for (let i = 0; i <= ticks; i++) {
      ctx.fillText(hzText(maxHz * i / ticks), left + w * i / ticks, height - 11);
    }
    $("intervalSpectrumFoot").textContent = state.intervalColor === "pure" &&
      (data.p !== 1 || data.q !== 1) ? text("intervalSpectrumPure") :
      data.exactOverlap ? intervalPhrase("intervalSpectrumJust", {
        p: data.p, q: data.q, low: frequencyText(data.baseHz), high: frequencyText(data.highHz)
      }) : intervalPhrase("intervalSpectrumEqual", {
        p: data.p, q: data.q, low: frequencyText(data.baseHz), high: frequencyText(data.highHz),
        delta: hzText(data.discrepancyHz)
      });
  }

  function drawIntervalPlots() {
    drawIntervalWave();
    drawIntervalSpectrum();
  }

  function drawScaleSpiral() {
    const scale = scaleAnalysis();
    const gap = state.scaleShowGap ? scaleModel.returnGap(scale) : null;
    const { ctx, width, height } = plotContext($("scaleSpiralCanvas"));
    const centerX = width / 2, centerY = height / 2;
    const octaveStep = Math.log2(3 / 2);
    const firstOctave = -scale.down * octaveStep;
    const lastOctave = scale.up * octaveStep;
    const radialMin = gap ? Math.min(firstOctave, gap.ghostK * octaveStep) : firstOctave;
    const radialMax = gap ? Math.max(lastOctave, gap.ghostK * octaveStep) : lastOctave;
    const radialSpan = radialMax - radialMin;
    const inner = 25, outer = Math.max(62, Math.min(width, height) / 2 - 43);
    const radiusAt = octave => radialSpan > 0 ?
      inner + (octave - radialMin) / radialSpan * (outer - inner) : (inner + outer) / 2;
    const positionAt = octave => {
      const angle = -Math.PI / 2 + 2 * Math.PI * octave;
      const radius = radiusAt(octave);
      return { x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle), angle };
    };

    // Each full turn is exactly one octave, but a fifth advances only 210.59°.
    ctx.strokeStyle = "#e5edf5";
    ctx.lineWidth = 1;
    for (let octave = Math.ceil(radialMin); octave <= Math.floor(radialMax); octave++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusAt(octave), 0, 2 * Math.PI);
      ctx.stroke();
    }
    // Rays represent the octave-reduced angle: different fifth-chain steps
    // are encountered in pitch order by sweeping clockwise around the center.
    for (const note of scale.chain) {
      const angle = positionAt(note.k * octaveStep).angle;
      const tonic = note.k === scale.tonicK;
      const active = scaleActive && scaleActive.k === note.k;
      ctx.strokeStyle = active ? "#e8a23b" : tonic ? "#a0d9cc" : "#d7e2ec";
      ctx.lineWidth = active ? 2.7 : tonic ? 1.5 : .85;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + (outer + 7) * Math.cos(angle),
        centerY + (outer + 7) * Math.sin(angle));
      ctx.stroke();
    }
    ctx.strokeStyle = "#4b8bd0";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    // Draw the solid spiral only through actual notes; the extra fifth is
    // deliberately shown as a separate dashed continuation when enabled.
    const chainSpan = lastOctave - firstOctave;
    const samples = Math.max(40, Math.ceil(chainSpan * 125));
    for (let i = 0; i <= samples; i++) {
      const octave = firstOctave + chainSpan * i / samples;
      const point = positionAt(octave);
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    if (gap) {
      // The extra point is NOT part of the playable scale. For the all-down
      // preset it continues toward k=-5, never introduces a positive fifth.
      const from = (gap.direction > 0 ? lastOctave : firstOctave);
      const to = gap.ghostK * octaveStep;
      ctx.strokeStyle = "#d2933a";
      ctx.lineWidth = 2.3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const p = positionAt(from + (to - from) * i / 28);
        if (!i) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      const ghost = positionAt(to);
      ctx.strokeStyle = "#be7d24";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, 7.5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillStyle = "#a56b24";
      ctx.textAlign = "center";
      const ghostLabel = (gap.ghostK > 0 ? "+" : "") + gap.ghostK + " ?";
      ctx.fillText(ghostLabel, ghost.x + 17 * Math.cos(ghost.angle),
        ghost.y + 17 * Math.sin(ghost.angle));

      // Project the start and ghost onto ONE octave ring. Their small angular
      // separation is the gap, irrespective of how many spiral turns intervene.
      const startAngle = positionAt(gap.startK * octaveStep).angle;
      const deltaAngle = gap.angleDegrees * Math.PI / 180;
      const ring = outer + 13;
      ctx.strokeStyle = "#d2933a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ring, startAngle,
        startAngle + deltaAngle, deltaAngle < 0);
      ctx.stroke();
      for (const [angle, fill] of [[startAngle, "#149588"],
        [startAngle + deltaAngle, "#d2933a"]]) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(centerX + ring * Math.cos(angle), centerY + ring * Math.sin(angle),
          4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const compact = Math.min(width, height) < 300 || scale.count >= 9;
    for (const note of scale.chain) {
      const point = positionAt(note.k * octaveStep);
      const active = scaleActive && scaleActive.k === note.k;
      const tonic = note.k === scale.tonicK;
      const color = tonic ? "#139786" : note.k === 0 ? "#df9b43" : "#2e7ec5";
      if (active) {
        ctx.strokeStyle = "#ecae35";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 13, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, active ? 8 : tonic ? 7.5 : 6, 0, 2 * Math.PI);
      ctx.fill();
      const labelDistance = compact ? 15 : 18;
      const lx = point.x + labelDistance * Math.cos(point.angle);
      const ly = point.y + labelDistance * Math.sin(point.angle);
      const number = (note.k > 0 ? "+" : "") + note.k;
      ctx.fillStyle = tonic ? "#148575" : "#3e6080";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(number, lx, ly - (compact ? 0 : 6));
      if (!compact) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillText(note.numerator + "/" + note.denominator, lx, ly + 8);
      }
    }
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#7890a7";
    ctx.fillText("×2", centerX, centerY);
  }

  function drawScaleFourier() {
    const scale = scaleAnalysis();
    const canvas = $("scaleFourierCanvas");
    canvas.style.height = Math.max(260, 78 + scale.count * 34) + "px";
    const { ctx, width, height } = plotContext(canvas);
    const left = width < 470 ? 60 : 86, right = width - 18;
    const top = 27, bottom = height - 37;
    // Frame all original fundamentals and only their nearest two partials;
    // later harmonics are intentionally allowed to extend beyond the canvas.
    const minLog = -.55, maxLog = (scale.count - 1) * Math.log2(3 / 2) + 1.65;
    const xAt = frequency => left + (Math.log2(frequency) - minLog) /
      (maxLog - minLog) * (right - left);
    const yAt = index => bottom - (scale.count > 1 ? index / (scale.count - 1) : .5) * (bottom - top);
    // The lower chain endpoint is the logarithmic frequency reference (f₀).
    // One highlighted octave is anchored to the chosen tonic, so the sounding
    // melody moves left to right within this window (then back).
    const windowStart = Math.pow(3 / 2, scale.tonicK + scale.down);
    const windowLeft = xAt(windowStart), windowRight = xAt(2 * windowStart);
    ctx.fillStyle = "#eaf7f0";
    ctx.fillRect(windowLeft, top - 12, windowRight - windowLeft, bottom - top + 21);
    ctx.strokeStyle = "#8bc8aa";
    ctx.lineWidth = 1.2;
    for (const edge of [windowLeft, windowRight]) {
      ctx.beginPath();
      ctx.moveTo(edge, top - 12);
      ctx.lineTo(edge, bottom + 9);
      ctx.stroke();
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = "#3f917b";
    ctx.fillText(text("scaleWindowLabel"), (windowLeft + windowRight) / 2, 10);
    const every = Math.max(1, Math.ceil((maxLog - minLog) / (width < 470 ? 4 : 7)));
    for (let power = 0; power <= Math.floor(maxLog); power += every) {
      const x = xAt(2 ** power);
      ctx.strokeStyle = "#e7edf4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, top - 12);
      ctx.lineTo(x, bottom + 7);
      ctx.stroke();
      ctx.fillStyle = "#6e849c";
      ctx.fillText(power === 0 ? "f₀" : "2^" + power + " f₀", x, height - 17);
    }

    // The third partial of each lower row equals the second partial above it.
    for (let i = 0; i < scale.count - 1; i++) {
      const fundamental = Math.pow(3 / 2, i);
      const sharedX = xAt(3 * fundamental);
      ctx.strokeStyle = "#88c4b7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sharedX, yAt(i));
      ctx.lineTo(sharedX, yAt(i + 1));
      ctx.stroke();
    }
    for (const [index, note] of scale.chain.entries()) {
      const fundamental = Math.pow(3 / 2, index);
      const y = yAt(index);
      const isTonic = note.k === scale.tonicK;
      const isActive = scaleActive && scaleActive.k === note.k;
      const color = isTonic ? "#149588" : note.k === 0 ? "#dc963f" : "#3381c7";
      ctx.strokeStyle = "#d4e0ec";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillStyle = isTonic ? "#148575" : "#456983";
      ctx.textAlign = "right";
      ctx.fillText((note.k > 0 ? "+" : "") + note.k, left - 10, y - (scale.count <= 7 ? 7 : 0));
      if (scale.count <= 7) {
        ctx.font = "9px system-ui, sans-serif";
        ctx.fillText(note.numerator + "/" + note.denominator, left - 10, y + 8);
      }
      // Pale octave copies are playable transpositions of this fundamental,
      // but are not simultaneous extra components in its spectrum.
      for (let copy = 1; copy <= Math.ceil(Math.log2(fundamental)) + 1; copy++) {
        const ghost = fundamental / 2 ** copy;
        if (Math.log2(ghost) < minLog) continue;
        ctx.fillStyle = "#b9c3cd";
        ctx.beginPath();
        ctx.arc(xAt(ghost), y, 3.2, 0, 2 * Math.PI);
        ctx.fill();
      }
      // Physical harmonics (and the actual fundamental) lie to the right.
      for (let harmonic = 1; harmonic <= 8; harmonic++) {
        const x = xAt(fundamental * harmonic);
        if (x > right + 8) break;
        const size = harmonic === 1 ? 6.5 : 4.2 - harmonic * .17;
        if (harmonic === 1) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = harmonic <= 3 ? "#3497b5" : "#82b7cf";
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x, y + size);
          ctx.lineTo(x - size, y);
          ctx.lineTo(x, y - size);
          ctx.fill();
        }
      }
      const folded = windowStart * scale.ordered.find(item => item.k === note.k).relativeRatio;
      const foldedX = xAt(folded);
      const isUnshifted = Math.abs(folded - fundamental) < fundamental * 1e-9;
      // Every row contributes exactly one pitch to the chosen octave,
      // whether its marker is the original fundamental or a gray octave copy.
      if (!isUnshifted) {
        ctx.fillStyle = "#a7b4c2";
        ctx.beginPath();
        ctx.arc(foldedX, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.strokeStyle = isTonic ? "#148575" : "#729f96";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(foldedX, y, 7.3, 0, 2 * Math.PI);
      ctx.stroke();
      // The top tonic is represented by its octave-up copy at the right edge.
      if (isTonic) {
        ctx.fillStyle = "#a7b4c2";
        ctx.beginPath();
        ctx.arc(windowRight, y, 4.2, 0, 2 * Math.PI);
        ctx.fill();
      }
      // Only the sounding pitch marker inside the selected octave glows.
      // The original fundamental and the entire row never change color.
      if (isActive) {
        const activeX = scaleActive.octaveUp ? windowRight : foldedX;
        ctx.fillStyle = "#e3a33b";
        ctx.beginPath();
        ctx.arc(activeX, y, 6.7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#bd7917";
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(activeX, y, 11.5, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }

  function drawScaleGap() {
    if (!state.scaleShowGap) return;
    const gap = scaleModel.returnGap(scaleAnalysis());
    const { ctx, width, height } = plotContext($("scaleGapCanvas"));
    const left = width < 470 ? 28 : 52, right = width - 24;
    const paddingCents = Math.max(15, Math.abs(gap.signedCents) * .19);
    const min = Math.min(0, gap.signedCents) - paddingCents;
    const max = Math.max(0, gap.signedCents) + paddingCents;
    const xAt = cents => left + (cents - min) / (max - min) * (right - left);
    const center = Math.round(height * .49);
    ctx.strokeStyle = "#ccdce9";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left, center);
    ctx.lineTo(right, center);
    ctx.stroke();
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = "#627d96";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 4; i++) {
      const cents = min + (max - min) * i / 4;
      const x = xAt(cents);
      ctx.strokeStyle = "#e1eaf2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, center - 16);
      ctx.lineTo(x, center + 17);
      ctx.stroke();
      ctx.fillText((cents < 0 ? "−" : "+") + Math.abs(cents).toFixed(0), x, height - 8);
    }
    ctx.strokeStyle = "#d29238";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xAt(0), center);
    ctx.lineTo(xAt(gap.signedCents), center);
    ctx.stroke();
    for (const [cents, fill, label, labelY] of [
      [0, "#159586", text("scaleGapFrom"), center - 29],
      [gap.signedCents, "#d2933a", text("scaleGapGhost"), center + 31]
    ]) {
      const x = xAt(cents);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, center, 6.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(label, x, labelY);
    }
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "#627d96";
    ctx.fillText(text("scaleGapUnit"), right, height - 8);
  }

  function drawScalePlots() {
    drawScaleSpiral();
    drawScaleFourier();
    drawScaleGap();
  }

  function limit5GridPoint(m, n, width, height) {
    return { x: width * (.335 + .115 * (m + .5 * n)), y: height * (.55 - .17 * n) };
  }

  function drawLimit5Lattice() {
    const { ctx, width, height } = plotContext($("limit5LatticeCanvas"));
    const lattice = limit5Model.lattice(state.limit5Base);
    const chosen = new Set(state.limit5Coords.map(([m, n]) => limit5Model.key(m, n)));
    const xy = note => limit5GridPoint(note.m, note.n, width, height);
    const line = (a, b, color, thickness = 1.2, dash = []) => {
      const p = xy(a), q = xy(b);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    // Oblique/triangular Tonnetz: each edge is a pure fifth, major third or minor third.
    for (const note of lattice) {
      for (const [dm, dn] of [[1, 0], [0, 1], [-1, 1]]) {
        if (limit5Model.within(note.m + dm, note.n + dn)) {
          line(note, { m: note.m + dm, n: note.n + dn }, "#d9e6f1", .9);
        }
      }
    }
    if (state.limit5TetGuides) {
      // (+4,-1) changes the 12-TET semitone index by +24, hence the same pitch class.
      for (const note of lattice) {
        if (limit5Model.within(note.m + 4, note.n - 1)) {
          line(note, { m: note.m + 4, n: note.n - 1 }, "#a0a9ba", 1.5, [4, 6]);
        }
      }
    }
    const gap = limit5Model.comparison(state.limit5Comma, state.limit5Base);
    // Two routes to nominal E or D are drawn with contrasting colored paths.
    const justPath = state.limit5Comma === "e" ? [[0, 0], [0, 1]] :
      [[0, 0], [0, 1], [-1, 1], [-2, 1]];
    const fifthPath = state.limit5Comma === "e" ?
      [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] : [[0, 0], [1, 0], [2, 0]];
    for (const [path, color] of [[justPath, "#128f81"], [fifthPath, "#d58b28"]]) {
      for (let i = 1; i < path.length; i++) line({ m: path[i - 1][0], n: path[i - 1][1] },
        { m: path[i][0], n: path[i][1] }, color, 3.4);
    }
    line(gap.just, gap.pyth, "#e7a343", 1.7, [6, 4]);
    for (const note of lattice) {
      const { x, y } = xy(note);
      const active = state.limit5Playing && (limit5Active === "all" ||
        (limit5Active && limit5Active.key === note.key));
      const comparison = state.limit5Comparing && (note.key === gap.just.key || note.key === gap.pyth.key);
      const endpoint = note.key === gap.just.key || note.key === gap.pyth.key;
      const selected = chosen.has(note.key);
      if (active || comparison) {
        ctx.beginPath();
        ctx.fillStyle = "#ffe0a1";
        ctx.arc(x, y, 13, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, selected || endpoint ? 6.3 : 4.7, 0, 2 * Math.PI);
      ctx.fillStyle = active || comparison ? "#e89b27" : selected ?
        note.key === "0,0" ? "#159a88" : "#347ec6" : "#ffffff";
      ctx.fill();
      ctx.strokeStyle = endpoint ? "#d68c27" : selected ? "#347ec6" : "#a8bfd3";
      ctx.lineWidth = endpoint ? 2 : 1.3;
      ctx.stroke();
      if (selected || endpoint) {
        ctx.textAlign = "center";
        ctx.fillStyle = active || comparison ? "#9f6310" : endpoint ? "#966722" : "#355a80";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillText(limit5Name(note), x, y - 15);
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillText(note.numerator + "/" + note.denominator, x, y + 20);
      }
      if (state.limit5GridFocused && note.m === state.limit5Cursor[0] && note.n === state.limit5Cursor[1]) {
        ctx.strokeStyle = "#273d58";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.arc(x, y, 14, 0, 2 * Math.PI); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.fillStyle = "#648099";
    ctx.textAlign = "left";
    ctx.fillText("→  3:2", 15, height - 24);
    ctx.fillText("↗  5:4", 15, height - 8);
    ctx.textAlign = "right";
    ctx.fillText("81:80  ·  " + limit5Model.COMMA_CENTS.toFixed(2) + "¢", width - 16, height - 13);
  }

  function drawLimit5Octave() {
    const { ctx, width, height } = plotContext($("limit5OctaveCanvas"));
    const notes = limit5Notes();
    const gap = limit5Model.comparison(state.limit5Comma, state.limit5Base);
    const left = 38, right = width - 24, span = right - left;
    const xAt = cents => left + Math.max(0, Math.min(1200, cents)) * span / 1200;
    const trackY = height * .76;
    ctx.textAlign = "center";
    for (let i = 0; i <= 12; i++) {
      const x = xAt(i * 100);
      ctx.beginPath();
      ctx.strokeStyle = "#e2eaf2";
      ctx.lineWidth = 1;
      ctx.moveTo(x, 16);
      ctx.lineTo(x, height - 18);
      ctx.stroke();
      if (i % (width < 440 ? 3 : 2) === 0) {
        ctx.fillStyle = "#7891a9";
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillText(i * 100 + "¢", x, height - 4);
      }
    }
    ctx.strokeStyle = "#97b6d1";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(left, trackY); ctx.lineTo(right, trackY); ctx.stroke();
    for (const note of notes) {
      const x = xAt(note.cents);
      const active = state.limit5Playing && (limit5Active === "all" ||
        (limit5Active && limit5Active.key === note.key));
      if (active) {
        ctx.beginPath(); ctx.fillStyle = "#ffe0a1"; ctx.arc(x, trackY, 12, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = active ? "#e3952f" : note.key === "0,0" ? "#159a88" : "#347ec6";
      ctx.beginPath(); ctx.arc(x, trackY, 6.5, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#355c83";
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.fillText(limit5Name(note), x, trackY - 17);
    }
    // Separate vertically because a 21.5-cent comma is only a few pixels wide on phones.
    const markerY = [height * .20, height * .39];
    for (const [index, note] of [gap.just, gap.pyth].entries()) {
      const x = xAt(note.cents);
      ctx.fillStyle = state.limit5Comparing ? "#e99b2c" : index === 0 ? "#188e82" : "#d18c30";
      ctx.beginPath(); ctx.arc(x, markerY[index], 5.5, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#dab474";
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x, markerY[index] + 8); ctx.lineTo(x, trackY - 13); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = "#78633e";
      ctx.textAlign = x > width * .75 ? "right" : "left";
      ctx.fillText((index === 0 ? "5:4 · " : "3:2 · ") + note.numerator + "/" + note.denominator, x + (x > width * .75 ? -10 : 10), markerY[index] + 4);
    }
  }

  function drawLimit5Plots() {
    drawLimit5Lattice();
    drawLimit5Octave();
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
    } else if (state.mode === "tuning") {
      if (state.tuningKind === "intervals") drawIntervalPlots();
      else if (state.tuningKind === "scales") drawScalePlots();
      else drawLimit5Plots();
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
  document.querySelectorAll("[data-guitar-play]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.strikeGuitarPlay === button.dataset.guitarPlay) return;
      stopStrikeForEdit();
      state.strikeGuitarPlay = button.dataset.guitarPlay;
      renderStrikeControls();
      drawPlots();
    });
  });
  document.querySelectorAll("[data-piano-touch]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.strikePianoTouch === button.dataset.pianoTouch) return;
      stopStrikeForEdit();
      state.strikePianoTouch = button.dataset.pianoTouch;
      renderStrikeControls();
      drawPlots();
    });
  });
  document.querySelectorAll("[data-guitar-chord]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.strikeChord === button.dataset.guitarChord) return;
      stopStrikeForEdit();
      state.strikeChord = button.dataset.guitarChord;
      renderStrikeControls();
      drawPlots();
    });
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
  document.querySelectorAll("[data-tuning-kind]").forEach(button => {
    button.addEventListener("click", () => selectTuningKind(button.dataset.tuningKind));
  });
  document.querySelectorAll("[data-scale-preset]").forEach(button => {
    button.addEventListener("click", () => selectScalePreset(button.dataset.scalePreset));
  });
  document.querySelectorAll("[data-scale-tonic]").forEach(button => {
    button.addEventListener("click", () => selectScaleTonic(Number(button.dataset.scaleTonic)));
  });
  document.querySelectorAll("[data-limit5-preset]").forEach(button => {
    button.addEventListener("click", () => selectLimit5Preset(button.dataset.limit5Preset));
  });
  document.querySelectorAll("[data-limit5-mode]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.limit5Mode === button.dataset.limit5Mode) return;
      stopLimit5Sound();
      state.limit5Mode = button.dataset.limit5Mode;
      renderLimit5Controls();
    });
  });
  document.querySelectorAll("[data-limit5-comma]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.limit5Comma === button.dataset.limit5Comma) return;
      stopLimit5Sound();
      state.limit5Comma = button.dataset.limit5Comma;
      renderLimit5Controls();
      drawPlots();
    });
  });
  document.querySelectorAll("[data-interval-ratio]").forEach(button => {
    button.addEventListener("click", () => selectIntervalRatio(button.dataset.intervalRatio));
  });
  document.querySelectorAll("[data-interval-tuning]").forEach(button => {
    button.addEventListener("click", () => selectIntervalTuning(button.dataset.intervalTuning));
  });
  document.querySelectorAll("[data-interval-color]").forEach(button => {
    button.addEventListener("click", () => selectIntervalColor(button.dataset.intervalColor));
  });
  $("scaleButton").addEventListener("click", toggleScaleSound);
  $("scaleGapButton").addEventListener("click", toggleScaleGapSound);
  $("scaleGapToggle").addEventListener("change", event => setScaleShowGap(event.target.checked));
  $("scaleBaseSlider").addEventListener("input", event => setScaleBase(event.target.value));
  $("scaleBaseInput").addEventListener("change", event => setScaleBase(event.target.value));
  $("scaleVolume").addEventListener("input", event => {
    state.scaleVolume = Math.min(100, Math.max(0, Number(event.target.value)));
    scaleAudio.updateVolume();
    renderScaleControls();
  });
  $("scaleAddDown").addEventListener("click", () => changeScaleBoundary("down", 1));
  $("scaleAddUp").addEventListener("click", () => changeScaleBoundary("up", 1));
  $("scaleRemoveDown").addEventListener("click", () => changeScaleBoundary("down", -1));
  $("scaleRemoveUp").addEventListener("click", () => changeScaleBoundary("up", -1));
  $("scaleReset").addEventListener("click", resetScale);
  $("limit5Button").addEventListener("click", toggleLimit5Sound);
  $("limit5CompareButton").addEventListener("click", toggleLimit5Compare);
  $("limit5TetGuides").addEventListener("change", event => {
    state.limit5TetGuides = event.target.checked;
    drawPlots();
  });
  $("limit5BaseSlider").addEventListener("input", event => setLimit5Base(event.target.value));
  $("limit5BaseInput").addEventListener("change", event => setLimit5Base(event.target.value));
  $("limit5Volume").addEventListener("input", event => {
    state.limit5Volume = Math.min(100, Math.max(0, Number(event.target.value)));
    limit5Audio.updateVolume();
    renderLimit5Controls();
  });
  $("limit5Reset").addEventListener("click", resetLimit5);
  $("limit5LatticeCanvas").addEventListener("click", event => {
    const canvas = $("limit5LatticeCanvas");
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    let closest = null;
    let distance = Infinity;
    for (const point of limit5Model.lattice(state.limit5Base)) {
      const position = limit5GridPoint(point.m, point.n, 1, 1);
      const d = Math.hypot((x - position.x) * rect.width, (y - position.y) * rect.height);
      if (d < distance) { distance = d; closest = point; }
    }
    if (closest && distance <= Math.max(17, Math.min(rect.width, rect.height) * .06)) {
      state.limit5Cursor = [closest.m, closest.n];
      toggleLimit5Point(closest.m, closest.n);
    }
  });
  $("limit5LatticeCanvas").addEventListener("focus", () => {
    state.limit5GridFocused = true;
    if (state.mode === "tuning" && state.tuningKind === "limit5") drawLimit5Lattice();
  });
  $("limit5LatticeCanvas").addEventListener("blur", () => {
    state.limit5GridFocused = false;
    if (state.mode === "tuning" && state.tuningKind === "limit5") drawLimit5Lattice();
  });
  $("limit5LatticeCanvas").addEventListener("keydown", event => {
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
    if (delta) {
      event.preventDefault();
      const m = state.limit5Cursor[0] + delta[0], n = state.limit5Cursor[1] + delta[1];
      if (limit5Model.within(m, n)) state.limit5Cursor = [m, n];
      drawLimit5Lattice();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLimit5Point(...state.limit5Cursor);
    }
  });
  document.querySelectorAll("[data-theremin-timbre]").forEach(button => {
    button.addEventListener("click", () => setMotionTimbre(button.dataset.thereminTimbre));
  });
  document.querySelectorAll("[data-theremin-vowel]").forEach(button => {
    button.addEventListener("click", () => setMotionVowel(button.dataset.thereminVowel));
  });
  $("thereminHarmonic").addEventListener("input", event => {
    setMotionHarmonic(Number(event.target.value));
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
  $("intervalButton").addEventListener("click", toggleIntervalSound);
  $("intervalBaseSlider").addEventListener("input", event => setIntervalBase(event.target.value));
  $("intervalBaseInput").addEventListener("change", event => setIntervalBase(event.target.value));
  $("intervalVolume").addEventListener("input", event => {
    state.intervalVolume = Math.max(0, Math.min(100, Number(event.target.value)));
    intervalAudio.update();
    renderIntervalControls();
  });
  $("intervalReset").addEventListener("click", resetInterval);
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
  $("modeTuning").addEventListener("click", () => selectMode("tuning"));
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
  $("sustainBreath").addEventListener("input", event => {
    state.sustainBreath = Math.max(0, Math.min(100, Number(event.target.value)));
    sustainAudio.update();
    renderSustainControls();
    if (state.mode === "sustain") drawSustainPlots();
  });
  $("sustainBowPressure").addEventListener("input", event => {
    state.sustainBowPressure = Math.max(0, Math.min(100, Number(event.target.value)));
    sustainAudio.update();
    renderSustainControls();
    if (state.mode === "sustain") drawSustainPlots();
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
  $("strikePluckPosition").addEventListener("input", event => {
    stopStrikeForEdit();
    state.strikePluckPosition = Number(event.target.value) / 100;
    renderStrikeControls();
    drawPlots();
  });
  $("strikeDrumTension").addEventListener("input", event => {
    stopStrikeForEdit();
    state.strikeDrumTension = Number(event.target.value) / 100;
    renderStrikeControls();
    drawPlots();
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
        state.motionPlaying || state.mixPlaying || state.intervalPlaying || state.scalePlaying || state.limit5Playing || state.limit5Comparing ||
        state.harmonicPlaying || state.noisePlaying) {
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
    observer.observe($("intervalWaveCanvas"));
    observer.observe($("intervalSpectrumCanvas"));
    observer.observe($("scaleSpiralCanvas"));
    observer.observe($("scaleFourierCanvas"));
    observer.observe($("limit5LatticeCanvas"));
    observer.observe($("limit5OctaveCanvas"));
    observer.observe($("harmonicWaveCanvas"));
    observer.observe($("harmonicSpectrumCanvas"));
    observer.observe($("noiseWaveCanvas"));
    observer.observe($("noiseSpectrumCanvas"));
  } else window.addEventListener("resize", drawPlots);

  renderTexts();
  renderControls();
  drawPlots();
})();
