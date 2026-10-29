# `@opp/parse`

Markdown → Open Program rows. Compatible with Coppergate architecture `OPEN_PROGRAM.md` tables and checklists.

## Install (workspace)

```bash
pnpm add @opp/parse --filter <your-package>
```

## Usage

```ts
import {
  parseOpenProgramMarkdown,
  toOpenProgramDocument,
  summarizeProgram,
} from "@opp/parse";

const rows = parseOpenProgramMarkdown(markdown);
// [{ id: "P-060", title: "…", status: "open" | "done", section?, notes? }, …]

const doc = toOpenProgramDocument({
  programId: "coppergateai/opp",
  title: "OPP Open Program",
  markdown,
});

const { openCount, doneCount, openIds } = summarizeProgram(rows);
```

## Recognized shapes

- Pipe tables with `Open` / `Done` (also Closed / Merged / Shipped) status cells
- Checklists `- [ ]` / `- [x]` with Open IDs
- IDs matching `(P|W|A|S|AG|RT|SEC)-\d{2,4}`

Section headings (`##` / `###`) attach to following rows when present.

## Related

- Spend License + receipt verify: [`@opp/verify`](../opp-verify/README.md)
- HTTP: [`@opp/client`](../opp-client/README.md) → `parseProgram`
- Schema types: `@opp/schema`
