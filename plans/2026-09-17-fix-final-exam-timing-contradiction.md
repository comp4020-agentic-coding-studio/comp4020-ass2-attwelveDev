# Fix final exam timing contradiction

- **Date:** 2026-09-17
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-17

## 1. Summary

`src/content/assessments/final-exam.md` closes its "The five stations" section
with a sentence claiming the four ten-minute stations are "worth as much
combined as the long cooking station alone." This is false against the page's
own marking weights: Stations 1–4 sum to 70% (15+15+20+20) and Station 5 is
30%, so the four short stations are worth more than double the cooking
station, not the same. This plan corrects the sentence and adds a regression
test so the corrected relationship can't silently drift out of sync with the
marking weights again.

## 2. Requirements

### 2.1 Functional requirements

1. The rendered final exam page (`dist/assessments/final-exam/index.html`)
   shall no longer contain the phrase "worth as much combined as the long
   cooking station alone."
2. The rendered final exam page shall contain the phrase "worth more than
   double the long cooking station."
3. The rendered final exam page shall still contain the literal substrings
   `10 minutes` and `2 hours` (already satisfied elsewhere in the page's
   per-station list at lines 24–37 of `final-exam.md`; the fix must not
   remove them).
4. A new automated test shall assert requirements 1 and 2 against the built
   HTML, so a future edit that reintroduces the contradiction fails `pnpm
   check`.

### 2.2 Non-functional requirements

None beyond project defaults (must not introduce any `spec/voice.test.ts`
`BANNED_TERMS` hit — the replacement sentence uses no such terms).

### 2.3 Out of scope

- Linking to the new practice-exam page. That is handled entirely in the
  separate plan `plans/2026-09-17-add-practice-exam-archive.md` (Feature 2),
  since the link target doesn't exist until that page is built.
- Any other wording changes to `final-exam.md`.

### 2.4 Assumptions

None — the weights, current sentence, and test file were all verified
directly against source in this planning session.

## 3. Existing code context

- **File to edit:** `src/content/assessments/final-exam.md`. Frontmatter
  `marking.criteria` (verified verbatim):
  ```yaml
  marking:
    mode: weighted
    criteria:
      - name: "Station 1: Hygiene and Health"
        weight: 15
      - name: "Station 2: Fashion"
        weight: 15
      - name: "Station 3: Small Talk"
        weight: 20
      - name: "Station 4: Reading the Room"
        weight: 20
      - name: "Station 5: Daily Survival"
        weight: 30
  ```
  Confirms 15+15+20+20 = 70 for the four short stations vs. 30 for Station 5;
  70 is more than double 30 (double would be 60).
- **Sentence to replace**, current exact text (lines 48–50 of
  `final-exam.md`, in the body under `## The five stations`, immediately
  after the numbered station list):
  > "Total examined time is 2 hours 50 minutes, of which the four ten-minute
  > stations are worth as much combined as the long cooking station alone —
  > duration is not difficulty."
- **Replacement text** (approved by user):
  > "Total examined time is 2 hours 50 minutes, of which the four short
  > stations combined are worth more than double the long cooking station —
  > duration is not difficulty."
- **Test file:** `spec/assessment-scheme.test.ts`, `describe("final exam", ...)`
  block at lines 245–300. It reads `dist/assessments/final-exam/index.html`
  into `html` (line 246) and asserts various substrings via `expect(html).toMatch(...)`.
  Existing relevant assertions to preserve (line 254–257):
  ```ts
  it("publishes each station's duration", () => {
    expect(html).toMatch(/10 minutes/);
    expect(html).toMatch(/2 hours/);
  });
  ```
- **Voice constraints:** `spec/voice.test.ts` scans every `dist/**/index.html`
  (except `dist/decks/**`) for `BANNED_TERMS` (27 terms — none of them appear
  in either the old or new sentence) via a raw filesystem walk
  (`renderedContentPages()`, lines 54–70). No risk here, but worth stating
  explicitly since the task touches a scanned page.
