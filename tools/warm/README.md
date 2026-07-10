# Stellar Warmth

Status: first MVP native static tool.

`warm` is a small bilingual web tool for exploring how stellar luminosity,
orbital distance, albedo, emissivity, heat redistribution, and a simple
greenhouse offset affect planetary irradiance and temperature.

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

Equilibrium temperature:

```text
T_eq = [I(r) * (1 - A) / (q * ε * σ)]^(1/4)
```

where `A` is Bond albedo, `ε` is infrared emissivity, `σ` is the
Stefan-Boltzmann constant, and `q` is the redistribution factor:

- `q = 4`: whole sphere average
- `q = 2`: dayside average
- `q = 1`: subsolar point

Surface estimate:

```text
T_surface = T_eq + ΔT_greenhouse
```

## Assumptions and limitations

- This is a simplified geometric/radiative balance model, not a climate model.
- The Goldilocks/liquid-water band is a user-visible temperature interval, not
  a full habitable-zone calculation.
- Refractive, spectral, atmospheric, cloud, circulation, and seasonal effects
  are not modeled.
- Stellar spectra and atmospheric/glass transmission are intentionally deferred.

## Planned extensions

- Stellar spectrum display.
- Atmosphere/glass transmission controls.
- Solar-panel irradiance connection.
- More realistic habitable-zone models.
