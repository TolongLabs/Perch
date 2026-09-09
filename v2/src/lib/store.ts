import { trip as seed } from '../data/trip'
import type { Trip } from '../data/types'

const KEY = 'perch.trip.v1'

/**
 * Storage is a boundary, so what comes back over it is validated rather than cast. A stored trip from an older shape
 * fails this and the seed is used, which is the same path as a first visit.
 */
const isTrip = (value: unknown): value is Trip => {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Partial<Trip>
  return (
    typeof t.id === 'string' &&
    typeof t.ownerId === 'string' &&
    Array.isArray(t.days) &&
    Array.isArray(t.party) &&
    Array.isArray(t.legs) &&
    Array.isArray(t.pins) &&
    Array.isArray(t.checklist) &&
    typeof t.votes === 'object' &&
    t.votes !== null &&
    typeof t.options === 'object' &&
    t.options !== null &&
    t.days.every((d) => Array.isArray(d?.slots) && d.slots.every((s) => typeof s?.pinned === 'boolean'))
  )
}

/** A cold load with nothing stored is the normal case, not an error: the fixture renders as authored. */
export const load = (): Trip => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const parsed: unknown = JSON.parse(raw)
    if (!isTrip(parsed) || parsed.id !== seed.id) return seed
    // A trip stored before the member switcher existed has no current member; it was always the owner.
    return { ...parsed, currentMemberId: parsed.currentMemberId ?? parsed.ownerId }
  } catch {
    return seed
  }
}

export const save = (trip: Trip): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(trip))
  } catch {
    /* A demo machine with storage disabled still runs; it just forgets between reloads. */
  }
}

export const reset = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}
