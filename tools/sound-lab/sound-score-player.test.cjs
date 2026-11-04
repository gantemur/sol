"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const abc = require("./sound-abc.js");
const playerModel = require("./sound-score-player.js");
const sustain = require("./sound-sustain.js");
const temperaments = require("./sound-temperaments.js");

function audioFixture() {
  const context = {
    currentTime: 0, sampleRate: 16000, sources: [], gains: [], waves: [], buffers: [],
    createGain() {
      const gain = { gain: {
        records: [], cancelScheduledValues(at) { this.records.push(["cancel", at]); },
        setValueAtTime(value, at) { this.value = value; this.records.push(["set", value, at]); },
        linearRampToValueAtTime(value, at) { this.records.push(["ramp", value, at]); },
        setTargetAtTime(value, at, constant) { this.records.push(["target", value, at, constant]); }
      }, connect(target) { this.target = target; }, disconnect() {} };
      this.gains.push(gain);
      return gain;
    },
    createPeriodicWave(real, imag, options) {
      const wave = { real, imag, options }; this.waves.push(wave); return wave;
    },
    createOscillator() {
      const source = {
        type: "oscillator", frequency: { setValueAtTime(value, at) {
          this.value = value; this.time = at;
        } },
        connect(target) { this.target = target; }, disconnect() {},
        setPeriodicWave(wave) { this.wave = wave; },
        start(at) { this.startedAt = at; }, stop(at) { this.stoppedAt = at; }
      };
      this.sources.push(source);
      return source;
    },
    createBuffer(_channels, length, rate) {
      const data = new Float32Array(length);
      const buffer = { duration: length / rate, getChannelData() { return data; } };
      this.buffers.push(buffer);
      return buffer;
    },
    createBufferSource() {
      const source = {
        type: "buffer", connect(target) { this.target = target; }, disconnect() {},
        start(at, offset) { this.startedAt = at; this.offset = offset || 0; },
        stop(at) { this.stoppedAt = at; }
      };
      this.sources.push(source);
      return source;
    }
  };
  const calls = [];
  const owner = { output: {}, async readyContext() { calls.push("start"); return context; } };
  const recipes = [];
  const transients = { makeSamples(kind, pitchHz, decay, rate, size, options) {
    recipes.push({ kind, pitchHz, decay, rate, size, options });
    return new Float32Array(rate * 2);
  } };
  const updates = [];
  const player = new playerModel.Player({ contextOwner: owner, transientModel: transients,
    sustainModel: sustain, temperamentModel: temperaments, onUpdate: state => updates.push(state) });
  return { context, owner, player, calls, recipes, updates };
}

const melody = abc.parse("M:4/4\nL:1/4\nQ:1/4=96\nK:C\nC z D E | G4 |]");

test("a score never starts audio on load; uses the audio clock and skips rests", async () => {
  const { context, player, calls, updates } = audioFixture();
  player.configure({ score: melody, instrument: "flute", volume: 38 });
  assert.equal(calls.length, 0);
  assert.equal(context.sources.length, 0);
  assert.deepEqual(playerModel.scheduledEvents(melody).map(e => e.startBeat), [0, 2, 3, 4]);
  await player.play();
  assert.equal(calls.length, 1);
  assert.equal(player.status, "playing");
  assert.equal(context.sources.length, 1);
  assert.ok(Math.abs(context.sources[0].startedAt - .08) < 1e-6);
  assert.ok(context.sources[0].wave);
  assert.equal(context.gains[0].target, player.contextOwner.output);
  context.currentTime = 1.29;
  player.tick();
  assert.equal(context.sources.length, 2, "The rest does not create a voice");
  context.currentTime = 1.94;
  player.tick();
  assert.equal(context.sources.length, 3);
  context.currentTime = 2.56;
  player.tick();
  assert.equal(context.sources.length, 4);
  assert.ok(updates.some(update => update.status === "playing"));
  context.currentTime = 5.5;
  player.tick();
  assert.equal(player.status, "stopped", "Stops after score plus short release");
});

test("pause and resume preserve playback position, while Stop returns to bar one", async () => {
  const { context, player } = audioFixture();
  player.configure({ score: melody, instrument: "violin" });
  await player.play();
  context.currentTime = 1.7;
  player.pause();
  const pausedAt = player.currentBeat;
  assert.equal(player.status, "paused");
  assert.ok(pausedAt > 2 && pausedAt < 3);
  assert.equal(player.interval, null);
  context.currentTime += 5;
  assert.equal(player.currentBeat, pausedAt, "Position is frozen while paused");
  await player.play();
  assert.equal(player.status, "playing");
  assert.ok(Math.abs(player.currentBeat - pausedAt) < 1e-6);
  const mostRecent = context.sources.at(-1);
  assert.ok(mostRecent.startedAt >= context.currentTime);
  player.stop();
  assert.equal(player.currentBeat, 0);
  assert.equal(player.interval, null);
  assert.ok(context.sources.every(source => Number.isFinite(source.stoppedAt)));
});

test("guitar, piano and chime scores delegate to existing sound models", async () => {
  for (const instrument of ["guitar", "piano", "chimes"]) {
    const { player, context, recipes } = audioFixture();
    player.configure({ score: melody, instrument, tuning: "just", volume: 52 });
    await player.play();
    assert.equal(context.sources[0].type, "buffer", instrument);
    assert.equal(recipes.length, 1, instrument);
    const recipe = recipes[0];
    assert.equal(recipe.kind, instrument === "guitar" ? "pluck" :
      instrument === "piano" ? "piano" : "kick");
    if (instrument === "chimes") {
      assert.equal(recipe.options.drumVoice, "chimes");
      assert.ok(Math.abs(recipe.options.chimeHz - 264) < 10);
    }
    assert.equal(context.sources[0].buffer.duration, 2);
    player.stop();
  }
});

test("invalid pitches or controls are rejected before audio-context startup", () => {
  const { player, calls } = audioFixture();
  const tooLow = abc.parse("M:4/4\nL:1/4\nQ:1/4=100\nK:C\nC,,4 |]");
  assert.throws(() => player.configure({ score: tooLow, instrument: "guitar" }), /outside/);
  assert.throws(() => player.configure({ score: melody, instrument: "banjo" }), RangeError);
  assert.throws(() => player.configure({ score: melody, volume: 130 }), RangeError);
  assert.equal(calls.length, 0);
});

test("a pending audio-context request cannot launch after Stop", async () => {
  const { player, owner, context } = audioFixture();
  let resolveStart;
  owner.readyContext = () => new Promise(resolve => { resolveStart = resolve; });
  player.configure({ score: melody });
  const started = player.play();
  assert.equal(player.status, "starting");
  player.stop();
  resolveStart(context);
  assert.equal(await started, false);
  assert.equal(context.sources.length, 0);
  assert.equal(player.status, "stopped");
});
