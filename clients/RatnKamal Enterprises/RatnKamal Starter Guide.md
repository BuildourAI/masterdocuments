Buildour AI · RatnKamal EnterprisesStarter Guide · Rev A

# RATNKAMAL OS STARTER GUIDE

Prepared for **Santosh Uttam Mali**, RatnKamal Enterprises. From a Claude plan and a GitHub repository to **a live app on your phone**, connected to Supabase and Vercel, your rules written, **your look chosen** and your first system planned. Do it once, in one sitting.

Install–– Accounts–– Folder and  
docs–– Starter  
prompt–– Live on  
your phone–– Choose  
the look

[TABLE]

The starter prompt comes as a separate message from Romana · Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

00

READ THIS FIRST

Five minutes

You wrote: *“My ultimate goal is to manage the entire RatnKamal Enterprises business through a centralized AI-powered management system.”* Your blueprint gets there in twelve weeks, one system at a time: first every enquiry gets the same qualification reply and the right catalogue pages, then every quotation comes from one screen with your approval on the price line, then enquiries from all six channels land in one place without typing, and by week twelve you open one 9 AM message instead of spending your morning hour collecting reports.

**Nothing you already pay for is replaced.** The custom tracking software keeps the Order Form, Job Card Sheet and batch tabs; Vyapar keeps the accounts; IndiaMART, TradeIndia, Justdial and Meta keep bringing enquiries. The CRM and the task manager you pay for and do not use come back into service. The new app is the layer that joins them.

**No coding is needed.** Claude Code writes every line. Your job: answer its questions in your own words, say OK when you agree, and check what it built against enquiries, quotations and batches you know. If you do not understand something, type `explain this to me in simple words`. If something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. You can write to Claude in Marathi, Hindi or English.

What it costs, honestly

**Claude Pro** works to start; **Claude Max** is better once two sessions build side by side. GitHub is free. **Supabase** is free to start; move to Pro (about \$25 a month) before staff use it daily, for backups. **Vercel Pro**, about \$20 a month, for a business app. Later: the **WhatsApp Business API** number (needed from week 5, when enquiries are answered on their own), lead access from IndiaMART, TradeIndia and Justdial on the plans you already have, and the **Claude API** when the app must draft with nobody at the computer. Claude always tells you the cost and waits for your yes.

STEP 1

You do this

**Install three things on the office computer you will build from**

1.  **Claude desktop app** from **claude.com/download**. Sign in with your Claude Pro or Max account. Claude Code is its **Code** tab.
2.  **Node.js LTS** from **nodejs.org**. Accept every default.
3.  **Git** from **git-scm.com**. Accept every default. On Windows this also installs the window that lets you sign in to GitHub later.

If anything here goes wrong, carry on: the starter prompt checks all three and tells you exactly what to click.

STEP 2

You do this

**GitHub, Supabase and Vercel, in this order, on the business email**

**A · GitHub (you have the repository; check it).**

1.  Sign in at **github.com**. Open your repository (the address on the cover).
2.  It must be **Private**. If it says Public: **Settings → General → Danger Zone → Change visibility → Make private**.
3.  Turn on two-factor authentication: your photo (top right) → **Settings → Password and authentication → Enable two-factor authentication**.
4.  Stay signed in to GitHub in this browser: the next two accounts use it.

**B · Supabase (the database).**

1.  Go to **supabase.com** and press **Start your project**, then **Continue with GitHub**, and press **Authorize**.
2.  If it asks for an organisation, name it `RatnKamal Enterprises`, type **Company**, plan **Free**.
3.  Press **New project**. Name it `ratnkamal-os`. Press **Generate a password** and save it somewhere safe (not in WhatsApp). Region: **South Asia (Mumbai)**. Press **Create new project** and wait about two minutes until it says it is ready.
4.  That is all for now. The starter prompt tells you which three values to copy from it, and exactly where each one is.

**C · Vercel (puts the app online).**

1.  Go to **vercel.com** and press **Sign Up**. When it asks how you will use it, choose the option for **commercial** or team use (the **Pro** plan; the free Hobby plan is for personal projects only).
2.  Choose **Continue with GitHub** and press **Authorize Vercel**.
3.  Do not import anything yet. You will do that in Step 5, when the repository has the app in it.

Keep these three tabs open

GitHub, Supabase (your `ratnkamal-os` project) and Vercel. During the starter prompt, Claude will ask you to click in each of them.

STEP 3

You do this

**Make the folder, and the docs folder inside it**

