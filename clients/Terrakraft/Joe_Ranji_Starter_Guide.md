# Starter Guide: Terrakraft

**BuildOur AI · Client Starter Guide · DWG NO. BOA-2026-TER-02 · REV A**

*Terrakraft · Prepared for Joe Ranji, Owner*

CRM export → **Claude Code** → Supabase → Vercel, live → Lead Board → 5 test leads

| | |
|---|---|
| **Business** | Human centric flooring for residences, hotels and offices, as a full stack service from supply to installation to after sales. Seven people, ₹10–50 lakh a month, 300 leads a month becoming 50 quotes and 20 orders. |
| **Your build stack, fixed** | **Claude Code** writes the code · **Next.js** is the app · **Supabase** is the database · **Vercel** puts it online · **GitHub** keeps the code. Your Terrakraft repository is already set up. Nothing else. |
| **Prepared by** | BuildOur AI |
| **Sources** | AI Systems Blueprint BOA-2026-TER-01 Rev A (blueprint audit 29.10.2026) and your Systems Brief. |
| **First build** | Phase 1: leads, one row each, first reply in minutes. The Job Record, the message library, the Lead Board and the Follow-up Flow. One phase, not four. |
| **Time budget** | 14 hours a week, as written in your brief. One hour a day building, six days; the rest for the sign-offs only you can give. |
| **How to use this guide** | Attach this guide and your blueprint to one Claude Code session and paste the prompt in section 03. Claude Code builds; you decide and test. Section 08 is written to Claude Code; you do not need to read it. |

*Build one phase, prove it on five leads, then widen. Nothing else in month one.*

---

## 00 · Start Here *(read this page before touching a computer)*

You wrote that you never want to *"manually delegate common tasks, monitor them and ensure its completing,"* and that you want the system to be *"scale ready"* for online sales and new stores in other cities. Both start in the same place: one true record for every lead, in a database you own. All nine pieces in your blueprint read and write that record. Build it first and build it right, and a second city plugs into it later instead of starting from zero.

You do not build all nine. You build **Phase 1** of your blueprint: one row per lead, a message library you sign, one board that shows every lead, and the **Follow-up Flow** that sends the first reply within minutes. The blueprint marks it as the first domino for a reason: of your 300 leads a month, 250 leave before a quote exists, and today the first reply waits until Nisha types it after you take the call. It runs on the CRM and WhatsApp Business API you already pay for, and the blueprint prices it conservatively at ₹15,000 and 30 hours a month returned. Everything else waits its turn.

**The one hour a day rule.** Your brief gives 14 hours a week. Spend one of them each day, six days, building. Keep the rest for the decisions only you can make: signing message templates, setting the follow-up rhythm, naming who takes over when a lead asks about price. Building is a skill like a language, and daily practice beats one long heroic session. A person who builds one small working thing every evening for a month will pass a person who tries to build everything in one weekend.

**Who does what.** Claude Code reads this guide and your blueprint, writes the code, saves it into your repository, and walks you through every click it cannot make itself. You do the three things it cannot do: hand it true data, state the rules in your own words, and test what it built against leads you know.

## 01 · Your Toolkit *(five tools, nothing else)*

**TOOL-01 · Claude Code · the builder**
- *What it is:* An AI that writes and edits the real code of your app through normal conversation. You describe the business rule in plain English. It writes the files, checks them, fixes its own errors, and saves them into your Terrakraft repository.
- *Your job:* Describe the rule, then read and test what it built. You are the manager, not the typist. When you do not understand something it made, tell it: `explain this to me in simple words`. It will, as many times as you need.
- *Note:* On day 4 it writes a file called CLAUDE.md into your repository holding your rules. Every later session reads it first, so a rule you set once holds forever.

**TOOL-02 · GitHub · the safe**
- *What it is:* Your private repository, the folder online where the code lives, with every past version kept. It is already set up and connected to Claude Code.
- *Your job:* Nothing day to day. Two rules: it stays private, and no password or key ever goes into it.

