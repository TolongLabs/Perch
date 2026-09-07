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

**Corrected 2026-09-06 and weaker than it was.** The 1 September scan concluded "nobody offers the shape of a
same-airport round trip as a choice". A second scan looking internationally found two products that do something very
close, both filed as *route* planners rather than *trip* planners: **Contour** plans a loop that "goes out on good
roads and comes back on different ones, sized to the time you have", and **calimoto** exposes the loop as controls for
distance, compass direction and road character. See `../market/deck-scan.md`.

What honestly survives, and it has to be said in full rather than compressed:

> Route planners already vary the return leg for drivers. **No multi-day trip planner puts the shape of the round trip
> to the travellers as a decision** - retrace, or go out and come back a different way - **and then plans places,
> budget and a group vote around the answer.**

Furkot supports loops, Roadtrippers only closes them by adding the start as the final stop, and optimisers hold the
endpoints fixed and reorder the middle. None of those ask. But "nobody does this" is now false and must not be said.

Secondary, and weaker because it is a well-trodden mechanism: voting produces the plan, the cut list when over budget,
**and** the pre-approved replacement when something breaks. One mechanism doing three jobs is a cleaner story than
three features.

**This is now the stronger of the two claims**, since the round-trip one lost ground on 6 September. It carries its own
`[not verified]` though: **Troupe** ships polls with ranked voting for group trips and nobody has opened it. Read it
before the ranked bench is pitched as ours.

## The Honest Reason This Might Fail

Trip planners are among the most-built hackathon projects there are, and Originality is 7%. The Poor band reads "copied
or very common idea". Wanderlog already markets "your itinerary and your map in one view" - our own description, in
their words. If the pitch opens with "a travel planner", we have already lost that band before the differentiator is
mentioned.

The second risk is the Deployment Phase. Attracting real public users in October needs real place data and metered map
APIs. The mockup avoids this with invented sample data; a deployed build cannot.

**Partly answered 2026-09-06.** The slide-deck mockup hands the map to Google Maps with a plain directions URL, which
needs no key and works today. That removes the metered map API from the critical path. Real *place* data is still
unsolved.

**A third risk, found 2026-09-06.** The slide-deck mockup added photo spots, cultural cautions and a destination news
feed. All three are occupied by mature categories - Locationscout and PhotoHound for spots, Sitata and the Japan
Tourism Agency's own free app for alerts. Pitching any of them as a novel feature is the fastest way to lose
Originality. `../market/deck-scan.md` has the detail.

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

## Checked Against The Rubric

Scored 1 September 2026 in the `playground` repo against the official 2026 prototype rubric - **not** the 2025 one an
earlier pass had been reading - and re-checked on 4 September when the note moved here. The percentages are the
rubric's.

### Ideation - 25%, The Largest Category

| Criterion                    |   % | Where We Stand                                                                                                                     |
| ---------------------------- | --: | ---------------------------------------------------------------------------------------------------------------------------------- |
| Visual Diagrams And Mindmaps | **8** | **Nothing yet.** The top band wants a mindmap plus a problem tree or user flow. The biggest single unclaimed block on the board   |
| Iteration And Idea Evolution |   7 | **Partly banked.** `../decisions/` holds the log, the graveyard, and the two working notes behind them                              |
| Mentor Consultation          |   7 | **Nothing yet.** The window is 31 Aug - 13 Sept, first come first served, two slots a day                                           |
| Breadth Of Exploration       |   3 | **One idea logged here**, where the band asks for several compared. `../decisions/iteration-log.md` records why the earlier `playground` ideas cannot fill it |

### Impact - 20%

| Criterion                       |   % | Where We Stand                                                                                     |
| ------------------------------- | --: | ---------------------------------------------------------------------------------------------------- |
| Effectiveness                   |   7 | Judged against whoever we name, and we have not named them                                         |
| Understanding The Problem Context | 5 | `../market/` gives the market context; the *causes* of stressful trip planning are still unargued  |
| Target Group Alignment          |   5 | **Blank.** "Travellers" is the 2-3 band, "broad everyone audience". See Who Exactly above           |
| Reach And Scalability           |   3 | Unargued                                                                                           |

### Creativity And Novelty - 15%

Originality **7** - heavy prior art drags toward the 2-3 band, "similar to existing apps with small changes"; the
round-trip decision is the case for 4-5. Novel Features Or Twists **5** - the round-trip strategy choice is the genuine
standout. Differentiation **3** - `../market/competitors.md` answers this directly.

### Feasibility - 15%

Tech Viability **6** - name the stack, and cite the **Tourist Trip Design Problem / Orienteering Problem** literature;
standing on known research reads as competence. Scope Realism **5** and Resource And Time Awareness **4** are cheap
marks and still unwritten.

### Design - 10%

Visual Consistency **4**, Usability **4**, Mockup Completeness **2**. `../prototype/travel-planner.html` covers most of
this already, and one judge is a product designer.

### Presentation - 15%

Clarity 5, Structure 4, Delivery 4, Engagement 2 - the 3-5 minute video. Not started.

## Open Questions

- **Who is this for.** Everything above is weaker until this is answered, and it cannot be answered from a desk
- Do members see each other's picks while choosing, or only after the merge? Blind avoids anchoring, open avoids
  duplication
- Pre-trip disruption only, or mid-trip too? Mid-trip is harder and more valuable
- What severity threshold justifies rewriting an itinerary? Without one the app cries wolf