1.  Make one folder for life: `Documents\ratnkamal-os`. Every RatnKamal system goes in here, never in a second folder.
2.  Inside it, make a folder called `docs`, and put these three PDFs in it:
    - the **AI Systems Blueprint**
    - this **Starter Guide** (it includes the look, section 03)
    - the **Continue Building Guide**
3.  Inside `docs`, make a folder called `samples` and put in what you have today: the last few weeks of real enquiry WhatsApp threads (exported chats or screenshots); your catalogue photos, by size; your current **rate card**; one completed **Order Form** and one **Job Card Sheet** from the custom software; and the Team Leader checklist and ABCD grading you already wrote. If something is not ready, the starter prompt puts it on your list.
4.  **Never put** a password, a Supabase secret key or a software login in `docs`. Claude tells you where those go.

What it looks like

`Documents\ratnkamal-os\docs\` AI Blueprint.pdf · RatnKamal Starter Guide.pdf · RatnKamal Continue Building Guide.pdf · `samples\` · later `design\` (Step 6)

STEP 4

Paste to Claude Code

**The starter prompt**

1.  Open the Claude desktop app → **Code** tab → open the folder `ratnkamal-os`.
2.  Start a new session and name it `HQ`. HQ is your main session: it holds the whole picture, and later it writes the prompt for every other session you open.
3.  Paste the **RatnKamal Starter Prompt** that Romana sent you, already filled in with your GitHub address, and send.
4.  HQ works in stages and stops after each one. Read what it says, answer its questions, and type `OK` to go on.

When HQ connects GitHub

A browser window opens asking you to sign in to GitHub and **Authorize** Git. Sign in with the account that owns the repository and press Authorize. This happens once.

When HQ asks for the Supabase keys

HQ creates a file called `.env.local` with three empty lines and tells you how to open it in Notepad. Copy each value from Supabase as HQ describes, paste it after the `=` sign, save, and tell HQ `done`. Never paste a key into the chat.

STEP 5

You do this

**Put it online** (when HQ reaches that stage)

1.  On vercel.com press **Add New… → Project**. Under **Import Git Repository**, press **Install** (or **Adjust GitHub App Permissions**), choose **Only select repositories**, pick your repository, press **Install**, and come back.
2.  Press **Import** next to your repository. Check **Framework Preset** says **Next.js**.
3.  Open **Environment Variables** and add the three names HQ gives you, with the same three values you put in `.env.local`.
4.  Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`. Give that address to HQ.
5.  In Supabase, open **Authentication → URL Configuration**, set **Site URL** to that address and add it under **Redirect URLs**, as HQ tells you, and save.
6.  Open the address on your phone and choose **Add to Home Screen**. From now on, every time HQ pushes, the live app updates itself.

03

STEP 6 · CHOOSE THE LOOK

The UI section · once, before the first screen

Claude builds what you say, but it designs what you show it. Show it nothing and your team gets the average of every app on the internet: crowded, generic, and ignored. Your Sales Executive and Receptionist will use these screens between calls; if the Quote Builder is slower than a calculator and WhatsApp, they go back to the calculator, and every report after it is empty.

6.1

You do this

**Collect.** On **pinterest.com** search `minimalist UI design web app`, `quotation app clean` and `order tracking dashboard simple`. Download 10 to 15 screens your office team would understand at a glance. Skip anything crowded, dark or clever.

6.2

You do this

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: RatnKamal Enterprises, which makes GI metal doors and windows at its own factory and sells them to people building a house and to builders. My Sales Executive and Receptionist use the screens on an office computer and phone to answer enquiries, build quotations and follow up; my office screen shows every order and batch from enquiry to payment; I use my phone to approve prices, payment reminders and the day’s plan. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex. Give me the best one to move ahead with.

6.3

You do this

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Make a folder `docs\design` and save the images and the .md file in it. If the direction comes back too narrow (“a quotation tool”), correct it: *“This is the whole RatnKamal business: enquiries, quotations, orders, batches, bakaya and the daily plan.”*

6.4

Paste to HQ

**Hand it over.**

Paste · HQ · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03, and build one sample screen, the Quote Builder with dummy data, so I can see the look on my computer and my phone before any system is built. Wait for my OK.

### Your main screens, one question each

