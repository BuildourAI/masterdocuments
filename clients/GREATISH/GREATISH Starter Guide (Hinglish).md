Buildour AI · GREATISHStarter Guide · Rev A · Hinglish

# GREATISH OS STARTER GUIDE

Ajay Kumar ji ke liye, GREATISH PVT LTD. Aapke accounts connect ho chuke hain. Ab bas **do files upload karo, ek prompt paste karo, look choose karo**, aur Claude Code GREATISH OS ki foundation bana dega.

Accounts  
connected–– Files docs  
mein–– Starter  
prompt–– Look  
choose–– Continue  
building

[TABLE]

Har step par do awaaz: AAP KARO (aapke computer par ek click) · CLAUDE CODE MEIN PASTE KARO (poora box copy karo)

00

PEHLE YE PADHO

Do minute

Aapne likha tha: *“मुझे ऐसी व्यवस्था चाहिए जिसमें कोई भी महत्वपूर्ण काम केवल मौखिक निर्देशों या किसी कर्मचारी की व्यक्तिगत याददाश्त पर निर्भर न रहे।”* Aapka blueprint iska jawab ek shared record aur aath systems se deta hai, teen spines par: field sales, plant, aur accountability. Sabse pehla system hai **GREATISH Beat App**: har field executive ka apna login hoga, duty hours ke andar GPS se check-in karega, approved price list par order book karega, aur collection receipt photo ke saath daalega. Aage ki har report inhi records par banegi, kisi ke likhe hue report par nahi.

Coding aani zaroori nahi hai. Har line Claude Code likhega. Aapka kaam: uske sawalon ka jawab apne shabdon mein do, sahi lage to OK bolo, aur jo bana hai use apne jaane-pehchane logon aur products se check karo. Kuch samajh na aaye to likho `explain this to me in simple words`. Kuch toot jaaye to error ya screenshot paste karke likho `explain this in simple words and fix it`. Aap Claude se Hindi ya English, dono mein baat kar sakte ho.

Ek zaroori baat: English wale box

Is guide mein jo boxes Claude Code mein paste karne hain (prompts, aur peeche ke R2 aur R3 pages), wo English mein hi rakhe gaye hain, kyunki Claude ko unhe bilkul exact follow karna hai. Aapko unhe padhna zaroori nahi, bas poora copy karke paste karo.

Kharcha kitna

Claude Max (lagbhag \$100 mahina) sab kuch build karta hai. GitHub free hai. Vercel Pro lagbhag \$20 mahina, business app ke liye. Supabase shuru mein free hai; field team live hone se pehle Pro (lagbhag \$25 mahina) par le jaana, kyunki GPS check-ins, shop photos aur receipt photos jaldi bharte hain aur Pro mein daily backup milta hai. Baad mein: Plant Auditor, Sales Auditor aur Duty Officer Claude API par chalte hain, aur Tally Prime ke liye office computer par ek chhota connector chahiye. Claude Code har kharcha pehle batayega aur aapke “haan” ka intezaar karega.

STEP 1

Aap karo

**Files ko project folder mein rakho**

1.  Wo folder kholo jo Romana ne aapke saath banaya tha: `Documents\greatish-os`. Uske andar ek folder banao `docs`.
2.  `docs` mein rakho: **AI Blueprint PDF** aur ye **Starter Guide PDF**. Continue Building Guide abhi side mein rakho, Step 4 tak.
3.  `docs` ke andar ek folder `samples` banao aur jo hai wo daalo: approved price list, sales executives aur unke territories ki list, aaj team jo reports bhejti hai unka ek-ek sample, aur aapki companies aur warehouses ki list. **Chemical formulation is folder mein kabhi mat daalna**; Claude unhe alag se, ek locked jagah mein maangega.

STEP 2

Claude Code mein paste karo

**Starter prompt.** Claude app kholo → **Code** → `greatish-os` folder par naya session shuru karo aur uska naam rakho `MAIN`. **AI Blueprint PDF** aur ye **Starter Guide PDF** message box mein drag karo, neeche wala poora box paste karo, aur send karo. Claude paanch stages mein kaam karega aur har stage ke baad aapke OK ka wait karega.

Paste · The starter prompt (MAIN session)

