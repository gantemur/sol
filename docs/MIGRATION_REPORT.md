# sol migration report

First-pass migration from `_import/` into lightweight static tool folders.

`_import/` was inspected only. It was not modified.

## A. Directory inventory

### `_import/`

```text
_import/
  .DS_Store
  armatur/
    README.md
    armatur.js
    index.html
  doppler/
    LICENSE
    doppler.css
    doppler.js
    fire.html
    fire.js
    index.html
    light.html
    light.js
    sirens.html
    sirens.js
    sound.html
    sound.js
  kinetic/
    LICENSE
    README.md
    index.html
    kinetic.css
    kinetic.js
  planetmn/
    almagest.js
    earth.html
    index.html
    jupiter_alm.html
    mars.html
    mars_alm.html
    merc.js
    mercury_alm.html
    moon.js
    moon_alm.html
    palmagest.js
    planets.css
    planets.js
    saturn_alm.html
    sun.js
    sun_alf.html
    sun_alm.html
    sup.js
    venus_alm.html
  planets/
    almagest.js
    earth.html
    index.html
    jupiter_alm.html
    mars.html
    mars_alm.html
    merc.js
    mercury_alm.html
    moon.js
    moon_alm.html
    palmagest.js
    planets.css
    planets.js
    saturn_alm.html
    sun.js
    sun_alf.html
    sun_alm.html
    sup.js
    venus_alm.html
```

Imported folders also contain nested `.git/` histories. Those were not copied into `tools/`.

File types found:

- HTML entry/pages: all five imports use plain `.html`.
- JavaScript: all behavior is in local `.js` files.
- CSS: planetary, Doppler, and kinetic tools have local CSS files; Armatur has inline/default styling plus `armatur.js`.
- Images/audio/fonts/data files: none found.
- External URLs: only in planetary index pages and Doppler GPL license text.

### Migrated `tools/`

```text
tools/
  armatur/
    README.md
    armatur.js
    index.html
  doppler/
    LICENSE
    doppler.css
    doppler.js
    fire.html
    fire.js
    index.html
    light.html
    light.js
    sirens.html
    sirens.js
    sound.html
    sound.js
  kinetic/
    LICENSE
    README.md
    index.html
    kinetic.css
    kinetic.js
  planets-en/
    almagest.js
    earth.html
    index.html
    jupiter_alm.html
    mars.html
    mars_alm.html
    merc.js
    mercury_alm.html
    moon.js
    moon_alm.html
    palmagest.js
    planets.css
    planets.js
    saturn_alm.html
    sun.js
    sun_alf.html
    sun_alm.html
    sup.js
    venus_alm.html
  planets-mn/
    almagest.js
    earth.html
    index.html
    jupiter_alm.html
    mars.html
    mars_alm.html
    merc.js
    mercury_alm.html
    moon.js
    moon_alm.html
    palmagest.js
    planets.css
    planets.js
    saturn_alm.html
    sun.js
    sun_alf.html
    sun_alm.html
    sup.js
    venus_alm.html
```

Repository-level files added:

- `.gitignore`
- `index.html`
- `tools.json`
- `shared/`
- `docs/MIGRATION_REPORT.md`

## B. Per-tool findings

### `planets-en`

- Original entry file: `_import/planets/index.html`
- Migrated entry path: `tools/planets-en/index.html`
- Scripts/styles/assets used:
  - Common pages use `palmagest.js`, `planets.js`, and `planets.css`.
  - Planet-specific scripts are `sun.js`, `moon.js`, `merc.js`, and `sup.js`.
  - `earth.html` and `mars.html` are standalone HTML/canvas pages with inline logic.
  - No image/audio/font/data assets.
- External URLs:
  - `https://webspace.science.uu.nl/~gent0113/astro/almagestephemeris.htm`
  - `https://people.sc.fsu.edu/~dduke/models`
- Missing or suspicious files:
  - No missing local references found.
  - Several pages use `width==device-width` in the viewport meta tag. This was preserved.
- Local status:
  - Entry page and `mars_alm.html` loaded locally with no browser console errors.
- Main technical risks:
  - Global variables and inline handlers make later merging/refactoring delicate.
  - The pages assume browser canvas support.
  - Scientific/model correctness was not validated in this pass.

### `planets-mn`