- **Test/build setup:** `package.json` scripts (verbatim):
  ```json
  "typecheck": "astro check",
  "check": "pnpm typecheck && pnpm test",
  "test": "pnpm build && vitest run spec",
  ```
  `pnpm test` runs `astro build` first, so `dist/` is always fresh before
  `vitest run spec` reads it. Run `pnpm check` for full verification.

## 4. Approach

Single content edit plus one new test case appended to the existing "final
exam" describe block (no new test file needed — this is squarely within the
scope that block already covers). TDD ordering: add the failing assertion
first (against the *current*, unfixed sentence), confirm it fails, then edit
the markdown, then confirm it passes.

## 5. Task breakdown

### Task 1: Add a regression test for the timing/weight relationship

- **Description:** Add a test to the existing `describe("final exam", ...)`
  block in `spec/assessment-scheme.test.ts` that pins the corrected sentence
  and forbids the old contradictory one, so the two can never drift apart
  again.
- **Files touched:** `spec/assessment-scheme.test.ts` (edit only).
- **Tests first (red):** Insert this new `it` block immediately after the
  existing `"publishes each station's duration"` test (after line 257):
  ```ts
  it("states the short-stations-vs-cooking-station weight relationship correctly", () => {
    expect(html).not.toMatch(/worth as much combined as the long cooking station alone/);
    expect(html).toMatch(/worth more than double the long cooking station/);
  });
  ```
  Run `pnpm test` — this must fail right now (current markdown still has the
  old phrase and lacks the new one).
- **Implementation (green):** None yet — Task 2 makes this pass.
- **Refactor:** None expected.
- **Acceptance criteria:**
  - Test fails before Task 2's edit, confirmed by running `pnpm test` and
    observing the new test's failure output.
- **Depends on:** None.

### Task 2: Rewrite the contradictory sentence in `final-exam.md`

- **Description:** Replace the exact contradictory sentence in
  `src/content/assessments/final-exam.md` with the corrected wording.
- **Files touched:** `src/content/assessments/final-exam.md` (edit only).
- **Tests first (red):** N/A — the failing test already exists from Task 1.
- **Implementation (green):** Replace, in the body of the file (the
  paragraph immediately following the numbered station list and before the
  `## Exam conditions` heading):
  ```
  Total examined time is 2 hours 50 minutes, of which the four ten-minute
  stations are worth as much combined as the long cooking station alone —
  duration is not difficulty.
  ```
  with:
  ```
  Total examined time is 2 hours 50 minutes, of which the four short
  stations combined are worth more than double the long cooking station —
  duration is not difficulty.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm check` passes, including the Task 1 test and all pre-existing
    tests in `describe("final exam", ...)` (station count, durations,
    "leave" warning, materials, silence rule, answer booklet, academic
    misconduct, materials-compliance spec line).
  - `grep -c "worth as much combined as the long cooking station alone" src/content/assessments/final-exam.md`
    returns `0`.
  - `grep -c "worth more than double the long cooking station" src/content/assessments/final-exam.md`
    returns `1`.
- **Human review:** None needed — this is a factual/mechanical correction
  with no register or tone judgement involved; the existing sentence
  structure and voice are preserved verbatim apart from the corrected
  relationship.
- **Depends on:** Task 1 (test must exist and fail first).

## 6. Feature-level Definition of Done

- [x] Every task in §5 complete and its tests passing
- [x] `pnpm test` passes
- [x] `pnpm check` passes
- [x] Manually verified: none required (pure text/prose change, no visual or
  interactive surface — no browser check needed)
- [x] Every requirement in §2 is covered — see §7
- [x] Every task with a `Human review:` line has been shown to the user and
  explicitly accepted — N/A, no task in this plan carries one
- [x] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 | Task 1 (test), Task 2 (implementation) |
| 2.1.2 | Task 1 (test), Task 2 (implementation) |
| 2.1.3 | Task 2 (acceptance criteria confirms existing substrings preserved) |
| 2.1.4 | Task 1 |

## 8. Risks / open questions

None.