You are setting up the GREATISH OS for GREATISH PVT LTD, which manufactures and sells construction chemicals, waterproofing chemicals, industrial chemicals and machinery through field sales executives and dealers. I am Ajay Kumar, the owner, and I am not a programmer. Attached, and saved in docs/, are my AI Systems Blueprint and my Starter Guide; pages R1, R2 and R3 of the Starter Guide are written for you. This folder is already connected to my private GitHub repository, my Vercel project and my Supabase keys in .env.local. This session is the **MAIN session**. Work in five stages. After each stage, tell me in simple words what you did, then **stop and wait for my OK**. Ask me one question at a time.

**Stage 1: Read and check.** Read the blueprint and the Starter Guide. Tell me in ten lines or fewer: what GREATISH is, my three problems, the foundation and eight systems, and the build order. My numbers sheet was left blank: list every figure the blueprint says I still have to give, and do not guess any. Then check quietly that GitHub, Vercel and the Supabase keys work, and tell me only if something needs fixing.

**Stage 2: The rules.** Create CLAUDE.md holding page R2 of the Starter Guide word for word, plus the build brief and session rules in R3. Make sure .gitignore keeps out .env.local and docs/samples. Read the rules back to me in five lines.

**Stage 3: The foundation.** Build F-00 GREATISH Shared Record as R3 describes: companies, warehouses, users and roles, the approval matrix, sign-in, Row Level Security and the audit log. Ask me for the approval matrix (who signs what, and the limits for discount, credit, expense and stock adjustment) one line at a time. Tell me exactly what to paste into the Supabase SQL Editor and where to click, and what to set in Supabase so sign-in works on my live address. Add my owner login, push, and confirm I can sign in on my phone.

**Stage 4: My list for today.** Create docs/START-NOW.md from page R1: each item with its owner, a start date and a tick box, longest first, and tell me the first action for each. Start every future session by reminding me of anything not ticked.

**Stage 5: Plan the sessions.** Write docs/SESSIONS.md: the build order, which systems are built side by side in separate sessions (R3), and each one’s branch name. Write docs/build-sheets/sys-01.md for the Beat App and Field Day Skill: what it does, what it must never do (from the blueprint), the data it needs and its done-when. No feature code yet. Finish by telling me to choose the look (Step 3 of the Starter Guide) and then open the Continue Building Guide (Step 4).

Jab Claude bole ki Supabase mein kuch paste karo

Supabase project kholo aur check karo ki browser address mein wahi project code hai jo Claude bata raha hai. **SQL Editor → New query** par click karo, paste karo, **Run** dabao, aur neeche **Success** dikhna chahiye. Agar laal text aaye, to use copy karke Claude ko de do.

03

STEP 3 · LOOK CHOOSE KARO

UI section · ek baar, pehli screen se pehle

Claude wahi banata hai jo aap bolte ho, lekin design wahi karta hai jo aap dikhate ho. Kuch nahi dikhaya, to aapki team ko internet ke har app ka average milega: bhara hua, generic, aur koi use nahi karega. Pachaas field executives ye app phone par kholenge, dukaan mein, dhoop mein, do visits ke beech. Agar kuch second se zyada laga, to wo wapas WhatsApp par chale jaayenge, aur uske baad ki har report khaali rahegi.

3.1

Aap karo

**Designs ikattha karo.** **pinterest.com** par search karo `minimalist UI design web app` aur `field sales app mobile clean`. 10 se 15 aisi screens download karo jo aapke executives aur store keeper ek nazar mein samajh jaayein. Bhari hui, dark ya zyada clever cheezein chhod do.

3.2

Aap karo

**Sabse strong model ko choose karne do.** **Claude app** kholo, **Chat** choose karo (Code nahi), list mein sabse strong model chuno, saari screenshots attach karo aur ye chooser prompt paste karo.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: GREATISH PVT LTD, a manufacturer of construction chemicals, waterproofing chemicals, industrial chemicals and machinery. The screens are used by field sales executives on Android phones from shop to shop, by the store keeper on a phone at the plant gate, by the production, purchase and accounts teams on office computers, and by me on my phone for approvals and one daily view of the whole company. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

3.3

Aap karo

**Likhit mein lo.** Sirf jeetne wale ek ya do designs dobara upload karo aur pucho: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* .md file download karo aur images ke saath `docs/design/` mein save karo. Agar jawab bahut chhota aaye (“a sales app”), to sudharo: *“This is the whole GREATISH company: field sales, plant, stores, purchase, accounts, HR and tasks.”*

3.4

MAIN mein paste karo

**Look Claude ko de do.** Claude ek sample screen banayega taaki aap kuch bhi build hone se pehle apne phone par look dekh sako.

