#!/usr/bin/env node
/**
 * Design-token validation — `npm run validate:tokens`
 *  1. Every var() reference in tokens.css resolves.
 *  2. Motion tokens in CSS match src/config/motion.tokens.json.
 *  3. Every token name used in src/config/design.ts exists.
 *  4. WCAG contrast of the key text / UI pairs (light and Deep Navy).
 *  5. Lists PLACEHOLDER values still present in src/config/site.ts.
 * Exits with code 1 if any check fails.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

const css = read("src/styles/tokens.css").replace(/\/\*[\s\S]*?\*\//g, "");
const motion = JSON.parse(read("src/config/motion.tokens.json"));
const designTs = read("src/config/design.ts");
const siteTs = read("src/config/site.ts");

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ---------------------------------------------------------------- parse
function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) return {};
  const open = css.indexOf("{", start);
  let depth = 0;
  let end = open;
  for (; end < css.length; end++) {
    if (css[end] === "{") depth++;
    if (css[end] === "}" && --depth === 0) break;
  }
  const body = css.slice(open + 1, end);
  const vars = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

const theme = block("@theme static");
const dark = { ...theme, ...block('[data-surface="dark"]') };

function resolve(vars, value, seen = new Set()) {
  return value.replace(/var\((--[\w-]+)(?:,\s*[^)]*)?\)/g, (match, name) => {
    if (seen.has(name)) throw new Error(`circular reference ${name}`);
    if (!(name in vars)) return match; // runtime-provided (e.g. next/font)
    return resolve(vars, vars[name], new Set([...seen, name]));
  });
}

// ---------------------------------------------------------------- 1. references
console.log("\n1. Token references");
const runtimeProvided = new Set(["--font-space-grotesk", "--font-inter"]);
let refErrors = 0;
for (const [name, value] of Object.entries(dark)) {
  for (const m of value.matchAll(/var\((--[\w-]+)/g)) {
    if (!(m[1] in dark) && !runtimeProvided.has(m[1])) {
      fail(`${name} → ${m[1]} is not defined`);
      refErrors++;
    }
  }
}
if (!refErrors) ok(`${Object.keys(theme).length} tokens, all references resolve`);

// ---------------------------------------------------------------- 2. motion sync
console.log("\n2. Motion tokens (CSS ↔ motion.tokens.json)");
for (const [key, bezier] of Object.entries(motion.ease)) {
  const cssValue = theme[`--ease-${key}`];
  const expected = `cubic-bezier(${bezier.join(", ")})`;
  if (cssValue?.replace(/\s/g, "") !== expected.replace(/\s/g, "")) fail(`--ease-${key}: CSS ${cssValue} ≠ JSON ${expected}`);
  else ok(`--ease-${key}`);
}
for (const [key, ms] of Object.entries(motion.duration)) {
  const cssValue = theme[`--duration-${key}`];
  if (cssValue !== `${ms}ms`) fail(`--duration-${key}: CSS ${cssValue} ≠ JSON ${ms}ms`);
  else ok(`--duration-${key}`);
}

// ---------------------------------------------------------------- 3. design.ts names
console.log("\n3. Token names referenced in src/config/design.ts");
const names = [...designTs.matchAll(/"(--[\w-]+)"/g)].map((m) => m[1]);
const missing = names.filter((n) => !(n in theme));
if (missing.length) missing.forEach((n) => fail(`${n} does not exist in tokens.css`));
else ok(`${names.length} names exist`);

// ---------------------------------------------------------------- 4. contrast
function hex(vars, name) {
  const v = resolve(vars, vars[name] ?? name).trim();
  if (!/^#([0-9a-f]{6})([0-9a-f]{2})?$/i.test(v)) throw new Error(`${name} is not a solid hex (${v})`);
  return v.slice(0, 7);
}
function luminance(h) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const checks = [
  // [label, foreground, background, minimum]
  ["ink on canvas", "--color-ink", "--color-canvas", 4.5],
  ["ink on panel-muted", "--color-ink", "--color-panel-muted", 4.5],
  ["ink-secondary on canvas", "--color-ink-secondary", "--color-canvas", 4.5],
  ["ink-secondary on panel", "--color-ink-secondary", "--color-panel", 4.5],
  ["ink-secondary on panel-muted", "--color-ink-secondary", "--color-panel-muted", 4.5],
  ["button text on action-primary", "--color-ink-on-action", "--color-action-primary", 4.5],
  ["button text on hover", "--color-ink-on-action", "--color-action-primary-hover", 4.5],
  ["button text on active", "--color-ink-on-action", "--color-action-primary-active", 4.5],
  ["link on canvas", "--color-link", "--color-canvas", 4.5],
  ["link on panel-muted", "--color-link", "--color-panel-muted", 4.5],
  ["focus ring on canvas (UI)", "--color-focus", "--color-canvas", 3],
  ["control border on panel (UI)", "--color-line-strong", "--color-panel", 3],
  ["control border on canvas (UI)", "--color-line-strong", "--color-canvas", 3],
  ["graphite on mint badge", "--color-ink-on-accent", "--color-brand-mint", 4.5],
  ["graphite on cyan badge", "--color-ink-on-accent", "--color-brand-cyan", 4.5],
  ["brand blue as LARGE text on white", "--color-brand-blue", "--color-white", 3],
];
const darkChecks = [
  ["ink on navy", "--color-ink", "--color-canvas", 4.5],
  ["ink-secondary on navy", "--color-ink-secondary", "--color-canvas", 4.5],
  ["ink-secondary on navy panel", "--color-ink-secondary", "--color-panel", 4.5],
  ["link on navy", "--color-link", "--color-canvas", 4.5],
  ["focus ring on navy (UI)", "--color-focus", "--color-canvas", 3],
  ["control border on navy (UI)", "--color-line-strong", "--color-canvas", 3],
  ["button text on action-primary", "--color-ink-on-action", "--color-action-primary", 4.5],
];

for (const [title, vars, list] of [
  ["4a. Contrast — light surfaces", theme, checks],
  ["4b. Contrast — Deep Navy (data-surface=dark)", dark, darkChecks],
]) {
  console.log(`\n${title}`);
  for (const [label, fg, bg, min] of list) {
    try {
      const r = ratio(hex(vars, fg), hex(vars, bg));
      const msg = `${label.padEnd(36)} ${r.toFixed(2)}:1 (min ${min})`;
      if (r < min) fail(msg);
      else ok(msg);
    } catch (e) {
      fail(`${label}: ${e.message}`);
    }
  }
}

// ---------------------------------------------------------------- 5. placeholders
const placeholders = siteTs.split("\n").filter((l) => l.includes("PLACEHOLDER") && !l.trim().startsWith("*"));
console.log(`\n5. Content placeholders in src/config/site.ts: ${placeholders.length}`);
placeholders.forEach((l) => console.log(`  ! ${l.trim()}`));

console.log(failures ? `\n✗ ${failures} check(s) failed\n` : "\n✓ All token checks passed\n");
process.exit(failures ? 1 : 0);
