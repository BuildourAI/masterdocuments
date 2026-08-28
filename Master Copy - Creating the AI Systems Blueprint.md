# Master Copy: Creating the AI Systems Blueprint

**BuildOur AI · Master SOP · DWG NO. BOA-2026-MST-01 · REV A**

| | |
|---|---|
| **Purpose** | One repeatable method for turning a filled audit form and an audit call into a client-ready AI Systems Blueprint. Same structure, same design, same quality, whoever writes it: developer, consultant, systems builder, non-technical team member, or the client themselves. |
| **The standard** | All future blueprints follow the v2 drawing format of **Pranay Aggarwal AI Systems Blueprint v2**: the structure in §07 of this manual, the design in §08. No exceptions without a named reason. |
| **Prepared by** | BuildOur AI |
| **Sources** | Distilled from the twelve client blueprints on file (August 2026), their audit forms, call transcripts, client review documents and revision history. |
| **Output per client** | One blueprint in three files (.md, .html, .pdf), 7 to 10 sheets, Rev A, saved in the client's folder. |
| **Time budget** | 2 to 3 working days from complete inputs to shipped Rev A. |

*Follow this manual and any two writers produce the same blueprint. The client's words, traced, never guessed.*

---

## 00 · The Job, in One Page *(read me first)*

The AI Systems Blueprint is the first substantial deliverable a client receives after their audit. It does four things in one document: it plays the client's business back to them in their own words, it names exactly where that business hurts and what the pain costs, it prescribes AI systems that each point at a named pain, and it sequences those systems into phases with testable finish lines, wrapped in the safety rules the client themselves set. It is a diagnosis, a proposal and a build contract at once. When it is written well, the client's reaction is recognition: *this is my business, and this is my plan.*

> **THE PRIME DIRECTIVE:** every recommendation, figure and quote in a blueprint traces to the audit call, the submitted Systems Brief, or a dated client document. No figures are invented. Unknowns are named, not guessed. Contradictions are flagged, not resolved. A sentence stating this closes every blueprint we ship, and it has to be true.

> **THE ENTRY GATE: both inputs, or no blueprint.** A blueprint is written only when the filled audit form and the audit call are both on file. Neither substitutes for the other. The form supplies the numbers, the guardrails and the client's own build list; the call supplies the reasoning behind those answers, the worked examples, the decisions made live, and the client's exact words. A form-only document is a form with formatting applied, and it will not survive contact with the client, because the questions it failed to ask are the ones the call exists to ask. If either input is missing, say so plainly and chase it. Do not open the template.

How to use this manual: read it once end to end. When you write your first blueprint, work sections 01 to 06 in order; they follow the pipeline. Sections 07 and 08 are the fixed structure and design, where nothing is left to taste. Sections 09 to 11 are the voice, the revision discipline and the quality gate. Your judgment lives in sections 03 to 05 (what to extract, which systems to design, how to sequence them). Everything else is deliberately mechanical, because mechanical is what makes twelve different clients receive documents that feel like one firm produced them.

> **NEVER:** skip the evidence pass, soften or prettify a client quote, guess a number, add a system that has no pain to point at, or ship without running the quality gate in §11.

## 01 · The Pipeline *(seven steps, form to delivery)*

The full path from a signed client to a shipped blueprint. Steps 03 to 05 are thinking work; the rest is disciplined mechanics. One person can run the whole pipeline.

