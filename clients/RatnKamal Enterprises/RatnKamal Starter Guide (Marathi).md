Buildour AI · RatnKamal EnterprisesStarter Guide · Rev A

# RATNKAMAL OS STARTER GUIDE

**Santosh Uttam Mali**, RatnKamal Enterprises yanchyasathi tayar kele. Claude plan ani GitHub repository pasun **tumchya phone var live app** paryant: Supabase ani Vercel shi jodlela, tumche niyam lihilele, **tumcha look nivadlela** ani tumchi pahili system plan keleli. He sagla ekdach kara, eka baithakit.

Install–– Accounts–– Folder ani  
docs–– Starter  
prompt–– Phone var  
live–– Look  
nivada

[TABLE]

Starter prompt Romana kadun vegla message mhanun yeil · Pratyek step var don prakar: TUMHI HE KARA · CLAUDE CODE LA PASTE KARA

00

AADHI HE VACHA

Paach minute

Tumhi lihile hote: *“My ultimate goal is to manage the entire RatnKamal Enterprises business through a centralized AI-powered management system.”* Tumchi blueprint tithe bara aathavdyat pochte, ek veli ek system: aadhi pratyek enquiry la sarkha qualification reply ani yogya catalogue pages miltat, mag pratyek quotation eka screen varun yete ani price line var tumcha approval lagto, mag saha channels madhun yenarya enquiries typing na karta eka jagi yetat, ani baravya aathavdyat sakalcha ek taas reports gola karnyat ghalavnyaaivaji tumhi sakali 9 AM la fakt ek message ughadta.

**Tumhi aadhich jyache paise deta, tyatla kahihi badalnar naahi.** Custom tracking software madhe Order Form, Job Card Sheet ani batch tabs tasech rahtil; Vyapar madhe accounts rahtil; IndiaMART, TradeIndia, Justdial ani Meta enquiries aanat rahtil. Jya CRM ani task manager che tumhi paise deta pan vaprat naahi, te punha kaamala lagtil. Navin app ha hya saglyanna jodnara thar (layer) aahe.

**Kontehi coding karayche naahi.** Claude Code pratyek line lihito. Tumche kaam: tyachya prashnanchi uttare tumchya shabdat dya, patla tar OK mhana, ani tyane je banavla te tumhala mahit aslelya enquiries, quotations ani batches shi tapasun paha. Kahi samajla naahi tar type kara `explain this to me in simple words`. Kahi bighadla tar error kinva screenshot paste kara ani type kara `explain this in simple words and fix it`. Tumhi Claude shi Marathi, Hindi kinva English madhe lihu shakta.

Kharch kiti, spashta

**Claude Pro** suruvatila chalto; don sessions baju-baju la build karu lagle ki **Claude Max** changla. GitHub free aahe. **Supabase** suruvatila free aahe; staff roj vapru lagnyaaadhi, backups sathi, Pro (sadharan \$25 mahina) var ja. Business app sathi **Vercel Pro**, sadharan \$20 mahina. Nantar: **WhatsApp Business API** number (week 5 pasun lagel, jevha enquiries la apoaap uttar jayla lagel), IndiaMART, TradeIndia ani Justdial kadun leads cha access tumchya chalu plans var, ani **Claude API**, jevha computer javal koni nastanahi app la draft karava lagel. Claude nehmi aadhi kharch sangto ani tumchya ho chi vaat baghto.

STEP 1

Tumhi he kara

**Jya office computer varun build karnar, tyavar tin goshti install kara**

1.  **Claude desktop app**, **claude.com/download** varun. Tumchya Claude Pro kinva Max account ne sign in kara. Claude Code mhanje tyatla **Code** tab.
2.  **Node.js LTS**, **nodejs.org** varun. Sagle default jase aahet tase accept kara.
3.  **Git**, **git-scm.com** varun. Sagle default accept kara. Windows var yasobat ti window pan install hote jitun nantar tumhi GitHub madhe sign in karal.

