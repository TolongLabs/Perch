# PRODUCT - Perch

**Who and why.** The user, their problem, the demo moment, and the scope ladder. Everything downstream cites this file:
[`PRD.md`](PRD.md) turns it into requirements, [`TRD.md`](TRD.md) into architecture, `DESIGN.md` into a design system.

**Its claims come from the ideation notebook, which lives at docs/research/ on main, and are cited there.** A claim
about the user, the market or a rejected direction that has no basis in the notebook is a claim someone made up. The
product itself is what [the rebuild verdict](research/decisions/rebuild-verdict-2026-09-08.md) decided on 8 September
2026; this file tells its story.

---

## The One Sentence

> **The group swipes on reels of places, the owner drags what won onto a three-slot-a-day calendar, a heuristic
> scheduler orders each day and colours it by how well the route holds, and the finished trip prints as The Book, a
> field-guide-style keepsake.**

That sentence is the whole product. It is not a feature list, and the feature list is deliberately short: the swipe, the
calendar, the book.

**The mechanism, in plain words.** Swiping produces two things at once: a tally the group can see, and a **ranked order
of everything that lost**. The winners go on the calendar. What lost stays ranked, and it is what the **Perch drawer**
offers when a card is deleted, so the trip cannot empty. The ranking is spent twice, and both spends are visible.

**One interaction, three surfaces.** That is a cleaner story than a feature list, and under this rubric it is also a
safer one. [research/decisions/build-verdict.md](research/decisions/build-verdict.md) establishes that breadth of
features is a liability here, not an asset; the mentor session of 7 September said the same thing out loud (see the
Decision Record).

---

## Who

**Aisyah, 24 - the one who always ends up planning it.**

|                       |                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Who**               | Graduated two years ago, junior office job in KL, renting a room, no car                   |
| **Who she goes with** | Farah, Hana and Iman, the same friends from university, now on different jobs and shifts   |
| **The trip**          | Tokyo, four days and three nights, one day of annual leave tagged onto a weekend           |
| **When she opens it** | The Tuesday nobody follows up the group chat, and midnight on the Thursday before the trip |
| **What she does now** | WhatsApp, then a booking app, then Google Maps, then a spreadsheet nobody else edits       |
| **Cost of switching** | The group chat is free and already holds the trip                                          |

Full persona, with every claim marked `[assumed]` and its backing named:
[research/users/personas.md](research/users/personas.md).

**The sentence the product has to earn.**

> Right now the group chat runs the trip: three hundred messages, a poll nobody tallies, pins scattered across Google
> Maps, and a night before spent reconciling all of it. With this, the group swipes for two minutes, the winners land on
> a calendar the scheduler has already ordered and coloured, and the argument never starts.

**Why her and why this trip.** The three-slot rule and the short trip are the same choice. A four-day trip fills all
twelve slots with places the group actually argued about, and every slot is contested; on a two-week trip the calendar
is filler nobody swipes over. The demo is one city, Tokyo, so the whole argument is visible in a single video.

### Who We Are Deliberately Not Building For

| Not Them                                                | Why Not                                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Solo travellers**                                     | Supported, never pitched. The owner's swipes alone produce a valid plan, no group needed |
| **Long-haul backpackers with weeks of slack**           | Twelve contested slots is a four-day problem. A long trip has slack nobody votes over    |
| **Families with young children, or agent-booked trips** | The decision is not democratic and the constraints are not preference-shaped             |
| **"Students", as a category**                           | Too broad, and the wrong shape: an undergraduate has neither the budget nor the shifts   |

---

## The Problem

**We are not competing with Wanderlog. We are competing with a stack of five free apps she already has.**

In the order she reaches for them: **WhatsApp**, then whatever books the flight and the bed, then **Google Maps** to
hold the pins, then a **money tool** to carry the cost. That stack is free, already installed, and socially default.

> **Corrected 2026-09-07.** An earlier version of this list led with ChatGPT and Xiaohongshu. Asked directly and by
> name, no version of the persona used either, and a money tool, absent from our list entirely, came up unprompted every
> time. [research/market/landscape.md](research/market/landscape.md) carries the correction and the caveats;
> [research/users/synthetic-panel-2026-09-07.md](research/users/synthetic-panel-2026-09-07.md) carries the method, which
> is synthetic and is not evidence about real travellers.

**Where that stack breaks, which is the whole argument:**

