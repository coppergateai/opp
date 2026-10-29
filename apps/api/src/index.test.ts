import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApiServer } from "./index.js";

/** Coppergate Accept → OPP verify body (P-020). */
function coppergateProjectedReceipt(openId: string) {
  return {
    kind: "ship_receipt" as const,
    protocolVersion: "0.1.0",
    openId,
    title: `${openId}: Coppergate runtime prove`,
    spendMicros: 420_000,
    fitnessScore: 1,
    ci: {
      acceptReady: true,
      blocking: false,
      passed: true,
      checkCount: 3,
    },
    writeback: {
      architectureId: openId,
      note: `Open Program ${openId} → Done on Accept`,
    },
    acceptedAt: new Date().toISOString(),
  };
}

async function withServer(fn: (port: number) => Promise<void>): Promise<void> {
  const server = createApiServer();
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  try {
    await fn(addr.port);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

const MD = `| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | W-001 | Scaffold | first |
`;

describe("@opp/api", () => {
  it("Coppergate Accept receipt verifies over HTTP (P-020)", async () => {
    await withServer(async (port) => {
      const base = `http://127.0.0.1:${port}`;
      const markdown = `| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | P-020 | Coppergate runtime prove | bind → verify |
`;
      const invent = await fetch(`${base}/v1/spend/evaluate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown, openId: null }),
      });
      assert.equal(invent.status, 403);

      const spend = await fetch(`${base}/v1/spend/evaluate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown, openId: "P-020" }),
      });
      assert.equal(spend.status, 200);

      const verify = await fetch(`${base}/v1/receipts/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          markdown,
          receipt: coppergateProjectedReceipt("P-020"),
        }),
      });
      assert.equal(verify.status, 200);
      const body = (await verify.json()) as { result: { ok: boolean; openId?: string } };
      assert.equal(body.result.ok, true);
      assert.equal(body.result.openId, "P-020");
    });
  });

  it("serves portable protocol schemas (P-010)", async () => {
    await withServer(async (port) => {
      const base = `http://127.0.0.1:${port}`;
      const manifest = await fetch(`${base}/v1/schemas`);
      assert.equal(manifest.status, 200);
      const manifestBody = (await manifest.json()) as {
        protocolVersion: string;
        schemas: { id: string }[];
      };
      assert.equal(manifestBody.protocolVersion, "0.1.0");
      assert.ok(manifestBody.schemas.some((s) => s.id === "open-program"));
      assert.ok(manifestBody.schemas.some((s) => s.id === "ship-receipt"));

      const schema = await fetch(`${base}/v1/schemas/ship-receipt`);
      assert.equal(schema.status, 200);
      const schemaBody = (await schema.json()) as { title?: string };
      assert.equal(schemaBody.title, "ShipReceiptVerifyBody");

      const missing = await fetch(`${base}/v1/schemas/unknown-id`);
      assert.equal(missing.status, 404);
    });
  });

  it("health + wedge parse/spend/verify", async () => {
    await withServer(async (port) => {
      const base = `http://127.0.0.1:${port}`;
      const health = await fetch(`${base}/health`);
      assert.equal(health.status, 200);

      const parsed = await fetch(`${base}/v1/programs/parse`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown: MD }),
      });
      assert.equal(parsed.status, 200);
      const parsedBody = (await parsed.json()) as {
        summary: { openCount: number };
      };
      assert.equal(parsedBody.summary.openCount, 1);

      const invent = await fetch(`${base}/v1/spend/evaluate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown: MD, openId: null }),
      });
      assert.equal(invent.status, 403);

      const spend = await fetch(`${base}/v1/spend/evaluate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown: MD, openId: "W-001" }),
      });
      assert.equal(spend.status, 200);

      const verify = await fetch(`${base}/v1/receipts/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          markdown: MD,
          receipt: {
            kind: "ship_receipt",
            openId: "W-001",
            title: "W-001: Scaffold",
            spendMicros: 0,
            fitnessScore: 1,
            ci: {
              acceptReady: true,
              blocking: false,
              passed: true,
              checkCount: 1,
            },
            writeback: { architectureId: "W-001", note: "Done" },
            acceptedAt: new Date().toISOString(),
          },
        }),
      });
      assert.equal(verify.status, 200);
    });
  });
});
