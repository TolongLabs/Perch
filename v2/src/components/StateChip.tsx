import type { ReactNode } from 'react'
import './StateChip.css'

export type ChipState = 'open' | 'decided' | 'at-risk' | 'gold'

/**
 * `DESIGN.md`: a 10 percent tint, a 1px rule in the full state colour, and a plumage dot. Never a solid fill, which
 * would carry no more information than the tint already does. The 1px here is deliberate and is the one place the
 * 3px outline rule does not apply; the spec states it twice.
 */
export const StateChip = ({ state, children }: { state: ChipState; children: ReactNode }) => (
  <span className="state-chip t-label" data-state={state}>
    <span className="state-dot" aria-hidden="true" />
    {children}
  </span>
)
