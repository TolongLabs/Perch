import { trip as seed } from '../data/trip'
import type { Trip } from '../data/types'

const KEY = 'perch.trip.v1'

/** A cold load with nothing stored is the normal case, not an error: the trip is valid with zero group input. */
export const load = (): Trip => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw) as Trip
    return parsed.id === seed.id ? parsed : seed
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
