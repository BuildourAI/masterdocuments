Buildour AI · LX IT SolutionStarter Guide · Rev A

# LX OS STARTER GUIDE

Prepared for **Lalitesh Sharma**, LX IT Solution. From a Claude plan and a GitHub repository to **a live app on your phone**, your rules written, your look chosen and your first system planned. Do it once, in one sitting.

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

You wrote that the system is worth it if there are *“no calls on my phone”*. Your blueprint gets there in twelve weeks, one system at a time: first every key moves out of Google Sheets into one register, then the manager sees every key on one board, then keys leave on their own when a Tally invoice is saved, and by week twelve cid, invoice and delivery questions are answered from a board and not from your phone. You keep three things: the price quote, the credit limit, and your weekly tap.

**No coding is needed.** Claude Code writes every line. Your job: answer its questions in your own words, say OK when you agree, and check what it built against keys, customers and invoices you know. If you do not understand something, type `explain this to me in simple words`. If something breaks, paste the error or a screenshot and type `explain this in simple words and fix it`. You can write to Claude in Hindi, Hinglish or English.

**Who builds.** You give about 10 hours a week. If your manager does the clicking, they follow these guides; the accounts stay in your name, and every price, credit limit and approval stays yours.

What it costs, honestly

**Claude Pro** works to start; **Claude Max** is better once two sessions build side by side, because Pro reaches its usage limit sooner. GitHub is free. **Supabase** is free to start; move to Pro (about \$25 a month) when real keys go in, for daily backups. **Vercel Pro**, about \$20 a month, for a business app. Later: the **WhatsApp Business API** number (needed from week 5, when keys send themselves), a small **Tally connector** on the office computer, and the **Claude API** only when the app must draft with nobody at the computer. Claude always tells you the cost and waits for your yes.

Which computer

If you can, build from the **office computer that runs Tally**. In week 3 the app starts reading Tally invoices, and that is easiest from the same machine. Any computer works for weeks 1 and 2.

STEP 1

You do this

**Install three things**

1.  **Claude desktop app** from **claude.com/download**. Sign in with your Claude Pro or Max account. Claude Code is its **Code** tab.
2.  **Node.js LTS** from **nodejs.org**. Accept every default.
3.  **Git** from **git-scm.com**. Accept every default.

If anything here goes wrong, carry on: the starter prompt checks all three and tells you exactly what to click.

STEP 2

You do this

**Two accounts, on the business email**

1.  **Check GitHub.** Open your repository (the address you wrote on the cover). It must be **Private**: **Settings → General → Danger Zone → Change visibility** if it says Public. Turn on two-factor authentication under your profile → **Settings → Password and authentication**.
2.  **Supabase** (supabase.com): **Start your project → Continue with GitHub**. Press **New project**, name it `lx-os`, press **Generate a password** and save it somewhere safe, choose the region **South Asia (Mumbai)**, and create it. Wait two minutes. You will need three things from it in Step 4, and the starter prompt tells you where each one is: the **Project URL**, the **publishable key** and the **secret key**. Treat the secret key like a bank password.
3.  **Vercel** (vercel.com): **Sign Up → Continue with GitHub**. Choose **Pro** for business use. This is what puts your app online.

STEP 3

You do this

**Make the folder, and the docs folder inside it**

1.  Make one folder for life: `Documents\lx-os`. Every LX system goes in here, never in a second folder.
2.  Inside it, make a folder called `docs`, and put these four PDFs in it:
    - the **AI Systems Blueprint**
    - this **Starter Guide**
    - the **UI Guide**
    - the **Continue Building Guide**
3.  Inside `docs`, make a folder called `samples` and put in what you have today: your Google Sheet of keys downloaded as Excel, brand by brand; one recent distributor Excel file of keys; one Tally software invoice as PDF; and five typical customer WhatsApp messages (screenshots are fine). If something is not ready, the starter prompt puts it on your list.
4.  **Never put** the Getcid or Telegram login, any password, or a Supabase secret key in `docs`. Claude tells you where those go.

What it looks like

