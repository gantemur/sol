# Sundial · Нарны цаг

A standalone, Mongolian-first horizontal sundial pattern generator for printing, tracing, engraving and etching. English is available from the language selector or `?lang=en`. No external libraries, fonts, services or accounts are required. The main product is the dial face; the gnomon side profile is optional.

## Controls and outputs

Choose a rectangle (initially 300 × 200 mm) or true semicircle (300 mm diameter, 150 mm height), signed latitude, hour subdivisions and 12-hour, 24-hour or Roman labels. For nonzero latitudes, the rectangular polar-style root is near the lower center; the semicircle's root lies at the center of its straight diameter. The previously supported `?shape=circle` bookmark automatically selects the new semicircle. The drawn border is exactly the requested face size. There is an additional 8 mm print margin and a scale/legend area outside the face. These margins are not part of the entered plate dimensions.

The preview is a white-backed SVG image, insulated from ordinary page dark-mode CSS. Enlarge/Fit changes only preview magnification. SVG, vector PDF and 300 dpi PNG are produced from one millimetre-based scene. PNG includes a physical-density pHYs chunk. Images above 20 megapixels are rejected; use vector formats for large fabrication patterns. PDF pages have custom physical sizes, not automatic A4/Letter scaling. Print at 100% and check the 100 mm (or 20 mm on a small face) calibration bar. Cutting/etching software should use the face border, not the outer page edge, as the plate boundary.

Seasonal lines are optional and off by default. The number of curves is selectable: three (solstices and equinox), five (default when enabled), or seven. Intermediate lines evenly subdivide solar declination between approximately ±23.44°, rather than representing specific calendar dates. Each intermediate declination normally occurs twice per year. June solstice (+23.44°), equinoxes (0°), and December solstice (−23.44°) remain present in every preset. Solid/dashed/dotted styles and declination legends work in monochrome; color is optional. Printed legends use calendar-month numerals VI, III/IX, XII and declination; the interface supplies the full translated names. The clean artwork uses numbers, SI units and N/S compass symbols, so it needs no language-specific font embedding. Construction marks add O (the polar-style root) and P (the point vertically below the nodus), joined by a dashed mounting guide.

For nonzero latitudes, L is the distance along the elevated polar edge from its root to the nodus. Height is L sin|latitude|; poleward offset is L cos(latitude). It is independent of downloading a gnomon template. The optional SVG/PDF side profile uses that same L, with its upper tip G as nodus. A longer rod may instead carry a bead/notch at distance L. Material thickness, joints, supports and fold tabs are not modeled.

## Geometry

The plate is horizontal. Coordinates are east, north, up. Apparent solar hour angle H = 15° × (solar hour − 12); solar declination is positive northward. The unit vector toward the Sun is

```
s = (−cos(delta) sin(H),
      cos(phi) sin(delta) − sin(phi) cos(delta) cos(H),
      sin(phi) sin(delta) + cos(phi) cos(delta) cos(H)).
```

For sigma = sign(phi), nodus g = (0, sigma L cos(phi), L |sin(phi)|). The nodus shadow is g − (g_z/s_z)s; reject s_z ≤ 10⁻⁶ to exclude the horizon and its numerical singularity. The artwork has its top toward the elevated celestial pole. Thus north is up in the Northern Hemisphere and south is up in the Southern Hemisphere; the morning/afternoon sides reverse. A poleward arrow outside the face identifies installation orientation.

The ideal hour-ray direction for nonzero latitude in artwork coordinates is proportional to `(sigma |sin(phi)| sin(H), −cos(H))`. Ordinary hour angles do not depend on L or declination. Rays start at one root and are trimmed slightly inside the face border. The semicircle is bounded by its upper circular arc and a straight baseline; no unused lower half is printed. Numerals have white knockouts; crowded labels may be omitted with a warning, but their lines and angle-table values remain. At the equator, the special raised-rod mode below replaces the singular radial fan.

Seasonal paths are sampled parametrically from 06:00 to 18:00, clipped segment-by-segment to the actual face, and split across the horizon or disconnected visible runs. Visible chords are adaptively refined to a 0.02 mm midpoint-sag criterion (maximum depth 12). The equinox path has constant poleward offset L/cos|phi|. With phi = 47.9°, L = 40 mm, noon offsets are approximately 40.3176, 59.6635 and 114.7020 mm for June, equinox and December respectively.

## Limits and practical use

This is local apparent solar time, not civil clock time. Longitude, time zones, daylight-saving changes, equation-of-time correction, refraction, terrain/building shading and finite shadow reach are not modeled. The 06:00–18:00 face does not imply all these hours are sunlit, and omits early/late summer hours. Equatorial latitude 0° is supported with a different physical construction: a horizontal polar rod parallel to true N-S at height h above the plate, or a nodus point at the same height. Here the UI field L denotes the **vertical height h**, not a length along a face-rooted polar gnomon. The equatorial hour lines are N-S parallel lines at signed offset `x = h tan(15° (hour−12))` from the central noon line, and 06:00/18:00 are at infinity (horizon). The nodus is placed over the printed center O, which is its ground projection, not the base of a polar style. The equatorial gnomon export shows a raised horizontal rod with a point marker; structural mounting details remain the user's responsibility. For a full year of equatorial seasonal curves choose **Rectangle**: the northern/poleward semicircle shows only one seasonal half. For near-equatorial nonzero latitudes, the traditional sloping style is exceptionally low and its hour lines crowd; the app warns users to consider a supported raised polar rod instead.

Near-polar latitudes through ±89° are supported mathematically; hour-line spacing approaches 15°, but 24-hour summer sunlight requires a full-day polar design. The app warns above |latitude|=85°. Exact ±90° are not supported, since there is no unique poleward meridian for a semicircular local dial. Low latitudes can yield crowded labels. Seasonal curves can leave the plate; no-visible-curve warnings are provided. The five- and seven-line options are geometric declination guides, not monthly date markers or an analemma.

Keep the plate level and the polar edge parallel to Earth's axis. Seasonal readings require the specified nodus position, not an arbitrary shadow edge. Geometric/printing checks are not an outdoor accuracy guarantee. Verify the printed scale and the mounting before irreversible fabrication.

## Standalone use and checks

Copy this directory with its LICENSE and open `index.html`, or serve it with any static server. The versioned asset URLs and the badge identify release R01.3. URL parameters retain the design; unavailable local storage/history must not prevent operation.

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

## Meridian-plane inclination: exact geometric reduction, not yet a UI mode

The same hour-plane construction applies to a plane whose outward normal lies in the local north-south vertical plane. If the plate is inclined through a **signed angle β toward south** from horizontal, rotate the local coordinate frame around the east-west axis; the projected solar geometry is that of a horizontal dial at effective signed latitude `phi_eff = phi − beta`. In particular, a **direct south-facing vertical wall at 45° N** has `phi_eff = −45°`, so its ideal hour-line angles agree with those of a horizontal dial at 45° S (with the corresponding reversal of the physical up/down and east/west directions). This is a rotation-equivalence for the plane's hour-line geometry and nodus projections; wall illumination must still be intersected with the true local solar horizon, and the mounted gnomon must project outward from the wall.

The existing interface does **not** yet let users enter a wall or plate inclination. One cannot simply install a printed horizontal face on a wall without verifying orientation, mounting, and daylight visibility. A future meridian-plane tilt control can reuse the effective-latitude geometry, followed by the full azimuth/tilt plane model for arbitrary wall directions. When phi_eff is zero, the polar style lies parallel to the plane and needs a raised parallel rod or nodus, exactly as in the equatorial horizontal special case.
