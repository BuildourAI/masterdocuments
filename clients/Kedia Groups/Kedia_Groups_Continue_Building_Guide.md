# Kedia Continue Building

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-KED-C1 · REV A**

*Prepared for Rounakk Ajay Kedia. Every sitting after the starter guide: one system at a time, from Build Sheet to switched on, in the blueprint's order.*

Build sheet → Screens + UI → Plan → **One phase per sitting** → Five real cases → Watch week → Switch on → Next system

| | |
|---|---|
| **Use it when** | Every box in Step 7 of the Kedia Starter Guide is ticked. Keep this file in `docs/`. |
| **The loop** | For every system: Build Sheet → screens and UI → plan → one phase per sitting → five real cases → watch week → switch on → next system. |
| **Your time** | Your 10 hours a week, mostly reading drafts and signing. If someone builds for you, their hours are separate; your signatures are not. |
| **First system** | F-00 Kedia Shared Record + SYS-01 Kedia Indent and PO Skill, from your First Build Card. |
| **Sources** | AI Systems Blueprint BOA-2026-KED-01 Rev A (blueprint audit 30.10.2026). |

*Condensed from Builder Guides 02–04 and the UI Guide against the Kedia Groups AI Systems Blueprint.*

---

## 01 · Every Sitting Starts With This *(paste to Claude Code)*

**PASTE · START OF EVERY SITTING**

> Read CLAUDE.md, docs/START-NOW.md, the latest note in docs/sessions/ and the Build Sheet for the system we are on. First, remind me of anything in START-NOW that is still not ticked. Then tell me in five lines where we are and what the one finished thing for today should be. Make a plan and wait for my OK before touching any files.

**Five habits:** plan first · one small finished thing per sitting · *"commit and push"* when it works · when it breaks, paste the error and say *"explain in simple words and fix it"* · close the sitting with the prompt in §07.

## 02 · Start a System: the Build Sheet *(paste to Claude Code)*

**PASTE · NEW SYSTEM**

