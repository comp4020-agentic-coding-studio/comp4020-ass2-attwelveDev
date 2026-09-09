---
title: "Friendship and Group Communication"
description:
  A friend group as a distributed system with no single point of
  coordination, examined through a formal incident report
week: 8
date: 2027-04-27
teachers:
  - noor-kalantari
related:
  - sessions/week-08
  - assessments/assignment-2-touch-grass
---

## Overview

A friend group with no designated organiser is a distributed system with
no coordinator node: plans reach consensus only if enough members happen
to read the same message at the same time. Most "we never actually hang
out" complaints are a coordination failure, not a friendship one.

## Content

- coordination without a single point of failure: rotating who proposes
  plans
- reading a group chat's actual load-bearing member, versus its most
  active one
- root-causing a cancelled plan instead of assigning blame for it
- group size against communication overhead: why six people need more
  structure than three

## Case study

An incident report, filed the way a production outage would be: *"At
19:40, a dinner plan for six was confirmed by three replies and assumed
final by the organiser. At 20:15, two attendees had independently
messaged a fourth channel neither the organiser nor the other three could
see. `Root cause`: the group runs on two group chats, and no message
crosses between them."* The friendship was never in question; the
messaging topology was the actual point of failure.

## Reflection

Due 12:00 Tuesday of week 9: name your friend group's actual load-bearing
member — the person whose absence from a plan is most likely to cancel
it — and describe why.

## Assessment tie-in

Assignment 2 (Touch Grass Field Study) is due today at 12:00.
