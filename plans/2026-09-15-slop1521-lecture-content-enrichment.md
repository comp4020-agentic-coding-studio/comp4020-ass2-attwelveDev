# SLOP1521 Lecture Content Enrichment

- **Date:** 2026-09-15
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-15 (via `specs/2026-09-15-slop1521-lecture-content-enrichment.md`)

## 1. Summary

The 12 SLOP1521 lecture pages currently carry only a few thin lines per
section under an old five-slot contract (`Overview`, `Content`, `Case
study`, `Reflection`, `Assessment tie-in`). This plan replaces that
contract with a new one — `Introduction`, `Definitions`, `Body`,
`In-lecture activity`, `Conclusion` — matching
`prompts/lecture-content-plan-all-weeks.md`'s own structure, rewrites all
12 lectures to it as brief, structured summaries (definitions, check-in
questions, and the in-lecture activity rendered via three new dedicated
components), adds a new `citations` frontmatter field plus a References
section per lecture and a course-wide `/references` page, and builds a
Reveal.js slide deck (via the existing `astromotion` integration) for
every week carrying the plan's full depth. `spec/weekly-structure.test.ts`,
`spec/treatment.test.ts`, `spec/voice.test.ts`, and `src/lib/topics.ts` are
updated to match the new contract, and `CLAUDE.md`'s course rule is
rewritten to describe it.

## 2. Requirements

### 2.1 Functional requirements

1. `src/content.config.ts`'s `lectures` collection schema gains
   `citations: z.array(z.object({ text: z.string(), note: z.string().optional() })).default([])`.
2. Every `src/content/lectures/week-NN.md` is converted to
   `week-NN.mdx` and rewritten with headings, in order:
   `## Introduction`, `## Definitions`, `## Body`, `## In-lecture activity`,
   `## Conclusion` — condensed summaries of
   `prompts/lecture-content-plan-all-weeks.md`'s per-week content (full
   depth moves to the matching slide deck instead).
3. `## Definitions` renders via a new `DefinitionsList.astro` component;
   each `## Body` key point pairs its summary with a new `CheckIn.astro`
   callout; `## In-lecture activity` renders via a new `ActivityBlock.astro`
   component.
4. A new `References.astro` component renders each lecture's `citations`
   array as a "References" section, appended by
   `src/pages/lectures/[slug].astro` below `<Content />` (not an authored
   markdown heading).
5. A new `src/pages/references/index.astro` page aggregates every
   lecture's `citations` array into one course-wide bibliography,
   preserving the plan's note that Warren & Warren Tyagi (2005) is a trade
   book, not a peer-reviewed paper.
