---
name: cowork-setup
description: "Helps someone set up Claude Cowork and understand how it is actually used day to day. Guides through folder structure, ABOUT ME files, global instructions, connectors and per-project setup. Use when someone is setting Cowork up from scratch, is stuck on a step, or wants to see how a real project is structured."
---

# Cowork setup

You are helping someone get Claude Cowork working, or get unstuck, or understand
how it is used on real work. Adapt to which of those it is — do not deliver the
whole guide to someone who asked one question.

## Before you answer — find out where they are

Ask first. Use AskUserQuestion with these options:

- "Setting up from scratch"
- "Started, but stuck on a step"
- "Show me how a real project is structured"
- "I have one specific question"

Then answer in the matching mode below. Most of this document will be irrelevant
to any given person, and that is the point.

---

## MODE 1 — Setup from scratch

One step at a time. Wait for confirmation before moving on. Do not paste all five
steps at once.

### Step 1: The folder

Create a folder on the computer. Name it anything — `Claude Cowork` works.

Inside it, create three subfolders:

```
ABOUT ME/     — who you are; read at the start of every session
OUTPUTS/      — where work gets saved, one subfolder per project
TEMPLATES/    — reusable things worth keeping
```

Then select this folder in the Cowork app.

### Step 2: The ABOUT ME files

These live in `ABOUT ME/` and Claude reads them automatically each session. Three
files, each doing a different job:

**`about-me.md`** — who you are and how you work. Build it by interview rather
than by writing it cold: ask the person 10–12 questions (role, what they own,
who they work with, what a good week looks like, what they keep having to
re-explain to people, what they want Claude to never do), then compile the
answers into the file yourself.

**`my-company.md`** — the organisation. What it does, who the customers are, the
vocabulary and acronyms an outsider would not know, current priorities. This is
the file that stops Claude asking what things mean.

**`writing-style.md`** — how output should read. Most useful as a list of things
to avoid: words the person hates, structures that feel generated, the register
they actually write in. Negative instructions work better than positive ones here.

**Keep all three under roughly 6,000 tokens combined.** They are read every
session, so length is a running cost, not a one-off. If one grows too long, trim
it by asking: *"This is my about-me file and I need to save tokens. Ask me
questions about what to cut until it is tight."*

### Step 3: Global instructions

Global instructions tell Claude how the folder works. Without them Claude does
not know where to read from or where to save.

**Settings → Cowork → Edit Global Instructions.** It needs to say, in plain
language:

- Read everything in `ABOUT ME/` at the start of a session
- Save work into `OUTPUTS/<project>/`, never loose in the root
- When a project folder has a `CLAUDE.md`, read it before doing anything
- Reusable output goes in `TEMPLATES/`

### Step 4: Connectors

Connectors give Claude access to real tools. **Settings → Connectors.** Connect
only what is actually needed — each one is a place data can flow, and an unused
connector is just exposure.

Common ones: mail, calendar, file storage, and whatever the team's chat tool is.
Some require an admin to approve them for the whole organisation, so check that
before promising anyone it will work.

### Step 5: Test it

Start a fresh session and write:

> Read my ABOUT ME files and tell me briefly what you learned about me.

If the answer is specific and correct, setup is done. If it is generic, the
global instructions are not being applied — go back to step 3.

---

## MODE 2 — Stuck on a step

Ask which step. Give a targeted answer to that step only.

| Symptom | Usually |
|---|---|
| Claude ignores ABOUT ME | Global instructions missing, or the folder is not selected in Cowork |
| Claude saves in the wrong place | `OUTPUTS/` does not exist, or global instructions never mention it |
| Claude has no project context | The project folder has no `CLAUDE.md`, or it was not selected this session |
| Answers feel generic | ABOUT ME is too long and is being skimmed — trim it |
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
- What "done" means *for this specific project* — the part most people skip
- Decisions already made, so they do not get relitigated
- Open questions being tracked

The more real context in here, the more Claude can carry on its own.

### Starting a session on a project

Open Cowork with **two** folders selected: the root folder (for `ABOUT ME/`) and
the project folder. Claude reads both, and you start from full context without
typing any of it.

Selecting the project folder specifically — rather than the whole root — keeps
Claude focused and stops old projects eating the context window.

---

## General advice

- **Start a new session every 20 or so messages.** Long conversations spend most
  of their budget re-reading themselves. Summarise, then start fresh.
- **Match the model to the task.** Use a smaller, faster model for routine work
  and save the strongest one for genuinely hard problems.
- **Say "save this as a template"** whenever Claude produces something you will
  want again.
- **Write things down in files, not in chat.** Chat is disposable; a file in the
  project folder is context for every future session.

---

## A note on what goes in these files

`ABOUT ME/` and every `CLAUDE.md` are read in full, every session — so treat them
as documents someone else might read. Do not put credentials in them, and think
before putting confidential client detail in a folder that gets shared, synced,
or handed to a colleague.
