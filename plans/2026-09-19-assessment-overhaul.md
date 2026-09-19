# Assessment overhaul

- **Date:** 2026-09-19
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-19

## 1. Summary

The five assessment pages (Weekly Reflections, Assignment 1, Assignment 2,
Assignment 3, Final Exam) are inconsistent in depth and connectedness: most
have sparse or absent `related` lecture links, none state their content
scope or the learning outcomes they cover, A1/A2/the Final Exam have bare
percentage weights with no HD–N grade-band descriptions (unlike A3), several
assessments only accidentally touch the research the course actually
teaches, the Final Exam's partial scope is unexplained, due dates don't show
which teaching week they fall in, and there's no FAQ addressing the naive
questions a real student would have about each brief. This plan adds two new
structured frontmatter fields (`contentScope`, `learningOutcomes`) that
drive corrected `related` links and new specsheet rows, fixes a real
pre-existing bug (Week 10's lecture misstates A3's Budget weight), adds
concrete lecture/lab tie-ins to A1–A3 and the Final Exam grounded in
material the lectures already teach, and adds a per-assessment FAQ — all
built test-first against the existing Vitest suite in `spec/`. Full design
rationale and the brainstorming record live in
`specs/2026-09-19-assessment-overhaul.md`.

## 2. Requirements

### 2.1 Functional requirements

1. `src/content.config.ts`'s `assessments` collection schema gains
   `contentScope: { display: string, weeks: number[] }` (required).
2. The schema gains `learningOutcomes: number[]` (required, each value an
   integer 1–9).
3. The schema gains optional `dueWeekLabel: string`.
4. Every one of the 5 assessment markdown files sets these fields to the
   values below, and their `related[]` arrays are rewritten to list exactly
   the lecture ids matching `contentScope.weeks`:
   - `weekly-reflections.md`: `contentScope: { display: "Weeks 1-12", weeks: [1..12] }`, `learningOutcomes: [1,2,3,4,5,6,7,8,9]`, no `dueWeekLabel`, `related: [lectures/week-01 .. lectures/week-12]`.
   - `assignment-1-makeover.md`: `contentScope: { display: "Weeks 1-4", weeks: [1,2,3,4] }`, `learningOutcomes: [1,2]`, `dueWeekLabel: "Week 4"`, `related: [lectures/week-01, lectures/week-02, lectures/week-03, lectures/week-04]`.
   - `assignment-2-touch-grass.md`: `contentScope: { display: "Weeks 5-7", weeks: [5,6,7] }`, `learningOutcomes: [3,4,5,6]`, `dueWeekLabel: "Week 8"`, `related: [lectures/week-05, lectures/week-06, lectures/week-07]`.
   - `assignment-3-adulting.md`: `contentScope: { display: "Weeks 1-12", weeks: [1..12] }`, `learningOutcomes: [1,2,3,4,7,8,9]`, `dueWeekLabel: "Week 12"`, `related: [lectures/week-01 .. lectures/week-12]`.
   - `final-exam.md`: `contentScope: { display: "Weeks 1-4, 7-8, 10-12", weeks: [1,2,3,4,7,8,10,11,12] }`, `learningOutcomes: [1,2,3,4,5,6,7,8,9]`, `dueWeekLabel: "Exam Period"`, `related: [lectures/week-01, week-02, week-03, week-04, week-07, week-08, week-10, week-11, week-12]` (plus the existing implicit link to the practice exam, which stays as an inline `<a>`, not a graph `related` entry).
5. The specsheet's Due row (`src/pages/assessments/[slug].astro`) and the
   main listing (`src/components/AssessmentsGrid.astro`) append
   `, {dueWeekLabel}` after the formatted due date/`dueDisplay` whenever
   `dueWeekLabel` is set.
6. The specsheet gains a "Content scope" row rendering
   `assessment.data.contentScope.display`.
7. The specsheet gains a "Learning outcomes" row rendering as "LO" plus
   comma-separated ranges (e.g. "1–4, 7–9"), each number linking to
   `/#lo-{n}` on the homepage via `withBase`.
8. `src/course-config.ts`'s `courseMeta.learningOutcomes` array is reordered
   to: hygiene/routines, attire, sleep/nutrition/exercise,
   activities/interests, social interaction, social cues, friendships,
   independent-life routines, professional conduct (exact sentence text
   unchanged — only array order moves).
9. `src/pages/index.astro` renders the learning outcomes as an `<ol>`
   (native numbering) instead of `<ul>`, with `id="lo-{n}"` (1-indexed by
   list position) on each `<li>`.
10. `src/pages/assessments/index.mdx` replaces the placeholder line
    "Weights should sum to 100." with a short overview paragraph in the
    course's lecture/lab-Introduction voice, describing the five-item
    scheme (twelve dropped-lowest weekly reflections, three assignments,
    one final exam).
11. `assignment-1-makeover.md`, `assignment-2-touch-grass.md`, and
    `final-exam.md` each gain one holistic "How each band reads" HD/D/C/P/N
    table, in the same format as `assignment-3-adulting.md`'s existing
    table, in addition to their existing weighted-criteria table.
12. `assignment-1-makeover.md`'s brief gains one line connecting the
    "Justification" criterion to enclothed cognition (Week 3): that the
    justification may draw on why clothing affects more than appearance,
    not just occasion-matching.
13. `assignment-2-touch-grass.md`'s brief gains three report requirements,
    folded under the existing **Reflection (35%)** criterion (no new
    marking categories, no weight changes to A2's 3 existing criteria):
    - state whether the student brought their phone, whether they checked
      it, and connect this to Week 6's mere-presence effect (Ward et al., 2017);
    - state whether the activity met the student's own Week 4 exercise
      plan's stated frequency and named activity, and if not, what they'd
      adjust;
    - for at least one of the two non-CS people, name one thing learned
      using Week 7's small-talk formula (name, hobby, recent trip).
14. `src/content/sessions/week-04.md` gains one line noting that the
    sleep/exercise plan built in this Lab is what Assignment 2 later asks
    students to check their activity against.
15. `assignment-3-adulting.md`'s "The date" bullet gains "...appropriate to
    the activity and the day's forecast" appended to its description.
16. `assignment-3-adulting.md` gains one explicit line noting the hangout
    and the interview must not both be scheduled for the same Wednesday
    afternoon.
17. `assignment-3-adulting.md`'s `marking.criteria` changes: Grocery
    logistics 6%→8%, Exercise 8%→6% (criteria still sum to 100).
18. `src/content/lectures/week-10.mdx`'s Body section is corrected from
    "Budget (12%)"/"Grocery logistics (6%)" to "Budget (10%)"/"Grocery
    logistics (8%)" — matching A3's real (and, for Budget, previously
    already-wrong) criteria weights.
19. `final-exam.md` gains explanatory text for why its scope excludes
    weeks 5, 6, and 9: their evidence is inherently extended-duration or
    self-reported (15+ minutes outdoors, a week of device discipline, an
    opening message sent into the world) and can't compress into a
    ~10-minute station without becoming fake, whereas the weeks kept
    (1–4, 7, 8, 10–12) reduce to a live, observable action worth
    re-checking under real-time pressure.
20. `final-exam.md`'s Station 1 description gains an explicit hobby/interest
    check, attributed to Week 6's Lab brainstorm activity.
21. `src/pages/assessments/final-exam/practice-exam.astro`'s Station 1
    section is rebalanced from its current 4-criterion rubric (4/4/4/3=15)
    to 5 criteria summing to 15, with its model solution, poor solution,
    examiner's notes, and band-descriptor table all updated to reflect the
    fifth (hobby/interest) criterion.
22. `final-exam.md`'s Station 4 description gains explicit text tying its
    diagnose-then-respond format to Week 8's incident-report structure
    (what was agreed / what actually happened / the actual reason).
23. `practice-exam.astro`'s Station 4 section (description, model solution,
    examiner's notes) gains the same explicit incident-report tie-in.
24. Each of the 5 assessment content files gains a "## FAQ" section with
    at least 2 naive, CS-student-perspective question/answer pairs specific
    to that assessment's brief, in the course's established voice (no
    technical metaphor, no `<code>`/backticked jargon — `spec/voice.test.ts`
    F2/F3).