Paste · MAIN · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and section 03 of the Starter Guide. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and the screen rules in section 03 of the Starter Guide, and build one sample screen, a field executive’s home screen with today’s beat plan, using dummy data, so I can see the look on my phone before any system is built. Wait for my OK.

### Aapki main screens, har ek ka ek sawaal

| System                     | Screen aur uska ek sawaal                                                                 | Ek main button      | Kaun, kis par        |
|----------------------------|-------------------------------------------------------------------------------------------|---------------------|----------------------|
| SYS-01 Beat App            | **Mera din:** “aaj kaun si dukaanein, aur mera target kya hai?”                           | Check in            | Executive, Android   |
| SYS-01 Beat App            | **Dukaan par:** “yahan kya dekha, kya becha, kya collect kiya?”                           | Save visit          | Executive, Android   |
| SYS-02 Sales Command Board | **Team:** “kaun kaam kar raha hai, aur kahan claim record se match nahi kar raha?”        | Flag kholo          | Aap, sales head      |
| SYS-03 Store Gate          | **Gate par:** “kya aa raha hai ya ja raha hai, kis PO, batch ya order ke against?”        | Movement record     | Store keeper, phone  |
| SYS-04 Task Desk           | **Mera kaam:** “aaj kya due hai, aur kaunsa proof use band karega?”                       | Proof ke saath band | Har employee         |
| SYS-04 Pending Work Board  | **Company:** “har department mein kya pending hai, aur kya mera wait kar raha hai?”       | Approve             | Aap, phone           |
| SYS-06 Plant Board         | **Plant:** “kya bana, asli cost kya aayi, aur kya kam hai?”                               | Batch kholo         | Aap, production head |
| Approval queue             | **Mera wait:** “kaunsa rate, credit, purchase ya expense mere haan ka wait kar raha hai?” | Approve / reject    | Aap, phone           |

### GREATISH screen rules

- **Field-proof pehle.** Executive aur store ki screens basic Android phone par ek haath se, dhoop mein chalein: bade button, high contrast, bada text.
- **Typing se pehle photo aur GPS.** Check-in, dukaan ke board ki photo, receipt ki photo: har ek ek tap mein. End-of-day report check-ins se khud draft ho, executive bas confirm kare.
- **Kamzor network mein bhi chale.** Visits aur gate entries phone par save hon aur signal aate hi chali jaayein, aur screen par likha aaye (“saved, will send”).
- **Har insaan ke liye Hindi ya English.** Har label us bhasha mein dikhe jo user chune.
- **Price list hi decide karegi.** Order screen par sirf approved rate dikhe; koi aur rate ya credit ek request ban jaaye, saaf “approval ka wait” badge ke saath.
- **Claimed matlab verified nahi.** Visit, order aur collection tab tak “claimed” dikhein jab tak GPS, invoice ya bank se match na ho, aur screen bataye kaunsa match hua.
- **Aapke liye pehle exceptions.** Aapki screens wahi khol kar dikhayein jo red hai, jo aapke signature ka wait kar raha hai, aur jo match nahi hua. Red aur green ka matlab sirf late aur on track.
- **Formula kisi screen par nahi**, sirf aap aur production head ke liye; salary ya incentive ka koi figure kisi employee ko aapke sign se pehle nahi.

| Paanch screen laws                           | Claude jo bhi screen dikhaye, ye check karo                                             |
|----------------------------------------------|-----------------------------------------------------------------------------------------|
| **1 · Koi padhta nahi, sab scan karte hain** | Jo cheez user ko sabse pehle dikhni chahiye, wahi screen par sabse badi aur bold ho.    |
| **2 · Ek screen, ek kaam**                   | Ek main button, bina scroll kiye dikhe, us ek rang mein jo action ke liye rakha hai.    |
| **3 · Ek jaisa dikhna hi bharosa hai**       | Ek hi cheez har screen par ek jaisi dikhe: dukaan, order, batch, red flag.              |
| **4 · Default hi decision hai**              | Jo baar baar bhara jaata hai wo pehle se bhara ho: date, territory, company, warehouse. |
| **5 · Chuppi ek error hai**                  | Har tap ka turant jawab aaye: koi change, tick ya message.                              |

**DO MINUTE KA RULE:** naya executive koi bhi screen khole aur do minute ke andar, bina training ke, samajh jaaye ki ye kya hai aur kya karna hai. Agar screen samjhani pade, to galti screen ki hai, employee ki nahi. Asli test: phone ek executive ke haath mein do aur bina madad kiye dekho.

STEP 4

Aap karo