1. **Collect the inputs, and check the entry gate.** The client folder must hold both required inputs: the filled Systems Brief export, and the audit call recording with its VTT transcript. Plus every extra asset the client supplied (photos, price sheets, specs, spreadsheets, self-built apps, review documents). Date everything. If either required input is missing, the pipeline stops here: report what is missing and get it. Where only the form exists, the useful work is to run the evidence pass on it and turn the gaps into an agenda for the call, which makes the call sharper. That is preparation, not a blueprint, and it is never formatted as one.
2. **Clean the transcript.** Convert the raw Zoom VTT into a cleaned transcript: strip cue numbers and end timestamps, merge consecutive lines by the same speaker into single turns, drop pure backchannel noise ("hmm", "okay", ASR artefacts). Never rewrite, never infer: garbled speech stays garbled and the defect gets disclosed in Sources. Save as `{Client} Audit Call (Cleaned).md`.
3. **Run the evidence pass (§03).** Read the full form and the full transcript once, before writing anything. Extract pains, quotes, numbers, guardrails, constraints and assets into the extraction list. This is the step that separates a traced blueprint from a generic one.
4. **Design the systems (§04).** Turn the pains into 6 to 9 recommended systems, each with a code, a card, and a SOLVES row pointing at a named pain.
5. **Sequence the roadmap (§05).** Group the systems into 3 or 4 phases with a testable "done when" each, respecting the client's hours per week, deadline anchor and busy season.
6. **Write and typeset (§§06-09).** Draft the content in markdown following the sheet-by-sheet structure of §07, pour it into the v2 HTML template, and render the PDF (§08). Read every rendered page.
7. **Quality gate and deliver (§11).** Run the checklist, save the three files to the client's folder, send the PDF, and book the blueprint review call. What comes back from that call starts the Rev B cycle (§10).

## 02 · The Inputs *(what you work from)*

Two inputs are required, and both must be on file before drafting starts: the audit form and the audit call. Everything else on this list is welcome but optional. The rule exists because the two inputs fail in opposite directions. The form is precise and shallow: real figures, real guardrail answers, often in single words, with no explanation behind any of them. The call is rich and imprecise: the stories, the worked examples, the vetoes, the client's own sentences, none of it tabulated. A blueprint needs both halves, so a document built on one of them is not a thin blueprint, it is a different and weaker artefact wearing the format.

### 2.1 The audit form: "My Systems Brief"

Every client fills the same 44-question form before their audit call. The export is titled *"My Systems Brief: every question and my answer"* and carries the client's name, business and submission timestamp. Its section numbering jumps from 7 straight to 9 in every export; that is normal, expect it. The form ships localized (Gujarati and other languages exist); the sections map one to one. Each section feeds a specific part of the blueprint:

| Form section | What it feeds in the blueprint |
|---|---|
| 1 · The Wishlist & the Endgame | Executive summary framing. The "I never want to manually ___ again" list seeds the system list. Fears and "what I do NOT want" become design rules. The six-month picture becomes the final "done when". |
| 2 · The One-Line Business | The BUSINESS field on the cover, and the opening of the executive summary. |
| 3 · The Money Path | The skeleton of §1 Current State and the cover flow chips. Steps marked ⚙️ are manual: your automation candidates. The owner named per step tells you who each system serves. |
| 4 · The People Map | Adoption logic, the internal champion candidate, the headcount cross-check, and the owner's hours-per-week constraint for the roadmap. |
| 5 · Apps and software you pay for | The CURRENT STACK field on the cover, and the keep / retire / supersede dispositions in §2. "Paid but ignored" tools become next steps (activate or cancel). |
| 6 · The Numbers Panel | The §5 Numbers table, exactly as provided, estimates marked, contradictions flagged. |
| 7 · The Leak List | The PAIN callouts of §1, priced in rupees where the client priced them. The loudest priced leak usually decides Phase 1. |
| 9 · Draft Build List + Top 3 Painkillers | The seed of the recommended systems. Painkiller #1 is the strongest single signal in the whole form. |
| 10 · Guardrails & the Finish Line | The §4 Guardrails section, near-verbatim. Also: the error protocol, the customer-facing comfort level, the "worth it if" sentence, and the deadline anchor. |

### 2.2 The audit call

On the call, our AI experts sit with the client and their team and walk the whole business: workflows, bottlenecks, pains, existing systems, desired systems, and how the client wants things built. The call adds what the form cannot: the stories behind the answers, worked examples with real figures, decisions and vetoes made live, and the client's exact words. Anything that exists only on the call is marked *(call-only)* in the blueprint.

> **Transcript reality.** Audit calls run in Hinglish or regional languages and Zoom's auto-transcription garbles them, sometimes badly. Rules: lean on the written brief wherever the call is unclear, and say so in the Sources field. Quote verbatim only where the transcript is clean; otherwise mark *(paraphrase)*. Where the transcript fails entirely, recommend a re-listen of the audio as a next step. Never present a reconstructed sentence as a quote.