25. `spec/assessment-scheme.test.ts`'s `EXPECTED_COVERAGE` table (currently
    hardcoded on both sides and unwired to any real field) is replaced with
    real assertions: every `contentScope.weeks` value ≤ the assessment's own
    `week`, and `related`'s lecture refs exactly match `contentScope.weeks`.
26. `spec/assessment-scheme.test.ts` gains an assertion that every
    `learningOutcomes` index is within 1–9.
27. `spec/assessment-scheme.test.ts` gains an assertion that every
    assessment publishes an FAQ section with ≥2 question/answer pairs.
28. `spec/assessment-scheme.test.ts`'s existing "publishes five band
    descriptors" check (currently only run against A3) is extended to also
    run against A1, A2, and the real Final Exam page.
29. A new pure helper, `toOutcomeRanges`, collapses a list of 1-indexed
    outcome numbers into contiguous `{start, end}` ranges, covered by a
    dependency-free unit test (mirrors `spec/entry-order.test.ts`'s pattern
    for `neighbors`).

### 2.2 Non-functional requirements

None beyond project defaults: `pnpm check` (typecheck + `spec/` tests) must
stay green, and every new/changed page must be checked against
`spec/voice.test.ts` (F2 banned terms, F3 no `<code>`, F4 no framing
phrases) and the Register-and-voice table in `CLAUDE.md`. Visual check at
1920×1080 and 390×844 applies to the assessment pages, the assessment
index, and the homepage (per `CLAUDE.md`'s "Before pushing" rule), since the
specsheet gains two new rows and the homepage's list changes from `<ul>` to
`<ol>`.

### 2.3 Out of scope

- Any change to the five assessments' own top-level weights (15/20/20/15/30
  for Weekly Reflections/A1/A2/A3/Final Exam respectively).
- Any change to A3's weighted criteria other than the Grocery
  logistics/Exercise swap (requirement 17).
- A general "lecture-states-a-percentage-that-must-match-the-real-weight"
  harness check — only the one found instance (Week 10) is fixed directly.
- Any change to the "Daily routine" vs. "Sleep schedule" fallback wording in
  A3 (reviewed, left as-is per user decision).
- A new page/route for the FAQ — it lives inline in each assessment's
  existing markdown file.

### 2.4 Assumptions

None outstanding — every design decision below was confirmed with the user
during `brainstorm-feature` (see `specs/2026-09-19-assessment-overhaul.md`
§2.4 and §5 for the full record: schema shape, exam-scope rationale, LO4/
Station 1 fix, per-assessment FAQ, LO cross-links, grade-band format, A3
reweight, and the assessment-index overview paragraph).

## 3. Existing code context

**Schema** — `src/content.config.ts`, current `assessments` collection
(lines 47–62):

```ts
assessments: defineCollection({
  loader: courseNodeLoader("assessments"),
  schema: courseNodeSchema
    .extend({
      week: weekSchema,
      due: z.coerce.date(),
      dueDisplay: z.string().trim().min(1).optional(),
      weight: z.coerce.number().positive().max(100),
      marking: z.discriminatedUnion("mode", [weightedMarking, holisticMarking]).optional(),
    })
    .loose(),
}),
```

`weekSchema = z.coerce.number().int().min(1).max(12)` (line 6).
`courseNodeSchema` (from `astro-course-university/schemas`) provides
`title`, `description`, `tags`, `related: z.array(z.string()).default([])`,
`links`, `spec`, `published`, `draft`. `.loose()` means unknown extra
frontmatter keys currently pass through unvalidated into `assessment.data`.

**Course-level API generation** (`astro-course-university`'s
`course-content.ts`, a dependency — not edited by this plan) re-parses each
markdown file's raw YAML frontmatter independently of Astro's content
collections, and puts every key except `title`/`description`/`tags`/
`related`/`links`/`spec`/`published` into a `meta: Record<string, unknown>`
object on the generated `/api/index.json` node — confirmed by reading
`course-content.ts` lines ~123–146. This is why
`spec/assessment-scheme.test.ts` already reads `node.meta?.week`,
`node.meta?.due`, `node.meta?.weight`, `node.meta?.marking` directly: adding
`contentScope`/`learningOutcomes`/`dueWeekLabel` to frontmatter makes them
appear in `node.meta` automatically, with no change needed to that
dependency.

**Specsheet rendering** — `src/pages/assessments/[slug].astro` (full file
read), relevant excerpt:

```astro
<section class="course-specsheet" aria-label="Assessment details">
  <dl>
    <dt>Due</dt>
    <dd>{assessment.data.dueDisplay ?? formatCourseDateTime(assessment.data.due)}</dd>
    <dt>Weight</dt>
    <dd>{assessment.data.weight}%</dd>
  </dl>
</section>
<Content />
<SpecList spec={assessment.data.spec}>...</SpecList>
{assessment.data.marking && <MarkingModel marking={assessment.data.marking} />}
<RelatedContent entry={assessment} collections={graphCollections} />
```

Imports already present: `formatCourseDateTime` from `../../lib/dates`,
`withBase` from `astro-theme-university/url`.

**Main listing** — `src/components/AssessmentsGrid.astro` (full file read):

```astro
<small>
  Due {assessment.data.dueDisplay ?? formatCourseDateTime(assessment.data.due)} ·
  Weight: {assessment.data.weight}%
  {assessment.data.draft && " · Draft"}
</small>
```

**`withBase`** (`astro-theme-university/url`, verified in
`node_modules/.pnpm/astro-theme-university@.../url.ts`):

```ts
export function withBase(href: string, base: string = metaEnv?.BASE_URL ?? "/"): string
```
Prepends the site base path to an absolute `href` starting with `/`; used
elsewhere as `withBase(`/assessments/${id}/`)`. `RelatedContent.astro`
instead manually computes `const base = import.meta.env.BASE_URL.replace(/\/$/, "")`
— either idiom is acceptable; this plan uses `withBase` since it's already
imported in `[slug].astro`.

**Homepage** — `src/pages/index.astro` (full file read):

```astro
<h2>Learning outcomes</h2>
<p>By the end of the semester, you will be able to:</p>
<ul>
  {courseMeta.learningOutcomes.map((outcome) => <li>{outcome}</li>)}
</ul>
```

**Course config** — `src/course-config.ts` (full file read):
`courseMeta.learningOutcomes` is a 9-element `string[]` passed through
`slopCourseMetaSchema.parse(...)` (`.max(12)`, non-empty trimmed strings —
order/count unconstrained by the schema itself).

**`spec/homepage.test.ts`** (full file read): asserts exactly 9 outcomes and
that each outcome's literal text is a substring of `dist/index.html` — does
**not** check order or list-tag type, so reordering the array and switching
`<ul>`→`<ol>` cannot break it.

**Entry ordering / nav** — `src/lib/entry-order.ts` (full file read):
`sortedAssessments()` returns `CollectionEntry<"assessments">[]` sorted by
`data.week`; `assessmentNavLabel(title)` and `neighbors()` are unrelated to
this plan's changes and untouched.

**Assessment markdown files** (all 5 read in full) — current frontmatter
keys per file are `title`, `description`, `week`, `due`, `weight`,
`marking.mode: "weighted"`, `marking.criteria: [{name, weight}]`, `spec:
string[]`, and (inconsistently) `related`. Current `related` values:
Weekly Reflections — none; A1 — `[lectures/week-03]`; A2 —
`[lectures/week-05]`; A3 — none; Final Exam — none.

