import type { ShipReceiptVerifyBody } from "@opp/schema";
import { OPP_PROTOCOL_VERSION } from "@opp/schema";

/**
 * Coppergate Accept artifact shape (subset) — see coppergate `buildShipReceipt`.
 * Extra fields (taskId, acceptedBy, prUrl, …) are runtime-local and stripped for OPP verify.
 */
export type CoppergateShipReceiptLike = {
  kind: "ship_receipt";
  openId: string | null;
  title: string;
  spendMicros: number;
  fitnessScore: number | null;
  ci: ShipReceiptVerifyBody["ci"];
  writeback: ShipReceiptVerifyBody["writeback"];
  acceptedAt: string;
  taskId?: string;
  runId?: string | null;
  efficiencyScore?: number | null;
  winnerProfileKey?: string | null;
  humanTouches?: number;
  prUrl?: string | null;
  prNumber?: number | null;
  acceptedBy?: string;
};

/** Project a Coppergate Ship Receipt into the portable OPP verify body. */
export function projectCoppergateReceiptToOpp(
  receipt: CoppergateShipReceiptLike,
): ShipReceiptVerifyBody {
  if (receipt.kind !== "ship_receipt") {
    throw new Error("expected_kind_ship_receipt");
  }
  return {
    kind: "ship_receipt",
    protocolVersion: OPP_PROTOCOL_VERSION,
    openId: receipt.openId,
    title: receipt.title,
    spendMicros: receipt.spendMicros,
    fitnessScore: receipt.fitnessScore,
    ci: {
      acceptReady: receipt.ci.acceptReady,
      blocking: receipt.ci.blocking,
      passed: receipt.ci.passed,
      checkCount: receipt.ci.checkCount,
    },
    writeback: {
      architectureId: receipt.writeback.architectureId,
      note: receipt.writeback.note,
    },
    acceptedAt: receipt.acceptedAt,
  };
}

/** Synthetic Accept receipt as Coppergate would emit after spending an Open ID. */
export function buildCoppergateLikeReceipt(input: {
  openId: string;
  title: string;
  spendMicros?: number;
  acceptedAt?: string;
}): CoppergateShipReceiptLike {
  return {
    kind: "ship_receipt",
    openId: input.openId,
    title: input.title,
    taskId: "task_prove_p020",
    runId: "run_prove_p020",
    spendMicros: input.spendMicros ?? 420_000,
    fitnessScore: 1,
    efficiencyScore: 0.9,
    ci: {
      acceptReady: true,
      blocking: false,
      passed: true,
      checkCount: 3,
    },
    winnerProfileKey: "cursor:composer",
    humanTouches: 0,
    prUrl: "https://github.com/coppergateai/opp/pull/0",
    prNumber: 0,
    writeback: {
      architectureId: input.openId,
      note: `Open Program ${input.openId} → Done on Accept`,
    },
    acceptedAt: input.acceptedAt ?? new Date().toISOString(),
    acceptedBy: "system:maintainer-auto",
  };
}
