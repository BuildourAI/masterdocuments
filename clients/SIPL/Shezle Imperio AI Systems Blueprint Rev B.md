# Shezle Imperio AI Systems Blueprint · Rev B

A middleman trader in industrial chemicals, scrap, byproduct and offspec lots, where confidentiality is the whole business and every rule lives in the owner’s head. Since Rev A the build has started and its first stage is live. One plan now joins both: a foundation and nine systems in five simple phases over three months, the sales and purchase cycle on the board by December end.

Prepared for  
Sangeet Sejpal, Owner  
Blueprint audit 28.10.2026 (Rev A)  
Build handovers 8.11 and 15.11.2026  
Rev B supersedes Rev A

01The NumbersDashboard tiles · as provided by client

200-500

Leads a month · as written

300-500

Quotes a month · as written; see section 05

7

Orders out of 100 quotes · as written

5-7

Orders a month · as written; see section 05

₹5,00,000

Average order value · as written

30 days

Sales cycle

10-20%

Repeat customers

50-200

Calls a day · five products in one call

10-20

Samples a day

5-6 h

Owner time a week for the build

Turnover is stated at ₹50 lakh to 1 crore a month; 5 to 7 orders at ₹5,00,000 comes to ₹25 to 35 lakh. **Three pairs of figures cannot all hold, and they are Sangeet’s to settle before any card on the board is trusted.**

02The Money Path TodayFlowchart · enquiry to final payment

01

Look for leads

google contacts, b2b portals, by hand

02

Call, qualify, offer

50 to 200 calls a day

03

Send sample

name and coa worked out by hand

04

Follow up, negotiate

held in memory

05

Close the deal

sangeet, by his own rule

06

Get token

chased on calls and messages

07

Confirm with supplier

sangeet tells sales himself

08

Logistics and loading

paperwork by hand each time

Named breakdown pointStays human by Sangeet’s rule, or runs but chasedAll eight stations are done by hand today

03Where The Volume GoesFunnel · as written

200-500

leads a month

300-500

quotes a month, wider than leads

5-7

orders a month

A funnel that widens before it narrows

Quotes are likely counted per product; the board will count the true funnel.

04Who Holds The WorkPyramid · org layers

Owner

sales, purchase, hrm, admin, it, ai · 5-6 h a week for the build

Management

not answered · no manager, no reporting line

Seven people

4 field · 1 back office · 1 accountant on tally · 1 peon

“I can leave India and still all the work may be visible.”

With no middle layer, the rules must live in the system, not a person.

05What Was Tried, And What ChangedBefore / after · why Rev B exists

Tried 01

ERPNext, Odoo, Zoho

**Was:** three full ERPs attempted and left; nobody but Sangeet had time to make them work.

**Now:** no fourth ERP. One small app, built in stages, each usable without being taught.

Tried 02

Paid CRM and task tool

**Was:** a CRM that is “not very good” and never opened, a task tool, Tally.

**Now:** the board replaces both once the field team works from it (P3). Tally stays.

The leak

Confidentiality

**Was:** buyers cut out the middleman from dispatch data; staff leave or leak; drivers paid for information.

**Now:** the wall is in the database: a role that may not read a row never receives it. Built and live.

Since Rev A

Two designs on file

**Was:** a Frappe design (documents only) and a React and Supabase build (live), disagreeing.

**Now:** one stack, the live one. The Frappe design stays as a requirements list.

The pattern in every attempt: a tool built for everything, and an owner with no time to make it work. So **each phase ships one small, finished thing the team can use without being taught**.

BusinessB2B trading: chemicals, waxes, oils, scrap, offspec

SitesAhmedabad · office, factory, on site; pan India, import, export

Stack keptTally, phones, Google contacts, B2B portals

Stack droppedPaid CRM, task tool (after P3)

PartCurrent state

06Recommended AI SystemsFoundation + 9 systems · in build order

F-00 · P1Built, live

Shezle Lot and Contact Record

Supply side: suppliers, products, purchase lots

↓

Demand side: buyers, market names, sales lots

↓

The link: owner and admin only

↓

Seven roles, access by grant

↓

Every change in the audit log

Built

6 migrations, 84 checks run as each role.

Rule

What a role may not read is absent, not hidden.

Solves buyer and supplier on one screen

SYS-01 · P2

Shezle Deal Wall Skill

Two sittings of one hour

↓

Role wall, alias rule, in his words

↓

Offer, sample, follow-up drafts

↓

Dispatch neutral checklist

↓

Price line always blank

Changed

The skill explains and drafts; the database enforces.

New hires

Learn the trade from it, not from Sangeet.

Solves re-explaining the rules to every hire

SYS-02 · P1 basic, P2 full

Shezle Alias Checker

Product, buyer, industry

↓

Name already used, or a clean choice

↓

Document pack: COA, photos, videos

↓

Second name to one buyer: blocked

↓

Owner override, logged

Built

“Which name?” check and the block.

Guardrail

Never suggests or compares a price.

Solves “it all depends and has to be calculated”

SYS-03 · P2 CRM, P3 board

Shezle CRM and Pipeline Board

Contacts off personal phones

↓

One call, five products: five cards

↓

One owner, next action, due date

↓

Three role views

↓

Stuck 2 working days: flagged

Replaces

The unopened CRM and the task tool.

Lanes

Tenders and auctions in their own lane.

Solves follow-ups held in memory

SYS-04 · P3

Shezle Field Task Feed

Card reaches sample or dispatch

↓

Task on the field guy’s phone

↓

Alias document pack attached

↓

Sent, received, result awaited

↓

Back office sees the day’s lines

Guardrail

Standing at the material stays a field job.

Adoption

Five people stop working from Sangeet’s messages.

Solves dispatching four field guys by message

SYS-07 · P3 · New

Shezle Team Scoreboard

KPIs per post, agreed

↓

Counted from the board, not typed

↓

