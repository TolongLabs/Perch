# Perch v2 Rebuild Plan, 8 September 2026

The team verdict after mentor session 1. Everything below is the spec the GitHub issues are drafted from.

## The Product In One Line

A group trip planner where the group swipes on reels of places, the owner drags what won onto a three-slot-a-day
calendar, a heuristic scheduler orders each day and colours it by how well the route holds, and the finished trip prints
as The Book, a field-guide-style keepsake.

## The Demo

Persona: Aisyah, 24, KL, plans the trip for her three university friends Farah, Hana and Iman. Trip: Tokyo, four days,
three nights, one day of annual leave tagged onto a weekend. The video is 3 to 5 minutes and walks one path: sign in,
new plan, swipe, see the votes, drag the calendar, apply, checklist, book.

One city only in the demo. The data model carries legs (a leg is one city and a run of consecutive days, with a fixed
transfer block between legs) so multi-area Japan is a README claim backed by a type, not a screen.

## The Flow And The Routes

| Route | Surface | Register | Status |
| --- | --- | --- | --- |
| / | Landing | Desk | Built, keep |
| /sign-in | Sign In, guest only | Desk | Built, keep |
| /trips | Dashboard | Desk | Built, re-fixture for Tokyo, add invite code and who has voted |
| /new | Onboarding: dates, activities, destination, free text | Desk | New. Replaces NewPlan and Interview |
| /t/:tripId/swipe | The Deck: swipe on reel cards | Desk | New. Joiners land here from the invite link and skip onboarding |
| /t/:tripId/votes | The Tally: percentage per place, unanimous gold, zero greyed and eliminated | Desk | New |
| /desk | The Desk: 4 days x 3 slots calendar, sidebar of voted-in cards, Apply, pins, feasibility colours | Desk | Rebuilt |
| /desk/before-we-go | Checklist derived from the trip; all ticked enables Print The Book | Desk | New |
| /t/:tripId | The Book, printed state only | Book | Built, re-fixture for Tokyo, one plate per day, Maps deep link per day |

Old surfaces Interview and the current Desk body are deleted, not kept behind a flag.

## Rules That Shape Every Screen

1. Three slots per day: morning, afternoon, evening. No free-time dragging. Cards drop into slots.
2. The trip is valid with zero group input: the owner's swipes alone produce a plan.
3. Owner priority: the owner's swipe carries 1.5 weight in the tally, and the owner can pin a card to a day and slot; the scheduler never moves a pinned card.
4. Deleting a card from the calendar opens the Perch drawer offering the next-ranked voted-in card for that slot, so the trip cannot empty. Each day keeps at least two stops.
5. Feasibility per day: green when every stop fits its hours and the day's travel plus dwell fits 09:00 to 21:00; gold when it fits but the order is more than 25 percent slower than the scheduler's order; red when a stop is outside its hours or the day overruns.
6. A date change regenerates the calendar; votes survive because they are on places. A destination change is a new plan.
7. The scheduler is a heuristic, never called AI in the UI copy: cluster by area per day, order by best period and opening hours, nearest neighbour within the day. Any AI-written text is a rationale sentence, not a decision.
8. No network call on stage. Reels are served from a public GCS bucket as small MP4s; everything else is a committed fixture.

## Data

- 24 Tokyo places across four clusters, one cluster per demo day: Asakusa and Ueno; Shibuya, Harajuku and Shinjuku; Tsukiji, Ginza and Tokyo Station; Odaiba, Toyosu and teamLab. Each place: id, name, kind, cluster, lat, lng, travel matrix row in minutes by transit, dwell minutes, cost in RM with yen on the specimen line, opens, closes, closedOn, bestPeriod, tags, blurb, reel.
- A reel per place: src, poster, platform (instagram or xhs), credit handle, source URL. Fetched with scripts/reels/fetch.sh from URLs the team collects in their own Instagram and Xiaohongshu accounts, cut to 8 seconds, muted, 540x960, uploaded to gs://perch-reels. 24 needed, 4 spares.
- Votes fixture: Farah, Hana and Iman have already swiped so the tally has percentages the moment Aisyah finishes. At least two places must be unanimous and at least two must be zero.
- Travel matrix: 24 x 24 transit minutes, hand-authored from Google Maps transit estimates, committed.
- Checklist fixture derived from the trip: passport validity, Suica or Welcome Suica, teamLab ticket booked, yen cash, travel insurance, JR pass not needed for Tokyo-only.

## Design System, From docs/DESIGN.md

Field guide, not travel brochure. Two registers: The Desk is an instrument (paper #FBF8F2, Quicksand only, radius 24 or 999 and nothing between, pill buttons, one solid button per screen); The Book is a plate (plate #F2EDE0, zero radius, Newsreader prose). Ink #2E261F, never #000. State tokens: --open #1B7F86, --decided #3E7A3A, --at-risk #C0342F. Five day tints --day-1 to --day-5, each a named Malaysian bird. Sections separated by tinted ground, never lines; no shadows; 3px outlines; 4px spacing base; left aligned always; tabular numerals; labels 12/700 uppercase; specimen lines in Newsreader italic 13. Captions live in an info tooltip beside the heading. Nothing native is left browser-styled: the date picker, checkboxes and range controls are drawn. Motion: the perch step-forward is the one branded mechanic; everything else is a 120ms cross-fade; prefers-reduced-motion respected.

New for this rebuild, to be added to DESIGN.md: one new token --gold, Black-naped Oriole, Oriolus chinensis, about #E8A317, used on The Tally for unanimous places and on The Desk for a day that fits but runs slow; the reel card spec (9:16, radius 24, muted autoplay loop, name and specimen line small in the bottom-left, creator handle and platform in the bottom-right, video mounted only for the top two cards); the calendar drag as the fourth sanctioned motion (a card flies into its slot on Apply, 40ms stagger, same easing as the perch).

## UI Text

TitleCase for nav items, buttons, section headings, card titles, table headers, tab labels, form labels. Sentence case for body copy, helper text, placeholders, errors, empty states.

## Docs To Update

PRODUCT.md, PRD.md, TRD.md are written around the previous concept (a bench that repairs a trip, Yogyakarta). They are rewritten toward this plan. TRD section on stack states: Vite React TypeScript frontend; no backend in the prototype; build phase adds Supabase for auth, votes and realtime; places seeded from OpenStreetMap, Wikidata and Wikimedia Commons, not Google Places, whose terms cap caching at 30 days and forbid storing photos; Google only for Maps deep links and a Routes call; an LLM only for parsing free text intent and writing rationale sentences; Cloud Run hosting. AGENTS.md still describes a two-branch model with a research branch; the notebook now lives in docs/research/ on main and AGENTS.md must say so.
