Buildour AI · Kokan NirvanaApprovals and Setup · Rev A

# MARKETING AND CALLING APPROVALS AND SETUP

Prepared for **Shubham Manjunath Anvekar**. Everything **you and your team** must open, verify and get approved so the OS can run your ads, social pages and call review. Start these **this week**: some take weeks.

Meta–– Google Ads–– LinkedIn,  
YouTube–– Calling–– Images,  
video–– Costs

|                                                                                                                                                                                                                                                                      |                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| What this isA to-do list for people, not for Claude. Claude Code cannot verify your business with Meta or Google for you: these are forms and documents in your name. As each approval arrives, the Marketing Module (the companion document) is built on top of it. |                                                                                                             |
| Who does itYou, or your marketing head with your business documents. Every account is on the business email and owned by Bhamchik Group, never by an agency or a staff member’s personal account.                                                                    | CompanionKokan Nirvana Marketing Module: Build Addendum, which you attach to your Claude Code MAIN session. |

Never paste a token, password or key into a chat. Each one goes only where these steps say

00

THE TWO RULES BEFORE ANYTHING ELSE

Agreed with you

**SALES FIRST, MARKETING ON TOP.** More ads mean more leads. If the lead flow is not automated yet, those leads land on the same manual phone calls. So the Marketing Module starts after Phase 1 (the lead flow) is live. The approvals below start **now**, so they are ready by then.

**THE MONEY RULE.** The AI may create campaigns, write ads, post content, watch results every day, suggest changes, and **pause** a badly performing ad. Any new spend or budget increase waits for your approval, and the system can never spend above a **monthly cap you set**, written into the code. This is your own blueprint rule: price or any financial decision stays with a person.

| Approval                                   | Who                   | Usual wait            | Needed for             |
|--------------------------------------------|-----------------------|-----------------------|------------------------|
| Meta Business verification + developer app | You                   | Days to 2 weeks       | Ads, posting           |
| Google Ads developer token (Basic Access)  | You or marketing head | Days to a few weeks   | Google Ads             |
| LinkedIn Community Management API          | Marketing head        | Weeks; can be refused | LinkedIn posts         |
| YouTube upload audit                       | Marketing head        | Weeks                 | Public YouTube uploads |
| Cloud calling number with recording        | You                   | Days (KYC)            | Call review            |

01

META: FACEBOOK, INSTAGRAM, ADS

Start first · quickest · most important

M1

**One Business Portfolio owns everything.** Go to **business.facebook.com** and open (or create) the **Bhamchik Group** portfolio. Under **Settings → Accounts** make sure it owns: the **Facebook page**, the **Instagram account** (switched to a Professional account and linked to the page), the **ad account**, and the **WhatsApp Business account**. If any of them sits in an agency’s or a staff member’s portfolio, request ownership now.

M2

**Verify the business.** In the portfolio: **Settings → Business info** (or **Security Centre**) → **Start verification**. Use the legal name and address exactly as on your GST certificate or company registration; upload that document; confirm by phone, email or domain. Meta usually answers in a few days, sometimes two weeks. If you already verified for WhatsApp, this step is done.

M3

**Verify your website domain.** **Settings → Brand safety → Domains → Add** your landing page domain, and follow the method Meta shows (a line added to the website or to the domain’s DNS). Your website person, or Claude Code, can do the technical part.

M4

**A privacy policy page.** Meta requires one for the app. Ask your MAIN session: `Add a public privacy policy page to the OS for Kokan Nirvana and give me its address.` Have it read by whoever handles your legal matters.

M5

**The Meta developer app.** Go to **developers.facebook.com**, log in with the Facebook account that is admin of the portfolio, and register as a developer. **My Apps → Create app**, choose the **Business** type, name it `Kokan Nirvana OS`, and connect it to the Bhamchik Group portfolio. Add the privacy policy address under **App settings → Basic**. Add the products the builder session asks for (usually **Marketing API**, **Facebook Login for Business** and **Instagram**).

M6

