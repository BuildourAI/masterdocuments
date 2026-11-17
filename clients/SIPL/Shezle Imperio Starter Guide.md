Buildour AI · Shezle ImperioStarter Guide · Rev A

# CONTROL CENTER STARTER GUIDE

Prepared for **Sangeet Sejpal**, Shezle Imperio Private Limited. Phase 1 is live. This guide sets up your **HQ session**: five prompts that make the app safe, seal the wall, give Claude your rules, fix the look and plan the Android and iOS apps. After that, **HQ writes the prompt for every new session**.

Files on  
GitHub–– HQ-1 to  
HQ-5–– Wall  
sealed–– HQ hands out  
prompts–– Continue  
building

[TABLE]

Two voices on every step: YOU DO THIS (a click) · PASTE TO CLAUDE CODE (copy the whole box)

00

READ THIS FIRST

Two minutes

You wrote: *“I can leave India and still all the work may be visible and handled from my phone anytime anywhere and coordinate through my team.”* Rev C of your blueprint sets a foundation and fifteen systems in eight phases: the sales and purchase cycle on the board by 21 December, money, documents and the Deal Clerk by 15 February 2027, and samples, logistics, the builder, the ledger, the org board and the second company by 15 November 2027. Control Center will run on the web, on Android and on iOS, from one code base.

**How your sessions work.** You build in **Claude Code on the web** (claude.ai/code, or the Code tab in the Claude app). One session, **HQ**, holds the whole picture: it owns `main` and the live database, merges finished work, and **writes the opening prompt for every other session**. You never write a builder prompt yourself: you ask HQ, copy what it gives you, and paste it into a new session. Each builder works on its own branch and hands its work back to HQ through a **pull request**.

If you do not understand something, type `explain this to me in simple words`. If something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. You do everything in this guide and the next one yourself, in your own time: no calls are needed. If you get stuck, ask HQ first. Claude never needs a password or secret key in the chat: where one is needed, it tells you exactly where to paste it yourself.

What it costs

Your Claude plan builds everything. GitHub is free. **Vercel Pro**, about \$20 a month: your project is on the free Hobby plan, which is for personal use. **Supabase Pro**, about \$25 a month, before staff log in: daily backups and leaked-password protection. A **domain** for the app (about ₹1,000 a year) or a sub-address of your company website, and a **mail service** for sign-in emails, usually free at your volume. For the phone apps: **Google Play** developer account, \$25 once; **Apple Developer Program**, \$99 a year; iPhone builds need a Mac in the cloud, a few dollars a month or a free tier. Later: a Claude API key for the Deal Clerk (P5) and, if you choose it, the WhatsApp Business API. Claude always shows a cost and waits for your yes.

STEP 1

You do this

**Put the files on GitHub and change your password**

1.  Open **github.com/enrosl/SIPL-Global-Business-OPS-ERP**. Check the branch button at the top left says `main`.
2.  Click **Add file → Upload files**. Drag in four PDFs: the **Blueprint Rev C**, this **Starter Guide**, the **Continue Building Guide** and the **Setup Health Check**. Write `Add Rev C and guides` in the message box and click **Commit changes**. HQ moves them into `docs/`.
3.  **Change your app password:** Supabase → project **SIPL Global Ops ERP** → **Authentication → Users** → the three dots on your user → **Send password recovery**, and set a new one from the email. The old one was shared in a chat.
4.  **Start the D-U-N-S number** for Shezle Imperio if you do not have one (free, at dnb.com). Apple and Google both ask for it to publish an app under the company’s name, and it can take one to two weeks.

STEP 2

Paste to Claude Code

**Open HQ and paste HQ-1.** Open **claude.ai/code** → **New session** → repository `enrosl/SIPL-Global-Business-OPS-ERP`, branch `main`. Rename the session `HQ`. Paste **HQ-1** and send. When HQ says a prompt is finished and you have said OK, paste the next one **into the same HQ session**: HQ-2, HQ-3, HQ-4, HQ-5. HQ is the session you come back to every sitting, for the next twelve months.

HQ-1 · One true copy

