# Prototype

**Mockups, not the app.** Two self-contained HTML files. Open either in any browser - no install, no network, nothing
to run.

| File                                                        | Made       | Shape                                                                   |
| ----------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| [`travel-planner.html`](travel-planner.html)                | 1-2 Sept   | Map on the right, controls on the left. Holds the round-trip choice, the vote, the bench and the simulated disruption |
| [`travel-planner-slides.html`](travel-planner-slides.html)  | 6 Sept     | A slide deck, six sections: the trip, plan-it-together with dates, slot voting and hotels, cautions and news, photo spots, a Google Maps route button, what is worth buying, and a read-only final plan |

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

Six sections. Every place, price, caution and news item in it is a sample.

| Section                 | What It Shows                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| **The trip**            | A poster and the day-by-day itinerary                                                   |
| **Plan it together**    | **The important one.** Availability dates set the trip length; then each day is morning, afternoon and night with every option voted on, losers kept as a ranked bench, a long morning that closes the afternoon, and three hotels to vote between |
| **Take care**           | Local cautions and a dated news feed the group adds to                                  |
| **Photo spots**         | Per stop: where to stand and the time of day                                            |
| **The route**           | One button opening every stop as waypoints in Google Maps. **This link is real**        |
| **Worth buying**        | What to carry home, local price against strip price, and which markets price for locals |
| **The final plan**      | Read-only. The schedule the votes produced, hour by hour, meals in the gaps. Hover a place for a picture, click for Google Maps. **Derived from the votes**, so changing one changes this |

**Deployed** at **https://codenection-travel-planner.vercel.app** - public, verified anonymously. Other Vercel URLs
for it sit behind SSO and are unusable; **only that address works for a judge**, and a restricted link scores zero. It
deploys from a copy, so **editing the file here does not update the site**.

## Where Else The Map-First File Lives

The identical file is on the `feat/travel-planner-prototype` branch of the product repo, at
`docs/prototype/travel-planner.html`, deliberately unmerged - `main` gates implementation on `PRODUCT.md`, `PRD.md` and
`TRD.md`, and none of them exist yet.

**Two copies means two copies can drift.** If the mockup changes, change it there and copy it here, or the notebook
starts citing a screen that no longer exists.
