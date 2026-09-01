# Master Copy: Creating the AI Systems Blueprint

**BuildOur AI · Master SOP · DWG NO. BOA-2026-MST-01 · REV B**

*Rendered from the ai-systems-blueprint skill on 01.09.2026. The skill is the single source of truth: edit the skill, re-run `scripts/render_master.py`, never edit this document directly.*


---

# PART 01 · The Method

# Creating the AI Systems Blueprint

The AI Systems Blueprint is the first substantial deliverable a client receives after their audit. It plays the client's business back to them in their own words, names exactly where that business hurts and what the pain costs, prescribes AI systems that each point at a named pain, and sequences those systems into phases with testable finish lines, wrapped in the safety rules the client themselves set. Diagnosis, proposal and build contract in one document, and that document opens with its own one-shot capture: the infographic, ten panels on wide sheets that draw the whole story before the in-depth part argues it.

The test of a good one: the client's reaction is recognition. *This is my business, and this is my plan.*

## The entry gate: both inputs, or no blueprint

A blueprint is written only when **both** the filled audit form and the audit call are on file. Check this before anything else.

Neither input substitutes for the other, because they fail in opposite directions. The form is precise and shallow: real figures, real guardrail answers, often single words, with no explanation behind any of them. The call is rich and imprecise: the stories, the worked examples, the vetoes, the client's own sentences, none of it tabulated. A blueprint needs both halves. A document built on one of them is not a thin blueprint, it is a weaker artefact wearing the format, and it will not survive contact with the client, because the questions it could not ask are exactly the ones the call exists to ask.

**When an input is missing, do not produce a blueprint, even a labelled or provisional one.** Say plainly what is missing and what it blocks. The genuinely useful thing you can offer instead: run the evidence pass on whatever does exist and turn the gaps into an agenda for the call, so the call comes back sharper. Deliver that as notes, never in the blueprint format, because a document that looks like the deliverable will be read as the deliverable.

## The prime directive

Every recommendation, figure and quote traces to the audit call, the submitted Systems Brief, or a dated client document. No figures are invented. Unknowns are named, not guessed. Contradictions are flagged, not resolved.

This is not a stylistic preference, it is the whole basis of the document's authority. A blueprint that guesses one number is a blueprint the client cannot trust on any number. Every blueprint closes with a sentence claiming this traceability, and that sentence has to be true.

Corollary rules, each with its reason:

- **Never soften or prettify a client quote.** Their sentences name the pains and set the guardrails. Typos, Hindi, Gujarati, all of it stays. Your job is arrangement, not improvement.
- **Never add a system that has no pain to point at.** A prescription without a diagnosis is a sales pitch.
- **Never skip the evidence pass.** It is what separates a traced blueprint from a generic one.
- **No em dashes anywhere.** House rule: commas, colons, periods, middots.

## The pipeline

Work these in order. Steps 3 to 5 are judgment; the rest is deliberately mechanical, because mechanical is what makes different clients receive documents that feel like one firm produced them.

1. **Collect the inputs and check the entry gate.** The client folder must hold both required inputs, the filled Systems Brief export and the audit call VTT, plus any extra assets the client supplied (specs, price sheets, spreadsheets, self-built apps, review documents). Date everything. If either required input is missing, stop here and report it per the entry gate above.
2. **Clean the transcript.** Strip cue numbers and end timestamps, merge consecutive lines by the same speaker into single turns, drop backchannel noise ("hmm", "okay", ASR artefacts). Never rewrite, never infer. Garbled speech stays garbled and gets disclosed. Save as `{Client} Audit Call (Cleaned).md`.
3. **Run the evidence pass.** See below. Read everything before writing a word.
4. **Design the systems.** See below.
5. **Sequence the roadmap.** See below.
6. **Design the infographic.** Fill the fixed spine and pick the 2-3 diagnostic panels the evidence supports. Read `references/infographic-spec.md`: the panel inventory, the diagnostic menu, and the sourcing rules (no figure appears first on a panel).
7. **Write and typeset.** Draft `{Client} AI Systems Blueprint.md` in the fixed running order (Part A panels, then Part B sections), pour it into the template, render the PDF. Read `references/document-structure.md` for the section-by-section spec, including which written sections compress now that the panels carry them, and `references/design-spec.md` for the template and rendering mechanics.
8. **Run the quality gate and deliver.** `references/quality-gate.md`. Save the triplet in the client's folder, then book the review call. What comes back starts the Rev B cycle (`references/revisions.md`).

