# Notebook tool audit

Audit-only pass for `_import/numbers`, `_import/spectrum`, and `_import/power`.

No notebooks were executed. `_import/` was inspected as ignored local source/archive material and was not modified.

## A. Executive Summary

Best 3 immediate migration candidates:

1. `rainbow-angle` from `_import/spectrum/rbk.ipynb` and `_import/spectrum/rainbow.py`.
   A compact, visual rainbow/refraction-angle tool with simple formulas, clear sliders, and low phone risk.
2. `newton-fractal` from `_import/power/newton.ipynb`.
   A visually compelling Newton-Raphson fractal explorer; best implemented with canvas and moderate resolution controls.
3. `blackbody-temperature` from `_import/spectrum/temperature.ipynb`.
   A useful color-temperature/blackbody spectrum visualizer with direct educational value and a natural SVG/canvas display.

Best 3 later candidates:

1. `power-series` from `_import/power/pow.ipynb` and `_import/power/power.ipynb`.
   Good educational tool, but needs design work to avoid too many selectable series.
2. `interpolation-lab` from `_import/power/interp.ipynb`.
   Useful visualizer for Chebyshev, Lagrange/linear, and Bernstein/de Casteljau ideas; needs careful simplification.
3. `chaos-sync` from `_import/power/sync.ipynb`.
   Interesting Lorenz/Rossler synchronization animation, but numerical and UI scope should be constrained before porting.

Likely archive-only for now:

- `_import/power/nn.ipynb` and `_import/power/nn1.ipynb`: large, output-heavy neural-network exploration notebooks.
- `_import/numbers/tmp.ipynb`: mixed scratch material with many unrelated experiments.
- `_import/numbers/elliptic.ipynb`: rich but broad elliptic-function exploration; better as reference until a specific web story is chosen.
- `_import/spectrum/sound.ipynb` plus WAV files: audio notebook depends on desktop/audio packages and overlaps the existing Doppler/Web Audio tool direction.
- `_import/spectrum/thermo.ipynb`: Maxwell-Boltzmann style plots, possible future physics note, but not an immediate standalone tool.

Major duplication findings:

- `_import/numbers/primes.ipynb` and `_import/power/primes.ipynb` are byte-identical.
- `_import/numbers/zeta.ipynb` and `_import/power/zeta.ipynb` share the same core zeta plotting code, but are not identical. The `numbers` version has extra later real-axis pole/log-zeta plots and different output/save choices.
- `_import/power/power.ipynb` and `_import/power/pow.ipynb` overlap heavily. `power.ipynb` is a focused exponential-series/roundoff notebook; `pow.ipynb` generalizes to many series.

## B. Import Inventory

### `_import/numbers`

Concise tree:

```text
numbers/
  README.md
  LICENSE
  elliptic.ipynb
  primes.ipynb
  sylvester.ipynb
  tmp.ipynb
  zeta.ipynb
  *.png generated plots
  clip*.txt
  .ipynb_checkpoints/
  .git/
```

Notebooks:

- `elliptic.ipynb` - 1.7 MB, 34 cells, 31 code cells, 22 embedded images. Elliptic/lemniscate functions, `mpmath`, 2D/3D plots.
- `primes.ipynb` - 1.3 MB, 60 code cells, 40 embedded images. Prime counting, Chebyshev functions, Stirling/Legendre style approximations.
- `sylvester.ipynb` - 585 KB, 39 code cells, 12 embedded images. Sylvester/Egyptian-fraction-like sequences, Chebyshev arrangements, eigen/stability experiments.
- `tmp.ipynb` - 1.9 MB, 83 code cells, 41 embedded images. Mixed scratch number/analysis experiments.
- `zeta.ipynb` - 322 KB, 9 code cells, 6 embedded images. Complex zeta magnitude/argument plots and real-axis zeta/log-zeta behavior.

Other files:

- README says: `# numbers` and `Number theory experiments`.
- `LICENSE` is GPL v3 text.
- Data/text: `clip.txt`, `clip7.txt`, `clip8.txt`.
- Images: many generated PNGs, roughly 36 KB to 596 KB, with plot-like dimensions such as `1655x1007`, `2407x1485`, and `2454x1449`.

Obvious themes:

- Prime counting and analytic number theory.
- Zeta function visualization.
- Sylvester/Egyptian fraction experiments.
- Elliptic and lemniscatic functions.
- Generated static plots from exploratory notebooks.

