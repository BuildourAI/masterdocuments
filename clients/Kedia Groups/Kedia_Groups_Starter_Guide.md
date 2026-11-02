# Kedia Starter Guide: Day 1

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-KED-S0 · REV A**

*Prepared for Rounakk Ajay Kedia. From a Claude Max account and nothing else to a live app, the clocks started, your look chosen and your first system planned.*

Install → Accounts → Folder → **Starter prompt** → Live on your phone → Choose the UI → Continue building

| | |
|---|---|
| **What you finish with** | An empty Kedia app live on your phone. `CLAUDE.md` holding the house rules and your guardrails. A list of things to start today (`docs/START-NOW.md`). Your design direction in `docs/design/`. Your first build written up as a First Build Card. |
| **What you already have** | **Claude Max.** It gives you the Claude app and **Claude Code**, the builder. It does not give you GitHub, Supabase or Vercel. You create those three today, on the business email, in about thirty minutes. |
| **Your stack, fixed** | **Claude Code** writes the code · **Next.js** is the app · **Supabase** is the database · **Vercel** puts it online · **GitHub** keeps the code safe. Nothing else. All accounts are yours. |
| **Build order** | Your blueprint's order: **Shared Record + Indent and PO Skill** first, then PO Reconciler, Procurement Board, Buy Plan to PO Flow, Entry Skill, Match Tool. One at a time. |
| **The two documents** | This guide, once (day 1) → **Kedia Continue Building Guide**, every sitting after today, one system at a time. |
| **Time** | One sitting of about three hours if you start from zero. Do it in one go. |
| **Sources** | AI Systems Blueprint BOA-2026-KED-01 Rev A (blueprint audit 30.10.2026) and your Systems Brief. |

*Two voices, marked on every step: YOU DO THIS (a step in a browser or on your computer, done by you) · PASTE TO CLAUDE CODE (copy the whole box).*

---

## 00 · Read This First *(five minutes, before any click)*

Your blueprint names six systems and one foundation for the first twelve weeks, and many more for the year. You will build every one of them, but **one at a time**, in the blueprint's order, each finished and switched on before the next begins. You tried ChatGPT once and it did not stick because it had nothing of yours to hold. This time every system is built from your real indents, pricing sheets, POs and masters, so the drafts come out the Kedia way.

**Who builds.** Your brief says you give 10 hours a week and work at management level. If you hand the building to one trusted person, they sit with these two guides and do every step. Two things stay with you whoever builds: the accounts are opened on the business email, and every signature the blueprint gives you stays yours.

> **WHAT THIS COSTS, HONESTLY:** Your blueprint buys no new business software in the first ninety days. The build stack is separate. GitHub and Supabase are free at your size. Vercel's free plan is for personal, non-commercial use, so a business app belongs on **Vercel Pro**, about $20 a month (check vercel.com/pricing on the day). Claude Max covers Claude Code; it does not cover the **Claude API**, which a system needs only when the app itself must read a PDF or message with nobody at the computer. That starts around System 4, and Claude Code must tell you the cost and wait for your yes before adding it.

## STEP 1 · YOU DO THIS: Install three things on the computer you will build from

1. **Claude Code.** Install the Claude desktop app from claude.com/download and sign in with your Claude Max account; Claude Code is its **Code** tab. If you prefer a terminal, follow the install line at claude.com/claude-code instead. Either way, you sign in with the same Max account.
2. **Node.js LTS** from nodejs.org. Accept every default.
3. **Git** from git-scm.com (on a Mac, the first time you type `git` it offers to install itself). Accept every default.

If anything here goes wrong, carry on. In Step 4 Claude checks all three and tells you exactly what to click.

## STEP 2 · YOU DO THIS: Three accounts, in this order *(all on the business email)*

1. **GitHub** (github.com): **Sign up** with the business email. Choose the free plan. Turn on two-factor authentication under **Settings → Password and authentication**. This is where your code lives, privately.
2. **Supabase** (supabase.com): press **Start your project** and **Continue with GitHub**. Press **New project**, name it `kedia`, press **Generate a password** and save it somewhere safe, and pick the region **South Asia (Mumbai)**. Create it and wait two minutes. Then open **Project Settings → API Keys** and leave that tab open: Claude will ask you for the **Project URL**, the **publishable key** (`sb_publishable_…`) and the **secret key** (`sb_secret_…`). If your screen shows the older names, use **anon** and **service_role**. Treat the secret key like a bank password.
3. **Vercel** (vercel.com): **Sign up** and **Continue with GitHub**. Choose **Pro** for business use. This is what puts your app online.

## STEP 3 · YOU DO THIS: The folder, and the paper it learns from

1. Make one folder for life: `Documents\kedia-os`. Every Kedia system goes in here, never in a second folder.
2. Inside it make `docs`, and put your **AI Blueprint.pdf** in it.
3. Inside `docs` make `samples`, and ask the back office for **five real sets**: a manufacturer offer, the indent made from it, the buyer pricing sheet and the manufacturer PO, plus the **manufacturer master**. Photos and PDFs are fine. If they are not ready today, the starter prompt puts them on your START-NOW list with an owner.
4. Open Claude Code on this folder: in the desktop app, open the **Code** tab and choose `kedia-os`; in a terminal, go to the folder and type `claude`. Every sitting starts this way from now on.