## The inputs

**The audit form ("My Systems Brief")** is the same 44 questions for every client. Its numbering jumps from section 7 straight to 9 in every export; that is normal, do not go hunting for a section 8. It ships localized, so answers may arrive in Gujarati or Hindi. Each section feeds a specific part of the blueprint:

| Form section | Feeds |
|---|---|
| 1 · Wishlist & Endgame | Executive summary framing. The "I never want to manually ___ again" list seeds the system list. Fears become design rules. The six-month picture becomes the final "done when". |
| 2 · One-Line Business | Cover BUSINESS field, opening of the executive summary. |
| 3 · Money Path | The §1 subsection skeleton and the cover flow chips. Steps marked with the gear icon are manual: your automation candidates. |
| 4 · People Map | Adoption logic, the internal champion, the headcount cross-check, the owner's hours per week. |
| 5 · Apps you pay for | Cover CURRENT STACK, and the keep / retire / supersede note in §2. Paid-but-ignored tools become next steps. |
| 6 · Numbers Panel | The §5 table, exactly as provided. |
| 7 · Leak List | The PAIN callouts, priced where the client priced them. The loudest priced leak usually decides Phase 1. |
| 9 · Build List + Painkillers | The seed of the system list. Painkiller #1 is the strongest single signal in the form. |
| 10 · Guardrails & Finish Line | The §4 Guardrails section, near-verbatim, plus the error protocol, customer-facing comfort, "worth it if", and the deadline anchor. |

**The audit call** adds what the form cannot: the stories behind the answers, worked examples with real figures, decisions made live, and the client's exact words. Mark anything that exists only on the call as *(call-only)*.

Audit calls run in Hinglish or regional languages and auto-transcription garbles them, sometimes badly. Lean on the written brief wherever the call is unclear and say so in Sources. Quote verbatim only where the transcript is clean, otherwise mark *(paraphrase)*. Where the transcript fails entirely, recommend a re-listen as a next step. Never present a reconstructed sentence as a quote.

**Extra client assets** (a self-built app, a costing spec, a vision document, a review reply) are governing sources. Date them, list them in Sources, cite them where they drive a decision. When a newer client document conflicts with an earlier statement, the newer and more specific wins, and the blueprint says so explicitly.

## The evidence pass

Read the full form and the full transcript once, extracting as you go. Note the source of every entry: *(form)*, *(call)*, *(call-only)*, or a dated document. When the pass is done you should be able to write the whole blueprint without reopening the sources, except to verify quotes.

Extract: the business one-liner; the money path step by step; the current stack with dispositions; the pains in the client's words; the rupee-priced leaks; every number with its exact wording including "(estimate)" markers; contradictions and typos; the guardrail answers verbatim; the never-again list and top 3 painkillers; the deadline anchor, hours per week and busy season; adoption signals and the champion; and the client's own system vision if they arrived with one.

Three habits carry most of the weight here:

**Flag, don't fix.** A form saying average order value "1000020000", a headcount of 10 beside a function split summing to 27, or "busiest months: 6" is never silently corrected. Each becomes a numbered confirm item in §5 and reappears in Next Steps. Silently fixing a number destroys the client's ability to trust the rest, and the correct value is theirs to supply, not yours to infer.

