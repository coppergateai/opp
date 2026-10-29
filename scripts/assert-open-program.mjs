import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const md = readFileSync(resolve(root, "docs/OPEN_PROGRAM.md"), "utf8");
const openRows = [...md.matchAll(/^\| Open \|/gm)];
const doneRows = [...md.matchAll(/^\| Done \|/gm)];
if (doneRows.length === 0) {
  console.error("assert-open-program: expected at least one Done row");
  process.exit(1);
}
console.log(
  `assert-open-program: ok (${doneRows.length} Done, ${openRows.length} Open)`,
);
