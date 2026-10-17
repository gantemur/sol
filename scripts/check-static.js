#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "_import") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function checkRegistry() {
  const file = path.join(root, "tools.json");
  const tools = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(tools)) throw new Error("tools.json: registry must be an array.");

  const ids = new Set();
  for (const [index, tool] of tools.entries()) {
    const label = `tools.json: entry ${index + 1}`;
    if (!tool || typeof tool.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.id)) {
      throw new Error(`${label}: invalid tool ID; use lowercase letters, digits and single hyphens.`);
    }
    if (ids.has(tool.id)) throw new Error(`${label}: duplicate tool ID "${tool.id}".`);
    ids.add(tool.id);

    const expectedEntry = `tools/${tool.id}/`;
    if (tool.entry !== expectedEntry) {
      throw new Error(`${label} (${tool.id}): invalid entry path; expected "${expectedEntry}".`);
    }
    const page = path.join(root, expectedEntry, "index.html");
    if (!fs.existsSync(page) || !fs.statSync(page).isFile()) {
      throw new Error(`${label} (${tool.id}): missing entry page "${expectedEntry}index.html".`);
    }
  }
}

function htmlRefs(html) {
  const refs = [];
  const text = fs.readFileSync(html, "utf8");
  const pattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = pattern.exec(text))) refs.push(match[2]);
  return refs;
}

function isExternal(ref) {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(ref) || /^[a-z][a-z0-9+.-]*:/i.test(ref);
}

function checkRefs() {
  const missing = [];
  const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
  for (const html of htmlFiles) {
    for (const ref of htmlRefs(html)) {
      if (!ref || ref.startsWith("#") || isExternal(ref)) continue;
      const clean = ref.split("#")[0].split("?")[0];
      if (!clean) continue;
      const target = path.resolve(path.dirname(html), clean);
      if (!fs.existsSync(target)) missing.push(`${rel(html)} -> ${ref}`);
    }
  }
  return missing;
}

try {
  checkRegistry();
  const missing = checkRefs();
  if (missing.length) {
    console.error("Missing local references:");
    for (const item of missing) console.error(`- ${item}`);
    process.exit(1);
  }
  console.log("Static checks passed: tools.json registry is valid and local href/src targets exist.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
