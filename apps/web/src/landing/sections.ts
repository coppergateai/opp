import {
  ACPP_URL,
  API_URL,
  COPPERGATE_URL,
  DOCS,
  GITHUB_REPO,
  PRINCIPLES,
  PROTOCOL_LAYERS,
  SCENARIO,
  SDK_SAMPLE,
  STACK,
  WALKTHROUGH_STEPS,
  WEDGE_STEPS,
} from "./constants.js";
import { renderWordmark } from "./mark.js";
import { escapeHtml } from "../escape.js";

function highlightTs(source: string): string {
  return escapeHtml(source)
    .replace(/(\/\/.*)/g, '<span class="cm">$1</span>')
    .replace(
      /\b(import|from|const|await|new)\b/g,
      '<span class="kw">$1</span>',
    )
    .replace(
      /(&quot;[^&]*&quot;)/g,
      '<span class="str">$1</span>',
    )
    .replace(
      /\b(OppClient|evaluateSpend|verifyReceipt|openApi)\b/g,
      '<span class="fn">$1</span>',
    );
}

export function renderNav(): string {
  return `
<header class="site-header" id="site-header">
  <div class="nav-inner">
    ${renderWordmark()}
    <ul class="nav-links" role="list">
      <li><a href="#principles">Principles</a></li>
      <li><a href="#scenario">Scenario</a></li>
      <li><a href="#how-it-works">How it works</a></li>
      <li><a href="#developers">Developers</a></li>
      <li><a href="#architecture">Architecture</a></li>
    </ul>
    <div class="nav-actions">
      <a class="btn btn-ghost" href="${escapeHtml(GITHUB_REPO)}" rel="noopener noreferrer">GitHub</a>
      <a class="btn btn-primary" href="${escapeHtml(DOCS.dogfood)}">Get started</a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <div class="mobile-nav" id="mobile-nav" hidden>
    <a href="#principles">Principles</a>
    <a href="#scenario">Scenario</a>
    <a href="#how-it-works">How it works</a>
    <a href="#wedge">Wedge</a>
    <a href="#developers">Developers</a>
    <a href="#walkthrough">Walkthrough</a>
    <a href="#architecture">Architecture</a>
    <a href="${escapeHtml(DOCS.protocol)}">Docs</a>
    <a href="${escapeHtml(GITHUB_REPO)}" rel="noopener noreferrer">GitHub</a>
    <a class="btn btn-primary" href="${escapeHtml(DOCS.dogfood)}">Get started</a>
  </div>
</header>`;
}

function heroVisual(): string {
  return `
<div class="hero-visual" aria-hidden="false">
  <div class="receipt-stage" role="img" aria-label="Open Program rows flowing into a verified Ship Receipt">
    <p class="stage-kicker">Open Program → Ship Receipt</p>
    <div class="program-rows">
      <div class="program-row" style="--row-i:0">
        <span class="id">P-030</span>
        <span class="title">@opp/client</span>
        <span class="status">Done</span>
      </div>
      <div class="program-row" style="--row-i:1">
        <span class="id">A-020</span>
        <span class="title">Hosted API</span>
        <span class="status">Done</span>
      </div>
      <div class="program-row open" style="--row-i:2">
        <span class="id">P-040</span>
        <span class="title">Landing DX</span>
        <span class="status">Done</span>
      </div>
    </div>
    <div class="receipt-card-lite">
      <strong>Receipt verified</strong>
      <div class="receipt-meta">
        <span>Open ID <b>P-020</b></span>
        <span>Spend <b>$0.42</b></span>
        <span>CI <b>green</b></span>
        <span>Writeback <b>Done</b></span>
      </div>
    </div>
  </div>
</div>`;
}

export function renderHero(): string {
  return `
<section class="hero" id="top">
  <div class="hero-atmosphere" aria-hidden="true"></div>
  <div class="hero-inner">
    <div>
      <p class="hero-brand" aria-label="OPP"><span>OPP</span></p>
      <h1>Autonomy under contract.</h1>
      <p class="lede">Portable Open Programs and Ship Receipts — agents invent only from Open IDs.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${escapeHtml(DOCS.dogfood)}">Get started <span aria-hidden="true">→</span></a>
        <a class="btn btn-secondary" href="#scenario">See the scenario</a>
      </div>
    </div>
    ${heroVisual()}
  </div>
</section>`;
}

