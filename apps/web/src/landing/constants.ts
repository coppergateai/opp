export const SITE_URL = "https://opp.coppergate.ai";
export const API_URL = "https://api.opp.coppergate.ai";
export const GITHUB_REPO = "https://github.com/coppergateai/opp";
export const COPPERGATE_URL = "https://www.coppergate.ai";
export const ACPP_URL = "https://acpp.coppergate.ai";

export const DOCS = {
  product: `${GITHUB_REPO}/blob/main/PRODUCT.md`,
  wedge: `${GITHUB_REPO}/blob/main/docs/WEDGE.md`,
  openProgram: `${GITHUB_REPO}/blob/main/docs/OPEN_PROGRAM.md`,
  protocol: `${GITHUB_REPO}/blob/main/docs/protocol/open-program.md`,
  client: `${GITHUB_REPO}/blob/main/docs/protocol/client.md`,
  hostedApi: `${GITHUB_REPO}/blob/main/docs/protocol/hosted-api.md`,
  acceptVerify: `${GITHUB_REPO}/blob/main/docs/protocol/accept-verify-runbook.md`,
  genericRuntime: `${GITHUB_REPO}/blob/main/docs/protocol/generic-runtime.md`,
  coppergateRuntime: `${GITHUB_REPO}/blob/main/docs/protocol/coppergate-runtime.md`,
  dogfood: `${GITHUB_REPO}/blob/main/docs/OPP_DOGFOOD.md`,
  openapi: `${API_URL}/v1/openapi.json`,
  health: `${API_URL}/health`,
  license: `${GITHUB_REPO}/blob/main/LICENSE`,
  coppergateOpp: `${COPPERGATE_URL}/docs/OPP`,
} as const;

export const SITE_META = {
  title: "OPP — Open Program Protocol",
  description:
    "Portable program contracts and Ship Receipt verification. Agents invent only from Open IDs. Autonomy under contract.",
  tagline: "Autonomy under contract. Only what’s on the program ships.",
} as const;

export const PRINCIPLES = [
  {
    title: "Open ID ≠ freestyle invent",
    body: "Agents may invent only against Open rows on a living program. No Open ID means invent_without_program — freestyle autonomy is refused.",
    left: "Open ID",
    right: "freestyle",
  },
  {
    title: "Spend License ≠ unlimited reserve",
    body: "Each Arena reserve carries an Open ID. Caps and deny-by-default keep spend fail-closed when the contract is missing.",
    left: "license",
    right: "unlimited",
  },
  {
    title: "Ship Receipt ≠ chat transcript",
    body: "Accept writes Done plus spend, fitness/CI, and writeback — public-safe accounting, not a conversation log.",
    left: "receipt",
    right: "chat log",
  },
] as const;

export const SCENARIO = {
  kicker: "Contracted spend",
  title: "An agent invents only from Open IDs.",
  lead: "Bind an Open Program. Contenders may reserve only against Open rows. Invent without an Open ID is denied; Accept yields a verifiable Ship Receipt.",
  setting: {
    label: "Factory · coppergateai/opp",
    program: "OPEN_PROGRAM.md",
    openId: "P-030",
    outcome: "invent denied · spend allowed · receipt verified",
  },
  beats: [
    {
      who: "Program",
      what: "OPEN_PROGRAM.md lists spendable Open / Done rows with stable IDs — the only work agents may invent.",
    },
    {
      who: "Runtime",
      what: "Coppergate binds architectureRepo + OPEN_PROGRAM.md. Spend License gates every reserve.",
    },
    {
      who: "Invent",
      what: "An agent tries work with no Open ID. evaluateSpend returns invent_without_program.",
    },
    {
      who: "Spend",
      what: "Same agent reserves against P-030. Spend License allows; contenders race under the budget.",
    },
    {
      who: "Receipt",
      what: "Accept writes Done and a Ship Receipt — Open ID, spend, fitness/CI, writeback — then verifyReceipt succeeds.",
    },
  ],
} as const;

export type LayerStatus = "available" | "partial" | "conceptual";

export type ProtocolLayer = {
  id: string;
  num: string;
  name: string;
  summary: string;
  status: LayerStatus;
  statusLabel: string;
};

