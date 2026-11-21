Buildour AI · RatnKamal EnterprisesContinue Building · Rev A

# RATNKAMAL OS CONTINUE BUILDING

**Santosh Uttam Mali** yanchyasathi tayar kele. Starter Guide nantar pratyek baithakit: tumhi **HQ** ughdta, HQ tumhala sangte konte sessions chalvayche ani **pratyekacha prompt tumhala dete**, ani builders pratyeki ek system banavtat. Aadhi enquiries, ani baravya aathavdyaparyant sakali 9 vajta ekach message.

HQ  
ughda–– HQ prompts  
dete–– Builders  
banavtat–– Kharya enquiries  
ne test–– HQ  
merge karte–– Pudhchi  
system

[TABLE]

Pratyek step var don awaaj: TUMHI HE KARA · CLAUDE CODE LA PASTE KARA

01

SESSIONS KASE KAAM KARTAT

Ekda vacha

| Session                       | Te kay karte                                                                                                                                                                                                                                | Naav dya                                            |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| **HQ** (nehami ek)            | Master copy (`main`) ani database sambhalte: migrations lavnara ekmev session. Itar pratyek session cha opening prompt lihite, purna zalele kaam jodte, CLAUDE.md, START-NOW ani SESSIONS update theva. Swata kadhihi system banavat naahi. | `HQ`                                                |
| **Builder** (jastit jast don) | HQ ne lihilelya prompt varun ek system banavte, folder chya swatachya copy madhe, swatachya branch var, fakt swatachya files la haat lavun. Ek bhag purna zala ki HQ la handover dete.                                                      | HQ sangel tasa, udaharanarth `SYS-02 Quote Builder` |
| **Writing**                   | Shabda, code naahi: Enquiry and Quote Skill (qualification script, catalogue map, drafts, follow-ups) ani Marathi, Hindi ani English madhle message templates. Kadhihi kimmat naahi.                                                        | `SKILLS writing`                                    |

HQ ne sangitlela session ughadne

HQ prompt tyachya swatachya box madhe dakhavte ani `docs/session-prompts/` madhe save karte. Claude desktop app chya **Code** tab madhe, tyach `ratnkamal-os` folder var **new session** suru kara, HQ sangel te naav dya, paste kara, send kara. Pratyek session davikadchya list madhe rahte; badlayla tyavar click kara.

He gondhalache ka hot naahi

Pratyek builder code chya swatachya copy madhe (**worktree**) swatachya **branch** var kaam karto, mhanun don sessions kadhihi ekach file madhe lihit naahit. Pratyek branch la Vercel var swatacha test address milto, mhanun live app madhe yenyaadhi system check hote. Fakt HQ kaam live copy madhe jodte ani fakt HQ database badalte.

**DON BUILDERS, JAST NAAHI.** Claude Pro var ekaveli ek builder chalva; Max var don. Usage limits mule sessions thambli tar ekach chalva.

02

PRATYEK BAITHAK

Pratyek veli hach kram

1

HQ la paste kara

**Divas suru kara.** Code tab → tumcha `HQ` session, ani he paste kara:

HQ · Divas suru kara

Tumhi RatnKamal OS sathi HQ aahat. CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ ani docs/sessions/ madhli sarvat navin note vacha. Mala sopya shabdat, daha olinchya aat sanga: START-NOW madhe kay tick zalele naahi; baara aathavdyanchya plan pramane aapan kuthe aahot; konte builder sessions chalu aahet ani konatya branch var; merge sathi tayar asa konta handover; majhya approval sathi kay thambla aahe. Mag aaj konte sessions chalvayche te sanga (jastit jast don builders, garaj aslyas writing), ani pratyekacha prompt, paste karayla tayar, tyachya swatachya box madhe dya: Starter Guide chya R3 madhlya niyamanpramane navin opening prompt, kinva aadhich aslelya session sathi continue prompt. Navin prompts docs/session-prompts/ madhe save kara. Mi OK mhannar naahi toparyant dusre kahihi karu naka. Majhyashi Marathi madhe (English aksharat) bola, pan system madhli pratyek goshta English madhech theva.

