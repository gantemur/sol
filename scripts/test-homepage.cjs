/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const tools = JSON.parse(fs.readFileSync(path.join(root, "tools.json"), "utf8"));
const cards = [...html.matchAll(/<li class="tool" data-tool="([^"]+)">([\s\S]*?)<\/li>/g)];
const escape = (value) => value.replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;"
})[c]);
assert.equal(cards.length, tools.length, "one homepage card per registered tool");
assert.equal(new Set(cards.map((m) => m[1])).size, tools.length, "no duplicate cards");
for (const tool of tools) {
  const card = cards.find((m) => m[1] === tool.id);
  assert.ok(card, tool.id + ": missing homepage card");
  const source = card[2];
  const languages = Array.isArray(tool.language) ? tool.language : [tool.language];
  assert.ok(source.includes('href="' + tool.entry + '"'), tool.id + ": route mismatch");
  const badge = source.match(/class="languages"[^>]*>([^<]+)</);
  assert.ok(badge, tool.id + ": missing language indicator");
  assert.equal(badge[1], languages.map((lang) => lang.toUpperCase()).join(" · "));
  if (languages.length > 1) assert.deepEqual(languages, ["mn", "en"]);
  for (const lang of languages) {
    const title = tool.titles ? tool.titles[lang] : tool.title;
    const description = tool.descriptions ? tool.descriptions[lang] : tool.description;
    assert.ok(title && description, tool.id + ": missing " + lang + " caption");
    const heading = source.match(/<h2>([\s\S]*?)<\/h2>/)[1];
    assert.ok(heading.includes('lang="' + lang + '"'), tool.id + ": heading language missing");
    assert.ok(heading.includes(escape(title)), tool.id + ": title mismatch");
    assert.ok(source.includes('<p lang="' + lang + '">' + escape(description) + '</p>'),
      tool.id + ": description mismatch");
    if (lang === "mn") assert.match(description, /[А-Яа-яӨөҮү]/u);
  }
  assert.doesNotMatch(source, /©|MIT|LICENSING\.md|LICENSE/, "no per-card legal notice");
}
for (const title of ["Planetary models", "Rainbow angles", "Stellar warmth", "Rebar cutting"]) {
  assert.ok(html.includes(title), "sentence-case title missing: " + title);
}
assert.doesNotMatch(html, /Planetary Models|Rainbow Angles|Stellar Warmth|text-transform:\s*capitalize/);
assert.equal((html.match(/©/g) || []).length, 1, "one centralized copyright statement");
assert.match(html, /href="LICENSE"/);
assert.match(html, /href="LICENSING\.md"/);
assert.match(html, /interfaces uncluttered/);
assert.match(html, /Unless otherwise stated in the accompanying files/);
assert.match(html, /author-owned code/);
assert.match(html, /including the planetary models/);
for (const id of ["planets-en", "planets-mn"]) {
  const tool = tools.find((t) => t.id === id);
  assert.equal(tool.license, null, "do not erase unresolved upstream scope");
  assert.equal(tool.ownCodeLicense, "MIT");
}
console.log("Homepage: card/registry languages, bilingual captions, sentence case and centralized license notice passed.");