export function renderPrinciples(): string {
  const cards = PRINCIPLES.map(
    (p) => `
    <article class="principle" data-reveal>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.body)}</p>
      <div class="principle-diagram" aria-hidden="true">
        <span>${escapeHtml(p.left)}</span><span class="x">≠</span><span>${escapeHtml(p.right)}</span>
      </div>
    </article>`,
  ).join("");

  return `
<section class="section section-light" id="principles" aria-labelledby="principles-title">
  <div class="container">
    <p class="section-kicker">Contract principles</p>
    <h2 id="principles-title">Only what’s on the program ships.</h2>
    <p class="section-lead">Three separations that keep agent spend accountable.</p>
    <div class="principles">${cards}</div>
  </div>
</section>`;
}

export function renderScenario(): string {
  const beats = SCENARIO.beats
    .map(
      (beat, i) => `
<li class="scenario-beat" data-reveal style="--beat-i:${i}">
  <span class="scenario-beat-index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
  <div>
    <p class="scenario-beat-who">${escapeHtml(beat.who)}</p>
    <p class="scenario-beat-what">${escapeHtml(beat.what)}</p>
  </div>
</li>`,
    )
    .join("");

  const { setting } = SCENARIO;

  return `
<section class="section" id="scenario" aria-labelledby="scenario-title">
  <div class="container">
    <p class="section-kicker">${escapeHtml(SCENARIO.kicker)}</p>
    <h2 id="scenario-title">${escapeHtml(SCENARIO.title)}</h2>
    <p class="section-lead">${escapeHtml(SCENARIO.lead)}</p>
    <div class="scenario-layout">
      <ol class="scenario-beats" role="list">${beats}</ol>
      <aside class="scenario-stage" data-reveal aria-label="Scenario setup">
        <p class="scenario-stage-label">${escapeHtml(setting.label)}</p>
        <h3>${escapeHtml(setting.program)}</h3>
        <dl class="scenario-facts">
          <div><dt>Open ID</dt><dd class="mono">${escapeHtml(setting.openId)}</dd></div>
          <div><dt>Invent</dt><dd class="mono">openId: null → deny</dd></div>
          <div><dt>Spend</dt><dd class="mono">openId: P-030 → allow</dd></div>
          <div><dt>Verify</dt><dd class="mono">receipt.ok: true</dd></div>
        </dl>
        <p class="scenario-outcome"><span class="dot" aria-hidden="true"></span>${escapeHtml(setting.outcome)}</p>
        <a class="scenario-link" href="#walkthrough">See the protocol steps →</a>
      </aside>
    </div>
  </div>
</section>`;
}

export function renderStack(): string {
  const items = STACK.map(
    (s) => `
    <article class="stack-item${s.current ? " current" : ""}" data-reveal>
      <p class="stack-layer">${escapeHtml(s.layer)}</p>
      <h3>${escapeHtml(s.product)}</h3>
      <p>${escapeHtml(s.job)}</p>
      <a href="${escapeHtml(s.href)}"${s.current ? "" : ' rel="noopener noreferrer"'}>
        ${s.current ? "You are here" : `Open ${escapeHtml(s.product)} →`}
      </a>
    </article>`,
  ).join("");

  return `
<section class="section section-light" id="stack" aria-labelledby="stack-title">
  <div class="container">
    <p class="section-kicker">Ecosystem</p>
    <h2 id="stack-title">Who · What · How</h2>
    <p class="section-lead">OPP is the portable contract layer between agent identity and the selection runtime.</p>
    <div class="stack-grid">${items}</div>
    <p class="price-note">Community / self-host $0 only — no paid SKU UI.</p>
  </div>
</section>`;
}

export function renderHowItWorks(): string {
  const layers = PROTOCOL_LAYERS.map(
    (layer) => `
<article class="layer" data-reveal id="layer-${escapeHtml(layer.id)}">
  <p class="layer-num">${escapeHtml(layer.num)}</p>
  <h3>${escapeHtml(layer.name)}</h3>
  <p>${escapeHtml(layer.summary)}</p>
  <span class="badge badge-${escapeHtml(layer.status)}">${escapeHtml(layer.statusLabel)}</span>
</article>`,
  ).join("");

  return `
<section class="section" id="how-it-works" aria-labelledby="how-title">
  <div class="container">
    <p class="section-kicker">How OPP works</p>
    <h2 id="how-title">From Open Program to verified receipt.</h2>
    <p class="section-lead">Parse, license, verify, and bind — status labels reflect what ships in this repository today.</p>
    <div class="layers">${layers}</div>
  </div>
</section>`;
}