**Voice constraints** — `spec/voice.test.ts` (full file read): `BANNED_TERMS`
(F2, a fixed jargon list — new prose must avoid every term, hyphen-
normalized), no `<code>` elements (F3), no `FRAMING_PHRASES` in a lecture's
Introduction or the homepage (F4, not touched by this plan's pages). None of
the new FAQ/tie-in text may use these terms.

**Final exam pages** — `src/content/assessments/final-exam.md` and
`src/pages/assessments/final-exam/practice-exam.astro` (both read in full).
The real page's Station 1 description: *"A rapid check of your hygiene and
sleep schedules against what you actually ran this semester."* Station 4:
*"Diagnose a friend-group or workplace scenario that plays out in front of
you, and propose a reason and a fix."* The practice exam's Station 1 rubric
(hardcoded HTML table, not schema-driven):

```html
<tr><td>Checks every exercise entry against the definition, excluding incidental walks</td><td>4</td></tr>
<tr><td>Checks the laundry entry against the pile-visible threshold</td><td>4</td></tr>
<tr><td>Checks every shower entry against the daily-shower definition</td><td>4</td></tr>
<tr><td>Checks every bedtime entry against the specific-clock-time definition</td><td>3</td></tr>
```
(sums to 15; band table separately gives HD 13–15 … N 0–3).

**Lecture/lab content verified** (all read in full, exact citations
confirmed):
- Week 3 (`lectures/week-03.mdx`): enclothed cognition (Adam & Galinsky,
  2012); occasion-then-weather check.
- Week 4 (`lectures/week-04.mdx`, `sessions/week-04.md`): Exercise defined
  as "physical activity undertaken on a stated schedule"; the Lab's
  "Afterwards" section already says *"Keep your sleep schedule and
  exercise plan. Revise either before Assignment 3..."* — this plan adds
  one more sentence noting A2's use of the same plan.
- Week 6 (`lectures/week-06.mdx`): mere-presence effect, Ward et al.
  (2017) — about the phone, not the laptop. `sessions/week-06.md`
  Activity 1: hobby/interest brainstorm (real precedent for Station 1's
  new check).
- Week 7 (`lectures/week-07.mdx`): small-talk formula (name, hobby, recent
  trip); eye-contact citation (Binetti et al., 2016).
- Week 8 (`lectures/week-08.mdx`, `sessions/week-08.md`): incident-report
  format — "what was agreed, what actually happened, and the actual
  reason."
- Week 10 (`lectures/week-10.mdx`): **contains the bug** — states *"Budget
  (12%) marks category coverage... Grocery logistics (6%) marks a one-week
  grocery list..."* against A3's real (pre-reweight) criteria of Budget
  10%/Grocery 6% — Budget's 12% is already wrong today, independent of
  this plan's reweight.

**Test setup**: Vitest. `pnpm test` runs `astro build` then
`vitest run spec` (dist/ is rebuilt before every test run, so no manual
build step is ever needed between an edit and running tests).
`pnpm check` runs `astro check` (typecheck) then `pnpm test`. Relevant
existing spec files: `spec/assessment-scheme.test.ts` (assessments'
`meta`/rendered-HTML assertions), `spec/homepage.test.ts`,
`spec/practice-exam.test.ts`, `spec/voice.test.ts`, `spec/entry-order.test.ts`
(pattern for a dependency-free pure-function unit test).

## 4. Approach

Two new structured frontmatter fields (`contentScope`, `learningOutcomes`)
are the single source of truth that specsheet rendering, corrected
`related` links, and the new harness checks all read from — this is what
stops "state the scope" and "link the right lectures" from drifting apart
the way the old sparse `related[]` lists already have. A small pure helper
(`toOutcomeRanges`) handles the one piece of real logic (collapsing a
non-contiguous learning-outcome list like `[1,2,3,4,7,8,9]` into "1–4, 7–9"
for display and per-number linking), tested in isolation the same way
`entry-order.ts`'s `neighbors()` already is.

Content changes (grade bands, tie-in sentences, exam-scope rationale,
Station 1/4 updates, FAQs) are sequenced after the structural/rendering
work so every content task can be driven by a small, focused, already-
meaningful test addition to `spec/assessment-scheme.test.ts` (or
`spec/practice-exam.test.ts`), following that file's own established idiom
of reading `dist/assessments/<slug>/index.html` and asserting on substrings
or `indexOf`-bounded sections.

Alternative considered and rejected (recorded in the spec, restated here
since it affects task sequencing): deriving scope/LO display purely from
`related[]` with no numeric arrays. Rejected because the Final Exam's
non-contiguous scope can't be validated that way, and requirements 25–27
depend on having real `weeks`/`learningOutcomes` arrays to check against.

## 5. Task breakdown

### Task 1: Add `contentScope`, `learningOutcomes`, and `dueWeekLabel` to the assessments schema and all 5 assessment files [x]

**Correction (2026-09-19, mid-execution, requested by user):** A1's
`contentScope.weeks` is `[1,2,3]` ("Weeks 1-3"), not `[1,2,3,4]` — and
A2's is `[4,5,6,7]` ("Weeks 4-7"), not `[5,6,7]` ("Weeks 5-7"), per the
user's correction after Task 1's original values had already landed.
Requirement 4's table above is superseded by this note for A1/A2;
`learningOutcomes` and `dueWeekLabel` for both are unchanged. Task 2's
`related[]` and the specsheet-row test cases in Task 6 were updated to
match in the same pass — see Task 2's note.

- **Description:** Extend the Zod schema and fill in real values for every
  assessment, per requirement 4's table.
- **Files touched:** `src/content.config.ts`;
  `src/content/assessments/weekly-reflections.md`,
  `assignment-1-makeover.md`, `assignment-2-touch-grass.md`,
  `assignment-3-adulting.md`, `final-exam.md`.
- **Tests first (red):** In `spec/assessment-scheme.test.ts`, add a new
  `describe("content scope and learning outcomes")` block with:
  - `it("gives every assessment a content-scope display and weeks array")`
    — for each node, `expect(Array.isArray(node.meta?.contentScope?.weeks)).toBe(true)` and `expect(typeof node.meta?.contentScope?.display).toBe("string")`.
  - `it("keeps every learningOutcomes index within 1 and 9")` — for each
    node, `for (const n of node.meta?.learningOutcomes as number[]) { expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(9); }`.
  These fail today (fields don't exist, `dist/api/index.json` has no
  `contentScope`/`learningOutcomes` in `meta`).
- **Implementation (green):** In `src/content.config.ts`, extend the
  `assessments` schema:
  ```ts
  contentScope: z.object({
    display: z.string().trim().min(1),
    weeks: z.array(weekSchema).min(1),
  }),
  learningOutcomes: z.array(z.number().int().min(1).max(9)).min(1),
  dueWeekLabel: z.string().trim().min(1).optional(),
  ```
  added alongside the existing `week`/`due`/`dueDisplay`/`weight`/`marking`
  fields inside `.extend({...}).loose()`. Add the frontmatter values from
  requirement 4 to each of the 5 files (this task only adds
  `contentScope`/`learningOutcomes`/`dueWeekLabel` — `related[]` correction
  is Task 2).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm typecheck` passes (schema and frontmatter agree).
  - The two new assertions in `spec/assessment-scheme.test.ts` pass for all
    5 assessments.
- **Depends on:** None.

### Task 2: Correct `related[]` on all 5 assessments and replace the vacuous `EXPECTED_COVERAGE` test [x]

**Execution note (2026-09-19):** the `related` graph is symmetrised
(`astro-course-university`'s `symmetriseRelated`) — `week-08.mdx`'s own
`related` frontmatter declared `assessments/assignment-2-touch-grass`
(a legitimate but incidental due-date mention, not a content-scope
link), which mirrored onto A2's `related` regardless of A2's own
frontmatter, adding `lectures/week-08` outside A2's contentScope.weeks
`[5,6,7]`. Resolved with the user: removed that one line from
`week-08.mdx`'s `related:` array (the plain-text mention of Assignment
2 in its Conclusion stays; no embed directive existed, so nothing else
changed). The "links related to exactly the lectures its content scope
names" test is implemented as an exact match (no per-assessment
exemption needed) since this was the only such backlink outside any
assessment's contentScope.weeks — checked by inspecting `dist/api/index.json`
after the fix.

**Correction (2026-09-19):** following Task 1's A1/A2 scope correction
(weeks 1-3 and 4-7, see that task's note), `assignment-1-makeover.md`'s
`related` dropped `lectures/week-04`, `assignment-2-touch-grass.md`'s
`related` gained `lectures/week-04`, and `week-04.mdx`'s own `related`
lost its `assessments/assignment-1-makeover` backlink — the same class
of incidental due-date-mention edge as the original week-08/A2 fix
(week-04's lecture body still says "Assignment 1 (Makeover) due this
Friday", now outside A1's scope). Verified the same way: inspected
`dist/api/index.json` for both assessments and `lectures/week-04` after
rebuilding — no stray edges.

- **Description:** Rewrite each assessment's `related[]` to list exactly
  the lecture ids in its `contentScope.weeks`, and replace
  `assessment-scheme.test.ts`'s hardcoded, unwired `EXPECTED_COVERAGE`
  table with real assertions against `contentScope`.
- **Files touched:** the same 5 assessment markdown files;
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** Replace the existing `EXPECTED_COVERAGE` constant
  and its `it("never examines content from a later week", ...)` test
  (lines 33–39, 95–103) with:
  - `it("never examines content from a week later than its own")` — for
    each node **except `assessments/weekly-reflections`** (whose `week`
    field is a pure sort key — see `src/lib/entry-order.ts`'s
    `sortedAssessments()` — not a coverage ceiling; it's a continuously-
    graded assessment spanning weeks 1–12 by design, confirmed with the
    user during execution on 2026-09-19),
    `const weeks = node.meta?.contentScope?.weeks as number[]; for (const w of weeks) expect(w).toBeLessThanOrEqual(Number(node.meta?.week));`.
  - `it("links related to exactly the lectures its content scope names")`
    — for each node, build `expected = weeks.map(w => `lectures/week-${String(w).padStart(2,"0")}`).sort()` and compare against `[...(node.related ?? [])].filter(r => r.startsWith("lectures/")).sort()` with `expect(...).toEqual(expected)`.
  These fail immediately since `related[]` is currently sparse/absent on 4
  of 5 assessments.
- **Implementation (green):** Update each file's `related:` frontmatter
  array to the lecture ids listed in requirement 4 (preserving Final
  Exam's inline practice-exam link, which is a body `<a>`, not a `related`
  entry, so untouched).
- **Refactor:** Delete the now-unused `EXPECTED_COVERAGE` interface/const
  entirely rather than leaving it dead.
- **Acceptance criteria:**
  - Both new tests pass for all 5 assessments.
  - `RelatedContent` on each assessment page renders links to every
    lecture week in its scope (spot-checked via `dist/assessments/<slug>/index.html` containing an `<a>` to each `lectures/week-NN/`).
- **Depends on:** Task 1 (needs `contentScope.weeks` to exist).

### Task 3: `toOutcomeRanges` pure helper and its unit test [x] — superseded, see Task 7

**Execution note (2026-09-19):** built and committed as specified, but
Task 7's Human review rejected the range-based display it existed to
support (see that task's note). With no other caller, `src/lib/learning-
outcomes.ts` and `spec/learning-outcomes.test.ts` were deleted in the
same pass as Task 7's redesign, per `CLAUDE.md`'s "if you are certain
something is unused, you can delete it completely" — confirmed with the
user rather than assumed. Requirement 2.1.29 is no longer satisfied;
see the requirements-coverage table in §7.

- **Description:** A dependency-free function collapsing a list of 1-
  indexed outcome numbers into contiguous ranges, for both display and
  per-number anchor linking.
- **Files touched:** new `src/lib/learning-outcomes.ts`; new
  `spec/learning-outcomes.test.ts`.
- **Tests first (red):** `spec/learning-outcomes.test.ts` (modeled on
  `spec/entry-order.test.ts`'s dependency-free style — no `astro:content`
  import, so it runs under plain `vitest run spec/learning-outcomes.test.ts`
  without a build):
  ```ts
  import { describe, expect, it } from "vitest";
  import { toOutcomeRanges } from "../src/lib/learning-outcomes";

  describe("toOutcomeRanges", () => {
    it("collapses a fully contiguous list into one range", () => {
      expect(toOutcomeRanges([1,2,3,4,5,6,7,8,9])).toEqual([{ start: 1, end: 9 }]);
    });
    it("splits a non-contiguous list into separate ranges", () => {
      expect(toOutcomeRanges([1,2,3,4,7,8,9])).toEqual([
        { start: 1, end: 4 },
        { start: 7, end: 9 },
      ]);
    });
    it("treats a single value as a range of length one", () => {
      expect(toOutcomeRanges([5])).toEqual([{ start: 5, end: 5 }]);
    });
    it("sorts and deduplicates unordered input", () => {
      expect(toOutcomeRanges([9, 1, 2, 2])).toEqual([
        { start: 1, end: 2 },
        { start: 9, end: 9 },
      ]);
    });
  });
  ```
  All fail (module doesn't exist).
- **Implementation (green):**
  ```ts
  // src/lib/learning-outcomes.ts
  export interface OutcomeRange {
    start: number;
    end: number;
  }

  export function toOutcomeRanges(indices: number[]): OutcomeRange[] {
    const sorted = [...new Set(indices)].sort((a, b) => a - b);
    const ranges: OutcomeRange[] = [];
    for (const n of sorted) {
      const last = ranges.at(-1);
      if (last && n === last.end + 1) {
        last.end = n;
      } else {
        ranges.push({ start: n, end: n });
      }
    }
    return ranges;
  }
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** `vitest run spec/learning-outcomes.test.ts`
  passes all 4 cases.
- **Depends on:** None (can run in parallel with Tasks 1–2).

### Task 4: Homepage learning-outcomes reorder, `<ol>`, and `#lo-N` anchors [x] (human review: accepted)

- **Description:** Reorder `courseMeta.learningOutcomes`, switch the
  homepage list to `<ol>`, and add stable per-item anchors.
- **Files touched:** `src/course-config.ts`, `src/pages/index.astro`.
- **Tests first (red):** Add to `spec/homepage.test.ts`:
  ```ts
  it("numbers the learning outcomes with stable anchors in the new order", () => {
    for (let n = 1; n <= 9; n++) {
      expect(html, `missing id="lo-${n}"`).toContain(`id="lo-${n}"`);
    }
    const hygieneIndex = html.indexOf("hygiene and daily routines");
    const attireIndex = html.indexOf("weather- and occasion-appropriate attire");
    const sleepIndex = html.indexOf("sleep, nutrition, and exercise");
    expect(hygieneIndex).toBeGreaterThan(-1);
    expect(attireIndex).toBeGreaterThan(hygieneIndex);
    expect(sleepIndex).toBeGreaterThan(attireIndex);
  });
  ```
  Fails today: no `id="lo-N"` attributes exist, and the current order is
  hygiene → sleep/nutrition/exercise → attire (attire comes before sleep in
  the target order, after in the current one).
- **Implementation (green):** In `src/course-config.ts`, reorder the
  `learningOutcomes` array literal to the sequence in requirement 8
  (sentence text unchanged, per the existing array — only element order
  moves). In `src/pages/index.astro`, change:
  ```astro
  <ul>
    {courseMeta.learningOutcomes.map((outcome) => <li>{outcome}</li>)}
  </ul>
  ```
  to:
  ```astro
  <ol>
    {courseMeta.learningOutcomes.map((outcome, index) => (
      <li id={`lo-${index + 1}`}>{outcome}</li>
    ))}
  </ol>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - New homepage test passes; existing `spec/homepage.test.ts` assertions
    (9 outcomes, substrings present) still pass unmodified.
  - Human review confirms the rendered order visually matches the intended
    numbered list at both marking viewports.
- **Human review:** Load `/` at 1920×1080 and 390×844 and confirm the
  Learning Outcomes list renders as a numbered `<ol>` in the order: hygiene,
  attire, sleep/nutrition/exercise, activities/interests, social
  interaction, social cues, friendships, independent-life routines,
  professional conduct — and that numbering doesn't visually clash with the
  page's existing list styling.
- **Depends on:** None.

### Task 5: Append `dueWeekLabel` to the Due row on both the specsheet and the main listing [x]

- **Description:** Render the new field wherever the due date already
  renders.
- **Files touched:** `src/pages/assessments/[slug].astro`,
  `src/components/AssessmentsGrid.astro`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts`:
  ```ts
  describe("due-date week labels", () => {
    const indexHtml = readFileSync(resolve("dist/assessments/index.html"), "utf8");
    const cases: [string, string][] = [
      ["assessments/assignment-1-makeover", "Week 4"],
      ["assessments/assignment-2-touch-grass", "Week 8"],
      ["assessments/assignment-3-adulting", "Week 12"],
      ["assessments/final-exam", "Exam Period"],
    ];
    it.each(cases)("%s's detail page states its due week label", (id, label) => {
      const html = readFileSync(resolve(`dist/${id}/index.html`), "utf8");
      expect(html).toContain(label);
    });
    it.each(cases)("%s's due week label appears on the main listing", (_id, label) => {
      expect(indexHtml).toContain(label);
    });
  });
  ```
  Fails: `dueWeekLabel` isn't rendered anywhere yet.
- **Implementation (green):** In `[slug].astro`'s specsheet `<dd>` for Due:
  ```astro
  <dd>
    {assessment.data.dueDisplay ?? formatCourseDateTime(assessment.data.due)}
    {assessment.data.dueWeekLabel && `, ${assessment.data.dueWeekLabel}`}
  </dd>
  ```
  In `AssessmentsGrid.astro`'s `<small>`:
  ```astro
  Due {assessment.data.dueDisplay ?? formatCourseDateTime(assessment.data.due)}
  {assessment.data.dueWeekLabel && `, ${assessment.data.dueWeekLabel}`} ·
  Weight: {assessment.data.weight}%
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** All 8 new test cases pass; Weekly Reflections'
  page is unaffected (no `dueWeekLabel` set, nothing appended).
- **Depends on:** Task 1.

### Task 6: "Content scope" specsheet row [x]

- **Description:** Render `contentScope.display` in the specsheet.
- **Files touched:** `src/pages/assessments/[slug].astro`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts`:
  ```ts
  describe("content scope specsheet row", () => {
    const cases: [string, string][] = [
      ["assessments/weekly-reflections", "Weeks 1-12"],
      ["assessments/assignment-1-makeover", "Weeks 1-4"],
      ["assessments/assignment-2-touch-grass", "Weeks 5-7"],
      ["assessments/assignment-3-adulting", "Weeks 1-12"],
      ["assessments/final-exam", "Weeks 1-4, 7-8, 10-12"],
    ];
    it.each(cases)("%s's specsheet states its content scope", (id, display) => {
      const html = readFileSync(resolve(`dist/${id}/index.html`), "utf8");
      expect(html).toContain("Content scope");
      expect(html).toContain(display);
    });
  });
  ```
  Fails: no such row exists.
- **Implementation (green):** In `[slug].astro`'s specsheet `<dl>`, after
  the Weight row:
  ```astro
  <dt>Content scope</dt>
  <dd>{assessment.data.contentScope.display}</dd>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** All 5 cases pass.
- **Depends on:** Task 1.

### Task 7: "Learning outcomes" specsheet row, linked to homepage anchors [x] (human review: accepted, after redesign — see note)

**Execution note (2026-09-19):** Human review of the originally-specified
range display (e.g. "LO 1–4, 7–9" with the endpoints as links) was
rejected: collapsing to a range visually implied the in-between numbers
were clickable when they weren't. Redesigned through several rounds with
the user to the final form: every outcome number is listed individually
(no ranges — `toOutcomeRanges`/Task 3 is unused as a result, see that
task's note), each as `<a href="/#lo-N" title="{full outcome text}">`,
styled to inherit body text colour with a dotted underline (solid on
hover/focus) rather than link-blue — hover previews the outcome text
without navigating; the link itself is a mobile/keyboard fallback, since
`title` tooltips don't fire on tap. Requirement 2.1.7's "LO N–M" range
wording no longer matches the built behaviour; see §7's coverage table.

- **Description:** Render `learningOutcomes` as "LO" plus linked ranges.
- **Files touched:** `src/pages/assessments/[slug].astro`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts`:
  ```ts
  describe("learning outcomes specsheet row", () => {
    it("links A1's specsheet to LO 1 and LO 2", () => {
      const html = readFileSync(
        resolve("dist/assessments/assignment-1-makeover/index.html"),
        "utf8",
      );
      expect(html).toContain("Learning outcomes");
      expect(html).toMatch(/href="[^"]*\/#lo-1"[^>]*>1<\/a>.{0,10}<a[^>]*href="[^"]*\/#lo-2"[^>]*>2<\/a>/s);
    });
    it("renders A3's non-contiguous outcomes as separate linked ranges", () => {
      const html = readFileSync(
        resolve("dist/assessments/assignment-3-adulting/index.html"),
        "utf8",
      );
      expect(html).toMatch(/href="[^"]*\/#lo-1"[^>]*>1<\/a>/);
      expect(html).toMatch(/href="[^"]*\/#lo-4"[^>]*>4<\/a>/);
      expect(html).toMatch(/href="[^"]*\/#lo-7"[^>]*>7<\/a>/);
      expect(html).toMatch(/href="[^"]*\/#lo-9"[^>]*>9<\/a>/);
    });
  });
  ```
  Fails: no such row exists.
- **Implementation (green):** In `[slug].astro`, import
  `toOutcomeRanges` from `../../lib/learning-outcomes`, then in the
  specsheet:
  ```astro
  <dt>Learning outcomes</dt>
  <dd>
    LO {toOutcomeRanges(assessment.data.learningOutcomes).map((range, i, arr) => (
      <>
        {range.start === range.end ? (
          <a href={withBase(`/#lo-${range.start}`)}>{range.start}</a>
        ) : (
          <>
            <a href={withBase(`/#lo-${range.start}`)}>{range.start}</a>
            {"–"}
            <a href={withBase(`/#lo-${range.end}`)}>{range.end}</a>
          </>
        )}
        {i < arr.length - 1 && ", "}
      </>
    ))}
  </dd>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** Both new tests pass; `pnpm typecheck` passes
  (Astro fragment/array-of-JSX typing).
