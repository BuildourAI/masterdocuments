# Saifunique Starter Guide: Day 1

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-SAI-S0 · REV A**

*Prepared for Dr. Fatima Saifee. From a Claude Max account and nothing else to a live app, the clocks started, your look chosen and your CRM planned as the first build.*

Install → Accounts → Folder → **Starter prompt** → Live on your phone → Choose the UI → Continue building

| | |
|---|---|
| **What you finish with** | An empty Saifunique app live on your phone. `CLAUDE.md` holding the house rules and your lab guardrails. A list of things to start today (`docs/START-NOW.md`). Your design direction in `docs/design/`. Your first build, the CRM, written up as a First Build Card. |
| **What you already have** | **Claude Max.** It gives you the Claude app and **Claude Code**, the builder. It does not give you GitHub, Supabase or Vercel. You create those three today, on the lab's email, in about thirty minutes. |
| **Your stack, fixed** | **Claude Code** writes the code · **Next.js** is the app · **Supabase** is the database · **Vercel** puts it online · **GitHub** keeps the code safe. Nothing else. All accounts are yours. |
| **Build order** | **Your CRM and sales funnel first:** Lead Card, Quote Chaser, Pipeline Board. Then the lab: Sample Tracker, Report Release Chain, Rehan. Then money: Cash Board, Collections Chaser and Munim. |
| **The two documents** | This guide, once (day 1) → **Saifunique Continue Building Guide**, every sitting after today, one system at a time. |
| **Time** | One sitting of about three hours. After that, your 5 hours a week. |
| **Sources** | AI Systems Blueprint BOA-2026-SAI-01 Rev A (blueprint audit 02.11.2026) and your Systems Brief. |

*Two voices, marked on every step: YOU DO THIS (a step in a browser or on your computer) · PASTE TO CLAUDE CODE (copy the whole box).*

---

## 00 · Read This First *(five minutes, before any click)*

You wrote that almost every important activity depends on you, and that there is no one centralised system to monitor the business. Your blueprint answers that with eight systems on one shared record, built **one at a time**, each finished and switched on before the next begins. Nothing in any of them ever touches a test result, a calibration record or an authorised signature.

> **YOUR CRM AND SALES FUNNEL: ALREADY IN YOUR BLUEPRINT, AND BUILT FIRST.** **The CRM** is the **Saifunique Lead Card**: every enquiry from phone, WhatsApp, LinkedIn, email or a walk-in becomes one card with a source, an owner, a hot, warm or cold tag, a next follow-up date and the customer's full history. **The sales funnel** is the **Quote Chaser**, which follows up every quotation on day 2, 4, 7 and 10 so none goes quiet, and the **Pipeline Board**, which shows enquiries by channel, quotations waiting, lost reasons and conversion against your own 40 of 100. These three are Phase 1, weeks 1 to 6. Later, **Rafiq**, an AI lead desk, captures enquiries from WhatsApp, email, LinkedIn and website forms by himself and builds target lists for marketing (months 4 to 6).

**Who builds.** If you hand the building to one trusted person, they sit with these two guides and do every step. Two things stay with you whoever builds: the accounts are opened on the lab's email, and every approval the blueprint gives you stays yours.

> **WHAT THIS COSTS, HONESTLY:** GitHub and Supabase are free at your size. Vercel's free plan is for personal, non-commercial use, so a business app belongs on **Vercel Pro**, about $20 a month (check vercel.com/pricing on the day). Your whole CRM and sales funnel runs on Claude Max with nothing extra: quotations come from your rate list, and follow-ups go from your team's WhatsApp in one tap. The **Claude API**, billed separately from Max, is needed only later, when Rehan, the Munim or Rafiq run by themselves on a schedule. Claude Code must tell you the cost and wait for your yes before adding it.

## STEP 1 · YOU DO THIS: Install three things on the computer you will build from

1. **Claude Code.** Install the Claude desktop app from claude.com/download and sign in with your Claude Max account; Claude Code is its **Code** tab. If you prefer a terminal, follow the install line at claude.com/claude-code instead.
2. **Node.js LTS** from nodejs.org. Accept every default.
3. **Git** from git-scm.com (on a Mac, the first time you type `git` it offers to install itself). Accept every default.

If anything here goes wrong, carry on. In Step 4 Claude checks all three and tells you exactly what to click.

## STEP 2 · YOU DO THIS: Three accounts, in this order *(all on the lab's email)*

