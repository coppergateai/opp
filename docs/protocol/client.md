# `@opp/client` (P-030 / P-060)

First-party HTTP SDK for the hosted OPP API. Community / self-host **$0**.

Package README: [`packages/opp-client/README.md`](../../packages/opp-client/README.md).

```ts
import { OppClient } from "@opp/client";

const client = new OppClient(); // or OPP_API_URL / baseUrl

await client.health();
await client.openApi();
await client.listSchemas();
await client.parseProgram({ markdown, limit: 50, offset: 0 });
await client.evaluateSpend({ markdown, openId: null }); // invent → deny
await client.verifyReceipt({ markdown, receipt });
```

Default base URL: `http://127.0.0.1:8790`. Hosted: `OPP_API_URL=https://api.opp.coppergate.ai` (A-020).

Errors throw `OppClientError` with stable `code` / `status` matching `{ error, message }` from [hosted-api.md](./hosted-api.md).

Coppergate’s `@coppergate/opp-client` remains a thin runtime adapter; new integrations should prefer `@opp/client`.