- **A chatbot gives you a plan and forgets it.** There is no state, so nothing can be scheduled, shared or kept
- **Google Maps holds places, not decisions.** Its own reviewers call collaborative editing glitchy and not real-time
- **A WhatsApp poll produces a result, not a plan.** Nobody turns thirty votes into a routed itinerary
- **Saved posts inspire and never commit.** A feed is not a trip
- **The plan, once it exists, is a screenshot.** It cannot be reordered, costed or printed, so the trip lives across
  five apps and belongs to none of them

> Every tool a group already uses can produce a plan. **None of them turns the group's decision into days.**

**And that is the fix, not a bolt-on.** The stack's failure was never generating ideas; the group has more saved posts
than it can use. The failure is that the decision the group already made, in the chat, never becomes a scheduled,
costed, printable trip. That is the gap Perch fills, and nothing in the stack fills it today.

---

## What We Claim, And What We Do Not

**The non-claims matter more than the claims**, because a judge has seen a hundred travel planners this week and the
fastest way to sound like all of them is to claim everything.

| We Do Not Claim                      | Because                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Better suggestions                   | Tripadvisor has a billion reviews and Roadtrippers has 42 million trips                         |
| That generating an itinerary is hard | Chatbots commoditised it, and around 40% of travellers have used one                            |
| A new layout                         | "Your itinerary and your map in one view" is Wanderlog's own tagline                            |
| Clever routing                       | It is the Tourist Trip Design Problem, with a citable heuristic literature; ours is a heuristic |
| Novel group voting                   | WhatsApp ships polls; Troupe, SwipeSights and Plan Harmony all vote                             |
| Photo spots as our territory         | Locationscout has 233,000 of them and Xiaohongshu owns the inspiration                          |

**What we do claim, and the evidence it survived.** Four competitor passes on the notebook each tried to kill the
swipe-to-schedule chain and did not. The strongest evidence is a competitor's:

**SwipeSights already computes a ranked group preference order** - super-likes carry double weight, and premium sells
vote analytics - **and spends it on how long you stay at the places that won.** The losing swipes are discarded, and the
winning ranking never reaches a calendar. Its own FAQ tells the group to "double-check opening hours closer to your trip
date."

**A direct competitor had the ranking in its hands and spent it on the wrong problem.** That is a better originality
argument than "nobody does this", and it is honest.

**One thing we must say rather than hide.** In the demo, Farah, Hana and Iman have already swiped: the votes are a
committed fixture, so the tally has percentages the moment Aisyah finishes. Real multi-user voting is the build phase,
which adds Supabase for auth, votes and realtime. The prototype shows the flow; it does not yet show the network.

---

## The Demo Moment

One shot, and everything above exists to make it land. The video is 3 to 5 minutes and walks one path: sign in, new
plan, swipe, see the votes, drag the calendar, apply, checklist, book.

> **Four days, twelve slots, about ninety seconds of dragging. Aisyah hits Apply, the cards fly into their slots, and
> the calendar colours itself green. She drags one stop to where she would rather have it, and that day turns gold: the
> plan is fine and the order is slow, and it says so.**

**The claim that moment supports is narrower than it first looks, and the narrow one is the defensible one.** It is not
that the scheduler is clever. It is that **the group's decision, made in swipes, survives intact all the way to a
printed book**, and the only hands it passes through are Aisyah's, dragging, while the scheduler explains itself in
colour.

**Why the colour matters more than the order.** Green, gold and red are the scheduler telling her what it did and where
the day strains, and she can pin any card and the scheduler will never move it. The plan feels derived from the group's
swipes, not authored at them, and that is the difference between an instrument and a chatbot.

---

## The Shape

**Nine routes. Not eleven screens.** The prototype has no backend, no auth server and no API key, and the only network
call is reel MP4s from a public GCS bucket.

| Route                  | Surface                                                                        | Register |
| ---------------------- | ------------------------------------------------------------------------------ | -------- |
| **/**                  | Landing                                                                        | Desk     |
| **/sign-in**           | Sign In, guest only                                                            | Desk     |
| **/trips**             | Dashboard, with invite code and who has voted                                  | Desk     |
| **/new**               | Onboarding: dates, activities, destination, free text                          | Desk     |
| **/t/:tripId/swipe**   | The Deck: swipe on reel cards, where joiners land                              | Desk     |
| **/t/:tripId/votes**   | The Tally: percentage per place, unanimous gold, zero greyed and eliminated    | Desk     |
| **/desk**              | The Desk: 4 days x 3 slots, voted-in sidebar, Apply, pins, feasibility colours | Desk     |
| **/desk/before-we-go** | Before We Go checklist; all ticked enables Print The Book                      | Desk     |
| **/t/:tripId**         | The Book, printed state only, one plate per day, Maps deep link per day        | Book     |

