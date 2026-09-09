import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Answer, Day, Period, Person, Slot, Trip } from './data/types'
import { scheduleTrip, withFeasibility } from './lib/schedule'
import { load, reset, save } from './lib/store'

type Ctx = {
  trip: Trip
  /** A member's yes, no or Must Go on a place. Votes live on places, so they survive a date change. */
  swipe: (memberId: string, placeId: string, answer: boolean | 'must') => void
  /** Renames the party. Ids are kept where a row keeps its position, so votes keyed by member id survive. */
  setParty: (names: string[]) => void
  /** Renames one member. Same id, so their votes stay theirs. */
  renameMember: (memberId: string, name: string) => void
  /** A new member with a fresh id and no votes. Refused past MAX_PARTY. */
  addMember: (name: string) => void
  /** Drops a member and their votes from the tally. The owner cannot be removed. */
  removeMember: (memberId: string) => void
  /** Puts a place into a day and slot on the calendar, taking it out of any other slot it held. */
  place: (placeId: string, dayIndex: number, slotIndex: number) => void
  remove: (dayIndex: number, slotIndex: number) => void
  /** Runs the heuristic scheduler over every day, around whatever is pinned. */
  apply: () => void
  /** The owner fixes a card to a day and slot. The scheduler never moves a pinned card. */
  pin: (placeId: string, dayIndex: number, slotIndex: number) => void
  unpin: (placeId: string) => void
  tick: (itemId: string) => void
  /** Regenerates the calendar for new dates. Votes and pins are on places, so only the days are replaced. */
  setDates: (startDate: string, nights: number) => void
  /** Opens a second slot in a period of a day. Each period holds at most two, so a day tops out at six. */
  addSlot: (dayIndex: number, period: Period) => void
  /** Closes a period's second slot, only while it is empty. The first slot of a period never goes. */
  removeSlot: (dayIndex: number, slotId: string) => void
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
      ? { ...day, slots: day.slots.map((s, i) => (i === slotIndex ? { ...s, ...patch } : s)) }
      : day
  )

export const SLOTS_PER_PERIOD = 2
/** The owner plus five friends. */
export const MAX_PARTY = 6

const slug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const person = (id: string, name: string): Person => ({
  id,
  name: name.trim(),
  initials: name.trim().slice(0, 2).toUpperCase()
})

/** Adds a member unless the party is full or the name is blank; the id is unique against the current party. */
export const withMember = (trip: Trip, name: string): Trip => {
  const clean = name.trim()
  if (clean.length === 0 || trip.party.length >= MAX_PARTY) return trip
  const base = slug(clean) || 'member'
  let id = base
  for (let n = 2; trip.party.some((p) => p.id === id); n += 1) id = `${base}-${n}`
  return { ...trip, party: [...trip.party, person(id, clean)] }
}

/** Removes a member and their votes. The owner stays; a missing id is a no-op. */
export const withoutMember = (trip: Trip, memberId: string): Trip => {
  if (memberId === trip.ownerId || !trip.party.some((p) => p.id === memberId)) return trip
  const { [memberId]: _dropped, ...votes } = trip.votes
  return { ...trip, party: trip.party.filter((p) => p.id !== memberId), votes }
}

export const renamed = (trip: Trip, memberId: string, name: string): Trip => {
  const clean = name.trim()
  if (clean.length === 0) return trip
  return { ...trip, party: trip.party.map((p) => (p.id === memberId ? person(p.id, clean) : p)) }
}

/** The new slot sits after the last slot of its period, so the day stays in morning, afternoon, evening order. */
export const withSlot = (day: Day, period: Period): Day => {
  const held = day.slots.filter((s) => s.period === period)
  if (held.length >= SLOTS_PER_PERIOD) return day
  const at = day.slots.findLastIndex((s) => s.period === period)
  const slot: Slot = { id: `d${day.index}-${period}-${held.length + 1}`, period, placeId: null, pinned: false }
  return { ...day, slots: [...day.slots.slice(0, at + 1), slot, ...day.slots.slice(at + 1)] }
}

export const withoutSlot = (day: Day, slotId: string): Day => {
  const slot = day.slots.find((s) => s.id === slotId)
  if (!slot || slot.placeId) return day
  if (day.slots.findIndex((s) => s.period === slot.period) === day.slots.indexOf(slot)) return day
  return { ...day, slots: day.slots.filter((s) => s.id !== slotId) }
}

