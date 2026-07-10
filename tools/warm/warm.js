const SOLAR_CONSTANT = 1361;
const SIGMA = 5.670374419e-8;
const KELVIN_OFFSET = 273.15;

const STAR_PRESETS = {
  sun: { luminosity: 1 },
  redDwarf: { luminosity: 0.02 },
  orangeDwarf: { luminosity: 0.4 },
  brightStar: { luminosity: 10 },
};

const REDISTRIBUTION = {
  sphere: { q: 4 },
  dayside: { q: 2 },
  subsolar: { q: 1 },
};

const PLANETS = [
  { key: "mercury", distance: 0.387 },
  { key: "venus", distance: 0.723 },
  { key: "earth", distance: 1 },
  { key: "mars", distance: 1.524 },
  { key: "jupiter", distance: 5.203 },
];

const STRINGS = {
  en: {
    pageTitle: "Stellar Warmth",
    pageSubtitle: "Flux, temperature, and habitable zones",
    starControls: "Star",
    planetControls: "Planet and orbit",
    presetLabel: "Preset",
    presetSun: "Sun",
    presetRedDwarf: "Dim red dwarf",
    presetOrangeDwarf: "Orange dwarf",
    presetBrightStar: "Bright star",
    presetCustom: "Custom",
    luminosityLabel: "Luminosity L/L☉",
    luminosityInputLabel: "Exact luminosity",
    distanceLabel: "Orbital distance r",
    distanceInputLabel: "Exact distance in AU",
    albedoLabel: "Bond albedo A",
    emissivityLabel: "Infrared emissivity ε",
    greenhouseLabel: "Greenhouse warming ΔT",
    redistributionLabel: "Redistribution",
    modeSphere: "Whole sphere",
    modeDayside: "Dayside",
    modeSubsolar: "Subsolar point",
    summaryIrradiance: "Irradiance",
    summaryEquilibrium: "Equilibrium temperature",
    equilibriumNote: "Before greenhouse offset.",
    summarySurface: "Surface estimate",
    surfaceNote: "Equilibrium plus ΔT.",
    summaryZone: "Simplified zone",
    zoneInside: "Inside band",
    zoneBelow: "Cooler than band",
    zoneAbove: "Warmer than band",
    zoneNote: "{low} to {high} surface estimate.",
    earthSunUnits: "{value} × Earth sunlight",
    plotControls: "Plot controls",
    rangeMinLabel: "Minimum distance",
    rangeMaxLabel: "Maximum distance",
    zoneLowerLabel: "Goldilocks lower T",
    zoneUpperLabel: "Goldilocks upper T",
    logAxisLabel: "Log distance axis",
    temperaturePlotTitle: "Temperature versus distance",
    temperaturePlotNote: "The shaded band is a simplified liquid-water temperature band.",
    temperatureSvgTitle: "Temperature curves versus orbital distance",
    temperatureSvgDesc: "Equilibrium and greenhouse-adjusted temperature curves with a selected orbit marker.",
    irradiancePlotTitle: "Irradiance versus distance",
    irradiancePlotNote: "Flux falls as inverse square distance, a useful bridge to solar-panel planning.",
    irradianceSvgTitle: "Stellar irradiance versus orbital distance",
    irradianceSvgDesc: "Stellar irradiance curve and selected orbit marker.",
    axisDistance: "distance from star (AU)",
    axisTemperature: "temperature (K)",
    axisIrradiance: "stellar irradiance (W/m²)",
    legendEquilibrium: "equilibrium",
    legendSurface: "surface estimate",
    legendIrradiance: "irradiance",
    markerOrbit: "selected orbit",
    explainTitle: "Model",
    explainOne: "Stellar irradiance is I(r) = S0 L / r², where S0 is solar irradiance at 1 AU.",
    explainTwo: "The temperature model is deliberately simple: T_eq = [I(1-A)/(q ε σ)]^(1/4), then T_surface = T_eq + ΔT. It is a teaching model, not a climate forecast.",
    mercury: "Mercury",
    venus: "Venus",
    earth: "Earth",
    mars: "Mars",
    jupiter: "Jupiter",
    notDefined: "not defined",
  },
  mn: {
    pageTitle: "Одны дулаан",
    pageSubtitle: "Цацрал, температур, амьдрахад тохиромжтой бүс",
    starControls: "Од",
    planetControls: "Гариг ба тойрог зам",
    presetLabel: "Сонголт",
    presetSun: "Нар",
    presetRedDwarf: "Бүдэг улаан одой",
    presetOrangeDwarf: "Улбар одой",
    presetBrightStar: "Тод од",
    presetCustom: "Өөрийн",
    luminosityLabel: "Гэрэлтэлт L/L☉",
    luminosityInputLabel: "Нарийн гэрэлтэлт",
    distanceLabel: "Тойрог замын зай r",
    distanceInputLabel: "AU дахь нарийн зай",
    albedoLabel: "Бондын альбедо A",
    emissivityLabel: "Хэт улаан ялгаруулалт ε",
    greenhouseLabel: "Хүлэмжийн дулаарал ΔT",
    redistributionLabel: "Дулаан хуваарилалт",
    modeSphere: "Бүх бөмбөрцөг",
    modeDayside: "Өдрийн тал",
    modeSubsolar: "Нар эгц тусах цэг",
    summaryIrradiance: "Цацрал",
    summaryEquilibrium: "Тэнцвэрийн температур",
    equilibriumNote: "Хүлэмжийн нэмэгдэлгүй.",
    summarySurface: "Гадаргын ойролцоо үнэлгээ",
    surfaceNote: "Тэнцвэр дээр ΔT нэмсэн.",
    summaryZone: "Хялбарчилсан бүс",
    zoneInside: "Бүс дотор",
    zoneBelow: "Бүсээс хүйтэн",
    zoneAbove: "Бүсээс дулаан",
    zoneNote: "{low}-аас {high} хүртэлх гадаргын үнэлгээ.",
    earthSunUnits: "Дэлхийн нарны гэрлийн {value} ×",
    plotControls: "Графикийн тохиргоо",
    rangeMinLabel: "Хамгийн бага зай",
    rangeMaxLabel: "Хамгийн их зай",
    zoneLowerLabel: "Доод Goldilocks T",
    zoneUpperLabel: "Дээд Goldilocks T",
    logAxisLabel: "Зайг лог тэнхлэгээр",
    temperaturePlotTitle: "Температур ба зай",
    temperaturePlotNote: "Сүүдэрлэсэн зурвас нь шингэн усны хялбарчилсан температурын муж.",
    temperatureSvgTitle: "Тойрог замын зайнаас хамаарах температурын муруйнууд",
    temperatureSvgDesc: "Тэнцвэрийн ба хүлэмжээр зассан температурын муруй, сонгосон тойрог замын тэмдэглэгээтэй.",
    irradiancePlotTitle: "Цацрал ба зай",
    irradiancePlotNote: "Цацрал зайны квадратад урвуу буурна; энэ нь нарны хавтангийн төлөвлөлттэй холбогдоно.",
    irradianceSvgTitle: "Тойрог замын зайнаас хамаарах одны цацрал",
    irradianceSvgDesc: "Одны цацралын муруй ба сонгосон тойрог замын тэмдэглэгээ.",
    axisDistance: "одноос зай (AU)",
    axisTemperature: "температур (K)",
    axisIrradiance: "одны цацрал (W/m²)",
    legendEquilibrium: "тэнцвэр",
    legendSurface: "гадаргын үнэлгээ",
    legendIrradiance: "цацрал",
    markerOrbit: "сонгосон тойрог зам",
    explainTitle: "Загвар",
    explainOne: "Одны цацрал I(r) = S0 L / r². Энд S0 нь 1 AU дахь Нарны цацрал.",
    explainTwo: "Температурын загвар санаатайгаар хялбар: T_eq = [I(1-A)/(q ε σ)]^(1/4), дараа нь T_surface = T_eq + ΔT. Энэ бол сургалтын загвар, уур амьсгалын таамаг биш.",
    mercury: "Буд",
    venus: "Сугар",
    earth: "Дэлхий",
    mars: "Ангараг",
    jupiter: "Бархасбадь",
    notDefined: "тодорхойгүй",
  },
};

