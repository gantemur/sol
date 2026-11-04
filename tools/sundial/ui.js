/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur; SPDX-License-Identifier: MIT */
'use strict';
(() => {
  const S=window.Sundial,$=id=>document.getElementById(id);
  const en={zoomIn:'Enlarge',zoomOut:'Fit',title:'Sundial',intro:'A horizontal dial pattern for printing, engraving or transferring to a surface.',latitude:'Latitude (north +, south −)',shape:'Face shape',rectangle:'Rectangle',circle:'Circle',width:'Width (mm)',height:'Height (mm)',diameter:'Diameter (mm)',divisions:'Divisions',hourly:'1 hour',half:'30 minutes',quarter:'15 minutes',numerals:'Hour labels',seasons:'Seasonal lines',guides:'Construction marks',color:'Color seasonal lines',reset:'Reset',length:'Nodus distance along polar edge L (mm)',nodusHelp:'Read seasons from a specific tip or marked point, not the whole edge. L is the sloping distance from the root to that point.',pattern:'Pattern',pdf:'Download PDF',svg:'Download SVG',png:'PNG · 300 dpi',again:'Download the file again',print:'Print at 100%, without resizing. The custom page follows your design: do not automatically fit to A4/Letter. Check the scale with a ruler.',time:'The face covers 06:00–18:00 apparent solar time. Time zone, longitude and equation-of-time corrections are not included.',table:'Hour-line angles',angleHelp:'Measured from the upward noon direction on the drawing; right is positive. Morning and afternoon sides reverse in the Southern Hemisphere.',gnomon:'Optional: gnomon side profile',gnomonHelp:'A triangle for wood, metal or rigid card. Sloping edge O–G must be parallel to Earth’s axis. Tip G is the seasonal nodus. Joints and fold tabs are not included.',profileSvg:'Gnomon SVG',profilePdf:'Gnomon PDF',installation:'Installation',install:'Level the plate and align the arrow with the true poleward direction. O is the root of the polar edge; P is the point vertically below the nodus. For seasonal curves, match L and the nodus height exactly. Magnetic north is not necessarily true north.',limits:'The three seasonal curves use approximate solstice declinations of ±23.44°. A shadow may leave the plate, and a marked hour need not be sunlit. Special equatorial/polar constructions and a minute-accuracy guarantee are not included.',source:'Source',credits:'Notes',invalid:'Use latitude −89° to 89°, at least 0.1° from the equator; dimensions 80–1500 mm; L 1–1000 mm.',june:'June solstice',equinox:'Equinoxes',december:'December solstice',off:'No visible curve on this face:',crowded:'Some crowded hour labels are omitted; all hour lines remain. Consult the angle table or use a less extreme latitude.',nodusOutside:'The vertical projection P is outside this face. Check your mounting arrangement.',north:'Top arrow points to true north. Morning is on the left, afternoon on the right.',south:'Top arrow points to true south. Morning is on the right, afternoon on the left.',heightWord:'Nodus height',baseWord:'Poleward offset',angleWord:'Inclination',hourWord:'Solar hour',angleWord2:'Angle',busy:'Preparing download…',done:'File ready. Use the link below if the browser did not save it.',failed:'Export failed. Please try SVG or a smaller image.',large:'PNG exceeds the 20-megapixel limit. Use PDF/SVG for large patterns.',alt:'Horizontal sundial pattern, drawn at the specified physical dimensions.'};
  // Mongolian static copy is the default dictionary, captured before language changes.
  const mn=Object.fromEntries([...document.querySelectorAll('[data-i]')].map(e=>[e.dataset.i,e.textContent]));
  Object.assign(mn,{zoomOut:'Багтаах',invalid:'Өргөрөг −89°–89° ба экватороос 0.1°-аас хол; хэмжээ 80–1500 мм; L 1–1000 мм байна.',june:'Зургадугаар сарын туйл',equinox:'Өдөр шөнө тэнцэх үе',december:'Арван хоёрдугаар сарын туйл',off:'Хавтанд харагдахгүй шугам:',crowded:'Давхцаж буй зарим дугаарыг нуув. Шугамууд хэвээр; өнцгийн хүснэгтийг харна уу.',nodusOutside:'Үзүүрийн босоо тусгал P хавтангаас гарч байна. Бэхэлгээг шалгана уу.',north:'Дээд сумыг жинхэнэ хойд зүгт чиглүүлнэ. Өглөө зүүн гар талд, орой баруун гар талд.',south:'Дээд сумыг жинхэнэ өмнөд зүгт чиглүүлнэ. Өглөө баруун гар талд, орой зүүн гар талд.',heightWord:'Үзүүрийн өндөр',baseWord:'Туйлын чиглэл дэх зай',angleWord:'Налуугийн өнцөг',hourWord:'Нарны цаг',angleWord2:'Өнцөг',busy:'Файл бэлтгэж байна…',done:'Файл бэлэн. Автоматаар татаагүй бол доорх холбоосыг ашиглана уу.',failed:'Файл гаргаж чадсангүй. SVG эсвэл бага хэмжээ сонгоно уу.',large:'PNG 20 сая пикселээс хэтэрлээ. Том загварт PDF/SVG ашиглана уу.',alt:'Заасан бодит хэмжээтэй хэвтээ нарны цагийн загвар.'});
  let lang='mn',scene=null,previewURL=null,downloadURL=null,busy=false;
  const dict=()=>lang==='en'?en:mn,t=k=>dict()[k]||en[k]||k;
  const numeric=['lat','width','height','diameter','interval','length'];
  const keys=[...numeric,'shape','numerals','seasons','guides','color'];
  const exports=['pdf','svg','png','profilePdf','profileSvg'];
  const read=()=>Object.fromEntries(keys.map(k=>[k,numeric.includes(k)?($(k).value.trim()===''?NaN:Number($(k).value)):['seasons','guides','color'].includes(k)?$(k).checked:$(k).value]));
  function write(p){for(const k of keys){if(typeof p[k]==='boolean')$(k).checked=p[k];else $(k).value=p[k];}$('profileLength').value=p.length;}
  function refreshURL(p){try{const u=new URL(location.href);u.searchParams.set('lang',lang);for(const k of keys)u.searchParams.set(k,String(p[k]));history.replaceState(null,'',u);}catch{}}
  function refresh() {
    const p=read();$('profileLength').value=$('length').value;
    document.querySelectorAll('.rect-control').forEach(e=>e.hidden=p.shape!=='rectangle');$('diameter-control').hidden=p.shape!=='circle';$('season-controls').hidden=!p.seasons;
    $('error').textContent='';$('warnings').textContent='';
    try{scene=S.build(p);}catch{scene=null;$('error').textContent=t('invalid');}
    exports.forEach(k=>$(k).disabled=!scene||busy);
    if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}
    if(!scene){$('dial').removeAttribute('src');$('dial').hidden=true;$('angles').replaceChildren();$('legend').hidden=true;$('dimensions').textContent='';$('nodusDimensions').textContent='';$('profileDimensions').textContent='';return;}
    $('dial').hidden=false;previewURL=URL.createObjectURL(new Blob([S.svg(scene)],{type:'image/svg+xml'}));$('dial').src=previewURL;$('dial').alt=t('alt');
    $('dimensions').textContent=scene.face.w+' × '+scene.face.h+' mm';
    $('warnings').textContent=scene.warnings.map(w=>w.startsWith('off:')?t('off')+' '+t(w.slice(4)):t(w)).join(' ');
    const a=Math.abs(p.lat)*Math.PI/180,format=x=>Number(x.toFixed(2));
    const dimensions=t('heightWord')+': '+format(p.length*Math.sin(a))+' mm · '+t('baseWord')+': '+format(p.length*Math.cos(a))+' mm · '+t('angleWord')+': '+Math.abs(p.lat)+'°';
    $('nodusDimensions').textContent=dimensions;$('profileDimensions').textContent=dimensions;$('orientation').textContent=t(p.lat>0?'north':'south');
    $('legend').replaceChildren();$('legend').hidden=!p.seasons;
    if(p.seasons)S.events.forEach((e,i)=>{const span=document.createElement('span'),swatch=document.createElement('i');swatch.className='swatch';swatch.style.borderColor=p.color?e.color:'#333';swatch.style.borderTopStyle=i===1?'dashed':i===2?'dotted':'solid';span.append(swatch,document.createTextNode(t(e.id)));$('legend').append(span);});
    const table=document.createElement('table'),head=table.createTHead().insertRow();for(const word of [t('hourWord'),t('angleWord2')]){const th=document.createElement('th');th.textContent=word;head.append(th);}
    const tbody=table.createTBody();for(let h=6;h<=18;h++){const d=S.direction(p.lat,h),r=tbody.insertRow();r.insertCell().textContent=String(h).padStart(2,'0')+':00';r.insertCell().textContent=format(Math.atan2(d[0],-d[1])*180/Math.PI)+'°';}
    $('angles').replaceChildren(table);refreshURL(p);
  }
  function setLanguage(next){lang=next==='en'?'en':'mn';document.documentElement.lang=lang;document.title=t('title')+' · Sol';$('lang').value=lang;document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));try{localStorage.setItem('sol-lang',lang);}catch{}refresh();}
  function save(blob,name){if(downloadURL)URL.revokeObjectURL(downloadURL);downloadURL=URL.createObjectURL(blob);const a=$('downloadAgain');a.href=downloadURL;a.download=name;a.hidden=false;a.click();}
  async function png(s) {
    const dpi=300,w=Math.round(s.w/25.4*dpi),h=Math.round(s.h/25.4*dpi);
    if(w*h>20000000||w>10000||h>10000)throw Error('large');
    const url=URL.createObjectURL(new Blob([S.svg(s)],{type:'image/svg+xml'}));
    try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw Error('failed');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(image,0,0,w,h);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('failed');
      const bytes=S.pngDensity(new Uint8Array(await blob.arrayBuffer()),dpi);canvas.width=canvas.height=1;return new Blob([bytes],{type:'image/png'});
    }finally{URL.revokeObjectURL(url);}
  }
  async function exportFile(kind,isProfile=false) {
    if(!scene||busy)return;const s=isProfile?S.profile(scene.p):scene,p={...scene.p};busy=true;exports.forEach(k=>$(k).disabled=true);$('exportStatus').textContent=t('busy');
    try{const blob=kind==='png'?await png(s):new Blob([kind==='pdf'?S.pdf(s):S.svg(s)],{type:kind==='pdf'?'application/pdf':'image/svg+xml'});
      const name='sundial-'+(isProfile?'gnomon':p.shape)+'-'+Math.abs(p.lat)+(p.lat>0?'N':'S')+'-'+(isProfile?p.length+'mm':s.face.w+'x'+s.face.h+'mm')+'-'+S.VERSION+'.'+kind;
      save(blob,name);$('exportStatus').textContent=t('done');
    }catch(e){$('exportStatus').textContent=t(e.message==='large'?'large':'failed');}finally{busy=false;exports.forEach(k=>$(k).disabled=!scene);}
  }
  keys.forEach(k=>$(k).addEventListener('input',refresh));$('profileLength').addEventListener('input',()=>{$('length').value=$('profileLength').value;refresh();});
  $('lang').addEventListener('change',e=>setLanguage(e.target.value));$('reset').addEventListener('click',()=>{write(S.defaults);$('exportStatus').textContent='';$('downloadAgain').hidden=true;refresh();});
  for(const kind of ['pdf','svg','png'])$(kind).addEventListener('click',()=>exportFile(kind));
  $('profileSvg').addEventListener('click',()=>exportFile('svg',true));$('profilePdf').addEventListener('click',()=>exportFile('pdf',true));
  $('zoom').addEventListener('click',()=>{const active=document.querySelector('.preview').classList.toggle('zoomed');$('zoom').dataset.i=active?'zoomOut':'zoomIn';$('zoom').textContent=t($('zoom').dataset.i);$('zoom').setAttribute('aria-pressed',String(active));});
  const params=new URLSearchParams(location.search),initial={...S.defaults};for(const k of keys)if(params.has(k))initial[k]=numeric.includes(k)?Number(params.get(k)):typeof initial[k]==='boolean'?params.get(k)==='true':params.get(k);
  write(initial);let saved;try{saved=localStorage.getItem('sol-lang');}catch{}$('version').textContent=S.VERSION;setLanguage(['mn','en'].includes(params.get('lang'))?params.get('lang'):saved);
})();
