# Changelog

## [Unreleased]

### Features

- RT-040: Production Coppergate (`OPP_API_URL`) verifies Ship Receipts against Community OPP.
- P-090: Landing surfaces Accept→verify + generic runtime DX links.
- A-050: Soft per-IP rate limit (120/min) on Community API; 429 `rate_limited`.
- P-080: Generic runtime adapter doc (`docs/protocol/generic-runtime.md`).
- RT-030: Coppergate `OPP_API_URL` ops + `pnpm smoke:opp-hosted`.
- AG-020: CI asserts every Done Open ID has `docs/ship-receipts/{ID}.md`.
- A-040: Community API CORS allowlist (`opp.coppergate.ai` + localhost) + OPTIONS.
- P-070: `@opp/schema` package README.
- RT-020: Coppergate Accept projects Ship Receipt and verifies via OPP when `OPP_API_URL` is set.
- RT-010: Accept→OPP verify runbook (`OPP_API_URL`, projection, hosted verify).
- P-060: Package READMEs for `@opp/client`, `@opp/parse`, `@opp/verify`.
- P-050: CI smokes live Community API (`pnpm smoke:hosted-api`).
- A-030: Hosted API rejects non-JSON POST (415) and bodies over 256 KiB (413).
- AG-010: CI `check` runs `pnpm prove:coppergate-runtime`.
- P-040: Landing + docs surface OpenAPI, `@opp/client`, and `api.opp.coppergate.ai` (Phase 1 complete).
- A-020: Community hosted API at `https://api.opp.coppergate.ai` (Vercel serverless Fetch handler). $0 only.
- P-030: First-party `@opp/client` SDK (health, OpenAPI, schemas, parse, spend, verify).
- A-010: Hosted API OpenAPI 3.1 (`GET /v1/openapi.json`), consistent `{ error, message }` errors, optional parse `limit`/`offset` pagination. Community $0.
- P-020: Coppergate runtime adapter docs + prove script (`pnpm prove:coppergate-runtime`) — bind → invent deny → spend → Accept receipt project → OPP verify.
- P-010: Portable JSON Schemas for Open Program + Ship Receipt (`GET /v1/schemas`, `GET /v1/schemas/{schemaId}`) in `@opp/schema`.
- W-001: OPP scaffold — Open Program parse, Spend License evaluate, Ship Receipt verify, HTTP API, wedge demo. Community $0 only.
