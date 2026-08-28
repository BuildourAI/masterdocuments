# The UI Guide: Design What You Show

**BuildOur AI · UI Guide · DWG NO. BOA-2026-UI · REV A**

*Claude builds what you speak, but Claude designs what you show. This guide is how you show it: a mood board, a chooser prompt, and five screen laws that make your team open the app instead of running from it.*

| | |
|---|---|
| **Purpose** | Give every system you build a face your team actually wants to use. You collect real designs, let the AI's strongest model pick the winner for your business, turn that choice into a written design direction, and hand direction plus pictures to Claude Code before it builds a single screen. Never again accept the design the machine invents on its own. |
| **Who this is for** | Every builder. Use it the day you start a new system (before the first screen exists) and again whenever an existing system looks like homework instead of a tool. |
| **What you need open** | Pinterest in a browser · the Claude app (chat, not Claude Code) · your project folder with Claude Code running · your AI Systems Blueprint. |
| **Time** | Ten minutes to collect designs. One chat to choose. One sitting to apply. |
| **Prepared by** | BuildOur AI |
| **Series** | Companion to the Builder Guides: it plugs in the moment you hand Claude the Build Sheet, and its rules go into the repo next to CLAUDE.md. |

> Nobody will tell you the design is wrong. Your team will just quietly stop opening the app. That silence is the bug this guide fixes.

---

## 01 · Why Every AI-Built App Looks the Same

Claude is trained on millions of interfaces. Ask it to "build my system" and say nothing about looks, and it hands you the **statistical average of every interface on the internet**: the same purple gradient, the same floating cards, the same font everyone has seen a thousand times. It is not wrong; it is average. And average is what your team already ignores.

Apple did not win in 1976 because the Apple I had new functions — it mostly did not. It won because Steve Jobs looked at the existing machines and said they were ugly, and made the computer **friendly to look at**. Less is more: Apple shows you only what matters; the cluttered screen shows you everything and teaches you nothing. Your system is competing for the same three seconds of your team's patience.

Open your current build and ask one honest question: *if I put this in front of a new team member, do they smile, or do they see a fighter-jet cockpit?* A cockpit gets closed. A clean screen gets used.

> **THE LAW OF THIS GUIDE:** Claude builds what you *speak* — the features, the rules, the flow. But Claude designs what you *show* — the colours, the calm, the placement. If you show it nothing, it shows your team the internet's average. So you never start a build without pictures.

## 02 · The Mood Board *(ten minutes on Pinterest)*

| Step | What to do |
|---|---|
| **1 · Search** | Open pinterest.com and search exactly: **minimalist UI design web app**. Minimalist is not taste, it is policy: the cleaner the screen, the faster your team understands it. |
| **2 · Collect** | Download 10–15 screens that make you think "my team would get this at a glance." Ignore anything crowded, dark-cluttered, or clever. |
| **3 · Choose by AI, not by mood** | Open a fresh chat in the Claude app — **chat, not Claude Code** — set the model to the strongest one available (Fable), attach all the screenshots, and paste the chooser prompt below with your own business line filled in. |
| **4 · Read the verdict** | It will name a winner, tell you what to borrow from the runner-up, and which design to stay away from. Check the recommendation against your own eye before accepting it. |
| **5 · Get the written direction** | Re-upload only the winning one or two designs and ask: *"I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images."* Download that .md file. It is now a permanent part of your project. |

**The chooser prompt** *(change only the line in brackets)*:

> I have shared some powerful, minimal UI designs with you. I am building the interface for my company — [we manufacture bolting and torquing tools for second-party vendors]. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite — an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

> **SCOPE WARNING:** if the AI's written direction narrows your system ("a pre-sales dashboard"), correct it in one line: *"This is not only pre-sales. It is the complete business centre of my company — marketing, sales, finance, operations, team — everything."* And if you are redesigning a system that already works, say so with a screenshot: *"My system is already built. Change only the design — colours, look, placement. Do not touch the features."*

