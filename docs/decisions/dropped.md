# Dropped

**Nothing is deleted. It comes here.** The rubric awards marks for the directions we abandoned, and it cannot award
them for directions it cannot see.

Copy the idea's content in whole, then add why it died. Keep the original date.

---

## Split planning - members claim days of the itinerary to fill

**Explored:** 2026-09-01 to 2026-09-02 · **Came from:** `ideas/001-travel-planner.md` · **Fuller working note:**
[`group-preferences.md`](group-preferences.md)

**What it was.** A group would divide the itinerary by days rather than co-edit it. Start and end airports fixed; member
one takes days 1-3, member two takes days 3-6, and so on. Each person nominates places to fill their own stretch, and
the optimiser then merges every nomination and re-routes the whole trip.

It was built and working. Each member had a number field to claim as many days as they wanted rather than an equal
share, the planner filled whatever nobody claimed, and every stop on the map was colour-coded by whoever chose it.

Refined once before it died: because the optimiser re-sequences everything afterwards, the day split was never really a
schedule - member one's pick could land on day five. It was a **fair-share quota for nominating places**, with days as
the unit of fairness. That was a better description and a stronger idea than the one we started with.

**Why we dropped it.** Jin Siang asked the question that killed it:

> "do you think this feature is needed since we are a trip planner we should have done everything"

The brief's own test is that the app should **"make planning faster and less stressful"**. Splitting the work between
four people does not remove the work, it distributes it - and the thing we are really competing with is a WhatsApp
group, which asks nothing of anyone. A planner that hands four people homework is more work than the tool it replaces,
however novel the mechanism.

The mechanism was never the problem. The premise was: that the planning had to be done by humans at all.

**What that cost us.** The competitor scan found nothing that divides authorship of an itinerary and reconciles it
automatically, so this was one of only two genuinely novel things in the idea. Dropping it leaves **Originality (7%)
resting entirely on the round-trip strategy choice**. That is a real cost and it was taken deliberately, not stumbled
into.

**What we kept from it.** Two things.

1. **Must-go places.** People still need to say _"I don't care about the rest, but we are going to Penang."_ That became
   a non-negotiable stop: seated before anything else, never dropped for budget or time, and it overrides the trip-type
   filter, the transport filter and the group vote. It is the day-claiming idea reduced to the part that earned its
   place.
2. **The principle.** The planner proposes a complete trip first; the group only ever reacts. That now shapes the whole
   group flow - shortlist, vote, bench - and it is why the pitch line changed from _"we divide the planning"_ to
   **"we plan it, you veto it."**

---

## One book in two states - the storybook as its own working surface

**Explored:** 2026-09-06 · **Built:** [`../prototype/storybook-a-one-book.html`](../prototype/storybook-a-one-book.html)
· **Fuller working note:** [`storybook-shape.md`](storybook-shape.md)

**What it was.** One object, two presentations. The storybook existed from the moment the trip was generated, in a
drafting state: a plain scrolling surface where each day was three slots, the group voted on the book's own pages, and
the losing options sat underneath as the bench. Finalising did not produce a new artifact - it re-presented the same
object as a flipbook. The bench stayed live underneath, so tapping any stop on a finished page slid its bench up and
swapped it in one tap, with no edit mode and no new vote.

It was built and working, including the part that mattered most: pressing **Simulate: Merapi Closes** rewrote the page
being read and the agent explained itself in a sentence - _"Swapped the Merapi jeep tour for the Merapi museum - jeep
operators are suspended for haze until Sunday, the museum was your number two for that slot, and Day 3 stays at RM 40 a
head."_

**Why we dropped it.** Not because it was worse at the demo - it was better at the demo. Two things beat it. A flipbook
is built for reading, and hosting vote widgets and swap menus inside one fights the format; A only avoided that by
making its drafting state not a flipbook, which quietly reintroduced the two surfaces it claimed to collapse. And the
book being editable forever means it is never a finished thing, which is exactly what a keepsake has to be.

**What that cost us, and it is not small.** A put the repair where the user already was. B has to narrate _"the
itinerary repairs itself"_ across four steps and a screen change, and that is the headline claim from
[`build-verdict.md`](build-verdict.md). **The video now has to carry what the interaction used to show.** Taken
knowingly.

**What we kept from it.** The bench-slides-up interaction. It moved from the book to the planner rather than dying, so
"a stop closed" and "I changed my mind" are still one interaction - just one that happens on the planner instead of
under the reader's thumb.