const clearPlace = (days: Day[], placeId: string): Day[] =>
  days.map((day) =>
    day.slots.some((s) => s.placeId === placeId)
      ? {
          ...day,
          slots: day.slots.map((s) => (s.placeId === placeId ? { ...s, placeId: null, pinned: false } : s))
        }
      : day
  )

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip>(load)

  useEffect(() => {
    save(trip)
  }, [trip])

  const swipe = useCallback((memberId: string, placeId: string, answer: boolean | 'must') => {
    setTrip((current) => {
      const mine: Record<string, Answer> = { ...current.votes[memberId] }
      if (answer === 'must') {
        for (const id of Object.keys(mine)) if (mine[id] === 'must') mine[id] = 'yes'
      }
      mine[placeId] = answer === 'must' ? 'must' : answer ? 'yes' : 'no'
      return { ...current, votes: { ...current.votes, [memberId]: mine } }
    })
  }, [])

  const setParty = useCallback((names: string[]) => {
    setTrip((current) => {
      const party: Person[] = names
        .map((name, i) => ({ name: name.trim(), previous: current.party[i] }))
        .filter(({ name }) => name.length > 0)
        .map(({ name, previous }) => ({
          id: previous?.id ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          initials: name.slice(0, 2).toUpperCase()
        }))
      const owner = party.some((p) => p.id === current.ownerId) ? current.ownerId : (party[0]?.id ?? current.ownerId)
      return { ...current, party, ownerId: owner }
    })
  }, [])

  const renameMember = useCallback((memberId: string, name: string) => {
    setTrip((current) => renamed(current, memberId, name))
  }, [])

  const addMember = useCallback((name: string) => {
    setTrip((current) => withMember(current, name))
  }, [])

  const removeMember = useCallback((memberId: string) => {
    setTrip((current) => withoutMember(current, memberId))
  }, [])

  const place = useCallback((placeId: string, dayIndex: number, slotIndex: number) => {
    setTrip((current) => ({
      ...current,
      days: withFeasibility(
        setSlot(clearPlace(current.days, placeId), dayIndex, slotIndex, { placeId, pinned: false }),
        current.options
      ),
      pins: current.pins.filter((p) => p.placeId !== placeId)
    }))
  }, [])

  const remove = useCallback((dayIndex: number, slotIndex: number) => {
    setTrip((current) => {
      const removed = current.days.find((d) => d.index === dayIndex)?.slots[slotIndex]?.placeId ?? null
      return {
        ...current,
        days: withFeasibility(
          setSlot(current.days, dayIndex, slotIndex, { placeId: null, pinned: false }),
          current.options
        ),
        pins: current.pins.filter((p) => p.placeId !== removed)
      }
    })
  }, [])

  const apply = useCallback(() => {
    setTrip((current) => ({ ...current, days: scheduleTrip(current) }))
  }, [])

  const pin = useCallback((placeId: string, dayIndex: number, slotIndex: number) => {
    setTrip((current) => ({
      ...current,
      days: withFeasibility(
        setSlot(clearPlace(current.days, placeId), dayIndex, slotIndex, { placeId, pinned: true }),
        current.options
      ),
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

  const addSlot = useCallback((dayIndex: number, period: Period) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) => (day.index === dayIndex ? withSlot(day, period) : day))
    }))
  }, [])

  const removeSlot = useCallback((dayIndex: number, slotId: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) => (day.index === dayIndex ? withoutSlot(day, slotId) : day))
    }))
  }, [])

  const restart = useCallback(() => {
    reset()
    setTrip(load())
  }, [])

  const value = useMemo(
    () => ({
      trip,
      swipe,
      setParty,
      renameMember,
      addMember,
      removeMember,
      place,
      remove,
      apply,
      pin,
      unpin,
      tick,
      setDates,
      addSlot,
      removeSlot,
      restart
    }),
    [
      trip,
      swipe,
      setParty,
      renameMember,
      addMember,
      removeMember,
      place,
      remove,
      apply,
      pin,
      unpin,
      tick,
      setDates,
      addSlot,
      removeSlot,
      restart
    ]
  )
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export const useTrip = (): Ctx => {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip outside TripProvider')
  return ctx
}