**TOOL-03 · Supabase · the database**
- *What it is:* Where your information actually lives: every lead, its stage, its consultant, its source, every message drafted and who approved it. Think of it as the filing room of the business, one that never loses a file. In month one it does not replace your CRM. It holds Terrakraft's own clean copy of every lead, so the board and the flow work from one true list.
- *Your job:* Create the project and paste in one setup file Claude Code writes (section 04). Your only check: find one lead you know by name and confirm the stage and consultant match reality.

**TOOL-04 · Next.js · the app itself**
- *What it is:* The screens your team opens on their phones: the Lead Board, each lead's page with its drafted reply, the template library you sign. It is a web app, so there is nothing to install from any store. Nisha, Antony and Vincent open a link and add it to the home screen, each with their own login.
- *Your job:* Say what each screen must show and who may see it. Claude Code writes it. Never accept a screen you would not hand to Nisha tomorrow morning.

**TOOL-05 · Vercel · where it lives online**
- *What it is:* The place your app is published, so it runs on your team's phones on site, in the field and in the office. Connected once to your repository, it publishes every later improvement by itself in about two minutes.
- *Your job:* Create the account, connect it once (section 04), then forget it exists. The free tier is enough for month one.

> **WHAT YOU ARE NOT USING, AND WHY:** Nothing new is bought in Phase 1. Your blueprint wires the CRM, ERP, WhatsApp Business API and Repuva you already pay for around one job record, and this app is the thin layer on top that makes them agree. No no-code builders, no second AI tool. You wrote that you want to stop paying for all of them. Your blueprint parks that decision to month 12, when you can see which ones still earn their fee once connected. Code in your own repository and data in your own database can be moved anywhere. That is what scale ready means.

## 02 · Week 1 Checklist *(day by day · one hour each)*

**D1 · Get the leads out of the CRM.** Ask Nisha for one export to Excel or CSV: every open lead with name, phone, type (residence, hotel or office), source, stage, consultant (Antony or Vincent), date of enquiry and date of last contact. Source must say where each lead came from: incoming call, Meta ads landing page, WhatsApp, social media, showroom walk-in, or an architect, designer or contractor by name. The same day, write down two names your blueprint does not have: **which CRM** you use and **which WhatsApp Business API provider**. *Owner: Nisha.*

**D2 · Open the doors.** Claude Code and your repository are already set up. Create your Supabase and Vercel accounts, signing in to both with the GitHub account that owns the Terrakraft repository. Build nothing today. The whole task is to get in the door and see the screens once, so that day 5 is not the day you fight sign-ups.

**D3 · Write your rules on one page.** Answer five questions in writing:
1. The first reply a new lead receives, word for word, once each for a residence, a hotel and an office lead.
2. The follow-up rhythm for a 90+ day cycle: on which days a quiet lead hears from you again, and after how many tries it is marked cold.
3. How a new lead is given to Antony or to Vincent.
4. The words that mean a person must take over. Start with price, rate, discount, offer and terms, then add any other words your customers use for these.
5. Your eight stage names, as your team says them. The blueprint lists them as incoming call, showroom visit, site visit, PI, negotiation, closure and supply, delivery, installation.

The AI can only build a rule you can state. This is the most valuable hour of your week.

**D4 · The one prompt.** Open Claude Code on your Terrakraft repository. Attach four files: your blueprint, this guide, the CRM export, your rules page. Paste the prompt from section 03. Read the plan it gives back, ask for simple words on any line you do not understand, then say go. It builds the first screen and the database setup file, and saves both to your repository.

**D5 · Connect Supabase and Vercel.** Follow section 04 step by step, with Claude Code in the same session talking you through it. At the end the app opens on your phone at its own address, and you are signed in as yourself.

**D6 · Load the leads, then test like a businessman.** Load the CRM export through the import screen Claude Code built. Open the Lead Board on your phone. Pick one lead you know well and check the stage, the consultant, the source and the days since last contact. If that one lead is true, your foundation is true, and everything later stands on it.

