# PRODUCT — Perch

**Who and why.** The user, their problem, the demo moment, and the scope ladder. Everything downstream cites this file:
[`PRD.md`](PRD.md) turns it into requirements, [`TRD.md`](TRD.md) into architecture, `DESIGN.md` into a design system.

**Its claims come from the `research` branch and are cited there.** Read them with `git show research:<path>`. A claim
about the user, the market or a rejected direction that has no basis on `research` is a claim someone made up.

---

## The One Sentence

> **The itinerary knows what can break it, and repairs itself from options the group already approved.**

That sentence is the whole product. It is not a feature list, and the feature list is deliberately short.

**The mechanism, in plain words.** Choosing produces two things at once: the trip, and a **ranked bench** of everything
that lost. When a stop closes, the bench is the replacement pool, so nobody has to be consulted. When the trip goes over
budget, the same bench is the cut list. When someone changes their mind, it is the same interaction again.

**One mechanism, four jobs.** That is a cleaner story than four features, and under this rubric it is also a safer one —
`research:docs/decisions/build-verdict.md` establishes that breadth of features is a liability here, not an asset.

---

## Who

**Aisyah, 24 — the one who always ends up planning it.**

|                       |                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Who**               | Graduated two years ago, junior office job in KL, renting a room, no car                   |
| **Who she goes with** | The same four or five friends from university, now on different jobs and shifts            |
| **When she opens it** | The Tuesday nobody follows up the group chat, and midnight on the Thursday before the trip |
| **What she does now** | WhatsApp, then a booking app, then Google Maps, then a spreadsheet nobody else edits       |
| **Cost of switching** | The group chat is free and already holds the trip                                          |

Full persona, with every claim marked `[assumed]` and its backing named: `research:docs/users/personas.md`.

**The sentence the product has to earn.**

> Right now Aisyah re-checks opening hours the night before and re-opens the argument in the group chat when something
> turns out to be shut. With this, the trip has already swapped in the option the group ranked next, and told everyone
> why.

**Why her and not a traveller with more time.** The bench only pays when the schedule is tight. A three-hour hole in a
two-day trip is a sixth of the trip; the same hole in a two-week trip is an afternoon they had spare anyway. **The
disruption claim and the short-trip user are the same choice**, so this is not an arbitrary narrowing.

### Who We Are Deliberately Not Building For

