---
name: loop-engineering
description: Teach, plan, and pressure-test agent loops in plain language, and decide when a loop is worth it versus a one-shot prompt. Use whenever the user wants to learn what an agent loop is, asks "should I loop this?", wants help designing a loop (trigger, action, verification, stop condition), wants to review or fix a loop that runs too long or never finishes, or is about to hand a task to an agent and is unsure whether to set it up as a loop. Built for knowledge work and consulting, not just coding. Pairs with the Forward-Future loop-library catalog for ready-made recipes.
---

# Loop Engineering

A guide for understanding, deciding on, and building agent loops, written for someone doing knowledge work (consulting, content, research, operations), not large codebase refactors.

Use this skill in two modes:

1. **Teach mode.** The user wants to understand loops. Explain in plain language, one idea at a time, and point to the pictures in `references/learn-with-pictures.md` when a visual helps.
2. **Decide and design mode.** The user has a task in hand. Run the decision check first ("should this even be a loop?"), then help build a good one.

Default to the smallest useful answer. Most tasks do not need a loop. Do not turn a one-shot task into a loop just because loops are interesting.

## What a loop is (the one-paragraph version)

A loop replaces you as the person who keeps prompting the agent. Instead of prompt, read, re-prompt, repeat, you set the goal once and the agent runs its own cycle: it reasons about what to do, acts, observes the result, checks against a "done" definition, and either iterates or stops. A loop is three things: a **trigger** (what starts it), an **action** (the bounded thing it does each pass), and a **stop condition** (how it knows to finish). The two pillars that make or break a loop are the **goal** (objective where possible) and **verification** (how it checks its own work).

## The decision check: should this be a loop?

Before designing anything, run this. Say the verdict out loud to the user.

A loop is worth it only when all three hold:

1. **Fresh feedback can change the next step.** If the agent learns nothing between passes, it is not a loop, it is a one-shot. Recommend a single good prompt instead.
2. **You can define "done" objectively, or close to it.** "Until the test passes," "until score >= 9," "until every client got an update this week." Avoid "until you're satisfied." Subjective gates make loops wander.
3. **The agent has a real way to verify.** A screenshot, a test, a rubric, a checklist, a second agent. No verification tool means no trustworthy loop.

Also weigh **cost and fit.** Loops can run long. For knowledge work, the sweet spot is minutes to a couple of hours, or a deliberate overnight run. You do not need fleets of agents running 24/7 just because hardcore engineers do. Match the loop to the actual job.

If any of the three fail, say so and propose the simpler path (a sharp one-shot prompt, or a human-in-the-loop pass). See `references/decision-checklist.md` for the full version.

## How to build a good loop

Build every loop around this cycle: **observe, choose, act, verify, record, repeat-or-stop.**

The ingredients of a loop that actually works:

- **A checkable goal.** State the outcome and the measurable finish line.
- **A hard stop.** A metric threshold, or a no-progress rule, plus a max-passes cap so it cannot run forever.
- **The right verification tool.** Visual check, code test, rubric, or a separate checker agent. Match the check to the output type: a draft needs tone and flow checks, a layout needs a screenshot, a script needs a run.
- **Memory.** State that survives between passes (a notes or next-steps file) so each pass builds on the last.
- **A cost ceiling.** Decide up front how long and how many passes are acceptable.
- **Planning first.** Have the agent plan before it acts.
- **A logging trail.** So you can see what it tried and why it stopped.

Three patterns, smallest first:

- **Solo loop.** One agent reasons, acts, observes, repeats. This covers most knowledge work. Start here.
- **Maker-checker.** One agent does the work, a second grades it and gives feedback. Use when quality matters and self-grading is weak.
- **Orchestrator with helpers.** One agent owns the goal and delegates to specialists, then synthesizes. Use only when the work genuinely splits into parallel parts. It costs the most.

Full patterns, worked examples, and the open-vs-closed-loop tradeoff are in `references/playbook.md`.

## Anti-patterns to flag

Call these out when you see them:

- **Subjective stop conditions.** "Until it looks good." Push for a rubric or threshold.
- **Runaway cost.** A hard goal plus an unreachable done-criteria runs for hours with no payoff. Add a cap.
- **Looping a one-shot.** No new feedback between passes means a loop adds nothing.
- **Copying someone else's setup.** A 24/7 multi-agent fleet that fits an OpenAI engineer rarely fits a consulting firm. Fit the loop to the work.
- **No human checkpoint on judgment calls.** AI is not always right about subjective quality. Keep a review step where taste matters.

## Using the loop library

When the user wants a ready-made recipe rather than a custom design, point them at the Forward-Future loop-library catalog (signals.forwardfuture.ai/loop-library). Each published loop states what to do, how to check, what to try next, and when to stop. Prefer adapting a close match over inventing a near-duplicate. Never invent a loop title, contributor, or URL.

## Reference files

- `references/decision-checklist.md` — the full "should I loop this?" checklist and the one-shot-vs-loop call.
- `references/playbook.md` — patterns, ingredients, worked examples, cost and verification depth.