1,000 points a day per post

↓

Green, yellow, red

↓

Weekly review signed per post

Rule

Automatic KPIs first; hand-typed ones get missed.

Snapshot

Target and points fixed when the day opens.

Solves accountability, his top problem

SYS-05 · P4

Shezle Lot to Sale Trigger

Purchase marks a lot confirmed

↓

Sales cards per market name, supplier stripped

↓

Tagged buyers into a call list

↓

Offers drafted, price empty

↓

Sangeet enters price, taps approve

Start

One product line first.

Guardrail

Without the tap, nothing is sent.

Solves telling sales what came in, every time

SYS-08 · P4 · New

Shezle Money Pipeline

Deal: purchase leg + sales leg

↓

Payment schedule per side

↓

Payment ledger, add-only

↓

Dispatch waits for the advance

↓

Recovery view by age

Rule

A token is never deal value, never a final sale.

Owner only

Margin, landed cost, capital locked.

Solves token and supplier money on calls

SYS-09 · P5 · New

Documents, Dispatch and Tally Bridge

Quote, order, invoice PDFs

↓

Real name and HSN on statutory papers

↓

Dispatch neutral checklist per deal

↓

Loading note, weighment, transport

↓

Voucher export to Tally

Tally

Stays the books; the accountant imports.

Vault

GST, IEC, RCMC, KYC expiry reminders.

Solves logistics papers by hand, dispatch leaks

SYS-06 · P5

Shezle Deal Clerk

8 AM, and after every logged call

↓

Next follow-up in the approved name

↓

Courier tracking read

↓

Price or origin replies held for him

↓

6 PM report on his phone

Start

Draft-only, then allowed channels.

Never

Personal WhatsApp automation.

Solves the chasing in 50 to 200 calls a day

Kept: **Tally** as the books, **phones** for calls, **Google contacts** and **B2B portals** as lead sources (imported, then off personal phones). Dropped after P3: the **paid CRM** and the **task tool**. Live: **Control Center** on **Supabase** (Mumbai) and **Vercel**, built with **Claude**. Rev A codes are kept; new systems are numbered from SYS-07. The org board, HR and the second company come after the three months (D-05).

07Implementation RoadmapPhase table · 3 months · P1 done

**P1**Done

**P2 · wk 1–2**to 30 Nov

**P3 · wk 3–5**to 21 Dec · December end met

**P4 · wk 6–8**to 11 Jan

**P5 · wk 9–13**to 15 Feb 2027 · three months

| Phase | Focus                               | Systems                           | Duration   | Done when                                                                                                                                                                                          |
|-------|-------------------------------------|-----------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | Foundation and the wall             | F-00 · SYS-02 basic               | Done, live | Supply and demand sit in separate tables; only Sangeet and admin see the link; only they set a sell price; a second name to one buyer is blocked; access only by grant.                            |
| P2    | CRM and the checker                 | SYS-01 · SYS-02 full · SYS-03 CRM | 2 weeks    | The rules are written in Sangeet’s words; any product and buyer typed into a phone returns the right name and document pack or a red stop; every call is logged, five products as five follow-ups. |
| P3    | The board and the scoreboard        | SYS-03 board · SYS-04 · SYS-07    | 3 weeks    | Every live deal and sample is a card with one owner, one next action and a date; field staff work from their phones; each post sees its score; the paid CRM and task tool are switched off.        |
| P4    | The money pipeline and the trigger  | SYS-08 · SYS-05                   | 3 weeks    | Each deal shows booked, received and still to receive on both sides; dispatch waits for the advance; a confirmed lot opens its own sales cards and waits for Sangeet’s price and tap.              |
| P5    | Documents, Tally and the Deal Clerk | SYS-09 · SYS-06                   | 5 weeks    | Quotes, orders and invoices print from the system with real names and HSN; Tally takes the export; the clerk drafts, tracks couriers and reports at 6 PM, then sends through allowed channels.     |

08Why This Build Order2×2 matrix

High impact · runs without anyone changing

F-00Shezle Lot and Contact Record (built)

SYS-01 + SYS-02Deal Wall Skill and Alias Checker

→ build first: needs only Sangeet’s words and his lists

High impact · needs people to change

SYS-03 + SYS-04CRM, Pipeline Board and Field Task Feed

SYS-07Team Scoreboard

→ P3: five people stop working from messages

Compounding · needs clean data

SYS-08 + SYS-05Money Pipeline and Lot to Sale Trigger

SYS-06Deal Clerk

→ after the board holds clean cards and buyer tags

Growth · unblocks scaling

SYS-09Documents, Dispatch and Tally Bridge

D-05 · after month 3Org Board, HR and the Second Company

→ last in the window; the org board waits for a season on the board

← low dependence on human changehigh →

Vertical axis is impact on confidentiality and follow-up. **The wall and the names come first because everything else reads them**; the agent comes after the board is trusted, because an agent sending messages before that is how a fourth tool goes unopened.

09GuardrailsSwimlane · set by Sangeet

AI acts alone

Not set by Sangeet: careful defaultDraft offers and follow-ups, price blankRead courier trackingFlag a second nameLog replies onto cardsCount automatic KPIs6 PM report

Human signs off

Every price (Sangeet types it)Messages with ₹, quantity or tokenEvery document flowAccounts, sales, purchase, financeOperations and QCOverride of the two-name blockGranting access

Never automated

Pricing and negotiationStanding at the material, packing, loadingSupplier and buyer side by side, except to SangeetA market name on a GST, customs or bank paperPersonal WhatsApp automation

Sangeet’s own rules, plus one he did not have to state: **no layer suggests, compares or changes a rupee**. Running cost: Claude, Supabase and Vercel; the paid CRM and task tool stop after P3.

10Next StepsImmediate actions

01

**Confirm Rev B** and settle the three number pairs in section 05. Sangeet.

02

