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
- `sundial`: Printable sundial designs for horizontal, vertical and inclined surfaces.
- `khurd`: A prayer wheel turned with a finger, counting the mantras inside.

Each tool is served at `https://gantemur.github.io/sol/<tool-id>/`, for example
`https://gantemur.github.io/sol/khurd/`.

## Planned directions

Future tools may include:

- solar trajectory and solar panel orientation planning;
- sundials;
- historical astronomy animations;
- physics and numerics toys.

## Project shape

Tool metadata lives in `tools.json`. Each tool lives in its own folder at the repository root, `<tool-id>/`, with its own `index.html`, assets, README and license.

Until 2026-11-07 tools lived under `tools/<tool-id>/`. That folder now holds only small forwarding pages, so old links and bookmarks such as `/sol/tools/khurd/` (including subpages, `?lang=` and `#` fragments) still reach the tool at its new address. New tools go directly at the root and need no forwarder. See [`tools/README.md`](tools/README.md).

`docs/`, `scripts/`, `shared/` and `tools/` are reserved root folders, not tool IDs.

The `_import/` folder is local migration input and is intentionally ignored. It should not be committed.

## Static checks

Run from the repository root with Node.js; no packages need to be installed:

```sh
node scripts/check-static.js
node scripts/test-static-check.js
```

The checker validates the tool registry (`entry` must be `<tool-id>/`), entry pages, local HTML links, and that every page left in `tools/` is a forwarder to an existing page.
The tests exercise valid and invalid registries in temporary fixtures without changing the site's files.
These checks do not validate scientific models or browser behavior.

## License

Copyright (c) 2026 Tsogtgerel Gantumur. Author-owned Sol code and ordinary
accompanying documentation are available under the [MIT License](LICENSE), subject
to the explicit [per-tool scope and exceptions](LICENSING.md). Each tool includes
a local license and visible author/source/licensing notice.

The planetary tools retain upstream legacy code with unresolved permissions; do not
treat their complete packages as MIT-cleared. See their local licensing notices.
Older copyright years and source credits are preserved. Compact interface credits use
Ts. Gantumur or Gantumur.
