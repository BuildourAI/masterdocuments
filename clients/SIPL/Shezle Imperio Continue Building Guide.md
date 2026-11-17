Buildour AI · Shezle ImperioContinue Building · Rev A

# CONTROL CENTER CONTINUE BUILDING

Prepared for **Sangeet Sejpal**. Every sitting after the Starter Guide: you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, builders hand their work back by pull request, and HQ merges. Eight phases, 17.11.2026 to 15.11.2027.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test on web  
and phone–– HQ  
merges–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                 | What it does                                                                                                                                                                                                                            | Name it                           |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| **HQ** (always one)     | Runs on `main`. Owns the live database (the only session that applies migrations), the apps lane and the plan. Writes the opening prompt for every other session, reviews and merges their pull requests. Never builds a system itself. | `HQ`                              |
| **Builder** (up to two) | Builds one system on its own branch from the prompt HQ wrote, touching only its own files. Writes migrations but never applies them. Opens a pull request with a handover when a piece is finished.                                     | As HQ names it, e.g. `SYS-03 CRM` |
| **Writing**             | Words, not code: the Deal Wall Skill from your two one-hour chats with Claude, the dispatch checklist, message templates, later the SOPs. Never a price.                                                                                | `DEAL WALL writing`               |

Opening a session HQ asked for

HQ shows you the prompt in its own box and saves it in `docs/session-prompts/`. Open **claude.ai/code** → **New session** → repository `enrosl/SIPL-Global-Business-OPS-ERP`, branch `main`. Rename the session with the name HQ gave, paste the prompt, send. Your sessions stay in the list on the left; click to switch.

Why this does not get messy

Each builder works in its own copy on its own branch, so two sessions never type into the same file. Every branch gets a **preview address** on Vercel, so you test on your phone before anything reaches the live app. Only HQ merges into `main` and only HQ changes the live database, and the automatic checks must be green first, so the wall is never touched by two hands at once.

**TWO BUILDERS, NOT MORE.** At 5 to 6 hours a week, two builders beside HQ is what you can follow, test and answer. If sessions pause for usage limits, run one.

02

EVERY SITTING

Same routine, every time

1

Paste to HQ

**Open the day.** Click your `HQ` session and paste:

HQ · Open the day

You are HQ for Control Center. Pull the latest main. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/, and list the open pull requests and their checks. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW (security first); where we are against the phase dates; which pull requests are ready; any request waiting for you; anything waiting for my price or approval. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt (following the rules in R3 of the Starter Guide) or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its preview address. Open it on your phone and check one real lot, buyer, market name or sample you know. Sign in with a test login of another role and check that what it may not see is simply not there. Check every new screen against section 03 of the Starter Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push, update your handover and today's note. If this piece is finished and the checks are green, open a pull request to main.` Then paste to HQ:

HQ · Close the day

Review today’s pull requests against CLAUDE.md and the build sheets. For each one ready with green checks: apply its migrations to the live database in order, run the role-by-role tests and the security advisor, then merge it or tell me when to click Merge. If a screen changed, start a new Android and iOS test build. Update docs/SESSIONS.md and START-NOW, write today’s note in docs/sessions/, and tell me in five lines what changed on the live app and what the next sitting should do.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when against the live app, as each role, and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from Blueprint Rev C and wait for my approval of each; list what you need from me (rules, lists, accounts, costs) as lines in START-NOW; decide which systems run side by side as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box.

HQ · A builder is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · New Android and iOS test build

Start the “Build apps” workflow on main. When it finishes, tell me how to install the Android test build and the iPhone TestFlight build on my phone, and what changed since the last build. Nothing goes to a store listing without my OK.

HQ · Before any new connection or cost

Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month for us, and what happens if I say no. Then wait for my yes. Any key goes only into Supabase secrets, Vercel settings or GitHub repository secrets, and you tell me exactly where to paste it myself.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested on the branch preview against one real record. Surprises go in `docs/rules-i-learned.md`.
2.  **Test the wall every time,** as each role. A sales login never shows a supplier; a purchase login never shows a buyer; a refused action says it was refused, not that it worked.
3.  **Check the screen** against section 03 of the Starter Guide, on the web and in the phone app. If it looks like homework: *“Change only the design, following docs/design/LOOK.md. Do not touch the features.”*
4.  **Merge when a piece is done.** The builder opens the pull request; the checks go green; HQ applies its migrations, tests and merges; the live app updates in about two minutes, the phone apps at the next build.
5.  **Five real cases, then the team.** CRM: your own calls for a week, then sales. Board and field feed: one field guy for a week, then all four and the back office. Trigger: one product line first. Second company: a test company first.
6.  **Draft before trust.** The Deal Clerk only drafts and reports to you for the first weeks, and moves up a tier (observe, draft, act inside, act outside) only when you say so. The builder publishes nothing without your approval. The ledger runs beside Tally until three months match.

05

THE BUILD ORDER, SESSION BY SESSION

From Blueprint Rev C

[TABLE]