**Name unknowns as findings.** A funnel nobody measures is itself a diagnosis, not a gap in your research. The standing formulation: "Not a criticism, a finding: the funnel isn't measured because it isn't in a system." Where a recommended system will produce the missing number as a side effect, say so.

**Preserve their language.** *"copy-paste, copy-paste. I want one system where one file works from the start"* is worth more than any polished restatement, because it is evidence rather than assertion.

## Designing the systems

Aim for 6 to 9. Fewer usually means distinct pains got merged; more than the roadmap can carry.

The design test for every card: point at the §1 subsection it solves. If you cannot, cut it, however clever it is.

Where systems come from, in order of authority: the client's own draft build list and painkillers (form §9), their never-again list (form §1), pains named on the call, and only then your own pattern knowledge. Many clients arrive with the system already sketched. The strongest blueprints say so plainly ("Kishore arrived with the system already designed in his head, and it is a good one") and keep the client's structure and sequence. Fix the platform, not their process, unless their process is the pain.

Card anatomy:

- **Bar:** name in plain English plus function, ALL CAPS, code on the right (`SYS-0N`), optionally with a status (`POC AGREED`, `MONTH-1 SYSTEM`, `PROMOTED TO CORE`).
- **WHAT IT DOES** (always): the mechanism in 2 to 4 sentences, concrete enough that a developer could scope it and the client recognizes their own workflow inside it. Encode chains as code chips: `event -> rule -> action -> next task -> deadline -> escalate`.
- **SOLVES** (always): the named pain with its § reference plus the client's words where they exist.
- **GUARDRAIL:** required whenever the system touches money, customers or outbound messages. States the human gate: "AI drafts, the team sends."
- **Optional rows,** used selectively: ADOPTION, ENTRY POINT (an agreed POC), NOTE or OPEN INPUT (a decision still owed), BUILD (dependencies and build type).

When the architecture needs a shared data core that every system plugs into, it gets the first card as `F-00 · FOUNDATION` with rows WHAT IT IS and WHY FIRST.

When the client defers a system it does not vanish: it becomes `D-01` in a dashed note block carrying the reason in their terms, the interim carrier ("the current ChatGPT flow carries this meanwhile"), and the re-entry condition ("revisited after Phase 3 is stable, not assumed"). Parked, not dropped, so the client sees their own decision reflected rather than wondering if you forgot.

Close §2 with a tool-disposition note covering every paid app from form §5: what stays, what retires, what is superseded, and what is paid-but-ignored.

## Sequencing the roadmap

3 or 4 phases, coded P1 to P4. The intro paragraph must state the constraints it was sequenced for: the owner's hours per week, the deadline anchor, the busy season, and the critical path.

**Phase 1 stops the bleeding.** It attacks the loudest daily pain, runs on data that already exists so there is no long digitisation wait, produces wins the team can see in weeks, and sets the adoption pattern early: the system hands people their next task, it does not audit them.

**Data before dreams.** When the client's data lives on paper, in WhatsApp or in heads, a data foundation runs as Phase 0 or as a parallel Track 0 starting immediately. Say the honest sentence when it is true: "Track 0 is not optional and Phase 1 fails without it."

**Every phase ends in DONE WHEN,** an observable state, never an activity. "Outreach runs weekly without the receptionist sending a single manual email" passes. "Email system implemented" does not, because nobody can stand in front of it and agree it happened. The final phase's done-when should echo the client's own "worth it if" answer.

**Trust ramps and parallel runs.** Where trust must be earned, phase it inside the phase: "month 1: AI drafts, humans press send; month 2: autonomous." Nothing existing is switched off until its replacement has run beside it and proven itself.

Phase card: `P1` plus an evocative title ("STOP THE MANUAL BLEEDING"), a right tag naming systems and timing (`SYS-01 + SYS-04 · FIRST WEEKS`), rationale prose (P1 carries an explicit "Why first:"), then DONE WHEN.

## Voice

