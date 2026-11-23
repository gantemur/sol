# Oval track · Зууван зам

**Status:** new n:k family framework, live-first alpha.
**Entry point:** https://gantemur.github.io/sol/oval-track/
**Original eight-disk workshop (preserved):** https://gantemur.github.io/sol/oval-track/classic/

A lightweight, bilingual, mathematically exact experiment with permutations
built from two simple moves. Rather than starting with the largest puzzle,
the new landing page begins at **3:2**, then guides the player through **4:2,
4:3, and 5:2**. All 17 cases with
\`3 ≤ n ≤ 8\` and \`2 ≤ k ≤ min(n,4)\` can also be selected in Explore
mode. The later cases currently support free exploration, not a complete
authored sequence of guided lessons.

The old 8:4 page and its existing browser-stored discoveries remain available
under \`classic/\`. The legacy scripts \`model.js\`, \`workshop.js\`, \`app.js\`
and \`style.css\` are intentionally unchanged; the new family uses separate
\`family-*.js/css\` files and the separate \`oval-track-family-v1\` localStorage
key. This prevents accidental loss or reinterpretation of saved 8:4 recipes.

## Exact model

Numbered positions 1,…,n lie around the oval in clockwise order.

- **R:** move every disk one position clockwise:
  \`R=(1 2 … n)\`.
- **T:** reverse the order of the first k consecutive *positions*,
  \`T=(1 k)(2 k−1)…\`; if k is odd, the center stays fixed.
- **L:** one native counterclockwise movement, \`L=R⁻¹\`. It is unlocked
  as a convenience after the player discovers an inverse of R in 3:2.
  Its formula depends on n: \`L=R^(n−1)\`.

Moves are read chronologically left to right. The board starts at exactly
\`[1,2,…,n]\` for each guided lesson. Reaching a correct arrangement does
*not* automatically mean discovery: the player must press **Check my
construction**, and then **Confirm**. Alternative correct move sequences
are accepted based on their permutation, not the spelling of the word.

The tool can optionally save a successful construction under a short name
in the *current* n:k variant. It shows the player's actual recipe and
a shorter equivalent elementary word (computed by breadth-first search in
the current move alphabet). The player decides whether to save the shorter
version. Stored macros replay their underlying R/T/L movements; they do
not instantaneously teleport the disks. The native L shortcut is the
exception, as explicitly motivated by the inverse construction.

Every variant has a separate Free play board, with legal scrambles, reset,
undo, and an optional route back obtained by inverting the actual move
sequence. Routes are not advertised as optimal. The UI counts button
presses and underlying mechanical movements separately. Changing n:k
does not import old macros into a different mathematical system.

## Initial guided journey

**3:2 (S₃, six configurations)** — Construct the inverse of T, then
the inverse of R (earning L). Next, move a swap to another pair
via a conjugating sequence such as \`RTL=(1 3)\`. The six-node Cayley graph
is linked to the board, showing two directed R-cycles and three T-edges.
Each node is a labelled arrangement and can be inspected without
teleporting the puzzle.

**4:2 (S₄, 24 configurations)** — Shift the adjacent T-swap to
\`(2 3)\`, then construct a non-neighbor swap \`(1 3)\`. Inspect the
connected 24-state Cayley graph and the connected graph of swappable
positions. This illustrates how adjacent swaps generate all permutations.

**4:3 (D₄, eight reachable of 24)** — T exchanges (1 3), and rotating
it creates (2 4). These are disconnected edges in the position-swap
graph. The *full* configuration graph of 24 labelled states forms **three
separate components of eight vertices each**. An explicit prediction
question asks whether (1 2) can be obtained; it cannot. An unreachable
node can be inspected without changing the actual board.

**5:2 (S₅, 120 reachable)** — A short generalization question
about why the ability to exchange adjacent positions gives arbitrary
permutations. Its full Cayley graph is not drawn, because 120 labelled
vertices would be visually too busy at phone width.

The cases can be chosen freely; completion unlocks the L shortcut for
all variants, but a newly selected n:k begins with an ordered home
board in construction mode. The work is a tool for discovery, not a
scored game or a rigid lesson gate.

## Mathematical views — linked to one board

- **Oval track:** displays the n disks and the fixed k turntable positions.
  This is the physical move view.
- **Regular polygon:** shows fixed regular n-gon *positions*, current disk
  labels, and the edges joining disks that were initially neighbors.
  A color change distinguishes original neighbor links still on the
  perimeter from chords that break that neighbor adjacency. For a
  single T, all n sides remain if \`k≥n−1\`; otherwise exactly n−2
  sides remain. A rigid rotation/reflection preserves all n sides.
  The fixed n-gon itself is never torn.
- **Cayley graph / configuration graph:** dots are arrangements; R
  edges are directed, T edges reversible. In 3:2 and 4:2 the complete
  group graph is visible. In 4:3 the diagram intentionally includes all
  24 configurations, partitioned into three islands (the Cayley graph
  of the generated group is the eight-vertex home component). A dot
  can be selected for information, but does not bypass legal moves.
  Small 5:4 uses the ten-node reachable Cayley graph; larger graphs
  display a size note instead of tens of thousands of dots.
- **Swap graph:** vertices are positions, not arrangements. An edge
  indicates that the group contains a permutation exchanging exactly
  those two positions. These are *not* Cayley graphs. An edge graph
  connected across all positions is sufficient to generate S_n.

For all 17 n:k cases, the known group orders were independently
checked against an exhaustive exact BFS on permutation arrays.
The code can reproduce these counts; no server or AI service is used.

Selected interesting examples:

| Case | Reachable / possible | Explanation |
| --- | ---: | --- |
| 3:2 | 6/6 | S₃ = D₃ |
| 4:2 | 24/24 | Adjacent swaps give S₄ |
| 4:3 | 8/24 | Square symmetries D₄; three eight-state islands |
| 5:3 | 120/120 | Step-two swaps connect all five positions |
| 5:4 | 10/120 | Pentagon rotations/reflections D₅ only |
| 6:3 | 72/720 | Odd/even position classes remain separated |
| 6:4 | 720/720 | S₆ |
| 7:4 | 2520/5040 | Only even permutations: A₇ |
| 8:4 | 40320/40320 | Full S₈ |

## Controls, accessibility, privacy

Mongolian is the default; EN and \`?lang=en\` are supported. Language
switching preserves the current board and progress. All motion is
client-side; reduced-motion preferences disable animation. Buttons
remain touch- and keyboard-accessible (→ R, F T, Z undo, and ← L after
discovery). The generated group graphs expose accessible labels and
clickable/focusable nodes. The n:k diagram is a visualization of an
idealized puzzle, not a physically calibrated rigid mechanism.

All tool computation runs locally. The only network-loaded script is
Sol's host-limited aggregate GoatCounter, with \`no_events: true\` and
canonical \`/sol/oval-track/\` visit path. No action/click telemetry,
accounts, permission requests or remote puzzle state are used.
Persistent progress is local, optional, and isolated from the old 8:4
workshop.

## Files and tests

- \`index.html\`, \`family.css\`: new n:k UI.
- \`family-model.js\`: pure move system, BFS, Cayley components, polygon
  edges and swap graph.
- \`family-text.js\`: MN/EN strings and first guided challenges.
- \`family-views.js\`: original SVG track, polygon and graph visualizations.
- \`family-app.js\`: user interaction, animated moves, progress and storage.
- \`test-family.cjs\`: exact all-17 family model regression.
- \`test-family-ui.cjs\`: reduced-motion mocked-DOM interaction test.
- \`classic/index.html\`: original 8:4 UI, loading its original files.
- \`classic/README.md\`: original v3 workshop documentation.
- \`LICENSE\`: inherited full MIT text.

From the Sol repository root:

\`\`\`sh
node oval-track/test-family.cjs
node oval-track/test-family-ui.cjs
node oval-track/test-engine.cjs
node oval-track/test-workshop.cjs
node oval-track/test-ui.cjs
node scripts/check-static.js
node scripts/test-static-check.js
node scripts/test-analytics.cjs
\`\`\`

Node-based headless tests do not establish phone usability, browser SVG
rendering, animation continuity or GitHub Pages deployment. Check the
actual live URL in both languages and on narrow/wide devices; record
any blockers distinctly from successful mathematical tests.

## Sources and provenance

Concepts draw on standard finite permutation group theory and the
educational Oval Track / TopSpin family. See John Mulholland's
[Oval Track puzzle](https://www.sfu.ca/~jtmulhol/permutationpuzzles/puzzles-ot.html)
and Kaufmann–Kavountzis,
[Proof of Solvability for the Generalized Oval Track Puzzle](https://scholar.rose-hulman.edu/rhumj/vol10/iss1/6/).
All scripts, SVG artwork and wording are independently written for Sol.
Copyright © 2026 Tsogtgerel Gantumur; MIT License.
