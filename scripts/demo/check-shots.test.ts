import { describe, expect, test } from 'bun:test'
import { exactText, exitCodeFor, formatCheckTable } from './check-shots.mjs'

describe('shot anchor checks', () => {
  test('matches exact text without depending on rendered case', () => {
    const pattern = exactText('Start Swiping')

    expect(pattern.test('START SWIPING')).toBe(true)
    expect(pattern.test('Start swiping now')).toBe(false)
  })

  test('fails the gate when any required anchor is absent', () => {
    expect(
      exitCodeFor([
        { shot: 1, anchor: 'November 2026 month grid', status: 'PRESENT', selector: '.dr' },
        { shot: 7, anchor: 'Apply control', status: 'ABSENT', selector: '.desk-apply' }
      ])
    ).toBe(1)
  })

  test('prints a present or absent row with the resolved selector', () => {
    const table = formatCheckTable([
      { shot: 1, anchor: 'November 2026 month grid', status: 'PRESENT', selector: '.dr' },
      { shot: 7, anchor: 'Apply control', status: 'ABSENT', selector: '.desk-apply' }
    ])

    expect(table).toContain('SHOT')
    expect(table).toContain('PRESENT')
    expect(table).toContain('ABSENT')
    expect(table).toContain('.dr')
    expect(table).toContain('.desk-apply')
  })

  test('rejects partial matches and surrounding whitespace variations', () => {
    const pattern = exactText('Print The Book')

    expect(pattern.test('Print The Book')).toBe(true)
    expect(pattern.test('Print The Book, maybe')).toBe(false)
    expect(pattern.test('  Print The Book  ')).toBe(true)
  })
})
