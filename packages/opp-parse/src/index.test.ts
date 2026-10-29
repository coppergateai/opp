import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseOpenProgramMarkdown, summarizeProgram } from "./index.js";

const SAMPLE = `
## Phase 1

| Status | ID | Title | Notes |
| --- | --- | --- | --- |
| Open | W-001 | Repo scaffold | bootstrap |
| Done | P-010 | Schema types | shipped |
| Open | P-020 | Verify receipt | next |
`;

describe("@opp/parse", () => {
  it("parses Open and Done rows", () => {
    const rows = parseOpenProgramMarkdown(SAMPLE);
    assert.equal(rows.length, 3);
    assert.equal(rows[0]?.id, "W-001");
    assert.equal(rows[0]?.status, "open");
    assert.equal(rows[1]?.status, "done");
    const summary = summarizeProgram(rows);
    assert.equal(summary.openCount, 2);
    assert.equal(summary.doneCount, 1);
  });
});