2

Tumhi he kara

**HQ ne sangitlele sessions ughda** ani pratyekacha prompt paste kara. Aadhich aslelya session sathi, list madhe tyavar click kara ani HQ ne dilela continue prompt paste kara.

3

Tumhi he kara

**Sessions madhe phera mara.** Je thambla aahe tyala uttar dya. Pratyek session pratyek baithakit ek chhoti purna goshta banavte ani tyacha test address dete. Tumhala mahit aslelya kharya data ne check kara: ek enquiry, ek design, ek quotation, ek batch. Pratyek navin screen Starter Guide chya section 03 shi julvun bagha.

4

Pratyek builder la, mag HQ la paste kara

**Divas band kara.** Pratyek builder madhe: `Tumchi branch commit ani push kara, tumchi handover file ani aajchi note update kara.` Mag HQ la he paste kara:

HQ · Divas band kara

Aajche handovers vacha. Tayar mhanun mark kelelya pratyek bhagasathi: to CLAUDE.md ani tyachya build sheet shi julvun check kara, tyache migrations kramane live database var lava, pratyek role mhanun test kara, merge kara, ani live app var kay badalle te mala sanga. docs/SESSIONS.md ani START-NOW update kara, ani aajchi note docs/sessions/ madhe liha.

03

HQ CHE PROMPTS

He javal theva · baki HQ lihite

HQ · Pudhcha phase suru kara

Phase **\[P-number\]** aata suru hot aahe. Maglya phase cha done-when live app var check kara ani kay purna zale naahi te mala pramanikpane sanga. Mag ya phase sathi: blueprint varun pratyek system chi build sheet liha kinva update kara ani pratyekala majhi approval milat naahi toparyant thamba; tumhala majhyakadun je lagel (logins, lists, niyam, kharch) te START-NOW madhe joda; konti systems Builder A ani Builder B mhanun chaltil te tharva; ani pratyek session cha opening prompt, paste karayla tayar, tyachya swatachya box madhe dya. Majhya sign-off nantarach ha phase live hoil.

HQ · Session adakla kinva chukla

**\[session che naav\]** session adakla aahe kinva chukicha chalat aahe. Tyachi branch, handover ani sarvat navin note vacha. Kay bighadle aahe te mala sopya shabdat sanga ani don paryay dya: pudhe jaun durust karne, kinva tyachya shevatchya changlya commit var parat jane. Mag mi je nivadto te karnyasathi tya session madhe paste karayla ek prompt dya.

HQ · Navin connection kinva kharchaadhi

Kahihi navin connect karnyaadhi (WhatsApp Business API, IndiaMART, TradeIndia, Justdial, Meta, CRM, custom software, Vyapar, Claude API), mala sopya shabdat sanga: te kay aahe, ya system la tyachi garaj ka aahe, tyacha mahinyacha kharch kiti, ani mi nahi mhanalo tar kay hoil. Mag majhya ho chi vaat bagha. Konti hi key kinva login fakt .env.local ani Vercel madhech jaail, ani mi swata te nemke kuthe paste karayche te tumhi mala sanga.

04

BANAVA, TEST KARA, CHALU KARA

Pratyek system sathi hech steps

1.  **Pratyek baithakit ek purna goshta,** branch chya test address var kharya data ne test keleli. Ashcharyakarak goshti `docs/rules-i-learned.md` madhe liha.
2.  **Screen check kara** Starter Guide chya section 03 shi julvun. Jar te homework sarkha disat asel: *“Fakt design badla, docs/design pramane. Features la haat lavu naka.”*
3.  **Ek bhag purna zala ki merge.** Builder aapla handover lihito; HQ merge karte; live app sadharan don minitat update hote.
4.  **Aadhi paach khare cases.** Skill paach kharya enquiry threads var check hote; Quote Builder tumhi aadhich pathavlelya paach quotations var, kimmat la kimmat.
5.  **Junya padhatisobat chalva.** Intake Flow ekta uttar denyaadhi don aathavde manual process sobat chalto, tumchya blueprint madhe sangitlya pramane.
6.  **Vishwas basnyaadhi fakt report.** Day Manager survatila fakt baghte, drafts lihite ani summary dete; tumcha tyachya summaries var anek aathavde vishwas baslya nantarach te tracking ani allocation ghete.

