# LX IT Solution · Starter Prompt

Paste this into the **HQ** session (Claude desktop app → Code tab → folder `lx-os`), as Step 4 of the LX Starter Guide says. Fill in your GitHub address first.

---

```
You are setting up the LX OS for LX IT Solution, which sells computer software licenses (antivirus, graphic, accounting, operating system, Office) to repeat customers who order on WhatsApp and phone. I am Lalitesh Sharma, the owner, and I am not a programmer.

In this folder, docs/ holds four PDFs:
- my AI Systems Blueprint;
- my Starter Guide (pages R1, R2 and R3 are written for you);
- my UI Guide;
- my Continue Building Guide.
docs/samples holds my key sheets, a distributor Excel file, a Tally invoice and customer messages.

My GitHub repository already exists:
https://github.com/____________________/____________________
I have Claude, a Supabase project called lx-os (Mumbai) and a Vercel account. Nothing else is set up.

This session is HQ, my main session. HQ owns main and the database, merges all work, and never builds a system itself. Later, HQ writes the opening prompt for every other session I open.

Work in six stages. After each stage, tell me in simple words what you did, then STOP and wait for my OK. Ask me one question at a time. Never ask me to paste a key, password or secret into this chat: tell me where to find it and where to paste it myself. I may write to you in Hindi, Hinglish or English.

STAGE 1 · Read and check
Read the blueprint and the Starter Guide. Tell me in ten lines or fewer:
- what LX IT Solution is;
- my three problems;
- the foundation and the seven systems;
- the twelve-week build order.
List the points the blueprint says are unsettled, and do not settle any yourself: 300 orders a month against 100 quotes and 50 converted; the average order value of 2000000 against the ₹10 to 50 lakh band; the list of "some items" that need my price quote; the credit limit per customer.
Then check that Node.js and Git are installed. If either is missing, tell me exactly what to download and click.

STAGE 2 · Set up
1. Connect this folder to my GitHub repository above. If it already has files (for example a README), keep them.
2. Create a Next.js app (App Router, TypeScript, Tailwind) in this folder, with Supabase.
3. Make a .gitignore that keeps out .env.local, every secret and docs/samples, because the samples hold real keys and customer details.
4. Create .env.local with these three names and empty values: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Then tell me how to open the file in Notepad, and where to copy each value in Supabase:
   - the Project URL and publishable key: the Connect button → App Frameworks → Next.js;
   - the secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   I paste them into the file myself. Never repeat them, never write them in any other file, never commit them.
5. Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Read the rules back to me in five lines.
6. Make the first commit and push to main. Show me the app running on this computer.

STAGE 3 · Start the clocks
Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. Tell me the first action for each one today; the WhatsApp Business API number comes first, because it takes 1 to 3 weeks. From now on, start every sitting by reminding me of anything not ticked.

STAGE 4 · Go live
Tell me the three environment variable names for Vercel. Then wait while I import the repository into Vercel and deploy (Step 5 of the Starter Guide); check that the Framework Preset is Next.js. When I give you the live address, confirm that the app opens. Tell me exactly what to set in Supabase (Authentication → URL Configuration: Site URL and redirect URLs) so sign-in works there.

STAGE 5 · The foundation
Build F-00, the LX Key Register, as R3 describes: profiles and roles (owner, manager, assistant), brands, products, keys, customers, the key event log, settings and the audit log, with Row Level Security. Keys are shown masked to everyone except the person sending; every reveal is logged; only I can set a credit limit. The Tally link comes in week 3; do not build it now.
Apply the migrations to Supabase, add my owner login, push, and confirm I can sign in on my phone.

STAGE 6 · The plan and the first prompts
1. Write docs/SESSIONS.md: the twelve-week build order from the blueprint and section 05 of the Continue Building Guide, which systems run side by side (at most two builders), and the rule that each builder works in its own worktree on its own branch and hands over to HQ.
2. Write docs/build-sheets/sys-01-key-loader.md for the LX Key Loader: what it does, what it must never do, the tables it adds, its screens and its done-when.
3. Tell me to choose the look now (Step 6 of the Starter Guide: sections 01 and 02 of the UI Guide), and wait.
4. When docs/design is ready, write the opening prompt for the SYS-01 Key Loader builder session, and for the writing session (the Key Register SOP), into docs/session-prompts/. Show each to me in its own box, ready to paste, and tell me to switch to the Continue Building Guide.
No feature code before my OK on the build sheet.
```
