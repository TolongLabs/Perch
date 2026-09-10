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
