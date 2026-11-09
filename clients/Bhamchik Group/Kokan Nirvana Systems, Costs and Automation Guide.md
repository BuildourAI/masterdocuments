Buildour AI · Kokan NirvanaSystems, Costs, Automation · Rev A

# YOUR SYSTEMS, WHAT THEY COST

Prepared for **Shubham Manjunath Anvekar**. Each system in plain words, **every rupee it adds**, how the **AI agents** are built, and what **n8n** automates.

8 systems–– Monthly  
costs–– Pay per  
use–– AI agents–– n8n  
automations

|                                                                                                                                                                                                                                                                                                                                                                                                    |                                                                                     |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| How to read the pricesPrices are the providers’ published prices in November 2026, in their own currency, with a rough rupee figure at about ₹88 to the dollar before GST. They change: check each provider’s pricing page on the day you buy. Usage figures are estimates at your volume of 800 to 1000 leads a month; Claude Code shows you the real figure after the first week of each system. |                                                                                     |
| One correctionThe call summary wrote Claude Max as “\$10,000/month”. Claude Max is **about \$100 a month** (Max 5x) or **about \$200** (Max 20x), roughly ₹10,000 or ₹20,000 with GST.                                                                                                                                                                                                             | SourcesBlueprint BOA-2026-BHA-01 Rev B; providers’ published prices, November 2026. |

Nothing on this sheet is bought by Claude Code without your yes

01

YOUR SYSTEMS IN PLAIN WORDS

What each one does for you

| System                               | What it does for you                                                                                                                                                                                       | Runs on                       | Adds to your bill                     |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|---------------------------------------|
| **F-00 Single Record**               | Your own CRM: every lead, property, unit, visit, quotation, token and receipt in one place, entered once.                                                                                                  | Supabase                      | Nothing extra                         |
| **SYS-01 Lead-to-Visit Flow**        | A new Meta, landing page or portal lead gets your project details and tutorial on WhatsApp in minutes; follow-ups go out on their own; visits are booked and reminded; the quotation waits for your price. | App + n8n + your WhatsApp API | n8n; WhatsApp messages                |
| **SYS-02 Property Tutorial Library** | One approved pack per property (walkthrough video, location, units, FAQs) that the flow sends at the right moment.                                                                                         | App + Supabase storage        | Nothing extra; AI video tool optional |
| **SYS-03 Sales Skill**               | Your sales manager’s best words, written once, so every message sounds like Kokan Nirvana.                                                                                                                 | Claude Code (writing)         | Nothing extra                         |
| **SYS-04 Receipt and Ledger App**    | Money lands, someone ticks, a numbered receipt goes out on WhatsApp and the ledger updates.                                                                                                                | App                           | WhatsApp messages (small)             |
| **SYS-05 Payment Reminder Flow**     | Instalment reminders on schedule; stops the moment the money is receipted.                                                                                                                                 | App + n8n + WhatsApp          | WhatsApp messages (small)             |
| **SYS-06 Funnel Board**              | Which Meta campaign brings buyers who visit, overdue follow-ups by name, quotation age, cost per visit.                                                                                                    | App + n8n (reads Meta)        | Nothing extra                         |
| **SYS-07 Finance Board**             | Cash, dues by unit, salary and incentive owed, and a running profit and loss.                                                                                                                              | App                           | Nothing extra                         |
| **SYS-08 Team Desk**                 | 15 logins, a task page each morning, a day-close summary each evening, leavers off in one click.                                                                                                           | App + n8n                     | WhatsApp nudges (small)               |
| **AI agents** (month 4 on)           | Lead Qualifier, Funnel Keeper, Munshi, Desk Keeper: AI workers that run on a schedule (§04).                                                                                                               | App + n8n + Claude API        | Claude API usage                      |

02

THE MONTHLY BILLS

Fixed, whatever the volume

| Service                    | Plan                  | About                     | When and why                                                                                                                                                                           |
|----------------------------|-----------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**             | Max 5x, or Max 20x    | \$100 or \$200 a month    | From day 1. Builds everything, with several sessions at once. After the foundation and main systems are built, you may move down to Pro (\$20) for small changes, as Romana suggested. |
| **GitHub**                 | Free                  | ₹0                        | From day 1. Private repository included.                                                                                                                                               |
| **Supabase**               | Free, then Pro        | ₹0, then \$25 a month     | Free while building. Move to Pro before real customer and money data go in (Phase 2): daily backups, and free projects pause after a quiet week.                                       |
| **Vercel**                 | Pro                   | \$20 a month              | From day 1. The free plan is for non-commercial use only.                                                                                                                              |
| **n8n**                    | Cloud Starter, or Pro | about €24, or €60 a month | From SYS-01. Starter fits about 2,500 runs a month, enough if follow-ups and reminders run as daily batches; move to Pro if Executions shows you near the limit.                       |
| **Web address** (optional) | Your own domain       | ₹0 to connect             | If you own kokannirvana.com, the OS can live at an address such as `os.` on it. Vercel connects it free.                                                                               |

