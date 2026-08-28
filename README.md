# BuildOur AI · Master Documents

The master guides and the blueprint-writing skill, in one place.

## Contents

- **Builder Guides 00 to 04** · the student-facing build series (each as .md, .html and .pdf):
  00 Start Guide, Day 1 Setup · 01 Pick Your First System · 02 The Build Sheet · 03 The Six House Rules · 04 Test, Trust, Then Turn It On
- **The UI Guide - Design What You Show**
- **Master Copy - Creating the AI Systems Blueprint** · the internal SOP behind every client blueprint
- **`.claude/skills/ai-systems-blueprint/`** · the Claude Code skill that writes client blueprints

## Using the skill

Install it into your personal skills folder so it works inside every client repository:

```
cp -r "masterdocuments/.claude/skills/ai-systems-blueprint" ~/.claude/skills/
```

Then, in any client repo, type `/ai-systems-blueprint` or simply ask for that client's blueprint. This repository stays the single source of truth: after `git pull`, re-run the copy above to take the latest version.

## Start here

New developer? Read **HOW-TO.md**: installing the skill, writing a client blueprint, and which guide to send a client when.
