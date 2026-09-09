# SLOP1521 visual treatment: the straight face the content plays against

- **Date:** 2026-09-09
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-09 (via
  `specs/2026-09-09-slop1521-introduction-to-life.md`)

## 1. Summary

The third and last of three plans for the COMP4020 Assignment 2 course website.
Plan 1 (`plans/2026-09-09-slop1521-foundation.md`) built the shell; Plan 2
(`plans/2026-09-09-slop1521-curriculum.md`) wrote the course. This plan restyles
what they produced so the site reads as a real university handbook rather than a
joke website — because the content is absurd and deadpan only works against a
straight face.

The argument, from the spec §4.6: a playful surface tells the reader it is a joke
before they read a word, which leaves the satire nothing to do. So every decision
here is restraint. The centrepiece is not decoration: the course's borrowed
systems vocabulary gets set in mono, exactly as a real course site sets code, so
the design makes the same joke the content does in a different medium — and that
is the one visual decision a test can hold.

This plan is voice work under the brief's "response to the brief" criterion
(35%), not correctness work. The brief is explicit that the artefact criterion
(20%) asks whether the site *works*, not what it looks like, and that a course
keeping the starter's look can still land HD on every criterion. So this plan is
pure upside and can be stopped at any task boundary without breaking anything.

## 2. Requirements

### 2.1 Functional requirements

1. **F3.1** Site-wide styling lives in one imported stylesheet,
   `src/styles/course.css`, wired into `src/layouts/PageLayout.astro`. No
   treatment rule is scattered into individual pages.
2. **F3.2** `--at-heading` resolves to the body ink rather than the brand gold,
   so headings are not gold.
3. **F3.3** The measure is ≈68ch: `--at-content-width` is `38rem`.
4. **F3.4** `--at-border-radius` is `0` and all three `--at-shadow-*` tokens are
   `none` — rules and tables, not cards and elevation.
5. **F3.5** Headings render in a serif family; body copy stays Public Sans.
6. **F3.6** The heading scale is tightened so the h1→h2 step reads as a handbook
   rather than a landing page.
7. **F3.7** (spec check 10) Every term in the systems glossary — `subsystem`,
   `root cause`, `unscheduled downtime`, `regression testing`, `telemetry`,
   `manual override` — appears **only** inside a `<code>` element on every
   rendered page, never as bare prose.
8. **F3.8** The lecture and Lab listings render as **schedule tables**, not card
   grids, each with a horizontal-scroll container so they do not overflow the
   page at 390px.
9. **F3.9** The assessment listing, the people listing and the homepage
   destination cards render as ruled lists rather than shadowed, rounded cards,
   and the homepage tag pills lose their `999px` radius.
10. **F3.10** Every lecture and Lab page carries a spec-sheet metadata block
    (Week · Date · its paired Lecture or Lab · Reflection due) in place of the
    bare date paragraph.
11. **F3.11** No entrance animation runs on any page: the theme's
    `hero-fade-up` is overridden.
12. **F3.12** Every remaining transition is between 120ms and 180ms.
13. **F3.13** The brand gold is used for accents only — links, rules, table
    headers — and never as a large background fill.
14. **F3.14** Colour contrast still meets WCAG AA after every override; `pnpm
    build`'s axe pass stays green.

### 2.2 Non-functional requirements

- The three brand inks (`--at-primary`, `--at-secondary`, `--at-tertiary`), the
  lockup/crest/favicon assets and the Slop University name are **fixed** and
  must not be redefined (spec §3.2).
- `pnpm check` passes at every task boundary. The build runs axe over every
  rendered page.
- Verified with `agent-browser` at `1920 1080` **and** `390 844`. The phone
  viewport is the binding constraint for tables and the tightened type scale.
- No new webfont is loaded (see §2.4.1). `astro.config.ts` changes only to
  register `course.css` in `brandCss` (Task 1 execution-time finding) — its
  font/integration configuration is otherwise untouched.
- `prefers-reduced-motion` must keep working — the theme already handles it
  globally and this plan must not defeat it.

### 2.3 Out of scope

- Any content change. If a treatment task reveals a content problem, fix it in
  the Plan 2 file it belongs to, not here.
- Redefining the three brand inks, or replacing the lockup, crest or favicon.
- `src/decks/theme.css` beyond what F3.5/F3.6 imply. The deck derives its
  colours from the same brand tokens, so it follows the token work for free;
  restyling the deck's own layout is not planned.
- Dark mode as a separate design. The theme's tokens are all `light-dark()`
  pairs, so overrides inherit both; nothing here hard-codes a light-only colour.
- `PROCESS.md` — the user writes it.

### 2.4 Assumptions

1. **Headings use a system serif stack, not a webfont.** The theme owns the
   `astro:fonts` configuration (`node_modules/astro-theme-university/index.ts:170,180`
   registers Public Sans and Roboto Mono), and `astro.config.ts`'s integration
   list is part of the fixed build pipeline. A system stack
   (`"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif`) reads as
   handbook, costs no bytes, cannot regress font loading, and needs no change to
   fixed files. Adding a webfont remains available later if the user wants it.
