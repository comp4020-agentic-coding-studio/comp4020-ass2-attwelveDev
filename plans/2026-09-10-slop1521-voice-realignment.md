# SLOP1521 voice realignment: drop the systems-engineering framing

- **Date:** 2026-09-10
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-10 (via `brainstorm-feature`,
  see `specs/2026-09-10-slop1521-voice-realignment.md`)

## 1. Summary

SLOP1521's entire voice currently leans on systems-engineering (and other
technical-domain) jargon as its comedic mechanism — a course literally titled
*Personal Systems Maintenance*, with every week, the homepage, the policies
page, three tutor bios, and a `spec/` test suite (`glossary.test.ts`) that
*requires* six jargon terms to appear. This plan replaces that mechanism,
everywhere, with the validated alternative: institutional seriousness applied
to a concrete, specific, mundane CS-student stereotype, never a technical
metaphor. The thesis line, the five-slot lecture structure, and the
case-study narrative shape (including the desk/sock-pile continuity between
weeks 1, 2 and 12) all stay unchanged. This is a full-site content rewrite —
32 content files, `src/course-config.ts`, `src/pages/index.astro`,
`src/pages/policies/index.mdx`, the hero image, three `spec/` test files, one
new `spec/` file, one new non-blocking lint script, and `CLAUDE.md` — not a
find-and-replace, since each week currently derives its Content section from
its own technical metaphor and that hook must be re-derived in mundane terms,
not deleted outright.

## 2. Requirements

### 2.1 Functional requirements

(Numbered F1–F12 to match `specs/2026-09-10-slop1521-voice-realignment.md`
§2.1 exactly, so this plan can be traced back to that spec line for line.)

1. **F1** No content page (every page except the policies page's Content and
   disclosure section) contains a governing technical metaphor from *any*
   domain (CS, networking, logistics, business-ops, etc.) sustained across a
   paragraph or a week. One-second puns are fine.
2. **F2** A maintained banned-terms list (§4.2 of the design spec) is checked
   against every rendered content page, excluding the policies page's
   disclosure section, and fails `pnpm check` on a hit.
3. **F3** No backtick/`<code>`-styled span appears around a jargon term (or,
   verified in Phase 2 of this plan: around anything at all — the site has no
   legitimate non-jargon use of `<code>`) anywhere in rendered content.
4. **F4** No framing/overview copy (homepage, every lecture's Overview
   section, "who this is for" copy) narrates its own premise with phrases
   like "taught as," "framed as," "presented as," "in the style of,"
   "assessed like a."
5. **F5** Week 9's dating content (lecture + Lab) uses gender-neutral
   relationship language only.
6. **F6** A non-blocking script flags sincerity-break tell-phrases ("take
   care of yourself," "but seriously," "in all seriousness," "we hope you,"
   "remember to") on content pages, for human/agent review — never fails
   `pnpm check`.
7. **F7** `courseMeta.title` becomes `"Introduction to Life: Foundations of
   Being a Person"` and `courseMeta.description` becomes the corrected
   279-character copy in §4.3 of the design spec, both satisfying
   `slopCourseMetaSchema`.
8. **F8** Every artifact in §3.1 (this plan) is rewritten under F1–F5. Every
   week keeps a single memorable, concrete, recognisable scenario as its
   Content-section hook — never degrades into an unhooked generic tips list.
9. **F9** The hero image concept and alt text are replaced with something
   that does not visually encode a systems/technical metaphor.
10. **F10** `spec/glossary.test.ts` is deleted, replaced by the checks in
    F2–F5. `spec/homepage.test.ts`'s systems-framing test is replaced.
    `spec/course-record.test.ts`'s hard-coded old title/description are
    updated (discovered during this plan's own investigation — see design
    spec §3.2 correction).
11. **F11** `CLAUDE.md`'s "Register" section becomes "Register and voice"
    (§4.5 of the design spec); the rest of the file gets a concision pass
    that also corrects its inaccurate "every week (lecture + Lab) carries the
    same five slots" claim (Labs actually use a different three-slot
    structure — discovered during this plan's investigation).
12. **F12** `pnpm check` stays green throughout every task in §5. The
    sincerity-break check (F6) is a separate script, never part of `check`.

### 2.2 Non-functional requirements

