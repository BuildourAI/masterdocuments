Buildour AI · Archi DesignStarter Guide · Rev A

# ARCHI DESIGN OS STARTER GUIDE

Prepared for **Mahesh R. Khandagale**. Your accounts are connected. Now **upload two files, paste one prompt**, and Claude Code lays the foundation of the Archi Design OS.

Accounts  
connected–– Files in  
docs–– Starter  
prompt–– Choose the  
look–– Continue  
building

[TABLE]

Two voices on every step: YOU DO THIS (a click on your computer) · PASTE TO CLAUDE CODE (copy the whole box)

00

READ THIS FIRST

Two minutes

You wrote: *“My Business is Not growing because I am involved in daily office activities rather than focusing on a growth. Employees don’t take ownership. I have to follow up constantly.”* Your blueprint answers that with one shared record and eight systems. The first one is the **Daily Task Sheet**: each of your 7 people opens their own task list on their phone, marks work done with proof or not done with a reason, and you stop giving tasks by voice.

You need no coding knowledge. Claude Code writes every line. Your job is to answer its questions in your own words, say OK when you agree, and check what it built against projects and people you know. When you do not understand something, type `explain this to me in simple words`. When something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. When Claude asks permission to run something you do not understand, type `what will this do, in simple words?` before saying yes.

What it costs

Claude Max (about \$100 a month) builds everything. GitHub is free. Supabase is free to start; move to its Pro plan (about \$25 a month) once site photos and drawings start filling it. Vercel Pro is about \$20 a month for a business app. The only other cost comes later: Nandini, the AI follow-up desk, runs on the Claude API (roughly \$10 to \$30 a month for 7 people). Claude Code always tells you a cost and waits for your yes before adding anything.

STEP 1

You do this

**Put the files in your project folder**

1.  Open the folder Romana set up with you: `Documents\archi-design-os`. Make a folder inside it called `docs`.
2.  Put in `docs`: the **AI Blueprint PDF**, this **Starter Guide PDF** and the **UI Guide PDF**. Keep the Continue Building Guide aside until Step 4.
3.  Inside `docs`, make a folder `samples` and put in what you have: one drawing with your usual file name, one site photo, your list of live projects, any SOP or checklist you already wrote. These never go online; Claude keeps them out of GitHub.

STEP 2

Paste to Claude Code

**The starter prompt.** Open the Claude app → **Code** → start a new session on the `archi-design-os` folder and name it `MAIN`. Drag the **AI Blueprint PDF** and this **Starter Guide PDF** into the message box, paste the box below, and send.

Paste · The starter prompt (MAIN session)

You are setting up the Archi Design OS for Archi Design, a seven-person architecture and interior design practice: designers in the office, site engineers on site. I am Mahesh R. Khandagale, the owner, and I am not a programmer. Attached, and saved in docs/, are my AI Systems Blueprint and my Starter Guide; pages R1, R2 and R3 of the Starter Guide are written for you. This folder is already connected to my private GitHub repository, my Vercel project and my Supabase keys in .env.local. This session is the **MAIN session**. Work in five stages. After each stage, tell me in simple words what you did, then **stop and wait for my OK**. Ask me one question at a time.

**Stage 1: Read and check.** Read the blueprint and the Starter Guide. Tell me in ten lines or fewer: what Archi Design is, my three problems, the foundation and eight systems, and the build order. List what the blueprint says I still have to settle; do not settle it yourself. Then check quietly that GitHub, Vercel and the Supabase keys work, and tell me only if something needs fixing.

**Stage 2: The rules.** Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Make sure .gitignore keeps out .env.local and docs/samples. Read the rules back to me in five lines.

**Stage 3: The foundation.** Build F-00 Archi Design Project and Task Record as R3 describes: the tables, sign-in and Row Level Security. Tell me exactly what to paste into the Supabase SQL Editor and where to click, and what to set in Supabase so sign-in works on my live address. Add my owner login, push, and confirm I can sign in on my phone at the live address.

**Stage 4: My list for today.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first, and tell me the first action for each. Start every future session by reminding me of anything not ticked.

