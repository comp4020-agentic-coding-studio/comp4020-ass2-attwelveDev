# SLOP1521 curriculum: twelve weeks, five assessments and the Week 1 deck

- **Date:** 2026-09-09
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-09 (via
  `specs/2026-09-09-slop1521-introduction-to-life.md`)

## 1. Summary

The second of three plans for the COMP4020 Assignment 2 course website. Plan 1
(`plans/2026-09-09-slop1521-foundation.md`) built the shell — course record,
cast, policies, homepage, harness. This plan builds the course itself: twelve
**lectures** (Tuesday, theory) each paired with a **Lab** (Thursday, practical),
five assessments totalling exactly 100%, the Week 1 slide deck, and the seven
`spec/` checks that keep them coherent. Plan 3
(`plans/2026-09-09-slop1521-visual-treatment.md`) restyles what this plan
writes.

This is the largest of the three plans and the one the "response to the brief"
criterion is mostly read against: twelve weeks that repeat one another is the
brief's own named failure mode. The five-slot weekly structure is the defence,
and Task 11 turns it from an instruction into a build failure.

The design lives in `specs/2026-09-09-slop1521-introduction-to-life.md` §4.2,
§4.3 and §4.7. Read it first; this plan does not restate the reasoning.

## 2. Requirements

### 2.1 Functional requirements

1. **F2.1** (spec F8) Twelve `lectures` entries with `week` 1–12, one per week,
   dated the **Tuesday** of that teaching week, each with `teachers:` resolving
   to a real cast entry.
2. **F2.2** (spec F8) Twelve `sessions` entries — the Labs — with `week` 1–12,
   one per week, dated the **Thursday** of that teaching week, each with
   `teachers:` and a `spec:` array of 2–3 checkable conditions.
3. **F2.3** (spec F10) Every lecture body carries all five slot headings, in
   this order: **Overview**, **Content**, **Case study**, **Reflection**,
   **Assessment tie-in**. The last may read that there is none this week, but
   the heading is always present.
4. **F2.4** Every Lab body carries the same three headings in order: **Before
   the Lab**, **In the Lab**, **Afterwards**.
5. **F2.5** Weeks 3, 5, 7, 9, 10 and 12 carry the six new case studies from the
   spec §4.2; weeks 1, 2, 4, 6, 8 and 11 carry the six from the original design.
   Week 12's revisits the Week 1 desk setup and the Week 2 sock pile by name.
6. **F2.6** (spec F11) Exactly five `assessments` entries with weights
   15 + 15 + 20 + 20 + 30, summing to **exactly 100**.
7. **F2.7** Every assessment carries `marking.mode === "weighted"` with criteria
   summing to 100, and a `spec:` array of checkable conditions.
8. **F2.8** (spec F12) The Weekly Reflections page states its arithmetic:
   eleven prompts, lowest dropped, ten counted at 1.5% each = 15%.
9. **F2.9** Each assessment's stated content coverage ends at or before its own
   `week`.
10. **F2.10** (spec F13) Assignment 2's page states the 5-minute CS-discussion
    limit and that compliance is self-reported.
11. **F2.11** (spec F14) Assignment 3 carries the twelve-criterion rubric in
    frontmatter and five band descriptors (HD/D/C/P/N) as a list in the body.
12. **F2.12** (spec F3) `lectures/week-01` carries `slides: /decks/week-01/`
    and that deck exists in the build as real, course-specific content.
13. **F2.13** All five deadlines are at **12:00** local, with the correct
    offset for the date (`+11:00` before 2027-04-04, `+10:00` after).
14. **F2.14** (spec F17) No lecture, Lab, assessment or exam station breaks
    character.
15. **F2.15** Every `STARTER_CONTENT` marker in the files this plan touches is
    removed with the content it marked: both starter lectures, both starter
    sessions, both starter assessments, and `src/decks/week-01.deck.mdx`.
16. **F2.16** No dangling `related:` or `teachers:` ref at any task boundary.

### 2.2 Non-functional requirements

- `pnpm check` passes at every task boundary; the build fails on a dangling
  content ref, so ref hygiene is enforced continuously rather than at the end.
- `spec/data-integrity.test.ts` must stay green: every `date` and `due` inside
  `2027-02-22`…`2027-06-19`. Verified for all 29 dated nodes before this plan
  was written (§3.2).
- Rendered output verified with `agent-browser` at `1920 1080` and `390 844`.
- The deck must be legible at both viewports; the build compiles decks but
  nothing checks whether a slide fits.
- No page exceeds what a marker reads in ten minutes: the brief says they read
  the home page, a few non-adjacent weeks, an assessment and the deck.

### 2.3 Out of scope

- Course record, cast, policies, homepage, artwork, `CLAUDE.md` — Plan 1.
- All visual treatment, including rendering the week list as a schedule table
  and the mono glossary markup — Plan 3. This plan writes the systems
  vocabulary as ordinary prose; Plan 3 marks it up.
- `PROCESS.md` — the user writes it.
- A second deck. The spec requires at least one; only Week 1's is planned.

