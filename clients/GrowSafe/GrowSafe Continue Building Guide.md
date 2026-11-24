Buildour AI · GrowSafeContinue Building · Rev A

# GROWSAFE OS CONTINUE BUILDING

Prepared for **Akash Dubey**. Every sitting after the Starter Guide: on the Tally PC you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, and the builders work one system each. The Tally Bridge first, the sales team second, the customer app by week twelve.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test against  
Tally–– HQ  
merges–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                                  | What it does                                                                                                                                                                                                                                                                                        | Name it                                   |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| **HQ** (always one)                      | Keeps the master copy (`main`) and the database: the only session that applies migrations. Writes the opening prompt for every other session, joins finished work, keeps CLAUDE.md, START-NOW and SESSIONS up to date. Never builds a system itself.                                                | `HQ`                                      |
| **BRIDGE** (the first builder)           | Builds the F-00 GrowSafe Tally Bridge on the Tally PC: the connector, the full load, the incremental sync, the daily reconciliation, and last the write-back of approved vouchers. Hands each piece to HQ.                                                                                          | `BRIDGE F-00 Tally Bridge`                |
| **Builder** (up to two, BRIDGE included) | Builds one system from the prompt HQ wrote, in its own copy of the folder on its own branch, touching only its own files. Hands over to HQ when a piece is done.                                                                                                                                    | As HQ names it, e.g. `SYS-02 Field Force` |
| **Writing**                              | Words, not code. **RULEBOOKS**: the Dealer Desk Rulebook, Formulation and Compliance rules, the Field Sales SOP and KRA rules, in Hindi, English and the market languages. **PEOPLE DESK**: SOPs, KRAs and KPIs per role, hiring simulations, onboarding. Its screens are built later by a builder. | `RULEBOOKS writing`, `PEOPLE DESK`        |

Opening a session HQ asked for

HQ shows the prompt in its own box and saves it in `docs/session-prompts/`. In the Claude desktop app’s **Code** tab, on the Tally PC, start a **new session** on the same local `GrowSafe-OS` folder, name it as HQ says, paste, send. Each session stays in the list on the left; click to switch. Never open GrowSafe sessions in a cloud environment: a cloud session cannot reach Tally.

Why this does not get messy

