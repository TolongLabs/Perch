# The Landscape

Written 2026-09-01, after `competitors.md`.

## Where It Is Crowded

Nearly everywhere we started. Map beside itinerary is Wanderlog's own tagline. Stops-along-a-route is Roadtrippers,
backed by 42 million trips. Time-budget-driven overnight stops are Furkot, shipped. Budget tracking, accommodation,
travel modes, culture-versus-nature filtering, day counts: all present in at least one shipping product, most in
several. Malaysia specifically already has a handful of AI itinerary generators that take a destination, a number of
days and a budget.

The routing underneath is not novel either - it is the Tourist Trip Design Problem, with an academic literature and
known heuristics.

## Where The Gap Is

> **Superseded 2026-09-06.** What follows was written on 1 September and was wrong. It is kept because the rubric pays
> for directions we abandoned, and because being wrong in public and correcting it is the evidence. The correction is
> the section after it.

~~**The shape of a round trip that starts and ends at the same airport.** Every product treats it as a routing
artefact. None asks the traveller whether they want to push out and retrace the last leg, or reach the furthest point
at the halfway mark and come home a different way.~~

~~Is it empty because nobody thought of it, or because it does not work? **Probably neither - it looks empty because it
is small.**~~ ~~So it is a genuine gap, and a shallow one. It is enough to differentiate a hackathon entry. It is not a
moat.~~

## The Gap, Corrected - 2026-09-06

**Two products already ship the round trip as something other than a routing artefact**, and the September scan missed
both because it searched for *trip planners* while these file themselves as *route planners*.

- **Contour** plans a loop that "goes out on good roads and comes back on different ones, sized to the time you have"
- **calimoto** makes the loop a set of controls: distance, compass direction, road character

Both are in [`competitors.md`](competitors.md). Neither has a group, a vote, a trip budget, or places with appeal
scores; both optimise roads rather than a holiday; and Contour decides the shape rather than offering it as a choice.

**What honestly survives**, and it is thin enough that it must be spoken in full rather than compressed into "nobody
does this":

> Route planners already vary the return leg for drivers. **No multi-day trip planner puts the shape of the round trip
> to the travellers as a decision** - retrace, or go out and come back a different way - **and then plans places,
> budget and a group vote around the answer.**

**Is that still enough?** For Novel Features Or Twists (5%), probably - it is a visible, demonstrable control no other
*trip* planner has. For Originality (7%), it is now weaker than the idea log claims, and the idea log has been
corrected to match. The stronger remaining angle is **the one mechanism doing three jobs** - the vote produces the
itinerary, the ranked losers become the cut list when over budget and the replacement pool when a stop closes - and
even that needs Troupe read directly first, since Troupe ships ranked group voting.

## Why Ours Exists

The version that survives everything in `competitors.md`:

> Every trip planner treats a same-airport round trip as a line out and the same line back, so the traveller solves the
> interesting half in their head. We make it the first decision, and then let the group vote rather than argue - and
> when the monsoon closes a stop, the trip repairs itself from choices the group already approved.

What that argument deliberately does not claim: that our suggestions are better (Roadtrippers wins), that our layout is
new (Wanderlog wins), that our routing is clever (the literature wins), or that group collaboration is novel (Wanderlog
again).

**The thing to beat is not Wanderlog. It is the WhatsApp group.** That means the planner must produce a complete trip
before asking anyone to do anything - which is why the day-claiming design was dropped (see
`../decisions/dropped.md`).
