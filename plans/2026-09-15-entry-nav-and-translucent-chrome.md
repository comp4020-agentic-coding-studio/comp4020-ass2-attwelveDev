# Prev/next navigation for Labs, Assessments, People + translucent chrome

- **Date:** 2026-09-15
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-15 (locked via the
  `brainstorm-feature` skill in this same conversation; no `specs/` file was
  written since the design was fully stated in the brainstorm's Phase 4
  summary — see that summary for the full back-and-forth)

## 1. Summary

Lecture pages already have a sticky prev/next navigation header
(`src/components/WeekNav.astro`, built under
`plans/2026-09-15-slop1521-week-nav-header.md`) that shows "Week N — Title"
links either side of the current page, with a center label that fades in on
scroll. This feature extends that same header — same sticky positioning,
same scroll-triggered crossfade, same mobile behaviour — to Lab, Assessment,
and People detail pages, and generalises its ordering so prev/next always
matches whatever order that content type's own overview page renders (a
plain `week ± 1` lookup, which is all the lecture nav does today, cannot
express "the same order as the People overview page", since People are
ordered by role then name, not by week). Separately, this feature gives that
nav header, the site-wide top nav bar, and the search dialog a shared
translucent, blurred background instead of their current fully opaque one.

## 2. Requirements

### 2.1 Functional requirements

1. Lecture detail pages (`src/pages/lectures/[slug].astro`) keep a prev/next
   nav header with "Week N — Title" labels on both sides and the center
   label, sticky/crossfade/mobile behaviour unchanged from today — but its
   prev/next are now computed by walking `LecturesGrid.astro`'s own sorted
   list (by `date` ascending) rather than by `week ± 1` lookup.
2. Lab detail pages (`src/pages/sessions/[slug].astro`) gain the same nav
   header, with "Week N — Title" labels (Labs have a `week` field, same as
   Lectures), ordered exactly as `SessionsGrid.astro` sorts (`week`
   ascending) — currently no nav header exists there at all.
3. Assessment detail pages (`src/pages/assessments/[slug].astro`) gain the
   same nav header, but the primary/center label is the assessment's title
   alone ("Assignment 1", "Final Exam", ...) — no week prefix — ordered
   exactly as `AssessmentsGrid.astro` sorts (`week` ascending, including its
   existing tie-break behaviour when two entries share a week).
4. People detail pages (`src/pages/people/[slug].astro`) gain the same nav
   header, with the primary/center label being the person's name and — when
   they have a mapped role — a role subtitle (mirroring how Lectures/Labs
   show a subtitle), ordered exactly as `PeopleGrid.astro` sorts (role bucket
   — convenor, tutor, guest, other — then name, alphabetically).
5. On every one of the four page types, the first entry in that type's order
   shows no "previous" side and the last shows no "next" side, without
   breaking the header's centered layout (same reserved-space technique the
   lecture nav already uses).
6. Each of the four collections' navigation order is produced by one shared
   function per collection (`src/lib/entry-order.ts`), and each overview Grid
   component is refactored to call that same function for its own list
   rendering, so the nav and the overview page cannot independently drift
   apart.
7. Draft/unpublished entries are excluded from every ordering and are never
   offered as a prev/next neighbour, matching what `getPublishedCollection`
   already hides from each overview page.
8. The nav header (`.week-nav`), the site-wide top nav bar (`.at-nav`), and
   the search dialog panel (`.at-search-panel`) all render with the same
   translucent, blurred background (same alpha value, same blur radius)
   instead of their current fully opaque background, correctly in both light
   and dark mode via the existing `light-dark()`/token mechanism (no
   hardcoded colours).

### 2.2 Non-functional requirements

- Visual changes (translucency/blur, and the new nav header's layout on Lab/
  Assessment/People pages) must be verified with `agent-browser` at both
  marking viewports (1920×1080 and 390×844) before this plan is considered
  done — per this project's working method ("the render is the truth, not
  the source").
- No regression to the existing lecture nav's interaction mechanics: the
  sticky offset under `var(--at-nav-height)`, the 12px scroll hysteresis, the
  200ms center-label crossfade, and the mobile-only collapse/reappearance
  sequencing (200ms delay on reappearance only) must all behave exactly as
  they do today — `spec/week-nav.test.ts` must keep passing unmodified.
