# Prototype

**Mockups, not the app.** Two self-contained HTML files. Open either in any browser - no install, no network, nothing
to run.

| File                                                        | Made       | Shape                                                                   |
| ----------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| [`travel-planner.html`](travel-planner.html)                | 1-2 Sept   | Map on the right, controls on the left. Holds the round-trip choice, the vote, the bench and the simulated disruption |
| [`travel-planner-slides.html`](travel-planner-slides.html)  | 6 Sept     | A slide deck, seven sections: trip poster and itinerary, what to do today with slot voting, dates then places, "take care" cautions and news, photo spots, a Google Maps route button, and what is worth buying and where |

The second one drops what the first one argued for; that is deliberate and unresolved, and the reasoning is in
[`../decisions/iteration-log.md`](../decisions/iteration-log.md) under 6 September. Neither is the design - screens
are chosen on `main`.

It is here because the prototype phase is judged on **Design, 10%**, whose Mockup Completeness band asks for the core
flow end to end, and because the ideation trail on this branch should be able to point at the thing it produced. This
branch still holds no application code; a clickable mockup with invented data is evidence, not implementation.

## What The Map-First One Covers

The four capabilities the brief names, plus the one thing the competitor scan could not find anywhere else.

| Part                       | What It Shows                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------- |
| **Round-trip strategy**    | Retrace the last leg, or reach the furthest point at the halfway mark and return another way. The differentiator, per [`../market/landscape.md`](../market/landscape.md) |
| **Availability poll**      | 21 days of real dates; the overlap sets the trip length rather than a slider         |
| **Shortlist and vote**     | The planner proposes, the group votes, an explicit Apply step commits it             |
| **Ranked bench**           | Losing options stay ranked, and become both the cut list and the replacement pool    |
| **Simulated disruption**   | A closed stop is substituted from the bench without a new vote                       |
| **Must-go places**         | Seated first, never dropped, and they outrank every filter and the vote              |
| **Departure timing**       | A printed model of Malaysian traffic                                                 |

## What Is Not Real

Stated here, in the mockup itself, and worth repeating in the video rather than letting a judge find it:

- **Sample costs, appeal scores and nightly rates are invented.** They are plausible, not sourced
- **Weather events are simulated.** The Disruption tab names the APIs a real build would use - see
  [`../decisions/disruption-recovery.md`](../decisions/disruption-recovery.md), which verified them
- **Traffic is a printed model**, not a feed
- The 26 sample places are a fixed dataset, not a live place API

## What The Slide-Deck One Covers

Five sections, in the order a judge would flip through them. Every place, price, caution and news item in it is a
sample; the places on the "where should we go" page are literally "Option 1" to "Option 8" until real data comes.

| Section                | What It Shows                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **The trip**           | A poster and the day-by-day itinerary                                                  |
| **Where should we go** | A two-week date strip on top; the overlap sets the trip length. Place options below     |
| **Take care**          | Local cautions (language, water, dress, cash) and a dated news feed the group adds to   |
| **Photo spots**        | Per stop: where to stand, the time of day, and the number of the option it belongs to   |
| **What to do today**   | **The important one.** Three slots a day, group voting, the losing options kept as a ranked bench, a long morning that closes the afternoon, and the night's hotel |
| **The route**          | One button opening every stop as waypoints in Google Maps. **This link is real** and needs no key |
| **Worth buying**       | What to carry home, what a local pays versus the strip price, and which markets price for locals |

**The slide-deck one is deployed** at **https://codenection-travel-planner.vercel.app** - public, verified anonymously.
Two other Vercel URLs exist for it and both sit behind SSO; **only the address above is viewable**, and a restricted
link scores zero. It is deployed from a copy of the file, so **editing the file here does not update the site** - it
has to be redeployed.

## Where Else The Map-First File Lives

The identical file is on the `feat/travel-planner-prototype` branch of the product repo, at
`docs/prototype/travel-planner.html`, deliberately unmerged - `main` gates implementation on `PRODUCT.md`, `PRD.md` and
`TRD.md`, and none of them exist yet.

**Two copies means two copies can drift.** If the mockup changes, change it there and copy it here, or the notebook
starts citing a screen that no longer exists.
