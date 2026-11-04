/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
(function (root) {
  'use strict';
  const VERSION = 'P1.0', DEG = Math.PI / 180;
  const G = (typeof module!=='undefined'&&module.exports)?require('./planar3d.js'):root.Sundial3D;
  const defaults = Object.freeze({lat:47.9, shape:'rectangle', width:300, height:200,
    diameter:300, interval:60, numerals:'24', seasons:false, seasonCount:5, length:40, guides:false, color:false, surface:'horizontal', tilt:45, azimuth:180, style:'auto'});
  const events = Object.freeze([
    {id:'june', delta:23.44, label:'VI  +23.44°', color:'#08764d', dash:[]},
    {id:'equinox', delta:0, label:'III / IX  0°', color:'#185da8', dash:[3,1.5]},
    {id:'december', delta:-23.44, label:'XII  -23.44°', color:'#a04a12', dash:[0.8,1.3]}
  ]);
  // A declination scale, not calendar months: a given intermediate declination
  // generally recurs twice per solar year. Keep solstices/equinoxes exact in every preset.
  const seasonDeclinations = Object.freeze({
    3: [23.44, 0, -23.44],
    5: [23.44, 11.72, 0, -11.72, -23.44],
    7: [23.44, 15.6267, 7.8133, 0, -7.8133, -15.6267, -23.44]
  });
  function seasonEvents(count=5) {
    return (seasonDeclinations[count] || seasonDeclinations[5]).map((delta,index) => {
      const special=events.find(e=>e.delta===delta);
      if(special)return special;
      const abs=Math.abs(delta), sign=delta>0?'+':'-';
      return {id:'intermediate-'+index,delta,
        label:sign+abs.toFixed(2)+'°',
        color:delta>0?'#228363':'#a96636',
        dash:abs>12?[4.5,1.4]:[1.2,1.7]};
    });
  }
  const n = x => +x.toFixed(4);
  const roman = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  function validate(input) {
    const p = {...defaults, ...input};
    // URLs from R01.2 used 'circle'; preserve those links with a real semicircle.
    if (p.shape==='circle') p.shape='semicircle';
    if (!['rectangle','semicircle'].includes(p.shape) || !['12','24','roman'].includes(p.numerals) ||
        !['horizontal','vertical','inclined'].includes(p.surface) || !['auto','raised'].includes(p.style)) throw Error('invalid');
    for (const k of ['lat','width','height','diameter','length','interval','tilt','azimuth']) if (!Number.isFinite(p[k])) throw Error('invalid');
    if (Math.abs(p.lat)>89 || ![15,30,60].includes(p.interval) || ![3,5,7].includes(p.seasonCount)) throw Error('invalid');
    if ([p.width,p.height,p.diameter].some(x=>x<80||x>1500) || p.length<1 || p.length>1000 || p.tilt<0 || p.tilt>90 || p.azimuth<0 || p.azimuth>360) throw Error('invalid');
    return p;
  }
  // ENU: east, north, up. Hour angle is positive after apparent solar noon.
  function sunVector(phi, delta, hour) {
    const p=phi*DEG, d=delta*DEG, H=(hour-12)*15*DEG;
    return [-Math.cos(d)*Math.sin(H), Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(H),
      Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(H)];
  }
  function shadow(phi, delta, hour, L) {
    const s=sunVector(phi,delta,hour), sign=Math.sign(phi), p=phi*DEG;
    if (s[2]<=1e-6) return null;
    // At latitude 0 the polar style lies in the plate. Raise the rod/nodus
    // to physical height L; an ordinary triangular polar gnomon collapses.
    const z=phi===0?L:L*Math.abs(Math.sin(p)), north=phi===0?0:sign*L*Math.cos(p);
    return [-z*s[0]/s[2], north-z*s[1]/s[2]];
  }
  // Top of artwork is poleward in BOTH hemispheres. In the south, right is west.
  function direction(phi, hour) {
    if(phi===0)return null; // parallel hour lines: there is no common root
    const H=(hour-12)*15*DEG, x=Math.sign(phi)*Math.abs(Math.sin(phi*DEG))*Math.sin(H), y=-Math.cos(H);
    const r=Math.hypot(x,y); return [x/r,y/r];
  }
  function layout(p) {
    const w=p.shape==='semicircle'?p.diameter:p.width, h=p.shape==='semicircle'?p.diameter/2:p.height;
    // Semicircle is the northern/poleward half: its flat baseline contains O.
    // The equatorial nodus is raised straight above its ground projection;
    // center a rectangular equatorial face to allow both seasonal halves.
    const root=[w/2,p.shape==='semicircle'?h:(p.lat===0?h/2:h-Math.max(12,Math.min(20,h*.1)))];
    return {shape:p.shape,w,h,root};
  }
  function inside(q,b,inset=0) {
    if (b.shape==='semicircle') return q[1]<=b.h-inset+1e-7 &&
      Math.hypot(q[0]-b.w/2,q[1]-b.h)<=b.w/2-inset+1e-7;
    return q[0]>=inset-1e-7 && q[0]<=b.w-inset+1e-7 && q[1]>=inset-1e-7 && q[1]<=b.h-inset+1e-7;
  }
  function rayEnd(b,d,inset=0) {
    const o=b.root;
    if (b.shape==='semicircle') return [o[0]+d[0]*(b.w/2-inset),o[1]+d[1]*(b.w/2-inset)];
    let t=Infinity;
    if (d[0]>1e-12) t=Math.min(t,(b.w-inset-o[0])/d[0]);
    if (d[0]<-1e-12) t=Math.min(t,(inset-o[0])/d[0]);
    if (d[1]>1e-12) t=Math.min(t,(b.h-inset-o[1])/d[1]);
    if (d[1]<-1e-12) t=Math.min(t,(inset-o[1])/d[1]);
    return [o[0]+t*d[0],o[1]+t*d[1]];
  }
  function clipSegment(a,z,b) {
    const dx=z[0]-a[0],dy=z[1]-a[1]; let lo=0,hi=1;
    if (b.shape==='semicircle') {
      const ax=a[0]-b.w/2,ay=a[1]-b.h,A=dx*dx+dy*dy;
      if (A<1e-20) return inside(a,b)?[a,z]:null;
      const B=2*(ax*dx+ay*dy),C=ax*ax+ay*ay-b.w*b.w/4,disc=B*B-4*A*C;
      if (disc<0) return null;
      lo=Math.max(0,(-B-Math.sqrt(disc))/(2*A)); hi=Math.min(1,(-B+Math.sqrt(disc))/(2*A));
      // The flat semicircle diameter clips away the unused lower hemisphere.
      if(Math.abs(dy)<1e-14){if(a[1]>b.h+1e-9)return null;}
      else if(dy>0)hi=Math.min(hi,(b.h-a[1])/dy);
      else lo=Math.max(lo,(b.h-a[1])/dy);
    } else {
      for (const [v,q] of [[-dx,a[0]],[dx,b.w-a[0]],[-dy,a[1]],[dy,b.h-a[1]]]) {
        if (Math.abs(v)<1e-15) {if(q<0)return null;continue;}
        const t=q/v; if(v<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);
      }
    }
    if(lo>hi || hi<0 || lo>1)return null;
    return [[a[0]+lo*dx,a[1]+lo*dy],[a[0]+hi*dx,a[1]+hi*dy]];
  }
  function seasonalPaths(p,b,delta) {
    const paths=[]; let run=null, previous=null;
    const project=h=>{const q=shadow(p.lat,delta,h,p.length),sign=p.lat<0?-1:1;return q?[b.root[0]+sign*q[0],b.root[1]-sign*q[1]]:null;};
    function add(a,z,depth=0) {
      const c=clipSegment(a.q,z.q,b);
      const h=(a.h+z.h)/2,mid=project(h);
      // Refine visible chords until sag is below 0.02 mm; never bridge a horizon.
      if (mid && depth<12 && c && Math.hypot(mid[0]-(a.q[0]+z.q[0])/2,mid[1]-(a.q[1]+z.q[1])/2)>.02) {
        add(a,{h,q:mid},depth+1);add({h,q:mid},z,depth+1);return;
      }
      if(!c){run=null;return;}
      if(!run || Math.hypot(run.at(-1)[0]-c[0][0],run.at(-1)[1]-c[0][1])>1e-5){run=[c[0]];paths.push(run);}
      run.push(c[1]);
    }
    for(let i=0;i<=1440;i++) {
      const h=6+i/120,q=project(h);
      if(q && previous)add(previous,{h,q});else run=null;
      previous=q?{h,q}:null;
    }
    return paths.filter(a=>a.length>1);
  }
  function planeFrame(p) {
    const tilt=p.surface==='horizontal'?0:p.surface==='vertical'?90:p.tilt;
    return G.frame(p.lat,tilt,p.azimuth,p.style);
  }
  function planarLayout(p,frame) {
    const w=p.shape==='semicircle'?p.diameter:p.width;
    const h=p.shape==='semicircle'?p.diameter/2:p.height;
    const root=[w/2,p.shape==='semicircle'?h:
      (frame.raised?h/2:h-Math.max(12,Math.min(20,h*.1)))];
    return {shape:p.shape,w,h,root};
  }
  function planarSeasonalPaths(p,b,frame,delta) {
    const paths=[];let run=null,previous=null;
    const at=hour=>{const q=G.project(frame,p.lat,delta,hour,p.length,b.root);
      return q?[q.x,q.y]:null;};
    function segment(a,z,depth=0){
      const c=clipSegment(a.q,z.q,b);
      const h=(a.h+z.h)/2,m=at(h);
      if(m && c && depth<12 && Math.hypot(m[0]-(a.q[0]+z.q[0])/2,m[1]-(a.q[1]+z.q[1])/2)>.025){
        segment(a,{h,q:m},depth+1);segment({h,q:m},z,depth+1);return;
      }
      if(!c){run=null;return;}
      if(!run||Math.hypot(run.at(-1)[0]-c[0][0],run.at(-1)[1]-c[0][1])>1e-5){run=[c[0]];paths.push(run);}
      run.push(c[1]);
    }
    for(let i=0;i<=1440;i++){
      const hour=6+i/120,q=at(hour);
      if(q&&previous)segment(previous,{h:hour,q});else run=null;
      previous=q?{h:hour,q}:null;
    }
    return paths.filter(path=>path.length>1);
  }
  function build(input) {
    const p=validate(input),frame=planeFrame(p),b=planarLayout(p,frame),margin=8,
      selected=seasonEvents(p.seasonCount),footer=p.seasons?32+10*Math.ceil(selected.length/3):24;
    const scene={w:b.w+2*margin,h:b.h+2*margin+footer,face:b,p,frame,
      items:[],warnings:[],events:[],hours:[],version:VERSION};
    const items=scene.items;
    const line=(pts,width=.3,color='#111111',dash=[],role='guide')=>
      items.push({type:'path',pts:pts.map(q=>[q[0]+margin,q[1]+margin]),width,color,dash,role});
    const text=(x,y,value,size=3.2,role='caption')=>
      items.push({type:'text',x:x+margin,y:y+margin,value,size,role});
    if(b.shape==='semicircle')items.push({type:'semicircle',x:b.w/2+margin,y:b.h+margin,r:b.w/2,width:.35,color:'#111111'});
    else line([[0,0],[b.w,0],[b.w,b.h],[0,b.h],[0,0]],.35);
    const font=Math.max(2.6,Math.min(7,Math.min(b.w,b.h)*.026)),labels=[];
    for(let minute=360;minute<=1080;minute+=p.interval){
      const hour=minute/60,major=minute%60===0;
      const q=G.hourLine(frame,p.lat,hour,p.length,b.root,clipSegment,b);
      if(!q){if(major)scene.warnings.push('unlitHours');continue;}
      scene.hours.push(q);
      line(q.pts,major?.32:.16,'#111111',[],'hour');items.at(-1).hour=hour;
      if(major){
        const value=p.numerals==='roman'?roman[hour%12]:String(p.numerals==='12'?(hour%12||12):hour);
        // Rooted rays end at the physical rim. Raised-rod hour lines are
        // parallel and have labels near the upper edge of their line segment.
        const anchor=frame.raised?q.pts.reduce((a,z)=>a[1]<z[1]?a:z):q.pts.at(-1);
        const pos=frame.raised?[anchor[0],anchor[1]+font*1.6+1]:
          [anchor[0]-q.direction[0]*(font*1.7+1),anchor[1]-q.direction[1]*(font*1.7+1)];
        if(inside(pos,b,Math.max(1,font*.55)))labels.push({pos,value,hour});else scene.warnings.push('crowded');
      }
    }
    if(frame.raised)scene.warnings.push('raisedStyle');
    if(!frame.raised&&Math.abs(frame.pn)<Math.sin(3*DEG))scene.warnings.push('nearParallel');
    if(Math.abs(p.lat)>=85)scene.warnings.push('nearPole');
    if(frame.parallel && b.shape==='semicircle')scene.warnings.push('parallelHalf');
    if(p.seasons)for(const e of selected){
      const paths=planarSeasonalPaths(p,b,frame,e.delta);
      scene.events.push({...e,paths});
      for(const path of paths)line(path,.38,p.color?e.color:'#333333',e.dash,'season');
      if(!paths.length)scene.warnings.push('off:'+e.id);
    }
    const placed=[];
    for(const q of labels.sort((a,z)=>a.hour===12?-1:z.hour===12?1:a.hour-z.hour)){
      const width=q.value.length*font*.65+1.4,height=font*1.2,x=q.pos[0],y=q.pos[1];
      if(placed.some(t=>Math.abs(t.x-x)<(t.width+width)/2&&Math.abs(t.y-y)<height)){scene.warnings.push('crowded');continue;}
      placed.push({x,y,width});
      items.push({type:'rect',x:x-width/2+margin,y:y-height/2+margin,w:width,h:height,fill:'#ffffff'});
      text(x,y+font*.34,q.value,font,'hour-label');
    }
    const [ox,oy]=b.root;
    line([[ox-1,oy],[ox+1,oy]],.25);line([[ox,oy-1],[ox,oy+(b.shape==='semicircle'?0:1)]],.25);
    // The top arrow is the projection of the outward polar edge when it
    // exists. For tilted plates it may point physically DOWN on a wall.
    line([[b.w/2,-1],[b.w/2,-5]],.25);line([[b.w/2-1,-3.5],[b.w/2,-5],[b.w/2+1,-3.5]],.25);
    text(b.w/2+8,-2,p.surface==='horizontal'?(p.lat>=0?'N':'S'):'AXIS',3);
    const scale=b.w>=160?100:20,sy=b.h+8;
    line([[1,sy],[1+scale,sy]],.25);line([[1,sy-1],[1,sy+1]],.25);line([[1+scale,sy-1],[1+scale,sy+1]],.25);
    text(1+scale/2,sy-1.8,scale+' mm',3);
    text(b.w*.79,sy+.5,b.shape==='semicircle'?'D = '+n(b.w)+' mm':n(b.w)+' x '+n(b.h)+' mm',3);
    if(p.surface!=='horizontal'){
      const orient=frame.upAngle===null?'UP REF N/A':'UP '+n(frame.upAngle)+' deg FROM AXIS';
      text(b.w*.50,b.h+14,orient,3,'orientation');
      text(b.w*.5,b.h+19,'TILT '+n(frame.tilt)+' deg / FACE '+n(frame.azimuth)+' deg',3,'orientation');
    }
    if(p.guides){
      text(ox-4,oy+4,'O',3);
      const N=G.nodus(frame,p.length),P=[ox+G.dot(N,frame.u),oy-G.dot(N,frame.v)];
      if(!frame.raised){const clipped=clipSegment(b.root,P,b);if(clipped)line(clipped,.25,'#777777',[2,1]);}
      if(frame.raised)text(P[0]+5,P[1]-2,'O=P',3);
      else if(inside(P,b,4)){
        items.push({type:'circle',x:P[0]+margin,y:P[1]+margin,r:.9,width:.25,color:'#555555'});
        text(P[0]+4,P[1]+1,'P',3);
      }else scene.warnings.push('nodusOutside');
    }
    if(p.seasons)selected.forEach((e,i)=>{
      const row=Math.floor(i/3),first=3*row,count=Math.min(3,selected.length-first),x=b.w*(i-first+.5)/count,y=b.h+27+row*10;
      line([[x-6,y-3],[x+6,y-3]],.38,p.color?e.color:'#333333',e.dash);
      text(x,y+1,e.label,Math.min(3.2,Math.max(2.3,b.w/80)));
    });
    scene.warnings=[...new Set(scene.warnings)];return scene;
  }
  function profile(input) {
    const p=validate(input),f=planeFrame(p),H=p.length;
    if(f.raised){
      // A supported rod lies parallel to the receiving surface; its nodus
      // is at normal distance h above the reference point O.
      const w=150,h=Math.max(H+30,65),y=14,x=18,items=[];
      items.push({type:'path',pts:[[10,y+H],[w-10,y+H]],width:.35,color:'#111111',dash:[]});
      items.push({type:'path',pts:[[x,y],[w-20,y]],width:1,color:'#111111',dash:[]});
      items.push({type:'path',pts:[[x,y],[x,y+H]],width:.25,color:'#777777',dash:[2,1]});
      items.push({type:'circle',x:w/2,y,r:1,width:.3,color:'#111111'});
      items.push({type:'text',x:w/2,y:7,value:'POLAR ROD / POINT G',size:3.2});
      items.push({type:'text',x:w/2,y:y+H/2,value:'h = '+n(H)+' mm',size:3.2});
      return {w,h,items,p,version:VERSION};
    }
    const alpha=f.polarAngle*DEG,B=H*Math.cos(alpha),z=H*Math.sin(alpha),
      w=Math.max(B+32,100),h=Math.max(z+30,65),x=16,y=h-14,items=[];
    items.push({type:'path',pts:[[x,y],[x+B,y],[x+B,y-z],[x,y]],width:.35,color:'#111111',dash:[]});
    const add=(xx,yy,value)=>items.push({type:'text',x:xx,y:yy,value,size:3.2});
    add(x-3,y+5,'O');add(x+B+4,y-z,'G');add(x+B/2,y+6,'b = '+n(B)+' mm');
    add(w/2,7,'L = '+H+' mm; h = '+n(z)+' mm');add(w/2,12,'alpha = '+n(f.polarAngle)+' deg');
    return {w,h,items,p,version:VERSION};
  }
  const xml=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function svg(scene) {
    let body='<rect width="100%" height="100%" fill="#ffffff"/>';
    for(const q of scene.items) {
      if(q.type==='path')body+='<path d="'+q.pts.map((p,i)=>(i?'L':'M')+n(p[0])+' '+n(p[1])).join(' ')+'" fill="none" stroke="'+q.color+'" stroke-width="'+q.width+'" stroke-dasharray="'+q.dash.join(' ')+'"/>';
      if(q.type==='circle')body+='<circle cx="'+n(q.x)+'" cy="'+n(q.y)+'" r="'+n(q.r)+'" fill="none" stroke="'+q.color+'" stroke-width="'+q.width+'"/>';
      if(q.type==='semicircle')body+='<path d="M '+n(q.x-q.r)+' '+n(q.y)+' A '+n(q.r)+' '+n(q.r)+' 0 0 1 '+n(q.x+q.r)+' '+n(q.y)+' L '+n(q.x-q.r)+' '+n(q.y)+'" fill="none" stroke="'+q.color+'" stroke-width="'+q.width+'"/>';
      if(q.type==='rect')body+='<rect x="'+n(q.x)+'" y="'+n(q.y)+'" width="'+n(q.w)+'" height="'+n(q.h)+'" fill="'+q.fill+'"/>';
      if(q.type==='text')body+='<text x="'+n(q.x)+'" y="'+n(q.y)+'" text-anchor="middle" font-size="'+q.size+'" font-family="Helvetica,Arial,sans-serif" fill="#111111">'+xml(q.value)+'</text>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+n(scene.w)+'mm" height="'+n(scene.h)+'mm" viewBox="0 0 '+n(scene.w)+' '+n(scene.h)+'" style="background:#fff;color-scheme:only light"><title>Sundial '+VERSION+'</title>'+body+'</svg>';
  }
  // Small vector-only PDF writer. Artwork captions use numeric/SI/compass symbols;
  // bilingual explanations stay in the interface. No fonts or dependencies shipped.
  function pdf(scene) {
    const k=72/25.4,h=scene.h*k,w=scene.w*k,f=n;
    const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255).map(f).join(' ');
    const xy=p=>f(p[0]*k)+' '+f(h-p[1]*k);
    let stream='1 1 1 rg 0 0 '+f(w)+' '+f(h)+' re f\n';
    for(const q of scene.items) {
      if(q.type==='path'||q.type==='circle'||q.type==='semicircle')stream+=rgb(q.color)+' RG '+f(q.width*k)+' w ['+(q.dash||[]).map(x=>f(x*k)).join(' ')+'] 0 d\n';
      if(q.type==='path')stream+=q.pts.map((p,i)=>xy(p)+(i?' l':' m')).join(' ')+' S\n';
      if(q.type==='circle') {
        const {x,y,r}=q,t=r*.5522847498307936;
        stream+=xy([x+r,y])+' m '+[[x+r,y+t,x+t,y+r,x,y+r],[x-t,y+r,x-r,y+t,x-r,y],[x-r,y-t,x-t,y-r,x,y-r],[x+t,y-r,x+r,y-t,x+r,y]].map(a=>xy(a.slice(0,2))+' '+xy(a.slice(2,4))+' '+xy(a.slice(4,6))+' c').join(' ')+' S\n';
      }
      if(q.type==='semicircle') {
        const {x,y,r}=q,t=r*.5522847498307936;
        stream+=xy([x-r,y])+' m '+xy([x-r,y-t])+' '+xy([x-t,y-r])+' '+xy([x,y-r])+' c '+
          xy([x+t,y-r])+' '+xy([x+r,y-t])+' '+xy([x+r,y])+' c '+xy([x-r,y])+' l S\n';
      }
      if(q.type==='rect')stream+=rgb(q.fill)+' rg '+f(q.x*k)+' '+f(h-(q.y+q.h)*k)+' '+f(q.w*k)+' '+f(q.h*k)+' re f\n';
      if(q.type==='text') {
        const widths={' ':278,'.':278,':':278,';':278,'/':278,'-':333,'+':584,'=':584,'°':400,'I':278,'V':667,'X':667,'L':556,'N':722,'S':667,'O':778,'G':778,'P':667,'b':556,'h':556,'m':833,'x':500,'|':260,'p':556,'i':222};
        const tw=[...q.value].reduce((a,c)=>a+(widths[c]||556),0)*q.size/1000;
        const literal=q.value.replace(/([\\()])/g,'\\$1');
        stream+='0.067 0.067 0.067 rg BT /F1 '+f(q.size*k)+' Tf '+xy([q.x-tw/2,q.y])+' Td ('+literal+') Tj ET\n';
      }
    }
    const objects=['','<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+f(w)+' '+f(h)+'] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      '<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];
    let out='%PDF-1.4\n',offset=[0];
    for(let i=1;i<objects.length;i++){offset[i]=out.length;out+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}
    const start=out.length;out+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';
    for(let i=1;i<objects.length;i++)out+=String(offset[i]).padStart(10,'0')+' 00000 n \n';
    out+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF';
    return Uint8Array.from(out,c=>c.charCodeAt(0));
  }
  function crc32(bytes) {let c=0xffffffff;for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
  function pngDensity(bytes,dpi=300) {
    const data=Uint8Array.from(bytes),dv=new DataView(data.buffer),parts=[data.slice(0,8)];
    const chunk=new Uint8Array(21),v=new DataView(chunk.buffer);v.setUint32(0,9);chunk.set([112,72,89,115],4);
    v.setUint32(8,Math.round(dpi/0.0254));v.setUint32(12,Math.round(dpi/0.0254));chunk[16]=1;v.setUint32(17,crc32(chunk.slice(4,17)));
    for(let pos=8;pos<data.length;){const len=dv.getUint32(pos),end=pos+len+12,type=String.fromCharCode(...data.slice(pos+4,pos+8));
      if(type!=='pHYs')parts.push(data.slice(pos,end));if(type==='IHDR')parts.push(chunk);pos=end;}
    const out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;
  }
  const api={VERSION,defaults,events,seasonEvents,validate,sunVector,shadow,direction,layout,inside,rayEnd,clipSegment,seasonalPaths,planeFrame,planarLayout,planarSeasonalPaths,build,profile,svg,pdf,pngDensity,geom:G};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Sundial=api;
})(typeof globalThis!=='undefined'?globalThis:this);
