# Loop playbook: patterns, ingredients, examples

Read this when designing or repairing a loop after the decision check has passed.

## The cycle every loop runs

1. **Observe.** Read fresh state. Collect the agreed evidence.
2. **Choose.** Pick the highest-value in-scope action from explicit criteria.
3. **Act.** Make one bounded, reversible change, or produce one candidate.
4. **Verify.** Run the same acceptance check under recorded conditions.
5. **Record.** Save the action, the evidence, the outcome, and what is left.
6. **Repeat or stop.** Continue only while progress is measurable and the limit holds. Otherwise enter a named end state (done, no-op, blocked, needs-approval, exhausted, stalled). Never report an error or a hit budget cap as success.

## The ingredients of a loop that works

- **Checkable goal.** The outcome plus a measurable finish line.
- **Hard stop.** A metric threshold or a no-progress rule, plus a max-passes cap.
- **Good tools.** The agent can actually do the action and the verification.
- **Memory.** A notes or next-steps file that persists between passes.
- **Separate checker (optional).** A second agent that grades, used when self-grading is weak or self-approval is a risk.
- **Planning first.** Plan before acting.
- **Logging.** A trail of what was tried and why it stopped.
- **Cost sense.** A time and pass budget set up front.

## The quality curve (why loops help)

AI rarely one-shots to 100 percent. Plot attempts on the x-axis and quality on the y-axis. A human prompting manually climbs the curve slowly: 50 percent, then 60, then 70, with a re-prompt at each step. A loop outsources that feedback-and-iteration cycle to the agent, so you reach high quality in far fewer of your own touches. The point of a loop is not a perfect output. It is landing much closer on the first handoff.

## Three patterns

### Solo loop (start here)
One agent reasons, acts, observes, repeats. Covers most knowledge work. Fast, cheap, easy to supervise. Use unless you have a clear reason not to.

### Maker-checker
One agent does the work. A second agent grades it against a rubric and feeds back. Use when quality matters and the maker cannot reliably grade itself. If scoring is subjective, build a dedicated scoring agent and tune it on a few examples so you trust its judgment.

### Orchestrator with helpers
One agent owns the goal, delegates to specialist agents, and synthesizes their output into one plan. Use only when the work genuinely splits into parallel parts. Highest cost and the most ways to go wrong. Do not reach for this by default.

## Open vs closed loops

- **Closed loop.** Bounded goal, clear evaluation at each step, capped cost. Recommended default.
- **Open loop.** Broad and self-directing. Powerful for discovery but burns large amounts of tokens. Use only with a real budget and a reason.

## Cadence and triggers

Loops can run on demand, on a schedule (weekly, every Friday, every Monday), or after an event (a file lands, a PR opens). Pick the lightest trigger that fits. A scheduled orchestrator can keep a recurring workflow alive without you starting it each time.

## Worked examples (from real runs)

**Thumbnail generator (solo loop, ~27 min).** Goal: make 10 thumbnail concepts, score each against a rubric (clarity at small size, curiosity, emotional pull, contrast), keep the top 3, improve their weakest parts, rescore, iterate on the strongest. Lesson: the scoring was subjective, so the fix is a dedicated scorer agent tuned on examples.

**3D plane in three.js (solo loop, ~37 min).** Goal: build a spinning plane. The agent built it, opened a browser, spun it to check rendering, and iterated. Not perfect, but far better than a naive single prompt. Lesson: visual verification is the whole point.

**Abbey Road recreation (solo loop, capped).** Goal: recreate an album cover in HTML/CSS, no image generation. Stop: average score >= 9, hard cap 8 passes. It rendered, screenshotted, and self-scored across 7 versions. The result was poor (wrong tool for the job, code instead of image generation), but the verification mechanism worked: render, compare, change, repeat. Lesson: the loop machinery can be sound while the approach is wrong. Pick the right tool first.

**Video editing (solo loop, production use).** A single goal handles transcript, cutting mistakes and pauses, building and syncing beats, rendering, plus heavy verification that beats stay in bounds and line up with the transcript. This is how people honestly say "one prompt did it": it was a loop with real verification.

## Keep it grounded

Use only what the user supplied or what is in scope. Do not invent tools, metrics, schedules, budgets, owners, or permissions. When a needed detail is unknown, ask one short question rather than guessing. Designing a loop does not authorize turning on a schedule, changing production, or sending external messages. Activate only when the user asks.
