# Interview: my-company.md

Run this to build the user's `my-company.md`. This is the file that stops Claude
asking what things mean. It carries the organisation, the vocabulary, the tools
and the people.

Interview with AskUserQuestion, 9 questions, then compile. Target under 2,000
tokens.

## How to interview

One question at a time. Push for specifics, especially on vocabulary and tools.
Internal names are the whole point of this file: if they say "we track deals in
the CRM", ask what the CRM is actually called and what people call it in
conversation.

If they work solo or freelance, skip question 4 and treat "the company" as their
own practice. Ask instead who their recurring collaborators are.

## What to cover

**1. The organisation.** What is the company called, what does it do, roughly
how many people, founded when? If it is part of a group or has sister companies,
which ones, and what is the difference between them?

**2. What it sells.** The services or products, grouped the way the company
groups them internally. Ask for their own categories, not a tidied version.

**3. Your role in it.** Where they sit, what they own, what they are building or
responsible for right now. This overlaps with `about-me.md` on purpose: keep it
to one or two sentences here and let the other file carry the detail.

**4. The people you work with most.** Five names maximum, not the org chart.
For each: name, role and the one thing you go to them for. Ask what would make
Claude get someone wrong, for example two people with the same first name, or
someone whose title does not match what they actually do.

**5. Internal vocabulary.** Project codenames, tool nicknames, acronyms,
recurring meetings, anything an outsider would not understand. Ask directly:
"What would a new hire have to ask about in their first week?" This is usually
the highest value answer in the whole interview, so push for at least four
items.

**6. Tech stack.** What they use for: workspace and email, documents and file
storage, chat, CRM or sales, finance, contracts, anything else that matters.
Ask which one is the real source of truth when two of them overlap, because
that is the part people get wrong.

**7. Connectors.** Which of those tools are actually connected to Claude, and
which are not yet. Note anything that needs an admin to approve it.

**8. Goals and current focus.** What they are trying to achieve this quarter,
and what they are deliberately saying no to. Tell them this section will go
stale and they should update it, so keep it short.

**9. Rules for Claude.** Anything that needs holding straight: which entity is
which, who owns what, what Claude should never assume, who to check with before
acting.

## Output format

Compile into one markdown file. No raw Q&A.

```markdown
# MY COMPANY: [Name]

## About [Company]
[What it is, what it does, size, structure. If there are sister companies or
business units, state the difference in one line each.]

---

## What we sell
[Services or products, in their own groupings.]

---

## My role
[1 to 2 sentences.]

---

## The people I work with
[Up to five. Name, role, what they are the person for. One line each.]

---

## Vocabulary
[Internal terms, codenames, acronyms, tool nicknames, with a plain definition
for each. This section earns its place. Do not trim it.]

---

## Tech stack
| Area | Tool |
|---|---|
[…]

Source of truth: [which tool wins when two overlap]

---

## Connectors available in Claude
[Connected, and not yet connected. Note what needs admin approval.]

---

## Goals and current focus
**Goals:** […]
**Focus right now:** […]
**Saying no to:** […]

*Update this section when priorities change.*

---

## Instructions for Claude
[Numbered. Disambiguation rules, ownership, what never to assume, who to check
with. Derived from question 9 and from anything confusing that came up earlier.]
```

Save as `my-company.md` in `ABOUT ME/`.

**One warning to give the user before you start:** this file gets read every
session, and it will contain colleague names and internal tool names. If they
ever share or sync the Cowork folder, that goes with it. Nothing confidential
about clients belongs here.
