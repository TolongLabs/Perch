import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { TripProvider } from '../state'
import { BeforeWeGo } from './BeforeWeGo'

const renderBeforeWeGo = () =>
  renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/desk/before-we-go']}>
        <BeforeWeGo />
      </MemoryRouter>
    </TripProvider>
  )

test('names the checklist destinations by what their controls open', () => {
  const html = renderBeforeWeGo()

  expect(html).toContain('>Open The Book</button>')
  expect(html).toContain('>The Manual</button>')
  expect(html).toContain('Tick every item to open the book and the manual.')
  expect(html).not.toContain('Print The Book')
  expect(html).not.toContain('The Handbook')
})