Already paid, unchanged

Your **WhatsApp API provider** (its monthly fee), **Meta ads** spend, the **landing page** and **portal**, and the **current CRM** until the OS has held for a month and you decide to stop it. **Base44** is not used in this build; keep or cancel it after Phase 1.

03

PAY AS YOU USE

Grows with leads and messages

### WhatsApp messages, charged by Meta

Meta charges per template message delivered, by category; your provider may add its own fee per message. Approximate India rates: **marketing** about ₹0.80 a message, **utility** (receipts, reminders, visit confirmations) about ₹0.12, **replies within 24 hours** of the customer writing to you are free. Check Meta’s rate card for India on the day.

| Message                                                                          | Category  | Volume a month           | About  |
|----------------------------------------------------------------------------------|-----------|--------------------------|--------|
| Project details + tutorial, and up to 5 follow-ups to a lead who has not replied | Marketing | ~4,000 (1000 leads × ~4) | ₹3,200 |
| Visit confirmations and reminders                                                | Utility   | ~200                     | ₹25    |
| Receipts and instalment reminders                                                | Utility   | ~100                     | ₹12    |
| Team nudges (if sent on WhatsApp)                                                | Utility   | ~300                     | ₹36    |
| Anything sent while the lead is talking to you                                   | Service   | any                      | Free   |

The follow-ups are the big line, and they pause the moment a lead replies, so a better first message also lowers the bill. Meta, not us, decides each template’s category.

### The Claude API, for the AI agents only

Claude Max covers you building in Claude Code. It does **not** cover the app calling Claude by itself at 8 AM with nobody at the computer: that uses the **Claude API**, paid per use, on a separate account at platform.claude.com with prepaid credit and a monthly spend limit you set. Price per million tokens (a token is about three-quarters of a word): **Claude Haiku 5.5** \$0.10 in, \$0.50 out; **Claude Sonnet 5.5** \$2 in, \$10 out; **Claude Opus 5.5** \$4 in, \$20 out.

### Optional

**AI video for tutorials:** a phone walkthrough costs nothing; AI presenter video tools start at roughly \$30 a month if you want polished videos. **Meta ad data** for the Funnel Board: free, through a Meta developer app the builder session walks you through.

04

HOW THE AI AGENTS ARE BUILT

Month 4 onward · one per builder session

An “AI employee” is four simple parts: **a clock** (n8n wakes it at 8 AM, at 6 PM, or when a lead replies), **its rulebook** (the Sales Skill and CLAUDE.md’s rules), **eyes on your record** (it may read the leads, visits and ledger it needs, nothing else), and **an out-tray** (it writes drafts and reports into an approval list). It never holds a key to send money things: code decides what may go out by itself, and anything with a price waits for you.

`n8n clock → your app’s agent route → reads the record → Claude API with the rulebook → drafts and report → approval list or WhatsApp → diary`

| Agent              | What it does                                                                                                                                                            | Wakes                  | Model                  | About a month |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|------------------------|---------------|
| **Lead Qualifier** | Tags each new lead hot, warm or cold on the sales manager’s rules; suggests the property and the staff member.                                                          | Every new lead         | Haiku 5.5              | under \$1     |
| **Funnel Keeper**  | 8 AM overdue list to each staff member; reads lead replies and drafts answers to project questions from the Sales Skill; parks any price question for you; 6 PM report. | 8 AM, 6 PM, each reply | Sonnet 5.5             | \$30 to \$40  |
| **Munshi**         | Evening: checks the day’s receipts and expenses against the bank, lists gaps. Month-end: salary, incentive and P&L drafts for your signature.                           | Evening, 1st of month  | Sonnet 5.5             | about \$3     |
| **Desk Keeper**    | Answers staff on where things are, nudges once when a task is overdue, evening team report.                                                                             | Working hours, evening | Haiku 5.5 + Sonnet 5.5 | about \$2     |

All four together: roughly **\$40 to \$50 a month** at 1000 leads, less with the caching Claude Code sets up. Using Opus 5.5 for every agent roughly doubles it. Claude Code shows the real figure after the first week.

Paste · New builder session · build one agent

