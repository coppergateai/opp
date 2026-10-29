import {
  ACPP_URL,
  COPPERGATE_URL,
  DOCS,
  GITHUB_REPO,
  SDK_SAMPLE,
  STACK,
  WEDGE_STEPS,
} from "./constants.js";
import { renderWordmark } from "./mark.js";
import { escapeHtml } from "../escape.js";

function highlightTs(source: string): string {
  return escapeHtml(source)
    .replace(/(\/\/.*)/g, '<span class="cm">$1</span>')
    .replace(
      /\b(import|from|const|await)\b/g,
      '<span class="kw">$1</span>',
    )
    .replace(
      /(&quot;[^&]*&quot;)/g,
      '<span class="str">$1</span>',
    )
    .replace(
      /\b(parseOpenProgramMarkdown|evaluateSpendLicense|verifyShipReceipt)\b/g,
      '<span class="fn">$1</span>',
    );
}

export function renderNav(): string {
  return `
<header class="site-header" id="site-header">
  <div class="nav-inner">
    ${renderWordmark()}
    <ul class="nav-links" role="list">
      <li><a href="#stack">Stack</a></li>
      <li><a href="#wedge">Wedge</a></li>
      <li><a href="#developers">Developers</a></li>
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
    <a href="#stack">Stack</a>
    <a href="#wedge">Wedge</a>
    <a href="#developers">Developers</a>
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
      <div class="program-row">
        <span class="id">P-010</span>
        <span class="title">Schema types</span>
        <span class="status">Done</span>
      </div>
      <div class="program-row open">
        <span class="id">P-020</span>
        <span class="title">Verify receipt</span>
        <span class="status">Open</span>
      </div>
      <div class="program-row">
        <span class="id">A-010</span>
        <span class="title">API polish</span>
        <span class="status">Open</span>
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
        <a class="btn btn-secondary" href="#wedge">See the wedge</a>
      </div>
    </div>
    ${heroVisual()}
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
<section class="section" id="wedge" aria-labelledby="wedge-title">
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
    <p class="section-kicker">Developers</p>
    <h2 id="dev-title">Parse. License. Verify.</h2>
    <p class="section-lead">@opp/parse and @opp/verify — same grammar Coppergate already uses for Open Programs.</p>
    <div class="code-panel" data-reveal>
      <div class="code-toolbar">
        <span>@opp/verify · wedge</span>
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
  return `
<footer class="site-footer">
  <div class="footer-inner">
    <p>OPP · Open Program Protocol · Community $0</p>
    <div class="footer-links">
      <a href="${escapeHtml(DOCS.product)}">PRODUCT.md</a>
      <a href="${escapeHtml(DOCS.wedge)}">Wedge</a>
      <a href="${escapeHtml(DOCS.protocol)}">Protocol</a>
      <a href="${escapeHtml(ACPP_URL)}">ACPP</a>
      <a href="${escapeHtml(COPPERGATE_URL)}">Coppergate</a>
      <a href="${escapeHtml(DOCS.license)}">MIT</a>
    </div>
  </div>
</footer>`;
}
