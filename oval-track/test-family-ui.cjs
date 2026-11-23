// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Run: node oval-track/test-family-ui.cjs
// Reduced-motion, headless smoke; real browser geometry/touch tested separately.
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
class FakeElement {
 constructor(tag="DIV"){
  this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.style={};
  this.textContent="";this.value="";this.checked=false;this.disabled=false;this.hidden=false;this.className="";
  this.classList={toggle(){},add(){}};
 }
 setAttribute(k,v){this.attributes[k]=String(v);if(k.startsWith("data-"))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,l)=>l.toUpperCase())]=String(v);}
 getAttribute(k){return this.attributes[k]??null;}
 append(...x){this.children.push(...x);}
 appendChild(x){this.children.push(x);return x;}
 replaceChildren(...x){this.children=x;}
 addEventListener(name,fn){this.events[name]=fn;}
 click(){this.events.click?.({preventDefault(){}});}
 change(){this.events.change?.({preventDefault(){}});}
 querySelectorAll(selector){
  const result=[],walk=node=>{
    if(selector==="[data-tile]"&&node.attributes["data-tile"]!==undefined)result.push(node);
    for(const ch of node.children)if(ch instanceof FakeElement)walk(ch);
  };walk(this);return result;
 }
}
const byId=new Map(),byAttr={};
for(const match of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*?)>/gi)){
 const [_,tag,raw]=match,attrs={};
 for(const m of raw.matchAll(/([\w:-]+)="([^"]*)"/g))attrs[m[1]]=m[2];
 let node=attrs.id?byId.get(attrs.id):null;
 if(!node){node=new FakeElement(tag.toUpperCase());if(attrs.id)byId.set(attrs.id,node);}
 for(const [name,value] of Object.entries(attrs)){node.setAttribute(name,value);if(name==="value")node.value=value;}
 for(const k of ["data-i18n","data-i18n-aria","data-lang","data-case","data-view","data-move","name"]){
  if(attrs[k]===undefined)continue;
  (byAttr[k]??=[]).push(node);
 }
}
const el=id=>{const found=byId.get(id);assert(found,"Missing DOM id "+id);return found;};
el("nSelect").value="3";el("kSelect").value="2";el("scrambleSize").value="5";
const store=new Map(),docEvents={};
globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
globalThis.location={search:"",href:"https://example.org/sol/oval-track/"};
globalThis.history={replaceState(){}};
globalThis.document={
 title:"",documentElement:{lang:"mn"},activeElement:{tagName:"BODY"},
 getElementById:el,
 querySelectorAll:selector=>{
  if(selector==='input[name="predict"]')return byAttr.name||[];
  return byAttr[selector.slice(1,-1)]||[];
 },
 createElement:tag=>new FakeElement(tag.toUpperCase()),
 createElementNS:(ns,tag)=>new FakeElement(tag.toUpperCase()),
 addEventListener:(key,fn)=>{docEvents[key]=fn;}
};
globalThis.window={
 OvalFamily:require("./family-model.js"),
 OvalFamilyText:require("./family-text.js"),
 OvalFamilyViews:require("./family-views.js"),
 matchMedia:()=>({matches:true}),innerWidth:1024,addEventListener(){}
};
require("./family-app.js");
const press=id=>el(id).click();
const tool=code=>{
 const b=(byAttr["data-move"]||[]).find(x=>x.dataset.move===code);
 assert(b,"Move button "+code);
 assert.equal(b.hidden,false,"Move not yet unlocked: "+code);
 b.click();
};
const chooseCase=id=>{
 const b=(byAttr["data-case"]||[]).find(x=>x.dataset.case===id);
 assert(b,"Missing guided case "+id);b.click();
};
const chooseView=view=>{
 const b=(byAttr["data-view"]||[]).find(x=>x.dataset.view===view);
 assert(b,"Missing view "+view);b.click();
};
const board=()=>el("boardSequence").textContent;
const flush=async()=>{for(let i=0;i<160;i++)await Promise.resolve();};
(async()=>{
 assert.equal(document.documentElement.lang,"mn");
 assert.equal(board(),"1 2 3");
 assert.equal(el("reachCount").textContent,"6 / 6");
 assert.equal(el("leftMove").hidden,true);
 assert(el("mathSvg").children.length>0,"3:2 Cayley graph drawn");
 press("checkBtn");await flush();
 assert.equal(el("checkFeedback").textContent,"Эхлээд үйлдэл хийнэ үү.");
 tool("T");await flush();
 assert.equal(board(),"2 1 3");
 assert.equal(el("confirmation").hidden,true,"Do not discover passively");
 press("checkBtn");await flush();
 assert.equal(el("confirmation").hidden,false,"Explicit check accepts T");
 press("confirmBtn");await flush();
 assert.equal(board(),"1 2 3","New task begins home");
 assert.equal(el("taskStep").textContent,"2 / 3");
 tool("R");tool("R");await flush();
 assert.equal(board(),"2 3 1","R² candidate");
 assert.equal(el("confirmation").hidden,true);
 press("checkBtn");await flush();press("confirmBtn");await flush();
 assert.equal(el("leftMove").hidden,false,"L earned");
 assert.equal(el("taskStep").textContent,"3 / 3");
 tool("R");tool("T");tool("L");await flush();
 assert.equal(board(),"3 2 1");
 press("checkBtn");await flush();
 assert.equal(el("recipeChoice").hidden,false,"Optional saved operation");
 press("saveMacro");await flush();
 assert.equal(el("macroControls").children.length,1);
 press("confirmBtn");await flush();
 assert.equal(JSON.parse(store.get("oval-track-family-v1")).completed["3:2"],3);
 // Comparing 4:2 with 4:3, both with all 24 possible labelled boards.
 chooseCase("4:2");await flush();
 assert.equal(board(),"1 2 3 4");
 assert.equal(el("reachCount").textContent,"24 / 24");
 tool("L");tool("T");tool("R");await flush();
 assert.equal(board(),"1 3 2 4");
 assert.equal(el("confirmation").hidden,true);
 press("checkBtn");await flush();press("confirmBtn");await flush();
 assert.equal(el("taskStep").textContent,"2 / 2");
 chooseCase("4:3");await flush();
 assert.equal(board(),"1 2 3 4");
 assert.equal(el("reachCount").textContent,"8 / 24");
 assert.equal(el("mathSvg").getAttribute("aria-label").includes("3 components"),true);
 press("unreachableExample");await flush();
 assert.match(el("viewStatus").textContent,/2 1 3 4/);
 tool("L");tool("T");tool("R");await flush();
 assert.equal(board(),"1 4 3 2");
 press("checkBtn");await flush();press("confirmBtn");await flush();
 assert.equal(el("taskStep").textContent,"2 / 2");
 const radios=byAttr.name||[];
 const no=radios.find(x=>x.value==="no");
 assert(no,"unreachable radio missing");
 no.change();await flush();
 press("checkBtn");await flush();
 assert.equal(el("confirmation").hidden,false);
 press("confirmBtn");await flush();
 assert.equal(JSON.parse(store.get("oval-track-family-v1")).completed["4:3"],2);
 // Polygon and the distinct D5 case are already covered by the generic model.
 el("nSelect").value="5";el("nSelect").change();el("kSelect").value="4";
 press("openVariant");await flush();
 assert.equal(board(),"1 2 3 4 5");
 assert.equal(el("reachCount").textContent,"10 / 120");
 chooseView("polygon");
 tool("T");await flush();
 assert.equal(el("viewStatus").textContent.includes("5/5"),true);
 chooseView("swaps");await flush();
 assert.match(el("viewStatus").textContent,/0/);
 // Free play, route back and language toggle.
 press("freeMode");await flush();
 assert.equal(el("freePane").hidden,false);
 press("newScramble");await flush();
 assert.notEqual(board(),"1 2 3 4 5");
 press("showSolution");await flush();
 assert.equal(el("solutionText").hidden,false);
 (byAttr["data-lang"].find(x=>x.dataset.lang==="en")).click();await flush();
 assert.equal(document.documentElement.lang,"en");
 assert.equal(el("reachCount").textContent,"10 / 120");
 console.log("Oval Track family UI PASS: manual construction, L, macros, 3:2/4:2/4:3, islands, polygon, 5:4, free play, language.");
})().catch(e=>{console.error(e);process.exitCode=1;});