6. `CLAUDE.md`'s "The weekly structure" rule is rewritten to name the new
   five lecture slots (Lab's three-slot shape is unchanged).
7. `spec/weekly-structure.test.ts`'s lecture heading list becomes
   `["Introduction", "Definitions", "Body", "In-lecture activity",
   "Conclusion"]`, in order, for every lecture; the "gives every lecture a
   named case study" test is replaced with an equivalent minimum-substance
   check against the new `Body` section.
8. `src/lib/topics.ts`'s `extractContentTopics` parses `## Body`'s
   key-point bold lead-ins instead of `## Content`'s bullets;
   `spec/treatment.test.ts`'s hardcoded "week 4 has 4 Content bullets" chip
   test is updated to match week 4's actual new key-point count (3).
9. `spec/treatment.test.ts`'s "gives the lectures table a Slides column,
   only where a deck exists" test's week-02 negative assertion (`not to
   match /at-icon-button/`) is updated once week 2 has a deck, since every
   week will have one by the end of this work.
10. `spec/voice.test.ts`'s F4 check targets the new `Introduction` section
    instead of `Overview`.
11. Every week without an existing slide deck (`src/decks/week-02.deck.mdx`
    through `week-12.deck.mdx`) gets one, following `week-01.deck.mdx`'s
    conventions, carrying the plan's full per-week depth (complete hook,
    all definitions, all key points with full citation detail, the full
    in-lecture activity, full conclusion, a references slide). Each
    lecture's `slides:` frontmatter is set to `/decks/week-0N/`.
12. `src/decks/week-01.deck.mdx` is itself rewritten to drop the banned
    "subsystem"/"regression testing" framing it currently carries (see §3)
    and to match the new heading contract and the plan's Week 1 content.
13. Where `prompts/lecture-content-plan-all-weeks.md` is thin or has a gap,
    richer content is added in the same deadpan CS-stereotype voice,
    without introducing any `spec/voice.test.ts`-banned term.
14. `pnpm check` passes once all tasks in this plan are complete.

### 2.2 Non-functional requirements

- Every new/rewritten deck is verified visually at both `1920x1080` and
  `390x844` via `agent-browser`, plus a run of astromotion's
  `astromotion-check` CLI for slide overflow, per `CLAUDE.md`'s existing
  "verify visual changes" rule.
- New components (`DefinitionsList`, `CheckIn`, `ActivityBlock`,
  `References`) must render correctly in both light and dark themes,
  consistent with the rest of the site's existing components.

### 2.3 Out of scope

- No change to the Labs (`sessions` collection) content or structure.
- No change to `WeekMeta.astro`'s spec-sheet rendering or its date
  computation.
- No fully structured citation fields (authors/year/venue/volume/pages) —
  citations stay a formatted string plus an optional note.
- No reverse link from a deck back to its lecture.
- No change to assessment due dates, weights, or any course content
  outside the 12 lectures and their decks.

### 2.4 Assumptions

- Astro's MDX content-collection rendering applies the same markdown/
  remark pipeline as `.md` files for headings, so converting
  `week-NN.md` → `week-NN.mdx` does not change how
  `spec/weekly-structure.test.ts`'s heading-regex matching sees the built
  HTML. **Verify this in Task 5** (the first `.mdx` conversion) before
  relying on it for the remaining 11 weeks — if heading rendering differs,
  return to this plan rather than improvising a workaround.
- Slide decks are excluded from `spec/voice.test.ts`'s banned-term checks
  (confirmed in `spec/voice.test.ts`'s `renderedContentPages()`, which
  skips `dist/decks`) — deck content is still written in-voice per
  `CLAUDE.md`, just not mechanically checked, so it needs the Human
  review pass called out per deck task instead.

## 3. Existing code context

**`src/content.config.ts`** (lines 63-76) — `lectures` collection:
```ts
lectures: defineCollection({
  loader: courseNodeLoader("lectures"),
  schema: courseNodeSchema
    .extend({
      week: weekSchema,
      date: z.coerce.date(),
      teachers: teacherRefs.optional(),
      slides: z.string().regex(/^\/decks\/[a-z0-9-]+\/$/).optional(),
    })
    .loose(),
}),
```
`courseNodeLoader` (line 7): `glob({ pattern: ["**/*.{md,mdx}", "!**/CLAUDE.md"], base: \`src/content/${dir}\` })` — already matches `.mdx`, no loader change needed for the `.md` → `.mdx` conversion.

**`src/content/lectures/week-01.md`** (full file read) — current frontmatter: `title`, `description`, `week: 1`, `date: 2027-02-23`, `teachers: [cosima-adjei]`, `slides: /decks/week-01/`, `related: [sessions/week-01]`. Body: `## Overview` / `## Content` (6 bullets) / `## Case study` / `## Reflection` / `## Assessment tie-in`.

**`src/content/lectures/week-04.md`** (full file read) — same shape, `## Content` has exactly 4 bullets (this is the section `spec/treatment.test.ts` line 290 hardcodes to 4 chips; the plan's new Week 4 Body has 3 key points, so that hardcoded number becomes 3).

**`src/lib/topics.ts`** (full file read):
```ts
export function extractContentTopics(body: string): string[] { … }  // line 8, matches /^## Content\n/m
export function truncateTopic(raw: string, maxWords = 4): TopicSegment[] { … }  // line 27
```
Called from `src/components/LecturesGrid.astro:33`:
`<TopicChips topics={extractContentTopics(lecture.body ?? "")} />`, and
`src/components/TopicChips.astro:15` calls `truncateTopic(topic)` per chip.
`truncateTopic`'s signature does not need to change; only what
`extractContentTopics` parses does.

**`src/components/LecturesGrid.astro`** (full file read) — table columns
Week/Date/Title/Topics/Slides; Slides column renders an icon-only
`at-icon-button` link only `{lecture.data.slides && (...)}`.

**`src/pages/lectures/[slug].astro`** (full file read) — renders, in
order: `EntryNav`, `WeekMeta`, an optional "Open the slides" button
(`lecture.data.slides`), `<Content />` (the rendered markdown/MDX body),
`TeachingTeam`, `RelatedContent`. The new `References` component is
inserted between `<Content />` and `<TeachingTeam>`.

**`spec/weekly-structure.test.ts`** (full file read) — `assertHeadingsInOrder`
(lines 71-81) takes an `html: string`, `headings: string[]`, `label:
string`; the lecture test (lines 84-93) currently passes
`["Overview", "Content", "Case study", "Reflection", "Assessment tie-in"]`.
The "gives every lecture a named case study" test (lines 95-110) uses
`findHeading`/`nextHeadingIndex` to slice the Case study section body and
asserts its stripped text is `≥ 80` chars. `TEACHING_DATES`,
week-1-to-12 coverage, and the Week 12 `/desk/i`+`/sock/i` "closes the
loop" check (lines 199-203) are unaffected by this work and must keep
passing.

**`spec/treatment.test.ts`** (full file read) — relevant tests: `"shows one
topic chip per Content bullet"` (lines 285-291, hardcodes week 4 → 4
chips); `"gives the lectures table a Slides column, only where a deck
exists"` (lines 308-323, asserts week 1's row has `at-icon-button` and
week 2's row does **not** — this negative assertion must change once week
2 has a deck); the spec-sheet `<dt>` checks (lines 220-230, Week/Date/
Lab/Reflection due — independent of markdown headings, unaffected).

**`spec/voice.test.ts`** (full file read) — `BANNED_TERMS` (lines 7-36)
includes `subsystem`, `protocol`, `debug`/`debugging`, `regression test`,
`resource allocation`, etc., checked case-insensitively with hyphens
normalized, against every rendered page **except** `dist/decks` (line 61:
`if (path === resolve("dist/decks")) continue;`) and the 404 page. F4
(lines 139-161) checks the homepage and, per lecture, the section named by
`sectionBody(html, "Overview")` (line 154) — this target string must
become `"Introduction"`. F5 (Week 9 gendered-term check, lines 163-179) is
unaffected.

**`src/decks/week-01.deck.mdx`** (full file read) — 9 Reveal.js slides via
`---` separators; uses `{/* _class: impact */}` for two punch slides, a
weighting table, a ` ```notes ``` ` fence. **Currently contains banned
voice terms** — "root-cause analysis", "regression testing", "the five
recurring subsystems" — which pass today only because decks are excluded
from `spec/voice.test.ts`; this plan rewrites this file to drop that
framing (task 12 of the requirements) alongside aligning it to the new
five-heading contract and adding a references slide.

**`spec/deck.test.ts`** (full file read) — checks (against
`dist/api/index.json` + built HTML) that at least one lecture links a
valid deck path, that every linked deck path actually built, that Week 1's
deck isn't the astromotion starter placeholder, and that the exact thesis
sentence `"Competence is a skill like any other. CS culture just never
taught you this one."` appears in Week 1's built deck HTML — this sentence
must survive the Week 1 deck rewrite verbatim.

**Deck authoring format** (`node_modules/astromotion/README.md`, verified
via the earlier research pass): `.deck.mdx` files under `src/decks/`,
routed automatically by the `astromotion` Astro integration at
`/decks/[...slug]` (no content-collection entry, no schema, no reverse
link). Frontmatter: optional `title`/`description`/`image`. Slides
separated by `---`. MDX-comment directives: `{/* _class: name */}`,
`{/* _if: name */}`, `{/* _id: name */}`, `{/* _animate */}`,
`{/* @include ./path.mdx */}`. Fenced ` ```notes ``` ` blocks become
speaker notes; ` ```comment ``` ` blocks are stripped entirely.
Background images: `![bg]`/`![bg contain/cover]`/`![bg left:50%]`. QR:
`![qr](url)`. `astromotion-check` (bundled CLI) walks every deck under
`src/decks` checking for overflow/clipping in a headless browser.

**Test setup**: `pnpm typecheck` = `astro check`; `pnpm test` = `pnpm
build && vitest run spec` (build must run first — the spec suite reads
`dist/`); `pnpm check` = `pnpm typecheck && pnpm test`. Tests for this
area live in `spec/weekly-structure.test.ts`, `spec/treatment.test.ts`,
`spec/voice.test.ts`, `spec/deck.test.ts`.

**Existing naming convention**: components live flat under
`src/components/*.astro`, PascalCase filenames, imported with relative
paths (`"../lib/topics"`, `"../../components/WeekMeta.astro"`).

## 4. Approach

**Schema and rendering infrastructure first** (Tasks 1-4): add the
`citations` field, the three structured-content components
(`DefinitionsList`, `CheckIn`, `ActivityBlock`), the `References`
component + its wiring into `[slug].astro`, and the new `/references`
page. None of these reference the old or new heading contract directly,
so each can be built, tested, and pushed independently with `pnpm check`
green throughout.

**Contract flip + per-week migration as one non-pushed-until-complete
arc** (Tasks 5-19): `spec/weekly-structure.test.ts`'s heading list is a
single assertion checked against **every** lecture at once — there is no
way to migrate 12 files one at a time against one global "all lectures
have headings X" test without an interim window where already-migrated
weeks pass and not-yet-migrated weeks still use the old headings (or vice
versa if the test flips first). Rather than introduce a temporary
dual-heading-tolerant test (a throwaway shim this project's own
conventions discourage), this plan treats the contract-flip task and all
12 per-week rewrite tasks as one cluster: local commits are made per task
for reviewability (matching the user's "one commit per week" preference),
but `pnpm check` is confirmed green — and nothing is pushed — until the
last task in the cluster (Task 19, Week 12) lands. This satisfies
`CLAUDE.md`'s literal "before **pushing**, `pnpm check` must be green"
gate without requiring every intermediate local commit to independently
pass the full suite.

**Slide decks** are orthogonal to the heading-contract window — `spec/
deck.test.ts` doesn't check heading structure, only that a linked deck
exists and (for Week 1) carries the thesis sentence — so building/
rewriting a week's deck alongside its lecture content in the same task
doesn't add to the red window described above.

**Alternative considered and rejected**: doing the contract flip as its
own isolated "foundation" commit before any per-week content migration.
Rejected because it produces the exact same red window just inverted (11
still-unmigrated weeks immediately fail the new heading assertion instead
of the old one) — there's no ordering that avoids the window, only a
choice of which direction it points, so the plan keeps the migration
grouped instead of pretending an isolated foundation commit is safe to
push on its own.

**Deck-authoring conventions, established during Task 5's human review and
binding on every deck task from here on (Tasks 6-16)** — Task 5's Week 1
deck went through a review round that surfaced five generalisable rules,
now mechanically enforced by `spec/deck.test.ts`'s "deck — authoring
conventions" block (reading each `.deck.mdx` file's raw source, not built
HTML) so a later week can't silently drift from what Week 1 established:

1. **Title slide.** `import { courseMeta } from "../course-config";` and
   `## {courseMeta.title}` on the title slide — never a hand-typed course
   title/subtitle, which drifts from `src/course-config.ts`'s canonical
   value the moment either one is edited alone.
2. **Signposting gets its own slide.** The Introduction's Signpost element
   (every week's prompts-file entry has one) is never bundled into the
   scope/"diagnostic only" slide's prose — it lands on its own `## What's
   ahead` slide, as a short bulleted list.
3. **Check-ins reuse the component.** `import CheckIn from
   "../components/CheckIn.astro";`, and every check-in question is
   `<CheckIn question="..." />` — never plain `Check-in: ...` text. (Decks
   don't load the site's `course.css`, so `src/decks/theme.css` carries a
   small `.course-check-in`/`.course-check-in-label` rule restating that
   styling against tokens `deck.css` itself declares — already added in
   Task 5, nothing further needed per week.)
4. **The reflection prompt survives in full, twice.** The new heading
   contract has no `## Reflection` slot, so the actual per-week prompt text
   (not just "a reflection is due") must still appear: as a bold-lead-in
   paragraph in the lecture's Conclusion (`**This week's reflection**, due
   ...`) and as the deck's own dedicated `## This week's reflection` slide.
   Neither location may collapse it back down to a bare "due next week"
   mention.
5. **Conclusion ends at the content.** The lecture page's Conclusion
   paragraph does not carry a sign-off sentence ("Thanks, and see you
   there.") — that reads as an unearned false ending once the reflection
   prompt (rule 4) already follows it. The deck's own closing `{/* _class:
   impact */}` "Thanks, questions?" slide is a separate, legitimate
   presenter convention and is unaffected by this rule.

A week that needs an extra "cast" slide beyond the standing per-week shape
(Week 1's staff-introduction slide, introducing the four people named in
its "Staff and policies" key point) titles that slide to match its parent
key point's `## Key point N — ...` heading exactly, rather than inventing
an untitled or differently-named slide — Reveal.js tolerates two slides
sharing one heading text (their generated `id`s are auto-deduplicated), so
this costs nothing structurally. This rule has no dedicated mechanical
check (it only applies on the handful of weeks that need an extra cast
slide at all), so it's a human-review item rather than a `deck.test.ts`
assertion.

Task 6 (Week 2) already complies with all five mechanically-checked rules
— confirmed by the same `spec/deck.test.ts` block — since it was built
after this review. Tasks 7-16 must comply from the outset rather than
retrofit; each task's own Human review step should spot-check against this
list, not just against voice/tone.

## 5. Task breakdown

### Task 1: Add `citations` field to the `lectures` schema

- **Description:** Add a typed `citations` array to the `lectures`
  collection so lecture frontmatter can carry per-week references.
- **Files touched:** `src/content.config.ts`.
- **Tests first (red):** New file `spec/citations-schema.test.ts` —
  builds a minimal fixture assertion isn't feasible pre-build (schema is
  validated at build time), so instead: add a case to the existing build-
  time flow by giving `src/content/lectures/week-01.md`'s frontmatter a
  throwaway `citations: [{ text: "Test citation." }]` entry temporarily,
  run `pnpm typecheck`, and confirm it currently succeeds only because of
  `.loose()` (passthrough, untyped) — then after the schema change,
  confirm `lecture.data.citations[0].text` is now a typed string
  accessible without a cast. Revert the throwaway fixture before
  finishing this task (Task 5 adds the real content).
- **Implementation (green):** In `src/content.config.ts`'s `lectures`
  `defineCollection`, add to the `.extend({...})` object:
  ```ts
  citations: z
    .array(z.object({ text: z.string(), note: z.string().optional() }))
    .default([]),
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm typecheck` passes.
  - `lecture.data.citations` is typed as `{ text: string; note?: string
    }[]` in `src/pages/lectures/[slug].astro` (verified by a temporary
    `.citations` access compiling without an `any`/cast).
- **Depends on:** None.

### Task 2: Build `DefinitionsList.astro`, `CheckIn.astro`, `ActivityBlock.astro`

- **Description:** Three small, dedicated components for the new
  Definitions/check-in/in-lecture-activity structured content, styled
  consistently with the rest of the site's components (matching
  `TopicChips.astro`'s prop-driven pattern) in both light and dark themes.
- **Files touched:** `src/components/DefinitionsList.astro`,
  `src/components/CheckIn.astro`, `src/components/ActivityBlock.astro`,
  `src/styles/course.css` (new rules for `.course-definitions`,
  `.course-check-in`, `.course-activity`).
- **Tests first (red):** New `spec/structured-content.test.ts` (post-
  build, mirroring `spec/treatment.test.ts`'s pattern): once Task 5 adds
  real content to at least Week 1, assert `dist/lectures/week-01/
  index.html` contains a `<dl class="course-definitions">`, at least one
  `<*  class="course-check-in">` block, and one `<* class="course-
  activity">` block. Written now as failing (no lecture uses the
  components yet), confirmed green after Task 5.
- **Implementation (green):**
  - `DefinitionsList.astro` — `Props: { definitions: { term: string;
    partOfSpeech?: string; body: string }[] }`; renders `<dl
    class="course-definitions">` with one `<dt>` (term, italicised, plus
    `(partOfSpeech)` if present) + `<dd>` (body) pair per entry.
  - `CheckIn.astro` — `Props: { question: string }`; renders a `<p
    class="course-check-in">` (or `<aside>`) with a "Check-in:" label
    prefix and the question text.
  - `ActivityBlock.astro` — `Props: { children }` (Astro slot) or `{
    title?: string }` + default slot; renders a `<div
    class="course-activity">` wrapping its slotted content.
  - CSS: a bordered/tinted block for `.course-check-in` and
    `.course-activity` using existing `--at-*` tokens (no new fixed
    colors, matching `course.css`'s existing convention of only
    referencing theme tokens); `.course-definitions dt` styled distinctly
    from body copy.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm typecheck` passes (components have valid `Props` types).
  - The three components render without runtime errors when given sample
    props (confirmed once Task 5 actually uses them).
- **Human review:** Screenshot `dist/lectures/week-01/index.html` (once
  Task 5 lands) in both light and dark theme at `1920x1080` — confirm the
  definitions list, check-in callouts, and activity block read as
  intentional, consistent structured content, not default unstyled
  markup.
- **Depends on:** None (components can be built and typechecked before
  any content uses them; the render-check test and human review complete
  once Task 5 lands).

### Task 3: Build `References.astro` and wire it into the lecture page

- **Description:** A component rendering a lecture's `citations` array as
  a "References" section, appended to every lecture page.
- **Files touched:** `src/components/References.astro`,
  `src/pages/lectures/[slug].astro`.
- **Tests first (red):** Extend `spec/structured-content.test.ts`: assert
  `dist/lectures/week-01/index.html` contains an `<h2>References</h2>` (or
  equivalent heading level matching the page's existing heading rhythm)
  followed by list items, one per `citations` entry, each containing that
  entry's `text`. Red until Task 5 populates Week 1's `citations` and this
  task wires the component in.
- **Implementation (green):**
  - `References.astro` — `Props: { citations: { text: string; note?:
    string }[] }`; if `citations.length === 0`, renders nothing; else
    renders a heading + `<ul>` with one `<li>` per citation (`text`, plus
    `note` in a secondary/italic span if present).
  - In `src/pages/lectures/[slug].astro`, import `References` and insert
    `<References citations={lecture.data.citations} />` between
    `<Content />` (line 55) and `<TeachingTeam ... />` (line 56).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm typecheck` passes.
  - Every lecture page with a non-empty `citations` array renders a
    References section; a lecture with an empty array (none exist by the
    end of this plan, but the component must not error) renders nothing.
- **Depends on:** Task 1 (schema), Task 2 (component-pattern precedent).

### Task 4: Build the course-wide `/references` page

- **Description:** A new page aggregating every lecture's `citations`
  into one bibliography, matching the plan's "Full citation list" section
  and its note that Warren & Warren Tyagi (2005) is a trade book.
- **Files touched:** `src/pages/references/index.astro` (new, following
  `src/pages/sessions/index.astro`'s exact pattern: `BaseLayout` +
  `siteConfig`, in-voice intro prose, then the listing).
- **Tests first (red):** New assertions in `spec/treatment.test.ts` (or a
  new `spec/references-page.test.ts`): `dist/references/index.html`
  exists, contains a `<ul>`/`<ol>` with one entry per unique citation
  across all 12 lectures (count asserted once Task 5-19 populate real
  citations — write this test now expecting the eventual total, marked
  pending/red until the migration cluster completes), and contains the
  Warren & Warren Tyagi trade-book note text.
- **Implementation (green):** Use `getPublishedCollection("lectures")`
  (same import as `[slug].astro:3`) to fetch all lectures, flat-map their
  `citations` arrays, dedupe by `text`, render as a `<ul>` inside
  `BaseLayout`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm typecheck` passes.
  - `/references/` builds and lists every citation once each lecture has
    one (fully satisfied only once the migration cluster, Tasks 5-19,
    completes — this task itself only needs the page and query logic
    correct against whatever citations exist at the time).
- **Depends on:** Task 1.

### Task 5: Contract flip — `CLAUDE.md`, `spec/weekly-structure.test.ts`, `spec/treatment.test.ts`, `spec/voice.test.ts`, `src/lib/topics.ts`, plus Week 1's migration

- **Description:** Flip the enforced heading contract and its dependent
  tests/parsers, and migrate Week 1 (`week-01.md` → `week-01.mdx`, plus
  its deck) as the first proof this all actually renders correctly. This
  is the task that verifies the `.mdx`-conversion assumption in §2.4 — do
  not proceed to Tasks 6-19 until this one's acceptance criteria are
  confirmed.
- **Files touched:** `CLAUDE.md`, `spec/weekly-structure.test.ts`,
  `spec/treatment.test.ts`, `spec/voice.test.ts`, `src/lib/topics.ts`,
  `src/content/lectures/week-01.md` (deleted, replaced by
  `week-01.mdx`), `src/decks/week-01.deck.mdx`.
- **Tests first (red):**
  - `spec/weekly-structure.test.ts` line 89: change the heading array to
    `["Introduction", "Definitions", "Body", "In-lecture activity",
    "Conclusion"]`. Replace the `"gives every lecture a named case
    study"` test (lines 95-110) with `"gives every lecture a substantial
    Body section"`: same `≥ 80`-char check, retargeted at the `Body`
    heading instead of `Case study`.
  - `spec/treatment.test.ts` line 285-291: rename the test to `"shows one
    topic chip per Body key point"`; change the hardcoded expectation
    from week 4 → 4 chips to week 4 → 3 chips (per the new Week 4 content
    landing in Task 8).
  - `spec/treatment.test.ts` lines 308-323: once Week 2 gets a deck
    (Task 6), the assertion `expect(week02Row).not.toMatch(/at-icon-
    button/)` becomes stale. In this task, change it to assert week 1's
    row *does* have the icon-button (unchanged) and drop the negative
    week-02 assertion entirely (it will be re-added, inverted, once every
    week has a deck — see Task 19).
  - `spec/voice.test.ts` line 154: `sectionBody(html, "Overview")` →
    `sectionBody(html, "Introduction")`; test name/log strings updated to
    match.
  - All five of the above will be **red** immediately after this task's
    edits, until this same task also migrates Week 1's content (below) —
    they should go green together at the end of this task, not before.
- **Implementation (green):**
  - `CLAUDE.md`'s "The weekly structure" section: replace
    `"Every lecture carries the same five slots, in order: **Overview**,
    **Content**, **Case study**, **Reflection**, **Assessment tie-in**
    (which may read "None this week")."` with
    `"Every lecture carries the same five slots, in order:
    **Introduction**, **Definitions**, **Body**, **In-lecture activity**,
    **Conclusion**."` (Lab's sentence is unchanged.)
  - `src/lib/topics.ts`: change `extractContentTopics`'s heading match
    from `/^## Content\n/m` to `/^## Body\n/m`; change the bullet-
    parsing loop to instead extract each key point's **bold lead-in**
    (text between the first `**...**` pair on a line starting `- ` or a
    paragraph) as the topic string, since Body's key points are written
    `**Title.** argument...` rather than plain one-line bullets. Rename
    the function's doc comment accordingly; keep the exported name
    `extractContentTopics` (used by `LecturesGrid.astro:7,33` — no
    signature change, so no caller update needed) or rename it and update
    both call sites — pick one and apply consistently; `truncateTopic`'s
    signature (line 27) is unchanged.
  - `src/content/lectures/week-01.mdx` (replacing `.md`): frontmatter
    keeps `title`, `description`, `week: 1`, `date: 2027-02-23`,
    `teachers: [cosima-adjei]`, `slides: /decks/week-01/`,
    `related: [sessions/week-01]`, plus new
    `citations: [{ text: "Lally, P., van Jaarsveld, C. H. M., Potts, H.
    W. W., & Wardle, J. (2010). How are habits formed: Modelling habit
    formation in the real world. European Journal of Social Psychology,
    40(6), 998–1009.", note: "Average 66 days to form a habit (range
    18–254)." }]`. Add at the top of the body:
    `import DefinitionsList from "../../components/DefinitionsList.astro";`,
    `import CheckIn from "../../components/CheckIn.astro";`,
    `import ActivityBlock from "../../components/ActivityBlock.astro";`
    (paths relative to `src/content/lectures/`, verify against Astro's
    MDX import resolution during this task — adjust if Astro requires a
    different relative depth or an alias).
    Body content (condensed from the plan's Week 1 section, brief):
    - `## Introduction` — 2-3 sentences: the exit-survey hook framing
      condensed to one line, the "diagnostic only" scope note, and why it
      matters (every topic this semester predicts things beyond
      university).
    - `## Definitions` — `<DefinitionsList definitions={[{term: "Baseline", partOfSpeech: "noun", body: "a starting measurement against which later change is compared."}, {term: "Cohort", partOfSpeech: "noun", body: "the group of students undertaking this course together, for statistical and moral-support purposes."}, {term: "Habit", partOfSpeech: "noun", body: "a regular behaviour or routine done automatically, with little or no conscious thought."}, {term: "Schedule", partOfSpeech: "noun", body: "a plan listing activities and the specific times they happen."}]} />`.
    - `## Body` — five short key points (lecture/lab/reflection rhythm;
      the five assessment components + HD-band teaser; staff + policies
      summary; the Lally et al. habit-formation citation; handoff to the
      Starting Point Check), each one or two sentences, each followed by
      a `<CheckIn question="..." />` using the plan's five check-in
      questions verbatim (or lightly condensed).
    - `## In-lecture activity` — one paragraph inside `<ActivityBlock>`
      describing the silent anonymous show-of-hands.
    - `## Conclusion` — condensed summary/significance/aims-met, the
      "coming up" line naming the Week 1 Lab and first reflection, thanks.
  - `src/decks/week-01.deck.mdx`: rewrite to drop "root-cause analysis",
    "regression testing", and "subsystem" framing; replace with plain
    descriptions matching the plan's voice (e.g. "the five recurring
    topics" instead of "the five recurring subsystems"); update the
    "weekly shape" slide's numbered list to the new five headings; add a
    references slide listing the Lally et al. citation; keep the exact
    thesis sentence (`"Competence is a skill like any other. CS culture
    just never taught you this one."`) verbatim on its `impact` slide, per
    `spec/deck.test.ts`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm build && vitest run spec` — every test in
    `spec/weekly-structure.test.ts`, `spec/treatment.test.ts`,
    `spec/voice.test.ts`, and `spec/deck.test.ts` passes for Week 1;
    **Weeks 2-12 will still be red at this point** (old headings) —
    expected and accepted per §4's Approach; do not treat this as a
    stopping condition, but do not push past this task until Task 19
    completes.
  - `pnpm typecheck` passes.
  - `dist/lectures/week-01/index.html` contains, in order, `Introduction`,
    `Definitions`, `Body`, `In-lecture activity`, `Conclusion` headings.
  - `dist/decks/week-01/index.html` contains the exact thesis sentence and
    no longer contains "subsystem", "root-cause analysis", or "regression
    test" (case-insensitive).
- **Human review:** Rendered `dist/lectures/week-01/index.html` and
  `dist/decks/week-01/index.html` — confirm the condensed lecture page
  reads as brief-but-complete and the deck carries the full plan detail in
  the established deadpan voice, with no CS/systems metaphor slipping back
  in outside the banned-term list's exact wording.
- **Depends on:** Tasks 1-4.

### Task 6: Week 2 — Personal Hygiene and Maintenance

- **Description:** Migrate `src/content/lectures/week-02.md` →
  `.mdx` to the new contract; build `src/decks/week-02.deck.mdx`; update
  the Slides-column test's week-02 expectation now that it has a deck.
- **Files touched:** `src/content/lectures/week-02.mdx` (new, replaces
  `.md`), `src/decks/week-02.deck.mdx` (new), `spec/treatment.test.ts`
  (the "Slides column" test: assert week 2's row now *also* has
  `at-icon-button`, alongside week 1's).
- **Tests first (red):** `spec/weekly-structure.test.ts`'s heading-order
  test for `lectures/week-02` (already updated in Task 5, currently
  failing for this week specifically); `spec/deck.test.ts`'s "builds the
  deck that lecture links" for week 2 (fails until the deck file exists
  and `slides: /decks/week-02/` is set); the updated Slides-column
  assertion above.
- **Implementation (green):**
  - `week-02.mdx` frontmatter: unchanged `title`/`description`/`week: 2`/
    `date: 2027-03-02`/`teachers: [thaddeus-vrell]`/`related`, plus
    `slides: /decks/week-02/` and
    `citations: [{ text: "Aiello, A. E., Coulborn, R. M., Perez, V., & Larson, E. L. (2008). Effect of hand hygiene on infectious disease risk in the community setting: A meta-analysis. American Journal of Public Health, 98(8), 1372–1381.", note: "Improved hand hygiene reduced gastrointestinal illness by 31% and respiratory illness by 21% across 30 pooled studies." }]`.
  - Body: `## Introduction` (fridge hook condensed, scope: showering/
    hair/deodorant/laundry/skincare only); `## Definitions` (Shower,
    Deodorant, Laundry, Haircut, Skincare — 5 entries, plan's wording);
    `## Body` — 3 key points (frequency-not-intention with the Aiello
    citation + check-in; the laundry-pile-as-schedule example + check-in;
    "good enough" previewing Assignment 1 + check-in); `## In-lecture
    activity` (the blank seven-day grid, unshared); `## Conclusion`
    (schedule-beats-feeling summary, coming up: Week 2 Lab + reflection).
  - `week-02.deck.mdx`: full depth per the plan — fridge hook, all 5
    definitions, all 3 key points with full citation detail, the seven-
    day-grid activity instructions, conclusion, references slide citing
    Aiello et al. — following §4's deck-authoring conventions (courseMeta
    title slide, a dedicated "What's ahead" signpost slide, `<CheckIn />`
    reused for every check-in, a dedicated "This week's reflection" slide
    carrying the full prompt, no lecture-page sign-off sentence).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm build && vitest run spec` — Week 2's heading order, deck-exists,
    Slides-column, and `spec/deck.test.ts`'s deck-authoring-conventions
    checks all pass.
  - Topic chips for week 2's row show 3 (one per Body key point).
- **Human review:** Same as Task 5's — rendered lecture page + deck at
  both viewports, voice/tone check.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).
- **Status:** Done — built and reviewed before §4's deck-authoring-
  conventions note was written up, but already compliant with it
  (confirmed by `spec/deck.test.ts`'s new checks); accepted by the user.

### Task 7: Week 3 — Fashion Fundamentals

- **Description:** Same migration shape as Task 6, for Week 3.
- **Files touched:** `src/content/lectures/week-03.mdx` (replaces `.md`),
  `src/decks/week-03.deck.mdx` (new).
- **Tests first (red):** Week 3's heading-order and deck-exists checks.
- **Implementation (green):** `citations: [{ text: "Adam, H., & Galinsky, A. D. (2012). Enclothed cognition. Journal of Experimental Social Psychology, 48(4), 918–925.", note: "A doctor's-lab-coat framing measurably improved sustained attention versus the same coat framed as a painter's coat — the effect needs both the physical experience of wearing it and its symbolic meaning." }]`.
  Definitions: Outfit, Dress code, Occasion (3). Body: 3 key points
  (enclothed cognition + check-in; reading an occasion; assembling from
  what you own). Activity: the two-outfit-photo vote. Deck carries full
  plan depth for Week 3.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's, for week 3; 3 topic
  chips.
- **Human review:** Same as Task 5's, for Week 3's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 8: Week 4 — Sleep, Health, and Exercise

- **Description:** Same migration shape, for Week 4 — this is the week
  `spec/treatment.test.ts`'s hardcoded chip count (updated in Task 5 to
  expect 3) must actually match.
- **Files touched:** `src/content/lectures/week-04.mdx` (replaces `.md`),
  `src/decks/week-04.deck.mdx` (new).
- **Tests first (red):** Week 4's heading-order and deck-exists checks;
  the chip-count test from Task 5 (expects exactly 3 for week 4) stays
  red until this task's Body section actually has 3 key points.
- **Implementation (green):** `citations`: two entries — Hirshkowitz et
  al. (2015) sleep-duration and Chekroud et al. (2018) exercise/mental-
  health (with its "more than 3 hours a day was worse than none" nuance
  captured in the `note`). Definitions: Bedtime, Balanced meal, Exercise
  (3). Body: exactly 3 key points (sleep duration + check-in; Jordan's
  Week worked example; exercise-as-frequency + check-in on "is more always
  better"). Activity: the bedtime pair-share. Conclusion notes Assignment
  1 due Friday 12:00 (folded in per Task 1/§4's design, replacing the old
  Assessment-tie-in slot). Deck carries full depth.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's; **exactly 3** topic
  chips for week 4 (confirms Task 5's updated hardcoded count is correct).
- **Human review:** Same as Task 5's, for Week 4's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 9: Week 5 — Touching Grass 101

- **Description:** Same migration shape, for Week 5.
- **Files touched:** `src/content/lectures/week-05.mdx` (replaces `.md`),
  `src/decks/week-05.deck.mdx` (new).
- **Tests first (red):** Week 5's heading-order and deck-exists checks;
  `spec/treatment.test.ts`'s `"links each week to its counterpart"` test
  (line 243-248) already targets week 5 specifically — confirm it still
  passes against the `.mdx` version (no content change needed there, just
  a regression check).
- **Implementation (green):** `citations: [{ text: "Berman, M. G., Jonides, J., & Kaplan, S. (2008). The cognitive benefits of interacting with nature. Psychological Science, 19(12), 1207–1212.", note: "Walking in a natural setting (or viewing pictures of nature) improved directed-attention task performance versus a busy urban walk." }]`.
  Definitions: Outdoors, Sunlight, Fresh air (3). Body: 3 key points
  (attention restoration + check-in; not-about-fresh-air contrast; handoff
  to the Lab). Activity: the look-out-the-window pause. Deck full depth.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's, plus the "links each
  week to its counterpart" regression check for week 5 passing.
- **Human review:** Same as Task 5's, for Week 5's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 10: Week 6 — Laptop and CS Separation

- **Description:** Same migration shape, for Week 6.
- **Files touched:** `src/content/lectures/week-06.mdx` (replaces `.md`),
  `src/decks/week-06.deck.mdx` (new).
- **Tests first (red):** Week 6's heading-order and deck-exists checks.
- **Implementation (green):** `citations: [{ text: "Ward, A. F., Duke, K., Gneezy, A., & Bos, M. W. (2017). Brain Drain: The Mere Presence of One's Own Smartphone Reduces Available Cognitive Capacity. Journal of the Association for Consumer Research, 2(2), 140–154.", note: "Phones on the desk — even face-down, even switched off — reduced memory and attention performance versus phones in another room; the effect scaled with how noticeable the phone was." }]`.
  Definitions: Screen-free time, Hobby (2). Body: 3 key points
  (mere-presence effect + check-in; not-a-willpower-failure; handoff to
  Week 6's Lab). Activity: the phone-urge show-of-hands. Deck full depth.
  Watch this week's prose carefully against `BANNED_TERMS` — the source
  finding is literally titled "Brain Drain," a phrase not on the banned
  list, but avoid drifting into "capacity"/"bandwidth" systems framing
  while summarizing it.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's.
- **Human review:** Same as Task 5's, for Week 6's page + deck — pay
  particular attention to voice, since this week's source material is
  itself framed in cognitive-capacity language that must be paraphrased
  into mundane terms, not lifted directly.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 11: Week 7 — Small Talk and Silence

- **Description:** Same migration shape, for Week 7.
- **Files touched:** `src/content/lectures/week-07.mdx` (replaces `.md`),
  `src/decks/week-07.deck.mdx` (new).
- **Tests first (red):** Week 7's heading-order and deck-exists checks.
- **Implementation (green):** `citations: [{ text: "Binetti, N., Harrison, C., Coutrot, A., Johnston, A., & Mareschal, I. (2016). Pupil dilation as an index of preferred mutual gaze duration. Royal Society Open Science, 3(7), 160086.", note: "Average preferred mutual gaze duration was around 3.2–3.3 seconds, consistent across a wide international sample." }]`.
  Definitions: Small talk, Eye contact (2). Body: 3 key points (comfortable
  eye-contact length + check-in; silence isn't a failure state; the
  small-talk formula). Activity: paired three-second eye contact + formula
  use. Deck full depth.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's.
- **Human review:** Same as Task 5's, for Week 7's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 12: Week 8 — Friendship and Group Communication

- **Description:** Same migration shape, for Week 8.
- **Files touched:** `src/content/lectures/week-08.mdx` (replaces `.md`),
  `src/decks/week-08.deck.mdx` (new).
- **Tests first (red):** Week 8's heading-order and deck-exists checks.
- **Implementation (green):** `citations: [{ text: "Lewicki, R. J., Polin, B., & Lount, R. B. (2016). An Exploration of the Structure of Effective Apologies. Negotiation and Conflict Management Research, 9(2), 177–196.", note: "Six components: expression of regret, explanation, acknowledgment of responsibility, declaration of repentance, offer of repair, request for forgiveness — acknowledgment of responsibility and offer of repair mattered most; request for forgiveness mattered least." }]`.
  Definitions: Apology, Group chat, Listening to someone (3). Body: 3 key
  points (the six apology components + check-in; which components matter
  most; the incident-report format). Activity: bad-apology / fix-it
  drafting split. Conclusion notes Assignment 2 due Friday 12:00. Deck
  full depth.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's.
- **Human review:** Same as Task 5's, for Week 8's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 13: Week 9 — Dating Without Documentation

- **Description:** Same migration shape, for Week 9 — this week is also
  covered by `spec/voice.test.ts`'s F5 gendered-language check, which must
  keep passing.
- **Files touched:** `src/content/lectures/week-09.mdx` (replaces `.md`),
  `src/decks/week-09.deck.mdx` (new).
- **Tests first (red):** Week 9's heading-order and deck-exists checks;
  `spec/voice.test.ts`'s `"week 9's lecture uses gender-neutral
  relationship language only"` test (line 164-170) — must stay green
  against the rewritten content (no "girlfriend"/"boyfriend"/"the girl you
  like"/"the guy you like").
- **Implementation (green):** `citations: [{ text: "Kruger, J., Epley, N., Parker, J., & Ng, Z. (2005). Egocentrism over e-mail: Can we communicate as well as we think? Journal of Personality and Social Psychology, 89(6), 925–936.", note: "Senders expected about 78% accuracy in how their intended tone would be read over text; actual accuracy was no better than chance." }]`.
  Definitions: Asking someone out, Text message, Flirting (3, gender-
  neutral wording per the plan's own phrasing). Body: 3 key points (text's
  poor tone-carrying + check-in; the 600-word message's hedges/self-
  interruptions; reading between the lines). Activity (opt-in, per the
  plan): the ambiguous "lol" poll. Reflection stays optional this week per
  the plan's own note — folded into Conclusion's coming-up line as "the
  reflection is optional this week, as always." Deck full depth, same
  gender-neutral care applied.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's, plus the F5 gendered-
  term check passing for `dist/lectures/week-09/index.html`.
- **Human review:** Same as Task 5's, for Week 9's page + deck, with
  explicit attention to gender-neutral phrasing throughout (not just the
  automated term list).
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 14: Week 10 — Basic Adulting 101

- **Description:** Same migration shape, for Week 10.
- **Files touched:** `src/content/lectures/week-10.mdx` (replaces `.md`),
  `src/decks/week-10.deck.mdx` (new).
- **Tests first (red):** Week 10's heading-order and deck-exists checks.
- **Implementation (green):** `citations: [{ text: "Warren, E., & Warren Tyagi, A. (2005). All Your Worth: The Ultimate Lifetime Money Plan. Free Press.", note: "A trade book, not a peer-reviewed paper — the genuine real-world origin of the 50/30/20 rule (50% needs, 30% wants, 20% savings/debt)." }]`.
  Definitions: Budget, Grocery list (2). Body: 3 key points (naming
  categories + check-in with the $200 worked example; the fridge priced
  out against a real grocery list; what Assignment 3's budget section
  wants). Activity: the $150 50/30/20 pair exercise. Deck full depth,
  references slide keeps the trade-book note visible.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's; the `/references` page
  (Task 4) must render this citation's trade-book note distinctly (spot-
  checked once this task lands).
- **Human review:** Same as Task 5's, for Week 10's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4).

### Task 15: Week 11 — Workplace Behaviour

- **Description:** Same migration shape, for Week 11.
- **Files touched:** `src/content/lectures/week-11.mdx` (replaces `.md`),
  `src/decks/week-11.deck.mdx` (new).
- **Tests first (red):** Week 11's heading-order and deck-exists checks.
- **Implementation (green):** `citations`: two entries — Schmidt & Hunter
  (1998) structured-interview validity, and the Kruger et al. (2005)
  citation again as an explicit callback (`note` can say "callback to Week
  9"). Definitions: Interview, Professional email (2). Body: 3 key points
  (structured beats improvised + check-in; why the bad email fails,
  linking back to Week 9's egocentrism finding; the three-sentence rule).
  Activity: the cold-call mock-interview timing exercise. Deck full depth.
- **Refactor:** None expected.
- **Acceptance criteria:** Same shape as Task 6's.
- **Human review:** Same as Task 5's, for Week 11's page + deck.
- **Depends on:** Task 5 (including its deck-authoring conventions, §4),
  Task 13 (references the Week 9 citation as a callback — Week 9 should
  already exist so the callback reads correctly, though this is a
  content-quality dependency, not a build one).

### Task 16: Week 12 — Integration, and the final Slides-column assertion

- **Description:** Same migration shape, for Week 12 — the last week, and
  the point at which the deferred "every week now has a deck" assertion
  (noted in Task 5/6) is finalized. This week is also covered by
  `spec/weekly-structure.test.ts`'s "closes the loop" check
  (`/desk/i` + `/sock/i` in the built HTML), which must keep passing.
- **Files touched:** `src/content/lectures/week-12.mdx` (replaces `.md`),
  `src/decks/week-12.deck.mdx` (new), `spec/treatment.test.ts` (finalize
  the Slides-column test: once every week has a deck, replace the
  week-1-only/week-2-negative pair of assertions from Task 5 with a loop
  asserting **every** week's row has `at-icon-button`).
- **Tests first (red):** Week 12's heading-order and deck-exists checks;
  `spec/weekly-structure.test.ts`'s "closes the loop" test (already
  passing structurally, but must be re-confirmed against the rewritten
  Week 12 content, which still needs to mention the fridge and the sock
  pile); the finalized Slides-column test (red until every week 1-12 has
  `slides:` set, which is true only once this task lands, completing
  Tasks 5-16's `.mdx` migration and Tasks 6-16's deck builds).
- **Implementation (green):** `citations`: Lally et al. (2010), as an
  explicit callback (`note`: "callback to Week 1"). Definitions: Evidence,
  contrasted with Intention (per the plan's own pairing). Body: 3 key
  points (revisiting Lally et al. honestly — 12 weeks falls short of the
  66-day average — + check-in; what actually changed and how we know,
  reusing the Then-and-Now method; closing the loop on the fridge, sock
  pile, Jordan's Week, and the 600-word message). Activity: repeating
  Week 1's anonymous show-of-hands and comparing spreads live. Conclusion
  notes no further reflection due and Assignment 3 due Friday 12:00, plus
  thanks for the semester. Deck full depth, explicitly callback-styled
  (reuses Week 1's opening slide format for the "return to the empty
  chart" bit).
  `spec/treatment.test.ts`'s Slides-column test (from lines 308-323):
  replace with a loop over `WEEK_NUMBERS` asserting every row has
  `at-icon-button`, `target="_blank"`, `rel="noopener noreferrer"`, and
  the matching `aria-label="Open slides for Week N"`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check` (full suite: `pnpm typecheck && pnpm build && vitest run
    spec`) passes with **no red tests anywhere** — this is the point at
    which the migration cluster described in §4 is complete and safe to
    push.
  - `dist/lectures/week-12/index.html` matches both `/desk/i` and
    `/sock/i`.
  - Every week 1-12's schedule-table row has a working Slides icon-link.
- **Human review:** Same as Task 5's, for Week 12's page + deck, plus a
  final read-through confirming the callback thread (fridge, sock pile,
  Jordan's Week, 600-word message, Week 1's show-of-hands) actually lands
  as a coherent closing, not just four disconnected references.
- **Depends on:** Task 5 through Task 15 (this task's acceptance criteria
  require every prior week's `.mdx`/deck to already exist).

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` (`pnpm build && vitest run spec`) passes with zero
  failures across `spec/weekly-structure.test.ts`, `spec/treatment.test.ts`,
  `spec/voice.test.ts`, `spec/deck.test.ts`, and any new spec files added
  in Tasks 2-4.
- [ ] `pnpm check` passes as the pre-push gate, confirmed only once Task
  16 lands (per §4's Approach — intermediate local commits in the
  migration cluster are not individually required to be green).
- [ ] Manually verified: every one of the 12 rewritten lecture pages and
  12 slide decks loaded in `agent-browser` at `1920x1080` and `390x844`;
  `astromotion-check` run across `src/decks` with no reported overflow.
- [ ] Every requirement in §2 is covered — see §7.
- [ ] Every task with a `Human review:` line (Tasks 2, 5-16) has been
  shown to the user and explicitly accepted.
- [ ] No item remains in §8.

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (citations schema field) | Task 1 |
| 2.1.2 (12 lectures rewritten to new headings) | Tasks 5-16 |
| 2.1.3 (Definitions/CheckIn/ActivityBlock components used) | Tasks 2, 5-16 |
| 2.1.4 (References component + wiring) | Task 3 |
| 2.1.5 (course-wide `/references` page) | Task 4 |
| 2.1.6 (`CLAUDE.md` rule rewritten) | Task 5 |
| 2.1.7 (`spec/weekly-structure.test.ts` updated) | Task 5 |
| 2.1.8 (`topics.ts` + week-4 chip-count test) | Tasks 5, 8 |
| 2.1.9 (Slides-column negative-assertion fix) | Tasks 5, 6, 16 |
| 2.1.10 (`spec/voice.test.ts` F4 retarget) | Task 5 |
| 2.1.11 (11 new decks, weeks 2-12) | Tasks 6-16 |
| 2.1.12 (Week 1 deck rewritten off banned terms) | Task 5 |
| 2.1.13 (gap-filling richer content, in-voice) | Tasks 5-16 (each task's Human review) |
| 2.1.14 (`pnpm check` passes) | Task 16 (final gate) |
| 2.2 (dual-viewport + `astromotion-check` verification) | Tasks 5-16 (each task's Human review) |
| 2.2 (component theme correctness) | Task 2 |

## 8. Risks / open questions

None.
