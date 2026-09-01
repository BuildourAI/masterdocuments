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