**Ab Continue Building Guide kholo**

Ye Starter Guide ek hi baar use hoti hai; jab bhi koi nayi screen dikhayi jaaye, iska section 03 khula rakho. Ab se **Continue Building Guide** hi use karni hai: har sitting ki shuruaat mein, har system shuru karne ke liye, aur ek saath kai sessions chalane ke liye. Uski PDF `docs/` mein tab daalo jab ye sab sach ho:

- Aap apne phone par `.vercel.app` address par OS mein sign in kar sakte ho.
- `CLAUDE.md` mein aapke rules hain; foundation tables aur approval matrix Supabase ke **Table Editor** mein dikhte hain.
- `docs/START-NOW.md`, `docs/SESSIONS.md` aur SYS-01 build sheet likhe gaye hain, aur aapne unhe padh kar sudhaar diya hai.
- `docs/design/` mein aapka chuna hua look hai, aur sample screen aapke phone par sahi dikhti hai.

Phir uska section 02, **Every sitting**, kholo aur follow karo. Agar koi box tick nahi hua, to use MAIN mein paste karke bolo *“fix this before we continue.”*

R1

CLOCKS: docs/START-NOW.md KE LIYE

Stage 4 mein Claude Code padhega

Wo cheezein jo aap ya aapki team par ruki hain. Har ek `docs/START-NOW.md` mein ek line banegi, owner, start date aur tick box ke saath.

| \#  | Kya chahiye                                                                                                                                                         | Owner                        | Kiske liye     |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|----------------|
| 1   | **Aath khaali numbers:** leads, quotes, conversion, orders, average order value, sales cycle, repeat customers aur headcount; saath mein money path aur people map. | Ajay ji                      | Day 1          |
| 2   | **Approval matrix:** kaun kya sign karega, aur discount, credit, expense aur stock adjustment ki limits.                                                            | Ajay ji, build team ke saath | F-00           |
| 3   | **Companies aur warehouses** jo GREATISH aaj chalata hai, aur pehle kiske liye build karna hai.                                                                     | Ajay ji                      | F-00           |
| 4   | **Sales executives:** naam, mobile, territory, dealer aur shop pins, authorised field duty hours; approved price list aur customer credit limits.                   | Sales head                   | SYS-01         |
| 5   | **Field rules:** asli shop visit kise maanenge, visit outcomes ki fixed list, har executive ka target.                                                              | Ajay ji, sales head ke saath | SYS-01, SYS-02 |
| 6   | **Product list** har pack size ka BOM, standard consumption norms, QC parameters aur reorder levels ke saath. Formulations locked rahengi, share nahi hongi.        | Ajay ji / production head    | SYS-03, SYS-06 |
| 7   | **Store aur purchase:** store gate kaun sambhalega, open purchase orders, har material ke approved suppliers, batch numbering rule.                                 | Production head, purchase    | SYS-03, SYS-07 |
| 8   | **Department SOPs** paanch line mein: kaun karega, kab, kaun approve karega, kitna time, aur na hone par kisko bataya jaayega.                                      | Department heads             | SYS-04, SYS-05 |
| 9   | **Software list:** aaj kis cheez ka paisa jaata hai, kya use hota hai, kya band karna hai.                                                                          | Ajay ji                      | Stack note     |
| 10  | **Tally Prime:** kaunsa edition, kis office computer par, admin access kiske paas, har company ki alag Tally company file.                                          | Accounts                     | SYS-07         |
| 11  | **Hafte ka 1 se 2 ghante ka approval slot**, aur July, September aur December ka calendar khaali rakhna.                                                            | Build team                   | Planning       |

R2

THE RULES: FOR CLAUDE.md, WORD FOR WORD

Stage 2 mein Claude Code padhega · English mein hi rakha hai

Standing rules for everything ever built in this folder, in every session

