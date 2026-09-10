# Process log

Append-only working log of every moment that meets the bar in `CLAUDE.md`'s
"PROCESS.md and PROCESS_LOG.md" section: a correction that landed in the
harness itself (a rule added to `CLAUDE.md`, a check added, or an attempt
thrown away), with why the call beat the obvious one and how it was known to
be right before being accepted.

This file isn't graded and isn't word-count-limited — it's the raw material
`PROCESS.md` gets curated from, not a draft of it. Don't trim or select
here; that happens once, by hand, when writing `PROCESS.md`.

<!-- Entries go below, newest at the bottom, in this format:

## YYYY-MM-DD — <short title>

**Obvious approach:** ...
**What I decided instead, and why:** ...
**How I knew it was right:** ...
**Landed in the harness as:** ...
**Commit:** [`<sha>`](<url>)

-->

## 2026-09-09 — The weekly-structure rule became a test, not an instruction

**Obvious approach:** Write the rule into `CLAUDE.md` — "preserve one consistent
weekly structure across all twelve weeks, vary only the content" — and trust the
agent to hold it across twelve weeks of writing.

**What I decided instead, and why:** The agent showed me that my own drafted
weeks already violated the rule I had just written: case studies appeared in six
of twelve weeks, week 3 had an "assessment tie-in" slot no other week had, and
week 12 had no content at all. So the rule was already fiction. Given the choice
between weakening it to "same slots, some optional" and filling all sixty slots,
I took the expensive one — every week gets all five slots, which meant
commissioning six new case studies and giving week 12 a real shape — because the
brief's own named failure mode is "twelve weeks that repeat one another", and a
rule with exceptions is exactly how twelve weeks drift into twelve differently
shaped pages.

**How I knew it was right:** The contradiction was demonstrated against my own
draft before I chose, not argued in the abstract. And the rule is no longer
something an agent can quietly drift from: it is asserted over rendered HTML,
with the check itself verified by deliberately removing one week's Case study
heading, confirming the suite fails and names the page, then restoring it.

**Landed in the harness as:** a `CLAUDE.md` rule (foundation plan, Task 7) plus
`spec/weekly-structure.test.ts` check 4 — all five headings present, in order, in
every one of the twelve rendered lecture pages (curriculum plan, Task 11).

**Commit:** [`bbb6081...49dc804`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/bbb6081...49dc804)

## 2026-09-09 — Not putting myself in the cast

**Obvious approach:** List myself as course convenor. It is my course, and a CS
student teaching the life-skills course is a joke with real bite.

**What I decided instead, and why:** Kept the cast four fictional institutional
professionals and credited myself outside the fiction, in `PROCESS.md` and the
commit history. The whole course earns its humour from institutional
seriousness, and a current fourth-year undergraduate convening a compulsory
prerequisite is the one detail that reclassifies the site from "a course" to "a
joke by a student". It also inverts the thesis: the argument blames CS culture
for not teaching these skills, and if a CS student is the authority teaching
them, the claim quietly becomes "I worked this out and you didn't" — which aims
the satire at my classmates instead of the institution.

**How I knew it was right:** it was the same constraint I had already accepted
one decision earlier, showing up somewhere new. I had chosen a register that
never breaks character and never targets the student; self-insertion breaks both.
Accepting it was consistency with a decision already made, not a fresh matter of
taste — and the rejected alternative is recorded in the spec so the reasoning
survives.

**Landed in the harness as:** spec §4.5, with the rejected alternative written
down, and `spec/cast.test.ts` — four entries, exactly one convenor, no starter
entry surviving (foundation plan, Task 3).

**Commit:** [`bbb6081`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/bbb6081)

## 2026-09-09 — Specifying the visual treatment before the content existed

**Obvious approach:** Take the agent's recommendation — record the visual
principle now, defer the actual treatment until there are real pages to judge it
against.

