# Start Guide: Day 1 Setup

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-BLD-00 · REV B**

*Day 1: from wherever you are, to a live app. Written so you can hand it to your Claude Code session together with your AI Systems Blueprint.*

| | |
|---|---|
| **Purpose** | Everything a builder does on day 1: accounts, the database project and its keys, the folder, the one big prompt that sets up the whole project, and putting the app online. Ends with an empty app live on your phone that updates itself on every push, and the five habits for every session after. |
| **Your build stack, fixed** | **Claude Code** writes the code · **Next.js** is the app · **Supabase** is the database · **Vercel** puts it online · **GitHub** keeps the code safe. Nothing else. All accounts are yours, on the business email; the finished system runs on your own Claude, paid by you. |
| **Who this is for** | The business owner (or the person they name) building their own systems from their finalised blueprint. Some readers start from zero today; some already have accounts, a repo, or a half-built app. The checkpoint table below tells each reader where to jump in. |
| **Time** | One sitting for the whole page if you start from zero; minutes if you are already partway. |
| **Prepared by** | BuildOur AI |
| **Series** | Builder Guide 00 of 04. After this: 01 Pick Your First System · 02 The Build Sheet · 03 The Six House Rules · 04 Test, Trust, Then Turn It On. |

> Two voices, marked on every step. **YOU DO THIS**: a browser or machine step only a human can do. **PASTE TO CLAUDE CODE**: a ready prompt; copy the whole block and let Claude work.

---

## 0.0 · Where Are You? *(find your entry point)*

| Your situation today | Start at |
|---|---|
| Nothing yet: no accounts, nothing installed | Step 1 |
| Accounts exist (from the Sunday sessions) but no project for this build | Step 2 |
| Claude Code already runs in a folder for this build, but nothing is online | Step 4 |
| An app is already live on Vercel with Supabase connected | Go to Builder Guide 01. Paste the six house rules (Builder Guide 03) into your CLAUDE.md first if it does not have them. |
| You built something yourself before this program (a no-code app, a local program) | Go to Builder Guide 01 and read its branch note. Your first build is making that thing real, not starting a new one. |

## 0.1 · STEP 1 · YOU DO THIS: the accounts *(skip any you already have)*

1. **GitHub** (github.com): where your code lives, privately. Create the account with the **business email**, switch on two-factor authentication.
2. **Supabase** (supabase.com): your database. Sign in **with your GitHub account** (one button, no new password).
3. **Vercel** (vercel.com): puts your app online. Also sign in **with GitHub**.
4. **Claude Code**: install it on your computer per the instructions at claude.com/claude-code and sign in with your Claude account. This is the account that builds and later runs your system, paid by you.
5. **Node.js and Git**: two free tools Claude Code needs on your machine. Install Node.js LTS from nodejs.org and Git from git-scm.com, accepting the defaults. If anything goes wrong here, finish Step 3 and let Claude fix it: it can check and repair this for you.

## 0.2 · STEP 2 · YOU DO THIS: the database project and its three keys

1. In Supabase: **New project**. Name it after your business. Region: the one nearest you (Mumbai for India). Let it generate a strong database password and save that password in a safe place.
2. Open **Project Settings → API** and keep this page open. You will see three values: the **Project URL**, the **anon key**, and the **service_role key**. You will paste them in Step 4 when Claude asks. Treat the service_role key like a bank password: never message it to anyone, never put it in a file Claude commits.

## 0.3 · STEP 3 · YOU DO THIS: the folder and the session

1. Make one folder for this build, named after your business, for example `Documents\mybusiness-os`. Everything lives here for life: this first system and every one after it.
2. Put a copy of your **AI Systems Blueprint** (the .md or .pdf) inside the folder.
3. Open a terminal in that folder and start **Claude Code**. From now on, every sitting starts exactly like this: open the folder, start Claude Code.

## 0.4 · STEP 4 · PASTE TO CLAUDE CODE: the day 1 prompt

Paste this whole block as your first message:

> You are setting up my business platform from zero. My AI Systems Blueprint is in this folder; read it so you know my business. Then do the following, one step at a time, telling me in simple words what you did after each step, and stopping to ask me whenever you need something only I have.
>
> 1. Check that Node.js and Git are installed and working. If anything is missing or broken, tell me exactly what to download and click, then check again.
> 2. Create a Next.js app with TypeScript in this folder, accepting standard defaults. Confirm it runs on my machine and show me the local address to open.
> 3. Set up Git in this folder and make the first commit.
> 4. Help me create a PRIVATE repository on my GitHub account named after this folder, and push the code to it. Walk me through any login step in the browser. The repository must be private.
> 5. Create a file called `.env.local` for my secret keys and make sure Git ignores it. Then ask me for three values one at a time: my Supabase Project URL, my anon key, and my service_role key. Put them in the file yourself. Never repeat the keys back to me in chat, never write them in any other file, and never commit them.
> 6. Create a `CLAUDE.md` file for this project. I will paste the house rules for it in my next message; wait for them.
> 7. When all of this is done, tell me the project is ready for Vercel and remind me to come back to the guide for Step 5.

Then paste the **six house rules from Builder Guide 03** as your second message, exactly as written there, and tell Claude: *"Put these in CLAUDE.md as standing rules for everything you ever build in this folder."*

## 0.5 · STEP 5 · YOU DO THIS: put it online

1. In Vercel: **Add New → Project → Import** the repository you just pushed. Vercel recognises the app automatically.
2. Before deploying, add the same three values from Step 2 as **Environment Variables** (Claude can tell you the exact names to use: ask *"what environment variable names does my .env.local use?"*).
3. Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`.
4. Open that address on your phone and add it to your home screen. From today, **every time Claude commits and pushes, the live app updates itself.** That is the whole publishing system; there is no other step, ever.

> **DAY 1 IS DONE WHEN:** the app opens on your phone at its live address; the repository on GitHub is private; your three keys sit only in `.env.local` and in Vercel's settings; and `CLAUDE.md` holds the six house rules. If any of these is not true, paste the failing point into Claude Code and ask it to fix it before you continue to Builder Guide 01.

## 0.6 · Every Session After Day 1 *(the five habits)*

1. **Plan first.** Start every piece of work with: *"Make a plan first and wait for my ok before touching any files."* Read the plan. If you do not understand a line, ask for simple words. Only then say go.
2. **One small finished thing per sitting.** An hour that ends with one working screen beats three hours that end with six half-things.
3. **Save the work.** When something works, say: *"Commit and push."* This both saves your progress and updates the live app. Do it at least once per sitting.
4. **When it breaks, paste the error.** Say: *"Explain this in simple words and fix it."* Being stuck is the normal texture of building, and this is the tool that answers at midnight.
5. **Close the sitting.** Ask: *"Summarise what we did today and what comes next, and save it in a notes file."* Next sitting starts by reading that note. Bring the note and your questions to the Sunday live class.

---

*Written for builders holding a finalised AI Systems Blueprint. Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub; every account, key and line of code belongs to the builder. Supersedes BOA-2026-BLD-00 Rev A.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-BLD-00 · REV B*
