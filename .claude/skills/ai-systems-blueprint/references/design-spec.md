# Design Specification and Production

The design is a technical drawing: graph-paper grid, one orange, monospaced labels, framed cards. It is fully specified, so nothing is chosen per document. Do not restyle the template, do not introduce a second accent colour, do not swap fonts. The visual consistency is part of what tells a client they are dealing with a firm that has a method.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--orange` | `#e8590c` | The only accent: bars, borders, labels. |
| `--orange-soft` | `#fdeee2` | Inline code-chip background. |
| `--orange-faint` | `#fdf6f0` | PAIN and guardrail callout backgrounds. |
| `--ink` | `#1f2430` | Body text. |
| `--grid` | `rgba(232,89,12,0.07)` | 24px graph-paper grid on paper `#fdfbf9`. |
| `--rule` | `#e9c7ae` | Dotted hairlines inside cards and tables. |
| `--mono` | Consolas, Courier New | All labels: uppercase, letter-spaced 1.5 to 3px, 8.5 to 10.5px. |
| `--sans` | Segoe UI, Helvetica, Arial | Body 13.5px / 1.6, justified. H1 46px weight 800. Section titles 17px bold. |

## Components

All defined in the template, all reusable: cover frame with title block and flow chips; section head (orange number block, title, right tag); numbered subsections with orange mono numbers; PAIN callout; system card (orange header bar, dotted row rules, mono row labels); phase card; guard callout; METRIC / VALUE table with orange header row; numbered step blocks; dashed note block; trace line; inline code chips.

Structural CSS worth knowing when a page breaks badly: cards carry `page-break-inside: avoid`, section heads carry `page-break-after: avoid`, and the cover carries both so it stays on one sheet. Running heads, feet and sheet numbers come from `@page` margin boxes with `counter(page)` and `counter(pages)`, so sheets number themselves and you never hand-number anything.

## Production pipeline

1. **Draft the content** as `{Client Name} AI Systems Blueprint.md`, following the fixed running order. The markdown is a deliverable in its own right, so keep it clean and complete; it is the editable source for every future revision.

2. **Pour it into the template.** Copy `assets/blueprint-template.html`, replace every `{{PLACEHOLDER}}`, delete the optional blocks you did not use (the foundation card, the deferral note block). The template's HTML comments mark where each repeating element goes.

3. **Render the PDF** with the bundled script, which tries WeasyPrint and falls back to headless Chrome:

   ```bash
   python scripts/render_pdf.py "{Client} AI Systems Blueprint.html"
   ```

   Both engines honour the `@page` rules, so output is equivalent. On Windows machines without the GTK libraries, WeasyPrint will fail to import and the script silently uses Chrome instead.

4. **Read every rendered page.** Check that no card breaks across a sheet, the cover fits one sheet, the sheet count lands between 7 and 10, and the running heads and feet are right. Fix in the HTML, re-render. Rendering without looking at the result is how a broken card reaches a client.

5. **Save the triplet** (.md, .html, .pdf) in the client's folder. Revisions get a new triplet ("… v2" or "… Rev B") and the previous one is renamed "(v1 archive)". Never delete a shipped document: the archive is what lets you answer "what did we tell them in August?"

## Template placeholders

`{{COMPANY}}` `{{NAME}}` `{{ROLE}}` `{{N}}` (system count) `{{M}}` (phase count) `{{ANCHOR}}` (deadline anchor) `{{DATE}}` and the generic `{{PLACEHOLDER}}` markers inside each content block. Search the file for `{{` before rendering; any survivor means an unfilled field, which is the single most common defect in a first draft.
