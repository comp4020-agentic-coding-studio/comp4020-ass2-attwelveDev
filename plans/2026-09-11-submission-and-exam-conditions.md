# Submission and exam conditions

- **Date:** 2026-09-11
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-11 (via `brainstorm-feature`, see `specs/2026-09-11-submission-and-exam-conditions.md`)

## 1. Summary

The course website currently never states how take-home work gets
submitted, or what conditions apply to the final exam. This feature adds a
paper-submission policy for the four take-home items (Weekly Reflections,
Assignment 1, Assignment 2, Assignment 3) — submitted on paper, to the
Convenor's office or a tutor, with continuously-supplied paper and an
email exception for extenuating circumstances — and a separate,
self-contained exam-conditions section on the Final Exam page (permitted
materials, silence rule with one exception, answer booklet, academic
misconduct). It is pure content work across 6 existing files: no schema,
component, or route changes. Full design rationale and the probes raised
during brainstorming live in
`specs/2026-09-11-submission-and-exam-conditions.md` — this plan does not
repeat that reasoning, only the concrete edits and their tests.

## 2. Requirements

### 2.1 Functional requirements

1. `src/pages/policies/index.mdx` gains a new **Submission** section,
   positioned between the existing **Attendance** and **Late work and
   extensions** sections, covering: both drop points (Convenor's office or
   a tutor), continuous paper *and envelope* supply, the dated/initialled
   receipt timestamp, the Weekly-Reflections-specific sealed-envelope rule,
   the extenuating-circumstances email exception (independent of the
   extension process), the "no documentation → missed submission" rule,
   and an explicit statement that this section does not cover the Final
   Exam — with that final statement linking to the Final Exam assessment
   page (`/assessments/final-exam/`), the same bare-Markdown-link pattern
   used for the reverse links added in Tasks 2–5.

   **Amended 2026-09-11, post-Task-1 human review:** the user asked for two
   things beyond the original wording: (a) the course-supplied-paper
   sentence should also cover envelopes, since Weekly Reflections requires
   one and it would be inconsistent to supply the paper but not the means
   to seal it; (b) "see the exam page" should be an actual link rather than
   prose, since it is Policies' one pointer *out* to where the real exam
   rules live — unlike the assessment-page links back to Policies, which
   are already the explicit instruction, so no reciprocal link is needed
   there. Both were accepted as in-scope refinements to Task 1, not a
   reopening of the four take-home items' own sections.
2. The existing **Late work and extensions** section gains one sentence
   referencing the Submission section's timestamp mechanism. No other
   change to that section.
3. `src/content/assessments/weekly-reflections.md` gains a short
   **Submission** section: paper, sealed envelope, either drop point, links
   to `/policies/`.
4. `src/content/assessments/assignment-1-makeover.md`'s existing **What you
   submit** section is appended with a paragraph: written portions on
   paper, the three outfit photos printed and physically attached, links
   to `/policies/`.
5. `src/content/assessments/assignment-2-touch-grass.md`'s existing **What
   you submit** section is appended with a sentence: the report is
   submitted on paper, links to `/policies/`.
6. `src/content/assessments/assignment-3-adulting.md` gains a short
   **Submission** section: the plan is one paper document, explicitly
   distinguished from the Wednesday-interview scheduling email (unchanged),
   links to `/policies/`.
7. No `spec:` frontmatter bullet is added to any of the four take-home
   assessments for submission mode.
8. `src/content/assessments/final-exam.md` gains a new **Exam conditions**
   section after the existing **The five stations** section: permitted
   materials (black or blue pen only), closed book, no
   phones/smartwatches/other electronic devices/calculators, no talking
   except at Station 3 (compulsory), an official answer booklet for
   Stations 1–4, Station 5 marked by observation only, and that breaking
   any of the above is academic misconduct.
9. `final-exam.md`'s frontmatter `spec` array gains one bullet on materials
   compliance, appended after the existing three bullets (order of existing
   bullets preserved).
10. `src/pages/policies/index.mdx`'s existing **Academic integrity** section
    is left byte-for-byte unchanged.
11. All new prose avoids every term in `spec/voice.test.ts`'s `BANNED_TERMS`
    and `FRAMING_PHRASES` lists, and contains no `<code>`-styled spans.

