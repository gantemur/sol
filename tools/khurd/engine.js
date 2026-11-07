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

  const SCROLL_SIZES = [1, 108, 1000, 10000, 100000, 1000000, 100000000];

  function createWheel(mode) {
    return {
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
  function bank(banked, wheels, scroll) {
    const t = totals(banked, wheels, scroll);
    for (const w of wheels) w.acc = 0;
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
    }
    return { turns, mani };
  }

  function needsBank(wheels) {
    return wheels.some((w) => Math.abs(w.acc) > 1000 * TAU);
  }

  return {
    TAU, PHYSICS, SCROLL_SIZES,
    createWheel, wrap, rotate, drag, hold, release, push, step, isMoving,
    truncTurns, maniFor, bandShift, totals, bank, bankWholeTurns, needsBank
  };
});
