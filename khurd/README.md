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
- **Mantras inside** sets how many mantras the inner scroll holds: 1, 10, 108,
  then 10³ to 10⁸, shown in Mongolian with the traditional names мянга, түм, бум, сая,
  живаа and дүнчүүр. Default 1.
- An optional bell rings on each full turn. Sound starts only after a user action.
- **Counters**, as in the khurd app: the total, which is never reset (only
  backward turning in subtract mode lowers it), and one line below it. Tapping
  the count shows the next line: **Today** (since local midnight), **Since
  *date*** (a trip counter, written "11/8-с хойш" in Mongolian), and **Turns**.
  The trip counter starts again from zero with ↺ beside it, or by pressing and
  holding the count, after a confirmation; Settings can switch it off.
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

`fonts/tibetan-khurd.woff` is a subset of Noto Serif Tibetan Bold 2.103,
Copyright 2022 The Noto Project Authors, reduced to the mantra's glyphs with
fontTools. It remains under the SIL Open Font License 1.1; see
[fonts/OFL.txt](fonts/OFL.txt). Keep that file with the font.