### 2.3 Extra client assets

Some clients arrive with their own material: a self-built app, a costing spec, a die master, a vision document, a scope definition, review replies. Treat these as governing sources: date them, list them in Sources, and cite them by item where they drive a decision. When a newer client document conflicts with an earlier statement, the newer and more specific document wins, and the blueprint states that precedence explicitly.

## 03 · The Evidence Pass *(extract before you write)*

Read everything once before writing a word. As you read, build the extraction list below. Every entry needs its source noted: *(form)*, *(call)*, *(call-only)*, or a dated client document. When the pass is done you should be able to write the whole blueprint without opening the sources again, except to verify quotes.

| Extract | Where it lands |
|---|---|
| Business one-liner | Cover BUSINESS field, executive summary opening. |
| Money path, step by step | §1 subsection skeleton and the cover flow chips. |
| Current stack + dispositions | Cover CURRENT STACK; keep / retire / supersede note in §2. |
| Pains, in the client's words | One PAIN callout per §1 subsection. Skip the callout only where no pain was named. |
| Rupee-priced leaks | Phase priorities. Phase 1 attacks the loudest priced pain. |
| Every number, with its wording | §5 table, "(estimate)" suffixes kept exactly as the client wrote them. |
| Contradictions and typos | The flagged list in §5 and the confirm items in Next Steps. |
| Guardrail answers, verbatim | §4 Guardrails, hardened into mechanism. |
| Never-again list + Painkillers 1-3 | The SOLVES rows of the system cards. |
| Deadline anchor, hours/week, seasons | Cover DEADLINE ANCHOR and the roadmap intro constraints. |
| Adoption signals + champion | ADOPTION rows, rollout order, the named champion in the roadmap. |
| The client's own system vision | The system list itself. If they arrived with a design, build on their structure and credit them. |

> **FLAG, DON'T FIX:** a form that says average order value "1000020000", a headcount of 10 beside a function split summing to 27, or "busiest months: 6" is never silently corrected. Each becomes a numbered confirm item: named in §5, repeated in Next Steps.

> **NAME THE UNKNOWNS AS FINDINGS:** a funnel nobody measures is itself a diagnosis. The standing formulation: "Not a criticism, a finding: the funnel isn't measured because it isn't in a system." Where a system will produce the missing number as a side effect, say so.

> **PRESERVE THE CLIENT'S LANGUAGE:** quotes keep their typos, their Hindi, their Gujarati, their exact phrasing. *"copy-paste, copy-paste. I want one system where one file works from the start"* is worth more than any polished restatement of it.

## 04 · Designing the Systems *(pains to systems)*

Systems are prescriptions, and a prescription needs a diagnosis. The design test for every card: point at the §1 subsection it solves. If you cannot, the system gets cut, however clever it is. Aim for 6 to 9 systems: fewer means you probably merged distinct pains, more means the roadmap cannot carry them.

### 4.1 Where systems come from

In order of authority: the client's own draft build list and painkillers (form §9), the never-again list (form §1), pains named on the call, and only then your own pattern knowledge. Many clients arrive with the system already sketched; the strongest blueprints say so plainly ("Kishore arrived with the system already designed in his head, and it is a good one") and keep the client's structure and sequence. You fix the platform, not their process, unless their process is the pain.

### 4.2 The card, anatomically

- **Bar:** system name in plain English + function, ALL CAPS, with code on the right (`SYS-0N · STATUS`).
- **WHAT IT DOES** (always): the mechanism in 2 to 4 sentences, concrete enough that a developer could scope it and the client recognizes their own workflow inside it. Encode formulas and chains as code chips: `event → rule → action → next task → deadline → escalate`.
- **SOLVES** (always): the named pain with its § reference and, where it exists, the client's own words: "The one-at-a-time manual sending (§1.1), and 'I never want to manually find new markets and buyers again.'"
- **GUARDRAIL:** required whenever the system touches money, customers or outbound messages. States the human gate: "AI drafts, the team sends."
- **Optional rows:** ADOPTION (how the team will actually accept it), ENTRY POINT (the agreed POC), NOTE / OPEN INPUT (a decision still owed), BUILD (dependencies and build type). Use rows selectively; not every card carries every row.

