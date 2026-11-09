/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Short, bounded mono PCM capture. Audio is never routed to the speakers.
 */
"use strict";

class SolShortMicProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const requested = Number(options.processorOptions?.seconds);
    const seconds = Number.isInteger(requested) && requested >= 1 && requested <= 4 ? requested : 3;
    this.limit = Math.round(sampleRate * seconds);
    this.total = 0;
    this.chunk = new Float32Array(1024);
    this.used = 0;
    this.finished = false;
    this.port.onmessage = event => {
      if (event.data?.type === "stop") this.finish("manual");
    };
  }

  flush() {
    if (!this.used) return;
    const chunk = this.chunk.slice(0, this.used);
    this.port.postMessage({ type: "chunk", samples: chunk }, [chunk.buffer]);
    this.used = 0;
  }

  finish(reason) {
    if (this.finished) return;
    this.finished = true;
    this.flush();
    this.port.postMessage({ type: "ended", reason, frames: this.total, sampleRate });
  }

  process(inputs, outputs) {
    // A silent connected output keeps the Web Audio graph scheduled on WebKit.
    for (const output of outputs) for (const channel of output) channel.fill(0);
    if (this.finished) return false;
    const channels = inputs[0] || [];
    const count = channels[0]?.length || outputs[0]?.[0]?.length || 128;
    for (let frame = 0; frame < count && this.total < this.limit; frame++) {
      let mono = 0;
      for (const channel of channels) mono += Number.isFinite(channel[frame]) ? channel[frame] : 0;
      this.chunk[this.used++] = channels.length ? mono / channels.length : 0;
      this.total++;
      if (this.used === this.chunk.length) this.flush();
    }
    if (this.total >= this.limit) this.finish("limit");
    return !this.finished;
  }
}

registerProcessor("sol-short-mic", SolShortMicProcessor);
