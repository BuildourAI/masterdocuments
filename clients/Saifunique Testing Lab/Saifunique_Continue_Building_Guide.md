# Saifunique Continue Building

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-SAI-C1 · REV A**

*Prepared for Dr. Fatima Saifee. Every sitting after the starter guide: one system at a time, from Build Sheet to switched on, your CRM and sales funnel first.*

Build sheet → Screens + UI → Plan → **One phase per sitting** → Five real cases → Watch week → Switch on → Next system

| | |
|---|---|
| **Use it when** | Every box in Step 7 of the Saifunique Starter Guide is ticked. Keep this file in `docs/`. |
| **The loop** | For every system: Build Sheet → screens and UI → plan → one phase per sitting → five real cases → watch week → switch on → next system. |
| **Your time** | Your 5 hours a week, mostly approving quotations, ticking reminders and reading the boards. Building pauses in bulk-project and audit weeks. |
| **First system** | Your CRM: F-00 Shared Record + SYS-01 Lead Card and Enquiry and Quotation Skill, from your First Build Card. |
| **Sources** | AI Systems Blueprint BOA-2026-SAI-01 Rev A (blueprint audit 02.11.2026). |

*Condensed from Builder Guides 02–04 and the UI Guide against the Saifunique AI Systems Blueprint.*

---

## 01 · Every Sitting Starts With This *(paste to Claude Code)*

**PASTE · START OF EVERY SITTING**

> Read CLAUDE.md, docs/START-NOW.md, the latest note in docs/sessions/ and the Build Sheet for the system we are on. First, remind me of anything in START-NOW that is still not ticked. Then tell me in five lines where we are and what the one finished thing for today should be. Make a plan and wait for my OK before touching any files.

**Five habits:** plan first · one small finished thing per sitting · *"commit and push"* when it works · when it breaks, paste the error and say *"explain in simple words and fix it"* · close the sitting with the prompt in §07.

## 02 · Start a System: the Build Sheet *(paste to Claude Code)*

**PASTE · NEW SYSTEM**

