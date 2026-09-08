# Mentor Session - Zach Khong - 2026-09-07

**Mentor:** Zach Khong, Full Stack Engineer at Solana Foundation, Cursor hackathon winner · **Length:** 38 minutes ·
**Who attended:** the team

**The verbatim record is [`../../../source/mentor-session-1-transcript.md`](../../../source/mentor-session-1-transcript.md)**,
Whisper-transcribed with timestamps. This file is the write-up the mentors README asks for; the transcript is the
evidence behind every quote in it. It was booked through issue #23 and held on Discord.

## What We Asked

What in the self-repairing itinerary concept was worth keeping, whether the interview and the bench would survive a
judge who had seen many travel planners, and how the group's input should be collected.

## What They Said

- > "All these features right, like one to six, is stuff that people will already build."
- > "The way that how you represent the voting feature is what would make your app special."
- > "I have to click a lot and I have to know what I want."
- > "The results could be nice UI, but the data collection could be just unstructured text."
- > "I feel like the voting part is a bit stiff." "Actively thinking is harder than just deciding yes or no."
- > "Being specific can definitely be your strength... you could plan to that level of cultural detail."
- > "Voting doesn't have to be yes or no. You could be like, oh, I like this place like maybe 65 percent."

Nine of his twelve teams were building a travel planner. "Vibe based planning" was his phrase.

## What We Are Changing Because Of It

The rebuild recorded in [`../../decisions/rebuild-verdict-2026-09-08.md`](../../decisions/rebuild-verdict-2026-09-08.md):

- The interview is dropped for onboarding with free text first and choice chips under it
- Voting becomes a swipe deck of reels, one place per card, yes or no, the name set small under the picture so the
  decision is made on the image. The name is not hidden: a card with no name cannot be discussed in the chat afterwards
- The self-repairing itinerary is dropped. The group's swipes go straight to a calendar the owner drags, a heuristic
  orders each day, and the trip prints as The Book. The ranked losers survive as the Perch drawer
- Tokyo replaces Yogyakarta, so the specificity he named is real place data rather than a claim

## What We Are Not Changing, And Why

- A group chat with an AI reading it: invites the "why not ChatGPT" comparison the concept exists to avoid
- Drawing on a map: a canvas does not survive a five-minute demo
- The 65 percent vote: the weighting exists, the owner's swipe at 1.5, but a friend's answer stays yes or no because
  "actively thinking is harder than just deciding yes or no" is his own argument against a slider
- The Fruit Ninja slice vote was ours, not his; he was "not sure about a slashing thing" and it was dropped on the call

## Follow-Up

- [ ] Book session 2 with a different mentor before 13 September, to challenge the pin-and-schedule mechanic
