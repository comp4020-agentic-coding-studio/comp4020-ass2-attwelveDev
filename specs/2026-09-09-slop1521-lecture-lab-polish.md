# SLOP1521 lecture/Lab polish: reopening the measure and the flatness, richer listings

- **Date:** 2026-09-09
- **Status:** Draft
- **Approved by user:** yes — 2026-09-09

## 1. Problem / intent

The visual-treatment plan (`plans/2026-09-09-slop1521-visual-treatment.md`)
just landed a deliberately restrained handbook look: a ~68ch measure, zero
border-radius, zero shadows, gold used only as an accent. Living with it
surfaced two problems and a handful of smaller gaps, all around the
lecture/Lab pages:

1. The narrowed measure (`--at-content-width: 38rem`) makes the readable
   text column feel squeezed rather than comfortable — the plan's F3.3 call
   went a little too far.
2. The plan's flatness (F3.4: radius/shadow forced to 0/none everywhere)
   makes buttons, callouts, code spans, the search dialog, tag pills and
   the schedule tables read as bland — that restraint, applied globally,
   cost more than it needed to.
3. Lecture pages don't say "Lecture" in the title the way Lab pages say
   "Lab" (`Week N: Title` vs `Week N Lab: Title`).
4. The "Open the slides" link is a bare text link with no visual weight, no
   icon, and opens in the same tab.
5. The Lectures and Labs schedule tables (Week/Date/Title only) give no
   sense of what a given week actually covers, making it hard to find a
   specific topic or slide deck without opening every row.

This reopens two specific requirements from the just-finished plan (F3.3
and F3.4) and adds new content/UI to the lecture and Lab detail pages and
their listing tables. It does not reopen anything else the plan settled.

## 2. Requirements

### 2.1 Functional requirements

1. **R1.** `--at-content-width` changes from `38rem` to `44rem` (~78ch).
2. **R2.** `src/styles/course.css` no longer overrides `--at-border-radius`,
   `--at-shadow-sm`, `--at-shadow-md` or `--at-shadow-lg` — those tokens
   revert to the theme's own defaults everywhere they're referenced
   (buttons, callouts, code spans, the search dialog, tag pills, the nav
   icon button, form fields). No new bounding box is introduced for the
   ruled lists (`.course-list`) or spec-sheets (`.course-specsheet`) — they
   have no background/border of their own today, so this token change
   doesn't visually affect them.
3. **R3.** The Lectures and Labs schedule tables (`.course-schedule`) gain,
   as new, additive treatment (not a restoration of anything the plan
   removed — the theme's bare `<table>` never had a container of its own):
   - A bordered container around the table using the restored
     `var(--at-border-radius)` and `var(--at-shadow-sm)`.
   - A `tbody tr:hover` highlight using `var(--at-accent-soft)` (already a
     low-opacity gold tint — stays inside F3.13's "accent only" rule, no
     large gold fill).
   - Roomier cell padding than the theme default.
4. **R4.** Lecture page titles become `Week ${week} Lecture: ${title}`,
   mirroring `Week ${week} Lab: ${title}` on Lab pages exactly (same
   pattern, literal word "Lecture").
5. **R5.** The "Open the slides" link on a lecture detail page becomes an
   `.at-button--outline` (not solid — solid gold would be a large fill,
   against F3.13) carrying the iconoir `presentation` icon and its visible
   text "Open the slides", with `target="_blank" rel="noopener noreferrer"`.
6. **R6.** The Lectures table gains a **Topics** column: each lecture's
   `## Content` markdown section (a bullet list, present on all 12 lectures)
   is parsed at build time and rendered as one small chip per bullet, each
   chip hard-truncated to ~3-4 words of that bullet's text (e.g. "reading an
   occasion for…"). No new frontmatter field — this is derived from the
   existing body content, so it can't drift out of sync with it.
7. **R7.** The Labs table gains the same **Topics** column, sourced from
   each Lab's existing `spec:` frontmatter array (already structured, no
   parsing needed) instead of body content, with the same per-item
   hard-truncation to ~3-4 words.
8. **R8.** The Lectures table gains a **Slides** column: an icon-only
   button (iconoir `presentation`, `target="_blank" rel="noopener
   noreferrer"`) in the row for any lecture with `slides` set, with an
   `aria-label` naming the week (e.g. "Open slides for Week 1") since the
   button carries no visible text. Empty cell for lectures without a deck
   (currently every week except week 1). The Labs table gets no Slides
   column — Labs never carry a `slides` field.

