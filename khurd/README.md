# Prayer wheel · Маанийн хүрд

Status: alpha, published for live testing.

A Tibetan prayer wheel you turn with a finger or a mouse. The drum carries the
six syllables ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ (Om mani padme hum). The frieze at the top of the
page is split into one band per drum, centred above it; each band shows that
drum's inner scroll being read, and the counter adds up the mantras that have
fully passed each drum's gold reading mark.

Entry point: `index.html`. Plain HTML, CSS and JavaScript with no build step, no
network requests and no external libraries. The folder works when copied on its own.

## Use

- **Side view** shows a row of drums, the way wheels stand along a temple wall.
  Brush them from right to left; one swipe turns every drum it crosses.
- **Top view** shows wheels from above: one, or a row when the stage is wide
  (each slot at least 0.9 × the stage height, never more than the side view
  shows), so a phone in landscape shows 2 or 3. Drag around a wheel clockwise.
- **Drums keep their identities.** Drums are numbered from the left and a view
  shows the first ones that fit. Hidden drums keep their angle and speed: a
  drum still coasting when it is hidden keeps turning and counting, and comes
  back where it is.
- **The view does not change under a finger.** While a finger is on the drums,
  the view and the number of drums stay as they are (the browser may still
  rotate the page; the drums are redrawn at the new size); the change follows
  when the finger lifts.
- **Automatic** picks the side view on wide screens held in landscape, such as a
  desktop monitor or a turned phone, and the top view on portrait screens, like a
  hand wheel seen from above. Rotating a phone switches the view. A chosen view is
  remembered.
- A quick flick lets the wheel coast; a finger held still on it stops it.
- Desktop: drag, use the scroll wheel or a two-finger trackpad swipe, or focus the
  wheel and press Space, Enter or the arrow keys.
- **Turning backwards** either does nothing (the default, with a small recoil) or
  subtracts from the count.
- **Mantras inside** (Mongolian «Ороолттой маань») sets how many mantras the inner scroll holds: 1, 10, 108,
  мянга, түм and бум (10⁵), the largest, because every counted mantra is really
  written (below). Default 1. A size above бум saved by an earlier version opens
  as бум.
- **Milestones**, as in the khurd app: a badge left of the total shows a symbol
  for the total's power of ten and as many lit beads as its leading digit
  (347,210 is the treasure vase with 3 beads). Ranks are by mani: below 1,000 the
  Three Jewels, then the eight auspicious signs from мянга (parasol) to их тэрбум
  (the wheel), which gains a gold ring per further power of ten from 10¹¹.
  Tapping the badge opens the ladder: the milestone in words ("3 буман маань",
  "300,000 mani"), the next two milestones and the distance to each, and every
  rung. Crossing into a new symbol makes the badge grow briefly, names the
  milestone under the total for about 4 seconds, gives a short vibration where
  the device has one and is announced to screen readers; a new bead only pulses
  the badge. Each milestone is celebrated once and nothing at load.
- An optional bell rings on each full turn. Sound starts only after a user action.
- **Counters**, as in the khurd app: the total, which is never reset (only
  backward turning in subtract mode lowers it), and one line below it. Tapping
  the count shows the next line: **Today** (since local midnight), **Since
  *date*** (a trip counter, written "11/8-с хойш" in Mongolian), and **Turns**.
  The trip counter starts again from zero with ↺ beside it, or by pressing and
  holding the count, after a confirmation; Settings can switch it off.
- **Dedications**, as in the khurd app: the hands button in the title row
  opens a sheet to dedicate today's count, the count since a date, or another
  amount from 1 to the total, to someone by name (empty means all beings,
  «Хамаг амьтан»), with an optional wish. Names up to 40 characters, wishes up
  to 80, one line each. Dedicating does not lower the total. Records stay in
  this browser, newest first, with "Dedicated so far" as their sum; each can be
  deleted after a confirmation. After dedicating, the card (the Tibetan mantra,
  the amount, the mantra's name, "Dedicated to", the name or "All beings", the
  wish and the date, in the colours of the band) can be shared as a
  1080 × 1350 image through the system's share sheet where the browser can
  share files (phones), or saved as a PNG elsewhere. The text is in the image,
  since some services drop pre-written text.
- **Tips** at the bottom of Settings explain the gestures.
- **Full screen**: a button in the title row where the browser allows it
  (desktop, Android, iPad). iPhone Safari offers no full-screen mode for pages;
  there, "Add to Home Screen" opens the wheel full screen through
  `manifest.webmanifest`. Phones held sideways get a compact layout that gives
  the drums the remaining height.

Languages: Mongolian (default) and English, through `?lang=mn` or `?lang=en`, then
the saved choice, then Mongolian. Switching keeps the count and settings.

## Model

`engine.js` holds the rules as pure functions, separate from drawing.

- On the side view, each syllable is painted onto the cylinder in vertical slices:
  the sprite width is arc length, a slice at arc offset u sits at angle a + u/R
  and projects to x = R sin(a + u/R), so letters narrow unevenly toward the rim
  and follow the band's curve.
- Positive rotation means clockwise seen from above, the traditional direction.
  Seen from the side, the front of the drum then moves right to left, so the
  syllables pass the viewer in reading order.
- Coasting uses constant bearing friction plus speed-proportional drag, with a
  speed limit of 8 turns per second.