**Two registers, one system.** The Desk is an instrument: paper ground, Quicksand, pill buttons, one solid button per
screen. The Book is a plate: Newsreader prose, zero radius, a field guide rather than a brochure. The full token set and
the rules behind it live in `DESIGN.md`; the point here is that the planning surface and the keepsake are allowed to
feel different because they are read differently.

**Three rules carry the whole feel:**

1. **The trip is valid with zero group input.** The owner's swipes alone produce a plan, so a joiner's swipe is an
   upgrade, never a gate
2. **The owner outranks, and pins.** Her swipe carries 1.5 weight in the tally, and a card she pins to a day and slot is
   never moved by the scheduler
3. **Deleting is the only way to empty a slot, and it is safe.** The Perch drawer opens with the next-ranked voted-in
   place for that slot, and every day keeps at least two stops

**The Perch drawer is not a screen.** It is a drawer off any calendar card, and it is the one place the old bench
concept survives, reduced to a single gesture: delete, and the ranking hands back the next option.

### One City, On Purpose

**The demo is Tokyo only.** The data model still carries legs, where a leg is one city and a run of consecutive days
with a fixed transfer block between legs, so multi-area Japan is a type-level claim in `TRD.md` and not a screen. A date
change regenerates the calendar and the votes survive, because votes are on places; a destination change is a new plan.

---

## The Scope Ladder

| Tier       | What                                                                                                                                                                         | Why                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Must**   | The Deck, The Tally, The Desk with drag and Apply, The Book in printed state, the Perch drawer on delete, the feasibility colours                                            | Without any one of these there is no claim                             |
| **Should** | Pinning a card to a day and slot; a date change that regenerates the calendar; the Before We Go checklist; the legs type with its transfer block                             | Each answers a named rule in the verdict and reuses work already built |
| **Could**  | The strength-of-swipe spectrum the mentor raised; a second city fixture to prove the legs type                                                                               | Real, demoable, and neither is load-bearing                            |
| **Won't**  | Real multi-user voting, which is the build phase and Supabase; a second city screen; a chat panel; bill splitting; photo spots as a page; a mascot; AI in the scheduler copy | See below                                                              |

**Why each Won't is out, in one line each.** A second city screen would spend build days the calendar needs, for a claim
the legs type already makes. A chat panel invites "why not just use ChatGPT", which is a comparison we lose. Bill
splitting solves the half that already works: every panel answer said the arithmetic is fine and the _collection_ is the
problem. Photo spots are a product category we would lose on their own terms, with no data of our own. A mascot makes
the plan feel authored, when its whole value is that it is derived from the group's swipes. And the scheduler is a
heuristic, cluster by area, order by best period and opening hours, nearest neighbour within the day, and the UI copy
never calls it AI.

**Transport stopped being the gap it was.** In the previous concept a swap could silently add forty minutes and break
the day it saved; here the committed 24 by 24 transit matrix feeds every feasibility colour, and gold exists precisely
because a day can fit its hours and still run slow.

---

## What Would Kill This

| Risk                                                 | Standing                                                                                                                                                                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Someone already swipes the group into a calendar** | **Unchecked.** The single most valuable half hour still available. SwipeSights spends its ranking on dwell time; if a competitor spends one on the schedule, the originality narrows to the colours and The Book                            |
| **Real place data**                                  | Solved for the stage we are in. Committed fixtures now; seeded from OpenStreetMap, Wikidata and Wikimedia Commons in the build phase. Google Places rejected: its terms cap caching at 30 days and forbid storing photos. Named in `TRD.md` |
| **Nobody actually swipes**                           | Mitigated by design: the trip is valid with zero group input, so a swipe is an upgrade, not a gate                                                                                                                                          |
| **The group installs nothing**                       | Designed for: guest-only sign in, and the invite code lands joiners straight on The Deck, skipping onboarding                                                                                                                               |
| **A judge reads the scheduler as AI**                | Mitigated by copy: it is a heuristic with one describable rule, and the UI never says AI                                                                                                                                                    |

---

## Decision Record

**8 September 2026 - the repair-from-a-bench concept is retired after mentor session 1.**

The session with Zach Khong, Full Stack Engineer at Solana Foundation, is transcribed verbatim at
[source/mentor-session-1-transcript.md](source/mentor-session-1-transcript.md), 38 minutes with timestamps preserved.
Its verdict on the old feature set was that the substance was already everywhere and the presentation was the product:

> "All these features right, like one to six, is stuff that people will already build."