**D7 · Pick five, draft five, send none.** Choose your five test leads (section 07). Have the system draft a first reply or check-in for each from your rules page. Read every draft and send none of them yet. Write down what felt wrong in the wording, because you know how your customers speak and the machine does not. Keep that note under the title "rules I learned" and bring it to your weekly review.

## 03 · The One Prompt *(paste to Claude Code · day 4)*

This is the only setup message you send. Claude Code reads both documents and does the rest one step at a time, stopping to ask whenever it needs something only you have.

**01 · YOU DO THIS · Open the session and attach four files.** Open Claude Code on your Terrakraft repository and start a new session. Drag these into the message box, or use the attach button:
1. Your **AI Systems Blueprint** (PDF).
2. This **Starter Guide** (PDF).
3. The **CRM export** from day 1 (Excel or CSV).
4. Your **rules page** from day 3. A clear photo of a handwritten page is fine.

If your Claude Code screen has no attach button, upload the blueprint, this guide and the rules page on github.com into a folder named `docs` in your repository (**Add file → Upload files**, then **Commit changes**). Do not upload the CRM export, which holds customer phone numbers. Copy only its top row of column headings into your message.

**02 · PASTE TO CLAUDE CODE.** Paste this whole block as your first message, with the files attached.

> I am Joe Ranji, owner of Terrakraft. Attached are my AI Systems Blueprint, my Starter Guide, my CRM export and my rules page. This repository is where my business platform lives, for life.
>
> Read the Starter Guide first, especially section 08, "The Build Brief", which is written to you. It sets what you build, how you build it, and what you must never do. Then read the blueprint so you know my business.
>
> Then work one step at a time, telling me in simple words what you did after each step:
>
> 1. Tell me in five lines or fewer what you understood: my business, what we build first, and what we are not building yet. Then ask me the open questions from section 08 that you need answered now, one at a time.
> 2. Make a plan in small phases, each ending with something I can see on my phone. Do not write any code until I say ok.
> 3. Build the first phase exactly as section 08 describes, and save it to my repository.
> 4. Walk me through section 04 of the Starter Guide, connecting Supabase and Vercel, one step at a time. Wait for me to say done after each step. Never ask me to paste a secret key into this chat.
> 5. When the app opens on my phone, help me load my CRM export and check one lead I know.
> 6. Finish by writing what we did, what comes next and any open questions into NOTES.md, and save it.

> **READ WHAT IT SAYS BACK.** If its five-line summary is wrong about your business, correct it before you say ok. A wrong understanding on day 4 becomes a wrong screen on day 6.

> **EVERY SESSION AFTER DAY 4:** Open Claude Code on the same repository and start with: `Read CLAUDE.md and NOTES.md, tell me where we are and what is next, then make a plan and wait for my ok.` Work on one small finished thing per sitting. When it works, say `save it to the repository`, and the live app updates itself. When something breaks, paste the error or a screenshot and say `explain this in simple words and fix it`. Close every sitting with `update NOTES.md`.

## 04 · Connect Supabase and Vercel *(you do this · day 5 · about 30 minutes)*

By now Claude Code has filled your repository with the app and one setup file for the database. Now you give the app a database and a public address. Three things travel between the two sites: **one address and two keys**. They are typed only into Supabase's and Vercel's own screens. Never put them in a chat, an email or a file.

**S1 · Create the database project.** On supabase.com, sign in with GitHub and press **New project**. Name it `terrakraft`. For the database password, press **Generate** and save the password somewhere safe; you will rarely need it. Region: **South Asia (Mumbai)**. Press **Create new project** and wait a couple of minutes while it sets up.

**S2 · Build the tables.** In Supabase's left menu, open **SQL Editor** and press **New query**. In a second tab, open your repository on github.com, open the file `supabase/setup.sql` and press the **copy raw file** button. Paste it into the SQL Editor and press **Run**. You should see *Success*. Then open **Table Editor** in the left menu: the tables Claude Code named (leads, templates, messages, activity_log and others) are there. If a red error appears instead, copy its text into Claude Code, ask it to fix the file, then run it again.

