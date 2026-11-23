// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Run: node oval-track/test-family.cjs
"use strict";
const assert=require("node:assert/strict");
const F=require("./family-model.js");
const W=require("./family-text.js");
const cases=Object.entries(F.COUNTS);
assert.equal(cases.length,17);
for(const [id,expected] of cases){
  const [n,k]=id.split(":").map(Number),H=F.home(n);
  assert.deepEqual(F.word(H,Array(n).fill("R"),k),H);
  assert.deepEqual(F.word(H,["T","T"],k),H);
  assert.deepEqual(F.word(H,["R","L"],k),H);
  assert.deepEqual(F.word(H,["L","R"],k),H);
  const states=F.reachable(n,k),uniq=new Set(states.nodes.map(b=>b.join(",")));
  assert.equal(states.nodes.length,expected,id+" group order");
  assert.equal(uniq.size,expected,id+" unique states");
  assert.equal(F.summary(n,k).reachable,expected,id+" summary");
  for(const b of states.nodes){
    assert.deepEqual(b.slice().sort((a,b)=>a-b),H);
  }
  const reflect=F.move(H,"T",k),links=F.polygonLinks(reflect);
  assert.equal(links.filter(e=>e.perimeter).length,k>=n-1?n:n-2,id+" polygon sides");
  assert.equal(F.polygonKind(reflect),k>=n-1?"reflection":"distorted",id+" polygon kind");
  assert.equal(F.polygonKind(F.move(H,"R",k)),"rotation",id+" rotation kind");
  const scramble=F.scramble(n,k,5,()=>.32);
  const scrambleFallback=F.scramble(n,k,8,()=>0);
  assert.equal(scrambleFallback.length,8,"fallback keeps requested length");
  assert(!F.isHome(F.word(H,scrambleFallback,k)));
  assert(!F.isHome(F.word(H,scramble,k)));
  assert.deepEqual(F.word(F.word(H,scramble,k),F.inverseWord(scramble),k),H);
}
assert.deepEqual(F.allComponents(3,2).map(x=>x.length),[6]);
assert.deepEqual(F.allComponents(4,2).map(x=>x.length),[24]);
assert.deepEqual(F.allComponents(4,3).map(x=>x.length),[8,8,8]);
assert.deepEqual(F.allComponents(4,4).map(x=>x.length),[8,8,8]);
assert.equal(F.smallGraph(3,2).nodes.length,6);
assert.equal(F.smallGraph(3,2).edges.length,9);
assert.equal(F.smallGraph(4,2).nodes.length,24);
assert.equal(F.smallGraph(4,3).components,3);
assert.equal(F.smallGraph(5,4).nodes.length,10);
assert.equal(F.smallGraph(5,2),null);
assert.deepEqual(F.swapPairs(4,3),[[1,3],[2,4]]);
assert.deepEqual(F.swapPairs(4,4),[[1,3],[2,4]]);
assert.deepEqual(F.swapPairs(5,4),[]);
assert.deepEqual(F.swapPairs(7,4),[]);
assert.equal(F.swapPairs(5,2).length,10);
assert.equal(F.swapPairs(8,4).length,28);
assert.equal(F.shortestWord(4,3,F.swapBoard(4,1,2)),null);
assert.deepEqual(F.word(F.home(3),["R","T","L"],2),F.swapBoard(3,1,3));
assert.deepEqual(F.word(F.home(4),["L","T","R"],2),F.swapBoard(4,2,3));
assert.deepEqual(F.word(F.home(4),["L","T","R"],3),F.swapBoard(4,2,4));
assert.equal(W.lessons("3:2").length,3);
assert.equal(W.lessons("4:2").length,2);
assert.equal(W.lessons("4:3").length,2);
assert.equal(W.lessons("5:2").length,1);
for(const [id,entries] of Object.entries(W.LESSONS)){
  const [n,k]=id.split(":").map(Number);
  for(const task of entries){
    assert.equal(task.target.length,n);
    for(const lang of ["mn","en"]){
      const x=W.lesson(id,entries.indexOf(task),lang);
      assert(x.title && x.description && x.hint && x.explain,id+" "+lang+" translations");
    }
    if(task.type==="predict"){
      const accessible=F.reachable(n,k).paths.has(task.target.join(","));
      assert.equal(accessible,task.answer==="yes",id+" prediction is truthful");
    }else{
      assert(F.shortestWord(n,k,task.target)!==null,id+" target reachable");
    }
  }
}
console.log("Family model PASS: all 17 group orders, polygon edges, 3:2/4:2/4:3 graphs, inverse and conjugation, guided targets.");
