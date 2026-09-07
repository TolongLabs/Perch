# PRD — Perch

**What.** The problem in the organisers' own words, the aim and objectives the build is measured against, who it is for,
what the market already does, and then the requirements, user stories and acceptance criteria that follow from all of
it. It is what `hackathon-scope-cutter` cuts against.

**Why the framing sections are here and not only in `PRODUCT.md`.** They are the same ground read for a different
purpose, and both readings are needed.

|                 | [`PRODUCT.md`](PRODUCT.md)                                | This File                                                           |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| **Reads it as** | An argument. Who, why, and which directions were rejected | A specification input. What the build is measured against           |
| **Form**        | Narrative and prose                                       | Tables, graded figures, and numbered objectives with a measure each |
| **Wins on**     | Any question of concept, positioning or scope philosophy  | Any question of what must be true on 13 September                   |

**Nothing here restates `PRODUCT.md`'s reasoning.** Where it argues a case, this file cites it and moves on. Where a
figure appears, it appears with how well sourced it is.

**What it does not own.** Architecture, data models and API contracts belong to [`TRD.md`](TRD.md). Palette, type,
radius, spacing and motion belong to [`DESIGN.md`](DESIGN.md). Where a requirement needs a visual rule it cites that
file instead of restating it.

**Every requirement traces to `PRODUCT.md` or to the ideation notebook in [`research/`](research/)**, and cites the
source wherever the trace is not obvious. A requirement with no source behind it is one somebody invented.

---

## The Problem, In The Organisers' Words

**This is the brief, verbatim.** Every requirement below traces to one of the four capabilities it names, and
[`source/problem-statements.md`](source/problem-statements.md) is the append-only record of it.

> **Background:** Planning a trip means dealing with flights, places to stay, budgets, activities, and whatever everyone
> in the group actually wants to do, and that's before anything changes at the last minute. It's a lot to hold together,
> and it usually ends up scattered across five different apps and a group chat.
>
> **The Problem:** Most travel apps only handle one piece of this with either bookings, or budgeting, or itineraries. So
> travellers end up manually piecing it all together themselves. Group trips make it worse, since getting everyone's
> schedules, budgets, and preferences to line up is genuinely difficult. And when something changes mid-trip, there's
> rarely any real help from existing platforms in adjusting.

**Four capabilities are named, and we answer all four with one mechanism rather than four features.**

| **Capability Named In The Brief**                | **Where It Lands**                                             | **Requirements**  |
| ------------------------------------------------ | -------------------------------------------------------------- | ----------------- |
| Budgeting                                        | Place costs on every card, day totals on The Desk and The Book | R18, R26, R35     |
| Building an itinerary                            | Calendar drag, scheduler and feasibility check                 | R1, R26, R27, R29 |
| Syncing preferences across a group               | Reel swipe tally with owner weight and unanimous gold          | R19, R23, R24     |
| Adjusting plans when things don't go as expected | Perch drawer offering the next-ranked voted-in card            | R4, R31           |

**The third is the one we are actually competing on**, and the brief's own phrase for it is _"getting everyone's
schedules, budgets, and preferences to line up"_. Every team builds a vote; the mentor session of 7 September said so in
as many words. The swipe, the owner weight and the calendar the tally feeds are how ours is represented, and
[`research/decisions/build-verdict.md`](research/decisions/build-verdict.md) records why breadth beyond that is a
liability.

**Six general stipulations bind this build**, from the same source file:

1. **A web-only submission is acceptable.** Stipulation 3. We build web, mobile-first
2. **Any stack, framework or language.** Stipulation 5
3. **Solutions must be deployable**, and demonstrable somewhere other than a local dev environment. Stipulation 6. This
   is why the prototype is on Cloud Run and not on a laptop
4. **Third-party APIs are allowed** where a free tier or trial exists, and teams carry their own keys. Stipulation 7
5. **Boilerplate and open-source libraries are allowed**, but the core logic must be built during the hackathon.
   Stipulation 9
6. **All submissions must be original work created during the hackathon period.** Stipulation 11. The one carried-in
   exception, `scripts/demo/`, is declared in [`../scripts/demo/README.md`](../scripts/demo/README.md)

---

## The Problem, As We Understand It

