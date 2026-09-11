import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { Landing } from './Landing'

const renderLanding = () =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={['/']}>
      <Landing />
    </MemoryRouter>
  )

test('offers the theme switch on the landing page, named for the theme it will set', () => {
  // The store is empty in this runtime, so the page follows the OS, which is light here. The switch is named for the
  // theme it will set, the same control and labels the app's top bar carries, so a reader who chose dark in the app
  // sees the same toggle - and the dark page - on the first screen.
  const html = renderLanding()
  expect(html).toContain('aria-label="Switch to the dark theme"')
})

test('names the three surfaces as the three features', () => {
  // One interaction, three surfaces: the feature list is deliberately this short, so all three must be present.
  const html = renderLanding()
  expect(html).toContain('The Deck')
  expect(html).toContain('The Desk')
  expect(html).toContain('The Book')
})

test('keeps the theme switch the same solid button as Start Planning', async () => {
  // The switch sits over a photograph and carries a 44px icon, but in colour it is Start Planning: same ink ground,
  // same paper face, same hover fill. A revert typically splits them again - a paper chip next to an ink CTA.
  const css = await Bun.file(new URL('./Landing.css', import.meta.url)).text()
  const go = css.slice(css.indexOf('.land-go {'), css.indexOf('}', css.indexOf('.land-go {')))
  const theme = css.slice(css.indexOf('.land-theme {'), css.indexOf('}', css.indexOf('.land-theme {')))
  expect(go).toContain('background: var(--ink)')
  expect(go).toContain('color: var(--paper)')
  expect(theme).toContain('background: var(--ink)')
  expect(theme).toContain('color: var(--paper)')
  expect(theme).toContain('width: 44px')
  expect(theme).toContain('height: 44px')
  expect(css).toContain('.land-theme:hover,\n.land-theme:focus-visible')
  expect(css).toContain('color-mix(in oklab, var(--open) 34%, var(--ink))')
})

test('anchors the three facts one per track on the content column, prose left-aligned', async () => {
  // Each fact caps at 34ch inside its 1fr track; holding each block to its own edge (start, centre, end) keeps the
  // last one at the right content edge rather than the viewport, so the composition stays level with the page.
  const css = await Bun.file(new URL('./Landing.css', import.meta.url)).text()
  expect(css).toContain('.land-facts > div:nth-child(1)')
  expect(css).toContain('justify-self: start')
  expect(css).toContain('.land-facts > div:nth-child(2)')
  expect(css).toContain('justify-self: center')
  expect(css).toContain('.land-facts > div:nth-child(3)')
  expect(css).toContain('justify-self: end')
})
