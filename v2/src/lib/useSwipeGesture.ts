import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

export type Swipe = 'keep' | 'pass' | 'must'

/** Past this many pixels the card is gone; inside it, it snaps back. Roughly a quarter of a 390px screen. */
const THRESHOLD = 96

/**
 * Up is held to a longer reach, and has to beat the horizontal travel outright rather than merely pass its own bar.
 * A Must Go costs the member the only one they have, and a hand throwing a card to the right lifts as it goes, so
 * an up that merely cleared 96px would take keeps with it.
 */
const UP_THRESHOLD = 112

/**
 * A drag on the top card: right keeps, left passes, up is a Must Go while the member still has one. `allowUp` off
 * takes the third answer out of the gesture entirely rather than letting it be made and refused: the card stops
 * following the axis, the preview never names it, and the release cannot commit it. Pointer events rather than touch or mouse, so one path covers finger, trackpad
 * and stylus, and pointer capture keeps the drag alive when the finger leaves the card.
 *
 * Whether a drag is live is held in a ref, not in the state below it. A quick flick delivers pointerdown, pointermove
 * and pointerup inside a single frame, and a handler that read `dragging` from state would still see `false` on the
 * way up and drop the swipe. The state exists only to drive the transform; the ref is what decides.
 */
export const useSwipeGesture = (onCommit: (swipe: Swipe) => void, enabled = true, allowUp = true) => {
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const live = useRef(false)
  const from = useRef({ x: 0, y: 0 })

  const down = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      from.current = { x: e.clientX, y: e.clientY }
      live.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled]
  )

  const move = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!live.current) return
      setDx(e.clientX - from.current.x)
      // Down does nothing, so the card does not follow a downward drag: an axis the card moves on but never commits
      // to reads as a swipe the app dropped. Once the member's one Must Go is spent, up is that axis too.
      setDy(allowUp ? Math.min(0, e.clientY - from.current.y) : 0)
    },
    [allowUp]
  )

  const up = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!live.current) return
      live.current = false
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
      setDragging(false)
      const x = e.clientX - from.current.x
      const up = from.current.y - e.clientY
      setDx(0)
      setDy(0)
      if (allowUp && up >= UP_THRESHOLD && up > Math.abs(x)) onCommit('must')
      else if (Math.abs(x) >= THRESHOLD) onCommit(x > 0 ? 'keep' : 'pass')
    },
    [onCommit, allowUp]
  )

  return {
    dx,
    dy,
    dragging,
    /**
     * What releasing now would actually do, and null when it would do nothing. The same two thresholds the commit
     * uses, because anything else is a promise the release breaks: read off the old rule, a drag of 90 right and 95
     * up showed the Must Go outline and committed nothing, and one of 104 and 108 showed it and recorded a Keep.
     * There is no undo on this surface, so a preview that lies is a vote the member cannot find or take back.
     */
    heading:
      allowUp && -dy >= UP_THRESHOLD && -dy > Math.abs(dx)
        ? ('must' as const)
        : Math.abs(dx) >= THRESHOLD
          ? dx > 0
            ? ('keep' as const)
            : ('pass' as const)
          : null,
    /** How committed the drag is, 0 to 1. The card fades as this approaches 1. */
    progress: Math.min(Math.max(Math.abs(dx) / THRESHOLD, -dy / UP_THRESHOLD), 1),
    handlers: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up }
  }
}
