import { expect, test } from 'bun:test'

const g = globalThis as Record<string, unknown>
// Leaflet reads `window` when its module loads, and a static import would run before this shim. A bare alias to the
// global object is enough: the tests never initialise a map (Leaflet's `map()` runs in an effect, which SSR skips),
// so the reads are only ever `window.setTimeout` and friends. page-flip is the same way: its bundle injects a
// `<style>` tag when the module loads, so the document fake also needs a head and an appendChild-ing style node.
// Neither runs in the SSR tests; the shims only keep the import alive.
if (typeof g.window === 'undefined') g.window = g
if (typeof g.document === 'undefined')
  g.document = {
    documentElement: { style: {} },
    head: { appendChild: () => {} },
    createElement: () => ({ style: {}, appendChild: () => {} }),
    createTextNode: () => ({})
  }
// Leaflet's `Browser` reads `devicePixelRatio` (falling back to `screen`, which does not exist here).
if (typeof g.devicePixelRatio === 'undefined') g.devicePixelRatio = 1

const { renderToStaticMarkup } = await import('react-dom/server')
const { MemoryRouter } = await import('react-router-dom')
const { trip: seed } = await import('../data/trip')
const { TripProvider } = await import('../state')
const { Book } = await import('./Book')

const KEY = 'perch.trip.v1'

/** The test env has no localStorage, which `load()` reads as a first visit. A memory store lets the planned render
    reach the same path as a browser that has already saved the trip. */
type Store = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}
const memory = new Map<string, string>()
const store: Store = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value)
  },
  removeItem: (key) => {
    memory.delete(key)
  }
}
// Re-assert before every render rather than once at module load: the suite runs all files in one
// process, and Desk.test.tsx overwrites `globalThis.localStorage` while the state, theme, and
// manualNotes suites delete it after themselves, so the module-load shim is gone by the time
// these tests run.
const renderBook = () => {
  g.localStorage = store
  return renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/t/tokyo-nov-2026']}>
        <Book />
      </MemoryRouter>
    </TripProvider>
  )
}

/** Every day filled, so the book holds three destinations a day. Day one is the intake's own example: Sensoji, then
    Nakamise. `votingClosedAt` is set so `finalizeVotingIfDue` cannot rewrite the trip under the test. */
const fill: Record<number, Record<'morning' | 'afternoon' | 'evening', string>> = {
  1: { morning: 'sensoji', afternoon: 'nakamise', evening: 'kappabashi' },
  2: { morning: 'meiji-jingu', afternoon: 'shibuya-crossing', evening: 'takeshita-street' },
  3: { morning: 'tsukiji-outer-market', afternoon: 'hama-rikyu-gardens', evening: 'tokyo-station-marunouchi' },
  4: { morning: 'odaiba-beach', afternoon: 'teamlab-planets', evening: 'toyosu-market' }
}

const planned = {
  ...seed,
  votingClosedAt: new Date('2026-11-18T00:00:00+09:00').toISOString(),
  days: seed.days.map((day) => ({
    ...day,
    slots: day.slots.map((slot) => ({ ...slot, placeId: fill[day.index]?.[slot.period] ?? null }))
  }))
}

test('shows the cold state and the one way back when nothing is on the calendar', () => {
  store.removeItem(KEY)
  const html = renderBook()

  expect(html).toContain('Open The Desk')
  expect(html).toContain('Back To The Desk')
  expect(html).not.toContain('class="book-page"')
  expect(html).not.toContain('Save As PDF')
})

test('prints the destinations and nothing else: the checklist stays on the Desk', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  expect(html).toContain('Back To The Desk')
  expect(html).toContain('class="colophon-back t-label"')
  expect(html).toContain('Save As PDF')
  expect(html).not.toContain('Before We Go')
  expect(html).not.toContain('What This Trip Needs')
  expect(html).not.toContain('colophon-list')
})

test('lays one book out for the whole trip: two destinations a spread, one flipbook', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // Twelve filled slots, three a day across four days, two destinations a spread: six spreads in the trip's one
  // flipbook, each spread a pair of facing pages. One host is the whole book, which is also why the page number runs
  // 1..N instead of restarting at one on day two's first spread.
  expect(html.match(/class="bookflip-stage" aria-hidden="true"/g)).toHaveLength(1)
  expect(html.match(/class="book-page folio-page folio-left"/g)).toHaveLength(6)
  expect(html.match(/class="book-page folio-page folio-right"/g)).toHaveLength(6)
  // Every destination takes a picture on one page and its words on the other, across the whole book. The picture is
  // visual only (never in the screen-reader list), so it stays 12; the words appear once in the visual folio and once
  // in the `aria-hidden`-paired `.day-stops` list, so they double to 24 in the raw markup.
  expect(html.match(/class="dest dest-photo"/g)).toHaveLength(12)
  expect(html.match(/class="dest dest-desc"/g)).toHaveLength(24)
})

