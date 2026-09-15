> **Competence is a skill like any other. CS culture just never taught you this one.**

# Working method

## Before pushing

- `pnpm check` (types, build, `spec/` tests) must be green.
- Verify visual changes with `agent-browser` at both marking viewports
  (`1920 1080`, `390 844`) — the render is the truth, not the source.

## Generated files

Never hand-edit `dist/`, `.astro/`, or generated `api/*.json`; fix the
source and rebuild.

## Secrets

Never widen `.gitignore` around `.claude/settings*.json`, `.env*`, or
commit a key. `.claude/skills/**` is the only carve-out.

## Commits

One commit per unit of work once `pnpm check` passes — no mega-commits,
no bundling unrelated changes. Messages say what changed and why, not
"fixed things".

## PROCESS.md and PROCESS_LOG.md

`PROCESS.md` is the graded account of **my** decisions: 3-4 moments,
400-600 words, each citing a commit/range that actually resolves
(`pnpm check:evidence` checks this — never cite before committing). A
moment qualifies only if it says why the call beat the obvious one and
how I knew the result was right — not just "it worked"; the strongest
moments land the correction in the harness itself (a rule here, a check
added to `spec/`/`scripts/`) rather than a one-off fix.

Log every qualifying moment to `PROCESS_LOG.md` (append-only, repo root)
as it happens, in the format its own header comment shows — pick the
best 3-4 for `PROCESS.md` later.

# Course rules

Constraints on SLOP1521's own content, not background prose — each one is
something an agent can check its own work against directly.

## The weekly structure

Every lecture carries the same five slots, in order: **Introduction**,
**Definitions**, **Body**, **In-lecture activity**, **Conclusion**. Every
Lab carries its own three: **Before the Lab**, **In the Lab**,
**Afterwards**. `spec/` enforces both shapes.

## Register and voice

Never break character in a lecture, Lab, assessment or exam station —
the one exception is the policies page's **Content and disclosure**
section; everything else stays in character.

The joke is institutional seriousness applied to a concrete, mundane
CS-student stereotype — never a technical metaphor from any domain (CS,
networking, logistics, business-ops). Puns are fine; sustained metaphors
are not — if a sentence needs a technical concept to land, rewrite it in
mundane specifics.

| Don't | Do |
| --- | --- |
| "root-cause analysis of a friendship failure" | "eating the same bowl of instant noodles four nights running and calling it meal planning" |
| "personal systems running on manual override" | "your last haircut predates your current degree" |
| "regression checks on hygiene" | "identify one reason to shower before, not after, a group project meeting" |

Never wrap jargon in backticks/`<code>` — that undercuts the deadpan.
`spec/voice.test.ts` checks a banned-term list against every content page;
extend it there when a new metaphor slips in, not just the one instance.

## `role` is an enum, not free text

`src/content.config.ts` types `people.role` as a free string, but
`src/components/PeopleGrid.astro` maps display labels by the literal keys
`convenor`/`tutor`/`guest`/`other` — anything else sorts last and renders no
label at all. Use `convenor` or `tutor`; put a person's specialism in
`affiliation` instead.

## All deadlines are 12:00 local

`src/lib/dates.ts` formats dates in **UTC**, so a deadline earlier than
roughly 10:00 local renders one calendar day early. Every assessment's `due`
time must be `12:00` local — verified correct at both `+11:00` and `+10:00`.