**Secure the live app before staff log in:** new owner password, a mail service, staff access to the address. Sangeet, build session.

03

**Two one-hour sittings** to write the Deal Wall Skill in your own words. Sangeet.

04

**Send the lists:** products, market names, COA versions, photo sets, buyers shown each name, suppliers. Sangeet, back office.

05

**Name the team:** who holds purchase, who holds sales, each person’s email for a grant. Sangeet.

06

**Pick the first product line** for the trigger, and the switch-off date for the CRM and task tool. Sangeet.

07

**Answer the setup questions:** WhatsApp Business, couriers, languages, GSTINs, document prefixes. Sangeet, accountant.

Scope1 foundation + 9 systems · 5 phases

WindowThree months, 17.11.2026 to 15.02.2027

SourcesRev A, owner’s brief, two build handovers

PartThe build

Every item traces to the Rev A blueprint audit (28.10.2026) and Systems Brief, the owner’s Control Center brief, or the build handovers of 8.11 and 15.11.2026 · unknowns are named, not guessed · the in-depth blueprint follows

Buildour AIClient Blueprint

# AI SYSTEMS BLUEPRINT · REV B

Shezle Imperio Private Limited  ·  Prepared for **Sangeet Sejpal**, Owner

Find and call–– Qualify and offer–– Sample under the right name–– Follow up–– Close and token–– Supplier confirms–– Load and deliver

|                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BusinessShezle Imperio Private Limited (SIPL), Ahmedabad. B2B merchant trading in industrial chemicals, waxes, oils, scrap, byproduct and offspec lots: domestic, import, export, high seas, tenders, auctions, back-to-back deals, occasional brokerage and joint ventures. Turnover band stated at ₹50 lakh to 1 crore a month. |                                                                                                                                                                                                                                                                                |
| Current StackTally (one accountant) for the books; phones, Google contacts, B2B portals and social media for leads; a paid CRM and a task tool, both unopened. Built since Rev A: Control Center, live on Supabase (Mumbai) and Vercel, code in GitHub (enrosl/SIPL-Global-Business-OPS-ERP).                                     |                                                                                                                                                                                                                                                                                |
| Prepared byBuildOur AI                                                                                                                                                                                                                                                                                                            | SourcesRev A blueprint audit and Systems Brief (28.10.2026) · owner’s Control Center brief and the first-stage plan (approved 8.11.2026) · build handover, Frappe design (8.11.2026) · build handover, React and Supabase build (15.11.2026) · owner’s UI and access decisions |
| Systems Specified1 foundation + 9 systems in 5 phases over three months; the foundation and phase 1 are built and live                                                                                                                                                                                                            | Deadline AnchorThree months from 17.11.2026 to 15.02.2027; sales and purchase cycle by December end (phases 2 and 3); org board, HR and the second company after it                                                                                                            |
| Build modelSangeet builds it himself with Claude on the live React, Supabase and Vercel app, at 5 to 6 hours a week. This document is the one source of truth; the Frappe design stays as a list of requirements.                                                                                                                 |                                                                                                                                                                                                                                                                                |

Rev B supersedes Rev A (28.10.2026). Every change traces to the owner’s brief or the two build handovers.  
Sheets 1–3 are the one-shot capture

00

EXECUTIVE SUMMARY

Overview

“Confidentiality is the key. Since we are the middle man, we must make sure no one knows where we purchase from and where we sell to.” That is how Sangeet Sejpal describes Shezle Imperio, an Ahmedabad trader in industrial chemicals, waxes, oils, scrap and offspec lots. A buyer must never learn the supplier, a supplier must never learn the buyer, one product carries a different market name, COA and photo set for each industry, and one buyer must never see the same product under two names.

Today every one of those rules lives in Sangeet’s head. He runs sales, purchase, HR, admin, IT and AI himself, with seven people below him and no manager in between. All eight stations of the money path are done by hand: 50 to 200 calls a day, five products per call, 10 to 20 samples a day, follow-ups from memory, and every confirmed lot handed to the sales side by Sangeet telling them himself. The leaks come through dispatch data, staff who leave, and drivers who can be paid for information. Three ERPs were tried and left, and a paid CRM sits unopened. His aim: “I can leave India and still all the work may be visible and handled from my phone anytime anywhere and coordinate through my team.”

Since Rev A, the build has started. Two designs were drawn and they disagree; one of them, a React and Supabase app, is live with the wall already in the database. This revision joins Rev A, the owner’s brief and both build handovers into one plan, with seven structural changes: (1) **one stack, the live one**, with the Frappe design kept as a requirements list; (2) **the wall moves from a prompt into the database**, already built; (3) **the two-name rule becomes a hard block** with an owner override, already built; (4) the **CRM and call log** become stage one of the board; (5) **accountability moves earlier**, with a Team Scoreboard in phase 3; (6) a **Money Pipeline** and a **Documents and Tally Bridge** are added, with market names kept off every statutory paper; (7) the whole plan fits **three months**; the **org board, HR and the second company** are named as the next step after it (D-05).

The result is a foundation and nine systems in five phases over three months, set out as one simple table: Phase, Focus, Duration, Done when. Phase 1 is done. Phases 2 and 3, five weeks, put the whole sales and purchase cycle on the board by 21 December; phases 4 and 5 finish the money, documents and the clerk by 15 February 2027, if the two writing sittings and the lists arrive in the first week. Nothing in this plan types a price, and nothing leaves without Sangeet’s tap.

01

CURRENT STATE

How work happens today, and where it hurts

### 1.1Finding leads and calling

Leads are searched by hand in Google contacts, B2B portals and social media. Calls run from 30 seconds to 5 minutes, 50 to 200 a day, often five products in one call, and each product is its own negotiation. Contacts sit on personal phones, so they leave with the person who holds the phone.

PainFive negotiations in one call, held in memory, on a phone the company does not own.

### 1.2Names, COA and samples

