import type { Person, Trip } from '../data/types'

export type Standing = {
  member: Person
  /** How many reels they have answered, and which one that puts them on. Null once there is nothing left to answer. */
  reel: number | null
}

/**
 * Where each of the others has got to, read from their votes rather than from a clock. Presence is being here, not
 * being mid-swipe: a friend who has answered everything is still on the deck, and saying she is on reel nine would
 * contradict the Tally, which reads the same votes and says she has finished.
 *
 * The owner is left out because she is the one reading; her own position is the header's Reel N Of M.
 */
export const standings = (trip: Trip, reels: number): Standing[] =>
  trip.party
    .filter((member) => member.id !== trip.ownerId)
    .map((member) => {
      const answers = trip.votes[member.id] ?? {}
      const answered = Object.keys(trip.options).filter((placeId) => answers[placeId] != null).length
      const done = answered >= Object.keys(trip.options).length
      return { member, reel: done ? null : Math.min(answered + 1, reels) }
    })

const WORD: Record<number, string> = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' }

/** The names, in party order, as a sentence: `Farah`, `Farah and Hana`, `Farah, Hana and Iman`. */
export const nameList = (names: string[]): string =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`

/**
 * What the strip says under itself. Two sentences, both read from the same votes the discs are drawn from: whoever
 * still has reels left is named on the one she is on, and when nobody does, the line says so rather than inventing
 * activity to fill itself.
 */
export const standingLine = (standing: Standing[]): string | null => {
  if (standing.length === 0) return null
  const swiping = standing.find((s) => s.reel !== null)
  const finished = standing.filter((s) => s.reel === null).length
  const tally =
    finished === standing.length
      ? `all ${WORD[finished] ?? finished} finished`
      : `${finished} of ${standing.length} finished`
  if (!swiping || swiping.reel === null) {
    return `${nameList(standing.map((s) => s.member.name))} are here · ${tally}`
  }
  return `${swiping.member.name} is on reel ${swiping.reel} · ${tally}`
}