const state = {
  preset: "sun",
  luminosity: 1,
  distance: 1,
  albedo: 0.3,
  emissivity: 1,
  greenhouse: 30,
  redistribution: "sphere",
  rangeMin: 0.05,
  rangeMax: 5.5,
  zoneLower: 273,
  zoneUpper: 323,
  logAxis: true,
  lang: initialLanguage(),
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  for (const id of [
    "luminosity", "luminosity-input", "distance", "distance-input", "albedo",
    "emissivity", "greenhouse", "redistribution", "range-min", "range-max",
    "zone-lower", "zone-upper", "log-axis", "temperature-chart",
    "irradiance-chart", "luminosity-value", "distance-value", "albedo-value",
    "emissivity-value", "greenhouse-value", "irradiance-card",
    "earth-sun-card", "equilibrium-card", "surface-card", "zone-card", "zone-note",
  ]) {
    els[id] = document.getElementById(id);
  }

  document.querySelectorAll(".preset").forEach((button) => {
    button.addEventListener("click", () => setPreset(button.dataset.preset));
  });

  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  bindNumberPair("luminosity", "luminosity-input", 0.0001, 100, (value) => {
    state.luminosity = value;
    state.preset = presetForLuminosity(value);
  });
  bindNumberPair("distance", "distance-input", 0.01, 200, (value) => {
    state.distance = value;
  });

  els.albedo.addEventListener("input", () => {
    state.albedo = clamp(Number(els.albedo.value), 0, 0.9);
    render();
  });

  els.emissivity.addEventListener("input", () => {
    state.emissivity = clamp(Number(els.emissivity.value), 0.1, 1);
    render();
  });

  els.greenhouse.addEventListener("input", () => {
    state.greenhouse = clamp(Number(els.greenhouse.value), 0, 80);
    render();
  });

  els.redistribution.addEventListener("change", () => {
    if (REDISTRIBUTION[els.redistribution.value]) state.redistribution = els.redistribution.value;
    render();
  });

  for (const [id, key, min, max] of [
    ["range-min", "rangeMin", 0.01, 200],
    ["range-max", "rangeMax", 0.02, 200],
    ["zone-lower", "zoneLower", 150, 500],
    ["zone-upper", "zoneUpper", 151, 600],
  ]) {
    els[id].addEventListener("input", () => {
      state[key] = clamp(Number(els[id].value), min, max);
      normalizeRanges();
      render();
    });
  }

  els["log-axis"].addEventListener("change", () => {
    state.logAxis = els["log-axis"].checked;
    render();
  });

  render();
});

