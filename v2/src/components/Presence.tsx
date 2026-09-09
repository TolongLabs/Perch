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
export const Presence = ({ trip }: { trip: Trip }) => {
  const standing = standings(trip)
  const line = standingLine(standing)
  if (!line) return null

  const owner = trip.party.find((p) => p.id === trip.ownerId)
  const rows = [
    ...(owner ? [{ member: owner, reel: null, you: true }] : []),
    ...standing.map((s) => ({ ...s, you: false }))
  ]

  return (
    <aside className="presence" aria-labelledby="presence-head">
      <h2 className="sr-only" id="presence-head">
        Who Is On The Deck
      </h2>
      {/* The owner first, so the reader finds herself in the same place every time she looks, and then the party's
          own order. One letter, not two: two letters of a first name spell an acronym as often as a monogram, and
          the party's own initial was reading as AI. The name itself is in the line beside each disc. */}
      <ul className="presence-list">
        {rows.map(({ member, reel, you }, index) => (
          <li
            key={member.id}
            className="presence-one"
            data-state={you ? 'you' : reel === null ? 'finished' : 'swiping'}
            /* Earlier discs sit in front of later ones. Where the row overlaps on a phone, painting in DOM order
               put each disc's badge behind its neighbour's ring, which clipped the one mark that says who is
               swiping. Counted down rather than fixed at four, because the party is not fixed at four. */
            style={{ zIndex: rows.length - index }}
          >
            <span className="presence-disc t-label" aria-hidden="true">
              {member.name.slice(0, 1)}
              {!you && reel === null && <Check className="presence-done" size={12} strokeWidth={3.5} />}
            </span>
            <span className="sr-only">
              {you
                ? `${member.name}, you`
                : `${member.name} ${reel === null ? 'has answered every reel' : `is on reel ${reel}`}`}
            </span>
          </li>
        ))}
      </ul>
      <p className="t-specimen presence-line">{line}</p>
    </aside>
  )
}
