// SPDX-License-Identifier: MIT
// Node-only headless interaction smoke. Run: node oval-track/test-ui.cjs
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync(require("node:path").join(__dirname,"classic","index.html"),"utf8");
class FakeNode{
  constructor(tagName="DIV"){
    this.tagName=tagName;this.children=[];this.dataset={};this.events={};this.attrs={};
    this.style={setProperty(){}};this.classList={toggle(){}};this.value="";this.textContent="";
    this.disabled=false;this.hidden=false;this.title="";this.className="";
  }
  setAttribute(k,v){this.attrs[k]=v;}
  append(...v){this.children.push(...v);}
  appendChild(x){this.children.push(x);}
  replaceChildren(...v){this.children=v;}
  addEventListener(k,fn){this.events[k]=fn;}
  click(){this.events.click?.();}
  closest(){return false;}
}
const nodes=new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>[x[1],new FakeNode()]));
nodes.get("difficulty").value="5";
const langs=["mn","en"].map(lang=>{
  const n=new FakeNode("BUTTON");n.dataset.lang=lang;return n;
});
const i18n=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(x=>{
  const n=new FakeNode();n.dataset.i18n=x[1];return n;
});
const aria=[...html.matchAll(/data-i18n-aria="([^"]+)"/g)].map(x=>{
  const n=new FakeNode();n.dataset.i18nAria=x[1];return n;
});
const storage=new Map();
globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
globalThis.location={search:"",href:"https://example.org/oval-track/"};
globalThis.history={replaceState(){}};
globalThis.document={
  title:"",documentElement:{lang:"mn"},activeElement:{tagName:"BODY"},
  getElementById:key=>nodes.get(key),
  querySelectorAll:selector=>selector==="[data-i18n]"?i18n:selector==="[data-i18n-aria]"?aria:
    selector==="[data-lang]"?langs:[],
  createElement:tag=>new FakeNode(tag.toUpperCase()),
  createElementNS:(ns,tag)=>new FakeNode(tag.toUpperCase()),
  addEventListener(){}
};
globalThis.window={
  OvalTrack:require("./model.js"),OvalWorkshop:require("./workshop.js"),
  matchMedia:()=>({matches:true}),confirm:()=>true
};
require("./app.js");
const click=id=>nodes.get(id).click();
const push=id=>{
  const button=nodes.get("toolButtons").children.find(x=>x.dataset.kind===id);
  assert(button, "tool "+id+" is available");button.click();
};
const board=()=>nodes.get("boardArray").textContent;
const flush=async()=>{for(let i=0;i<250;i++)await Promise.resolve();};
(async()=>{
  const home="1 2 3 4 5 6 7 8";
  // A new lesson always starts from the ordered state, not a pre-applied move.
  assert.equal(board(),home);
  assert.deepEqual(nodes.get("toolButtons").children.map(x=>x.dataset.kind),["R","T"]);
  assert.equal(nodes.get("targetArray").textContent,"4 3 2 1 5 6 7 8");

  // A premature explicit check fails; reaching the target does NOT auto-unlock.
  click("checkBtn");await flush();
  assert.equal(nodes.get("unlockPanel").hidden,true);
  assert.match(nodes.get("experimentResult").textContent,/дор хаяж/);
  push("T");await flush();
  assert.equal(board(),"4 3 2 1 5 6 7 8");
  assert.equal(nodes.get("unlockPanel").hidden,true);
  click("forgeBtn");await flush(); // cannot bypass the explicit check
  assert.equal(nodes.get("stepIndicator").textContent,"1 / 4");
  click("checkBtn");await flush();
  assert.equal(nodes.get("unlockPanel").hidden,false);
  assert.equal(nodes.get("checkBtn").disabled,true);
  click("forgeBtn");await flush();
  assert.equal(nodes.get("stepIndicator").textContent,"2 / 4");
  assert.equal(board(),home); // lesson transition resets, not another preload
  assert.equal(nodes.get("targetArray").textContent,"2 3 4 5 6 7 8 1");

  // Wrong candidate gets feedback, but can be retried.
  push("R");await flush();
  click("checkBtn");await flush();
  assert.equal(nodes.get("unlockPanel").hidden,true);
  assert.match(nodes.get("experimentResult").textContent,/таарахгүй/);
  click("resetBtn");await flush();
  assert.equal(board(),home);
  for(let i=0;i<7;i++)push("R");
  await flush();
  assert.equal(board(),"2 3 4 5 6 7 8 1");
  assert.equal(nodes.get("unlockPanel").hidden,true);
  click("checkBtn");await flush();
  assert.equal(nodes.get("unlockPanel").hidden,false);
  click("forgeBtn");await flush();
  assert(nodes.get("toolButtons").children.some(x=>x.dataset.kind==="L"));
  click("nextBtn");await flush();
  assert.equal(board(),home);
  assert.equal(nodes.get("targetArray").textContent,"3 2 1 8 4 5 6 7");

  push("R");push("T");await flush();
  assert.equal(board(),"3 2 1 8 4 5 6 7");
  assert.equal(nodes.get("unlockPanel").hidden,true);
  nodes.get("operationName").value="P";
  click("checkBtn");await flush();
  click("forgeBtn");await flush();
  assert(nodes.get("toolButtons").children.some(x=>x.dataset.kind==="P"));
  click("nextBtn");await flush();
  assert.equal(board(),home);

  for(let i=0;i<5;i++)push("P");
  await flush();
  assert.equal(board(),"3 2 1 4 5 6 7 8");
  assert.equal(nodes.get("unlockPanel").hidden,true);
  click("checkBtn");await flush();
  click("forgeBtn");await flush();
  assert(nodes.get("toolButtons").children.some(x=>x.dataset.kind==="S"));

  // Switching modes keeps the unlocked operation palette and separate boards.
  click("modeFree");await flush();
  click("scrambleBtn");await flush();
  assert.equal(board(),home);
  push("S");await flush();
  assert.equal(board(),"3 2 1 4 5 6 7 8");
  click("undoBtn");await flush();
  assert.equal(board(),home);
  push("R");push("T");await flush();
  nodes.get("customName").value="Q";
  click("saveCustom");await flush();
  assert(nodes.get("toolButtons").children.some(x=>x.dataset.kind==="C1"));
  click("resetBtn");await flush();
  push("C1");await flush();
  assert.equal(board(),"3 2 1 8 4 5 6 7");
  langs[1].click();await flush();
  assert.equal(globalThis.document.documentElement.lang,"en");
  assert.equal(board(),"3 2 1 8 4 5 6 7");
  click("newScramble");await flush();
  assert.notEqual(board(),home);
  click("freeHint");await flush();
  assert.equal(nodes.get("freeSolution").hidden,false);
  click("modeLearn");await flush();
  click("prevBtn");await flush();
  assert.equal(board(),home);
  assert.equal(JSON.parse(storage.get("oval-track-workshop-v2")).progress,4);
  console.log("Oval Track UI PASS: home on each lesson, explicit checks, wrong/retry, T→L→P→S, free play, macros, undo, language.");
})().catch(e=>{console.error(e);process.exitCode=1;});
