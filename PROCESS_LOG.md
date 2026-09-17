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

## 2026-09-17 — A prose rule ("introduce before you reference") became a mechanical check, not just a CLAUDE.md line

**Obvious approach:** Add the rule to `CLAUDE.md` — "a case study must be
introduced in a lecture before a lab or later week references it" — and rely on
whoever writes each week's content to remember to check the earlier weeks by
hand.

**What I decided instead, and why:** The same failure mode as the weekly-
structure rule: a prose-only rule survives exactly as long as no one is tired
or in a hurry. Labs and assessments in this course already named case studies
(Jordan's Week, the 600-word message, "reading the room") that no lecture had
actually taught first — the violation the rule exists to prevent had already
happened, repeatedly, before the rule was even written. So instead of trusting
memory, `caseStudies` became a typed frontmatter field on both `lectures` and
`sessions` (`src/content.config.ts`), and `spec/case-study-provenance.test.ts`
asserts every lab's tagged case study appears on that week's lecture first —
`pnpm test` now fails the build if a future week violates the rule, rather
than relying on a future re-read of `CLAUDE.md`.

**How I knew it was right:** Before writing the real check, I set a temporary
`caseStudies: ["red-check"]` on a lab with no matching lecture tag and
confirmed the test failed with the exact message naming the mismatch — then
removed it. That's the difference between "I wrote a test" and "I wrote a
test that actually catches the bug it's for."

**Landed in the harness as:** `src/content.config.ts`'s `caseStudies` field,
`spec/case-study-provenance.test.ts`.

**Commit:** [`00930a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/00930a1), [`482cc21`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/482cc21)

## 2026-09-17 — A silent data-loss bug in citation deduplication, found by asking "what happens to X" rather than by a failing test

**Obvious approach:** Ship the citation-note styling fix (Task 22) and move on
to the references/lectures cross-linking (Task 24) as two independent,
already-scoped tasks — `pnpm check` was green after each, and nothing in the
plan flagged a data problem in `references/index.astro`.

**What I decided instead, and why:** When I asked what should happen to a
citation referenced by more than one lecture, checking the actual rendered
output showed the references page displayed "Callback to Week 1." for Lally
et al. (2010) — silently dropping the real "Average 66 days..." note. The
existing dedup (`new Map(citations.map(c => [c.text, c])).values()`) kept
whichever lecture's citation object was processed *last*, so a later week's
throwaway callback note clobbered the original substantive one, with no error
anywhere: `pnpm check` was green the whole time because nothing asserted what
the note's *content* should be, only that a `.course-citation-note` span
existed. Fixing it required restructuring the dedup to carry every
contributing lecture's own note through (not picking one "winner"), which is
also exactly what Task 24's back-linking needed anyway.

**How I knew it was right:** Added `spec/references-page.test.ts` assertions
that the Lally citation's rendered `<li>` contains *both* "66 days" and
"Callback to Week 1" — a test that would have caught the original bug, and
now prevents the dedup logic from regressing to last-write-wins again.

**Landed in the harness as:** `src/pages/references/index.astro`'s
`byText` dedup (keeps every contributing lecture's `{note, lectureId}`, not
one), `spec/references-page.test.ts`'s "shows every contributing lecture's
own note" test.

**Commit:** [`9c56911`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/9c56911)

## 2026-09-17 — "How, not just what/why" was under-scoped in the plan itself, not just in the content

**Obvious approach:** Follow the plan's Task 9 exactly as written — add one
procedural "how" per week, to the single gap each week's task named (Week 2's
skincare, Week 5's attention-restoration procedure, and so on), leaving
Weeks 1/4/7/10/12 untouched as "already adequate."

**What I decided instead, and why:** After Week 2's human review, the
reviewer pointed out that showering, deodorant, and haircuts were still bare
definitions with no procedure — the plan's Task 9 had only fixed skincare,
the one gap it happened to name, even though `CLAUDE.md`'s own standing rule
already said "a how for every concept it teaches," not "a how for one
concept per week." The plan had quietly under-implemented its own rule. Since
the rule already existed and was correctly worded, the fix wasn't a new rule
— it was refusing to let a plan task's narrower phrasing override the
standing rule it was supposed to satisfy. I updated the plan file in place to
require full per-concept coverage going forward, then went back through
every already-committed week auditing every Definitions entry, not just the
one flagged gap.

**How I knew it was right:** The same gap kept recurring even after the
scope was declared "fixed" — Week 8's "Listening to someone" was defined with
zero procedure and slipped through an entire review cycle before the
reviewer caught it a second time. That repetition is what confirmed the
narrow, one-gap-per-week reading was the actual bug, not a one-off miss — and
it's why the fix is now recorded as a standing audit step (walk every
Definitions entry, not just Body bullets) rather than trusted to memory
again.

**Landed in the harness as:** `plans/2026-09-17-lecture-consistency-pass.md`
requirement 9, expanded in place; the corresponding rule in `CLAUDE.md` was
already correct and needed no change — the bug was in the plan's narrower
implementation of it, not the rule's own wording.

**Commit:** [`27c4170`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/27c4170), [`6d58742`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/6d58742)

## 2026-09-17 — A graded rubric asked for content the course never taught, and a load-bearing component had no weight at all

**Obvious approach:** Do exactly what Task 21 asked — add "Cleaning schedule"
and "Skincare" bullets to Assignment 3's "## The plan" section, since those
were the two components the plan named as missing against the marking table,
and move on.

**What I decided instead, and why:** A full read of the marking table against
"## The plan" during Phase 1 review showed the gap was four components, not
two — "Hygiene routine" (14%, the single largest criterion) and "Sleep
schedule" (10%) were also missing bullets. Separately, during human review,
the reviewer caught two more real bugs the plan never named: "Daily routine"
— the first, most load-bearing bullet in the whole plan — had no marking
criterion at all, and the "Meal plan" criterion graded "nutritional
coverage," content Week 4's lecture explicitly puts out of scope. Both are
worse than a missing bullet: a rubric that grades content nobody taught, or
that leaves the plan's foundational component unweighted, breaks the same
introduce-before-reference principle the whole plan exists to fix — just in
the assessment file instead of a lecture. I added a real "Daily routine"
criterion rather than leaving it implicit, and reworded "nutritional
coverage" to "food-group variety," grounded in what Week 2/4's Balanced meal
definition and Week 10's cooking method actually taught.

**How I knew it was right:** The weights had to keep summing to exactly 100
— `spec/assessment-scheme.test.ts`'s "marks every item with weighted criteria
summing to 100" test enforces this on every assessment already, so I couldn't
just add a criterion without deciding where its weight came from. Redistributed
2% from Budget into Daily routine per the reviewer's explicit direction (equal-
highest weighting, not a new total), then let that existing test confirm the
arithmetic rather than trusting my own addition.

**Landed in the harness as:** `src/content/assessments/assignment-3-adulting.md`'s
marking `criteria` array (13 criteria, still summing to 100) and "## The plan"
(13 bullets matching them 1:1); verified by the pre-existing
`spec/assessment-scheme.test.ts` weight-sum check plus updated component-count
assertions in the same file and `spec/treatment.test.ts`.

**Commit:** [`c8b5280`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/c8b5280)

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

## 2026-09-10 — The `Human review:` gate, exercised for real

This is not a new decision — it is what happened the first time the
previous entry's decision actually got used. I added the `Human review:`
field to `plan-feature` and `execute-plan` because I felt mechanical
checks like `spec/voice.test.ts` could never be enough to judge these
changes: a check can assert a banned phrase is absent, it cannot assert
that the replacement is actually good. That's the whole reason the gate
exists. This entry is the first real test of it.

**Obvious approach:** Treat the previous entry's open question as closed by
inspection — the gate field exists in both skills, so trust it will work
when a task actually needs it, the same way the rest of the plan's checks
were trusted once written.

**What I decided instead, and why:** Actually ran `execute-plan` against
`plans/2026-09-10-slop1521-voice-realignment.md` end to end and used the
gate as an operator, not just a reviewer. Task 11 (people bios) is where it
mattered: the agent's first pass only removed the banned jargon, exactly
as written, and `spec/voice.test.ts` passed — but the bios still read as
generic once the jargon clause was gone. I rejected it and asked for
something the task never specified: absurd, institutionally-serious
credentials for each tutor (a CS-student-turned-professor, a
Michelin-starred chef, a former runway model), because that is the
site's actual comedic mechanism and the plan's jargon-removal framing had
quietly narrowed a voice task into a find-and-replace task. A second round
still wasn't specific enough — I asked for more CV-style seriousness and
sharper amplification of the CS-student stereotype specifically — before
accepting.

**How I knew it was right:** the redraft-in-place path the gate was
designed around is exactly what happened, in two short rounds, without
needing to drop back into `plan-feature` or touch any spec file — because
what was wrong was the artifact's specificity, not the plan's approach.
That's the distinction the gate's Phase-4 rejection handling was built to
make (`plan-feature/SKILL.md`, `execute-plan/SKILL.md`), and today is the
first time it was actually tested against a real "this passes every check
and still isn't good enough" moment rather than reasoned about in the
abstract.

**What's still open, closed:** the previous entry logged this gate with no
task yet run through an accept/reject cycle. Every human-reviewed task in
this plan (4 through 12) went through at least one; Task 11 went through
two full rounds. The mechanism held without amendment.

**Landed in the harness as:** no new harness change this time — this entry
retires the open question the 2026-09-10 `4e0dcf5` entry left, using
`plans/2026-09-10-slop1521-voice-realignment.md`'s own executed Task 11 as
the evidence.

**Commit:** [`9e9b814...b450bcf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/9e9b814...b450bcf)
