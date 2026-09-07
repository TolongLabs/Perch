import type { SlotState } from '../data/types'
import './StateChip.css'

const LABEL: Record<SlotState, string> = { open: 'Open', decided: 'Settled', 'at-risk': 'At Risk' }

export const StateChip = ({ state }: { state: SlotState }) => (
  <span className="chip t-label" data-state={state}>
    <span className="chip-dot" aria-hidden="true" />
    {LABEL[state]}
  </span>
)
