# Hosted API deploy (A-020)

Community URL: **https://api.opp.coppergate.ai** ($0).

Landing (`opp`) and API (`opp-api`) are **separate** Vercel projects on the same GitHub repo.

| Project | Config file | Domain | Git auto-deploy |
| --- | --- | --- | --- |
| `opp` | `vercel.json` (= `vercel.web.json`) | https://opp.coppergate.ai | Connected |
| `opp-api` | `vercel.api.json` (swap in as `vercel.json` for CLI deploys) | https://api.opp.coppergate.ai | **Disconnected** — CLI only |

Do **not** connect Git to `opp-api`. A push-triggered build uses root `vercel.json` (landing) and overwrites production with static HTML (`/health` → 404).

## CLI deploy (API)

```bash
# from repo root, with .vercel linked to opp-api
cp vercel.json vercel.web.json   # backup if needed
cp vercel.api.json vercel.json
vercel link --yes --scope muhtalip --project opp-api
vercel --prod --yes --scope muhtalip
cp vercel.web.json vercel.json
vercel link --yes --scope muhtalip --project opp   # restore landing link for local ops
```

Build compiles `@opp/schema` → `@opp/parse` → `@opp/verify` → `@opp/api`, then `node scripts/bundle-api.mjs` → `api/index.js`. Rewrite `/(.*) → /api` so one bundled Web Handler serves all routes (avoids Vercel catch-all / workspace cold-start issues).
