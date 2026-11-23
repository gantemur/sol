// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Linked n:k puzzle, construction exercises and mathematical views.
(()=>{
"use strict";
const F=window.OvalFamily, W=window.OvalFamilyText, V=window.OvalFamilyViews;
if(!F||!W||!V)throw Error("Family model, text and views are required");
const $=id=>document.getElementById(id);
const KEY="oval-track-family-v1",GUIDED=["3:2","4:2","4:3","5:2"];
const state={
  lang:"mn",variant:"3:2",n:3,k:2,mode:"build",view:"cayley",
  completed:{},lKnown:false,macros:{},sessionCache:{},
  preview:null,showHint:"",feedback:"",freeHint:false,prediction:"",
  pending:[],active:false,generation:0,abortFrame:null,
  swapCache:new Map()
};
function tx(k){return W.text(state.lang,k);}
function put(id,text){$(id).textContent=String(text);}
function current(){return state.sessionCache[state.variant];}
function session(){return current()[state.mode];}
function lessons(){return W.lessons(state.variant);}
function task(){return W.lesson(state.variant,current().taskIndex,state.lang);}
function home(){return F.home(state.n);}
function format(n){return new Intl.NumberFormat(state.lang==="mn"?"mn-MN":"en-US").format(n);}
function shortWord(word){
  if(!word?.length)return "e";
  const supers="⁰¹²³⁴⁵⁶⁷⁸⁹";
  const parts=[];
  for(let i=0;i<word.length;){
    let j=i+1;
    while(j<word.length&&word[j]===word[i])j++;
    const k=j-i;
    parts.push(word[i]+(k>1?String(k).split("").map(x=>supers[+x]).join(""):""));
    i=j;
  }
  return parts.join(" ");
}
function makeSession(board,initial=null,scramble=[]){
  return {board:[...board],initial:[...(initial||board)],history:[],verified:false,
    checkedWord:[],saved:false,scramble:[...scramble],feedback:""};
}
function makeFree(n,k){
  const scramble=F.scramble(n,k,5);
  const board=F.word(F.home(n),scramble,k);
  return makeSession(board,board,scramble);
}
function makeCase(n,k){
  const id=F.key(n,k), count=W.lessons(id).length;
  return {build:makeSession(F.home(n)),free:makeFree(n,k),
    taskIndex:Math.min(state.completed[id]||0,Math.max(0,count-1))};
}
function caseAllowed(id){return /^[3-8]:[2-4]$/.test(id)&&(()=>{const [n,k]=id.split(":").map(Number);try{return F.valid(n,k)}catch(_){return false}})();}
function savePersistent(){
  try{localStorage.setItem(KEY,JSON.stringify({
    version:1,lKnown:state.lKnown,completed:state.completed,macros:state.macros,variant:state.variant
  }));}catch(_){/* storage is optional */}
}
function loadPersistent(){
  try{
    const data=JSON.parse(localStorage.getItem(KEY)||"null");
    if(!data||data.version!==1)return;
    state.lKnown=!!data.lKnown;
    if(data.completed&&typeof data.completed==="object"){
      for(const [id,num] of Object.entries(data.completed)){
        if(caseAllowed(id)&&Number.isInteger(num))state.completed[id]=Math.max(0,Math.min(W.lessons(id).length,num));
      }
    }
    if(data.macros&&typeof data.macros==="object"){
      for(const [id,items] of Object.entries(data.macros)){
        if(!caseAllowed(id)||!Array.isArray(items))continue;
        const [n,k]=id.split(":").map(Number),clean=[];
        for(const item of items.slice(0,6)){
          if(!item||typeof item.name!=="string"||!nameAllowed(item.name)||!Array.isArray(item.codes))continue;
          if(!item.codes.length||item.codes.length>120||item.codes.some(x=>!["R","T","L"].includes(x)))continue;
          if(clean.some(x=>x.name.toLowerCase()===item.name.toLowerCase()))continue;
          try{F.word(F.home(n),item.codes,k);clean.push({name:item.name,codes:[...item.codes]});}catch(_){/* ignore corrupt data */}
        }
        state.macros[id]=clean;
      }
    }
    if(caseAllowed(data.variant))state.variant=data.variant;
  }catch(_){/* storage must not block the puzzle */}
}
function nameAllowed(name){return name.length<=12&&name.length>0&&/^[\p{L}\p{N}_-]+$/u.test(name);}
function availableCodes(){
  return state.lKnown?["R","T","L"]:["R","T"];
}
function macros(){return state.macros[state.variant]||[];}
function operations(){
  return [...availableCodes(),...macros().map((_,i)=>"M"+i)];
}
function operation(id){
  if(id==="R"||id==="T"||id==="L")return {label:id,codes:[id]};
  if(/^M\d+$/.test(id)){
    const item=macros()[Number(id.slice(1))];
    return item?{label:item.name,codes:[...item.codes]}:null;
  }
  return null;
}
function selectVariant(id,goBuild=true){
  if(!caseAllowed(id))return;
  cancelAll();
  const [n,k]=id.split(":").map(Number);
  state.n=n;state.k=k;state.variant=id;state.preview=null;
  state.showHint="";state.freeHint=false;state.prediction="";
  if(!state.sessionCache[id])state.sessionCache[id]=makeCase(n,k);
  if(goBuild)state.mode="build";
  $("nSelect").value=String(n);
  populateK(k);
  savePersistent();
  renderAll();
}
function populateK(requested){
  const select=$("kSelect"),old=Number(requested ?? select.value),n=Number($("nSelect").value)||state.n;
  select.replaceChildren();
  for(let k=2;k<=Math.min(n,4);k++){
    const option=document.createElement("option");
    option.value=String(k);option.textContent=String(k);
    select.appendChild(option);
  }
  select.value=String(old>=2&&old<=Math.min(4,n)?old:Math.min(4,n));
}
function newTask(index){
  const cfg=current();
  if(index<0||index>=W.lessons(state.variant).length)return;
  cancelAll();
  cfg.taskIndex=index;cfg.build=makeSession(home());
  state.showHint="";state.prediction="";
  renderAll();
}
function toggleMode(mode){
  if(mode!=="build"&&mode!=="free"||mode===state.mode)return;
  cancelAll();state.mode=mode;state.showHint="";state.prediction="";
  state.freeHint=false;state.preview=null;renderAll();
}
function cancelAll(){
  state.generation++;
  state.pending.length=0;
  if(state.abortFrame){
    const cancel=state.abortFrame;state.abortFrame=null;cancel();
  }
}
function restore(){
  cancelAll();
  if(state.mode==="build"){
    const cfg=current();cfg.build=makeSession(home());state.showHint="";state.prediction="";
  }else{
    const s=current().free;current().free=makeSession(s.initial,s.initial,s.scramble);
    state.freeHint=false;
  }
  renderAll();
}
function newScramble(){
  cancelAll();
  const length=Number($("scrambleSize").value)||5;
  const w=F.scramble(state.n,state.k,length);
  const board=F.word(home(),w,state.k);
  current().free=makeSession(board,board,w);
  state.freeHint=false;renderAll();
}
function enqueue(type,id=null){
  if(type==="move"){
    if(state.mode==="build"&&session().verified)return;
    if(!operations().includes(id))return;
  }
  if(state.pending.length>=24)return;
  state.pending.push({type,id,variant:state.variant,mode:state.mode,taskIndex:current().taskIndex});
  drain();
}
function chooseAnswer(value){
  state.prediction=value;
  document.querySelectorAll('input[name="predict"]').forEach(x=>{x.checked=x.value===value;});
}
function expandHistory(s){return s.history.flatMap(item=>item.codes);}
function checkCurrent(){
  const s=session(),t=task();
  if(state.mode!=="build"||!t||s.verified)return;
  if(t.type==="predict"){
    if(!state.prediction){s.feedback=tx("checkPick");return;}
    if(state.prediction===t.answer){
      s.verified=true;s.feedback=tx("checkCorrectPrediction");s.checkedWord=[];
    }else{s.feedback=tx("checkWrong");}
    return;
  }
  if(!s.history.length){s.feedback=tx("checkEmpty");return;}
  if(F.equal(s.board,t.target)){
    s.verified=true;s.checkedWord=expandHistory(s);s.feedback=tx("checkCorrect");
  }else{s.feedback=tx("checkWrong");}
}
function shortestCandidate(){
  const t=task();
  if(!t||t.type!=="word")return null;
  return F.shortestWord(state.n,state.k,t.target,availableCodes());
}
function confirm(){
  if(state.mode!=="build"||!session().verified)return;
  const t=task(),idx=current().taskIndex;
  if(t.reward==="L")state.lKnown=true;
  state.completed[state.variant]=Math.max(state.completed[state.variant]||0,idx+1);
  savePersistent();
  if(idx+1<lessons().length)newTask(idx+1);
  else {
    current().finished=true;
    renderAll();
  }
}
function saveMacro(){
  const s=session(),t=task();
  if(state.mode!=="build"||!s.verified||!t||t.type!=="word"||t.reward!=="save")return;
  const name=$("saveName").value.trim();
  if(!nameAllowed(name)){
    s.feedback=tx("nameInvalid");renderLesson();return;
  }
  if(["R","T","L"].includes(name.toUpperCase())||macros().some(m=>m.name.toLowerCase()===name.toLowerCase())){
    s.feedback=tx("nameTaken");renderLesson();return;
  }
  if(macros().length>=6){
    s.feedback="6";renderLesson();return;
  }
  const best=shortestCandidate();
  const codes=$("useShort").checked&&best?.length?[...best]:[...s.checkedWord];
  if(!codes.length||codes.length>120){s.feedback=tx("checkWrong");renderLesson();return;}
  if(!F.equal(F.word(home(),codes,state.k),t.target)){s.feedback=tx("checkWrong");renderLesson();return;}
  if(!state.macros[state.variant])state.macros[state.variant]=[];
  state.macros[state.variant].push({name,codes});
  s.saved=true;s.feedback=tx("saved")+" "+name;
  savePersistent();renderAll();
}
function showHint(kind){
  state.showHint=state.showHint===kind?"":kind;
  renderLesson();
}
function freeRoute(){
  const s=current().free;
  const whole=[...s.scramble,...expandHistory(s)];
  const answer=F.inverseWord(whole);
  return state.lKnown?answer:answer.flatMap(c=>c==="L"?Array(state.n-1).fill("R"):[c]);
}
function switchView(view){
  if(!["cayley","polygon","swaps"].includes(view))return;
  state.view=view;state.preview=null;
  renderMath();
}
function i18nLanguage(lang,updateUrl=false){
  if(!["mn","en"].includes(lang))return;
  state.lang=lang;document.documentElement.lang=lang;
  document.title=tx("heading")+" · Sol";
  document.querySelectorAll("[data-i18n]").forEach(node=>{node.textContent=tx(node.dataset.i18n);});
  document.querySelectorAll("[data-i18n-aria]").forEach(node=>{node.setAttribute("aria-label",tx(node.dataset.i18nAria));});
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===lang)));
  try{localStorage.setItem("sol-language",lang);}catch(_){}
  if(updateUrl){try{const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);}catch(_){}}
  cancelAll();renderAll();
}
function initialLanguage(){
  try{const u=new URLSearchParams(location.search).get("lang");if(["mn","en"].includes(u))return u;}catch(_){}
  try{const old=localStorage.getItem("sol-language");if(["mn","en"].includes(old))return old;}catch(_){}
  return "mn";
}


