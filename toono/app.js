/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
   SPDX-License-Identifier: MIT

   toono UI: state, controls, i18n and canvas rendering of the ger interior
   with the light patch from the toono. Computation is in engine.js. */
(function () {
  'use strict';
  const E = window.ToonoEngine;
  const $ = id => document.getElementById(id);
  const D2R = E.D2R;

  // Tool name lives here, in index.html <title>/<h1>, tools.json and the
  // Sol homepage card (see README "Renaming").
  const TOOL = { id: 'toono', title: { mn: 'Гэрийн наран цаг', en: 'Ger sun clock' } };

  const ANIMALS = {
    mn: ['Хулгана', 'Үхэр', 'Бар', 'Туулай', 'Луу', 'Могой', 'Морь', 'Хонь', 'Бич', 'Тахиа', 'Нохой', 'Гахай'],
    en: ['Mouse', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Rooster', 'Dog', 'Pig']
  };

  // Ulaanbaatar, the 21 aimag centres (sorted by name when listed), then
  // places outside Mongolia. 'short' is the name used in the heading.
  const PLACES = [
    { id: 'ub', lat: 47.92, lon: 106.92, tz: 'Asia/Ulaanbaatar', mn: 'Улаанбаатар', en: 'Ulaanbaatar' },
    { id: 'tsetserleg', lat: 47.47, lon: 101.45, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Цэцэрлэг (Архангай)', en: 'Tsetserleg (Arkhangai)', short: { mn: 'Цэцэрлэг', en: 'Tsetserleg' } },
    { id: 'ulgii', lat: 48.97, lon: 89.96, tz: 'Asia/Hovd', aimag: true, mn: 'Өлгий (Баян-Өлгий)', en: 'Ölgii (Bayan-Ölgii)', short: { mn: 'Өлгий', en: 'Ölgii' } },
    { id: 'bayankhongor', lat: 46.19, lon: 100.72, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Баянхонгор', en: 'Bayankhongor', short: { mn: 'Баянхонгор', en: 'Bayankhongor' } },
    { id: 'bulgan', lat: 48.81, lon: 103.53, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Булган', en: 'Bulgan', short: { mn: 'Булган', en: 'Bulgan' } },
    { id: 'altai', lat: 46.37, lon: 96.26, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Алтай (Говь-Алтай)', en: 'Altai (Govi-Altai)', short: { mn: 'Алтай', en: 'Altai' } },
    { id: 'choir', lat: 46.36, lon: 108.36, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Чойр (Говьсүмбэр)', en: 'Choir (Govisümber)', short: { mn: 'Чойр', en: 'Choir' } },
    { id: 'darkhan', lat: 49.48, lon: 105.92, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Дархан (Дархан-Уул)', en: 'Darkhan (Darkhan-Uul)', short: { mn: 'Дархан', en: 'Darkhan' } },
    { id: 'sainshand', lat: 44.89, lon: 110.14, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Сайншанд (Дорноговь)', en: 'Sainshand (Dornogovi)', short: { mn: 'Сайншанд', en: 'Sainshand' } },
    { id: 'choibalsan', lat: 48.07, lon: 114.53, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Чойбалсан (Дорнод)', en: 'Choibalsan (Dornod)', short: { mn: 'Чойбалсан', en: 'Choibalsan' } },
    { id: 'mandalgovi', lat: 45.76, lon: 106.27, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Мандалговь (Дундговь)', en: 'Mandalgovi (Dundgovi)', short: { mn: 'Мандалговь', en: 'Mandalgovi' } },
    { id: 'uliastai', lat: 47.74, lon: 96.84, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Улиастай (Завхан)', en: 'Uliastai (Zavkhan)', short: { mn: 'Улиастай', en: 'Uliastai' } },
    { id: 'erdenet', lat: 49.03, lon: 104.05, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Эрдэнэт (Орхон)', en: 'Erdenet (Orkhon)', short: { mn: 'Эрдэнэт', en: 'Erdenet' } },
    { id: 'arvaikheer', lat: 46.26, lon: 102.78, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Арвайхээр (Өвөрхангай)', en: 'Arvaikheer (Övörkhangai)', short: { mn: 'Арвайхээр', en: 'Arvaikheer' } },
    { id: 'dalanzadgad', lat: 43.57, lon: 104.43, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Даланзадгад (Өмнөговь)', en: 'Dalanzadgad (Ömnögovi)', short: { mn: 'Даланзадгад', en: 'Dalanzadgad' } },
    { id: 'baruunurt', lat: 46.68, lon: 113.28, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Баруун-Урт (Сүхбаатар)', en: 'Baruun-Urt (Sükhbaatar)', short: { mn: 'Баруун-Урт', en: 'Baruun-Urt' } },
    { id: 'sukhbaatar', lat: 50.23, lon: 106.21, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Сүхбаатар (Сэлэнгэ)', en: 'Sükhbaatar (Selenge)', short: { mn: 'Сүхбаатар', en: 'Sükhbaatar' } },
    { id: 'zuunmod', lat: 47.71, lon: 106.95, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Зуунмод (Төв)', en: 'Zuunmod (Töv)', short: { mn: 'Зуунмод', en: 'Zuunmod' } },
    { id: 'ulaangom', lat: 49.98, lon: 92.07, tz: 'Asia/Hovd', aimag: true, mn: 'Улаангом (Увс)', en: 'Ulaangom (Uvs)', short: { mn: 'Улаангом', en: 'Ulaangom' } },
    { id: 'khovd', lat: 48.01, lon: 91.64, tz: 'Asia/Hovd', aimag: true, mn: 'Ховд', en: 'Khovd', short: { mn: 'Ховд', en: 'Khovd' } },
    { id: 'murun', lat: 49.64, lon: 100.16, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Мөрөн (Хөвсгөл)', en: 'Mörön (Khövsgöl)', short: { mn: 'Мөрөн', en: 'Mörön' } },
    { id: 'chinggis', lat: 47.32, lon: 110.66, tz: 'Asia/Ulaanbaatar', aimag: true, mn: 'Чингис хот (Хэнтий)', en: 'Chinggis (Khentii)', short: { mn: 'Чингис хот', en: 'Chinggis' } },
    { id: 'hohhot', lat: 40.84, lon: 111.75, tz: 'Asia/Shanghai', mn: 'Хөх хот', en: 'Hohhot' },
    { id: 'ulanude', lat: 51.83, lon: 107.61, tz: 'Asia/Irkutsk', mn: 'Улаан-Үд', en: 'Ulan-Ude' },
    { id: 'lhasa', lat: 29.65, lon: 91.13, tz: 'Asia/Shanghai', mn: 'Лхас', en: 'Lhasa' },
    { id: 'montreal', lat: 45.50, lon: -73.57, tz: 'America/Toronto', mn: 'Монреал', en: 'Montreal' }
  ];


  const T = {
    mn: {
      title: TOOL.title.mn, hourWord: 'цаг', canvasLabel: 'Гэрийн дотор тусах нарны гэрэл',
      play: 'Явуулах', pause: 'Зогсоох', time: 'Цаг', date: 'Өдөр', now: 'Одоо',
      viewLabel: 'Харах', viewToono: 'Тоононоос', viewPlan: 'Дээрээс', speed: 'Хурд',
      spdM3600: '−1 цаг/сек', spd1: 'Бодит', spd60: '1 мин/сек', spd600: '10 мин/сек', spd3600: '1 цаг/сек',
      viewNoteToono: 'Тоононы голоос доош харсан мэт: голд шал, дараа нь хана, унь, гадна хүрээ нь тооно. Гэрэл тасралтгүй шилжинэ; тоононы ойролцоо хэсэг томорч харагдана.',
      viewNotePlan: 'Дээрээс харсан зураг: шал, унийг (дээврийг тунгалаг гэж) дээрээс, ханыг шалны эргэн тойронд дэлгэсэн. Унин дээрх гэрлийг зураасаар тэмдэглэв.',
      readings: 'Арван хоёр цаг — дөрвөн уншлага',
      h40: ':40 хуваарь', h40s: 'тогтсон цагаар (23:40, 01:40, …)',
      hSolar: 'Жинхэнэ нарны', hSolars: 'үд нь Морин цагийн дунд',
      hDir: 'Гэрийн зүг', hDirs: 'гэрэл аль хэсэгт буусан',
      hTemp: 'Нар мандахаас', hTemps: 'Туулай нар мандахад эхэлнэ',
      polar: 'туйлын өдөр/шөнө',
      sunUp: (alt, surf) => `Нар ${alt}° өндөрт · гэрэл ${surf} дээр`, sunDown: 'Нар жаргасан — гэрэл тусахгүй',
      floor: 'шал', wall: 'хана', roof: 'унь', mixed: 'унь, хана',
      monthDay: (mo, d) => `${mo}-р сарын ${d}`,
      placeTitle: 'Байршил', grpAimag: 'Аймгийн төв', grpAbroad: 'Гадаад', preset: 'Газар', custom: 'Бусад', zone: 'Цагийн бүс', deviceZone: 'төхөөрөмж',
      lat: 'Өргөрөг (°, хойд +)', lon: 'Уртраг (°, зүүн +)',
      useLocation: 'Миний байршил', geoBusy: 'Хайж байна…', geoFail: 'Байршил авч чадсангүй.', geoOk: 'Төхөөрөмжийн байршлыг ашиглав.',
      overlays: 'Нэмэлт шугам', ovUni: 'Унь', ovLabels: 'Гэрийн хэсгийн нэр', ovWedges: 'Гэрийн 12 тогтмол зүг', ovSectors: 'Энэ өдрийн :40 хуваарь (гэрт)', ovPath: 'Энэ өдрийн гэрлийн зам',
      ovTemporal: 'Энэ өдрийн нар мандахаас эхэлсэн хуваарь (гэрт)',
      ovSundial: 'Нарны цагийн шугам (жинхэнэ нарны цаг)',
      gerTitle: 'Гэр', size: 'Хэмжээ', size4: '4 ханатай', size5: '5 ханатай', size6: '6 ханатай',
      urkh: 'Өрх', urkhOpen: 'Нээлттэй', urkhHalf: 'Хагас нээлттэй', door: 'Хаалганы чиг (°)', uniCount: 'Унины тоо',
      diam: 'Шалны диаметр (м)', wallH: 'Ханын өндөр (м)', toonoH: 'Тоононы өндөр (м)', toonoD: 'Тоононы диаметр (м)',
      gerNote: 'Хэмжээнүүд ойролцоо; өөрийн гэрийнхээр засаж болно.',
      badPlace: 'Өргөрөг −89…89°, уртраг −180…180° байх ёстой.', badGer: 'Гэрийн хэмжээ буруу.',
      lgPatch: 'Нарны гэрэл', lgPatchPlan: 'Шал, хана дээрх гэрэл', lgRoofPatch: 'Унин дээрх гэрэл',
      lgToday: 'Гэрлийн зам', lgSectors: ':40 хил (энэ өдөр)', lgRiseSet: 'Нар мандах, жаргах', lgSundial: 'Нарны цагийн шугам',
      lgTemporal: 'Нар мандахаас эхэлсэн хил',
      lblWall: 'хана', lblRoof: 'унь', lblToono: 'тооно', lblKhoimor: 'хоймор', lblDoor: 'хаалга',
      compass: ['Х', 'З', 'У', 'Б'],
      helpTitle: 'Тайлбар',
      help: [
        '<p><b>Юуг харуулдаг вэ?</b> Тооно бол гэрийн оройн хэвтээ дугуй нүх. Нарны гэрэл түүгээр орж унь, хана, шалан дээр толбо болж, нар хөдлөхөд гэрийн дотор тойрон гүйнэ. Тооно цэг биш, өргөн дугуй тул нар намхан үед (өглөө эрт, орой) гэрэл унин дээр, тоононы эсрэг талд буудаг.</p>',
        '<p><b>Хоёр зураг.</b> <i>Тоононоос</i>: тоононы голоос доош харсан мэт — голд шал, түүнийг тойрон хана, унь, хамгийн гадна хүрээ нь тооно. Гэрэл үүрээр тоононы хүрээнд гарч, униар ханын толгой руу, ханаар доош, үд дунд хойморт хүрнэ — ардын «тоононд туссан гэрэл — Бар–Туулай, унины толгойноос ханын толгой — Луу–Могой, хойморт — Морь» гэсэнтэй ижил дараалал. Голоос зай нь нарны өндрийг заана (гадна хүрээ 0°, төв 90°). <i>Дээрээс</i>: хэлбэр, хэмжээ үнэн боловч унь ба ханан дээрх гэрэл тасарч харагдана.</p>',
        '<p><b>Дөрвөн уншлага.</b> (1) <i>:40 хуваарь</i> — толь бичгийн Хулгана 23:40–01:40, Морь 11:40–13:40 гэх мэт, сонгосон бүсийн цагаар. (2) <i>Жинхэнэ нарны</i> — Морин цагийн дунд нь жинхэнэ үд. (3) <i>Гэрийн зүг</i> — гэрийг 30°-ын 12 тогтмол хэсэгт хувааж, гэрэл аль хэсэгт буусныг (нар зүүн тийш байхад гэрэл баруун талд — Туулай); улирлаар урт нь өөрчлөгддөг тэгш бус цаг. (4) <i>Нар мандахаас</i> — өдөр, шөнийг тус бүр 6 хувааж, Туулай нар мандахад эхэлнэ гэсэн таамаглал.</p>',
        '<p><b>Нэмэлт шугам.</b> «Энэ өдрийн :40 хуваарь» нь нар мандахаас жаргах хүртэл :40 цаг бүрд гэрэл аль чигт байгааг гэрийн голоос татсан шугамаар харуулж, гэрийг тухайн өдрийн хэсгүүдэд хуваана (нар мандах, жаргах нь улбар шар). «Нар мандахаас эхэлсэн хуваарь» нь өдрийн гэгээтэй хугацааг 6 тэнцүү хувааж, Туулайг нар мандахад эхлүүлсэн хэсгүүд (ногоон). Өдрийн гулсуурыг хөдөлгөхөд хэсгүүд улирлаар хэрхэн нээгдэж, хумигдахыг (нарны хурд) харж, тогтмол 12 зүгтэй харьцуулж болно. «Энэ өдрийн гэрлийн зам» дээр унь ба ханын толгой нэг цэг байх үед цэгэн шугамаар холбосон. «Нарны цагийн шугам» жинхэнэ нарны хоёр цагийн хилийг жилийн турш харуулна: шалан дээр тэд гэрийн голоос биш, тоононоос дэлхийн тэнхлэгтэй параллель татсан шугам шалтай огтлолцох цэгээс (хаалганы ойролцоо, ягаан цэг) шулуунаар салаална. «Дээрээс» зураг дээр шугамууд ханаар ханын толгой хүртэл, «Тоононоос» зураг дээр хана, униар тооно хүртэл үргэлжилнэ.</p>',
        '<p><b>Загварын хязгаар.</b> Тэгш шал, босоо цилиндр хана, шулуун конус дээвэр; тооно нь зузаангүй нээлттэй дугуй (хөндлөвч, багана, яндангийн сүүдэр тооцоогүй). Нарны байрлал NOAA/Meeus аргаар (~1 минут), агаар мандлын хугарлыг тооцоогүй. Хаалгаар орох гэрэл харуулаагүй. Хэмжээнүүд ойролцоо.</p>'
      ]
    },
    en: {
      title: TOOL.title.en, hourWord: 'hour', canvasLabel: 'Sunlight through the toono inside a ger',
      play: 'Play', pause: 'Pause', time: 'Time', date: 'Day', now: 'Now',
      viewLabel: 'View', viewToono: 'From the toono', viewPlan: 'From above', speed: 'Speed',
      spdM3600: '−1 h/s', spd1: 'Real time', spd60: '1 min/s', spd600: '10 min/s', spd3600: '1 h/s',
      viewNoteToono: 'As if looking down from the centre of the toono: floor in the middle, then the wall, the roof poles (uni), and the toono rim as the outer circle. The light moves without breaks; the area near the toono is enlarged.',
      viewNotePlan: 'Plan from above: floor and roof poles seen from above (roof treated as transparent), wall unfolded around the floor. Light on the roof poles is hatched.',
      readings: 'The twelve hours — four readings',
      h40: ':40 convention', h40s: 'fixed clock times (23:40, 01:40, …)',
      hSolar: 'True solar', hSolars: 'noon in the middle of Horse',
      hDir: 'Ger direction', hDirs: 'where the light falls',
      hTemp: 'From sunrise', hTemps: 'Rabbit begins at sunrise',
      polar: 'polar day/night',
      sunUp: (alt, surf) => `Sun ${alt}° high · light on the ${surf}`, sunDown: 'Sun is down — no light',
      floor: 'floor', wall: 'wall', roof: 'roof poles', mixed: 'roof poles and wall',
      monthDay: (mo, d) => `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mo - 1]} ${d}`,
      placeTitle: 'Location', grpAimag: 'Aimag centres', grpAbroad: 'Abroad', preset: 'Place', custom: 'Other', zone: 'Time zone', deviceZone: 'device',
      lat: 'Latitude (°, north +)', lon: 'Longitude (°, east +)',
      useLocation: 'My location', geoBusy: 'Locating…', geoFail: 'Could not get location.', geoOk: 'Using the device location.',
      overlays: 'Extra lines', ovUni: 'Roof poles (uni)', ovLabels: 'Names of ger parts', ovWedges: '12 fixed ger sectors', ovSectors: "Today's :40 sectors in the ger", ovPath: "Today's path of the light",
      ovTemporal: "Today's sunrise-based sectors in the ger",
      ovSundial: 'Sundial lines (true solar time)',
      gerTitle: 'Ger', size: 'Size', size4: '4 lattice walls', size5: '5 lattice walls', size6: '6 lattice walls',
      urkh: 'Roof flap (urkh)', urkhOpen: 'Open', urkhHalf: 'Half open', door: 'Door direction (°)', uniCount: 'Number of uni',
      diam: 'Floor diameter (m)', wallH: 'Wall height (m)', toonoH: 'Toono height (m)', toonoD: 'Toono diameter (m)',
      gerNote: 'Approximate dimensions; adjust to a real ger.',
      badPlace: 'Latitude must be −89…89° and longitude −180…180°.', badGer: 'Invalid ger dimensions.',
      lgPatch: 'Sunlight', lgPatchPlan: 'Light on floor or wall', lgRoofPatch: 'Light on roof poles',
      lgToday: 'Path of the light', lgSectors: ':40 boundaries (this day)', lgRiseSet: 'Sunrise, sunset', lgSundial: 'Sundial lines',
      lgTemporal: 'Sunrise-based boundaries',
      lblWall: 'wall', lblRoof: 'uni', lblToono: 'toono', lblKhoimor: 'khoimor', lblDoor: 'door',
      compass: ['N', 'E', 'S', 'W'],
      helpTitle: 'Explanation',
      help: [
        '<p><b>What it shows.</b> The toono is the round opening at the top of a ger. Sunlight passes through it and makes a bright patch on the roof poles (uni), wall and floor, which travels around the inside as the Sun moves. Because the toono is a wide disk, not a point, a low Sun (early morning, evening) puts the light on the uni opposite the Sun.</p>',
        '<p><b>Two pictures.</b> <i>From the toono</i>: as if looking down from the centre of the toono: floor in the middle, then the wall, the uni, and the toono rim as the outer circle. At sunrise the light appears at the rim, slides down the uni to the wall head, down the wall, and reaches the khoimor at noon, the same sequence as the folk description (light on the toono for Tiger–Rabbit, uni heads to wall head for Dragon–Snake, khoimor for Horse). Distance from the centre shows the Sun\'s altitude (outer circle 0°, centre 90°). <i>From above</i>: true shapes and sizes, but the light breaks between the uni and the wall.</p>',
        '<p><b>Four readings.</b> (1) <i>:40 convention</i>: Mouse 23:40–01:40, Horse 11:40–13:40 and so on, as in Mongolian dictionaries, on the chosen zone\'s clock. (2) <i>True solar</i>: Horse centred on true noon. (3) <i>Ger direction</i>: twelve fixed 30° sectors of the ger, read by where the light falls (Sun in the east puts the light in the west: Rabbit); unequal, seasonal hours. (4) <i>From sunrise</i>: daylight and night each split into six, with Rabbit beginning at sunrise (a hypothesis).</p>',
        '<p><b>Extra lines.</b> "Today\'s :40 sectors" draws, from sunrise to sunset, a line from the centre in the direction of the light at each :40 time, dividing the ger into this day\'s sectors (sunrise and sunset in orange). "Sunrise-based sectors" split the daylight into six equal parts with Rabbit beginning at sunrise (green). Moving the day slider shows how the sectors open and close with the seasons (the Sun\'s speed across the ger), for comparison with the twelve fixed sectors. On "Today\'s path of the light", where the light passes from the uni to the wall the same position appears twice in the plan view; a dotted line joins the two. "Sundial lines" show the true solar double-hour boundaries for the whole year: on the floor they are straight lines fanning out not from the centre but from where the line through the toono parallel to the Earth\'s axis meets the floor (near the door, magenta dot). In the plan view they continue up the wall to the wall head; in the "From the toono" view, over the wall and uni to the toono.</p>',
        '<p><b>Model limits.</b> Flat floor, vertical cylindrical wall, straight conical roof; the toono is a thin open disk (crossbars, columns and stovepipe shadows ignored). Solar position from the NOAA/Meeus formulae (about a minute), no refraction. Light through the door is not shown. Dimensions are approximate.</p>'
      ]
    }
  };

  // ------------------------------------------------------------- State ---
  const browserZone = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  const state = {
    lang: 'mn', view: 'plan', t: Date.now(), live: true, playing: false, speed: 600,
    lat: 47.92, lon: 106.92, tz: 'Asia/Ulaanbaatar', place: 'ub',
    ger: { ...E.PRESETS[5] }, doorAz: 180, urkh: 'full',
    ov: { uni: true, labels: true, wedges: true, sectors: false, temporal: false, path: false, sundial: false }
  };
  const tr = k => (T[state.lang][k] !== undefined ? T[state.lang][k] : (T.en[k] !== undefined ? T.en[k] : k));
  const pad = n => String(n).padStart(2, '0');
  const animal = i => (i === null || i === undefined ? '—' : ANIMALS[state.lang][E.mod(i, 12)]);
  const placeName = () => { const p = PLACES.find(x => x.id === state.place); return p ? (p.short ? p.short[state.lang] : p[state.lang]) : `${state.lat.toFixed(2)}°, ${state.lon.toFixed(2)}°`; };

  // --------------------------------------------------------- Language ---
  function setLanguage(next) {
    state.lang = next === 'en' ? 'en' : 'mn';
    document.documentElement.lang = state.lang;
    document.title = tr('title') + ' · Sol';
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    document.querySelectorAll('[data-i]').forEach(e => { e.textContent = tr(e.dataset.i); });
    document.querySelectorAll('[data-i-label]').forEach(e => e.setAttribute('aria-label', tr(e.dataset.iLabel)));
    $('helpBody').innerHTML = tr('help').join('');
    fillPlaces(); fillZones(); updatePlayButton();
    try { localStorage.setItem('sol-lang', state.lang); } catch (e) { /* storage unavailable */ }
    invalidate(); render();
  }
  function setView(v) {
    state.view = v === 'plan' ? 'plan' : 'toono';
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    invalidate(); render();
  }

  function fillPlaces() {
    const sel = $('preset'); sel.innerHTML = '';
    const group = label => { const g = document.createElement('optgroup'); g.label = label; sel.appendChild(g); return g; };
    const opt = (parent, p) => parent.appendChild(new Option(p[state.lang], p.id));
    opt(sel, PLACES[0]);
    const aim = group(tr('grpAimag')), abroad = group(tr('grpAbroad'));
    PLACES.filter(p => p.aimag).sort((x, y) => x[state.lang].localeCompare(y[state.lang], state.lang)).forEach(p => opt(aim, p));
    PLACES.slice(1).filter(p => !p.aimag).forEach(p => opt(abroad, p));
    sel.add(new Option(tr('custom'), 'custom'));
    sel.value = state.place;
  }
  function fmtOffset(min) {
    const s = min < 0 ? '−' : '+', a = Math.abs(min);
    return `${s}${Math.floor(a / 60)}${a % 60 ? ':' + pad(a % 60) : ''}`;
  }
  function fillZones() {
    const zones = [...new Set([browserZone, ...PLACES.map(p => p.tz), 'UTC', state.tz])].filter(E.validZone);
    const sel = $('zone'); sel.innerHTML = '';
    for (const z of zones) {
      const label = `${z.replace('_', ' ')} (UTC${fmtOffset(E.tzOffsetMin(z, state.t))})${z === browserZone ? ' · ' + tr('deviceZone') : ''}`;
      sel.add(new Option(label, z));
    }
    sel.value = state.tz;
  }

  // ------------------------------------------------- Overlay geometry ---
  let cache = null;
  function invalidate() { cache = null; }
  function localParts() { return E.zoneParts(state.tz, state.t); }

  function overlays() {
    const p = localParts();
    const key = JSON.stringify([state.lat, state.lon, state.tz, state.ger, state.view, state.ov, p.y, p.mo, p.d]);
    if (cache && cache.key === key) return cache;
    const g = state.ger, v = state.view, out = { key };
    const dayStart = E.zonedToUtc(state.tz, p.y, p.mo, p.d, 0, 0);
    if (state.ov.path) {
      const minutes = []; for (let m = 0; m <= 1440; m += 3) minutes.push(m);
      out.today = E.sweep(minutes, m => {
        const st = E.sunState(dayStart + m * 60000, state.lat, state.lon);
        return st.alt > 0 ? E.traceCentre(st.s, g, v) : null;
      });
    }
    if (state.ov.sectors || state.ov.temporal) {
      // Season-dependent sectors centred on the ger: the direction of the
      // light at a list of instants during this day's daylight.
      const ev = E.sunEvents(dayStart, state.lat, state.lon);
      const dirOf = t => (E.sunState(t, state.lat, state.lon).az + 180) * D2R;
      const build = marks => {
        const lit = marks.filter(m => m.kind !== 'b' || E.sunState(m.t, state.lat, state.lon).alt > 0)
          .sort((a, b) => a.t - b.t).map(m => ({ ...m, az: dirOf(m.t) }));
        const names = [];
        for (let i = 0; i + 1 < lit.length; i++) {
          const span = E.mod(lit[i + 1].az - lit[i].az, 2 * Math.PI);
          names.push({ az: lit[i].az + span / 2, span, idx: lit[i].next });
        }
        return { marks: lit, names };
      };
      if (state.ov.sectors) {
        const marks = [];
        if (ev.rise !== null) marks.push({ t: ev.rise, kind: 'rise' });
        for (let k = 0; k < 12; k++) {
          const h = (1 + 2 * k) % 24;
          marks.push({ t: E.zonedToUtc(state.tz, p.y, p.mo, p.d, h, 40), kind: 'b' });
        }
        if (ev.set !== null) marks.push({ t: ev.set, kind: 'set' });
        for (const m of marks) { const q = E.zoneParts(state.tz, m.t + 60000); m.next = E.clockHour(q.h * 60 + q.mi); }
        out.sectors = build(marks);
      }
      if (state.ov.temporal && ev.rise !== null && ev.set !== null && ev.set > ev.rise) {
        // Daylight split into six equal parts, Rabbit beginning at sunrise.
        const marks = [];
        for (let j = 0; j <= 6; j++) marks.push({ t: ev.rise + j * (ev.set - ev.rise) / 6, kind: j === 0 ? 'rise' : j === 6 ? 'set' : 't', next: E.RABBIT + j });
        out.temporal = build(marks);
      }
    }
    if (state.ov.sundial) {
      // True solar double-hour boundaries (Horse centred on noon): the hour
      // planes through the toono. On the floor they are straight lines from
      // the polar-axis foot near the door; they continue up the wall to the
      // wall head (plan view) or over the uni to the toono (toono view).
      out.sundial = [];
      for (let k = 0; k < 12; k++) {
        const H = -165 + 30 * k, label = `${1 + 2 * k}:00`;
        // Only hours the Sun can be up at in some season (no night hours).
        let up = false;
        for (let dd = -E.OBLIQUITY; dd <= E.OBLIQUITY && !up; dd += 0.5) up = E.sunVector(state.lat * E.D2R, H * E.D2R, dd * E.D2R)[2] > 0;
        if (!up) continue;
        const lines = E.sundialLine(state.lat, H, g, v, v === 'plan');
        const pts = lines.flat();
        if (!pts.length) continue;
        const end = pts.reduce((a, b) => (b.rho > a.rho ? b : a));
        out.sundial.push({ label, lines, end });
      }
      const fl = E.floorHourLine(state.lat, 0, g);
      if (fl && fl.footOnFloor) {
        const L = E.layout(g, v), [x, y] = fl.F;
        out.foot = { rho: L.rho('floor', x, y, 0), az: Math.atan2(x, y), surf: 'floor' };
      }
    }
    cache = out;
    return out;
  }

  // ---------------------------------------------------------- Drawing ---
  const canvas = $('ger'), ctx = canvas.getContext('2d');
  let cssSize = 560;
  function resize() {
    const w = canvas.parentElement.clientWidth - 8;
    cssSize = Math.max(260, Math.min(640, w, Math.round(window.innerHeight * 0.62)));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssSize * dpr); canvas.height = Math.round(cssSize * dpr);
    canvas.style.width = cssSize + 'px'; canvas.style.height = cssSize + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function render() {
    const g = state.ger, S = cssSize, cx = S / 2, cy = S / 2;
    const L = E.layout(g, state.view), M = L.max;
    const fontPx = Math.max(11, Math.round(S / 44));
    ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
    const maxName = Math.max(...ANIMALS[state.lang].map(a => ctx.measureText(a).width));
    const band = Math.max(fontPx * 1.6, maxName * 0.62 + 12);
    const sc = (S / 2 - band - 4) / M;
    const P = (rho, az) => [cx + sc * rho * Math.sin(az), cy - sc * rho * Math.cos(az)];
    const PN = n => P(n.rho, n.az);
    const rot = (state.doorAz - 180) * D2R, da = state.doorAz * D2R;
    const st = E.sunState(state.t, state.lat, state.lon);
    const ov = overlays();
    const disk = (r, fill) => { ctx.beginPath(); ctx.arc(cx, cy, sc * r, 0, 2 * Math.PI); ctx.fillStyle = fill; ctx.fill(); };
    const circle = (r, color, w) => { ctx.beginPath(); ctx.arc(cx, cy, sc * r, 0, 2 * Math.PI); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke(); };
    const spoke = (r0, r1, a) => { const [x0, y0] = P(r0, a), [x1, y1] = P(r1, a); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); };

    ctx.clearRect(0, 0, S, S);
    const toonoView = state.view === 'toono';
    // Surfaces.
    if (toonoView) disk(M, '#e5d3b3');
    disk(L.wallHead, '#eadbc0');
    disk(L.floorEdge, '#f7efdf');
    // Door on the wall.
    const doorHalf = Math.asin(Math.min(0.9, 0.42 / g.R));
    const dr0 = L.wallRho(0), dr1 = L.wallRho(Math.min(g.wallH * 0.92, 1.35));
    ctx.beginPath();
    ctx.arc(cx, cy, sc * dr1, da - doorHalf - Math.PI / 2, da + doorHalf - Math.PI / 2);
    ctx.arc(cx, cy, sc * dr0, da + doorHalf - Math.PI / 2, da - doorHalf - Math.PI / 2, true);
    ctx.closePath(); ctx.fillStyle = '#9b6a43'; ctx.fill();
    // Uni.
    if (state.ov.uni) {
      ctx.strokeStyle = 'rgba(120,85,50,0.38)'; ctx.lineWidth = 0.7; ctx.beginPath();
      for (let i = 0; i < g.uni; i++) {
        const a = rot + Math.PI + (i + 0.5) * 2 * Math.PI / g.uni;
        if (toonoView) spoke(L.wallHead, M, a); else spoke(g.toonoR, g.R, a);
      }
      ctx.stroke();
    }
    circle(L.floorEdge, '#8c7050', 1.2);
    circle(L.wallHead, '#8c7050', 1.2);
    if (toonoView) circle(M, '#5b3d22', 3); else circle(g.toonoR, '#5b3d22', 2.5);

    // Labels of ger parts, quiet.
    ctx.font = `${fontPx}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lbl = (rho, key, a, color = '#7a6347') => { const [x, y] = P(rho, a); ctx.fillStyle = color; ctx.fillText(tr(key), x, y); };
    if (state.ov.labels) {
      lbl((L.floorEdge + L.wallHead) / 2, 'lblWall', rot + 207 * D2R);
      lbl(toonoView ? (L.wallHead + M) / 2 : (g.toonoR + g.R) / 2, 'lblRoof', rot + 153 * D2R);
      lbl(L.floorEdge * 0.62, 'lblKhoimor', rot);
      lbl((dr0 + dr1) / 2, 'lblDoor', da, '#fff6e8');
      lbl(toonoView ? M - 0.075 * M : g.toonoR + 0.1 * M, 'lblToono', rot + 234 * D2R, '#5b3d22');
      ctx.fillStyle = '#a08a6c';
      tr('compass').forEach((c, i) => { const [x, y] = P(L.floorEdge - 0.055 * M, i * Math.PI / 2); ctx.fillText(c, x, y); });
    }

    // Fixed 12 sectors and names.
    if (state.ov.wedges) {
      ctx.strokeStyle = 'rgba(80,58,35,0.42)'; ctx.lineWidth = 1; ctx.beginPath();
      for (let k = 0; k < 12; k++) spoke(0, M, rot + (15 + 30 * k) * D2R);
      ctx.stroke();
    }
    ctx.font = `600 ${fontPx}px system-ui, sans-serif`; ctx.fillStyle = '#3b2a1a';
    for (let k = 0; k < 12; k++) {
      const [x, y] = P(M + (band * 0.55) / sc, rot + 30 * k * D2R);
      ctx.fillText(animal(6 + k), x, y);
    }
    ctx.font = `${fontPx}px system-ui, sans-serif`;

    const poly = (pts, close) => { ctx.beginPath(); pts.forEach((n, i) => { const [x, y] = PN(n); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); if (close) ctx.closePath(); };
    const lines = (arr, color, w) => { ctx.strokeStyle = color; ctx.lineWidth = w; for (const l of arr) { poly(l); ctx.stroke(); } };
    const links = (arr, color) => {
      if (!arr || !arr.links) return;
      ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = color; ctx.lineWidth = 1.4;
      for (const [a, b] of arr.links) { const [x0, y0] = PN(a), [x1, y1] = PN(b); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
      ctx.restore();
    };
    if (ov.sundial) {
      ctx.strokeStyle = 'rgba(176,42,107,0.8)'; ctx.lineWidth = 1.3;
      for (const l of ov.sundial) for (const r of l.lines) { poly(r); ctx.stroke(); }
      ctx.fillStyle = '#8a1f52';
      for (const l of ov.sundial) { const [x, y] = P(l.end.rho * 0.93, l.end.az); ctx.fillText(l.label, x, y); }
      if (ov.foot) { const [x, y] = PN(ov.foot); ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill(); }
    }
    if (ov.today) { lines(ov.today, '#1f6fb2', 1.8); links(ov.today, '#1f6fb2'); }
    const drawSectors = (sec, lineColor, nameColor, ringR) => {
      for (const m of sec.marks) {
        ctx.beginPath(); spoke(0, M, m.az);
        ctx.strokeStyle = (m.kind === 'rise' || m.kind === 'set') ? '#d97a00' : lineColor; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.font = `600 ${fontPx}px system-ui, sans-serif`; ctx.fillStyle = nameColor;
      for (const n of sec.names) {
        if (n.span * sc * ringR < fontPx * 2.2) continue;
        const [x, y] = P(ringR, n.az); ctx.fillText(animal(n.idx), x, y);
      }
      ctx.font = `${fontPx}px system-ui, sans-serif`;
    };
    if (ov.sectors) drawSectors(ov.sectors, '#1d5f9c', '#123f6b', (L.floorEdge + L.wallHead) / 2);
    if (ov.temporal) drawSectors(ov.temporal, '#2c8a4f', '#1c5a33', L.floorEdge * 0.8);

    // Light patch.
    let lightOn = null;
    if (st.alt > 0) {
      const polys = E.patch(st.s, g, state.urkh, state.doorAz, state.view);
      if (polys) {
        polys.sort((a, b) => (a.surf === 'roof') - (b.surf === 'roof'));
        for (const q of polys) {
          poly(q.pts, true);
          if (q.surf === 'roof' && !toonoView) {
            ctx.fillStyle = 'rgba(255,150,30,0.55)'; ctx.fill();
            ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(160,70,0,0.75)'; ctx.lineWidth = 1;
            ctx.beginPath(); for (let k = -S; k < S; k += 6) { ctx.moveTo(k, 0); ctx.lineTo(k + S, S); } ctx.stroke(); ctx.restore();
            poly(q.pts, true); ctx.strokeStyle = '#b35a00'; ctx.lineWidth = 1.3; ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(255,201,58,0.92)'; ctx.fill();
            ctx.strokeStyle = '#d97a00'; ctx.lineWidth = 1.5; ctx.stroke();
          }
        }
        const surfs = new Set(polys.map(q => q.surf));
        lightOn = surfs.size > 1 || surfs.has('mixed') ? 'mixed' : polys[0].surf;
      }
    } else disk(M, 'rgba(30,40,70,0.28)');

    renderInfo(st, lightOn);
  }

  function renderInfo(st, lightOn) {
    const p = localParts();
    const clockMin = p.h * 60 + p.mi;
    $('heroAnimal').textContent = animal(E.clockHour(clockMin));
    $('heroLine').textContent = `${pad(p.h)}:${pad(p.mi)} · ${tr('monthDay')(p.mo, p.d)} · ${placeName()}`;
    const rows = [
      ['h40', 'h40s', E.clockHour(clockMin)],
      ['hSolar', 'hSolars', E.solarHour(st.ast)],
      ['hDir', 'hDirs', st.alt > 0 ? E.directionHour(st.az, state.doorAz - 180) : undefined],
      ['hTemp', 'hTemps', E.temporalHour(state.lat, st.decl, st.H)]
    ];
    $('hours').innerHTML = rows.map(([a, b, i]) =>
      `<tr><td>${tr(a)}<small>${tr(b)}</small></td><td>${i === null ? tr('polar') : animal(i)}</td></tr>`).join('');
    $('sunLine').textContent = st.alt > 0 ? tr('sunUp')(st.alt.toFixed(0), tr(lightOn || 'floor')) : tr('sunDown');
    const doy = dayOfYear(p);
    if (document.activeElement !== $('timeSlider')) $('timeSlider').value = clockMin;
    $('dateSlider').max = daysInYear(p.y);
    if (document.activeElement !== $('dateSlider')) $('dateSlider').value = doy;
    $('timeOut').textContent = `${pad(p.h)}:${pad(p.mi)}`;
    $('dateOut').textContent = `${p.y} · ${tr('monthDay')(p.mo, p.d)}`;
    $('viewNote').textContent = tr(state.view === 'toono' ? 'viewNoteToono' : 'viewNotePlan');
    renderLegend();
  }

  function renderLegend() {
    const items = state.view === 'toono' ? [['patch', '', 'lgPatch']] : [['patch', '', 'lgPatchPlan'], ['roofpatch', '', 'lgRoofPatch']];
    if (state.ov.sectors) items.push(['line', 'border-color:#1d5f9c', 'lgSectors'], ['line', 'border-color:#d97a00', 'lgRiseSet']);
    if (state.ov.path) items.push(['line', 'border-color:#1f6fb2', 'lgToday']);
    if (state.ov.temporal) items.push(['line', 'border-color:#2c8a4f', 'lgTemporal']);
    if (state.ov.sundial) items.push(['line', 'border-color:#b02a6b', 'lgSundial']);
    $('legend').innerHTML = items.map(([k, style, key]) => `<span><i class="${k === 'line' ? '' : k}" style="${style}"></i>${tr(key)}</span>`).join('');
  }

  const daysInYear = y => ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365);
  const dayOfYear = p => Math.round((Date.UTC(p.y, p.mo - 1, p.d) - Date.UTC(p.y, 0, 1)) / 86400000) + 1;

  // --------------------------------------------------------- Controls ---
  function setError(msg) { $('error').textContent = msg || ''; }
  function setTime(ms, live = false) { if (Number.isFinite(ms)) { state.t = ms; state.live = live; render(); } }
  function updatePlayButton() {
    $('play').textContent = state.playing ? '❚❚' : '▶';
    $('play').setAttribute('aria-pressed', String(state.playing));
    $('play').setAttribute('aria-label', tr(state.playing ? 'pause' : 'play'));
  }
  function setPlaying(on) {
    state.playing = on; if (on) state.live = false;
    updatePlayButton(); lastFrame = null;
    if (on) requestAnimationFrame(tick);
  }
  let lastFrame = null;
  function tick(now) {
    if (!state.playing) return;
    if (lastFrame !== null) state.t += state.speed * (now - lastFrame);
    lastFrame = now; render();
    requestAnimationFrame(tick);
  }
  // Follow the real clock when not playing and not moved by hand.
  setInterval(() => { if (state.live && !state.playing) { state.t = Date.now(); render(); } }, 15000);

  function showPlace() { $('lat').value = state.lat; $('lon').value = state.lon; }
  function showGer() {
    const g = state.ger;
    $('diam').value = +(2 * g.R).toFixed(2); $('wallH').value = g.wallH; $('toonoH').value = g.toonoH;
    $('toonoD').value = +(2 * g.toonoR).toFixed(2); $('uniCount').value = g.uni;
  }

  function bind() {
    document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
    document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    $('play').addEventListener('click', () => setPlaying(!state.playing));
    $('now').addEventListener('click', () => { setPlaying(false); setTime(Date.now(), true); });
    $('speed').addEventListener('change', e => { state.speed = parseFloat(e.target.value); lastFrame = null; });
    $('timeSlider').addEventListener('input', e => {
      const p = localParts(), m = +e.target.value;
      setTime(E.zonedToUtc(state.tz, p.y, p.mo, p.d, Math.floor(m / 60), m % 60));
    });
    $('dateSlider').addEventListener('input', e => {
      const p = localParts(), d = new Date(Date.UTC(p.y, 0, +e.target.value));
      setTime(E.zonedToUtc(state.tz, d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), p.h, p.mi));
    });
    $('preset').addEventListener('change', e => {
      state.place = e.target.value;
      const pl = PLACES.find(x => x.id === state.place);
      if (pl) { state.lat = pl.lat; state.lon = pl.lon; state.tz = pl.tz; showPlace(); fillZones(); setError(''); invalidate(); render(); }
    });
    for (const id of ['lat', 'lon']) $(id).addEventListener('change', () => {
      const lat = parseFloat($('lat').value), lon = parseFloat($('lon').value);
      if (!(lat >= -89 && lat <= 89 && lon >= -180 && lon <= 180)) { setError(tr('badPlace')); return; }
      setError(''); state.lat = lat; state.lon = lon; state.place = 'custom'; $('preset').value = 'custom'; invalidate(); render();
    });
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
    $('size').addEventListener('change', e => { state.ger = { ...E.PRESETS[e.target.value] }; showGer(); setError(''); invalidate(); render(); });
    for (const id of ['diam', 'wallH', 'toonoH', 'toonoD', 'uniCount']) $(id).addEventListener('change', () => {
      const g = { ...state.ger, R: parseFloat($('diam').value) / 2, wallH: parseFloat($('wallH').value),
        toonoH: parseFloat($('toonoH').value), toonoR: parseFloat($('toonoD').value) / 2, uni: Math.round(parseFloat($('uniCount').value)) };
      if (E.validateGer(g).length) { setError(tr('badGer')); return; }
      setError(''); state.ger = g; invalidate(); render();
    });
    $('door').addEventListener('change', e => {
      const v = parseFloat(e.target.value);
      if (!(v >= 0 && v < 360)) { e.target.value = state.doorAz; return; }
      state.doorAz = v; invalidate(); render();
    });
    $('urkh').addEventListener('change', e => { state.urkh = e.target.value; render(); });
    const ovMap = { ovUni: 'uni', ovLabels: 'labels', ovWedges: 'wedges', ovSectors: 'sectors', ovTemporal: 'temporal', ovPath: 'path', ovSundial: 'sundial' };
    for (const [id, k] of Object.entries(ovMap)) $(id).addEventListener('change', e => { state.ov[k] = e.target.checked; invalidate(); render(); });
    let rT = null;
    window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(resize, 80); });
  }

  // ------------------------------------------------------------- Init ---
  function init() {
    $('version').textContent = 'v' + E.VERSION + ' alpha';
    const params = new URLSearchParams(location.search);
    let saved = null; try { saved = localStorage.getItem('sol-lang'); } catch (e) { /* ignore */ }
    const requested = params.get('lang');
    state.lang = ['mn', 'en'].includes(requested) ? requested : (['mn', 'en'].includes(saved) ? saved : 'mn');
    if (params.get('view') === 'toono') state.view = 'toono';
    showPlace(); showGer(); bind();
    $('speed').value = String(state.speed);
    setView(state.view);
    setLanguage(state.lang);
    resize();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
