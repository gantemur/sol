const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

const PRESETS = {
  red: { n: 1.33 / 1.00027717 },
  violet: { n: 1.34 / 1.00027717 },
};

const RAY_COUNT = {
  min: 24,
  max: 420,
  step: 6,
  defaultValue: 96,
};

const RAY_BRIGHTNESS = {
  min: 0.5,
  max: 2,
  defaultValue: 1,
  maxOpacity: 0.75,
};

const RAY_STYLE = {
  incomingOpacity: 0.20,
  incomingWidth: 0.44,
  internalOpacity: 0.055,
  internalWidth: 0.36,
  outgoingOpacity: 0.30,
  outgoingWidth: 0.52,
};

const STRINGS = {
  en: {
    pageTitle: "Rainbow Angles",
    pageSubtitle: "Explore the geometric-optics angles behind primary and secondary rainbows.",
    presetLabel: "Preset",
    presetRed: "Water red",
    presetViolet: "Water violet",
    presetCustom: "Custom",
    controlN: "Refractive index",
    controlK: "Rainbow order",
    controlImpact: "Impact parameter b/R",
    showExtrema: "Show extrema",
    showTable: "Show angle table",
    rayDisplayTitle: "Ray display",
    rayCountLabel: "Ray count",
    rayBrightnessLabel: "Ray brightness",
    rayTitle: "Drop ray sketch",
    raySvgTitle: "Parallel rays entering a spherical water drop",
    raySvgDesc: "A schematic circle showing many parallel rays refracting and reflecting through a water drop.",
    rayCaption: "Many parallel rays are sampled across the drop. Where the outgoing family bunches together, the rainbow direction is forming.",
    chartTitle: "Deviation angle curve",
    chartSvgTitle: "Deviation angle versus impact parameter",
    chartSvgDesc: "A curve showing signed rainbow deviation angle as a function of normalized impact parameter.",
    chartNote: "Bright direction near {angle} at b/R = {impact}, α = {alpha}.",
    chartNoExtremum: "No visible extremum for these parameters.",
    axisImpact: "impact parameter b/R",
    axisSigned: "signed viewing angle",
    currentTitle: "Current angle",
    signNote: "A negative signed angle follows the source notebook convention: it is counted from the Sun. Positive angles are measured from the antisolar point.",
    summaryTitle: "Primary and secondary summary",
    explainTitle: "What is plotted?",
    explainOne: "The impact parameter b/R is the normalized height where a parallel ray enters the droplet. The incident angle α follows from b/R = sin(α). Order 1 is the primary rainbow, order 2 is the secondary rainbow, and higher orders add more internal reflections.",
    explainTwo: "Uniformly spaced rays in the sketch correspond to uniformly spaced b/R values on the curve. Extrema mark where nearby rays bunch together, producing a bright rainbow direction.",
    currentSigned: "Current signed angle: {angle}.",
    rowImpact: "Impact parameter b/R",
    rowIncident: "Incident angle α",
    rowRefracted: "Refracted angle β",
    rowSigned: "Signed viewing angle",
    rowRaw: "Raw deviation",
    colOrder: "Order",
    colPreset: "Preset",
    colImpact: "b/R",
    colAlpha: "α",
    colViewing: "Viewing angle",
    notDefined: "not defined",
  },
  mn: {
    pageTitle: "Солонгын өнцөг",
    pageSubtitle: "Анхдагч ба хоёрдогч солонгын геометр-оптикийн өнцгийг туршиж үзнэ.",
    presetLabel: "Сонголт",
    presetRed: "Усны улаан",
    presetViolet: "Усны ягаан",
    presetCustom: "Өөрийн n",
    controlN: "Хугарлын илтгэгч",
    controlK: "Солонгын эрэмбэ",
    controlImpact: "Тусалтын параметр b/R",
    showExtrema: "Экстремум харуулах",
    showTable: "Өнцгийн хүснэгт харуулах",
    rayDisplayTitle: "Цацрагийн харагдац",
    rayCountLabel: "Цацрагийн тоо",
    rayBrightnessLabel: "Цацрагийн тодрол",
    rayTitle: "Дусал дахь цацрагууд",
    raySvgTitle: "Бөмбөрцөг усан дусалд орж буй параллель цацрагууд",
    raySvgDesc: "Олон параллель цацраг усан дусалд хугарч, ойж, дахин хугаран гарах бүдүүвч.",
    rayCaption: "Параллель цацрагуудыг дуслын огтлол дагуу жигд авсан. Гарах цацрагууд бөөгнөрөх чиглэлд солонго үүснэ.",
    chartTitle: "Хазайлтын өнцгийн муруй",
    chartSvgTitle: "Тусалтын параметрээс хамаарах хазайлтын өнцөг",
    chartSvgDesc: "Нормчилсон тусалтын параметрийн функц болох тэмдэгтэй солонгын өнцгийн муруй.",
    chartNote: "Гэрэлт чиглэл {angle}, b/R = {impact}, α = {alpha} орчим.",
    chartNoExtremum: "Эдгээр параметрт харагдах экстремум алга.",
    axisImpact: "тусалтын параметр b/R",
    axisSigned: "тэмдэгтэй харах өнцөг",
    currentTitle: "Одоогийн өнцөг",
    signNote: "Сөрөг тэмдэг нь эх notebook-ийн дагуу Нарны зүгээс тоолж байгааг илтгэнэ. Эерэг өнцөг нь Нарны эсрэг цэгээс хэмжигдэнэ.",
    summaryTitle: "Анхдагч ба хоёрдогч тойм",
    explainTitle: "Юуг зурж байна вэ?",
    explainOne: "Тусалтын параметр b/R нь параллель цацраг дусалд орох өндрийг радиусаар нормчилсон утга. Тусах өнцөг α нь b/R = sin(α)-аас олдоно. Эрэмбэ 1 нь анхдагч солонго, эрэмбэ 2 нь хоёрдогч солонго; өндөр эрэмбэд дотоод ойролт нэмэгдэнэ.",
    explainTwo: "Зураг дахь жигд зайтай цацрагууд нь муруйн жигд b/R утгуудтай тохирно. Экстремум орчимд ойролцоо цацрагууд бөөгнөрч, гэрэлт солонгын чиглэл үүснэ.",
    currentSigned: "Одоогийн тэмдэгтэй өнцөг: {angle}.",
    rowImpact: "Тусалтын параметр b/R",
    rowIncident: "Тусах өнцөг α",
    rowRefracted: "Хугарсан өнцөг β",
    rowSigned: "Тэмдэгтэй харах өнцөг",
    rowRaw: "Түүхий хазайлт",
    colOrder: "Эрэмбэ",
    colPreset: "Сонголт",
    colImpact: "b/R",
    colAlpha: "α",
    colViewing: "Харах өнцөг",
    notDefined: "тодорхойгүй",
  },
};

