# Prototype

**A mockup, not the app.** One self-contained HTML file. Open
[`travel-planner.html`](travel-planner.html) in any browser - no install, no network, nothing to run.

It is here because the prototype phase is judged on **Design, 10%**, whose Mockup Completeness band asks for the core
flow end to end, and because the ideation trail on this branch should be able to point at the thing it produced. This
branch still holds no application code; a clickable mockup with invented data is evidence, not implementation.

## What It Covers

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

## Where Else This File Lives

The identical file is on the `feat/travel-planner-prototype` branch of the product repo, at
`docs/prototype/travel-planner.html`, deliberately unmerged - `main` gates implementation on `PRODUCT.md`, `PRD.md` and
`TRD.md`, and none of them exist yet.

**Two copies means two copies can drift.** If the mockup changes, change it there and copy it here, or the notebook
starts citing a screen that no longer exists.
