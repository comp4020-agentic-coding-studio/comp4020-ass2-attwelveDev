# Lecture/Lab/Assessment Consistency Pass

- **Date:** 2026-09-17
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-17 (see
  `specs/2026-09-17-lecture-consistency-pass.md` for the full brainstorm
  record, probes, and resolutions)

## 1. Summary

SLOP1521's lectures, labs, decks, and assessments currently violate the
course's own implicit teaching order: labs and assessments introduce named
case studies, concrete figures, and even whole assignment-brief components
that no lecture ever taught first, and several lectures state a research
finding with no procedure for actually doing the thing. This plan (a) adds
two durable rules to `CLAUDE.md` (introduce-before-reference; how not just
what/why), (b) adds a mechanical `spec/` check so the case-study half of the
rule is enforced automatically, and (c) fixes every confirmed violation
across all 12 weeks plus the assessment files, so a student who attends
lectures in order is never asked to reason about, or graded on, something
they haven't been shown yet.

## 2. Requirements

### 2.1 Functional requirements

Numbered to match `specs/2026-09-17-lecture-consistency-pass.md` §2 exactly
(same numbering, same text) — see that file for full rationale per item.
Summarized here for the task breakdown:

1. Add the core `CLAUDE.md` rule (introduce-before-reference + its two
   extensions: assignment mentions must show real rubric content; lab
   handoffs must give a real overview).
2. Add the standing `CLAUDE.md` rule (how, not just what/why).
3. Add `caseStudies: z.array(z.string().trim().min(1)).default([])` to the
   `lectures` and `sessions` schemas in `src/content.config.ts`.
4. Populate `caseStudies` frontmatter on every lecture/lab pair that carries
   a named case study.
5. Add `spec/case-study-provenance.test.ts` asserting every lab case-study
   identifier appears in that week's lecture's identifiers.
6. Week 1 — name the five recurring topics; add the "how" of habit-building
   (Gollwitzer 1999).
