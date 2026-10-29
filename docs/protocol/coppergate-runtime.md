# Coppergate as first OPP runtime (P-020)

Coppergate is the Open Program **selection runtime**. OPP is the portable **contract + verify** layer. This document locks the bind → spend → Accept → verify round-trip.

## Bind (Coppergate UI — P-105)

Project **Configuration → Open Program bind**:

| Field | Value |
| --- | --- |
| `architectureRepo` | `coppergateai/opp` |
| `architecturePaths` | `docs/OPEN_PROGRAM.md` |

Validate Open IDs in-product before enabling maintainer spend. Arena Spend License then refuses invent-without-program.

## Accept → Ship Receipt (Coppergate)

On Accept, Coppergate emits a `ship_receipt` artifact (`buildShipReceipt`) including runtime-local fields (`taskId`, `acceptedBy`, `prUrl`, …).

## Verify (OPP)

Project to the portable body (`ShipReceiptVerifyBody`) and call `@opp/verify` or `POST /v1/receipts/verify`:

| Kept | Dropped (runtime-local) |
| --- | --- |
| `kind`, `openId`, `title`, `spendMicros`, `fitnessScore`, `ci`, `writeback`, `acceptedAt`, `protocolVersion` | `taskId`, `runId`, `efficiencyScore`, `winnerProfileKey`, `humanTouches`, `prUrl`, `prNumber`, `acceptedBy` |

Coppergate HTTP client: `@coppergate/opp-client` → `OPP_API_URL` (default `http://127.0.0.1:8790`).

## Prove script

```bash
pnpm prove:coppergate-runtime
# or
pnpm --filter @opp/example-coppergate-runtime-prove prove
```

Optional live API:

```bash
pnpm --filter @opp/api dev &
OPP_API_URL=http://127.0.0.1:8790 pnpm prove:coppergate-runtime
```

The script:

1. Parses the bound `docs/OPEN_PROGRAM.md`
2. Denies invent without Open ID
3. Allows spend on fixture Open `P-020`
4. Builds a Coppergate-like Accept receipt, projects it, verifies

JSON Schema for the portable body: [`schemas.md`](./schemas.md) (`ship-receipt`).
