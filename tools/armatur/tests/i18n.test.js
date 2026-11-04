/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const tool = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(tool, "app.js"), "utf8");
const html = fs.readFileSync(path.join(tool, "index.html"), "utf8");
// Exercise the actual dictionary and helper, not a duplicate of their behavior.
const wordsSource = app.match(/  var words = ([\s\S]*?);\n\n  function t/);
const helperSource = app.match(/  function translateStatic\(element\) \{[\s\S]*?\n  \}/);
assert.ok(wordsSource, "translation dictionary not found");
assert.ok(helperSource, "static translation helper not found");
const words = vm.runInNewContext("(" + wordsSource[1] + ")");
assert.deepEqual(Object.keys(words.mn).sort(), Object.keys(words.en).sort());
const fixtures = [...html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)/g)];
assert.ok(fixtures.length > 30, "static translation fixtures must cover the page");

function translator(language, dictionary) {
  return vm.runInNewContext("(" + helperSource[0] + ")", { language, words: dictionary });
}

for (const language of ["mn", "en"]) {
  const translate = translator(language, words);
  for (const [, key, fallback] of fixtures) {
    assert.equal(typeof words[language][key], "string", language + ": missing " + key);
    const element = { dataset: { i18n: key }, textContent: fallback };
    translate(element);
    assert.equal(element.textContent, words[language][key], language + ": " + key);
    assert.notEqual(element.textContent, key, "internal key must not become visible");
  }
  const unknown = { dataset: { i18n: "futurePageText" }, textContent: "Readable HTML fallback" };
  translate(unknown);
  assert.equal(unknown.textContent, "Readable HTML fallback");
}

// Recreate newer footer markup paired with an older dictionary.
const staleWords = { mn: { title: "Арматур" }, en: { title: "Armatur" } };
for (const language of ["mn", "en"]) {
  const translate = translator(language, staleWords);
  for (const key of ["sourceLink", "licenseLink", "creditsLink", "dedicationHistory", "dedicationMemory"]) {
    const fallback = fixtures.find((match) => match[1] === key)[2];
    const element = { dataset: { i18n: key }, textContent: fallback };
    translate(element);
    assert.equal(element.textContent, fallback, "stale dictionary must preserve " + key);
    assert.notEqual(element.textContent, key);
  }
}

const fallbackElement = { dataset: { i18n: "onlyMongolian" }, textContent: "Original" };
translator("en", { mn: { onlyMongolian: "Монгол текст" }, en: {} })(fallbackElement);
assert.equal(fallbackElement.textContent, "Монгол текст");
console.log("Armatur translations and stale-dictionary fallbacks: all tests passed");
