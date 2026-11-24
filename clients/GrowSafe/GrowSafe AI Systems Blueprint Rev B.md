# GrowSafe AI Systems Blueprint · Rev B

An agro chemicals manufacturer at Mandideep selling to dealers and retailers across several states, where every number lives in Tally Prime and only accounts can open it. Rev B corrects Rev A against Akash’s own note and the call of 24 November: one fresh GrowSafe OS on a new two-way Tally Bridge, sales reporting next, and AgriCost.In, Unolo and Biz Analyst rebuilt inside it and switched off.

Prepared for  
Akash Dubey, Owner  
Blueprint audit 23.11.2026 (Rev A)  
Call and written requests 24.11.2026  
Rev B supersedes Rev A

01The NumbersDashboard tiles · as provided by client

Not stated

Leads a month

Not stated

Quotes a month

Not stated

Orders a month · order value

Not stated

Sales cycle · repeat customers

Not stated

Total headcount

₹50L–1Cr

Turnover a month · stated band

4–5 years

Of data inside Tally Prime · call 24.11

10–15 h

Owner time a week

10.12.2026

Deadline set in the brief

3 tools

To discontinue: AgriCost.In, Unolo, Biz Analyst

All eight business numbers were left blank, as were busy season and “worth it if”. **Every one of them already lives in Tally; once the Bridge is live, the system reads them out instead of anyone typing them.**

02The Money Path TodayFlowchart · enquiry to final payment

01

Dealer order arrives

phone, whatsapp, field visit

02

Credit, overdue, stock checked

only accounts can open tally

03

GST invoice, e-way bill

multi-state billing in tally

04

Dispatch from godown

bilty shared only when asked

05

Ledger, credit note, return request

every request a phone call

06

Collection in the market

unverified visits, manual TA

07

Receipt and reconciliation

accounts, in tally

 

Accounts stay in Tally

the rest of the team moves to growsafe os

Named breakdown pointStays with accounts in TallySeven of seven stations done by hand today

03Who Holds The WorkPyramid · org layers

Owner

pricing, schemes, costing, credit, every escalation

Management

empty · “everyone reports to me”

Execution

field sales · accounts, billing · dispatch · qc lab · factory

“Everyone reports to me.”

The OS fills the middle with drafts and scorecards; Akash keeps the signature.

04Where The Data Should LiveSplit · call 24.11

Tally Prime

Accounts only

Books, billing, GST, receipts, payroll accounting. Accounts keeps working here.

F-00

Tally Bridge

Tally to Supabase, only what changed; back into Tally only approved masters and Optional vouchers.

GrowSafe OS

Everyone else

Sales, field, dispatch, QC, costing, dealers, D2C buyers, HR and SOPs.

One source, two directions, one approval

HR and SOP layers stand alone; they do not come from Tally.

05What Is Retired, What Replaces ItBefore / after · Akash’s note and call

Old sync script

Tally to old Supabase

**Was:** a scripted sync, unstable, data not structured; a past experiment by Akash’s own note.

**Now:** the new Tally Bridge into a new Supabase project; the old one runs until the new one reconciles, then stops.

AgriCost.In

Costing tool

**Was:** recipes and products costed in a separate tool; price lists stay old when Tally rates rise.

**Now:** Costing and Margin Guard inside the OS, reading rates from the Bridge (SYS-05).

Unolo

Field force app

**Was:** GPS and attendance, disconnected from Tally receipts: a visit is tracked, a collection is not.

**Now:** Field Force and Payout Meter inside the OS, tied to Tally collections (SYS-02, SYS-03).

Biz Analyst

Tally on a phone

**Was:** Tally figures for the owner only; nobody else sees a number.

**Now:** the Role Board: owner view plus role-locked queues for billing, dispatch, accounts and QC (SYS-04).

Each tool is switched off only after its replacement has run beside it, so **nothing the team uses today goes dark before the new screen is trusted**.

BusinessAgro chemicals to dealers and retailers; D2C next

SitesMandideep HO and plant; state C&F and branch godowns

Stack keptTally Prime (accounts), Google Workspace

Stack droppedOld sync script, AgriCost.In, Unolo, Biz Analyst

PartCurrent state

06Recommended AI SystemsFoundation + 8 systems · in build order

F-00 · P1 · wk 1–3New

GrowSafe Tally Bridge

Connector on the Tally server

↓

4–5 years loaded, then every few minutes

↓

New Supabase, Mumbai

↓

Daily reconciliation vs Tally

↓

Approved masters and Optional vouchers back

Two ways

Back into Tally only after approval; accounts converts Optional vouchers.

Accounts

Keeps working in Tally as today.

Solves data locked inside Tally

SYS-01 · wk 1–3 · writing

GrowSafe Rulebooks

Akash’s terms, schemes, returns

↓

Formulation and compliance rules

↓

Field sales SOP and KRA

↓

Hindi, English, market language

↓

Every system reads them

Guardrail

Only Akash edits; versioned.

Drafts

Replies and summaries, never an amount.

Solves rules living in one head

SYS-02 · P2 · wk 3–6Replaces Unolo

GrowSafe Field Force