**Stage 5: Plan the sessions.** Write docs/SESSIONS.md: the build order, which systems are built side by side in separate sessions (R3), and each one’s branch name. Write one docs/build-sheets/ file for each P1 system (SYS-01 SOP Skills, SYS-02 Daily Task Sheet): what it does, what it must never do (from the blueprint), the data it needs and its done-when. No feature code yet. Finish by telling me to choose the look with the UI Guide (Step 3 of the Starter Guide) and then open the Continue Building Guide (Step 4).

If Claude asks you to paste something into Supabase

Open your Supabase project, check the browser address contains your project’s name or code that Claude names, click **SQL Editor → New query**, paste, press **Run**, and check the bottom says **Success**. If you see red text, copy it to Claude.

STEP 3

You do this

**Choose the look, with the UI Guide**

Before the first real screen is built, follow sections 01 and 02 of the **UI Guide**: ten minutes on Pinterest, one chat in the Claude app to choose, and one message to MAIN to hand the look over. The same guide is what you check every new screen against later. Your site engineers will use these screens on a basic Android phone in sunlight; that is why the look is chosen before the build, not after.

STEP 4

You do this

**Now open the Continue Building Guide**

This Starter Guide is used once. From here on, the **Continue Building Guide** is the one you use: at the start of every sitting, to start each system, and to run several sessions at once. Put its PDF into `docs/` when all of this is true:

- You can sign in to the OS on your phone at your `.vercel.app` address.
- `CLAUDE.md` holds your rules, and the foundation tables show in Supabase’s **Table Editor**.
- `docs/START-NOW.md`, `docs/SESSIONS.md` and the two P1 build sheets are written, and you have read and corrected them.
- `docs/design/` holds your chosen look.

Then open its section 02, **Every sitting**, and follow it. If a box is not ticked, paste it into MAIN and say *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by Claude Code in Stage 4

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

| \#  | Item                                                                                                                                                                                   | Owner                  | Needed for             |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|------------------------|
| 1   | **Confirm the figures:** 8 leads, 3 quotes and 2 orders a month, against “4 out of 100 quotes”; which is right.                                                                        | Mahesh                 | Day 1                  |
| 2   | **The three guardrails, in your own words:** what the system may do alone, what waits for your signature, what is never automated. Until then the careful defaults in R2 apply.        | Mahesh                 | Day 1                  |
| 3   | **Your 7 people:** name, role (designer, site engineer, office), mobile, whether anyone manages anyone. And your hours a week for the build.                                           | Mahesh                 | F-00, SYS-02           |
| 4   | **Your deadline, busy season, and what “worth it” looks like**, so the last phase’s finish line is yours.                                                                              | Mahesh                 | Planning               |
| 5   | **The SOP sittings, weeks 1 to 2:** the workflow for concept, working drawings, site marking, execution and handover, with a definition of done for each task type.                    | Mahesh with build team | SYS-01, SYS-02         |
| 6   | **Your live projects:** client, site, current stage, committed handover date, designer and site engineer on each.                                                                      | Mahesh                 | F-00                   |
| 7   | **The first live Monday:** the date from which tasks stop being given by voice or WhatsApp.                                                                                            | Mahesh                 | SYS-02                 |
| 8   | **Phones:** which of the 7 have Android phones that can open a web app, and who needs help adding it to the home screen.                                                               | Mahesh                 | SYS-02                 |
| 9   | **Drawing rules:** your file naming pattern, the sheet list per drawing set, and the rule that only approved drawings go to site.                                                      | Mahesh with designers  | SYS-04                 |
| 10  | **Contractors and vendors list:** name, trade, phone.                                                                                                                                  | Site engineers         | SYS-03                 |
| 11  | **Your colour and grace rules:** when a task or project turns RED, AMBER or GREEN; how long a grace period each task type gets; what counts as a miss on the scorecard. Before week 8. | Mahesh                 | SYS-05, SYS-06, SYS-08 |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by Claude Code in Stage 2

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones Archi Design will ever have; every system is a new section of the same app reading the same projects, people and logins. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; the owner sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING LEAVES THE OFFICE: no message about dates, extra work or cost goes to a client, contractor or vendor without Mahesh approving it; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local and in Vercel’s settings, never in code, in chat or on GitHub. 6 · NUMBERS ARE CALCULATED, NEVER GUESSED: deadlines, counts and scores come from exact tested rules; AI reads, drafts, checks and reminds, and never invents a figure. If anything you propose bends a rule, say so out loud and wait for my decision.