- **Diagnose before prescribing.** §1 earns §2. Explain the business back to itself so precisely that the client nods before reaching a single recommendation.
- **Cross-reference everything.** Every SOLVES points at a §1.x; next steps point at systems; interpretations point at the rows they read. The document is a web, not a list.
- **Short, declarative, active.** One earned aphorism per section at most; more and it reads like copywriting.
- **Write for two readers:** the owner who decides and the team member who will run the system. Explain jargon inline the first time (BOM, GRN, KRA). Name real staff so workflows read as the client's actual office.
- **Price the pain where the client did,** and translate where it lands: "a forgotten order at a 50% repeat rate is a relationship cost, not just one lost bill." Never invent a rupee figure to make a pain sound bigger.
- **Evidence persuades, selling repels.** No superlatives about our systems, no fear-mongering about AI, no promises without a done-when. The document's confidence is its traceability.

## Reference files

Read these when you reach the matching step rather than all at once:

- `references/document-structure.md` · the two-part running order, cover anatomy, the compression rules for the written back sections, and their detail. Read before drafting.
- `references/infographic-spec.md` · Part A: the ten-panel spine, the diagnostic chart menu, sourcing rules and layout mechanics. Read at pipeline step 6.
- `references/design-spec.md` · design tokens, component inventory, template placeholders, and the render pipeline. Read before typesetting.
- `references/quality-gate.md` · the 11-check gate. Run before delivering, every time.
- `references/revisions.md` · Rev B and the delta discipline. Read when new client input lands on a shipped blueprint.
- `assets/blueprint-template.html` · the v3 template: Part A (infographic, wide sheets) + Part B (in-depth, A4) in one file. Copy it, fill it, do not restyle it.
- `scripts/render_pdf.py` · renders the HTML to PDF (WeasyPrint if present, else headless Chrome). Run it rather than reinventing the command.


---

# PART 02 · Document Structure

# Document Structure

The fixed running order. Section numbers, titles and right-side tags are exactly these; only the bracketed values change per client. Consistency here is what makes twelve different clients receive documents that read as one firm's work.

The document has two parts in one file and one PDF. **Part A, the infographic**, opens it: the one-shot capture on wide sheets, panels 01 to 10 per `references/infographic-spec.md`. **Part B, the in-depth blueprint**, follows on A4 sheets in the running order below. Because Part A carries the figures, the timeline, the guardrail lists and the action list visually, four written sections compress to what the panels cannot hold; the table's Content column states each rule.

| No. | Section title | Right-side tag | Content |
|---|---|---|---|
| A | **Infographic** (wide sheets) | – | Panels 01-10 per `infographic-spec.md`: fixed spine plus 2-3 diagnostic panels from the menu. Typically 2-3 wide sheets. |
| – | **Cover** (first A4 sheet) | – | Opens Part B. See "Cover anatomy" below. |
| 00 | EXECUTIVE SUMMARY | Overview | 3 to 4 paragraphs: who the client is and what they said plainly; how the business runs and where it leaks; what this blueprint recommends (N systems in M phases) and the anchors it respects. Open with the client's strongest sentence when you have one. |
| 01 | CURRENT STATE | How work happens today, and where it hurts | Subsections 1.1 to 1.N (typically 5 to 9), ordered along the money path. Each: a short narrative, then a PAIN callout. Mark call-only subsections. |
| 02 | RECOMMENDED AI SYSTEMS | {N} systems | System cards, plus the tool-disposition note and any deferral note blocks. |
| 03 | IMPLEMENTATION ROADMAP | {M} phases · {anchor} | COMPRESSED: panel 07 carries the timing. Keep the constraints intro and the phase cards with rationale and DONE WHEN; drop prose that only restates the gantt. |
| 04 | GUARDRAILS | Set by {first name}, enforced by design | COMPRESSED: panel 09 carries the swimlane. Keep only the client's verbatim sentences and the error protocol, as guard callouts. |
| 05 | THE NUMBERS | Flagged, not resolved | COMPRESSED: panel 01 carries the figures. Keep only the numbered confirm items and at most one interpretation paragraph. The full table returns only if a figure's exact wording could not survive on a tile. |
| 06 | NEXT STEPS | Detail behind panel 10 | COMPRESSED: panel 10 carries the actions. Keep only steps needing detail the panel could not hold (data homework with columns, access checklists). If nothing needs expanding, one paragraph pointing at panel 10. |
| – | Trace line | – | The closing oath, dated. |

