---
name: brainstorm-feature
description: Collaborative ideation pass that runs BEFORE plan-feature — explores intent, requirements and design for one feature or fix through back-and-forth dialogue with the user, constantly probing for assumptions, ambiguities, contradictions and gaps, and never writes or changes application code. Only once the user has explicitly approved the resulting spec does it hand off to plan-feature. Use whenever the user has a rough idea, wants to brainstorm, explore, or flesh out a design/spec, or says something is "just an idea" before committing to build it — even for something that sounds simple.
---

# Brainstorm Feature

Upstream of [`plan-feature`](../plan-feature/SKILL.md). This skill turns a
rough idea into an approved, unambiguous, self-contained description of
*what* to build and *why* — it never decides task breakdown, and it never
touches application code. `plan-feature` is the only place implementation
tasks get written; this skill's job ends at approval + handoff.

**Hard rule:** no code, no edits to application files, no implementation
plan, for the entire duration of this skill. The only artifact it may
produce is a design/spec file under `specs/` — nothing else on disk changes.

**No shortcuts for "simple."** Every feature or fix goes through this
process before planning, even one that sounds trivial. The process scales
down for a simple idea (fewer rounds of questions, a short spec or none at
all) — it doesn't get skipped. A "simple" idea that turns out to hide a real
ambiguity is exactly what this skill exists to catch.

## Phase 1 — Understand the context

Before asking the user anything, ground yourself in what already exists:

- Read the relevant parts of the codebase, `CLAUDE.md`, and any existing
  `specs/` or `plans/` files that bear on this idea. Use `Explore` or
  `general-purpose` agents for breadth if the area is large.
- Restate the request back in your own words *before* diving into
  questions — this alone surfaces a lot of misunderstanding early, cheaply.

## Phase 2 — Probe continuously

Keep a running watch, throughout the whole conversation, for:

- **Assumptions** — anything being taken for granted about scope, users,
  environment, data, or how the existing system behaves.
- **Ambiguities** — any word or requirement that could reasonably mean more
  than one thing.
- **Contradictions** — between two things the user said, or between the
  request and how the code actually works (verified in Phase 1, not
  assumed).
- **Gaps** — things a complete design would need but nobody's mentioned
  yet: error states, empty/loading states, edge cases, who or what triggers
  it, what happens on failure, non-functional constraints, backward
  compatibility, out-of-scope boundaries.

Surface these as they come up rather than stockpiling them silently for the
end. Use `AskUserQuestion` for a concrete decision with enumerable options;
use open conversation for anything more exploratory. Ask a handful of sharp
questions at a time, not a giant simultaneous questionnaire — but don't
rubber-stamp an idea just because asking feels like friction, either.

## Phase 3 — Converge on a design

Iterate with the user: propose an approach, get their reaction, refine.
Where a real alternative exists, present it with its trade-off rather than
silently picking one and presenting it as the only option. Keep returning to
Phase 2's watch-list as the design solidifies — resolving one ambiguity
routinely surfaces another, and that's expected, not a sign of doing it
wrong.

## Phase 4 — Present and get explicit approval

Summarize the finalized intent, requirements, and design back to the user
as a clear, complete statement — not a question — and ask directly for
approval to proceed.

- Don't treat silence, a vague "ok", or assumed consent to something long or
  consequential as approval. Get an actual yes.
- If the user changes or challenges something at this point, that's a normal
  part of the process, not a failure of it — loop back to Phase 2/3 and
  re-present once it's resolved.

## Phase 5 — Final probe sweep

Immediately before finishing, explicitly re-run the Phase 2 checklist
against the *final* agreed design, out loud in your response — don't just
trust that earlier passes covered it:

- [ ] Every assumption made during the conversation is stated and either
  confirmed or removed
- [ ] No ambiguous term or requirement remains unresolved
- [ ] No contradiction between any two things said during the conversation
- [ ] No obvious gap (error handling, edge cases, non-functional
  requirements, out-of-scope boundary) left unaddressed

If this sweep finds anything, resolve it with the user before finishing —
never let a known loose end ride into the handoff.

## Phase 6 — Write a spec file (only when it earns its keep)

- If the design is small enough to state fully in the Phase 4 summary, no
  file is needed — just carry that finalized description forward into the
  handoff.
- If the design needs extensive architecting — multiple components or
  subsystems, a non-trivial data model, real trade-offs worth recording, or
  work that will span more than one sitting — write it to
  `specs/YYYY-MM-DD-<feature-slug>.md` using `template.md` (next to this
  file). When genuinely unsure which case you're in, write it down: the cost
  is low and it gives `plan-feature` (and any future reader) a durable,
  self-contained reference instead of a conversation that scrolled away.
- Do not commit the file to git unless the user explicitly asks you to.

## Phase 7 — Hand off to plan-feature

Once the user has approved the design (Phase 4) and the Phase 5 sweep is
clean:

- Invoke the `plan-feature` skill in the same conversation, carrying the
  finalized requirements/design forward — either inline in the invocation,
  or by pointing it at the `specs/` file just written.
- `plan-feature`'s own requirements-locking phase should treat this as
  already-settled input: point it straight at what was agreed here rather
  than re-running the requirements conversation from scratch, unless
  `plan-feature`'s codebase investigation surfaces something genuinely new.
- This skill's job ends here. Do not write implementation code, and do not
  start drafting task breakdowns yourself — that's `plan-feature`'s work.
