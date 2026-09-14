# SLOP1521 Lab activities: collaborative, timed-block enrichment of all 12 Labs

- **Date:** 2026-09-14
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-14 (via
  `specs/2026-09-14-slop1521-lab-activities.md`)

## 1. Summary

The 12 existing Lab pages (`src/content/sessions/week-01.md` …
`week-12.md`) each carry a terse "Before the Lab / In the Lab / Afterwards"
body. This feature enriches all 12 with the collaborative, timed-block
activities specified in `prompts/lab-activities-all-weeks.md`: a standing
timing table inside "In the Lab" (same shape every week — framing, Activity
1 in groups, presentation, Activity 2 in pairs, debrief, wrap-up), with
concrete props/case studies/roles drawn from that doc, while preserving
every continuity thread the site already has running between Labs and
toward assignments. One sentence stating the no-laptops/no-screens-in-Lab
policy is added to the Labs overview page
(`src/pages/sessions/index.astro`). Full design rationale and the 8
resolved probes (Week 3 images, Week 4 exercise, Week 9 deliverable
mismatch, Week 11 spelling, table-vs-prose format, etc.) live in
`specs/2026-09-14-slop1521-lab-activities.md` §5 and are treated as settled
here, not re-litigated.

## 2. Requirements

### 2.1 Functional requirements

1. Each of `src/content/sessions/week-01.md` … `week-12.md` keeps its
   existing frontmatter shape (`title`, `description`, `week`, `date`,
   `teachers`, `spec`, `related`) and its existing three body headings in
   order (`## Before the Lab`, `## In the Lab`, `## Afterwards`).
