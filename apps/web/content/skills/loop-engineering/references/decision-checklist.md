# Should I loop this? The full checklist

Run this before designing any loop. The goal is to avoid building machinery a task does not need.

## Step 1: Is it loop-shaped at all?

Answer yes to all three or it is not a loop:

- [ ] **Recurring event or state to observe.** There is something to look at each pass (a result, a score, a new input).
- [ ] **A next action that can change based on feedback.** What the agent does on pass two depends on what it saw in pass one. If the action is fixed, it is a one-shot.
- [ ] **An observable check.** There is a concrete way to tell whether the last action helped.

If any are no: recommend a single well-written prompt, or a human-in-the-loop pass. Stop here.

## Step 2: Can you define "done"?

- [ ] **Objective gate available?** A threshold, metric, test result, or finite scenario set. Examples: "until all tests pass," "until average score >= 9," "until every active client has an update this week," "hard cap of 8 passes."
- [ ] If only a subjective gate exists ("until it reads well"), can you turn it into a rubric or a separate scoring agent? If not, the loop will wander. Keep a human checkpoint.

The single biggest failure mode is a vague done-criteria. A loop is only as good as its stop condition.

## Step 3: Can it verify its own work?

Match the check to the output:

| Output type | How it verifies |
| --- | --- |
| Code / script | Run it, check the result, run tests |
| Layout / visual / slide | Render it, screenshot, compare to reference |
| Written draft | Check tone, flow, structure against a rubric |
| Research / analysis | Cross-check sources, test claims, list gaps |
| Multi-step deliverable | Checklist of acceptance criteria, or a checker agent |

No verification tool means no trustworthy loop. Give the agent the tool, or do not loop it.

## Step 4: Does the cost make sense?

- [ ] **Time budget.** Knowledge-work loops usually pay off in minutes to a couple of hours. A deliberate overnight run (4 to 8 hours) can be worth it for a big goal. Multi-day runs rarely are.
- [ ] **Pass cap.** Always set a maximum number of passes so a hard or unreachable goal cannot run forever.
- [ ] **Fit, not fashion.** Running fleets of agents around the clock fits some engineering teams. It does not automatically fit consulting or knowledge work. Build for your actual job.

## The verdict

- **All four pass** → design the loop. Start with a solo loop unless the work clearly splits or needs an independent checker.
- **Step 1 fails** → one-shot prompt or human pass, not a loop.
- **Step 2 or 3 fails** → either fix it (build a rubric, add a verification tool) or keep a human in the loop.
- **Step 4 fails** → narrow the goal, tighten the stop, or do it manually.

State the verdict plainly to the user before building anything.