- The band is laid out like the drum, in six equal cells, and its position is the
  drum's displayed angle times N / 2π. With N = 1 the syllable on a drum's gold
  mark is exactly the syllable at the drum's front: facing the viewer in the side
  view, and at the bottom, under the gold pointer, in the top view. The top view
  draws the letters as the side wall would project seen from above with the front
  at the bottom: upright and read left to right at the front, so counter-clockwise
  around the wheel, and turning clockwise brings them to the front in order. Changing N or
  changing N turns the drums back to Om, so faces, bands and count stay in step.
- **The hidden scroll.** Each drum has its own 16-byte buffer that is given the
  UTF-8 text of each syllable in turn (ཨོཾ, མ, ཎི, པ, དྨེ, ཧཱུྃ, again) as the drum
  passes 1/(6N) of a turn: every syllable, in order, however fast it turns, and
  in reverse order when turning back in subtract mode. The count shown is what
  the scrolls have written (`writtenTotals`), equal by construction and by test
  to trunc(acc·N/2π). At the speed limit a бум drum writes 4.8 million syllables
  a second; the scroll code writes about 300 million a second on one core of a
  2.1 GHz Xeon (measured 2026-11-08), so this costs about 1.6 % of a core per
  drum. Larger sizes would not be affordable, hence the limit.
- Syllable sprites are cropped to their rendered ink rather than to font
  metrics, which differ between browsers for Tibetan, so every letter is centred
  by what is actually drawn.
- Each drum reads its own scroll. Partial turns on different drums are not
  added together: three drums turned a third of a turn each complete no mantra,
  and their bands show only the first syllables passing each mark.
- With N mantras on the scroll, one turn moves the band exactly N mantra widths,
  so its speed is N times the drum circumference per turn divided by the mantra
  width. The count is `trunc(θ·N / 2π)` for the angle θ turned, which is the
  number of mantras that have crossed the mark. Counts truncate toward zero, so a
  small backward nudge in subtract mode is not counted as −1.
- Totals are BigInt. Whole turns are banked every 1 000 turns, and when N changes,
  so double-precision angles stay small. A count can differ by one only if a wheel
  stops within about 10⁻⁵ of a mantra boundary.
- At high speed the band and the drum letters are drawn with motion blur. When the
  band moves a whole mantra or more per frame it is drawn as an even smear, so the
  display never shows the stroboscopic "frozen" or backward-running text that
  sampling at the frame rate would otherwise produce.

Counts and settings are kept in this browser's local storage only.

## Verification

```sh
node khurd/test-khurd.cjs
node scripts/check-static.js
node scripts/test-static-check.js
node scripts/test-homepage.cjs
```

The engine tests cover the ratchet, subtract mode, truncation, exact counts per
turn for every scroll size, coasting to rest, the speed limit, holding, and that
banking preserves totals.

## Known limitations

- Speech or chanting audio is not included; the bell is synthesized.
- Vibration feedback is not used.
- Large counts use the browser's number grouping for the chosen language.

## License and provenance

Copyright (c) 2026 Tsogtgerel Gantumur. Code and documentation: [MIT](LICENSE).

`icon-*.png` are rendered from this tool's own top view.

The milestone symbols in `ranks/` are **not** under the MIT licence. They are
drawings from Wikimedia Commons under Creative Commons Attribution-ShareAlike,
the same files the khurd app uses: anyone may reuse them, changed or not,
under the same terms, with credit. The only change from the Commons files:
rules in each file's `<style>` block were copied onto the elements that use
them and the block removed, so renderers without CSS draw the same picture.
The tool draws them on a light disc with beads and rings; the files are not
recoloured. Downloaded 2026-11-08; authors and licences as given on each
file's Commons page that day.

| File | Symbol | Commons file | Author | Licence |
| --- | --- | --- | --- | --- |
| `rank-jewels.svg` | Three Jewels | [Three Jewels symbol colour.svg](https://commons.wikimedia.org/wiki/File:Three_Jewels_symbol_colour.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-parasol.svg` | Parasol | [8signs-DUK.svg](https://commons.wikimedia.org/wiki/File:8signs-DUK.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-fish.svg` | Golden fish | [8signs-SERNYA.svg](https://commons.wikimedia.org/wiki/File:8signs-SERNYA.svg) | Nick Terazzi | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `rank-vase.svg` | Treasure vase | [8-Signs BUMPA.svg](https://commons.wikimedia.org/wiki/File:8-Signs_BUMPA.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-lotus.svg` | Lotus | [8-Signs PADMA.svg](https://commons.wikimedia.org/wiki/File:8-Signs_PADMA.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-conch.svg` | Conch | [Ashtamangala right whorl conch.svg](https://commons.wikimedia.org/wiki/File:Ashtamangala_right_whorl_conch.svg) | Christopher J. Fynn | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `rank-knot.svg` | Endless knot | [8signs-PELBEU.svg](https://commons.wikimedia.org/wiki/File:8signs-PELBEU.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-banner.svg` | Victory banner | [8signs-GYALTSEN.svg](https://commons.wikimedia.org/wiki/File:8signs-GYALTSEN.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rank-wheel.svg` | Wheel | [8-Signs KHORLO.svg](https://commons.wikimedia.org/wiki/File:8-Signs_KHORLO.svg) | Christopher J. Fynn | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

The ladder sheet names the artists and the licence and links here.

`fonts/tibetan-khurd.woff` is a subset of Noto Serif Tibetan Bold 2.103,
Copyright 2022 The Noto Project Authors, reduced to the mantra's glyphs with
fontTools. It remains under the SIL Open Font License 1.1; see
[fonts/OFL.txt](fonts/OFL.txt). Keep that file with the font.
