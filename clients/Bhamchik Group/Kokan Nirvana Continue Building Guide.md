Buildour AI · Kokan NirvanaContinue Building · Rev A

# KOKAN NIRVANA OS CONTINUE BUILDING

Prepared for **Shubham Manjunath Anvekar**. Every sitting after day 1: **several Claude Code sessions at once**, one per system, joined by one **Main session**, in the blueprint’s order.

Main  
session–– Builder  
sessions–– Test on  
phone–– Five real  
cases–– Merge,  
live–– Switch  
on–– Next  
system

|                                                                                                                                                                                                                   |                                                                                                                                       |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Use it whenEvery box in Step 4 of the Starter Guide is ticked. Keep this file in `docs/` next to the blueprint, and come back to section 02 at the start of every sitting.                                        |                                                                                                                                       |
| The ideaA site has one site engineer and one team per building. Your project has one **Main session** (the engineer) and up to three **builder sessions** (the teams), each on its own system and its own branch. | Your time7 to 10 hours a week: start the sessions, answer their questions, test on your phone, approve. The sessions do the building. |
| SourcesBlueprint BOA-2026-BHA-01 Rev B; the Starter Guide’s R1 to R3.                                                                                                                                             | Also readThe Systems, Costs and Automation Guide, before connecting n8n, WhatsApp or the AI agents.                                   |

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                   | What it does                                                                                                                                    | Name it in the app                      |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **Main** (always one)     | Keeps the master copy (`main`), owns the database, joins finished work, keeps CLAUDE.md and START-NOW up to date. Never builds a system itself. | `MAIN`                                  |
| **Builder** (up to three) | Builds one system, on its own branch, in its own copy of the folder. Touches only that system’s files. Hands over to Main when a phase is done. | `SYS-01 Lead flow`, `SYS-02 Tutorials`… |
| **Writing lane**          | Writes words, not code: the sales script, tutorial scripts, message templates. Can run from day 1.                                              | `SYS-03 Sales script`                   |

Why this does not get messy