const state = {
  preset: "red",
  n: PRESETS.red.n,
  k: 1,
  impact: Math.sin(59.6 * RAD),
  showExtrema: true,
  showTable: true,
  rayCount: initialRayCount(),
  rayBrightness: initialRayBrightness(),
  lang: initialLanguage(),
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  for (const id of ["n", "k", "impact", "show-extrema", "show-table", "ray-count", "ray-brightness", "chart", "chart-note", "ray-diagram", "current-table", "summary-table", "n-value", "k-value", "impact-value", "ray-count-value", "ray-brightness-value"]) {
    els[id] = document.getElementById(id);
  }

  document.querySelectorAll(".preset").forEach((button) => {
    button.addEventListener("click", () => setPreset(button.dataset.preset));
  });

  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  els.n.addEventListener("input", () => {
    state.n = Number(els.n.value);
    state.preset = "custom";
    render();
  });

  els.k.addEventListener("input", () => {
    state.k = Number(els.k.value);
    render();
  });

  els.impact.addEventListener("input", () => {
    state.impact = clamp(Number(els.impact.value), 0, 1);
    render();
  });

  els["show-extrema"].addEventListener("change", () => {
    state.showExtrema = els["show-extrema"].checked;
    render();
  });

  els["show-table"].addEventListener("change", () => {
    state.showTable = els["show-table"].checked;
    render();
  });

  els["ray-count"].addEventListener("input", () => {
    state.rayCount = clamp(Number(els["ray-count"].value), RAY_COUNT.min, RAY_COUNT.max);
    saveRayDisplaySettings();
    render();
  });

  els["ray-brightness"].addEventListener("input", () => {
    state.rayBrightness = clamp(Number(els["ray-brightness"].value), RAY_BRIGHTNESS.min, RAY_BRIGHTNESS.max);
    saveRayDisplaySettings();
    render();
  });

  render();
});

function setPreset(name) {
  state.preset = name;
  if (PRESETS[name]) state.n = PRESETS[name].n;
  render();
}

