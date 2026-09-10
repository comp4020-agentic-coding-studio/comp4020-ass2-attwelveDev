# Submission and exam conditions

- **Date:** 2026-09-11
- **Status:** Draft
- **Approved by user:** yes — 2026-09-11

## 1. Problem / intent

The course website has never stated how work actually gets submitted. The
user wants two independent additions:

1. A **paper-submission policy** for the four take-home items (Weekly
   Reflections, Assignment 1, Assignment 2, Assignment 3): submitted on
   paper, handed to the Convenor (at their office) or to a tutor. The course
   supplies blank paper continuously through the semester. Extenuating
   circumstances (accessibility needs, illness, travel, or absence from
   campus) permit email submission instead, with supporting documentation.
   This is in service of the course's existing satirical premise — separating
   CS students from their computers and making them physically go somewhere
   to hand work in — and is consistent with the device-free window already
   established in Week 6's Lab.
2. A self-contained **exam-conditions** section on the Final Exam page,
   unrelated to the paper-submission policy above (the exam is already
   in-person): permitted materials (black/blue pen only), a closed-book, no
   phones/smartwatches/other electronics/calculators rule, a no-talking rule
   except at Station 3 (Small Talk) where talking is compulsory, an official
   answer booklet for Stations 1–4's written answers, Station 5 (cooking)
   marked by observation with nothing written down, and a statement that
   breaking any of these rules is academic misconduct.

A reader should come away from the Policies page knowing exactly how and
where to submit take-home work, and from the Final Exam page knowing exactly
what they can bring and how the exam is conducted — both stated in the
course's deadpan-bureaucratic voice, no technical metaphor.

## 2. Requirements

### 2.1 Functional requirements

1. `src/pages/policies/index.mdx` gains a new **Submission** section,
   positioned between the existing **Attendance** and **Late work and
   extensions** sections, stating:
   - All four take-home items are submitted on paper, to the Convenor's
     office or to a tutor.
   - Blank paper is supplied continuously all semester through those same
     two channels.
   - The receiver dates and initials the submission on the spot; that
     timestamp is what the Late work policy uses.
   - Weekly Reflections are additionally sealed in an envelope regardless of
     drop point, preserving the existing "only your tutor reads it" promise.
   - Extenuating circumstances (accessibility needs, illness, travel, or
     absence from campus) permit email submission with supporting
     documentation, independently of the Late work/extension process (mode
     of submission, not timing).
   - An email submission with no documentation on file is not accepted —
     it falls under the existing "missed submission" clause.
   - This entire section does not apply to the Final Exam.
2. The existing **Late work and extensions** section gains one clause
   referencing the Submission section's timestamp mechanism ("the date
   recorded when it's handed in — see Submission above"). No other change
   to that section's existing content or claims.
3. `src/content/assessments/weekly-reflections.md` gains a short
   **Submission** note: paper, sealed envelope, either drop point, links to
   `/policies/` for the full policy.
4. `src/content/assessments/assignment-1-makeover.md`'s existing **What you
   submit** section is appended with: written portions on paper, the three
   outfit photos printed and physically attached, links to `/policies/`.
5. `src/content/assessments/assignment-2-touch-grass.md`'s existing **What
   you submit** section is appended with: the 1000-word report submitted on
   paper, links to `/policies/`.
6. `src/content/assessments/assignment-3-adulting.md` gains a short
   **Submission** note: the plan is one paper document, explicitly
   distinguished from the Wednesday-interview scheduling email (which
   remains as-is — that's correspondence, not the assessment submission),
   links to `/policies/`.
7. None of the four take-home assessments gain a new `spec:` frontmatter
   bullet for submission mode — it's a policy matter, not a marking
   criterion, consistent with how the existing Late work policy is handled
   today (global on Policies, not per-assessment spec).
8. `src/content/assessments/final-exam.md` gains a new **Exam conditions**
   section, placed after the existing **The five stations** section,
   stating: permitted materials (black or blue pen only), closed book, no
   phones/smartwatches/other electronic devices/calculators, no talking
   except at Station 3 (compulsory), an official answer booklet for
   Stations 1–4, Station 5 marked by observation only, and that breaking any
   of the above is academic misconduct.
9. `final-exam.md`'s frontmatter `spec` array gains one bullet reflecting
   materials compliance (e.g. "only permitted materials are brought into the
   exam"), matching the existing pattern of per-station spec bullets that are
   things an invigilator/marker actually checks.
10. The Policies page's existing **Academic integrity** section is left
    completely unchanged — the exam's misconduct clause is self-contained on
    the exam page only, not cross-referenced from Policies.
11. All new prose stays in the course's established voice: no technical
    metaphor, no banned terms from `spec/voice.test.ts`'s `BANNED_TERMS`
    list, no jargon wrapped in backticks/`<code>`.

### 2.2 Non-functional requirements

None beyond project defaults (existing `spec/` suite — particularly
`spec/policies.test.ts`, `spec/assessment-scheme.test.ts`, and
`spec/voice.test.ts` — must stay green; deadlines must remain rendering
correctly per `src/lib/dates.ts`'s UTC/local caveat, which this feature does
not touch).

### 2.3 Out of scope

- Any change to the exam's due date, week, or weighting.
- Any change to the four take-home assessments' due dates, weights, or
  marking criteria.
- Any change to `src/content.config.ts`'s schema (no new typed fields —
  everything here is prose plus one new `spec` bullet on the exam, which the
  schema already supports as a free-text array).
- Any change to the `role` enum or `people` content.
- A concrete physical location for paper pickup beyond "the Convenor's
  office or a tutor" (no new world-building geography, e.g. no invented
  stationery cupboard).
