# SLOP1521 foundation: course record, cast, policies, homepage and harness

- **Date:** 2026-09-09
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-09 (via
  `specs/2026-09-09-slop1521-introduction-to-life.md`)

## 1. Summary

This is the first of three plans delivering the COMP4020 Assignment 2 course
website: a whole course site for **SLOP1521 — Introduction to Life: Personal
Systems Maintenance**, a satirical-but-straight-faced foundational course in the
skills CS culture treats as optional. This plan builds the *shell*: the course
record every other page reads, the teaching cast, the policies page, the
homepage, the artwork, and the `CLAUDE.md` harness rules that keep the other two
plans honest. After it, the site is coherently this course everywhere except the
twelve weeks and five assessments, which are Plan 2
(`plans/2026-09-09-slop1521-curriculum.md`), and it still wears the starter's
visual treatment, which is Plan 3
(`plans/2026-09-09-slop1521-visual-treatment.md`).

The design and every decision behind it live in
`specs/2026-09-09-slop1521-introduction-to-life.md`. Read it first; this plan
does not restate the reasoning, only what to build.

## 2. Requirements

### 2.1 Functional requirements

Numbered as `FN.n` and mapped to the spec's own F-numbers.

1. **F1.1** (spec F7) `src/course-config.ts` exports a `courseMeta` with
   `code: "SLOP1521"`, `level: 1`,
   `title: "Introduction to Life: Personal Systems Maintenance"`,
   `session: "Semester 1"`, `year: 2027`, `startDate: "2027-02-22"`,
   `endDate: "2027-06-19"`, the 205-character description in the spec §4.1, and
   `tags: ["life skills", "wellbeing", "self-management"]`.
2. **F1.2** `slopCourseMetaSchema` accepts a `learningOutcomes` array and
   `courseMeta` carries the nine outcomes from the course design, so
   `/api/index.json`'s `course.learningOutcomes` is populated rather than `[]`.
3. **F1.3** The nine learning outcomes are visible on the rendered homepage, not
   only in the API.
4. **F1.4** (spec F9) `sessionLabels` is `{ singular: "Lab", plural: "Labs" }`,
   so every reader-facing use of the `sessions` collection says Lab/Labs while
   the collection key, refs and URL stay `sessions`.
5. **F1.5** (spec F15) Exactly four `people` entries exist, all fictional: one
   with `role: convenor` and three with `role: tutor`, each with an
   `affiliation` naming the School of Applied Competence and its specialism, and
   each with a `description` of at least 40 characters. Neither starter entry
   (`idris-fenn`, `marisol-quaye`) remains.
6. **F1.6** No content node carries a dangling `teachers:` ref after the starter
   cast is removed.
7. **F1.7** (spec F16) `src/pages/policies/index.mdx` is a real policies page,
   in character, carrying exactly one plain-register **Content and disclosure**
   section that states what the satire targets, that reflections are never read
   aloud, and that Week 9's reflection is optional.
8. **F1.8** (spec F18) The thesis sentence — *Competence is a skill like any
   other. CS culture just never taught you this one.* — appears **verbatim** on
   the rendered homepage and in `CLAUDE.md`.
9. **F1.9** The homepage's authored body is course-specific prose leading with
   the systems-engineering framing and naming the five-station examination; none
   of the starter's `What you will do` / `Who it is for` / `Where to go next`
   placeholder text survives.
10. **F1.10** (spec F20) `src/assets/images/hero-home.avif` and
    `src/assets/images/card.png` are no longer the starter images, and the
    hero's alt text describes the replacement.
11. **F1.11** `CLAUDE.md` carries, as enforceable harness rules: the pinned
    thesis, the five-slot weekly structure, the never-break-character register
    with its single policies-page exception, the `role`-is-an-enum constraint,
    and the noon-deadline rule.
12. **F1.12** Every `STARTER_CONTENT` marker in the files this plan touches is
    removed along with the content it marked:
    `src/course-config.ts`, `src/pages/policies/index.mdx`, and both markers in
    `src/pages/index.astro`.

### 2.2 Non-functional requirements

