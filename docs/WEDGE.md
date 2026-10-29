# OPP wedge (locked)

**Author an Open Program → bind a runtime → spend one Open ID → verify a Ship Receipt (Open ID, spend, fitness/CI, writeback) — then prove invent-without-program is rejected.**

## Onboarding steps (TTFV)

1. Author or import an Open Program (`OPEN_PROGRAM.md` table with Open/Done IDs).
2. Bind a runtime (Coppergate first — `architectureRepo` + `architecturePaths`).
3. Reserve/spend a single Open ID under Spend License.
4. Accept produces a Ship Receipt; verify via `@opp/verify` or `POST /v1/receipts/verify`.
5. Attempt invent without Open ID → deny.

## Explicitly not the wedge

- Agent chat UI, Survivor tournament clone, marketplace, paid SKU UI.
- ACPP identity/authz (that stays in ACPP).
- Coppergate D13 product-event signal adapters.

## First runtime

**Coppergate** — Open Program Runtime / Survivor selection. See [`coppergate/docs/OPP.md`](../../coppergate/docs/OPP.md).
