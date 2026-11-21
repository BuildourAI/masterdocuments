Buildour AI · Manshu ComtelContinue Building · Rev A

# MANSHU OS CONTINUE BUILDING

Prepared for **Mahendra Manerikar**. Every sitting after the Starter Guide: you open **HQ**, HQ tells you which sessions to run and **gives you each one’s prompt**, and the builders work one system each. The Estimator first, a week away by week twelve.

Open  
HQ–– HQ gives  
the prompts–– Builders  
build–– Test with  
real SLDs–– HQ  
merges–– Next  
system

[TABLE]

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

01

HOW THE SESSIONS WORK

Read once

| Session                 | What it does                                                                                                                                                                                                                                         | Name it                                 |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **HQ** (always one)     | Keeps the master copy (`main`) and the database: the only session that applies migrations. Writes the opening prompt for every other session, joins finished work, keeps CLAUDE.md, START-NOW and SESSIONS up to date. Never builds a system itself. | `HQ`                                    |
| **Builder** (up to two) | Builds one system from the prompt HQ wrote, in its own copy of the folder on its own branch, touching only its own files. Hands over to HQ when a piece is done.                                                                                     | As HQ names it, e.g. `SYS-01 Estimator` |
| **Writing**             | Words, not code: the XL3 Costing Skill, the Finalised-Project Material Skill and the Route Card Skill. Margin and price always blank.                                                                                                                | `SKILLS writing`                        |

Opening a session HQ asked for

HQ shows the prompt in its own box and saves it in `docs/session-prompts/`. In the Claude desktop app’s **Code** tab, start a **new session** on the same `manshu-os` folder, name it as HQ says, paste, send. Each session stays in the list on the left; click to switch.

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

You are HQ for the Manshu OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not ticked in START-NOW; where we are against the twelve-week plan; which builder sessions are in progress and on which branch; any handover ready to merge; anything waiting for my price or signature. Then tell me which sessions to run today (at most two builders, plus writing if needed), and for each one give me its prompt, ready to paste, in its own box: a new opening prompt following the rules in R3 of the Starter Guide, or a continue prompt for a session that already exists. Save new ones in docs/session-prompts/. Do nothing else until I say OK.

2

You do this

**Open the sessions HQ named** and paste each one’s prompt. For a session that already exists, click it in the list and paste the continue prompt HQ gave.

3

You do this

**Go round the sessions.** Answer whichever is waiting. Each builds one small finished thing per sitting and gives its test address. Check it with real data you know: one SLD, one estimate you already priced by hand, one project. Check every new screen against section 03 of the Starter Guide.

4

Paste to each builder, then HQ

**Close the day.** In each builder: `Commit and push your branch, update your handover file and today's note.` Then paste to HQ:

HQ · Close the day

Read today’s handovers. For each piece marked ready: check it against CLAUDE.md and its build sheet, apply its migrations to the live database in order, test it as each role, merge it, and tell me what changed on the live app. Update docs/SESSIONS.md and START-NOW, and write today’s note in docs/sessions/.

03

THE HQ PROMPTS

Keep these handy · HQ writes the rest

HQ · Start the next phase

Phase **\[P-number\]** starts now. Check the previous phase’s done-when on the live app and tell me honestly what is not met. Then, for this phase: write or update the build sheet for each system from the blueprint and wait for my approval of each; add what you need from me (tables, lists, names, costs) to START-NOW; decide which systems run as Builder A and Builder B; and give me the opening prompt for each session, ready to paste, in its own box.

HQ · A session is stuck or wrong

The **\[session name\]** session is stuck or going wrong. Read its branch, handover and latest note. Tell me in simple words what is broken and give me two options: fix forward, or go back to its last good commit. Then give me a prompt to paste into that session to carry out what I choose.

HQ · Before any new connection or cost

Before you connect anything new (the Claude API, the WhatsApp Business API, the company email, a label or route card printer), tell me in simple words: what it is, why this system needs it, what it costs each month, and what happens if I say no. Then wait for my yes. Any key or login goes only into .env.local and Vercel, and you tell me exactly where to paste it myself.

04

BUILD, TEST, SWITCH ON

The same moves for every system

1.  **One finished thing per sitting,** tested at the branch’s test address with real data. Surprises go in `docs/rules-i-learned.md`.
2.  **Check the screen** against section 03 of the Starter Guide. If it looks like homework: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Merge when a piece is done.** The builder writes its handover; HQ merges; the live app updates in about two minutes.
4.  **Test against work already done.** The Estimator is checked against the three SLDs whose estimates your engineers already finished: feeder for feeder, enclosure for enclosure, line for line.
5.  **Run beside the old way.** The Estimator runs alongside the old method in P1, as your blueprint says; the old spreadsheet retires only when the two match.
6.  **One engineer, then five.** The engineer who knows XL3 best uses each new screen first; the other four join when it is faster than their spreadsheet.

