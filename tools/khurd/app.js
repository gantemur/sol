/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 *
 * Prayer wheel interface: views, drawing, input, mantra band, counters.
 * The rotation and counting rules live in engine.js. */
(function () {
  "use strict";

  const E = window.KhurdEngine;
  const TAU = E.TAU;

  /* ---------- Text ---------- */

  const STRINGS = {
    mn: {
      title: "Маанийн хүрд",
      langLabel: "Хэл",
      bandLabel: "Хүрд бүрийн доторх маань уншигдаж буй тууз",
      wheelLabel: "Маанийн хүрд. Эргүүлэхийн тулд чирэх, эсвэл зай товч дарна.",
      mani: "маань",
      turns: "Эргэлт",
      session: "Энэ удаа",
      hintSide: "Хүрдийг хуруугаараа баруунаас зүүн тийш илж эргүүлнэ.",
      hintTop: "Хүрдийг цагийн зүүний дагуу тойруулан чирж эргүүлнэ.",
      hintDesk: "Хулганы дугуй, сум болон зай товч бас болно.",
      settings: "Тохиргоо",
      view: "Харагдац",
      viewAuto: "Автомат",
      viewSide: "Хажуугаас",
      viewTop: "Дээрээс",
      backward: "Буцааж эргүүлэхэд",
      modeRatchet: "Эргэхгүй",
      modeSubtract: "Хасагдана",
      scroll: "Доторх маань",
      scrollNote: "Хүрдийг нэг эргүүлэхэд дотор нь бичсэн бүх маань дээрх туузаар нэг удаа гүйнэ.",
      bell: "Эргэлт бүрд хонх",
      fullscreen: "Бүтэн дэлгэц",
      exitFullscreen: "Бүтэн дэлгэцээс гарах",
      reset: "Тоолуурыг тэглэх",
      resetConfirm: "Тоолуурыг тэглэх үү?",
      aboutTitle: "Тухай",
      about:
        "<p>Хүрдний гадаргуу дээр <span class=\"tib\" lang=\"bo\">ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ</span> буюу «Ом мани бадмэ хум» гэсэн зургаан үсэгт тарни бичигдсэн. " +
        "Жинхэнэ хүрдний дотор маань олон мянгаар бичсэн цаасыг ороож хийдэг бөгөөд хүрдийг цагийн зүүний дагуу нэг эргүүлэхэд дотор нь буй бүх маань нэг уншигдсантай адил гэж үздэг.</p>" +
        "<p>«Доторх маань» тохиргоо нь ороосон цаасан дээрх маанийн тоо. Хүрд бүрийн дээрх тууз тухайн хүрдний цаас уншигдаж буйг харуулна: хүрд нэг эргэхэд түүний тууз яг тэр тоогоор маань гүйлгэнэ. Алтан тэмдгийг бүтэн өнгөрсөн маань бүр тоологдоно. Тиймээс гурван хүрдийг тус бүр гуравны нэгээр эргүүлбэл нэг ч маань бүтэн уншигдахгүй.</p>" +
        "<p>Тоолуур зөвхөн энэ төхөөрөмж дээр хадгалагдана.</p>"
    },
    en: {
      title: "Prayer wheel",
      langLabel: "Language",
      bandLabel: "Bands showing the mantras inside each drum being read",
      wheelLabel: "Prayer wheel. Drag to turn it, or press Space.",
      mani: "mani",
      turns: "Turns",
      session: "This visit",
      hintSide: "Brush the drums from right to left to turn them.",
      hintTop: "Drag around the wheel clockwise to turn it.",
      hintDesk: "The scroll wheel, arrow keys and Space also work.",
      settings: "Settings",
      view: "View",
      viewAuto: "Automatic",
      viewSide: "From the side",
      viewTop: "From above",
      backward: "Turning backwards",
      modeRatchet: "Does not turn",
      modeSubtract: "Subtracts",
      scroll: "Mantras inside",
      scrollNote: "One turn of the wheel runs every mantra written inside once through the band above it.",
      bell: "Bell on every turn",
      fullscreen: "Full screen",
      exitFullscreen: "Exit full screen",
      reset: "Reset counter",
      resetConfirm: "Reset the counter to zero?",
      aboutTitle: "About",
      about:
        "<p>The drum carries the six-syllable mantra <span class=\"tib\" lang=\"bo\">ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ</span>, Om mani padme hum. " +
        "A real wheel holds a long paper scroll with the mantra written many thousands of times, and by tradition one clockwise turn counts as reciting everything inside.</p>" +
        "<p>The Mantras inside setting is the number of mantras on that scroll. The band above each drum shows that drum's scroll being read: each turn runs exactly that many mantras through it, and every mantra that has fully passed the gold mark is counted. Turning three drums a third of a turn each therefore completes no mantra.</p>" +
        "<p>The count is kept only on this device.</p>"
    }
  };

  /* The six syllables in reading order, with their traditional colours. */
  const SYLLABLES = [
    { text: "ཨོཾ", color: "#f6f1e7" },
    { text: "མ", color: "#2e8b57" },
    { text: "ཎི", color: "#e9c234" },
    { text: "པ", color: "#2b62b8" },
    { text: "དྨེ", color: "#c9302c" },
    { text: "ཧཱུྃ", color: "#1b1416" }
  ];
  const MANTRA = "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ་";
  const TIB_FONT = "\"Khurd Tibetan\", \"Noto Serif Tibetan\", Jomolhari, Kailasa, \"Microsoft Himalaya\", serif";

  /* ---------- Settings and storage ---------- */

  const store = {
    get(key) {
      try { return localStorage.getItem("khurd-" + key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem("khurd-" + key, String(value)); } catch (e) { /* storage unavailable */ }
    }
  };

  function pick(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function readBig(key) {
    const raw = store.get(key);
    return raw && /^-?\d{1,40}$/.test(raw) ? BigInt(raw) : 0n;
  }

  function initialLang() {
    let requested = null;
    try { requested = new URLSearchParams(location.search).get("lang"); } catch (e) { /* ignore */ }
    if (STRINGS[requested]) return requested;
    const saved = store.get("lang");
    return STRINGS[saved] ? saved : "mn";
  }

  const settings = {
    lang: initialLang(),
    view: pick(store.get("view"), ["auto", "side", "top"], "auto"),
    mode: pick(store.get("mode"), ["ratchet", "subtract"], "ratchet"),
    scroll: (() => {
      const n = Number(store.get("scroll"));
      return E.SCROLL_SIZES.includes(n) ? n : 1;
    })(),
    bell: store.get("bell") === "1"
  };

  let banked = { turns: readBig("turns"), mani: readBig("mani") };
  let sessionStart = banked.mani;

  /* ---------- Elements ---------- */

  const $ = (sel) => document.querySelector(sel);
  const canvas = $("#wheels");
  const ctx = canvas.getContext("2d");
  const band = $("#band");
  const bctx = band.getContext("2d");
  const stage = $("#stage");
  const out = {
    mani: $("#mani-total"),
    turns: $("#turns-total"),
    session: $("#mani-session"),
    hint: $("#hint")
  };
  const coarse = window.matchMedia ? matchMedia("(pointer: coarse)") : { matches: false };
  const reduceMotion = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  const t = (key) => (STRINGS[settings.lang] && STRINGS[settings.lang][key]) || STRINGS.mn[key] || key;

  /* ---------- Layout ---------- */

  let wheels = [];
  let geom = [];          // per wheel: {cx, cy, R, ...}
  let view = "top";
  let cssW = 0, cssH = 0, dpr = 1;
  let sprites = null;     // pre-rendered syllables
  let spriteSize = 0;

  function effectiveView() {
    if (settings.view !== "auto") return settings.view;
    return window.innerWidth > window.innerHeight && window.innerWidth >= 560 ? "side" : "top";
  }

  function layout() {
    const rect = stage.getBoundingClientRect();
    cssW = Math.max(200, rect.width);
    cssH = Math.max(200, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    view = effectiveView();
    if (stage.dataset.view !== view) {
      stage.dataset.view = view;
      const r2 = stage.getBoundingClientRect();
      cssW = Math.max(200, r2.width);
      cssH = Math.max(200, r2.height);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    const n = view === "side" ? Math.max(1, Math.min(6, Math.floor(cssW / 250))) : 1;
    resizeWheels(n);

    geom = [];
    let letterPx;
    if (view === "side") {
      const slot = cssW / n;
      const R = Math.min(slot * 0.36, (cssH * 0.72) / 2.7);
      const height = R * 2.7;
      const top = (cssH - height) / 2 + R * 0.08;
      for (let i = 0; i < n; i += 1) {
        geom.push({ cx: slot * (i + 0.5), top, bottom: top + height, R, ry: R * 0.16 });
      }
      letterPx = height * 0.29;
    } else {
      const R = Math.min(cssW, cssH) * 0.44;
      geom.push({ cx: cssW / 2, cy: cssH / 2, R });
      letterPx = R * 0.27;
    }

    const bandRect = band.getBoundingClientRect();
    band.width = Math.round(bandRect.width * dpr);
    band.height = Math.round(bandRect.height * dpr);
    bandMetrics = null;
    measureBandCenters();

    const wanted = Math.round(letterPx * dpr);
    if (!sprites || Math.abs(wanted - spriteSize) > 2) buildSprites(wanted);
    updateHint();
    requestDraw();
  }

  function resizeWheels(n) {
    if (wheels.length === n) return;
    banked = E.bankWholeTurns(banked, wheels, settings.scroll);
    if (wheels.length > n) {
      const removed = wheels.slice(n);
      banked = E.bank(banked, removed, settings.scroll);
      wheels = wheels.slice(0, n);
    }
    while (wheels.length < n) {
      const w = E.createWheel(settings.mode);
      w.ring = 0;
      wheels.push(w);
    }
    contacts.clear();
  }

  /* ---------- Syllable sprites ---------- */

  function buildSprites(px) {
    spriteSize = Math.max(12, px);
    const font = "700 " + spriteSize + "px " + TIB_FONT;
    const probe = document.createElement("canvas").getContext("2d");
    probe.font = font;
    sprites = SYLLABLES.map((s) => {
      const m = probe.measureText(s.text);
      const pad = Math.ceil(spriteSize * 0.12);
      const asc = Math.ceil(m.actualBoundingBoxAscent || spriteSize * 0.9);
      const desc = Math.ceil(m.actualBoundingBoxDescent || spriteSize * 0.5);
      const left = Math.ceil(m.actualBoundingBoxLeft || 0);
      const w = Math.ceil((m.actualBoundingBoxRight || m.width) + left) + pad * 2;
      const h = asc + desc + pad * 2;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      g.font = font;
      g.lineJoin = "round";
      g.lineWidth = Math.max(1.5, spriteSize * 0.07);
      g.strokeStyle = "#d6a23e";
      g.strokeText(s.text, pad + left, pad + asc);
      g.fillStyle = s.color;
      g.fillText(s.text, pad + left, pad + asc);
      return { canvas: c, w, h, baseline: pad + asc };
    });
  }

  /* ---------- Drawing: wheels ---------- */

  const COPPER = ["#4a2510", "#8f5022", "#d39a5c", "#f1c58b", "#b9773a", "#7b431b", "#3d1e0b"];

  function copperGradient(g, x0, x1) {
    const gr = g.createLinearGradient(x0, 0, x1, 0);
    const stops = [0, 0.14, 0.3, 0.37, 0.5, 0.8, 1];
    stops.forEach((s, i) => gr.addColorStop(s, COPPER[i]));
    return gr;
  }

  /* Number of samples for motion blur when a wheel turns fast. */
  function blurSamples(dAngle, spacing) {
    if (reduceMotion.matches) return 1;
    const a = Math.abs(dAngle);
    if (a < spacing * 0.08) return 1;
    return Math.min(10, Math.ceil(a / (spacing * 0.06)));
  }

  function drawSide(i) {
    const w = wheels[i];
    const gm = geom[i];
    const { cx, top, bottom, R, ry } = gm;
    const g = ctx;
    const height = bottom - top;
    const angle = w.angle + w.recoil;

    // Axle rods above and below, like a temple row.
    g.strokeStyle = "#3a2a24";
    g.lineWidth = Math.max(3, R * 0.06);
    g.beginPath();
    g.moveTo(cx, 0);
    g.lineTo(cx, top - ry * 0.4);
    g.moveTo(cx, bottom + ry);
    g.lineTo(cx, cssH);
    g.stroke();

    // Body.
    g.save();
    g.beginPath();
    g.moveTo(cx - R, top);
    g.lineTo(cx - R, bottom);
    g.ellipse(cx, bottom, R, ry, 0, Math.PI, 0, true);
    g.lineTo(cx + R, top);
    g.ellipse(cx, top, R, ry, 0, 0, Math.PI, false);
    g.closePath();
    g.fillStyle = copperGradient(g, cx - R, cx + R);
    g.fill();
    g.clip();

    // Lacquered band holding the syllables.
    const bandTop = top + height * 0.22;
    const bandBot = top + height * 0.78;
    g.beginPath();
    g.ellipse(cx, bandTop, R + 1, ry, 0, 0, Math.PI, false);
    g.lineTo(cx - R - 1, bandBot);
    g.ellipse(cx, bandBot, R + 1, ry, 0, Math.PI, 0, true);
    g.closePath();
    g.fillStyle = "#5b1820";
    g.fill();

    // Gilt rim lines.
    g.strokeStyle = "#e3b65a";
    g.lineWidth = Math.max(1.5, R * 0.025);
    for (const y of [top + height * 0.08, bandTop, bandBot, top + height * 0.92]) {
      g.beginPath();
      g.ellipse(cx, y, R, ry, 0, 0, Math.PI, false);
      g.stroke();
    }

    // Studs on the rims: they move with the drum, so the eye sees it turn.
    const dA = w.lastDraw === undefined ? 0 : angleDelta(w.lastDraw, angle);
    const studs = 20;
    for (let k = 0; k < studs; k += 1) {
      const a = (k / studs) * TAU - angle;
      const c = Math.cos(a);
      if (c <= 0.05) continue;
      const x = cx + R * Math.sin(a);
      g.fillStyle = "rgba(240, 200, 120, " + (0.35 + 0.6 * c).toFixed(3) + ")";
      for (const yy of [top + height * 0.15, top + height * 0.85]) {
        g.beginPath();
        g.ellipse(x, yy + ry * c, R * 0.035 * c + 0.6, R * 0.035, 0, 0, TAU);
        g.fill();
      }
    }

    // Syllables: angle phi increases to the right, so they read left to right
    // and pass the viewer from right to left when the wheel turns clockwise.
    const samples = blurSamples(dA, TAU / 6);
    const yMid = (bandTop + bandBot) / 2;
    const slices = samples > 1 ? 6 : 16;
    for (let s = 0; s < samples; s += 1) {
      const aBase = angle - (samples > 1 ? dA * (s / samples) : 0);
      g.globalAlpha = samples > 1 ? Math.min(1, 1.6 / samples) : 1;
      for (let j = 0; j < SYLLABLES.length; j += 1) {
        drawWrapped(g, sprites[j], (j / 6) * TAU - aBase, cx, yMid, R, ry, slices);
      }
    }
    g.globalAlpha = 1;

    // Fixed lighting over the turning surface.
    const shade = g.createLinearGradient(cx - R, 0, cx + R, 0);
    shade.addColorStop(0, "rgba(0,0,0,0.55)");
    shade.addColorStop(0.22, "rgba(0,0,0,0.05)");
    shade.addColorStop(0.36, "rgba(255,240,210,0.18)");
    shade.addColorStop(0.5, "rgba(0,0,0,0)");
    shade.addColorStop(0.85, "rgba(0,0,0,0.3)");
    shade.addColorStop(1, "rgba(0,0,0,0.6)");
    g.fillStyle = shade;
    g.fillRect(cx - R - 2, top - ry - 2, 2 * R + 4, height + 2 * ry + 4);
    g.restore();

    // Lid and finial.
    g.beginPath();
    g.ellipse(cx, top, R, ry, 0, 0, TAU);
    const lid = g.createLinearGradient(cx - R, top - ry, cx + R, top + ry);
    lid.addColorStop(0, "#c48a4c");
    lid.addColorStop(0.5, "#8a4c1f");
    lid.addColorStop(1, "#5a2d10");
    g.fillStyle = lid;
    g.fill();
    g.strokeStyle = "#e3b65a";
    g.lineWidth = Math.max(1.5, R * 0.025);
    g.stroke();
    g.beginPath();
    g.ellipse(cx, top - ry * 0.15, R * 0.22, ry * 0.5, 0, Math.PI, 0, false);
    g.fillStyle = "#e0b05a";
    g.fill();
    g.beginPath();
    g.ellipse(cx, top - ry * 0.3, R * 0.08, R * 0.08, 0, 0, TAU);
    g.fill();

    w.lastDraw = angle;
  }

  /* Paint a syllable onto the cylinder. The sprite's width is arc length on
   * the drum, so each vertical slice at arc offset u sits at angle a + u/R and
   * projects to x = R sin(a + u/R): letters narrow as they turn toward the rim,
   * the trailing side more than the leading side. Each slice also follows the
   * band's elliptical curve, which keeps the letter centred in the band. */
  function drawWrapped(g, sp, a, cx, yMid, R, ry, slices) {
    const sw = sp.w / dpr;
    const sh = sp.h / dpr;
    const half = sw / 2;
    for (let k = 0; k < slices; k += 1) {
      const u0 = -half + (sw * k) / slices;
      const u1 = -half + (sw * (k + 1)) / slices;
      const b0 = a + u0 / R;
      const b1 = a + u1 / R;
      const c0 = Math.cos(b0);
      const c1 = Math.cos(b1);
      if (c0 <= 0 && c1 <= 0) continue;
      const x0 = cx + R * Math.sin(b0);
      const x1 = cx + R * Math.sin(b1);
      const w = x1 - x0;
      if (w <= 0.05) continue;
      const shade = Math.max(0, Math.min(1, 0.25 + 0.9 * Math.max(c0, c1)));
      const y = yMid + ry * Math.max(0, (c0 + c1) / 2);
      const prev = g.globalAlpha;
      g.globalAlpha = prev * shade;
      const sx = (sp.w * k) / slices;
      g.drawImage(sp.canvas, sx, 0, sp.w / slices, sp.h, x0, y - sh / 2, w + 0.35, sh);
      g.globalAlpha = prev;
    }
  }

  function drawTop(i) {
    const w = wheels[i];
    const { cx, cy, R } = geom[i];
    const g = ctx;
    const angle = w.angle + w.recoil;
    const dA = w.lastDraw === undefined ? 0 : angleDelta(w.lastDraw, angle);

    // Shadow.
    g.beginPath();
    g.arc(cx + R * 0.04, cy + R * 0.06, R * 1.02, 0, TAU);
    g.fillStyle = "rgba(40, 20, 15, 0.22)";
    g.fill();

    // Copper rim.
    const rim = g.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    rim.addColorStop(0, "#f2c88f");
    rim.addColorStop(0.55, "#b8743a");
    rim.addColorStop(1, "#5b2d10");
    g.beginPath();
    g.arc(cx, cy, R, 0, TAU);
    g.fillStyle = rim;
    g.fill();

    // Lacquered ring for the syllables.
    g.beginPath();
    g.arc(cx, cy, R * 0.93, 0, TAU);
    g.arc(cx, cy, R * 0.56, 0, TAU, true);
    g.fillStyle = "#5b1820";
    g.fill("evenodd");

    g.strokeStyle = "#e3b65a";
    g.lineWidth = Math.max(1.5, R * 0.018);
    for (const r of [0.93, 0.56, 0.98]) {
      g.beginPath();
      g.arc(cx, cy, R * r, 0, TAU);
      g.stroke();
    }

    // Rim studs and inner petals turn with the wheel.
    g.save();
    g.translate(cx, cy);
    g.rotate(angle);
    g.fillStyle = "#f0c878";
    for (let k = 0; k < 24; k += 1) {
      const a = (k / 24) * TAU;
      g.beginPath();
      g.arc(Math.cos(a) * R * 0.955, Math.sin(a) * R * 0.955, R * 0.014, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 8; k += 1) {
      g.save();
      g.rotate((k / 8) * TAU);
      g.beginPath();
      g.moveTo(0, -R * 0.2);
      g.quadraticCurveTo(R * 0.12, -R * 0.36, 0, -R * 0.5);
      g.quadraticCurveTo(-R * 0.12, -R * 0.36, 0, -R * 0.2);
      g.fillStyle = k % 2 ? "#a65f2a" : "#c98545";
      g.fill();
      g.restore();
    }
    g.restore();

    // Syllables as the side wall projects seen from above, with the front at
    // the bottom of the screen: upright at the front, reading left to right
    // there, so counter-clockwise around the ring. Turning clockwise brings
    // them to the back (top), the reading point, in order.
    const samples = blurSamples(dA, TAU / 6);
    const scale = 1 / dpr;
    const rText = R * 0.745;
    for (let s = 0; s < samples; s += 1) {
      const aBase = angle - (samples > 1 ? dA * (s / samples) : 0);
      g.globalAlpha = samples > 1 ? Math.min(1, 1.6 / samples) : 1;
      for (let j = 0; j < SYLLABLES.length; j += 1) {
        const b = aBase - (j / 6) * TAU - Math.PI / 2;
        const sp = sprites[j];
        const sw = sp.w * scale;
        const sh = sp.h * scale;
        g.save();
        g.translate(cx + Math.cos(b) * rText, cy + Math.sin(b) * rText);
        g.rotate(b - Math.PI / 2);
        g.drawImage(sp.canvas, -sw / 2, -sh / 2, sw, sh);
        g.restore();
      }
    }
    g.globalAlpha = 1;

    // Reading pointer at the back of the wheel.
    const pt = Math.max(7, R * 0.05);
    g.beginPath();
    g.moveTo(cx - pt, cy - R - pt * 1.9);
    g.lineTo(cx + pt, cy - R - pt * 1.9);
    g.lineTo(cx, cy - R - pt * 0.2);
    g.closePath();
    g.fillStyle = "#d6a23e";
    g.fill();

    // Hub.
    const hub = g.createRadialGradient(cx - R * 0.05, cy - R * 0.06, R * 0.01, cx, cy, R * 0.17);
    hub.addColorStop(0, "#fff1c7");
    hub.addColorStop(0.5, "#e0b05a");
    hub.addColorStop(1, "#8a5a1e");
    g.beginPath();
    g.arc(cx, cy, R * 0.17, 0, TAU);
    g.fillStyle = hub;
    g.fill();

    // Fixed highlight.
    const gloss = g.createRadialGradient(cx - R * 0.4, cy - R * 0.45, 0, cx - R * 0.4, cy - R * 0.45, R * 0.9);
    gloss.addColorStop(0, "rgba(255,245,220,0.22)");
    gloss.addColorStop(1, "rgba(255,245,220,0)");
    g.beginPath();
    g.arc(cx, cy, R, 0, TAU);
    g.fillStyle = gloss;
    g.fill();

    w.lastDraw = angle;
  }

  function angleDelta(from, to) {
    let d = (to - from) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
  }

  function drawWheels() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    if (!sprites) return;
    for (let i = 0; i < wheels.length; i += 1) {
      if (view === "side") drawSide(i);
      else drawTop(i);
    }
  }

  /* ---------- Drawing: mantra band ---------- */

  let bandMetrics = null;
  let bandCenters = [];   // each drum's centre, in band-canvas pixels

  /* The band is laid out like the drum: six equal cells, one per syllable,
   * each syllable centred in its cell and the tsheg on the cell boundary.
   * One drum sector of 60° then corresponds to exactly one cell. */
  const BAND_CELLS = ["ཨོཾ", "མ", "ཎི", "པ", "དྨེ", "ཧཱུྃ"];
  const TSHEG_AFTER = [true, true, true, false, true, true];

  function bandStrip(H) {
    const px = Math.round(H * 0.46);
    if (bandMetrics && bandMetrics.px === px) return bandMetrics;
    const font = "700 " + px + "px " + TIB_FONT;
    bctx.font = font;
    const widest = Math.max(...BAND_CELLS.map((t) => bctx.measureText(t).width));
    const cell = Math.ceil(widest * 1.18);
    const unit = cell * 6;
    const c = document.createElement("canvas");
    c.width = unit;
    c.height = H;
    const g = c.getContext("2d");
    g.font = font;
    g.fillStyle = "#e9c983";
    g.textAlign = "center";
    BAND_CELLS.forEach((t, j) => {
      g.fillText(t, (j + 0.5) * cell, H * 0.66);
      if (TSHEG_AFTER[j]) g.fillText("་", (j + 1) * cell - (j === 5 ? cell * 0.02 : 0), H * 0.66);
    });
    bandMetrics = { px, unit, strip: c };
    return bandMetrics;
  }

  function measureBandCenters() {
    const br = band.getBoundingClientRect();
    const sr = canvas.getBoundingClientRect();
    const k = br.width ? band.width / br.width : dpr;
    bandCenters = geom.map((gm) => (sr.left - br.left + gm.cx) * k);
  }

  /* One panel per drum, centred above it. Each panel shows that drum's own
   * scroll: its position is the drum's angle times N / 2π, the same quantity
   * the counter truncates, so a mantra is counted exactly when its end has
   * passed the drum's gold mark. */
  function drawBand() {
    const W = band.width;
    const H = band.height;
    if (!W || !H) return;
    const g = bctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    const { unit, strip } = bandStrip(H);
    const n = Math.min(wheels.length, bandCenters.length);

    for (let i = 0; i < n; i += 1) {
      const w = wheels[i];
      const center = bandCenters[i];
      const left = i === 0 ? 0 : (bandCenters[i - 1] + center) / 2;
      const right = i === n - 1 ? W : (center + bandCenters[i + 1]) / 2;
      // Displayed angle and counted angle differ only by whole turns, and N is
      // an integer, so this has the same fraction as the counted position.
      const pos = (((w.angle + w.recoil) % TAU) / TAU) * settings.scroll;
      const frac = pos - Math.floor(pos);
      const step = w.bandFrame || 0;
      const shift = Math.abs(step);

      let offsets;
      if (reduceMotion.matches || shift * unit < 2) {
        offsets = [frac];
      } else if (shift >= 1) {
        // A whole mantra or more per frame: show an even smear, never a
        // stroboscopic still image that would misrepresent the speed.
        const S = 48;
        offsets = Array.from({ length: S }, (_, s) => (frac + s / S) % 1);
      } else {
        const S = Math.min(48, Math.ceil((shift * unit) / 2));
        offsets = Array.from({ length: S }, (_, s) => frac - step * (s / S));
      }

      g.save();
      g.beginPath();
      g.rect(left, 0, right - left, H);
      g.clip();
      g.globalAlpha = offsets.length > 1 ? Math.min(1, 2.4 / offsets.length) : 1;
      const kMin = Math.floor((left - center) / unit) - 1;
      const kMax = Math.ceil((right - center) / unit) + 1;
      for (const off of offsets) {
        // Cell j of mantra k is centred at center + (k + j/6 - pos)·unit, so
        // syllable j sits on the mark when the drum has turned j sixths.
        for (let k = kMin; k <= kMax; k += 1) {
          g.drawImage(strip, center + (k - off) * unit - unit / 12, 0);
        }
      }
      g.restore();

      drawMark(g, center, H);
      if (i > 0) drawDivider(g, left, H);
    }
  }

  function drawMark(g, x, H) {
    const s = Math.max(4, H * 0.12);
    g.fillStyle = "#d6a23e";
    g.fillRect(Math.round(x) - 1, 0, 2, H * 0.2);
    g.fillRect(Math.round(x) - 1, H * 0.8, 2, H * 0.2);
    g.beginPath();
    g.moveTo(x - s, 0); g.lineTo(x + s, 0); g.lineTo(x, s * 1.1); g.closePath();
    g.moveTo(x - s, H); g.lineTo(x + s, H); g.lineTo(x, H - s * 1.1); g.closePath();
    g.fill();
  }

  function drawDivider(g, x, H) {
    const d = Math.max(2, Math.round(dpr * 1.5));
    g.fillStyle = "#4f141b";
    g.fillRect(x - d * 2, 0, d * 4, H);
    g.fillStyle = "#d6a23e";
    g.fillRect(x - d * 2, 0, d, H);
    g.fillRect(x + d, 0, d, H);
  }

  /* ---------- Counters ---------- */

  let shown = { mani: null, turns: null, session: null, lang: null };

  function format(big) {
    const locale = settings.lang === "mn" ? "mn-MN" : "en-US";
    try { return big.toLocaleString(locale); } catch (e) { return big.toString(); }
  }

  function updateCounts() {
    const tot = E.totals(banked, wheels, settings.scroll);
    const session = tot.mani - sessionStart;
    if (tot.mani !== shown.mani || shown.lang !== settings.lang) out.mani.textContent = format(tot.mani);
    if (tot.turns !== shown.turns || shown.lang !== settings.lang) out.turns.textContent = format(tot.turns);
    if (session !== shown.session || shown.lang !== settings.lang) out.session.textContent = format(session);
    shown = { mani: tot.mani, turns: tot.turns, session, lang: settings.lang };
    return tot;
  }

  let saveTimer = 0;
  function save() {
    const tot = E.totals(banked, wheels, settings.scroll);
    store.set("mani", tot.mani.toString());
    store.set("turns", tot.turns.toString());
  }

  function scheduleSave() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => { saveTimer = 0; save(); }, 1500);
  }

  /* ---------- Bell ---------- */

  let audio = null;
  let lastBell = 0;

  function ensureAudio() {
    if (!settings.bell) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
    } catch (e) { audio = null; }
  }

  function ring() {
    if (!settings.bell || !audio) return;
    const now = audio.currentTime;
    if (now - lastBell < 0.15) return;
    lastBell = now;
    const master = audio.createGain();
    master.gain.value = 0.12;
    master.connect(audio.destination);
    // A small hand bell: inharmonic partials with different decay times.
    [[1, 1, 1.6], [2.76, 0.5, 0.9], [5.4, 0.25, 0.5], [8.9, 0.12, 0.3]].forEach(([ratio, amp, decay]) => {
      const o = audio.createOscillator();
      const gn = audio.createGain();
      o.frequency.value = 880 * ratio;
      gn.gain.setValueAtTime(amp, now);
      gn.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      o.connect(gn);
      gn.connect(master);
      o.start(now);
      o.stop(now + decay + 0.05);
    });
  }

  /* Every applied rotation passes through here. */
  function account(w, applied) {
    if (!applied) return;
    w.bandStep = (w.bandStep || 0) + E.bandShift(applied, settings.scroll);
    w.ring = (w.ring || 0) + applied;
    while (Math.abs(w.ring) >= TAU) {
      w.ring -= Math.sign(w.ring) * TAU;
      ring();
    }
  }

  /* ---------- Animation loop ---------- */

  let running = false;
  let lastT = 0;
  let needsDraw = false;

  function requestDraw() {
    needsDraw = true;
    if (!running) {
      running = true;
      lastT = performance.now();
      requestAnimationFrame(frame);
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000));
    lastT = now;

    for (const c of contacts.values()) {
      if (c.wheel >= 0 && now - c.lastMove > 60) E.hold(wheels[c.wheel], dt);
    }
    for (const w of wheels) account(w, E.step(w, dt));
    if (E.needsBank(wheels)) banked = E.bankWholeTurns(banked, wheels, settings.scroll);

    for (const w of wheels) { w.bandFrame = w.bandStep || 0; w.bandStep = 0; }

    drawWheels();
    drawBand();
    const before = shown.mani;
    updateCounts();
    if (shown.mani !== before) scheduleSave();

    const active = contacts.size > 0 || wheelScroll.size > 0 || wheels.some(E.isMoving) || wheels.some((w) => w.bandFrame);
    needsDraw = false;
    if (active) requestAnimationFrame(frame);
    else running = false;
  }

  /* ---------- Input: pointer ---------- */

  const contacts = new Map();  // pointerId -> {wheel, x, y, t, lastMove}

  function local(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }

  function hitWheel(p) {
    for (let i = 0; i < geom.length; i += 1) {
      const gm = geom[i];
      if (view === "side") {
        if (Math.abs(p.x - gm.cx) <= gm.R * 1.05 && p.y >= gm.top - gm.ry * 2 && p.y <= gm.bottom + gm.ry * 2) return i;
      } else {
        const d = Math.hypot(p.x - gm.cx, p.y - gm.cy);
        if (d <= gm.R * 1.12) return i;
      }
    }
    return -1;
  }

  /* Rotation produced by moving the pointer from a to b over wheel i. */
  function rotationBetween(i, a, b) {
    const gm = geom[i];
    if (view === "side") {
      // The finger moves the front surface; near the edge the surface turns
      // away from the viewer, so a sideways move turns the drum more.
      const s = Math.max(-1, Math.min(1, ((a.x + b.x) / 2 - gm.cx) / gm.R));
      const c = Math.max(0.5, Math.sqrt(1 - s * s));
      return -(b.x - a.x) / (gm.R * c);
    }
    const ra = Math.hypot(a.x - gm.cx, a.y - gm.cy);
    const rb = Math.hypot(b.x - gm.cx, b.y - gm.cy);
    if (Math.min(ra, rb) < gm.R * 0.12) return 0;   // too close to the hub to tell
    const a0 = Math.atan2(a.y - gm.cy, a.x - gm.cx);
    const a1 = Math.atan2(b.y - gm.cy, b.x - gm.cx);
    return angleDelta(a0, a1);  // screen y points down, so this is clockwise-positive
  }

  function releaseContact(c) {
    if (c.wheel >= 0) {
      const stillHeld = [...contacts.values()].some((o) => o !== c && o.wheel === c.wheel);
      if (!stillHeld) E.release(wheels[c.wheel]);
    }
  }

  canvas.addEventListener("pointerdown", (ev) => {
    if (ev.button !== undefined && ev.button > 0) return;
    ensureAudio();
    const p = local(ev);
    const i = hitWheel(p);
    contacts.set(ev.pointerId, { wheel: i, x: p.x, y: p.y, t: ev.timeStamp, lastMove: performance.now(), fresh: true });
    if (i >= 0) wheels[i].held = true;
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    ev.preventDefault();
    requestDraw();
  });

  canvas.addEventListener("pointermove", (ev) => {
    const c = contacts.get(ev.pointerId);
    if (!c) return;
    const events = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
    for (const e of events.length ? events : [ev]) {
      const p = local(e);
      const dt = Math.max(0.001, (e.timeStamp - c.t) / 1000);
      const i = hitWheel(p);
      if (i !== c.wheel) {
        // Brushing from one drum onto the next.
        releaseContact(c);
        c.wheel = i;
        c.fresh = true;
        if (i >= 0) wheels[i].held = true;
      } else if (i >= 0) {
        const d = rotationBetween(i, c, p);
        if (d !== 0) {
          account(wheels[i], E.drag(wheels[i], d, dt, c.fresh));
          c.fresh = false;
          c.lastMove = performance.now();
        }
      }
      c.x = p.x;
      c.y = p.y;
      c.t = e.timeStamp;
    }
    requestDraw();
  });

  function endPointer(ev) {
    const c = contacts.get(ev.pointerId);
    if (!c) return;
    contacts.delete(ev.pointerId);
    // A finger resting before lifting has stopped the wheel; a flick keeps it going.
    if (c.wheel >= 0 && performance.now() - c.lastMove > 80) wheels[c.wheel].omega = 0;
    releaseContact(c);
    requestDraw();
  }

  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("lostpointercapture", endPointer);

  /* ---------- Input: mouse wheel and trackpad ---------- */

  const wheelScroll = new Map();  // wheel index -> {t, timer}

  canvas.addEventListener("wheel", (ev) => {
    const p = local(ev);
    const i = view === "top" ? 0 : hitWheel(p);
    if (i < 0) return;
    ev.preventDefault();
    const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? cssH : 1;
    const dx = ev.deltaX * unit;
    const dy = ev.deltaY * unit;
    // Fingers moving left on a trackpad, or scrolling down, turn clockwise.
    const d = (dx + dy) / (geom[i].R * (view === "side" ? 1 : 1.2));
    const prev = wheelScroll.get(i);
    const dt = prev ? Math.max(0.008, (ev.timeStamp - prev.t) / 1000) : 1 / 60;
    if (prev) clearTimeout(prev.timer);
    account(wheels[i], E.drag(wheels[i], d, dt, !prev));
    const timer = setTimeout(() => {
      wheelScroll.delete(i);
      E.release(wheels[i]);
      requestDraw();
    }, 120);
    wheelScroll.set(i, { t: ev.timeStamp, timer });
    requestDraw();
  }, { passive: false });

  /* ---------- Input: keyboard ---------- */

  canvas.addEventListener("keydown", (ev) => {
    let dir = 0;
    if (ev.key === " " || ev.key === "Enter") dir = 1;
    else if (view === "side" && ev.key === "ArrowLeft") dir = 1;
    else if (view === "side" && ev.key === "ArrowRight") dir = -1;
    else if (view === "top" && (ev.key === "ArrowRight" || ev.key === "ArrowDown")) dir = 1;
    else if (view === "top" && (ev.key === "ArrowLeft" || ev.key === "ArrowUp")) dir = -1;
    if (!dir) return;
    ev.preventDefault();
    ensureAudio();
    for (const w of wheels) E.push(w, dir * 4);
    requestDraw();
  });

  /* ---------- Settings UI ---------- */

  /* Traditional Mongolian names for powers of ten. */
  const MN_NUMBERS = { 1e3: "мянга", 1e4: "түм", 1e5: "бум", 1e6: "сая", 1e7: "живаа", 1e8: "дүнчүүр" };

  function scrollLabel(n) {
    if (settings.lang === "mn") return MN_NUMBERS[n] || String(n);
    if (n >= 1e6) return (n / 1e6) + " million";
    try { return n.toLocaleString("en-US"); } catch (e) { return String(n); }
  }

  function fillScrollOptions() {
    const sel = $("#scroll");
    sel.innerHTML = "";
    for (const n of E.SCROLL_SIZES) {
      const o = document.createElement("option");
      o.value = String(n);
      o.textContent = scrollLabel(n);
      if (n === settings.scroll) o.selected = true;
      sel.appendChild(o);
    }
  }

  function updateHint() {
    let text = view === "side" ? t("hintSide") : t("hintTop");
    if (!coarse.matches) text += " " + t("hintDesk");
    out.hint.textContent = text;
  }

  function applyLanguage() {
    const lang = settings.lang;
    document.documentElement.lang = lang;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-label]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nLabel)); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll(".lang button").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
    });
    fillScrollOptions();
    updateHint();
    updateCounts();
    if (fsEnabled) updateFullscreenButton();
  }

  function setLanguage(lang) {
    if (!STRINGS[lang]) return;
    settings.lang = lang;
    store.set("lang", lang);
    try {
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    } catch (e) { /* ignore */ }
    applyLanguage();
  }

  document.querySelectorAll(".lang button").forEach((b) => {
    b.addEventListener("click", () => setLanguage(b.dataset.lang));
  });

  function bindRadios(name, key, onChange) {
    document.querySelectorAll("input[name=\"" + name + "\"]").forEach((input) => {
      input.checked = input.value === settings[key];
      input.addEventListener("change", () => {
        if (!input.checked) return;
        settings[key] = input.value;
        store.set(key, input.value);
        onChange();
      });
    });
  }

  bindRadios("view", "view", () => {
    for (const w of wheels) w.lastDraw = undefined;
    layout();
  });

  bindRadios("mode", "mode", () => {
    for (const w of wheels) {
      w.mode = settings.mode;
      if (w.mode === "ratchet" && w.omega < 0) w.omega = 0;
    }
    requestDraw();
  });

  $("#scroll").addEventListener("change", (ev) => {
    const n = Number(ev.target.value);
    if (!E.SCROLL_SIZES.includes(n)) return;
    banked = E.bank(banked, wheels, settings.scroll);
    restartWheels();
    settings.scroll = n;
    store.set("scroll", n);
    save();
    requestDraw();
  });

  const bell = $("#bell");
  bell.checked = settings.bell;
  bell.addEventListener("change", () => {
    settings.bell = bell.checked;
    store.set("bell", bell.checked ? "1" : "0");
    if (settings.bell) { ensureAudio(); ring(); }
  });

  $("#reset").addEventListener("click", () => {
    if (!window.confirm(t("resetConfirm"))) return;
    banked = { turns: 0n, mani: 0n };
    sessionStart = 0n;
    restartWheels();
    save();
    updateCounts();
    requestDraw();
  });

  /* Turn every drum back to its starting position (Om in front). The count
   * restarts from the bank, so the drums' faces, bands and count agree. */
  function restartWheels() {
    for (const w of wheels) {
      w.acc = 0;
      w.angle = 0;
      w.omega = 0;
      w.ring = 0;
      w.recoil = 0;
      w.lastDraw = undefined;
      w.bandStep = 0;
      w.bandFrame = 0;
    }
  }

  /* ---------- Full screen ---------- */

  const fsButton = $("#fullscreen");
  const fsEnabled = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  function updateFullscreenButton() {
    const on = !!fsElement();
    fsButton.setAttribute("aria-pressed", on ? "true" : "false");
    fsButton.setAttribute("aria-label", t(on ? "exitFullscreen" : "fullscreen"));
    fsButton.title = t(on ? "exitFullscreen" : "fullscreen");
    document.documentElement.classList.toggle("is-fullscreen", on);
  }

  if (fsEnabled) {
    fsButton.hidden = false;
    fsButton.addEventListener("click", () => {
      const root = document.documentElement;
      try {
        if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        else (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: "hide" });
      } catch (e) { /* the browser refused; nothing to do */ }
    });
    document.addEventListener("fullscreenchange", () => { updateFullscreenButton(); queueLayout(); });
    document.addEventListener("webkitfullscreenchange", () => { updateFullscreenButton(); queueLayout(); });
  }

  /* ---------- Start ---------- */

  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });

  let resizeQueued = false;
  function queueLayout() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => { resizeQueued = false; layout(); });
  }
  if (window.ResizeObserver) new ResizeObserver(queueLayout).observe(stage);
  window.addEventListener("resize", queueLayout);

  applyLanguage();
  layout();

  // Re-render the syllables once the Tibetan font has loaded.
  if (document.fonts && document.fonts.load) {
    document.fonts.load("700 40px \"Khurd Tibetan\"", "ཨོཾ").then(() => {
      sprites = null;
      bandMetrics = null;
      layout();
    }).catch(() => {});
  }
})();
