# SLOP1521 Lab activities: collaborative, timed-block enrichment of all 12 Labs

- **Date:** 2026-09-14
- **Status:** Draft
- **Approved by user:** yes — 2026-09-14

## 1. Problem / intent

The user supplied `prompts/lab-activities-all-weeks.md`, a fully-specified
set of in-Lab activities for all 12 teaching weeks, written to make each Lab
feel like something that could actually run at a university: timed blocks,
named group/pair sizes, concrete props and case studies, and a standing
policy (no laptops or screens in any Lab). The site's existing Lab content
(`src/content/sessions/week-01.md` … `week-12.md`) already covers similar
ground but far more tersely — a paragraph each under "Before the Lab" / "In
the Lab" / "Afterwards", no timed structure, no explicit group/pair
mechanics, no discussion/presentation phase. The user wants the doc's
material folded into these existing files so the Labs read as more complete,
involving, and collaborative, while staying simple to read and keeping every
Lab's concepts already covered by that week's lecture (continuity, not new
topics).

## 2. Requirements

### 2.1 Functional requirements

1. **R1.** No new content collection, route, or component. "Lab" already
   is `src/content/sessions/*.md`; all changes land in the existing 12
   files plus `src/pages/sessions/index.astro`.
2. **R2.** Every session file keeps its existing frontmatter shape
   (`title`, `description`, `week`, `date`, `teachers`, `spec`, `related`)
   and its existing three body headings in order: `## Before the Lab`,
   `## In the Lab`, `## Afterwards`. `description` and `spec` may be
   reworded for accuracy against the richer body, but must keep naming the
   same underlying deliverable(s) they name today (see R7).
3. **R3.** `## In the Lab` carries a standing markdown table, identically
   shaped across all 12 weeks (rows: opening framing, Activity 1,
   presentation/discussion of Activity 1, Activity 2, debrief of Activity
   2, wrap-up), with only the Activity 1/2 cells naming that week's
   specific activity and group/pair size. Below the table, prose in the
   site's existing deadpan voice unpacks each activity concretely: props,
   case-study text, roles, what's produced.
4. **R4.** `## Before the Lab` and `## Afterwards` are enriched with the
   doc's framing/wrap-up material but must preserve every existing forward-
   or back-reference already present in that week's file today (e.g. week
   2 → week 1's nominated area; week 4 → week 2's schedule; week 5 → books
   the Assignment 2 outing; week 6 → "report back next Lab"; week 10 →
   Assignment 3; week 12 → dry run of Assignment 3 + exam station).
5. **R5.** `src/pages/sessions/index.astro` gains one plain sentence
   stating the no-laptops/no-screens-in-Lab policy, stated once, not
   repeated per week.
6. **R6.** All new prose passes the existing `spec/voice.test.ts`: no
   banned CS/technical-metaphor terms, no banned framing phrases, no
   gendered terms (Week 9 stays neutral — "someone you'd message", not
   "girlfriend/boyfriend/the girl or guy you like").
7. **R7.** Where the doc's activities don't 1:1 match an existing week's
   already-established graded deliverable (notably Week 9, see §5), the
   existing deliverable is preserved and the doc's activities are folded in
   around it, not substituted for it.
8. **R8.** Week 4 keeps exercise as a co-equal deliverable alongside sleep
   (existing `spec:` requires both a sleep schedule *and* a named-frequency
   exercise plan); the doc's Week 4 material, which under-specifies
   exercise, is extended to keep this explicit.
9. **R9.** Week 11 uses "Behavior" (US spelling) throughout, matching the
   site's existing lecture and Lab titles for that week.
10. **R10.** Week 3's ranking activity, which the doc specifies via actual
    outfit photographs, is implemented as prose descriptions of the five
    outfits (no image assets are sourced or generated).

### 2.2 Non-functional requirements

None beyond project defaults (voice/format tests already in place, per R6;
`pnpm check` must stay green).

### 2.3 Out of scope

- No changes to `src/content/lectures/*`, dates/scheduling, or any test
  file (`spec/weekly-structure.test.ts` and `spec/voice.test.ts` already
  enforce everything this feature needs to satisfy).
- No new pages/routes for labs.
- No literal image assets for Week 3.
- No change to the `spec:` frontmatter's role as a grading checklist beyond
  wording accuracy (R2) — it is not being restructured to enumerate every
  sub-activity.

### 2.4 Assumptions (confirmed)

- The no-laptops policy is a genuinely new standing fact, not something
  that needs to reconcile against an existing policy elsewhere — confirmed
  with the user.
- Week 4 and Week 11 naming mismatches between the doc and the existing
  site content are resolved per R8/R9 — confirmed with the user rather than
  left for `plan-feature` to re-litigate.
- A literal timing table (clock times, not just relative order) is the
  wanted format, even though it's a bigger tonal shift from the site's
  current prose-only Lab pages — confirmed with the user.

## 3. Existing context

- `src/content.config.ts` — `sessions` collection schema: `week`, `date`
  (coerced), `teachers` (optional `people` refs), `.loose()` (allows the
  existing `spec`/`related`/`description`/`title` fields as passthrough).
- `src/content/sessions/week-01.md` … `week-12.md` — current Lab bodies,
  read in full; all 12 already exist, are already dated Thursdays per
  `TEACHING_DATES` in `spec/weekly-structure.test.ts`, and already carry a
  `spec:` checklist and a `related: [lectures/week-NN]` link.
