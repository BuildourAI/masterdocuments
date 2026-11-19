Buildour AI · LX IT SolutionUI Guide · Rev A

# LX OS UI GUIDE

Prepared for **Lalitesh Sharma**. Claude builds what you say, but it **designs what you show it**. How to choose the look once, and check **every screen** so your manager opens the board instead of the WhatsApp scroll.

Mood  
board–– Choose–– Hand to  
HQ–– Screens per  
system–– Check every  
screen

|                                                                                                                                                                                                                                              |                                                                                          |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| When to use itSections 01 and 02 once, in Step 6 of the Starter Guide, before the first real screen. Sections 03 to 06 every time a session shows you a new screen. This guide lives in `docs/` with the blueprint and the other two guides. |                                                                                          |
| Why it matters for youYour manager answers 300 orders a month from WhatsApp and Google Sheets. If the Key Board is slower than the sheet, the sheet wins, and your phone keeps ringing.                                                      | You needPinterest in a browser · the Claude app (Chat) · your HQ session in Claude Code. |

Nobody will tell you the design is wrong. Your team will just quietly go back to the sheet.

01

CHOOSE THE LOOK

Ten minutes · once

Ask Claude to “build my system” and say nothing about looks, and you get the average of every app on the internet: crowded, generic, and ignored. Your customers already know you by quick, clear WhatsApp replies. The app should feel the same: fast, plain, one thing at a time.

1

**Collect.** On **pinterest.com** search `minimalist UI design web app`, `inventory dashboard clean` and `order tracking app mobile`. Download 10 to 15 screens your manager and assistant would understand at a glance. Skip anything crowded, dark or clever.

2

**Let the strongest model choose.** Open the **Claude app**, choose **Chat** (not Code), pick the strongest model in the model list, attach all the screenshots and paste the chooser prompt.

Paste · Claude app chat · the chooser prompt

I have shared some powerful, minimal UI designs with you. I am building the interface for my company: LX IT Solution, which sells computer software licenses (antivirus, graphic, accounting, operating system, Office) to repeat customers who order on WhatsApp and phone. My manager and assistant use the screens on an office computer all day to load keys, see stock brand by brand and track 300 orders a month; I use them on my phone to approve held orders and price questions; later my customers will log in on their phones to get keys, invoices and Microsoft cid. Research and analyse all of these designs and tell me which one I should choose. The design must be one my team and my customers can understand very easily: self-explanatory, needing almost no training. Often interfaces get so complicated that people cannot understand them; here we want the opposite, an interface that feels friendly rather than complex. Give me the best one to move ahead with.

3

**Read the verdict** against your own eye. The model checks readability; it does not overrule your taste.

4

**Get it in writing.** Upload only the winning one or two designs again and ask: *“I have uploaded the chosen designs. Give me a detailed prompt as a markdown (.md) file that I can put into Claude Code along with these images.”* Download the .md file.

**IF THE DIRECTION COMES BACK TOO NARROW** (“a key inventory tool”), correct it in one line: *“This is not only key stock. It is the operating system of LX IT Solution: keys, orders, Tally invoices, cid and later the customer app, everything.”*

02

HAND IT TO HQ

Once

Make a folder `docs/design` inside `lx-os`. Save the winning images and the .md file in it, then paste this into your `HQ` session:

Paste · HQ · set the look for every session

The design direction is in docs/design: the chosen images and the design .md file. Read them and the UI Guide in docs/. Tell me in five lines what the look is. Then add to CLAUDE.md that every screen in every session follows docs/design and sections 03 to 05 of the UI Guide, and build one sample screen, the Key Board with dummy brands and masked keys, so I can see the look on my computer and my phone before any system is built. Wait for my OK.

03

YOUR SCREENS, ONE QUESTION EACH

What every session must design

Each person arrives with one question; the screen answers it, and they do one thing. These are the main screens your blueprint needs.