- `pnpm check` (typecheck + build + `vitest run spec`) passes at every task
  boundary. The build runs axe over every rendered page, verifies internal links
  respect the `/<repo>/` base path, and fails on a dangling content ref.
- Rendered output verified with `agent-browser` at both marking viewports:
  `1920 1080` and `390 844`.
- `src/assets/images/card.png`'s replacement stays 1200×630 (the link-preview
  card size the theme re-encodes to JPEG).
- No root-absolute `href` in `.astro` files; markdown links and theme
  components are base-path-rewritten, hand-written ones are not.
- `dist/`, `.astro/` and generated `api/*.json` are never hand-edited.

### 2.3 Out of scope

- The twelve weeks, five assessments and the Week 1 deck — Plan 2.
- All visual treatment: tokens, type, the grids-as-tables rewrite, the mono
  glossary, the spec-sheet block — Plan 3.
- `PROCESS.md` — the user writes it.
- Any change to the fixed platform: the Slop branding and three brand inks, the
  four collection keys, the build pipeline, the generated API contract.
- Replacing `src/content/people/*.avif` with new portraits. The starter
  portraits are **deleted**, and the new cast ships without photos (see §2.4).

### 2.4 Assumptions

1. The cast ships **without portraits**. `scripts/check-evidence.ts:120-123` says
   a missing file passes — its comment says "dropping a portrait with the person it
   belonged to is a design decision" — and the `people` schema makes `photo`
   optional while forcing `photoAlt` when one is present. Adding four
   portraits is a design choice available later; nothing in the spec requires
   them.
2. The nine learning outcomes belong both in the API and on the homepage.
   Nothing in `src/` or the theme renders `learningOutcomes` (verified by grep),
   so API-only would make them invisible to a marker reading the site — and the
   spec's register argument wants stated outcomes visible, because a real course
   handbook has them. This was a gap in the spec, not a decision it made.
3. Fictional cast names must be low-collision and clearly invented, matching the
   starter's register (`Idris Fenn`, `Marisol Quaye`). The plan fixes roles,
   affiliations and bio angles; the exact names are the implementer's to pick
   within that constraint.

## 3. Existing code context

Every claim below was verified by reading the file on 2026-09-09.

### 3.1 `src/course-config.ts`

Exports `slopCourseMetaSchema` and `courseMeta`. The schema is
`z.strictObject({...})` — **an unknown field name fails the build** — with a
`.superRefine` enforcing two rules: `course.level` must equal the code's first
digit, and `startDate` must not be after `endDate`. Current field shapes:

```ts
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

code:        z.string().regex(allowedCode)
title:       z.string().trim().min(1).max(100)
session:     z.string().trim().min(1).max(40)
year:        z.number().int().min(2026).max(2200)
level:       z.literal(LEVELS)
startDate:   z.iso.date()
endDate:     z.iso.date()
description: z.string().trim().min(80).max(300)
tags:        z.array(z.string().trim().min(2).max(24)).min(1).max(3)
```

`courseMeta` is `slopCourseMetaSchema.parse({...}) satisfies CourseMetaInput`.
Because the schema is strict, `learningOutcomes` must be **added to the schema**
before it can be added to the record.

`CourseMetaInput` comes from
`node_modules/astro-course-university/course-graph-integration.ts:28`, where the
package's own schema declares `learningOutcomes: z.array(z.string()).default([])`
— so the field is already part of the API contract and optional in the input.

The record currently carries the placeholder values and a
`// STARTER_CONTENT: replace this course record, then remove this comment.`
line immediately above the `parse(` call.

### 3.2 `src/site-config.ts`

```ts
export const sessionLabels = { singular: "Session", plural: "Sessions" } as const;
export const graphCollections = ["sessions", "assessments", "lectures", "people"];
export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];
export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",
  links: [
    { text: "Lectures", href: "/lectures/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],
  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt: `A preview card for ${courseMeta.code}: ${courseMeta.title}`,
});
```

The nav's `sessions` entry already derives its text from `sessionLabels.plural`,
and `socialImageAlt` already derives from `courseMeta`, so **changing
`sessionLabels` is the only edit F1.4 needs** — the nav follows.

### 3.3 The `people` collection and the role trap

