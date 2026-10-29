#!/usr/bin/env node
/**
 * AG-020 — Every Done Open ID in docs/OPEN_PROGRAM.md must have
 * docs/ship-receipts/{ID}.md
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const programPath = join(root, "docs/OPEN_PROGRAM.md");
const receiptsDir = join(root, "docs/ship-receipts");

const md = readFileSync(programPath, "utf8");
const doneIds = new Set();
const rowRe =
  /^\|\s*Done\s*\|\s*((?:P|W|A|S|AG|RT|SEC)-\d{2,4})\s*\|/gim;
for (const m of md.matchAll(rowRe)) {
  doneIds.add(m[1].toUpperCase());
}

if (doneIds.size === 0) {
  console.error("assert-ship-receipts: no Done IDs found in OPEN_PROGRAM.md");
  process.exit(1);
}

const missing = [];
for (const id of [...doneIds].sort()) {
  const file = join(receiptsDir, `${id}.md`);
  if (!existsSync(file)) missing.push(id);
}

if (missing.length) {
  console.error(
    `assert-ship-receipts: missing ship receipts for: ${missing.join(", ")}`,
  );
  process.exit(1);
}

console.log(
  `assert-ship-receipts: ok (${doneIds.size} Done IDs have docs/ship-receipts/*.md)`,
);