1. **GitHub** (github.com): **Sign up** with the lab's email. Choose the free plan. Turn on two-factor authentication under **Settings → Password and authentication**. This is where your code lives, privately.
2. **Supabase** (supabase.com): press **Start your project** and **Continue with GitHub**. Press **New project**, name it `saifunique`, press **Generate a password** and save it somewhere safe, and pick the region **South Asia (Mumbai)**. Create it and wait two minutes. Then open **Project Settings → API Keys** and leave that tab open: Claude will ask you for the **Project URL**, the **publishable key** (`sb_publishable_…`) and the **secret key** (`sb_secret_…`). If your screen shows the older names, use **anon** and **service_role**. Treat the secret key like a bank password.
3. **Vercel** (vercel.com): **Sign up** and **Continue with GitHub**. Choose **Pro** for business use. This is what puts your app online.

## STEP 3 · YOU DO THIS: The folder, and the paper it learns from

1. Make one folder for life: `Documents\saifunique-os`. Every Saifunique system goes in here, never in a second folder.
2. Inside it make `docs`, and put two files in it: your **AI Blueprint.pdf** and this **Starter Guide.pdf**.
3. Inside `docs` make `samples`, and put in what you already have: your **rate list**, **one real quotation** you sent, and a photo or copy of the **enquiry register or Excel sheet** your admin staff keep. If something is not ready, the starter prompt puts it on your START-NOW list with an owner.
4. Open Claude Code on this folder: in the desktop app, open the **Code** tab and choose `saifunique-os`; in a terminal, go to the folder and type `claude`. Every sitting starts this way from now on.

## STEP 4 · PASTE TO CLAUDE CODE: The starter prompt

One message. Attach your **AI Blueprint.pdf** and this **Starter Guide.pdf** to the message (drag both into the chat box), then paste the whole box below. Claude reads the rules and the clocks from pages R1 and R2 of this guide, so there is nothing else to paste.

**PASTE · THE STARTER PROMPT**

> You are setting up the Saifunique platform from zero. I am Dr. Fatima Saifee, director of Saifunique Testing Lab LLP, a six-person NABL laboratory in Mumbai testing water, wastewater, chemicals, detergents, food and agriculture samples for industrial and institutional customers. I have Claude Max and nothing else set up; I opened GitHub, Supabase and Vercel accounts today. Attached, and saved in docs/, are my AI Systems Blueprint and my Starter Guide. Read the Starter Guide first: its reference pages R1 and R2 are written for you. Work in five stages, in order. At the end of each stage, tell me in simple words what you did, then **stop and wait for my OK**. Whenever you need something only I have, ask me, one question at a time.
>
> **Stage 1: Read.** Read the blueprint in full and the Starter Guide. Then tell me in ten lines or fewer: what Saifunique is, the three problems, and the build order, starting with my CRM and sales funnel. List the points the blueprint says are unsettled, including the unconfirmed figures in R2. Do not settle any of them yourself.
>
> **Stage 2: Set up.** (1) Check Node.js and Git. If either is missing, tell me exactly what to download and click. (2) Create a Next.js app with TypeScript in this folder and show me the local address. (3) Set up Git and make the first commit. The .gitignore must keep out .env.local and docs/samples, because customer, sample and rate details are confidential. (4) Help me create a **private** GitHub repository called saifunique-os and push to it; walk me through every login in the browser. (5) Create .env.local and ask me one at a time for my Supabase Project URL, publishable key and secret key. Use the names NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. Never repeat the keys back, never write them in any other file, never commit them. (6) Create CLAUDE.md holding the house rules and the Saifunique rules from page R2 of the Starter Guide, word for word. Read them back to me in five lines.
>
> **Stage 3: Start the clocks.** Create docs/START-NOW.md from page R1 of the Starter Guide: an owner, a start date and a tick box for each item, longest first. For each item, tell me the exact first action to take today. From now on, start every session by reading this file and reminding me of anything not yet ticked.
>
> **Stage 4: Go live.** Tell me the exact environment variable names for Vercel, then wait while I import the repository into Vercel and deploy (Step 5 of the guide). When I give you the live address, confirm the app opens and tell me the Supabase sign-in setting to update.
>
> **Stage 5: Plan the first build.** Following the blueprint, the first build is my CRM: **F-00 Saifunique Shared Record** with **SYS-01 Saifunique Lead Card + Enquiry and Quotation Skill**. The Quote Chaser and the Pipeline Board, the rest of my sales funnel, come straight after it. Write docs/FIRST-BUILD-CARD.md covering: the slice sentence ("When X happens, the system does Y, and Z sees it"); what is kept and what is deferred (channels, roles, documents, automation level, integrations); the guardrails that apply, copied word for word from the blueprint; the data it needs and who supplies it; and a done-when I can check on my phone. Quotation amounts come only from my approved rate list. Do not write any feature code yet. Finish by telling me to choose the UI (Step 6) before the first real screen is built, and to switch to the Saifunique Continue Building Guide.

