Buildour AI · Manshu ComtelStarter Guide · Rev A

# MANSHU OS STARTER GUIDE

Prepared for **Mahendra Manerikar**, Manshu Comtel Pvt Ltd. From a Claude plan and nothing else to **a live app on your phone**: GitHub, Supabase and Vercel made and connected, your rules written, **your look chosen** and the Panel Estimator planned. Do it once, in one sitting.

Install–– Three  
accounts–– Folder and  
docs–– Starter  
prompt–– Live on  
your phone–– Choose  
the look

[TABLE]

The starter prompt comes as a separate message · Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

00

READ THIS FIRST

Five minutes

Your test for this system is your own: you can leave for a week and nothing stops. Your blueprint gets there in twelve weeks, one system at a time, along one chain: the estimate decides the BOQ, the BOQ decides the material, and the material decides the shop floor date. So the **Manshu Panel Estimator** comes first, inside your one-month deadline, and the Store Board and Route Card App later read from it. You keep the sales margin, the price, every requisition and every revised date; supplier payment is never touched.

**No software today means nothing to migrate.** The first records come from enquiries that already arrive by email and WhatsApp, so nobody has to change how they work on day one.

**No coding is needed.** Claude Code writes every line. Your job: answer its questions in your own words, say OK when you agree, and check what it built against SLDs, estimates and projects you know. If you do not understand something, type `explain this to me in simple words`. If something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. You can write to Claude in Marathi, Hindi or English.

What it costs, honestly

**Claude Pro** works to start; **Claude Max** is better once two sessions build side by side. GitHub is free. **Supabase** is free to start; move to Pro (about \$25 a month) before the engineers use it daily, for backups. **Vercel Pro**, about \$20 a month, for a business app. The Estimator reads SLDs (PDFs and photos) inside the app, which needs a **Claude API key**, billed per use with a monthly limit you set. Later: the **WhatsApp Business API** for the Intake Flow, and a printer for route cards with QR codes. Claude always tells you the cost and waits for your yes.

STEP 1

You do this

**Install three things on the office computer you will build from**

1.  **Claude desktop app** from **claude.com/download**. Sign in with your Claude Pro or Max account. Claude Code is its **Code** tab.
2.  **Node.js LTS** from **nodejs.org**. Accept every default.
3.  **Git** from **git-scm.com**. Accept every default. On Windows this also installs the window that lets you sign in to GitHub later.

If anything here goes wrong, carry on: the starter prompt checks all three and tells you exactly what to click.

STEP 2

You do this

**GitHub, Supabase and Vercel, in this order, on the company email**

**A · GitHub (keeps your code safe and private).**

1.  Go to **github.com** and press **Sign up**. Use the company email, choose a password, and a username such as `manshucomtel`. Verify the email. Choose the **Free** plan.
2.  Turn on two-factor authentication: your photo (top right) → **Settings → Password and authentication → Enable two-factor authentication**.
3.  Make the repository: the **+** (top right) → **New repository**. Name it `manshu-os`. Choose **Private**. Leave every box below unticked (no README, no .gitignore, no licence). Press **Create repository**.
4.  Copy the address shown at the top, `https://github.com/your-username/manshu-os.git`, and write it on the cover of this guide. You paste it into the starter prompt.
5.  Stay signed in to GitHub in this browser: the next two accounts use it.

**B · Supabase (the database).**

1.  Go to **supabase.com** and press **Start your project**, then **Continue with GitHub**, and press **Authorize**.
2.  If it asks for an organisation, name it `Manshu Comtel`, type **Company**, plan **Free**.
3.  Press **New project**. Name it `manshu-os`. Press **Generate a password** and save it somewhere safe (not in WhatsApp). Region: **South Asia (Mumbai)**. Press **Create new project** and wait about two minutes until it says it is ready.
4.  That is all for now. The starter prompt tells you which three values to copy from it, and exactly where each one is.

**C · Vercel (puts the app online).**

1.  Go to **vercel.com** and press **Sign Up**. When it asks how you will use it, choose the option for **commercial** or team use (the **Pro** plan; the free Hobby plan is for personal projects only).
2.  Choose **Continue with GitHub** and press **Authorize Vercel**.
3.  Do not import anything yet. You will do that in Step 5, when the repository has the app in it.

Keep these three tabs open

GitHub (your `manshu-os` repository), Supabase (your `manshu-os` project) and Vercel. During the starter prompt, Claude will ask you to click in each of them.