### 2.2 Non-functional requirements

- Every icon-only interactive element (the Slides column button) has an
  accessible name — axe must stay green across all pages, matching the
  visual-treatment plan's `pnpm build` axe gate.
- `prefers-reduced-motion` support (established by the visual-treatment
  plan) must keep working — this feature doesn't touch motion/transitions
  at all, so nothing here should be able to defeat it, but a check that it
  still holds is cheap and worth doing at verification time.
- `pnpm check` green at every task boundary, same convention as the
  visual-treatment plan.

### 2.3 Out of scope

- Every other visual-treatment plan requirement not named in §1/§2 above:
  headings off brand gold (F3.2), serif headings and the tightened scale
  (F3.5/F3.6), the systems-glossary mono convention (F3.7), the
  ruled-list/table *structure* itself (F3.8/F3.9 — Lectures/Labs stay
  tables, assessments/people/homepage stay ruled lists), gold as accent
  only (F3.13, still holds — nothing here introduces a large gold fill),
  and the motion budget (F3.11/F3.12). None of these are reopened.
- No new bounding boxes/cards for `.course-list` or `.course-specsheet`
  (confirmed with the user — token restoration only, see R2).
- No new frontmatter fields on lectures or Labs (topics are derived, not
  authored, per R6/R7).
- Content changes to any lecture or Lab's prose (the `## Content` bullets
  and `spec:` items are read as-is, not rewritten to read better as
  chips).
- The homepage's `.course-tags`, the assessment/people ruled lists, and
  `TeachingTeam`'s list are unaffected — only the Lectures/Labs schedule
  tables get the new panel/hover/topics/slides treatment.

### 2.4 Assumptions (confirmed)

1. **The theme's own default `--at-border-radius`/`--at-shadow-*` values
   are acceptable once restored**, rather than picking new custom values —
   confirmed by the user choosing "just un-force the tokens" over
   specifying replacement values.
2. **Every lecture has a non-empty `## Content` bullet list and every Lab a
   non-empty `spec:` array** — not something newly verified for this spec,
   but already enforced by the existing `weekly-structure.test.ts` suite
   (`gives every lecture a named case study`, `gives every Lab a spec
   list`), so there's no empty-topics case to design a fallback for.
3. **`44rem` is the right new measure**, rather than reverting fully to the
   pre-plan `48rem` or some other value — confirmed by the user accepting
   the proposed number without adjustment.

## 3. Existing context

Read directly from source on 2026-09-09:

- `src/styles/course.css` — the visual-treatment plan's single override
  file (unlayered, imported via `astro.config.ts`'s `brandCss` and via
  `src/layouts/PageLayout.astro`). Currently sets `--at-content-width:
  38rem`, `--at-border-radius: 0`, `--at-shadow-sm/md/lg: none`. This spec
  changes exactly these declarations.
- `src/pages/lectures/[slug].astro` — builds `title = \`Week ${lecture.data.week}: ${lecture.data.title}\``
  and renders `{lecture.data.slides && <p><a href={withBase(lecture.data.slides)}>Open the slides</a></p>}`.
  Both change under R4/R5.
- `src/pages/sessions/[slug].astro` — builds
  `\`Week ${session.data.week} ${sessionLabels.singular}: ${session.data.title}\``
  (`sessionLabels.singular` = `"Lab"`, from `src/site-config.ts`) — the
  pattern R4 mirrors exactly, just with the literal word `"Lecture"`
  (lectures have no equivalent relabeling concept, so no new
  `lectureLabels` abstraction is needed).
- `src/components/LecturesGrid.astro` / `SessionsGrid.astro` — the
  Week/Date/Title schedule tables built in the visual-treatment plan's
  Task 4. Both only read frontmatter today (`getPublishedCollection`,
  no `render()` call) — R6's topic parsing is new capability for
  `LecturesGrid.astro` specifically, since it needs the raw body content,
  not just frontmatter.
