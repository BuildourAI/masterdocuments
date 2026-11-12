Buildour AI · GREATISHContinue Building · Rev A

# GREATISH OS CONTINUE BUILDING

Prepared for **Ajay Kumar**. Every sitting after the Starter Guide: **several Claude Code sessions at once**, one per system, joined by one **MAIN session**, field sales first.

MAIN  
session–– Builder  
sessions–– Test on  
phone–– Five real  
cases–– Merge,  
live–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                   | What it does                                                                                                                                    | Name it in the app                      |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **MAIN** (always one)     | Keeps the master copy (`main`), owns the database, joins finished work, keeps CLAUDE.md and START-NOW up to date. Never builds a system itself. | `MAIN`                                  |
| **Builder** (up to three) | Builds one system on its own branch, in its own copy of the folder, touching only its files. Hands over to MAIN when a phase is done.           | `SYS-01 Beat App`, `SYS-03 Store Gate`… |
| **Writing lane**          | Writes words, not code: the Field Day rules, batch record and QC formats, department SOPs, HR letter templates. Never formulations.             | `SKILLS writing`                        |

The session buttons

In the Claude app’s **Code** tab, start a **new session** on the same `greatish-os` folder while another is still working; each shows in the list on the left, and you click to switch. Name each after its job.

Why this does not get messy

