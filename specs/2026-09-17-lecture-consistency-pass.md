# Lecture/Lab/Assessment Consistency Pass

- **Date:** 2026-09-17
- **Status:** Draft
- **Approved by user:** yes — 2026-09-17

## 1. Problem / intent

SLOP1521's content violates its own implicit teaching order in multiple
places: labs and assessments introduce concepts, case studies, and specific
figures that no lecture ever taught first. Students are graded on things
they were never shown, and running gags ("the fridge", "Week 1's desk")
promise callbacks that don't exist. There is also a systemic gap where
lectures state a research finding (what/why) but never explain how to
actually do the thing, leaving procedural knowledge to be improvised in the
lab.

This pass (a) fixes every confirmed instance, (b) adds two durable rules to
`CLAUDE.md` so the failure mode doesn't recur, and (c) adds a mechanical
`spec/` check so the "introduced in lab before lecture" case-study version
of the problem is caught automatically rather than relying on manual
re-reads.

Source brief: `prompts/lecture-consistency-pass.md` (already in the repo;
every claim in it was independently re-verified against current file
contents before this spec was written).

## 2. Requirements

### 2.1 Functional requirements — CLAUDE.md rules

1. Add a **core rule**: every concept, named example, or case study must be
   introduced in a lecture (Definitions or Body, not just the deck) before
   it appears in that week's lab, a later week, or any assessment. Explicitly
   extends to two failure shapes: (a) an assignment mention in a lecture must
   show actual relevant rubric content, not a bare pointer; (b) a lecture's
   handoff to its own lab must describe what the lab does and how it builds
   on the lecture, not treat it as a black box.
2. Add a **standing rule**: every lecture needs a "how" for every concept —
   briefly on the lecture page, in real procedural detail (zero prior
   familiarity assumed) in the deck.

### 2.2 Functional requirements — mechanical check

3. Add `caseStudies: z.array(z.string().trim().min(1)).default([])` to both
   the `lectures` and `sessions` schemas in `src/content.config.ts`.
4. Populate `caseStudies` frontmatter (slug-style identifiers, e.g.
   `jordans-week`, `600-word-message`, `bad-email`, `fridge`, `desk-clutter`,
   `incident-report`, `sock-pile`, `reading-the-room`) on every lecture and
   lab that carries a named case study, matching identifiers between the
   week's lecture and its lab (and forward to later weeks/assessments that
   reuse the same identifier, e.g. `fridge` recurring in weeks 2/4/10/12).
5. Add `spec/case-study-provenance.test.ts`: for every session (lab), assert
   every identifier in its `caseStudies` array also appears in that week's
   lecture's `caseStudies` array. Same spirit as `spec/voice.test.ts`'s
   banned-term list — a checkable proxy for the core rule's case-study
   clause, not a full semantic check of every concept.

### 2.3 Functional requirements — confirmed content fixes

6. **Week 1** — name all five recurring topics (hygiene, dress, sleep,
   conversation, money) in place of the vague reference. Add the "how" of
   habit-building using Gollwitzer (1999) implementation-intentions research,
   explicitly tied to the course's own "a plan needs a time, not an
   intention" line.
7. **Week 1** — add real desk/clutter content (a genuine case study, not
   filler) so Week 12's "Week 1's desk" callback becomes a true payoff. Tag
   both with a shared `caseStudies` identifier.
8. **Week 2** — add colour-separation to the laundry content (grounds
   Assignment 3's "Laundry: frequency and colour separation" rubric line).
   Also elaborate skincare beyond its current bare Definitions entry: add a
   real skincare key point (a concrete routine — cleanse, moisturise, SPF,
   frequency) to the lecture body and deck, satisfying both the "how"
   standing rule and Assignment 3's "Skincare" marking-table line (see
   requirement 17).
9. **Week 2 / 3 / 5 / 6 / 8 / 9 / 11** — add a real procedural "how" to each
   lecture body (brief) and deck (detailed), per requirement 2's standing
   rule. One procedure per flagged concept per week; see §3 for the specific
   concept in each week.
10. **Week 3** — add a Definitions entry for *Job interview* (brief, points
    to Week 11 for the full treatment); soften the lecture hook to
    acknowledge Week 11 covers interviews properly; add one weather-mismatch
    outfit example (occasion-correct, weather-wrong) to cover the
    "weather-appropriate attire" learning outcome; bring worked
    occasion-reading examples into the lecture body/deck so the CheckIn no
    longer presupposes lab-only photos the students haven't seen yet.
