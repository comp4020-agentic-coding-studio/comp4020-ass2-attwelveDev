---
name: plan-feature
description: Locks down requirements through back-and-forth with the user, then writes a rigorous, TDD-driven, self-contained implementation plan for exactly one feature (or bug fix), verifies it against the real codebase, and saves it to plans/YYYY-MM-DD-<feature-slug>.md. Use whenever the user asks to plan, scope, or write an implementation/spec doc for a piece of work before coding starts — not for Claude Code's built-in plan-mode approval flow, which is a different, ephemeral thing.
---

# Plan Feature

Produces a persisted planning document (a file under `plans/`), not an
in-session plan-mode approval. It can be used from inside or outside Claude
Code's built-in plan mode — the two are independent. Follow every phase below
in order; do not skip to drafting because the request "sounds simple."

If this was reached via a hand-off from the
[`brainstorm-feature`](../brainstorm-feature/SKILL.md) skill — inline, or by
being pointed at a `specs/` file it wrote — treat that as the requirements
source for Phase 1: read it fully and only re-open the conversation with the
user if something is still missing or if your own codebase investigation
(Phase 2) turns up something the design didn't anticipate.

## Scope rule: one plan, one feature

A plan file covers exactly one feature or one bug fix. If the user's request
actually spans several independent features, say so and produce one plan
file per feature, each going through the full process below — never merge
unrelated features into one document, and never split a single feature
across multiple files.

## Phase 1 — Lock the requirements

Do not draft a plan against ambiguous or incomplete requirements.

1. Read what the user has already given you. If it already answers all of
   the questions below unambiguously, don't re-ask — move to Phase 2.
2. Otherwise, work it out with the user, through normal conversation and
   `AskUserQuestion` for discrete/closed decisions, until you can state
   without hedging:
   - The functional requirements, each specific enough that you could name a
     test that would fail without it.
   - Non-functional constraints (performance, accessibility, security,
     supported browsers/viewports, data limits — whatever applies).
   - What's explicitly out of scope.
   - Any real ambiguity or conflicting instruction you found — surface it and
     get a ruling, don't silently pick one side.
3. Restate the requirements back to the user in plain language and get
   explicit confirmation before writing anything to disk. Don't proceed on
   silence or on a vague "sounds good" to a huge dump of requirements — if
   what you restated is long or consequential, make sure the confirmation was
   actually about the substance.
4. Only after confirmation, move to Phase 2.

## Phase 2 — Investigate the real codebase

The plan must be readable and actionable by someone (or some agent) with
*zero* prior context on this codebase — which means every claim about
existing code in the plan must come from actually reading that code this
turn, not from memory, convention, or a similar project.

- Find and read every file the feature will touch or depend on.
- Record the exact current signatures of any type/function/prop the plan
  will reference or change — copy them, don't paraphrase them.
- Note the testing setup for this repo: framework, exact commands, where
  tests for this area live (check `package.json` scripts and existing test
  files rather than assuming).
- Note established conventions in the surrounding code (naming, error
  handling, file layout) that the new work should match.

Use `Explore` or `general-purpose` agents for breadth if the codebase is
large enough that reading everything yourself would be wasteful — but the
signatures and file contents that land in the plan must still be verified,
not delegated blindly.

## Phase 3 — Draft the plan

Copy `template.md` (next to this file) and fill in every section. Rules for
the task breakdown, non-negotiable:

- **Concrete and final.** Every task names exact files, exact function/type
  names, exact signatures. No "handle X", "improve Y", "TODO: figure out Z".
  If you can't yet write a task that concretely, that's a sign Phase 1 or 2
  wasn't finished — go back, don't paper over it with vague language.
- **Agile-sized.** Each task is small enough to finish and review in one
  sitting, independently valuable or at least independently testable, and
  its dependencies on other tasks are stated explicitly rather than implied
  by ordering (INVEST: independent, negotiable in detail but not in outcome,
  valuable, estimable, small, testable).
- **TDD, explicitly.** Every task lists the failing test(s) to write first
  (red), the minimum implementation to pass them (green), then any refactor
  — in that order. This applies to bug fixes too: the first thing a bug-fix
  task does is add a test that reproduces the bug and fails.
- **Every task has acceptance criteria** that are independently checkable
  without re-reading the whole plan.

Also fill in the non-functional-requirements, out-of-scope, assumptions, and
existing-code-context sections seriously — these are what make the plan
self-contained. Don't leave a section out because it feels obvious; write
"None." explicitly instead so a reader can tell it was considered.

## Phase 4 — Verify and fix before finalising

Before this plan is considered done, check it against itself:

1. **Coverage.** Walk every requirement listed in §2 and confirm it maps to
   at least one task in §5 (fill in §7, the coverage table, as you do this).
   If anything is unmapped, add or fix a task — do not finalise with a gap.
2. **Correctness.** Re-check every type, signature, function name, prop
   name, and file path mentioned anywhere in the plan against the actual
   source you read in Phase 2. Fix any mismatch you find. A plan with a wrong
   signature is worse than no plan, because it will send whoever implements
   it down the wrong path with false confidence.
3. **No loose ends.** §8 (risks/open questions) must end up empty. If it
   isn't, that's unresolved ambiguity — take it back to the user (Phase 1),
   don't ship a plan with known gaps.

Only once all three pass does the plan's `Status` become `Approved` in the
document header.

## Phase 5 — Save and report

1. Determine today's date (`YYYY-MM-DD`) and a kebab-case slug for the
   feature name.
2. Save the finished plan to `plans/YYYY-MM-DD-<feature-slug>.md`, creating
   the `plans/` directory if it doesn't exist yet.
3. Tell the user where it landed and give a one- or two-sentence summary of
   the approach and the number of tasks — don't paste the whole plan back
   into the chat if it's long; they can open the file.
4. Do not commit the file to git unless the user explicitly asks you to.

## A living checklist, not a one-shot artifact

The saved plan uses GitHub-style task checkboxes so it can be checked off as
work proceeds. If the user later asks to update, re-scope, or continue a
plan, re-open the same file, re-run the Phase 4 verification against the
current state of the code (code moves; a plan written last week may now
reference a signature that changed), and edit it in place rather than
creating a second file for the same feature.