Ithe kahi chukla tari pudhe chala: starter prompt hya tinhi goshti tapasto ani nemka kuthe click karayche te sangto.

STEP 2

Tumhi he kara

**GitHub, Supabase ani Vercel, yaach kramane, business email var**

**A · GitHub (repository tumchyakade aahe; ti tapasa).**

1.  **github.com** var sign in kara. Tumchi repository ughada (cover var lihilela address).
2.  Ti **Private** asli pahije. Public asel tar: **Settings → General → Danger Zone → Change visibility → Make private**.
3.  Two-factor authentication chalu kara: tumcha photo (var ujvikade) → **Settings → Password and authentication → Enable two-factor authentication**.
4.  Hya browser madhe GitHub var sign in rahu dya: pudhchi don accounts tyachach vapar kartat.

**B · Supabase (database).**

1.  **supabase.com** var ja ani **Start your project** daba, mag **Continue with GitHub**, ani **Authorize** daba.
2.  Organisation vicharla tar tyache nav `RatnKamal Enterprises` theva, type **Company**, plan **Free**.
3.  **New project** daba. Tyache nav `ratnkamal-os` theva. **Generate a password** daba ani to surakshit jagi save kara (WhatsApp madhe naahi). Region: **South Asia (Mumbai)**. **Create new project** daba ani ready zala asa disepparyant sadharan don minute thamba.
4.  Atta itkech. Tyatun konte tin values copy karayche ani pratyek kuthe aahe, he starter prompt sangto.

**C · Vercel (app online thevto).**

1.  **vercel.com** var ja ani **Sign Up** daba. Tumhi kasa vaparnar he vicharla tar **commercial** kinva team use cha option nivada (**Pro** plan; free Hobby plan fakt personal projects sathi aahe).
2.  **Continue with GitHub** nivada ani **Authorize Vercel** daba.
3.  Atta kahihi import karu naka. Te Step 5 madhe karal, jevha repository madhe app aslela asel.

He tin tabs ughade theva

GitHub, Supabase (tumcha `ratnkamal-os` project) ani Vercel. Starter prompt chalu astana Claude tumhala pratyekat click karayla sangel.

STEP 3

Tumhi he kara

**Folder banva, ani tyachya aat docs folder**

1.  Kayamcha ek folder banva: `Documents\ratnkamal-os`. Pratyek RatnKamal system ithech jaate, kadhihi dusrya folder madhe naahi.
2.  Tyachya aat `docs` navacha folder banva, ani tyat he tin PDF theva:
    - **AI Systems Blueprint**
    - ha **Starter Guide** (tyat look aahe, section 03)
    - **Continue Building Guide**
3.  `docs` chya aat `samples` navacha folder banva ani aaj tumchyakade je aahe te tyat theva: gelya kahi aathavdyanche khare enquiry WhatsApp threads (export kelele chats kinva screenshots); tumche catalogue photos, size pramane; tumcha chalu **rate card**; custom software madhla ek purna bharlela **Order Form** ani ek **Job Card Sheet**; ani tumhi aadhich lihileli Team Leader checklist ani ABCD grading. Kahi tayar nasel tar starter prompt te tumchya list var takto.
4.  Password, Supabase secret key kinva software login **kadhihi** `docs` madhe **theu naka**. Te kuthe thevayche he Claude sangto.

Kasa disel

