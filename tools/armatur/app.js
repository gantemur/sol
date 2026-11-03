(function () {
  "use strict";
  var Engine = window.ArmaturEngine;
  var $ = function (id) { return document.getElementById(id); };
  var language = "mn", lastUnit = "mm", current = null, view = "best";
  var worker = null, timer = null, requestId = 0, statusKey = "", statusDetail = "", statusBad = false;
  var palette = ["#2d7f82", "#567db0", "#a36d9d", "#5d9680", "#b17e55", "#747fb0", "#638d9b"];
  var words = {
    mn: {
      title: "Арматур · Таслах төлөвлөгөө",
      subtitle: "Стандарт саваанаас хэрэгтэй уртуудыг бага хаягдалтай таслах.",
      stockEyebrow: "01 · Материал", stockHeading: "Стандарт саваа",
      stockLength: "Урт", unit: "Уртын нэгж", diameter: "Диаметр (мм)",
      kerf: "Нэг зүсэлтийн өргөн (мм)",
      unitHint: "Саваа ба захиалсан уртууд ижил нэгжтэй. Диаметр болон зүсэлтийн өргөн үргэлж мм-ээр.",
      piecesEyebrow: "02 · Захиалга", piecesHeading: "Таслах хэсгүүд",
      pieceLength: "Урт", quantity: "Тоо ширхэг", actions: "Үйлдэл",
      example: "Жишээ ачаалах", addRow: "Мөр нэмэх",
      precisionHint: "Уртын нарийвчлал: 0.1 мм",
      calculate: "Таслах төлөвлөгөө гаргах",
      resultsEyebrow: "03 · Үр дүн", resultsHeading: "Таслах төлөвлөгөө",
      patternsHeading: "Зүсэлтийн хувилбарууд", bestView: "Сайжруулсан",
      greedyView: "Энгийн", diagramHint: "Зурагт хэсэг бүрийн урт, ирний хаягдал, үлдэгдлийг харуулав. Ижил төлөвлөгөөг бүлэглэсэн.",
      copy: "Жагсаалт хуулах", csv: "CSV татах", print: "Хэвлэх",
      helpHeading: "Тооцоолох аргын тухай",
      helpText: "Энгийн арга урт хэсгүүдээс эхэлж савааг дүүргэнэ. Сайжруулсан арга өөр олон байрлалыг шалгана. Бага захиалгад оновчтой эсэхийг баталж чадна; том захиалгад олдсон хамгийн сайн төлөвлөгөөг харуулна. Ирний өргөн нь бодит зүсэлт бүрт хамаарна. Савааг яг дүүргэвэл сүүлийн хэсгийг тусад нь таслах шаардлагагүй.",
      legacyLink: "Засварласан хуучин хувилбар",
      footer: "Дотооддоо тооцоолно · сүлжээ, бүртгэл шаардлагагүй",
      duplicate: "Хуулах", remove: "Арилгах",
      rods: "Нийт саваа", waste: "Нийт хаягдал", weight: "Нийт жин (ойролцоо)",
      sawCuts: "Нийт зүсэлт", offcut: "Үлдэгдэл", kerfLoss: "Ирэнд алдсан",
      proven: "Оновчтой нь батлагдсан", bestKnown: "Олдсон сайн хувилбар",
      greedyMode: "Энгийн арга · баталгаагүй",
      optimizing: "Сайжруулсан хувилбар хайж байна…",
      ready: "Тооцоо дууслаа.", failed: "Сайжруулах тооцоо бүтсэнгүй. Энгийн төлөвлөгөөг хадгалав.",
      timeout: "Хугацааны хязгаарт хүрлээ. Одоогийн төлөвлөгөөг харуулав.",
      saved: "Энгийн аргаас {n} саваагаар цөөн.",
      equal: "Одоогоор энгийн аргатай ижил тооны саваа хэрэгтэй.",
      lowerBound: "Онолын доод хязгаар: {n} саваа.",
      times: "{n} саваанд энэ зүсэлт", pieces: "Хэсгүүд",
      details: "Нэг савааны үлдэгдэл: {offcut}; зүсэлт: {cuts}; ирний хаягдал: {kerf}",
      simplified: "Олон жижиг хэсгийг зурагт нэгтгэв.",
      hiddenPatterns: "Нэмж {n} төрлийн зүсэлт бий; CSV-ээс бүгдийг үзнэ үү.",
      copySuccess: "Таслах жагсаалтыг хууллаа.", copyFailure: "Хуулах боломжгүй байна. CSV татаж болно.",
      invalidPrefix: "Оролтыг шалгана уу: ",
      exampleLoaded: "Оновчлолын жишээг ачааллаа.",
      needRows: "Дор хаяж нэг мөр оруулна уу."
    },
    en: {
      title: "Armatur · Cutting planner",
      subtitle: "Cut requested lengths from standard rods with less waste.",
      stockEyebrow: "01 · Material", stockHeading: "Standard stock",
      stockLength: "Length", unit: "Length unit", diameter: "Diameter (mm)",
      kerf: "Saw cut width (mm)",
      unitHint: "Stock and requested lengths share one unit. Diameter and kerf are always in mm.",
      piecesEyebrow: "02 · Order", piecesHeading: "Requested pieces",
      pieceLength: "Length", quantity: "Quantity", actions: "Actions",
      example: "Load example", addRow: "Add row",
      precisionHint: "Length precision: 0.1 mm",
      calculate: "Find cutting plan",
      resultsEyebrow: "03 · Result", resultsHeading: "Cutting plan",
      patternsHeading: "Cutting patterns", bestView: "Improved",
      greedyView: "Greedy", diagramHint: "Drawings show pieces, saw loss, and offcuts. Identical patterns are grouped.",
      copy: "Copy cutting list", csv: "Download CSV", print: "Print",
      helpHeading: "How the calculation works",
      helpText: "The greedy method fills rods from the longest pieces down. The improved method searches alternative arrangements. For small orders it may prove optimality; for larger orders it shows the best arrangement found. Kerf applies to each actual cut. When a rod is filled exactly, the final piece needs no separating cut.",
      legacyLink: "Corrected legacy version",
      footer: "Runs locally in your browser · no account or server required",
      duplicate: "Duplicate", remove: "Delete",
      rods: "Stock rods", waste: "Total waste", weight: "Estimated mass",
      sawCuts: "Saw cuts", offcut: "Offcut", kerfLoss: "Saw loss",
      proven: "Proven optimal", bestKnown: "Best found (not proven)",
      greedyMode: "Greedy baseline",
      optimizing: "Searching for an improved layout…",
      ready: "Calculation complete.", failed: "Optimization failed; the greedy plan is still available.",
      timeout: "Time limit reached. Showing the current plan.",
      saved: "Uses {n} fewer rods than greedy.",
      equal: "Currently uses the same number of rods as greedy.",
      lowerBound: "Length-based lower bound: {n} rods.",
      times: "This pattern × {n} rods", pieces: "Pieces",
      details: "Offcut per rod: {offcut}; cuts: {cuts}; saw loss: {kerf}",
      simplified: "Tiny pieces are combined in this drawing.",
      hiddenPatterns: "{n} more patterns omitted from view; download the CSV for all.",
      copySuccess: "Cutting list copied.", copyFailure: "Clipboard unavailable; download CSV instead.",
      invalidPrefix: "Check input: ",
      exampleLoaded: "Optimization example loaded.",
      needRows: "Enter at least one row."
    }
  };

  function t(key, args) {
    var value = words[language][key] || key;
    if (args) Object.keys(args).forEach(function (name) {
      value = value.replace("{" + name + "}", args[name]);
    });
    return value;
  }
  function number(value, digits) {
    return new Intl.NumberFormat(language === "mn" ? "mn-MN" : "en-US", {
      maximumFractionDigits: digits === undefined ? 2 : digits
    }).format(value);
  }
  function length(ticks, job) {
    var precision = { mm: 1, cm: 2, m: 4 }[job.unit];
    var suffix = language === "mn" ? { mm: "мм", cm: "см", m: "м" }[job.unit] : job.unit;
    return number(ticks / Engine.UNIT_FACTORS[job.unit], precision) + " " + suffix;
  }
  function errorText(error) {
    var msg = error.message || String(error);
    if (language === "en") return msg;
    var rowMatch = msg.match(/(?:Length|Quantity) in row (\d+)/);
    if (rowMatch) {
      if (msg.indexOf("Quantity") === 0) return rowMatch[1] + "-р мөрийн тоо ширхэг эерэг бүхэл тоо байх ёстой.";
      if (msg.includes("exceeds")) return rowMatch[1] + "-р мөрийн урт стандартаас их байна.";
      if (msg.includes("insufficient")) return rowMatch[1] + "-р мөрийн урт зүсэлтийн өргөнд багтахгүй байна.";
      return rowMatch[1] + "-р мөрийн уртыг зөв оруулна уу (0.1 мм нарийвчлал).";
    }
    if (msg.includes("Stock length")) return "Стандарт савааны уртыг эерэг утгаар оруулна уу (0.1 мм нарийвчлал).";
    if (msg.includes("Kerf")) return "Ирний өргөнийг 0 ба түүнээс их тоогоор, 0.1 мм нарийвчлалтай оруулна уу.";
    if (msg.includes("Diameter")) return "Диаметрийг мм-ээр эерэг тоогоор оруулна уу.";
    if (msg.includes("requested lengths")) return "1–60 төрлийн урт оруулна уу.";
    if (msg.includes("1,000,000")) return "Нийт 1,000,000-аас олон хэсгийг тооцохгүй.";
    return t("invalidPrefix") + msg;
  }
  function setStatus(key, detail, bad) {
    statusKey = key; statusDetail = detail || ""; statusBad = !!bad;
    $("status").textContent = (key ? t(key) : "") + (detail ? " " + detail : "");
    $("status").classList.toggle("error", statusBad);
  }
  function markStale() {
    requestId++;
    if (worker) { worker.terminate(); worker = null; }
    if (timer) { clearTimeout(timer); timer = null; }
    current = null;
    $("results").hidden = true;
    setStatus("");
  }
  function rowInput(kind, value, index) {
    var input = document.createElement("input");
    input.className = kind;
    input.type = "number";
    input.step = kind === "piece-quantity" ? "1" : "any";
    input.min = kind === "piece-quantity" ? "1" : "0";
    input.inputMode = kind === "piece-quantity" ? "numeric" : "decimal";
    input.value = value === undefined ? "" : value;
    input.required = true;
    input.setAttribute("aria-label", (index + 1) + " · " +
      t(kind === "piece-quantity" ? "quantity" : "pieceLength"));
    return input;
  }
  function actionButton(symbol, action) {
    var button = document.createElement("button");
    button.type = "button"; button.className = "icon-button";
    button.dataset.action = action; button.textContent = symbol;
    button.title = t(action); button.setAttribute("aria-label", t(action));
    return button;
  }
  function addRow(item) {
    var index = $("item-rows").children.length;
    var tr = document.createElement("tr");
    var first = document.createElement("td");
    first.appendChild(rowInput("piece-length", item && item.length, index));
    var second = document.createElement("td");
    second.appendChild(rowInput("piece-quantity", item && item.quantity, index));
    var third = document.createElement("td");
    third.append(actionButton("⧉", "duplicate"), actionButton("×", "remove"));
    tr.append(first, second, third);
    $("item-rows").appendChild(tr);
    return tr;
  }
  function setRows(items) {
    $("item-rows").replaceChildren();
    items.forEach(addRow);
  }
  function readRows() {
    return Array.from($("item-rows").children).map(function (row) {
      return {
        length: row.querySelector(".piece-length").value,
        quantity: row.querySelector(".piece-quantity").value
      };
    });
  }
  function readOrder() {
    return {
      stockLength: $("stock-length").value, diameter: $("diameter").value,
      kerf: $("kerf").value, unit: $("unit").value, items: readRows()
    };
  }
  function convertUnit(oldUnit, newUnit) {
    if (oldUnit === newUnit) return;
    var precision = { mm: 1, cm: 2, m: 4 }[newUnit];
    var inputs = [$("stock-length")].concat(
      Array.from($("item-rows").querySelectorAll(".piece-length"))
    );
    inputs.forEach(function (input) {
      if (input.value === "") return;
      var value = Number(input.value);
      if (!Number.isFinite(value)) return;
      var converted = value * Engine.UNIT_FACTORS[oldUnit] / Engine.UNIT_FACTORS[newUnit];
      input.value = String(Number(converted.toFixed(precision)));
    });
    lastUnit = newUnit;
  }
  function setLanguage(next) {
    if (next !== "mn" && next !== "en") return;
    language = next;
    document.documentElement.lang = next;
    document.title = t("title") + " — Sol";
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-language]").forEach(function (button) {
      var selected = button.dataset.language === next;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    Array.from($("item-rows").children).forEach(function (row, index) {
      row.querySelector(".piece-length").setAttribute("aria-label", (index + 1) + " · " + t("pieceLength"));
      row.querySelector(".piece-quantity").setAttribute("aria-label", (index + 1) + " · " + t("quantity"));
      row.querySelectorAll("[data-action]").forEach(function (button) {
        button.title = t(button.dataset.action);
        button.setAttribute("aria-label", t(button.dataset.action));
      });
    });
    setStatus(statusKey, statusDetail, statusBad);
    if (current) renderResult();
  }

  function metric(name, value) {
    var box = document.createElement("div");
    box.className = "metric";
    var label = document.createElement("div"); label.className = "name"; label.textContent = name;
    var big = document.createElement("div"); big.className = "value"; big.textContent = value;
    box.append(big, label);
    return box;
  }
  function selectedPlan() {
    return view === "greedy" ? current.result.greedy : current.result.best;
  }
  function makeBar(pattern, job) {
    var bar = document.createElement("div"); bar.className = "bar";
    var maximumPieces = 100, drawn = 0;
    function pieceSegment(ticks, label, type) {
      var segment = document.createElement("div"); segment.className = "piece";
      segment.style.flexBasis = (100 * ticks / job.stockLength) + "%";
      segment.style.background = palette[type % palette.length];
      segment.title = label;
      if (ticks / job.stockLength >= .085) {
        var caption = document.createElement("span"); caption.textContent = label;
        segment.appendChild(caption);
      }
      bar.appendChild(segment);
    }
    function kerfSegment(ticks) {
      if (!ticks) return;
      var segment = document.createElement("div"); segment.className = "kerf";
      segment.style.flexBasis = (100 * ticks / job.stockLength) + "%";
      segment.title = t("kerfLoss") + ": " + length(ticks, job);
      bar.appendChild(segment);
    }
    if (pattern.pieceCount <= maximumPieces) {
      for (var i = 0; i < pattern.counts.length; i++) {
        for (var j = 0; j < pattern.counts[i]; j++) {
          pieceSegment(job.items[i].length, length(job.items[i].length, job), i);
          if (drawn < pattern.cuts) kerfSegment(job.kerf);
          drawn++;
        }
      }
    } else {
      pieceSegment(pattern.pieceLength, pattern.pieceCount + " " + t("pieces"), 0);
      kerfSegment(pattern.kerfLoss);
    }
    if (pattern.offcut > 0) {
      var offcut = document.createElement("div"); offcut.className = "offcut";
      if (pattern.offcut / job.stockLength >= .08) offcut.textContent = length(pattern.offcut, job);
      offcut.title = t("offcut") + ": " + length(pattern.offcut, job);
      bar.appendChild(offcut);
    }
    return bar;
  }
  function patternParts(pattern, job) {
    return pattern.counts.map(function (count, index) {
      return count ? length(job.items[index].length, job) + " × " + number(count, 0) : "";
    }).filter(Boolean).join(" · ");
  }
  function renderPatterns() {
    var job = current.job, plan = selectedPlan();
    var container = $("patterns"); container.replaceChildren();
    var maxVisible = 120;
    plan.patterns.slice(0, maxVisible).forEach(function (pattern, index) {
      var card = document.createElement("article"); card.className = "pattern";
      var header = document.createElement("div"); header.className = "pattern-header";
      var title = document.createElement("span"); title.className = "pattern-title";
      title.textContent = (index + 1) + ". " + t("times", { n: number(pattern.repeats, 0) });
      var rest = document.createElement("span"); rest.className = "pattern-offcut";
      rest.textContent = t("offcut") + ": " + length(pattern.offcut, job);
      header.append(title, rest);
      var description = document.createElement("p"); description.className = "pattern-text";
      description.textContent = patternParts(pattern, job);
      var detail = document.createElement("p"); detail.className = "pattern-text";
      detail.textContent = t("details", {
        offcut: length(pattern.offcut, job), cuts: number(pattern.cuts, 0),
        kerf: length(pattern.kerfLoss, job)
      });
      card.append(header, makeBar(pattern, job), description, detail);
      if (pattern.pieceCount > 100) {
        var note = document.createElement("p"); note.className = "hint";
        note.textContent = t("simplified"); card.appendChild(note);
      }
      container.appendChild(card);
    });
    if (plan.patterns.length > maxVisible) {
      var note = document.createElement("p"); note.className = "hint";
      note.textContent = t("hiddenPatterns", { n: number(plan.patterns.length - maxVisible, 0) });
      container.appendChild(note);
    }
  }
  function renderResult() {
    if (!current) return;
    var job = current.job, result = current.result, plan = selectedPlan();
    $("results").hidden = false;
    $("metrics").replaceChildren(
      metric(t("rods"), number(plan.stockCount, 0)),
      metric(t("waste"), length(plan.waste, job) + " · " + number(plan.wastePercent, 1) + "%"),
      metric(t("weight"), number(plan.massKg, 2) + (language === "mn" ? " кг" : " kg")),
      metric(t("sawCuts"), number(plan.cutsTotal, 0)),
      metric(t("offcut"), length(plan.offcutTotal, job)),
      metric(t("kerfLoss"), length(plan.kerfTotal, job))
    );
    var badge = $("proof-badge");
    badge.textContent = view === "greedy" ? t("greedyMode") :
      (result.optimal ? t("proven") : t("bestKnown"));
    badge.classList.toggle("proven", view === "best" && !!result.optimal);
    var saved = result.greedy.stockCount - result.best.stockCount;
    $("comparison").textContent = (saved > 0 ?
      t("saved", { n: number(saved, 0) }) : t("equal")) + " " +
      t("lowerBound", { n: number(result.lowerBound, 0) });
    ["best", "greedy"].forEach(function (key) {
      var button = $("show-" + key), selected = view === key;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderPatterns();
  }
  function optimize(raw, job, initial, id) {
    if (initial.stockCount === Math.ceil(job.totalLength / job.stockLength)) {
      setStatus("ready");
      return;
    }
    setStatus("optimizing");
    function useResult(result) {
      if (id !== requestId) return;
      if (timer) { clearTimeout(timer); timer = null; }
      if (worker) { worker.terminate(); worker = null; }
      current.result = result;
      renderResult(); setStatus("ready");
    }
    if (typeof Worker === "function") {
      try {
        worker = new Worker("optimizer-worker.js");
        worker.onmessage = function (event) {
          if (event.data.id !== id) return;
          if (event.data.error) {
            if (worker) { worker.terminate(); worker = null; }
            if (timer) { clearTimeout(timer); timer = null; }
            setStatus("failed", event.data.error, true);
          } else useResult(event.data.result);
        };
        worker.onerror = function () {
          if (id !== requestId) return;
          if (worker) { worker.terminate(); worker = null; }
          if (timer) { clearTimeout(timer); timer = null; }
          setStatus("failed", "", true);
        };
        worker.postMessage({ id: id, job: raw });
        timer = setTimeout(function () {
          if (id !== requestId) return;
          if (worker) { worker.terminate(); worker = null; }
          setStatus("timeout");
        }, 4000);
        return;
      } catch (_) {
        if (worker) { worker.terminate(); worker = null; }
      }
    }
    // Local-file / older-browser fallback, with a deliberately short search budget.
    setTimeout(function () {
      if (id !== requestId) return;
      try { useResult(Engine.solve(job, { timeLimitMs: 120, nodeLimit: 20000 })); }
      catch (error) { setStatus("failed", errorText(error), true); }
    }, 0);
  }
  function calculate(event) {
    event.preventDefault();
    markStale();
    try {
      var raw = readOrder(), job = Engine.validateJob(raw);
      var baseline = Engine.greedyPlan(job);
      current = {
        job: job,
        result: {
          greedy: baseline, best: baseline, lowerBound: Math.ceil(job.totalLength / job.stockLength),
          optimal: baseline.stockCount === Math.ceil(job.totalLength / job.stockLength)
        }
      };
      view = "best"; renderResult();
      optimize(raw, job, baseline, requestId);
    } catch (error) { setStatus("", errorText(error), true); $("status").classList.add("error"); }
  }
  function cuttingList() {
    var job = current.job, plan = selectedPlan(), text = [
      t("title"), t("stockHeading") + ": " + length(job.stockLength, job),
      t("kerf") + ": " + length(job.kerf, { unit: "mm" }),
      t("rods") + ": " + plan.stockCount, t("waste") + ": " + length(plan.waste, job)
    ];
    plan.patterns.forEach(function (pattern, index) {
      text.push((index + 1) + ". " + t("times", { n: pattern.repeats }) +
        " | " + patternParts(pattern, job) +
        " | " + t("offcut") + ": " + length(pattern.offcut, job));
    });
    return text.join("\n");
  }
  function downloadCsv() {
    if (!current) return;
    var job = current.job, plan = selectedPlan();
    var rows = [["pattern", "stock_count", "cuts_per_rod", "offcut_" + job.unit,
      "kerf_loss_" + job.unit, "pieces"]];
    plan.patterns.forEach(function (pattern, index) {
      rows.push([
        index + 1, pattern.repeats, pattern.cuts,
        pattern.offcut / Engine.UNIT_FACTORS[job.unit],
        pattern.kerfLoss / Engine.UNIT_FACTORS[job.unit],
        patternParts(pattern, job)
      ]);
    });
    var csv = rows.map(function (row) {
      return row.map(function (value) { return '"' + String(value).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");
    var url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    var link = document.createElement("a"); link.href = url; link.download = "armatur-cutting-list.csv";
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  $("cut-form").addEventListener("submit", calculate);
  $("cut-form").addEventListener("input", markStale);
  $("unit").addEventListener("change", function () {
    convertUnit(lastUnit, $("unit").value); markStale();
  });
  $("item-rows").addEventListener("click", function (event) {
    var button = event.target.closest("[data-action]");
    if (!button) return;
    var row = button.closest("tr");
    if (button.dataset.action === "remove") row.remove();
    else {
      var copied = addRow({
        length: row.querySelector(".piece-length").value,
        quantity: row.querySelector(".piece-quantity").value
      });
      row.after(copied);
    }
    markStale(); setLanguage(language);
  });
  $("add-row").addEventListener("click", function () {
    addRow(); markStale();
    var input = $("item-rows").lastElementChild.querySelector(".piece-length");
    input.focus();
  });
  $("example").addEventListener("click", function () {
    $("stock-length").value = "1000"; $("unit").value = "mm"; lastUnit = "mm";
    $("diameter").value = "12"; $("kerf").value = "0";
    setRows([
      { length: "600", quantity: "1" },
      { length: "500", quantity: "1" },
      { length: "300", quantity: "1" },
      { length: "200", quantity: "3" }
    ]);
    markStale(); setStatus("exampleLoaded");
  });
  document.querySelectorAll("[data-language]").forEach(function (button) {
    button.addEventListener("click", function () { setLanguage(button.dataset.language); });
  });
  $("show-best").addEventListener("click", function () { view = "best"; renderResult(); });
  $("show-greedy").addEventListener("click", function () { view = "greedy"; renderResult(); });
  $("copy-list").addEventListener("click", function () {
    if (!current) return;
    if (!navigator.clipboard || !navigator.clipboard.writeText) { setStatus("copyFailure"); return; }
    navigator.clipboard.writeText(cuttingList()).then(function () {
      setStatus("copySuccess");
    }, function () { setStatus("copyFailure"); });
  });
  $("export-csv").addEventListener("click", downloadCsv);
  $("print-list").addEventListener("click", function () { window.print(); });

  setRows([
    { length: "3600", quantity: "4" },
    { length: "2400", quantity: "4" },
    { length: "1200", quantity: "6" }
  ]);
  setLanguage("mn");
})();