One product needs a different market name, COA, photos and videos for each industry, worked out by hand before every quote and every sample. Field guys pack and courier 10 to 20 samples a day. The risk is that one buyer sees the same product twice under two names, or receives a document that shows where it came from.

Pain“It all depends and has to be calculated,” before every quote and every sample.

### 1.3Follow-up, close and token

Follow-ups continue from memory until a lead converts, rejects or dies. Sangeet closes and negotiates every deal, and that stays with him by his own rule. The token, the buyer’s financial commitment, is chased on calls and messages. There is no single place that says which deals are waiting on whom.

PainNobody but Sangeet knows which of hundreds of quotes is still alive.

### 1.4Purchase to sales, and the wall

Sangeet sources across import, export, high seas, local pan India, tenders and auctions. “If our Import Officer sources materials the moment it is confirmed, the same time the sales team has to start to work on selling that same material in their pipeline, however the import purchase officer shouldn’t know where it is being sold.” Today he tells the sales side himself what came in, and the purchase side can see where it goes.

PainThe buyer gets the dispatch data and cuts out the middleman; staff leave or leak; drivers can be paid for information.

### 1.5Logistics and loading

Logistics preparation, trucks and loading paperwork are done by hand each time. Standing at the material, checking a waste or offspec lot and loading are field jobs, and Sangeet wants them to stay human. He never wants to prepare sales, purchase or logistics paperwork by hand again.

PainPaperwork rebuilt for every lot, and every dispatch paper is a possible leak.

### 1.6The books and the money

One accountant keeps the books in Tally. Token money, supplier confirmation and bills move on calls and messages. Capital rotates every two to three months on SIPL’s own money, but there is no view of capital locked per deal, of what each side still owes, or of the landed margin after freight, duty, clearing, bank charges and claims. Sangeet has said he wants to stop paying for Tally; this plan keeps it until the system has proved itself.

PainMoney owed on both sides of every deal is tracked in calls, not in one place.

### 1.7The team and accountability

Four field guys are dispatched anytime, anywhere, and do clerical work in between; one back office person handles admin; one peon. Managers and reporting lines were not stated. The rules of the trade are re-explained to every new field guy, who then leaves or leaks. Accountability is the owner’s top problem: nobody else owns a next action.

PainNo measure of who did what, and the knowledge walks out with each person who leaves.

### 1.8Tools tried and left

ERPNext, Odoo and Zoho were all attempted and abandoned. A paid CRM that is “not very good” is never opened, a task tool is paid for, and Tally is kept. The reason: nobody but Sangeet had time to make them work, and they were not easy enough for the team to use without being taught.

PainThree tools paid for, none of them holding the business.

### 1.9Since Rev A: the build has started

**The owner’s brief widens the goal.** Control Center is to be one multi-company system, each company with its own setup, that can grow new forms and reports without code and through AI, with AI agents holding posts beside people on an org board. It names marketing, sales, operations, finance and team management, phase by phase, “fix accountability first”.

**The first-stage plan (8.11.2026) added what a trader needs:** landed margin per deal; a dispatch neutralisation checklist (switch bill of lading, neutral packing, relabelling, COA on own letterhead); the legal boundary that market names are for internal use and buyers only, while GST, customs and bank documents carry the real product name and HSN; Indian trade and chemicals compliance; KYC; LC, bank limits, credit limits and FX; claims and disputes; and AI authority tiers (observe, draft, act internally, act externally).

**The review of Rev A in the build sessions** made four corrections that this revision adopts: the wall belongs in the database, because a prompt instruction alone is not a control; accountability moves earlier, with one owner, one next action and one due date per card; the two-name rule is a hard block with an owner override, not a flag; and compliance fields sit on the product from day one.

**Two designs were drawn.** A Frappe design has detailed documents and a skeleton, nothing live. A React, Supabase and Vercel build has its first stage built, tested and live: supply and demand in separate tables, the link readable only by owner and admin, only they set a sell price, a second name to one buyer blocked, access only by grant, an audit log, 84 database checks run as each role, and the screens for Today, Lots, Buyers, Suppliers, Products, Names and Team, in the deep blue Sangeet chose.

FindingTwo plans with two calendars cannot both be followed. This revision chooses the live one and carries the other’s requirements across.

02

RECOMMENDED AI SYSTEMS

Foundation + 9 systems

SHEZLE LOT AND CONTACT RECORDF-00 · FOUNDATION · BUILT, LIVE

What it is

The wall, in the database. Supply lives in one set of tables (suppliers, products, purchase lots), demand in another (buyers, market names, sales lots), and the table that joins a product to its market names is readable only by owner and admin. Every row carries a company key, so a second company runs on the same system and links across companies are refused. Seven roles: owner, admin, purchase, sales, field, back office, accountant. A lot can only be sold under names of the product actually in it. Every change is written to an audit log by the database itself. `supplier → product → purchase lot · buyer → market name → sales lot · link: owner only`

Solves

§1.4, buyer and supplier visible to the wrong people; §1.7, rules that live in one head.

Guardrail

What a role may not read is absent from its screen, not greyed out: the row never reaches it. Only owner or admin sets a sell price; anyone else gets a clear refusal.

Still to add

Compliance fields on the product (real product name, HSN, UN number, SDS) at the start of phase 2, so statutory papers never need a market name.

SHEZLE DEAL WALL SKILLSYS-01 · PHASE 2

What it does

Sangeet’s rules of a back-to-back trade, written once in his own words in two sittings of one hour, and kept as a Claude skill file that the build, the trigger and the clerk all read. It holds the role wall (purchase sees origin and supplier, sales sees buyer and destination, only Sangeet sees both), the alias rule (one product, many market names, never two names to one buyer), the drafted offer note per industry, the sample covering note with origin masked, the follow-up for each stage from Initiate and Qualify to Get Token, the document checklist per market name, and the dispatch neutralisation checklist. The price line is always blank.

Solves

