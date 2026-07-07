# Арматур

Status: public alpha migration. The tool is preserved as a simple static rod-cutting helper.

Original source note: migrated from the local raw import archive into `tools/armatur/`. `_import/` remains local-only and ignored.

Language: Mongolian.

Known limitations:

- The current algorithm is greedy and may not find the globally best cutting plan.
- Input validation is minimal.
- Cut width, stock availability, leftover reuse rules, and multiple stock lengths are not modeled.
- The algorithm is intentionally not rewritten in this migration pass.
