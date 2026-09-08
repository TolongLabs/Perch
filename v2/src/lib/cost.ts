import type { Day, Place, Trip } from '../data/types'

export const dayCostRM = (day: Day, options: Record<string, Place>): number =>
  day.slots.reduce((sum, slot) => sum + (slot.placeId ? (options[slot.placeId]?.costRM ?? 0) : 0), 0)

export const tripCostRM = (trip: Trip): number => trip.days.reduce((sum, day) => sum + dayCostRM(day, trip.options), 0)