**S3 · Find the address and the two keys.** Press the **Connect** button at the top of the project, or open **Project Settings → API Keys**. Find three values, but do not copy them anywhere yet:
- **Project URL**, which looks like `https://abcd.supabase.co`
- **Publishable key**, starting `sb_publishable_`
- **Secret key**, starting `sb_secret_` (press Reveal, or create one if none is listed)

If your screen shows the older names, **anon** is the publishable key and **service_role** is the secret key. Treat the secret key like a bank password: it goes only into Vercel, in step S6.

**S4 · Make sure the work is on main.** Vercel publishes whatever is on your repository's **main** branch. If Claude Code saved its work on a separate branch, it gives you a pull request link. Open it, press **Merge pull request**, then **Confirm merge**. If unsure, ask Claude Code: `is all the work on main?`

**S5 · Import the repository into Vercel.** On vercel.com, sign in with GitHub, then press **Add New… → Project**. Find the Terrakraft repository in the list and press **Import**. If it is not listed, press **Adjust GitHub App Permissions**, give Vercel access to that one repository, and come back. Leave the framework (Next.js) and the build settings exactly as Vercel fills them in.

**S6 · Add the three values, then deploy.** On the same screen, open **Environment Variables** and add three rows. Copy the names exactly:

| Name | Value, from step S3 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (or anon) |
| `SUPABASE_SECRET_KEY` | Secret key (or service_role) |

Press **Deploy**. About two minutes later Vercel shows a finished page with a picture of your app. Open it: your address ends in `.vercel.app`. Copy that address.

**S7 · Tell Supabase the address.** Back in Supabase, open **Authentication → URL Configuration**. Set **Site URL** to your `.vercel.app` address. Under **Redirect URLs**, add the same address followed by `/**`. Save. Login emails now point to your live app, not to a test address.

**S8 · Create your login.** In Supabase, open **Authentication → Users → Add user → Create new user**. Enter your business email and a password, and tick **Auto Confirm User**. Then paste the one line Claude Code gives you into the SQL Editor and run it; that line makes your login the owner. Open the live address on your phone, sign in, and choose **Add to Home Screen**. Nisha, Antony and Vincent get their logins the same way in week 2, each their own. Never a shared password.

> **CONNECTED WHEN:** the app opens on your phone at its `.vercel.app` address and you are signed in as yourself; the Table Editor in Supabase shows the tables; the three values sit only in Vercel's settings; and the repository is still private. From now on, every time Claude Code saves to main, the live app updates itself in about two minutes. If you ever change a value in Vercel, open **Deployments**, press the three dots on the latest one and choose **Redeploy**.

> **IF A SCREEN LOOKS DIFFERENT FROM THIS PAGE:** Supabase and Vercel move their buttons from time to time; the steps stay the same. Take a screenshot, give it to Claude Code and ask: `where do I click now?`

## 05 · The First Build *(Phase 1 · weeks 1 to 4)*

Week 1 is the opening of a four week build, and the order matters more than the speed. You earn trust before you hand over control: nothing sends by itself until you have watched it draft correctly for a full week. This is also how Nisha stops fearing it, because she sees it help before she sees it act.

**W1 · THE LIST THAT IS TRUE** *(Job Record + Lead Board)*
Every open lead loaded from the CRM export, one row each, with a stage, a consultant and a source. One board on your phone shows every lead by stage, source and days since last contact.
**Why first:** it runs on data that already exists. Nothing new for the team, no new habit, so you hold a real result inside seven days.
**Done when** you open one page on your phone and can name every quiet lead without opening the CRM or the WhatsApp group.

