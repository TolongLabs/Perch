import { Check } from 'lucide-react'
import type { Trip } from '../data/types'
import { standingLine, standings } from '../lib/presence'
import './Presence.css'

/**
 * Who else is on the deck, and where each of them has got to. A shared document shows you the other cursors, and
 * voting on a trip is the same problem: the owner swipes alone on her own screen with no sign that three other
 * people are answering the same reels.
 *
 * Every mark here is read from the votes, which is what the Tally reads. A strip that animated activity the data
 * says is finished would be the same lie as a drawer saying nothing is left while cards wait in the pool.
 */
export const Presence = ({ trip, reels }: { trip: Trip; reels: number }) => {
  const standing = standings(trip, reels)
  const line = standingLine(standing)
  if (!line) return null

  const owner = trip.party.find((p) => p.id === trip.ownerId)

  return (
    <aside className="presence">
      {/* The owner first, so the reader finds herself in the same place every time she looks, and then the party's
          own order. Not a live region: the marks change when a vote lands, and announcing that would talk over the
          reel a screen reader is here for. */}
      <ul className="presence-list">
        {owner && (
          <li className="presence-one" data-state="you">
            <span className="presence-disc t-label" aria-hidden="true">
              {owner.initials}
            </span>
            <span className="sr-only">{owner.name}, you</span>
          </li>
        )}
        {standing.map(({ member, reel }) => (
          <li key={member.id} className="presence-one" data-state={reel === null ? 'finished' : 'swiping'}>
            <span className="presence-disc t-label" aria-hidden="true">
              {member.initials}
              {reel === null && <Check className="presence-done" size={11} strokeWidth={3} />}
            </span>
            <span className="sr-only">
              {member.name}
              {reel === null ? ', finished' : `, on reel ${reel}`}
            </span>
          </li>
        ))}
      </ul>
      <p className="t-specimen presence-line">{line}</p>
    </aside>
  )
}
