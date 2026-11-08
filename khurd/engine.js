/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Prayer wheel engine: rotation, ratchet, coasting and counting.
 * Pure functions on plain objects, no DOM, so they can be tested in Node.
 *
 * Conventions
 * - Angles are in radians. Positive = clockwise as seen from above,
 *   which is the traditional turning direction. Seen from the side,
 *   the front surface then moves from right to left, so the syllables
 *   pass the viewer in reading order.
 * - `acc` is the signed angle turned since the last bank. Counts are
 *   truncated toward zero, so a small backward nudge in subtract mode
 *   does not immediately count as -1.
 * - "Mani" counts how many mantras of the inner scroll have passed the
 *   reading mark: trunc(acc * N / 2π), where N is the number of mantras
 *   on the scroll. One full turn therefore reads all N of them.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.KhurdEngine = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const TAU = 2 * Math.PI;

  const PHYSICS = {
    maxOmega: 8 * TAU,      // rad/s, about 8 turns per second
    coulomb: 0.9,           // rad/s², constant bearing friction
    viscous: 0.32,          // 1/s, speed-proportional drag
    restOmega: 0.02,        // rad/s, below this the wheel stops
    velocityBlend: 0.35     // smoothing for the drag-velocity estimate
  };

  /* Mantras on the inner scroll, up to бум (10⁵): every counted mantra is
   * really written into the drum's hidden scroll (below), and 10⁵ keeps that
   * cheap. Owner's decision for the khurd app, 2026-11-08, followed here. */
  const SCROLL_SIZES = [1, 10, 108, 1e3, 1e4, 1e5];

  /* ---------- The hidden scroll ----------
   * Inside a real wheel the paper scroll turns, though nobody sees it. Each
   * drum here has its own: a 16-byte buffer that is given each syllable's
   * UTF-8 text in turn as the drum passes 1/(6N) of a turn, every syllable,
   * in order, however fast the drum turns (backwards in reverse order). A
   * drum's count is the number of whole mantras its scroll has been given. */
  const SYLLABLE_TEXT = ["ཨོཾ", "མ", "ཎི", "པ", "དྨེ", "ཧཱུྃ"];
  const SYLLABLE_WORDS = (() => {
    const words = new Uint32Array(24);
    const enc = typeof TextEncoder === "function" ? new TextEncoder() : null;
    SYLLABLE_TEXT.forEach((t, j) => {
      const bytes = new Uint8Array(16);
      if (enc) bytes.set(enc.encode(t));
      words.set(new Uint32Array(bytes.buffer), j * 4);
    });
    return words;
  })();

  function createScroll() {
    return { position: 0, text: new Uint32Array(4) };
  }

  /* Turn the scroll to `target` syllables, writing each one on the way. */
  function scrollMove(sc, target) {
    let p = sc.position;
    const t = sc.text;
    if (target > p) {
      let j = ((p % 6) + 6) % 6;
      for (let n = target - p; n > 0; n -= 1) {
        const k = j * 4;
        t[0] = SYLLABLE_WORDS[k]; t[1] = SYLLABLE_WORDS[k + 1];
        t[2] = SYLLABLE_WORDS[k + 2]; t[3] = SYLLABLE_WORDS[k + 3];
        j = j === 5 ? 0 : j + 1;
      }
    } else if (target < p) {
      let j = (((p - 1) % 6) + 6) % 6;
      for (let n = p - target; n > 0; n -= 1) {
        const k = j * 4;
        t[0] = SYLLABLE_WORDS[k]; t[1] = SYLLABLE_WORDS[k + 1];
        t[2] = SYLLABLE_WORDS[k + 2]; t[3] = SYLLABLE_WORDS[k + 3];
        j = j === 0 ? 5 : j - 1;
      }
    }
    sc.position = target;
  }

  /* The syllable written last, as text ("" before the first). */
  function scrollLastWritten(sc) {
    const bytes = new Uint8Array(sc.text.buffer.slice(0));
    let end = bytes.indexOf(0);
    if (end < 0) end = bytes.length;
    return typeof TextDecoder === "function" ? new TextDecoder().decode(bytes.subarray(0, end)) : "";
  }

  function scrollMantras(sc) {
    return Math.trunc(sc.position / 6) + 0;
  }

  /* Where the scroll stands for an accumulator `acc` with N mantras inside:
   * 6·trunc(acc·N/2π) plus the syllables of the mantra under way (at most
   * five, or it would already be counted), so its whole mantras equal the
   * count exactly. */
  function scrollTarget(acc, scroll) {
    const m = maniFor(acc, scroll);
    const rest = (acc / TAU) * scroll - m;
    const s = Math.trunc(rest * 6);
    return 6 * m + (acc >= 0 ? Math.min(5, Math.max(0, s)) : Math.max(-5, Math.min(0, s)));
  }

  /* After every change of a wheel's accumulator. */
  function syncScroll(wheel, scroll) {
    if (!wheel.scroll) wheel.scroll = createScroll();
    scrollMove(wheel.scroll, scrollTarget(wheel.acc, scroll));
  }

  function createWheel(mode) {
    return {
      scroll: createScroll(),
      mode: mode === "subtract" ? "subtract" : "ratchet",
      angle: 0,     // display angle, kept in [0, 2π)
      acc: 0,       // signed angle since last bank
      omega: 0,     // rad/s
      held: false,  // a finger or pointer is in contact
      recoil: 0     // display-only tremble when pushed against the ratchet
    };
  }

  function wrap(angle) {
    const a = angle % TAU;
    return a < 0 ? a + TAU : a;
  }

  function clampOmega(omega) {
    const m = PHYSICS.maxOmega;
    return Math.max(-m, Math.min(m, omega));
  }

  /* Rotate by dTheta, respecting the ratchet. Returns the applied angle. */
  function rotate(wheel, dTheta) {
    if (!Number.isFinite(dTheta) || dTheta === 0) return 0;
    let applied = dTheta;
    if (wheel.mode === "ratchet" && applied < 0) {
      wheel.recoil = Math.max(-0.05, Math.min(0.05, wheel.recoil + applied * 0.15));
      applied = 0;
    }
    wheel.angle = wrap(wheel.angle + applied);
    wheel.acc += applied;
    return applied;
  }

  /* Contact drive: the wheel follows the pointer and learns its speed.
   * `fresh` marks the first sample of a new contact, e.g. a finger brushing
   * onto the next wheel of a row, so the finger speed is taken directly. */
  function drag(wheel, dTheta, dt, fresh) {
    wheel.held = true;
    const applied = rotate(wheel, dTheta);
    if (dt > 0) {
      const sample = clampOmega(applied / dt);
      const b = fresh ? 1 : PHYSICS.velocityBlend;
      wheel.omega = wheel.omega * (1 - b) + sample * b;
    }
    if (wheel.mode === "ratchet" && wheel.omega < 0) wheel.omega = 0;
    return applied;
  }

  /* While held without movement, the hand stops the wheel. */
  function hold(wheel, dt) {
    wheel.held = true;
    wheel.omega *= Math.exp(-dt * 25);
    if (Math.abs(wheel.omega) < PHYSICS.restOmega) wheel.omega = 0;
  }

  function release(wheel) {
    wheel.held = false;
    wheel.omega = clampOmega(wheel.omega);
    if (wheel.mode === "ratchet" && wheel.omega < 0) wheel.omega = 0;
  }

  /* Add an impulse (keyboard, mouse wheel). */
  function push(wheel, dOmega) {
    if (wheel.mode === "ratchet" && dOmega < 0) {
      rotate(wheel, -0.08);   // produces the recoil only
      return;
    }
    wheel.omega = clampOmega(wheel.omega + dOmega);
  }

  /* Free coasting with Coulomb plus viscous friction. Returns the applied angle. */
  function step(wheel, dt) {
    wheel.recoil *= Math.exp(-dt * 14);
    if (Math.abs(wheel.recoil) < 1e-4) wheel.recoil = 0;
    if (wheel.held || wheel.omega === 0 || !(dt > 0)) return 0;
    const w0 = wheel.omega;
    const s = Math.sign(w0);
    const decel = PHYSICS.coulomb + PHYSICS.viscous * Math.abs(w0);
    let w1 = w0 - s * decel * dt;
    if (Math.sign(w1) !== s || Math.abs(w1) < PHYSICS.restOmega) w1 = 0;
    wheel.omega = w1;
    return rotate(wheel, 0.5 * (w0 + w1) * dt);
  }

  function isMoving(wheel) {
    return wheel.omega !== 0 || wheel.recoil !== 0;
  }

  function truncTurns(acc) {
    return Math.trunc(acc / TAU) + 0;  // + 0 turns -0 into 0
  }

  /* Mantras on the scroll that have passed the reading mark. */
  function maniFor(acc, scroll) {
    return Math.trunc((acc / TAU) * scroll + (acc >= 0 ? 1e-9 : -1e-9)) + 0;
  }

  /* Mantra-widths the band moves for a rotation dTheta. */
  function bandShift(dTheta, scroll) {
    return (dTheta / TAU) * scroll;
  }

  /* Totals: banked BigInt values plus what the wheels hold now. */
  function totals(banked, wheels, scroll) {
    let turns = banked.turns;
    let mani = banked.mani;
    for (const w of wheels) {
      turns += BigInt(truncTurns(w.acc));
      mani += BigInt(maniFor(w.acc, scroll));
    }
    return { turns, mani };
  }

  /* Move the wheels' counts into the bank, e.g. before the scroll size changes.
   * Fractions of a mantra are dropped. The display angle is untouched. */
  /* Totals as written: banked values plus the whole mantras each drum's
   * scroll has been given. Equal to totals() once every scroll is synced. */
  function writtenTotals(banked, wheels) {
    let turns = banked.turns;
    let mani = banked.mani;
    for (const w of wheels) {
      turns += BigInt(truncTurns(w.acc));
      mani += BigInt(scrollMantras(w.scroll));
    }
    return { turns, mani };
  }

  /* Bank everything (fractions of a mantra are dropped) before the scroll size
   * changes; the scrolls start again from ཨོཾ. The caller turns the drums back. */
  function bank(banked, wheels, scroll) {
    const t = totals(banked, wheels, scroll);
    for (const w of wheels) {
      w.acc = 0;
      w.scroll = createScroll();
    }
    return t;
  }

  /* Bank only whole turns, keeping each wheel's partial turn, so counting
   * continues seamlessly. Used to keep doubles small during long sessions.
   * Valid because scroll sizes are integers: N·k mantras per k whole turns. */
  function bankWholeTurns(banked, wheels, scroll) {
    let turns = banked.turns;
    let mani = banked.mani;
    for (const w of wheels) {
      const k = truncTurns(w.acc);
      if (k === 0) continue;
      turns += BigInt(k);
      mani += BigInt(k) * BigInt(scroll);
      w.acc -= k * TAU;
      // The banked mantras stay written; the scroll counts on from what is left.
      if (w.scroll) {
        w.scroll.position -= 6 * k * scroll;
        scrollMove(w.scroll, scrollTarget(w.acc, scroll));
      }
    }
    return { turns, mani };
  }

  /* ---------- Milestones ----------
   * A place on the ladder (khurd app, docs/model.md, Milestones): the total's
   * power of ten picks the symbol, its leading digit the number of lit beads.
   * Totals below 100 count as 10² with no bead lit, so the ladder starts at
   * the Three Jewels. BigInt throughout. */
  const SYMBOL_COUNT = 9;
  const MN_POWERS = [
    ["зуу", "зуун"], ["мянга", "мянган"], ["түм", "түмэн"], ["бум", "буман"],
    ["сая", "сая"], ["живаа", "живаа"], ["дүнчүүр", "дүнчүүр"], ["тэрбум", "тэрбум"],
    ["их тэрбум", "их тэрбум"]
  ];

  function pow10(n) {
    return 10n ** BigInt(Math.max(0, n));
  }

  function milestone(total) {
    const t = BigInt(total);
    if (t < 100n) return { power: 2, digit: 0 };
    let p = 2;
    let scale = 100n;
    while (t / scale >= 10n) {
      scale *= 10n;
      p += 1;
    }
    return { power: p, digit: Number(t / scale) };
  }

  /* 0 the Three Jewels … 8 the wheel. */
  function milestoneSymbol(m) {
    return Math.min(Math.max(m.power - 2, 0), SYMBOL_COUNT - 1);
  }

  /* Gold rings around the wheel, one for each power of ten past 10¹⁰. */
  function milestoneRings(m) {
    return Math.max(0, m.power - 10);
  }

  function milestoneValue(m) {
    return BigInt(m.digit) * pow10(m.power);
  }

  /* The next total that lights a bead or changes the symbol. */
  function nextBead(m) {
    return BigInt(m.digit + 1) * pow10(m.power);
  }

  /* The next total that changes the symbol (or adds a ring). */
  function nextSymbol(m) {
    return 10n * pow10(m.power);
  }

  /* The milestone in Mongolian number words: 3 бум (attributive буман) for
   * 300,000; 10¹⁰ is их тэрбум, and beyond it counts их тэрбум (10 их тэрбум
   * for 10¹¹). Null below 100. */
  function milestoneWords(m) {
    if (m.digit <= 0) return null;
    const top = MN_POWERS.length + 1;
    const [name, attributive] = MN_POWERS[Math.min(m.power, top) - 2];
    return { count: BigInt(m.digit) * pow10(m.power - top), name, attributive };
  }

  /* The total from which a symbol shows: 0 for the Three Jewels, then 10³ for
   * the parasol … 10¹⁰ for the wheel. */
  function symbolThreshold(symbol) {
    return symbol <= 0 ? 0n : pow10(Math.min(symbol, SYMBOL_COUNT - 1) + 2);
  }

  function compareMilestones(a, b) {
    return a.power !== b.power ? a.power - b.power : a.digit - b.digit;
  }

  /* What reaching `now` after `best` deserves: a new symbol (or ring) the full
   * moment, a new bead a pulse; null if `now` is not higher. */
  function milestoneCrossing(best, now) {
    if (compareMilestones(now, best) <= 0) return null;
    return now.power > best.power ? "symbol" : "bead";
  }

  /* Where the drums sit on a stage of w × h CSS pixels (docs/model.md in the
   * khurd app, Interface). The side view fits drums of about 250 px each, up
   * to six; the top view fits as many wheels as have a slot at least 0.9 × the
   * stage height, and no more than the side view would show. */
  function sideCount(w) {
    return Math.max(1, Math.min(6, Math.floor(w / 250)));
  }

  function topCount(w, h) {
    return Math.max(1, Math.min(sideCount(w), Math.floor(w / (h * 0.9))));
  }

  function stageLayout(view, width, height, count) {
    const w = Math.max(200, width);
    const h = Math.max(200, height);
    const drums = [];
    if (view === "side") {
      const n = count || sideCount(w);
      const slot = w / n;
      const R = Math.min(slot * 0.36, (h * 0.72) / 2.7);
      const drumHeight = R * 2.7;
      const top = (h - drumHeight) / 2 + R * 0.08;
      for (let i = 0; i < n; i += 1) {
        drums.push({ cx: slot * (i + 0.5), cy: top + drumHeight / 2, R, top, bottom: top + drumHeight, ry: R * 0.16 });
      }
      return { view, w, h, drums, letterPx: drumHeight * 0.29 };
    }
    const n = count || topCount(w, h);
    const slot = w / n;
    // 0.44 keeps neighbouring wheels' generous hit areas apart.
    const R = Math.min(slot, h) * 0.44;
    for (let i = 0; i < n; i += 1) {
      drums.push({ cx: slot * (i + 0.5), cy: h / 2, R, top: h / 2 - R, bottom: h / 2 + R, ry: 0 });
    }
    return { view: "top", w, h, drums, letterPx: R * 0.27 };
  }

  function needsBank(wheels) {
    return wheels.some((w) => Math.abs(w.acc) > 1000 * TAU);
  }

  return {
    TAU, PHYSICS, SCROLL_SIZES, sideCount, topCount, stageLayout,
    SYMBOL_COUNT, milestone, milestoneSymbol, milestoneRings, milestoneValue, nextBead, nextSymbol,
    milestoneWords, symbolThreshold, compareMilestones, milestoneCrossing,
    SYLLABLE_TEXT, createScroll, scrollMove, scrollTarget, scrollMantras, scrollLastWritten, syncScroll, writtenTotals,
    createWheel, wrap, rotate, drag, hold, release, push, step, isMoving,
    truncTurns, maniFor, bandShift, totals, bank, bankWholeTurns, needsBank
  };
});