### `_import/spectrum`

Concise tree:

```text
spectrum/
  LICENSE
  rainbow.py
  rainbow.ipynb
  rbk.ipynb
  sound.ipynb
  temperature.ipynb
  thermo.ipynb
  tempd.png
  triangle.wav
  -f.wav
  .ipynb_checkpoints/
  .git/
```

Notebooks and scripts:

- `rainbow.py` - 1.6 KB. Defines rainbow/refraction functions `rbk`, `rbkdeg`, `delta`; prints red/violet angles and plots deviation curves.
- `rainbow.ipynb` - 11 KB, 2 code cells, 1 embedded image. Builds a visible-spectrum colormap/rainbow strip.
- `rbk.ipynb` - 59 KB, 6 cells, 1 markdown derivation, 1 embedded plot. Derives and plots k-th order rainbow angles.
- `temperature.ipynb` - 106 KB, 16 code cells, 3 embedded images. Planet temperatures/albedo and blackbody/color-temperature-style plots; function `tem`.
- `thermo.ipynb` - 71 KB, 7 code cells, 2 embedded images. Maxwell-Boltzmann/pdf-cdf-like thermodynamics plots.
- `sound.ipynb` - 3.4 KB, uses `pyaudio`, `wave`, `array`; no embedded images.

Other files:

- `LICENSE` is GPL v3 text.
- `tempd.png` is 82 KB, `1861x1233`.
- `triangle.wav` and `-f.wav` are each 517 KB, stereo, 44.1 kHz, 3.0 seconds.

Obvious themes:

- Visible spectrum colors.
- Rainbow/refraction geometry.
- Color temperature / blackbody-ish plots.
- Simple generated audio.
- Basic kinetic/thermal distribution plots.

### `_import/power`

Concise tree:

```text
power/
  interp.ipynb
  newton.ipynb
  nn.ipynb
  nn1.ipynb
  pi.ipynb
  pow.ipynb
  power.ipynb
  primes.ipynb
  sync.ipynb
  trig.ipynb
  zeta.ipynb
  dat.txt
  1d01.txt ... 1d21.txt
  nn*.tex
```

Notebooks:

- `newton.ipynb` - 189 KB, 5 cells, 2 markdown cells, 2 embedded images. Newton-Raphson iteration for `z^3 - 1 = 0`, colored basins and iteration histogram.
- `power.ipynb` - 154 KB, 11 cells, 3 embedded images. Truncated exponential series with injected roundoff/noise.
- `pow.ipynb` - 157 KB, 32 code cells, 7 embedded images. Multiple power series: exponential, geometric, Mercator/log, Gregory/arctan, sine/cosine, hyperbolic, arcsine, etc.
- `interp.ipynb` - 138 KB, 23 cells, 11 embedded images and 2 stored errors. Chebyshev approximation, interpolation kernels, de Casteljau/Bernstein.
- `pi.ipynb` - 44 KB, 51 code cells, 1 embedded image. Many pi approximation formulas: Archimedes, Liu Hui, Viete, Wallis, Leibniz/Madhava, Machin, Ramanujan, Brent-Salamin, Borwein.
- `trig.ipynb` - 52 KB, 9 code cells, 3 embedded images. Bhaskara sine/cosine approximations.
- `sync.ipynb` - 1.4 MB, 19 cells, 12 embedded images. Lorenz/Rossler synchronization/data-assimilation by one-way coupling.
- `primes.ipynb` - 1.3 MB, byte-identical duplicate of `numbers/primes.ipynb`.
- `zeta.ipynb` - 264 KB, 7 cells, 4 embedded images. Trimmed zeta visualization variant.
- `nn.ipynb` - 5.3 MB, 113 code cells, 65 embedded images. Neural-network/loss-surface/classification experiments.
- `nn1.ipynb` - 995 KB, 29 code cells, 19 embedded images. Smaller neural-network/activation experiments.

Other files:

- No README/LICENSE/COPYING file found at top level.
- `1d01.txt` through `1d21.txt` range from about 5 KB to 547 KB and contain prime-counting-like numeric tables.
- `dat.txt` is 3.6 MB.
- `nn*.tex` files are small TeX fragments, roughly 689 B to 2.3 KB.

Obvious themes:

- Numerical methods, approximations, and plotting.
- Fractals/Newton iteration.
- Power series and roundoff.
- Interpolation.
- Pi approximations.
- Trigonometric approximations.
- Prime/zeta duplication with `numbers`.
- Chaotic synchronization.
- Neural-network teaching experiments.

