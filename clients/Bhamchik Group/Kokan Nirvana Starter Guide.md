Buildour AI · Kokan NirvanaStarter Guide · Rev A

# KOKAN NIRVANA OS STARTER GUIDE

Prepared for **Shubham Manjunath Anvekar**, Bhamchik Group. Day 1, done live with **Romana**: from a Claude Max account to **your own Real Estate OS online**, ready to build system by system.

Install–– GitHub +  
repo–– Supabase–– Starter  
prompt–– Vercel,  
live–– Choose  
the look–– Continue  
building

[TABLE]

Two voices on every step: YOU DO THIS (a click in a browser or on your computer) · PASTE TO CLAUDE CODE (copy the whole box)

00

READ THIS FIRST

Five minutes, before any click

You told us exactly what you want: one system for the whole Kokan Nirvana sales process, a tutorial for every property, and no more calling, messaging and sending receipts by hand. Your blueprint turns that into one foundation and eight systems. You will not build them all at once, and you will not build them one long system after another either: with Claude Max you can run **several Claude Code sessions side by side, one per system**, the way a site has one engineer per building.

You need no coding knowledge

Claude Code writes every line. Your job is three things only: open the accounts in your name, tell Claude your business rules in your own words, and check what it built against leads and units you know. When you do not understand something, type: `explain this to me in simple words`. When something breaks, paste the error or a screenshot and type: `explain this in simple words and fix it`.

Words you will see

**Repository (repo):** the private folder on GitHub where your code is kept, with every past version. **Session:** one Claude Code chat working on your project; you can have several open. **Deploy:** putting the latest version online. **Keys:** passwords that let your app talk to your database; they never go in a chat. **Branch:** a separate copy of the code where one session works without disturbing the others.

**Cost on day 1:** Claude Max (you buy this), GitHub free, Supabase free, Vercel Pro about \$20 a month for a business app. Everything else, and when it starts, is in the **Systems, Costs and Automation Guide**.

STEP 1

You do this

**Claude Max, and three installs on your laptop**

1.  **Claude Max.** On claude.ai, sign in with the business email, open **Settings → Billing** (or **Upgrade**) and choose **Max**. Start with **Max 5x** (about \$100 a month); move to **Max 20x** (about \$200) only if running three sessions at once keeps hitting the limit.
2.  **The Claude desktop app** from claude.com/download. Install it and sign in with the same account. **Claude Code** is its **Code** tab.
3.  **Node.js**: go to nodejs.org, download the **LTS** version, install, accept every default.
4.  **Git**: go to git-scm.com, download for your computer, install, accept every default. (On a Mac it may offer to install itself the first time it is needed; say yes.)

If any install gives trouble, carry on. In Step 5 Claude checks all of them and tells you exactly what to click.

STEP 2

You do this

**GitHub: your account and your private repository**

1.  Go to **github.com** and press **Sign up**. Use the business email, choose a password and a username (for example `bhamchik`), and choose the **Free** plan.
2.  Turn on two-step login: click your photo (top right) → **Settings** → **Password and authentication** → **Enable two-factor authentication**, and follow the steps with an authenticator app on your phone. Save the recovery codes somewhere safe.
3.  Make the repository: press the **+** at the top right → **New repository**.
    - **Repository name:** `kokan-nirvana-os`
    - Choose **Private**. This matters: your code stays visible only to you.
    - Leave **Add a README**, **.gitignore** and **license** all off. The repository must start empty.
    - Press **Create repository**.
4.  Copy the web address of the page you land on. It looks like `https://github.com/bhamchik/kokan-nirvana-os`. You will give it to Claude in Step 5.

STEP 3

You do this

**Supabase: your database**

1.  Go to **supabase.com**, press **Start your project**, then **Continue with GitHub**, and allow it.
2.  If it asks for an organization, name it `Bhamchik Group` and pick the **Free** plan.
3.  Press **New project**. Name: `kokan-nirvana`. Database password: press **Generate a password**, then copy it and save it somewhere safe (not in WhatsApp). Region: **South Asia (Mumbai)**. Press **Create new project** and wait two minutes.
4.  Open **Project Settings** (the gear at the bottom left) → **API Keys**, and keep this tab open. Claude will ask for three things one by one: the **Project URL** (looks like `https://abcd.supabase.co`), the **publishable key** (starts `sb_publishable_`) and the **secret key** (starts `sb_secret_`; press **Reveal**, or create one if none is listed). If your screen shows the older names, use **anon** for the publishable key and **service_role** for the secret key.

