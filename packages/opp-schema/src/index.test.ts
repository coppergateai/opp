import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isOpenId, normalizeOpenId, OPP_PROTOCOL_VERSION } from "./index.js";

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
});