You are **HQ**, the headquarters session for Control Center, the operating system of Shezle Imperio Private Limited (SIPL), a B2B middleman trader in industrial chemicals, waxes, oils, scrap and offspec lots, where confidentiality is the whole business. I am Sangeet Sejpal, the owner, and I am not a programmer. Phase 1 is built and live: Vite, React, TypeScript and Tailwind on Supabase (project “SIPL Global Ops ERP”, Mumbai) and Vercel (team SIPL, project sipl-global-business-ops-erp). On main I uploaded four PDFs: my AI Systems Blueprint Rev C, the Starter Guide, the Continue Building Guide and the Setup Health Check of 17 November. Pages R1, R2 and R3 of the Starter Guide are written for you. You own main and the live database; you merge all work; you never build a system yourself; and you write the opening prompt for every other session. Work in steps; after each, tell me in simple words what you did and **wait for my OK**. Ask me one question at a time. Never print a key, password or secret value.

1.  **Read.** Read the blueprint, both guides and the health check. Tell me in ten lines: what Control Center is, the eight phases and their dates, and what is still to fix from the health check.
2.  **Bring the code to main.** The newest code is on claude/jolly-tesla-p97pro (the Phase 1 code plus four docs); production runs from claude/admiring-gates-rs7276. Compare them and tell me what differs. Then open a pull request that brings claude/jolly-tesla-p97pro into main, keeping my four PDFs, and tell me when to click Merge on GitHub (or merge it if you can). Leave claude/tender-lamport-1t3z8u untouched: it is the old Frappe design, kept only as a list of requirements.
3.  **Production from main.** Tell me exactly where to click in Vercel to make main the Production branch, then check that the next production deployment comes from main and is Ready, and that the live address still signs me in.
4.  **Tidy the documents.** Put the four PDFs in docs/. Move the older plans (the Rev B blueprints, the final plan, the handover briefs) into docs/archive/ with a one-line note that Blueprint Rev C supersedes them. Rev C wins wherever they disagree.

HQ-2 · Seal the wall (P1 seal, week 1)

Now seal Phase 1, as section 06 step 03 of the blueprint and the health check set out. Do each item as its own small change, show me the result, and wait for my OK before the next.

1.  **The eight audit defects.** Find the repository audit in docs/archive (the Control Center Blueprint Rev B and its audit). List the eight defects in simple words, most serious first. Fix them, starting with: a sales user must not be able to work out which market names are the same product; the accountant switch that opens both ends of a deal is removed; signing out clears all data from a shared phone. Each fix is a new migration or a small code change, tested as each of the seven roles.
2.  **Migrations match the database.** Read the versions the database recorded with the Supabase connector and rename the 6 migration files to match exactly, without changing their SQL, so nothing can ever run twice.
3.  **The 12 open functions.** For each SECURITY DEFINER function, tell me who should be allowed to call it. In one new migration, remove call rights from anyone who should not have them (rls_auto_enable from everyone; grant_access and team_members only where the function itself checks owner or admin). Re-run the Supabase security advisor and show me the warnings gone.
4.  **Automatic tests.** Add a GitHub Actions check that runs the type check, the build and the role-by-role database tests on every pull request, so no change reaches main untested. Add a second, test company and a test that proves one company can never read the other.
5.  **Sign-in settings.** Walk me through, one click at a time: Authentication → Sign In / Providers (“Confirm email” on); URL Configuration (Site URL and redirect URLs for the live address); where leaked-password protection is switched on, and whether it needs Supabase Pro.
6.  **Staff access and email.** Explain my two choices in simple words: Vercel Authentication now lets in only the Vercel team, and a custom domain (or a sub-address of my company website) lets staff in while keeping preview addresses private; a mail service, set as SMTP in Supabase, sends invites and sign-in emails. Give me options and costs. Do not buy or connect anything until I say yes, then tell me exactly where to paste each key myself.
7.  **Done when:** a sales test login cannot open a supplier or match two names to one product; the advisor is clean; the checks run on every pull request; the test company stays separate; and a staff test login can sign in at the staff address. Tell me when all five are true.

HQ-3 · The rules and the plan

