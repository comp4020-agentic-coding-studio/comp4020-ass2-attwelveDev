# SLOP1521 — Lecture/Lab/Assessment Consistency Pass
### Consolidated critique list, confirmed fixes, and new CLAUDE.md rules

## Process note before starting
This touches every week, learning outcomes, assessment weighting, and adds new standing rules — it's a genuine feature-level revision, not a quick patch. Worth running through `brainstorm-feature`/`plan-feature` rather than handing this list straight to `execute-plan`, so the cross-file consistency work gets a real task breakdown (one plan, tasks in dependency order — e.g. Week 1's five-topics fix and Week 3's interview fix are independent and can run in any order; the CLAUDE.md rule and its spec/ check should land before the week-by-week content passes that depend on them).

## Core rule (make this a CLAUDE.md rule, not a one-time fix)

**Every concept, named example, or case study must be introduced in a lecture before it appears in that week's lab or any assessment.** Students attend lectures first — a lab or assignment may reference or extend something the lecture already covered, but never introduce it first. This applies to:
- Concepts and terminology (define it in the lecture's Definitions section)
- Named case studies (the full content must appear in the lecture, not just a lab)
- Any concept used in a later week's content that would otherwise assume prior knowledge from a week not yet reached

## Confirmed, specific fixes

The examples here may not be complete; they are limited, so please check the entire course for consistency against the core rule above, and the standing rules below.

**Week 1 — the five recurring topics.** Key point 5 currently says "the course's five recurring topics" without naming them, while the lab explicitly lists hygiene, dress, sleep, conversation, and money. Fix: name all five explicitly in the lecture body.

**Week 1 — the "how" of habit-building.** Currently only "what" (habits take ~66 days) and "why" is covered. Add the "how," and use this citation, which is a genuinely strong fit — it's the actual research basis for the course's own repeated line, "a plan needs a time, not an intention":
> Gollwitzer, P. M. (1999). *Implementation intentions: Strong effects of simple plans.* American Psychologist, 54(7), 493–503. Rewording a goal from "I will exercise more" to "when I finish lunch Monday, I will run for twenty minutes" roughly doubles follow-through, per the pooled evidence.
Surface the connection explicitly: this citation is *why* every plan in this course needs a stated time.

**Week 3 — "job interview" used before Week 11 defines "interview."** Confirmed in both the lecture hook ("Would you wear what you're wearing right now to a job interview?") and the lab ("The interview for the internship you have already told everyone you got"). Fix, in the lecture only (the lab needs no change once this lands):
- Add to Week 3's Definitions: *Job interview* (noun, brief): a short, structured meeting in which a candidate is evaluated for a role. Covered in full in Week 11.
- Soften the hook: "Would you wear what you're wearing right now to a job interview? We'll cover interviews properly in Week 11 — for now, it's just another occasion your clothes need to match."

**Week 4 — the "how" of sleep and exercise.** Both key points currently state research findings (what/why) with no procedure. Add real, simple guidance — not every "how" needs its own citation if a plain procedural list is accurate and reads fine; use one only where it adds something. Sleep hygiene research (consistent wake time, a wind-down cutoff before screens) is a reasonable, findable addition if a citation is wanted; a plain how-to is also fine here.

**Week 9 — the 600-word message must appear in the lecture in full**, not just referenced by its first two sentences with the full text living only in the lab. Same underlying rule as above, applied to this specific case study.

**Week 10 — cooking must appear as a lecture key point**, since the final exam includes a cooking station and nothing currently introduces it beforehand.

**Week 11 — meetings must appear**, likely as the third key point, since the learning outcome explicitly names "professional conduct in interviews, meetings, and written workplace communication" and only interviews and email currently appear.

**Learning outcome — weather-appropriate attire** has no matching lecture or lab content anywhere. Fix: add one weather-mismatched example to Week 3 (an outfit that's occasion-correct but wrong for the day's actual weather) — covers the gap and adds a new, genuinely funny failure mode rather than feeling bolted on.

## Further Suggested Fixes

- Week 8 Lab's incident report should be introduced in the lecture, instead of directing to the lab. And how is this incident report connected to the rest of the lecture content covered thus far?
- Week 11 Lab's email is referred to in the introduction in the lecture; this should appear in full in the lecture

## Standing rules to add

- **Every lecture needs a "how," not just a "what" and "why," for every concept it covers** — explained simply, assuming zero prior familiarity, without assuming students already know how to do the thing. This should follow the satire established on the course website already, that computer students are naive and do not know how to do these basic things, so these "basic" concepts need to be spelled out with enough detail that they can follow along and learn. Real research can back the "how" where it genuinely exists and adds something (as with Gollwitzer above); otherwise a plain, sensible procedure is correct and shouldn't be padded with a citation just to look rigorous. The lecture content page can state the "how" briefly; the slides themselves must include it in real detail. For example, week 2 lecture should mention how to do all of showering, deodorant, laundry, haircut, skincare, in simple but detailed enough terms that students can follow. Week 3 needs to have include how to read an occasion, and how to assemble an occasion-appropriate outfit. And so on.
- **Assignment mentions in lectures must be detailed, not a passing reference** — spell out the actual rubric content that's relevant to that week specifically (e.g. Week 2 should show Assignment 1's actual rubric; Week 10 should show Assignment 3's actual budget criteria, not a one-line pointer).
- **Lab handoffs from lectures must give a real overview**, not a bare pointer — a sentence naming what the lab actually does and how it builds on what the lecture just covered.
- **Reference list formatting:** any explanatory clause attached to a citation (e.g. "average 66 days to form a habit, range 18–254") must sit on its own line, visually distinct (smaller or subtly styled) from the formal citation itself, never appended to the same line.
- **Main lecture overview page** needs the same structure as the labs overview: how lectures run, highlights, structure, and a brief justification for why they're built this way (for engagement, collaboration, understanding). Give the **labs overview page** the same justification treatment — it doesn't have one yet. A strong, real, easily-checked citation exists for this exact purpose, which should be included:
  > Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). *Active learning increases student performance in science, engineering, and mathematics.* PNAS, 111(23), 8410–8415.
- **Photos needed** (real, not placeholder) for Weeks 2 and 3.
- **References page** needs to be linked from the lectures page, with links back to each week's own lecture page.
- **Week 12 second reflection:** add a semester-progress reflection, assessed the same way as the others. Change the drop rule from "best 10 of 11, drop worst 1" to "best 10 of 12, drop worst 2" — the 15% Weekly Reflections weighting does not need to change, since exactly 10 still count either way. State this explicitly to the agent so it doesn't "helpfully" rebalance percentages that don't need touching.

## A mechanical check worth adding to spec/

The core complaint — "a named example in a lab must already exist in that week's lecture" — is checkable, not just reviewable by eye: a script that extracts named case-study identifiers (Jordan's Week, the 600-word message, the fridge, the bad email, the sock pile, and any future ones) from each lab file and asserts each also appears in that week's lecture file. Same spirit as the banned-jargon check already in the voice brief — turns a rule that currently depends on a full manual re-read into something `execute-plan`'s Red step can catch automatically.