function bindNumberPair(rangeId, inputId, min, max, updateState) {
  els[rangeId].addEventListener("input", () => {
    updateState(clamp(Number(els[rangeId].value), min, max));
    render();
  });
  els[inputId].addEventListener("input", () => {
    updateState(clamp(Number(els[inputId].value), min, max));
    render();
  });
}

function setPreset(name) {
  state.preset = name;
  if (STAR_PRESETS[name]) state.luminosity = STAR_PRESETS[name].luminosity;
  render();
}

function setLanguage(lang) {
  if (!STRINGS[lang]) return;
  state.lang = lang;
  try {
    localStorage.setItem("warm-lang", lang);
  } catch (_error) {
    // The tool still works when storage is unavailable.
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  } catch (_error) {
    // URL updates are a convenience only.
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
    const saved = localStorage.getItem("warm-lang");
    if (STRINGS[saved]) return saved;
  } catch (_error) {
    // Continue to browser-language fallback.
  }

  try {
    const browserLang = (navigator.language || "").slice(0, 2).toLowerCase();
    if (STRINGS[browserLang]) return browserLang;
  } catch (_error) {
    // Default below.
  }

  return "en";
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
    const active = button.dataset.lang === state.lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function render() {
  normalizeRanges();
  applyLanguage();
  syncControls();
  renderSummary();
  renderTemperatureChart();
  renderIrradianceChart();
}

function syncControls() {
  setNumericValue("luminosity", state.luminosity, 3);
  setNumericValue("luminosity-input", state.luminosity, 4);
  setNumericValue("distance", state.distance, 2);
  setNumericValue("distance-input", state.distance, 3);
  els.albedo.value = state.albedo.toFixed(2);
  els.emissivity.value = state.emissivity.toFixed(2);
  els.greenhouse.value = state.greenhouse.toFixed(0);
  els.redistribution.value = state.redistribution;
  els["range-min"].value = formatInputNumber(state.rangeMin, 3);
  els["range-max"].value = formatInputNumber(state.rangeMax, 3);
  els["zone-lower"].value = state.zoneLower.toFixed(0);
  els["zone-upper"].value = state.zoneUpper.toFixed(0);
  els["log-axis"].checked = state.logAxis;

  els["luminosity-value"].textContent = `${formatNumber(state.luminosity, 3)} L/L☉`;
  els["distance-value"].textContent = `${formatNumber(state.distance, 3)} AU`;
  els["albedo-value"].textContent = state.albedo.toFixed(2);
  els["emissivity-value"].textContent = state.emissivity.toFixed(2);
  els["greenhouse-value"].textContent = `${state.greenhouse.toFixed(0)} K`;

  document.querySelectorAll(".preset").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === state.preset);
  });
}

