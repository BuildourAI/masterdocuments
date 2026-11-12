Buildour AI · GREATISHStarter Guide · Rev A

# GREATISH OS STARTER GUIDE

Prepared for **Ajay Kumar**, GREATISH PVT LTD. Your accounts are connected. Now **upload two files, paste one prompt, choose the look**, and Claude Code lays the foundation of the GREATISH OS.

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

You wrote: *“मुझे ऐसी व्यवस्था चाहिए जिसमें कोई भी महत्वपूर्ण काम केवल मौखिक निर्देशों या किसी कर्मचारी की व्यक्तिगत याददाश्त पर निर्भर न रहे।”* Your blueprint answers with one shared record and eight systems on three spines: field sales, the plant, and accountability. The first one is the **GREATISH Beat App**: every field executive has his own login, checks in by GPS inside duty hours, books orders against the approved price list and enters collections with a receipt photo. Every later report is built on those records, not on what anyone writes.

No coding knowledge is needed. Claude Code writes every line. Your job: answer its questions in your own words, say OK when you agree, and check what it built against people and products you know. If you do not understand something, type `explain this to me in simple words`. If something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. You can write to Claude in Hindi or English.

What it costs

Claude Max (about \$100 a month) builds everything. GitHub is free. Vercel Pro is about \$20 a month for a business app. Supabase is free to start; move to Pro (about \$25 a month) before the field team goes live, because GPS check-ins, shop photos and receipt photos fill it quickly and Pro adds daily backups. Later: the Plant Auditor, Sales Auditor and Duty Officer run on the Claude API, and Tally Prime needs a small connector on your office computer. Claude Code always tells you a cost and waits for your yes before adding anything.

STEP 1

You do this

**Put the files in your project folder**

1.  Open the folder Romana set up with you: `Documents\greatish-os`. Make a folder inside it called `docs`.
2.  Put in `docs`: the **AI Blueprint PDF** and this **Starter Guide PDF**. Keep the Continue Building Guide aside until Step 4.
3.  Inside `docs`, make a folder `samples` and put in what you have: the approved price list, the list of sales executives and their territories, one sample of each report your team sends today, your company and warehouse list. **Never put chemical formulations in this folder**; Claude will ask for them separately, into a locked place.

STEP 2

Paste to Claude Code

**The starter prompt.** Open the Claude app → **Code** → start a new session on the `greatish-os` folder and name it `MAIN`. Drag the **AI Blueprint PDF** and this **Starter Guide PDF** into the message box, paste the box below, and send.

Paste · The starter prompt (MAIN session)

You are setting up the GREATISH OS for GREATISH PVT LTD, which manufactures and sells construction chemicals, waterproofing chemicals, industrial chemicals and machinery through field sales executives and dealers. I am Ajay Kumar, the owner, and I am not a programmer. Attached, and saved in docs/, are my AI Systems Blueprint and my Starter Guide; pages R1, R2 and R3 of the Starter Guide are written for you. This folder is already connected to my private GitHub repository, my Vercel project and my Supabase keys in .env.local. This session is the **MAIN session**. Work in five stages. After each stage, tell me in simple words what you did, then **stop and wait for my OK**. Ask me one question at a time.

**Stage 1: Read and check.** Read the blueprint and the Starter Guide. Tell me in ten lines or fewer: what GREATISH is, my three problems, the foundation and eight systems, and the build order. My numbers sheet was left blank: list every figure the blueprint says I still have to give, and do not guess any. Then check quietly that GitHub, Vercel and the Supabase keys work, and tell me only if something needs fixing.

**Stage 2: The rules.** Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Make sure .gitignore keeps out .env.local and docs/samples. Read the rules back to me in five lines.

**Stage 3: The foundation.** Build F-00 GREATISH Shared Record as R3 describes: companies, warehouses, users and roles, the approval matrix, sign-in, Row Level Security and the audit log. Ask me for the approval matrix (who signs what, and the limits for discount, credit, expense and stock adjustment) one line at a time. Tell me exactly what to paste into the Supabase SQL Editor and where to click, and what to set in Supabase so sign-in works on my live address. Add my owner login, push, and confirm I can sign in on my phone.

