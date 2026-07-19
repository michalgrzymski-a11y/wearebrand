// Convert translations.js (JS module) into a plain JSON dump
const path = require("path");
const fs = require("fs");

// Load via require using CommonJS shim — we recreate as ESM-safe below.
const raw = fs.readFileSync(
  path.resolve(__dirname, "../frontend/src/i18n/translations.js"),
  "utf8",
);

// Strip the leading "export const translations =" and trailing semicolon,
// then evaluate to get the plain object.
const src = raw
  .replace(/^\s*export\s+const\s+translations\s*=\s*/m, "module.exports = ")
  .replace(/;\s*$/, ";");

const tmp = path.resolve(__dirname, "_tmp_translations.cjs");
fs.writeFileSync(tmp, src, "utf8");
const translations = require(tmp);
fs.unlinkSync(tmp);

const out = path.resolve(__dirname, "translations.json");
fs.writeFileSync(out, JSON.stringify(translations, null, 2), "utf8");
console.log("wrote", out, fs.statSync(out).size, "bytes");
