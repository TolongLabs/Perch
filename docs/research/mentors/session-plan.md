# Mentor Session Plan

**Written 2026-09-04**, nine days before the deadline, with `sessions/` still empty. This is what we intend to ask, who
we intend to ask, and why - so that when the write-ups land, a judge can see the questions were chosen and not
improvised. Each session still gets its own file from `_template.md`.

## What Actually Got Booked, And What That Changes  -  2026-09-07

**This plan was written on 4 September and two things about it are now out of date.** Both are corrected here rather
than edited away, because the plan being wrong and being fixed is the record.

**One session was booked, not two, and it went to the wrong half of this page.** Zach Khong is listed below under
Session Two, the feasibility session. The booked slot - **tonight, Monday 7 September, 21:40 MYT** - carries **Session
One's two questions** instead, because Session One is the one that can still move the concept, and the 6-7 band needs
the concept to move. His declared domains cover both, so nothing is lost by asking him the judge's-eye questions. See
issue #23.

**Question 1 below is aimed at a claim we have since demoted.** It asks whether the *round-trip shape* survives being
filed under "trip planner". [`../decisions/build-verdict.md`](../decisions/build-verdict.md), decided 6 September,
made the round trip a **secondary** twist and put the headline on the bench. **Asking tonight's mentor to react to the
round trip would spend the only booked session on the wrong sentence.** The corrected version of Question 1 is the one
in issue #23: how should the first sentence be worded so we are not filed under "trip planner" before the mechanism is
heard - where the mechanism is the bench.

**Question 2 is unchanged and is now answerable**, because [`../users/personas.md`](../users/personas.md) finally names
someone. She is `[assumed]` and the write-up should say so when she is put in front of him.

---

## The Argument About Timing

The plan on the table was to book only once the team had anchored on an idea. We are not doing that, for three
reasons, and the disagreement is recorded here rather than smoothed over.

1. **The top band needs the concept to change.** The rubric's 6-7 wording is feedback "meaningfully incorporated into
   the concept". A session held after we have anchored can only produce agreement, and agreement writes up as "mentor
   mentioned, no specific feedback shown" - the 2-3 band. The idea has to still be movable when the mentor meets it.
2. **The clock is external and the queue is not ours.** The booking sheet says to book **at least one day before** the
   session, 200-plus teams share 18 mentors, and there are nine days left. A slot booked on 11 September leaves no time
   to act on what was said, and acting on it is where the marks are.
3. **"Anchored" is the wrong prerequisite.** What a mentor needs from us is a target to hit, not a finished idea. A
   provisional named user and a one-sentence pitch is enough, and both take an afternoon, not a week.

What survives from the original plan: we bring the travel planner, not both problem statements. Asking a mentor
"which one should we do" spends 25 minutes on a question they will answer with "either". That choice is ours.

## What A Slot Is For, And What It Is Not For

A mentor **cannot tell us who our user is.** That comes from `../users/interviews/`, and asking a mentor to guess
produces a guess with a credential attached. What a mentor **can** do is break a user we have already named, tell us
what this rubric's judges reward, and say whether four people can build the scope in three weeks. Every question
below is one of those three.

Twenty-five minutes fits **two questions with follow-up**. Three is a rush and the third gets a shallow answer, so the
three questions are split across two sessions with two different mentors - the mentors README asks for exactly that.

## Session One - The Judge's Eye

**Book for 6 or 7 September.** Ask a mentor who has won under this rubric or its close relatives.

| Preferred      | Why                                                                                   |
| -------------- | ------------------------------------------------------------------------------------- |
| Mah Qing Fung  | CodeNection 2025 Champion - has been scored by this organiser's rubric and won        |
| Sim Hong Bing  | 19 hackathon wins; knows what a judge sees in the first two minutes                   |
| Janelle Tan    | Product design; works at the same company as judge Muhammad Fathy Rashad              |

**Question 1 - does the differentiator survive the phrase "travel planner"?**

