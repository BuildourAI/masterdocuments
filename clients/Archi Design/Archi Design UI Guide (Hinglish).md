Buildour AI · Archi DesignUI Guide · Rev B · Hinglish

# ARCHI DESIGN OS UI GUIDE

Mahesh R. Khandagale ji ke liye. Claude wahi banata hai jo aap bolte ho, lekin **design wahi karta hai jo aap dikhate ho**. Look ek baar kaise choose karna hai, aur **har screen** kaise check karni hai taaki team aapko call karne ki jagah OS khole.

Mood  
board–– Choose–– Claude ko  
do–– Har system  
ki screens–– Har screen  
check

|                                                                                                                                                                                                               |                                                                                                                                   |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Kab use karna haiSection 01 aur 02 ek baar, Starter Guide ke Step 3 mein, pehli asli screen se pehle. Section 03 se 06 har baar jab koi builder session aapko nayi screen dikhaye.                            |                                                                                                                                   |
| Aapke liye kyun zarooriJis designer ko scroll karna pade, ya jis site engineer ko dhoop mein type karna pade, wo wapas WhatsApp par chala jaayega. Phir My Day khaali, aur uske baad ka har board bhi khaali. | Kya chahiyeBrowser mein Pinterest · Claude app (Chat) · Claude Code mein aapka MAIN session · Lean Master Plan section 12 aur 13. |

Koi nahi bolega ki design galat hai. Team bas chupchaap app kholna band kar degi.

01

LOOK CHOOSE KARO

Das minute · ek baar

Claude ko bolo “mera system bana do” aur look ke baare mein kuch mat bolo, to aapko internet ke har app ka average milega: bhara hua, generic, aur koi use nahi karega. Aap architect ho: aap kabhi contractor ko finishes choose nahi karne doge. Apne office system ka look bhi waise hi khud choose karo.

1

**Designs ikattha karo.** **pinterest.com** par search karo `minimalist UI design web app` aur `task app mobile clean`. 10 se 15 aisi screens download karo jo aapki team ek nazar mein samajh jaaye. Bhari hui, dark ya zyada clever cheezein chhod do.

2

**Sabse strong model ko choose karne do.** **Claude app** kholo, **Chat** choose karo (Code nahi), list mein sabse strong model chuno, saari screenshots attach karo aur neeche wala chooser prompt paste karo.

Paste · Claude app chat · chooser prompt

Maine aapke saath kuch powerful, minimal UI designs share kiye hain. Main apni company ka interface bana raha hoon: Archi Design, ek architecture aur interior design studio jo turnkey projects bhi karta hai. Mere designers screens office mein laptop par use karte hain; site engineers basic Android phones par site par, aksar bahar dhoop mein aur kamzor network mein; aur main apne phone par dekhta hoon ki kaunse projects aur log mujhe chahiye, aur approvals deta hoon. Main designer hoon, isliye interface saaf, shaant aur sundar hona chahiye, light aur dark dono themes ke saath. In sab designs ko research aur analyse karo aur batao mujhe kaunsa choose karna chahiye. Design aisa ho jo meri team bahut aasaani se samajh sake: khud samajh aane wala, lagbhag bina training ke. Aksar interfaces itne complicated ho jaate hain ki team samajh hi nahi paati; yahan humein ulta chahiye, ek friendly interface jo complex na lage aur jaise meri team seekhti hai waisa ho. Aage badhne ke liye mujhe sabse achha wala batao.

3

**Verdict padho.** Wo ek winner batayega, runner-up se kya lena hai, aur kya avoid karna hai. Apni aankh se bhi check karo: aapka taste kisi bhi model se behtar hai; model sirf ye check karne ke liye hai ki team aasaani se padh paayegi ya nahi.

4

**Likhit mein lo.** Sirf jeetne wale ek ya do designs dobara upload karo aur pucho: *“Maine chune hue designs upload kiye hain. Mujhe ek detailed prompt markdown (.md) file mein do, jo main in images ke saath Claude Code mein daal sakun.”* .md file download karo.

**AGAR JAWAB BAHUT CHHOTA AAYE** (“a task manager”), ek line mein sudharo: *“Ye sirf task list nahi hai. Ye Archi Design ka operating system hai: tasks, sites, drawings, log aur projects, sab kuch.”*