Punch in, punch out with GPS

↓

Geo-tagged dealer visit

↓

Overdue shown beside each dealer

↓

Daily visit report

↓

Works offline, syncs later

Pilot

One state, Unolo in parallel one month.

Then

Unolo switched off.

Solves visits tracked, collections not

SYS-03 · P2 · wk 4–7

Sales Scorecard and Payout Meter

Sales and collections from the Bridge

↓

Daily scorecard per salesperson

↓

TA on verified route distance

↓

Base, TA, uncapped incentive

↓

Month-end sheet for Akash

Guardrail

Nothing paid until Akash signs.

Open input

Thresholds, TA rate, slabs.

Solves salaries without collections

SYS-08 · parallel lane · wk 1 on

GrowSafe People Desk

SOPs per role

↓

Read receipts

↓

KRAs and KPIs per role

↓

Hiring simulations

↓

Onboarding checklist

Standalone

Not fed from Tally, by Akash’s note.

Stays human

Hiring and termination.

Solves no middle layer to hold the team

SYS-04 · P3 · wk 6–8Replaces Biz Analyst

GrowSafe Role Board

Same Bridge data

↓

Owner view: sales, outstanding, stock

↓

Billing queue

↓

Dispatch and bilty queue

↓

Accounts and QC queues

Locked

Each role sees its own fields only.

Then

Biz Analyst switched off.

Solves staff asking accounts for numbers

SYS-05 · P3 · wk 6–9Replaces AgriCost.In

Costing and Margin Guard

Recipes rebuilt in the OS

↓

Purchase rates from the Bridge

↓

Landed cost per SKU

↓

Red list below threshold

↓

Draft price list for Akash’s yes

Guardrail

Recipes and prices change only on his yes.

Then

AgriCost.In switched off.

Solves selling at old price lists

SYS-06 · P3 · wk 7–9

Batch Expiry and Season Board

Batch, godown, expiry from Tally

↓

Inside 90, 90–180, beyond 180

↓

Stock vs last Kharif, Rabi

↓

Ageing here, short there

↓

Feeds liquidation deals

Rhythm

Read every Monday.

Decision

Every transfer by Akash.

Solves near-expiry stock found too late

SYS-07 · P4 · wk 9–12New

Customer App, B2B + D2C

B2B: dealers, licensed retailers

↓

Catalog, ledger, credit, orders

↓

Prepaid flash-liquidation deals

↓

D2C: prepaid, non-restricted only

↓

Delhivery shipping; order into Tally

No

B2B2C or multi-tier routing.

Guardrail

Credit overrides stay with Akash.

Solves dealers phoning for everything

Kept: **Tally Prime** for accounts, billing, GST and receipts; **Google Workspace**. Discontinued after their replacements run alongside: the **old sync script**, **AgriCost.In**, **Unolo**, **Biz Analyst**. New: **GrowSafe OS** on **Supabase** (Mumbai) and **Vercel**, built with **Claude**; **Delhivery** and a payment gateway for the customer app.

07Implementation RoadmapPhase table · 4 phases + a parallel lane · 12 weeks from 25.11.2026

**P1 · wk 1–3**Tally Bridge · read side by 10 Dec

**P2 · wk 3–7**Sales reporting

**P3 · wk 6–9**Owner view, costing, expiry

**P4 · wk 9–12**Customer app, to mid-Feb

| Phase | Focus                                   | Systems                  | Duration  | Done when                                                                                                                                                                                                                                                     |
|-------|-----------------------------------------|--------------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | The Tally Bridge                        | F-00 · SYS-01            | 3 weeks   | 4–5 years of Tally data sit in the new Supabase; trial balance, stock by godown and batch, and party outstanding match Tally for 7 days running; one approved test ledger and one Optional voucher of each type appear in Tally; the Rulebooks v1 are signed. |
| P2    | Sales team reporting and accountability | SYS-02 · SYS-03          | 5 weeks   | Field Sales Officers in one state punch in and log visits only by geo-tagged check-in, see their daily sales and collections from Tally and TA from verified distance; Unolo runs alongside, then stops.                                                      |
| P3    | Owner view, costing and expiry          | SYS-04 · SYS-05 · SYS-06 | 4 weeks   | Akash opens one owner view instead of Biz Analyst; every SKU below threshold is on a red list with a draft price list he approved; near-expiry stock by godown is read every Monday; AgriCost.In and Biz Analyst are off.                                     |
| P4    | Customer app, B2B + D2C                 | SYS-07                   | 4 weeks   | Pilot dealers order, download ledgers and buy liquidation deals; D2C buyers pay and track Delhivery shipments; approved orders reach Tally as Optional sales vouchers with no retyping.                                                                       |
| Lane  | People Desk, in parallel                | SYS-08                   | From wk 1 | Every role has an SOP with read receipts and a KRA and KPI card; the first hiring simulation has been run.                                                                                                                                                    |

08Why This Build Order2×2 matrix · Akash’s priorities, call 24.11

High impact · runs without anyone changing

F-00GrowSafe Tally Bridge

SYS-01 + SYS-08Rulebooks and People Desk (writing first)