**What I decided instead, and why:** Specified the treatment up front. A
professional, credibly academic design is not decoration on this course, it is
the mechanism: deadpan needs a straight face to play against, and a playful
surface would tell a reader it is a joke before they read a word. Deciding that
late risks a site that has already drifted playful. Recorded against the agent's
stated recommendation, deliberately.

**How I knew it was right:** not by taste — by making it safe first. Before any
treatment was written down, the fixed/yours boundary was read out of the
installed packages rather than out of the README's summary of them: only three
brand inks, the lockup assets and the site name are fixed, while type, measure,
spacing, surface, motion and all six components are mine. So the treatment I was
specifying was legal before I specified it. The same read found that headings
default to the brand gold, which turned the largest register problem into one
declaration.

**What it cost, honestly:** the treatment is specified against content that does
not exist yet, and the plan records that as an accepted risk rather than
pretending otherwise. It is stated as tokens and principles, which survive
writing twelve weeks, rather than per-page choices, which would not.

**Landed in the harness as:** the visual-treatment plan, including a filter that
keeps four of my eight UI references and rejects the other four as
register-breaking, and `spec/glossary.test.ts` — every occurrence of the six
systems terms must sit inside a `<code>` element, so the one visual device that
carries the thesis cannot be applied half-heartedly.

**Commit:** [`49dc804`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/49dc804)

## 2026-09-09 — Noon deadlines instead of patching the date formatter

**Obvious approach:** `src/lib/dates.ts` formats in UTC, so a 09:00 Canberra
deadline renders as the previous day. Repoint the formatter at
`Australia/Canberra` and the bug is gone.

**What I decided instead, and why:** Left the formatter alone and moved all five
deadlines to 12:00 local. UTC is *correct* for the bare `YYYY-MM-DD` `date:`
fields, and those are 24 of the site's 29 dated nodes — so patching the formatter
to fix five deadlines would have shifted twenty-four teaching dates by up to a
day in the other direction, trading a visible bug for a quieter one. Noon is also
already the template's own convention in both starter assessments, so the fix
moved my content into line with the platform instead of moving the platform.

**How I knew it was right:** I ran the formatter against both variants before
changing anything, rather than reasoning about it. A 2 March deadline at
`09:00+11:00` rendered "1 March 2027"; at `12:00+11:00` it rendered "2 March
2027". Checked at both daylight-saving offsets, since the semester crosses the
change on 4 April.

**Landed in the harness as:** a `CLAUDE.md` deadline rule with its one-line
reason, and `spec/assessment-scheme.test.ts` asserting every `due` matches
`/T12:00:00(\+10:00|\+11:00)$/` and carries the right offset for its date
(curriculum plan, Task 1). The defect and the rejected alternative are recorded
as spec §5 row 23.

**Commit:** [`bbb6081...49dc804`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/bbb6081...49dc804)

## 2026-09-09 — Trusting the render over the schema for the `role` field

**Obvious approach:** `src/content.config.ts` types a person's `role` as
`z.string().trim().min(1)`. A free string, so put each tutor's specialism in it —
"Tutor, Textile Care and Garment Longevity".

**What I decided instead, and why:** Read the component before writing the
content. `PeopleGrid.astro` maps roles through `roleOrder` and `roleLabels` keyed
on the literal strings `convenor|tutor|guest|other`; anything else sorts last
*and* renders no label at all, because the label element is guarded on a lookup
that returns undefined. So the schema would have accepted my content and the page
would have quietly dropped it. Roles stay `convenor`/`tutor` and each specialism
moved to `affiliation` — which is how a real handbook reads anyway.

**How I knew it was right:** the failure mode is silent, so the type was not
evidence. I checked the two places a role is consumed — the listing component and
`TeachingTeam.astro`, which prints the raw string — instead of trusting the
declared type. This is the repo's existing "the render is the truth, not the
source" rule applying somewhere I had not expected it to: a schema is source, and
it was the more convincing of the two.

