# Assessment overhaul

- **Date:** 2026-09-19
- **Status:** Draft
- **Approved by user:** yes — 2026-09-19

## 1. Problem / intent

The five assessment pages (Weekly Reflections, A1, A2, A3, Final Exam) are
inconsistent in depth and connectedness. Concretely:

- `related` links (which drive the "Related" graph aside) are sparse or
  absent on four of five assessments, so a student reading an assessment
  brief has no way to jump back to the lectures it actually draws on.
- Nothing states, machine-checkably, which weeks' content or which
  numbered learning outcome an assessment covers.
- A1 and A2's grading criteria are three bare percentage weights with no
  description of what separates an HD from a P — inconsistent with A3's
  much richer "HD — every component is present, internally consistent,
  and would survive..." style, and with the practice exam's per-station
  rubrics.
- A1 and A2 in particular read weaker than A3 because they don't visibly
  engage with the one piece of real research the course teaches on their
  own topics (enclothed cognition for A1; mere-presence, exercise
  planning, and the small-talk formula for A2) — the connections are
  incidental (A2's "no laptop" restriction touches Week 6's mere-presence
  effect by accident, not by design) rather than deliberate.
- The Final Exam's scope (weeks 1–4, 7–8, 10–12) looks arbitrary/partial
  for a cumulative final exam, with no stated reason, and its Station 4
  format isn't explicitly tied to Week 8's incident-report format despite
  reading almost identically.
- The course's learning outcomes (stated on the homepage) are an
  unnumbered list with no way to reference "which LOs does this
  assessment cover" from anywhere else in the site.
- Due dates render as `HH:MM, DD MM YYYY` with no indication of which
  teaching week (or the exam period) that falls in.
- There is no FAQ addressing the naive, CS-student-brain questions a real
  student would actually have about each specific assessment's brief.

This spec turns "improve the assessments" into a concrete, self-checking
design: new frontmatter fields for content scope and learning outcomes,
corrected `related` links, grade bands matching A3's format, specific
lecture/lab tie-ins for A1–A3, an honest explanation of the exam's scope,
and a per-assessment FAQ — all verified against the actual lecture/lab
content that already exists, not invented.

## 2. Requirements

### 2.1 Functional requirements

**Schema (`src/content.config.ts`, `assessments` collection)**

1. Add `contentScope: { display: string, weeks: number[] }` to every
   assessment. `weeks` is the flat list of lecture weeks the assessment's
   content draws on; `display` is the human-readable string rendered in
   the specsheet (e.g. `"Weeks 1-4"`, or `"Weeks 1-4, 7-8, 10-12"` for the
   non-contiguous Final Exam case).
2. Add `learningOutcomes: number[]` to every assessment — 1-indexed
   positions into `courseMeta.learningOutcomes` (see below), e.g. A1:
   `[1, 2]`.
3. Add optional `dueWeekLabel: string` (same override pattern as the
   existing `dueDisplay`) — e.g. `"Week 4"`, `"Exam Period"`. Left unset
   on Weekly Reflections, whose existing `dueDisplay` already states its
   week range.
4. Assign concrete values:
   - Weekly Reflections: `contentScope.weeks = [1..12]`, `display: "Weeks
     1-12"`; `learningOutcomes: [1,2,3,4,5,6,7,8,9]`; no `dueWeekLabel`.
   - A1: `weeks: [1,2,3,4]`, `display: "Weeks 1-4"`;
     `learningOutcomes: [1,2]`; `dueWeekLabel: "Week 4"`.
   - A2: `weeks: [5,6,7]`, `display: "Weeks 5-7"`;
     `learningOutcomes: [3,4,5,6]`; `dueWeekLabel: "Week 8"`.
   - A3: `weeks: [1..12]`, `display: "Weeks 1-12"`;
     `learningOutcomes: [1,2,3,4,7,8,9]`; `dueWeekLabel: "Week 12"`.
   - Final Exam: `weeks: [1,2,3,4,7,8,10,11,12]`, `display: "Weeks 1-4,
     7-8, 10-12"`; `learningOutcomes: [1,2,3,4,5,6,7,8,9]`;
     `dueWeekLabel: "Exam Period"`.

**`related[]` correction**

