Buildour AI · GREATISHContinue Building · Rev A · Hinglish

# GREATISH OS CONTINUE BUILDING

Ajay Kumar ji ke liye. Starter Guide ke baad ki har sitting: **ek saath kai Claude Code sessions**, har system ka apna session, aur sabko jodne wala ek **MAIN session**. Field sales sabse pehle.

MAIN  
session–– Builder  
sessions–– Phone par  
test–– Paanch asli  
cases–– Merge,  
live–– Agla  
system

[TABLE]

Har step par do awaaz: AAP KARO · CLAUDE CODE MEIN PASTE KARO (English boxes, bas copy-paste)

01

SESSIONS KAISE KAAM KARTE HAIN

Ek baar padho

| Session                | Kya karta hai                                                                                                                                              | App mein naam                           |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **MAIN** (hamesha ek)  | Master copy (`main`) rakhta hai, database ka maalik hai, poora hua kaam jodta hai, CLAUDE.md aur START-NOW update rakhta hai. Khud koi system nahi banata. | `MAIN`                                  |
| **Builder** (teen tak) | Ek system banata hai, apni branch par, folder ki apni copy mein, sirf apni files chhoota hai. Phase poora hone par MAIN ko handover deta hai.              | `SYS-01 Beat App`, `SYS-03 Store Gate`… |
| **Writing lane**       | Code nahi, shabd likhta hai: Field Day rules, batch record aur QC formats, department SOPs, HR letter templates. Formulation kabhi nahi.                   | `SKILLS writing`                        |

Session ke buttons

Claude app ke **Code** tab mein, jab ek session kaam kar raha ho tab bhi usi `greatish-os` folder par **naya session** shuru kar sakte ho; har session left side ki list mein dikhta hai, click karke switch karo. Har session ka naam uske kaam par rakho.

Gadbad kyun nahi hoti

Har builder code ki apni copy (**worktree**) mein apni **branch** par kaam karta hai, isliye do sessions kabhi ek hi file mein type nahi karte. Har branch ka Vercel par apna test address hota hai, to system live app tak pahunchne se pehle phone par check ho jaata hai. Live copy mein kaam sirf MAIN jodta hai.

**EK SAATH TEEN, ISSE ZYADA NAHI.** Teen builders utne hi hain jitne ek insaan ek sitting mein follow, test aur answer kar sake. Agar sessions limit ki wajah se rukne lagein, to do chalao.

02

HAR SITTING

Roz ka same routine

1

MAIN mein paste karo

**Din shuru karo.** Claude app → Code → aapka `MAIN` session, aur ye paste karo:

Paste · MAIN · start of every sitting

You are the MAIN session for the GREATISH OS. Read CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/handovers/, docs/requests/ and the latest note in docs/sessions/. Tell me in simple words, in ten lines or fewer: what is not yet ticked in START-NOW; which systems are in progress and on which branch; any handover waiting to be merged; any request waiting for you; anything waiting for Ajay’s approval; and which builder sessions I should run today (at most three). Do nothing else until I say OK.

2

Aap karo

**Jo sessions MAIN ne bataye, wo kholo.** Agar us system ka session pehle se hai, to use click karke §03 ka **continue** box paste karo; nahi hai to naya session shuru karo, naam rakho, aur **new system** box paste karo.

3

Aap karo

**Sessions ka round lagao.** Jo session wait kar raha ho uska jawab do. Har session ek sitting mein ek chhoti poori cheez banata hai aur apna test address deta hai. Use phone par kholo aur ek asli executive, dukaan, batch ya task se check karo. Har nayi screen Starter Guide ke section 03 se check karo.

4

Har session mein, phir MAIN mein

**Din band karo.** Har builder mein: `Commit and push your branch, update your handover file and today's note.` Phir MAIN mein: `Read today's handovers. Merge anything marked ready, apply its migrations in order, and tell me what changed on the live app.`

03

SESSION PROMPTS

Builder session mein paste karo

Brackets ko §05 se bharo, jaise **SYS-01 GREATISH Beat App** aur `sys-01-beat-app`.

Paste · New builder session (fill the brackets from §05)

You are the builder session for **\[SYS-0N and system name\]** in the GREATISH OS. Read CLAUDE.md, docs/SESSIONS.md, the blueprint and the Starter Guide in docs/ (especially its section 03 on screens), docs/design/, and docs/build-sheets/\[sys-0N\].md (write it first from the blueprint if it does not exist, and wait for my approval). Work only in your own git worktree on the branch **\[sys-0N-short-name\]**, never on main, and only in this system’s folders. New tables or columns only in a new migration for this system, adding, never dropping. If you need a shared file changed, write it in docs/requests/ and tell me. Before any code: list every screen this system needs (one question, one main button, who, which device) as simple text sketches; give me a plan in small phases, each ending with something I can test on a phone at your branch’s test address, the first phase always “load my real data and show me one true list”; and list anything that needs Ajay’s approval rule or costs money. Wait for my OK.