02

CLAUDE CODE KO DO

Ek baar · MAIN session

Jeetne wali images aur .md file apne `archi-design-os` folder ke andar `docs/design/` mein save karo, phir ye MAIN mein paste karo:

Paste · MAIN · har session ke liye look aur themes set karo

Design direction docs/design mein hai: chuni hui images aur design .md file. Inhe, docs/ mein UI Guide, aur Lean Master Plan ke section 12 aur 13 padho. Mujhe paanch lines mein Hinglish mein batao ki look kya hai. Phir look ko theme tokens mein set karo: Light, Dark aur teen colour palettes, aur Archi Design ka logo aur brand colour; har user apni profile mein theme chun sake. CLAUDE.md mein jodo ki har session ki har screen docs/design, theme tokens aur UI Guide ke section 03 se 05 follow karegi. Phir dummy data ke saath ek sample My Day screen banao (numbered tasks 1 se 5, progress ring, Done aur Blocked buttons), taaki koi bhi system banne se pehle main look aur themes apne phone par dekh sakun. Mere OK ka wait karo.

03

AAPKI SCREENS, HAR EK KA EK SAWAAL

Har builder session ko kya design karna hai

Software screens ka set nahi, baatcheet ka set hai. Har insaan ek sawaal lekar aata hai, screen uska jawab deti hai, aur wo ek kaam karta hai. Ye wo main screens hain jo aapke blueprint ko chahiye.

| Screen (master plan §12)           | Uska ek sawaal                                                         | Ek main button           | Kaun, kis par           |
|------------------------------------|------------------------------------------------------------------------|--------------------------|-------------------------|
| My Day                             | “aaj kya karna hai, kis order mein?” (1 se 5, har number ka reason)    | Done (proof ke saath)    | Sab, phone              |
| Task detail                        | “ye kyun zaroori hai, kaun wait kar raha hai?”                         | Start / Done             | Sab, phone              |
| My Attendance and Leave            | “maine punch kiya? kitne late marks? leave kitni bachi?”               | Punch In / Out           | Sab, phone              |
| Team board                         | “kaun overloaded hai, kya blocked hai, kaunsa clash?”                  | Task do (level ke saath) | Captains, leads         |
| Owner Exception View               | “aaj kis cheez par mera faisla chahiye?” (sab theek ho to “All clear”) | Red item kholo           | Aap, phone              |
| Project page                       | “ye project kahan hai, aur kiska wait hai?”                            | Approve                  | Captain, team           |
| Site diary, snags                  | “aaj site par kya hua?” (pehle photos)                                 | Report bhejo             | Site engineers, Android |
| Drawing register                   | “kaunsi drawing site ke liye release hui?”                             | Release for Site         | Designers, captain      |
| Lead pipeline, proposal            | “kis enquiry ka next action aaj hai?”                                  | Next action              | Sales                   |
| My Scorecard                       | “mera score kaise bana, aur kitna incentive banega?”                   | Breakdown dekho          | Staff, managers         |
| Client project page                | “mera project kahan hai, mujhe kya decide karna hai?”                  | Approve / rate           | Client                  |
| People (HR), Studio Plan, Settings | “kaun kahan hai; studio kidhar ja raha hai; rules kya hain?”           | Save                     | HR, aap, admin          |

04

ARCHI DESIGN SCREEN RULES

Aapke office aur sites ke liye

