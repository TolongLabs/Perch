# Competitors

One entry per product. **Keep the ones that make us look bad, especially those.**

Scanned 2026-09-01 for the Travel Planner problem statement. The first three were fetched and read directly; the
Malaysian entries come from search results and are marked accordingly.

---

> **Restructured 2026-09-06.** Both earlier scans went looking for products *shaped like ours* and came back with
> niche apps. That was the wrong question, and the list it produced was easy to dismiss. **This section is what a judge
> would actually name**, and it is a much harder list. Read it before anything below it.
>
> Everything in this section comes from search summaries and press coverage read on 6 September 2026, not from opening
> the products. Treat the feature claims as `[snippet only]` and check any one of them before it goes in a pitch.

# Tier 1 - The Ones A Judge Will Name

## ChatGPT and Gemini

**The single biggest competitor, and it is not a travel product.**

| Finding                                                    | Figure |
| ---------------------------------------------------------- | ------ |
| Travellers worldwide who have used AI tools to plan a trip | ~40%   |
| Of those, who use it for most or every trip                | 63%    |
| Who used generative AI to build an itinerary               | 42%    |
| Travellers under 45 who would use AI for recommendations   | ~two-thirds |

ChatGPT now carries app integrations with Booking.com, Expedia and Uber, and Google Search has an itinerary-building
Canvas.

**Why this matters to us.** "Plan me a five-day trip to Yogyakarta on RM1,500" is a solved, free, zero-install
interaction that a large minority of travellers already perform. **Any feature of ours that is only "generate a plan"
is already commoditised.** What a chat window cannot do is hold the plan as shared, committed state that a group has
approved and that something can later break. That is the whole opening.

---

## Google Maps and Google My Maps

**The actual default.** Lists can be private, shared by link, or **collaborative**; they sync across devices, carry
notes per place and custom icons, and appear on downloaded offline maps. My Maps adds layers, drawn routes and
collaborative editing for multi-day trips.

**And here is the citable weakness**, in the words of a 2026 review: Google Maps lists "let you save and share places,
which sounds like collaboration but is not really. Editing together is glitchy and not real-time, so invitees often end
up stuck in a read-only view even when you meant to give them edit access."

**Why this matters to us.** Our page 5 hands the route to Google Maps, so Google is simultaneously our dependency and
our competitor. That is survivable and normal. The named collaboration weakness is the most useful sentence in this
whole file: **the default tool is bad at exactly the group part we are claiming.**

---

## Trip.com - TripGenie and Trip.Planner

**The one aimed straight at our market.** TripGenie is an in-app AI assistant, three years old, taking text and voice,
producing "personalised editable itineraries in under a minute" with attraction lists, booking links and city maps.
Trip.Planner is a separate AI planning hub.

**The line that should worry us most:** travellers from **Hong Kong, Singapore and Malaysia use AI the most** during
their trips, interacting with TripGenie more often per trip as a real-time decision-making partner.

**Why this matters to us.** Our target users are named, by a company with the data, as the heaviest users of exactly
this. We cannot pitch AI trip planning as new to Malaysians.

---

## Tripadvisor Trips

AI itinerary generator built with OpenAI. Enter destination, dates, who you are travelling with and activity types;
get a day-by-day itinerary in seconds that you can **save, edit and share with travel companions**. Built on over a
billion reviews across more than eight million businesses.

**Why this matters to us.** The review corpus is a moat, like Roadtrippers' 42 million trips. Do not compete on
recommendation quality. **One opening:** the AI planner launched **US-only on desktop and mobile web**, with expansion
stated as a plan `[snippet only, and the date of that reporting is not established]`. Worth confirming before claiming
a regional gap.

---

## Xiaohongshu / RedNote

**The one that actually kills our photo-spots page**, and nobody on the team listed it.

- Over 300 million monthly active users, mostly aged 18 to 40, around 70% women
- "The first place a lot of younger travellers seek inspiration"
- Users plan itineraries **around photogenic locations** - the "daka" or check-in spot
- Searching "citywalk" returns day itineraries including where to eat and routes between attractions

**Why this matters to us.** This is the real incumbent for "where should we go and where do we take the photo", for
precisely our demographic, and it is social rather than a planner - which is why a competitor scan looking for trip
planners missed it entirely. Our photo-spots page is not competing with PhotoHound. **It is competing with
Xiaohongshu, and it loses.**

---

## Traveloka