1.  **CLAUDE.md.** Create or update CLAUDE.md so it holds page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Keep anything already in it that does not conflict, and show me what changed. Check that .gitignore keeps out .env.local, every secret, any signing key and docs/private.
2.  **My list.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, security items first. Start every future HQ sitting by reminding me of anything not ticked.
3.  **The plan.** Write docs/SESSIONS.md: all eight phases from the blueprint with dates, the systems in each, which are built side by side (section 05 of the Continue Building Guide), the apps lane, and the gates. Write docs/build-sheets/ for the P2 systems (SYS-01 Deal Wall Skill, SYS-02 Alias Checker full, SYS-03 stage 1 CRM): what each does, what it must never do, the tables it adds, its screens and its done-when, all from Rev C. Write docs/deal-wall/AGENDA.md: the questions for my two one-hour chats with the Deal Wall writing session, which I do on my own with Claude.
4.  **The first prompts you hand out.** Following the rules in R3 for prompts HQ writes, write the opening prompt for each P2 session (Builder A, Builder B and the Deal Wall writing session) into docs/session-prompts/, and show each one to me in its own box, ready to copy. No feature code yet.

HQ-4 · The look

Read section 03 of the Starter Guide and the screens already built. Write docs/design/LOOK.md describing the look exactly as it is in the app today: colours, type, spacing, cards, buttons, the status colours, the phone layout, and how screens adapt on Android and iPhone (safe areas, the back gesture, large touch targets). Add to CLAUDE.md that every new screen in every session follows docs/design/LOOK.md and the screen rules in section 03. Then list any screen built so far that breaks these rules, and wait for my OK before changing anything.

HQ-5 · Android and iOS apps

I want Control Center on Android and iPhone as real apps, as well as on the web, from the same code. Read section 04 of the Starter Guide, then plan it with me and wait for my OK at each step.

1.  **Explain the plan** in simple words: wrapping this app with Capacitor for Android and iOS, what the apps add over the web (camera for sample and packing photos, push notifications for the 6 PM report and approvals, staying signed in, working on weak signal), and what stays the same (one code base, one database, the same wall).
2.  **Tell me what I must create myself**, step by step: the Google Play Console account and the Apple Developer account in the company’s name (with the D-U-N-S number), the app name and icon, and where each signing key will be stored (GitHub repository secrets, which I paste myself; never in code or chat).
3.  **Set up the apps lane** once I say yes: add Capacitor, the Android and iOS projects, and a GitHub Actions workflow “Build apps” that I can start with one click to make an Android test build and an iPhone test build (on a cloud Mac). Nothing is published to a store without my OK.
4.  **Write the timing into docs/SESSIONS.md** as in the Starter Guide: accounts and setup in P2, the first test install on my phone and the field guys’ phones when the Field Task Feed lands in P3, the store listing (private or unlisted, for staff only) once P3 is in daily use.

When HQ says “click Merge”

Open the pull request link HQ gives you on GitHub, read the title, check the green tick from the automatic checks, scroll down and click **Merge pull request → Confirm merge**. The live site updates from `main` in about two minutes. If GitHub shows a red cross or a conflict, copy it to HQ.

When HQ asks you to open Supabase, Vercel, Google or Apple

Check you are in **SIPL Global Ops ERP** in Supabase, or project **sipl-global-business-ops-erp** in team **SIPL** in Vercel. Your Vercel account also holds an unrelated project, business-calculator: never change that one. Keys and passwords are pasted by you, into the box HQ names, never into the chat.

03

THE LOOK

The UI section · you already chose it

You chose an Apple-clean, minimal look in a proper deep blue, usable by any team member without being taught. Phase 1 already wears it, and HQ-4 writes it down so every new screen, in every session and on every phone, looks like the ones you approved. Four field guys will open this between a courier office and a factory gate: if a screen takes more than a few seconds to understand, they go back to calling you, and the board goes empty.

| Your look                   | As set by you                                                                                                                                              |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Colours**                 | Deep blue sidebar `#0B2F6B`, accent `#1558D6`, white cards on a blue-grey ground `#EAF0FA`. Colour means status only: amber waiting, red stop, green done. |
| **One question per screen** | Each screen answers one question, with one main button.                                                                                                    |
| **Rules where they apply**  | A rule is written in plain words next to the place it applies (“Only you can set this price”).                                                             |
| **Absent, not hidden**      | What a role may not see is not on its screen at all: no greyed-out supplier, no locked column.                                                             |
| **Touch**                   | Every button at least 44 px, usable one-handed, on Android and iPhone alike.                                                                               |

### Your next screens, one question each