function renderCases(){
  const all=document.querySelectorAll("[data-case]");
  all.forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.case===state.variant)));
  const summary=F.summary(state.n,state.k);
  put("caseLabel",summary.key);put("caseTitle",summary.key+" · "+summary.name);
  put("caseDescription",tx("caseIntro"+state.n+state.k)||tx("caseIntroOther"));
  // tx() falls back to the key itself; override for cases without a guided caption.
  if(!GUIDED.includes(state.variant))put("caseDescription",tx("caseIntroOther"));
  put("reachCount",format(summary.reachable)+" / "+format(summary.total));
}
function renderTrack(){
  const s=session();
  V.drawTrack($("trackSvg"),state.n,state.k,s.board,{turn:"T: "+state.k,aria:state.lang==="mn"?"Дугуйнууд: ":"Disks: "});
  put("boardStatus",F.isHome(s.board)?tx("atHome"):tx("mixed"));
  $("leftMove").hidden=!state.lKnown;
  $("moveControls").style.gridTemplateColumns=state.lKnown?"repeat(3,minmax(0,1fr))":"repeat(2,minmax(0,1fr))";
  const frozen=state.mode==="build"&&s.verified;
  document.querySelectorAll("[data-move]").forEach(b=>{b.disabled=frozen;});
}
function renderMacros(){
  const target=$("macroControls");
  target.replaceChildren();
  const frozen=state.mode==="build"&&session().verified;
  macros().forEach((item,i)=>{
    const b=document.createElement("button");
    b.type="button";b.textContent=item.name;
    b.title=item.name+" = "+shortWord(item.codes);
    b.disabled=frozen;
    b.setAttribute("aria-label",item.name+": "+shortWord(item.codes));
    b.addEventListener("click",()=>enqueue("move","M"+i));
    target.appendChild(b);
  });
  const box=$("toolboxEntries");box.replaceChildren();
  const add=(name,word)=>{
    const row=document.createElement("div");row.className="toolrow";
    const n=document.createElement("strong");n.textContent=name;
    const code=document.createElement("code");code.textContent=word;
    row.append(n,code);box.appendChild(row);
  };
  add("R",tx("toolR"));add("T",tx("toolT"));
  if(state.lKnown)add("L",tx("learnedL").replace("ⁿ⁻¹","^"+(state.n-1)));
  macros().forEach(m=>add(m.name,shortWord(m.codes)));
}
function renderHistory(){
  const s=session(),target=$("moveHistory");
  target.replaceChildren();
  const primitiveCount=expandHistory(s).length;
  put("moveCount",s.history.length+" "+tx("operationCount")+" · "+primitiveCount+" "+tx("primitiveCount"));
  $("undoBtn").disabled=s.history.length===0 && state.pending.length===0;
  if(!s.history.length){
    const span=document.createElement("span");span.textContent=tx("emptyHistory");target.appendChild(span);
    return;
  }
  if(s.history.length>18){
    const more=document.createElement("span");more.textContent="…"+(s.history.length-18);
    target.appendChild(more);
  }
  for(const item of s.history.slice(-18)){
    const chip=document.createElement("span");chip.className="chip";chip.textContent=item.label;
    chip.title=shortWord(item.codes);
    target.appendChild(chip);
  }
}
function renderLesson(){
  $("buildMode").setAttribute("aria-pressed",String(state.mode==="build"));
  $("freeMode").setAttribute("aria-pressed",String(state.mode==="free"));
  $("buildPane").hidden=state.mode!=="build";$("freePane").hidden=state.mode!=="free";
  const t=task(),s=current().build;
  if(!t){
    put("taskStep","—");
    put("taskTitle",tx("noLessonTitle"));
    put("taskDescription",tx("noLessonDesc"));
    $("goalBox").hidden=true;$("predictionBox").hidden=true;
    $("checkBtn").hidden=true;$("checkFeedback").hidden=true;
    $("confirmation").hidden=true;
    $("hintBtn").hidden=true;$("explainBtn").hidden=true;$("hintText").hidden=true;
    $("prevTask").disabled=true;$("nextTask").disabled=true;
    return;
  }
  $("goalBox").hidden=false;$("checkBtn").hidden=false;$("checkFeedback").hidden=false;
  $("hintBtn").hidden=false;$("explainBtn").hidden=false;
  const index=current().taskIndex;
  put("taskStep",(index+1)+" / "+lessons().length);
  put("taskTitle",t.title);put("taskDescription",t.description);
  put("targetBoard",t.target.join(" "));
  $("predictionBox").hidden=t.type!=="predict";
  // Keep the user's explicit yes/no selection on re-render.
  document.querySelectorAll('input[name="predict"]').forEach(x=>{x.checked=x.value===state.prediction;});
  put("checkBtn",t.type==="predict"?(state.lang==="mn"?"Таамгаа шалгах":"Check my prediction"):tx("check"));
  $("checkBtn").disabled=s.verified;
  put("checkFeedback",s.feedback);
  $("checkFeedback").classList.toggle("success",s.verified);
  $("confirmation").hidden=!s.verified;
  if(s.verified){
    const text=t.type==="predict"?t.explain:
      (t.reward==="L"?
        (state.lang==="mn"?"L-г нэг алхам зүүн тийш хөдөлгөх хэрэгсэл болгож нээнэ.":"You will unlock one native left-step button L."):
        t.explain);
    put("confirmationText",text);
    const canSave=t.type==="word"&&t.reward==="save"&&!s.saved;
    $("recipeChoice").hidden=!canSave;
    if(canSave){
      const original=s.checkedWord;
      const shortest=shortestCandidate();
      put("recipeOriginal",tx("originalRecipe")+" "+shortWord(original)+" ("+original.length+")");
      put("recipeShort",tx("shortRecipe")+" "+shortWord(shortest||original)+" ("+(shortest||original).length+")");
      const tag=state.variant+":"+index;
      if($("saveName").dataset.forTask!==tag){
        $("saveName").value=t.defaultName||"U";
        $("saveName").dataset.forTask=tag;
        $("useShort").checked=true;
      }
    }
    const done=state.completed[state.variant]||0;
    put("confirmBtn",done>index?tx("confirm"):tx("confirm"));
  }
  $("hintText").hidden=!state.showHint;
  if(state.showHint)put("hintText",state.showHint==="hint"?t.hint:t.explain);
  $("prevTask").disabled=index===0;
  $("nextTask").disabled=index>=lessons().length-1||index+1>(state.completed[state.variant]||0);
}
function renderFree(){
  const s=current().free;
  $("freePane").hidden=state.mode!=="free";
  $("buildPane").hidden=state.mode!=="build";
  put("freeStatus",F.isHome(s.board)?tx("freeSolved"):tx("freeInProgress"));
  put("showSolution",state.freeHint?tx("hideRoute"):tx("showRoute"));
  $("solutionText").hidden=!state.freeHint;
  if(state.freeHint){
    const solution=freeRoute();
    put("solutionText",tx("solutionRoute")+" "+shortWord(solution)+"\n"+tx("nonoptimal"));
  }
}
function renderMath(){
  const svg=$("mathSvg");
  document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===state.view)));
  $("unreachableExample").hidden=!(state.variant==="4:3" && state.view==="cayley");
  const board=session().board;
  put("boardSequence",board.join(" "));
  put("cycleNotation",F.cycleText(board));
  put("generatorNotation","R=(1 2 … "+state.n+"), T="+TNotation(state.k));
  if(state.view==="polygon"){
    const result=V.drawPolygon(svg,state.n,board,{aria:tx("polygon")+": "});
    put("viewDescription",tx("viewPolygon"));
    const kind={rotation:"shapeRotation",reflection:"shapeReflection",distorted:"shapeBroken"}[result.kind];
    put("viewStatus",tx("originalSides")+" "+result.preserved+"/"+state.n+" · "+tx(kind));
  }else if(state.view==="swaps"){
    const id=state.variant;
    if(!state.swapCache.has(id))state.swapCache.set(id,F.swapPairs(state.n,state.k));
    const pairs=state.swapCache.get(id);
    V.drawSwapGraph(svg,state.n,state.k,pairs,state.lang);
    put("viewDescription",tx("viewSwaps"));
    let msg=tx("swapCount")+" "+pairs.length;
    if(pairs.length===state.n*(state.n-1)/2)msg+=" · "+tx("swapAll");
    if(!pairs.length)msg+=" · "+tx("swapNone");
    put("viewStatus",msg);
  }else{
    const data=V.drawCayley(svg,state.n,state.k,board,state.lang,state.preview?.join(",")||null,
      selected=>{state.preview=[...selected];renderMath();},typeof window.innerWidth==="number"&&window.innerWidth<610);
    put("viewDescription",state.variant==="4:3"?tx("viewCayleyDisconnected"):data?tx("viewCayley"):tx("viewCayleyLarge"));
    let message=data?(data.nodes+" "+(state.lang==="mn"?"цэг":"vertices")+" · "+data.components+
      " "+(state.lang==="mn"?"холбогдсон хэсэг":"component(s)")+"\n"+tx("graphStep")):tx("viewCayleyLarge");
    if(state.preview){
      const node=F.smallGraph(state.n,state.k)?.byId.get(state.preview.join(","));
      message+="\n"+tx("graphClicked")+" "+state.preview.join(" ")+". "+(node?.reachable?tx("graphReachable"):tx("graphUnreachable"));
    }
    put("viewStatus",message);
  }
}
function TNotation(k){
  const pairs=[];
  for(let i=1;i<=Math.floor(k/2);i++)pairs.push("("+i+" "+(k+1-i)+")");
  return pairs.join("")||"e";
}
function renderAll(){
  renderCases();renderTrack();renderMacros();renderHistory();
  renderLesson();renderFree();renderMath();
}


