# Public alpha check

Second public-polish migration pass.

`_import/` was not modified. It remains ignored and untracked.

## What was fixed

- Added per-tool public-alpha notes:
  - `tools/planets-en/README.md`
  - `tools/planets-mn/README.md`
  - `tools/doppler/README.md`
  - `tools/kinetic/README.md`
  - `tools/armatur/README.md`
- Added `docs/CREDITS.md` and linked it from the homepage.
- Added a package-free static checker at `scripts/check-static.js`.
- Fixed harmless page metadata:
  - changed `width==device-width` viewport typos to `width=device-width`;
  - added obvious `lang` attributes;
  - fixed the Doppler index page title;
  - fixed the Mongolian planetary index page title;
  - added a mobile viewport to the Armatur page.

No simulation logic or Armatur cutting algorithm was rewritten.

## What was verified

- Git state was checked before editing.
- `_import/` is ignored by `.gitignore` and is not tracked.
- `tools.json` parses.
- Local `href` and `src` references resolve with relative paths.
- The homepage, `tools.json`, and each tool entry are compatible with GitHub Pages under `/sol/` because internal project links are relative.

## Unused-file investigation

- `tools/doppler/doppler.js` is not referenced by any migrated HTML page. It appears to be an unused duplicate or older sound script. It was left in place for provenance.
- The active Doppler entry links are `sound.html`, `sirens.html`, `fire.html`, and `light.html`, which reference `sound.js`, `sirens.js`, `fire.js`, and `light.js`.
- Some planetary support files are shared across multiple pages. They were not pruned.

## Remaining risks

- Scientific/model correctness has not been revalidated.
- Audio quality/timing has not been subjectively checked.
- The planetary English and Mongolian tools still duplicate code and hard-code strings.
- Some pages retain legacy global JavaScript and inline event handlers.
- Repository-wide licensing is still TBD.
- Imported per-tool license files exist for some migrated tools; no new license was invented.

## Next development pass

Recommended next pass:

1. Add a small CI workflow or documented local command for `node scripts/check-static.js`.
2. Fix remaining harmless metadata or copy issues only after reviewing each page visually.
3. Add credits/README detail per tool where original provenance is known.
4. Decide how to handle repository-wide licensing before broader promotion.
5. Design the solar trajectory / solar panel orientation tool as a new standalone `tools/solar-*` folder, with its own data/model notes and no dependency on the migrated legacy tools.

## Solar trajectory readiness

The site is ready to start the solar trajectory / solar panel planning tool as a new standalone public-alpha tool. The recommended approach is to keep it independent under `tools/<tool-id>/`, register it in `tools.json`, and add shared utilities only if a second native tool actually needs them.
