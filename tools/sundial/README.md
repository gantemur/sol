# Sundial · Нарны цаг — P1 General planar receiver

Standalone Mongolian-first sundial pattern designer for printing, tracing, engraving or etching. English is available from the selector or `?lang=en`. No runtime dependencies, accounts, external fonts or backend. The dial face remains the primary output; polar style/rod construction sheets are optional.

## Controls

Choose a **Horizontal** face, **Vertical wall**, or **Inclined plate**. Enter signed geographic latitude and the receiving plane's **outward normal azimuth** (`0°` north, `90°` east, `180°` south, `270°` west). The tilt β is measured from horizontal (`0°` horizontal, `90°` vertical); the vertical preset fixes β=90°, and the horizontal preset fixes β=0°. The tool supports upward or vertical-facing plates with tilt 0–90°; it does not model underside-facing overhangs yet.

Choose a rectangular or true semicircular boundary and physical dimensions in millimetres; set hour subdivision and 12-/24-hour/Roman labels. Optional seasonal lines provide 3, 5, or 7 **evenly spaced solar declinations**, not month dates. Set nodus distance **L along a rooted polar style** or **h perpendicular to the surface for a supported polar rod**. In automatic style mode the physical choice is determined by whether the polar axis intersects the receiving plane or lies parallel to it; manual raised-rod mode is also available. Enabling construction marks adds O and P where geometrically applicable. Seasonal lines always depend on the chosen nodus, never on an unspecified style edge.

The image preview has an independent Enlarge/Fit zoom; this does not alter the printed scale. The optional interactive 3D diagram shows an hour plane, declination cone, nodus, polar axis, face and visible shadow ray, with time/declination/view-rotation controls. The schematic is **not a fabrication drawing**. The expandable mounting panel reports the polar angle to the face, plate azimuth/tilt and virtual latitude/longitude displacement.

## Coordinate model and equations

All geometry is three-dimensional in **east–north–up (ENU)** coordinates. Let actual latitude be φ, receiving-face tilt β, outward azimuth A, solar declination δ, and apparent solar hour angle H=15°×(solar hour−12), increasing after noon.

The outward plane normal and north-pole direction are

    n = (sin β sin A, sin β cos A, cos β),
    p = (0, cos φ, sin φ).

The Sun direction is

    s = (-cos δ sin H,
          cos φ sin δ − sin φ cos δ cos H,
          sin φ sin δ + cos φ cos δ cos H).

The nodus N is either a point **L along the outward-directed polar style** through the physical root O (if n·p is nonzero), or a point at **h n above O** on a polar rod *parallel to* the receiving plane (or optionally intentionally supported). The shadow ray is N−ts, with t=(n·(N−O))/(n·s). A shadow is included only if the Sun is above the actual horizon (s_up>0), illuminates the outward receiving face (n·s>0), t>0, and the shadow falls inside the selected physical boundary.

At fixed H, the hour plane is spanned by p and s(H,0) through the polar rod; its intersection with the receiving face is a straight hour line. For a rooted style it passes through O. For a raised polar rod, the hour planes intersect the face in lines through a generally *shifted* intersection point; **only if the polar rod is exactly parallel to the face** are those hour lines parallel. The tool uses the exact 3D plane intersection in both cases. At fixed δ, nodus shadows lie on the appropriate declination cone, and its intersection with the receiving face is a seasonal curve. The position and visible arc are computed by direct parametric projection. A numerical visibility scan selects the physically reachable half-line from the hour plane for each solar hour, and marks can be omitted if no day in the idealized annual declination range illuminates that face at the selected hour.

The **virtual horizontal dial** provides a separate check: φ*=arcsin(n·p), and Δλ=atan2(n_east, n·q0), where q0=(0,−sin φ,cos φ). For example, a direct south-facing vertical wall at 45°N has φ*=45°S with Δλ=0, while an east-facing wall has φ*=0 and Δλ=90°. Virtual longitude is a solar-hour-angle displacement, not a change to the legal time zone.

**Physical orientation warning:** the drawing's upper arrow is aligned with the outward polar axis projected onto the receiving plane. On a south-facing wall this can point **physically downward**, not upward. The exported technical note gives the angle from the printed arrow to true up (projected gravitational vertical) and the receiving normal azimuth/tilt. Align the actual receiving face and gnomon, not merely a north compass arrow. Magnetic north may differ from true north.

At the equator on a horizontal face, or on east/west-facing vertical walls, the polar axis is parallel to the face. A raised polar rod or nodus is required and the hour lines are parallel. Near-polar latitudes are supported through ±89°, but summer sunlight beyond 06:00–18:00 is omitted in this phase. Exact geographic poles (±90°), overhanging/underside receivers, and a true all-day polar dial are outside the scope. Dark or never illuminated portions of a face are not falsely presented as usable marks. Seasonal declinations are approximations ±23.44°, not precise astronomical calendar dates or equation-of-time-corrected clock curves.

## Export and validation

SVG, vector PDF, and nominal **300-dpi PNG with physical-density metadata** all render one physical-millimetre scene. The exported PDF page includes margins, physical scale bar, face dimensions, installation direction notes and a legend outside the fabrication boundary. Print at 100% and measure the calibration bar—do not fit to A4/Letter if it changes scale. For oversized metal/wood designs, use vector SVG/PDF in fabrication software and verify the measured dimensions. PNG has a 20-megapixel safety limit. The optional gnomon side profile supplies a rooted triangular section or supported polar-rod elevation; actual joints/support design remains the maker's responsibility.

Checks: `node --check tools/sundial/{planar3d,sundial,diagram3d,ui}.js`, `node tools/sundial/test-sundial.cjs`, `node scripts/check-static.js`, `node scripts/test-static-check.js`. The geometry tests independently check unit vectors, plane incidence, ray shadows, solstice/equinox reference values, virtual horizontal reduction, north/south hemispheres, arbitrary tilt/azimuth and physically illuminated hour ranges. Browser visual and PDF/PNG inspections should supplement them. Field alignment, printer/engraver tolerances, and actual outdoor precision have not been physically verified. The tool does not promise minute-level accuracy.

## Provenance and license

New geometry implementation using elementary vector/celestial mechanics. No older notebook code or third-party art was copied. Background: the author's [Нарны цаг](https://t8m8r.wordpress.com/2020/05/05/sundial/) article, [USNO solar time terminology](https://aa.usno.navy.mil/faq/eqtime), and standard gnomonics. Software and ordinary tool documentation use the tool-local **MIT** license (see `LICENSE`). Users may fabricate their own patterns without an additional mandatory visible-credit notice imposed by the tool.
