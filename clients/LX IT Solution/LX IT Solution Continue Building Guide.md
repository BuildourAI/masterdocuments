Buildour AI · LX IT SolutionContinue Building · Rev A

# LX OS CONTINUE BUILDING

Prepared for **Lalitesh Sharma**. Every sitting after the Starter Guide: you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, and the builders work one system each. Keys first, calls off your phone by week twelve.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test with  
real keys–– HQ  
merges–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                 | What it does                                                                                                                                                                                                                                         | Name it                                  |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| **HQ** (always one)     | Keeps the master copy (`main`) and the database: the only session that applies migrations. Writes the opening prompt for every other session, joins finished work, keeps CLAUDE.md, START-NOW and SESSIONS up to date. Never builds a system itself. | `HQ`                                     |
| **Builder** (up to two) | Builds one system from the prompt HQ wrote, in its own copy of the folder on its own branch, touching only its own files. Hands over to HQ when a piece is done.                                                                                     | As HQ names it, e.g. `SYS-01 Key Loader` |
| **Writing**             | Words, not code: the Key Register SOP, the Order Desk Skill, the Sampark Skill and the message templates in the LX Hinglish tone.                                                                                                                    | `SKILLS writing`                         |

Opening a session HQ asked for

HQ shows the prompt in its own box and saves it in `docs/session-prompts/`. In the Claude desktop app’s **Code** tab, start a **new session** on the same `lx-os` folder, name it as HQ says, paste, send. Each session stays in the list on the left; click to switch.

Why this does not get messy

Each builder works in its own copy of the code (a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so a system is checked before it reaches the live app. Only HQ joins work into the live copy and only HQ changes the database.

**TWO BUILDERS, NOT MORE.** On Claude Pro, run one builder at a time; on Max, two. If sessions pause for usage limits, run one.

02

EVERY SITTING

Same routine, every time

1

Paste to HQ

**Open the day.** Code tab → your `HQ` session, and paste:

HQ · Open the day

You are HQ for the LX OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW; where we are against the twelve-week plan; which builder sessions are in progress and on which branch; any handover ready to merge; anything waiting for my price, credit limit or approval. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt following the rules in R3 of the Starter Guide, or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Check it with real data you know: one brand’s keys, one customer, one Tally invoice. Check every new screen against the UI Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then paste to HQ:

HQ · Close the day

Read today’s handovers. For each piece marked ready: check it against CLAUDE.md and its build sheet, apply its migrations to the live database in order, test it as owner, manager and assistant, merge it, and tell me what changed on the live app. Update docs/SESSIONS.md and START-NOW, and write today’s note in docs/sessions/.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when on the live app and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from the blueprint and wait for my approval of each; add what you need from me (lists, accounts, rules, costs) to START-NOW; decide which systems run as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box.

HQ · A session is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · Before any new connection or cost

Before you connect anything new (Tally, WhatsApp Business API, Getcid, a courier, the Claude API), tell me in simple words: what it is, why this system needs it, what it costs each month, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to paste it myself.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested at the branch’s test address with real data. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against the UI Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a piece is done.** The builder writes its handover; HQ merges; the live app updates in about two minutes.
4.  **One brand first, then all.** The Key Loader and the Dispatch Flow start on one brand. The manager watches it for a few days before the next brand goes on.
5.  **Run beside the old way.** For one week the manager keeps the Google Sheet and the Key Board side by side; when they match for a week, the sheet is retired for keys.
6.  **Nothing sends before it is trusted.** The Dispatch Flow and the Getcid link start with a Send button the manager presses; they send on their own only after you say so, and only for what is on your AI-may-act-alone list.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · twelve weeks

[TABLE]

| Phase | Done when (from the blueprint)                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | Every unused key LX holds exists as one row in the register with brand, product, single or multi use, and sold or unsold, and the Google Sheet of keys has not been opened for a week.                                        |
| P2    | The manager opens the Key Board at 9 AM and every key sold this week shows the customer name, the Tally invoice number and the WhatsApp sent time, with the red list empty or being cleared.                                  |
| P3    | For every brand, a software invoice saved in Tally puts the key on the customer’s WhatsApp and marks it sold without anyone typing a key, and the only keys waiting are the ones on the human-only list.                      |
| P4    | Microsoft cid, invoice and statement questions are answered by the manager from the Order Flow Board and the Getcid link, not by you, and you have had a first full week with no delivery, invoice or cid call on your phone. |

**THE GATES:** no builder starts before F-00 is merged. The Dispatch Flow waits for a clean register and the Tally link. Keys send on WhatsApp only through the Business API number, so start it in week 1. Nothing writes into Tally in these twelve weeks. No system ever sends a payment reminder.

**After the twelve weeks, same app, same routine:** the LX Customer Order and CID App with customer login and invoice shelf, retiring antivirusempire.com → the Weekly Update Composer, Weekly Sampark Flow and Customer Pulse Board on the WhatsApp Business API, then Meta spend stops → Anvi, the LX Order Clerk → LX Key Keeper and the Sampark Agent → your test: one full month with no calls on your phone. Each starts with *“HQ, start the next phase”*.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                      | First appears         | What it means for you                                                                                                                                                                                             |
|---------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**            | When two builders run | Pro works for one session at a time; Max gives room for HQ and two builders.                                                                                                                                      |
| **Supabase Pro**          | When real keys go in  | About \$25 a month: daily backups. Your keys are stock; a lost database is lost stock.                                                                                                                            |
| **Vercel Pro**            | Going live            | About \$20 a month; the free plan is for personal use.                                                                                                                                                            |
| **Tally connector**       | P2                    | Tally runs on your office computer. The app reads it through Tally’s own data interface, which needs that computer on and a small connector program, or a paid connector service. HQ shows the options and costs. |
| **WhatsApp Business API** | P3                    | A number for business sending, Meta verification, approved templates, and a charge per message. Your current phone-app number cannot send templates.                                                              |
| **Getcid**                | P4                    | The account you already use for Microsoft cid; no new cost unless its plan limits calls.                                                                                                                          |
| **Claude API key**        | After week 12         | Only when the app drafts with nobody at the computer (Anvi, the Sampark Agent). Billed per use with a monthly limit you set.                                                                                      |

07

STANDING PROMPTS TO HQ

One line each

- **New brand or product:** *“Add \[brand / product\], delivery type \[digital key / key photo / box\]. Show me what changes before anything is loaded.”*
- **New staff member:** *“\[Name\] joins as \[manager / assistant\]. Show me what they will see, then prepare the login and wait for my OK.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their login now and show me every key they revealed or sent in the last 30 days.”*
- **A rule changes:** *“From today \[the rule, the item list or a credit limit\]. Update CLAUDE.md and tell me which systems it touches.”*
- **Monthly check:** *“Audit the project against CLAUDE.md and my guardrails, check the key log for anything sent twice or without an invoice, and report in simple words.”*

**THE MONTHLY TEST:** ask three questions. Is every key on the board true against Tally and the distributor files? Did any price, credit release or payment message go out without you? Did your phone ring less this month than last? Three yeses: start the next system. Any no: fix that first.

Prepared for Lalitesh Sharma · LX IT Solution. Condensed from BuildOur Builder Guides against blueprint BOA-2026-LXI-01 Rev A.  
One register, one app, keys first. Every price, every credit limit and every payment conversation stays human.
