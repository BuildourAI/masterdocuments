Buildour AI · RatnKamal EnterprisesContinue Building · Rev A

# RATNKAMAL OS CONTINUE BUILDING

Prepared for **Santosh Uttam Mali**. Every sitting after the Starter Guide: you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, and the builders work one system each. Enquiries first, one 9 AM message by week twelve.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test with  
real enquiries–– HQ  
merges–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                 | What it does                                                                                                                                                                                                                                         | Name it                                     |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| **HQ** (always one)     | Keeps the master copy (`main`) and the database: the only session that applies migrations. Writes the opening prompt for every other session, joins finished work, keeps CLAUDE.md, START-NOW and SESSIONS up to date. Never builds a system itself. | `HQ`                                        |
| **Builder** (up to two) | Builds one system from the prompt HQ wrote, in its own copy of the folder on its own branch, touching only its own files. Hands over to HQ when a piece is done.                                                                                     | As HQ names it, e.g. `SYS-02 Quote Builder` |
| **Writing**             | Words, not code: the Enquiry and Quote Skill (qualification script, catalogue map, drafts, follow-ups) and the message templates in Marathi, Hindi and English. Never a price.                                                                       | `SKILLS writing`                            |

Opening a session HQ asked for

HQ shows the prompt in its own box and saves it in `docs/session-prompts/`. In the Claude desktop app’s **Code** tab, start a **new session** on the same `ratnkamal-os` folder, name it as HQ says, paste, send. Each session stays in the list on the left; click to switch.

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

You are HQ for the RatnKamal OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW; where we are against the twelve-week plan; which builder sessions are in progress and on which branch; any handover ready to merge; anything waiting for my approval. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt following the rules in R3 of the Starter Guide, or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Check it with real data you know: one enquiry, one design, one quotation, one batch. Check every new screen against section 03 of the Starter Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then paste to HQ:

HQ · Close the day

Read today’s handovers. For each piece marked ready: check it against CLAUDE.md and its build sheet, apply its migrations to the live database in order, test it as each role, merge it, and tell me what changed on the live app. Update docs/SESSIONS.md and START-NOW, and write today’s note in docs/sessions/.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when on the live app and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from the blueprint and wait for my approval of each; add what you need from me (logins, lists, rules, costs) to START-NOW; decide which systems run as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box. This phase goes live only after my sign-off.

HQ · A session is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · Before any new connection or cost

Before you connect anything new (WhatsApp Business API, IndiaMART, TradeIndia, Justdial, Meta, the CRM, the custom software, Vyapar, the Claude API), tell me in simple words: what it is, why this system needs it, what it costs each month, and what happens if I say no. Then wait for my yes. Any key or login goes only into .env.local and Vercel, and you tell me exactly where to paste it myself.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested at the branch’s test address with real data. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against section 03 of the Starter Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a piece is done.** The builder writes its handover; HQ merges; the live app updates in about two minutes.
4.  **Five real cases first.** The skill is checked against five real enquiry threads; the Quote Builder against five quotations you already sent, price for price.
5.  **Run beside the old way.** The Intake Flow runs beside the manual process for two weeks before it answers alone, as your blueprint says.
6.  **Report-only before trust.** The Day Manager starts by watching, drafting and summarising; it takes on tracking and allocation only after you have trusted its summaries for weeks.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · twelve weeks

| Phase            | HQ                                                                                | Builder A                                                                       | Builder B                                                                             | Writing / you                                                                  |
|------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| **P1** · wk 1–2  | F-00 started in the Starter Guide; merges                                         | Free: the skill comes first                                                     | Free                                                                                  | **SYS-01** Enquiry and Quote Skill; the Team Leader meeting; checklist by hand |
| **P2** · wk 3–4  | **F-00**: the paid CRM revived as the lead record (or Supabase, if it has no API) | **SYS-02** Quote Builder on the rate card and cutting formulas                  | Free                                                                                  | Rate card checked line by line; CRM access                                     |
| **P3** · wk 5–8  | WhatsApp Business API and the lead feeds, with your yes                           | **SYS-03** Enquiry Intake Flow on six channels, two weeks beside the manual way | **SYS-04** Bakaya Reminder Drafts from Vyapar                                         | Approve the bakaya list daily                                                  |
| **P4** · wk 9–12 | Claude API, with your yes                                                         | **SYS-06** Enquiry to Cash Board, then **SYS-05** Job Card Dispatch             | **SYS-07** Team Leader Checklist Collection, then **SYS-08** Day Manager, report-only | Stock minimums; purchase list receiver                                         |

