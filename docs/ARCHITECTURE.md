# Architecture

`sol` is currently a plain static site. The goal is to keep the project flexible while migrating old tools and adding future independent scientific/computational tools.

## Folders

- `_import/` is ignored local source/archive material. It should not be committed or modified during normal migration work.
- `<tool-id>/` at the repository root contains each migrated or native tool, served at `/sol/<tool-id>/`. Each tool should keep its own entry page and local assets.
- `tools/` is the former tool location (until 2026-11-07). It holds only forwarding pages from old URLs to `<tool-id>/`; do not add tools or other files there.
- `tools.json` is the public registry used to describe the tools on the site.
- `shared/` may contain optional source-level utilities later. Tools should not depend on shared code unless that dependency is genuinely helpful and still easy to copy.
- `docs/` contains migration notes and project planning documentation.

`docs`, `scripts`, `shared` and `tools` are reserved names; the static checker rejects them as tool IDs.

## Old URLs

GitHub Pages has no server-side redirects, so each former page `tools/<tool-id>/<page>.html` is replaced by a tiny HTML page that forwards with `location.replace` (keeping `?query` and `#hash`), plus a `meta refresh` fallback and a visible link. These pages are marked `noindex` and point `rel=canonical` at the new address. `node scripts/check-static.js` fails if anything other than a working forwarder appears under `tools/`.

## Tool independence

Each tool should remain extractable as a standalone static folder whenever practical. Shared code is allowed later, but it should not make a small tool hard to move, archive, or embed elsewhere.

Prefer local relative paths inside each tool. Avoid build steps unless a tool clearly needs one.

## Languages

Language handling should preserve Mongolian and English behavior first. Merge shared code only when it is safe and well understood.

For the planetary tools, the English and Mongolian versions are structurally similar but not identical. Keep them separate until the hard-coded strings and any real code differences have been inspected carefully.
