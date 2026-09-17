# Weekly Reflections — due-week fix, worked example, word ceiling, criteria glosses

- **Date:** 2026-09-17
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-17 (via `brainstorm-feature`, this conversation)

## 1. Summary

The Weekly Reflections assessment page (`src/content/assessments/weekly-reflections.md`)
currently mislabels its due-date range as "Weeks 2-12" when the twelve
prompts (weeks 1-12) each due the following Tuesday actually run through
week 13 — a pre-existing off-by-one, not a content change. Separately, the
page's marking criteria (Completion/Specificity) are given as bare
percentages with no definition, there's no worked example showing what a
"specific" vs "vague" entry looks like, and there's no word ceiling on
entries. The page's `spec` list also contains a bullet (drop-two-lowest)
that duplicates content already explained under "How the totals work" and
doesn't belong in a per-submission checklist. Finally, `src/pages/policies/
index.mdx` independently describes the drop rule as dropping **one**
lowest-scoring entry, contradicting the reflections page's drop-**two**
rule and its 10×1.5%=15% arithmetic. This plan fixes the due-week label,
adds a worked example (strong/weak, in the course's deadpan-absurd voice)
and a 200-word ceiling, adds one-line criterion glosses, removes the
redundant spec bullet, and reconciles the policies page to the correct
drop-two rule. A future student or marker reading either page should see a
single, internally consistent account of the assessment.

## 2. Requirements

### 2.1 Functional requirements

1. `weekly-reflections.md`'s `dueDisplay` frontmatter field reads
   `12:00, Every Tuesday, Weeks 2-13` (not `Weeks 2-12`).
2. `weekly-reflections.md`'s `spec` array no longer contains the bullet
   `the two lowest-scoring entries in the semester are dropped
   automatically`.
3. `weekly-reflections.md`'s `spec` array contains a new bullet
   `each entry is under 200 words`.
4. The rendered page (`dist/assessments/weekly-reflections/index.html`)
   contains a new section stating, in prose, what each marking criterion
   checks: Completion (60%) as "submitted on time, in the right format,
   and actually addressing that week's prompt", and Specificity (40%) as
   "names a real, concrete instance, not a general trait."
5. The rendered page contains a new "worked example" section with two
   labeled examples: one demonstrating a specific entry (the barista
   anecdote, verbatim as supplied by the user) and one demonstrating a
   vague entry (the "tried to talk to someone new" line, verbatim as
   supplied by the user), each followed by a one-line explanation of why
   it is scored the way it is.
6. The "How the totals work" section states explicitly that Week 1's
   prompt is due in week 2 and Week 12's prompt is due in week 13,
   alongside the existing unchanged arithmetic (twelve prompts, two
   dropped, ten counted at 1.5% each = 15%).
7. `src/pages/policies/index.mdx`'s "## Reflections" section is corrected
   to say **two** lowest-scoring reflections are dropped, absorbing
   **two** bad weeks, matching `weekly-reflections.md`.
8. All existing `spec/assessment-scheme.test.ts` assertions for the
   assessment scheme overall and for "weekly reflections" specifically
   continue to pass unmodified (no test file changes).

### 2.2 Non-functional requirements

- Voice: all new prose must pass `spec/voice.test.ts` (no banned terms, no
  `<code>` spans, no banned framing phrases, no gendered-term list hits).
  New content must stay in the course's deadpan-institutional-seriousness
  voice per `CLAUDE.md` (mundane specifics, no technical metaphor).
- The 200-word ceiling is stated in prose and the `spec` list only; it is
  explicitly **not** enforced by any `spec/` test or build-time check
  (confirmed with the user).
- Dates/format: no `due`/date format changes are required by this feature;
  the existing `due: 2027-03-02T12:00:00+11:00` value and its noon-local,
  DST-correct offset are untouched.
- Visual: verify the rendered assessment page and the policies page at
  both marking viewports (1920×1080, 390×844) per `CLAUDE.md`.

### 2.3 Out of scope

- No changes to `src/content.config.ts` (schema already supports every
  field used here — verified in Phase 2 below).
- No changes to the `due` frontmatter field's ISO value, week count logic
  elsewhere in the site, or any other assessment file.
- No automated word-count enforcement for the 200-word ceiling.
- No changes to `spec/assessment-scheme.test.ts` or any other test file —
  all touched requirements are already covered by existing assertions.

### 2.4 Assumptions

None outstanding — all resolved during the `brainstorm-feature` conversation
(due-week math, drop-count contradiction resolution, word-ceiling
enforcement scope).

## 3. Existing code context

### `src/content/assessments/weekly-reflections.md` (current, full file)

```
---
title: Weekly Reflections
description:
  Twelve short weekly reflections on the habits you are running on
  yourself, with the two lowest dropped before the running total is
  calculated
