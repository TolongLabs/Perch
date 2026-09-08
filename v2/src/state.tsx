import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Day, Period, Slot, Trip } from './data/types'
import { load, reset, save } from './lib/store'

type Ctx = {
  trip: Trip
  /** A member's yes or no on a place. Votes live on places, so they survive a date change. */
  swipe: (memberId: string, placeId: string, answer: boolean) => void
  /** Puts a place into a day and slot on the calendar, taking it out of any other slot it held. */
  place: (placeId: string, dayIndex: number, slotIndex: number) => void
  remove: (dayIndex: number, slotIndex: number) => void
  /** The owner fixes a card to a day and slot. The scheduler never moves a pinned card. */
  pin: (placeId: string, dayIndex: number, slotIndex: number) => void
  unpin: (placeId: string) => void
  tick: (itemId: string) => void
  /** Regenerates the calendar for new dates. Votes and pins are on places, so only the days are replaced. */
  setDates: (startDate: string, nights: number) => void
  restart: () => void
}

const TripContext = createContext<Ctx | null>(null)

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const emptyDays = (startDate: string, nights: number, titles: string[]): Day[] =>
  Array.from({ length: nights + 1 }, (_, i) => {
    const d = new Date(`${startDate}T00:00:00`)
    d.setDate(d.getDate() + i)
    const index = i + 1
    return {
      index,
      date: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[d.getDay()] ?? 'Sunday',
      tint: ((i % 5) + 1) as Day['tint'],
      title: titles[i] ?? `Day ${index}`,
      slots: PERIODS.map((period): Slot => ({ id: `d${index}-${period}`, period, placeId: null, pinned: false })),
      feasibility: null
    }
  })

const setSlot = (days: Day[], dayIndex: number, slotIndex: number, patch: Partial<Slot>): Day[] =>
  days.map((day) =>
    day.index === dayIndex
      ? { ...day, slots: day.slots.map((s, i) => (i === slotIndex ? { ...s, ...patch } : s)), feasibility: null }
      : day
  )

const clearPlace = (days: Day[], placeId: string): Day[] =>
  days.map((day) =>
    day.slots.some((s) => s.placeId === placeId)
      ? {
          ...day,
          slots: day.slots.map((s) => (s.placeId === placeId ? { ...s, placeId: null, pinned: false } : s)),
          feasibility: null
        }
      : day
  )

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip>(load)

  useEffect(() => {
    save(trip)
  }, [trip])

  const swipe = useCallback((memberId: string, placeId: string, answer: boolean) => {
    setTrip((current) => ({
      ...current,
      votes: {
        ...current.votes,
        [memberId]: { ...current.votes[memberId], [placeId]: answer ? 'yes' : 'no' }
      }
    }))
  }, [])

  const place = useCallback((placeId: string, dayIndex: number, slotIndex: number) => {
    setTrip((current) => ({
      ...current,
      days: setSlot(clearPlace(current.days, placeId), dayIndex, slotIndex, { placeId, pinned: false }),
      pins: current.pins.filter((p) => p.placeId !== placeId)
    }))
  }, [])

  const remove = useCallback((dayIndex: number, slotIndex: number) => {
    setTrip((current) => {
      const removed = current.days.find((d) => d.index === dayIndex)?.slots[slotIndex]?.placeId ?? null
      return {
        ...current,
        days: setSlot(current.days, dayIndex, slotIndex, { placeId: null, pinned: false }),
        pins: current.pins.filter((p) => p.placeId !== removed)
      }
    })
  }, [])

  const pin = useCallback((placeId: string, dayIndex: number, slotIndex: number) => {
    setTrip((current) => ({
      ...current,
      days: setSlot(clearPlace(current.days, placeId), dayIndex, slotIndex, { placeId, pinned: true }),
      pins: [...current.pins.filter((p) => p.placeId !== placeId), { placeId, dayIndex, slotIndex }]
    }))
  }, [])

  const unpin = useCallback((placeId: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) => ({
        ...day,
        slots: day.slots.map((s) => (s.placeId === placeId ? { ...s, pinned: false } : s))
      })),
      pins: current.pins.filter((p) => p.placeId !== placeId)
    }))
  }, [])

  const tick = useCallback((itemId: string) => {
    setTrip((current) => ({
      ...current,
      checklist: current.checklist.map((item) => (item.id === itemId ? { ...item, ticked: !item.ticked } : item))
    }))
  }, [])

  const setDates = useCallback((startDate: string, nights: number) => {
    setTrip((current) => ({
      ...current,
      startDate,
      nights,
      days: emptyDays(
        startDate,
        nights,
        current.days.map((d) => d.title)
      ),
      pins: [],
      legs: [{ city: current.destination, startDay: 1, endDay: nights + 1, transferMin: 0 }]
    }))
  }, [])

  const restart = useCallback(() => {
    reset()
    setTrip(load())
  }, [])

  const value = useMemo(
    () => ({ trip, swipe, place, remove, pin, unpin, tick, setDates, restart }),
    [trip, swipe, place, remove, pin, unpin, tick, setDates, restart]
  )
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export const useTrip = (): Ctx => {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip outside TripProvider')
  return ctx
}