function setLanguage(lang) {
  if (!STRINGS[lang]) return;
  state.lang = lang;
  try {
    localStorage.setItem("rainbow-angle-lang", lang);
  } catch (_error) {
    // The tool still works when storage is unavailable.
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  } catch (_error) {
    // Query updates are a convenience, not a dependency.
  }
  render();
}

function initialLanguage() {
  let requested = null;
  try {
    requested = new URLSearchParams(window.location.search).get("lang");
  } catch (_error) {
    requested = null;
  }
  if (STRINGS[requested]) return requested;

  try {
    const saved = localStorage.getItem("rainbow-angle-lang");
    if (STRINGS[saved]) return saved;
  } catch (_error) {
    // Ignore storage failures and continue to browser-language fallback.
  }

  try {
    const browserLang = (navigator.language || "").slice(0, 2).toLowerCase();
    if (STRINGS[browserLang]) return browserLang;
  } catch (_error) {
    // Default below.
  }

  return "en";
}

function initialRayCount() {
  try {
    const saved = Number(localStorage.getItem("rainbow-angle-ray-count"));
    if (Number.isFinite(saved)) return roundedRayCount(saved);
  } catch (_error) {
    // Defaults keep the sketch independent of browser storage.
  }
  return RAY_COUNT.defaultValue;
}

function initialRayBrightness() {
  try {
    const saved = Number(localStorage.getItem("rainbow-angle-ray-brightness"));
    if (Number.isFinite(saved)) return clamp(saved, RAY_BRIGHTNESS.min, RAY_BRIGHTNESS.max);
  } catch (_error) {
    // Defaults keep the sketch independent of browser storage.
  }
  return RAY_BRIGHTNESS.defaultValue;
}

function saveRayDisplaySettings() {
  try {
    localStorage.setItem("rainbow-angle-ray-count", String(state.rayCount));
    localStorage.setItem("rainbow-angle-ray-brightness", state.rayBrightness.toFixed(2));
  } catch (_error) {
    // Display controls still work for the current page when storage is unavailable.
  }
}

function t(key, values = {}) {
  const text = STRINGS[state.lang]?.[key] ?? STRINGS.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_match, name) => values[name] ?? "");
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll(".language-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
    button.setAttribute("aria-pressed", button.dataset.lang === state.lang ? "true" : "false");
  });
}

function refractedAngle(alpha, n) {
  const arg = Math.sin(alpha) / n;
  if (!Number.isFinite(arg) || arg < -1 || arg > 1) return null;
  return Math.asin(arg);
}

function rawDeviation(alpha, n, k) {
  const beta = refractedAngle(alpha, n);
  if (beta == null) return null;

  // alpha is the incident angle from the droplet surface normal.
  // beta is the refracted angle inside the droplet, from Snell's law.
  // k is the rainbow order: 1 is primary, 2 is secondary.
  // The signed deviation follows the notebook convention after reduction.
  return ((k + 1) % 2) * Math.PI + 2 * alpha - 2 * (k + 1) * beta;
}

function signedViewingAngle(alpha, n, k) {
  const raw = rawDeviation(alpha, n, k);
  if (raw == null) return null;
  let deg = raw * DEG;
  deg = ((deg + 180) % 360 + 360) % 360 - 180;
  if (deg > 90) deg = 180 - deg;
  if (deg < -90) deg = -180 - deg;
  return deg;
}

function sampleCurve(n, k, steps = 540) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const impact = i / steps;
    const alpha = Math.asin(impact);
    const angle = signedViewingAngle(alpha, n, k);
    if (Number.isFinite(angle)) points.push({ impact, alphaDeg: alpha * DEG, angle });
  }
  return points;
}

function findExtrema(n, k) {
  const b2 = (((k + 1) * (k + 1)) - n * n) / (k * (k + 2));
  if (!Number.isFinite(b2) || b2 < 0 || b2 > 1) return [];

  // The source notebook gives the physical rainbow extremum directly:
  // sin(alpha)^2 = ((k+1)^2 - n^2) / (k(k+2)).
  // This marks the stationary deviation where neighboring rays bunch up.
  const alpha = Math.asin(Math.sqrt(b2));
  const impact = Math.sin(alpha);
  const angle = signedViewingAngle(alpha, n, k);
  if (!Number.isFinite(angle)) return [];
  return [{ impact, alphaDeg: alpha * DEG, angle, kind: angle < 0 ? "min" : "max" }];
}