§1.7, rules re-explained to every new field guy; §1.5, dispatch papers that leak.

Changed since Rev A

The skill explains and drafts; the database enforces. A rule that matters for confidentiality is never left to the skill alone.

SHEZLE ALIAS CHECKERSYS-02 · PHASE 1 BASIC, PHASE 2 FULL

What it does

A phone screen: type a product, a buyer and a target industry; get the market name this buyer may be shown, or the one already used with them. Built in phase 1: the “Which name?” check and the hard block on a second name. Added in phase 2: the document pack for that name (COA version, photo set, video set), the sample history with that buyer (sent, received, result awaited), and an exposure record of which buyer has been shown which name, and when. An owner or admin override of the block is allowed and logged with a reason.

Solves

§1.2, the name, COA and photo set worked out by hand before every quote and sample.

Guardrail

Shows no supplier and no purchase price to a sales user; never suggests, compares or changes a price.

SHEZLE CRM AND PIPELINE BOARDSYS-03 · PHASE 2 CRM, PHASE 3 BOARD

What it does

**Stage 1, phase 2, the CRM:** contacts move off personal phones into the system, imported from Google contacts and B2B portal exports with a duplicate check; a quick call log where one call about five products becomes five follow-ups; follow-ups due today; and a ranked call queue for each person. **Stage 2, phase 3, the board:** every opportunity and every sample is a card with one owner, one next action and one due date, moving through stages stored as fixed keys (Initiate and Qualify, Sample, Follow-up, Close, Token, Supplier confirmed, Logistics, Converted, Rejected, Dead). Three role views: purchase sees supply only, sales sees buyers only, Sangeet sees both ends of each lot. A card with no movement for two working days is flagged. Tenders, auctions and opportunistic sourcing sit in their own lane and join a sales lane when won. A confidentiality view for Sangeet alone shows supplier and buyer on each lot, and any card where a buyer has asked for the dispatch origin. `call → five cards → owner + next action + date → stage → converted / rejected / dead`

Solves

§1.1 and §1.3, follow-ups in memory and contacts on personal phones; §1.8, the unopened CRM and the task tool.

Adoption

The paid CRM and the task tool are switched off on a date Sangeet sets, once the field team works from the board, not before.

SHEZLE FIELD TASK FEEDSYS-04 · PHASE 3

What it does

When a card reaches sample or dispatch, the field guy gets the task on his phone with the right document pack already attached: pack, courier, or go and stand at the material. He logs sent, received and result awaited, with photos. The back office person sees the day’s operational lines and works from them instead of from Sangeet’s messages. Field users see lots and market names only.

Solves

§1.2 and §1.7, four field guys dispatched by message with no visible status.

Guardrail

Standing at the material, checking a waste or offspec lot, packing and loading stay field jobs, as Sangeet set.

SHEZLE TEAM SCOREBOARDSYS-07 · PHASE 3 · NEW

What it does

Accountability by post. For each post (purchase, sales, field, back office, accounts) a few KPIs are agreed with Sangeet, counted from the board wherever possible: calls logged, follow-ups done on their date, samples dispatched, cards moved. Each post can earn 1,000 points a day, shown green, yellow or red. A night job opens the next day’s entries with the target and points fixed at that moment, and closes the missed ones. Each week the post holder and Sangeet sign a short review. `KPI per post → counted from the board → points → colour → weekly sign-off`

Solves

§1.7, accountability, the owner’s top problem.

Guardrail

Automatic KPIs first: hand-typed ones are where accountability systems die, as a reference build showed. The score informs; pay and consequences stay Sangeet’s decision.

SHEZLE LOT TO SALE TRIGGERSYS-05 · PHASE 4

What it does

The purchase officer marks a lot confirmed. The system opens a sales card for each target-industry market name of that product, carrying quantity and location band only, no supplier; pulls the buyers tagged for that industry and product into a call list; drafts the offers and a sample request from the Deal Wall Skill, origin masked and price line empty; then stops. Sangeet opens the card on his phone, checks the buyer list, enters the price per name and taps approve. After that, the field guy gets the sample task with the document pack. A lot won in the tender lane enters the same flow. `lot confirmed → sales cards → call list → drafts → Sangeet’s price + tap → field task`

Solves

§1.4, Sangeet telling the sales side what came in, every time.

Guardrail

Without his tap nothing is sent. Switched on for one product line first, then widened.

SHEZLE MONEY PIPELINESYS-08 · PHASE 4 · NEW

What it does

A deal joins a purchase leg and a sales leg. Each side has its own payment schedule (token, advance, balance) and an add-only payment ledger; every money figure is worked out by the database from the ledger, never typed. It shows booked, received and still to receive, and a recovery view by age with red flags. Dispatch waits until the buyer’s advance is in, unless Sangeet releases it. For Sangeet alone: the margin, the landed cost (freight, insurance, duty, clearing, bank charges, foreign exchange, interest on capital, claims) and the capital locked in each deal. Claims and disputes are logged against the deal.

Solves

§1.3 and §1.6, token and supplier money chased on calls, with no view of what is owed or locked.

Guardrail

A token is never the deal value and never makes a sale final. The collection stage is owned by a person. Nothing here posts to the books.

DOCUMENTS, DISPATCH AND TALLY BRIDGESYS-09 · PHASE 5 · NEW

What it does

Quotations, sales orders, purchase orders and invoices print from the system, numbered per company and financial year (for example SIPL-XX-2627-00001). Buyer-facing papers carry the market name; GST, customs and bank papers carry the real product name and HSN. Each deal gets the dispatch neutralisation checklist (bill of lading, neutral packing, labels, COA on SIPL letterhead) and the logistics lane drafts the loading note, weighment slip and transport order with origin masked. Approved vouchers export to Tally, where the accountant imports them. A compliance vault holds GST, IEC, RCMC, MSME, hazardous-goods licences and party KYC with expiry reminders, and a register of NDA and non-circumvention agreements.

