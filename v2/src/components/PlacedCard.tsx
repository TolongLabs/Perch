import { useDraggable } from '@dnd-kit/core'
import type { CSSProperties } from 'react'
import type { Place } from '../data/types'
import { duration, price } from '../lib/format'
import { CLUSTER_AREA } from '../lib/schedule'
import { PlateThumb } from './PlateThumb'
import './PlacedCard.css'

const Line = ({ place }: { place: Place }) => (
  <p className="t-specimen card-line">
    {CLUSTER_AREA[place.cluster]} · {duration(place.dwellMin)} · {price(place)}
  </p>
)

/** A voted-in card waiting in the sidebar. Unanimous ones carry the oriole mark, same as on The Tally. */
export const PoolCard = ({ place, unanimous }: { place: Place; unanimous: boolean }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool:${place.id}`,
    data: { placeId: place.id }
  })

  return (
    <article
      ref={setNodeRef}
      className="card card-pool"
      data-dragging={isDragging}
      data-unanimous={unanimous}
      {...listeners}
      {...attributes}
    >
      <PlateThumb place={place} />
      <div className="card-body">
        <p className="t-name card-name">{place.name}</p>
        <p className="t-label card-kind">{place.kind}</p>
        <Line place={place} />
      </div>
    </article>
  )
}

/**
 * A card sitting in a slot. Draggable to another slot, and carrying the two controls the owner has over it: Pin, which
 * survives the next Optimize Plan, and Remove, which opens the drawer rather than leaving a hole.
 */
export const PlacedCard = ({
  place,
  dayIndex,
  slotIndex,
  pinned,
  flying,
  order,
  onPin,
  onRemove
}: {
  place: Place
  dayIndex: number
  slotIndex: number
  pinned: boolean
  /** True for the one render after Optimize Plan, which is what plays the fly-in. */
  flying: boolean
  /** Position in the stagger, so the cards land in reading order rather than all at once. */
  order: number
  onPin: () => void
  onRemove: () => void
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `slot:${dayIndex}:${slotIndex}`,
    data: { placeId: place.id, dayIndex, slotIndex }
  })

  return (
    <article
      ref={setNodeRef}
      className="card card-placed"
      data-dragging={isDragging}
      data-pinned={pinned}
      data-flying={flying}
      style={flying ? ({ '--i': order } as CSSProperties) : undefined}
    >
      <div className="card-grip" {...listeners} {...attributes}>
        <p className="t-name card-name">{place.name}</p>
        <Line place={place} />
      </div>
      <div className="card-acts">
        <button type="button" className="card-act t-label" onClick={onPin} aria-pressed={pinned}>
          {pinned ? 'Unpin' : 'Pin'}
        </button>
        <button type="button" className="card-act t-label" onClick={onRemove}>
          Remove
        </button>
      </div>
    </article>
  )
}
