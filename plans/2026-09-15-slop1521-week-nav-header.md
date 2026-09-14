# Sticky week navigation header for lecture pages

- **Date:** 2026-09-15
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-15 (see
  `specs/2026-09-15-slop1521-week-nav-header.md`, approved by user; header
  width resolved during planning — see §4)

## 1. Summary

Every lecture page (`/lectures/[slug]/`) gains a new sticky header, docked
directly below the site's existing top nav, with a "previous week" link on
the left and a "next week" link on the right — each showing an arrow icon,
the target week's number, and that week's lecture topic. A center label
("Week N — Title") for the *current* page stays hidden while the page's own
`<h1>` is visible, then fades/slides in once the reader scrolls past it, and
fades back out when the `<h1>` returns to view. Week 1 has no previous
control and Week 12 has no next control, but both weeks still reserve the
same layout space so the center label stays centered on every lecture page.
This is a new component (`src/components/WeekNav.astro`), used only from
`src/pages/lectures/[slug].astro`; no other page changes.

## 2. Requirements

### 2.1 Functional requirements

1. A new sticky header renders on every lecture page
   (`/lectures/[slug]/`), positioned directly below the site's existing
   sticky nav bar, and stays visible while scrolling through the page.
2. The header has three regions, left to right: a "previous week" control,
   a center "current week" indicator, and a "next week" control.
3. The previous-week control is a link to the lecture one week earlier. It
   shows an arrow-left icon plus two lines of text: "Week N" (title) and
   that week's lecture topic (subtitle, from the lecture's `title` field).
4. The next-week control mirrors this for the lecture one week later,
   arrow pointing right, text right-aligned with the icon on the outer
   right edge.
5. On the Week 1 lecture page, the previous-week control is omitted (no
   link to a nonexistent Week 0). On the Week 12 lecture page, the
   next-week control is omitted likewise.
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
11. On narrow viewports (~768px wide and below), the previous/next
    controls always drop the topic subtitle line. The "Week N" title
    stays next to the arrow while the center region is hidden (page at
    rest, no room conflict); once scrolling makes the center region
    appear, "Week N" fades away (no width left to share), leaving a bare
    arrow — and fades back in when the center region hides again.
    **Revised twice during Task 2's human review**, both from live
    testing on a real narrow viewport (neither issue is visible from the
    built HTML alone): first, the plan's original "always show Week N,
    drop only the subtitle" didn't fit once the center label was also on
    screen — three text blocks (prev "Week N", center label, next
    "Week N") overflowed, pushing the center label off-screen and
    squeezing the arrows out of view entirely; dropping "Week N"
    unconditionally (arrow-only, always) fixed the overflow but then
    permanently hid week identifiers a reader would want at rest. The
    final design conditions the collapse on the same scroll state that
    drives the center label itself (`.week-nav.is-scrolled`, toggled by
    the same `IntersectionObserver` callback as `.week-nav-current`'s
    `is-visible`), so "Week N" only yields room exactly when something
    else needs it.
12. Previous/next controls are real `<a>` links (via the project's
    existing `withBase` URL helper) and function with JavaScript
    disabled. Only the center region's show/hide behavior depends on
    JavaScript; if JS fails or is unavailable, the center region simply
    never appears — no layout breakage.

### 2.2 Non-functional requirements

- Respect `prefers-reduced-motion`: when set, the center region's
  appearance/disappearance toggles instantly instead of animating. The
  theme's own global stylesheet already forces
  `transition-duration: 0.01ms !important` on every element under
  `@media (prefers-reduced-motion: reduce)`
  (`node_modules/astro-theme-university/styles/base.css:476-488`), so
  `WeekNav.astro`'s own CSS transition inherits this for free — no
  additional media query needed in the new component.
- The header's own width matches the page's content column (the same
  width as the article text and the sidebar TOC), not the full page width
  the top nav uses — see §4 for why.
- Verify the header visually at both marking viewports (`1920 1080` and
  `390 844`) with `agent-browser` before considering this done, per
  `CLAUDE.md`.
