// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Pure n:k Oval Track model. Move words are chronological, left to right.
(function(root, factory) {
  const api=factory();
  if(typeof module!=="undefined" && module.exports) module.exports=api;
  else root.OvalFamily=api;
})(globalThis,()=>{
  "use strict";
  const COUNTS=Object.freeze({
    "3:2":6,"3:3":6,
    "4:2":24,"4:3":8,"4:4":8,
    "5:2":120,"5:3":120,"5:4":10,
    "6:2":720,"6:3":72,"6:4":720,
    "7:2":5040,"7:3":5040,"7:4":2520,
    "8:2":40320,"8:3":1152,"8:4":40320
  });
  const key=(n,k)=>n+":"+k;
  function valid(n,k) {
    if(!Number.isInteger(n)||n<3||n>8||!Number.isInteger(k)||k<2||k>Math.min(4,n)) throw new RangeError("Require 3 ≤ n ≤ 8 and 2 ≤ k ≤ min(n,4)");
    return true;
  }
  function home(n){if(!Number.isInteger(n)||n<3||n>8)throw new RangeError("Invalid n");return Array.from({length:n},(_,i)=>i+1);}
  function validateBoard(board,n){
    if(!Array.isArray(board)||board.length!==n||new Set(board).size!==n||board.some(x=>!Number.isInteger(x)||x<1||x>n))throw new RangeError("Invalid board");
    return true;
  }
  function move(board,code,k){
    const n=board.length;valid(n,k);validateBoard(board,n);
    if(code==="R")return [board[n-1],...board.slice(0,n-1)];
    if(code==="L")return [...board.slice(1),board[0]];
    if(code==="T")return [...board.slice(0,k).reverse(),...board.slice(k)];
    throw new RangeError("Unknown move "+code);
  }
  function word(board,moves,k){return [...moves].reduce((b,c)=>move(b,c,k),[...board]);}
  function inverse(c){if(c==="R")return "L";if(c==="L")return "R";if(c==="T")return "T";throw new RangeError("Unknown move");}
  function inverseWord(w){return [...w].reverse().map(inverse);}
  function permutation(board){const n=board.length;validateBoard(board,n);const p=Array(n);board.forEach((tile,i)=>{p[tile-1]=i+1;});return p;}
  function cycles(board){
    const p=permutation(board),seen=new Set(),out=[];
    for(let j=1;j<=p.length;j++){
      if(seen.has(j))continue;const c=[];let a=j;
      while(!seen.has(a)){seen.add(a);c.push(a);a=p[a-1];}
      if(c.length>1)out.push(c);
    }
    return out;
  }
  function cycleText(board){return cycles(board).map(c=>"("+c.join(" ")+")").join("")||"e";}
  function isHome(board){return board.every((x,i)=>x===i+1);}
  function equal(a,b){return a.length===b.length && a.every((x,i)=>x===b[i]);}
  function factorial(n){let x=1;for(let i=2;i<=n;i++)x*=i;return x;}
  function summary(n,k){
    valid(n,k);const size=COUNTS[key(n,k)],full=factorial(n);
    let name=size===full?"S"+n:"";
    if(!name&&size===2*n)name="D"+n;
    if(!name&&size===full/2)name="A"+n;
    if(!name)name="proper subgroup";
    return {n,k,key:key(n,k),reachable:size,total:full,all:size===full,name};
  }
  function swapBoard(n,a,b){
    const h=home(n);if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||a>n||b<1||b>n||a===b)throw new RangeError("Bad swap");
    [h[a-1],h[b-1]]=[h[b-1],h[a-1]];return h;
  }
  function polygonLinks(board){
    const n=board.length;validateBoard(board,n);
    const pos=permutation(board).map(x=>x-1),edges=[];
    for(let i=0;i<n;i++){
      const a=pos[i],b=pos[(i+1)%n];
      edges.push({from:a,to:b,perimeter:((a-b+n)%n===1 || (b-a+n)%n===1)});
    }
    return edges;
  }
  function polygonKind(board){
    const n=board.length;
    if(polygonLinks(board).every(e=>e.perimeter)){
      for(let offset=0;offset<n;offset++) if(board.every((b,i)=>b===1+((i+offset)%n)))return "rotation";
      return "reflection";
    }
    return "distorted";
  }
  function allPermutations(n){
    const out=[],values=home(n);
    function rec(start){if(start===n){out.push([...values]);return;}
      for(let j=start;j<n;j++){[values[start],values[j]]=[values[j],values[start]];rec(start+1);[values[start],values[j]]=[values[j],values[start]];}
    }
    rec(0);return out;
  }
  // Exact breadth-first search. Feasible (at most 8!=40,320 states).
  function reachable(n,k,alphabet=["R","T"]){
    valid(n,k);
    const first=home(n),nodes=[first],paths=new Map([[first.join(","),[]]]);
    for(let cursor=0;cursor<nodes.length;cursor++){
      const b=nodes[cursor],path=paths.get(b.join(","));
      for(const c of alphabet){
        const next=move(b,c,k),id=next.join(",");
        if(paths.has(id))continue;
        paths.set(id,[...path,c]);nodes.push(next);
      }
    }
    return {nodes,paths};
  }
  function shortestWord(n,k,target,alphabet=["R","T","L"]){
    valid(n,k);validateBoard(target,n);
    return reachable(n,k,alphabet).paths.get(target.join(",")) ?? null;
  }
  function allComponents(n,k){
    valid(n,k);
    if(n>4)throw new RangeError("Full configuration graph only for n ≤ 4");
    const all=allPermutations(n),lookup=new Map(all.map(b=>[b.join(","),b]));
    const unseen=new Set(lookup.keys()),out=[];
    const startKeys=[home(n).join(","),...unseen];
    for(const first of startKeys){
      if(!unseen.has(first))continue;
      const queue=[lookup.get(first)];unseen.delete(first);
      for(let i=0;i<queue.length;i++) for(const c of ["R","T"]){
        const next=move(queue[i],c,k),id=next.join(",");
        if(unseen.has(id)){unseen.delete(id);queue.push(lookup.get(id));}
      }
      out.push(queue);
    }
    return out;
  }
  function smallGraph(n,k){
    valid(n,k);
    // n≤4: show all n! positions, including unreachable components.
    // At n=5:k=4, show the tiny reachable D5 component only.
    const components=n<=4?allComponents(n,k):
      (summary(n,k).reachable<=24?[reachable(n,k).nodes]:null);
    if(!components)return null;
    const nodes=[],byId=new Map();
    components.forEach((component,ci)=>component.forEach((b,i)=>{
      const item={id:b.join(","),board:b,component:ci,index:i,reachable:ci===0};
      byId.set(item.id,item);nodes.push(item);
    }));
    const edges=[];
    for(const node of nodes)for(const c of ["R","T"]){
      const target=byId.get(move(node.board,c,k).join(","));
      if(!target)throw Error("Graph edge missing");
      if(c==="T"&&node.id>target.id)continue;
      edges.push({from:node.id,to:target.id,code:c});
    }
    return {nodes,edges,components:components.length,byId};
  }
  function swapPairs(n,k){
    valid(n,k);
    const keys=reachable(n,k).paths,pairs=[];
    for(let a=1;a<=n;a++)for(let b=a+1;b<=n;b++){
      if(keys.has(swapBoard(n,a,b).join(",")))pairs.push([a,b]);
    }
    return pairs;
  }
  function scramble(n,k,length=5,rng=Math.random){
    valid(n,k);if(!Number.isInteger(length)||length<1||length>24)throw new RangeError("Bad scramble length");
    for(let attempt=0;attempt<30;attempt++){
      const w=[];
      for(let i=0;i<length;i++){
        const choices=["R","T","L"].filter(c=>!w.length||c!==inverse(w[w.length-1]));
        const v=Number(rng()),j=Number.isFinite(v)?Math.min(choices.length-1,Math.max(0,Math.floor(v*choices.length))):0;
        w.push(choices[j]);
      }
      if(!isHome(word(home(n),w,k)))return w;
    }
    // Maintain the requested move count even if a deterministic RNG repeatedly
    // produces an identity: a rotation followed by T cannot be a rotation.
    return [...Array(length-1).fill("R"),"T"];
  }
  return Object.freeze({COUNTS,key,valid,home,move,word,inverse,inverseWord,
    permutation,cycles,cycleText,isHome,equal,factorial,summary,swapBoard,polygonLinks,
    polygonKind,allPermutations,reachable,shortestWord,allComponents,smallGraph,swapPairs,scramble});
});
