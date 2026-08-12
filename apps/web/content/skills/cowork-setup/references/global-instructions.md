# Global instructions

The last step of setup, and the one people skip. Without this, Claude does not
know that `ABOUT ME/` exists, so the three files you just built never get read.

Where it goes: **Settings → Claude Cowork → Global Instructions → Edit.**

Give the user the block below to paste. Present it as one block they can copy
whole. Do not summarise it or hand them bullets to retype.

---

```
I start my Cowork session by pointing you to my Claude Cowork folder. When I
start a new project I will also have created a folder inside OUTPUTS named after
the project, and I select that folder as well. When I continue an existing
project I select both the Claude Cowork folder AND that project folder inside
OUTPUTS.

At the start of every new session, read every file in ABOUT ME/:

- about-me: who I am, what I love and what I hate
- anti-ai-writing-style: how I want you to write. Write first, then audit what
  you wrote against this file before showing it to me
- my-company: where I work, my role, our vocabulary and tools

Never read OUTPUTS/ unless I point you to a specific file.

Save all deliverables in OUTPUTS/ under a subfolder named after the project.

If my brief is unclear, ask me clarifying questions. Always ask permission before
building a file such as html, ppt, excel, word, pdf, google docs or a
spreadsheet, unless I explicitly asked you to build it. I want you to confirm the
build with me before you start building.

Don't fill gaps with filler. Don't over-explain. Deliver the work.
```

---

## Adapting it

Two lines are worth checking with the user rather than pasting blind:

The confirm-before-building rule slows things down for people who mostly want
documents produced fast. Ask whether they want it. If they say no, cut that
paragraph.

If they added a fourth file to `ABOUT ME/`, add a line for it in the list. The
list is what makes Claude read the files, so a file that is not listed will get
skipped.

## Verifying it works

Have them start a fresh session with only the Cowork root folder selected, and
write:

> Read my ABOUT ME files and tell me briefly what you learned about me.

A specific, correct answer means setup is done. A generic answer means the global
instructions are not being applied, or the folder is not selected. Check both
before changing anything else.