week: 1
due: 2027-03-02T12:00:00+11:00
dueDisplay: 12:00, Every Tuesday, Weeks 2-12
weight: 15
marking:
  mode: weighted
  criteria:
    - name: Completion
      weight: 60
    - name: Specificity
      weight: 40
spec:
  - submitted by 12:00 the Tuesday after the week it reflects on
  - names a specific instance, not a general claim about yourself
  - the two lowest-scoring entries in the semester are dropped automatically
---

## How the totals work

The semester runs twelve weekly prompts, covering weeks 1–12, each due at
12:00 the following Tuesday. The two lowest-scoring reflections are dropped
before the running total is calculated; the remaining ten are counted at
1.5% each — 10 × 1.5% = 15% of the course total. The drop absorbs two bad
weeks without a separate extension process.

## The prompts

Each prompt names the week whose topic it reflects on:

- Week 1 — what is already running, unmonitored, before any instruction is given
- Week 2 — a hygiene routine's actual failure, not the one you intended
- Week 3 — a wardrobe decision made under time pressure
- Week 4 — a night the sleep schedule held, or didn't, and why
- Week 5 — the day's real radius, measured rather than estimated
- Week 6 — an hour the laptop stayed closed, and what filled it instead
- Week 7 — a conversation that stalled, examined rather than excused
- Week 8 — a group chat's actual load-bearing member
- Week 9 — an opening message sent, and what it cost to send
- Week 10 — a delivery, a routine, or a receipt, read for what it actually shows
- Week 11 — a piece of workplace conduct observed rather than performed
- Week 12 — one habit from Week 1 that held all semester, and one that
  reverted the moment nobody was checking

## Submission

Each week's reflection is submitted on paper, sealed in an envelope, and
handed to the Convenor's office or to your tutor — see
[Policies](/policies/) for the full submission rule and the
extenuating-circumstances exception.
```

### `src/pages/policies/index.mdx`, lines 62-70 (current)

```
## Reflections

