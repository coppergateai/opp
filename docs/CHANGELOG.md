# Changelog

## [Unreleased]

### Features

- P-030: First-party `@opp/client` SDK (health, OpenAPI, schemas, parse, spend, verify). Phase 1 Open Program opened (A-020/AG-010/P-040 still Open).
- A-010: Hosted API OpenAPI 3.1 (`GET /v1/openapi.json`), consistent `{ error, message }` errors, optional parse `limit`/`offset` pagination. Community $0.
- P-020: Coppergate runtime adapter docs + prove script (`pnpm prove:coppergate-runtime`) — bind → invent deny → spend → Accept receipt project → OPP verify.
- P-010: Portable JSON Schemas for Open Program + Ship Receipt (`GET /v1/schemas`, `GET /v1/schemas/{schemaId}`) in `@opp/schema`.
- W-001: OPP scaffold — Open Program parse, Spend License evaluate, Ship Receipt verify, HTTP API, wedge demo. Community $0 only.
