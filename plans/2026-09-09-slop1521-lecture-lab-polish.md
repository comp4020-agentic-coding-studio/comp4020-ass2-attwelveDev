# SLOP1521 lecture/Lab polish: reopening the measure and the flatness, richer listings

- **Date:** 2026-09-09
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-09 (via
  `specs/2026-09-09-slop1521-lecture-lab-polish.md`, produced by
  `brainstorm-feature`)

## 1. Summary

The visual-treatment plan (`plans/2026-09-09-slop1521-visual-treatment.md`)
just landed a deliberately restrained handbook look. Living with it surfaced
two of its calls going too far, plus a handful of independent gaps around
the lecture/Lab pages. This plan: widens the reading measure back up,
restores the theme's default corner-radius/shadow tokens everywhere (while
keeping the earlier plan's gold-as-accent-only rule intact), gives the
Lectures/Labs schedule tables a bordered/shadowed panel with a hover state,
mirrors "Lecture" into lecture page titles the way "Lab" already appears on
Lab pages, turns the slides link into a proper button with an icon that
opens in a new tab, and adds a **Topics** column (and, for lectures, a
**Slides** column) to both schedule tables so a reader can tell what a week
covers without opening it.

This is a direct continuation of, and partial reversal of, the
visual-treatment plan — it edits the same `src/styles/course.css` file and
invalidates three of that plan's own test assertions, which this plan
updates rather than leaves broken.

## 2. Requirements

### 2.1 Functional requirements

1. **R1.** `--at-content-width` changes from `38rem` to `44rem`.
2. **R2.** `src/styles/course.css` no longer declares `--at-border-radius`,
   `--at-shadow-sm`, `--at-shadow-md` or `--at-shadow-lg` at all — those
   tokens revert to the theme's own defaults (`0.375rem`; the three
   `light-dark()` shadow values) everywhere they're referenced in theme CSS
   (buttons, callouts, code spans, the search dialog, tag pills, the nav
   icon button, form fields). `.course-list` and `.course-specsheet` are
   unaffected — they declare no background/border of their own, so this
   token change has no visible effect there.
3. **R3.** `.course-schedule` (the wrapper `<div>` around both schedule
   tables) gains a bordered container: `border: 1px solid var(--at-divider)`,
   `border-radius: var(--at-border-radius)`, `box-shadow:
   var(--at-shadow-sm)`; `.course-schedule th`/`.course-schedule td` gain
   roomier padding (`var(--at-spacing-md) var(--at-spacing-lg)`, up from the
   theme's `var(--at-spacing-sm) var(--at-spacing-md)`); `.course-schedule
   tbody tr:hover` gets `background: var(--at-accent-soft)` (an instant
   change, no transition — see §4 for why). Scoped to `.course-schedule`
   specifically, not a bare `table` rule, so the marking-criteria table
   (`MarkingModel.astro`, not wrapped in `.course-schedule`) is unaffected.
4. **R4.** `src/pages/lectures/[slug].astro`'s `title` becomes
   `` `Week ${lecture.data.week} Lecture: ${lecture.data.title}` ``, mirroring
   `sessions/[slug].astro`'s `` `Week ${session.data.week} ${sessionLabels.singular}: ${session.data.title}` ``
   pattern exactly (literal word `"Lecture"` — no new labels object, since
   lectures have no relabeling concept the way `sessionLabels` gives Labs
   one).
5. **R5.** The "Open the slides" link on a lecture detail page becomes
   `<a class="at-button at-button--outline" href={withBase(lecture.data.slides)} target="_blank" rel="noopener noreferrer">` containing an `Icon`
   (`name="presentation"`, decorative — the visible text already supplies
   the accessible name) followed by the text "Open the slides".
6. **R6.** `src/lib/topics.ts` (new) exports:
   - `interface TopicSegment { text: string; code: boolean }`
   - `function extractContentTopics(body: string): string[]` — finds the
     `## Content` section in a lecture's raw markdown body (from that
     heading to the next `## ` heading or end of string) and returns each
     bullet's full text (joining a bullet's wrapped continuation lines,
     which this codebase indents two spaces — 19 such continuation lines
     confirmed across the 12 lectures' `## Content` sections, see §3),
     backticks intact.
   - `function truncateTopic(raw: string, maxWords?: number): TopicSegment[]`
     (default `maxWords = 4`) — takes the first `maxWords` words of `raw`,
     **never splitting a backtick-delimited span**: if the naive word-count
     cutoff falls inside a `` `term` `` span, the cutoff extends to that
     span's closing backtick so the whole term is kept intact. Returns an
     ordered list of segments, backtick spans marked `code: true` (with the
     backticks stripped), everything else `code: false`. This existed
     because the visual-treatment plan already wrapped six specific terms
     in backticks throughout lecture bodies (F3.7) — a truncation that
     didn't respect those spans would either mangle a term mid-word or
     silently drop its `<code>` wrapping, reintroducing the exact bare-prose
     violation `spec/glossary.test.ts` exists to catch. See §3 for the
     confirmed collision cases.
7. **R7.** `src/components/TopicChips.astro` (new) — `Props: { topics:
   string[] }` — for each string in `topics`, calls `truncateTopic` and
   renders one `<li class="course-topic">` per topic inside a `<ul
   class="course-topics">`, mapping each returned segment to plain text or
   an actual `<code>` element (never a styled span standing in for it —
   the real element is what makes this participate in the site's existing
   mono-glossary styling and satisfy F3.7 automatically).
8. **R8.** `LecturesGrid.astro`'s table gains a **Topics** `<th>`/`<td>`
   column (after Title): each row calls
   `extractContentTopics(lecture.body)` and passes the result to
   `<TopicChips topics={...} />`.
