import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderLandingPage } from "./page.js";

describe("OPP landing", () => {
  it("renders brand-first hero and Community $0 note", () => {
    const html = renderLandingPage();
    assert.match(html, /<title>OPP — Open Program Protocol<\/title>/);
    assert.match(html, /hero-brand/);
    assert.match(html, />OPP</);
    assert.match(html, /Autonomy under contract/);
    assert.match(html, /Community \/ self-host \$0/);
    assert.doesNotMatch(html, /\$99|\$199|Starter|Pro plan/i);
    assert.match(html, /@opp\/verify/);
    assert.match(html, /invent_without_program/);
    assert.match(html, /opp\.coppergate\.ai/);
  });
});
