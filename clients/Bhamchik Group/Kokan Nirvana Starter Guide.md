Buildour AI · Kokan NirvanaStarter Guide · Rev B

# KOKAN NIRVANA OS STARTER GUIDE

Prepared for **Shubham Manjunath Anvekar**, Bhamchik Group. Your accounts are connected. Now **upload two files, paste one prompt**, and Claude Code lays the foundation of your Real Estate OS.

Accounts  
connected–– Files in  
docs–– Starter  
prompt–– Choose  
the look–– Continue  
building

[TABLE]

Two voices on every step: YOU DO THIS (a click on your computer) · PASTE TO CLAUDE CODE (copy the whole box)

00

READ THIS FIRST

Two minutes

You need no coding knowledge. Claude Code writes every line. Your job is to answer its questions in your own words, say OK when you agree, and check what it built against leads and units you know. When you do not understand something, type `explain this to me in simple words`. When something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. When Claude asks permission to run something you do not understand, type `what will this do, in simple words?` before saying yes.

STEP 1

You do this

**Put the files in your project folder**

1.  Open the folder Romana set up with you: `Documents\kokan-nirvana-os`. Make a folder inside it called `docs`.
2.  Put in `docs`: the **Blueprint Rev B PDF**, this **Starter Guide PDF** and the **Systems, Costs and Automation Guide PDF**. Keep the Continue Building Guide aside until Step 4.
3.  Inside `docs`, make a folder `samples` and put in what you have: the CRM export, one receipt you sent, one brochure. These never go online; Claude keeps them out of GitHub.

STEP 2

Paste to Claude Code

**The starter prompt.** Open the Claude app → **Code** → start a new session on the `kokan-nirvana-os` folder and name it `MAIN`. Drag the **Blueprint Rev B PDF** and this **Starter Guide PDF** into the message box, paste the box below, and send.

Paste · The starter prompt (MAIN session)

You are setting up the Kokan Nirvana OS, the real estate operating system for Kokan Nirvana Seashore property, the second-home brand of Bhamchik Group. I am Shubham Anvekar, the owner, and I am not a programmer. Attached, and saved in docs/, are my AI Systems Blueprint Rev B and my Starter Guide; pages R1, R2 and R3 of the Starter Guide are written for you. This folder is already connected to my private GitHub repository, my Vercel project and my Supabase keys in .env.local. This session is the **MAIN session**. Work in five stages. After each stage, tell me in simple words what you did, then **stop and wait for my OK**. Ask me one question at a time.

**Stage 1: Read and check.** Read the blueprint and the Starter Guide. Tell me in ten lines or fewer: what Kokan Nirvana is, my main pains, the foundation and eight systems, and the build order. List what the blueprint says I still have to settle; do not settle it yourself. Then check quietly that GitHub, Vercel and the Supabase keys work, and tell me only if something needs fixing.

**Stage 2: The rules.** Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Make sure .gitignore keeps out .env.local, docs/samples and any file with customer phone numbers. Read the rules back to me in five lines.

**Stage 3: The foundation.** Build F-00 Kokan Nirvana Single Record as R3 describes: the tables, sign-in and Row Level Security. Tell me exactly what to paste into the Supabase SQL Editor and where to click, and what to set in Supabase so sign-in works on my live address. Add my owner login, push, and confirm I can sign in on my phone at the live address.

**Stage 4: My list for today.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first, and tell me the first action for each. Start every future session by reminding me of anything not ticked.

**Stage 5: Plan the sessions.** Write docs/SESSIONS.md: the build order, which systems are built side by side in separate sessions (R3), and each one’s branch name. Write one docs/build-sheets/ file for each P1 system (SYS-01, SYS-02, SYS-03): what it does, what it must never do (from the blueprint), the data it needs and its done-when. No feature code yet. Finish by telling me to choose the look (Step 3 of the Starter Guide) and then open the Continue Building Guide (Step 4).

STEP 3

You do this

**Choose the look, before the first real screen**

Claude builds what you say, but it designs what you show it. Ten minutes here decides whether your staff open the OS or keep calling you.

