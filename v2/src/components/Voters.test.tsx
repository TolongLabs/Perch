import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Person, Votes } from '../data/types'
import { Voters } from './Voters'

const party: Person[] = [
  { id: 'owner', name: 'Owner', initials: 'OW' },
  { id: 'partial', name: 'Partial', initials: 'PA' },
  { id: 'complete', name: 'Complete', initials: 'CO' }
]

const votes: Votes = {
  owner: {},
  partial: { first: 'must', second: null },
  complete: { first: 'yes', second: 'skip' }
}

test('distinguishes not-started, in-progress and complete ballots', () => {
  const html = renderToStaticMarkup(<Voters party={party} votes={votes} places={2} ownerId="owner" />)

  expect(html).toContain('data-progress="not-started"')
  expect(html).toContain('data-progress="in-progress"')
  expect(html).toContain('data-progress="complete"')
  expect(html).toContain('>Not Started</span>')
  expect(html).toContain('>In Progress</span>')
  expect(html).toContain('>Complete</span>')
})
