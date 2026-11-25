Buildour AI · GrowSafeStarter Guide · Rev A

# GROWSAFE OS STARTER GUIDE

Prepared for **Akash Dubey**, GrowSafe. You install one app **on your own development PC** and paste one prompt. **Claude then opens every website for you, one by one**, sets up Supabase and Vercel, makes your app live, guides you through the Tally settings **on the Tally server, over Remote Desktop**, ready for the **Tally Bridge**, helps you **choose the look**, and opens the build sessions.

Claude on  
your PC–– Folder and  
docs–– Starter  
prompt–– Supabase,  
Vercel–– Tally  
settings–– Bridge  
session

[TABLE]

The starter prompt comes as a separate message · Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

00

READ THIS FIRST

Five minutes

You asked for this in your own words: *“I need fully new tool that syncs complete Tally data to supabase, and I want to discontinue previously used tools Agricost, Unolo & Biz Analyst.”* Your blueprint, Rev B, answers with one **GrowSafe OS** on one set of data, built over twelve weeks: the **GrowSafe Tally Bridge** first, then **sales team reporting** (Field Force in place of Unolo, the Sales Scorecard and Payout Meter), with the **People Desk** (SOPs, KRAs and KPIs, hiring simulations) running alongside; then the **Role Board** in place of Biz Analyst, **Costing and Margin Guard** in place of AgriCost.In and the **Batch Expiry and Season Board**; and last the **Customer App** for B2B dealers and D2C buyers, shipped with Delhivery.

**Your accounts team keeps working in TallyPrime.** Tally stays the source of truth for accounting, billing and batch stock. Nothing is ever written into Tally except what you or your team approved, sent through the Bridge: new masters, and vouchers only as **Optional**, marked with their app number, which accounts converts to regular vouchers by hand.

**No coding is needed, and no setup knowledge either.** Claude Code writes every line and, in the starter prompt, opens each website in your browser and tells you exactly what to click. If you do not understand something, type `explain this to me in simple words`. If a page looks different from what Claude describes, take a screenshot, paste it in, and type `this is what I see, what do I click?`

Two computers: your development PC and the Tally server

You build on **your own computer, your development PC**, in the Claude desktop app’s **Code** tab, on the local folder `Documents\GrowSafe-OS` connected to your GitHub repository. **Claude is never installed on the Tally server.** The TallyPrime server stays on the accounts LAN and you reach it only by **Remote Desktop**. On it run only TallyPrime and, later, the small **GrowSafe Bridge connector**, which you install yourself over Remote Desktop while Claude tells you each step from your development PC. The connector reads Tally inside the server and sends data **out** to Supabase over HTTPS. Nothing on the server is opened to the internet, and port 9000 never leaves the office network.

Pro or Max? How to check

Open the Claude app → your name (bottom left) → **Settings → Billing**. It says **Pro** or **Max**. Both work. On **Pro**, Claude runs one build session at a time and may ask you to pause when you reach your usage limit; on **Max**, two build sessions can run side by side. Tell HQ which one you have when it asks.

Your old Supabase project and old sync script

They are past experiments. GrowSafe OS gets a **new** Supabase project in a new organisation, so nothing can clash. The old project and the old script keep running exactly as they are (if the old script runs on the Tally server, it stays there) until the new Bridge matches Tally; then, with your yes, they are stopped. Claude never deletes anything without your yes.

Who does what

**Romana shows you how to connect your GitHub repository** to Claude Code, and if you need it, helps you put the keys into Vercel. **Everything else HQ guides you through, one step at a time:** the new Supabase project, Vercel, the TallyPrime settings on the Tally server (over Remote Desktop) and the Tally to Supabase Bridge in both directions (section 08 of the Continuation Guide). Then HQ helps you open a new session for each system. If you are stuck, tell HQ: paste the error or a screenshot and type `explain this in simple words and give me the next step`.

What it costs, honestly

Your Claude plan builds everything. GitHub is free. **Supabase Pro**, about \$25 a month, from the start: four to five years of Tally data is more than the free 500 MB, and free projects pause when idle. **Vercel Pro**, about \$20 a month, because the free Hobby plan is for personal projects only. Later, only if you choose: a **payment gateway** and a **Delhivery** account for the Customer App, and the **Claude API** and **WhatsApp Business API** for the AI employees in months four to twelve. Claude always tells you the cost and waits for your yes.

STEP 1

You do this

