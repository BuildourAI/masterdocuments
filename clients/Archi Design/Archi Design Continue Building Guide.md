Buildour AI · Archi DesignContinue Building · Rev A

# ARCHI DESIGN OS CONTINUE BUILDING

Prepared for **Mahesh R. Khandagale**. Every sitting after the Starter Guide: **several Claude Code sessions at once**, one per system, joined by one **MAIN session**, in the blueprint’s order.

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

| Session                   | What it does                                                                                                                                    | Name it in the app                        |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| **MAIN** (always one)     | Keeps the master copy (`main`), owns the database, joins finished work, keeps CLAUDE.md and START-NOW up to date. Never builds a system itself. | `MAIN`                                    |
| **Builder** (up to three) | Builds one system, on its own branch, in its own copy of the folder. Touches only that system’s files. Hands over to MAIN when a phase is done. | `SYS-02 Task Sheet`, `SYS-03 Site Diary`… |
| **Writing lane**          | Writes words, not code: your SOPs, workflows, definitions of done, checklists. Runs from day 1.                                                 | `SYS-01 SOPs`                             |

The session buttons

In the Claude app’s **Code** tab, start a **new session** on the same `archi-design-os` folder while another is still working; each one shows in the list on the left, and you click to switch. Name each after its job so you never mix them up.

Why this does not get messy