→ first: every other system reads the Bridge

High impact · needs people to change

SYS-02 + SYS-03Field Force, Scorecard and Payout Meter

→ second: Akash’s priority 2, sales accountability; one state first

Compounding · needs clean data

SYS-04Role Board

SYS-05 + SYS-06Costing and Margin Guard; Batch Expiry and Season Board

→ after the Bridge has reconciled for weeks

Growth · revenue and cash flow

SYS-07Customer App, B2B + D2C, with Delhivery

→ once the write-back into Tally is proven

← low dependence on human changehigh →

Akash set the order himself: **“my project’s base is my Tally”**, then sales reporting, with admin, SOPs, KRAs and KPIs in parallel. The customer app comes last in the window only because it writes orders back into Tally, which must be proven first.

09GuardrailsSwimlane · set by Akash

AI acts alone

Share ledgers, tracking, terms in local languagesPrompt quantity and cash-discount offersAutomated payment remindersVerified GPS TAFlag near-expiry and margin dropsDaily sales and collection scorecards

Human signs off

Credit notesCredit limit or overdue overridesPrice lists and recipesPayroll and incentive payoutsRaw material purchase ordersEvery voucher written into Tally

Never automated

Vendor selection and price negotiationCIBRC, FCO, GST filingsHiring and terminationInterest waivers, bad-debt write-offsSilent fixes to Tally mismatches

Akash’s own rules, unchanged from Rev A. Rev B adds two of its own: **nothing enters Tally except an approved master or Optional voucher through the Bridge**, and D2C sells only non-restricted products.

10Next StepsImmediate actions

01

**Read and confirm Rev B,** section by section, and fill the eight blank numbers. Akash.

02

**Connect the GrowSafe OS repository** to Claude Code on your development PC and paste the starter prompt; Claude guides the rest. Akash.

03

**Build the Tally Bridge yourself,** both ways, step by step with Claude (Continue Building Guide, section 08). Akash.

04

**Your development PC, and the Tally server:** Claude on your own PC; the Tally server on the accounts LAN, by Remote Desktop, kept on with Tally open. Akash.

05

**New Supabase project on Pro** (Mumbai), separate from the old experiments. Akash.

06

**Write the Rulebooks** with Claude: terms, returns, credit notes, compliance, field SOP and KRA. Akash.

07

**Set the open inputs:** margin threshold, TA per km, incentive slabs, pilot state and dealers. Akash.

08

**For P4:** payment gateway, Delhivery account, and the list of non-restricted D2C products. Akash.

Scope1 foundation + 8 systems · 4 phases + a parallel lane

Window25.11.2026 to mid-February 2027; Bridge read side by 10.12.2026

SourcesRev A, Akash’s note, call and requests of 24.11.2026

PartThe build

Every item traces to the Rev A blueprint audit (23.11.2026), Akash’s note printed on its last page, or the call and written requests of 24.11.2026 · unknowns are named, not guessed · the in-depth blueprint follows

Buildour AIClient Blueprint

# AI SYSTEMS BLUEPRINT · REV B

GrowSafe  ·  Prepared for **Akash Dubey**, Owner

Tally Bridge–– Dealer order–– Credit and stock–– Invoice in Tally–– Dispatch–– Collection–– Receipt

|                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                                                                                                                                                  |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BusinessGrowSafe, agro chemicals manufacturer: head office and plant at Mandideep (Bhopal/Raisen, MP), state C&F and branch godowns, dealers and retailers across several states. Turnover band stated at ₹50 Lakh to 1 Crore a month.                                                                                                                                                                                                          |                                                                                                                                                                                  |
| Current StackTally Prime (4 to 5 years of data); Google Workspace; Unolo; Biz Analyst; AgriCost.In and a scripted Tally to Supabase sync, both built in-house and, by Akash’s note, treated as past experiments. A new private GitHub repository, GrowSafe OS, was created on the call of 24.11.2026.                                                                                                                                           |                                                                                                                                                                                  |
| Prepared byBuildOur AI · AI expert Romana Parkar                                                                                                                                                                                                                                                                                                                                                                                                | SourcesRev A blueprint audit and Systems Brief (23.11.2026) · Akash’s note, printed on Rev A’s last page · call with Romana (24.11.2026) · Akash’s written requests (24.11.2026) |
| Systems Specified1 foundation + 8 systems in 4 phases and one parallel lane                                                                                                                                                                                                                                                                                                                                                                     | Deadline AnchorTally Bridge read side live and reconciling by 10.12.2026; the twelve weeks end in mid-February 2027                                                              |
| Build modelAkash builds it with Claude Code on his own development PC, following the GrowSafe Starter and Continue Building Guides. The Tally Prime server on the accounts LAN, reached by Remote Desktop, runs only Tally and the Bridge connector; Claude is never installed on it. Claude guides every setup step (the repository, a new Supabase project, Vercel, TallyPrime and the Tally Bridge) and opens a new session for each system. |                                                                                                                                                                                  |

Rev B supersedes Rev A (23.11.2026). Every change traces to Akash’s note or the call and requests of 24.11.2026.  
Sheets 1–4 are the one-shot capture