| System                | Screen and its one question                                                  | Main button      | Who, on what            |
|-----------------------|------------------------------------------------------------------------------|------------------|-------------------------|
| SYS-02 Alias Checker  | **Which name?** “Which name and pack may this buyer see for this product?”   | Check            | Sales, field; phone     |
| SYS-03 CRM            | **My calls:** “who do I call next, and what is due today?”                   | Log call         | Sales; phone            |
| SYS-03 Board          | **The board:** “where is every deal and sample, and who owns the next step?” | Move card        | Each role, its own view |
| SYS-04 Field Today    | **My tasks:** “what do I pack, send or check today?”                         | Done, with photo | Field; app              |
| SYS-07 Scoreboard     | **My score:** “am I green today?”                                            | None             | Every post              |
| SYS-05 Approve offers | **Waiting for my price:** “which lots and buyers need my price and tap?”     | Approve          | You; app                |
| SYS-08 Money          | **The money:** “what is owed to us and by us, on every deal?”                | Open deal        | You; app                |
| SYS-06 Clerk report   | **6 PM:** “what moved today, and what waits for me?”                         | Open item        | You; app, abroad        |

| The five screen laws                 | Check every screen Claude shows you                                                          |
|--------------------------------------|----------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.        |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the accent blue kept for action.              |
| **3 · Consistency is trust**         | The same thing looks the same everywhere: a lot, a buyer, a market name, a red stop.         |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the user, the company. |
| **5 · Silence is an error**          | Every tap answers at once, including “refused: only the owner can do this”.                  |

**THE TWO-MINUTE RULE:** a new field guy opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the person. The real test: hand the phone to one field guy and watch, without helping.

04

ANDROID AND iOS

One code base, three ways in

Rev C kept the phone as a web app on the home screen and left store apps until field use needs them. You have asked for Android and iOS apps, so this guide brings them forward. Nothing is built twice: Capacitor wraps the same app, and every screen, rule and wall is the one already on the web.

| When                    | What happens                                                                                                                                                                         | Who              |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| Now                     | D-U-N-S number for Shezle Imperio started (Step 1).                                                                                                                                  | Sangeet          |
| P2 · wk 1–2             | Google Play Console (\$25 once) and Apple Developer Program (\$99 a year) accounts in the company’s name; app name and icon; HQ-5 sets up the apps lane and the “Build apps” button. | Sangeet; HQ      |
| P3 · wk 3–5             | First test install when the Field Task Feed lands: Android through Play internal testing, iPhone through TestFlight. You and one field guy first, then all four and the back office. | HQ; you test     |
| Once P3 is in daily use | Store listing for staff only: a private or unlisted app, so the public cannot find it. Push notifications for approvals and the 6 PM report.                                         | HQ, with your OK |
| Every phase after       | Each merge that changes a screen gets a new test build from the same button; store updates go out when you approve them.                                                             | HQ               |

**APP RULES:** the app reads the same database through the same wall, so a field guy’s app can never show a supplier. Signing keys and store passwords are pasted by you into GitHub repository secrets, never into code or chat. Sign-out clears the phone. Nothing reaches a store without your yes. Apple and Google review every listing; a wrapped app with real phone features (camera, notifications, offline) is what they accept.

STEP 3

You do this

**Now open the Continue Building Guide**

This Starter Guide is used once; keep sections 03 and 04 open whenever a new screen or app build is shown to you. From here on, every sitting starts in HQ with the Continue Building Guide, and HQ gives you the prompt for each session to open. Move on when all of this is true:

- The code is on `main`, the live site deploys from `main`, and you can sign in on your phone.
- The wall is sealed: the eight defects closed, the advisor clean, the checks running on every pull request, the test company separate (HQ-2).
- The domain and mail service are decided; no staff invite goes out before they are set up.
- `CLAUDE.md`, `docs/START-NOW.md`, `docs/SESSIONS.md`, the P2 build sheets, the Deal Wall questions and the first session prompts are written, and you have read and corrected them.
- `docs/design/LOOK.md` describes your look, and the apps lane is planned (HQ-4, HQ-5).

Then open section 02 of the Continue Building Guide, **Every sitting**, and follow it. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ in HQ-3

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