### 2.4 Assumptions

1. The five-slot rule (F2.3) applies to **lecture** bodies, not Labs. The spec's
   check 4 says "every lecture body"; Labs get their own three-part shape
   (F2.4), which is the template's own convention in
   `src/content/sessions/01-getting-started.md` and is worth keeping because a
   practical genuinely has a before, during and after.
2. Assessment slugs are renamed from the starter's, because the collection key
   is the URL and API path: `weekly-reflections`, `assignment-1-makeover`,
   `assignment-2-touch-grass`, `assignment-3-adulting`, `final-exam`. Both
   starter files are deleted rather than renamed in place.
3. Lab entries keep the `sessions` collection key, refs and `/sessions/` URLs —
   only the reader-facing label is Labs, set once in Plan 1 Task 2.

## 3. Existing code context

### 3.1 Schemas the content must satisfy

From `src/content.config.ts`, verified 2026-09-09:

```ts
const weekSchema = z.coerce.number().int().min(1).max(12);
const teacherRefs = z.array(reference("people")).min(1);

sessions:    courseNodeSchema.extend({ week: weekSchema, date: z.coerce.date(),
                                       teachers: teacherRefs.optional() }).loose()
lectures:    courseNodeSchema.extend({ week: weekSchema, date: z.coerce.date(),
                                       teachers: teacherRefs.optional(),
                                       slides: z.string().regex(/^\/decks\/[a-z0-9-]+\/$/).optional()
                                     }).loose()
assessments: courseNodeSchema.extend({ week: weekSchema, due: z.coerce.date(),
                                       weight: z.coerce.number().positive().max(100),
                                       marking: z.discriminatedUnion("mode",
                                                  [weightedMarking, holisticMarking]).optional()
                                     }).loose()
```

`weightedMarking` is
`{ mode: "weighted", criteria: { name: string, weight: number>0 }[] }` with a
`.superRefine` that **fails the build** if the criterion weights do not sum to
exactly 100. `holisticMarking` is `{ mode: "holistic", description: string≥40 }`
— not used by this plan.

`courseNodeSchema` (from `astro-course-university/schemas`) supplies
`title` (required), `description`, `tags` (default `[]`), `related` (default
`[]`), `links`, `spec` (default `[]`), `published` (default true),
`draft` (default false). Reserved names are exactly those; any other frontmatter
key passes through `.loose()` into the node's API `meta`.

`week` caps at **12**, which is why the Final Exam is `week: 12` even though it
falls after teaching ends.

### 3.2 The verified calendar

Semester 1 2027: `startDate 2027-02-22`, `endDate 2027-06-19` (Plan 1 Task 1).
Teaching weeks 1–6 then a two-week break (Mondays 5 and 12 April) then weeks
7–12. Lectures Tuesday, Labs Thursday — chosen because **Good Friday
2027-03-26** is the Friday of week 5, **Easter Monday 2027-03-29** is the Monday
of week 6, and **ANZAC Day observed 2027-04-26** is the Monday of week 8.

All 29 dates below were verified in-window and clash-free before this plan was
written:

| Wk | Lecture (Tue) | Lab (Thu) |
| --- | --- | --- |
| 1 | 2027-02-23 | 2027-02-25 |
| 2 | 2027-03-02 | 2027-03-04 |
| 3 | 2027-03-09 | 2027-03-11 |
| 4 | 2027-03-16 | 2027-03-18 |
| 5 | 2027-03-23 | 2027-03-25 |
| 6 | 2027-03-30 | 2027-04-01 |
| 7 | 2027-04-20 | 2027-04-22 |
| 8 | 2027-04-27 | 2027-04-29 |
| 9 | 2027-05-04 | 2027-05-06 |
| 10 | 2027-05-11 | 2027-05-13 |
| 11 | 2027-05-18 | 2027-05-20 |
| 12 | 2027-05-25 | 2027-05-27 |

| Assessment | `week` | `due` |
| --- | --- | --- |
| `weekly-reflections` | 1 | `2027-03-02T12:00:00+11:00` |
| `assignment-1-makeover` | 4 | `2027-03-19T12:00:00+11:00` |
| `assignment-2-touch-grass` | 8 | `2027-04-30T12:00:00+10:00` |
| `assignment-3-adulting` | 12 | `2027-05-28T12:00:00+10:00` |
| `final-exam` | 12 | `2027-06-09T12:00:00+10:00` |

**Noon is mandatory.** `src/lib/dates.ts:3` formats with `timeZone: "UTC"`, so a
`09:00+11:00` deadline is `22:00Z` the previous day and renders as the wrong
date — verified by running the formatter. Both starter assessments already use
`12:00+10:00`. Australia/Canberra leaves daylight saving on **2027-04-04**.

### 3.3 Starter files this plan replaces

