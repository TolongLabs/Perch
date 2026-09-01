# Prototype

A clickable mockup for the **Travel Planner** problem statement. One self-contained HTML file - open it in a browser,
no install, no keys, no network.

> **This is a mockup, not the app.** The problem statement is not chosen and `PRODUCT.md`, `PRD.md` and `TRD.md` do not
> exist yet, so implementation is still gated. This branch is not merged into `main`; it is here to be looked at and
> argued with.

| | |
| --- | --- |
| **File** | [`travel-planner.html`](travel-planner.html) |
| **Idea log** | `research:docs/ideas/001-travel-planner.md` |
| **Competitor scan** | `research:docs/market/competitors.md` |
| **Why it scores** | Design is 10%, and *Mockup Completeness* asks for "the core flow end-to-end" |

## What It Does

**Trip.** Real coastlines (Natural Earth, simplified) for Malaysia and its neighbours, with pan, zoom and hover. 26
sample places across the peninsula and Borneo, tagged cultural or natural. Airports on both landmasses, with a warning
when the crossing is a flight rather than a drive. Budget with beds reserved before stops, and hostel-to-five-star
lodging priced per night with per-place availability. Must-go places. And the round-trip strategy choice when you land
and leave from the same airport - 90/10 retrace, or 50/50 out-and-back.

**Group.** A 21-day availability poll on real dates: drag to paint, shift-click for a range, click a date for everyone,
or bulk-fill weekends. The overlap sets both the trip length and its start date. The planner then shortlists roughly
twice the trip's worth of places and the group votes. Votes stay a draft until applied, and applying reports what
changed. Losing options become a ranked bench.

**Drive.** Every departure hour from 05:00 to 21:00 is scanned per leg against a stated congestion model - weekday
peaks, the Friday exodus out of KL, Sunday returns, Saturday runs to the hills - and it says when to leave and what the
timing saves.

**Disruption.** Monsoon, flood and boat-suspension events block places; the bench fills the gap with no new vote,
because the group already ranked everything on it.

Group is the default. The Group tab hides when solo, Drive hides on public transport, Discretion shows only for solo.

## What Is Not Real

- **Sample data is invented** - costs, appeal scores, nightly rates, and the cultural/natural tagging
- **Weather and flood events are simulated.** No API is connected. The Disruption tab names the real sources a build
  would use: MET Malaysia's API, Open-Meteo's free tier, and why `publicinfobanjir` cannot be scraped
- **Traffic is a stated model, not a feed.** The constants are printed in the Drive tab so they can be argued with.
  Swapping in a real feed replaces the factor table and nothing else
- The routing is a greedy corridor heuristic, not an optimiser. The problem it approximates is the Tourist Trip Design
  Problem

## Known Limitation For Demos

The shortlist targets twice the trip length, and the peninsular sample holds about 22 days of places. On a 12-day trip
everything gets shortlisted, so the vote has nothing to reject and the bench looks thin. **Demo the group flow on a
short trip** - five days shortlists 6 of 17 - or add more sample places.

## Verification

The planning logic runs headless. Checks cover routing invariants, cursor-anchored zoom, lodging tiers and forced
upgrades, availability windows, date arithmetic including a year rollover, the draft/applied vote split, must-go
precedence over every filter and the vote, and disruption substitution drawing only from the shortlist.