**W2 · THE LIBRARY YOU SIGN** *(Consultation Skill · templates)*
Your rules page becomes the message library: first reply for residence, hotel and office; showroom invitation; consultation reminder; post site visit note; quiet lead check-in; and a warm track for architects, designers and contractors. Each template stays **Draft** until you tap **Sign**. The system drafts only from signed templates, and a person still presses send.
**Start a clock this week:** on the WhatsApp Business API, a message to a lead who has not written in the last 24 hours must use a template approved by Meta, and approval can take from minutes to a few days. Submit the first reply and the check-in as soon as you sign them.
**Done when** five test leads have received a first reply drafted from a template you signed, and Nisha did not compose a single one.

**W3 · THE RHYTHM THAT REMEMBERS** *(follow-up · price stop)*
Every lead carries its next follow-up date from your rhythm. A quiet lead comes back on its day with its history attached, and when the rhythm is used up it is marked cold. The moment a lead mentions price, discount or terms, the flow stops writing, flags the lead and puts it in front of Vincent or Antony. Until your CRM is connected, Nisha loads new leads each morning with the same import; this week Claude Code checks with you whether your CRM can send new leads straight to the app.
**Done when** no lead goes quiet without coming back on its date, and every price question reached Vincent or Antony with none answered by the system.

**W4 · FIRST REPLY BY ITSELF** *(automatic · one lead type at a time)*
For the lead types you have tested, the signed first reply goes out on the WhatsApp Business API within minutes of a new lead, without anyone pressing send. One switch, yours, turns all automatic sending off. Widen from five leads to every new lead of one type, then the next.
This week depends on two things outside the build: your WhatsApp Business API provider letting the app send, and Meta approving your templates. If either is late, the system keeps drafting for a person to send. Customer messages never go from a personal number.
**Done when** a full week passes in which every new lead got its first reply within minutes without Nisha typing it, and you can name every quiet lead from the Lead Board. That is your blueprint's Phase 1 done line.

## 06 · Rules of the Road *(set by Joe, enforced by design)*

- **BUILD ONE PHASE:** Phase 1 only. Your blueprint holds nine pieces across four phases, and the Room Scanner, Site Scout, Rounds Agent and Lead Desk are months away. Attempting them now is the single most common way a build like this dies. Leads first, because 250 of every 300 leave before a quote.
- **TEMPLATES NEED YOUR SIGNATURE:** your guardrail, from the brief: templates for communications need a person to sign off. Nothing reaches a lead from a template you have not signed.
- **MONEY STAYS HUMAN:** your rule. Pricing and negotiation stay with Vincent and Antony, and payments are never automated. The AI engages, books and reminds; the moment price is mentioned, it stops and hands over.
- **FIVE BEFORE THREE HUNDRED:** prove every change on five leads before all 300. A system that works for five and grows will beat a complete system that nobody trusts.
- **KEEP WHAT YOU PAY FOR:** nothing new is bought in these twelve weeks. The app sits on top of your CRM, ERP, WhatsApp Business API and Repuva. Which ones stay is your month 12 decision.
- **WHEN YOU ARE STUCK, ASK THE BUILDER:** paste the error or a screenshot into Claude Code and ask it to explain in simple words and fix it. Being stuck is not a sign you chose the wrong path; it is the normal texture of building, and this is the one tool that answers at midnight.

## 07 · Next Steps *(start today, in this order)*

1. **Ask Nisha for the CRM export today.** Open leads with phone, type, source, stage, consultant and dates, plus the names of your CRM and your WhatsApp Business API provider. This one request blocks every other step, so make it before you close this document. *Owner: Nisha.*
2. **Pick your five test leads.** A mix of residence, hotel and office, at least one referred by an architect or designer, all genuinely open, all people you know well enough to phone personally if a message lands wrong. *Owner: you, with Nisha.*
3. **Confirm what the blueprint printed.** The eight money-path steps, the seven names and roles, the 300 / 50 / 40 / 20 figures and the three guardrails (blueprint next step 01). Add any correction to your rules page so Claude Code builds on the truth. *Owner: you.*
4. **Start the reporting-line clock.** Your general manager fills in who reports to whom, the line your brief left blank. Month one does not need it, but no escalation rule in Phase 2 can switch on without it, and your people-management deadline is 30 November 2026. *Owner: general manager.*
5. **Book the weekly review.** One call a week with Romana Parkar, your AI expert, carrying your build questions and your "rules I learned" note: `calendly.com/romana-buildour/30min`. Six hours of building plus one hour of review beats seven hours of building alone. *Owner: you, with BuildOur AI.*

