import { expect, test } from 'bun:test'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useSwipeGesture } from './useSwipeGesture'

type Gesture = ReturnType<typeof useSwipeGesture>

const renderGesture = (): Gesture => {
  let gesture: Gesture | undefined

  const Harness = () => {
    gesture = useSwipeGesture(() => {})
    return null
  }

  renderToStaticMarkup(<Harness />)
  if (!gesture) throw new Error('Gesture harness did not render')
  return gesture
}

const capturedPointers = new Set<number>()
const pointerTarget = {
  setPointerCapture: (pointerId: number) => capturedPointers.add(pointerId),
  hasPointerCapture: (pointerId: number) => capturedPointers.has(pointerId),
  releasePointerCapture: (pointerId: number) => capturedPointers.delete(pointerId)
} as unknown as HTMLElement

const pointerEvent = (pointerId: number, clientX = 0, clientY = 0) =>
  ({ pointerId, clientX, clientY, currentTarget: pointerTarget }) as unknown as ReactPointerEvent<HTMLElement>

const clickEvent = (detail: number) => {
  let prevented = false
  let stopped = false

  return {
    event: {
      detail,
      preventDefault: () => {
        prevented = true
      },
      stopPropagation: () => {
        stopped = true
      }
    } as unknown as ReactMouseEvent<HTMLElement>,
    prevented: () => prevented,
    stopped: () => stopped
  }
}

test('blocks control clicks after multipointer invalidation while the original card pointer is active', () => {
  const gesture = renderGesture()
  gesture.handlers.onPointerDown(pointerEvent(1))
  gesture.handlers.onPointerDown(pointerEvent(2))

  for (const detail of [0, 1]) {
    const click = clickEvent(detail)
    gesture.handlers.onClickCapture(click.event)
    expect(click.prevented()).toBe(true)
    expect(click.stopped()).toBe(true)
  }
})

test('allows a keyboard control click while the Deck is idle', () => {
  const gesture = renderGesture()
  const click = clickEvent(0)

  gesture.handlers.onClickCapture(click.event)

  expect(click.prevented()).toBe(false)
  expect(click.stopped()).toBe(false)
})

test('keeps controls suppressed through the drag click-leak window', () => {
  const originalNow = Date.now
  let now = 1_000
  Date.now = () => now

  try {
    const gesture = renderGesture()
    gesture.handlers.onPointerDown(pointerEvent(1))
    gesture.handlers.onPointerMove(pointerEvent(1, 12))
    gesture.handlers.onPointerUp(pointerEvent(1, 12))

    now = 1_500
    const boundaryClick = clickEvent(1)
    gesture.handlers.onClickCapture(boundaryClick.event)
    expect(boundaryClick.prevented()).toBe(true)
    expect(boundaryClick.stopped()).toBe(true)

    now = 1_501
    const laterClick = clickEvent(0)
    gesture.handlers.onClickCapture(laterClick.event)
    expect(laterClick.prevented()).toBe(false)
    expect(laterClick.stopped()).toBe(false)
  } finally {
    Date.now = originalNow
    capturedPointers.clear()
  }
})