1.  **Collect.** On pinterest.com search `minimalist UI design web app` and `real estate CRM dashboard minimal`. Download 10 to 15 clean screens your staff would understand at a glance.
2.  **Let the strongest model choose.** In the Claude app open **Chat** (not Code), choose the strongest model, attach the screenshots and paste the chooser prompt below.
3.  **Get it in writing.** Upload only the winning one or two designs again and ask: *“Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Download the file.
4.  **Hand it over.** Save the images and the .md file in `docs/design/` and tell MAIN: *“The design direction is in docs/design. Add a line to CLAUDE.md saying every screen in every session follows it.”*

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: Kokan Nirvana Seashore property, a second-home real estate brand in the Konkan, part of Bhamchik Group. The screens are used by my sales staff on their phones in the office and at site visits, by my sales manager on a laptop, and by me on my phone to approve prices, see leads, visits and money, and check on my 15 people. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

STEP 4

You do this

**Now open the Continue Building Guide**

This Starter Guide is used once. From here on, the **Continue Building Guide** is the one you use: at the start of every sitting, to start each system, to run several sessions at once, and to connect n8n, Meta and WhatsApp. Put its PDF into `docs/` when all of this is true:

- You can sign in to the OS on your phone at your `.vercel.app` address.
- `CLAUDE.md` holds your rules, and the foundation tables show in Supabase’s **Table Editor**.
- `docs/START-NOW.md`, `docs/SESSIONS.md` and the three P1 build sheets are written, and you have read and corrected them.
- `docs/design/` holds your chosen look.

Then open its section 02, **Every sitting**, and follow it. If a box is not ticked, paste it into MAIN and say *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by Claude Code in Stage 4

Things that wait on a person or on an outside company. Romana may already have ticked some on the call. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

| \#  | Item                                                                                                                                                                                                                                                                                    | Owner                      | Needed for             |
|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|
| 1   | **Confirm Rev B:** the Meta spend currency (“\$50,000” on the call), what “before DEC” means, the three figures in the blueprint’s section 05, and the third guardrail (what is never automated).                                                                                       | Shubham                    | Day 1                  |
| 2   | **CRM export and name:** every lead as Excel or CSV: name, phone, source, campaign, date, stage, staff member, notes.                                                                                                                                                                   | Shubham                    | F-00, SYS-01           |
| 3   | **WhatsApp API:** the provider’s name, admin login, the business number, and which message templates Meta has already approved. New templates take minutes to a few days to approve, so list the first ones now: project details, follow-up 1 to 5, visit confirmation, visit reminder. | Shubham                    | SYS-01                 |
| 4   | **Meta access:** admin on the ad account and the Facebook page that owns the lead forms; the landing page’s form or the tool it is built on.                                                                                                                                            | Shubham                    | SYS-01, SYS-06         |
| 5   | **One tutorial pack per property:** name, location, distance from the city, unit or plot list with sizes (no prices), 10 to 20 photos, a 2 to 3 minute phone walkthrough, the brochure, the five questions buyers ask most.                                                             | Shubham with sales manager | SYS-02                 |
| 6   | **The sales script, dictated:** first reply, 5 to 6 follow-ups over the 2 to 3 month cycle, the visit pitch, post-visit note, objections (maintenance, rental yield, distance).                                                                                                         | Sales manager              | SYS-03                 |
| 7   | **Visit slots:** which days and times site visits can happen, and who takes them.                                                                                                                                                                                                       | Sales manager              | SYS-01                 |
| 8   | **Money rules, written once:** the standard instalment schedule for a sale, the receipt format and numbering, the incentive rules. Before week 3.                                                                                                                                       | Shubham                    | SYS-04, SYS-05, SYS-07 |
| 9   | **One person who enters receipts and expenses** from week 3.                                                                                                                                                                                                                            | Shubham with sales manager | SYS-04                 |
| 10  | **An n8n account** (n8n.io, Cloud Starter), on the business email, when SYS-01 starts. The Continue Building Guide, section 06, shows the clicks.                                                                                                                                       | Shubham                    | SYS-01                 |
| 11  | **The 15 people:** name, role, office or site, mobile, for their own logins. Before week 9.                                                                                                                                                                                             | Shubham                    | SYS-08                 |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by Claude Code in Stage 2

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones Kokan Nirvana will ever have; every system is a new section of the same app reading the same leads, properties and logins. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; the owner sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING REACHES A CUSTOMER WITH MONEY IN IT: no price, discount, payment plan, token amount or commitment goes to a customer without the owner or sales manager approving it; customer messages use only templates the owner has signed; one switch turns all automatic sending off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local, in Vercel’s settings and in n8n’s credentials, never in code, in chat or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: amounts, totals, instalments and receipt numbers come from exact tested code; AI reads, drafts, matches and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Kokan Nirvana rules.** Price or any financial decision is always signed off by a person: the flows draft, park and wait. AI may act alone only to manage the sale funnel (capture, record, send approved details and tutorials, schedule follow-ups and visits, remind, report) and to run the AI agents named in the blueprint within these rules. Until I write my third guardrail, hiring, letting go, changing a person’s role or access, and writing incentive rules stay with me and the sales manager. A receipt is generated only after a person ticks that the money has landed in the bank. Payment reminders never offer an extension, waiver, late charge or changed amount. No property tutorial contains a price. Any change to Meta ad spend is mine, never the system’s. The figures in the blueprint’s section 05 are unconfirmed: never hard-code them. Customer phone numbers, exports and docs/samples never go to GitHub. The current CRM keeps running beside the OS until I say otherwise. Build in the blueprint’s order; a system starts only when its build sheet is approved by me.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Shubham can skip this page

