# Synthetic Panel - Three Models Playing Aisyah - 2026-09-07

> **This is not user research and must never be cited as it.** No human was asked anything. Three language models were
> given the persona from [`personas.md`](personas.md) and asked to answer six behavioural questions in character. Every
> quote on this page was generated, and `interviews/` is still empty.
>
> [`README.md`](README.md) says "do not quote someone who does not exist", and this page exists so that rule can be kept
> while the exercise still gets used. **Nothing here is evidence about travellers.** It is evidence about our own
> persona: where three independent models filled the same gap the same way, and where they refused to.

## Why It Was Run

The prototype rubric does not ask for interviews - the word appears nowhere in
[`../source/prototype-judging-rubrics.md`](../source/prototype-judging-rubrics.md), nor in the organisers' submission
template, which lives on `main` at `docs/source/submission-template.md`. What Impact actually scores is a specific user
and a convincing before-and-after. So this was run for one purpose: **break the persona before the mentor does**, four
hours before the first mentor session.

## Method, Stated So The Result Can Be Discounted Properly

|                       |                                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Models**            | `z-ai/glm-5.3-flash` (A), `qwen/qwen3.7-flash` (B), `deepseek/deepseek-v4-flash` (C), via OpenRouter                                                                                                                   |
| **Same brief**        | All three got one identical brief. The variable is the model, not the character                                                                                                                                        |
| **What they got**     | Aisyah's identity: 24, junior office job in KL, renting, no car, four or five university friends now on clashing shifts, always ends up organising                                                                     |
| **What was withheld** | The five-app stack, the Tuesday-night and Thursday-midnight moments, the app-install refusal, the opening-hours re-check. **These are the claims being tested, so feeding them in would have marked our own homework** |
| **Also withheld**     | Every mention of the product, the bench, the vote, the storybook and this competition                                                                                                                                  |
| **Run**               | Headless, empty config dir, working directory outside the repo so no project file was readable                                                                                                                         |

**The weakness of the method, stated plainly.** Three models trained on overlapping corpora are not three independent
observers, and agreement between them measures a shared prior, not a fact about Malaysia. Treat convergence as **"our
assumption is the obvious one"**, never as **"our assumption is true"**. Divergence is the more informative half.

---

## What It Corroborated

### The Group Will Not Install Anything, And All Three Gave The Same Reason

This was the strongest convergence, and each model reached it through different detail.

> "If even one person in the group says 'can't you just put it in the chat,' it's dead. The group will not install
> anything." - A

> "I would not install another app. I have too many apps already and my phone storage is basically full." - B

> "If the app requires everyone in the group to install it, forget it ... So it has to work even when three out of four
> people haven't installed it." - C

**All three independently produced the same product requirement**: it has to work for the people who never install it.
`personas.md` already states this as a constraint; the panel says it is the obvious reading rather than a stretch.

### The Trip Is Three To Four Days, And Annual Leave Is Why

All three gave the same length and the same cause, unprompted.

> "Three nights, four days, because that's the longest you can do on one day of annual leave by tagging a weekend and a
> public holiday." - A

This matters because [`personas.md`](personas.md) argues the bench only pays when the schedule is tight, and that the
short-trip user and the disruption claim are the same choice. The panel supports the premise that trip is short.

### She Does It Alone, At Night

B produced the Thursday-night claim without being given it - "finished everything on a Thursday night around 11 PM
while eating Maggi mee" - and A reached the same shape from a different angle, "lying awake at 1am comparing villa
reviews". The **specific two moments** in `personas.md` are not confirmed; the pattern under them is the obvious one.

---

## What It Contradicted, Which Is The Useful Half

### 1. ChatGPT Is Not In The Stack. Nor Is Xiaohongshu

[`../market/landscape.md`](../market/landscape.md) leads its whole argument with a five-app stack in a stated order:
ChatGPT, then Xiaohongshu or Instagram, then a WhatsApp poll, then Google Maps lists, then Traveloka.

**ChatGPT appeared in none of the three answers. Xiaohongshu appeared in none.** What the three actually described:

|            | **A**                | **B**             | **C**                                                            |
| ---------- | -------------------- | ----------------- | ---------------------------------------------------------------- |
| **First**  | WhatsApp             | WhatsApp          | WhatsApp                                                         |
| **Then**   | Outlook, for leave   | Traveloka         | AirAsia                                                          |
| **Then**   | AirAsia, Booking.com | Google Maps       | **Google Sheets**                                                |
| **Then**   | Google Maps, Klook   | Booking.com, Grab | Grab, Booking.com                                                |
| **Money**  | **Maybank2u**        | **splits.app**    | **Touch 'n Go eWallet**                                          |
| **Social** | -                    | -                 | Instagram and TikTok, **during the trip, "not really planning"** |

Two things fall out of that. **WhatsApp is first in all three**, which our stack has in third place. And **a money app
is in all three and is not in our stack at all** - A named her banking app as the one she opens most: "I open my banking
app more than any travel app, honestly."

**What to do with it.** The 40%-of-travellers-use-AI figure in `landscape.md` is Trip.com's published data and stays.
But the _ordering_ of the stack is our invention, and leading the pitch with ChatGPT is a choice no version of this
persona made. **The honest opening is WhatsApp**, which is also the competitor `landscape.md` already names as the one
that asks least of the user.

### 2. Nobody Votes. Whoever Commits First Wins

This is the finding that touches the product most directly. All three were asked how disagreements actually get settled,
and **not one described a vote**.

> "I found a compromise myself and presented it as already done. Nobody objected once it was booked, because objecting
> after payment feels mean. That's honestly the mechanism - whoever pays first wins." - A

> "I just booked Grab for 9:30 and sent it to the chat ... Nobody complained because the decision was already made and
> the cost was already sunk." - C

