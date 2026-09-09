import { useNavigate } from 'react-router-dom'
import { CopyLink } from '../components/CopyLink'
import { Heading, Info } from '../components/Ui'
import { Voters } from '../components/Voters'
import type { Trip } from '../data/types'
import { dayLabel } from '../lib/format'
import { finishedMembers, hasFinished, tallyFor, votedIn } from '../lib/votes'
import { useTrip } from '../state'
import './Dashboard.css'

type TripState = 'setup' | 'voting-mine' | 'voting-group' | 'planned' | 'needs-review'

/**
 * The five states in `TRD.md`'s Trip States table, derived from the trip rather than stored, so this card cannot
 * disagree with the data it is showing.
 *
 * "A vote or member changed after the last Apply" has no timestamp to read, and does not need one: what makes a
 * plan stale is that it disagrees with the votes, which is visible in the trip itself. A place sitting in a day
 * that no longer clears the inclusion threshold is exactly that disagreement, and removing a member or changing a
 * vote is how it comes about, since both move the percentages every placed stop was chosen on.
 */
export const tripState = (trip: Trip): TripState => {
  const owner = trip.party.find((p) => p.id === trip.ownerId)
  if (trip.nights < 1 || (owner?.name.trim().length ?? 0) === 0) return 'setup'
  if (!hasFinished(trip, trip.currentMemberId)) return 'voting-mine'
  if (finishedMembers(trip).length < trip.party.length) return 'voting-group'
  if (!trip.days.every((d) => d.feasibility !== null)) return 'voting-group'
  const standing = new Set(votedIn(tallyFor(trip)).map((t) => t.placeId))
  const placed = trip.days.flatMap((d) => d.slots.map((s) => s.placeId)).filter((id): id is string => id !== null)
  return placed.every((id) => standing.has(id)) ? 'planned' : 'needs-review'
}

/**
 * The door. One trip, because this is a prototype, and everything the group needs to get into the flow: who has
 * swiped, the link to send them, and the one action that is next.
 */
export const Dashboard = () => {
  const navigate = useNavigate()
  const { trip } = useTrip()

  const places = Object.keys(trip.options).length
  const mine = trip.votes[trip.currentMemberId] ?? {}
  const swiped = Object.values(mine).filter((v) => v !== null).length
  const state = tripState(trip)
  const voting = state === 'voting-mine' || state === 'voting-group'
  const finished = finishedMembers(trip).length
  const last = trip.days[trip.days.length - 1]
  const inviteUrl = `${window.location.origin}/t/${trip.id}/swipe`

  return (
    <main className="dash">
      <header className="dash-head">
        <p className="t-label dash-mark">Perch</p>
        <h1 className="t-display">Your Trips</h1>
      </header>

      <section className="dash-trip" aria-label="Tokyo">
        <span className="dash-strip" aria-hidden="true">
          {trip.days.map((d) => (
            <span key={d.index} data-day={d.tint} />
          ))}
        </span>

        <div className="dash-lead">
          <Heading as="h2">{trip.destination}</Heading>
          <p className="t-specimen">
            {dayLabel(trip.startDate)} &ndash; {dayLabel(last?.date ?? trip.startDate)} &middot; {trip.days.length} days
            &middot; {trip.party.length} people
          </p>
          <p className="dash-note">Four days, three nights, one day of annual leave tagged onto a weekend.</p>
        </div>

        {voting && (
          <p className="t-label dash-status">
            The Deck
            <span className="dash-count">
              {swiped} Of {places} Reels Swiped
            </span>
          </p>
        )}

        {/* Only where it says something. Once the days are planned the group's progress is behind them, and a card
            that still leads with a swipe count is answering a question nobody is asking any more. */}
        {state === 'voting-group' && (
          <p className="dash-progress">
            You have finished &middot; {finished} of {trip.party.length} have finished
          </p>
        )}

        {state === 'needs-review' && (
          <p className="dash-progress" data-state="at-risk">
            Votes changed since the days were planned. Open The Desk and Optimize Plan to rebuild them.
          </p>
        )}

        {voting && (
          <div className="dash-group">
            <p className="t-label dash-legend">
              Who Has Voted
              <Info>
                Farah, Hana and Iman swiped when Aisyah sent the link. A member part way through has said nothing about
                the places they have not reached, and those count as nothing rather than as a no.
              </Info>
            </p>
            <Voters party={trip.party} votes={trip.votes} places={places} ownerId={trip.ownerId} />
          </div>
        )}

        {/* The link is for getting answers, so it goes once the answers are in. */}
        {voting && (
          <div className="dash-group">
            <p className="t-label dash-legend">The Invite</p>
            <div className="dash-invite">
              <code className="dash-code">{inviteUrl}</code>
              <CopyLink url={inviteUrl} />
            </div>
          </div>
        )}

        {/* One solid button, and it is the state's own next step. A planned trip has three ways on rather than one,
            because there is no next step left to name: the days exist and the reader chooses where to go. */}
        {state === 'setup' && (
          <button type="button" className="dash-go t-label" onClick={() => navigate('/new')}>
            Finish Setup
          </button>
        )}

        {state === 'voting-mine' && (
          <button type="button" className="dash-go t-label" onClick={() => navigate(`/t/${trip.id}/swipe`)}>
            Open The Deck
          </button>
        )}

        {state === 'voting-group' && (
          <button type="button" className="dash-go t-label" onClick={() => navigate(`/t/${trip.id}/votes`)}>
            View Current Tally
          </button>
        )}

        {(state === 'planned' || state === 'needs-review') && (
          <div className="dash-ways">
            <button type="button" className="dash-go t-label" onClick={() => navigate('/desk')}>
              Open The Desk
            </button>
            <button type="button" className="dash-way t-label" onClick={() => navigate('/desk/before-we-go')}>
              Before We Go
            </button>
            <button type="button" className="dash-way t-label" onClick={() => navigate(`/t/${trip.id}`)}>
              The Book
            </button>
          </div>
        )}
      </section>

      {/* Not New Plan. The prototype holds one trip, so there is nothing to start; this reopens the one that
          exists, with everything it already knows filled in. */}
      <button type="button" className="dash-new t-label" onClick={() => navigate('/new?edit')}>
        Edit Trip
      </button>
    </main>
  )
}
