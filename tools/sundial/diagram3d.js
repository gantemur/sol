/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
(function(root){
  'use strict';
  const G=(typeof module!=='undefined'&&module.exports)?require('./planar3d.js'):root.Sundial3D;
  const f=n=>Number(n.toFixed(1));
  function draw(scene,hour=12,delta=0,yaw=40,lang='mn'){
    if(!scene||!scene.frame)return '';
    const {frame:F,p,face:b}=scene, O=[0,0,0],N=G.nodus(F,p.length),scale=Math.max(b.w,b.h),s=G.sun(p.lat,delta,hour);
    const a=yaw*Math.PI/180,z=28*Math.PI/180;
    const camera=[Math.cos(a)*Math.cos(z),Math.sin(a)*Math.cos(z),Math.sin(z)];
    let right=G.cross([0,0,1],camera);right=G.unit(right);
    const up=G.unit(G.cross(camera,right));
    const mid=G.mul(N,.35),mag=320/(scale*1.5+p.length),cx=300,cy=186;
    const pt=q=>[f(cx+G.dot(G.sub(q,mid),right)*mag),f(cy-G.dot(G.sub(q,mid),up)*mag)];
    const world=(x,y)=>G.add(G.mul(F.u,x-b.root[0]),G.mul(F.v,b.root[1]-y));
    const polygon=Q=>'<polygon points="'+Q.map(q=>pt(q).join(',')).join(' ')+'"/>';
    const line=(A,B,stroke,width=2,dash='')=>'<path d="M'+pt(A).join(' ')+'L'+pt(B).join(' ')+'" stroke="'+stroke+'" stroke-width="'+width+'" fill="none"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
    const text=(q,v,shift=[6,-4])=>{const v2=pt(q);return '<text x="'+f(v2[0]+shift[0])+'" y="'+f(v2[1]+shift[1])+'" fill="#243e4a" font-size="12">'+v+'</text>';};
    let edge=[];
    if(b.shape==='semicircle'){
      for(let i=0;i<=36;i++){const t=i*Math.PI/36;edge.push(world(b.w/2+b.w/2*Math.cos(t),b.h-b.w/2*Math.sin(t)));}
    }else edge=[[0,0],[b.w,0],[b.w,b.h],[0,b.h]].map(q=>world(...q));
    let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" role="img" aria-label="3D sundial geometry" style="width:100%;height:auto;background:#ffffff">';
    svg+='<rect x=".5" y=".5" width="599" height="349" fill="#fff" stroke="#d8e5e9" rx="8"/>';
    // The mathematical hour plane is spanned by the polar axis and the
    // equatorial projection of the Sun: its position does not depend on δ.
    const e=G.sun(p.lat,0,hour),L=scale*.48;
    const plane=[G.add(N,G.add(G.mul(F.p,L),G.mul(e,L))),G.add(N,G.add(G.mul(F.p,L),G.mul(e,-L))),
      G.add(N,G.add(G.mul(F.p,-L),G.mul(e,-L))),G.add(N,G.add(G.mul(F.p,-L),G.mul(e,L)))];
    svg+='<g fill="#bfdef2" fill-opacity=".44" stroke="#4894bd" stroke-opacity=".5" stroke-width="1">'+polygon(plane)+'</g>';
    svg+='<g fill="#f1f6f8" fill-opacity=".88" stroke="#566f7b" stroke-width="1.8">'+polygon(edge)+'</g>';
    const axisStart=F.raised?G.add(N,G.mul(F.p,-scale*.55)):O;
    const axisEnd=F.raised?G.add(N,G.mul(F.p,scale*.55)):G.add(N,G.mul(F.k,scale*.35));
    svg+=line(axisStart,axisEnd,'#b04428',3);
    // The cone contains the shadow rays from the nodus for constant δ.
    const q=[],tip=G.mul(s,scale*.55);
    for(let i=0;i<=48;i++){const h=24*i/48;q.push(G.sub(N,G.mul(G.sun(p.lat,delta,h),scale*.75)));}
    svg+='<polyline points="'+q.map(t=>pt(t).join(',')).join(' ')+'" fill="none" stroke="#c17e24" stroke-width="2" opacity=".85"/>';
    for(let i=0;i<48;i+=8)svg+=line(N,q[i],'#d9a14b',.9,'3 3');
    svg+=line(N,G.add(N,tip),'#db8a22',2);
    const projection=G.project(F,p.lat,delta,hour,p.length,[0,0]);
    if(projection){svg+=line(N,projection.world,'#167b60',2.8);svg+='<circle cx="'+pt(projection.world)[0]+'" cy="'+pt(projection.world)[1]+'" r="3.6" fill="#137d60"/>';}
    svg+='<circle cx="'+pt(N)[0]+'" cy="'+pt(N)[1]+'" r="4.2" fill="#b53929"/>';
    const mn=lang==='mn';
    svg+=text(N,mn?'G · үзүүр':'G · nodus')+text(O,mn?'O · хавтан':'O · face');
    svg+='<g fill="#3d5664" font-size="12"><text x="15" y="23">'+(mn?'Цагийн хавтгай (цэнхэр)':'Hour plane (blue)')+'</text><text x="15" y="42">'+(mn?'Улирлын конус (шар)':'Declination cone (ochre)')+'</text><text x="15" y="61">'+(mn?'Сүүдрийн цацраг (ногоон)':'Shadow ray (green)')+'</text></g>';
    svg+='<text x="15" y="330" font-size="11" fill="#697e8a">'+(mn?'3D бүдүүвч: хэвлэх хэмжээст загвар биш':'Schematic perspective, not a fabrication drawing')+'</text></svg>';
    return svg;
  }
  const api={draw};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SundialDiagram=api;
})(typeof globalThis!=='undefined'?globalThis:this);