Each builder works in its own copy of the code (a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so a system is checked on a phone before it reaches the live app. Only MAIN joins work into the live copy.

**THREE AT A TIME, NOT MORE.** Three builders is the most one person can follow, test and answer in a sitting. If sessions start pausing for limits, run two.

02

EVERY SITTING

Same routine, every day

1

Paste to MAIN

**Open the day.** Claude app → Code → your `MAIN` session, and paste:

Paste · MAIN · start of every sitting

You are the MAIN session for the GREATISH OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not yet ticked in START-NOW; which systems are in progress and on which branch; any handover waiting to be merged; any request waiting for you; anything waiting for Ajay’s approval; and which builder sessions I should run today (at most three). Do nothing else until I say OK.

2

You do this

**Open the sessions MAIN named.** If a session for that system exists, click it and paste the **continue** box from §03; if not, start a new session, name it, and paste the **new system** box.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Open it on a phone and check one real executive, shop, batch or task you know. Check every new screen against section 03 of the Starter Guide.

4

Paste to each session, then MAIN

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then in MAIN: `Read today's handovers. Merge anything marked ready, apply its migrations in order, and tell me what changed on the live app.`

03

THE SESSION PROMPTS

Paste to a builder session

Paste · New builder session (fill the brackets from §05)

You are the builder session for **\[SYS-0N and system name\]** in the GREATISH OS. Read CLAUDE.md, docs/SESSIONS.md, the blueprint and the Starter Guide in docs/ (especially its section 03 on screens), docs/design/, and docs/build-sheets/\[sys-0N\].md (write it first from the blueprint if it does not exist, and wait for my approval). Work only in your own git worktree on the branch **\[sys-0N-short-name\]**, never on main, and only in this system’s folders. New tables or columns only in a new migration for this system, adding, never dropping. If you need a shared file changed, write it in docs/requests/ and tell me. Before any code: list every screen this system needs (one question, one main button, who, which device) as simple text sketches; give me a plan in small phases, each ending with something I can test on a phone at your branch’s test address, the first phase always “load my real data and show me one true list”; and list anything that needs Ajay’s approval rule or costs money. Wait for my OK.

Paste · Existing builder session · continue

Read CLAUDE.md, your build sheet and your handover file. Tell me in five lines where this system stands and what the one finished thing for today is. Make a plan and wait for my OK.

Paste · Writing lane · the skills (from day 1)

You are the writing session for the GREATISH skills. You write only in docs/ and content/, never code, and never any chemical formulation. Interview me one question at a time and write, in our own wording: content/field-day.md (what counts as a real shop visit, the fixed outcome list, the beat plan rule, the end-of-day report format, the quotation cover note with the rate line blank); content/batch-record.md (batch numbering, the batch manufacturing record, material issue slip, QC test report, finished goods inward note and daily production report formats, the machinery job card); content/sops.md (each department SOP in five lines: who, when, who approves, how long, who is told); content/hr-letters.md (offer, appointment, joining, confirmation, increment, warning, relieving and experience letters, with every salary and decision left blank for the authorised person). Mark each file draft until I approve it, then tell MAIN to load it.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested on a phone at the branch’s test address against one real record. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against section 03 of the Starter Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a phase is done.** The builder writes its handover; MAIN merges; the live app updates in about two minutes.
4.  **Five real cases, then one team first.** For the Beat App: five executives in one territory for a week, then all. For Store Gate: one warehouse, then the rest.
5.  **Shadow before trust.** The Field Verify Flow, both auditors and the Duty Officer report to you first and change nothing until you have judged their alerts for a few weeks. A mismatch is a question for the sales head, never a verdict on an employee.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · up to three at once

| Weeks | MAIN                                                 | Builder A                                                                                                          | Builder B                                                  | Writing / other                |
|-------|------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|--------------------------------|
| 1–2   | F-00 Shared Record and approval matrix (day 1)       | **SYS-01** Beat App `sys-01-beat-app`                                                                              | Free                                                       | Field Day Skill (writing)      |
| 3–6   | Merges; Beat App on every phone                      | **SYS-02** Field Verify + Sales Command Board `sys-02-field-verify`                                                | **SYS-03** Store Gate + Batch Record `sys-03-store-gate`   | Batch Record formats (writing) |
| 7–10  | Merges; SOPs loaded                                  | **SYS-04** Task Desk + Pending Work Board `sys-04-task-desk`, then **SYS-05** Escalation Chain `sys-05-escalation` | **SYS-06** Plant Board `sys-06-plant-board`                | Department SOPs (writing)      |
| 9–12  | Tally connector and Claude API set up, with your yes | **SYS-07** Purchase to Tally `sys-07-purchase-tally`                                                               | **SYS-08** Plant + Sales Auditor, shadow `sys-08-auditors` | HR letters (writing)           |

| Phase                 | Done when (from the blueprint)                                                                                                                                                                                                                                                                                                           |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 · F-00, SYS-01     | The architecture, roles and approval matrix are signed off in one sitting, and every field executive has his own login on the Beat App with every claimed shop visit existing as a GPS check-in row inside duty hours.                                                                                                                   |
| P2 · SYS-02, SYS-03   | A verified-versus-reported sheet per executive reaches your phone each morning without a call, and every material movement at the plant exists as a Store Gate entry stamped to a batch and a warehouse.                                                                                                                                 |
| P3 · SYS-04 to SYS-06 | Every department’s open and overdue tasks show on the Pending Work Board with a named holder, late items have been reminded and escalated without you phoning anyone, and the Plant Board shows real batch cost against BOM for the batches made that week.                                                                              |
| P4 · SYS-07, SYS-08   | The real state of field sales, plant, stores, purchase and pending work is visible in one place, matched purchases post to Tally without a second typing, and a daily AI report with the auditors’ exceptions arrives on your phone, so you do not ask employees for information or chase any task yourself, on one to two hours a week. |

**THE GATES:** no builder starts before F-00 and the approval matrix are merged. SYS-02 waits for a few weeks of Beat App records; SYS-06 for a few weeks of Store Gate and batch records, and for your standard BOM costs. SYS-07 needs clean supplier ledgers and approved supplier lists per material before anything posts to Tally. SYS-08 runs in shadow mode: it reports, it changes nothing.

**Months 4 to 12, same house:** the Duty Officer and one consolidated daily, weekly and monthly report (months 4 to 6) → dealer and customer profiles, credit limit monitoring and bakaya reminders by WhatsApp in approved wording (months 6 to 8) → the full HR module: attendance, leave, payroll inputs, PF and ESI (months 8 to 10) → machinery service, tender tracking, a document knowledge base and the CEO assistant (months 10 to 12). Each starts at §03.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                                 | First appears                                     | What it means for you                                                                                                                                                                                                                                          |
|--------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Pro**                     | Before the Beat App goes live                     | About \$25 a month: room for GPS rows and photos from 50 to 100 executives, and daily backups.                                                                                                                                                                 |
| **Tally connector**                  | SYS-07                                            | Tally Prime runs on your office computer. The OS posts to it through Tally’s own data interface, which needs that computer on and a small connector program installed, or a paid Tally connector service. Claude Code shows the options and costs; you choose. |
| **Claude API key**                   | SYS-08, then the Duty Officer                     | The auditors run every night with nobody at the computer, which Claude Max does not cover. Billed per use with a monthly spend limit you set at platform.claude.com; the key goes only into Vercel. Claude Code shows the expected monthly cost first.         |
| **WhatsApp Business API** (optional) | Morning notes, POs to suppliers, bakaya reminders | Only if you want these on WhatsApp instead of inside the app or email. Needs Meta business verification, approved templates and paid messages.                                                                                                                 |

Paste · Before any new connection

Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month for us, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to add it and to redeploy.

07

STANDING PROMPTS

Keep these handy

- **New executive or employee:** to MAIN: *“\[Name\] joins as \[role\] in \[company, territory or department\]. Draft the login and the joining letter for my approval.”*
- **A limit or rule changes:** to MAIN: *“From today \[the rule or limit\]. Update the approval matrix and CLAUDE.md and tell me which systems it touches.”*
- **A new company or warehouse:** to MAIN: *“Add \[company / warehouse\]. Show me what it needs before anything changes.”*
- **Monthly check:** to MAIN: *“Audit the project against CLAUDE.md and my guardrails and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** open the OS on your phone and ask three questions. Is every visit, order, batch and task on it true? Did any rate, credit, purchase or payment go through without the yes it needed? Does the daily note explain the week better than phone calls would? Three yeses: start the next system. Any no: fix that first.

Prepared for Ajay Kumar · GREATISH PVT LTD. Condensed from BuildOur Builder Guides 02–04 against blueprint BOA-2026-GRE-01 Rev A.  
One record, one app, several sessions. Every price, payment, formula and decision about people stays human.