test('keeps the day with each destination as its when-line, in visiting order', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // The day no longer owns a section, so it must ride with each destination: twelve when-lines for twelve
  // destinations, and the book's ordered list says every day at least once.
  expect(html.match(/class="t-label dest-when"/g)).toHaveLength(24)
  for (const day of ['Day 1 ·', 'Day 2 ·', 'Day 3 ·', 'Day 4 ·']) {
    expect(html).toContain(day)
  }
  // The list runs the whole trip in visiting order, and the screen-reader copy is one list, not one per day.
  expect(html.match(/class="day-stops sr-only"/g)).toHaveLength(1)
  const at = (name: string) => html.indexOf(`<h3 class="t-name">${name}</h3>`)
  const first = at('Sensoji')
  const last = at('Toyosu Market')
  expect(first).toBeGreaterThan(-1)
  expect(last).toBeGreaterThan(first)
})

test('exposes the trip to the screen reader once, and hides the visual folio', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // The visual pages are the printed object and are hidden from the accessibility tree; the one `.day-stops` list is
  // the single accessible copy. Day one's stops, in the order the reader visits them, each heading exactly once in
  // the list, bounded at the list's own `</ol>` so the folios after it do not count against it.
  const list = html.slice(html.indexOf('<ol class="day-stops sr-only"'), html.indexOf('</ol>'))
  const at = (name: string) => list.indexOf(`<h3 class="t-name">${name}</h3>`)
  const sensoji = at('Sensoji')
  const nakamise = at('Nakamise')
  const kappabashi = at('Kappabashi')
  const meiji = at('Meiji Jingu')
  expect(sensoji).toBeGreaterThan(-1)
  expect(nakamise).toBeGreaterThan(sensoji)
  expect(kappabashi).toBeGreaterThan(nakamise)
  expect(meiji).toBeGreaterThan(kappabashi)
  expect(list.match(/<h3 class="t-name">/g)).toHaveLength(12)
})

test('alternates photo and description exactly as the intake names it', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // The book's first spread, bounded at the second spread's left page so the later pages cannot bleed in. The first
  // destination of the spread: picture on the left page, its words on the right. The second flips: its words drop to
  // the left page and its picture to the right. The day travels with each destination as its when-line.
  const stageStart = html.indexOf('class="bookflip-stage" aria-hidden="true"')
  const leftStart = html.indexOf('class="book-page folio-page folio-left"', stageStart)
  const rightStart = html.indexOf('class="book-page folio-page folio-right"', leftStart)
  const nextLeft = html.indexOf('class="book-page folio-page folio-left"', rightStart)
  expect(leftStart).toBeGreaterThan(-1)
  expect(rightStart).toBeGreaterThan(leftStart)
  expect(nextLeft).toBeGreaterThan(rightStart)
  const left = html.slice(leftStart, rightStart)
  const right = html.slice(rightStart, nextLeft)
  expect(left).toContain('class="dest dest-photo"')
  expect(left).toContain('Nakamise')
  expect(left).toContain('Day 1 · In The Afternoon')
  expect(right).toContain('class="dest dest-photo"')
  expect(right).toContain('Sensoji')
  expect(right).toContain('Day 1 · In The Morning')
})

test('sets the days after the book, as named maps on their own tints, with no pin to scuff', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // One map per day that has stops, named by its day, and each figure carries the day's attribute so the tint the
  // title and the fallback plate read is the day's own. The pin is gone with the day's section: the map is the note,
  // set square in the flow.
  expect(html.match(/class="book-map"/g)).toHaveLength(4)
  expect(html.match(/class="daymap-thumb"/g)).toHaveLength(4)
  expect(html).toContain('data-day="1"')
  expect(html).toContain('data-day="4"')
  expect(html).toContain('Day 1 · Friday')
  expect(html).toContain('Day 4 · Monday')
  expect(html).not.toContain('spread-pin')
  expect(html).not.toContain('pin-head')
  expect(html).not.toContain('Open The Transit Route')
  expect(html).toContain('The Book')
})

test('gives live flipbook pages an inner gutter at both facing edges', async () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // The host clones the authored pages by these classes, so the gutter rules must target the same structure.
  expect(html).toContain('class="book-page folio-page folio-left"')
  expect(html).toContain('class="book-page folio-page folio-right"')

  const css = await Bun.file(`${import.meta.dir}/Book.css`).text()
  const mediaStart = css.indexOf('@media (min-width: 1024px) {')
  expect(mediaStart).toBeGreaterThan(-1)
  let depth = 0
  let mediaEnd = mediaStart
  for (let i = mediaStart; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') {
      depth--
      if (depth === 0) {
        mediaEnd = i
        break
      }
    }
  }
  const wide = css.slice(mediaStart, mediaEnd + 1)

  const ruleBody = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = wide.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))
    return match?.[1]?.trim() ?? ''
  }

  const left = ruleBody('.bookflip-host .book-page.folio-left .book-page-inner')
  const right = ruleBody('.bookflip-host .book-page.folio-right .book-page-inner')

  expect(left).toContain('padding-right: var(--s6)')
  expect(right).toContain('padding-left: var(--s6)')

  // The gutter is internal to the wrapper, not a margin, gap or size override on the library-owned page box.
  for (const rule of [left, right]) {
    expect(rule).not.toContain('margin')
    expect(rule).not.toContain('width:')
    expect(rule).not.toContain('height:')
    expect(rule).not.toContain('gap:')
  }

  // The flat stage keeps its external 64px gutter; the single host rule keeps the page number at the foot.
  expect(wide).toContain('gap: var(--s5) 64px')
  expect(ruleBody('.bookflip-host .book-page .book-page-inner')).toContain('height: 100%')
})