function eased(t){return t*t*(3-2*t);}
function reducedMotion(){
  try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(_){return false;}
}
function animateOne(s,code,token,fast=false){
  const before=[...s.board],after=F.move(before,code,state.k);
  if(reducedMotion()||typeof requestAnimationFrame!=="function"){
    s.board=after;renderTrack();return Promise.resolve(true);
  }
  const svg=$("trackSvg"),parts=new Map();
  for(const g of svg.querySelectorAll("[data-tile]"))parts.set(Number(g.getAttribute("data-tile")),g);
  if(parts.size!==state.n){
    s.board=after;renderTrack();return Promise.resolve(true);
  }
  const positions=V.trackPositions(state.n),from=new Map(),to=new Map();
  before.forEach((tile,i)=>from.set(tile,i));
  after.forEach((tile,i)=>to.set(tile,i));
  return new Promise(resolve=>{
    let frame=0,start=null,ended=false;
    const duration=fast?95:215;
    function finish(result){
      if(ended)return;
      ended=true;
      if(frame)cancelAnimationFrame(frame);
      if(state.abortFrame===abort)state.abortFrame=null;
      resolve(result);
    }
    function abort(){finish(false);}
    state.abortFrame=abort;
    function tick(time){
      if(ended)return;
      if(token!==state.generation){finish(false);return;}
      if(start===null)start=time;
      const t=Math.min(1,Math.max(0,(time-start)/duration)),f=eased(t);
      for(const tile of before){
        const i=from.get(tile),j=to.get(tile),a=positions[i],b=positions[j];
        let x,y;
        if(code==="R"||code==="L"){
          const theta=-2.42+2*Math.PI*(i+(code==="R"?f:-f))/state.n;
          x=240+164*Math.cos(theta);y=169+111*Math.sin(theta);
        }else{
          x=a.x+(b.x-a.x)*f;y=a.y+(b.y-a.y)*f;
          const d=Math.hypot(b.x-a.x,b.y-a.y)||1,side=(i%2?1:-1)*19*Math.sin(Math.PI*f);
          x+=-(b.y-a.y)/d*side;
          y+=(b.x-a.x)/d*side;
        }
        parts.get(tile).setAttribute("transform","translate("+x.toFixed(2)+" "+y.toFixed(2)+")");
      }
      if(t<1)frame=requestAnimationFrame(tick);
      else finish(true);
    }
    frame=requestAnimationFrame(tick);
  }).then(ok=>{
    if(ok&&token===state.generation){s.board=after;renderTrack();return true;}
    return false;
  });
}
async function playWord(s,codes,token){
  const start=[...s.board],fast=codes.length>3;
  for(const code of codes){
    const ok=await animateOne(s,code,token,fast);
    if(!ok||token!==state.generation){
      s.board=start;return false;
    }
  }
  return true;
}
async function drain(){
  if(state.active)return;
  state.active=true;
  const token=state.generation;
  try{
    while(state.pending.length&&state.generation===token){
      const action=state.pending.shift();
      if(action.variant!==state.variant||action.mode!==state.mode)continue;
      if(action.mode==="build"&&action.taskIndex!==current().taskIndex)continue;
      const s=session();
      if(action.type==="check"){
        checkCurrent();renderAll();continue;
      }
      if(action.type==="undo"&&!s.history.length){renderHistory();continue;}
      if(action.type==="move" && state.mode==="build"&&s.verified)continue;
      let entry=null,codes;
      if(action.type==="undo"){
        entry=s.history[s.history.length-1];
        codes=F.inverseWord(entry.codes);
      }else{
        entry=operation(action.id);
        if(!entry)continue;
        codes=entry.codes;
      }
      if(!codes.length||codes.length>120)continue;
      const okay=await playWord(s,codes,token);
      if(!okay||state.generation!==token)break;
      if(action.type==="undo")s.history.pop();
      else s.history.push({label:entry.label,codes:[...codes]});
      s.verified=false;s.checkedWord=[];s.feedback="";
      renderAll();
    }
  }finally{
    state.active=false;
    renderAll();
    if(state.pending.length)drain();
  }
}
function bind(){
  document.querySelectorAll("[data-case]").forEach(btn=>
    btn.addEventListener("click",()=>selectVariant(btn.dataset.case,true)));
  $("nSelect").addEventListener("change",()=>populateK());
  $("openVariant").addEventListener("click",()=>{
    const id=$("nSelect").value+":"+$("kSelect").value;selectVariant(id,true);
  });
  document.querySelectorAll("[data-move]").forEach(btn=>
    btn.addEventListener("click",()=>enqueue("move",btn.dataset.move)));
  $("undoBtn").addEventListener("click",()=>enqueue("undo"));
  $("resetBtn").addEventListener("click",restore);
  $("buildMode").addEventListener("click",()=>toggleMode("build"));
  $("freeMode").addEventListener("click",()=>toggleMode("free"));
  $("checkBtn").addEventListener("click",()=>enqueue("check"));
  $("confirmBtn").addEventListener("click",confirm);
  $("saveMacro").addEventListener("click",saveMacro);
  $("hintBtn").addEventListener("click",()=>showHint("hint"));
  $("explainBtn").addEventListener("click",()=>showHint("explain"));
  $("prevTask").addEventListener("click",()=>newTask(current().taskIndex-1));
  $("nextTask").addEventListener("click",()=>{
    if(current().taskIndex+1<lessons().length&&current().taskIndex+1<=(state.completed[state.variant]||0))
      newTask(current().taskIndex+1);
  });
  document.querySelectorAll('input[name="predict"]').forEach(input=>
    input.addEventListener("change",()=>chooseAnswer(input.value)));
  $("newScramble").addEventListener("click",newScramble);
  $("showSolution").addEventListener("click",()=>{
    state.freeHint=!state.freeHint;renderFree();
  });
  document.querySelectorAll("[data-view]").forEach(btn=>
    btn.addEventListener("click",()=>switchView(btn.dataset.view)));
  $("unreachableExample").addEventListener("click",()=>{
    state.view="cayley";
    state.preview=F.swapBoard(4,1,2);
    renderMath();
  });
  document.querySelectorAll("[data-lang]").forEach(btn=>
    btn.addEventListener("click",()=>i18nLanguage(btn.dataset.lang,true)));
  document.addEventListener("keydown",e=>{
    const active=document.activeElement;
    if(e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY)$/.test(active?.tagName||""))return;
    let action=null;
    if(e.key==="ArrowRight")action="R";
    else if(e.key==="ArrowLeft"&&state.lKnown)action="L";
    else if(e.key.toLowerCase()==="f")action="T";
    else if(e.key.toLowerCase()==="z"){e.preventDefault();enqueue("undo");return;}
    if(action){e.preventDefault();enqueue("move",action);}
  });
  window.addEventListener?.("resize",()=>{if(state.view==="cayley")renderMath();});
}
function initialize(){
  loadPersistent();
  const variant=caseAllowed(state.variant)?state.variant:"3:2";
  const [n,k]=variant.split(":").map(Number);
  state.n=n;state.k=k;state.variant=variant;
  $("nSelect").value=String(n);populateK(k);
  state.sessionCache[variant]=makeCase(n,k);
  bind();
  i18nLanguage(initialLanguage());
}
initialize();
})();