2. **The glossary is six multi-word-or-unambiguous terms.** `baseline` was
   considered and dropped: it appears inside the Week 1 title "baseline human
   functionality" and in ordinary prose, so an every-occurrence-in-`<code>` rule
   on it would fight the content rather than discipline it.
3. **Mono glossary markup is markdown backticks**, not a component. Content is
   `.md`, where a component cannot be used inline, and backticks are exactly how
   a real course site marks code. No remark plugin — the theme owns the markdown
   chain.

## 3. Existing code context

Every value below was read from source on 2026-09-09.

### 3.1 What is fixed, and what is ours

`node_modules/astro-theme-slop/slop.css` in full is four declarations:

```css
:root {
  --at-primary: #b97d1c;    /* lockup gold */
  --at-secondary: #8a5c13;  /* bronze */
  --at-tertiary: #6b6154;   /* warm grey */
  --at-logo-offset-x: -5.9%;
}
```

That, plus the lockup/crest/favicon SVGs and the site name, is the whole fixed
brand surface. The theme derives every semantic colour from those three via
relative colour syntax. Everything else in §3.2 is ours.

### 3.2 Theme token values this plan overrides

From `node_modules/astro-theme-university/styles/tokens.css`, inside
`@layer at.tokens`:

```css
--at-font-body: var(--font-public-sans, "Public Sans"), -apple-system, …, sans-serif;
--at-font-mono: var(--font-roboto-mono, "Roboto Mono"), "SFMono-Regular", …, monospace;
--at-font-size-base: 1.125rem;   --at-font-size-sm: 0.875rem;  --at-font-size-xs: 0.75rem;
--at-font-size-h1: 2.5rem;       --at-font-size-h2: 1.875rem;  --at-font-size-h3: 1.375rem;
--at-font-size-h4: 1.0625rem;    --at-font-size-h5: 0.9375rem; --at-font-size-h6: 0.8125rem;
--at-line-height: 1.6;           --at-line-height-heading: 1.25;
--at-content-width: 48rem;       --at-content-inset: var(--at-spacing-xl);
--at-gutter: var(--at-spacing-lg);  --at-nav-height: 6.5rem;
--at-spacing-xs: 0.25rem; --at-spacing-sm: 0.5rem; --at-spacing-md: 1rem;
--at-spacing-lg: 1.5rem;  --at-spacing-xl: 2rem;   --at-spacing-2xl: 4rem;
--at-border-radius: 0.375rem;
--at-shadow-sm: light-dark(0 1px 2px rgb(0 0 0 / 6%),  0 1px 2px rgb(0 0 0 / 60%));
--at-shadow-md: light-dark(0 2px 8px rgb(0 0 0 / 10%), 0 2px 8px rgb(0 0 0 / 65%));
--at-shadow-lg: light-dark(0 8px 32px rgb(0 0 0 / 20%), 0 12px 40px rgb(0 0 0 / 70%));
--at-heading: var(--at-primary);   /* ← headings are GOLD by default */
```

There are **87** `--at-*` tokens in total. The ink ramp is `--at-text`,
`--at-text-secondary` (78% alpha) and `--at-text-muted` (62% light / 56% dark),
all `light-dark()` pairs with a comment at `tokens.css:100-107` recording the
WCAG measurements behind those alphas — so F3.14 means not lowering them.

`--at-content-width: 48rem` against `--at-font-size-base: 1.125rem` is ≈85ch;
`38rem` is ≈68ch.

### 3.3 Cascade layers

`@layer at.tokens, at.base, at.components;` is declared in the document head, in
that order. An **unlayered** rule beats all three, and `base.css:493` documents
the theme using that trick itself. So `src/styles/course.css`, imported without a
`@layer` wrapper, wins over every theme rule — which is what makes a single
override file sufficient.

### 3.4 `src/layouts/PageLayout.astro` in full

```astro
---
import MdxPageLayout from "astro-theme-university/layouts/MdxPageLayout.astro";
import { siteConfig } from "../site-config";
---

<MdxPageLayout siteConfig={siteConfig} {...Astro.props}>
  <slot />
</MdxPageLayout>
```

This is the layout `universityTheme({ defaultLayout: ... })` points at in
`astro.config.ts`, and the README names it as where site-wide styling goes —
"a `<style is:global>` block, or a stylesheet it imports". F3.1 uses the
stylesheet form.

### 3.5 Motion the theme already ships

`node_modules/astro-theme-university/styles/base.css:476-486` already contains a
global `@media (prefers-reduced-motion: reduce)` block forcing
`animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`
and `transition-duration: 0.01ms !important`. **This plan inherits reduced-motion
support and must not defeat it** — no `!important` transition of our own.

Most theme transitions are already `0.15s` (`base.css:169,360`,
`components.css:149,380,469`), inside the 120–180ms budget. The exceptions:

- `components.css:187` — `transition: grid-template-rows 0.3s ease`
- `components.css:586` — `transition: transform 0.3s ease`
- `components.css:683` — `animation: hero-fade-up 0.6s ease both`
- `components.css:694` — `animation: hero-fade-up 0.6s ease 0.2s both`
- `components.css:277-281` — a scroll-driven `animation-timeline: scroll(self inline)`

The two `hero-fade-up` rules are **entrance animations**, which F3.11 removes.

### 3.6 Tables the theme already styles

`base.css:317-331`:

```css
thead { background: var(--at-table-header-bg); color: var(--at-table-header-text); }
th, td { padding: var(--at-spacing-sm) var(--at-spacing-md); text-align: start; }
tbody tr:nth-child(even) { background: var(--at-table-stripe); }
hr { border: none; border-block-start: 1px solid var(--at-divider);
     margin-block: var(--at-spacing-xl); }
```

So the schedule tables inherit sane header and stripe treatment; this plan adds
the scroll container and decides whether stripes stay.

### 3.7 The components this plan rewrites

All six live in `src/components/` and are ours. Current shape:

- `LecturesGrid.astro` — `getPublishedCollection("lectures")`, sorted
  `a.data.date.getTime() - b.data.date.getTime()`, rendered as
  `<CardGrid columns={2}>` of `<Card headingLevel="h2" title href>` with a
  `<small>Week {week} · {formatCourseDate(date)}</small>`.
- `SessionsGrid.astro` — same, sorted by `a.data.week - b.data.week`.
- `AssessmentsGrid.astro` — same, sorted by week, showing
  `Due {formatCourseDate(due)} · Weight: {weight}%` and a `· Draft` suffix when
  `data.draft`.
- `PeopleGrid.astro` — sorted by `roleOrder` then `title.localeCompare`, cards
  carry `image={person.data.photo ?? undefined}` and a `photoAlt()` helper that
  casts out of the generated types.
- `MarkingModel.astro` — a `<section aria-labelledby="how-marked">` rendering
  `weighted` as a `<table>` and `holistic` as a `<p>`.
- `TeachingTeam.astro` — `<ul>` of `<a href={withBase(...)}>{title}</a> — {role}`.

Imports used throughout: `getPublishedCollection` from
`astro-course-university/content`, `Card`/`CardGrid` from
`astro-theme-university/components/`, `formatCourseDate` from `../lib/dates`,
`withBase` from `astro-theme-university/url`.

### 3.8 The two page templates F3.10 changes

`src/pages/lectures/[slug].astro` renders, in order:

```astro
<ContentLayout title={`Week ${lecture.data.week}: ${lecture.data.title}`} …>
  <p><strong>{formatCourseDate(lecture.data.date)}</strong></p>
  {lecture.data.slides && <p><a href={withBase(lecture.data.slides)}>Open the slides</a></p>}
  <Content />
  <TeachingTeam teachers={lecture.data.teachers} />
  <RelatedContent entry={lecture} collections={graphCollections} />
</ContentLayout>
```

`src/pages/sessions/[slug].astro` is the same shape with
`title={`Week ${session.data.week} ${sessionLabels.singular}: ${session.data.title}`}`,
and a `<SpecList spec={session.data.spec}>` between `<Content />` and
`<TeachingTeam>`. Both derive `Content` from `await render(entry)` and get their
entry from `getStaticPaths`. The bare `<p><strong>{date}</strong></p>` in each is
what the spec-sheet block replaces.

### 3.9 Test setup

Identical to Plans 1 and 2. **vitest 4**, no config file.
`pnpm test` = `pnpm build && vitest run spec`; `pnpm check` adds `pnpm typecheck`.
Tests in `spec/*.test.ts` read `dist/` — for this plan, the rendered
`dist/**/index.html`, plus `dist/_astro/*.css` for the compiled stylesheet.
Convention from `spec/data-integrity.test.ts`: module-scope `readFileSync`, local
interfaces, `expect` with a message as its second argument.

Note that a treatment plan's tests can assert **structure and markup** (a table
exists; a term is inside `<code>`; no `hero-fade-up` in the CSS) but not
**appearance**. Appearance is verified in a browser at the two marking
viewports, which is why every task below carries a viewport acceptance
criterion.

## 4. Approach

One override file, imported once, ahead of everything.
`src/styles/course.css` is unlayered, so §3.3 makes it beat every theme rule
without `!important` and without touching a fixed file. Every treatment decision
lands there or in one of the six components in `src/components/`, which are ours.

Order runs cheapest-and-widest first. Task 1 is four token declarations and
changes the feel of every page at once — retargeting `--at-heading` off the brand
gold is a single line and is the highest-leverage change in the plan. Tasks 2–3
finish the global register (serif headings, tightened scale, the mono glossary).
Only then do the component rewrites land (Tasks 4–6), because they inherit the
tokens and would otherwise be styled twice. Task 7 sweeps the shared surfaces and
the motion budget. Task 8 is the verification pass that a treatment plan cannot
do incrementally: reading every page type at both viewports.

