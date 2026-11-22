// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Pure eight-disk Oval Track permutation engine. Tile numbers label home positions.
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OvalTrack = api;
})(globalThis, function () {
  "use strict";
  const HOME = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);
  const N = HOME.length;
  const CODES = Object.freeze(["R", "L", "T"]);

  function validate(board) {
    if (!Array.isArray(board) || board.length !== N ||
        new Set(board).size !== N ||
        board.some(x => !Number.isInteger(x) || x < 1 || x > N)) {
      throw new RangeError("Board must be a permutation of tiles 1 through 8");
    }
    return board;
  }
  function move(board, code) {
    validate(board);
    if (!CODES.includes(code)) throw new RangeError("Unknown Oval Track move");
    if (code === "R") return [board[7], ...board.slice(0, 7)];
    if (code === "L") return [...board.slice(1), board[0]];
    return [board[3], board[2], board[1], board[0], ...board.slice(4)];
  }
  function word(board, codes) {
    validate(board);
    // Move words are CHRONOLOGICAL and read left to right.
    return Array.from(codes).reduce((a, c) => move(a, c), board.slice());
  }
  function inverse(code) {
    if (code === "R") return "L";
    if (code === "L") return "R";
    if (code === "T") return "T";
    throw new RangeError("Unknown Oval Track move");
  }
  function inverseWord(codes) {
    return Array.from(codes).reverse().map(inverse);
  }
  function permutationOf(board) {
    // p[i-1] = current position of the disk originally in position i.
    validate(board);
    const p = new Array(N);
    board.forEach((tile, position) => { p[tile - 1] = position + 1; });
    return p;
  }
  function cycles(p) {
    validate(p);
    const seen = new Set();
    const result = [];
    for (let start = 1; start <= N; start++) {
      if (seen.has(start)) continue;
      const cycle = [];
      let i = start;
      do {
        cycle.push(i);
        seen.add(i);
        i = p[i - 1];
      } while (!seen.has(i));
      if (cycle.length > 1) result.push(cycle);
    }
    return result;
  }
  function cycleText(p) {
    return cycles(p).map(c => "(" + c.join(" ") + ")").join("") || "e";
  }
  function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
  function orderOf(p) {
    return cycles(p).reduce((a, c) => a * c.length / gcd(a, c.length), 1);
  }
  function isHome(board) {
    validate(board);
    return board.every((v, i) => v === i + 1);
  }
  function isCyclicOrder(board) {
    validate(board);
    const at = board.indexOf(1);
    return HOME.every((v, i) => board[(at + i) % N] === v);
  }
  function randomScramble(length = 12, rng = Math.random) {
    if (!Number.isInteger(length) || length < 0 || length > 100) throw new RangeError("Invalid scramble length");
    const result = [];
    for (let i = 0; i < length; i++) {
      const options = CODES.filter(code =>
        !result.length || code !== inverse(result[result.length - 1]));
      const number = Number(rng());
      const ix = Number.isFinite(number) ? Math.min(options.length - 1, Math.max(0, Math.floor(number * options.length))) : 0;
      result.push(options[ix]);
    }
    return result;
  }
  return Object.freeze({ HOME, N, CODES, validate, move, word, inverse,
    inverseWord, permutationOf, cycles, cycleText, orderOf, isHome,
    isCyclicOrder, randomScramble });
});
