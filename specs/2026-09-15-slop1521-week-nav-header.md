# Sticky week navigation header for lecture pages

- **Date:** 2026-09-15
- **Status:** Draft
- **Approved by user:** yes — 2026-09-15

## 1. Problem / intent

Lecture pages currently have no way to move between adjacent weeks without
leaving the page and going back to the `/lectures/` index. The user wants a
sticky header, docked below the site's existing nav bar, that lets a reader
jump to the previous or next week's lecture directly from wherever they are
on the page — and that also reminds them which week/lecture they're
currently reading once they've scrolled past the page's own title, since at
that point the `<h1>` naming the current week is no longer visible.

## 2. Requirements

### 2.1 Functional requirements

1. A new sticky header renders on every lecture page (`/lectures/[slug]/`),
   positioned directly below the site's existing sticky nav bar, and stays
   visible while scrolling through the page.
2. The header has three regions, left to right: a "previous week" control, a
   center "current week" indicator, and a "next week" control.
3. The previous-week control is a link to the lecture one week earlier. It
   shows an arrow-left icon plus two lines of text: "Week N" (title) and
   that week's lecture topic (subtitle, from the lecture's `title` field).
4. The next-week control mirrors this for the lecture one week later, arrow
   pointing right, text right-aligned with the icon on the outer right edge.
5. On the Week 1 lecture page, the previous-week control is omitted (no link
   to a nonexistent Week 0). On the Week 12 lecture page, the next-week
   control is omitted likewise.
6. When a control is omitted (week 1 or 12), its column still reserves the
   same width it would otherwise occupy, so the center region remains
   horizontally centered in the header on every lecture page, including
   weeks 1 and 12.
7. The center region is hidden (not just empty — no visible box) while the
   page's own main title (`<h1>`) is visible in the viewport.
8. Once the reader scrolls far enough that the main title is no longer
   visible, the center region fades and slides in, displaying the current
   page's own "Week N — Title".
9. If the reader scrolls back up so the main title is visible again, the
   center region fades/slides back out.
10. The center region is static text — not a link, not clickable.
11. On narrow viewports (~390px wide and below), the previous/next controls
    drop their topic subtitle line, showing only the arrow icon and "Week
    N", to leave room for the center region to still appear without
    crowding or wrapping.
12. Previous/next controls are real `<a>` links (via the project's existing
    `withBase` URL helper) and function with JavaScript disabled. Only the
    center region's show/hide behavior depends on JavaScript; if JS fails
    or is unavailable, the center region simply never appears — no layout
    breakage.

### 2.2 Non-functional requirements

- Respect `prefers-reduced-motion`: when set, the center region's
  appearance/disappearance toggles instantly instead of animating.
- Verify the header visually at both marking viewports (`1920 1080` and
  `390 844`) with `agent-browser` before considering this done, per
  `CLAUDE.md`.
