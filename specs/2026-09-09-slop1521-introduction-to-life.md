# SLOP1521 — Introduction to Life: Personal Systems Maintenance

- **Date:** 2026-09-09
- **Status:** Approved
- **Approved by user:** yes — 2026-09-09

## 1. Problem / intent

Assignment 2 asks for "the university course you wish existed, and the website
that runs it" — a whole course site for one niche course at Slop University,
marked 45% on legibility of process, 35% on response to the brief and 20% on
the working artefact. The deliverable is the deployed site: roughly twenty-odd
pages that have to agree with each other, since there is no separate curriculum
document and every course decision lands in the site.

The course is **Introduction to Life: Personal Systems Maintenance** (SLOP1521):
a compulsory-adjacent foundational course in the skills computer science culture
treats as optional — hygiene, sleep, dress, conversation, friendship, cooking,
money and professional conduct — delivered with the full institutional
seriousness of a real prerequisite.

Its thesis, pinned in `CLAUDE.md` and on the homepage:

> Competence is a skill like any other. CS culture just never taught you this one.

That sentence is what stops any given week from being "a joke about CS students"
and makes it a course. It blames the culture, never the student, and the whole
register follows from it.

## 2. Requirements

### 2.1 Functional requirements

Numbered against the published Assignment 2 spec (F1–F6) and the course design
(F7–F20).

1. **F1** Deployed and live at its public GitHub Pages URL by noon Mon
   21 Sep 2026, working at both marking viewports (1920×1080, 390×844).
2. **F2** One niche course at Slop University under a `SLOPxxxx` code retaining
   the three digits the repo arrived with (`521`), running across twelve dated
   teaching weeks.
3. **F3** At least one lecture carries a real deck, linked from its page.
4. **F4** Assessment adds up to exactly 100%.
5. **F5** Own checks in `spec/` protecting the promises the course makes that
   the build cannot; `pnpm check` and `pnpm check:evidence` both pass.
6. **F6** Evidence of process in the repo: `PROCESS.md`, `CLAUDE.md`, and a
   commit history that grew with the work.
7. **F7** Course record: `code: SLOP1521`, `level: 1`,
   `title: "Introduction to Life: Personal Systems Maintenance"` (50 chars),
   `session: "Semester 1"`, `year: 2027`, `startDate: 2027-02-22`,
   `endDate: 2027-06-19`, `tags: [life skills, wellbeing, self-management]`,
   and the description in §4.1 (205 chars).
8. **F8** Twelve **lectures** (Tuesday, theory) and twelve **Labs** (Thursday,
   practical), covering weeks 1–12 exactly once each — 24 dated teaching nodes.
9. **F9** `sessionLabels` is `{ singular: "Lab", plural: "Labs" }`; navigation
   reads Lectures · Labs · Assessment · People · Policies.
10. **F10** Every week 1–12 carries the same five slots, in this order, all
    filled: **Overview**, **Content**, **Case study**, **Reflection**,
    **Assessment tie-in** (the last may read "None this week", explicitly).
11. **F11** Five assessments totalling 100%, per §4.3, each carrying a
    `weighted` marking model whose criteria sum to 100 and a `spec:` list.
12. **F12** Weekly Reflections: eleven prompts (weeks 1–11 content, due 12:00
    Tuesday of weeks 2–12), lowest dropped, **ten counted × 1.5% = 15%**, with
    that arithmetic stated on the page. Week 12's prompt is set but ungraded and
    folded into Assignment 3.
13. **F13** Assignment 2's CS-discussion limit is **5 minutes**, and the page
    states that compliance is self-reported — the report is the evidence.
14. **F14** Assignment 3 carries the weighted rubric in frontmatter and band
    descriptors as a list in the body.
15. **F15** Four fictional cast members in the **School of Applied Competence**,
    all deadpan institutional professionals; both starter `people` entries and
    their `.avif` files replaced.
16. **F16** The policies page carries one plain-register **content and
    disclosure** section; everything else on it stays in character.
17. **F17** No lecture, lab, assessment or exam station ever breaks character.
18. **F18** The thesis sentence appears verbatim on the homepage and in
    `CLAUDE.md`.