### 4.3 Codes, foundations and deferrals

Codes: `SYS-01 … SYS-0N` in recommendation order. When the architecture demands a shared data core or workflow engine that every system plugs into, it gets its own card first as `F-00 · FOUNDATION` with rows WHAT IT IS and WHY FIRST. Status suffixes record decisions on the record: `POC AGREED`, `PROMOTED TO CORE`, `MONTH-1 SYSTEM`.

> **Deferred by client decision · parked, not dropped.** When the client defers a system, it does not vanish. It gets a code (`D-01`, `D-02`) in a dashed note block with three things: the reason in the client's terms, the interim carrier ("the current ChatGPT flow carries this meanwhile"), and the re-entry condition ("revisited with the client after Phase 3 is stable, not assumed"). Rules already agreed stay pre-bound to it for whenever it is built.

Close §2 with a tool-disposition note covering every paid app from form §5: what stays, what retires, what is superseded, and what is paid-but-ignored and should either become a working tool in this build or be cancelled.

## 05 · Sequencing the Roadmap *(phases and finish lines)*

3 or 4 phases, coded P1 to P4. The roadmap intro must state, in one paragraph, the constraints it was sequenced for: the owner's hours per week, the deadline anchor, the busy season, and the critical path (name it: "the catalogue data work in Phase 2 feeds both the quotation engine and the website").

> **PHASE 1 STOPS THE BLEEDING:** it attacks the loudest daily pain, runs on data that already exists (no long digitisation wait), produces wins the team can see in weeks, and sets the adoption pattern early: the system hands people their next task, it does not audit them.

> **DATA BEFORE DREAMS:** when the client's data lives on paper, in WhatsApp or in heads, a data foundation runs as Phase 0 or as a parallel Track 0 that starts immediately. Say the honest sentence when it is true: "Track 0 is not optional and Phase 1 fails without it." Ship the client a data-gathering pack (sheet + how-to-fill guide, bilingual if needed).

> **EVERY PHASE ENDS IN "DONE WHEN":** an observable, testable state, never an activity. "Outreach runs weekly without the receptionist sending a single manual email" passes. "Email system implemented" does not. The final phase's done-when should echo the client's own "worth it if" answer from form §10.

> **TRUST RAMPS AND PARALLEL RUNS:** where trust must be earned, phase it inside the phase: "month 1: AI drafts, humans press send; month 2: autonomous." Nothing existing is switched off until its replacement has run in parallel and proven itself. Where complexity or trust demands, enter through a narrow POC validated against the client's real past orders.

Phase card format: `P1` + an evocative title ("STOP THE MANUAL BLEEDING", "THE WATCHERS & THE NETWORK"), a right tag naming systems and timing (`SYS-01 + SYS-04 · FIRST WEEKS`), rationale prose (P1 carries an explicit "Why first:"), then the DONE WHEN line. Name the internal champion and the department-by-department rollout order in the intro when the client gave you one.

## 06 · The Back Sections *(guardrails · numbers · next steps)*

### 6.1 Guardrails

Title: GUARDRAILS. Tag: "Set by {first name}, enforced by design". This section is the client's form §10 answers, near-verbatim, hardened into mechanism. Each guardrail is one orange-barred callout with a bold lead-in. The standing vocabulary, extended per client:

- **ALWAYS HUMAN SIGN-OFF:** their exact list. Quotations and commitments to clients appear here for almost every client.
- **AI MAY ACT ALONE ON:** their delegable list, verbatim.
- **CUSTOMER-FACING:** their comfort answer: "AI drafts, my team sends" / "AI can message customers directly" / "Not sure yet" (which means everything drafts-for-approval until they decide).
- **DATA CAUTION / UNTOUCHABLE DATA:** what AI never touches, in their words.
- **ERROR PROTOCOL:** their acceptable way for mistakes to surface and get corrected. Never silent rewrites; an audit trail you cannot trust is worse than none.
- **NOT ANSWERED:** when a guardrail question was left blank, say so, apply a conservative default, and list it for the kickoff call. Unanswered is information.

### 6.2 The Numbers

