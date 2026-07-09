# Rainbow Angles

Status: first native notebook-derived port for `sol`.

This is a standalone static JavaScript tool for exploring geometric rainbow/refraction angles. It uses no framework and keeps all code local to `tools/rainbow-angle/`.

## Source and provenance

The tool is based on old local notebook/source material:

- `_import/spectrum/rbk.ipynb`
- `_import/spectrum/rainbow.py`
- `_import/spectrum/rainbow.ipynb` for visible-spectrum color context

The original `_import/spectrum` folder has GPL provenance. For this public-alpha tool, the small mathematical formulas were reimplemented cleanly in new JavaScript, and the source notebooks/scripts remain local archive material.

## License

License is TBD, following the current repository status. Do not assume a repository-wide license until one is added explicitly.

## Model

The tool uses a simplified geometric-optics model for a spherical water droplet:

- incident angle from the surface normal;
- refracted angle from Snell's law;
- rainbow order `k`, where `1` is primary and `2` is secondary;
- signed viewing/deviation angle reduced to the range from -90 degrees to 90 degrees.

The drop ray sketch uses dense, uniform impact-height sampling on one upper half of the droplet, avoiding central overlap and near-tangent edge rays. Each sampled ray is traced as open SVG line/polyline segments: incoming ray, internal refracted/reflected path, and outgoing ray. Thin low-opacity strokes let the outgoing family show rainbow-angle concentration by alpha accumulation, without selecting or labeling a single ray.

## Language support

This tool has local English/Mongolian language support through a small `STRINGS` dictionary in `rainbow-angle.js`. It chooses language from `?lang=en` or `?lang=mn`, then a saved local preference, then browser language, and finally English.

Future standalone tools can reuse this lightweight local dictionary pattern before the project needs any global i18n framework.

## Limitations

- Refractive-index presets are approximate and based on the source material.
- There is no full wavelength-dependent dispersion model yet.
- The drawing is still a simplified geometric-optics sketch, not a full atmospheric optics simulation.
