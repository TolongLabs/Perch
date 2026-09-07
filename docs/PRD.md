# PRD — Perch

**What.** Requirements, user stories, acceptance criteria, and what is deliberately out of scope.
[`PRODUCT.md`](PRODUCT.md) is the spine; this file turns its Must tier into things a judge can check. It is what
`hackathon-scope-cutter` cuts against.

**What it does not own.** Architecture, data models and API contracts belong to [`TRD.md`](TRD.md). Palette, type,
radius, spacing and motion belong to [`DESIGN.md`](DESIGN.md). Where a requirement needs a visual rule it cites that
file instead of restating it.

**Every requirement traces to `PRODUCT.md` or to the `research` branch**, and cites the source wherever the trace is not
obvious. Read `research` with `git show research:<path>`. A requirement with no source behind it is one somebody
invented.

---

## What This Prototype Is

**A UI prototype with simulated logic, not an application.** Every acceptance criterion in this file is written against
observable UI behaviour, and none against server behaviour, because there is no server.

| **Concern**     | **In The 13 September Prototype**                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **Accounts**    | None. There is no sign-in to skip, because the group must be able to open the Book without one                  |
| **Data**        | One committed fixture. Nothing is written that outlives the tab                                                 |
| **Network**     | Static assets only. No place lookup, no opening-hours call, no weather feed, no booking API                     |
| **The Closure** | Scripted into the fixture and fired at a known step, because a fixture has nothing to observe                   |
| **The Ranking** | **Real.** It is computed from the viewer's own three taps. This is the one piece of logic that may not be faked |

**Simulated logic is what the organisers asked for**, not a shortcut we are taking. Their own video outline says it in
as many words: _"Prototype demo does not mean you need working logic, your prototype is your UI design, and the demo is
you walking through the important screens"_ ([`source/submission-template.md`](source/submission-template.md)). Design's
**Mockup Completeness** band scores "covers the core flow end-to-end", not polish per screen
([`source/prototype-judging-rubrics.md`](source/prototype-judging-rubrics.md)).

**The one thing that must not be simulated is the ranking**, because the ranking is the claim. If the seven benched
options are a canned list rather than the seven the viewer did not tap, the bench is a video effect and a judge who
clicks twice will find that out.

**"Done" on 13 September means three things, and nothing else.**