**A system user and its token.** Back in the portfolio: **Settings → Users → System users → Add**, name it `kokan-nirvana-os`, role **Admin**. **Assign assets**: the ad account, the page and the Instagram account, with full control. Then **Generate token** for the Kokan Nirvana OS app, ticking the permissions the builder session lists (typically `ads_management`, `ads_read`, `business_management`, `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `leads_retrieval`). Copy the token straight into n8n’s credentials and Vercel, where the session tells you. Never into a chat.

M7

**Access level and App Review.** For your own ad account and pages, the app usually works at its standard access level once it has made some successful calls. If Meta asks for **App Review** or **Advanced Access** for a permission, the builder session prepares the screen recording and the written explanation with you; you submit it in the developer dashboard. Allow one to two weeks.

Use Claude with Meta today, while you wait

Claude has a **Meta Ads connector** (in the Claude app: **Settings → Connectors**). Your marketing head can connect it with their own Facebook login and ask Claude in a chat to review campaigns, draft ads and set them up, approving each step. This is what was shown on the call; the OS later does the same on a schedule, from one dashboard.

Real estate ad rules

Meta has extra rules for property ads in some countries (a special ad category for housing, with limits on targeting). If Ads Manager asks for it, select it. The OS follows whatever Ads Manager requires; it never tries to work around an ad policy.

02

GOOGLE ADS

Apply this week · build last

G1

**A manager account.** At **ads.google.com**, create a **Google Ads Manager account** on the business email and link your existing Google Ads account to it (**Accounts → Sub-account settings → Link existing account**; accept the request in the ad account).

G2

**Apply for the developer token.** In the manager account: **Admin → API Center**. Fill the form: company name, website, a business contact email that you read, and what the tool does (“an internal tool for Bhamchik Group to create and report on our own campaigns”). You first get a token with **test access**; then apply for **Basic Access** from the same page. Google may email questions or ask for a short description of the tool; the builder session writes it with you. Allow days to a few weeks.

G3

**A Google Cloud project.** At **console.cloud.google.com**, create a project `kokan-nirvana-os`, enable the **Google Ads API**, and set up the **OAuth consent screen** and a **client ID**. The builder session walks you through each click when it reaches Google Ads. The developer token and client secret go only into n8n and Vercel.

03

LINKEDIN, YOUTUBE, X

One by one, as each approves

| Platform        | What to do                                                                                                                                                                                             | Honest note                                                                                                                                                                            |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **LinkedIn**    | At **linkedin.com/developers**, create an app linked to the Bhamchik Group company page, verify it from the page, and request the **Community Management API** product. Fill the form as the business. | Reviewed by LinkedIn; can take weeks and is sometimes refused for small companies. Until then, the OS drafts LinkedIn posts and your team posts them.                                  |
| **YouTube**     | In the same Google Cloud project, enable **YouTube Data API v3**. Uploading needs your channel’s permission on the consent screen.                                                                     | Until Google completes an **API compliance audit**, videos uploaded by the OS stay **private**. Apply for the audit early; until it passes, the team makes them public with one click. |
| **X (Twitter)** | Not recommended now.                                                                                                                                                                                   | X charges a monthly fee for posting by API. Post by hand if you use it.                                                                                                                |

04

CALL REVIEW: THE EXACT PROCEDURE

Your phase 2 · month 4 onward

What it does: each sales call is recorded, turned into text (including Hindi and Marathi), summarised onto the customer’s record, and checked against your sales script, with a weekly report to you. Claude reads and reviews the text; turning the audio into text needs a speech-to-text service, because Claude does not listen to audio.

C1

**Choose a cloud calling service.** Compare two or three Indian cloud telephony providers (business virtual numbers with an app for staff). Ask each: Is **call recording** included? Can recordings be sent automatically to our system (an **API or webhook**)? Do staff call from a mobile app with the business number showing? Price per user and per minute? Pick one; complete its KYC with your GST and company documents.

C2

**Move sales calls onto it.** Give each salesperson a login on the calling app. From the go-live date, every sales call to or from a lead goes through the business number, not a personal phone. Put this number on Meta ads, the landing page and the WhatsApp profile.

C3

**Tell customers calls are recorded.** Set a short recorded line at the start of calls (“This call may be recorded for quality”), and add it to the privacy policy. India’s data protection law asks you to be open about how personal data is used; have your legal adviser check the wording.

C4

**Choose the speech-to-text service.** The builder session lists two or three services that handle Hindi, Marathi and English mixed in one call, with price per minute. Test each on five real recordings; pick the one whose text your sales manager can read without confusion.

C5

**Connect and pilot.** The builder session connects the calling service to the OS through n8n: recording arrives → text → Claude summary and score → saved on the lead’s record. Run it on **20 calls**; your sales manager checks every summary and score. Fix the scoring rules with Claude until they agree with your sales manager.

C6

**Switch on for all calls,** with the weekly report (best calls, weakest calls, common questions, missed follow-ups) to you and the sales manager. Scores coach people; they are never used alone to judge a person’s job.

05

IMAGES AND VIDEOS

Your team makes them, the OS helps

Claude writes the words: ad copy, captions, scripts, greetings. It does not make photos or videos. The simplest way, and what we recommend: **your marketing team keeps making the visuals in the tools they already use (ChatGPT, Claude, Canva), and the OS does the rest around them.**

| The OS does                             | How it helps your team                                                                                                                                                                  |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Brand kit**                           | Your logo, colours, fonts and do’s and don’ts stored once, shown on every brief.                                                                                                        |
| **Creative brief for every post or ad** | The headline, text, size (post, story, reel), which property photos to use, and a **ready-to-paste prompt** for ChatGPT, Canva or Claude, so the team does not start from a blank page. |
| **Ready-made greetings**                | Festival and occasion greetings made automatically from your branded templates and your own property photos: no design tool needed for these.                                           |
| **Asset library**                       | The team uploads the finished image or video to the post; the OS keeps every version against the property and campaign.                                                                 |
| **Approve, then publish**               | One tap to approve; the OS posts or attaches it to the ad, and later shows which creative brought leads and visits.                                                                     |

If you later want AI-made videos (a presenter walking through a property, for example), add an AI video tool: roughly \$20 to \$100 a month depending on the tool. Not needed to start.

06

WHAT IT ADDS TO YOUR BILL

Estimates, before GST

| Item                                             | About                                                                      |
|--------------------------------------------------|----------------------------------------------------------------------------|
| Meta, Google Ads, LinkedIn, YouTube connections  | **Free**. Ad spend stays as it is today, inside your monthly cap.          |
| AI writing and the marketing agents (Claude API) | A few hundred to a couple of thousand rupees a month                       |
| AI image or video tool (optional)                | \$20 to \$100 a month; or your team’s existing ChatGPT, Claude or Canva    |
| n8n, more scheduled jobs                         | Possibly the Pro plan: about €60 a month instead of €24                    |
| Cloud calling service                            | The provider’s plan, per user and per minute                               |
| Speech-to-text for call review                   | Roughly ₹0.50 to ₹2 a minute of calls (estimate; check the chosen service) |
| Claude review of each call                       | A few rupees a call                                                        |

07

YOUR CHECKLIST

Tick as you go

- Meta: all assets in the Bhamchik Group portfolio (M1)
- Meta: business verified (M2) and domain verified (M3)
- Privacy policy page live (M4) · Meta developer app (M5) · system user (M6)
- Monthly ad spend cap decided: ₹\_\_\_\_\_\_ (Meta) · ₹\_\_\_\_\_\_ (Google)
- Who approves campaigns: \_\_\_\_\_\_\_\_\_\_\_\_\_\_ (you only, or you and the marketing head)
- Google Ads manager account and developer token (G1, G2) · LinkedIn API and YouTube audit applied (03)
- Marketing team names, emails and roles sent to the MAIN session for logins
- Cloud calling service chosen (C1), only when you start phase 2

Companion to blueprint BOA-2026-BHA-01 Rev B and the Marketing Module Build Addendum · platform screens change: follow what each shows on the day.
