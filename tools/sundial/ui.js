/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur; SPDX-License-Identifier: MIT */
'use strict';
(() => {
  const S=window.Sundial,$=id=>document.getElementById(id);
  const en={seasonCount:'Seasonal curves',count3:'3 · solstices / equinox',count5:'5 · balanced',count7:'7 · detailed',declinationNote:'Extra curves are equally spaced in solar declination, not calendar months. Intermediate declinations usually occur twice each year.',zoomIn:'Enlarge',zoomOut:'Fit',title:'Sundial',intro:'A horizontal dial pattern for printing, engraving or transferring to a surface.',latitude:'Latitude (north +, south −)',shape:'Face shape',rectangle:'Rectangle',semicircle:'Semicircle',width:'Width (mm)',height:'Height (mm)',diameter:'Diameter (mm)',divisions:'Divisions',hourly:'1 hour',half:'30 minutes',quarter:'15 minutes',numerals:'Hour labels',seasons:'Seasonal lines',guides:'Construction marks',color:'Color seasonal lines',reset:'Reset',length:'Nodus distance along polar edge L (mm)',equatorHeight:'Raised polar rod / nodus height h (mm)',equatorHelp:'At the equator the polar axis is horizontal. Place a north-south rod or point nodus h above the face. Hour lines are parallel; 6 and 18 lie at the horizon and have no finite marks.',nodusHelp:'Read seasons from a specific tip or marked point, not the whole edge. L is the sloping distance from the root to that point.',pattern:'Pattern',pdf:'Download PDF',svg:'Download SVG',png:'PNG · 300 dpi',again:'Download the file again',print:'Print at 100%, without resizing. The custom page follows your design: do not automatically fit to A4/Letter. Check the scale with a ruler.',time:'The face covers 06:00–18:00 apparent solar time. Time zone, longitude and equation-of-time corrections are not included.',table:'Hour-line angles',angleHelp:'Measured from the upward noon direction on the drawing; right is positive. Morning and afternoon sides reverse in the Southern Hemisphere.',gnomon:'Optional: gnomon side profile',equatorProfile:'At the equator, the export shows a horizontal north-south rod at height h with supports; a point nodus at the same height also works.',gnomonHelp:'A triangle for wood, metal or rigid card. Sloping edge O–G must be parallel to Earth’s axis. Tip G is the seasonal nodus. Joints and fold tabs are not included.',profileSvg:'Gnomon SVG',profilePdf:'Gnomon PDF',installation:'Installation',install:'Level the plate and align the arrow with the true poleward direction. O is the root of the polar edge; P is the point vertically below the nodus. For seasonal curves, match L and the nodus height exactly. Magnetic north is not necessarily true north.',limits:'Seasonal curves use approximate declinations between ±23.44°. At the equator use a raised horizontal north-south polar rod or point nodus, not a triangular style. At the poles a separate 24-hour dial is needed. A marked hour may be unlit, and one-minute accuracy is not guaranteed.',source:'Source',credits:'Notes',invalid:'Use latitude −89° to 89° including the equator; dimensions 80–1500 mm; style distance / height 1–1000 mm.',june:'June solstice',equinox:'Equinoxes',december:'December solstice',off:'No visible curve on this face:',crowded:'Some crowded hour labels are omitted; all hour lines remain. Consult the angle table or use a less extreme latitude.',nodusOutside:'The vertical projection P is outside this face. Check your mounting arrangement.',equator:'Equator: the polar rod is horizontal, aligned north–south and raised to height h. Its shadow gives parallel hour lines; 06:00/18:00 have no finite positions.',equatorHalf:'At the equator a semicircle shows only one side of the annual seasonal traces. Use a rectangle for both halves.',nearEquator:'Near the equator the triangular polar style is very low and hour lines crowd. Consider a supported raised polar rod.',nearPole:'Near a pole there can be 24-hour summer daylight. This 06:00–18:00 half-dial omits some usable hours.',equatorOrient:'At latitude 0 the top arrow is true north, chosen for this drawing. The horizontal polar rod runs north–south; a point nodus is placed h above the face.',north:'Top arrow points to true north. Morning is on the left, afternoon on the right.',south:'Top arrow points to true south. Morning is on the right, afternoon on the left.',heightWord:'Nodus height',baseWord:'Poleward offset',angleWord:'Inclination',hourWord:'Solar hour',angleWord2:'Angle',equatorOffset:'Offset from noon line (mm)',equatorTable:'Hour-line offsets',equatorAngleHelp:'At the equator the hours are parallel N-S lines, offset x = h tan H from the central noon line. The 06:00/18:00 lines lie at infinity.',equatorInstall:'At latitude 0, suspend a horizontal north-south polar rod or point nodus at height h directly over the marked center O. There is no polar style root on the plate; O is its ground projection. Read time by the horizontal displacement of the shadow.',equatorTime:'At the equator 06:00 and 18:00 are horizon limits, not finite hour marks. Read the 07:00–17:00 lines by the shadow of a raised horizontal N-S rod or nodus.',busy:'Preparing download…',done:'File ready. Use the link below if the browser did not save it.',failed:'Export failed. Please try SVG or a smaller image.',large:'PNG exceeds the 20-megapixel limit. Use PDF/SVG for large patterns.',alt:'Horizontal sundial pattern, drawn at the specified physical dimensions.'};
  // Mongolian static copy is the default dictionary, captured before language changes.
  const mn=Object.fromEntries([...document.querySelectorAll('[data-i]')].map(e=>[e.dataset.i,e.textContent]));
  Object.assign(mn,{semicircle:'Хагас дугуй',equatorHeight:'Хэвтээ туйлын саваа буюу цэгийн өндөр h (мм)',equatorHelp:'Экваторт туйлын тэнхлэг хэвтээ. Хойд–өмнөд чиглэлд хэвтээ саваа эсвэл өндөрт байрласан цэгийг h өндөрт тогтооно. Цагийн шугамууд параллель, 06:00/18:00-д төгсгөлөг тэмдэг байхгүй.',equatorProfile:'Экваторт гномоны зураг нь h өндөрт байрласан хойд–өмнөд хэвтээ саваа, тулгуурын хажуугийн схем болно. Ижил өндөртэй тусгай цэг ч хэрэглэж болно.',equator:'Экваторт хойд–өмнөд хэвтээ савааг h өндөрт байрлуулна. Цагийн шугамууд параллель; 06:00/18:00-ийн тэмдэг төгсгөлөг биш.',equatorHalf:'Экваторт хагас дугуй нь жилийн улирлын шугамын зөвхөн нэг талыг харуулна. Бүх улирлыг харахын тулд тэгш өнцөгтийг сонгоно уу.',nearEquator:'Экваторт ойрхон налуу гномон маш нам болж, цагийн шугам шахцалдана. Өндөрт бэхэлсэн туйлын саваа тохиромжтой.',nearPole:'Туйлд ойр зуны улиралд нар 24 цаг мандаж болно. 06:00–18:00 хуваарь бусад цагийг хамраагүй.',equatorOrient:'Өргөрөг 0°-д дээд сум жинхэнэ хойд зүгийг заана. Хэвтээ савааг хойд–өмнөд чиглэлд, цэгийг h өндөрт байрлуулна.',zoomOut:'Багтаах',invalid:'Өргөрөг −89°–89° (0° боломжтой), хэмжээ 80–1500 мм, саваа/цэгийн хэмжээ 1–1000 мм байна.',june:'Зургадугаар сарын туйл',equinox:'Өдөр шөнө тэнцэх үе',december:'Арван хоёрдугаар сарын туйл',off:'Хавтанд харагдахгүй шугам:',crowded:'Давхцаж буй зарим дугаарыг нуув. Шугамууд хэвээр; өнцгийн хүснэгтийг харна уу.',nodusOutside:'Үзүүрийн босоо тусгал P хавтангаас гарч байна. Бэхэлгээг шалгана уу.',north:'Дээд сумыг жинхэнэ хойд зүгт чиглүүлнэ. Өглөө зүүн гар талд, орой баруун гар талд.',south:'Дээд сумыг жинхэнэ өмнөд зүгт чиглүүлнэ. Өглөө баруун гар талд, орой зүүн гар талд.',heightWord:'Үзүүрийн өндөр',baseWord:'Туйлын чиглэл дэх зай',angleWord:'Налуугийн өнцөг',hourWord:'Нарны цаг',angleWord2:'Өнцөг',equatorOffset:'Үдийн шугамаас хазайлт (мм)',equatorTable:'Цагийн шугамын шилжилт',equatorAngleHelp:'Экваторт хойд–өмнөд параллель цагийн шугамуудын үдийн шугамаас хазайлт x = h tan H болно. 06:00/18:00 шугам хязгааргүй алслагдана.',equatorInstall:'Өргөрөг 0°-д хойд–өмнөд чиглэлийн хэвтээ саваа эсвэл сүүдрийн цэгийг O тэмдэг дээр эгц байрлуулан h өндөрт бэхэлнэ. O нь хавтанд хүрсэн ирмэгийн суурь биш, цэгийн босоо тусгал. Сүүдрийн хөндлөн шилжилтээр цагийг уншина.',equatorTime:'Экваторт 06:00 ба 18:00 нь мандалт, жаргалтын үе бөгөөд төгсгөлөг шугамгүй. 07:00–17:00 шугамыг өндөрт байрласан хойд–өмнөд саваа буюу цэгийн сүүдрээр уншина.',busy:'Файл бэлтгэж байна…',done:'Файл бэлэн. Автоматаар татаагүй бол доорх холбоосыг ашиглана уу.',failed:'Файл гаргаж чадсангүй. SVG эсвэл бага хэмжээ сонгоно уу.',large:'PNG 20 сая пикселээс хэтэрлээ. Том загварт PDF/SVG ашиглана уу.',alt:'Заасан бодит хэмжээтэй хэвтээ нарны цагийн загвар.'});

  Object.assign(en,{
    intro:'Design horizontal, wall, or inclined-plane sundials for printing, engraving, or etching.',
    surface:'Receiving surface',horizontal:'Horizontal',vertical:'Vertical wall',inclined:'Inclined plate',
    tilt:'Tilt from horizontal β (°)',azimuth:'Outward face azimuth (°)',
    faceConvention:'Azimuth is the outward-facing normal: N=0°, E=90°, S=180°, W=270°. The plate surface must face the Sun.',
    style:'Polar gnomon mounting',autoStyle:'Edge meeting the face (automatic)',raisedStyle:'Supported polar rod / nodus',
    mountSummary:'Gnomon mounting and virtual location',mountHelp:'The gnomon is parallel to Earth’s polar axis. The drawing’s top arrow follows its projection into the face; on a vertical wall this may point physically down. Align the actual wall with the UP direction shown in the layout and directions.',
    raisedHelp:'The rod is parallel to the face or is intentionally raised away from it. L now means perpendicular stand-off h (mm), measured from face O to nodus G. Provide physical supports.',
    rootedHelp:'L means distance along the outward polar edge from face root O to the seasonal nodus G. The vertical-to-face height is h = L sin(α), where α is the polar-edge angle above this face.',
    raisedStyleWarn:'Use a supported polar rod or nodus at perpendicular distance h. Hour markings are parallel for faces exactly parallel to Earth’s axis.',
    nearParallel:'Polar edge nearly parallel to the face: a triangular plate would be very low. Consider a supported rod.',
    unlitHours:'Some 06:00–18:00 hour marks are omitted because sunlight never illuminates this face at those hours.',
    parallelHalf:'The semicircle clips some seasonal shadow paths of this parallel-rod construction; Rectangle shows both halves.',
    diagramTitle:'3D geometry — hour plane and declination cone',demoHour:'Apparent solar hour',demoDelta:'Solar declination δ',demoYaw:'Rotate 3D view',
    diagramHelp:'Blue: rotating hour plane. Ochre: seasonal shadow cone. Green: nodus shadow ray where the face and real horizon admit it. The 3D view is schematic, not a fabrication drawing.',
    orientationFace:'Face orientation',mountAngle:'Polar-edge angle to face',virtual:'Virtual horizontal location',
    angleHelp:'Angles measured from the printed upward polar-axis projection. Missing entries were physically unlit or fell outside the face.',
    equatorAngleHelp:'Parallel polar-rod hour marks are given as signed offsets from the reference position. Missing marks were outside this face or unlit.',
    table:'Hour-line angle / offset',
    install:'Set the plate to the specified tilt and outward azimuth. Align its printed polar-projection arrow with the indicated real-world direction; for a wall the drawing top can point DOWN. A rooted edge extends outward along the polar axis; a raised rod requires supports. The real horizon and face illumination are enforced in the pattern.',
    limits:'The geometry covers 06:00–18:00 apparent solar time and approximate declination bands (not calendar months). This is not a civil-clock dial. Strongly oblique/near-polar orientations may omit many marks. A 24-hour polar or underside-facing dial, and a minute-accuracy guarantee, are not included.',
    gnomonHelp:'Optional side profile measured relative to the actual receiving plane. Rooted polar edge: a dimensioned triangle. Raised/parallel polar rod: stand-off elevation sketch. Supports, joints and fold tabs are not included.',
    invalid:'Check latitude −89° to +89°, tilt 0–90°, outward azimuth 0–360°, dimensions 80–1500 mm, and polar length or height 1–1000 mm.',
    alt:'Sundial fabrication pattern for the selected receiving plane.'
  });
  Object.assign(mn,{
    intro:'Хэвтээ, босоо хана болон налуу хавтгайн нарны цагийг загварчилж, хэвлэн сийлэх хээ гаргана.',
    surface:'Хавтгайн байрлал',horizontal:'Хэвтээ',vertical:'Босоо хана',inclined:'Налуу хавтгай',
    tilt:'Хэвтээгээс хазайх өнцөг β (°)',azimuth:'Гадагш чиглэсэн нормалын азимут (°)',
    faceConvention:'Азимут нь гадаргууны гадагш харсан нормал: 0° хойд, 90° зүүн, 180° өмнөд, 270° баруун.',
    style:'Гномоны төрөл',autoStyle:'Хавтанд тулсан туйлын ирмэг (автомат)',raisedStyle:'Өндөрт бэхэлсэн туйлын саваа',
    mountSummary:'Гномоны байрлал ба виртуал газарзүй',
    mountHelp:'Гномон дэлхийн эргэлтийн тэнхлэгтэй параллель. Зургийн дээд сум хавтгай дахь туйлын тэнхлэгийн тусгалыг заана. Босоо хананд тэр чиглэл доош харж болно; бодит дээш чиглэлийг заасан заавартай тааруулна.',
    raisedHelp:'Туйлын саваа хавтантай параллель эсвэл түүнээс зайтай байрлана. L нь одоо хавтанд перпендикуляр зай h (мм); бэхэлгээ хэрэгтэй.',
    rootedHelp:'L нь O сууриас туйлын ирмэг дагуу G үзүүр хүртэлх зай. Хавтангаас перпендикуляр өндөр h=L sin(α), энд α нь ирмэг ба хавтгайн хоорондох өнцөг.',
    raisedStyleWarn:'Хавтанд перпендикуляр h өндөрт туйлын саваа буюу үзүүр байрлуулна. Туйлын тэнхлэг хавтантай параллель бол цагийн шугамууд параллель байна.',
    nearParallel:'Туйлын ирмэг хавтантай бараг параллель, гурвалжин гномон нам болно. Өндөрт бэхэлсэн саваа тохиромжтой.',
    unlitHours:'Нар тэнгэрийн хаяанаас дээш байсан ч энэ хавтгайг гэрэлтүүлдэггүй зарим цагийн шугам хасагдсан.',
    parallelHalf:'Энэ параллель савааны улирлын зарим сүүдэр хагас дугуйгаас гарна. Хоёр талыг харахын тулд тэгш өнцөгт сонгоно.',
    diagramTitle:'3D геометр — цагийн хавтгай ба улирлын конус',demoHour:'Нарны цаг',demoDelta:'Нарны хэлбийлт δ',demoYaw:'3D дүрсийг эргүүлэх',
    diagramHelp:'Цэнхэр нь цагийн хавтгай, шар нь улирлын конус, ногоон нь үзүүрийн сүүдрийн цацраг. Бодит тэнгэрийн хаяа болон хавтгайн гэрэлтэлтийг шалгасан. 3D дүрс нь угсралтын хэмжээст зураг биш.',
    orientationFace:'Хавтгайн чиглэл',mountAngle:'Туйлын ирмэгийн хавтантай үүсгэх өнцөг',virtual:'Виртуал хэвтээ байрлал',
    angleHelp:'Хэвлэсэн дээд туйлын чиглэлээс хэмжсэн өнцөг. Гэрэлтдэггүй эсвэл хавтанд багтахгүй цагийн тэмдэг гаргахгүй.',
    equatorAngleHelp:'Параллель туйлын савааны шугамын үдийн шугамаас хазайлтыг мм-ээр өгнө. Гэрэлтдэггүй, багтахгүй тэмдэг хасагдана.',
    table:'Цагийн шугамын өнцөг / шилжилт',
    install:'Хавтгайг заасан хазайлт, азимутаар байрлуулна. Зургийн сум туйлын тэнхлэгийн хавтгай дахь тусгал бөгөөд босоо хананд доош чиглэж болно. Гадагш чиглэсэн туйлын ирмэг буюу тулгуурт саваа зөв өнцөгтэй байх ёстой. Бодит тэнгэрийн хаяа ба гэрэлтэлтийг тооцсон.',
    limits:'Зөвхөн 06:00–18:00 жинхэнэ нарны цагийн муж болон ойролцоо нарны хэлбийлтийн шугамуудыг зурна (сарын огноо биш). Иргэний цагийн засвар ороогүй. Туйл орчим, хэт налуу хавтгайд зарим шугам байхгүй. Минутын нарийвчлалын баталгаа байхгүй.',
    gnomonHelp:'Хавтангийн хувьд гномоны нэмэлт хажуу зураг. Тулсан туйлын ирмэгийн хэмжээсийн гурвалжин эсвэл өндөрт бэхэлсэн савааны загвар. Бэхэлгээ, нугалах хавтас ороогүй.',
    invalid:'Өргөрөг −89°–+89°, хазайлт 0–90°, азимут 0–360°, хэмжээ 80–1500 мм, гномоны хэмжээ 1–1000 мм.',
    alt:'Сонгосон хавтгайд зориулсан нарны цагийн хэмжээст хэвлэх загвар.'
  });
  let lang='mn',scene=null,previewURL=null,downloadURL=null,busy=false;
  const dict=()=>lang==='en'?en:mn,t=k=>dict()[k]||en[k]||k;
  const numeric=['lat','width','height','diameter','interval','seasonCount','length','tilt','azimuth'];
  const keys=[...numeric,'shape','numerals','seasons','guides','color','surface','style'];
  const exports=['pdf','svg','png','profilePdf','profileSvg'];
  const read=()=>Object.fromEntries(keys.map(k=>[k,numeric.includes(k)?($(k).value.trim()===''?NaN:Number($(k).value)):['seasons','guides','color'].includes(k)?$(k).checked:$(k).value]));
  function write(p){for(const k of keys){if(typeof p[k]==='boolean')$(k).checked=p[k];else $(k).value=p[k];}$('profileLength').value=p.length;}
  function refreshURL(p){try{const u=new URL(location.href);u.searchParams.set('lang',lang);for(const k of keys)u.searchParams.set(k,String(p[k]));history.replaceState(null,'',u);}catch{}}
  const format=x=>Number(x.toFixed(2));
  function diagram(){if(!scene)return;
    const h=Number($('demoHour').value),d=Number($('demoDelta').value),yaw=Number($('demoYaw').value);
    $('demoHourValue').textContent=String(Math.floor(h)).padStart(2,'0')+':'+(h%1===0?'00':'30');
    $('diagram').innerHTML=window.SundialDiagram.draw(scene,h,d,yaw,lang);
  }
  function refresh() {
    const p=read();$('profileLength').value=$('length').value;
    document.querySelectorAll('.rect-control').forEach(e=>e.hidden=p.shape!=='rectangle');
    $('diameter-control').hidden=p.shape!=='semicircle';
    $('tilt-control').hidden=p.surface!=='inclined';
    $('azimuth-control').hidden=p.surface==='horizontal';
    $('season-controls').hidden=!p.seasons;
    $('error').textContent='';$('warnings').textContent='';
    try{scene=S.build(p);}catch(e){scene=null;$('error').textContent=t('invalid');}
    exports.forEach(k=>$(k).disabled=!scene||busy);
    if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}
    if(!scene){$('dial').removeAttribute('src');$('dial').hidden=true;$('angles').replaceChildren();$('legend').hidden=true;
      $('dimensions').textContent='';$('nodusDimensions').textContent='';$('profileDimensions').textContent='';$('mountingInfo').textContent='';$('virtualInfo').textContent='';$('diagram').replaceChildren();return;}
    $('dial').hidden=false;previewURL=URL.createObjectURL(new Blob([S.svg(scene)],{type:'image/svg+xml'}));
    $('dial').src=previewURL;$('dial').alt=t('alt');
    const f=scene.frame;
    $('dimensions').textContent=scene.face.shape==='semicircle'?'D '+scene.face.w+' mm':scene.face.w+' × '+scene.face.h+' mm';
    $('warnings').textContent=scene.warnings.map(w=>w.startsWith('off:')?t('off')+' '+(scene.events.find(e=>e.id===w.slice(4))?.label||t(w.slice(4))):
      ({raisedStyle:t('raisedStyleWarn'),nearParallel:t('nearParallel'),unlitHours:t('unlitHours'),parallelHalf:t('parallelHalf')}[w]||t(w))).join(' ');
    const height=f.raised?p.length:p.length*Math.abs(f.pn),base=f.raised?0:p.length*Math.sqrt(Math.max(0,1-f.pn*f.pn));
    const info=f.raised?'h = '+format(height)+' mm · '+t('raisedHelp'):
      'h = '+format(height)+' mm · b = '+format(base)+' mm · α = '+format(f.polarAngle)+'° · '+t('rootedHelp');
    $('nodusDimensions').textContent=info;$('profileDimensions').textContent=info;
    $('mountingInfo').textContent=t('mountAngle')+': '+format(f.polarAngle)+'° · '+t('orientationFace')+': β='+format(f.tilt)+'°, A='+format(f.azimuth)+'°'+
      (f.upAngle===null?'':'; UP = '+format(f.upAngle)+'° from page top');
    $('virtualInfo').textContent=t('virtual')+': φ*='+format(f.virtualPhi)+'°, Δλ='+format(f.virtualLon)+'°';
    $('orientation').textContent=p.surface==='horizontal'?t(p.lat<0?'south':'north'):
      t('mountHelp')+' '+t('orientationFace')+': A='+format(f.azimuth)+'°, β='+format(f.tilt)+'°.';
    document.querySelector('[data-i="angleHelp"]').textContent=t(f.raised&&f.parallel?'equatorAngleHelp':'angleHelp');
    document.querySelectorAll('[data-i="length"]').forEach(e=>e.textContent=t(f.raised?'equatorHeight':'length'));
    document.querySelector('[data-i="nodusHelp"]').textContent=t(f.raised?'raisedHelp':'nodusHelp');
    document.querySelector('[data-i="gnomonHelp"]').textContent=t('gnomonHelp');
    $('legend').replaceChildren();$('legend').hidden=!p.seasons;
    if(p.seasons)scene.events.forEach(e=>{const span=document.createElement('span'),swatch=document.createElement('i');swatch.className='swatch';swatch.style.borderColor=p.color?e.color:'#333';swatch.style.borderTopStyle=!e.dash.length?'solid':e.dash[0]<2?'dotted':'dashed';
      const name=['june','equinox','december'].includes(e.id)?t(e.id):e.label;
      span.append(swatch,document.createTextNode(name));$('legend').append(span);});
    const table=document.createElement('table'),head=table.createTHead().insertRow();
    for(const word of [t('hourWord'),t(f.raised&&f.parallel?'equatorOffset':'angleWord2')]){const th=document.createElement('th');th.textContent=word;head.append(th);}
    const parallelOffsets=f.raised&&f.parallel;
    const tbody=table.createTBody();for(let h=6;h<=18;h++){
      const q=scene.hours.find(x=>Math.abs(x.hour-h)<.01),r=tbody.insertRow();r.insertCell().textContent=String(h).padStart(2,'0')+':00';
      r.insertCell().textContent=q?format(parallelOffsets?q.offset:q.angle)+(parallelOffsets?' mm':'°'):'—';
    }
    $('angles').replaceChildren(table);$('diagram').setAttribute('aria-label',t('diagramTitle'));refreshURL(p);diagram();
  }
  function setLanguage(next){lang=next==='en'?'en':'mn';document.documentElement.lang=lang;document.title=t('title')+' · Sol';$('lang').value=lang;
    document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));try{localStorage.setItem('sol-lang',lang);}catch{}refresh();}
  function save(blob,name){if(downloadURL)URL.revokeObjectURL(downloadURL);downloadURL=URL.createObjectURL(blob);const a=$('downloadAgain');a.href=downloadURL;a.download=name;a.hidden=false;a.click();}
  async function png(s){const dpi=300,w=Math.round(s.w/25.4*dpi),h=Math.round(s.h/25.4*dpi);
    if(w*h>20000000||w>10000||h>10000)throw Error('large');
    const url=URL.createObjectURL(new Blob([S.svg(s)],{type:'image/svg+xml'}));
    try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw Error('failed');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(image,0,0,w,h);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('failed');
      const bytes=S.pngDensity(new Uint8Array(await blob.arrayBuffer()),dpi);canvas.width=canvas.height=1;return new Blob([bytes],{type:'image/png'});
    }finally{URL.revokeObjectURL(url);}
  }
  async function exportFile(kind,isProfile=false){if(!scene||busy)return;
    const s=isProfile?S.profile(scene.p):scene,p={...scene.p};busy=true;exports.forEach(k=>$(k).disabled=true);$('exportStatus').textContent=t('busy');
    try{const blob=kind==='png'?await png(s):new Blob([kind==='pdf'?S.pdf(s):S.svg(s)],{type:kind==='pdf'?'application/pdf':'image/svg+xml'});
      const name='sundial-'+(isProfile?'gnomon':p.surface+'-'+p.shape)+'-'+Math.abs(p.lat)+(p.lat>0?'N':p.lat<0?'S':'EQ')+'-'+(isProfile?p.length+'mm':s.face.w+'x'+s.face.h+'mm')+'-'+S.VERSION+'.'+kind;
      save(blob,name);$('exportStatus').textContent=t('done');
    }catch(e){$('exportStatus').textContent=t(e.message==='large'?'large':'failed');}finally{busy=false;exports.forEach(k=>$(k).disabled=!scene);}
  }
  keys.forEach(k=>$(k).addEventListener('input',refresh));
  $('profileLength').addEventListener('input',()=>{$('length').value=$('profileLength').value;refresh();});
  $('lang').addEventListener('change',e=>setLanguage(e.target.value));
  $('reset').addEventListener('click',()=>{write(S.defaults);$('exportStatus').textContent='';$('downloadAgain').hidden=true;refresh();});
  for(const kind of ['pdf','svg','png'])$(kind).addEventListener('click',()=>exportFile(kind));
  $('profileSvg').addEventListener('click',()=>exportFile('svg',true));$('profilePdf').addEventListener('click',()=>exportFile('pdf',true));
  $('zoom').addEventListener('click',()=>{const active=document.querySelector('.preview').classList.toggle('zoomed');$('zoom').dataset.i=active?'zoomOut':'zoomIn';$('zoom').textContent=t($('zoom').dataset.i);$('zoom').setAttribute('aria-pressed',String(active));});
  for(const id of ['demoHour','demoDelta','demoYaw'])$(id).addEventListener('input',diagram);
  const params=new URLSearchParams(location.search),initial={...S.defaults};
  for(const k of keys)if(params.has(k))initial[k]=numeric.includes(k)?(params.get(k).trim()===''?NaN:Number(params.get(k))):typeof initial[k]==='boolean'?params.get(k)==='true':params.get(k);
  if(initial.shape==='circle')initial.shape='semicircle';write(initial);
  let saved;try{saved=localStorage.getItem('sol-lang')}catch{}$('version').textContent=S.VERSION;setLanguage(['mn','en'].includes(params.get('lang'))?params.get('lang'):saved);
})();