19. **F19** Visual treatment per §4.6, within the fixed brand boundary in §3.2.
20. **F20** Hero artwork and social card replaced (`check:evidence` fails on
    the shipped placeholders).

### 2.2 Non-functional requirements

- Accessibility: `pnpm build` runs axe over every rendered page; it must stay
  green. Tables need `overflow-x` containers at 390px.
- Motion: state transitions only, 120–180ms, `prefers-reduced-motion` honoured.
- The generated API and `dist/` are build output — never hand-edited.
- Internal links must respect the base path (`/<repo>/`); no root-absolute
  `href` in `.astro` files.
- Verification is by `agent-browser` at both marking viewports; the render is
  the truth, not the source.

### 2.3 Out of scope

- `PROCESS.md` — the user writes it; only its existence and citations are
  checked here.
- The SlopU "programs and courses" page (the brief excludes it).
- Any change to the fixed platform: Slop branding and palette, the four content
  collections and their keys, the build pipeline, the generated API.

### 2.4 Assumptions (confirmed)

| Assumption | How confirmed |
| --- | --- |
| Lectures Tuesday, Labs Thursday, reflections due 12:00 Tuesday | Mine, to clear three public-holiday collisions computed in §3.3; presented and accepted |
| `endDate` covers the exam period, not teaching alone | User's explicit choice, accepting the semantic stretch |
| The user is **not** in the cast; credited in `PROCESS.md` and commits | User said "keep the people deadpan and choose institutional professionals"; flagged twice as my reading, uncorrected |
| A3's relative criterion weights are the agent's design | Explicitly delegated: "you can decide the weighting in a way that makes sense and still maximises the satire" |
| A serif heading face is a choice, not a platform constraint | Verified: `--at-font-body` and the full type scale are outside the fixed brand tokens (§3.2) |
| Twelve prompts was an over-count | Week 12's prompt would fall due in a week 13 that does not exist; resolved to eleven assessed |
| "Non-credit-bearing, entirely-credit-bearing" | User: "just an editing artefact… it's meaningless anyway" — dropped |

## 3. Existing context

Verified by reading this repo and its installed packages on 2026-09-09.

### 3.1 Schema constraints that shape the design

- `src/content.config.ts:6` — `week` is `int().min(1).max(12)` for `sessions`,
  `lectures` **and** `assessments`. Nothing can be tagged week 13.
- `spec/data-integrity.test.ts:36-38` — every `assessments.due` and every
  `sessions`/`lectures` `date` must fall within `startDate..endDate`.
  **Together these two are why the Final Exam needs `week: 12` plus an extended
  `endDate`; there is no other legal home for it.**
- `weightedMarking` (`src/content.config.ts`) enforces criteria summing to 100
  per assessment. Nothing enforces the total across assessments — that is F4,
  and it is ours to check.
- `assessments` carry an optional `spec:` array rendering as a fixed conditions
  list, and `weight` is `positive().max(100)`.
- `lectures.slides` must match `/^\/decks\/[a-z0-9-]+\/$/`.
- `people` requires `role` and a ≥40-char `description`; a `photo` forces
  `photoAlt`.
- `courseMeta` (`src/course-config.ts`): `title` ≤100, `description` 80–300,
  1–3 tags of 2–24 chars, and `level` must equal the code's first digit.
- Collection key = file = URL = API path = ref. Renaming one renames all four.
  A dangling `related:` ref fails the build.

### 3.2 The fixed/yours boundary (read from the packages)

**Fixed:** `astro-theme-slop/slop.css` supplies exactly three brand inks —
`--at-primary: #b97d1c` (lockup gold), `--at-secondary: #8a5c13` (bronze),
`--at-tertiary: #6b6154` (warm grey) — plus `--at-logo-offset-x`, the
lockup/crest/favicon SVGs and the Slop University name. The theme derives every
semantic colour token from those three via relative colour syntax.

**Ours:** `--at-font-body`, `--at-font-mono`, the full type scale
(`--at-font-size-h1`…`h6`, `base`, `sm`, `xs`), `--at-line-height`,
`--at-line-height-heading`, the spacing scale (`xs`…`2xl`),
`--at-content-width`, `--at-content-inset`, `--at-gutter`,
`--at-border-radius`, `--at-shadow-sm/md/lg`, `--at-border`, `--at-divider`,
`--at-bg`/`-alt`/`-elevated`, all six components in `src/components/`, and
site-wide CSS through `src/layouts/PageLayout.astro`.