| System               | Screen and its one question                                                        | Main button       | Who, on what        |
|----------------------|------------------------------------------------------------------------------------|-------------------|---------------------|
| SYS-02 Quote Builder | **New quote:** “design, width, height, glass, colour: what is the quotation?”      | Send for approval | Sales Executive     |
| Approval queue       | **Waiting for me:** “which price lines, bakaya lists and day plans need my yes?”   | Approve           | You, phone          |
| SYS-03 Intake        | **New enquiries:** “who asked, on which channel, and who has not been answered?”   | Open enquiry      | Receptionist, Sales |
| SYS-04 Bakaya        | **Today’s bakaya:** “who owes what, and what was promised when?”                   | Approve list      | You; Receptionist   |
| SYS-05 Job Card      | **Sent to production:** “did the Job Card reach the Team Leader?”                  | Resend            | Office Boy, Sales   |
| SYS-06 Board         | **Enquiry to cash:** “where is every enquiry, quote, order and batch today?”       | Open the red item | Office screen; you  |
| SYS-08 Day Manager   | **9 AM:** “what needs my decision first today?” (a WhatsApp message, not a screen) | Approve           | You, WhatsApp       |

### RatnKamal screen rules

- **The price line stays empty until you approve it.** A quotation shows “waiting for Santosh” in amber until your tap; no rupee figure leaves before that.
- **Photos first.** The customer’s chosen design photo sits at the top of every quote and order, large.
- **Factory teams stay on WhatsApp.** Production, Powder Coating, Glass and Site Installation are asked and reminded on WhatsApp; they never need to learn a new screen.
- **Marathi, Hindi or English, per person.** Every label can show in the language each user chooses.
- **Channel and B2C or B2B on every enquiry,** so the 200 leads and 80 quotes count themselves.
- **Red, amber, green mean only one thing:** late, waiting, done. Red at the top.
- **Your screens show exceptions only:** what waits for your yes, what is late, which stock is below minimum.

| The five screen laws                 | Check every screen Claude shows you                                                                    |
|--------------------------------------|--------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.                  |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                         |
| **3 · Consistency is trust**         | The same thing looks the same everywhere: an enquiry, a quote, a batch, a red flag.                    |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, B2C or B2B, the Sales Executive. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a plain message.                                    |

**THE TWO-MINUTE RULE:** a new employee opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the employee. The real test: hand it to your Receptionist and watch, without helping.

STEP 7

You do this

**Switch to the Continue Building Guide when all of this is true**

- The app opens on your phone at its `.vercel.app` address and is on your home screen.
- The GitHub repository is **private** and connected; the three keys are only in `.env.local` and Vercel.
- `CLAUDE.md` holds your rules (page R2).
- `docs/START-NOW.md` exists, every item has an owner, and the Team Leader meeting has a date.
- The foundation (the One Lead to Cash Record) is in Supabase, and you can sign in on your phone.
- `docs/SESSIONS.md` and the first build sheet are written, and you have read and corrected them.
- `docs/design/` holds your look, and CLAUDE.md says every screen follows it.

Then open section 02 of the Continue Building Guide, **Every sitting**. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box. Longest first.

| \#  | Item                                                                                                                                                                                                                                                                                                                                         | Owner                        | Needed for        |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|-------------------|
| 1   | **WhatsApp Business API number:** which number RatnKamal will send from, a provider, Meta business verification and approved message templates. 1 to 3 weeks.                                                                                                                                                                                | Santosh                      | Week 5, SYS-03    |
| 2   | **The Team Leader meeting**, and the checklist reporting started by hand, as you planned.                                                                                                                                                                                                                                                    | Santosh                      | Week 1            |
| 3   | **Real enquiry threads,** catalogue photos by size and the **current rate card**, in `docs/samples`.                                                                                                                                                                                                                                         | Sales Executive with Santosh | Week 1, SYS-01    |
| 4   | **Logins and export access:** the custom tracking software (ask its developer for read or export access), Vyapar, the payment follow-up software, the unused CRM and task manager (name of each, and whether it has an API), and the lead feeds from IndiaMART, TradeIndia, Justdial and Meta. You place every login yourself where HQ says. | Santosh with Admin           | Weeks 3 to 5      |
| 5   | **The section cutting formulas** the custom software uses for the Job Card Sheet, so the Quote Builder uses the same arithmetic.                                                                                                                                                                                                             | Santosh                      | Week 3, SYS-02    |
| 6   | **Stock minimums** set in the custom software, and the name of the staff member who receives the purchase list.                                                                                                                                                                                                                              | Santosh with Accounts        | Week 9            |
| 7   | **The numbers:** confirm 200 / 80 / 45 / 35; the headcount (22 without you or 23 with you; the Office Boy and Accountant are not in the 22); and the repeat share of orders, which was given as a segment, not a figure.                                                                                                                     | Santosh                      | Before any target |
| 8   | **10 to 12 hours a week** for approvals and corrections, fixed in your calendar.                                                                                                                                                                                                                                                             | Santosh                      | Every week        |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, this repository, this Supabase project and this Vercel project are the only ones RatnKamal OS will ever have; every system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; Santosh sees everything; no shared passwords. 3 · NOTHING IMPORTANT WITHOUT SANTOSH: no price, discount, payment message, order change or final decision leaves the system without his approval; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys and logins live only in .env.local and Vercel’s settings, never in code, in chat, in docs or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: prices, totals, material and bakaya come from Santosh’s rate card, the custom software’s formulas and Vyapar by exact tested rules; AI reads, drafts, matches and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Santosh’s guardrails.** AI may act alone to: collect and prepare daily reports for Production, Powder Coating, Glass Installation and Site Installation; request daily work updates from employees and Team Leaders; send reminders to Team Leaders when work is incomplete or delayed; monitor pending orders, production progress and delivery schedules and prepare status reports; monitor raw material, accessories and stock and alert at the predefined minimum; record and categorise enquiries from every channel, share product information, photos and details on WhatsApp, and forward customer details to the concerned employee; prepare WhatsApp messages and call reminders for pending payments and notify the employee responsible; analyse employee and Team Leader performance and generate reports. A person signs off: pricing and negotiation; AI collects information, analyses data, suggests options and prepares documents; everything is presented to the business owner for approval; no important action is executed and no final decision taken without Santosh’s approval. Never automated: important financial transactions; final business decisions; financial commitments to customers; employee hiring or termination; human involvement and final approval always required.