- Any UI/component change (no new `Callout` usage, since the four
  assessment content files are `.md`, not `.mdx`, and can't embed Astro
  components in their body).
- Any mechanism for actually verifying documentation for extenuating
  circumstances (who reviews it, what counts) — the policy states the
  allowance exists and requires documentation; adjudication process is not
  specified, matching the existing "referred to the Convenor for a
  decision" pattern used elsewhere on the Policies page.

### 2.4 Assumptions (confirmed)

- Reflections need stronger confidentiality treatment than the other three
  take-homes because of the Policies page's existing "your tutor reads what
  you submit... it stays there" promise — confirmed: sealed envelope,
  either drop point, resolves the tension without weakening the promise.
- Assignment 1's photo evidence needs an explicit paper-submission answer —
  confirmed: printed and physically attached, not carved out as a digital
  exception.
- Paper submissions need a stated timestamp mechanism to reconcile with the
  existing per-calendar-day late penalty — confirmed: dated and initialled
  by the receiver on the spot.
- The new email-for-extenuating-circumstances allowance and the existing
  short-extension-on-request policy are two different axes (how vs. when) —
  confirmed independent; an extenuating-circumstances email does not itself
  grant extra time.
- An email submission lacking documentation needs a defined outcome —
  confirmed: treated as a missed submission (existing clause), not accepted
  and not separately penalised.
- The exam's misconduct clause does not need a Policies-page
  cross-reference — confirmed: exam page only, per the user's original
  instruction.

## 3. Existing context

Read directly from the repository during this design:

- `src/content.config.ts` — `assessments` collection schema extends
  `courseNodeSchema` (from `astro-course-university/schemas`) with `week`,
  `due`, `weight`, optional `marking`; schema is `.loose()`, so arbitrary
  additional frontmatter (already used for `spec`, `related`) is accepted
  without a schema change.
- `astro-course-university/schemas.ts` — `spec` is documented as "the
  deliverable's contract... what markers check," some lines
  machine-checkable, most needing human judgement; confirms it's the right
  place for the exam materials-compliance bullet but the wrong place for
  take-home submission mode (a policy matter, not a marking criterion).
- `src/pages/assessments/[slug].astro` — renders `assessment.data.due`,
  `weight`, the markdown `Content`, `SpecList` (from the `spec` array), and
  `MarkingModel`. Confirms the assessment body is plain rendered markdown —
  no Astro component embedding available since content files are `.md`.
- `src/pages/policies/index.mdx` — read in full. Current section order:
  Attendance → Late work and extensions → Reflections → Academic integrity
  → (rule) → Content and disclosure. Late work section already says "Work
  submitted late without an extension loses 5%... per calendar day," which
  presupposes a submission timestamp that doesn't currently exist anywhere
  on the site.
- `src/content/assessments/weekly-reflections.md`,
  `assignment-1-makeover.md`, `assignment-2-touch-grass.md`,
  `assignment-3-adulting.md`, `final-exam.md` — read in full; confirmed none
  currently mention submission mode, location, or format anywhere (grepped
  for "submi", "hand in", "physically", "paper" across `src/content` and
  `src/pages` — only hits were the words "submitted"/"submit" used generically
  about assessment content, not delivery mechanism).
- `spec/policies.test.ts` — locks in specific phrases on the rendered
  Policies page (Content and disclosure heading, "not of the students,"
  "never read aloud," Week 9 optional). None of these are touched by the new
  Submission section; the new section must not remove or alter any of them.
- `spec/assessment-scheme.test.ts` — locks in per-assessment phrases (e.g.
  final exam: `Station 1`–`Station 5`, "10 minutes," "2 hours," "leave").
  The new Exam conditions section is additive and must not disturb these.
  Also confirms `spec` arrays just need `length > 0` — no per-line schema
  enforcement, so adding one bullet to `final-exam.md`'s `spec` is safe.
- `spec/voice.test.ts` — `BANNED_TERMS` list (technical-metaphor and jargon
  words to avoid) and `GENDERED_TERMS`/`FRAMING_PHRASES` checks apply to
  every rendered content page; new prose must avoid all of them.
