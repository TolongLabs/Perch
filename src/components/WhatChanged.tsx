import { describeDelta } from '../lib/repair'
import { useTrip } from '../state'
import './WhatChanged.css'

/**
 * The only thing in the product that earns a second visit. It is a strip on both surfaces, not a screen.
 */
export const WhatChanged = ({ compact = false }: { compact?: boolean }) => {
  const { trip, undo } = useTrip()
  const latest = trip.changes[0]
  if (!latest) return null

  return (
    <section className="changed" data-compact={compact} aria-label="What changed">
      <p className="t-label changed-kicker">What Changed</p>
      <p className="changed-sentence">{latest.sentence}</p>
      <p className="t-label changed-delta">{describeDelta(latest.deltaMin, latest.deltaRM)}</p>

      {!compact && (
        <button type="button" className="changed-undo t-label" onClick={undo}>
          Put It Back
        </button>
      )}
    </section>
  )
}
