Buildour AI · Archi DesignContinue Building · Rev B · Hinglish

# ARCHI DESIGN OS CONTINUE BUILDING

Mahesh R. Khandagale ji ke liye. Starter Guide ke baad ki har sitting: **ek saath kai Claude Code sessions**, har system ka apna session, aur sabko jodne wala ek **MAIN session**, Blueprint Rev B ke order mein: 1 foundation aur 9 systems, 12 mahine.

MAIN  
session–– Builder  
sessions–– Phone par  
test–– Paanch asli  
cases–– Merge,  
live–– Agla  
system

[TABLE]

Har step par do awaaz: AAP KARO · CLAUDE CODE MEIN PASTE KARO

01

SESSIONS KAISE KAAM KARTE HAIN

Ek baar padho

| Session                | Kya karta hai                                                                                                                                              | App mein naam                         |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| **MAIN** (hamesha ek)  | Master copy (`main`) rakhta hai, database ka maalik hai, poora hua kaam jodta hai, CLAUDE.md aur START-NOW update rakhta hai. Khud koi system nahi banata. | `MAIN`                                |
| **Builder** (teen tak) | Ek system banata hai, apni branch par, folder ki apni copy mein. Sirf apni files chhoota hai. Phase poora hone par MAIN ko handover deta hai.              | `SYS-02 My Day`, `SYS-03 Attendance`… |
| **Writing lane**       | Code nahi, shabd likhta hai: SOPs, stage workflows, definitions of done, project templates, quality gates, role cards, Studio Plan. Pehle din se.          | `SYS-01 SOPs`                         |

Session ke buttons

Claude app ke **Code** tab mein, jab ek session kaam kar raha ho tab bhi usi `archi-design-os` folder par **naya session** shuru kar sakte ho; har session left side ki list mein dikhta hai, click karke switch karo. Har session ka naam uske kaam par rakho taaki kabhi confuse na ho.

Gadbad kyun nahi hoti

Har builder session code ki apni copy (**worktree**) mein apni **branch** par kaam karta hai, isliye do sessions kabhi ek hi file mein type nahi karte. Har branch ka Vercel par apna test address hota hai, to aap system ko live app tak pahunchne se pehle phone par check kar lete ho. Live copy mein kaam sirf MAIN jodta hai. Iske rules aapke CLAUDE.md mein pehle se hain.

**EK SAATH TEEN, ISSE ZYADA NAHI.** Teen builder sessions utne hi hain jitne aap ek sitting mein follow, test aur answer kar sako. Agar sessions limit ki wajah se rukne lagein, to do chalao.

02

HAR SITTING

Roz ka same routine

1

MAIN mein paste karo

**Din shuru karo.** Claude app → Code → aapka `MAIN` session, aur ye paste karo:

Paste · MAIN · har sitting ki shuruaat

Tum Archi Design OS ke MAIN session ho. CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ aur docs/sessions/ ka latest note padho. Mujhe simple Hinglish mein, das lines ya kam mein batao: START-NOW mein kya abhi tick nahi hua; kaunse systems chal rahe hain aur kis branch par; koi handover merge ke wait mein hai kya; koi request tumhare wait mein hai kya; aur aaj mujhe kaunse builder sessions chalane chahiye (zyada se zyada teen). Jab tak main OK na bolun, aur kuch mat karna.

2

Aap karo

**Jo sessions MAIN ne bataye, wo kholo.** Agar us system ka session pehle se hai, to click karke §03 ka **continue** box paste karo; nahi hai to naya session shuru karo, naam rakho, aur **naya system** box paste karo.

3

Aap karo

**Sessions ka round lagao.** Jo wait kar raha ho uska jawab do. Har session ek sitting mein ek chhoti poori cheez banata hai aur apna test address deta hai. Use phone par kholo aur ek asli project, task ya drawing se check karo.

4

Har session mein, phir MAIN mein

**Din band karo.** Har builder mein: `Apni branch commit aur push karo, handover file aur aaj ka note update karo.` Phir MAIN mein: `Aaj ke handovers padho. Jo ready hai use merge karo, uske migrations order mein lagao, aur batao live app par kya badla.`

03

SESSION PROMPTS

Builder session mein paste karo

Paste · Naya builder session (brackets §05 se bharo)

Tum Archi Design OS mein **\[SYS-0N aur system ka naam\]** ke builder session ho. Mujhse simple Hinglish mein baat karo; code, files aur screens English mein. CLAUDE.md, docs/SESSIONS.md, docs/ mein blueprint aur UI Guide, docs/design/, aur docs/build-sheets/\[sys-0N\].md padho (agar build sheet nahi hai to pehle blueprint se likho aur meri approval ka wait karo). Sirf apne git worktree mein, branch **\[sys-0N-short-name\]** par kaam karo, main par kabhi nahi, aur sirf is system ke folders mein. Naye tables ya columns sirf is system ki nayi migration file mein, sirf jodna, kabhi drop ya rename nahi. Agar koi shared file badalni ho, to docs/requests/ mein likho aur mujhe batao. Code se pehle: UI Guide ke section 03 ke hisaab se is system ki har screen ki list do (ek sawaal, ek main button, kaun, kis device par), simple text sketches mein; chhote phases mein plan do, har phase ke end mein kuch aisa jo main tumhari branch ke test address par phone par test kar sakun, aur pehla phase hamesha “mera asli data load karo aur mujhe ek sachchi list dikhao”; aur jo bhi cheez paisa maange uski list do. Mere OK ka wait karo.

