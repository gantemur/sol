# The light patch, sectors and sundial lines

## Model

The tool treats the ger as three surfaces:

- a flat floor of radius R,
- a vertical cylindrical wall of height h_w (the khana),
- a straight cone (the uni) from the wall head up to the toono rim, which
  is a horizontal open disk of radius r_t at height H.

Crossbars, columns, the stovepipe, the thickness of the toono and light
through the door are ignored. Sunlight is a bundle of parallel rays. The
Sun's direction comes from the NOAA/Meeus low-precision formulae (about
0.01° in declination and about a minute in time). Refraction is ignored
for the patch.

The default 5-khana dimensions are R = 2.7 m, h_w = 1.5 m, H = 2.45 m and
r_t = 0.65 m. They are rough estimates, not measurements (see
[ger-geometry.md](ger-geometry.md)).

## Shape of the patch

- **On the floor the patch is an exact copy of the toono disk.** A
  horizontal disk projected along parallel rays onto a horizontal plane is
  a congruent disk. Its centre is H·cot(altitude) from the ger centre, on
  the side opposite the Sun. Only the wall can cut it.
- **On the wall and the uni it is distorted.** The tool finds the outline
  by tracing rays through points of the toono rim. Where neighbouring rays
  land on different surfaces, the crossing is found by bisection and each
  surface's piece is closed along the shared edge.
- **Which surface is lit** depends on the Sun's altitude. For the default
  5-khana ger the patch centre is on the floor above about 42°
  (tan = H/R), on the wall between about 19° and 42°
  (tan = (H − h_w)/R), and on the uni below about 19°. In winter in
  Ulaanbaatar the noon Sun is about 19° high, so the light never reaches the
  floor around the solstice.
- **The toono is a disk, not a point.** The patch has the width of the
  opening, so at a given moment it can lie on two surfaces at once, for
  example on the uni and the wall. At sunrise and sunset the light enters at
  a grazing angle and lands on the uni just below the rim on the side away
  from the Sun. This matches the saying that the light is first on the
  toono.
- **Direction.** Seen from above, the patch lies opposite the Sun's
  azimuth. Its movement around the ger therefore follows the Sun's
  azimuth, which is fast around noon in summer and slow in the morning and
  evening.

## The two views

- **From above** («Дээрээс», `layout('plan')`). Floor and uni are drawn in
  their true plan, the uni lying over the floor (hatched when lit). The wall
  is unfolded outwards as a ring, with radius R + z for height z. Shapes are
  true on the floor, but the drawing jumps at the eave: a point at the wall
  head appears both at radius R (eave, seen from above) and at R + h_w (top
  of the unfolded wall). Where a line crosses the eave, a dotted line joins
  the two images.
- **From the toono** («Тоононоос», `layout('toono')`). An azimuthal
  equidistant projection about the downward direction from the toono
  centre. The radius is the angle from straight down. Floor, wall and uni
  follow each other without a break and the patch moves continuously. The
  patch centre sits at radius 90° − altitude, so its distance from the
  middle reads the Sun's altitude directly. The parts near the toono rim
  are strongly enlarged.

## Twelve fixed sectors and the moving sectors

- **Fixed sectors** («Гэрийн 12 тогтмол зүг»). Twelve 30° sectors about the
  ger centre, Horse at the khoimor (north) and Mouse at the door (south).
  They turn with the door direction setting.
- **This day's :40 sectors** («Энэ өдрийн :40 хуваарь»). From sunrise to
  sunset, a ray from the centre in the direction of the light at each :40
  clock time. Sunrise and sunset rays are orange. Moving the day slider with
  the time fixed shows the sectors open and close with the season, because
  the azimuth rate of the Sun changes.
- **Sunrise-based sectors** («Нар мандахаас эхэлсэн хуваарь»). The same
  construction with daylight split into six equal parts, Rabbit beginning at
  sunrise.

## Sundial lines

For a fixed hour angle the Sun moves through the year in a plane that
contains the Earth's axis. The light from the toono centre then lands in
the parallel plane through the toono centre. These hour planes give the
sundial lines («Нарны цагийн шугам»).

- **On the floor** the lines are straight. All of them pass through the
  foot F of the line through the toono centre parallel to the Earth's
  axis. F lies H·cot(latitude) towards the equator from the centre, that is
  near the door when the door faces south. For the default ger in
  Ulaanbaatar it is 2.21 m from the centre, inside the floor (R = 2.7 m).
- **On the wall and the uni** the lines are curves: a plane meets the
  cylinder in an ellipse and the cone in a conic section.
- **At low latitudes F lies outside the floor.** In Lhasa (29.65°N) it would
  be 4.3 m from the centre, so the axis line meets the south wall about
  0.9 m above the floor, below the door, and the lines meet there.
- The tool draws true solar double-hour boundaries (Horse centred on
  noon), every 30° of hour angle, and leaves out boundaries the Sun never
  reaches at that latitude. In Ulaanbaatar that leaves 5:00–19:00, in Lhasa
  7:00–17:00. In the plan view the lines run from F up the wall to the wall
  head. In the toono view they continue over the uni to the rim.
- Only the part between the lines' solstice limits is ever lit, but the
  whole line is drawn so the fan from F is visible.

## Implementation notes

- `engine.js` is independent of the page. `trace` finds the first surface
  hit by a ray, `patch` builds the outline, `sweep` samples a curve and
  finds every visibility change and eave jump by bisection, and
  `sundialLine` sweeps declination from +89.75° to −89.75° for one hour
  angle.
- `test-toono.cjs` checks solar values, ray tracing, both layouts, the
  noon patch due north, the sundial lines through F, the eave links,
  sunrise and sunset, the four hour readings and the time zones.

## Sources

- J. Meeus, *Astronomical Algorithms*, and the NOAA solar calculator
  equations.
- Standard gnomonics of polar-axis sundials and nodus sundials.