| Phase | Done when (from the blueprint)                                                                                                                                                                                                                                                                                            |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | A new WhatsApp enquiry gets its qualification reply and the catalogue pages for its size drafted by the skill and sent by the Sales Executive or Receptionist, and the Team Leader meeting has been held with the checklist reporting running manually.                                                                   |
| P2    | Every quotation sent in a week came out of the Quote Builder as a PDF with your approval on the price line, and every lead of that month exists as a row in the CRM with a channel, a B2C or B2B tag and an owner.                                                                                                        |
| P3    | Enquiries from WhatsApp, IndiaMART, TradeIndia, Justdial, Meta and the website land in the CRM without anyone typing them, the flow has run beside the manual process for two weeks, and each day’s bakaya reminders went out only after you approved the list.                                                           |
| P4    | At 9 AM you open one message with approvals first, delays second and stock third, the Board shows every batch at its stage, and the morning planning hour is no longer spent collecting: AI and the Team Leaders are managing the routine so you can focus on the future growth and development of RatnKamal Enterprises. |

**THE GATES:** no builder starts before F-00 is merged. The checklist collection waits for the Team Leader meeting and a manual run. The Intake Flow answers alone only after two weeks beside the manual way. Nothing writes into Vyapar. No bakaya message, price or order change goes out without your approval.

**After the twelve weeks, same app, same routine:** months 4 to 6, the Day Manager takes on batch tracking, Team Leader reminders and the draft staff allocation, with stock alerts and the purchase list live → months 6 to 9, ABCD observations and performance checklists in one monthly report, back office job descriptions, and the task manager as their daily list → months 9 to 12, quote-to-order conversion by channel to judge marketing spend, and a repeat order view for B2B builders. Each starts with *“HQ, start the next phase”*.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                             | First appears             | What it means for you                                                                                                                                 |
|----------------------------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**                   | When two builders run     | Pro works for one session at a time; Max gives room for HQ and two builders.                                                                          |
| **Supabase Pro**                 | Before staff use it daily | About \$25 a month: daily backups of every lead, quote and order.                                                                                     |
| **Vercel Pro**                   | Going live                | About \$20 a month; the free plan is for personal use.                                                                                                |
| **WhatsApp Business API**        | P3                        | A number for business sending, Meta verification, approved templates, and a charge per message.                                                       |
| **Lead feeds**                   | P3                        | IndiaMART, TradeIndia and Justdial give lead access on the plans you already pay for; Meta lead forms connect free. HQ checks each before connecting. |
| **Custom software, Vyapar, CRM** | P2 to P4                  | Read access or exports; the custom software’s developer may charge for an export or API.                                                              |
| **Claude API key**               | P3 to P4                  | Needed when the app drafts with nobody at the computer (first replies at night, the 9 AM summary). Billed per use with a monthly limit you set.       |

07

STANDING PROMPTS TO HQ

One line each

- **Rate card changes:** *“From today the rate for \[item\] is changed. Show me which quotations and screens this touches before anything changes.”*
- **New staff member:** *“\[Name\] joins as \[role\] in \[department\]. Show me what they will see, then prepare the login and wait for my OK.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their login now.”*
- **A rule changes:** *“From today \[the rule\]. Update CLAUDE.md and tell me which systems it touches.”*
- **Monthly check:** *“Audit the project against CLAUDE.md and my guardrails, and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** ask three questions. Is every enquiry, quote and batch on the Board true? Did any price, bakaya message or order change go out without you? Did your morning hour get shorter this month? Three yeses: start the next system. Any no: fix that first.

Prepared for Santosh Uttam Mali · RatnKamal Enterprises. Condensed from BuildOur Builder Guides against blueprint BOA-2026-RAT-01 Rev A.  
One record from enquiry to cash. Every price, payment and order change still signed by Santosh.