You are the builder session for the **\[agent name\]** agent in the Kokan Nirvana OS, on the branch **\[agent-short-name\]**. Read CLAUDE.md, the blueprint’s note on the AI employees, and section 04 of the Systems, Costs and Automation Guide. Build it as: an n8n workflow file that wakes it; one protected app route that reads only the records it needs, calls the Claude API with the Sales Skill and CLAUDE.md’s rules as its instructions, and writes its drafts and report to the approval list and the diary. Code, not the AI, decides what may be sent without a person: nothing with a price, discount, payment plan, token amount, salary or incentive ever goes out by itself. Before writing code: tell me which model you propose and why, the expected monthly cost at our volume, and how I set a monthly spend limit on the Claude API account. Wait for my yes. Run it for one week as drafts only before anything is sent.

Setting up the Claude API account, once

Go to **platform.claude.com**, sign in with the business email, add a payment card under **Billing**, buy a small prepaid credit (for example \$20), and set a **monthly spend limit** (for example \$75). Create an API key under **API Keys**, then paste it only into Vercel’s Environment Variables as `ANTHROPIC_API_KEY`, never into a chat. Claude Code tells you when.

05

WHAT n8n AUTOMATES

One workflow file each, written by Claude Code

| Workflow                            | Starts when                                           | What it does                                                                                                 | System   |
|-------------------------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|----------|
| **New Meta lead**                   | A lead form is filled on Facebook or Instagram        | Creates the record, assigns the staff member, sends the details and tutorial, creates the call task.         | SYS-01   |
| **New landing page or portal lead** | The form sends a web hook, or a daily email or export | Same as above, with the source marked.                                                                       | SYS-01   |
| **Follow-up runner**                | Every morning                                         | Sends today’s due follow-ups, skips anyone who replied, moves quiet leads on, marks cold after the last one. | SYS-01   |
| **Visit reminders**                 | Every evening                                         | Reminds tomorrow’s visitors and the staff member taking them.                                                | SYS-01   |
| **Lead reply catcher**              | A lead writes on WhatsApp                             | Logs the reply on the record, pauses the follow-ups, alerts the staff member; later wakes the Funnel Keeper. | SYS-01   |
| **Receipt sender**                  | A receipt is ticked in the app                        | Sends the numbered receipt PDF on WhatsApp and logs it.                                                      | SYS-04   |
| **Instalment reminders**            | Every morning                                         | Checks the ledger, sends due reminders, flags overdue units to the sales manager and you.                    | SYS-05   |
| **Meta ad spend**                   | Every morning                                         | Reads yesterday’s spend by campaign into the Funnel Board.                                                   | SYS-06   |
| **Day open and close**              | Fixed morning and evening times                       | Refreshes task pages, nudges anyone not logged in, sends the day-close summary.                              | SYS-08   |
| **Agent clocks**                    | 8 AM, 6 PM, evening                                   | Wake the AI agents in §04.                                                                                   | Month 4+ |

06

WHAT IS NEVER AUTOMATED

Your guardrails, in force everywhere

- **Price or any financial decision:** every quotation price, discount, payment plan, token amount, extension or waiver is set by you or the sales manager.
- **Money moving:** no system pays anyone; salary and incentive sheets are drafts until you sign.
- **Receipts:** only after a person ticks that the money has landed.
- **Meta ad spend:** the board shows; you decide.
- **People decisions:** hiring, letting go, roles and access stay with you and the sales manager until you write your third guardrail.

07

YOUR BUDGET, PHASE BY PHASE

Approximate, before GST

| Item                | Phase 1 (weeks 1–3)    | Phases 2–4 (weeks 3–12) | Month 4+ with agents   |
|---------------------|------------------------|-------------------------|------------------------|
| Claude Max          | \$100 (or \$200)       | \$100 (or \$200)        | \$20 to \$100          |
| Vercel Pro          | \$20                   | \$20                    | \$20                   |
| Supabase            | \$0                    | \$25                    | \$25                   |
| n8n Cloud           | €24                    | €24 (€60 if busy)       | €24 to €60             |
| WhatsApp messages   | about ₹3,300           | about ₹3,300            | about ₹3,300           |
| Claude API (agents) | \$0                    | \$0                     | \$40 to \$50           |
| **Total, roughly**  | **₹16,000 to ₹25,000** | **₹18,000 to ₹31,000**  | **₹15,000 to ₹27,000** |

Plus what you already pay: the WhatsApp provider’s fee, Meta ads, the landing page, and the old CRM until you retire it. Against this, your blueprint counts about ₹76,000 a month in conservative savings before hours, from Rev A, plus the hours your 15 people get back.

Prepared for Shubham Manjunath Anvekar · Kokan Nirvana Seashore property · companion to blueprint BOA-2026-BHA-01 Rev B.  
Prices are providers’ published prices in November 2026 and change; check on the day. Estimates are marked as estimates.
