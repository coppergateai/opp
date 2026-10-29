# Coppergate runtime prove (P-020)

Proves the locked wedge against Coppergate’s bind + Accept receipt shape:

1. Bind `architectureRepo=coppergateai/opp` + `architecturePaths=docs/OPEN_PROGRAM.md`
2. Invent without Open ID → deny
3. Spend Open `P-020` → allow
4. Project Coppergate Ship Receipt → OPP verify → ok

```bash
# from repo root
pnpm --filter @opp/example-coppergate-runtime-prove prove

# optional HTTP (start API first, or rely on test harness)
OPP_API_URL=http://127.0.0.1:8790 pnpm --filter @opp/example-coppergate-runtime-prove prove
```

Docs: [`../../docs/protocol/coppergate-runtime.md`](../../docs/protocol/coppergate-runtime.md)
