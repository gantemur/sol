# Oval track · Зууван зам

Small bilingual permutation puzzle and group-theory introduction for Sol.
**Status:** live-first alpha, 8 disks. URL: https://gantemur.github.io/sol/oval-track/

This is an independently implemented, simplified eight-disk relative of the
classic twenty-disk Oval Track / TopSpin puzzle. The visuals and code are original;
there are no third-party scripts or images. It is an educational model, not a
mechanically exact recreation of a commercial toy.

## Play

- **R** (right arrow): rotate the track one slot clockwise.
- **R⁻¹** (left arrow): rotate the track one slot counterclockwise.
- **T** (Flip, F key): reverse the four *top* positions as a half-turn.
- **Undo** (Z key) reverses the most recent move. **Reset** returns to the exact
  labelled home position. **Scramble** chooses a legal 13-move starting state.
- Three optional experiments introduce inverses and identity, noncommutativity,
  and the special sequence \`(RT)^5\`. Hint and Explanation can be shown separately.
- **Show the mathematics** reveals the current position permutation, its cycle
  decomposition and order. Nothing requires completing an experiment.
- An abbreviated move history retains the recent 22 moves; older moves remain
  undoable. The scramble itself starts a new history.
- Mongolian is default; English is available by the visible toggle and
  \`?lang=en\`. A language switch leaves the puzzle untouched.

Accessibility: buttons work with keyboard and touch; disk numbers are conveyed
in the SVG's changing accessible label. Reduced-motion preference suppresses
move animation. Because space is limited, animations are illustrative and the
numbers remain upright rather than physically rotating with the board.

## Precise mathematical model

Fixed labelled positions 1–8 follow the track clockwise: 1–4 along the upper
part from left to right, then 5–8 along the lower part right to left.
The home board is \`[1,2,3,4,5,6,7,8]\`.

- \`R\` sends the disk at position i to i+1 modulo 8. In cycle notation,
  \`R=(1 2 3 4 5 6 7 8)\`.
- \`R⁻¹\` reverses this step.
- \`T\` reverses positions 1,2,3,4. In cycle notation,
  \`T=(1 4)(2 3)\`.

**Move words are chronological, read left to right.** Thus \`RT\` means do R,
then T; this convention differs from the common right-to-left notation for
function composition. The permutation readout maps each disk's *home position*
to its **current** position; fixed positions and disk labels are distinct.
For instance, after \`RT\` the board is \`[3,2,1,8,4,5,6,7]\`, and the
permutation is \`(1 3)(4 5 6 7 8)\`.

\`(RT)^5\` swaps only disks 1 and 3; \`(RT)^10\` is the identity. The generated
group is all \`S_8\`: all 40,320 states are reachable. Exhaustive breadth-first
search with \`R,R⁻¹,T\` shows a maximum shortest distance of 22 moves.
All configurations in the playable eight-disk model are reachable, so we do
not present parity as a forbidden-state invariant. A board in cyclic order but
rotated is distinguished from the **exact** home arrangement.

\`Scramble\` applies legal moves, suppressing immediately cancelling adjacent
moves where practical. It is *not* sampled uniformly from the 40,320 states.
There is no optimal solver, hint engine, score or timer.

## Files / standalone use

The folder is static, self-contained and safe to copy out of Sol:
- \`index.html\`: semantic UI and original SVG;
- \`style.css\`: responsive styling;
- \`model.js\`: pure, independently testable permutation engine;
- \`app.js\`: interaction, bilingual text, animation, challenge state;
- \`test-engine.cjs\`: exhaustive mathematical regression test;
- \`LICENSE\`: MIT.

Open \`index.html\` in a modern browser or serve the directory with any static
server. No bundler, package manager, backend or external JavaScript dependency.
Only when published at gantemur.github.io, the page loads the existing Sol
GoatCounter script with \`no_events: true\`, recording aggregate visits and not
individual moves (see \`../docs/ANALYTICS.md\` on the Sol site).

For the numerical test, from the Sol repository root:

\`\`\`sh
node oval-track/test-engine.cjs
node scripts/check-static.js
node scripts/test-static-check.js
node scripts/test-analytics.cjs
\`\`\`

Also inspect both MN/EN interfaces, reduced motion, rapid move sequences,
challenge examples, keyboard controls and narrow/wide layouts at the live URL.
The static tests do not substitute for browser/visual verification.

## References

- John T. Mulholland, [Math 302: Oval Track Puzzle](https://www.sfu.ca/~jtmulhol/permutationpuzzles/puzzles-ot.html) — original 20-slot
  group-theory exploration and generators.
- Kiltinen, *Oval Track and Other Permutation Puzzles, and Just Enough
  Group Theory to Solve Them* — pedagogical context.

The educational model and diagrams here are original and do not copy a
commercial game's graphics or code. Copyright (c) 2026 Tsogtgerel Gantumur,
MIT License (see \`LICENSE\`).
