# Who We Are Building For

> **Written 2026-09-07, the afternoon before the first mentor session.** Every claim on this page is `[assumed]`.
> `interviews/` is empty, so nothing here has been said by a real person yet - see [Evidence](#evidence). It is written
> now because the mentor session's second question is "break this user", and that question is wasted without one.

## Primary User

**Aisyah, 24 - the one who always ends up planning it.**

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Who**               | Graduated two years ago, junior in an office job in KL, renting a room, no car |
| **Who she goes with** | The same four or five friends from university, now on different jobs and shifts |
| **When she opens it** | The Tuesday night nobody follows up the group chat, and midnight on the Thursday before the trip |
| **What she does now** | The five-app stack, then a spreadsheet nobody else edits                      |
| **Cost of switching** | The group chat is free and already holds the trip                            |

**The Tuesday night and the Thursday midnight are the two moments**, and they are different problems. Tuesday is
nobody wanting to be the one who plans it. Thursday is her re-checking opening hours by hand because she does not
trust the plan to survive contact with a Sunday.

**The five-app stack**, in the order she reaches for it: ChatGPT for a draft itinerary, Xiaohongshu or Instagram saves
for where the photo is, a WhatsApp poll to decide, a Google Maps list to hold the places, Traveloka to book. See
[`../market/landscape.md`](../market/landscape.md).

**The switching cost is the hard one. Four of the five friends will not install a second app**, so the entry has to be
a shared link that works without an account, not a download. That is a product constraint, not a marketing problem.

**Before and after, in one sentence.**

> Right now Aisyah re-checks opening hours the night before and re-opens the argument in the group chat when something
> turns out to be shut. With this, the trip has already swapped in the option the group ranked next, and told everyone
> why.

**Why her and not a traveller with more time.** The bench only pays when the schedule is tight. A three-hour hole in a
two-day trip is a sixth of the trip; the same hole in a two-week trip is an afternoon they had spare anyway. **The
disruption claim and the short-trip user are the same choice** - naming a more relaxed traveller would quietly weaken
our own headline, so this is not an arbitrary narrowing.

**Why the planner, and not the group.** Everyone in the group is a user, but only one of them is in pain. Tripeza's own
copy names her too - it sells itself as removing the need for an "unpaid travel manager". She is the one who opens the
link first, and she is the one who stops if it does not work.

## Who We Are Deliberately Not Building For

| Not them                                        | Why not                                                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Solo travellers**                             | No group, so no vote, so no bench. The whole mechanism is dead. They are better served by ChatGPT |
| **Long-haul backpackers with weeks of slack**   | A closed stop costs an afternoon they had spare. The pain scales inversely with trip length     |
| **Families with young children, or agent-booked trips** | The decision is not democratic and the constraints are not preference-shaped               |
| **"Students", as a category**                   | Too broad, and the wrong shape - see below                                                     |

**Excluding "students" is deliberate and slightly against type** for a student competition. The rubric asks for a
target group narrower than "students", and an undergraduate on semester break has neither the 48-hour ceiling nor the
five clashing calendars. **Those two facts are the entire reason the bench is worth building**, so a user without them
is a user our mechanism does not help.

## Evidence

**None of it, yet. Everything above is `[assumed]`.**

| Claim                                                        | Backing                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| The five-app stack is what she uses instead                  | [`../market/landscape.md`](../market/landscape.md), from competitor scans - not from her |
| Malaysians are among the heaviest in-trip AI users           | Trip.com's published data, in [`../market/competitors.md`](../market/competitors.md) Tier 1. Supports reach, not this person |
| She is the unpaid travel manager                             | Tripeza and SwipeSights both sell against this exact role. That the pain funds products is not the same as our evidence |
| Her age, her job, the Tuesday night, the four friends who will not install anything | **Invented.** No interview supports any of it |

**What turns this from a guess into a target group** is issue #4, three real conversations. Until then this page is
worth the 2-3 band, and it is on the page so that a mentor can break it tonight rather than so that it can be cited.

**A synthetic panel was run against this page on 7 September** and is recorded in
[`synthetic-panel-2026-09-07.md`](synthetic-panel-2026-09-07.md). **It is not evidence and does not upgrade any claim
above.** Three models were given the identity block and asked six behavioural questions with the testable claims
withheld. It corroborated the install refusal and the trip length, and it contradicted two things this page and the
product both assume: **that the group votes**, and **that a broken stop gets replaced rather than dropped**.
