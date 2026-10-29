/**
 * P-020 — Prove Coppergate runtime bind → Spend License → Ship Receipt → OPP verify.
 *
 * Default: in-process @opp/parse + @opp/verify (no server).
 * Optional HTTP round-trip: OPP_API_URL=http://127.0.0.1:8790 (Coppergate @coppergate/opp-client shape).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseOpenProgramMarkdown, summarizeProgram } from "@opp/parse";
import { OPP_PROTOCOL_VERSION } from "@opp/schema";
import { evaluateSpendLicense, verifyShipReceipt } from "@opp/verify";
import {
  buildCoppergateLikeReceipt,
  projectCoppergateReceiptToOpp,
} from "./receipt-project.js";

export const BIND = {
  architectureRepo: "coppergateai/opp",
  architecturePaths: "docs/OPEN_PROGRAM.md",
} as const;

/** Fixture program — stays Open so the prove script remains green after writeback. */
export const FIXTURE_PROGRAM = `# Open Program fixture (P-020 prove)

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | P-020 | Coppergate runtime adapter docs + prove script | bind → verify |
| Done | W-001 | Repo scaffold | already shipped |
`;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

async function evaluateViaHttp(
  baseUrl: string,
  markdown: string,
  openId: string | null,
): Promise<{ allowed: boolean; reason?: string; openId?: string }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/spend/evaluate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ markdown, openId }),
  });
  const body = (await res.json()) as {
    decision: { allowed: boolean; reason?: string; openId?: string };
  };
  return body.decision;
}

async function verifyViaHttp(
  baseUrl: string,
  markdown: string,
  receipt: ReturnType<typeof projectCoppergateReceiptToOpp>,
): Promise<{ ok: boolean; reason?: string; openId?: string }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/receipts/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ markdown, receipt }),
  });
  const body = (await res.json()) as {
    result: { ok: boolean; reason?: string; openId?: string };
  };
  return body.result;
}

export async function runProve(options?: {
  apiUrl?: string | null;
}): Promise<{
  ok: boolean;
  bind: typeof BIND;
  protocolVersion: string;
  programSummary: ReturnType<typeof summarizeProgram>;
  invent: { allowed: boolean; reason?: string };
  spend: { allowed: boolean; reason?: string; openId?: string };
  receipt: { ok: boolean; reason?: string; openId?: string };
  mode: "in-process" | "http";
}> {
  const realProgram = readFileSync(
    resolve(repoRoot, BIND.architecturePaths),
    "utf8",
  );
  const realRows = parseOpenProgramMarkdown(realProgram);
  if (realRows.length === 0) {
    throw new Error("bound_open_program_empty");
  }

  const rows = parseOpenProgramMarkdown(FIXTURE_PROGRAM);
  const inventLocal = evaluateSpendLicense(rows, null);
  const spendLocal = evaluateSpendLicense(rows, "P-020");
  const coppergateReceipt = buildCoppergateLikeReceipt({
    openId: "P-020",
    title: "P-020: Coppergate runtime adapter docs + prove script",
  });
  const oppBody = projectCoppergateReceiptToOpp(coppergateReceipt);
  const receiptLocal = verifyShipReceipt(rows, oppBody);

  const apiUrl = options?.apiUrl ?? process.env.OPP_API_URL ?? null;
  let invent = inventLocal;
  let spend = spendLocal;
  let receipt = receiptLocal;
  let mode: "in-process" | "http" = "in-process";

  if (apiUrl) {
    mode = "http";
    invent = await evaluateViaHttp(apiUrl, FIXTURE_PROGRAM, null);
    spend = await evaluateViaHttp(apiUrl, FIXTURE_PROGRAM, "P-020");
    receipt = await verifyViaHttp(apiUrl, FIXTURE_PROGRAM, oppBody);
  }

  const ok =
    invent.allowed === false &&
    invent.reason === "invent_without_program" &&
    spend.allowed === true &&
    spend.openId === "P-020" &&
    receipt.ok === true &&
    receipt.openId === "P-020" &&
    realRows.some((r) => r.id === "P-020" || r.id === "W-001");

  return {
    ok,
    bind: BIND,
    protocolVersion: OPP_PROTOCOL_VERSION,
    programSummary: summarizeProgram(realRows),
    invent: { allowed: invent.allowed, reason: invent.reason },
    spend: {
      allowed: spend.allowed,
      reason: "reason" in spend ? spend.reason : undefined,
      openId: spend.openId,
    },
    receipt: {
      ok: receipt.ok,
      reason: "reason" in receipt ? receipt.reason : undefined,
      openId: receipt.openId,
    },
    mode,
  };
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const result = await runProve();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}