**Stage 4: My list for today.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first, and tell me the first action for each. Start every future session by reminding me of anything not ticked.

**Stage 5: Plan the sessions.** Write docs/SESSIONS.md: the build order, which systems are built side by side in separate sessions (R3), and each one’s branch name. Write docs/build-sheets/sys-01.md for the Beat App and Field Day Skill: what it does, what it must never do (from the blueprint), the data it needs and its done-when. No feature code yet. Finish by telling me to choose the look (Step 3 of the Starter Guide) and then open the Continue Building Guide (Step 4).

When Claude asks you to paste something into Supabase

Open your Supabase project and check the browser address shows the project code Claude names. Click **SQL Editor → New query**, paste, press **Run**, and check the bottom says **Success**. If you see red text, copy it to Claude.

03

STEP 3 · CHOOSE THE LOOK

The UI section · once, before the first screen

Claude builds what you say, but it designs what you show it. Show it nothing and your team gets the average of every app on the internet: crowded, generic, and ignored. Fifty field executives will open this app on a phone, in a shop, in the sun, between two visits. If it takes more than a few seconds, they go back to WhatsApp, and every report after it is empty.

3.1

You do this

**Collect.** On **pinterest.com** search `minimalist UI design web app` and `field sales app mobile clean`. Download 10 to 15 screens your executives and store keeper would understand at a glance. Skip anything crowded, dark or clever.

3.2

You do this

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: GREATISH PVT LTD, a manufacturer of construction chemicals, waterproofing chemicals, industrial chemicals and machinery. The screens are used by field sales executives on Android phones from shop to shop, by the store keeper on a phone at the plant gate, by the production, purchase and accounts teams on office computers, and by me on my phone for approvals and one daily view of the whole company. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

3.3

You do this

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Download the .md file and save it with the images in `docs/design/`. If the direction comes back too narrow (“a sales app”), correct it: *“This is the whole GREATISH company: field sales, plant, stores, purchase, accounts, HR and tasks.”*

3.4

Paste to MAIN

**Hand it over.**

Paste · MAIN · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03 of the Starter Guide, and build one sample screen, a field executive’s home screen with today’s beat plan, using dummy data, so I can see the look on my phone before any system is built. Wait for my OK.

### Your main screens, one question each

| System                     | Screen and its one question                                                          | One main button  | Who, on what         |
|----------------------------|--------------------------------------------------------------------------------------|------------------|----------------------|
| SYS-01 Beat App            | **My day:** “which shops today, and what is my target?”                              | Check in         | Executive, Android   |
| SYS-01 Beat App            | **At the shop:** “what did I see, sell and collect here?”                            | Save visit       | Executive, Android   |
| SYS-02 Sales Command Board | **The team:** “who is working, and where do claims not match records?”               | Open a flag      | You, sales head      |
| SYS-03 Store Gate          | **At the gate:** “what is coming in or going out, against which PO, batch or order?” | Record movement  | Store keeper, phone  |
| SYS-04 Task Desk           | **My work:** “what is due today, and what proof closes it?”                          | Close with proof | Every employee       |
| SYS-04 Pending Work Board  | **The company:** “what is pending in each department, and what waits for me?”        | Approve          | You, phone           |
| SYS-06 Plant Board         | **The plant:** “what was made, at what real cost, and what is low?”                  | Open a batch     | You, production head |
| Approval queue             | **Waiting for me:** “which rate, credit, purchase or expense needs my yes?”          | Approve / reject | You, phone           |

### GREATISH screen rules

- **Field-proof first.** Executive and store screens work one-handed on a basic Android phone in sunlight: big buttons, high contrast, large text.
- **Photo and GPS before typing.** A check-in, a shop board photo, a receipt photo: one tap each. The end-of-day report is drafted from the check-ins, so the executive confirms rather than types.
- **Works with weak network.** Visits and gate entries save on the phone and send when signal returns, and say so (“saved, will send”).
- **Hindi or English, per person.** Every label can show in the language each user chooses.
- **The price list decides.** The order screen shows only approved rates; any other rate or credit becomes a request with a clear “waiting for approval” badge.
- **Claimed is not verified.** Visits, orders and collections show as claimed until matched to GPS, an invoice or the bank, and the screen says which.
- **Exceptions first for you.** Your screens open on what is red, what waits for your signature, and what does not match. Red and green mean late and on track, nothing else.
- **No formula on any screen** except for you and the production head; no salary or incentive figure to any employee before you sign.