**The Malaysian default travel app.** Flights, hotels, buses, trains, car rental, activities, eSIM and insurance, paid
with Touch 'n Go eWallet, GrabPay or Maybank2u. AI-powered personalised recommendations, and an in-app assistant called
IVAN.

**Why this matters to us.** Not an itinerary planner, but it owns the travel-app slot on a Malaysian phone and the
payment rails. If a judge asks "why would anyone install this instead of using Traveloka", the answer must not be
about booking.

---

## WhatsApp, upgraded

**The existing entry below understated this. WhatsApp now ships native polls.** Groups agree on times, places and
activities inside the chat. The pattern named in the literature is the "WhatsApp plus spreadsheet stack", and its
documented failure is that chat "creates noise without resolving anything" - stronger tools "add polls, pinned
decisions, and a record of what was actually agreed, kept separate from casual conversation".

**Why this matters to us.** Voting is no longer a reason to leave the group chat, because the group chat has voting.
**What WhatsApp still cannot do is turn a poll result into a plan, or repair that plan when a stop closes.** Our claim
has to sit on that, not on the vote.

---

## What Tier 1 Changes

**It makes our position harder, not easier.** The heavyweights are more threatening than the niche apps: generation is
commoditised by ChatGPT, our demographic is named as the world's heaviest AI-travel users by Trip.com, our photo page
is beaten by Xiaohongshu, and our vote is matched by WhatsApp polls.

**But every one of them stops at the same place.** ChatGPT gives you a plan and forgets it. Google Maps lists hold
places, not decisions, and collaborate badly by their own reviewers' account. Tripadvisor generates once. Xiaohongshu
inspires and never commits. TripGenie advises in real time but does not own the group's approved itinerary as state.
**None of them holds a committed group plan and repairs it when the world changes.**

That is the verdict in [`../decisions/build-verdict.md`](../decisions/build-verdict.md), reached before this section
was written, and Tier 1 strengthens it rather than weakening it.

---

# Tier 1b - The Closest Products Found So Far

**Added 2026-09-06, third pass**, after Jin Siang asked whether anything publicly available already does our idea.
This pass searched for the *behaviour* - vote on attractions, then generate the trip, then handle it breaking - rather
than for product categories. **It found closer competitors than either earlier pass.**

## Tripeza  -  checked directly, and it is further from us than the third pass thought

|                  |                                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| **Link**         | https://tripeza.in/ , plus Google Play `com.tripeza.app`               |
| **Checked**      | 2026-09-07, **site and store listing read directly. App not installed** |
| **Tagline**      | "Your Group Trip on Autopilot"                                         |
| **Distribution** | Mobile only, App Store and Google Play. Live, not a waitlist           |

**Four named features, and that is the whole product:** Democratic Destination Voting, AI-Powered Daily Itineraries,
Auto-Split Expenses, and Shared Trip Notes for flight details, Airbnb links and packing lists.

**The correction that matters. Tripeza votes on the destination, not on the stops.** The third pass, working from
search summaries, recorded that it "suggests destinations **and attractions**" and called it "our page 2 and our page
1, shipped". Read directly, the vote is "Swipe right on destinations your group loves. Majority rules", after which
**the AI generates the day-by-day itinerary unvoted**. The group picks the city; the machine picks everything inside
it. That is our page 1 with a swipe on it. **It is not our page 2 at all**, because in ours the vote is what produces
the stops.

**On the two things we care about, both answers are no.**

| Question                                    | Answer                                                                |
| ------------------------------------------- | --------------------------------------------------------------------- |
| Are losing swipes kept anywhere - shortlist, backup pool, ranked alternates? | **Nothing.** "Majority rules", "the best destination winning fair and square". Losers are never mentioned again |
| Anything when a place closes, or mid-trip?  | **Nothing.** No re-planning, substitution or contingency on either page |

**Why this matters to us.** The bench claim survives its most dangerous challenger. And the sentence in the previous
entry - "our pages 1 and 2, shipped" - **was an overstatement produced by a snippet**, which is the second time on this
branch that reading formatting-poor summaries has produced a scarier answer than reading the source. Say "Tripeza
swipes on where to go" in the pitch, not "Tripeza does what we do".

---

## SwipeSights  -  the closest competitor found, now that Tripeza has been read

|                  |                                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| **Link**         | https://swipesights.com/ , plus App Store `id6761259466`               |
| **Checked**      | 2026-09-07, **site and store listing read directly. App not installed** |
| **Tagline**      | "Plan Group Trips by Swiping. Free Itinerary Maker."                    |
| **Distribution** | iOS app plus web. Flights and eSIMs marked coming soon                  |

