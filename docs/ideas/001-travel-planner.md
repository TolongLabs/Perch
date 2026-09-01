# 001 - Travel Planner, map-first with a round-trip decision

**Date:** 2026-09-01 · **Problem statement:** Travel Planner · **Status:** exploring, with a working mockup

## In One Sentence

A trip planner that treats the same-airport round trip as a decision the traveller makes, rather than a routing
accident.

## Who Exactly

**No good answer yet.** This is the weakest part of the idea and the most expensive gap - Target Group Alignment is 5%
on its own, and Effectiveness (7%) is judged against whoever we name.

"Travellers" is the rubric's 2-3 band, "broad everyone audience". Three candidates, none chosen and none interviewed:

- A group of four Malaysian undergraduates with one car between them and a five-day gap in the semester
- A first-time visitor flying into KUL and out of KUL, who does not know that going north and coming back is a choice
- Working adults who can only travel weekends, so the trip is two days and every hour of it is contested

The availability poll in the mockup suggests the third is the most real, because it is the only one where the
constraint bites before anyone opens a map.

## The Problem They Have Today

They plan in a WhatsApp group and a shared spreadsheet. Dates get settled by scrolling back through messages. Places
get suggested and lost. Somebody makes the route up in their head, and it is usually a straight line out and the same
line back, because nobody wants to do the thinking twice.

When something falls through - a closed island, a flood warning - the whole thing reopens in the group chat.

## Why They Would Open It A Second Time

Honestly: for the disruption case more than the planning case. Planning happens once; something going wrong happens on
every trip. A planner that quietly repairs itself when a stop closes has a reason to be reopened that a static
itinerary does not.

## What Makes It Different

One thing survived the competitor scan (see `../market/`): **nobody offers the shape of a same-airport round trip as a
choice.** Go out and retrace the last leg, or reach the furthest point at the halfway mark and come back a different
way. Furkot supports loops, Roadtrippers has a start and a destination, optimisers hold the endpoints fixed and reorder
the middle. None of them ask.

Secondary, and weaker because it is a well-trodden mechanism: voting produces the plan, the cut list when over budget,
**and** the pre-approved replacement when something breaks. One mechanism doing three jobs is a cleaner story than
three features.

## The Honest Reason This Might Fail

Trip planners are among the most-built hackathon projects there are, and Originality is 7%. The Poor band reads "copied
or very common idea". Wanderlog already markets "your itinerary and your map in one view" - our own description, in
their words. If the pitch opens with "a travel planner", we have already lost that band before the differentiator is
mentioned.

The second risk is the Deployment Phase. Attracting real public users in October needs real place data and metered map
APIs. The mockup avoids this with invented sample data; a deployed build cannot.

## Could We Build It

The routing is the **Tourist Trip Design Problem**, an orienteering-problem variant with an established heuristic
literature - so the hard part is solved and citable rather than invented. A greedy corridor heuristic already produces
sensible routes in the mockup.

Smallest version that still works: one country, a fixed place dataset, the round-trip choice, and the group vote. No
live traffic, no live weather - both are modelled and clearly labelled as models.

## What Already Exists

A working mockup, verified headless: real coastlines, pan/zoom, 26 sample places, budget with beds reserved before
stops, hostel-to-5-star lodging, a 21-day availability poll on real dates, planner shortlist plus group vote with an
apply step, a ranked bench, simulated disruption with automatic substitution, must-go places that outrank every filter,
and a departure-time model for Malaysian traffic.

It is a mockup, not an implementation. Sample costs, appeal scores and nightly rates are invented; weather events are
simulated.

## Open Questions

- **Who is this for.** Everything above is weaker until this is answered, and it cannot be answered from a desk
- Do members see each other's picks while choosing, or only after the merge? Blind avoids anchoring, open avoids
  duplication
- Pre-trip disruption only, or mid-trip too? Mid-trip is harder and more valuable
- What severity threshold justifies rewriting an itinerary? Without one the app cries wolf
