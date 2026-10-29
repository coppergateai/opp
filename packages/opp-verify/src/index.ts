import {
  isOpenId,
  normalizeOpenId,
  type OpenProgramRow,
  type ShipReceiptVerifyBody,
} from "@opp/schema";

export type SpendDecision =
  | { allowed: true; openId: string; reason: "open_id_match" }
  | {
      allowed: false;
      reason:
        | "invent_without_program"
        | "not_open"
        | "unknown_open_id"
        | "invalid_open_id";
      openId?: string;
    };

export type ReceiptVerifyResult =
  | { ok: true; openId: string }
  | {
      ok: false;
      reason:
        | "missing_open_id"
        | "open_id_not_in_program"
        | "writeback_mismatch"
        | "ci_not_ready";
    };

/** Spend License: only Open rows may be reserved/spent. */
export function evaluateSpendLicense(
  rows: OpenProgramRow[],
  candidateOpenId: string | null | undefined,
): SpendDecision {
  if (!candidateOpenId || !String(candidateOpenId).trim()) {
    return { allowed: false, reason: "invent_without_program" };
  }
  const openId = normalizeOpenId(candidateOpenId);
  if (!isOpenId(openId)) {
    return { allowed: false, reason: "invalid_open_id", openId };
  }
  const row = rows.find((r) => r.id === openId);
  if (!row) {
    return { allowed: false, reason: "unknown_open_id", openId };
  }
  if (row.status !== "open") {
    return { allowed: false, reason: "not_open", openId };
  }
  return { allowed: true, openId, reason: "open_id_match" };
}

/** Verify a Ship Receipt against a bound program. */
export function verifyShipReceipt(
  rows: OpenProgramRow[],
  receipt: ShipReceiptVerifyBody,
): ReceiptVerifyResult {
  if (!receipt.openId) {
    return { ok: false, reason: "missing_open_id" };
  }
  const openId = normalizeOpenId(receipt.openId);
  const row = rows.find((r) => r.id === openId);
  if (!row) {
    return { ok: false, reason: "open_id_not_in_program" };
  }
  if (
    receipt.writeback.architectureId &&
    normalizeOpenId(receipt.writeback.architectureId) !== openId
  ) {
    return { ok: false, reason: "writeback_mismatch" };
  }
  if (receipt.ci.blocking || !receipt.ci.acceptReady) {
    return { ok: false, reason: "ci_not_ready" };
  }
  return { ok: true, openId };
}