Solves

§1.5, logistics papers rebuilt by hand; §1.4, leaks through dispatch data; §1.6, two records of the same deal.

Guardrail

Every document flow is approved by a person before it leaves. Tally stays the book of record; the bridge exports, it never posts on its own.

SHEZLE DEAL CLERKSYS-06 · PHASE 5

What it does

A named AI employee for follow-ups and sample chasing. Every morning at 8 AM and after every logged call, sample or reply, it drafts the next follow-up for each due card in the approved market name; reads courier tracking and marks samples delivered; logs buyer replies onto the card; holds any reply with a price, a counter offer or a request for the dispatch origin and forwards it to Sangeet untouched; raises a flag when a buyer is about to receive two names of one product; and at 6 PM reports to Sangeet’s phone: samples delivered, follow-ups answered, cards gone cold, cards waiting on his price, flags raised. The operational lines go to the back office person.

Solves

§1.1 and §1.3, the part of 50 to 200 calls a day that is pure chasing and status checking.

Guardrail

Starts draft-only, for Sangeet to read. It moves up an authority tier only when he says so. It sends only through channels he allows (WhatsApp Business API, email); personal WhatsApp is never automated. Any message with a rupee figure, a quantity or a token request goes only after his approval. It runs as a user with the least access the job needs.

Note: the existing stack

**Tally:** kept as the books; receives the voucher export from phase 5. **Phones, Google contacts, B2B portals, social media:** kept as lead sources; contacts are imported in phase 2 and then live in the system, not on personal phones. **Paid CRM and task tool:** switched off after phase 3. **Control Center:** the live app (Vite, React, TypeScript, Tailwind on Supabase and Vercel) is the base; every later phase builds on it. **Frappe design documents:** kept as a list of requirements; Frappe is not used.

Deferred · parked, not dropped

**D-01 Self-building system:** new forms, reports and modules built without code or by the built-in AI from a prompt, and AI creating records on instruction. Interim: Claude builds what is asked, phase by phase. Re-entry: after D-05, once the core is stable. **D-02 Books inside the system:** a full ledger with GST, TDS and payments, and Tally retired. Interim: the Tally bridge. Re-entry: after a full busy season on the bridge and one quarter run side by side. **D-03 Store apps:** Play Store, App Store and desktop apps. Interim: the web app installed on each phone’s home screen. Re-entry: when field use shows a need the web app cannot meet. **D-04 Shipment data as a lead source:** import and export shipment data mined for buyers. Re-entry: after the CRM is in daily use. **D-05 Org board, HR and the second company:** an org board of divisions, departments and posts, one person with many hats and AI agents holding posts too; weekly statistics from the board; SOPs with read receipts starting from the Deal Wall Skill; attendance, leave and an exit routine that withdraws access the same day; commission statements if wanted; and the second company, retail with scan-to-invoice, on the same core and the same wall, with a group view on one phone. Interim: the Team Scoreboard (SYS-07) carries accountability by post. Re-entry: after the three months, once the sales and purchase flow has run through the busy season; planned as a further phase of about three months.

Not AI-solvable · human and process steps

The two writing sittings, which only Sangeet can do · settling the numbers in section 05 · naming who holds purchase and who holds sales · moving contacts off personal phones, which is a habit before it is a feature · standing at the material and loading · the decision of which supplier and buyer to pair on a lot · GST registrations, LUT and licences, which the system only reminds about · a WhatsApp Business account, if the clerk is to send on WhatsApp.

03

IMPLEMENTATION ROADMAP

3 months · P1 done

Sangeet has 5 to 6 hours a week, so each phase asks him for a few short inputs and one approval habit, never a training course. The plan runs three months, 13 weeks from 17.11.2026 to 15.02.2027, as Rev A’s 90-day plan intended: phases 2 and 3 take five weeks and close the sales and purchase cycle by 21 December, ahead of the December-end deadline; phases 4 and 5 take eight weeks. Three months is tight for 5 to 6 hours a week, so his inputs are kept to the two sittings, the lists, one approval habit and a 30-minute weekly review. The critical path is the two writing sittings and the product and buyer lists, both due in week 1 of phase 2. A dated calendar sits behind this table, not in front of it.

| Phase | Focus                               | Duration          | End state                                                                                                                               |
|-------|-------------------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **1** | Foundation and the wall             | Done, live        | Everyone logs in only by grant, sees only their company and only their side; nothing sets a price except owner or admin.                |
| **2** | CRM and the checker                 | 2 weeks (wk 1–2)  | Sales staff get the right name, the document pack or a red stop; suppliers invisible; every call logged.                                |
| **3** | The board and the scoreboard        | 3 weeks (wk 3–5)  | Every deal and sample is a card on one board; field staff work from their phones; each post has a score; the CRM and task tool are off. |
| **4** | The money pipeline and the trigger  | 3 weeks (wk 6–8)  | Every rupee owed on both sides is visible; a confirmed lot opens its own sales cards and waits for Sangeet’s price and tap.             |
| **5** | Documents, Tally and the Deal Clerk | 5 weeks (wk 9–13) | Papers print from the system; Tally takes the export; the clerk reports at 6 PM and sends through allowed channels.                     |

P1

FOUNDATION AND THE WALL

F-00 + SYS-02 basic · done

**What was built:** the separate supply and demand tables, the owner-only link, seven roles, access by grant with an Owner guard and a last-owner guard, price and name rules in the database, the audit log, 84 role-by-role checks, and the first screens in deep blue on phone and desktop.

Done whenmet: only Sangeet’s login exists, as Owner; one company is set up; the app is live at sipl-global-business-ops-erp.vercel.app. Before anyone else logs in, the four security steps in section 06 must be done.

P2

CRM AND THE CHECKER

SYS-01 + SYS-02 full + SYS-03 stage 1 · 2 weeks