`src/content.config.ts` declares `people` inline (it does **not** use the
package's `definePeopleCollection`), with this schema:

```ts
title:       z.string().trim().min(1)
description: z.string().trim().min(40)
role:        z.string().trim().min(1)          // free string in the schema
contact:     z.string().trim().min(1).optional()
affiliation: z.string().trim().min(1).optional()
email:       z.email().optional()
url:         z.url().optional()
photo:       image().optional()
photoAlt:    z.string().trim().optional()
published:   z.coerce.boolean().default(true)
// superRefine: a `photo` without a `photoAlt` is an error
```

**But `role` is effectively an enum at render time.**
`src/components/PeopleGrid.astro:8-22` maps:

```ts
const roleOrder: Record<string, number>  = { convenor: 0, tutor: 1, guest: 2, other: 3 };
const roleLabels: Record<string, string> = { convenor: "Convenor", tutor: "Tutor",
                                             guest: "Guest lecturer", other: "" };
```

An unrecognised `role` sorts to `99` **and renders no label at all**, because
`roleLabels[role]` is `undefined` and the `<p>` is guarded on it.
`src/components/TeachingTeam.astro:19` prints `person.data.role` raw. So a role
like `"Tutor, Textile Care and Garment Longevity"` silently breaks the People
listing. Specialisms go in `affiliation`.

### 3.4 The starter cast is referenced by four teaching nodes

```
src/content/sessions/01-getting-started.md:9    - marisol-quaye
src/content/sessions/02-first-review.md:9       - idris-fenn
src/content/lectures/week-01.md:9               - marisol-quaye
src/content/lectures/week-02.md:8               - idris-fenn
```

`teachers` is `z.array(reference("people")).min(1)` and **the build fails on a
ref that doesn't resolve**, so deleting the starter cast without repointing
these four refs breaks the build. Those four files are all replaced in Plan 2;
this plan repoints them as an interim step (Task 3).

### 3.5 Dates, and the UTC rendering trap

`src/lib/dates.ts` in full:

```ts
const longDate = new Intl.DateTimeFormat("en-AU", { dateStyle: "long", timeZone: "UTC" });

/** Format a date-only value without letting the viewer's timezone move it. */
export function formatCourseDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return longDate.format(date);
}
```

Used by `src/pages/assessments/[slug].astro:38` and all three grids. Because it
formats in **UTC**, a `due` of `09:00+11:00` is `22:00Z` the previous day and
renders as the wrong date. Verified by running the formatter:
`2027-03-02T09:00:00+11:00` renders `"1 March 2027"`.
`2027-03-02T12:00:00+11:00` renders `"2 March 2027"`. **All deadlines are noon**
— which is also what both starter assessments already use
(`2027-04-12T12:00:00+10:00`). This constrains Plan 2, and is why F1.11 puts the
rule in `CLAUDE.md`.

Australia/Canberra leaves daylight saving on 2027-04-04, so dated frontmatter
before that is `+11:00` and after it `+10:00`.

### 3.6 The generated API, which the tests read

`dist/api/index.json` has top-level keys
`schemaVersion, canonicalUrl, course, timezone, nodes, edges`.

`course` is `{ code, title, session, year, level, startDate, endDate,
description, tags, learningOutcomes }`. Node shape is
`{ id, type, title, description, tags, related, spec, meta }`, with
`type` one of `sessions | lectures | assessments | people | policies`.
`meta.date` is a bare `YYYY-MM-DD`; `meta.due` is the **raw offset string**
(`"2027-04-12T12:00:00+10:00"`), so `data-integrity`'s `slice(0, 10)` reads the
local date and is unaffected by §3.5's display bug. People carry
`meta.role`, `meta.affiliation`, `meta.email`, `meta.contact`.

Rendered HTML is also available to tests: `dist/index.html`,
`dist/policies/index.html`, `dist/people/index.html`, and
`dist/<collection>/<slug>/index.html`.

### 3.7 Test setup

- Framework **vitest 4**, no config file — defaults only.
- `pnpm test` = `pnpm build && vitest run spec`. There is only ever this
  ordering: `spec/` tests assert what the site actually **built**, so they read
  `dist/`, never `src/`.
- `pnpm check` = `pnpm typecheck && pnpm test`.
- `pnpm test:template` = `vitest run scripts` — template-maintainer tests, not
  ours.
- `pnpm check:evidence` = `node scripts/check-evidence.ts`.
- Any `spec/*.test.ts` is picked up. The shipped example,
  `spec/data-integrity.test.ts`, establishes the convention this plan follows:
  `readFileSync(resolve("dist/api/index.json"), "utf8")` at module scope, a local
  `interface ApiNode`, then `describe`/`it`/`expect` with a message as
  `expect`'s second argument.

### 3.8 `scripts/check-evidence.ts`

For a repo whose name starts `comp4020-ass2-` it additionally: fails if
`git grep -F STARTER_CONTENT -- src` returns anything, and fails if any of four
starter images still hashes to its shipped sha256 —
`src/assets/images/card.png`, `src/assets/images/hero-home.avif`,
`src/content/people/idris-fenn.avif`, `src/content/people/marisol-quaye.avif`.
**A deleted file passes.** It also requires `CLAUDE.md` and a `PROCESS.md` with
resolving commit citations, and expects no `reflections/` entry for an
assignment repo.

### 3.9 Conventions to match

- Content frontmatter is 2-space-indented YAML; `description` is written as a
  wrapped block scalar; refs are bare slugs within a collection
  (`- marisol-quaye`) and `<collection>/<slug>` across them
  (`- sessions/01-getting-started`).
- Components import `getPublishedCollection` from
  `astro-course-university/content` and `formatCourseDate` from `../lib/dates`.
- `.mdx` listing pages carry `title`, `description` and `heroTitle` frontmatter
  and import their grid from `../../components/`.
- Prose register throughout the repo is plain, second-person, no filler.

## 4. Approach

Build the shell outward from the single source of truth. `src/course-config.ts`
gates everything — the homepage title, the nav, the API's `course` block and the
date window `spec/data-integrity.test.ts` enforces — so it lands first, and
widening `endDate` to `2027-06-19` is safe because all six starter nodes already
sit inside the new window (verified: lectures weeks 1–2 on 2027-02-22 and
2027-03-01, sessions likewise, assessments due 2027-04-12 and 2027-05-28).

Then the cast, because it is the one change that can break the build for a
reason unrelated to itself: `teachers` is a resolved reference and the build
fails on a dangling ref, so the four starter teaching nodes are repointed in the
same task that deletes the starter people. That interim edit is deliberately
throwaway — Plan 2 replaces all four files — and saying so here stops a reader
treating it as content work.

Then policies, homepage and artwork, which are independent of each other.
`CLAUDE.md` lands last, because its rules are written against decisions the
earlier tasks have already made concrete, and because it is where Plan 2 and
Plan 3 inherit their constraints from.

Two `spec/` checks from the spec's §4.7 belong to this plan — check 7 (the
thesis pinned verbatim on the homepage) and check 9 (the policies content note)
— plus new record, label, cast and harness assertions this plan needs to protect
its own promises. The remaining eight checks belong to Plans 2 and 3, alongside
the content they protect, per the spec's §6.

