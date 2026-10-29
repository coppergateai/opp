# Generic runtime adapter (P-080)

OPP is portable: any coding-agent runtime can bind an Open Program, spend one Open ID, Accept with a Ship Receipt, and verify — without Coppergate / Survivor.

Coppergate-specific path: [`coppergate-runtime.md`](./coppergate-runtime.md) · runbook: [`accept-verify-runbook.md`](./accept-verify-runbook.md).

## Contract

```
Author OPEN_PROGRAM.md → spend Open ID → Accept → project receipt → verify
```

Invent without Open ID must be denied (`invent_without_program`).

## Project a runtime receipt

Drop runtime-local fields before OPP verify. Keep the portable body:

| Kept | Drop (examples) |
| --- | --- |
| `kind`, `openId`, `title`, `spendMicros`, `fitnessScore`, `ci`, `writeback`, `acceptedAt`, `protocolVersion` | task ids, actor, PR URLs, profile keys, human-touch counters |

Shape: `ShipReceiptVerifyBody` in `@opp/schema` (`GET /v1/schemas/ship-receipt`).

```ts
import { OppClient } from "@opp/client";

const client = new OppClient({
  baseUrl: process.env.OPP_API_URL ?? "https://api.opp.coppergate.ai",
});

await client.evaluateSpend({ markdown, openId: null }); // deny invent
await client.evaluateSpend({ markdown, openId: "P-080" });

await client.verifyReceipt({
  markdown,
  receipt: {
    kind: "ship_receipt",
    protocolVersion: "0.1.0",
    openId: "P-080",
    title: "…",
    spendMicros: 0,
    fitnessScore: null,
    ci: { acceptReady: true, blocking: false, passed: true, checkCount: 0 },
    writeback: { architectureId: "P-080", note: "Done on Accept" },
    acceptedAt: new Date().toISOString(),
  },
});
```

In-process (no HTTP): `@opp/parse` + `@opp/verify`.

## CI gate on receipt

Verify requires `ci.blocking === false` and `ci.acceptReady === true`. Map your runtime’s merge-readiness into those two flags.

## Non-goals

Do not re-implement Survivor tournaments, Arena fan-out, or Coppergate maintainer ticks here — those stay in the How layer.