Weekly Reflections run on a fixed schedule: one prompt per teaching week,
due the following Tuesday. The lowest-scoring reflection in the semester is
dropped before the running total is calculated, which absorbs exactly one bad
week --- illness, a missed prompt, a reflection that did not land --- without
a separate extension process. A reflection submitted after its deadline and
without an extension is the one this rule is built to catch; ask for the
extension instead.
```

### `src/content.config.ts` — assessments collection schema (verified, lines 47-62)

```ts
assessments: defineCollection({
  loader: courseNodeLoader("assessments"),
  schema: courseNodeSchema
    .extend({
      week: weekSchema, // z.coerce.number().int().min(1).max(12)
      due: z.coerce.date(),
      dueDisplay: z.string().trim().min(1).optional(),
      weight: z.coerce.number().positive().max(100),
      marking: z.discriminatedUnion("mode", [weightedMarking, holisticMarking]).optional(),
    })
    .loose(),
}),
```

`weightedMarking` (lines 11-27) is `{ mode: "weighted", criteria: [{ name:
string, weight: number }] }` with a `superRefine` requiring weights to sum
to exactly 100 — no per-criterion description field exists, so the new
one-line glosses for Completion/Specificity must live in the Markdown body,
not frontmatter. This plan does not touch `content.config.ts`.

### `spec/assessment-scheme.test.ts` — assertions that constrain this change (verified, full relevant excerpts)

Site-wide (`describe("assessment scheme", ...)`, applies to
`assessments/weekly-reflections` among all 5 assessments):
- exactly 5 assessment items, weights sum to 100, `weekly-reflections`
  weight is exactly 15 (unchanged by this plan).
- weighted marking criteria must sum to 100 (Completion 60 + Specificity
  40 — unchanged).
- `due` must match `/T12:00:00(\+10:00|\+11:00)$/` and use `+11:00` before
  2027-04-04 / `+10:00` after (unchanged — `due` value not touched).
- `week` frontmatter must be an integer 1-12; `weekly-reflections`'s own
  `week` is `1`, coverage-end is `1` (unchanged).
- every assessment needs a non-empty `spec` array (still 3 bullets after
  this change).

`describe("weekly reflections", ...)` (reads built
`dist/assessments/weekly-reflections/index.html`):
- `it("states the reflection arithmetic")` — requires tokens `"12"`,
  `"10"`, `"1.5%"`, `"15%"` all present. Satisfied: "How the totals work"
  keeps "twelve weekly prompts", "the remaining ten", "1.5% each", "15% of
  the course total", and the new due-week clause adds "week 13" (the
  literal string `"13"` is not required by this test and does not
  conflict with it).
- `it("publishes twelve prompts")` — requires `Week 1` through `Week 12`
  each match `/Week \d\b/`. Satisfied: "## The prompts" list unchanged.
- `it("declares the drop-lowest rule")` — requires `/lowest/i` somewhere
  in the page. Satisfied: "How the totals work" still says
  "lowest-scoring."
- `it("requires a sealed paper submission")` — requires `/paper/i` and
  `/sealed/i`. Satisfied: "## Submission" section unchanged.

No assertion in this file references `dueDisplay`'s exact string, so
changing "Weeks 2-12" to "Weeks 2-13" does not need a test update
(independently confirmed via `grep -rn "dueDisplay"` across `spec/` and
`src/` — only `content.config.ts`'s schema declaration and
`src/pages/assessments/[slug].astro:66`, `<dd>{assessment.data.dueDisplay
?? formatCourseDateTime(assessment.data.due)}</dd>`, reference it; neither
constrains the string's content).

### `spec/voice.test.ts` — constraints on new prose (verified, full relevant excerpts)

- `BANNED_TERMS` (35 terms: "systems engineering", "root-cause analysis",
  "root cause", "regression check", "regression test", "manual override",
  "subsystem", "runtime", "deploy", "merge conflict", "tcp/ip",
  "handshake", "handshake protocol", "cache invalidation", "technical
  debt", "protocol", "debug", "debugging", "debuggable", "interface
  call", "supply chain", "reorder point", "telemetry", "unscheduled
  downtime", "retry logic", "coordination mechanism", "social debugging",
  "resource allocation") — checked case-insensitively against every
  rendered content page. None appear in the new prose.
- `FRAMING_PHRASES` ("taught as", "framed as", "presented as", "in the
  style of", "assessed like a") — none used in new prose.
- `GENDERED_TERMS` ("girlfriend", "boyfriend", "the girl you like", "the
  guy you like") — none used; the worked example's "she" pronoun (from
  the user-supplied barista anecdote, referring to a specific barista in
  a specific anecdote) does not match any listed term.
- No `<code>` elements are introduced.

### Test setup

- `pnpm check` = `pnpm typecheck && pnpm test`; `pnpm test` =
  `pnpm build && vitest run spec` (from `package.json`). This is the exact
  command to run for this repo — it rebuilds `dist/` (required, since
  `spec/assessment-scheme.test.ts` reads from `dist/`) and then runs all
  Vitest specs under `spec/`.
- Relevant test file: `spec/assessment-scheme.test.ts` (assessment-scheme
  and per-assessment content assertions). Relevant voice test:
  `spec/voice.test.ts`.
- No new test files are needed — this plan changes only content files
  whose correctness is already fully covered by existing assertions (see
  §2.1.8) plus one visual/tone check that only a human can settle (see
  Task 1's Human review line).

## 4. Approach

This is a content-only change to two Markdown/MDX files; no components,
schemas, or tests are added or modified. Because both files are edited
together to resolve one cross-page contradiction (the drop-count mismatch)
and because the reflections page's changes are themselves small and
tightly coupled (due-week label, spec list, two new sections), this is
scoped as a single task rather than split further — splitting the two
file edits into separate tasks would leave an intermediate commit with the
policies/reflections contradiction still unresolved on one side, which is
worse than doing them together. No alternative approach was considered
necessary given the small, fully-specified scope.

## 5. Task breakdown

### Task 1: Fix Weekly Reflections due-week range, add worked example/word ceiling/criterion glosses, and reconcile the policies page's drop-count

- **Description:** Replace `src/content/assessments/weekly-reflections.md`
  in full with the corrected content (frontmatter `dueDisplay` fixed to
  "Weeks 2-13", `spec` bullet swapped for the word-ceiling bullet, two new
  body sections added, "How the totals work" given the explicit
  week-2/week-13 clause). Edit `src/pages/policies/index.mdx` lines 62-70
  to change "one"/"exactly one bad week"/"is the one this rule is built to
  catch" to "two"/"two bad weeks"/"is one of the weeks this rule is built
  to catch".
- **Files touched:**
  - `src/content/assessments/weekly-reflections.md` (full replace)
  - `src/pages/policies/index.mdx` (edit lines 62-70 only)
- **Tests first (red):** None to add — this content is already fully
  covered by the existing assertions in `spec/assessment-scheme.test.ts`
  listed in §3 above, all of which currently pass against the unmodified
  file and will continue to pass against the new content (verified
  clause-by-clause in §3). Per the plan's non-functional requirements
  (§2.2), no new automated check is being added for the word ceiling or
  the criterion glosses — those are prose-only additions with no
  mechanical assertion to write. Confirm current green baseline by running
  `pnpm test` before editing.
- **Implementation (green):**
  - `weekly-reflections.md` frontmatter: change `dueDisplay: 12:00, Every
    Tuesday, Weeks 2-12` to `dueDisplay: 12:00, Every Tuesday, Weeks
    2-13`; change `spec` array's third bullet from `the two lowest-scoring
    entries in the semester are dropped automatically` to `each entry is
    under 200 words`.
  - `weekly-reflections.md` body: insert into "## How the totals work" the
    clause "— Week 1's prompt due in week 2, Week 12's in week 13" after
    "each due at 12:00 the following Tuesday"; insert a new "## What each
    criterion checks" section (two bullets: Completion 60% gloss,
    Specificity 40% gloss) immediately after "How the totals work"; insert
    a new "## A worked example" section (200-word-ceiling sentence, the
    two labeled user-supplied examples verbatim, one-line explanation)
    between "## The prompts" and "## Submission". Full exact text for all
    insertions is given in §3's "current" listing plus the diff described
    here — the complete target file is reproduced in full in the
    hand-off content supplied to this plan (see brainstorm-feature
    hand-off in this conversation) and must be written exactly as
    specified there.
  - `policies/index.mdx`: in the "## Reflections" paragraph, replace "The
    lowest-scoring reflection in the semester is dropped" → "The two
    lowest-scoring reflections in the semester are dropped"; "absorbs
    exactly one bad week" → "absorbs two bad weeks"; "is the one this rule
    is built to catch" → "is one of the weeks this rule is built to
    catch".
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check` passes (typecheck + build + `vitest run spec`), including
    all of `spec/assessment-scheme.test.ts`'s assessment-scheme and
    "weekly reflections" assertions and all of `spec/voice.test.ts`.
  - `weekly-reflections.md` frontmatter `dueDisplay` reads exactly `12:00,
    Every Tuesday, Weeks 2-13`.
  - `weekly-reflections.md` `spec` array has exactly 3 entries, none of
    which is the old drop-two bullet, and one of which is `each entry is
    under 200 words`.
  - Rendered `dist/assessments/weekly-reflections/index.html` contains the
    strings "What each criterion checks", "Completion (60%", "Specificity
    (40%", "worked example" (case-insensitive), and the full text of both
    user-supplied examples verbatim.
  - `policies/index.mdx`'s "## Reflections" section no longer contains the
    word "exactly one" and does contain "two lowest-scoring" and "two bad
    weeks".
- **Human review:** Two artifacts, both needed before this task is
  accepted:
  1. The rendered `/assessments/weekly-reflections/` page and the
     `/policies/` page, viewed at both marking viewports (1920×1080,
     390×844) per `CLAUDE.md` — confirm the new sections render cleanly
     (no overflow/wrapping issues around the blockquote examples) and that
     nothing regressed visually.
  2. The new prose itself (the two new sections in
     `weekly-reflections.md`, and the reworded `policies/index.mdx`
     paragraph) — confirm it reads in the course's deadpan-institutional
     voice (mundane specifics, no technical metaphor per `CLAUDE.md`),
     that the worked-example framing is funny/on-voice rather than just
     mechanically correct, and that the criterion glosses read as
     genuinely clarifying rather than perfunctory. No automated check can
     settle tone or humor — only the user's read of the actual rendered
     copy can.
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [x] Task 1 complete and its acceptance criteria passing
- [x] `pnpm test` passes
- [x] `pnpm check` passes
- [x] Manually verified: loaded `/assessments/weekly-reflections/` and
  `/policies/` in a browser at 1920×1080 and 390×844, confirmed the new
  sections render without layout issues, confirmed the due-week label now
  reads "Weeks 2-13"
- [x] Every requirement in §2 is covered — see §7
- [x] Task 1's `Human review:` artifacts have been shown to the user and
  explicitly accepted — not inferred, not just its acceptance criteria
  passing
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
| 2.1.7 | Task 1 |
| 2.1.8 | Task 1 |
| 2.2 (voice) | Task 1 (acceptance criteria + Human review) |
| 2.2 (word-ceiling non-enforcement) | Task 1 (no test added, by design) |
| 2.2 (visual/viewports) | Task 1 (Human review) |

## 8. Risks / open questions

None.
