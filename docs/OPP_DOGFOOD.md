# OPP dogfood

Coppergate is the **factory**. This repo is the **product**.

```bash
ARCHITECTURE_REPO=coppergateai/opp
ARCHITECTURE_PATHS=docs/OPEN_PROGRAM.md
```

Bind via Coppergate project Configuration → Open Program bind (P-105). Validate Open IDs before enabling maintainer spend.

Runtime adapter + prove (P-020): [`protocol/coppergate-runtime.md`](./protocol/coppergate-runtime.md)

```bash
pnpm install
pnpm test
pnpm prove:coppergate-runtime
pnpm --filter @opp/example-wedge-verify demo
```