Treat the secret key like your bank password. It goes only into the place Claude names on your own computer, and into Vercel in Step 6.

STEP 4

You do this

**Vercel account, and your project folder**

1.  Go to **vercel.com**, press **Sign Up**, choose **Continue with GitHub**, and allow it. When it asks for a plan, choose **Pro**: the free plan is for personal, non-commercial use only.
2.  On your laptop, make one folder for life: `Documents\kokan-nirvana-os`. Every Kokan Nirvana system goes in here, never in a second folder.
3.  Inside it, make a folder called `docs`. Put in it: the **Blueprint Rev B PDF**, this **Starter Guide PDF**, and the **Systems, Costs and Automation Guide PDF**. Keep the Continue Building Guide aside until Step 9.
4.  Inside `docs`, make a folder called `samples`, and put in whatever you have now: the CRM export, one real receipt you sent, one brochure. Anything missing goes on your START-NOW list in Step 5.

**STOP HERE.** Steps 5 to 9 happen on the live call with Romana, on your screen.

STEP 5

Paste to Claude Code

**The starter prompt.** Open the Claude desktop app, go to the **Code** tab, start a new session and choose the folder `kokan-nirvana-os`. Attach **two files** to the message, the **Blueprint Rev B PDF** and this **Starter Guide PDF** (drag them into the chat box), then paste the whole box below. Replace the GitHub address in brackets with yours from Step 2.

Paste · The starter prompt (Main session)

You are setting up the Kokan Nirvana OS, the real estate operating system for Kokan Nirvana Seashore property, the second-home brand of Bhamchik Group. I am Shubham Anvekar, the owner. I am not a programmer. Attached, and saved in docs/, are my AI Systems Blueprint Rev B and my Starter Guide. Read the Starter Guide first: its pages R1, R2 and R3 are written for you. This session is the **Main session**: it sets up the project, owns the database changes and later joins the other sessions’ work together. Work in six stages, in order. At the end of each stage, tell me in simple words what you did, then **stop and wait for my OK**. Ask me one question at a time whenever you need something only I have.

**Stage 1: Read.** Read the blueprint in full and the Starter Guide. Tell me in ten lines or fewer: what Kokan Nirvana is, my main pains, the foundation and the eight systems, and the order we build them. List the points the blueprint says I still have to settle. Do not settle any yourself.

**Stage 2: Set up.** (1) Check that Node.js and Git work; if not, tell me exactly what to download and click. (2) Create a Next.js app with TypeScript and Tailwind in this folder, and show me the local address to open. (3) Set up Git and make the first commit. The .gitignore must keep out .env.local, docs/samples and any export with customer phone numbers. (4) Connect this folder to my private GitHub repository at \[paste your GitHub address here\] and push. Walk me through any GitHub sign-in in the browser, step by step. (5) Create .env.local and ask me one at a time for my Supabase Project URL, publishable key and secret key; use the variable names in R3. Never repeat a key back to me, never write keys in any other file, never commit them. (6) Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the session rules in R3. Read them back to me in five lines.

**Stage 3: The foundation.** Build F-00 Kokan Nirvana Single Record as R3 describes: the core tables, sign-in, and Row Level Security. Write it as a migration file and give me exactly what to paste into the Supabase SQL Editor and where to click. Then add my owner login and confirm I can sign in on the local address.

**Stage 4: Start the clocks.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. For each, tell me the exact first action to take today. Start every future session by reading it and reminding me of anything not ticked.

**Stage 5: Go live.** Tell me the exact environment variable names for Vercel, then wait while I do Step 6 of the guide. When I give you the live address, confirm the app opens and tell me what to set in Supabase so sign-in works there.

**Stage 6: Plan the sessions.** Write docs/SESSIONS.md: the build order from the blueprint, which systems are built side by side in separate sessions (R3), and the branch name for each. Write one docs/build-sheets/ file per system for P1 (SYS-01, SYS-02, SYS-03), each listing what the system does, what it must never do (copied from the blueprint), the data it needs and its done-when. Write no feature code for them yet. Finish by telling me to choose the look (Step 7) and to switch to the Continue Building Guide.

STEP 6

You do this

**Put it online with Vercel** *(when Claude reaches Stage 5)*