| System                  | Screen and its one question                                                               | One main button | Who, on what      |
|-------------------------|-------------------------------------------------------------------------------------------|-----------------|-------------------|
| SYS-01 Key Loader       | **Load keys:** “which keys came in from the distributor, and are any duplicates?”         | Add to register | Manager, computer |
| SYS-01 Key Loader       | **Next key:** “which key goes to this customer for this invoice?”                         | Mark sold       | Manager, computer |
| SYS-02 Key Board        | **Stock:** “how many unused keys of each brand, and what is running low?”                 | Download unused | Manager; you      |
| SYS-02 Key Board        | **Red list:** “which key has no invoice, which invoice has no key, what went twice?”      | Fix this row    | Manager           |
| SYS-03 Key Dispatch     | **Waiting to send:** “which keys stopped, and why?”                                       | Send            | Manager; you      |
| SYS-05 Getcid link      | **Cid requests:** “which cid is done, which failed on a blurred photo?”                   | Ask again       | Manager           |
| SYS-07 Order Flow Board | **Today’s orders:** “where is every order: new, delivered, invoiced, couriered, on hold?” | Open order      | Manager, 9 AM     |
| SYS-07 On hold          | **Waiting for me:** “which orders need my price or my credit yes, and since when?”        | Approve / quote | You, phone        |
| Later: Customer app     | **My account:** “where is my key, my invoice, my courier, my cid?”                        | Order / get cid | Customer, phone   |

04

LX SCREEN RULES

Specific to your business

- **Keys are stock, so keys are masked.** The board shows `XXXXX-XXXXX-7K2QD`; the full key appears only for the person sending it, with one tap, and that tap is logged.
- **Brand first.** Every list is grouped by brand and product the way your team already thinks: Quick Heal, Microsoft Office, Tally, CorelDRAW…
- **Faster than the sheet.** Search answers as you type a customer, brand or invoice number. If finding a key takes longer than in Google Sheets, the screen is wrong.
- **Red, amber, green mean only one thing:** problem, waiting, done. Red rows always sit at the top.
- **Your screens show exceptions only.** On your phone: orders on hold, price questions, the reorder list. Not the orders that went fine.
- **No price on a staff screen** except from the price list you approved; credit limits are visible and editable by you alone.
- **Customer words in Hinglish.** Every message preview shows the LX tone: short, brand first, one ask, the way customers already read you on WhatsApp.
- **Photos count.** Key photos and cid installation-id photos open large, with a clear “readable / blurred” mark.

05

CHECK EVERY SCREEN

Before you say OK

| The five screen laws                 | What to check                                                                                           |
|--------------------------------------|---------------------------------------------------------------------------------------------------------|
| **1 · Nobody reads, everyone scans** | The one thing the person must see first is the biggest, boldest thing on the screen.                    |
| **2 · One screen, one job**          | One main button, visible without scrolling, in the one colour kept for action.                          |
| **3 · Consistency is trust**         | The same thing looks the same on every screen: a key, an order, a customer, a red row.                  |
| **4 · The default is the decision**  | What is filled in again and again is already filled in: today’s date, the brand, the oldest unused key. |
| **5 · Silence is an error**          | Every tap answers at once: “sent at 10:42”, “marked sold”, “stopped: no invoice”.                       |

**THE TWO-MINUTE RULE:** your assistant opens any screen and understands what it is and what to do in under two minutes, with no training. If a screen needs explaining, the screen is wrong, not the person. The real test: hand it to your assistant and watch, without helping.

Paste · any session · review a screen

Check this screen against sections 03 to 05 of the UI Guide and docs/design. List anything that breaks a law or a rule, in simple words, and propose the fix. Do not change features.

Paste · any session · change only the look

Change only the design of this screen, following docs/design: colours, size, spacing, placement. Do not touch the features or the data. Show me before and after.

06

WHAT NEVER TO DO

And when the design is done

- **Never let Claude invent the look.** No pictures means the internet’s average. Every new system starts from docs/design.
- **Never add a screen “because it might be useful”.** Every screen answers one question from section 03, or it does not exist.
- **Never show a full key on a list.** Masked on every board; full only to the sender, logged.
- **Never launch by announcement.** Give the Key Board to your manager first, the person who feels the sheet’s pain most; customers get their app only after the team trusts the board.

**THE GATE:** docs/design holds your chosen look; CLAUDE.md says every screen follows it; every screen passes the five laws and the two-minute rule; and your manager has run one full morning from the Key Board without opening the Google Sheet. Then the design is done, and it stays done, because it is written down.

Prepared for Lalitesh Sharma · LX IT Solution · condensed from the BuildOur UI Guide against blueprint BOA-2026-LXI-01 Rev A.  
The features come from your blueprint; the face comes from your mood board. Show, then build.