## C. Duplication Analysis

### `numbers/primes.ipynb` vs `power/primes.ipynb`

- Full SHA-256 for both files: `fb83aa810e10d5ac0ec4e6fa8014ec537b5eca4bd7c91407b1ff6631e10ed2c7`.
- Both are 1,312,711 bytes.
- Both have 60 cells, all code cells.
- Source hashes match exactly.
- All 60 corresponding cell sources are equal.

Conclusion: exact duplicate. Treat `power/primes.ipynb` as duplicate/covered by `numbers/primes.ipynb`.

### `numbers/zeta.ipynb` vs `power/zeta.ipynb`

- `numbers/zeta.ipynb`: 329,669 bytes, 9 code cells, 6 image outputs.
- `power/zeta.ipynb`: 270,207 bytes, 7 code cells, 4 image outputs.
- Source hashes differ.
- First two cells match.
- Cell 2 is nearly identical except the `numbers` version has `plt.savefig("zetamag.png", dpi=200)` commented out, while the `power` version has it active.
- Cells 3, 4, and 5 match.
- `numbers` has extra later real-axis plots of `zeta(s)` vs `1/(s-1)` and `ln(zeta(s))` vs `-ln(s-1)`.

Conclusion: overlapping variants. Use `numbers/zeta.ipynb` as the fuller source of record; treat `power/zeta.ipynb` as a trimmed/alternate-output duplicate.

### `power/power.ipynb` vs `power/pow.ipynb`

- Both explore truncated series and roundoff/noise.
- `power.ipynb` is focused on `exp(x)` and error curves.
- `pow.ipynb` expands the same idea to many series and approximation families.

Conclusion: not identical, but conceptually overlapping. A web tool should start from the focused exponential-series story and later add selectable series from `pow.ipynb`.

## D. Candidate Table

| Source | Notebook/file | Proposed tool id | Topic | Priority | JS difficulty | Phone risk | Recommended next action |
|---|---|---:|---|---|---|---|---|
| spectrum | `rbk.ipynb`, `rainbow.py` | `rainbow-angle` | Rainbow/refraction angles | A | easy | low | Migrate first or second; pure formulas + SVG/canvas plot |
| spectrum | `temperature.ipynb` | `blackbody-temperature` | Color temperature and blackbody curves | A | medium | low | Migrate as standalone optics/color tool |
| power | `newton.ipynb` | `newton-fractal` | Newton-Raphson basins | A | medium | medium | Migrate with canvas resolution controls |
| power | `power.ipynb`, `pow.ipynb` | `power-series` | Taylor/power series and roundoff | B | easy-medium | low | Design a smaller first version around exp/sin/log |
| power | `interp.ipynb` | `interpolation-lab` | Interpolation and approximation | B | medium | low-medium | Simplify to draggable points and selectable method |
| power | `pi.ipynb` | `pi-approximations` | Pi approximation methods | B | easy-medium | low | Pick 4-6 methods, show convergence table/plot |
| power | `trig.ipynb` | `trig-approx` | Bhaskara trig approximations | B | easy | low | Fold into approximation/series suite or make tiny page |
| numbers | `primes.ipynb` | `prime-patterns` | Prime counting and approximations | B | medium | medium | Use precomputed/sieve in JS; avoid huge tables initially |
| numbers | `zeta.ipynb` | `zeta-map` | Complex zeta magnitude/argument | B | hard | high | Later port; maybe use Web Worker/canvas tiling |
| numbers | `sylvester.ipynb` | `sylvester-fractions` | Sylvester/Egyptian fraction patterns | B | medium | low | Needs narrative/design before port |
| power | `sync.ipynb` | `chaos-sync` | Lorenz/Rossler synchronization | B | medium-hard | medium | Later canvas/Web Worker animation |
| power | `nn.ipynb`, `nn1.ipynb` | `neural-network-toy` | Neural-network surfaces/classification | C | hard | high | Archive/reference for now |
| numbers | `elliptic.ipynb` | `elliptic-functions` | Elliptic/lemniscatic functions | C | hard | high | Archive until a narrow visual story is chosen |
| numbers | `tmp.ipynb` | none | Mixed scratch notebook | C | hard | high | Archive/reference only |
| spectrum | `sound.ipynb`, WAV files | none | Generated audio | C | medium | medium | Archive; overlaps future Web Audio direction |
| spectrum | `thermo.ipynb` | `thermal-distribution` | Maxwell-Boltzmann-style plots | C | easy-medium | low | Archive until paired with a stronger story |
| power | `primes.ipynb` | none | Prime notebook duplicate | D | n/a | n/a | Covered by `numbers/primes.ipynb` |
| power | `zeta.ipynb` | none | Zeta notebook variant | D | n/a | n/a | Covered by fuller `numbers/zeta.ipynb` |

