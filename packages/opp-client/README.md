# `@opp/client`

First-party HTTP SDK for the OPP Community API. Community / self-host **$0**.

Longer guide: [`docs/protocol/client.md`](../../docs/protocol/client.md).

## Install (workspace)

```bash
pnpm add @opp/client --filter <your-package>
```

Packages are private workspace modules today (`"private": true`). Prefer path/`workspace:*` until publish.

## Usage

```ts
import { OppClient, OppClientError } from "@opp/client";

const client = new OppClient({
  // defaults: process.env.OPP_API_URL ?? http://127.0.0.1:8790
  baseUrl: "https://api.opp.coppergate.ai",
});

await client.health();
await client.openApi();
await client.listSchemas();
await client.getSchema("open-program");

const parsed = await client.parseProgram({
  markdown: openProgramMd,
  limit: 50,
  offset: 0,
});

const invent = await client.evaluateSpend({
  markdown: openProgramMd,
  openId: null,
}); // → invent_without_program

const spend = await client.evaluateSpend({
  markdown: openProgramMd,
  openId: "P-060",
});

const verified = await client.verifyReceipt({
  markdown: openProgramMd,
  receipt: {
    openId: "P-060",
    writeback: { architectureId: "P-060" },
    ci: { blocking: false, acceptReady: true },
  },
});
```

Failures throw `OppClientError` with `code` / `status` aligned to hosted `{ error, message }`.

## Methods

| Method | Route |
| --- | --- |
| `health()` | `GET /health` |
| `openApi()` | `GET /v1/openapi.json` |
| `listSchemas()` / `getSchema(id)` | `GET /v1/schemas`… |
| `parseProgram` | `POST /v1/programs/parse` |
| `evaluateSpend` | `POST /v1/spend/evaluate` |
| `verifyReceipt` | `POST /v1/receipts/verify` |

## Related

- Local parse/verify without HTTP: [`@opp/parse`](../opp-parse/README.md), [`@opp/verify`](../opp-verify/README.md)
- Live API: https://api.opp.coppergate.ai
- OpenAPI: https://api.opp.coppergate.ai/v1/openapi.json
