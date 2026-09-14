# Week 1 lecture: name the Critical / Monitor / Stable framework

- **Date:** 2026-09-14
- **Status:** Draft
- **Approved by user:** yes — 2026-09-14

## 1. Problem / intent

While executing `plans/2026-09-14-slop1521-lab-activities.md`, Week 1's Lab
was rewritten to run a "Triage" activity that sorts ten habit cards into
Critical / Monitor / Stable, feeding into a paired self-assessment
comparison. The corresponding Week 1 lecture
(`src/content/lectures/week-01.md`) currently names none of this — its
`## Content` section only says "what an honest starting inventory looks
like, and why week 1 takes one before anything is taught." The user wants
the lecture to introduce Critical / Monitor / Stable by name, as a
recurring rubric the course applies across the semester (not a one-off
Week 1 device for this one card exercise), with each tier actually
defined — and to mention the self-assessment lightly, without duplicating
the mechanical detail that belongs in the Lab.

## 2. Requirements

### 2.1 Functional requirements

1. Add exactly one new bullet to `## Content` in
   `src/content/lectures/week-01.md`, introducing "Critical / Monitor /
   Stable" as a rubric the course applies across the semester's five areas,
   not just this week — explicitly framed as recurring, not a one-off Week
   1 device.
2. That bullet defines what each of the three tiers means in this generic
   context (e.g. Critical: needs attention now; Monitor: not urgent, but
   worth tracking; Stable: fine as-is) — defined abstractly enough to apply
   across hygiene, dress, sleep, conversation and money, not tied to the
   Lab's specific ten habit cards.
3. The same bullet, or an adjacent new one, names the five areas explicitly
   (hygiene, dress, sleep, conversation, money) in connection with the
   self-assessment, briefly notes that honest scoring means scoring against
   your own actual behaviour rather than an ideal, and briefly notes the
   self-assessment feeds the nominated priority area — kept at
   summary/lecture level. The actual scoring mechanics, structure, and
   depth of the self-assessment exercise remain defined in the Week 1 Lab,
   not here.
4. `## Overview`, `## Case study` (the "your desk" case study), `##
   Reflection`, and `## Assessment tie-in` are left completely unchanged.
5. Frontmatter (`title`, `description`, `week`, `date`, `teachers`,
   `slides`, `related`) is left completely unchanged.
6. New prose passes `spec/voice.test.ts` in full (no `BANNED_TERMS`, no
   `FRAMING_PHRASES` in the Overview section — though this feature doesn't
   touch Overview — no `GENDERED_TERMS`).

### 2.2 Non-functional requirements

None beyond project defaults.

### 2.3 Out of scope

- Any change to the Week 1 Lab file
  (`src/content/sessions/week-01.md`) — a separate, already-identified
  correction (restructuring Activity 2 so the self-assessment is completed
  individually first, then discussed in pairs as its own step aligned with
  the "Discussion / debrief" timing block) is to be resumed under
  `plans/2026-09-14-slop1521-lab-activities.md`, not folded into this spec.
- Any change to any other lecture file.
- Any change to the Reflection prompt's wording (it already gestures at the
  same idea as the Monitor tier; the user confirmed leaving it as-is rather
  than forcing the label in).
- Any change to `## Case study`, `## Assessment tie-in`, or `## Overview`.
- Any claim, in this lecture, about how the framework is used in later
  weeks beyond naming it as recurring — no other week's lecture or Lab is
  edited by this feature.

### 2.4 Assumptions (confirmed)

- "The five areas" refers to the same five already named elsewhere in this
  lecture's `## Content` ("hygiene, dress, sleep, conversation and money")
  — confirmed by reading the existing file, not a new list.
- Editing `src/content/lectures/week-01.md` carries no risk to
  `spec/weekly-structure.test.ts`'s "closes the loop" check (which reads
  `dist/lectures/week-12`, not week-01) — confirmed by reading that test.

## 3. Existing context