| The five screen laws                 | Check every screen Claude shows you                                                          |
|--------------------------------------|----------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.        |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.               |
| **3 · Consistency is trust**         | The same thing looks the same on every screen: a shop, an order, a batch, a red flag.        |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: date, territory, company, warehouse. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a message.                                |

**THE TWO-MINUTE RULE:** a new executive opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the employee. The real test: hand the phone to one executive and watch, without helping.

STEP 4

You do this

**Now open the Continue Building Guide**

This Starter Guide is used once; keep section 03 open whenever a new screen is shown to you. From here on, the **Continue Building Guide** is the one you use: at the start of every sitting, to start each system, and to run several sessions at once. Put its PDF into `docs/` when all of this is true:

- You can sign in to the OS on your phone at your `.vercel.app` address.
- `CLAUDE.md` holds your rules; the foundation tables and your approval matrix show in Supabase’s **Table Editor**.
- `docs/START-NOW.md`, `docs/SESSIONS.md` and the SYS-01 build sheet are written, and you have read and corrected them.
- `docs/design/` holds your chosen look, and the sample screen looks right on your phone.

Then open its section 02, **Every sitting**, and follow it. If a box is not ticked, paste it into MAIN and say *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by Claude Code in Stage 4

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

| \#  | Item                                                                                                                                                                      | Owner                     | Needed for     |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|----------------|
| 1   | **The eight blank numbers:** leads, quotes, conversion, orders, average order value, sales cycle, repeat customers and headcount; plus the money path and the people map. | Ajay                      | Day 1          |
| 2   | **The approval matrix:** who signs what, and the limits for discount, credit, expense and stock adjustment.                                                               | Ajay with the build team  | F-00           |
| 3   | **Companies and warehouses** GREATISH runs today, and which to build for first.                                                                                           | Ajay                      | F-00           |
| 4   | **Sales executives:** names, mobiles, territories, dealer and shop pins, authorised field duty hours; the approved price list and customer credit limits.                 | Sales head                | SYS-01         |
| 5   | **Field rules:** what counts as a real shop visit, the fixed list of visit outcomes, targets per executive.                                                               | Ajay with sales head      | SYS-01, SYS-02 |
| 6   | **Product list** with BOM per pack size, standard consumption norms, QC parameters and reorder levels. Formulations stay locked and are not shared.                       | Ajay / production head    | SYS-03, SYS-06 |
| 7   | **Store and purchase:** who keeps the store gate, open purchase orders, approved suppliers per material, batch numbering rule.                                            | Production head, purchase | SYS-03, SYS-07 |
| 8   | **Department SOPs** in the five-line form: who does it, when, who approves, how long it should take, who is told if it is not done.                                       | Department heads          | SYS-04, SYS-05 |
| 9   | **Software list:** what is paid today, what is used, what you want to stop paying for.                                                                                    | Ajay                      | Stack note     |
| 10  | **Tally Prime:** which edition, on which office computer, who has admin access, one company per Tally company file.                                                       | Accounts                  | SYS-07         |
| 11  | **Your weekly 1 to 2 hour approval slot**, and the calendar kept free in July, September and December.                                                                    | Build team                | Planning       |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by Claude Code in Stage 2

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones GREATISH will ever have; every system is a new section of the same app, multi-company and multi-warehouse, so a new unit or company joins without a rebuild. 2 · EVERY PERSON THEIR OWN KEY: every user has their own login and sees only what their role needs; Ajay sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING LEAVES OR MOVES MONEY: no purchase order, quotation rate, credit, discount, payment, stock correction or Tally entry goes out or posts without the approver named in the approval matrix; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action is written to a log that can only be added to; deleting or altering audit records is never possible. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local and in Vercel’s settings, never in code, in chat or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: rates, totals, costs, stock and incentives come from exact tested rules; AI reads, drafts, matches and alerts, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**GREATISH rules, set by Ajay.** AI may act alone to: make daily reports; monitor employee attendance and productivity; track sales targets and identify pending work; send routine reminders to customers; route new enquiries to the right employee and allocate leads by set rules; draft quotations, business documents and HR documents from approved formats; monitor stock; reconcile records across departments and alert on errors or mismatches; check authorised data, match employee reports to real records, and suggest to management. A person signs off: pricing and negotiation; all large financial transactions and bank transfers; supplier payments, large purchases and raw material purchase; new credit limits, discounts beyond the set limit, special permission to sell on credit; large stock changes; hiring or dismissal, salary changes, large incentive changes; legal agreements, government returns and key compliance; changes to product formulae and large business contracts. Never automated: bank payments without permission; taking large financial obligations on the company’s behalf; final decisions on large investments; hiring or dismissing employees without human check; final certification of legal and government documents; unauthorised changes to confidential chemical formulae; deleting or altering audit records; sharing confidential company information.