```
src/content/lectures/week-01.md            week 1, 2027-02-22, slides: /decks/week-01/
src/content/lectures/week-02.md            week 2, 2027-03-01
src/content/sessions/01-getting-started.md week 1, 2027-02-22, has a `spec:` array
src/content/sessions/02-first-review.md    week 2, 2027-03-01, related: assessments/assignment-1
src/content/assessments/assignment-1.md    week 6, due 2027-04-12T12:00:00+10:00, weight 40,
                                           marking weighted 60/40, related: final-project
src/content/assessments/final-project.md   week 12, due 2027-05-28T12:00:00+10:00, weight 60,
                                           marking holistic
src/decks/week-01.deck.mdx                 the starter deck
```

**Ref hazard:** `sessions/02-first-review.md` and `lectures/week-02.md` both
declare `related: [..., assessments/assignment-1]`, and `assessments/
assignment-1.md` declares `related: [final-project]`. The build fails on a
dangling ref, so deleting the starter assessments requires **both** referring
files to be fixed in the same task (Task 1) — `lectures/week-02.md` isn't
rewritten until Task 7, so leaving its ref unfixed would break `pnpm check` at
any task boundary between Task 1 and Task 7 (Tasks 2, 5 and 12 can all land in
that window per their declared dependencies). Plan 1 Task 3 already repointed
all four `teachers:` refs to the new convenor.

### 3.4 How pages render, so bodies are written to fit

`src/pages/assessments/[slug].astro` renders, in order: a `<p>` with
**Due** (via `formatCourseDate`) and **Weight**, then `<Content />` (the body),
then `<SpecList spec={...}>`, then `<MarkingModel marking={...}>`, then
`<RelatedContent>`. So the body must **not** restate due date, weight, the spec
list or the rubric — those are frontmatter, rendered around it.

`src/components/MarkingModel.astro:22` renders `weighted` as a two-column
`<table>` (Criterion / Weight) and `holistic` as a single `<p>` — which is why
A3's band descriptors go in the **body**, not the marking field.

Lecture and Lab pages render through
`src/pages/lectures/[slug].astro` and `src/pages/sessions/[slug].astro`.

### 3.5 Decks

`src/decks/*.deck.mdx` build to `/decks/<name>/`, rendered by **astromotion**:
markdown with `---` between slides, plus slide classes, backgrounds, speaker
notes, QR codes and fragments. `src/decks/theme.css` starts as one import and
derives its colours from the same brand tokens the site uses, so a deck already
matches. `astro.config.ts` passes `fontVariables: ["--font-public-sans"]`.

A deck is **not** a content-collection entry, so it has no `related:` edges — it
is linked from its lecture by the `slides:` frontmatter key, which
`src/pages/lectures/[slug].astro` renders automatically, and may additionally be
linked from prose with a markdown link (`[Slides](/decks/week-01/)`), which the
build rewrites for the base path.

The build compiles every deck and catches invalid MDX or astromotion syntax.
**Nothing checks whether a slide fits or stays legible** — that only shows up in
a browser at the two marking viewports.

### 3.6 Test setup

Identical to Plan 1 §3.7. Framework **vitest 4**, no config file.
`pnpm test` = `pnpm build && vitest run spec`; `pnpm check` adds `pnpm
typecheck`. Tests live in `spec/*.test.ts` and read `dist/`, never `src/` —
`dist/api/index.json` for structured facts and
`dist/<collection>/<slug>/index.html` for rendered ones. Convention comes from
`spec/data-integrity.test.ts`: module-scope `readFileSync`, a local
`interface ApiNode`, `expect` with a message as its second argument.

API node shape: `{ id, type, title, description, tags, related, spec, meta }`.
`meta.date` is a bare `YYYY-MM-DD` string; `meta.due` is the raw offset string;
`meta.marking` carries the criteria array; `meta.week` is a number.

### 3.7 Conventions to match

- 2-space YAML, `description` as a wrapped block scalar, refs as bare slugs
  within a collection and `<collection>/<slug>` across them.
- Lecture bodies in the starter are short and link out rather than restating;
  Lab bodies use `## Before the session` / `## In the session` / `## Afterwards`.
- Prose register: plain, second-person, no filler. For this course, add: fully
  in character, systems vocabulary as ordinary prose (Plan 3 marks it up),
  and the joke aimed at the institution, never the student.

## 4. Approach

Frontmatter first, prose second. Every mechanically checkable promise this
course makes lives in frontmatter — weeks, dates, weights, marking criteria,
spec lines, refs — and the schema plus `spec/` tests can hold all of it. Bodies
are prose a crit judges. So Task 1 lands all five assessment files with final
frontmatter and skeleton bodies, which makes checks 1, 2 and 8 pass immediately
and permanently, and gets the dangling-ref hazard (§3.3) out of the way in one
place. Tasks 2–6 then write one brief each.

The weeks follow in four blocks of three (Tasks 7–10), each block creating three
lectures and three Labs together, because a week's lecture and Lab are written
against each other and splitting them would mean writing the same week twice.
Blocks of three also keep each task reviewable and let the structural check land
before all twelve exist — Task 11 runs against whatever is there and starts
failing usefully as soon as the first block is written.

