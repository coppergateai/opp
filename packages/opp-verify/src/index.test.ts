import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateSpendLicense, verifyShipReceipt } from "./index.js";
import type { OpenProgramRow, ShipReceiptVerifyBody } from "@opp/schema";

const rows: OpenProgramRow[] = [
  {
    id: "P-020",
    title: "Verify",
    notes: "",
    status: "open",
    section: null,
  },
  {
    id: "P-010",
    title: "Done item",
    notes: "",
    status: "done",
    section: null,
  },
];

describe("@opp/verify", () => {
  it("allows spend only on Open IDs", () => {
    assert.equal(evaluateSpendLicense(rows, "P-020").allowed, true);
    assert.equal(evaluateSpendLicense(rows, null).allowed, false);
    assert.equal(evaluateSpendLicense(rows, "P-010").allowed, false);
    assert.equal(evaluateSpendLicense(rows, "P-999").allowed, false);
  });

  it("verifies ship receipts", () => {
    const receipt: ShipReceiptVerifyBody = {
      kind: "ship_receipt",
      openId: "P-020",
      title: "P-020: Verify",
      spendMicros: 1000,
      fitnessScore: 1,
      ci: {
        acceptReady: true,
        blocking: false,
        passed: true,
        checkCount: 1,
      },
      writeback: { architectureId: "P-020", note: "Done" },
      acceptedAt: new Date().toISOString(),
    };
    assert.equal(verifyShipReceipt(rows, receipt).ok, true);
    assert.equal(
      verifyShipReceipt(rows, { ...receipt, openId: null }).ok,
      false,
    );
  });
});
