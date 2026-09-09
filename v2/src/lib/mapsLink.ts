import type { Place } from '../data/types'

/**
 * A plain Google Maps transit directions URL for one day's stops. A deep link needs no key and makes no call at
 * runtime, which is the whole reason The Book can carry one: `TRD.md` keeps the Routes API for the build phase.
 *
 * Names rather than bare coordinates: Google reverse-geocodes a coordinate to the nearest address, so a route built
 * from lat,lng shows road names in place of the venues. The name with the city pins the venue.
 */
export const transitRoute = (stops: Place[]): string | null => {
  if (stops.length < 2) return null
  const at = (p: Place) => `${p.name}, Tokyo`
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