**Alternative considered and rejected:** patching `src/lib/dates.ts` to format in
`Australia/Canberra` instead of moving deadlines to noon. Rejected because UTC is
*correct* for the bare `YYYY-MM-DD` `date:` fields, which are 24 of the site's
29 dated nodes; changing it to fix five deadlines would move every teaching date
by up to a day in the other direction, and the timezone is already declared once
in `astro.config.ts` for the API.

## 5. Task breakdown

### Task 1: Replace the course record and add `learningOutcomes` in `src/course-config.ts`

- **Description:** Swap the placeholder `courseMeta` for SLOP1521's real record,
  extend the strict schema with `learningOutcomes`, populate the nine outcomes,
  and remove the `STARTER_CONTENT` comment.
- **Files touched:** `src/course-config.ts` (existing),
  `spec/course-record.test.ts` (new).
- **Tests first (red):** `spec/course-record.test.ts`, reading
  `dist/api/index.json` at module scope per §3.7. In
  `describe("course record")`:
  - `it("is SLOP1521 at level 1")` — `course.code === "SLOP1521"` and
    `course.level === 1`.
  - `it("names the course and its method")` — `course.title ===
    "Introduction to Life: Personal Systems Maintenance"`.
  - `it("runs in Semester 1 2027 across teaching and examination")` —
    `course.session === "Semester 1"`, `course.year === 2027`,
    `course.startDate === "2027-02-22"`, `course.endDate === "2027-06-19"`.
  - `it("carries a description the catalogue will accept")` —
    `course.description.length` between 80 and 300 inclusive, and the string
    contains `"systems engineering"`.
  - `it("declares one to three tags")` — `course.tags` has length 1–3, every
    entry 2–24 chars.
  - `it("publishes nine learning outcomes")` —
    `course.learningOutcomes.length === 9` and every entry is a non-empty
    string.