## 08 · The Build Brief *(written to Claude Code · Joe can skip this)*

You are building Terrakraft's business platform with its owner, Joe Ranji, who is not a programmer. Treat this section as standing instructions for this session and every later one. On your first build, copy B1, B3, B6, B7 and B8 into `CLAUDE.md` at the root of the repository so they hold in every later session. Where this brief and the blueprint differ, this brief decides scope and the blueprint decides facts about the business.

### B1 · Scope: Phase 1 only

| ID | System | What you build in month one |
|---|---|---|
| F-00 | Job Record | One row per lead. The record every later system reads and writes. |
| SYS-01 | Consultation Skill and message library | Lead questions and message templates stored in the database, each Draft or Signed; only Joe signs. |
| SYS-03 | Lead Board | Every open lead by stage, source, consultant and days since last contact. Mobile first. |
| SYS-02 | Follow-up Flow | Drafts first replies and check-ins from signed templates, runs the follow-up rhythm, stops on price. Automatic sending only behind the switch. |

Do not build SYS-04 to SYS-08, the Room Scanner, Scan to Quote Flow, Site Board, Site Scout, Rounds Agent, Lead Desk agent or Partner Desk. In month one a partner (architect, designer, contractor) exists only as a lead source with a name and firm. If Joe asks for a parked item, tell him his own plan parks it and note it in NOTES.md.

### B2 · Stack and repository

Next.js with the App Router and TypeScript, Tailwind for styling, Supabase (Postgres, Auth, Row Level Security) through `@supabase/ssr` and `@supabase/supabase-js`, deployed on Vercel from the **main** branch. No other services, no paid libraries, no second app or database. The repository already exists and is connected to this session; it may be empty. If you cannot push to main, push your branch, open a pull request, and give Joe the link with one sentence on pressing Merge. Write a short README.md a non-programmer can read: what the app is, where it runs, where the setup file is.

### B3 · Keys and environment

Use exactly three variables with these names, so that section 04 of the guide matches: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. The legacy anon and service_role keys must also work in the same variables. Commit a `.env.example` with the names and no values. Use the secret key only in server code. Never ask Joe to paste a key into chat; keys go into Vercel only. If a later phase needs another variable (the WhatsApp provider), add it to `.env.example` and tell Joe exactly where to add it in Vercel and to redeploy.

### B4 · Database

Write migrations in `supabase/migrations/`, and also one file, `supabase/setup.sql`, that Joe pastes once into the SQL Editor. It must be safe to run twice. Starting shape, adjusted to the real columns of the CRM export:

- **profiles**: one per login; name and role (owner, general_manager, crm, consultant, accounts).
- **leads** (the Job Record): name, phone, lead_type (residence, hotel, office), source, partner_name, stage, consultant, enquiry_date, last_contact_at, next_followup_at, followup_step, status (open, cold, won, lost), needs_person with a reason, crm_ref.
- **stage** uses Joe's eight rungs in his order and his own wording from the rules page: incoming call, showroom visit and product selection, site visit, PI making, negotiation, closure and supply, delivery, installation.
- **templates**: key, lead_type, purpose, body, status (draft, signed), signed_by, signed_at. Editing a signed template returns it to draft.
- **messages**: lead, template, body, channel, status (drafted, approved, sent, held), approved_by, sent_at.
- **settings**: auto_send, off by default. This is the one switch.
- **activity_log**: append-only record of who did what, to which lead, when. No update or delete for anyone.

Row Level Security on every table and no anonymous access. Owner and general manager see everything; crm (Nisha) sees all leads; a consultant sees the leads assigned to them. Give Joe one copy-paste SQL line that makes his login the owner.

### B5 · Screens, in build order

