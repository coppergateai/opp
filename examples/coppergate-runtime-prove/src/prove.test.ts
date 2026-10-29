import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCoppergateLikeReceipt,
  projectCoppergateReceiptToOpp,
} from "./receipt-project.js";
import { BIND, runProve } from "./prove.js";

describe("coppergate-runtime-prove (P-020)", () => {
  it("projects Coppergate Accept receipts to OPP verify body", () => {
    const cg = buildCoppergateLikeReceipt({
      openId: "P-020",
      title: "P-020: prove",
    });
    const opp = projectCoppergateReceiptToOpp(cg);
    assert.equal(opp.kind, "ship_receipt");
    assert.equal(opp.openId, "P-020");
    assert.equal(opp.writeback.architectureId, "P-020");
    assert.equal(
      (opp as { taskId?: string }).taskId,
      undefined,
      "runtime-local fields must be stripped",
    );
  });

  it("proves invent deny + spend allow + receipt verify in-process", async () => {
    const result = await runProve({ apiUrl: null });
    assert.equal(result.mode, "in-process");
    assert.equal(result.bind.architectureRepo, BIND.architectureRepo);
    assert.equal(result.bind.architecturePaths, BIND.architecturePaths);
    assert.equal(result.ok, true);
  });

  it("CLI prove exits 0", () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const r = spawnSync(
      process.execPath,
      ["--import", "tsx", path.join(dir, "prove.ts")],
      { encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const body = JSON.parse(r.stdout) as { ok: boolean };
    assert.equal(body.ok, true);
  });
});
