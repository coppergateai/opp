import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DOCUMENTED_HOSTED_PATHS,
  DOCUMENTED_SCHEMA_PATHS,
  isOpenId,
  loadHostedOpenApi,
  loadProtocolManifest,
  loadProtocolSchema,
  normalizeOpenId,
  OPP_HOSTED_API_VERSION,
  OPP_PROTOCOL_VERSION,
} from "./index.js";

describe("@opp/schema", () => {
  it("exports protocol version", () => {
    assert.equal(OPP_PROTOCOL_VERSION, "0.1.0");
  });

  it("validates Open IDs", () => {
    assert.equal(isOpenId("P-010"), true);
    assert.equal(isOpenId("SEC-012"), true);
    assert.equal(isOpenId("AG-001"), true);
    assert.equal(isOpenId("nope"), false);
    assert.equal(normalizeOpenId("p-010"), "P-010");
  });

  it("loads portable protocol manifest and schemas (P-010)", () => {
    const manifest = loadProtocolManifest();
    assert.equal(manifest.protocolVersion, OPP_PROTOCOL_VERSION);
    assert.ok(manifest.schemas.length >= 2);

    const ids = manifest.schemas.map((s) => s.id);
    assert.ok(ids.includes("open-program"));
    assert.ok(ids.includes("ship-receipt"));

    for (const entry of manifest.schemas) {
      const schema = loadProtocolSchema(entry.id);
      assert.ok(schema, `missing schema ${entry.id}`);
      assert.equal(typeof schema.$schema, "string");
      assert.equal(typeof schema.$id, "string");
      assert.equal(schema.type, "object");
    }

    assert.equal(loadProtocolSchema("unknown-id"), null);
    assert.deepEqual([...DOCUMENTED_SCHEMA_PATHS], [
      "/v1/schemas",
      "/v1/schemas/{schemaId}",
    ]);
  });

  it("loads OpenAPI aligned to DOCUMENTED_HOSTED_PATHS (A-010)", () => {
    const doc = loadHostedOpenApi();
    assert.equal(doc.openapi, "3.1.0");
    assert.equal(doc.info.version, OPP_HOSTED_API_VERSION);
    assert.match(String(doc.info.description ?? ""), /Community \/ self-host \$0/);
    assert.doesNotMatch(String(doc.info.description ?? ""), /\$99|\$199/);
    for (const path of DOCUMENTED_HOSTED_PATHS) {
      assert.ok(path in doc.paths, `missing OpenAPI path ${path}`);
    }
  });
});
