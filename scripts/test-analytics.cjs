#!/usr/bin/env node
/* Static GoatCounter integration test. No network requests or dependencies. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const tools = JSON.parse(fs.readFileSync(path.join(root, "tools.json"), "utf8"));

function htmlFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(folder, e.name);
    return e.isDirectory() ? htmlFiles(full) : e.isFile() && e.name.endsWith(".html") ? [full] : [];
  });
}

const pages = [{ file: path.join(root, "index.html"), tracked: "/sol/" }];
for (const tool of tools) {
  for (const file of htmlFiles(path.join(root, tool.id))) {
    pages.push({ file, tracked: "/sol/" + tool.id + "/" });
  }
}

for (const { file, tracked } of pages) {
  const html = fs.readFileSync(file, "utf8");
  const label = path.relative(root, file);
  assert.equal((html.match(/gantemur-sol\.goatcounter\.com\/count/g) || []).length, 1, label + ": exactly one endpoint");
  assert.equal((html.match(/gc\.zgo\.at\/count\.js/g) || []).length, 1, label + ": exactly one tracker");
  assert.match(html, /location\.hostname === "gantemur\.github\.io"/, label + ": host guard");
  assert.ok(html.includes('"path":' + JSON.stringify(tracked)), label + ": canonical aggregate path");
  assert.match(html, /"no_events":true/, label + ": no click events");
}

const old = path.join(root, "tools");
if (fs.existsSync(old)) {
  for (const file of htmlFiles(old)) {
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), /goatcounter|gc\.zgo\.at/, path.relative(root, file) + ": legacy forwarding page");
  }
}
assert.ok(fs.existsSync(path.join(root, "docs/ANALYTICS.md")));
console.log("GoatCounter static integration: " + pages.length + " active HTML pages covered; old forwarders excluded.");
