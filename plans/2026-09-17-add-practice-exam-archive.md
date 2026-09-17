# Add archived practice exam paper

- **Date:** 2026-09-17
- **Status:** Approved
- **Requirements confirmed by user:** yes — 2026-09-17

## 1. Summary

The final exam page (`src/content/assessments/final-exam.md`) currently states
only structure, timing, materials, and marking criteria for its five
stations — it deliberately carries no example content. This plan adds a
second, standalone page framed as an archived past exam paper ("Semester 1,
2026"), reachable from the real final exam page, that gives students
station-by-station practice: an absurd-but-concrete question per station
(matching what that station actually examines), and, behind a native
disclosure toggle, a model (excellent) solution, a poor solution, examiner's
notes on both, and a descriptive rubric. This is revision material for
students and, in-universe, institutional memorabilia — the joke is
seriousness applied to mundane specifics, never a technical metaphor.

## 2. Requirements

### 2.1 Functional requirements

1. A new page shall render at `/assessments/final-exam/practice-exam/`
   (built from `src/pages/assessments/final-exam/practice-exam.astro`), not
   as a `src/content/assessments/` collection entry.
2. The page shall present itself as an archived past paper dated "Semester
   1, 2026," with real-exam-paper conventions (reading/writing time
   statement, "do not turn this page until instructed," a property/return
   notice).
3. The page shall contain exactly five stations, each headed "Station 1"
   through "Station 5" and matching the real final exam's station names and
   topics (Hygiene and Health, Fashion, Small Talk, Reading the Room, Daily
   Survival).
4. Each station shall pose one station-specific question whose content uses
   only concepts already defined in that topic's lecture(s) (Weeks 2, 3, 4,
   7, 8, 10 — see §3), per the course's core rule that no concept may be
   introduced first in an assessment.
5. Each station's question shall be followed by a `<details>/<summary>`
   disclosure containing: a model (excellent) solution, a poor solution,
   examiner's notes addressing both, and a rubric using ANU's five-band
   scale (HD/D/C/P/N), with the station's stated mark weight (from
   `final-exam.md`'s `marking.criteria`) broken down by sub-criterion — a
   revision to the original "descriptive, not percentage-weighted" design,
   approved by the user during Task 2 review on 2026-09-18, since a
   concrete point breakdown is more useful revision material than bands
   alone. Each station's `<h2>` heading (set in Task 1) also gained its
   mark total in parentheses (e.g. "Station 1: Hygiene and Health (15
   marks)"), per user feedback on Task 2's re-review the same day.
6. The real final exam page (`final-exam.md`) shall gain exactly one new
   line linking to the practice paper (Task 7); it shall not gain any
   scenario, transcript, sample data, or worked-answer content. (Revised
   2026-09-18, approved by the user during Task 5 review: Task 5 may also
   reword the single existing sentence describing Station 4 — from
   "read to you" to "plays out in front of you" — since that is a
   correction to an existing line, not new scenario/transcript content.)
7. The practice-exam page shall not be added to the `assessments` content
   collection and shall not alter any `EXPECTED_WEIGHTS`/`EXPECTED_COVERAGE`
   entry or the "exactly five assessment items" invariant in
   `spec/assessment-scheme.test.ts`.
8. The practice-exam page's rendered HTML shall contain no term from
   `spec/voice.test.ts`'s `BANNED_TERMS` list and no `<code>` element.

### 2.2 Non-functional requirements

- The disclosure toggle uses the native `<details>/<summary>` element only
  — no new JavaScript component, consistent with there being no existing
  toggle/accordion pattern in this codebase.
- Visual check at the project's two marking viewports (1920×1080, 390×844)
  is the user's own responsibility per their standing preference — no
  `agent-browser` screenshot step in this plan; the Definition of Done names
  the route and viewports for them to check manually.
- Accessibility: `<details>/<summary>` is used precisely because it is
  natively keyboard-operable and exposes expand/collapse state to assistive
  tech without extra ARIA wiring.

### 2.3 Out of scope

- Fixing the timing-contradiction sentence on the real final exam page —
  handled by the separate plan `plans/2026-09-17-fix-final-exam-timing-contradiction.md`
  (Feature 1). This plan only adds the one new link line to that page (§2.1.6).
- Any listing/index page changes (e.g. `src/pages/assessments/index.mdx`
  or an `AssessmentsGrid`) to surface the practice paper — it is reached
  only via the link added to the real final exam page, per the user's
  "link from the real exam page, otherwise unlinked archive" decision.
- A global "reveal all solutions" control — each station's `<details>` is
  independent, per the user's approved per-question toggle decision.

### 2.4 Assumptions

None — architecture (standalone page vs. collection entry), toggle
mechanism, station-5 content direction, and cross-linking were all locked
with the user in the brainstorm phase, and verified against source in this
planning session.

## 3. Existing code context

- **Routing precedent:** `src/pages/assessments/[slug].astro` (79 lines,
  read in full) is a dynamic route driven by `getStaticPaths()` over
  `getPublishedCollection("assessments")`; it only ever emits routes for
  collection entries (e.g. `/assessments/final-exam/`). A literal file at
  `src/pages/assessments/final-exam/practice-exam.astro` is a separate,
  static route (`/assessments/final-exam/practice-exam/`) and does not
  collide with the dynamic route's output.
- **Layout precedent — `ContentLayout`:** `[slug].astro` imports
  `ContentLayout` from `astro-theme-university/layouts/ContentLayout.astro`
  and invokes it as:
  ```astro
  <ContentLayout
    title={assessment.data.title}
    description={assessment.data.description}
    {...siteConfig}
  >
    ...
  </ContentLayout>
  ```
  `src/pages/index.astro` also uses `ContentLayout` directly (with
  `heroImage`/`heroImageAlt` props). This is the established pattern for a
  content-heavy standalone `.astro` page in this repo — use it for
  `practice-exam.astro` rather than `src/layouts/PageLayout.astro`.
  **Verified: `PageLayout.astro` is never imported anywhere in `src/`** — it
  is wired only as `defaultLayout: "src/layouts/PageLayout.astro"` in
  `astro.config.ts`'s `universityTheme(...)` call, a mechanism that applies
  automatically to `.mdx` pages only, not to hand-written `.astro` files. Do
  not import it.
