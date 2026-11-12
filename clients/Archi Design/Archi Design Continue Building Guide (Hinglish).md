Buildour AI · Archi DesignContinue Building · Rev A · Hinglish

# ARCHI DESIGN OS CONTINUE BUILDING

Mahesh R. Khandagale ji ke liye. Starter Guide ke baad ki har sitting: **ek saath kai Claude Code sessions**, har system ka apna session, aur sabko jodne wala ek **MAIN session**, blueprint ke order mein.

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

| Session                | Kya karta hai                                                                                                                                              | App mein naam                             |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| **MAIN** (hamesha ek)  | Master copy (`main`) rakhta hai, database ka maalik hai, poora hua kaam jodta hai, CLAUDE.md aur START-NOW update rakhta hai. Khud koi system nahi banata. | `MAIN`                                    |
| **Builder** (teen tak) | Ek system banata hai, apni branch par, folder ki apni copy mein. Sirf apni files chhoota hai. Phase poora hone par MAIN ko handover deta hai.              | `SYS-02 Task Sheet`, `SYS-03 Site Diary`… |
| **Writing lane**       | Code nahi, shabd likhta hai: aapke SOPs, workflows, definitions of done, checklists. Pehle din se chal sakta hai.                                          | `SYS-01 SOPs`                             |

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

Paste · Writing lane · SYS-01 SOP Skills (pehle din se)

Tum SYS-01 Archi Design SOP Skills ke writing session ho. Tum sirf docs/ aur content/ mein likhoge, code kabhi nahi. Mujhse ek-ek sawaal pucho (Hinglish mein) aur mere shabdon mein ye files English mein likho: content/workflows.md, har stage (concept, working drawings, site marking, execution, handover) ka workflow, har task type, uska owner, wo aage kisko jaata hai, uski definition of done aur zaroori proof (file link, site photo ya note); content/checklists.md, designer, site engineer aur office desk ki role-wise checklists; content/measurement.md, kaam naapne ka standard format (timeliness, quality, SOP adherence, rework, client response), mere sign ke liye draft. Har price, discount aur committed date mere liye chhod do. Jab main koi file approve karun, MAIN ko bolo ki use task_types aur sop_items tables mein load kare.

04

BUILD, TEST, SWITCH ON

Har system ke liye same steps

1.  **Har sitting mein ek poori cheez.** Har builder kuch aisa deta hai jo aap uske test address par phone par kholte ho. Ek asli project ya task check karo. Jo bhi hairaani ho wo `docs/rules-i-learned.md` mein likho.
2.  **Screen ko UI Guide se check karo** (uska section 05). Homework jaisi lage to bolo: *“Sirf design badlo, docs/design ke hisaab se. Features ko haath mat lagao.”*
3.  **Phase poora ho to merge.** Builder handover likhta hai; MAIN merge karta hai aur live app lagbhag do minute mein update ho jaata hai.
4.  **Paanch asli cases, phir ek insaan pehle.** Paanch asli tasks, site reports ya drawings us system se chalao. Phir sabse pehle us ek team member ko do jise purani taklif sabse zyada hai.
5.  **Pehla live Monday.** Daily Task Sheet ke liye: us Monday se koi task muh se ya WhatsApp par nahi diya jaayega. Purana tareeka sirf ek hafte saath chalao, phir band.

**AGAR KOI SESSION GALAT JAAYE:** bolo *“Ruko. Jo toota hai wo simple shabdon mein batao aur do options do: aage theek karein, ya tumhare last commit par wapas jaayein.”* Ek toota hua session kabhi live app ya doosre sessions ko nahi todta.

05

BUILD ORDER, SESSION BY SESSION

Blueprint se · ek saath teen tak

| Hafte | MAIN                                                     | Builder A                                           | Builder B                                                | Builder C / writing                         |
|-------|----------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------------|---------------------------------------------|
| 1–2   | F-00 Project and Task Record (day 1); live projects load | *SOPs ka wait*                                      |                                                          | **SYS-01** SOP Skills `writing`             |
| 3–6   | Approved SOPs load; merges                               | **SYS-02** Daily Task Sheet `sys-02-task-sheet`     | Khaali                                                   | SYS-01 sudhaar                              |
| 5–8   | Merges; pehla live Monday                                | **SYS-03** Site Diary `sys-03-site-diary`           | **SYS-04** Drawing Release Flow `sys-04-drawing-release` | SYS-02 watch week, pehle ek insaan phir sab |
| 8–10  | Merges                                                   | **SYS-05** Ownership Board `sys-05-ownership-board` | **SYS-06** Nudge and Escalate `sys-06-nudge`             | SYS-03, SYS-04 paanch cases                 |
| 10–12 | Claude API set up (aapke haan ke saath)                  | **SYS-07** Nandini `sys-07-nandini`                 | **SYS-08** Scorecard App `sys-08-scorecard`              | Pehle monthly scorecards                    |

