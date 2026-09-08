import type { Place } from '../data/types'

/**
 * A plain Google Maps transit directions URL for one day's stops. A deep link needs no key and makes no call at
 * runtime, which is the whole reason The Book can carry one: `TRD.md` keeps the Routes API for the build phase.
 *
 * Coordinates rather than names, so a place whose English name is ambiguous still resolves to the right pin.
 */
export const transitRoute = (stops: Place[]): string | null => {
  if (stops.length < 2) return null
  const at = (p: Place) => `${p.lat},${p.lng}`
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (!first || !last) return null

  const url = new URL('https://www.google.com/maps/dir/')
  url.searchParams.set('api', '1')
  url.searchParams.set('origin', at(first))
  url.searchParams.set('destination', at(last))
  const between = stops.slice(1, -1)
  if (between.length > 0) url.searchParams.set('waypoints', between.map(at).join('|'))
  url.searchParams.set('travelmode', 'transit')
  return url.toString()
}
