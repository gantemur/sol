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

function checkJson() {
  const file = path.join(root, "tools.json");
  JSON.parse(fs.readFileSync(file, "utf8"));
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
  checkJson();
  const missing = checkRefs();
  if (missing.length) {
    console.error("Missing local references:");
    for (const item of missing) console.error(`- ${item}`);
    process.exit(1);
  }
  console.log("Static checks passed: tools.json parses and local href/src targets exist.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