The mono glossary (Task 3) is the one part with a real test. It is asserted as
"every occurrence of each term is inside a `<code>` element" rather than "at
least one occurrence is", because the weak version would pass a page that marks
the term once and leaves nine bare — and inconsistency is exactly what would make
the device look like an accident.

**Alternative considered and rejected:** a `<style is:global>` block in
`PageLayout.astro` instead of an imported stylesheet. Both are sanctioned by the
README. Rejected because an imported file can be read by a `spec/` test through
the compiled CSS, keeps the layout to four lines, and does not re-run Astro's
scoped-style machinery on every page.

**Alternative considered and rejected:** adding a serif webfont through
`astro:fonts`. Rejected per §2.4.1 — the theme owns the font configuration and
`astro.config.ts` is the fixed build pipeline, so a system serif stack buys the
register at zero risk.

**Alternative considered and rejected:** keeping the card grids and merely
flattening them (radius 0, shadow none). Rejected because the week listing is
*schedule* data — twelve rows of week, date, title — and a real handbook renders
that as a table. Two-column cards also force the phone viewport into one very
long column, which is worse than a scrollable table.

## 5. Task breakdown

### Task 1: Add `src/styles/course.css` and override the four structural tokens

- **Description:** Create the single override stylesheet, wire it into the
  layout, and set the four token groups that carry the register: heading ink,
  measure, radius, shadows.
- **Files touched:** new `src/styles/course.css`; `src/layouts/PageLayout.astro`
  (existing); `astro.config.ts` (existing); new `spec/treatment.test.ts`.
- **Execution-time finding (resolved with the user before implementing):**
  `PageLayout.astro` is only reached by the theme's `defaultLayout` option,
  whose own docstring names it "Default layout for MDX pages without an
  explicit layout in frontmatter" — confirmed by rendering: only the four
  `.mdx` index pages and `404.html` got `course.css` inlined into `<head>`,
  while the homepage and every `[slug].astro` detail page (lectures,
  sessions, assessments) and `sessions/index.astro` call the theme's
  `ContentLayout` directly and never touch `PageLayout.astro`, so `pnpm
  build`'s compiled output never carried the override on those pages. Fixed
  by adding `./src/styles/course.css` to `universityTheme`'s `brandCss`
  array in `astro.config.ts`, alongside `astro-theme-slop/slop.css` — the
  same `injectScript("page-ssr", …)` mechanism that already gets the brand
  tokens onto every page regardless of layout. The `PageLayout.astro` import
  stays too, since F3.1 names it explicitly; the resulting duplicate
  `:root` declaration on the five pages already reached that way is
  harmless (last value wins, same value both times).
- **Tests first (red):** `spec/treatment.test.ts`. Read every file in
  `dist/_astro/` ending `.css` and concatenate them into one string, since Astro
  chooses the bundle name:
  - `it("ships the course stylesheet")` — the concatenated CSS contains
    `--at-content-width:38rem` (allowing optional whitespace).
  - `it("takes headings off the brand gold")` — contains a `--at-heading:`
    declaration whose value is not `var(--at-primary)`.
  - `it("squares every corner")` — contains `--at-border-radius:0`.
  - `it("removes elevation")` — contains `--at-shadow-sm:none`,
    `--at-shadow-md:none` and `--at-shadow-lg:none`.
  - `it("never redefines a fixed brand ink")` — the concatenated CSS from
    `src/styles/course.css` must not declare `--at-primary`, `--at-secondary` or
    `--at-tertiary`. Assert against the **source** file for this one
    (`readFileSync(resolve("src/styles/course.css"))`), because the bundle also
    contains `slop.css`, which legitimately declares all three.
- **Implementation (green):** `src/styles/course.css` with a single unlayered
  `:root` block:

  ```css
  :root {
    --at-heading: var(--at-text);
    --at-content-width: 38rem;
    --at-border-radius: 0;
    --at-shadow-sm: none;
    --at-shadow-md: none;
    --at-shadow-lg: none;
  }
  ```

  In `PageLayout.astro`, add `import "../styles/course.css";` to the frontmatter.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All five assertions pass; `pnpm check` green.
  - Headings render in the body ink, not gold, on the homepage and a week page.
  - No rounded corners or drop shadows anywhere at either viewport.
  - Measure is visibly narrower; no line exceeds ~70 characters at 1920×1080.
  - Links and the nav lockup still carry the brand gold (F3.13).
- **Depends on:** None. (Can run before Plan 2 finishes; it styles whatever
  exists.)

### Task 2: Set serif headings and tighten the heading scale

- **Description:** Introduce a `--course-font-heading` custom property with a
  system serif stack, apply it to `h1`–`h6`, and reduce the h1/h2 steps.