Paste · Existing builder session · continue

Read CLAUDE.md, your build sheet and your handover file. Tell me in five lines where this system stands and what the one finished thing for today is. Make a plan and wait for my OK.

**Writing lane** pehle din se chal sakti hai. Ye aapse ek-ek sawaal karke aapke shabdon mein formats aur SOPs likhegi:

Paste · Writing lane · the skills (from day 1)

You are the writing session for the GREATISH skills. You write only in docs/ and content/, never code, and never any chemical formulation. Interview me one question at a time and write, in our own wording: content/field-day.md (what counts as a real shop visit, the fixed outcome list, the beat plan rule, the end-of-day report format, the quotation cover note with the rate line blank); content/batch-record.md (batch numbering, the batch manufacturing record, material issue slip, QC test report, finished goods inward note and daily production report formats, the machinery job card); content/sops.md (each department SOP in five lines: who, when, who approves, how long, who is told); content/hr-letters.md (offer, appointment, joining, confirmation, increment, warning, relieving and experience letters, with every salary and decision left blank for the authorised person). Mark each file draft until I approve it, then tell MAIN to load it.

04

BUILD, TEST, SWITCH ON

Har system ke liye same steps

1.  **Har sitting mein ek poori cheez,** branch ke test address par phone par, ek asli record ke saath test karo. Jo bhi hairaani ho, wo `docs/rules-i-learned.md` mein likho.
2.  **Screen check karo** Starter Guide ke section 03 se. Agar homework jaisi lage: *“Change only the design, following docs/design. Do not touch the features.”*
3.  **Phase poora ho to merge.** Builder handover likhta hai; MAIN merge karta hai; live app lagbhag do minute mein update ho jaata hai.
4.  **Paanch asli cases, phir ek team pehle.** Beat App ke liye: ek territory ke paanch executives ek hafte, phir sab. Store Gate ke liye: ek warehouse, phir baaki.
5.  **Bharose se pehle shadow.** Field Verify Flow, dono auditors aur Duty Officer pehle sirf aapko report karte hain aur kuch nahi badalte, jab tak aap kuch hafte unke alerts parakh na lo. Mismatch sales head ke liye ek sawaal hai, kisi employee par faisla nahi.

**AGAR KOI SESSION GALAT JAAYE:** bolo *“Stop. Summarise what is broken in simple words and give me two options: fix forward, or go back to your last commit.”* Ek toota hua session kabhi live app ya doosre sessions ko nahi todta.

05

BUILD ORDER, SESSION BY SESSION

Blueprint se · ek saath teen tak

| Hafte | MAIN                                                | Builder A                                                                                                          | Builder B                                                  | Writing / baaki                |
|-------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|--------------------------------|
| 1–2   | F-00 Shared Record aur approval matrix (day 1)      | **SYS-01** Beat App `sys-01-beat-app`                                                                              | Khaali                                                     | Field Day Skill (writing)      |
| 3–6   | Merges; har phone par Beat App                      | **SYS-02** Field Verify + Sales Command Board `sys-02-field-verify`                                                | **SYS-03** Store Gate + Batch Record `sys-03-store-gate`   | Batch Record formats (writing) |
| 7–10  | Merges; SOPs load                                   | **SYS-04** Task Desk + Pending Work Board `sys-04-task-desk`, phir **SYS-05** Escalation Chain `sys-05-escalation` | **SYS-06** Plant Board `sys-06-plant-board`                | Department SOPs (writing)      |
| 9–12  | Tally connector aur Claude API, aapke haan ke saath | **SYS-07** Purchase to Tally `sys-07-purchase-tally`                                                               | **SYS-08** Plant + Sales Auditor, shadow `sys-08-auditors` | HR letters (writing)           |

| Phase                 | Kab poora maana jaayega (blueprint se)                                                                                                                                                                                                                                                                                                                              |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P1 · F-00, SYS-01     | Architecture, roles aur approval matrix ek sitting mein sign-off ho chuke hain, aur har field executive ka Beat App par apna login hai, har claimed shop visit duty hours ke andar ek GPS check-in row ke roop mein maujood hai.                                                                                                                                    |
| P2 · SYS-02, SYS-03   | Har executive ki verified-vs-reported sheet roz subah bina call ke aapke phone par aati hai, aur plant ka har material movement ek Store Gate entry hai jo ek batch aur warehouse se stamped hai.                                                                                                                                                                   |
| P3 · SYS-04 se SYS-06 | Har department ke open aur overdue tasks Pending Work Board par ek naam ke saath dikhte hain, late items bina aapke phone kiye remind aur escalate ho chuke hain, aur Plant Board us hafte bane batches ki asli cost BOM ke against dikhata hai.                                                                                                                    |
| P4 · SYS-07, SYS-08   | Field sales, plant, stores, purchase aur pending work ki asli halat ek jagah dikhti hai, matched purchases bina doosri typing ke Tally mein post hote hain, aur auditors ke exceptions ke saath ek daily AI report aapke phone par aati hai, taaki aapko employees se jaankari maangni na pade ya khud koi task chase na karna pade, hafte ke ek se do ghante mein. |

