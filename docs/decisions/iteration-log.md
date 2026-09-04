# Iteration Log

Every time our thinking changed, newest at the bottom. **Add a row the day it happens**, not later.

A good entry answers three things: what we thought before, what we think now, and **what caused the change**. The cause
is what earns the marks.

| Date       | What Changed                                                                 | Why                                                                                       | Triggered By                                    |
| ---------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 2026-09-01 | Idea logged: map-first travel planner with two round-trip strategies         | The same-airport round trip was the part of the dump with the most thinking already in it | Jin Siang's first dump                          |
| 2026-09-01 | Stopped claiming the planner as novel; narrowed the claim to the round trip  | Wanderlog, Roadtrippers and Furkot already ship the rest                                  | Competitor scan, `../market/competitors.md`     |
| 2026-09-01 | Routing reframed as the Tourist Trip Design Problem rather than our own idea | It is a documented orienteering-problem variant; citing it is stronger than inventing it  | Same scan                                       |
| 2026-09-01 | Trip length became an input, then an output                                  | The round-trip strategies are defined in days, and a group's days come from its calendar  | Building the availability poll                  |
| 2026-09-01 | Corrected which rubric we score against, from the 2025 one to the 2026 one   | Mindmaps are a real 8% band, the repo must be public, and Creativity is 15% not 25%       | Re-reading the organisers' published rubric     |
| 2026-09-02 | Day-claiming dropped; the planner now proposes everything                    | A planner that hands people homework fails the brief's "faster and less stressful" test   | Jin Siang, mid-build                            |
| 2026-09-02 | Group became the default; solo hides the group and discretion panels         | The problem statement names groups first, and solo is the narrower case                   | Jin Siang                                       |
| 2026-09-02 | Votes became a draft with an explicit Apply step                             | Live re-planning on every toggle made the trip feel unstable while the group was deciding | Jin Siang                                       |
| 2026-09-04 | Travel-planner notes moved here; the other `playground` ideas stayed put     | Those ideas predate the 30 Aug problem-statement release and cannot be entered as ours    | Workspace audit                                 |

## Longer Entries

Some turns need more than a row. Add them here, newest at the bottom.

### 2026-09-01 - The differentiator is much smaller than we thought

**Before.** A map-first travel planner with budgeting, routing and recommended stops sounded like a product.

**After.** It is four shipping products. Wanderlog markets "your itinerary and your map in one view" - our description,
their words. Roadtrippers generates itineraries from a 42-million-trip corpus. Furkot already does time-budget-driven
overnight stops. And the routing underneath is the Tourist Trip Design Problem, with an academic literature.

**Why.** A competitor scan run before any more building. Three products were read directly rather than recalled.

**What we gave up by doing this.** The comfortable version of the pitch. What is left is narrower and true: nobody
treats the shape of a same-airport round trip as the traveller's decision.

### 2026-09-02 - We are not a planning tool, we are a proposal tool

**Before.** The group's preferences would get into the app by each member planning part of the trip - a fair share of
days each, merged and re-routed automatically.

**After.** The planner proposes the entire trip from what people like, and the group only votes. Nobody plans anything.
Claiming days was removed entirely; the one behaviour worth keeping came back as must-go places.

**Why.** The brief says the app should make planning "faster and less stressful", and our real competitor is a WhatsApp
group that asks nothing of anybody. Distributing work is not removing it.

**What we gave up by doing this.** One of our two novelty claims - nothing else found divides authorship of an itinerary
and reconciles it. Originality now rests entirely on the round-trip choice. Taken knowingly. Full reasoning in
`dropped.md`.

### 2026-09-02 - One mechanism, three jobs

**Before.** Voting, budget-trimming and disruption recovery were three separate features that happened to coexist.

**After.** They are one mechanism. The vote produces the itinerary; the losing options become a ranked bench; the bench
is the cut list when we are over budget **and** the replacement pool when a stop closes. A monsoon substitution needs no
new vote, because the group already approved everything on the bench.

**Why.** Working out how disruption recovery should choose a replacement, and realising the vote had already produced
the ranking it needed.

**What we gave up by doing this.** Nothing yet - but it couples three behaviours, so a change to voting now changes how
disruption recovers. Worth remembering when one of them next needs to move.

### 2026-09-04 - What we could and could not bring in from `playground`

**Before.** The travel-planner thinking lived in a separate scratch repo, `playground`, alongside several other
candidate ideas that had been scored there against a general-purpose rubric.

**After.** Everything belonging to the travel planner is now on this branch - the raw dumps in `../inbox/`, the two
working notes beside this one, and the mockup in `../prototype/`. **The other ideas in that repo stayed there.**

**Why.** They were written 24-26 August 2026. The CodeNection problem statements were released on **30 August**, and the
rules require the project to be developed after that date. Idea logs are not product code, but entering pre-release
work as our ideation for this competition is not a line worth walking up to, and that repo was itself seeded from a
different event's material.

**What we gave up by doing this.** Breadth Of Exploration (3%) asks for several distinct ideas compared, and this branch
has one. That is a real and knowing cost. The fix is cheap and still available: generate genuinely new alternatives
here, dated now, which are worth more than the ineligible ones would have been anyway.
