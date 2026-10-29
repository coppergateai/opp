# OPP — Open Program Protocol

**Autonomy under contract. Only what’s on the program ships.**

Portable Open Program contract + Spend License + Ship Receipt verification.  
Second external Coppergate factory product ([D16](../coppergate-architecture/docs/DECISIONS.md)).

| Package | Role |
| --- | --- |
| [`@opp/schema`](./packages/opp-schema/README.md) | Open ID / program / receipt types + JSON Schemas (`/v1/schemas`) |
| [`@opp/parse`](./packages/opp-parse/README.md) | Markdown → program rows |
| [`@opp/verify`](./packages/opp-verify/README.md) | Spend License + receipt verify |
| [`@opp/client`](./packages/opp-client/README.md) | First-party HTTP SDK ([docs](./docs/protocol/client.md)) |
| `@opp/api` | HTTP parse / spend / verify + OpenAPI (`/v1/openapi.json`) |
| `@opp/web` | Static landing ([opp.coppergate.ai](https://opp.coppergate.ai)) |

**Live:** [opp.coppergate.ai](https://opp.coppergate.ai) · API [api.opp.coppergate.ai](https://api.opp.coppergate.ai) · [OpenAPI](https://api.opp.coppergate.ai/v1/openapi.json)

## Quickstart

```bash
pnpm install
pnpm test
pnpm prove:coppergate-runtime
pnpm --filter @opp/example-wedge-verify demo
```

Landing (local):

```bash
pnpm --filter @opp/web build
pnpm --filter @opp/web dev
```

## Dogfood

[`docs/OPP_DOGFOOD.md`](./docs/OPP_DOGFOOD.md) · Wedge [`docs/WEDGE.md`](./docs/WEDGE.md)

Community / self-host **$0** only — no paid pricing UI.