| Phase   | Done when (Blueprint Rev C)                                                                                                                                                                                                                                                                                           |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 seal | Sales cannot open a supplier or work out that two names are one product, tested as every role · staff can sign in at a staff address · nothing submits without its approval.                                                                                                                                          |
| P2      | The Deal Wall Skill exists in your words with the price line blank · any product and buyer typed into a phone returns the name and pack, or a red stop · contacts are imported with duplicates caught · every call is logged, five products as five follow-ups.                                                       |
| P3      | Every live opportunity and sample is a card with an owner, a next action and a date · the field team and back office take the day’s tasks from the board, on the app · each post sees its score and signs a weekly review · you see everything from your phone abroad · the CRM and task tool are no longer paid for. |
| P4      | Every deal shows booked, received and still to receive on both sides · dispatch waits for the advance unless you release it · for one product line, a confirmed lot opens its own sales cards and nothing leaves until you enter the price and tap approve.                                                           |
| P5      | Quotations, orders and invoices print with real names and HSN on statutory papers · the accountant imports the Tally export each week · the clerk’s 6 PM report reaches you daily, every reply with a price is held for you, and once you allow it, follow-ups go through WhatsApp Business or email.                 |
| P6      | Samples in and out run with codes and labels · the dispatch checklist is ticked before every truck moves · loading, weighment and transport papers print with origin masked where the law allows · stock shows by location with a QR per lot.                                                                         |
| P7      | A daily km tracker is built in the builder without code and approved by you · every publish can be rolled back · the ledger posts every document from one path, beside Tally.                                                                                                                                         |
| P8      | Every post shows human, AI or vacant, with weekly statistics counted by the system · SOPs carry read receipts and exit withdraws access the same day · the second company is live and proven separate · the ledger starts its three-month parallel run toward cut-over on 1 April 2028.                               |

**THE GATES:** no builder starts before the seal is merged. No staff invite before the domain, mail service and seal. The board waits for P2’s names and contacts. The trigger waits for clean lots and buyer tags. The money pipeline never posts to the books. The clerk sends nothing until you have read its drafts for a few weeks. The builder never edits the wall, deal money, the ledger or tax. Tally retires only on 1 April 2028, and only if three months match. **If the Deal Wall chats or the lists slip past week 1**, HQ moves to the fallback dates in section 03 of the blueprint (P2 by 26 Dec, P3 by 23 Jan, P4 by 13 Feb); the order never changes.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                                 | First appears       | What it means for you                                                                                                                                                                            |
|--------------------------------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Vercel Pro**                       | Now                 | About \$20 a month. The free Hobby plan is for personal projects.                                                                                                                                |
| **Supabase Pro**                     | Before staff log in | About \$25 a month: daily backups, leaked-password protection, room for COAs, photos and videos.                                                                                                 |
| **Domain and mail service**          | P1 seal             | A domain (about ₹1,000 a year) or a company sub-address lets staff in; a mail service sends sign-in emails, usually free at your volume.                                                         |
| **Google Play and Apple**            | P2                  | Play developer account \$25 once; Apple Developer Program \$99 a year; both in the company’s name with a D-U-N-S number. iPhone builds run on a cloud Mac: a few dollars a month or a free tier. |
| **Courier tracking**                 | P3 to P5            | Depends on your couriers: some give free tracking, some need a paid service. HQ shows the options.                                                                                               |
| **Claude API key**                   | P5, Deal Clerk      | The clerk works at 8 AM and 6 PM with nobody at the computer, which your Claude plan does not cover. Billed per use with a monthly limit you set; the key goes only into Supabase secrets.       |
| **WhatsApp Business API** (optional) | P5                  | Only if the clerk should send on WhatsApp: a Business account, Meta verification, approved templates, paid messages. Personal WhatsApp is never automated.                                       |
| **Label printer, QR**                | P6                  | A label printer for stickers, box labels and QR codes; the phone apps scan them.                                                                                                                 |

07

STANDING PROMPTS TO HQ

One line each

- **New staff member:** *“\[Name\] joins as \[role\], on an \[Android / iPhone\]. Show me exactly what this role will and will not see, then prepare the grant for \[email\] and wait for my OK.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their access now, sign them out of every phone, and show me what they could see in the last 30 days.”*
- **A rule changes:** *“From today \[the rule\]. Update CLAUDE.md and tell me which systems and roles it touches before anything changes.”*
- **A name clash:** *“Show me every buyer shown more than one name for the same product, and every override, with its reason.”*
- **Monthly check:** *“Run the security advisor and the role-by-role tests, audit the project against CLAUDE.md and my guardrails, and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** open Control Center on your phone, ideally from outside the office, and ask three questions. Is every lot, deal, sample and follow-up on it true? Did any price, message or document leave without your tap? Could a staff member see anything on the other side of the wall? Two yeses and a no: start the next system. Anything else: fix that first.

Prepared for Sangeet Sejpal · Shezle Imperio Private Limited. Condensed from BuildOur Builder Guides against blueprint BOA-2026-SHE-01 Rev C and the setup health check of 17.11.2026.  
One record, one app on web, Android and iOS, one wall. Every price, every outgoing message and every decision about people stays human.