function strongestExtremum(n, k) {
  return findExtrema(n, k).sort((a, b) => Math.abs(b.angle) - Math.abs(a.angle))[0] || null;
}

function currentValues() {
  const impact = clamp(state.impact, 0, 1);
  const alpha = Math.asin(impact);
  const beta = refractedAngle(alpha, state.n);
  const angle = signedViewingAngle(alpha, state.n, state.k);
  const raw = rawDeviation(alpha, state.n, state.k);
  return { impact, alpha, beta, angle, raw };
}

function render() {
  applyLanguage();

  els.n.value = state.n.toFixed(3);
  els.k.value = state.k;
  els.impact.value = state.impact.toFixed(3);
  els["ray-count"].value = state.rayCount;
  els["ray-brightness"].value = state.rayBrightness.toFixed(2);
  els["show-extrema"].checked = state.showExtrema;
  els["show-table"].checked = state.showTable;
  els["n-value"].textContent = state.n.toFixed(4);
  els["k-value"].textContent = String(state.k);
  els["impact-value"].textContent = formatImpactReadout(state.impact);
  els["ray-count-value"].textContent = String(state.rayCount);
  els["ray-brightness-value"].textContent = `${state.rayBrightness.toFixed(2)}×`;

  document.querySelectorAll(".preset").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === state.preset);
  });

  renderChart();
  renderRayDiagram();
  renderTables();
}

