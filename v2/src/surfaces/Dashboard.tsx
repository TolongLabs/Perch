import { useNavigate } from 'react-router-dom'
import { CopyLink } from '../components/CopyLink'
import { Heading, Info } from '../components/Ui'
import { Voters } from '../components/Voters'
import { dayLabel } from '../lib/format'
import { finishedMembers } from '../lib/votes'
import { useTrip } from '../state'
import './Dashboard.css'

/**
 * The door. One trip, because this is a prototype, and everything the group needs to get into the flow: who has
 * swiped, the link to send them, and the one action that is next.
 */
export const Dashboard = () => {
  const navigate = useNavigate()
  const { trip } = useTrip()

  const places = Object.keys(trip.options).length
  const swiped = Object.values(trip.votes[trip.ownerId] ?? {}).filter((v) => v !== null).length
  const done = swiped === places
  // The owner being finished is not the group being finished, and the button should not say it is: an order read
  // while three of four have answered is a running total, not a result.
  const allIn = finishedMembers(trip).length === trip.party.length
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

        <p className="t-label dash-status">
          The Deck
          <span className="dash-count">
            {swiped} Of {places} Reels Swiped
          </span>
        </p>

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

        <div className="dash-group">
          <p className="t-label dash-legend">The Invite</p>
          <div className="dash-invite">
            <code className="dash-code">{inviteUrl}</code>
            <CopyLink url={inviteUrl} />
          </div>
        </div>

        {/* The screen's one solid button, and the only thing on this card that moves you forward. Where it goes
            depends on whether the owner still has reels left. */}
        <button
          type="button"
          className="dash-go t-label"
          onClick={() => navigate(done ? `/t/${trip.id}/votes` : `/t/${trip.id}/swipe`)}
        >
          {done ? (allIn ? 'See The Tally' : 'View Current Tally') : 'Open The Deck'}
        </button>
      </section>

      <button type="button" className="dash-new t-label" onClick={() => navigate('/new')}>
        New Plan
      </button>
    </main>
  )
}