**This, not Tripeza, is the product that overlaps our page 2.** The swipe is on the actual places inside a trip, and
the vote is what builds the itinerary: "Swipe right on the places you love, left on the ones you don't. **Your
favorites become the plan**, ordered into a smart day by day route with opening hours and travel time built in."

**It already ships a weighted ranking, which is closer to the bench than anything else found.** Everyone swipes the
same attractions, right for yes, left for skip, **up for must-see, with super-likes carrying double weight and the
algorithm allocating extra time at those places**. Premium adds **vote analytics**. So the group's preference order
exists, is computed, and is shown back to them.

**And it still does not have a bench, because the ranking is spent on the wrong problem.** The order decides **how
long you stay** at the places that won. It is never held as a pool of pre-approved substitutes, and the left swipes are
discarded rather than benched - the description contrasts the loved against "the ones you don't", and only favourites
become the plan.

**On disruption it is not just silent, it hands us the quote.** Opening hours are built into the route at planning
time, which is prevention, not repair. Its own FAQ tells the group to "double-check opening hours closer to your trip
date" - **the closest competitor in the category telling users to handle the disruption case by hand.**

**Everything else it does**, so nobody pitches a feature it already has: live map of nearby places, events and
nightlife, TikTok and Instagram spot import, instant itinerary from one sentence or a pasted group chat, multi-city
trips with per-city routed days, hotel, restaurant, tour and attraction-ticket booking, Collections of saved places,
bill splitting, opt-in live group location, PDF and calendar export, group concierge for non-trip decisions, hosted
local events, and one-payer-covers-the-group premium.

**Why this matters to us.** Two things. **The instant itinerary from a pasted group chat is the strongest single
feature in this file** and it is aimed at the same enemy as our front door. And **a competitor computing a ranked
preference order and not using it for repair is the best possible evidence** that the bench is a real idea rather than
an obvious one: they had the ranking in their hands and spent it on dwell time.

---

## Plan Harmony

| | |
| --- | --- |
| **Link** | https://www.planharmony.com/group-trip-planning/ |
| **Checked** | 2026-09-06, **page read directly** |

**What it does.** "Propose activities and let the group vote, whether that's choosing a hotel, picking a day trip, or
deciding where to eat." Results tally automatically and "the winning choice can be added to the itinerary in one tap."
Real-time sync, offline access, budgeting, expense tracking.

**What it does not do.** The page says nothing about what happens to the options that lost, and **nothing at all about
cancellations, disruptions or contingency**. Read directly, so that absence is meaningful rather than an artefact of
searching.

---

## Stippl

| | |
| --- | --- |
| **Link** | https://www.stippl.io/ |
| **Checked** | 2026-09-06, **page read directly** |

"One Travel App To Replace Them All." Itinerary planner, budget planner, AI planner, packing list, travel tracker,
reels, photobook, eSIM, collaborative planning, journal. **No voting mechanism described, and nothing about mid-trip
changes or closed attractions.** The broadest all-in-one found, and it still stops before our claim.

---

## Trip.com, checked properly this time

| | |
| --- | --- |
| **Link** | https://www.trip.com/ask/questions/ai-trip-planner.html |
| **Checked** | 2026-09-06, **page read directly** |

The earlier Tier 1 entry quoted press releases rather than the product, which was a fair thing to be pulled up on.
Reading the product's own page:

**It does more than book hotels.** It generates "a day-by-day map showing optimized routes, recommended attractions,
and logical breaks", with an editor to "delete spots, add personalized notes, swap out dining suggestions, or drag
items into a different daily order".

**It does not do our two halves.** On groups it offers only sharing - "you can easily share your planned itinerary with
friends". **No voting. Nothing about re-planning when something closes.**

---

## What The Third Pass Establishes

**The voting half is crowded.** Tripeza, SwipeSights, Plan Harmony and Troupe all let a group vote on where to go and
turn the result into an itinerary. It cannot carry the originality claim on its own, and pitching "we have a voting
system" invites a judge to name one of these.

**The disruption half still looks empty.** Searching directly for apps that replace a closed attraction and reschedule
around it returned the opposite finding: current apps "track opening hours and provide route optimization", but nothing
found "automatically replace[s] closed attractions and reschedule[s] itineraries without user intervention". Advice
articles tell groups to build backup options **by hand**.

**So the claim narrows again, and lands where the verdict already put it.** Not voting. Not visualisation. **The bench:
that the vote leaves behind a ranked, pre-approved set of replacements, and that the itinerary uses them by itself when
something breaks.**

