# Week 6 reflection due-date fix and teaching-break exception

- **Date:** 2026-09-19
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-19 (via `brainstorm-feature`, this conversation)

## 1. Summary

Every lecture and lab page renders a "Reflection due" date in its spec-sheet
banner (`WeekMeta.astro`), computed as "this week's lecture date plus 7
days." That's correct for eleven of the twelve weeks, because lectures are
normally exactly 7 days apart. Week 6 is the exception: the teaching break
sits between week 6's lecture (30 March 2027) and week 7's (20 April
2027), a 21-day gap. The +7-days shortcut therefore produces "6 April
2027" — a date inside the break — while week 6's own lecture body already
correctly states the reflection is "due 12:00 Tuesday of week 7." The
banner and the body text contradict each other on the same page. Separately
(a genuine, user-approved decision, not a bug): week 6's reflection keeps
its longer, break-spanning window rather than being pulled forward to land
inside the break, and that fact — plus why it's true — needs to be stated
explicitly to students, both on week 6's own lecture page and on the
general Weekly Reflections assessment page, neither of which currently
mentions any exception to the uniform "due the following Tuesday" rule. This
plan fixes the banner computation generically (so it's correct for any
week bordering a gap, not just week 6), and adds the missing prose in both
places.

## 2. Requirements

### 2.1 Functional requirements

1. The rendered "Reflection due" row on every lecture page
   (`dist/lectures/week-01/index.html` … `week-12/index.html`) and every lab
   page (`dist/sessions/week-01/index.html` … `week-12/index.html`) shows the
   date of week N+1's *actual* lecture, not a fixed 7-day offset from week
   N's lecture date — falling back to "week N's lecture date + 7 days" only
   for week 12, which has no week 13 lecture to look up (preserves existing
   behaviour for the one week where the lookup can't apply).
2. Week 6's lecture page and lab page specifically show "20 April 2027" as
   the Reflection due date, not "6 April 2027".
3. `src/content/lectures/week-06.mdx`'s existing reflection line explicitly
   states the reflection is due *after* the teaching break, not during it,
   while keeping its existing "due 12:00 Tuesday of week 7" fact and the
   page's established deadpan voice.
4. `src/content/assessments/weekly-reflections.md`'s "How the totals work"
   section explicitly documents week 6 as the one exception to the uniform
   "due the following Tuesday" pattern, stating that the teaching break
   between weeks 6 and 7 is why that prompt has a longer window.
5. No other week's displayed Reflection-due date changes value, and all
   currently-passing tests (`spec/weekly-structure.test.ts`,
   `spec/treatment.test.ts`, `spec/voice.test.ts`, `spec/assessment-scheme.test.ts`)
   continue to pass unmodified except where this plan's own new/edited
   assertions are the change.

### 2.2 Non-functional requirements

- Voice: all new/edited prose must pass `spec/voice.test.ts` (banned-term
  list, framing phrases, gendered terms, no jargon wrapped in `<code>`) and
  match `CLAUDE.md`'s register — institutional deadpan seriousness applied
  to a mundane CS-student stereotype, no technical/CS/networking/business-ops
  metaphor, puns fine.
- The "Reflection due" banner is date-only (`formatCourseDate`, no
  time-of-day) both before and after this fix — this plan does not touch
  any `due`/time-of-day value or the `Australia/Sydney`-anchored noon rule
  in `src/lib/dates.ts`; that rule is unaffected because nothing here
  changes a stored `due` timestamp.
- Visual: verify both edited pages (`lectures/week-06`, `assessments/weekly-reflections`)
  at both marking viewports (1920×1080, 390×844) per `CLAUDE.md`.
- Accessibility: no markup structure changes beyond text content; the
  existing `<dl>`/`<dt>`/`<dd>` and `<p>`/`<strong>` structure is unchanged.

### 2.3 Out of scope

- No dedicated "teaching break" schedule/config data structure (e.g. a new
  content collection or config field naming break dates). The next-lecture
  lookup approach makes this unnecessary — it's correct for any week
  bordering any gap, without needing the gap's dates named anywhere.
- No per-lecture due-date override field added to the `lectures` schema in
  `src/content.config.ts` (the `dueDisplay` escape hatch already exists on
  the `assessments` schema for a different purpose and is not touched).
- No change to `weekly-reflections.md`'s `dueDisplay` frontmatter value
  (`"12:00, Every Tuesday, Weeks 2-13"`) — it's a generic range description
  that already covers week 6 and needs no edit.
- No change to `src/pages/policies/index.mdx` or any other assessment page.
- No change to week 12's fallback behaviour (it keeps landing on
  "lecture date + 7 days," matching current behaviour; the "Week 12's [reflection]
  due in week 13" statement on `weekly-reflections.md` is pre-existing and
  untouched by this plan).

