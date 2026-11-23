Buildour AI · Vitalis Power EngineeringStarter Guide · Rev A

# VITALIS OS STARTER GUIDE

Prepared for **Jasveen Singh**, Vitalis Power Engineering Private Limited. You install one app and paste one prompt. **Claude then opens every website for you, one by one**, and walks you through GitHub, Supabase and Vercel, makes your app live, helps you **choose the look**, and opens the build sessions.

Install  
Claude–– Folder and  
docs–– Starter  
prompt–– Claude guides  
every account–– Live on  
your phone–– Sessions  
start

[TABLE]

The starter prompt comes as a separate message · Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

00

READ THIS FIRST

Five minutes

You named three problems in your own words: *“Followups, store management, performance evaluation”*, *“Manpower management”* and *“Store Management”*. Your blueprint answers with one custom system in three pieces on one set of data, built over twelve weeks, **store first**: nothing in without a GRN, nothing out without a numbered issue slip tied to a job. Then every job step gets a named owner and a target date. Then your ten quotes a month become rows with follow-ups drafted for your tap.

**Nothing here rates a worker, sets a price or changes stock on its own.** Every system drafts, records and shows; you and your supervisors decide.

**No coding is needed, and no setup knowledge either.** Claude Code writes every line and, in the starter prompt, opens each website in your browser and tells you exactly what to click. If you do not understand something, type `explain this to me in simple words`. If a page looks different from what Claude describes, take a screenshot, paste it in, and type `this is what I see, what do I click?`

Pro or Max? How to check

Open the Claude app → your name (bottom left) → **Settings → Billing**. It says **Pro** or **Max**. Both work. On **Pro**, Claude runs one build session at a time and may ask you to pause when you reach your usage limit; on **Max**, two build sessions can run side by side. Tell HQ which one you have when it asks.

What it costs, honestly

Your Claude plan builds everything. GitHub is free. **Supabase** is free to start; move to Pro (about \$25 a month) before the store and floor use it daily, for backups. **Vercel Pro**, about \$20 a month, because the free Hobby plan is for personal projects only. Later, only if you choose: the **WhatsApp Business API** for sending follow-ups from the system, and the **Claude API** for the AI employees in months four to twelve. Claude always tells you the cost and waits for your yes.

STEP 1

You do this

**Install the Claude desktop app, on the office computer you will build from**

1.  Go to **claude.com/download**, download the app for your computer (Windows or Mac) and install it.
2.  Open it and sign in with the email you used for your Claude subscription.
3.  Click the **Code** tab at the top. This is **Claude Code**, the builder. Everything else is installed by Claude, with your permission, in Step 3.

STEP 2

You do this

**Make the folder, and the docs folder inside it**

1.  Make one folder for life: `Documents\vitalis-os`. Every Vitalis system goes in here, never in a second folder.
2.  Inside it, make a folder called `docs`, and put these three PDFs in it:
    - the **AI Systems Blueprint**
    - this **Starter Guide** (it includes the look, section 03)
    - the **Continue Building Guide**
3.  Inside `docs`, make a folder called `samples` and put in what you have today: photos of a few pages of the **store register** (the kaccha register), a few **issue slips** and **inward challans**, one or two **job cards** or job lists, and your recent **quotes** (PDFs or WhatsApp screenshots). If something is not ready, HQ puts it on your list.
4.  **Never put** a password or a secret key in `docs`. Claude tells you where those go.

What it looks like

