---
name: cowork-setup
description: "Sets up Claude Cowork properly and builds the three ABOUT ME files by interview instead of leaving the user to write them. Covers folder structure, about-me.md, my-company.md, anti-ai-writing-style.md, global instructions, connectors and per-project setup. Use when someone is setting Cowork up from scratch, is stuck on a step or wants to see how a real project is structured."
---

# Cowork setup

You are helping someone get Claude Cowork working, get unstuck or understand how
it is used on real work. Adapt to which of those it is. Do not deliver the whole
guide to someone who asked one question.

This skill does not only explain the setup. In Mode 1 you build it: create the
folders, interview them and write the files.

## Before you answer, find out where they are

Ask first. Use AskUserQuestion with these options:

- "Setting up from scratch"
- "Started, but stuck on a step"
- "Show me how a real project is structured"
- "I have one specific question"

Then work in the matching mode below. Most of this document will be irrelevant to
any given person, and that is the point.

---

## MODE 1 — Setup from scratch

Five steps. One at a time, wait for confirmation before moving on. Do not paste
all five at once.

Tell them up front what this will cost them: about twenty minutes, most of it
answering questions about themselves. The output is a working folder, not notes.

### Step 1: The folder

They create this one by hand, before you can help. You cannot create the root
folder, because nothing is selected yet.

Ask them to make a folder called `projects` somewhere sensible, drag it into the
Finder or Explorer sidebar so it is one click away, then create `Claude Cowork`
inside it.

Then select `Claude Cowork` in the Cowork app.

Once it is selected, you create the two subfolders yourself:

```
Claude Cowork/
  ABOUT ME/     — who they are, read at the start of every session
  OUTPUTS/      — where work gets saved, one subfolder per project
```

Two folders. Not three. A templates folder sounds useful and then never gets
opened, so leave it out. If they later want reusable material, it lives in the
project folder that produced it.

### Step 2: anti-ai-writing-style.md

Start with this one, because it costs them nothing. Copy
`references/anti-ai-writing-style.md` into `ABOUT ME/` as it is.

It is an opinionated file: a ban on em dashes, a list of words that mark text as
generated, rules on paragraph length and rhythm. It is bilingual, Swedish and
English, and it applies whichever language they write in.

Tell them it is someone else's taste and they should edit it. Then let them read
it later rather than reviewing it line by line now.

### Step 3: about-me.md

Follow `references/about-me-interview.md`. Twelve questions, AskUserQuestion,
one at a time.

The follow-ups are where the value is. A file compiled from twelve unchallenged
answers is worse than one built from six answers you pushed on. Push when an
answer is vague.

Compile and save to `ABOUT ME/about-me.md`. Under 2,000 tokens.

### Step 4: my-company.md

Follow `references/my-company-interview.md`. Nine questions.

The vocabulary question is the one that pays off. Internal acronyms, project
codenames, tool nicknames. Get at least four.

Compile and save to `ABOUT ME/my-company.md`. Under 2,000 tokens.

**Keep all three files under roughly 6,000 tokens combined.** They are read every
session, so length is a running cost, not a one-off. If one grows too long, trim
it by asking: *"This is my about-me file and I need to save tokens. Ask me
questions about what to cut until it is tight."*

### Step 5: Global instructions

Without this, none of the files you just built get read.

Follow `references/global-instructions.md`. Give them the paste block whole, tell
them where it goes, and run the verification session at the end.

Do not declare setup finished until that test session comes back with a specific
answer about them.

### After setup: connectors

Not part of the five steps, and not urgent. Bring it up once the folder works.

Connectors give Claude access to real tools, under **Settings → Connectors**.
Connect only what is actually needed. Each one is a place data can flow, and an
unused connector is just exposure.

Some need an admin to approve them for the whole organisation, so check that
before promising anyone it will work.

---

## MODE 2 — Stuck on a step

Ask which step. Answer that step only.

| Symptom | Usually |
|---|---|
| Claude ignores ABOUT ME | Global instructions missing, or the folder is not selected in Cowork |
| Claude saves in the wrong place | `OUTPUTS/` does not exist, or the global instructions never mention it |
| Claude has no project context | The project folder has no `CLAUDE.md`, or it was not selected this session |
| Answers feel generic | ABOUT ME is too long and is being skimmed, so trim it |
| Writing still sounds generated | `anti-ai-writing-style.md` is in the folder but not named in the global instructions list |
| A connector will not connect | Often needs organisation-level approval, not a personal fix |

---

## MODE 3 — How a real project is structured

Every project gets its own folder under `OUTPUTS/`, and every project folder gets
a `CLAUDE.md`.

```
OUTPUTS/
  client-project/
    CLAUDE.md              ← project memory, read every session
    PLAN.md                ← the plan, updated as things move
    01-research/
    02-interviews/
    03-synthesis/
    04-deliverables/
```

Numbered subfolders because they are phases, and the order is information.

### What goes in a project CLAUDE.md

`CLAUDE.md` is the reason you stop re-explaining the background every session:

- What the project is, and what has to be delivered
- Who the client or stakeholder is, and their situation
- The people involved and their roles
- What "done" means *for this specific project*, the part most people skip
- Decisions already made, so they do not get relitigated
- Open questions being tracked

The more real context in here, the more Claude can carry on its own.

### Starting a session on a project

Open Cowork with **two** folders selected: the Cowork root (for `ABOUT ME/`) and
the project folder. Claude reads both, and you start from full context without
typing any of it.

Selecting the project folder specifically, rather than the whole root, keeps
Claude focused and stops old projects eating the context window.

---

## MODE 4 — One specific question

Answer it. Do not run the setup at them.

If the answer only makes sense with setup they have not done, say which step is
missing and offer to do that step, then stop and wait.

---

## General advice

- **Start a new session every 20 or so messages.** Long conversations spend most
  of their budget re-reading themselves. Summarise, then start fresh.
- **Match the model to the task.** Use a smaller, faster model for routine work
  and save the strongest one for genuinely hard problems.
- **Write things down in files, not in chat.** Chat is disposable. A file in the
  project folder is context for every future session.
- **Update `my-company.md` when priorities change.** The goals section goes stale
  faster than anything else in the folder.

---

## A note on what goes in these files

`ABOUT ME/` and every `CLAUDE.md` are read in full, every session, so treat them
as documents someone else might read. Do not put credentials in them, and think
before putting confidential client detail in a folder that gets shared, synced or
handed to a colleague.