### 2.4 Assumptions

None outstanding — resolved via the `brainstorm-feature` conversation and
by reading the actual source (`WeekMeta.astro`, both content files,
`content.config.ts`, `spec/weekly-structure.test.ts`) in Phase 2 below.

## 3. Existing code context

**`src/components/WeekMeta.astro`** (renders the spec-sheet banner on every
lecture and lab page):

```astro
interface Props {
  week: number;
  date: Date;
  kind: "lecture" | "lab";
}

const { week, date, kind } = Astro.props;

const lectures = await getPublishedCollection("lectures");
const sessions = await getPublishedCollection("sessions");

const lectureDate = kind === "lecture" ? date : lectures.find((e) => e.data.week === week)?.data.date;
const reflectionDue = lectureDate
  ? new Date(lectureDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  : undefined;
```

Rendered at lines 47-48 as `<dt>Reflection due</dt><dd>{reflectionDue ? formatCourseDate(reflectionDue) : "—"}</dd>`.
`getPublishedCollection` (from `astro-course-university/content`) returns
entries typed with `.data.week: number` and `.data.date: Date`, matching
the `lectures`/`sessions` schemas below. Used from:
- `src/pages/lectures/[slug].astro:42` — `<WeekMeta week={lecture.data.week} date={lecture.data.date} kind="lecture" />`
- `src/pages/sessions/[slug].astro:44` — `<WeekMeta week={session.data.week} date={session.data.date} kind="lab" />`

**`src/content.config.ts`** — `lectures` collection: `week: z.coerce.number().int().min(1).max(12)`,
`date: z.coerce.date()` (plus `teachers`, `slides`, `citations`, `caseStudies`,
`.loose()`). `sessions` collection has the same `week`/`date` shape. Weeks
are capped at 12 — there is no week 13 entry in either collection, so a
"next lecture" lookup for week 12 always returns `undefined` by
construction, not by accident.

**`src/lib/dates.ts`** — `formatCourseDate(value: Date | string): string`
formats a date-only value in UTC with `Intl.DateTimeFormat("en-AU", { dateStyle: "long", timeZone: "UTC" })`,
e.g. `"20 April 2027"`. `formatCourseDateTime` (unused by `WeekMeta.astro`)
additionally prefixes the `Australia/Sydney` noon time — not relevant here
since the banner never shows a time.

**Verified calendar** (from `spec/weekly-structure.test.ts`'s `TEACHING_DATES`
fixture, itself sourced from lecture/session frontmatter — confirmed
directly in `src/content/lectures/week-06.mdx` (`date: 2027-03-30`) and
`week-07.mdx` (`date: 2027-04-20`)):

| Week | Lecture date | Lab date |
| --- | --- | --- |
| 5 | 2027-03-23 | 2027-03-25 |
| 6 | 2027-03-30 | 2027-04-01 |
| 7 | 2027-04-20 | 2027-04-22 |
| 8 | 2027-04-27 | 2027-04-29 |

Every week-to-week gap is exactly 7 days except week 6→7 (21 days — the
teaching break).

**`src/content/lectures/week-06.mdx`** — final line (lines 87-88), inside
the `## Conclusion` section, renders as an MDX paragraph:
```
**This week's reflection**, due 12:00 Tuesday of week 7: name one hour
this week the laptop stayed closed, and what filled it instead.
```
Renders as `<p><strong>This week's reflection</strong>, due 12:00 Tuesday of week 7: ...</p>`.

**`src/content/assessments/weekly-reflections.md`** — "How the totals work"
section (lines 26-31):
```
The semester runs twelve weekly prompts, covering weeks 1–12, each due at
12:00 the following Tuesday — Week 1's prompt due in week 2, Week 12's in
week 13. The two lowest-scoring reflections are dropped before the running
total is calculated; the remaining ten are counted at 1.5% each — 10 ×
1.5% = 15% of the course total. The drop absorbs two bad weeks without a
separate extension process.
```
No exception for week 6 is currently stated anywhere on this page.

**Existing spec-sheet tests** — `spec/treatment.test.ts` (lines 220-241)
already asserts every lecture/lab page has a `<dt>Reflection due</dt>` row
present, but never checks its **value**. No existing test anywhere checks
the reflection-due date's actual value (confirmed by grep across `spec/`
and `src/`), so this plan's new tests are additive, not edits to existing
assertions.