Each builder session works in its own copy of the code (Git calls it a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so you test a system on your phone before it reaches the live app. Only the Main session joins work into the live copy, one system at a time. The rules for this are already in your CLAUDE.md (Starter Guide R3).

The session buttons

In the Claude app’s **Code** tab, start a **new session** on the same `kokan-nirvana-os` folder while another is still working; each one shows in the list on the left, and you click to switch. Name each after its job (`MAIN`, `SYS-01 Lead flow`, `SYS-02 Tutorials`, `SYS-03 Sales script`) so you never mix them up.

**THREE AT A TIME, NOT MORE.** Three builder sessions is the most you can follow, test and answer in a sitting. More sessions do not mean faster: unanswered questions and untested screens pile up. On Max 5x, if sessions start pausing for limits, run two builders, or move to Max 20x.

02

EVERY SITTING

Same routine, every day

1

Paste to the Main session

**Open the day.** Open the Claude app → Code → click your `MAIN` session (or start one on the `kokan-nirvana-os` folder) and paste the box below.

Paste · Main session · start of every sitting

You are the Main session for the Kokan Nirvana OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/ and the latest note in docs/sessions/. Then tell me in simple words, in ten lines or fewer: what is not yet ticked in START-NOW; which systems are in progress and on which branch; any handover waiting to be merged; any request in docs/requests/ waiting for you; and which builder sessions I should run today (at most three). Do nothing else until I say OK.

2

You do this

**Open the builder sessions Main named.** If a session for that system already exists in the list on the left, click it and paste the **continue** box from §03. If not, start a new session on the same folder, name it, and paste the **new system** box from §03.

3

You do this

**Go round the sessions.** Answer whichever session is waiting. Each one builds one small finished thing per sitting and shows you its test address. Open it on your phone and check one real lead, unit or receipt you know.

4

Paste to each session, then Main

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then in Main: `Read today's handovers. Merge anything marked ready, apply its migrations in order, and tell me what changed on the live app.`

03

THE BUILDER SESSION PROMPTS

Paste to a builder session

Replace the brackets with the system from §05, for example **SYS-01 Kokan Nirvana Lead-to-Visit Flow** and `sys-01-lead-flow`.

Paste · New builder session · first message for a system

You are the builder session for **\[SYS-0N and system name\]** in the Kokan Nirvana OS. Read CLAUDE.md, docs/SESSIONS.md, the blueprint in docs/, and docs/build-sheets/\[sys-0N\].md (write it first, from the blueprint, if it does not exist, and wait for my approval). Work only in your own git worktree on the branch **\[sys-0N-short-name\]**, never on main, and touch only this system’s folders, as R3 of the Starter Guide sets out. Database changes go only in new migration files for this system, adding, never dropping or renaming. If you need a shared file changed, write the request in docs/requests/ and tell me.

Before any code: (1) read docs/design/ and list every screen this system needs: the one question it answers, its one main button, who uses it and on what device, as simple text sketches; (2) give me a plan in small phases, each ending with something I can test on my phone at your branch’s test address, the first phase always “load my real data and show me one true list”; (3) list anything this system needs from outside (n8n, WhatsApp templates, Meta access, an API key) and what it costs, from the Systems, Costs and Automation Guide. Wait for my OK before writing files.

Paste · Existing builder session · continue

Read CLAUDE.md, your build sheet and your handover file. Tell me in five lines where this system stands and what the one finished thing for today is. Make a plan and wait for my OK.

Paste · Writing lane · SYS-03 Sales Skill (day 1 onwards)

You are the writing session for SYS-03 Kokan Nirvana Second Home Sales Skill. You write only in docs/ and content/, never code. Interview my sales manager through me, one question at a time, and write content/sales-skill.md: the questions for a new lead, the first WhatsApp reply, the 5 to 6 follow-ups across a 2 to 3 month cycle, the visit pitch, the post-visit note, the handover checklist, the retention touches, and the answers to maintenance, rental yield and distance. Keep the language my team actually uses, Hindi, Marathi or English. Leave every price, offer and payment plan as a blank for a person. Then write each customer message as a WhatsApp template in content/templates/ ready for Meta approval, marked draft until I sign it.

04

BUILD, TEST, SWITCH ON

The same five moves for every system

1.  **One finished thing per sitting.** Each builder ends its sitting with something you can open on your phone at its test address. Check one lead, unit or receipt you know against reality. Write every surprise in `docs/rules-i-learned.md`.
2.  **Merge when a phase is done.** The builder writes its handover; Main merges, applies the database change, and the live app updates in about two minutes.
3.  **Five real cases.** Run five real leads (or units, or receipts) through the system while a person presses every send button. Fix every wrong word or date the same day.
4.  **Watch week.** For one week the system works beside the old way: the old CRM and the team’s WhatsApp carry on. Compare every day.
5.  **Switch on** only what passed, and only what your guardrails allow AI to do alone: sending details and tutorials, follow-ups, visit reminders, internal reminders. Anything with a price, discount, payment plan or token amount stays with a person forever. One switch in Settings turns all sending off.

**IF A SESSION GOES WRONG:** in that session say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* Because each system has its own branch, one broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · up to three at once

| Weeks | Main session                                           | Builder A                                         | Builder B                                                                        | Builder C / writing lane                               |
|-------|--------------------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------|--------------------------------------------------------|
| 1     | F-00 Single Record (done on day 1); CRM leads imported | *Wait until F-00 is merged*                       |                                                                                  | SYS-03 Sales script (writing)                          |
| 1–3   | Merges, migrations, n8n account                        | **SYS-01** Lead-to-Visit Flow `sys-01-lead-flow`  | **SYS-02** Property Tutorial Library `sys-02-tutorials`                          | SYS-03, then WhatsApp templates sent for Meta approval |
| 3–6   | Merges; SYS-01 watch week fixes                        | **SYS-04** Receipt and Ledger App `sys-04-ledger` | **SYS-05** Payment Reminder Flow `sys-05-reminders`, after SYS-04’s tables merge | SYS-01 and SYS-02: five cases, watch week, switch on   |
| 7–10  | Merges                                                 | **SYS-06** Funnel Board `sys-06-funnel`           | **SYS-07** Finance Board `sys-07-finance`                                        | SYS-04 and SYS-05: watch week, switch on               |
| 9–12  | Roles sheet signed; merges                             | **SYS-08** Team Desk `sys-08-team-desk`           | Free, or the first AI agent (month 4)                                            | 15 logins handed out, one person first                 |

| System                   | Done when (from the blueprint)                                                                                                                                                                                                                                                                            |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SYS-01 + SYS-02 + SYS-03 | Every new lead from Meta, the landing page and the portal exists as one record within minutes, has received the project details and the right property tutorial on WhatsApp without staff typing, and its follow-ups and visit date are on that record; every quotation is parked waiting for your price. |
| SYS-04 + SYS-05          | Every token and instalment from week 5 has a numbered receipt sent after a tick, a ledger entry and an updated unit outstanding, and every instalment due has been reminded without a staff member sending it.                                                                                            |
| SYS-06 + SYS-07          | At 9 AM you and the sales manager see leads by campaign, cost per visit, overdue follow-ups, quotation age, cash, dues and the month’s profit and loss without a phone call.                                                                                                                              |
| SYS-08                   | All 15 have their own login and see only their pages; the day opens and closes with one summary to you.                                                                                                                                                                                                   |

**THE GATES:** no builder starts before F-00 is merged. SYS-05 waits for SYS-04’s tables. SYS-04 waits for your instalment schedule, receipt format and incentive rules (START-NOW item 8). Customer sending on WhatsApp waits for Meta to approve the templates; until then the flow drafts and a person sends.

06

CONNECT n8n, META AND WHATSAPP

When SYS-01 asks · about 40 minutes

n8n is the automation layer: it catches each new Meta lead, sends the WhatsApp messages and runs the timed jobs (follow-ups, reminders, the morning and evening runs). Claude Code writes every n8n workflow as a file; you import it and add the passwords inside n8n.

N1

**Open n8n.** Go to **n8n.io**, press **Get started**, sign up with the business email and choose the **Starter** Cloud plan. Name your workspace `kokan-nirvana`.

N2

**Import a workflow.** In n8n press **Create workflow**, then the three dots at the top right → **Import from File**, and choose the file the builder session names, for example `n8n/sys-01-new-lead.json` from your project folder. It appears as boxes joined by lines.

N3

**Add the passwords inside n8n, never in chat.** Each box with a red warning needs a credential: click it → **Credential** → **Create new**, and paste the value the session tells you where to find. **Facebook Lead Ads:** press **Connect** and sign in with the Facebook account that is admin of your page. **WhatsApp:** your provider’s token and phone number ID. **Your app:** the automation secret the Main session gives you, which also goes into Vercel.

N4

**Test, then switch on.** Press **Execute workflow** with one test lead (your own phone number). When it works, turn the switch at the top to **Active**. Every run is listed under **Executions**; if one fails, screenshot it and give it to the builder session.

WhatsApp templates

A message to a lead who has not written to you in the last 24 hours must use a template Meta has approved. Submit the writing lane’s templates in your WhatsApp provider’s dashboard as soon as you sign them; approval takes minutes to a few days. Until a template is approved, the flow drafts that message and a person sends it.

07

STANDING PROMPTS

Keep these handy

- **A new person, new login:** to Main: *“\[Name\] is joining as \[role\], \[office or site\]. Draft the login request for my approval.”*
- **A rule changed:** to Main: *“From today \[the rule\]. Make this permanent in CLAUDE.md and tell me which systems it touches.”*
- **Before anything new that costs money:** *“Before you connect this, tell me what it is, why, what it costs each month at our volume, and what happens if I say no. Wait for my yes.”*
- **Monthly check:** to Main: *“Audit the project against CLAUDE.md and the blueprint’s guardrails and report anything that breaks them, in simple words.”*
- **Start the AI agents (month 4 onward):** follow §04 of the Systems, Costs and Automation Guide, one agent per builder session.

**THE MONTHLY TEST:** open the OS on your phone and ask three questions. Is every lead, visit and receipt on it true? Did anything with a price or payment reach a customer without a person’s yes? Does the diary explain the week better than your memory does? Three yeses: start the next system. Any no: fix that first.

Prepared for Shubham Manjunath Anvekar · Kokan Nirvana Seashore property. Condensed from BuildOur Builder Guides 02–04 and the UI Guide  
against blueprint BOA-2026-BHA-01 Rev B. One record, one app, several sessions. Every price, payment and signature stays human.
