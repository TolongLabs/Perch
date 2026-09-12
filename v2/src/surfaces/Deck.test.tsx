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
  expect(html).toContain('Must Go · 1 Only')
  expect(html).toContain('Voting as Aisyah')
  expect(html).toContain('>Change Voter</button>')
  expect(html).toContain('>Pass</span>')
  expect(html).toContain('>Keep</span>')
  expect(html).toContain('>Skip</span>')
  expect(html).not.toContain('class="deck-acts"')
})

test('strengthens only the dark Keep flash without changing its timing', async () => {
  const css = await Bun.file(new URL('./Deck.css', import.meta.url)).text()
  expect(css).toMatch(/:root\[data-theme="dark"\] \.deck-flash\[data-flash="keep"\]\s*\{\s*--flash-peak: 0\.85;/)
  expect(css).toContain('to left, var(--decided), transparent min(62%, 420px)')
  expect(css).toContain('animation: flash-out var(--flash) var(--ease-expo) forwards;')
})

test('applies red glow to Pass flash using Crimson Sunbird token (#108)', async () => {
  const css = await Bun.file(new URL('./Deck.css', import.meta.url)).text()
  expect(css).toContain('.deck-flash[data-flash="pass"]')
  expect(css).toContain('var(--at-risk)')
  expect(css).toMatch(/:root\[data-theme="dark"\] \.deck-flash\[data-flash="pass"\]\s*\{\s*--flash-peak: 0\.85;/)
})

test('sizes the desktop reel immersively up to 520px (#108)', async () => {
  const css = await Bun.file(new URL('./Deck.css', import.meta.url)).text()
  expect(css).toContain('max-width: 720px;')
  expect(css).toContain('min(\n    520px,\n    max(420px')
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
