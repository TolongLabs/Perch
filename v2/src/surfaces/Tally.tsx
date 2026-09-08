import { useNavigate } from 'react-router-dom'
import { CopyLink } from '../components/CopyLink'
import { StateChip } from '../components/StateChip'
import { Heading } from '../components/Ui'
import { Voters } from '../components/Voters'
import { duration, price } from '../lib/format'
import { isJoiner } from '../lib/joiner'
import { CLUSTER_AREA } from '../lib/schedule'
import { tallyFor } from '../lib/votes'
import { useTrip } from '../state'
import './Tally.css'

export const Tally = () => {
  const navigate = useNavigate()
  const { trip } = useTrip()
  const tally = tallyFor(trip)
  const joiner = isJoiner()

  const places = Object.keys(trip.options).length

  // Named, not counted. A Must Go says who wants this, and "2 Must Gos" says nothing a percentage does not.
  const mustNames = (ids: string[]) =>
    ids.map((id) => trip.party.find((p) => p.id === id)?.name).filter((n): n is string => !!n)

  // The trip id is the invite code: the link carries it, and there is no separate code field in the model.
  const inviteUrl = `${window.location.origin}/t/${trip.id}/swipe`

  return (
    <main className="tally">
      <Heading
        as="h1"
        info="A yes is one vote, and the trip owner's is one and a half, so with four of you her yes alone is 33 percent. A place nobody has swiped yet counts as nothing rather than as a no."
      >
        <span className="t-display">The Tally</span>
      </Heading>

      <section className="tally-block" data-state="open">
        <p className="t-label tally-legend">Who Has Voted</p>
        <Voters party={trip.party} votes={trip.votes} places={places} ownerId={trip.ownerId} />
        <p className="t-specimen">Someone who has not finished is not a no. Their unswiped places count as nothing.</p>
      </section>

      <section className="tally-block" data-state="open">
        <p className="t-label tally-legend">The Invite</p>
        <div className="tally-invite">
          <code className="tally-code">{inviteUrl}</code>
          <CopyLink url={inviteUrl} />
        </div>
        <p className="t-specimen">Anyone who opens this lands on the reels. No account, no onboarding.</p>
      </section>

      <section className="tally-rows">
        <p className="t-label tally-legend tally-rows-legend">The Running Order</p>
        <ul>
          {tally.map((entry) => {
            const place = trip.options[entry.placeId]
            if (!place) return null
            return (
              <li
                key={entry.placeId}
                className="tally-row"
                data-state={entry.unanimous ? 'gold' : undefined}
                data-out={entry.eliminated}
              >
                <div className="tally-top">
                  <p className="t-name tally-name">{place.name}</p>
                  <div className="tally-verdict">
                    <p className="tally-pct">{entry.percentage}%</p>
                    {entry.unanimous && <StateChip state="gold">Unanimous</StateChip>}
                    {mustNames(entry.mustBy).length > 0 && (
                      <StateChip state="decided">Must Go · {mustNames(entry.mustBy).join(', ')}</StateChip>
                    )}
                    {entry.eliminated && <StateChip state="at-risk">Eliminated</StateChip>}
                  </div>
                </div>
                {/* Full width under the name, where a specimen line belongs, rather than sharing the row with a
                    percentage and a chip that squeeze it into a column. */}
                <p className="t-specimen tally-line">
                  {CLUSTER_AREA[place.cluster]} · {duration(place.dwellMin)} · {price(place)}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      {joiner ? (
        <p className="t-specimen tally-wait">Waiting for the trip owner to shape the days.</p>
      ) : (
        <button type="button" className="tally-go t-label" onClick={() => navigate('/desk')}>
          Open The Desk
        </button>
      )}
    </main>
  )
}
