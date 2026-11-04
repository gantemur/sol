# Sundial · Нарны цаг

A standalone, Mongolian-first horizontal sundial pattern generator for printing, tracing, engraving and etching. English is available from the language selector or `?lang=en`. No external libraries, fonts, services or accounts are required. The main product is the dial face; the gnomon side profile is optional.

## Controls and outputs

Choose a rectangle (initially 300 × 200 mm) or circle (300 mm diameter), signed latitude, hour subdivisions and 12-hour, 24-hour or Roman labels. The rectangular root is near the lower center; the circular root is at the center. The drawn border is exactly the requested face size. There is an additional 8 mm print margin and a scale/legend area outside the face. These margins are not part of the entered plate dimensions.

The preview is a white-backed SVG image, insulated from ordinary page dark-mode CSS. Enlarge/Fit changes only preview magnification. SVG, vector PDF and 300 dpi PNG are produced from one millimetre-based scene. PNG includes a physical-density pHYs chunk. Images above 20 megapixels are rejected; use vector formats for large fabrication patterns. PDF pages have custom physical sizes, not automatic A4/Letter scaling. Print at 100% and check the 100 mm (or 20 mm on a small face) calibration bar. Cutting/etching software should use the face border, not the outer page edge, as the plate boundary.

Seasonal lines are optional and off by default. They show June solstice (+23.44° declination), equinoxes (0°), and December solstice (−23.44°). Solid/dashed/dotted styles work in monochrome; color is optional. Printed legends use calendar-month numerals VI, III/IX, XII and declination; the interface supplies the full translated names. The clean artwork uses numbers, SI units and N/S compass symbols, so it needs no language-specific font embedding. Construction marks add O (the polar-style root) and P (the point vertically below the nodus), joined by a dashed mounting guide.

L is the distance along the elevated polar edge from its root to the nodus. Height is L sin|latitude|; poleward offset is L cos(latitude). It is independent of downloading a gnomon template. The optional SVG/PDF side profile uses that same L, with its upper tip G as nodus. A longer rod may instead carry a bead/notch at distance L. Material thickness, joints, supports and fold tabs are not modeled.

## Geometry

The plate is horizontal. Coordinates are east, north, up. Apparent solar hour angle H = 15° × (solar hour − 12); solar declination is positive northward. The unit vector toward the Sun is

```
s = (−cos(delta) sin(H),
      cos(phi) sin(delta) − sin(phi) cos(delta) cos(H),
      sin(phi) sin(delta) + cos(phi) cos(delta) cos(H)).
```

For sigma = sign(phi), nodus g = (0, sigma L cos(phi), L |sin(phi)|). The nodus shadow is g − (g_z/s_z)s; reject s_z ≤ 10⁻⁶ to exclude the horizon and its numerical singularity. The artwork has its top toward the elevated celestial pole. Thus north is up in the Northern Hemisphere and south is up in the Southern Hemisphere; the morning/afternoon sides reverse. A poleward arrow outside the face identifies installation orientation.

The ideal hour-ray direction in artwork coordinates is proportional to `(sigma |sin(phi)| sin(H), −cos(H))`. Ordinary hour angles do not depend on L or declination. Rays start at one root and are trimmed slightly inside the face border. Numerals have white knockouts; crowded labels may be omitted with a warning, but their lines and angle-table values remain.

Seasonal paths are sampled parametrically from 06:00 to 18:00, clipped segment-by-segment to the actual face, and split across the horizon or disconnected visible runs. Visible chords are adaptively refined to a 0.02 mm midpoint-sag criterion (maximum depth 12). The equinox path has constant poleward offset L/cos|phi|. With phi = 47.9°, L = 40 mm, noon offsets are approximately 40.3176, 59.6635 and 114.7020 mm for June, equinox and December respectively.

## Limits and practical use

This is local apparent solar time, not civil clock time. Longitude, time zones, daylight-saving changes, equation-of-time correction, refraction, terrain/building shading and finite shadow reach are not modeled. The 06:00–18:00 face does not imply all these hours are sunlit, and omits early/late summer hours. Special equatorial and polar constructions are excluded; supported latitude is 0.1°–89° in either hemisphere. Low latitudes can yield crowded labels. Seasonal curves can leave the plate; no-visible-curve warnings are provided.

Keep the plate level and the polar edge parallel to Earth's axis. Seasonal readings require the specified nodus position, not an arbitrary shadow edge. Geometric/printing checks are not an outdoor accuracy guarantee. Verify the printed scale and the mounting before irreversible fabrication.

## Standalone use and checks

Copy this directory with its LICENSE and open `index.html`, or serve it with any static server. The versioned asset URLs and the badge identify release R01.1. URL parameters retain the design; unavailable local storage/history must not prevent operation.

```
node --check tools/sundial/sundial.js
node --check tools/sundial/ui.js
node tools/sundial/test-sundial.cjs
node scripts/check-static.js
node scripts/test-static-check.js
```

The numerical tests check independent analytic limits/reference values, both hemispheres, all subdivision settings, horizon rejection, shape clipping and hour-line independence of nodus length. They are not an independent external audit or physical calibration.

## Provenance and license

Newly authored JavaScript and ordinary documentation are MIT-licensed; the complete license travels with the tool in LICENSE. The geometric implementation is independently written from vector projection, not copied or translated from notebook source. No third-party artwork or runtime dependencies are bundled. Users may use their generated geometric patterns for fabrication; no additional visible-credit requirement is imposed on those outputs.

Scientific background: the author's [Нарны цаг](https://t8m8r.wordpress.com/2020/05/05/sundial/) and [USNO's solar-time definitions](https://aa.usno.navy.mil/faq/eqtime). The original blog's differing declination convention is not used here. Surface tint handling follows [CSS color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme); an extension or system accessibility filter that forcibly transforms images can still override visual appearance.