5. Rewrite every assessment's `related[]` to include exactly the lecture
   ids matching its `contentScope.weeks` (e.g. A2's `related` becomes
   `lectures/week-05`, `lectures/week-06`, `lectures/week-07`), replacing
   the current sparse/absent lists. Any other existing non-lecture
   `related` entries are preserved.

**Specsheet rendering (`src/pages/assessments/[slug].astro`,
`src/components/AssessmentsGrid.astro`)**

6. The specsheet's Due row appends `, {dueWeekLabel}` when the field is
   present (both on the assessment detail page and the main assessment
   listing page).
7. Add a "Content scope" row rendering `contentScope.display`.
8. Add a "Learning outcomes" row rendering as "LO N–M" (or a
   comma/en-dash-separated list for non-contiguous sets), with each
   number linking to `/#lo-N` on the homepage.

**Homepage (`src/course-config.ts`, `src/pages/index.astro`)**

9. Reorder `courseMeta.learningOutcomes` to:
   1. personal hygiene and daily routines
   2. weather- and occasion-appropriate attire
   3. sleep, nutrition, and exercise
   4. activities and interests outside academic work
   5. social interaction
   6. social cues
   7. maintaining friendships and other interpersonal relationships
   8. routines that support independent life
   9. conducting oneself professionally

   (Exact outcome sentence text is unchanged — only array order moves —
   so `spec/homepage.test.ts`'s substring assertions keep passing.)
10. Render the learning outcomes as an `<ol>` (native numbering) instead
    of `<ul>`, with `id="lo-1"` … `id="lo-9"` on each `<li>` in list
    order, so assessment pages can link to a specific outcome.

**Assessment index page overview (`src/pages/assessments/index.mdx`)**

11. Replace the placeholder line "Weights should sum to 100." with a
    short overview paragraph, written in the course's established voice
    (same register as a lecture/lab Introduction — deadpan, concrete,
    no technical metaphor), describing the shape of the assessment scheme
    (five items: twelve dropped-lowest weekly reflections plus three
    assignments plus a final exam) before the `<AssessmentsGrid />`.

**Grade bands**

12. Add one holistic HD/D/C/P/N "How each band reads" table to A1, A2,
    and the Final Exam's real page (`assignment-1-makeover.md`,
    `assignment-2-touch-grass.md`, `final-exam.md`), in the same format
    as A3's existing table — in addition to, not replacing, each
    assessment's existing weighted-criteria table.

**A1 content tie-in**

13. Add one line to A1's brief connecting the "Justification" criterion
    to enclothed cognition (Week 3): justification may draw on why
    clothing affects more than appearance, not just occasion-matching.

**A2 content tie-ins** (all three fold under the existing **Reflection
(35%)** criterion — no new marking categories, no change to A2's three
existing criteria weights)

14. Add: "State whether you brought your phone, whether you checked it,
    and connect this to Week 6's finding on the mere-presence effect
    (Ward et al., 2017)."
15. Add: "State whether this activity met your Week 4 exercise plan's
    stated frequency and named activity for the week — and if it didn't,
    what you'd adjust."
16. Add: "For at least one of the two non-CS people, name one thing you
    learned using the small-talk formula from Week 7 (their name, a
    hobby, a recent trip)."
17. Add one line to Week 4's Lab (`src/content/sessions/week-04.md`)
    noting that the sleep/exercise plan built in this Lab is what A2
    later asks students to check their activity against.

**A3 content tie-ins**

18. Append "...appropriate to the activity and the day's forecast" to
    "The date" component's description (closes the weather-appropriate-
    attire LO gap; reinforces Week 3's weather-mismatch example without
    duplicating it).
19. Add one explicit line noting the hangout and the interview should not
    both be scheduled for the same Wednesday afternoon.

**A3 reweight (and the bug it surfaces)**

20. Change A3's `marking.criteria`: Grocery logistics 6% → 8%, Exercise
    8% → 6% (net zero; total remains 100).
21. Fix `src/content/lectures/week-10.mdx`'s Body section, which
    currently states "Budget (12%)" and "Grocery logistics (6%)" — neither
    matches A3's real criteria even before this reweight (Budget is
    actually 10%). Update the stated percentages to the corrected true
    values (Budget 10%, Grocery logistics 8%).