---

## What The Fourth Pass Establishes  -  2026-09-07

**The third pass named Tripeza "the most important unchecked item on the branch". It has now been checked, and so has
SwipeSights.** Neither app was installed; both the marketing site and the store listing were read directly for each,
which is a weaker claim than using the product and a much stronger one than the `[snippet only]` label they carried.

**The bench survives, and it survives the hard way.** Not because nobody in the category collects preferences -
SwipeSights computes a weighted ranking, sells the analytics for it, and lets a super-like buy extra time at a place -
but because **nobody spends that ranking on repair**. The order decides dwell time and nothing else. Losing swipes are
discarded in both products.

**The disruption half is now empty by direct reading rather than by absence of search results**, which is the stronger
form of the finding. Tripeza says nothing about it. SwipeSights builds opening hours into the route at planning time
and then tells the group, in its own FAQ, to "double-check opening hours closer to your trip date".

**Two things changed in the pitch as a result.**

- **Stop saying Tripeza ships our pages 1 and 2.** It votes on the destination, then generates the stops unvoted. A
  judge who opens it will find a weaker competitor than our own notes claimed, and overstating a rival is its own kind
  of error
- **SwipeSights replaces it as the product to name.** If a judge asks what is closest, the honest answer is
  SwipeSights, and the honest follow-up is that it had the ranking and used it for dwell time

**The most important unchecked item is now Troupe**, which the third pass already put second.

---

# Tier 2 - Products Shaped Like Ours

The original scans. Smaller, and easy to dismiss on quality - **but prior art does not care about user counts.** A
niche product that already ships our trick still ends a "nobody does this" claim.

## Wanderlog

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Link**              | https://wanderlog.com                                                        |
| **Checked**           | 2026-09-01                                                                   |
| **Who it is for**     | Anyone planning a multi-stop trip, solo or in a group                        |
| **Price**             | Free tier described as "fully functional", plus a paid Pro tier              |

**What it does well.** Markets itself as _"Your itinerary and your map in one view"_ - which is our own description of
our own layout, in their words. Route optimisation between destinations, accommodation and reservation import by
forwarding confirmation emails, budget tracking with expense splitting, real-time collaborative editing, place
suggestions, offline access, AI-assisted planning.

**What it does not do.** Nothing surfaced about the shape of a round trip. Collaboration is co-editing a document, not a
structured group decision.

**Why this matters to us.** If a judge knows one product in this space, it is probably this one. Our layout is not a
differentiator and should not be presented as one.

---

## Roadtrippers

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Link**              | https://roadtrippers.com                                                     |
| **Checked**           | 2026-09-01                                                                   |
| **Who it is for**     | Road trippers, heavily US-centric, strong RV following                       |
| **Price**             | Free, then US$35.99 / 49.99 / 59.99 per year                                 |

**What it does well.** Recommends stops along a route between two points. _"Roadtrippers Autopilot™ creates your
itinerary based on what we've learned from over 42 million trips."_ Five million points of interest, trip
collaboration, offline maps, live traffic.

**What it does not do.** Round-trip shape is not offered as a choice; the interface is Starting Point and Destination.

**Why this matters to us.** The 42-million-trip corpus is a moat. **Competing on quality of suggestions is a losing
line** - we cannot out-recommend that, and should not try to in the pitch.

---

## Furkot

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Link**              | https://trips.furkot.com                                                     |
| **Checked**           | 2026-09-01                                                                   |
| **Who it is for**     | Road trip planners who want fine control over daily driving                  |
| **Price**             | Not shown on the page read                                                   |

**What it does well.** The closest on mechanics. Multi-stop routing with optimisation, trips from a day out to a
continent crossing, attraction integration (trails, museums, national parks, dive sites), lodging shown on the map with
pre-filled booking dates. And the line that should worry us most: _"Tell us how long you want to drive every day, and we
will show you where to stop for the night."_

**What it does not do.** Supports loops, but does not appear to treat the return leg as a strategic choice the user
makes.

**Why this matters to us.** Time-budget-driven stop selection - the job our planner does - **is already shipped**. Our
remaining claim is narrower than it first looked.

---

## Malaysian AI trip planners `[not verified]`

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Link**              | malaysiafuelcost.com/trip-planner, discoveringmalaysia.info/plan, plantrip.io, trippathai.com, my.trip.com/guide/itinerary |
| **Checked**           | 2026-09-01, via search results only                                          |
| **Who it is for**     | People planning trips in Malaysia                                            |
| **Price**             | Free, as far as the listings say                                             |