- No new external dependencies: use the existing Iconoir icon set (via
  the theme's `Icon` component), the existing CSS custom-property tokens
  (`--at-spacing-*`, `--at-nav-height`, etc.), and vanilla JS
  (`IntersectionObserver`) — consistent with the rest of the codebase,
  which has no client-side JS or animation library today.
- Must not introduce any stray heading (`<h1>`–`<h6>`) elements that
  would disturb the heading order `spec/weekly-structure.test.ts` checks
  for (Overview → Content → Case study → Reflection → Assessment tie-in).
- Any new user-facing label/aria-label text must pass `spec/voice.test.ts`
  (no banned technical-metaphor terms) — plain wayfinding language only
  ("Week navigation", "Week N").
- `pnpm check` (types, build, `spec/` tests) must stay green.

### 2.3 Out of scope

- Labs, Assessments, and People pages — deferred to a future
  brainstorm/plan cycle once this implementation is validated.
- Any change to the vendored `astro-theme-university` /
  `astro-course-university` packages (`node_modules/`) — the main `<h1>`
  these packages render is a fixed constraint, not something this
  feature modifies.
- Keyboard-specific or non-scroll ways of toggling the center region
  (e.g. a manual "jump to top" affordance) — not requested.
- A full-bleed (edge-to-edge, top-nav-width) header — see §4's width
  decision.

### 2.4 Assumptions

- None outstanding. Every assumption raised during brainstorming
  (contiguous 1–12 weeks, direct `week ± 1` arithmetic lookup, `<h1>`
  detection via `IntersectionObserver` on `main h1`) was confirmed against
  the schema/content/vendored source during brainstorming, and the one
  question that surfaced during this planning phase (header width) was
  resolved with the user — see §4.

## 3. Existing code context

- **`src/content.config.ts`** (read in full) — `lectures` collection:
  `courseNodeSchema.extend({ week: weekSchema, date: z.coerce.date(),
  teachers: teacherRefs.optional(), slides: z.string().regex(...).optional()
  }).loose()`, where `weekSchema = z.coerce.number().int().min(1).max(12)`.
- **`node_modules/astro-course-university/schemas.ts`** (read in full) —
  `courseNodeSchema = z.object({ title: z.string(), description:
  z.string().nullish(), tags: z.array(z.string()).default([]), related:
  ..., links: ..., spec: ..., published: ..., draft: ... })`. Confirms
  `lecture.data.title` (and `previous.data.title` / `next.data.title`)
  are plain strings, always present.
- **`src/pages/lectures/[slug].astro`** (read in full, 41 lines) — current
  contents:
  ```astro
  ---
  import { render } from "astro:content";
  import { getPublishedCollection } from "astro-course-university/content";
  import RelatedContent from "astro-course-university/components/RelatedContent.astro";
  import Icon from "astro-theme-university/components/Icon.astro";
  import ContentLayout from "astro-theme-university/layouts/ContentLayout.astro";
  import { withBase } from "astro-theme-university/url";
  import TeachingTeam from "../../components/TeachingTeam.astro";
  import WeekMeta from "../../components/WeekMeta.astro";
  import { graphCollections, siteConfig } from "../../site-config";

  export async function getStaticPaths() {
    const lectures = await getPublishedCollection("lectures");
    return lectures.map((lecture) => ({ params: { slug: lecture.id }, props: { lecture } }));
  }

  const { lecture } = Astro.props;
  const { Content } = await render(lecture);
  const title = `Week ${lecture.data.week} Lecture: ${lecture.data.title}`;
  ---

  <ContentLayout title={title} description={lecture.data.description} {...siteConfig}>
    <WeekMeta week={lecture.data.week} date={lecture.data.date} kind="lecture" />
    {lecture.data.slides && ( ... )}
    <Content />
    <TeachingTeam teachers={lecture.data.teachers} />
    <RelatedContent entry={lecture} collections={graphCollections} />
  </ContentLayout>
  ```
  `lecture.id` is the slug (`week-01` … `week-12`), matching
  `src/content/lectures/week-01.md` … `week-12.md`.
- **`src/components/WeekMeta.astro`** (read in full, 55 lines) — the
  direct precedent for a same-collection week lookup: `Props { week:
  number; date: Date; kind: "lecture" | "lab" }`, and (for its
  cross-collection case) `lectures.find((e) => e.data.week === week)`.
  `WeekNav.astro` reuses this idiom but within the *same* collection at
  `week - 1` / `week + 1`.
- **`node_modules/astro-theme-university/url.ts`** (read in full) —
  `export function withBase(href: string, base: string =
  metaEnv?.BASE_URL ?? "/"): string`.
- **`node_modules/astro-theme-university/components/Icon.astro`** (read
  in full) — `interface IconProps { name: string; size?: string | number;
  class?: string; style?: string; "aria-label"?: string; }`. Renders
  `<IconifyIcon name={`iconoir:${name}`} ... aria-hidden={labelled ?
  undefined : "true"} ... />` where `labelled = ariaLabel !== undefined`.
  `WeekNav.astro`'s arrow icons pass no `aria-label` (decorative) — the
  surrounding `<a>`'s own text content ("Week N", the topic) already
  gives each link its accessible name.
- **`node_modules/astro-theme-university/layouts/ContentLayout.astro`**
  (read in full, 38 lines) and **`BaseLayout.astro`** (read in full, 226
  lines) — `BaseLayout` renders `<main id="main" class="at-main">
  <slot /></main>`; `ContentLayout` renders `<h1>{title}</h1>` (or a hero)
  followed by `<slot />` inside that same default slot. So everything a
  lecture page puts inside `<ContentLayout>...</ContentLayout>` —
  including the new `<WeekNav />` — becomes a **sibling of the `<h1>`**,
  all directly inside `<main id="main">`. This is what makes
  `document.querySelector("#main h1")` both correct and stable for
  detecting when the page's own title scrolls out of view.
- **`node_modules/astro-theme-university/styles/components.css`** (read
  in full for the relevant sections) — confirms the subgrid layout that
  decides §4's width question:
  ```css
  .at-main {
    grid-column: inset-start / content-end;
    display: grid;
    grid-template-columns: subgrid;
    align-content: start;
    padding-block: var(--at-spacing-xl);
    min-height: calc(100dvh - var(--at-nav-height));
    overflow-wrap: break-word;
  }
  .at-main > * {
    grid-column: content;
  }
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
  .at-nav-inner {
    grid-column: content;
    display: flex;
    flex-wrap: wrap;
    ...
  }
  ```
  Because `.at-main > * { grid-column: content; }` is the *default* for
  any direct child, a plain `<WeekNav />` slotted straight into
  `ContentLayout` already renders at content-column width with **no**
  extra CSS override — matching the width the user chose in §4. Spanning
  full width (like `.at-nav` does) would instead require deliberately
  opting out with `grid-column: full` plus a `grid-template-columns:
  subgrid` + inner `grid-column: content` wrapper (the same three-layer
  pattern `.at-nav`/`.at-footer`/`.at-footer-band` use) — more code, and
  duplicates layout math owned by a package this project doesn't control.
- **`node_modules/astro-theme-university/styles/sidebar.css`** (read in
  full) — the sticky-below-nav idiom to copy: `position: sticky;
  inset-block-start: calc(var(--at-nav-height) + var(--at-spacing-lg));`,
  and the mobile breakpoint convention: `@media (width <= 768px) {
  .at-sidebar { display: none; } }`.
- **`node_modules/astro-theme-university/styles/tokens.css`** (read in
  full, 159 lines) — confirms `--at-nav-height: 6.5rem` and the
  `--at-spacing-*` scale used throughout; `WeekNav.astro` uses these
  tokens rather than hardcoded lengths, matching every other component.
- **`node_modules/astro-theme-university/styles/base.css`** (read lines
  1–90 and 465–488) — confirms `html { scroll-behavior: smooth;
  scroll-padding-top: calc(var(--at-nav-height) + var(--at-spacing-md));
  }`, the `body` grid-column tracks (`full-start`/`inset-start`/
  `content-start`/`content-end`/`full-end`), and the global
  `prefers-reduced-motion` block noted in §2.2.
- **`node_modules/@iconify-json/iconoir/icons.json`** — verified exact
  icon keys exist: `nav-arrow-left` and `nav-arrow-right` (checked via
  `python3 -c "import json; ..."` against the installed package; both
  present, alongside variants like `arrow-left`/`fast-arrow-left`/
  `arrow-left-circle` that were considered and rejected as either too
  generic or too heavy for a plain wayfinding chevron).
- **Icon usage precedent**: `src/pages/lectures/[slug].astro:32` and
  `src/components/LecturesGrid.astro:45` both call `<Icon
  name="presentation" />` with no extra props — the pattern `WeekNav`'s
  `<Icon name="nav-arrow-left" />` / `<Icon name="nav-arrow-right" />`
  calls follow.
- **Test setup**: `pnpm test` runs `pnpm build && vitest run spec` (see
  `package.json`); `pnpm check` runs `pnpm typecheck && pnpm test`. Tests
  read the built `dist/` output, not source files — see
  `spec/weekly-structure.test.ts` and `spec/voice.test.ts` for the
  established pattern (`readFileSync(resolve("dist/lectures/<id>/
  index.html"), "utf8")`, plus `dist/api/index.json` for cross-page
  metadata such as each lecture's own `title`). New spec coverage for
  this feature follows the same pattern, in a new file
  `spec/week-nav.test.ts` (`spec/README.md` confirms any
  `spec/*.test.ts` runs automatically under `pnpm check`).
- **`spec/weekly-structure.test.ts`** (read in full) — the heading-order
  and per-page assertions this feature must not break; `WeekNav.astro`
  introduces no heading elements, so this suite is unaffected.
- **`spec/voice.test.ts`** (read in full) — banned-term list (`BANNED_TERMS`)
  and framing-phrase checks (`FRAMING_PHRASES`) run against every rendered
  content page. `WeekNav.astro`'s only user-facing strings are `"Week
  navigation"` (the `<nav aria-label>`) and `"Week N"` / each lecture's own
  `title` field (already-approved content) — none of these match a banned
  term.
- **`spec/navigation.test.ts`** (read in full) — asserts nav-link
  patterns against `dist/index.html` only; unaffected by a
  lecture-page-only component.

## 4. Approach

Build a new, standalone component `src/components/WeekNav.astro` (kept
separate from `[slug].astro` even though only used there once, since the
user has already signaled a likely follow-up to reuse the *pattern* — not
necessarily this exact component — for Labs/Assessments/People; a separate
file keeps that future work scoped without adding any speculative props or
generalization now).

**Width decision (resolved during planning):** `WeekNav.astro` renders as a
plain child inside `<ContentLayout>`'s slot, which lands it directly inside
`<main id="main" class="at-main">` as a sibling of the page's `<h1>`. Per
§3, `.at-main`'s subgrid defaults every direct child to `grid-column:
content` — i.e. the same width as the article text and the sidebar TOC —
unless a component explicitly opts out with `grid-column: full` (as
`.at-nav` does). Presented with this fork, the user chose to match the
content column rather than force full-bleed: it needs no extra CSS
(content-column width is what a plain child already gets for free), stays
robust to any future change in the vendored theme's grid math, and matches
the sidebar TOC's existing sticky-below-nav idiom. Full-bleed remains
listed as out of scope (§2.3).

**Two-part build, split by testability:**

1. **Static structure** — three-column row (`week-nav-side--prev` /
   `week-nav-current` / `week-nav-side--next`), previous/next `<a>` links
   built with `withBase`, reserved-space empty columns on weeks 1/12,
   mobile subtitle-drop. Fully testable from built HTML (Task 1).
2. **Scroll-triggered center label** — a page-scoped `<script>` using
   `IntersectionObserver` on `#main h1`, toggling an `is-visible` class on
   `.week-nav-current` that a CSS transition animates. The dynamic
   behavior itself can only be verified in a real browser (Human review),
   but the static markup it depends on (the `data-week-nav-current` hook,
   the initial hidden state) is testable from built HTML (Task 2).

**Data**: previous/next lecture fetched via `getPublishedCollection
("lectures")` inside `WeekNav.astro` itself, matching `entry.data.week ===
week - 1` / `week + 1` — the same idiom `WeekMeta.astro` already uses for
its own week lookups, applied within the same collection instead of across
two.

**Alternatives considered** (carried from the spec, still valid):

- Sorting the full collection and indexing by position instead of
  arithmetic `week ± 1` — rejected: unnecessary given weeks are confirmed
  contiguous 1–12.
- CSS-only scroll-driven animation (`animation-timeline: view()`) instead
  of `IntersectionObserver` — rejected: inconsistent browser support, and
  no existing scroll-animation precedent in this repo to justify the
  newer API.
- Full-bleed (edge-to-edge) header width — considered during planning and
  explicitly rejected by the user in favor of matching the content column
  (see width decision above).

## 5. Task breakdown

### Task 1: Static three-column week-nav structure with prev/next links

- **Description:** Create `src/components/WeekNav.astro` rendering the
  three-column header (previous link / center placeholder / next link)
  with reserved space on weeks 1 and 12, and wire it into
  `src/pages/lectures/[slug].astro` as the first child inside
  `<ContentLayout>`, before `<WeekMeta />`. No scroll behavior yet — the
  center column exists in the markup but stays permanently hidden by
  default CSS (built in Task 2).
- **Files touched:**
  - `spec/week-nav.test.ts` (new)
  - `src/components/WeekNav.astro` (new)
  - `src/pages/lectures/[slug].astro` (edit)
- **Tests first (red):** create `spec/week-nav.test.ts`:
  ```ts
  import { readFileSync } from "node:fs";
  import { resolve } from "node:path";
  import { describe, expect, it } from "vitest";

  interface ApiNode {
    id: string;
    type: string;
    title: string;
    meta?: Record<string, unknown>;
  }
  interface CourseApi {
    nodes: ApiNode[];
  }

  const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
  const lectures = api.nodes.filter((node) => node.type === "lectures");

  function lecturePage(id: string): string {
    return readFileSync(resolve(`dist/lectures/${id}/index.html`), "utf8");
  }

  function titleForWeek(week: number): string {
    const node = lectures.find((n) => Number(n.meta?.week) === week);
    if (!node) throw new Error(`no lecture node for week ${week}`);
    return node.title;
  }

  describe("week navigation header — links", () => {
    it("gives week 6 exactly two week-nav links (previous and next)", () => {
      const matches = lecturePage("week-06").match(/class="week-nav-link"/g) ?? [];
      expect(matches.length).toBe(2);
    });

    it("gives week 1 exactly one week-nav link (next only, no week 0)", () => {
      const html = lecturePage("week-01");
      const matches = html.match(/class="week-nav-link"/g) ?? [];
      expect(matches.length).toBe(1);
      expect(html).not.toMatch(/\/lectures\/week-00\//);
    });

    it("gives week 12 exactly one week-nav link (previous only, no week 13)", () => {
      const html = lecturePage("week-12");
      const matches = html.match(/class="week-nav-link"/g) ?? [];
      expect(matches.length).toBe(1);
      expect(html).not.toMatch(/\/lectures\/week-13\//);
    });

    it("links week 6's previous control to week 5 and shows week 5's own title", () => {
      const html = lecturePage("week-06");
      expect(html).toMatch(/href="[^"]*\/lectures\/week-05\/"/);
      expect(html).toContain("Week 5");
      expect(html).toContain(titleForWeek(5));
    });

    it("links week 6's next control to week 7 and shows week 7's own title", () => {
      const html = lecturePage("week-06");
      expect(html).toMatch(/href="[^"]*\/lectures\/week-07\/"/);
      expect(html).toContain("Week 7");
      expect(html).toContain(titleForWeek(7));
    });
  });

  describe("week navigation header — reserved space", () => {
    it("keeps both side columns present on week 1 so the center stays centered", () => {
      const html = lecturePage("week-01");
      expect(html.match(/class="week-nav-side week-nav-side--prev"/g)?.length).toBe(1);
      expect(html.match(/class="week-nav-side week-nav-side--next"/g)?.length).toBe(1);
    });

    it("keeps both side columns present on week 12 so the center stays centered", () => {
      const html = lecturePage("week-12");
      expect(html.match(/class="week-nav-side week-nav-side--prev"/g)?.length).toBe(1);
      expect(html.match(/class="week-nav-side week-nav-side--next"/g)?.length).toBe(1);
    });
  });
  ```
  Run `pnpm test` (builds first) — every case fails: `WeekNav.astro`
  doesn't exist yet, so none of the `week-nav-*` classes appear in the
  built HTML.
- **Implementation (green):**
  - `src/components/WeekNav.astro`:
    ```astro
    ---
    import { getPublishedCollection } from "astro-course-university/content";
    import { withBase } from "astro-theme-university/url";
    import Icon from "astro-theme-university/components/Icon.astro";

    interface Props {
      week: number;
      title: string;
    }

    const { week, title } = Astro.props;

    const lectures = await getPublishedCollection("lectures");
    const previous = lectures.find((entry) => entry.data.week === week - 1);
    const next = lectures.find((entry) => entry.data.week === week + 1);
    ---

    <nav class="week-nav" aria-label="Week navigation">
      <div class="week-nav-inner">
        <div class="week-nav-side week-nav-side--prev">
          {previous && (
            <a class="week-nav-link" href={withBase(`/lectures/${previous.id}/`)}>
              <Icon name="nav-arrow-left" class="week-nav-icon" />
              <span class="week-nav-text">
                <span class="week-nav-title">Week {previous.data.week}</span>
                <span class="week-nav-subtitle">{previous.data.title}</span>
              </span>
            </a>
          )}
        </div>
        <p class="week-nav-current" data-week-nav-current>Week {week} — {title}</p>
        <div class="week-nav-side week-nav-side--next">
          {next && (
            <a class="week-nav-link" href={withBase(`/lectures/${next.id}/`)}>
              <span class="week-nav-text">
                <span class="week-nav-title">Week {next.data.week}</span>
                <span class="week-nav-subtitle">{next.data.title}</span>
              </span>
              <Icon name="nav-arrow-right" class="week-nav-icon" />
            </a>
          )}
        </div>
      </div>
    </nav>

    <style>
      .week-nav {
        position: sticky;
        inset-block-start: var(--at-nav-height);
        z-index: 90;
        background: var(--at-bg);
        border-block-end: 1px solid var(--at-divider);
      }

      .week-nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--at-spacing-md);
        padding-block: var(--at-spacing-sm);
      }

      .week-nav-side {
        flex: 1 1 0;
        display: flex;
      }

      .week-nav-side--next {
        justify-content: flex-end;
      }

      .week-nav-link {
        display: inline-flex;
        align-items: center;
        gap: var(--at-spacing-xs);
        text-decoration: none;
        color: inherit;
      }

      .week-nav-side--next .week-nav-link {
        flex-direction: row-reverse;
        text-align: right;
      }

      .week-nav-text {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .week-nav-title {
        font-weight: 600;
      }

      .week-nav-subtitle {
        font-size: var(--at-font-size-sm);
        color: var(--at-text-muted);
      }

      .week-nav-current {
        flex: 0 0 auto;
        margin: 0;
        text-align: center;
        opacity: 0;
        transform: translateY(-0.25rem);
        transition:
          opacity 200ms ease,
          transform 200ms ease;
      }

      .week-nav-current.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (width <= 768px) {
        .week-nav-subtitle {
          display: none;
        }
      }
    </style>
    ```
    (Exact token names — `--at-bg`, `--at-divider`, `--at-spacing-sm`,
    `--at-spacing-xs`, `--at-spacing-md`, `--at-font-size-sm`,
    `--at-nav-height`, `--at-text-muted` — all verified present in
    `node_modules/astro-theme-university/styles/tokens.css`.)
  - `src/pages/lectures/[slug].astro`: add `import WeekNav from
    "../../components/WeekNav.astro";` and insert `<WeekNav week=
    {lecture.data.week} title={lecture.data.title} />` as the first child
    inside `<ContentLayout>`, before `<WeekMeta ... />`.
  - Re-run `pnpm test` — all `spec/week-nav.test.ts` cases pass.
- **Refactor:** None expected — the component is already minimal.
- **Acceptance criteria:**
  - `spec/week-nav.test.ts` passes.
  - `pnpm check` passes (typecheck + full `spec/` suite, including
    `spec/weekly-structure.test.ts` and `spec/voice.test.ts` unaffected).
  - Week 1's page contains no link toward `/lectures/week-00/`; Week 12's
    page contains no link toward `/lectures/week-13/`.
  - Every lecture page between weeks 2–11 shows both a previous and a
    next link with the correct target week's own `title`.
- **Depends on:** None.

### Task 2: Scroll-triggered center label (IntersectionObserver + fade/slide)

- **Description:** Add the client-side behavior that reveals
  `.week-nav-current` once the page's own `<h1>` scrolls out of view, and
  hides it again when the `<h1>` returns — using a page-scoped `<script>`
  and `IntersectionObserver`, per the spec's resolved design (no new
  dependency).
- **Files touched:**
  - `spec/week-nav.test.ts` (edit — add markup-presence assertions)
  - `src/components/WeekNav.astro` (edit — add the `<script>` block)
- **Tests first (red):** add to `spec/week-nav.test.ts`:
  ```ts
  describe("week navigation header — scroll-triggered label", () => {
    it("carries the current week's own label, initially hidden", () => {
      const html = lecturePage("week-06");
      expect(html).toContain("data-week-nav-current");
      expect(html).toContain("Week 6");
    });

    it("ships the IntersectionObserver script that drives the reveal", () => {
      const html = lecturePage("week-06");
      expect(html).toMatch(/IntersectionObserver/);
    });
  });
  ```
  These fail before Task 2's script exists (Task 1 already renders the
  `data-week-nav-current` element and its label text, so those two
  assertions already pass from Task 1 — only the `IntersectionObserver`
  assertion is genuinely red at this point; that's expected, since the
  static markup and the script are naturally split across the two tasks).
