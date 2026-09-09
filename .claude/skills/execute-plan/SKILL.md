---
name: execute-plan
description: Executes an existing implementation plan — loads it, reviews it critically against the real codebase and raises every question or concern BEFORE touching code, then works through its tasks in dependency order, following each task's TDD steps and verifications exactly, and stops to ask rather than guess whenever it hits a blocker. Use whenever the user asks to implement, execute, build, work through, continue or resume a plan, or points at a plans/*.md file and says go.
---

# Execute Plan

Downstream of [`plan-feature`](../plan-feature/SKILL.md), which is downstream of
[`brainstorm-feature`](../brainstorm-feature/SKILL.md). Those two decide *what*
to build and *how*; this skill builds it. It does not re-open settled design,
and it does not invent work the plan doesn't name.

**Two hard rules, for the whole duration:**

1. **Nothing is implemented until the Phase 1 review is clean.** If the review
   raises anything, it goes to the user first — no "I'll start on the easy tasks
   meanwhile".
2. **Never make a test pass by weakening it.** Not by loosening an assertion,
   relaxing a threshold, adding a skip, deleting a case, casting past a type
   error, or asserting the buggy output. A test that fails is telling you
   something; the only honest responses are fixing the code or stopping to ask.

## Phase 0 — Load the plan and find out where the work already stands

1. **Resolve which plan.** The input may be a path, a feature name, or nothing
   at all. If there are several candidates under `plans/`, or the work spans a
   sequence of plans, ask which one — don't pick.
2. **Read it in full**, plus anything it points at: the `specs/` file it was
   built from, `CLAUDE.md`, `AGENTS.md`, and any sibling plan it declares a
   dependency on. A plan is written to be self-contained, but its handoff notes
   routinely name constraints that live elsewhere.
3. **Establish what is already done.** Ticked checkboxes, `git log`, and the
   working tree. Never redo completed work, and never trust a ticked box on its
   own — spot-check that the task's acceptance criteria actually still hold.
   A dirty working tree from an earlier, abandoned run is itself a concern for
   Phase 1.
4. **Note the project's commands** — test, typecheck, build, lint, evidence
   gates — from `package.json` or equivalent, not from memory.

## Phase 1 — Review the plan critically, before touching anything

Read the plan as an adversary would, then check it against the code as it is
**now**. Code moves: a plan written last week may reference a signature that has
since changed, and a plan that sends you confidently down a wrong path is worse
than no plan.

**What counts as a real concern:**

- A file path, function, type, prop, signature or line reference that doesn't
  match the current source.
- A dependency the plan assumes is present and isn't, or that would need
  installing without the plan saying so.
- A verification command, script or fixture the plan names that doesn't exist.
- A task whose acceptance criteria can't be checked as written, or can't be
  satisfied at all.
- A contradiction between two tasks, a dependency cycle, or a task depending on
  something no task delivers.
- A requirement in the plan's requirements section that no task implements —
  check the plan's own coverage table if it has one, and don't trust it blindly.
- Anything the plan leaves as an open question. A plan with open questions isn't
  ready to execute.

**What does not count:** the plan's settled design decisions. A plan's handoff
notes typically name what must not be re-litigated, and preferring a different
approach is not a concern — it's reopening a closed conversation. If you
genuinely believe a decided call is wrong, say so in a sentence or two, then
follow the plan anyway; don't stall the work on it.

**Raise everything found once, together, before implementing** — a drip of
questions across the run is worse than one round. Then get an actual ruling.
If the review is clean, say so in a line and proceed.

## Phase 2 — Build the work list

- Use the harness's todo list if one is available; otherwise the plan's own
  checkboxes **are** the work list, and no parallel list gets invented.
- If items already exist for this plan, reconcile with them rather than
  duplicating.
- One item per plan task, ordered by the tasks' declared **dependencies**, not
  by the order they happen to appear in the file.

## Phase 3 — Execute, one task at a time, exactly as written

For each task, in order:

1. **Red.** Write the test(s) the task names, run them, and confirm they fail —
   *and fail for the stated reason*, not on an import error or typo. A test that
   passes before the implementation exists is either broken or evidence the task
   is already done; investigate which before moving on.
2. **Green.** The minimum implementation the task names, with the signatures it
   names. Nothing extra.
3. **Refactor.** Only what the task names.
4. **Verify.** Run the task's own verification, then the project's full check
   command. Walk the acceptance criteria one at a time and confirm each
   individually — they're written to be independently checkable, so check them
   independently.
