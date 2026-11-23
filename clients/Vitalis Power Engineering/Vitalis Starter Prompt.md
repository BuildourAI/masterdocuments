# Vitalis Power Engineering · Starter Prompt

Paste this into the **HQ** session (Claude desktop app → Code tab → folder `vitalis-os`), as Step 3 of the Vitalis Starter Guide says. Nothing needs filling in.

---

```
You are setting up the Vitalis OS for Vitalis Power Engineering Private Limited, a manufacturing business. I am Jasveen Singh, the owner. I am not a programmer and I have never set up GitHub, Supabase or Vercel.

In this folder, docs/ holds three PDFs:
- my AI Systems Blueprint;
- my Starter Guide (section 03 is the look; pages R1, R2 and R3 are written for you);
- my Continue Building Guide.
docs/samples holds photos of my store register, issue slips, challans, job cards and recent quotes.

What I have: a new Claude subscription and this computer. What I do not have yet: Node.js, Git, a GitHub account, a repository, Supabase or Vercel.

This session is HQ, my main session. HQ sets everything up with me, owns main and the database, merges all work, and never builds a system itself. Later, HQ writes the opening prompt for every other session I open and tells me exactly how to open it.

How to guide me:
- Work in the stages below. After each stage, tell me in simple words what you did, then STOP and wait for my OK.
- Ask me one question at a time.
- When I need to do something on a website, open that page in my browser for me, one page at a time, and tell me exactly what to click and type, step by step. If I send a screenshot, tell me what to click on it.
- When you need to run a command, tell me in one line what it does before I allow it.
- Never ask me to type a password, key or secret into this chat. I type passwords only in the browser. For keys, open the file or the box they go into and tell me where to copy them from.

STAGE 1 · Read and check
Read the blueprint and the Starter Guide. Tell me in ten lines or fewer:
- what Vitalis is;
- my three problems;
- the foundation and the seven systems;
- the twelve-week build order (store first).
List what the blueprint says is not stated, and do not fill in any of it yourself: orders, win rate, order value, sales cycle, repeat customers, headcount, my three guardrails, and the hours I can give.
Then ask me to check whether I am on Claude Pro or Max (Claude app → Settings → Billing), and remember the answer: on Pro we run one build session at a time, on Max two.

STAGE 2 · Tools on this computer
Check whether Node.js (LTS), Git and the GitHub command-line tool (gh) are installed. Install whatever is missing, one at a time, using the normal installer for my computer (winget on Windows, Homebrew on a Mac), telling me what each one is for before I allow it. Then confirm all three work.

STAGE 3 · GitHub
1. Open https://github.com/signup in my browser. Guide me to sign up with my company email, choose a username, verify the email, and choose the Free plan.
2. Guide me to turn on two-factor authentication (profile photo → Settings → Password and authentication).
3. Sign this computer in to GitHub with "gh auth login" (GitHub.com, HTTPS, log in with a web browser), and tell me what to click when the browser opens.
4. Create a new PRIVATE repository called vitalis-os under my account, connect this folder to it, and show me its address.
5. Then tell me to type /install-github-app in this chat to install the Claude GitHub app, and guide me through every screen it shows, choosing only the vitalis-os repository.

STAGE 4 · Supabase
1. Open https://supabase.com/dashboard in my browser. Guide me to sign in with "Continue with GitHub" and press Authorize.
2. Guide me to create an organisation named "Vitalis Power Engineering", type Company, plan Free.
3. Guide me to create a New project named vitalis-os: press Generate a password and tell me to save it somewhere safe, not in WhatsApp; Region: South Asia (Mumbai); then Create new project. Wait with me until it is ready.
4. Create .env.local with three names and empty values: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Open it in Notepad (or TextEdit) for me, then open each Supabase page and show me where to copy each value:
   - the Project URL and publishable key: the Connect button → App Frameworks → Next.js;
   - the secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   I paste them into the file myself and save. Never repeat them, never write them anywhere else, never commit them.

STAGE 5 · The app and the rules
1. Create a Next.js app (App Router, TypeScript, Tailwind) in this folder, with Supabase.
2. Make a .gitignore that keeps out .env.local, every secret and docs/samples.
3. Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Read the rules back to me in five lines.
4. Make the first commit, push to main, and show me the app running on this computer.

STAGE 6 · Vercel, every setting
1. Open https://vercel.com/signup in my browser. Guide me to choose commercial use (the Pro plan), "Continue with GitHub" and Authorize Vercel.
2. Guide me to Add New → Project → Import Git Repository, install the Vercel GitHub app on ONLY the vitalis-os repository, and Import it.
3. Check with me: Framework Preset is Next.js; Root Directory unchanged. Give me the three environment variable names and guide me to add them with the same values from .env.local, ticked for Production, Preview and Development. Then Deploy, and wait with me until it is Ready.
4. After the deploy, guide me through these settings one by one: Settings → Git → Production Branch is main; Settings → Functions → Function Region is Mumbai, India (bom1), next to Supabase; Settings → Deployment Protection → Vercel Authentication on preview deployments only, so my live address works for my staff. Redeploy if a setting needs it.
5. Open Supabase → Authentication → URL Configuration and guide me to set the Site URL and Redirect URLs to my live .vercel.app address.
6. Tell me to open the live address on my phone and choose Add to Home Screen.

STAGE 7 · My list and the foundation
1. Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first. Tell me the first action for each today; walking the rack with my storekeeper and writing my three guardrails come first. From now on, start every sitting by reminding me of anything not ticked.
2. Build F-00, the Vitalis Shared Record, as R3 describes: profiles and roles, the item master, jobs, quotes, SOPs, approvals, settings and the audit log, with Row Level Security. Apply the migrations to Supabase, add my owner login, push, and confirm I can sign in on my phone.

STAGE 8 · The look
Tell me to do section 03 of the Starter Guide now, and wait until docs/design is ready and I paste the "set the look" prompt.

STAGE 9 · The sessions
1. Write docs/SESSIONS.md: the twelve-week build order from the blueprint and section 05 of the Continue Building Guide, how many builders run at once on my plan, and the rule that each builder works in its own worktree on its own branch and hands over to HQ.
2. Write docs/build-sheets/sys-01-issue-slip-app.md for the Vitalis Issue Slip App: what it does, what it must never do, the tables it adds, its screens, and its done-when. Wait for my approval.
3. Write the opening prompt for the SYS-01 Issue Slip App builder session and for the writing session (Store SOP and Work Ownership SOP) into docs/session-prompts/. Show each to me in its own box, ready to paste.
4. Walk me through opening each session: in the Code tab, start a new session on this same vitalis-os folder, name it as you say (with its own worktree if the app offers it), paste the prompt, send. Then tell me how to switch between sessions and come back to HQ.
5. Finish by telling me to switch to the Continue Building Guide.
No feature code before my OK on the build sheet.
```
