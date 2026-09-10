import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { navItems } from '../chrome/SidebarIsland'
import { TripProvider } from '../state'
import { Handbook } from './Handbook'

const renderManual = () =>
  renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/t/tokyo-nov-2026/handbook']}>
        <Handbook />
      </MemoryRouter>
    </TripProvider>
  )

test('uses The Manual consistently in the surface and navigation', () => {
  const html = renderManual()
  const manual = navItems('tokyo-nov-2026').find((item) => item.to.endsWith('/handbook'))

  expect(html).toContain('>The Manual</span>')
  expect(html).not.toContain('The Handbook')
  expect(manual?.label).toBe('The Manual')
})

test('renders scannable guide titles before smaller descriptions and gives News its own panel', () => {
  const html = renderManual()
  const title = html.indexOf('class="hb-item-title">Umbrella</h3>')
  const description = html.indexOf('class="t-prose hb-item-description">A compact umbrella.')

  expect(html).toContain('class="hb-guide"')
  expect(title).toBeGreaterThan(-1)
  expect(description).toBeGreaterThan(title)
  expect(html).toContain('class="hb-news hb-section"')
  expect(html).toContain('not a live forecast')
})

test('offers separate browser-local personal note forms for Take Care and Packing', () => {
  const html = renderManual()

  expect(html.match(/class="hb-note-form"/g)).toHaveLength(2)
  expect(html.match(/data-empty="true"/g)).toHaveLength(2)
  expect(html).toContain('aria-label="Add A Take Care Note"')
  expect(html).toContain('aria-label="Add A Packing Note"')
  expect(html.match(/maxLength="1000"/g)).toHaveLength(2)
  expect(html.match(/>Add Note<\/button>/g)).toHaveLength(2)
  expect(html.match(/Saved only in this browser\./g)).toHaveLength(2)
})