5. **Record.** Tick the task in the plan file, and commit according to the
   project's stated convention (in this repo: one commit per task once the check
   command is green, with a message saying what changed and why). If the project
   says nothing about commits, don't commit. **Never push.**

**While executing:**

- **Follow the steps exactly.** If a step looks wrong, that is a blocker — stop
  and ask. Improving a step on the fly is how execution and plan silently
  diverge.
- **Stay in scope.** Implement only what the current task names. Anything else
  you notice — a real bug, a tempting cleanup, a missing test elsewhere — gets
  written down and reported, not silently fixed.
- **Match the surrounding code**: its naming, error handling, file layout and
  test conventions. Prefer the project's existing patterns over introducing a
  new one.
- **Never fabricate verification.** If a check couldn't be run, say which and
  why. If the plan calls for manual or rendered verification — a browser, a
  running app, specific viewports — that is not optional, and the render is the
  truth, not the source.
- **Leave no debris**: no stray debug logging, commented-out experiments,
  temporary files, or `.only` on a test.
- **Never hand-edit generated or build output.** Fix the source and rebuild.
- **Never commit a secret**, and never widen ignore rules to make one
  committable.

## Phase 4 — Blockers: stop and ask, don't guess

**Stop when:**

- A verification, test or check fails and the fix isn't plainly inside the
  current task's scope. *(The Phase 3 red step failing is the expected state,
  not a blocker.)*
- A dependency is missing, unavailable, or would need installing beyond what the
  plan authorises.
- A step or acceptance criterion is ambiguous, or two readings of it lead to
  materially different work.
- The code no longer matches what the plan describes.
- A task's acceptance criteria can't be met as written.
- The next action is destructive or hard to reverse and the plan didn't
  explicitly authorise it — deleting data, rewriting history, touching anything
  outward-facing.
- Credentials, permissions or access are needed that you don't have.

**How to stop:**

- Stop at a task boundary where you can. If you're mid-task, say exactly what is
  half-done and what state the tree is in.
- **Don't retry the same failing thing more than twice**, and don't route around
  a blocker by guessing at intent.
- Do finish any remaining work that doesn't depend on the answer, then stop and
  report both parts.
- Report it like this:

  ```
  BLOCKED — Task <n>: <one-line title>

  What failed:   <the command, and the actual output — not a paraphrase>
  Expected:      <what the plan says should happen>
  Why I stopped: <which blocker condition this is>
  What I tried:  <briefly, and why it didn't resolve it>
  What I need:   <the specific decision or information — a question, not a menu
                 of vague options>
  Tree state:    <clean at Task n-1 / files changed but uncommitted / etc.>
  ```

Reserve this for genuine blockers. A choice with an obvious default and no
material consequence is a routine judgement call: make it, note it in the
report, and keep going. A skill that stops at every small fork is as useless as
one that guesses at every large one.

## Phase 5 — Re-review whenever the plan or the approach changes

Trigger a fresh Phase 1 review — against the **changed** plan, not the one you
remember — whenever:

- The user updates the plan or gives feedback that changes it.
- Resolving a blocker changes the approach.
- Execution reveals the plan was wrong about the code, the design, or the
  sequencing.

Then:

- **Update the plan file in place** rather than diverging from it silently. A
  plan that no longer describes what's being built has stopped being a record of
  anything. Edit the same file — never fork a second plan for the same feature.
- If the plan carries its own verification section (coverage mapped, references
  correct, no open questions), re-run it after editing.
- If the change is big enough that the task breakdown no longer holds, say so
  and hand back to `plan-feature` rather than improvising a new breakdown here.
  Re-planning is that skill's job; this one executes.

## Phase 6 — Report honestly

- What completed, which tasks are ticked, which commits were made.
- What was **skipped or left undone, and why** — explicitly, never by omission.
- Which verifications actually ran, and which didn't.
- Anything found out of scope: listed, not fixed.
- Any routine judgement calls made along the way.

Report completion only when every task's acceptance criteria have actually been
checked. If tests fail, say so and show the output. If a step was skipped, say
that. Don't hedge work that is genuinely done, and don't round work that isn't
up to done.

## The plan is a shared record, not a private script

Two people should be able to read the plan afterwards — one who watched the
execution and one who didn't — and agree on what was built. That only holds if
the file keeps pace with reality: ticked as work lands, edited when the approach
changes, and never quietly departed from. When execution and plan disagree, one
of them is wrong, and finding out which is the work.