**How these become code.** GPS is recorded only inside each executive’s authorised field duty hours. Orders are locked to the approved price list; any other rate or credit beyond limit is saved as a request and goes nowhere until approved. Collections stay “claimed” until accounts matches them with the bank. No flow, auditor or agent ever names an employee at fault on inference: mismatches go to a person with the evidence. Formulations are readable only by Ajay and the production head, are never written to docs/, samples, GitHub or a prompt, and no system can change them. Every record carries its company, warehouse, user and time. The blueprint’s numbers were left blank: never invent or hard-code a figure. Build in the blueprint’s order; a system starts only when Ajay approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Ajay can skip this page

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for photos) through `@supabase/ssr` and `@supabase/supabase-js`, deployed on Vercel from `main`; branches get Vercel preview deployments. Mobile-first web app added to the home screen; the Beat App and Store Gate save offline and sync. GPS through the phone browser’s location permission, only inside duty hours; maps with a free map library, no paid maps API unless Ajay agrees. Scheduled jobs (7 PM field verify, nightly auditor runs, morning notes) as Vercel Cron calling protected routes. Notifications inside the app first; WhatsApp only later with Ajay’s yes. Tally Prime (SYS-07) through Tally’s own XML interface on the office computer via a small connector, chosen with Ajay in phase 4. Agents (Duty Officer, auditors) on the Claude API, cost shown first. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, later `CRON_SECRET`, `ANTHROPIC_API_KEY`; `.env.example` with names only.

### F-00 Shared Record: the starting shape

**companies**; **warehouses** (company); **profiles** (name, mobile, company, role owner / sales_head / executive / production_head / store_keeper / purchase / accounts / hr / manager / staff, language, duty hours, active); **approval_matrix** (action, company, limit, approver role or person); **territories**; **customers** (dealer or shop, pin latitude and longitude, territory, credit limit, company); **products** (name, pack sizes, category: chemical or machinery; no formula); **price_list** (product, pack, rate, valid from, company); **approvals** (request, requested by, approver, status, decided at); **settings** (automation switch off by default); **audit_log** (append only, no update or delete for anyone). Formulations, when needed, go in a separate table readable only by owner and production_head. Row Level Security: Ajay sees all; each role sees its own company, department and records; executives see only their own territory. Later systems add visits, orders, collections, stock movements, batches, tasks in their own migrations.

### Sessions

- **MAIN** owns `main`, CLAUDE.md, docs/SESSIONS.md and the database; it applies migrations in order and merges finished work.
- **One builder session per system**, at most three at a time, each in its own git worktree on branch `sys-0N-short-name`, touching only `app/(sys-0N)/` and `lib/sys-0N/`; new tables only in a new migration `<timestamp>_sys0N_<what>.sql`, adding, never dropping or renaming. Shared files change only in MAIN; requests go in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing lane** for the skills (Field Day, Batch Record formats, HR Letter and SOP): only `docs/` and `content/`, never formulations.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Ajay Kumar · GREATISH PVT LTD · traces to blueprint BOA-2026-GRE-01 Rev A (blueprint audit 10.11.2026).  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