- No new external dependencies: use the existing Iconoir icon set (via the
  theme's `Icon` component), the existing CSS custom-property tokens
  (`--at-spacing-*`, `--at-nav-height`, etc.), and vanilla JS
  (`IntersectionObserver`) — consistent with the rest of the codebase,
  which has no client-side JS or animation library today.
- Must not introduce any stray heading (`<h1>`–`<h6>`) elements that would
  disturb the heading order `spec/weekly-structure.test.ts` checks for
  (Overview → Content → Case study → Reflection → Assessment tie-in).
- Any new user-facing label/aria-label text must pass `spec/voice.test.ts`
  (no banned technical-metaphor terms) — plain wayfinding language only
  ("Previous week", "Next week").
- `pnpm check` (types, build, `spec/` tests) must stay green.

### 2.3 Out of scope

- Labs, Assessments, and People pages. The user wants this pattern
  considered for those pages too, but only as a follow-up once this
  implementation is validated — and Assessments/People don't have a
  natural "week" sequence the way Lectures and Labs (`sessions` collection)
  do, so they would need their own design pass rather than a direct reuse
  of this component.
- Any change to the vendored `astro-theme-university` / `astro-course-
  university` packages (`node_modules/`) — the main `<h1>` these packages
  render is treated as a fixed constraint, not something this feature
  modifies.
- Keyboard-specific or non-scroll ways of toggling the center region (e.g.
  a manual "jump to top" affordance) — not requested.

### 2.4 Assumptions (confirmed)

- Lecture weeks are numbered contiguously 1–12 with no gaps, matching the
  course's known 12-week structure and the `weekSchema`
  (`z.coerce.number().int().min(1).max(12)`) in `src/content.config.ts`.
  Confirmed by reading the schema and existing content files
  (`week-01.md` … `week-12.md`).
- The previous/next lookup can use direct arithmetic (`week - 1`/`week +
  1`) against the `lectures` collection rather than sorting the whole
  collection and indexing — the same idiom already used in
  `src/components/WeekMeta.astro` for cross-collection lookups. Confirmed
  by reading `WeekMeta.astro`.
- The only reliable way to detect when the main title scrolls out of view
  is to query the rendered `<h1>` inside `<main>` from a page-scoped
  script, since it's rendered by the vendored `ContentLayout.astro` and
  isn't otherwise exposed for wiring. Confirmed with the user as an
  accepted implementation constraint (see design discussion — no
  alternative exists without editing vendored theme code, which
  `CLAUDE.md` forbids in spirit for generated/vendor code).

## 3. Existing context

- **Schema**: `src/content.config.ts` — `lectures` collection schema
  extends `courseNodeSchema` with `week` (`weekSchema`, 1–12), `date`,
  `teachers`, `slides`, loaded via `courseNodeLoader("lectures")`.
- **Content**: `src/content/lectures/week-01.md` … `week-12.md`, frontmatter
  `title`/`week`/`date`/etc., body has the five required `##` sections.
- **Routing**: `src/pages/lectures/[slug].astro` — builds static paths from
  `getPublishedCollection("lectures")`; page title is
  `` `Week ${lecture.data.week} Lecture: ${lecture.data.title}` ``. This is
  the only page the new header is added to.
- **Layout chain**: `[slug].astro` → `ContentLayout.astro` (theme package)
  → `BaseLayout.astro` (theme package). `BaseLayout` renders the sticky
  `.at-nav` (top nav, `position: sticky; top: 0; z-index: 100;`,
  `--at-nav-height: 6.5rem`). `ContentLayout` renders `<h1>{title}</h1>`
  (or a `Hero`) then `<slot />`.
- **Existing sticky idiom**: the sidebar TOC
  (`node_modules/astro-theme-university/styles/sidebar.css`) uses
  `position: sticky; inset-block-start: calc(var(--at-nav-height) +
  var(--at-spacing-lg))` — the pattern to copy for docking under the main
  nav.
- **Cross-week lookup precedent**: `src/components/WeekMeta.astro` already
  does `lectures.find((e) => e.data.week === week)` for cross-collection
  week matching — same style of lookup this feature needs, just within the
  same collection at `week ± 1`.
- **No prior art** in the repo for: pagination/prev-next UI, client-side
  scroll listeners, `IntersectionObserver`, or fade/slide transitions —
  this feature introduces the first instance of each, so it should be
  built as a clean, minimal, reusable pattern (vanilla JS, CSS transitions,
  theme CSS tokens) rather than reaching for a library.
- **Icons**: Iconoir via `astro-theme-university`'s `Icon.astro` wrapper,
  e.g. `<Icon name="..." />` maps to `iconoir:${name}`. Exact arrow icon
  names (e.g. `nav-arrow-left`/`nav-arrow-right`) to be confirmed against
  the installed Iconoir set at implementation time.
- **Styling conventions**: no Tailwind in this repo; custom CSS
  (`src/styles/course.css`) uses the theme's CSS custom properties
  (`--at-spacing-*`, `--at-divider`, `--at-accent-soft`, `--at-nav-height`,
  etc.) rather than hardcoded values.
- **Spec files relevant to this feature**: `spec/weekly-structure.test.ts`
  (heading-order enforcement per lecture page), `spec/navigation.test.ts`
  (site-wide nav link pattern precedent), `spec/voice.test.ts` (banned
  metaphor/jargon term list applied to all content pages).

## 4. Design

**Component**: new `src/components/WeekNav.astro`, used only from
`src/pages/lectures/[slug].astro`, placed so it renders as a direct sticky
sibling docked under the site's nav (not nested inside `ContentLayout`'s
slot in a way that would break its sticky positioning against
`--at-nav-height`).

**Layout**: three-column flex/grid row, `position: sticky; top:
var(--at-nav-height);`, full width, its own `z-index` below the main nav's
`100` (e.g. `90`) so the main nav still wins if both are ever visually
stacked at scroll boundaries.

- **Left column** — if a Week N−1 lecture exists: an `<a>` (built with
  `withBase`) to that lecture's page, containing an arrow-left icon, "Week
  N−1" as a title line, and that lecture's `title` as a subtitle line. If
  N−1 doesn't exist (Week 1), the column renders with no visible content
  but keeps its layout width (e.g. an empty div with the same grid track /
  flex-basis), so the center column doesn't shift.
- **Right column** — mirror of left for Week N+1, text right-aligned, icon
  on the far right edge. Same reserve-space-when-absent behavior for Week
  12.
