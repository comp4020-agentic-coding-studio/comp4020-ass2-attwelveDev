# Week 1 lecture: name the Critical / Monitor / Stable framework

- **Date:** 2026-09-14
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-14 (via
  `specs/2026-09-14-slop1521-week1-lecture-triage-framework.md`)

## 1. Summary

The Week 1 Lab (rewritten under `plans/2026-09-14-slop1521-lab-activities.md`)
now runs a "Triage" activity that sorts ten habit cards into Critical /
Monitor / Stable, feeding a five-area self-assessment. The Week 1 lecture
(`src/content/lectures/week-01.md`) never names this rubric — its `## Content`
section only gestures at "an honest starting inventory." This feature adds
new bullet(s) to that lecture's `## Content` section that (a) introduce
Critical / Monitor / Stable by name as a recurring rubric the course applies
across the semester, with each tier defined generically, and (b) briefly
connect the five areas and the self-assessment to it — at summary level only,
leaving the self-assessment's actual mechanics to the Lab. This is a
single-file, single-section prose edit.

## 2. Requirements

### 2.1 Functional requirements

1. `src/content/lectures/week-01.md`'s `## Content` section gains exactly one
   new bullet introducing "Critical / Monitor / Stable" as a rubric the
   course applies across the semester's five areas, explicitly framed as
   recurring — not a one-off Week 1 device. A rendered build must state this
   recurrence explicitly (e.g. contains language equivalent to "every week"
   / "all semester" / "recurring" in connection with the rubric — checked by
   human review per Task 1's Human review line, since exact wording is
   subjective).