**Test setup:** Vitest, run via `pnpm test` (`pnpm build && vitest run spec`)
or the full `pnpm check` (`pnpm typecheck && pnpm test`). Tests read
rendered output from `dist/**/index.html` after the build step, per the
existing pattern in `spec/weekly-structure.test.ts` and `spec/treatment.test.ts`
(`readFileSync(resolve(...))`). New assertions for this plan belong in
`spec/weekly-structure.test.ts`, which already owns the `TEACHING_DATES`
calendar fixture and the "scheduling" describe blocks this work extends.

## 4. Approach

Replace `WeekMeta.astro`'s `+7 days` arithmetic with a lookup of the actual
next lecture's date (`lectures.find((e) => e.data.week === week + 1)`),
falling back to the `+7 days` estimate only when no such lecture exists
(week 12). This is generic — it's correct for week 6 without hardcoding
the break's dates anywhere, and stays correct if the break ever moves,
without needing a dedicated "teaching break" data model (rejected as
out of scope: more machinery than a single date lookup requires).

The three tasks below are independent edits to independent files (component
logic, week 6's lecture prose, the assessments page's prose) and could be
done in any order, but are numbered in the order that makes most sense to
implement and review: fix the mechanism first (Task 1), then have the two
content updates describe a now-correctly-rendering page (Tasks 2-3).

## 5. Task breakdown

### Task 1: Fix `WeekMeta.astro`'s reflection-due computation to look up the next lecture's actual date

- **Description:** Replace the `lectureDate.getTime() + 7 days` computation
  with a lookup of week N+1's actual lecture date from the `lectures`
  collection, falling back to the `+7 days` estimate only when no week N+1
  lecture exists (currently only week 12). Fixes week 6 (and any future
  week bordering a gap) without special-casing it.
- **Files touched:** `src/components/WeekMeta.astro` (lines 22-28).
- **Tests first (red):** Add a new `describe("weekly structure — reflection due dates", ...)`
  block to `spec/weekly-structure.test.ts`:
  - `it("shows each lecture's and Lab's reflection due on week N+1's actual lecture date")`:
    for every week 1-12, read `dist/lectures/week-<NN>/index.html` and
    `dist/sessions/week-<NN>/index.html`, extract the `<dd>` text following
    `<dt>Reflection due</dt>` via
    `html.match(/<dt>Reflection due<\/dt>\s*<dd>([^<]*)<\/dd>/)?.[1]`, and
    assert it equals `formatCourseDate(TEACHING_DATES[week + 1]?.lecture ?? addDays(TEACHING_DATES[week].lecture, 7))`
    (import `formatCourseDate` from `../src/lib/dates`; add a small local
    `addDays(iso: string, days: number): string` helper using
    `new Date(`${iso}T00:00:00Z`)` + `setUTCDate`). This is red today because
    week 6 currently renders `formatCourseDate(addDays("2027-03-30", 7))` =
    `"6 April 2027"` instead of the expected `formatCourseDate("2027-04-20")`
    = `"20 April 2027"`.
  - `it("does not land week 6's reflection inside the teaching break")`: a
    focused regression assertion that `dist/lectures/week-06/index.html`'s
    and `dist/sessions/week-06/index.html`'s `Reflection due` value is
    exactly `formatCourseDate("2027-04-20")`, kept separate from the loop
    above so a future refactor that breaks week 6 specifically fails loudly
    and by name rather than only as one iteration of a loop.
- **Implementation (green):** In `WeekMeta.astro`, after the existing
  `lectureDate` line, add:
  ```astro
  const nextLecture = lectures.find((e) => e.data.week === week + 1);
  const reflectionDue = nextLecture
    ? nextLecture.data.date
    : lectureDate
      ? new Date(lectureDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      : undefined;
  ```
  replacing the current `reflectionDue` assignment. Update the comment
  above `lectureDate` (lines 22-24) to also explain the fallback: weeks are
  normally 7 days apart, but not across the teaching break, so the actual
  next lecture's date is looked up instead of assumed; only the final week
  (12, with no week 13 lecture) falls back to the `+7 days` estimate.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Both new tests in `spec/weekly-structure.test.ts` pass.
  - `pnpm check` passes.
  - Weeks 1-5 and 7-11's displayed Reflection-due values are byte-identical
    to their pre-fix values (verified by the loop test, since the
    next-lecture lookup and the `+7 days` estimate agree for every week
    except 6).
- **Depends on:** None.

- [x] Task 1 complete

### Task 2: Clarify week 6's reflection line so it explicitly rules out the teaching break

- **Description:** Edit the existing "This week's reflection" line in
  `src/content/lectures/week-06.mdx` (Conclusion section) so it explicitly
  states the reflection is due *after* the teaching break, not during it —
  keeping the existing "due 12:00 Tuesday of week 7" fact and the
  worked-instance prompt text unchanged, and staying in the course's
  established deadpan voice (mundane CS-student specifics, no technical
  metaphor, no jargon in backticks).
