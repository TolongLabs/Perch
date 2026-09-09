import type { Day, Person, Place, Slot, TallyEntry, Trip, Votes } from '../data/types'

export const OWNER_WEIGHT = 1.5
export const INCLUSION_PERCENT = 50
/** Rank bonus for a Must Go, added to the weighted score for ordering only, never to the percentage. */
export const MUST_BONUS = 0.5

const weightOf = (memberId: string, ownerId: string): number => (memberId === ownerId ? OWNER_WEIGHT : 1)

const isYes = (answer: Votes[string][string] | undefined): boolean => answer === 'yes' || answer === 'must'

/**
 * Weighted yes over the total possible weight. The owner's yes is 1.5, everyone else's is 1, and a swipe not yet cast
 * counts as nothing, so the percentages are partial until the owner finishes. A Must Go is a yes for the percentage
 * and adds MUST_BONUS to the score used for ordering. Sorted by score descending, ties broken by fixture order, which
 * is the order of `options`.
 */
export const computeTally = (
  votes: Votes,
  options: Record<string, Place>,
  party: Person[],
  ownerId: string
): TallyEntry[] => {
  const total = party.reduce((sum, p) => sum + weightOf(p.id, ownerId), 0)
  const scored = Object.values(options).map((place, index) => {
    const yes = party.reduce((sum, p) => sum + (isYes(votes[p.id]?.[place.id]) ? weightOf(p.id, ownerId) : 0), 0)
    const mustBy = party.filter((p) => votes[p.id]?.[place.id] === 'must').map((p) => p.id)
    return {
      index,
      score: yes + mustBy.length * MUST_BONUS,
      entry: {
        placeId: place.id,
        name: place.name,
        percentage: Math.round((yes / total) * 100),
        unanimous: party.every((p) => isYes(votes[p.id]?.[place.id])),
        eliminated: yes === 0,
        mustBy
      }
    }
  })
  return scored.sort((a, b) => b.score - a.score || a.index - b.index).map((s) => s.entry)
}

/** The ranked voted-in list: at or above the threshold, in tally order. This is the scheduler's whole pool. */
export const votedIn = (tally: TallyEntry[]): TallyEntry[] =>
  tally.filter((t) => !t.eliminated && t.percentage >= INCLUSION_PERCENT)

/** A member has finished when every place has an answer from them. */
export const hasFinished = (trip: Trip, memberId: string): boolean =>
  Object.keys(trip.options).every((placeId) => trip.votes[memberId]?.[placeId] != null)

/** Ids of the members who have finished, in party order. */
export const finishedMembers = (trip: Trip): string[] =>
  trip.party.filter((p) => hasFinished(trip, p.id)).map((p) => p.id)

export const tallyFor = (trip: Trip): TallyEntry[] => computeTally(trip.votes, trip.options, trip.party, trip.ownerId)

/**
 * The Perch drawer's answer: the next-ranked voted-in place not already placed anywhere in the trip, open on this
 * weekday, that belongs in this slot's period. Null when nothing fits, in which case the slot may stay empty.
 *
 * Anywhere, not just on this day: offering a card that is already sitting in another day steals it from there when it
 * is swapped in, which drops that day's stop count and silently destroys the pin if it had one.
 *
 * `day` is read as well as `trip`, and may be a day the trip does not hold yet, so a caller can ask what would fit a
 * hypothetical arrangement without committing it first.
 */
export const nextReplacement = (slot: Slot, day: Day, trip: Trip, tally: TallyEntry[]): Place | null => {
  const held = (slots: Slot[]) => slots.map((s) => s.placeId).filter((id): id is string => id !== null)
  const placed = new Set([...trip.days.flatMap((d) => held(d.slots)), ...held(day.slots)])
  const weekday = day.weekday.toLowerCase()
  const fits = (place: Place): boolean =>
    !placed.has(place.id) && !place.closedOn.includes(weekday) && place.bestPeriod.includes(slot.period)
  for (const entry of votedIn(tally)) {
    const place = trip.options[entry.placeId]
    if (place && fits(place)) return place
  }
  return null
}
