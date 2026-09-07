import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Trip } from './data/types'
import { rankingWithTaps } from './lib/ranking'
import { repair } from './lib/repair'
import { load, reset, save } from './lib/store'

type Ctx = {
  trip: Trip
  /** Something in the world changed. The bench is the repair pool, so nobody is consulted. */
  disrupt: (dayIndex: number, slotId: string, cause: string) => void
  /** She vetoes. Choosing a bench row by hand is the same interaction as a repair. */
  swap: (dayIndex: number, slotId: string, optionId: string) => void
  /** A tap is not an edit: it adds weight, and the order Perch already produced re-sorts underneath it. */
  tap: (personId: string, optionId: string) => void
  settle: (dayIndex: number, slotId: string) => void
  undo: () => void
  restart: () => void
}

const TripContext = createContext<Ctx | null>(null)

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip>(load)

  useEffect(() => {
    save(trip)
  }, [trip])

  const applySlot = useCallback((dayIndex: number, slotId: string, cause: string) => {
    setTrip((current) => {
      const result = repair(current, dayIndex, slotId, cause)
      const days = current.days.map((day) =>
        day.index === dayIndex ? { ...day, slots: day.slots.map((s) => (s.id === slotId ? result.slot : s)) } : day
      )
      return {
        ...current,
        days,
        changes: result.kind === 'swapped' ? [result.change, ...current.changes] : current.changes
      }
    })
  }, [])

  const disrupt = useCallback(
    (dayIndex: number, slotId: string, cause: string) => applySlot(dayIndex, slotId, cause),
    [applySlot]
  )

  const swap = useCallback((dayIndex: number, slotId: string, optionId: string) => {
    setTrip((current) => {
      const day = current.days.find((d) => d.index === dayIndex)
      const slot = day?.slots.find((s) => s.id === slotId)
      if (!day || !slot?.chosenId) return current

      const outgoing = slot.chosenId
      const next = {
        ...slot,
        chosenId: optionId,
        benchIds: [...slot.benchIds.filter((id) => id !== optionId), outgoing],
        state: 'decided' as const,
        cause: null
      }
      return {
        ...current,
        days: current.days.map((d) =>
          d.index === dayIndex ? { ...d, slots: d.slots.map((s) => (s.id === slotId ? next : s)) } : d
        )
      }
    })
  }, [])

  const tap = useCallback((personId: string, optionId: string) => {
    setTrip((current) => {
      const party = current.party.map((p) =>
        p.id === personId
          ? { ...p, wants: p.wants.includes(optionId) ? p.wants.filter((w) => w !== optionId) : [...p.wants, optionId] }
          : p
      )
      return { ...current, party, ranking: rankingWithTaps({ ...current, party }) }
    })
  }, [])

  const settle = useCallback((dayIndex: number, slotId: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((d) =>
        d.index === dayIndex
          ? { ...d, slots: d.slots.map((s) => (s.id === slotId ? { ...s, state: 'decided' as const } : s)) }
          : d
      )
    }))
  }, [])

  const undo = useCallback(() => {
    setTrip((current) => {
      const [last, ...rest] = current.changes
      if (!last) return current
      const days = current.days.map((day) =>
        day.index === last.dayIndex
          ? {
              ...day,
              slots: day.slots.map((s) =>
                s.id === last.slotId
                  ? {
                      ...s,
                      chosenId: last.fromId === '' ? s.chosenId : last.fromId,
                      benchIds: [last.toId, ...s.benchIds.filter((id) => id !== last.toId && id !== last.fromId)],
                      blockedIds: s.blockedIds.filter((id) => id !== last.fromId),
                      state: 'decided' as const,
                      cause: null
                    }
                  : s
              )
            }
          : day
      )
      return { ...current, days, changes: rest }
    })
  }, [])

  const restart = useCallback(() => {
    reset()
    setTrip(load())
  }, [])

  const value = useMemo(
    () => ({ trip, disrupt, swap, tap, settle, undo, restart }),
    [trip, disrupt, swap, tap, settle, undo, restart]
  )
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export const useTrip = (): Ctx => {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip outside TripProvider')
  return ctx
}