function renderChart() {
  const svg = els.chart;
  const width = 760;
  const height = 440;
  const margin = { left: 54, right: 22, top: 26, bottom: 54 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xScale = (x) => margin.left + x * plotWidth;
  const yScale = (y) => margin.top + ((90 - y) / 180) * plotHeight;
  const points = sampleCurve(state.n, state.k);
  const current = currentValues();
  const extrema = state.showExtrema ? findExtrema(state.n, state.k) : [];

  svg.replaceChildren();

  for (const y of [-90, -45, 0, 45, 90]) {
    line(svg, margin.left, yScale(y), width - margin.right, yScale(y), "grid-line");
    text(svg, margin.left - 10, yScale(y) + 4, `${y}°`, "tick-label", "end");
  }
  for (const x of [0, 0.25, 0.5, 0.75, 1]) {
    line(svg, xScale(x), margin.top, xScale(x), height - margin.bottom, "grid-line");
    text(svg, xScale(x), height - margin.bottom + 22, formatImpactTick(x), "tick-label", "middle");
  }

  line(svg, margin.left, yScale(0), width - margin.right, yScale(0), "axis");
  line(svg, margin.left, margin.top, margin.left, height - margin.bottom, "axis");
  text(svg, width / 2, height - 14, t("axisImpact"), "axis-label", "middle");
  text(svg, 16, height / 2, t("axisSigned"), "axis-label", "middle", -90);

  const path = points
    .filter((p) => Number.isFinite(p.angle))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.impact).toFixed(2)} ${yScale(p.angle).toFixed(2)}`)
    .join(" ");

  if (path) {
    const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
    curve.setAttribute("d", path);
    curve.setAttribute("class", "curve");
    svg.appendChild(curve);
  }

  if (Number.isFinite(current.angle)) {
    const cx = xScale(current.impact);
    const cy = yScale(current.angle);
    line(svg, cx, margin.top, cx, height - margin.bottom, "marker-line");
    circle(svg, cx, cy, 6, "marker-dot");
    text(svg, cx + 9, cy - 9, `${current.angle.toFixed(1)}°`, "point-label", "start");
  }

  for (const item of extrema) {
    const cx = xScale(item.impact);
    const cy = yScale(item.angle);
    circle(svg, cx, cy, 5, "extremum-dot");
    text(svg, cx + 8, cy + 16, `${formatImpact(item.impact)}, ${item.angle.toFixed(1)}°`, "point-label", "start");
  }

  const strongest = strongestExtremum(state.n, state.k);
  els["chart-note"].textContent = strongest
    ? t("chartNote", {
      angle: `${strongest.angle.toFixed(1)}°`,
      impact: formatImpact(strongest.impact),
      alpha: `${strongest.alphaDeg.toFixed(1)}°`,
    })
    : t("chartNoExtremum");
}

function renderRayDiagram() {
  const svg = els["ray-diagram"];
  const width = 760;
  const center = { x: 360, y: 220 };
  const radius = 110;
  const rayColor = currentRayColor();
  const impacts = sampleImpactHeights(state.rayCount);

  svg.replaceChildren();

  circle(svg, center.x, center.y, radius, "drop-disc");

  for (const impact of impacts) {
    const trace = traceRayByImpact(impact, state.n, state.k);
    if (!trace) continue;
    drawRayFamilyTrace(svg, trace, center, radius, width - 34, rayColor);
  }

  circle(svg, center.x, center.y, radius, "drop-outline");
}

function renderTables() {
  const current = currentValues();
  if (!state.showTable) {
    els["current-table"].innerHTML = `<p class="small">${t("currentSigned", { angle: formatAngle(current.angle) })}</p>`;
  } else {
    els["current-table"].innerHTML = `
      <table>
        <tbody>
          <tr><th>${t("rowImpact")}</th><td>${formatImpact(current.impact)}</td></tr>
          <tr><th>${t("rowIncident")}</th><td>${formatAngle(current.alpha * DEG)}</td></tr>
          <tr><th>${t("rowRefracted")}</th><td>${formatAngle(current.beta == null ? null : current.beta * DEG)}</td></tr>
          <tr><th>${t("rowSigned")}</th><td>${formatAngle(current.angle)}</td></tr>
          <tr><th>${t("rowRaw")}</th><td>${formatAngle(current.raw == null ? null : current.raw * DEG)}</td></tr>
        </tbody>
      </table>`;
  }

  const rows = [];
  for (const order of [1, 2]) {
    for (const key of ["red", "violet"]) {
      const ext = strongestExtremum(PRESETS[key].n, order);
      rows.push({
        order,
        preset: t(key === "red" ? "presetRed" : "presetViolet"),
        impact: ext?.impact,
        alpha: ext?.alphaDeg,
        angle: ext?.angle,
      });
    }
  }

  els["summary-table"].innerHTML = `
    <table>
      <thead>
        <tr><th>${t("colOrder")}</th><th>${t("colPreset")}</th><th>${t("colImpact")}</th><th>${t("colAlpha")}</th><th>${t("colViewing")}</th></tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${row.order}</td>
            <td>${row.preset}</td>
            <td>${formatImpact(row.impact)}</td>
            <td>${formatAngle(row.alpha)}</td>
            <td>${formatAngle(row.angle)}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function formatAngle(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)}°` : `<span class="warning">${t("notDefined")}</span>`;
}

function formatImpact(value) {
  return Number.isFinite(value) ? value.toFixed(3) : `<span class="warning">${t("notDefined")}</span>`;
}

function formatImpactReadout(value) {
  const impact = clamp(value, 0, 1);
  return `b/R = ${formatImpact(impact)}, α = ${(Math.asin(impact) * DEG).toFixed(1)}°`;
}

function formatImpactTick(value) {
  if (value === 0 || value === 1) return String(value);
  return value.toFixed(2);
}

function currentRayColor() {
  if (state.preset === "red") return "#d13a32";
  if (state.preset === "violet") return "#6d55d8";
  return "#0b6d86";
}

function sampleImpactHeights(count) {
  // Positive impact height is the upper half of the drop in mathematical
  // coordinates; toSvgPoint flips y, so these rays appear above the center.
  const minImpact = 0.02;
  const maxImpact = 0.97;
  const impacts = [];
  for (let i = 0; i < count; i++) {
    impacts.push(minImpact + (maxImpact - minImpact) * i / (count - 1));
  }
  return impacts;
}

function rayOpacity(baseOpacity) {
  return clamp(baseOpacity * state.rayBrightness, 0, RAY_BRIGHTNESS.maxOpacity);
}

function traceRayByImpact(impact, n, k) {
  if (!Number.isFinite(impact) || Math.abs(impact) >= 1) return null;

  let point = { x: Math.sqrt(1 - impact * impact), y: impact };
  let direction = refractVector({ x: -1, y: 0 }, point, 1, n);
  if (!direction) return null;

  const internal = [point];
  for (let i = 0; i < k; i++) {
    const reflectedAt = nextCirclePoint(point, direction);
    if (!reflectedAt) return null;
    internal.push(reflectedAt);
    direction = reflectVector(direction, reflectedAt);
    point = reflectedAt;
  }

  const exit = nextCirclePoint(point, direction);
  if (!exit) return null;
  internal.push(exit);

  const outgoing = refractVector(direction, exit, n, 1);
  if (!outgoing) return null;

  return {
    entry: internal[0],
    exit,
    internal,
    outgoing,
  };
}

function refractVector(incoming, normal, fromIndex, toIndex) {
  const incident = normalize(incoming);
  const outwardNormal = normalize(normal);
  const surfaceNormal = fromIndex < toIndex ? scale(outwardNormal, -1) : outwardNormal;
  const cos1 = dot(incident, surfaceNormal);
  if (cos1 <= 0) return null;

  const tangent = subtract(incident, scale(surfaceNormal, cos1));
  const eta = fromIndex / toIndex;
  const sin2Squared = eta * eta * dot(tangent, tangent);
  if (sin2Squared > 1) return null;

  return normalize(add(scale(tangent, eta), scale(surfaceNormal, Math.sqrt(1 - sin2Squared))));
}

function reflectVector(direction, normal) {
  const d = normalize(direction);
  const n = normalize(normal);
  return normalize(subtract(d, scale(n, 2 * dot(d, n))));
}

function nextCirclePoint(point, direction) {
  const t = -2 * dot(point, direction);
  if (!Number.isFinite(t) || t <= 1e-6) return null;
  return add(point, scale(direction, t));
}

function toSvgPoint(point, center, radius) {
  return {
    x: center.x + point.x * radius,
    y: center.y - point.y * radius,
  };
}

function drawRayFamilyTrace(svg, trace, center, radius, startX, color) {
  const entry = toSvgPoint(trace.entry, center, radius);

  styledLine(svg, startX, entry.y, entry.x, entry.y, "ray-segment ray-incoming", color, rayOpacity(RAY_STYLE.incomingOpacity), RAY_STYLE.incomingWidth);

  const internalPoints = trace.internal.map((point) => toSvgPoint(point, center, radius));
  polyline(svg, internalPoints, "ray-segment ray-internal", color, rayOpacity(RAY_STYLE.internalOpacity), RAY_STYLE.internalWidth);

  const exit = toSvgPoint(trace.exit, center, radius);
  const outEnd = toSvgPoint(add(trace.exit, scale(trace.outgoing, 1.95)), center, radius);
  styledLine(svg, exit.x, exit.y, outEnd.x, outEnd.y, "ray-segment ray-outgoing", color, rayOpacity(RAY_STYLE.outgoingOpacity), RAY_STYLE.outgoingWidth);
}

function roundedRayCount(value) {
  const rounded = Math.round(value / RAY_COUNT.step) * RAY_COUNT.step;
  return clamp(rounded, RAY_COUNT.min, RAY_COUNT.max);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function scale(a, factor) {
  return { x: a.x * factor, y: a.y * factor };
}

function normalize(a) {
  const length = Math.hypot(a.x, a.y);
  return length > 0 ? { x: a.x / length, y: a.y / length } : { x: 0, y: 0 };
}

function line(svg, x1, y1, x2, y2, className) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x2);
  el.setAttribute("y2", y2);
  el.setAttribute("class", className);
  el.setAttribute("fill", "none");
  svg.appendChild(el);
}

function styledLine(svg, x1, y1, x2, y2, className, color, opacity, strokeWidth) {
  if (![x1, y1, x2, y2, opacity, strokeWidth].every(Number.isFinite)) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x2);
  el.setAttribute("y2", y2);
  el.setAttribute("class", className);
  el.setAttribute("stroke", color);
  el.setAttribute("stroke-opacity", opacity.toFixed(3));
  el.setAttribute("stroke-width", strokeWidth.toFixed(2));
  el.setAttribute("fill", "none");
  svg.appendChild(el);
}

function circle(svg, cx, cy, r, className) {
  if (![cx, cy, r].every(Number.isFinite)) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("r", r);
  el.setAttribute("class", className);
  svg.appendChild(el);
}

function text(svg, x, y, value, className, anchor = "start", rotate = 0) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("class", className);
  el.setAttribute("text-anchor", anchor);
  if (rotate) el.setAttribute("transform", `rotate(${rotate} ${x} ${y})`);
  el.textContent = value;
  svg.appendChild(el);
  return el;
}

function polyline(svg, points, className, color, opacity, strokeWidth) {
  if (!points.length || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  el.setAttribute("points", points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" "));
  el.setAttribute("class", className);
  el.setAttribute("stroke", color);
  el.setAttribute("fill", "none");
  if (Number.isFinite(opacity)) el.setAttribute("stroke-opacity", opacity.toFixed(3));
  if (Number.isFinite(strokeWidth)) el.setAttribute("stroke-width", strokeWidth.toFixed(2));
  svg.appendChild(el);
}