Each builder works in its own copy of the code (a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so a system is checked before it reaches the live app. Only HQ joins work into the live copy and only HQ changes the database.

**ONE BUILDER ON PRO, TWO ON MAX.** BRIDGE counts as a builder. If sessions pause for usage limits, run one. The writing sessions are light and can run beside a builder. HQ can also run a small piece of work in its own background worktree when you prefer not to open another session; it still hands over the same way.

02

EVERY SITTING

Same routine, every time

1

Paste to HQ

**Open the day.** On the Tally PC, with TallyPrime open: Code tab → your `HQ` session, and paste:

HQ · Open the day

You are HQ for GrowSafe OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW; where we are against the twelve-week plan; the Bridge’s last sync time and yesterday’s reconciliation result; which builder sessions are in progress and on which branch; any handover ready to merge; anything waiting for my approval or signature. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt following the rules in R3 of the Starter Guide, or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Check it against Tally with data you know: one dealer’s ledger, one invoice, one batch in one godown, one salesman’s day. Check every new screen against section 03 of the Starter Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then paste to HQ:

HQ · Close the day

Read today’s handovers. For each piece marked ready: check it against CLAUDE.md and its build sheet, apply its migrations to the live database in order, test it as each role, merge it, and tell me what changed on the live app. Update docs/SESSIONS.md and START-NOW, and write today’s note in docs/sessions/.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when on the live app and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from blueprint Rev B and wait for my approval of each; add what you need from me (lists, thresholds, rates, accounts, costs) to START-NOW; decide which systems run as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box.

HQ · Tally and the app do not match

Today’s reconciliation shows a mismatch. Read the reconciliations table and the last sync runs. Tell me in simple words which check failed (trial balance, stock by godown and batch, or outstanding by party), which company, ledger, batch or party, both figures, and the likely cause. Do not change any data in Tally or in Supabase. Give me two or three options, and a prompt for the BRIDGE session to carry out the one I choose.

HQ · A session is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · Before any new connection or cost

Before you connect anything new (the payment gateway, the Delhivery API, the WhatsApp Business API, the Claude API), tell me in simple words: what it is, why this system needs it, what it costs each month, and what happens if I say no. Then wait for my yes. Any key or login goes only into .env.local and Vercel, and you tell me exactly where to paste it myself.

HQ · Can I switch an old tool off?

I want to stop **\[the old sync script / Unolo / AgriCost.In / Biz Analyst / the old Supabase project\]**. Check that its replacement has run alongside it for the agreed time and compare what both showed. Tell me honestly whether anything the old tool did is not yet covered. Make a list of what to export or keep first. Do not delete or switch off anything yourself; tell me the steps and wait for my yes.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested at the branch’s test address with real data from Tally. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against section 03 of the Starter Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a piece is done.** The builder writes its handover; HQ merges; the live app updates in about two minutes.
4.  **Tally first.** The Bridge reads before it writes: full history, then incremental, then the daily reconciliation. The write-back of approved vouchers is the last piece, tested with one approved test sales order you can see in Tally.
5.  **One state first.** Field Force starts in the pilot state with Unolo running alongside for one month; the Customer App starts with the pilot dealer group and one D2C product set.
6.  **The old tool runs beside the new one** until the new one is trusted: the old sync script until the Bridge matches Tally for 7 days; Unolo for one month in the pilot state; AgriCost.In for one month side by side; Biz Analyst until you trust the owner view. Then each is switched off with your yes. Nothing is deleted.
7.  **Accounts stays in TallyPrime.** Payroll and HR accounting too. Every other team moves into GrowSafe OS one system at a time.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app, the others, or Tally.

05

THE BUILD ORDER, SESSION BY SESSION

Blueprint Rev B · from 25.11.2026

[TABLE]

| Phase | Done when (from blueprint Rev B)                                                                                                                                                                                                                                                                   |
|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | The full history is loaded, the three reconciliations (trial balance, stock by godown and batch, outstanding by party) match for 7 days, the incremental sync lag is under the agreed minutes, and one approved test sales order is written back and visible in Tally; and Rulebooks v1 is signed. |
| P2    | Field Sales Officers in one state mark attendance and visits only by geo-tagged check-in, see their daily sales and collection from Tally and their TA from verified distance; Unolo ran in parallel, then is off.                                                                                 |
| P3    | You open one owner view instead of Biz Analyst; every SKU below your threshold is on the red list with a draft price list you approved; near-expiry stock by godown is read every Monday; AgriCost.In and Biz Analyst are switched off.                                                            |
| P4    | Pilot dealers order, download ledgers and buy liquidation deals in the app; D2C buyers pay and track Delhivery shipments; approved orders appear in Tally as sales orders with no retyping.                                                                                                        |

Your 10 December 2026 date, honestly

The Bridge’s read side, loaded and reconciled, is targeted live by 10.12.2026. Dealer self-service and collection-ROI tracking follow in phases two to four, by about 16.02.2027.

**THE GATES:** no builder but BRIDGE starts before the F-00 starting tables are merged. The Scorecard shows sales and collection only after the Bridge matches Tally; Field Force attendance and visits can start before that. Nothing is written into Tally except an approved draft voucher through the Bridge. Month-end payouts wait for your signature; price lists and recipes change only with your yes. D2C sells only the non-restricted products you list. No old tool is switched off before its replacement has run alongside, and nothing is deleted without your yes.

**After the twelve weeks, months four to twelve, same app, same routine:** the Credit Note Router, the Collection Reminder Flow, the GrowSafe Dealer Munshi (a WhatsApp agent), the Sales ROI Board, the Batch Release to Dispatch Flow, the Stock Planner and the Field Reviewer, each starting in draft-only mode and reporting to you. Each starts with *“HQ, start the next phase”*.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                                 | First appears         | What it means for you                                                                                                                     |
|--------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**                       | When two builders run | Pro works for one build session at a time; Max gives room for HQ, BRIDGE and a second builder.                                            |
| **Supabase Pro**                     | Setup, from the start | About \$25 a month: room for four to five years of Tally data, daily backups, and no pausing when idle.                                   |
| **Vercel Pro**                       | Going live            | About \$20 a month; the free plan is for personal use.                                                                                    |
| **Payment gateway**                  | P4, Customer App      | You choose the gateway; it charges per payment as its own plan says. HQ shows the cost before connecting it.                              |
| **Delhivery account and API**        | P4, Customer App      | For D2C shipping and tracking, and dealer dispatches if you choose; charged per shipment as agreed with Delhivery.                        |
| **WhatsApp Business API** (optional) | Months 4 to 12        | For the Dealer Munshi and reminders sent from the system: a business number, Meta verification, approved templates, a charge per message. |
| **Claude API key**                   | Months 4 to 12        | For the AI employees that work with nobody at the computer. Billed per use with a monthly limit you set.                                  |
| **What stops**                       | Weeks 3 to 9          | Unolo, AgriCost.In and Biz Analyst, and the old Supabase project, once each replacement is trusted and you say yes.                       |

07

STANDING PROMPTS TO HQ

One line each

- **Change a guardrail:** *“Change my guardrail on \[what\] to \[my new words\]. Show me the old and new lines in CLAUDE.md and what changes in the app, and wait for my OK.”*
- **Bridge check:** *“Show me today’s reconciliation and the last sync time, in simple words, and anything waiting in the write-back queue.”*
- **New salesman or staff member:** *“\[Name\] joins as \[role\] in \[state\]. Show me what they will see, then prepare the login and wait for my OK.”*
- **New dealer or retailer:** *“Onboard \[dealer\] with GSTIN \[number\] and licence \[number\]. Show me his ledger and credit limit from Tally before he gets a login.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their login now.”*
- **Monthly check:** *“Audit the project against CLAUDE.md and my guardrails, and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** ask three questions. Did Tally and the app match on all three reconciliations this month? Did anything reach Tally, or any payout or price change go out, without the approval it needs? Did you open Unolo, AgriCost.In or Biz Analyst less this month than last? Three yeses: start the next system. Any no: fix that first.

Prepared for Akash Dubey · GrowSafe. Condensed from BuildOur Builder Guides against blueprint BOA-2026-GRO-01 Rev B.  
One GrowSafe OS on Tally’s data: the Bridge first, the sales team second. Nothing enters Tally without approval, and accounts stays in TallyPrime.
