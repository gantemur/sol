/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur; SPDX-License-Identifier: MIT */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),S=require('./sundial.js');
let count=0;
const close=(a,b,tol=1e-7)=>{count++;assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);};
for(const [k,expected] of [[3,[23.44,0,-23.44]],[5,[23.44,11.72,0,-11.72,-23.44]],[7,[23.44,15.6267,7.8133,0,-7.8133,-15.6267,-23.44]]]){
  const selected=S.seasonEvents(k);assert.equal(selected.length,k);count++;
  selected.forEach((e,i)=>close(e.delta,expected[i],1e-8));
  assert.ok(selected.every((e,i)=>i===0||e.delta<selected[i-1].delta));count++;
  for(const shape of ['rectangle','semicircle']){
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
  for(const shape of ['rectangle','semicircle'])for(const interval of [15,30,60]) {
    const p={...S.defaults,lat:phi,shape,interval,seasons:true},a=S.build(p),lines=a.items.filter(q=>q.role==='hour');
    assert.equal(lines.length,720/interval+1);count++;
    assert.equal(lines[0].hour,6);assert.equal(lines.at(-1).hour,18);
    for(const item of lines)for(const v of item.pts)assert.ok(S.inside([v[0]-8,v[1]-8],a.face));
    for(const event of a.events)for(const path of event.paths)for(const v of path){assert.ok(v.every(Number.isFinite));assert.ok(S.inside(v,a.face));count++;}
    const b=S.build({...p,length:73});assert.deepEqual(lines,b.items.filter(q=>q.role==='hour'));count++;
  }
}
// The semicircle's flat diameter is a real fabrication edge, not a full disk.
const semi=S.layout({...S.defaults,shape:'semicircle'});
assert.equal(semi.w,300);assert.equal(semi.h,150);count+=2;
close(semi.root[0],150);close(semi.root[1],150);
assert.ok(S.inside([150,0],semi));count++;
assert.ok(S.inside([50,140],semi));count++;
assert.ok(!S.inside([150,151],semi));count++;
assert.ok(!S.inside([0,-10],semi));count++;
const base=S.clipSegment([-100,semi.h],[semi.w+100,semi.h],semi);
close(base[0][0],0);close(base[1][0],300);
assert.equal(S.clipSegment([100,semi.h+1],[200,semi.h+1],semi),null);count++;
const clipped=S.clipSegment([150,-100],[150,300],semi);
close(clipped[0][1],0);close(clipped[1][1],150);
const outline=S.build({...S.defaults,shape:'semicircle',seasons:true,guides:true});
assert.equal(outline.items.filter(q=>q.type==='semicircle').length,1);count++;
assert.equal(outline.items.filter(q=>q.type==='circle').length<=1,true);count++;
assert.ok(S.svg(outline).includes(' A 150 150 0 0 1 '));count++;
assert.ok(Buffer.from(S.pdf(outline)).toString('latin1').includes(' c '));count++;
const alias=S.build({...S.defaults,shape:'circle'});
assert.equal(alias.face.shape,'semicircle');count++;

// At the equator use an elevated horizontal polar rod or an elevated point nodus.
// Its hour lines are parallel N-S lines x = h tan(H), not a collapsed fan.
for(const shape of ['rectangle','semicircle'])for(const step of [15,30,60]){
  const p={...S.defaults,lat:0,shape,interval:step,length:40,seasons:true};
  const out=S.build(p),hour=out.items.filter(q=>q.role==='hour');
  assert.ok(hour.every(q=>q.pts[0][0]===q.pts.at(-1)[0]));count++;
  assert.ok(!hour.some(q=>q.hour===6||q.hour===18));count++;
  assert.ok(out.warnings.includes('equator'));count++;
  if(shape==='semicircle'){assert.ok(out.warnings.includes('equatorHalf'));count++;}
  for(const e of out.events)for(const path of e.paths)for(const v of path){assert.ok(S.inside(v,out.face));count++;}
  const noSeasons=S.build({...p,seasons:false,length:40});
  assert.deepEqual(noSeasons.items.filter(q=>q.role==='hour'),hour);count++;
}
for(const hour of [7,8,9,10,11,12,13,14,15,16,17]){
  const q=S.shadow(0,0,hour,40),H=(hour-12)*15*Math.PI/180;
  close(q[0],40*Math.tan(H),1e-8);close(q[1],0,1e-8);
}
for(const delta of [-23.44,-11.72,0,11.72,23.44]){
  const q=S.shadow(0,delta,12,40);
  close(q[0],0,1e-8);close(q[1],-40*Math.tan(delta*Math.PI/180),1e-8);
}
const eqProfile=S.profile({...S.defaults,lat:0,length:40});
assert.ok(eqProfile.items.some(q=>q.type==='text'&&q.value.includes('horizontal rod')));count++;
assert.ok(eqProfile.items.some(q=>q.type==='circle'));count++;
const eqLines=S.build({...S.defaults,lat:0,shape:'rectangle',length:40});
const noon=eqLines.items.filter(q=>q.role==='hour').find(q=>q.hour===12);
close(noon.pts[0][0],noon.pts[1][0]);close(noon.pts[0][0],158);
assert.equal(S.direction(0,12),null);count++;

// Near poles, hour-line separation tends to fifteen degrees. A full polar
// construction needs a 24-hour dial: this half-dial warns instead.
for(const phi of [-89,89]){
  const b=S.build({...S.defaults,lat:phi,shape:'semicircle'});
  assert.ok(b.warnings.includes('nearPole'));count++;
  const a=S.direction(phi,12),c=S.direction(phi,13);
  close(Math.abs(Math.atan2(c[0],-c[1]))*180/Math.PI,15,.01);
  assert.ok(b.items.filter(q=>q.role==='hour').every(q=>q.pts.every(p=>S.inside([p[0]-8,p[1]-8],b.face))));count++;
}
// Equator-facing wall at latitude +45° has the same ideal hour angles as
// a horizontal south-hemisphere dial at -45° (geometric only).
for(const h of [7,8,9,10,11,13,14,15,16,17]){
  const H=(h-12)*Math.PI/12,theta=Math.atan2(Math.cos(45*Math.PI/180)*Math.sin(H),Math.cos(H));
  const e=S.direction(-45,h);close(Math.abs(Math.atan2(e[0],-e[1])),Math.abs(theta));
}
// Rigid rotation about the east-west axis gives effective latitude phi-beta
// for a meridian-plane receiver tilted southward by signed beta. This
// confirms the wall geometry reduction, not a physically mounted wall dial.
for(const [phi,beta] of [[45,90],[30,45],[-30,-45],[60,-20]]){
  const be=beta*Math.PI/180,eff=phi-beta;
  for(const delta of [-23.44,0,23.44])for(const h of [7,9,12,15,17]){
    const v=S.sunVector(phi,delta,h),e=S.sunVector(eff,delta,h);
    close(e[0],v[0],1e-10);
    close(e[1],v[1]*Math.cos(be)+v[2]*Math.sin(be),1e-10);
    close(e[2],-v[1]*Math.sin(be)+v[2]*Math.cos(be),1e-10);
  }
}
for(const [delta,expect] of [[23.44,40.31756447043766],[0,59.66350211768394],[-23.44,114.70197869922612]]) {
  const q=S.shadow(47.9,delta,12,40);close(q[0],0);close(q[1],expect);
  const south=S.shadow(-47.9,-delta,12,40);close(south[0],0);close(south[1],-expect);
}
close(S.direction(47.9,6)[0],-1);close(S.direction(47.9,18)[0],1);
close(S.direction(-47.9,6)[0],1);close(S.direction(-47.9,18)[0],-1);
close(Math.atan2(S.direction(45,15)[0],-S.direction(45,15)[1]),Math.atan(Math.sin(Math.PI/4)));
for(const phi of [NaN,90,-90,Infinity])assert.throws(()=>S.build({lat:phi}));
for(const length of [NaN,0,1001])assert.throws(()=>S.build({length}));
assert.equal(S.shadow(80,-23.44,12,40),null);
for(const shape of ['rectangle','semicircle']) {
  const b=S.layout({...S.defaults,shape});const c=S.clipSegment([-10,b.h/2],[b.w+10,b.h/2],b);
  close(c[0][0],shape==='semicircle'?b.w/2*(1-Math.sqrt(3)/2):0);close(c[1][0],shape==='semicircle'?b.w/2*(1+Math.sqrt(3)/2):b.w);assert.equal(S.clipSegment([-10,-10],[-5,-5],b),null);
}
const s=S.build({...S.defaults,seasons:true,guides:true});
assert.ok(S.svg(s).includes('fill="#ffffff"'));assert.ok(S.svg(s).includes('viewBox="0 0 316 261"'));
assert.ok(Buffer.from(S.pdf(s)).toString('latin1').startsWith('%PDF-1.4'));
if(process.env.SUNDIAL_TEST_OUTPUT){fs.mkdirSync(process.env.SUNDIAL_TEST_OUTPUT,{recursive:true});for(const shape of ['rectangle','semicircle']){const a=S.build({...S.defaults,shape,seasons:true,guides:true,color:true});fs.writeFileSync(`${process.env.SUNDIAL_TEST_OUTPUT}/${shape}.svg`,S.svg(a));fs.writeFileSync(`${process.env.SUNDIAL_TEST_OUTPUT}/${shape}.pdf`,S.pdf(a));}}
console.log(`PASS: ${count} numerical/geometry assertions; semicircle boundary, equatorial rod/nodus, southern hemisphere, near poles, and 3/5/7 seasons.`);
