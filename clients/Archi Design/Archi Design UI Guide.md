Buildour AI · Archi DesignUI Guide · Rev A

# ARCHI DESIGN OS UI GUIDE

Prepared for **Mahesh R. Khandagale**. Claude builds what you say, but it **designs what you show it**. How to choose the look once, and check **every screen** so your team opens the OS instead of calling you.

Mood  
board–– Choose–– Hand to  
Claude–– Screens per  
system–– Check every  
screen

|                                                                                                                                                                                                   |                                                                                            |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| When to use itSections 01 and 02 once, in Step 3 of the Starter Guide, before the first real screen. Sections 03 to 06 every time a builder session shows you a new screen.                       |                                                                                            |
| Why it matters for youA designer who has to scroll, or a site engineer who has to type in the sun, will go back to WhatsApp. Then the Task Sheet is empty, and every board after it is empty too. | You needPinterest in a browser · the Claude app (Chat) · your MAIN session in Claude Code. |

Nobody will tell you the design is wrong. Your team will just quietly stop opening the app.

01

CHOOSE THE LOOK

Ten minutes · once

Ask Claude to “build my system” and say nothing about looks, and you get the average of every app on the internet: crowded, generic, and ignored. You are an architect: you would never let a contractor choose the finishes. Choose the look of your own office system the same way.

1

**Collect.** On **pinterest.com** search `minimalist UI design web app` and `task app mobile clean`. Download 10 to 15 screens your team would understand at a glance. Skip anything crowded, dark or clever.

2

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the model list, attach all the screenshots and paste the chooser prompt below.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: Archi Design, a seven-person architecture and interior design practice. My designers use the screens on a laptop in the office; my site engineers use them on basic Android phones on site, often outdoors and with poor network; I use them on my phone to see which projects and people need me, and to approve drawings. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that the team cannot understand them; here we want the opposite, an interface that feels friendly rather than complex, matched to how my team actually learns. Give me the best one to move ahead with.

3

**Read the verdict.** It names a winner, what to borrow from the runner-up, and what to avoid. Check it against your own eye: you have better taste than any model; the model is there to check readability, not to overrule you.

4

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Download the .md file.

**IF THE DIRECTION COMES BACK TOO NARROW** (“a task manager”), correct it in one line: *“This is not only a task list. It is the operating system of Archi Design: tasks, sites, drawings, people and projects, everything.”*

02

HAND IT TO CLAUDE CODE

Once · MAIN session

Save the winning images and the .md file in `docs/design/` inside your `archi-design-os` folder, then paste this into MAIN:

Paste · MAIN · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and the UI Guide in docs/. Tell me in five lines what the look is and how every screen will follow it. Then add a line to CLAUDE.md saying every screen in every session follows docs/design and sections 03 to 05 of the UI Guide, and build one sample screen, my phone’s home screen with today’s tasks, using dummy data, so I can see the look on my phone before any system is built. Wait for my OK.

03

YOUR SCREENS, ONE QUESTION EACH

What every builder session must design

Software is not a set of screens; it is a set of conversations. Each person arrives with one question, the screen answers it, and they do one thing. These are the main screens your blueprint needs.

| System                  | Screen and its one question                                                      | One main button       | Who, on what                      |
|-------------------------|----------------------------------------------------------------------------------|-----------------------|-----------------------------------|
| SYS-02 Daily Task Sheet | **My day:** “what do I do today, and by when?”                                   | Done (with proof)     | All 7, on their phone             |
| SYS-02 Daily Task Sheet | **Not done:** “why is this not finished?” (pick from the short list)             | Save reason           | All 7, phone                      |
| SYS-03 Site Diary       | **Today on site:** “what happened at this site today?” (photos first, few words) | Send report           | Site engineers, Android, outdoors |
| SYS-04 Drawing Release  | **Ready for site:** “is this drawing complete by the SOP?”                       | Send for approval     | Designers, laptop                 |
| SYS-04 Drawing Release  | **Approval queue:** “which drawing waits for my sign-off?”                       | Approve for Execution | You, phone or laptop              |
| SYS-05 Ownership Board  | **Who holds the chain:** “which project and person needs me?” RED first          | Open the red item     | You, phone                        |
| SYS-06 Nudge            | **Reminder:** “which task is overdue, and what proof is needed?”                 | Mark done             | Task owner, phone                 |
| SYS-07 Nandini          | **Evening summary:** “how did today go, and what needs my decision?”             | Decide                | You, phone                        |
| SYS-08 Scorecard        | **This month:** “how did each person do, in the standard format?”                | Sign scorecard        | You, laptop                       |

04

ARCHI DESIGN SCREEN RULES

Specific to your office and sites

- **Site-proof first.** Site engineers’ screens work on a basic Android phone, one-handed, in sunlight: big buttons, high contrast, large text, no tiny icons.
- **Photo before words.** The camera opens in one tap; a photo with the project and date stamped on it counts as proof. Typing is the last resort.
- **Works with no network.** The Site Diary saves on the phone and sends itself when signal returns, and says so on screen (“saved, will send”).
- **Proof in one tap.** “Done” asks only for the proof that task type needs (file link, photo or note), already chosen.
- **Red, amber, green mean only one thing:** late, at risk, on track. Never decoration. Red items always sit at the top.
- **Your screens show exceptions only.** What is red, what waits for your signature, who is overloaded. Not everything that went fine.
- **No money on staff screens.** No incentive, deduction or cost figure appears to any employee until you sign it.
- **Their language.** If your site engineers read Marathi or Hindi more easily than English, tell Claude: labels can be shown in the language each person chooses.

05

CHECK EVERY SCREEN

Before you say OK to a builder session

| The five screen laws                 | What to check                                                                                             |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the person must see first is the biggest, boldest thing on the screen.                      |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                            |
| **3 · Consistency is trust**         | The same thing looks the same on every screen: a task, a project, a red flag.                             |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the project, the stage, the person. |
| **5 · Silence is an error**          | Every tap answers at once with a change, a tick or a message.                                             |

**THE TWO-MINUTE RULE:** a new employee opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the employee. The real test: hand the phone to one site engineer and watch, without helping.

Paste · any builder session · review a screen

Check this screen against the UI Guide’s sections 03 to 05 and docs/design. List anything that breaks a law or a rule, in simple words, and propose the fix. Do not change features.

Paste · any session · change only the look

Change only the design of this screen, following docs/design: colours, size, spacing, placement. Do not touch the features or the data. Show me before and after on my phone.

06

WHAT NEVER TO DO

And when the design is done

- **Never let Claude invent the look.** No pictures means the internet’s average. Every new system starts from docs/design.
- **Never add a screen “because it might be useful”.** Every screen answers one question from section 03 or it does not exist.
- **Never ask an AI to “find gaps” in your blueprint.** It will manufacture them. Read it yourself; bring real gaps to Romana.
- **Never launch to all 7 by announcement.** Give each new screen to the one person who feels the old pain most; their relief recruits the others.

**THE GATE:** docs/design holds your chosen look; CLAUDE.md says every screen follows it; every screen passes the five laws and the two-minute rule; and one site engineer and one designer have used the Task Sheet without asking a single “what is this?”. Then the design is done, and it stays done, because it is written down.

Prepared for Mahesh R. Khandagale · Archi Design · condensed from the BuildOur UI Guide (BOA-2026-UI) against blueprint BOA-2026-ARC-01 Rev A.  
The features come from your blueprint; the face comes from your mood board. Show, then build.
