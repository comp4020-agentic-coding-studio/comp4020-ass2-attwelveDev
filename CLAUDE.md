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