9. **R9.** `SessionsGrid.astro`'s table gains the same **Topics**
   `<th>`/`<td>` column (after Title): each row passes `session.data.spec`
   directly to `<TopicChips topics={session.data.spec} />` — no parsing
   needed, since `spec` is already `string[]` and (per the visual-treatment
   plan's Task 3) contains no backtick-wrapped or bare glossary terms at
   all, confirmed in §3.
10. **R10.** `LecturesGrid.astro`'s table gains a **Slides** `<th>`/`<td>`
    column (after Topics, last column): a row with `lecture.data.slides` set
    renders `<a class="at-icon-button" href={withBase(lecture.data.slides)} target="_blank" rel="noopener noreferrer" aria-label={`Open slides for Week ${lecture.data.week}`}>` containing a decorative `Icon` (`name="presentation"`,
    no `aria-label` on the icon itself — the link already carries one);
    a row without `slides` renders an empty `<td>` (no dash — most rows
    will be empty until more decks exist, and a dash on every row would be
    noisier than blank). `SessionsGrid.astro` gets no Slides column —
    `sessions` carries no `slides` field.

### 2.2 Non-functional requirements

- Every icon-only interactive element (R10's Slides-column link) carries an
  accessible name via `aria-label` on the link itself, not just its icon
  child — `pnpm build`'s axe pass (already part of `pnpm check`) must stay
  green on every page.
- `prefers-reduced-motion` (established by the visual-treatment plan, tested
  by `spec/treatment.test.ts`'s "does not defeat reduced motion" /
  "keeps every transition inside the budget" cases) must keep passing.
  R3's hover state is instant (no `transition`/`transition-duration`
  declared at all), so it cannot interact with either assertion.
- `pnpm check` green at every task boundary (this repo's existing
  convention, `pnpm typecheck && pnpm build && vitest run spec`).
- No change to `spec/glossary.test.ts`'s pass/fail outcome: it already walks
  every `dist/**/index.html` except `dist/decks/` (so it already scans
  `dist/lectures/index.html` and `dist/sessions/index.html`, which currently
  carry no lecture/Lab body content and will, after this plan, carry
  truncated topic chips for the first time). R6/R7's code-preserving
  truncation exists specifically so this stays green without editing that
  test file at all.

### 2.3 Out of scope

- Every visual-treatment plan requirement not named in R1-R3 above:
  headings off brand gold (F3.2), serif headings and the tightened scale
  (F3.5/F3.6), the systems-glossary mono convention (F3.7 — enforced, not
  reopened), the ruled-list/table structure itself (F3.8/F3.9 — Lectures/
  Labs stay tables, assessments/people/homepage stay ruled lists), gold as
  accent only (F3.13 — still holds; nothing here is a large gold fill), and
  the motion budget (F3.11/F3.12). None of these are reopened.
- No new bounding boxes/cards for `.course-list` (assessments, people,
  homepage destinations) or `.course-specsheet` — R2 is a token change only.
- No new frontmatter fields on lectures or Labs — topics are derived from
  existing `body`/`spec` data, never authored separately.
- No content changes to any lecture or Lab's prose — `## Content` bullets
  and `spec:` items are read as-is, never rewritten to read better as chips.
- `.course-tags` (homepage), the assessment/people ruled lists, and
  `TeachingTeam`'s list are untouched — only `.course-schedule` (R3) and the
  two grid components (R8-R10) change.
- Markdown syntax other than backtick code spans inside `## Content`
  bullets: confirmed (§3) that none of the 12 lectures' `## Content`
  sections use bold, italic, or links, so `truncateTopic` only needs to
  handle backticks.
- Any change to `package.json`'s test scripts. All new tests live under
  `spec/`, matching the existing `pnpm test` = `pnpm build && vitest run
  spec` convention — no isolated unit-test file for `src/lib/topics.ts`'s
  pure functions, since a file outside `spec/` wouldn't run as part of
  `pnpm check` without a script change this plan doesn't make.

### 2.4 Assumptions

1. **The theme's own default `--at-border-radius`/`--at-shadow-*` values are
   what "restore" means** (not new custom replacement values) — confirmed
   with the user during brainstorming (see spec §2.4.1).
2. **`44rem` is the agreed new measure** — confirmed with the user during
   brainstorming (see spec §2.4.3), not re-litigated here.
3. **`truncateTopic`'s default of 4 words** is a starting point, not a
   pixel-perfect final value — Task 7 (verification) may need to nudge it
   after seeing real chips render, per the acceptance criteria on that task.

## 3. Existing code context

Read directly from source on 2026-09-09.

**`src/styles/course.css`** (in full):

```css
:root {
  --at-heading: var(--at-text);
  --at-content-width: 38rem;
  --at-border-radius: 0;
  --at-shadow-sm: none;
  --at-shadow-md: none;
  --at-shadow-lg: none;

  --course-font-heading: "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
  --at-font-size-h1: 2rem;
  --at-font-size-h2: 1.5rem;
  --at-font-size-h3: 1.25rem;
}

h1, h2, h3, h4, h5, h6 { font-family: var(--course-font-heading); }
.course-schedule { overflow-x: auto; }
.course-tags { display: flex; flex-wrap: wrap; gap: var(--at-spacing-sm);
  margin-block: 0 var(--at-spacing-xl); padding: 0; list-style: none; }
.course-tags li { padding: 0.25rem 0.65rem; border-radius: 0;
  color: var(--at-text-secondary); background: var(--at-bg-alt); font-size: 0.9rem; }
.course-list { padding: 0; margin-block: 0 var(--at-spacing-xl); list-style: none; }
.course-list li { padding-block: var(--at-spacing-md); border-block-end: 1px solid var(--at-divider); }
.course-list li:first-child { border-block-start: 1px solid var(--at-divider); }
.course-list h2, .course-list h3 { margin-block: 0 var(--at-spacing-xs); }
.course-specsheet dl { display: grid; grid-template-columns: max-content 1fr;
  gap: var(--at-spacing-xs) var(--at-spacing-lg); margin: 0 0 var(--at-spacing-xl);
  padding-block: var(--at-spacing-md); border-block: 1px solid var(--at-divider); }
.course-specsheet dt { color: var(--at-text-secondary); font-weight: 600; }
.course-specsheet dd { margin: 0; }
@media (width < 640px) {
  .course-specsheet dl { grid-template-columns: 1fr; gap: 0; }
  .course-specsheet dd { margin-block-end: var(--at-spacing-sm); }
}
.at-hero-title, .at-hero-title::after { animation: none; }
.at-nav-links-wrapper, .at-card-image { transition-duration: 150ms; }
```

R1/R2 change exactly the four `:root` lines named. R3 adds new rules; none
of the existing rules above need to change for R3.

**`src/pages/lectures/[slug].astro`** (in full):

```astro
---
import { render } from "astro:content";
import { getPublishedCollection } from "astro-course-university/content";
import RelatedContent from "astro-course-university/components/RelatedContent.astro";
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
const title = `Week ${lecture.data.week}: ${lecture.data.title}`;
---

<ContentLayout title={title} description={lecture.data.description} {...siteConfig}>
  <WeekMeta week={lecture.data.week} date={lecture.data.date} kind="lecture" />
  {lecture.data.slides && <p><a href={withBase(lecture.data.slides)}>Open the slides</a></p>}
  <Content />
  <TeachingTeam teachers={lecture.data.teachers} />
  <RelatedContent entry={lecture} collections={graphCollections} />
</ContentLayout>
```

R4 changes the `title` line. R5 changes the `{lecture.data.slides && ...}`
line, adding an `Icon` import from `astro-theme-university/components/Icon.astro`
(confirmed exported — see below).

**`src/pages/sessions/[slug].astro`**: unaffected by this plan (quoted in
full in the visual-treatment plan §3.8; `sessionLabels.singular` = `"Lab"`
from `src/site-config.ts`, confirmed unchanged).

**`src/components/LecturesGrid.astro`** (in full):

```astro
---
import { getPublishedCollection } from "astro-course-university/content";
import { withBase } from "astro-theme-university/url";
import { formatCourseDate } from "../lib/dates";

const lectures = await getPublishedCollection("lectures");
const visible = lectures.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
---

<div class="course-schedule">
  <table>
    <thead>
      <tr>
        <th scope="col">Week</th>
        <th scope="col">Date</th>
        <th scope="col">Title</th>
      </tr>
    </thead>
    <tbody>
      {
        visible.map((lecture) => (
          <tr>
            <td>{lecture.data.week}</td>
            <td>{formatCourseDate(lecture.data.date)}</td>
            <td>
              <a href={withBase(`/lectures/${lecture.id}/`)}>{lecture.data.title}</a>
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>
</div>
```

R8/R10 add two `<th scope="col">`/`<td>` pairs (Topics, Slides) after the
existing Title column. `SessionsGrid.astro` is identical in shape (sorted by
`week` instead of `date`) — R9 adds one `<th>`/`<td>` pair (Topics only).

**`src/content.config.ts`**: `lectures` schema extends `courseNodeSchema`
with `slides: z.string().regex(/^\/decks\/[a-z0-9-]+\/$/).optional()`. Only
`src/content/lectures/week-01.md` sets `slides:` today (confirmed via `grep
-l "^slides:" src/content/lectures/*.md`, one match). `courseNodeSchema`
(from `astro-course-university/schemas`, read in full) declares `spec:
z.array(z.string()).default([])` — inherited by every collection built on
it, including `sessions`, so `session.data.spec` is always `string[]`
(never `undefined`), confirmed non-empty for every Lab by
`spec/weekly-structure.test.ts`'s existing `"gives every Lab a spec list"`
case.

**`astro:content`'s `CollectionEntry`**: confirmed (`node_modules/astro/dist/content/runtime.d.ts`'s
`ContentEntryResult` type, and `astro-course-university/content-helpers.ts`'s
own `GraphEntry.body` field, which its `parseEmbedRefs` already regex-parses
directly) that a glob-loaded markdown entry carries the raw markdown source
directly from `getPublishedCollection`, with no `render()` call needed.
`extractContentTopics` (R6) reads `lecture.body` this way, following the
exact pattern `course-graph.ts`'s `parseEmbedRefs(body: string)` already
establishes in this dependency (regex over raw markdown source, not an AST
parse) — this plan's parser matches that convention rather than introducing
a remark/AST dependency. **Exact type, verified in this project's own
generated `.astro/content.d.ts`**: every collection's entry types `body` as
`body?: string`, so `lecture.body` is `string | undefined`, not `string` —
`extractContentTopics` itself takes a required `body: string`, so its one
call site passes `lecture.body ?? ""` (see Task 5).