STEP 3

You do this

**Make the folder, and the docs folder inside it**

1.  Make one folder for life: `Documents\manshu-os`. Every Manshu system goes in here, never in a second folder.
2.  Inside it, make a folder called `docs`, and put these three PDFs in it:
    - the **AI Systems Blueprint**
    - this **Starter Guide** (it includes the look, section 03)
    - the **Continue Building Guide**
3.  Inside `docs`, make a folder called `samples` and put in what you have today: the **Legrand XL3 configuration tables** your engineers use; your **current purchase rates**; **three recent SLDs with their finished estimates**; and a few enquiry emails and WhatsApp messages with their SLDs. If something is not ready, the starter prompt puts it on your list.
4.  **Never put** a password, a Supabase secret key or an email login in `docs`. Claude tells you where those go.

What it looks like

`Documents\manshu-os\docs\` AI Blueprint.pdf · Manshu Starter Guide.pdf · Manshu Continue Building Guide.pdf · `samples\` · later `design\` (Step 6)

STEP 4

Paste to Claude Code

**The starter prompt**

1.  Open the Claude desktop app → **Code** tab → open the folder `manshu-os`.
2.  Start a new session and name it `HQ`. HQ is your main session: it holds the whole picture, and later it writes the prompt for every other session you open.
3.  Paste the **Manshu Starter Prompt** you were sent, with your GitHub repository address filled in, and send.
4.  HQ works in stages and stops after each one. Read what it says, answer its questions, and type `OK` to go on.

When HQ connects GitHub

A browser window opens asking you to sign in to GitHub and **Authorize** Git. Sign in with the account that owns `manshu-os` and press Authorize. This happens once.

When HQ asks for the Supabase keys

HQ creates a file called `.env.local` with three empty lines and tells you how to open it in Notepad. Copy each value from Supabase as HQ describes, paste it after the `=` sign, save, and tell HQ `done`. Never paste a key into the chat.

STEP 5

You do this

**Put it online** (when HQ reaches that stage)

1.  On vercel.com press **Add New… → Project**. Under **Import Git Repository**, press **Install** (or **Adjust GitHub App Permissions**), choose **Only select repositories**, pick `manshu-os`, press **Install**, and come back.
2.  Press **Import** next to `manshu-os`. Check **Framework Preset** says **Next.js**.
3.  Open **Environment Variables** and add the three names HQ gives you, with the same three values you put in `.env.local`.
4.  Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`. Give that address to HQ.
5.  In Supabase, open **Authentication → URL Configuration**, set **Site URL** to that address and add it under **Redirect URLs**, as HQ tells you, and save.
6.  Open the address on your phone and choose **Add to Home Screen**. From now on, every time HQ pushes, the live app updates itself.

03

STEP 6 · CHOOSE THE LOOK

The UI section · once, before the first screen

Claude builds what you say, but it designs what you show it. Show it nothing and your engineers get the average of every app on the internet: crowded, generic, and ignored. If the Panel Estimator is slower than their own spreadsheet, they go back to the spreadsheet, and every board after it is empty.

6.1

You do this

**Collect.** On **pinterest.com** search `minimalist UI design web app`, `engineering calculator app clean` and `production dashboard simple`. Download 10 to 15 screens your engineers and store would understand at a glance. Skip anything crowded, dark or clever.

6.2

You do this

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: Manshu Comtel Pvt Ltd, which makes Legrand XL3 electrical panels for project customers. My five office engineers use the screens on office computers to cost panels from customer SLDs, the store uses them to reserve and receive material, the floor supervisor scans route cards on a phone on the shop floor, and I use my phone to sign prices and requisitions and to see every project from anywhere. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex. Give me the best one to move ahead with.

6.3

You do this

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Make a folder `docs\design` and save the images and the .md file in it. If the direction comes back too narrow (“a cost calculator”), correct it: *“This is the whole Manshu business: enquiries, estimates, store, requisitions and the shop floor.”*

6.4

Paste to HQ

**Hand it over.**

Paste · HQ · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03, and build one sample screen, the Panel Estimator’s feeder list step with dummy data, so I can see the look on my computer and my phone before any system is built. Wait for my OK.

### Your main screens, one question each