**Final Exam**

22. Add explanatory text (on the real exam page) for why the exam's scope
    isn't the full semester: weeks 5, 6, and 9 are excluded because their
    evidence is inherently extended-duration or self-reported (15+
    minutes outdoors, a week of device discipline, an opening message
    sent into the world) and can't be compressed into a ~10-minute
    station without becoming fake; the weeks that are kept (1–4, 7, 8,
    10–12) are kept specifically because they reduce to a live,
    observable action worth re-checking under real-time pressure —
    independent of whether that content was already assessed elsewhere.
23. Add an explicit hobby/interest check to Station 1 (real exam page and
    practice exam), attributed to Week 6's Lab brainstorm activity, to
    directly cover LO4 rather than stretching Station 5's cooking to
    imply it. This requires:
    - Updating Station 1's real-exam description to mention the check.
    - Rebalancing the practice exam's Station 1 rubric from its current
      4 criteria (4/4/4/3 = 15) to 5 criteria summing to 15, and updating
      its model solution, poor solution, examiner's notes, and band
      descriptions to reflect the fifth criterion.
24. Add explicit text (real exam page and practice exam: description,
    solutions, rubric, notes) tying Station 4's diagnose-then-respond
    format to Week 8's incident-report structure (what was agreed / what
    happened / the actual reason).

**Per-assessment FAQ**

25. Add a "FAQ" section to each of the 5 assessment content files (not a
    course-wide FAQ), with at least 2 naive, CS-student-perspective
    questions specific to that assessment's brief, written in the
    course's established voice: mundane concrete specifics, no technical
    metaphor, no jargon in backticks (per `spec/voice.test.ts`'s F2/F3
    rules).

**Harness / spec checks**

26. Replace `spec/assessment-scheme.test.ts`'s currently-hardcoded,
    unwired `EXPECTED_COVERAGE` table with real assertions against the
    new `contentScope` field:
    - every value in `contentScope.weeks` is ≤ the assessment's own
      `week` field (no assessment examines content from a week later
      than its own);
    - the assessment's `related` lecture refs exactly match
      `contentScope.weeks` (no missing, no extra week).
27. Add an assertion that every `learningOutcomes` index is within 1–9.
28. Add an assertion that every assessment publishes an FAQ section with
    at least 2 question/answer pairs.
29. Extend the existing "publishes five band descriptors" check
    (currently only run against A3) to also run against A1, A2, and the
    real Final Exam page.

### 2.2 Non-functional requirements

None beyond project defaults (`pnpm check` green, voice/register rules in
`spec/voice.test.ts` respected, visual check at 1920×1080 and 390×844 per
`CLAUDE.md`).

### 2.3 Out of scope

- Any change to the five assessments' own top-level weights (15/20/20/15/30
  — Weekly Reflections/A1/A2/A3/Final Exam respectively).
- Any change to A3's weighted criteria other than the Grocery
  logistics/Exercise swap in requirement 20.
- A general cross-content "lecture-states-a-percentage-that-must-match-
  the-real-assessment-weight" harness check — the one instance found
  (Week 10's Budget/Grocery percentages) is fixed directly (requirement
  21), but building a generic checker for this class of bug is left for a
  future pass, not this one.
- Restructuring the Weekly Reflections page (already correctly scoped at
  weeks 1–12 and needs no `related`/scope correction beyond the new
  fields).
- Any change to the "Daily routine" vs "Sleep schedule" fallback overlap
  in A3 beyond confirming the existing wording already distinguishes them
  (user reviewed and chose to leave as-is).

### 2.4 Assumptions (confirmed)

- "Content scope" and "learning outcomes" are represented as structured
  frontmatter (`contentScope.weeks[]`, `learningOutcomes[]`) rather than
  free-text-only, specifically so `related` links and LO ranges can be
  harness-checked against them — confirmed via AskUserQuestion.
- The exam-scope rationale is "live-checkable action vs. extended-
  duration/self-reported evidence," not "not yet assessed elsewhere" —
  confirmed after the user pointed out the latter contradicts the exam
  re-testing hygiene/outfits/cooking that A1/A3 already assessed.
