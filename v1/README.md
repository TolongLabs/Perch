# v1, The Slide-Deck Mockup

**The prototype we showed the mentor on 7 September.** Built by DrxgClanPC between 1 and 6 September, deployed to
Vercel, and kept here unchanged so the direction it argued for can still be opened rather than only described.

| File                               | What It Is                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| [`index.html`](index.html)         | The slide deck, six sections. **This is what the Vercel URL serves and what the mentor saw** |
| [`map-first.html`](map-first.html) | The earlier map-first draft, 1-2 September. Controls left, map right                         |

**Both are self-contained.** No install, no network, nothing to run - open either in a browser.

> **Deployed** at [codenection-travel-planner.vercel.app](https://codenection-travel-planner.vercel.app). Other Vercel
> URLs for it sit behind SSO and are unusable, so that address is the only one that works for a judge.

---

## Why It Is On `main`

**It was on the `research` branch, which is never merged and is not part of the submission.** A reviewer comparing v1
against [`../v2/`](../v2/) needs both in one place, and the mentor session's feedback lands on this one - see
[`../docs/source/mentor-session-1-transcript.md`](../docs/source/mentor-session-1-transcript.md), where the team walks
its numbered pages.

**It is copied, not moved.** `research:docs/prototype/` still holds these plus the two storybook fork drafts and the
whole-app skeleton, and those stay there because the ideation trail is a graded deliverable.

---

## What Is Not Real In It

Stated in the mockup itself, and worth repeating rather than letting a judge find it:

- **Sample costs, appeal scores and nightly rates are invented.** Plausible, not sourced
- **Weather events are simulated.** The Disruption tab names the APIs a real build would use
- **Traffic is a printed model**, not a feed
- **The sample places are a fixed dataset**, not a live place API

**One thing in it genuinely runs:** the photo matcher reads EXIF in the browser to name the stop, the compass bearing
and the shot advice.

---

## What Replaced It, And Why

**v2 is a rebuild, not a refactor.** The concept moved from a six-page deck to two surfaces plus the way in, and the
reasoning is in [`../docs/PRODUCT.md`](../docs/PRODUCT.md) - particularly its Decision Record, which retires the fork
this deck belonged to. The mentor's own reading of this deck was that _"page three and page four"_ did not connect to
the rest, which is the same complaint the rebuild answers by having fewer pages rather than better ones.
