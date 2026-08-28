# How To: Blueprints and Guides

For developers at BuildOur AI. Two jobs are covered here: writing a client's AI Systems Blueprint with the skill, and sending the Builder Guides to the clients who build their own systems.

---

## 1. One-time setup on your machine

**Install Claude Code** and sign in with the BuildOur AI Claude account.

**Clone this repository:**

```bash
git clone git@github.com:BuildourAI/masterdocuments.git
```

**Install the blueprint skill into your personal skills folder.** This is the important step. It makes the skill available in *every* folder on your machine, including each client repo you will work in:

```bash
cp -r "masterdocuments/.claude/skills/ai-systems-blueprint" ~/.claude/skills/
```

On Windows the destination is `C:\Users\<you>\.claude\skills\`.

**Keeping it current.** This repository is the single source of truth for the skill. When it is improved, pull and re-copy:

```bash
git -C masterdocuments pull && cp -r "masterdocuments/.claude/skills/ai-systems-blueprint" ~/.claude/skills/
```

Do this at the start of any week you are writing blueprints. It takes two seconds and guarantees every developer produces documents in the same current format.

**You also need:** Chrome or Edge installed (the skill renders the PDF through it) and Python.

---

## 2. Writing a client's blueprint

Clients are allotted to developers. You create and own the repository for each client allotted to you.

### Step 1 · Create the client repository

Create a **private** repository under the BuildourAI organisation, named after the client in lowercase with no spaces or punctuation, matching the existing pattern (for example, a client named Mohammed Safiyullah becomes `mohammedsafiyullah`). Clone it:

```bash
git clone git@github.com:BuildourAI/<clientrepo>.git
```

### Step 2 · Put both inputs in the folder

The blueprint needs **both** of these, every time:

- the filled audit form (the client's Systems Brief export)
- the audit call transcript (the VTT file)

Name them after the client and date them, for example `Client Name Systems Brief.md` and `Client Name Audit Call 2026-08-15.vtt`. Any extra material the client supplied (price sheets, specs, screenshots, a document they wrote) goes in the same folder; the skill treats those as governing sources and will cite them.

### Step 3 · Run the skill

Start Claude Code **inside the client repo folder**, then:

> `/ai-systems-blueprint` for this client. The systems brief and the audit call VTT are in this folder.

You can also simply ask for the client's blueprint without the slash command; the skill recognises the request.

**Expect a working session, not a button press.** The skill checks the inputs, cleans the transcript, reads everything, designs the systems, sequences the phases, typesets and renders. Stay at the keyboard and answer its questions.

**If one input is missing, the skill will refuse to write a blueprint.** That is deliberate, not a fault. The form gives precise figures with no explanation; the call gives the stories and the client's own words with no table. A document built on half of that will not survive contact with the client. Get the missing input, or ask the skill for call-preparation notes instead.

### Step 4 · Review before you deliver

The skill deliberately **flags** problems rather than fixing them. A headcount that does not match the function split, an average order value typed as one long number, a month answered as "6": each becomes a numbered confirm item. Check they are all there, check no client quote was tidied up or translated, and run the quality gate the skill carries. Never silently correct a client's number; the correct value is theirs to supply.

### Step 5 · Push to the client repository

```bash
git add -A
git commit -m "Add AI Systems Blueprint"
git push
```

The client repo should end up holding: the audit form, the VTT, the cleaned transcript, and the blueprint as `.md`, `.html` and `.pdf`.

### Revisions

When a client comes back with corrections that materially change the document, the skill produces a **Rev B** carrying a supersede note. Commit the archived Rev A alongside it. Do not overwrite or delete the earlier version: the client's folder should show its own history without anyone reading the git log.

---

## 3. Sending the Builder Guides to clients

Clients who build their own systems receive the Builder Guides as PDFs, one at a time as they reach each stage. Send only the `.pdf`; the `.md` and `.html` are our sources.

| Send when | Guide |
|---|---|
| Blueprint finalised and accepted | **00 · Start Guide, Day 1 Setup** (send **03 · The Six House Rules** with it, since Day 1 Step 4 pastes those rules into CLAUDE.md) |
| Their app is live on their phone | **01 · Pick Your First System** |
| Their First Build Card is filled | **02 · The Build Sheet** |
| Month one's four weeks are done | **04 · Test, Trust, Then Turn It On** |

Also available: **The UI Guide, Design What You Show.**

Pull this repository before sending so you are always sending the current revision. Each guide carries a drawing number and revision on its cover, so you can always tell which version a client is holding.

---

## 4. Notes

- **The Claude account is shared,** so usage limits are shared. If two developers run blueprints at the same time, both sessions draw from the same pool.
- **Client repositories are private.** They hold audit calls and business figures.
- **This repository holds masters only:** the guides, the blueprint master copy, and the skill. Client work never lives here.