### 2.2 Non-functional requirements

None beyond project defaults. Note: requirement 11 is enforced automatically
by the existing `spec/voice.test.ts`, which iterates every rendered content
page (via `renderedContentPages()`) — no new voice test is needed, `pnpm
test` already covers every file this plan touches.

### 2.3 Out of scope

- Any change to due dates, weeks, weights, or marking criteria on any
  assessment.
- Any change to `src/content.config.ts`'s schema.
- Any change to the `people` collection or the `role` enum.
- A concrete physical pickup location for paper beyond "the Convenor's
  office or a tutor."
- Any new Astro component or `.mdx` conversion of the four `.md` assessment
  files (they stay plain Markdown; pointers to Policies are plain Markdown
  links, not a `Callout`).
- Any adjudication process for extenuating-circumstances documentation.
- A cross-reference from Policies' Academic integrity section to the exam's
  misconduct clause (explicitly rejected during brainstorming — exam page
  only).

### 2.4 Assumptions

None outstanding — every assumption raised during `brainstorm-feature` was
resolved with the user; see §5 of the spec file for the full log.

## 3. Existing code context

All six files below were read in full during this planning pass.

**`src/pages/policies/index.mdx`** — current section order: `## Attendance`
→ `## Late work and extensions` → `## Reflections` → `## Academic
integrity` → `---` → `## Content and disclosure`. Relevant exact current
text:

```
## Late work and extensions

A short extension on any assessment is available on request, before the
deadline, no justification required: email the relevant tutor and state the
new date you need. Work submitted late without an extension loses 5% of the
available mark per calendar day, to a maximum of five days, after which the
assessment is treated as a missed submission and referred to the Convenor
for a decision.
```

**`src/content/assessments/weekly-reflections.md`** — body ends with:

```
Week 12 sets a twelfth prompt on the same schedule, but it is not graded: no
week 13 exists to mark it against, so it is folded into Assignment 3's
reflective component instead of standing alone.
```

(No `## Submission` or `## What you submit` heading exists yet.)

**`src/content/assessments/assignment-1-makeover.md`** — final section,
verbatim:

```
## What you submit

- the hygiene product selection, with a one-line rationale per product
- three outfit pictures, one per occasion: lecture, birthday party, gym
- a written justification for each outfit against its occasion

An outfit without its picture is not evidence; a picture without its
justification is not an argument.
```

**`src/content/assessments/assignment-2-touch-grass.md`** — final section,
verbatim:

```
## What you submit

A 1000-word report naming the activity, when it ran, and who else was
there, addressing each of the three restrictions directly.
```

**`src/content/assessments/assignment-3-adulting.md`** — section order:
`## The plan` → `## How each band reads`. `## The plan` ends with:

```
The Wednesday interview time has not been specified: email the Convenor to
confirm a slot before the deadline. A plan submitted without a confirmed
slot is treated as incomplete.
```

**`src/content/assessments/final-exam.md`** — frontmatter `spec:` array
(exact current order):

```yaml
spec:
  - all five stations are attended in sequence on the day
  - each station's task is completed within its stated duration
  - the survival station's output is edible
```

Body's `## The five stations` section ends with:

```
Total examined time is 2 hours 50 minutes, of which the four ten-minute
stations are worth as much combined as the long cooking station alone —
duration is not difficulty.
```

**Content schema** (`src/content.config.ts`, confirmed unchanged by this
plan) — `assessments` collection extends `courseNodeSchema` (from
`astro-course-university/schemas`) with `week`, `due`, `weight`, optional
`marking`, via `.loose()`. `courseNodeSchema` already types `spec:
z.array(z.string()).default([])`, so appending a plain string to the array
requires no schema change.

**Rendering** (`src/pages/assessments/[slug].astro`, unchanged by this
plan) — renders the assessment's markdown `Content` directly, then
`SpecList` from `assessment.data.spec`. Confirms the body must stay plain
Markdown (no Astro component embedding — the files are `.md`, not `.mdx`).

