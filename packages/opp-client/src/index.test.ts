import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OppClient, OppClientError } from "./index.js";

describe("@opp/client (P-030)", () => {
  it("defaults base URL to local OPP API", () => {
    const prev = process.env.OPP_API_URL;
    delete process.env.OPP_API_URL;
    try {
      const c = new OppClient();
      assert.equal(c.baseUrl, "http://127.0.0.1:8790");
    } finally {
      if (prev !== undefined) process.env.OPP_API_URL = prev;
    }
  });

  it("covers hosted surface: health, openapi, schemas, parse, spend, verify", async () => {
    const calls: { url: string; method?: string }[] = [];
    const c = new OppClient({
      baseUrl: "http://opp.test",
      fetch: async (input, init) => {
        const url = String(input);
        calls.push({ url, method: init?.method ?? "GET" });
        if (url.endsWith("/health")) {
          return Response.json({
            ok: true,
            protocolVersion: "0.1.0",
            product: "opp",
          });
        }
        if (url.endsWith("/v1/openapi.json")) {
          return Response.json({
            openapi: "3.1.0",
            info: { title: "OPP", version: "1.0.0" },
            paths: {},
          });
        }
        if (url.endsWith("/v1/schemas")) {
          return Response.json({
            protocolVersion: "0.1.0",
            title: "OPP",
            description: "x",
            schemas: [{ id: "ship-receipt", file: "x", summary: "y" }],
          });
        }
        if (url.endsWith("/v1/schemas/ship-receipt")) {
          return Response.json({ title: "ShipReceiptVerifyBody" });
        }
        if (url.endsWith("/v1/programs/parse")) {
          return Response.json({
            protocolVersion: "0.1.0",
            programId: "inline",
            rows: [{ id: "P-030" }],
            summary: { openCount: 1, doneCount: 0, openIds: ["P-030"] },
            page: { offset: 0, limit: 1, total: 1, hasMore: false },
          });
        }
        if (url.endsWith("/v1/spend/evaluate")) {
          return new Response(
            JSON.stringify({
              decision: { allowed: false, reason: "invent_without_program" },
            }),
            { status: 403, headers: { "content-type": "application/json" } },
          );
        }
        if (url.endsWith("/v1/receipts/verify")) {
          return Response.json({
            result: { ok: true, openId: "P-030" },
          });
        }
        return new Response("missing", { status: 404 });
      },
    });

    assert.equal((await c.health()).ok, true);
    assert.equal((await c.openApi()).openapi, "3.1.0");
    assert.equal((await c.listSchemas()).schemas[0]?.id, "ship-receipt");
    assert.equal((await c.getSchema("ship-receipt")).title, "ShipReceiptVerifyBody");
    const parsed = await c.parseProgram({
      markdown: "| Open | P-030 | x |",
      limit: 1,
    });
    assert.equal(parsed.rows.length, 1);
    assert.equal(parsed.page?.limit, 1);

    const invent = await c.evaluateSpend({ markdown: "x", openId: null });
    assert.equal(invent.allowed, false);
    assert.equal(invent.reason, "invent_without_program");

    const verified = await c.verifyReceipt({
      markdown: "x",
      receipt: { kind: "ship_receipt", openId: "P-030" },
    });
    assert.equal(verified.ok, true);
    assert.equal(verified.openId, "P-030");

    assert.ok(calls.some((c) => c.url.endsWith("/v1/spend/evaluate")));
    assert.ok(calls.some((c) => c.url.endsWith("/v1/receipts/verify")));
  });

  it("throws OppClientError with stable codes", async () => {
    const c = new OppClient({
      baseUrl: "http://opp.test",
      fetch: async () =>
        Response.json(
          { error: "schema_not_found", message: "Unknown schema id: nope" },
          { status: 404 },
        ),
    });
    await assert.rejects(
      () => c.getSchema("nope"),
      (err: unknown) => {
        assert.ok(err instanceof OppClientError);
        assert.equal(err.code, "schema_not_found");
        assert.equal(err.status, 404);
        return true;
      },
    );
  });
});