00

EXECUTIVE SUMMARY

Overview

“All our core financial and inventory data... lives inside Tally Prime. However, because this data is locked inside Tally and not accessible to team members based on their roles, our staff operates blind.” That is how Akash Dubey describes GrowSafe, an agro chemicals manufacturer at Mandideep that sells to dealers and retailers across several states through C&F and branch godowns. Dealers phone for ledgers and tracking, field sales officers draw salaries without verified visits or realised collections, and price lists stay old after raw material rates rise in Tally.

Rev A answered that, but on the wrong foundation. It built on the Tally to Supabase script and on AgriCost.In, which Akash’s own note on its last page told it not to do; it left out the B2B + D2C customer app his note asked for; and it kept Unolo and Biz Analyst in the stack. On 24 November he asked for the errors to be removed: *“I need fully new tool that syncs complete Tally data to supabase, and I want to discontinue previously used tools Agricost, Unolo & Biz Analyst.”*

This revision makes six structural changes, each traceable to his note or the call: (1) a **fresh GrowSafe OS** in a new repository and a new Supabase project, with the old sync and AgriCost.In treated as past experiments; (2) a new **two-way Tally Bridge** as the foundation: all of Tally into Supabase, and back into Tally only vouchers a person has approved; (3) **sales team reporting and accountability** second, by his priority; (4) **AgriCost.In, Unolo and Biz Analyst rebuilt inside the OS** and switched off after their replacements run alongside; (5) the **B2B + D2C customer app** with Delhivery and liquidation deals added; (6) **HR and operational layers** (SOPs, KRAs, KPIs, hiring simulations) kept standalone, not fed from Tally.

Accounts keeps working in Tally Prime; everyone else moves to GrowSafe OS. Nothing writes into Tally without a person’s approval, and every price list, credit note and payout is still signed by Akash.

01

CURRENT STATE

How work happens today, and where it hurts

### 1.1Tally holds everything; only accounts can open it

Every station of the money path runs through Tally Prime: credit limits, overdue ageing, batch stock, GST invoices, e-way bills, receipts and reconciliation, across several GSTINs and godowns, with 4 to 5 years of history. The person who needs a number (a dealer, a field sales officer, a dispatch clerk) is never the person who can open Tally.

Pain“Every routine inquiry turns into a manual bottleneck, causing delays, human errors, and heavy dependency on key people.”

### 1.2Dealers cannot self-serve

Orders arrive by phone, WhatsApp or field visit. Ledgers, bilty tracking, terms, credit note and return requests all become calls to sales staff, who then call accounts. Credit note approvals wait on one desk.

Pain“Customers cannot self-serve and must depend entirely on our staff for basic, routine interactions.”

### 1.3Field sales: salaries without verified collections

Unolo tracks GPS and attendance but sits apart from Tally receipts, so a visit is tracked and a collection is not. Kilometre bills are checked by hand, and there is no instant view of each person’s return.

Pain“Salespeople are drawing fixed salaries (CTC) and claiming expenses without generating enough turnover or timely payment collections to justify even their basic remuneration.”

### 1.4Margin leakage and expiring batches

AgriCost.In costs a formulation correctly, but when purchase rates rise in Tally the cost sheets and price lists stay old until someone reruns it. Batch expiry is spread across state godowns with no single view.

Pain“We often keep selling at old price lists after raw material costs have already spiked... slow-moving or near-expiry batches sit unnoticed in one state until they become dead stock.”

### 1.5The team: everyone reports to the owner

Field sales officers in several states, an accountant and billing operators, dispatch and godown staff, QC chemists and factory workers, with no regional sales head, accounts head or plant manager named. SOPs, KRAs and KPIs are not yet running. Headcount was not stated.

Pain“Everyone reports to me.” Every review, approval and escalation lands on one desk with 10 to 15 hours a week to give.

### 1.6The tools: four experiments, none joined

A scripted Tally to Supabase sync, unstable and not structured; AgriCost.In for costing; Unolo for the field force; Biz Analyst for Tally figures on the owner’s phone. Each worked alone; none talks to the others. On the call Akash asked for all of them to come into one GrowSafe OS and for AgriCost.In, Unolo and Biz Analyst to be discontinued.

PainFour places to look, and the sync underneath them is the weakest piece.

### 1.7What Rev A got wrong

Akash’s note was printed on the last page of Rev A, but the pages before it were not written to it. These are the errors Rev B removes:

