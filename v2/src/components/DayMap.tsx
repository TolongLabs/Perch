import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Place } from '../data/types'
import { Plate } from './Plate'
import './DayMap.css'

/**
 * OpenStreetMap through Leaflet, which needs no key and asks only that the attribution stays on the tile. That is
 * why the credit is never styled away, at either size.
 */
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

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
    L.polyline(points, { color: tint, weight: 3, opacity: 0.9 }).addTo(map)
    for (const [i, s] of stops.entries()) L.marker([s.lat, s.lng], { icon: marker(i + 1, tint) }).addTo(map)
    map.fitBounds(L.latLngBounds(points), { padding: live ? [40, 40] : [18, 18] })
    return () => {
      map.remove()
    }
  }, [stops, tint, live])
  return host
}

export const DayMap = ({ day, title, stops }: { day: number; title: string; stops: Place[] }) => {
  const [open, setOpen] = useState(false)
  const tint = `var(--day-${day})`
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
  const tint = `var(--day-${day})`
  const thumb = useMap(stops, tint, false)

  if (stops.length === 0) return null

  return (
    <span className="daymap-canvas daymap-canvas-thumb">
      <span className="daymap-under" aria-hidden="true">
        <Plate day={day} title={title} stops={stops} />
      </span>
      <span className="daymap-tiles" ref={thumb} aria-hidden="true" />
    </span>
  )
}
