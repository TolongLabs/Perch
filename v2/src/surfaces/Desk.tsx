import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { type ReactNode, useMemo, useState } from 'react'
import { addDays, DateRangePicker, nightsBetween, type Range } from '../components/DateRangePicker'
import { Perch } from '../components/Perch'
import { PlacedCard, PoolCard } from '../components/PlacedCard'
import { type ChipState, StateChip } from '../components/StateChip'
import { Heading, Info } from '../components/Ui'
import type { DayFeasibility, Slot } from '../data/types'
import { dayLabel, duration, price } from '../lib/format'
import { CLUSTER_LABEL } from '../lib/schedule'
import { nextReplacement, tallyFor, votedIn } from '../lib/votes'
import { useTrip } from '../state'
import './Desk.css'

const PERIOD: Record<Slot['period'], string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

/** The three feasibility outcomes, in the words rule 5 uses. The copy never calls the scheduler AI. */
const FEASIBILITY: Record<DayFeasibility['status'], { label: string; state: ChipState }> = {
  green: { label: 'Fits', state: 'decided' },
  gold: { label: 'Fits But Runs Slow', state: 'gold' },
  red: { label: 'Overruns', state: 'at-risk' }
}

const SlotCell = ({ dayIndex, slotIndex, children }: { dayIndex: number; slotIndex: number; children: ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `drop:${dayIndex}:${slotIndex}`, data: { dayIndex, slotIndex } })
  return (
    <div ref={setNodeRef} className="slot-drop" data-over={isOver}>
      {children}
    </div>
  )
}