| \#  | Item                                                                                                                                                                                                                                                                                                                                                      | Owner                       | Needed for               |
|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|--------------------------|
| 1   | **New app password**; the old one was shared in a chat.                                                                                                                                                                                                                                                                                                   | Sangeet                     | Today                    |
| 2   | **Domain and mail service** for the staff address and sign-in emails.                                                                                                                                                                                                                                                                                     | Sangeet with HQ             | Before any staff invite  |
| 3   | **Plans:** Vercel Pro; Supabase Pro.                                                                                                                                                                                                                                                                                                                      | Sangeet                     | Before staff log in      |
| 4   | **Confirm the five calls** in section 07 of the blueprint: the calendar, money early and books late, the scoreboard as its own system, phone apps (now: Android and iOS from P3), builder and ledger in P7.                                                                                                                                               | Sangeet                     | Week 1                   |
| 5   | **Deal Wall rules:** two one-hour chats, you alone with Claude in the writing session HQ opens, for the Deal Wall Skill: the role wall and alias rule; then offer, sample and follow-up notes, the document checklist per name and the dispatch checklist.                                                                                                | Sangeet                     | Week 1 of P2             |
| 6   | **The lists:** products (real name, HSN, UN number if hazardous, SDS on file); market names (product, name, industry, COA version, photo set, video set); buyers (company, contact, phone, email, industry, city, names shown, date); suppliers (company, contact, origin, products). Google contacts, IndiaMART, Alibaba and portal exports as they are. | Sangeet with back office    | Week 1 of P2             |
| 7   | **D-U-N-S number, Google Play and Apple Developer accounts** in the company’s name; app name and icon.                                                                                                                                                                                                                                                    | Sangeet                     | P2, for P3 test installs |
| 8   | **The numbers** in section 05 of the blueprint.                                                                                                                                                                                                                                                                                                           | Sangeet                     | P3                       |
| 9   | **The team:** who holds purchase, which field guys hold sales, each person’s email and phone type (Android or iPhone).                                                                                                                                                                                                                                    | Sangeet                     | P3                       |
| 10  | **Switch-off date** for the paid CRM and the task tool.                                                                                                                                                                                                                                                                                                   | Sangeet                     | End of P3                |
| 11  | **First product line** for the Lot to Sale Trigger.                                                                                                                                                                                                                                                                                                       | Sangeet                     | P4                       |
| 12  | **Setup answers:** WhatsApp Business account (yes or no); couriers used; outbound languages; GSTINs, e-invoicing, LUT and who files; document prefixes; currencies and banks; scoreboard week end (Thursday 14:00?); the seven-division org board design; reuse of ideas from the reference codebase (patterns only).                                     | Sangeet with the accountant | P4 to P5                 |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ in HQ-3

Standing rules for everything ever built in this repository, in every session

**House rules.** 1 · ONE HOME: this repository, this Supabase project and this Vercel project are the only ones Control Center will ever have; main is the one true copy, production deploys from it, and the Android and iOS apps are built from it; every company and every system is part of the same app, and nothing specific to SIPL is hard-coded in the shared core. 2 · THE WALL LIVES IN THE DATABASE: confidentiality is enforced by row and column security, never by a screen hiding something; a role that may not read a row never receives it; nobody but the owner sees the supplier and the buyer of one lot side by side; the AI sees no other side’s names or prices. 3 · ACCESS IS GRANTED, NEVER CLAIMED: signing up gives nothing; an Owner or Admin grants a role to an email; only an Owner changes the Owner role; the last Owner cannot be removed; exit withdraws access the same day. 4 · A HUMAN TAP BEFORE ANYTHING LEAVES: no price, offer, message, document, entry, builder publish or store release goes out without the person the rules name; AI never writes a price. 5 · THE DIARY NOBODY CAN EDIT: every change is written to the audit log by the database; corrections are new entries or reversals, never silent edits. 6 · SECRETS STAY OUT: no key, password, signing key or personal email ever goes into code, chat, docs or GitHub files; only the public Supabase URL and publishable key may sit in .env.production; nothing secret ever gets a VITE\_ name. 7 · MONEY IS CALCULATED IN THE DATABASE, in exact decimals; the browser and the apps only show it. If anything you propose bends a rule, say so out loud and wait for my decision.

