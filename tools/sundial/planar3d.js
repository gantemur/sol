/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
(function (root) {
  'use strict';
  // Vectors use east, north, up. The receiving plane passes through the
  // reference point O; all lengths are millimetres and angles are degrees.
  const R=Math.PI/180, EPS=1e-9;
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const mul=(a,k)=>a.map(v=>v*k);
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>Math.hypot(...a);
  function unit(a) {const m=norm(a);if(m<EPS)throw Error('degenerate-vector');return mul(a,1/m);}
  const clamp=(a,lo,hi)=>Math.max(lo,Math.min(hi,a));
  const pole=phi=>[0,Math.cos(phi*R),Math.sin(phi*R)];
  function sun(phi,delta,hour) {
    const p=phi*R,d=delta*R,h=(hour-12)*15*R;
    return [-Math.cos(d)*Math.sin(h),
      Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(h),
      Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h)];
  }
  function normal(tilt,azimuth) {
    const b=tilt*R,a=azimuth*R;
    return [Math.sin(b)*Math.sin(a),Math.sin(b)*Math.cos(a),Math.cos(b)];
  }
  function frame(phi,tilt=0,azimuth=180,style='auto') {
    const n=normal(tilt,azimuth),p=pole(phi),pn=dot(p,n);
    const parallel=Math.abs(pn)<1e-8;
    const raised=style==='raised'||parallel;
    const k=mul(p,pn<0?-1:1);
    // Align the printed top with the projection of the outward polar axis.
    // This may point physically down on a south-facing vertical wall.
    let v=sub(k,mul(n,dot(k,n)));
    if(norm(v)<1e-8) {
      // If the polar axis is perpendicular to the face, choose the
      // Sun's equatorial noon direction as an unambiguous drawing axis.
      v=mul(sub(sun(phi,0,12),mul(n,dot(sun(phi,0,12),n))),-1);
    }
    v=unit(v);
    const u=unit(cross(v,n));
    const up=[0,0,1],physUp=sub(up,mul(n,dot(up,n)));
    const virtualPhi=Math.asin(clamp(pn,-1,1))/R;
    const meridianPerp=[0,-Math.sin(phi*R),Math.cos(phi*R)];
    const virtualLon=Math.atan2(n[0],dot(n,meridianPerp))/R;
    const upAngle=norm(physUp)>1e-8?Math.atan2(dot(physUp,u),dot(physUp,v))/R:null;
    return {n,p,k,u,v,pn,parallel,raised,tilt,azimuth,virtualPhi,virtualLon,upAngle,
      polarAngle:Math.asin(Math.abs(pn))/R};
  }
  function nodus(f,length) {
    // For a rooted polar edge the selected point lies L along the edge.
    // For a raised polar rod the point is h out from O along the face normal.
    return f.raised?mul(f.n,length):mul(f.k,length);
  }
  function project(f,phi,delta,hour,length,reference=[0,0]) {
    const s=sun(phi,delta,hour),face=dot(s,f.n),alt=s[2];
    if(alt<=1e-7 || face<=1e-7) return null;
    const g=nodus(f,length),dist=dot(g,f.n),t=dist/face;
    if(t<=0 || !Number.isFinite(t))return null;
    const q=sub(g,mul(s,t));
    const x=reference[0]+dot(q,f.u),y=reference[1]-dot(q,f.v);
    return Number.isFinite(x)&&Number.isFinite(y)?{x,y,world:q,t,alt,face}:null;
  }
  function hourLine(f,phi,hour,length,reference,clipSegment,board) {
    const candidates=[];
    // Locate a physically reachable branch (front illumination AND above
    // the actual horizon), rather than choosing an arbitrary half-plane.
    for(let i=0;i<=72;i++) {
      const delta=-23.44+(46.88*i/72),q=project(f,phi,delta,hour,length,reference);
      if(q && Math.abs(q.x)+Math.abs(q.y)<1e9)candidates.push({q,score:Math.min(q.alt,q.face)});
    }
    candidates.sort((a,b)=>b.score-a.score);
    if(!candidates.length)return null;
    const q=candidates[0].q;
    // Intersect the actual hour plane through the polar rod with the
    // receiver. For a raised rod this is NOT generally a parallel family:
    // only when the polar axis is exactly parallel to the face.
    const planeNormal=cross(f.p,sun(phi,0,hour));
    const axis=cross(f.n,planeNormal);
    let d=[dot(axis,f.u),-dot(axis,f.v)];
    if(f.raised){if(d[1]>0)d=mul(d,-1);}
    else {
      const outward=[q.x-reference[0],q.y-reference[1]];
      if(d[0]*outward[0]+d[1]*outward[1]<0)d=mul(d,-1);
    }
    const lengthD=Math.hypot(...d);
    if(lengthD<1e-9)return null;
    d=d.map(v=>v/lengthD);
    const k=Math.max(board.w,board.h)*12;
    const a=f.raised?[q.x-k*d[0],q.y-k*d[1]]:reference;
    const b=f.raised?[q.x+k*d[0],q.y+k*d[1]]:[reference[0]+k*d[0],reference[1]+k*d[1]];
    const segment=clipSegment(a,b,board);
    if(!segment)return null;
    const [v,z]=segment;
    if(Math.hypot(z[0]-v[0],z[1]-v[1])<1e-3)return null;
    // For a rooted style, clipSegment returns a portion of the ray.
    // For a raised rod it returns the full line through its anchor.
    return {pts:segment,hour,raised:f.raised,
      angle:Math.atan2(d[0],-d[1])/R,
      offset:f.raised&&f.parallel?q.x-reference[0]:null,
      anchor:[q.x,q.y],direction:d};
  }
  function identity(phi,tilt,azimuth) {
    const f=frame(phi,tilt,azimuth);
    return {phi:f.virtualPhi,longitudeOffset:f.virtualLon};
  }
  const api={R,add,sub,mul,dot,cross,norm,unit,clamp,pole,sun,normal,frame,nodus,project,hourLine,identity};
  if(typeof module!=='undefined' && module.exports)module.exports=api;else root.Sundial3D=api;
})(typeof globalThis!=='undefined'?globalThis:this);
