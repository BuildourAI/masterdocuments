# The Six House Rules

**BuildOur AI · Builder Guide · DWG NO. BOA-2026-BLD-03 · REV A**

*Paste once into CLAUDE.md, obey forever. Six plain-language rules that keep every system you ever build safe, honest and yours.*

| | |
|---|---|
| **Purpose** | The standing rules for the platform. They go into your project's `CLAUDE.md` on day 1 (Builder Guide 00, Step 4) and govern every system ever built in that folder. Each rule is written to be pasted exactly as it is, and each explains, in plain words, why it exists. No technical vocabulary is needed to read, use or enforce them. |
| **Who this is for** | Every builder, from day 1 onward. If your app is already running and these rules are not in its CLAUDE.md, paste them today and run the audit prompt at the end. |
| **What you need open** | Your project folder with Claude Code running. Nothing else. |
| **Time** | Ten minutes to paste. A lifetime of not worrying. |
| **Prepared by** | BuildOur AI |
| **Series** | Builder Guide 03 of 04. Before this: 02 The Build Sheet. After this: 04 Test, Trust, Then Turn It On. |

> A rule stated once in CLAUDE.md holds for every build, every sitting, every system. That is the whole trick.

---

## 01 · The Rules *(paste this block into CLAUDE.md)*

> **RULE 1 · ONE HOME.** This folder, this repository, this database and this app are the only ones this business will ever have. Every new system is a new room in the same house: a new section of the app reading the same customer list, the same orders, the same logins. Never create a second app, a second database or a second repository for a new system.
> *Why: a business with eight systems in eight apps has eight logins and eight copies of the customer list, and the one screen that should show everything can never be built.*

> **RULE 2 · EVERY PERSON THEIR OWN KEY.** Every team member gets their own login. Each person sees exactly what their work needs and nothing more; the owner sees everything. No shared passwords, ever.
> *Why: "who did what" only means something when everyone is themselves.*

> **RULE 3 · A HUMAN YES BEFORE ANYTHING REACHES A CUSTOMER.** Nothing is sent to a customer, and no price, discount, credit or commitment is given, without a named person approving it first. Automatic sending exists only for message types the owner has explicitly switched on after testing, and there is one switch that turns all automatic behaviour off without touching code.
> *Why: trust is spent in one wrong message and earned back over months.*

> **RULE 4 · THE DIARY NOBODY CAN EDIT.** Every action the system takes (every message, every change, every approval, every mistake) is written to a log that can never be edited or deleted, only added to.
> *Why: reviews run on what actually happened, not on what anyone remembers.*

> **RULE 5 · SECRETS STAY IN THE CUPBOARD.** Keys and passwords live only in `.env.local` on this machine and in the hosting settings online. They never appear in code, in chat, or in any file that goes to GitHub.
> *Why: a key in the code is a key given to everyone who ever sees the code.*

> **RULE 6 · MONEY IS CALCULATED, NEVER GUESSED.** Prices, quantities, totals and stock figures come from exact rules written as code from the owner's own numbers, and those rules are tested against real past examples. AI reads, matches, drafts and reminds; it never invents a number.
> *Why: an AI that guesses a price is wrong confidently. A calculation is either right or visibly broken.*

## 02 · What Each Rule Looks Like When It Is Working

| Rule | You know it holds when |
|---|---|
| 1 · One home | Your second system appears as a new section in the same app, behind the same login, reading the same customers. No new address, no new password. |
| 2 · Own keys | Each team member signs in as themselves on their own phone, and their screen shows their work only. Nobody has ever asked "what's the password?" |
| 3 · Human yes | Every outgoing thing sits in a queue with a name next to it until someone taps yes. The off switch is one tap, and you have tested that it works. |
| 4 · The diary | You can answer "what did the system do last Tuesday?" from a screen, in one minute, without asking anyone. |
| 5 · Secrets | You can show your code to a stranger without changing a single password afterwards. |
| 6 · Calculated money | When a price looks wrong, you find the exact rule that produced it, and the fix is a change to that rule, tested against old orders before it goes live. |

## 03 · Keeping the Rules Honest

- **Claude must flag, not bend.** If Claude ever proposes something that bends one of these rules, it must say so out loud and wait for your decision. That expectation is part of the rules block itself; it costs nothing and catches drift early.
- **The audit prompt.** Whenever you wonder whether the rules still hold, paste: *"Audit this project against the six house rules in CLAUDE.md and report anything that breaks them, in simple words."* Run it at least once a month, and always before you widen a system to more customers (Builder Guide 04).
- **New sitting, same rules.** The rules live in CLAUDE.md precisely so you never have to repeat them. If you ever start a fresh project folder (you should not: Rule 1), the rules move first, before any code.
- **Corrections are permanent.** When you correct the system once (a wording, a boundary, a person's access), have Claude record it so it holds forever: *"Make this correction permanent so it applies to everything we build from now on."*

> **THE GATE:** the rules are in CLAUDE.md word for word; the audit prompt has run once and reported clean, or every finding it raised has been fixed; and you can name, from memory, the one switch that turns all automatic behaviour off. Then move on, and never think about this document again except once a month.

---

*Written for builders on the fixed stack: Claude Code, Next.js, Supabase, Vercel, GitHub. The rules are the owner's, stated once; the code merely makes them physically true.*

*BuildOur AI · Builder Guide · DWG NO. BOA-2026-BLD-03 · REV A*