export const Desk = () => {
  const { trip, place, remove, apply, pin, unpin, setDates, restart } = useTrip()
  const [flight, setFlight] = useState(0)
  const [dragging, setDragging] = useState<string | null>(null)
  const [drawer, setDrawer] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
  const [datesOpen, setDatesOpen] = useState(false)
  const [range, setRange] = useState<Range>(() => ({
    start: trip.startDate,
    end: addDays(trip.startDate, trip.nights)
  }))

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const tally = useMemo(() => tallyFor(trip), [trip])
  const placed = new Set(trip.days.flatMap((d) => d.slots.map((s) => s.placeId).filter((id): id is string => !!id)))
  const pool = votedIn(tally).filter((t) => !placed.has(t.placeId))

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null)
    const to = over?.data.current as { dayIndex: number; slotIndex: number } | undefined
    const from = active.data.current as { placeId: string } | undefined
    // A card released outside the grid goes back where it was; nothing leaves the trip by being dropped.
    if (!to || !from) return
    place(from.placeId, to.dayIndex, to.slotIndex)
  }

  const onApply = () => {
    apply()
    setFlight((f) => f + 1)
  }

  // Removing never leaves a hole: the drawer opens first and the removal is whichever way the owner answers it.
  const offer = (() => {
    if (!drawer) return null
    const day = trip.days.find((d) => d.index === drawer.dayIndex)
    const slot = day?.slots[drawer.slotIndex]
    if (!day || !slot) return null
    const stops = day.slots.filter((s) => s.placeId !== null).length
    const candidate = nextReplacement(slot, day, trip, tally)
    const rank = candidate ? tally.findIndex((t) => t.placeId === candidate.id) + 1 : null
    return { candidate, rank, required: stops <= 2 }
  })()

  const nights = range.start && range.end ? nightsBetween(range.start, range.end) : 0

  const dragged = dragging ? trip.options[dragging] : undefined

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e: DragStartEvent) =>
        setDragging((e.active.data.current as { placeId: string } | undefined)?.placeId ?? null)
      }
      onDragEnd={onDragEnd}
    >
      <main className="desk">
        <header className="desk-head">
          <Heading as="h1" info="Drag a card into a slot, then Apply to let the scheduler order each day.">
            <span className="t-display">The Desk</span>
          </Heading>

          <div className="desk-acts">
            <button
              type="button"
              className="desk-dates t-label"
              onClick={() => setDatesOpen((v) => !v)}
              aria-expanded={datesOpen}
            >
              Dates
            </button>
            <button type="button" className="desk-apply t-label" onClick={onApply}>
              Apply
            </button>
          </div>
        </header>

        {datesOpen && (
          <section className="desk-datepick">
            <p className="t-label desk-legend">Change The Dates</p>
            <DateRangePicker value={range} onChange={setRange} />
            <div className="desk-datefoot">
              <p className="t-specimen">
                {nights > 0
                  ? `${nights + 1} days, ${nights} nights. Votes stay, they are on places.`
                  : 'Tap the first day, then the last.'}
              </p>
              <button
                type="button"
                className="desk-dateset t-label"
                disabled={nights < 1}
                onClick={() => {
                  if (range.start && nights > 0) setDates(range.start, nights)
                  setDatesOpen(false)
                }}
              >
                Set Dates
              </button>
            </div>
          </section>
        )}

        <div className="desk-body">
          <section className="desk-grid" aria-label="The calendar">
            {trip.days.map((day, dayPos) => (
              <section key={day.index} className="desk-day" data-day={day.tint}>
                <header className="desk-dayhead">
                  <p className="t-label desk-dayindex">
                    Day {day.index}
                    <span className="desk-daydate">{dayLabel(day.date)}</span>
                  </p>
                  {day.feasibility ? (
                    <span className="desk-fit">
                      <StateChip state={FEASIBILITY[day.feasibility.status].state}>
                        {FEASIBILITY[day.feasibility.status].label}
                      </StateChip>
                      <Info>{day.feasibility.rationale}</Info>
                    </span>
                  ) : (
                    <p className="t-specimen desk-unset">Not scheduled yet</p>
                  )}
                </header>

                {day.slots.map((slot, slotIndex) => {
                  const held = slot.placeId ? trip.options[slot.placeId] : undefined
                  return (
                    <div key={slot.id} className="desk-slot">
                      <p className="t-label desk-period">{PERIOD[slot.period]}</p>
                      <SlotCell dayIndex={day.index} slotIndex={slotIndex}>
                        {held ? (
                          <PlacedCard
                            place={held}
                            dayIndex={day.index}
                            slotIndex={slotIndex}
                            pinned={slot.pinned}
                            flying={flight > 0}
                            order={dayPos * 3 + slotIndex}
                            onPin={() => (slot.pinned ? unpin(held.id) : pin(held.id, day.index, slotIndex))}
                            onRemove={() => setDrawer({ dayIndex: day.index, slotIndex })}
                          />
                        ) : (
                          <p className="desk-empty t-label">Empty</p>
                        )}
                      </SlotCell>
                    </div>
                  )
                })}
              </section>
            ))}
          </section>

          <aside className="desk-pool" aria-label="Voted in">
            <p className="t-label desk-legend">
              Voted In
              <Info>
                Everything the group put at or above half the weighted vote, in tally order. Drag one into a slot, or
                let Apply place them.
              </Info>
            </p>
            <p className="t-specimen desk-poolcount">{pool.length} waiting</p>
            <div className="desk-poollist">
              {pool.map((entry) => {
                const p = trip.options[entry.placeId]
                return p ? <PoolCard key={p.id} place={p} unanimous={entry.unanimous} /> : null
              })}
            </div>

            {/* Inside the product surface and labelled as not being part of it, per `TRD.md`. A live demo has to be
                resettable between runs by whoever is holding the laptop, not by opening devtools. */}
            <div className="desk-proto">
              <p className="t-label desk-protolegend">Prototype Controls</p>
              <p className="t-specimen">Not part of the product. Clears this browser and reloads the fixture.</p>
              <button type="button" className="desk-reset t-label" onClick={restart}>
                Start Over
              </button>
            </div>
          </aside>
        </div>
      </main>

      <DragOverlay dropAnimation={null}>
        {dragged && (
          <article className="card card-pool card-ghost">
            <p className="t-name card-name">{dragged.name}</p>
            <p className="t-specimen card-line">
              {CLUSTER_LABEL[dragged.cluster]} · {duration(dragged.dwellMin)} · {price(dragged)}
            </p>
          </article>
        )}
      </DragOverlay>

      {drawer && offer && (
        <Perch
          place={offer.candidate}
          rank={offer.rank}
          required={offer.required}
          onSwap={() => {
            if (offer.candidate) place(offer.candidate.id, drawer.dayIndex, drawer.slotIndex)
            setDrawer(null)
          }}
          onEmpty={() => {
            remove(drawer.dayIndex, drawer.slotIndex)
            setDrawer(null)
          }}
          onCancel={() => setDrawer(null)}
        />
      )}
    </DndContext>
  )
}