Task 11 is the important one. The spec's check 4 — every lecture body carries
all five headings in order — is what stops twelve weeks drifting into twelve
differently-shaped pages, which is the brief's named failure mode. It is written
as an assertion over rendered HTML rather than over source, because the render
is the truth and a heading that fails to render is a heading that isn't there.

The deck is last (Task 12) because it presents Week 1, and Week 1's content has
to exist before a deck can present it.

**Alternative considered and rejected:** writing all twelve lectures first and
all twelve Labs second. Rejected because the Lab is the practical for that
week's theory, so the pair is the real unit; separating them invites twelve Labs
that generically say "practise this week's content", which is exactly the
repetition the brief penalises.

**Alternative considered and rejected:** one task per week (twelve tasks) plus
five assessment tasks. Rejected as too granular — a single week is under an
hour's work and the per-task overhead would dominate — but blocks larger than
three weeks stop being reviewable in one sitting.

## 5. Task breakdown

### Task 1: Land all five assessments' frontmatter and the weight checks

- **Description:** Create the five assessment files with final frontmatter and
  skeleton bodies, delete both starter assessments, and fix the referring side
  of the two stale refs. Establishes the 100% total permanently.
- **Files touched:** new `src/content/assessments/weekly-reflections.md`,
  `assignment-1-makeover.md`, `assignment-2-touch-grass.md`,
  `assignment-3-adulting.md`, `final-exam.md`; delete
  `src/content/assessments/assignment-1.md`,
  `src/content/assessments/final-project.md`; edit
  `src/content/sessions/02-first-review.md` and
  `src/content/lectures/week-02.md` (drop each's
  `related: [assessments/assignment-1]` entry — both are rewritten again in
  full by Task 7, so this is a one-line stopgap to keep the build green in the
  meantime); new `spec/assessment-scheme.test.ts`.
