import { useEffect, useState } from 'react'
import type { Person } from '../data/types'
import { presenceAt } from '../lib/presence'
import './Presence.css'

/** Four seconds: long enough to read the line before it changes, short enough that the strip is never still. */
const TICK_MS = 4000

/**
 * Who else is on the deck. A shared document shows you the other cursors, and voting on a trip is the same problem:
 * the owner is swiping alone on her own screen with no sign that three other people are doing it at the same time.
 *
 * The prototype has no server, so the friends' activity comes off a fixture clock. That is stated here rather than
 * hidden, because the strip is the only thing on the surface that is not read from the trip.
 */
export const Presence = ({ party, ownerId, reels }: { party: Person[]; ownerId: string; reels: number }) => {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  const now = presenceAt(tick, party, ownerId, reels)
  if (!now) return null

  const owner = party.find((p) => p.id === ownerId)
  const rest = party.filter((p) => p.id !== ownerId)

  return (
    <aside className="presence">
      {/* The owner first and then the party's own order, so the reader finds herself in the same place every time
          she looks. Not a live region: the line changes every four seconds and announcing that would talk over the
          reel a screen reader is actually here for. */}
      <ul className="presence-list">
        {(owner ? [owner, ...rest] : rest).map((member) => {
          const state = member.id === now.away.id ? 'away' : member.id === now.active.id ? 'swiping' : 'here'
          return (
            <li key={member.id} className="presence-one" data-state={state}>
              <span className="presence-disc t-label" aria-hidden="true">
                {member.initials}
              </span>
              <span className="sr-only">
                {member.name}
                {member.id === ownerId ? ', you' : state === 'away' ? ', away' : ', swiping'}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="t-specimen presence-line">
        {now.active.name} is on reel {now.reel} &middot; {now.swiping} of {party.length} swiping
      </p>
    </aside>
  )
}