**Landed in the harness as:** a `CLAUDE.md` constraint pointing at
`PeopleGrid.astro`, and `spec/cast.test.ts` — "uses only roles PeopleGrid can
label" — so the trap cannot be walked into twice (foundation plan, Task 3).
Recorded as spec §5 row 24.

**Commit:** [`bbb6081...49dc804`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/bbb6081...49dc804)

## 2026-09-09 — Making the executing agent unable to fake a green suite

**Obvious approach:** A skill for executing plans needs to load the plan, do the
tasks and run the checks. Write those steps down and you are done.

**What I decided instead, and why:** Built the skill around two prohibitions
rather than around its steps. Nothing is implemented until its critical review of
the plan is clean — no starting on the easy tasks while a concern is outstanding
— and a test is never made to pass by weakening it: no loosened assertion,
relaxed threshold, added skip, deleted case, or cast past a type error. The second
is the one that matters, because every promise this course makes is now held by a
`spec/` check, and an agent that can edit a check into passing has quietly
removed the whole safety net rather than tripped over it.

**How I knew it was right:** the plans it will execute already depend on it. The
curriculum plan's structural check says in as many words that a failure there is a
content bug to fix, not a test to relax, and both that check and the glossary
check are specified to be validated by deliberately breaking them and confirming
they fail. Neither of those is worth anything if the thing executing the plan is
allowed to edit the assertion.

**What I added as a counterweight:** an explicit clause that a choice with an
obvious default and no material consequence is a routine judgement call, not a
blocker. A skill that stops at every small fork is as useless as one that guesses
at every large one, and without that clause the stop-and-ask rules would have made
it the former.

**Commit:** [`fcfe8e2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/fcfe8e2)

## 2026-09-10 — A `Human review:` gate, because a banned-word list can't judge voice

**Obvious approach:** Let the voice-realignment plan's tasks stand on
`spec/voice.test.ts` alone — if the banned-phrase checks pass, the task is
done, same as every other task in the plan.

**What I decided instead, and why:** Added a `Human review:` field to the
`plan-feature` and `execute-plan` skills themselves, not just to this one
plan: any task whose correctness a mechanical check can only approximate
now names the exact artifact a human must look at and explicitly accept,
and a rejection either gets redrafted in place or hands back to planning if
the task's approach was wrong. Retrofitted the nine content/voice tasks in
`plans/2026-09-10-slop1521-voice-realignment.md` accordingly. The reason is
that "banned phrase absent" and "replacement copy is actually funny and
on-voice" are different claims, and only the first is machine-checkable —
a task that only asserts the first would report itself done while the
thing the whole plan exists to fix (drifted voice) went unverified.

**How I knew it was right:** not by seeing it catch anything yet — nothing
has been executed against the gate. I checked it by re-reading
`spec/voice.test.ts` itself: every assertion in it is a presence/absence
check against banned terms, none of them evaluate whether the surviving
copy is good. That's a structural gap in the check, confirmed by reading
the check, not a guess about what it probably covers.

**What's still open:** the gate hasn't been exercised — no task has gone
through an actual accept/reject cycle yet, so whether the hand-back-to-
planning path works in practice is still unverified. That's a claim for a
later entry, once `execute-plan` has actually run against this plan.

**Landed in the harness as:** a `Human review:` field and its accept/reject
handling in both `~/.claude/skills/plan-feature/SKILL.md` (Phase 3, Phase 4
item 4) and `~/.claude/skills/execute-plan/SKILL.md` (Phase 3 steps 4-5,
Phase 4, Phase 5), plus the corresponding template field and Definition-of-
Done line in `plan-feature/template.md`, and the retrofit of Tasks 4-12 and
§6/§7 in `plans/2026-09-10-slop1521-voice-realignment.md`.

**Commit:** [`4e0dcf5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/4e0dcf5)
