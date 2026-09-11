import type { Trip } from '../data/types'
import { scheduleTrip } from './schedule'
import { tallyFor, votedIn } from './votes'

export const maxTripDays = (trip: Trip): number => Math.floor(Object.keys(trip.options).length / 3)

/**
 * Capacity and fill check for the current trip. `maxDays` is the voted-in pool's day ceiling - what Optimize Plan
 * can actually fill at three slots a day, and what the date picker offers - while `maxTripDays` keeps the
 * destination-content ceiling as the hard physical limit. #393 `availablePlaces` counts distinct voted-in places
 * plus pinned slots that reference a known option. `canFill` is the result of running the actual scheduler and
 * verifying that every requested slot is occupied by a known venue with no repeated placeId. It is not a guarantee
 * that opening hours or the 21:00 day-end rule are satisfied: a pinned closed venue stays pinned and the warning
 * remains visible through `Day.feasibility`.
 */
export const planCapacity = (
  trip: Trip
): { maxDays: number; availablePlaces: number; requiredPlaces: number; canFill: boolean } => {
  const maxDays = Math.floor(votedIn(tallyFor(trip)).length / 3)

  const available = new Set<string>()
  for (const entry of votedIn(tallyFor(trip))) {
    if (Object.hasOwn(trip.options, entry.placeId)) {
      available.add(entry.placeId)
    }
  }

  let invalidPin = false
  for (const day of trip.days) {
    for (const slot of day.slots) {
      if (slot.pinned && slot.placeId !== null) {
        if (Object.hasOwn(trip.options, slot.placeId)) {
          available.add(slot.placeId)
        } else {
          invalidPin = true
        }
      }
    }
  }
  const availablePlaces = available.size

  const requiredPlaces = trip.days.reduce((sum, day) => sum + day.slots.length, 0)

  if (invalidPin) {
    return { maxDays, availablePlaces, requiredPlaces, canFill: false }
  }

  const scheduled = scheduleTrip(trip)
  const seen = new Set<string>()
  let filled = 0
  for (const day of scheduled) {
    for (const slot of day.slots) {
      if (slot.placeId === null) continue
      filled += 1
      seen.add(slot.placeId)
    }
  }

  const canFill =
    trip.days.length > 0 &&
    requiredPlaces > 0 &&
    filled === requiredPlaces &&
    seen.size === filled &&
    [...seen].every((id) => Object.hasOwn(trip.options, id))

  return { maxDays, availablePlaces, requiredPlaces, canFill }
}
