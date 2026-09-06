# Prototype

**Mockups, not the app.** Two self-contained HTML files. Open either in any browser - no install, no network, nothing
to run.

| File                                                        | Made       | Shape                                                                   |
| ----------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| [`travel-planner.html`](travel-planner.html)                | 1-2 Sept   | Map on the right, controls on the left. Holds the round-trip choice, the vote, the bench and the simulated disruption |
| [`travel-planner-slides.html`](travel-planner-slides.html)  | 6 Sept     | A slide deck, six sections: the trip, plan-it-together with dates, slot voting, hotels, a day map and a photo matcher, photo spots, eat-shop-do, cautions and news, and a read-only final plan carrying the Google Maps handoff |
| [`storybook-a-one-book.html`](storybook-a-one-book.html) | 6 Sept | **Fork draft A.** One book in two states. Voting happens on the book's own pages; finalising re-presents the same object as a flipbook; a closure repairs the page you are reading |
| [`storybook-b-planner-then-book.html`](storybook-b-planner-then-book.html) | 6 Sept | **Fork draft B.** A planner page the group votes on, then a read-only flipbook generated on finalise. Editing means going back; a closure blocks the reprint until Day 3 is re-settled |

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
| **Plan it together**    | **The important one.** Availability dates set the trip length; then each day is morning, afternoon and night with every option voted on, losers kept as a ranked bench, a long morning that closes the afternoon, and three hotels to vote between. Every option carries a RedNote chip and a Map chip, a schematic day map shows how far the day spreads, a "what to expect" strip shows the view and the light window per stop, a photo matcher that **actually reads EXIF in the browser** to name the stop, the compass bearing and the shot advice, and a **suggest form** - kind, name, when, day, remarks - that puts an idea up as one more option to vote on. Leave the name empty and it proposes the best-rated thing of that kind not already on the day - including beds, where it also tells you what the swap does to the nightly price. Gold edge for your own picks, chrome edge for top-rated ones |
| **Take care**           | Local cautions and a dated news feed the group adds to                                  |
| **Photo spots**         | Per stop: where to stand and the time of day                                            |
| **Eat, shop, do**       | Three tabs, one accordion. A drawer per place with a weighted score from three review sources, plus a **RedNote post count kept outside the score** - when attention is high and the rating is not, it says so. Gift list is the last drawer under Shop |
| **The final plan**      | Read-only. The schedule the votes produced, hour by hour, meals in the gaps, with a day map. Two **real** Google Maps links, one for the day and one for the trip, both built from the winning votes. Hover a place for a picture. **Derived from the votes**, so changing one changes this. Ends with a **before-we-go checklist** - documents, flights, beds, money, plus timed tickets generated from what was voted in - with a progress bar and critical items called out separately |

**Deployed** at **https://codenection-travel-planner.vercel.app** - public, verified anonymously. Other Vercel URLs
for it sit behind SSO and are unusable; **only that address works for a judge**, and a restricted link scores zero. It
deploys from a copy, so **editing the file here does not update the site**.

## Where Else The Map-First File Lives

The identical file is on the `feat/travel-planner-prototype` branch of the product repo, at
`docs/prototype/travel-planner.html`, deliberately unmerged - `main` gates implementation on `PRODUCT.md`, `PRD.md` and
`TRD.md`, and none of them exist yet.

**Two copies means two copies can drift.** If the mockup changes, change it there and copy it here, or the notebook
starts citing a screen that no longer exists.

## The Two Fork Drafts

`storybook-a-*` and `storybook-b-*` exist to settle one question by eye rather than by argument: **is the storybook one
surface in two states, or a planner that outputs a read-only book?** The reasoning, the five items it depends on and the
comparison table are in [`../decisions/storybook-shape.md`](../decisions/storybook-shape.md).

They are deliberately identical apart from that fork. Same Yogyakarta sample data, same vote counts, same bench, same
visual tokens as the slide-deck mockup, and the same two buttons - finalise, and simulate a closure - so the only thing
that differs when you flip between them is the shape.

**Both are throwaway.** One gets promoted and the other stays here as a dropped direction, which is worth marks under
Iteration And Idea Evolution. Neither is the design.

**What to look at when comparing them:**

| Look At | In A | In B |
| ------- | ---- | ---- |
| Press **Simulate: Merapi Closes** | The page you are reading rewrites itself, and the agent explains why in one sentence | A red alert says the book cannot reprint, and hands you a four-step path back through the planner |
| Tap a stop on a finished page | The bench slides up; swapping needs no new vote | Nothing happens. The book is output |
| A solo traveller | Sees the book, minus vote counts | Still passes through a voting page built for groups |

**Note, 6 Sept:** the deployed slide deck has meanwhile grown a read-only final-plan section of its own, which is a
partial move toward B. Worth weighing when the fork is decided.

