/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur; SPDX-License-Identifier: MIT */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),S=require('./sundial.js');
let count=0;
const close=(a,b,tol=1e-7)=>{count++;assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);};
for(const [k,expected] of [[3,[23.44,0,-23.44]],[5,[23.44,11.72,0,-11.72,-23.44]],[7,[23.44,15.6267,7.8133,0,-7.8133,-15.6267,-23.44]]]){
  const selected=S.seasonEvents(k);assert.equal(selected.length,k);count++;
  selected.forEach((e,i)=>close(e.delta,expected[i],1e-8));
  assert.ok(selected.every((e,i)=>i===0||e.delta<selected[i-1].delta));count++;
  for(const shape of ['rectangle','circle']){
    const p={...S.defaults,shape,seasons:true,seasonCount:k},s=S.build(p);
    assert.equal(s.events.length,k);count++;
    assert.ok(s.items.filter(q=>q.role==='season').length>=k-1);count++;
    assert.deepEqual(S.build({...p,seasons:false}).items.filter(q=>q.role==='hour'),s.items.filter(q=>q.role==='hour'));count++;
    const descriptions=s.items.filter(q=>q.type==='text').map(q=>q.value);
    for(const e of selected){assert.ok(descriptions.includes(e.label));assert.ok([...e.label].every(ch=>ch.charCodeAt(0)<=255));count+=2;}
  }
}
assert.throws(()=>S.build({seasonCount:4}));
for(const phi of [-89,-80,-47.9,-23,-10,-1,1,10,23,47.9,80,89]) {
  for(const d of [-23.44,0,23.44])for(let h=6;h<=18;h+=.5) {
    const v=S.sunVector(phi,d,h);close(Math.hypot(...v),1);
    const q=S.shadow(phi,d,h,40);if(!q)continue;
    const u=S.direction(phi,h),sx=Math.sign(phi)*q[0],sy=-Math.sign(phi)*q[1];
    close((sx*u[1]-sy*u[0])/Math.max(1,Math.hypot(sx,sy)),0);
    if(d===0)close(Math.sign(phi)*q[1],40/Math.cos(phi*Math.PI/180),1e-6);
  }
  for(const shape of ['rectangle','circle'])for(const interval of [15,30,60]) {
    const p={...S.defaults,lat:phi,shape,interval,seasons:true},a=S.build(p),lines=a.items.filter(q=>q.role==='hour');
    assert.equal(lines.length,720/interval+1);count++;
    assert.equal(lines[0].hour,6);assert.equal(lines.at(-1).hour,18);
    for(const item of lines)for(const v of item.pts)assert.ok(S.inside([v[0]-8,v[1]-8],a.face));
    for(const event of a.events)for(const path of event.paths)for(const v of path){assert.ok(v.every(Number.isFinite));assert.ok(S.inside(v,a.face));count++;}
    const b=S.build({...p,length:73});assert.deepEqual(lines,b.items.filter(q=>q.role==='hour'));count++;
  }
}
for(const [delta,expect] of [[23.44,40.31756447043766],[0,59.66350211768394],[-23.44,114.70197869922612]]) {
  const q=S.shadow(47.9,delta,12,40);close(q[0],0);close(q[1],expect);
  const south=S.shadow(-47.9,-delta,12,40);close(south[0],0);close(south[1],-expect);
}
close(S.direction(47.9,6)[0],-1);close(S.direction(47.9,18)[0],1);
close(S.direction(-47.9,6)[0],1);close(S.direction(-47.9,18)[0],-1);
close(Math.atan2(S.direction(45,15)[0],-S.direction(45,15)[1]),Math.atan(Math.sin(Math.PI/4)));
for(const phi of [0,NaN,90,-90,Infinity])assert.throws(()=>S.build({lat:phi}));
for(const length of [NaN,0,1001])assert.throws(()=>S.build({length}));
assert.equal(S.shadow(80,-23.44,12,40),null);
for(const shape of ['rectangle','circle']) {
  const b=S.layout({...S.defaults,shape});const c=S.clipSegment([-10,b.h/2],[b.w+10,b.h/2],b);
  close(c[0][0],0);close(c[1][0],b.w);assert.equal(S.clipSegment([-10,-10],[-5,-5],b),null);
}
const s=S.build({...S.defaults,seasons:true,guides:true});
assert.ok(S.svg(s).includes('fill="#ffffff"'));assert.ok(S.svg(s).includes('viewBox="0 0 316 261"'));
assert.ok(Buffer.from(S.pdf(s)).toString('latin1').startsWith('%PDF-1.4'));
if(process.env.SUNDIAL_TEST_OUTPUT){fs.mkdirSync(process.env.SUNDIAL_TEST_OUTPUT,{recursive:true});for(const shape of ['rectangle','circle']){const a=S.build({...S.defaults,shape,seasons:true,guides:true,color:true});fs.writeFileSync(`${process.env.SUNDIAL_TEST_OUTPUT}/${shape}.svg`,S.svg(a));fs.writeFileSync(`${process.env.SUNDIAL_TEST_OUTPUT}/${shape}.pdf`,S.pdf(a));}}
console.log(`PASS: ${count} numerical/geometry assertions, 3/5/7 seasonal presets, both hemispheres, all intervals, shape clipping and shared exports.`);