- **Center column** — a static text node ("Week N — Title" for the
  *current* page), initially visually hidden (`opacity: 0` plus a small
  `translateY` offset, and non-interactive while hidden). A small
  page-scoped `<script>` sets up an `IntersectionObserver` watching the
  rendered `<h1>` inside `<main>`; when that `<h1>` leaves the viewport,
  the script toggles a class on the center column that triggers a CSS
  transition (~200ms fade + slight slide) to reveal it, and reverses the
  class when the `<h1>` re-enters view. Wrapped in a
  `prefers-reduced-motion` media query so the transition duration collapses
  to near-zero when the user has that preference set.

**Data**: previous/next lecture fetched via `getPublishedCollection
("lectures")`, matching `week === currentWeek - 1` and `week === currentWeek
+ 1` (same idiom as `WeekMeta.astro`), giving `{ week, title, slug/id }` for
each side, used to build the `withBase` URL and the two text lines.

**Alternatives considered**:

- *Sorting the full collection and indexing by position* instead of
  arithmetic `week ± 1` lookups — rejected as unnecessary complexity given
  weeks are confirmed contiguous 1–12; direct lookup matches existing
  `WeekMeta.astro` precedent and needs no sort.
- *CSS-only scroll-driven animation* (e.g. `animation-timeline: view()`)
  instead of `IntersectionObserver` — rejected for now due to inconsistent
  browser support; vanilla JS with `IntersectionObserver` is the
  conventional, broadly-supported approach and this repo has no existing
  scroll-animation pattern to stay consistent with either way.
- *Letting the layout collapse toward whichever side has a button* on week
  1/12 instead of reserving blank space — considered and explicitly
  rejected by the user in favor of keeping the center label always
  centered.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | Gap | What happens to the header's layout on Week 1/12 where one side button doesn't exist | Reserve the space; center stays truly centered on every page (user confirmed) |
| 2 | Gap | Mobile (390×844) can't fit two-line side buttons and a centered label at once | Drop the topic subtitle on narrow viewports, keep icon + "Week N" only (user confirmed) |
| 3 | Gap | Should the center current-week label be interactive | No — static text only, not a link (user confirmed) |
| 4 | Ambiguity | What exactly "main title out of view" means, and how to detect it | Defined as: the page's `<h1>` (rendered by vendored `ContentLayout`) leaving the viewport, detected via `IntersectionObserver` in a page-scoped script querying `main h1` |
| 5 | Assumption | Weeks are contiguous 1–12 with no gaps | Confirmed via `weekSchema` (`min(1).max(12)`) and existing `week-01.md`…`week-12.md` content files |
| 6 | Assumption | Previous/next lookup can use direct `week ± 1` arithmetic rather than sorting | Confirmed by precedent in `WeekMeta.astro`'s existing same-style lookup |
| 7 | Gap | No existing scroll/animation/IntersectionObserver pattern in the repo to match | Resolved by keeping the implementation minimal and vanilla (no new dependency), documented as the first instance of this pattern |
| 8 | Gap | Behavior when JavaScript is unavailable | Side-button links must work as plain anchors regardless of JS; only the center-label animation is JS-dependent and fails gracefully (never appears, no layout break) |
| 9 | Out-of-scope boundary | User wants this pattern for Labs/Assessments/People eventually | Explicitly deferred — those pages lack a uniform "week" concept (especially Assessments/People) and will need their own design pass; this spec covers Lectures only |
| 10 | Gap | Reduced-motion / accessibility handling for the fade-slide animation | Added as a non-functional requirement: instant toggle instead of animation under `prefers-reduced-motion` |

## 6. Handoff notes for planning

- Build `WeekNav.astro` as a standalone component from the start (not
  inline in `[slug].astro`) even though it's only used in one place today —
  this is a deliberate exception to "don't build for hypothetical reuse"
  because the user has already signaled a likely near-term ask to reuse the
  *pattern* (not necessarily this exact component) for other content
  types; keeping it a separate file makes that future work easier to scope
  without over-engineering the component itself now (no premature props/
  generalization beyond what Lectures need today).
- Confirm the exact Iconoir icon names for left/right arrows against the
  installed `astro-icon`/Iconoir set before wiring up the `Icon` component
  calls — the spec assumes names like `nav-arrow-left`/`nav-arrow-right`
  but this must be verified, not guessed.
- Add spec coverage (new `spec/week-nav.test.ts`, or extend
  `spec/navigation.test.ts`) asserting: Week N's page links to Week N−1 and
  N+1 lecture URLs where they exist; Week 1 omits the previous link; Week
  12 omits the next link. Also confirm no heading-order regression in
  `spec/weekly-structure.test.ts` and no banned terms flagged by
  `spec/voice.test.ts`.
- Verify visually with `agent-browser` at both `1920 1080` and `390 844`
  per `CLAUDE.md` before considering the feature done, specifically
  checking: the scroll-triggered fade/slide behavior, the reserved-blank-
  space behavior on Week 1 and Week 12, and the mobile subtitle-dropping
  behavior.
- `pnpm check` must be green before pushing, per `CLAUDE.md`.