Target 8 to 12 sheets total: 2-3 wide sheets for Part A, 6-9 A4 sheets for Part B. Sections 00, 01 and 02 stay full length; the diagnosis and the system cards are what earn the client's recognition, and no chart replaces them.

## Section 01 · Current State

Order the subsections along the client's money path, so the document walks their business the way money actually moves through it: enquiry, quotation, order, production, dispatch, payment, repeat. Each subsection is a short narrative followed by a PAIN callout in the client's own words.

Skip the PAIN callout only where no pain was named. A subsection that exists purely to describe something working fine is legitimate and should not be given an invented complaint.

Mark subsections that rest only on the call as *(call-only)*, so a reader comparing the blueprint against the written brief is never confused about where a finding came from.

## Section 04 · Guardrails

Title: GUARDRAILS. Tag: "Set by {first name}, enforced by design". This section is the client's form §10 answers, near-verbatim, hardened into mechanism. Each guardrail is one orange-barred callout with a bold lead-in. The standing vocabulary, extended per client:

- **ALWAYS HUMAN SIGN-OFF:** their exact list. Quotations and commitments to clients appear here for almost every client.
- **AI MAY ACT ALONE ON:** their delegable list, verbatim.
- **CUSTOMER-FACING:** their comfort answer, quoted: "AI drafts, my team sends" / "AI can message customers directly" / "Not sure yet" (which means everything is drafts-for-approval until they decide).
- **DATA CAUTION / UNTOUCHABLE DATA:** what AI never touches, in their words.
- **ERROR PROTOCOL:** their acceptable way for mistakes to surface and get corrected. Never silent rewrites; an audit trail you cannot trust is worse than none.
- **NOT ANSWERED:** when a guardrail question was left blank, say so, apply a conservative default, and list it for the kickoff call. Unanswered is information, not an excuse to invent a rule.

The reason this section quotes rather than paraphrases: these are the rules the client will be held to and will hold us to. Their exact words prevent a later argument about what was agreed.

## Section 05 · The Numbers

Title: THE NUMBERS. Tag: "Flagged, not resolved". Panel 01's tiles now carry the figures with the client's "(estimate)" markers; this section keeps what a tile cannot say. Two things are allowed and nothing else:

1. The numbered "flagged, not resolved" contradictions, each phrased as a confirm item.
2. At most one interpretation paragraph reading their numbers back to them: "~160 quotes a month do not convert; speed is the cheapest conversion lever available, which is why P1 leads."

Interpretation never introduces a figure the client did not provide. Multiplying two of their numbers to produce a third is inventing a figure.

## Section 06 · Next Steps

Title: NEXT STEPS. Tag: "Immediate actions". 4 to 7 numbered step blocks, each starting with a bold action and carrying a named owner. Standard ingredients, picked as they apply:

- The blueprint review call, framed as "to contradict, add to, or accept as-is".
- The client's data homework.
- The access checklist (logins, WhatsApp Business, workspaces, ERP).
- Commercials and onboarding where payment is still open.
- The flagged numbers to confirm.
- The promise of the Phase 1 build plan as the next deliverable, "deliverables and done-when stated up front, no surprises mid-journey."

## Cover anatomy

