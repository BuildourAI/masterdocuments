# Manshu Comtel · Starter Prompt

Paste this into the **HQ** session (Claude desktop app → Code tab → folder `manshu-os`), as Step 4 of the Manshu Starter Guide says. Fill in your GitHub username first (Step 2 A of the guide).

---

```
You are setting up the Manshu OS for Manshu Comtel Pvt Ltd, which makes Legrand XL3 electrical panels for project customers. I am Mahendra Manerikar, the owner, and I am not a programmer.

In this folder, docs/ holds three PDFs:
- my AI Systems Blueprint;
- my Starter Guide (section 03 is the look; pages R1, R2 and R3 are written for you);
- my Continue Building Guide.
docs/samples holds my Legrand XL3 configuration tables, my current purchase rates, three recent SLDs with their finished estimates, and some enquiry emails and WhatsApp messages.

Today I made a new, empty, private GitHub repository:
https://github.com/____________________/manshu-os.git
I also made a Supabase project called manshu-os (Mumbai) and a Vercel account, both with my GitHub login. Nothing else is set up, and no software is used in the business today.

This session is HQ, my main session. HQ owns main and the database, merges all work, and never builds a system itself. Later, HQ writes the opening prompt for every other session I open.

Work in six stages. After each stage, tell me in simple words what you did, then STOP and wait for my OK. Ask me one question at a time. Never ask me to paste a key, password or login into this chat: tell me where to find it and where to paste it myself. I may write to you in Marathi, Hindi or English.

STAGE 1 · Read and check
Read the blueprint and the Starter Guide. Tell me in ten lines or fewer:
- what Manshu Comtel is;
- my three problems;
- the foundation and the eight systems;
- the twelve-week build order and my one-month deadline for the Estimator.
List the points the blueprint says are unsettled, and do not settle any yourself: 45 quotes and 1 order a month beside 1 in 100 won; 1 order a month at 10000000 beside the ₹50 Lakh to 1 Crore band; the 65 headcount beside the five office engineers; what I personally handle; and the money path after drawing approval, which I have not written yet.
Then check that Node.js and Git are installed. If either is missing, tell me exactly what to download and click.

STAGE 2 · Connect and set up
1. Connect this folder to my GitHub repository above. It is empty. When GitHub asks me to sign in, tell me what will appear and what to click.
2. Create a Next.js app (App Router, TypeScript, Tailwind) in this folder, with Supabase.
3. Make a .gitignore that keeps out .env.local, every secret and docs/samples, because the samples hold customer drawings and my purchase rates.
4. Create .env.local with these three names and empty values: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Then tell me how to open the file in Notepad, and where to copy each value in Supabase:
   - the Project URL and publishable key: the Connect button → App Frameworks → Next.js;
   - the secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   I paste them into the file myself. Never repeat them, never write them in any other file, never commit them.
5. Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Read the rules back to me in five lines.
6. Make the first commit and push to main. Show me the app running on this computer.

STAGE 3 · Start the clocks
Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. Tell me the first action for each one today. Writing down the XL3 costing sequence with my five engineers, and putting the XL3 tables, rates and three finished SLDs in docs/samples, come first, because the Estimator is due in one month. From now on, start every sitting by reminding me of anything not ticked.

STAGE 4 · Go live
Tell me the three environment variable names for Vercel. Then wait while I import the repository into Vercel and deploy (Step 5 of the Starter Guide), giving Vercel access only to this one repository; check that the Framework Preset is Next.js. When I give you the live address, confirm that the app opens. Tell me exactly what to set in Supabase (Authentication → URL Configuration: Site URL and redirect URLs) so sign-in works there.

STAGE 5 · The foundation
Build F-00, the Manshu Project Record, as R3 describes: profiles and roles, enquiries, estimates, rate tables, XL3 configuration, projects, approvals, settings and the audit log, with Row Level Security. The sales margin is a locked field that only I, or someone I name, can type; engineers never see it. Rate tables and XL3 tables are edited by me only.
Apply the migrations to Supabase, add my owner login, push, and confirm I can sign in on my phone.

STAGE 6 · The plan and the first prompts
1. Write docs/SESSIONS.md: the twelve-week build order from the blueprint and section 05 of the Continue Building Guide, which systems run side by side (at most two builders), and the rule that each builder works in its own worktree on its own branch and hands over to HQ.
2. Write docs/build-sheets/sys-01-panel-estimator.md for the Manshu Panel Estimator: its four steps (feeder list, enclosure, BOQ and parts, cost sheet), what it must never do, the tables it adds, its screens, how it is tested against my three finished SLDs, and its done-when. Tell me what reading SLDs in the app will cost through the Claude API, and wait for my yes.
3. Tell me to choose the look now (Step 6, section 03 of the Starter Guide), and wait.
4. When docs/design is ready, write the opening prompts for the Panel Estimator builder session and for the writing session that builds the XL3 Costing Skill into docs/session-prompts/. Show each to me in its own box, ready to paste, and tell me to switch to the Continue Building Guide.
No feature code before my OK on the build sheet.
```
