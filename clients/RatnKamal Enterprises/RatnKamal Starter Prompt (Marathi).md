# RatnKamal Enterprises · Starter Prompt

RatnKamal Starter Guide chya Step 4 madhe sangitlya pramane, ha prompt **HQ** session madhe paste kara (Claude desktop app → Code tab → folder `ratnkamal-os`). Tumcha GitHub address aadhich bharlela aahe.

---

```
Tumhi RatnKamal Enterprises sathi RatnKamal OS set up karat aahat. RatnKamal Enterprises swatachya factory madhe GI metal doors ani windows banavte ani te ghar bandhnarya lokanna ani builders na vikte. Mi Santosh Uttam Mali, owner aahe, ani mi programmer naahi.

Ya folder madhe, docs/ madhe teen PDFs aahet:
- majha AI Systems Blueprint;
- majha Starter Guide (section 03 mhanje look; pages R1, R2 ani R3 tumchyasathi lihile aahet);
- majha Continue Building Guide.
docs/samples madhe kharya enquiry WhatsApp threads, catalogue photos, majha rate card, ek Order Form, ek Job Card Sheet ani majhi Team Leader checklist aahe.

Majhi GitHub repository aadhich aahe pan ajun kashalahi connect keleli naahi:
https://github.com/ratnkamalenterprises-creator/Ratnkamal-Enterprises.git
Majhyakade Claude, ratnkamal-os (Mumbai) navacha Supabase project ani ek Vercel account aahe, he donhi aaj majhya GitHub login ne banavle aahet. Baki kahihi set up kelele naahi.

Ha session HQ aahe, majha main session. HQ main ani database sambhalte, sagla kaam merge karte, ani swata kadhihi system banavat naahi. Nantar, mi ughadlelya itar pratyek session cha opening prompt HQ lihil.

Saha stages madhe kaam kara. Pratyek stage nantar, tumhi kay kele te mala sopya shabdat sanga, mag THAMBA ani majhya OK chi vaat bagha. Mala ekaveli ekach prashna vichara. Mala kadhihi ya chat madhe key, password kinva login paste karayla sangu naka: te kuthe milel ani mi swata te kuthe paste karayche te mala sanga. Mi tumhala Marathi, Hindi kinva English madhe lihu shakto. Majhyashi Marathi madhe (English aksharat) bola, pan app, code, files, CLAUDE.md ani screens English madhech theva.

STAGE 1 · Vacha ani check kara
Blueprint ani Starter Guide vacha. Mala daha olinchya aat sanga:
- RatnKamal Enterprises kay aahe;
- majhi mukhya adchan;
- foundation ani aath systems;
- baara aathavdyancha build cha kram.
Blueprint madhe je mudde ajun tharle naahit mhanun sangitle aahet tyanchi list kara, ani tyatla ekhi swata tharvu naka: headcount (majhya shivay 22 kinva majhyasobat 23; Office Boy ani Accountant 22 madhe naahit); ani orders madhla repeat cha hissa, jo mi segment mhanun dila, aakda mhanun naahi.
Mag Node.js ani Git install aahet ka te check kara. Jar konte hi naslyas, nemke kay download karayche ani kuthe click karayche te mala sanga.

STAGE 2 · Connect ani set up
1. Ha folder varchya majhya GitHub repository shi connect kara. Repository madhe aadhich files asli (udaharanarth README), tar tya theva. GitHub mala sign in karayla sangel tevha, kay disel ani kuthe click karayche te mala sanga.
2. Ya folder madhe Supabase sobat Next.js (App Router, TypeScript, Tailwind) app banava.
3. Ek .gitignore banava jo .env.local, pratyek secret ani docs/samples baher theval, karan samples madhe customer details ani majhe rates aahet.
4. .env.local banava, he teen naav ani rikamya values sobat: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ani SUPABASE_SECRET_KEY. Mag ti file Notepad madhe kashi ughdaychi, ani Supabase madhe pratyek value kuthun copy karaychi te mala sanga:
   - Project URL ani publishable key: Connect button → App Frameworks → Next.js;
   - secret key: Project Settings → API Keys → "Publishable and secret API keys" tab → Secret keys → Reveal.
   Mi te swata file madhe paste karen. Te kadhihi parat lihu naka, itar konatya hi file madhe lihu naka, kadhihi commit karu naka.
5. CLAUDE.md banava, tyat Starter Guide che page R2 word for word, ani R3 madhla build brief ani session rules. Te niyam mala paach olit vachun dakhva.
6. Pahila commit kara ani main var push kara. Ya computer var chalnara app mala dakhva.

STAGE 3 · Ghadyalye suru kara
Page R1 varun docs/START-NOW.md banava: pratyek goshta tichya owner, start date ani tick box sobat, sarvat lamb kaam aadhi. Pratyekachi aajchi pahili action mala sanga. WhatsApp Business API number ani Team Leader meeting sarvat aadhi. Ata pasun, pratyek baithakichya survatila je tick zalele naahi tyachi mala aathvan karun dya.

STAGE 4 · Live ja
Vercel sathi teen environment variable naav mala sanga. Mag mi repository Vercel madhe import karun deploy karto (Starter Guide cha Step 5) toparyant thamba, Vercel la fakt yach eka repository cha access dyaycha; Framework Preset Next.js aahe ka te check kara. Mi tumhala live address dila ki app ughadto ka te confirm kara. Tithe sign-in chalave mhanun Supabase madhe nemke kay set karayche te mala sanga (Authentication → URL Configuration: Site URL ani redirect URLs).

STAGE 5 · Foundation
R3 madhe sangitlya pramane F-00, One Lead to Cash Record, banava: profiles ani roles, leads, quotes, orders, batches, bakaya, approvals, settings ani audit log, Row Level Security sobat. Price fields fakt majhya approval nech set hotil. Mi aadhich paise bharat aslelya CRM che naav ani tyala API aahe ka te mala vichara; te ajun connect karu naka, te aathavda 3 te 4 madhe yeil.
Migrations Supabase var lava, majha owner login joda, push kara, ani mi majhya phone var sign in karu shakto ka te confirm kara.

STAGE 6 · Plan ani pahile prompts
1. docs/SESSIONS.md liha: blueprint ani Continue Building Guide chya section 05 madhla baara aathavdyancha build cha kram, konti systems ekachveli chaltat (jastit jast don builders), ani niyam ki pratyek builder swatachya worktree madhe swatachya branch var kaam karto ani HQ la handover deto.
2. docs/build-sheets/sys-01-enquiry-and-quote-skill.md liha: te kay karte, te kadhihi kay karu naye, te docs/samples madhun kay vachte, ani tyache done-when.
3. Mala aatach look nivadayla sanga (Step 6, Starter Guide cha section 03), ani vaat bagha.
4. docs/design tayar zala ki, Enquiry and Quote Skill banavnarya writing session cha opening prompt docs/session-prompts/ madhe liha. To mala tyachya swatachya box madhe, paste karayla tayar, dakhva, ani mala Continue Building Guide kade jayla sanga.
Build sheet var majha OK milalya shivay feature code naahi.
```
