# Accept → OPP verify runbook (RT-010)

Operator runbook for Coppergate Accept shipping a Ship Receipt that OPP can verify over HTTP. Community **$0**.

Coppergate consumer overview: [`coppergate/docs/OPP.md`](../../../coppergate/docs/OPP.md). Projection details: [`coppergate-runtime.md`](./coppergate-runtime.md).

## Env

| Variable | Default | Production |
| --- | --- | --- |
| `OPP_API_URL` | `http://127.0.0.1:8790` | `https://api.opp.coppergate.ai` |

Used by:

- `@coppergate/opp-client` (factory runtime)
- `@opp/client` (first-party SDK)
- `pnpm prove:coppergate-runtime` / `pnpm smoke:hosted-api`

## Sequence

```
Bind Open Program → Spend Open ID → Accept (buildShipReceipt)
  → projectCoppergateReceiptToOpp → POST /v1/receipts/verify
```

### 1. Bind

In Coppergate project Configuration → Open Program bind:

| Field | Value |
| --- | --- |
| `architectureRepo` | `coppergateai/opp` (or your program repo) |
| `architecturePaths` | `docs/OPEN_PROGRAM.md` |

### 2. Spend

Arena / maintainer spend must pass Spend License (`open_id_match`). Invent without Open ID → `invent_without_program`.

Local:

```ts
import { OppClient } from "@coppergate/opp-client"; // or @opp/client

const opp = new OppClient(); // reads OPP_API_URL
await opp.evaluateSpend({ markdown, openId: "RT-010" });
```

### 3. Accept → Ship Receipt

Coppergate `buildShipReceipt` emits runtime-local fields (`taskId`, `acceptedBy`, `prUrl`, …). Keep them in the factory artifact; **do not** send them raw to OPP.

### 4. Project → portable body

Use `projectCoppergateReceiptToOpp` (see `examples/coppergate-runtime-prove/src/receipt-project.ts`) or equivalent:

| Kept for OPP | Dropped (runtime-local) |
| --- | --- |
| `kind`, `openId`, `title`, `spendMicros`, `fitnessScore`, `ci`, `writeback`, `acceptedAt`, `protocolVersion` | `taskId`, `runId`, `efficiencyScore`, `winnerProfileKey`, `humanTouches`, `prUrl`, `prNumber`, `acceptedBy` |

CI gate for verify: `ci.blocking === false` and `ci.acceptReady === true`.

### 5. Verify

```bash
export OPP_API_URL=https://api.opp.coppergate.ai
```

```ts
await opp.verifyReceipt({ markdown, receipt: portableBody });
// → { ok: true, openId: "RT-010" }
```

HTTP equivalent: `POST $OPP_API_URL/v1/receipts/verify` with `{ markdown, receipt }` and `Content-Type: application/json`.

## Prove locally

```bash
# in-process parse/spend/verify (no network)
pnpm prove:coppergate-runtime

# against hosted Community API
OPP_API_URL=https://api.opp.coppergate.ai pnpm prove:coppergate-runtime

# health + invent-deny + spend smoke
pnpm smoke:hosted-api
```

## Failure cheat sheet

| Symptom | Likely cause |
| --- | --- |
| `invent_without_program` | Missing / null Open ID on spend |
| `not_open` / `unknown_open_id` | ID not Open in bound markdown |
| `ci_not_ready` | `blocking` or `!acceptReady` on receipt |
| `writeback_mismatch` | `writeback.architectureId` ≠ `openId` |
| `health` 404 / HTML | API domain pointed at landing project — see [`hosted-deploy.md`](./hosted-deploy.md) |

## Factory follow-up

Wire `@coppergate/opp-client.verifyReceipt` into the Accept path after projection (product change in `coppergateai/coppergate`). This runbook is the contract; the factory PR is separate.
