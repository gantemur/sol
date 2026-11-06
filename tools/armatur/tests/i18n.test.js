/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
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
assert.match(words.mn.dedicationHistory, /найз Мөнхөөгийн Пүрэв-Эрдэнийн хүсэлтээр/);
assert.match(words.mn.dedicationHistory, /бүтээсэн юм\./);
assert.doesNotMatch(words.mn.dedicationHistory, /миний найз|М\. Пүрэв-Эрдэнийн/);
assert.match(words.en.dedicationHistory, /my friend Purev-Erdene Munkhuu/);
assert.doesNotMatch(words.en.dedicationHistory, /M\. Purev-Erdene/);
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

// Proof explanations follow the final result, not an earlier DP limit.
const noteSource = app.match(/  function solverNoteKey\(result\) \{[\s\S]*?\n  \}/);
assert.ok(noteSource, "solver-note helper not found");
const solverNoteKey = vm.runInNewContext("(" + noteSource[0] + ")");
assert.equal(solverNoteKey({ optimal: true, proof: "count-dp" }), "dpProof");
assert.equal(solverNoteKey({ optimal: true, proof: "length-bound" }), "lengthProof");
assert.equal(solverNoteKey({ optimal: true }), "lengthProof");
assert.equal(solverNoteKey({ optimal: false }), "boundedBest");
for (const status of ["state-limit", "pattern-limit", "pattern-node-limit", "transition-limit", "time-limit"]) {
  assert.equal(solverNoteKey({ optimal: false, dp: { status } }), "dpLimited", status);
  assert.equal(solverNoteKey({ optimal: true, proof: "branch-and-bound", dp: { status } }), "searchProof", status);
  assert.equal(solverNoteKey({ optimal: true, proof: "length-bound", dp: { status } }), "lengthProof", status);
}
for (const status of ["not-needed", "disabled"]) {
  assert.equal(solverNoteKey({ optimal: false, dp: { status } }), "boundedBest", status);
}
for (const key of ["dpProof", "searchProof", "lengthProof", "dpLimited", "boundedBest"]) {
  for (const language of ["mn", "en"]) {
    assert.equal(typeof words[language][key], "string", language + ": missing " + key);
    assert.ok(words[language][key].length > 0);
  }
}
console.log("Armatur translations and stale-dictionary fallbacks: all tests passed");

