import { describe, expect, test } from 'bun:test'
import { trip } from '../data/trip'
import { transitRoute } from './mapsLink'

const place = (id: string) => {
  const p = trip.options[id]
  if (!p) throw new Error(`fixture has no ${id}`)
  return p
}

describe('transitRoute', () => {
  test('routes by venue name and city, not by bare coordinates', () => {
    const url = new URL(transitRoute([place('sensoji'), place('nakamise'), place('ueno-park')]) ?? '')
    expect(url.searchParams.get('origin')).toBe('Sensoji, Tokyo')
    expect(url.searchParams.get('waypoints')).toBe('Nakamise, Tokyo')
    expect(url.searchParams.get('destination')).toBe('Ueno Park, Tokyo')
    expect(url.searchParams.get('travelmode')).toBe('transit')
  })

  test('needs two stops', () => {
    expect(transitRoute([place('sensoji')])).toBeNull()
  })
})