7. Week 1 — add real desk/clutter content (grounds Week 12's callback).
8. Week 2 — add laundry colour-separation; elaborate skincare into a real
   "how" key point.
9. **(Expanded 2026-09-17, mid-execution, per user feedback on Week 2's
   review):** every named concept taught in every lecture (all 12 weeks)
   gets its own procedural "how" in both lecture body and deck — not just
   one gap closed per week. The standing CLAUDE.md rule already said "a
   how for every concept it teaches"; this corrects Task 9 as originally
   scoped (one identified gap per week, Weeks 1/4/7/10/12 exempted) to
   actually match that rule. Concretely: for every week's Definitions/Body
   concepts, walk each one and add a concrete how wherever it's missing —
   Week 1 needs none beyond what Task 4 already added (Week 1 is
   diagnostic-only; it doesn't teach hygiene/dress/etc. as concepts, only
   names them), Week 2 additionally needs shower, deodorant, and haircut
   hows (laundry and skincare already covered by the original Task 7),
   and Weeks 3/4/5/6/7/8/9/10/11/12 each need a full per-concept audit
   during their own task rather than the single gap originally named.
10. Week 3 — add *Job interview* definition; soften the hook; add a
    weather-mismatch example; bring worked occasion-reading examples into
    the lecture.
11. Week 4 — sleep/exercise "how"; full seven-day Jordan's Week case study;
    real fridge beat.
12. Week 5 — state the concrete 400-metre radius figure.
13. Week 7 — add a "reading the room" key point + definition.
14. Week 8 — show the incident-report format directly in the lecture.
15. Week 9 — the 600-word message in full.
16. Week 10 — add cooking and cleaning-schedule key points.
17. Assignment 3 — add "Cleaning schedule" and "Skincare" bullets to
    "## The plan".
18. Week 11 — add a meetings key point; show the full bad email.
19. Week 12 — reflections drop rule becomes "best 10 of 12, drop worst 2";
    weighting unchanged; text range becomes "weeks 1–12".
20. Style `.course-citation-note` distinctly from its citation.
21. Lectures overview page gets labs-overview-equivalent structure; both
    overview pages get a justification section citing Freeman et al. (2014).
22. Link the references page from the lectures page, with back-links to
    each week's lecture page.
23. Apply the core rule's assignment-mention extension concretely at Week 2
    (Assignment 1 rubric) and Week 10 (Assignment 3 budget rubric).
24. Fix the pre-existing duplicate "Key point 3 — Staff and policies"
    heading bug in `week-01.deck.mdx` by splitting into two key points.

### 2.2 Non-functional requirements

None beyond project defaults: `pnpm check` must stay green; new/changed
prose must pass `spec/voice.test.ts`'s banned-term list and read in the
course's deadpan mundane-stereotype register (never a technical metaphor);
visual changes verified with `agent-browser` at 1920×1080 and 390×844.

### 2.3 Out of scope

- Real photography for Weeks 2 and 3 — flagged for the user to source
  manually, not part of this plan.
- A full semantic check of every concept/terminology forward-reference —
  the mechanical check only covers named case-study identifiers.
- Rewriting decks that already contain an adequate "how" for a concept
  they've already got one for — requirement 9 (as expanded) still means
  auditing every concept per week, but a concept that already has a real
  procedure is left alone.
- A per-prompt due-date field for the Week 12 reflection — the existing
  recurring "due every Tuesday" mechanism already covers it.

### 2.4 Assumptions

None outstanding — every assumption raised during brainstorming was
confirmed with the user (see `specs/2026-09-17-lecture-consistency-pass.md`
§2.7 and §5).

## 3. Existing code context

**Content shape** (all verified by direct reads during brainstorming):
- `src/content/lectures/week-NN.mdx` — 5 slots via `## Introduction`,
  `## Definitions`, `## Body`, `## In-lecture activity`, `## Conclusion`
  headings (asserted by `spec/weekly-structure.test.ts`). Frontmatter
  includes `citations: { text: string; note?: string }[]`.
- `src/content/sessions/week-NN.md` — 3 slots via `## Before the Lab`,
  `## In the Lab`, `## Afterwards`.
- `src/decks/week-NN.deck.mdx` — slide decks, `---`-delimited slides,
  separate render target from the lecture page (referenced via the
  lecture's `slides: "/decks/week-NN/"` frontmatter field). Not subject to
  `spec/weekly-structure.test.ts`'s heading checks — no fixed shape beyond
  what each deck author has used (`## Key point N — <title>` headings by
  convention).
- `src/content/assessments/*.md`.
- `src/course-config.ts` — exports `courseMeta` with a 9-entry
  `learningOutcomes: string[]` (no new outcome needed by this plan).

**Schema** — `src/content.config.ts` (full file read):
```ts
lectures: defineCollection({
  loader: courseNodeLoader("lectures"),
  schema: courseNodeSchema
    .extend({
      week: weekSchema,
      date: z.coerce.date(),
      teachers: teacherRefs.optional(),
      slides: z.string().regex(/^\/decks\/[a-z0-9-]+\/$/).optional(),
      citations: z.array(z.object({ text: z.string(), note: z.string().optional() })).default([]),
    })
    .loose(),
}),
sessions: defineCollection({
  loader: courseNodeLoader("sessions"),
  schema: courseNodeSchema.extend({
    week: weekSchema,
    date: z.coerce.date(),
    teachers: teacherRefs.optional(),
  }).loose(),
}),
```
`courseNodeSchema` (from `astro-course-university/schemas`) provides
`title, description, tags, related, links, spec, published, draft`. Both
schemas use `.loose()`, so a new key does not require this to be re-verified
for strict-mode rejection — but the field must still be added explicitly to
get type-checking and defaults.

**Build pipeline** (confirmed by reading `astro-course-university`'s
`course-content.ts`): frontmatter keys not destructured into named schema
fields are spread into `node.meta` via `meta: rest` — so a new `caseStudies`
frontmatter field automatically appears at `node.meta.caseStudies` in
`dist/api/index.json` with **no changes needed** in the `astro-course-university`
package itself.

**Citations** — `src/components/References.astro` and
`src/pages/references/index.astro` both render:
```astro
<li>
  {citation.text}
  {citation.note && <span class="course-citation-note"> {citation.note}</span>}
</li>
```
with zero CSS anywhere for `.course-citation-note` (confirmed by repo-wide
grep). `spec/references-page.test.ts` hardcodes
`expect(items.length).toBe(12)` with a comment explaining the current
dedup math (Lally 2010 ×2, Kruger 2005 ×2) — adding the Gollwitzer (1999)
citation in Week 1 pushes unique citations to 13 and this test must be
updated in the same task that adds the citation.

**`references/index.astro`** builds `uniqueCitations` only from the
`lectures` collection's `citations` field — no per-lecture back-links exist
yet.

**`src/pages/lectures/index.mdx`** (18 lines) — title/description
frontmatter, 2 sentences of prose, `<LecturesGrid />`. No "how it
runs"/highlights/structure/justification content.

**`src/pages/sessions/index.astro`** (48 lines) — already has highlights, a
6-step "how it runs" list, and a no-screens note, but no justification
section.

**Test setup** — `package.json` scripts: `"check": "pnpm typecheck && pnpm test"`,
`"test": "pnpm build && vitest run spec"`. Every `spec/*.test.ts` run
rebuilds `dist/` first, so tests always see current content — no manual
build step needed in any task. Test file convention (from
`spec/data-integrity.test.ts` and `spec/weekly-structure.test.ts`): read
`dist/api/index.json` once at module scope, typed as
`{ id: string; type: string; meta?: Record<string, unknown> }[]` under
`nodes`, filter by `type` (`"lectures"` / `"sessions"` / `"assessments"`),
and read `node.meta?.<field>`. `spec/harness.test.ts` reads `CLAUDE.md`
directly (the one test in `spec/` that doesn't read `dist/`) via
`expect(claudeMd).toContain(...)` / `.toMatch(...)`.

**Exact current violation text** (gathered by direct file reads during
brainstorming; quoted per-task below where it's the edit site).

## 4. Approach

Sequence: foundational infrastructure (schema field, mechanical test,
`CLAUDE.md` rules) lands first since every content task either populates
`caseStudies` or is governed by the new rules. Week-by-week content tasks
are otherwise independent of each other (each touches a disjoint set of
files) and are ordered by week number for readability, not dependency.
Shared-infrastructure tasks (citation styling, overview pages, references
linking) are independent of the week tasks and can run in any order once
the foundational tasks land.

Content tasks specify the exact factual elements and tags required, but not
verbatim final prose — composing new in-voice satirical content is the
executing agent's job at build time, and its correctness (deadpan register,
mundane-stereotype humor, no technical metaphor) is not something a
mechanical check can fully verify. Every content task therefore carries a
**Human review** line naming the exact rendered page and what a pass looks
like, per this repo's own `CLAUDE.md` register rules and `spec/voice.test.ts`.

## 5. Task breakdown

### Task 1: Add `caseStudies` field to the content schema

- **Description:** Add a `caseStudies` frontmatter array to both the
  `lectures` and `sessions` collections so named case studies can be
  tagged and mechanically cross-checked.
- **Files touched:** `src/content.config.ts`.
- **Tests first (red):** Add `spec/data-integrity.test.ts` case (or a new
  small test in that file) `"accepts an optional caseStudies array on
  lectures and sessions"` — this needs the schema change to exist to even
  build, so the red state is: `pnpm build` fails today if any content file
  sets `caseStudies` (it doesn't yet) — instead, write the test as: after
  adding one temporary `caseStudies: ["temp-check"]` line to
  `src/content/lectures/week-01.mdx` frontmatter, run `pnpm build` and
  confirm `dist/api/index.json`'s `lectures/week-01` node has
  `meta.caseStudies` equal to `["temp-check"]`; confirm this fails
  (build error: unrecognized key stripped, or absent from `meta`) before
  the schema change. Remove the temporary line once the schema change is
  green and real content tasks (6, 7, 10, 11, 13, 14, 15, 18) add real
  values instead.
- **Implementation (green):** In `src/content.config.ts`, add
  `caseStudies: z.array(z.string().trim().min(1)).default([])` to both the
  `lectures.schema.extend({...})` and `sessions.schema.extend({...})`
  blocks (alongside `week`, `date`, etc.).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `src/content.config.ts` exports both `lectures` and `sessions`
    collections with a `caseStudies` field of the exact type above.
  - `pnpm build` succeeds with a lecture/session file setting
    `caseStudies: ["some-id"]` and the resulting `dist/api/index.json`
    node's `meta.caseStudies` equals `["some-id"]`.
  - `pnpm build` succeeds with no `caseStudies` field present anywhere
    (defaults to `[]`), i.e. this is fully backward compatible.
- **Depends on:** None.

### Task 2: Add the case-study provenance mechanical check

- **Description:** Add `spec/case-study-provenance.test.ts` asserting every
  `caseStudies` identifier on a lab also appears on that week's lecture.
- **Files touched:** `spec/case-study-provenance.test.ts` (new).
- **Tests first (red):** Temporarily add `caseStudies: ["red-check"]` to
  `src/content/sessions/week-02.md` frontmatter (a week with no lecture-side
  `caseStudies` yet) and confirm the new test fails with a message like
  `sessions/week-02's case study "red-check" is not introduced in week 2's
  lecture`. Remove the temporary line once the test is written and
  confirmed to fail correctly, then let it pass vacuously (no
  `caseStudies` populated anywhere yet, so the loop has nothing to check)
  until later content tasks populate real matching pairs.
- **Implementation (green):**
  ```ts
  import { readFileSync } from "node:fs";
  import { resolve } from "node:path";
  import { describe, expect, it } from "vitest";

  interface ApiNode {
    id: string;
    type: string;
    meta?: Record<string, unknown>;
  }
  interface CourseApi {
    nodes: ApiNode[];
  }

  const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
  const lectures = api.nodes.filter((node) => node.type === "lectures");
  const sessions = api.nodes.filter((node) => node.type === "sessions");

  function caseStudyIds(node: ApiNode | undefined): string[] {
    const value = node?.meta?.caseStudies;
    return Array.isArray(value) ? (value as string[]) : [];
  }

  describe("case study provenance", () => {
    it("introduces every lab's case studies in that week's lecture first", () => {
      for (const session of sessions) {
        const week = Number(session.meta?.week);
        const lecture = lectures.find((node) => Number(node.meta?.week) === week);
        const lectureIds = new Set(caseStudyIds(lecture));
        for (const id of caseStudyIds(session)) {
          expect(
            lectureIds.has(id),
            `${session.id}'s case study "${id}" is not introduced in week ${week}'s lecture`,
          ).toBe(true);
        }
      }
    });
  });
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` includes and passes `spec/case-study-provenance.test.ts`.
  - Confirmed (during red step) that the test actually fails when a lab
    case-study id has no lecture-side match.
- **Depends on:** Task 1 (schema field must exist).

### Task 3: Add the two new `CLAUDE.md` rules + harness test

- **Description:** Add the core rule and the "how" standing rule to
  `CLAUDE.md`'s `# Course rules` section (after `## All deadlines are 12:00
  local`, the last existing subsection), and extend `spec/harness.test.ts`
  to pin both verbatim.
- **Files touched:** `CLAUDE.md`, `spec/harness.test.ts`.
- **Tests first (red):** Add to `spec/harness.test.ts`:
  ```ts
  it("requires case studies to be introduced in the lecture first", () => {
    expect(claudeMd).toMatch(/introduced in a lecture/i);
    expect(claudeMd).toMatch(/never introduce it first/i);
  });

  it("requires a how, not just a what and why", () => {
    expect(claudeMd).toMatch(/how.{0,20}not just.{0,20}what.{0,10}why/is);
  });
  ```
  These fail against current `CLAUDE.md` (confirmed by reading the full
  current file — neither phrase exists).
- **Implementation (green):** Add, as a new `## Core rule` and
  `## How, not just what/why` subsection under `# Course rules` in
  `CLAUDE.md`, the exact text approved in
  `specs/2026-09-17-lecture-consistency-pass.md` §4:
  > **Core rule:** Every concept, named example, or case study must be
  > introduced in a lecture — its Definitions or Body section, not just the
  > deck — before it appears in that week's lab, a later week, or any
  > assessment. A lab may reference or extend what the lecture already
  > covered, but never introduce it first. This extends to two common
  > failure shapes:
  > - An assignment mention in a lecture must show the actual relevant
  >   rubric content, not a bare pointer.
  > - A lecture's handoff to its own lab must describe what the lab
  >   actually does and how it builds on the lecture, not treat the lab as
  >   a black box.
  >
  > **How, not just what/why:** Every lecture needs a "how" for every
  > concept it teaches — stated briefly on the lecture page, and in real
  > procedural detail (zero prior familiarity) in the deck.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `CLAUDE.md`'s `# Course rules` section contains both new subsections,
    verbatim as above.
  - `pnpm test` (which includes `spec/harness.test.ts`) passes.
- **Depends on:** None.

### Task 4: Week 1 — name the five topics; add the habit-building "how"

- **Description:** `week-01.mdx:90` and `week-01.deck.mdx:108` currently
  say "the course's five recurring topics" without naming them. Name all
  five. `week-01.mdx:82-87` and `week-01.deck.mdx:92-102` state the
  Lally et al. (2010) 66-day finding with no "how" — add Gollwitzer (1999)
  implementation-intentions research as the "how", tied explicitly to the
  course's "a plan needs a time, not an intention" line.
- **Files touched:** `src/content/lectures/week-01.mdx`,
  `src/decks/week-01.deck.mdx`.
- **Tests first (red):**
  - `spec/references-page.test.ts`: update
    `expect(items.length).toBe(12)` to `toBe(13)` and its explanatory
    comment to also note Gollwitzer (1999) as a new, non-duplicated
    citation. This assertion fails today at `12` once the new citation is
    added, confirming the red state.
  - `spec/voice.test.ts`: no new banned terms expected, but re-run it after
    drafting the new prose to confirm no banned term slipped in (the test
    itself needs no code change).
- **Implementation (green):**
  - `week-01.mdx` line 90 (and deck line 108): replace "the course's five
    recurring topics" with the five named explicitly: hygiene, dress,
    sleep, conversation, money (matching the lab's own list at
    `sessions/week-01.md:21-22`).
  - `week-01.mdx` frontmatter `citations` array: add
    `{ text: "Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. American Psychologist, 54(7), 493–503.", note: "<explanatory clause, e.g. rewording a goal with a stated time roughly doubles follow-through>" }`.
  - `week-01.mdx` key point 4 (lines 82-87) and `week-01.deck.mdx`
    (lines 92-102): add a "how" paragraph applying Gollwitzer's
    implementation-intentions method (reword "I will X" into "when Y, I
    will X, at time Z"), explicitly connecting it to the course's own "a
    plan needs a time, not an intention" line already used elsewhere in
    the course.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/weekly-structure.test.ts` still passes (5-slot order and Body
    length unaffected).
  - `spec/references-page.test.ts` passes with 13 unique citations.
  - The five topics are named verbatim (or equivalently) in both the
    lecture and the deck.
- **Human review:** Render `lectures/week-01` and `decks/week-01` at both
  marking viewports. Pass = the five-topics line reads naturally (not a
  dumped list) and the Gollwitzer "how" paragraph is in the course's
  deadpan mundane-stereotype voice (per `CLAUDE.md`'s Register and voice
  rule) — no technical metaphor, no jargon in backticks.
- **Depends on:** None (independent of Tasks 1–3, but should land after
  Task 3 so the rule it satisfies already exists).

### Task 5: Week 1 — add a real desk/clutter case study

- **Description:** Week 12 (`week-12.mdx:61-62`,
  `week-12.deck.mdx:76`) calls back to "Week 1's desk, its accumulated
  clutter replaced by a shallow tray" — but Week 1 has no desk content at
  all. Add a genuine desk-clutter beat to Week 1 (fits the "starting point"
  self-assessment theme) and tag it so Week 12's callback becomes a real
  payoff and the mechanical check (once cross-week reuse is considered) has
  a real referent.
- **Files touched:** `src/content/lectures/week-01.mdx`,
  `src/decks/week-01.deck.mdx`.
- **Tests first (red):** No new automated test — this is a same-file
  addition alongside Task 4's citation change. Verify manually (see Human
  review) since "does this desk beat read as a genuine case study" is not
  mechanically checkable.
- **Implementation (green):** Add a desk-clutter observation to the Week 1
  Body (or Introduction) — e.g. a desk whose surface has become storage
  rather than workspace, tied to the "starting point" self-assessment
  theme — and set `caseStudies: ["desk-clutter"]` in `week-01.mdx`
  frontmatter (added value, not overwriting Task 4's other frontmatter
  changes). Mirror the beat in `week-01.deck.mdx`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `week-01.mdx` frontmatter includes `caseStudies: ["desk-clutter"]`.
  - `spec/weekly-structure.test.ts` still passes.
- **Human review:** Render `lectures/week-01`. Pass = the desk-clutter beat
  reads as a genuine, funny, mundane observation (matching the style of the
  fridge/sock-pile beats elsewhere), not filler bolted on to satisfy a
  callback.
- **Depends on:** Task 1 (schema field must exist to set `caseStudies`).

### Task 6: Week 1 deck — split the duplicate "Key point 3" heading

- **Description:** `week-01.deck.mdx` has two slides both literally headed
  `## Key point 3 — Staff and policies` (current lines 75 and 84). Split
  into `## Key point 3 — Staff` and `## Key point 4 — Policies`, renumbering
  any subsequent key points in that deck by one.
- **Files touched:** `src/decks/week-01.deck.mdx`.
- **Tests first (red):** None automated (decks have no heading-order test
  like lectures/labs do). Verify manually by rendering the deck and
  confirming no two slides share a heading.
- **Implementation (green):** Split the existing "Staff and policies"
  content across the two slides so each heading's content matches its own
  topic; renumber every subsequent `## Key point N` heading in the file by
  +1.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - No two slides in `week-01.deck.mdx` share an identical heading.
  - Key point numbers are sequential with no gaps or repeats.
- **Human review:** Render `decks/week-01`. Pass = each of the two new
  slides reads as a complete, distinct point (not an arbitrary text split).
- **Depends on:** None (can land independently of Tasks 4–5, but touches
  the same file, so should be done in the same sitting to avoid merge
  conflicts).

### Task 7: Week 2 — colour separation + a real "how" for every concept

- **Description (expanded 2026-09-17 per user feedback):** `week-02.mdx`/
  `week-02.deck.mdx`'s laundry content has no colour-separation guidance
  (needed to ground Assignment 3's "Laundry: frequency and colour
  separation" rubric line, and Task 22 will add the matching Assignment 3
  plan bullet). Skincare currently exists only as a Definitions entry
  (`week-02.deck.mdx:44`, mirrored in the lecture) with no procedure —
  elaborate it into a real "how" key point (cleanse, moisturise, SPF,
  frequency). Per the expanded requirement 9, the same treatment now
  applies to the week's other three concepts that were originally left
  as bare definitions with no procedure: shower, deodorant, and haircut
  (Definitions entries only, `week-02.mdx:36-53`/`week-02.deck.mdx:43-46`).
- **Files touched:** `src/content/lectures/week-02.mdx`,
  `src/decks/week-02.deck.mdx`.
- **Tests first (red):** None automated beyond re-running
  `spec/voice.test.ts` and `spec/weekly-structure.test.ts` after drafting
  (no banned terms, Body still ≥80 chars — already true, this only grows
  it).
- **Implementation (green):**
  - Add a colour-separation sentence/bullet to the existing laundry
    content (Definitions' *Laundry* term or the laundry-pile key point,
    `week-02.mdx:46-49`/`72-78`).
  - Add a new key point (lecture body + deck) walking through an actual
    skincare routine at a level assuming zero prior familiarity: order of
    steps (cleanse, moisturise, SPF), and roughly how often each is done.
  - Add concrete hows for shower (frequency, when in the day, tied to an
    existing routine anchor), deodorant (applied to dry skin right after
    showering, before getting dressed), and haircut (booking the next cut
    on the day of the last one, or a standing calendar reminder, rather
    than waiting until it feels overdue) — in both lecture body and deck,
    split across additional deck slides as needed to avoid the overflow
    found in Week 1's review.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/weekly-structure.test.ts` and `spec/voice.test.ts` still pass.
  - Colour separation is mentioned in the laundry content; a concrete
    procedure (not just a definition) exists for shower, deodorant,
    laundry, haircut, and skincare, in both lecture and deck.
- **Human review:** Render `lectures/week-02` and `decks/week-02`. Pass =
  every procedure is followable by someone with zero existing routine,
  no deck slide overflows, and everything reads in-voice.
- **Depends on:** None.

### Task 8: Week 2 — replace the bare Assignment 1 rubric pointer

- **Description:** `week-02.mdx:80-81` ("Assignment 1's rubric doesn't ask
  for a perfect routine, just one that survives a bad week") and
  `week-02.deck.mdx:73-79` are bare pointers with no actual rubric content,
  violating the core rule's assignment-mention extension (requirement 23).
- **Files touched:** `src/content/lectures/week-02.mdx`,
  `src/decks/week-02.deck.mdx`, and (read-only reference)
  `src/content/assessments/assignment-1-makeover.md` for the actual
  criteria to quote.
- **Tests first (red):** None automated — this is a content-completeness
  requirement checkable only by reading the result against
  `assignment-1-makeover.md`'s real criteria.
- **Implementation (green):** Replace the bare pointer with the actual
  relevant Assignment 1 marking criteria (read from
  `assignment-1-makeover.md`'s marking table), summarized in the lecture's
  own voice rather than restated as a raw table.
- **Refactor:** None expected.
- **Acceptance criteria:** The lecture/deck text names at least the
  specific criteria categories from `assignment-1-makeover.md`'s marking
  table, not just a vague reference to "the rubric."
- **Human review:** Render `lectures/week-02`. Pass = the rubric content
  shown actually matches `assignment-1-makeover.md`'s current criteria (no
  drift) and reads in-voice.
- **Depends on:** None.

### Task 9: Week 3 — interview definition, softened hook, weather example, worked occasion examples

- **Description:** Four related Week 3 fixes: (a) `week-03.mdx:25`/
  `week-03.deck.mdx:17-19`'s hook ("Would you wear what you're wearing
  right now to a job interview?") pre-empts Week 11's interview content —
  soften it and add a Definitions entry; (b) no weather-appropriate-attire
  content exists anywhere, leaving that learning outcome ungrounded; (c)
  `week-03.mdx:63-67`/`week-03.deck.mdx:59-65`'s Body bullet text (not
  literally a "CheckIn" element — the bullet text itself, e.g. "The five
  outfit photos from the Week 3 lab...") presupposes the lab's five outfit
  photos, which students haven't seen yet (lecture is 2027-03-09, lab is
  2027-03-11).
- **Files touched:** `src/content/lectures/week-03.mdx`,
  `src/decks/week-03.deck.mdx`.
- **Tests first (red):** None automated — re-run `spec/weekly-structure.test.ts`
  and `spec/voice.test.ts` after drafting.
- **Implementation (green):**
  - Add a Definitions entry: *Job interview* (noun, brief) — a short,
    structured meeting in which a candidate is evaluated for a role;
    covered in full in Week 11.
  - Soften the hook to acknowledge Week 11 covers interviews properly
    (e.g. "...for now, it's just another occasion your clothes need to
    match"), in both lecture and deck.
  - Add one weather-mismatch outfit example (occasion-correct, weather-
    wrong) to the Body, grounding the "weather- and occasion-appropriate
    attire" learning outcome (`src/course-config.ts:68`).
  - Replace the lab-photo-dependent CheckIn with worked occasion-reading
    examples native to the lecture (the lecture already has a working
    lecture-native model for this at its In-lecture activity,
    `week-03.mdx:75-82` — use the same style: describe 1–2 outfits and
    occasions directly in the Body rather than referencing the lab's
    specific photos).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `week-03.mdx` Definitions section includes a *Job interview* term.
  - The hook text no longer implies interviews haven't been covered
    without qualification.
  - A weather-mismatch example exists in the Body.
  - The CheckIn (or its replacement) references only content the lecture
    itself has shown, not the lab's specific photos.
- **Human review:** Render `lectures/week-03` and `decks/week-03`. Pass =
  the softened hook and weather example land as genuinely funny mundane
  observations (not a defensive-sounding disclaimer), and the new worked
  examples are self-contained.
- **Depends on:** None.

### Task 10: Week 4 — sleep/exercise "how", full Jordan's Week, real fridge beat

- **Description:** Three fixes: (a) `week-04.mdx:59-63,69-74` state sleep
  (Hirshkowitz 2015) and exercise (Chekroud 2018) findings with no "how";
  (b) `week-04.mdx:65-68`/`week-04.deck.mdx:63-69`'s "Jordan's Week, fully
  unpacked" gives only 2 of the 7 days present in
  `sessions/week-04.md:39-67`, then punts to the lab; (c) Week 2
  (`week-02.mdx:26-27`) promised the fridge would return in "weeks 4 and
  10" but Week 4 has no fridge content at all, while Week 10/12 both
  falsely assert it did.
- **Files touched:** `src/content/lectures/week-04.mdx`,
  `src/decks/week-04.deck.mdx`.
- **Tests first (red):** None automated beyond re-running
  `spec/weekly-structure.test.ts`/`spec/voice.test.ts`.
- **Implementation (green):**
  - Add a "how" to the sleep key point (e.g. a consistent wake time and a
    screen wind-down cutoff before bed) and to the exercise key point (a
    concrete, simple routine — frequency and duration — a complete
    beginner could follow), in both lecture and deck.
  - Replace the 2-day teaser with the full seven-day (Mon–Sun) Jordan's Week
    breakdown from `sessions/week-04.md:39-67` (in the lecture's own voice,
    not a copy-paste), in both lecture and deck. Set
    `caseStudies: ["jordans-week"]` on `week-04.mdx` (matching
    `sessions/week-04.md`, which already carries the full case study and
    should also get `caseStudies: ["jordans-week"]` added).
  - Add a real fridge beat (tied to Week 4's exercise/meal-skipping theme)
    and set `caseStudies: ["fridge"]` on `week-04.mdx` and `week-04.deck.mdx`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Both `week-04.mdx` and `sessions/week-04.md` carry
    `caseStudies: ["jordans-week"]`; `spec/case-study-provenance.test.ts`
    passes for week 4.
  - `week-04.mdx` carries `caseStudies: ["fridge"]`.
  - The lecture/deck present all seven days of Jordan's Week, not a 2-day
    teaser.
  - Sleep and exercise key points each include a concrete procedure.
- **Human review:** Render `lectures/week-04` and `decks/week-04`. Pass =
  the full Jordan's Week breakdown is funny/mundane in the same register as
  the lab's version (not a dry restatement), and the fridge beat fits
  naturally with Week 4's theme rather than feeling inserted to satisfy a
  continuity requirement.
- **Depends on:** Task 1 (schema field) for the `caseStudies` values; also
  edits `sessions/week-04.md`, so should be sequenced to avoid conflicting
  with any other task touching that file (none currently do).

### Task 11: Week 5 — attention-restoration "how" + the 400-metre figure

- **Description:** `week-05.mdx`'s Body states the attention-restoration
  finding but never explains how to do a restorative outdoor session
  (duration, what counts as a natural setting) — that procedure currently
  lives only in the lab's field guide (`sessions/week-05.md:37-46`).
  Separately, Assignment 2 (`assignment-2-touch-grass.md:4-5,28`) names a
  concrete "400-metre radius" that neither the lecture (`week-05.mdx`,
  reflection at lines 82-84) nor the lab (`sessions/week-05.md:48`) ever
  states — the lecture and deck currently say "your own radius"
  (`week-05.mdx:82-84`, `week-05.deck.mdx:97-99`); the lab says "your usual
  radius" (`sessions/week-05.md:48`).
- **Files touched:** `src/content/lectures/week-05.mdx`,
  `src/decks/week-05.deck.mdx`, `src/content/sessions/week-05.md`.
- **Tests first (red):** None automated beyond re-running
  `spec/weekly-structure.test.ts`/`spec/voice.test.ts`.
- **Implementation (green):**
  - Replace the bare handoff ("What the lab will ask you to do",
    `week-05.mdx:64-65`, and deck lines 69-71) with an actual procedure:
    minimum duration, what settings qualify (a park or garden, not just a
    window), and a no-phone condition — in both lecture and deck.
  - Replace "your own radius" (`week-05.mdx:82-84`, `week-05.deck.mdx:97-99`)
    and "your usual radius" (`sessions/week-05.md:48`) with the concrete
    "400-metre radius" figure in all three.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Both lecture and deck contain a concrete attention-restoration
    procedure, not a bare lab handoff.
  - "400-metre" (or "400 metres") appears in `week-05.mdx`,
    `week-05.deck.mdx`, and `sessions/week-05.md`.
- **Human review:** Render `lectures/week-05`, `decks/week-05`, and
  `sessions/week-05`. Pass = the procedure is genuinely followable by
  someone who has never deliberately spent time outdoors, and the 400m
  figure reads naturally rather than as an inserted number.
- **Depends on:** None.

### Task 12: Week 6 — enforcement-mechanism "how"

- **Description:** `week-06.mdx:59-60` ("What Thursday replaces a screen
  with. Direct handoff to the Week 6 lab.") and `week-06.deck.mdx:72-74`
  give no procedure for designing a laptop/phone-separation enforcement
  mechanism — that lives only in `sessions/week-06.md:52-62`.
- **Files touched:** `src/content/lectures/week-06.mdx`,
  `src/decks/week-06.deck.mdx`.
- **Tests first (red):** None automated beyond re-running
  `spec/weekly-structure.test.ts`/`spec/voice.test.ts`.
- **Implementation (green):** Add a "how to design an enforcement
  mechanism" key point (physical placement of the device, a stated time
  window, one allowed exception), drawn from `sessions/week-06.md:58-62`,
  to both lecture body and deck, replacing the bare handoff line.
- **Refactor:** None expected.
- **Acceptance criteria:** The lecture/deck contain a concrete mechanism-
  design procedure, not a bare "direct handoff" line.
- **Human review:** Render `lectures/week-06` and `decks/week-06`. Pass =
  the procedure is concrete enough to act on without having read the lab
  first.
- **Depends on:** None.

### Task 13: Week 7 — add "reading the room"

- **Description:** Final Exam Station 4 ("Reading the Room", worth 20%,
  `final-exam.md:18,42-43`) and the "recognise social cues" learning
  outcome (`src/course-config.ts:70`) are both grounded only in
  `sessions/week-07.md:47-53`'s lab activity — no lecture ever teaches
  this skill.
- **Files touched:** `src/content/lectures/week-07.mdx`,
  `src/decks/week-07.deck.mdx`.
- **Tests first (red):** `spec/case-study-provenance.test.ts` (from Task 2)
  will fail once `sessions/week-07.md` is tagged with
  `caseStudies: ["reading-the-room"]` but `week-07.mdx` isn't yet — do the
  session tagging first to observe the red state, then add the matching
  lecture content and tag.
- **Implementation (green):**
  - Add a Definitions entry (e.g. *Reading the room*) and a new key point
    to `week-07.mdx`'s Body and `week-07.deck.mdx`, teaching the specific
    cues from `sessions/week-07.md:47-53` (one-word answers, repeated
    glances at the door, checking a watch mid-sentence) and a
    diagnose-then-respond method.
  - Set `caseStudies: ["reading-the-room"]` on `week-07.mdx` and
    `sessions/week-07.md`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/case-study-provenance.test.ts` passes for week 7.
  - `week-07.mdx` Definitions includes a reading-the-room-equivalent term.
- **Human review:** Render `lectures/week-07` and `decks/week-07`. Pass =
  the cue examples and diagnose-then-respond method are concrete and
  in-voice, matching the lab's own examples without just copying them.
- **Depends on:** Task 1 (schema field).

### Task 14: Week 8 — show the incident-report format; add an apology-assembly "how"

- **Description:** `week-08.mdx:65-66` ("The incident-report format. Reuses
  the Week 8 lab's format directly.") is a black-box handoff — the format
  itself (`sessions/week-08.md:50-56`) never appears in the lecture.
  Separately, the apology key points (1–2) state which of six components
  matter most but never show how to assemble them into an actual apology.
- **Files touched:** `src/content/lectures/week-08.mdx`,
  `src/decks/week-08.deck.mdx`.
- **Tests first (red):** `spec/case-study-provenance.test.ts` will fail
  once `sessions/week-08.md` is tagged `caseStudies: ["incident-report"]`
  before `week-08.mdx` is — tag the session first to observe red, then add
  the lecture content and tag.
- **Implementation (green):**
  - Show the incident-report format directly in `week-08.mdx`'s Body and
    `week-08.deck.mdx` (what was agreed, what actually happened, and the
    actual reason — traced to a process failure, never to one person's
    character — per `sessions/week-08.md:50-56`), replacing the bare
    "reuses the lab's format" line.
  - Set `caseStudies: ["incident-report"]` on `week-08.mdx` and
    `sessions/week-08.md`.
  - Add a worked example assembling the six apology components (regret,
    explanation, acknowledgment, repair, etc.) into one coherent apology,
    in lecture body and deck.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/case-study-provenance.test.ts` passes for week 8.
  - The lecture shows the actual incident-report format, not a pointer.
  - A worked apology example exists in both lecture and deck.
- **Human review:** Render `lectures/week-08` and `decks/week-08`. Pass =
  the incident-report format and apology example are concrete and
  in-voice.
- **Depends on:** Task 1 (schema field).

### Task 15: Week 9 — the 600-word message in full

- **Description:** `week-09.mdx:24-28` quotes only the first two sentences
  of the 600-word message before revealing its length; the full text lives
  only in `sessions/week-09.md:47-66`. `week-09.mdx:65-66`/
  `week-09.deck.mdx:69-71` ("Reading between the lines. Direct handoff to
  the lab's ambiguous-message exercise.") also has no "how" for writing/
  reading a message clearly.
- **Files touched:** `src/content/lectures/week-09.mdx`,
  `src/decks/week-09.deck.mdx`.
- **Tests first (red):** `spec/case-study-provenance.test.ts` will fail
  once `sessions/week-09.md` is tagged `caseStudies: ["600-word-message"]`
  before `week-09.mdx` is — tag the session first to observe red.
- **Implementation (green):**
  - Quote the full 600-word message verbatim (from
    `sessions/week-09.md:47-66`) in `week-09.mdx`'s Body, and set
    `caseStudies: ["600-word-message"]` on both `week-09.mdx` and
    `sessions/week-09.md`. Reflect the same in `week-09.deck.mdx`
    (verbatim or a clearly-marked excerpt reference, matching how other
    decks handle long quoted material).
  - Replace the bare "direct handoff" line with an actual clarity-editing
    method (e.g. cut to one answerable question) in lecture body + deck.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/case-study-provenance.test.ts` passes for week 9.
  - The full message text (not just the first two sentences) appears in
    `week-09.mdx`.
- **Human review:** Render `lectures/week-09` and `decks/week-09`. Pass =
  the full message lands with the same comic timing as the lab's version
  (the "guess the length" beat should still work even with the full text
  shown), and the new editing method is concrete.
- **Depends on:** Task 1 (schema field).

### Task 16: Week 10 — cooking and cleaning-schedule key points

- **Description:** Final Exam Station 5 ("Daily Survival", cooking, worth
  30%, `final-exam.md:20-21,44-46`) and Assignment 3's "Cleaning schedule"
  rubric line (`assignment-3-adulting.md:30-31`, weight 5) are both
  ungrounded anywhere in the course.
- **Files touched:** `src/content/lectures/week-10.mdx`,
  `src/decks/week-10.deck.mdx`.
- **Tests first (red):** None automated beyond re-running
  `spec/weekly-structure.test.ts`/`spec/voice.test.ts`.
- **Implementation (green):** Add a cooking key point (a simple,
  followable meal procedure — matches the exam's "cook a complete, edible
  meal from a provided pantry" requirement) and a cleaning-schedule key
  point (a basic recurring cleaning routine), to both `week-10.mdx`'s Body
  and `week-10.deck.mdx`.
- **Refactor:** None expected.
- **Acceptance criteria:** Both a cooking and a cleaning-schedule key point
  exist in the lecture and the deck.
- **Human review:** Render `lectures/week-10` and `decks/week-10`. Pass =
  both key points are concrete enough that Final Exam Station 5 and
  Assignment 3's cleaning criterion are no longer sprung on students
  cold, and read in-voice.
- **Depends on:** None.

### Task 17: Week 10 — replace the bare Assignment 3 budget rubric pointer

- **Description:** `week-10.mdx:61-62` ("What Assignment 3 actually wants.
  A preview of the budget component of the HD-band criteria.") and
  `week-10.deck.mdx:68-70` are bare pointers, violating the core rule's
  assignment-mention extension (requirement 23).
- **Files touched:** `src/content/lectures/week-10.mdx`,
  `src/decks/week-10.deck.mdx`, and (read-only reference)
  `src/content/assessments/assignment-3-adulting.md` for the actual budget
  criteria.
- **Tests first (red):** None automated.
- **Implementation (green):** Replace the bare pointer with the actual
  budget-related marking criteria from `assignment-3-adulting.md`,
  summarized in-voice.
- **Refactor:** None expected.
- **Acceptance criteria:** The lecture/deck text names the specific budget
  criteria from `assignment-3-adulting.md`'s marking table, not just "the
  HD-band criteria."
- **Human review:** Render `lectures/week-10`. Pass = the criteria shown
  match the assessment file's current content and read in-voice.
- **Depends on:** None (can be done in the same sitting as Task 16 since
  it touches the same files).

### Task 18: Week 11 — meetings key point; full bad email

- **Description:** `week-11.mdx`'s Body covers interviews and email but
  not meetings, though the learning outcome
  (`src/course-config.ts:74`) names all three. Separately,
  `week-11.mdx:24-26` only says the bad email is read aloud "with no
  commentary" — it's never quoted; the full text lives only in
  `sessions/week-11.md:57-77` (lecture Definitions already has an
  *Interview* term, so no interview-definition fix is needed here).
  `week-11.mdx:63-64`/`week-11.deck.mdx:70-72` ("The three-sentence rule.
  Direct handoff to the lab's shrink-down exercise.") also has no "how".
- **Files touched:** `src/content/lectures/week-11.mdx`,
  `src/decks/week-11.deck.mdx`.
- **Tests first (red):** `spec/case-study-provenance.test.ts` will fail
  once `sessions/week-11.md` is tagged `caseStudies: ["bad-email"]` before
  `week-11.mdx` is — tag the session first to observe red.
- **Implementation (green):**
  - Add a meetings key point (structured/professional conduct in
    meetings) to `week-11.mdx`'s Body and `week-11.deck.mdx`.
  - Quote the full bad email verbatim (from `sessions/week-11.md:57-77`)
    in `week-11.mdx`'s Body/Introduction, and set
    `caseStudies: ["bad-email"]` on both `week-11.mdx` and
    `sessions/week-11.md`. `week-11.deck.mdx` currently only has a
    presenter-notes stage direction to read the email aloud (lines
    21-23) — add the actual email text to the deck slide content, not
    just the presenter note.
  - Replace the bare "direct handoff" three-sentence-rule line with an
    actual concrete email-trimming technique in lecture body + deck.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/case-study-provenance.test.ts` passes for week 11.
  - The full bad email text appears in `week-11.mdx` and
    `week-11.deck.mdx` (not just a presenter note).
  - A meetings key point exists in both lecture and deck.
- **Human review:** Render `lectures/week-11` and `decks/week-11`. Pass =
  the full email retains its comic awkwardness in context, the meetings
  key point is substantive (not a token one-liner), and the trimming
  technique is concrete.
- **Depends on:** Task 1 (schema field).

### Task 19: Week 12 — update the reflections drop-rule callback text

- **Description:** `week-12.mdx:82-84` and `week-12.deck.mdx:102-106`
  currently describe the Week 12 reflection as ungraded — e.g.
  `week-12.mdx:82-84`'s actual wording is "fed directly into Assignment 3's
  daily-routine component instead of standing alone" (not the
  "reflective component" phrasing, which is `weekly-reflections.md:48-49`'s
  wording, fixed separately by Task 20) — this directly conflicts with
  requirement 19 (a real, separately-graded 12th prompt). Update both files
  to describe the new "best 10 of 12, drop worst 2" rule.
- **Files touched:** `src/content/lectures/week-12.mdx`,
  `src/decks/week-12.deck.mdx`.
- **Tests first (red):** None automated in these files directly — Task 20
  adds the mechanical assertion against `weekly-reflections.md`; this task
  just keeps the lecture/deck's own description consistent with it.
- **Implementation (green):** Replace the "not graded... folded into
  Assignment 3" text with a description matching the new rule: a twelfth
  reflection prompt, assessed the same way as the others, with the lowest
  two (not one) dropped, weighting unchanged at 15%.
- **Refactor:** None expected.
- **Acceptance criteria:** `week-12.mdx` and `week-12.deck.mdx` no longer
  state the Week 12 reflection is ungraded or folded into Assignment 3.
- **Human review:** Render `lectures/week-12` and `decks/week-12`. Pass =
  the updated text is accurate against `weekly-reflections.md` (Task 20)
  and reads naturally as part of the "closing the loop" review framing.
- **Depends on:** Task 20 (should describe the same rule Task 20
  implements — do Task 20 first or in the same sitting).

### Task 20: `weekly-reflections.md` — "best 10 of 12, drop worst 2"

- **Description:** Change the drop rule from "best 10 of 11, drop worst 1"
  (covering weeks 1–11) to "best 10 of 12, drop worst 2" (covering weeks
  1–12). The 15% weighting is unchanged — 10 counted entries either way.
- **Files touched:** `src/content/assessments/weekly-reflections.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** `spec/assessment-scheme.test.ts`'s
  `describe("weekly reflections")` block (reads
  `dist/assessments/weekly-reflections/index.html`) already has three
  tests that must change, confirmed failing against the rule change before
  it's made:
  - `"states the reflection arithmetic"` currently checks tokens
    `["11", "10", "1.5%", "15%"]` — change `"11"` to `"12"`.
  - `"publishes eleven prompts"` currently loops `week = 1..11` — change
    to `1..12` and rename the test to `"publishes twelve prompts"`.
  - `"sets week 12's prompt without grading it"` currently asserts
    `/ungraded|not graded|not marked/i` — **delete this test** (Week 12 is
    now graded like the others) and confirm `"publishes twelve prompts"`
    (updated) covers Week 12 appearing in the rendered page.
  - `"declares the drop-lowest rule"` (`/lowest/i`) needs no change — still
    true with two dropped instead of one.
  Run `pnpm test` after making only the test-file changes (before touching
  `weekly-reflections.md`) to confirm `"states the reflection arithmetic"`
  and `"publishes twelve prompts"` fail against the current content file.
- **Implementation (green):**
  - Frontmatter `description` (lines 3-5): change "Eleven short weekly
    reflections" to "Twelve short weekly reflections", consistent with the
    rest of this task's wording changes.
  - Line 20 (spec bullet): change "the lowest-scoring entry in the
    semester is dropped automatically" to describe two entries dropped.
  - Lines 25-29 (body): change "eleven weekly prompts, covering weeks
    1–11" to "twelve weekly prompts, covering weeks 1–12"; change "The
    lowest-scoring reflection is dropped" to "The two lowest-scoring
    reflections are dropped"; keep "the remaining ten are counted at 1.5%
    each — 10 × 1.5% = 15%" unchanged (the math is already correct for
    10-of-12).
  - `## The prompts` list (lines 35-45): add a twelfth bullet, "Week 12 —
    ...", in the same one-line, specific-instance style as the existing 11
    (e.g. tied to the "closing the loop" review framing Task 19 gives
    Week 12's lecture) — **required**, not optional: without it, no text
    in the file names Week 12 once lines 47-49 below are removed, and the
    renamed `"publishes twelve prompts"` test (which checks `Week 12\b`
    appears in the rendered page) fails.
  - Lines 47-49: remove the "Week 12... not graded... folded into
    Assignment 3's reflective component" text entirely, since Week 12 is
    now a real, separately-graded prompt like the others.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The file states "weeks 1–12", "twelve weekly prompts", and drops the
    two lowest, keeping the 15%/10×1.5% math intact.
  - `## The prompts` lists twelve bullets, one per week, including a real
    Week 12 entry.
  - No remaining text says Week 12 is ungraded or folded into Assignment 3.
  - The new/updated test passes.
- **Human review:** None needed — this is a factual/numeric rule change,
  fully checkable by the automated assertion above.
- **Depends on:** None.

### Task 21: Assignment 3 — close the "## The plan" / marking-table gap fully

- **Description:** `assignment-3-adulting.md`'s marking table (lines 11-35)
  has 12 weighted criteria, but "## The plan" (lines 43-69) only describes
  9 of them as bullets — a self-consistency bug in the assignment brief
  itself, bigger than just the two components originally named. Missing
  entirely: **Cleaning schedule** (weight 5), **Skincare** (weight 4),
  **Hygiene routine** (weight 14, the single largest criterion), and
  **Sleep schedule** (weight 10 — currently only implicitly touched inside
  the existing "Daily routine" bullet's "stated fallback for the night
  sleep slips" clause, not its own bullet). The file's own framing (title
  `description` line 4, spec bullet line 37, body line 45, and the "C" band
  descriptor line 93) all say "nine components", which is also wrong once
  these 4 bullets are added (13 bullets total: the existing 9 plus these
  4 — "Daily routine" itself has no matching named marking criterion and
  stays as-is, a pre-existing quirk not part of this task's fix).
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** `spec/assessment-scheme.test.ts`'s
  `describe("assignment 3 adulting")` block has
  `"requires all seven plan components"`, checking 7 regexes (`/daily
  routine/i, /laundry/i, /meal plan/i, /budget/i, /date/i, /hangout|close
  friends/i, /interview/i`). Add `/cleaning schedule/i`, `/skincare/i`,
  `/hygiene routine/i`, and `/sleep schedule/i` to that list (11 regexes
  total) and rename the test to `"requires all eleven named plan
  components"`. Confirm all four new regexes fail against the current
  rendered page before editing the content file.
- **Implementation (green):**
  - Add four new bullets to "## The plan" — "Hygiene routine", "Sleep
    schedule" (distinct from the existing "Daily routine" bullet),
    "Cleaning schedule" (grounded by Task 16's Week 10 addition), and
    "Skincare" (grounded by Task 7's Week 2 elaboration) — matching the
    style/detail level of the existing 9.
  - Update every "nine components" mention to "thirteen components": the
    title `description` frontmatter (line 4), the spec bullet (line 37,
    "all nine plan components are submitted"), the body's intro sentence
    (line 45, "covering nine components:"), and the "C" band descriptor
    (line 93, "all nine components are present").
- **Refactor:** None expected.
- **Acceptance criteria:**
  - "## The plan" now has 13 bullets, including "Hygiene routine", "Sleep
    schedule", "Cleaning schedule", and "Skincare".
  - No remaining "nine components" text anywhere in the file; all four
    locations above say "thirteen components".
  - The renamed/updated test passes.
- **Human review:** None needed beyond confirming the new bullets read
  consistently with the existing 9 (same level of detail/format), and that
  the new "Sleep schedule" bullet doesn't just duplicate the existing
  "Daily routine" fallback clause verbatim.
- **Depends on:** Task 16 (Week 10 cleaning content) and Task 7 (Week 2
  skincare content) should land first so the grounding is real, though
  this task's own file edit has no hard technical dependency.

### Task 22: Style `.course-citation-note` distinctly

- **Description:** `.course-citation-note` (rendered in both
  `src/components/References.astro` and `src/pages/references/index.astro`)
  has no CSS anywhere, so a citation's explanatory clause currently
  appears as plain inline text on the same line as the formal citation.
- **Files touched:** `src/styles/course.css` (the shared stylesheet,
  imported by `src/layouts/PageLayout.astro:4` — confirmed by reading the
  layout's imports — so a global rule here reaches both
  `References.astro` and `references/index.astro` without needing scoped
  `<style>` blocks in either).
- **Tests first (red):** A rendered-HTML test (in the style of
  `spec/references-page.test.ts`) asserting the `.course-citation-note`
  class exists in the rendered CSS bundle, or a visual check only (styling
  correctness is inherently a rendering concern) — confirm via
  `agent-browser` rather than a DOM assertion, since CSS presence in a
  built stylesheet isn't meaningfully asserted by vitest here.
- **Implementation (green):** Add CSS displaying `.course-citation-note` on
  its own line (e.g. `display: block`), in a smaller/muted style distinct
  from the citation text itself.
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm check` still passes; the citation note is
  visually distinct.
- **Human review:** Render `references/` and any lecture with a noted
  citation (e.g. `lectures/week-01` after Task 4, or `lectures/week-10`
  which already has a "trade book" note) at both marking viewports. Pass =
  the note reads as clearly secondary to the citation, on its own line or
  otherwise visually separated.
- **Depends on:** None (can land any time; benefits from Task 4 existing
  so there are two citations with notes to check against, but Week 10's
  existing "trade book" note is sufficient on its own).

### Task 23: Lectures/labs overview pages — parity + justification

- **Description:** `src/pages/lectures/index.mdx` (18 lines) has only 2
  sentences of prose — no "how it runs," highlights, or structure, unlike
  `src/pages/sessions/index.astro` (which has all three but no
  justification section). Give lectures overview the same structure as
  labs overview; add a justification section (citing Freeman et al. 2014)
  to both.
- **Files touched:** `src/pages/lectures/index.mdx`,
  `src/pages/sessions/index.astro`.
- **Tests first (red):** None automated beyond `spec/voice.test.ts`
  (re-run after drafting). If a structural test for these pages doesn't
  already exist, this is inherently a content-completeness change checked
  by Human review rather than a new assertion.
- **Implementation (green):**
  - `lectures/index.mdx`: add a "how lectures run" section, highlights
    (representative examples from actual lecture content, e.g. the 66-day
    habit citation or Jordan's Week), and a structure description
    (mirroring the 5-slot shape), matching `sessions/index.astro`'s
    existing depth.
  - Both pages: add a justification paragraph citing Freeman, Eddy,
    McDonough, Smith, Okoroafor, Jordt, & Wenderoth (2014), *Active
    learning increases student performance in science, engineering, and
    mathematics*, PNAS, 111(23), 8410–8415 — explaining why the format is
    built this way (engagement, collaboration, understanding).
- **Refactor:** None expected.
- **Acceptance criteria:** Both overview pages have equivalent sections
  (how it runs, highlights, structure, justification).
- **Human review:** Render `lectures/` and `sessions/` at both marking
  viewports. Pass = the two pages read as a matched pair in tone and
  depth, and the justification doesn't read as a bolted-on citation dump.
- **Depends on:** None.

### Task 24: Link the references page from the lectures page; back-links per week

- **Description:** No lecture-to-references link exists, and
  `references/index.astro`'s citation list has no back-links to the
  lecture that introduced each citation.
- **Files touched:** `src/pages/lectures/index.mdx`,
  `src/pages/references/index.astro`.
- **Tests first (red):** Add to `spec/references-page.test.ts` (or a new
  test) an assertion that the rendered `references/` page contains a link
  to each lecture whose citations appear there, and that `lectures/`
  contains a link to `references/`. Confirm both fail against the current
  pages.
- **Implementation (green):**
  - `lectures/index.mdx`: add a link to `/references/`.
  - `references/index.astro`: currently (lines 11-13) builds `citations`
    via `lectures.flatMap((lecture) => lecture.data.citations)`, discarding
    which lecture each citation came from, then dedupes into
    `uniqueCitations` via a `Map` keyed only on `citation.text` — so the
    lecture association isn't already tracked and must be built from
    scratch. Change the `flatMap` to carry the source lecture through
    (e.g. map each lecture's citations to `{ ...citation, lectureId:
    lecture.id }` before the flatMap/dedup), have the dedup step collect
    every lecture id a given citation text appears under (for citations
    cited in more than one lecture, e.g. Lally et al. 2010 and Kruger et
    al. 2005), and render a link to each contributing lecture's page next
    to the citation.
- **Refactor:** None expected.
- **Acceptance criteria:** The new assertions pass.
- **Human review:** None needed beyond confirming links resolve (covered
  by the automated assertion).
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` passes
- [ ] `pnpm check` passes
- [ ] Manually verified with `agent-browser` at `1920 1080` and `390 844`
      for every task carrying a Human review line
- [ ] Every requirement in §2.1 is covered — see §7
- [ ] Every task with a `Human review:` line has been shown to the user and
      explicitly accepted
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 1 (core CLAUDE.md rule) | Task 3 |
| 2 (how standing rule) | Task 3 |
| 3 (caseStudies schema field) | Task 1 |
| 4 (populate caseStudies) | Tasks 5, 10, 13, 14, 15, 18 |
| 5 (mechanical check) | Task 2 |
| 6 (Week 1 topics + how) | Task 4 |
| 7 (Week 1 desk) | Task 5 |
| 8 (Week 2 colour separation + skincare how) | Task 7 |
| 9 (Weeks 2/3/5/6/8/9/11 how-gaps) | Tasks 7, 9, 11, 12, 14, 15, 18 |
| 10 (Week 3 interview/weather/photos) | Task 9 |
| 11 (Week 4 how/Jordan's Week/fridge) | Task 10 |
| 12 (Week 5 400m figure) | Task 11 |
| 13 (Week 7 reading the room) | Task 13 |
| 14 (Week 8 incident report) | Task 14 |
| 15 (Week 9 600-word message) | Task 15 |
| 16 (Week 10 cooking + cleaning) | Task 16 |
| 17 (Assignment 3 plan bullets) | Task 21 |
| 18 (Week 11 meetings + email) | Task 18 |
| 19 (Week 12 drop rule) | Tasks 19, 20 |
| 20 (citation styling) | Task 22 |
| 21 (overview page parity) | Task 23 |
| 22 (references linking) | Task 24 |
| 23 (assignment-mention rubric content) | Tasks 8, 17 |
| 24 (Week 1 deck heading bug) | Task 6 |

## 8. Risks / open questions

None. Every ambiguity or gap surfaced during brainstorming and planning was
resolved with the user before this plan was finalized (see
`specs/2026-09-17-lecture-consistency-pass.md` §5 for the full record, and
this document's requirements list for the two items — Assignment 3's
"Skincare" gap and the pre-existing deck heading bug — found during
planning itself and folded in at the user's request). The two
implementation-detail questions flagged during drafting (where global CSS
lives; whether `spec/assessment-scheme.test.ts` already parses the
affected assessment files) were resolved during this same planning pass by
reading `src/layouts/PageLayout.astro` and `spec/assessment-scheme.test.ts`
directly — both are reflected in Tasks 20, 21, and 22 above with exact
file paths and exact test names.