Title: THE NUMBERS. Tag: "As provided, with gaps named". A two-column METRIC / VALUE table containing only the client's figures, with their "(estimate)" and "stated on call" markers kept. Below the table, two things are allowed: the numbered "flagged, not resolved" contradictions, and at most one interpretation paragraph that reads their numbers back to them ("~160 quotes a month do not convert; speed is the cheapest conversion lever available, which is why P1 leads"). Interpretation never introduces a figure the client did not provide.

### 6.3 Next Steps

Title: NEXT STEPS. Tag: "Immediate actions". 4 to 7 numbered step blocks, each starting with a bold action and carrying a named owner. Standard ingredients, picked as they apply: the blueprint review call ("to contradict, add to, or accept as-is"); the client's data homework; the access checklist (logins, WhatsApp Business, workspaces); commercials and onboarding where payment is open; the flagged numbers to confirm; and the promise of the Phase 1 build plan as the next deliverable, "deliverables and done-when stated up front, no surprises mid-journey."

## 07 · The Document, Sheet by Sheet *(fixed structure · v2 standard)*

The fixed running order. Section numbers, titles and tags are exactly these; only the bracketed values vary per client:

| No. | Section title | Right-side tag | Content |
|---|---|---|---|
| – | **Cover** (Sheet 1) | – | See 7.1 below. |
| 00 | EXECUTIVE SUMMARY | Overview | 3 to 4 paragraphs: who the client is and what they said plainly; how the business runs and where it leaks; what this blueprint recommends (N systems in M phases) and the anchors it respects. Open with the client's strongest sentence when you have one. |
| 01 | CURRENT STATE | How work happens today, and where it hurts | Subsections 1.1 to 1.N (typically 5 to 9), ordered along the money path. Each: a short narrative, then a PAIN callout. Mark call-only subsections. |
| 02 | RECOMMENDED AI SYSTEMS | {N} systems | System cards per §04, plus the tool-disposition note and any deferral note blocks. |
| 03 | IMPLEMENTATION ROADMAP | {M} phases · {anchor} | Constraints intro + phase cards per §05. |
| 04 | GUARDRAILS | Set by {name}, enforced by design | Guard callouts per 6.1. |
| 05 | THE NUMBERS | As provided, with gaps named | Table + flags + one reading, per 6.2. |
| 06 | NEXT STEPS | Immediate actions | Step blocks per 6.3. |
| – | Trace line | – | The closing oath, dated: "Every item in this document traces to the audit call ({date}) or the submitted Systems Brief ({date}). No figures added beyond those the client provided; unknowns are named, not guessed." |

### 7.1 Cover anatomy

- **Running head, every sheet:** left `BUILDOUR AI · CLIENT BLUEPRINT`, right `DWG NO. BOA-{YYYY}-{CODE}-01 · REV {A}`. The code is three letters from the company name: VNV for Vinove, MPK for MyPackify, APT for Aptus.
- **Running foot, every sheet:** left `{COMPANY} · AI SYSTEMS BLUEPRINT`, right `SHEET n / N`. Target 7 to 10 sheets total.
- **Frame:** double orange border (coverframe + coverinner), cover bar "BUILDOUR AI | CLIENT BLUEPRINT".
- **Title:** AI SYSTEMS in ink, BLUEPRINT in orange. Revisions append "· REV B" at reduced size.
- **Subtitle:** `{COMPANY} · PREPARED FOR {NAME}, {ROLE}`, the name in orange bold.
- **Flow chips:** the client's own money path in 5 to 7 stations, dash-connected. The chip where the first build lands is filled orange. This is the client's business drawn as a machine, not a generic pipeline.
- **Title block:** BUSINESS · CURRENT STACK · PREPARED BY · SOURCES (every input, dated) · SYSTEMS SPECIFIED ("7 systems in 3 phases") · DEADLINE ANCHOR. Optional extra fields when relevant: PROGRAM ("Build For You (DFY)") or ENGAGEMENT MODEL, and PRECEDENCE when client documents govern.
- **Cover note:** "EVERY RECOMMENDATION IN THIS DRAWING TRACES TO THE AUDIT CALL OR THE SUBMITTED SYSTEMS BRIEF". On revisions, the supersede line with the old rev's date.

