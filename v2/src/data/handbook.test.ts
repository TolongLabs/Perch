import { describe, expect, test } from 'bun:test'
import { scheduleTrip } from '../lib/schedule'
import { handbookFor, NEWS, PACKING, TAKE_CARE } from './handbook'
import { trip } from './trip'

describe('the handbook', () => {
  test('every line carries a source and a derivation', () => {
    for (const e of [...TAKE_CARE, ...PACKING]) {
      expect(e.source.length).toBeGreaterThan(0)
      expect(e.derivedFrom).toMatch(/^(destination|kind|tag|weather):/)
    }
    for (const n of NEWS) expect(n.source.length).toBeGreaterThan(0)
  })

  test('an unplanned trip gets the destination lines and the news, but no place etiquette', () => {
    const h = handbookFor(trip)
    expect(h.takeCare.map((e) => e.id)).toContain('cash')
    expect(h.takeCare.map((e) => e.id)).not.toContain('shrine-etiquette')
    expect(h.news.length).toBe(NEWS.length)
  })

  test('a planned trip with a shrine on the calendar earns shrine etiquette, and rain earns the umbrella', () => {
    const planned = { ...trip, days: scheduleTrip(trip) }
    const h = handbookFor(planned)
    expect(h.takeCare.map((e) => e.id)).toContain('shrine-etiquette')
    expect(h.packing.map((e) => e.id)).toContain('umbrella')
  })
})
