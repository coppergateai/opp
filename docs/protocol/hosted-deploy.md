# Hosted API deploy (A-020)

Community URL: **https://api.opp.coppergate.ai** ($0).

Landing (`opp`) and API (`opp-api`) are **separate** Vercel projects on the same GitHub repo.

| Project | Config file | Domain |
| --- | --- | --- |
| `opp` | `vercel.json` | https://opp.coppergate.ai |
| `opp-api` | `vercel.api.json` (swap in as `vercel.json` for CLI deploys) | https://api.opp.coppergate.ai |

## CLI deploy (API)

```bash
# from repo root, with .vercel linked to opp-api
cp vercel.json vercel.web.json
cp vercel.api.json vercel.json
vercel --prod --yes --scope muhtalip
cp vercel.web.json vercel.json
```

Build compiles `@opp/schema` → `@opp/parse` → `@opp/verify` → `@opp/api`, then `node scripts/bundle-api.mjs` → `api/index.js`. Rewrite `/(.*) → /api` so one bundled Web Handler serves all routes (avoids Vercel catch-all / workspace cold-start issues).
