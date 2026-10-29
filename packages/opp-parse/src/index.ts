import {
  normalizeOpenId,
  type OpenProgramDocument,
  type OpenProgramRow,
  OPP_PROTOCOL_VERSION,
} from "@opp/schema";

const ID_RE = /\b((?:P|W|A|S|AG|RT|SEC)-\d{2,4})\b/i;

function cleanCell(raw: string): string {
  return raw
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse Open + Done program table/checklist rows from markdown.
 * Compatible with Coppergate architecture Open Program format.
 */
export function parseOpenProgramMarkdown(markdown: string): OpenProgramRow[] {
  const out: OpenProgramRow[] = [];
  const seen = new Set<string>();
  const lines = markdown.split(/\r?\n/);
  let section: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const heading = line.match(/^#{2,3}\s+(.+)$/);
    if (heading) {
      section = cleanCell(heading[1]!).slice(0, 120);
      continue;
    }

    if (/^\|?\s*:?-{3,}/.test(line)) continue;

    const idMatch = line.match(ID_RE);
    if (!idMatch) continue;
    const id = normalizeOpenId(idMatch[1]!);
    if (seen.has(id)) continue;

    const isTable = line.includes("|");
    const isChecklist = /^\s*[-*]\s*\[[ xX]\]/.test(line);
    if (!isTable && !isChecklist && !/^\s*[-*]\s+/.test(line)) continue;

    let status: "open" | "done" | null = null;
    if (/\|\s*(Done|Closed|Merged|Shipped)\s*\|/i.test(line)) {
      status = "done";
    } else if (/\|\s*Open\s*\|/i.test(line)) {
      status = "open";
    } else if (/^\s*[-*]\s*\[[xX]\]/.test(line)) {
      status = "done";
    } else if (/^\s*[-*]\s*\[ \]/.test(line) || /\bOpen\b/i.test(line)) {
      status = "open";
    } else if (
      /\b(done|closed|merged|shipped)\b/i.test(line) &&
      !/\bOpen\b/i.test(line)
    ) {
      status = "done";
    } else if (isChecklist || /^\s*[-*]\s+/.test(line)) {
      status = "open";
    }

    if (!status) continue;

    let title = "";
    let notes = "";

    if (isTable) {
      const cells = line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => cleanCell(c));
      const idIdx = cells.findIndex((c) => new RegExp(`^${id}$`, "i").test(c));
      if (idIdx >= 0) {
        const afterId = cells.slice(idIdx + 1).filter((c) => {
          if (!c) return false;
          if (/^(Open|Done|Closed|Merged|Shipped)$/i.test(c)) return false;
          return true;
        });
        title = afterId[0] ?? "";
        notes = afterId.slice(1).join(" — ");
      }
    } else {
      title = line
        .replace(/^\s*[-*]\s*\[[ xX]?\]\s*/, "")
        .replace(/^\s*[-*]\s+/, "")
        .replace(new RegExp(id, "i"), "")
        .replace(/^[:\-–—]+\s*/, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    title = title.replace(/^[:\-–—]+\s*/, "").slice(0, 200);
    if (title.length < 3) title = id;
    notes = notes.slice(0, 500);

    seen.add(id);
    out.push({ id, title, notes, status, section });
  }

  return out;
}

export function toOpenProgramDocument(input: {
  programId: string;
  title: string;
  markdown: string;
  source?: OpenProgramDocument["source"];
}): OpenProgramDocument {
  return {
    protocolVersion: OPP_PROTOCOL_VERSION,
    programId: input.programId,
    title: input.title,
    source: input.source,
    rows: parseOpenProgramMarkdown(input.markdown),
    createdAt: new Date().toISOString(),
  };
}

export function summarizeProgram(rows: OpenProgramRow[]): {
  openCount: number;
  doneCount: number;
  openIds: string[];
} {
  const open = rows.filter((r) => r.status === "open");
  const done = rows.filter((r) => r.status === "done");
  return {
    openCount: open.length,
    doneCount: done.length,
    openIds: open.map((r) => r.id),
  };
}
