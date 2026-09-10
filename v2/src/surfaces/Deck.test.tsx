import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { BottomDock } from '../chrome/SidebarIsland'
import { trip } from '../data/trip'
import { TripProvider } from '../state'
import { Deck } from './Deck'

const renderDeck = () =>
  renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/t/tokyo-2026/swipe']}>
        <Deck />
      </MemoryRouter>
    </TripProvider>
  )

test('offers every swipe direction as an accessible control without a duplicate action row', () => {
  const html = renderDeck()

  expect(html.match(/class="deck-direction/g)).toHaveLength(4)
  expect(html).toContain('Must Go One Only')
  expect(html).toContain('>Pass</span>')
  expect(html).toContain('>Keep</span>')
  expect(html).toContain('>Skip</span>')
  expect(html).not.toContain('class="deck-acts"')
})

test('announces reel progress after each answer', () => {
  const html = renderDeck()

  expect(html).toContain('aria-live="polite"')
  expect(html).toContain('aria-atomic="true"')
})

test('exposes exactly one current destination from the Deck', () => {
  const html = renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/t/tokyo-nov-2026/swipe']}>
        <BottomDock />
      </MemoryRouter>
    </TripProvider>
  )

  expect(html.match(/aria-current="page"/g)).toHaveLength(1)
})

test('closes the reels once voting has ended', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => JSON.stringify({ ...trip, votingClosedAt: '2026-09-10T12:00:00.000Z' }),
      setItem: () => undefined
    }
  })
  try {
    const html = renderDeck()
    expect(html).toContain('Voting Is Closed')
    expect(html).toContain('>See The Final Tally</button>')
    expect(html).not.toContain('class="deck-controls"')
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
