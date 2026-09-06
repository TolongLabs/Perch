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
| 2026-09-06 | A second mockup: a slide-deck layout with five sections, and the map handed to Google Maps | The custom map was the biggest cost and the least novel part; a deck with pages reads faster in a demo | Jin Siang, `../inbox/2026-09-06-slides-prototype-dump.md` |
| 2026-09-06 | The round-trip differentiator stopped being "nobody does this" and became a much thinner claim | Contour ships a loop that goes out one way and back another; calimoto makes the loop a set of controls | International scan, `../market/deck-scan.md` |
| 2026-09-06 | Photo spots demoted from feature to nice-to-have; never to be pitched as novel | It is a whole product category - Locationscout has 233,000 spots, PhotoHound gives angle, time and gear | Same scan |
| 2026-09-06 | Kept the idea, but the headline claim moved from the round trip to the self-repairing itinerary | Originality risks ~4 marks; 30 marks sit unclaimed in diagrams, mentors, breadth and the unnamed user | Verdict, `build-verdict.md` |
| 2026-09-06 | Rejected "all-in-one platform" as the differentiation argument | The incumbents own breadth, and five thin pages cost more under Feasibility than they gain under Creativity | Same verdict |
| 2026-09-06 | Competitor set rebuilt around heavyweights; the enemy is a five-app stack, not Wanderlog | Both scans searched for products shaped like ours and found niche apps a judge would never name | Jin Siang: "none of them are actual usable products" |
| 2026-09-06 | Group voting dropped as an originality claim; the bench is now the whole claim | Tripeza, SwipeSights and Plan Harmony all ship vote-then-generate for groups. Nothing found re-plans after a closure | Third scan, `../market/competitors.md` Tier 1b |
| 2026-09-06 | Added a "worth buying" page: what to buy, where, and the tourist markup | Tourist-facing markets price for people who will not walk further, and nothing in the trip tells you that | Jin Siang, `../inbox/2026-09-06-worth-buying-dump.md` |
| 2026-09-06 | Mockup deployed to Vercel on a public URL | Submission requires viewable design-prototype links; a local file cannot be submitted | Jin Siang |

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

### 2026-09-06 - The deck layout, and what it quietly drops

**Before.** One mockup: a map on the right, a control panel on the left, and the round-trip strategy, the vote, the
ranked bench and the simulated disruption all living in that panel.

**After.** A second mockup, `../prototype/travel-planner-slides.html`, laid out like a slide deck. Five sections down
the left: the trip with a poster and the itinerary; "where should we go", a date strip over a grid of places that are
still just Option 1 to Option 8; "take care", a page of local cautions plus a news feed for the trip; photo spots with
the angle and the time of day; and a route page that is one button opening the whole trip in Google Maps.

**Why.** Asked for directly. The reasons that hold up on inspection: a deck is what a judge watches in a 3-5 minute
video anyway, and handing the map to Google Maps removes the metered map API that was the honest feasibility risk in
the idea log. A plain directions link needs no key and works today.

**What it drops, and this is the disagreement recorded.** The round-trip choice - the one claim the competitor scan
left standing - has no home in the deck. Neither do the vote, the bench, or the automatic substitution when a stop
closes, which together were the answer to the brief's "re-planning when something changes mid-trip". The "take care"
news page gestures at disruption but a person updates it by hand; nothing re-plans. Two of the new pages, cautions
and photo angles, are not in the brief's four capabilities and neither has a data source yet. If this layout is the
one we keep, Originality (7%) needs the round-trip choice put back on the trip page, and the news page needs to do
something to the itinerary rather than sit beside it. Not resolved today; both mockups stay.

### 2026-09-06 - The international scan, and what it took away

**Before.** One originality claim survived the 1 September competitor scan: nobody treats the shape of a same-airport
round trip as the traveller's decision. The slide-deck mockup then added photo spots, cultural cautions and a news feed
on the assumption that those were open ground.

