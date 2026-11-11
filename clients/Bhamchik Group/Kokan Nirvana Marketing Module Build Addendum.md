Buildour AI · Kokan NirvanaMarketing Module · Rev A

# THE MARKETING MODULE BUILD ADDENDUM

Prepared for **Shubham Manjunath Anvekar**. Adds a complete **Marketing module** and **Call Review** to the Kokan Nirvana OS you are already building: **same OS, same login, same customer record**. Attach it to your MAIN session.

Marketing  
desk–– Content +  
posting–– Meta ads–– Ads watch  
agent–– Google,  
LinkedIn, YT–– Call  
review

|                                                                                                                                                                                                                                                                        |                                                                                                                         |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Why inside the same OSThe number that matters is **ad → lead → visit → booking**. That only works if marketing and sales share one record. Your marketing team gets its own logins and pages in the Team Desk, the same way sales does. One home: your own house rule. |                                                                                                                         |
| Adds to Blueprint Rev BSix systems, SYS-09 to SYS-14, in two phases. Phase A starts after Phase 1 (the lead flow) is live. Rev B is not replaced: this addendum sits beside it.                                                                                        | CompanionMarketing and Calling: Approvals and Setup, the list of what you must get approved by Meta, Google and others. |

Two voices on every step: YOU DO THIS · PASTE TO CLAUDE CODE

00

ADD IT TO YOUR OS

Once, in the MAIN session

1

You do this

Put this PDF and the **Approvals and Setup** PDF into `docs/` in your `kokan-nirvana-os` folder.

2

Paste to the MAIN session

Open your existing `MAIN` session, attach this PDF, and paste the box below. You can do this now even while Phase 1 is being built: it only adds plans and rules, no code.

Paste · MAIN session · add the Marketing module

Attached and saved in docs/ is the Kokan Nirvana Marketing Module Build Addendum. It adds SYS-09 to SYS-14 to my blueprint Rev B; it does not replace anything. Read it fully, especially sections 02 and 03, which are written for you. Then, one step at a time, waiting for my OK after each: (1) tell me in ten lines what the module adds and in what order, and confirm it starts only after Phase 1 is live; (2) add section 02 to CLAUDE.md word for word; (3) add SYS-09 to SYS-14 to docs/SESSIONS.md with their branches and phases, keeping the rule of at most three builder sessions at a time across sales and marketing; (4) add the approvals from the Approvals and Setup guide to docs/START-NOW.md with me as owner; (5) add a “marketing” and a “marketing_head” role to the plan for the Team Desk. Write no feature code. Finish by asking me my monthly ad spend cap for Meta and Google, and who approves campaigns.

**WHEN TO BUILD:** Phase A starts when Phase 1’s done-when is met (every lead gets details, tutorial and follow-ups by itself). Until then, the MAIN session holds the plan and your approvals run in the background.

01

THE MODULE AT A GLANCE

Six systems, two phases

| System                                                                         | What it does                                                                                                                                                                                                                         | When                                 | Needs approved first                                            |
|--------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|-----------------------------------------------------------------|
| **PHASE A · META, CONTENT, TEAM · after Phase 1 is live, about weeks 4 to 12** |                                                                                                                                                                                                                                      |                                      |                                                                 |
| **SYS-09 Marketing Desk**                                                      | Marketing logins and roles; every Meta campaign’s spend and results linked to leads, visits and bookings; the content calendar; the brand kit.                                                                                       | 1 to 2 weeks                         | Meta system user (read only is enough)                          |
| **SYS-10 Content Studio + Auto-posting**                                       | AI drafts posts, promotions and festival greetings; creative briefs and ready prompts for your team’s ChatGPT, Claude or Canva; branded greeting images from templates; approve, then publish to Facebook and Instagram on schedule. | 2 weeks                              | Meta business verification, app, page and Instagram permissions |
| **SYS-11 Meta Ads Builder**                                                    | AI drafts a full campaign (objective, audience, copy, creative, budget); it is created **paused** in your ad account; it goes live when you or the marketing head approve.                                                           | 2 to 3 weeks                         | Meta ads permissions; your monthly cap                          |
| **SYS-12 Ads Watch Agent**                                                     | Checks every ad daily; pauses badly performing ads by your rules; suggests budget moves for approval; weekly report on cost per lead, per visit, per booking.                                                                        | 2 weeks                              | Claude API key and spend limit                                  |
| **PHASE B · MORE CHANNELS AND CALLS · month 4 onward**                         |                                                                                                                                                                                                                                      |                                      |                                                                 |
| **SYS-13 More Channels**                                                       | Google Ads campaigns the same way as Meta (drafted, paused, approved); LinkedIn and YouTube posting; each one switched on as its approval arrives.                                                                                   | As approved                          | Google developer token; LinkedIn API; YouTube audit             |
| **SYS-14 Call Review**                                                         | Sales calls recorded, turned into text, summarised on the lead’s record, scored against your sales script; weekly report.                                                                                                            | 2 to 3 weeks after calling is set up | Cloud calling service; speech-to-text service                   |

