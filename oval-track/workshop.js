// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Pure constructor for reusable Oval Track move words.
(function(root, factory) {
  const api = factory(root.OvalTrack || (typeof require === "function" && require("./model.js")));
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OvalWorkshop = api;
})(globalThis, function(M) {
  "use strict";
  if (!M) throw new Error("OvalTrack model.js is required");
  const H = [...M.HOME];
  const BASE = new Set(["R","T","L"]);
  const MAX_PRIMITIVES = 160;
  const TARGETS = [
    H,
    H,
    M.word(H, ["R","T"]),
    M.word(H, Array.from({length:5},()=>["R","T"]).flat())
  ];
  const SEEDS = [
    M.move(H, "T"),
    M.move(H, "R"),
    H,
    H
  ];
  function equal(a,b) {
    return Array.isArray(a) && Array.isArray(b) &&
      a.length === b.length && a.every((x,i)=>x===b[i]);
  }
  function canonicalP() {return ["R","T"];}
  function canonicalS() {return Array(5).fill("P");}
  function flatten(word, library, limit=MAX_PRIMITIVES) {
    if (!Array.isArray(word) || word.length > 160) throw new RangeError("Bad move word");
    const output = [];
    function expand(id, path) {
      if (BASE.has(id)) {output.push(id);}
      else {
        if (typeof id!=="string" || path.includes(id)) throw new RangeError("Cyclic or invalid operation");
        const item = library[id];
        if (!item || !Array.isArray(item.recipe)) throw new RangeError("Unavailable operation " + id);
        if (path.length > 16) throw new RangeError("Operation nesting too deep");
        for (const next of item.recipe) expand(next, [...path,id]);
      }
      if (output.length > limit) throw new RangeError("Operation exceeds animation limit");
    }
    for (const id of word) expand(id, []);
    return output;
  }
  function effect(word, library) {return M.word(H, flatten(word, library));}
  function isTarget(level, word, library) {
    if (![0,1,2,3].includes(level)) throw new RangeError("Unknown lesson");
    const from = [...SEEDS[level]], after = M.word(from,flatten(word,library));
    return equal(after,TARGETS[level]);
  }
  function inversePrimitives(list) {
    return [...list].reverse().map(M.inverse);
  }
  function visibleInverse(scramble,hasL) {
    // An accessible (not necessarily shortest) route back, even before L unlocks.
    return inversePrimitives(scramble).flatMap(code => code==="L"&&!hasL?Array(7).fill("R"):[code]);
  }
  function compact(word, labelFn = x=>x) {
    const result = [];
    for(let i=0;i<word.length;) {
      let j=i+1;
      while(j<word.length && word[j]===word[i])j++;
      const count=j-i;
      result.push(labelFn(word[i]) + (count>1?superscript(count):""));
      i=j;
    }
    return result.join(" ");
  }
  function superscript(number) {
    const digits="⁰¹²³⁴⁵⁶⁷⁸⁹";
    return String(number).split("").map(n=>digits[Number(n)]).join("");
  }
  function validateName(label) {
    const s=String(label || "").trim();
    return s.length>0 && [...s].length<=12 &&
      /^[\p{L}\p{N}_\-]+$/u.test(s) ? s : null;
  }
  function scramble(length,hasL,rng=Math.random) {
    if (![3,5,8,12].includes(length)) throw new RangeError("Unsupported scramble size");
    const ops=hasL?["R","L","T"]:["R","T"];
    let attempt=0;
    do {
      const word=[];
      for(let i=0;i<length;i++) {
        const options=ops.filter(x=>!word.length || x!==M.inverse(word[word.length-1]));
        const r=rng(),index=Number.isFinite(r)?Math.min(options.length-1,Math.max(0,Math.floor(r*options.length))):0;
        word.push(options[index]);
      }
      if (!M.isHome(M.word(H,word))) return word;
    } while (++attempt < 40);
    // A deterministic fallback of the requested length, never an accidental identity.
    const fallback=Array(length).fill("R");
    if (length % 8 === 0) fallback[length-1]="T";
    return fallback;
  }
  return Object.freeze({
    BASE,SEEDS,TARGETS,MAX_PRIMITIVES,equal,canonicalP,canonicalS,flatten,
    effect,isTarget,inversePrimitives,visibleInverse,compact,validateName,scramble
  });
});
