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
import { useNavigate } from 'react-router-dom'
import { addDays, DateRangePicker, nightsBetween, type Range } from '../components/DateRangePicker'
import { Perch } from '../components/Perch'
import { PlacedCard, PoolCard } from '../components/PlacedCard'
import { type ChipState, StateChip } from '../components/StateChip'
import { Heading, Info } from '../components/Ui'
import type { Day, DayFeasibility, Period, Slot } from '../data/types'
import { dayLabel, duration, price } from '../lib/format'
import { CLUSTER_AREA } from '../lib/schedule'
import { nextReplacement, tallyFor, votedIn } from '../lib/votes'
import { useTrip } from '../state'
import './Desk.css'

const PERIOD: Record<Slot['period'], string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

/**
 * A day's slots grouped under the period that owns them, keeping each slot's index into `day.slots`, which is what
 * the droppable and every mutation are keyed by. Rendering the flat list repeated the period's name above its
 * second slot, which reads as two Mornings rather than as one Morning holding two stops.
 */
const byPeriod = (day: Day) =>
  PERIODS.map((period) => ({
    period,
    cells: day.slots.map((slot, index) => ({ slot, index })).filter(({ slot }) => slot.period === period)
  })).filter(({ cells }) => cells.length > 0)

/** The next period that can take a second slot, in the order the day runs. Null once all three hold two. */
const nextOpen = (day: Day): Period | null =>
  PERIODS.find((period) => day.slots.filter((s) => s.period === period).length < 2) ?? null

/** The last second slot that is empty, which is the only one that may close. Null when none can. */
const lastClosable = (day: Day): Slot | null => {
  for (const period of [...PERIODS].reverse()) {
    const held = day.slots.filter((s) => s.period === period)
    const second = held[1]
    if (held.length === 2 && second && second.placeId === null) return second
  }
  return null
}

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
  const navigate = useNavigate()
  const { trip, place, remove, apply, pin, unpin, setDates, addSlot, removeSlot, restart } = useTrip()
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

  /* The flight animation staggers by a card's position across the whole calendar. Three per day was a constant
     while every day held three; a day that holds six would collide with the next day's cards. */
  const slotsBefore = (dayPos: number) => trip.days.slice(0, dayPos).reduce((n, d) => n + d.slots.length, 0)

  const dragged = dragging ? trip.options[dragging] : undefined

  // Only once there is something to go on from. Before the days are scheduled the checklist has no trip to check.
  const settled = trip.days.some((d) => d.feasibility !== null)

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
          <Heading as="h1" info="Drag a card into a slot, then Plan The Days to let the scheduler order each day.">
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
              Plan The Days
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
          <aside className="desk-pool" aria-label="Voted in">
            <p className="t-label desk-legend">
              Voted In
              <Info>
                Everything the group put at or above half the weighted vote, in tally order. Drag one into a slot, or
                let Plan The Days place them.
              </Info>
            </p>
            <p className="t-specimen desk-poolcount">{pool.length} waiting</p>
            <div className="desk-poollist">
              {pool.map((entry) => {
                const p = trip.options[entry.placeId]
                return p ? <PoolCard key={p.id} place={p} unanimous={entry.unanimous} /> : null
              })}
            </div>
          </aside>

          <section className="desk-grid" aria-label="The calendar">
            {trip.days.map((day, dayPos) => (
              <section key={day.index} className="desk-day" data-day={day.tint}>
                <header className="desk-dayhead">
                  <p className="t-label desk-dayindex">
                    Day {day.index}
                    <span className="desk-daydate">{dayLabel(day.date)}</span>
                  </p>
                  <span className="desk-slotacts">
                    <button
                      type="button"
                      className="desk-slotact"
                      disabled={nextOpen(day) === null}
                      title={
                        nextOpen(day)
                          ? `Add a second ${PERIOD[nextOpen(day) as Period].toLowerCase()} stop to day ${day.index}`
                          : 'Six stops is the most a day holds'
                      }
                      aria-label={`Add a slot to day ${day.index}`}
                      onClick={() => {
                        const period = nextOpen(day)
                        if (period) addSlot(day.index, period)
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="desk-slotact"
                      disabled={lastClosable(day) === null}
                      title={
                        lastClosable(day)
                          ? `Close the empty second stop on day ${day.index}`
                          : 'Only an empty second stop can close'
                      }
                      aria-label={`Remove a slot from day ${day.index}`}
                      onClick={() => {
                        const slot = lastClosable(day)
                        if (slot) removeSlot(day.index, slot.id)
                      }}
                    >
                      &minus;
                    </button>
                  </span>

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

                {/* One period, one heading, holding the one or two stops it owns. */}
                {byPeriod(day).map(({ period, cells }) => (
                  <div key={period} className="desk-slot">
                    <p className="t-label desk-period">{PERIOD[period]}</p>
                    {cells.map(({ slot, index }) => {
                      const held = slot.placeId ? trip.options[slot.placeId] : undefined
                      return (
                        <SlotCell key={slot.id} dayIndex={day.index} slotIndex={index}>
                          {held ? (
                            <PlacedCard
                              place={held}
                              dayIndex={day.index}
                              slotIndex={index}
                              pinned={slot.pinned}
                              flying={flight > 0}
                              order={slotsBefore(dayPos) + index}
                              onPin={() => (slot.pinned ? unpin(held.id) : pin(held.id, day.index, index))}
                              onRemove={() => setDrawer({ dayIndex: day.index, slotIndex: index })}
                            />
                          ) : (
                            <p className="desk-empty">Empty</p>
                          )}
                        </SlotCell>
                      )
                    })}
                  </div>
                ))}
              </section>
            ))}
          </section>

          {/* Inside the product surface and labelled as not being part of it, per `TRD.md`. A live demo has to be
              resettable between runs by whoever is holding the laptop, not by opening devtools. */}
          <div className="desk-proto">
            <p className="t-label desk-protolegend">Prototype Controls</p>
            <p className="t-specimen">Not part of the product. Clears this browser and reloads the fixture.</p>
            <button type="button" className="desk-reset t-label" onClick={restart}>
              Start Over
            </button>
          </div>
        </div>
        {/* The way forward, on the Desk itself. It was reachable only through the sidebar island, and the person
            who asked for this could not find it. The line names the Book because the Book is what they were
            looking for, and it is one step past this button rather than on it. */}
        {settled && (
          <section className="desk-onward">
            <p className="desk-onward-line">
              The days are planned. Tick what you need to bring, and the Book is one step past that.
            </p>
            <button type="button" className="desk-onward-go t-label" onClick={() => navigate('/desk/before-we-go')}>
              Before We Go
            </button>
          </section>
        )}
      </main>

      <DragOverlay dropAnimation={null}>
        {dragged && (
          <article className="card card-pool card-ghost">
            <p className="t-name card-name">{dragged.name}</p>
            <p className="t-specimen card-line">
              {CLUSTER_AREA[dragged.cluster]} · {duration(dragged.dwellMin)} · {price(dragged)}
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