| System                     | Screen and its one question                                                                   | Main button       | Who, on what       |
|----------------------------|-----------------------------------------------------------------------------------------------|-------------------|--------------------|
| SYS-01 Panel Estimator     | **New estimate:** “from this SLD, what are the feeders, the enclosure, the BOQ and the cost?” | Send for price    | Engineer, computer |
| Price and margin           | **Waiting for me:** “which cost sheets need my margin and price?”                             | Sign price        | You, phone         |
| SYS-03 Enquiry Board       | **Every enquiry:** “which stage, which engineer, how many days?”                              | Open enquiry      | You; engineers     |
| SYS-04 Material Allocation | **This project:** “what is reserved, what is short, by when?”                                 | Draft requisition | Engineer, store    |
| SYS-05 Store Board         | **The store:** “what is free, what is committed, what is late?”                               | Open the red item | Store; you         |
| SYS-06 Requisitions        | **To sign:** “which requisitions wait for my signature?”                                      | Sign              | You, phone         |
| SYS-07 Route Card App      | **At the station:** “which panel, which process, done?”                                       | Scan done         | Supervisor, phone  |
| SYS-08 Shop Floor Board    | **The floor:** “where is every panel, how many hours left, expected finish?”                  | Open panel        | You, anywhere      |

### Manshu screen rules

- **The margin field is locked.** It shows a lock and “Mahendra signs” to everyone else; the app never suggests a margin or a discount.
- **The SLD sits beside the draft.** Every feeder list and BOQ shows the customer’s SLD next to it, and any unclear feeder is marked for the engineer, never guessed.
- **Engineers’ screens work like a good spreadsheet:** keyboard first, rows editable, nothing hidden behind extra clicks.
- **Shop floor screens work in a factory:** one-handed, big buttons, readable in poor light, and they save offline and send when the signal returns.
- **Red, amber, green mean only one thing:** late, waiting, done. Red at the top.
- **Your screens show exceptions only:** what waits for your price or signature, what is late, what is short.

| The five screen laws                 | Check every screen Claude shows you                                                                     |
|--------------------------------------|---------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.                   |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                          |
| **3 · Consistency is trust**         | The same thing looks the same everywhere: an enquiry, a feeder, a panel, a red flag.                    |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: switchgear make, busbar material, today’s date. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a plain message.                                     |

**THE TWO-MINUTE RULE:** a new engineer opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the engineer. The real test: hand it to one engineer and watch, without helping.

STEP 7

You do this

**Switch to the Continue Building Guide when all of this is true**

- The app opens on your phone at its `.vercel.app` address and is on your home screen.
- The GitHub repository `manshu-os` is **private** and connected; the three keys are only in `.env.local` and Vercel.
- `CLAUDE.md` holds your rules (page R2).
- `docs/START-NOW.md` exists and every item has an owner.
- The foundation (the Manshu Project Record) is in Supabase, and you can sign in on your phone.
- `docs/SESSIONS.md` and the Panel Estimator build sheet are written, and you have read and corrected them.
- `docs/design/` holds your look, and CLAUDE.md says every screen follows it.

Then open section 02 of the Continue Building Guide, **Every sitting**. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box. Longest first.