Cascade layers are `at.tokens`, `at.base`, `at.components`; an unlayered rule in
the layout beats all three.

**Corrected in Phase 2** — the first read of this list was truncated. The theme
defines **87** `--at-*` tokens in `styles/tokens.css`. The four that matter most
to §4.6 and were missing above:

- `--at-heading: var(--at-primary)` — **headings are gold by default**.
  Retargeting this to `--at-text` is the single highest-leverage line in the
  treatment.
- `--at-content-width: 48rem` against `--at-font-size-base: 1.125rem` is ≈85ch;
  the ≈68ch target is ≈**38rem**.
- `--at-text`, `--at-text-secondary`, `--at-text-muted` — the body ink ramp,
  with WCAG-verified alpha values (see the comment at `tokens.css:100-107`).
- `--at-table-header-bg`, `--at-table-header-text`, `--at-table-stripe` — the
  rules-and-tables treatment styles these rather than inventing its own.

Also verified: **Roboto Mono is already wired** by the theme
(`index.ts:180`), so `--at-font-mono` resolves to a real loaded face and the
mono-glossary centrepiece needs no font work.

The theme's body font is **Public Sans** — the US Web Design System typeface,
already wired via `fontVariables: ["--font-public-sans"]`. The institutional
register arrives for free; the risk is decorating it away.

### 3.3 The teaching calendar (computed, not assumed)

The shipped placeholders already encode a twelve-week semester: `2027-02-22` is
a Monday, and with a two-week break after week 6, week 12 ends Fri `2027-05-28`
— the placeholder `endDate` to the day.

Weeks 1–6: Mondays 22 Feb, 1, 8, 15, 22, 29 Mar. Break: 5 and 12 Apr.
Weeks 7–12: Mondays 19, 26 Apr, 3, 10, 17, 24 May.

**Three public-holiday collisions**, which is why teaching is Tue/Thu:

- Good Friday 2027 = **Fri 26 Mar** — the Friday of week 5
- Easter Monday = **Mon 29 Mar** — the Monday of week 6
- ANZAC Day = Sun 25 Apr, observed **Mon 26 Apr** — the Monday of week 8

Australia/Canberra leaves daylight saving on 4 Apr 2027, so dated frontmatter
before that is `+11:00` and after it `+10:00`.

### 3.4 Starter content that must be replaced

`git grep STARTER_CONTENT` tracks fourteen fragments; `check:evidence` fails
while any remain: `src/course-config.ts`, both `assessments`, both `sessions`,
both `lectures`, both `people`, `src/decks/week-01.deck.mdx`,
`src/pages/policies/index.mdx`, and two in `src/pages/index.astro` (hero artwork
and the authored page). The shipped imagery is checked separately.

### 3.5 Reference material

The brief's own three (Calling Bullshit, How to Make (Almost) Anything, CS 007)
plus the user's calibration set: Justice (fixed weekly shape, varying content —
the model for F10), Wasting Time on the Internet (rigorous "how" course built on
a dismissed vice), Physics for Future Presidents (one framing device all
semester), Frosh 101 (real institutional precedent — and the reason broadness
was a live risk).

## 4. Design

### 4.1 Identity

```
code:        SLOP1521          level: 1
title:       Introduction to Life: Personal Systems Maintenance
session:     Semester 1        year:  2027
startDate:   2027-02-22        endDate: 2027-06-19
tags:        life skills, wellbeing, self-management
description: The maintenance of a human being, taught as systems engineering:
             scheduling, root-cause analysis and regression testing applied to
             sleep, hygiene, conversation and money. Assessed by practical
             examination.
```