> We are starting **[system number and name from §05]**. Using the blueprint, the First Build Card (or the deferred list from the last system) and the real documents in docs/samples, draft docs/build-sheets/[system].md with seven fields: the system and its slice sentence; what starts it; what it shows, drafts or says, **word for word** in the format and language the team already uses; what happens on silence, delay or a mismatch; when a human steps in and who that is by name; what it must never do (copied from the blueprint's guardrails and CLAUDE.md); and done-when, copied from §05 of the Continue Building Guide. Mark every line you are unsure of. Write no code.

Correct every line of the sheet yourself. Only you and your team know how a Kedia indent, pricing sheet or PO really reads. A sheet that says "draft the PO" is not a rule; the actual columns, clauses and numbering are.

## 03 · Choose the Screens and Their Look *(before the first screen of every system)*

Your look was chosen once, in Step 6 of the starter guide, and lives in `docs/design/`. What changes with each system is **which screens it needs** and who holds them. Settle that on paper before any code, then let the plan follow.

**PASTE · SCREENS FOR THIS SYSTEM**

> Read docs/design and the Build Sheet for this system. List every screen this system needs. For each one give: the one question it answers; its one main button; who uses it; and on what device (back office computer, factory or warehouse phone, my phone). Draw each as a simple text sketch. Keep to the five screen laws and the two-minute rule. Then give me a plan of small phases: every phase must end with something I can test on my phone, and the first phase is always "load my real data and show me one true list". Write no code until I approve the screens and the plan.

| System | Main screen and its one question | Who, on what |
|---|---|---|
| F-00 + SYS-01 | **Drafts to check:** "which indent, pricing sheet or PO is waiting for me, and is every line right?" | Back office on a computer; the approver signs on a phone |
| SYS-02 PO Reconciler | **Gate entry:** "which PO did this lot come in against, and how many passed?" | Factory and warehouse staff on a phone at the gate |
| SYS-03 Procurement Board | **Exceptions first:** "what is late, short or mismatched today?" | You and the back office; sales see the buyer view |
| SYS-04 Buy Plan to PO | **Approval queue:** "which POs wait for my yes before they go out?" | The procurement approver, on a phone |
| SYS-05 Entry Skill | **Voucher queue:** "is this draft voucher right, yes or no?" | The accounts head, on a computer |
| SYS-06 Match Tool | **Four lists:** "what matched, and what still needs a person?" | The accounts team, on a computer |

> **IF A SCREEN LOOKS LIKE HOMEWORK,** it is the screen that is wrong. Send Claude a screenshot and say: *"Change only the design, following docs/design. Do not touch the features."*

## 04 · Build, Test, Switch On *(shadow before send)*

1. **One phase per sitting.** After each phase: commit and push, open the live app **on your phone**, and check one buy plan, PO or bill you know well against reality. Note every surprise in `docs/rules-i-learned.md`, and update the Build Sheet the same day.
2. **Five real cases.** Run five real cases through the system while a person presses every button. For the Indent and PO Skill: five live buy plans, each checked line by line by the back office against what they would have typed. For the Reconciler: five POs with their GRNs and QC. For the Entry Skill: five real bills.
3. **Watch week.** For one full week the system drafts everything in its lane while the team keeps working the old way in Excel, Sheets and WhatsApp beside it. Compare every day. Any mismatch is a fix or a missing rule.
4. **Switch on** only what passed the watch week. For Kedia that means the approved step runs by itself after a person signs: a signed PO goes to the manufacturer without anyone retyping it. The signature itself never switches off. Widen in rings: one manufacturer, then one buyer, then all; one Kedia company, then the next.
5. **Retire the old way** only after the new one has held. The Excel consolidation stops when the back office stops opening it on its own; keep the old file in a drawer for one more month.

> **IF A SITTING GOES WRONG:** say *"Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to the last commit."*

## 05 · Kedia Build Order *(from your blueprint, one at a time)*

| Weeks | System | Before you start (START-NOW) | Done when |
|---|---|---|---|
| 1–2 | **F-00 Kedia Shared Record + SYS-01 Kedia Indent and PO Skill** | Five real sets and the manufacturer master in docs/samples; numbering rules; supplier and customer master with GST and TDS; chart of accounts per company | A live buy plan has gone in, and the indent, buyer pricing sheet and manufacturer PO have come out in your own format with the rate column blank, and the back office has checked every line against what they would have typed |
| 3–6 | **SYS-02 Kedia PO Reconciler** | Factory and warehouse leads agreed same-day GRN and QC posting at the gate | The factory has posted at least one week of GRNs and QC on the entry screen, and the claim register holds every shortage with its GRN attached |
| 4–6 | **SYS-03 Kedia Procurement Board** | Your QC reject threshold and dispatch delay days | Every open manufacturer PO shows on the board with ordered, received, passed and pending |
| 5–10 | **SYS-04 Kedia Buy Plan to PO Flow** | **A procurement approver named below you**; WhatsApp API access and approved templates; your yes on any Claude API cost (§06) | A customer PO has arrived on the WhatsApp API, been drafted into manufacturer POs, waited in the queue, been signed by your named approver and gone out, with no one retyping a line |
| 8–12 | **SYS-05 Kedia Entry Skill** | **The accounts head named**; chart of accounts for the first company | For one Kedia company, every bill of the month exists as a drafted voucher the accounts head said yes or no to |
| 9–12 | **SYS-06 Kedia Match Tool** | That company's Tally day book, Vasy export, bank statement and GSTR-2B | The bank statement has a matched list and an unidentified list, and no payment has moved without a human hand |

**Months 4–12, same house:** Bill to Book Flow and the Money Board, then Kedia Munim on a fixed morning run (months 4–6) → EcomHub24 Brand Review Skill and Margin Checker, then the Ten Brand Board (months 5–8) → Dispatch Munshi and the Breach and Stockout Flow (months 7–10) → Brand Watch and the central chat (months 9–12). Each starts at §02 of this guide.

> **THE THREE HARD GATES:** SYS-04 does not start until a procurement approver below you is named; without that name the approval queue only moves from WhatsApp to a dashboard and nothing changes. SYS-05 does not start until the accounts head is named. Nothing, at any stage, connects to a bank, sets a credit limit or writes off a balance.

## 06 · When a System Needs More Than Claude Max *(decide before it is built)*

Systems 1 to 3 run on what you already have: the skill drafts inside Claude Code on your Max account, and the app shows and stores. Three needs appear later. Each one is a decision you make, never one Claude makes for you.

| Need | First appears | What it means for you |
|---|---|---|
| **Claude API key** | SYS-04, SYS-05 | The app reads a buy plan or a bill by itself when it arrives, with nobody at the computer. Billed separately from Max, per use. Claude Code shows you the expected monthly cost first. |
| **WhatsApp API login** | SYS-04 | The signed PO goes to the manufacturer from the number you already pay for. Templates need Meta's approval; the clock started on day 1. |
| **Google Drive and Sheets read access** | SYS-02, SYS-04 | The app reads the sheets and folders your team already uses. Read only, never written to, unless you decide otherwise. |

**PASTE · BEFORE ANY NEW CONNECTION**

> Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month at our volume, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to add it in Vercel and to redeploy.

## 07 · Standing Prompts *(keep these handy)*

- **Close every sitting:** *"Summarise what we did today and what comes next, and save it as today's note in docs/sessions/."*
- **Next system:** once the current system has switched on and held for a week, go back to §02 with the next row of §05.
- **New approver named:** *"[Name] is now the [procurement approver / accounts head]. Record it in CLAUDE.md and route those approvals to them, with a copy of every exception to me."*
- **Monthly audit:** *"Audit this project against CLAUDE.md, the house rules and the Kedia rules, and report anything that breaks them, in simple words."*
- **Make a correction stick:** *"Make this correction permanent so it applies to everything we build from now on."*

> **THE MONTHLY TEST:** open the app on your phone and ask three questions. Is every open PO's status still true? Did anything reach a buyer, a manufacturer or Tally without the yes it needed? Does the diary explain the week better than your memory does? If all three are yes, build the next system. If any is no, fix that first.

---

*Prepared for Rounakk Ajay Kedia · Kedia Groups. Condensed from Builder Guides 02–04 and the UI Guide against the Kedia Groups AI Systems Blueprint (BOA-2026-KED-01). Shadow before send, always. Every rate, payment and signature stays human.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-KED-C1 · REV A*