- `spec/weekly-structure.test.ts` — enforces heading order
  (`Before the Lab`/`In the Lab`/`Afterwards`), non-empty `spec:` per
  session, one session per week 1–12, Thursday dating. No length minimum
  on Lab body sections (unlike the lecture Case Study's ≥80-char check), so
  the timing table + prose has no test-imposed length constraint.
- `spec/voice.test.ts` — banned CS/technical-metaphor terms, banned framing
  phrases ("taught as", "framed as", etc.), banned gendered terms. Applies
  to every rendered content page including sessions.
- `src/pages/sessions/index.astro` — Labs overview page; currently one
  paragraph describing what a Lab is in general, no policy statement yet.
- `plans/2026-09-09-slop1521-lecture-lab-polish.md` and its paired spec —
  already-implemented prior work on lecture/Lab title formatting and
  listing tables; unrelated to this feature but confirms the `sessions` =
  "Lab" mapping is deliberate, established, and not to be duplicated.
- `prompts/lab-activities-all-weeks.md` — the source material for this
  feature, already written with visible awareness of the existing site
  content (several lines are near-verbatim matches of existing session
  text, e.g. "This is a rehearsal for Assignment 1, not the submission").

## 4. Design

Each of the 12 session files is edited in place. Shape:

```markdown
## Before the Lab

<existing continuity reference, lightly extended with the doc's framing>

## In the Lab

| Time | Block |
| --- | --- |
| 0:00–0:05 | Framing: <last week's callback>, this week's topic |
| 0:05–0:20 | Activity 1 (<size>): <name> |
| 0:20–0:30 | Presentation / discussion of Activity 1 |
| 0:30–0:45 | Activity 2 (<size>): <name> |
| 0:45–0:55 | Discussion / debrief of Activity 2 |
| 0:55–1:00 | Wrap-up |

<prose: what Activity 1 concretely involves — props, case study text,
roles — and what the class discussion surfaces>

<prose: what Activity 2 concretely involves, and what its debrief covers>

## Afterwards

<existing forward/back reference to assignments, preserved, plus the doc's
wrap-up/look-ahead line where the file doesn't already have one>
```

**Alternative considered:** keeping the doc's original prose-only,
non-tabular format (matching the site's current terse style exactly) was
the default recommendation, but the user explicitly chose to keep a literal
timing table — accepted as a deliberate tonal shift toward "a real running
order," which is still compatible with the site's deadpan register (it's
information, not a joke that needs to land).

**Week 9 reconciliation (R7):** the existing deliverable — draft an opening
message, cut it to one answerable question, test it against a peer's honest
reaction — is kept as the graded activity (Activity 2, pairs). The doc's
group activity (editing the 600-word message down as a class) becomes
Activity 1, a warm-up that motivates *why* editing down matters before pairs
do it for real. The doc's "reading between the lines" three-exchange
exercise is folded into the Activity 1 discussion/debrief as supporting
material rather than a third graded activity, keeping one clear deliverable
per week.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | gap | New "Lab" content collection vs. existing `sessions` | `sessions` already is "Lab" (UI-relabeled); confirmed via codebase read, no new collection |
| 2 | contradiction | Week 4 title/spec ("Sleep, Health, and Exercise", requires both sleep + exercise deliverables) vs. doc's lighter exercise treatment | Exercise kept as explicit co-equal deliverable (R8) |
| 3 | contradiction | Week 11 spelling: site "Behavior" vs. doc "Behaviour" | Site's existing US spelling kept (R9) |
| 4 | gap | Doc's Week 3 activity needs real outfit photographs; site has no image-sourcing pipeline | Outfits described in prose instead (R10) |
| 5 | gap | Week 9 doc activities don't map 1:1 onto the existing graded deliverable | Existing deliverable kept as Activity 2; doc's group activity becomes Activity 1 warm-up (§4) |
| 6 | ambiguity | Whether to render the doc's minute-by-minute timing literally, or as prose-only like existing Labs | User explicitly chose to keep the literal timing table |
| 7 | assumption | No-laptops policy might need to reconcile with an existing policy elsewhere on the site | Confirmed as a new standing fact, stated once on the Labs overview page, no reconciliation needed |
| 8 | gap | Gendered language in the doc's Week 9 material ("someone you like") vs. `spec/voice.test.ts`'s banned-term list | New prose stays neutral throughout (R6) |

## 6. Handoff notes for planning

- This is pure content authoring across 12 markdown files + 1 Astro page
  edit — no schema, component, or test changes are needed. `plan-feature`
  should scope tasks per-week (or in small batches) rather than as one
  monolithic edit, so `pnpm check` (including `spec/weekly-structure.test.ts`
  and `spec/voice.test.ts`) can be run incrementally and each week committed
  as its own unit of work, per this repo's commit convention in
  `CLAUDE.md`.
- Source material for all 12 weeks' activities is
  `prompts/lab-activities-all-weeks.md` in full — treat it as
  "fully specified, ready to use directly" per its own header, modulo the
  resolutions in §5.
- Verify rendered output with `agent-browser` at both marking viewports for
  at least one representative Lab page (the timing table is the one truly
  new visual element), per `CLAUDE.md`'s working method.
- Do not re-litigate the table-vs-prose format decision (row 6 above) or
  the Week 4/9/11 resolutions (rows 2, 3, 5) — already settled here.
