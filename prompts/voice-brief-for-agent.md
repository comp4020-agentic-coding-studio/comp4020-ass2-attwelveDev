# Voice Brief: SLOP1521 (Foundations of Being a Person)

## The decision, stated plainly

Drop the systems-engineering framing entirely. No governing technical metaphor of any kind — not systems engineering, not software engineering (`git`, version control, TCP/IP), not any other CS-jargon lens applied wholesale to the course. This is a final decision, not one option among several to keep testing.

**Why:** the brief's "niche" requirement is about subject scope, not tone — it's satisfied by the course's premise alone (a formally assessed university course teaching CS students to shower, make small talk, and survive a live small-talk exam station). Tone is explicitly a free choice in the brief ("sincere, deadpan and satirical courses are all fine"). A jargon metaphor doesn't make the course more niche; it's a voice choice, and in this case the wrong one, because it competes with the actual source of the humour instead of supporting it.

## The thesis (unchanged, keep this)

> Competence is a skill like any other. CS culture just never taught you this one.

Every page should be checkable against this line. If a paragraph doesn't serve it, cut it.

## The actual comedic mechanism

The humour comes from **institutional seriousness applied to mundane, specific, recognisable CS-student stereotypes** — real syllabus format (learning outcomes, rubrics, prerequisites, a policies page), applied without a hint of irony, to content that is exaggerated but never abstracted into a metaphor.

Two failure directions to avoid, both already tried and rejected:
1. **Heavy CS/engineering jargon as the joke's mechanism** (systems engineering, `git`, TCP/IP, "regression checks," "manual override," "subsystem"). This reads as try-hard and cringe, and it also excludes readers without the technical background — bad fit for a "foundations" course.
2. **Sincerity breaks** — any line that steps outside the deadpan register to earnestly state the message ("...but really, take care of yourself"). This collapses the bit immediately. The message should be entirely carried by precision and specificity, never stated outright.

## The actual rule

**Replace abstract technical concepts with concrete, specific, mundane images.** This is the swap to make everywhere:

| Instead of (jargon/metaphor) | Use (specific stereotype detail) |
|---|---|
| "root-cause analysis of a friendship failure" | "eating the same bowl of instant noodles four nights running and calling it meal planning" |
| "personal systems running on manual override" | "your last haircut predates your current degree" |
| "regression checks on hygiene" | "identify one reason to shower before, not after, a group project meeting" |
| "personal hygiene as scheduled maintenance windows in the human runtime environment" | "Showering: Theory and Practice — learning outcomes include identifying one reason to shower before a meeting, not after" |
| "committing to a shower schedule" (pun) | fine occasionally as a light one-second pun, never as a sustained metaphor |

The test for any sentence: **does the joke require the reader to know a CS/engineering concept to get it?** If yes, rewrite it so the joke lives entirely in the mundane detail instead.

## Formatting note

Drop backtick/monospace styling around jargon terms (`` `subsystem` ``, `` `manual override` ``). That styling visually flags "notice this clever pun," which undercuts a deadpan register even once the wording itself is fixed.

## The "show, don't state" rule for framing copy

Never have a subtitle, overview, or "who this course is for" section *narrate* the joke's premise ("taught as systems engineering," "assessed like a system"). Instead, show the specific absurd content directly and let the reader infer the format's absurdity themselves.

- ❌ *"The maintenance of a human being, taught as systems engineering: scheduling, root-cause analysis and regression checks applied to sleep, hygiene, conversation and money."*
- ✅ *"A practical course in the personal maintenance a computer science degree assumes you handled elsewhere: showering on a schedule, eating something with more than one food group, replying to a message before it's a week old."*

## Corrected homepage copy (reference — already agreed)

**Subtitle:**
> A practical course in the personal maintenance a computer science degree assumes you handled elsewhere: showering on a schedule, eating something with more than one food group, replying to a message before it's a week old, and holding a conversation that isn't about your degree. Assessed by practical examination.