2. Each file's `## In the Lab` section contains a markdown table with
   exactly these six rows, in order, with only the two Activity rows and
   the "Presentation"/"Discussion / debrief" rows' content cells naming
   that week's specific activity and where relevant a group/pair size:

   ```markdown
   | Time | Block |
   | --- | --- |
   | 0:00–0:05 | Introduction — this week's topic, tied back to last Lab |
   | 0:05–0:20 | Activity 1 (<size>): <name> |
   | 0:20–0:30 | Presentation / class discussion of Activity 1 |
   | 0:30–0:45 | Activity 2: <name> |
   | 0:45–0:55 | Discussion / debrief of Activity 2 (<size>) |
   | 0:55–1:00 | Wrap-up, reflection prompt reminder |
   ```

   The `(<size>)` annotation belongs on whichever row is where the
   grouping/pairing actually happens — for most weeks that's still the
   Activity row itself, but where an activity runs individually first and
   is only discussed in pairs/groups afterward (e.g. Week 1's individual
   self-assessment, discussed in pairs at the debrief step), the `(<size>)`
   moves to the "Discussion / debrief" row instead, matching the prose
   below the table. Directly below the table, a short **Introduction**
   paragraph (student's-perspective, one or two sentences) frames this
   week's topic and ties it back to the previous Lab, before the Activity
   1 prose begins — for Week 1 specifically, which has no previous Lab to
   tie back to, it instead frames what the semester's Labs are about.

3. Below that table, prose (in the site's existing deadpan voice) unpacks
   each activity's concrete props/case-study text/roles and what its
   presentation/debrief surfaces, drawn from the corresponding week section
   of `prompts/lab-activities-all-weeks.md`, matching that source doc's own
   level of detail and formatting — numbered lists for enumerated items
   (e.g. printed cards, questions, steps), bold inline sub-labels (e.g.
   **Discussion:**, **Presentation:**, **Wrap-up:**) for each named beat,
   rather than flattening the activity into undifferentiated prose.
4. Every existing forward/back continuity reference already present in a
   given week's `## Before the Lab` or `## Afterwards` is preserved
   verbatim in substance (may be reworded, not dropped) — see Task
   descriptions below for the exact sentence(s) each week must keep.
5. `src/pages/sessions/index.astro` gains exactly one new sentence stating
   the no-laptops/no-screens-in-Lab policy, placed in the existing
   introductory paragraph block, not repeated per week.
6. Week 4's body keeps exercise as an explicit, separately named
   deliverable alongside the sleep schedule (matching its existing
   `spec:` list, which requires both).
7. Week 9's graded deliverable stays "draft an opening message, cut it to
   one answerable question, test it against a peer's honest reaction" —
   the source doc's group activity (editing the 600-word message) becomes
   a warm-up Activity 1, and its "reading between the lines" exercise
   becomes supporting discussion material, not a competing deliverable.
8. Week 11 uses "Behavior" (US spelling) throughout, matching the site's
   existing lecture/Lab titles for that week.
9. Week 3's ranking activity is implemented with the five outfits
   described in prose (no image files added or referenced).
10. No file outside `src/content/sessions/*.md` and
    `src/pages/sessions/index.astro` is modified.
11. Any pair activity refers to the other participant as "one other
    student," never "partner" or "your partner" — applies to every week's
    Discussion/debrief prose and heading, not just Week 1.
12. Any Likert-style/agreement-scale rating used in an activity is spelled
    out as an explicit list of every point on the scale (e.g. 1 Strongly
    disagree … 5 Strongly agree), never just its two endpoints.
13. Where a week's activity output is explicitly revisited or reused in a
    later week (per the continuity references in §3 and the Task
    descriptions below — e.g. Week 1's self-assessment scores, reused by
    Week 12's "Then and now" activity), the earlier week's Wrap-up names
    that future revisit explicitly, not just the later week's Before-the-
    Lab.

### 2.2 Non-functional requirements

None beyond project defaults. No new dependencies, components, or content
collections; no accessibility/performance implications beyond an ordinary
markdown table rendering through the existing theme's table styles.

### 2.3 Out of scope

- Any change to `src/content/lectures/*`, `src/content.config.ts`, dates,
  or scheduling.
- Any change to `spec/weekly-structure.test.ts`, `spec/voice.test.ts`, or
  any other test file — the existing suite already enforces everything
  this feature must satisfy (heading order, non-empty `spec:`, banned
  terms).
- Any new route, page, component, or content collection.
- Sourcing or generating image assets for Week 3.
- Restructuring the `spec:` frontmatter list into a per-sub-activity
  checklist (wording accuracy only).

### 2.4 Assumptions

None outstanding — the assumptions in
`specs/2026-09-14-slop1521-lab-activities.md` §2.4 were confirmed with the
user during brainstorming and are carried forward as settled.

## 3. Existing code context

- **`src/content.config.ts`** — `sessions` collection schema (relevant
  excerpt, verified by reading): `week` (number 1–12), `date` (coerced
  date), `teachers` (optional array of `people` references), `.loose()` —
  the `.loose()` call is what allows `title`, `description`, `spec`
  (`string[]`), and `related` (`string[]`) to pass through as
  currently used in every session file, even though they aren't named in
  the base `courseNodeSchema`.
- **All 12 current session files** — read in full. Each currently has:
  frontmatter (`title`, `description`, `week`, `date`, `teachers`, `spec`,
  `related: [lectures/week-NN]`) and exactly three body headings
  (`## Before the Lab`, `## In the Lab`, `## Afterwards`), no tables, no
  timing, single-activity prose. Exact current continuity sentences that
  must survive each edit (verified by reading, quoted here so no task has
  to re-derive them):
  - Week 1 `Afterwards`: "Nothing is submitted from this Lab. The check-in
    is yours to keep; the area you nominated is the one the first few
    weeks of Labs lean on."
  - Week 2 `Before the Lab`: "Bring your nominated area from week 1's
    check-in, if it was hygiene..."; `Afterwards`: "...the artefact week
    4's Assignment 1 draws its hygiene product selection from."
  - Week 3 `Afterwards`: "...Assignment 1 asks for the same shape with
    photographic evidence attached."
  - Week 4 `Before the Lab`: "Bring your week 2 hygiene schedule; this Lab
    extends it to sleep and exercise, on the same model."; `Afterwards`:
    "...Assignment 1's hygiene product selection assumes the same
    fallback-first model, and Assignment 3 asks for both again in full."
  - Week 5 `Afterwards`: "...Assignment 2 (Touch Grass Field Study), due
    week 8, marks the outing this books."
  - Week 6 `Afterwards`: "Run the mechanism for a week before week 7's
    Lab. Bring back whether it held, and if not, where it failed."
  - Week 7 `Before the Lab`: "Bring the transcript from this week's
    lecture reflection..."
  - Week 9 note: "*(Lighter touch...role-play here uses the fictional
    character below, not personal disclosure. Taking a speaking role is
    optional — an observer role is always available.)*" is source-doc
    framing, not site content, but its opt-in intent must carry into the
    rewritten Week 9 body.
  - Week 10 `Afterwards`: "...Assignment 3's grocery and budget components
    both draw on the numbers calculated here."
  - Week 12 `Before the Lab`: "Bring every schedule and system built
    across the semester: the week 2 hygiene schedule, the week 4 sleep and
    exercise plan, the week 10 shopping schedule..."; `Afterwards`: "...it
    is the starting point for what Assignment 3 asks you to submit in
    full."
- **`spec/weekly-structure.test.ts`** — verified by reading in full.
  Relevant assertions this feature must keep passing: `assertHeadingsInOrder`
  against `["Before the Lab", "In the Lab", "Afterwards"]` per session page
  (line ~117); `expect(session.spec?.length).toBeGreaterThan(0)` per session
  (line ~123). No length minimum on any Lab body section (unlike lectures'
  ≥80-char Case Study check) — a table plus a few sentences per activity
  satisfies this with room to spare.
- **`spec/voice.test.ts`** — verified by reading. `BANNED_TERMS` (technical
  metaphors: "protocol", "debug", "handshake", "runtime", etc.),
  `FRAMING_PHRASES` ("taught as", "framed as", etc.), and `GENDERED_TERMS`
  ("girlfriend", "boyfriend", "the girl you like", "the guy you like") are
  checked against every rendered content page's text. New prose must avoid
  all three lists.
- **`src/pages/sessions/index.astro`** — verified by reading in full (23
  lines). Currently: an `<h1>`, a `<p class="lead">` (the collection
  description), one further `<p>` ("A Lab is where the week's material gets
  applied under supervision — bring the case study, expect a demonstration,
  leave with feedback on the one decision you were least sure about."), then
  `<SessionsGrid />`. The new policy sentence is added to that existing
  `<p>` or as an adjacent `<p>` immediately after it.
- **Test/build commands** (verified against `package.json`): `pnpm
  typecheck` runs `astro check`; `pnpm test` runs `pnpm build && vitest run
  spec` (the build step is required because `spec/weekly-structure.test.ts`
  and `spec/voice.test.ts` read rendered HTML from `dist/`, not source
  markdown, directly); `pnpm check` runs both. There is also a standalone,
  non-blocking `pnpm check:voice-tone` (always exits 0, flags
  sincerity-break tell-phrases like "but seriously" as advisory output only)
  — not part of `pnpm check`, but worth running once at the end as a sanity
  pass since this feature adds a large volume of new prose.
- **Source material**: `prompts/lab-activities-all-weeks.md`, read in full
  (224 lines) — every task below cites its exact week section by heading.

## 4. Approach

Thirteen independent, file-scoped tasks: one per session file (Weeks 1–12)
plus one for the Labs overview page. Each week's task:

1. Rewrites `## In the Lab` to insert the standing table (§2.1.2) followed
   by two short paragraphs of prose adapting that week's Activity 1 and
   Activity 2 from `prompts/lab-activities-all-weeks.md`, applying the
   resolutions from the spec (Week 3 no images, Week 4 exercise, Week 9
   deliverable, Week 11 spelling).
2. Lightly extends `## Before the Lab` and `## Afterwards` with the source
   doc's framing/wrap-up beats, while keeping every quoted continuity
   sentence from §3 above in substance.
3. Leaves frontmatter untouched except where `description`/`spec` wording
   needs a small accuracy tweak against the richer body (most weeks need
   none).

Because there's no application logic to unit-test, "tests first" for each
task means: confirm `pnpm check` is green before the edit (baseline), make
the edit, then confirm `pnpm check` is still green (the structural/voice
tests act as regression guards on content, exactly as they're designed to).
Content quality itself (voice, collaborative fidelity, readability) is not
mechanically checkable, so every task carries a `Human review:` line.

Tasks are independent (different files) and can be done in any order or
batched; each is still its own commit per `CLAUDE.md`'s one-commit-per-unit
rule.

## 5. Task breakdown

### Task 1: Week 1 Lab — Triage + Starting point check

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-01.md` with the standing table; Activity 1 =
  "Triage" (groups of 4, ten printed cards from doc lines 25–35, sort into
  Critical/Monitor/Stable, justify top and bottom pick); Activity 2 =
  "Starting point check" (individual self-assessment first, then discussed
  in pairs at the Discussion / debrief step — doc lines 40–42) —
  reconciled with the existing self-assessment-and-nomination deliverable
  already in this file (private self-assessment across the five areas,
  each scored on a 5-point agreement scale, then compared with one other
  student at category level only, each naming the area expected to improve
  fastest). The table's Activity 2 row carries no size annotation since the
  activity itself is individual; `(pairs)` sits on the "Discussion /
  debrief" row instead, per §2.1.2. The table's first row is "Introduction"
  (not "Framing"), and — because Week 1 has no previous Lab — its content
  cell drops the "tied back to last Lab" clause entirely (reads just
  "Introduction — this week's topic"); every other week keeps that clause.
  Immediately below the table a short Introduction paragraph, written from
  the student's perspective, frames what this Lab (and the semester's Labs
  generally, since there is no prior Lab to tie back to) is about, before
  the Triage prose begins. The self-assessment's 1–5 scale is spelled out
  as an explicit five-item list (Strongly disagree / Disagree / Neither
  agree nor disagree / Agree / Strongly agree), not just its two endpoints.
  `## Before the Lab` and `## Afterwards` keep their existing sentences
  (§3), lightly extended with the doc's "starting point, not a judgement"
  wrap-up framing (doc line 43). The Wrap-up also names the week 12
  revisit explicitly (Task 12's "Then and now" activity compares these
  same five scores to what's true by week 12), so the forward reference is
  stated at the point the scores are first taken, not just in Task 12.
- **Files touched:** `src/content/sessions/week-01.md`.
- **Tests first (red):** None new. Baseline: run `pnpm check` before
  editing and confirm it is currently green.
- **Implementation (green):** Edit the file's body only, per Description.
  Frontmatter (`spec:`, `description`) unchanged — the existing spec items
  ("the check-in is completed for all five areas", "one area is nominated
  as this semester's first priority") already match the reconciled Activity
  2.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check` passes.
  - Rendered `dist/sessions/week-01/index.html` contains all three headings
    in order (verified by re-running `spec/weekly-structure.test.ts`).
  - The rewritten body contains no term from `BANNED_TERMS`,
    `FRAMING_PHRASES`, or `GENDERED_TERMS` in `spec/voice.test.ts`.
  - The sentence "Nothing is submitted from this Lab..." (or an equivalent
    preserving that meaning) still appears in `## Afterwards`.
  - The table has exactly six rows in the order specified in §2.1.2.
- **Human review:** Show the user the diff of `week-01.md` (or the
  rendered page). Pass = the Triage card list and Starting-point-check read
  as specific/recognisable stereotypes (not generic), stay in the site's
  deadpan register, and the reconciliation with the existing nomination
  deliverable reads as one coherent activity, not two bolted together.
- **Depends on:** None.

### Task 2: Week 2 Lab — Maintenance calendar + Peer check

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-02.md`. Activity 1 = "Maintenance calendar"
  (groups of 3, doc lines 48–51: draft a shared seven-day grid covering
  shower/hair wash/laundry/haircut-due, one group's calendar goes on the
  board for critique). Activity 2 = "Peer check" (pairs, doc lines 53–54:
  each person fills in their own real calendar privately, swaps with a
  partner for one honest one-line comment). Preserve the existing
  fallback-first deliverable (a written schedule naming a frequency per
  task plus a stated fallback for a bad week) as the outcome of Activity 2,
  since that's what the existing `spec:` list requires.
  `## Before the Lab` keeps "Bring your nominated area from week 1's
  check-in..."; `## Afterwards` keeps "...the artefact week 4's Assignment
  1 draws its hygiene product selection from."
- **Files touched:** `src/content/sessions/week-02.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (existing `spec:` already matches the reconciled Activity 2).
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 1's, applied to
  `week-02.md`/`dist/sessions/week-02/`: `pnpm check` green, heading order
  intact, no banned/framing/gendered terms, "week 4's Assignment 1"
  reference preserved, six-row table present.
- **Human review:** Diff/rendered page for `week-02.md`. Pass = the
  calendar-critique and peer-check activities read as genuinely
  collaborative (not solitary busywork retrofitted with a group label), and
  the fallback-first requirement from the existing `spec:` is still clearly
  the thing being produced.
- **Depends on:** None.

### Task 3: Week 3 Lab — Ranking exercise + Assemble three outfits

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-03.md`. Activity 1 = "Ranking exercise"
  (groups of 4, doc lines 61–71) — the five outfits (business-casual,
  head-to-toe loungewear, overdressed-in-a-suit-with-novelty-tie, gym kit,
  slept-in-look) are **described in prose**, not sourced as images (per
  spec resolution #4); groups rank them for an assigned occasion, then
  rotate occasions and re-rank, then present their least-sure ranking.
  Activity 2 = "Assemble three outfits" (individual, shared in pairs, doc
  line 73) — kept as the existing rehearsal-for-Assignment-1 deliverable,
  now with a partner offering one suggestion per outfit.
  `## Afterwards` keeps "...Assignment 1 asks for the same shape with
  photographic evidence attached."
- **Files touched:** `src/content/sessions/week-03.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; "photographic evidence" Assignment-1
  reference preserved; six-row table present; no `<img>`/image reference
  added for the five outfits.
- **Human review:** Diff/rendered page for `week-03.md`. Pass = the five
  outfits are distinguishable and recognisable from prose alone (no image
  needed to understand the joke), and the existing three-outfits-for-three-
  occasions deliverable still reads as the graded rehearsal it is.
- **Depends on:** None.

### Task 4: Week 4 Lab — Jordan's Week case study + sleep/exercise plan

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-04.md`. Activity 1 = case-study analysis
  (groups of 4, doc lines 81–96: the full "Jordan's Week" case study
  verbatim from the source doc, groups analyse what's realistic vs.
  wishful thinking, what fails first, and present their single best fix).
  Activity 2 = "Build your own plan" (individual, checked in pairs, doc
  line 98) — per spec resolution #2/R8, explicitly keep **both** a target
  bedtime + stated fallback **and** an exercise plan with a stated
  frequency and named activity as co-equal deliverables (the doc's own
  wording already includes both in this line; do not drop the exercise
  half). Partners reject any plan reading as "sleep more" or "exercise
  more."
  `## Before the Lab` keeps "Bring your week 2 hygiene schedule..."; `##
  Afterwards` keeps "...Assignment 1's hygiene product selection assumes
  the same fallback-first model, and Assignment 3 asks for both again in
  full."
- **Files touched:** `src/content/sessions/week-04.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (existing `spec:` already names both sleep and exercise
  deliverables).
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; both "Assignment 1" and "Assignment 3"
  references preserved; six-row table present; body explicitly names an
  exercise plan with a stated frequency, not just sleep.
- **Human review:** Diff/rendered page for `week-04.md`. Pass = the Jordan
  case study reads verbatim-faithful to the source doc's tone, and the
  exercise deliverable is as prominent as the sleep deliverable (not an
  afterthought clause).
- **Depends on:** None.

### Task 5: Week 5 Lab — Field observation + Field guide

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-05.md`. Activity 1 = "Field observation"
  (pairs, outdoors, 15 min, doc lines 105–108: record one thing seen, one
  heard, one brief interaction; return and share one observation each).
  Activity 2 = "Field guide" (groups of 4, doc lines 110–111: compile the
  class's observations into a three-tip "field guide to outside"). This
  supplements, not replaces, the existing outing-booking deliverable — the
  existing Lab already books the outing itself (`spec:` requires a booked
  outing with date/time/activity and a non-CS attendee); fold that into
  the wrap-up as the thing the field observation warms the group up for.
  `## Afterwards` keeps "...Assignment 2 (Touch Grass Field Study), due
  week 8, marks the outing this books."
- **Files touched:** `src/content/sessions/week-05.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (existing `spec:` still describes the booked outing, produced
  during/after the two doc activities rather than instead of them).
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; "Assignment 2 ... due week 8" reference
  preserved; six-row table present; the outing-booking deliverable named in
  `spec:` is still clearly produced somewhere in the rewritten body.
- **Human review:** Diff/rendered page for `week-05.md`. Pass = the indoor
  field-guide-compiling activity and the outdoor observation pair activity
  don't crowd out the graded outing-booking step — a reader should still
  be able to tell what actually gets booked and by when.
- **Depends on:** None.

### Task 6: Week 6 Lab — Hobby brainstorm + Pick a game

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-06.md`. Activity 1 = "Brainstorm" (groups of
  4, paper only, doc lines 118–121: mind-map one non-computer hobby, pick
  the most promising, pitch it in 30 seconds with no technical language —
  tutor calls it out live if it slips in). Activity 2 = "Pick a game"
  (pairs, doc lines 123–124: choose one item from the named list — cards,
  jigsaw, dominoes, checkers, crossword, Jenga — and play for the block).
  This supplements the existing device-free-mechanism deliverable (`spec:`
  requires a named device-free window enforced by a physical mechanism,
  not a rule) — keep that as what groups design using what they learned
  from the brainstorm/game session about not reaching for a phone.
  `## Afterwards` keeps "Run the mechanism for a week before week 7's Lab.
  Bring back whether it held, and if not, where it failed."
- **Files touched:** `src/content/sessions/week-06.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms (note: "no technical language allowed" is
  in-fiction framing the tutor enforces on students, not the site breaking
  character — must still avoid any actual banned term appearing in the
  rendered prose itself); "Run the mechanism for a week..." reference
  preserved; six-row table present.
- **Human review:** Diff/rendered page for `week-06.md`. Pass = the
  brainstorm/game activities read as genuinely screen-free and specific
  (named games, not "a board game"), and the device-free-mechanism
  deliverable is still clearly what's designed and carried forward.
- **Depends on:** None.

### Task 7: Week 7 Lab — Small talk stations + Reading the room

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-07.md`. Activity 1 = "Small talk stations"
  (rotating pairs, 15 min, doc lines 131–133: 30 seconds of deliberate
  silence before each 2-minute round, prompt = name/hobby/most recent
  trip, rotate three times). Activity 2 = "Reading the room" (groups of 4,
  doc lines 136–137: one "actor" performs an ambiguous social cue —
  repeatedly checking their phone, one-word answers, looking at the door —
  rest of group has 60 seconds to name what's happening and suggest a
  graceful exit line). This supplements the existing three-stalled-
  exchanges deliverable (`spec:` requires three stalled exchanges each
  given a working follow-up line, one tested in a real conversation before
  next Lab) — fold that in as a continuation of the small-talk-stations
  material.
  `## Before the Lab` keeps "Bring the transcript from this week's lecture
  reflection...".
- **Files touched:** `src/content/sessions/week-07.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; "lecture reflection" reference preserved;
  six-row table present; the three-stalled-exchanges deliverable from
  `spec:` still clearly present in the rewritten body.
- **Human review:** Diff/rendered page for `week-07.md`. Pass = the
  silence-before-talking beat and the reading-the-room role-play read as
  genuinely awkward-in-a-specific-way (the point of the joke), not vague.
- **Depends on:** None.

### Task 8: Week 8 Lab — Unanswered message role-play + Incident report

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-08.md`. Activity 1 = role-play (groups of 4,
  doc lines 144–147: one student plays a friend left on read for three
  days, another plays the person who left them on read, rest of group
  calls out the exact moment an apology goes wrong — e.g. "I'm sorry you
  felt that way, but—"). Activity 2 = "Incident report" (pairs, doc lines
  149–150) — this is the existing graded deliverable already in the file
  (a real or invented mix-up written up with cause traced to a specific
  message/step, never to character; partners review each other's "what
  went wrong" line).
  `## Afterwards` keeps the existing structural-fix proposal beat (a single
  channel, rotating organiser, standing weekly slot — doc line 152's "Best
  example goes up as this week's model answer" can be folded in as an
  additional wrap-up beat).
- **Files touched:** `src/content/sessions/week-08.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (existing `spec:` already matches Activity 2 exactly).
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; "traced to... rather than to any one
  person's character" framing preserved; six-row table present.
- **Human review:** Diff/rendered page for `week-08.md`. Pass = the
  role-play's "exact moment it goes wrong" beat lands as specific and
  recognisable, and the incident-report deliverable's blame-free framing is
  unweakened by the added role-play.
- **Depends on:** None.

### Task 9: Week 9 Lab — 600-word message edit + opening-message deliverable

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-09.md`, applying spec resolution #5/R7.
  Activity 1 (warm-up) = "The 600-word message" (groups of 4, **opt-in
  roles, observer role always available** — preserve this opt-in framing
  from doc line 157/159 explicitly in the prose) — one student reads the
  600-word message (doc lines 159–162) aloud, the group edits it live down
  to one sentence. Activity 2 (the graded deliverable, kept from the
  existing file) = draft an opening message, edit it down to one clear
  answerable question, test it against a peer's honest reaction. The doc's
  "Reading between the lines" three-exchange exercise (doc lines 166–170)
  is folded in as supporting discussion/debrief material for Activity 1's
  presentation slot, not a third deliverable. All language stays neutral
  per `GENDERED_TERMS` — no "girlfriend/boyfriend/the girl or guy you
  like"; use "someone you'd message" / "a profile you'd realistically
  message" (already the existing file's phrasing).
  `## Afterwards` keeps "Nothing is submitted. What leaves the Lab is a
  message you would actually send, and a peer's honest read on whether it
  invites a reply." and the existing "reflection stays optional" note.
- **Files touched:** `src/content/sessions/week-09.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (existing `spec:` already matches the preserved deliverable).
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; body
  contains **zero** matches for any `GENDERED_TERMS` entry or other banned
  term; "Nothing is submitted..." reference preserved; six-row table
  present; the opt-in/observer-always-available framing is stated
  explicitly, not implied.
- **Human review:** Diff/rendered page for `week-09.md`. Pass = the
  opt-in framing genuinely reads as low-pressure (matching the file's
  existing "lighter touch" note), the 600-word message group-edit warm-up
  doesn't overshadow the individual deliverable, and no gendered phrasing
  slipped in from the source doc's original wording.
- **Depends on:** None.

### Task 10: Week 10 Lab — Budget triage + Grocery list

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-10.md`. Activity 1 = "Budget triage" (groups
  of 4, doc lines 177–180: given a fixed weekly budget across
  groceries/transport/subscriptions/emergency-takeaway/savings, cut 20%
  and decide where it comes from; present the most controversial cut).
  Activity 2 = "Grocery list" (pairs, doc lines 182–183) — kept as the
  existing standing-schedule/run-out-calculation deliverable already in
  the file, using this week's meal-plan brief to draft a real one-week
  list repeating no meal more than twice, instant noodles under the stated
  limit.
  `## Afterwards` keeps "...Assignment 3's grocery and budget components
  both draw on the numbers calculated here."
- **Files touched:** `src/content/sessions/week-10.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; "Assignment 3's grocery and budget
  components" reference preserved; six-row table present; the existing
  run-out-calculation/standing-schedule deliverable from `spec:` still
  clearly present.
- **Human review:** Diff/rendered page for `week-10.md`. Pass = the
  budget-triage group activity and the grocery-list pair activity read as
  distinct, sequential steps (triage first, then the individualised list),
  not duplicated content.
- **Depends on:** None.

### Task 11: Week 11 Lab — Mock interview + The shrink-down

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-11.md`. Activity 1 = "Mock interview" (pairs,
  doc lines 190–198: the five listed questions asked in order, then swap;
  feedback limited to one thing that worked and one specific fix). Activity
  2 = "The shrink-down" (groups of 4, doc lines 200–210: cut the given
  rambling email down to three sentences without losing the actual
  request — more-time-needed, roughly how much, request for a response —
  shortest version that keeps the ask wins, goes on the board). This
  supplements the existing redraft-a-professional-email deliverable
  (`spec:` requires a professional email drafted at least twice, final
  draft one paragraph or less) — fold that in as the individual follow-up
  to the group shrink-down exercise. **Use "Behavior" (US spelling)
  throughout** per R9 — the file's own title is already "Workplace
  Behavior"; do not introduce "Behaviour" anywhere in the body.
  `## Before the Lab` keeps "Bring one real piece of professional
  correspondence you need to send this week...".
- **Files touched:** `src/content/sessions/week-11.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged (title already correctly spelled "Behavior").
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; zero occurrences of "Behaviour" (UK
  spelling) anywhere in the rewritten body; "Bring one real piece of
  professional correspondence..." reference preserved; six-row table
  present.
- **Human review:** Diff/rendered page for `week-11.md`. Pass = the mock
  interview and shrink-down activities read as genuinely useful rehearsal
  for the existing email-redraft deliverable, not disconnected filler.
- **Depends on:** None.

### Task 12: Week 12 Lab — Then and now + Showcase

- **Description:** Rewrite `## In the Lab` in
  `src/content/sessions/week-12.md`. Activity 1 = "Then and now"
  (individual, then pairs, doc lines 217–218: compare Week 1 self-
  assessment to today, pick the most-changed thing, back it with evidence —
  something actually done, not an intention). Activity 2 = "Showcase"
  (groups of 4, doc lines 220–221: each group presents one member's biggest
  change as a short case study, in the same shape as Week 8's incident
  report, but with a good outcome). This supplements the existing
  Assignment-3-dry-run deliverable (`spec:` requires a draft week-long plan
  covering all seven Assignment 3 components, plus one Final Exam station
  rehearsed under its time limit) — sequence the dry run after the
  then-and-now/showcase activities as the Lab's main graded work.
  `## Before the Lab` keeps "Bring every schedule and system built across
  the semester..."; `## Afterwards` keeps "...it is the starting point for
  what Assignment 3 asks you to submit in full." Doc line 223's closing
  beat ("read the course's opening line aloud once, without further
  comment") becomes the final wrap-up line.
- **Files touched:** `src/content/sessions/week-12.md`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** Body-only edit per Description; frontmatter
  unchanged.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; heading order intact; no
  banned/framing/gendered terms; both the "schedule and system" and
  "starting point for Assignment 3" references preserved; six-row table
  present; the Assignment-3-dry-run and exam-station-rehearsal deliverables
  from `spec:` still clearly present and sequenced after the two new
  activities.
- **Human review:** Diff/rendered page for `week-12.md`. Pass = the
  semester-closing tone lands (this is the last Lab), the showcase activity
  doesn't turn into a second Week-8 rerun, and the existing
  `spec/weekly-structure.test.ts` "closes the loop" check (searches
  `lectures/week-12` for "desk"/"sock", unaffected by this file) still
  passes.
- **Depends on:** None.

### Task 13: Labs overview — no-laptops/no-screens policy sentence

- **Description:** Add one plain sentence to
  `src/pages/sessions/index.astro` stating that no laptops or screens are
  used in any Lab, ever — a stated standing policy, not just a Week 6
  topic. Insert into the existing `<p>` that begins "A Lab is where the
  week's material gets applied under supervision..." (line 16–20 of the
  current file), or as an immediately following `<p>`. Do not repeat this
  statement on any individual week's Lab page.
- **Files touched:** `src/pages/sessions/index.astro`.
- **Tests first (red):** None new; baseline `pnpm check` green before edit.
- **Implementation (green):** One-sentence addition to the existing
  markup; no new props, no new imports, no structural change to the
  `BaseLayout`/`SessionsGrid` usage.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` green; the rendered
  `dist/sessions/index.html` contains the new sentence exactly once; no
  banned/framing/gendered terms introduced.
- **Human review:** Diff/rendered page for `sessions/index.astro`. Pass =
  the sentence reads as a plain, deadpan statement of policy (not an
  apologetic aside, not a joke that undercuts it), consistent with the
  page's existing register.
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [ ] Every task in §5 (Tasks 1–13) complete and accepted.
- [ ] `pnpm test` passes (runs `pnpm build && vitest run spec`, covering
  `spec/weekly-structure.test.ts` and `spec/voice.test.ts`).
- [ ] `pnpm check` passes (typecheck + test).
- [ ] Manually verified: `agent-browser` (or equivalent) loaded at least
  one representative Lab page (recommend `week-01` and `week-09`, the two
  with the most delicate reconciliation) at both marking viewports (1920×
  1080, 390×844), confirming the new table renders legibly and the prose
  reads correctly at both widths.
- [ ] `pnpm check:voice-tone` run once at the end as an advisory pass over
  the full new prose volume (non-blocking, but review any flagged lines).
- [ ] Every requirement in §2.1/§2.2 is covered — see §7.
- [ ] Every task's `Human review:` line has been shown to the user and
  explicitly accepted for that specific file — not inferred from moving on
  to the next task.
- [ ] No item remains in §8.

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (frontmatter/heading shape preserved) | Tasks 1–12 |
| 2.1.2 (standing six-row table) | Tasks 1–12 |
| 2.1.3 (prose unpacking activities) | Tasks 1–12 |
| 2.1.4 (continuity references preserved) | Tasks 1–12 (each cites its exact sentences) |
| 2.1.5 (no-laptops policy sentence) | Task 13 |
| 2.1.6 (Week 4 exercise co-equal) | Task 4 |
| 2.1.7 (Week 9 deliverable reconciliation) | Task 9 |
| 2.1.8 (Week 11 US spelling) | Task 11 |
| 2.1.9 (Week 3 no images) | Task 3 |
| 2.1.10 (no files outside the two named paths touched) | All tasks (Files touched lists) |
| 2.1.11 ("one other student," not "partner") | Tasks 1–12 (any pair activity) |
| 2.1.12 (agreement scales spelled out in full) | Tasks 1–12 (any Likert-style rating) |
| 2.1.13 (Wrap-up names a later week's revisit) | Task 1 (names Task 12's revisit); revisit any other week's Task if a similar forward reference is identified during that task's Human review |
| 2.2 (non-functional: none beyond defaults) | N/A — no task required |

## 8. Risks / open questions

None.
