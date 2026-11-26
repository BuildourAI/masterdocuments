# GrowSafe Change Kit

Save this file as `docs/CHANGE-KIT.md` in your GrowSafe-OS folder. It has four prompts for **HQ**. Paste the one you need.

| When | Use |
|---|---|
| BuildOur sends you new versions of the documents | Prompt 1 |
| Your plan changes (a new priority, an order swapped, a rule changed) | Prompt 2 |
| You want the full, up-to-date plan in one place | Prompt 3 |
| The change is big (a new system, phases re-planned, a guardrail changed) | Prompt 4, then Prompt 1 when the new documents arrive |

**The one rule:** the PDFs from BuildOur are never edited. Your changes live in `docs/PLAN-CHANGES.md` and `docs/changes/`. Where the two differ, the latest change wins.

---

## Prompt 1 · New documents from BuildOur

First put the new files in `docs/`, keeping their names. Leave the old ones there too; HQ moves them.

```
BuildOur has sent new versions of my documents. They are in docs/ now: [list the file names].
1. Move each old version to docs/archive/ with its date in the name.
2. Read the new versions fully and tell me in simple words, in 15 lines or fewer, what changed against the old ones, and what that means for what we have already built.
3. Check docs/PLAN-CHANGES.md: tell me which of my own changes the new documents now include, and which still apply.
4. Show me, as a list, every update this needs in CLAUDE.md, docs/START-NOW.md, docs/SESSIONS.md, docs/build-sheets/ and docs/session-prompts/. Change nothing until I say OK; then make the changes, commit them, and tell me which open sessions need a new prompt.
```

## Prompt 2 · My plan has changed

```
PLAN CHANGE: [say it in your own words, as much detail as you have].
1. Write it as docs/changes/[today's date]-[short name].md: what changes, why, what it replaces in the blueprint or guides (section and page), what it needs from me, and its done-when. Add one line for it to docs/PLAN-CHANGES.md (create it if missing, with the rule at the top: "Where these changes differ from the PDFs in docs/, these changes win").
2. Tell me what it affects: the build order, systems already built or in progress, my guardrails, the database, costs and the timeline. If it bends one of my guardrails or a house rule, say so out loud.
3. Show me the updates it needs in docs/START-NOW.md, docs/SESSIONS.md, docs/build-sheets/ and any session prompt. If CLAUDE.md must change, show me the old and new lines.
4. Change nothing until I say OK. Then make the changes, commit, and tell me which session to open or re-prompt next.
```

## Prompt 3 · Show me the current plan

```
Write the current plan in docs/current/, merging the PDFs in docs/ with every change in docs/PLAN-CHANGES.md (the changes win):
- BLUEPRINT-CURRENT.md: every system with what it does, its guardrail and its done-when, in today's build order;
- SETUP-CURRENT.md: the setup from the Starter Guide, each step marked done or not done, checked against this folder, Supabase and Vercel;
- BUILD-CURRENT.md: the Continuation Guide's phases and sessions as they stand now, with what is built, in progress and next;
- PROMPTS-CURRENT.md: the opening prompt of every session we use now.
Date each file at the top and list which changes it includes. Then tell me in 10 lines what is different from the PDFs.
```

## Prompt 4 · A big change: ask BuildOur for new documents

```
Write docs/changes/request-for-buildour-[today's date].md for BuildOur: what I want changed in my blueprint and guides and why, which systems and phases it touches, what is already built, and the questions BuildOur must answer before re-issuing the Blueprint, Starter Guide, Starter Prompt and Continuation Guide. Keep it to one page, in plain words, with no keys or passwords. Show it to me; I will send it to Romana.
```

---

## Your first change: payment reminders first

Paste this as Prompt 2 if it matches what you want:

```
PLAN CHANGE: our first goal is sales team productivity, so payment reminders come first. Bring the Collection Reminder Flow forward from months 4 to 12 into P2, beside Field Force, as SYS-02B Collection Desk.
Stage A, as soon as Tally data is in (no WhatsApp API needed): each salesperson sees their own dealers (by the Tally groups assigned to them), sorted by overdue amount, with bills, due dates and days overdue from the Tally Bridge (v_dealer_outstanding and tally_outstanding). For each dealer the app drafts a payment reminder from my Rulebook terms (overdue status, early-payment discount, late interest) in the dealer's language; the salesperson sends it with one tap on WhatsApp from their phone, and the app records who sent what and when. I see a daily collection scorecard per salesperson: reminders sent, amounts collected, overdue going down.
Stage B, once Meta approves my WhatsApp Business number and templates: the same reminders go out automatically on the schedule I set, as my guardrail allows; anything about waiving interest or write-offs still comes to me.
Amounts only ever come from Tally; nothing is typed in.
Until BuildOur sends the tested Tally Bridge code, build the Stage A screens on clearly marked sample data, in exactly the shape the Bridge will give: per dealer (dealer, dealer_group, mobile, email, credit_days, outstanding, overdue, max_overdue_days, overdue_bills, salespeople) and per bill (party, bill_ref, bill_date, due_date, amount, is_advance). Do not create any tally_* tables or Tally sync yourself; when the Bridge code arrives, the screens switch to its view v_dealer_outstanding and table tally_outstanding.
```

**What HQ will ask you for:** the credit days, early-payment discount and late interest rules (your Rulebook); the wording you want, in each language; which Tally groups belong to which salesperson; and, for Stage B, a WhatsApp Business number. Meta verification and template approval take time, so start that now.
