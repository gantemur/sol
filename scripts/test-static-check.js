#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const checker = path.join(__dirname, "check-static.js");
const valid = { id: "sample", entry: "tools/sample/" };
const cases = [
  { name: "valid registry", registry: [valid], expected: /Static checks passed/ },
  { name: "non-array registry", registry: {}, error: /registry must be an array/ },
  { name: "null record", registry: [null], error: /invalid tool ID/ },
  { name: "duplicate ID", registry: [valid, valid], error: /duplicate tool ID "sample"/ },
  { name: "invalid ID", registry: [{ id: "../sample", entry: "tools/sample/" }], error: /invalid tool ID/ },
  { name: "mismatched entry", registry: [{ ...valid, entry: "tools/other/" }], error: /invalid entry path.*tools\/sample\// },
  { name: "traversal entry", registry: [{ ...valid, entry: "tools/sample/../../" }], error: /invalid entry path/ },
  { name: "absolute entry", registry: [{ ...valid, entry: "/tools/sample/" }], error: /invalid entry path/ },
  { name: "missing entry page", registry: [valid], pages: [], error: /missing entry page "tools\/sample\/index.html"/ },
  { name: "missing HTML link", registry: [valid], html: '<a href="missing.html">Missing</a>', error: /Missing local references:[\s\S]*tools\/sample\/index.html -> missing.html/ },
];

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sol-static-check-"));
try {
  for (const [index, test] of cases.entries()) {
    const fixture = path.join(tempRoot, String(index));
    fs.mkdirSync(fixture);
    fs.writeFileSync(path.join(fixture, "tools.json"), JSON.stringify(test.registry));
    for (const id of test.pages ?? ["sample"]) {
      const dir = path.join(fixture, "tools", id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), test.html ?? "<!doctype html><title>Fixture</title>");
    }

    const result = spawnSync(process.execPath, [checker], { cwd: fixture, encoding: "utf8", timeout: 5000 });
    assert.ifError(result.error);
    const output = result.stdout + result.stderr;
    assert.equal(result.status, test.error ? 1 : 0, `${test.name}: ${output}`);
    assert.match(output, test.error ?? test.expected, test.name);
    console.log(`PASS ${test.name}: exit ${result.status}; ${output.trim()}`);
  }
  console.log(`Static checker tests passed: ${cases.length} isolated fixtures.`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