**Archi Design rules.** Until Mahesh writes his own three guardrails, these careful defaults apply. The AI may act alone only to: remind a team member of their own task and the proof required; check a drawing’s version name and sheet list against the SOP; compile summaries, patterns and scorecards for the owner only. A person signs off: pricing and negotiation; every drawing before it is stamped Approved for Execution; every message to a client, contractor or vendor about dates, extra work or cost; every monthly scorecard before any incentive, deduction or appraisal figure is shown. Never automated: every quote, every price, every discount and every committed date; design judgement and what a client is advised; hiring, appraisal outcomes and consequences for repeated mistakes. A task is marked done only with proof (file link, site photo or note, as the SOP defines); not done only with a reason from the short list. The system never shortens or extends a deadline, and never changes a task, owner or deadline on its own. No staff screen shows any money figure. Nandini and every agent report to Mahesh only and are a follow-up desk, not a judge. The figures in the blueprint’s numbers panel are unconfirmed: never hard-code them. Customer, site and drawing files in docs/samples never go to GitHub. Build in the blueprint’s order; a system starts only when Mahesh approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Mahesh can skip this page

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for photos and drawings) through `@supabase/ssr` and `@supabase/supabase-js`, deployed on Vercel from `main`; branches get Vercel preview deployments. Scheduled jobs (the 9 AM and 6 PM rounds, deadline checks) run as Vercel Cron jobs calling protected routes. The app is a mobile-first web app that can be added to the home screen; the Site Diary must save entries offline and sync when the phone finds network. Notifications start inside the app (and email for the owner); WhatsApp sending is added later only with Mahesh’s yes and cost. Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, later `CRON_SECRET` and `ANTHROPIC_API_KEY`. Commit `.env.example` with names only.

### F-00 Project and Task Record: the starting shape

**profiles** (name, role owner / designer / site_engineer / office, mobile, active); **projects** (client name, site, current stage, committed handover date, lead designer, site engineer, status); **stages** (concept, working drawings, site marking, execution, handover, in Mahesh’s wording); **task_types** (name, stage, definition of done, proof type file / photo / note, grace period, needs review); **tasks** (project, stage, task type, owner, deadline, depends_on, status open / done / not_done, proof link or photo or note, reason from the short list: waiting on client, waiting on drawing, material not on site, other); **sop_items** (role, stage, checklist line); **settings** (automation switch off by default); **audit_log** (append only). Row Level Security: Mahesh sees everything; each person sees their own tasks and the projects they are on. Later systems add drawings, site_reports, scorecards in their own migrations.

### Sessions: several Claude Code sessions at once

- **One MAIN session** owns `main`, CLAUDE.md, docs/SESSIONS.md and the database; it applies migrations in order and merges finished work.
- **One builder session per system**, at most three at a time, each in its own git worktree on its own branch `sys-0N-short-name`, touching only its own folders (`app/(sys-0N)/`, `lib/sys-0N/`). New tables or columns only in a new migration file `supabase/migrations/<timestamp>_sys0N_<what>.sql`, adding, never dropping or renaming.
- Shared files (sign-in, menu, CLAUDE.md, shared types) change only in MAIN; a builder that needs one writes the request in `docs/requests/`. A finished phase gets a handover note in `docs/handovers/`.
- The writing lane (SYS-01 SOP Skills) writes only in `docs/` and `content/` and can run from day 1.
- Every screen follows `docs/design/` and the UI Guide; plan first, wait for Mahesh’s OK, one step at a time in simple words; close each sitting with a dated note in `docs/sessions/`.

Prepared for Mahesh R. Khandagale · Archi Design · traces to blueprint BOA-2026-ARC-01 Rev A (blueprint audit 11.11.2026).  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