**Install the Claude desktop app on your own development PC**

1.  On your own Windows PC, the one you build on (not the Tally server), go to **claude.com/download**, download the app for Windows and install it.
2.  Open it and sign in with the email you used for your Claude subscription.
3.  Click the **Code** tab at the top. This is **Claude Code**, the builder. Everything else (Node.js, Git, the GitHub tool) is installed by Claude, with your permission, in Step 3.
4.  **Do not install Claude on the Tally server.** TallyPrime stays on the server as it is today; check that you can open the server by **Remote Desktop**, as you do now. Nothing changes for your accounts team.

STEP 2

You do this

**Make the folder, and the docs folder inside it**

1.  Make one folder for life: `Documents\GrowSafe-OS`, with the same name as your repository. Every GrowSafe system goes in here, never in a second folder. HQ connects it to `GrowSafe-OS` on GitHub in Step 3, so your README arrives here too.
2.  Inside it, make a folder called `docs`, and put these three PDFs in it:
    - the **AI Systems Blueprint, Rev B**
    - this **Starter Guide** (it includes the look, section 03)
    - the **Continuation Guide**
3.  Inside `docs`, make a folder called `samples` and put in what you have today: your **terms and conditions**, **scheme slabs**, current **price lists**, one **recipe or costing sheet**, the field sales **TA and incentive rules**, any **SOP or KRA documents**, and **screenshots of what Unolo, AgriCost.In and Biz Analyst show today**, so their replacements cover the same ground. **Tally exports are not needed**: the Bridge reads Tally itself. If something is not ready, HQ puts it on your list.
4.  **Never put** a password or a secret key in `docs`. Claude tells you where those go.

What it looks like

