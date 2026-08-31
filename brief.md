> **This is a copy.** The canonical version lives on the `main` branch at `docs/brief.md`. If the two ever disagree,
> `main` wins. To refresh this copy, from this branch run:
>
> ```bash
> git fetch origin main && git checkout origin/main -- docs/brief.md && mv docs/brief.md brief.md && rmdir docs
> ```
>
> It is copied here so that nobody working on ideation has to switch branches to check a date or a rule.

# CodeNection 2026 - Brief

The single source of truth for event facts. Sourced from the official information page, the Kick-Off Day deck (30 Aug)
and the organiser handouts; full detail lives in [`source/`](https://github.com/TolongLabs/codenection-dev/blob/main/docs/source/). Records what the organisers stated, not our
status.

**Where the Kick-Off Day deck and the website disagree, the deck wins.** It is the later of the two and it was presented
live. Every known disagreement is listed in [Where The Sources Disagree](#where-the-sources-disagree) rather than
silently resolved.

---

## The Event

|                    |                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Name**           | CodeNection 2026, _"Where ideas turn into reality."_                                     |
| **Organised by**   | Faculty of Computing and Informatics (FCI)                                               |
| **Co-organised**   | IT Society MMU Cyberjaya                                                                 |
| **Format**         | Kick-off, then four judged phases online, then a physical Grand Finals                   |
| **Our track**      | **Track 1: Lifestyle & Personal Productivity**                                           |
| **Our team**       | TolongLabs, four members                                                                 |
| **Site**           | [itsocietymmu.com/codenection-2026](https://itsocietymmu.com/codenection-2026/)          |
| **Entry fee**      | None. A **refundable RM20 deposit per team**, returned within 3 weeks of the final round |
| **Event Director** | Alisha Sofea binti Ali                                                                   |

The deposit is forfeited if any term or condition is violated.

---

## Dates

The timeline as presented on Kick-Off Day.

| Date                  | What                                                      |
| --------------------- | --------------------------------------------------------- |
| 30 Aug                | **Kick-Off Day**, 10:30 AM - 1:00 PM, Microsoft Teams     |
| 31 Aug - 13 Sept      | **Workshop & Prototype Phase**, and the mentorship window |
| **13 Sept, 11:59 PM** | **Prototype submission deadline**                         |
| 14 - 20 Sept          | Prototype Judging Phase                                   |
| 21 Sept - 11 Oct      | Building Phase                                            |
| 12 - 31 Oct           | Deployment Phase                                          |
| 1 Nov                 | Finals Judging Day                                        |
| **15 Nov**            | **Grand Finals**, physical, venue to be announced         |

**Registration** opened 24 July, 10:00 AM and closed **29 Aug, 11:59 PM**. Team details could not be changed after that.

### Workshops

Both are online, 8:00 PM - 10:00 PM.

| Date       | Topic                     | Speaker                |
| ---------- | ------------------------- | ---------------------- |
| **2 Sept** | Claude AI                 | Anderson Ling Jing Jie |
| **5 Sept** | The New Era of Hackathons | Kim Hong Zhang         |

---

## Eligibility And Team

| Rule                  | Detail                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Who**               | Any student currently enrolled at a Malaysian university or college, any nationality. Postgraduates included |
| **Excluded**          | Members of the IT Society MMU Cyberjaya committee, the CodeNection committee, and event volunteers           |
| **Team size**         | **2 to 4 members.** More or fewer is not allowed                                                             |
| **Cross-institution** | Allowed                                                                                                      |
| **Multiple teams**    | Not allowed. One team per person for the whole competition                                                   |
| **Documents**         | Each member: a valid Student ID or confirmation letter, plus an updated resume                               |
| **Team name**         | No profane, racist, lewd or derogatory words                                                                 |
| **Changes**           | None after the registration deadline. No substitutions once the phases begin, or at the Grand Finals         |
| **Attendance**        | **Every member must be physically present at the Grand Finals.** No virtual participation, no substitutes    |
| **IP**                | Participants own their project outright. Neither the organisers nor the university claim ownership           |

**Originality.** The project must be developed **after the problem statements were released on 30 August 2026**. Code
from existing projects is not allowed, including the team's own prior work. Standard open-source libraries, frameworks
and APIs are fine. Collaboration with other registered teams or with external individuals is prohibited.

**Grounds for immediate disqualification:** plagiarism or uncredited reproduction of existing IP; unauthorised external
code without declaration; pushing major features during the Deployment Phase; collaborating with outside developers or
cross-sharing assets between competing teams; disrespectful, discriminatory or harassing behaviour; missing critical
milestone deadlines. Disqualified teams forfeit all prizes, titles and kits.

---

## Track Structure

**Two tracks. Everyone starts in Track 1.**

| Track                                          | Who Is In It                                      |
| ---------------------------------------------- | ------------------------------------------------- |
| **Track 1: Lifestyle & Personal Productivity** | Every team, for the prototype phase               |
| **Track 2: Industry**                          | Optional, for teams not selected out of Lifestyle |

**Ten finalists are selected from Lifestyle after the prototype phase.** Teams that are not selected may opt into
Industry and stay in the competition. Ten finalists per track, three winners per track: **20 finalists and 6 winners**.

### The Two Problem Statements

Pick one. Full organiser wording, including all 11 general stipulations:
[`source/problem-statements.md`](https://github.com/TolongLabs/codenection-dev/blob/main/docs/source/problem-statements.md).

| Statement                     | The Ask                                                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stress & Workload Manager** | Show a student their load across mental, time, physical, social and errand categories, then **help them rebalance it before burnout**, not merely report it |
| **Travel Planner**            | Plan a trip end to end: budget, itinerary, group preference syncing, and **re-planning when something changes mid-trip**                                    |

Both briefs end on the same note, and it is the one to design against: something people would **actually keep open on
their phone**, that is **faster and less stressful** than what they do today.

**Stipulations worth repeating:** any tech stack, any language. iOS only, Android only, or both. Web-only or mobile-only
is acceptable. Third-party APIs and paid services are allowed where a free tier or trial covers the demo, and the keys
are the team's problem. AI tools and AI features are permitted, **but the team must understand the inner workings of
what it submits**. Solutions must be deployable, not local-only.

---

## What We Submit

By **13 Sept, 11:59 PM**, via the organisers' Google Form. **The team leader submits, and only the team leader.** The
deck says to submit 15 minutes early. Late submissions are not accepted.

| #   | Deliverable                | Notes                                                                      |
| --- | -------------------------- | -------------------------------------------------------------------------- |
| 1   | **Public GitHub repo**     | With a README containing the project overview. **Public**, not private     |
| 2   | **Ideation assets**        | The mindmaps, problem trees, iteration log and mentor notes. Scored at 25% |
| 3   | **Design prototype links** | The mockups, covering the core flow end to end                             |
| 4   | **Slides**                 |                                                                            |
| 5   | **Video link**             | **3 - 5 minutes, YouTube, unlisted, titled with the team name**            |

**Every link must be viewable.** A private repo or a restricted prototype link is a zero on that deliverable, not a
request for access.

**Later phases add their own.** At the end of the Building Phase, finalists submit the GitHub repo link and the deployed
project link. At the end of the Deployment Phase, finalists also submit a user guide.

---

## How We Are Judged

The prototype rubric. Band-by-band wording, with the mark ranges:
[`source/prototype-judging-rubrics.md`](https://github.com/TolongLabs/codenection-dev/blob/main/docs/source/prototype-judging-rubrics.md).

| Weight  | Category                   | Bands                                                                                               |
| ------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| **25%** | **Ideation**               | Visual diagrams and mindmaps 8 · Iteration and idea evolution 7 · Mentor consultation 7 · Breadth 3 |
| **20%** | **Impact**                 | Problem context 5 · Target group alignment 5 · Effectiveness 7 · Reach and scalability 3            |
| **15%** | **Creativity and Novelty** | Originality 7 · Novel features or twists 5 · Differentiation 3                                      |
| **15%** | **Feasibility**            | Technical viability and stack 6 · Planning and scope realism 5 · Resource and time awareness 4      |
| **15%** | **Presentation**           | Clarity 5 · Structure and flow 4 · Delivery and confidence 4 · Engagement 2                         |
| **10%** | **Design**                 | Visual consistency 4 · Usability and UX 4 · Mockup completeness 2                                   |

**Judges' decisions are final and non-debatable.** Scoring happens after each phase; there is no running leaderboard.
Finalists are announced by email and published on the website and social channels.

**What this rubric rewards that most hackathon rubrics do not.** Ideation is the largest category and all four of its
bands score process evidence rather than output. Read the wording literally:

> "Multiple documented iterations showing how and why the idea evolved, **including dropped directions**." · "Feedback
> from mentor(s) is **clearly documented and has been meaningfully incorporated**." · "Several distinct ideas generated
> and compared before choosing, **with rationale**." · "Rich, multi-layered mapping (mindmap **plus** problem tree or
> user-flow)."

A finished idea with no trail behind it caps out around half of those 25 marks. The trail is built on the `research`
branch as the work happens.

**Feasibility is a further 15 percent and is scored on the plan, not on a build.** A concrete build plan, a realistic
scope, and a stated grasp of time, skills and cost all score during the prototype phase, before any code exists.

---

## Mentorship

**31 Aug - 13 Sept**, running alongside the prototype phase. **Seven of the 100 marks depend on using it and writing
down what came out of it.**

| Rule            | Detail                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **Booking**     | Mentors post their own slots in a shared spreadsheet and you book yourself in. First come, first served   |
| **Length**      | Up to 25 minutes per slot                                                                                 |
| **Platform**    | **Discord**, per the Kick-Off Day briefing. The website says Microsoft Teams                              |
| **Daily limit** | **Two sessions per day per team.** No cap on the total                                                    |
| **Format**      | Private, one team to one mentor. Teams pick their preferred mentor when booking                           |
| **Expertise**   | Each mentor lists a domain - AI, web, mobile, UX, pitching. Pick the one who matches what you need        |
| **Etiquette**   | Be punctual. Do not edit another team's slot. Release a slot at least 2 hours ahead if you cannot make it |

Mentors are not assigned to teams. **They will not design your solution or write code for you** - they ask questions and
challenge your thinking. Asking whether a scope is too ambitious is exactly what they are for. Good slots go fast, so
book early.

### Mentors

| Name               | Role And Credentials                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Teh Ming En        | Cloud Application Development at Intel · MSc Data Science USM · Champion, AI Tinkerers Hackathon    |
| Faris Imran        | Data Scientist at Grab · UM Hackathon 2026 1st runner-up · Top 3, Lovable Vibeathon                 |
| Lim Zi Yang        | Founder of UMscout and Ymage · Champion, UM Technothon 2025                                         |
| Jarod Tan          | AI Solution Architect at Annata · CompTIA Security+ · AWS Certified AI Practitioner                 |
| Janelle Tan        | Product Design Intern at Cleve · UM Hackathon 2026 1st runner-up · Ex-Co-President, Hackerspace MMU |
| Kueh Pang Teng     | Ex-intern at iFast · Multiple hackathon winner                                                      |
| Khor Jia Quan      | Software Engineer at Intel · Champion, CodeNection 2024                                             |
| Iris Yan Ning      | Software Engineer at CoinGecko · Judge, Google Workspace Hackathon                                  |
| Zach Khong         | Full Stack Engineer at Solana Foundation · Won Cursor x Anthropic Hackathon                         |
| Teng Wei Herr      | Frontend Engineer at Binance · Won Cursor x Anthropic Hackathon                                     |
| Varsha Selvakumar  | Ex-Program Manager Intern at Grab · 5x hackathon finalist · UMH 2026 1st runner-up                  |
| Sim Hong Bing      | 19x hackathon wins · Co-Founder and Vice President, AI Hackerdorm                                   |
| Lau Wei Han        | Digital Analyst at Bank Negara Malaysia · Ex-President USMCS · USM valedictorian                    |
| Mah Qing Fung      | Champion, NexG GodamLah 2.0 · **CodeNection 2025 Champion** · 5x hackathon winner                   |
| Daniel Koh Yu Hang | Java Backend Engineer Intern at Ant International · V Hack 2026 Champion                            |
| Looi Wei En        | Mobile Engineer at MoneyLion · Hibiscus Petroleum Berhad scholarship holder                         |
| Yeong Chiau Wen    | AI Engineer · Ex-lecturer at MMU · 6x hackathon and invention competition winner                    |
| Zhu Heng Chua      | Yayasan Sime Darby scholar · V Hack 2026 Champion · UM Technothon Vice Director                     |

### Judges Revealed At Kick-Off

| Name                  | Role And Credentials                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Tan Szu Jean          | Graduate Software Engineer at SEEK Asia · Ex-QA Intern at PayNet                                           |
| Muhammad Fathy Rashad | ML Engineer, Co-founder and CTO at Cleve · 5x hackathons won · **15x hackathons judged**                   |
| Sean Hoe Kai Zher     | Software Engineer at Teel · Ex-APU Hackthletes · President, Superteam Malaysia                             |
| Terry Ong Kok Donq    | Full-Stack Software Engineer at FinKnight · Student winner, ASEAN AI Buildathon 25 · 6x hackathon finalist |

---

## Prizes

Per the Kick-Off Day deck. Awarded per track, and there are two tracks.

| Award                | Quantity | Per Track | Total       |
| -------------------- | -------- | --------- | ----------- |
| **1st Place**        | 2        | RM2,000   | RM4,000     |
| **2nd Place**        | 2        | RM1,000   | RM2,000     |
| **3rd Place**        | 2        | RM500     | RM1,000     |
| **Best Female Team** | 1        | RM250     | RM250       |
| **Grand total**      |          |           | **RM7,250** |

**Everyone who registers and submits gets a digital certificate of participation.** Finalists who attend the physical
final round receive a CodeNection Kit: event shirt, tote bag, lanyard, badge and sticker. An extra goodie goes to
finalists who submitted a resume at registration.

---

## Grand Finals

**15 November 2026.** Venue to be announced.

- **Every member attends in person.** No virtual participation, no substitutions
- **Each team pitches once, for no more than 15 minutes: 10 minutes pitching plus 5 minutes of judges' questions**
- Bring your own laptops, chargers and extension cords. Wi-Fi is provided; **bring a mobile hotspot as backup**

---

## Rulings From The Kick-Off Day Q&A

Answered live on 30 August and recorded in [`source/kickoff-day-transcript.md`](https://github.com/TolongLabs/codenection-dev/blob/main/docs/source/kickoff-day-transcript.md).
Several of these are not written down anywhere else, and one of them changes what the prototype phase is.

### The Prototype Phase Has No Code In It

> **"Do we have to start coding our prototype for the prototype phase?"** - _"No, no. Prototype phase is just your idea
> and your UI. You'll build the app after prototype phase."_

> _"It's enough to just have Figma or Canva or HTML static sites just to show the UI of your app."_ · _"Your prototype
> can be as polished or as rough as you can manage. A Figma prototype is great, but wireframes drawn on paper are fine
> too. What matters is that you communicate your idea clearly."_

And the line that ranks everything else:

> **"A beautiful prototype with no documented process will lose to a paper wireframe with a well documented journey."**
> · _"Ideation plus impact is 45 percent of your score. That's before anyone looks at how pretty your app is."_ ·
> _"Document everything from day one. Every sketch, every dead end, every mentor chat."_

### Track And Problem Statement

| Question                                                        | Ruling                                                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Can a team pick both problem statements?**                    | No. Pick one. There is no provision for one team to submit to two                         |
| **Can a team enter multiple tracks?**                           | No                                                                                        |
| **When is the Industry track revealed?**                        | On **21 September**, alongside the Lifestyle finalists. It has its own problem statements |
| **If we are selected in Lifestyle, can we switch to Industry?** | No, not unless you voluntarily forfeit your place                                         |
| **How many teams are competing for the 10 slots?**              | _"There are 200 groups, I think 200 plus. 10 will be selected"_                           |

### Build And Submission

| Question                                          | Ruling                                                                                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must the solution be a mobile app?**            | No. Web app or browser-based mobile app is accepted - **but expect to be asked why**, and have an answer that follows from the features                                          |
| **Can we use AI or vibe-code it?**                | Yes, _"as long as you understand what exactly the AI has generated"_                                                                                                             |
| **What does "documenting" mean?**                 | _"Screenshots of a mind map showing that you had idea one, idea two, but you decided to scrap idea two because it's not feasible"_                                               |
| **Short video or screenshots for documentation?** | Screenshots. **Only one video is submitted**, the YouTube one                                                                                                                    |
| **What is the submission format?**                | A Google Form that takes **the GitHub repo link**. Everything else - the YouTube link, the design links, the screenshots - **goes in the repo's README**                         |
| **What goes in the video?**                       | _"Mainly explaining your solution project."_ Make it engaging, tell them the features, **and mention your tech stack**. The ideation detail belongs in the README, not the video |
| **Is travel to the finals sponsored?**            | No. _"We don't really have any allocations for sponsoring finalists to come physically to Cyberjaya"_                                                                            |

### What Each Rubric Category Actually Wants

Restated by the Head of Division of Competition while presenting the rubric:

| Category         | In Their Words                                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ideation**     | _"It's not about your app. It's about your thinking."_ Diagrams, the idea changing over time and why, mentor feedback written down and what changed because of it, and evidence you looked at a few ideas first |
| **Impact**       | _"Name a specific user, not just all students, and then show the before and after, life without your app and life with it. If you can't say that in a sentence, you should fix that first"_                     |
| **Creativity**   | _"Judges will have seen a lot of to-do apps and trip planners."_ A fresh angle, a feature or two that stands out, and a clear answer to why this beats what exists                                              |
| **Feasibility**  | _"This one rewards your honesty. Pick a stack that you can justify, scope an MVP that you can actually build, and be upfront about your limits"_                                                                |
| **Presentation** | _"This is the video demo and is how judges will meet your project"_                                                                                                                                             |
| **Design**       | _"A consistent look across screens, easy to use with a tutorial, and the core flow covered end to end"_                                                                                                         |

### Finals Judging Day, 1 November

Participants do not attend. It exists _"merely for judges to take their time to try to deploy products"_ - that is, to
sit with the deployed apps before the Grand Finals.

---

### Partners And Sponsors, As Named On The Day

| Role                      | Named                                        |
| ------------------------- | -------------------------------------------- |
| **Co-organizing partner** | MetaLearning                                 |
| **Venue sponsor**         | Cyberview                                    |
| **Merchandise sponsor**   | "Prentices" (spelling unverified from audio) |

---

## Where The Sources Disagree

The website was not updated after Kick-Off Day. Recorded so nobody re-derives these later.

| Fact                    | Website Says                                                         | Kick-Off Deck Says                                    | Use                                                                             |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Prototype phase**     | 7 - 13 Sept                                                          | 31 Aug - 13 Sept, alongside the workshops             | **The deck**                                                                    |
| **Judging phases**      | Not shown                                                            | Prototype judging 14 - 20 Sept; Finals judging 1 Nov  | **The deck**                                                                    |
| **Deployment phase**    | 12 - 31 Oct                                                          | 12 - 31 Oct                                           | Agree                                                                           |
| **Finalist count**      | "Top 40 teams, 10 per track", implying four tracks                   | Two tracks, 10 per track, 20 finalists, 6 winners     | **The deck**                                                                    |
| **Prize pool**          | RM11,350 total                                                       | RM7,250 across competitive categories                 | **The deck**, for the award table. The gap is presumably non-competitive awards |
| **Video length**        | "Not exceeding 5 minutes"                                            | **3 - 5 minutes**, YouTube, unlisted, named by team   | **The deck**, which sets a floor as well as a ceiling                           |
| **Mentor slot**         | "20 to 25 minutes"                                                   | "Shall not exceed 25 minutes"                         | Treat 25 as the ceiling                                                         |
| **Mentorship platform** | Microsoft Teams                                                      | Discord, per the Kick-Off Day briefing                | **Discord**, and watch the channel for a correction                             |
| **Mentor booking**      | "Official Google Sheet provided by the organizers"                   | Mentors post slots in a shared spreadsheet themselves | Same mechanism, no practical difference                                         |
| **Final round venue**   | Agmo Space, FCM, MMU Cyberjaya for the final round; Grand Finals TBA | Grand Finals venue TBA                                | Both say TBA for 15 Nov                                                         |

---

## Channels

| Channel             | Use                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Discord**         | [discord.gg/G9SWJntWhy](https://discord.gg/G9SWJntWhy). The main channel. Open a ticket for help |
| **Email**           | ask.codenection@gmail.com                                                                        |
| **Instagram**       | [@code_nection](https://www.instagram.com/code_nection)                                          |
| **Official site**   | [itsocietymmu.com/codenection-2026](https://itsocietymmu.com/codenection-2026/)                  |
| **Microsoft Teams** | Workshops, briefings and mentorship sessions                                                     |

---

## Post-Event

The organisers explicitly encourage continued development after the hackathon, and say **special recognition goes to
projects still actively maintained at future CodeNection events.** User feedback may be gathered through GitHub Issues,
an in-app contact form, or any similar verifiable channel.
