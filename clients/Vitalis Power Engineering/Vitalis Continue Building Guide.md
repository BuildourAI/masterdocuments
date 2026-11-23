Buildour AI · Vitalis Power EngineeringContinue Building · Rev A

# VITALIS OS CONTINUE BUILDING

Prepared for **Jasveen Singh**. Every sitting after the Starter Guide: you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, and the builders work one system each. Store first, every quote held for your tap by week twelve.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test with  
real slips–– HQ  
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
| **Builder** (up to two) | Builds one system from the prompt HQ wrote, in its own copy of the folder on its own branch, touching only its own files. Hands over to HQ when a piece is done.                                                                                     | As HQ names it, e.g. `SYS-01 Issue Slip` |
| **Writing**             | Words, not code: the Store SOP, the Work Ownership SOP and your follow-up message rhythm. No price in any draft.                                                                                                                                     | `SKILLS writing`                         |

Opening a session HQ asked for

HQ shows the prompt in its own box and saves it in `docs/session-prompts/`. In the Claude desktop app’s **Code** tab, start a **new session** on the same `vitalis-os` folder, name it as HQ says, paste, send. Each session stays in the list on the left; click to switch.

Why this does not get messy

Each builder works in its own copy of the code (a **worktree**) on its own **branch**, so two sessions never type into the same file. Each branch gets its own test address on Vercel, so a system is checked before it reaches the live app. Only HQ joins work into the live copy and only HQ changes the database.

**ONE BUILDER ON PRO, TWO ON MAX.** If sessions pause for usage limits, run one. HQ can also run a small piece of work in its own background worktree when you prefer not to open another session; it still hands over the same way.

02

EVERY SITTING

Same routine, every time

1

Paste to HQ

**Open the day.** Code tab → your `HQ` session, and paste:

HQ · Open the day

You are HQ for the Vitalis OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW; where we are against the twelve-week plan; which builder sessions are in progress and on which branch; any handover ready to merge; anything waiting for my tap or signature. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt following the rules in R3 of the Starter Guide, or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Check it with real data you know: one item on the rack, one job, one quote. Check every new screen against section 03 of the Starter Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then paste to HQ:

HQ · Close the day

Read today’s handovers. For each piece marked ready: check it against CLAUDE.md and its build sheet, apply its migrations to the live database in order, test it as each role, merge it, and tell me what changed on the live app. Update docs/SESSIONS.md and START-NOW, and write today’s note in docs/sessions/.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when on the live app and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from the blueprint and wait for my approval of each; add what you need from me (lists, names, rules, costs) to START-NOW; decide which systems run as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box.

HQ · A session is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · Before any new connection or cost

Before you connect anything new (the WhatsApp Business API, the Claude API, a label printer), tell me in simple words: what it is, why this system needs it, what it costs each month, and what happens if I say no. Then wait for my yes. Any key or login goes only into .env.local and Vercel, and you tell me exactly where to paste it myself.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested at the branch’s test address with real data. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against section 03 of the Starter Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a piece is done.** The builder writes its handover; HQ merges; the live app updates in about two minutes.
4.  **One counter, one floor first.** The Issue Slip App starts at the store counter with the storekeeper; the Job Card Tracker starts with one supervisor on one floor, then the rest. No training beyond one shift.
5.  **The register runs beside the app** until the first physical count matches the book item by item; then the kaccha register retires.
6.  **Boards wait for clean data.** No board is switched on before week six, because a board over messy slips shows nothing worth reading.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · twelve weeks

[TABLE]

| Phase | Done when (from the blueprint)                                                                                                                                                                                            |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | Every item on the rack exists as a row with unit, location, reorder level and last supplier; the Store SOP and the Work Ownership SOP exist on paper in plain words; the three clarifying questions have written answers. |
| P2    | Every slip issued in the week carries an item, a job number and a name, every inward challan has a GRN, and the first full physical count has been laid against the book item by item.                                    |
| P3    | The Store Board lists today’s items below reorder level without a call to the storekeeper, and every open job step on one supervisor’s floor has a named owner and a target date, closed with a photo.                    |
| P4    | At 9 AM you open one screen showing every quote sent this month, which are due a call today and the drafted message waiting for your nod, with hours saved measured against the figures on the sheet, not against hopes.  |

**THE GATES:** no builder starts before F-00 is merged. The Store Board waits for clean slips and a physical count. The Floor Board waits for the first supervisor’s job steps. No message leaves without your tap, no stock changes without your signed variance note, and no system ever rates a worker, sets wages or prices anything.

**After the twelve weeks, months four to twelve, same app, same routine:** the named AI employees in your blueprint (the Quote Chaser, the Shift Munshi and the Bhandari), the Daily Accountability Loop and the Reorder Alert Flow, each starting in draft-only mode and reporting to you. Each starts with *“HQ, start the next phase”*.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                                 | First appears                  | What it means for you                                                                                                                                                       |
|--------------------------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**                       | When two builders run          | Pro works for one session at a time; Max gives room for HQ and two builders.                                                                                                |
| **Supabase Pro**                     | Before the store uses it daily | About \$25 a month: daily backups of every slip, GRN and job.                                                                                                               |
| **Vercel Pro**                       | Going live                     | About \$20 a month; the free plan is for personal use.                                                                                                                      |
| **Label printer** (optional)         | P2                             | Labels for racks and slips if you want them scanned; not required to start.                                                                                                 |
| **WhatsApp Business API** (optional) | P4                             | Only if follow-ups should leave from the system rather than from your phone after your tap: a business number, Meta verification, approved templates, a charge per message. |
| **Claude API key**                   | Months 4 to 12                 | For the AI employees that work with nobody at the computer. Billed per use with a monthly limit you set.                                                                    |

07

STANDING PROMPTS TO HQ

One line each

- **My guardrails:** *“Here are my three guardrails in my own words: \[what AI may do alone\], \[what a person signs off\], \[what is never automated\]. Replace the careful default in CLAUDE.md and tell me what changes.”*
- **New item or supplier:** *“Add \[item / supplier\] with \[unit, location, reorder level\]. Show me before it is saved.”*
- **New staff member:** *“\[Name\] joins as \[role\]. Show me what they will see, then prepare the login and wait for my OK.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their login now.”*
- **Monthly check:** *“Audit the project against CLAUDE.md and my guardrails, and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** ask three questions. Does the book match the rack on a spot count? Did any message or stock change go out without your tap or signature? Did you ask your supervisors fewer questions this month than last? Three yeses: start the next system. Any no: fix that first.

Prepared for Jasveen Singh · Vitalis Power Engineering Private Limited. Condensed from BuildOur Builder Guides against blueprint BOA-2026-VIT-01 Rev A.  
One record, three pieces: store, floor, quotes. Nothing rates a worker, sets a price or changes stock without Jasveen.