| \#  | Rev A said                                                                       | Rev B, and why                                                                                                                       |
|-----|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| E1  | F-00 is “the Tally to Supabase sync Akash already built, confirmed and widened”. | A fully new two-way Tally Bridge into a new Supabase project. His note: do not build on the old sync; his request: “fully new tool”. |
| E2  | The Margin Guard “sits on AgriCost.In”.                                          | Costing rebuilt inside the OS; AgriCost.In discontinued.                                                                             |
| E3  | Unolo and Biz Analyst in the stack kept, replaced later.                         | AgriCost.In, Unolo and Biz Analyst all discontinued, each after its replacement runs alongside.                                      |
| E4  | No customer app, no D2C, no Delhivery liquidation engine.                        | SYS-07 Customer App, B2B + D2C, exactly as his note sets it out.                                                                     |
| E5  | SOP and KRA rules mixed into Tally-fed systems.                                  | SYS-08 People Desk, standalone; Tally feeds only accounting, billing and batch inventory.                                            |
| E6  | Read-only: “nothing on this sheet writes to Tally”.                              | Both ways, as he asked: approved vouchers go back into Tally through the Bridge.                                                     |
| E7  | First domino: the Margin Guard.                                                  | First the Tally Bridge, second sales reporting, by his priorities on the call.                                                       |
| E8  | Next steps: share AgriCost.In access; list fields missing from the current sync. | Removed. Nothing is read from the old tools.                                                                                         |

FindingThe note was right and the plan ignored it. Rev B is written to the note first, then to the call.

02

RECOMMENDED AI SYSTEMS

Foundation + 8 systems

GROWSAFE TALLY BRIDGEF-00 · FOUNDATION · P1 · NEW

What it is

A new tool, built fresh to Akash’s five Bridge points, that keeps Tally Prime and GrowSafe OS in step; BuildOur provides its starter code, which Claude installs, tests on a copy of one company and adjusts. A small connector runs as a background service on the Tally Prime server on the accounts LAN, talks to Tally there over its own XML interface (localhost:9000) and connects out to Supabase over HTTPS only; nothing on the server is opened to the internet. Akash installs it over Remote Desktop, guided step by step by Claude from his development PC. **Tally to Supabase:** a first full load of every company and GSTIN, all masters (ledgers, groups, stock items, units, godowns, batches with manufacturing and expiry dates, price levels) and every voucher for the 4 to 5 years on record; then every few minutes it picks up only what changed. **Supabase to Tally:** only items a person has approved in the OS: new masters (dealer ledgers first) are created in Tally, and Sales, Receipts, Payments, Credit Notes and Debit Notes go in as **Optional** vouchers, each tagged with its app id, which accounts converts to regular vouchers by hand. **People:** each staff profile is mapped to its expense or salary ledger or cost centre, and each salesperson to dealer groups, picked from Tally’s own lists. **Every day** it compares Tally with Supabase (trial balance, stock by godown and batch, party outstanding) and flags any difference. `Tally ↔ connector on the Tally server → HTTPS out → new Supabase (Mumbai) → GrowSafe OS`

Solves

§1.1, data locked in Tally; §1.6, the unstable old script.

Guardrail

Nothing is written into Tally without approval, and vouchers only as Optional. A mismatch is flagged for accounts, never silently fixed. The Supabase secret key lives only in the connector’s settings on the Tally server, typed there by Akash. Accounts keeps working in Tally exactly as today.

Retires

The old sync script and the old Supabase project: they keep running untouched (the old script where it runs today, even if that is the Tally server) until the Bridge has reconciled for a week, then they are stopped on Akash’s yes.

GROWSAFE RULEBOOKSSYS-01 · WRITING LANE · WEEKS 1–3

What it does

Akash’s rules, written once with Claude and kept as versioned documents every system reads: the **Dealer Desk Rulebook** (terms and conditions, return window per product type, freight credit note and leakage or damage claim rules with the proof each needs); the **Formulation and Compliance rules** (recipe logic per family, COA, FCO and leaflet formats); and the **Field Sales SOP and KRA** (what a verified visit is, the payout ladder, the monthly review format). In Hindi, English and each market language.

Guardrail

Only Akash edits them. They draft replies and summaries; they never set an amount.

GROWSAFE FIELD FORCESYS-02 · P2 · REPLACES UNOLO

What it does

The field app on each sales officer’s phone: punch in and out with GPS, the day’s assigned dealers with the overdue amount beside each name (from the Bridge), a geo-tagged check-in at each dealer, a short visit report, and the day’s route. Works offline in rural markets and sends when signal returns.

Solves

§1.3, visits tracked apart from collections.

Adoption

One state first, with Unolo running in parallel for one month; Unolo is switched off when the two agree.

GROWSAFE SALES SCORECARD AND PAYOUT METERSYS-03 · P2

What it does

Sales and collections per salesperson, read from Tally through the Bridge, become a daily scorecard against each person’s KRA. TA is calculated only on verified route distance. Each officer sees a payout bar (base covered, TA covered, uncapped incentive) that moves when Tally posts a receipt. At month end it drafts the TA and incentive sheet and a state-wise scorecard for Akash.

Guardrail

Nothing is paid until Akash signs the sheet. The collection-to-cost threshold, TA rate per kilometre and incentive slabs are his to set before it is switched on.

GROWSAFE ROLE BOARDSYS-04 · P3 · REPLACES BIZ ANALYST

What it does

One board on the same Bridge data: an owner view (sales, collections, outstanding by age, stock by godown, margin) on Akash’s phone, and role-locked queues for billing (order requests), dispatch (bilty entry and tracking), accounts (credit note and return requests by age) and QC (batches tested, COA issued).

Guardrail

Each role sees only its fields and its states. Biz Analyst is switched off once the owner view is trusted.