Each builder session works in its own copy of the code (a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so you check a system on your phone before it reaches the live app. Only MAIN joins work into the live copy. The rules are already in your CLAUDE.md.

**THREE AT A TIME, NOT MORE.** Three builder sessions is the most you can follow, test and answer in a sitting. If sessions start pausing for limits, run two.

02

EVERY SITTING

Same routine, every day

1

Paste to MAIN

**Open the day.** Claude app → Code → your `MAIN` session, and paste:

Paste · MAIN · start of every sitting

You are the MAIN session for the Archi Design OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not yet ticked in START-NOW; which systems are in progress and on which branch; any handover waiting to be merged; any request waiting for you; and which builder sessions I should run today (at most three). Do nothing else until I say OK.

2

You do this

**Open the sessions MAIN named.** If a session for that system exists, click it and paste the **continue** box from §03; if not, start a new session, name it, and paste the **new system** box.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives you its test address. Open it on your phone and check one real project, task or drawing you know.

4

Paste to each session, then MAIN

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then in MAIN: `Read today's handovers. Merge anything marked ready, apply its migrations in order, and tell me what changed on the live app.`

03

THE SESSION PROMPTS

Paste to a builder session

Paste · New builder session (fill the brackets from §05)

You are the builder session for **\[SYS-0N and system name\]** in the Archi Design OS. Read CLAUDE.md, docs/SESSIONS.md, the blueprint and the UI Guide in docs/, docs/design/, and docs/build-sheets/\[sys-0N\].md (write it first from the blueprint if it does not exist, and wait for my approval). Work only in your own git worktree on the branch **\[sys-0N-short-name\]**, never on main, and only in this system’s folders. New tables or columns only in a new migration for this system, adding, never dropping. If you need a shared file changed, write it in docs/requests/ and tell me. Before any code: list every screen this system needs as section 03 of the UI Guide asks (one question, one main button, who, which device), as simple text sketches; give me a plan in small phases, each ending with something I can test on my phone at your branch’s test address, the first phase always “load my real data and show me one true list”; and list anything this system needs that costs money. Wait for my OK.

Paste · Existing builder session · continue

Read CLAUDE.md, your build sheet and your handover file. Tell me in five lines where this system stands and what the one finished thing for today is. Make a plan and wait for my OK.

Paste · Writing lane · SYS-01 SOP Skills (day 1 onwards)

You are the writing session for SYS-01 Archi Design SOP Skills. You write only in docs/ and content/, never code. Interview me one question at a time and write, in my own words: content/workflows.md, the workflow for each stage (concept, working drawings, site marking, execution, handover) with every task type, who owns it, who it goes to next, its definition of done and the proof required (file link, site photo or note); content/checklists.md, role-wise checklists for designer, site engineer and office desk; content/measurement.md, the standard format for measuring work (timeliness, quality, SOP adherence, rework, client response) as a draft for me to sign. Leave every price, discount and committed date to me. When I approve a file, tell MAIN to load it into the task_types and sop_items tables.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting.** Each builder ends with something you open on your phone at its test address. Check one real project or task. Write every surprise in `docs/rules-i-learned.md`.
2.  **Check the screen against the UI Guide** (its section 05). If it looks like homework, say: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a phase is done.** The builder writes its handover; MAIN merges and the live app updates in about two minutes.
4.  **Five real cases, then one person first.** Run five real tasks, site reports or drawings through it. Then give it to the one team member who feels the old pain most, before everyone.
5.  **The first live Monday.** For the Daily Task Sheet: from that Monday, no task is given by voice or WhatsApp. Keep the old way beside it for one week only, then stop.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · up to three at once

| Weeks | MAIN                                                       | Builder A                                           | Builder B                                                | Builder C / writing                    |
|-------|------------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------------|----------------------------------------|
| 1–2   | F-00 Project and Task Record (day 1); live projects loaded | *Wait for the SOPs*                                 |                                                          | **SYS-01** SOP Skills `writing`        |
| 3–6   | Loads approved SOPs; merges                                | **SYS-02** Daily Task Sheet `sys-02-task-sheet`     | Free                                                     | SYS-01 refinements                     |
| 5–8   | Merges; first live Monday                                  | **SYS-03** Site Diary `sys-03-site-diary`           | **SYS-04** Drawing Release Flow `sys-04-drawing-release` | SYS-02 watch week, one person then all |
| 8–10  | Merges                                                     | **SYS-05** Ownership Board `sys-05-ownership-board` | **SYS-06** Nudge and Escalate `sys-06-nudge`             | SYS-03, SYS-04 five cases              |
| 10–12 | Claude API set up (with your yes)                          | **SYS-07** Nandini `sys-07-nandini`                 | **SYS-08** Scorecard App `sys-08-scorecard`              | First monthly scorecards               |

| Phase                     | Done when (from the blueprint)                                                                                                                                                                                                                                                        |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 · F-00, SYS-01, SYS-02 | Every one of the 7 people opens their own task list on their phone each morning with a deadline and a definition of done, every closed task carries a proof, and no task has been given by voice or WhatsApp since the first live Monday.                                             |
| P2 · SYS-03, SYS-04       | Every live site has a dated site report with stamped photographs for every working day of the past week, every drawing on any site carries the Approved for Execution stamp with the old version withdrawn, and every open drawing query has a designer’s name and a date against it. |
| P3 · SYS-05 to SYS-08     | A full working week passes in which you made no follow-up call, Nandini’s 6 PM summary arrived every evening, and the first monthly scorecards sit on your table in the standard format before any employee has seen them.                                                            |

**THE GATES:** SYS-02 waits for the approved SOPs. SYS-05 is not switched on before week 8: it only shows what the Task Sheet has collected. SYS-08’s first cards are only as fair as the SOP lines from weeks 1 to 2. SYS-04 only works once drawings stop going to site as WhatsApp images. SYS-07 waits for your yes on the Claude API cost. Every message to a client, contractor or vendor about dates, extra work or cost waits for you.

**Months 4 to 12, same house:** Project Health Wall and Command Centre, Client Pulse on every closed stage (months 4 to 6) → Site Controller and Digital Ops Manager (months 6 to 8) → attendance and personal dashboards (months 8 to 10) → project costing in a locked tab and a simple CRM for Instagram, Just Dial and referral (months 10 to 12). Each starts at §03 of this guide.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                                 | First appears       | What it means for you                                                                                                                                                                                                           |
|--------------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Pro**                     | SYS-03, SYS-04      | About \$25 a month once site photos and drawings fill the free storage; also adds daily backups.                                                                                                                                |
| **Claude API key**                   | SYS-07 Nandini      | Nandini runs at 9 AM and 6 PM with nobody at the computer, which Claude Max does not cover. Roughly \$10 to \$30 a month for 7 people. Set up at platform.claude.com with a monthly spend limit; the key goes only into Vercel. |
| **WhatsApp Business API** (optional) | Later: Client Pulse | Only if you want reminders and summaries on WhatsApp instead of inside the app. Needs Meta verification and paid messages.                                                                                                      |

Paste · Before any new connection

Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month for us, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to add it in Vercel and to redeploy.

07

STANDING PROMPTS

Keep these handy

- **A new person:** to MAIN: *“\[Name\] is joining as \[role\]. Draft the login and the joining checklist from the SOPs for my approval.”*
- **A rule changed:** to MAIN: *“From today \[the rule\]. Make this permanent in CLAUDE.md and tell me which systems it touches.”*
- **My guardrails are written:** to MAIN: *“Here are my three guardrails in my own words: \[…\]. Replace the careful defaults in CLAUDE.md with them and tell me what changes.”*
- **Monthly check:** to MAIN: *“Audit the project against CLAUDE.md and report anything that breaks it, in simple words.”*

**THE MONTHLY TEST:** open the OS on your phone and ask three questions. Is every task, site report and drawing on it true? Did anything reach a client, contractor or vendor without your yes? Does the diary explain the week better than your memory does? Three yeses: start the next system. Any no: fix that first.

Prepared for Mahesh R. Khandagale · Archi Design. Condensed from BuildOur Builder Guides 02–04 against blueprint BOA-2026-ARC-01 Rev A.  
One record, one app, several sessions. Every price, date and decision about people stays with the owner.