1. The [Demo Path](#the-demo-path) runs end to end in one browser session at 390px with no dead click
2. Every requirement below passes its acceptance check **in the deployed prototype**, not on a branch
3. The repo is public, and the prototype URL, the video and the slides are linked from [`README.md`](README.md)

---

## User Stories

Aisyah is `PRODUCT.md`'s primary user; the full persona, with every claim marked `[assumed]`, is
`research:docs/users/personas.md`. One row per Must-tier capability.

| **Story, In Her Voice**                                                                                  | **The Job It Does**                                                                                         | **Requirements** |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| "I pick the three places I would hate to miss. Nobody asks me what kind of traveller I am."              | Produces the ranking. Three chosen and seven benched is the only thing in the product that can make a bench | R6–R11           |
| "I do not assemble anything. I open it and the trip is already there, with what it costs."               | Vetoing is cheaper than choosing, and the trip has to be valid before anyone else taps                      | R12–R15          |
| "At 11pm on a Tuesday I can see the whole trip on my phone: days, beds, cost, and what is at risk."      | Gives her one private surface to work on, so the group chat is not where assembly happens                   | R16–R22          |
| "I paste one link into the group chat and four people who install nothing can read it and tap."          | Removes the switching cost. The group installs nothing and signs into nothing                               | R23–R28          |
| "When I want something different I tap the stop and take what we already ranked. Nobody is asked twice." | Makes "a stop closed" and "I changed my mind" the same interaction                                          | R29–R34          |
| "When something closes I read one sentence telling me what changed and what it cost."                    | The repair explains itself, so she is not the one who repairs it                                            | R35–R39          |

---

## Requirements

Each is one testable sentence. **Must tier only**; everything below the Must tier is in
[Deferred, With A Trigger](#deferred-with-a-trigger).

### Across The Prototype

| **ID** | **Requirement**                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **R1** | The whole prototype is reachable from one deployed URL that opens in an incognito window with no install and no build step                       |
| **R2** | No sign-in, sign-up, account or profile surface exists anywhere in the prototype                                                                 |
| **R3** | Every figure on screen resolves to the committed fixture, and the page issues no network request after load other than for its own static assets |
| **R4** | The bench is computed from the viewer's own three taps in question 3, never replayed from a stored answer                                        |
| **R5** | The fixture carries a closure and a stated cause for each of the ten place cards, so the repair fires whichever three the viewer picked          |

**R5 exists because R4 does.** A real ranking means a judge can pick three cards we did not expect, and a demo that only
repairs one particular stop would break the moment they do.

### The Interview

| **ID**  | **Requirement**                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **R6**  | Trip basics — dates, budget, origin — sit on one deliberately plain screen, pre-filled from the fixture, and produce no ranking signal     |
| **R7**  | The interview is exactly three questions, one per screen, each showing its position in the sequence                                        |
| **R8**  | Question 1 asks who is coming, and its answer is what switches solo mode on: solo skips the group phase and pre-resolves the Book's blanks |
| **R9**  | Question 2 asks what the trip is for, and its answer appears in the Book's own prose rather than being collected and never shown           |
| **R10** | Question 3 presents exactly ten place cards and accepts exactly three; the third tap ends the interview, and there is no Submit button     |
| **R11** | The seven unpicked cards settle onto the perch in rank order on that third tap, and that order is the bench                                |

**Three questions, not five.** `research:docs/decisions/storybook-shape.md` designed five, each producing ranking
signal. Questions 4 and 5 are deferred with a trigger below; questions 1 and 3 are the two `PRODUCT.md` names by number,
and cutting to three keeps the video's opening off the most-seen screen in the category.

### The Proposal

| **ID**  | **Requirement**                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **R12** | A complete trip renders with no further input: every day filled, every night bedded, no empty slot and no placeholder text      |
| **R13** | Each day states two totals, travel time then cost, in that order                                                                |
| **R14** | No confirmation step, review screen or "is this right?" prompt stands between the third tap of question 3 and the rendered trip |
| **R15** | The trip is complete and fully costed before any second person has tapped anything                                              |

**R14 and R15 are `PRODUCT.md`'s two rules stated as checks**: Perch proposes and she vetoes, and the trip is valid with
zero group input.

### The Desk

| **ID**  | **Requirement**                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **R16** | The Desk renders mobile-first at 390px and moves to two columns at 1024px and above                                                |
| **R17** | The Desk shows days, slots, beds and costs in one scrollable assembly, each day carrying its own tint per [`DESIGN.md`](DESIGN.md) |
| **R18** | Every stop carries exactly one state chip, drawn from Open, Decided and At Risk, and no fourth state exists                        |
| **R19** | Every gap between two consecutive stops states a travel time and a transport mode, public or private                               |
| **R20** | The Desk has no global Edit control; every change to a stop is made through the bench drawer                                       |
| **R21** | Tapping any stop on The Desk opens that slot's bench drawer                                                                        |
| **R22** | The Desk exposes exactly one share action, and what it produces is the Book at the same URL the group opens                        |

**R19 closes the gap `PRODUCT.md` names.** Transport appears once in the earlier deck, as a note string. A swap that
silently adds forty minutes breaks the day it was meant to save, so travel time is the mechanism's second unit of cost
rather than a side feature.

### The Book

| **ID**  | **Requirement**                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| **R23** | The Book renders in two states, Setting and Printed, from one object at one URL                                       |
| **R24** | In Setting, every undecided slot renders as a marked blank with its candidates beneath it                             |
| **R25** | In Printed, every slot is resolved and every decision control is absent from the page                                 |
| **R26** | The only write available anywhere on the Book is a tap on a candidate beneath a blank; nothing else on it is editable |
| **R27** | Opening the Book presents no account step, and it is legible at 390px inside an in-app browser's chrome               |
| **R28** | Stop names, day tints and day totals on the Book match The Desk exactly; the two surfaces never disagree              |

**R26 is the rule stated precisely.** The Book is read-only except where it is deliberately unfinished. She edits on The
Desk, and a tap is not an edit.

### The Bench

| **ID**  | **Requirement**                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **R29** | The bench is a drawer over the surface that invoked it, not a screen; dismissing it returns to the same scroll position                          |
| **R30** | Every drawer row carries a rank numeral, the option name, and a cost delta in two units, travel then money, and never one unit without the other |
| **R31** | Rank numerals are per slot: the stop currently in the slot is rank 1 and carries no numeral, so drawer rows run from 2                           |
| **R32** | Drawer rows are filtered by fit — day, budget and trip type — before they are ordered by rank, so a row that does not fit is not offered         |
| **R33** | One tap on a drawer row swaps it into the slot, with no confirmation dialog and no new vote                                                      |
| **R34** | The drawer reached from a closure and the drawer reached by tapping a stop are the same component showing the same rows                          |

**R31 is what makes the demo sentence checkable.** "Prambanan was your number two for that slot" is a claim about the
drawer, and a judge can open the drawer and read the numeral. **R32 is
`research:docs/decisions/disruption-recovery.md`'s correction**: score is vote rank filtered by fit, because swapping a
northern stop for a popular southern one wrecks the route.

### What Changed

| **ID**  | **Requirement**                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **R35** | What Changed is a strip present on both surfaces and is never a screen of its own                                                   |
| **R36** | Each entry is one sentence naming four things: what left, what arrived, the cause, and the day's cost after the swap                |
| **R37** | Each entry names the rank the replacement came from, and that rank is checkable against the slot's drawer                           |
| **R38** | Entries accumulate newest first, and a later swap never removes an earlier entry                                                    |
| **R39** | A swap applies automatically and its entry carries Undo, which restores the previous stop and records the reversal as its own entry |

**R39 closes an open question rather than leaving it open.** `research:docs/decisions/disruption-recovery.md` lists
"automatic with a notification, or a suggestion needing one tap" as undecided. `PRODUCT.md`'s demo sentence is in the
past tense — _"Swapped Merapi for Prambanan"_ — so the prototype auto-applies, and Undo is what keeps that honest. It is
a reversible decision; see [Open Questions](#open-questions).

---

## Acceptance Criteria

**One observable check per requirement, runnable by a judge in the deployed prototype.** No check requires a console, a
network tab or an explanation from us.

| **Req** | **The Check**                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| **R1**  | Paste the URL into a fresh incognito window. The first screen renders with no download, no extension and no setup      |
| **R2**  | Walk the whole prototype. No screen, modal or menu offers sign-in, sign-up, log-out or a profile                       |
| **R3**  | Load the page, then switch the device offline and complete the demo path. Nothing breaks and no figure disappears      |
| **R4**  | Run the interview twice picking different threes. The perch holds the seven you did not pick, both times               |
| **R5**  | Pick any three of the ten. The closure still fires on the demo path and its cause names the stop you actually picked   |
| **R6**  | The basics screen is one screen, its fields are already filled, and nothing on it is a place, a rating or a preference |
| **R7**  | Count the question screens: three. Each shows its position, such as 2 of 3                                             |
| **R8**  | Pick Solo on question 1 and re-run. The group phase is absent and the Book opens with no blanks                        |
| **R9**  | Read the Book's prose. The phrase you chose on question 2 is visible in it                                             |
| **R10** | Count the cards: ten. Tap two and nothing advances. Tap a third and the screen advances with no Submit pressed         |
| **R11** | After the third tap, seven cards animate onto the perch, numbered, in a stated order                                   |
| **R12** | Scroll the whole trip. Every day has stops, every night has a bed, and no slot reads TBD, Coming Soon or similar       |
| **R13** | Every day header shows two figures. Travel time is the left one, cost the right one, in that order on every day        |
| **R14** | Between the third tap and the trip appearing there is no dialog, no review screen and no second button                 |
| **R15** | The trip is complete on first render, before the share link has been opened by anybody                                 |
| **R16** | At 390px The Desk is one column. Widen past 1024px and it becomes two, with no horizontal scroll at either width       |
| **R17** | Days, slots, beds and costs are all on one scroll. Each day's chips and numerals carry that day's colour               |
| **R18** | Every stop shows one chip. Collect them across the trip: only Open, Decided and At Risk appear                         |
| **R19** | Between any two consecutive stops there is a travel time and a mode. Neither is missing on any leg                     |
| **R20** | Look for an Edit button on The Desk. There is none; the only way into a stop is its drawer                             |
| **R21** | Tap any stop, on any day. The drawer for that slot opens                                                               |
| **R22** | There is one share control. What it opens is the Book, at the address the group would receive                          |
| **R23** | The Book's Setting and Printed states are the same page. The address bar does not change between them                  |
| **R24** | In Setting, every unresolved slot is a marked blank with candidates listed under it                                    |
| **R25** | In Printed, no blank, no candidate list and no tappable decision control remains                                       |
| **R26** | On the Book, try to change a resolved stop, a date or a cost. Nothing responds except a candidate under a blank        |
| **R27** | Open the Book link from a phone-width viewport. No account step appears and no text is clipped                         |
| **R28** | Put the Book and The Desk side by side. Stop names, day colours and day totals are identical                           |
| **R29** | Open the drawer, dismiss it. You are back where you were, at the same scroll position, on the same surface             |
| **R30** | Read any drawer row: a numeral, a name, then two figures — travel first, money second. No row shows only one           |
| **R31** | Open a drawer. The top row is numbered 2, and the stop in the slot carries no numeral                                  |
| **R32** | Open a drawer on a slot the fixture marks unfit for a given option. That option is absent, not greyed                  |
| **R33** | Tap a row. The stop changes immediately, with no confirmation and no prompt to notify anyone                           |
| **R34** | Compare the drawer opened by the closure with one opened by tapping the stop. Same component, same rows, same actions  |
| **R35** | The strip is visible on The Desk and on the Book. There is no nav item, tab or route that leads to it alone            |
| **R36** | Read the entry aloud. It names what left, what arrived, why, and what the day costs now                                |
| **R37** | The entry says a rank. Open that slot's drawer and find the same number on the same option                             |
| **R38** | Swap twice. Both entries are present, newest at the top                                                                |
| **R39** | Press Undo. The previous stop returns and a new entry records the reversal; the original entry is still there          |

---

## The Demo Path

**One unbroken sequence, and it is the spine of the 3-5 minute video.** It produces `PRODUCT.md`'s demo sentence at
step 9. The fixture is a Yogyakarta trip, three nights and four days, which is the length
`research:docs/users/synthetic-panel-2026-09-07.md` produced unprompted from all three models and attributed to one day
of annual leave against a weekend.

**The video opens on `/interview`, not on `/`.** A judge who follows the bare link lands on The Desk and sees a working
trip immediately, which is the right first screen for someone with thirty seconds. The interview is the right first
screen for the video, because question 3 is where the bench is made and that is the beat the whole claim rests on.

| **Step** | **The Click**                                         | **What It Proves**                                                                                        |
| -------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **1**    | Open `/interview` in a private window                 | No install, no account, no landing page. The screen after the URL is the product (R1, R2)                 |
| **2**    | Question 1: tap A Few Of Us                           | One tap decides solo against group, and nothing is asked twice (R8)                                       |
| **3**    | Question 2: tap what the trip is for                  | The interview has a voice, not a dropdown (R9)                                                            |
| **4**    | Question 3: tap three of ten, Merapi last             | On the third tap the other seven step onto the perch, ranked. **This is the bench being made** (R10, R11) |
| **5**    | Tap Perch Proposes The Trip, then do nothing          | The whole trip renders unprompted: four days, every slot, a total per day (R12-R15)                       |
| **6**    | Tap Open The Book                                     | What she pastes into WhatsApp is a magazine with marked blanks, not a planner (R22-R24)                   |
| **7**    | Tap one candidate under a blank, then Settle This One | The group's only write is a tap, and the blank resolves (R26)                                             |
| **8**    | Back on The Desk, tap Cancel The Merapi Jeeps         | The labelled fixture control stands in for the feed a live build listens to                               |
| **9**    | Read the What Changed strip                           | The swap has already applied and the strip carries the sentence (R18, R36)                                |
| **10**   | Open Day 3, tap On The Perch                          | Prambanan sits at rank 2 with its delta in travel then money. **The sentence is checkable** (R31)         |
| **11**   | Open the Book once every blank is settled             | Every slot resolved, the controls gone, the day still at RM 119. The keepsake (R25)                       |

**The sentence step 9 produces**, verbatim from `PRODUCT.md`:

> **Swapped Merapi Lava Tour for Prambanan. Jeep tours cancelled for haze, Prambanan was your number two for that slot,
> and the day stays at RM 119.**

**The figure differs from `PRODUCT.md`, and the claim does not.** `PRODUCT.md` writes the same sentence ending "the day
stays at RM 40". The build prices Merapi and Prambanan at the real foreign gate rate, where both land at RM 107, so
**"stays at" is literally true and only the total is different**. One of the two must move before the video is scripted:
either `PRODUCT.md`'s figure updates to the fixture, or the fixture's demo day changes to a cheaper pairing.

**Why the closure fires from a labelled button.** A fixture has nothing to observe, so the disruption has to be
triggered. It sits on The Desk under a **Prototype Controls** heading that says in plain words it is not part of the
product. **A hidden timer would demo better and be less honest**, and a judge who can fire it twice can check that the
repair is computed rather than replayed.

**The case demonstrated is mid-trip, and that supersedes a `research` recommendation.**
`research:docs/decisions/disruption-recovery.md` recommended scoping the prototype to pre-trip only, before the persona
existed. `PRODUCT.md`'s demo moment is explicitly the holiday morning, so the spine wins and the supersession is
recorded here rather than absorbed.

**Solo stays out of this path.** It is supported and it is the answer when a judge asks, but Target Group Alignment
rewards a narrow user, so it is not in the video.

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

| **Not In The Prototype**               | **Why Not**                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Authentication And Accounts**        | Four of the five friends will not install a second app, so an account surface would contradict the entry constraint |
| **A Backend, A Database, Persistence** | Simulated logic is what the phase is judged on; [`TRD.md`](TRD.md) owns the real thing                              |
| **Live Place, Weather Or Hours Data**  | Real place data is `PRODUCT.md`'s named unsolved risk. The prototype makes no external call at all                  |
| **Booking, Payment, Ticketing**        | Traveloka owns the rails on a Malaysian phone, and the answer to "why not Traveloka" must not be about booking      |
| **Landing And Auth Pages**             | Out of scope in [`DESIGN.md`](DESIGN.md): the product starts on a shared link                                       |
| **Dark Mode**                          | Out of scope in [`DESIGN.md`](DESIGN.md): a field guide is printed on paper                                         |
| **A 3D Page Turn**                     | It fights the in-app browser, costs days, and breaks first at demo scale                                            |
| **Native Apps And Offline Storage**    | The Book is a link that opens inside WhatsApp; anything installable defeats it                                      |

---

## Deferred, With A Trigger

**Nothing here is rejected.** Each names what would have to be true for it to come back.

### Should

| **Deferred**                    | **What Brings It Back**                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The Availability Phase**      | It returns the moment dates stop being a fixture input, which is when a real group creates a real trip in the building phase                                               |
| **The Before We Go Checklist**  | It returns when there is bookable state to derive from. Its logic already exists in `research:docs/prototype/travel-planner-slides.html` and should be ported, not rebuilt |
| **Google Maps Handoff Per Day** | It returns as soon as the video has spare seconds: one link per day, derived from stops already on screen, so its cost is minutes                                          |
| **Nudge**                       | `PRODUCT.md` names it in the Should tier and defines it nowhere. It cannot return until somebody writes down what it is. See [Open Questions](#open-questions)             |

### Could

| **Deferred**                  | **What Brings It Back**                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Link Or Screenshot Import** | Only as a filter over saves once a trip exists, never as a front door — `research:docs/users/synthetic-panel-2026-09-07.md` found the persona begins with a flight price and a leave balance, not a post |
| **EXIF Photo Matcher**        | Only as a detail on a stop, never as a page. `research:docs/decisions/build-verdict.md` demotes photo spots for good                                                                                     |

### From The Interview

| **Deferred**                            | **What Brings It Back**                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Question 4, How Do You Travel**       | It returns when the shape of a day stops being a fixture constant and starts being something the user sets                                                                                        |
| **Question 5, Anything Non-Negotiable** | It returns with must-go places, which `research:docs/decisions/group-preferences.md` records as the one survivor of the dropped split-planning idea: seated first, never cut, overriding the vote |

---

## Open Questions

**Genuinely unresolved from the sources, and each one changes something.**

| **#** | **The Question**                                                                                                                                                                                                 | **Where It Bites**                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **1** | **What is Nudge?** `PRODUCT.md`'s Should tier names it; nothing on `main` or `research` defines it. The only nearby mechanism anyone described is visibility — people pay when they can see other people paying  | The Should tier, and anything the video says about it             |
| **2** | **Three slots a day, or one anchor plus slack?** `research:docs/users/synthetic-panel-2026-09-07.md` found two of three panelists had abandoned packed days, while the earlier deck models three slots and a bed | R12, R13, R17, and the fixture's whole day model                  |
| **3** | **Do the group's taps visibly reorder the bench in the prototype?** `PRODUCT.md` says taps only reorder what Perch chose, but no source says whether a rank numeral changes on screen when someone taps          | R11, R31, and whether step 8 of the demo path shows a consequence |
| **4** | **Does a substitution need re-voting when the group disagrees, or does pre-approval hold?** Listed as still open in `research:docs/decisions/disruption-recovery.md` and untouched since                         | R33, and the honesty of the one-tap swap                          |
| **5** | **What happens when the bench runs out?** Also still open in `research:docs/decisions/disruption-recovery.md`. The fixture's seven benched options mean the demo path never reaches it                           | Unreachable in the prototype; a building-phase answer             |
| **6** | **Has anyone opened Troupe?** `PRODUCT.md` lists it as the single most valuable half hour still available. If Troupe already benches its losing votes, the claim this whole file specifies is gone               | Every requirement in this file                                    |
