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

## Phase 2 — Harden & live dogfood (spend next — RT-010)

Keep the Community API honest under light abuse and prove it from CI. Community **$0** only.

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Done | P-050 | Live Community API smoke in CI | health + invent-deny against `api.opp.coppergate.ai` |
| Done | A-030 | Hosted API body size + content-type limits | abuse floor; no paid SKU |
| Done | P-060 | Package READMEs for `@opp/client` / parse / verify | SDK consumer DX |
| Open | RT-010 | Coppergate `OPP_API_URL` Accept→verify runbook | docs + cross-link; factory follow-up |

## Phase 1 — Dogfood / DX (complete)

Close the wedge for external runtimes: first-party client, hosted Community API, CI prove, landing DX. Community **$0** only.

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Done | P-030 | First-party `@opp/client` SDK | health, parse, spend, verify, schemas, openapi |
| Done | A-020 | Host Community API (Vercel serverless) | `api.opp.coppergate.ai`; $0 |
| Done | AG-010 | CI runs coppergate-runtime prove | `pnpm prove:coppergate-runtime` in `check` |
| Done | P-040 | Landing + docs link OpenAPI and `@opp/client` | DX surface on opp.coppergate.ai |

## Phase 0 — Scaffold (complete)

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Done | W-001 | Repo scaffold: pnpm monorepo, CI, LICENSE, README | schema + parse + verify + API + wedge demo |
| Done | P-010 | JSON schema export for Open Program + Ship Receipt | machine-readable under `/v1/schemas` |
| Done | P-020 | Coppergate runtime adapter docs + prove script | bind UI → OPP verify round-trip |
| Done | A-010 | Hosted API polish + OpenAPI | pagination/errors; Community $0 |

## Explicitly not Open IDs

Do not invent: chat app, agent marketplace, Survivor clone, paid hosted SKU UI, ACPP identity protocol, freestyle invent from PRODUCT.md.

## Acceptance (every Open ID)

1. Lands in `coppergateai/opp` with tests.
2. Preserves Spend License + receipt verify invariants.
3. User-visible changes update CHANGELOG when applicable.
4. PR title names the Open ID.
5. Writeback flips this row to **Done**.
6. Accept produces a Ship Receipt.
