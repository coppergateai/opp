# OPEN_PROGRAM — OPP

> **Status:** Spendable backlog for Coppergate Arena dogfood (`architectureRepo=coppergateai/opp`)  
> **Source of truth for vision:** [`../PRODUCT.md`](../PRODUCT.md) — agents invent only from **Open** rows below  
> **Format:** `| Open | ID | … |` until shipped, then `| Done | ID | … |`  
> **Pilot rules:** thin BYOK spend; N=1; Community / self-host **$0** only; deploy human-gated  
> **Parser IDs:** `(P|W|A|S|AG|RT|SEC)-\d{2,4}`  
> **Wedge:** [`WEDGE.md`](./WEDGE.md)

```bash
ARCHITECTURE_REPO=coppergateai/opp
ARCHITECTURE_PATHS=docs/OPEN_PROGRAM.md
```

## Phase 0 — Scaffold (spend next)

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Done | W-001 | Repo scaffold: pnpm monorepo, CI, LICENSE, README | schema + parse + verify + API + wedge demo |
| Done | P-010 | JSON schema export for Open Program + Ship Receipt | machine-readable under `/v1/schemas` |
| Open | P-020 | Coppergate runtime adapter docs + prove script | bind UI → OPP verify round-trip |
| Open | A-010 | Hosted API polish + OpenAPI | pagination/errors; Community $0 |

## Explicitly not Open IDs

Do not invent: chat app, agent marketplace, Survivor clone, paid hosted SKU UI, ACPP identity protocol, freestyle invent from PRODUCT.md.

## Acceptance (every Open ID)

1. Lands in `coppergateai/opp` with tests.
2. Preserves Spend License + receipt verify invariants.
3. User-visible changes update CHANGELOG when applicable.
4. PR title names the Open ID.
5. Writeback flips this row to **Done**.
6. Accept produces a Ship Receipt.
