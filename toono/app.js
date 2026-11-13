/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
   SPDX-License-Identifier: MIT

   toono UI: state, controls, i18n and canvas rendering of the unfolded ger
   interior with the light patch from the toono. Computation is in engine.js. */
(function () {
  'use strict';
  const E = window.ToonoEngine;
  const $ = id => document.getElementById(id);
  const D2R = E.D2R, R2D = E.R2D;

  // Tool name lives here, in index.html <title>/<h1>, tools.json and the
  // Sol homepage card (see README "Renaming").
  const TOOL = { id: 'toono', title: { mn: 'Гэрийн наран цаг', en: 'Ger sun clock' } };

  const ANIMALS = {
    mn: ['Хулгана', 'Үхэр', 'Бар', 'Туулай', 'Луу', 'Могой', 'Морь', 'Хонь', 'Бич', 'Тахиа', 'Нохой', 'Гахай'],
    en: ['Mouse', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Rooster', 'Dog', 'Pig']
  };

  const PLACES = [
    { id: 'ub', lat: 47.92, lon: 106.92, tz: 'Asia/Ulaanbaatar', mn: 'Улаанбаатар', en: 'Ulaanbaatar' },
    { id: 'khovd', lat: 48.01, lon: 91.64, tz: 'Asia/Hovd', mn: 'Ховд', en: 'Khovd' },
    { id: 'choibalsan', lat: 48.07, lon: 114.53, tz: 'Asia/Ulaanbaatar', mn: 'Чойбалсан', en: 'Choibalsan' },
    { id: 'hohhot', lat: 40.84, lon: 111.75, tz: 'Asia/Shanghai', mn: 'Хөх хот', en: 'Hohhot' },
    { id: 'ulanude', lat: 51.83, lon: 107.61, tz: 'Asia/Irkutsk', mn: 'Улаан-Үд', en: 'Ulan-Ude' },
    { id: 'lhasa', lat: 29.65, lon: 91.13, tz: 'Asia/Shanghai', mn: 'Лхас', en: 'Lhasa' },
    { id: 'montreal', lat: 45.50, lon: -73.57, tz: 'America/Toronto', mn: 'Монреал', en: 'Montreal' }
  ];

  const T = {
    mn: {
      title: TOOL.title.mn,
      intro: 'Тооноор тусах нарны гэрэл гэрийн дотор хаана буухыг таны байршил, цаг хугацаанд тохируулан харуулна.',
      viewTitle: 'Гэрийн дотоод задалсан зураг',
      canvasLabel: 'Гэрийн дотоод задалсан зураг ба гэрлийн толбо',
      netNote: 'Гэрийг дээрээс харсан зураг: шал болон униыг (тунгалаг гэж үзэн) дээрээс харуулж, ханыг гадагш нь дэлгэсэн (дотор захаас ханын толгой хүртэл). Унин дээрх гэрлийг зураасаар тэмдэглэв.',
      timeControls: 'Цаг удирдах', now: 'Одоо', dayShort: 'өдөр', hourShort: 'цаг',
      dayBack: 'Нэг өдөр ухраах', hourBack: 'Нэг цаг ухраах', hourFwd: 'Нэг цаг урагшлуулах', dayFwd: 'Нэг өдөр урагшлуулах',
      play: 'Явуулах', pause: 'Зогсоох', speed: 'Хурд', datetime: 'Огноо, цаг',
      spdM3600: '−1 цаг/сек', spdM600: '−10 мин/сек', spdM60: '−1 мин/сек', spd1: 'Бодит хурд',
      spd60: '1 мин/сек', spd600: '10 мин/сек', spd3600: '1 цаг/сек', spd21600: '6 цаг/сек',
      jumpLabel: 'Онцлох өдөр', springEq: 'Хаврын тэгшитгэл', summerSol: 'Зуны туйл', autumnEq: 'Намрын тэгшитгэл', winterSol: 'Өвлийн туйл',
      overlays: 'Давхаргууд', ovWedges: 'Гэрийн 12 тогтмол зүг', ovUni: 'Унь',
      ovClock: ':40 хуваарийн хил (энэ өдөр)', ovTemporal: 'Нар мандахаас эхэлсэн тэгш бус цаг',
      ovSeasons: 'Туйл, тэгшитгэлийн өдрийн зам', ovLabels: 'Гэрийн хэсгийн нэр',
      ovSundial: 'Нарны цагийн тогтмол шугам', sdOff: 'Харуулахгүй',
      sdSolar: 'Жинхэнэ нарны цаг (Морь үдэд төвлөрнө)', sdClock: ':40 хуваарь (дундаж нарны цаг)',
      placeTitle: 'Байршил ба цагийн бүс', preset: 'Газар', custom: 'Бусад (гараар)',
      lat: 'Өргөрөг (°, хойд +)', lon: 'Уртраг (°, зүүн +)', zone: 'Цагийн бүс', deviceZone: 'төхөөрөмж',
      useLocation: 'Миний байршлыг ашиглах', geoBusy: 'Байршил тодорхойлж байна…', geoFail: 'Байршил авч чадсангүй.',
      geoOk: 'Төхөөрөмжийн байршил ба цагийн бүсийг ашиглав.',
      gerTitle: 'Гэр', size: 'Хэмжээ', size4: '4 ханатай', size5: '5 ханатай', size6: '6 ханатай',
      door: 'Хаалганы чиг (азимут °)', urkh: 'Өрх', urkhOpen: 'Бүрэн нээлттэй', urkhHalf: 'Хаалганы талын хагас нээлттэй',
      diam: 'Шалны диаметр (м)', wallH: 'Ханын өндөр (м)', toonoH: 'Тооны өндөр (м)', toonoD: 'Тооны диаметр (м)', uniCount: 'Униын тоо',
      gerNote: 'Хэмжээнүүд ойролцоо; өөрийн гэрийнхээр засаж болно.',
      badPlace: 'Өргөрөг −89…89°, уртраг −180…180° байх ёстой.', badGer: 'Гэрийн хэмжээ буруу: ',
      badTime: 'Огноо, цаг буруу байна.',
      rClock: 'Цаг', rSolar: 'Жинхэнэ нарны цаг', rEot: 'цагийн тэгшитгэл', rSun: 'Нарны өндөр / азимут',
      rLight: 'Гэрэл туссан газар', floor: 'шал', wall: 'хана', roof: 'унь (дээвэр)', none: '—',
      rHours: 'Арван хоёр цаг', h40: ':40 хуваарь (цагаар)', hSolar: 'Жинхэнэ нарны (үд Морины дунд)',
      hDir: 'Гэрийн зүг (гэрлийн толбо)', hTemp: 'Нар мандахаас (Туулай мандахад эхэлнэ)',
      night: 'Нар жаргасан — гэрэл тусахгүй', polar: 'туйлын өдөр/шөнө',
      lgPatch: 'Шал, хана дээрх гэрэл', lgRoofPatch: 'Унин дээрх гэрэл', lgWedge: '12 зүгийн хил', lgClock: ':40 хил (энэ өдөр)', lgSundial: 'Нарны цагийн шугам',
      lgTemporal: 'Тэгш бус цагийн шугам', lgSeasons: 'Туйл/тэгшитгэлийн зам', lgToday: 'Энэ өдрийн толбоны төвийн зам',
      lblFloor: 'шал', lblWall: 'хана', lblRoof: 'унь', lblToono: 'тооно', lblKhoimor: 'хоймор', lblDoor: 'хаалга',
      compass: ['Х', 'З', 'У', 'Б'],
      helpTitle: 'Тайлбар ба загвар',
      help: [
        '<p><b>Юуг харуулдаг вэ?</b> Тооно бол гэрийн дээвэр дээрх хэвтээ дугуй нүх. Нарны гэрэл түүгээр орж шал, хана, униан дээр гэрлийн толбо болж буудаг. Нар хөдлөхөд толбо гэрийн дотор тойрон гүйнэ. Зураг нь гэрийг дээрээс харсан байдлаар: шал, униыг дээрээс (дээврийг тунгалаг гэж) харуулж, ханыг шалны эргэн тойронд гадагш дэлгэсэн; хаалга урд талд. Тооно цэг биш, өргөн дугуй учраас нар намхан үед (өглөө эрт, орой) толбо униан дээр, тооны эсрэг талд буудаг.</p>',
        '<p><b>Арван хоёр цагийн дөрвөн уншлага.</b> (1) <i>:40 хуваарь</i> — толь бичигт байдаг Хулгана 23:40–01:40, Морь 11:40–13:40 гэх мэт, сонгосон цагийн бүсийн цагаар. (2) <i>Жинхэнэ нарны хоёр цаг</i> — Морины цагийн дунд нь жинхэнэ үд. (3) <i>Гэрийн зүг</i> — гэрийг 30°-ын тогтмол 12 хэсэгт хувааж, гэрлийн толбо аль хэсэгт байгаагаар (нар зүүн тийш байхад толбо баруун талд — Туулай). Энэ нь улирлаас хамаарч урт нь өөрчлөгдөх тэгш бус цаг. (4) <i>Нар мандахаас</i> — өдрийг нар мандахаас жаргах хүртэл 6, шөнийг 6 хувааж, Туулай нар мандахад, Тахиа нар жаргахад эхэлнэ гэсэн таамаглал.</p>',
        '<p><b>Давхаргууд.</b> Гэрийн 12 тогтмол зүг нь төвөөс татсан шулуун шугамууд. «:40 хил» нь энэ өдрийн толбоны төвийн зам ба :40 цагт толбо хаана байхыг үзүүлэх тул улирлаар хэсгүүд хэрхэн нээгдэж, хумигдахыг харж болно. «Нарны цагийн тогтмол шугам» нь жилийн турш хүчинтэй шугам: тэнцүү цагууд төвөөс биш, тооноос дэлхийн тэнхлэгтэй параллель татсан шугам шалтай огтлолцох цэгээс (хаалганы ойролцоо) салаалж гарна.</p>',
        '<p><b>Уламжлал.</b> Монгол, буриад, тува, казах ардын дунд гэрийн тооноор тусах гэрлээр цаг баримжаалдаг байсан нь олон эх сурвалжид бий: тоононд туссан гэрэл Бар–Туулай цаг, униын толгойноос ханын толгой хүрэх нь Луу–Могой цаг, хойморт тусах их үд нь Морин цаг гэх мэт. 60 уньтай дөрвөн ханатай гэр «нарны цагтай яг таардаг» гэдэг.</p>',
        '<p><b>Загварын хязгаар.</b> Гэр нь тэгш шал, босоо цилиндр хана, шулуун конус дээвэртэй; тооно нь зузаангүй нээлттэй хэвтээ дугуй (хөндлөвч, багана, яндангийн сүүдэр тооцоогүй). Нарны байрлалыг NOAA/Meeus аргаар (~1 минутын нарийвчлал) тооцож, агаар мандлын хугарлыг тооцоогүй. Хаалгаар орох гэрлийг харуулаагүй. Гэрийн хэмжээ ойролцоо.</p>'
      ]
    },
    en: {
      title: TOOL.title.en,
      intro: 'Where sunlight through the toono lands inside a ger, for your location and time.',
      viewTitle: 'Unfolded interior of the ger',
      canvasLabel: 'Unfolded interior of the ger with the light patch',
      netNote: 'Plan view from above: floor and roof poles seen from above (roof treated as transparent), with the wall folded out around them (wall foot inside, wall head outside). Light on the roof poles is hatched.',
      timeControls: 'Time controls', now: 'Now', dayShort: 'day', hourShort: 'h',
      dayBack: 'Back one day', hourBack: 'Back one hour', hourFwd: 'Forward one hour', dayFwd: 'Forward one day',
      play: 'Play', pause: 'Pause', speed: 'Speed', datetime: 'Date and time',
      spdM3600: '−1 h/s', spdM600: '−10 min/s', spdM60: '−1 min/s', spd1: 'Real time',
      spd60: '1 min/s', spd600: '10 min/s', spd3600: '1 h/s', spd21600: '6 h/s',
      jumpLabel: 'Special days', springEq: 'March equinox', summerSol: 'June solstice', autumnEq: 'September equinox', winterSol: 'December solstice',
      overlays: 'Overlays', ovWedges: '12 fixed sectors of the ger', ovUni: 'Roof poles (uni)',
      ovClock: ':40 boundaries (this day)', ovTemporal: 'Unequal hours from sunrise',
      ovSeasons: 'Solstice and equinox day paths', ovLabels: 'Names of ger parts',
      ovSundial: 'Fixed sundial lines', sdOff: 'Off',
      sdSolar: 'True solar time (Horse centred on noon)', sdClock: ':40 convention (mean solar time)',
      placeTitle: 'Location and time zone', preset: 'Place', custom: 'Other (manual)',
      lat: 'Latitude (°, north +)', lon: 'Longitude (°, east +)', zone: 'Time zone', deviceZone: 'device',
      useLocation: 'Use my location', geoBusy: 'Finding location…', geoFail: 'Could not get location.',
      geoOk: 'Using the device location and time zone.',
      gerTitle: 'Ger', size: 'Size', size4: '4 lattice walls', size5: '5 lattice walls', size6: '6 lattice walls',
      door: 'Door direction (azimuth °)', urkh: 'Roof flap (urkh)', urkhOpen: 'Fully open', urkhHalf: 'Door-side half open',
      diam: 'Floor diameter (m)', wallH: 'Wall height (m)', toonoH: 'Toono height (m)', toonoD: 'Toono diameter (m)', uniCount: 'Number of uni',
      gerNote: 'Dimensions are approximate; adjust them to a real ger.',
      badPlace: 'Latitude must be −89…89° and longitude −180…180°.', badGer: 'Invalid ger dimensions: ',
      badTime: 'Invalid date or time.',
      rClock: 'Clock', rSolar: 'True solar time', rEot: 'equation of time', rSun: 'Sun altitude / azimuth',
      rLight: 'Light falls on', floor: 'floor', wall: 'wall', roof: 'roof poles (uni)', none: '—',
      rHours: 'The twelve hours', h40: ':40 convention (clock)', hSolar: 'True solar (noon mid-Horse)',
      hDir: 'Ger direction (light patch)', hTemp: 'From sunrise (Rabbit begins at sunrise)',
      night: 'Sun is down — no light patch', polar: 'polar day/night',
      lgPatch: 'Light on floor or wall', lgRoofPatch: 'Light on roof poles', lgWedge: '12-sector boundaries', lgClock: ':40 boundaries (this day)', lgSundial: 'Sundial lines',
      lgTemporal: 'Unequal-hour lines', lgSeasons: 'Solstice/equinox paths', lgToday: 'Path of patch centre today',
      lblFloor: 'floor', lblWall: 'wall', lblRoof: 'uni', lblToono: 'toono', lblKhoimor: 'khoimor', lblDoor: 'door',
      compass: ['N', 'E', 'S', 'W'],
      helpTitle: 'Explanation and model',
      help: [
        '<p><b>What it shows.</b> The toono is the horizontal ring opening at the top of a ger. Sunlight passes through it and makes a bright patch on the floor, wall or roof poles, which travels around the interior as the Sun moves. The drawing is a plan view: floor and roof poles seen from above (roof treated as transparent), with the wall folded out around the floor; the door is on the south. Because the toono is a wide disk, not a point, a low Sun (early morning, evening) puts the patch on the roof poles opposite the Sun.</p>',
        '<p><b>Four readings of the twelve hours.</b> (1) <i>:40 convention</i>: Mouse 23:40–01:40, Horse 11:40–13:40 and so on, as in Mongolian dictionaries, on the chosen zone\'s clock. (2) <i>True solar double hours</i>: Horse centred on true noon. (3) <i>Ger direction</i>: twelve fixed 30° sectors of the ger, read by where the light patch falls (Sun in the east puts the patch in the west: Rabbit). These are unequal, seasonal hours. (4) <i>From sunrise</i>: daylight and night each split into six, with Rabbit beginning at sunrise and Rooster at sunset (a hypothesis).</p>',
        '<p><b>Overlays.</b> The 12 fixed sectors are straight lines from the centre. The ":40 boundaries" show the path of the patch centre on this day and where it is at each :40 time, so you can watch the sectors open and close with the seasons. The "fixed sundial lines" are valid all year: equal hours fan out not from the centre but from where the line through the toono parallel to the Earth\'s axis meets the floor, near the door.</p>',
        '<p><b>Tradition.</b> Mongolian, Buryat, Tuvan and Kazakh sources describe telling the time by the light through the toono: light on the toono for Tiger–Rabbit, from the uni heads down to the wall head for Dragon–Snake, the khoimor at high noon for Horse. A four-wall ger with 60 uni is said to "match the sun clock exactly".</p>',
        '<p><b>Model limits.</b> Flat floor, vertical cylindrical wall, straight conical roof; the toono is an open horizontal disk with no thickness (crossbars, columns and stovepipe shadows are ignored). Solar position uses the NOAA/Meeus method (about one minute accuracy) without atmospheric refraction. Light through the door is not shown. Ger dimensions are approximate.</p>'
      ]
    }
  };

  // ------------------------------------------------------------- State ---
  const browserZone = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  const state = {
    lang: 'mn', t: Date.now(), playing: true, speed: 1,
    lat: 47.92, lon: 106.92, tz: 'Asia/Ulaanbaatar', place: 'ub',
    ger: { ...E.PRESETS[5] }, size: '5', doorAz: 180, urkh: 'full',
    ov: { wedges: true, uni: true, clock: true, temporal: false, seasons: false, labels: true, sundial: 'off' }
  };
  const tr = k => (T[state.lang][k] !== undefined ? T[state.lang][k] : (T.en[k] !== undefined ? T.en[k] : k));

  // --------------------------------------------------------- Language ---
  function setLanguage(next) {
    state.lang = next === 'en' ? 'en' : 'mn';
    document.documentElement.lang = state.lang;
    document.title = tr('title') + ' · Sol';
    $('lang').value = state.lang;
    document.querySelectorAll('[data-i]').forEach(e => { e.textContent = tr(e.dataset.i); });
    document.querySelectorAll('[data-i-label]').forEach(e => e.setAttribute('aria-label', tr(e.dataset.iLabel)));
    $('helpBody').innerHTML = tr('help').join('');
    $('play').textContent = state.playing ? tr('pause') : tr('play');
    fillPlaces(); fillZones();
    try { localStorage.setItem('sol-lang', state.lang); } catch (e) { /* storage unavailable */ }
    invalidate(); render();
  }

  function fillPlaces() {
    const sel = $('preset');
    sel.innerHTML = '';
    for (const p of PLACES) sel.add(new Option(p[state.lang], p.id));
    sel.add(new Option(tr('custom'), 'custom'));
    sel.value = state.place;
  }
  function fillZones() {
    const zones = [...new Set([browserZone, ...PLACES.map(p => p.tz), 'UTC', state.tz])].filter(E.validZone);
    const sel = $('zone');
    sel.innerHTML = '';
    for (const z of zones) {
      const off = E.tzOffsetMin(z, state.t);
      const label = `${z} (UTC${fmtOffset(off)})${z === browserZone ? ' — ' + tr('deviceZone') : ''}`;
      sel.add(new Option(label, z));
    }
    sel.value = state.tz;
  }

  // ------------------------------------------------------- Formatting ---
  const pad = n => String(n).padStart(2, '0');
  function fmtOffset(min) {
    const s = min < 0 ? '−' : '+', a = Math.abs(min);
    return `${s}${Math.floor(a / 60)}${a % 60 ? ':' + pad(a % 60) : ''}`;
  }
  const fmtHM = min => `${pad(Math.floor(E.mod(min, 1440) / 60))}:${pad(Math.floor(E.mod(min, 60)))}`;
  const animal = i => (i === null || i === undefined ? '—' : ANIMALS[state.lang][E.mod(i, 12)]);

  // ------------------------------------------------- Overlay geometry ---
  let cache = null;
  function invalidate() { cache = null; }
  function localDayKey() { const p = E.zoneParts(state.tz, state.t); return `${p.y}-${p.mo}-${p.d}`; }

  function overlays() {
    const key = JSON.stringify([state.lat, state.lon, state.tz, state.ger, state.doorAz, state.ov, localDayKey()]);
    if (cache && cache.key === key) return cache;
    const g = state.ger, out = { key };
    const p = E.zoneParts(state.tz, state.t);

    // Today's patch-centre path and :40 boundary ticks (clock of the chosen zone).
    if (state.ov.clock) {
      const start = E.zonedToUtc(state.tz, p.y, p.mo, p.d, 0, 0);
      const minutes = []; for (let m = 0; m <= 1440; m += 3) minutes.push(m);
      out.today = E.sweep(minutes, m => {
        const st = E.sunState(start + m * 60000, state.lat, state.lon);
        return st.alt > 0 ? E.traceCentre(st.s, g) : null;
      });
      out.ticks = [];
      for (let k = 0; k < 12; k++) {
        const h = 1 + 2 * k;
        const ms = E.zonedToUtc(state.tz, p.y, p.mo, p.d, h, 40);
        const st = E.sunState(ms, state.lat, state.lon);
        if (st.alt <= 0) continue;
        const c = E.traceCentre(st.s, g);
        if (c) out.ticks.push({ c, label: `${h}:40` });
      }
    }
    if (state.ov.sundial !== 'off') {
      out.sundial = [];
      for (let k = 0; k < 12; k++) {
        let H, label;
        if (state.ov.sundial === 'solar') { H = -165 + 30 * k; label = `${1 + 2 * k}:00`; }
        else {
          const off = E.tzOffsetMin(state.tz, state.t) / 60;
          const lmt = (1 + 2 * k) + 40 / 60 + state.lon / 15 - off;
          H = E.mod(15 * (lmt - 12) + 180, 360) - 180;
          label = `${1 + 2 * k}:40`;
        }
        for (const line of E.hourLine(state.lat, H, g)) out.sundial.push({ line, label });
      }
    }
    if (state.ov.temporal) {
      out.temporal = [];
      for (let j = 1; j <= 5; j++) out.temporal.push(...E.temporalLine(state.lat, j, g));
    }
    if (state.ov.seasons) {
      out.seasons = [];
      for (const dd of [E.OBLIQUITY, 0, -E.OBLIQUITY]) out.seasons.push(...E.declinationPath(state.lat, dd * D2R, g));
    }
    cache = out;
    return out;
  }

  // ---------------------------------------------------------- Drawing ---
  const canvas = $('ger'), ctx = canvas.getContext('2d');
  let cssSize = 600;
  function resize() {
    const w = canvas.parentElement.clientWidth - 12;
    cssSize = Math.max(260, Math.min(760, w));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    canvas.style.height = cssSize + 'px';
    canvas.style.width = cssSize + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function render() {
    const g = state.ger, S = cssSize, cx = S / 2, cy = S / 2;
    const NM = E.netMax(g);
    const fontPx = Math.max(11, Math.round(S / 46));
    ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
    const maxName = Math.max(...ANIMALS[state.lang].map(a => ctx.measureText(a).width));
    const labelBand = Math.max(fontPx * 1.6, maxName * 0.62 + 10);
    const sc = (S / 2 - labelBand - 4) / NM;
    const P = (rho, az) => [cx + sc * rho * Math.sin(az), cy - sc * rho * Math.cos(az)];
    const PN = n => P(n.rho, n.az);
    const rot = (state.doorAz - 180) * D2R;
    const st = E.sunState(state.t, state.lat, state.lon);
    const ov = overlays();

    ctx.clearRect(0, 0, S, S);
    // Surfaces: wall folded outward as a ring, floor disk; roof drawn in plan.
    ctx.beginPath(); ctx.arc(cx, cy, sc * NM, 0, 2 * Math.PI); ctx.fillStyle = '#eadbc0'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, sc * g.R, 0, 2 * Math.PI); ctx.fillStyle = '#f7efdf'; ctx.fill();
    // Door on the wall ring.
    const doorHalf = Math.asin(Math.min(0.9, 0.42 / g.R));
    const doorTop = g.R + Math.min(g.wallH * 0.92, 1.35);
    const da = state.doorAz * D2R;
    ctx.beginPath();
    ctx.arc(cx, cy, sc * doorTop, da - doorHalf - Math.PI / 2, da + doorHalf - Math.PI / 2);
    ctx.arc(cx, cy, sc * g.R, da + doorHalf - Math.PI / 2, da - doorHalf - Math.PI / 2, true);
    ctx.closePath(); ctx.fillStyle = '#9b6a43'; ctx.fill();
    // Hearth.
    ctx.fillStyle = 'rgba(125,106,88,0.5)'; const hs = sc * 0.22; ctx.fillRect(cx - hs, cy - hs, 2 * hs, 2 * hs);
    // Roof in plan: uni from the toono ring to the wall head.
    if (state.ov.uni) {
      ctx.strokeStyle = 'rgba(120,85,50,0.42)'; ctx.lineWidth = 0.7; ctx.beginPath();
      for (let i = 0; i < g.uni; i++) {
        const a = rot + Math.PI + (i + 0.5) * 2 * Math.PI / g.uni;
        const [x0, y0] = P(g.toonoR, a), [x1, y1] = P(g.R, a);
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      }
      ctx.stroke();
    }
    // Ring outlines and toono.
    ctx.strokeStyle = '#a58a66'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, sc * NM, 0, 2 * Math.PI); ctx.stroke();
    ctx.strokeStyle = '#6b4f33'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, sc * g.R, 0, 2 * Math.PI); ctx.stroke();
    ctx.strokeStyle = '#5b3d22'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, sc * g.toonoR, 0, 2 * Math.PI); ctx.stroke();

    ctx.font = `${fontPx}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // Labels of ger parts and compass.
    if (state.ov.labels) {
      ctx.fillStyle = '#6a5236';
      const la = rot + 205 * D2R;
      const lbl = (rho, key, ang = la) => { const [x, y] = P(rho, ang); ctx.fillText(tr(key), x, y); };
      lbl(g.R + g.wallH / 2, 'lblWall');
      lbl((g.toonoR + g.R) / 2, 'lblRoof', rot + 155 * D2R);
      lbl(g.R * 0.72, 'lblKhoimor', rot);
      ctx.fillStyle = '#fff6e8'; lbl((g.R + doorTop) / 2, 'lblDoor', da);
      ctx.fillStyle = '#5b3d22'; lbl(g.toonoR + 0.38, 'lblToono', rot + 232 * D2R);
      ctx.fillStyle = '#8a7358';
      tr('compass').forEach((c, i) => { const [x, y] = P(g.R - 0.2, i * Math.PI / 2 + 0.13); ctx.fillText(c, x, y); });
    }

    // Fixed 12 sectors.
    if (state.ov.wedges) {
      ctx.strokeStyle = 'rgba(70,50,30,0.55)'; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath();
      for (let k = 0; k < 12; k++) {
        const a = rot + (15 + 30 * k) * D2R; const [x, y] = P(NM, a);
        ctx.moveTo(cx, cy); ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // Animal names around the outside (by where the light patch falls).
    ctx.fillStyle = '#3b2a1a'; ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
    for (let k = 0; k < 12; k++) {
      const a = rot + 30 * k * D2R;
      const rr = NM + (labelBand * 0.55) / sc;
      const [x, y] = P(rr, a);
      ctx.fillText(animal(E.mod(6 + k, 12)), x, y);
    }
    ctx.font = `${fontPx}px system-ui, sans-serif`;

    const poly = (pts, close) => { ctx.beginPath(); pts.forEach((n, i) => { const [x, y] = PN(n); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); if (close) ctx.closePath(); };
    // Stroke a polyline; parts on the roof (shown in plan) are drawn thinner and dashed.
    const strokeLine = (pts, dash) => {
      const onRoof = pts[0].surf === 'roof';
      ctx.save();
      if (onRoof) { ctx.lineWidth *= 0.7; ctx.setLineDash([3, 3]); } else ctx.setLineDash(dash || []);
      poly(pts); ctx.stroke(); ctx.restore();
    };
    // Season paths.
    if (ov.seasons) { ctx.strokeStyle = '#7d7d7d'; ctx.lineWidth = 1.2; for (const l of ov.seasons) strokeLine(l, [2, 4]); }
    // Temporal lines.
    if (ov.temporal) { ctx.strokeStyle = '#2c8a4f'; ctx.lineWidth = 1.6; for (const l of ov.temporal) strokeLine(l, [7, 5]); }
    // Sundial lines.
    if (ov.sundial) {
      ctx.strokeStyle = '#b02a6b'; ctx.lineWidth = 1.6; ctx.setLineDash([]);
      ctx.fillStyle = '#b02a6b';
      for (const { line, label } of ov.sundial) {
        strokeLine(line);
        if (line[0].surf === 'roof') continue;
        const end = line.reduce((a, b) => (b.rho > a.rho ? b : a));
        const [x, y] = PN(end); ctx.fillText(label, x + 2, y - 8);
      }
    }
    // Today's path and :40 ticks with moving sector rays.
    if (ov.today) {
      ctx.strokeStyle = '#1f6fb2'; ctx.lineWidth = 1.6; ctx.setLineDash([]);
      for (const l of ov.today) strokeLine(l);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = 'rgba(31,111,178,0.6)'; ctx.lineWidth = 1;
      for (const tk of ov.ticks) { const [x, y] = P(NM, tk.c.az); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); }
      ctx.setLineDash([]);
      for (const tk of ov.ticks) {
        const [x, y] = PN(tk.c);
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fillStyle = '#1f6fb2'; ctx.fill();
        ctx.fillStyle = '#0f3d66'; ctx.fillText(tk.label, x, y - fontPx * 0.9);
      }
    }
    ctx.setLineDash([]);

    // Light patch: floor and wall solid, roof (seen in plan) hatched.
    let lightOn = null;
    if (st.alt > 0) {
      const polys = E.patch(st.s, g, state.urkh, state.doorAz);
      if (polys) {
        polys.sort((a, b) => (a.surf === 'roof') - (b.surf === 'roof'));
        for (const q of polys) {
          poly(q.pts, true);
          if (q.surf === 'roof') {
            ctx.fillStyle = 'rgba(255,150,30,0.55)'; ctx.fill();
            ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(160,70,0,0.75)'; ctx.lineWidth = 1;
            ctx.beginPath(); for (let k = -S; k < S; k += 6) { ctx.moveTo(k, 0); ctx.lineTo(k + S, S); } ctx.stroke(); ctx.restore();
            poly(q.pts, true); ctx.strokeStyle = '#b35a00'; ctx.lineWidth = 1.3; ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(255,201,58,0.9)'; ctx.fill();
            ctx.strokeStyle = '#d97a00'; ctx.lineWidth = 1.5; ctx.stroke();
          }
        }
        const c = E.traceCentre(st.s, g);
        if (c) { const [x, y] = PN(c); ctx.beginPath(); ctx.arc(x, y, 3, 0, 2 * Math.PI); ctx.fillStyle = '#7a3500'; ctx.fill(); lightOn = c.surf; }
      }
    } else {
      ctx.beginPath(); ctx.arc(cx, cy, sc * NM, 0, 2 * Math.PI); ctx.fillStyle = 'rgba(30,40,70,0.28)'; ctx.fill();
    }
    renderReadout(st, lightOn);
    renderLegend();
  }

  function renderLegend() {
    const items = [['patch', '', 'lgPatch'], ['roofpatch', '', 'lgRoofPatch']];
    if (state.ov.wedges) items.push(['line', 'border-color:rgba(70,50,30,.7)', 'lgWedge']);
    if (state.ov.clock) items.push(['line', 'border-color:#1f6fb2', 'lgToday'], ['line', 'border-top-style:dashed;border-color:#1f6fb2', 'lgClock']);
    if (state.ov.sundial !== 'off') items.push(['line', 'border-color:#b02a6b', 'lgSundial']);
    if (state.ov.temporal) items.push(['line', 'border-top-style:dashed;border-color:#2c8a4f', 'lgTemporal']);
    if (state.ov.seasons) items.push(['line', 'border-top-style:dotted;border-color:#7d7d7d', 'lgSeasons']);
    $('legend').innerHTML = items.map(([k, style, key]) =>
      `<span><i class="${k === 'line' ? '' : k}" style="${style}"></i>${tr(key)}</span>`).join('');
  }

  function renderReadout(st, lightOn) {
    const p = E.zoneParts(state.tz, state.t);
    const off = E.tzOffsetMin(state.tz, state.t);
    const clockMin = p.h * 60 + p.mi;
    const rot = state.doorAz - 180;
    const hDir = E.directionHour(st.az, rot);
    const hTemp = E.temporalHour(state.lat, st.decl, st.H);
    const eot = st.eot;
    const rows = [
      [tr('rClock'), `${p.y}-${pad(p.mo)}-${pad(p.d)} ${pad(p.h)}:${pad(p.mi)} (UTC${fmtOffset(off)})`],
      [tr('rSolar'), `${fmtHM(st.ast)} (${tr('rEot')} ${eot >= 0 ? '+' : '−'}${Math.abs(eot).toFixed(1)} min)`],
      [tr('rSun'), `${st.alt.toFixed(1)}° / ${st.az.toFixed(1)}°`],
      [tr('rLight'), st.alt > 0 ? tr(lightOn || 'none') : '—']
    ];
    const hours = [
      [tr('h40'), E.clockHour(clockMin)],
      [tr('hSolar'), E.solarHour(st.ast)],
      [tr('hDir'), hDir],
      [tr('hTemp'), hTemp]
    ];
    $('readout').innerHTML =
      `<dl>${rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>` +
      (st.alt > 0 ? '' : `<p class="night">${tr('night')}</p>`) +
      `<h3>${tr('rHours')}</h3><table class="hours"><tbody>${hours.map(([a, i]) =>
        `<tr><td>${a}</td><td>${i === null ? tr('polar') : animal(i)}</td></tr>`).join('')}</tbody></table>`;
    syncDatetimeInput(p);
  }

  function syncDatetimeInput(p) {
    const el = $('datetime');
    if (document.activeElement === el) return;
    el.value = `${p.y}-${pad(p.mo)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}`;
  }

  // --------------------------------------------------------- Controls ---
  function setError(msg) { $('error').textContent = msg || ''; }

  function applyPlaceInputs() {
    const lat = parseFloat($('lat').value), lon = parseFloat($('lon').value);
    if (!(lat >= -89 && lat <= 89 && lon >= -180 && lon <= 180)) { setError(tr('badPlace')); return; }
    setError(''); state.lat = lat; state.lon = lon; invalidate(); render();
  }
  function showPlace() { $('lat').value = state.lat; $('lon').value = state.lon; }

  function showGer() {
    const g = state.ger;
    $('diam').value = +(2 * g.R).toFixed(2); $('wallH').value = g.wallH; $('toonoH').value = g.toonoH;
    $('toonoD').value = +(2 * g.toonoR).toFixed(2); $('uniCount').value = g.uni;
  }
  function applyGerInputs() {
    const g = {
      ...state.ger,
      R: parseFloat($('diam').value) / 2, wallH: parseFloat($('wallH').value),
      toonoH: parseFloat($('toonoH').value), toonoR: parseFloat($('toonoD').value) / 2,
      uni: Math.round(parseFloat($('uniCount').value))
    };
    const errs = E.validateGer(g);
    if (errs.length) { setError(tr('badGer') + errs.map(k => tr({ R: 'diam', toonoR: 'toonoD', uni: 'uniCount' }[k] || k)).join(', ')); return; }
    setError(''); state.ger = g; invalidate(); resizeLabelsSafe();
  }
  function resizeLabelsSafe() { render(); }

  function setTime(ms) { if (Number.isFinite(ms)) { state.t = ms; render(); } }
  function setPlaying(on) {
    state.playing = on;
    $('play').textContent = on ? tr('pause') : tr('play');
    $('play').setAttribute('aria-pressed', String(on));
    lastFrame = null; lastRender = 0;
    if (on) requestAnimationFrame(tick);
  }

  let lastFrame = null, lastRender = 0;
  function tick(now) {
    if (!state.playing) return;
    if (lastFrame !== null) {
      const dt = (now - lastFrame) / 1000;
      state.t += state.speed * dt * 1000;
    }
    lastFrame = now;
    const interval = Math.abs(state.speed) <= 1 ? 1000 : 0;   // real time: redraw each second
    if (now - lastRender >= interval) { lastRender = now; render(); }
    requestAnimationFrame(tick);
  }

  function bind() {
    $('lang').addEventListener('change', e => setLanguage(e.target.value));
    $('now').addEventListener('click', () => { $('speed').value = '1'; state.speed = 1; setTime(Date.now()); setPlaying(true); });
    $('play').addEventListener('click', () => setPlaying(!state.playing));
    const step = ms => () => setTime(state.t + ms);
    $('dayBack').addEventListener('click', step(-86400000));
    $('dayFwd').addEventListener('click', step(86400000));
    $('hourBack').addEventListener('click', step(-3600000));
    $('hourFwd').addEventListener('click', step(3600000));
    $('speed').addEventListener('change', e => { state.speed = parseFloat(e.target.value); lastFrame = null; });
    $('datetime').addEventListener('change', e => {
      const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(e.target.value);
      if (!m) { setError(tr('badTime')); return; }
      setError('');
      setTime(E.zonedToUtc(state.tz, +m[1], +m[2], +m[3], +m[4], +m[5]));
    });
    document.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => {
      const [mo, d] = b.dataset.jump.split('-').map(Number);
      const p = E.zoneParts(state.tz, state.t);
      setTime(E.zonedToUtc(state.tz, p.y, mo, d, p.h, p.mi));
    }));
    $('preset').addEventListener('change', e => {
      state.place = e.target.value;
      const pl = PLACES.find(x => x.id === state.place);
      if (pl) { state.lat = pl.lat; state.lon = pl.lon; state.tz = pl.tz; showPlace(); fillZones(); setError(''); invalidate(); render(); }
    });
    for (const id of ['lat', 'lon']) $(id).addEventListener('change', () => { state.place = 'custom'; $('preset').value = 'custom'; applyPlaceInputs(); });
    $('zone').addEventListener('change', e => { state.tz = e.target.value; invalidate(); render(); });
    $('geo').addEventListener('click', () => {
      if (!navigator.geolocation) { $('geoStatus').textContent = tr('geoFail'); return; }
      $('geoStatus').textContent = tr('geoBusy');
      navigator.geolocation.getCurrentPosition(pos => {
        state.lat = +pos.coords.latitude.toFixed(3); state.lon = +pos.coords.longitude.toFixed(3);
        state.tz = browserZone; state.place = 'custom';
        showPlace(); fillPlaces(); fillZones(); $('geoStatus').textContent = tr('geoOk'); invalidate(); render();
      }, () => { $('geoStatus').textContent = tr('geoFail'); }, { timeout: 15000, maximumAge: 600000 });
    });
    $('size').addEventListener('change', e => { state.size = e.target.value; state.ger = { ...E.PRESETS[e.target.value] }; showGer(); setError(''); invalidate(); render(); });
    for (const id of ['diam', 'wallH', 'toonoH', 'toonoD', 'uniCount']) $(id).addEventListener('change', applyGerInputs);
    $('door').addEventListener('change', e => {
      const v = parseFloat(e.target.value);
      if (!(v >= 0 && v < 360)) { e.target.value = state.doorAz; return; }
      state.doorAz = v; invalidate(); render();
    });
    $('urkh').addEventListener('change', e => { state.urkh = e.target.value; render(); });
    const ovMap = { ovWedges: 'wedges', ovUni: 'uni', ovClock: 'clock', ovTemporal: 'temporal', ovSeasons: 'seasons', ovLabels: 'labels' };
    for (const [id, k] of Object.entries(ovMap)) $(id).addEventListener('change', e => { state.ov[k] = e.target.checked; invalidate(); render(); });
    $('ovSundial').addEventListener('change', e => { state.ov.sundial = e.target.value; invalidate(); render(); });
    window.addEventListener('resize', resize);
  }

  // ------------------------------------------------------------- Init ---
  function init() {
    $('version').textContent = 'v' + E.VERSION + ' alpha';
    const params = new URLSearchParams(location.search);
    let saved = null; try { saved = localStorage.getItem('sol-lang'); } catch (e) { /* ignore */ }
    const requested = params.get('lang');
    state.lang = ['mn', 'en'].includes(requested) ? requested : (['mn', 'en'].includes(saved) ? saved : 'mn');
    showPlace(); showGer();
    bind();
    setLanguage(state.lang);
    resize();
    setPlaying(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