- `.at-nav` and `.at-search-panel` live in the external `astro-theme-university`
  package (not this repo's `src/`) and must never be hand-edited; all styling
  changes to them go through this repo's own `src/styles/course.css`, which
  is deliberately unlayered so it already beats every theme rule (`@layer
  at.tokens, at.base, at.components`) without needing `!important` (see that
  file's own header comment).
- `pnpm check` (`astro check` + `astro build` + `vitest run spec`) must stay
  green throughout.

### 2.3 Out of scope

- No visual or ordering change to the overview/Grid pages themselves
  (`LecturesGrid.astro`, `SessionsGrid.astro`, `AssessmentsGrid.astro`,
  `PeopleGrid.astro` keep rendering exactly what they do today — only their
  internal sort call is refactored to call the shared helper instead of
  inlining it).
- No `prefers-reduced-transparency` or `prefers-contrast` handling — not
  requested, and no existing precedent for it in this theme.
- No change to `WeekMeta.astro` or any other component that still legitimately
  uses `week ± 1`-style reasoning outside of navigation ordering.
- No change to how the `people` collection's `role` field is stored or typed
  — it stays the existing free-string convention (`convenor`/`tutor`/`guest`/
  `other`), used here only for sorting and the subtitle label.
- No new accessibility affordances beyond what the existing build/test setup
  already checks.

### 2.4 Assumptions

- Lectures are ordered, for navigation purposes, by `LecturesGrid.astro`'s
  actual current sort — `date` ascending — not by the `week` field. This
  differs from what the original brainstorm assumed ("week ascending", by
  analogy with Sessions/Assessments) but was confirmed by reading the file
  directly (`src/components/LecturesGrid.astro:10`). It coincides with week
  order today only because the two happen to be monotonic together; the
  design principle already agreed with the user — "the nav follows each
  Grid's own sort exactly" — already covers this, so it does not change any
  approved requirement and was not re-opened with the user.
- Where two assessments share a `week` value (`assignment-3-adulting` and
  `final-exam` are both `week: 12`), `Array.prototype.sort`'s stability means
  the tie-break order is whatever order `getPublishedCollection("assessments")`
  yields before sorting — effectively the content loader's own enumeration
  order. Rather than guess or hardcode that order, the new tests for
  Assessment navigation read the actual link order rendered on
  `dist/assessments/index.html` and assert the nav reproduces exactly that
  adjacency — this is also the most direct possible check of requirement
  2.1.3 ("ordered exactly as the Assessments overview page").
- The CSS class names and data attributes inherited from `WeekNav.astro`
  (`week-nav`, `week-nav-link`, `week-nav-side--prev`/`--next`,
  `data-week-nav-current`, etc.) are kept unchanged even though the component
  is renamed and generalised. Renaming them would only churn the currently-
  green `spec/week-nav.test.ts` and the component's own CSS for no
  user-facing benefit — the component's *file* is renamed to `EntryNav.astro`
  since it is no longer week-specific, but its rendered class names are not.

## 3. Existing code context

### 3.1 The current lecture nav (`src/components/WeekNav.astro`, 333 lines, read in full)

```astro
interface Props {
  week: number;
  title: string;
}
const { week, title } = Astro.props;
const lectures = await getPublishedCollection("lectures");
const previous = lectures.find((entry) => entry.data.week === week - 1);
const next = lectures.find((entry) => entry.data.week === week + 1);
```

Renders (relevant markup, exact strings that `spec/week-nav.test.ts` depends
on):

- `<div class="week-nav-sentinel" aria-hidden="true"></div>` immediately
  before `<nav class="week-nav" aria-label="Week navigation">`.
- Each side: `<div class="week-nav-side week-nav-side--prev">` /
  `--next`, containing (when present) exactly
  `<a class="week-nav-link" href="...">` wrapping an `Icon`, a
  `<span class="week-nav-text">` containing `<span class="week-nav-title">`
  and `<span class="week-nav-subtitle">`.
- Center label: `<p class="week-nav-current" data-week-nav-current>Week {week}
  — {title}</p>`.
- `<style>`: `.week-nav { position: sticky; inset-block-start:
  var(--at-nav-height); z-index: 90; background: var(--at-bg); border-block-end:
  1px solid var(--at-divider); overflow-anchor: none; }`, plus the
  `.week-nav-sentinel` `overflow-anchor: none` fix, the permanent `max-width:
  50%` reservation on `.week-nav-current`, and a `@media (width <= 768px)`
  block handling the mobile collapse (title `max-width`/opacity transitions,
  side `min-width` floor with a 200ms-delayed reappearance).
- `<script>`: an `astro:page-load` listener (`setupWeekNav`) that builds an
  `IntersectionObserver` on `.week-nav-sentinel` with `HYSTERESIS_PX = 12`,
  toggling `.is-visible` on `[data-week-nav-current]` and `.is-scrolled` on
  `.week-nav`.

None of the above changes in this feature except: the `Props` interface, the
prev/next computation (now supplied by the caller, not computed inside the
component), and the component's own file name.

### 3.2 Pages that currently use it, and the three that don't

- `src/pages/lectures/[slug].astro` — imports `WeekNav` from
  `"../../components/WeekNav.astro"`, renders
  `<WeekNav week={lecture.data.week} title={lecture.data.title} />`
  immediately after `<ContentLayout ...>` opens, before `<WeekMeta ... />`.
  Also imports `withBase` from `"astro-theme-university/url"` already (used
  for the slides link).
- `src/pages/sessions/[slug].astro` — **no nav header today**. Imports
  `getPublishedCollection`, `RelatedContent`, `SpecList`, `ContentLayout`,
  `TeachingTeam`, `WeekMeta`; does **not** currently import `withBase`.
  Renders `<WeekMeta week={session.data.week} date={session.data.date}
  kind="lab" />` as its first child inside `<ContentLayout>`.
- `src/pages/assessments/[slug].astro` — **no nav header today**. Imports
  `getPublishedCollection`, `RelatedContent`, `SpecList`, `Callout`,
  `ContentLayout`, `MarkingModel`, `formatCourseDate`; does **not** currently
  import `withBase`. First children inside `<ContentLayout>` are the
  conditional draft `<Callout>` and the due/weight `<p>`.
- `src/pages/people/[slug].astro` — **no nav header today**. Imports
  `getPublishedCollection`, `ContentLayout`; does **not** currently import
  `withBase`. Already computes a `roleLabels` map inline:
  ```ts
  const roleLabels: Record<string, string> = {
    convenor: "Convenor",
    tutor: "Tutor",
    guest: "Guest lecturer",
    other: "",
  };
  const roleLabel = person.data.role ? roleLabels[person.data.role] : undefined;
  ```
  (note `other` maps to `""`, an empty string, which is falsy — treat as "no
  subtitle" rather than rendering an empty subtitle span).

### 3.3 The four overview Grids and their exact current sort calls

- `src/components/LecturesGrid.astro:10` —
  `const visible = lectures.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());`
- `src/components/SessionsGrid.astro:8` —
  `const visible = sessions.sort((a, b) => a.data.week - b.data.week);`
- `src/components/AssessmentsGrid.astro:7` —
  `const visible = assessments.sort((a, b) => a.data.week - b.data.week);`
- `src/components/PeopleGrid.astro:7-37` —
  ```ts
  const roleOrder: Record<string, number> = { convenor: 0, tutor: 1, guest: 2, other: 3 };
  const visible = people.sort((a, b) => {
    const ra = roleOrder[a.data.role ?? "other"] ?? 99;
    const rb = roleOrder[b.data.role ?? "other"] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.data.title.localeCompare(b.data.title);
  });
  ```
  (`PeopleGrid.astro` also has its own local `roleLabels` map, identical in
  shape to the one already in `people/[slug].astro`.)

All four call `getPublishedCollection(<collection>)` first
(`astro-course-university/content`), then `.sort()` in place (mutating and
returning the same array — `Array.prototype.sort` sorts in place).

### 3.4 `getPublishedCollection` (from `astro-course-university/content-helpers.ts`, re-exported as `astro-course-university/content`)

```ts
export async function getPublishedCollection<C extends CollectionKey>(
  collection: C,
  filter?: (entry: CollectionEntry<C>) => boolean,
): Promise<CollectionEntry<C>[]>
```

Drops `published: false` entries in production builds only (dev keeps them
visible). Already the single choke point every Grid and every `[slug].astro`
page uses to fetch a collection.

### 3.5 Content schemas (`src/content.config.ts`, read in full)

- `sessions`, `assessments`, `lectures` all extend `courseNodeSchema` with a
  shared `week: z.coerce.number().int().min(1).max(12)`.
- `assessments` additionally has `due: z.coerce.date()`,
  `weight: z.coerce.number().positive().max(100)`.
- `lectures` additionally has `date: z.coerce.date()`, optional `teachers`,
  optional `slides`.
- `people` is a separate, non-`courseNodeSchema` object: `title`,
  `description`, `role: z.string().trim().min(1)` (free string; `convenor`/
  `tutor`/`guest`/`other` are the only values used in practice —
  `PeopleGrid.astro` and `people/[slug].astro` both already default missing/
  unknown roles to `"other"`/undefined-label rather than rejecting them),
  optional `contact`/`affiliation`/`email`/`url`/`photo`/`photoAlt`,
  `published` (default `true`).
- No collection has a generic `order`/position field — all list order lives
  in each Grid's own `.sort()` call today.

### 3.6 Real content fixtures (verified by reading every file, used to write exact test assertions)

- **Sessions ("Labs")**: `week-01.md` … `week-12.md`, one per week, no ties.
- **Assessments** (`src/content/assessments/*.md`, sorted by `week`):
  `weekly-reflections` (week 1) → `assignment-1-makeover` (week 4) →
  `assignment-2-touch-grass` (week 8) → **tie at week 12**:
  `assignment-3-adulting` and `final-exam`. The tie-break must be read from
  the built `dist/assessments/index.html` link order, not assumed (see
  §2.4).
- **People** (`src/content/people/*.md`, 4 entries, no role/name ties):
  `cosima-adjei` (role `convenor`, title "Cosima Adjei") →
  `noor-kalantari` (`tutor`, "Noor Kalantari") →
  `petra-lindqvist` (`tutor`, "Petra Lindqvist") →
  `thaddeus-vrell` (`tutor`, "Thaddeus Vrell") — alphabetical among the three
  tutors already gives this exact order (N < P < T).

### 3.7 Site-wide nav bar and search dialog (external `astro-theme-university` package, not in this repo's `src/`)

- `components/Nav.astro` renders `<nav class="at-nav" aria-label="Main">`
  wrapping `<div class="at-nav-inner">` and, when `search` is true (the
  default), `<SearchDialog basePath={...} />`.
- `components/SearchDialog.astro` renders `<dialog class="at-search-dialog"
  ...><div class="at-search-panel">...</div></dialog>`.
- `styles/components.css` (current, relevant rules, read in full):
  ```css
  .at-nav {
    grid-column: full;
    display: grid;
    grid-template-columns: subgrid;
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--at-bg);
    border-block-end: none;
  }
  .at-search-dialog {
    border: none;
    background: transparent;
    ...
  }
  .at-search-dialog::backdrop { background: rgb(0 0 0 / 50%); }
  .at-search-panel {
    background: var(--at-bg-elevated);
    border: 1px solid var(--at-divider);
    border-radius: calc(var(--at-border-radius) * 5 / 3);
    box-shadow: var(--at-shadow-lg);
    overflow: hidden;
  }
  ```
  No `backdrop-filter` anywhere in this stylesheet today.
- `styles/tokens.css` resolves `--at-bg` and `--at-bg-elevated` via
  `light-dark(oklch(...), oklch(...))`, keyed off `color-scheme`, with a
  `[data-theme="dark"]` override block elsewhere in the same file — so a
  `color-mix()` over either token, or a `light-dark()` expression, stays
  theme-correct in both modes without new machinery.

### 3.8 This repo's own override stylesheet (`src/styles/course.css`, loaded via `src/layouts/PageLayout.astro:4` — `import "../styles/course.css";`)

Its own header comment: *"SLOP1521 handbook treatment. Unlayered, so it beats
every theme rule (`@layer at.tokens, at.base, at.components`) without
`!important` — see `plans/2026-09-09-slop1521-visual-treatment.md` §3.3."*
It already overrides a theme class this way today:
```css
.at-nav-inner {
  grid-column: full;
  max-width: 48rem;
  margin-inline: auto;
}
```
This is the established, working precedent for styling theme classes from
this repo without touching the vendored package — the new translucency rules
go here too.

### 3.9 Test setup

- Test command: `pnpm test` → `astro build && vitest run spec` (tests read
  the **built** `dist/` output, not source — see `spec/README.md` and every
  existing spec file). `pnpm check` runs `astro check` (typecheck) then
  `pnpm test`.
- `spec/week-nav.test.ts` (89 lines, read in full) — the exact existing
  assertions this plan must not break, keyed on literal class-name strings
  (`class="week-nav-link"`, `class="week-nav-side week-nav-side--prev"`,
  `data-week-nav-current`) and on lecture weeks 1/6/12 specifically.
- `spec/treatment.test.ts` already has a `bundledCss()` helper (reads
  `dist/_astro/*.css` chunk files concatenated with every inlined `<style>`
  block in `dist/index.html`, since `course.css` is injected inline via
  Astro's `brandCss` mechanism rather than extracted to its own chunk) — the
  established pattern for asserting a CSS custom property or declaration
  actually shipped. New translucency tests reuse this same technique (each
  spec file defines its own small local copy of this helper — that's the
  existing convention; no shared test-utils module exists to import it from).
- `spec/cast.test.ts` confirms exactly 4 people, 1 convenor + 3 tutors, no
  ties to worry about.
- No existing spec file asserts Grid list order today, so refactoring the
  four Grids' sort calls to a shared helper (Task 2) carries no risk of
  breaking a currently-passing assertion.

## 4. Approach

One new pure-logic module, `src/lib/entry-order.ts`, becomes the single
source of truth for "what order does this collection's overview page show
its entries in": one `sorted*()` function per collection (each just
`getPublishedCollection` + the exact `.sort()` already in that collection's
Grid, moved here verbatim) plus one generic `neighbors()` function that,
given a sorted array and a current entry's `id`, returns
`{ previous?, next? }` by array index. Every Grid is refactored to call its
`sorted*()` function instead of inlining the same sort, and every
`[slug].astro` page calls the same function plus `neighbors()` to build its
nav header's data — so the overview page and the nav header are
structurally incapable of disagreeing about order.

`WeekNav.astro` is renamed to `EntryNav.astro` and its `Props` are
generalised from `{ week, title }` (which it used to look up its own
prev/next internally) to `{ previous?, next?, currentLabel }`
(`previous`/`next` being `{ href, primaryLabel, subtitleLabel? }`) — the
component becomes a pure renderer of whatever nav data its caller computed;
it no longer knows about collections, weeks, or `getPublishedCollection` at
all. This was chosen over keeping per-type variants of the header (rejected:
would duplicate the entire sticky/crossfade/mobile mechanism four times) and
over keeping `week ± 1` for the three week-numbered types and only building
list-walk logic for People (rejected by the user during brainstorming,
precisely because it leaves two divergent ordering mechanisms to maintain).

Translucency is added as three new rules in `src/styles/course.css` (already
the established override point for theme classes — §3.8), keyed off two new
custom properties (`--course-chrome-alpha`, `--course-chrome-blur`) so all
three surfaces share the literal same values, each `color-mix()`'d over that
surface's own existing background token (`--at-bg` for `.week-nav`/`.at-nav`,
`--at-bg-elevated` for `.at-search-panel`, preserving the elevation
difference the theme already encodes) rather than one hardcoded colour.

## 5. Task breakdown

### Task 1: `neighbors()` pure helper + unit tests

- **Description:** Add the generic, collection-agnostic prev/next lookup
  that every page will use, with a standalone unit test that needs no Astro
  build (it's a plain function over plain arrays).
- **Files touched:** new `src/lib/entry-order.ts`; new
  `spec/entry-order.test.ts`.
- **Tests first (red):** `spec/entry-order.test.ts`, plain `vitest` (no
  `dist/` dependency):
  - `"returns both neighbours for a middle entry"` — given
    `[{id:"a"},{id:"b"},{id:"c"}]` and current `"b"`, expects
    `{ previous: {id:"a"}, next: {id:"c"} }`.
  - `"omits previous for the first entry"` — current `"a"` → `previous`
    is `undefined`, `next` is `{id:"b"}`.
  - `"omits next for the last entry"` — current `"c"` → `next` is
    `undefined`.
  - `"returns both undefined when the id isn't in the list"` — current
    `"z"` → `{ previous: undefined, next: undefined }`.
- **Implementation (green):**
  ```ts
  export function neighbors<T extends { id: string }>(
    sorted: T[],
    currentId: string,
  ): { previous?: T; next?: T } {
    const index = sorted.findIndex((entry) => entry.id === currentId);
    if (index === -1) return {};
    return { previous: sorted[index - 1], next: sorted[index + 1] };
  }
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `vitest run spec/entry-order.test.ts` passes with all four cases above.
  - `neighbors` has no dependency on `astro:content` or any Astro-specific
    type — a plain generic function, importable and testable outside a
    build.
- **Depends on:** None.

### Task 2: Collection sort helpers, wired into all four Grids

- **Description:** Move each Grid's existing inline `.sort()` into
  `src/lib/entry-order.ts` verbatim (same comparator, same behaviour), then
  make each Grid call the new function instead of sorting inline — the
  single-source-of-truth requirement (2.1.6). No visible behaviour change.
- **Files touched:** `src/lib/entry-order.ts` (add to it);
  `src/components/LecturesGrid.astro`, `src/components/SessionsGrid.astro`,
  `src/components/AssessmentsGrid.astro`, `src/components/PeopleGrid.astro`.
- **Tests first (red):** No new test file — this task is a refactor with
  no new externally-visible behaviour, so its regression coverage is the
  existing, already-green spec suite (`spec/cast.test.ts`,
  `spec/navigation.test.ts`, `spec/weekly-structure.test.ts`, and any other
  spec asserting Grid-rendered content/order). Run `pnpm test` before this
  task to confirm current green baseline, then again after — a failing test
  here means the refactor changed observable order, which it must not.
- **Implementation (green):** add to `entry-order.ts`:
  ```ts
  import { getPublishedCollection } from "astro-course-university/content";
  import type { CollectionEntry } from "astro:content";

  export async function sortedLectures(): Promise<CollectionEntry<"lectures">[]> {
    const lectures = await getPublishedCollection("lectures");
    return lectures.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  }

  export async function sortedSessions(): Promise<CollectionEntry<"sessions">[]> {
    const sessions = await getPublishedCollection("sessions");
    return sessions.sort((a, b) => a.data.week - b.data.week);
  }

  export async function sortedAssessments(): Promise<CollectionEntry<"assessments">[]> {
    const assessments = await getPublishedCollection("assessments");
    return assessments.sort((a, b) => a.data.week - b.data.week);
  }

  const roleOrder: Record<string, number> = { convenor: 0, tutor: 1, guest: 2, other: 3 };

  export async function sortedPeople(): Promise<CollectionEntry<"people">[]> {
    const people = await getPublishedCollection("people");
    return people.sort((a, b) => {
      const ra = roleOrder[a.data.role ?? "other"] ?? 99;
      const rb = roleOrder[b.data.role ?? "other"] ?? 99;
      if (ra !== rb) return ra - rb;
      return a.data.title.localeCompare(b.data.title);
    });
  }
  ```
  Each Grid replaces its own `getPublishedCollection(...)` + `.sort(...)`
  lines with a single call, e.g. `SessionsGrid.astro`:
  `const visible = await sortedSessions();` — the rest of each Grid's
  template is untouched.
- **Refactor:** None expected — this task *is* the refactor.
- **Acceptance criteria:**
  - `pnpm test` (which runs `astro build` first) passes with no diff in
    rendered order on any of the four overview pages versus the pre-task
    baseline.
  - No Grid component contains its own inline `.sort()` call anymore — the
    comparator logic exists exactly once, in `entry-order.ts`.
- **Depends on:** Task 1 (same file).

### Task 3: Generalise the nav component and rewire the Lecture page

- **Description:** Rename `WeekNav.astro` → `EntryNav.astro`, generalise its
  props so it only renders whatever `previous`/`next`/`currentLabel` it's
  given (no more internal `getPublishedCollection` call), and update
  `lectures/[slug].astro` to compute that data itself via `sortedLectures()` +
  `neighbors()`. Visible behaviour for lecture pages must not change at all.
- **Files touched:** `src/components/WeekNav.astro` → new
  `src/components/EntryNav.astro` (rename); `src/pages/lectures/[slug].astro`.
- **Tests first (red):** No new test file for this task — the existing
  `spec/week-nav.test.ts` already encodes every behaviour this task must
  preserve exactly (link count/placement for weeks 1/6/12, href targets,
  visible "Week N"/title text, reserved side columns, the
  `data-week-nav-current` label, the shipped `IntersectionObserver` script).
  Confirm it fails first if the rename/generalisation is done incorrectly
  (e.g. run it against a deliberately-broken intermediate state during
  development), then confirm it's green against the final version — it must
  require **zero edits** to pass.
- **Implementation (green):**
  ```ts
  // src/components/EntryNav.astro
  export interface EntryNavItem {
    href: string;
    primaryLabel: string;
    subtitleLabel?: string;
  }
  interface Props {
    previous?: EntryNavItem;
    next?: EntryNavItem;
    currentLabel: string;
  }
  const { previous, next, currentLabel } = Astro.props;
  ```
  Template: identical structure to today's `WeekNav.astro`, with
  `previous.data.week`/`previous.data.title` replaced by
  `previous.primaryLabel`/`previous.subtitleLabel` (and only rendering the
  `.week-nav-subtitle` span when `subtitleLabel` is truthy — Assessments
  won't pass one), and the center `<p>` rendering `{currentLabel}` directly
  instead of `Week {week} — {title}`. All class names, the sentinel div, the
  `<style>` block, and the `<script>` block are copied over completely
  unchanged. `aria-label` on the `<nav>` is generalised from `"Week
  navigation"` to `"Page navigation"` (not asserted by any existing test).

  `src/pages/lectures/[slug].astro`:
  ```ts
  import { neighbors, sortedLectures } from "../../lib/entry-order";
  import EntryNav from "../../components/EntryNav.astro";
  // ...
  const lectures = await sortedLectures();
  const { previous, next } = neighbors(lectures, lecture.id);
  ```
  ```astro
  <EntryNav
    previous={previous && {
      href: withBase(`/lectures/${previous.id}/`),
      primaryLabel: `Week ${previous.data.week}`,
      subtitleLabel: previous.data.title,
    }}
    next={next && {
      href: withBase(`/lectures/${next.id}/`),
      primaryLabel: `Week ${next.data.week}`,
      subtitleLabel: next.data.title,
    }}
    currentLabel={`Week ${lecture.data.week} — ${lecture.data.title}`}
  />
  ```
  (`withBase` is already imported in this file today.)
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/week-nav.test.ts` passes unmodified.
  - No file in `src/` imports `WeekNav.astro` (it no longer exists).
  - `pnpm typecheck` passes (the new `Props`/`EntryNavItem` types are
    correctly used at the one call site so far).
- **Human review:** Load `/lectures/week-06/` at both 1920×1080 and 390×844
  and scroll past the heading — confirm the header looks and behaves
  pixel-for-pixel like it did before this task (sticky under the site nav,
  center label crossfade, mobile "Week N" collapse). A pass is "I can't tell
  anything changed."
- **Depends on:** Task 1.

### Task 4: Lab detail pages get the nav header

- **Description:** Add `EntryNav` to `sessions/[slug].astro`, ordered by
  `sortedSessions()`, "Week N — Title" labelling.
- **Files touched:** `src/pages/sessions/[slug].astro`; new
  `spec/entry-nav.test.ts` (shared file for Tasks 4–6, one `describe` block
  per content type).
- **Tests first (red):** in `spec/entry-nav.test.ts`, a
  `describe("Lab navigation")` block, reading `dist/sessions/week-06/index.html`,
  `dist/sessions/week-01/index.html`, `dist/sessions/week-12/index.html`
  (mirroring `spec/week-nav.test.ts`'s exact structure for lectures):
  - `"gives week 6 exactly two entry-nav links"` — `class="week-nav-link"`
    count is 2 on the week-06 Lab page.
  - `"gives week 1 exactly one entry-nav link (next only)"` — count is 1,
    and the page does not link to a week-00 Lab.
  - `"gives week 12 exactly one entry-nav link (previous only)"` — count is
    1, and the page does not link to a week-13 Lab.
  - `"links week 6's previous control to week 5's Lab and shows its title"`
    — asserts `href` contains `/sessions/week-05/` and the page contains
    `"Week 5"` and week 5's actual Lab title (read from
    `src/content/sessions/week-05.md` frontmatter, same technique
    `week-nav.test.ts` uses via the course API JSON).
  - `"omits a subtitle-less week prefix"` is **not** applicable here (Labs
    do get a subtitle) — skip; covered by the title-match assertion above.
- **Implementation (green):**
  ```ts
  import { neighbors, sortedSessions } from "../../lib/entry-order";
  import EntryNav from "../../components/EntryNav.astro";
  import { withBase } from "astro-theme-university/url"; // new import
  // ...
  const sessions = await sortedSessions();
  const { previous, next } = neighbors(sessions, session.id);
  ```
  ```astro
  <EntryNav
    previous={previous && {
      href: withBase(`/sessions/${previous.id}/`),
      primaryLabel: `Week ${previous.data.week}`,
      subtitleLabel: previous.data.title,
    }}
    next={next && {
      href: withBase(`/sessions/${next.id}/`),
      primaryLabel: `Week ${next.data.week}`,
      subtitleLabel: next.data.title,
    }}
    currentLabel={`Week ${session.data.week} — ${session.data.title}`}
  />
  ```
  placed as the first child inside `<ContentLayout>`, before the existing
  `<WeekMeta ... kind="lab" />`.
- **Refactor:** None expected.
- **Acceptance criteria:** all cases above pass; `pnpm typecheck` passes.
- **Human review:** Load `/sessions/week-06/` at both marking viewports —
  confirm the header renders and behaves the same way the lecture header
  does (this is a new surface for Labs, so this is a first look, not a
  regression check).
- **Depends on:** Tasks 1, 2, 3 (reuses `EntryNav` and `sortedSessions`).

### Task 5: Assessment detail pages get the nav header

- **Description:** Add `EntryNav` to `assessments/[slug].astro`, ordered by
  `sortedAssessments()`, title-only labelling (no week prefix, no subtitle).
- **Files touched:** `src/pages/assessments/[slug].astro`;
  `spec/entry-nav.test.ts` (new `describe("Assessment navigation")` block).
- **Tests first (red):** this collection has a real tie (`assignment-3-adulting`
  and `final-exam`, both `week: 12` — see §2.4/§3.6), so instead of asserting
  a specific adjacency by name, the test derives ground truth from the
  overview page itself:
  ```ts
  const assessmentsIndexHtml = readFileSync(resolve("dist/assessments/index.html"), "utf8");
  const orderedIds = [...assessmentsIndexHtml.matchAll(/\/assessments\/([a-z0-9-]+)\//g)]
    .map((m) => m[1]);
  const uniqueOrderedIds = [...new Set(orderedIds)]; // dedupe repeated hrefs if any wrapper links twice
  ```
  - `"reproduces the assessments overview page's own order as prev/next"` —
    for every adjacent pair `(a, b)` in `uniqueOrderedIds`, load
    `dist/assessments/${a}/index.html` and assert it contains a
    `class="week-nav-link"` with `href` matching `/assessments/${b}/` (the
    "next" control) — walking the *entire* list this way is the direct,
    mechanical proof of requirement 2.1.3 ("ordered exactly as the overview
    page"), tie or no tie.
  - `"gives the first assessment exactly one entry-nav link (next only)"` —
    load `dist/assessments/${uniqueOrderedIds[0]}/index.html`, expect one
    `week-nav-link` and no "previous" href.
  - `"gives the last assessment exactly one entry-nav link (previous only)"`
    — same, for the last id.
  - `"shows the assessment's title with no week prefix"` — for at least one
    non-first non-last assessment, assert its neighbour's link text is
    exactly that assessment's `data.title` (e.g. `"Assignment 2: Touch Grass
    Field Study"`) and does **not** contain the substring `"Week"`.
- **Implementation (green):**
  ```ts
  import { neighbors, sortedAssessments } from "../../lib/entry-order";
  import EntryNav from "../../components/EntryNav.astro";
  import { withBase } from "astro-theme-university/url"; // new import
  // ...
  const assessments = await sortedAssessments();
  const { previous, next } = neighbors(assessments, assessment.id);
  ```
  ```astro
  <EntryNav
    previous={previous && {
      href: withBase(`/assessments/${previous.id}/`),
      primaryLabel: previous.data.title,
    }}
    next={next && {
      href: withBase(`/assessments/${next.id}/`),
      primaryLabel: next.data.title,
    }}
    currentLabel={assessment.data.title}
  />
  ```
  placed as the first child inside `<ContentLayout>`, before the existing
  conditional draft `<Callout>`.
- **Refactor:** None expected.
- **Acceptance criteria:** all cases above pass; `pnpm typecheck` passes; no
  rendered assessment nav link or center label contains the substring
  `"Week"`.
- **Human review:** Load `/assessments/final-exam/` and
  `/assessments/weekly-reflections/` (first and last in the current order)
  at both marking viewports — confirm the header looks balanced without a
  subtitle line (shorter side boxes than Lectures/Labs) and doesn't look
  broken or mis-aligned.
- **Depends on:** Tasks 1, 2, 3.

### Task 6: People detail pages get the nav header

- **Description:** Add `EntryNav` to `people/[slug].astro`, ordered by
  `sortedPeople()`, name as primary label, mapped role as subtitle when
  present.
- **Files touched:** `src/pages/people/[slug].astro`;
  `spec/entry-nav.test.ts` (new `describe("People navigation")` block).
- **Tests first (red):** using the exact, tie-free fixture order from §3.6
  (`cosima-adjei` → `noor-kalantari` → `petra-lindqvist` → `thaddeus-vrell`):
  - `"gives the first person (Cosima Adjei) exactly one entry-nav link
    (next only)"` — load `dist/people/cosima-adjei/index.html`, expect one
    `week-nav-link`, and its href targets `/people/noor-kalantari/`.
  - `"gives the last person (Thaddeus Vrell) exactly one entry-nav link
    (previous only)"` — load `dist/people/thaddeus-vrell/index.html`,
    expect one `week-nav-link`, href targets `/people/petra-lindqvist/`.
  - `"gives a middle person (Noor Kalantari) exactly two entry-nav links"`
    — load `dist/people/noor-kalantari/index.html`, expect 2, previous
    targets `/people/cosima-adjei/` and shows "Cosima Adjei" +
    "Convenor", next targets `/people/petra-lindqvist/` and shows "Petra
    Lindqvist" + "Tutor".
  - `"uses the person's name as the center label, not a week number"` —
    the `data-week-nav-current` element's text is exactly `"Noor
    Kalantari"` (no `"Week"` substring).
- **Implementation (green):**
  ```ts
  import { neighbors, sortedPeople } from "../../lib/entry-order";
  import EntryNav from "../../components/EntryNav.astro";
  import { withBase } from "astro-theme-university/url"; // new import
  // ...
  const people = await sortedPeople();
  const { previous, next } = neighbors(people, person.id);
  function navRoleLabel(role: string | undefined): string | undefined {
    if (!role) return undefined;
    return roleLabels[role] || undefined; // "" for "other" becomes undefined
  }
  ```
  ```astro
  <EntryNav
    previous={previous && {
      href: withBase(`/people/${previous.id}/`),
      primaryLabel: previous.data.title,
      subtitleLabel: navRoleLabel(previous.data.role),
    }}
    next={next && {
      href: withBase(`/people/${next.id}/`),
      primaryLabel: next.data.title,
      subtitleLabel: navRoleLabel(next.data.role),
    }}
    currentLabel={person.data.title}
  />
  ```
  placed as the first child inside `<ContentLayout>`, before the existing
  `<dl>`. Reuses the `roleLabels` map already defined in this file (§3.2) —
  no new map introduced.
- **Refactor:** None expected.
- **Acceptance criteria:** all cases above pass; `pnpm typecheck` passes; no
  rendered person nav link or center label contains the substring `"Week"`.
- **Human review:** Load `/people/noor-kalantari/` at both marking
  viewports — confirm the name + role subtitle reads cleanly on both sides
  and the header doesn't look sparse/broken with the shorter labels.
- **Depends on:** Tasks 1, 2, 3.

### Task 7: Translucent, blurred chrome

- **Description:** Give `.week-nav`, `.at-nav`, and `.at-search-panel` the
  same translucent + blurred background, via `src/styles/course.css`, using
  each surface's own existing background token so light/dark mode and the
  bg-vs-bg-elevated distinction are preserved.
- **Files touched:** `src/styles/course.css`; new
  `spec/translucent-chrome.test.ts`.
- **Tests first (red):** using the same `bundledCss()` pattern already
  established in `spec/treatment.test.ts` (local copy, per that file's own
  convention):
  - `"declares one shared alpha and blur radius token"` — bundled CSS
    matches `/--course-chrome-alpha:\s*[\d.]+%/` and
    `/--course-chrome-blur:\s*[\d.]+px/`.
  - `"gives the entry-nav header a translucent, blurred background using
    the shared tokens"` — the `.week-nav { ... }` rule block in the bundled
    CSS contains both `var(--course-chrome-alpha)` and
    `var(--course-chrome-blur)`, and its `background` declaration uses
    `color-mix(` (not a plain opaque `var(--at-bg)` alone).
  - `"gives the site nav bar the same treatment"` — same two assertions for
    the `.at-nav { ... }` rule block found in the bundled CSS (note:
    `.at-nav`'s *base* rule ships from the theme's own stylesheet, which
    isn't part of `bundledCss()`'s inputs — this test instead asserts that
    `course.css`'s **source** contains an `.at-nav` rule with those two
    `var()` references, since that's the file this task is allowed to
    change; a second assertion confirms the same two custom properties
    appear in the *bundled* CSS at all, proving they actually shipped).
  - `"gives the search panel the same treatment"` — same two assertions,
    for `.at-search-panel`, against `course.css`'s own source (same
    reasoning).
  - `"keeps the background over each surface's own token, not a hardcoded
    colour"` — the `.week-nav`/`.at-nav` rules' `color-mix()` calls
    reference `var(--at-bg)`, and `.at-search-panel`'s references
    `var(--at-bg-elevated)` — i.e. `course.css`'s source contains
    `color-mix(in oklch, var(--at-bg)` at least twice and
    `color-mix(in oklch, var(--at-bg-elevated)` at least once.
- **Implementation (green):** append to `src/styles/course.css`:
  ```css
  /* Subtle translucent + blurred chrome (Plan
     2026-09-15-entry-nav-and-translucent-chrome.md, Task 7): one shared
     alpha/blur pair reused across the per-page nav header, the site nav
     bar, and the search panel, each color-mix'd over that surface's own
     existing background token so light/dark mode and the bg-vs-elevated
     distinction the theme already encodes are both preserved. */
  :root {
    --course-chrome-alpha: 82%;
    --course-chrome-blur: 12px;
  }

  .week-nav,
  .at-nav,
  .at-search-panel {
    backdrop-filter: blur(var(--course-chrome-blur));
    -webkit-backdrop-filter: blur(var(--course-chrome-blur));
  }

  .week-nav,
  .at-nav {
    background: color-mix(in oklch, var(--at-bg) var(--course-chrome-alpha), transparent);
  }

  .at-search-panel {
    background: color-mix(
      in oklch,
      var(--at-bg-elevated) var(--course-chrome-alpha),
      transparent
    );
  }
  ```
  (`.week-nav`'s own `<style>` block in `EntryNav.astro` still declares
  `background: var(--at-bg);` as a scoped, lower-priority fallback — leave
  it as-is; `course.css`'s unlayered rule already wins per §3.8, so no edit
  is needed there, but note it in the diff review so nobody "fixes" it
  thinking it's dead code.)
- **Refactor:** None expected.
- **Acceptance criteria:** all cases above pass; `pnpm check` stays green;
  visual confirmation (below) that legibility holds over scrolled content.
- **Human review:** At both marking viewports, in both light and dark mode
  (toggle via the site's existing theme control), scroll a Lecture page so
  the entry-nav header is stuck and content is visible moving underneath it,
  and open the search dialog over a page with visible body text behind it.
  A pass is: the blur is clearly present (text/shapes scrolling underneath
  are softened, not sharp), the effect reads as "subtle" rather than heavy
  frosted glass, and all header/panel text stays comfortably legible against
  its own translucent background in both themes.
- **Depends on:** Task 3 (needs `.week-nav` to exist on all four page types
  to be fully visually checkable, though the CSS itself only depends on the
  class existing at all, which it already does after Task 3).

## 6. Feature-level Definition of Done

- [x] Every task in §5 complete and its tests passing
- [x] `pnpm test` (`astro build && vitest run spec`) passes
- [x] `pnpm check` (`astro check && pnpm test`) passes
- [x] Manually verified with `agent-browser` at 1920×1080 and 390×844: a
  Lecture, a Lab, an Assessment, and a Person detail page each show a
  correctly-labelled, correctly-ordered nav header; the first/last entry of
  each type correctly omits one side; the translucent/blurred treatment is
  visible and legible on the nav header, the site nav bar, and the search
  panel, in both light and dark mode.
- [x] Every requirement in §2 is covered — see §7
- [ ] Every task with a `Human review:` line (3, 4, 5, 6, 7) has been shown
  to the user and explicitly accepted — not inferred, not just its
  acceptance criteria passing
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (Lecture nav unchanged, now list-order-driven) | Task 3 |
| 2.1.2 (Lab nav, "Week N — Title") | Task 4 |
| 2.1.3 (Assessment nav, title-only) | Task 5 |
| 2.1.4 (People nav, name + role subtitle) | Task 6 |
| 2.1.5 (first/last omit one side) | Tasks 3, 4, 5, 6 |
| 2.1.6 (shared ordering function, no drift) | Tasks 1, 2 |
| 2.1.7 (draft/unpublished excluded) | Task 2 (`getPublishedCollection` reused unchanged inside every `sorted*()`) |
| 2.1.8 (shared translucent/blurred chrome) | Task 7 |
| 2.2 (viewport verification) | Tasks 3, 4, 5, 6, 7 (Human review lines) |
| 2.2 (no regression to existing nav mechanics) | Task 3 |
| 2.2 (no hand-edit of vendored theme package) | Task 7 |
| 2.2 (`pnpm check` green) | Definition of Done |

## 8. Risks / open questions

None.

## 9. Post-review amendments (2026-09-15, after first human review round)

The first round of human review (Tasks 3–7) surfaced three real problems,
none of which were "wording off" — each changed an approach the plan had
locked in, so this section records what changed and why, per Phase 5 of the
execute-plan skill.

1. **Assessment nav labelling was wrong.** §2.1.3 originally called for the
   assessment's full title as both the side and center label, with no
   subtitle. The user asked instead for a split: "Assignment N" as the bold
   title, the descriptive part ("Touch Grass Field Study", "Time to be an
   Adult", …) as the subtitle — mirroring how Lectures/Labs show "Week N"
   with the lecture/Lab title underneath. `Final Exam` and `Weekly
   Reflections` don't match the "Assignment N: name" shape, so they keep
   rendering as a plain, un-split title. Implemented as a new pure function,
   `assessmentNavLabel()` in `entry-order.ts` (unit-tested in
   `entry-order.test.ts` alongside `neighbors()`), used by both the nav's
   side links and its center label (`Assignment N — name`, echoing the
   em-dash convention Lectures already use).
2. **New, previously out-of-scope requirement: Assessment and People detail
   pages should present their key-fact rows in the same `.course-specsheet`
   `<dl>` "table" that `WeekMeta.astro` already gives Lectures/Labs**, for
   visual consistency across all four content types. Assessments' plain
   `<p>Due: … · Weight: …</p>` became a `.course-specsheet` section with
   `Due`/`Weight` rows; People's bare `<dl>` (Role/Affiliation/Email/Web/
   Contact) was wrapped in the same `.course-specsheet` section rather than
   rebuilt, since its rows were already correct.
3. **The translucent chrome had two real bugs, not a tuning problem alone:**
   - `EntryNav.astro`'s own scoped `<style>` still declared
     `background: var(--at-bg)` (opaque) on `.week-nav`. Astro scopes
     component styles with a `data-astro-cid-*` attribute selector, which is
     *more specific* than course.css's plain `.week-nav` rule — course.css
     being unlayered (§3.8) only lets it beat the *theme's own* layered
     rules, not this component's own higher-specificity one. The plan's
     original §5 Task 7 note ("leave it as-is … course.css's unlayered rule
     already wins") assumed the wrong reason course.css wins against the
     theme, and was wrong for this component. Fixed by removing that
     `background` declaration from `EntryNav.astro` entirely, so course.css
     is now the sole source of `.week-nav`'s background.
   - `--course-chrome-alpha: 82%` left only 18% of the pixel showing the
     blurred layer underneath — visually read as "faintly transparent," not
     "blurred," even where the CSS was applying correctly (`.at-nav`,
     `.at-search-panel`, both theme-owned and correctly beaten by course.css
     being unlayered). Retuned to `--course-chrome-alpha: 55%` and
     `--course-chrome-blur: 24px` (both shared tokens, so the change applies
     identically everywhere) — verified visually to make the blur clearly
     legible without reading as heavy frosted glass.

All three fixes verified with `agent-browser` at 1920×1080 and 390×844
after the change; `pnpm check` stayed green throughout (256 tests).