**After.** A second scan, this time looking internationally and at Japan specifically, and searching for *route*
planners rather than only *trip* planners. Four of the five new pages are occupied, and the round-trip claim is
damaged. Full detail in `../market/deck-scan.md`.

- **Contour** plans a loop that "goes out on good roads and comes back on different ones, sized to the time you have".
  Read directly. That is our sentence, shipped
- **calimoto** already exposes the round trip as controls: distance, one of eight compass directions, road character
- **Photo spots are a category**, not a feature. Locationscout lists 233,000+ spots across 184+ countries; PhotoHound
  gives the angle, the time, the gear and the weather, and builds itineraries from spots
- **Cautions and destination news are two mature categories.** Sitata alerts against your exact itinerary; for Japan
  the Tourism Agency itself ships a free 14-language disaster-alert app
- **The poster-deck format is a B2B genre** - Travefy, Axus, Vamoos sell exactly that to travel agents

**Why.** Asked for a deep search before any of this got pitched. The first scan searched the wrong category name.

**What we gave up by doing this.** The clean version of the originality pitch. What is left is narrower and true:
route planners vary the return leg for drivers, but no multi-day trip planner puts the shape of the round trip to the
travellers as a decision and then plans places, budget and a group vote around the answer. That sentence must be said
in full. Compressed to "nobody does this", it is now false, and a judge who finds Contour stops believing the rest.

**What this hands us instead.** Two seams the scan could not fill. Nothing found attaches a cultural caution to the
**stop it applies to** inside an itinerary. And Sitata proves the valuable version of our news page is the
itinerary-aware one - which is what the map-first mockup already does with the bench, and what the deck mockup dropped.
That is now an argument for merging the two mockups rather than choosing between them.

**Still open.** `Troupe` ships polls with **ranked voting** for group trips and has not been read directly. Our ranked
bench is claimed as novel and that claim is `[not verified]` until someone opens Troupe.

### 2026-09-06 - The competitor set was aimed at the wrong target

**Before.** Two scans, both searching for products *shaped like ours*: trip planners, route planners, photo-spot
databases, group-voting apps. The list that came back was mostly niche, and Jin Siang rejected it in one line - "none
of them are actual usable products".

**After.** He was right about the method and wrong about the conclusion. Searching by product shape surfaces whatever
affiliate round-up articles rank for, which is long-tail apps. Searching by **what a group actually does** surfaces a
much harder list, now Tier 1 in `../market/competitors.md`:

- **ChatGPT and Gemini.** Around 40% of travellers have used AI to plan a trip, 42% to build an itinerary, and
  roughly two-thirds of under-45s would use it for recommendations. Itinerary generation is commoditised
- **Google Maps lists**, the actual default, with collaborative lists and offline sync
- **Trip.com TripGenie**, whose own figures name **Hong Kong, Singapore and Malaysia** as the heaviest AI-travel users
- **Tripadvisor Trips**, an OpenAI-built generator standing on a billion reviews
- **Xiaohongshu**, 300 million monthly users aged 18 to 40, where young travellers plan itineraries around check-in
  photo spots. This, not PhotoHound, is what beats our photo page
- **WhatsApp with native polls**, which removes voting as a reason to leave the group chat

**Why.** Jin Siang pushed back on the quality of the list. The pushback was correct and produced a better one.

**What we gave up by doing this.** Any comfort. The heavyweight list is worse for us than the niche list was:
generation is free, our demographic is named as the world's heaviest AI-travel users, our photo page is beaten by a
social network, and our vote is matched by a chat app.

**What it hands us instead, and it is worth more.** Every one of them stops at the same place. ChatGPT forgets the
plan. Google Maps holds places rather than decisions, and its own reviewers call collaborative editing "glitchy and
not real-time". Tripadvisor generates once. Xiaohongshu never commits. TripGenie advises but does not own the group's
approved itinerary. **Nothing holds a committed group plan and repairs it when the world changes** - which is the
verdict reached this morning, and the sentence the problem statement itself asks for.

