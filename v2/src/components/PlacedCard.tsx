import { useDraggable } from '@dnd-kit/core'
import { X } from 'lucide-react'
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
        <button
          type="button"
          className="card-act t-label"
          onClick={onPin}
          aria-pressed={pinned}
          title="A pinned stop keeps its slot the next time you Optimize Plan"
        >
          {pinned ? 'Unpin' : 'Pin'}
        </button>
        {/* Drawn apart from Pin, but by its glyph rather than by its colour. The two were pixel-identical outline
            pills on twelve cards, one protecting a stop and one destroying it, on a surface with no undo; twelve
            crimson pills at rest fixed that and cost the calendar its colour balance, on the surface the film
            watches longest. The at-risk role means something changed, so it belongs to the moment of intent. */}
        <button
          type="button"
          className="card-act card-act-risk t-label"
          onClick={onRemove}
          title="Take this stop off the day. The perch offers a replacement first"
        >
          <X size={11} strokeWidth={2.25} aria-hidden="true" />
          Remove
        </button>
      </div>
    </article>
  )
}
