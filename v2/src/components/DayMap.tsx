import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Place } from '../data/types'
import { FullTripPlate, type MappedDay, Plate } from './Plate'
import './DayMap.css'

export type { MappedDay }

/**
 * OpenStreetMap through Leaflet, which needs no key and asks only that the attribution stays on the tile. That is
 * why the credit is never styled away, at either size.
 */
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/**
 * The CSS custom property for a day's bird tint, cycling across the 7 defined day colors.
 */
export const dayTint = (day: number) => `var(--day-${((day - 1) % 7) + 1})`

/**
 * The stop's place in the day, drawn as the marker. Numbers on a route are the one case `AGENTS.md` allows them:
 * the order is the information, not decoration standing in for it.
 */
const marker = (n: number, tint: string) =>
  L.divIcon({
    className: 'daymap-pin',
    html: `<span style="--pin:${tint}">${n}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  })

/**
 * A real map of the day rather than a drawing of it. The drawn plate held the shape of the day but not the city it
 * sits in: lines on a blank ground read as a diagram, and a reader planning a walk needs to see the river the walk
 * crosses. Static at thumbnail size, because a map that pans under a thumb on a page that scrolls is a trap; the
 * whole thumbnail opens instead, and the opened one is a map you can move.
 */
const useMap = (stops: Place[], tint: string, live: boolean) => {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = host.current
    if (!node || stops.length === 0) return
    const map = L.map(node, {
      attributionControl: true,
      zoomControl: live,
      dragging: live,
      scrollWheelZoom: live,
      doubleClickZoom: live,
      boxZoom: live,
      touchZoom: live,
      keyboard: live
    })
    L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 19 }).addTo(map)
    const points: [number, number][] = stops.map((s) => [s.lat, s.lng])
    if (points.length > 1) {
      L.polyline(points, { color: tint, weight: 3.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map)
    }
    for (const [i, s] of stops.entries()) L.marker([s.lat, s.lng], { icon: marker(i + 1, tint) }).addTo(map)
    if (points.length === 1 && points[0]) {
      map.setView(points[0], 14)
    } else {
      map.fitBounds(L.latLngBounds(points).pad(0.18), {
        padding: live ? [40, 40] : [12, 12],
        maxZoom: live ? 16 : 14
      })
    }
    return () => {
      map.remove()
    }
  }, [stops, tint, live])
  return host
}

const useFullTripMap = (days: MappedDay[], live: boolean) => {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = host.current
    const allPoints: [number, number][] = days.flatMap((d) => d.stops.map((s) => [s.lat, s.lng]))
    if (!node || allPoints.length === 0) return
    const map = L.map(node, {
      attributionControl: true,
      zoomControl: live,
      dragging: live,
      scrollWheelZoom: live,
      doubleClickZoom: live,
      boxZoom: live,
      touchZoom: live,
      keyboard: live
    })
    L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 19 }).addTo(map)

    for (const d of days) {
      const tint = dayTint(d.day.index)
      const points: [number, number][] = d.stops.map((s) => [s.lat, s.lng])
      if (points.length > 1) {
        L.polyline(points, { color: tint, weight: 3.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map)
      }
      for (const [i, s] of d.stops.entries()) {
        L.marker([s.lat, s.lng], { icon: marker(i + 1, tint) }).addTo(map)
      }
    }

    map.fitBounds(L.latLngBounds(allPoints).pad(0.12), { padding: live ? [40, 40] : [20, 20], maxZoom: 14 })
    return () => {
      map.remove()
    }
  }, [days, live])
  return host
}

export const DayMap = ({ day, title, stops }: { day: number; title: string; stops: Place[] }) => {
  const [open, setOpen] = useState(false)
  const tint = dayTint(day)
  const thumb = useMap(stops, tint, false)
  const full = useMap(open ? stops : [], tint, true)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (stops.length === 0) return null

  return (
    <>
      <button type="button" className="daymap-thumb" onClick={() => setOpen(true)}>
        <span className="daymap-canvas">
          {/* The drawn plate stays, underneath. A tile server is one network call the demo does not control, and a
              map whose tiles never arrive should fall back to the day's own shape on its own tint rather than to
              Leaflet's grey. It is why `.leaflet-container` is transparent here. */}
          <span className="daymap-under" aria-hidden="true">
            <Plate day={day} title={title} stops={stops} />
          </span>
          <span className="daymap-tiles" ref={thumb} aria-hidden="true" />
        </span>
        <span className="sr-only">Open the map of {title}</span>
      </button>

      {/* Portalled to the body. The pinned note is rotated, and a transformed ancestor makes `position: fixed`
          resolve against that ancestor rather than the viewport, which sized the opened map to the note. */}
      {open &&
        createPortal(
          <div className="daymap-open" role="dialog" aria-label={`The map of ${title}`}>
            <div className="daymap-sheet">
              <div className="daymap-canvas daymap-canvas-full">
                <span className="daymap-under" aria-hidden="true">
                  <Plate day={day} title={title} stops={stops} />
                </span>
                <div className="daymap-tiles" ref={full} />
              </div>
              <button type="button" className="daymap-close t-label" onClick={() => setOpen(false)}>
                Close The Map
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

/**
 * A small, non-interactive map of a day's stops: the drawn plate under the tiles, with no open-dialog button. The
 * Book's per-page pin (#391) renders its minimap through this, so the pin shows the same city the full `DayMap`
 * opens rather than a second, hand-drawn map.
 */
export const DayMapThumb = ({ day, title, stops }: { day: number; title: string; stops: Place[] }) => {
  const tint = dayTint(day)
  const thumb = useMap(stops, tint, false)

  if (stops.length === 0) return null

  return (
    <span className="daymap-canvas daymap-canvas-thumb">
      <span className="daymap-under" aria-hidden="true">
        <Plate day={day} title={title} stops={stops} />
      </span>
      <span
        className="daymap-tiles"
        ref={thumb}
        data-day={day}
        data-stops={JSON.stringify(stops.map((s) => ({ lat: s.lat, lng: s.lng })))}
        aria-hidden="true"
      />
    </span>
  )
}

/**
 * A giant map combining the routes for all days in the trip, plotted together across the entire city.
 * Used as the master atlas spread at the end of the Book (#108).
 */
export const FullTripMap = ({ days, title }: { days: MappedDay[]; title?: string }) => {
  const thumb = useFullTripMap(days, false)

  if (days.length === 0) return null

  return (
    <section className="giantmap-canvas" aria-label={title ?? 'The Complete Route Map'}>
      <span className="daymap-under" aria-hidden="true">
        <FullTripPlate days={days} />
      </span>
      <div
        className="daymap-tiles"
        ref={thumb}
        data-full-trip="true"
        data-days={JSON.stringify(
          days.map((d) => ({
            day: d.day.index,
            stops: d.stops.map((s) => ({ lat: s.lat, lng: s.lng }))
          }))
        )}
        aria-hidden="true"
      />
    </section>
  )
}

/**
 * Initializes live Leaflet maps on cloned tiles containers inside the page-flip host.
 * Because page-flip operates on DOM clones, React hooks cannot mount to them directly;
 * this attaches Leaflet with OpenStreetMap tiles, polylines, and pins to every cloned map container.
 */
type HostMapEntry = {
  map: L.Map
  bounds: L.LatLngBounds
  points: [number, number][]
  padding: [number, number]
  maxZoom: number
}

export const initHostMaps = (host: HTMLElement, onFlip?: (cb: () => void) => void): (() => void) => {
  const entries: HostMapEntry[] = []

  // 1. Pinned day minimaps
  const pinNodes = host.querySelectorAll<HTMLElement>('.spread-pin .daymap-tiles')
  pinNodes.forEach((node) => {
    const stopsJson = node.dataset.stops
    const dayStr = node.dataset.day
    if (!stopsJson || !dayStr) return
    try {
      const stops: { lat: number; lng: number }[] = JSON.parse(stopsJson)
      if (stops.length === 0) return
      const day = Number(dayStr)
      const tint = dayTint(day)

      node.innerHTML = ''
      delete (node as unknown as Record<string, unknown>)._leaflet_id

      const map = L.map(node, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        keyboard: false
      })
      L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 19 }).addTo(map)
      const points: [number, number][] = stops.map((s) => [s.lat, s.lng])
      if (points.length > 1) {
        L.polyline(points, { color: tint, weight: 3.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map)
      }
      for (const [i, s] of stops.entries()) {
        L.marker([s.lat, s.lng], { icon: marker(i + 1, tint) }).addTo(map)
      }

      const bounds = L.latLngBounds(points)
      if (points.length === 1 && points[0]) {
        map.setView(points[0], 14)
      } else {
        map.fitBounds(bounds.pad(0.18), { padding: [10, 10], maxZoom: 14 })
      }

      entries.push({
        map,
        bounds,
        points,
        padding: [10, 10],
        maxZoom: 14
      })
    } catch {
      // ignore
    }
  })

  // 2. Master atlas giant map
  const giantNodes = host.querySelectorAll<HTMLElement>('.giantmap-canvas .daymap-tiles')
  giantNodes.forEach((node) => {
    const daysJson = node.dataset.days
    if (!daysJson) return
    try {
      const daysData: { day: number; stops: { lat: number; lng: number }[] }[] = JSON.parse(daysJson)
      const allPoints: [number, number][] = daysData.flatMap((d) => d.stops.map((s) => [s.lat, s.lng]))
      if (allPoints.length === 0) return

      node.innerHTML = ''
      delete (node as unknown as Record<string, unknown>)._leaflet_id

      const map = L.map(node, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        keyboard: false
      })
      L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 19 }).addTo(map)
      for (const d of daysData) {
        const tint = dayTint(d.day)
        const pts: [number, number][] = d.stops.map((s) => [s.lat, s.lng])
        if (pts.length > 1) {
          L.polyline(pts, { color: tint, weight: 3.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map)
        }
        for (const [i, s] of d.stops.entries()) {
          L.marker([s.lat, s.lng], { icon: marker(i + 1, tint) }).addTo(map)
        }
      }

      const bounds = L.latLngBounds(allPoints)
      map.fitBounds(bounds.pad(0.12), { padding: [24, 24], maxZoom: 14 })

      entries.push({
        map,
        bounds,
        points: allPoints,
        padding: [24, 24],
        maxZoom: 14
      })
    } catch {
      // ignore
    }
  })

  const fitAll = () => {
    for (const entry of entries) {
      try {
        entry.map.invalidateSize()
        if (entry.points.length === 1 && entry.points[0]) {
          entry.map.setView(entry.points[0], 14)
        } else if (entry.bounds.isValid()) {
          entry.map.fitBounds(entry.bounds.pad(0.18), {
            padding: entry.padding,
            maxZoom: entry.maxZoom,
            animate: false
          })
        }
      } catch {
        // ignore
      }
    }
  }

  const t0 = setTimeout(fitAll, 50)
  const t1 = setTimeout(fitAll, 150)
  const t2 = setTimeout(fitAll, 400)
  const t3 = setTimeout(fitAll, 800)

  if (onFlip) {
    onFlip(() => {
      fitAll()
      setTimeout(fitAll, 60)
      setTimeout(fitAll, 250)
    })
  }

  return () => {
    clearTimeout(t0)
    clearTimeout(t1)
    clearTimeout(t2)
    clearTimeout(t3)
    for (const entry of entries) {
      try {
        entry.map.remove()
      } catch {
        // ignore
      }
    }
  }
}