**What this course is:**
> SLOP1521 covers the material a computer science degree assumes you picked up somewhere else: sleep, hygiene, dress, conversation, money, and how to behave in front of another human being. Each topic is treated as a real subject, with real assessment, because — department opinion notwithstanding — it is one. The semester concludes with a five-station practical examination covering hygiene and health, fashion, small talk, social debugging, and daily survival.

**Who this course is for:**
> Anyone who has eaten the same bowl of instant noodles four nights running and called it meal planning. Anyone whose last haircut predates their current degree. No prior experience assumed; a working knowledge of at least one hoodie is expected.

**Learning outcomes:** keep as already written — plain, formal, earnest, zero jargon. Their earnestness only works because nothing else on the page is competing with it for the joke.

## Standing content rules (apply across all future weeks/pages)

- No CS/engineering jargon as a governing metaphor for any week, ever — occasional one-second puns are fine, sustained metaphors are not.
- **No sincerity breaks on content pages** — homepage, weekly content, assessment descriptions, FAQ sections. **Exception: the policies/disclosure page is allowed to be sincere.** It's read as information, not as the bit (a marker or a student consulting it wants a real answer), so the "content and disclosure" section approved earlier stays as written — don't flatten it back into deadpan on a future pass.
- Content note: any romantic/dating content (e.g. Week 9) is framed generally — "someone you're interested in" — never assuming a specific gender pairing.
- Case-study format per week (incident report → root cause → remediation; before/after; a rubric) is the reusable structural device — vary the specific stereotype content, keep this shape consistent, the same way real courses like *Justice* (Harvard) vary content inside one fixed weekly format all semester.
- Weekly reflection prompts (100–200 words, due at the start of the following week) should read like genuine reflective-practice assessment applied to trivial content — same "institutional seriousness, mundane subject" rule applies here too.

## Machine-checkable version (for spec/)

Everything above is written for a reader (human or agent) who needs the *why*. The rules below are the subset that can be turned into a literal, automatable check — worth encoding in `spec/` so `execute-plan`'s Red step can fail a task on a real violation, rather than relying on the agent noticing drift on its own the way the systems-engineering issue slipped through.

**Banned-term check (content pages only — exclude the policies page):**
A grep/regex check against page content for a maintained banned-terms list. Starting list, expand as new drift patterns show up:
`systems engineering`, `root-cause analysis`, `root cause`, `regression check`, `regression test`, `manual override`, `subsystem`, `runtime`, `deploy`, `merge conflict`, `TCP/IP`, `handshake protocol`, `cache invalidation`, `technical debt`, `` `git` ``, backtick-wrapped spans generally (a backtick around any word is itself a smell — see formatting note above).

**Framing-narration check (homepage/overview copy specifically):**
Ban explicit "this is the joke" phrases that narrate the premise instead of showing it: `taught as`, `framed as`, `presented as`, `in the style of`, `assessed like a`. A hit here is the "show, don't state" violation directly, and it's exactly the kind of phrase the systems-engineering subtitle used.

**Gendered-pairing check (Week 9 specifically, or any dating content):**
Ban gendered relationship nouns/pronouns tied to the student's own date/partner — `the girl you like`, `the guy you like`, `your girlfriend`, `your boyfriend` — require the neutral form instead.

**Sincerity-break check (content pages, excluding the policies page):**
Harder to fully automate since it's semantic, but a useful proxy list of tonal "tell" phrases: `take care of yourself`, `but seriously`, `in all seriousness`, `we hope you`, `remember to`. A hit doesn't always mean a real violation, but it's a cheap, high-signal flag worth a human/agent look rather than a hard fail.

**What this buys you:** these four checks turn "the voice feels off" (something you can only catch by reading, after the fact) into something `execute-plan`'s Red step can catch *before* a task is marked done — much closer to how the assignment brief wants your `spec/` checks to work: "protecting the promises your course makes that the build cannot."
