/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
'use strict';
const assert=require('node:assert/strict');
const S=require('./sundial.js'),G=require('./planar3d.js'),D=require('./diagram3d.js');
let checks=0;const R=Math.PI/180;
function yes(x,msg){checks++;assert.ok(x,msg||'assertion failed');}
function eq(a,b,tol=1e-8,msg){checks++;assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol,`${msg||'values'} ${a} != ${b}`);}
function vec(a,b,tol=1e-9){yes(a.length===b.length);for(let i=0;i<a.length;i++)eq(a[i],b[i],tol);}
function norm(v){return Math.hypot(...v)}
// API and validation, including old bookmarked circle links.
assert.equal(S.VERSION,'P1.1');checks++;
for(const [key,value] of [['lat',90],['lat',-90],['tilt',91],['tilt',-1],['azimuth',361],['azimuth',-1],['length',0],['surface','cone'],['style','floating'],['shape','ellipse'],['seasonCount',4]]){
  assert.throws(()=>S.build({...S.defaults,[key]:value}),undefined,key);checks++;
}
eq(S.build({...S.defaults,shape:'circle'}).face.h,150);
for(const [count,expected] of [[3,[23.44,0,-23.44]],[5,[23.44,11.72,0,-11.72,-23.44]],[7,[23.44,15.6267,7.8133,0,-7.8133,-15.6267,-23.44]]]){
  const sel=S.seasonEvents(count);eq(sel.length,count);
  sel.forEach((e,i)=>eq(e.delta,expected[i]));
}
// Local ENU and the virtual-horizontal transformation are independent ways
// to check the receiver geometry. All basis vectors must be orthonormal.
for(const lat of [-89,-66,-45,-20,0,20,45,66,89]){
  for(const tilt of [0,15,45,75,90])for(const azimuth of [0,45,90,135,180,225,270,315]){
    const f=G.frame(lat,tilt,azimuth),q0=G.sun(lat,0,12),lon=f.virtualLon*R,fp=f.virtualPhi*R;
    for(const v of [f.n,f.u,f.v,f.p,f.k])eq(norm(v),1,2e-12);
    eq(G.dot(f.n,f.u),0,2e-12);eq(G.dot(f.n,f.v),0,2e-12);
    eq(G.dot(f.u,f.v),0,2e-12);
    vec(G.cross(f.v,f.n),f.u,2e-12);
    eq(G.dot(f.n,f.p),Math.sin(fp),2e-12);
    eq(f.n[0],Math.cos(fp)*Math.sin(lon),2e-12);
    eq(G.dot(f.n,q0),Math.cos(fp)*Math.cos(lon),2e-12);
    for(const delta of [-23.44,0,23.44])for(const hour of [6,9,12,15,18]){
      eq(norm(G.sun(lat,delta,hour)),1,2e-12);
    }
  }
}
let f=G.frame(45,90,180);eq(f.virtualPhi,-45);eq(f.virtualLon,0);
f=G.frame(45,90,90);eq(f.virtualPhi,0);eq(f.virtualLon,90);yes(f.raised && f.parallel);
f=G.frame(45,90,270);eq(f.virtualPhi,0);eq(f.virtualLon,-90);yes(f.raised && f.parallel);
f=G.frame(45,45,180);eq(f.virtualPhi,0);eq(f.virtualLon,0);
// A south-facing wall at 45 N has the virtual latitude of a horizontal
// dial at -45. The hour-line slopes agree, but wall page-up is now true UP:
// the physical downward fan differs by 180 degrees on the page.
const wall=G.frame(45,90,180),south=G.frame(-45,0,180),b={shape:'rectangle',w:300,h:200,root:[150,180]};
for(let h=7;h<=17;h++){
  const w=G.hourLine(wall,45,h,40,b.root,S.clipSegment,b),q=G.hourLine(south,-45,h,40,b.root,S.clipSegment,b);
  yes(w!==null&&q!==null,`wall/horizontal counterpart at ${h}`);
  eq(Math.abs(w.angle-q.angle),180,1e-7);
}
// The drawing top is actual gravitational UP for any nonhorizontal plate,
// including declined walls. For a horizontal face it remains poleward.
for(const lat of [-75,-45,0,45,75])for(const tilt of [15,45,75,90])for(const az of [0,45,90,135,180,225,270,315]){
  const f=G.frame(lat,tilt,az);
  eq(G.dot(f.v,[0,0,1]),Math.sin(tilt*R),2e-12);
  eq(f.upAngle,0,2e-10);
}
// Put the polar intersection opposite the physically illuminated ray fan.
// South-facing northern (and north-facing southern) walls have the root at
// the TOP, with lines extending down. A north-facing northern wall is also
// a summer-lit downward fan, unlike a simplistic polar-projection rule.
for(const [lat,az] of [[45,180],[-45,0],[45,0]]){
  const s=S.build({...S.defaults,lat,surface:'vertical',azimuth:az}),semi=S.build({...S.defaults,lat,surface:'vertical',azimuth:az,shape:'semicircle'});
  yes(s.face.root[1]<s.face.h*.2);
  yes(s.face.fanDirection[1]>.9);
  yes(semi.face.inward[1]===1&&semi.face.root[1]===0);
  const noon=s.hours.find(q=>q.hour===12);
  if(az===180&&lat>0 || az===0&&lat<0){yes(noon!==undefined);yes(noon.direction[1]>0);}
  for(const q of semi.items.filter(q=>q.role==='hour'||q.role==='season'))for(const pt of q.pts)
    yes(S.inside(pt.map(x=>x-8),semi.face),`vertical semicircle clip ${pt}`);
  yes(S.svg(semi).includes(' A 150 150 0 0 1 '));
  yes(S.pdf(semi).length>1000);
}
for(const az of [90,270]){
  const s=S.build({...S.defaults,lat:45,surface:'vertical',azimuth:az});
  yes(s.frame.raised && s.frame.parallel);
  vec(s.face.root,[s.face.w/2,s.face.h/2]);
}
for(const [lat,tilt,az,expectedX,expectedY] of [[45,60,0,'center','top'],[45,30,180,'center','bottom'],[45,60,90,'left','bottom'],[45,60,270,'right','bottom']]){
  const p={...S.defaults,lat,surface:'inclined',tilt,azimuth:az},s=S.build(p),b=s.face,sem=S.build({...p,shape:'semicircle'}).face;
  yes(expectedX==='center'?Math.abs(b.root[0]-b.w/2)<1e-7:expectedX==='left'?b.root[0]<b.w*.25:b.root[0]>b.w*.75);
  yes(expectedY==='top'?b.root[1]<b.h*.25:expectedY==='bottom'?b.root[1]>b.h*.75:true);
  if(expectedX==='left'||expectedX==='right'){
    eq(sem.w,p.diameter/2);eq(sem.h,p.diameter);
    yes(sem.inward[0]===(expectedX==='left'?1:-1));
  }
}
// Hour-plane geometry: both nodus and projected shadow point belong to the
// same plane through the polar axis; shadow points lie in the receiver.
for(const [lat,tilt,azimuth,style] of [[47.9,0,180,'auto'],[-47.9,0,180,'auto'],[47.9,90,180,'auto'],[47.9,90,0,'auto'],[47.9,90,90,'auto'],[47.9,90,270,'auto'],[45,30,135,'auto'],[60,55,210,'auto'],[0,0,180,'auto'],[45,30,180,'raised'],[-40,50,110,'raised'],[80,80,30,'auto']]){
  const f=G.frame(lat,tilt,azimuth,style),origin=[150,100],N=G.nodus(f,40);
  eq(G.dot(N,f.n),f.raised?40:40*Math.abs(f.pn),1e-9);
  for(const delta of [-23.44,-12,0,12,23.44])for(let hour=6;hour<=18;hour+=.5){
    const sun=G.sun(lat,delta,hour),q=G.project(f,lat,delta,hour,40,origin);
    if(!q)continue;
    eq(G.dot(q.world,f.n),0,2e-8);
    vec(G.sub(q.world,N),G.mul(sun,-q.t),2e-7);
    const hourNormal=G.cross(f.p,G.sun(lat,0,hour));
    eq(G.dot(hourNormal,G.sub(q.world,N)),0,2e-7);
    eq(q.x,origin[0]+G.dot(q.world,f.u),1e-8);
    eq(q.y,origin[1]-G.dot(q.world,f.v),1e-8);
    yes(q.alt>0 && q.face>0);
  }
}
// Current 06–18 convention, real face lighting, and finite gnomon cases.
for(const [az,first,last] of [[90,6,11],[270,13,18],[180,7,17],[0,6,18]]){
  const s=S.build({...S.defaults,lat:47.9,surface:'vertical',azimuth:az});
  yes(s.hours.length>0);
  yes(s.hours.every(x=>x.hour>=first&&x.hour<=last));
  if(az===90||az===270)yes(s.frame.raised&&s.frame.parallel);
}
for(const [lat,shape] of [[0,'rectangle'],[0,'semicircle'],[47.9,'rectangle'],[-47.9,'semicircle'],[89,'semicircle'],[-89,'rectangle']]){
  const s=S.build({...S.defaults,lat,shape,seasons:true,guides:true}),b=s.face;
  yes(s.events.length===5);
  for(const q of s.items.filter(q=>q.role==='hour'||q.role==='season')){
    for(const pt of q.pts)yes(S.inside(pt.map(x=>x-8),b,0),`${lat}/${shape}: ${q.role} outside face ${pt}`);
  }
  for(const e of s.events)for(const path of e.paths)for(const pt of path)yes(S.inside(pt,b));
  yes(s.items.some(x=>x.type===shape || (shape==='rectangle'&&x.role==='guide')));
  yes(S.svg(s).startsWith('<svg'));
  yes(S.pdf(s).byteLength>1000);
}
// Equator: rod offset x=h tan(H), no finite 06/18 markings.
for(const shape of ['rectangle','semicircle']){
  const s=S.build({...S.defaults,lat:0,shape,length:40});
  yes(s.frame.raised&&s.frame.parallel);
  yes(!s.hours.some(q=>q.hour===6||q.hour===18));
  for(const q of s.hours){
    const H=(q.hour-12)*15*R;
    eq(q.offset,40*Math.tan(H),2e-8);
    eq(q.pts[0][0],q.pts[1][0],1e-7);
  }
}
// The straight equinox seasonal line and independent nodus-length scaling.
for(const lat of [-60,-47.9,0,47.9,60]){
  const f=G.frame(lat,0,180),c=[150,100],a=[];
  for(let hour=8;hour<=16;hour++){
    const q=G.project(f,lat,0,hour,40,c);yes(q!==null);
    const target=lat===0?c[1]:c[1]-40/Math.cos(Math.abs(lat)*R);
    eq(q.y,target,2e-7);a.push(q);
  }
  const old=S.build({...S.defaults,lat,seasons:false});
  const newLen=S.build({...S.defaults,lat,length:90,seasons:false});
  if(lat!==0) {assert.deepEqual(old.items.filter(x=>x.role==='hour'),newLen.items.filter(x=>x.role==='hour'));checks++;}
  else {yes(old.hours[0].offset!==newLen.hours[0].offset);
    yes(old.hours.every(x=>x.raised)&&newLen.hours.every(x=>x.raised));}
}
for(const [delta,offset] of [[-23.44,114.70197869922612],[0,59.66350211768394],[23.44,40.31756447043766]]){
  const f=G.frame(47.9,0,180),q=G.project(f,47.9,delta,12,40,[150,180]);
  yes(q!==null);eq(180-q.y,offset,2e-6);
}
for(const p of [S.defaults,{...S.defaults,surface:'vertical',azimuth:180},{...S.defaults,surface:'vertical',azimuth:90},{...S.defaults,surface:'inclined',tilt:45,azimuth:135},{...S.defaults,surface:'inclined',tilt:60,azimuth:235,style:'raised'}]){
  const s=S.build(p),pro=S.profile(p);
  yes(S.svg(pro).includes('<svg'));yes(S.pdf(pro).byteLength>400);
  yes(D.draw(s,11,23.44,35,'en').includes('Declination cone'));
  yes(D.draw(s,11,0,-70,'mn').includes('Цагийн хавтгай'));
}
// A deliberately raised rod on an oblique plane has a shifted hour-plane
// intersection, which is generally NOT parallel (only exact parallel-axis
// faces generate parallel lines). Check every clipped hour-line endpoint.
const shifted={...S.defaults,surface:'inclined',tilt:55,azimuth:140,style:'raised',length:50};
const shiftScene=S.build(shifted),shiftFrame=shiftScene.frame,shiftN=G.nodus(shiftFrame,50);
yes(shiftScene.hours.length>4);yes(!shiftFrame.parallel);
for(const h of shiftScene.hours){
  const m=G.cross(shiftFrame.p,G.sun(shifted.lat,0,h.hour));
  for(const pt of h.pts){
    const du=pt[0]-shiftScene.face.root[0],dv=shiftScene.face.root[1]-pt[1];
    const world=G.add(G.mul(shiftFrame.u,du),G.mul(shiftFrame.v,dv));
    eq(G.dot(m,G.sub(world,shiftN)),0,1e-7);
  }
  yes(h.offset===null);
}
const perpendicular={...S.defaults,surface:'inclined',tilt:45,azimuth:0,lat:45};
const perp=S.build(perpendicular),perpSketch=S.profile(perpendicular);
eq(perp.frame.polarAngle,90,1e-7);
yes(perp.hours.length>0);
yes(perpSketch.items.some(q=>q.type==='text'&&q.value.includes('PERPENDICULAR')));
const raisedSketch=S.profile({...S.defaults,surface:'inclined',tilt:45,azimuth:130,style:'raised'});
const rod=raisedSketch.items.find(q=>q.type==='path'&&q.width===1);
yes(rod&&Math.abs(rod.pts[1][1]-rod.pts[0][1])>1);
const semi=S.build({...S.defaults,shape:'semicircle'});
eq(semi.face.w,300);eq(semi.face.h,150);
yes(semi.items.some(x=>x.type==='semicircle'));
yes(!semi.items.some(x=>x.type==='circle'&&x.r===150));
const pdfText=Buffer.from(S.pdf(semi)).toString('latin1');yes(pdfText.includes('/MediaBox'));
console.log(`PASS: ${checks} numerical/geometry/export assertions; P1 arbitrary planes, visibility, roots, raised rods and legacy horizontal cases.`);
