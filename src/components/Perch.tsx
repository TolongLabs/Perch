import type { Day, Slot } from '../data/types'
import { duration, money, travel } from '../lib/format'
import { describeDelta, whyNot } from '../lib/repair'
import { useTrip } from '../state'
import './Perch.css'

type Props = { day: Day; slot: Slot; onClose: () => void }

/**
 * The bench, opened. It is not a list of suggestions: it is what the same choosing already ranked, so the rows are
 * numbered from two and the row that cannot take the slot says why instead of disappearing.
 */
export const Perch = ({ day, slot, onClose }: Props) => {
  const { trip, swap } = useTrip()
  const outgoing = slot.chosenId ? trip.options[slot.chosenId] : undefined

  return (
    <div className="perch-scrim" role="dialog" aria-label="The perch">
      <button type="button" className="perch-dismiss" onClick={onClose} aria-label="Close the perch" />

      <div className="perch" data-day={day.tint}>
        <header className="perch-head">
          <p className="t-label perch-kicker">
            The Perch &middot; Day {day.index}, {slot.period}
          </p>
          <h2 className="t-plate-title">{outgoing ? outgoing.name : 'Nothing chosen'}</h2>
          <p className="t-specimen">
            {outgoing
              ? `${travel(outgoing.travelMin)} · ${money(outgoing.costRM)} · ${duration(outgoing.dwellMin)}`
              : ''}
          </p>
        </header>

        <p className="perch-note">
          Everything below lost this slot when you chose. It stays ranked, so a swap needs no one&rsquo;s permission.
        </p>

        <ul className="perch-rows">
          {slot.benchIds.map((id, i) => {
            const option = trip.options[id]
            if (!option) return null
            const blocked = whyNot(option, slot, day, outgoing)
            const delta = describeDelta(
              option.travelMin - (outgoing?.travelMin ?? 0),
              option.costRM - (outgoing?.costRM ?? 0)
            )

            return (
              <li
                key={id}
                className="perch-row"
                data-blocked={blocked !== null}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="perch-rank">{i + 2}</span>

                <span className="perch-body">
                  <span className="t-name">{option.name}</span>
                  <span className="t-specimen">
                    {option.area} &middot; {duration(option.dwellMin)} &middot; {money(option.costRM)}
                  </span>
                  <span className="perch-delta t-label">{blocked ?? delta}</span>
                </span>

                {blocked ? null : (
                  <button
                    type="button"
                    className="perch-swap t-label"
                    onClick={() => {
                      swap(day.index, slot.id, id)
                      onClose()
                    }}
                  >
                    Swap
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <button type="button" className="perch-close t-label" onClick={onClose}>
          Leave It As It Is
        </button>
      </div>
    </div>
  )
}