**Sangeet’s guardrails.** Human signs off: “Pricing and negotiation.” “Every document flow must be approved. Especially in accounts, sales, purchase or the financial side.” “Any kind of process where a workflow exists. As well as the operational and QC side.” Never automated: “Only where manual labour and a field job is required”: standing at the material, checking a waste or offspec lot, packing samples, loading. AI acts alone: not yet set by Sangeet, so the default holds: the system drafts, flags, reads courier tracking and counts KPIs; nothing leaves and nothing is priced without his tap; any message with a rupee figure, a quantity commitment or a token request waits for him.

**Trade rules.** One product may carry many market names, one per target industry, but one buyer never sees the same product under two names: the database blocks it, and only an owner or admin override, logged with a reason, lets it through; the checker answers for one buyer at a time, so it cannot be used to match names. A market name never appears on a GST, customs or bank document; those carry the real product name and HSN; safety, tax, e-way and dangerous-goods papers are never withheld or altered. A token is never the deal value and never makes a sale final. Tally stays the book of record until three months of parallel running match and the accountant signs; cut-over only on 1 April. Automatic KPIs first; snapshot on write. The reference codebase from another client is for patterns only, never copied. Build in the blueprint’s order; a system starts only when Sangeet approves its build sheet.

**Changing the database.** Every change is a new migration, adding, never dropping or renaming without Sangeet’s yes, safe to run twice, with no hard-coded ids, and tested as each of the seven roles, because a blocked write can look like success. Only HQ applies migrations to the live database, in order, and the file name carries the exact version the database records. The automatic checks must pass before any merge.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Sangeet can skip this page

### Stack, as built

Vite, React, TypeScript and Tailwind; Supabase (Postgres 17, Auth, Row Level Security, Storage for COAs, photos and videos) in Mumbai; Vercel deploying production from `main`, with a preview for every branch. **Android and iOS** by wrapping the same app with Capacitor; builds from a GitHub Actions “Build apps” workflow (Android on Linux, iOS on a cloud Mac), signing keys only in GitHub repository secrets; Play internal testing and TestFlight first, then a private or unlisted store listing. Public variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Anything that needs a secret (the trigger’s server work, courier tracking, the Deal Clerk, the Claude API, WhatsApp Business, push notifications) runs as a Supabase Edge Function or database function, with keys as Supabase secrets. Scheduled jobs (night KPI entries, the clerk at 8 AM and 6 PM) use Supabase scheduled jobs. Regenerate database types from Supabase instead of keeping them by hand.

### What already exists (Phase 1)

15 tables: companies and memberships; seven roles (owner, admin, purchase, sales, field, backoffice, accountant); supply side `suppliers`, `products`, `lot_purchase`; demand side `buyers`, `product_aliases`, `lot_sales`; `alias_product_map` readable only by owner and admin; grants (`member_invitations`, `grant_access`, `claim_my_access`); `seed_company`; Owner and last-owner guards; the audit log; 84 role-by-role checks. Screens: Sign in, No access yet, Today with price approval, Lots, Lot record, Buyers, Suppliers, Products, Names, Team.

### Sessions, and the prompts HQ writes

- **HQ** runs on `main`: owns CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md, the live database and the apps lane; applies migrations in order; reviews and merges pull requests; never builds a system itself.
- **Builders**, at most two at a time, one per system: each starts from the latest `main`, works on its own branch, touches only `src/features/sys-NN-name/` and its own migration files, writes migrations but never applies them, and opens a pull request with a handover in `docs/handovers/`. Shared files change only through `docs/requests/`.
- **Writing session**: only `docs/` and `content/`; never a price.
- **Every opening prompt HQ writes** is saved in `docs/session-prompts/` and shown to Sangeet in its own box. It always says: which system and phase; the build sheet to read (written and approved first); the branch rule; only this system’s files; migrations written, never applied; the wall to check as each role; screens to `docs/design/LOOK.md` and section 03; plan in small pieces, each testable on the branch preview and on the phone, the first always “load real data and show one true list”; anything costing money or needing Sangeet’s rule listed first; wait for OK; end each sitting with a commit, a handover and a dated note in `docs/sessions/`.

Prepared for Sangeet Sejpal · Shezle Imperio Private Limited · traces to blueprint BOA-2026-SHE-01 Rev C and the setup health check of 17.11.2026.  
Stack as built: Claude Code, Vite and React, Supabase, Vercel, GitHub; Android and iOS through Capacitor.