- **Running head, every sheet:** left `BUILDOUR AI · CLIENT BLUEPRINT`, right `DWG NO. BOA-{YYYY}-{CODE}-01 · REV {A}`. The code is three letters from the company name: VNV for Vinove, MPK for MyPackify, APT for Aptus, MST for master documents.
- **Running foot, every sheet:** left `{COMPANY} · AI SYSTEMS BLUEPRINT`, right `SHEET n / N`.
- **Frame:** double orange border, cover bar reading "BUILDOUR AI | CLIENT BLUEPRINT".
- **Title:** AI SYSTEMS in ink, BLUEPRINT in orange. Revisions append "· REV B" at reduced size.
- **Subtitle:** `{COMPANY} · PREPARED FOR {NAME}, {ROLE}`, the name in orange bold.
- **Flow chips:** the client's own money path in 5 to 7 stations, dash-connected, with the station where the first build lands filled orange. This is the client's business drawn as a machine, not a generic pipeline, and it is usually the first thing they look at.
- **Title block:** BUSINESS · CURRENT STACK · PREPARED BY · SOURCES (every input, dated) · SYSTEMS SPECIFIED ("7 systems in 3 phases") · DEADLINE ANCHOR. Optional extra fields when relevant: PROGRAM ("Build For You (DFY)") or ENGAGEMENT MODEL, and PRECEDENCE when client documents govern.
- **Cover note:** "EVERY RECOMMENDATION IN THIS DRAWING TRACES TO THE AUDIT CALL OR THE SUBMITTED SYSTEMS BRIEF". On revisions, the supersede line with the previous rev's date.

## The trace line

Every blueprint closes with it, dated:

> Every item in this document traces to the audit call ({date}) or the submitted Systems Brief ({date}). No figures added beyond those the client provided; unknowns are named, not guessed.

Adapt the source list to what actually fed the document, including client review documents and working calls where they exist. On a revision, extend it: "… Rev B supersedes Rev A in full."


---

# PART 03 · The Infographic

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


---

# PART 04 · Design and Production

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

**Part B (A4):** cover frame with title block and flow chips; section head (orange number block, title, right tag); numbered subsections with orange mono numbers; PAIN callout; system card (orange header bar, dotted row rules, mono row labels); phase card; guard callout; METRIC / VALUE table with orange header row; numbered step blocks; dashed note block; trace line; inline code chips.

**Part A (wide sheets):** infographic header with prepared-for box; panel head (orange number badge, bold title, mono tag, ink rule); dashboard tiles with hot variant; money-path flow boxes with broken variant and legend; funnel and layer pyramid (double-layer clip-path: fill layer in rule colour or orange, inner layer inset 1.5px); before/after cards; comparison bars; split cards; 3-up system chain cards with side annotations; gantt table with bar chips and done-when trio; 2x2 matrix with build-first quadrant; three-lane guardrail swimlane with never-variant tags; two-up next-step cards; footer stripe. All share the same tokens; no new colours, no new fonts.

## Pages

Two named page sizes in one file: the default `@page` is A4 for Part B, and `@page infog` (842pt x 1191pt) carries Part A via `page: infog` on the `.ig` wrapper. Chrome honours both; the sheet counter runs across the whole document. Both page rules carry the same running head and foot strings, so edit the DWG number and company name in BOTH when filling the template.

Structural CSS worth knowing when a page breaks badly: cards carry `page-break-inside: avoid`, section heads carry `page-break-after: avoid`, and the cover carries both so it stays on one sheet. Running heads, feet and sheet numbers come from `@page` margin boxes with `counter(page)` and `counter(pages)`, so sheets number themselves and you never hand-number anything.

## Production pipeline

1. **Draft the content** as `{Client Name} AI Systems Blueprint.md`, following the fixed running order: Part A's panel content first (tile values, station lists, chain steps, lane tags), then Part B's sections. The markdown is a deliverable in its own right, so keep it clean and complete; it is the editable source for every future revision.

2. **Pour it into the template.** Copy `assets/blueprint-template.html`, replace every `{{PLACEHOLDER}}`, delete the optional blocks you did not use (the foundation card, the deferral note block). The template's HTML comments mark where each repeating element goes.

