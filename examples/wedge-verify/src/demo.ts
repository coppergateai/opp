import { parseOpenProgramMarkdown } from "@opp/parse";
import { evaluateSpendLicense, verifyShipReceipt } from "@opp/verify";

const markdown = `| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | W-001 | Repo scaffold | bootstrap |
`;

const rows = parseOpenProgramMarkdown(markdown);
const invent = evaluateSpendLicense(rows, null);
const spend = evaluateSpendLicense(rows, "W-001");
const receipt = verifyShipReceipt(rows, {
  kind: "ship_receipt",
  openId: "W-001",
  title: "W-001: Repo scaffold",
  spendMicros: 0,
  fitnessScore: 1,
  ci: { acceptReady: true, blocking: false, passed: true, checkCount: 1 },
  writeback: { architectureId: "W-001", note: "Open Program W-001 → Done" },
  acceptedAt: new Date().toISOString(),
});

const ok =
  invent.allowed === false &&
  invent.reason === "invent_without_program" &&
  spend.allowed === true &&
  receipt.ok === true;

console.log(
  JSON.stringify(
    {
      ok,
      invent,
      spend,
      receipt,
    },
    null,
    2,
  ),
);

if (!ok) process.exit(1);
