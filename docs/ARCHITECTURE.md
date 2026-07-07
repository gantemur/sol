# Architecture

`sol` is currently a plain static site. The goal is to keep the project flexible while migrating old tools and adding future independent scientific/computational tools.

## Folders

- `_import/` is ignored local source/archive material. It should not be committed or modified during normal migration work.
- `tools/<tool-id>/` contains migrated or native tools. Each tool should keep its own entry page and local assets.
- `tools.json` is the public registry used to describe the tools on the site.
- `shared/` may contain optional source-level utilities later. Tools should not depend on shared code unless that dependency is genuinely helpful and still easy to copy.
- `docs/` contains migration notes and project planning documentation.

## Tool independence

Each tool should remain extractable as a standalone static folder whenever practical. Shared code is allowed later, but it should not make a small tool hard to move, archive, or embed elsewhere.

Prefer local relative paths inside each tool. Avoid build steps unless a tool clearly needs one.

## Languages

Language handling should preserve Mongolian and English behavior first. Merge shared code only when it is safe and well understood.

For the planetary tools, the English and Mongolian versions are structurally similar but not identical. Keep them separate until the hard-coded strings and any real code differences have been inspected carefully.