- **`siteConfig`:** imported as `import { siteConfig } from "../../site-config";`
  (relative depth: `practice-exam.astro` is one directory deeper than
  `[slug].astro`, so its import path is `"../../../site-config"`).
- **CSS classes available in `src/styles/course.css`** (306 lines, read in
  full) — reuse rather than add new rules:
  - `.course-specsheet` + `dl`/`dt`/`dd` (lines 112–139): definition-list
    grid — use for the exam-paper preamble block (session, reading time,
    writing time).
  - `.course-schedule` + `table`/`th`/`td` (lines 24–49): bordered, scrollable
    table with row hover — use for Station 1's sample logged schedule and
    Station 5's pantry list.
  - `.course-list` + `li` (lines 85–103): divided list — usable for the
    Station 2 outfit options list.
  - No existing rule targets `<details>`/`<summary>` — none is needed; the
    browser default disclosure marker is sufficient and no new CSS class is
    required for this plan's acceptance criteria.
- **Final exam frontmatter (verified verbatim), `src/content/assessments/final-exam.md`:**
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
  Station names/order (Hygiene and Health, Fashion, Small Talk, Reading the
  Room, Daily Survival) are taken verbatim from here.
- **Lecture definitions used verbatim as the grounding for each station's
  question** (all confirmed by direct reading in this planning session):
  - `src/content/lectures/week-02.mdx`: Shower ("typically once per calendar
    day"), Laundry ("ideally before the pile is visible from the doorway").
  - `src/content/lectures/week-04.mdx`: Bedtime ("a specific, named clock
    time ... not merely 'later'"), Exercise ("physical activity undertaken
    on a stated schedule, distinguished from 'the walk to the vending
    machine'").
  - `src/content/lectures/week-03.mdx`: Dress code ("an unwritten or written
    expectation for attire at a given event, violation of which is noticed
    by everyone except the violator"), Occasion, Job interview ("covered in
    full in Week 11" — i.e. suit-and-tie is that definition's example, not
    this occasion's).
  - `src/content/lectures/week-07.mdx`: small-talk formula ("name, one
    hobby, one recent trip"), eye-contact research (Binetti et al. 2016,
    "average preferred mutual gaze duration was around 3.2–3.3 seconds"),
    reading-the-room stall cues ("one-word answers ... repeated glances at
    the door, or checking a watch mid-sentence... Diagnose first ... then
    respond with an exit, not another question").
  - `src/content/lectures/week-10.mdx`: "one protein, one starch, one
    vegetable," cook order ("the slowest item goes on first, the fastest
    goes on last"), "taste before declaring it done."
- **Voice constraints — `spec/voice.test.ts`** (184 lines, read in full):
  `BANNED_TERMS` (27 terms — see the other plan file for the full verbatim
  list; none appear in any drafted content below), and the page-discovery
  walk (`renderedContentPages()`, lines 54–70) includes every
  `dist/**/index.html` except `dist/decks/**` — the new page's output file
  `dist/assessments/final-exam/practice-exam/index.html` will be scanned.
  No `<code>` element may appear anywhere on the page.
- **`spec/assessment-scheme.test.ts`:** top-level checks (lines 22–110) read
  `dist/api/index.json` and filter `type === "assessments"` — a standalone
  page that is not a collection entry never appears in this data and is
  automatically excluded from the 5-item/100%-sum/weighted-marking checks.
  No edit to this file's existing assertions is needed; a new test file is
  used instead (Task 1).
- **Existing markdown internal-link convention:** other assessment files
  use plain root-relative links, e.g. `src/content/assessments/assignment-3-adulting.md`
  line 89: `[Policies](/policies/)` — no manual base-path prefixing. The new
  link added to `final-exam.md` should follow the same convention:
  `[the archived practice paper](/assessments/final-exam/practice-exam/)`.
- **Test/build setup:** `package.json` — `"test": "pnpm build && vitest run spec"`,
  `"check": "pnpm typecheck && pnpm test"`. Tests read from `dist/`, which
  `pnpm test` always rebuilds first.

## 4. Approach

One new spec file, `spec/practice-exam.test.ts`, mirroring the structure of
`spec/assessment-scheme.test.ts`'s `describe("final exam", ...)` block:
read `dist/assessments/final-exam/practice-exam/index.html` once at the top
of the file, then one `describe` per station plus one for the page-level
preamble. Content is built incrementally, one station per task, each
following red→green: write the station's assertions first (they fail
against the still-incomplete page), then add that station's markup.

The page itself is a single `.astro` file — no need to split it across
components, since assessment content elsewhere in this codebase is plain
prose/markup, not componentised (`[slug].astro`'s own `<Content />` is
rendered markdown, not a station-by-station component tree).

## 5. Task breakdown

### Task 1: Scaffold the practice-exam page and its preamble

- **Description:** Create `practice-exam.astro` with `ContentLayout`, the
  exam-paper preamble (session date, reading/writing time, "do not turn
  this page" notice, property/return notice), and five empty station
  headings with their questions only (no solutions yet — those are Tasks
  2–6). Create the new spec file with page-discovery boilerplate and the
  preamble/structure assertions.
- **Files touched:**
  - New: `src/pages/assessments/final-exam/practice-exam.astro`
  - New: `spec/practice-exam.test.ts`
- **Tests first (red):** Create `spec/practice-exam.test.ts`:
  ```ts
  import { readFileSync } from "node:fs";
  import { resolve } from "node:path";
  import { describe, expect, it } from "vitest";

  const html = readFileSync(
    resolve("dist/assessments/final-exam/practice-exam/index.html"),
    "utf8",
  );

  describe("practice exam archive", () => {
    it("is dated as an archived past sitting", () => {
      expect(html).toMatch(/Semester 1, 2026/);
    });

    it("states reading and writing time", () => {
      expect(html).toMatch(/reading time/i);
      expect(html).toMatch(/writing time/i);
      expect(html).toMatch(/2 hours 50 minutes/);
    });

    it("carries real exam-paper conventions", () => {
      expect(html).toMatch(/do not turn this page until instructed/i);
    });

    it("runs the same five stations as the final exam, in order", () => {
      for (let station = 1; station <= 5; station++) {
        expect(html, `missing Station ${station}`).toMatch(new RegExp(`Station ${station}\\b`));
      }
      expect(html).toMatch(/Hygiene and Health/);
      expect(html).toMatch(/Fashion/);
      expect(html).toMatch(/Small Talk/);
      expect(html).toMatch(/Reading the Room/);
      expect(html).toMatch(/Daily Survival/);
    });
  });
  ```
  Run `pnpm test` — fails (`dist/assessments/final-exam/practice-exam/index.html`
  does not exist yet).
- **Implementation (green):** `src/pages/assessments/final-exam/practice-exam.astro`:
  ```astro
  ---
  import ContentLayout from "astro-theme-university/layouts/ContentLayout.astro";
  import { siteConfig } from "../../../site-config";

  const title = "Practice Paper (Archived) — Final Exam";
  const description =
    "An archived past sitting of the final exam, with practice questions, sample solutions, and rubrics for each station.";
  ---

  <ContentLayout title={title} description={description} {...siteConfig}>
    <h1>Practice Paper</h1>
    <section class="course-specsheet" aria-label="Paper details">
      <dl>
        <dt>Session</dt>
        <dd>Semester 1, 2026</dd>
        <dt>Reading time</dt>
        <dd>10 minutes</dd>
        <dt>Writing time</dt>
        <dd>2 hours 50 minutes</dd>
      </dl>
    </section>
    <p>
      Do not turn this page until instructed to do so. This paper remains the
      property of the university and must be returned at the end of the
      examination.
    </p>

    <h2>Station 1: Hygiene and Health (15 marks)</h2>
    <p>
      Attached is one student's logged hygiene, bedtime, and exercise entries
      for the seven days immediately before the exam, alongside their stated
      semester intent (shower daily, bedtime 11:00pm, laundry before the pile
      is visible from the doorway). List every entry that fails its
      definition, name which definition it fails, and say why.
    </p>

    <h2>Station 2: Fashion (15 marks)</h2>
    <p>
      You are given the following occasion: a cousin's engagement dinner —
      indoor, seated, in July, described on the invitation as semi-formal.
      Assemble one outfit from the four provided below, and justify your
      choice against the definitions of Dress code and Occasion.
    </p>

    <h2>Station 3: Small Talk (20 marks)</h2>
    <p>
      Annotate the transcript below against the small-talk formula (name, one
      hobby, one recent trip) and the eye-contact research, noting each slot
      the student fills, each slot they miss, and whether the pause length
      was appropriate.
    </p>

    <h2>Station 4: Reading the Room (20 marks)</h2>
    <p>
      Diagnose the scenario below against the stall cues, then propose the
      response the lecture recommends.
    </p>

    <h2>Station 5: Daily Survival (30 marks)</h2>
    <p>
      Using the pantry and budget below, plan one complete meal, cooked in
      the correct order, and show your reasoning.
    </p>
  </ContentLayout>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes for all four `it` blocks in `spec/practice-exam.test.ts` above.
  - `astro check` (part of `pnpm typecheck`) passes with no type errors on
    the new file.
- **Human review:** View `/assessments/final-exam/practice-exam/` at
  1920×1080 and 390×844. Pass looks like: the specsheet block and heading
  hierarchy render consistently with the real final exam page's look, the
  preamble reads as a plausible exam-paper cover section (not a joke that
  undercuts itself), and nothing overflows or wraps awkwardly at the phone
  width.
- **Depends on:** None.
- [x] Done — human review accepted.

### Task 2: Station 1 content — sample logged schedule, solutions, rubric

- **Description:** Add the sample logged schedule table and the
  `<details>` disclosure (model solution, poor solution, examiner's notes,
  rubric) to Station 1.
- **Files touched:** `src/pages/assessments/final-exam/practice-exam.astro`,
  `spec/practice-exam.test.ts`.
- **Tests first (red):** Add to `spec/practice-exam.test.ts`:
  ```ts
  describe("station 1: hygiene and health", () => {
    it("gives a sample logged schedule", () => {
      expect(html).toMatch(/walk to vending machine/);
      expect(html).toMatch(/visible from the doorway/);
    });

    it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
      expect(html).toMatch(/<details/);
      expect(html).toMatch(/Model solution/);
      expect(html).toMatch(/Poor solution/);
      expect(html).toMatch(/Examiner's notes/);
      expect(html).toMatch(/Rubric/);
    });

    it("gives the rubric as HD\\/D\\/C\\/P\\/N bands with a mark breakdown summing to the station's weight", () => {
      const section = html.slice(html.indexOf("Station 1"), html.indexOf("Station 2"));
      expect(section).toMatch(/\bHD\b/);
      expect(section).toMatch(/\bN\b/);
      expect(section).toMatch(/out of 15/);
    });
  });
  ```
  Run `pnpm test` — fails (Station 1 has no sample data or `<details>` yet).
- **Implementation (green):** Insert immediately after Station 1's question
  paragraph in `practice-exam.astro`:
  ```astro
  <table class="course-schedule">
    <thead>
      <tr><th>Day</th><th>Shower</th><th>Actual sleep time</th><th>Laundry</th><th>Exercise logged</th></tr>
    </thead>
    <tbody>
      <tr><td>Mon</td><td>Yes, 7:40am</td><td>1:15am</td><td>—</td><td>—</td></tr>
      <tr><td>Tue</td><td>No</td><td>12:40am</td><td>—</td><td>"walk to vending machine"</td></tr>
      <tr><td>Wed</td><td>Yes</td><td>11:50pm</td><td>—</td><td>—</td></tr>
      <tr><td>Thu</td><td>No</td><td>2:05am</td><td>—</td><td>—</td></tr>
      <tr><td>Fri</td><td>Yes</td><td>11:40pm</td><td>Started, not finished</td><td>—</td></tr>
      <tr><td>Sat</td><td>Yes</td><td>3:20am</td><td>—</td><td>—</td></tr>
      <tr><td>Sun</td><td>No</td><td>1:00am</td><td>Pile now visible from the doorway</td><td>—</td></tr>
    </tbody>
  </table>
  <details>
    <summary>Reveal solutions and rubric</summary>
    <h3>Model solution</h3>
    <p>
      Tuesday's exercise entry fails the definition of Exercise — a walk to
      the vending machine is the definition's own named non-example, not a
      substitute for it. Sunday's laundry entry fails the definition of
      Laundry directly: the pile has become visible from the doorway, which
      the definition names as the threshold to stay ahead of. Tuesday,
      Thursday, and Sunday's missing showers fail the "typically once per
      calendar day" definition on three of seven days. Every night's actual
      sleep time misses the stated 11:00pm bedtime by at least forty
      minutes, and by over three hours on Wednesday, Saturday, and Sunday,
      failing the definition of Bedtime as a specific, named clock time, not
      merely "later."
    </p>
    <h3>Poor solution</h3>
    <p>This student's hygiene was pretty bad this week and they should go to bed earlier and shower more.</p>
    <h3>Examiner's notes</h3>
    <p>
      Full marks require naming the specific failing entry, the specific
      definition it fails, and closely paraphrasing that definition's own
      wording — "pretty bad" and "more" are not definitions. The
      vending-machine walk is the single most commonly missed point at this
      station.
    </p>
    <h3>Rubric — out of 15</h3>
    <table class="course-schedule">
      <thead><tr><th>Criterion</th><th>Marks</th></tr></thead>
      <tbody>
        <tr><td>Exercise entry (vending-machine non-example)</td><td>4</td></tr>
        <tr><td>Laundry entry (pile visible from doorway)</td><td>4</td></tr>
        <tr><td>Missed showers (three days)</td><td>4</td></tr>
        <tr><td>Bedtime failures</td><td>3</td></tr>
      </tbody>
    </table>
    <table class="course-schedule">
      <thead><tr><th>Band</th><th>Marks</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>HD</td><td>13–15</td><td>Cites all four failure types by specific day and definition.</td></tr>
        <tr><td>D</td><td>10–12</td><td>Cites three of the four failure types by specific day and definition.</td></tr>
        <tr><td>C</td><td>7–9</td><td>Cites two failure types by specific day and definition, or all four without specifics.</td></tr>
        <tr><td>P</td><td>4–6</td><td>Cites one failure type specifically, or general statements touching several types.</td></tr>
        <tr><td>N</td><td>0–3</td><td>No specific day or definition cited.</td></tr>
      </tbody>
    </table>
  </details>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including all three new Station 1 `it` blocks.
  - No string in this block matches any `spec/voice.test.ts` `BANNED_TERMS`
    entry (verified by running `pnpm test` — `voice.test.ts` runs in the
    same suite and would fail if one were present).
- **Human review:** Read the Station 1 model/poor solution pair. Pass looks
  like: the model solution is genuinely useful exam-prep content (cites
  specific, checkable definition failures) and the poor solution is
  recognisably weak without being a strawman, and the register matches the
  rest of the course (deadpan, mundane specifics, no technical metaphor).
- **Depends on:** Task 1.
- [x] Done — human review accepted (rubric revised to HD/D/C/P/N + mark
  breakdown, and station headings gained mark totals, per user feedback
  during review on 2026-09-18).

### Task 3: Station 2 content — rack of items, solutions, rubric

- **Description:** Add a rack of individual clothing items (not
  pre-assembled outfits — matching the real final exam's own "from a rack
  of provided items" mechanic) and the `<details>` disclosure to Station 2.
  Revised from the original pre-assembled-outfit design per user feedback
  during Task 3 review on 2026-09-18: the real station requires the
  student to assemble an outfit themselves, not just pick from finished
  options.
- **Files touched:** `src/pages/assessments/final-exam/practice-exam.astro`,
  `spec/practice-exam.test.ts`.
- **Tests first (red):** Add:
  ```ts
  describe("station 2: fashion", () => {
    it("gives a rack of individual items to assemble an outfit from", () => {
      expect(html).toMatch(/rack/i);
      expect(html).toMatch(/hoodie with a hole/);
      expect(html).toMatch(/full suit with tie/);
      expect(html).toMatch(/collared shirt/);
      expect(html).toMatch(/\bchinos\b/);
      expect(html).toMatch(/bow-tie graphic/);
    });

    it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
      const section = html.slice(html.indexOf("Station 2"), html.indexOf("Station 3"));
      expect(section).toMatch(/Model solution/);
      expect(section).toMatch(/Poor solution/);
      expect(section).toMatch(/Examiner's notes/);
      expect(section).toMatch(/Rubric/);
    });

    it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
      const section = html.slice(html.indexOf("Station 2"), html.indexOf("Station 3"));
      expect(section).toMatch(/\bHD\b/);
      expect(section).toMatch(/\bN\b/);
      expect(section).toMatch(/out of 15/);
    });
  });
  ```
- **Implementation (green):** Reword Station 2's question paragraph to
  describe a rack rather than pre-built options, then insert the rack list
  and `<details>` after it:
  ```astro
  <p>
    At this station, a rack of clothing items is provided for the
    following occasion: a cousin's engagement dinner — indoor, seated, in
    July, described on the invitation as semi-formal. Select the items
    from the rack below that assemble one complete outfit, and justify
    your choices against the definitions of Dress code and Occasion.
  </p>
  <ul class="course-list">
    <li>Gym shorts</li>
    <li>A hoodie with a hole in one cuff</li>
    <li>Thongs</li>
    <li>A full suit with tie</li>
    <li>Dress shoes</li>
    <li>A collared shirt</li>
    <li>Chinos</li>
    <li>A belt</li>
    <li>Loafers</li>
    <li>A t-shirt printed with a bow-tie graphic</li>
    <li>Jeans</li>
    <li>Sneakers</li>
  </ul>
  <details>
    <summary>Reveal solutions and rubric</summary>
    <h3>Model solution</h3>
    <p>
      The collared shirt, chinos, belt, and loafers together meet the
      "semi-formal" Dress code for this seated indoor Occasion. The full
      suit and tie overshoots: it is reserved for a Job interview, not this
      occasion. Gym shorts, the hoodie with a hole, and thongs ignore the
      dress code outright. The bow-tie-printed t-shirt is a graphic, not a
      garment — pairing it with jeans and sneakers does not meet the
      expectation it visually references.
    </p>
    <h3>Poor solution</h3>
    <p>The t-shirt with the bow-tie graphic, jeans, and sneakers, because it has a bow tie on it so it counts as formal.</p>
    <h3>Examiner's notes</h3>
    <p>
      The printed-bow-tie confusion is the most commonly chosen wrong
      answer — full marks require noticing it is a graphic, not an actual
      garment. Treating the full suit as always the safe choice, rather
      than its own defined occasion, is the second most commonly missed
      point.
    </p>
    <h3>Rubric — out of 15</h3>
    <table class="course-schedule">
      <thead><tr><th>Criterion</th><th>Marks</th></tr></thead>
      <tbody>
        <tr><td>Selects the collared shirt, chinos, belt, and loafers</td><td>6</td></tr>
        <tr><td>Names Dress code definition correctly</td><td>3</td></tr>
        <tr><td>Names Occasion definition correctly</td><td>3</td></tr>
        <tr><td>Explains why both the suit and the bow-tie tee are wrong</td><td>3</td></tr>
      </tbody>
    </table>
    <table class="course-schedule">
      <thead><tr><th>Band</th><th>Marks</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>HD</td><td>13–15</td><td>Selects all four correct items, names both Dress code and Occasion, and explains why both decoys are wrong.</td></tr>
        <tr><td>D</td><td>10–12</td><td>Selects all four correct items, names both definitions, and explains only one decoy.</td></tr>
        <tr><td>C</td><td>7–9</td><td>Selects all four correct items and names one of the two definitions.</td></tr>
        <tr><td>P</td><td>4–6</td><td>Selects all four correct items but gives no reasoning tied to either definition.</td></tr>
        <tr><td>N</td><td>0–3</td><td>Selects items that fail the dress code, with or without reasoning.</td></tr>
      </tbody>
    </table>
  </details>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm test` passes, including all three new Station 2 `it` blocks.
- **Human review:** Same bar as Task 2 — read the model/poor pair for
  usefulness and voice.
- **Depends on:** Task 1.
- [x] Done — human review accepted (reworked from pre-built outfit options
  to an individual-item rack, per user feedback during review on
  2026-09-18).

### Task 4: Station 3 content — written dialogue, live-marking rubric

- **Description:** Reframe Station 3's practice content per four rounds
  of user feedback on 2026-09-18: (1) the real station is a live,
  unscripted conversation, so a fixed transcript to annotate misrepresents
  it; (2) the student's job is to draw the stranger's (examiner's) name,
  hobby, and trip out of them; (3) the question asks the student to write
  the actual lines/questions they would use, as rehearsal, rather than
  describe a strategy in the abstract; (4) the practice-paper-only
  explanation of how marking works ("the examiner marks by taking notes
  live during the exchange, not by grading a transcript afterwards") is
  quoted and explicitly flagged as not appearing on the real exam paper —
  unlike the leave-early/ten-minute clause, which is quoted verbatim from
  `final-exam.md` because it genuinely does; (5) the sample failed attempt
  moves into the `<details>` as the worked "Poor solution", rather than
  being shown openly before the reveal; (6) most importantly, the
  disclosed rubric is the real exam's own live-marking scheme — it grades
  what a candidate does in the actual spoken conversation (drew out the
  name, followed up on a volunteered detail, held eye contact, finished
  within the ten-minute window), not how well the student's written
  rehearsal reads; (7) the practice-paper-only note plus the written-
  rehearsal instruction are set in a `<blockquote>`, visually separate
  from the exam-paper-style question prose above it.
- **Files touched:** `src/pages/assessments/final-exam/practice-exam.astro`,
  `spec/practice-exam.test.ts`.
- **Tests first (red):** Add:
  ```ts
  describe("station 3: small talk", () => {
    it("notes the real station is a live conversation, not a script", () => {
      expect(html).toMatch(/live conversation/i);
      expect(html).toMatch(/written practice paper/i);
    });

    it("carries the exam's own leave-early and ten-minute risk", () => {
      expect(html).toMatch(/leave early if the conversation stalls past recovery/i);
      expect(html).toMatch(/ten-minute mark/i);
    });

    it("quotes the notes-marking mechanic and flags it as absent from the real paper", () => {
      expect(html).toMatch(
        /"The examiner marks by taking notes live during the exchange, not by grading a transcript afterwards"/,
      );
      expect(html).toMatch(/does not appear on the real exam paper/i);
    });

    it("asks the student to write actual dialogue, not describe a strategy", () => {
      expect(html).toMatch(/write the (lines|questions) you would (use|ask)/i);
    });

    it("keeps the failed example inside the reveal, as the worked Poor solution", () => {
      const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
      const poorIndex = section.indexOf("Poor solution");
      const exampleIndex = section.indexOf("weekend at the coast");
      expect(poorIndex).toBeGreaterThan(-1);
      expect(exampleIndex).toBeGreaterThan(poorIndex);
      expect(section).toMatch(/getting into pottery/i);
    });

    it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
      const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
      expect(section).toMatch(/Model solution/);
      expect(section).toMatch(/Poor solution/);
      expect(section).toMatch(/Examiner's notes/);
      expect(section).toMatch(/Rubric/);
    });

    it("grades the real live conversation, not the written rehearsal", () => {
      const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
      expect(section).toMatch(/as marked live/i);
      expect(section).toMatch(/completes the exchange within the ten-minute window/i);
    });

    it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
      const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
      expect(section).toMatch(/\bHD\b/);
      expect(section).toMatch(/\bN\b/);
      expect(section).toMatch(/out of 20/);
    });
  });
  ```
- **Implementation (green):** Reword Station 3's question paragraph
  (dropping the visible failed-example list), then insert the
  `<details>`:
  ```astro
  <p>
    This station is a live conversation in which you meet an examiner
    playing a stranger at a low-stakes social event — the examiner may
    leave early if the conversation stalls past recovery, and will leave
    at the ten-minute mark regardless. You are marked on how well you
    draw out the stranger's name, one hobby, and one recent trip using
    the small-talk formula within that window, while holding appropriate
    eye contact.
  </p>
  <blockquote>
    <p>
      "The examiner marks by taking notes live during the exchange, not
      by grading a transcript afterwards" — a note added for this
      practice paper; it does not appear on the real exam paper. Because
      this is a written practice paper, write the lines you would use to
      open the conversation and the questions you would ask to draw out
      all three targets, as rehearsal for the live exchange.
    </p>
  </blockquote>
  <details>
    <summary>Reveal solutions and rubric</summary>
    <h3>Model solution</h3>
    <p>
      A strong live attempt opens by asking directly for the stranger's
      name — for example, "I don't think we've met — I'm [name], what's
      yours?" — rather than volunteering only your own and hoping for one
      back. When the stranger volunteers a detail unprompted, the
      candidate follows it immediately with a specific question, such as
      "What was that like?" or "What got you into that?", rather than
      moving on. If neither the hobby nor the trip has come up unprompted
      by the halfway mark, the candidate asks directly: "Have you been
      anywhere good recently?" or "What do you get up to outside of this
      event?" Before answering any question put back to them, the
      candidate holds a pause of roughly 3.2–3.3 seconds with eye contact,
      rather than answering instantly or looking away, completing the
      exchange within the ten-minute window without the conversation
      stalling.
    </p>
    <h3>Poor solution</h3>
    <p>One candidate's examiner's notes from an actual attempt that went wrong:</p>
    <ul class="course-list">
      <li>0:05 — Candidate opened with their own name. Did not ask for mine.</li>
      <li>0:20 — I mentioned, unprompted, that I'd just got back from a weekend at the coast. Candidate said "nice" and moved on.</li>
      <li>0:40 — I mentioned, unprompted, that I've been getting into pottery lately. Candidate said "oh cool" and moved on.</li>
      <li>1:05 — Candidate held a comfortable pause, roughly three seconds, before answering my question about their week.</li>
    </ul>
    <h3>Examiner's notes</h3>
    <p>
      Against the rubric below, this attempt scores in the lowest bands:
      the name is never asked for, and the hobby and trip are both
      volunteered by the stranger and immediately dropped rather than
      drawn out — only the eye-contact criterion is met. Full marks
      require the candidate to actively elicit all three, not benefit
      from what the stranger happens to offer.
    </p>
    <h3>Rubric — out of 20, as marked live</h3>
    <table class="course-schedule">
      <thead><tr><th>Criterion</th><th>Marks</th></tr></thead>
      <tbody>
        <tr><td>Draws out the stranger's name by asking directly</td><td>4</td></tr>
        <tr><td>Follows up a volunteered detail with a specific question</td><td>4</td></tr>
        <tr><td>Asks directly for any target not volunteered by the halfway mark</td><td>4</td></tr>
        <tr><td>Holds eye contact for roughly 3.2–3.3 seconds before answering</td><td>4</td></tr>
        <tr><td>Completes the exchange within the ten-minute window without stalling</td><td>4</td></tr>
      </tbody>
    </table>
    <table class="course-schedule">
      <thead><tr><th>Band</th><th>Marks</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>HD</td><td>18–20</td><td>Actively draws out all three targets, holds the eye-contact pause correctly, and completes the exchange within the ten-minute window without stalling.</td></tr>
        <tr><td>D</td><td>14–17</td><td>Actively draws out two of the three targets, and meets both the eye-contact and timing criteria.</td></tr>
        <tr><td>C</td><td>10–13</td><td>Actively draws out one of the three targets, or draws out two but misses eye contact or timing.</td></tr>
        <tr><td>P</td><td>6–9</td><td>No targets are actively drawn out — any that appear are only volunteered and dropped — but the conversation continues without stalling.</td></tr>
        <tr><td>N</td><td>0–5</td><td>The conversation stalls before the ten-minute mark and the examiner leaves early.</td></tr>
      </tbody>
    </table>
  </details>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm test` passes, including all seven new Station 3 `it` blocks.
- **Human review:** Same bar as Task 2.
- **Depends on:** Task 1.
- [x] Done — human review accepted after eight rounds of feedback on
  2026-09-18 (see description for the full list of reframes: live
  conversation not a script, student draws info out of the examiner,
  live-marking rubric not a written-rehearsal rubric, real-vs-practice
  note quoted and boxed in a blockquote, redundant lead-in removed).

### Task 5: Station 4 content — live-scenario transcript, solutions, rubric

- **Description:** Per user feedback on 2026-09-18, reframe Station 4's
  scenario as a transcript of a group project meeting that plays out live
  in front of the student (matching how the real station actually runs),
  rather than a bare bullet-point description of the stall cues. Add a
  boxed note (mirroring Station 3's pattern) explaining that the real
  exam presents this scenario live, and the written transcript is only
  for the practice paper's purposes. This also requires widening this
  plan's scope, with explicit user sign-off: `final-exam.md`'s Station 4
  line currently reads "Diagnose a friend-group or workplace scenario
  read to you, and propose a reason and a fix," which undersells the
  station as narration rather than a live scene — reword that one
  existing sentence to say the scenario "plays out in front of you."
  This is a wording correction to an existing sentence, not new content,
  and requirement 2.1.6 is revised accordingly (§2.1.6, below).
- **Files touched:** `src/pages/assessments/final-exam/practice-exam.astro`,
  `src/content/assessments/final-exam.md`, `spec/practice-exam.test.ts`.
- **Tests first (red):** Add:
  ```ts
  describe("station 4: reading the room", () => {
    it("gives a transcript with the stall cues embedded in dialogue", () => {
      expect(html).toMatch(/one-word answers/);
      expect(html).toMatch(/checked their watch/);
    });

    it("notes the real exam scenario plays out live, and the transcript is for the practice paper", () => {
      const section = html.slice(html.indexOf("Station 4"), html.indexOf("Station 5"));
      expect(section).toMatch(/plays out live in front of you/i);
      expect(section).toMatch(/provided for the purpose of this practice exam/i);
    });

    it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
      const section = html.slice(html.indexOf("Station 4"), html.indexOf("Station 5"));
      expect(section).toMatch(/Model solution/);
      expect(section).toMatch(/Poor solution/);
      expect(section).toMatch(/Examiner's notes/);
      expect(section).toMatch(/Rubric/);
    });

    it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
      const section = html.slice(html.indexOf("Station 4"), html.indexOf("Station 5"));
      expect(section).toMatch(/\bHD\b/);
      expect(section).toMatch(/\bN\b/);
      expect(section).toMatch(/out of 20/);
    });
  });
  ```
  Also add, to `spec/assessment-scheme.test.ts`'s existing `describe("final
  exam", ...)` block, a check that the reworded sentence sticks:
  ```ts
  it("presents Station 4's scenario as live, not narrated", () => {
    expect(html).toMatch(/plays out in front of you/i);
  });
  ```
- **Implementation (green):** Reword Station 4's question paragraph, then
  insert the boxed note, the transcript, and `<details>` after it:
  ```astro
  <p>
    Diagnose the exchange below, from a group project meeting, against
    the stall cues, then propose the response the lecture recommends.
  </p>
  <blockquote>
    <p>
      In the real exam, this scenario plays out live in front of you; the
      transcript below is provided for the purpose of this practice exam.
    </p>
  </blockquote>
  <blockquote>
    <p><strong>You:</strong> "Do you think we should split the slides between the three of us?"</p>
    <p><strong>Group member:</strong> "Sure." <em>(checked their watch)</em></p>
    <p><strong>You:</strong> "Want to take the intro section, or the methodology?"</p>
    <p><strong>Group member:</strong> "Either." <em>(glanced at the door)</em></p>
    <p><strong>You:</strong> "We could meet again Thursday to run through it — does that work?"</p>
    <p><strong>Group member:</strong> "Fine." <em>(checked their watch again)</em></p>
  </blockquote>
  <details>
    <summary>Reveal solutions and rubric</summary>
    <h3>Model solution</h3>
    <p>
      Two of the three named stall cues are present and repeated within a
      short span: one-word answers (three times — "Sure.", "Either.",
      "Fine.") and watch-checking (twice), plus one door glance. This is
      enough to diagnose a stalled conversation, not merely a paused one.
      The recommended response is not another question — it is an exit:
      thank them for their time, name a reason to go, and leave, ending
      the conversation rather than trying to revive it.
    </p>
    <h3>Poor solution</h3>
    <p>Ask them if everything's okay, since they seem distracted.</p>
    <h3>Examiner's notes</h3>
    <p>
      This exchange deliberately baits the "ask if they're okay" response,
      which is the specifically named mistake — treating a stalled
      conversation as one that needs more effort, rather than an ending.
      Full marks require citing the specific cues counted, not just
      noticing that something is off.
    </p>
    <h3>Rubric — out of 20</h3>
    <table class="course-schedule">
      <thead><tr><th>Criterion</th><th>Marks</th></tr></thead>
      <tbody>
        <tr><td>Names the one-word-answers cue</td><td>5</td></tr>
        <tr><td>Names the watch-checking cue</td><td>5</td></tr>
        <tr><td>States the stall diagnosis explicitly</td><td>5</td></tr>
        <tr><td>Gives the exit response, not another question</td><td>5</td></tr>
      </tbody>
    </table>
    <table class="course-schedule">
      <thead><tr><th>Band</th><th>Marks</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>HD</td><td>18–20</td><td>Names both specific cues present, states the diagnosis explicitly, and gives the exit response.</td></tr>
        <tr><td>D</td><td>14–17</td><td>Names one specific cue, states the diagnosis explicitly, and gives the exit response.</td></tr>
        <tr><td>C</td><td>10–13</td><td>Correctly diagnoses a stall but proposes a vague or partial response.</td></tr>
        <tr><td>P</td><td>6–9</td><td>Shows some awareness something is wrong but still proposes asking another question.</td></tr>
        <tr><td>N</td><td>0–5</td><td>Proposes asking another question with no diagnosis and no specific cue named.</td></tr>
      </tbody>
    </table>
  </details>
  ```
  In `src/content/assessments/final-exam.md`, reword the existing Station 4
  bullet (no other line changes):
  ```md
  4. **Station 4: Reading the Room (10 minutes).** Diagnose a friend-group
     or workplace scenario that plays out in front of you, and propose a
     reason and a fix.
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm test` passes, including all four new
  Station 4 `it` blocks in `spec/practice-exam.test.ts` and the new
  `spec/assessment-scheme.test.ts` assertion.
- **Human review:** Same bar as Task 2, plus: confirm the reworded
  `final-exam.md` sentence still reads as a plausible real-exam-paper
  line, not a practice-paper aside.
- **Depends on:** Task 1.
- [x] Done — human review accepted (reworked as a live-dialogue
  transcript with a boxed real-vs-practice note, per user feedback during
  review on 2026-09-18; also rewords `final-exam.md`'s Station 4 line
  with the user's explicit sign-off to widen this plan's scope).

### Task 6: Station 5 content — pantry/budget, worked meal plan, solutions, rubric

- **Description:** Add the pantry/budget data and the `<details>`
  disclosure to Station 5. Per user feedback during Task 6 review on
  2026-09-18, the question itself (not a separate boxed note) must make
  cooking part of the task: after planning and reasoning through the
  cook order, the student then uses that plan to actually cook the meal.
- **Files touched:** `src/pages/assessments/final-exam/practice-exam.astro`,
  `spec/practice-exam.test.ts`.
- **Tests first (red):** Add:
  ```ts
  describe("station 5: daily survival", () => {
    it("gives a pantry and a stated budget", () => {
      expect(html).toMatch(/chicken thighs/);
      expect(html).toMatch(/\$12/);
    });

    it("makes cooking the plan part of the question, not just planning it", () => {
      const section = html.slice(html.indexOf("Station 5"));
      expect(section).toMatch(/use this plan to actually cook it/i);
    });

    it("notes that cooking materials and a kitchen area are provided", () => {
      const section = html.slice(html.indexOf("Station 5"));
      expect(section).toMatch(/cookware/i);
      expect(section).toMatch(/kitchen area/i);
    });

    it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
      const section = html.slice(html.indexOf("Station 5"));
      expect(section).toMatch(/Model solution/);
      expect(section).toMatch(/Poor solution/);
      expect(section).toMatch(/Examiner's notes/);
      expect(section).toMatch(/Rubric/);
    });

    it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
      const section = html.slice(html.indexOf("Station 5"));
      expect(section).toMatch(/\bHD\b/);
      expect(section).toMatch(/\bN\b/);
      expect(section).toMatch(/out of 30/);
    });
  });
  ```
- **Implementation (green):** Reword Station 5's question paragraph, then
  insert the pantry table and `<details>` after it:
  ```astro
  <p>
    Using the pantry and budget below, plan one complete meal, cooked in
    the correct order, show your reasoning, and then use this plan to
    actually cook it within the station's time.
  </p>
  <p>All cooking materials — cookware, a stove, and a kitchen area — are provided at the station.</p>
  <table class="course-schedule">
    <thead><tr><th>Pantry</th><th>Budget</th></tr></thead>
    <tbody>
      <tr>
        <td>Chicken thighs, canned chickpeas, rice, frozen mixed vegetables, one onion, two cloves garlic, canned tomatoes, dried pasta, two eggs, salt, one dried spice mix</td>
        <td>$12, stated at the door</td>
      </tr>
    </tbody>
  </table>
  <details>
    <summary>Reveal solutions and rubric</summary>
    <h3>Model solution</h3>
    <p>
      Protein: chicken thighs. Starch: rice. Vegetable: frozen mixed
      vegetables. The slowest item goes on first: rice starts first, chicken
      thighs go on next, and the frozen vegetables go on last, so all three
      finish within a few minutes of each other. Taste the rice before
      declaring it done, since a packet's stated time is a starting guess.
      Chickpeas, canned tomatoes, pasta, eggs, onion, and garlic are left
      over for a second meal, keeping the plan within the stated $12.
    </p>
    <h3>Poor solution</h3>
    <p>Cook the vegetables first, then the rice, then the chicken last, and eat whatever's ready when it's ready.</p>
    <h3>Examiner's notes</h3>
    <p>
      Reversing the cook order — as the poor answer does — is the most
      common failure at this station: it produces overcooked vegetables and
      undercooked chicken at the same moment, rather than three items
      finishing together. Full marks require the reasoning behind the
      order, not just the final dish.
    </p>
    <h3>Rubric — out of 30</h3>
    <table class="course-schedule">
      <thead><tr><th>Criterion</th><th>Marks</th></tr></thead>
      <tbody>
        <tr><td>Names one protein, one starch, one vegetable</td><td>10</td></tr>
        <tr><td>Orders cooking slowest-to-fastest, with reasoning</td><td>10</td></tr>
        <tr><td>Stays within the stated $12 budget</td><td>5</td></tr>
        <tr><td>Includes tasting before declaring the dish done</td><td>5</td></tr>
      </tbody>
    </table>
    <table class="course-schedule">
      <thead><tr><th>Band</th><th>Marks</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>HD</td><td>27–30</td><td>Complete meal, correct cook order with reasoning, within budget, and includes the taste step.</td></tr>
        <tr><td>D</td><td>21–26</td><td>Complete meal, correct cook order with reasoning, and within budget, but omits the taste step.</td></tr>
        <tr><td>C</td><td>15–20</td><td>Names a complete meal but does not justify the cook order.</td></tr>
        <tr><td>P</td><td>9–14</td><td>Meal is incomplete, or the cook order is reversed without noticing the consequence.</td></tr>
        <tr><td>N</td><td>0–8</td><td>Does not select a complete meal and gives no cook order.</td></tr>
      </tbody>
    </table>
  </details>
  ```
- **Refactor:** None expected.
- **Acceptance criteria:** `pnpm test` passes, including all four new Station 5 `it` blocks.
- **Human review:** Same bar as Task 2.
- **Depends on:** Task 1.
- [x] Done — human review accepted after two rounds of feedback on
  2026-09-18 (cooking made explicit in the question itself, then a note
  added that cooking materials and a kitchen area are provided).

### Task 7: Link the practice paper from the real final exam page

- **Description:** Add exactly one new line to `final-exam.md` pointing to
  the practice paper, and a test confirming the link exists and that no
  scenario/solution content has leaked onto the real exam page.
- **Files touched:** `src/content/assessments/final-exam.md`,
  `spec/assessment-scheme.test.ts`.
- **Tests first (red):** Add to the existing `describe("final exam", ...)`
  block in `spec/assessment-scheme.test.ts` (after the last existing `it`,
  following line 298's closing brace):
  ```ts
  it("links to the archived practice paper without duplicating its content", () => {
    expect(html).toMatch(/href="[^"]*\/assessments\/final-exam\/practice-exam\/"/);
    expect(html).not.toMatch(/Model solution/);
    expect(html).not.toMatch(/chicken thighs/);
  });
  ```
  Run `pnpm test` — fails (no such link exists yet on the real exam page).
- **Implementation (green):** Add one line to
  `src/content/assessments/final-exam.md`, at the very end of the file
  (after the existing closing sentence "Breaking any of the above is
  academic misconduct."):
  ```md

  An archived practice paper from a previous sitting is available for
  revision: [the archived practice paper](/assessments/final-exam/practice-exam/).
  ```
- **Refactor:** None expected.
- **Acceptance criteria:**
  - `pnpm test` passes, including the new link test.
  - `grep -c "chicken thighs\|Model solution\|Poor solution" src/content/assessments/final-exam.md`
    returns `0` (confirms no scenario/solution content leaked onto the real
    exam page).
- **Human review:** None needed — the added line is a single factual
  pointer sentence, mechanically checkable via the link-presence and
  content-absence assertions above.
- **Depends on:** Task 1 (the link target must exist for the href to be
  meaningful, though the test only checks the `href` string, not that the
  target 200s — build-time link checking, if any, is out of scope for this
  plan).

## 6. Feature-level Definition of Done

- [ ] Every task in §5 complete and its tests passing
- [ ] `pnpm test` passes
- [ ] `pnpm check` passes
- [ ] Manually verified: `/assessments/final-exam/practice-exam/` loaded at
  1920×1080 and 390×844 — golden path (read a question, open its
  `<details>`, read model/poor solutions and rubric) and edge case (all
  five `<details>` elements open independently without layout breakage)
  both exercised
- [ ] Every requirement in §2 is covered — see §7
- [ ] Every task with a `Human review:` line (Tasks 1–6) has been shown to
  the user and explicitly accepted — not inferred, not just its acceptance
  criteria passing
- [ ] No item remains in §8

## 7. Requirements coverage check

| Requirement | Covered by |
| --- | --- |
| 2.1.1 | Task 1 |
| 2.1.2 | Task 1 |
| 2.1.3 | Task 1 |
| 2.1.4 | Tasks 2–6 |
| 2.1.5 | Tasks 2–6 |
| 2.1.6 | Task 7 |
| 2.1.7 | Task 1 (standalone route, not a collection entry — verified structurally in §3/§4) |
| 2.1.8 | Tasks 1–6 (content drafted against the verbatim `BANNED_TERMS` list; enforced automatically by the pre-existing `spec/voice.test.ts` on every `pnpm test` run) |

## 8. Risks / open questions

None.