**JAR EKHADA SESSION CHUKLA:** mhana *“Thamba. Kay bighadle aahe te sopya shabdat sanga ani mala don paryay dya: pudhe jaun durust karne, kinva tumchya shevatchya commit var parat jane.”* Ek bighadlela session kadhihi live app kinva itar sessions bighadvat naahi.

05

BUILD CHA KRAM, SESSION NUSAR

Blueprint madhun · baara aathavde

| Phase                  | HQ                                                                                               | Builder A                                                                          | Builder B                                                                            | Writing / tumhi                                                            |
|------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **P1** · aathavda 1–2  | F-00 Starter Guide madhe suru zale; merges                                                       | Mokla: aadhi skill                                                                 | Mokla                                                                                | **SYS-01** Enquiry and Quote Skill; Team Leader meeting; checklist haatane |
| **P2** · aathavda 3–4  | **F-00**: paise bharlela CRM lead record mhanun parat chalu (kinva tyala API nasel tar Supabase) | **SYS-02** Quote Builder, rate card ani cutting formulas var                       | Mokla                                                                                | Rate card ol na ol check; CRM access                                       |
| **P3** · aathavda 5–8  | WhatsApp Business API ani lead feeds, tumchya ho nantar                                          | **SYS-03** Enquiry Intake Flow saha channels var, don aathavde manual padhatisobat | **SYS-04** Bakaya Reminder Drafts, Vyapar madhun                                     | Roj bakaya list approve kara                                               |
| **P4** · aathavda 9–12 | Claude API, tumchya ho nantar                                                                    | **SYS-06** Enquiry to Cash Board, mag **SYS-05** Job Card Dispatch                 | **SYS-07** Team Leader Checklist Collection, mag **SYS-08** Day Manager, fakt report | Stock minimums; purchase list konala jaail                                 |

| Phase | Kevha purna (blueprint madhun)                                                                                                                                                                                                                                                                                                                 |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1    | Navin WhatsApp enquiry la tyacha qualification reply ani tyachya size che catalogue pages skill draft karte ani Sales Executive kinva Receptionist pathavtat, ani Team Leader meeting zali aahe ani checklist reporting haatane chalu aahe.                                                                                                    |
| P2    | Eka aathavdyat pathavleli pratyek quotation Quote Builder madhun PDF mhanun aali, price line var tumchya approval sobat, ani tya mahinyacha pratyek lead CRM madhe channel, B2C kinva B2B tag ani owner sobat row mhanun aahe.                                                                                                                 |
| P3    | WhatsApp, IndiaMART, TradeIndia, Justdial, Meta ani website varchya enquiries konihi type na karta CRM madhe yetat, flow don aathavde manual process sobat chalala aahe, ani pratyek divasache bakaya reminders tumhi list approve kelyanantarach gele.                                                                                        |
| P4    | Sakali 9 vajta tumhi ek message ughdta: aadhi approvals, mag delays ani mag stock; Board var pratyek batch tyachya stage var disto, ani sakalcha planning cha taas aata mahiti gola karnyat jaat naahi: AI ani Team Leaders rojche kaam sambhaltat, mhanun tumhi RatnKamal Enterprises chya pudhchya vadhivar ani vikasavar laksha deu shakta. |

**GATES (ADHI HE, MAG TE):** F-00 merge honyaadhi konta hi builder suru hot naahi. Checklist collection Team Leader meeting ani ek manual run chi vaat baghte. Intake Flow manual padhatisobat don aathavde chalalya nantarach ekta uttar dete. Vyapar madhe kahihi lihile jaat naahi. Tumchya approval shivay konta hi bakaya message, kimmat kinva order badal baher jaat naahi.

