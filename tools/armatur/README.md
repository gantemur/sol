# Арматур · Armatur cutting planner

Static, standalone 1D cutting-stock calculator. The main page is bilingual
(Mongolian by default, English optional). No network service or build step is
required.

## Versions

- **Main page:** current planner, with an improved solver, editable
  length/quantity rows, cutting diagrams, and copy/CSV/print output.
- **legacy/index.html:** corrected legacy longest-first calculator. It keeps
  the old greedy pattern selection and simple text result. Arithmetic, units,
  validation, and termination are repaired; it is not globally optimal.
  Legacy does not include a saw-cut-width parameter.

The migrated original was in tools/armatur/index.html and
tools/armatur/armatur.js before this update. The ignored _import/ remains
untouched. The corrected legacy code is independent of the new engine.

## Model and algorithm

Inputs: one unlimited stock-rod length, rebar diameter in millimetres, optional
saw kerf in millimetres (default 0), and requested lengths and integer
quantities. All stock and piece lengths use the same selected unit (mm, cm, m).

All lengths convert to exact integer *tenths of a millimetre* before solving.
This prevents floating-point residuals such as those that made the original
loop run forever for stock 0.6 and pieces 0.1, 0.2, 0.3.

For a rod containing n pieces of combined length S and saw width k:

- With a remainder, n cuts are required, so S + n*k <= stock.
- For an exact end fit, the last piece is the uncut end:
  S + (n-1)*k = stock.

The engine verifies length conservation separately for every pattern. Waste
means *offcut plus material removed by the saw*. With one stock size and a
fixed complete order, minimizing rod count also minimizes total waste.

The engine includes:

1. Corrected longest-first greedy baseline, retaining the old choices when
   kerf is zero.
2. First-fit and best-fit heuristics with ascending/descending piece order for
   moderate-sized orders.
3. A bounded branch-and-bound assignment search for orders up to 26 individual
   pieces, with identical-state symmetry pruning.
4. A safe lower bound ceil(total requested length / stock length). If the
   plan matches that bound, optimality is proved immediately. Otherwise
   completing exact search proves optimality. If the search is not exhaustive,
   the UI says *best found*, not *proven optimal*.

The calculation runs in a Web Worker so larger inputs do not block the UI.
The worker has bounded search and an outer timeout. In environments without
Web Workers, a short-budget synchronous fallback is used.

Approximate purchased-stock mass uses the original rebar formula,
0.888 kg/m for 12 mm diameter, scaling by diameter squared.
It is an estimate rather than a manufacturer's nominal mass table.

## Limitations

- Stock rods are assumed unlimited and all the same length.
- No inventory, multiple stock lengths, cost optimization, or saved offcut
  reuse yet.
- The small-case exact search is exponential in the worst case; larger
  solutions are heuristic unless the length bound proves optimality.
- Kerf is assumed constant, with no clamping, end-trimming, bend, or
  fabrication allowances.
- The calculation does not replace a fabrication-specific cutting plan.

## Tests

From the Sol repository root:

    node tools/armatur/tests/engine.test.js
    node scripts/check-static.js
    node scripts/test-static-check.js

The solver tests cover the original decimal-input infinite loop, a greedy
counterexample, kerf edge conditions, unit conversion, mass, conservation of
length and demand, large repeated patterns, comparison with the corrected
legacy method, and exact solutions checked against an independent small
set-partition dynamic program.
