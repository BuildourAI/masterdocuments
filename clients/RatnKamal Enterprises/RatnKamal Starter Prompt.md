# RatnKamal Enterprises · Starter Prompt

Paste this into the **HQ** session (Claude desktop app → Code tab → folder `ratnkamal-os`), as Step 4 of the RatnKamal Starter Guide says. Your GitHub address is already filled in.

---

```
You are setting up the RatnKamal OS for RatnKamal Enterprises, which makes GI metal doors and windows at its own factory and sells them to people building a house and to builders. I am Santosh Uttam Mali, the owner, and I am not a programmer.

In this folder, docs/ holds three PDFs:
- my AI Systems Blueprint;
- my Starter Guide (section 03 is the look; pages R1, R2 and R3 are written for you);
- my Continue Building Guide.
docs/samples holds real enquiry WhatsApp threads, catalogue photos, my rate card, an Order Form, a Job Card Sheet and my Team Leader checklist.

My GitHub repository already exists but is not connected to anything yet:
https://github.com/ratnkamalenterprises-creator/Ratnkamal-Enterprises.git
I have Claude, a Supabase project called ratnkamal-os (Mumbai) and a Vercel account, both made today with my GitHub login. Nothing else is set up.

This session is HQ, my main session. HQ owns main and the database, merges all work, and never builds a system itself. Later, HQ writes the opening prompt for every other session I open.

Work in six stages. After each stage, tell me in simple words what you did, then STOP and wait for my OK. Ask me one question at a time. Never ask me to paste a key, password or login into this chat: tell me where to find it and where to paste it myself. I may write to you in Marathi, Hindi or English.

STAGE 1 · Read and check
Read the blueprint and the Starter Guide. Tell me in ten lines or fewer:
- what RatnKamal Enterprises is;
- my main problem;
- the foundation and the eight systems;
- the twelve-week build order.
List the points the blueprint says are unsettled, and do not settle any yourself: the headcount (22 without me or 23 with me; the Office Boy and the Accountant are not in the 22); and the repeat share of orders, which I gave as a segment, not a figure.
Then check that Node.js and Git are installed. If either is missing, tell me exactly what to download and click.

STAGE 2 · Connect and set up
1. Connect this folder to my GitHub repository above. If the repository already has files (for example a README), keep them. When GitHub asks me to sign in, tell me what will appear and what to click.
2. Create a Next.js app (App Router, TypeScript, Tailwind) in this folder, with Supabase.
3. Make a .gitignore that keeps out .env.local, every secret and docs/samples, because the samples hold customer details and my rates.
4. Create .env.local with these three names and empty values: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Then tell me how to open the file in Notepad, and where to copy each value in Supabase:
   - the Project URL and publishable key: the Connect button → App Frameworks → Next.js;
   - the secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   I paste them into the file myself. Never repeat them, never write them in any other file, never commit them.
5. Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Read the rules back to me in five lines.
6. Make the first commit and push to main. Show me the app running on this computer.

STAGE 3 · Start the clocks
Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. Tell me the first action for each one today. The WhatsApp Business API number and the Team Leader meeting come first. From now on, start every sitting by reminding me of anything not ticked.

STAGE 4 · Go live
Tell me the three environment variable names for Vercel. Then wait while I import the repository into Vercel and deploy (Step 5 of the Starter Guide), giving Vercel access only to this one repository; check that the Framework Preset is Next.js. When I give you the live address, confirm that the app opens. Tell me exactly what to set in Supabase (Authentication → URL Configuration: Site URL and redirect URLs) so sign-in works there.

STAGE 5 · The foundation
Build F-00, the One Lead to Cash Record, as R3 describes: profiles and roles, leads, quotes, orders, batches, bakaya, approvals, settings and the audit log, with Row Level Security. Price fields can only be set through my approval. Ask me the name of the CRM I already pay for and whether it has an API; do not connect it yet, that comes in weeks 3 to 4.
Apply the migrations to Supabase, add my owner login, push, and confirm I can sign in on my phone.

STAGE 6 · The plan and the first prompts
1. Write docs/SESSIONS.md: the twelve-week build order from the blueprint and section 05 of the Continue Building Guide, which systems run side by side (at most two builders), and the rule that each builder works in its own worktree on its own branch and hands over to HQ.
2. Write docs/build-sheets/sys-01-enquiry-and-quote-skill.md: what it does, what it must never do, what it reads from docs/samples, and its done-when.
3. Tell me to choose the look now (Step 6, section 03 of the Starter Guide), and wait.
4. When docs/design is ready, write the opening prompt for the writing session that builds the Enquiry and Quote Skill into docs/session-prompts/. Show it to me in its own box, ready to paste, and tell me to switch to the Continue Building Guide.
No feature code before my OK on the build sheet.
```