- **Files touched:** `src/content/lectures/week-06.mdx` (lines 87-88).
- **Tests first (red):** Add
  `it("tells week 6 students their reflection isn't due during the break")`
  to the same new describe block in `spec/weekly-structure.test.ts`:
  read `dist/lectures/week-06/index.html`, extract the paragraph containing
  `This week's reflection` via
  `html.match(/<strong>This week's reflection<\/strong>[\s\S]*?<\/p>/)?.[0]`,
  and assert it matches `/break/i` and still matches
  `/due 12:00 Tuesday of week 7/`. Red today because the current line
  contains neither the word "break" nor any statement ruling it out.
- **Implementation (green):** Rewrite the line, e.g. (exact wording subject
  to human review per below):
  > **This week's reflection**, due 12:00 Tuesday of week 7 — after the
  > teaching break, not during it: name one hour this week the laptop
  > stayed closed, and what filled it instead.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The new test passes.
  - `spec/voice.test.ts` continues to pass (no banned term/framing phrase
    introduced).
  - `pnpm check` passes.
- **Human review:** The rewritten line in
  `src/content/lectures/week-06.mdx`, rendered at `/lectures/week-06/` —
  a human must confirm the wording lands in the course's deadpan,
  mundane-CS-student register (not preachy, not a technical metaphor) and
  reads naturally as one sentence, not a bolted-on clause. Check at both
  marking viewports (1920×1080, 390×844).
- **Depends on:** None (independent of Task 1, though reviewing it after
  Task 1 lands means the page's banner and body agree when checked).

- [x] Task 2 complete — human review accepted

### Task 3: Document week 6's exception on the Weekly Reflections assessment page

- **Description:** Add a sentence to `src/content/assessments/weekly-reflections.md`'s
  "How the totals work" section stating that week 6 is the one exception to
  the uniform "due the following Tuesday" pattern, and why (the teaching
  break sits between weeks 6 and 7, giving that prompt a longer window
  rather than a due date inside the break).
- **Files touched:** `src/content/assessments/weekly-reflections.md`
  (lines 26-31).
- **Tests first (red):** Add
  `it("documents week 6's reflection as the exception to the weekly-Tuesday rule")`
  to the same describe block: read
  `dist/assessments/weekly-reflections/index.html`, and assert its "How the
  totals work" section (matched via
  `html.match(/<h2[^>]*>How the totals work<\/h2>[\s\S]*?<h2/)?.[0]` or
  similar, using the existing `findHeading`/`nextHeadingIndex` helpers
  already defined in `spec/weekly-structure.test.ts`) matches both
  `/Week 6/` and `/break/i`. Red today because neither term appears on this
  page at all (confirmed by reading the current file).
- **Implementation (green):** Insert a sentence into the existing paragraph
  or as a new one immediately after it, e.g. (exact wording subject to
  human review):
  > Week 6 is the one exception to that one-week rule: the teaching break
  > sits between weeks 6 and 7, so that prompt is due in week 7 instead of
  > the following Tuesday — a longer window, not a missed one.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The new test passes.
  - `spec/voice.test.ts` continues to pass.
  - `pnpm check` passes.
- **Human review:** The new sentence in `weekly-reflections.md`, rendered
  at `/assessments/weekly-reflections/` — a human must confirm it reads as
  a natural continuation of the existing paragraph's voice and doesn't
  read as an apology or a policy carve-out. Check at both marking
  viewports (1920×1080, 390×844).
- **Depends on:** None.

- [x] Task 3 complete — human review accepted

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` (`pnpm build && vitest run spec`) passes
- [ ] `pnpm check` (`pnpm typecheck && pnpm test`) passes
- [ ] Manually verified: `/lectures/week-06/`, `/sessions/week-06/`, and
  `/assessments/weekly-reflections/` loaded in a browser at 1920×1080 and
  390×844, confirming the Reflection due banner reads "20 April 2027" on
  week 6's lecture and lab pages and the new prose reads naturally in
  context
- [ ] Every requirement in §2 is covered — see §7
- [ ] Every task with a `Human review:` line (Tasks 2 and 3) has been shown
  to the user and explicitly accepted — not inferred, not just its
  acceptance criteria passing
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 | Task 1 |
| 2.1.2 | Task 1 |
| 2.1.3 | Task 2 |
| 2.1.4 | Task 3 |
| 2.1.5 | Tasks 1, 2, 3 (regression via unchanged existing specs + new tests' loop over all 12 weeks) |

## 8. Risks / open questions

None.