- **Implementation (green):** in `slopCourseMetaSchema`'s `z.strictObject`, add
  `learningOutcomes: z.array(z.string().trim().min(1)).max(12).default([])`.
  Replace the parsed record with the §4.1 values from the spec, adding
  `learningOutcomes: [...]` with the nine outcomes from the course design.
  Delete the `// STARTER_CONTENT:` line.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check` passes, including `spec/data-integrity.test.ts` — every
    existing starter node still sits inside `2027-02-22`…`2027-06-19`.
  - `/api/index.json`'s `course.learningOutcomes` has nine entries, not `[]`.
  - `git grep -F STARTER_CONTENT -- src/course-config.ts` returns nothing.
  - The homepage `<title>` reads `SLOP1521: Introduction to Life: Personal
    Systems Maintenance`.
- **Depends on:** None.

### Task 2: Rename teaching sessions to Labs in `src/site-config.ts`

- **Description:** Set `sessionLabels` to Lab/Labs, and rewrite the placeholder
  prose on the sessions listing page that explains the template's own naming
  mechanism.
- **Files touched:** `src/site-config.ts`, `src/pages/sessions/index.astro`
  (both existing), `spec/navigation.test.ts` (new).
- **Tests first (red):** `spec/navigation.test.ts`, reading
  `dist/index.html`:
  - `it("calls teaching sessions Labs in the nav")` — the HTML contains
    `>Labs<` and does **not** contain `>Sessions<`.
  - `it("keeps every nav destination")` — the HTML contains
    `href` values ending `/lectures/`, `/sessions/`, `/assessments/`,
    `/people/` and `/policies/`.
  - `it("does not explain the template's own naming mechanism")` — reading
    `dist/sessions/index.html`, asserts it does **not** contain
    `"src/site-config.ts"`.
- **Implementation (green):**
  `export const sessionLabels = { singular: "Lab", plural: "Labs" } as const;`
  In `src/pages/sessions/index.astro`, replace the `<p>` about the `sessions`
  collection key with one sentence of course-specific prose about what a Lab is
  in this course. Leave `links`, `graphCollections` and `courseApiCollections`
  untouched — the nav's session entry already derives from `sessionLabels.plural`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Nav reads `Lectures · Labs · Assessment · People · Policies` at 1920×1080
    and 390×844.
  - The `sessions` collection key, refs and `/sessions/` URLs are unchanged
    (`grep -rn '"sessions"' src/site-config.ts src/content.config.ts` still
    matches).
  - `pnpm check` passes.
- **Depends on:** None.

### Task 3: Replace the cast with four School of Applied Competence entries

- **Description:** Add the four cast entries, delete both starter entries and
  their portraits, and repoint the four starter teaching nodes' `teachers:` refs
  so the build keeps resolving.
- **Files touched:** four new files under `src/content/people/`;
  delete `src/content/people/idris-fenn.md`, `idris-fenn.avif`,
  `marisol-quaye.md`, `marisol-quaye.avif`; edit
  `src/content/sessions/01-getting-started.md`,
  `src/content/sessions/02-first-review.md`,
  `src/content/lectures/week-01.md`, `src/content/lectures/week-02.md`;
  `spec/cast.test.ts` (new).
- **Tests first (red):** `spec/cast.test.ts`, reading `dist/api/index.json` and
  filtering `nodes` to `type === "people"`:
  - `it("is a cast of four")` — exactly 4 people nodes.
  - `it("has one convenor and three tutors")` — exactly one node with
    `meta.role === "convenor"`, exactly three with `meta.role === "tutor"`.
  - `it("uses only roles PeopleGrid can label")` — every `meta.role` is in
    `["convenor", "tutor", "guest", "other"]`. *(This is the §3.3 trap, asserted
    so it cannot regress.)*
  - `it("puts each specialism in the affiliation")` — every node's
    `meta.affiliation` contains `"School of Applied Competence"`.
  - `it("gives every entry a real bio")` — every `description` is ≥40 chars.
  - `it("retains no starter entry")` — no node id is `people/idris-fenn` or
    `people/marisol-quaye`.
  - In `spec/navigation.test.ts` (extend), reading `dist/people/index.html`:
    `it("labels every person")` — the HTML contains `Convenor` and `Tutor`.
- **Implementation (green):** four `.md` files with frontmatter
  `title`, `description` (≥40 chars), `role` (`convenor` | `tutor`),
  `affiliation`, `email` at `@slop.university`, `contact`, and **no** `photo`
  (per §2.4.1), plus a short in-character bio body. Roles and specialisms per
  the spec §4.5:
  - Convenor — routine adherence and longitudinal self-report
  - Tutor — `School of Applied Competence — Textile Care and Garment Longevity`
  - Tutor — `School of Applied Competence — Interpersonal Protocols`
  - Tutor — `School of Applied Competence — Nutrition Systems and Domestic Logistics`

  Then `git rm` both starter `.md` files and both `.avif` files, and repoint the
  four `teachers:` refs to the new convenor's slug. Names must be clearly
  fictional and low-collision.
- **Refactor:** None expected. The four repointed `teachers:` refs are
  deliberately interim — Plan 2 replaces all four files — so do not invest in
  matching each starter node to a thematically apt tutor.
- **Acceptance criteria:**
  - `pnpm check` passes; in particular the build does not report a dangling
    content ref.
  - `/people/` lists four people, convenor first, each showing a role label.
  - `pnpm check:evidence` no longer reports `idris-fenn.avif` or
    `marisol-quaye.avif`.
  - `git grep -F STARTER_CONTENT -- src/content/people` returns nothing.
- **Depends on:** None. (Task 1 is unrelated; run either order.)

### Task 4: Write the policies page with its one plain-register section

- **Description:** Replace the placeholder policies page with a real,
  in-character policies page carrying exactly one plain-register **Content and
  disclosure** section.
- **Files touched:** `src/pages/policies/index.mdx` (existing),
  `spec/policies.test.ts` (new).
- **Tests first (red):** `spec/policies.test.ts`, reading
  `dist/policies/index.html`:
  - `it("carries a content and disclosure section")` — the HTML matches
    `/Content and disclosure/i` inside a heading tag.
  - `it("says what the satire targets")` — the HTML contains the phrase
    `"not of the students"` (the sentence that keeps the target on the culture).
  - `it("promises reflections are never read aloud")` — the HTML contains
    `"never read aloud"`.
  - `it("marks Week 9's reflection optional")` — the HTML matches
    `/Week 9/` and `/optional/i`.
  - `it("is not the starter page")` — the HTML does not contain
    `"Replace this page"`.
- **Implementation (green):** rewrite the page body. In-character policy
  sections covering attendance, late work and extensions, the reflections
  drop-lowest rule, and academic integrity — using the systems register
  (`unscheduled downtime`, `root cause`) as the spec's §4.6 centrepiece will
  later mark up. Then one clearly-delineated **Content and disclosure** section
  in plain register, per the spec §4.4. Remove the `STARTER_CONTENT` comment.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - The four assertions above pass.
  - `git grep -F STARTER_CONTENT -- src/pages/policies` returns nothing.
  - `/policies/` renders with no axe violations and reads correctly at 390×844.
  - The plain-register section is visually and tonally separable from the
    in-character policy above it.
- **Depends on:** None.

### Task 5: Rewrite the homepage body with the thesis and the learning outcomes

- **Description:** Replace the starter's three placeholder sections with
  course-specific prose, pin the thesis sentence verbatim, and render the nine
  learning outcomes.
- **Files touched:** `src/pages/index.astro` (existing),
  `spec/homepage.test.ts` (new).
- **Tests first (red):** `spec/homepage.test.ts`, reading `dist/index.html`:
  - `it("pins the thesis verbatim")` — the HTML contains exactly
    `Competence is a skill like any other. CS culture just never taught you this one.`
    *(This is the spec's check 7. The sentence has no apostrophes or quotes, so
    it survives HTML escaping unchanged.)*
  - `it("leads with the systems framing")` — the HTML contains
    `"systems engineering"`.
  - `it("names the five-station examination")` — the HTML matches
    `/five[- ]station/i`.
  - `it("publishes the nine learning outcomes")` — for each of the nine outcome
    strings from `course.learningOutcomes` in `dist/api/index.json`, the
    homepage HTML contains it. Asserts nine matches, so the page and the API
    cannot drift.
  - `it("retains no starter prose")` — the HTML does not contain
    `"What you will do"`, `"Who it is for"` or `"Say what a student spends"`.
- **Implementation (green):** in `src/pages/index.astro`, replace the authored
  block between the tag list and the closing layout tag: the thesis as a
  prominent single line, a short section on what the course is and who it is
  for in the systems register, a **Learning outcomes** list rendered from
  `courseMeta.learningOutcomes` (imported already via `courseMeta`), and keep
  the `CardGrid` of destinations with its `Card` titles updated to
  `sessionLabels.plural`. Remove the second `STARTER_CONTENT` comment (the hero
  one is Task 6).
- **Refactor:** None expected. The inline `<style>` block for `.course-tags`
  stays — it uses `--at-text-secondary` and `--at-bg-alt`, both real tokens
  (`tokens.css:85`), and restyling is Plan 3's job.
- **Acceptance criteria:**
  - All five assertions above pass.
  - The outcomes list renders from `courseMeta`, not from a hand-copied literal
    — verified by the drift test above.
  - Homepage reads correctly at both viewports with no axe violations.
- **Depends on:** Task 1 (needs `courseMeta.learningOutcomes` to exist).

### Task 6: Replace the hero and link-preview artwork

- **Description:** Replace both starter images with course-specific artwork and
  update the hero alt text.
- **Files touched:** `src/assets/images/hero-home.avif`,
  `src/assets/images/card.png` (both replaced in place),
  `src/pages/index.astro` (alt text + `STARTER_CONTENT` comment).
- **Tests first (red):** `pnpm check:evidence` currently fails with
  `src/assets/images/hero-home.avif is still the starter image` and the same for
  `card.png` (`scripts/check-evidence.ts:124-137`, sha256 comparison). That is
  the red state; no vitest case is added, because the check already exists and
  duplicating a sha256 assertion in `spec/` would restate the platform's own
  gate. Additionally extend `spec/homepage.test.ts` with
  `it("describes its own hero artwork")` — `dist/index.html` does not contain
  the starter alt text `"A lecture theatre reduced to flat gold and black
  shapes"`.
