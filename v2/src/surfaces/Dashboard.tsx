import { Link } from 'react-router-dom'
import { Info } from '../components/Ui'
import { dayLabel, money } from '../lib/format'
import { tripCostRM } from '../lib/repair'
import { useTrip } from '../state'
import './Dashboard.css'

/**
 * Where everything starts. The prototype used to open on a finished trip, which showed the payoff and hid the
 * mechanism that earns it. Nothing here is a feature: it is the door.
 */
export const Dashboard = () => {
  const { trip } = useTrip()
  const open = trip.days.flatMap((d) => d.slots).filter((s) => s.state === 'open').length
  const last = trip.days[trip.days.length - 1]

  return (
    <main className="dash">
      <header className="dash-head">
        <p className="t-label dash-mark">Perch</p>
        <h1 className="t-display">Your Trips</h1>
      </header>

      <Link className="dash-new" to="/new">
        <span className="dash-new-plus" aria-hidden="true">
          +
        </span>
        <span className="dash-new-body">
          <span className="t-name">Start A New Plan</span>
          <span className="t-specimen">Three questions, then Perch proposes the whole thing</span>
        </span>
      </Link>

      <section className="dash-list" aria-label="Trips">
        <p className="t-label dash-kicker">
          In Progress
          <Info>
            One trip, because this is a prototype. A real account would list the ones you have taken underneath, and the
            finished book is what you would keep.
          </Info>
        </p>

        <Link className="dash-trip" to="/desk">
          <span className="dash-strip" aria-hidden="true">
            {trip.days.map((d) => (
              <span key={d.index} data-day={d.tint} />
            ))}
          </span>

          <span className="dash-trip-body">
            <span className="t-name">{trip.destination}</span>
            <span className="t-specimen">
              {dayLabel(trip.startDate)} &ndash; {dayLabel(last?.date ?? trip.startDate)} &middot; {trip.days.length}{' '}
              days &middot; {trip.party.length} people
            </span>
          </span>

          <span className="dash-trip-meta">
            <span className="t-label">{money(tripCostRM(trip))}</span>
            <span className="t-specimen">{open === 0 ? 'Settled' : `${open} still open`}</span>
          </span>
        </Link>
      </section>

      <section className="dash-shared" aria-label="Opened From A Link">
        <p className="t-label dash-kicker">
          Someone Sent You A Link
          <Info>
            The link is the trip. It opens as a magazine with the undecided parts marked, and needs no account.
          </Info>
        </p>
        <Link className="dash-shared-cta t-label" to={`/t/${trip.id}`}>
          Open The Book As A Guest
        </Link>
      </section>
    </main>
  )
}