**We are not competing with a travel planner. We are competing with a stack of free apps she already has.**
[`PRODUCT.md`](PRODUCT.md#the-problem) argues this at length; what follows is the compressed version the requirements
are written against.

### The Causes, Not The Symptom

**The symptom is "planning is a hassle". The causes are four, and only the fourth is unserved.**

| **Cause**                                     | **Who Serves It Today**                                  | **Ours?**            |
| --------------------------------------------- | -------------------------------------------------------- | -------------------- |
| Producing a plausible itinerary is slow       | Solved. Chatbots commoditised it                         | No                   |
| The plan lives in five places at once         | Partly solved. Wanderlog puts itinerary and map together | No                   |
| Getting five calendars and budgets to line up | Partly solved. Polls and swipe apps produce a result     | Only as a by-product |
| **Nothing owns the plan after it is made**    | **Nobody**                                               | **Yes**              |

> Every tool a group already uses can produce a plan. **None of them owns the plan afterwards.**

### The Stakeholders

**The person who pays for the problem is not the person the category sells to**, and that gap is the opening.

| **Stakeholder**                 | **What They Carry Today**                                                                 | **What Changes**                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **The organiser**               | Every re-check, every re-plan, and the social cost of chasing four people                 | The repair happens without her. She is told, not consulted                 |
| **The other four**              | Nothing, which is the problem: no stake means no reply                                    | One tap, inside a magazine, with no install and no account                 |
| **The person who fronts money** | The deposit, then a month of asking. `[synthetic]` amounts fronted ran RM 680 to RM 2,500 | **Nothing. Bill splitting is a Won't** - see [Out Of Scope](#out-of-scope) |
| **Local operators**             | A cancellation is a lost booking with no fallback offered                                 | Out of scope for the prototype, named so it is not claimed                 |

---

## The Figures, And What Each Is Worth

**Every number below is followed by how well sourced it is, because most of them are weaker than they look.** The
research branch grades its own reading, and this table carries that grade forward rather than laundering it.

| **Grade**        | **Means**                                                                              |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Read**         | The page was fetched and its text read. Quotes are exact                               |
| `[snippet only]` | The figure came from a search summary or press coverage. **The page was never opened** |
| `[synthetic]`    | Produced by three language models given a persona brief. **Not evidence about people** |
| `[assumed]`      | Written by us with no source behind it, and marked as such at the source               |

### The Category Is Large, Crowded And Commoditised

| **Figure**                                                                                              | **Grade**            | **Source**                                                         |
| ------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------ |
| "Around 40% of travellers worldwide have now used AI to plan a trip", Trip.com's published data         | `[snippet only]`     | [`research/market/landscape.md`](research/market/landscape.md)     |
| "Of those, who use it for most or every trip \| 63%"                                                    | `[snippet only]`     | [`research/market/competitors.md`](research/market/competitors.md) |
| "Who used generative AI to build an itinerary \| 42%"                                                   | `[snippet only]`     | [`research/market/competitors.md`](research/market/competitors.md) |
| "Travellers under 45 who would use AI for recommendations \| ~two-thirds"                               | `[snippet only]`     | [`research/market/competitors.md`](research/market/competitors.md) |
| Tripadvisor, "over a billion reviews across more than eight million businesses"                         | `[snippet only]`     | [`research/market/competitors.md`](research/market/competitors.md) |
| Xiaohongshu, "Over 300 million monthly active users ... around 70% women"                               | `[snippet only]`     | [`research/market/competitors.md`](research/market/competitors.md) |
| Roadtrippers, "based on what we've learned from over 42 million trips", five million points of interest | **Read**, 2026-09-01 | [`research/market/competitors.md`](research/market/competitors.md) |
| Roadtrippers pricing, "Free, then US$35.99 / 49.99 / 59.99 per year"                                    | **Read**, 2026-09-01 | [`research/market/competitors.md`](research/market/competitors.md) |

**What the badly-sourced half is used for, and what it is not.** Every `[snippet only]` figure here supports exactly one
argument: **generating an itinerary is not hard and not ours to claim.** None of them is used to size a market, justify
a feature or describe our user. **No funding, valuation or revenue figure for any competitor exists anywhere on the
research branch**, so none appears here.

**The 40% is about travellers worldwide, not about Aisyah.**
[`research/market/landscape.md`](research/market/landscape.md) says so in as many words, and the same file records that
a Malaysian-specific version of the figure was never found.

---

## Aim And Objectives

**The aim, in one sentence**, and it is [`PRODUCT.md`](PRODUCT.md#the-one-sentence)'s:

> **A group trip planner where the group swipes on reels of places, the owner drags what won onto a three-slot-a-day
> calendar, a heuristic scheduler orders each day and colours it by how well the route holds, and the finished trip
> prints as The Book, a field-guide-style keepsake.**

**Five objectives, each with the thing that would show it was met.**

| **#**  | **Objective**                                            | **Met When**                                                                             | **Requirements** |
| ------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------- |
| **O1** | Turn reel swipes into a ranked group tally               | One swipe session produces a percentage per place, with unanimous gold, zero greyed out  | R18-R25          |
| **O2** | Build a day-by-day calendar from what the group voted in | The owner drags voted-in cards onto 4 days x 3 slots; pinned stops never move            | R26, R28-R31     |
| **O3** | Schedule daily routes without AI                         | The heuristic clusters by area, checks opening hours, colours each day by feasibility    | R5, R7, R27, R29 |
| **O4** | Produce The Book as a printed keepsake                   | Every checklist item ticked triggers the printed state with no decision controls visible | R32-R37          |
| **O5** | Make contributing cost zero install and one tap          | A group member opens a link, taps once, and has voted. No account, no download           | R12, R21         |

**O1 and O2 are the product. O3, O4 and O5 are what stop it being a demo.** If O1 fails, the tally is theatre. If O2
fails, the owner is still assembling in a group chat. The heuristic (O3) makes each day testable without a judge having
to verify transit times by hand. The Book (O4) is what makes the output worth keeping, and the zero-install vote (O5) is
what makes the tally meaningful rather than a solo opinion.

---

## Target Users

**Every claim about the user on this page is `[assumed]` or `[synthetic]`, and
[`research/users/interviews/`](research/users/interviews/) is empty.** No real person has said any of it. That is
recorded here and not hidden, because a judge who asks will find out in one question.

### The Primary User

| **Attribute**             | **Aisyah, 24**                                                                                                                        | **Grade**                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Situation**             | Graduated two years ago, junior office job in KL, renting a room, no car                                                              | `[assumed]`                                |
| **Group**                 | "The same four or five friends from university, now on different jobs and shifts"                                                     | `[assumed]`                                |
| **Trip shape**            | "Three nights, four days, because that's the longest you can do on one day of annual leave by tagging a weekend and a public holiday" | `[synthetic]`, all three models unprompted |
| **When she plans**        | Alone, at night. One panel answer put it at "a Thursday night around 11 PM"                                                           | `[synthetic]`                              |
| **Hard constraint**       | "Four of the five friends will not install a second app", so the entry is a shared link                                               | `[assumed]`                                |
| **What she does instead** | WhatsApp first, then a booking app, then Google Maps, then a money tool                                                               | `[synthetic]`, corrected 2026-09-07        |

**The trip length in the fixture is three nights and four days because of that row**, not because four days looked tidy.
[`research/users/synthetic-panel-2026-09-07.md`](research/users/synthetic-panel-2026-09-07.md) records all three models
giving the same length **and the same cause**, unprompted.

**One contradiction is load-bearing and is not smoothed over.** Asked how disagreements actually get settled, not one
answer described a vote. The finding that survives is narrower and better: **a vote that runs over days is a fiction; a
vote that runs in one sitting and leaves a ranked residue behind it is not.**

### Secondary Users, And Who We Are Not Building For

| **Segment**                                   | **Standing**                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **The other four in the group**               | **Served, not pitched.** They get a magazine with gaps and one tap                         |
| **Solo travellers**                           | **Supported, never pitched.** Phase 1 is skipped and phase 2 is pre-resolved               |
| **Long-haul backpackers with weeks of slack** | **Not them.** A closed stop costs an afternoon they had spare                              |
| **Families, or agent-booked trips**           | **Not them.** The decision is not democratic and the constraints are not preference-shaped |
| **"Students" as a category**                  | **Not them.** Too broad, and the wrong shape. Target Group Alignment rewards narrow        |

---

## Market Fit

**Four competitor passes ran on `research`, and two products were read directly rather than from a summary.** The
strongest finding is a competitor's, which is a better originality argument than "nobody does this".

### What The Category Already Does Well, And Owns

| **Product**      | **What It Owns**                                            | **Grade**              |
| ---------------- | ----------------------------------------------------------- | ---------------------- |
| **Wanderlog**    | "Your itinerary and your map in one view" - its own tagline | **Read**, 2026-09-01   |
| **Roadtrippers** | Suggestion quality, backed by 42 million trips              | **Read**, 2026-09-01   |
| **Tripeza**      | **Swiping on where to go**, not on the stops                | **Read**, 2026-09-07   |
| **Xiaohongshu**  | Inspiration, at a scale no prototype competes with          | `[snippet only]`       |
| **WhatsApp**     | Polls, and the group itself. It is free and already open    | **The real incumbent** |

### The Finding The Claim Rests On

**SwipeSights already computes a ranked group preference order** - super-likes carry double weight, and premium sells
vote analytics - **and spends it on how long you stay at the places that won.** The losing swipes are discarded. Its own
FAQ tells the group to _"double-check opening hours closer to your trip date."_ Read directly on 2026-09-07, site and
store listing; **the app was not installed.**

**A direct competitor had the ranking in its hands and used it for a different problem.** That is the gap, stated
precisely, and it is checkable.

### What Would Kill It

| **Risk**                                     | **Standing**                                                                                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Troupe already benches its losing votes**  | **Unchecked, and it is the single biggest hole.** [`research/market/sources.md`](research/market/sources.md) has no URL for it. If true, the originality claim is gone |
| **Real place data**                          | Unsolved. Named and costed in [`TRD.md`](TRD.md)                                                                                                                       |
| **Nobody taps**                              | Designed around. The trip is valid with zero group input, so a tap is an upgrade and never a gate                                                                      |
| **The group installs nothing**               | Designed for. No account, no install, the link opens inside WhatsApp                                                                                                   |
| **"Nobody does this" turns out to be false** | Already partly false and struck through on `research`. The claim was narrowed rather than defended                                                                     |

**Checking Troupe is half an hour of work and it is still not done.** It is the most valuable half hour available before
the video is recorded, and it is tracked rather than assumed away.

## What This Prototype Is

**A UI prototype with simulated logic, not an application.** Every acceptance criterion in this file is written against
observable UI behaviour, and none against server behaviour, because there is no server.

| **Concern**     | **In The 13 September Prototype**                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Accounts**    | None. Sign-in is a built surface but the prototype works without it; the group must be able to open the Book without an account |
| **Data**        | One committed Tokyo fixture. Nothing is written that outlives the tab                                                           |
| **Network**     | Reel MP4s from a public GCS bucket. No place lookup, no opening-hours call, no weather feed, no booking API                     |
| **Swipe Logic** | **Real.** The tally is computed from each viewer's swipes. This is the one piece of logic that may not be faked                 |
| **Scheduler**   | **Real.** A deterministic heuristic over the committed travel matrix: cluster, best period, nearest neighbour. No model call    |

**Simulated logic is what the organisers asked for**, not a shortcut we are taking. Their own video outline says it in
as many words: _"Prototype demo does not mean you need working logic, your prototype is your UI design, and the demo is
you walking through the important screens"_ ([`source/submission-template.md`](source/submission-template.md)). Design's
**Mockup Completeness** band scores "covers the core flow end-to-end", not polish per screen
([`source/prototype-judging-rubrics.md`](source/prototype-judging-rubrics.md)).

**The two things that must not be simulated are the swipe tally and the scheduler**, because together they are the
claim. If the percentages are canned rather than computed from the viewer's swipes, the tally is a video effect and a
judge who swipes twice will find that out.

**"Done" on 13 September means three things, and nothing else.**

1. The [Demo Path](#the-demo-path) runs end to end in one browser session at 390px with no dead click
2. Every requirement below passes its acceptance check **in the deployed prototype**, not on a branch
3. The repo is public, and the prototype URL, the video and the slides are linked from [`README.md`](README.md)

---

## Requirements Per Surface

Each is one testable sentence. **Must tier only**; everything below the Must tier is in
[Deferred, With A Trigger](#deferred-with-a-trigger). Routes follow the plan's route table:

| Route              | Surface    | Register | Status      |
| ------------------ | ---------- | -------- | ----------- |
| /                  | Landing    | Desk     | Built, keep |
| /sign-in           | Sign In    | Desk     | Built, keep |
| /trips             | Dashboard  | Desk     | Re-fixture  |
| /new               | Onboarding | Desk     | New         |
| /t/:tripId/swipe   | The Deck   | Desk     | New         |
| /t/:tripId/votes   | The Tally  | Desk     | New         |
| /desk              | The Desk   | Desk     | Rebuilt     |
| /desk/before-we-go | Checklist  | Desk     | New         |
| /t/:tripId         | The Book   | Book     | Rebuilt     |

Old surfaces Interview and the prior Desk body are deleted, not kept behind a flag.

### Cross-Cutting — Rules That Shape Every Screen

The eight screen-shaping rules from the plan are stated as requirements with their thresholds intact.

| **ID** | **Requirement**                                                                                                                                                                                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | Every day offers exactly three slots — morning, afternoon, evening. Cards drop into slots; there is no free-time draggable zone on the calendar                                                                                                                            |
| **R2** | The trip is valid with zero group input: the owner's swipes alone produce a complete plan with no empty days and no placeholder stops                                                                                                                                      |
| **R3** | The owner's swipe carries 1.5x weight in the tally computation, and the owner can pin any card to a day and slot; the scheduler never moves a pinned card                                                                                                                  |
| **R4** | Deleting any card from the calendar opens the Perch drawer offering the next-ranked voted-in card for that slot; each day keeps at least two stops, never emptying to one or zero                                                                                          |
| **R5** | Feasibility colours per day: green when every stop fits its hours and the day's travel plus dwell fits 09:00 to 21:00; gold when it fits but the order is more than 25 percent slower than the scheduler's order; red when a stop is outside its hours or the day overruns |
| **R6** | A date change on the trip regenerates the calendar; votes survive because they attach to places, not dates. A destination change creates a new plan                                                                                                                        |
| **R7** | The scheduler is a heuristic — cluster by area per day, order by best period and opening hours, nearest neighbour within the day. The UI never calls it AI; any AI-written text is a rationale sentence, not a decision                                                    |
| **R8** | No network call occurs after the initial page load. Reel MP4s are served from a public GCS bucket; everything else is a committed fixture without external lookup                                                                                                          |

### Landing — /

| **ID**  | **Requirement**                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **R9**  | The landing renders one solid call to action that leads to sign in, and no second solid button                                              |
| **R10** | The landing page shows Perch's name and one-line value proposition; it contains no carousel, no testimonials, no screenshots of the product |

### Sign In — /sign-in

| **ID**  | **Requirement**                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **R11** | The sign-in surface draws disabled email and password fields and one working control, Sign In As Guest, and says on screen that no authentication exists behind it |
| **R12** | A joiner following the invite link never sees the sign-in surface; only the owner's path passes through it                                                         |

### Dashboard — /trips

| **ID**  | **Requirement**                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **R13** | The dashboard lists every trip the signed-in user has access to, each showing trip name, dates, destination and an invite code |
| **R14** | For group trips, each trip card shows how many people have voted and who has not yet voted                                     |

### Onboarding — /new

| **ID**  | **Requirement**                                                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R15** | The onboarding surface collects trip dates on a drawn date-range picker, activities and destination as chips with free text, all on one scrollable screen with no native control |
| **R16** | A free-text field sits above each chip group so typed input comes first, and Tokyo is the only destination chip that can be selected                                             |
| **R17** | Submitting the onboarding form creates the trip and navigates the owner directly to /t/:tripId/swipe                                                                             |

### The Deck — /t/:tripId/swipe

| **ID**  | **Requirement**                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R18** | The Deck presents place cards as 9:16 reel MP4s that autoplay muted in a loop, with name and specimen line in the bottom-left corner and creator handle and platform in the bottom-right |
| **R19** | Swiping right or tapping Keep marks a place as yes; swiping left or tapping Pass marks it as no; both record the same vote                                                               |
| **R20** | Only the top two cards mount their video; cards below in the stack show a static poster image to conserve bandwidth                                                                      |
| **R21** | Joiners arriving from an invite link land directly on /t/:tripId/swipe and skip the onboarding flow entirely                                                                             |
| **R22** | After swiping through all cards, the user sees a transition to the tally; there is no way to re-swipe a card once judged                                                                 |

### The Tally — /t/:tripId/votes

| **ID**  | **Requirement**                                                                                                                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R23** | The tally lists every place with its percentage in tabular numerals: unanimous places carry `--gold` and an Unanimous chip, places at zero are greyed, marked Eliminated and excluded from scheduling |
| **R24** | The owner's swipe weight is 1.5x in the percentage computation, reflected in the displayed tally bars                                                                                                 |
| **R25** | When the owner has finished swiping, the surface offers Open The Desk leading to /desk; a joiner sees waiting text and no button                                                                      |

### The Desk — /desk

| **ID**  | **Requirement**                                                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **R26** | The Desk presents a calendar grid of 4 days x 3 slots (morning, afternoon, evening) where voted-in cards can be dragged from a sidebar into slots                                    |
| **R27** | Each day carries a feasibility colour: green, gold or red, per R5 thresholds, computed by the heuristic scheduler                                                                    |
| **R28** | A sidebar lists all voted-in cards not yet placed on the calendar, each showing name, kind and a drag handle                                                                         |
| **R29** | Tapping Apply after placing cards commits the arrangement and triggers the scheduler to optimise the order within each day; cards fly into their slots with a 40ms stagger animation |
| **R30** | Pinning a card to a day and slot locks it in place; the scheduler skips pinned cards when computing the day's order                                                                  |
| **R31** | Deleting a card from any slot opens the Perch drawer showing the next-ranked voted-in card for that slot; tapping the offered card replaces it without a confirmation step           |

### Checklist — /desk/before-we-go

| **ID**  | **Requirement**                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R32** | The checklist derives items from the trip fixture: passport validity, Suica card, teamLab ticket, yen cash, travel insurance, and a note that JR Pass is not needed for Tokyo-only |
| **R33** | All checklist items must be ticked before the Print The Book action is enabled; a disabled button shows how many items remain                                                      |
| **R34** | Ticking all items enables the Print action, which navigates to /t/:tripId in its printed state                                                                                     |

### The Book — /t/:tripId

| **ID**  | **Requirement**                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R35** | The Book renders one plate per day in the Book register (paper #F2EDE0, zero radius, Newsreader prose), with every decision control absent and no blank slots |
| **R36** | Each day plate includes a Transit Route link that opens Google Maps transit directions through that day's stops in order                                      |
| **R37** | The Book is reachable from a shared URL that opens inside WhatsApp's in-app browser with no account step and no chrome beyond the browser's own               |

---

## Acceptance Criteria

**One observable check per requirement, runnable by a judge in the deployed prototype.** No check requires a console, a
network tab or an explanation from us.

| **Req** | **The Check**                                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1**  | Open any day on the Desk. Exactly three slots appear: Morning, Afternoon, Evening. Drop a card into each; the gap between slots has no draggable area                                                                  |
| **R2**  | Sign in as the owner only, swipe through the deck, skip inviting anyone. The Desk shows a complete plan with every slot filled and no placeholder text                                                                 |
| **R3**  | Compare the tally with and without the owner's swipe. The owner's YES counts 1.5x a group YES. Pin a card to a day and slot, then apply the scheduler; the pinned card is exactly where it was placed                  |
| **R4**  | Delete a card from a day with two stops. The Perch drawer opens offering the next-ranked card. Accepting it keeps the day at two stops. Attempting to delete the last stop fails                                       |
| **R5**  | On the Desk, read the feasibility chip for each day. It is green, gold or red. Open a red day: one stop is outside its hours or the travel-plus-dwell sum exceeds 12 hours                                             |
| **R6**  | Change the trip dates. The calendar regenerates with different day tints. Navigate to the tally: every place still has its vote percentage. Change the destination: a new plan is created                              |
| **R7**  | Search the UI for the word AI. It appears nowhere. On any day card, the rationale sentence (if present) says "Because..." not "AI recommends..."                                                                       |
| **R8**  | Load the prototype. Open the Network tab. Filter to XHR/Fetch. No requests fire after the initial page load. Reel MP4s load from a GCS domain                                                                          |
| **R9**  | Open / in an incognito window. One solid button is on the screen, it leads to /sign-in, and nothing else on the page is solid                                                                                          |
| **R10** | Scroll the landing page. No carousel, no testimonial quote, no screenshot of the calendar, the deck or the book appears                                                                                                |
| **R11** | Navigate to /sign-in. The email and password fields do not accept input, the screen says so, and Sign In As Guest leads to /trips                                                                                      |
| **R12** | Open the invite link in an incognito window. The Deck renders with no sign-in prompt at any point                                                                                                                      |
| **R13** | After signing in, open /trips. Every trip listed shows name, dates, destination city and a visible invite code. A trip with zero invites still shows the code                                                          |
| **R14** | On a group trip card, a row of avatars or initials shows who voted (highlighted) and who has not (dimmed). The count excludes the owner if the owner has also not voted                                                |
| **R15** | Navigate to /new. One scrollable page holds a drawn month grid, a text field over activity chips, and a text field over destination chips. No native date, select or checkbox control exists in the DOM                |
| **R16** | On /new, the text field renders above the activity chips and above the destination chips. Tap Kyoto: nothing selects, and the helper text says only Tokyo has reels                                                    |
| **R17** | Fill the onboarding form and submit. The URL changes to /t/:tripId/swipe. The trip name appears in the heading                                                                                                         |
| **R18** | Open /t/:tripId/swipe. Each card is 9:16 ratio, shows a muted autoplay loop reel, has the place name and specimen line bottom-left, creator handle and platform bottom-right                                           |
| **R19** | Swipe a card right, then tap Pass on the next. Open the tally: the first place counts a yes from you and the second a no. No sound plays                                                                               |
| **R20** | Scroll the deck so the third card is visible. The third card shows a static poster; only the top two cards play video. Scroll a card to the top; its video mounts and plays                                            |
| **R21** | Copy the invite code from /trips, paste it into a new incognito window at /t/:tripId/swipe. The deck loads directly with no onboarding form shown                                                                      |
| **R22** | Swipe through all cards. The last swipe triggers a transition to /t/:tripId/votes. Navigate back to the deck: the deck shows a "You've swiped all cards" state, not the cards again                                    |
| **R23** | Open the tally. Every place shows a percentage. A place at 100 percent carries the gold chip. A place at 0 percent is greyed, carries Eliminated, and never appears in the Desk sidebar                                |
| **R24** | Find a place only Aisyah swiped yes on and one only Farah swiped yes on. The first reads 27 percent and the second 18 percent, which is 1.5 and 1 over a total weight of 5.5                                           |
| **R25** | As the owner, finish swiping. Open The Desk appears and leads to /desk. Open the tally from the invite link instead: waiting text appears and no button                                                                |
| **R26** | Open /desk. Four day columns are visible, each with three labelled slots. A sidebar lists voted-in cards. Drag a card from the sidebar into a slot; it snaps into place                                                |
| **R27** | Each day header shows a feasibility chip. A green day's total time is under 12 hours and every stop is within its open hours. A gold day's schedule is more than 25 percent longer than the scheduler's computed order |
| **R28** | The sidebar lists every voted-in card not yet on the calendar. Each card shows a place name, a kind label (temple, market, museum) and a visible drag handle icon                                                      |
| **R29** | Tap Apply. Cards glide into their assigned slots with a staggered animation (approximately 40ms between each). The order within each day has been optimised by the scheduler                                           |
| **R30** | Pin a card to Day 2 Afternoon. Apply the scheduler. The pinned card remains in Day 2 Afternoon; no other card occupies that slot                                                                                       |
| **R31** | Delete a card from a slot. A drawer slides up showing the next-ranked voted-in card for that slot. Tap the offered card: it replaces the deleted one immediately, no confirmation dialog                               |
| **R32** | Open /desk/before-we-go. Six checklist items are listed: passport validity, Suica or Welcome Suica, teamLab ticket booked, yen cash, travel insurance, JR Pass not needed for Tokyo-only                               |
| **R33** | The Print The Book button is disabled. The button label shows "3 of 6 remaining". Tick three items: the label updates to "0 of 6 remaining" and the button is enabled                                                  |
| **R34** | Tick all six checklist items. The Print The Book button becomes active. Tap it: the URL navigates to /t/:tripId and the page renders in the Book register                                                              |
| **R35** | Open /t/:tripId. Every day is a plate: #F2EDE0 background, zero border radius, Newsreader typeface. There is no button, no drag handle, no delete icon, no edit control on the page                                    |
| **R36** | Each day plate contains a link labelled Transit Route. Tapping it opens Google Maps transit directions with the day's stops as origin, waypoints and destination                                                       |
| **R37** | Copy the Book URL, paste it into a new incognito phone-width window. The Book renders fully. There is no sign-in prompt, no account gate, no chrome other than the browser's own back and forward buttons              |

---

## The Demo Path

**One unbroken sequence, and it is the spine of the 3-5 minute video.** Persona: Aisyah, 24, KL, plans the trip for her
three university friends Farah, Hana and Iman. Trip: Tokyo, four days, three nights, one day of annual leave tagged onto
a weekend.

**The video opens on `/`, the landing page, and so does everything else.**

| **Step** | **The Click**                                                      | **What It Proves**                                                                                               |
| -------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **1**    | Open `/` in a private window, tap the one button, Sign In As Guest | No account exists and the screen says so. The Dashboard shows the Tokyo trip and its invite code (R9, R11, R13)  |
| **2**    | Tap New Plan                                                       | Onboarding: a drawn date picker, free text first, chips as shortcuts, Tokyo the only live destination (R15, R16) |
| **3**    | Tap Start Swiping                                                  | Navigating to /t/:tripId/swipe. The reel deck loads (R17, R18)                                                   |
| **4**    | Swipe through 24 Tokyo place cards                                 | Reels play muted autoplay; right = YES, left = NO. Only top two cards mount video (R19, R20)                     |
| **5**    | Finish swiping, view The Tally                                     | Percentage bars per place, unanimous in gold, zero greyed and eliminated (R23)                                   |
| **6**    | Proceed to /desk                                                   | Calendar grid: 4 days x 3 slots. Voted-in cards in sidebar. Drag cards into slots (R26, R28)                     |
| **7**    | Arrange cards on the calendar, tap Apply                           | Cards fly into slots with staggered animation. Each day gets a feasibility colour (R27, R29)                     |
| **8**    | Delete a card from a slot                                          | Perch drawer opens with the next-ranked card. Tap to replace (R4, R31)                                           |
| **9**    | Navigate to /desk/before-we-go, tick all items                     | Checklist derived from trip: passport, Suica, teamLab ticket, yen, travel insurance (R32, R33)                   |
| **10**   | Tap Print The Book                                                 | Each day renders as a Book plate: zero radius, Newsreader, no controls. Maps deep link per day (R35, R36)        |

**Why the demo walks one path and not multiple branches.** The target persona is narrow — Aisyah organising a Tokyo trip
with three friends — and Target Group Alignment rewards narrow. Every alternative path (solo mode, join-with-code, no
group votes) is supported and answerable if a judge asks, but none is in the video.

---

## Out Of Scope

**The Won't tier, with the one-line reason `PRODUCT.md` already gives.**

| **Not Building**                         | **Why Not**                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Cautions And A Destination News Feed** | A mature category with human analysts behind it, and Japan's government ships the same thing free in fourteen languages |
| **Photo Spots As A Page**                | A product category we would lose on its own terms, with no data of our own                                              |
| **Bill Splitting**                       | It solves the half that already works; every panel answer said the arithmetic is fine and collection is the problem     |
| **A Chat Panel**                         | It invites "why not just use ChatGPT", which is a comparison we lose                                                    |
| **A Mascot**                             | It makes the plan feel authored, when its whole value is that it is derived                                             |

**Out of scope for the prototype specifically**, each because it cannot be shown or cannot be built by 13 September.

| **Not In The Prototype**               | **Why Not**                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Authentication Behind Sign In**      | The screen exists because a judge opens a URL; the mechanism does not, because the group installs and signs into nothing |
| **A Backend, A Database, Persistence** | Simulated logic is what the phase is judged on; [`TRD.md`](TRD.md) owns the real thing                                   |
| **Live Place, Weather Or Hours Data**  | Real place data is `PRODUCT.md`'s named unsolved risk. The prototype makes no external call at all                       |
| **Booking, Payment, Ticketing**        | Traveloka owns the rails on a Malaysian phone, and the answer to "why not Traveloka" must not be about booking           |
| **Dark Mode**                          | Out of scope in [`DESIGN.md`](DESIGN.md): a field guide is printed on paper                                              |
| **A 3D Page Turn**                     | It fights the in-app browser, costs days, and breaks first at demo scale                                                 |
| **Native Apps And Offline Storage**    | The Book is a link that opens inside WhatsApp; anything installable defeats it                                           |

---

## Deferred, With A Trigger

**Nothing here is rejected.** Each names what would have to be true for it to come back. The build phase (21 September
to 11 October) adds these; none is in the 13 September prototype.

### Auth, Backend And Persistence

| **Deferred**                                   | **What Brings It Back**                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase-backed sign-in and accounts**       | The prototype's guest-only sign-in is replaced with real auth. The sign-in surface becomes a gate only for trip ownership          |
| **Persisted votes and realtime vote updates**  | Votes are stored and broadcast so the tally updates live as each group member swipes. Joiners arrive mid-session and see live data |
| **Places seeded from OpenStreetMap, Wikidata** | The committed fixture is replaced by a data pipeline that imports place data, opening hours and descriptions from these sources    |
| **Licensed footage on the reel cards**         | The hand-collected clips are replaced by creator-uploaded or licensed footage; plate imagery comes from Wikimedia Commons          |

### Live Data And AI

| **Deferred**                            | **What Brings It Back**                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **An LLM for free-text intent parsing** | The onboarding free-text fields are parsed into structured preferences rather than stored as-is                             |
| **An LLM for rationale sentences**      | The scheduler's per-day rationale is written by an LLM rather than drawn from a fixture, giving unique text per arrangement |
| **Google Routes API for transit times** | The hand-authored travel matrix is replaced with live Google Routes data, computed when the calendar is assembled           |

### Calendar And Checklist

| **Deferred**                         | **What Brings It Back**                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Strength of swipe**                | A zero to one hundred value per swipe replaces the binary answer, the spectrum the mentor raised on 7 September                      |
| **Checklist derived from live trip** | Checklist items are computed from the destination's real requirements (visa, vaccination, peak season) rather than the Tokyo fixture |
| **Print-quality PDF export**         | The Book is rendered as a PDF for actual printing rather than a screen-only HTML page                                                |

---

## Open Questions

**Genuinely unresolved from the sources, and each one changes something.**

| **#** | **The Question**                                                                                                                                                                                       | **Where It Bites**                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **1** | **Binary swipe or a spectrum?** The mentor's "maybe 65 percent" is in the transcript; the prototype ships binary. Nobody has tested whether a strength control slows the swipe                         | R19, R24, and the tally arithmetic           |
| **2** | **What closes the vote?** A deadline set by the owner, or the owner simply opening The Desk. The prototype has no closing moment, so a late joiner's swipe lands after the calendar exists             | R25, R31, and what a joiner sees after Apply |
| **3** | **Can a joiner see The Desk read-only?** Today only the owner reaches it and the joiner waits. Three of four panel voices described wanting to watch the plan form                                     | R25, and the Should tier                     |
| **4** | **Unknown opening hours.** `opens` and `closes` are required strings; a real place with no published hours cannot be expressed, and the feasibility rule must decide whether unknown counts as fitting | R5, R27, and the build-phase seeding         |
| **5** | **Reel licensing before the build phase.** The clips are other people's videos, credited and never committed. That is accepted for a prototype and is not a product answer                             | R18, and the Deferred table above            |
