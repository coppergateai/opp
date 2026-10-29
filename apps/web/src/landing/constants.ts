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
  openapi: `${API_URL}/v1/openapi.json`,
  health: `${API_URL}/health`,
  dogfood: `${GITHUB_REPO}/blob/main/docs/OPP_DOGFOOD.md`,
  license: `${GITHUB_REPO}/blob/main/LICENSE`,
  coppergateOpp: `${COPPERGATE_URL}/docs/OPP`,
} as const;

export const SITE_META = {
  title: "OPP — Open Program Protocol",
  description:
    "Portable program contracts and Ship Receipt verification. Agents invent only from Open IDs. Autonomy under contract.",
  tagline: "Autonomy under contract. Only what’s on the program ships.",
} as const;

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