- **Tests first (red):** `spec/assessment-scheme.test.ts`, reading
  `dist/api/index.json` and filtering `nodes` to `type === "assessments"`:
  - `it("is a scheme of exactly five items")` — 5 nodes.
  - `it("adds up to exactly 100 percent")` — the sum of `meta.weight` is
    strictly `100`. *(Spec check 1. The schema caps each weight at 100 but
    nothing enforces the total, which is why this is ours.)*
  - `it("weights each item as designed")` — a map of slug → weight equals
    `{ "weekly-reflections": 15, "assignment-1-makeover": 15,
    "assignment-2-touch-grass": 20, "assignment-3-adulting": 20,
    "final-exam": 30 }`.
  - `it("marks every item with weighted criteria summing to 100")` — every node
    has `meta.marking.mode === "weighted"` and its `criteria` weights sum to
    100.
  - `it("sets every deadline at noon")` — every `meta.due` matches
    `/T12:00:00(\+10:00|\+11:00)$/`. *(Guards §3.2's UTC trap.)*
  - `it("uses the right offset for the date")` — `meta.due` before
    `2027-04-04` ends `+11:00`; on or after, `+10:00`.
  - `it("keeps every item inside weeks 1 to 12")` — every `meta.week` is an
    integer 1–12.
  - `it("never examines content from a later week")` — for each node, a
    hand-declared coverage-end week is ≤ `meta.week`:
    reflections 1≤1, makeover 3≤4, touch-grass 7≤8, adulting 12≤12,
    final-exam 12≤12. *(Spec check 8.)*
  - `it("gives every item a spec list")` — every node's `spec` array is
    non-empty.
- **Implementation (green):** five files with the frontmatter in §3.2 plus
  `title`, `description`, `marking` and `spec`. Criteria per the spec §4.3:
  reflections `Completion 60 / Specificity 40`; makeover
  `Hygiene product selection 40 / Outfit appropriateness 40 / Justification 20`;
  touch-grass `Observation 40 / Reflection 35 / Compliance with restrictions 25`;
  adulting the twelve criteria (14/14/12/10/8/8/8/6/6/5/5/4); final-exam the
  five stations (15/15/20/20/30). Bodies are a single placeholder line each,
  filled by Tasks 2–6. Remove the two starter files and both stale refs.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All nine assertions pass; `pnpm check` green with no dangling-ref error.
  - `/assessments/` lists five items, ordered by week.
  - `git grep -F STARTER_CONTENT -- src/content/assessments` returns nothing.
- **Depends on:** Plan 1 Task 3 (a resolvable cast) and Plan 1 Task 1 (the date
  window that admits `2027-06-09`).

### Task 2: Write the Weekly Reflections brief with its visible arithmetic

- **Description:** Write the reflections brief, including the eleven prompts and
  the stated arithmetic.
- **Files touched:** `src/content/assessments/weekly-reflections.md`;
  `spec/assessment-scheme.test.ts` (extend).
- **Tests first (red):** extend `spec/assessment-scheme.test.ts`, reading
  `dist/assessments/weekly-reflections/index.html`:
  - `it("states the reflection arithmetic")` — the HTML contains `11`, `10`,
    `1.5%` and `15%`. *(Spec check 2.)*
  - `it("publishes eleven prompts")` — the rendered page contains eleven
    prompt list items; assert by counting occurrences of a stable per-prompt
    marker (`Week 1` … `Week 11`) and expecting 11.
  - `it("sets week 12's prompt without grading it")` — the HTML matches
    `/Week 12/` and `/ungraded|not graded|not marked/i`.
  - `it("declares the drop-lowest rule")` — matches `/lowest/i`.
- **Implementation (green):** write the body: the scheme, the arithmetic
  (eleven prompts, lowest dropped, ten counted at 1.5% = 15%), the eleven
  prompts as a list keyed by the week whose content they reflect on, and a note
  that Week 12's prompt is set but ungraded and folded into Assignment 3. Do not
  restate due date, weight, the spec list or the rubric — §3.4.
- **Refactor:** None expected.
- **Acceptance criteria:** the four assertions pass; the arithmetic on the page
  is internally consistent with `meta.weight` (15); the page reads in character.
- **Depends on:** Task 1.

### Task 3: Write the Assignment 1 (Makeover) brief

- **Description:** Write the A1 brief — hygiene products and three outfits for
  three named occasions, covering weeks 1–3.
- **Files touched:** `src/content/assessments/assignment-1-makeover.md`.
- **Tests first (red):** extend `spec/assessment-scheme.test.ts`, reading
  `dist/assessments/assignment-1-makeover/index.html`:
  - `it("names all three occasions")` — matches `/lecture/i`,
    `/birthday party/i` and `/gym/i`.
  - `it("requires evidence and justification")` — matches
    `/screenshot|picture|image/i` and `/justif/i`.
- **Implementation (green):** the brief, in character: the shopping premise, the
  hygiene-product selection, the three outfits, and the requirement to attach
  images and justify each choice. Add `related: [lectures/week-03]`.
- **Refactor:** None expected.
- **Acceptance criteria:** both assertions pass; the page names its week 1–3
  coverage; `pnpm check` green with the new ref resolving.
- **Depends on:** Task 1; Task 7 (for `lectures/week-03` to exist as a ref
  target).

### Task 4: Write the Assignment 2 (Touch Grass Field Study) brief

- **Description:** Write the A2 brief — the field study, its seven activity
  options, its three restrictions and the 1000-word report.
- **Files touched:** `src/content/assessments/assignment-2-touch-grass.md`.
- **Tests first (red):** extend `spec/assessment-scheme.test.ts`, reading
  `dist/assessments/assignment-2-touch-grass/index.html`:
  - `it("caps CS discussion at five minutes")` — matches `/five minutes|5
    minutes/i`. *(Spec F13.)*
  - `it("says compliance is self-reported")` — matches
    `/self-reported/i` and `/the report is the evidence/i`.
  - `it("offers all seven activities")` — contains `park`, `caf`, `team
    sports`, `museum`, `social event`, `shopping`, `club`.
  - `it("requires two non-CS people")` — matches `/two|2/` near `/non-CS/i`.
  - `it("sets the word count")` — contains `1000` or `1,000`.
- **Implementation (green):** the brief: the seven options, the three
  restrictions (no laptop or coding, CS discussion capped at five minutes, at
  least two non-CS people), the self-reported-compliance line, and the
  1000-word report requirement. Add `related: [lectures/week-05]`.
- **Refactor:** None expected.
- **Acceptance criteria:** all five assertions pass; the page names its week 4–7
  coverage; the compliance line is in character, not apologetic.
- **Depends on:** Task 1; Task 8 (for `lectures/week-05`).

### Task 5: Write the Assignment 3 (Time to be an Adult) brief and band descriptors

- **Description:** Write the A3 brief — the week-long plan with its seven
  required components — plus five band descriptors in the body, since
  `MarkingModel` renders `holistic` as one flat paragraph (§3.4).
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`.
- **Tests first (red):** extend `spec/assessment-scheme.test.ts`, reading
  `dist/assessments/assignment-3-adulting/index.html`:
  - `it("requires all seven plan components")` — matches
    `/daily routine/i`, `/laundry/i`, `/meal plan/i`, `/budget/i`, `/date/i`,
    `/hangout|close friends/i`, `/interview/i`.
  - `it("publishes five band descriptors")` — the HTML contains `HD`, `D`, `C`,
    `P` and `N` as band labels in a list.
  - `it("describes the plan, not the student")` — the band text does not
    contain `you are` or `you can't`. *(Guards spec §4.4's register rule: bands
    describe the submitted plan's state, never the person.)*
  - `it("puts the Wednesday interview time in the student's hands")` — matches
    `/Wednesday/` and `/not been specified|unspecified|confirm/i`.
  - Asserted already in Task 1: the rubric's twelve criteria sum to 100.
- **Implementation (green):** the brief with all seven components, the
  Wednesday-afternoon interview whose time the student must email to confirm,
  and the HD thresholds as the `spec:` array (already in Task 1's frontmatter).
  Then five band descriptors in the body as a list, each describing the plan as
  a system state — per the spec §4.4, aimed at the plan and never the student.
- **Refactor:** None expected.
- **Acceptance criteria:** all four assertions pass; the rubric table renders
  below the body with twelve rows; no band descriptor addresses the reader's
  character.
- **Depends on:** Task 1.

### Task 6: Write the Final Exam brief with its five stations

- **Description:** Write the exam brief — five stations, their durations and
  what each examines.
- **Files touched:** `src/content/assessments/final-exam.md`.
- **Tests first (red):** extend `spec/assessment-scheme.test.ts`, reading
  `dist/assessments/final-exam/index.html`:
  - `it("runs five stations")` — matches `/Station 1/` … `/Station 5/`.
  - `it("publishes each station's duration")` — contains five duration strings;
    assert `10 minutes` appears and `2 hours` appears.
  - `it("warns that the examiner may leave")` — matches `/leave/i` in the
    small-talk station.
  - `it("sits after teaching ends")` — from the API, `meta.week === 12` and
    `meta.due` starts `2027-06-09`, while `lectures/week-12`'s `meta.date` is
    `2027-05-25`. *(Documents the deliberate week-12-plus-exam-window design so
    it reads as intentional rather than as a mistake.)*
- **Implementation (green):** the brief: the five stations with durations
  (10/10/10/10/130 minutes), what each requires, and the note that the
  small-talk examiner may leave if the conversation stalls and will leave at a
  hard limit. In character throughout.
- **Refactor:** None expected.
- **Acceptance criteria:** all four assertions pass; the station weights render
  as the marking table; total examined time is stated and internally consistent.
- **Depends on:** Task 1; Task 10 (for `lectures/week-12` to exist for the
  date assertion).

### Task 7: Weeks 1–3 — lectures and Labs

- **Description:** Create weeks 1, 2 and 3 as lecture/Lab pairs, replacing both
  starter lectures and both starter sessions.
- **Files touched:** new `src/content/lectures/week-01.md` … `week-03.md`
  (week-01 and week-02 replace starters in place); new
  `src/content/sessions/week-01.md` … `week-03.md`; delete
  `src/content/sessions/01-getting-started.md` and
  `src/content/sessions/02-first-review.md`; new
  `spec/weekly-structure.test.ts` (skeleton, completed in Task 11).
- **Tests first (red):** create `spec/weekly-structure.test.ts` with the
  assertions from Task 11 already written — they fail for the nine weeks that
  do not yet exist, and this task turns three of them green. Written now, not in
  Task 11, so blocks 2–4 are guarded as they land.
- **Implementation (green):** for each of weeks 1–3, a lecture with frontmatter
  (`title`, `description`, `week`, `date` per §3.2, `teachers`, `related` to
  that week's Lab) and a body carrying the five slots in order; and a Lab with
  (`title`, `description`, `week`, `date`, `teachers`, `spec` of 2–3 checkable
  conditions) and a body carrying the three slots. Week 1's lecture also carries
  `slides: /decks/week-01/`. Content per the spec §4.2 — including week 1's desk
  setup and week 2's sock pile as named recurring datasets, and week 3's new
  case study (the conference t-shirt worn to a wedding). Week 3's
  Assessment tie-in slot points at Assignment 1.
- **Refactor:** Rename the `sessions` slugs to `week-NN` for consistency with
  lectures; the collection key is the URL, so this changes `/sessions/week-01/`.
  Ensure nothing references the old `01-getting-started` / `02-first-review`
  slugs (Task 1 already removed the one `related:` that did).
- **Acceptance criteria:**
  - Six new pages render; `pnpm check` green; no dangling refs.
  - `spec/weekly-structure.test.ts` passes for weeks 1–3.
  - `git grep -F STARTER_CONTENT -- src/content/lectures src/content/sessions`
    returns nothing.
  - `/lectures/` and `/sessions/` list three entries each, in week order.
- **Depends on:** Plan 1 Task 3; Task 1.

### Task 8: Weeks 4–6 — lectures and Labs

- **Description:** Same shape as Task 7, for weeks 4, 5 and 6.
- **Files touched:** new `src/content/lectures/week-04.md` … `week-06.md`;
  new `src/content/sessions/week-04.md` … `week-06.md`.
- **Tests first (red):** `spec/weekly-structure.test.ts` (from Task 7) already
  asserts weeks 1–12; it currently fails for weeks 4–6.
- **Implementation (green):** weeks 4, 5 and 6 per the spec §4.2 — week 4's
  fridge-of-condiments case study, week 5's new 400-metre-radius case study,
  week 6's silent-group-chat case study. Week 4's Assessment tie-in points at
  Assignment 1 (due that week); weeks 5 and 6 state there is none.
- **Refactor:** None expected.
- **Acceptance criteria:** `spec/weekly-structure.test.ts` passes for weeks 1–6;
  `pnpm check` green; six new pages render at both viewports.
- **Depends on:** Task 7.

### Task 9: Weeks 7–9 — lectures and Labs

- **Description:** Same shape, for weeks 7, 8 and 9.
- **Files touched:** new `src/content/lectures/week-07.md` … `week-09.md`;
  new `src/content/sessions/week-07.md` … `week-09.md`.
- **Tests first (red):** as Task 8, failing for weeks 7–9.
- **Implementation (green):** weeks 7, 8 and 9 per the spec §4.2 — week 7's new
  failed-handshake transcript, week 8's incident-report case study, week 9's new
  600-word opening message. Week 8's Assessment tie-in points at Assignment 2.
  Week 9 carries the content note the policies page states in full, in character.
- **Refactor:** None expected.
- **Acceptance criteria:** `spec/weekly-structure.test.ts` passes for weeks 1–9;
  `pnpm check` green; week 9 reads as in-character and does not compel
  disclosure.
- **Depends on:** Task 8.

### Task 10: Weeks 10–12 — lectures and Labs

- **Description:** Same shape, for weeks 10, 11 and 12. Week 12 consolidates and
  must carry all five slots despite introducing no new content.
- **Files touched:** new `src/content/lectures/week-10.md` … `week-12.md`;
  new `src/content/sessions/week-10.md` … `week-12.md`.
- **Tests first (red):** as Task 8, failing for weeks 10–12. Plus, in
  `spec/weekly-structure.test.ts`:
  - `it("closes the loop on both recurring datasets")` — reading
    `dist/lectures/week-12/index.html`, matches `/desk/i` and `/sock/i`.
- **Implementation (green):** weeks 10, 11 and 12 per the spec §4.2 — week 10's
  new fourteen-identical-delivery-receipts case study, week 11's
  four-draft-email case study, and week 12's case study revisiting the Week 1
  desk setup and the Week 2 sock pile by name. Week 12's Content slot is the
  consolidation programme, not "none": it states what is revisited and how.
  Week 12's Assessment tie-in points at both Assignment 3 and the Final Exam.
- **Refactor:** None expected.
- **Acceptance criteria:** all twelve weeks exist; the new assertion passes;
  `pnpm check` green; week 12 is a real page, not a stub.
- **Depends on:** Task 9.

### Task 11: Complete the weekly-structure and coverage checks

- **Description:** Finish `spec/weekly-structure.test.ts` as the full guard on
  the spec's checks 3, 4 and 5, and confirm it holds across all 24 nodes.
- **Files touched:** `spec/weekly-structure.test.ts`.
- **Tests first (red):** the file already exists from Task 7; this task adds the
  assertions not yet written and confirms the whole suite. Final contents,
  reading `dist/api/index.json` plus each rendered lecture and Lab page:
  - `it("covers weeks 1 to 12 with exactly one lecture each")` — the sorted
    `meta.week` values of `type === "lectures"` equal `[1..12]`, so no gaps and
    no duplicates. *(Spec check 3.)*
  - `it("covers weeks 1 to 12 with exactly one Lab each")` — same for
    `type === "sessions"`. *(Spec check 3.)*
  - `it("dates every lecture on the Tuesday of its week")` and
    `it("dates every Lab on the Thursday of its week")` — each `meta.date`
    equals the value in §3.2's table.
  - `it("advances the date with the week number")` — for both collections,
    week *N*'s date is strictly earlier than week *N+1*'s. *(Spec check 5.)*
  - `it("carries all five slots in order in every lecture")` — for each of the
    twelve rendered lecture pages, the headings **Overview**, **Content**,
    **Case study**, **Reflection**, **Assessment tie-in** all appear, and their
    first-occurrence indices are strictly increasing. *(Spec check 4 — the
    `CLAUDE.md` rule, enforced.)*
  - `it("carries all three slots in order in every Lab")` — same for
    **Before the Lab**, **In the Lab**, **Afterwards**.
  - `it("gives every lecture a named case study")` — each lecture's Case study
    section is non-empty: at least 80 characters of text between that heading
    and the next.
  - `it("gives every Lab a spec list")` — every `sessions` node's `spec` array
    is non-empty.
  - `it("keeps every teaching date inside the teaching weeks")` — every
    lecture and Lab date is between `2027-02-23` and `2027-05-27`, i.e. inside
    teaching rather than merely inside the course record's wider window.
- **Implementation (green):** none — the content from Tasks 7–10 should already
  satisfy every assertion. Any failure here is a content bug to fix in the
  offending week, not a test to relax.
- **Refactor:** extract the "first index of each heading, in order" helper into
  a local function in the test file rather than repeating it for lectures and
  Labs.
- **Acceptance criteria:**
  - Every assertion above passes across all 24 nodes.
  - Deliberately breaking one week (removing a Case study heading locally)
    makes the suite fail, and restoring it makes it pass — verified once, then
    reverted.
  - `pnpm check` green.
- **Depends on:** Task 10.

### Task 12: Build the Week 1 deck

- **Description:** Replace the starter deck with a real Week 1 deck presenting
  the orientation lecture and the baseline diagnostic.
- **Files touched:** `src/decks/week-01.deck.mdx` (existing);
  `spec/deck.test.ts` (new).
- **Tests first (red):** `spec/deck.test.ts`:
  - `it("links a deck from a lecture")` — from `dist/api/index.json`, at least
    one `type === "lectures"` node has a `meta.slides` matching
    `/^\/decks\/[a-z0-9-]+\/$/`. *(Spec check 6, first half.)*
  - `it("builds the deck that lecture links")` — for each such `meta.slides`
    value, `dist<slides>index.html` exists on disk. *(Spec check 6, second half
    — a `slides:` value that matches the regex but points at no deck would
    otherwise pass.)*
  - `it("is not the starter deck")` — the built deck's HTML does not contain
    the starter's placeholder text.
  - `it("pins the thesis on the deck")` — the built HTML contains the thesis
    sentence verbatim.
- **Implementation (green):** rewrite `src/decks/week-01.deck.mdx` as the Week 1
  deck: the thesis, what the course is, the five-slot weekly shape, the baseline
  diagnostic, and what is due in Week 2. Markdown with `---` between slides;
  keep to the astromotion syntax in §3.5 and to `theme.css` as it stands
  (restyling is Plan 3). Remove the `STARTER_CONTENT` comment.
- **Refactor:** None expected. Do not add a second deck.
- **Acceptance criteria:**
  - All four assertions pass.
  - `git grep -F STARTER_CONTENT -- src/decks` returns nothing.
  - **Every slide checked in a browser at 1920×1080 and 390×844** — no slide
    overflows or becomes illegible. §3.5 is explicit that the build cannot
    catch this.
  - `/lectures/week-01/` renders its slides link and the link resolves.
- **Depends on:** Task 7 (Week 1's lecture must exist and carry `slides:`).

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` passes (runs `pnpm build` then `vitest run spec`)
- [ ] `pnpm check` passes (typecheck + the above)
- [ ] `pnpm check:evidence` reports no `STARTER_CONTENT` anywhere in `src/`
      (this plan removes the last of the fourteen; it will still fail on
      `PROCESS.md` until the user writes it — expected)
- [ ] `/api/index.json` carries 29 dated nodes: 12 lectures, 12 sessions,
      5 assessments, and `spec/data-integrity.test.ts` is green
- [ ] Assessment weights sum to exactly 100, and every marking model's criteria
      sum to 100
- [ ] Manually verified with `agent-browser` against `pnpm dev` at
      `http://localhost:4321/comp4020-ass2-attwelveDev/`, at both
      `set viewport 1920 1080` and `set viewport 390 844`: three
      **non-adjacent** weeks (the brief says markers read a few), one
      assessment page with its rubric table, the deck slide by slide, and the
      `/lectures/` and `/sessions/` listings
- [ ] Read end to end once for register: no page breaks character, and no page
      aims the joke at the student rather than the institution
- [ ] Every requirement in §2 is covered — see §7
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (F2.1) twelve dated lectures | Tasks 7–10; asserted Task 11 |
| 2.1.2 (F2.2) twelve dated Labs with `spec:` | Tasks 7–10; asserted Task 11 |
| 2.1.3 (F2.3) five slots in order | Tasks 7–10; asserted Task 11 |
| 2.1.4 (F2.4) three Lab slots in order | Tasks 7–10; asserted Task 11 |
| 2.1.5 (F2.5) twelve case studies, week 12 closing both datasets | Tasks 7–10; asserted Task 10, Task 11 |
| 2.1.6 (F2.6) five assessments summing to 100 | Task 1 |
| 2.1.7 (F2.7) weighted marking + `spec:` on each | Task 1 |
| 2.1.8 (F2.8) reflection arithmetic visible | Task 2 |
| 2.1.9 (F2.9) coverage ends at or before own week | Task 1 |
| 2.1.10 (F2.10) A2's 5-minute limit, self-reported | Task 4 |
| 2.1.11 (F2.11) A3 rubric in frontmatter, bands in body | Task 1 (rubric), Task 5 (bands) |
| 2.1.12 (F2.12) Week 1 deck linked and real | Task 12 |
| 2.1.13 (F2.13) noon deadlines, correct offsets | Task 1 |
| 2.1.14 (F2.14) never breaks character | Tasks 2–10, 12; §6 register read-through |
| 2.1.15 (F2.15) STARTER_CONTENT removed | Task 1 (assessments), Task 7 (lectures/sessions), Task 12 (deck) |
| 2.1.16 (F2.16) no dangling refs | Task 1 (stale `related:`), Tasks 3–4 (new refs), Task 7 (slug rename) |
| 2.2 `pnpm check` at every boundary | Acceptance criteria of Tasks 1–12 |
| 2.2 `data-integrity` stays green | Task 1, Task 11 |
| 2.2 both marking viewports | §6; Tasks 8, 9, 12 acceptance |
| 2.2 deck legible at both viewports | Task 12 acceptance |
| 2.2 ten-minute read | §6 non-adjacent-weeks verification |

## 8. Risks / open questions

None.