## E. Per-candidate Notes

### `rainbow-angle`

- Source files: `_import/spectrum/rbk.ipynb`, `_import/spectrum/rainbow.py`.
- Idea: compute incident/refraction/deviation angles for k-th order rainbows using refractive index `n`, and plot deviation angle vs incident angle.
- Minimal web version: one page showing primary/secondary rainbow geometry and angle curves.
- GUI design:
  - sliders: refractive index, rainbow order `k`, incident angle;
  - toggles: red/violet water index pair, show extrema, degrees/radians;
  - output: SVG/canvas curve plus numeric red/violet deviation table.
- Implementation notes: formulas are tiny and port directly to JS `Math`.
- Risks: explain sign conventions clearly; avoid overloading with high-order rainbows initially.
- Later extensions: dispersion by wavelength, droplet schematic, visible color band.
- Rendering recommendation: SVG for curves and labels; optional canvas for colored band.
- Standalone: yes.
- Shared code: `shared/plotting` could help later, but first version should remain standalone.

### `blackbody-temperature`

- Source files: `_import/spectrum/temperature.ipynb`, `_import/spectrum/tempd.png`.
- Idea: plot Planck-like spectral curves/color-temperature behavior and simple planetary equilibrium/albedo values.
- Minimal web version: temperature slider with spectrum curve and approximate color swatch.
- GUI design:
  - sliders: temperature, wavelength range, linear/log intensity;
  - selectors: show normalized curve, show solar/planet markers;
  - output: spectrum strip, curve plot, color swatch, key wavelength readout.
- Implementation notes: JS Planck formula is straightforward; color matching can start approximate.
- Risks: color science can get subtle; browser/device color differences; avoid false precision.
- Later extensions: CIE color matching, stellar classes, solar irradiance overlays.
- Rendering recommendation: canvas for spectrum strip and curve; plain DOM for values.
- Standalone: yes.
- Shared code: `shared/color` would likely help after the first color/spectrum tool.

### `newton-fractal`

- Source files: `_import/power/newton.ipynb`.
- Idea: color the complex plane by which root Newton's method converges to, and by iteration count.
- Minimal web version: cubic `z^3 - 1` fractal with pan/zoom rectangle and resolution slider.
- GUI design:
  - inputs: polynomial preset, max iterations, tolerance, color mode, resolution;
  - gestures: tap/drag to zoom rectangle or buttons for zoom in/out/reset;
  - output: canvas fractal and convergence histogram.
- Implementation notes: pure complex arithmetic in JS. Use progressive rendering or low-resolution preview for phones.
- Risks: high resolution can block UI; use chunked rendering or Web Worker if needed.
- Later extensions: custom polynomials, roots editor, export image.
- Rendering recommendation: canvas, possibly ImageData; Web Worker later if needed.
- Standalone: yes.
- Shared code: `shared/complex` would help if zeta/fractal tools follow.

### `power-series`

- Source files: `_import/power/power.ipynb`, `_import/power/pow.ipynb`.
- Idea: compare true functions to truncated power series and illustrate roundoff/noise/error behavior.
- Minimal web version: exponential Taylor approximation with degree/noise sliders and error curve.
- GUI design:
  - sliders: degree, x range, noise level;
  - selectors: function family (`exp`, later `sin`, `cos`, `log(1+x)`, `atan`);
  - output: function vs approximation plot and error plot.
- Implementation notes: formulas are simple; avoid random noise changing every frame unless seeded.
- Risks: too many series in `pow.ipynb`; choose a guided subset.
- Later extensions: convergence radius, partial-sum animation, floating-point precision demo.
- Rendering recommendation: SVG or canvas plot.
- Standalone: yes.
- Shared code: `shared/plotting` and `shared/numerics` could help later.

### `interpolation-lab`