## 03 · From Mood Board to Build *(one sitting in Claude Code)*

1. **Attach three things** to a new Claude Code session in your project: the winning design images, the design .md file, and your AI Systems Blueprint.
2. **Plan first, always.** Switch to plan mode with the strongest model and ask: *"I have given you these files. What do you understand from them?"* Read its answer. It should say back, in its own words, both what you are building and how it must look. Only then approve the plan — and read the plan itself, every time, even when you understand half of it.
3. **Accept the checkpoint offer.** When it proposes building in reviewed steps, take the recommended option: it builds a stage, shows you, you approve, it continues. Going live happens after a checkpoint you have seen, never before.
4. **Spend models like money.** The strongest model (Fable) is for choosing designs and planning — the thinking. The workhorse model (Opus) is for execution — the typing. Planning on the strong model costs little and saves you from building the wrong thing at full price.
5. **Put this guide's rules in the repo.** The design .md and the design principles document live in the project folder, so every future sitting inherits the same taste. A rule about looks, stated once, holds forever — exactly like the house rules.

## 04 · The Five Screen Laws *(what "good design" means, precisely)*

Your software is not a set of screens; it is a set of **conversations**. Every user arrives with a question, the screen answers it, and the user does one thing. Home answers *"where am I?"* The queue answers *"what do I do next?"* The record answers *"tell me everything about this one thing."* The button answers *"approve, send, or reject?"* Design each screen for its one question and the whole app becomes obvious.

| Law | What it demands |
|---|---|
| **1 · Nobody reads, everyone scans** | The eye lands on the biggest, boldest, highest-contrast thing first, then walks down by size and weight. Hierarchy is not decoration; it is the order in which you are telling the eye to look. Decide what your user must see first, and make it unmissable. |
| **2 · One screen, one job** | Exactly one primary action per screen, visible **without scrolling**, in the one colour you reserve for action. Two primary buttons on one screen is a decision you refused to make, handed to your least patient user. |
| **3 · Consistency is trust** | The same thing looks the same everywhere. A button that changes shape or colour between screens teaches the team that nothing here can be trusted at a glance. |
| **4 · The default is the decision** | Whatever the team fills in repeatedly is pre-filled, pre-selected, pre-sorted. The system should run WhatsApp-fast, with no load on anyone's mind. |
| **5 · Silence is an error** | Every tap answers in a blink — a change, a tick, a message. A screen that says nothing after an action is a screen reporting a failure. |

> **THE TWO-MINUTE RULE:** a new employee opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong — not the employee. Steps on the screen ("1 · Set up your team, 2 · Add your first client…") beat any manual you will ever write.

## 05 · What Never to Do

- **Never let Claude invent the design.** No pictures attached means the internet's average delivered. Every new screen starts from your mood board direction, not from a blank prompt.
- **Never write design prompts with a tool that has no design taste.** A generic chatbot prompt will clutter your interface, and cleaning a cluttered system costs days. The design direction comes from the mood-board chat and nowhere else.
- **Never feed your blueprint back to an AI for "critical analysis."** Ask any AI to find gaps in any document and it will manufacture gaps — even in the best system ever written. Read the blueprint yourself; discuss real gaps with a person.
- **Never confuse starting with finishing.** Anyone can begin a build excited. The builder who carries it to the end — screen by screen, checkpoint by checkpoint — is the one whose team actually gets a system. Abandoning a half-built system is an axe to your own foot.

> **THE GATE:** you have a mood board of 10+ real designs; the strongest model chose the winner and you agreed; the design .md sits in your repo next to the blueprint; every screen passes the five laws and the two-minute rule; and one honest colleague has opened the app and not asked a single "what is this?" Then the design is done — and it stays done, because the direction is written down.

---

*Written for builders on the fixed stack: Claude Code, Next.js, Supabase, Vercel, GitHub. The features come from your Build Sheet; the face comes from your mood board. Show, then build.*

*BuildOur AI · UI Guide · DWG NO. BOA-2026-UI · REV A*