## STEP 5 · YOU DO THIS: Put it online *(when Claude reaches Stage 4)*

1. On vercel.com press **Add New… → Project**, find `saifunique-os` and press **Import**. If it is not listed, press **Adjust GitHub App Permissions**, give Vercel access to that one repository, and come back.
2. Leave the framework (Next.js) as Vercel sets it. Open **Environment Variables** and add the three names Claude gave you, with the same three values from Supabase.
3. Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`. Give that address to Claude Code.
4. In Supabase, open **Authentication → URL Configuration**, set **Site URL** to that address and save, as Claude tells you.
5. Open the address on your phone and choose **Add to Home Screen**. From today, every time Claude commits and pushes, the live app updates itself.

## STEP 6 · YOU DO THIS: Choose the UI, before the first real screen

Claude builds what you say, but it designs what you show it. Show it nothing and your team gets the average of every app on the internet, which is what they already ignore. Ten minutes now decides whether your admin staff open the app or keep opening the register.

1. **Collect.** On pinterest.com, search `minimalist UI design web app`. Download 10 to 15 screens your admin staff would understand at a glance. Skip anything crowded, dark or clever.
2. **Let the strongest model choose.** Open a new chat in the **Claude app** (chat, not Claude Code), pick the strongest model in the model list, attach every screenshot, and paste the chooser prompt below.
3. **Get the direction in writing.** Re-upload only the winning one or two designs and ask: *"I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images."* Download the .md file.
4. **Hand it over.** Save the winning images and the .md file in `docs/design/`, then tell Claude Code: *"The design direction is in docs/design. Add a line to CLAUDE.md saying every screen follows it."*

**PASTE · CLAUDE APP CHAT · THE CHOOSER PROMPT**

> I have shared some powerful, minimal UI designs with you. I am building the interface for my company: we are Saifunique Testing Lab, a six-person NABL laboratory in Mumbai testing water, wastewater, chemicals, detergents, food and agriculture samples. The screens are used by admin staff and the technical manager on the lab desktop, by technical staff on their phones in the lab, and by me on my phone to approve and to see the whole business. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

> **IF THE DIRECTION COMES BACK TOO NARROW** ("a CRM dashboard"), correct it in one line: *"This is not only a CRM. It is the business centre of Saifunique: sales, the lab, money and the team, everything."*

| The five screen laws | What to check on every screen Claude shows you |
|---|---|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen. |
| **2 · One screen, one job** | Exactly one main button, visible without scrolling, in the one colour kept for action. |
| **3 · Consistency is trust** | The same thing looks the same on every screen. |
| **4 · The default is the decision** | Whatever is filled in again and again is already filled in: today's date, the channel, the assigned employee. |
| **5 · Silence is an error** | Every tap answers at once with a change, a tick or a message. |

**The two-minute rule:** a new employee opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the employee.

## STEP 7 · YOU DO THIS: Switch to the Continue Building Guide when all of this is true

- [ ] The app opens on your phone at its `.vercel.app` address, and it is saved to your home screen.
- [ ] The GitHub repository is **private**, and the three keys are only in `.env.local` and Vercel.
- [ ] `CLAUDE.md` holds the house rules and the Saifunique rules from page R2.
- [ ] `docs/START-NOW.md` exists and every item has a named owner.
- [ ] `docs/FIRST-BUILD-CARD.md` is written and you have read and corrected every line.
- [ ] `docs/design/` holds your UI direction, and CLAUDE.md says every screen follows it.
- [ ] The rate list is in `docs/samples/`, or START-NOW names the technical manager and a date for it.

> **ALL SEVEN TICKED:** put the **Saifunique Continue Building Guide** into `docs/` and use it from your next sitting onwards. If one is not ticked, paste it into Claude Code and say *"fix this before we continue."*

---

## R1 · The Clocks: for docs/START-NOW.md *(read by Claude Code in Stage 3)*

Things that take calendar time or wait on a person. Each one becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box.

| # | Item | Owner | Needed for |
|---|---|---|---|
| 1 | **Confirm the order and the figures.** Sales first and lab operations second, against the phase order you wrote. Settle the two conversion figures: 40 of 100 quotations convert, but orders are 35 a month. | Dr. Fatima | Day 1 |
| 2 | **The approved rate list and the industry-to-test map**, written once, so the Enquiry and Quotation Skill never invents an amount. | Technical manager | SYS-01 |
| 3 | **The hot, warm and cold rules** (NABL report needed, sample count, decision date), the qualifying questions, and your answers to the three objections: trust, pricing, competition. | Dr. Fatima | SYS-01 |
| 4 | **Who is who in the six:** each person's name and role (admin staff, technical staff, the marketing employee), for their own logins. | Dr. Fatima | SYS-01 |
| 5 | **One list of every enquiry from today**, whatever the channel, until the Lead Card is live. From then on, a card for every enquiry and no second entry into a register or Excel. | Admin staff | SYS-01 |
| 6 | **The follow-up wording** for day 2, day 4, day 7 and day 10, and the lost-reason choices: pricing, competitor, trust, delayed decision, requirement changed. | Dr. Fatima | SYS-02, SYS-03 |
| 7 | **Name the authorized technical signatory** in the Sample Tracker, so Reviewed and Delivered carry a real name from day one. | Technical manager | SYS-04, SYS-05 |
| 8 | **The lab facts:** the report template, the lab ID format, the test categories with their turnaround, and the third-party labs you use. | Technical manager | SYS-04, SYS-05 |
| 9 | **The rest of the money path**, enquiry to final payment: each station and who does it by hand today, where invoicing sits, and whether the invoice is raised at report release. | Dr. Fatima | SYS-07 |
| 10 | **Expense heads with a monthly budget**, and payment terms per customer type (immediate pay or 60 to 90 days). | Dr. Fatima | SYS-07, SYS-08 |
| 11 | **The calendar of bulk projects and audit weeks**, when building pauses. | Dr. Fatima | Planning |

## R2 · The Rules: for CLAUDE.md, word for word *(read by Claude Code in Stage 2)*

**Standing rules for everything ever built in this folder:**

**House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones Saifunique will ever have; every new system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; the director sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING REACHES A CUSTOMER: nothing is sent to a customer without a named person approving it, except message types the director has switched on after testing; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local and in Vercel's settings, never in code, in chat or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: amounts come only from the approved rate list and exact tested rules; AI reads, drafts and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Saifunique rules: the lab.** No system ever generates, modifies, approves or interprets a laboratory test result, alters raw analytical data, releases or signs a final test report, changes a calibration record, or falsifies or backdates NABL documentation. Results are entered by technical staff and reviewed by the authorized technical signatory. Nothing bypasses ISO/IEC 17025:2017, authorized signatories, confidentiality or quality procedures, and no technical decision is made without qualified personnel. A sample cannot be marked Delivered until the authorized technical signatory has marked it Reviewed.

**Saifunique rules: money and customers.** A responsible person (Dr. Fatima or the technical manager) approves every quotation, price change, discount, purchase order, payment, refund, financial transaction, customer commitment (including a promised report date) and important external communication before it goes. Quotation amounts come only from the approved rate list; any amount below it, or any discount, locks the card until Dr. Fatima approves. No reminder ever carries a new amount or a discount; if a customer asks for a lower price or a revised quotation, the follow-up stops and the card goes to Dr. Fatima. An invoice is marked paid only when Dr. Fatima or admin staff confirm the bank or UPI entry. No system makes a purchase or a financial commitment.

**Saifunique rules: what AI may do alone.** Capture and organise customer enquiries; classify leads hot, warm or cold; assign tasks to employees and send internal reminders; track quotation follow-ups; prepare draft customer responses; generate daily and monthly business reports; monitor pending payments and identify overdue invoices; track chemical stock and expiry dates; monitor calibration due dates; remind employees about training and audit schedules; highlight pending lab work. Everything else waits for a person. Recruitment, termination, salary changes and major business decisions stay with management, and no screen recommends an action on a person's job.

**Saifunique rules: how we build.** Customer, sample and result details are confidential: docs/samples and any export never go to GitHub. The figures less than 150 leads a month (a ceiling), 100 quotations, 40 of 100 converting, 35 orders, an order value of ₹2,000 to ₹30,000, 5 to 7 repeat customers and the split of the 6 people are unconfirmed, so never hard-code them. Build in the blueprint's order, CRM and sales funnel first, and do not start the next system until the current one meets its done-when. Building pauses during bulk projects and audit weeks. Start every session by reading docs/START-NOW.md and the latest note in docs/sessions/.

---

*Prepared for Dr. Fatima Saifee · Saifunique Testing Lab LLP · traces to blueprint BOA-2026-SAI-01 Rev A, Builder Guides 00–01 and the UI Guide. Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-SAI-S0 · REV A*
