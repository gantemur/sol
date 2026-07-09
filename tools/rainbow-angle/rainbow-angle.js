const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

const PRESETS = {
  red: { label: "Water red", n: 1.33 / 1.00027717 },
  violet: { label: "Water violet", n: 1.34 / 1.00027717 },
};

const state = {
  preset: "red",
  n: PRESETS.red.n,
  k: 1,
  incidentDeg: 59.6,
  showExtrema: true,
  showTable: true,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  for (const id of ["n", "k", "incident", "show-extrema", "show-table", "chart", "chart-note", "ray-diagram", "ray-note", "current-table", "summary-table", "n-value", "k-value", "incident-value"]) {
    els[id] = document.getElementById(id);
  }

  document.querySelectorAll(".preset").forEach((button) => {
    button.addEventListener("click", () => setPreset(button.dataset.preset));
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

  els.incident.addEventListener("input", () => {
    state.incidentDeg = Number(els.incident.value);
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

  render();
});

function setPreset(name) {
  state.preset = name;
  if (PRESETS[name]) state.n = PRESETS[name].n;
  render();
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
    const incidentDeg = 89.9 * i / steps;
    const angle = signedViewingAngle(incidentDeg * RAD, n, k);
    if (Number.isFinite(angle)) points.push({ incidentDeg, angle });
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
  const angle = signedViewingAngle(alpha, n, k);
  if (!Number.isFinite(angle)) return [];
  return [{ incidentDeg: alpha * DEG, angle, kind: angle < 0 ? "min" : "max" }];
}

function strongestExtremum(n, k) {
  return findExtrema(n, k).sort((a, b) => Math.abs(b.angle) - Math.abs(a.angle))[0] || null;
}

function currentValues() {
  const alpha = state.incidentDeg * RAD;
  const beta = refractedAngle(alpha, state.n);
  const angle = signedViewingAngle(alpha, state.n, state.k);
  const raw = rawDeviation(alpha, state.n, state.k);
  return { alpha, beta, angle, raw };
}

function render() {
  els.n.value = state.n.toFixed(3);
  els.k.value = state.k;
  els.incident.value = state.incidentDeg;
  els["show-extrema"].checked = state.showExtrema;
  els["show-table"].checked = state.showTable;
  els["n-value"].textContent = state.n.toFixed(4);
  els["k-value"].textContent = String(state.k);
  els["incident-value"].textContent = `${state.incidentDeg.toFixed(1)}°`;

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
  const xScale = (x) => margin.left + (x / 90) * plotWidth;
  const yScale = (y) => margin.top + ((90 - y) / 180) * plotHeight;
  const points = sampleCurve(state.n, state.k);
  const current = currentValues();
  const extrema = state.showExtrema ? findExtrema(state.n, state.k) : [];

  svg.replaceChildren();

  for (const y of [-90, -45, 0, 45, 90]) {
    line(svg, margin.left, yScale(y), width - margin.right, yScale(y), "grid-line");
    text(svg, margin.left - 10, yScale(y) + 4, `${y}°`, "tick-label", "end");
  }
  for (const x of [0, 30, 60, 90]) {
    line(svg, xScale(x), margin.top, xScale(x), height - margin.bottom, "grid-line");
    text(svg, xScale(x), height - margin.bottom + 22, `${x}°`, "tick-label", "middle");
  }

  line(svg, margin.left, yScale(0), width - margin.right, yScale(0), "axis");
  line(svg, margin.left, margin.top, margin.left, height - margin.bottom, "axis");
  text(svg, width / 2, height - 14, "incident angle", "axis-label", "middle");
  text(svg, 16, height / 2, "signed viewing angle", "axis-label", "middle", -90);

  const path = points
    .filter((p) => Number.isFinite(p.angle))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.incidentDeg).toFixed(2)} ${yScale(p.angle).toFixed(2)}`)
    .join(" ");

  if (path) {
    const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
    curve.setAttribute("d", path);
    curve.setAttribute("class", "curve");
    svg.appendChild(curve);
  }

  if (Number.isFinite(current.angle)) {
    const cx = xScale(state.incidentDeg);
    const cy = yScale(current.angle);
    line(svg, cx, margin.top, cx, height - margin.bottom, "marker-line");
    circle(svg, cx, cy, 6, "marker-dot");
    text(svg, cx + 9, cy - 9, `${current.angle.toFixed(1)}°`, "point-label", "start");
  }

  for (const item of extrema) {
    const cx = xScale(item.incidentDeg);
    const cy = yScale(item.angle);
    circle(svg, cx, cy, 5, "extremum-dot");
    text(svg, cx + 8, cy + 16, `${item.angle.toFixed(1)}°`, "point-label", "start");
  }

  const strongest = strongestExtremum(state.n, state.k);
  els["chart-note"].textContent = strongest
    ? `Bright direction near ${strongest.angle.toFixed(1)}° at ${strongest.incidentDeg.toFixed(1)}°.`
    : "No visible extremum for these parameters.";
}

function renderRayDiagram() {
  const svg = els["ray-diagram"];
  const width = 760;
  const center = { x: 360, y: 220 };
  const radius = 110;
  const rayColor = currentRayColor();
  const currentTrace = traceRay(state.incidentDeg, state.n, state.k);
  const bright = strongestExtremum(state.n, state.k);
  const brightTrace = bright ? traceRay(bright.incidentDeg, state.n, state.k) : null;

  svg.replaceChildren();

  const bundle = bundleAngles(state.incidentDeg);
  const top = pointOnDrop(Math.max(...bundle), center, radius);
  const bottom = pointOnDrop(Math.min(...bundle), center, radius);
  polygon(svg, [
    [width - 34, top.y],
    [width - 34, bottom.y],
    [top.x, top.y],
    [bottom.x, bottom.y],
  ], "beam-band", { fill: rayColor });

  circle(svg, center.x, center.y, radius, "drop-fill");
  path(svg, `M ${center.x - 44} ${center.y - 64} Q ${center.x - 72} ${center.y - 38} ${center.x - 76} ${center.y + 6}`, "drop-shine");
  text(svg, center.x, center.y + radius + 28, "water drop", "ray-label", "middle");

  for (const angle of bundle) {
    const entry = pointOnDrop(angle, center, radius);
    coloredLine(svg, width - 34, entry.y, entry.x, entry.y, "ray-faint", rayColor);
  }

  if (brightTrace) {
    drawTrace(svg, brightTrace, center, radius, rayColor, "ray-bright");
    labelTrace(svg, brightTrace, center, radius, `bright ray ${formatAngle(bright.angle)}`, "ray-label", rayColor, 16);
  }

  if (currentTrace) {
    drawTrace(svg, currentTrace, center, radius, rayColor, "ray-current");
    drawNormal(svg, currentTrace.entry, center, radius);
    labelTrace(svg, currentTrace, center, radius, `selected ray ${formatAngle(state.incidentDeg)}`, "ray-label", rayColor, -16);
  }

  text(svg, width - 128, top.y - 14, "parallel sunlight", "ray-label", "middle");
  els["ray-note"].textContent = bright
    ? `Bright ray uses incident angle ${bright.incidentDeg.toFixed(1)}° for order ${state.k}.`
    : "No bright ray is defined for these parameters.";
}

function renderTables() {
  const current = currentValues();
  if (!state.showTable) {
    els["current-table"].innerHTML = `<p class="small">Current signed angle: ${formatAngle(current.angle)}.</p>`;
  } else {
    els["current-table"].innerHTML = `
      <table>
        <tbody>
          <tr><th>Incident angle α</th><td>${formatAngle(state.incidentDeg)}</td></tr>
          <tr><th>Refracted angle β</th><td>${formatAngle(current.beta == null ? null : current.beta * DEG)}</td></tr>
          <tr><th>Signed viewing angle</th><td>${formatAngle(current.angle)}</td></tr>
          <tr><th>Raw deviation</th><td>${formatAngle(current.raw == null ? null : current.raw * DEG)}</td></tr>
        </tbody>
      </table>`;
  }

  const rows = [];
  for (const order of [1, 2]) {
    for (const key of ["red", "violet"]) {
      const ext = strongestExtremum(PRESETS[key].n, order);
      rows.push({
        order,
        preset: PRESETS[key].label,
        incident: ext?.incidentDeg,
        angle: ext?.angle,
      });
    }
  }

  els["summary-table"].innerHTML = `
    <table>
      <thead>
        <tr><th>Order</th><th>Preset</th><th>Incident</th><th>Viewing angle</th></tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${row.order}</td>
            <td>${row.preset}</td>
            <td>${formatAngle(row.incident)}</td>
            <td>${formatAngle(row.angle)}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function formatAngle(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)}°` : `<span class="warning">not defined</span>`;
}

function currentRayColor() {
  if (state.preset === "red") return "#d13a32";
  if (state.preset === "violet") return "#6d55d8";
  return "#0b6d86";
}

function bundleAngles(centerAngle) {
  const offsets = [-7, -4, -1.5, 1.5, 4, 7];
  return offsets
    .map((offset) => Math.max(2, Math.min(86, centerAngle + offset)))
    .sort((a, b) => b - a);
}

function traceRay(incidentDeg, n, k) {
  if (!Number.isFinite(incidentDeg) || !Number.isFinite(n) || !Number.isFinite(k)) return null;

  const alpha = Math.max(0.5, Math.min(89.5, incidentDeg)) * RAD;
  let point = { x: Math.cos(alpha), y: Math.sin(alpha) };
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

function pointOnDrop(incidentDeg, center, radius) {
  const alpha = Math.max(0, Math.min(89.9, incidentDeg)) * RAD;
  return toSvgPoint({ x: Math.cos(alpha), y: Math.sin(alpha) }, center, radius);
}

function toSvgPoint(point, center, radius) {
  return {
    x: center.x + point.x * radius,
    y: center.y - point.y * radius,
  };
}

function drawTrace(svg, trace, center, radius, color, className) {
  const entry = toSvgPoint(trace.entry, center, radius);
  coloredLine(svg, 726, entry.y, entry.x, entry.y, className, color);

  const internalPoints = trace.internal.map((point) => toSvgPoint(point, center, radius));
  polyline(svg, internalPoints, `${className} ray-inside`, color);

  const exit = toSvgPoint(trace.exit, center, radius);
  const outEnd = toSvgPoint(add(trace.exit, scale(trace.outgoing, 1.45)), center, radius);
  coloredLine(svg, exit.x, exit.y, outEnd.x, outEnd.y, className, color);
  circle(svg, entry.x, entry.y, 4.5, "marker-dot");
}

function drawNormal(svg, entryUnit, center, radius) {
  const entry = toSvgPoint(entryUnit, center, radius);
  coloredLine(svg, center.x, center.y, entry.x, entry.y, "normal-line", "currentColor");
}

function labelTrace(svg, trace, center, radius, label, className, color, offsetY) {
  const outEnd = toSvgPoint(add(trace.exit, scale(trace.outgoing, 0.62)), center, radius);
  const labelEl = text(svg, outEnd.x + 10, outEnd.y + offsetY, label, className, "start");
  labelEl.setAttribute("fill", color);
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
  svg.appendChild(el);
}

function coloredLine(svg, x1, y1, x2, y2, className, color) {
  if (![x1, y1, x2, y2].every(Number.isFinite)) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x2);
  el.setAttribute("y2", y2);
  el.setAttribute("class", className);
  el.setAttribute("stroke", color);
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

function path(svg, d, className) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", d);
  el.setAttribute("class", className);
  svg.appendChild(el);
}

function polyline(svg, points, className, color) {
  if (!points.length || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  el.setAttribute("points", points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" "));
  el.setAttribute("class", className);
  el.setAttribute("stroke", color);
  svg.appendChild(el);
}

function polygon(svg, points, className, attrs = {}) {
  if (!points.length || points.some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y))) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  el.setAttribute("points", points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" "));
  el.setAttribute("class", className);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  svg.appendChild(el);
}