`Documents\lx-os\docs\` AI Blueprint.pdf · LX Starter Guide.pdf · LX UI Guide.pdf · LX Continue Building Guide.pdf · `samples\`

STEP 4

Paste to Claude Code

**The starter prompt**

1.  Open the Claude desktop app → **Code** tab → open the folder `lx-os`.
2.  Start a new session and name it `HQ`. HQ is your main session: it holds the whole picture, and later it writes the prompt for every other session you open.
3.  Paste the **LX Starter Prompt** that Romana sent you, with your GitHub address filled in, and send.
4.  HQ works in stages and stops after each one. Read what it says, answer its questions, and type `OK` to go on.

When HQ asks for a Supabase key, it tells you where to find it and asks you to paste it into the file `.env.local` yourself, or into the box it names. Never paste a secret key into the chat.

STEP 5

You do this

**Put it online** (when HQ reaches that stage)

1.  On vercel.com press **Add New… → Project**, find your repository and press **Import**. If it is not listed, press **Adjust GitHub App Permissions**, give Vercel access to that one repository, and come back.
2.  Check **Framework Preset** says **Next.js**. Open **Environment Variables** and add the three names HQ gives you, with the same three values from Supabase.
3.  Press **Deploy**. About two minutes later your app is live at an address ending in `.vercel.app`. Give that address to HQ.
4.  In Supabase, open **Authentication → URL Configuration**, set **Site URL** to that address and save, as HQ tells you.
5.  Open the address on your phone and choose **Add to Home Screen**. From now on, every time HQ pushes, the live app updates itself.

STEP 6

You do this

**Choose the look, before the first real screen**

Open the **UI Guide** and do its sections 01 and 02: collect screens you like, let Claude choose the clearest, save it in `docs/design/` and hand it to HQ. Ten minutes now decides whether your manager opens the app at 9 AM or keeps opening Google Sheets.

STEP 7

You do this

**Switch to the Continue Building Guide when all of this is true**

- The app opens on your phone at its `.vercel.app` address and is on your home screen.
- The GitHub repository is **private**, and the three keys are only in `.env.local` and Vercel.
- `CLAUDE.md` holds your rules (page R2).
- `docs/START-NOW.md` exists and every item has an owner.
- The foundation (the LX Key Register) is in Supabase, and you can sign in on your phone.
- `docs/SESSIONS.md` and the first build sheet are written, and you have read and corrected them.
- `docs/design/` holds your look, and CLAUDE.md says every screen follows it.

Then open section 02 of the Continue Building Guide, **Every sitting**. If a box is not ticked, tell HQ *“fix this before we continue.”*

R1

THE CLOCKS: FOR docs/START-NOW.md

Read by HQ

Things that wait on you or your team. Each becomes a line in `docs/START-NOW.md` with its owner, a start date and a tick box. Longest first.

| \#  | Item                                                                                                                                                                                                                                                        | Owner    | Needed for        |
|-----|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| 1   | **WhatsApp Business API number:** decide which number LX will use (the phone-app number customers order on today cannot carry template messages), choose a provider, start Meta business verification and get the message templates approved. 1 to 3 weeks. | Lalitesh | Week 5, SYS-03    |
| 2   | **Tally read access** for invoices and balances: which Tally edition, on which computer, who has admin access. Reading only; nothing is written into Tally in these twelve weeks.                                                                           | Lalitesh | Week 3, F-00      |
| 3   | **The keys today:** the Google Sheet of keys exported brand by brand, and one recent distributor Excel file, in `docs/samples`.                                                                                                                             | Manager  | Week 1, SYS-01    |
| 4   | **The human-only item list** (the “some items” that always need your price quote), and the **credit limit** for each regular customer, in writing.                                                                                                          | Lalitesh | Week 5            |
| 5   | **Getcid and Telegram API** account details used for Microsoft cid today. You paste them yourself into the place HQ names; never into chat or docs.                                                                                                         | Lalitesh | Week 9, SYS-05    |
| 6   | **The numbers:** confirm or correct 300 orders a month against 100 quotes and 50 converted, and the average order value of 2000000 against the ₹10 to 50 lakh band. Also: your busy season.                                                                 | Lalitesh | Before any target |
| 7   | **Low-stock level per brand** for the Key Board, and the validity date your distributor gives per key batch.                                                                                                                                                | Manager  | Week 3, SYS-02    |
| 8   | **Your 10 hours a week**: fixed sittings in the calendar.                                                                                                                                                                                                   | Lalitesh | Every week        |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Read by HQ

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, this repository, this Supabase project and this Vercel project are the only ones LX IT Solution will ever have; every system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: Lalitesh, the manager and the assistant each have their own login and see only what their work needs; Lalitesh sees everything; customers, when they get a login, see only their own orders, keys and invoices; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING RISKY LEAVES: nothing outside the AI-may-act-alone list leaves the system without Lalitesh or the manager; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every key sent, resent, revealed or marked sold, and every action the system takes, is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: Supabase keys, the Getcid and Telegram credentials and the WhatsApp token live only in .env.local and Vercel’s settings, never in code, in chat, in docs or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: balances, credit checks and totals come from Tally and exact tested rules; AI reads, drafts, matches and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Lalitesh’s guardrails.** AI may act alone to: deliver license keys; generate and return Microsoft cid; send the invoice; send the account statement. A person signs off: the price quote for some items. Never automated: payment auto reminders; the price quote of some items. Until the list of “some items” is written, every item that has ever needed a quote is treated as on it, and any price question stops and goes to Lalitesh untouched. Until the credit limit per customer is written, no order is released without his tap.

**LX rules.** Keys are stock: a key is shown in full only to the person sending it, every reveal and resend is logged, and the board shows keys masked. The oldest unused key of a product goes first; for multi-use keys, the one with activations left. A key is never sent twice, never sent without a Tally invoice number, and never sent for a box or physical order. No system drafts a payment reminder or mentions bakaya; payment collection stays with Biz Analyst and a person. Any price or discount line comes only from a price list Lalitesh has approved. Customer messages use the LX Hinglish tone, short, brand first, one ask. Tally stays the book of record; nothing is written into Tally in the first twelve weeks. The figures 300 orders, 100 quotes, 50 converted and 2000000 are unconfirmed: never hard-code them. docs/samples never goes to GitHub. Build in the blueprint’s order; a system starts only when Lalitesh approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Lalitesh can skip this page

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for key photos) through `@supabase/ssr`, deployed on Vercel from `main`, with a preview for every branch. Mobile-first web app added to the home screen. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; later `TALLY_CONNECTOR_URL` and its token, `GETCID_*`, `WHATSAPP_*`, `CRON_SECRET`, `ANTHROPIC_API_KEY`; `.env.example` holds names only. Tally Prime is read through its own XML interface by a small connector on the office computer, chosen with Lalitesh in week 3. WhatsApp only through the WhatsApp Business API with approved templates. Scheduled jobs as Vercel Cron calling protected routes.

### F-00 LX Key Register + Tally link: the starting shape

**profiles** (name, role owner / manager / assistant, active); **brands**; **products** (brand, name, edition, delivery type digital key / key photo / box); **keys** (product, key text, key photo path, single or multi use, activations total and left, validity date, batch, status unused / sold / held, sold to customer, sold date, Tally invoice number, sent time); **customers** (name, WhatsApp number, credit limit set by owner only); **key_events** (append only: loaded, revealed, sent, resent, marked sold, by whom, when); **tally_invoices** (read copy: number, date, customer, items, amount); **settings** (automation switch off by default); **audit_log** (append only). Row Level Security: owner sees all; manager and assistant see keys masked and reveal one at a time, logged; credit limits writable by owner only.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; it applies migrations in order and merges finished work. It never builds a system itself. It writes the opening prompt for every builder session into `docs/session-prompts/` and shows it to Lalitesh in its own box.
- **Builders**, at most two at a time, one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests go in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing session** for the skills (Key Register SOP, Order Desk Skill, Sampark Skill): only `docs/` and `content/`.
- Every screen follows `docs/design/` and sections 03 to 05 of the UI Guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Prepared for Lalitesh Sharma · LX IT Solution · traces to blueprint BOA-2026-LXI-01 Rev A (blueprint audit 14.11.2026).  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
