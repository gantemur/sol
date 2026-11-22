// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
(() => {
  "use strict";
  const M = window.OvalTrack;
  if (!M) throw new Error("Oval Track model.js must load before app.js");
  const el = id => document.getElementById(id);
  const I = {
    mn: {
      back:"← Sol", language:"Хэл сонгох", eyebrow:"Математикийн тоглоом", title:"Зууван зам",
      intro:"Найман дугуйг эргүүлж, дөрвийг нь урвуулаарай. Цөөн хөдөлгөөнөөр ямар сэлгэлт хийж болох бол?",
      playTitle:"Тоглох талбар", home:"Эхлэл", moveControls:"Зам ба эргүүлдэг хэсгийн хөдөлгөөнүүд",
      secondaryControls:"Тоглоомын удирдлага", left:"Зүүн", right:"Баруун", flip:"Урвуулах",
      undo:"↶ Буцаах", scramble:"⤨ Холих", reset:"↺ Эхлэл",
      history:"Хөдөлгөөний дараалал", chronological:"Зүүнээс баруун руу →",
      emptyHistory:"Хөдөлгөөн алга", moreHistory:"өмнөх хөдөлгөөн",
      shortcuts:"Товчлуур: ← / → зам эргүүлэх, F дөрвийг урвуулах, Z буцаах.",
      aligned:"● Эх байдал", rotated:"◌ Дараалал зөв, байрлал зөрсөн", mixed:"● Байрлал өөрчлөгдсөн",
      moveCount:"хөдөлгөөн", boardAria:"1–8-р байрлал дахь дугуйнууд:",
      discoverEyebrow:"Ажиглаж нээгээрэй", discoverTitle:"Гурван туршилт",
      hint:"Сэжүүр", explain:"Тайлбар", previous:"← Өмнөх", next:"Дараах →",
      mathTitle:"Математикийг үзэх", mathLead:"Дугуй бүр анхныхаа байрлалаас хаашаа очсоныг сэлгэлт гэж үзье.",
      positions:"Байрлал 1–8 дээрх дугуйнууд", permMapping:"Дугуй 1–8-ийн очсон байрлал",
      cycles:"Циклээр бичвэл", order:"Энэ сэлгэлтийн зэрэг",
      mathConventions:"Байрлалууд тогтмол. (1 3) гэдэг нь эхлээд 1-р байранд байсан дугуй 3-р байр руу, 3-р байрны дугуй 1-р байр руу очсоныг илэрхийлнэ. RT гэвэл эхлээд R, дараа нь T хийнэ.",
      groupTitle:"Групп гэж юу вэ?",
      groupBody:"Хөдөлгөөнүүдийг дараалуулан хийж болно; хөдөлгөөн бүрийг буцааж болно; юу ч өөрчлөхгүй хөдөлгөөн бий. Дараалуулах үйлдэл хаалттай, ассоциатив. Эдгээр нь группийн гол шинжүүд. Энэ тоглоомын R ба T хөдөлгөөнөөр 8! = 40 320 сэлгэлт бүгд үүснэ.",
      backBottom:"← Sol-ийн хэрэгслүүд",
      ex1Title:"Буцааж болох уу?", ex1Desc:"Нэг хөдөлгөөнийг хийгээд дахин хийвэл яах бол? Харин замыг тойруулж эргүүлбэл хэдэн алхмын дараа бүх дугуй эхэндээ ирэх вэ?",
      ex1Hint:"T-г хоёр удаа, эсвэл R-г найман удаа хийгээд харьцуул.",
      ex1Explain:"T² = e, R⁸ = e. R-ийн урвуу нь R⁻¹, T-ийн урвуу нь T өөрөө. Аливаа дарааллыг буцаахын тулд урвуу хөдөлгөөнүүдийг эсрэг дарааллаар хийнэ.",
      ex2Title:"Дараалал чухал уу?", ex2Desc:"Эх байдлаас R дараа T хий. Дахин эхлээд T дараа R хий. Хоёр үр дүн ижил үү?",
      ex2Hint:"RT ба TR-ийг тус тусад нь туршихдаа эх байдалд заавал эргэн оч.",
      ex2Explain:"RT ≠ TR. RT нь [3 2 1 8 4 5 6 7], харин TR нь [8 4 3 2 1 5 6 7] болно. Иймээс хөдөлгөөнүүдийн дараалал үр дүнд нөлөөлдөг.",
      ex3Title:"Олон алхам, өчүүхэн өөрчлөлт", ex3Desc:"R дараа T гэдгийг таван удаа давт. Арван хөдөлгөөн хийсэн атлаа хэдэн дугуй байрлалаа сольсон бэ?",
      ex3Hint:"Нэг удаагийн RT нь (1 3)(4 5 6 7 8). Энэ хоёр цикл 2 ба 5 урттай.",
      ex3Explain:"RT = (1 3)(4 5 6 7 8). Үүнийг тав давтахад таван гишүүнт цикл буцаж хэвэндээ орно, харин (1 3) хэвээр үлдэнэ. Өөрөөр хэлбэл арван алхам зөвхөн 1, 3-р дугуйг сольжээ. Дахин тав давтвал бүгд хэвэндээ орно.",
      tryTT:"T · T", tryR8:"R × 8", tryRT:"R дараа T", tryTR:"T дараа R",
      trySwap:"(RT) × 5", tryReturn:"(RT) × 10",
      noteTT:"T-г хоёр удаа хийхэд эх байдалд эргэж ирэв.",
      noteR8:"R-г найман удаа хийхэд эх байдалд эргэж ирэв.",
      noteRT:"RT-ийн дараах байдал:", noteTR:"TR-ийн дараах байдал:",
      noteSwap:"Зөвхөн 1 ба 3 дугуй байрлалаа солив.", noteReturn:"Арван RT хослолын дараа бүгд эхэндээ ирэв.",
      compare:"Хоёр үр дүн ялгаатай байна.",
      busy:"Хөдөлгөөнүүдийг тоглуулж байна…"
    },
    en: {
      back:"← Sol", language:"Choose language", eyebrow:"Mathematical puzzle", title:"Oval track",
      intro:"Rotate eight numbered disks, or reverse four at once. Which permutations can you make with these simple moves?",
      playTitle:"Puzzle board", home:"Home", moveControls:"Track and turntable moves",
      secondaryControls:"Puzzle controls", left:"Left", right:"Right", flip:"Flip",
      undo:"↶ Undo", scramble:"⤨ Scramble", reset:"↺ Reset",
      history:"Move history", chronological:"Read left to right →",
      emptyHistory:"No moves yet", moreHistory:"earlier moves",
      shortcuts:"Keyboard: ← / → move the track, F flips four disks, Z undoes.",
      aligned:"● At home", rotated:"◌ In order, but rotated", mixed:"● Rearranged",
      moveCount:"moves", boardAria:"Tiles at positions 1–8:",
      discoverEyebrow:"Explore and discover", discoverTitle:"Three experiments",
      hint:"Hint", explain:"Explain", previous:"← Previous", next:"Next →",
      mathTitle:"Show the mathematics", mathLead:"Think of each disk's destination, relative to its original position, as a permutation.",
      positions:"Tiles at positions 1–8", permMapping:"Destinations of tiles 1–8",
      cycles:"Cycle notation", order:"Order of this permutation",
      mathConventions:"Positions stay fixed. (1 3) means the disk originally at position 1 went to position 3, and the disk originally at 3 went to 1. In a move word RT, do R first, then T.",
      groupTitle:"What is a group?",
      groupBody:"We can combine moves, undo every move, and do nothing (the identity). Combining moves is associative, and the collection is closed under combination. These are the essential group properties. Here R and T generate all 8! = 40,320 permutations.",
      backBottom:"← Other Sol tools",
      ex1Title:"Can you undo a move?", ex1Desc:"What happens if you repeat a flip? How many track rotations bring all eight disks home?",
      ex1Hint:"Try T twice or R eight times, starting from home.",
      ex1Explain:"T² = e and R⁸ = e. The inverse of R is R⁻¹; T is its own inverse. To undo a sequence, invert each move and perform the inverses in reverse order.",
      ex2Title:"Does order matter?", ex2Desc:"Starting at home, try R then T. Reset and try T then R. Do you get the same arrangement?",
      ex2Hint:"Compare RT with TR, making sure both start from home.",
      ex2Explain:"RT ≠ TR. RT produces [3 2 1 8 4 5 6 7], while TR produces [8 4 3 2 1 5 6 7]. The order of operations changes the result.",
      ex3Title:"Many moves, tiny change", ex3Desc:"Repeat R then T five times. After ten moves, how many disks are in different positions?",
      ex3Hint:"One RT has cycle form (1 3)(4 5 6 7 8), with cycles of lengths 2 and 5.",
      ex3Explain:"RT = (1 3)(4 5 6 7 8). Repeating it five times cancels the 5-cycle but leaves the transposition (1 3). Ten simple moves have exchanged only disks 1 and 3! Five more repetitions return all eight home.",
      tryTT:"T · T", tryR8:"R × 8", tryRT:"R then T", tryTR:"T then R",
      trySwap:"(RT) × 5", tryReturn:"(RT) × 10",
      noteTT:"Two flips returned every disk home.",
      noteR8:"Eight track rotations returned every disk home.",
      noteRT:"After RT:", noteTR:"After TR:",
      noteSwap:"Only disks 1 and 3 have exchanged positions.", noteReturn:"Ten RT pairs returned every disk home.",
      compare:"The two results are different.",
      busy:"Playing move sequence…"
    }
  };
  const ACTIONS = [
    [{ label:"tryTT", word:["T","T"], note:"noteTT" },
     { label:"tryR8", word:Array(8).fill("R"), note:"noteR8" }],
    [{ label:"tryRT", word:["R","T"], note:"noteRT" },
     { label:"tryTR", word:["T","R"], note:"noteTR" }],
    [{ label:"trySwap", word:Array.from({ length:5 }, () => ["R","T"]).flat(), note:"noteSwap" },
     { label:"tryReturn", word:Array.from({ length:10 }, () => ["R","T"]).flat(), note:"noteReturn" }]
  ];
  const POINTS = [
    {x:91,y:103},{x:164,y:103},{x:236,y:103},{x:309,y:103},
    {x:309,y:223},{x:236,y:223},{x:164,y:223},{x:91,y:223}
  ];
  const COLOR = ["#f7d79f","#b7ddd0","#f0cbb3","#c3d6f1","#f5d797","#b8d9cf","#e8d1df","#b9d8e3"];
  const state = {
    board:[...M.HOME], moves:[], challenge:0, reveal:null, note:null,
    compare:{}, highlights:[], lang:"mn"
  };
  const queue = [];
  const disks = new Map();
  let running = false;
  let cancelAnimation = null;
  const svgNs = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function t(key) { return I[state.lang][key] ?? I.mn[key] ?? key; }
  function text(id, value) { el(id).textContent = value; }
  function str(board) { return board.join(" "); }
  function choiceFromURL() {
    const p = new URLSearchParams(location.search).get("lang");
    if (p === "mn" || p === "en") return p;
    try {
      const saved = localStorage.getItem("sol-language");
      if (saved === "mn" || saved === "en") return saved;
    } catch (_) { /* storage is optional */ }
    return "mn";
  }
  function setLanguage(lang, updateURL = false) {
    if (lang !== "mn" && lang !== "en") return;
    state.lang = lang;
    document.documentElement.lang = lang;
    document.title = t("title") + " · Sol";
    document.querySelectorAll("[data-i18n]").forEach(node => {
      node.textContent = t(node.dataset.i18n);
      if (node.tagName.toLowerCase() === "summary") {
        const ico = document.createElement("span");
        ico.className = "summary-icon"; ico.setAttribute("aria-hidden", "true");
        ico.textContent = "⌄"; node.appendChild(ico);
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => {
      node.setAttribute("aria-label", t(node.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    try { localStorage.setItem("sol-language", lang); } catch (_) { /* optional */ }
    if (updateURL) {
      try {
        const url = new URL(location.href);
        url.searchParams.set("lang", lang);
        history.replaceState(null, "", url);
      } catch (_) { /* file URLs, restrictive browsers */ }
    }
    render();
  }
  function makeDisk(tile) {
    const group = document.createElementNS(svgNs, "g");
    group.setAttribute("class", "disk");
    group.setAttribute("data-tile", tile);
    const shadow = document.createElementNS(svgNs, "circle");
    shadow.setAttribute("r", "23"); shadow.setAttribute("class", "disk-shadow");
    const body = document.createElementNS(svgNs, "circle");
    body.setAttribute("r", "23"); body.setAttribute("class", "disk-body");
    body.setAttribute("fill", COLOR[tile-1]);
    group.style.setProperty("--tile", COLOR[tile-1]);
    const glint = document.createElementNS(svgNs, "path");
    glint.setAttribute("d", "M-15 -9 A17 17 0 0 1 8 -16");
    glint.setAttribute("class", "disk-glint");
    const label = document.createElementNS(svgNs, "text");
    label.setAttribute("y", "1");
    label.textContent = String(tile);
    group.append(shadow, body, glint, label);
    el("diskLayer").appendChild(group);
    disks.set(tile, group);
  }
  function putTile(tile, x, y) {
    disks.get(tile).setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ")");
  }
  function drawBoard() {
    state.board.forEach((tile, pos) => putTile(tile, POINTS[pos].x, POINTS[pos].y));
    disks.forEach((node, tile) => node.classList.toggle("highlighted", state.highlights.includes(tile)));
  }
  function status() {
    if (M.isHome(state.board)) return t("aligned");
    return M.isCyclicOrder(state.board) ? t("rotated") : t("mixed");
  }
  function renderInfo() {
    text("boardStatus", status());
    text("moveCounter", state.moves.length + " " + t("moveCount"));
    el("undoBtn").disabled = state.moves.length === 0 && queue.length === 0;
    el("ovalBoard").setAttribute("aria-label", t("boardAria") + " " + str(state.board));
    text("boardArray", str(state.board));
    const p = M.permutationOf(state.board);
    text("permMapping", str(p));
    text("cycleOutput", M.cycleText(p));
    text("orderOutput", String(M.orderOf(p)));
    const log = el("moveHistory");
    log.replaceChildren();
    if (!state.moves.length) {
      const empty = document.createElement("span");
      empty.className = "history-empty";
      empty.textContent = t("emptyHistory");
      log.appendChild(empty);
    } else {
      if (state.moves.length > 22) {
        const overflow = document.createElement("span");
        overflow.className = "history-overflow";
        overflow.textContent = "…" + (state.moves.length - 22) + " " + t("moreHistory");
        log.appendChild(overflow);
      }
      state.moves.slice(-22).forEach(code => {
        const span = document.createElement("span");
        span.className = "history-chip";
        span.textContent = code === "L" ? "R⁻¹" : code;
        log.appendChild(span);
      });
    }
    renderResult();
  }
  function renderResult() {
    const pieces = [];
    if (state.note) {
      pieces.push(t(state.note));
      if (state.note === "noteRT" || state.note === "noteTR")
        pieces.push(str(state.board));
    }
    if (state.challenge === 1 && state.compare.RT && state.compare.TR) {
      pieces.push("RT: " + str(state.compare.RT));
      pieces.push("TR: " + str(state.compare.TR));
      pieces.push(t("compare"));
    }
    text("experimentResult", pieces.join("\n"));
    el("experimentResult").style.whiteSpace = "pre-line";
  }
  function renderChallenge() {
    const i = state.challenge + 1;
    text("stepIndicator", i + " / 3");
    text("challengeTitle", t("ex" + i + "Title"));
    text("challengeDescription", t("ex" + i + "Desc"));
    const actions = el("experimentActions");
    actions.replaceChildren();
    ACTIONS[state.challenge].forEach(spec => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = t(spec.label);
      button.addEventListener("click", () => startDemo(spec));
      actions.appendChild(button);
    });
    const reveal = el("challengeReveal");
    reveal.hidden = !state.reveal;
    if (state.reveal) reveal.textContent = t("ex" + i + (state.reveal === "hint" ? "Hint" : "Explain"));
    el("prevBtn").disabled = state.challenge === 0;
    el("nextBtn").disabled = state.challenge === 2;
    document.querySelectorAll(".step-dots span").forEach((dot, ix) => dot.classList.toggle("active", ix === state.challenge));
  }
  function render() { renderInfo(); renderChallenge(); drawBoard(); }

  // A self-contained move tween, with the letter/number faces kept upright.
  function animate(oldBoard, newBoard, code) {
    if ((reduceMotion && reduceMotion.matches) || typeof requestAnimationFrame === "undefined") {
      drawBoard(); return Promise.resolve();
    }
    const duration = code === "T" ? 380 : 250;
    const startByTile = new Map(oldBoard.map((tile, index) => [tile, index]));
    const endByTile = new Map(newBoard.map((tile, index) => [tile, index]));
    return new Promise(resolve => {
      let frame = 0, settled = false;
      function finish() {
        if (settled) return;
        settled = true;
        if (frame) cancelAnimationFrame(frame);
        cancelAnimation = null;
        drawBoard();
        resolve();
      }
      cancelAnimation = finish;
      let begun = null;
      function tick(time) {
        if (begun === null) begun = time;
        const fraction = Math.min(1, Math.max(0, (time - begun) / duration));
        const eased = fraction * fraction * (3 - 2 * fraction);
        for (const tile of M.HOME) {
          const fromIndex = startByTile.get(tile), toIndex = endByTile.get(tile);
          const a = POINTS[fromIndex], b = POINTS[toIndex];
          let x = a.x + (b.x - a.x) * eased;
          let y = a.y + (b.y - a.y) * eased;
          if (code === "T" && fromIndex < 4) {
            // A projected half-turn of the four-slot table (no glyph rotation).
            const dx = a.x - 200;
            x = 200 + dx * Math.cos(Math.PI * eased);
            y = 103 + dx * 0.65 * Math.sin(Math.PI * eased);
          } else if (code === "R" && fromIndex === 3) {
            x = a.x + 29 * Math.sin(Math.PI * eased);
          } else if (code === "R" && fromIndex === 7) {
            x = a.x - 29 * Math.sin(Math.PI * eased);
          } else if (code === "L" && fromIndex === 4) {
            x = a.x + 29 * Math.sin(Math.PI * eased);
          } else if (code === "L" && fromIndex === 0) {
            x = a.x - 29 * Math.sin(Math.PI * eased);
          }
          putTile(tile, x, y);
        }
        if (fraction < 1) frame = requestAnimationFrame(tick);
        else finish();
      }
      frame = requestAnimationFrame(tick);
    });
  }
  function enqueue(task) {
    queue.push(task);
    drain();
  }
  async function drain() {
    if (running) return;
    running = true;
    try {
      while (queue.length) {
        const task = queue.shift();
        if (task.kind === "note") {
          state.note = task.key;
          if (task.key === "noteRT") state.compare.RT = [...state.board];
          if (task.key === "noteTR") state.compare.TR = [...state.board];
          if (task.key === "noteSwap") state.highlights = [1,3];
          drawBoard(); renderInfo();
          continue;
        }
        let code = task.code;
        if (task.kind === "undo") {
          const last = state.moves.pop();
          if (!last) { renderInfo(); continue; }
          code = M.inverse(last);
        } else {
          state.moves.push(code);
        }
        state.note = null;
        state.highlights = [];
        const before = [...state.board];
        state.board = M.move(before, code);
        renderInfo();
        await animate(before, state.board, code);
      }
    } finally {
      running = false;
      renderInfo();
      drawBoard();
    }
  }
  function resetBoard() {
    queue.length = 0;
    if (cancelAnimation) cancelAnimation();
    state.board = [...M.HOME];
    state.moves = [];
    state.note = null;
    state.highlights = [];
    renderInfo();
    drawBoard();
  }
  function scramble() {
    resetBoard();
    const w = M.randomScramble(13);
    state.board = M.word(state.board, w);
    // The scramble defines a fresh starting state; only subsequent moves appear in history.
    if (M.isHome(state.board)) state.board = M.move(state.board, "R");
    renderInfo(); drawBoard();
  }
  function startDemo(spec) {
    resetBoard();
    for (const code of spec.word) enqueue({ kind:"move", code });
    enqueue({ kind:"note", key:spec.note });
  }
  function changeChallenge(delta) {
    // Stop any queued demonstration so its final note cannot leak into another experiment.
    queue.length = 0;
    if (cancelAnimation) cancelAnimation();
    state.challenge = Math.max(0, Math.min(2, state.challenge + delta));
    state.reveal = null;
    state.note = null;
    state.compare = {};
    state.highlights = [];
    render();
  }

  M.HOME.forEach(makeDisk);
  const initialLang = choiceFromURL();
  setLanguage(initialLang);
  el("moveLeft").addEventListener("click", () => enqueue({kind:"move",code:"L"}));
  el("moveRight").addEventListener("click", () => enqueue({kind:"move",code:"R"}));
  el("moveFlip").addEventListener("click", () => enqueue({kind:"move",code:"T"}));
  el("undoBtn").addEventListener("click", () => enqueue({kind:"undo"}));
  el("resetBtn").addEventListener("click", resetBoard);
  el("scrambleBtn").addEventListener("click", scramble);
  document.querySelectorAll("[data-lang]").forEach(btn =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang, true)));
  el("prevBtn").addEventListener("click", () => changeChallenge(-1));
  el("nextBtn").addEventListener("click", () => changeChallenge(1));
  el("hintBtn").addEventListener("click", () => {
    state.reveal = state.reveal === "hint" ? null : "hint"; renderChallenge();
  });
  el("answerBtn").addEventListener("click", () => {
    state.reveal = state.reveal === "answer" ? null : "answer"; renderChallenge();
  });
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey ||
        /^(INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY)$/.test(document.activeElement?.tagName || "")) return;
    let code;
    if (event.key === "ArrowRight") code = "R";
    else if (event.key === "ArrowLeft") code = "L";
    else if (event.key.toLowerCase() === "f") code = "T";
    else if (event.key.toLowerCase() === "z") {
      event.preventDefault(); enqueue({kind:"undo"}); return;
    }
    if (code) { event.preventDefault(); enqueue({kind:"move",code}); }
  });
})();
