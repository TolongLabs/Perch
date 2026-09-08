import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

export type Swipe = 'keep' | 'pass'

/** Past this many pixels the card is gone; inside it, it snaps back. Roughly a quarter of a 390px screen. */
const THRESHOLD = 96

/**
 * A horizontal drag on the top card. Pointer events rather than touch or mouse, so one path covers finger, trackpad
 * and stylus, and pointer capture keeps the drag alive when the finger leaves the card.
 *
 * Whether a drag is live is held in a ref, not in the state below it. A quick flick delivers pointerdown, pointermove
 * and pointerup inside a single frame, and a handler that read `dragging` from state would still see `false` on the
 * way up and drop the swipe. The state exists only to drive the transform; the ref is what decides.
 */
export const useSwipeGesture = (onCommit: (swipe: Swipe) => void, enabled = true) => {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const live = useRef(false)
  const from = useRef(0)

  const down = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      from.current = e.clientX
      live.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled]
  )

  const move = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!live.current) return
    setDx(e.clientX - from.current)
  }, [])

  const up = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!live.current) return
      live.current = false
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
      setDragging(false)
      const travelled = e.clientX - from.current
      setDx(0)
      if (Math.abs(travelled) >= THRESHOLD) onCommit(travelled > 0 ? 'keep' : 'pass')
    },
    [onCommit]
  )

  return {
    dx,
    dragging,
    /** How committed the drag is, 0 to 1. The card fades as this approaches 1. */
    progress: Math.min(Math.abs(dx) / THRESHOLD, 1),
    handlers: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up }
  }
}