**GATES:** koi builder tab tak shuru nahi hota jab tak F-00 aur approval matrix merge na ho. SYS-02 kuch hafte ke Beat App records ka wait karta hai; SYS-06 kuch hafte ke Store Gate aur batch records ka, aur aapki standard BOM costs ka. SYS-07 ko Tally mein kuch bhi post karne se pehle saaf supplier ledgers aur har material ki approved supplier list chahiye. SYS-08 shadow mode mein chalta hai: report karta hai, kuch badalta nahi.

**Mahine 4 se 12, usi ghar mein:** Duty Officer aur ek consolidated daily, weekly aur monthly report (mahine 4 se 6) → dealer aur customer profiles, credit limit monitoring aur approved wording mein WhatsApp se bakaya reminders (mahine 6 se 8) → poora HR module: attendance, leave, payroll inputs, PF aur ESI (mahine 8 se 10) → machinery service, tender tracking, document knowledge base aur CEO assistant (mahine 10 se 12). Har ek §03 se shuru hota hai.

06

JAB KISI CHEEZ MEIN PAISA LAGE

Build se pehle decide karo

| Kya chahiye                          | Pehli baar kab                                   | Aapke liye matlab                                                                                                                                                                                                                                                                                   |
|--------------------------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Pro**                     | Beat App live hone se pehle                      | Lagbhag \$25 mahina: 50 se 100 executives ke GPS rows aur photos ke liye jagah, aur daily backups.                                                                                                                                                                                                  |
| **Tally connector**                  | SYS-07                                           | Tally Prime aapke office computer par chalta hai. OS usme Tally ke apne data interface se post karta hai, jiske liye wo computer on hona chahiye aur ek chhota connector program install hona chahiye, ya ek paid Tally connector service. Claude Code options aur kharcha dikhayega; faisla aapka. |
| **Claude API key**                   | SYS-08, phir Duty Officer                        | Auditors har raat chalte hain jab computer par koi nahi hota, jo Claude Max mein cover nahi hai. Use ke hisaab se bill, aapki set ki hui monthly spend limit ke saath, platform.claude.com par; key sirf Vercel mein jaati hai. Claude Code pehle anumanit monthly kharcha batayega.                |
| **WhatsApp Business API** (optional) | Morning notes, suppliers ko PO, bakaya reminders | Sirf tab, jab aap ye cheezein app ya email ki jagah WhatsApp par chahte ho. Meta business verification, approved templates aur paid messages lagte hain.                                                                                                                                            |

Paste · Before any new connection

Before you connect anything new, tell me in simple words: what it is, why this system needs it, what it costs each month for us, and what happens if I say no. Then wait for my yes. Any key goes only into .env.local and Vercel, and you tell me exactly where to add it and to redeploy.

07

HAMESHA KAAM AANE WALE PROMPTS

Paas rakho

- **Naya executive ya employee:** MAIN ko: *“\[Name\] joins as \[role\] in \[company, territory or department\]. Draft the login and the joining letter for my approval.”*
- **Koi limit ya rule badla:** MAIN ko: *“From today \[the rule or limit\]. Update the approval matrix and CLAUDE.md and tell me which systems it touches.”*
- **Nayi company ya warehouse:** MAIN ko: *“Add \[company / warehouse\]. Show me what it needs before anything changes.”*
- **Monthly check:** MAIN ko: *“Audit the project against CLAUDE.md and my guardrails and report anything that breaks them, in simple words.”*

**MONTHLY TEST:** phone par OS kholo aur teen sawaal pucho. Kya har visit, order, batch aur task sach hai? Kya koi rate, credit, purchase ya payment bina zaroori haan ke nikla? Kya daily note hafte ko phone calls se behtar samjhata hai? Teen haan: agla system shuru karo. Ek bhi na: pehle use theek karo.

Ajay Kumar ji ke liye · GREATISH PVT LTD. BuildOur Builder Guides 02–04 se, blueprint BOA-2026-GRE-01 Rev A ke against.  
Ek record, ek app, kai sessions. Har price, payment, formula aur logon ka faisla insaan ke paas.
