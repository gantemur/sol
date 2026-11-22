// SPDX-License-Identifier: MIT
// node oval-track/test-workshop.cjs
"use strict";
const assert = require("node:assert/strict");
const M = require("./model.js");
const W = require("./workshop.js");
const library = {
  P:{recipe:["R","T"],name:"P"},
  S:{recipe:["P","P","P","P","P"],name:"S"},
  C1:{recipe:["L","P","T"],name:"custom"}
};
assert.deepEqual([...W.SEEDS[0]],[...M.HOME]);
assert.deepEqual([...W.SEEDS[1]],[...M.HOME]);
assert(W.SEEDS.every(b => M.isHome(b)));
assert.deepEqual(W.TARGETS[0],M.move([...M.HOME],"T"));
assert.deepEqual(W.TARGETS[1],M.move([...M.HOME],"L"));
assert(!W.isTarget(0,[],{}));
assert(W.isTarget(0,["T"],{}));
assert(!W.isTarget(0,["R"],{}));
assert(W.isTarget(1,Array(7).fill("R"),{}));
assert(!W.isTarget(1,["R"],{}));
assert(W.isTarget(1,["L"],{}));
assert(W.isTarget(2,["R","T"],{}));
assert(W.isTarget(2,["P"],library));
assert(W.isTarget(3,Array(5).fill("P"),library));
assert(W.isTarget(3,["S"],library));
assert.deepEqual(W.flatten(["L"],library),["L"]);
assert.deepEqual(W.flatten(["S"],library),Array.from({length:5},()=>["R","T"]).flat());
assert.deepEqual(W.effect(["S"],library),[3,2,1,4,5,6,7,8]);
const b=M.word([...M.HOME],W.flatten(["S","C1"],library));
assert.deepEqual(M.word(b,W.inversePrimitives(W.flatten(["S","C1"],library))),[...M.HOME]);
assert.equal(W.compact(["R","R","T","P","P","P"]),"R² T P³");
assert.equal(W.validateName("Солих"),"Солих");
assert.equal(W.validateName("<script>"),null);
assert.throws(()=>W.flatten(["X"],library),RangeError);
assert.throws(()=>W.flatten(["C1"],{C1:{recipe:["C1"]}}),RangeError);
assert.throws(()=>W.flatten(["P"],{P:{recipe:Array(161).fill("R")}}),RangeError);
for(const difficulty of [3,5,8,12]){
 const word=W.scramble(difficulty,false,()=>0.13);
 assert.equal(word.length,difficulty);
 assert(!M.isHome(M.word([...M.HOME],word)));
 assert(W.visibleInverse(word,false).every(x=>x==="R"||x==="T"));
 assert.deepEqual(M.word(M.word([...M.HOME],word),W.visibleInverse(word,false)),[...M.HOME]);
}
console.log("Workshop PASS: lesson targets, macro expansion, cycles, inverse, names, legal scrambles.");