| System | Done when                                                                                                                                             |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| SYS-09 | The marketing team signs in to their own pages, and you can see, for last week, each campaign’s spend next to its leads, visits and bookings.         |
| SYS-10 | Two weeks of posts went out on schedule on Facebook and Instagram, every one approved in the OS, none typed or posted by hand.                        |
| SYS-11 | A campaign drafted by the OS was approved by you and went live in Meta without anyone opening Ads Manager.                                            |
| SYS-12 | For two weeks the daily check ran, paused at least one weak ad by your rule, and every budget change waited for your yes; spend stayed under the cap. |
| SYS-13 | Each approved channel works the same way as Meta, inside the same cap and the same approval.                                                          |
| SYS-14 | Every sales call on the business number has a summary on the lead’s record, and your sales manager agrees with the scores on 20 checked calls.        |

02

RULES FOR CLAUDE.md, WORD FOR WORD

Read by Claude Code

Marketing rules · add to CLAUDE.md

**Marketing rules.** Marketing is a module of the same Kokan Nirvana OS: the same database, logins and customer record; never a separate app or database. The AI may draft campaigns, ads, posts and greetings, publish posts that a person has approved, watch ad results every day, suggest changes, and pause an ad that breaks the pause rules Shubham sets. The AI never starts spend, raises a budget, creates a live campaign or changes targeting on a live campaign without the approval of Shubham or the marketing head named in this file. A monthly spend cap per platform is stored in settings and checked in code before every change that could spend; any request that would exceed it is refused and logged. New campaigns are always created paused. Every marketing action is written to the audit log with who approved it. Ad copy and posts never state a price, discount, offer or payment plan unless Shubham approved that exact wording. The AI follows each platform’s ad policies and never tries to work around them. Tokens for Meta, Google, LinkedIn, YouTube, the calling service and speech-to-text live only in Vercel and n8n credentials. Marketing roles see marketing pages only; they see lead counts and outcomes but no money figures beyond ad spend. Call recordings and transcripts are personal data: only the owner, sales manager and the assigned salesperson may open them, and call scores are for coaching, never the only basis for a decision about a person.

03

BUILD BRIEF: FOR CLAUDE CODE

Shubham can skip this page

### Architecture

- Platform calls (Meta Marketing and Graph APIs, Google Ads API, LinkedIn, YouTube Data API, the calling service, speech-to-text) go through server-side app routes with tokens from environment variables; n8n holds the schedules and webhooks and calls those routes with `AUTOMATION_SHARED_SECRET`.
- Every spend-capable change passes one function, `lib/marketing/spend-guard.ts`: checks the approval record, the platform’s monthly cap in settings, the month-to-date spend, and the global automation switch; refuses and logs otherwise. Write tests for it with real-looking cases before any route uses it.
- Attribution: Meta lead forms carry campaign, ad set and ad IDs onto the lead; landing page links carry UTM tags; the Funnel Board and Marketing Desk join ad → lead → visit → booking from the same tables.
- Agents use the Claude API (`ANTHROPIC_API_KEY`); propose the model and the expected monthly cost to Shubham before building, and run every agent for one week as suggestions only.

### Starting tables (each system adds its own in its own migration)