The organisers said judges "will have seen a lot of to-do apps and trip planners", and one judge has judged fifteen
hackathons. Our one surviving originality claim is that nobody treats the shape of a same-airport round trip as the
traveller's decision. We want to know whether that reads as a real angle or as a feature on a common idea, and how
the first sentence of the pitch should be worded so the judge does not file us under "trip planner" before hearing it.

**Question 2 - break this user.**

We name a provisional user - the working choice is a group of working adults who can only travel on weekends, so the
trip is two days and every hour is contested - and give the before-and-after sentence. The ask is not "is this right"
but "what is the first thing a judge will say is wrong with it". The answer tells us what to test in the interviews.

## Session Two - Can We Build It

**Book for 9 or 10 September**, after session one has had time to change something. Ask an engineer.

| Preferred      | Why                                                                                   |
| -------------- | ------------------------------------------------------------------------------------- |
| Khor Jia Quan  | CodeNection 2024 Champion and a software engineer - won here, then built things       |
| Looi Wei En    | Mobile engineer; the "why is it a web app" question will come and they can rehearse it |
| Zach Khong     | Full-stack, won a Cursor x Anthropic hackathon - knows the AI-assisted build pace     |

**Question 3 - what would you cut, and what breaks in October?**

We describe the smallest version: one country, a fixed place dataset, the round-trip choice, the group vote, the
ranked bench, and simulated disruption. Then two asks. First, what they would cut from that to make it a three-week
build for four people. Second, the honest risk we already see: the Deployment Phase needs real place data and metered
map APIs, and the mockup ducks this with invented data. We want to hear whether that risk is manageable on free tiers
or whether it changes the scope now. Feasibility "rewards your honesty", and this is where we are least sure.

This is a feasibility question, not a stack decision. Whatever they say about tools goes into the write-up and gets
quoted into `main` when the stack is chosen there.

## Before Either Session

- [ ] Pick the provisional user and write the one-sentence before-and-after into `../users/personas.md`, marked
      `[assumed]`
- [ ] Have the mockup open and shareable on Discord; it answers "what is it" in thirty seconds
- [ ] One person asks, one person types what is said, word for word - the write-up quotes, it does not paraphrase
- [ ] Write the session file the same day, and add the row to `../decisions/iteration-log.md` for whatever changed

## What We Will Say In The First Sixty Seconds

> **Superseded 2026-09-07.** It leads with the round trip, which the build verdict demoted the day after this was
> written. Kept because a dropped direction is worth marks and because the difference between the two openings is the
> clearest evidence on this branch that the positioning moved.

~~We're TolongLabs, doing the Travel Planner statement. We plan a group trip from what people like and the group only
vetoes - no one does the planning. The one thing we found no product doing is treating a same-airport round trip as a
choice: retrace the way you came, or reach the furthest point halfway and come back a different way. The vote also
produces a ranked bench, which is the cut list when we're over budget and the replacement pool when a stop closes. We
have a clickable mockup with invented data. We have two questions, and we'd rather you were harsh.~~

**The version to say tonight.** It leads with the mechanism, names the user, and gets the mockup on screen before the
word "planner" has a chance to file us:

> We're TolongLabs, on the Travel Planner statement. Our user is the person in every friend group who ends up doing
> the planning, on a two-day trip where every hour is already contested. The group votes on what they want, and the
> vote does two jobs: it builds the trip, and everything that lost becomes a ranked bench. So when a stop closes
> mid-trip, the itinerary repairs itself from options the group already approved - no new argument, no reopened group
> chat. We have a clickable mockup with invented data. We have two questions and we'd rather you were harsh.

**Why that order.** "Trip planner" is the phrase that gets us filed, so the sentence that follows it has to be the
mechanism, not a feature list. The round trip is not in the opening at all any more; it is a good answer if he asks
what else is different, and a distraction if it goes first.

## Booking Facts Not In The Brief

From the booking workbook itself, read 4 September: book **at least one day before** the session; a team more than
**seven minutes late** to the voice room is cancelled automatically; each mentor has their own sheet and their own
Discord voice channel, labelled by name. Enquiries go by Discord ticket or to the Head and Assistant Head of
Competition.
