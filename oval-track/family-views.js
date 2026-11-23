// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// All three diagrams read the SAME permutation; no separate graphical game state.
(function(root,factory) {
 const api=factory(root.OvalFamily || (typeof require==="function"&&require("./family-model.js")));
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 else root.OvalFamilyViews=api;
})(globalThis,F=>{
 "use strict";
 const NS="http://www.w3.org/2000/svg";
 const TILE_COLORS=["#F0D6A5","#ACDDD1","#D7C8EB","#A8CFE4","#EAC9C6","#CFDEA6","#DBC5E1","#B5D9D7"];
 function el(tag,attributes={},content=null) {
   const node=document.createElementNS(NS,tag);
   for(const [name,value] of Object.entries(attributes))node.setAttribute(name,String(value));
   if(content!==null)node.textContent=String(content);
   return node;
 }
 function append(parent,child){parent.appendChild(child);return child;}
 function clear(svg,box){svg.replaceChildren();svg.setAttribute("viewBox",box||"0 0 480 340");}
 function pt(n,i,view="track"){
   const theta=(view==="track"?-2.42:-Math.PI/2)+2*Math.PI*i/n;
   const rx=view==="track"?164:117,ry=view==="track"?111:117;
   return {x:240+rx*Math.cos(theta),y:169+ry*Math.sin(theta),theta};
 }
 function trackPositions(n){return Array.from({length:n},(_,i)=>pt(n,i));}
 function polygonPositions(n){return Array.from({length:n},(_,i)=>pt(n,i,"polygon"));}
 function path(points,closed=false){
   return points.map((p,i)=>(i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)).join(" ")+(closed?" Z":"");
 }
 function marker(svg){
   const defs=append(svg,el("defs"));
   const m=append(defs,el("marker",{id:"family-arrow",viewBox:"0 0 10 10",refX:7,refY:5,markerWidth:5,markerHeight:5,orient:"auto-start-reverse"}));
   append(m,el("path",{d:"M 0 1 L 9 5 L 0 9 Z",fill:"#4c8b86"}));
 }
 function drawTrack(svg,n,k,board,text={}){
   F.valid(n,k);const points=trackPositions(n);
   clear(svg,"0 0 480 340");
   append(svg,el("ellipse",{cx:240,cy:169,rx:189,ry:137,fill:"#eef3ed",stroke:"#b4c9be","stroke-width":2}));
   append(svg,el("ellipse",{cx:240,cy:169,rx:140,ry:91,fill:"#f7f9f4",stroke:"#fff","stroke-width":2}));
   // Highlight the first k consecutive SLOTS, not disks with particular labels.
   const highlight=[];
   for(let step=0;step<=40*(k-1);step++){
     const i=step/40;
     const th=-2.42+2*Math.PI*i/n;
     highlight.push({x:240+164*Math.cos(th),y:169+111*Math.sin(th)});
   }
   append(svg,el("path",{d:path(highlight),fill:"none",stroke:"#d4a15a","stroke-opacity":".29","stroke-width":46,"stroke-linecap":"round"}));
   append(svg,el("text",{x:240,y:164,"text-anchor":"middle",fill:"#6e806f","font-size":19,"font-weight":800},n+":"+k));
   append(svg,el("text",{x:240,y:186,"text-anchor":"middle",fill:"#8b7a5d","font-size":13},text.turn||"T: "+k+" ↔"));
   for(let i=0;i<n;i++){
     const p=points[i],outer=ptOuter(p,240,169,1.23);
     append(svg,el("text",{x:outer.x,y:outer.y+4,"text-anchor":"middle",fill:"#6f827a","font-size":12,"font-weight":700},"p"+(i+1)));
     const group=append(svg,el("g",{transform:"translate("+p.x.toFixed(2)+" "+p.y.toFixed(2)+")","data-tile":board[i]}));
     append(group,el("circle",{r:24,fill:i<k?"#fff8e8":"#fff",stroke:i<k?"#d8a45c":"#adc7b8","stroke-width":2}));
     append(group,el("circle",{r:19,fill:TILE_COLORS[board[i]-1],stroke:"#536b61","stroke-width":1}));
     append(group,el("text",{x:0,y:6,"text-anchor":"middle","font-size":21,"font-weight":800,fill:"#233a37"},board[i]));
   }
   svg.setAttribute("aria-label",(text.aria||"Oval track: ")+board.join(" "));
   return points;
 }
 function ptOuter(p,x,y,scale){return {x:x+(p.x-x)*scale,y:y+(p.y-y)*scale};}
 function drawPolygon(svg,n,board,text={}){
   const points=polygonPositions(n),links=F.polygonLinks(board);
   clear(svg,"0 0 480 340");
   append(svg,el("path",{d:path(points,true),fill:"#f4f7f3",stroke:"#b8c7bd","stroke-width":6,"stroke-opacity":".7","stroke-linejoin":"round"}));
   const fixed=links.filter(e=>e.perimeter),chords=links.filter(e=>!e.perimeter);
   for(const e of [...fixed,...chords]){
     const a=points[e.from],b=points[e.to];
     append(svg,el("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,
       stroke:e.perimeter?"#2e857b":"#c58840","stroke-width":e.perimeter?3.5:3.7,
       "stroke-linecap":"round",opacity:e.perimeter?1:.92}));
   }
   if(F.polygonKind(board)==="reflection" && n%2===1){
     const fixedPosition=board.findIndex((tile,i)=>tile===i+1);
     if(fixedPosition>=0){
       const p=points[fixedPosition],dx=p.x-240,dy=p.y-169;
       append(svg,el("line",{x1:240-dx*1.35,y1:169-dy*1.35,x2:240+dx*1.35,y2:169+dy*1.35,stroke:"#a48456","stroke-width":1.6,"stroke-dasharray":"5 5"}));
     }
   }
   points.forEach((p,i)=>{
     const group=append(svg,el("g",{}));
     append(group,el("circle",{cx:p.x,cy:p.y,r:23,fill:TILE_COLORS[board[i]-1],stroke:"#516e65","stroke-width":1.8}));
     append(group,el("text",{x:p.x,y:p.y+5,"text-anchor":"middle",fill:"#253c38","font-size":18,"font-weight":800},board[i]));
     const outside=ptOuter(p,240,169,1.27);
     append(group,el("text",{x:outside.x,y:outside.y+5,"text-anchor":"middle",fill:"#768881","font-size":12},"p"+(i+1)));
   });
   svg.setAttribute("aria-label",(text.aria||"Polygon positions: ")+board.join(" ")+", "+fixed.length+"/"+n+" boundary links");
   return {preserved:fixed.length,kind:F.polygonKind(board),links};
 }
 function componentLayout(g,n,k,small=false){
   const out=new Map();
   if(n===3){
     const base=F.home(3),top=[base,F.move(base,"R",k),F.word(base,["R","R"],k)];
     const bottom=top.map(b=>F.move(b,"T",k));
     top.forEach((b,i)=>out.set(b.join(","),{x:95+145*i,y:79}));
     bottom.forEach((b,i)=>out.set(b.join(","),{x:95+145*i,y:213}));
     return {points:out,viewBox:"0 0 480 295",three:true};
   }
   if(n===4&&g.components>1){
     const width=small?420:730,height=small?700:310;
     const cx=i=>small?210:127+238*i,cy=i=>small?120+218*i:157;
     const groups=Array.from({length:g.components},()=>[]);
     g.nodes.forEach(x=>groups[x.component].push(x));
     groups.forEach((group,c)=>{
       group.forEach((node,i)=>{
         const angle=-Math.PI/2+2*Math.PI*i/group.length;
         out.set(node.id,{x:cx(c)+75*Math.cos(angle),y:cy(c)+75*Math.sin(angle)});
       });
     });
     return {points:out,viewBox:"0 0 "+width+" "+height,three:false};
   }
   if(n===4){
     const distances=new Map([[F.home(n).join(","),0]]),q=[F.home(n)];
     for(let p=0;p<q.length;p++)for(const c of ["R","T"]){
       const next=F.move(q[p],c,k),id=next.join(",");
       if(!distances.has(id)){distances.set(id,distances.get(q[p].join(","))+1);q.push(next);}
     }
     const layer=new Map();
     g.nodes.forEach(node=>{
       const d=distances.get(node.id)||0;
       if(!layer.has(d))layer.set(d,[]);
       layer.get(d).push(node);
     });
     layer.forEach((nodes,d)=>{
       nodes.forEach((node,i)=>{
         const a=-Math.PI/2+2*Math.PI*i/nodes.length+0.24*d;
         out.set(node.id,{x:240+(d===0?0:42+30*d)*Math.cos(a),y:160+(d===0?0:22+19*d)*Math.sin(a)});
       });
     });
     return {points:out,viewBox:"0 0 480 320",three:false};
   }
   g.nodes.forEach((node,i)=>{
     const a=-Math.PI/2+2*Math.PI*i/g.nodes.length;
     out.set(node.id,{x:240+125*Math.cos(a),y:155+116*Math.sin(a)});
   });
   return {points:out,viewBox:"0 0 480 320",three:false};
 }
 function drawCayley(svg,n,k,board,language,selected,onSelect,small=false){
   const g=F.smallGraph(n,k);
   if(!g){
     clear(svg,"0 0 480 290");
     append(svg,el("text",{x:240,y:125,"text-anchor":"middle",fill:"#73847c","font-size":19},F.summary(n,k).reachable.toLocaleString()+" / "+F.factorial(n).toLocaleString()));
     append(svg,el("text",{x:240,y:158,"text-anchor":"middle",fill:"#73847c","font-size":14},language==="mn"?"Бүх цэгийг дэлгээгүй":"Complete graph not displayed"));
     return null;
   }
   const layout=componentLayout(g,n,k,small);
   clear(svg,layout.viewBox);marker(svg);
   const positions=layout.points;
   for(const e of g.edges){
     const p=positions.get(e.from),q=positions.get(e.to);
     if(!p||!q)continue;
     let d="M "+p.x+" "+p.y+" L "+q.x+" "+q.y;
     // On the 3:2 graph, wrap the R cycles around the two rows.
     if(layout.three&&e.code==="R"&&Math.abs(p.x-q.x)>200){
       const bend=p.y<140?24:270;
       d="M "+p.x+" "+p.y+" Q "+240+" "+bend+" "+q.x+" "+q.y;
     }
     append(svg,el("path",{d,fill:"none",stroke:e.code==="R"?"#4b9488":"#b68c53",
       "stroke-width":e.code==="R"?2.2:2.1,
       "stroke-opacity":e.code==="R"?.54:.64,
       "stroke-dasharray":e.code==="T"?"5 4":"none",
       "marker-end":e.code==="R"?"url(#family-arrow)":"none"}));
   }
   for(const node of g.nodes){
     const p=positions.get(node.id),active=F.equal(node.board,board),picked=selected===node.id;
     const group=append(svg,el("g",{"class":"graph-node",role:"button",tabindex:0,"data-board":node.id}));
     append(group,el("circle",{cx:p.x,cy:p.y,r:n===3?21:9.2,
       "class":"node-dot",fill:active?"#e8a955":node.component===0?"#d7ede5":"#e4e9e2",
       stroke:picked?"#bd7a32":active?"#9c6b2d":node.component===0?"#47867b":"#96a59b",
       "stroke-width":active||picked?3:1.5}));
     if(n===3){
       append(group,el("text",{x:p.x,y:p.y+4,"text-anchor":"middle",fill:"#28413c","font-size":11,"font-weight":700},node.board.join("")));
     }
     append(group,el("circle",{cx:p.x,cy:p.y,r:n===3?27:17,"class":"touch-target"}));
     append(group,el("title",{},node.board.join(" ")));
     group.addEventListener("click",()=>onSelect(node.board));
     group.addEventListener("keydown",event=>{
       if(event.key==="Enter"||event.key===" "){event.preventDefault();onSelect(node.board);}
     });
   }
   svg.setAttribute("aria-label",g.nodes.length+" states, "+g.components+" components. Current: "+board.join(" "));
   return {nodes:g.nodes.length,components:g.components};
 }
 function drawSwapGraph(svg,n,k,pairs,language){
   clear(svg,"0 0 480 340");
   const points=polygonPositions(n);
   append(svg,el("path",{d:path(points,true),fill:"none",stroke:"#c5d2c8","stroke-width":1.5,"stroke-dasharray":"4 6"}));
   for(const [a,b] of pairs){
     const p=points[a-1],q=points[b-1];
     append(svg,el("line",{x1:p.x,y1:p.y,x2:q.x,y2:q.y,stroke:"#3b8881","stroke-width":2.3,"stroke-opacity":pairs.length>15?.5:.9}));
   }
   points.forEach((p,i)=>{
     append(svg,el("circle",{cx:p.x,cy:p.y,r:21,fill:"#e2eee5",stroke:"#57867c","stroke-width":1.8}));
     append(svg,el("text",{x:p.x,y:p.y+5,"text-anchor":"middle","font-size":16,"font-weight":760,fill:"#214843"},i+1));
   });
   svg.setAttribute("aria-label",pairs.length+" interchangeable position pairs among "+n+" vertices");
 }
 return Object.freeze({trackPositions,polygonPositions,componentLayout,drawTrack,drawPolygon,drawCayley,drawSwapGraph});
});
