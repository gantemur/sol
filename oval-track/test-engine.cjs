// SPDX-License-Identifier: MIT
// Standalone: node oval-track/test-engine.cjs
"use strict";
const assert = require("node:assert/strict");
const M = require("./model.js");
const H = [...M.HOME];
const eq = (board, expected) => assert.deepEqual(board, expected);
const repeat = (w, n) => Array.from({ length: n }, () => w).flat();

eq(M.word(H, repeat(["R"], 8)), H);
eq(M.word(H, ["R", "L"]), H);
eq(M.word(H, ["L", "R"]), H);
eq(M.word(H, ["T", "T"]), H);
eq(M.word(H, ["R", "T"]), [3,2,1,8,4,5,6,7]);
eq(M.word(H, ["T", "R"]), [8,4,3,2,1,5,6,7]);
assert.notDeepEqual(M.word(H, ["R","T"]), M.word(H, ["T","R"]));
eq(M.word(H, repeat(["R","T"], 5)), [3,2,1,4,5,6,7,8]);
eq(M.word(H, repeat(["R","T"], 10)), H);
assert.equal(M.cycleText(M.permutationOf(M.word(H, ["R","T"]))), "(1 3)(4 5 6 7 8)");
assert.equal(M.orderOf(M.permutationOf(M.word(H, ["R","T"]))), 10);
assert.equal(M.cycleText(M.permutationOf(H)), "e");
assert.equal(M.isCyclicOrder(M.move(H,"R")), true);
assert.equal(M.isHome(M.move(H,"R")), false);
assert.equal(M.isHome(H), true);
assert.equal(M.isCyclicOrder(M.word(H, ["R","T"])), false);
for (let i = 0; i < 200; i++) {
  const w = M.randomScramble(30);
  const b = M.word(H, w);
  eq(M.word(b, M.inverseWord(w)), H);
  eq([...b].sort((a,b) => a-b), H);
  assert.equal(M.cycles(M.permutationOf(b)).reduce(
    (acc, c) => acc + c.length, 0) <= 8, true);
}
assert.throws(() => M.move([1,1,2,3,4,5,6,7],"R"), RangeError);
assert.throws(() => M.move(H,"bad"), RangeError);
// Exhaustive reachable states, using only the displayed legal moves.
const key = b => b.join(",");
const queue = [H], distances = new Map([[key(H), 0]]);
let diameter = 0;
for (let head = 0; head < queue.length; head++) {
  const state = queue[head], depth = distances.get(key(state));
  diameter = Math.max(diameter, depth);
  for (const code of M.CODES) {
    const next = M.move(state, code), k = key(next);
    if (distances.has(k)) continue;
    distances.set(k, depth + 1);
    queue.push(next);
  }
}
assert.equal(distances.size, 40320);
assert.equal(diameter, 22);
console.log("Oval Track engine PASS: identities, inverses, cycle order, special swap, all 40,320 states, diameter 22.");