The title pairs the institution's bland half with the absurd method, in the
shape a real ANU title takes. This is the fix for the broadness risk (§5, #14):
the course's niche was always the *method* — life skills taught as systems
engineering — and the station exam, but neither appeared in the title,
description or homepage, which is all a ten-minute read sees.

### 4.2 Weeks

Twelve lectures (Tuesday, theory) each paired with a Lab (Thursday, practical).
Weeks and titles are the user's, unchanged:

| Wk | Title |
| --- | --- |
| 1 | Orientation: Welcome to Life |
| 2 | Personal Hygiene and Maintenance |
| 3 | Fashion Fundamentals |
| 4 | Sleep, Health, and Exercise |
| 5 | Touching Grass 101 |
| 6 | Laptop and CS Separation |
| 7 | HCI Without The Computer |
| 8 | Friendship and Group Communication |
| 9 | Dating without documentation |
| 10 | Basic Adulting 101 |
| 11 | Workplace Behavior |
| 12 | Integration |

**The fixed five-slot structure (F10)** — the `CLAUDE.md` rule, enforced by a
`spec/` check so it cannot drift:

1. **Overview** — the week's thesis, 1–2 sentences
2. **Content** — 3–5 topics
3. **Case study** — a named artefact, examined
4. **Reflection** — the prompt, due next week
5. **Assessment tie-in** — or an explicit "None this week"

Six case studies come from the user's draft (weeks 1, 2, 4, 6, 8, 11). Six are
new, and two recurring datasets give the semester a spine — the desk setup is
seeded in week 1, the sock pile in week 2, both re-examined in week 12:

| Wk | Case study |
| --- | --- |
| 3 | The free conference t-shirt, worn to a wedding |
| 5 | The 400-metre radius — everywhere you have physically been this semester, mapped |
| 7 | The two-minute silence after "how was your weekend?", transcribed as a failed handshake |
| 9 | The 600-word opening message, shown in full (pairs with week 11's four-draft email) |
| 10 | Fourteen identical delivery receipts, itemised |
| 12 | The desk setup and the sock pile, revisited against week 1 |

**Week 1 carries the real deck** (F3) — the page a marker opens first, and the
baseline diagnostic gives a deck something to do.

### 4.3 Assessment — 15 + 15 + 20 + 20 + 30 = 100

All five deadlines are **12:00 local**. `src/lib/dates.ts:3` formats with
`timeZone: "UTC"`, so any deadline before ~10:00 local renders one day early;
noon is verified correct at both `+11:00` and `+10:00`. See §5 #23.

Every item carries a `weighted` marking model; consistency *is* the
institutional register. Each also carries a `spec:` list, which is where the
user's HD thresholds belong.

**Weekly Reflections — 15%** · `week: 1` · due 12:00 Tue 2 Mar 2027 (`+11:00`)
Eleven prompts, lowest dropped, ten counted × 1.5% = 15%, arithmetic on the
page. Criteria: *Completion 60 · Specificity 40.*

**A1 Makeover — 15%** · `week: 4` · due 12:00 Fri 19 Mar 2027 (`+11:00`)
Covers weeks 1–3. Criteria: *Hygiene product selection 40 · Outfit
appropriateness 40 · Justification 20.*

**A2 Touch Grass Field Study — 20%** · `week: 8` · due 12:00 Fri 30 Apr 2027
Covers weeks 4–7. CS discussion capped at 5 minutes; compliance self-reported
and the page says so. Criteria: *Observation 40 · Reflection 35 · Compliance
with restrictions 25.*

**A3 Time to be an Adult — 20%** · `week: 12` · due 12:00 Fri 28 May 2027
Due after week 12's Lab, so "covers weeks 1–12" is honest — week 12 introduces
no new content. Band descriptors go in the body; the rubric in frontmatter:

| Criterion | % |
| --- | --- |
| Hygiene subsystem: scheduling and adherence | 14 |
| Meal plan: nutritional coverage and repetition | 14 |
| Budget: category coverage and plausibility against stated income | 12 |
| Sleep schedule: viability | 10 |
| Exercise: frequency and specificity | 8 |
| Laundry: frequency and colour separation | 8 |
| The date: activity selection, booking, timing, attire | 8 |
| Grocery logistics | 6 |
| The interview: correspondence, preparation, attire, transit | 6 |
| Cleaning schedule | 5 |
| The hangout: negotiation and workload clearance | 5 |
| Skincare | 4 |
| **Total** | **100** |

The satire is in the ordering, played completely straight: laundry outweighs the
job interview, hygiene ties with cooking as joint-heaviest, friendship is worth
less than washing your clothes, skincare gets its own 4% line. Nothing winks —
the numbers do the work.

**Final Exam — 30%** · `week: 12` · due 12:00 Wed 9 Jun 2027
Five stations. Criteria: *Station 1 Hygiene and Health 15 · Station 2 Fashion 15
· Station 3 Small Talk 20 · Station 4 Social Debugging 20 · Station 5 Daily
Survival 30.* The ten-minute conversation outweighs the ten-minute hygiene quiz,
and the 2h10 cooking station is only 30%: duration is not difficulty.

### 4.4 Register

Never breaks character in any lecture, Lab, assessment or exam station. The
advice is all genuinely correct; the joke is aimed at the institution, never the
student. The stereotypes the course runs on overlap heavily with autistic
traits, and the thesis sentence is what keeps the target on the culture.

One plain-register **content and disclosure** section on the policies page: what
the satire is aimed at, that reflections are never read aloud, and that week 9's
is optional. The policies page is otherwise fully in character.

**Rejected alternative:** breaking character nowhere at all, including policies.
Purest execution, but the thesis sentence alone would carry the
"challenges stereotypes" claim and nothing would cover the personal disclosure
weeks 1 and 9 ask for.

### 4.5 Cast

Four fictional deadpan professionals in the **School of Applied Competence** —
the invented school is what makes the thesis institutional rather than
editorial:

- **Course Convenor** — research interests in routine adherence and
  longitudinal self-report
- **Tutor, Textile Care and Garment Longevity** (weeks 2, 10)
- **Tutor, Interpersonal Protocols** (weeks 7–9)
- **Tutor, Nutrition Systems and Domestic Logistics** (weeks 4, 10)

Names must be clearly fictional and low-collision, following the starter's
register (`Idris Fenn`, `Marisol Quaye`).

**Constraint found in Phase 2:** `role` is typed as a free string in
`src/content.config.ts`, but `PeopleGrid.astro:8-22` maps `roleOrder`/`roleLabels`
by the literal keys `convenor|tutor|guest|other` — an unrecognised value sorts
last *and* renders no label — and `TeachingTeam.astro:19` prints the raw string.
So `role` stays `convenor`/`tutor`, and each specialism lives in `affiliation`
(e.g. `School of Applied Competence — Textile Care and Garment Longevity`),
which is how a real handbook reads anyway.

**Rejected alternative:** the user as convenor. It reads funny, but it is the
one detail that breaks the institutional seriousness the whole course depends
on — a current fourth-year undergraduate convening a compulsory prerequisite
reclassifies the site from "a course" to "a joke by a student." It also inverts
the thesis: if a CS student is the authority, the claim becomes "I worked this
out and you didn't," turning the satire onto classmates. And it is the obvious
move, which is the wrong thing to have to write up in `PROCESS.md`.

### 4.6 Visual treatment

**Register:** a real university handbook — not a tech company, not a joke. The
content is absurd; the design's job is to be entirely credible so the content
has something to play against. Every decision is restraint, because restraint is
what reads as serious.

**The centrepiece — the systems vocabulary is set in mono.** Every borrowed
engineering term, everywhere it appears: `subsystem`, `root cause`,
`unscheduled downtime`, `regression testing`, `telemetry`, `manual override`,
`baseline`. Inline `--at-font-mono`, exactly as a real course site sets code.
The design then makes the same joke the content does, in a different medium —
and it is the one visual decision that is mechanically checkable, so it becomes
a `spec/` check rather than a good intention.

- **Type:** transitional text serif for headings against Public Sans body —
  handbook, not landing page. Tight heading scale; a large display step reads as
  marketing. Mono for the glossary above.
- **Measure and rhythm:** `--at-content-width` ≈68ch, even vertical rhythm off
  the spacing scale.
- **Surface:** `--at-border-radius` near zero, shadows off or one hairline.
  **Rules, not cards** — shadows and rounded cards read as an app; a handbook
  uses rules and tables.
- **Colour:** the three fixed inks used sparingly; gold for accents, never a
  large fill. Neutral grounds. This does the most work on the list.
- **Components:** the week listing becomes a **schedule table**, not a card
  grid, and each week page carries a spec-sheet metadata block (Week · Date ·
  Lecture · Lab · Reflection due). `MarkingModel` already renders a table.
- **Motion:** state transitions only, 120–180ms, `prefers-reduced-motion`
  honoured. No scroll reveals, no parallax, no entrance animation. A joke
  website animates; a real one does not.

**Reference filter.** The user's eight references pull in two directions; the
register keeps four and rejects four. In budget: minerva.edu (modern,
non-traditional academic), brilliant.org (clean, restrained), leetcode.com
(plain, subtle motion), codecademy.com (confident institutional personality).
Out: igssyd.nsw.edu.au, why.zero.university, ilovecreatives.com,
rebelliously-optimistic.com — all good design, but a playful surface tells the
reader it is a joke before they read a word, leaving the deadpan nothing to do.

**Phone constraint:** 390×844 is a marking viewport. Tables need `overflow-x`
containers and the tight type scale must stay legible there.

### 4.7 The `spec/` checks

Marked as "the record of what you decided had to stay true about your course",
so these are design decisions, not test hygiene:

1. Every published assessment weight sums to exactly **100** (F4)
2. Reflections: counted × rate === declared weight (10 × 1.5 === 15) (F12)
3. Lectures and Labs each cover weeks 1–12 **exactly once** — no gaps, no
   duplicates (F8)
4. Every lecture body carries all **five slot headings, in order** (F10)
5. Week *N*'s date precedes week *N+1*'s, in both collections
6. At least one lecture's `slides:` resolves to a deck present in the build (F3)
7. The thesis sentence appears **verbatim** on the homepage (F18)
8. Each assessment's stated coverage ends at or before its own week
9. The policies page carries the content-and-disclosure section (F16)
10. Systems-vocabulary terms are marked up as code wherever they appear (F19)

Check 4 matters most: it turns the user's own `CLAUDE.md` rule from an
instruction an agent can drift from into a build failure.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | Gap | Spec requires a lecture with a real deck; the design mentioned no lectures or decks at all | 12 lectures + 12 Labs; week 1 carries the deck |
| 2 | Contradiction | The proposed `CLAUDE.md` rule ("one consistent weekly structure") versus drafted weeks where case studies appear in 6 of 12 and week 12 has no content | Fixed five slots, all filled; six new case studies; enforced by `spec/` check 4 |
| 3 | Contradiction | "Compulsory-adjacent, non-credit-bearing, entirely-credit-bearing" | Editing artefact — dropped |
| 4 | Gap | Week 12's reflection prompt would fall due in a non-existent week 13 | Eleven assessed prompts; week 12's is set but ungraded, folded into A3 |
| 5 | Ambiguity | Reflections at 15% with lowest dropped — how many, at what rate? | 11 prompts, 10 counted × 1.5% = 15%, stated on the page (user: "arithmetic should be visible") |
| 6 | Contradiction | Final Exam has no legal home: `week` caps at 12 and `data-integrity` requires `due ≤ endDate` | `week: 12`, due 9 Jun 2027, `endDate` extended to 2027-06-19 over the exam period |
| 7 | Ambiguity | A3's HD checklist fits neither `weighted` nor `holistic` | Weighted rubric in frontmatter (schema enforces the sum) + bands in the body — `MarkingModel.astro:22` renders `holistic` as one flat `<p>`, which would throw the best writing away |
| 8 | Ambiguity | Literal `?(5, 10?)` placeholder in A2's restrictions | 5 minutes |
| 9 | Gap | A2's restriction is unenforceable and the design was silent on it | Page states compliance is self-reported; the report is the evidence |
| 10 | Gap | `sessionLabels` unaddressed | Labs |
| 11 | Gap | `people` unaddressed; both starter entries are tracked starter content | Four institutional professionals in the School of Applied Competence; user not in the cast |
| 12 | Gap | Policies page unaddressed — a tracked starter file *and* a course-API node | In character throughout, plus one plain-register content-and-disclosure section |
| 13 | Gap | Register: the stereotypes overlap with autistic traits, and weeks 1 and 9 ask for real disclosure | Never break character in content; the joke targets the institution; safeguards live on the policies page |
| 14 | Gap | Broadness — "life skills" is a broad subject and Frosh 101 is real and running, so it would pass a curriculum committee. Satire is *not* a differentiator: the brief says sincere, deadpan and satirical are all fine | The niche was always the method (systems engineering) and the station exam, neither of which appeared where a ten-minute read looks. Method moved into the title; description and homepage lead with it |
| 15 | Gap | Assignment 3 due in week 12 while covering weeks 1–12 | Due Friday of week 12, after that week's Lab; week 12 introduces no new content |
| 16 | Gap | Teaching days unstated — and Good Friday, Easter Monday and observed ANZAC Day all fall on week Mondays or Fridays | Lectures Tuesday, Labs Thursday, reflections due 12:00 Tuesday |
| 17 | Ambiguity | Tagline wording: "a skill like any other… this one" wobbles, and it wanted a comma | "Competence is a skill like any other. CS culture just never taught you this one." |
| 18 | Ambiguity | Year, teaching period and level digit unset | Semester 1 2027; level 1; `SLOP1521` unchanged |
| 19 | Contradiction | The eight UI references split between institutional-professional and playful-animated; a playful surface would fight the deadpan | Four kept, four rejected (§4.6) |
| 20 | Assumption | Whether the Slop palette being fixed blocked a visual overhaul | Verified: only three brand inks plus lockup assets are fixed. Type, measure, spacing, surface, components and motion are all ours |
| 21 | Gap | Hero artwork and social card fail `check:evidence` unchanged | F20 |
| 22 | Gap | No `spec/` checks designed, though they are read as the record of course-design decisions | Ten checks (§4.7) |
| 23 | Contradiction | **Found in Phase 2.** `src/lib/dates.ts:3` formats in UTC, so the spec's 09:00 reflections and 09:00 exam deadlines rendered as the *previous day* (verified by running the formatter). Two of five due dates were wrong | All five deadlines moved to 12:00 local, verified correct at `+11:00` and `+10:00`. Rejected patching `dates.ts` to `Australia/Canberra`: UTC is correct for the date-only `date:` fields, which are most of the site |
| 24 | Assumption | **Found in Phase 2.** §4.5 assumed `role` could carry each tutor's specialism, because `src/content.config.ts` types it as a free string | It cannot — `PeopleGrid.astro` maps roles by the literal enum keys and silently drops the label for anything else. `role` stays `convenor`/`tutor`; specialisms move to `affiliation` |

## 6. Handoff notes for planning

**Already decided — do not re-litigate.** Every row in §5, the identity in
§4.1 (all three fields validated against the schema), the assessment weights and
criteria in §4.3, the cast in §4.5, and the reference filter in §4.6. The user
explicitly delegated A3's relative weights and explicitly chose to specify the
visual treatment up front.

**Sequencing.** The course record (§4.1) gates everything — the homepage,
navigation and API all read it, and the twelve-week calendar hangs off its dates.
Content before treatment in practice, even though the treatment is specified:
tokens and component decisions can land early, but they can only be *judged* in
a browser against real pages. `spec/` checks are worth writing alongside the
content they protect rather than at the end, since check 4 is what keeps the
twelve weeks from drifting apart while they are being written.

**Risks knowingly accepted.**

- The treatment is specified against content that does not exist yet. Stated as
  tokens, principles and named component decisions — the form that survives
  writing twelve weeks — but some of it resolves only in a browser.
- `endDate` covering the exam period stretches the field's name, and
  `data-integrity.test.ts`'s failure message still reads "falls after teaching
  ends". Accepted by the user in exchange for the exam being institutionally
  plausible.
- Broadness is reduced, not eliminated. It is one part of one criterion, and the
  brief's own named failure modes — twelve weeks that repeat one another, or the
  starter with the nouns swapped — do not describe this design.

**Verification.** `pnpm check` and `pnpm check:evidence` green, then
`agent-browser` at 1920×1080 and 390×844. Fourteen `STARTER_CONTENT` fragments
and the shipped imagery must all be gone before `check:evidence` passes.

**Not this skill's or plan-feature's work.** `PROCESS.md` — the user writes it.
Worth noting for them, though: probes #2, #6, #7, #14 and #20 are all
corrections that landed in the harness or in `spec/`, which is the bar
`CLAUDE.md` sets for a `PROCESS_LOG.md` entry.