**IF A SESSION GOES WRONG:** say *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* One broken session never breaks the live app or the others.

05

THE BUILD ORDER, SESSION BY SESSION

From the blueprint · twelve weeks

[TABLE]

| Phase | Done when (from the blueprint)                                                                                                                                                                                                                                                                                                   |
|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | Every enquiry received this month exists as a saved estimate in the Panel Estimator with its feeder list, XL3 enclosure size, BOQ and cost sheet, run alongside the old method, and the sales margin on each was typed by you alone.                                                                                             |
| P2    | Every enquiry arriving by email or WhatsApp exists as a row with a date, an engineer’s name and a stage, without anyone typing it in, and the Enquiry Board on your phone shows which of the month’s quotes are waiting for your price.                                                                                          |
| P3    | The current store register is entered once, and the next project finalised after drawing approval has its full material list, reserved stock and one signed requisition with required-by dates before the first sheet is cut.                                                                                                    |
| P4    | Every live panel has a scanned route card and the Shop Floor Board shows its stage, balance hours and expected finish; you have spent a trial week away during which enquiries were registered, material was reserved and the floor was reported without you, and the list of what still needed your phone call is written down. |

**THE GATES:** no builder starts before F-00 is merged. The Store Board and Material App wait for the store register to be entered once. The floor systems wait for the supervisor to start scanning. No requisition leaves without your signature, no price without your margin, and no system ever touches a supplier payment.

**After the twelve weeks, months 4 to 8, same app, same routine:** the three AI employees your blueprint names (the Estimation Clerk, the Store Clerk and the Floor Reporter), each sending a short daily report to the engineer you named and to you, and the Slip Alert, which drafts one message for your approval when a panel is going to miss its date. Each starts with *“HQ, start the next phase”*.

06

WHEN SOMETHING COSTS MONEY

Decide before it is built

| Need                        | First appears                 | What it means for you                                                                                                                                                         |
|-----------------------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude API key**          | P1, Estimator                 | The Estimator reads SLDs (PDFs and photos) inside the app, which your Claude plan does not cover. Billed per use with a monthly limit you set; the key goes only into Vercel. |
| **Claude Max**              | When two builders run         | Pro works for one session at a time; Max gives room for HQ and two builders.                                                                                                  |
| **Supabase Pro**            | Before engineers use it daily | About \$25 a month: daily backups of every estimate and project.                                                                                                              |
| **Vercel Pro**              | Going live                    | About \$20 a month; the free plan is for personal use.                                                                                                                        |
| **WhatsApp Business API**   | P2                            | A number for business messages, Meta verification, approved templates, and a charge per message. Needed for the enquiry acknowledgement on WhatsApp.                          |
| **Email connection**        | P2                            | Reading the enquiry inbox (Gmail, Outlook or other); usually no extra cost.                                                                                                   |
| **Printer for route cards** | P4                            | Route cards with a QR code per panel; any office printer works, a label printer is faster.                                                                                    |

07

STANDING PROMPTS TO HQ

One line each

- **Rates change:** *“From today the \[labour / OH / transport / purchase\] rate for \[item\] is changed. Show me which open estimates this touches before anything changes.”*
- **New engineer or staff member:** *“\[Name\] joins as \[role\]. Show me what they will see, then prepare the login and wait for my OK.”*
- **Someone leaves:** *“\[Name\] has left today. Withdraw their login now.”*
- **Before you travel:** *“I am away from \[date\] to \[date\]. \[Name\] signs requisitions and receives the reports. Show me what will still need my phone.”*
- **Monthly check:** *“Audit the project against CLAUDE.md and my guardrails, and report anything that breaks them, in simple words.”*

**THE MONTHLY TEST:** ask three questions. Is every enquiry, estimate and project on the boards true? Did any price, requisition or date go out without you? Could you have been away this month for longer than last month? Three yeses: start the next system. Any no: fix that first.

Prepared for Mahendra Manerikar · Manshu Comtel Pvt Ltd. Condensed from BuildOur Builder Guides against blueprint BOA-2026-MAN-01 Rev A.  
One chain: estimate, material, shop floor. Every margin, price and requisition signed by Mahendra; supplier payment never automated.
