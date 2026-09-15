# Lab hero images: a relevant stock photo per week

- **Date:** 2026-09-14
- **Status:** Draft
- **Approved by user:** yes — 2026-09-14

## 1. Problem / intent

This surfaced while executing `plans/2026-09-14-slop1521-lab-activities.md` —
the user is revising each Lab's content carefully right now and wants to add
a relevant stock/hero image to each Lab page's banner while the context is
fresh, but implementing it now would touch `src/content.config.ts` (a new
frontmatter shape) and rendering files outside that plan's declared scope
(§2.3), and needed its own decisions about sourcing, licensing, and
interaction with that plan's Week 3 "no images" resolution (2.1.9). The user
asked for this to be captured now via `brainstorm-feature` and implemented as
separate follow-up work once the lab-activities plan lands.

The intent: every Lab (`src/content/sessions/week-01.md` … `week-12.md`)
gets an optional hero banner image on its individual page
(`src/pages/sessions/[slug].astro`), relevant to that week's topic, with
visible photographer/license attribution — and the Labs overview grid
(`src/components/SessionsGrid.astro`) gets a thumbnail per week showing the
same image.

## 2. Requirements

### 2.1 Functional requirements

1. `sessions` in `src/content.config.ts` gains three new optional fields,
   added via the function-schema form (`({ image }) => ...`), matching the
   `people` collection's existing `photo`/`photoAlt` pattern:
   - `heroImage` — `image().optional()`, a file co-located with its week's
     markdown (e.g. `src/content/sessions/week-02-hero.avif`), not a bare
     string path.
   - `heroImageAlt` — `z.string().trim().optional()`.
   - `heroCredit` — `z.string().trim().optional()`, free text for the
     photographer/license line (e.g. `Photo: "Title" by Photographer,
     licensed CC BY-SA 2.0.`).
   A `superRefine` requires `heroImageAlt` whenever `heroImage` is present —
   the same rule the `people` collection already enforces for `photo`/
   `photoAlt`.