**Confirmed shape of every lecture's `## Content` section** (`grep -c "^##
Content$" src/content/lectures/*.md` — 12 matches, one per file, always the
literal heading `## Content`): a markdown bullet list, each item starting
`- `, with wrapped continuation lines indented exactly two spaces (verified
programmatically: 19 continuation lines across the 12 files, all matching
`^  \S`). No bold, italic, or link markdown appears in any `## Content`
section (`grep -E '\*\*|\[.*\]\(|_[a-z]'` over all 12 sections: zero
matches) — confirmed backticks are the only inline markup `truncateTopic`
needs to handle.

**Confirmed backtick/truncation collision cases** (the reason R6 exists —
without code-preserving truncation, a naive 4-word cutoff would break these):

| Lecture | Bullet (first ~5 words) | 4-word cutoff includes the term? |
| --- | --- | --- |
| week-04 | `sleep as a scheduled \`subsystem\`, not a debt…` | No — term is the 5th word, naive cutoff excludes it (safe by luck) |
| week-06 | `a \`manual override\` for the one evening…` | **Yes** — words 2-3 are the two-word term; a naive cutoff at 4 words would end mid-render with the closing backtick right at the boundary |
| week-12 | `what changed, \`subsystem\` by \`subsystem\`, since week…` | **Yes** — word 3 is a backtick term entirely inside the 4-word window |

Confirmed by direct extraction (`awk` over each file's `## Content`
section) — six of the twelve lectures have at least one backtick-wrapped
glossary term inside `## Content` at all (week-01, 04, 05, 06, 10, 12), and
the week-06/week-12 cases above land inside a plausible naive truncation
window, which is why "extend the cutoff to the term's closing backtick"
(not "drop the term") is the rule, rather than an edge case worth skipping.