**RatnKamal rules.** Nothing already paid for is replaced: the custom tracking software keeps the Order Form, Job Card Sheet and batch tabs; Vyapar keeps the accounts; the unused CRM and task manager are revived, not replaced. No draft carrying a rupee amount leaves without Santosh’s approval of the price. Bakaya reminders are drafts: the day’s list goes out only after he approves it; the system never promises, collects, commits or pays. Any change to a confirmed customer order is presented to Santosh and never executed by the system. Hiring, termination and salary decisions are never taken from the reports; they only inform him. Factory teams are reached on WhatsApp. Customer messages follow the language the customer wrote in: Marathi, Hindi or English. The figures 200 leads, 80 quotes, 45 out of 100, 35 orders and the 22 headcount are as written and not yet confirmed: never hard-code them. docs/samples never goes to GitHub. Build in the blueprint’s order; a system starts only when Santosh approves its build sheet, and each phase goes live only after his sign-off.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Santosh can skip this page

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for design photos and PDFs) through `@supabase/ssr`, deployed on Vercel from `main`, with a preview for every branch. Mobile-first web app added to the home screen. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; later `WHATSAPP_*`, `INDIAMART_*`, `TRADEINDIA_*`, `JUSTDIAL_*`, `META_*`, `CRM_*`, `CRON_SECRET`, `ANTHROPIC_API_KEY`; `.env.example` holds names only. WhatsApp sending only through the WhatsApp Business API with approved templates. The custom tracking software, Vyapar, the payment follow-up software and the CRM are read through whatever access each allows (API, export or shared sheet), decided with Santosh per system; nothing is written back into Vyapar. Scheduled jobs (8:30 AM checklist ask, 9 AM summary) as Vercel Cron calling protected routes.

### F-00 One Lead to Cash Record: the starting shape

**profiles** (name, mobile, role owner / sales / reception / office / accounts / admin / team_leader, department, language, active); **leads** (one id, channel WhatsApp / IndiaMART / TradeIndia / Justdial / Meta / website / site visit, B2C or B2B, name, mobile, door or window, approximate size, owner, status, CRM id); **quotes** (lead, design photo, width, height, glass, colour, accessories, price line empty until approved, approved by, sent at); **orders** (quote, Order Form id in the custom software, advance, Job Card id, batch numbers); **batches** (number, stage, stage since, daily target); **bakaya** (customer, amount from Vyapar, promised date, credit policy signed); **approvals** (what, requested by, decided by Santosh, when); **settings** (automation switch off by default); **audit_log** (append only). If the CRM Santosh already pays for has an API, each lead is also created there with the same id; if not, HQ asks him before choosing. Row Level Security: Santosh sees all; each role sees what its work needs; price fields writable only through Santosh’s approval.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; applies migrations in order and merges finished work; never builds a system itself. It writes the opening prompt for every other session into `docs/session-prompts/` and shows it to Santosh in its own box.
- **Builders**, at most two at a time, one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing session** for the Enquiry and Quote Skill and message templates: only `docs/` and `content/`; the rate card is read-only there and no price is ever written into a draft.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Santosh Uttam Mali · RatnKamal Enterprises · traces to blueprint BOA-2026-RAT-01 Rev A (blueprint audit 19.11.2026).  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