1. **Sign in.** Email and password; each person their own login.
2. **Import** (owner and crm only): upload the CRM export as CSV or Excel, preview it, list rows that could not be read as "needs review", then load. Safe to rerun each morning without duplicates (match on crm_ref, else phone).
3. **Lead Board**, the week 1 screen: filters by stage, source and consultant; days since last contact highlighted when the rhythm is missed.
4. **Lead page:** history, stage, the drafted message with Approve, Copy and Mark sent.
5. **Templates:** Joe reads and signs.
6. **Settings:** the automatic switch, owner only.

Mobile first, because the team works on site, in the field and in the office. Plain words on every screen, no jargon, no empty dashboards.

### B6 · Guardrails: code them, do not promise them

From blueprint section 09, set by Joe:

- **AI may act alone:** engagement with leads and consultation scheduling, only from signed templates, and only once the switch is on for that message type.
- **Human signs off:** pricing and negotiation, quote confirmation, orders, final confirmations, installation scheduling, communication templates. The system may draft and remind; it never sends or decides any of these.
- **Never automated:** payments. Phase 1 shows no payment action at all.
- **Price stop:** any reply or note mentioning price, rate, cost, discount, offer, terms or negotiation (plus the words on Joe's rules page) sets needs_person, stops the flow for that lead and alerts its consultant. When unsure, stop.
- **No invented numbers:** Phase 1 shows no prices or quantities.
- **Diary:** every send, approval, signature, import and switch change writes to activity_log.

### B7 · Open inputs: ask, never guess

The blueprint names these as unknown. Ask Joe one at a time when the build needs them; until answered, show them in the app as "needs Joe" rather than filling them in.

- Which CRM, its export columns, and whether it can send new leads to the app directly (check in week 3).
- Which WhatsApp Business API provider, whether it allows sending from the app, and which templates Meta has approved.
- Follow-up rhythm days and the cold point; the first reply wording per lead type (his rules page).
- How a new lead is assigned to Antony or Vincent.
- Who reports to whom. Not needed in Phase 1: build no escalation.
- The repeat customers figure "2" has no unit. Do not use it.

### B8 · The six house rules (BuildOur AI standard)

Put these in CLAUDE.md word for word. If a request would bend one, say so plainly and wait for Joe's decision.

1. **One home.** This repository, this database and this app are the only ones this business will ever have. Every new system is a new room in the same house: a new section of the app reading the same leads, the same customers, the same logins.
2. **Every person their own key.** Every team member gets their own login and sees exactly what their work needs; the owner sees everything. No shared passwords, ever.
3. **A human yes before anything reaches a customer.** Nothing is sent, and no price, discount or commitment is given, without a named person approving it, except message types the owner has switched on after testing. One switch turns all automatic behaviour off without touching code.
4. **The diary nobody can edit.** Every action the system takes is written to a log that can only be added to.
5. **Secrets stay in the cupboard.** Keys live only in the hosting settings (and `.env.local` on a machine). Never in code, in chat, or in any file that goes to GitHub.
6. **Money is calculated, never guessed.** Prices, quantities and totals come from exact rules written as code from the owner's own numbers. AI reads, matches, drafts and reminds; it never invents a number.

### B9 · How to work with Joe

- One step at a time, in simple words, one question at a time. Plan first and wait for his ok.
- End every phase with something he can open on his phone, and ask him to check one lead he knows.
- Commit and push at the end of every phase. Close every sitting by updating NOTES.md: done, next, open questions.
- Never commit customer data. The CRM export and any file with phone numbers stays out of the repository; add those patterns to .gitignore.
- Before showing Joe any rule that decides who gets a message or when, test it against a few real leads from the export.
- If a file this prompt mentions is missing, ask for it before you start.

---

*This guide follows the AI Systems Blueprint BOA-2026-TER-01 Rev A (blueprint audit 29.10.2026) and traces to the submitted Systems Brief. Build stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.*

*BuildOur AI · Client Starter Guide · DWG NO. BOA-2026-TER-02 · REV A*