- Original entry file: `_import/planetmn/index.html`
- Migrated entry path: `tools/planets-mn/index.html`
- Scripts/styles/assets used:
  - Same structural set as `planets-en`: `palmagest.js`, `planets.js`, `planets.css`, `sun.js`, `moon.js`, `merc.js`, and `sup.js`.
  - `earth.html` and `mars.html` are local standalone pages.
  - No image/audio/font/data assets.
- External URLs:
  - `https://webspace.science.uu.nl/~gent0113/astro/almagestephemeris.htm`
  - `https://people.sc.fsu.edu/~dduke/models`
- Missing or suspicious files:
  - No missing local references found.
  - The index page title is still `Planetary models`.
  - Several pages use `width==device-width` in the viewport meta tag. This was preserved.
- Local status:
  - Entry page and `mars_alm.html` loaded locally with no browser console errors.
- Main technical risks:
  - Most user-facing text is hard-coded in HTML or page-level JavaScript variables.
  - One code file, `sun.js`, differs from the English version beyond direct page text.
  - Scientific/model correctness was not validated in this pass.

### `doppler`

- Original entry file: `_import/doppler/index.html`
- Migrated entry path: `tools/doppler/index.html`
- Scripts/styles/assets used:
  - `doppler.css`
  - `sound.js`, `sirens.js`, `fire.js`, `light.js`
  - `doppler.js` is present but not referenced by the imported index pages; it appears to be a duplicate/older sound script.
  - No image/audio/font/data assets. Sound is synthesized with the Web Audio API.
- External URLs:
  - None in HTML/JS/CSS.
  - GPL license text contains FSF/GNU URLs.
- Missing or suspicious files:
  - No missing local references found.
  - `index.html` title is still `Planetary models`.
  - Some pages use `width==device-width` in the viewport meta tag. This was preserved.
- Local status:
  - Entry page, `sound.html`, and `light.html` loaded locally with no browser console errors.
  - Clicking the `sound.html` canvas after load produced no browser console errors.
- Main technical risks:
  - Browser audio policies require sound to start from a user gesture. The migrated copy now calls `context.resume()` from the existing click/tap-driven start and mute paths.
  - Audio was not subjectively checked for correctness in this pass.
  - The scripts are global-state canvas animations.

### `kinetic`

- Original entry file: `_import/kinetic/index.html`
- Migrated entry path: `tools/kinetic/index.html`
- Scripts/styles/assets used:
  - `kinetic.js`
  - `kinetic.css`
  - No image/audio/font/data assets.
- External URLs:
  - None in HTML/JS/CSS.
- Missing or suspicious files:
  - No missing local references found.
  - The viewport meta tag uses `width==device-width`. This was preserved.
- Local status:
  - Entry page loaded locally with no browser console errors.
- Main technical risks:
  - This should be presented as an educational animation/toy model, not a real kinetic simulation.
  - Motion depends on random initialization and global canvas state.

### `armatur`

- Original entry file: `_import/armatur/index.html`
- Migrated entry path: `tools/armatur/index.html`
- Scripts/styles/assets used:
  - `armatur.js`
  - Inline form-building script in `index.html`
  - No CSS file and no image/audio/font/data assets.
- External URLs:
  - None.
- Missing or suspicious files:
  - No missing local references found.
  - Input validation is minimal. Blank, zero, negative, or inconsistent values can produce unreliable output.
- Local status:
  - Entry page loaded locally with no browser console errors.
  - A small sample calculation produced a result.
- Main technical risks:
  - The current cutting plan algorithm is greedy and may be non-optimal.
  - It mutates and sorts the requested lengths in place.
  - The output is generated as HTML strings.

## C. Language findings

`planetmn` and `planets` are structurally the same planetary/Ptolemy simulation family. They have matching filenames and mostly matching scripts.

Identical between English and Mongolian imports:

- `almagest.js`
- `earth.html`
- `mars.html`
- `merc.js`
- `moon.js`
- `palmagest.js`
- `planets.css`
- `planets.js`
- `sup.js`

Different between English and Mongolian imports:

- `index.html`
- `jupiter_alm.html`
- `mars_alm.html`
- `mercury_alm.html`
- `moon_alm.html`
- `saturn_alm.html`
- `sun.js`
- `sun_alf.html`
- `sun_alm.html`
- `venus_alm.html`

They can likely be merged later into one bilingual tool, but not in this pass. A later merge should first separate hard-coded strings from shared orbital/canvas logic.

Hard-coded strings appear in:

- Index page headings, descriptions, and link labels.
- Page titles.
- Form labels such as Gregorian date, Julian day, longitude, elongation.
- Overlay/help text inside each planet page.
- Some JavaScript variables such as `longitude_text` and `elongation_text`.

Shared or duplicate code appears in:

- The shared planetary scripts listed above.
- The parallel `_alm.html` page structure for each planet.
- The CSS and canvas interaction code.

Special caution: `sun.js` differs between the two versions, so a future bilingual merge should inspect that file carefully instead of assuming it is only translated text.

## D. Standalone/extractability findings

- `planets-en`: Copyable as `tools/planets-en/`. It has no dependency on repository-level shared code. The only external links are documentation/credit links.
- `planets-mn`: Copyable as `tools/planets-mn/`. It has no dependency on repository-level shared code. The only external links are documentation/credit links.
- `doppler`: Copyable as `tools/doppler/`. It has no dependency on repository-level shared code. It uses browser canvas and Web Audio APIs.
- `kinetic`: Copyable as `tools/kinetic/`. It has no dependency on repository-level shared code. It uses browser canvas.
- `armatur`: Copyable as `tools/armatur/`. It has no dependency on repository-level shared code.

The new homepage and `tools.json` point to the migrated folders, but the tools do not depend on the homepage to run.

## E. Armatur algorithm note

The current algorithm:

1. Computes the total requested length.
2. Sorts requested pieces by descending length.
3. Repeatedly fills one stock bar greedily from longest to shortest using `Math.floor((m - s) / pieceLength)`.
4. Repeats that cut pattern as many times as the remaining quantities allow.
5. Reports total stock bars, waste length/percentage, and approximate weight.

Why it may be non-optimal:

- Greedy longest-first packing can miss combinations with lower waste.
- Repeating one greedy pattern can lock in early choices that become bad later.
- It does not search alternative cut patterns or optimize globally.
- It does not model kerf/cut width, stock availability, minimum usable leftover, or multiple stock lengths.

Later improvement directions:

- Add input validation and clear units.
- Add cut-width/kerf and optional leftover rules.
- Generate candidate patterns with dynamic programming or integer programming.
- Compare the greedy result against a best-known or optimal result for small cases.
- Keep the preserved greedy mode as a compatibility baseline while adding an optimized mode.

## F. Questions for the next planning step

1. Should the next pass preserve each tool as a standalone folder, or begin extracting shared styling/navigation?
2. Should the planetary tools be merged into one bilingual tool now, or should they stay separate until behavior tests exist?
3. Should the Doppler pages remain Mongolian-only, or should English labels be added later?
4. Should Armatur become a more robust engineering calculator with validation and optimization, or stay as a simple legacy calculator?
5. What license metadata should the public `sol` repository use, given that some imported folders include GPL license files?
6. Should old source credits be kept exactly as imported, or gathered into a visible credits/about section?

## G. Suggested next Codex prompt

```text
Continue work in `/Users/gantumur/Documents/Science/sol`.

Do not modify `_import/`.

Using `docs/MIGRATION_REPORT.md` as context, do a second pass focused on polish and safety:
- fix harmless migrated-page metadata typos such as viewport `width==device-width` and incorrect page titles;
- add minimal per-tool README or credits files where useful;
- add lightweight smoke tests or a script that checks local HTML references;
- decide whether `doppler.js` is unused duplicate code and document or remove it only if safe;
- keep each tool standalone and avoid a framework.

Do not merge the planetary English/Mongolian tools yet unless you first show the exact low-risk plan.
Do not rewrite the Armatur algorithm yet.
```

## Verification summary

- Static local-reference scan found no missing `href` or `src` targets.
- `tools.json` parses as valid JSON.
- Local server was run at `http://127.0.0.1:8765/`.
- Browser checks loaded:
  - `/`
  - `/tools/planets-en/`
  - `/tools/planets-en/mars_alm.html`
  - `/tools/planets-mn/`
  - `/tools/planets-mn/mars_alm.html`
  - `/tools/doppler/`
  - `/tools/doppler/sound.html`
  - `/tools/doppler/light.html`
  - `/tools/kinetic/`
  - `/tools/armatur/`
- No browser console errors were observed on those checked pages.
- A small Armatur sample calculation produced output.

Remaining uncertainty:

- Full scientific correctness was not validated.
- Audio quality/timing was not subjectively verified.
- Not every planetary subpage was manually opened in the browser.
- Licensing/publication decisions still need review before this becomes a public GitHub repository.