- **Files touched:** `src/styles/course.css`; `spec/treatment.test.ts` (extend).
- **Tests first (red):** extend `spec/treatment.test.ts`, against the
  concatenated `dist/_astro/*.css`:
  - `it("declares a serif heading family")` — contains
    `--course-font-heading` and the substring `serif`.
  - `it("applies the heading family to every heading level")` — contains a
    selector covering `h1` through `h6` with
    `font-family:var(--course-font-heading)`.
  - `it("tightens the display steps")` — contains `--at-font-size-h1:` with a
    value strictly less than `2.5rem`, and `--at-font-size-h2:` less than
    `1.875rem`. Parse the `rem` values and compare numerically rather than
    string-matching.
  - `it("leaves body copy on Public Sans")` — `src/styles/course.css` does not
    declare `--at-font-body`.
- **Implementation (green):** add to `src/styles/course.css`:

  ```css
  :root {
    --course-font-heading: "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
    --at-font-size-h1: 2rem;
    --at-font-size-h2: 1.5rem;
    --at-font-size-h3: 1.25rem;
  }

  h1, h2, h3, h4, h5, h6 { font-family: var(--course-font-heading); }
  ```

  Leave `--at-line-height-heading: 1.25` and h4–h6 as the theme sets them.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All four assertions pass; `pnpm check` green.
  - Headings render serif and body copy sans at both viewports.
  - The h1 on a week page does not wrap to three lines at 390px.
  - The heading hierarchy is still legible — h2 and h3 remain distinguishable.
- **Depends on:** Task 1.

### Task 3: Mark the systems glossary in mono, and enforce it

- **Description:** Establish the backtick convention for the six glossary terms
  across all content, and add the spec's check 10 as an
  every-occurrence assertion.
- **Files touched:** `src/styles/course.css`; every content file under
  `src/content/lectures/`, `src/content/sessions/`,
  `src/content/assessments/` and `src/pages/policies/index.mdx` that uses a
  glossary term; `src/course-config.ts`; `src/pages/index.astro`; new
  `spec/glossary.test.ts`.