**Why now:** it needs only Sangeet’s words and his lists, nobody changes how they work yet, and every later system reads the rules, the names and the contacts.

Done whenthe Deal Wall Skill exists in Sangeet’s words with the price line blank · for any product and buyer typed into a phone, the checker returns the name and document pack, or a red stop · contacts are imported with duplicates caught · every call is logged, and five products make five follow-ups.

P3

THE BOARD AND THE SCOREBOARD

SYS-03 stage 2 + SYS-04 + SYS-07 · 3 weeks

**Why now:** this is the one phase where people change habits, so it comes once the names and contacts are already in place. Accountability is built in the same phase, so the board is used from the first day, not added later.

Done whenevery live opportunity and sample is a card with an owner, a next action and a date · the four field guys and the back office person take the day’s tasks from the board · each post sees its daily score and signs a weekly review · Sangeet can open his phone from outside India and see every lot, sample and follow-up of the sales and purchase cycle · the paid CRM and the task tool are no longer paid for.

P4

THE MONEY PIPELINE AND THE TRIGGER

SYS-08 + SYS-05 · 3 weeks

**Why now:** the trigger needs clean lots and clean buyer tags to be safe, and the money view needs deals that already live on the board. It lands inside the October to March busy season, on one product line first.

Done whenevery deal shows booked, received and still to receive on both sides · dispatch waits for the advance unless Sangeet releases it · for one product line, a confirmed lot appears in the sales lane under its market name with the supplier stripped, buyers and offers drafted, and nothing leaves until Sangeet enters the price and taps approve.

P5

DOCUMENTS, TALLY AND THE DEAL CLERK

SYS-09 + SYS-06 · 5 weeks

**Why now:** documents need deals, money and compliance fields to print from; the clerk can only work cards that exist, and runs draft-only for Sangeet to read before it sends anything.

Done whenquotations, orders and invoices print from the system with real names and HSN on statutory papers · the accountant imports the Tally export each week · the dispatch checklist is ticked on every deal · the clerk’s 6 PM report reaches Sangeet daily and, once he allows it, follow-ups go through WhatsApp Business or email.

What gets built in each phase · records and screens, for the build

| Phase                | Area                   | Records (tables)                                                                                                                                                                                                                                                                                                             | Screens                                                                                                                       |
|----------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| 1 · built            | Access and the wall    | companies, memberships, member invitations, roles; suppliers, products, purchase lots; buyers, market names, sales lots; name-to-product link; audit log                                                                                                                                                                     | Sign in, No access yet, Today with price approval, Lots, Lot record, Buyers, Suppliers, Products, Names (“Which name?”), Team |
| 2                    | Rules and names        | Deal Wall Skill file; message templates; document checklist per name; document packs (COA version, photo set, video set); name exposure (buyer, name, date); product compliance fields (real name, HSN, UN number, SDS)                                                                                                      | Which name? (full, phone), document pack view, change password                                                                |
| 2                    | CRM                    | contact people at buyers and suppliers; leads; call log (one call, many products); follow-ups; conversation notes; price history (owner only); import batches with duplicate check                                                                                                                                           | Buyer page with call log, Call queue, Import                                                                                  |
| 3                    | Board and field        | opportunities (owner, next action, due date, stage key); tender and auction lane; samples (sent, received, result); tasks; daily action list; dispatch requests; courier companies                                                                                                                                           | Pipeline Board (owner, purchase, sales views), Field Today (phone), Confidentiality view (owner)                              |
| 3                    | Scoreboard             | areas; KPIs; assignment by post; daily entries with target and points fixed on creation; weekly review sign-off                                                                                                                                                                                                              | My Score, Team Score, Owner Today                                                                                             |
| 4                    | Money and trigger      | deals (purchase leg, sales leg); payment schedules per side; payment ledger (add-only); landed cost lines; capital locked; claims and disputes; lot-to-sale rule; trigger log                                                                                                                                                | Money Pipeline, Recovery by age, Deal margin (owner), Approve offers (phone)                                                  |
| 5                    | Documents and dispatch | quotations, sales orders, purchase orders, sales and purchase invoices; terms; tax templates; HSN codes; numbering per company and year; Tally export batches; dispatch checklist per deal; loading notes, weighment slips, transport orders; inward and outward notes; compliance vault; NDA and non-circumvention register | Print and PDF, Tally export, Logistics lane, Compliance with expiry list                                                      |
| 5                    | AI and messages        | AI provider; agents and their posts; AI proposals; AI action log; message channels; outbound messages; courier tracking; clerk reports                                                                                                                                                                                       | Clerk drafts inbox, 6 PM report, Channel settings                                                                             |
| After month 3 (D-05) | Management             | divisions, departments, posts, hats; statistic definitions and weekly entries; manuals and SOPs with read receipts; onboarding and exit runs; attendance, leave, shifts, holidays; commission agreements and statements                                                                                                      | Org Board, My Hat, SOP reader, People, Attendance                                                                             |
| After month 3 (D-05) | Second company         | company setup pack (retail); scan-to-invoice; group reports; party portal with one-time code sign-in                                                                                                                                                                                                                         | Group view, Company switcher                                                                                                  |

Record names are plain words; the build turns each into a table with its migration and role-by-role tests. About 45 records by the end of phase 3; the rest of the roughly 150 follow in phases 4 and 5 and in D-05.

Decisions this revision takes · Sangeet may overturn any of them

