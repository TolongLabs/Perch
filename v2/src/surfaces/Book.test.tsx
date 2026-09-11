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

/** Every day filled, so the Book prints one spread per day. Day one is the intake's own example: Sensoji, then
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

test('lays each spread out as two facing pages, two destinations a spread', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // Three filled slots a day: two destinations on the first spread, one on the second, for four days. Each day's
  // pages sit directly in its flipbook's stage, two facing pages a spread.
  expect(html.match(/class="bookflip-stage" aria-hidden="true"/g)).toHaveLength(4)
  expect(html.match(/class="book-page folio-page folio-left"/g)).toHaveLength(8)
  expect(html.match(/class="book-page folio-page folio-right"/g)).toHaveLength(8)
  // Every destination takes a picture on one page and its words on the other, across all four days. The picture is
  // visual only (never in the screen-reader list), so it stays 12; the words appear once in the visual folio and once
  // in the `aria-hidden`-paired `.day-stops` list, so they double to 24 in the raw markup.
  expect(html.match(/class="dest dest-photo"/g)).toHaveLength(12)
  expect(html.match(/class="dest dest-desc"/g)).toHaveLength(24)
})

test('exposes the day in visiting order to the screen reader, once, and hides the visual folio', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  // The visual pages are the printed object and are hidden from the accessibility tree; the `.day-stops` list is the
  // single accessible copy, and it lives outside the hidden stage, in the day article beside it. Each day gets
  // exactly one list.
  expect(html.match(/class="bookflip-stage" aria-hidden="true"/g)).toHaveLength(4)
  expect(html.match(/class="day-stops sr-only"/g)).toHaveLength(4)

  // Day one's stops, in the order the reader visits them, each heading exactly once in the list. The visual folio
  // interleaves these (Nakamise's words sit before Sensoji's), which is the whole reason the list exists. Bound the
  // slice at the list's own `</ol>` so the folios after it do not count against it.
  const day1 = html.slice(html.indexOf('data-day="1"'), html.indexOf('data-day="2"'))
  const list = day1.slice(day1.indexOf('<ol class="day-stops sr-only"'), day1.indexOf('</ol>'))
  const at = (name: string) => list.indexOf(`<h3 class="t-name">${name}</h3>`)
  const sensoji = at('Sensoji')
  const nakamise = at('Nakamise')
  const kappabashi = at('Kappabashi')
  expect(sensoji).toBeGreaterThan(-1)
  expect(nakamise).toBeGreaterThan(sensoji)
  expect(kappabashi).toBeGreaterThan(nakamise)
  expect(list.match(/<h3 class="t-name">/g)).toHaveLength(3)
})

test('alternates photo and description exactly as the intake names it', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()
  const day1 = html.slice(html.indexOf('data-day="1"'), html.indexOf('data-day="2"'))

  // The first spread's two facing pages, bounded at the next spread's left page so the day's second spread cannot
  // bleed in. The first destination of the spread: picture on the left page, its words on the right. The second
  // flips: its words drop to the left page and its picture to the right. The `when` label travels with the words.
  const stageStart = day1.indexOf('class="bookflip-stage" aria-hidden="true"')
  const leftStart = day1.indexOf('class="book-page folio-page folio-left"', stageStart)
  const rightStart = day1.indexOf('class="book-page folio-page folio-right"', leftStart)
  const nextLeft = day1.indexOf('class="book-page folio-page folio-left"', rightStart)
  expect(leftStart).toBeGreaterThan(-1)
  expect(rightStart).toBeGreaterThan(leftStart)
  expect(nextLeft).toBeGreaterThan(rightStart)
  const left = day1.slice(leftStart, rightStart)
  const right = day1.slice(rightStart, nextLeft)
  expect(left).toContain('class="dest dest-photo"')
  expect(left).toContain('Nakamise')
  expect(left).toContain('In The Afternoon')
  expect(right).toContain('class="dest dest-photo"')
  expect(right).toContain('Sensoji')
  expect(right).toContain('In The Morning')
})

test('pins the day map and keeps its TitleCase labels', () => {
  store.setItem(KEY, JSON.stringify(planned))
  const html = renderBook()

  expect(html).toContain('class="spread-pin"')
  expect(html).toContain('class="daymap-thumb"')
  expect(html).toContain('Open The Transit Route')
  expect(html).toContain('In The Morning')
  expect(html).toContain('In The Afternoon')
  expect(html).toContain('That Evening')
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

  // The flat stage keeps its external 64px gutter; the base host rule keeps the page number at the foot.
  expect(wide).toContain('gap: var(--s5) 64px')
  expect(ruleBody('.bookflip-host .book-page .book-page-inner')).toContain('height: 100%')
})
