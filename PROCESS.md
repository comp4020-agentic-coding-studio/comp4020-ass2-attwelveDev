# Process overview

## What I built

A satirical course teaching CS students the life skills their own stereotypes
assume they were never taught: hygiene, sleep, small talk, dress; delivered
with total institutional seriousness, though the content is designed to be
genuinely useful. Lectures and labs share one fixed structure across all twelve
weeks; assessment stays tied explicitly to what was taught.

## How I got here

I continuously followed the spec-driven development process, working
through three self-authored skills: `brainstorm-feature`, `plan-feature`,
`execute-plan` ([`0e2f31d...fcfe8e2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/0e2f31d...fcfe8e2));
separating exploration and planning from execution so I could `/clear` between
them and keep context small, which mattered most when handling large rewrites,
such as overhauling labs and lectures.

### What a good course looks like and encoding it in the harness

In the early stages, only six weeks had case studies; week
3 had an assessment tie-in no other week had; week 12 had no content at all.
Rather than weaken it to "same slots, some optional," I wrote a new `CLAUDE.md`
rule encoding this structure: Overview, Content, Case study, Reflection,
Assessment tie-in; rewrote all sixty slots and encoded it as
`spec/weekly-structure.test.ts`, asserting all five headings, in order, on every
rendered page; verified by deliberately deleting one week's heading,
confirming the test failed, then restoring it ([`bbb6081...49dc804`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/bbb6081...49dc804)).

[ANU](https://www.anu.edu.au/students/academic-skills/writing-assessment/presentations/structuring-your-presentation)'s
guidance on structuring a presentation, and [UNSW](https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/class)'s
and [THE](https://www.timeshighereducation.com/campus/guide-running-engaging-and-interactive-tutorials)'s
guidance on running an engaging tutorial, gave me a concrete standard: a
signposted structure, practical, collaborative activities, and not just
listening. I decided every lecture, without exception, needed the same
well-grounded five slots: Introduction, Definitions, Body, In-lecture activity,
Conclusion. I changed `spec/weekly-structure.test.ts` and `CLAUDE.md` to reflect
this enhanced structure ([`827b6da`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/827b6da)).

Case studies were appearing in labs before any lecture had taught them. A rule
that a lab or later week can never introduce a concept before its lecture
does looked obvious to add to `CLAUDE.md`. However, a mechanical check can
strictly enforce this, whereas an agent bypassing `CLAUDE.md` is a silent
failure. I made `caseStudies` a typed field on both lectures and labs, and
`spec/case-study-provenance.test.ts` asserts every lab's tagged case study
exists on that week's lecture first, checked by setting a deliberately
mismatched tag, confirming the test failed, then removing it ([`00930a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/00930a1), [`482cc21`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/482cc21)).

### What I couldn't encode, and built a human-review gate for instead

The voice and satirical landing of the course cannot be mechanically checked.
After the first iteration's unsolicited use of jargon spoiled the absurdity and
humour of CS stereotypes, `spec/voice.test.ts` asserted a banned metaphor is
absent ([`889ce5e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/889ce5e)),
`CLAUDE.md` confirmed the jargon-ban and the institutional seriousness satire ([`898bd57`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/898bd57)),
but these still cannot assert the replacement is *genuinely* funny. Rather than adding
a longer banned-word list, I added a `Human review:` field to `plan-feature`,
`execute-plan` ([`4e0dcf5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/4e0dcf5)):
any task a mechanical check can only approximate now names the artefact I must
explicitly accept or reject. I deliberately left out a more elaborate automated
voice checker. I read `spec/voice.test.ts` and confirmed every assertion in it
was presence/absence only, none evaluating the humour and satire, and decided
that gap was expected, and unrealistic to close with more regex.

I used this gate on rewriting the tutor bios. The agent's first pass removed all
the banned jargon, passed every check, and even with `CLAUDE.md`'s affirmation,
it still read as generic and unfunny. I rejected it twice, asking for sharper,
more absurdly serious credentials each time, before accepting ([`9e9b814...b450bcf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/compare/9e9b814...b450bcf)).

The gate paid off again later, on something unrelated to voice entirely: it
caught a Learning Outcomes range display that passed every test but visually
implied numbers were clickable when they weren't, a UX defect no assertion was
written to see ([`0dc85ca`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-attwelveDev/commit/0dc85ca92a02602e309de96257dfc65070301fc7)).