> "the way that how you represent the voting feature is what would make your app special."

> "I have to click a lot and I have to know what I want."

**What changed because of it.**

| What                       | Before (7 September)                                 | After (8 September)                                                                                |
| -------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **The headline**           | The itinerary repairs itself from a ranked bench     | The group swipes on reels, the owner drags what won onto the calendar, the trip prints as The Book |
| **The vote**               | An interview with ranked questions                   | A binary swipe on a 9:16 reel, judged on instinct, name first, no thinking required                |
| **Where the ranking goes** | Into a bench that sits under the trip with four jobs | Into the calendar, the tally colours, and the Perch drawer offered on delete                       |
| **The bench mechanic**     | The headline mechanism                               | Dropped as the headline; survives only as the Perch drawer, so a deleted card cannot empty a slot  |
| **The setting**            | Yogyakarta, and a disruption mid-trip                | Tokyo, four days and three nights, one city in the demo                                            |
| **The friction budget**    | An interview the owner answers alone                 | Onboarding with free text first, and joiners landing straight on The Deck from the invite          |

Two more lines from the transcript shaped details rather than the frame. "I feel like the voting part is a bit stiff"
settled the 50-50 case: the owner's swipe carries 1.5 weight rather than shipping a dead heat. And "Being specific can
definitely be your strength... you could plan to that level of cultural detail" is why the demo is one Japanese city
with transit times modelled between areas, not a generic international planner.

**What the session proposed and we did not adopt is recorded too.** A group chat with an AI reading it, and drawing on a
map; both are in the transcript and neither was built, because a chat panel invites the "why not ChatGPT" comparison and
a canvas does not survive a five-minute demo. His "maybe 65 percent" strength-of-swipe spectrum is not in the prototype
either; it is the first candidate for the build phase, logged in the scope ladder above.

**This is a concept change and it is recorded here rather than absorbed silently**, because the ideation trail is a
graded deliverable and a reversal with a stated cause is worth more than a tidy decision. The entry below records the
previous reversal; it is superseded by this one and kept on purpose.

**7 September 2026 - the fork resolved on 6 September is retired.**

[research/decisions/storybook-shape.md](research/decisions/storybook-shape.md) resolved shape **B**: the group decides
on a separate planner surface and the storybook is read-only output. **B was accepted on one condition** - that the
planner earn its separation by being "a durable shared surface the group lives in over days".

**That condition did not survive contact with the persona.** Asked how disagreements actually get settled, no version of
Aisyah described a vote or a shared surface; all described one person acting and the rest ratifying by not objecting.
Method and caveats: [research/users/synthetic-panel-2026-09-07.md](research/users/synthetic-panel-2026-09-07.md).

**What replaced it, and what survives.** The two surfaces collapsed into one shared object plus a private workspace.
What survived of B is the part that actually won the fork: **the finished book is read-only and is a keepsake worth
sharing after the trip.** The durable-surface requirement and the planner as a page with a nav item were dropped,
returning §3 of the storybook-shape decision to what it originally said before the fork overrode it.

---

## Evidence

| Claim                                                     | Backing                                                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| The five-app stack, and where it breaks                   | [research/market/landscape.md](research/market/landscape.md), from competitor scans                                             |
| Nobody in the category spends the ranking on the schedule | [research/market/competitors.md](research/market/competitors.md), four passes, two products read directly                       |
| Breadth of features is a liability under this rubric      | [research/decisions/build-verdict.md](research/decisions/build-verdict.md)                                                      |
| The swipe, calendar and book shape                        | [research/decisions/rebuild-verdict-2026-09-08.md](research/decisions/rebuild-verdict-2026-09-08.md), after mentor session 1    |
| What the mentor said, verbatim                            | [source/mentor-session-1-transcript.md](source/mentor-session-1-transcript.md), 38 minutes, Whisper-transcribed with timestamps |
| The previous shape, and why the fork was retired          | [research/decisions/storybook-shape.md](research/decisions/storybook-shape.md)                                                  |
| Substitutes are filtered by the slot they fill            | [research/decisions/disruption-recovery.md](research/decisions/disruption-recovery.md)                                          |
| Who Aisyah is                                             | [research/users/personas.md](research/users/personas.md) - **every claim `[assumed]`**                                          |
| That the group will not install anything                  | Synthetic panel. **Not evidence about real travellers**                                                                         |

**The honest gap: research/users/interviews/ is empty.** No real person has said any of this. The rubric does not
require interviews and the persona argues its case without them, but nothing on this page should be described to a judge
as validated.