**Baara aathavdyanantar, tech app, tech routine:** mahine 4 te 6, Day Manager batch tracking, Team Leader reminders ani staff allocation cha draft ghete, stock alerts ani purchase list live sobat → mahine 6 te 9, ABCD observations ani performance checklists eka monthly report madhe, back office job descriptions, ani task manager tyanchi rojchi list mhanun → mahine 9 te 12, marketing kharch tharavnyasathi channel nusar quote-to-order conversion, ani B2B builders sathi repeat order view. Pratyek *“HQ, pudhcha phase suru kara”* ne suru hote.

06

JEVHA PAISE LAGTAT

Banavnyaadhi tharva

| Garaj                            | Pahilyanda kevha                | Tumchyasathi yacha artha                                                                                                                                                          |
|----------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Claude Max**                   | Don builders chaltat tevha      | Pro ekaveli ek session sathi chalto; Max madhe HQ ani don builders sathi jaga milte.                                                                                              |
| **Supabase Pro**                 | Staff roj vaparayla laganyaadhi | Sadharan \$25 mahina: pratyek lead, quote ani order cha roj backup.                                                                                                               |
| **Vercel Pro**                   | Live jatana                     | Sadharan \$20 mahina; free plan personal vaparasathi aahe.                                                                                                                        |
| **WhatsApp Business API**        | P3                              | Business sending sathi ek number, Meta verification, approved templates, ani pratyek message sathi charge.                                                                        |
| **Lead feeds**                   | P3                              | IndiaMART, TradeIndia ani Justdial tumhi aadhich paise bharat aslelya plans var lead access detat; Meta lead forms free connect hotat. Connect karnyaadhi HQ pratyek check karte. |
| **Custom software, Vyapar, CRM** | P2 te P4                        | Read access kinva exports; custom software cha developer export kinva API sathi paise gheu shakto.                                                                                |
| **Claude API key**               | P3 te P4                        | Computer var koni naslyavar app draft karte tevha lagte (ratriche pahile replies, 9 AM summary). Vaparapramane bill, tumhi tharavlelya monthly limit sobat.                       |

07

HQ LA NEHAMICHE PROMPTS

Pratyeki ek ol

- **Rate card badal:** *“Aaj pasun \[item\] cha rate badalla aahe. Kahihi badalnyaadhi yacha konatya quotations ani screens var parinam hoto te mala dakhva.”*
- **Navin staff:** *“\[naav\] \[department\] madhe \[role\] mhanun join hot aahe. Tyanna kay disel te mala dakhva, mag login tayar kara ani majhya OK chi vaat bagha.”*
- **Koni sodun gele:** *“\[naav\] aaj sodun gele. Tyanche login aatach band kara.”*
- **Niyam badalto:** *“Aaj pasun \[niyam\]. CLAUDE.md update kara ani konatya systems var parinam hoto te mala sanga.”*
- **Mahinyacha check:** *“Project CLAUDE.md ani majhya guardrails shi julvun audit kara, ani je kahi tyanna todte te sopya shabdat report kara.”*

**MAHINYACHI TEST:** teen prashna vichara. Board varchi pratyek enquiry, quote ani batch khari aahe ka? Tumchya shivay konti kimmat, bakaya message kinva order badal baher gela ka? Ya mahinyat tumcha sakalcha taas kami zala ka? Teen ho: pudhchi system suru kara. Ekhada nahi: aadhi te durust kara.

Santosh Uttam Mali · RatnKamal Enterprises yanchyasathi tayar kele. BuildOur Builder Guides madhun, blueprint BOA-2026-RAT-01 Rev A nusar sankshipt kele.  
Enquiry pasun cash paryant ek record. Pratyek kimmat, payment ani order badal ajunhi Santosh yanchya sahine.