- **Human review:** Load one contiguous-range assessment (A1) and one
  non-contiguous one (A3) at both marking viewports; confirm the "Learning
  outcomes" row reads naturally and each number is a working link to the
  corresponding homepage anchor.
- **Depends on:** Tasks 1, 3, 4 (needs the field, the helper, and the
  homepage anchors to link to).

### Task 8: Assessment index overview paragraph [x] (human review: accepted, after wording fixes)

- **Description:** Replace the placeholder line with real overview prose.
- **Files touched:** `src/pages/assessments/index.mdx`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts` (or a new
  small `describe` block in the same file):
  ```ts
  describe("assessment index overview", () => {
    const html = readFileSync(resolve("dist/assessments/index.html"), "utf8");
    it("no longer carries the placeholder weights line", () => {
      expect(html).not.toContain("Weights should sum to 100.");
    });
    it("describes the five-item scheme before the grid", () => {
      expect(html).toMatch(/twelve|weekly reflections/i);
      expect(html).toMatch(/three assignments|assignment/i);
      expect(html).toMatch(/final exam/i);
    });
  });
  ```
  Fails on the first assertion today (the placeholder line is still there).
- **Implementation (green):** In `src/pages/assessments/index.mdx`, replace
  `Weights should sum to 100.` with a short paragraph (2–4 sentences) in
  the course's lecture/lab-Introduction voice describing the five-item
  scheme, written to satisfy the test above and `spec/voice.test.ts`'s F2
  banned-term list.
- **Refactor:** None expected.
- **Acceptance criteria:** Both new assertions pass; `spec/voice.test.ts`
  stays green for `assessments/index.html`.
- **Human review:** Read the new paragraph against `CLAUDE.md`'s
  Register-and-voice table — deadpan, concrete, mundane specifics, no
  technical metaphor — and confirm it reads as course voice, not
  boilerplate.
- **Depends on:** None.

### Task 9: A1 grade bands [x] (human review: accepted)

- **Description:** Add a holistic HD/D/C/P/N table to
  `assignment-1-makeover.md`, A3-style.
- **Files touched:** `src/content/assessments/assignment-1-makeover.md`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts`'s existing
  `describe("assignment 1 makeover")` block:
  ```ts
  it("publishes five band descriptors", () => {
    for (const band of ["HD", "D", "C", "P", "N"]) {
      expect(html, `missing band ${band}`).toMatch(new RegExp(`\\b${band}\\b`));
    }
  });
  ```
  Fails today (A1 has no band table).