**What it does well.** One of them advertises _"Pick a destination, days and budget for an instant day-by-day
itinerary"_ - our input set, verbatim. Another is an interactive map-based Malaysia itinerary generator.

**What it does not do.** Unknown. `[not verified]` - none of these were opened, and several look like thin SEO or
affiliate pages rather than real products.

**Why this matters to us.** Whether or not they are any good, they answer "has anyone done this for Malaysia" with a
yes, and **a judge with a phone can find them during the pitch.** Worth someone opening them properly before the Q&A.

---

## A WhatsApp group and a spreadsheet

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **Link**              | n/a                                                                          |
| **Checked**           | 2026-09-01                                                                   |
| **Who it is for**     | Almost every group trip actually planned in Malaysia                         |
| **Price**             | Free, already installed, everyone already knows how to use it                |

**What it does well.** Zero adoption cost. Handles argument, humour, photos and payment in the same thread. Nobody has
to be persuaded to open it.

**What it does not do.** Dates get settled by scrolling. Suggestions get lost. Nobody computes a route. When a plan
breaks, the whole thing reopens as a conversation.

**Why this matters to us.** **This is the real competitor, not Wanderlog.** If the app is more work than the group chat
for the first ten minutes, it loses regardless of how good the routing is. It also sets the bar for the group flow: the
planner must produce something before anyone is asked to do anything.

---

## Contour  -  the one that hurts

|                   |                                                                    |
| ----------------- | ------------------------------------------------------------------ |
| **Link**          | https://contourmaps.app/route-planner                              |
| **Checked**       | 2026-09-06, **page read directly**                                 |
| **Who it is for** | Drivers planning a scenic drive, Australia-focused                 |

**What it does well.** This, in their own words:

> "Set the destination the same as the origin and Contour plans a loop - a round trip that goes out on good roads and
> comes back on different ones, sized to the time you have."

**That is our differentiator, shipped.** Out one way, back another, and sized to a time budget - which is also Furkot's
trick. The 1 September scan missed it because it searched for trip planners, and Contour files itself under route
planners.

**What it does not do.** It **decides** the shape; it does not offer the traveller a choice between named strategies.
There is no group, no vote, no budget for the trip as a whole, no places-and-appeal layer - it optimises roads, not a
holiday. Whether the return leg is presented as a decision or just happens is `[not verified]`; only the marketing
sentence above was read.

**Why this matters to us.** Our claim can no longer be "nobody does this". At best it is now "nobody offers it as the
traveller's choice, and nobody does it for a multi-day group trip with places and a budget". That is a much thinner
claim and it must be said in exactly those words, because a judge who finds Contour after hearing "nobody does this"
stops believing the rest of the pitch.

---

## calimoto

|                   |                                                                    |
| ----------------- | ------------------------------------------------------------------ |
| **Link**          | https://support.calimoto.com/hc/en-us/articles/7989918956572-How-Do-I-Plan-a-Round-Trip |
| **Checked**       | 2026-09-06, via search summaries `[snippet only]`                  |
| **Who it is for** | Motorcyclists                                                      |

**What it does well.** A round-trip generator where the rider picks a distance from 30 to 300 miles, a compass
direction out of eight (or lets the app choose), and a routing profile such as winding or twisty. Re-running the same
distance and direction gives different loops rather than the same ride.

**Why this matters to us.** **The round trip is already a set of user-facing controls here**, not a routing artefact.
The controls are distance, direction and road character rather than trip shape, and there is no group or itinerary -
but "the loop is something the user configures" is demonstrably not a new idea.

---

## Roadtrippers, revisited

**Checked again 2026-09-06.** Roadtrippers has a **"Make Round Trip"** feature that adds the starting point as the
final destination `[snippet only, the support page returned 403]`. That is the weak version - it closes the loop and
retraces; it does not choose a different return. **This one does not damage our claim**, and the 1 September entry
above stands.

---

## The academic position

Our routing is not novel and should not be claimed as such. It is the **Tourist Trip Design Problem**, a documented
extension of the **Orienteering Problem**: maximise the interest of visited points subject to time and budget
constraints, with meta-heuristic solutions including GRASP.

- https://www.sciencedirect.com/science/article/pii/S2214716022000069
- https://www.mdpi.com/2079-9292/11/3/357
- https://link.springer.com/article/10.1007/s40558-024-00297-w

**Cite it openly.** Standing on known research reads as competence under Feasibility; pretending we invented it reads
as ignorance the moment a judge recognises it.