function renderSummary() {
  const values = modelAt(state.distance);
  const zoneState = zoneStatus(values.surface);
  els["irradiance-card"].textContent = `${formatNumber(values.irradiance, 1)} W/m²`;
  els["earth-sun-card"].textContent = t("earthSunUnits", { value: formatNumber(values.earthFlux, 3) });
  els["equilibrium-card"].textContent = formatTemperaturePair(values.equilibrium);
  els["surface-card"].textContent = formatTemperaturePair(values.surface);
  els["zone-card"].textContent = t(zoneState.key);
  els["zone-card"].className = `summary-value ${zoneState.inside ? "inside" : "outside"}`;
  els["zone-note"].textContent = t("zoneNote", {
    low: `${state.zoneLower.toFixed(0)} K`,
    high: `${state.zoneUpper.toFixed(0)} K`,
  });
}

function modelAt(distance) {
  const r = clamp(distance, 0.0001, 1e6);
  const irradiance = SOLAR_CONSTANT * state.luminosity / (r * r);
  const q = REDISTRIBUTION[state.redistribution]?.q ?? 4;
  const absorbed = irradiance * (1 - state.albedo);
  const denominator = q * state.emissivity * SIGMA;
  const equilibrium = absorbed > 0 && denominator > 0
    ? Math.pow(absorbed / denominator, 0.25)
    : NaN;
  const surface = Number.isFinite(equilibrium) ? equilibrium + state.greenhouse : NaN;
  return { irradiance, earthFlux: irradiance / SOLAR_CONSTANT, equilibrium, surface };
}

function zoneStatus(surface) {
  if (!Number.isFinite(surface)) return { key: "notDefined", inside: false };
  if (surface < state.zoneLower) return { key: "zoneBelow", inside: false };
  if (surface > state.zoneUpper) return { key: "zoneAbove", inside: false };
  return { key: "zoneInside", inside: true };
}

function renderTemperatureChart() {
  const svg = els["temperature-chart"];
  const width = 760;
  const height = 440;
  const margin = { left: 58, right: 24, top: 30, bottom: 58 };
  const chart = chartScales(width, height, margin, 120, 520, "temperature");
  const points = sampleDistances().map((distance) => ({ distance, ...modelAt(distance) }));
  const yValues = points.flatMap((point) => [point.equilibrium, point.surface]).filter(Number.isFinite);
  const yDomain = paddedDomain(yValues.concat([state.zoneLower, state.zoneUpper, 255, 288]), 18, 120, 620);
  chart.setYDomain(yDomain[0], yDomain[1]);

  svg.replaceChildren();
  drawGrid(svg, chart, "temperature");
  drawGoldilocksBand(svg, chart);
  drawPath(svg, points, chart, "equilibrium", "curve-equilibrium");
  if (Math.abs(state.greenhouse) > 0.001) drawPath(svg, points, chart, "surface", "curve-surface");
  if (state.preset === "sun") drawPlanetMarkers(svg, chart);
  drawSelectedMarker(svg, chart, modelAt(state.distance).surface, `${formatNumber(state.distance, 2)} AU`);
  drawLegend(svg, [
    { label: t("legendEquilibrium"), className: "curve-equilibrium" },
    { label: t("legendSurface"), className: "curve-surface" },
  ], width - margin.right - 168, margin.top + 10);
}

function renderIrradianceChart() {
  const svg = els["irradiance-chart"];
  const width = 760;
  const height = 380;
  const margin = { left: 64, right: 24, top: 28, bottom: 58 };
  const points = sampleDistances().map((distance) => ({ distance, ...modelAt(distance) }));
  const yValues = points.map((point) => point.irradiance).filter(Number.isFinite);
  const yDomain = paddedDomain(yValues.concat([SOLAR_CONSTANT]), 0.12, 0, null);
  const chart = chartScales(width, height, margin, yDomain[0], yDomain[1], "irradiance");

  svg.replaceChildren();
  drawGrid(svg, chart, "irradiance");
  drawPath(svg, points, chart, "irradiance", "curve-irradiance");
  drawSelectedMarker(svg, chart, modelAt(state.distance).irradiance, `${formatNumber(modelAt(state.distance).earthFlux, 2)} ×`);
  drawLegend(svg, [{ label: t("legendIrradiance"), className: "curve-irradiance" }], width - margin.right - 142, margin.top + 10);
}

