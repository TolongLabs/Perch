# The Storybook's Shape, And What The Interview Is For

**Opened 2026-09-06**, in an Excalidraw session with Jin Siang and Hee Zi Jie. **Unresolved on purpose** - two draft
prototypes are being built so the fork at the bottom can be decided by eye rather than by argument.

Working canvas: [Excalidraw room](https://excalidraw.com/#room=90c7833c3e3833b8ac72,4dv2AtU2TpG_Owce-O3xCw). The room
key lives in the URL fragment and never reaches Excalidraw's servers, so that link is the only way back in. It is a live
collaborative session, not an archive - export to `../diagrams/` before relying on anything drawn there.

---

## What Was On The Board

```
Landing -> Sign In / Sign Up -> (authenticate) -> Dashboard
Dashboard -> Settings
Dashboard -> "New Trip" -> Interview Questions -> Loading... -> Trip Storybook
Dashboard -> View Records ------------------------------------> Trip Storybook
[ Plan It Together ]   <- floating, connected to nothing
```

The interview held seven questions and a blank eighth: where to start and end, transport type, cultural/natural/mixed,
hotel preference, must-go locations, budget and date, and when a day should start and end. The storybook held one line -
flipbook display, in the manner of FlipHTML5. **Plan It Together** was drawn as a page with three empty numbered slots
and no incoming arrow.

The stated model for the interview is the onboarding at
[makanlah-b5h.pages.dev/taste](https://makanlah-b5h.pages.dev/taste): four steps, four large cards per step, a permanent
right rail showing the question in conversational voice plus a running list of answers, an optional voice toggle, and
**"Say It In My Own Words"** as a free-text escape hatch on every step.

---

## The Tension That Started This

The eight questions on the board are a **booking form**. MakanLah's four are a **taste probe**. They are different
machines, and the difference is not cosmetic.

**Nothing in the eight questions feeds the bench.** After three competitor scans the bench - the vote leaves a ranked,
pre-approved replacement pool behind it - is the only originality claim still standing
([`build-verdict.md`](build-verdict.md), [`competitors.md`](../market/competitors.md) Tier 1b). Constraints do not rank
anything. An onboarding that collects seven constraints produces a solver input; an onboarding that asks someone to pick
three places out of ten produces a bench.

There is a second cost. **The interview is the first thing in the submission video.** Seven screens of dropdowns spends
the opening forty-five seconds on the most-seen screen in the category, against judges the organisers warned "will have
seen a lot of to-do apps and trip planners".

---

## The Five Open Items

### 1. What The Interview Should Ask

Split it, because only half of it deserves to be an interview.

**The form, one screen, deliberately plain:** dates, budget, start and end airport, transport. Nobody wants to be
interviewed about their departure airport.

**The interview, five questions, each producing ranking signal:**

| # | Question                                                                       | Why It Earns A Screen                                                       |
| - | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| 1 | **Who's coming?** Solo, a pair, friends, family                                | MakanLah's "Company". One tap, and it is what switches Plan It Together on   |
| 2 | **What's this trip for?** The recovery, the culture hit, the food run          | Replaces "cultural/natural/mixed" with something that has a voice            |
| 3 | **Pick the three you'd hate to miss**, from a grid of ten place cards          | **Three chosen, seven benched. The interview is the bench**                  |
| 4 | **How do you travel?** Dawn to midnight, or two things and a long lunch        | The day start/end question asked as identity rather than as time pickers     |
| 5 | **Anything non-negotiable?** Free text plus the escape hatch                   | The must-go question, placed last to catch whatever the taps missed          |

Question 3 also rescues the unfinished "where should we go" page in
[`../prototype/travel-planner-slides.html`](../prototype/travel-planner-slides.html), which is still Option 1 to Option
8 with "photo later" placeholders, by giving it a job.

**Dropped from the board's list:** hotel stars becomes a filter on results, not an identity question; transport type is
derived from answers 1 and 4.

### 2. The Social-Media Reference Post

**Yes, but as a second front door, not as question zero.**

[`competitors.md`](../market/competitors.md) already names Xiaohongshu as the thing that beats our photo page - 300
million monthly users aged 18 to 40, planning itineraries around check-in posts. We do not beat them at inspiration.
**But nothing found turns a saved post into a plan.** Today that path is screenshot, group chat, someone retypes the
places into Google Maps.

So: a second call to action beside New Storybook. Paste a link or drop a screenshot, it extracts the places, and the
interview still runs - but question 3's ten cards are now the ones from the post.

| Risk                                                                                                     | Standing |
| ---------------------------------------------------------------------------------------------------------- | -------- |
| Xiaohongshu has no public API and is hostile to scraping; Instagram oEmbed needs app review              | Real. The demoable version is **screenshot to vision to place names**, which needs nobody's permission |
| [`build-verdict.md`](build-verdict.md) concluded breadth of features is a liability under this rubric   | **It earns its place only by replacing the generic New Trip empty state, not by sitting beside it** |

### 3. Plan It Together

**It is not a page, and the canvas said so by leaving it unconnected.**

The deployed mockup already has it built correctly: section 2, "What to do today", carries per-slot vote counts and a
Bench line underneath. That is Plan It Together, inside the book.

So it is a **state**: drafting, where pages show options, votes and benches and anyone can vote; and final, where the
pages flip and the bench hides but stays live underneath. Solo is the same surface with a group of one, decided by
interview question 1. No separate flow, and no nav item.

### 4. Edit My Plan

**It should not exist as a global button.** A generic Edit turns the storybook into a document editor, and that is a
fight with Wanderlog and Google Docs that we lose.

Every edit path runs through the bench instead. Tap a stop, its bench slides up, pick a replacement in one tap - already
group-approved. Something not in the pool is a nomination, so it goes to a vote. Dates and budget live on the plain
form and trigger a re-derive.

The payoff: **"a stop closed" and "I changed my mind" become the same interaction.** That extends the one-mechanism-
three-jobs pattern already recorded in [`iteration-log.md`](iteration-log.md) to a fourth job.

### 5. Where The AI Agent Goes

**It runs the bench; it is not something you talk to.** A chat panel invites "why not just use ChatGPT", and
[`competitors.md`](../market/competitors.md) says we lose that comparison - generation is commoditised and our
demographic is named as the world's heaviest AI-travel users.

Three places tool use genuinely earns its keep:

| Where                    | The Tool Call                                                    | Why It Survives                                    |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------------------------- |
| **Post to places**       | Vision over a screenshot, then place resolution                  | Real tool use, fully demoable, needs no partner API |
| **The re-deriver**       | Opening hours, weather, then a pick from the bench                | **The one-sentence explanation is the product**    |
| **The storybook writer** | Prose and captions for the magazine pages                        | Commoditised, but presentation is not where we compete |

The re-deriver's output is the demo's wow moment, and it reads like this: _"Swapped Merapi for Prambanan - jeep tours
cancelled for haze, Prambanan was your number two for that slot, and the day stays at RM 40."_

**Not** a chat panel for planning.

---

## The Fork, Unresolved

Both branches start identically - interview, then generate. They differ in what you land on.

|                              | **A - One Book, Two States**              | **B - Planner Page, Then Book**            |
| ---------------------------- | ----------------------------------------- | ------------------------------------------ |
| **After generating**         | You land in the book, in draft           | You land on a planner page                 |
| **Where voting happens**     | On the book's pages                      | On the planner page                        |
| **Reaching final**           | The same book changes state              | Press Finalise; the book is generated      |
| **Is the book editable?**    | Yes, through the bench                   | No, it is read-only output                 |
| **"Edit my plan" means**     | Tap a stop, the bench slides up          | Go back to the planner                     |
| **Plan It Together is**      | A state, with no nav item                | A page, with a nav item                    |
| **When a stop closes**       | The page you are on repairs itself       | Notify, planner, fix, re-finalise          |
| **A solo user sees**         | The book, minus vote counts              | A voting page built for groups             |
| **View Records holds**       | Books in mixed states                    | Finished books only                        |
| **Screens to mock**          | One, with two skins                      | Two, each simpler                          |

**The two trade-offs that matter.** A puts the repair where the user already is: when the volcano tour cancels, the page
being read changes underneath. That is the claim demonstrated rather than narrated. B is mechanically cleaner, because a
flipbook is built for reading and hosting vote widgets and swap menus inside one fights the format.

**The recommendation on the table, not yet accepted:** A, with B's concession - the draft state is **not** a flipbook but
a plain scrolling surface, much like the current mockup's section 2, and the flipbook is what the final state looks like.
Same object, same URL, same name, two presentations.

**What would argue for B instead:** wanting the book to be a keepsake people share after the trip. Keepsakes are
finished things, and that is a real product idea rather than a concession.

**How this gets decided:** two draft prototypes, built to be looked at side by side and then thrown away or promoted.
Recorded here before they exist so the decision is legible afterwards.