> We are starting **[system number and name from §05]**. Using the blueprint, the First Build Card (or the deferred list from the last system) and the real documents in docs/samples, draft docs/build-sheets/[system].md with seven fields: the system and its slice sentence; what starts it; what it shows, drafts or says, **word for word** in the words my team and customers actually use; what happens on silence, delay or a mismatch; when a human steps in and who that is by name; what it must never do (copied from the blueprint's guardrails and CLAUDE.md); and done-when, copied from §05 of the Continue Building Guide. Mark every line you are unsure of. Write no code.

Correct every line of the sheet yourself. Only you and your team know how a Saifunique quotation reads, what the day 2 follow-up should say, and how an industrial customer's accounts department expects to be reminded. "Send a polite follow-up" is not a rule; the actual sentence is.

## 03 · Choose the Screens and Their Look *(before the first screen of every system)*

Your look was chosen once, in Step 6 of the starter guide, and lives in `docs/design/`. What changes with each system is **which screens it needs** and who holds them. Settle that on paper before any code, then let the plan follow.

**PASTE · SCREENS FOR THIS SYSTEM**

> Read docs/design and the Build Sheet for this system. List every screen this system needs. For each one give: the one question it answers; its one main button; who uses it; and on what device (lab desktop, a phone in the lab, my phone). Draw each as a simple text sketch. Keep to the five screen laws and the two-minute rule. Then give me a plan of small phases: every phase must end with something I can test on my phone, and the first phase is always "load my real data and show me one true list". Write no code until I approve the screens and the plan.

| System | Main screen and its one question | Who, on what |
|---|---|---|
| SYS-01 Lead Card *(CRM)* | **New enquiry:** "who is this, what do they need, and what happens next?" | Admin staff, lab desktop or a phone at the door |
| SYS-02 Quote Chaser *(follow-up)* | **Today's follow-ups:** "which quotations need a nudge today?" | The assigned employee, on a phone |
| SYS-03 Pipeline Board *(funnel)* | **The funnel:** "where are enquiries coming from, and where are we losing them?" | You on your phone; the technical manager sees his team |
| SYS-04 Sample Tracker + Lab Board | **Samples by stage:** "where is this sample, and what is late?" | Admin and technical staff; you look |
| SYS-05 Report Release Chain | **Review queue:** "which reports wait for my review today?" | The technical manager, lab desktop |
| SYS-06 Rehan | **My day:** "what do I test today, and what is overdue?" | Each employee, on a phone |
| SYS-07 Cash Board | **The money picture:** "what did we earn, receive, spend and owe?" | You, on your phone |
| SYS-08 Collections Chaser | **The 9 AM list:** "which reminders wait for my tick?" | You, on your phone |

> **IF A SCREEN LOOKS LIKE HOMEWORK,** it is the screen that is wrong. Send Claude a screenshot and say: *"Change only the design, following docs/design. Do not touch the features."*

## 04 · Build, Test, Switch On *(shadow before send)*

1. **One phase per sitting.** After each phase: commit and push, open the live app **on your phone**, and check one enquiry, sample or invoice you know well against reality. Note every surprise in `docs/rules-i-learned.md`, and update the Build Sheet the same day.
2. **Five real cases.** Run five real cases through the system while a person presses every button. For the Lead Card: five enquiries from five different channels. For the Quote Chaser: five quotations through their day 2, 4, 7 and 10 steps. For the Sample Tracker: five samples from registration to delivery. For the Collections Chaser: five overdue invoices.
3. **Watch week.** For one full week the system works beside the old way: the register, the Excel sheets and WhatsApp carry on. Compare every day. Any mismatch is a fix or a missing rule.
4. **Switch on** only what passed the watch week, and only what is on your "AI may do alone" list: classifying leads, internal reminders, task lists, reports. Every message to a customer is still sent by a person in one tap, or after your tick. Nothing ever switches on for test results, reports or signatures.
5. **Retire the old way** only after the new one has held. The enquiry register goes in a drawer when admin staff stop opening it on their own, and stays there one more month.

> **IF A SITTING GOES WRONG:** say *"Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to the last commit."*

## 05 · Saifunique Build Order *(from your blueprint, one at a time)*

| Weeks | System | Before you start (START-NOW) | Done when |
|---|---|---|---|
| | **PHASE 1 · YOUR CRM AND SALES FUNNEL: NO ENQUIRY FORGOTTEN, NO QUOTATION WAITING** | | |
| 1–4 | **F-00 Shared Record + SYS-01 Lead Card and Enquiry and Quotation Skill** | Rate list and industry-to-test map; hot, warm and cold rules; objection answers; who is who in the six | Every enquiry from any channel exists as a Lead Card with a source, an owner and a next follow-up date, and every quotation amount came from the rate list |
| 3–6 | **SYS-02 Quote Chaser** *(first domino)* | Day 2, 4, 7 and 10 wording; lost-reason choices | Every quotation sent has a chase running inside your one week cycle |
| 4–6 | **SYS-03 Pipeline Board** | Lost-reason choices; the conversion figure settled | The board shows lost reasons and conversion by channel against your own 40 of 100 |
| | **PHASE 2 · LAB OPERATIONS: ONE TRACKER INSTEAD OF REGISTERS** | | |
| 5–10 | **SYS-04 Sample Tracker + Lab Board** | **The authorized technical signatory named**; lab ID format; test categories and turnaround | Every sample received exists once in the Sample Tracker with a lab ID and an assigned analyst |
| 7–10 | **SYS-05 Report Release Chain** | The report template; the signatory named | No report is marked Delivered without the technical manager's Reviewed stamp |
| 8–10 | **SYS-06 Lab Coordinator, Rehan** | Your yes on any Claude API or WhatsApp API cost (§06) | Each employee has a morning task list and an evening update without you asking |
| | **PHASE 3 · THE MONEY PICTURE: DAILY, WITHOUT EXCEL** | | |
| 8–12 | **SYS-07 Cash Board + Ledger Rules + Job Profit Calculator** | The money path written, with where invoicing sits; expense heads and budgets; payment terms | At 9 AM one phone screen shows revenue, collections, expenses and profitability, built only from entries admin staff made once |
| 11–12 | **SYS-08 Collections Chaser + Munim** | Reminder wording in first, second and final tone | Payment reminders wait for your tick each morning, and the Munim's evening note closes the day |

**Months 4–12, same house:** Rafiq, the AI lead desk, takes over enquiry capture across WhatsApp, email, LinkedIn and website forms and builds weekly target lists, with the first monthly profit report by service and customer (months 4–6) → Stock and Calibration Board (months 6–8) → NABL Readiness Board (months 8–10) → Intern Register and repeat-testing reminders for every past customer (months 10–12). Each starts at §02 of this guide.

> **THE HARD GATES:** SYS-04 and SYS-05 do not start until the authorized technical signatory is named. SYS-07 does not start until the money path is written, including where invoicing sits. At no stage does any system touch a test result, raw data, a calibration record or a signature.

## 06 · When a System Needs More Than Claude Max *(decide before it is built)*

Your CRM and sales funnel (Systems 1 to 3) and the Sample Tracker run on what you already have: quotations come from your rate list, follow-ups go from your team's WhatsApp in one tap, and the app shows and stores. Two needs appear later. Each is a decision you make, never one Claude makes for you.

| Need | First appears | What it means for you |
|---|---|---|
| **Claude API key** | Rehan, the Munim, Rafiq | An AI worker runs by itself at 8.30 AM or at closing time, with nobody at the computer. Billed separately from Max, per use. Claude Code shows you the expected monthly cost first. |
| **WhatsApp Business API** | Rehan, Collections Chaser, Rafiq | Messages go out from the lab's number by themselves (internal task lists) or after your tick (reminders), and incoming enquiries are read automatically. Needs Meta business verification and approved templates, which take 1 to 3 weeks, so start it when Phase 2 begins. |

**PASTE · BEFORE ANY NEW CONNECTION**

> Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month at our volume, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to add it in Vercel and to redeploy.

## 07 · Standing Prompts *(keep these handy)*

- **Close every sitting:** *"Summarise what we did today and what comes next, and save it as today's note in docs/sessions/."*
- **Next system:** once the current system has switched on and held for a week, go back to §02 with the next row of §05.
- **Bulk project or audit week:** *"We pause building this week. Note where we stopped in docs/sessions/ and remind me where to restart."*
- **Monthly audit:** *"Audit this project against CLAUDE.md, the house rules and the Saifunique rules, and report anything that breaks them, in simple words."*
- **Make a correction stick:** *"Make this correction permanent so it applies to everything we build from now on."*

> **THE MONTHLY TEST:** open the app on your phone and ask three questions. Is every enquiry and quotation on the board still true? Did anything reach a customer without the yes it needed? Does the diary explain the week better than your memory does? If all three are yes, build the next system. If any is no, fix that first.

---

*Prepared for Dr. Fatima Saifee · Saifunique Testing Lab LLP. Condensed from Builder Guides 02–04 and the UI Guide against the Saifunique AI Systems Blueprint (BOA-2026-SAI-01). Shadow before send, always. Every result, price and payment stays human.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-SAI-C1 · REV A*