GROWSAFE COSTING AND MARGIN GUARDSYS-05 · P3 · REPLACES AGRICOST.IN

What it does

Recipes, formulations and finished products are rebuilt inside the OS. Raw material purchase rates are read from Tally through the Bridge, so every rate change recalculates landed cost per SKU per litre or kg. SKUs whose margin falls below Akash’s threshold per family appear on a red list with a draft price list, old and new figures side by side.

Guardrail

Recipes and price lists change only on Akash’s yes. AgriCost.In runs beside it for one month, then is switched off.

GROWSAFE BATCH EXPIRY AND SEASON BOARDSYS-06 · P3

What it does

Every batch by godown with manufacturing and expiry dates from the Bridge, in bands (inside 90 days, 90 to 180, beyond 180), beside stock against last Kharif and Rabi sales per state: ageing here, short there. Read every Monday. Its slow-moving and near-expiry list feeds the liquidation deals in the customer app.

Guardrail

Every stock transfer and every liquidation price is decided by Akash.

GROWSAFE CUSTOMER APP, B2B + D2CSYS-07 · P4 · NEW

What it does

Built to Akash’s note. **B2B mode:** existing dealers and newly onboarded licensed retailers sign in with an OTP tied to their GSTIN, see the full catalogue, their credit and ledger, download statements, place orders within their credit limit, and buy prepaid flash-liquidation deals on slow-moving or near-expiry batches. **D2C mode:** open buyers pay first and get instant access to non-restricted bio-stimulants and micronutrients, shipped and tracked through Delhivery. Approved orders go into Tally through the Bridge as Optional sales vouchers, with no retyping; accounts converts them.

Guardrail

No B2B2C or multi-tier routing. Orders over a credit limit or under an overdue block wait for Akash. D2C never shows a restricted product. Prices and deals come only from lists he approved.

Needs

A payment gateway of Akash’s choice, a Delhivery account with API access, and the list of non-restricted D2C products.

GROWSAFE PEOPLE DESKSYS-08 · PARALLEL LANE FROM WEEK 1

What it does

The operational layer, standalone as Akash’s note asks: SOPs for each role with read receipts, a KRA and KPI card per role, hiring simulations for new field sales officers, and an onboarding checklist. Payroll and HR accounting stay in Tally.

Guardrail

Final hiring and termination decisions are never automated.

Months 4 to 12, after this window (from Rev A, unchanged in intent)

The Credit Note Router, the Collection Reminder Flow, GrowSafe Dealer Munshi (answers routine dealer questions on WhatsApp in every operating language), the Sales ROI Board, the Batch Release to Dispatch Flow, the Stock Planner and the Field Reviewer. Each reads the same Bridge and starts in draft-only mode.

03

IMPLEMENTATION ROADMAP

4 phases + a parallel lane · 12 weeks

Akash set the order on the call: *“my project’s base is my Tally”*, then the sales team’s reporting and accountability, with admin, SOPs, KRAs and KPIs in parallel. The twelve weeks run from 25.11.2026 to mid-February 2027 at his 10 to 15 hours a week. Rev A’s 10 December deadline asked for the sync, dealer self-service and collection tracking together; read honestly, the Bridge’s read side is what can be live and reconciling by 10 December, and the rest follows in P2 to P4.

| Phase    | Focus                                   | Duration    | End state                                                                                  |
|----------|-----------------------------------------|-------------|--------------------------------------------------------------------------------------------|
| **1**    | The Tally Bridge                        | Weeks 1–3   | All of Tally in the new Supabase, reconciling daily; approved vouchers can go back.        |
| **2**    | Sales team reporting and accountability | Weeks 3–7   | One state on Field Force and the Payout Meter; Unolo stops.                                |
| **3**    | Owner view, costing and expiry          | Weeks 6–9   | Role Board, Costing and Margin Guard, Expiry Board live; Biz Analyst and AgriCost.In stop. |
| **4**    | Customer app, B2B + D2C                 | Weeks 9–12  | Pilot dealers and D2C buyers order in the app; orders reach Tally.                         |
| **Lane** | People Desk                             | From week 1 | SOPs, KRAs and KPIs live for every role.                                                   |

P1

THE TALLY BRIDGE

F-00 + SYS-01 · weeks 1–3

**Why first:** Tally is the source for every other system; Akash called it the main reason he joined. The Rulebooks are written beside it so that P2 starts with the rules ready.

Done when4 to 5 years of Tally data sit in the new Supabase · trial balance, stock by godown and batch, and party outstanding match Tally for 7 days running · the change sync runs within the agreed minutes · on a test copy, one approved ledger and one Optional voucher of each type appear in Tally and are converted by accounts · the Rulebooks v1 are signed.

P2

SALES TEAM REPORTING AND ACCOUNTABILITY

SYS-02 + SYS-03 · weeks 3–7

**Why now:** Akash’s second priority, and the field sales collection-ROI engine his note puts at the centre; it needs only the Bridge’s receipts and the Field Sales SOP.

