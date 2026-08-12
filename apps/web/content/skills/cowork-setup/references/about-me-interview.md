# Interview: about-me.md

Run this to build the user's `about-me.md`. Claude reads that file at the start
of every session, so it has to be concise and high signal.

Interview with AskUserQuestion, 12 questions, then compile into a single file
under 2,000 tokens.

## How to interview

One question at a time, AskUserQuestion every time. Leave room for "Other" so
they can dictate a long answer when they need to.

If an answer is vague, push back. Ask for a specific example or rephrase the
question. Do not accept "I like to keep things clear" without finding out what
clear looks like in their work.

Follow interesting threads. If something unexpected comes up, go deeper before
moving on.

Do not ask all 12 in a row without reacting. The value of this file comes from
the follow-ups, not the script.

## What to cover

**Who I am, 2 questions**

- What do you do? Your role, and what you actually deliver to the people you
  work for.
- Who do you work with? Your typical client or stakeholder: industry, company
  size, who is in the room.

**What I deliver, 2 questions**

- What are your most common deliverables? Walk me through a recent example.
- When you hand something off, what does "done" look like? What format, what
  level of polish, and what does the recipient do with it next?

**What good looks like, 2 questions**

- What separates great work from average work in your field?
- When Claude writes something for you and it is wrong, what is usually off?
  Tone, structure, level of detail, assumptions?

**What I hate, 2 questions**

- Give an example of bad work in your field. What specifically makes it bad?
- What do you never do in your work? Hard lines you will not cross.

**My rules, 1 question**

- What are the two or three non-negotiables that every piece of your work must
  have?

**Language and tone, 1 question**

- What language do you write to clients in? How formal or informal, and does it
  vary by client or by deliverable?

**Two spare questions.** Use them on whatever came up during the interview that
was more interesting than the script. If nothing did, ask what they keep having
to re-explain to people, and what they want Claude to never do.

## Output format

Compile everything into one markdown file. Do **not** save the raw Q&A. Extract
the patterns and write them as condensed prose and bullets.

```markdown
# ABOUT ME: [Name]

## Who I am
[2 to 3 sentences. Role, typical clients, what they deliver.]

---

## What I deliver
[Most common deliverables, how they work with clients, what "done" looks like.
Short paragraphs.]

---

## What good looks like
[What they value in their own work and in others'. The standards they hold.
Condensed from the examples they gave.]

---

## What I hate
[Patterns and mistakes that bother them. What "wrong" looks like. Specific,
not vague.]

---

## My rules
[Numbered list. Hard lines and non-negotiables.]

---

## Instructions for Claude
[10 numbered rules for how to work with this person, derived from everything
above. What Claude must DO and NOT DO, not abstract principles. Include the
language and tone rules.]
```

Target: under 2,000 tokens. Every sentence carries signal. If a sentence could
be cut without losing information, cut it.

Save as `about-me.md` in `ABOUT ME/`.
