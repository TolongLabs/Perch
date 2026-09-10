import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { TripProvider } from '../state'
import { Onboarding } from './Onboarding'

const renderOnboarding = () =>
  renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/new']}>
        <Onboarding />
      </MemoryRouter>
    </TripProvider>
  )

test('offers Other choices without showing custom fields before they are selected', () => {
  const html = renderOnboarding()

  expect(html.match(/>Other</g)).toHaveLength(2)
  expect(html).not.toContain('Other Activity')
  expect(html).not.toContain('Other Destination')
  expect(html).not.toContain('What You Want')
  expect(html).not.toContain('Where To')
})
