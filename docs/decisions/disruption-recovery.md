> **Moved from the `playground` repo, 2026-09-04.** Written 1 September 2026 as idea 7's working note and left behind
> when the travel planner moved here. Prose is unchanged; only the headings and the cross-links were adjusted to match
> this branch. The original is recoverable from `playground` at commit `9caa867`.

# Adjusting Plans When Things Do Not Go As Expected

Answering the fourth capability the CodeNection brief names. Dumped 1 September 2026.

---

## The Dump, As Said

> for the "what if plan doesnt work as expected" for the voting system its much easier we just pull
> out the lower voted places to fit in and replace, how do we determine "plan doesnt vote as
> expected" can be achieved by scalping floods, natural disasters or even weather when the travel
> date is around the corner

---

## The Good Idea Inside This

**Voting doesn't just pick the plan — it builds the bench.**

Every place that lost a vote is still a place the group considered and ranked. That ranked reserve
list is a **pre-approved substitution pool**. When something breaks, the app does not have to
re-convene four people and run a new vote; it swaps in the next acceptable option and tells them.

This is the thing to say out loud in the pitch, because it makes the whole system cohere:

| Stage | What voting produces |
| --- | --- |
| Planning | The itinerary |
| Over budget / over days | The cut list (see [group-preferences.md](group-preferences.md)) |
| **Something breaks** | **The replacement, already group-approved** |

One mechanism, three jobs. That is a much stronger claim than "we have voting".

---

## The Refinement It Needs

**Next-highest-voted is not enough.** A substitute also has to *fit*:

- **Geographically** — swapping a northern stop for a popular southern one wrecks the route and
  blows the day budget. The reserve list must be re-ranked by detour cost at the moment of
  substitution, not just by vote count.
- **By budget and days** — the replacement has to fit what the cancelled stop freed up.
- **By type** — losing the one natural stop on a nature trip and replacing it with a museum is not
  a fix, even if the museum polled well.

So the rule is: **score = vote rank, filtered by fit.** The optimiser already computes detour cost
in the prototype; this reuses it.

---

## Detecting The Disruption - Sources, Verified Today

**Do not scrape.** Scraping government sites is fragile, breaks silently, and is a question you do
not want from judges at Binance, Intel and Grab. There are real APIs.

| Source | Status | What it gives |
| --- | --- | --- |
| **MET Malaysia** — `api.met.gov.my` | **Official API confirmed.** met.gov.my advertises "MET API Web Services" plus an open-data portal | National/state/district forecasts, continuous-rain, strong-wind and thunderstorm warnings, **monsoon and seasonal outlooks**, earthquake and tsunami info |
| **Open-Meteo** — open-meteo.com | **Verified free.** No API key, no sign-up, **10,000 calls/day** non-commercial. CC BY 4.0, attribution required | 30+ models, forecasts, marine weather, and a **flood API**. Global coverage |
| **publicinfobanjir.water.gov.my** | Exists, but **returned 403 to automated access** | River levels and flood info. Treat as a human reference, not a data feed — which is precisely why scraping is the wrong plan |

Open-Meteo is the right choice for a hackathon: no key, no billing, no signup friction, and it has
a flood endpoint. MET Malaysia is the right choice for *authority* — an official national warning
carries weight a generic forecast does not. Use MET for warnings, Open-Meteo for numbers.

---

## The Malaysian Case That Makes This Pitch Land

**The northeast monsoon.** Roughly November to February, the east coast — Perhentian, Redang,
Tioman, Cherating — is battered, and island operators simply close. This is already noted in the
prototype's sample data for the Perhentians.

Why it is the perfect example:

- It is **predictable**, so the app can warn at planning time, not just react.
- It is **local**, which no international competitor models properly.
- It is **severe** — not "might rain", but "the boat does not run".
- And the **Grand Final is 15 November**, inside monsoon season. Demoing a monsoon-driven
  re-plan to a Malaysian judging panel in mid-November is a pitch that writes itself.

---

## Two Things This Still Needs Decided

**1. A severity threshold, or the app cries wolf.** Weather is probabilistic. A 40% chance of
afternoon rain is not a reason to rewrite an itinerary; an official flood warning is. Without a
stated rule — act on official warnings and hard closures, advise on forecasts, ignore noise — the
feature becomes an annoyance. This is a product decision, not a technical one.

**2. Before the trip, or during it?** The dump says "when the travel date is around the corner",
which is pre-trip. But things also break *mid-trip*, and that is the harder, more valuable case.

Recommendation: **scope the prototype to pre-trip only** and say so explicitly. Naming a boundary
and defending it scores under Feasibility's *Planning and Scope Realism* (5%) and *Resource and
Time Awareness* (4%). Mid-trip re-planning is the obvious "future work" slide.

---

## Scope Reminder

None of this has to be built by 13 September. The prototype rubric scores no code. What is needed
is the flow, a mockup of the "your trip changed" moment, and the argument above. **Building comes
in the Building Phase, 21 September – 11 October, and only if you reach finals.**

---

## Still Open

- What the user sees when a swap happens — automatic with a notification, or a suggestion needing
  one tap to accept? Automatic is bolder; suggestion is safer and more honest about uncertainty.
- Does a substitution need re-voting if the group disagrees, or does the pre-approval hold?
- What happens when the reserve list runs out — shorten the trip, extend a nearby stay, or ask?