/** Honest status from PRODUCT / OPEN_PROGRAM — Phase 5 complete. */
export const PROTOCOL_LAYERS: readonly ProtocolLayer[] = [
  {
    id: "parse",
    num: "01",
    name: "Parse",
    summary: "Read Open / Done rows and stable IDs from a living Open Program markdown file.",
    status: "available",
    statusLabel: "Available",
  },
  {
    id: "license",
    num: "02",
    name: "Spend License",
    summary: "Allow reserve only against Open IDs; invent_without_program when the contract is missing.",
    status: "available",
    statusLabel: "Available",
  },
  {
    id: "verify",
    num: "03",
    name: "Verify",
    summary: "POST /v1/receipts/verify and @opp/verify check Open ID, spend, fitness/CI, writeback.",
    status: "available",
    statusLabel: "Available",
  },
  {
    id: "runtime",
    num: "04",
    name: "Runtime bind",
    summary: "Coppergate binds architectureRepo + OPEN_PROGRAM.md; any runtime can honor the same contract.",
    status: "available",
    statusLabel: "Available",
  },
  {
    id: "accept",
    num: "05",
    name: "Factory Accept",
    summary: "Coppergate Accept projects a Ship Receipt and verifies via Community OPP when OPP_API_URL is set.",
    status: "available",
    statusLabel: "Available",
  },
] as const;

export const WEDGE_STEPS = [
  {
    n: "01",
    title: "Author an Open Program",
    detail: "Spendable Open / Done rows with stable IDs — the only work agents may invent.",
  },
  {
    n: "02",
    title: "Bind a runtime",
    detail: "Point Coppergate (or another runtime) at architectureRepo + OPEN_PROGRAM.md.",
  },
  {
    n: "03",
    title: "Spend one Open ID",
    detail: "Spend License allows reserve only against Open rows — invent-without-program is denied.",
  },
  {
    n: "04",
    title: "Verify a Ship Receipt",
    detail: "Accept yields Open ID, spend, fitness/CI, and writeback — public-safe and auditable.",
  },
] as const;

/** Interactive walkthrough tabs — mirrors WEDGE + invent deny. */
export const WALKTHROUGH_STEPS = [
  {
    title: "Author an Open Program",
    detail: "Spendable Open / Done rows with stable IDs — the only work agents may invent.",
    meta: "docs/OPEN_PROGRAM.md · Open | ID | …",
  },
  {
    title: "Bind a runtime",
    detail: "Point Coppergate (or another runtime) at architectureRepo + OPEN_PROGRAM.md.",
    meta: "ARCHITECTURE_REPO · ARCHITECTURE_PATHS",
  },
  {
    title: "Spend one Open ID",
    detail: "Spend License allows reserve only against Open rows.",
    meta: "POST /v1/spend/evaluate · openId: P-030",
  },
  {
    title: "Verify a Ship Receipt",
    detail: "Accept yields Open ID, spend, fitness/CI, and writeback.",
    meta: "POST /v1/receipts/verify",
  },
  {
    title: "Invent without Open ID → deny",
    detail: "No Open ID → invent_without_program. Freestyle work never ships.",
    meta: "POST /v1/spend/evaluate · openId: null",
  },
] as const;

export const STACK: ReadonlyArray<{
  layer: string;
  product: string;
  job: string;
  href: string;
  current?: boolean;
}> = [
  {
    layer: "Who",
    product: "ACPP",
    job: "Identity, grants, action receipts",
    href: ACPP_URL,
  },
  {
    layer: "What",
    product: "OPP",
    job: "Program contract + Ship Receipt verify",
    href: SITE_URL,
    current: true,
  },
  {
    layer: "How",
    product: "Coppergate",
    job: "Survivor selection / factory runtime",
    href: COPPERGATE_URL,
  },
];

export const SDK_SAMPLE = `import { OppClient } from "@opp/client";

const client = new OppClient({
  baseUrl: "https://api.opp.coppergate.ai",
});

// Invent without Open ID → deny
await client.evaluateSpend({ markdown, openId: null });
// { allowed: false, reason: "invent_without_program" }

// Spend a contracted Open ID → allow
await client.evaluateSpend({ markdown, openId: "P-030" });
// { allowed: true, openId: "P-030" }

await client.verifyReceipt({ markdown, receipt });
// { ok: true, openId: "P-030" }

await client.openApi(); // GET /v1/openapi.json`;