**Test setup:**
- Framework: Vitest, config implicit (no `vitest.config.*` beyond
  `package.json`'s `test` script).
- Exact command: `pnpm test` → `pnpm build && vitest run spec` (build is
  required first because every `spec/*.test.ts` file reads from
  `dist/`, except `spec/harness.test.ts` which reads `CLAUDE.md` directly).
- Full project check: `pnpm check` → `pnpm typecheck && pnpm test`.
- Relevant existing test files: `spec/policies.test.ts` (reads
  `dist/policies/index.html`), `spec/assessment-scheme.test.ts` (reads
  `dist/api/index.json` for `assessments` nodes, plus per-assessment
  `dist/assessments/<slug>/index.html` in nested `describe` blocks named
  `"weekly reflections"`, `"assignment 1 makeover"`, `"assignment 2 touch
  grass"`, `"assignment 3 adulting"`, `"final exam"`).
- `spec/voice.test.ts` automatically covers every rendered content page
  (including all six files this plan touches) for banned jargon terms, no
  `<code>` spans, and framing phrases — no new test needed for requirement
  11, but every task's acceptance criteria include a manual banned-term
  self-check before considering the task done, since a full `pnpm test` run
  is the actual gate.

**Conventions observed:**
- Assessment/policy prose uses plain declarative sentences, terse, no
  second-person hedging; existing cross-references use bare bracketed
  Markdown links, e.g. none currently exist between assessment pages and
  Policies, so this plan establishes the first instance — format:
  `[Policies](/policies/)` (confirmed `trailingSlash: "always"` in
  `astro.config.ts`, so the trailing slash is required).
- New `##` sections are placed at natural narrative boundaries, matching
  how `## What you submit` and `## The five stations` are already used.
- Test assertions in `spec/assessment-scheme.test.ts` and
  `spec/policies.test.ts` use simple case-insensitive substring/regex
  checks against rendered HTML (`html.toMatch(/.../i)`), not exact-string
  matches — this plan's new tests follow the same style.

## 4. Approach

Six independent content edits, each paired with new test assertions in the
existing test files for that page (TDD: write the failing assertion against
current `dist/` content, then add the content, rebuild, confirm green). No
new test *files* are created — assertions are added to
`spec/policies.test.ts` and `spec/assessment-scheme.test.ts`, extending
their existing `describe` blocks (or adding one new block, for Assignment
3's `Submission` note, since that assessment doesn't yet have an entry
under a submission-specific block).

Tasks 2–6 all edit `spec/assessment-scheme.test.ts`, but each touches a
different `describe` block and a different content file, so they carry no
real dependency on each other — they can be done in any order, just not
concurrently by two people editing the same test file without coordinating
line ranges.

Rejected alternative: creating a new `spec/submission.test.ts` file to hold
all the new assertions in one place. Rejected because the project's
existing pattern colocates an assessment's tests inside its own `describe`
block in `assessment-scheme.test.ts`, and the Policies-page assertions
belong with the rest of `policies.test.ts` — splitting them out would break
that locality for no benefit.

## 5. Task breakdown

### Task 1: Add the Submission section and Late-work cross-reference to the Policies page

- **Description:** Insert a new `## Submission` section into
  `src/pages/policies/index.mdx`, positioned immediately after `##
  Attendance` and before `## Late work and extensions`. Append one sentence
  to the end of the existing `## Late work and extensions` paragraph
  referencing the new section. Leave `## Academic integrity` untouched.
- **Files touched:** `src/pages/policies/index.mdx`,
  `spec/policies.test.ts`.
- **Tests first (red):** In `spec/policies.test.ts`, inside the existing
  `describe("policies", ...)` block, add:
  - `it("states the paper submission policy")` — asserts a heading match
    using the file's existing pattern (copy the "Content and disclosure"
    regex style):
    `expect(html).toMatch(/<h[1-6][^>]*>(?:(?!<\/h[1-6]>)[\s\S])*Submission(?:(?!<\/h[1-6]>)[\s\S])*<\/h[1-6]>/i);`
  - `it("names both submission drop points")` — `expect(html).toMatch(/Convenor/); expect(html).toMatch(/tutor/i);` within the rendered page.
  - `it("permits email submission in extenuating circumstances, with documentation")` — `expect(html).toMatch(/extenuating circumstances/i); expect(html).toMatch(/documentation/i);`
  - `it("does not cover the Final Exam")` — `expect(html).toMatch(/Final Exam/); expect(html).toMatch(/own conditions|does not (?:apply|cover)/i);`
  - `it("supplies envelopes as well as paper")` — `expect(html).toMatch(/envelopes? (?:is|are|and paper are) supplied|paper and envelopes/i);`
  - `it("links to the Final Exam page")` — `expect(html).toMatch(/href="[^"]*\/assessments\/final-exam\/"/);`

  **Amended 2026-09-11:** the two assertions above were added after Task 1's
  first human-review round; the original four assertions listed here were
  already passing at that point and are unaffected.

  Run `pnpm test` and confirm these four new assertions fail against the
  current build (the rest of the suite still passes).
