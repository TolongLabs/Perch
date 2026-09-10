import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CopyLink } from '../components/CopyLink'
import { PlateThumb } from '../components/PlateThumb'
import { StateChip } from '../components/StateChip'
import { Heading } from '../components/Ui'
import { Voters } from '../components/Voters'
import { duration, price } from '../lib/format'
import { isJoiner } from '../lib/joiner'
import { CLUSTER_AREA } from '../lib/schedule'
import { finishedMembers, INCLUSION_PERCENT, tallyFor } from '../lib/votes'
import { useTrip } from '../state'
import './Tally.css'

export const Tally = () => {
  const navigate = useNavigate()
  const { trip, endVoting } = useTrip()
  const tally = tallyFor(trip)
  const joiner = isJoiner()
  const closed = trip.votingClosedAt !== null

  const places = Object.keys(trip.options).length
  const waiting = trip.party.length - finishedMembers(trip).length
  const canEnd = !closed && !joiner && trip.currentMemberId === trip.ownerId

  const mustMembers = (ids: string[]) =>
    ids.flatMap((id) => {
      const member = trip.party.find((person) => person.id === id)
      return member ? [member] : []
    })

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

      <section className="tally-block" data-state={closed ? 'decided' : 'open'}>
        <p className="t-label tally-legend">{closed ? 'Voting Closed' : 'Who Has Voted'}</p>
        <Voters party={trip.party} votes={trip.votes} places={places} ownerId={trip.ownerId} />
        <p className="t-specimen">
          {closed
            ? 'This tally is final. Votes are frozen, and every unanswered reel became Skip when voting closed.'
            : waiting > 0
              ? `This order is provisional while ${waiting === 1 ? 'one person is' : `${waiting} people are`} still swiping. Partial ballots already count, while unanswered reels add no support and still remain in the full-party total.`
              : 'Everyone has answered, so this order is final until someone changes their mind or the owner closes voting.'}
        </p>
        {!closed && (
          <p className="t-specimen tally-local">
            This browser checks the deadline while the app is open and closes voting one day before the trip at midnight
            Tokyo time. It is browser-local prototype behavior, not a background service.
          </p>
        )}
        {canEnd && (
          <button type="button" className="tally-end t-label" onClick={endVoting}>
            End Voting Session
          </button>
        )}
      </section>

      {!closed && (
        <section className="tally-block" data-state="open">
          <p className="t-label tally-legend">The Invite</p>
          <div className="tally-invite">
            <code className="tally-code">{inviteUrl}</code>
            <CopyLink url={inviteUrl} />
          </div>
          <p className="t-specimen">Anyone who opens this lands on the reels. No account, no onboarding.</p>
        </section>
      )}

      <section className="tally-rows">
        <p className="t-label tally-legend tally-rows-legend">The Running Order</p>
        <div className="tally-rule">
          <p className="t-label">Voted In Rule</p>
          <p className="t-specimen">
            A place is Voted In when its displayed weighted support rounds to {INCLUSION_PERCENT}% or more and it is not
            eliminated. The full party stays in the denominator, including Skip, no and unanswered reels. Must Go counts
            as that person’s Yes; its extra half point changes rank only and never increases the support percentage.
          </p>
        </div>
        <ul>
          {tally.map((entry) => {
            const place = trip.options[entry.placeId]
            if (!place) return null
            const mustVoters = mustMembers(entry.mustBy)
            return (
              <li
                key={entry.placeId}
                className="tally-row"
                data-state={entry.unanimous ? 'gold' : undefined}
                data-out={entry.eliminated}
              >
                <PlateThumb place={place} />
                <div className="tally-body">
                  <div className="tally-top">
                    <div className="tally-destination">
                      <p className="t-name tally-name">{place.name}</p>
                      {mustVoters.length > 0 && (
                        <span className="tally-musts">
                          {mustVoters.map((voter) => (
                            <span
                              key={voter.id}
                              className="tally-must"
                              data-must-heart
                              data-must-voter={voter.id}
                              role="img"
                              aria-label={`Must Go by ${voter.name}`}
                              title={`Must Go by ${voter.name}`}
                            >
                              <Heart size={18} strokeWidth={2} aria-hidden="true" />
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    <div className="tally-verdict">
                      <p className="tally-pct">{entry.percentage}%</p>
                      {entry.unanimous && <StateChip state="gold">Unanimous</StateChip>}
                      {entry.eliminated && <StateChip state="at-risk">Eliminated</StateChip>}
                    </div>
                  </div>
                  <p className="t-specimen tally-line">
                    {CLUSTER_AREA[place.cluster]} · {duration(place.dwellMin)} · {price(place)}
                  </p>
                </div>
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
