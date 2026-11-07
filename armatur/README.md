# Арматур · Armatur cutting planner

Static, standalone 1D cutting-stock calculator. The main page is bilingual
(Mongolian by default, English optional). No network service or build step is
required.

## Dedication

This tool was first created many years ago at the request of my friend
Purev-Erdene Munkhuu (Мөнхөөгийн Пүрэв-Эрдэнэ), to help with his work as chief
engineer on many major construction projects. It is dedicated to his memory.

## Credits and license

The historical source is [gantemur/armatur](https://github.com/gantemur/armatur),
including [revision f937ba9](https://github.com/gantemur/armatur/tree/f937ba9ab252372858f2e81076f2663772f87fcb).
The current planner and corrected legacy reference continue that tool.
No third-party runtime libraries, fonts, images, or datasets are bundled here.

Copyright (c) 2020, 2026 Tsogtgerel Gantumur.

This Armatur package is distributed under the [MIT License](LICENSE),
including the current planner, corrected legacy version, tests, and ordinary
accompanying documentation. The owner explicitly approved this license for
Armatur on 3 November 2026. The legacy subfolder includes its own copy of the
full license so it can be distributed independently.

The historical upstream revision did not include a license. The MIT grant
applies to this distributed Sol Armatur package; it does not change other
Sol tools or rewrite historical revisions in the upstream repository.
The copyright years identify the published 2020 source and the 2026 update,
not a claim that the tool was first created in 2020.

Generated cutting lists contain the user's inputs and calculated results;
using or sharing those lists does not require reproducing the interface footer.

## Browser updates

The HTML, stylesheet, scripts, worker, and worker's engine import use the same
release token in their asset URLs. Update all of these URLs together when
releasing changed assets; the static tests check that the chain stays in sync.
This avoids mixing a newer HTML page with an older cached translation script
or stylesheet. Unknown static translation keys leave the readable HTML text
intact instead of displaying internal key names.

## Versions

- **Main page:** current planner, with an improved solver, editable
  length/quantity rows, cutting diagrams, and copy/CSV/print output.
- **legacy/index.html:** corrected legacy longest-first calculator. It keeps
  the old greedy pattern selection and simple text result. Arithmetic, units,
  validation, and termination are repaired; it is not globally optimal.
  Legacy does not include a saw-cut-width parameter.

The migrated original was in tools/armatur/index.html and
tools/armatur/armatur.js before this update (the tool moved to armatur/
on 2026-11-07). The ignored _import/ remains
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
3. A bounded exact dynamic program over counts of each distinct length.
   It considers all feasible one-rod patterns, including patterns that do
   not fill the rod, and preserves the kerf and exact-end rules above.
   Eligibility depends on the quantity-state space, not a fixed piece-count
   cutoff, so orders with many repeated lengths can qualify.
4. A bounded branch-and-bound assignment search for orders up to 26 individual
   pieces when DP has not already proved optimality, with identical-state
   symmetry pruning.
5. A safe lower bound ceil(total requested length / stock length). If the
   plan matches that bound, optimality is proved immediately. Otherwise
   completing exact DP or branch-and-bound proves optimality. If neither
   proves optimality, the UI says *best found*, not *proven optimal*. A result
   note identifies the proof method or the DP size/time limit.

For requested quantities q_i, the count DP has at most product(q_i + 1)
states. With r the remaining quantity vector and P the complete set of
nonempty feasible one-rod patterns, its recurrence is:

    F(0) = 0
    F(r) = 1 + min { F(r - p) : p in P and p <= r }

The inequalities p <= r apply separately to every length. Every first rod
in a valid plan is one of these patterns; the recurrence then optimizes the
remaining order. This is global optimization, not repeated best filling of
one rod. Three lengths with 20 pieces each give only 21^3 = 9,261 count
states rather than 2^60 subsets of individually labelled pieces.

The default DP limits are 100,000 count states, 4,000 feasible patterns,
100,000 pattern-enumeration visits, 2,000,000 candidate transitions and a
600 ms time budget covering the DP phase. Hitting a limit does not establish
optimality: the feasible incumbent is retained and eligible small orders
can still use branch-and-bound. A truncated pattern list is never treated
as an exhaustive exact problem. These bounds keep work finite; elapsed
time and responsiveness still depend on the browser and device.

The **Load example** button illustrates repeated quantities: stock 2500 mm,
pieces 1200 mm × 12, 1100 mm × 10 and 200 mm × 7, with zero kerf. The fast
heuristics use 12 rods; the count DP finds and proves an 11-rod plan. One
such plan is seven rods of 1200 + 1100 + 200, three of 1200 + 1100 and one
of 1200 + 1200. Its total offcut is 700 mm.

The calculation runs in a Web Worker so larger inputs do not block the UI.
The worker has bounded search and an outer timeout. In environments without
Web Workers, the synchronous fallback uses a 40 ms DP budget, reduced state
and work limits, and the existing short branch-and-bound budget.

Approximate purchased-stock mass uses the original rebar formula,
0.888 kg/m for 12 mm diameter, scaling by diameter squared.
It is an estimate rather than a manufacturer's nominal mass table.

## Limitations

- Stock rods are assumed unlimited and all the same length.
- No inventory, multiple stock lengths, cost optimization, or saved offcut
  reuse yet.
- Exact optimization is exponential in the worst case. Count DP is effective
  only when the number of quantity states and feasible patterns is manageable;
  large or highly varied orders can remain heuristic unless a bound proves
  optimality. Completing DP minimizes rod count, not a secondary objective
  such as cut count or offcut usability.
- Kerf is assumed constant, with no clamping, end-trimming, bend, or
  fabrication allowances.
- The calculation does not replace a fabrication-specific cutting plan.

## Tests

From the Sol repository root:

    node armatur/tests/engine.test.js
    node armatur/tests/dp.test.js
    node armatur/tests/static.test.js
    node armatur/tests/i18n.test.js
    node scripts/check-static.js
    node scripts/test-static-check.js

The solver tests cover the original decimal-input infinite loop, a greedy
counterexample, kerf edge conditions, unit conversion, mass, conservation of
length and demand, large repeated patterns, comparison with the corrected
legacy method, and exact solutions checked against an independent small
set-partition dynamic program. Count-DP tests include repeated-length orders
above the former exact-search cutoff, nonzero-kerf exact-end patterns, an
independent small-instance oracle and forced budget exhaustion without
false optimality claims.