export function renderWedge(): string {
  const steps = WEDGE_STEPS.map(
    (s) => `
    <div class="wedge-step" data-reveal>
      <span class="wedge-n">${escapeHtml(s.n)}</span>
      <div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.detail)}</p>
      </div>
    </div>`,
  ).join("");

  return `
<section class="section section-light" id="wedge" aria-labelledby="wedge-title">
  <div class="container">
    <p class="section-kicker">Locked wedge</p>
    <h2 id="wedge-title">Program in. Receipt out.</h2>
    <p class="section-lead">Author → bind → spend → verify — then prove invent-without-program is rejected.</p>
    <div class="wedge-list">${steps}</div>
  </div>
</section>`;
}

export function renderDevelopers(): string {
  return `
<section class="section" id="developers" aria-labelledby="dev-title">
  <div class="container">
    <p class="section-kicker">Developers · Phase 4</p>
    <h2 id="dev-title">Parse. License. Verify.</h2>
    <p class="section-lead">@opp/client against the Community API — invent deny, spend allow, Ship Receipt verify. Factory Accept wires the same path via <code>OPP_API_URL</code>.</p>
    <p class="dx-links" data-reveal>
      <a href="${escapeHtml(DOCS.openapi)}" rel="noopener noreferrer">OpenAPI</a>
      <a href="${escapeHtml(DOCS.client)}" rel="noopener noreferrer">@opp/client</a>
      <a href="${escapeHtml(DOCS.health)}" rel="noopener noreferrer">api.opp health</a>
      <a href="${escapeHtml(DOCS.acceptVerify)}" rel="noopener noreferrer">Accept → verify</a>
      <a href="${escapeHtml(DOCS.genericRuntime)}" rel="noopener noreferrer">Any runtime</a>
      <a href="${escapeHtml(DOCS.hostedApi)}" rel="noopener noreferrer">Hosted API docs</a>
    </p>
    <div class="code-panel" data-reveal>
      <div class="code-toolbar">
        <span>@opp/client · hosted wedge</span>
        <button type="button" class="copy-btn" id="copy-code">Copy</button>
      </div>
      <pre id="sdk-sample-raw" hidden>${escapeHtml(SDK_SAMPLE)}</pre>
      <pre><code>${highlightTs(SDK_SAMPLE)}</code></pre>
    </div>
    <div class="deny-allow" data-reveal>
      <div class="pill-result deny">
        <strong>Invent denied</strong>
        <p>No Open ID → <span class="mono">invent_without_program</span>. Freestyle work never ships.</p>
      </div>
      <div class="pill-result allow">
        <strong>Spend allowed</strong>
        <p>Open ID on the program → reserve, race, Accept, and a verifiable Ship Receipt.</p>
      </div>
    </div>
  </div>
</section>`;
}

export function renderWalkthrough(): string {
  const steps = WALKTHROUGH_STEPS.map(
    (step, i) => `
<button type="button" class="step-tab" role="tab" id="wedge-tab-${i}" aria-selected="${i === 0 ? "true" : "false"}" aria-controls="wedge-panel" data-step="${i}">
  <span class="step-index">${String(i + 1).padStart(2, "0")}</span>
  <span>
    <strong>${escapeHtml(step.title)}</strong>
    <span class="detail">${escapeHtml(step.detail)}</span>
  </span>
</button>`,
  ).join("");

  const first = WALKTHROUGH_STEPS[0]!;

  return `
<section class="section section-light" id="walkthrough" aria-labelledby="walkthrough-title">
  <div class="container">
    <p class="section-kicker">Protocol walkthrough</p>
    <h2 id="walkthrough-title">From Open ID to verified receipt.</h2>
    <p class="section-lead">Same locked wedge as API steps: author → bind → spend → verify → invent deny.</p>
    <span class="demo-note">Demonstration sequence · mirrors docs/WEDGE.md</span>
    <div class="example-grid">
      <div role="tablist" aria-label="Wedge steps" class="timeline">${steps}</div>
      <div class="walk-panel" id="wedge-panel" role="tabpanel" aria-labelledby="wedge-tab-0" data-reveal>
        <h3 id="wedge-panel-title">${escapeHtml(first.title)}</h3>
        <p id="wedge-panel-detail">${escapeHtml(first.detail)}</p>
        <dl class="walk-meta">
          <div><dt>Surface</dt><dd id="wedge-panel-meta" class="mono">${escapeHtml(first.meta)}</dd></div>
          <div><dt>Client</dt><dd class="mono">@opp/client</dd></div>
          <div><dt>API</dt><dd class="mono">api.opp.coppergate.ai</dd></div>
        </dl>
        <div class="walk-status"><span class="dot" aria-hidden="true"></span><span id="wedge-panel-status">Step ready</span></div>
      </div>
    </div>
  </div>
</section>
<script type="application/json" id="wedge-data">${JSON.stringify(WALKTHROUGH_STEPS).replace(/</g, "\\u003c")}</script>`;
}

