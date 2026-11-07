#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const checker = path.join(__dirname, "check-static.js");
const valid = { id: "sample", entry: "sample/" };
const forwarder = (target) =>
  `<script>location.replace("${target}" + location.search);</script><meta http-equiv="refresh" content="0; url=${target}">`;
const cases = [
  { name: "valid registry", registry: [valid], expected: /Static checks passed/ },
  { name: "non-array registry", registry: {}, error: /registry must be an array/ },
  { name: "null record", registry: [null], error: /invalid tool ID/ },
  { name: "duplicate ID", registry: [valid, valid], error: /duplicate tool ID "sample"/ },
  { name: "invalid ID", registry: [{ id: "../sample", entry: "sample/" }], error: /invalid tool ID/ },
  { name: "reserved ID", registry: [{ id: "docs", entry: "docs/" }], pages: ["docs"], error: /reserved tool ID "docs"/ },
  { name: "old tools/ entry", registry: [{ ...valid, entry: "tools/sample/" }], error: /invalid entry path.*"sample\/"/ },
  { name: "mismatched entry", registry: [{ ...valid, entry: "other/" }], error: /invalid entry path.*"sample\/"/ },
  { name: "traversal entry", registry: [{ ...valid, entry: "sample/../../" }], error: /invalid entry path/ },
  { name: "absolute entry", registry: [{ ...valid, entry: "/sample/" }], error: /invalid entry path/ },
  { name: "missing entry page", registry: [valid], pages: [], error: /missing entry page "sample\/index.html"/ },
  { name: "missing HTML link", registry: [valid], html: '<a href="missing.html">Missing</a>', error: /Missing local references:[\s\S]*sample\/index.html -> missing.html/ },
  { name: "valid forwarder", registry: [valid], old: { "tools/sample/index.html": forwarder("../../sample/") }, expected: /forwarders resolve/ },
  { name: "broken forwarder", registry: [valid], old: { "tools/sample/index.html": forwarder("../../gone/") }, error: /forwarding target "..\/..\/gone\/" is missing/ },
  { name: "stale copy in tools/", registry: [valid], old: { "tools/sample/app.js": "1;" }, error: /only forwarding pages belong in tools\// },
];

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sol-static-check-"));
try {
  for (const [index, test] of cases.entries()) {
    const fixture = path.join(tempRoot, String(index));
    fs.mkdirSync(fixture);
    fs.writeFileSync(path.join(fixture, "tools.json"), JSON.stringify(test.registry));
    for (const id of test.pages ?? ["sample"]) {
      const dir = path.join(fixture, id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), test.html ?? "<!doctype html><title>Fixture</title>");
    }

    for (const [file, text] of Object.entries(test.old ?? {})) {
      fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
      fs.writeFileSync(path.join(fixture, file), text);
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