- **Implementation (green):** produce replacement artwork in the Slop two-ink
  register (the three brand inks are fixed), write it to the same two paths,
  keep `card.png` at 1200×630, and set `heroImageAlt` to describe the new image.
  Remove the hero `STARTER_CONTENT` comment.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check:evidence` reports neither image.
  - `git grep -F STARTER_CONTENT -- src/pages/index.astro` returns nothing.
  - The hero renders at both viewports without distorting or cropping badly.
  - `socialImage` in `src/site-config.ts` still resolves (path unchanged).
- **Depends on:** Task 5 (both edit `src/pages/index.astro`; sequencing avoids a
  conflict).

### Task 7: Write the harness rules into `CLAUDE.md`

- **Description:** Add the course-specific rules the other two plans inherit,
  alongside the existing working-method rules.
- **Files touched:** `CLAUDE.md` (existing), `spec/harness.test.ts` (new).
- **Tests first (red):** `spec/harness.test.ts`, reading `CLAUDE.md` from the
  repo root with `readFileSync(resolve("CLAUDE.md"), "utf8")`. *(This is the one
  test in `spec/` that reads a source file rather than `dist/`, because the
  harness is a repo promise rather than a rendered one — and `check-evidence`
  already treats `CLAUDE.md` as part of what is marked.)*
  - `it("pins the thesis verbatim")` — contains
    `Competence is a skill like any other. CS culture just never taught you this one.`
  - `it("fixes the five-slot weekly structure")` — contains all of `Overview`,
    `Content`, `Case study`, `Reflection`, `Assessment tie-in`.
  - `it("states the register rule and its single exception")` — matches
    `/never break character/i` and `/policies/i`.
  - `it("records the role-is-an-enum constraint")` — contains `convenor` and
    `affiliation`.
  - `it("records the noon deadline rule")` — matches `/12:00/` and `/UTC/`.
- **Implementation (green):** append sections to `CLAUDE.md`: the pinned thesis
  at the top; the five-slot weekly structure as a rule with the note that
  `spec/` enforces it; the never-break-character register with the single
  policies-page exception; the `role` enum constraint with a pointer to
  `PeopleGrid.astro`; and the noon-deadline rule with its one-line reason
  (`src/lib/dates.ts` formats in UTC).
- **Refactor:** None expected. Do not touch the existing "Before pushing",
  "Generated files", "Secrets", "Commits" or "PROCESS.md" sections.
- **Acceptance criteria:**
  - All five assertions pass.
  - `pnpm check:evidence` still finds `CLAUDE.md`.
  - Each new rule is stated as a constraint an agent can follow or violate, not
    as background prose.
- **Depends on:** Tasks 1–6 (the rules are written against decisions those tasks
  make concrete).

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` passes (runs `pnpm build` then `vitest run spec`)
- [ ] `pnpm check` passes (typecheck + the above)
- [ ] `pnpm check:evidence` reports no `STARTER_CONTENT` in any file this plan
      touched, and neither `hero-home.avif` nor `card.png`
      (it will still fail on Plan 2's content files and on `PROCESS.md` — expected)
- [ ] Manually verified with `agent-browser` against `pnpm dev` at
      `http://localhost:4321/comp4020-ass2-attwelveDev/`, at both
      `set viewport 1920 1080` and `set viewport 390 844`: the homepage (thesis
      visible, outcomes list, hero), `/people/` (four entries, convenor first,
      role labels), `/policies/` (the plain-register section separable from the
      in-character policy), and the nav reading Labs on every one
- [ ] Every requirement in §2 is covered — see §7
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 (F1.1) course record | Task 1 |
| 2.1.2 (F1.2) `learningOutcomes` in schema + API | Task 1 |
| 2.1.3 (F1.3) outcomes visible on homepage | Task 5 |
| 2.1.4 (F1.4) Labs label | Task 2 |
| 2.1.5 (F1.5) four-person cast | Task 3 |
| 2.1.6 (F1.6) no dangling `teachers:` ref | Task 3 |
| 2.1.7 (F1.7) policies + content note | Task 4 |
| 2.1.8 (F1.8) thesis verbatim, homepage + CLAUDE.md | Task 5 (homepage), Task 7 (harness) |
| 2.1.9 (F1.9) homepage prose | Task 5 |
| 2.1.10 (F1.10) artwork | Task 6 |
| 2.1.11 (F1.11) harness rules | Task 7 |
| 2.1.12 (F1.12) STARTER_CONTENT removed | Task 1 (config), Task 4 (policies), Tasks 5–6 (index.astro), Task 3 (people) |
| 2.2 `pnpm check` at every boundary | Acceptance criteria of Tasks 1–7 |
| 2.2 both marking viewports | §6 manual verification; Tasks 2, 4, 5, 6 acceptance |
| 2.2 card at 1200×630 | Task 6 |
| 2.2 no root-absolute hrefs | Task 5 (uses `Card`/`CardGrid`, which the theme base-path-rewrites) |
| 2.2 no hand-edited generated files | §2.3 out of scope; no task touches `dist/` or `.astro/` |

## 8. Risks / open questions

None.
