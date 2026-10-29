# OPP — Open Program Protocol

**Autonomy under contract. Only what’s on the program ships.**

Portable Open Program contract + Spend License + Ship Receipt verification.  
Second external Coppergate factory product ([D16](../coppergate-architecture/docs/DECISIONS.md)).

| Package | Role |
| --- | --- |
| `@opp/schema` | Open ID / program / receipt types |
| `@opp/parse` | Markdown → program rows |
| `@opp/verify` | Spend License + receipt verify |
| `@opp/api` | HTTP parse / spend / verify |

## Quickstart

```bash
pnpm install
pnpm test
pnpm --filter @opp/example-wedge-verify demo
```

## Dogfood

[`docs/OPP_DOGFOOD.md`](./docs/OPP_DOGFOOD.md) · Wedge [`docs/WEDGE.md`](./docs/WEDGE.md)

Community / self-host **$0** only — no paid pricing UI.