**House rules.** 1 · ONE HOME: this folder, repository, database and app are the only ones GREATISH will ever have; every system is a new section of the same app, multi-company and multi-warehouse, so a new unit or company joins without a rebuild. 2 · EVERY PERSON THEIR OWN KEY: every user has their own login and sees only what their role needs; Ajay sees everything; no shared passwords. 3 · A HUMAN YES BEFORE ANYTHING LEAVES OR MOVES MONEY: no purchase order, quotation rate, credit, discount, payment, stock correction or Tally entry goes out or posts without the approver named in the approval matrix; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action is written to a log that can only be added to; deleting or altering audit records is never possible. 5 · SECRETS STAY IN THE CUPBOARD: keys live only in .env.local and in Vercel’s settings, never in code, in chat or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: rates, totals, costs, stock and incentives come from exact tested rules; AI reads, drafts, matches and alerts, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**GREATISH rules, set by Ajay.** AI may act alone to: make daily reports; monitor employee attendance and productivity; track sales targets and identify pending work; send routine reminders to customers; route new enquiries to the right employee and allocate leads by set rules; draft quotations, business documents and HR documents from approved formats; monitor stock; reconcile records across departments and alert on errors or mismatches; check authorised data, match employee reports to real records, and suggest to management. A person signs off: pricing and negotiation; all large financial transactions and bank transfers; supplier payments, large purchases and raw material purchase; new credit limits, discounts beyond the set limit, special permission to sell on credit; large stock changes; hiring or dismissal, salary changes, large incentive changes; legal agreements, government returns and key compliance; changes to product formulae and large business contracts. Never automated: bank payments without permission; taking large financial obligations on the company’s behalf; final decisions on large investments; hiring or dismissing employees without human check; final certification of legal and government documents; unauthorised changes to confidential chemical formulae; deleting or altering audit records; sharing confidential company information.

**How these become code.** GPS is recorded only inside each executive’s authorised field duty hours. Orders are locked to the approved price list; any other rate or credit beyond limit is saved as a request and goes nowhere until approved. Collections stay “claimed” until accounts matches them with the bank. No flow, auditor or agent ever names an employee at fault on inference: mismatches go to a person with the evidence. Formulations are readable only by Ajay and the production head, are never written to docs/, samples, GitHub or a prompt, and no system can change them. Every record carries its company, warehouse, user and time. The blueprint’s numbers were left blank: never invent or hard-code a figure. Build in the blueprint’s order; a system starts only when Ajay approves its build sheet.

R3

THE BUILD BRIEF: FOR CLAUDE CODE

Ajay ji ye page skip kar sakte hain

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for photos) through `@supabase/ssr` and `@supabase/supabase-js`, deployed on Vercel from `main`; branches get Vercel preview deployments. Mobile-first web app added to the home screen; the Beat App and Store Gate save offline and sync. GPS through the phone browser’s location permission, only inside duty hours; maps with a free map library, no paid maps API unless Ajay agrees. Scheduled jobs (7 PM field verify, nightly auditor runs, morning notes) as Vercel Cron calling protected routes. Notifications inside the app first; WhatsApp only later with Ajay’s yes. Tally Prime (SYS-07) through Tally’s own XML interface on the office computer via a small connector, chosen with Ajay in phase 4. Agents (Duty Officer, auditors) on the Claude API, cost shown first. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, later `CRON_SECRET`, `ANTHROPIC_API_KEY`; `.env.example` with names only.

### F-00 Shared Record: the starting shape

**companies**; **warehouses** (company); **profiles** (name, mobile, company, role owner / sales_head / executive / production_head / store_keeper / purchase / accounts / hr / manager / staff, language, duty hours, active); **approval_matrix** (action, company, limit, approver role or person); **territories**; **customers** (dealer or shop, pin latitude and longitude, territory, credit limit, company); **products** (name, pack sizes, category: chemical or machinery; no formula); **price_list** (product, pack, rate, valid from, company); **approvals** (request, requested by, approver, status, decided at); **settings** (automation switch off by default); **audit_log** (append only, no update or delete for anyone). Formulations, when needed, go in a separate table readable only by owner and production_head. Row Level Security: Ajay sees all; each role sees its own company, department and records; executives see only their own territory. Later systems add visits, orders, collections, stock movements, batches, tasks in their own migrations.

### Sessions

- **MAIN** owns `main`, CLAUDE.md, docs/SESSIONS.md and the database; it applies migrations in order and merges finished work.
- **One builder session per system**, at most three at a time, each in its own git worktree on branch `sys-0N-short-name`, touching only `app/(sys-0N)/` and `lib/sys-0N/`; new tables only in a new migration `<timestamp>_sys0N_<what>.sql`, adding, never dropping or renaming. Shared files change only in MAIN; requests go in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing lane** for the skills (Field Day, Batch Record formats, HR Letter and SOP): only `docs/` and `content/`, never formulations.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Ajay Kumar ji ke liye · GREATISH PVT LTD · blueprint BOA-2026-GRE-01 Rev A (blueprint audit 10.11.2026) par aadhaarit.  
Stack fixed: Claude Code, Next.js, Supabase, Vercel, GitHub.