- Source files: `_import/power/interp.ipynb`.
- Idea: compare interpolation/approximation methods such as Chebyshev, linear, Bernstein/de Casteljau.
- Minimal web version: a fixed target function and selectable approximation method/degree.
- GUI design:
  - sliders: degree, number of sample points;
  - selectors: method, target function;
  - optional draggable points for Bernstein/de Casteljau;
  - output: curve comparison and error plot.
- Implementation notes: Chebyshev and Bernstein algorithms port cleanly; class structure can be simplified.
- Risks: notebook has stored errors; needs careful validation against known test functions.
- Later extensions: Runge phenomenon demo, draggable interpolation nodes.
- Rendering recommendation: SVG/canvas plotting.
- Standalone: yes.
- Shared code: `shared/plotting`, `shared/numerics` later.

### `pi-approximations`

- Source files: `_import/power/pi.ipynb`.
- Idea: show convergence of historical/formulaic pi approximations.
- Minimal web version: method selector and convergence plot/table.
- GUI design:
  - selectors: Archimedes, Liu Hui, Viete, Wallis, Leibniz/Madhava, Machin, Ramanujan;
  - slider: iteration count;
  - output: approximation, error digits, convergence plot.
- Implementation notes: many formulas are small; avoid porting every method initially.
- Risks: some formulas require careful numeric stability and big-number decisions.
- Later extensions: exact rational display, historical notes, arbitrary precision.
- Rendering recommendation: plain DOM table plus SVG/canvas plot.
- Standalone: yes.
- Shared code: `shared/numerics` could help if arbitrary precision is added.

### `trig-approx`

- Source files: `_import/power/trig.ipynb`.
- Idea: compare Bhaskara sine/cosine approximations to true trig functions.
- Minimal web version: a small plot with error curve and formula display.
- GUI design:
  - selector: sine/cosine;
  - slider: interval or sample x;
  - output: curve overlay and error readout.
- Implementation notes: very easy pure JS.
- Risks: may be too small as a standalone tool; could be a tab inside `power-series`.
- Later extensions: other historical approximations.
- Rendering recommendation: SVG/canvas.
- Standalone: yes, though possibly better bundled with approximations.
- Shared code: none needed at first.

### `prime-patterns`

- Source files: `_import/numbers/primes.ipynb` as source of record; `_import/power/primes.ipynb` is duplicate.
- Idea: visualize prime-counting functions and approximations.
- Minimal web version: sieve primes up to `N`, plot `pi(x)`, `x/log(x)`, maybe Chebyshev theta/psi.
- GUI design:
  - slider: maximum N;
  - toggles: show prime counting, approximation, error;
  - output: step plot/curve and numeric table.
- Implementation notes: JS sieve is easy for modest N; avoid big notebook-scale data initially.
- Risks: phone performance if N too high; analytic functions may need approximation choices.
- Later extensions: prime spirals, zeta-prime relation, precomputed tables.
- Rendering recommendation: canvas/SVG.
- Standalone: yes.
- Shared code: `shared/plotting`, maybe `shared/numerics`.

### `zeta-map`

- Source files: `_import/numbers/zeta.ipynb` as fuller source of record.
- Idea: visualize complex zeta magnitude and argument.
- Minimal web version: fixed viewport heatmap near critical strip, with pan/zoom later.
- GUI design:
  - controls: viewport preset, resolution, color map, magnitude/argument mode;
  - output: canvas heatmap and point readout.
- Implementation notes: direct zeta evaluation in JS is nontrivial. Use approximate series only in safe regions or precomputed tiles first.
- Risks: high CPU cost, numerical accuracy, phone performance.
- Later extensions: Web Worker, critical line, zeros overlay, Euler product demonstration.
- Rendering recommendation: canvas/ImageData; maybe Web Worker.
- Standalone: yes, but harder than A candidates.
- Shared code: `shared/complex`, `shared/color`, `shared/numerics`.

### `sylvester-fractions`

- Source files: `_import/numbers/sylvester.ipynb`.
- Idea: visualize Sylvester/Egyptian fraction arrangements and step/pair patterns.
- Minimal web version: generate selected sequences and show fraction decomposition/periodic step function.
- GUI design:
  - selectors: preset sequence family;
  - output: fraction list, step plot, simple period table.