- LO4 gets a direct Station 1 check (hobby/interest) rather than only a
  strengthened framing of Station 5's cooking — confirmed by user
  preference for the more invasive but more honest fix.
- The FAQ is per-assessment, not a single course-wide FAQ page — stated
  explicitly by the user, including as an out-of-band correction mid-
  conversation.
- The three A2 tie-in additions fold under A2's existing "Reflection
  (35%)" criterion; the user's own note referred to this as "A3
  additions" but meant A2's, since A3 has no Reflection criterion —
  confirmed with the user.
- LO cross-links from assessment specsheets go to homepage anchors
  (`#lo-N`), not plain text — confirmed via AskUserQuestion.
- Grade bands use one holistic per-assessment table (A3's format), not
  per-criterion tables (practice-exam's format) — confirmed via
  AskUserQuestion.

## 3. Existing context

- `src/content.config.ts` / `astro-course-university`'s `courseNodeSchema`
  — assessments currently have `title`, `description`, `week`, `due`,
  `dueDisplay?`, `weight`, `marking` (weighted|holistic, `.superRefine`
  enforcing criteria sum to 100), `spec[]`, `related[]` (`.loose()`
  schema, so extra frontmatter is currently silently accepted but
  unvalidated and unrendered).
- `src/pages/assessments/[slug].astro` — specsheet `<dl>` currently
  renders only Due and Weight; `RelatedContent` component walks the
  `related[]` graph edges; `SpecList` renders `spec[]`.
- `src/components/AssessmentsGrid.astro` — main listing page, renders
  title/description/due/weight per assessment via `sortedAssessments()`.
- `src/lib/dates.ts` — `formatCourseDateTime` renders `HH:MM, D MMMM
  YYYY` in Australia/Sydney local time; `spec/assessment-scheme.test.ts`
  and `spec/dates.test.ts` lock this format down (no changes needed
  there — the week label is appended as separate text, not reformatted
  through this function).
- `spec/assessment-scheme.test.ts` — has `EXPECTED_WEIGHTS` (real,
  actively checked) and `EXPECTED_COVERAGE` (currently hardcoded on both
  sides, not wired to any real frontmatter field — effectively a no-op
  today, and its existing numbers don't match this spec's real content
  scope, e.g. Weekly Reflections is listed as `[1,1]` not weeks 1–12).
- `src/course-config.ts` — `courseMeta.learningOutcomes` is a flat
  `string[]`, currently in a different order than requested; validated
  only by `slopCourseMetaSchema` (`.max(12)`, non-empty strings) and
  rendered as an unordered `<ul>` on `src/pages/index.astro`.
- `spec/homepage.test.ts` — asserts exactly 9 outcomes and that each
  outcome's literal text appears in the rendered HTML; unaffected by
  reordering or switching `<ul>`→`<ol>`, since it checks substrings, not
  order or list type.
- `spec/voice.test.ts` — banned-jargon list (F2), no `<code>` elements
  (F3), no self-narrating framing phrases (F4); the new FAQ content must
  respect all three.
- Verified real citations/content backing every proposed tie-in:
  - Week 3 lecture: enclothed cognition (Adam & Galinsky, 2012),
    occasion-then-weather check.
  - Week 4 lecture + Lab (`sessions/week-04.md`): exercise defined as "a
    stated frequency and a named activity," built into a real plan
    students keep past the Lab.
  - Week 6 lecture: mere-presence effect (Ward et al., 2017) — about the
    *phone* specifically, distinct from A2's laptop restriction.
  - Week 6 Lab: Activity 1's hobby/interest brainstorm — real precedent
    for a Station 1 hobby check.
  - Week 7 lecture + Lab: small-talk formula (name, hobby, recent trip).
  - Week 8 lecture + Lab: incident-report format (what was agreed / what
    happened / actual reason, traced to a process failure).
  - Week 10 lecture: **contains the bug** — states A3's Budget at 12%
    (actual: 10%) and Grocery logistics at 6% (actual, pre-reweight: 6%;
    post-reweight: 8%).
  - Practice exam (`practice-exam.astro`): Station 1's current rubric is
    4 criteria (4/4/4/3=15); Station 4's current framing ("propose a
    reason and a fix") doesn't yet name the incident-report structure
    explicitly even though the underlying diagnostic content already
    matches it closely.

## 4. Design

The core mechanism is two new structured frontmatter fields
(`contentScope`, `learningOutcomes`) that are simultaneously (a) rendered
in the specsheet as new rows, (b) used to correct `related[]`, and (c)
the input to new harness checks — so "state the scope" and "link to the
right lectures" can never drift apart the way the old sparse `related[]`
lists did.

Alternative considered and rejected: deriving the specsheet's scope
display purely from `related[]` (no new weeks array). Rejected because
the Final Exam's non-contiguous scope (1–4, 7–8, 10–12) can't be
expressed or validated cleanly from a flat list of slugs, and it would
give up the self-checking angle entirely (requirement 26–27 depend on
having the numeric weeks/LO arrays to check against).

The exam-scope explanation and the Station 1/4 changes are treated as
content work grounded in what's actually already taught (Week 6's hobby
brainstorm, Week 8's incident-report shape) rather than invented
material — consistent with the Core rule that no lab/assessment/exam may
introduce a concept the lectures haven't already covered.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | Ambiguity | How to represent non-contiguous content scope (Final Exam) | Structured `{ display, weeks[] }` field, chosen over free-text-only or derive-from-`related` |
| 2 | Contradiction | "Exam skips weeks already assessed elsewhere" doesn't hold — exam re-tests hygiene/outfits/cooking A1/A3 already assessed | Reframed as live-checkable-action vs. extended-duration/self-reported evidence |
| 3 | Gap | LO4 ("activities outside academic work") only loosely implied by Station 5's cooking | Direct fix: explicit hobby/interest check added to Station 1, real+practice exam |
| 4 | Ambiguity | FAQ scope/location — course-wide vs. per-assessment | User clarified explicitly (including a mid-turn correction): per-assessment, not course-wide |
| 5 | Gap | No way to cross-reference "LO 1-2" text back to the actual numbered outcome | Homepage gets stable `#lo-N` anchors; specsheet links to them |
| 6 | Ambiguity | Grade band format — holistic (A3-style) vs. per-criterion (practice-exam-style) | Holistic, one table per assessment |
| 7 | Contradiction | User's note said "fold under Reflection (35%)" as an "A3" instruction, but Reflection is A2's criterion; A3 has none | Confirmed with user: refers to A2's three additions |
| 8 | Gap (found during research, not in original notes) | Week 10 lecture states A3's Budget at 12%, which was already wrong before any reweight (real value: 10%) | Folded into this spec's scope (requirement 21) since the reweight directly implicates this text |
| 9 | Gap | Assessment index page's placeholder line ("Weights should sum to 100.") never replaced with real content | User requested a lecture/lab-style overview paragraph (requirement 11) |

## 6. Handoff notes for planning

- Do the schema change (`content.config.ts`) and the `related[]`/
  `contentScope`/`learningOutcomes` frontmatter fill-in for all 5
  assessments together first — every other requirement (specsheet
  rendering, harness checks) depends on that data existing and being
  correct.
- The Week 10 lecture fix (req. 21) and the A3 reweight (req. 20) are one
  unit of work — don't land one without the other, or the lecture will
  state a wrong percentage in a different direction.
- The practice exam's Station 1 rubric rebalance (4→5 criteria summing to
  15) and Station 4's incident-report tie-in touch the *same file*
  (`practice-exam.astro`) as separate `<details>` blocks — safe to do as
  two focused edits, not one big rewrite.
- `spec/assessment-scheme.test.ts`'s `EXPECTED_COVERAGE`/`EXPECTED_WEIGHTS`
  tables need updating in the same commit as the A3 reweight, or the
  existing weight-sum test will fail loudly (which is correct — it's
  supposed to catch exactly this class of drift).
- Homepage LO reorder (`course-config.ts`) must land before or together
  with any assessment page that references `learningOutcomes: [...]`
  indices, since those indices are positional.
- Voice check: every new FAQ answer and every new tie-in sentence should
  be run past `spec/voice.test.ts`'s banned-term list and the
  Register-and-Voice table in `CLAUDE.md` before considering the task
  done — mundane specifics, no technical metaphor, no backticked jargon.