**The correction to the disagreement, kept because it matters.** Dismissing Contour and calimoto for being small is a
mistake. **Prior art does not care about user counts.** They still end any "nobody does this" claim about the round
trip. Tier 2 in `../market/competitors.md` now says so explicitly.

### 2026-09-06 - Third pass: the voting half is gone, the bench survives

**Before.** After the heavyweight scan, the working claim was that voting plus warnings, joined together, was ours.

**After.** A third search, this time for the *behaviour* rather than the product category - vote on attractions, then
generate, then handle it breaking. It found closer competitors than either earlier pass.

- **Tripeza**, "Your Group Trip on Autopilot", names our exact enemy: it replaces "messy WhatsApp arguments and Excel
  sheets". Group enters budget and vibe, app suggests destinations and attractions, group swipes and votes, votes lock
  the destination, AI generates the day-by-day itinerary. **This is our pages 1 and 2, shipped**
- **SwipeSights** does the same swipe-to-vote group planning
- **Plan Harmony**, read directly: propose activities, group votes, winner added to the itinerary in one tap
- **Stippl**, read directly, is the broadest all-in-one found and has no voting and nothing on disruption
- **Trip.com**, read directly this time rather than via press releases: it does generate day-by-day itineraries with
  recommended attractions and optimised routes, so the earlier dismissal of it as "just hotels" was wrong. But group
  support is sharing only, and there is no re-planning

**Why.** Jin Siang asked whether anything publicly available already does this, and was right to keep asking. The two
earlier passes had both searched by product shape.

**What we gave up by doing this. The voting system as an originality claim.** Four products now ship vote-then-generate
for groups. Saying "our differentiator is the voting system" in front of a judge invites them to name one.

**What survived, and it is the third time it has survived a scan.** Searching directly for apps that replace a closed
attraction and reschedule around it produced the opposite result: current apps track opening hours and optimise routes,
but nothing found replaces a closed stop and reschedules without the user doing it. Advice articles tell groups to
build backups **by hand**. So the claim is not the vote and not the warning. **It is the bench** - that the vote leaves
a ranked, pre-approved replacement set behind it, and the itinerary spends it automatically when something breaks.

**Outstanding, and now the most valuable check on the branch.** Nobody has opened **Tripeza**. It is closer to our idea
than Troupe. If it turns out to keep losing swipes as a backup pool, the claim is gone and the idea needs rethinking.

### 2026-09-06 - Worth buying, and the pattern it finally makes visible

**Before.** Pages 3 and 4 were built as standalone reference pages sitting beside the itinerary, and the deck scan
found both categories occupied.

**After.** A sixth page, "worth buying": what is actually worth carrying home, roughly what a local pays for it, and
which markets price for locals versus for people who will not walk three streets further. Yogyakarta sample data,
prices invented and labelled as such on the page.

**Why.** Jin Siang's observation, and it is a good one: most markets a traveller is routed to are built for tourists
and priced accordingly, so the useful question is not "where is the market" but "which market, and what is it fair to
pay there".

**The pattern this makes visible, which is worth more than the page.** Cautions (page 3), photo angles (page 4) and
now prices (page 6) are all the same thing: **local knowledge that only matters at one specific stop.** As separate
reference pages they each lose to a category incumbent - Travel Smart, PhotoHound, and for prices, Xiaohongshu.
Attached to the stop they belong to, they are the one seam `../market/deck-scan.md` could not fill. The new page says
this in a box on the page itself rather than pretending otherwise.

**The disagreement, recorded once.** This is the sixth page on a five-page deck, and the verdict this morning said
breadth of features is a liability under this rubric. Adding a page is the opposite of what that concluded. It is
worth having because the pricing insight is specific, regional and true, and because it strengthens the
attach-to-the-stop argument. It is **not** worth pitching as a feature, and the deck now needs the vote and the bench
back more urgently than it needs a seventh page.

**Live at** https://codenection-travel-planner.vercel.app - deployed from a copy, so it does not update on push.