- `src/content/sessions/week-06.md` — existing "device-free window" framing
  in a Lab, confirming the no-computers philosophy already has precedent
  elsewhere in the course, which this feature extends rather than
  introduces.

## 4. Design

**Two independent additions, no shared implementation:**

1. **Take-home submission policy** — full rule lives once, on the Policies
   page, as a new section between Attendance and Late work and extensions.
   Each of the four take-home assessment pages gets a short pointer/note
   (not a duplicate of the full policy) plus a link back to `/policies/`.
   Rejected alternative: duplicating the full policy text on all five pages
   — rejected as repetitive and a maintenance burden (five places to update
   if the policy ever changes), given the project's own instinct toward
   shared/canonical content (e.g. `SpecList`'s shared intro text).
2. **Exam conditions** — entirely self-contained on the Final Exam page as
   a new section, no cross-reference from Policies. Rejected alternative:
   adding a cross-reference sentence to Policies' Academic integrity section
   — rejected per explicit user instruction to keep exam rules on the exam
   page, and because exam-conduct misconduct is a materially different kind
   of violation from the data-fabrication concern that section currently
   addresses.

No component, schema, or test changes are part of this spec — everything is
prose content in existing `.md`/`.mdx` files, plus one `spec` array bullet
on the exam. `plan-feature` should still confirm whether any `spec/`
regression test should be *extended* to cover the new content (e.g. a
policies test asserting the Submission section exists, mirroring the
existing pattern in `spec/policies.test.ts`) — that's a planning decision,
not pre-decided here.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | contradiction | Policies page promises reflections are private to the tutor ("it stays there"); a convenor's-office paper drop-off cuts against that. | Reflections are sealed in an envelope regardless of drop point (office or tutor) — privacy preserved either way. |
| 2 | gap | Full submission policy text risked being duplicated across 5 pages. | Full detail lives once on Policies; each assessment page gets a short pointer + link. |
| 3 | gap | Assignment 1 requires photo evidence of three outfits; unclear how that works under a paper-only rule. | Photos are printed and physically attached to the paper submission. |
| 4 | gap | The existing 5%-per-day late policy needs a submission timestamp, which paper hand-in doesn't naturally provide. | Receiver (Convenor or tutor) dates and initials the submission on receipt; that's the timestamp. |
| 5 | ambiguity | Unclear whether the new extenuating-circumstances email exception also grants extra time, overlapping with the existing extension-on-request policy. | Confirmed independent: email exception changes submission mode only; timing extensions are requested separately as before. |
| 6 | gap | No stated outcome for an email submission sent without valid documentation. | Treated as a missed submission under the existing "missed submission, referred to the Convenor" clause — not accepted, not separately penalised. |
| 7 | ambiguity | Whether the exam's misconduct clause should be cross-referenced from the Policies page's Academic integrity section. | Kept exam-page-only, per explicit user instruction; Academic integrity section on Policies is left untouched. |
| 8 | gap | Assignment 3's interview-scheduling email ("email the Convenor to confirm a slot") could be misread as conflicting with "email is only for extenuating circumstances." | Assignment 3's new Submission note explicitly distinguishes the scheduling email (unchanged, still fine) from the plan's own submission (paper). |
| 9 | assumption | Whether submission mode belongs in each assessment's `spec` frontmatter array (the marking-criteria contract). | No — kept out of `spec` for the four take-homes, consistent with how the existing Late work policy is handled (global, not per-item spec). The exam's materials-compliance bullet is the one exception, added to `spec` because it matches the existing pattern of per-station checkable items there. |
| 10 | gap | Where supplied paper is physically available from wasn't specified in the original request. | Reused the same two existing channels (Convenor's office, tutor) rather than inventing new site geography. |

## 6. Handoff notes for planning

- This is content-only work across 6 files: `src/pages/policies/index.mdx`
  and the 5 files in `src/content/assessments/`. No schema, component, or
  route changes.
- `plan-feature` should decide whether to extend `spec/policies.test.ts`
  and/or `spec/assessment-scheme.test.ts` with new assertions covering the
  added sections (e.g. asserting the Policies page has a "Submission"
  heading, or that the exam page mentions "black or blue pen" /
  "misconduct") — this spec deliberately leaves that decision to planning
  rather than prescribing specific test additions.
- Must not touch: due dates/times, weights, marking criteria, `role` enum
  usage, or any of the specific phrases already locked in by
  `spec/assessment-scheme.test.ts` and `spec/policies.test.ts` (see §3).
- New prose must be checked against `spec/voice.test.ts`'s `BANNED_TERMS`
  before considering the work done — several draft phrases discussed in
  conversation (e.g. avoid describing the timestamp mechanism as a
  "protocol") were deliberately worded around this list.
- The final exam's new `spec` bullet is additive to the existing three-item
  array — order and existing bullets should be preserved, not rewritten.
