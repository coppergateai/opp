/** OPP mark — open ledger stamp with copper seal. */

export function renderMark(options?: {
  size?: number;
  className?: string;
  title?: string;
}): string {
  const size = options?.size ?? 28;
  const className = options?.className ? ` class="${options.className}"` : "";
  const title = options?.title ?? "OPP";
  return `<svg${className} width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <rect class="opp-mark-plate" x="3" y="4" width="26" height="24" rx="3"/>
  <path class="opp-mark-rule" d="M8 11h16M8 16h16M8 21h10" stroke-width="1.5" stroke-linecap="round"/>
  <circle class="opp-mark-seal" cx="23" cy="21" r="4.2"/>
  <circle class="opp-mark-seal-hole" cx="23" cy="21" r="1.4"/>
</svg>`;
}

export function renderWordmark(options?: { size?: number; className?: string }): string {
  const size = options?.size ?? 28;
  const className = options?.className ? ` class="${options.className}"` : ' class="brand"';
  return `<a href="/"${className} aria-label="OPP home">
    ${renderMark({ size })}
    <span class="brand-word">OPP</span>
  </a>`;
}
