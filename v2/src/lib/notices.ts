import type { Trip } from '../data/types'
import { tallyFor } from './votes'

export type Notice = {
  id: string
  /** The line the reader sees. Sentence case, because it is body copy rather than a label. */
  text: string
  kind: 'swiped' | 'unanimous'
}

/**
 * Derived from the trip rather than stored beside it, so the panel can never disagree with the Tally it describes.
 * Two things are worth telling the owner between sessions: who has finished answering, because the tally is partial
 * until they have, and what the whole group agreed on, because that is the only signal the scheduler treats as
 * settled. Nothing here is a fixture list of invented events.
 */
export const noticesFor = (trip: Trip): Notice[] => {
  const total = Object.keys(trip.options).length
  const done = trip.party
    .filter((p) => p.id !== trip.ownerId)
    .filter((p) => Object.values(trip.votes[p.id] ?? {}).filter((a) => a !== null).length >= total)
    .map<Notice>((p) => ({ id: `swiped-${p.id}`, text: `${p.name} finished swiping.`, kind: 'swiped' }))

  const agreed = tallyFor(trip)
    .filter((t) => t.unanimous)
    .map<Notice>((t) => ({ id: `unanimous-${t.placeId}`, text: `${t.name} went unanimous.`, kind: 'unanimous' }))

  return [...done, ...agreed]
}