Paste · Purana builder session · continue

CLAUDE.md, apni build sheet aur apni handover file padho. Paanch lines mein batao ye system kahan tak pahuncha hai aur aaj ki ek poori hone wali cheez kya hai. Plan banao aur mere OK ka wait karo.

Paste · Writing lane · SYS-01 Studio Ways (pehle din se)

Tum SYS-01 Archi Design Studio Ways ke writing session ho. Tum sirf docs/ aur content/ mein likhoge, code kabhi nahi. Blueprint Rev B aur docs/ mein Lean Master Plan (sections 3, 4, 5A, 5B, 7 aur 10) padho. Phir mujhse ek-ek sawaal pucho (Hinglish mein) aur mere shabdon mein ye files English mein likho: content/workflows.md (har stage ka workflow, har task type, owner, aage kisko jaata hai, definition of done aur zaroori proof); content/templates.md (paanch project templates: interior, renovation, civil, commercial, factory, aur teen size tiers, meri value thresholds ke saath); content/quality-gates.md (har gate ki photo checklist); content/role-cards.md (har role ke chaar metrics aur weights, mere sign ke liye draft); content/studio-plan.md (core values, 3 se 5 saal ka target, brand promise, saal ki priorities, is quarter ke Rocks aur Critical Number). Har price, discount aur committed date mere liye chhod do. Jab main koi file approve karun, MAIN ko bolo ki use load kare.

04

BUILD, TEST, SWITCH ON

Har system ke liye same steps

1.  **Har sitting mein ek poori cheez.** Har builder kuch aisa deta hai jo aap uske test address par phone par kholte ho. Ek asli project ya task check karo. Jo bhi hairaani ho wo `docs/rules-i-learned.md` mein likho.
2.  **Screen ko UI Guide se check karo** (uska section 05). Homework jaisi lage to bolo: *“Sirf design badlo, docs/design ke hisaab se. Features ko haath mat lagao.”*
3.  **Phase poora ho to merge.** Builder handover likhta hai; MAIN merge karta hai aur live app lagbhag do minute mein update ho jaata hai.
4.  **Paanch asli cases, phir ek insaan pehle.** Paanch asli tasks, punches, site reports ya drawings us system se chalao. Phir pehle pilot group (5 se 6 log, 2 se 3 live projects) ko lagbhag 6 hafte do, phir sabko.
5.  **Pehla live Monday.** My Day ke liye: us Monday se koi task muh se ya WhatsApp par nahi diya jaayega. Purana tareeka sirf ek hafte saath chalao, phir band.

**AGAR KOI SESSION GALAT JAAYE:** bolo *“Ruko. Jo toota hai wo simple shabdon mein batao aur do options do: aage theek karein, ya tumhare last commit par wapas jaayein.”* Ek toota hua session kabhi live app ya doosre sessions ko nahi todta.

05

BUILD ORDER, SESSION BY SESSION

Blueprint Rev B se · ek saath teen tak

| Kab         | MAIN                                                                             | Builder A                                                  | Builder B                                              | Builder C / writing                                                                            |
|-------------|----------------------------------------------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Hafte 1–2   | F-00 Studio Record aur organisation, approval limits (day 1); live projects load | eSSL check, phir **SYS-03** Attendance `sys-03-attendance` | *SOPs ka wait*                                         | **SYS-01** Studio Ways `writing`                                                               |
| Hafte 3–6   | SOPs aur templates load; merges; pehla live Monday                               | **SYS-03** Attendance (jaari)                              | **SYS-02** My Day aur Escalation `sys-02-my-day`       | SYS-01 sudhaar; Studio Plan                                                                    |
| Hafte 7–12  | Merges                                                                           | **SYS-04** Leads aur Proposals `sys-04-leads`              | **SYS-05** Drawing aur Site Chain `sys-05-design-site` | **SYS-06** Owner Exception View aur Studio Plan `sys-06-owner-view` (hafte 9–12)               |
| Mahine 4–6  | Merges; scorecard weights sign                                                   | **SYS-07** Scorecards, shadow mode `sys-07-scorecards`     | **SYS-08** Client Page aur Pulse `sys-08-client-page`  | **SYS-09** Turnkey Controls, Tier 2 pehle `sys-09-turnkey`                                     |
| Mahine 7–12 | Hindi aur Marathi labels; handover pack                                          | SYS-07 incentives live                                     | SYS-09 billing, cash view, Tier 3                      | HR: onboarding, policies, claims, exit; mahine 11–12 optional AI helpers (aapke haan ke saath) |

