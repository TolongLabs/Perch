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

> **Rewritten 2026-09-06**, after the Tier 1 scan in [`competitors.md`](competitors.md) replaced a list of niche apps
> with the products a judge would actually name. The earlier version of this section aimed the pitch at Wanderlog. That
> was aiming at the wrong thing.

**What we are actually competing with**, for four Malaysians planning a trip in 2026, in the order they reach for them:

1. **ChatGPT**, to generate the plan. Around 40% of travellers worldwide have now used AI to plan a trip
2. **Xiaohongshu or Instagram**, for where to go and where the photo is taken
3. **A WhatsApp group with native polls**, to decide
4. **Google Maps lists**, to hold the places
5. **Traveloka or Trip.com**, to book it

**Not one of those is a trip planner, and that is the point.** The stack is free, already installed, and socially
default. Any pitch that positions us against Wanderlog is answering a question nobody asked.

**Where that stack breaks**, and this is the whole argument:

- **ChatGPT gives you a plan and forgets it.** There is no state, so nothing can be repaired later
- **Google Maps holds places, not decisions.** Its own reviewers say collaborative editing is "glitchy and not
  real-time", leaving invitees stuck read-only
- **A WhatsApp poll produces a result, not a plan.** Nobody turns thirty votes into a routed itinerary
- **Xiaohongshu inspires and never commits.** It is a feed, not a trip
- **Nothing in the stack knows the trip exists once the trip starts.** When a stop closes, all five tools are silent
  and the group chat reopens

The version that survives all of that:

> Every tool a group already uses can produce a plan. **None of them owns the plan afterwards.** We hold the trip as
> something the group has approved, so that when a stop closes it repairs itself from options they already voted for -
> no new argument, no reopened group chat.

What that argument deliberately does not claim: that our suggestions are better (Tripadvisor's billion reviews and
Roadtrippers' 42 million trips win), that generating an itinerary is impressive (ChatGPT commoditised it), that our
layout is new (Wanderlog wins), that our routing is clever (the literature wins), that group voting is novel (WhatsApp
ships it), or that photo spots are our territory (Xiaohongshu owns that, not PhotoHound).

**The thing to beat is still not Wanderlog. It is the five-app stack**, and specifically the moment it fails - which is
the moment the problem statement itself names, "re-planning when something changes mid-trip". Our differentiator and
the brief are the same sentence. That is the strongest position available to us and it should open the pitch.

**Why the planner proposes rather than asks.** The competitor above that asks least of the user is the group chat,
which asks nothing. That is why day-claiming was dropped - see [`../decisions/dropped.md`](../decisions/dropped.md).