**social_accounts** (platform, page or account ID, status); **brand_kit** (logo, colours, fonts, rules); **campaigns**, **ad_sets**, **ads** (platform IDs, status draft / paused / live / stopped, budget, created_by, approved_by); **creatives** and **assets** (files in Supabase storage, linked to property and campaign); **posts** (channel, text, asset, scheduled_at, status draft / approved / published / failed, platform post ID); **content_calendar**; **ad_metrics_daily** (spend, impressions, clicks, leads by ad and day); **spend_caps** (platform, month, cap); **marketing_approvals**; **pause_rules**; **calls** (lead, salesperson, recording link, duration, transcript, summary, score, reviewed_by). Row Level Security as in the marketing rules.

### Images and video

Claude writes text only. SYS-10 produces, for every post or ad, a creative brief with a ready prompt the team pastes into ChatGPT, Claude or Canva, and an upload slot for the finished file. Festival and occasion greetings are rendered by the OS itself from branded templates and the owner’s own property photos (text over image, no paid tool). An AI video tool is optional and added only with Shubham’s yes.

04

BUILDER SESSION PROMPTS

One new session per system

Start each in a new Claude Code session on the same folder, named after the system, exactly as in your Continue Building Guide §03. Run at most three builder sessions in total, sales and marketing together. Before each one, check in the **Approvals and Setup** checklist that its approval has arrived.

Paste · New marketing builder session (fill the brackets)

You are the builder session for **\[SYS-09 Marketing Desk / SYS-10 Content Studio and Auto-posting / SYS-11 Meta Ads Builder / SYS-12 Ads Watch Agent / SYS-13 More Channels / SYS-14 Call Review\]** in the Kokan Nirvana OS. Read CLAUDE.md, docs/SESSIONS.md, the blueprint and the Marketing Module Build Addendum in docs/, and docs/build-sheets/\[sys-number\].md (write it first from the addendum’s section 01 and wait for my approval). Work only in your own git worktree on the branch **\[sys-number-short-name\]**, never on main, and only in this system’s folders. Follow the marketing rules and the build brief in the addendum; every change that could spend goes through the spend guard. Before any code: list the screens (one question, one main button, who, which device) following docs/design; give me a plan in small phases each ending with something I can test on my phone; and list exactly what you need from me (approvals, tokens, accounts) with where I find each one in the Approvals and Setup guide. Wait for my OK.

| System | Add this line to the prompt above                                                                                                                                                                                                 |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SYS-09 | Start by reading yesterday’s Meta spend and results into ad_metrics_daily and showing them beside leads, visits and bookings. Read only: nothing is created in Meta.                                                              |
| SYS-10 | Start with festival greetings from branded templates and a week of draft posts for my approval; publish to Facebook and Instagram only after approval, and show me the creative brief and ChatGPT or Canva prompt for every post. |
| SYS-11 | Every campaign is created paused. Show me the full draft (objective, audience, copy, creative, budget, end date) on one approval screen. Test the spend guard with me before the first real campaign.                             |
| SYS-12 | Ask me for my pause rules (for example: no lead after a set spend, or cost per lead above a set amount) and store them in pause_rules. For two weeks, only suggest; then pause by the rules, never raise spend.                   |
| SYS-13 | Build one channel at a time, in the order their approvals arrive; Google Ads works exactly like SYS-11, under the same spend guard.                                                                                               |
| SYS-14 | Follow section 04 of the Approvals and Setup guide (C1 to C6). Start with the 20-call pilot; my sales manager checks every summary and score before it switches on for all calls.                                                 |

**IF ANYTHING SPENDS MONEY WITHOUT YOUR YES:** press the one switch in Settings that turns all automatic actions off, pause the campaign in Meta Ads Manager, and paste what happened into the MAIN session: *“Explain in simple words how this happened and fix the spend guard so it cannot happen again.”*

Prepared for Shubham Manjunath Anvekar · Kokan Nirvana Seashore property. Addendum to blueprint BOA-2026-BHA-01 Rev B: SYS-09 to SYS-14.  
Same OS, same record. AI drafts, watches and pauses; every rupee of new spend waits for a person.