| Phase                       | Kab poora maana jaayega (Blueprint Rev B se)                                                                                                                                                                                                                                                                                 |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 · F-00, SYS-01 se SYS-03 | Saaton log har subah apni numbered My Day kholte hain deadline aur definition of done ke saath, har band task ke saath proof hai, pehle live Monday ke baad koi task muh se ya WhatsApp par nahi diya gaya, aur har din ki attendance, office ho ya site, ek record mein hai aur late-mark counter har insaan ko dikhta hai. |
| P2 · SYS-04 se SYS-06       | Har enquiry ka owner aur next action hai, har live site ki har working day ki stamped photos ke saath dated report hai, site par har drawing par Released for Site hai aur purana version withdraw ho chuka hai, aur aap subah 9 baje kisi ko call karne ki jagah ek Exception View kholte ho.                               |
| P3 · SYS-07 se SYS-09       | Do mahine ke shadow scorecards team ke saath dekh kar fair maane gaye, 8 se kam har client rating par 24 ghante mein call hua, aur har Tier 2 aur Tier 3 project par budget, committed aur actual cost aur weekly Project Pulse hai.                                                                                         |
| P4 · mahine 7–12            | Aap follow-ups par din mein 30 minute se kam dete ho aur hafte mein ek 30 minute ka review, incentives sirf sign kiye scorecards se milte hain, month-end ke ek din mein payroll attendance summary ready hota hai, aur har insaan is quarter ke Rocks bata sakta hai.                                                       |

**GATES:** koi builder F-00 aur approval limits merge hone se pehle shuru nahi hota. SYS-02 approved SOPs aur templates ka wait karta hai. SYS-03 eSSL check ka wait karta hai (fallback: roz ki file import). SYS-06 ke boards kuch hafte ke My Day aur site records ke baad hi kaam ke hain. SYS-07 ke paise do mahine shadow mode ke baad aur aapke sign ke baad hi. SYS-09 pehle Tier 2; agar koi bada civil, commercial ya factory project abhi chal raha hai, to uske liye budget, work orders aur site store aage laao. AI helpers mahine 11–12 se pehle nahi.

06

JAB KISI CHEEZ MEIN PAISA LAGE

Build se pehle decide karo

| Kya chahiye                          | Pehli baar kab                 | Aapke liye matlab                                                                                                                               |
|--------------------------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Pro**                     | SYS-03, SYS-05                 | Lagbhag \$25 mahina, jab punches, site photos aur drawings free storage bhar dein; daily backups bhi.                                           |
| **eSSL connector**                   | SYS-03                         | Agar machine khud logs nahi bhej sakti, to office computer par ek chhota connector ya roz ki file import. Claude options aur kharcha dikhayega. |
| **WhatsApp Business API** (optional) | Digital Huddle, client updates | Sirf tab, jab aap messages app aur email ki jagah WhatsApp par chahte ho. Meta verification aur paid messages lagte hain.                       |
| **Claude API key** (optional)        | Mahine 11–12, AI helpers       | Status answers aur proposal drafts ke liye, Claude Max se alag, use ke hisaab se bill aur monthly spend limit ke saath. Key sirf Vercel mein.   |

Paste · Koi bhi nayi cheez connect karne se pehle

Kuch bhi naya connect karne se pehle mujhe simple shabdon mein batao: ye kya hai, is system ko iski zaroorat kyun hai, humare liye iska mahine ka kharcha kitna hai, aur agar main mana karun to kya hoga. Phir mere haan ka wait karo. Koi bhi key sirf .env.local aur Vercel mein jaayegi, aur mujhe exactly batao Vercel mein kahan daalni hai aur redeploy kaise karna hai.

07

HAMESHA KAAM AANE WALE PROMPTS

Paas rakho

- **Naya insaan:** MAIN ko: *“\[Naam\] \[role\] ke roop mein join kar raha hai. Uska login aur SOPs se joining checklist meri approval ke liye draft karo.”*
- **Koi rule badla:** MAIN ko: *“Aaj se \[rule\]. Ise CLAUDE.md mein permanent karo aur batao ye kaunse systems ko chhoota hai.”*
- **Nayi value band:** MAIN ko: *“Aaj se \[decision\] ki limit \[amount\] hai, approver \[role\]. Approval limits update karo aur batao kya badla.”*
- **Mere guardrails likh liye:** MAIN ko: *“Ye rahe mere teen guardrails, mere shabdon mein: \[…\]. CLAUDE.md mein careful defaults ki jagah inhe lagao aur batao kya badla.”*
- **Monthly check:** MAIN ko: *“Project ko CLAUDE.md ke against audit karo aur jo bhi rule toot raha ho wo simple shabdon mein batao.”*

**MONTHLY TEST:** phone par OS kholo aur teen sawaal pucho. Kya har task, attendance, site report aur drawing sach hai? Kya koi cheez client, contractor ya vendor tak aapke haan ke bina pahunchi? Kya diary hafte ko aapki yaaddasht se behtar samjhati hai? Teen haan: agla system shuru karo. Ek bhi na: pehle use theek karo.

Mahesh R. Khandagale ji ke liye · Archi Design. BuildOur Builder Guides 02–04 se, blueprint BOA-2026-ARC-01 Rev B aur Lean Master Plan v1.4 ke against.  
Ek record, ek app, kai sessions. Har price, date aur logon ka faisla owner ke paas.
