# The Infographic: Part A of the Blueprint

Every blueprint opens with the infographic: the one-shot capture of the whole document, on wide sheets, before the in-depth part begins. A client who reads nothing else should get the diagnosis, the prescription, the sequence and the rules from these sheets alone. It is not a summary bolted on; it is the same evidence, drawn.

The infographic and the written part are one document, one triplet, one DWG number. They render together from one HTML file (the template's Part A and Part B), and the sheet counter runs across both.

## The fixed spine

Ten panel positions. Seven are fixed and appear for every client; three are diagnostic slots filled from a menu. Panels are numbered 01 to 10 in order with no gaps: if a client's evidence supports only two diagnostic panels, the build panels renumber so the sequence stays continuous.

| # | Panel | Chart | Rule |
|---|---|---|---|
| 01 | THE NUMBERS | Dashboard tiles | **Fixed.** 8 or 9 tiles, straight from the form's numbers panel, wording preserved. Mark 1 or 2 tiles hot (orange value): the figure that carries the finding, and any zero worth staring at ("0 leaks measured"). One caption line reads the tiles: the single most important arithmetic fact, bolded. |
| 02 | THE MONEY PATH TODAY | Flowchart | **Fixed.** Every station of the client's money path as a numbered box: name plus a 2-4 word state note. Stations named as breakdown points get the `broken` class (orange fill). Legend row closes with the standing truth of the whole path in the client's terms. |
| 03-05 | Diagnostic slots | From the menu below | **2 or 3 panels, chosen from evidence.** Two small ones share a row (`.duo`); a full-width one stands alone. Never invent a diagnosis to fill a slot: a client with no failed app gets no before/after panel. |
| 06 | RECOMMENDED AI SYSTEMS | Chain cards, 3-up grid | **Fixed.** One card per system: code and window, name, a 5-7 chip chain from trigger to outcome, side annotations tying guardrails and adoption fixes to specific steps, and a SOLVES footer naming the painkiller. Closes with the tool-disposition caption (kept / dropped, tools bolded). |
| 07 | IMPLEMENTATION ROADMAP | Gantt + done-whens | **Fixed.** One row per system, bars placed in month columns with a short note each, phase names spanning the header. Below: one DONE WHEN box per phase, states middot-separated. |
| 08 | WHY THIS BUILD ORDER | 2x2 matrix | **Fixed.** Axes chosen per client (the recurring pair: impact vertical, dependence-on-human-change horizontal). Phase 1 systems sit in the build-first quadrant with tinted cards; every quadrant carries an arrow verdict line. Caption states the axis meaning and the sequencing sentence. |
| 09 | GUARDRAILS | Three-lane swimlane | **Fixed.** AI ACTS ALONE / HUMAN SIGNS OFF / NEVER AUTOMATED. Tags condensed from the client's form section 10 answers; never-lane tags render orange-filled. Caption carries the running-cost line where one was discussed. |
| 10 | NEXT STEPS | Numbered action cards | **Fixed.** The same 4-7 actions as the written section 06, compressed to one line each with owners. |

Two footer strips punctuate the sheets: one after the last diagnostic panel (the current-state group: business, sites, stack kept, stack dropped), one after panel 10 (the build group: scope, window, sources), followed by the infographic trace line ending "the in-depth blueprint follows".

## The diagnostic menu

Pick the 2 or 3 whose evidence is loudest in the section 1 material. Each panel must answer: which pain callout or flagged finding does this draw?

| Chart | Use when | Component |
|---|---|---|
| **Funnel** | Volume shrinks or inflates between stages: leads to quotes to orders, and one stage is out of proportion. The mid tier renders orange when it is the anomaly. | `.funnel` |
| **Layer pyramid** | A layer is hollow: an empty management layer, a missing data layer, a process tier nobody owns. The hollow tier renders orange with a dashed reading. | `.pyr` |
| **Before/after cards** | A past failure or a stated fear shapes the build: a dead app, an abandoned CRM, a burned agency engagement. Each card: what happened, then the countermeasure designed in. This panel is the adoption argument drawn. | `.ba` |
| **Comparison bars** | Two or three magnitudes tell the story: priced leaks side by side, one channel dwarfing the rest, time spent vs time available. Widths proportional; the largest bar filled orange. | `.cbars` |
| **Split / entity map** | The story is fragmentation: four GST companies, five entities, eight tools, data in six places. One card per fragment naming what lives there; the caption states the cost of the split. | `.split` |

If none of the five fits and the evidence begs for a different drawing, draw it in the same language (rule borders, one orange, mono labels) and note the addition; the menu grows by what works, not by whim.

## Sourcing rules, unchanged from the prime directive

- Every figure on every panel already exists in the written part or the form; the infographic introduces no new numbers, no new claims, no new systems.
- Client wording survives compression. A tile label may shorten "quote to order conversion" to "QUOTE -> ORDER"; it may not change 10-15% to "~12%".
- Flagged contradictions stay flagged: a disputed figure never appears on a tile as if settled. Use the form's value and let the written section 05 carry the flag.
- Hot (orange) highlighting marks findings, not preferences. A tile goes hot because the evidence pass made it load-bearing.

## Layout mechanics

- Part A uses the named page `infog` (842pt x 1191pt); content flows across as many wide sheets as it needs, typically 2 or 3. Every `.panel` carries `page-break-inside: avoid`, so panels move whole between sheets.
- Panel 06's grid is 3 cards per row. 6 systems = 2 rows; 7-9 systems = 3 rows. Keep chains at 5-7 chips; spill detail into the side annotations, not into more chips.
- The gantt takes one header pair plus one row per system. With more than 4 phases or 8 systems, shrink notes before shrinking type.
- After rendering, look at every wide sheet: a panel split across sheets, a tile row wrapped, or a chain overflowing its card blocks shipping, same as any Part B defect.
