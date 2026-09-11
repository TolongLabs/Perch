import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { DateRangePicker, type Range } from './DateRangePicker'

// #389 The cap bounds what is being picked, not what is held. November 2026 opens on a Sunday with thirty days,
// so a 20th-start range at maxDays 4 keeps the 20th through the 23rd pickable and greys the 24th to the 30th.
const render = (value: Range, maxDays?: number) =>
  renderToStaticMarkup(<DateRangePicker value={value} onChange={() => {}} maxDays={maxDays} />)

const disabledDays = (html: string) => html.match(/disabled=""/g) ?? []

/** The button as rendered: aria-label, then aria-pressed, then disabled when present. */
const isDisabled = (html: string, day: string) => html.includes(`aria-label="${day}" aria-pressed="false" disabled=""`)

test('with no start nothing is disabled', () => {
  const html = render({ start: null, end: null }, 4)
  expect(disabledDays(html)).toHaveLength(0)
})

test('with a start, days past start + maxDays - 1 are disabled and the rest are not', () => {
  // Start 20 Nov, cap of four days: 20, 21, 22 and 23 stay pickable, and the seven days 24 to 30 go grey.
  const html = render({ start: '2026-11-20', end: null }, 4)
  const disabled = disabledDays(html)
  expect(disabled).toHaveLength(7)
  // The start keeps its affordance, and so does the last day the cap allows.
  expect(isDisabled(html, '20 November 2026')).toBe(false)
  expect(isDisabled(html, '23 November 2026')).toBe(false)
  expect(isDisabled(html, '24 November 2026')).toBe(true)
  expect(isDisabled(html, '30 November 2026')).toBe(true)
})

test('a stored range longer than the cap still renders, and only the days past it disable', () => {
  // Held 20 to 26 against a cap of four: the 26th is the end of what is stored, so it stays rendered, and only the
  // four days 27 to 30 go grey. Refusing the over-long range is the caller's press, which already carries the reason.
  const html = render({ start: '2026-11-20', end: '2026-11-26' }, 4)
  const disabled = disabledDays(html)
  expect(disabled).toHaveLength(4)
  expect(isDisabled(html, '26 November 2026')).toBe(false)
  expect(isDisabled(html, '27 November 2026')).toBe(true)
  expect(isDisabled(html, '30 November 2026')).toBe(true)
})