- **Implementation (green):** Add to `src/pages/policies/index.mdx`,
  between `## Attendance` and `## Late work and extensions`:

  ```markdown
  ## Submission

  Weekly Reflections and Assignments 1 through 3 are submitted on paper,
  handed either to the Convenor at their office or to your tutor. Blank
  paper and envelopes are supplied continuously throughout the semester
  through the same two channels — running out is not a reason to miss a
  deadline. Whoever takes your submission dates and initials it on the
  spot; that is the timestamp the Late work policy below uses.

  Weekly Reflections carry one additional rule: seal the reflection in an
  envelope regardless of which of the two you use to hand it in. Your
  tutor is still the only person who reads it, whether it reaches them
  directly or by way of the Convenor's office.

  In extenuating circumstances — accessibility needs, illness, travel, or
  being off campus — email submission is permitted instead, accompanied by
  supporting documentation. This changes how you submit, not when it is
  due: request an extension separately if the same circumstance also costs
  you time. An email with no documentation attached is not accepted as a
  submission; it is treated as a missed submission under the Late work
  policy below.

  This page's submission rules do not cover the Final Exam, which is
  submitted under [its own conditions](/assessments/final-exam/).
  ```

  Append to the end of the existing `## Late work and extensions`
  paragraph: `For a paper submission, the clock runs from the date recorded
  when it was handed in — see Submission above.`
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the four new assertions.
  - `git diff src/pages/policies/index.mdx` shows no change to the
    `## Academic integrity` section or the `## Content and disclosure`
    section.
  - The rendered page (`dist/policies/index.html`) contains the new
    `Submission` heading between Attendance and Late work and extensions,
    in that order.
  - `pnpm test` (which runs `spec/voice.test.ts` across all rendered pages)
    reports no banned-term or `<code>`-span failures on `policies/index.html`.
- **Human review:** View `dist/policies/index.html` (or the live page via
  `pnpm dev`) and confirm the new Submission section reads in the same
  terse, declarative register as the rest of the page — no sincerity break,
  no framing narration, consistent with the paragraphs immediately
  surrounding it.
- **Depends on:** None.

### Task 2: Add the Submission note to Weekly Reflections

- **Description:** Append a new `## Submission` section to the end of
  `src/content/assessments/weekly-reflections.md`'s body.
- **Files touched:** `src/content/assessments/weekly-reflections.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** In `spec/assessment-scheme.test.ts`, inside the
  existing `describe("weekly reflections", ...)` block (which already
  reads `dist/assessments/weekly-reflections/index.html` into `html`), add:
  - `it("requires a sealed paper submission")` —
    `expect(html).toMatch(/paper/i); expect(html).toMatch(/sealed/i);`

  Run `pnpm test` and confirm this fails against the current build.
- **Implementation (green):** Append to the end of
  `weekly-reflections.md`'s body:

  ```markdown
  ## Submission

  Each week's reflection is submitted on paper, sealed in an envelope, and
  handed to the Convenor's office or to your tutor — see
  [Policies](/policies/) for the full submission rule and the
  extenuating-circumstances exception.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the new assertion.
  - Existing tests in the `"weekly reflections"` describe block
    (reflection arithmetic, eleven prompts, Week 12 ungraded, drop-lowest)
    still pass unchanged.
