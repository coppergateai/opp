/** OPP landing — graphite + copper contract aesthetic. */

export function landingStyles(): string {
  return `
:root {
  --ink: #0C0F12;
  --ink-2: #14191F;
  --ink-3: #1C232C;
  --line: rgba(196, 210, 224, 0.12);
  --line-strong: rgba(196, 210, 224, 0.22);
  --paper: #EEF1F4;
  --paper-2: #F7F8FA;
  --muted: #8B96A5;
  --muted-2: #A8B2BF;
  --text: #E7ECF1;
  --text-dark: #12171D;
  --copper: #C47A3A;
  --copper-bright: #E09A55;
  --copper-soft: rgba(196, 122, 58, 0.16);
  --copper-ring: rgba(196, 122, 58, 0.28);
  --ok: #3FA87A;
  --deny: #D35A4A;
  --radius: 12px;
  --font: "Syne", "Manrope", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --max: 1120px;
  --nav-h: 70px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

*, *::before, *::after { box-sizing: border-box; }
html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--nav-h) + 16px);
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.55;
  color: var(--text);
  background: var(--ink);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
code, .mono { font-family: var(--font-mono); }

.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  background: var(--copper);
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 100;
}
.skip-link:focus { left: 1rem; top: 1rem; }

.container {
  width: min(100% - 2.5rem, var(--max));
  margin-inline: auto;
}

.opp-mark-plate { fill: var(--ink-3); stroke: var(--copper); stroke-width: 1.4; }
.opp-mark-rule { stroke: var(--muted-2); }
.opp-mark-seal { fill: var(--copper-soft); stroke: var(--copper); stroke-width: 1.4; }
.opp-mark-seal-hole { fill: var(--copper); }

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--font);
  font-weight: 700;
  letter-spacing: -0.04em;
  font-size: 1.15rem;
}
.brand-word { color: var(--text); }

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--nav-h);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(12, 15, 18, 0.72);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: background 0.2s var(--ease), border-color 0.2s var(--ease);
}
.site-header.is-scrolled {
  background: rgba(12, 15, 18, 0.92);
  border-bottom-color: var(--line);
}
.site-header.on-light {
  background: rgba(238, 241, 244, 0.88);
  border-bottom-color: rgba(18, 23, 29, 0.08);
}
.site-header.on-light .brand-word,
.site-header.on-light .nav-links a,
.site-header.on-light .btn-ghost { color: var(--text-dark); }
.site-header.on-light .nav-links a { color: #5B6674; }
.site-header.on-light .nav-links a:hover { color: var(--text-dark); }
.site-header.on-light .opp-mark-plate { fill: #fff; }
.nav-inner {
  width: min(100% - 2.5rem, var(--max));
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.nav-links {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.1rem;
  margin-left: auto;
}
.nav-links a {
  color: var(--muted-2);
  font-size: 0.92rem;
  font-weight: 520;
}
.nav-links a:hover { color: var(--text); }
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-left: auto;
}
.nav-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 10px;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--text);
}
.site-header.on-light .nav-toggle { color: var(--text-dark); border-color: rgba(18,23,29,0.15); }
.nav-toggle svg { width: 1.15rem; height: 1.15rem; }
.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 0;
  padding: 0.5rem 1.25rem 1rem;
  background: rgba(12, 15, 18, 0.98);
  border-bottom: 1px solid var(--line);
}
.mobile-nav.open { display: flex; }
.mobile-nav a {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--muted-2);
  font-weight: 520;
}
.mobile-nav .btn { margin-top: 0.85rem; justify-content: center; }

@media (min-width: 900px) {
  .nav-links { display: flex; }
  .nav-actions { margin-left: 0; }
  .nav-toggle { display: none; }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.55rem;
  padding: 0.55rem 1.05rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.92rem;
  border: 1px solid transparent;
  transition: transform 0.15s var(--ease), background 0.15s var(--ease), border-color 0.15s var(--ease);
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  background: var(--copper);
  color: #1A1008;
  box-shadow: 0 8px 24px var(--copper-ring);
}
.btn-primary:hover { background: var(--copper-bright); }
.btn-secondary {
  background: transparent;
  border-color: var(--line-strong);
  color: var(--text);
}
.btn-secondary:hover { border-color: var(--copper); color: var(--copper-bright); }
.section-light .btn-secondary {
  border-color: rgba(18, 23, 29, 0.18);
  color: var(--text-dark);
}
.btn-ghost {
  background: transparent;
  color: var(--muted-2);
  padding-inline: 0.7rem;
}
.btn-ghost:hover { color: var(--text); }

/* —— Hero —— */
.hero {
  position: relative;
  min-height: calc(100svh - var(--nav-h));
  display: flex;
  align-items: flex-end;
  padding: 3.5rem 0 4.5rem;
  overflow: hidden;
  isolation: isolate;
}
.hero-atmosphere {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(90% 70% at 78% 18%, rgba(196, 122, 58, 0.22), transparent 55%),
    radial-gradient(60% 50% at 12% 88%, rgba(63, 168, 122, 0.08), transparent 50%),
    linear-gradient(180deg, #0C0F12 0%, #10151B 48%, #0C0F12 100%);
}
.hero-atmosphere::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(196, 210, 224, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196, 210, 224, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 70% 30%, #000 20%, transparent 70%);
  animation: gridDrift 28s linear infinite;
}
@keyframes gridDrift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-48px, -48px, 0); }
}

.hero-inner {
  width: min(100% - 2.5rem, var(--max));
  margin-inline: auto;
  display: grid;
  gap: 2.75rem;
  align-items: end;
}
@media (min-width: 960px) {
  .hero-inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 3rem;
  }
}

.hero-brand {
  font-family: var(--font);
  font-weight: 700;
  font-size: clamp(3.4rem, 9vw, 6.4rem);
  letter-spacing: -0.07em;
  line-height: 0.9;
  margin: 0 0 1.1rem;
  color: var(--text);
}
.hero-brand span {
  display: inline-block;
  color: var(--copper-bright);
  animation: brandIn 0.9s var(--ease) both;
}
@keyframes brandIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
.hero h1 {
  margin: 0 0 0.85rem;
  font-family: var(--font);
  font-weight: 650;
  font-size: clamp(1.55rem, 3.2vw, 2.15rem);
  letter-spacing: -0.035em;
  line-height: 1.15;
  max-width: 18ch;
  animation: brandIn 0.9s var(--ease) 0.08s both;
}
.hero .lede {
  margin: 0 0 1.6rem;
  color: var(--muted-2);
  font-size: 1.05rem;
  max-width: 36ch;
  animation: brandIn 0.9s var(--ease) 0.14s both;
}
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  animation: brandIn 0.9s var(--ease) 0.2s both;
}

.hero-visual {
  position: relative;
  min-height: 280px;
}
.receipt-stage {
  position: relative;
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  background:
    linear-gradient(160deg, rgba(28, 35, 44, 0.92), rgba(20, 25, 31, 0.96));
  padding: 1.25rem 1.25rem 1.1rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  animation: stageIn 1s var(--ease) 0.18s both;
}
@keyframes stageIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.receipt-stage::after {
  content: "";
  position: absolute;
  inset: auto -20% -40% 40%;
  height: 70%;
  background: radial-gradient(circle, var(--copper-soft), transparent 65%);
  pointer-events: none;
}
.stage-kicker {
  margin: 0 0 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--copper-bright);
}
.program-rows {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1rem;
}
.program-row {
  display: grid;
  grid-template-columns: 4.2rem 1fr auto;
  gap: 0.65rem;
  align-items: center;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: rgba(12, 15, 18, 0.45);
  font-size: 0.86rem;
  animation: rowIn 0.7s var(--ease) calc(0.28s + var(--row-i, 0) * 0.1s) both;
}
@keyframes rowIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: none; }
}
.program-row .id {
  font-family: var(--font-mono);
  font-weight: 560;
  color: var(--copper-bright);
}
.program-row .title { color: var(--text); }
.program-row .status {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}
.program-row.open {
  border-color: rgba(196, 122, 58, 0.35);
  animation:
    rowIn 0.7s var(--ease) calc(0.28s + var(--row-i, 0) * 0.1s) both,
    rowPulse 2.8s var(--ease) 1.2s infinite;
}
@keyframes rowPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(196, 122, 58, 0); }
  50% { box-shadow: 0 0 0 4px rgba(196, 122, 58, 0.12); }
}
.receipt-card-lite {
  border-top: 1px dashed var(--line-strong);
  padding-top: 0.9rem;
  display: grid;
  gap: 0.35rem;
}
.receipt-card-lite strong {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ok);
}
.receipt-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 1rem;
  color: var(--muted-2);
  font-size: 0.84rem;
}
.receipt-meta b { color: var(--text); font-weight: 600; }

/* —— Sections —— */
.section {
  padding: 5rem 0;
}
.section-light {
  background: var(--paper);
  color: var(--text-dark);
}
.section-light .section-kicker { color: var(--copper); }
.section-light .section-lead,
.section-light .muted { color: #5B6674; }
.section-kicker {
  margin: 0 0 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--copper-bright);
}
.section h2 {
  margin: 0 0 0.7rem;
  font-family: var(--font);
  font-weight: 700;
  font-size: clamp(1.7rem, 3.4vw, 2.35rem);
  letter-spacing: -0.04em;
  line-height: 1.12;
  max-width: 18ch;
}
.section-lead {
  margin: 0 0 2.2rem;
  color: var(--muted-2);
  font-size: 1.05rem;
  max-width: 46ch;
}

[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
[data-reveal].is-in {
  opacity: 1;
  transform: none;
}

/* Principles */
.principles {
  display: grid;
  gap: 0.9rem;
}
@media (min-width: 800px) {
  .principles { grid-template-columns: repeat(3, 1fr); }
}
.principle {
  padding: 1.35rem 1.3rem 1.4rem;
  border-radius: var(--radius);
  border: 1px solid rgba(18, 23, 29, 0.1);
  background: var(--paper-2);
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.principle:hover {
  border-color: rgba(196, 122, 58, 0.4);
  transform: translateY(-2px);
}
.principle h3 {
  margin: 0 0 0.55rem;
  font-family: var(--font);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
.principle p {
  margin: 0 0 1.1rem;
  color: #5B6674;
  font-size: 0.95rem;
}
.principle-diagram {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #7A8696;
}
.principle-diagram .x {
  color: var(--copper);
  font-weight: 700;
}

/* Scenario */
.scenario-layout {
  display: grid;
  gap: 2rem;
}
@media (min-width: 900px) {
  .scenario-layout {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 2.5rem;
    align-items: start;
  }
}
.scenario-beats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}
.scenario-beat {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem 1.15rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--line);
  transition-delay: calc(var(--beat-i, 0) * 0.06s);
}
.scenario-beat:last-child { border-bottom: 1px solid var(--line); }
.scenario-beat-index {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--copper-bright);
  padding-top: 0.15rem;
}
.scenario-beat-who {
  margin: 0 0 0.25rem;
  font-family: var(--font);
  font-weight: 650;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}
.scenario-beat-what {
  margin: 0;
  color: var(--muted-2);
  font-size: 0.95rem;
  max-width: 42ch;
}
.scenario-stage {
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(28, 35, 44, 0.95), rgba(16, 21, 27, 0.98));
  padding: 1.35rem 1.35rem 1.25rem;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.28);
}
.scenario-stage-label {
  margin: 0 0 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--copper-bright);
}
.scenario-stage h3 {
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 560;
  color: var(--text);
}
.scenario-facts {
  margin: 0 0 1.1rem;
  display: grid;
  gap: 0.55rem;
}
.scenario-facts div {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.5rem;
  font-size: 0.86rem;
}
.scenario-facts dt {
  color: var(--muted);
  margin: 0;
}
.scenario-facts dd {
  margin: 0;
  color: var(--text);
}
.scenario-outcome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: var(--muted-2);
}
.scenario-outcome .dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 0 3px rgba(63, 168, 122, 0.2);
}
.scenario-link {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--copper-bright);
}
.scenario-link:hover { text-decoration: underline; }

/* Stack */
.stack-grid {
  display: grid;
  gap: 0.9rem;
}
@media (min-width: 800px) {
  .stack-grid { grid-template-columns: repeat(3, 1fr); }
}
.stack-item {
  padding: 1.25rem 1.3rem 1.35rem;
  border-radius: var(--radius);
  border: 1px solid rgba(18, 23, 29, 0.1);
  background: var(--paper-2);
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.stack-item:hover {
  border-color: rgba(196, 122, 58, 0.45);
  transform: translateY(-2px);
}
.stack-item.current {
  border-color: rgba(196, 122, 58, 0.55);
  background: linear-gradient(180deg, #FFF8F1, #F7F8FA);
  box-shadow: 0 12px 30px rgba(196, 122, 58, 0.12);
}
.stack-layer {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7A8696;
  margin: 0 0 0.45rem;
}
.stack-item h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font);
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}
.stack-item p {
  margin: 0 0 0.9rem;
  color: #5B6674;
  font-size: 0.95rem;
}
.stack-item a {
  font-weight: 600;
  color: var(--copper);
  font-size: 0.9rem;
}

/* How it works layers */
.layers {
  display: grid;
  gap: 0.75rem;
}
@media (min-width: 720px) {
  .layers { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1000px) {
  .layers { grid-template-columns: repeat(3, 1fr); }
}
.layer {
  position: relative;
  padding: 1.2rem 1.2rem 1.3rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.layer:hover {
  border-color: rgba(196, 122, 58, 0.4);
  transform: translateY(-2px);
}
.layer-num {
  margin: 0 0 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--copper-bright);
}
.layer h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
.layer p {
  margin: 0 0 0.9rem;
  color: var(--muted-2);
  font-size: 0.92rem;
}
.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--muted-2);
}
.badge-available {
  border-color: rgba(63, 168, 122, 0.4);
  color: var(--ok);
  background: rgba(63, 168, 122, 0.08);
}
.badge-partial {
  border-color: rgba(224, 154, 85, 0.4);
  color: var(--copper-bright);
  background: rgba(196, 122, 58, 0.1);
}
.badge-conceptual {
  border-color: var(--line-strong);
  color: var(--muted);
}

/* Wedge */
.wedge-list {
  display: grid;
  gap: 0;
  position: relative;
}
.wedge-list::before {
  content: "";
  position: absolute;
  left: 0.95rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--line-strong), transparent);
  pointer-events: none;
}
.section-light .wedge-list::before {
  background: linear-gradient(180deg, transparent, rgba(18,23,29,0.12), transparent);
}
.wedge-step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem 1.25rem;
  padding: 1.35rem 0;
  border-top: 1px solid rgba(18, 23, 29, 0.08);
  position: relative;
}
.section .wedge-step { border-top-color: var(--line); }
.wedge-step:last-child { border-bottom: 1px solid rgba(18, 23, 29, 0.08); }
.section-light .wedge-step:last-child { border-bottom-color: rgba(18, 23, 29, 0.08); }
.wedge-n {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--copper);
  padding-top: 0.2rem;
  width: 2rem;
  text-align: center;
  background: var(--paper);
  position: relative;
  z-index: 1;
}
.section:not(.section-light) .wedge-n { background: var(--ink); color: var(--copper-bright); }
.wedge-step h3 {
  margin: 0 0 0.35rem;
  font-family: var(--font);
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}
.wedge-step p {
  margin: 0;
  color: #5B6674;
  max-width: 48ch;
}
.section:not(.section-light) .wedge-step p { color: var(--muted-2); }

.dx-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin: -0.6rem 0 1.6rem;
  font-size: 0.92rem;
  font-weight: 600;
}
.dx-links a {
  color: var(--copper-bright);
  border-bottom: 1px solid transparent;
}
.dx-links a:hover {
  border-bottom-color: var(--copper-bright);
}

.code-panel {
  border-radius: 16px;
  border: 1px solid var(--line-strong);
  background: #0A0D10;
  overflow: hidden;
}
.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.8rem;
  font-family: var(--font-mono);
}
.code-panel pre {
  margin: 0;
  padding: 1.15rem 1.2rem 1.35rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.55;
  color: #D5DCE5;
}
.code-panel .kw { color: #E09A55; }
.code-panel .fn { color: #7DC4A0; }
.code-panel .cm { color: #6B7785; }
.code-panel .str { color: #C9B08A; }
.copy-btn {
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--muted-2);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
  font-size: 0.75rem;
}
.copy-btn:hover { color: var(--text); border-color: var(--copper); }

.deny-allow {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
@media (min-width: 720px) {
  .deny-allow { grid-template-columns: 1fr 1fr; }
}
.pill-result {
  padding: 1.1rem 1.15rem;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
}
.pill-result.deny { border-color: rgba(211, 90, 74, 0.4); background: rgba(211, 90, 74, 0.06); }
.pill-result.allow { border-color: rgba(63, 168, 122, 0.4); background: rgba(63, 168, 122, 0.06); }
.pill-result strong {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}
.pill-result.deny strong { color: var(--deny); }
.pill-result.allow strong { color: var(--ok); }
.pill-result p {
  margin: 0;
  color: var(--muted-2);
  font-size: 0.92rem;
}

/* Walkthrough */
.demo-note {
  display: inline-block;
  margin: -1.2rem 0 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: #7A8696;
}
.example-grid {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 900px) {
  .example-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 1.5rem;
    align-items: start;
  }
}
.timeline {
  display: grid;
  gap: 0.45rem;
}
.step-tab {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem;
  text-align: left;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(18, 23, 29, 0.1);
  background: var(--paper-2);
  color: var(--text-dark);
  transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.step-tab:hover { border-color: rgba(196, 122, 58, 0.35); }
.step-tab[aria-selected="true"] {
  border-color: rgba(196, 122, 58, 0.55);
  background: linear-gradient(180deg, #FFF8F1, #F7F8FA);
  box-shadow: 0 8px 22px rgba(196, 122, 58, 0.1);
}
.step-index {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--copper);
  padding-top: 0.15rem;
}
.step-tab strong {
  display: block;
  font-family: var(--font);
  font-size: 0.98rem;
  letter-spacing: -0.02em;
  margin-bottom: 0.2rem;
}
.step-tab .detail {
  display: block;
  font-size: 0.84rem;
  color: #5B6674;
  line-height: 1.4;
}
.walk-panel {
  border-radius: 16px;
  border: 1px solid rgba(18, 23, 29, 0.1);
  background: #fff;
  padding: 1.35rem 1.35rem 1.25rem;
  box-shadow: 0 16px 40px rgba(18, 23, 29, 0.06);
}
.walk-panel h3 {
  margin: 0;
  font-family: var(--font);
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}
#wedge-panel-detail {
  margin: 0.55rem 0 1.1rem;
  color: #5B6674;
  font-size: 0.95rem;
}
.walk-meta {
  margin: 0 0 1rem;
  display: grid;
  gap: 0.55rem;
}
.walk-meta div {
  display: grid;
  gap: 0.2rem;
  font-size: 0.86rem;
}
.walk-meta dt {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7A8696;
}
.walk-meta dd {
  margin: 0;
  color: var(--text-dark);
  word-break: break-word;
}
.walk-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.86rem;
  color: #5B6674;
}
.walk-status .dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 0 3px rgba(63, 168, 122, 0.18);
}

/* Architecture */
.arch {
  display: grid;
  gap: 0.55rem;
  max-width: 640px;
}
.arch-arrow {
  text-align: center;
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1;
}
.arch-layer {
  display: grid;
  gap: 0.35rem;
  padding: 1.2rem 1.3rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
}
.arch-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--copper-bright);
}
.arch-layer strong {
  font-family: var(--font);
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}
.arch-layer > span:not(.arch-tag):not(.arch-here) {
  color: var(--muted-2);
  font-size: 0.9rem;
}
.arch-layer a {
  margin-top: 0.35rem;
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--copper-bright);
}
.arch-what {
  border-color: rgba(196, 122, 58, 0.45);
  background: linear-gradient(160deg, rgba(196, 122, 58, 0.12), rgba(20, 25, 31, 0.4));
  box-shadow: 0 12px 32px rgba(196, 122, 58, 0.1);
}
.arch-here {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ok);
  margin-top: 0.25rem;
}

.final {
  padding: 5.5rem 0 6rem;
  text-align: center;
  background:
    radial-gradient(60% 80% at 50% 0%, rgba(196, 122, 58, 0.18), transparent 60%),
    var(--ink);
}
.final h2 {
  margin: 0 auto 0.8rem;
  max-width: 14ch;
  font-family: var(--font);
  font-size: clamp(2rem, 4.5vw, 3rem);
  letter-spacing: -0.045em;
}
.final p {
  margin: 0 auto 1.6rem;
  color: var(--muted-2);
  max-width: 38ch;
}
.final .hero-ctas { justify-content: center; }

.site-footer {
  border-top: 1px solid var(--line);
  padding: 2.75rem 0 2rem;
  color: var(--muted);
  font-size: 0.88rem;
}
.footer-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}
@media (min-width: 800px) {
  .footer-grid {
    grid-template-columns: 1.4fr repeat(3, 1fr);
  }
}
.footer-brand p {
  margin: 0.85rem 0 0;
  max-width: 28ch;
  color: var(--muted);
  line-height: 1.5;
}
.footer-col h4 {
  margin: 0 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-2);
}
.footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}
.footer-col a:hover { color: var(--text); }
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  font-size: 0.82rem;
}
.footer-bottom a:hover { color: var(--text); }

.price-note {
  margin: 1.25rem 0 0;
  font-size: 0.88rem;
  color: var(--muted);
}
.section-light .price-note { color: #6A7583; }
`;
}