Done whenField sales officers in one state punch in and log visits only by geo-tagged check-in · each sees daily sales and collections from Tally and TA from verified distance · Akash reads one state scorecard without a call · Unolo ran alongside for a month and is off.

P3

OWNER VIEW, COSTING AND EXPIRY

SYS-04 + SYS-05 + SYS-06 · weeks 6–9

**Why now:** these boards are only as good as the data behind them, so they follow weeks of a reconciled Bridge.

Done whenAkash opens one owner view instead of Biz Analyst · billing, dispatch, accounts and QC work from their own queues · every SKU below threshold is on the red list with a draft price list he approved · near-expiry stock by godown is read every Monday · AgriCost.In and Biz Analyst are off.

P4

CUSTOMER APP, B2B + D2C

SYS-07 · weeks 9–12

**Why now:** the revenue engine his note asks for; it writes orders back into Tally, so it comes once the write-back is proven and the expiry list exists to feed the liquidation deals.

Done whenPilot dealers order, download ledgers and buy liquidation deals in the app · D2C buyers pay and track Delhivery shipments · approved orders appear in Tally as Optional sales vouchers with no retyping.

The Tally Bridge, for the build

| Part              | How it works                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tally side        | TallyPrime on the Tally server PC on the accounts LAN, which Akash reaches only by Remote Desktop; open with the companies loaded. F1 Help → Settings → Connectivity → Client/Server configuration: TallyPrime acts as Both, Enable ODBC Yes, Port 9000, set by Akash over Remote Desktop. The server stays on and never sleeps.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Connector         | Starter code from BuildOur (`tally-bridge-starter`: the connector, its database migration and build spec), written new to Akash’s five points; the BRIDGE session installs it and adjusts it on a test copy of one company. A small program running as a Windows background service on the Tally server, installed once by Akash over Remote Desktop with Claude guiding each step from his development PC. Claude is never installed on the server. It asks Tally for data over XML at localhost:9000 and connects out to Supabase over HTTPS only: no inbound connection, nothing opened to the internet, port 9000 never exposed beyond the LAN. Akash types the Supabase secret key into its settings file on the server; it is stored only there. |
| Testing           | The BRIDGE session never touches the server. Akash runs the connector’s test mode over Remote Desktop when Claude asks; it writes the company list, counts, totals and errors into Supabase (sync_runs, reconciliations), where the session reads them. Each new version is an update Akash installs over Remote Desktop. Open question: is the development PC on the office LAN? Only if so, and Akash and accounts agree, it may read Tally on port 9000 over the LAN for read-only tests, never from the internet.                                                                                                                                                                                                                                  |
| First load        | Every company and GSTIN; masters (ledgers, groups, stock items, units, godowns, batches with dates, price levels); every voucher and its lines for 4 to 5 years, loaded month by month with a count check after each year.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Change sync       | Every few minutes it picks up only new or altered masters and vouchers (Tally’s AlterID), finds deleted vouchers once a day, and records each run (started, rows, errors) in a sync log on the Role Board.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Back into Tally   | A write-back queue in Supabase holds approved items only (who approves what is a setting). Every few minutes the connector imports them locally on the server: new masters (dealer ledgers with GSTIN first, stock items next) are created; Sales, Receipts, Payments, Credit Notes and Debit Notes go in as **Optional** vouchers tagged with their app id. Every name is checked against Tally first, nothing is sent twice, and Tally’s reply is recorded. Accounts converts each Optional voucher to a regular one by hand; the next sync shows it as converted. Test copy first, one type at a time.                                                                                                                                              |
| Staff and dealers | Each staff profile is mapped to its expense or salary ledger or cost centre, and each salesperson to one or more dealer groups maintained in Tally, all by picking from Tally’s own lists; sales performance is measured on those groups.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Reconciliation    | Daily: trial balance, stock summary by godown and batch, and party outstanding compared between Tally and Supabase; any difference is flagged for accounts and never silently corrected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Storage           | A new Supabase project in South Asia (Mumbai) on the Pro plan: 4 to 5 years of vouchers will outgrow the free plan, and free projects pause when idle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

How the setup is guided

Akash connects the GrowSafe OS repository to Claude Code on his own development PC and pastes the starter prompt with the blueprint and both guides; Claude is never installed on the Tally server. From there Claude guides every step: the new Supabase project, Vercel, the TallyPrime settings on the Tally server over Remote Desktop, and the Tally Bridge in order (Tally ready on the server, the provided connector installed there as a background task over Remote Desktop, the read test through its test mode with the results read from Supabase, the year-by-year first load on the server, the change sync, seven days of matching reconciliations, stopping the old script, and last, switching on the write-back into Tally on the test copy, then live). The Continue Building Guide, section 08, sets these out; after the Bridge, Claude opens a new session for each system.

04

GUARDRAILS

Set by Akash, enforced by design

These are Akash’s own rules from Rev A, unchanged, and the build rules that make them hold.

**AI ACTS ALONE:** share real-time ledger statements, shipment tracking and terms in local languages · prompt quantity and cash-discount offers during ordering · send automated payment reminders showing overdue status, early-payment discounts and late-interest rules · auto-calculate verified GPS travel allowance (TA) · flag near-expiry batches and margin drops · generate daily sales and collection scorecards.