> "He's the quietest in the group and his opinion somehow ends up deciding everything because everyone defaults to
> whatever he says to keep the peace." - B

**Against shape B specifically.** [`../decisions/storybook-shape.md`](../decisions/storybook-shape.md) resolved that the
planner earns its separation from the interview only by being "a durable shared surface the group lives in over days -
votes landing Tuesday and Thursday, people wandering in and out". **All three models describe a group that does not do
that.** One person acts; the rest ratify by not objecting.

That does not kill the vote, because the vote is what produces the bench and the bench is the last originality claim
standing. But it reframes what the vote is for. **A vote that runs over days is a fiction; a vote that runs in one
sitting and then leaves a ranked residue behind it is not.** The panel is an argument for the interview shape and
against the durable-surface requirement, which is the opposite of what was decided on 6 September.

### 3. When A Plan Breaks, The Group Does Less. It Does Not Substitute

All three were asked about a disruption. All three described one. **None of them replaced the broken stop with a ranked
alternative.**

| Model | What Broke                          | What They Actually Did                                                         |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------ |
| **B** | Kek Lok Si stairs closed for works  | Abandoned the whole afternoon, went back to the air-con, Foodpanda and Netflix |
| **C** | Cable car, two-hour queue           | "Let's just go to the beach instead", bought kuih, Grab to Pantai Cenang       |
| **A** | Island tour cancelled, wind warning | **Aisyah re-planned it alone on her phone** and presented it done              |

And two of them said the collapse was _better_ than the plan:

> "We abandoned the rest of the scheduled afternoon stuff ... It ended up being nicer than the plan honestly." - B

> "The plan falls apart and we just do whatever is easiest ... Someone suggests something low-effort and we all say yes
> because it's hot and we're tired." - C

**This is the sharpest thing the panel produced, and it cuts both ways.**

**Against the bench:** if the group's real response to a closed stop is to do something low-effort and enjoy it more, a
ranked pool of pre-approved substitutes is solving a problem they already solve for free. A judge who has travelled will
recognise B and C's answers, and "we just went to the beach" is a genuinely good rebuttal to our headline claim.

**For the bench, but relocated:** A's answer is the counter, and it is the one to build on. The cost of a disruption is
not that the trip degrades - it is **who pays for the repair**.

> "The part that stung wasn't the cancellation, it was that I spent my holiday morning re-planning on my phone while
> everyone else waited to be told where to walk. Nobody else opened a single app to help." - A

That is the same pain the persona already names, arriving mid-trip instead of pre-trip. **The claim it supports is not
"the itinerary survives" - it is "Aisyah does not spend her holiday morning re-planning on her phone."** Narrower,
harder to rebut, and demonstrable in the same single shot.

### 4. The Worst Pain Is Not Planning, And Not Disruption

Asked what actually irritates them, all three went somewhere our product does not currently go. Two distinct pains, both
unprompted:

**Commitment lag, with a price attached.**

> "I am literally watching the fare increase while waiting for Farah to check with her supervisor." - C

> "Sitting there for two weeks watching everyone type 'yeah sounds good' and then completely ghosting." - B

**Being the unpaid treasurer.**

> "I front the villa deposit, RM600 on my Maybank card ... and then for the next month I'm the person sending 'eh, still
> waiting on yours' into the chat, which makes me feel like a debt collector to my own friends." - A

**Neither is addressed anywhere in the deck or the skeleton.** Both are squarely inside the target group's stated pain,
and the second one has a competitor answer already recorded - `SwipeSights` ships bill splitting, and
[`../market/competitors.md`](../market/competitors.md) lists it among the features nobody should pitch as new.

**This is not a reason to build a split-bill feature.** [`../decisions/build-verdict.md`](../decisions/build-verdict.md) is explicit
that breadth is a liability under this rubric. It is a reason to know that when a mentor or judge asks "what is the
worst part of planning a trip with friends", the honest answer is not the one our product solves, and we should say so
before they do.

### 5. Packed Days Are A Thing She Stopped Doing

The deck models each day as three slots plus a bed. Two of three said they had abandoned exactly that.

> "I used to plan tight itineraries - '10am this, 12pm that, 2pm this' - but it never worked ... Now I pick one thing
> per day that needs a booking and leave the rest open." - C

> "I plan one anchor per day and nothing else, because if I schedule two, the group will be late and grumpy and blame
> the schedule." - A

**One anchor per day, not three slots.** Worth weighing against the deck's structure, and worth noticing that an anchor
is precisely the thing that can be _booked_, and therefore precisely the thing that can _break_.

---

## What Changes As A Result

Nothing has been changed on the strength of this page alone, because it is three models agreeing with themselves. What
it does is aim tonight's mentor session, where a human can settle each one.

| #   | The Question It Raises                                                      | Where It Lands                             |
| --- | --------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Should the pitch open on WhatsApp rather than ChatGPT?                      | `landscape.md`, and the video's first line |
| 2   | Does the planner need to be durable over days, or is one sitting the truth? | Reopens the 6 Sept fork resolution         |
| 3   | Is the claim "the trip survives" or "she does not repair it alone"?         | The headline sentence itself               |
| 4   | Do we acknowledge money and commitment lag as out of scope, out loud?       | `PRODUCT.md`, the scope ladder             |
| 5   | Three slots a day, or one anchor plus slack?                                | The rebuild's day model                    |

**Question 3 is the one to take to Zach first.** It is the only one that changes the sentence the whole submission is
built on.

## The Raw Answers

Not committed. They were generated into a scratch directory outside the repo and are reproducible from the method above;
every line of them that mattered is quoted on this page. If they are wanted as an artifact, they need re-running and
committing deliberately, under the same label as this page.
