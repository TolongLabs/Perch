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

**The shape of a round trip that starts and ends at the same airport.** Every product treats it as a routing artefact.
None asks the traveller whether they want to push out and retrace the last leg, or reach the furthest point at the
halfway mark and come home a different way.

Is it empty because nobody thought of it, or because it does not work? **Probably neither - it looks empty because it
is small.** The strongest evidence it is real: the only discussion found anywhere was an article framing loop versus
one-way versus multi-stop as advice a human reads, which means the question is real enough to write about but nobody has
turned it into a control. The strongest evidence it is minor: Furkot could ship it in a sprint.

So it is a genuine gap, and a shallow one. It is enough to differentiate a hackathon entry. It is not a moat.

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
