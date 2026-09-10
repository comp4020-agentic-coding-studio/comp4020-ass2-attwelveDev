# SLOP1521 voice realignment: drop the systems-engineering framing

- **Date:** 2026-09-10
- **Status:** Draft
- **Approved by user:** yes — 2026-09-10

## 1. Problem / intent

The site's current voice leans on systems-engineering (and other technical)
jargon as its governing comedic device — a course literally titled *Personal
Systems Maintenance*, subsystems, root causes, manual overrides, handshake
protocols, supply chains. The user has decided this is the wrong mechanism:
it reads as try-hard, it competes with the actual joke instead of carrying
it, and it excludes readers without the technical background — a bad fit for
a course that is explicitly about *foundations*.

The corrected mechanism, already validated on a rewritten homepage sample
(see `prompts/voice-brief-for-agent.md`): **institutional seriousness applied
to concrete, specific, mundane CS-student stereotypes**, with the joke never
requiring the reader to know a technical concept to land, and never
delivered as a sincerity break. The thesis line, the five-slot weekly
structure, and the case-study narrative shape all stay — only the jargon
layer and the framing devices built on top of it go.

This is a full-site rewrite, not a copy edit: every week currently carries
its own distinct technical metaphor as the organizing device for its Content
section, so removing the metaphor means re-deriving what each week teaches
in mundane terms, not just swapping words.

## 2. Requirements

### 2.1 Functional requirements

1. **F1** No content page (i.e. every page except the policies page's
   Content and disclosure section) contains a governing technical metaphor
   from *any* domain — CS/software engineering, networking, logistics,
   business operations, or any other domain-expert lens — as a sustained
   framing device for its content. Occasional one-second puns (e.g.
   "committing to a shower schedule") are permitted; a metaphor sustained
   across a paragraph or a whole week is not.
