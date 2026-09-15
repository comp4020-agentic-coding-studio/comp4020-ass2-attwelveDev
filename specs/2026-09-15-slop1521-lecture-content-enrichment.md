# SLOP1521 Lecture Content Enrichment

- **Date:** 2026-09-15
- **Status:** Draft
- **Approved by user:** yes — 2026-09-15

## 1. Problem / intent

The 12 SLOP1521 lecture pages currently carry only a few thin lines per
section (a short paragraph for Overview, 3-5 unadorned bullets for Content,
a short paragraph for Case study, one or two sentences each for Reflection
and Assessment tie-in). The user has written a full week-by-week content
plan (`prompts/lecture-content-plan-all-weeks.md`) — hooks, deadpan
definitions, 2-4 cited body key points each with a check-in question, an
in-lecture activity, a proper conclusion, and per-week references — modelled
on the same depth the Labs (`sessions` collection) already reached in a
recent enrichment pass. The user wants every lecture brought up to that
plan's content in full, wants gaps in the plan filled with more of the same
CS-stereotype-driven material, and wants build-out of the site's slide-deck
system (`astromotion`/Reveal.js, currently only built for Week 1) so the full
depth lives in the decks while the lecture pages themselves stay brief,
structured summaries.

## 2. Requirements

### 2.1 Functional requirements

1. Replace the five-slot lecture contract (`Overview, Content, Case study,
   Reflection, Assessment tie-in`) with a new one: `Introduction, Definitions,
   Body, In-lecture activity, Conclusion` — same position, same
   "same shape every week" enforcement, new names and content per
   `prompts/lecture-content-plan-all-weeks.md`'s own top-level structure.
   Update `CLAUDE.md`'s "The weekly structure" course rule to describe the
   new shape.
2. `spec/weekly-structure.test.ts`'s heading-order assertion is updated to
   the new five headings, in order, for every lecture. The existing
   `"gives every lecture a named case study"` assertion (≥80 chars) is
   replaced with an equivalent minimum-substance check against the new Body
   section (case study content now lives inside Body's key-point examples,
   not its own slot).
