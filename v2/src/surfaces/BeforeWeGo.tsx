import { useNavigate } from 'react-router-dom'
import { StateChip } from '../components/StateChip'
import { Check, Heading } from '../components/Ui'
import type { ChecklistItem, Trip } from '../data/types'
import { dayLabel } from '../lib/format'
import { useTrip } from '../state'
import './BeforeWeGo.css'

/** Japan asks for a passport valid on the way out, and six months clear is the rule of thumb travellers are given. */
const sixMonthsAfter = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`)
  d.setMonth(d.getMonth() + 6)
  return `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })} ${d.getFullYear()}`
}

/**
 * Each item is read off the trip rather than written down beside it, which is what makes this a checklist derived from
 * the plan and not a list of travel advice. Where the trip cannot answer yet, the row says so instead of inventing one.
 */
const detailFor = (item: ChecklistItem, trip: Trip): string => {
  const last = trip.days[trip.days.length - 1]
  const placed = trip.days.flatMap((d) => d.slots.map((s) => s.placeId).filter((id): id is string => id !== null))
  const yen = placed.reduce((sum, id) => sum + (trip.options[id]?.yen ?? 0), 0)

  switch (item.id) {
    case 'passport':
      return `Valid past ${sixMonthsAfter(last?.date ?? trip.startDate)}, six months clear of the last day.`
    case 'suica': {
      const day = trip.days.find((d) => d.slots.some((s) => s.placeId))
      return day
        ? `From Day 1, ${dayLabel(day.date)}. Trains and konbini both take it.`
        : 'Trains and konbini both take it.'
    }
    case 'teamlab': {
      const on = trip.days.find((d) => d.slots.some((s) => s.placeId === 'teamlab-planets'))
      return on
        ? `On Day ${on.index}, ${dayLabel(on.date)}. Tickets are dated and sell out.`
        : 'Not on the calendar yet. Tickets are dated and sell out.'
    }
    case 'yen':
      return yen > 0
        ? `About ¥${yen.toLocaleString('en')} at the gates across the trip, before food.`
        : 'Nothing on the calendar yet, so there is no gate total to read.'
    case 'insurance':
      return `${trip.days.length} days, ${trip.nights} nights, ${trip.destination}.`
    case 'jrpass':
      return `${trip.legs.length === 1 ? 'One leg' : `${trip.legs.length} legs`}, ${trip.destination} only. Nothing intercity to cover.`
    default:
      return ''
  }
}

export const BeforeWeGo = () => {
  const navigate = useNavigate()
  const { trip, tick } = useTrip()

  const done = trip.checklist.filter((i) => i.ticked).length
  const total = trip.checklist.length
  const ready = done === total

  return (
    <main className="bwg">
      <header className="bwg-head">
        <Heading as="h1" info="Everything here is read off the trip. Tick it once it is true.">
          <span className="t-display">Before We Go</span>
        </Heading>
        <StateChip state={ready ? 'decided' : 'open'}>
          {done} Of {total} Done
        </StateChip>
      </header>

      <section className="bwg-list" data-state={ready ? 'decided' : 'open'}>
        <ul>
          {trip.checklist.map((item) => (
            <li key={item.id} className="bwg-row">
              <Check
                label={item.label}
                detail={detailFor(item, trip)}
                checked={item.ticked}
                onChange={() => tick(item.id)}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="bwg-foot">
        <button type="button" className="bwg-print t-label" disabled={!ready} onClick={() => navigate(`/t/${trip.id}`)}>
          Open The Book
        </button>
        {/* The second thing the checklist unlocks, and an outline one: `DESIGN.md` allows a screen one solid button
            and Open The Book is it. */}
        <button
          type="button"
          className="bwg-handbook t-label"
          disabled={!ready}
          onClick={() => navigate(`/t/${trip.id}/handbook`)}
        >
          The Manual
        </button>
        {!ready && <p className="t-specimen">Tick every item to open the book and the manual.</p>}
      </div>

      <button type="button" className="bwg-back t-label" onClick={() => navigate('/desk')}>
        Back To Desk
      </button>
    </main>
  )
}