export function renderArchitecture(): string {
  return `
<section class="section" id="architecture" aria-labelledby="arch-title">
  <div class="container">
    <p class="section-kicker">Protocol architecture</p>
    <h2 id="arch-title">A contract layer, not another agent runtime.</h2>
    <p class="section-lead">Identity stays in ACPP. Selection stays in Coppergate. OPP makes the program contract portable.</p>
    <div class="arch" role="img" aria-label="Layered architecture: ACPP above OPP above Coppergate" data-reveal>
      <div class="arch-layer arch-who">
        <span class="arch-tag">Who</span>
        <strong>ACPP — identity, grants, action receipts</strong>
        <span>Verifiable agent identity before consequential spend</span>
        <a href="${escapeHtml(ACPP_URL)}" rel="noopener noreferrer">Open ACPP →</a>
      </div>
      <div class="arch-arrow" aria-hidden="true">↓</div>
      <div class="arch-layer arch-what">
        <span class="arch-tag">What</span>
        <strong>OPP — program contract + Ship Receipt verify</strong>
        <span>@opp/parse · @opp/client · @opp/verify · Community API</span>
        <span class="arch-here">You are here</span>
      </div>
      <div class="arch-arrow" aria-hidden="true">↓</div>
      <div class="arch-layer arch-how">
        <span class="arch-tag">How</span>
        <strong>Coppergate — survivor selection / factory runtime</strong>
        <span>Arena · Accept · OPP_API_URL verify path</span>
        <a href="${escapeHtml(COPPERGATE_URL)}" rel="noopener noreferrer">Open Coppergate →</a>
      </div>
    </div>
  </div>
</section>`;
}

export function renderFinalCta(): string {
  return `
<section class="final" aria-labelledby="final-title">
  <div class="container">
    <h2 id="final-title">Only what’s on the program ships.</h2>
    <p>Bind OPP to Coppergate, or verify receipts from any runtime that honors the contract.</p>
    <div class="hero-ctas">
      <a class="btn btn-primary" href="${escapeHtml(GITHUB_REPO)}" rel="noopener noreferrer">Star on GitHub</a>
      <a class="btn btn-secondary" href="${escapeHtml(DOCS.coppergateOpp)}">Coppergate + OPP</a>
    </div>
  </div>
</section>`;
}

export function renderFooter(): string {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      ${renderWordmark({ size: 26 })}
      <p>Open Program Protocol · Community / self-host $0 only.</p>
    </div>
    <div class="footer-col">
      <h4>Protocol</h4>
      <ul>
        <li><a href="#principles">Principles</a></li>
        <li><a href="#scenario">Scenario</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#wedge">Wedge</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="${escapeHtml(DOCS.product)}">PRODUCT.md</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Developers</h4>
      <ul>
        <li><a href="${escapeHtml(DOCS.dogfood)}">Get started</a></li>
        <li><a href="${escapeHtml(DOCS.client)}" rel="noopener noreferrer">@opp/client</a></li>
        <li><a href="${escapeHtml(DOCS.openapi)}" rel="noopener noreferrer">OpenAPI</a></li>
        <li><a href="${escapeHtml(DOCS.acceptVerify)}" rel="noopener noreferrer">Accept → verify</a></li>
        <li><a href="${escapeHtml(API_URL)}" rel="noopener noreferrer">API</a></li>
        <li><a href="${escapeHtml(GITHUB_REPO)}" rel="noopener noreferrer">GitHub</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Ecosystem</h4>
      <ul>
        <li><a href="${escapeHtml(ACPP_URL)}">ACPP</a></li>
        <li><a href="${escapeHtml(COPPERGATE_URL)}">Coppergate</a></li>
        <li><a href="${escapeHtml(DOCS.coppergateOpp)}">Coppergate + OPP</a></li>
        <li><a href="${escapeHtml(DOCS.license)}">MIT</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© ${year} Coppergate / OPP · Community $0</span>
    <span><a href="${escapeHtml(DOCS.license)}">MIT License</a></span>
  </div>
</footer>`;
}