2. `src/pages/sessions/[slug].astro` passes `session.data.heroImage` /
   `session.data.heroImageAlt` through to `ContentLayout`'s existing
   `heroImage`/`heroImageAlt` props (already supported end-to-end by the
   theme's `ContentLayout` → `Hero` → `resolveHeroImage`; no new component).
   When `session.data.heroCredit` is present, render it as a small credit
   paragraph under the banner, styled/placed the same way as the existing
   `.hero-credit` paragraph in `src/pages/index.astro`.
3. `src/components/SessionsGrid.astro` gains a thumbnail column: each row
   renders `session.data.heroImage` (via Astro's `<Image>`) where present,
   and renders nothing extra in that cell where absent.
4. A week with no `heroImage` set renders exactly as it does today: the Lab
   page falls back to `ContentLayout`'s plain `<h1>`, and the grid row's
   thumbnail cell is empty — this is an accepted, non-blocking outcome, not
   every week is required to end up with an image before this ships.
5. Each week that does get an image has a `heroImage` sourced and proposed
   by Claude (search Wikimedia Commons / Openverse / Flickr CC or similar
   for a CC-licensed or public-domain photo matching that week's topic),
   approved by the user before being added, with `heroImageAlt` describing
   the image plainly and `heroCredit` naming the photographer and exact
   license.
6. Chosen photos read as mundane/domestic, matching the course's existing
   voice (concrete, ordinary-life imagery — a full laundry basket, a messy
   sock drawer, a cluttered desk — not a corporate-stock-photo aesthetic,
   and not a technical/CS-themed image). No photo depicts an identifiable
   real person in a way that misrepresents them.
7. Week 3 is included like every other week — the existing plan resolution
   at `plans/2026-09-14-slop1521-lab-activities.md` §2.1.9 ("Week 3's
   ranking activity is implemented with the five outfits described in
   prose, no image files added or referenced") is scoped to the five
   outfits inside that ranking activity, not to the page's hero banner;
   the two are unrelated and this feature does not reopen or alter 2.1.9.
8. New prose (any visible credit text) passes `spec/voice.test.ts` in full
   (no `BANNED_TERMS`, no `GENDERED_TERMS`) — same bar as every other piece
   of visible content in this repo. `heroImageAlt` is not scanned by
   `spec/voice.test.ts` today (it checks rendered visible text, and alt
   text is an attribute, not visible text), but is still written in the
   course's plain, factual style as good practice, not as an enforced test.

### 2.2 Non-functional requirements

- Only CC-licensed or public-domain source images are used, each with a
  visible attribution line (`heroCredit`) — matching the precedent already
  set by `src/pages/index.astro`'s `.hero-credit` paragraph.
- Image files are added directly (not referenced by remote URL), so they
  survive the source site changing or disappearing, and get Astro's normal
  image-optimization pipeline via the `image()` schema helper.

### 2.3 Out of scope

- Any change to `ContentLayout.astro`, `Hero`, or `resolveHeroImage` in the
  `astro-theme-university`/`astro-course-university` theme packages — these
  already fully support `heroImage`/`heroImageAlt`; nothing there needs
  modification.
- Hero images (or any rendering change at all) for `lectures`, `assessments`,
  or `people` — this feature only touches `sessions`.
- Any change to the ranking activity itself in Week 3's Lab content
  (`src/content/sessions/week-03.md`) or to plan resolution 2.1.9 — the hero
  banner is additive and unrelated.
- Any change to `src/pages/index.astro`'s own existing hero image/credit.
- Redesigning `SessionsGrid.astro`'s table layout beyond adding the one
  thumbnail column (no new sorting/filtering/lazy-loading work).
- Adding a new automated test asserting every week has a `heroImage` — since
  a week without one is an accepted, non-blocking outcome (2.1.4), there is
  no pass/fail check to add here beyond `pnpm check` continuing to pass.

## 3. Existing context

- `src/content.config.ts` — `sessions` currently uses the plain-object
  schema form (`courseNodeSchema.extend({...}).loose()`), no image field.
  The `people` collection already uses the function form
  (`({ image }) => z.object({ photo: image().optional(), photoAlt: ...
  }).superRefine(...)`) — the direct precedent for this feature's schema
  shape.
- `node_modules/astro-theme-university/layouts/ContentLayout.astro` — reads
  `heroImage`/`heroImageAlt` props, resolves via `resolveHeroImage`, and
  renders a `<Hero>` component if present, else falls back to a plain
  `<h1>` — confirmed by reading the file directly; no new component is
  needed.
- `node_modules/astro-theme-university/images.ts` — `resolveHeroImage`
  accepts `ImageMetadata` (an imported/co-located asset resolved via the
  `image()` schema helper), a `RemoteImage` (`{ src }`), an `http(s)://`
  string, or a `/src/assets/...` string path; anything unsupported warns
  and drops the image gracefully rather than failing the build.
- `src/pages/people/[slug].astro` — demonstrates the wiring pattern this
  feature follows: `heroImage={person.data.photo ?? undefined}` /
  `heroImageAlt={photoAlt}` passed straight to `ContentLayout`.
- `src/pages/index.astro` — demonstrates the existing hero-image +
  attribution pattern this feature's `heroCredit` line follows: an imported
  local asset passed to `ContentLayout` as `heroImage`/`heroImageAlt`, plus
  a `.hero-credit` paragraph crediting the photographer and CC license
  underneath.
- `src/pages/sessions/[slug].astro` — the per-Lab page; currently passes no
  `heroImage`/`heroImageAlt` to `ContentLayout`.
- `src/components/SessionsGrid.astro` — the Labs overview table (Week /
  Date / Title / Topics columns); no image column today.
- `scripts/check-evidence.ts` — hash-checks that certain starter placeholder
  images (`src/assets/images/hero-home.avif`, `src/assets/images/card.png`,
  `src/content/people/idris-fenn.avif`, `src/content/people/marisol-quaye.avif`)
  have been replaced. Irrelevant to this feature: none of those paths are
  touched, and every new hero image is a genuinely new file, not a reused
  starter asset.
- `plans/2026-09-14-slop1521-lab-activities.md` §2.1.9 — Week 3's Lab
  ranking activity is implemented with five outfits in prose, no image files
  added or referenced. Read directly and confirmed this resolution is scoped
  to the outfits inside that one activity, not the page as a whole.
- `spec/voice.test.ts` — scans rendered visible text for `BANNED_TERMS`,
  `FRAMING_PHRASES` (homepage + lecture Overview only), and `GENDERED_TERMS`
  (week-09 only); does not scan `alt` attributes.

## 4. Design

**Schema** (`src/content.config.ts`):

```ts
sessions: defineCollection({
  loader: courseNodeLoader("sessions"),
  schema: ({ image }) =>
    courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
        heroImage: image().optional(),
        heroImageAlt: z.string().trim().optional(),
        heroCredit: z.string().trim().optional(),
      })
      .loose()
      .superRefine((session, ctx) => {
        if (session.heroImage && !session.heroImageAlt) {
          ctx.addIssue({
            code: "custom",
            path: ["heroImageAlt"],
            message: "describe the hero image when one is supplied",
          });
        }
      }),
}),
```

Exact chaining of `.extend().loose().superRefine()` is left to
implementation, subject to it compiling and enforcing the same rule as
`people`'s `photoAlt` check.

**Per-Lab page** (`src/pages/sessions/[slug].astro`): pass
`heroImage={session.data.heroImage}` / `heroImageAlt={session.data.heroImageAlt}`
to `ContentLayout`; render a `.hero-credit`-style paragraph with
`session.data.heroCredit` immediately under the banner when present, mirroring
`src/pages/index.astro`'s existing credit paragraph.

**Grid page** (`src/components/SessionsGrid.astro`): add a `Thumbnail` (or
similarly named) `<th>`/`<td>` column, rendering an `<Image>` from
`session.data.heroImage` where present, and an empty cell otherwise.

**Content files**: each of `week-01.md` … `week-12.md` optionally gains
`heroImage: ./week-NN-hero.<ext>`, `heroImageAlt: "..."`, and
`heroCredit: "..."` in frontmatter, plus the corresponding image file
co-located next to it (e.g. `src/content/sessions/week-02-hero.avif`),
sourced and proposed one week at a time.

**Alternative considered:** storing images under
`src/assets/images/sessions/` and referencing them by `/src/assets/...`
string path (the mechanism `resolveHeroImage` also accepts) was considered,
but the co-located `image()` approach was chosen to match the `people`
collection's existing precedent exactly, keeping one idiom for
"per-content-item image" across the codebase rather than two.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | ambiguity | Local asset vs remote URL for image storage? | Local, co-located asset via Astro's `image()` helper (user's choice) |
| 2 | ambiguity | Who sources the specific photo per week? | Claude searches and proposes one per week; user approves (user's choice) |
| 3 | contradiction (apparent) | Does Week 3's "no images" resolution (2.1.9) block a Week 3 hero image? | No — 2.1.9 is scoped to the ranking activity's five outfits, not the page banner; Week 3 gets a hero image like every other week (user's choice) |
| 4 | gap | Should the Labs overview grid also show each week's image? | Yes — add a thumbnail column to `SessionsGrid.astro` (user's choice) |
| 5 | gap | How is each image credited? | New optional `heroCredit` frontmatter field per week, rendered under the banner like the homepage's `.hero-credit` (user's choice) |
| 6 | gap | What happens for a week without a good candidate photo? | Renders exactly as today (plain `<h1>`, empty thumbnail cell) — non-blocking, not every week is required to end up with an image |
| 7 | gap | Does `heroImageAlt` need to pass `spec/voice.test.ts`? | Not scanned by that test (attribute, not visible text); written in the course's plain style anyway as good practice, not an enforced check |
| 8 | ambiguity | Co-located `image()` field vs `src/assets/...` string path for storage mechanism? | Co-located `image()`, matching the `people` collection's existing precedent |

## 6. Handoff notes for planning

- This is implemented as follow-up work **after**
  `plans/2026-09-14-slop1521-lab-activities.md` completes — do not start
  `plan-feature` for this until the user says so.
- Likely task shape for `plan-feature`: one task for the schema + rendering
  plumbing (`content.config.ts`, `[slug].astro`, `SessionsGrid.astro`) with
  a small fixture image to prove the plumbing end-to-end, then one task per
  week (or a small batch of weeks) to source, propose, and add that week's
  actual `heroImage`/`heroImageAlt`/`heroCredit` — each requiring a
  `Human review:` line before the sourced photo is accepted, matching this
  repo's existing pattern for content-quality work.
- Do not re-litigate: storage mechanism (row 1/8), sourcing responsibility
  (row 2), Week 3 inclusion (row 3), grid-page scope (row 4), attribution
  mechanism (row 5), or the no-image fallback being acceptable (row 6) — all
  already decided here.
- When implementation reaches the schema change, add the `superRefine`
  check for `heroImageAlt` in the same pass as the field itself — don't ship
  `heroImage` without it, mirroring how `people.photo`/`photoAlt` already
  works.