| Phase                     | Kab poora maana jaayega (blueprint se)                                                                                                                                                                                                                                      |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 · F-00, SYS-01, SYS-02 | Aapke 7 log har subah apne phone par apni task list kholte hain, deadline aur definition of done ke saath, har band task ke saath proof hai, aur pehle live Monday ke baad koi task muh se ya WhatsApp par nahi diya gaya.                                                  |
| P2 · SYS-03, SYS-04       | Har live site ki pichle hafte ke har working day ki dated site report hai stamped photos ke saath, har site par har drawing par Approved for Execution stamp hai aur purana version withdraw ho chuka hai, aur har open drawing query par ek designer ka naam aur date hai. |
| P3 · SYS-05 se SYS-08     | Ek poora working hafta guzar jaata hai jisme aapne koi follow-up call nahi kiya, Nandini ki 6 PM summary har shaam aayi, aur pehle monthly scorecards standard format mein aapki table par hain, kisi employee ke dekhne se pehle.                                          |

**GATES:** SYS-02 approved SOPs ka wait karta hai. SYS-05 hafte 8 se pehle switch on nahi hota: wo sirf wahi dikhata hai jo Task Sheet ne ikattha kiya. SYS-08 ke pehle cards utne hi fair hain jitni hafte 1 se 2 ki SOP lines. SYS-04 tabhi kaam karta hai jab drawings WhatsApp images ke roop mein site jaana band ho. SYS-07 Claude API ke kharche par aapke haan ka wait karta hai. Client, contractor ya vendor ko dates, extra work ya cost ka har message aapka wait karta hai.

**Mahine 4 se 12, usi ghar mein:** Project Health Wall aur Command Centre, har band stage par Client Pulse (mahine 4 se 6) → Site Controller aur Digital Ops Manager (mahine 6 se 8) → attendance aur personal dashboards (mahine 8 se 10) → locked tab mein project costing aur Instagram, Just Dial aur referral ke liye ek simple CRM (mahine 10 se 12). Har ek §03 se shuru hota hai.

06

JAB KISI CHEEZ MEIN PAISA LAGE

Build se pehle decide karo

| Kya chahiye                          | Pehli baar kab          | Aapke liye matlab                                                                                                                                                                                                                                        |
|--------------------------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Pro**                     | SYS-03, SYS-04          | Lagbhag \$25 mahina, jab site photos aur drawings free storage bhar dein; daily backups bhi milte hain.                                                                                                                                                  |
| **Claude API key**                   | SYS-07 Nandini          | Nandini subah 9 aur shaam 6 baje chalti hai jab computer par koi nahi hota, jo Claude Max mein cover nahi hai. 7 logon ke liye lagbhag \$10 se \$30 mahina. platform.claude.com par monthly spend limit ke saath set up; key sirf Vercel mein jaati hai. |
| **WhatsApp Business API** (optional) | Baad mein: Client Pulse | Sirf tab, jab aap reminders aur summaries app ki jagah WhatsApp par chahte ho. Meta verification aur paid messages lagte hain.                                                                                                                           |

Paste · Koi bhi nayi cheez connect karne se pehle

Kuch bhi naya connect karne se pehle mujhe simple shabdon mein batao: ye kya hai, is system ko iski zaroorat kyun hai, humare liye iska mahine ka kharcha kitna hai, aur agar main mana karun to kya hoga. Phir mere haan ka wait karo. Koi bhi key sirf .env.local aur Vercel mein jaayegi, aur mujhe exactly batao Vercel mein kahan daalni hai aur redeploy kaise karna hai.

07

HAMESHA KAAM AANE WALE PROMPTS

Paas rakho

- **Naya insaan:** MAIN ko: *“\[Naam\] \[role\] ke roop mein join kar raha hai. Uska login aur SOPs se joining checklist meri approval ke liye draft karo.”*
- **Koi rule badla:** MAIN ko: *“Aaj se \[rule\]. Ise CLAUDE.md mein permanent karo aur batao ye kaunse systems ko chhoota hai.”*
- **Mere guardrails likh liye:** MAIN ko: *“Ye rahe mere teen guardrails, mere shabdon mein: \[…\]. CLAUDE.md mein careful defaults ki jagah inhe lagao aur batao kya badla.”*
- **Monthly check:** MAIN ko: *“Project ko CLAUDE.md ke against audit karo aur jo bhi rule toot raha ho wo simple shabdon mein batao.”*

**MONTHLY TEST:** phone par OS kholo aur teen sawaal pucho. Kya har task, site report aur drawing sach hai? Kya koi cheez client, contractor ya vendor tak aapke haan ke bina pahunchi? Kya diary hafte ko aapki yaaddasht se behtar samjhati hai? Teen haan: agla system shuru karo. Ek bhi na: pehle use theek karo.

Mahesh R. Khandagale ji ke liye · Archi Design. BuildOur Builder Guides 02–04 se, blueprint BOA-2026-ARC-01 Rev A ke against.  
Ek record, ek app, kai sessions. Har price, date aur logon ka faisla owner ke paas.