3. **Render the PDF** with the bundled script, which tries WeasyPrint and falls back to headless Chrome:

   ```bash
   python scripts/render_pdf.py "{Client} AI Systems Blueprint.html"
   ```

   Both engines honour the `@page` rules, so output is equivalent. On Windows machines without the GTK libraries, WeasyPrint will fail to import and the script silently uses Chrome instead.

4. **Read every rendered page.** Check that no card or panel breaks across a sheet, the cover fits one sheet, the sheet count lands between 8 and 12 (2-3 wide + 6-9 A4), and the running heads and feet are right on both page sizes. Fix in the HTML, re-render. Rendering without looking at the result is how a broken card reaches a client.

5. **Save the triplet** (.md, .html, .pdf) in the client's folder. Revisions get a new triplet ("… v2" or "… Rev B") and the previous one is renamed "(v1 archive)". Never delete a shipped document: the archive is what lets you answer "what did we tell them in August?"

## Template placeholders

`{{COMPANY}}` `{{NAME}}` `{{ROLE}}` `{{N}}` (system count) `{{M}}` (phase count) `{{ANCHOR}}` (deadline anchor) `{{DATE}}` and the generic `{{PLACEHOLDER}}` markers inside each content block. Search the file for `{{` before rendering; any survivor means an unfilled field, which is the single most common defect in a first draft.


---

# PART 05 · The Quality Gate

# The Quality Gate

Run every check before the blueprint leaves the building. One failure blocks shipping. This gate is what makes the outcome repeatable regardless of who wrote the document, and it is deliberately mechanical so that a tired writer at the end of a long draft cannot talk themselves past it.

| # | Check | Passes when |
|---|---|---|
| 0 | Entry gate (precondition) | Both required inputs are on file: the filled audit form and the audit call with its transcript. If this fails, nothing below applies, because the document should not exist yet. |
| 1 | Traceability | Every system's SOLVES points at a §1 subsection; every §1 pain is addressed by a system or explicitly deferred. |
| 2 | Quotes | Every quote verified against the form or transcript: verbatim, or marked (paraphrase). Call-only material marked. |
| 3 | Guardrails | §4 matches form §10; unanswered guardrails carry a conservative default and appear in Next Steps. |
| 4 | Numbers | §5 table matches the form character for character, estimates marked; every rupee figure and percentage in the document traces to a source. |
| 5 | Contradictions | Flagged as numbered confirm items in §5 and repeated in Next Steps. None silently resolved. |
| 6 | Roadmap | Hours per week, deadline anchor and busy season named in the intro; every phase has a testable DONE WHEN; the final one echoes the client's "worth it if". |
| 7 | Cover | Chips are the client's money path with the first build highlighted; DWG number correct; Sources complete and dated; deadline anchor present. |
| 8 | Design | Template untouched; no card or panel broken across sheets; 8 to 12 sheets (2-3 wide + 6-9 A4); running heads and feet correct on every sheet; no `{{` placeholders survive. |
| 9 | Language | No em dashes; jargon explained on first use; client-language quotes intact; no selling. |
| 10 | Trace line | Present, dated, and true. |
| 11 | Files | The .md / .html / .pdf triplet saved in the client's folder; prior revisions archived, not deleted. |
| 12 | Infographic figures | Every figure, quote and claim on every panel already exists in Part B or the form; nothing appears first on a panel. Hot tiles mark findings the evidence pass named. |
| 13 | Infographic spine | Panels numbered 01-10 with no gaps; the 7 fixed panels present; each diagnostic panel points at the section 1 evidence that earned it; no diagnostic panel invented to fill a slot. |
| 14 | Cross-agreement | Panel 06 chains match the system cards; panel 07 bars match the phase cards and done-whens; panel 09 lanes match section 04's verbatim rules; panel 10 matches section 06. One story, two renderings. |

## How to run it honestly