- **Human review:** View `dist/assessments/weekly-reflections/index.html`
  and confirm the new section's tone matches the page's existing sections
  and that the link renders correctly.
- **Depends on:** None.

### Task 3: Add the printed-photo submission note to Assignment 1

- **Description:** Append a paragraph to the end of the existing `## What
  you submit` section in
  `src/content/assessments/assignment-1-makeover.md`.
- **Files touched:** `src/content/assessments/assignment-1-makeover.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** In the existing `describe("assignment 1
  makeover", ...)` block, add:
  - `it("prints and attaches the outfit photos for paper submission")` —
    `expect(html).toMatch(/paper/i); expect(html).toMatch(/printed/i);`

  Run `pnpm test` and confirm this fails.
- **Implementation (green):** Append to the end of the `## What you
  submit` section (after "An outfit without its picture is not evidence;
  a picture without its justification is not an argument."):

  ```markdown
  The selection and justifications are submitted on paper; the three
  outfit pictures are printed and attached to the same submission. See
  [Policies](/policies/) for where to hand it in and the
  extenuating-circumstances exception.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the new assertion.
  - Existing `"assignment 1 makeover"` tests (names all three occasions,
    requires evidence and justification) still pass unchanged.
- **Human review:** View
  `dist/assessments/assignment-1-makeover/index.html` and confirm the
  added paragraph reads consistently with the rest of the brief.
- **Depends on:** None.

### Task 4: Add the paper submission note to Assignment 2

- **Description:** Append a sentence to the end of the existing `## What
  you submit` section in
  `src/content/assessments/assignment-2-touch-grass.md`.
- **Files touched:** `src/content/assessments/assignment-2-touch-grass.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** In the existing `describe("assignment 2 touch
  grass", ...)` block, add:
  - `it("submits the report on paper")` — `expect(html).toMatch(/paper/i);`

  Run `pnpm test` and confirm this fails.
- **Implementation (green):** Append to the `## What you submit` section:

  ```markdown
  The report is submitted on paper. See [Policies](/policies/) for where
  to hand it in and the extenuating-circumstances exception.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the new assertion.
  - Existing `"assignment 2 touch grass"` tests (five-minute cap,
    self-reported compliance, seven activities, two non-CS people, word
    count) still pass unchanged.
- **Human review:** View
  `dist/assessments/assignment-2-touch-grass/index.html` and confirm the
  added sentence fits the section's existing terse style.
- **Depends on:** None.

### Task 5: Add the Submission note to Assignment 3, distinguishing it from the interview email

- **Description:** Insert a new `## Submission` section into
  `src/content/assessments/assignment-3-adulting.md`, between the existing
  `## The plan` and `## How each band reads` sections.
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** In the existing `describe("assignment 3
  adulting", ...)` block, add:
  - `it("submits the plan as one paper document, separate from the interview-scheduling email")` —
    `expect(html).toMatch(/paper/i); expect(html).toMatch(/not the assessment submission|separate from the (?:assessment )?submission/i);`

  Run `pnpm test` and confirm this fails.
- **Implementation (green):** Insert between `## The plan` and `## How
  each band reads`:

  ```markdown
  ## Submission

  The plan is submitted as a single paper document — see
  [Policies](/policies/) for where to hand it in and the
  extenuating-circumstances exception. The email confirming your Wednesday
  interview slot is separate correspondence with the Convenor, not the
  assessment submission itself, and still goes by email as described
  above.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the new assertion.
  - Existing `"assignment 3 adulting"` tests (seven plan components, five
    band descriptors, "describes the plan not the student", Wednesday
    interview time in the student's hands) still pass unchanged.
- **Human review:** View
  `dist/assessments/assignment-3-adulting/index.html` and confirm a reader
  cannot mistake the interview-scheduling email for a second, alternative
  submission channel.
- **Depends on:** None.

### Task 6: Add exam conditions and the materials-compliance spec bullet to the Final Exam

- **Description:** Insert a new `## Exam conditions` section into
  `src/content/assessments/final-exam.md`'s body, immediately after `## The
  five stations`. Append one bullet to the frontmatter `spec:` array.
- **Files touched:** `src/content/assessments/final-exam.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** In the existing `describe("final exam", ...)`
  block, add:
  - `it("states the permitted exam materials")` —
    `expect(html).toMatch(/black or blue pen/i); expect(html).toMatch(/closed book/i); expect(html).toMatch(/phone/i); expect(html).toMatch(/smartwatch/i); expect(html).toMatch(/calculator/i);`
  - `it("requires silence except at Station 3")` —
    `expect(html).toMatch(/no talking/i); expect(html).toMatch(/Station 3/); expect(html).toMatch(/compulsory/i);`
  - `it("issues an answer booklet for Stations 1 to 4 and marks Station 5 by observation")` —
    `expect(html).toMatch(/answer booklet/i); expect(html).toMatch(/observation/i);`
  - `it("treats broken exam rules as academic misconduct")` —
    `expect(html).toMatch(/academic misconduct/i);`
  - `it("adds a materials-compliance line to the spec")` — reading from the
    already-parsed `api` (top of file): `const finalExam =
    assessments.find((node) => node.id === "assessments/final-exam");
    expect(finalExam?.spec?.some((line) => /pen|materials/i.test(line))).toBe(true);`

  Run `pnpm test` and confirm all five fail against the current build.
- **Implementation (green):** Append to the frontmatter `spec:` array in
  `final-exam.md` (after the existing three bullets, order preserved):

  ```yaml
    - no materials beyond a black or blue pen are brought into the exam
  ```

  Insert into the body, immediately after `## The five stations`'s closing
  paragraph ("Total examined time is 2 hours 50 minutes... duration is not
  difficulty."):

  ```markdown
  ## Exam conditions

  The only material permitted is a black or blue pen. No phones, no
  smartwatches, no other electronic devices, and no calculators — the exam
  is closed book throughout.

  No talking is permitted at any station, with one exception: Station 3
  requires it, and a silent conversation fails the station on its own
  terms.

  An official exam answer booklet is issued for your written answers
  across Stations 1 to 4. Station 5 is not written up; examiners mark it
  by observation as it happens.

  Breaking any of the above is academic misconduct.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including all five new assertions.
  - Existing `"final exam"` tests (five stations named, durations
    published, examiner may leave, sits after teaching ends) still pass
    unchanged.
  - `spec/assessment-scheme.test.ts`'s top-level `"gives every item a spec
    list"` test still passes (array length still `> 0`).
- **Human review:** View `dist/assessments/final-exam/index.html` and
  confirm the new Exam conditions section reads as a standard exam-rules
  block in the course's deadpan register — no technical metaphor, no
  sincerity break — and that Station 3's compulsory-talking rule reads as
  the intended joke against the otherwise-standard silence rule.
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [x] Every task in §5 complete and its tests passing
- [x] `pnpm test` passes (runs `pnpm build && vitest run spec`)
- [x] `pnpm check` passes (runs `pnpm typecheck && pnpm test`)
- [ ] Manually verified with `agent-browser` at both marking viewports
  (`1920 1080`, `390 844`): `/policies/`, `/assessments/weekly-reflections/`,
  `/assessments/assignment-1-makeover/`,
  `/assessments/assignment-2-touch-grass/`,
  `/assessments/assignment-3-adulting/`, and `/assessments/final-exam/` all
  render the new sections without layout breakage at both viewports
- [x] Every requirement in §2 is covered — see §7
- [x] Every task with a `Human review:` line (all six) has been shown to
  the user and explicitly accepted — not inferred, not just its acceptance
  criteria passing
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 | Task 1 |
| 2.1.2 | Task 1 |
| 2.1.3 | Task 2 |
| 2.1.4 | Task 3 |
| 2.1.5 | Task 4 |
| 2.1.6 | Task 5 |
| 2.1.7 | Tasks 2–5 (absence of a `spec:` addition, verified by acceptance criteria leaving `spec:` untouched in those files) |
| 2.1.8 | Task 6 |
| 2.1.9 | Task 6 |
| 2.1.10 | Task 1 (acceptance criteria explicitly checks no diff to Academic integrity) |
| 2.1.11 | All tasks (enforced automatically by `spec/voice.test.ts` on every `pnpm test` run; each task's Human review also checks it qualitatively) |

## 8. Risks / open questions

None.
