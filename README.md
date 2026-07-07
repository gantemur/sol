# sol

`sol` is a lightweight collection of scientific and computational web tools.

Current status: early migration / alpha. The existing pages are a clean public baseline for old static tools plus a small registry and homepage. Expect rough edges, preserved legacy code, and incomplete polish.

The tools are intended to be:

- static and easy to host on GitHub Pages;
- fast enough for phones;
- mostly standalone, so individual tools can be copied or extracted when practical;
- light on framework assumptions while the collection is still taking shape.

## Current tools

- Ptolemy / planetary model animations in English and Mongolian.
- Doppler effect canvas animations.
- Kinetic educational toy animation.
- Rod-cutting helper for reinforcing bar lengths.

## Planned directions

Future tools may include:

- solar trajectory and solar panel orientation planning;
- sundials;
- historical astronomy animations;
- physics and numerics toys.

## Project shape

Tool metadata lives in `tools.json`. Individual tools live under `tools/<tool-id>/`.

The `_import/` folder is local migration input and is intentionally ignored. It should not be committed.

## License

License is TBD. Do not assume a repository-wide license until one is added explicitly.