| \#  | Item                                                                                                                                                                                                                    | Owner                            | Needed for        |
|-----|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|-------------------|
| 1   | **The XL3 costing sequence, written down** with the five engineers: SLD to feeder list, rating and busbar material to enclosure size, switchgear make to BOQ, then labour, OH and transport rates as a table you edit.  | Mahendra with the five engineers | Week 1, SYS-01    |
| 2   | **The Legrand XL3 configuration tables, current purchase rates, and three recent SLDs with their finished estimates**, in `docs/samples`, so the Estimator is tested against work already done.                         | Mahendra                         | Week 1, SYS-01    |
| 3   | **WhatsApp Business API number** for the Intake Flow: which number, a provider, Meta verification and approved templates. 1 to 3 weeks.                                                                                 | Mahendra                         | Week 3, SYS-02    |
| 4   | **One week of enquiry emails and WhatsApp messages** forwarded as they arrive, and which email system the company uses (Gmail, Outlook or other), so the Intake Flow is built on the real inbox.                        | Mahendra                         | Week 3, SYS-02    |
| 5   | **The office engineer who enters the store register once** in weeks 5 to 6, and the person who receives the reports and signs requisitions during your trial week away.                                                 | Mahendra                         | Week 5            |
| 6   | **Standard hours per process** for the route cards, entered once by the engineers.                                                                                                                                      | Engineers                        | Week 9, SYS-07    |
| 7   | **The money path after drawing approval:** order confirmation, requisition, production, dispatch, invoicing and payment, written in your words.                                                                         | Mahendra                         | Week 5            |
| 8   | **The numbers:** 45 quotes and 1 order a month beside 1 in 100 won; 1 order a month at 10000000 beside the ₹50 Lakh to 1 Crore band; the 65 headcount beside the five office engineers; and what you personally handle. | Mahendra                         | Before any target |
| 9   | **Your ten hours a week,** and the day signed prices and requisitions are reviewed.                                                                                                                                     | Mahendra                         | Every week        |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, this repository, this Supabase project and this Vercel project are the only ones Manshu OS will ever have; every system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; Mahendra sees everything; no shared passwords. 3 · A HUMAN YES BEFORE MONEY MOVES OR ANYTHING LEAVES: a person signs before money moves, before a customer hears a price or a date, and before any message leaves the office, except the enquiry acknowledgement; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys and logins live only in .env.local and Vercel’s settings, never in code, in chat, in docs or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: costs, quantities and enclosure sizes come from Mahendra’s configuration tables and rate tables by exact tested rules; AI reads, drafts, matches and flags, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Mahendra’s guardrails.** AI may act alone to: register the inquiry; create the enquiry record from email or WhatsApp; acknowledge to the customer that it is registered; draft the feeder list and BOQ for an engineer to check. A person signs off: price; sales margin, typed into a locked field by Mahendra or someone he names; the final quotation before it is generated; a purchase requisition before it leaves the office; any revised delivery date before it reaches a customer. Never automated: supplier payment; no system raises, approves or releases a payment to a supplier. Anything not named here falls to the careful default: a person signs before money moves, before a customer hears a price or a date, and before any message leaves the office.

**Manshu rules.** The sales margin is a locked field: only Mahendra, or someone he names in writing, can type it; the system never suggests a margin or a discount. Labour, OH and transport rates live in a table Mahendra edits, never in an AI’s memory. When an SLD is unclear (a missing rating, an unnamed switchgear make), the feeder is flagged for the engineer, never guessed. Stock reserved for one live project can never be allocated to another. Nothing goes to a supplier until the requisition is signed; supplier price and supplier payment stay human. Expected dates are shown to Mahendra only; no revised date reaches a customer from the system. The figures 50 leads, 45 quotes, 1 in 100, 1 order, 10000000 and the 65 headcount are as written and not yet confirmed: never hard-code them. docs/samples never goes to GitHub. Build in the blueprint’s order; a system starts only when Mahendra approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Mahendra can skip this page

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for SLDs, drawings and PDFs) through `@supabase/ssr`, deployed on Vercel from `main`, with a preview for every branch. Mobile-first web app added to the home screen; the Route Card App saves offline and syncs. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; then `ANTHROPIC_API_KEY` for reading SLDs in the Estimator (with Mahendra’s yes on the monthly limit); later `WHATSAPP_*`, the email connection, `CRON_SECRET`; `.env.example` holds names only. Money in exact decimals. Quotation and cost sheet export to PDF and Excel. Route cards printed with a QR code per panel.

### F-00 Manshu Project Record: the starting shape

**profiles** (name, role owner / engineer / store / supervisor / production, active); **enquiries** (customer, date received, source email or WhatsApp, attached SLD, assigned engineer, stage, stage since); **estimates** (enquiry, inputs: incomer rating, busbar material, switchgear make, IP rating, form of separation, paint shade, site location; feeder list; enclosure height, depth, width; BOQ lines with catalogue numbers and rates; fabrication parts; labour, OH, transport lines; cost total; margin locked; price signed by, signed at); **rate_tables** and **xl3_config** (edited by Mahendra only); **projects** (enquiry, drawing approved, finalised at); **approvals**; **settings** (automation switch off by default); **audit_log** (append only). Store, requisitions and route cards come in their own phases. Row Level Security: Mahendra sees all; engineers see estimates without the margin; margin writable only by Mahendra or his named person.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; applies migrations in order and merges finished work; never builds a system itself. It writes the opening prompt for every other session into `docs/session-prompts/` and shows it to Mahendra in its own box.
- **Builders**, at most two at a time, one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing session** for the skills (XL3 Costing Skill, Finalised-Project Material Skill, Route Card Skill): only `docs/` and `content/`; margin and price always blank.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Mahendra Manerikar · Manshu Comtel Pvt Ltd · traces to blueprint BOA-2026-MAN-01 Rev A (blueprint audit 10.10.2026).  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