- **Implementation (green):** Add a `## How each band reads` section (same
  heading style as A3's) with a 5-row HD–N table describing product/outfit/
  justification quality, e.g. HD — every product choice has a specific,
  non-generic rationale and all three outfits are clearly matched to their
  occasion with justification referencing the actual garment; down to N — a
  product, outfit, or justification is missing (matching the example given
  in the original brainstorm notes).
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes; existing A1 tests in the same
  `describe` block are unaffected.
- **Human review:** Read the 5 band descriptions against A3's table for
  consistency of tone and specificity (each band names something concrete,
  not "good"/"bad").
- **Depends on:** None.

### Task 10: A2 grade bands [x] (human review: accepted)

- **Description:** Add a holistic HD/D/C/P/N table to
  `assignment-2-touch-grass.md`.
- **Files touched:** `src/content/assessments/assignment-2-touch-grass.md`.
- **Tests first (red):** Add to the existing
  `describe("assignment 2 touch grass")` block:
  ```ts
  it("publishes five band descriptors", () => {
    for (const band of ["HD", "D", "C", "P", "N"]) {
      expect(html, `missing band ${band}`).toMatch(new RegExp(`\\b${band}\\b`));
    }
  });
  ```
  Fails today.
- **Implementation (green):** Add a `## How each band reads` section
  describing observation depth, reflection quality, and restriction
  compliance together as one holistic read of the report (should be
  drafted alongside/after Task 12's three new reflection tie-ins, since a
  strong HD band description should be able to reference them, but the
  band table and the tie-in lines are otherwise independent — order
  between this task and Task 12 doesn't matter for tests to pass).
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes.
- **Human review:** Read the 5 band descriptions for tone/specificity
  consistency with A1's and A3's tables.
- **Depends on:** None.

### Task 11: Final Exam grade bands (real page) [x] (human review: accepted)

- **Description:** Add a holistic HD/D/C/P/N table to `final-exam.md`,
  distinct from its existing per-station weighted criteria.
- **Files touched:** `src/content/assessments/final-exam.md`.
- **Tests first (red):** Add to the existing `describe("final exam")`
  block:
  ```ts
  it("publishes five overall band descriptors, distinct from the per-station weights", () => {
    for (const band of ["HD", "D", "C", "P", "N"]) {
      expect(html, `missing band ${band}`).toMatch(new RegExp(`\\b${band}\\b`));
    }
    expect(html).toMatch(/How each band reads/i);
  });
  ```
  Fails today (final-exam.md has no such section; `\bHD\b` etc. don't
  currently appear on the real exam page at all — only on the practice
  exam).
- **Implementation (green):** Add a `## How each band reads` section
  describing the exam holistically across all five stations (e.g. HD —
  every station is completed with the target skill actively demonstrated,
  not just attempted; down to N — one or more stations are not
  attempted or fail on their own stated terms).
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes; doesn't conflict with the
  existing per-station `marking.criteria` (which stays as-is).
- **Human review:** Confirm the holistic band table reads as a genuine
  overall description, not a restatement of the per-station percentages.
- **Depends on:** None.

### Task 12: A1 enclothed-cognition tie-in [x]

- **Description:** Connect A1's Justification criterion to Week 3's
  research.
- **Files touched:** `src/content/assessments/assignment-1-makeover.md`.
- **Tests first (red):** Add to `describe("assignment 1 makeover")`:
  ```ts
  it("connects the justification criterion to enclothed cognition", () => {
    expect(html).toMatch(/more than (its |your |their )?appearance/i);
  });
  ```
  Fails today.
- **Implementation (green):** Add one sentence to the "What you submit" or
  brief section: "Your justification may draw on why clothing affects more
  than appearance, not just occasion-matching."
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes; doesn't alter the "requires
  evidence and justification" existing test's match.
- **Depends on:** None.

### Task 13: A2's three Reflection tie-ins and the Week 4 Lab line [x]

- **Description:** Add the phone/mere-presence, exercise-plan-check, and
  small-talk-formula-naming lines to A2, folded under the existing
  Reflection (35%) criterion; add one sentence to Week 4's Lab.
- **Files touched:** `src/content/assessments/assignment-2-touch-grass.md`,
  `src/content/sessions/week-04.md`.
- **Tests first (red):** Add to `describe("assignment 2 touch grass")`:
  ```ts
  it("connects to Week 6's mere-presence effect via the phone", () => {
    expect(html).toMatch(/phone/i);
    expect(html).toMatch(/mere-presence/i);
  });
  it("checks the activity against the student's Week 4 exercise plan", () => {
    expect(html).toMatch(/exercise plan/i);
  });
  it("operationalises Week 7's small-talk formula for at least one non-CS person", () => {
    expect(html).toMatch(/small-talk formula/i);
  });
  ```
  And to `spec/weekly-structure.test.ts` or a new assertion in
  `spec/assessment-scheme.test.ts` reading `dist/sessions/week-04/index.html`:
  ```ts
  it("week 4's lab notes the exercise plan's relevance to Assignment 2", () => {
    const weekFourLab = readFileSync(resolve("dist/sessions/week-04/index.html"), "utf8");
    expect(weekFourLab).toMatch(/assignment 2|touch grass/i);
  });
  ```
  All fail today.
- **Implementation (green):** Add the three exact-worded requirements from
  requirement 13 to A2's "What you submit"/restrictions section (under the
  Reflection criterion's scope, not as new numbered restrictions). Add one
  sentence to `sessions/week-04.md`'s "Afterwards" (or "Wrap-up") section
  noting Assignment 2 will ask students to check their activity against
  this plan.
- **Refactor:** None expected.
- **Acceptance criteria:** All 4 new tests pass; `spec/weekly-structure.test.ts`
  (Before/In/Afterwards shape) stays green for Week 4's Lab.
- **Depends on:** None.

### Task 14: A3 weather clause and hangout/interview scheduling note [x]

- **Description:** Close the weather-appropriate-attire LO gap on "The
  date"; add the no-double-booking note.
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`.
- **Tests first (red):** Add to `describe("assignment 3 adulting")`:
  ```ts
  it("requires the date's attire to suit the day's forecast", () => {
    expect(html).toMatch(/forecast/i);
  });
  it("warns against double-booking the hangout and the interview", () => {
    expect(html).toMatch(/(hangout|interview).{0,80}(hangout|interview)/is);
    expect(html).toMatch(/same wednesday afternoon|both.{0,20}wednesday/i);
  });
  ```
  Fails today.
- **Implementation (green):** Append "...appropriate to the activity and
  the day's forecast" to "The date" bullet's description; add one sentence
  elsewhere in the plan section noting the hangout and interview must not
  both be scheduled for the same Wednesday afternoon.
- **Refactor:** None expected.
- **Acceptance criteria:** Both new tests pass; existing "requires all
  eleven named plan components" test unaffected.
- **Depends on:** None.

### Task 15: A3 reweight and the Week 10 lecture percentage fix [x]

- **Description:** Swap Grocery logistics/Exercise weights and correct the
  now-doubly-relevant Week 10 lecture bug.
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`,
  `src/content/lectures/week-10.mdx`.
- **Tests first (red):** Add to `describe("assignment 3 adulting")`:
  ```ts
  it("weighs grocery logistics above exercise, reflecting its complexity", () => {
    const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
    const a3 = api.nodes.find((n) => n.id === "assessments/assignment-3-adulting");
    const marking = a3?.meta?.marking as WeightedMarking;
    const grocery = marking.criteria.find((c) => c.name === "Grocery logistics");
    const exercise = marking.criteria.find((c) => /^Exercise/.test(c.name));
    expect(grocery?.weight).toBe(8);
    expect(exercise?.weight).toBe(6);
  });
  ```
  And to a new `describe("week 10 lecture")` block reading
  `dist/lectures/week-10/index.html`:
  ```ts
  it("states A3's real Budget and Grocery logistics weights", () => {
    const html = readFileSync(resolve("dist/lectures/week-10/index.html"), "utf8");
    expect(html).toMatch(/Budget \(10%\)/);
    expect(html).toMatch(/Grocery logistics \(8%\)/);
    expect(html).not.toMatch(/Budget \(12%\)/);
  });
  ```
  Both fail today (current weights are Grocery 6/Exercise 8; lecture states
  Budget 12%/Grocery 6%).
- **Implementation (green):** In `assignment-3-adulting.md`'s
  `marking.criteria`, change Grocery logistics `weight: 6` → `8` and
  Exercise `weight: 8` → `6` (criteria still sum to 100 — no other
  criterion changes). In `week-10.mdx`'s "What Assignment 3's budget
  section actually wants" bullet, change "Budget (12%)" → "Budget (10%)"
  and "Grocery logistics (6%)" → "Grocery logistics (8%)".
- **Refactor:** None expected.
- **Acceptance criteria:** Both new tests pass; the existing
  `assessment-scheme.test.ts` "marks every item with weighted criteria
  summing to 100" test stays green (net change is zero).
- **Depends on:** None (independent of the LO/scope work, but must land as
  one commit per the spec's handoff note — the reweight and the lecture
  fix are one unit).

### Task 16: Final Exam scope rationale [x] (human review: accepted)

- **Description:** Add the live-checkable-vs-extended-duration explanation
  for the exam's partial scope.
- **Files touched:** `src/content/assessments/final-exam.md`.
- **Tests first (red):** Add to `describe("final exam")`:
  ```ts
  it("explains why its scope excludes weeks 5, 6, and 9", () => {
    expect(html).toMatch(/extended|self-reported/i);
    expect(html).toMatch(/live|real[- ]time/i);
  });
  ```
  Fails today (no such explanation exists).
- **Implementation (green):** Add a short paragraph (near the "The five
  stations" intro or as its own subsection) stating that weeks 5, 6, and 9
  are excluded because their evidence is inherently extended-duration or
  self-reported and can't compress into a ~10-minute station without
  becoming fake, while the weeks kept reduce to a live, observable action
  worth re-checking under real-time pressure.
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes; doesn't contradict the
  existing "sits after teaching ends" or station-order tests.
- **Human review:** Read the paragraph for tone (matter-of-fact, not
  defensive) and check it doesn't imply weeks 5/6/9 are less important.
- **Depends on:** None.

### Task 17: Station 1 hobby/interest check (real exam page and practice exam) [x] (human review: accepted, after several rounds)

**Execution notes (2026-09-19):**
- Real-exam wording went through two rounds: dropped the requirement
  that the hobby be "the one you named in Week 6's Lab brainstorm"
  (the practice exam doesn't enforce that either), then dropped the
  "kind of check Week 6's Lab brainstorm first introduced" attribution
  clause too as unclear — final wording is plain: "plus a hobby or
  interest you engage in."
- The poor-solution schedule was strengthened per user feedback: rather
  than a blank hobby entry, it logs "Coding a side project" — which
  fails Week 6's actual formal Hobby definition ("not involving a
  compiler") the same way the existing vending-machine-walk entry fails
  Exercise. `compiler` intentionally kept, not changed to `computer`,
  per user decision — it's Week 6's own pre-existing definition text,
  out of this plan's scope to edit.
- Adding the hobby check pulled Week 6 itself into the Final Exam's
  content scope (the check traces to Week 6's Lab, even though the
  wording above no longer says so explicitly) — caught by the user,
  not by a test. Cascaded into: `contentScope.weeks`/`display` gained
  6 (now "Weeks 1-4, 6-8, 10-12"), `related[]` gained `lectures/week-06`,
  and Task 16's rationale paragraph was corrected — weeks 5 and 9 are
  now the excluded set (not 5, 6, 9), "a week of device discipline"
  dropped from the reasoning, and 6 added to the kept-weeks list. No
  stray backlink issue this time (`week-06.mdx`/`week-06.md` had no
  existing `related` edge to `final-exam`). Requirement 4's Final Exam
  row and Task 16's own description are superseded by this note.

- **Description:** Add the LO4 hobby/interest check to Station 1 on both
  pages, rebalancing the practice exam's rubric to 5 criteria.
- **Files touched:** `src/content/assessments/final-exam.md`,
  `src/pages/assessments/final-exam/practice-exam.astro`.
- **Tests first (red):** Add to `describe("final exam")`:
  ```ts
  it("adds a hobby or interest check to Station 1, tied to Week 6's Lab", () => {
    expect(html).toMatch(/hobby|interest/i);
  });
  ```
  Add to `spec/practice-exam.test.ts`'s `describe("station 1: hygiene and health")`:
  ```ts
  it("checks a hobby or interest alongside hygiene, sleep, laundry, and exercise", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    expect(section).toMatch(/Hobby|Interest/);
  });
  ```
  Both fail today.
- **Implementation (green):** In `final-exam.md`'s Station 1 bullet, add a
  hobby/interest check sentence attributed to Week 6's Lab brainstorm. In
  `practice-exam.astro`'s Station 1 `<ul class="course-list">` of stated
  intents, add `<li>Hobby or interest: ________________________________</li>`;
  extend the fill-in schedule/checking instructions to cover it; rebalance
  the rubric table from 4 rows (4/4/4/3) to 5 rows summing to 15 (e.g.
  3/3/3/3/3 or 4/4/3/2/2 — implementer's choice, as long as it sums to 15
  and each row is independently checkable); update the model solution,
  poor solution, and examiner's notes paragraphs to reference the new
  criterion; the band table's descriptions gain a mention of the fifth
  criterion.
- **Refactor:** None expected.
- **Acceptance criteria:** All 3 new/changed tests pass; the existing
  `practice-exam.test.ts` assertion `expect(section).toMatch(/out of 15/)`
  still passes (total unchanged).
- **Human review:** Read the updated Station 1 model/poor solutions and
  rubric for internal consistency (the poor-solution example should now
  also address or conspicuously omit the hobby/interest criterion).
- **Depends on:** None.

### Task 18: Station 4 incident-report tie-in (real exam page and practice exam) [x] (human review: accepted)

**Execution note (2026-09-19):** per user feedback, the practice
exam's rubric gained a 5th criterion — "Structures the answer as an
incident report" — rebalanced to 4/4/4/4/4=20 (from 5/5/5/5=20), with
the HD/D/C band descriptions updated to reference it.

- **Description:** Make Station 4's format explicitly mirror Week 8's
  incident-report structure.
- **Files touched:** `src/content/assessments/final-exam.md`,
  `src/pages/assessments/final-exam/practice-exam.astro`.
- **Tests first (red):** Add to `describe("final exam")`:
  ```ts
  it("ties Station 4's format to Week 8's incident-report structure", () => {
    expect(html).toMatch(/incident report/i);
  });
  ```
  Add to `spec/practice-exam.test.ts`'s `describe("station 4: reading the room")`:
  ```ts
  it("names the incident-report structure from Week 8", () => {
    const section = html.slice(html.indexOf("<h2>Station 4"), html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/incident report/i);
  });
  ```
  Both fail today.
- **Implementation (green):** In `final-exam.md`'s Station 4 bullet, add a
  clause tying the diagnose-then-respond format explicitly to Week 8's
  incident-report structure. In `practice-exam.astro`'s Station 4 section,
  add the same explicit naming to the description and/or the model
  solution and examiner's notes (e.g. reframing "what was agreed, what
  actually happened, the actual reason" as the named incident-report
  shape).
- **Refactor:** None expected.
- **Acceptance criteria:** Both new tests pass; existing Station 4 tests
  (stall-cue naming, exit response, band table "out of 20") stay green.
- **Depends on:** None.

### Task 19: Per-assessment FAQ sections [x] (human review: accepted, after two correctness fixes)

**Execution note (2026-09-19):** two draft answers stated the wrong
rule and were corrected per user review: A3's hangout/interview FAQ
originally said "no" outright, when the actual restriction (Task 14)
only bars the same Wednesday *afternoon*, not the whole day — now
correctly says "yes." The Final Exam's leftover-time FAQ originally
said time wasn't transferable between stations, contradicting the
page's own stated pacing rule ("how you divide your own time between
stations... is up to you, not a strict per-station cutoff") — now
correctly says "yes," with the Station 3 exception noted.

- **Description:** Add a "## FAQ" section with ≥2 naive-question Q&A pairs
  to each of the 5 assessment files.
- **Files touched:** all 5 files in `src/content/assessments/`.
- **Tests first (red):** Add to `spec/assessment-scheme.test.ts`:
  ```ts
  function faqQuestionCount(html: string): number {
    const start = html.search(/<h2[^>]*>FAQ</);
    if (start === -1) return 0;
    const rest = html.slice(start);
    const nextH2 = rest.slice(1).search(/<h2[^>]*>/);
    const section = nextH2 === -1 ? rest : rest.slice(0, nextH2 + 1);
    return (section.match(/<h3[^>]*>/g) ?? []).length;
  }

  describe("per-assessment FAQ", () => {
    const ids = [
      "assessments/weekly-reflections",
      "assessments/assignment-1-makeover",
      "assessments/assignment-2-touch-grass",
      "assessments/assignment-3-adulting",
      "assessments/final-exam",
    ];
    it.each(ids)("%s publishes an FAQ with at least 2 questions", (id) => {
      const html = readFileSync(resolve(`dist/${id}/index.html`), "utf8");
      expect(faqQuestionCount(html), `${id} has too few FAQ questions`).toBeGreaterThanOrEqual(2);
    });
  });
  ```
  Fails today (no FAQ sections exist).
- **Implementation (green):** Add a `## FAQ` section to each of the 5
  markdown files, each question as a `### `-level heading followed by an
  answer paragraph, at least 2 per file, written from a naive CS-student
  perspective specific to that assessment's brief (e.g. A1: "does a hoodie
  count as a hygiene product if I wear it every day?"; Final Exam: "can I
  bring my own kitchen knife to Station 5?"), in the course's established
  voice — no technical metaphor, no backticked jargon.
- **Refactor:** None expected.
- **Acceptance criteria:** All 5 `it.each` cases pass;
  `spec/voice.test.ts`'s F2 (banned terms) and F3 (no `<code>`) checks stay
  green for all 5 pages.
- **Human review:** Read all 5 FAQs against `CLAUDE.md`'s
  Register-and-voice table (the joke is institutional seriousness applied
  to mundane CS-student specifics, never a technical metaphor) and confirm
  each question is genuinely specific to its own assessment, not
  interchangeable boilerplate.
- **Depends on:** Tasks 9–18 recommended to land first (so FAQ content can
  reference the finalized bands/tie-ins without contradicting them), but
  not a hard technical dependency.

### Task 20: Final Exam venue/station layout note (new scope, added 2026-09-19) [x] (human review: accepted)

**Execution note (2026-09-19):** after the first Human review round, the
user asked for the identical sentence on `practice-exam.astro` too (it
already repeats the real exam's conditions elsewhere, per
`spec/practice-exam.test.ts`'s "repeats the real exam's conditions"
test) — added as the same exact wording, verified with its own red test
in `spec/practice-exam.test.ts`.

- **Description:** Not one of the original 19 tasks — found by the user
  while reviewing Task 8's overview paragraph, which mentioned exam
  stations, prompting the observation that `final-exam.md` never states
  how candidates physically move between the five stations at all.
  Confirmed with the user to add now, as its own scoped addition rather
  than deferred.
- **Files touched:** `src/content/assessments/final-exam.md`,
  `src/pages/assessments/final-exam/practice-exam.astro` (added after
  Human review; see execution note above).
- **Tests first (red):** Add to `describe("final exam")` in
  `spec/assessment-scheme.test.ts`:
  ```ts
  it("describes the venue as designated stations candidates walk between", () => {
    expect(html).toMatch(/designated station/i);
    expect(html).toMatch(/walk|move/i);
  });
  ```
  Fails today — no such text exists anywhere on the page.
- **Implementation (green):** Add one sentence to the "Exam conditions"
  section (after the existing "Stations may be completed in any order."
  line) stating the venue is divided into designated station areas that
  candidates walk between to attempt each one.
- **Refactor:** None expected.
- **Acceptance criteria:** New test passes; doesn't contradict "lets
  candidates attend the five stations in any order" or "makes clear the
  total 2 hour 50 minute session is fixed" (existing tests).
- **Human review:** Read the added sentence for tone (matter-of-fact,
  consistent with the surrounding Exam conditions list) and confirm it
  doesn't imply a stricter or looser movement rule than intended.
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [x] Every task in §5 complete and its tests passing (Tasks 1–20, 20
      being new scope found and added during execution — see its note)
- [x] `pnpm test` passes (runs `astro build` then `vitest run spec`) —
      432 tests, 21 files, all passing
- [x] `pnpm check` passes (`astro check` typecheck + `pnpm test`) — 0
      errors, 0 accessibility violations, 0 broken links
- [x] Manually verified: every task carrying a `Human review:` line was
      shown to the user and explicitly accepted, most after one or more
      correction rounds (see each task's execution note) — this stands
      in for a single end-of-plan pass, since the review happened
      task-by-task as each page changed rather than once at the end
- [x] Every requirement in §2 is covered — see §7 (three requirements
      — 2.1.7, 2.1.29, and the A1/A2/exam scope values in 2.1.4 — were
      superseded by Human-review-driven corrections; noted, not silently
      diverged from)
- [x] Every task with a `Human review:` line (Tasks 4, 7, 8, 9, 10, 11,
      16, 17, 18, 19, 20) has been shown to the user and explicitly
      accepted
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (`contentScope` field) | Task 1 |
| 2.1.2 (`learningOutcomes` field) | Task 1 |
| 2.1.3 (`dueWeekLabel` field) | Task 1 |
| 2.1.4 (concrete field values, all 5 files) | Task 1 — A1/A2 corrected mid-execution to weeks 1-3/4-7 (not 1-4/5-7); Final Exam corrected to include week 6 after Task 17 pulled it into scope (see those tasks' notes) |
| 2.1.5 (Due row appends week label) | Task 5 |
| 2.1.6 (Content scope row) | Task 6 |
| 2.1.7 (Learning outcomes row + links) | Task 7 — behaviour changed after Human review: individually-listed, tooltip + link, not a collapsed range display (still confirmed with user) |
| 2.1.8 (homepage LO reorder) | Task 4 |
| 2.1.9 (homepage `<ol>` + anchors) | Task 4 |
| 2.1.10 (assessment index overview) | Task 8 |
| 2.1.11 (grade bands A1/A2/exam) | Tasks 9, 10, 11 |
| 2.1.12 (A1 enclothed cognition) | Task 12 |
| 2.1.13 (A2 three Reflection tie-ins) | Task 13 |
| 2.1.14 (Week 4 Lab line) | Task 13 |
| 2.1.15 (A3 weather clause) | Task 14 |
| 2.1.16 (A3 hangout/interview clash note) | Task 14 |
| 2.1.17 (A3 reweight) | Task 15 |
| 2.1.18 (Week 10 lecture fix) | Task 15 |
| 2.1.19 (exam scope rationale) | Task 16 — corrected to exclude weeks 5 and 9 (not 5, 6, 9) after Task 17 pulled week 6 into scope |
| 2.1.20 (Station 1 hobby check, real page) | Task 17 |
| 2.1.21 (practice exam Station 1 rebalance) | Task 17 |
| 2.1.22 (Station 4 incident-report tie-in, real page) | Task 18 |
| 2.1.23 (practice exam Station 4 tie-in) | Task 18 |
| 2.1.24 (per-assessment FAQ) | Task 19 |
| 2.1.25 (real `contentScope`/`related` harness checks) | Task 2 |
| 2.1.26 (LO index range assertion) | Task 1 |
| 2.1.27 (FAQ ≥2 Q&A assertion) | Task 19 |
| 2.1.28 (band-descriptor test extended to A1/A2/exam) | Tasks 9, 10, 11 |
| 2.1.29 (`toOutcomeRanges` helper + unit test) | Task 3 — built, then removed as dead code once Task 7's Human review rejected range display; requirement no longer satisfied (confirmed with user) |
| 2.2 (non-functional: voice/register, visual check) | Tasks 4, 7, 8, 9, 10, 11, 16, 17, 18, 19, 20 (Human review lines) |
| (new scope) Final Exam venue/station layout | Task 20 — found by the user during Task 8's review, not in the original 25 requirements |

## 8. Risks / open questions

None.
