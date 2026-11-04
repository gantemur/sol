/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
(function (root) {
  'use strict';
  const VERSION = 'R01.1', DEG = Math.PI / 180;
  const defaults = Object.freeze({lat:47.9, shape:'rectangle', width:300, height:200,
    diameter:300, interval:60, numerals:'24', seasons:false, length:40, guides:false, color:false});
  const events = Object.freeze([
    {id:'june', delta:23.44, label:'VI  +23.44°', color:'#08764d', dash:[]},
    {id:'equinox', delta:0, label:'III / IX  0°', color:'#185da8', dash:[3,1.5]},
    {id:'december', delta:-23.44, label:'XII  -23.44°', color:'#a04a12', dash:[0.8,1.3]}
  ]);
  const n = x => +x.toFixed(4);
  const roman = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  function validate(input) {
    const p = {...defaults, ...input};
    if (!['rectangle','circle'].includes(p.shape) || !['12','24','roman'].includes(p.numerals)) throw Error('invalid');
    for (const k of ['lat','width','height','diameter','length','interval']) if (!Number.isFinite(p[k])) throw Error('invalid');
    if (Math.abs(p.lat)<0.1 || Math.abs(p.lat)>89 || ![15,30,60].includes(p.interval)) throw Error('invalid');
    if ([p.width,p.height,p.diameter].some(x=>x<80||x>1500) || p.length<1 || p.length>1000) throw Error('invalid');
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
    const z=L*Math.abs(Math.sin(p)), north=sign*L*Math.cos(p);
    return [-z*s[0]/s[2], north-z*s[1]/s[2]];
  }
  // Top of artwork is poleward in BOTH hemispheres. In the south, right is west.
  function direction(phi, hour) {
    const H=(hour-12)*15*DEG, x=Math.sign(phi)*Math.abs(Math.sin(phi*DEG))*Math.sin(H), y=-Math.cos(H);
    const r=Math.hypot(x,y); return [x/r,y/r];
  }
  function layout(p) {
    const w=p.shape==='circle'?p.diameter:p.width, h=p.shape==='circle'?p.diameter:p.height;
    return {shape:p.shape,w,h,root:[w/2,p.shape==='circle'?h/2:h-Math.max(12,Math.min(20,h*.1))]};
  }
  function inside(q,b,inset=0) {
    if (b.shape==='circle') return Math.hypot(q[0]-b.w/2,q[1]-b.h/2)<=b.w/2-inset+1e-7;
    return q[0]>=inset-1e-7 && q[0]<=b.w-inset+1e-7 && q[1]>=inset-1e-7 && q[1]<=b.h-inset+1e-7;
  }
  function rayEnd(b,d,inset=0) {
    const o=b.root;
    if (b.shape==='circle') return [o[0]+d[0]*(b.w/2-inset),o[1]+d[1]*(b.w/2-inset)];
    let t=Infinity;
    if (d[0]>1e-12) t=Math.min(t,(b.w-inset-o[0])/d[0]);
    if (d[0]<-1e-12) t=Math.min(t,(inset-o[0])/d[0]);
    if (d[1]>1e-12) t=Math.min(t,(b.h-inset-o[1])/d[1]);
    if (d[1]<-1e-12) t=Math.min(t,(inset-o[1])/d[1]);
    return [o[0]+t*d[0],o[1]+t*d[1]];
  }
  function clipSegment(a,z,b) {
    const dx=z[0]-a[0],dy=z[1]-a[1]; let lo=0,hi=1;
    if (b.shape==='circle') {
      const ax=a[0]-b.w/2,ay=a[1]-b.h/2,A=dx*dx+dy*dy;
      if (A<1e-20) return inside(a,b)?[a,z]:null;
      const B=2*(ax*dx+ay*dy),C=ax*ax+ay*ay-b.w*b.w/4,disc=B*B-4*A*C;
      if (disc<0) return null;
      lo=Math.max(0,(-B-Math.sqrt(disc))/(2*A)); hi=Math.min(1,(-B+Math.sqrt(disc))/(2*A));
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
    const project=h=>{const q=shadow(p.lat,delta,h,p.length);return q?[b.root[0]+Math.sign(p.lat)*q[0],b.root[1]-Math.sign(p.lat)*q[1]]:null;};
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
  function build(input) {
    const p=validate(input),b=layout(p),margin=8,footer=p.seasons?30:15;
    const s={w:b.w+2*margin,h:b.h+2*margin+footer,face:b,p,items:[],warnings:[],events:[],version:VERSION};
    const items=s.items;
    const line=(pts,width=.3,color='#111111',dash=[],role='guide')=>items.push({type:'path',pts:pts.map(q=>[q[0]+margin,q[1]+margin]),width,color,dash,role});
    const text=(x,y,value,size=3.2,role='caption')=>items.push({type:'text',x:x+margin,y:y+margin,value,size,role});
    if(b.shape==='circle')items.push({type:'circle',x:b.w/2+margin,y:b.h/2+margin,r:b.w/2,width:.35,color:'#111111'});
    else line([[0,0],[b.w,0],[b.w,b.h],[0,b.h],[0,0]],.35);
    const labels=[],font=Math.max(2.6,Math.min(7,Math.min(b.w,b.h)*.026));
    for(let m=360;m<=1080;m+=p.interval) {
      const hour=m/60,d=direction(p.lat,hour),end=rayEnd(b,d,.6),major=m%60===0;
      line([b.root,end],major?.32:.16,'#111111',[],'hour');items.at(-1).hour=hour;
      if(major){const pos=rayEnd(b,d,font*1.6+1),value=p.numerals==='roman'?roman[hour%12]:String(p.numerals==='12'?(hour%12||12):hour);
        labels.push({pos,value,hour});}
    }
    if(p.seasons)for(const e of events) {
      const paths=seasonalPaths(p,b,e.delta);s.events.push({id:e.id,paths});
      for(const path of paths)line(path,.38,p.color?e.color:'#333333',e.dash,'season');
      if(!paths.length)s.warnings.push('off:'+e.id);
    }
    // Labels have white knockouts shared by ALL renderers, not screen-only styling.
    const placed=[];
    for(const l of labels.sort((a,z)=>(a.hour===12?-1:z.hour===12?1:a.hour-z.hour))) {
      const width=l.value.length*font*.65+1.4,height=font*1.2;
      const x=l.pos[0],y=l.pos[1];
      if(placed.some(q=>Math.abs(q.x-x)<(q.w+width)/2 && Math.abs(q.y-y)<height)){s.warnings.push('crowded');continue;}
      placed.push({x,y,w:width});
      items.push({type:'rect',x:x-width/2+margin,y:y-height/2+margin,w:width,h:height,fill:'#ffffff'});
      text(x,y+font*.34,l.value,font,'hour-label');
    }
    const [ox,oy]=b.root;
    line([[ox-1,oy],[ox+1,oy]],.25);line([[ox,oy-1],[ox,oy+1]],.25);
    // A small poleward arrow is outside the fabrication boundary.
    line([[b.w/2,-1],[b.w/2,-5]],.25);line([[b.w/2-1,-3.5],[b.w/2,-5],[b.w/2+1,-3.5]],.25);
    text(b.w/2+5,-2, p.lat>0?'N':'S',3);
    const scale=b.w>=160?100:20, sy=b.h+8;
    line([[1,sy],[1+scale,sy]],.25);line([[1,sy-1],[1,sy+1]],.25);line([[1+scale,sy-1],[1+scale,sy+1]],.25);
    text(1+scale/2,sy-1.8,scale+' mm',3);
    text(b.w*.76,sy+.5,n(b.w)+' x '+n(b.h)+' mm',3);
    if(p.guides) {
      text(ox-4,oy+4,'O',3);
      const offset=p.length*Math.cos(p.lat*DEG),P=[ox,oy-offset];
      const clipped=clipSegment(b.root,P,b);if(clipped)line(clipped,.25,'#777777',[2,1]);
      if(inside(P,b,4)) {items.push({type:'circle',x:P[0]+margin,y:P[1]+margin,r:.9,width:.25,color:'#555555'});text(P[0]+4,P[1]+1,'P',3);}
      else s.warnings.push('nodusOutside');
    }
    if(p.seasons)events.forEach((e,i)=>{
      const x=b.w*(i+.5)/3,y=b.h+20;
      line([[x-6,y-3],[x+6,y-3]],.38,p.color?e.color:'#333333',e.dash);
      text(x,y+1,e.label,Math.min(3.2,b.w/80));
    });
    s.warnings=[...new Set(s.warnings)];return s;
  }
  function profile(input) {
    const p=validate(input),a=Math.abs(p.lat)*DEG,L=p.length,B=L*Math.cos(a),H=L*Math.sin(a);
    const w=Math.max(B+32,100),h=Math.max(H+30,65),x=16,y=h-14,items=[];
    items.push({type:'path',pts:[[x,y],[x+B,y],[x+B,y-H],[x,y]],width:.35,color:'#111111',dash:[]});
    const add=(xx,yy,value)=>items.push({type:'text',x:xx,y:yy,value,size:3.2});
    add(x-3,y+5,'O');add(x+B+4,y-H,'G');add(x+B/2,y+6,'b = '+n(B)+' mm');
    add(w/2,7,'L = '+L+' mm; h = '+n(H)+' mm');add(w/2,12,'|phi| = '+Math.abs(p.lat)+'°');
    return {w,h,items,p,version:VERSION};
  }
  const xml=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function svg(scene) {
    let body='<rect width="100%" height="100%" fill="#ffffff"/>';
    for(const q of scene.items) {
      if(q.type==='path')body+='<path d="'+q.pts.map((p,i)=>(i?'L':'M')+n(p[0])+' '+n(p[1])).join(' ')+'" fill="none" stroke="'+q.color+'" stroke-width="'+q.width+'" stroke-dasharray="'+q.dash.join(' ')+'"/>';
      if(q.type==='circle')body+='<circle cx="'+n(q.x)+'" cy="'+n(q.y)+'" r="'+n(q.r)+'" fill="none" stroke="'+q.color+'" stroke-width="'+q.width+'"/>';
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
      if(q.type==='path'||q.type==='circle')stream+=rgb(q.color)+' RG '+f(q.width*k)+' w ['+(q.dash||[]).map(x=>f(x*k)).join(' ')+'] 0 d\n';
      if(q.type==='path')stream+=q.pts.map((p,i)=>xy(p)+(i?' l':' m')).join(' ')+' S\n';
      if(q.type==='circle') {
        const {x,y,r}=q,t=r*.5522847498307936;
        stream+=xy([x+r,y])+' m '+[[x+r,y+t,x+t,y+r,x,y+r],[x-t,y+r,x-r,y+t,x-r,y],[x-r,y-t,x-t,y-r,x,y-r],[x+t,y-r,x+r,y-t,x+r,y]].map(a=>xy(a.slice(0,2))+' '+xy(a.slice(2,4))+' '+xy(a.slice(4,6))+' c').join(' ')+' S\n';
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
  const api={VERSION,defaults,events,validate,sunVector,shadow,direction,layout,inside,rayEnd,clipSegment,seasonalPaths,build,profile,svg,pdf,pngDensity};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Sundial=api;
})(typeof globalThis!=='undefined'?globalThis:this);
