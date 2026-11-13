# Ger sun clock · Гэрийн наран цаг

Status: alpha (v0.1), published for live testing.

Sunlight entering a Mongolian ger through the toono (the open crown ring of the
roof) makes a bright patch that travels across the roof poles, wall and floor
during the day. Herders traditionally read the time from it. This tool computes
the patch for any place and time and compares several ways of dividing the day
into the twelve animal hours.

Entry point: `index.html`. Plain HTML, CSS and JavaScript with no build step and
no libraries; the folder works when copied on its own. Mongolian by default,
English with the selector or `?lang=en`.

## Use

- **Time:** starts at the current time and runs in real time. Pause, step by an
  hour or a day, choose a speed (also backwards), enter a date and time, or jump
  to the equinoxes and solstices.
- **Location:** presets (Ulaanbaatar, Khovd, Choibalsan, Hohhot, Ulan-Ude, Lhasa,
  Montreal), manual latitude/longitude, a time zone, or the device location
  (requested only when the button is pressed).
- **Ger:** 4-, 5- or 6-wall presets, door direction, roof flap (urkh) fully open
  or only the door-side half open, and editable dimensions.
- **Overlays:** the 12 fixed 30° sectors of the ger; the uni; the path of the patch
  centre on the current day with its positions at the :40 boundaries; fixed
  sundial lines (true solar double hours, or the :40 convention in mean time);
  unequal hours counted from sunrise; solstice and equinox day paths.

## Drawing

Plan view from above. The floor and the roof (treated as transparent) are drawn in
plan, with the toono as the small central circle and the uni as spokes; the wall
is folded outward around the floor (foot inside, head outside). Light on the
roof poles is hatched, light on the floor or wall is solid. Compass direction
is preserved everywhere; the map is continuous across the wall foot but not
across the eave.

## The four hour readouts

1. **:40 convention:** Mouse 23:40–01:40, …, Horse 11:40–13:40 on the selected
   zone's clock, as in Mongolian dictionaries.
2. **True solar double hours:** Horse centred on apparent noon.
3. **Ger direction:** the sector of the 12 fixed 30° sectors in which the Sun
   stands, i.e. opposite the light patch (Sun east, patch west: Rabbit). These
   hours are unequal and seasonal.
4. **From sunrise:** daylight and night each divided into six, Rabbit beginning
   at sunrise and Rooster at sunset (geometric horizon). A hypothesis, not an
   attested convention.

## Model and assumptions

- Ger: flat floor, vertical cylindrical wall of radius R and height `wallH`,
  straight conical roof from the wall head to the toono rim at height `toonoH`.
  The toono is an open horizontal disk without thickness; crossbars, columns,
  stovepipe and furniture shadows are ignored; light through the door is not
  shown. Preset dimensions are approximate.
- Light: parallel rays from the Sun through the aperture. The patch outline is
  found by tracing the aperture boundary; where neighbouring rays land on
  different surfaces the transition is located by bisection and each surface's
  piece is closed along the shared edge.
- Sun: NOAA/Meeus low-precision formulae (about 0.01° in declination, about a
  minute in time). Atmospheric refraction is ignored for the light patch.
- Sundial lines: for a fixed hour angle the patch centre lies in the plane
  through the toono centre that contains the Earth's axis direction, so on the
  floor the equal-hour lines are straight and pass through the point where that
  axis line meets the floor, `toonoH · cot(latitude)` south of the centre.
  The :40 option uses mean solar time (equation of time ignored).

## References

- Traditional ger time-telling: e.g. descriptions of "гэрийн наран цаг" in Mongolian
  sources (light on the toono for Tiger–Rabbit, uni heads to wall head for
  Dragon–Snake, khoimor at noon for Horse), Buryat and Tuvan ethnography.
- J. Meeus, *Astronomical Algorithms*; NOAA solar calculator equations.
- Standard gnomonics of polar-axis sundials and nodus dials.

## Renaming

The tool name appears in `TOOL` near the top of `app.js` (and its `title`
dictionary entries), in `index.html` (`<title>`, `<h1>` and the analytics
`title`), in `tools.json` and in the Sol homepage card. Changing the folder name
(URL) also needs the analytics path and, for old links, a forwarding page.

## Verification

```sh
node toono/test-toono.cjs
node scripts/check-static.js
node scripts/test-static-check.js
node scripts/test-analytics.cjs
node scripts/test-homepage.cjs
```

## License

MIT, see [LICENSE](LICENSE). Copyright 2026 Tsogtgerel Gantumur.