**Confirmed Labs' `spec:` items carry no backticks and no bare glossary
terms**: the visual-treatment plan's Task 3 execution-time finding
specifically reworded session week-08's `spec:` line (rather than
backticking it) because a `spec:` frontmatter string is rendered as plain
interpolated text (`SpecList.astro`'s `<li>{line}</li>`), not through the
markdown chain — so no `spec:` array anywhere in this repo contains a
backtick, and `spec/glossary.test.ts`'s "marks every glossary term as code"
case already passing today confirms none contain a bare glossary term
either. R9 therefore needs no collision handling — `truncateTopic` will
simply return every Lab's spec items as a single plain (`code: false`)
segment each, which is exactly correct.

**`node_modules/astro-theme-university/components/Icon.astro`** (in full,
re-read):

```astro
---
import { Icon as IconifyIcon } from "astro-icon/components";
export { IconifyIcon };
export interface IconProps {
  name: string;
  size?: string | number;
  class?: string;
  style?: string;
  "aria-label"?: string;
}
type Props = IconProps;
const { name, size = "1em", class: className, style, "aria-label": ariaLabel } = Astro.props;
const labelled = ariaLabel !== undefined;
---
<IconifyIcon name={`iconoir:${name}`} width={size} height={size} class={className} style={style}
  aria-hidden={labelled ? undefined : "true"} aria-label={ariaLabel}
  role={labelled ? "img" : undefined} focusable="false" />
```

Confirmed the `presentation` icon exists in `@iconify-json/iconoir/icons.json`
(already a direct dependency, `package.json`). Confirmed rendered shape by
inspecting `dist/index.html`'s existing nav search icon:
`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
focusable="false" data-icon="iconoir:search">` — so a rendered
`presentation` icon carries `data-icon="iconoir:presentation"`, the string
tests assert against.

**`node_modules/astro-theme-university/styles/components.css`**: `.at-button`
(base), `.at-button--outline` (transparent background, `var(--at-accent)`
text/border, hover `background: var(--at-accent-soft)`), and `.at-icon-button`
(2.5rem square, `border: 1px solid var(--at-divider)`, `background:
transparent`, `transition: border-color 0.15s` — already inside the
120-180ms budget) all exist today and reference `var(--at-border-radius)`
and `var(--at-accent)`/`var(--at-accent-soft)`. `.at-button`'s own
`transition` (`background-color/border-color/color/transform 0.15s`, i.e.
150ms) is also already inside budget. R5/R10 reuse these classes verbatim;
neither adds a new CSS rule of its own beyond R3's `.course-schedule`
additions.

**`node_modules/astro-theme-university/styles/base.css`**: confirmed
(`grep -n "border-radius\|box-shadow"`) that the bare `<table>`/
`.at-table-wrap` rules never reference `var(--at-border-radius)` or
`var(--at-shadow-*)` at all — only `code`, `pre`, form fields,
`.at-icon-button`, and `fieldset` do. So R3's `.course-schedule` panel is
new, additive styling, not a "restoration" of anything the visual-treatment
plan removed (the table itself never had a container treatment, even
before that plan).

**Test setup**: **vitest 4**, no config file. `pnpm test` =
`pnpm build && vitest run spec`; `pnpm check` = `pnpm typecheck && pnpm
test`. All existing treatment-related assertions live in
`spec/treatment.test.ts` (268 lines, read in full) and `spec/glossary.test.ts`
(90 lines, read in full) — this plan extends `spec/treatment.test.ts`'s
existing `describe` blocks/helpers rather than creating a new file,
matching established convention. `spec/glossary.test.ts` is not modified at
all — it already walks every rendered page (§2.2's NFR), so it exercises
the new Topics columns automatically once they exist. Key existing helpers
already available in
`spec/treatment.test.ts`: `bundledCss()` (concatenates `dist/_astro/*.css`
plus `dist/index.html`'s inlined `<style>` blocks — course.css rides
`brandCss`'s `injectScript` mechanism, so it's inlined per-page, not
extracted to a shared chunk), `courseCssSource` (the raw `src/styles/course.css`
file content), `tbodyRows(html)` (returns each `<tr>`'s inner HTML from a
page's `<tbody>`).

**Three existing `spec/treatment.test.ts` assertions this plan invalidates**
(exact current code, to be changed in Task 1):

```ts
it("ships the course stylesheet", () => {
  expect(bundledCss()).toMatch(/--at-content-width:\s*38rem/);
});

it("squares every corner", () => {
  expect(bundledCss()).toMatch(/--at-border-radius:\s*0(?:px|rem)?\s*[;}]/);
});

it("removes elevation", () => {
  const css = bundledCss();
  for (const token of ["--at-shadow-sm", "--at-shadow-md", "--at-shadow-lg"]) {
    expect(css).toMatch(new RegExp(`${token}:\\s*none\\s*[;}]`));
  }
});
```

## 4. Approach

Six tasks. R1/R2 (measure + token restoration) land together as Task 1,
since they touch the same three `:root` lines in `course.css` and the same
three now-invalidated test cases — splitting them would mean a
deliberately-broken intermediate commit. R3 (the schedule-table panel)
depends on Task 1's token restoration actually landing first, since
`var(--at-border-radius)`/`var(--at-shadow-sm)` would otherwise still
resolve to the forced `0`/`none` values. R4 (lecture title) and R5 (slides
button) are independent one-file changes with no shared mechanism, done as
separate small tasks. R6/R7/R8 (the topics-extraction library, the
`TopicChips` component, and wiring it into `LecturesGrid.astro`) are one
task (Task 5): `TopicChips` and the library it wraps have no rendered page
to test against on their own, so building them separately from their first
real use would leave an artificial task boundary with no red/green cycle
of its own. R9 (Labs' Topics column) depends on Task 5, reusing
`TopicChips` with no new parsing. R10 (Slides column) depends on Task 5
too, since both touch `LecturesGrid.astro`'s table shape (Slides is
appended after Topics), so doing them out of order would mean re-diffing
the same `<thead>`/`<tr>` twice.

**R3's hover has no `transition` at all, deliberately.** A background-color
transition would need its own `transition-duration` value, which
`spec/treatment.test.ts`'s "keeps every transition inside the budget" case
already scans for (any `transition`/`transition-duration` declaration
anywhere in `course.css`) — an instant hover sidesteps that entirely rather
than adding one more value to keep inside 120-180ms for a purely decorative
affordance.

**Alternative considered and rejected — a remark/AST parse for `##
Content`:** the codebase's own precedent (`course-graph.ts`'s
`parseEmbedRefs`) already regex-parses raw markdown body text for a much
narrower purpose (embed directives); matching that existing convention
avoids a new dependency and a heavier abstraction for a section whose shape
(heading, then a flat bullet list with two-space-indented wraps, no other
inline markup) is fully known and stable.

**Alternative considered and rejected — dropping a term that falls at a
truncation boundary instead of extending the cutoff:** would silently lose
the exact content (a glossary term) most worth keeping visible in a
"what does this week cover" column, and risks leaving a truncated remainder
like "a `` for the" with the term simply gone — extending the cutoff to
the term's closing backtick keeps the chip meaningful at a small, bounded
cost to the "~4 words" target length.

## 5. Task breakdown

### Task 1: Widen the measure and restore radius/shadow tokens

- **Description:** Change `--at-content-width` from `38rem` to `44rem`;
  delete the `--at-border-radius`, `--at-shadow-sm`, `--at-shadow-md`,
  `--at-shadow-lg` declarations from `src/styles/course.css` entirely.
- **Files touched:** `src/styles/course.css` (existing); `spec/treatment.test.ts`
  (existing — 3 cases changed).
- **Tests first (red):** in `spec/treatment.test.ts`'s `"treatment —
  structural tokens"` describe block:
  - Change `it("ships the course stylesheet")`'s regex from
    `/--at-content-width:\s*38rem/` to `/--at-content-width:\s*44rem/`.
  - Replace `it("squares every corner")` with
    `it("no longer forces square corners")`:
    `expect(courseCssSource, "course.css must not declare --at-border-radius").not.toMatch(/--at-border-radius\s*:/);`
  - Replace `it("removes elevation")` with
    `it("no longer forces flat elevation")`, mirroring the existing
    `"never redefines a fixed brand ink"` case's pattern:
    ```ts
    for (const token of ["--at-shadow-sm", "--at-shadow-md", "--at-shadow-lg"]) {
      expect(courseCssSource, `course.css must not declare ${token}`).not.toMatch(
        new RegExp(`${token}\\s*:`),
      );
    }
    ```
  - Run `pnpm build && vitest run spec/treatment.test.ts` and confirm these
    three fail (the first two on the still-`38rem`/still-present values;
    the third — already changed — passes trivially against the old CSS only
    if it hasn't been touched yet, so change the CSS **after** confirming
    the first two fail, then re-run to see the third fail too, before
    implementing).
- **Implementation (green):** in `src/styles/course.css`'s `:root` block,
  change `--at-content-width: 38rem;` to `--at-content-width: 44rem;` and
  delete the four `--at-border-radius`/`--at-shadow-*` lines.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All three changed assertions pass; `pnpm check` green.
  - `agent-browser` at `1920 1080`: the readable measure is visibly wider
    than before on the homepage and a week page, without exceeding a
    comfortable line length.
  - `agent-browser` at `1920 1080`: a button (e.g. the search dialog
    trigger, or `.at-icon-button` in the nav) and a `<code>` span both show
    a visible rounded corner again.
  - `.course-list`/`.course-specsheet` pages (`/assessments/`, a week page)
    look unchanged from before this task — no new box appears there.
- **Depends on:** None.

### Task 2: Add the schedule-table panel and hover state

- **Description:** Wrap `.course-schedule` in a bordered/shadowed panel
  with roomier cell padding and an instant hover highlight on table rows.
- **Files touched:** `src/styles/course.css` (existing); `spec/treatment.test.ts`
  (existing — extend `"treatment — schedule tables"`).
- **Tests first (red):**
  - `it("wraps the schedule table in a panel")` —
    `expect(bundledCss()).toMatch(/\.course-schedule\s*\{[^}]*border-radius:\s*var\(--at-border-radius\)[^}]*box-shadow:\s*var\(--at-shadow-sm\)/)`
    (order-sensitive to match the implementation below; adjust the
    implementation's property order if this reads awkwardly rather than
    loosening the regex).
  - `it("highlights a hovered schedule row")` —
    `expect(bundledCss()).toMatch(/\.course-schedule tbody tr:hover\s*\{\s*background:\s*var\(--at-accent-soft\)/)`.
  - `it("gives schedule cells roomier padding")` —
    `expect(bundledCss()).toMatch(/\.course-schedule (th|td),\s*\.course-schedule (td|th)\s*\{[^}]*padding:\s*var\(--at-spacing-md\) var\(--at-spacing-lg\)/)`.
  - Confirm all three fail against the current CSS (no `.course-schedule`
    rule beyond `overflow-x: auto` exists yet).
- **Implementation (green):** append to `src/styles/course.css`:
  ```css
  .course-schedule {
    overflow-x: auto;
    border: 1px solid var(--at-divider);
    border-radius: var(--at-border-radius);
    box-shadow: var(--at-shadow-sm);
  }

  .course-schedule th,
  .course-schedule td {
    padding: var(--at-spacing-md) var(--at-spacing-lg);
  }

  .course-schedule tbody tr:hover {
    background: var(--at-accent-soft);
  }
  ```
  (merge into the existing `.course-schedule { overflow-x: auto; }` rule
  rather than duplicating the selector).
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All three assertions pass; `pnpm check` green (including axe — a
    border/shadow/hover on an existing table introduces no new a11y
    surface).
  - `agent-browser` at `1920 1080` **and** `390 844`: `/lectures/` and
    `/sessions/` show a visible bordered/shadowed panel around the table
    that doesn't clip oddly at the rounded corners where the table meets
    the scroll edge.
  - Hovering a row (desktop) shows the highlight instantly, with no visible
    fade/transition.
  - The marking-criteria table (`/assessments/assignment-3-adulting/`)
    is visually unchanged — no panel, no hover.
- **Depends on:** Task 1 (the tokens this task's CSS references must
  already be restored, or the panel renders with `0`/`none`).

### Task 3: Mirror "Lecture" into lecture page titles

- **Description:** Change the lecture detail page's `title` to include the
  literal word "Lecture", matching the existing Lab pattern.
- **Files touched:** `src/pages/lectures/[slug].astro` (existing);
  `spec/treatment.test.ts` (existing — new case).
- **Tests first (red):** add to `spec/treatment.test.ts`:
  ```ts
  describe("treatment — lecture titles", () => {
    it("names lectures as lectures", () => {
      for (const nn of WEEK_NUMBERS) {
        const html = readFileSync(resolve(`dist/lectures/week-${nn}/index.html`), "utf8");
        expect(html, `lectures/week-${nn} is missing "Lecture" in its title`).toMatch(
          new RegExp(`Week ${Number(nn)} Lecture:`),
        );
      }
    });
  });
  ```
  (`WEEK_NUMBERS` already exists in this file, defined above the
  `"treatment — spec-sheet metadata block"` describe block.) Confirm this
  fails against the current `Week N: Title` format (no "Lecture").
- **Implementation (green):** in `src/pages/lectures/[slug].astro`, change
  ``const title = `Week ${lecture.data.week}: ${lecture.data.title}`;`` to
  ``const title = `Week ${lecture.data.week} Lecture: ${lecture.data.title}`;``.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The new assertion passes for all 12 weeks; `pnpm check` green.
  - `agent-browser`: a lecture page's browser tab title and on-page heading
    both read "Week N Lecture: …", matching the Lab page's "Week N Lab: …"
    pattern exactly.
  - `WeekMeta`'s own "Lecture"/"Lab" row label (unrelated, already correct)
    is unchanged.
- **Depends on:** None.

### Task 4: Turn the slides link into a button with an icon, opening in a new tab

- **Description:** Replace the bare text link with a styled, iconed button
  that opens the deck in a new tab.
- **Files touched:** `src/pages/lectures/[slug].astro` (existing);
  `spec/treatment.test.ts` (existing — new case).
- **Tests first (red):** add:
  ```ts
  it("gives the slides link an icon, button styling, and a new tab", () => {
    const html = readFileSync(resolve("dist/lectures/week-01/index.html"), "utf8");
    expect(html).toMatch(/class="at-button at-button--outline"/);
    expect(html).toMatch(/target="_blank"/);
    expect(html).toMatch(/rel="noopener noreferrer"/);
    expect(html).toMatch(/data-icon="iconoir:presentation"/);
    expect(html).toMatch(/Open the slides/);
  });
  ```
  Only `week-01` has `slides:` set today, so it's the only page this can
  assert against. Confirm it fails (current markup is a bare `<a>` with no
  class, no icon, no `target`).
- **Implementation (green):** in `src/pages/lectures/[slug].astro`, add
  `import Icon from "astro-theme-university/components/Icon.astro";` and
  change:
  ```astro
  {lecture.data.slides && <p><a href={withBase(lecture.data.slides)}>Open the slides</a></p>}
  ```
  to:
  ```astro
  {lecture.data.slides && (
    <p>
      <a class="at-button at-button--outline" href={withBase(lecture.data.slides)} target="_blank" rel="noopener noreferrer">
        <Icon name="presentation" />
        Open the slides
      </a>
    </p>
  )}
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The new assertion passes; `pnpm check` green including axe.
  - `agent-browser` at `1920 1080` and `390 844`: the button reads as a
    button (outlined, not a solid gold fill — F3.13 stays satisfied), with
    the presentation icon before the text.
  - Clicking it opens `/decks/week-01/` in a new tab (verified: the link
    carries `target="_blank"`, `agent-browser` can confirm the attribute
    directly since it doesn't manage multiple tabs).
  - A lecture without `slides` set (e.g. week-02) renders nothing in that
    spot, unchanged.
- **Depends on:** None.

### Task 5: Build the topics library and wire the Lectures table's Topics column

- **Description:** Build the shared mechanism both schedule tables' Topics
  columns will use (a markdown-body parser for lectures, a truncator that
  never splits a backtick-wrapped term, and a component that renders the
  result as small chips), and wire it into `LecturesGrid.astro` in the same
  task — the mechanism has no rendered page to test against on its own, so
  splitting "build the library" from "use it in a real table" would leave
  an artificial task boundary with no red/green cycle of its own.
- **Files touched:** new `src/lib/topics.ts`; new `src/components/TopicChips.astro`;
  `src/components/LecturesGrid.astro` (existing); `src/styles/course.css`
  (existing — new rules); `spec/treatment.test.ts` (existing — new describe
  block, plus a new shared helper).
- **Tests first (red):** first add a shared helper next to `tbodyRows`
  (reusing its own week-extraction pattern from the existing "keeps both
  tables in order" case, rather than inventing a new, looser one):
  ```ts
  function findRowByWeek(rows: string[], week: number): string | undefined {
    return rows.find((row) => {
      const cell = row.match(/<td[^>]*>\s*(\d+)\s*<\/td>/);
      return cell !== null && Number(cell[1]) === week;
    });
  }
  ```
  Then, in a new `"treatment — topics"` describe block:
  ```ts
  it("gives the lectures table a Topics column", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? "";
    expect(thead).toContain("Topics");
  });

  it("shows one topic chip per Content bullet", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const week04Row = findRowByWeek(tbodyRows(html), 4);
    expect(week04Row, "no row found for week 4").toBeDefined();
    const chips = [...(week04Row ?? "").matchAll(/<li class="course-topic">/g)];
    expect(chips.length, "week 4 has 4 Content bullets").toBe(4);
  });

  it("preserves a glossary term's <code> wrapping through truncation", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const week06Row = findRowByWeek(tbodyRows(html), 6);
    expect(week06Row, "no row found for week 6").toBeDefined();
    expect(week06Row).toMatch(/<code>manual override<\/code>/);
  });
  ```
  Confirm all three fail (no Topics column, no `src/lib/topics.ts`, no
  `TopicChips.astro` exist yet).
- **Implementation (green):**
  - `src/lib/topics.ts`:
    ```ts
    export interface TopicSegment {
      text: string;
      code: boolean;
    }

    /** Bullets under a lecture's `## Content` heading, backticks intact,
     *  continuation lines (indented two spaces) rejoined onto their bullet. */
    export function extractContentTopics(body: string): string[] {
      const match = body.match(/^## Content\n([\s\S]*?)(?=\n## |\n?$)/m);
      if (!match) return [];
      const bullets: string[] = [];
      for (const line of match[1].split("\n")) {
        if (line.startsWith("- ")) {
          bullets.push(line.slice(2).trim());
        } else if (line.trim() && bullets.length > 0) {
          bullets[bullets.length - 1] += ` ${line.trim()}`;
        }
      }
      return bullets;
    }

    /** First `maxWords` words of `raw`, extending the cutoff to the end of
     *  any backtick-delimited span the naive boundary would otherwise split. */
    export function truncateTopic(raw: string, maxWords = 4): TopicSegment[] {
      const words = raw.split(/\s+/);
      let end = raw.length;
      if (words.length > maxWords) {
        let charCount = 0;
        for (let i = 0; i < maxWords; i++) {
          charCount += words[i].length + 1;
        }
        end = charCount - 1;
        const upTo = raw.slice(0, end);
        const openCount = (upTo.match(/`/g) ?? []).length;
        if (openCount % 2 === 1) {
          const close = raw.indexOf("`", end);
          end = close === -1 ? raw.length : close + 1;
        }
      }
      const truncated = raw.slice(0, end);
      const segments: TopicSegment[] = [];
      let lastIndex = 0;
      for (const codeMatch of truncated.matchAll(/`([^`]+)`/g)) {
        if (codeMatch.index! > lastIndex) {
          segments.push({ text: truncated.slice(lastIndex, codeMatch.index), code: false });
        }
        segments.push({ text: codeMatch[1], code: true });
        lastIndex = codeMatch.index! + codeMatch[0].length;
      }
      if (lastIndex < truncated.length) {
        segments.push({ text: truncated.slice(lastIndex), code: false });
      }
      return segments;
    }
    ```
  - `src/components/TopicChips.astro`:
    ```astro
    ---
    import { truncateTopic } from "../lib/topics";

    interface Props {
      topics: string[];
    }

    const { topics } = Astro.props;
    ---

    <ul class="course-topics">
      {
        topics.map((topic) => (
          <li class="course-topic">
            {truncateTopic(topic).map((segment) =>
              segment.code ? <code>{segment.text}</code> : segment.text,
            )}
          </li>
        ))
      }
    </ul>
    ```
  - `src/styles/course.css` additions:
    ```css
    .course-topics {
      display: flex;
      flex-wrap: wrap;
      gap: var(--at-spacing-xs);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .course-topic {
      padding: 0.15rem 0.5rem;
      border-radius: var(--at-border-radius);
      background: var(--at-bg-alt);
      color: var(--at-text-secondary);
      font-size: var(--at-font-size-xs);
    }
    ```
  - `src/components/LecturesGrid.astro`: add
    `import TopicChips from "./TopicChips.astro";` and
    `import { extractContentTopics } from "../lib/topics";`, then a
    `<th scope="col">Topics</th>` after the Title `<th>` and, in each row, a
    `<td><TopicChips topics={extractContentTopics(lecture.body ?? "")} /></td>`
    after the Title `<td>` — **the `?? ""` is required, not defensive
    decoration**: `.astro/content.d.ts` (generated for this project) types
    every collection's `body` as `body?: string`, so `lecture.body` is
    `string | undefined` even though it is always populated in practice for
    a markdown-sourced entry; passing it directly would fail
    `pnpm typecheck` against `extractContentTopics(body: string)`'s
    parameter type. `extractContentTopics("")` already returns `[]`
    gracefully (no `## Content` match), so the fallback is a no-op for the
    only case (a missing body) it could ever apply to.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - All three assertions pass; `spec/glossary.test.ts` still passes in
    full (the sitewide regression check for R6's whole reason to exist);
    `pnpm check` green including axe.
  - `agent-browser` at `1920 1080` and `390 844`: `/lectures/` shows short
    chip-style topics per row that don't force the table into horizontal
    scroll at 390px on their own (the table's existing `.course-schedule`
    scroll container still handles overflow if they do).
  - Existing "keeps both tables in order" and "heads both schedule tables
    with week, date and title" cases (unrelated to this task) still pass
    unmodified.
- **Depends on:** None.

### Task 6: Wire the Labs table's Topics column

- **Description:** Add the same Topics column to `SessionsGrid.astro`,
  sourced from `session.data.spec` directly.
- **Files touched:** `src/components/SessionsGrid.astro` (existing);
  `spec/treatment.test.ts` (existing — extend).
- **Tests first (red):**
  ```ts
  it("gives the Labs table a Topics column", () => {
    const html = readFileSync(resolve("dist/sessions/index.html"), "utf8");
    const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? "";
    expect(thead).toContain("Topics");
  });

  it("shows one topic chip per spec item for a Lab", () => {
    const html = readFileSync(resolve("dist/sessions/index.html"), "utf8");
    const week01Row = findRowByWeek(tbodyRows(html), 1);
    expect(week01Row, "no row found for week 1").toBeDefined();
    // week-01's session has exactly 2 spec items (confirmed in src/content/sessions/week-01.md).
    const chips = [...(week01Row ?? "").matchAll(/<li class="course-topic">/g)];
    expect(chips.length).toBe(2);
  });
  ```
  Confirm both fail.
- **Implementation (green):** in `src/components/SessionsGrid.astro`, add
  `import TopicChips from "./TopicChips.astro";`, a
  `<th scope="col">Topics</th>` after Title, and
  `<td><TopicChips topics={session.data.spec} /></td>` after the Title
  `<td>` in each row.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Both assertions pass; `spec/glossary.test.ts` still passes;
    `pnpm check` green including axe.
  - `agent-browser` at `1920 1080` and `390 844`: `/sessions/` shows the
    same chip treatment as `/lectures/`.
- **Depends on:** Task 5 (reuses `TopicChips`, `findRowByWeek`, and the raw
  `truncateTopic` mechanism it built — different component file than
  `LecturesGrid.astro`, so genuinely independent of Task 5's own Lectures
  wiring, but naturally done right after it so the two tables read as one
  consistent pattern in the same sitting).

### Task 7: Wire the Lectures table's Slides column and do the cross-viewport verification pass

- **Description:** Add the Slides column (icon-only button, only where a
  lecture has a deck) and do the manual verification a component-level
  test can't cover — the one thing left unchecked after Tasks 1-6 land in
  isolation.
- **Files touched:** `src/components/LecturesGrid.astro` (existing);
  `spec/treatment.test.ts` (existing — extend); `src/styles/course.css`
  and/or `src/lib/topics.ts` if verification finds a defect expressible as
  a test (per this repo's own established convention from the
  visual-treatment plan's Task 8).
- **Tests first (red):**
  ```ts
  it("gives the lectures table a Slides column, only where a deck exists", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? "";
    expect(thead).toContain("Slides");
    const rows = tbodyRows(html);
    const week01Row = findRowByWeek(rows, 1);
    expect(week01Row, "no row found for week 1").toBeDefined();
    expect(week01Row).toMatch(/class="at-icon-button"/);
    expect(week01Row).toMatch(/target="_blank"/);
    expect(week01Row).toMatch(/rel="noopener noreferrer"/);
    expect(week01Row).toMatch(/aria-label="Open slides for Week 1"/);
    expect(week01Row).toMatch(/data-icon="iconoir:presentation"/);
    const week02Row = findRowByWeek(rows, 2);
    expect(week02Row, "no row found for week 2").toBeDefined();
    expect(week02Row).not.toMatch(/at-icon-button/);
  });
  ```
  Confirm it fails (no Slides column exists yet).
- **Implementation (green):** in `src/components/LecturesGrid.astro`, add
  `<th scope="col">Slides</th>` after the Topics `<th>`, and in each row:
  ```astro
  <td>
    {lecture.data.slides && (
      <a class="at-icon-button" href={withBase(lecture.data.slides)} target="_blank" rel="noopener noreferrer" aria-label={`Open slides for Week ${lecture.data.week}`}>
        <Icon name="presentation" />
      </a>
    )}
  </td>
  ```
  (add `import Icon from "astro-theme-university/components/Icon.astro";`
  to this file too).
- **Refactor:** none from the column itself; this task also does the
  cross-viewport pass §5's other tasks' acceptance criteria already called
  for individually — no separate refactor step, but consolidate any CSS
  rule duplicated across Tasks 1-6 into a single declaration if the pass
  finds one.
- **Verification pass (manual, `agent-browser`):** with `pnpm dev` running,
  at both `1920 1080` and `390 844`: homepage; `/lectures/` and
  `/sessions/` (panel, hover, Topics chips, Slides column); three
  non-adjacent lecture/Lab pairs (e.g. week-01, week-06, week-11 — reusing
  the visual-treatment plan's own sample) to confirm titles, the slides
  button, and the spec-sheet block all still read correctly together;
  `/assessments/assignment-3-adulting/` to confirm the marking table is
  unaffected by R3's `.course-schedule`-scoped panel. Any defect found that
  can be expressed as a test gets one added here before it's fixed (per
  this repo's established Task 8 convention).
- **Acceptance criteria:**
  - The new assertion passes; `pnpm check` green including axe on every
    page; `spec/glossary.test.ts` passes.
  - No page scrolls horizontally at 390×844.
  - The Lectures table's Slides column shows the icon-only button only on
    week-01's row; every other row's Slides cell is empty.
  - Clicking a Slides button (detail page or table) opens the deck in a
    new tab.
  - Every table (Lectures, Labs, marking-criteria) reads as one coherent
    treatment at both viewports — panel/hover on the two schedule tables,
    unchanged elsewhere.
  - `truncateTopic`'s default of 4 words (Assumption 3) still reads
    sensibly once real chips render; if not, adjust the constant and
    re-verify — noted here rather than left as a future guess.
- **Depends on:** Tasks 1-6.

## 6. Feature-level Definition of Done

- [x] Every task in §5 complete and its tests passing
- [x] `pnpm test` passes (`pnpm build && vitest run spec`)
- [x] `pnpm check` passes (`pnpm typecheck && pnpm test`)
- [x] `spec/glossary.test.ts` still passes in full, including against the
      new Topics columns
- [x] Manually verified per Task 7's pass at both `1920 1080` and `390 844`
- [x] `.course-list`/`.course-specsheet` are visually unchanged from before
      this plan (R2 confirmed as token-only, no new boxes)
- [x] Every requirement in §2 is covered — see §7
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (R1) measure to 44rem | Task 1 |
| 2.1.2 (R2) restore radius/shadow tokens | Task 1 |
| 2.1.3 (R3) schedule-table panel + hover | Task 2 |
| 2.1.4 (R4) lecture titles say "Lecture" | Task 3 |
| 2.1.5 (R5) slides button, icon, new tab | Task 4 |
| 2.1.6 (R6) topics-extraction + code-preserving truncation | Task 5 |
| 2.1.7 (R7) `TopicChips` component | Task 5 |
| 2.1.8 (R8) Lectures Topics column | Task 5 |
| 2.1.9 (R9) Labs Topics column | Task 6 |
| 2.1.10 (R10) Lectures Slides column | Task 7 |
| 2.2 icon-only elements have accessible names | Task 7 (assertion); Task 4 |
| 2.2 reduced motion / transition budget unaffected | Task 2 (no transition added); §6 checklist |
| 2.2 `pnpm check` at every task boundary | Acceptance criteria of every task |
| 2.2 `spec/glossary.test.ts` unaffected | Task 5 (assertion, the real risk — lectures' `## Content` has backtick terms); Task 6 (Labs' `spec:` has none, verified no-op); §6 checklist |

## 8. Risks / open questions

None.