Checks 1, 2 and 4 are the ones that actually catch damage, and they cannot be done by skimming. Take the rendered PDF and the source documents side by side:

- For check 1, list every system and write the § number it solves next to it. A system you have to think hard about is a system that does not belong.
- For check 2, search the draft for every quotation mark and confirm each one against the source text. A quote you cannot find is a quote you reconstructed, which means it has to become a paraphrase or come out.
- For check 4, take each number in the §5 table back to the form. Then scan the prose for any figure that is not in the table and confirm it too.

If a check fails, fix the document rather than the check. The gate exists because the alternative, a blueprint whose claims cannot be verified, costs the client's trust in everything else the engagement produces.


---

# PART 06 · Revisions

# Revisions: Rev B and the Delta Discipline

A revision triggers when material new input lands: the client's written review of the blueprint, a working call, a missing transcript finally exported, delivered data assets, or a client-authored spec. Small corrections do not trigger a revision; they queue for the next one.

The governing idea: a revision is a record of a conversation, not a fresh draft. The client should be able to see exactly what their input changed, which is what makes them keep sending input.

## The five moves

1. **Stamp the rev everywhere.** The DWG number on every sheet, the cover title ("· REV B"), every footer, and the cover supersede note: "Rev B supersedes Rev A (14.08.2026). Every change in this revision traces to the client's own review documents or the working call of {date}."

2. **Replace §01 with the delta record.** Section 01 becomes WHAT CHANGED SINCE REV A, tag "Delta record". Open it with the scope note: "Rev A §1 remains valid and is not repeated. This section records only what is new on file." Never rewrite what still stands. Rewriting valid content wastes the client's reading time and hides the actual changes inside a wall of familiar text.

3. **Answer every client point, traceably.** The executive summary enumerates the structural changes: "This revision makes four structural changes, each traceable to his review or the {date} call: (1)…". Each of the client's review items maps to the section that now satisfies it. What is still pending gets a named slot held. What they challenged gets engaged on the record, accepted or argued, never quietly ignored. A client who took the trouble to write a review will check whether each point landed.

4. **Carry corrections forward.** Client corrections persist across every future revision. Keep a standing list so a correction never silently un-happens between versions. If one slipped through, name it and kill it on the record: "The close rate figure that survived into v2 is removed."

5. **Record decisions as statuses.** System codes carry the outcome of the conversation: `POC AGREED`, `PROMOTED TO CORE`. Deferrals become `D-01`, `D-02` in a dashed note block, parked not dropped, each with the client's reason, the interim carrier, and the re-entry condition. Track the previous rev's open items to closure and name the ones still open. Close with the extended trace line: "… Unknowns are named, not guessed. Rev B supersedes Rev A in full."

## What a good delta section contains

Look at what actually changed and give each item its own subsection under 1.1, 1.2, and so on:

- **Open items closed.** "The Systems Brief (13.08) closes Rev A's open item #1: ~200 leads and ~200 quotes per month…"
- **New client assets on file.** A costing spec, a die master, size charts. Say what they are and what they unlock.
- **Risks retired.** "The single biggest project risk named in Rev A, that the costing logic lived only in his head, has been retired by the client himself." Credit the client when they retire their own risk.
- **Corrections to the record.** "§1.6 Owner role, corrected." Where Rev A got something wrong, say so plainly rather than editing it away.
- **Client decisions, including deferrals,** with the reasoning they gave.

## The infographic on a revision

Part A re-renders with Part B, always: a Rev B whose panels still show Rev A's numbers is worse than no infographic. Re-run the panel checks (gate 12 to 14). Where the revision changed a system's status or a phase's timing, the matching panel changes with it, and the delta section names the panels that moved.

## Files

Revisions get a new triplet named "… v2" or "… Rev B". The previous triplet is renamed "(v1 archive)" and kept. The archive is what lets anyone answer "what did we tell this client in August, and what changed since?" without reconstructing it from memory.
