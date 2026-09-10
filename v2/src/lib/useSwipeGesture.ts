import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState
} from 'react'

export type Swipe = 'keep' | 'pass' | 'must' | 'skip'

/** Past this many pixels the card is gone; inside it, it snaps back. Roughly a quarter of a 390px screen. */
const THRESHOLD = 96

/** Must Go needs the longer reach because it spends the member's only one. */
const UP_THRESHOLD = 112
const CLICK_SLOP = 8

/**
 * A drag on the top card: right keeps, left passes, up is a Must Go while available, and down skips. Pointer capture
 * keeps one-finger drags intact; a second pointer invalidates the whole gesture so a pinch can never become a vote.
 */
export const useSwipeGesture = (onCommit: (swipe: Swipe) => void, enabled = true, allowUp = true) => {
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const activePointer = useRef<number | null>(null)
  const live = useRef(false)
  const invalid = useRef(false)
  const moved = useRef(false)
  const suppressClickUntil = useRef(0)
  const from = useRef({ x: 0, y: 0 })

  const down = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      if (activePointer.current !== null) {
        invalid.current = true
        moved.current = true
        live.current = false
        setDragging(false)
        setDx(0)
        setDy(0)
        return
      }
      activePointer.current = e.pointerId
      from.current = { x: e.clientX, y: e.clientY }
      invalid.current = false
      moved.current = false
      live.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled]
  )

  const move = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!live.current || activePointer.current !== e.pointerId) return
      const x = e.clientX - from.current.x
      const y = e.clientY - from.current.y
      if (Math.hypot(x, y) >= CLICK_SLOP) moved.current = true
      setDx(x)
      setDy(allowUp ? y : Math.max(0, y))
    },
    [allowUp]
  )

  const finish = useCallback(
    (e: ReactPointerEvent<HTMLElement>, cancelled: boolean) => {
      if (activePointer.current !== e.pointerId) return
      const x = e.clientX - from.current.x
      const y = e.clientY - from.current.y
      const canCommit = live.current && !invalid.current && !cancelled
      if (moved.current || invalid.current) suppressClickUntil.current = Date.now() + 500
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
      activePointer.current = null
      live.current = false
      invalid.current = false
      moved.current = false
      setDragging(false)
      setDx(0)
      setDy(0)
      if (!canCommit) return
      if (allowUp && -y >= UP_THRESHOLD && -y > Math.abs(x)) onCommit('must')
      else if (y >= THRESHOLD && y > Math.abs(x)) onCommit('skip')
      else if (Math.abs(x) >= THRESHOLD) onCommit(x > 0 ? 'keep' : 'pass')
    },
    [onCommit, allowUp]
  )

  const up = useCallback((e: ReactPointerEvent<HTMLElement>) => finish(e, false), [finish])
  const cancel = useCallback((e: ReactPointerEvent<HTMLElement>) => finish(e, true), [finish])
  const click = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    if (Date.now() > suppressClickUntil.current) return
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return {
    dx,
    dy,
    dragging,
    heading:
      allowUp && -dy >= UP_THRESHOLD && -dy > Math.abs(dx)
        ? ('must' as const)
        : dy >= THRESHOLD && dy > Math.abs(dx)
          ? ('skip' as const)
          : Math.abs(dx) >= THRESHOLD
            ? dx > 0
              ? ('keep' as const)
              : ('pass' as const)
            : null,
    /** How committed the drag is, 0 to 1. The card fades as this approaches 1. */
    progress: Math.min(Math.max(Math.abs(dx) / THRESHOLD, dy / THRESHOLD, allowUp ? -dy / UP_THRESHOLD : 0), 1),
    handlers: {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: cancel,
      onClickCapture: click
    }
  }
}