`Documents\vitalis-os\docs\` AI Blueprint.pdf · Vitalis Starter Guide.pdf · Vitalis Continue Building Guide.pdf · `samples\` · later `design\`

STEP 3

Paste to Claude Code

**Open HQ and paste the starter prompt**

1.  In the Claude app, **Code** tab, choose the folder `vitalis-os` and start a new session. Name it `HQ`. HQ is your main session: it holds the whole picture, sets everything up, and later gives you the prompt for every other session.
2.  Paste the **Vitalis Starter Prompt** you were sent, and send.
3.  HQ works in stages and stops after each one. Read what it says, do what it asks, and type `OK` to go on. One sitting of three to four hours is best; if you stop, come back to HQ and type `where were we?`

### What HQ walks you through, one by one

| Stage              | What happens                                                                                                                                                                                                                                                                                           | What you do                                                                                |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Tools**          | HQ checks your computer and installs Node.js, Git and the GitHub command tool, one at a time.                                                                                                                                                                                                          | Read each one-line request and press **Allow**.                                            |
| **GitHub**         | HQ opens github.com: you sign up on the company email and turn on two-factor. HQ signs this computer in to GitHub, creates the private repository `vitalis-os` and connects your folder to it. Then it asks you to type `/install-github-app` to install the **Claude GitHub app** on that repository. | Type your own email and password; press **Authorize** when GitHub asks.                    |
| **Supabase**       | HQ opens supabase.com: you sign in with GitHub, make the organisation, then the project `vitalis-os` in region **South Asia (Mumbai)**. HQ tells you which three values to copy and where to paste them.                                                                                               | Save the database password safely; paste the keys into the file HQ opens, never into chat. |
| **The app**        | HQ builds the empty Vitalis app, writes your rules into `CLAUDE.md`, and pushes it to GitHub.                                                                                                                                                                                                          | Read the rules back; say OK.                                                               |
| **Vercel**         | HQ opens vercel.com: you sign up with GitHub, import `vitalis-os`, and HQ walks you through every setting in the table below, then the deploy.                                                                                                                                                         | Click, check each setting, paste the keys.                                                 |
| **Live**           | HQ sets Supabase to accept sign-ins from your live address and adds your owner login.                                                                                                                                                                                                                  | Open the app on your phone; **Add to Home Screen**.                                        |
| **Rules and list** | HQ writes `docs/START-NOW.md` and builds the foundation, the Vitalis Shared Record.                                                                                                                                                                                                                    | Answer its questions one at a time.                                                        |
| **The look**       | HQ stops and sends you to section 03 of this guide.                                                                                                                                                                                                                                                    | Choose the look; hand it back.                                                             |
| **Sessions**       | HQ writes the plan, then gives you the opening prompt for the first build session and the writing session, and shows you how to open each one.                                                                                                                                                         | Open the sessions and paste.                                                               |

| Vercel setting        | What it should be (HQ checks each with you)                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Plan                  | **Pro** (commercial use). Hobby is for personal projects only.                                                              |
| Git access            | The Vercel GitHub app installed on **only** `vitalis-os`, not all repositories.                                             |
| Framework Preset      | **Next.js**. Root Directory left as it is.                                                                                  |
| Environment Variables | The three Supabase names HQ gives you, ticked for **Production, Preview and Development**.                                  |
| Production Branch     | `main` (Settings → Git).                                                                                                    |
| Function Region       | **Mumbai, India (bom1)**, next to your Supabase project (Settings → Functions).                                             |
| Deployment Protection | Vercel Authentication on **preview** addresses only, so test builds stay private and the live address works for your staff. |
| After deploy          | The `.vercel.app` address goes into Supabase → Authentication → URL Configuration as Site URL and Redirect URL.             |

**YOUR THREE RULES DURING SETUP:** you type every password yourself, in the browser, never in the chat. Keys go only into the file or the box HQ names. When Claude asks permission to run something, it shows one line saying what it does: read it, then press Allow. If anything looks wrong, stop and ask HQ.

03

STEP 4 · CHOOSE THE LOOK

The UI section · when HQ sends you here

Claude builds what you say, but it designs what you show it. Show it nothing and your storekeeper gets the average of every app on the internet: crowded, generic, and ignored. If issuing a slip in the app is slower than writing in the kaccha register, the register wins, and every board after it is empty.

4.1

You do this

**Collect.** On **pinterest.com** search `minimalist UI design web app`, `inventory app mobile clean` and `factory job tracking dashboard simple`. Download 10 to 15 screens your storekeeper and supervisors would understand at a glance. Skip anything crowded, dark or clever.

4.2

You do this

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: Vitalis Power Engineering Private Limited, a manufacturing business. My storekeeper will use the screens on a phone at the store counter to issue material against job numbers and to receive goods; my supervisors will use a phone on the shop floor to give each job step a name and close it with a photo; and I will use my phone to see stock, late jobs and my quotes, and to approve follow-ups. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex. Give me the best one to move ahead with.

4.3

You do this

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Make a folder `docs\design` and save the images and the .md file in it. If the direction comes back too narrow (“an inventory app”), correct it: *“This is the whole Vitalis business: store, job cards on the floor, and quotes.”*

4.4

Paste to HQ

**Hand it over.**

Paste · HQ · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03, and build one sample screen, the Issue Slip screen with dummy items and jobs, so I can see the look on my phone before any system is built. Wait for my OK, then carry on with the sessions stage.

### Your main screens, one question each

| System                   | Screen and its one question                                            | Main button       | Who, on what                |
|--------------------------|------------------------------------------------------------------------|-------------------|-----------------------------|
| SYS-01 Issue Slip App    | **Issue:** “which item, how many, for which job, to whom?”             | Issue slip        | Storekeeper, phone          |
| SYS-01 Issue Slip App    | **Receive:** “which challan came in, and is it a GRN now?”             | Make GRN          | Storekeeper, phone          |
| SYS-02 Store Board       | **Stock:** “what is below reorder, what is dead, what does not match?” | Open the red item | You; storekeeper            |
| SYS-03 Job Card Tracker  | **My steps:** “which step is mine, by when?”                           | Start / Finish    | Worker or supervisor, phone |
| SYS-04 Floor Board       | **The floor:** “which steps are late, held or have no owner?”          | Assign            | Supervisor; you             |
| SYS-05 Follow-up Tracker | **Quotes:** “which of this month’s quotes is due a follow-up today?”   | Log follow-up     | You                         |
| SYS-07 Follow-up Nudge   | **Waiting for my tap:** “which drafted messages are ready to send?”    | Send / edit       | You, phone                  |

### Vitalis screen rules

- **Counter-fast.** Issuing a slip takes fewer taps than writing it in the register: item picked from the list, job number remembered, quantity typed once.
- **Works on weak signal.** Store and floor screens save on the phone and send when the signal returns, and say so (“saved, will send”).
- **Photo closes a step.** A job step is finished with one photo, not a paragraph.
- **No ratings on any screen.** The boards show who held which step; they never score, rank or pay anyone.
- **Stock never changes silently.** A count difference shows as a variance note waiting for your signature.
- **Red, amber, green mean only one thing:** late or short, waiting, done. Red at the top.
- **Hindi, Punjabi or English labels, per person,** if your team reads one more easily: tell HQ.

| The five screen laws                 | Check every screen Claude shows you                                                             |
|--------------------------------------|-------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.           |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                  |
| **3 · Consistency is trust**         | The same thing looks the same everywhere: an item, a job, a quote, a red flag.                  |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the job, the storekeeper. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a plain message.                             |

**THE TWO-MINUTE RULE:** your storekeeper opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the person. The real test: hand the phone to the storekeeper and watch, without helping.

STEP 5

You do this

**Switch to the Continue Building Guide when all of this is true**

- The app opens on your phone at its `.vercel.app` address and is on your home screen.
- The GitHub repository `vitalis-os` is **private**, has the Claude GitHub app, and the Supabase project is in **Mumbai**.
- Every Vercel setting in the table above is checked; the three keys are only in `.env.local` and Vercel.
- `CLAUDE.md` holds your rules (page R2), and `docs/START-NOW.md` lists what waits on you.
- The foundation (the Vitalis Shared Record) is in Supabase, and you can sign in on your phone.
- `docs/design/` holds your look, and CLAUDE.md says every screen follows it.
- Your first build session (Issue Slip App) and the writing session (Store SOP) are open with HQ’s prompts.

Then open section 02 of the Continue Building Guide, **Every sitting**. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box. Longest first.

| \#  | Item                                                                                                                                                                                  | Owner                            | Needed for         |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|--------------------|
| 1   | **Walk the rack** with the storekeeper and build the item master as it stands: item, unit, location, reorder level and last supplier for each item.                                   | Jasveen with the store in-charge | Weeks 1 to 2, F-00 |
| 2   | **Your three guardrails in your own words:** what AI may do alone, what a person signs off, what is never automated. Until then the careful default holds.                            | Jasveen                          | Week 1             |
| 3   | **The three clarifying questions**, in writing: do follow-ups mean customers, the team, or both; how a late job reaches you today and who you ask first; which store pain hurts most. | Jasveen                          | Week 1             |
| 4   | **The Store SOP and the Work Ownership SOP** in plain words.                                                                                                                          | Jasveen                          | Weeks 1 to 2       |
| 5   | **Your hours a week** for the build, any deadline, and your busy season, so the twelve weeks fit around them.                                                                         | Jasveen                          | Week 1             |
| 6   | **The money path** from enquiry to final payment, and the **people map**: owner, managers, who does the work, where.                                                                  | Jasveen                          | Week 2             |
| 7   | **The figures not stated:** orders a month, win rate, order value, sales cycle, repeat customers, headcount.                                                                          | Jasveen                          | Before any target  |
| 8   | **The first full physical count**, laid against the book item by item.                                                                                                                | Store in-charge                  | Weeks 3 to 4       |
| 9   | **The first supervisor** to run the Job Card Tracker on one floor.                                                                                                                    | Jasveen                          | Week 5             |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, this repository (vitalis-os), this Supabase project (Mumbai) and this Vercel project are the only ones Vitalis OS will ever have; every system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; Jasveen sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING LEAVES OR CHANGES THE BOOK: every outbound message is sent by Jasveen’s tap; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys and logins live only in .env.local and Vercel’s settings, never in code, in chat, in docs or on GitHub. 6 · NUMBERS ARE COUNTED, NEVER GUESSED: stock, consumption and dead-stock value come from slips, GRNs and counts by exact tested rules; AI reads, drafts, records and shows, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Guardrails (careful default until Jasveen writes his own).** Jasveen did not answer the three guardrail questions; these defaults stand until he does, and HQ must replace them with his own words when he gives them. AI may act alone only to draft, record and show: draft follow-ups, GRNs, issue slips, pick lists and morning summaries; read replies and file pending items against a quote or step. A person signs off: every outbound message is sent by Jasveen’s tap; every requisition is approved before any enquiry reaches a supplier; every stock adjustment, write-off or variance correction is signed before the book changes; any reassignment of a step from one person to another is confirmed by the supervisor or Jasveen. Never automated: pricing and negotiation (every rate, discount, payment term, supplier rate and delivery promise); performance evaluation (rating a worker, wages, overtime, moving a person between jobs); book stock changes without a signed variance note.

**Vitalis rules.** Nothing enters the store without a GRN and nothing leaves without a numbered issue slip carrying an item, a job number and the collector’s name. Every job step has a named owner and a target date. The boards show; they never rate a worker, set wages or move a person. No figure appears on a board that was not entered by Vitalis staff. Dead stock is valued only at the last purchase rate once rates exist in the record. Store and floor screens work offline and sync. Only two figures were given (10 leads, 10 quotes a month): count everything else, never assume it, never hard-code a figure. docs/samples never goes to GitHub. Build in the blueprint’s order; a system starts only when Jasveen approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Jasveen can skip this page

### Stack and setup

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for photos and challans) through `@supabase/ssr`, project region South Asia (Mumbai); deployed on Vercel from `main` with Function Region Mumbai (bom1), a preview for every branch, and Vercel Authentication on previews only. GitHub repository `vitalis-os`, private, with the Claude GitHub app installed. Mobile-first web app added to the home screen; store and floor screens save offline and sync. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; later `WHATSAPP_*`, `CRON_SECRET`, `ANTHROPIC_API_KEY` only with Jasveen’s yes; `.env.example` holds names only. When guiding setup: open each website in Jasveen’s browser one at a time, describe exactly what to click, never ask for a password or key in chat.

### F-00 Vitalis Shared Record: the starting shape

**profiles** (name, mobile, role owner / store / supervisor / worker / office, language, active); **items** (item master: name, unit, location, reorder level, last supplier and contact, last purchase rate when known); **jobs** (job number, customer, quote number, status); **quotes** (quote number, customer, date, value as entered); **sops** (Store SOP, Work Ownership SOP, versioned); **approvals**; **settings** (automation switch off by default); **audit_log** (append only). The job number and the quote number are the two keys every tracker writes against. Slips, GRNs, job steps and follow-ups come in their own phases. Row Level Security: Jasveen sees all; the storekeeper sees the store; supervisors see their floor’s jobs; nobody but Jasveen changes book stock.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; applies migrations in order and merges finished work; never builds a system itself. It writes the opening prompt for every other session into `docs/session-prompts/`, shows it to Jasveen in its own box, and tells him exactly how to open that session in the Code tab.
- **Builders**, one at a time on Claude Pro and at most two on Max, one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing session** for the SOPs and skills (Store SOP, Work Ownership SOP, the follow-up message rhythm): only `docs/` and `content/`; no price in any draft.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Jasveen Singh · Vitalis Power Engineering Private Limited · traces to blueprint BOA-2026-VIT-01 Rev A (blueprint audit 22.11.2026).  
Stack fixed: Claude Code, Next.js, Supabase (Mumbai), Vercel, GitHub.
