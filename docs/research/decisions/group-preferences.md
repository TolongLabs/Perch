> **Moved from the `playground` repo, 2026-09-04.** Written 1 September 2026 as idea 7's working note and left behind
> when the travel planner moved here. Prose is unchanged; only the headings and the cross-links were adjusted to match
> this branch. The original is recoverable from `playground` at commit `9caa867`.

# Syncing Preferences Across A Group

Answering the second of the four capabilities the CodeNection brief names. Dumped 1 September 2026.

This file is an **ideation asset**: it records two options, the reasoning between them, and what
was dropped. The rubric awards *Iteration and Idea Evolution* (7%) for exactly that — "including
dropped directions".

---

## The Dump, As Said

> i would make 2 choice, first of all we splits the plan, so the final destination and the starting
> point is obviously fixed, but splitting the plan means within a session, the 1st guy would plan
> day 1-3 and follows by 2nd person planning 3-6 and so on and so for, so the AI would merge all
> the days in and find the best route for all these places, the other option is voting system, so
> every member can access the session and first vote for free days like when they are free, they
> can highlight it in green and see when is the date that stacks, after that everything comes in
> voting, vote for where we go

---

## Option A - Split The Plan

Start and end are fixed for everyone. Inside a shared session, the itinerary is divided by days:
member 1 takes days 1–3, member 2 takes days 3–6, and so on. Each person fills their own stretch.
The planner then merges every nominated place and re-routes the whole trip.

**What it really is.** Once the optimiser re-sequences everything, the day boundaries dissolve —
member 1's pick can land on day 5. So the day split is not a *schedule*, it is a **fair-share quota
for nominating places**. Everyone gets an equal voice, measured in days' worth of stops. That is a
cleaner way to describe it, and a stronger one.

**Why it is worth having.** No product found in [../market/competitors.md](../market/competitors.md) does this. Wanderlog
has collaborative editing; nobody divides authorship of an itinerary and then reconciles it
automatically. This is the originality claim.

**Where it breaks.**
- Days 1–3 and 3–6 overlap at day 3. Trivial to fix, but the boundary rule needs stating.
- Geographic incoherence. If one member picks only northern places and another only southern, the
  merged route zigzags and blows the day budget. The optimiser softens this; it does not solve it.
- No conflict rule. If the merged set is over budget or over days, something must be cut, and
  Option A alone has no mechanism for deciding what.

## Option B - Voting

Everyone joins the session. **First, availability**: each member highlights free days in green, and
the overlap shows where dates stack. **Then, places**: the group votes on where to go.

**Where it is strong.** Availability-stacking is the genuinely painful part of group travel and it
is the natural first step — you cannot plan days until you know which days exist.

**Where it is weak.** Both halves are well-trodden. Availability overlap is When2meet and Doodle;
place voting exists in several planners. Against *Originality* (7%), whose 2–3 band reads "similar
to existing apps with small changes", voting alone will not score.

---

## The Reconciliation: They Are Phases, Not Alternatives

They answer different questions and run in sequence.

1. **Availability voting** — green calendar, find the stacking window. This produces the trip
   length and dates.
2. **Fair-share nomination (Option A)** — each member owns a quota of days' worth of picks inside
   the agreed window.
3. **Merge and route** — the optimiser sequences every nominated place into one coherent trip.
4. **Voting as the conflict rule** — when the merge is over budget or over days, the group votes on
   what to cut. Voting stops being the whole mechanism and becomes the tie-breaker.

This keeps the novel part (fair-share authorship) as the headline and uses the familiar part
(voting) where it genuinely belongs — resolving conflict, not generating the plan.

**It also closes a loop in the existing build.** Trip length is currently a slider the user sets by
hand. Under this design it stops being an input and becomes an *output* of the availability
overlap. And it retrospectively justifies why *discretion* — the extra-days and extra-budget
sliders — is solo-only: a group's stretch is bounded by the calendar overlap, not by willingness.

---

## One Warning For The Pitch

"The AI would merge all the days in and find the best route" — **the merging and routing is not
AI.** It is the Tourist Trip Design Problem, an orienteering-problem variant with a known heuristic
family (see [../market/competitors.md](../market/competitors.md)). Calling a solved optimisation problem "AI" in front of
judges from Binance, Intel, Grab and CoinGecko invites a question that undercuts the Feasibility
band. Say "the optimiser merges and re-routes", and cite the problem class. It is a stronger claim
and it is true.

If genuine AI is wanted, the honest place for it is interpreting free-text preferences
("somewhere quiet", "good food") into the appeal scores the optimiser consumes.

---

---

## What Shipped, And What Was Dropped

**Option A — split the plan — was built, then removed.** It ran for one iteration: each member
claimed however many days they wanted, the planner filled whatever nobody claimed, and every stop
was colour-coded by whoever chose it.

It was cut on Jin Siang's objection, which was the right call:

> "do you think this feature is needed since we are a trip planner we should have done everything"

The brief's own test is *"make planning faster and less stressful"*. A planner that hands four
people homework fails that test, however novel the mechanism is. Dividing the work is only an
improvement if the work has to exist at all — and it doesn't, because the planner can propose the
whole trip from what people like.

**What that cost.** Prior art found nothing else that divides authorship of an itinerary, so
dropping it gave up one of two novelty claims. The other — treating the shape of a same-airport
round trip as the traveller's decision — is untouched and remains the primary differentiator.
Voting on its own is well-trodden, so *Originality* now leans on the round trip.

**What shipped instead.** The planner shortlists roughly twice the trip's worth of places, the
group votes, and the winners become the trip. Nobody plans anything. The pitch line changed from
"we divide the planning" to **"we plan it, you veto it"** — which is a more honest description of
what the software actually does.

**One thing survived the cut in a different form.** People still need a way to say *"I don't care
about the rest, but we are going to Penang."* That became **must-go places**: seated before
anything else, never dropped for budget or time, and they override the trip-type filter, the
transport filter and the group vote. It is the day-claiming idea reduced to the part that earned
its place.

## Still Open

- The day-boundary rule — inclusive or exclusive at the handover day.
- What a member actually does in their turn: pick from a list, drop pins on the map, or state
  preferences the system fills in?
- Whether members see each other's picks while choosing, or only after the merge. Blind nomination
  avoids anchoring; open nomination avoids duplication. This is a real product decision.
- Does everyone get an equal quota, or does the trip organiser get more?