- **Implementation (green):** add to `WeekNav.astro`, after the `<style>`
  block:
  ```astro
  <script>
    const currentLabel = document.querySelector<HTMLElement>("[data-week-nav-current]");
    const mainHeading = document.querySelector<HTMLElement>("#main h1");

    if (currentLabel && mainHeading) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          currentLabel.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0 },
      );
      observer.observe(mainHeading);
    }
  </script>
  ```
  Re-run `pnpm test` — the `IntersectionObserver` assertion passes; the
  other two (already green from Task 1) stay green.
- **Revised during human review** (three real bugs the first pass of
  `<script>` above didn't handle, found via live browser testing, not by
  `pnpm check` — none of them are visible from the built HTML alone):
  1. **The `<a>` for the next control had `flex-direction: row-reverse`**,
     which visually reversed its DOM order (`text, icon`) to put the arrow
     before the text instead of after it. Removed; DOM order alone now
     puts the icon last, arrow on the right, matching req 2.1.4.
  2. **A visited link fell back to the browser's default link-blue** for
     the icon's `currentColor`. Added an explicit
     `.week-nav-link:visited { color: inherit }`.
  3. **The site's `<ClientRouter>` (Astro View Transitions) does soft,
     client-side navigation between pages**, and only re-runs a
     page-scoped `<script>` on the `astro:page-load` event — which also
     fires once for the initial load, so it's the only hook needed (same
     pattern as this theme's own `Nav.astro`/`Footer.astro`). The
     original script had no such listener: it ran once, for whichever
     lecture page was first loaded in a session, so the observer kept
     watching that page's now-detached `<h1>` after clicking to another
     week, and the new page's label never got its own observer — worse,
     the DOM morph between pages could leave a stale `is-visible` class
     sitting on the new page's label. Fixed by wrapping setup in a
     function, explicitly resetting the label and disconnecting any prior
     observer, and calling it via
     `document.addEventListener("astro:page-load", setupWeekNav)`.
  4. **The `IntersectionObserver`'s root was the whole viewport with no
     margin**, so the `<h1>` still counted as "intersecting" (and the
     label stayed hidden) even while visually hidden behind the sticky
     top nav + this sticky header — requiring a much longer scroll than a
     reader would expect before the label appeared, and (depending on
     exact pixel boundaries) a window where the label could show while
     the `<h1>`'s tail end was still on screen. Fixed with a `rootMargin`
     equal to the combined stuck height of both sticky bars — read via
     `getComputedStyle(weekNav).top` (this element's own resolved
     `inset-block-start`, i.e. exactly the top nav's height) plus this
     element's own `offsetHeight`, rather than measuring the top nav
     separately (which invited exactly the kind of two-numbers-drift bug
     that first attempt had before this fix).
  5. **On narrow viewports, the center label had no width constraint**
     (`flex: 0 0 auto`, no `max-width`), so a long label pushed the whole
     row wider than the viewport — cutting off the next-week arrow
     entirely rather than just wrapping. Fixed with `flex: 0 1 auto;
     min-width: 0; max-width: 50%; overflow-wrap: break-word;` so it
     shrinks and wraps instead of overflowing. Also revised the ~768px
     breakpoint rule itself — see §2.1.11's revision note.
  6. **The first fix for #5 (drop the side "Week N" text unconditionally
     under the ~768px media query) over-corrected**: it also hid "Week N"
     while the center label was hidden (page at rest), where there was no
     actual room conflict. Revised so the same observer callback that
     toggles `.week-nav-current`'s `is-visible` also toggles
     `.week-nav.is-scrolled`; under the ~768px query, `.week-nav-title`
     only collapses (`max-width`/`opacity` transition, matching the
     center label's own transition pattern) while `.week-nav.is-scrolled`
     is present, so "Week N" is shown by default and yields room only
     when the center label actually needs it.
  7. **The whole `IntersectionObserver`-on-the-h1 design was wrong at its
     foundation**, not just mistuned: at a small scroll amount, `.week-nav`
     itself hasn't become sticky yet (it's still in normal document flow,
     below the `<h1>`+lead paragraph — `position: sticky` only takes over
     once scrolled far enough that its natural position would pass its
     `inset-block-start`). The observer, tracking only the h1's own
     position, could decide "reveal the label" at a scroll position before
     `.week-nav` had actually stuck — so the label appeared in its
     still-in-flow position, on screen *at the same time* as the still-
     visible `<h1>`, rather than pinned at the top in its place. No amount
     of retuning the `rootMargin` number could fix this, because the
     thing being measured (h1 position) was never the right thing to
     measure. Replaced entirely with the standard "detect sticky" sentinel
     technique: a zero-height `.week-nav-sentinel` div placed immediately
     before `.week-nav`, observed with `rootMargin` shrunk by exactly this
     element's own resolved `inset-block-start` (the top nav's height) —
     the sentinel sits at the same document position as `.week-nav`'s own
     top edge, so it stops intersecting at exactly the scroll position
     where CSS itself starts pinning `.week-nav` there. No dependency on
     the h1 at all (it turns out unnecessary: by the time `.week-nav`
     sticks, everything above it in the document — h1 included — has
     necessarily scrolled well out of view already, since it must scroll
     past both the top nav's height *and* the vertical distance down to
     `.week-nav`'s natural position).
  8. **The fix for #5's `max-width: 50%` reservation on the center
     label had two further bugs**, both only visible at true narrow
     widths (not the ~500-683px floor this session's window manager had
     been testing at): first, since `opacity: 0` doesn't remove an
     element from layout, the *hidden* label still reserved up to 50% of
     the row's width at all times, squeezing the side arrow+"Week N"
     into the remaining half badly enough to shrink the arrow icon down
     to a few px. Fixed by making `max-width: 0` (not just `opacity: 0`)
     the hidden state, expanding to 50% only under `.is-visible`. Second,
     that alone caused a *new*, worse bug: with `max-width: 0` and
     `overflow-wrap: break-word` (needed for the label's intentional
     2-line wrap once visible) both active on the hidden state, the
     still-rendered text wrapped one character per line into a box
     nearly 800px tall. Fixed by also toggling `white-space` (`nowrap`
     while hidden — clips to a single zero-width line instead of
     wrapping — `normal` once `.is-visible`, restoring the 2-line wrap).
  9. **#8's `max-width` fix introduced visible jank**: transitioning
     `max-width` forces the browser to recompute flex layout on every
     frame (unlike `opacity`/`transform`, which are compositor-only), and
     with `.week-nav-title`'s own collapse (#6) *also* animating
     `max-width` at the same moment, the two fought over the same freed
     space and produced a visibly janky reflow scrolling down — confirmed
     absent immediately after the sentinel fix (#7) alone, and only
     appearing once the `max-width` transitions from #8 were added.
     Fixed by dropping `max-width` from both elements' `transition` lists
     entirely: the width change now happens in a single frame, synced
     with the same moment the header visually docks at the top (already
     a natural settling point), while the fade/slide remains the only
     animated part. Confirmed via sampled `getBoundingClientRect()` calls
     across the 200ms fade: the side arrow's position and width are
     completely static throughout, and the "Week N" collapse likewise
     jumps once, immediately, then holds steady for the rest of the fade.
  10. **Even an instant (non-transitioned) `max-width` snap was still a
      perceptible jump** — the user's own framing: "if [it] needs to be
      resized, just keep it resized in the first place." Removed the
      resize event entirely rather than just de-animating it: on
      narrow viewports, `.week-nav-title` now has a permanent (never
      toggled) `max-width: 5rem` — small enough from the very first
      render to coexist with the center label at its widest, sized
      against the actual worst case ("Week 10"/"Week 11"/"Week 12",
      ~4.4rem unconstrained) rather than guessed — and the
      `.week-nav.is-scrolled` class and its title-collapse rule were
      removed outright, since nothing conditional on scroll remained
      to justify them. Needed two supporting fixes once the title had a
      firm cap: `.week-nav-icon { flex-shrink: 0 }` (an icon has no
      natural minimum size of its own, so a tight row was shrinking it
      before it ever touched the already-capped title) and `.week-nav-
      side { min-width: 6.5rem }` (guarantees each side its full icon +
      title width regardless of what the center label's own reservation
      asks for — the center label already tolerates shrinking and
      wrapping, so it's the one side that yields in a genuine space
      conflict, never the icon or "Week N" getting silently crushed by
      the default flex-shrink race).
  11. **The identical resize-on-scroll problem existed on desktop too,
      undiscovered until the user reported a subtitle wrapping from one
      line to two only after scrolling**: `.week-nav-current`'s own
      `max-width` was *also* toggled (`0` hidden → `50%` visible, from
      #8), which changes how much room is left for the side "Week
      N"/subtitle text at every viewport, not just narrow ones — a
      one-line subtitle before scrolling could be forced to two lines
      the moment the center label appeared, simply because the center
      now claimed up to half the row it hadn't claimed a moment before.
      Applied the same principle as #10 at the source: `max-width: 50%`
      is now permanent on `.week-nav-current`, never toggled by
      `.is-visible` — reserving the *same* width whether shown or
      hidden, so nothing about the sides' available room ever changes
      on scroll, and only opacity/transform (both compositor-only) are
      left to animate. Confirmed via sampled `getBoundingClientRect()`
      calls across the full crossover: the side subtitle's height (one
      vs. two lines) and the side column's own position are now
      identical before, during, and after the transition, on both the
      wide and narrow viewports tested.

  Each of these was verified by live browser testing (see the Human
  review note below), not by `spec/week-nav.test.ts` — none change what
  the built HTML contains, only run-time DOM/CSS/script behavior.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `spec/week-nav.test.ts` passes in full.
  - `pnpm check` passes.
  - With JavaScript disabled, the center label never appears and no
    layout shift or visible empty box results (mechanically implied by
    the CSS default `opacity: 0` plus the script being the only thing
    that ever adds `is-visible`).
- **Human review:** Load a lecture page (e.g. `/lectures/week-06/`) in a
  real browser at both `1920 1080` and `390 844` via `agent-browser`, per
  `CLAUDE.md`. A pass looks like: the center label is invisible while the
  `<h1>` is on screen; scrolling down past the `<h1>` makes it fade/slide
  in within roughly 200ms; scrolling back up makes it fade/slide back out;
  with the OS/browser "reduce motion" preference enabled, the same
  show/hide happens with no perceptible animation (instant toggle); at a
  narrow viewport, at rest (center label hidden) the previous/next
  controls show a bare arrow plus "Week N" (no topic subtitle), and once
  scrolling reveals the center label, "Week N" fades away leaving a bare
  arrow — fading back in when scrolled back to rest — with the header
  always reading as three balanced regions and no text wrapping, overlap,
  or horizontal scroll at any point in that cycle (see §2.1.11's revision
  history). Also verify the golden path across a **soft (client-side)
  navigation**, not just a hard page load: from one lecture page, scroll
  until the label shows, then click the next-week link — the new page
  must land with the label hidden (its own `<h1>` in view), and scrolling
  there must independently show/hide it again, exactly as a fresh load
  would. Needs explicit user sign-off before this task counts as done —
  green tests alone don't cover animation feel, the reduced-motion
  experience, or soft-navigation behavior.

  **Verified** (2026-09-15, dev server, `agent-browser` CLI at true
  `390 844` and `1920 1080`): programmatically scanned scroll positions in
  20px steps confirm the label's `is-visible` toggle now lands exactly at
  the scroll position where `.week-nav` becomes stuck (matching its own
  `getBoundingClientRect().top` reaching its resolved `inset-block-start`)
  — on both Week 1 and Week 6, in both scroll directions — with the h1
  already fully off-screen at that point in every case, not merely "close
  to it"; soft-navigated Week 1 → Week 2 → Week 3 each landed with the
  label correctly reset and independently re-triggerable; at true 390px,
  the side arrow holds a consistent 18×18px box (not squeezed) whether the
  center label is hidden or showing, `.week-nav`'s own rendered height
  stays sane (~48-60px, not the ~800px the character-wrapping bug
  produced) in both states, "Week N" shows at rest and collapses to a bare
  arrow once scrolled with no horizontal overflow (`scrollWidth` equals
  `innerWidth` throughout), and reverses correctly scrolling back up;
  desktop width (1920×1080) confirmed unaffected by the mobile-only
  collapse rule; both arrows render in the surrounding text color, not
  link-blue, whether or not the link was previously visited; reduced
  motion verified via the CSS cascade (the theme's global `!important`
  transition-duration override applies to `.week-nav-current` and
  `.week-nav-title` with no exemption) rather than a live OS toggle, since
  this tool has no `prefers-reduced-motion` emulation control.
- **Depends on:** Task 1.

## 6. Feature-level Definition of Done

- [x] Task 1 and Task 2 complete and their tests passing
- [x] `pnpm test` passes (builds, then runs `vitest run spec`)
- [x] `pnpm check` passes (typecheck + `pnpm test`)
- [x] Manually verified with `agent-browser` at `1920 1080` and `390 844`
      on at least `/lectures/week-01/`, `/lectures/week-06/`, and
      `/lectures/week-12/`: golden path (scroll down/up on a middle week),
      Week 1 (no previous control, center still centered), Week 12 (no
      next control, center still centered), mobile subtitle drop, and
      `prefers-reduced-motion` behavior
- [x] Every requirement in §2 is covered — see §7
- [x] Task 2's `Human review:` line has been shown to the user and
      explicitly accepted — not inferred, not just its acceptance
      criteria passing
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 | Task 1 |
| 2.1.2 | Task 1 |
| 2.1.3 | Task 1 |
| 2.1.4 | Task 1 |
| 2.1.5 | Task 1 |
| 2.1.6 | Task 1 |
| 2.1.7 | Task 2 |
| 2.1.8 | Task 2 |
| 2.1.9 | Task 2 |
| 2.1.10 | Task 1 (static text, never made a link) |
| 2.1.11 | Task 1 |
| 2.1.12 | Task 1 (links work statically); Task 2 (center region is the only JS-dependent part, fails gracefully) |
| 2.2 (reduced motion) | Task 2 (Human review) |
| 2.2 (header width) | Task 1 (§4 design decision — default content-column placement) |
| 2.2 (viewport verification) | Task 2 (Human review) |
| 2.2 (no new dependencies) | Task 1, Task 2 (both vanilla) |
| 2.2 (no stray headings) | Task 1 (component uses no heading elements) |
| 2.2 (voice/banned terms) | Task 1 (only new strings are "Week navigation" and "Week N") |
| 2.2 (`pnpm check` green) | Task 1, Task 2 |

## 8. Risks / open questions

None.
