# Sol scientific toolbox — agent instructions

## Coordination

Several agents may work here in parallel. Before writing, follow
`gantemur/playbook/coordination.md` (current `main`): claim a lock in
`LOCKS.md`, re-check it before every push, release it when done, and
keep unfinished work in a workspace. Locks grant no authority; the
rest of this file says what may be committed or merged.

## Project and Playbook

- Public code repository: `gantemur/sol`; live website: `https://gantemur.github.io/sol/`.
- Private headquarters: `gantemur/sol-private`; internal briefs, reviews, reports, decisions and selected permitted nonpublic research-source inventories belong there, **never** in this public repository.
- Procedures: `gantemur/playbook/manual/README.md`, content revision `c391eea0a6a8ba05744e6c723f938c2621d2f38e`; selected migration profile: `manual/migrations/web-tool-cloud.md`. Read relevant manual pages at that pin; use `coordination.md` from **live Playbook main**.
- Read `README.md`, `docs/ARCHITECTURE.md`, `docs/PUBLIC_ALPHA_CHECK.md` and each affected tool's README before implementation.
- This repository contains plain, standalone static HTML/CSS/JS tools, a `tools.json` registry, and `scripts/check-static.js`. Preserve existing tool behavior, source credits, and bilingual English/Mongolian functionality.

## Source, archives and scientific boundaries

- Source, tests, publishable web assets and configurations needed by the actual website belong here. A static tool should remain extractable where practical.
- Ignored `_import/`, old notebooks, local uncommitted files and Git histories are **not** automatically backed up by this repository. Inventory useful material for an approved preservation plan; do not copy original archives, credentials, private content or unreviewed licensed materials to public GitHub.
- The owner prefers private `sol-private` for **selected** important local-only source and inactive/nonweb research files when permissions, size, source history and privacy permit; unusually large archives and raw/restricted sources need appropriate separately approved storage with manifests. Do not delete or rewrite existing material in a routine migration.
- The imported planetary animations were not independently scientifically revalidated. `kinetic` is educational/toy; `armatur` uses a greedy cutting method; `warm` is a simplified radiative model; `rainbow-angle` is notebook-derived. Current repository-wide license is TBD. Do not claim static syntax/link tests establish model correctness or licensing clearance.

## Write and release authority

- Before any write, follow live Playbook coordination; report actual branch, SHA, tests and pushed private outcome as assigned. New application work goes on authorized task branches, with internal briefs/reports in `sol-private`. No private data in a public PR or task branch.
- **Public `main` pushes can automatically trigger GitHub Pages builds and publication, even for documentation-only or `LOCKS.md` commits.** Check triggers, free/paid runner type, and cost constraints; do not make public-main coordination writes without the project's explicit operational authorization.
- Never merge, publish/deploy, spend, change repository permissions/settings, force-push, rewrite history, delete local archives or expose restricted material without task-specific authorization.