1.  On vercel.com press **Add New… → Project**. Find `kokan-nirvana-os` and press **Import**. If it is not in the list, press **Adjust GitHub App Permissions**, choose **Only select repositories**, pick `kokan-nirvana-os`, save, and come back.
2.  Leave the framework as **Next.js** and the build settings exactly as Vercel fills them in.
3.  Open **Environment Variables** and add the three names Claude gave you, with the same three values from Supabase. Leave all environments ticked.
4.  Press **Deploy**. About two minutes later you see a picture of your app. Press it: your address ends in `.vercel.app`. Copy it and give it to Claude.
5.  In Supabase: **Authentication → URL Configuration**. Set **Site URL** to your `.vercel.app` address; under **Redirect URLs** add the same address followed by `/**`. Press **Save**.
6.  Open the address on your phone, sign in, and choose **Add to Home Screen**.

From now on, everything saved to the **main** branch goes live by itself in about two minutes. Work on other branches gets its own test address, so you can check it on your phone before it goes live.

STEP 7

You do this

**Choose the look, before the first real screen**

Claude builds what you say, but it designs what you show it. Show it nothing and your team gets the average of every app on the internet. Ten minutes now decides whether your staff open the OS or keep calling you.

1.  **Collect.** On pinterest.com search `minimalist UI design web app` and also `real estate CRM dashboard minimal`. Download 10 to 15 screens your staff would understand at a glance. Skip anything crowded, dark or clever.
2.  **Let the strongest model choose.** Open a new chat in the **Claude app** (Chat, not Code), choose the strongest model in the model list, attach every screenshot and paste the chooser prompt below.
3.  **Get the direction in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Download the .md file.
4.  **Hand it over.** Save the images and the .md file in `docs/design/`, then tell the Main session: *“The design direction is in docs/design. Add a line to CLAUDE.md saying every screen in every session follows it.”*

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: Kokan Nirvana Seashore property, a second-home real estate brand in the Konkan, part of Bhamchik Group. The screens are used by my sales staff on their phones in the office and at site visits, by my sales manager on a laptop, and by me on my phone to approve prices, see leads, visits and money, and check on my 15 people. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

**IF THE DIRECTION COMES BACK TOO NARROW** (“a CRM dashboard”), correct it in one line: *“This is not only a CRM. It is the operating system of Kokan Nirvana: leads, visits, tutorials, receipts, money and the team, everything.”*

| The five screen laws                 | Check every screen Claude shows you against these                                                     |
|--------------------------------------|-------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.                 |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                        |
| **3 · Consistency is trust**         | The same thing looks the same on every screen.                                                        |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the property, the staff member. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a message.                                         |

STEP 8

You do this

**Learn the session buttons** *(two minutes, with Romana)*

1.  In the Claude app’s **Code** tab you can start a **new session** on the same folder while another is still working. Each session shows in the list on the left; click one to switch to it.
2.  Name each session after its job so you never mix them up: `MAIN`, `SYS-01 Lead flow`, `SYS-02 Tutorials`, `SYS-03 Sales script`.
3.  When Claude asks permission to run something, read the one line it shows. If you do not understand it, type `what will this do, in simple words?` before saying yes.

How the sessions share the work without stepping on each other is explained in the Continue Building Guide. You do not need to understand it; each session’s prompt tells Claude what to do.

STEP 9

You do this

**Switch to the Continue Building Guide when all of this is true**

- The OS opens on your phone at its `.vercel.app` address, you can sign in, and it is on your home screen.
- The GitHub repository `kokan-nirvana-os` is **private**, and the three keys are only in `.env.local` and Vercel.
- `CLAUDE.md` holds the rules from R2 and R3.
- The foundation tables show in Supabase’s **Table Editor**.
- `docs/START-NOW.md` exists and every item has a named owner.
- `docs/SESSIONS.md` and the three P1 build sheets are written, and you have read and corrected them.
- `docs/design/` holds your chosen look.

**ALL SEVEN TICKED:** put the **Continue Building Guide PDF** into `docs/`, and from your next sitting follow it. If one is not ticked, paste it into the Main session and say *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by Claude Code in Stage 4

Things that wait on a person or on an outside company. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

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
| 10  | **An n8n account** (n8n.io, Cloud Starter), on the business email, when SYS-01 starts. The Continue Building Guide shows the clicks.                                                                                                                                                    | Shubham                    | SYS-01                 |
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