**HUMAN SIGNS OFF:** issuing credit notes (freight, leakage or damage, sales returns) · overriding credit limits or overdue blocks for new orders · changing master product price lists or formulation recipes · approving final payroll and incentive disbursements · releasing raw material purchase orders.

**NEVER AUTOMATED:** final raw material vendor selection and price negotiation · statutory regulatory filings (CIBRC, FCO, GST returns) · final hiring and termination decisions · waiving late-payment interest or bad-debt write-offs.

**TALLY, ADDED BY REV B:** nothing enters Tally except an approved master or Optional voucher through the Bridge, tagged with its app id, which accounts converts by hand; accounts keeps working in Tally; reconciliation differences are flagged, never silently fixed.

**THE CUSTOMER APP:** B2B and D2C only, no B2B2C or multi-tier routing; D2C sells only non-restricted bio-stimulants and micronutrients; discounts and interest come only from the terms Akash signed.

05

THE NUMBERS

Flagged, not resolved

All eight dashboard numbers were left blank: leads, quotes, conversion, orders, order value, sales cycle, repeat customers and headcount; so were busy season and “worth it if”. Three questions only Akash can answer: **(1)** the eight numbers, or the go-ahead for the OS to read them from Tally once the Bridge is live; **(2)** the Kharif and Rabi windows per state; **(3)** what would make this worth it. The savings in Rev A, about ₹1.6 lakh a month and three hundred staff hours, were the writers’ conservative estimates, not figures from GrowSafe, and stay estimates until the Role Board can measure them.

06

NEXT STEPS

Detail behind panel 10

04

**Your development PC, and the Tally server:** Claude desktop installed and signed in on Akash’s own Windows development PC, working on the local folder Documents\GrowSafe-OS connected to GitHub. The TallyPrime server stays on the accounts LAN, reached only by Remote Desktop, on with Tally open during working hours; on it run only TallyPrime and the Bridge connector, which connects out to Supabase over HTTPS. Claude is never installed there. Question for Akash: is your development PC on the office LAN? Akash.

05

**Supabase:** a new organisation and project for GrowSafe OS, region South Asia (Mumbai), on Pro. The old project and the old script are not touched until the Bridge reconciles; then they are stopped on Akash’s yes. Keys go only into the development PC’s .env.local, Vercel and the connector’s settings file on the Tally server, never into chat or GitHub. Akash.

07

**Open inputs before P2 and P3:** which Tally companies and GSTINs to sync; the gross margin threshold per formulation family; the collection-to-cost threshold, TA rate per kilometre and incentive slabs; the pilot state for Field Force and the pilot dealer group; the dates to stop Unolo, AgriCost.In and Biz Analyst, each only after its replacement has run alongside. Akash.

08

**For P4:** the payment gateway, a Delhivery account with API access, the list of non-restricted products for D2C, and the rules for liquidation deals (which batches, which prices). Akash.

07

WHAT REV B CHANGED

For sign-off before the build starts

| Type           | What                                                                                                                                                                                | Traces to                          |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| Replaced       | F-00: the old sync “confirmed and widened” becomes a new two-way Tally Bridge into a new Supabase project                                                                           | Note 1; request 1; request 3; call |
| Discontinued   | AgriCost.In, Unolo, Biz Analyst; and the old sync script                                                                                                                            | Request 1; note 1                  |
| Rebuilt inside | Costing (SYS-05), field force (SYS-02, SYS-03), owner view (SYS-04)                                                                                                                 | Call 24.11                         |
| Added          | SYS-07 Customer App, B2B + D2C, Delhivery, liquidation deals                                                                                                                        | Note 3 and 4                       |
| Added          | SYS-08 People Desk, standalone: SOPs, KRAs, KPIs, hiring simulations                                                                                                                | Note 2; call 24.11                 |
| Reordered      | Tally Bridge first, sales reporting second, People Desk in parallel; Margin Guard moves to P3                                                                                       | Call 24.11                         |
| Merged         | Rev A’s Dealer Desk Rulebook, Formulation and Compliance Skill and Field Sales SOP Skill into SYS-01 Rulebooks                                                                      | Rev A                              |
| Moved          | Dealer Portal (Rev A SYS-04) into the Customer App’s B2B mode                                                                                                                       | Note 3                             |
| Kept           | Akash’s guardrails, word for word; the months 4 to 12 systems                                                                                                                       | Rev A                              |
| Changed        | Build model: Claude Code on Akash’s development PC; only TallyPrime and the Bridge connector on the Tally server (accounts LAN), installed over Remote Desktop, outbound HTTPS only | Akash’s note on his setup          |
| Removed        | Next steps that used the old tools (share AgriCost.In access; list fields missing from the old sync)                                                                                | Note 1                             |

Every item in this document traces to the Rev A blueprint audit and Systems Brief (23.11.2026), Akash’s note printed on Rev A’s last page, the call with Romana (24.11.2026) or Akash’s written requests (24.11.2026).  
No figures added beyond those the client provided; unknowns are named, not guessed. Rev B supersedes Rev A in full.
