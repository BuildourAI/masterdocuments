---
name: ai-systems-blueprint
description: Create a BuildOur AI "AI Systems Blueprint" for a client from their filled audit form (My Systems Brief) and audit call transcript: one document that opens with the infographic (the one-shot capture, ten panels on wide sheets) followed by the in-depth blueprint, in the fixed technical-drawing format, delivered as a matching .md, .html and .pdf triplet. Use this skill whenever the user mentions an AI Systems Blueprint, a client blueprint, a systems brief, an audit form or audit call VTT, a Rev B or blueprint revision, or points at a client folder and asks for their blueprint, even if they do not name the format. Also use it when asked to review, revise, quality-check or re-render an existing blueprint, or to draft one for a new client from BuildOur AI audit inputs.
---

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
