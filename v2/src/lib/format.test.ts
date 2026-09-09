import { describe, expect, test } from 'bun:test'
import { clock } from './format'

describe('clock', () => {
  test('reads minutes after midnight as a 24-hour clock', () => {
    expect(clock(9 * 60)).toBe('09:00')
    expect(clock(17 * 60 + 40)).toBe('17:40')
    expect(clock(21 * 60)).toBe('21:00')
  })

  test('pads both halves', () => {
    expect(clock(0)).toBe('00:00')
    expect(clock(9 * 60 + 5)).toBe('09:05')
  })

  /** The scheduler counts forward from 09:00 and a day that overruns can pass midnight, which must not read as 25:00. */
  test('wraps past midnight', () => {
    expect(clock(24 * 60)).toBe('00:00')
    expect(clock(25 * 60 + 30)).toBe('01:30')
  })
})