2. That same bullet defines each of the three tiers abstractly enough to
   apply across hygiene, dress, sleep, conversation, and money (not tied to
   the Lab's ten specific habit cards) — e.g. Critical: needs attention now;
   Monitor: not urgent, but worth tracking; Stable: fine as-is. All three
   tier names and their definitions must be textually present in the
   rendered `## Content` section.
3. The same bullet, or one adjacent new bullet, names the five areas
   explicitly (hygiene, dress, sleep, conversation, money) in connection
   with the self-assessment, states that honest scoring means scoring
   against actual behaviour rather than an ideal, and states the
   self-assessment feeds the semester's first nominated priority area — kept
   at summary level, with no scoring mechanics, structure, or exercise depth
   (that stays in the Week 1 Lab).
4. `## Overview`, `## Case study`, `## Reflection`, and `## Assessment
   tie-in` in `src/content/lectures/week-01.md` are byte-for-byte unchanged.
5. The frontmatter block (`title`, `description`, `week`, `date`,
   `teachers`, `slides`, `related`) in `src/content/lectures/week-01.md` is
   byte-for-byte unchanged.
6. The four pre-existing `## Content` bullets are unchanged and unreordered;
   the new bullet(s) are appended after them.
7. `pnpm test` (which runs `pnpm build` then `vitest run spec`) passes,
   including `spec/voice.test.ts`'s per-page checks against the rendered
   `dist/lectures/week-1/index.html` (or equivalent slug) for `BANNED_TERMS`,
   `FRAMING_PHRASES`, and `GENDERED_TERMS`, and `spec/weekly-structure.test.ts`'s
   heading-order and Case-study-length checks for every lecture (unaffected
   in content by this change, but re-run as part of the full suite).

### 2.2 Non-functional requirements

None beyond project defaults.

### 2.3 Out of scope

- Any change to `src/content/sessions/week-01.md` (the Week 1 Lab) —
  including the already-identified, separate correction restructuring
  Activity 2 so the self-assessment is completed individually before paired
  discussion. That correction resumes under
  `plans/2026-09-14-slop1521-lab-activities.md`.
- Any change to any other lecture file.
- Any change to the Reflection prompt's wording in `week-01.md` — it already
  gestures at the Monitor idea; the user confirmed leaving it as-is.
- Any change to `## Case study`, `## Assessment tie-in`, or `## Overview` in
  `week-01.md`.
- Any claim about how Critical/Monitor/Stable is used in weeks 2–12's
  content — this feature only names it as recurring in week 1; no other
  week's lecture or Lab is touched.

### 2.4 Assumptions

None. All ambiguities were resolved in the spec (see
`specs/2026-09-14-slop1521-week1-lecture-triage-framework.md` §5): Content-
bullet placement, recurring-rubric framing, the self-assessment detail
boundary, and leaving the Reflection prompt as-is are all settled and not
re-litigated here.

## 3. Existing code context

- `src/content/lectures/week-01.md` — read in full. Frontmatter:
  ```yaml
  title: "Orientation: Welcome to Life"
  description:
    What this course covers, and the honest inventory of your own habits it
    starts from today
  week: 1
  date: 2027-02-23
  teachers:
    - cosima-adjei
  slides: /decks/week-01/
  related:
    - sessions/week-01
  ```
  Body has the five required headings in order (`Overview`, `Content`,
  `Case study`, `Reflection`, `Assessment tie-in`). The current `## Content`
  section (verbatim, four bullets):
  ```markdown
  ## Content

  - the course's five recurring topics: hygiene, dress, sleep, conversation
    and money
  - what an honest starting inventory looks like, and why week 1 takes one
    before anything is taught
  - how the weekly shape works: a lecture states the theory, the Lab runs it
  - the assessment scheme, in outline: five items, always weighted, always
    visible
  ```
  This feature appends one or two new bullets after the fourth.
- `spec/weekly-structure.test.ts` — reads `dist/api/index.json` for all
  `lectures` and `sessions` nodes, then for each lecture asserts (via
  `assertHeadingsInOrder`) that `Overview`, `Content`, `Case study`,
  `Reflection`, `Assessment tie-in` headings appear in that order in the
  rendered `dist/<id>/index.html`, and that the `Case study` section's
  stripped text is ≥80 characters. It also has a "closes the loop" check
  that reads `dist/lectures/week-12` for `/desk/i` and `/sock/i` — that
  check is unaffected because this feature only edits `week-01.md`'s
  `## Content`, not `## Case study`.
- `spec/voice.test.ts` — for every rendered content page (via
  `renderedContentPages()`, which walks `dist/` excluding `dist/decks` and
  the 404 page), asserts (case-insensitive, hyphens normalized to spaces)
  that none of `BANNED_TERMS` appear. Current `BANNED_TERMS` list (verified
  from source): `systems engineering`, `root-cause analysis`, `root cause`,
  `regression check`, `regression test`, `manual override`, `subsystem`,
  `runtime`, `deploy`, `merge conflict`, `tcp/ip`, `handshake`, `handshake
  protocol`, `cache invalidation`, `technical debt`, `protocol`, `debug`,
  `debugging`, `debuggable`, `interface call`, `supply chain`, `reorder
  point`, `telemetry`, `unscheduled downtime`, `retry logic`, `coordination
  mechanism`, `social debugging`, `resource allocation`. It also asserts no
  page contains a `<code>` element (F3), and separately checks
  `FRAMING_PHRASES` (`taught as`, `framed as`, `presented as`, `in the style
  of`, `assessed like a`) and `GENDERED_TERMS` (`girlfriend`, `boyfriend`,
  `the girl you like`, `the guy you like`) — scope for those two checks is
  narrower per the file (framing-phrase check is homepage-specific per the
  code read); the lecture content must still avoid all of these literally,
  and per project memory `slop1521-voice-calibration`, avoid any *sustained*
  metaphor even if no single banned term matches literally (a technical
  metaphor drawn out across a whole bullet/sentence, not a single ordinary
  word).
- Test commands (from `package.json`): `pnpm typecheck` (→ `astro check`),
  `pnpm test` (→ `pnpm build && vitest run spec`), `pnpm check` (→
  `pnpm typecheck && pnpm test`). This is a content-only Markdown edit with
  no new test file — correctness is verified by running the full `pnpm
  check`, which rebuilds `dist/` and re-runs `spec/voice.test.ts` and
  `spec/weekly-structure.test.ts` against the new rendered output.
- Convention: this repo's content edits do not add new `spec/` test cases
  for prose-only changes to a single lecture's bullet list — the existing
  `spec/voice.test.ts` and `spec/weekly-structure.test.ts` suites already
  cover the structural and voice invariants that apply, and are re-run
  against the rebuilt `dist/`.

## 4. Approach

Add one or two bullets to the end of `## Content` in
`src/content/lectures/week-01.md`. Reference shape (from the spec, exact
wording left to drafting subject to the voice test and requirements above):

```markdown
- a recurring rubric this course uses across all five areas all semester:
  Critical (needs attention now), Monitor (not urgent, but worth tracking),
  Stable (fine as-is)
- the starting self-assessment scores each of the five areas — hygiene,
  dress, sleep, conversation and money — honestly, against what you
  actually do rather than an ideal, and the result is what today's Lab uses
  to nominate this semester's first priority
```

No other section of `week-01.md`, no other lecture, and no `src/content/
sessions/*` file is touched. There is no code logic change — this is a pure
content/prose edit, so there is no "red test" in the conventional TDD sense;
the closest equivalent is the existing `spec/voice.test.ts` and
`spec/weekly-structure.test.ts` suites, which must stay green against the
edited content once rebuilt, plus a human read for tone and for the two
requirements (recurring framing, tier definitions, five-area/self-assessment
mention) that no automated check fully pins down.

**Alternative considered:** placing the framework in `## Overview` instead
of `## Content` — rejected per the spec (user's choice) to keep `##
Overview`'s existing "starting condition, not the problem" framing untouched
and treat the rubric as informational Content, not a reshaping of the
Overview's tone.

## 5. Task breakdown

### Task 1: Add the Critical / Monitor / Stable bullet(s) to Week 1's `## Content`

- **Description:** Edit `src/content/lectures/week-01.md`'s `## Content`
  section to append one or two new bullets (per the shape in §4) that name
  and define Critical / Monitor / Stable as a recurring semester rubric, and
  connect the five areas and self-assessment to it at summary level. No
  other section or the frontmatter is touched.
- **Files touched:** `src/content/lectures/week-01.md` (existing file,
  `## Content` section only).
- **Tests first (red):** None applicable — this is a prose-only content
  edit with no new logic, and this repo does not add bespoke `spec/` test
  cases for a single lecture's bullet wording (see §3). Instead: before
  editing, run `pnpm test` on the current `main` to confirm the baseline is
  green, so any failure after the edit is attributable to this change.
- **Implementation (green):** Append the new bullet(s) to `## Content`,
  after the existing four, leaving everything else in the file unchanged.
  Content must satisfy functional requirements 2.1.1–2.1.3, 2.1.6.
- **Refactor:** None expected — single Markdown edit.
- **Acceptance criteria:**
  - `git diff src/content/lectures/week-01.md` shows changes confined to
    new lines appended inside `## Content`; the four pre-existing bullets,
    all other headings, and the frontmatter block are identical to the
    pre-edit version (verifies 2.1.4, 2.1.5, 2.1.6).
  - The new bullet(s), read together, literally contain all three tier
    names "Critical", "Monitor", "Stable" and a definition for each
    (verifies 2.1.2).
  - The new bullet(s) literally name all five areas — "hygiene", "dress",
    "sleep", "conversation", "money" — in connection with the
    self-assessment (verifies 2.1.3).
  - `pnpm test` passes (rebuilds `dist/` and runs `vitest run spec`),
    including `spec/voice.test.ts` for the rebuilt `dist/lectures/week-1/`
    (or equivalent slug) page and `spec/weekly-structure.test.ts` for every
    lecture (verifies 2.1.7).
  - `pnpm check` passes in full (verifies 2.1.7 and the repo's standing
    pre-push bar).
- **Human review:** Show the user the diff of `src/content/lectures/
  week-01.md` (or the rendered `## Content` section). A pass means: (a) the
  recurring-semester framing for Critical/Monitor/Stable reads as clearly
  recurring, not Week-1-only (2.1.1); (b) the self-assessment/five-area
  mention reads as a light summary-level pointer, not a duplicate of Lab
  mechanics (2.1.3); (c) the prose matches SLOP1521's deadpan
  institutional-seriousness voice with no sustained technical metaphor, per
  project memory `slop1521-voice-calibration` — this is a judgment call
  `spec/voice.test.ts`'s literal term list cannot fully make.
- **Depends on:** None.

## 6. Feature-level Definition of Done

- [x] Task 1 complete, its tests passing
- [x] `pnpm test` passes
- [x] `pnpm check` passes
- [x] Manually verified: rendered `dist/lectures/week-1/index.html` (or
  equivalent slug — confirm exact path from `dist/api/index.json` after
  build) shows the new bullet(s) inside `## Content`, after the four
  existing bullets, with `## Overview`, `## Case study`, `## Reflection`,
  and `## Assessment tie-in` unchanged
- [x] Every requirement in §2 is covered — see §7
- [x] Task 1's `Human review:` line has been shown to the user and
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

## 8. Risks / open questions

None.