`Documents\ratnkamal-os\docs\` AI Blueprint.pdf · RatnKamal Starter Guide.pdf · RatnKamal Continue Building Guide.pdf · `samples\` · nantar `design\` (Step 6)

STEP 4

Claude Code la paste kara

**Starter prompt**

1.  Claude desktop app ughada → **Code** tab → `ratnkamal-os` folder ughada.
2.  Navin session chalu kara ani tyache nav `HQ` theva. HQ ha tumcha mukhya session aahe: tyachyakade sagla chitra asta, ani nantar tumhi ughadnarya pratyek dusrya session cha prompt toch lihito.
3.  Romana ne tumhala pathavlela **RatnKamal Starter Prompt** paste kara (tyat tumcha GitHub address aadhich bharlela aahe) ani send kara.
4.  HQ tappyatappyane kaam karto ani pratyek tappyananter thambto. To kay mhanto te vacha, tyachya prashnanchi uttare dya, ani pudhe janyasathi `OK` type kara.

HQ GitHub jodto tevha

Ek browser window ughadte ani GitHub madhe sign in karun Git la **Authorize** karayla sangte. Jya account chi repository aahe tyane sign in kara ani Authorize daba. He ekdach hota.

HQ Supabase keys magto tevha

HQ `.env.local` navachi file banavto, tyat tin rikamya lines astat, ani ti Notepad madhe kashi ughadaychi te sangto. HQ sangto tasa Supabase madhun pratyek value copy kara, `=` chinhananter paste kara, save kara, ani HQ la `done` sanga. Kontihi key chat madhe kadhihi paste karu naka.

STEP 5

Tumhi he kara

**App online thava** (HQ hya tappyavar pochel tevha)

1.  vercel.com var **Add New… → Project** daba. **Import Git Repository** khali **Install** (kinva **Adjust GitHub App Permissions**) daba, **Only select repositories** nivada, tumchi repository nivada, **Install** daba, ani parat ya.
2.  Tumchya repository samor **Import** daba. **Framework Preset** madhe **Next.js** aahe ka te tapasa.
3.  **Environment Variables** ughada ani HQ ne dilele tin nav add kara, `.env.local` madhe takleli tich tin values deun.
4.  **Deploy** daba. Sadharan don minutanni tumcha app `.vercel.app` ne sampnarya address var live hoto. To address HQ la dya.
5.  Supabase madhe **Authentication → URL Configuration** ughada, **Site URL** madhe to address taka ani **Redirect URLs** khali to add kara, HQ sangto tasa, ani save kara.
6.  To address tumchya phone var ughada ani **Add to Home Screen** nivada. Ata pasun, pratyek veli HQ push karto tevha live app apoaap update hoto.

03

STEP 6 · LOOK NIVADA

UI section · ekdach, pahilya screen aadhi

Tumhi je sangta te Claude banavto, pan tumhi je dakhavta tyapramane to design karto. Kahich dakhavla naahi tar tumchya team la internet varchya saglya apps cha sarasari look milto: gardi asleli, sadharan, ani koni na vaparleli. Tumche Sales Executive ani Receptionist hi screens calls chya madhe vaprtil; Quote Builder calculator ani WhatsApp peksha slow asel tar te parat calculator kade jatil, ani tyananterche pratyek report rikame rahil.

6.1

Tumhi he kara

**Gola kara.** **pinterest.com** var shodha `minimalist UI design web app`, `quotation app clean` ani `order tracking dashboard simple`. Tumchya office team la ekach najaret samajtil asha 10 te 15 screens download kara. Gardi asleli, dark kinva jast hushar disnari kontihi screen sodun dya.

6.2

Tumhi he kara

**Sarvat strong model la nivadu dya.** **Claude app** ughada, **Chat** nivada (Code naahi), list madhla sarvat strong model nivada, sagle screenshots attach kara ani chooser prompt paste kara.

Paste · Claude app chat · chooser prompt

Mi tumchyashi kahi powerful, minimal UI designs share kele aahet. Mi majhya company sathi interface banavat aahe: RatnKamal Enterprises, je swatachya factory madhe GI metal doors ani windows banavte ani ghar bandhnarya lokanna ani builders na vikte. Majhe Sales Executive ani Receptionist office computer ani phone var hi screens vaprun enquiries la uttar detat, quotations banavtat ani follow-up kartat; majhya office screen var pratyek order ani batch enquiry pasun payment paryant dista; mi majhya phone var prices, payment reminders ani divasacha plan approve karto. Hya saglya designs cha research ani analysis kara ani mi konta design nivadava te sanga. Design asa hava ki majhya team la khup sopya padhatine samjel: self-explanatory, javaljavaal kahich training na lagnara. Barech da interfaces itke complicated hotat ki team la te samajat naahit; ithe amhala ulat pahije, complex naahi tar friendly vatnara interface. Pudhe janyasathi sarvat changla design mala sanga.

6.3

Tumhi he kara

**Lekhi swarupat ghya.** Fakt jinklele ek kinva don designs punha upload kara ani vichara: *“Mi nivadlele designs upload kele aahet. Ya images sobat Claude Code madhe takta yeil asa ek detailed prompt markdown (.md) file mhanun mala dya.”* `docs\design` folder banva ani images ani .md file tyat save kara. Direction khup aakhud aali (“fakt ek quotation tool”) tar ti sudhara: *“Ha sampurna RatnKamal business aahe: enquiries, quotations, orders, batches, bakaya ani roj cha plan.”*

6.4

HQ la paste kara

**HQ chya hatat dya.**

Paste · HQ · pratyek session sathi look set kara

Design direction docs/design madhe aahe: nivadlelya images ani design .md file. Tya vacha ani Starter Guide cha section 03 vacha. Look kasa aahe te mala paach olit sanga. Mag CLAUDE.md madhe add kara ki pratyek session madhli pratyek screen docs/design ani section 03 madhle screen rules pale, ani ek sample screen banva, dummy data sobat Quote Builder, mhanje konti hi system banvnyaadhi mi majhya computer ani phone var look baghu shakin. Majhya OK chi vaat bagha. Majhyashi Marathi madhe (English aksharat) bola, pan app, code, files ani CLAUDE.md English madhech theva.

### Tumchya mukhya screens, pratyekicha ek prashna

| System               | Screen ani tyacha ek prashna                                                                | Mukhya button     | Kon, kashavar        |
|----------------------|---------------------------------------------------------------------------------------------|-------------------|----------------------|
| SYS-02 Quote Builder | **New quote:** “design, width, height, glass, colour: quotation kiti?”                      | Send for approval | Sales Executive      |
| Approval queue       | **Waiting for me:** “kontya price lines, bakaya lists ani day plans la majha ho pahije?”    | Approve           | Tumhi, phone         |
| SYS-03 Intake        | **New enquiries:** “koni vicharla, kontya channel var, ani konala ajun uttar milala naahi?” | Open enquiry      | Receptionist, Sales  |
| SYS-04 Bakaya        | **Today’s bakaya:** “konache kiti baki aahe, ani kadhi deu mhanun vachan dila?”             | Approve list      | Tumhi; Receptionist  |
| SYS-05 Job Card      | **Sent to production:** “Job Card Team Leader paryant pochla ka?”                           | Resend            | Office Boy, Sales    |
| SYS-06 Board         | **Enquiry to cash:** “aaj pratyek enquiry, quote, order ani batch kuthe aahe?”              | Open the red item | Office screen; tumhi |
| SYS-08 Day Manager   | **9 AM:** “aaj sarvat aadhi majha nirnay kashavar pahije?” (WhatsApp message, screen naahi) | Approve           | Tumhi, WhatsApp      |

### RatnKamal screen niyam

- **Tumhi approve karepparyant price line rikami rahte.** Tumhi tap karepparyant quotation var amber rangat “waiting for Santosh” dista; tyaadhi kontahi rupaya cha akda baher jat naahi.
- **Aadhi photo.** Customer ne nivadlela design photo pratyek quote ani order var sarvat var, motha dista.
- **Factory teams WhatsApp varach rahtat.** Production, Powder Coating, Glass ani Site Installation la WhatsApp varach vicharla jata ani reminder jato; tyanna kadhihi navin screen shikavi lagat naahi.
- **Marathi, Hindi kinva English, pratyek vyakti pramane.** Pratyek user ne nivadleli bhasha pratyek label madhe disu shakte.
- **Pratyek enquiry var channel ani B2C kinva B2B,** mhanje 200 leads ani 80 quotes apoaap mojle jatat.
- **Red, amber, green cha arth ekach:** late, waiting, done. Red sarvat var.
- **Tumchya screens var fakt exceptions:** tumchya ho sathi kay thambla aahe, kay late aahe, konta stock minimum chya khali aahe.

| Screen che paach kayde                          | Claude dakhavto ti pratyek screen tapasa                                                             |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------|
| **1 · Koni vachat naahi, sagle najar firavtat** | User la sarvat aadhi je disla pahije te screen var sarvat motha ani sarvat bold asava.               |
| **2 · Ek screen, ek kaam**                      | Ek mukhya button, scroll na karta disnara, action sathi rakhun thevlelya ekach rangat.               |
| **3 · Ekasarkhepana mhanje vishwas**            | Ekach goshta sagla kade sarkhich disli pahije: enquiry, quote, batch, red flag.                      |
| **4 · Default mhanjech nirnay**                 | Je punha punha bharla jata te aadhich bharlela asava: aajchi tarikh, B2C kinva B2B, Sales Executive. |
| **5 · Shantata mhanje chuk**                    | Pratyek tap la lagech uttar milave: badal, tick kinva sopa message.                                  |

**DON MINUTANCHA NIYAM:** navin employee konti hi screen ughadto ani ti kay aahe ani tithe kay karayche te don minutanchya aat, kontyahi training shivay samajto. Screen samjavun sangavi lagli tar chuk screen chi aahe, employee chi naahi. Khari pariksha: ti tumchya Receptionist chya hatat dya ani madat na karta paha.

STEP 7

Tumhi he kara

**He sagla purna jhala ki Continue Building Guide kade vala**

- App tumchya phone var tyachya `.vercel.app` address var ughadto ani tumchya home screen var aahe.
- GitHub repository **private** aahe ani jodleli aahe; tin keys fakt `.env.local` ani Vercel madhe aahet.
- `CLAUDE.md` madhe tumche niyam aahet (page R2).
- `docs/START-NOW.md` tayar aahe, pratyek item la owner aahe, ani Team Leader meeting chi tarikh tharli aahe.
- Foundation (One Lead to Cash Record) Supabase madhe aahe, ani tumhi phone var sign in karu shakta.
- `docs/SESSIONS.md` ani pahili build sheet lihileli aahe, ani tumhi ti vachun sudharli aahe.
- `docs/design/` madhe tumcha look aahe, ani CLAUDE.md madhe lihila aahe ki pratyek screen tyapramane chalte.

Mag Continue Building Guide cha section 02, **Every sitting**, ughada. Ekhadya box la tick nasel tar HQ la sanga *“pudhe janyaadhi he theek kara.”*

R1

VAAT BAGHNARYA GOSHTI: docs/START-NOW.md SATHI

HQ vachto

Ya goshti tumchyavar kinva tumchya team var thambun aahet. Pratyek goshta `docs/START-NOW.md` madhe ek line bante, tyacha owner, suru karaychi tarikh ani tick box sobat. Sarvat jast vel lagnari goshta aadhi.

| \#  | Kay                                                                                                                                                                                                                                                                                                                                            | Owner                          | Kashasathi lagel      |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|-----------------------|
| 1   | **WhatsApp Business API number:** RatnKamal kontya number varun message pathvel, provider, Meta business verification ani approved message templates. 1 te 3 aathavde.                                                                                                                                                                         | Santosh                        | Aathavda 5, SYS-03    |
| 2   | **Team Leader meeting**, ani tumhi tharavlya pramane checklist reporting hatane suru karne.                                                                                                                                                                                                                                                    | Santosh                        | Aathavda 1            |
| 3   | **Khare enquiry threads,** size pramane catalogue photos ani **chalu rate card**, `docs/samples` madhe.                                                                                                                                                                                                                                        | Sales Executive, Santosh sobat | Aathavda 1, SYS-01    |
| 4   | **Logins ani export access:** custom tracking software (tyachya developer kade read kinva export access maga), Vyapar, payment follow-up software, na vaparlele CRM ani task manager (pratyekache nav, ani tyala API aahe ka), ani IndiaMART, TradeIndia, Justdial ani Meta che lead feeds. Pratyek login tumhi swatah HQ sangel tithe thevta. | Santosh, Admin sobat           | Aathavda 3 te 5       |
| 5   | Custom software Job Card Sheet sathi je **section cutting formulas** vaparte te, mhanje Quote Builder pan tech ganit vaprel.                                                                                                                                                                                                                   | Santosh                        | Aathavda 3, SYS-02    |
| 6   | Custom software madhe **stock minimums** set karne, ani purchase list jya staff member la jail tyache nav.                                                                                                                                                                                                                                     | Santosh, Accounts sobat        | Aathavda 9            |
| 7   | **Akde:** 200 / 80 / 45 / 35 confirm kara; headcount (tumchyashivay 22 kinva tumchyasobat 23; Office Boy ani Accountant 22 madhe naahit); ani repeat orders cha hissa, jo akda mhanun naahi tar segment mhanun dila hota.                                                                                                                      | Santosh                        | Kontyahi target aadhi |
| 8   | Approvals ani corrections sathi **aathavdyala 10 te 12 taas**, tumchya calendar madhe pakke.                                                                                                                                                                                                                                                   | Santosh                        | Pratyek aathavda      |

R2

NIYAM: CLAUDE.md SATHI, SHABDASHA

HQ vachto

Hya folder madhe kadhihi banavlelya pratyek goshtisathi, pratyek session madhe, kayamche niyam

**House rules.** 1 · ONE HOME: this folder, this repository, this Supabase project and this Vercel project are the only ones RatnKamal OS will ever have; every system is a new section of the same app. 2 · EVERY PERSON THEIR OWN KEY: every team member has their own login and sees only what their work needs; Santosh sees everything; no shared passwords. 3 · NOTHING IMPORTANT WITHOUT SANTOSH: no price, discount, payment message, order change or final decision leaves the system without his approval; one switch turns all automatic behaviour off without code. 4 · THE DIARY NOBODY CAN EDIT: every action the system takes is written to a log that can only be added to. 5 · SECRETS STAY IN THE CUPBOARD: keys and logins live only in .env.local and Vercel’s settings, never in code, in chat, in docs or on GitHub. 6 · MONEY IS CALCULATED, NEVER GUESSED: prices, totals, material and bakaya come from Santosh’s rate card, the custom software’s formulas and Vyapar by exact tested rules; AI reads, drafts, matches and reminds, and never invents a number. If anything you propose bends a rule, say so out loud and wait for my decision.

**Santosh’s guardrails.** AI may act alone to: collect and prepare daily reports for Production, Powder Coating, Glass Installation and Site Installation; request daily work updates from employees and Team Leaders; send reminders to Team Leaders when work is incomplete or delayed; monitor pending orders, production progress and delivery schedules and prepare status reports; monitor raw material, accessories and stock and alert at the predefined minimum; record and categorise enquiries from every channel, share product information, photos and details on WhatsApp, and forward customer details to the concerned employee; prepare WhatsApp messages and call reminders for pending payments and notify the employee responsible; analyse employee and Team Leader performance and generate reports. A person signs off: pricing and negotiation; AI collects information, analyses data, suggests options and prepares documents; everything is presented to the business owner for approval; no important action is executed and no final decision taken without Santosh’s approval. Never automated: important financial transactions; final business decisions; financial commitments to customers; employee hiring or termination; human involvement and final approval always required.

**RatnKamal rules.** Nothing already paid for is replaced: the custom tracking software keeps the Order Form, Job Card Sheet and batch tabs; Vyapar keeps the accounts; the unused CRM and task manager are revived, not replaced. No draft carrying a rupee amount leaves without Santosh’s approval of the price. Bakaya reminders are drafts: the day’s list goes out only after he approves it; the system never promises, collects, commits or pays. Any change to a confirmed customer order is presented to Santosh and never executed by the system. Hiring, termination and salary decisions are never taken from the reports; they only inform him. Factory teams are reached on WhatsApp. Customer messages follow the language the customer wrote in: Marathi, Hindi or English. The figures 200 leads, 80 quotes, 45 out of 100, 35 orders and the 22 headcount are as written and not yet confirmed: never hard-code them. docs/samples never goes to GitHub. Build in the blueprint’s order; a system starts only when Santosh approves its build sheet, and each phase goes live only after his sign-off.

R3

BUILD BRIEF: CLAUDE CODE SATHI

Santosh, ha page tumhi sodu shakta

### Stack

Next.js (App Router, TypeScript, Tailwind), Supabase (Postgres, Auth, Row Level Security, Storage for design photos and PDFs) through `@supabase/ssr`, deployed on Vercel from `main`, with a preview for every branch. Mobile-first web app added to the home screen. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; later `WHATSAPP_*`, `INDIAMART_*`, `TRADEINDIA_*`, `JUSTDIAL_*`, `META_*`, `CRM_*`, `CRON_SECRET`, `ANTHROPIC_API_KEY`; `.env.example` holds names only. WhatsApp sending only through the WhatsApp Business API with approved templates. The custom tracking software, Vyapar, the payment follow-up software and the CRM are read through whatever access each allows (API, export or shared sheet), decided with Santosh per system; nothing is written back into Vyapar. Scheduled jobs (8:30 AM checklist ask, 9 AM summary) as Vercel Cron calling protected routes.

### F-00 One Lead to Cash Record: the starting shape

**profiles** (name, mobile, role owner / sales / reception / office / accounts / admin / team_leader, department, language, active); **leads** (one id, channel WhatsApp / IndiaMART / TradeIndia / Justdial / Meta / website / site visit, B2C or B2B, name, mobile, door or window, approximate size, owner, status, CRM id); **quotes** (lead, design photo, width, height, glass, colour, accessories, price line empty until approved, approved by, sent at); **orders** (quote, Order Form id in the custom software, advance, Job Card id, batch numbers); **batches** (number, stage, stage since, daily target); **bakaya** (customer, amount from Vyapar, promised date, credit policy signed); **approvals** (what, requested by, decided by Santosh, when); **settings** (automation switch off by default); **audit_log** (append only). If the CRM Santosh already pays for has an API, each lead is also created there with the same id; if not, HQ asks him before choosing. Row Level Security: Santosh sees all; each role sees what its work needs; price fields writable only through Santosh’s approval.

### Sessions

- **HQ** owns `main`, CLAUDE.md, docs/SESSIONS.md, docs/START-NOW.md and the database; applies migrations in order and merges finished work; never builds a system itself. It writes the opening prompt for every other session into `docs/session-prompts/` and shows it to Santosh in its own box.
- **Builders**, at most two at a time, one per system: each in its own git worktree on branch `sys-0N-short-name`, touching only its own folders; new tables only in a new migration, adding, never dropping; never applies migrations to the live database. Shared files change only in HQ; requests in `docs/requests/`, handovers in `docs/handovers/`.
- **Writing session** for the Enquiry and Quote Skill and message templates: only `docs/` and `content/`; the rate card is read-only there and no price is ever written into a draft.
- Every screen follows `docs/design/` and section 03 of this guide; plan first and wait for OK; simple words; a dated note in `docs/sessions/` at the end of each sitting.

Santosh Uttam Mali yanchyasathi tayar kele · RatnKamal Enterprises · blueprint BOA-2026-RAT-01 Rev A var aadharit (blueprint audit 19.11.2026).  
Stack thoravlela: Claude Code, Next.js, Supabase, Vercel, GitHub.