- `src/content.config.ts` — `lectures.slides` is
  `z.string().regex(/^\/decks\/[a-z0-9-]+\/$/).optional()`; only
  `src/content/lectures/week-01.md` sets it today (Plan 2's "one of them
  carries a real deck"). `sessions` has no `slides` field at all.
  `assessments`/`sessions` share the `courseNodeSchema` base which likely
  carries `spec` — confirmed sessions already validate a non-empty
  `spec: string[]` per `weekly-structure.test.ts`.
- `node_modules/astro-theme-university/components/Icon.astro` — wraps
  `astro-icon`'s `Icon` component, takes an iconoir name (`iconoir:` prefix
  added internally), an optional `size`, and an `aria-label` prop that
  switches it from decorative (`aria-hidden`) to a labelled `role="img"`.
- `node_modules/@iconify-json/iconoir/icons.json` — confirmed the
  `presentation` icon name exists (also `presentation-solid`,
  `open-new-window`, `new-tab`, `arrow-up-right` as alternatives, not used
  here per the user's choice of a single icon).
- `node_modules/astro-theme-university/styles/components.css` — `.at-button`,
  `.at-button--outline`, `.at-button--ghost`, `.at-button--small/--large`
  already exist and reference `var(--at-border-radius)` and
  `var(--at-accent)`/`var(--at-accent-soft)`, so R3's hover and R5's
  button both ride existing theme tokens rather than inventing new ones.
- `node_modules/astro-theme-university/styles/base.css` — confirmed the
  bare `<table>`/`.at-table-wrap` rules carry no `border-radius`/`box-shadow`
  reference at all (only `code`, `pre`, form fields, `.at-icon-button` and
  fieldsets reference `var(--at-border-radius)`) — so R3's table panel is
  additive, not a restoration.
- `spec/treatment.test.ts` — asserts the exact values this spec changes:
  `--at-content-width:38rem`, a `--at-border-radius:0` match, and
  `--at-shadow-sm/md/lg:none` matches. These assertions must be updated
  (not just the CSS) or `pnpm check` breaks on this spec's very first task.
- Sample lecture bodies read in full (`week-01`, `week-03`, `week-04`,
  `week-05`, `week-07`, `week-08`, `week-10`, `week-12`): every lecture has
  `## Overview` → `## Content` (3-4 bullets) → `## Case study` → `##
  Reflection` → `## Assessment tie-in`, in that order, enforced by
  `weekly-structure.test.ts`'s `assertHeadingsInOrder`. The `## Content`
  bullets are full clauses (10-20 words), not short tag-words — the reason
  R6 hard-truncates rather than rendering full text.
- Sample Lab bodies read (`week-01`, `week-02`, `week-06`, `week-08`
  sessions): `## Before the Lab` → `## In the Lab` → `## Afterwards`, prose
  paragraphs, not bullet lists — confirmed there's no clean equivalent to
  lectures' `## Content` bullets, which is why R7 sources Labs' topics from
  `spec:` instead of the body.

## 4. Design

**R1 (measure):** one-line change in `src/styles/course.css`:
`--at-content-width: 44rem;`.

**R2 (token restoration):** delete the `--at-border-radius`,
`--at-shadow-sm`, `--at-shadow-md`, `--at-shadow-lg` lines from
`src/styles/course.css`'s `:root` block entirely, letting
`@layer at.tokens` (theme defaults) apply again everywhere those tokens are
referenced.

**R3 (schedule table panel):** in `src/styles/course.css`, wrap
`.course-schedule` with a border + `box-shadow: var(--at-shadow-sm)` +
`border-radius: var(--at-border-radius)` (now restored by R2), add
`tbody tr:hover { background: var(--at-accent-soft) }` scoped to
`.course-schedule`, and increase `th`/`td` padding beyond the theme
default. Kept scoped to `.course-schedule` specifically — not a generic
`table` rule — so markdown tables elsewhere (e.g. the marking-criteria
table, which the visual-treatment plan deliberately left as the theme's
bare ruled style) are unaffected.

**R4 (lecture title):** one-line change in
`src/pages/lectures/[slug].astro`:
`` const title = `Week ${lecture.data.week} Lecture: ${lecture.data.title}`; ``

**R5 (slides button):** replace the bare `<a>` in
`src/pages/lectures/[slug].astro` with an `.at-button--outline` carrying
`<Icon name="presentation" />` before the text "Open the slides",
`target="_blank"`, `rel="noopener noreferrer"`.

**R6 (Lectures topics):** `LecturesGrid.astro` needs each lecture's raw
body text to find the `## Content` section's bullets. The concrete parsing
approach (regex over `entry.body` vs. a remark/AST pass) is left to
`plan-feature` to choose against the actual `astro:content` API surface —
this spec fixes the *behaviour* (extract the bullet list under the
`## Content` heading, truncate each to ~3-4 words, render as small chips
styled like the homepage's `.course-tags`), not the parsing mechanism.

**R7 (Labs topics):** `SessionsGrid.astro` reads `session.data.spec`
directly (already an array of strings, no parsing) and renders the same
truncated-chip treatment as R6.

**R8 (Slides column):** in `LecturesGrid.astro`'s table, a new `<th>Slides</th>`
column; each row renders the same icon-only `.at-button`/`presentation`
icon pattern as R5 when `lecture.data.slides` is set, otherwise an empty
cell — not a placeholder dash, since most rows will be empty until more
decks exist and a dash on every row would be noisier than blank.

**Alternative considered and rejected — full-text chips (no truncation):**
would need cell widths and row heights to grow substantially for a 3-4 item
list, undermining the "table, not a card" shape Task 4 of the
visual-treatment plan established; rejected in favour of truncation.

**Alternative considered and rejected — a new `topics:` frontmatter field:**
would read cleanly as chips with no truncation, but creates a second
source of truth alongside the `## Content` prose (lectures) that could
drift out of sync over time, and is 24 files of new manual authoring;
rejected in favour of deriving topics from what already exists.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | Ambiguity | "Side margins are narrow" could mean a regression, a squeezed text column, or excess dead whitespace | Confirmed: the readable measure itself feels squeezed — a reaction to the plan's deliberate F3.3 change, not a bug |
| 2 | Contradiction (surfaced, then resolved) | "Bland tables" complaint sits in direct tension with the just-finished plan's F3.4 (no shadows/radius) and F3.13 (gold as accent only) | User chose to reopen F3.4 (tokens only, not new bounding boxes) while explicitly keeping F3.13 intact |
| 3 | Gap | Labs have no bullet-list section equivalent to lectures' `## Content` | Confirmed: source Labs' topics from the existing `spec:` array instead |
| 4 | Ambiguity | "Site-wide" radius/shadow reopening could mean restoring tokens only, or reintroducing bounded boxes for ruled lists too | Confirmed: tokens only — ruled lists and spec-sheets are untouched, since they have no box for radius/shadow to apply to |
| 5 | Gap | Topic bullets are full clauses, not short tag-words, so "chips" don't fit the data shape cleanly | Confirmed: hard-truncate each to ~3-4 words rather than adding a new curated-label field |
| 6 | Gap | Icon-only Slides-column button has no visible text | Resolved in design: `aria-label` naming the week, matching the accessible-icon pattern `Icon.astro` already supports |
| 7 | Gap | `spec/treatment.test.ts` hard-asserts the exact values (`38rem`, `0`, `none`) this spec changes | Named explicitly in §3/§4 so planning updates the assertions alongside the CSS, not after |
| 8 | Assumption | Theme's own default radius/shadow values (not new custom ones) are what "restore" means | Confirmed by the user's choice in the visual-proposal question |

## 6. Handoff notes for planning

- This is a **direct continuation of, and partial reversal of,** the
  visual-treatment plan. `plan-feature` should read
  `plans/2026-09-09-slop1521-visual-treatment.md` in full before planning —
  particularly Task 1 (measure/tokens), Task 4 (schedule tables), and §3.3
  (cascade layers) and §3.4 (fixed vs. ours) framing, since this feature
  edits the same file (`src/styles/course.css`) that plan built.
- **Sequencing hint:** the CSS token changes (R1/R2/R3) and the existing
  `spec/treatment.test.ts` assertions they invalidate are tightly coupled —
  plan them as one task, red/green together, not as separate before/after
  steps.
- **Must not be re-litigated:** the decision to keep F3.13 (gold as accent
  only) intact, and to not reintroduce bounding boxes for ruled
  lists/spec-sheets. Both were explicitly probed and settled in this
  conversation (see §5, rows 2 and 4) — a plan that reopens either is
  drifting from what was agreed, not filling in a gap.
- **Risk knowingly accepted:** R6's body-parsing approach for lecture
  topics is a new kind of build-time logic this codebase doesn't have yet
  (`LecturesGrid.astro` has only ever read frontmatter). `plan-feature`
  should scope this as its own task with its own red/green cycle, since
  it's the one piece of new *mechanism* in an otherwise mostly
  CSS-and-markup feature.
- **PROCESS.md** is the user's own account, same as every other plan in
  this repo — not touched here.
