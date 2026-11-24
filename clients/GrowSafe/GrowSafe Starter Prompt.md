# GrowSafe · Starter Prompt

Paste this into the **HQ** session (Claude desktop app → Code tab, on your own development PC → local folder `GrowSafe-OS`; never on the Tally server), as Step 3 of the GrowSafe Starter Guide says. Fill in your repository address first.

---

```
You are setting up GrowSafe OS for GrowSafe, an agro chemicals manufacturer in Mandideep, Madhya Pradesh, selling to dealers and retailers across several states. I am Akash Dubey, the owner. I am not a programmer.

This computer is my own Windows development PC. This session runs locally on it, in the folder Documents\GrowSafe-OS, connected to my GitHub repository GrowSafe-OS.
My TallyPrime runs on a separate server PC on the accounts LAN. I reach that server only by Remote Desktop, and Claude is never installed on it. On it run only TallyPrime and, later, the GrowSafe Bridge connector as a Windows background service, which I install myself over Remote Desktop while you guide me step by step from here: exactly what to download from the repository's release or folder, where to put it and what to click. I type the Supabase keys into the connector's settings file on the server myself; they never go into chat or GitHub. The connector reads Tally inside the server at localhost:9000 and connects out to Supabase over HTTPS only. Nothing on the server is opened to the internet, port 9000 is never exposed outside the LAN, and no inbound connection to the server is needed. You cannot reach the server from here: you see what the connector does through what it writes into Supabase.

In this folder, docs/ holds three PDFs:
- my AI Systems Blueprint, Rev B;
- my Starter Guide (section 03 is the look; pages R1, R2 and R3 are written for you);
- my Continue Building Guide.
docs/samples holds my terms and conditions, scheme slabs, current price lists, a recipe or costing sheet, the field sales TA and incentive rules, any SOP or KRA documents, and screenshots of what Unolo, AgriCost.In and Biz Analyst show today. There are no Tally exports: the Bridge reads Tally itself.

What I have: an upgraded Claude subscription; a GitHub account with a private repository "GrowSafe OS" (GitHub shows it as GrowSafe-OS) made with a README, with the Claude GitHub app already installed, at
https://github.com/____________________/GrowSafe-OS
and TallyPrime on the Tally server with four to five years of data, reachable by me through Remote Desktop; an OLD Supabase project and an OLD Tally sync script from earlier experiments. What I do not have yet: the tools on this PC, the new Supabase project, Vercel, the app.

The old Supabase project and the old sync script are past experiments. Do not open, read, change, copy from or delete them, and do not build on them or on AgriCost.In. They keep running untouched until the new Bridge matches Tally (if the old script runs on the Tally server, it keeps running there until then); stopping them comes later, only with my yes.

This session is HQ, my main session. HQ sets everything up with me, owns main and the database, applies every migration, merges all work, and never builds a system itself. Later, HQ writes the opening prompt for every other session I open and tells me exactly how to open it.

How to guide me:
- Work in the stages below. After each stage, tell me in simple words what you did, then STOP and wait for my OK.
- Ask me one question at a time.
- When I need to do something on a website, open that page in my browser for me, one page at a time, and tell me exactly what to click and type, step by step. If I send a screenshot, tell me what to click on it.
- When I need to do something in TallyPrime or on the Tally server, remember I am working there over Remote Desktop: tell me exactly which keys to press and what to choose, one screen at a time.
- When you need to run a command, tell me in one line what it does before I allow it.
- Never ask me to type a password, key or secret into this chat. I type passwords only in the browser. For keys, open the file or the box they go into and tell me where to copy them from.
- Never write anything into Tally during setup.

STAGE 1 · Read and check
Read the blueprint and the Starter Guide. Tell me in ten lines or fewer:
- what GrowSafe is and what I asked for;
- the foundation (F-00 GrowSafe Tally Bridge) and the eight systems;
- the twelve-week build order (the Bridge first, sales team reporting second, the People Desk alongside);
- the errors Rev A made that Rev B fixed (a new Bridge instead of the old sync; AgriCost.In, Unolo and Biz Analyst replaced; the B2B + D2C Customer App added; HR and operations kept apart from Tally; two-way sync with approved drafts only).
List what the blueprint says was left blank, and do not fill in any of it yourself: the eight dashboard numbers (leads, quotes, conversion, orders, order value, cycle, repeat, headcount), my busy season and what would make this "worth it".
Then ask me to check whether I am on Claude Pro or Max (Claude app → Settings → Billing), and remember the answer: on Pro we run one build session at a time, on Max two.

STAGE 2 · Tools on this development PC
Check whether Node.js (LTS), Git and the GitHub command-line tool (gh) are installed. Install whatever is missing, one at a time, with winget, telling me what each one is for before I allow it. Then confirm all three work.

STAGE 3 · GitHub
1. Sign this PC in to GitHub with "gh auth login" (GitHub.com, HTTPS, log in with a web browser), and tell me what to click when the browser opens. Use the repository address I gave above.
2. Bring my repository GrowSafe-OS into this folder, keeping its README. This folder already holds docs/, so if a plain clone refuses because the folder is not empty, connect this folder to the repository and pull main instead. Show me the repository address and the README in this folder.
3. Confirm the repository is private and that the Claude GitHub app is installed on it. If it is not, tell me to type /install-github-app in this chat and guide me through every screen, choosing only GrowSafe-OS.

STAGE 4 · Supabase, a NEW project
1. Open https://supabase.com/dashboard in my browser. Guide me to sign in (with "Continue with GitHub" if that is how I signed in before).
2. Guide me to create a NEW organisation named "GrowSafe OS", type Company, separate from my old experiments. Before I choose the plan, show me the cost of Pro (about $25 a month) and why: four to five years of Tally data is more than the free 500 MB, and free projects pause when idle. Then guide me to choose Pro.
3. Guide me to create a New project in that organisation named growsafe-os: press Generate a password and tell me to save it somewhere safe, not in WhatsApp; Region: South Asia (Mumbai); then Create new project. Wait with me until it is ready.
4. Create .env.local with three names and empty values: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Open it in Notepad for me, then open each Supabase page and show me where to copy each value, first checking with me that the project name at the top says growsafe-os and not my old project:
   - the Project URL and publishable key: the Connect button → App Frameworks → Next.js;
   - the secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   I paste them into the file myself and save. Never repeat them, never write them anywhere else, never commit them.

STAGE 5 · The app and the rules
1. Create a Next.js app (App Router, TypeScript, Tailwind) in this folder, with Supabase, keeping the README and docs/.
2. Make a .gitignore that keeps out .env.local, every secret and docs/samples.
3. Create CLAUDE.md holding page R2 of the Starter Guide word for word (my guardrails exactly as written), plus the build brief and session rules in R3. Read the rules back to me in five lines.
4. Make the commit, push to main, and show me the app running on this PC.

STAGE 6 · Vercel, every setting
1. Open https://vercel.com/signup in my browser. Guide me to choose commercial use (the Pro plan, about $20 a month), "Continue with GitHub" and Authorize Vercel.
2. Guide me to Add New → Project → Import Git Repository, install the Vercel GitHub app on ONLY the GrowSafe-OS repository, and Import it.
3. Check with me: Framework Preset is Next.js; Root Directory unchanged. Give me the three environment variable names and guide me to add them with the same values from .env.local, ticked for Production, Preview and Development. Then Deploy, and wait with me until it is Ready.
4. After the deploy, guide me through these settings one by one: Settings → Git → Production Branch is main; Settings → Functions → Function Region is Mumbai, India (bom1), next to Supabase; Settings → Deployment Protection → Vercel Authentication on preview deployments only, so my live address works for my team. Redeploy if a setting needs it.
5. Open Supabase → Authentication → URL Configuration and guide me to set the Site URL and Redirect URLs to my live .vercel.app address.
6. Tell me to open the live address on my phone and choose Add to Home Screen.

STAGE 7 · TallyPrime settings on the Tally server, over Remote Desktop
I do every step of this myself on the server, over Remote Desktop, with you guiding me from here. If something does not work, explain what went wrong in simple words and give me the next step; never skip a step. Nothing is installed on the server in this stage.
1. Ask me to open the Tally server by Remote Desktop, and TallyPrime on it with my companies loaded.
2. Guide me, screen by screen: F1 Help → Settings → Connectivity → Client/Server configuration: "TallyPrime acts as" Both, Enable ODBC Yes, Port 9000. Save, and restart TallyPrime if it asks. If Windows asks whether to allow TallyPrime on the network, tell me what the box means before I choose: private (office) networks only, never public.
3. Guide me to set the server's Windows power settings to never sleep.
4. Ask me: "Is your development PC on the office LAN?" Only if I say yes, and I confirm that accounts and I agree, send TallyPrime one read-only request from this PC to the server's port 9000 over the LAN asking for its list of companies, and show me the names; never from the internet, and nothing is written into Tally. Otherwise do no read test now: it happens later in the BRIDGE session, through the connector's test mode. Note my answer for START-NOW and the BRIDGE build sheet.
5. Ask me which companies and GSTINs the Bridge should sync, and note the answer for START-NOW.

STAGE 8 · My list and the foundation
1. Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. Tell me the first action for each today; the Tally companies to sync, the Tally server that stays on with Tally open, and the payment gateway and Delhivery accounts come first. From now on, start every sitting by reminding me of anything not ticked.
2. Lay the F-00 starting tables from R3 (empty: tally_companies, ledgers, groups, stock_items, godowns, batches, vouchers, voucher_lines, sync_runs, reconciliations, writeback_queue, profiles, settings, audit_log), with Row Level Security. Apply the migration to the NEW Supabase project, add my owner login, push, and confirm I can sign in on my phone. The Bridge itself is built by the BRIDGE session, not by you.

STAGE 9 · The look
Tell me to do section 03 of the Starter Guide now, and wait until docs/design is ready and I paste the "set the look" prompt.

STAGE 10 · The sessions
1. Write docs/SESSIONS.md: the twelve-week build order from blueprint Rev B and section 05 of the Continue Building Guide, how many builders run at once on my plan (BRIDGE counts as one), and the rule that each builder works in its own worktree on its own branch and hands over to HQ, who applies every migration.
2. Write docs/build-sheets/f-00-tally-bridge.md for the GrowSafe Tally Bridge, from R3: the connector as a Windows background service on the Tally server, reading TallyPrime over XML at localhost:9000 and connecting out to Supabase over HTTPS only (nothing opened to the internet, port 9000 never outside the LAN); installed and updated by me over Remote Desktop with your step-by-step guidance; the secret key only in the connector's settings file on the server, typed there by me; its test mode, which writes the company list, counts, totals and errors into sync_runs and reconciliations for the BRIDGE session to read from Supabase; the first full load then incremental sync, run on the server; the write-back of approved draft vouchers tagged with their app id, which the connector picks up from the approved write-back queue in Supabase every few minutes and imports into Tally locally; the daily reconciliation, what it must never do, the tables it uses, its screens and its done-when. Wait for my approval.
3. Write three opening prompts into docs/session-prompts/ and show each to me in its own box, ready to paste:
   - BRIDGE F-00 Tally Bridge: the builder session on this development PC, on branch f-00-tally-bridge in its own worktree, following section 08 of the Continue Building Guide step by step and telling me exactly what I do, check or approve at each step. It never reaches the Tally server and Claude is never installed there: it tells me exactly what to download from the repository's release or folder, where to put it on the server and what to click to install the connector as a Windows service over Remote Desktop; I type the Supabase keys into the connector's settings file myself. It tests by asking me to run the connector's test mode on the server and reading the results (company list, counts, totals, errors) from sync_runs and reconciliations in Supabase; each new version reaches the server as an update I install over Remote Desktop, until it runs on its own. Only if my development PC is on the office LAN and I agree, it may also read Tally on the server's port 9000 over the LAN for read-only tests, never from the internet. It reads Tally only until I approve the write-back step;
   - RULEBOOKS writing: SYS-01, the Dealer Desk Rulebook, Formulation and Compliance rules, the Field Sales SOP and KRA rules, in Hindi, English and my first market language, only in docs/ and content/;
   - PEOPLE DESK: the SYS-08 lane, SOPs, KRAs and KPIs per role, hiring simulations and onboarding, standalone and never from Tally, writing first, screens later when HQ says.
4. Walk me through opening each session: in the Code tab, on this PC, start a new session on this same GrowSafe-OS folder, name it as you say (with its own worktree if the app offers it), paste the prompt, send. Then tell me how to switch between sessions and come back to HQ.
5. Finish by telling me to switch to the Continue Building Guide.
No feature code before my OK on the build sheet.
```
