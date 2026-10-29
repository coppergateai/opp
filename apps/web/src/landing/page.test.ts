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
    assert.match(html, /@opp\/client/);
    assert.match(html, /invent_without_program/);
    assert.match(html, /opp\.coppergate\.ai/);
  });

  it("links OpenAPI and hosted API for DX (P-040)", () => {
    const html = renderLandingPage();
    assert.match(html, /https:\/\/api\.opp\.coppergate\.ai\/v1\/openapi\.json/);
    assert.match(html, /docs\/protocol\/client\.md/);
    assert.match(html, /api\.opp\.coppergate\.ai/);
    assert.match(html, /OppClient/);
  });

  it("surfaces Accept→verify and generic runtime (P-090)", () => {
    const html = renderLandingPage();
    assert.match(html, /Developers · Phase 4/);
    assert.match(html, /docs\/protocol\/accept-verify-runbook\.md/);
    assert.match(html, /docs\/protocol\/generic-runtime\.md/);
    assert.match(html, /api\.opp\.coppergate\.ai\/health/);
    assert.match(html, /OPP_API_URL/);
  });

  it("renders principles, scenario, how-it-works, walkthrough, architecture", () => {
    const html = renderLandingPage();
    assert.match(html, /id="principles"/);
    assert.match(html, /Open ID ≠ freestyle invent/);
    assert.match(html, /Spend License ≠ unlimited reserve/);
    assert.match(html, /Ship Receipt ≠ chat transcript/);
    assert.match(html, /id="scenario"/);
    assert.match(html, /invent_without_program/);
    assert.match(html, /openId: null → deny/);
    assert.match(html, /id="how-it-works"/);
    assert.match(html, /Spend License/);
    assert.match(html, /Factory Accept/);
    assert.match(html, /badge-available/);
    assert.match(html, /id="walkthrough"/);
    assert.match(html, /wedge-data/);
    assert.match(html, /Invent without Open ID/);
    assert.match(html, /id="architecture"/);
    assert.match(html, /You are here/);
    assert.match(html, /Protocol architecture/);
  });

  it("footer has protocol, developers, and ecosystem columns", () => {
    const html = renderLandingPage();
    assert.match(html, /footer-col/);
    assert.match(html, />Protocol</);
    assert.match(html, />Developers</);
    assert.match(html, />Ecosystem</);
    assert.match(html, /acpp\.coppergate\.ai/);
  });
});