### Stack and keys

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security) through `@supabase/ssr` and `@supabase/supabase-js`, deployed on Vercel from `main`; branches get Vercel preview deployments. Automations run in n8n (Cloud), written by Claude Code as workflow JSON files in `n8n/` for Shubham to import; n8n talks to the app through authenticated API routes, never straight to the secret key. Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (legacy anon and service_role values must work in them), and later `AUTOMATION_SHARED_SECRET` for n8n calls and `ANTHROPIC_API_KEY` for the agents. Commit `.env.example` with names only. Write a README.md a non-programmer can read.

### F-00 Single Record: the starting shape

Tables: **profiles** (one per login: name, role owner / sales_manager / staff / accounts, office or site, active); **properties** (name, location, distance, status); **units** (property, label, size, status; no price column until SYS-04); **leads** (name, phone, source meta / landing_page / portal / walk_in / crm_import, campaign, property interest, assigned staff, stage, next_followup_at, followup_step, needs_owner with reason, crm_ref); **visits**; **activities** (every call, message and note against a lead); **templates** (body, status draft / signed, signed_by); **settings** (auto_send off by default: the one switch); **audit_log** (append only, no update or delete for anyone). Row Level Security on every table: owner and sales manager see all; staff see their assigned leads. Stages follow the money path: new, details sent, follow-up, visit booked, visited, quotation parked, quotation sent, token, instalments, handed over, lost. Each later system adds its own tables in its own migration.

### Sessions: how several Claude Code sessions build at once

- **One Main session** owns `main`, CLAUDE.md, docs/SESSIONS.md and the database. It applies migrations in order and merges finished work.
- **One builder session per system**, at most three at a time. Each works only in its own git worktree on its own branch, `sys-0N-short-name`, never on `main`, and touches only its own folders: `app/(sys-0N)/`, `lib/sys-0N/`, `n8n/sys-0N-*.json`.
- A builder never edits another system’s files or an existing migration. It adds new tables or columns only in a new file `supabase/migrations/<timestamp>_sys0N_<what>.sql`, and only adds, never drops or renames.
- Shared files (the sign-in, the menu, CLAUDE.md, shared types) change only in the Main session. A builder that needs one changed writes the request in `docs/requests/` and tells Shubham.
- When a builder finishes a phase it commits, pushes its branch, writes a short handover in `docs/handovers/sys-0N.md`, and tells Shubham to switch to the Main session to merge.
- The writing lane (SYS-03 Sales Skill, the tutorial scripts) writes only in `docs/` and `content/` and can run from day 1.

### How to work with Shubham

- One step at a time, in simple words, one question at a time. Plan first and wait for his OK before writing files.
- End every phase with something he can open on his phone, and ask him to check one lead or unit he knows.
- Before any message to customers is switched to send by itself, run it on five real leads with a person pressing send.
- Before adding anything that costs money (an API key, a paid plan, a new service), tell him what it is, why, the monthly cost at his volume, and what happens if he says no. Wait for his yes.
- Close every sitting by writing a dated note in `docs/sessions/`: done, next, open questions.

Prepared for Shubham Manjunath Anvekar · Bhamchik Group · Kokan Nirvana Seashore property · traces to blueprint BOA-2026-BHA-01 Rev B  
and the working call of 09.11.2026. Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub, n8n.