| Question                 | Decision                                                                                                                                                                 | Why                                                                                                 |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Which stack              | React, Supabase and Vercel, the live build                                                                                                                               | Live, tested, light to run, fits 5 to 6 hours a week; the Frappe design’s requirements carry across |
| How deep the names go    | Sales and field see market names only; purchase sees the real product, never buyers; R&D sees the real product, never parties                                            | Purchase must know what it buys; the wall that matters is buyer against supplier                    |
| How many roles           | The seven built roles; manager and accounts splits only when such a person exists                                                                                        | There is no management layer today; roles follow people, not org charts                             |
| What the accountant sees | Nothing until phase 5; then invoices from both sides, never the deal that joins them                                                                                     | Tally needs the invoices; the link stays with Sangeet                                               |
| Tally                    | Kept; tax invoices issued from Tally until phase 5, then printed from the system and exported to Tally                                                                   | Books stay safe while the system proves itself (D-02)                                               |
| Phone                    | Web app on the home screen                                                                                                                                               | Works today on every phone; store apps parked (D-03)                                                |
| Dates                    | This blueprint’s phase table, from 17.11.2026                                                                                                                            | One calendar; the Frappe dates of January to March 2027 are retired                                 |
| AI                       | Claude; draft-only first; four tiers (observe, draft, act inside, act outside); outside only through allowed channels                                                    | Matches Sangeet’s guardrails and his unset “AI acts alone” answer                                   |
| Org board method         | Posts, hats and weekly statistics counted from the board, after the three months (D-05); scoreboard week in phase 3 ends Thursday 14:00 unless Sangeet chooses otherwise | Automatic statistics first; the method is his to confirm                                            |
| Second company           | After the three months (D-05)                                                                                                                                            | After one season of sales and purchase on the board                                                 |

04

GUARDRAILS

Set by Sangeet, enforced by design

These are Sangeet’s own rules, printed as given, and the build rules that make them hold.

**CONFIDENTIALITY:** “Confidentiality is the key.” Enforced in the database: a role that may not read a row never receives it, so no screen has to hide anything. Nobody but Sangeet sees the supplier and the buyer of one lot side by side.

**HUMAN SIGNS OFF:** “Pricing and negotiation.” · “Every document flow must be approved. Especially in accounts, sales, purchase or the financial side.” · “Any kind of process where a workflow exists. As well as the operational and QC side.” Price fields are never writable by AI; only owner or admin can set them.

**NEVER AUTOMATED:** “Only where manual labour and a field job is required.” Standing at the material, checking a waste or offspec lot, packing samples and loading stay with a field guy.

**AI ACTS ALONE, NOT YET SET:** “I don’t know right now but that I will figure out during development.” Default until he sets it: the system drafts, flags and reads tracking; nothing leaves and nothing is priced without his tap. Any message with a rupee figure, a quantity commitment or a token request waits for him.

**ACCESS:** access is granted, never claimed; signing up gives nothing. Admin has the same access as Owner, except that only an Owner can grant, change or remove the Owner role, and the last Owner cannot be removed.

**PAPERS AND MONEY:** a market name never appears on a GST, customs or bank document. A token is never deal value and never makes a sale final. Money is worked out in the database only.

**ERROR PROTOCOL:** every change is written to an audit log by the database; corrections are new entries, never silent edits; every schema change is a migration safe to run twice and tested as each role, because a blocked write can look like success.

05

THE NUMBERS

Flagged, not resolved

Four questions only Sangeet can answer:

**(1) Quotes and leads.** 300 to 500 quotes a month is written higher than 200 to 500 leads. Are quotes counted per product line, so one lead can carry several quotes?

**(2) Conversion.** 7 orders out of every 100 quotes, on 300 to 500 quotes, would be 21 to 35 orders a month, but orders are written as 5 to 7. Which holds?

**(3) Order value and turnover.** 5 to 7 orders at ₹5,00,000 comes to ₹25 to 35 lakh a month, below the stated ₹50 lakh to 1 crore band. Is the order value, the order count or the band understated?

**(4) Team and reporting.** Seven people plus the owner are described; managers and reporting lines were not stated. Who holds purchase, and which field guys hold sales?

Until they are settled, the board counts leads, quotes per product and orders separately, so within the first month of phase 3 the system itself shows the true funnel.

06

NEXT STEPS

Detail behind panel 10

Panel 10 carries the seven actions; four need detail.

02

**Secure the live app before staff log in:** (a) change the owner password, which was shared in a chat during the build, in Supabase under Authentication, then Users, and add a change-password screen in phase 2; (b) connect a mail service (custom SMTP) in Supabase, because the built-in email reaches only a few addresses an hour, or create staff logins already confirmed; (c) decide how staff reach the app, since Vercel Authentication lets in only Vercel team members: a custom domain is the usual answer; (d) confirm in Supabase that “Confirm email” is on and the Site URL and redirect URLs point at the live address. Passwords and personal emails never go into the code. Sangeet with the build session.

03

**The two writing sittings, one hour each:** first, the role wall (who may see the supplier, who the buyer, what a field guy may know) and the alias rule, with real examples; second, the offer note, the sample covering note, the follow-up for each stage, the document checklist per name, and the dispatch checklist (bill of lading, packing, labels, COA letterhead). Spoken to Claude, written back in his words, read and signed. Sangeet.

04

**The lists, as spreadsheets:** products (real name, HSN, UN number if hazardous, SDS on file); market names (product, name, target industry, COA version, photo set, video set); buyers (company, contact, phone, email, industry, city, names already shown, date); suppliers (company, contact, origin, products). Contacts from Google contacts and B2B portal exports can be sent as they are; the import catches duplicates. Sangeet with the back office person.

07

**The setup questions:** whether a WhatsApp Business account exists; the courier companies used; the languages for outbound notes; GSTINs, e-invoicing applicability and LUT, and who files; document prefixes per document; currencies and banks; whether the scoreboard week ends Thursday 14:00; when the second company should start; and confirmation that ideas taken from the reference codebase he supplied may be reused (patterns only, never its code). Sangeet with the accountant.

Every item in this document traces to the Rev A blueprint audit and Systems Brief (28.10.2026), the owner’s Control Center brief and first-stage plan (8.11.2026), or the build handovers (8.11.2026 and 15.11.2026).  
No figures added beyond those the client provided; unknowns are named, not guessed. Rev B supersedes Rev A in full.
