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
