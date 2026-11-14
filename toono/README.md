# Ger sun clock · Гэрийн наран цаг

Status: alpha (v0.3), published for live testing.

Sunlight entering a Mongolian ger through the toono (the open crown ring of the
roof) makes a bright patch that travels across the roof poles, wall and floor
during the day. Herders traditionally read the time from it. This tool computes
the patch for any place and time and compares several ways of dividing the day
into the twelve animal hours.

Entry point: `index.html`. Plain HTML, CSS and JavaScript with no build step and
no libraries; the folder works when copied on its own. Mongolian by default,
English with the selector or `?lang=en`.

## Use

- The large readout shows the current animal hour in the :40 convention, with
  clock time, date and place. Below the drawing, the time slider moves through
  the day and the day slider through the year (marks at the equinoxes and
  solstices); ▶ plays at the chosen speed (also backwards) and "Now" returns to
  the live clock. The page follows the real time until it is moved by hand.
- The table beside or below the drawing compares four readings of the twelve
  hours. Place, extra lines, ger dimensions and the explanation are folded
  sections.
- Language: MN | EN toggle (also `?lang=en`), remembered as in other Sol tools.

## Drawing

Two views, switched under the drawing:

- **From above** (default, `?view=plan`): the floor and the roof (treated as
  transparent) in plan, the toono as the small central circle and the uni as
  spokes; the wall is unfolded around the floor (foot inside, head outside).
  Shapes and sizes are true; light on the uni is hatched. The light breaks
  between the uni and the wall, because the eave is drawn twice.
- **From the toono** (`?view=toono`): the interior as seen from the centre of
  the toono looking down (azimuthal equidistant about the nadir). Floor in the
  middle, then wall, uni, and the toono rim as the outer circle. The light moves
  without breaks (rim, uni, wall head, wall, floor: the folk sequence) and its
  centre sits at 90° minus the solar altitude; the area near the rim is
  enlarged, so early light looks like a wide crescent.

Extra lines, under "Нэмэлт шугам": roof poles (uni) and part names (on by
default, can be hidden), the 12 fixed 30° sectors (on), and, off by default:

- **This day's :40 sectors:** from sunrise to sunset, a line from the centre in
  the direction of the light at each :40 time (sunrise and sunset in orange),
  dividing the ger into the day's twelve sectors, labelled in the wall ring.
  With the time fixed and the day slider moving, the sectors open and close
  with the seasons (the Sun's apparent speed), for comparison with the fixed
  sectors.
- **This day's path of the light centre**, run exactly to the eave and to the
  horizon (edges found by bisection).
- Solstice and equinox paths; unequal hours from sunrise.
- **Sundial lines on the floor only:** straight equal-hour lines (true solar or
  :40 mean time) from the polar-axis foot near the door (dot); bold where the
  light reaches during the year, faint elsewhere. Their continuation on the wall
  and uni is deliberately not drawn.

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