- `spec/harness.test.ts` (verified in full during this plan's investigation)
  asserts **five** literal constraints against `CLAUDE.md`, not four:
  1. the thesis quote verbatim
  2. all five slot names (`Overview`, `Content`, `Case study`, `Reflection`,
     `Assessment tie-in`) appearing somewhere in the file
  3. `/never break character/i` and `/policies/i` both matching
  4. `convenor` and `affiliation` both appearing
  5. `/12:00/` and `/UTC/` both matching (the noon-deadline rule)

  Task 12 (§5) must keep all five intact.
- No content-collection schema field changes — every rewrite in this plan is
  prose/data only (`title`, `description`, body markdown). Verified against
  `src/content.config.ts` in Phase 2: no field is jargon-named.
- Accessibility and visual-treatment rules already in `CLAUDE.md` (animation
  budgets, `course.css`'s unlayered override, etc.) are untouched.
- The new `spec/voice.test.ts` (Task 2) will legitimately **fail** on content
  pages not yet rewritten by a later task in this plan — that is expected,
  not a regression, and is called out per-task in §5's acceptance criteria.
  `pnpm check` is only required to be green at the *end* of the full task
  sequence, not after every individual task — though each task's own new
  tests (where stated) must pass for the scope that task claims.

### 2.3 Out of scope

- `PROCESS.md`, `PROCESS_LOG.md`, `specs/`, `plans/` — the user's own record
  of past decisions, not touched by this rewrite.
- Any visual/CSS treatment beyond the hero image concept (F9) — typography,
  colour, layout are unrelated.
- Re-litigating the thesis line, the five-slot lecture structure, or the
  case-study narrative shape — all three are confirmed keepers per the design
  spec §2.3.
- `src/content/people/thaddeus-vrell.md` — grepped in Phase 2 and found to
  use only the generic word "system" once ("a system with failure modes"),
  not a literal banned-term hit. Left as a judgment call for whoever executes
  Task 11, not a required rewrite in this plan.

### 2.4 Assumptions

None remaining — all resolved either in the design spec's §2.4 (course
title, jargon scope, root-cause resolution, hero art scope, sincerity-check
mechanism, new title/subtitle wording) or in this plan's own Phase 2
investigation (the three corrections in §2.2 above).

## 3. Existing code context

Verified by directly reading every file below on 2026-09-10, plus a
repo-wide `grep -rniE` for the full banned-terms list across
`src/content`, `src/pages`, `src/course-config.ts` (output retained in this
plan's investigation, not reproduced here — see §3.1's per-file line notes).

### 3.1 Complete artifact inventory (exact, grep-verified)

| Artifact | Current jargon (exact) | Change |
| --- | --- | --- |
| `src/course-config.ts:52,58-61` | `title` = "...Personal Systems Maintenance"; `description` = "...taught as systems engineering: scheduling, root-cause analysis and regression checks..." | New title/description (§4.3 of design spec) |
| `src/pages/index.astro:47,50,51,53,58-59` | "systems engineering", `<code>subsystem</code>`, `<code>root cause</code>`, "social debugging", `<code>manual override</code>` | Rewrite "What this course is"/"Who this course is for" per design spec's agreed copy |
| `src/pages/index.astro:31` | heroImageAlt: "A corridor of gold status-grid floor tiles, a few flagged black for maintenance..." | New alt text (F9) |
| `src/assets/images/hero-home.avif` | Systems-maintenance visual | New image asset (F9) |
| `src/pages/policies/index.mdx:16,17,19,29,44` | `` `Unscheduled downtime` ``, `` `subsystem` ``, "root-cause conversation", `` `manual override` ``, `` `telemetry` `` | Rewrite Attendance/Late work/Academic integrity; leave lines 52–68 (Content and disclosure) untouched |
| `src/content/lectures/week-01.md:4,17,23,42` | "systems engineering", `subsystem` ×2, `unscheduled downtime` | Keep desk motif; drop jargon |
| `src/content/lectures/week-02.md` | none found by grep (already jargon-free prose; keep sock-pile motif) | Verify only — likely no change needed |
| `src/content/lectures/week-03.md` | none found by grep | Verify only |
| `src/content/lectures/week-04.md:23,25,33` | `subsystem` ×2, `telemetry` | Rewrite |
| `src/content/lectures/week-05.md:22` | `telemetry` | Rewrite |
| `src/content/lectures/week-06.md:27` | `manual override` | Rewrite |
| `src/content/lectures/week-07.md:5,17,19,25,28` | "handshake" ×2, "handshake protocol", "retry logic" | Rewrite (networking metaphor) |
| `src/content/lectures/week-08.md:38` | `` `Root cause`: `` on-page label | Rename label; keep the incident-report shape |
| `src/content/lectures/week-09.md:24` | "interface call" | Rewrite; also apply F5 gender-neutral language |
| `src/content/lectures/week-10.md:4,17,20,25,26,27,37,44` | "supply chain" ×2, "reorder point(s)" ×3, `telemetry` | Rewrite (logistics metaphor) |
| `src/content/lectures/week-11.md:4,16` | "protocol" ×2, "retry logic" | Rewrite (networking metaphor) |
| `src/content/lectures/week-12.md:18,20,25,27,50` | `subsystem`/`subsystems` ×5 | Rewrite; keep desk + sock-pile callback (required by `spec/weekly-structure.test.ts`'s `"closes the loop on both recurring datasets"` test) |
| `src/content/sessions/week-01.md` (Before/In/Afterwards) | `subsystem` ×2 | Rewrite |
| `src/content/sessions/week-02.md` | `subsystem` ×1 | Rewrite |
| `src/content/sessions/week-03.md` | none found | Verify only |
| `src/content/sessions/week-04.md` | none found | Verify only |
| `src/content/sessions/week-05.md` | none found | Verify only |
| `src/content/sessions/week-06.md:25` | `manual override` | Rewrite |
| `src/content/sessions/week-07.md` | none found | Verify only |
| `src/content/sessions/week-08.md:4,24` | "root-cause incident report", `` `root cause` ``, "coordination mechanism" | Rewrite; keep the incident-report shape, drop the literal label |
| `src/content/sessions/week-09.md` | none found | Verify only |
| `src/content/sessions/week-10.md:4,11,24,31` | "reorder pattern", "reorder point" ×3 | Rewrite (logistics metaphor) |
| `src/content/sessions/week-11.md` | none found | Verify only |
| `src/content/sessions/week-12.md:20` | "reorder schedule" | Rewrite |
| `src/content/assessments/assignment-3-adulting.md:44,70,71,72,73` | `subsystems`/`subsystem` ×5, `manual override` ×2 | Rewrite |
| `src/content/assessments/final-exam.md:5,18,41,42` | "Social Debugging" (Station 4 name) ×2, `` `root cause` `` | Rename station; drop jargon |
| `src/content/assessments/weekly-reflections.md:5,32,43` | "the systems you are running on yourself", `subsystem`, `telemetry` | Rewrite |
| `src/content/assessments/assignment-1-makeover.md` | none found | Verify only |
| `src/content/assessments/assignment-2-touch-grass.md` | none found | Verify only |
| `src/content/people/noor-kalantari.md:4,7,13,16` | title/affiliation "Interpersonal Protocols", "protocols as a debuggable skill", "social-debugging stations" | New title/affiliation/description |
| `src/content/people/cosima-adjei.md:14` | `subsystem` | Rewrite one clause |
| `src/content/people/petra-lindqvist.md:15` | "resource allocation exercise", "supply chain with a two-week lead time" | Rewrite (added to inventory during this plan's Phase 2 — missed during brainstorming) |
| `spec/glossary.test.ts` (89 lines) | Requires 6 terms styled as `<code>` | Delete entirely |
| `spec/treatment.test.ts:293-298` (**verified 2026-09-10, not previously listed** — found via a repo-wide grep of `spec/*.test.ts` for the banned-terms list, not just the three files the design spec named) | `it("preserves a glossary term's <code> wrapping through truncation", ...)` hard-requires the lectures-index table's week-6 row to match `/<code>manual override<\/code>/` — a direct, literal conflict with F2/F3 once week 6's lecture drops that phrasing | Remove this one `it` block in the same task that rewrites `lectures/week-06.md` (Task 7); the rest of `treatment.test.ts` (CSS/layout checks) is untouched |
| `spec/homepage.test.ts:21-23` | `"leads with the systems framing"` requires `"systems engineering"` | Replace with new-title/subtitle assertions |
| `spec/course-record.test.ts:29,42` | hard-codes old title exactly; requires `"systems engineering"` in description | Update both to new values |
| `CLAUDE.md` | "Register" section; "every week...carries the same five slots" (factually wrong for Labs) | New "Register and voice" section; concision sweep; Labs correction |

### 3.2 Test framework and commands

- Vitest, config-free (`vitest run spec`). `pnpm test` = `pnpm build && vitest
  run spec` (rebuilds `dist/` first, since every `spec/*.test.ts` reads
  `dist/index.html`, `dist/<id>/index.html`, or `dist/api/index.json`).
- `pnpm check` = `pnpm typecheck && pnpm test`.
- `pnpm check:evidence` = `node scripts/check-evidence.ts` — a **separate**,
  non-`check`-gated script. This is the exact precedent Task 3's new script
  follows.
- `pnpm test:template` = `vitest run scripts` — runs `scripts/*.test.ts`
  against exported functions from `scripts/*.ts` (verified against
  `scripts/check-evidence.ts` + `scripts/check-evidence.test.ts`: the script
  exports plain functions like `expectedReflections`, imported directly by
  its test file; `main()` only runs when invoked as `node scripts/x.ts`, via
  the guard `if (process.argv[1] && import.meta.url ===
  pathToFileURL(process.argv[1]).href) { main(); }`).
- `spec/weekly-structure.test.ts` (verified in full) already contains
  `assertHeadingsInOrder`, `findHeading`, `nextHeadingIndex` helpers for
  locating a heading's HTML span and the text between it and the next
  heading — Task 2's new `spec/voice.test.ts` re-implements a small local
  copy of this pattern (these helpers are not exported from
  `weekly-structure.test.ts`, so they can't be imported) to slice out each
  lecture's Overview section and the policies page's Content-and-disclosure
  section.
- No `<code>` element appears anywhere in `node_modules/astro-theme-university`
  or `node_modules/astro-theme-slop`, and no content file uses a fenced code
  block — confirmed by grep in Phase 2. So F3's check can safely assert zero
  `<code>` elements on any rendered content page, with no risk of a false
  positive from theme chrome.

## 4. Approach

Sequence tasks so the machine-checkable rules (F2–F5, F10) exist *before*
most content is rewritten against them, per the design spec's own handoff
note. `spec/voice.test.ts` (Task 2) is written with one `it.each` case per
rendered page, so it fails only for pages not yet rewritten — later content
tasks turn their own cases green without needing every other task done
first. Course identity (Task 1) goes first since two existing test files
hard-code the old title and would otherwise mask a Task-1 regression.
Content tasks are batched by week the same way
`plans/2026-09-09-slop1521-curriculum.md` batched the original curriculum
(Weeks 1–3, 4–6, 7–9, 10–12), covering both the lecture and its paired Lab
per batch since they share a week's hook. Assessments, people bios, and
`CLAUDE.md` land after all weekly content, since assessments reference weekly
material and `CLAUDE.md`'s concision sweep should describe the *finished*
voice, not one still mid-rewrite.

**Alternative considered:** rewriting content first and adding `spec/voice.test.ts`
last, as a final gate. Rejected — the design spec's own handoff notes call
for checks first, and it also means a jargon term slipping back into an
early-batch file would only be caught at the very end instead of by the
task that touches that file.

## 5. Task breakdown

### Task 1: Course identity — new title/description, fix the two tests that hard-code the old ones

- **Description:** Change `courseMeta.title` and `courseMeta.description` in
  `src/course-config.ts`, and update the two existing spec files that assert
  the old values.
- **Files touched:** `src/course-config.ts`, `spec/course-record.test.ts`,
  `spec/homepage.test.ts`.
- **Tests first (red):**
  - `spec/course-record.test.ts:29` — change `expect(api.course.title).toBe("Introduction to Life: Personal Systems Maintenance")` to `expect(api.course.title).toBe("Introduction to Life: Foundations of Being a Person")`.
  - `spec/course-record.test.ts:42` — remove `expect(api.course.description).toContain("systems engineering")`; add `expect(api.course.description).not.toContain("systems engineering")`.
  - `spec/homepage.test.ts:21-23` — delete the `"leads with the systems framing"` test; add `it("names the new course identity", () => { expect(html).toContain("Introduction to Life: Foundations of Being a Person"); expect(html).not.toContain("Personal Systems Maintenance"); })`.
  - Running `pnpm test` now fails these three assertions against the current `src/course-config.ts` — confirms the tests are wired correctly before the fix.
- **Implementation (green):** In `src/course-config.ts`, set:
  ```ts
  title: "Introduction to Life: Foundations of Being a Person",
  description:
    "A practical course in the personal maintenance a computer science " +
    "degree assumes you handled elsewhere: showering on a schedule, " +
    "eating something with more than one food group, replying to a " +
    "message before it's a week old, and holding a conversation that " +
    "isn't about your degree.",
  ```
  (279 characters; within `slopCourseMetaSchema`'s 80–300 range and the
  51-character title within its 100-char max.)
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [x] `courseMeta.title` is exactly `"Introduction to Life: Foundations of Being a Person"`.
  - [x] `courseMeta.description` no longer contains "systems engineering", "root-cause", or "regression checks".
  - [x] `spec/course-record.test.ts` and `spec/homepage.test.ts` pass.
  - [x] `slopCourseMetaSchema.parse(courseMeta)` does not throw (verified by `pnpm typecheck` + the build step inside `pnpm test`).
- **Depends on:** None.

### Task 2: New `spec/voice.test.ts` (F2–F5) and deletion of `spec/glossary.test.ts` (F10)

- **Description:** Add the machine-checkable voice rules from the design
  spec's §4.2, replacing the now-reversed glossary mechanic.
- **Files touched:** `spec/voice.test.ts` (new), `spec/glossary.test.ts`
  (deleted).
- **Tests first (red):** Write `spec/voice.test.ts` with these cases (all
  will legitimately fail right now, against unrewritten content — expected,
  see §2.2):
  - `describe("voice — banned terms (F2)")`: `it.each(renderedContentPages())("$id carries no banned jargon term", ...)` — for each page, strip the policies page's Content-and-disclosure section (everything from that heading onward, using a local `findHeading` helper mirroring `spec/weekly-structure.test.ts`'s), lowercase the rest, and assert none of the banned terms below appear:
    ```
    systems engineering, root-cause analysis, root cause, regression check,
    regression test, manual override, subsystem, runtime, deploy, merge
    conflict, tcp/ip, handshake, handshake protocol, cache invalidation,
    technical debt, protocol, debug, debugging, debuggable, interface call,
    supply chain, reorder point, telemetry, unscheduled downtime, retry
    logic, coordination mechanism, social debugging, resource allocation
    ```
  - `describe("voice — no code-styled spans (F3)")`: `it.each(renderedContentPages())("$id has no <code> element", ...)` — assert `!/​<code[^>]*>/.test(html)` (safe per §3.2: no legitimate `<code>` use exists anywhere in the site).
  - `describe("voice — framing narration (F4)")`: one `it` for the homepage (`dist/index.html`, full page) and `it.each` over every lecture's rendered page, slicing just the `Overview` section (reusing `findHeading`/`nextHeadingIndex` logic), asserting none of `taught as`, `framed as`, `presented as`, `in the style of`, `assessed like a` appear in that slice.
  - `describe("voice — gendered pairing (F5)")`: one `it` reading `dist/lectures/week-09/index.html` and `dist/sessions/week-09/index.html`, asserting none of `girlfriend`, `boyfriend`, `the girl you like`, `the guy you like` appear.
  - `renderedContentPages()` helper: walk `dist/`, collect every `index.html` except under `dist/decks` and the 404 page — same exclusion `spec/glossary.test.ts` used — returning `{ path, id }` pairs (`id` = the dist-relative page, e.g. `"index.html"`, `"policies/index.html"`, `"lectures/week-01/index.html"`).
  - Delete `spec/glossary.test.ts` in this same task (its six required-jargon assertions are the direct opposite of F2/F3 and cannot coexist with them).
- **Implementation (green):** None in this task — `spec/voice.test.ts` is
  intentionally red for every content page until Tasks 4–11 rewrite them.
  This task's own "done" bar is: the file exists, is syntactically valid,
  `it.each` produces one named case per page (visible in `vitest run
  spec/voice.test.ts` output), and `spec/glossary.test.ts` no longer exists.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [x] `spec/glossary.test.ts` no longer exists.
  - [x] `vitest run spec/voice.test.ts` runs and reports one case per
    rendered page per describe block (confirms the `it.each` wiring works),
    failing on content pages not yet rewritten and passing on any that
    happen to already be clean (per §3.1, `week-02`/`week-03` lectures and
    several session files currently have no banned-term hits, so their F2
    case should already be green).
  - [x] `pnpm typecheck` passes (the new file is valid TypeScript).
- **Depends on:** None (can run in parallel with Task 1, but sequenced after
  it in this plan since Task 1's identity fix is smaller and foundational).

### Task 3: Non-blocking sincerity-break lint script (F6)

- **Description:** Add `scripts/check-voice-tone.ts`, following the
  `scripts/check-evidence.ts` pattern (exported pure function + guarded
  `main()`), and wire a new `package.json` script that is **not** part of
  `pnpm check`.
- **Files touched:** `scripts/check-voice-tone.ts` (new),
  `scripts/check-voice-tone.test.ts` (new), `package.json`.
- **Tests first (red):** In `scripts/check-voice-tone.test.ts`:
  ```ts
  import { describe, expect, it } from "vitest";
  import { findSincerityBreaks } from "./check-voice-tone.ts";

  describe("findSincerityBreaks", () => {
    it("flags each known tell-phrase", () => {
      expect(findSincerityBreaks("but seriously, do your laundry")).toEqual(["but seriously"]);
      expect(findSincerityBreaks("remember to shower")).toEqual(["remember to"]);
    });
    it("flags nothing in clean deadpan copy", () => {
      expect(findSincerityBreaks("Assemble one outfit for a stated occasion.")).toEqual([]);
    });
    it("is case-insensitive", () => {
      expect(findSincerityBreaks("BUT SERIOUSLY.")).toEqual(["but seriously"]);
    });
  });
  ```
  These fail because `check-voice-tone.ts` does not exist yet.
- **Implementation (green):**
  ```ts
  #!/usr/bin/env node
  import { readdirSync, readFileSync, statSync } from "node:fs";
  import { join, resolve } from "node:path";
  import { pathToFileURL } from "node:url";

  const TELL_PHRASES = [
    "take care of yourself",
    "but seriously",
    "in all seriousness",
    "we hope you",
    "remember to",
  ];

  export function findSincerityBreaks(html: string): string[] {
    const lower = html.toLowerCase();
    return TELL_PHRASES.filter((phrase) => lower.includes(phrase));
  }

  function renderedContentPages(): { path: string; id: string }[] { /* same walk as spec/voice.test.ts's helper */ }

  function main(): void {
    let flagged = 0;
    for (const { path, id } of renderedContentPages()) {
      if (id.startsWith("policies/")) continue;
      for (const phrase of findSincerityBreaks(readFileSync(path, "utf8"))) {
        console.warn(`! ${id}: possible sincerity break — "${phrase}"`);
        flagged++;
      }
    }
    console.log(
      flagged === 0
        ? "✓ no sincerity-break tell-phrases found"
        : `! ${flagged} possible sincerity break(s) — review, not a build failure`,
    );
    // Always exits 0: F6/F12 require this to never fail pnpm check.
  }

  if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
  }
  ```
  In `package.json`'s `scripts`, add `"check:voice-tone": "node
  scripts/check-voice-tone.ts"` — a sibling of `"check:evidence"`, not added
  to `"check"`.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [x] `pnpm test:template` (which runs `vitest run scripts`) passes the
    three new cases. (`scripts/check-evidence.test.ts` fails in this repo
    independent of this task — confirmed by re-running it at the prior
    commit, before `check-voice-tone.ts` existed; a missing
    `marisol-quaye.avif` fixture, unrelated to F6/voice work. Reported, not
    fixed here — out of this plan's scope.)
  - [x] `node scripts/check-voice-tone.ts` runs against the built `dist/`
    and exits `0` even when it prints flagged lines (verify by temporarily
    running it against current pre-rewrite content, which contains no
    literal tell-phrases today, then confirm the exit code is `0`
    regardless).
  - [x] `pnpm check` does not invoke this script (grep `package.json`'s
    `"check"` script definition to confirm).
- **Depends on:** None.

### Task 4: Homepage rewrite + hero image (F1, F4, F9)

- **Description:** Rewrite `src/pages/index.astro`'s "What this course is"
  and "Who this course is for" copy to the design spec's §4.3-adjacent
  agreed text (from `prompts/voice-brief-for-agent.md`'s "Corrected homepage
  copy" section), remove the `<code>` spans, and replace the hero image
  concept and alt text.
- **Files touched:** `src/pages/index.astro`, `src/assets/images/hero-home.avif`
  (replaced binary asset).
- **Tests first (red):** `spec/voice.test.ts`'s `it.each` cases for
  `id: "index.html"` (F2, F3, F4) are currently failing (from Task 2); no new
  test file needed — this task's job is to turn those specific cases green.
  Also add to `spec/homepage.test.ts`: `it("describes its own hero artwork without a systems metaphor", () => { expect(html.toLowerCase()).not.toContain("status-grid"); expect(html.toLowerCase()).not.toContain("flagged black for maintenance"); })`.
- **Implementation (green):** Replace lines 45–62 of `src/pages/index.astro`
  with:
  ```astro
  <h2>What this course is</h2>
  <p>
    SLOP1521 covers the material a computer science degree assumes you
    picked up somewhere else: sleep, hygiene, dress, conversation, money,
    and how to behave in front of another human being. Each topic is
    treated as a real subject, with real assessment, because — department
    opinion notwithstanding — it is one. The semester concludes with a
    five-station practical examination covering hygiene and health,
    fashion, small talk, social debugging and daily survival.
  </p>

  <h2>Who this course is for</h2>
  <p>
    Anyone who has eaten the same bowl of instant noodles four nights
    running and called it meal planning. Anyone whose last haircut
    predates their current degree. No prior experience assumed; a working
    knowledge of at least one hoodie is expected.
  </p>
  ```
  (Note: "social debugging" survives here only as the *existing, unrenamed*
  exam-station name referenced in passing — Task 10 renames the station
  itself in `final-exam.md`; once renamed there, update this sentence to
  match in the same pass so the two stay consistent.) Replace line 31's
  `heroImageAlt` with new copy describing the replacement image (concrete
  wording decided when the new hero image is produced — e.g. a cluttered
  desk, a pile of unmatched socks, or another concrete mundane image
  consistent with §4.4's per-week motifs, not a systems/grid visual).
  Replace the `hero-home.avif` asset itself with new artwork matching the new
  alt text.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3/F4 cases for `index.html` pass.
  - [ ] `spec/homepage.test.ts`'s new hero-artwork test passes.
  - [ ] `spec/homepage.test.ts`'s existing "pins the thesis verbatim",
    "names the five-station examination", "publishes the nine learning
    outcomes", and "retains no starter prose" tests still pass unmodified.
  - [ ] Visually verified with `agent-browser` at 1920×1080 and 390×844
    against the dev server, per `CLAUDE.md`'s "Before pushing" rule.
- **Human review:** Read the new "What this course is"/"Who this course is
  for" copy aloud and confirm it lands the mundane-stereotype joke without
  narrating its own premise (F4) and without reading as try-hard; view the
  new hero image at both marking viewports and confirm it reads as a
  concrete, mundane image rather than a systems/technical visual (F9). A
  passing `spec/voice.test.ts` case can only prove the banned phrases are
  absent, not that the replacement copy or image is actually good.
- **Depends on:** Task 1 (uses the new `courseMeta.title`/`description` via
  the page's existing `{courseMeta.title}`/`{courseMeta.description}`
  bindings).

### Task 5: Policies page non-disclosure sections (F1, F2, F3)

- **Description:** Rewrite the Attendance, Late work and extensions, and
  Academic integrity sections of `src/pages/policies/index.mdx` (lines
  13–48) to drop jargon while preserving their actual rules. Leave the
  Reflections section (lines 31–39, already jargon-free) and the Content and
  disclosure section (lines 52–68) untouched.
- **Files touched:** `src/pages/policies/index.mdx`.
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 case for
  `id: "policies/index.html"` is failing (from Task 2, against lines 16, 17,
  19, 29, 44). `spec/policies.test.ts`'s five existing tests (heading text,
  "not of the students", "never read aloud", `/Week 9/`, `/optional/i`,
  not-starter-page) are already passing and must remain so — they only
  check the untouched disclosure section.
- **Implementation (green):** Rewrite lines 13–29 and 41–48, e.g.:
  - Attendance: replace "`Unscheduled downtime` happens — illness, a
    competing deadline, a `subsystem` that stops responding" with a mundane
    equivalent (e.g. "Life happens — illness, a competing deadline, a week
    where everything else took priority") and "root-cause conversation"
    with a plain phrase ("a conversation with your tutor about what's going
    on", or similar — final wording is this task's job, following §4.4's
    swap-table logic).
  - Late work: replace "referred to the Convenor for a `manual override`"
    with plain language (e.g. "referred to the Convenor for a decision").
  - Academic integrity: replace "your sleep `telemetry`" with "your sleep
    schedule" or equivalent.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 case for `policies/index.html` passes.
  - [ ] `spec/policies.test.ts`'s five existing tests still pass unmodified.
  - [ ] The Content and disclosure section (lines 52–68 in the current
    file) is byte-for-byte unchanged.
- **Human review:** Read the rewritten Attendance/Late work/Academic
  integrity sections and confirm each still states the actual rule clearly
  and reads as institutional-plain — not accidentally reintroducing a
  technical metaphor the banned-term list doesn't happen to cover.
- **Depends on:** Task 2 (for the test to check against).

### Task 6: Lectures + sessions, weeks 1–3 (F1, F2, F3, F8)

- **Description:** Rewrite `src/content/lectures/week-01.md` (drop "systems
  engineering," `subsystem` ×2, `unscheduled downtime`; keep the desk
  motif), `src/content/sessions/week-01.md` (drop `subsystem` ×2),
  `src/content/sessions/week-02.md` (drop `subsystem` ×1; keep the sock-pile
  motif from `lectures/week-02.md`, which grep found already jargon-free).
  `lectures/week-02.md`, `lectures/week-03.md`, `sessions/week-03.md` are
  verified jargon-free already — read them again in this task to confirm no
  sustained metaphor slipped past the grep (F1 is broader than the literal
  banned-terms list) and touch them only if one is found.
- **Files touched:** `src/content/lectures/week-01.md`,
  `src/content/sessions/week-01.md`, `src/content/sessions/week-02.md`
  (required changes); `src/content/lectures/week-02.md`,
  `src/content/lectures/week-03.md`, `src/content/sessions/week-03.md`
  (verify-only).
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for
  `lectures/week-01/index.html`, `sessions/week-01/index.html`,
  `sessions/week-02/index.html` are failing (from Task 2).
- **Implementation (green):** Re-derive week 1's "systems engineering"
  framing and "subsystem" vocabulary into mundane terms per §4.4 (e.g. the
  five recurring topics stay named plainly: hygiene, dress, sleep,
  conversation, money — no "subsystem" label needed to introduce them).
  Keep the desk-as-first-dataset case study exactly as the hook (required by
  Task 9's week-12 callback). Drop "unscheduled downtime" from the week-1
  Reflection prompt in favour of a concrete equivalent (e.g. "a habit you've
  stopped noticing").
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all three touched pages pass.
  - [ ] `spec/weekly-structure.test.ts`'s "carries all five slots in order"
    and "gives every lecture a named case study" tests still pass for
    week 1 (structure unchanged, only prose rewritten).
  - [ ] The week-1 desk case study still describes a "desk" (required later
    by the week-12 "closes the loop" test).
  - [ ] `spec/treatment.test.ts`'s `"shows one topic chip per spec item for
    a Lab"` test still passes — it counts exactly 2 spec items for
    `sessions/week-01.md` specifically, so that file's rewrite must keep 2
    items (rewording is fine, changing the count is not).
- **Human review:** Read the rewritten week-1 lecture and Lab in full and
  confirm the desk case study still lands as a memorable, specific hook
  (F8) — that dropping "systems engineering" didn't flatten the Content
  section into a generic, unhooked tips list. A passing banned-term check
  only proves the jargon is gone, not that the replacement is funny.
- **Depends on:** Task 2.

### Task 7: Lectures + sessions, weeks 4–6 (F1, F2, F3, F8)

- **Description:** Rewrite `src/content/lectures/week-04.md` (`subsystem`
  ×2, `telemetry`), `lectures/week-05.md` (`telemetry`), `lectures/week-06.md`
  (`manual override`), `sessions/week-06.md` (`manual override`), and remove
  `spec/treatment.test.ts`'s now-invalid week-6 `<code>` assertion (§3.1
  correction, discovered during this plan's own investigation).
  `sessions/week-04.md` and `sessions/week-05.md` are verified jargon-free —
  re-check for sustained-metaphor drift per F1, touch only if found.
- **Files touched:** `src/content/lectures/week-04.md`,
  `src/content/lectures/week-05.md`, `src/content/lectures/week-06.md`,
  `src/content/sessions/week-06.md`, `spec/treatment.test.ts` (required);
  `sessions/week-04.md`, `sessions/week-05.md` (verify-only).
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for the four
  content pages are failing. Also: `spec/treatment.test.ts:293-298`'s
  `it("preserves a glossary term's <code> wrapping through truncation", ...)`
  will fail as soon as week 6's `` `manual override` `` phrasing is dropped
  (it asserts `week06Row` matches `/<code>manual override<\/code>/` in the
  lectures-index table) — this task must delete that one `it` block in the
  same commit, not leave it red.
- **Implementation (green):** Drop "scheduled `subsystem`" (week 4) in
  favour of a plain sleep-schedule framing; drop "`telemetry`" (weeks 4, 5)
  in favour of a concrete equivalent (e.g. "what your tiredness is actually
  telling you," "where you've actually been this week"); drop "`manual
  override`" (week 6, both lecture and Lab) in favour of a mundane exception
  ("the one night a real deadline needs the laptop open anyway" already
  reads fine without the jargon label — just drop the backticked term).
  Delete the `it("preserves a glossary term's <code> wrapping through
  truncation", ...)` block from `spec/treatment.test.ts` (lines 293-298) —
  the rest of that `describe("treatment — topics", ...)` block (Topics
  column presence, per-week chip counts) is unrelated to jargon and stays.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all four content pages pass.
  - [ ] `spec/treatment.test.ts` no longer contains any assertion that
    expects `<code>` in the lectures-index table, and its remaining tests
    (Topics column, per-week chip counts, Slides column) still pass.
  - [ ] `spec/weekly-structure.test.ts`'s per-week structural tests
    (slot order, case-study length) still pass for weeks 4–6.
  - [ ] `spec/treatment.test.ts`'s `"shows one topic chip per Content
    bullet"` test still passes — it counts exactly 4 `Content` bullets for
    week 4 specifically, so week 4's rewrite must keep 4 bullets (rewording
    them is fine, changing the count is not).
- **Human review:** Read weeks 4–6's rewritten Content sections and confirm
  each keeps one concrete, specific hook (F8) rather than collapsing into
  generic advice once the jargon label is removed — this is especially
  live for week 6, where the exception being described ("the one night a
  real deadline needs the laptop open anyway") has to carry the joke on its
  own now that `manual override` no longer flags it as one.
- **Depends on:** Task 2.

### Task 8: Lectures + sessions, weeks 7–9 (F1, F2, F3, F5, F8)

- **Description:** Rewrite `src/content/lectures/week-07.md` (drop the
  handshake-protocol networking metaphor and "retry logic"),
  `src/content/lectures/week-08.md` (rename the `` `Root cause`: `` label;
  keep the incident-report → cause → fix shape), `src/content/sessions/week-08.md`
  (rewrite "root-cause incident report", `` `root cause` ``, "coordination
  mechanism"; keep the incident-report Lab shape), `src/content/lectures/week-09.md`
  (drop "interface call"; apply F5 gender-neutral language). `sessions/week-07.md`
  and `sessions/week-09.md` are verified jargon-free — re-check for
  sustained-metaphor drift, touch only if found.
- **Files touched:** `src/content/lectures/week-07.md`,
  `src/content/lectures/week-08.md`, `src/content/sessions/week-08.md`,
  `src/content/lectures/week-09.md` (required); `sessions/week-07.md`,
  `sessions/week-09.md` (verify-only).
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for the four
  required pages are failing; `spec/voice.test.ts`'s F5 case for week 9
  (both lecture and Lab pages) is failing only if a gendered term is
  present — grep in Phase 2 found none currently, so this case is likely
  already passing; keep it green.
- **Implementation (green):** Week 7: replace "a conversation opens with a
  handshake" and "small talk as a handshake protocol" with a direct mundane
  framing (e.g. "small talk has an opening move and a follow-up, the same
  way any exchange does" — no protocol/networking language); replace "retry
  logic" with "what to say when the first attempt gets nothing back" (the
  existing Content bullet already says this in plain English once the label
  is dropped). Week 8: rename `` `Root cause`: `` to a plain phrase (e.g.
  "The actual reason:") in both the lecture and the Lab, preserving the
  "traced to [x], not to any person's character" sentence structure exactly
  — that's the case-study shape being kept per the design spec's resolved
  contradiction (§2.4). Week 9: replace "an opening message as an interface
  call" with a direct description of what the message does; audit the whole
  week-9 lecture and Lab text for any gendered noun beyond what grep
  caught (grep found none, but F5 requires an explicit human check here
  since "someone you're interested in" phrasing must be confirmed present,
  not just an absence of "girlfriend"/"boyfriend").
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all four required pages pass.
  - [ ] `spec/voice.test.ts`'s F5 case for week 9 passes.
  - [ ] `spec/weekly-structure.test.ts`'s per-week structural tests still
    pass for weeks 7–9, including the Lab spec-list checks.
- **Human review:** Read week 9's rewritten lecture and Lab in full and
  confirm the dating content reads as genuinely gender-neutral in substance
  ("someone you're interested in" phrasing used throughout), not just
  absent the four literally-banned nouns (F5) — the automated check can
  only prove a negative. Also read weeks 7–8's rewrites and confirm the
  handshake/root-cause hooks were re-derived into a mundane equivalent
  rather than just deleted, leaving flat prose.
- **Depends on:** Task 2.

### Task 9: Lectures + sessions, weeks 10–12 (F1, F2, F3, F8)

- **Description:** Rewrite `src/content/lectures/week-10.md` (drop the
  supply-chain/reorder-point logistics metaphor and `telemetry`),
  `src/content/sessions/week-10.md` (drop "reorder pattern"/"reorder
  point"), `src/content/lectures/week-11.md` (drop the
  protocol/retry-logic networking metaphor), `src/content/lectures/week-12.md`
  (drop all five `subsystem`/`subsystems` occurrences while preserving the
  desk + sock-pile callback verbatim in substance), `src/content/sessions/week-12.md`
  (drop "reorder schedule"). `sessions/week-11.md` is verified jargon-free —
  re-check for drift.
- **Files touched:** `src/content/lectures/week-10.md`,
  `src/content/sessions/week-10.md`, `src/content/lectures/week-11.md`,
  `src/content/lectures/week-12.md`, `src/content/sessions/week-12.md`
  (required); `sessions/week-11.md` (verify-only).
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for the five
  required pages are failing. `spec/weekly-structure.test.ts`'s `"closes the
  loop on both recurring datasets"` test (`/desk/i` and `/sock/i` against
  `lectures/week-12`'s rendered HTML) is currently passing and must **stay**
  passing through this task — it is the concrete acceptance bar for F8's
  "don't lose the hook" requirement on week 12 specifically.
- **Implementation (green):** Week 10: replace "household logistics is a
  supply chain" and "reorder point(s)" with a direct mundane description
  (e.g. "buying the thing before you're out of it, not after" — the
  underlying idea survives, only the logistics-jargon label is dropped).
  Week 11: replace "a workplace runs on a smaller, more formal version of
  the same protocol" and "retry logic" with plain language describing
  drafting/redrafting correspondence. Week 12: replace every `subsystem`
  occurrence with the plain list of topics (hygiene, dress, sleep,
  conversation, money) it already stands in for; the desk-photograph and
  sock-pile paragraphs need no jargon removed (grep found none there) — do
  not alter their wording beyond what's needed to remove the surrounding
  `subsystem` sentences.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all five required pages pass.
  - [ ] `spec/weekly-structure.test.ts`'s `"closes the loop on both
    recurring datasets"` test still passes (rerun explicitly, don't just
    assume).
  - [ ] `spec/weekly-structure.test.ts`'s per-week structural tests still
    pass for weeks 10–12.
- **Human review:** Read week 12's rewritten lecture in full and confirm the
  desk/sock-pile callback reads as a deliberate, satisfying continuity —
  not merely present per the `/desk/i`/`/sock/i` regex check — and that
  weeks 10–12 each keep one concrete hook (F8) rather than degrading into
  generic list-of-tips prose once the supply-chain/protocol framing is
  removed.
- **Depends on:** Task 2, Task 6 (week-12's case study references week 1's
  desk, established in Task 6).

### Task 10: Assessments (F1, F2, F3, F8)

- **Description:** Rewrite `src/content/assessments/assignment-3-adulting.md`
  (drop `subsystem`/`subsystems` ×5, `manual override` ×2),
  `src/content/assessments/final-exam.md` (rename Station 4 from "Social
  Debugging" to a jargon-free name; drop `` `root cause` ``),
  `src/content/assessments/weekly-reflections.md` (drop "the systems you are
  running on yourself", `subsystem`, `telemetry`). `assignment-1-makeover.md`
  and `assignment-2-touch-grass.md` are verified jargon-free — re-check for
  drift.
- **Files touched:** `src/content/assessments/assignment-3-adulting.md`,
  `src/content/assessments/final-exam.md`,
  `src/content/assessments/weekly-reflections.md` (required);
  `assignment-1-makeover.md`, `assignment-2-touch-grass.md` (verify-only).
  Also `src/pages/index.astro` (the "social debugging" mention in "What this
  course is," to match the station's new name — see Task 4's note) and
  `src/content/people/noor-kalantari.md`/`petra-lindqvist.md` if their bios
  reference the renamed station by its old name (checked in Task 11).
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for the three
  required assessment pages are failing. Add to
  `spec/course-record.test.ts` or a new local assertion: none needed beyond
  `spec/voice.test.ts`'s coverage, since no other spec file names "Social
  Debugging" or the assessment jargon literally (`spec/cast.test.ts` and
  `spec/data-integrity.test.ts`, both verified in Phase 2, have no jargon
  dependency).
- **Implementation (green):** Assignment 3: replace "seven `subsystems`"
  with "seven components" (the brief already calls them "components" in its
  own bullet list just below — this is a same-file consistency fix, not new
  wording); replace both `manual override` mentions in the marking-band
  descriptions with plain language (e.g. "would need an unplanned change
  mid-week"). Final Exam: rename "Station 4: Social Debugging" to a mundane
  equivalent naming what the station actually does (diagnosing a friend-group
  or workplace scenario) — e.g. "Station 4: Reading the Room" or "Station 4:
  Group Trouble" (final wording is this task's call, following §4.4's
  swap-table logic); replace `` `root cause` `` with plain phrasing ("a
  reason and a fix"). Weekly Reflections: replace "the systems you are
  running on yourself" with a direct description ("the habits you are
  running on yourself, week by week" or similar); replace `subsystem` in the
  per-week prompt list and `telemetry` in the Week 10 line with plain
  equivalents.
- **Refactor:** After renaming Station 4, grep the whole repo for "Social
  Debugging" (case-insensitive) to catch every reference — this task's own
  discovery already flags `index.astro`, and Task 11 must check the two
  tutor bios that mention the station.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all three required assessment
    pages pass.
  - [ ] `grep -ri "social debugging" src/` returns zero matches anywhere in
    the repo once this task and its cross-references (Task 4, Task 11) are
    done.
  - [ ] `spec/data-integrity.test.ts` and `spec/cast.test.ts` still pass
    unmodified (no jargon dependency, verified in Phase 2).
- **Human review:** Read the renamed Station 4 and the rewritten
  assignment-3/final-exam/weekly-reflections copy and confirm the
  replacements land the joke — a banned-term check can only confirm the old
  jargon is gone, not that the new station name or rewording is any good.
- **Depends on:** Task 2.

### Task 11: People bios (F1, F2, F3)

- **Description:** Rewrite `src/content/people/noor-kalantari.md` (new
  title/affiliation, currently "Interpersonal Protocols"; drop "protocols as
  a debuggable skill" and "social-debugging stations," updating the latter
  to match Task 10's renamed station), `src/content/people/cosima-adjei.md`
  (drop the `subsystem` reference), `src/content/people/petra-lindqvist.md`
  (drop "resource allocation exercise" and "supply chain with a two-week
  lead time").
- **Files touched:** `src/content/people/noor-kalantari.md`,
  `src/content/people/cosima-adjei.md`,
  `src/content/people/petra-lindqvist.md`.
- **Tests first (red):** `spec/voice.test.ts`'s F2/F3 cases for
  `people/noor-kalantari/index.html`, `people/cosima-adjei/index.html`,
  `people/petra-lindqvist/index.html` are failing. `spec/cast.test.ts`'s
  existing tests (exactly 4 people, roles restricted to the enum, every
  `affiliation` contains "School of Applied Competence", bios ≥40 chars) are
  already passing and must remain so — none of them depend on jargon-free
  prose, only on structure.
- **Implementation (green):** `noor-kalantari.md`: change
  `title`/`description`/`affiliation` away from "Interpersonal Protocols" to
  a mundane equivalent (e.g. "Conversation and Dating," keeping "School of
  Applied Competence — " as the required prefix per `spec/cast.test.ts`);
  rewrite the body's "debuggable skill" sentence and the exam-station
  reference to match Task 10's renamed Station 4. `cosima-adjei.md`: replace
  "the standing of every `subsystem` it examines" with "the standing of
  every unit it examines" or similar. `petra-lindqvist.md`: replace "a
  resource allocation exercise" and "a supply chain with a two-week lead
  time" with plain equivalents (e.g. "a meal plan is a budget with a
  shopping list attached, and a grocery run has to happen before, not after,
  you're out of something").
- **Refactor:** None expected.
- **Acceptance criteria:**
  - [ ] `spec/voice.test.ts`'s F2/F3 cases for all three pages pass.
  - [ ] `spec/cast.test.ts`'s five existing tests still pass unmodified.
  - [ ] `grep -ri "social debugging" src/content/people/` returns zero
    matches (cross-check with Task 10).
- **Human review:** Read all three rewritten bios and confirm each still
  reads as a specific, funny stereotype rather than generic filler once its
  jargon clause is removed.
- **Depends on:** Task 2, Task 10 (for the renamed-station cross-reference).

### Task 12: `CLAUDE.md` — Register and voice, concision sweep, Labs-structure correction (F11)

- **Description:** Replace the "Register" section with "Register and voice"
  (adding the don't/do table and the banned-term-list pointer), tighten the
  rest of the file for concision, and correct the "every week (lecture +
  Lab) carries the same five slots" claim to reflect that Labs actually use
  a three-slot structure (`Before the Lab` / `In the Lab` / `Afterwards`).
- **Files touched:** `CLAUDE.md`.
- **Tests first (red):** No new test — `spec/harness.test.ts`'s five
  existing assertions (§2.2) are the guardrail. Run `pnpm test` once before
  editing to confirm all five currently pass, as the explicit baseline this
  task must not regress.
- **Implementation (green):** Edit `CLAUDE.md`:
  - Replace the `## Register` section (current lines 68–74) with:
    ```markdown
    ## Register and voice

    Never break character in a lecture, Lab, assessment or exam station —
    the one exception is the policies page's **Content and disclosure**
    section, which is sincere; everything else on every page stays in
    character.

    The joke is always institutional seriousness applied to a concrete,
    specific, mundane CS-student stereotype — never a technical metaphor.
    No governing jargon lens of any kind (CS, networking, logistics,
    business-ops) stands in for the content itself; occasional one-second
    puns are fine, sustained metaphors are not. Test: if a sentence needs
    the reader to know a technical concept to get the joke, rewrite it in
    mundane specifics instead.

    | Don't | Do |
    | --- | --- |
    | "root-cause analysis of a friendship failure" | "eating the same bowl of instant noodles four nights running and calling it meal planning" |
    | "personal systems running on manual override" | "your last haircut predates your current degree" |
    | "regression checks on hygiene" | "identify one reason to shower before, not after, a group project meeting" |

    Never wrap jargon in backticks/`<code>` to flag it as clever — that
    undercuts the deadpan even once the wording is fixed. `spec/voice.test.ts`
    checks a banned-term list against every content page; extend that list
    there when a new metaphor slips in, don't just fix the one instance.
    ```
  - Correct the `## The weekly structure` section (current lines 61–66):
    state that **lectures** carry the five slots (`Overview`, `Content`,
    `Case study`, `Reflection`, `Assessment tie-in`) and **Labs** carry
    their own three (`Before the Lab`, `In the Lab`, `Afterwards`), rather
    than claiming both share one five-slot shape.
  - Tighten the "Before pushing," "Generated files," "Secrets," "Commits,"
    and "PROCESS.md and PROCESS_LOG.md" sections for concision — trim
    redundant clauses without deleting any fact `spec/harness.test.ts`
    checks (the thesis quote, the five slot names, `/never break
    character/i`, `/policies/i`, `convenor`, `affiliation`, `/12:00/`,
    `/UTC/`).
- **Refactor:** None expected — this task's implementation step already
  produces the target content.
- **Acceptance criteria:**
  - [ ] `spec/harness.test.ts`'s five tests still pass — rerun explicitly
    after editing, not assumed.
  - [ ] The weekly-structure section no longer claims Labs use the
    five-slot shape.
  - [ ] The new "Register and voice" section contains the don't/do table
    verbatim as above.
  - [ ] `CLAUDE.md`'s total line count does not increase (a concision sweep
    that only adds content without cutting anything elsewhere has failed
    its own goal) — verify with `wc -l CLAUDE.md` before and after.
- **Human review:** Read the new "Register and voice" section and its
  don't/do table and confirm it actually teaches a future agent the rule
  (institutional seriousness applied to mundane specifics, never a
  technical metaphor) rather than just restating "no jargon" — this section
  is the harness's main defence against the exact drift this whole plan
  exists to correct.
- **Depends on:** None (can run any time after Task 2 exists, so the pointer
  to `spec/voice.test.ts` in the new Register section is accurate; sequenced
  last since it should describe the *finished* voice).

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its own tests passing.
- [ ] `pnpm check` (`pnpm typecheck && pnpm build && vitest run spec`)
  passes in full, including every `spec/voice.test.ts` case across every
  rendered page.
- [ ] `pnpm test:template` passes (covers the new
  `scripts/check-voice-tone.test.ts`).
- [ ] `node scripts/check-voice-tone.ts` runs against the built `dist/` and
  exits `0`.
- [ ] `grep -ri "social debugging" src/` returns zero matches.
- [ ] Manually verified: homepage and one rewritten lecture/Lab pair loaded
  with `agent-browser` at 1920×1080 and 390×844, confirming the new hero
  image renders and the prose reads in the corrected voice.
- [ ] Every requirement in §2 is covered — see §7.
- [ ] Every task with a `Human review:` line (Tasks 4–12) has been shown to
  the user and explicitly accepted — not inferred from `spec/voice.test.ts`
  passing, which can only prove the banned phrases are absent, not that the
  replacement copy is any good.
- [ ] No item remains in §8.

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| F1 (no sustained technical metaphor, any domain) | Tasks 4–11 (rewrite), verify-only sub-items in Tasks 6–10 |
| F2 (banned-terms check) | Task 2 (check), Tasks 4–11 (compliance) |
| F3 (no backtick/`<code>` styling) | Task 2 (check), Tasks 4–11 (compliance) |
| F4 (no framing-narration) | Task 2 (check), Task 4 (homepage), Tasks 6–9 (lecture Overviews) |
| F5 (gender-neutral dating language) | Task 2 (check), Task 8 (week 9) |
| F6 (non-blocking sincerity-break script) | Task 3 |
| F7 (new title/description) | Task 1 |
| F8 (keep a memorable hook per week) | Tasks 6–9's per-week implementation notes; Task 9's explicit desk/sock-pile regression check |
| F9 (hero image + alt text) | Task 4 |
| F10 (delete glossary test, replace homepage/course-record tests) | Task 1 (course-record, homepage), Task 2 (glossary deletion) |
| F11 (CLAUDE.md Register and voice + concision + Labs correction) | Task 12 |
| F12 (`pnpm check` green throughout, F6 stays separate) | §6 Definition of Done; Task 3's acceptance criteria |
| NFR: `spec/harness.test.ts`'s five constraints | Task 12 |
| NFR: no schema changes | Verified in §3.2; no task touches `src/content.config.ts` |
| NFR: accessibility/visual rules unaffected | No task touches `course.css` or theme layout files |
| NFR: voice/tone quality (not fully machine-checkable) | `Human review:` lines on Tasks 4–12; §6 Definition of Done |

## 8. Risks / open questions

None.