## 08 · Design Specification *(colour · type · production)*

The design is a technical drawing: graph-paper grid, one orange, monospaced labels, framed cards. It is fully specified; nothing is chosen per document. This master copy is itself typeset in it.

| Token | Value | Used for |
|---|---|---|
| --orange | `#e8590c` | The only accent: bars, borders, labels, links between ideas. |
| --orange-soft | `#fdeee2` | Inline code-chip background. |
| --orange-faint | `#fdf6f0` | PAIN and guardrail callout backgrounds. |
| --ink | `#1f2430` | Body text. |
| --grid | `rgba(232,89,12,0.07)` | 24px graph-paper grid on paper `#fdfbf9`. |
| --rule | `#e9c7ae` | Dotted hairlines inside cards and tables. |
| --mono | Consolas, Courier New | All labels: uppercase, letter-spaced 1.5-3px, 8.5-10.5px. |
| --sans | Segoe UI, Helvetica, Arial | Body 13.5px / 1.6, justified. H1 46px weight 800. Section titles 17px bold. |

Component inventory, all defined in the template: cover frame + title block + flow chips; section head (orange number block + title + right tag); numbered subsections with orange mono numbers; PAIN callout; system card (orange header bar, dotted row rules, mono row labels); phase card; guard callout; METRIC/VALUE table with orange header row; numbered step blocks; dashed note block; trace line; inline code chips.

### 8.1 Production pipeline

1. **Draft the content** as `{Client Name} AI Systems Blueprint.md`, following §07's running order. The markdown is a deliverable too; keep it clean.
2. **Pour it into the template.** Use `AI Systems Blueprint Template (v2 design).html` in the Master PDFs folder: copy it, replace every `{{PLACEHOLDER}}`, delete unused optional blocks. Do not restyle. If the template is ever lost, the CSS lives in Puneet Jain AI Systems Blueprint v2.html.
3. **Render the PDF.** Either headless Chrome: `chrome --headless --no-pdf-header-footer --print-to-pdf="out.pdf" "file:///…/in.html"` (works on any machine with Chrome), or WeasyPrint where it is installed: `python -m weasyprint "in.html" "out.pdf"`. Sheets number themselves either way.
4. **Read every rendered page.** Check that no card breaks across a sheet, the cover fits one sheet, and the sheet count is 7 to 10. Fix in the HTML, re-render.
5. **Save the triplet** (.md, .html, .pdf) in the client's folder. Revisions get a new triplet ("… v2" or "… Rev B"); the old one is renamed "(v1 archive)", never deleted.

## 09 · Writing Rules *(voice and style)*

- **THE CLIENT'S WORDS ARE LOAD-BEARING.** Quote them in italics, in whatever language they spoke, typos intact. Their sentences name the pains, justify the systems and set the guardrails. Your job is arrangement, not improvement.
- **SHORT, DECLARATIVE, ACTIVE. NO EM DASHES,** house rule: use commas, colons, periods and middots instead. One earned aphorism per section at most ("Automating an undocumented process produces an undocumented automation"); more and it reads like copywriting.
- **DIAGNOSE BEFORE PRESCRIBING.** §1 earns §2. Explain the business back to itself so precisely that the client nods before they reach a single recommendation.
- **CROSS-REFERENCE EVERYTHING.** Every SOLVES points at a §1.x. Next steps point at systems. Interpretations point at the table rows they read. The document is a web, not a list.
- **WRITE FOR TWO READERS AT ONCE:** the owner who decides, and the team member who will run the system. Explain jargon inline the first time (BOM, GRN, KRA). Name real staff; workflows should read as the client's actual office, not an org chart.
- **PRICE THE PAIN WHERE THE CLIENT DID,** and translate where it lands: "a forgotten order at a 50% repeat rate is a relationship cost, not just one lost bill." Never invent a rupee figure to make a pain sound bigger.
- **EVIDENCE PERSUADES; SELLING REPELS.** No superlatives about our systems, no fear-mongering about AI, no promises without a done-when. The blueprint's confidence is its traceability.

## 10 · Revisions *(Rev B and the delta discipline)*