function chartScales(width, height, margin, yMin, yMax, kind) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xMin = state.rangeMin;
  const xMax = state.rangeMax;
  const logMin = Math.log10(xMin);
  const logMax = Math.log10(xMax);

  const xScale = (distance) => {
    const x = state.logAxis
      ? (Math.log10(clamp(distance, xMin, xMax)) - logMin) / (logMax - logMin)
      : (distance - xMin) / (xMax - xMin);
    return margin.left + clamp(x, 0, 1) * plotWidth;
  };

  const yScale = (value) => {
    const y = (yMax - value) / (yMax - yMin);
    return margin.top + clamp(y, 0, 1) * plotHeight;
  };

  return {
    width, height, margin, plotWidth, plotHeight, xMin, xMax, yMin, yMax, kind,
    xScale, yScale,
    setYDomain(min, max) {
      this.yMin = min;
      this.yMax = max;
      yMin = min;
      yMax = max;
    },
  };
}

function drawGrid(svg, chart, kind) {
  const { width, height, margin } = chart;
  const yTicks = ticks(chart.yMin, chart.yMax, 5);
  for (const y of yTicks) {
    line(svg, margin.left, chart.yScale(y), width - margin.right, chart.yScale(y), "grid-line");
    text(svg, margin.left - 10, chart.yScale(y) + 4, formatAxisNumber(y), "tick-label", "end");
  }

  const xTicks = distanceTicks(chart.xMin, chart.xMax);
  for (const x of xTicks) {
    line(svg, chart.xScale(x), margin.top, chart.xScale(x), height - margin.bottom, "grid-line");
    text(svg, chart.xScale(x), height - margin.bottom + 22, formatDistanceTick(x), "tick-label", "middle");
  }

  line(svg, margin.left, margin.top, margin.left, height - margin.bottom, "axis");
  line(svg, margin.left, height - margin.bottom, width - margin.right, height - margin.bottom, "axis");
  text(svg, width / 2, height - 14, t("axisDistance"), "axis-label", "middle");
  text(svg, 16, height / 2, kind === "temperature" ? t("axisTemperature") : t("axisIrradiance"), "axis-label", "middle", -90);
}

function drawGoldilocksBand(svg, chart) {
  const yTop = chart.yScale(state.zoneUpper);
  const yBottom = chart.yScale(state.zoneLower);
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", chart.margin.left);
  rect.setAttribute("y", Math.min(yTop, yBottom));
  rect.setAttribute("width", chart.plotWidth);
  rect.setAttribute("height", Math.abs(yBottom - yTop));
  rect.setAttribute("class", "goldilocks-band");
  svg.appendChild(rect);
}

function drawPath(svg, points, chart, key, className) {
  const path = points
    .filter((point) => Number.isFinite(point[key]))
    .map((point, index) => `${index === 0 ? "M" : "L"} ${chart.xScale(point.distance).toFixed(2)} ${chart.yScale(point[key]).toFixed(2)}`)
    .join(" ");
  if (!path) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", path);
  el.setAttribute("class", className);
  el.setAttribute("fill", "none");
  svg.appendChild(el);
}

function drawSelectedMarker(svg, chart, yValue, label) {
  if (!Number.isFinite(yValue)) return;
  const x = chart.xScale(state.distance);
  const y = chart.yScale(yValue);
  line(svg, x, chart.margin.top, x, chart.height - chart.margin.bottom, "marker-line");
  circle(svg, x, y, 6, "marker-dot");
  text(svg, x + 9, y - 10, label, "point-label", "start");
}

function drawPlanetMarkers(svg, chart) {
  for (const planet of PLANETS) {
    if (planet.distance < chart.xMin || planet.distance > chart.xMax) continue;
    const values = modelAt(planet.distance);
    if (!Number.isFinite(values.surface)) continue;
    const x = chart.xScale(planet.distance);
    const y = chart.yScale(values.surface);
    circle(svg, x, y, 4, "planet-marker");
    text(svg, x + 6, y + 14, t(planet.key), "planet-label", "start");
  }
}