3. Every lecture's rewritten body follows the plan's per-week content
   (hook/context/scope/signpost/motivation condensed into Introduction;
   plain deadpan definitions; 2-4 body key points each with an argument, an
   example drawn from the Labs' case studies wherever the plan does so, a
   citation, and a check-in question; the plan's in-lecture activity;
   Conclusion's summary/significance/aims-met/coming-up/thanks). Pages stay
   brief — condensed summaries, not the plan's full prose — since full
   depth moves to the matching slide deck.
4. Where the plan is thin, has a gap, or a section could be richer while
   staying inside the CS-mundane-stereotype voice (see `spec/voice.test.ts`
   and `CLAUDE.md`'s Register and voice rule), add more content — additional
   check-in-question framing, a sharper example, a fuller Conclusion — in
   the same voice, without introducing any technical-metaphor language the
   banned-term list would catch.
5. Add a new `citations: [{ text: string, note?: string }]` field to the
   `lectures` collection schema in `src/content.config.ts`. Every lecture's
   frontmatter carries its week's full citation list from
   `prompts/lecture-content-plan-all-weeks.md` (formatted citation string,
   plus an optional one-line note — e.g. the effect size or finding —
   where the plan states one).
6. Add a References-rendering component that every lecture page appends
   below Conclusion, driven by that lecture's `citations` array — appended
   by the page template itself, not authored as a markdown heading, so it
   is not part of the five-heading order test but is its own always-present
   check.
7. Add a new `/references` page that aggregates every lecture's `citations`
   array into the course-wide bibliography list
   (`prompts/lecture-content-plan-all-weeks.md`'s "Full citation list"
   section), including its explicit note that the Warren & Warren Tyagi
   source is a trade book, not a peer-reviewed paper.
8. Add three small dedicated components for structured, Labs-like page
   content: a glossary/definitions block (for the Definitions slot), a
   check-in-question callout (one per Body key point), and a matching
   styled block for the in-lecture activity — consistent visual treatment
   across all three, in both light and dark themes.
9. Update `src/lib/topics.ts` (and `spec/treatment.test.ts`'s topic-chip
   test, currently hardcoded to "week 4 has 4 Content bullets") to parse
   the new Body section's key points (their bold lead-in titles) instead of
   the old Content section's plain bullets, and to match the new key-point
   count per week as the rewritten content actually has it.
10. Update `spec/voice.test.ts`'s F4 check (no framing phrases in "any
    lecture's Overview section") to target the new Introduction section
    instead.
11. Preserve the still-relevant existing structural checks without
    modification: `spec/weekly-structure.test.ts`'s per-week scheduling/
    coverage checks, the Week 9 gendered-language check, and the Week 12
    "closes the loop" check (must still mention the fridge and sock pile —
    the plan's Week 12 content already calls both back).
12. Build a slide deck (`src/decks/week-02.deck.mdx` through
    `week-12.deck.mdx`) for every week that doesn't yet have one, following
    `week-01.deck.mdx`'s existing conventions (`{/* _class: impact */}`
    punch slides, tables for weighted/structured lists, `` ```notes ``` ``
    fences for facilitation asides, one idea per slide, short phrases over
    paragraphs, captioned images/charts where they help). Decks carry the
    plan's full depth (complete hook, all definitions, all key points with
    full citation detail, the full in-lecture activity, full conclusion, a
    references slide) since the matching lecture page itself stays brief.
    Set each lecture's `slides: /decks/week-0N/` frontmatter to match.
13. Every new deck is verified visually before being considered done —
    both `agent-browser` at `1920x1080` and `390x844` per `CLAUDE.md`, and a
    run of astromotion's own `astromotion-check` CLI for slide overflow.
14. `pnpm check` stays green throughout.

### 2.2 Non-functional requirements

None beyond project defaults (voice/banned-term compliance per
`spec/voice.test.ts`, deadline-time formatting rules per `CLAUDE.md` — not
touched by this work since lecture `date` fields aren't changing).

### 2.3 Out of scope

- No change to the Labs (`sessions` collection) content or structure.
- No change to `WeekMeta.astro`'s spec-sheet (Week/Date/Lab/Reflection due)
  rendering or its underlying date computation.
- No fully structured citation fields (authors/year/venue/volume/pages) —
  citations are a formatted string plus an optional note, not a rigid schema.
- No reverse linking from a deck back to its lecture (decks remain a
  file-based, one-way-linked system, unchanged from how Week 1 already
  works).
- No changes to assessment due dates, weights, or any other
  already-existing course content outside the 12 lectures and their decks.

### 2.4 Assumptions (confirmed)

- Case study stops being its own top-level slot; its content lives inside
  Body's key-point examples instead, matching how the plan itself treats
  case studies. Confirmed with the user.
- Reflection-due and assessment-tie-in content (e.g. "Assignment 1 due
  Friday") fold into Conclusion's "coming up" line as the plan already
  writes it, rather than surviving as their own headings; the Reflection-due
  *date* itself keeps rendering separately via `WeekMeta.astro`, which reads
  the `date` field directly and isn't affected. Confirmed with the user.
- The check-in-question and in-lecture-activity elements get the same
  "dedicated component" treatment as Definitions, for visual consistency,
  rather than only Definitions getting a component and the others staying
  plain paragraphs. Confirmed with the user (extension of their "add small
  dedicated components" answer).
- Slide decks are in scope for this pass, not deferred to later work.
  Confirmed with the user.

## 3. Existing context

- `src/content.config.ts` (lines 63-76): `lectures` collection schema,
  currently `.loose()` with no typed field for citations, definitions,
  check-ins, or activities — the five-slot shape is a pure markdown-heading
  convention with no schema backing.
- `src/content/lectures/week-01.md` … `week-12.md`: current thin content,
  one file per week, headings `## Overview`, `## Content`, `## Case study`,
  `## Reflection`, `## Assessment tie-in`.
- `src/pages/lectures/[slug].astro`: renders `WeekMeta`, an optional
  "Open the slides" button (from `lecture.data.slides`), the raw rendered
  `<Content />` markdown body, `TeachingTeam`, `RelatedContent`.
- `src/components/LecturesGrid.astro` + `src/lib/topics.ts`: the schedule
  table's Topics column regex-parses `## Content`'s bullet list into one
  chip per bullet — a real structural dependency that must move to `## Body`.
- `spec/weekly-structure.test.ts`: enforces the five headings in order (via
  regex over built HTML), a ≥80-char Case-study-section check, one
  lecture/lab per week 1-12, the hardcoded `TEACHING_DATES` scheduling
  table, and a Week 12 `/desk/i` + `/sock/i` "closes the loop" check.
- `spec/treatment.test.ts`: the spec-sheet `<dt>` checks (Week/Date/Lab/
  Reflection due — independent of markdown headings, unaffected by this
  work), lecture↔lab cross-linking, and the hardcoded "week 4 has 4 topic
  chips" test that must be updated alongside the new Body content.
- `spec/voice.test.ts`: the banned systems/CS-metaphor term list checked
  against every rendered page; F3 (no `<code>` anywhere); F4 (no framing
  phrases on the homepage or in "any lecture's Overview section" — needs
  its target renamed to Introduction); F5 (Week 9 must avoid gendered
  relationship terms).
- `src/decks/week-01.deck.mdx` + `src/decks/theme.css`: the only existing
  deck, `.deck.mdx` format, `---`-separated Reveal.js sections, MDX-comment
  directives (`_class`, `_if`, `_id`, `_animate`, `@include`), fenced
  ` ```notes ``` ` / ` ```comment ``` ` blocks, Marp-style `![bg]`/`![qr]`
  images. Routed automatically by the `astromotion` Astro integration at
  `/decks/[...slug]` — decks are files under `src/decks/`, not a content
  collection, with no schema and no reverse link back to their lecture.
- `spec/deck.test.ts`: checks a lecture links a deck, that the built deck
  HTML actually exists at that path, that Week 1's deck isn't the
  astromotion starter placeholder, and that the thesis sentence
  ("Competence is a skill like any other...") appears in the built HTML —
  these checks generalise to any new deck with a `slides:` link.
- No citation/reference component, schema field, or page exists anywhere
  in the codebase today — this is new infrastructure, not an extension of
  an existing convention.
- Labs (`sessions` collection) enrichment precedent: one content-plan doc
  (`prompts/lab-activities-all-weeks.md`) → one plan (`plans/2026-09-14-
  slop1521-lab-activities.md`) → one spec (`specs/2026-09-14-slop1521-lab-
  activities.md`) → one foundational commit → one commit per week. This
  work follows the same shape.

## 4. Design

**Lecture markdown body** (per week): five headings in order —
`## Introduction`, `## Definitions`, `## Body`, `## In-lecture activity`,
`## Conclusion` — each condensed from the plan's full detail into a brief,
structured summary (the plan's full prose moves to the deck instead).
Definitions render via a new glossary component; each Body key point pairs
its argument/example/citation-reference with a check-in-question callout
component; the in-lecture activity gets its own small styled block. A
References section is appended by the lecture page template itself (not an
authored heading), rendering the lecture's `citations` frontmatter array.

**Schema** (`src/content.config.ts`, `lectures` collection): add
`citations: z.array(z.object({ text: z.string(), note: z.string().optional()
})).default([])`.

**New `/references` page**: reads every lecture's `citations` array via the
existing content-collection query pattern already used elsewhere in the
site, dedupes/aggregates into the plan's course-wide bibliography, with the
Warren & Warren Tyagi trade-book distinction preserved as its `note`.

**Alternative considered and rejected:** fully structured citation fields
(authors/year/venue/volume/pages) — rejected because it's real extra schema
and formatting work for content that's already fully formatted prose in the
plan, and a trade book (Warren & Warren Tyagi) doesn't fit a
journal-article-shaped schema cleanly.

**Slide decks**: one `.deck.mdx` file per week 2-12, following
`week-01.deck.mdx`'s conventions, carrying the plan's full per-week depth.
Each lecture's `slides:` frontmatter is set to match, wiring up the
existing "Open the slides" button and schedule-table icon link with no
further code changes needed (per the existing Week 1 precedent).

**Commit sequence**: one foundation commit (schema, `CLAUDE.md` rule
update, `spec/weekly-structure.test.ts` + `spec/treatment.test.ts` +
`spec/voice.test.ts` rewrites, `topics.ts` update, the three new components,
the new `/references` page) — then one commit per week bundling that week's
lecture markdown rewrite and its new slide deck together, since they're the
same unit of work sourced from the same plan section.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | contradiction | The plan's own structure (Introduction/Definitions/Body/In-lecture activity/Conclusion/References) doesn't match the mandatory five-slot contract (Overview/Content/Case study/Reflection/Assessment tie-in) documented in `CLAUDE.md` and enforced by `spec/weekly-structure.test.ts`. | Replace the contract with the plan's own structure; integrate anything still relevant from the old slots (case study → Body examples, reflection/assessment-tie-in → Conclusion's coming-up line) into the new one. |
| 2 | gap | No schema, component, or convention exists anywhere for citations/references, though the plan wants full per-week citations plus a course-wide bibliography page. | New `citations: [{text, note?}]` frontmatter field, a References-rendering component appended by the page template, and a new `/references` aggregate page. |
| 3 | gap | `spec/treatment.test.ts` hardcodes "week 4 has 4 topic chips," parsed from `## Content` bullets by `src/lib/topics.ts` — both the heading name and the plan's actual Week 4 key-point count (3, not 4) conflict with this. | Update `topics.ts` to parse `## Body`'s key-point bold lead-ins, and update the hardcoded test count to match the rewritten Week 4 content. |
| 4 | ambiguity | Should Definitions/check-in questions/in-lecture activity be literal structured content (like Labs' tables/named activities) or flowing prose, and should new components be built? | Structured content, with three small dedicated components (definitions/glossary block, check-in callout, activity block) for consistent visual treatment — not just Definitions getting one while the others stay plain paragraphs. |
| 5 | ambiguity | Are slide decks (`/decks/week-NN/`, only Week 1 exists) in scope for this pass? | In scope — build weeks 2-12, full depth per the plan, using Week 1's existing `astromotion` conventions; verified at both marking viewports plus `astromotion-check`. |
| 6 | gap | Voice-test risk: the plan's cited-study summaries lean academic in register, and `spec/voice.test.ts` bans a list of systems/CS-metaphor terms across all rendered pages. | Carried forward as an existing, already-documented constraint (`CLAUDE.md`'s Register and voice rule) — no new decision needed, just something the content rewrite and deck-writing must actively watch for, especially in citation-summary prose. |
| 7 | gap | Week 9's gendered-language check and Week 12's fridge/sock-pile "closes the loop" check are existing hardcoded assertions that new content must keep satisfying. | No design change needed — the plan's own Week 9 and Week 12 sections already respect both; flagged so the rewrite doesn't accidentally drop the callbacks. |
| 8 | assumption | Citations could be a formatted string + note, or fully structured fields. | Formatted string (`text`) + optional one-line `note`, confirmed with the user — simpler, and avoids forcing the Warren & Warren Tyagi trade book into a journal-article-shaped schema. |

## 6. Handoff notes for planning

- Sequencing: the foundation commit (schema, `CLAUDE.md`, spec rewrites,
  `topics.ts`, new components, `/references` page) must land and pass
  `pnpm check` before any per-week content commit, since the per-week
  commits depend on the new heading contract, the new `citations` schema
  field, and the new components all already existing.
- Each per-week commit's lecture rewrite must be checked against the
  updated `spec/weekly-structure.test.ts` heading list, the new topic-chip
  parsing in `topics.ts` (chip count will change per week — check each
  week's actual new key-point count, not just Week 4), and
  `spec/voice.test.ts`'s banned-term list and Week 9 gendered-language
  check as it's written.
- Each per-week commit's new slide deck must be visually verified at both
  `1920x1080` and `390x844` via `agent-browser`, plus a run of
  `astromotion-check`, before being considered done — this is a real,
  per-deck manual/semi-automated step, not just a build-passes check,
  per `CLAUDE.md`'s existing "verify visual changes" rule and
  `spec/deck.test.ts`'s own acceptance history (Task 12 of the original
  curriculum plan noted the build "compiles every deck... nothing checks
  whether a slide fits or stays legible").
- Do not re-litigate: the five-heading replacement, the case-study
  dissolution into Body, the citations-as-formatted-string-plus-note shape,
  the three-component structured-content decision, or slide decks being
  in scope — all already decided above.
- `PROCESS.md`/`PROCESS_LOG.md` entries for any qualifying moments from this
  work should be logged as `CLAUDE.md` already directs — an operational
  detail for whoever executes, not a design decision made here.
