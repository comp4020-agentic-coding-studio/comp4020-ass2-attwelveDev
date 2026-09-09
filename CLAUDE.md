> **Competence is a skill like any other. CS culture just never taught you this one.**

# Working method

## Before pushing

- `pnpm check` (types, build, `spec/` tests) must be green.
- Verify visual/interactive changes by opening the page with `agent-browser`
  (`open`, `screenshot`, `snapshot`) against the dev server at
  `http://localhost:4321/<repo>/...` — the render is the truth, not the
  source. Check both marking viewports: `agent-browser set viewport 1920
  1080` (desktop) and `agent-browser set viewport 390 844` (phone).

## Generated files

Never hand-edit `dist/`, `.astro/`, or generated `api/*.json` — build
output. Fix the source and rebuild.

## Secrets

Never widen `.gitignore` around `.claude/settings*.json`, `.env*`, or commit
a key. `.claude/skills/**` is the one deliberate carve-out (plain
instructions, no secrets) — don't extend it further.

## Commits

- One commit per unit of work (feature, fix, doc change) once `pnpm check`
  passes. No end-of-day mega-commits, no bundling unrelated changes.
- Messages say what changed and why — not "fixed things".

## PROCESS.md and PROCESS_LOG.md

`PROCESS.md` is the graded account of **my** decisions, not the agent's:
3-4 moments, 400-600 words, each citing a commit/range that actually
resolves (`pnpm check:evidence` checks this — never cite before
committing).

A moment qualifies only if it says why the call beat the obvious one, and
how I knew the result was right before accepting it — not just "it worked".
The strongest moments are where the correction landed in the harness itself
(a rule added here, a check added to `spec/`/`scripts/`, an attempt thrown
away) rather than a one-off fix.

Log every qualifying moment to `PROCESS_LOG.md` (append-only, repo root) as
it happens — I'll pick the best 3-4 for `PROCESS.md` later. Format:

```markdown
## YYYY-MM-DD — <short title>
**Obvious approach:** ...
**What I decided instead, and why:** ...
**How I knew it was right:** ...
**Landed in the harness as:** ...
**Commit:** [`<sha>`](<url>) — add once committed.
```

# Course rules

Constraints on SLOP1521's own content, not background prose — each one is
something an agent can check its own work against directly.

## The weekly structure

Every week (lecture + Lab) carries the same five slots, in this order, all
filled: **Overview**, **Content**, **Case study**, **Reflection**,
**Assessment tie-in** (which may read "None this week", explicitly).
`spec/` enforces this, so a week cannot drift from the others.

## Register

Never break character in a lecture, Lab, assessment or exam station. The one
exception is the policies page, which carries exactly one plain-register
**Content and disclosure** section; everything else on it, and every other
page on the site, stays in character.

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
