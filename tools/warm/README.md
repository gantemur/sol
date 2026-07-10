# Stellar Warmth

Status: first MVP native static tool.

`warm` is a small bilingual web tool for exploring how stellar luminosity,
orbital distance, albedo, heat redistribution, simplified infrared escape, and
a simple greenhouse offset affect planetary irradiance and temperature.

## Source and provenance

This tool was inspired by the old notebook
`_import/spectrum/temperature.ipynb`, inspected as read-only migration source.
The formulas were reimplemented in new JavaScript for this standalone tool.

License: TBD. The repository does not yet have a chosen public license.

## Model

Stellar irradiance at orbital distance `r` in AU:

```text
I(r) = S0 * L / r^2
```

where `S0 = 1361 W/m²` and `L` is stellar luminosity in solar units.

Airless/effective radiative equilibrium temperature:

```text
T_eq = [I(r) * (1 - A) / (q * σ)]^(1/4)
```

where `A` is Bond albedo, `σ` is the Stefan-Boltzmann constant, and `q` is the
redistribution factor:

- `q = 4`: whole sphere average
- `q = 2`: dayside average
- `q = 1`: subsolar point

## Greenhouse modes

The tool has three intentionally simplified surface-temperature modes:

1. Airless / radiative equilibrium:

```text
T_surface = T_eq
```

2. Gray greenhouse / IR escape:

```text
T_surface = [I(r) * (1 - A) / (q * ε_IR * σ)]^(1/4)
```

Here `ε_IR` is an effective infrared escape fraction/emissivity. `ε_IR = 1`
means no greenhouse trapping in this model; smaller values mean less thermal
radiation escapes to space and therefore a warmer surface estimate.

3. Temperature offset:

```text
T_surface = T_eq + ΔT_greenhouse
```

This is a simple offset/fitting mode. It is useful for Earth-like examples, but
it is not a physical atmosphere model.

The temperature plot auto-scales its vertical axis from the currently visible
distance range, the displayed temperature curves, and the simplified
Goldilocks/liquid-water temperature band.

## Assumptions and limitations

- This is a simplified geometric/radiative balance model, not a climate model.
- `ε_IR` is a one-parameter effective escape model, not a detailed atmosphere.
- `ΔT` is a simple offset/fitting mode, not a physical greenhouse law.
- The Goldilocks/liquid-water band is a user-visible temperature interval, not
  a full habitable-zone calculation.
- Clouds, pressure, atmospheric chemistry, seasons, spectral absorption, and
  heat transport are not modeled.
- Stellar spectra and atmospheric/glass transmission are intentionally deferred.

## Notebook note

The old `_import/spectrum/temperature.ipynb` used a function equivalent to
`T = [(1-a) f S / (r^2 e σ)]^(1/4)`, with `f = 0.25` for whole-sphere
redistribution. It compared planet distances, albedos, and observed
temperatures. For Venus-like behavior it tried high albedo with very small
escape/emissivity values, including examples such as `tem(x, .75, .01)` and a
calculation around Venus using `A = 0.7`, `r = 0.723`, and `T ≈ 736 K`. That
suggests the notebook represented greenhouse behavior through an effective
emissivity/escape factor rather than albedo alone.

## Planned extensions

- Stellar spectrum display.
- Atmosphere/glass transmission controls.
- Solar-panel irradiance connection.
- More realistic habitable-zone models.
