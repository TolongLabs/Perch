import {
  type Announcements,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
  KeyboardSensor,
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
import { dayCostRM } from '../lib/cost'
import { clock, dayLabel, duration, money, price } from '../lib/format'
import { CLUSTER_AREA } from '../lib/schedule'
import { nextReplacement, tallyFor, votedIn } from '../lib/votes'
import { SLOTS_PER_PERIOD, useTrip } from '../state'
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

/**
 * What a period's heading can offer, which is one thing at a time: grow while it holds one stop, shrink while its
 * second is empty, and neither once both are filled. The day-level pair this replaces opened periods in order, so
 * a person who wanted a second afternoon had to open a second morning first.
 */
type SlotAct = { kind: 'add' } | { kind: 'remove'; slot: Slot } | { kind: 'full' }

const slotAct = (cells: { slot: Slot }[]): SlotAct => {
  if (cells.length < SLOTS_PER_PERIOD) return { kind: 'add' }
  const second = cells[1]?.slot
  return second && second.placeId === null ? { kind: 'remove', slot: second } : { kind: 'full' }
}

/** The three feasibility outcomes, in the words rule 5 uses. The copy never calls the scheduler AI. */
const FEASIBILITY: Record<DayFeasibility['status'], { label: string; state: ChipState }> = {
  green: { label: 'Fits', state: 'decided' },
  gold: { label: 'Fits But Runs Slow', state: 'gold' },
  red: { label: 'Overruns', state: 'at-risk' }
}

const ARROW: Record<string, { x: number; y: number }> = {
  ArrowRight: { x: 1, y: 0 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowUp: { x: 0, y: -1 }
}

/**
 * One arrow press moves the card one slot, not 25 pixels. dnd-kit's default getter translates by a fixed distance,
 * which on a four-column calendar took fourteen presses to cross two days; the drag worked and nobody would use it.
 * The nearest slot in the pressed direction is what an arrow key means on a grid.
 *
 * Distance is measured along the pressed axis first and across it at triple weight, so a column reads as a column:
 * pressing down inside Day 2 walks Day 2's slots rather than drifting into Day 3 because it happens to be nearer.
 */
const bySlot: KeyboardCoordinateGetter = (
  event,
  { currentCoordinates, context: { collisionRect, droppableRects, droppableContainers } }
) => {
  const dir = ARROW[event.code]
  if (!dir || !collisionRect) return undefined
  event.preventDefault()

  const from = { x: collisionRect.left + collisionRect.width / 2, y: collisionRect.top + collisionRect.height / 2 }
  let best: { score: number; x: number; y: number } | null = null

  for (const container of droppableContainers.getEnabled()) {
    const rect = droppableRects.get(container.id)
    if (!rect) continue
    const dx = rect.left + rect.width / 2 - from.x
    const dy = rect.top + rect.height / 2 - from.y
    const along = dx * dir.x + dy * dir.y
    // A slot the card already covers is not somewhere to move to.
    if (along < 24) continue
    const across = Math.abs(dx * dir.y + dy * dir.x)
    const score = along + across * 3
    if (!best || score < best.score) best = { score, x: currentCoordinates.x + dx, y: currentCoordinates.y + dy }
  }

  return best ? { x: best.x, y: best.y } : undefined
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
  const [confirmReset, setConfirmReset] = useState(false)
  const [range, setRange] = useState<Range>(() => ({
    start: trip.startDate,
    end: addDays(trip.startDate, trip.nights)
  }))

  /**
   * The keyboard sensor is not an extra, it is what makes the grip's own words true. dnd-kit puts `role="button"`,
   * `tabindex="0"`, `aria-roledescription="draggable"` and "press the space bar to pick up" on every grip whether or
   * not anything listens, so with a pointer sensor alone twelve cards told a screen reader to press a key that did
   * nothing and there was no other way to place a card without a mouse.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: bySlot })
  )

  /**
   * dnd-kit's own announcements name the ids: "Draggable item slot:1:0 was dropped over droppable area drop:3:0".
   * A person listening needs the place and the slot, which is what the surface already shows everyone else.
   */
  const announcements: Announcements = useMemo(() => {
    const named = (data: Record<string, unknown> | null | undefined) => {
      const id = data?.placeId
      return (typeof id === 'string' && trip.options[id]?.name) || 'the card'
    }
    const slot = (data: Record<string, unknown> | null | undefined) => {
      const dayIndex = data?.dayIndex
      const slotIndex = data?.slotIndex
      if (typeof dayIndex !== 'number' || typeof slotIndex !== 'number') return null
      const period = trip.days.find((d) => d.index === dayIndex)?.slots[slotIndex]?.period
      return period ? `day ${dayIndex}, ${PERIOD[period].toLowerCase()}` : `day ${dayIndex}`
    }
    return {
      onDragStart: ({ active }) => `Picked up ${named(active.data.current)}.`,
      onDragOver: ({ active, over }) => {
        const where = slot(over?.data.current)
        return where ? `${named(active.data.current)} is over ${where}.` : undefined
      },
      onDragEnd: ({ active, over }) => {
        const where = slot(over?.data.current)
        const name = named(active.data.current)
        return where ? `${name} is now in ${where}.` : `${name} stayed where it was.`
      },
      onDragCancel: ({ active }) => `Nothing moved. ${named(active.data.current)} is where it was.`
    }
  }, [trip])

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
      accessibility={{ announcements }}
      onDragStart={(e: DragStartEvent) =>
        setDragging((e.active.data.current as { placeId: string } | undefined)?.placeId ?? null)
      }
      onDragEnd={onDragEnd}
    >
      <main className="desk">
        <header className="desk-head">
          <Heading as="h1" info="Drag a card into a slot, then Optimize Plan to let the scheduler order each day.">
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
              Optimize Plan
            </button>
          </div>

          {/* Said out loud rather than left in a code comment. Optimizing rewrites every unpinned placement, and
              until now nothing on the surface told anyone that pinning is what survives it. */}
          {placed.size > 0 && (
            <p className="t-specimen desk-pinnote">Optimizing reorders every day. Pinned stops keep their slot.</p>
          )}
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
          <aside className="desk-pool" aria-labelledby="desk-pool-head">
            <div className="desk-legendrow">
              <h2 className="t-label desk-legend" id="desk-pool-head">
                Voted In
              </h2>
              <Info>
                Everything the group put at or above half the weighted vote, in tally order. Drag one into a slot, or
                let Optimize Plan place them.
              </Info>
            </div>
            <p className="t-specimen desk-poolcount">{pool.length} waiting</p>
            <div className="desk-poollist">
              {pool.map((entry) => {
                const p = trip.options[entry.placeId]
                return p ? <PoolCard key={p.id} place={p} unanimous={entry.unanimous} /> : null
              })}
            </div>
          </aside>

          <section className="desk-grid" aria-label="The calendar">
            {/* The first frame used to be twelve wells labelled Empty and no instruction anywhere but inside a
                hover tooltip on the page title. It goes the moment anything is placed. */}
            {placed.size === 0 && (
              <p className="desk-firstmove">
                Drag a card from Voted In into any slot, or press Optimize Plan to fill every day at once.
              </p>
            )}
            {trip.days.map((day, dayPos) => (
              <section key={day.index} className="desk-day" data-day={day.tint} aria-labelledby={`day-${day.index}`}>
                <header className="desk-dayhead">
                  <h2 className="t-label desk-dayindex" id={`day-${day.index}`}>
                    Day {day.index}
                    <span className="desk-daydate">{dayLabel(day.date)}</span>
                  </h2>
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

                {/* The two numbers a person decides on. Both were computed already and neither was shown: the walk
                    knows when the day ends and `dayCostRM` was imported only by the Book, so the Desk asked for a
                    decision while the Book kept the figures it needed. Read from the same walk as the chip. */}
                {day.feasibility && (
                  <p className="t-specimen desk-daysum">
                    {duration(day.feasibility.daySpanMin)} &middot; ends {clock(day.feasibility.endMin)} &middot;{' '}
                    {money(dayCostRM(day, trip.options))}
                  </p>
                )}

                {/* One period, one heading, holding the one or two stops it owns. */}
                {byPeriod(day).map(({ period, cells }) => {
                  const act = slotAct(cells)
                  return (
                    <div key={period} className="desk-slot">
                      <div className="desk-periodhead">
                        <h3 className="t-label desk-period">{PERIOD[period]}</h3>
                        {/* One control, never two: a period can only ever grow or shrink, and at the ceiling it is
                          the spent + that says why rather than nothing at all. */}
                        {act.kind === 'remove' ? (
                          <button
                            type="button"
                            className="desk-slotact"
                            title={`Close the empty second ${PERIOD[period].toLowerCase()} stop on day ${day.index}`}
                            aria-label={`Remove the second ${PERIOD[period].toLowerCase()} slot from day ${day.index}`}
                            onClick={() => removeSlot(day.index, act.slot.id)}
                          >
                            &minus;
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="desk-slotact"
                            disabled={act.kind === 'full'}
                            title={
                              act.kind === 'add'
                                ? `Add a second ${PERIOD[period].toLowerCase()} stop to day ${day.index}`
                                : 'Two stops is the most a period holds'
                            }
                            aria-label={
                              act.kind === 'add'
                                ? `Add a second ${PERIOD[period].toLowerCase()} stop to day ${day.index}`
                                : `Two stops is the most a ${PERIOD[period].toLowerCase()} holds`
                            }
                            onClick={() => addSlot(day.index, period)}
                          >
                            +
                          </button>
                        )}
                      </div>
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
                              <p className="desk-empty">
                                Empty
                                <span className="sr-only">
                                  {' '}
                                  &mdash; day {day.index}, {PERIOD[slot.period].toLowerCase()}
                                </span>
                              </p>
                            )}
                          </SlotCell>
                        )
                      })}
                    </div>
                  )
                })}
              </section>
            ))}
          </section>

          {/* Inside the product surface and labelled as not being part of it, per `TRD.md`. A live demo has to be
              resettable between runs by whoever is holding the laptop, not by opening devtools. */}
          <div className="desk-proto">
            <p className="t-label desk-protolegend">Prototype Controls</p>
            <p className="t-specimen">Not part of the product. Clears this browser and reloads the fixture.</p>
            {/* Two presses, not a browser dialog: a native confirm blocks the page and reads as a bug on camera.
                On a phone this button sits in the scroll path directly above Before We Go. */}
            {confirmReset ? (
              <div className="desk-resetask">
                <p className="t-specimen">This clears the whole trip. There is no undo.</p>
                <div className="desk-resetacts">
                  <button type="button" className="desk-reset desk-reset-go t-label" onClick={restart}>
                    Yes, Start Over
                  </button>
                  <button type="button" className="desk-reset t-label" onClick={() => setConfirmReset(false)}>
                    Keep This Trip
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="desk-reset t-label" onClick={() => setConfirmReset(true)}>
                Start Over
              </button>
            )}
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
