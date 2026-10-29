# Hosted API (A-010)

Community / self-host **$0** only — no paid SKU.

**Hosted:** `https://api.opp.coppergate.ai` (A-020)  
**Local:** `http://127.0.0.1:8790` (`pnpm --filter @opp/api dev`)

## Machine-readable contract

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health`, `/ready` | Liveness / readiness |
| GET | `/v1/openapi.json` | OpenAPI **3.1** (`info.version` = hosted API `1.0.0`) |
| GET | `/v1/schemas` | Portable protocol schema manifest (P-010) |
| GET | `/v1/schemas/{schemaId}` | `open-program` \| `ship-receipt` |
| POST | `/v1/programs/parse` | Parse markdown → rows (+ optional pagination) |
| POST | `/v1/spend/evaluate` | Spend License |
| POST | `/v1/receipts/verify` | Ship Receipt verify |

Source: `packages/opp-schema/openapi/opp-hosted-v1.openapi.json` via `loadHostedOpenApi()`.

TypeScript client: [`client.md`](./client.md) (`@opp/client`).

```bash
curl -sS http://127.0.0.1:8790/v1/openapi.json | jq .info.version
```

## Errors

All error responses use:

```json
{ "error": "markdown_required", "message": "Body field `markdown` (string) is required" }
```

Optional `details` may carry structured context. `error` is the stable machine code (unchanged from earlier string-only responses).

### Request limits (A-030)

| Rule | Status | Code |
| --- | --- | --- |
| POST without `Content-Type: application/json` | 415 | `unsupported_media_type` |
| Body larger than **256 KiB** | 413 | `payload_too_large` |

### CORS (A-040)

Browser calls from an `Origin` on the allowlist get `Access-Control-Allow-Origin` (echoed origin) + `Vary: Origin`. Others get no ACAO (server-to-server / curl unchanged).

Allowed: `https://opp.coppergate.ai`, `http://localhost:{3000,4173,5173}`, `http://127.0.0.1:{3000,4173,5173}`.

`OPTIONS` preflight returns **204** with the same allowlist rules.

## Live smoke (P-050)

```bash
pnpm smoke:hosted-api
# or OPP_API_URL=http://127.0.0.1:8790 pnpm smoke:hosted-api
```

## Pagination

`POST /v1/programs/parse` accepts optional `limit` (1–500) and `offset` (≥0). When `limit` is set, the response includes:

```json
{ "page": { "offset": 0, "limit": 50, "total": 120, "hasMore": true } }
```

`summary` always reflects the **full** parse; only `rows` is sliced.
