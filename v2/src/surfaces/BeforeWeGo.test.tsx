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

test('renders Open The Book and The Manual as the same button in every colour state', async () => {
  // The two unlock against the same gate and only differ in where they go, so each state is one shared rule. The
  // guard is the combined selector: a change that promotes one control's colour over the other's drops it.
  const css = await Bun.file(new URL('./BeforeWeGo.css', import.meta.url)).text()
  expect(css).toContain('.bwg-print,\n.bwg-handbook {')
  expect(css).toContain('.bwg-print:hover:not(:disabled),')
  expect(css).toContain('.bwg-handbook:hover:not(:disabled),')
  expect(css).toContain('.bwg-print:disabled,\n.bwg-handbook:disabled {')
  expect(css).toContain('color-mix(in oklab, var(--ink) 46%, transparent)')
})