## STEP 4 · PASTE TO CLAUDE CODE: The starter prompt

Two messages. Paste Message 1 now. Paste Message 2 when Claude asks for the rules in Stage 2.

**PASTE · MESSAGE 1**

> You are setting up the Kedia Groups platform from zero. I am Rounakk Ajay Kedia, owner of Kedia Groups: textile and garment manufacturing, a wholesale desk, retail, and the EcomHub24 e-commerce arm with 10 brands, across a factory, a sales office, a back office and a warehouse. I have Claude Max and nothing else set up; I opened GitHub, Supabase and Vercel accounts today. Work in five stages, in order. At the end of each stage, tell me in simple words what you did, then **stop and wait for my OK**. Whenever you need something only I have, ask me.
>
> **Stage 1: Read.** Read docs/AI Blueprint.pdf in full, and look at what is in docs/samples. Then tell me in ten lines or fewer: what Kedia Groups is, the three problems, and the build order. List the points the blueprint itself says are unsettled: 5 out of 100 quotes versus 5 orders from 500 quotes; 5 orders at ₹50,000 against a ₹50 lakh to ₹1 crore turnover; who does the work in the 70 headcount; and the blank I left for what AI may do alone. Do not settle any of them yourself.
>
> **Stage 2: Set up.** (1) Check Node.js and Git. If either is missing, tell me exactly what to download and click. (2) Create a Next.js app with TypeScript in this folder and show me the local address. (3) Set up Git and make the first commit. The .gitignore must keep out .env.local and docs/samples, because the samples carry rates and party details. (4) Help me create a **private** GitHub repository called kedia-os and push to it; walk me through every login in the browser. (5) Create .env.local and ask me one at a time for my Supabase Project URL, publishable key and secret key. Use the names NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Never repeat the keys back, never write them in any other file, never commit them. (6) Create CLAUDE.md. I will paste the house rules and Kedia rules as my next message; put them in word for word, then continue to Stage 3.
>
> **Stage 3: Start the clocks.** Create docs/START-NOW.md: a checklist with an owner, a start date and a tick box for each item below, longest first. For each item, tell me the exact first action to take today. From now on, start every session by reading this file and reminding me of anything not yet ticked.
>
> 1. **Name one procurement approver below me, and confirm the accounts head** who signs vouchers. Without them every approval still ends at my desk. Owner: me.
> 2. **WhatsApp API access** for the PO approval step and the manufacturer send: which provider, who holds the login, and the message templates Meta must approve. 1 to 3 weeks. Owner: me with the build team.
> 3. **Five real sets** (offer, indent, buyer pricing sheet, manufacturer PO) and the **manufacturer master** in docs/samples. Owner: back office.
> 4. The **indent and PO numbering rules**, written once, and the **supplier and customer master with GST and TDS**. Owner: back office.
> 5. The **chart of accounts for each Kedia company**. Owner: accounts team.
> 6. **Same-day GRN and QC posting at the factory gate**, agreed with the factory and warehouse leads, and the columns they will post. Owner: factory and warehouse leads.
> 7. The **QC reject threshold** and the **dispatch delay days** for the Procurement Board. Owner: me.
> 8. **One company's Tally day book, Vasy transactions and last month's bank statement** for the first Match Tool run. Owner: accounts team.
> 9. **The blueprint's figures and blanks:** I confirm or correct the numbers and fill in what AI may do alone. Owner: me.
>
> **Stage 4: Go live.** Tell me the exact environment variable names for Vercel, then wait while I import the repository into Vercel and deploy (the guide's Step 5). When I give you the live address, confirm the app opens and tell me the Supabase sign-in setting to update.
>
> **Stage 5: Plan the first build.** Following the blueprint, the first build is **F-00 Kedia Shared Record** with **SYS-01 Kedia Indent and PO Skill** as its first piece. Build the skill as a Claude skill inside this project, so it runs in Claude Code on my Max account with no extra cost; it writes its drafts into the database, and the app shows them for checking and signing. Write docs/FIRST-BUILD-CARD.md covering: the slice sentence ("When X happens, the system does Y, and Z sees it"); what is kept and what is deferred (channels, roles, documents, automation level, integrations); the guardrails that apply, copied word for word from the blueprint; the data it needs and who supplies it; and a done-when I can check on my phone. The rate column always stays blank for a person to fill. Do not write any feature code yet. Finish by telling me to choose the UI (Step 6) before the first real screen is built, and to switch to the Kedia Continue Building Guide.

**PASTE · MESSAGE 2 · WHEN CLAUDE ASKS FOR THE RULES**

> **Put this in CLAUDE.md, word for word, as standing rules for everything ever built in this folder:**
>
> **House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones Kedia Groups will ever have; every new system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; the owner sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING LEAVES THE BUILDING: nothing goes to a buyer, a manufacturer or Tally without a named person approving it; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local and in Vercel's settings, never in code, in chat or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: totals, quantities and tax working come from exact tested rules; AI reads, drafts, matches and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.
>
> **Kedia rules.** No system sets, fills or suggests a rate, price or discount: every rate column stays blank until a person signs. Everything needs approval for now: indents, buyer pricing sheets, manufacturer POs, claims, vouchers and bank matches are drafts until a named person signs. Until I fill the blank in my blueprint, AI may only read, consolidate, draft, match and remind inside the business; nothing leaves the building and no figure becomes final on a machine's authority. Banks and payments are never automated: no system logs in to a bank, makes a transfer, sets a credit limit or writes off a balance; flows list what is due and a person pays. Every record carries the Kedia company it belongs to. Until I name a procurement approver and an accounts head, every approval comes to me; when I name them, record them here. The figures 500 leads, 500 quotes, 5 orders and 5 out of 100, and the 70 headcount, are unconfirmed, so never hard-code them. docs/samples and any export with rates, bank lines or party details never go to GitHub. Build in the blueprint's order, and do not start the next system until the current one meets its done-when. Start every session by reading docs/START-NOW.md and the latest note in docs/sessions/.

## STEP 5 · YOU DO THIS: Put it online *(when Claude reaches Stage 4)*

1. On vercel.com press **Add New… → Project**, find `kedia-os` and press **Import**. If it is not listed, press **Adjust GitHub App Permissions**, give Vercel access to that one repository, and come back.
2. Leave the framework (Next.js) as Vercel sets it. Open **Environment Variables** and add the three names Claude gave you, with the same three values from Supabase.
3. Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`. Give that address to Claude Code.
4. In Supabase, open **Authentication → URL Configuration**, set **Site URL** to that address and save, as Claude tells you.
5. Open the address on your phone and choose **Add to Home Screen**. From today, every time Claude commits and pushes, the live app updates itself.

## STEP 6 · YOU DO THIS: Choose the UI, before the first real screen

Claude builds what you say, but it designs what you show it. Show it nothing and your team gets the average of every app on the internet, which is what they already ignore. Ten minutes now decides whether your back office opens the app or keeps opening Excel.

1. **Collect.** On pinterest.com, search `minimalist UI design web app`. Download 10 to 15 screens your back office would understand at a glance. Skip anything crowded, dark or clever.
2. **Let the strongest model choose.** Open a new chat in the **Claude app** (chat, not Claude Code), pick the strongest model in the model list, attach every screenshot, and paste the chooser prompt below.
3. **Get the direction in writing.** Re-upload only the winning one or two designs and ask: *"I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images."* Download the .md file.
4. **Hand it over.** Save the winning images and the .md file in `docs/design/`, then tell Claude Code: *"The design direction is in docs/design. Add a line to CLAUDE.md saying every screen follows it."*

**PASTE · CLAUDE APP CHAT · THE CHOOSER PROMPT**

> I have shared some powerful, minimal UI designs with you. I am building the interface for my company: we are Kedia Groups, a textile and garment manufacturer with a wholesale desk, retail and the EcomHub24 e-commerce arm with 10 brands. The screens are used by the back office on computers, by factory and warehouse staff on their phones at the gate, and by me on my phone to approve. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

> **IF THE DIRECTION COMES BACK TOO NARROW** ("a procurement dashboard"), correct it in one line: *"This is not only procurement. It is the business centre of Kedia Groups: procurement, factory, accounts and EcomHub24, everything."*

| The five screen laws | What to check on every screen Claude shows you |
|---|---|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen. |
| **2 · One screen, one job** | Exactly one main button, visible without scrolling, in the one colour kept for action. |
| **3 · Consistency is trust** | The same thing looks the same on every screen. |
| **4 · The default is the decision** | Whatever is filled in again and again is already filled in: company, manufacturer, today's date. |
| **5 · Silence is an error** | Every tap answers at once with a change, a tick or a message. |

**The two-minute rule:** a new employee opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the employee.

## STEP 7 · YOU DO THIS: Switch to the Continue Building Guide when all of this is true

- [ ] The app opens on your phone at its `.vercel.app` address, and it is saved to your home screen.
- [ ] The GitHub repository is **private**, and the three keys are only in `.env.local` and Vercel.
- [ ] `CLAUDE.md` holds the house rules and the Kedia rules.
- [ ] `docs/START-NOW.md` exists, every item has a named owner, and naming the procurement approver has started.
- [ ] `docs/FIRST-BUILD-CARD.md` is written and you have read and corrected every line.
- [ ] `docs/design/` holds your UI direction, and CLAUDE.md says every screen follows it.
- [ ] `docs/samples/` holds the five real sets, or START-NOW names who brings them and by when.

> **ALL SEVEN TICKED:** put the **Kedia Continue Building Guide** into `docs/` and use it from your next sitting onwards. If one is not ticked, paste it into Claude Code and say *"fix this before we continue."*

---

*Prepared for Rounakk Ajay Kedia · Kedia Groups · traces to blueprint BOA-2026-KED-01 Rev A, Builder Guides 00–01 and the UI Guide. Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-KED-S0 · REV A*
