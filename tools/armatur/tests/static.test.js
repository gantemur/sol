/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const tool = path.resolve(__dirname, "..");
for (const page of ["index.html", "legacy/index.html"]) {
  const absolute = path.join(tool, page);
  const html = fs.readFileSync(absolute, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, page + ": duplicate element ID");
  assert.match(html, /<html lang="mn">/);
  assert.match(html, /name="viewport"/);
  for (const match of html.matchAll(/<(?:script|link)\s[^>]*(?:src|href)="([^"]+)"/g)) {
    const ref = match[1];
    if (ref.startsWith("../") || ref.startsWith("http")) continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(absolute), ref.split(/[?#]/)[0])),
      page + ": missing local asset " + ref);
  }
}
const app = fs.readFileSync(path.join(tool, "app.js"), "utf8");
const html = fs.readFileSync(path.join(tool, "index.html"), "utf8");
for (const id of [...app.matchAll(/\$\("([^"]+)"\)/g)].map((match) => match[1])) {
  assert.ok(html.includes('id="' + id + '"'), "app.js references missing element " + id);
}
const translations = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
for (const key of translations) {
  assert.ok(app.includes(key + ":"), "missing UI translation key " + key);
}
for (const key of ["sourceLink", "licenseLink", "creditsLink", "dedicationHistory", "dedicationMemory"]) {
  assert.equal([...app.matchAll(new RegExp("\\b" + key + ":", "g"))].length, 2,
    "footer key must exist in both languages: " + key);
}
assert.match(html, /data-i18n="dedicationHistory"/);
assert.match(html, /data-i18n="dedicationMemory"/);
for (const page of ["index.html", "legacy/index.html"]) {
  const content = fs.readFileSync(path.join(tool, page), "utf8");
  assert.match(content, /найз Мөнхөөгийн Пүрэв-Эрдэнийн хүсэлтээр/);
  assert.match(content, /бүтээсэн юм\./);
  assert.doesNotMatch(content, /миний найз|М\. Пүрэв-Эрдэнийн|M\. Purev-Erdene/);
  assert.match(content, /#credits-and-license/);
  assert.match(content, /href="LICENSE"/);
  assert.match(content, /© 2020, 2026 Ts\. Gantumur/);
  assert.doesNotMatch(content, /sol-private/);
}
for (const file of ["README.md", "legacy/README.md"]) {
  const content = fs.readFileSync(path.join(tool, file), "utf8");
  assert.match(content, /Purev-Erdene Munkhuu \(Мөнхөөгийн Пүрэв-Эрдэнэ\)/);
  assert.match(content, /Tsogtgerel Gantumur/);
  assert.doesNotMatch(content, /M\. Purev-Erdene/);
}
assert.match(app, /my friend Purev-Erdene Munkhuu/);
assert.match(app, /dpTimeLimitMs: 40/);
assert.match(app, /dpMaxStates: 10000/);

const worker = fs.readFileSync(path.join(tool, "optimizer-worker.js"), "utf8");
const legacy = fs.readFileSync(path.join(tool, "legacy/index.html"), "utf8");
assert.match(legacy, /my friend Purev-Erdene Munkhuu/);
const assetReferences = [
  [html, /href="style\.css\?v=([^"]+)"/, "main CSS"],
  [html, /src="engine\.js\?v=([^"]+)"/, "main engine"],
  [html, /src="app\.js\?v=([^"]+)"/, "main app"],
  [app, /new Worker\("optimizer-worker\.js\?v=([^"]+)"\)/, "worker"],
  [worker, /importScripts\("engine\.js\?v=([^"]+)"\)/, "worker engine"],
  [legacy, /src="armatur\.js\?v=([^"]+)"/, "legacy script"]
];
const releases = assetReferences.map(([source, pattern, label]) => {
  const match = source.match(pattern);
  assert.ok(match, label + ": missing versioned asset URL");
  return match[1];
});
assert.equal(new Set(releases).size, 1, "asset release tokens must match");

const license = fs.readFileSync(path.join(tool, "LICENSE"), "utf8");
assert.equal(license, fs.readFileSync(path.join(tool, "legacy/LICENSE"), "utf8"));
assert.match(license, /^MIT License\n/);
assert.match(license, /Copyright \(c\) 2020, 2026 Tsogtgerel Gantumur/);
assert.match(license, /Permission is hereby granted, free of charge/);
assert.match(license, /THE SOFTWARE IS PROVIDED "AS IS"/);
console.log("Armatur local HTML and assets: static checks passed");

