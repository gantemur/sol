# sol

`sol` is a lightweight collection of scientific and computational web tools.

Current status: early migration / alpha. The existing pages are a clean public baseline for old static tools plus a small registry and homepage. Expect rough edges, preserved legacy code, and incomplete polish.

The tools are intended to be:

- static and easy to host on GitHub Pages;
- fast enough for phones;
- mostly standalone, so individual tools can be copied or extracted when practical;
- light on framework assumptions while the collection is still taking shape.

## Current tools

- `planets-en`: English planetary and Ptolemaic model animations.
- `planets-mn`: Mongolian planetary and Ptolemaic model animations.
- `doppler`: Canvas demonstrations of sound and light Doppler effects.
- `rainbow-angle`: Interactive geometric-optics curves for primary and secondary rainbow angles.
- `warm`: A simplified stellar irradiance, planet temperature, and liquid-water zone explorer.
- `kinetic`: Educational kinetic animation/toy model for particles, wind, and waves.
- `armatur`: Simple reinforcing-bar cutting calculator using the imported greedy algorithm.

## Planned directions

Future tools may include:

- solar trajectory and solar panel orientation planning;
- sundials;
- historical astronomy animations;
- physics and numerics toys.

## Project shape

Tool metadata lives in `tools.json`. Individual tools live under `tools/<tool-id>/`.

The `_import/` folder is local migration input and is intentionally ignored. It should not be committed.

## Static checks

Run from the repository root with Node.js; no packages need to be installed:

```sh
node scripts/check-static.js
node scripts/test-static-check.js
```

The checker validates the tool registry, entry pages, and local HTML links.
The tests exercise valid and invalid registries in temporary fixtures without changing the site's files.
These checks do not validate scientific models or browser behavior.

## License

License is TBD. Do not assume a repository-wide license until one is added explicitly.
