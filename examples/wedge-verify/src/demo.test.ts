import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

describe("wedge-verify demo", () => {
  it("proves invent deny + spend allow + receipt verify", () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const r = spawnSync(
      process.execPath,
      ["--import", "tsx", path.join(dir, "demo.ts")],
      { encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const body = JSON.parse(r.stdout) as { ok: boolean };
    assert.equal(body.ok, true);
  });
});
