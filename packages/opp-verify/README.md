# `@opp/verify`

Spend License evaluation and Ship Receipt verification against an Open Program.

## Install (workspace)

```bash
pnpm add @opp/verify --filter <your-package>
```

## Spend License

Only **Open** rows may be reserved/spent. Invent without an Open ID is denied.

```ts
import { evaluateSpendLicense } from "@opp/verify";
import { parseOpenProgramMarkdown } from "@opp/parse";

const rows = parseOpenProgramMarkdown(markdown);

evaluateSpendLicense(rows, null);
// → { allowed: false, reason: "invent_without_program" }

evaluateSpendLicense(rows, "P-060");
// → { allowed: true, openId: "P-060", reason: "open_id_match" }
// or not_open / unknown_open_id / invalid_open_id
```

## Ship Receipt verify

```ts
import { verifyShipReceipt } from "@opp/verify";

verifyShipReceipt(rows, {
  openId: "P-060",
  writeback: { architectureId: "P-060" },
  ci: { blocking: false, acceptReady: true },
});
// → { ok: true, openId: "P-060" }
// or missing_open_id / open_id_not_in_program / writeback_mismatch / ci_not_ready
```

## Related

- Parse markdown first: [`@opp/parse`](../opp-parse/README.md)
- HTTP: [`@opp/client`](../opp-client/README.md) → `evaluateSpend` / `verifyReceipt`
- Protocol: [`docs/protocol/open-program.md`](../../docs/protocol/open-program.md)
