# `@opp/schema`

Portable OPP types, JSON Schemas, and hosted OpenAPI document. Community / self-host **$0**.

Protocol version: **`0.1.0`** (`OPP_PROTOCOL_VERSION`).

## Install (workspace)

```bash
pnpm add @opp/schema --filter <your-package>
```

## Types

```ts
import {
  OPP_PROTOCOL_VERSION,
  OPEN_ID_PATTERN,
  normalizeOpenId,
  isOpenId,
  type OpenProgramRow,
  type OpenProgramDocument,
  type ShipReceiptVerifyBody,
} from "@opp/schema";
```

Open IDs match `(P|W|A|S|AG|RT|SEC)-\d{2,4}`.

## JSON Schemas (P-010)

```ts
import {
  loadProtocolManifest,
  loadProtocolSchema,
  loadHostedOpenApi,
} from "@opp/schema";

const manifest = loadProtocolManifest();
// ids: open-program | ship-receipt

const openProgram = loadProtocolSchema("open-program");
const shipReceipt = loadProtocolSchema("ship-receipt");
const openapi = loadHostedOpenApi();
```

Static files also export via package paths:

- `@opp/schema/protocol/v0.1.0/*`
- `@opp/schema/openapi/opp-hosted-v1.openapi.json`

HTTP: `GET https://api.opp.coppergate.ai/v1/schemas` · `/v1/schemas/{id}` · `/v1/openapi.json`

## Related

- Parse markdown: [`@opp/parse`](../opp-parse/README.md)
- Spend / verify: [`@opp/verify`](../opp-verify/README.md)
- HTTP client: [`@opp/client`](../opp-client/README.md)
- Protocol docs: [`docs/protocol/schemas.md`](../../docs/protocol/schemas.md)