| Not Them                                                | Why Not                                                                                                                             |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Solo travellers**                                     | Supported, never pitched. There is no unpaid travel manager to relieve. See [Solo](#solo)                                           |
| **Long-haul backpackers with weeks of slack**           | A closed stop costs an afternoon they had spare. The pain scales inversely with trip length                                         |
| **Families with young children, or agent-booked trips** | The decision is not democratic and the constraints are not preference-shaped                                                        |
| **"Students", as a category**                           | Too broad, and the wrong shape — an undergraduate on semester break has neither the 48-hour ceiling nor the five clashing calendars |

---

## The Problem

**We are not competing with Wanderlog. We are competing with a stack of five free apps she already has.**

In the order she reaches for them: **WhatsApp**, then whatever books the flight and the bed, then **Google Maps** to
hold the pins, then a **money tool** to carry the cost. That stack is free, already installed, and socially default.

> **Corrected 2026-09-07.** An earlier version of this list led with ChatGPT and Xiaohongshu. Asked directly and by
> name, no version of the persona used either, and a money tool — absent from our list entirely — came up unprompted
> every time. `research:docs/market/landscape.md` carries the correction and the caveats;
> `research:docs/users/synthetic-panel-2026-09-07.md` carries the method, which is synthetic and is not evidence about
> real travellers.

**Where that stack breaks, which is the whole argument:**

- **A chatbot gives you a plan and forgets it.** There is no state, so nothing can be repaired later
- **Google Maps holds places, not decisions.** Its own reviewers call collaborative editing glitchy and not real-time
- **A WhatsApp poll produces a result, not a plan.** Nobody turns thirty votes into a routed itinerary
- **Saved posts inspire and never commit.** A feed is not a trip
- **Nothing in the stack knows the trip exists once the trip starts.** When a stop closes, all five are silent and the
  group chat reopens

> Every tool a group already uses can produce a plan. **None of them owns the plan afterwards.**

**And that is the brief, not a bolt-on.** The problem statement names "re-planning when something changes mid-trip"
directly, so our differentiator and the organisers' own words are the same sentence.

---

## What We Claim, And What We Do Not

**The non-claims matter more than the claims**, because a judge has seen a hundred travel planners this week and the
fastest way to sound like all of them is to claim everything.

| We Do Not Claim                      | Because                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------- |
| Better suggestions                   | Tripadvisor has a billion reviews and Roadtrippers has 42 million trips    |
| That generating an itinerary is hard | Chatbots commoditised it, and around 40% of travellers have used one       |
| A new layout                         | "Your itinerary and your map in one view" is Wanderlog's own tagline       |
| Clever routing                       | It is the Tourist Trip Design Problem, with a citable heuristic literature |
| Novel group voting                   | WhatsApp ships polls; Troupe, SwipeSights and Plan Harmony all vote        |
| Photo spots as our territory         | Locationscout has 233,000 of them and Xiaohongshu owns the inspiration     |

**What we do claim, and the evidence it survived.** Four competitor passes on `research` each tried to kill the bench
and did not. The strongest evidence is a competitor's:

**SwipeSights already computes a ranked group preference order** — super-likes carry double weight, and premium sells
vote analytics — **and spends it on how long you stay at the places that won.** The losing swipes are discarded. Its own
FAQ tells the group to "double-check opening hours closer to your trip date."

**A direct competitor had the ranking in its hands and used it for the wrong problem.** That is a better originality
argument than "nobody does this", and it is honest.

**One thing we must say rather than hide.** The disruption case is not served by _nothing_ today. It is served by
searching a social feed on the spot and checking the result against a ride-hailing app — by hand, in the heat, by
whoever is holding the phone. That is the incumbent we displace, and naming it is stronger than pretending the space is
empty.

---

## The Demo Moment

One shot, and everything above exists to make it land:

> **Swapped Merapi for Prambanan. Jeep tours cancelled for haze, Prambanan was your number two for that slot, and the
> day stays at RM 40.**

**The claim that sentence supports is narrower than it first looks, and the narrow one is the defensible one.** It is
not that the trip survives — groups are perfectly capable of abandoning an afternoon and enjoying it more. It is that
**Aisyah does not spend her holiday morning re-planning on her phone while four people wait to be told where to walk.**

The cost of a disruption is not that the trip degrades. It is **who pays for the repair.**

---

## The Shape

**Two surfaces. Not eleven screens.**

|           | **The Desk**                                                | **The Book**                                           |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| **Who**   | Aisyah, alone, at 11pm                                      | The group, in WhatsApp, no account, no install         |
| **What**  | Assembly: days, slots, beds, costs, what is open or at risk | The magazine                                           |
| **Shape** | Mobile-first at 390px, two-column above 1024px              | Spreads. Cross-fade on mobile, side-by-side on desktop |

**The Book and the shared link are the same object.** What she pastes into the group chat _is_ the magazine. It has two
states and is a magazine in both: **setting**, where undecided slots render as marked blanks with candidates beneath
them, and **printed**, where every slot is resolved and the decision controls are gone.

**The rule, stated precisely:** the book is read-only except where it is deliberately unfinished. She edits on The Desk;
the only writes that ever happen on the book are the group's taps, and a tap is not an edit.

**The Bench and What Changed are not screens.** The bench is a drawer off any element on either surface. What Changed is
a strip on both, and it is the only thing in the product that earns a second visit.

### Plan It Together

**It is what the link is, not a page.** The same URL runs three phases:

| Phase           | What The Group Sees         | What They Do                 |
| --------------- | --------------------------- | ---------------------------- |
| **1 · When**    | Cover, and a strip of dates | Tap the days they can do     |
| **2 · What**    | Magazine with marked blanks | Tap what they'd hate to miss |
| **3 · Printed** | The finished magazine       | Read it, open Maps, keep it  |

**Why the group gets a magazine and not a planner.** Open a planner and it looks like work, so four people who won't
install anything don't tap, and the co-op feature is dead in practice — which is exactly what happens in the group chat
today. Open a magazine with gaps in it and they tap. **The magazine is not the reward at the end; it is what makes
people contribute at all.**

### Two Rules That Make The Product Feel Different

1. **The trip is valid with zero group input.** If nobody taps — and for the first two weeks, nobody does — the trip
   still exists, still costs what it says, still has a plan. Perch has already chosen; taps only reorder what it chose
2. **Perch proposes and she vetoes.** Vetoing is cheaper than choosing, and no question is asked that Perch can infer.
   The competitor that asks least of the user is the group chat, which asks nothing

### Solo

**Supported, never pitched.** The bench does not need a group, it needs a ranking, and the interview's third question
produces one from a single person: three chosen, seven benched. Solo runs the same two surfaces with phase 1 skipped and
phase 2 pre-resolved, switched by interview question 1. It costs almost nothing to support and it is the answer when a
judge asks. It stays out of the video, because Target Group Alignment rewards a narrow user.

---

## The Scope Ladder

| Tier       | What                                                                                                                              | Why                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Must**   | The interview and its ranking; Perch proposes; The Desk; The Book in both states; the bench drawer with cost deltas; What Changed | Without any one of these there is no claim              |
| **Should** | Availability phase; the derived Before We Go checklist; Google Maps handoff per day; Nudge                                        | Each answers a named pain and reuses work already built |
| **Could**  | Link or screenshot import as a filter over saves; EXIF photo matcher as a detail on a stop                                        | Real, demoable, and neither is load-bearing             |
| **Won't**  | Cautions and a destination news feed; photo spots as a page; bill splitting; a chat panel; a mascot                               | See below                                               |

**Why each Won't is out, in one line each.** Alerts against your exact itinerary are a mature category with human
analysts behind them, and Japan's government ships the same thing free in fourteen languages. Photo spots are a product
category we would lose on their own terms, with no data of our own. Bill splitting solves the half that already works —
every panel answer said the arithmetic is fine and the _collection_ is the problem. A chat panel invites "why not just
use ChatGPT", which is a comparison we lose. A mascot makes the plan feel authored, when its whole value is that it is
derived.

**Transport is the one gap the current mockup has and the rebuild must close.** Transport appears exactly once in
DrxgClanPC's deck, as a note string. Nothing models public against private. **That matters because a swap that silently
adds forty minutes breaks the day it was meant to save** — transport is not a side feature, it is the mechanism's
missing unit of cost, and it is why the bench drawer prices every alternative in travel time as well as ringgit.

---

## What Would Kill This

| Risk                                        | Standing                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Troupe already benches its losing votes** | **Unchecked.** The single most valuable half hour still available. If true, the claim is gone |
| **Real place data**                         | Unsolved. Everything else is derived, free, or droppable. Named in `TRD.md`                   |
| **Nobody actually votes**                   | Mitigated by design — the trip is valid with zero input, so a vote is an upgrade, not a gate  |
| **The group installs nothing**              | Designed for: no account, no install, the link opens inside WhatsApp                          |

---

## Decision Record

**7 September 2026 — the fork resolved on 6 September is retired.**

`research:docs/decisions/storybook-shape.md` resolved shape **B**: the group decides on a separate planner surface and
the storybook is read-only output. **B was accepted on one condition** — that the planner earn its separation by being
"a durable shared surface the group lives in over days".

**That condition did not survive contact with the persona.** Asked how disagreements actually get settled, no version of
Aisyah described a vote or a shared surface; all described one person acting and the rest ratifying by not objecting.
Method and caveats: `research:docs/users/synthetic-panel-2026-09-07.md`.

**What replaces it, and what survives.** The two surfaces collapse into one shared object plus a private workspace. What
survives of B is the part that actually won the fork: **the finished book is read-only and is a keepsake worth sharing
after the trip.** What is dropped is the durable-surface requirement and the planner as a page with a nav item —
returning §3 of `storybook-shape.md` to what it originally said before the fork overrode it.

**This is a concept change and it is recorded here rather than absorbed silently**, because the ideation trail is a
graded deliverable and a reversal with a stated cause is worth more than a tidy decision.

---

## Evidence

| Claim                                                   | Backing                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| The five-app stack, and where it breaks                 | `research:docs/market/landscape.md`, from competitor scans                     |
| Nobody in the category spends a ranking on repair       | `research:docs/market/competitors.md`, four passes, two products read directly |
| Breadth of features is a liability under this rubric    | `research:docs/decisions/build-verdict.md`                                     |
| The shape, the interview, and where the AI belongs      | `research:docs/decisions/storybook-shape.md`                                   |
| Substitutes must be filtered by fit, not just vote rank | `research:docs/decisions/disruption-recovery.md`                               |
| Who Aisyah is                                           | `research:docs/users/personas.md` — **every claim `[assumed]`**                |
| That the group will not install anything                | Synthetic panel. **Not evidence about real travellers**                        |

**The honest gap: `research:docs/users/interviews/` is empty.** No real person has said any of this. The rubric does not
require interviews and the persona argues its case without them, but nothing on this page should be described to a judge
as validated.
