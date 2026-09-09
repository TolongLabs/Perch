import type { Person } from '../data/types'

export type Presence = {
  /** The friend whose swiping the strip is naming right now. Never the owner: the owner is the one reading. */
  active: Person
  /** The friend who has stepped away this tick, so the count is three of four rather than a flat four of four. */
  away: Person
  /** Which reel the active friend is on, one-based. */
  reel: number
  /** How many of the party are swiping, the owner included. */
  swiping: number
}

/**
 * Presence on a fixture clock. There is no server in the prototype and no second browser, so the three friends'
 * activity is generated from a tick rather than received: one friend is away, one of the others is named, and both
 * roles move on every tick so the strip is never still while the film watches it.
 *
 * The reel number is derived from the member's position and the tick rather than from a table of made-up numbers,
 * which keeps it moving forward at one reel a tick without anything to keep in step with the fixture.
 */
export const presenceAt = (tick: number, party: Person[], ownerId: string, reels: number): Presence | null => {
  const friends = party.filter((p) => p.id !== ownerId)
  if (friends.length < 2 || reels < 1) return null
  const awayAt = tick % friends.length
  const activeAt = (tick + 1) % friends.length
  const away = friends[awayAt]
  const active = friends[activeAt]
  if (!away || !active) return null
  return { active, away, reel: 1 + ((activeAt * 7 + tick) % reels), swiping: party.length - 1 }
}