- Implementation notes: Python uses integer/fraction arithmetic; JS BigInt/Fraction helper may be needed.
- Risks: notebook is dense and lacks markdown; needs conceptual reconstruction before coding.
- Later extensions: compare Chebyshev/Hammond/Sylvester arrangements.
- Rendering recommendation: DOM table plus SVG step plot.
- Standalone: yes.
- Shared code: `shared/numerics` only if rational arithmetic recurs.

### `chaos-sync`

- Source files: `_import/power/sync.ipynb`.
- Idea: animate Lorenz/Rossler systems and synchronization by one-way coupling.
- Minimal web version: Lorenz drive/model pair with coupling slider and error plot.
- GUI design:
  - sliders: coupling strength, noise, time step/speed;
  - selector: Lorenz/Rossler;
  - output: 2D projection canvas and error-vs-time plot.
- Implementation notes: RK4 solver ports directly; animation loop can update trajectories incrementally.
- Risks: numerical stability; 3D projection/interaction complexity; phone CPU.
- Later extensions: 3D view, noise injection, parameter presets.
- Rendering recommendation: canvas, maybe Web Worker later.
- Standalone: yes.
- Shared code: `shared/numerics` and `shared/plotting` later.

## F. Licensing/provenance notes

- `_import/numbers` contains a GPL v3 `LICENSE` and a short README. Treat as GPL-covered unless relicensed by the author.
- `_import/spectrum` contains a GPL v3 `LICENSE`. Treat as GPL-covered unless relicensed by the author.
- `_import/power` has no top-level README/LICENSE/COPYING file found in this audit.
- `sol` currently states repository license is TBD. Do not copy notebook code into public tools until the license decision is explicit.
- Assuming these are the user's old repos, recommended approach:
  1. Decide repository-wide license or per-tool licenses before porting code.
  2. Preserve source attribution in each migrated tool README.
  3. If relicensing from old GPL notebooks to another license, record that decision explicitly.
  4. For algorithmic rewrites from scratch, still cite the old notebooks as provenance/source inspiration.

## G. Shared-code implications

Recommendation for now: keep the first migrated notebook-derived tools standalone.

Potential shared modules later:

- `shared/complex`: useful for `newton-fractal` and `zeta-map`.
- `shared/plotting`: useful for power series, interpolation, pi convergence, prime plots, rainbow curves.
- `shared/color`: useful for visible spectrum, blackbody temperature, zeta heatmaps, Newton color maps.
- `shared/numerics`: useful for interpolation, ODE solvers, pi formulas, rational arithmetic, series approximations.
- `shared/random`: not needed immediately; maybe useful for neural-network/chaos demos later.

Do not create shared modules before the first notebook-derived tool ships. The safest path is to build `rainbow-angle`, `blackbody-temperature`, or `newton-fractal` as a standalone folder first, then extract shared helpers only when a second native tool repeats real code.

## H. Recommended next Codex prompts

### Prompt 1: easiest/high-value migration

```text
Work in `/Users/gantumur/Documents/Science/sol`.

Do not modify `_import/`.
Use `docs/NOTEBOOK_TOOL_AUDIT.md` as context.

Migrate the rainbow/refraction notebook material into a new standalone static tool:

- Create `tools/rainbow-angle/`.
- Use `_import/spectrum/rbk.ipynb` and `_import/spectrum/rainbow.py` only as reference; do not execute notebooks.
- Build a lightweight phone-friendly page with no framework.
- Inputs: refractive index, rainbow order k, red/violet toggle or presets.
- Output: deviation angle curve, primary/secondary numeric angle table, simple explanation.
- Keep code local to the tool folder.
- Add the tool to `tools.json` and homepage.
- Add a short README with provenance and license-TBD note.
- Verify with `node scripts/check-static.js`, local server, and browser screenshot/pixel check if useful.
```

### Prompt 2: deeper later port

```text
Work in `/Users/gantumur/Documents/Science/sol`.

Do not modify `_import/`.
Use `docs/NOTEBOOK_TOOL_AUDIT.md` as context.

Design and migrate `newton-fractal` from `_import/power/newton.ipynb` as a standalone static canvas tool:

- Keep the first version limited to z^3 - 1.
- Provide canvas rendering, max-iteration/tolerance/resolution controls, reset/zoom controls, and a small convergence histogram.
- Use chunked rendering so phones do not freeze.
- Keep all code inside `tools/newton-fractal/` unless a tiny local helper is clearly justified.
- Add README/provenance/license-TBD notes.
- Add registry/homepage entries.
- Verify the canvas is nonblank and changes when controls change.
```
