# Machine-readable schemas (P-010)

OPP publishes portable JSON Schemas for the Open Program document and Ship Receipt verify body. Markdown remains the program source of truth; these schemas describe the JSON view for validators and SDK generators.

## Bundle

Version **0.1.0** lives in `@opp/schema`:

```text
packages/opp-schema/protocol/v0.1.0/
  manifest.json
  open-program.schema.json
  ship-receipt.schema.json
```

| Method | Path | Description |
| --- | --- | --- |
| GET | `/v1/schemas` | Manifest with schema ids |
| GET | `/v1/schemas/{schemaId}` | One JSON Schema (`open-program` \| `ship-receipt`) |

```bash
curl -sS http://127.0.0.1:8790/v1/schemas | jq .
curl -sS http://127.0.0.1:8790/v1/schemas/ship-receipt | jq .title
```

Import from the package:

```ts
import { loadProtocolManifest, loadProtocolSchema } from "@opp/schema";
```

OpenAPI for the full hosted surface: [`hosted-api.md`](./hosted-api.md) (`GET /v1/openapi.json`, A-010).
