import type { Trip } from '../data/types'

/**
 * Question 3 produces the whole ranking, not just the winners: three chosen sit on top in the order they were
 * chosen, and the seven that were not settle onto the perch beneath them. Nothing is discarded.
 */
export const rankingFromInterview = (picked: string[], pool: string[]): string[] => [
  ...picked,
  ...pool.filter((id) => !picked.includes(id))
]

/**
 * A tap is not an edit. The group never writes to a slot; they add weight to an option, and the order the interview
 * produced is re-sorted underneath them. With no taps at all the trip is exactly what Perch already chose.
 */
export const rankingWithTaps = (trip: Trip): string[] => {
  const weight = new Map<string, number>()
  for (const person of trip.party) {
    for (const id of person.wants) weight.set(id, (weight.get(id) ?? 0) + 1)
  }

  return [...trip.ranking].sort((a, b) => {
    const diff = (weight.get(b) ?? 0) - (weight.get(a) ?? 0)
    return diff !== 0 ? diff : trip.ranking.indexOf(a) - trip.ranking.indexOf(b)
  })
}

export const tapCount = (trip: Trip, optionId: string): number =>
  trip.party.filter((p) => p.wants.includes(optionId)).length