11. **Week 4** — add the sleep/exercise "how" (already covered by
    requirement 9's list). Present the full six-day "Jordan's Week" case
    study in the lecture/deck instead of a two-day teaser that punts to the
    lab. Add a real fridge beat (tagged with the shared `fridge` case-study
    identifier) so Week 10/12's "third appearance"/"weeks 2, 4, 10" claims
    are true.
12. **Week 5** — state the concrete "400-metre radius" figure in the
    lecture instead of "your usual radius" (grounds Assignment 2's brief).
13. **Week 7** — add a "reading the room" key point (diagnosing nonverbal
    social cues) to the lecture, grounding Final Exam Station 4 and the
    course's "recognise social cues" learning outcome, both currently
    lab-only.
14. **Week 8** — show the incident-report format directly in the lecture
    (not just "reuses the lab's format").
15. **Week 9** — the 600-word message must appear in the lecture in full,
    not just its first two sentences.
16. **Week 10** — add cooking as a lecture key point (grounds Final Exam
    Station 5). Add a cleaning-schedule key point (grounds Assignment 3's
    "Cleaning schedule" rubric line, currently ungrounded anywhere).

17. **Assignment 3** (`src/content/assessments/assignment-3-adulting.md`) —
    its "## The plan" bullet list (lines 43-69) is missing components for
    two lines that already exist in its own marking table: "Cleaning
    schedule" (weight 5) and "Skincare" (weight 4). Add a "Cleaning
    schedule" bullet (grounded by requirement 16's Week 10 addition) and a
    "Skincare" bullet (grounded by requirement 8's Week 2 elaboration) to
    "## The plan". This is a self-consistency bug in the assignment brief
    itself (marking table promises criteria the brief's own plan section
    never describes) rather than an instance of the core lecture-order
    rule, but was found while auditing the same requirement and folded in
    at the user's request.
18. **Week 11** — add meetings as a key point (third leg of the learning
    outcome "interviews, meetings, and written workplace communication").
    Show the full bad email in the lecture, not just an intro reference.
19. **Week 12** — change the reflections drop rule from "best 10 of 11,
    drop worst 1" to "best 10 of 12, drop worst 2" (a new Week 12 reflection
    prompt is added, assessed the same way as the others). The 15% Weekly
    Reflections weighting does **not** change — 10 counted entries either
    way. Update `src/content/assessments/weekly-reflections.md` and any
    lecture/lab text describing the current rule. The recurring "due every
    Tuesday" mechanism already in `weekly-reflections.md` needs no new
    per-prompt due date — Week 12's Tuesday (2027-05-25) is already inside
    the teaching calendar, so extending the described range from "weeks
    1–11" to "weeks 1–12" is a text change, not a schema/date change.

### 2.4 Functional requirements — one-off content/CSS fixes (not CLAUDE.md rules)

20. Style `.course-citation-note` distinctly from its citation (smaller or
    subtly differentiated, own line) — currently unstyled plain text
    appended inline.
21. Give the lectures overview page (`src/pages/lectures/index.mdx`) the
    same structure as the labs overview (how it runs, highlights,
    structure). Add a justification section to **both** overview pages,
    citing Freeman et al. (2014) on active learning.
22. Link the references page from the lectures page, with links back to
    each week's own lecture page from the references page.
23. Apply the core rule's assignment-mention extension concretely: Week 2's
    lecture and deck currently give a bare pointer to Assignment 1's rubric
    ("Assignment 1's rubric doesn't ask for a perfect routine, just one that
    survives a bad week" — `week-02.mdx:80-81`, `week-02.deck.mdx:73-79`) —
    replace with the actual relevant Assignment 1 criteria. Week 10's
    lecture and deck likewise bare-point at Assignment 3's budget criteria
    ("A preview of the budget component of the HD-band criteria" —
    `week-10.mdx:61-62`, `week-10.deck.mdx:68-70`) — replace with the actual
    budget rubric content from `assignment-3-adulting.md`.
24. Fix the pre-existing duplicate-heading bug in `src/decks/week-01.deck.mdx`
    (two slides both literally headed "Key point 3 — Staff and policies," at
    the file's current lines 75 and 84): split into two distinct key points
    — "Staff" and "Policies" — renumbering any subsequent key points in that
    deck accordingly. Unrelated to the core rule; folded in at the user's
    request since the file is already being touched for requirement 6.

### 2.5 Non-functional requirements

None beyond project defaults (voice/register rules in `CLAUDE.md` apply to
all new prose; `pnpm check` must stay green; visual changes verified with
`agent-browser` at both marking viewports per existing working method).

### 2.6 Out of scope

- Real photography for Weeks 2 and 3 ("Photos needed" item from the source
  brief) — flagged for the user to handle manually, not part of this plan.
- A full semantic check of every concept/terminology forward-reference
  across the course — the mechanical check (req. 3–5) only covers named
  case-study identifiers, matching the source brief's own scoping ("the
  core complaint... is checkable, not just reviewable by eye").
- Rewriting decks that already contain an adequate "how" — the deck-depth
  audit (req. 9) only touches weeks confirmed missing one (2, 3, 4, 5, 6, 8,
  9, 11); Week 1 and Week 4 were already separately confirmed and are
  covered by reqs. 6 and 11. Weeks 7, 10, 12 were audited and found
  adequate/exempt (Week 12 is an explicit no-new-content review week).

### 2.7 Assumptions (confirmed)

- Audit scope: a full manual re-audit of all 12 weeks was run (not just the
  source brief's list) — confirmed with user; results folded into §2.3
  above (reqs. 7, 10's photo-CheckIn clause, 11's Jordan's-Week/fridge
  clauses, 12, 13, 16's cleaning clause).
- Deck-depth: all 12 decks were audited for the "how" gap; only weeks with
  a genuine gap get new procedural content (not a wholesale rewrite of
  decks that already have one) — confirmed with user.
- Fridge/desk broken callbacks are fixed by adding the missing payoff
  content to the earlier week, not by removing the later week's claim —
  confirmed with user for both cases.
- `caseStudies` frontmatter field (new) is the mechanical-check vehicle,
  since no existing schema field captures named case studies structurally
  (verified by reading `src/content.config.ts` in full).

## 3. Existing context

- **Content shape:** `src/content/lectures/week-NN.mdx` (5 slots:
  Introduction, Definitions, Body, In-lecture activity, Conclusion),
  `src/content/sessions/week-NN.md` (labs, 3 slots: Before the Lab, In the
  Lab, Afterwards), `src/decks/week-NN.deck.mdx` (slide decks, separate
  render target from the lecture page, referenced via `slides` frontmatter),
  `src/content/assessments/*.md`, `src/course-config.ts` (learning
  outcomes), `spec/*.test.ts` (mechanical checks against `dist/`).
- **Schema:** `src/content.config.ts` — `courseNodeSchema` (from
  `astro-course-university/schemas`) provides `title, description, tags,
  related, links, spec, published, draft`; lectures add `week, date,
  teachers, slides, citations`; sessions add `week, date, teachers`. No
  existing field captures named case studies — confirmed by full read.
- **Citations:** rendered via `src/components/References.astro` and
  `src/pages/references/index.astro`, both emitting
  `<span class="course-citation-note">` with zero backing CSS anywhere in
  the repo (confirmed by repo-wide grep). `spec/references-page.test.ts`
  checks citation dedup/count — any new citations (Gollwitzer 1999,
  Freeman et al. 2014) will change that test's expected count and must be
  updated there.
- **Verified violations** (file:line evidence gathered by two research
  passes — see conversation for full detail): Week 1 topics/how, Week 3
  interview/weather/photos, Week 4 sleep-exercise-how/Jordan's-Week/fridge,
  Week 9 600-word message, Week 10 cooking, Week 11 meetings/email, Week 8
  incident report, plus new: Weeks 2/3/5/6/8/9/11 how-gaps, Week 1 desk,
  Week 7 reading-the-room, Assignment 3 cleaning/colour-separation,
  Assignment 2's 400m figure.
- **Working method (`CLAUDE.md`):** `pnpm check` must be green before
  pushing; visual verification at 1920×1080 and 390×844; never hand-edit
  generated files; one commit per unit of work; `PROCESS.md`/`PROCESS_LOG.md`
  entries only for moments with a real "why the call beat the obvious one"
  — this pass likely qualifies for at least one entry (the mechanical
  check turning a manual-review rule into an automated one).

## 4. Design

New `CLAUDE.md` rules, final wording (already shown to and approved by the
user):

> **Core rule:** Every concept, named example, or case study must be
> introduced in a lecture — its Definitions or Body section, not just the
> deck — before it appears in that week's lab, a later week, or any
> assessment. A lab may reference or extend what the lecture already
> covered, but never introduce it first. This extends to two common failure
> shapes:
> - An assignment mention in a lecture must show the actual relevant rubric
>   content, not a bare pointer.
> - A lecture's handoff to its own lab must describe what the lab actually
>   does and how it builds on the lecture, not treat the lab as a black box.
>
> **Standing rule — how, not just what/why:** Every lecture needs a "how"
> for every concept it teaches — stated briefly on the lecture page, and in
> real procedural detail (zero prior familiarity) in the deck.

Citation styling, overview-page parity, and references-page linking (source
brief's former standing rules 4–6) are **not** written into `CLAUDE.md` —
they're one-off fixes (§2.4), not recurring principles worth enforcing going
forward. This was an explicit user correction to the initial design (which
had proposed all six as standing rules).

**Mechanical check** uses a new `caseStudies: string[]` frontmatter array on
both `lectures` and `sessions`, rather than fuzzy text extraction from prose
— slugs are exact-match, cheap to maintain, and extendable the same way
`spec/voice.test.ts`'s banned-term list is. Rejected alternative: parsing
case-study names out of markdown body text — too fragile against prose
rewrites, and named identifiers are naturally already distinct nouns/phrases
an author can slug by hand.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | gap | Source brief's list "may not be complete" — how far to audit? | Full manual re-audit of all 12 weeks run; surfaced 10+ new findings folded into §2.3 |
| 2 | ambiguity | How deep should the "how, not just what/why" deck rewrite go? | All 12 decks audited; only genuine gaps (2,3,5,6,8,9,11) get new content — not a wholesale rewrite |
| 3 | gap | Weeks 2/3 need "real, not placeholder" photos, which can't be produced in-session | Explicitly out of scope; flagged for user's manual follow-up |
| 4 | contradiction | Week 4 fridge promised but never delivered; Week 10/12 assert it was | Resolved by adding real Week 4 fridge content (not editing the later claims) |
| 5 | contradiction | Week 12's "Week 1's desk" callback references content that doesn't exist in Week 1 | Resolved by adding real Week 1 desk/clutter content (not removing the callback) |
| 6 | gap | Final Exam Station 4 ("reading the room") only ever taught in a Week 7 lab | Add the skill to Week 7's lecture |
| 7 | gap | Assignment 3's "cleaning schedule" and "colour separation" rubric lines are completely ungrounded | Add cleaning-schedule to Week 10, colour-separation to Week 2 |
| 8 | gap | Assignment 2 names a concrete "400-metre radius" the lecture never states | State the figure in Week 5's lecture |
| 9 | assumption | Mechanical check needs a concrete, checkable vehicle for "named case study" | New `caseStudies` frontmatter field (see §4), confirmed via full schema read — no existing field fits |
| 10 | over-scoping (user correction) | Initial design proposed 6 standing CLAUDE.md rules | User: rules 4–6 are one-off fixes, not standing rules; rules 2–3 are extensions of the core rule, not separate rules — CLAUDE.md now carries 2 rules total, not 6 |
| 11 | gap (found during plan-feature investigation) | Assignment 3's marking table has "Cleaning schedule" and "Skincare" lines never described in its own "## The plan" section — a self-consistency bug in the assignment brief itself, distinct from the core lecture-order rule | User: fix both in this pass (req. 17); also elaborate Week 2's skincare content beyond its bare Definitions entry into a real "how" key point (req. 8) |
| 12 | gap (found during plan-feature investigation) | No due date mechanism appeared to exist for a new Week 12 reflection prompt | Resolved without a decision needed — `weekly-reflections.md`'s existing recurring "due every Tuesday" mechanism already covers Week 12's Tuesday (2027-05-25), which is inside the teaching calendar; just a text-range change, not a new date field |
| 13 | pre-existing bug (found during plan-feature investigation) | `week-01.deck.mdx` has two slides both literally headed "Key point 3 — Staff and policies" | User: split into two distinct key points ("Staff", "Policies"), renumbering subsequent points; folded into req. 24 since the file is already being touched for req. 6 |

## 6. Handoff notes for planning

- This spans every lecture, lab, and deck file plus `content.config.ts`,
  `CLAUDE.md`, `weekly-reflections.md`, two CSS/styling changes, and two
  overview pages — `plan-feature` should sequence the schema change
  (req. 3) and `CLAUDE.md` rules (req. 1–2) before the week-by-week content
  passes that depend on them, per the source brief's own process note.
  Week-by-week content fixes are otherwise independent of each other and
  can run in any dependency-free order.
- Adding the `caseStudies` field is additive/optional-with-default — no
  existing content breaks until it's populated, so populating it can be
  folded into each week's own content-fix task rather than done as one
  giant separate pass.
- New citations (Gollwitzer 1999, Freeman et al. 2014) require updating
  `spec/references-page.test.ts`'s expected citation count/dedup logic —
  don't let that test go red silently.
- `pnpm check:evidence` / `PROCESS.md` citation rule: don't cite this
  work's commits until `pnpm check` passes on them.
- Verify all visual/content changes with `agent-browser` at 1920×1080 and
  390×844 per the project's working method, especially the new citation-note
  styling and the two rebuilt overview pages.
- Out of scope reminder: do not attempt to source or generate Week 2/3
  photos — that's explicitly deferred to the user.
