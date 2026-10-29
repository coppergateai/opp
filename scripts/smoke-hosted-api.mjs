#!/usr/bin/env node
/**
 * P-050 — Smoke the live Community API (default https://api.opp.coppergate.ai).
 * Override with OPP_API_URL for staging.
 */
const base = (
  process.env.OPP_API_URL ?? "https://api.opp.coppergate.ai"
).replace(/\/$/, "");

const markdown = `| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | P-050 | Live API smoke | ci |
`;

async function main() {
  const healthRes = await fetch(`${base}/health`);
  if (!healthRes.ok) {
    throw new Error(`health_${healthRes.status}`);
  }
  const health = await healthRes.json();
  if (!health.ok || health.product !== "opp") {
    throw new Error(`health_payload:${JSON.stringify(health)}`);
  }

  const openapiRes = await fetch(`${base}/v1/openapi.json`);
  if (!openapiRes.ok) {
    throw new Error(`openapi_${openapiRes.status}`);
  }
  const openapi = await openapiRes.json();
  if (openapi.openapi !== "3.1.0" || !openapi.info?.version) {
    throw new Error("openapi_invalid");
  }

  const inventRes = await fetch(`${base}/v1/spend/evaluate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ markdown, openId: null }),
  });
  if (inventRes.status !== 403) {
    throw new Error(`invent_status_${inventRes.status}`);
  }
  const invent = await inventRes.json();
  if (
    invent.decision?.allowed !== false ||
    invent.decision?.reason !== "invent_without_program"
  ) {
    throw new Error(`invent_payload:${JSON.stringify(invent)}`);
  }

  const spendRes = await fetch(`${base}/v1/spend/evaluate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ markdown, openId: "P-050" }),
  });
  if (spendRes.status !== 200) {
    throw new Error(`spend_status_${spendRes.status}`);
  }
  const spend = await spendRes.json();
  if (spend.decision?.allowed !== true || spend.decision?.openId !== "P-050") {
    throw new Error(`spend_payload:${JSON.stringify(spend)}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        base,
        protocolVersion: health.protocolVersion,
        openapiVersion: openapi.info.version,
        invent: invent.decision.reason,
        spend: spend.decision.openId,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(`smoke-hosted-api: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