function drawLegend(svg, items, x, y) {
  items.forEach((item, index) => {
    const yy = y + index * 20;
    line(svg, x, yy, x + 28, yy, `legend-swatch ${item.className}`);
    text(svg, x + 36, yy + 4, item.label, "legend-label", "start");
  });
}

function sampleDistances(count = 260) {
  const distances = [];
  const min = state.rangeMin;
  const max = state.rangeMax;
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    distances.push(state.logAxis ? Math.pow(10, logMin + (logMax - logMin) * u) : min + (max - min) * u);
  }
  return distances;
}

function normalizeRanges() {
  state.rangeMin = clamp(state.rangeMin, 0.01, 200);
  state.rangeMax = clamp(state.rangeMax, 0.02, 200);
  if (state.rangeMax <= state.rangeMin) state.rangeMax = Math.min(200, state.rangeMin * 1.5);
  state.zoneLower = clamp(state.zoneLower, 150, 500);
  state.zoneUpper = clamp(state.zoneUpper, 151, 600);
  if (state.zoneUpper <= state.zoneLower) state.zoneUpper = state.zoneLower + 1;
}

function presetForLuminosity(value) {
  for (const [key, preset] of Object.entries(STAR_PRESETS)) {
    if (Math.abs(value - preset.luminosity) < 1e-9) return key;
  }
  return "custom";
}

function setNumericValue(id, value, decimals) {
  if (!els[id]) return;
  els[id].value = formatInputNumber(value, decimals);
}

function formatInputNumber(value, decimals) {
  if (!Number.isFinite(value)) return "";
  return Number(value.toFixed(decimals)).toString();
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return t("notDefined");
  if (Math.abs(value) >= 10000 || (Math.abs(value) > 0 && Math.abs(value) < 0.01)) return value.toExponential(2);
  return value.toLocaleString(state.lang === "mn" ? "mn-MN" : "en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: value < 10 && decimals > 0 ? Math.min(2, decimals) : 0,
  });
}

function formatAxisNumber(value) {
  if (Math.abs(value) >= 10000) return value.toExponential(1);
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function formatDistanceTick(value) {
  if (value >= 10) return value.toFixed(0);
  if (value >= 1) return value.toFixed(value % 1 === 0 ? 0 : 1);
  return value.toFixed(2);
}

function formatTemperaturePair(kelvin) {
  if (!Number.isFinite(kelvin)) return t("notDefined");
  return `${kelvin.toFixed(1)} K / ${(kelvin - KELVIN_OFFSET).toFixed(1)} °C`;
}

function distanceTicks(min, max) {
  if (!state.logAxis) return ticks(min, max, 5);
  const values = [];
  const start = Math.floor(Math.log10(min));
  const end = Math.ceil(Math.log10(max));
  for (let power = start; power <= end; power++) {
    for (const factor of [1, 2, 5]) {
      const value = factor * Math.pow(10, power);
      if (value >= min * 0.999 && value <= max * 1.001) values.push(value);
    }
  }
  return values;
}

function ticks(min, max, count) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min || 0];
  const step = niceStep((max - min) / Math.max(1, count - 1));
  const start = Math.ceil(min / step) * step;
  const values = [];
  for (let value = start; value <= max + step * 0.5; value += step) {
    values.push(Number(value.toFixed(10)));
  }
  return values.slice(0, 8);
}

function niceStep(rawStep) {
  const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const fraction = rawStep / power;
  if (fraction <= 1) return power;
  if (fraction <= 2) return 2 * power;
  if (fraction <= 5) return 5 * power;
  return 10 * power;
}

function paddedDomain(values, padFraction, hardMin, hardMax) {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return [0, 1];
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  const pad = Math.max(1, (max - min) * padFraction);
  min -= pad;
  max += pad;
  if (hardMin != null) min = Math.max(hardMin, min);
  if (hardMax != null) max = Math.min(hardMax, max);
  if (max <= min) max = min + 1;
  return [min, max];
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function line(svg, x1, y1, x2, y2, className) {
  if (![x1, y1, x2, y2].every(Number.isFinite)) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x2);
  el.setAttribute("y2", y2);
  el.setAttribute("class", className);
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
  if (![x, y].every(Number.isFinite)) return null;
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