- **Execution-time finding (resolved with the user before implementing):**
  four locations render a frontmatter/config string as plain interpolated
  text rather than through the markdown chain, so a backtick there produces
  a literal character, not a `<code>` element — `description:` on lectures
  week-01/02/04/05/12 and session week-01 (`ContentLayout`'s `<meta
  description>` and `<p class="lead">`), the `spec:` line on session
  week-08 (`SpecList.astro`'s `<li>`), the `marking.criteria[].name` in
  `assignment-3-adulting.md` (`MarkingModel.astro`'s `<td>`), and
  `courseMeta.description` in `src/course-config.ts` (the homepage). Resolved
  the same way as a glossary term in a heading below: reword each to drop the
  bare term rather than mark it as code, noted in this task's commit
  message. `src/pages/index.astro` is a distinct fifth case worth
  separating out: its body paragraphs use three of the terms in raw JSX
  markup (not a content-collection markdown file), so — unlike the
  frontmatter/config cases — the fix there is a literal `<code>` element in
  the template, not a reword.
- **Tests first (red):** `spec/glossary.test.ts`. Define
  `const GLOSSARY = ["subsystem", "root cause", "unscheduled downtime",
  "regression testing", "telemetry", "manual override"]`. Walk every
  `dist/**/index.html` (excluding `dist/decks/`, whose markdown chain differs,
  and `dist/404.html`). For each page and each term, case-insensitively:
  - `it("marks every glossary term as code")` — strip all
    `<code>…</code>` spans from the HTML, then assert the term does **not**
    appear in the remainder. Report the offending page and term in the `expect`
    message so a failure names the file to fix.
  - `it("actually uses the glossary")` — across all pages, at least four of the
    six terms appear inside a `<code>` element at least once, so the convention
    is exercised rather than merely vacuously satisfied.
  - `it("styles code as the systems register")` — the concatenated
    `dist/_astro/*.css` contains a `code` rule referencing
    `var(--at-font-mono)`.
- **Implementation (green):** wrap each glossary occurrence in backticks in the
  content files. No new `code` rule added to `src/styles/course.css`: the
  theme's own `base.css` already sets `code { font-family: var(--at-font-mono);
  font-size: var(--at-font-sm); background: var(--at-code-bg); border-radius:
  var(--at-border-radius); … }`, and Task 1 already took `--at-border-radius`
  to `0`, so the pill is already gone — a rule restating the same values would
  be dead duplication.
- **Refactor:** where a term appears in a heading, prefer rephrasing the heading
  over marking a heading word as code, since serif headings with inline mono read
  as a mistake. Note any such rephrasing in the task's commit message.
- **Acceptance criteria:**
  - All three assertions pass.
  - Deliberately un-backticking one occurrence makes the suite fail and names
    the page; verified once, then reverted.
  - Inline mono reads as deliberate at both viewports and does not break the
    line rhythm of body copy.
  - No glossary term is marked inside a heading.
- **Depends on:** Task 1; Plan 2 Tasks 1–10 (the content must exist to be
  marked).

### Task 4: Render the lecture and Lab listings as schedule tables

- **Description:** Replace both card grids with a single shared schedule-table
  treatment, in a horizontal-scroll container.
- **Files touched:** `src/components/LecturesGrid.astro`,
  `src/components/SessionsGrid.astro` (both existing); `src/styles/course.css`;
  `spec/treatment.test.ts` (extend).
- **Tests first (red):** extend `spec/treatment.test.ts`:
  - `it("renders the lecture listing as a table")` — `dist/lectures/index.html`
    contains `<table` and twelve `<tr` rows inside its `<tbody`.
  - `it("renders the Lab listing as a table")` — same for
    `dist/sessions/index.html`.
  - `it("heads both schedule tables with week, date and title")` — each page's
    `<thead>` contains `Week`, `Date` and `Title` (or the chosen column names,
    asserted exactly).
  - `it("keeps both tables in order")` — the week numbers in each `<tbody>`
    appear as `1`…`12` in ascending order.
  - `it("wraps wide tables in a scroll container")` — the concatenated CSS
    contains an `overflow-x:auto` rule for the wrapper class used by both
    components.
- **Implementation (green):** rewrite both components to emit

  ```astro
  <div class="course-schedule">
    <table>
      <thead><tr><th scope="col">Week</th><th scope="col">Date</th><th scope="col">Title</th></tr></thead>
      <tbody>{visible.map((e) => (
        <tr>
          <td>{e.data.week}</td>
          <td>{formatCourseDate(e.data.date)}</td>
          <td><a href={`/${collection}/${e.id}/`}>{e.data.title}</a></td>
        </tr>))}
      </tbody>
    </table>
  </div>
  ```

  keeping each file's existing `getPublishedCollection` call and sort (lectures
  by `date.getTime()`, sessions by `week`) and dropping the `Card`/`CardGrid`
  imports. Add a `.course-schedule { overflow-x: auto; }` rule to
  `src/styles/course.css`. Use the theme's existing `thead`/`th`/`td` styling
  (§3.6) rather than restating padding.
- **Refactor:** the two components are now near-identical. Leave them as two
  files rather than extracting a shared component: they read from different
  collections with different sorts, the duplication is ten lines, and the
  template's convention is one grid component per collection.
- **Execution-time note:** the plan's sample markup omits `withBase` on the
  row link; added it (`astro-theme-university/url`), matching this task's
  own acceptance criterion that links resolve under the base path — `Card`
  applied this automatically before, and a bare `href` would silently break
  it under GitHub Pages' base path.
- **Acceptance criteria:**
  - All five assertions pass; `pnpm check` green including axe (tables need
    `scope` on header cells, which the markup above supplies).
  - At 390×844 the table scrolls horizontally inside its container and **the
    page body does not scroll horizontally**.
  - At 1920×1080 the table fits without a scrollbar.
  - Every row's title still links to the right page under the base path.
- **Depends on:** Task 1; Plan 2 Tasks 7–10 — the row-count assertions require
  all twelve lectures and twelve Labs to exist.

### Task 5: Turn the assessment, people and homepage listings into ruled lists

- **Description:** Flatten the three remaining card surfaces to ruled lists, and
  remove the homepage's pill radius.
- **Files touched:** `src/components/AssessmentsGrid.astro`,
  `src/components/PeopleGrid.astro`, `src/pages/index.astro`,
  `src/styles/course.css`; `spec/treatment.test.ts` (extend).
- **Tests first (red):** extend `spec/treatment.test.ts`:
  - `it("lists assessments as rows, not cards")` —
    `dist/assessments/index.html` contains five rows carrying both a weight and
    a due date, and does not contain the theme's card-grid class.
  - `it("lists people as rows, not cards")` — `dist/people/index.html` contains
    four rows and no card-grid class.
  - `it("squares the homepage tag pills")` — `src/pages/index.astro` does not
    contain `999px`.
  - `it("keeps every role label")` — `dist/people/index.html` still contains
    `Convenor` and `Tutor`.
- **Implementation (green):** rewrite `AssessmentsGrid.astro` and
  `PeopleGrid.astro` to emit a ruled `<ul class="course-list">` — each item a
  heading-level link plus its metadata line — preserving each file's existing
  sort and, in `PeopleGrid`, the `roleOrder`/`roleLabels` maps and the
  `photoAlt()` helper (the cast ships without photos per Plan 1 §2.4.1, but the
  helper stays so a later portrait needs no code change). In
  `src/pages/index.astro`, replace the `.course-tags` `border-radius: 999px`
  with `0` and move the rule into `src/styles/course.css` alongside a
  `.course-list` rule using `--at-divider` for its rules.
- **Refactor:** move the whole `.course-tags` block out of `index.astro`'s
  scoped `<style>` into `src/styles/course.css`, so F3.1 holds and no treatment
  rule is left in a page.
- **Acceptance criteria:**
  - All four assertions pass; `pnpm check` green.
  - `/assessments/`, `/people/` and the homepage read as ruled lists with no
    shadows or rounded corners at both viewports.
  - Heading levels are unchanged (`h2` per item), so the document outline and
    axe both stay clean.
  - The homepage destination links still resolve under the base path.
- **Depends on:** Task 1; Plan 1 Task 3 (four cast entries) and Plan 2 Task 1
  (five assessments) — the row-count assertions require both.

### Task 6: Add the spec-sheet metadata block to lecture and Lab pages

- **Description:** Replace the bare date paragraph on both page templates with a
  metadata block giving Week, Date, the paired Lecture or Lab, and the
  reflection due that week.
- **Files touched:** new `src/components/WeekMeta.astro`;
  `src/pages/lectures/[slug].astro`, `src/pages/sessions/[slug].astro` (both
  existing); `src/styles/course.css`; `spec/treatment.test.ts` (extend).
- **Tests first (red):** extend `spec/treatment.test.ts`:
  - `it("gives every lecture a spec-sheet block")` — each of the twelve
    `dist/lectures/week-NN/index.html` contains `Week`, `Date`, `Lab` and
    `Reflection due` as row labels.
  - `it("gives every Lab a spec-sheet block")` — each of the twelve
    `dist/sessions/week-NN/index.html` contains `Week`, `Date`, `Lecture` and
    `Reflection due`.
  - `it("links each week to its counterpart")` — `dist/lectures/week-05/index.html`
    contains an href ending `/sessions/week-05/`, and
    `dist/sessions/week-05/index.html` contains one ending `/lectures/week-05/`.
  - `it("drops the bare date paragraph")` — `dist/lectures/week-05/index.html`
    does not contain `<p><strong>` immediately followed by a formatted date.
- **Implementation (green):** `src/components/WeekMeta.astro` with

  ```ts
  interface Props {
    week: number;
    date: Date;
    kind: "lecture" | "lab";
  }
  ```

  It calls `getPublishedCollection("sessions")` or `getPublishedCollection("lectures")`
  for the counterpart of the same `week`, uses `formatCourseDate` for both dates
  and `withBase` for the link, and renders a two-column definition list inside
  `<section class="course-specsheet">`. The reflection-due date is derived from
  the week: the prompt set in week *N* is due the Tuesday of week *N+1*, and
  weeks 11 and 12 are special-cased (week 11's is the last graded one; week 12's
  is ungraded). Then in each `[slug].astro`, replace
  `<p><strong>{formatCourseDate(...)}</strong></p>` with
  `<WeekMeta week={...} date={...} kind="lecture" | "lab" />`, leaving the
  slides link, `<Content />`, `<SpecList>`, `<TeachingTeam>` and
  `<RelatedContent>` untouched.
- **Refactor:** None expected. Do not fold `TeachingTeam` into `WeekMeta` — it
  is a separate section with its own `aria-labelledby`.
- **Acceptance criteria:**
  - All four assertions pass; `pnpm check` green.
  - The block reads as an institutional spec sheet at 1920×1080 and stacks
    legibly at 390×844.
  - The counterpart link resolves under the base path from both directions.
  - A week whose counterpart is missing renders without throwing — verified by
    temporarily removing one Lab, then restoring it.
- **Depends on:** Task 1; Plan 2 Tasks 7–10 (all 24 nodes must exist).

### Task 7: Sweep the shared surfaces and hold the motion budget

- **Description:** Apply the rules-not-cards treatment to the remaining shared
  components, remove the theme's entrance animation, and bring the two 0.3s
  transitions inside budget.
- **Files touched:** `src/styles/course.css`;
  `src/components/MarkingModel.astro`, `src/components/TeachingTeam.astro`
  (existing); `spec/treatment.test.ts` (extend).
- **Tests first (red):** extend `spec/treatment.test.ts`, against the
  concatenated `dist/_astro/*.css`:
  - `it("runs no entrance animation")` — `src/styles/course.css` contains a rule
    setting `animation: none` for the theme's hero selector, and the rendered
    homepage shows no `hero-fade-up` taking effect. Assert the override is
    present in the source file, since the theme's own keyframes legitimately
    remain in the bundle.
  - `it("keeps every transition inside the budget")` — parse every
    `transition-duration` and `transition` shorthand in
    `src/styles/course.css` and assert each duration is between `120ms` and
    `180ms` inclusive.
  - `it("does not defeat reduced motion")` — `src/styles/course.css` contains no
    `transition-duration` or `animation-duration` marked `!important`.
    *(§3.5: the theme's global reduced-motion block uses `!important`, and ours
    must not outrank it.)*
  - `it("styles the marking table as a ruled table")` — `dist/assessments/assignment-3-adulting/index.html`
    contains a `<table` with twelve `<tr` rows in its `<tbody`.
- **Implementation (green):** add to `src/styles/course.css`: an
  `animation: none` override for the theme's hero-animated selectors
  (`components.css:683,694`); a `transition-duration: 150ms` override for the two
  `0.3s` rules (`components.css:187,586`), written **without** `!important`; a
  `.course-specsheet`, `.course-list` and `table` rule set using `--at-divider`
  for rules and the existing `--at-table-header-*` tokens; and, if the striped
  `tbody tr:nth-child(even)` reads as decoration rather than aid, a
  `background: transparent` override with rules between rows instead. Leave
  `MarkingModel.astro`'s markup alone — it already emits a table — and adjust
  only `TeachingTeam.astro`'s list to match `.course-list`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All four assertions pass; `pnpm check` green.
  - No page fades or slides in on load at either viewport.
  - With `prefers-reduced-motion: reduce` forced in the browser, no transition
    or animation runs.
  - Tables across the site — schedule, marking, and any markdown table in
    content — read as one treatment.
- **Depends on:** Tasks 4, 5, 6.

### Task 8: Verification pass at both marking viewports

- **Description:** The pass a treatment plan cannot do incrementally: read every
  page type at both viewports and fix what only appears in a browser.
- **Files touched:** `src/styles/course.css` and any component needing a fix
  (expected to be small).
- **Tests first (red):** no new vitest cases — this task exists precisely for
  what tests cannot assert (§3.9). The red state is the checklist below being
  unverified. Any *defect* found that **can** be expressed as a test gets one
  added to `spec/treatment.test.ts` before it is fixed.
- **Implementation (green):** with `pnpm dev` running, use `agent-browser` at
  `http://localhost:4321/comp4020-ass2-attwelveDev/`, and at both
  `set viewport 1920 1080` and `set viewport 390 844`, open and screenshot: the
  homepage; `/lectures/` and `/sessions/` (schedule tables); three
  non-adjacent week pages and their Labs; `/assessments/` and the Assignment 3
  page (rubric table plus band list); `/people/`; `/policies/`; and
  `/decks/week-01/` slide by slide. Fix what is wrong.
- **Refactor:** consolidate any rule duplicated during Tasks 1–7 into a single
  declaration in `src/styles/course.css`.
- **Acceptance criteria:**
  - No page scrolls horizontally at 390×844.
  - No text is clipped, overlapped or below ~14px effective size at 390×844.
  - The deck's slides all fit at both viewports (§3.5 of Plan 2 notes the build
    cannot check this).
  - `pnpm check` green; axe reports no violations on any page.
  - Every screenshot reads as a university handbook: no rounded cards, no
    shadows, no gold headings, no entrance motion, serif headings against sans
    body, and the glossary in mono.
  - `pnpm check:evidence` still passes everything except `PROCESS.md`.
- **Depends on:** Tasks 1–7.

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` passes (runs `pnpm build` then `vitest run spec`)
- [ ] `pnpm check` passes (typecheck + the above)
- [ ] `src/styles/course.css` is the only home for site-wide treatment — no
      treatment rule left in a page's scoped `<style>`
- [ ] The three brand inks are not redeclared anywhere in `src/styles/`
- [ ] `spec/glossary.test.ts` passes with every occurrence of all six terms
      inside a `<code>` element
- [ ] Manually verified per Task 8's checklist at both `1920 1080` and
      `390 844`, with screenshots
- [ ] With `prefers-reduced-motion: reduce`, no animation or transition runs
- [ ] Every requirement in §2 is covered — see §7
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (F3.1) one override stylesheet | Task 1; Task 5 refactor; §6 checklist |
| 2.1.2 (F3.2) headings off brand gold | Task 1 |
| 2.1.3 (F3.3) measure ≈68ch | Task 1 |
| 2.1.4 (F3.4) radius 0, shadows none | Task 1 |
| 2.1.5 (F3.5) serif headings, sans body | Task 2 |
| 2.1.6 (F3.6) tightened heading scale | Task 2 |
| 2.1.7 (F3.7) glossary in mono, every occurrence | Task 3 |
| 2.1.8 (F3.8) schedule tables with phone scroll container | Task 4 |
| 2.1.9 (F3.9) ruled lists, squared pills | Task 5 |
| 2.1.10 (F3.10) spec-sheet metadata block | Task 6 |
| 2.1.11 (F3.11) no entrance animation | Task 7 |
| 2.1.12 (F3.12) transitions 120–180ms | Task 7 |
| 2.1.13 (F3.13) gold as accent only | Task 1 acceptance; Task 8 screenshots |
| 2.1.14 (F3.14) WCAG AA preserved, axe green | Tasks 1–7 acceptance; Task 8 |
| 2.2 brand inks untouched | Task 1 assertion; §6 checklist |
| 2.2 `pnpm check` at every boundary | Acceptance criteria of Tasks 1–8 |
| 2.2 both marking viewports | Every task's acceptance; Task 8 in full |
| 2.2 no new webfont | §2.4.1; Task 2 uses a system stack |
| 2.2 reduced motion keeps working | Task 7 assertion; §6 checklist |

## 8. Risks / open questions

None.
