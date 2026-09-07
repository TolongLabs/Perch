# Mentor Session 1, Zach Khong - Transcript

The first and, as booked, only mentor session. Held on Discord on the evening of 7 September 2026, sectioned by
timestamp. This is where a mentor who is simultaneously mentoring eight other travel-planner teams told us what he was
seeing in all of them, and where the words "vibe based planning" were said out loud for the first time.

> **Source** - local recording `2026-09-07 21-50-30.mp4` (OBS capture, 38m 14s). **Method** - audio extracted with
> `ffmpeg` to mono MP3, transcribed locally with OpenAI Whisper (`medium`, `language=en`) on GPU, with a proper-noun
> context list supplied. Reproduce with any Whisper wrapper; the model and language are what matter. **Editing** -
> timestamps are Whisper's and are preserved; back-channel filler and dead air are trimmed; ASR-mangled proper nouns are
> corrected per the key below. **Nothing said has been reworded.** Where a sentence is quoted in italics it is verbatim.
> Transcribed 2026-09-07.

**Read the caveat in [Who Said What](#who-said-what) before quoting an individual team member.** Whisper does not
separate speakers, so team turns are attributed to the team unless the recording names the person.

Contents:

1. [Who Said What](#who-said-what)
1. [Proper-Noun Correction Key](#proper-noun-correction-key)
1. [00:00 Opening, And What Was Shown](#0000-opening-and-what-was-shown)
1. [00:02 Walking The Deck, Pages One To Six](#0002-walking-the-deck-pages-one-to-six)
1. [00:06 The Team Names Its Own Problem](#0006-the-team-names-its-own-problem)
1. [00:06 Seventy Percent Are Building This](#0006-seventy-percent-are-building-this)
1. [00:08 Narrow The Scope, And Reframe It](#0008-narrow-the-scope-and-reframe-it)
1. [00:09 Which One Is The Core Feature](#0009-which-one-is-the-core-feature)
1. [00:10 Voting Is Table Stakes](#0010-voting-is-table-stakes)
1. [00:13 Scrap The Forms, Collect Unstructured Text](#0013-scrap-the-forms-collect-unstructured-text)
1. [00:17 The UI Makes You Click Too Much](#0017-the-ui-makes-you-click-too-much)
1. [00:20 An Opinionated Framework, And Perplexity](#0020-an-opinionated-framework-and-perplexity)
1. [00:23 Nice UI For Output, Unstructured Text For Input](#0023-nice-ui-for-output-unstructured-text-for-input)
1. [00:24 Fifty-Fifty Votes, And Cognitive Load](#0024-fifty-fifty-votes-and-cognitive-load)
1. [00:26 Swipe Voting, And Hiding The Name](#0026-swipe-voting-and-hiding-the-name)
1. [00:27 Vibe Based Planning](#0027-vibe-based-planning)
1. [00:28 Nine Of Twelve, And Specificity As A Strength](#0028-nine-of-twelve-and-specificity-as-a-strength)
1. [00:30 How He Won The Cursor Hackathon](#0030-how-he-won-the-cursor-hackathon)
1. [00:32 Drawing On A Map](#0032-drawing-on-a-map)
1. [00:35 The Slice Vote, And Voting As A Spectrum](#0035-the-slice-vote-and-voting-as-a-spectrum)
1. [00:37 Close](#0037-close)
1. [Quotes Most Likely To Be Cited](#quotes-most-likely-to-be-cited)

## Who Said What

| Speaker        | Who                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **Zach Khong** | The mentor. Full Stack Engineer at Solana Foundation; winner of the Cursor x Anthropic hackathon |
| **TolongLabs** | The team. **Whisper does not diarise**, so team turns are attributed collectively                |
| **Jin Siang**  | Named in the recording at 00:02:49, as the person whose concern was being put                    |
| **Kuyo**       | Named at 00:01:05 as the person sharing the screen                                               |

**What was on screen was the earlier Vercel deck, not the rebuilt prototype.** The team describes _"our very bare bones
version of prototype"_ with numbered pages one to six, Plan It Together, and an eat-shop-do page. Every piece of
feedback below lands on that shape.

## Proper-Noun Correction Key

Whisper mangled names throughout. Corrections applied:

| Heard As                                      | Actually                     |
| --------------------------------------------- | ---------------------------- |
| "Team Tolong"                                 | **TolongLabs**               |
| "planet together" / "planet to the good page" | **Plan It Together**         |
| "Jing-San"                                    | **Jin Siang**                |
| "red notes" / "red note"                      | **RedNote** (Xiaohongshu)    |
| "tripvisor"                                   | **TripAdvisor**              |
| "chat gbt"                                    | **ChatGPT**                  |
| "cell v0"                                     | **Vercel v0**                |
| "open call"                                   | **OpenAI's cloud computer**  |
| "food ninja"                                  | **Fruit Ninja**              |
| "gang gang ho"                                | (unclear, left as heard)     |
| "the u.s could be horrible"                   | **the UX could be horrible** |
| "mr dog" / "Kuyo"                             | (team members, by nickname)  |

## 00:00 Opening, And What Was Shown

**[00:00:38] Zach Khong:** _"So uh quick introduction. My name is Zach and I'm your mentor for this round. How can I
help you today?"_

**[00:00:48] TolongLabs:** _"Alright hi we are from Team Tolong. We just want to check with you whether our idea is
realistic, because our idea is about a travel planner actually."_

**[00:00:58] Zach:** _"Sick. Let's do it."_

**[00:01:09] TolongLabs:** _"This is basically our very bare bones version of prototype. It's not polished yet. But this
is basically everything of our idea, just packed into one single web app."_

**[00:01:39] TolongLabs:** _"Currently we are still in the ideation phase to be honest. We just want to check whether
this thing is realistic or not."_ The plan described is Trip.com-style, scoped to **Malaysia and Japan**.

**[00:02:16] Zach:** _"Why specifically these two countries?"_ Answer: Malaysia because the team is here; Japan because
_"the public transport in Japan is probably one of the most advanced"_ and people around them want to go.

## 00:02 Walking The Deck, Pages One To Six

**[00:02:53] TolongLabs:** The page shown is the middle of the flow - _"this is like a storybook already, the trip
book."_ Opening the app shows a map and _"an already done trip plan where there's no customization, so it's much
easier."_ Customising sends you to _"an interview, a very short interview"_ which generates the trip book.

**[00:03:35] TolongLabs, naming the problem they came with:** _"the actual main concern is about if page three and page
four is needed, because it doesn't seem like the flow is there."_

| Page          | What It Was For                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Three**     | _"a small summarize of what you have done in Plan It Together"_, plus what to expect on each day                       |
| **Four**      | Highly rated places, AI-suggested. Its flaw: _"you have to go back to page two to insert the locations back"_          |
| **Five, Six** | _"telling you what's likely going to happen to prevent any kind of stuff"_ - the example given is bringing an umbrella |
| **Final**     | Per-day Google Map, times, photo and link per stop, and a pre-trip checklist                                           |

**[00:05:52] Zach:** _"Nice, got it. May I ask if this is your first hackathon or have you participated in others
before?"_

## 00:06 The Team Names Its Own Problem

**[00:06:12] TolongLabs:** _"I think our issue currently with the prototype is we have a lot of ideas. We don't know
where to fit in the prototype or make the whole workflow streamline. That's actually our main issue right now."_

**[00:06:28] TolongLabs:** _"For what I understood in hackathons judges always want to see like a narrowed down scope."_

**[00:06:35] Zach:** _"Exactly."_

## 00:06 Seventy Percent Are Building This

**[00:06:40] Zach:** _"I would say you have a good chance at winning simply because you are planning your app on a
deeper level, in a sense where like around all of the groups that I mentor around 70% of them are doing this exact
topic."_

**[00:07:01] Zach, on what the other teams are doing:** _"the idea usually just surrounds collecting input from everyone
on where they want to go, and then they ask AI to generate it, which is a lot of work for the user to do."_

**[00:07:16] TolongLabs** then describes Plan It Together: voting, a Kahoot-style code shared to the group, RedNote and
TripAdvisor references, member-added proposals rendered with a gold border to distinguish them from AI-generated ones,
and voting on the hotel.

**[00:08:21] Zach:** _"I think this is great. I actually really like the part where I think it's in the final plan where
you also make sure everyone's visa and everyone's passport is like up to date, right before everyone planning
everything."_

## 00:08 Narrow The Scope, And Reframe It

**[00:08:45] Zach:** _"for hackathons, especially when you only have like five minutes to present, you need a more
narrow scope."_

**[00:08:52] Zach:** _"So I think you could even reframe the problem a little bit where you are trying to provide the
end-to-end solution for all travel related problems and not just the ones that are mentioned in the planner. Say you're
also coordinating everyone's insurance for example and everyone's passport. **Basically you want to automate away the
boring parts of traveling.** I feel like you could frame it like that."_

**[00:09:17] Zach:** _"So I find it very boring to read like what the insurance covers for example when I'm booking a
flight ticket. So I think these things right, you can make it very easily presentable, and then cover the gaps that you
usually find annoying."_

## 00:09 Which One Is The Core Feature

**[00:09:45] Zach:** _"which one do you think that's like the core feature for your app? It feels like all of them are
core, but then which one do you think would impress people the most if you implement it perfectly?"_

**[00:09:56] TolongLabs:** _"I think the Plan It Together is the core thing, where the whole idea actually surrounds
Plan It Together and it develops to format."_

**[00:10:02] Zach:** _"So what happens if I vote no for a place that you voted yes?"_

**[00:10:18] TolongLabs:** _"No it wouldn't change anything. So the highest vote actually wins, and then the second
highest vote would be a backup plan just in case anything happens."_

## 00:10 Voting Is Table Stakes

**[00:10:29] Zach:** _"I think you could enhance this voting process a little bit where, you know, maybe you have like
an AI to try and find a middle ground for everyone."_

**[00:10:39] Zach:** _"I think this voting mechanism makes sense, especially if it's like a Kahoot style."_ He then asks
whether everyone has to participate at the same time. The team answers that a deadline closes it, set by the trip's
owner.

**[00:11:08] Zach:** _"for this feature right, **every team is building it**. But then I think it's okay to have this
feature, it's just the way that how you represent the voting feature is what would make your app special."_

**[00:11:25] Zach:** _"maybe you can do like a Tinder style voting system where you can swipe left and right."_

**[00:11:30] Zach:** _"**All these features right, like one to six, is stuff that people will already build.** It's
just, you know, to win this hackathon you have to think of another way to represent the same exact information. Maybe
you make it more fun, and then that will basically be your differentiator between everyone else."_

**[00:12:08] TolongLabs:** _"It's actually quite tough because the problem statement is quite simple only."_

**[00:12:13] TolongLabs:** _"the travel planner right is mainly just like these ideas are basically common, so it's
quite tough to come up with a differentiator."_

**[00:12:23] TolongLabs:** A team member's own alternative idea was _"a travel insurance calculator"_, noted as _"way
much more constrained in scope"_.

**[00:12:50] Zach:** _"I think it also doesn't help that the problem is so broad, because it feels like you have to
tackle everything."_

## 00:13 Scrap The Forms, Collect Unstructured Text

**[00:13:07] Zach:** _"what I think could work right is your Plan It Together feature can be - you can basically ask for
the same information but you request it in a different way."_

**[00:13:27] Zach:** _"maybe instead of having people fill out forms, maybe it could just be one chat interface, right,
and everyone can chat inside but then you have like a background AI agent analyzing the conversations. You could even
paste in your link for like RedNote or like any Google Maps, anything at all that's basically searchable on the web.
Then in the background you'll have something analyzing it. This way you can avoid all of the inputs that the user needs
to fill in. So basically it's like unstructured text."_

**[00:14:14] Zach:** _"it doesn't need to be a fixed UI or anything, you can just type whatever, and then the output is
like nice cards that you already have here. Then you can avoid basically the hassle of coordinating everyone to fill out
a form."_

**[00:14:38] TolongLabs:** _"that's a good idea actually, like so it's like a group agentic chat and then you just
organize the trip based on their chat."_

**[00:15:14] TolongLabs** explains the existing suggest-a-place form: category dropdown, optional name, and if the name
is left empty _"the AI would actually just find another alternatives for you... you can just simply press add to the
vote and then the AI will just come out with more alternatives."_

**[00:16:03] Zach:** _"So basically maybe you have like a vague idea of what you want to do, but then you just don't
know exactly what they have there that could let you do that thing."_ He gives the example of a night in Osaka where you
might want a hotel, or _"those like gaming pod things"_ - _"it's like you have a rough idea of what you want to do, but
then you let the AI help you find places that could help you do that."_

## 00:17 The UI Makes You Click Too Much

**[00:16:57] TolongLabs, summarising back:** _"the best approach now is the onboarding process, we turn it into the chat
interface as you suggested, a group chat interface. So everyone can actually throw their ideas and then the AI will
compile the information and organize it into this Plan It Together page, and then on this Plan It Together page is where
everyone votes for the things they mentioned in the chat."_

**[00:17:26] Zach:** _"my problem with the UI right is that **I have to click a lot and I have to know what I want.** I
think a lot of times you can highlight the main problem, is no one really knows what they want to do."_

**[00:18:35] Zach, on the eat-shop-do page:** _"Can you vote on this?"_ Answer: no, you have to add it into Plan It
Together and vote there. **[00:18:42] TolongLabs:** _"That's why I'm saying the streamline is a bit weird. That's the
main part I want to fix."_

**[00:19:15] Zach:** _"it probably doesn't have to be a separate screen. It could maybe just be like a button that's
always on the screen, and then when you click it, it just shows you generic Google suggestions, and then you can just
add it to Plan It Together. But then this page will always exist in the app itself, visible to the user."_

## 00:20 An Opinionated Framework, And Perplexity

**[00:20:03] Zach:** _"I actually don't really like this problem statement because it's a bit too broad. It feels like
you have to cover everything."_

**[00:20:11] TolongLabs, pushing back:** _"isn't it, if this is the product, if we relaunch it as a product, would you
want to use this or not?... it really does cover almost everything already, right?"_

**[00:20:46] Zach:** _"maybe for this hackathon you can **reframe your solution as an opinionated framework on how to
organize trips.** So for example, you have to plan these eight steps. These eight things you must definitely do for a
trip. And you make the planner follow exactly step one to eight, but then all the data they need is collected in a way
where it doesn't require a lot of effort to plan."_

**[00:21:21] Zach, describing how he plans trips himself:** _"usually when I plan for trips I just go to Perplexity... I
usually just type everything that I want to see in one giant text box and then Perplexity will help me find which places
to go. And then there's this Google Sheet that I asked it to generate, and then I just highlighted with red or yellow or
green depending on which one I like and which one I don't like. So personally I feel like that is the easiest way for
someone to tell you what they want and what they don't want."_

**[00:22:22] TolongLabs, naming the risk:** _"it's basically we can just make all these things and it really just
becomes an AI skill kind of stuff."_

## 00:23 Nice UI For Output, Unstructured Text For Input

**[00:22:38] Zach:** _"one problem I have with Perplexity is that it's still just all text. I don't get to see the
photos and I don't get to see the nice UI."_

**[00:22:52] TolongLabs:** _"exactly, I think that's what our solution is trying to solve. It's like a nice UI, display
visual elements."_

**[00:23:01] Zach:** _"the thing that you can enhance is **the way that you collect data. I just don't want to fill out
any forms.** If there's a trip planner and I need to fill out my preferences, and then they force me into say four
categories - you want to go outside or you want to be indoors - I feel like you could basically just scrap away all of
the input UI and then just make it into one giant ChatGPT kind of interface. But then for the results of the analysis it
could be nicer UI."_

**[00:23:34] Zach:** _"let's say you're visualizing the Japanese train station, it could be like a nice UI that brings
you from point A to point B and then there's nice animations that tell you what station to get on and get off."_

**[00:23:51] Zach:** _"**the results could be nice UI, but the data collection could be just unstructured text.** That's
an ideal experience I would like."_

**[00:24:03] Zach, marking it as opinion:** _"this is just my personal opinion on it. I'm just trying to figure out if
there's a way to help you stand out from the features that you have here."_

## 00:24 Fifty-Fifty Votes, And Cognitive Load

**[00:24:15] Zach:** _"I really like Plan It Together though. **I feel like the voting part is a bit stiff**, because if
let's say this place has kind of 50-50 votes, so it's half-half - then what do you do?"_

**[00:24:44] TolongLabs:** _"Actually the owner would have to finalise it."_ A team member then jokes about a roulette.

**[00:25:01] Zach:** _"I would suggest you to think about all the stuff that requires thinking. Let's say five people
vote for this place, three people vote for another place - how do I reduce the cognitive load of choosing which place?
Could I just maybe give suggestions and then the user presses yes or no? Because **actively thinking is harder than just
deciding yes or no.**"_

**[00:25:40] Zach:** _"I wouldn't say make people dumber, but then you just want them to not think about it. You
actively give them suggestions to do yes or no on."_

## 00:26 Swipe Voting, And Hiding The Name

**[00:26:00] TolongLabs, proposing a change on the call:** _"first of all we would still keep this kind of very old
traditional type, but then when it comes to the voting session, it will be like the Tinder that you just suggested. And
hopefully we keep the name of the places really small at the bottom left corner, so that it shows you a very big picture
of the place, so you judge it by your first instinct of seeing if this place is nice and not by telling the name of the
place you are going. Is that cool?"_

**[00:26:43] Zach:** _"I think that's a nice addition to it. Yeah, I think it makes sense."_

**[00:26:55] Zach:** _"voting instead of you actively making a conscious decision... that works. It's new. It would
definitely attract the judges' attention."_

## 00:27 Vibe Based Planning

**[00:27:13] Zach:** _"if you reframe it a little bit and make it sound cooler, like let's say you say, um, **vibe based
planning** or something."_

**[00:27:28] Zach:** _"I feel like it will be something new so the judges don't get bored. Especially if these
hackathons are when you have the same problem statement for let's say **200 teams and then you only have like five
judges. They're not gonna look at every single submission.** So you have to say something that's a little bit not
usual."_

**[00:27:50] Zach:** _"you can basically build your own type of app by saying this is vibe based planning."_

## 00:28 Nine Of Twelve, And Specificity As A Strength

**[00:28:10] Zach, checking his own sheet:** _"so far I have around **12 teams that I helped mentor and around nine of
them, including you, are doing this.**"_

**[00:28:27] Zach, on what those teams scope to:** _"International. They're doing very generic, like oh, you ask for
input then give you a reference."_

**[00:28:45] Zach:** _"I think that being specific can definitely be your strength. I mean by being specific, you really
plan down to like the subway system of that country. Or maybe even just the transport culture. For example, in Malaysia
I don't really take the red taxi anymore, usually you will use Grab, or InDrive. But then as a foreigner sometimes you
might still go for the red taxi and it's probably more expensive than Grab. **So you could plan to that level of
cultural detail**, and you could definitely frame it as a strength for your app. So you're not just some generic
planner, you really drill down to the super specific stuff of that country. I think you should lean on to that."_

## 00:30 How He Won The Cursor Hackathon

**[00:30:05] Zach:** He asks whether the team went to the Cursor hackathon, then explains: _"I was one of the winners
for the hackathon and then the problem statement was very generic also... it was around how chat interfaces were very
boring, just text. How do you want to enhance the experience?"_

**[00:31:11] Zach:** _"thinking, right, like this problem statement is so broad, how could I come up with a solution
that's a little unique, that would stand out from all the other participants? And I ended up with a solution where **you
get to draw on paper or on a canvas using an iPad the UI component**, so maybe you can do a very rough sketch of how you
want a UI to look like, and then I generate 10 mocks of this hand-drawn UI, and then you can link it to Vercel v0 in
order to generate the components."_

**[00:31:57] Zach:** _"other people are doing like, you chat and stuff and then you generate the UI component, you enter
your color palettes, it's like a configurator thing. So that's boring, but then drawing it is a little different."_

**[00:33:21] Zach, on whether it was a real product:** _"my idea for drawing the UI components on a canvas, it's never
gonna work on a production app. It's actually never gonna work. It's just not feasible. **It's a hackathon, right?**"_

**[00:33:39] Zach:** _"it just looks interesting, so that's why I think I won. Lean onto that."_

## 00:32 Drawing On A Map

**[00:32:29] Zach:** _"maybe it could be like an open map, and then you guys just circle like 'oh I want to go to this
place'... and then in the background your AI will analyze what you circled and what you wrote on the canvas. Then what
you planned is new. Definitely catches the judges' attention."_

**[00:33:09] TolongLabs:** _"I think we have to rethink this a bit because we definitely need some more creativity."_

**[00:33:16] TolongLabs:** _"I think the UX could be horrible, but then it's fun to look at."_

## 00:35 The Slice Vote, And Voting As A Spectrum

**[00:35:01] TolongLabs, raising a last idea:** _"basically it's like a Fruit Ninja kind of stuff, and then a
combination of Fruit Ninja as well as the Tinder... instead of throwing the pictures away, you just swipe the pictures
into half. And the closer to the middle, it's placed at 50-50, that's like the worst vote for it. So if you're okay with
this you just draw a circle."_

**[00:36:26] Clarified:** _"how much you cut is like how much you don't like it... if you cut it in the middle 50-50
that's like you hate it the most, but then if you like it just draw a circle."_

**[00:36:52] Zach:** _"I think you brought up a really good point - like **voting doesn't have to be yes or no. You
could be like, oh, I like this place like maybe 65 percent**, you know, on a scale of zero to 100. You actually brought
up a good point on that."_

**[00:37:04] Zach:** _"I'm not sure about a slashing thing, but you can definitely think of another way to represent
zero to a hundred."_

**[00:37:18] TolongLabs:** _"I'm not sure about the slashing part either, but yeah, definitely there's a spectrum where
they can select how much they want to go."_

**[00:37:35] Zach:** _"other teams are doing yes or no, so it could be a nice differentiator."_

## 00:37 Close

**[00:37:46] Zach:** _"Any other questions?"_ - none.

**[00:37:58] Zach:** _"No worries. My Discord is always open. Feel free to message me anytime, or connect with me on
LinkedIn."_

The call ends at **[00:38:10]**.

## Quotes Most Likely To Be Cited

An index into the transcript above, not a summary. Each row is verbatim and links to where it was said.

| Quote                                                                                                                            | Timestamp |
| -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| _"around 70% of them are doing this exact topic"_                                                                                | 00:06:40  |
| _"12 teams that I helped mentor and around nine of them, including you, are doing this"_                                         | 00:28:10  |
| _"All these features right, like one to six, is stuff that people will already build"_                                           | 00:11:30  |
| _"every team is building it... it's just the way that how you represent the voting feature is what would make your app special"_ | 00:11:08  |
| _"you need a more narrow scope"_                                                                                                 | 00:08:45  |
| _"Basically you want to automate away the boring parts of traveling"_                                                            | 00:08:52  |
| _"I have to click a lot and I have to know what I want"_                                                                         | 00:17:26  |
| _"the way that you collect data. I just don't want to fill out any forms"_                                                       | 00:23:01  |
| _"the results could be nice UI, but the data collection could be just unstructured text"_                                        | 00:23:51  |
| _"reframe your solution as an opinionated framework on how to organize trips"_                                                   | 00:20:46  |
| _"I feel like the voting part is a bit stiff"_                                                                                   | 00:24:15  |
| _"actively thinking is harder than just deciding yes or no"_                                                                     | 00:25:01  |
| _"vibe based planning"_                                                                                                          | 00:27:13  |
| _"200 teams and then you only have like five judges. They're not gonna look at every single submission"_                         | 00:27:28  |
| _"you could plan to that level of cultural detail"_                                                                              | 00:28:45  |
| _"voting doesn't have to be yes or no. You could be like, oh, I like this place like maybe 65 percent"_                          | 00:36:52  |
| _"It's a hackathon, right?"_                                                                                                     | 00:33:21  |

**What is done with any of this belongs on the `research` branch**, in `docs/mentors/sessions/` and
`docs/decisions/iteration-log.md`. This file is the record of what was said, and nothing else.