A revision triggers when material new input lands: the client's review of the blueprint, a working call, a missing transcript finally exported, delivered data assets, or a client-authored spec. Small corrections do not trigger a rev; they queue for the next one.

1. **Stamp the rev everywhere:** the DWG number on every sheet, the cover title ("· REV B"), every footer, and the cover supersede note: "Rev B supersedes Rev A (14.08.2026). Every change in this revision traces to the client's own review documents or the working call of {date}."
2. **Replace §01 with the delta record:** section 01 becomes WHAT CHANGED SINCE REV A, tag "Delta record". Open it with the scope note: "Rev A §1 remains valid and is not repeated. This section records only what is new on file." Never rewrite what still stands.
3. **Answer every client point, traceably.** The executive summary enumerates the structural changes ("This revision makes four structural changes, each traceable to his review or the {date} call: (1)…"). Each of the client's review items maps to the section that satisfies it. What is pending gets a named slot held. What they challenged gets engaged on the record, accepted or argued, never ignored.
4. **Carry corrections forward.** Client corrections persist across every future revision; keep a standing list so a correction never silently un-happens. If one slipped through, name it and kill it: "The close rate figure that survived into v2 is removed."
5. **Record decisions as statuses:** `POC AGREED`, `PROMOTED TO CORE`, deferrals to `D-0N` per §4.3. Track Rev A's open items to closure and name the ones still open. Close with the extended trace line: "… Unknowns are named, not guessed. Rev B supersedes Rev A in full."

## 11 · The Quality Gate *(before it ships)*

Run every check. One failure blocks shipping. This is the gate that makes the outcome repeatable regardless of who wrote the document.

| # | Check | Passes when |
|---|---|---|
| 0 | Entry gate (precondition) | Both required inputs are on file: the filled audit form and the audit call with its transcript. If this fails, nothing below applies, because the document should not exist yet. |
| 1 | Traceability | Every system's SOLVES points at a §1 subsection; every §1 pain is addressed by a system or explicitly deferred. |
| 2 | Quotes | Every quote verified against the form or transcript: verbatim, or marked (paraphrase). Call-only material marked. |
| 3 | Guardrails | §4 matches form §10; unanswered guardrails carry a conservative default and appear in Next Steps. |
| 4 | Numbers | §5 table matches the form character for character, estimates marked; every ₹ and % in the document traces to a source. |
| 5 | Contradictions | Flagged as numbered confirm items in §5 and repeated in Next Steps. None silently resolved. |
| 6 | Roadmap | Hours/week, deadline anchor and season named in the intro; every phase has a testable DONE WHEN; the final one echoes the client's "worth it if". |
| 7 | Cover | Chips are the client's money path with the first build highlighted; DWG number correct; Sources complete and dated; deadline anchor present. |
| 8 | Design | Template untouched; no card broken across sheets; 7 to 10 sheets; running heads and feet correct on every sheet. |
| 9 | Language | No em dashes; jargon explained; client-language quotes intact; no selling. |
| 10 | Trace line | Present, dated, and true. |
| 11 | Files | The .md / .html / .pdf triplet saved in the client's folder; prior revisions archived, not deleted. |

## 12 · Your First Blueprint *(next steps for a new writer)*

1. **Read two shipped blueprints end to end:** Pranay Aggarwal AI Systems Blueprint v2 (the structure and design standard) and Puneet Jain AI Systems Blueprint v2 / Rev B (the revision standard). Both live in the clients folder.
2. **Trace ten claims.** Take one client's audit form and cleaned transcript, sit them beside the shipped blueprint, and trace ten of its claims back to their exact sources. This teaches the evidence pass faster than any instruction.
3. **Draft your first blueprint** with this manual open, working §§01-06 in order, into the template per §08.
4. **Run the §11 gate,** then have one experienced reviewer walk your draft against the same checklist before it goes anywhere near the client.
5. **Ship, book the review call, and fold what comes back into Rev B** per §10. The blueprint is not the end of a process; it is the first move of the build.

---

*Every rule in this master copy is distilled from the twelve client blueprints, audit forms and call transcripts on file (August 2026). Where a case this manual does not cover appears, fall back to the prime directive: the client's words, traced, never guessed.*