- **Site-proof pehle.** Site engineers ki screens basic Android phone par ek haath se, dhoop mein chalein: bade button, high contrast, bada text, chhote icons nahi.
- **Shabdon se pehle photo.** Camera ek tap mein khule; project aur date ke stamp wali photo proof maani jaaye. Typing aakhri option hai.
- **Bina network ke bhi chale.** Site Diary phone par save ho aur signal aate hi khud chali jaaye, aur screen par likha aaye (“saved, will send”).
- **Ek tap mein proof.** “Done” sirf wahi proof maange jo us task type ko chahiye (file link, photo ya note), pehle se chuna hua.
- **Red, amber, green ka sirf ek matlab:** late, risk par, on track. Kabhi decoration nahi. Red items hamesha upar.
- **Aapki screens sirf exceptions dikhayein.** Kya red hai, kya aapke signature ka wait kar raha hai, kaun overloaded hai. Jo theek chal raha hai wo sab nahi.
- **Staff screens par paisa nahi.** Koi incentive, deduction ya cost figure kisi employee ko aapke sign se pehle nahi dikhega.
- **Teen tap ka rule.** Har roz ka kaam teen tap, voice note ya photo mein ho; koi form 5 se zyada zaroori fields na maange.
- **Staff screens par reports nahi.** Charts aur analysis sirf aapke aur managers ke liye; staff ko progress ring aur on-time streak.
- **Themes.** Light, Dark aur teen palettes, har user apni profile mein chune; aapka logo aur brand colour har jagah, Client Page par bhi.
- **Studio ke apne shabd.** Labels wahi jo aapka office bolta hai: Release for Site, Snag, RA bill.
- **Unki bhasha.** Agar site engineers Marathi ya Hindi aasaani se padhte hain, to Claude ko bolo: har insaan apni chuni hui bhasha mein labels dekh sake.

05

HAR SCREEN CHECK KARO

Builder session ko OK bolne se pehle

| Paanch screen laws                           | Kya check karna hai                                                                     |
|----------------------------------------------|-----------------------------------------------------------------------------------------|
| **1 · Koi padhta nahi, sab scan karte hain** | Jo cheez insaan ko sabse pehle dikhni chahiye, wahi screen par sabse badi aur bold ho.  |
| **2 · Ek screen, ek kaam**                   | Ek main button, bina scroll kiye dikhe, us ek rang mein jo action ke liye rakha hai.    |
| **3 · Ek jaisa dikhna hi bharosa hai**       | Ek hi cheez har screen par ek jaisi dikhe: task, project, red flag.                     |
| **4 · Default hi decision hai**              | Jo baar baar bhara jaata hai wo pehle se bhara ho: aaj ki date, project, stage, insaan. |
| **5 · Chuppi ek error hai**                  | Har tap ka turant jawab aaye: koi change, tick ya message.                              |

**DO MINUTE KA RULE:** naya employee koi bhi screen khole aur do minute ke andar, bina training ke, samajh jaaye ki ye kya hai aur kya karna hai. Agar screen samjhani pade, to galti screen ki hai, employee ki nahi. Asli test: phone ek site engineer ke haath mein do aur bina madad kiye dekho.

Paste · koi bhi builder session · screen review

Is screen ko UI Guide ke section 03 se 05 aur docs/design ke against check karo. Jo bhi law ya rule toot raha ho, wo simple shabdon mein batao aur fix suggest karo. Features mat badlo.

Paste · koi bhi session · sirf look badlo

Is screen ka sirf design badlo, docs/design ke hisaab se: rang, size, spacing, placement. Features ya data ko haath mat lagao. Mujhe phone par pehle aur baad dono dikhao.

06

KYA KABHI NAHI KARNA

Aur design kab poora hai

- **Claude ko kabhi look khud invent mat karne do.** Koi picture nahi matlab internet ka average. Har naya system docs/design se shuru hota hai.
- **“Shayad kaam aaye” soch kar koi screen mat jodo.** Har screen section 03 ke kisi ek sawaal ka jawab deti hai, warna wo hoti hi nahi.
- **Kabhi AI ko blueprint mein “gaps dhoondhne” mat bolo.** Wo gaps bana dega. Khud padho; asli gaps Romana ke paas lao.
- **Saaton logon ko announcement se launch mat karo.** Har nayi screen pehle us ek insaan ko do jise purani taklif sabse zyada hai; uski raahat baaki sabko le aayegi.

**GATE:** docs/design mein aapka chuna hua look hai; CLAUDE.md bolta hai ki har screen use follow karegi; har screen paanch laws aur do minute ka rule paas karti hai; aur ek site engineer aur ek designer ne My Day bina ek bhi “ye kya hai?” puche use kar li. Tab design poora hai, aur poora hi rehta hai, kyunki wo likha hua hai.

Mahesh R. Khandagale ji ke liye · Archi Design · BuildOur UI Guide (BOA-2026-UI) se, blueprint BOA-2026-ARC-01 Rev B aur Lean Master Plan §12 se 13 ke against.  
Features aapke blueprint se aate hain; chehra aapke mood board se. Pehle dikhao, phir banao.