- `src/content/lectures/week-01.md` — read in full (verified above).
  Frontmatter matches the shape used by every lecture; body has the
  standard five headings (`Overview`, `Content`, `Case study`,
  `Reflection`, `Assessment tie-in`) required by
  `spec/weekly-structure.test.ts`.
- `src/content/sessions/week-01.md` — the Week 1 Lab, already rewritten
  (in progress, under `plans/2026-09-14-slop1521-lab-activities.md`) to run
  a Triage activity (ten habit cards sorted into Critical / Monitor /
  Stable) and a Starting-point-check activity built on a five-area
  self-assessment. This is the origin of the "Critical / Monitor / Stable"
  and "self-assessment" language this spec's lecture edit needs to support.
- `spec/weekly-structure.test.ts` — enforces heading order
  (`Overview`/`Content`/`Case study`/`Reflection`/`Assessment tie-in`) and a
  ≥80-character Case study section per lecture; both already satisfied and
  untouched by this feature. Also has a "closes the loop" check reading
  `dist/lectures/week-12` for `/desk/i` and `/sock/i` — unaffected, since
  this feature only edits week-01.
- `spec/voice.test.ts` — banned-term/framing-phrase/gendered-term checks
  against every rendered content page; new prose must avoid all three
  lists, same as every other content edit in this repo.

## 4. Design

One new bullet (or two adjacent bullets) added to `## Content` in
`src/content/lectures/week-01.md`, after the existing four bullets. Shape:

```markdown
- a recurring rubric this course uses across all five areas all semester:
  Critical (needs attention now), Monitor (not urgent, but worth tracking),
  Stable (fine as-is)
- the starting self-assessment scores each of the five areas — hygiene,
  dress, sleep, conversation and money — honestly, against what you
  actually do rather than an ideal, and the result is what today's Lab uses
  to nominate this semester's first priority
```

Exact wording is left to implementation, subject to the requirements above
and the voice test.

**Alternative considered:** folding the framework into `## Overview`
instead of `## Content` was raised, but the user chose the Content-bullet
placement — it keeps `## Overview`'s existing "starting condition, not the
problem" framing untouched and treats the framework as informational
content alongside the lecture's other Content bullets, rather than
reshaping the Overview's tone.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | ambiguity | Where should the framework live in the lecture — Content, Overview, or both? | New Content bullet only (user's choice) |
| 2 | ambiguity | Is Critical/Monitor/Stable a one-off Week 1 device or a recurring rubric? | Recurring semester rubric (user's choice) — must be stated as such |
| 3 | gap | "More detailed self-assessment" was ambiguous about where the detail belongs | User clarified: the actual self-assessment mechanics/depth belong in the Lab, not the lecture; the lecture stays at summary level |
| 4 | gap | Should each tier (Critical/Monitor/Stable) be defined, or just named? | User required an explicit definition of each tier, generic enough to apply across all five areas |
| 5 | ambiguity | Should the existing Reflection prompt be reworded to use "Monitor" explicitly? | Left as-is (user's choice) — already gestures at the same idea |
| 6 | gap | This surfaced a separate, out-of-scope correction to the Week 1 Lab (self-assessment as its own step before paired discussion) | Explicitly out of scope here; carried forward as a note to resume under the Lab-activities plan, not this spec |

## 6. Handoff notes for planning

- This is a single-file content edit (`src/content/lectures/week-01.md`,
  `## Content` section only) — `plan-feature` can likely scope this as one
  task with a `Human review:` line, matching this repo's pattern for
  content-quality work that isn't mechanically checkable beyond
  `pnpm check`.
- Do not re-litigate: Content-bullet placement (row 1), recurring-rubric
  framing (row 2), self-assessment detail boundary (row 3), or leaving the
  Reflection prompt as-is (row 5) — all already decided here.
- The tier definitions (row 4) must actually be present, not just the tier
  names — the plan's acceptance criteria should check for this explicitly.
- The related, already-identified Week 1 Lab correction (self-assessment as
  its own step, discussed in pairs afterward) is separate follow-up work
  under `plans/2026-09-14-slop1521-lab-activities.md`, not this feature.
