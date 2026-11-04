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
    assert.ok(fs.existsSync(path.resolve(path.dirname(absolute), ref)),
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
for (const key of ["sourceLink", "creditsLink", "dedicationHistory", "dedicationMemory"]) {
  assert.equal([...app.matchAll(new RegExp("\\b" + key + ":", "g"))].length, 2,
    "footer key must exist in both languages: " + key);
}
assert.match(html, /data-i18n="dedicationHistory"/);
assert.match(html, /data-i18n="dedicationMemory"/);
for (const page of ["index.html", "legacy/index.html"]) {
  const content = fs.readFileSync(path.join(tool, page), "utf8");
  assert.match(content, /М\. Пүрэв-Эрдэнийн/);
  assert.match(content, /#credits-and-licensing-status/);
  assert.doesNotMatch(content, /sol-private/);
}
console.log("Armatur local HTML and assets: static checks passed");