2. **F2** The banned-terms list (§4.2) is checked against every rendered
   content page (excluding the policies page's disclosure section) and
   fails the build on a hit. The list starts from the brief's starting list
   plus every term actually found in the current content (§3.1) and is
   expected to grow — `spec/` must make it trivial to add a term.
3. **F3** No backtick-wrapped (`` ` ``) or `<code>`-styled span appears
   around a jargon-flavoured term anywhere in rendered content, since the
   styling itself flags "notice this joke" and undercuts the deadpan
   register.
4. **F4** No framing/overview copy (homepage, weekly Overview slots, "who
   this is for" style copy) narrates its own premise using phrases like
   "taught as," "framed as," "presented as," "in the style of," "assessed
   like a" — the absurdity is shown through specific content, never stated.
5. **F5** Any romantic/dating content (Week 9 and any other week that
   touches it) uses gender-neutral relationship language only — no
   "girlfriend"/"boyfriend"/"the girl/guy you like."
6. **F6** A non-blocking check flags sincerity-break tell-phrases ("take
   care of yourself," "but seriously," "in all seriousness," "we hope you,"
   "remember to") on content pages, for human/agent review — it must not
   fail `pnpm check`.
7. **F7** The course title changes to **"Introduction to Life: Foundations
   of Being a Person"** and the homepage subtitle (`courseMeta.description`)
   changes to the corrected copy in §4.3, both still satisfying
   `slopCourseMetaSchema`'s existing length constraints.
8. **F8** Every artifact in the inventory (§4.1) is rewritten under F1–F5:
   all 12 lectures, all 12 sessions, all 5 assessments, the two affected
   people bios, the homepage, and the policies page's non-disclosure
   sections. Each week's Content section keeps a single memorable, concrete,
   recognizable scenario as its organizing hook (per the swap-table logic in
   §4.4) — it must not degrade into a generic, unhooked tips list once its
   technical metaphor is removed.
9. **F9** The hero image concept and its alt text are replaced with
   something that does not visually encode a systems/technical metaphor
   (current alt text describes "gold status-grid floor tiles... flagged
   black for maintenance").
10. **F10** `spec/glossary.test.ts` (which currently *requires* six jargon
    terms to appear, styled as code) is removed and replaced by the checks
    in F2–F5. `spec/homepage.test.ts`'s `"leads with the systems framing"`
    test (which requires `"systems engineering"` to appear) is removed and
    replaced with an assertion on the new title/subtitle.
11. **F11** `CLAUDE.md`'s "Register" section is replaced with "Register and
    voice" (§4.5), and the rest of the file gets a concision pass, subject
    to the hard constraint in §2.2.
12. **F12** `pnpm check` stays green throughout; the sincerity-break check
    (F6) ships as a separate script, not part of `pnpm check`.

### 2.2 Non-functional requirements

- **Hard constraint on F11**: `spec/harness.test.ts` asserts five literal
  substrings/patterns against `CLAUDE.md` — the thesis quote verbatim, the
  five slot names (`Overview`, `Content`, `Case study`, `Reflection`,
  `Assessment tie-in`), `/never break character/i` and `/policies/i`
  co-occurring, `convenor`/`affiliation`, and `/12:00/` + `/UTC/` (the noon
  deadline rule). Any concision edit must keep all five intact or update
  `spec/harness.test.ts` in lockstep — never silently drop a check to make
  an edit fit.
  *(Corrected 2026-09-10 during `plan-feature`'s codebase investigation: the
  original count of four omitted the noon-deadline check.)*
- **Pre-existing doc/code mismatch to fix alongside F11, not a new
  requirement**: `CLAUDE.md`'s weekly-structure section currently claims
  "every week (lecture + Lab) carries the same five slots," but
  `spec/weekly-structure.test.ts` — verified 2026-09-10 — actually enforces
  a *different* three-slot structure for Labs (`Before the Lab` / `In the
  Lab` / `Afterwards`; see its `"weekly structure — Labs"` describe block
  and `src/content/sessions/week-01.md`/`week-08.md`), with the five-slot
  structure applying to lectures only. Since F11 is already rewriting this
  exact section for concision, correct the claim in the same edit rather
  than leaving a known-wrong statement in place. `spec/harness.test.ts`'s
  five slot-name substrings are unaffected either way — they just need to
  appear somewhere in the file, not in a single accurate sentence about
  Labs.
- No schema or field-name changes — confirmed in §3.2, this is a prose/data
  rewrite only, not a content-model migration.
- Accessibility and visual-treatment rules already in `CLAUDE.md` are
  unaffected by this change and remain in force.

### 2.3 Out of scope

- Rewriting `PROCESS.md`, `PROCESS_LOG.md`, or files under `specs/`/`plans/`
  that document *past* decisions — they are the user's record, not
  something this pass edits. (The user may choose to log this pivot as a
  new `PROCESS_LOG.md` entry themselves; that is their call, not a task
  here.)
- Any visual/CSS treatment beyond the hero image concept itself (F9) —
  typography, colour, layout are unrelated to this voice change.
- Re-litigating the thesis line, the five-slot weekly structure, or the
  case-study narrative shape (what-happened → why → what-changed) — all
  three are confirmed keepers.

### 2.4 Assumptions (confirmed)

| Assumption | How confirmed |
| --- | --- |
| The course title itself needed to change, not just prose around it | Raised as a gap the brief didn't cover; user chose "rename it" |
| The ban extends beyond strictly-CS jargon to any technical/domain metaphor | Raised as a boundary case (Week 10 supply-chain, Week 7/11 networking); user chose "extend to any technical metaphor" |
| "Root cause" contradiction (banned outright vs. kept as case-study shape) resolves toward keeping the shape, dropping the literal label | User chose this explicitly over carving out an exception |
| Hero art is in scope, not just its alt text | User chose "fully in scope" over the two narrower options |
| The sincerity-break check must not block `pnpm check` | User chose a separate non-blocking script over a hard-fail test or dropping the check |
| New course title wording | User confirmed "Introduction to Life: Foundations of Being a Person" (matches the name the brief document itself already uses) |
| Subtitle trim | User confirmed dropping the closing "Assessed by practical examination." sentence to fit the 300-char schema cap (279 chars) |
| CLAUDE.md voice-section content and concision-sweep scope | User asked for this as a final addition; design in §4.5 proposed and approved in the same turn |

## 3. Existing context

Verified by reading the repo directly on 2026-09-10 (not recalled from any
prior spec).

### 3.1 Where the jargon currently lives

- **Course identity**: `src/course-config.ts` — `title: "Introduction to
  Life: Personal Systems Maintenance"`; `description` is verbatim the
  brief's own ❌ example ("taught as systems engineering: scheduling,
  root-cause analysis and regression checks...").
- **Homepage**: `src/pages/index.astro` — "systems engineering" (line 47),
  `<code>subsystem</code>` (50), `<code>root cause</code>` (51),
  `<code>manual override</code>` (58), "social debugging" (53), hero alt
  text describing a systems-maintenance visual.
- **Policies page** (`src/pages/policies/index.mdx`): jargon in Attendance
  (`` `Unscheduled downtime` ``, `` `subsystem` ``, "root-cause
  conversation"), Late work (`` `manual override` ``), Academic integrity
  (`` `telemetry` ``) — all outside the sincere "Content and disclosure"
  section (lines 52–68), which stays untouched.
- **Every lecture and session, weeks 1–12** — each carries its own
  governing technical metaphor, not just shared vocabulary:
  - Week 1: "systems engineering" framing, "subsystem"/"unscheduled
    downtime" introduced as the semester's vocabulary
  - Week 4: sleep as a "scheduled subsystem"
  - Week 5, 10: "telemetry"; Week 10 additionally frames groceries as a
    **supply chain** with "reorder points" (logistics metaphor, not CS)
  - Week 6: "manual override"
  - Week 7: small talk as a **handshake protocol** (networking metaphor)
  - Week 8: "root-cause incident report," a `` `Root cause`: `` on-page label
  - Week 9: messages as "interface calls" that "commit to" something
  - Week 11: correspondence as a **protocol with retry logic** (networking)
  - Week 12: all "subsystems" converge (finale echoing Week 1)
- **Assessments**: Final Exam Station 4 is literally named "Social
  Debugging"; Assignment 3 and Weekly Reflections frame themselves around
  "subsystems"; Final Exam also uses `` `root cause` ``.
- **People**: `noor-kalantari.md`'s title/affiliation is "Interpersonal
  Protocols," described as teaching "protocols" as a "debuggable skill";
  `cosima-adjei.md` references "the standing of every `subsystem`";
  `petra-lindqvist.md` describes a meal plan as "a resource allocation
  exercise" and a grocery run as "a supply chain with a two-week lead time."
  *(Corrected 2026-09-10: a full grep of every content file found a third
  affected person bio, `petra-lindqvist.md`, not caught during brainstorming.
  `thaddeus-vrell.md` uses only the generic word "system" once — borderline,
  not a literal banned-term hit — and is left to F1's judgment call, not a
  required rewrite.)*
- **File count**: 12 lectures + 12 sessions + 5 assessments + 3 affected
  people bios = 32 content files, plus `index.astro` and
  `policies/index.mdx`.

### 3.2 Spec and schema constraints

- `spec/glossary.test.ts` currently *requires* six terms (`subsystem`,
  `root cause`, `unscheduled downtime`, `regression testing`, `telemetry`,
  `manual override`) to appear site-wide, each wrapped in `<code>`, with a
  CSS assertion that `<code>` renders in the monospace "systems register."
  This entire mechanic is being reversed, not tuned.
- `spec/homepage.test.ts:21-23` — `"leads with the systems framing"` asserts
  `html` contains `"systems engineering"`. Must be removed/replaced.
- `spec/course-record.test.ts` (verified 2026-09-10, **not previously listed
  here**) reads `dist/api/index.json` and hard-codes: `api.course.title`
  must equal `"Introduction to Life: Personal Systems Maintenance"` exactly
  (line 29), and `api.course.description` must contain `"systems
  engineering"` (line 42). Both must be updated to the new title/description
  in the same task that changes `src/course-config.ts`, or the build stays
  red.
- `spec/harness.test.ts` checks five `CLAUDE.md` substrings (see §2.2) —
  none of them are jargon-dependent, so F11 can proceed without touching
  `spec/harness.test.ts`, provided the concision sweep preserves them.
- `slopCourseMetaSchema` (`src/course-config.ts`): `title` ≤100 chars
  (new title is 51), `description` 80–300 chars (trimmed new copy is 279).
- No content-collection schema field is named after a jargon concept
  (`role`, `title`, `description`, `week`, `due`, `weight`, `marking`,
  `slides`, etc. are all generic) — confirmed this is a prose-only rewrite,
  no schema/field migration needed.

## 4. Design

### 4.1 Complete artifact inventory

| Artifact | Change |
| --- | --- |
| `src/course-config.ts` | New `title`, new `description` (§4.3) |
| `src/pages/index.astro` | "What this course is" / "Who this course is for" prose per brief's already-agreed corrected copy; new hero alt text |
| `src/pages/policies/index.mdx` | Rewrite Attendance/Late work/Reflections/Academic integrity sections under F1–F3; leave Content and disclosure untouched |
| `src/content/lectures/week-01.md` … `week-12.md` | Re-derive each week's Content-section hook in mundane terms (§4.4); drop all jargon |
| `src/content/sessions/week-01.md` … `week-12.md` | Same |
| `src/content/assessments/*.md` (5 files) | Drop jargon framing; rename Final Exam Station 4 away from "Social Debugging" |
| `src/content/people/noor-kalantari.md` | New title/affiliation (currently "Interpersonal Protocols") and description |
| `src/content/people/cosima-adjei.md` | Remove "subsystem" reference |
| `src/content/people/petra-lindqvist.md` | Remove "resource allocation exercise" / "supply chain" phrasing *(added 2026-09-10 — missed during brainstorming)* |
| Hero image asset | New concept consistent with the new voice (F9) |
| `spec/glossary.test.ts` | Delete; replaced by new banned-term/framing/gendered checks |
| `spec/homepage.test.ts` | Remove the systems-framing test; add assertions for new title/subtitle |
| `spec/course-record.test.ts` | Update the hard-coded title (line 29) and the `"systems engineering"` substring (line 42) to match the new course identity *(added 2026-09-10 — missed during brainstorming)* |
| New spec file(s) | Banned-term check (F2), formatting/backtick check (F3), framing-narration check (F4), gendered-pairing check (F5) — `plan-feature` decides whether these live in a new `spec/voice.test.ts` or fold into existing files |
| New script | Non-blocking sincerity-break lint (F6), following the `pnpm check:evidence` pattern |
| `CLAUDE.md` | "Register" → "Register and voice" (§4.5); concision sweep elsewhere (§2.2 constraint applies); correct the Labs five-slot/three-slot mismatch noted in §2.2 |

### 4.2 Banned-terms list (starting point — expected to grow)

From the brief's starting list, plus every term actually found in current
content (§3.1), since the ban now covers any technical-domain metaphor, not
just CS:

`systems engineering`, `root-cause analysis`, `root cause`, `regression
check`, `regression test`, `manual override`, `subsystem`, `runtime`,
`deploy`, `merge conflict`, `TCP/IP`, `handshake`, `handshake protocol`,
`cache invalidation`, `technical debt`, `` `git` ``, `protocol`, `debug`,
`debugging`, `debuggable`, `interface call`, `supply chain`, `reorder
point`, `telemetry`, `unscheduled downtime`, `retry logic`, `coordination
mechanism`, plus backtick-wrapped spans generally (F3).

This list is maintained alongside content, the same way the brief's own
machine-checkable section anticipates — `plan-feature`/`execute-plan` add to
it as rewriting surfaces new drift, they don't treat it as closed.

### 4.3 Corrected course identity

- **Title**: `Introduction to Life: Foundations of Being a Person`
- **Description** (subtitle, 279 chars): "A practical course in the
  personal maintenance a computer science degree assumes you handled
  elsewhere: showering on a schedule, eating something with more than one
  food group, replying to a message before it's a week old, and holding a
  conversation that isn't about your degree."

### 4.4 Per-week re-derivation principle

Each week currently uses a technical metaphor as its organizing hook (§3.1).
Removing the metaphor is not a find-and-replace — `plan-feature`/
`execute-plan` must re-derive a concrete, mundane, specific scenario as each
week's hook, following the brief's swap-table logic (abstract technical
concept → concrete mundane image) and this repo's own homepage precedent
(instant noodles four nights running; a haircut predating the current
degree). A week must never end up as an unhooked generic tips list — that
is as much a voice failure as the jargon it replaces.

### 4.5 CLAUDE.md "Register and voice" section (replaces "Register")

```markdown
## Register and voice

Never break character in a lecture, Lab, assessment or exam station — the
one exception is the policies page's **Content and disclosure** section,
which is sincere; everything else on every page stays in character.

The joke is always institutional seriousness applied to a concrete,
specific, mundane CS-student stereotype — never a technical metaphor. No
governing jargon lens of any kind (CS, networking, logistics, business-ops)
stands in for the content itself; occasional one-second puns are fine,
sustained metaphors are not. Test: if a sentence needs the reader to know a
technical concept to get the joke, rewrite it in mundane specifics instead.

| Don't | Do |
| --- | --- |
| "root-cause analysis of a friendship failure" | "eating the same bowl of instant noodles four nights running and calling it meal planning" |
| "personal systems running on manual override" | "your last haircut predates your current degree" |
| "regression checks on hygiene" | "identify one reason to shower before, not after, a group project meeting" |

Never wrap jargon in backticks/`<code>` to flag it as clever — that
undercuts the deadpan even once the wording is fixed. `spec/` runs a
banned-term check against this list; extend the list there when a new
metaphor slips in, don't just fix the one instance.
```

The rest of `CLAUDE.md` gets a concision pass under the §2.2 hard
constraint — tighten redundant prose in Before pushing / Generated files /
Secrets / Commits / PROCESS.md-and-LOG / weekly structure / role-enum /
deadlines sections without dropping any of the four substrings
`spec/harness.test.ts` checks.

### Alternatives considered

- **Carving a "root cause" exception into the banned-term check** (keeping
  the literal phrase as a case-study heading) — rejected in favour of
  keeping the check unconditional and renaming the on-page label instead;
  a clean check is worth more than preserving one phrase.
- **Scoping the metaphor ban to strictly CS/software terms** (leaving
  Week 7/10/11's networking/logistics framing alone) — rejected; the user's
  own accessibility rationale for dropping CS jargon applies equally to
  other technical-domain jargon.
- **A hard-fail test for the sincerity-break check** — rejected because the
  brief itself frames it as a soft signal, and this repo's `pnpm check` has
  no established pattern for a test that reports without failing; a
  separate script matches the existing `pnpm check:evidence` precedent
  instead of inventing a new test semantics.

## 5. Probes raised and resolved

| # | Type | What was raised | Resolution |
| --- | --- | --- | --- |
| 1 | Gap | The course title itself ("Personal Systems Maintenance") is the banned metaphor, and the brief never mentioned renaming it | Renamed to "Introduction to Life: Foundations of Being a Person" |
| 2 | Ambiguity | Brief's ban is framed around CS jargon, but Weeks 7/10/11 use networking/logistics metaphors that aren't strictly CS | Extended the ban to any technical/domain-expert metaphor |
| 3 | Contradiction | Banned-terms list bans "root cause" outright; standing content rule keeps "incident report → root cause → remediation" as the case-study shape; Week 8 uses `` `Root cause`: `` as a literal label today | Keep the narrative shape, drop the literal on-page phrase — rename the label |
| 4 | Gap | Hero image alt text visually encodes the same metaphor being dropped from prose | Fully in scope — new image concept and alt text, not just new copy |
| 5 | Gap | `pnpm check` is vitest pass/fail, but the brief's own sincerity-break check is explicitly meant to be a soft signal | New non-blocking script, following the existing `pnpm check:evidence` pattern, not part of `pnpm check` |
| 6 | Contradiction (schema) | Brief's corrected subtitle (314 chars) exceeds `courseMeta.description`'s 300-char schema max | Trimmed to 279 chars by dropping the closing "Assessed by practical examination." sentence |
| 7 | Gap | User's final request to add CLAUDE.md voice examples and do a concision sweep didn't specify how to avoid breaking `spec/harness.test.ts`'s literal substring checks | Made explicit as a hard constraint (§2.2) scoping the sweep: the four checked substrings must survive, everything else can tighten |

## 6. Handoff notes for planning

- This is large enough that `plan-feature` should probably sequence it:
  course identity + spec-test rewrite first (so the new checks exist before
  content is rewritten against them), then content collections week by
  week, then `CLAUDE.md`.
- The banned-term list (§4.2) is a starting point, not a spec. As each
  week/page is rewritten, `execute-plan` should sweep for new drift terms
  and add them — the brief's own instruction, not new scope.
- F8's "must keep a memorable hook" requirement is a quality bar, not a
  literal check `spec/` can enforce mechanically — `plan-feature`/
  `execute-plan` should treat a generic, unhooked week as a rework trigger
  the same way a banned-term hit is, even though only one of the two fails
  a test.
- Do not re-litigate: the thesis line, the five-slot structure, the
  case-study shape, the policies page's disclosure-section exemption, or
  any of the seven resolved decisions in §2.4 — all were explicitly decided
  in this conversation.
