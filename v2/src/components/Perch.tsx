import { useEffect, useRef } from 'react'
import type { Place } from '../data/types'
import { duration, price } from '../lib/format'
import { CLUSTER_AREA } from '../lib/schedule'
import './Perch.css'

/**
 * The drawer that opens when a placed card is removed. It never lets the trip empty: it offers the next-ranked
 * voted-in card that fits the slot, and on a day already down to its last two stops it is the only way out.
 *
 * The rank numeral is the card's real position in the tally, which is the one place `DESIGN.md` allows a numeral.
 */
export const Perch = ({
  place,
  rank,
  required,
  onSwap,
  onEmpty,
  onCancel
}: {
  /** Null when the tally has nothing that fits this slot, which is a real outcome and says so. */
  place: Place | null
  rank: number | null
  /** True when leaving the slot empty would take the day below two stops. */
  required: boolean
  onSwap: () => void
  onEmpty: () => void
  onCancel: () => void
}) => {
  const body = useRef<HTMLDivElement>(null)

  /**
   * Escape keeps what is there, which is the safe answer in every case including the required one. Without it the
   * drawer had no keyboard exit at all: it is not modal, so the browser rescues nothing, and its two buttons were
   * 58 tab stops from the control that opened it.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    body.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="perch" role="dialog" aria-label="Replace this stop" aria-modal="false">
      {/* Focused on open so the answer is one tab away rather than fifty-eight. `tabIndex={-1}` keeps it out of the
          tab order itself, and a programmatic focus paints no ring. */}
      <div className="perch-body" ref={body} tabIndex={-1}>
        <p className="t-label perch-legend">{required ? 'This Day Needs Two Stops' : 'Next On The Perch'}</p>

        {place ? (
          <div className="perch-row">
            {rank !== null && (
              <span className="perch-rank">
                <span className="perch-rank-label">Ranked </span>
                {rank}
              </span>
            )}
            <span className="perch-lead">
              <span className="t-name perch-name">{place.name}</span>
              <span className="t-specimen perch-line">
                {CLUSTER_AREA[place.cluster]} · {duration(place.dwellMin)} · {price(place)}
              </span>
            </span>
            <button type="button" className="perch-swap t-label" onClick={onSwap}>
              Swap In
            </button>
          </div>
        ) : (
          <p className="t-specimen">
            Nothing left in the tally fits this slot on this day. Vote more places in, or leave it empty.
          </p>
        )}

        <div className="perch-acts">
          {!required && (
            <button type="button" className="perch-alt t-label" onClick={onEmpty}>
              Leave It Empty
            </button>
          )}
          <button type="button" className="perch-alt t-label" onClick={onCancel}>
            Keep What Is There
          </button>
        </div>
      </div>
    </div>
  )
}