`Documents\GrowSafe-OS\docs\` GrowSafe Final Blueprint.pdf · GrowSafe Starter Guide.pdf · GrowSafe Continuation Guide.pdf · `samples\` · later `design\` · and later, next to `docs`, the folder `tally-bridge-starter`, which BuildOur sends you once it is tested, unzipped as it is

STEP 3

Paste to Claude Code

**Open HQ and paste the starter prompt**

1.  In the Claude app, **Code** tab, choose to work on **this computer**, your development PC (a local folder, not a cloud environment), choose the folder `GrowSafe-OS` and start a new session. Name it `HQ`. HQ is your main session: it holds the whole picture, sets everything up, and later gives you the prompt for every other session.
2.  Paste the **GrowSafe Starter Prompt** you were sent, and send.
3.  HQ works in stages and stops after each one. Read what it says, do what it asks, and type `OK` to go on. One sitting of three to four hours is best; if you stop, come back to HQ and type `where were we?`

### What HQ walks you through, one by one

| Stage                            | What happens                                                                                                                                                                                                                                                                                                                       | What you do                                                                                                   |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| **Tools**                        | HQ checks your development PC and installs Node.js, Git and the GitHub command tool (gh), one at a time.                                                                                                                                                                                                                           | Read each one-line request and press **Allow**.                                                               |
| **GitHub**                       | HQ signs your development PC in to GitHub with `gh auth login` and brings `GrowSafe-OS` into your local folder, keeping the README and your docs. It checks the Claude GitHub app is on the repository.                                                                                                                            | Press **Authorize** when GitHub asks in the browser.                                                          |
| **Supabase**                     | HQ opens supabase.com: a **new** organisation, then the project `growsafe-os` in **South Asia (Mumbai)** on **Pro** (HQ shows the cost first). HQ tells you which three values to copy into `.env.local`.                                                                                                                          | Save the database password safely; paste the keys into the file HQ opens, never into chat.                    |
| **The app**                      | HQ builds the empty GrowSafe app, writes your rules into `CLAUDE.md`, and pushes it to GitHub.                                                                                                                                                                                                                                     | Read the rules back; say OK.                                                                                  |
| **Vercel**                       | HQ opens vercel.com: you sign up with GitHub, import `GrowSafe-OS`, and HQ walks you through every setting in the table below, then the deploy.                                                                                                                                                                                    | Click, check each setting, paste the keys.                                                                    |
| **Live**                         | HQ sets Supabase to accept sign-ins from your live address.                                                                                                                                                                                                                                                                        | Open the app on your phone; **Add to Home Screen**.                                                           |
| **Tally**                        | HQ guides you, screen by screen, through the TallyPrime settings in the second table below, **on the Tally server, over Remote Desktop**. HQ does not read Tally from your PC: the first read test comes later, in the BRIDGE session, through the connector’s test mode. Nothing is written.                                      | Open the Tally server by Remote Desktop, TallyPrime with your companies loaded; change the settings HQ names. |
| **Your list and the foundation** | HQ writes `docs/START-NOW.md` from page R1, lays the empty F-00 starting tables, and adds your owner login.                                                                                                                                                                                                                        | Answer its questions one at a time.                                                                           |
| **The look**                     | HQ stops and sends you to section 03 of this guide.                                                                                                                                                                                                                                                                                | Choose the look; hand it back.                                                                                |
| **Sessions**                     | HQ writes the plan and the build sheet for the **F-00 GrowSafe Tally Bridge**, then gives you the opening prompts for the **BRIDGE** build session (on your development PC; the connector it builds runs on the Tally server), the **Rulebooks** writing session and the **People Desk** lane, and shows you how to open each one. | Approve the build sheet; open the sessions and paste.                                                         |

| Vercel setting        | What it should be (HQ checks each with you)                                                                                |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------|
| Plan                  | **Pro** (commercial use). Hobby is for personal projects only.                                                             |
| Git access            | The Vercel GitHub app installed on **only** `GrowSafe-OS`, not all repositories.                                           |
| Framework Preset      | **Next.js**. Root Directory left as it is.                                                                                 |
| Environment Variables | The three Supabase names HQ gives you, from the **new** project, ticked for **Production, Preview and Development**.       |
| Production Branch     | `main` (Settings → Git).                                                                                                   |
| Function Region       | **Mumbai, India (bom1)**, next to your Supabase project (Settings → Functions).                                            |
| Deployment Protection | Vercel Authentication on **preview** addresses only, so test builds stay private and the live address works for your team. |
| After deploy          | The `.vercel.app` address goes into Supabase → Authentication → URL Configuration as Site URL and Redirect URL.            |

| Tally setting         | What it should be (on the Tally server, over Remote Desktop; HQ guides you)                                                                                                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Where                 | On the Tally server: TallyPrime → **F1 Help** → **Settings** → **Connectivity** → **Client/Server configuration**.                                                                                                                                  |
| TallyPrime acts as    | **Both**.                                                                                                                                                                                                                                           |
| Enable ODBC           | **Yes**.                                                                                                                                                                                                                                            |
| Port                  | **9000**, used only inside the server: the connector talks to Tally there. Never opened to the internet.                                                                                                                                            |
| Sleep                 | Windows power settings on the server: **never sleep**.                                                                                                                                                                                              |
| While the Bridge runs | TallyPrime open on the Tally server with the companies loaded; the server stays on. The connector only sends data **out** to Supabase over HTTPS; no connection comes in.                                                                           |
| The test              | Later, in the BRIDGE session: you run the connector’s **test mode** on the server over Remote Desktop; it writes your company names and counts into Supabase, and the session reads them there. Read only: nothing is written into Tally.           |
| A question for you    | **Is your development PC on the office LAN?** Only if it is, and you and accounts agree, HQ may read the company list from your PC over the LAN on port 9000 (read only, never from the internet). Otherwise the test waits for the BRIDGE session. |

**YOUR FOUR RULES DURING SETUP:** you type every password yourself, in the browser, never in the chat. Keys go only into the file or the box HQ names. When Claude asks permission to run something, it shows one line saying what it does: read it, then press Allow. **Nobody touches the old Supabase project or the old sync script**; if anything looks wrong, stop and ask HQ.

03

STEP 4 · CHOOSE THE LOOK

The UI section · when HQ sends you here

Claude builds what you say, but it designs what you show it. Show it nothing and your Field Sales Officers get the average of every app on the internet: crowded, generic, and ignored. If marking a dealer visit in the app is slower than a WhatsApp message to the manager, the WhatsApp message wins, and every scorecard after it is empty.

4.1

You do this

**Collect.** On **pinterest.com** search `minimalist UI design web app`, `field sales app mobile clean`, `B2B ordering app simple` and `business dashboard simple`. Download 10 to 15 screens your salesmen, billing staff and dealers would understand at a glance. Skip anything crowded, dark or clever.

4.2

You do this

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: GrowSafe, an agro chemicals manufacturer selling to dealers and retailers across several states. My Field Sales Officers will use the screens on a phone in rural markets to punch in, check in at dealer visits and see their daily sales, collection and travel allowance; my billing, dispatch, accounts and QC staff will use their own queues; my dealers and licensed retailers will order, see their ledger and buy liquidation deals in a customer app, and open buyers will buy a few products and track their Delhivery shipment; and I will use my phone to see sales, collections, outstanding, stock and margins, and to approve. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team and my dealers can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex. Give me the best one to move ahead with.

4.3

You do this

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Make a folder `docs\design` and save the images and the .md file in it. If the direction comes back too narrow (“a field sales app”), correct it: *“This is the whole GrowSafe OS: Tally data, the sales team, costing, stock, the people desk and the customer app.”*

4.4

Paste to HQ

**Hand it over.**

Paste · HQ · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03, and build one sample screen, the Field Force visit check-in screen with dummy dealers and a dummy route, so I can see the look on my phone before any system is built. Wait for my OK, then carry on with the sessions stage.

### Your main screens, one question each

| System                   | Screen and its one question                                                         | Main button            | Who, on what                    |
|--------------------------|-------------------------------------------------------------------------------------|------------------------|---------------------------------|
| F-00 Tally Bridge        | **Bridge health:** “did Tally and the app match today, and when was the last sync?” | Open the mismatch      | You; accounts                   |
| SYS-02 Field Force       | **Day:** “am I punched in, and which dealers are on my route today?”                | Punch in / Check in    | Field Sales Officer, phone      |
| SYS-03 Sales Scorecard   | **My month:** “my sales, collection, TA and payout so far?”                         | Open my day            | Field Sales Officer, phone      |
| SYS-03 Payout Meter      | **Month end:** “which payout sheet waits for my signature?”                         | Sign                   | You                             |
| SYS-04 Role Board        | **Owner view:** “sales, collections, outstanding, stock and margin today?”          | Open the red line      | You, phone                      |
| SYS-04 Role Board        | **My queue:** “what is waiting for me to bill, dispatch, check or release?”         | Take the next one      | Billing, dispatch, accounts, QC |
| SYS-05 Margin Guard      | **Red list:** “which SKUs are below my margin line, and what is the draft price?”   | Approve price list     | You                             |
| SYS-06 Expiry Board      | **Monday read:** “which batches expire inside 90 days, in which godown?”            | Make a deal / transfer | You; godown staff               |
| SYS-07 Customer App, B2B | **Dealer:** “what can I order within my credit, and what do I owe?”                 | Place order            | Dealer or retailer, phone       |
| SYS-07 Customer App, D2C | **Buyer:** “which product, how many, where is my parcel?”                           | Pay / Track            | Open buyer, phone               |
| SYS-08 People Desk       | **Me:** “which SOP must I read, and what are my KRAs this month?”                   | I have read it         | Every staff member              |

### GrowSafe screen rules

- **Field-fast and offline.** Punch-in and visit check-in take fewer taps than a WhatsApp message, save on the phone in rural markets, send when the signal returns, and say so (“saved, will send”).
- **The location proves the visit.** A visit counts only from a geo-tagged check-in at the dealer; TA comes from the verified route distance, never typed in.
- **Tally numbers are shown, not edited.** Sales, collections, outstanding and stock come from the Bridge with the last sync time on the screen; nobody changes them in the app.
- **Nothing reaches Tally unapproved.** An order or voucher shows “waiting for approval” until it is approved, then “sent to Tally” with its app number.
- **Mismatches are shown, never hidden.** If Tally and the app disagree, the line is red with both figures side by side.
- **Red, amber, green mean only one thing:** late, short or expiring inside 90 days; waiting or 90 to 180 days; done or beyond 180 days. Red at the top.
- **Hindi, English or the market language, per person,** for staff and for dealers: tell HQ which.
- **Each role sees its own screen.** A salesman sees his route and his numbers; a dealer sees only his own ledger.

| The five screen laws                 | Check every screen Claude shows you                                                                       |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the user must see first is the biggest and boldest thing on the screen.                     |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                            |
| **3 · Consistency is trust**         | The same thing looks the same everywhere: a dealer, a SKU, a batch, a red flag.                           |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the route, the dealer’s last order. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a plain message.                                       |

**THE TWO-MINUTE RULE:** a Field Sales Officer or a dealer opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the person. The real test: hand the phone to a salesman and watch, without helping.

STEP 5

You do this

**Switch to the Continuation Guide when all of this is true**

- The app opens on your phone at its `.vercel.app` address and is on your home screen.
- `GrowSafe-OS` is **private**, has the Claude GitHub app, and lives on your development PC in `Documents\GrowSafe-OS`.
- The **new** Supabase project `growsafe-os` is in **Mumbai** on Pro; the old project and old script are untouched.
- Every Vercel setting in the table above is checked; the three keys are only in `.env.local` and Vercel.
- On the Tally server, over Remote Desktop: TallyPrime acts as Both, ODBC Yes, Port 9000, and the server never sleeps. Claude is not installed there.
- `CLAUDE.md` holds your rules (page R2), and `docs/START-NOW.md` lists what waits on you.
- The F-00 starting tables are in Supabase, and you can sign in on your phone.
- `docs/design/` holds your look, and CLAUDE.md says every screen follows it.
- The BRIDGE session, the Rulebooks writing session and the People Desk lane are open with HQ’s prompts.

Then open section 02 of the Continuation Guide, **Every sitting**. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box. Longest first.

| \#  | Item                                                                                                                                                                                                                                                                                                                                                                                                                                           | Owner                     | Needed for           |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|----------------------|
| 1   | **Which Tally companies and GSTINs to sync**, all of them or a named list, with any company that must stay out.                                                                                                                                                                                                                                                                                                                                | Akash with accounts       | Week 1, F-00         |
| 2   | **The Tally server that stays on with Tally open**: on the accounts LAN, power and internet on (out to Supabase over HTTPS only), TallyPrime open with the companies loaded, your Remote Desktop access, accounts’ yes to the Bridge connector there, and who restarts it. **And: is your development PC on the office LAN?** Only then, with your and accounts’ yes, may BRIDGE read Tally over the LAN (read only, never from the internet). | Akash with accounts       | Week 1, F-00         |
| 3   | **Supabase Pro** on the new project from the start.                                                                                                                                                                                                                                                                                                                                                                                            | Akash                     | Setup, Stage 4       |
| 4   | **Payment gateway choice and the Delhivery account** (with API access) for the Customer App. Start now: accounts and checks take time.                                                                                                                                                                                                                                                                                                         | Akash                     | Week 9, SYS-07       |
| 5   | **The Rulebooks in Hindi, English and the first market language**: which market language comes first, and who checks each translation.                                                                                                                                                                                                                                                                                                         | Akash                     | Weeks 1 to 3, SYS-01 |
| 6   | **The field sales numbers:** the collection-to-cost threshold, the TA rate per km and the incentive slabs.                                                                                                                                                                                                                                                                                                                                     | Akash                     | Week 4, SYS-03       |
| 7   | **The pilot state** for Field Force and the **pilot dealer group** for the Customer App.                                                                                                                                                                                                                                                                                                                                                       | Akash with the sales head | Week 3; week 9       |
| 8   | **Your margin threshold per formulation family**, the line below which a SKU goes on the red list.                                                                                                                                                                                                                                                                                                                                             | Akash                     | Week 6, SYS-05       |
| 9   | **Which D2C products are non-restricted** bio-stimulants and micronutrients, product by product.                                                                                                                                                                                                                                                                                                                                               | Akash                     | Week 9, SYS-07       |
| 10  | **The numbers left blank:** the eight dashboard numbers (leads, quotes, conversion, orders, order value, cycle, repeat, headcount), your busy season, and what would make this “worth it”.                                                                                                                                                                                                                                                     | Akash                     | Before any target    |
| 11  | **The stop dates** for the old sync script, AgriCost.In, Unolo and Biz Analyst, each only after its replacement has run alongside: the old script after the Bridge matches Tally for 7 days; Unolo after one month in the pilot state; AgriCost.In after one month side by side; Biz Analyst when the owner view is trusted.                                                                                                                   | Akash                     | Weeks 3 to 9         |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, this repository (GrowSafe-OS), the NEW Supabase project (Mumbai) and this Vercel project are the only ones GrowSafe OS will ever have; every system is a new section of the same app. Never read from, write to, copy from or delete the old Supabase project, the old sync script or AgriCost.In code: they are past experiments. 2 · EVERY PERSON THEIR OWN KEY: every team member, dealer and buyer has their own login and sees only what their role needs; Akash sees everything; no shared passwords. 3 · A HUMAN YES WHERE AKASH SAYS SO: what AI does alone, what a person signs off and what is never automated follow Akash’s guardrails below; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys and logins live only in .env.local on Akash’s development PC and in Vercel’s settings, and the Bridge’s secret key only in the connector’s settings file on the Tally server, typed there by Akash himself; never in code, in chat, in docs or on GitHub. 6 · NUMBERS ARE COUNTED, NEVER GUESSED: sales, collections, outstanding, stock, cost and margin come from Tally through the Bridge and from exact tested rules; AI reads, drafts, records and shows, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Guardrails (Akash’s own, word for word).** AI acts alone: share real-time ledger statements, shipment tracking and terms in local languages; prompt quantity and cash-discount offers during ordering; send automated payment reminders showing overdue status, early-payment discounts and late-interest rules; auto-calculate verified GPS travel allowance (TA); flag near-expiry batches and margin drops; generate daily sales and collection scorecards. Human signs off: issuing credit notes (freight, leakage or damage, sales returns); overriding credit limits or overdue blocks for new orders; changing master product price lists or formulation recipes; approving final payroll and incentive disbursements; releasing raw material purchase orders. Never automated: final raw material vendor selection and price negotiation; statutory regulatory filings (CIBRC, FCO, GST returns); final hiring and termination decisions; waiving late-payment interest or bad-debt write-offs. Rev B adds: nothing is written into Tally except an approved master or Optional voucher through the Bridge; accounts keeps working in Tally; reconciliation mismatches are flagged, never silently corrected; D2C sells only non-restricted products.

**GrowSafe rules.** Tally is the source of truth for accounting, billing and batch-wise inventory. Nothing is written into Tally except what a permitted person approved in the app, sent through the Bridge: new masters, and vouchers only as Optional, tagged with their app id, which accounts converts to regular vouchers by hand. Staff are mapped to their expense or salary ledger or cost centre, and salespeople to dealer groups, only by picking from Tally’s own lists. The Bridge starts from the BuildOur starter code in tally-bridge-starter/. Claude is never installed on the Tally server: on it run only TallyPrime and the Bridge connector, a Windows service that reads Tally inside the server (localhost:9000) and connects out to Supabase over HTTPS only; nothing on the server is opened to the internet, port 9000 never leaves the LAN, and Akash installs every connector version himself over Remote Desktop, guided step by step. Reconciliation mismatches are flagged, never fixed by the system. The operational and HR layers (SOPs, KRAs and KPIs, hiring simulations, field sales discipline) are standalone and never pulled from Tally; payroll and HR accounting stay in Tally. The Customer App is strictly B2B and D2C: D2C sells only the non-restricted products Akash lists; no B2B2C and no multi-tier routing. The numbers Akash left blank are never hard-coded: count them, or ask. docs/samples never goes to GitHub. Build in the order of blueprint Rev B: the Tally Bridge first, sales team reporting second; a system starts only when Akash approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Akash can skip this page

### Stack and setup

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for photos and documents) through `@supabase/ssr`, a NEW project `growsafe-os` in South Asia (Mumbai) on the Pro plan; deployed on Vercel from `main` with Function Region Mumbai (bom1), a preview for every branch, and Vercel Authentication on previews only. GitHub repository `GrowSafe-OS`, private, with the Claude GitHub app installed, cloned to `Documents\GrowSafe-OS` on Akash’s own Windows development PC; every session runs locally there. Claude is never installed on the TallyPrime server, which sits on the accounts LAN and which Akash reaches only by Remote Desktop. Mobile-first web app added to the home screen; field screens save offline and sync. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; later payment gateway, `DELHIVERY_*`, `WHATSAPP_*`, `CRON_SECRET`, `ANTHROPIC_API_KEY` only with Akash’s yes; `.env.example` holds names only. When guiding setup: open each website in Akash’s browser one at a time, describe exactly what to click, never ask for a password or key in chat; for anything on the Tally server, guide Akash over Remote Desktop one screen at a time.

### F-00 GrowSafe Tally Bridge: the design

**Starter code** from BuildOur in `tally-bridge-starter/`, sent once it has been tested on TallyPrime (until it arrives, the BRIDGE session does not open): `bridge/` (Node.js connector with tests), `supabase/migrations/` (the Bridge tables, approval queue, mapping and views) and `docs/tally-bridge-spec.md`, written new to Akash’s five points; install it, test it on a copy of one company and adjust it, do not rewrite it from zero. A **connector** runs as a Windows background task on the TallyPrime server on the accounts LAN and reads TallyPrime over its XML interface at `localhost:9000` (TallyPrime acts as Both, ODBC enabled). It connects **out** to Supabase over HTTPS only: no inbound connection, nothing on the server opened to the internet, port 9000 never exposed outside the LAN. Akash installs it once over Remote Desktop, guided step by step (what to copy from the repository, where to put it, what to click), and types the Supabase keys into its settings file on the server himself. **First full load** of every company and GSTIN Akash names: masters (ledgers, groups, stock items, units, godowns, batches with manufacturing and expiry dates, price levels, cost centres) and all vouchers for four to five years. Then **incremental** sync every few minutes using Tally’s change markers. It pushes to Supabase over HTTPS with the secret key kept only in its settings file on the server. **Test command** (`node src/index.js test`, then `sync-once` and `reconcile`): run by Akash on the server over Remote Desktop when the BRIDGE session asks; results go into `bridge_sync_runs` and `bridge_reconciliations`, and the session reads them from Supabase. Each new version reaches the server as an update Akash installs over Remote Desktop. Only if Akash’s development PC is on the office LAN and he and accounts agree may it read Tally on the server’s port 9000 over the LAN for read-only tests, never from the internet. **Write-back**: the connector checks the approved write-back queue in Supabase every few minutes; only approved items go into Tally as XML imports made locally on the server: new masters (ledgers first) created, and Sales, Receipts, Payments, Credit Notes and Debit Notes as **Optional** vouchers, each marked with its app id; accounts converts them to regular vouchers by hand. Every name is checked against the copy of Tally first; nothing is sent twice; an unknown result is checked by a person, never resent. **Mapping**: profile to expense or salary ledger or cost centre, salesperson to Tally groups, picked from Tally data. **Daily reconciliation**: trial balance, stock summary by godown and batch, and outstanding by party, Tally against Supabase; any mismatch is flagged, never silently fixed. Read-only role views. Done when: full history loaded, the three reconciliations match for 7 days, incremental lag under the minutes Akash agrees, on the test copy one approved ledger created and one Optional voucher of each type written back, converted by accounts and shown as converted in the app.

### F-00: the starting tables

From the starter migration `tally-bridge-starter/supabase/migrations/`: **tally_companies**, **tally_groups**, **tally_ledgers**, **tally_cost_centres**, **tally_stock_groups**, **tally_stock_items**, **tally_units**, **tally_godowns**, **tally_voucher_types**, **tally_vouchers** with **tally_ledger_entries** and **tally_inventory_entries** (batches inside), each row keyed to its Tally GUID and company; **bridge_sync_state**, **bridge_sync_runs**, **bridge_reconciliations**; **bridge_writeback_queue** (draft, approved, sent, in Tally as Optional, converted, failed); **app_approval_rules**, **app_profile_tally_links**, **app_salesperson_groups**; then HQ adds **profiles** (name, mobile, role owner / accounts / billing / dispatch / QC / sales / dealer, language, state, active); **settings** (automation switch off by default); **audit_log** (append only). Tally-fed tables are written only by the Bridge; nobody edits them in the app. Row Level Security: Akash sees all; every other role sees only what its work needs.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; applies every migration in order and merges finished work; never builds a system itself. It writes the opening prompt for every other session into `docs/session-prompts/`, shows it to Akash in its own box, and tells him exactly how to open that session in the Code tab.
- **BRIDGE**, the first builder, installs and adapts the F-00 starter code on Akash’s development PC in its own worktree on branch `f-00-tally-bridge`; it never reaches the Tally server itself, but tests through the connector’s test mode and reads the results from Supabase; it reads Tally only, until the write-back step that Akash approves.
- **Builders**, one at a time on Claude Pro and at most two on Max (BRIDGE counts as one), one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing sessions**: RULEBOOKS (SYS-01: Dealer Desk Rulebook, Formulation and Compliance rules, Field Sales SOP and KRA rules) and the PEOPLE DESK lane (SYS-08: SOPs, KRAs and KPIs per role, hiring simulations, onboarding): only `docs/` and `content/`; versioned; only Akash edits a final rule.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Akash Dubey · GrowSafe · traces to blueprint BOA-2026-GRO-01 Rev B (Rev A blueprint audit 23.11.2026; call with Romana Parkar 24.11.2026).  
Stack fixed: Claude Code on Akash’s development PC, the Bridge connector on the Tally server, Next.js, Supabase (Mumbai), Vercel, GitHub. TallyPrime stays the books.
