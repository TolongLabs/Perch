import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { PACKING, TAKE_CARE } from '../data/handbook'
import { trip } from '../data/trip'
import type { ManualNote, ManualSection, Trip } from '../data/types'
import { MAX_NOTE_LENGTH, MAX_NOTE_TITLE_LENGTH, withManualNote, withoutManualNote } from './manualNotes'
import { load, reset, save } from './store'

let originalDescriptor: PropertyDescriptor | undefined

const sectionNotes = (t: Trip, section: ManualSection): ManualNote[] => t.manualNotes[section] ?? []

beforeEach(() => {
  originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      }
    },
    configurable: true,
    writable: true
  })
})

afterEach(() => {
  reset()
  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor)
  } else {
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage
  }
})

describe('manual notes', () => {
  test('adds a trimmed note', () => {
    const next = withManualNote(trip, 'takeCare', '  Passport copies  ', 'n1')
    expect(sectionNotes(next, 'takeCare')).toContainEqual({ id: 'n1', title: 'Trip Note', text: 'Passport copies' })
  })

  test('blank text is a no-op', () => {
    const next = withManualNote(trip, 'takeCare', '   ', 'n1')
    expect(sectionNotes(next, 'takeCare')).toHaveLength(0)
  })

  test('text over 1000 characters is rejected', () => {
    const next = withManualNote(trip, 'takeCare', 'x'.repeat(MAX_NOTE_LENGTH + 1), 'n1')
    expect(sectionNotes(next, 'takeCare')).toHaveLength(0)
  })

  test('duplicate ids are a no-op', () => {
    const a = withManualNote(trip, 'takeCare', 'A', 'n1')
    const b = withManualNote(a, 'takeCare', 'B', 'n1')
    expect(sectionNotes(b, 'takeCare')).toHaveLength(1)
    expect(sectionNotes(b, 'takeCare').find((n) => n.id === 'n1')?.text).toBe('A')
  })

  test('notes are separated by section', () => {
    const next = withManualNote(withManualNote(trip, 'takeCare', 'A', 'n1'), 'packing', 'B', 'n2')
    expect(sectionNotes(next, 'takeCare')).toHaveLength(1)
    expect(sectionNotes(next, 'packing')).toHaveLength(1)
  })

  test('removes only the target note', () => {
    const a = withManualNote(withManualNote(trip, 'takeCare', 'A', 'n1'), 'takeCare', 'B', 'n2')
    const b = withoutManualNote(a, 'takeCare', 'n1')
    expect(sectionNotes(b, 'takeCare').map((n) => n.id)).toEqual(['n2'])
  })

  test('removing a missing note is a no-op', () => {
    const a = withManualNote(trip, 'takeCare', 'A', 'n1')
    const b = withoutManualNote(a, 'takeCare', 'no-such-id')
    expect(b).toBe(a)
  })

  test('helpers do not mutate the input trip', () => {
    const original = trip
    const next = withManualNote(trip, 'takeCare', 'A', 'n1')
    expect(sectionNotes(original, 'takeCare')).toHaveLength(0)
    expect(sectionNotes(next, 'takeCare')).toHaveLength(1)
  })

  test('survives save and load', () => {
    const base = { ...trip, budgetRM: 777 }
    let t = withManualNote(base, 'takeCare', 'A', 'n1')
    t = withManualNote(t, 'packing', 'B', 'n2')
    save(t)
    const loaded = load()
    expect(loaded.budgetRM).toBe(777)
    expect(loaded.manualNotes.takeCare).toEqual([{ id: 'n1', title: 'Trip Note', text: 'A' }])
    expect(loaded.manualNotes.packing).toEqual([{ id: 'n2', title: 'Trip Note', text: 'B' }])
  })

  test('saves a trimmed title and content for every simulated member', () => {
    const next = withManualNote(trip, 'packing', '  Bring two adapters.  ', 'n1', '  Chargers  ')
    save({ ...next, currentMemberId: 'farah' })
    const loaded = load()
    expect(loaded.currentMemberId).toBe('farah')
    expect(loaded.manualNotes.packing).toEqual([{ id: 'n1', title: 'Chargers', text: 'Bring two adapters.' }])
  })

  test('blank or oversized titles are rejected', () => {
    expect(withManualNote(trip, 'packing', 'Content', 'n1', ' ')).toBe(trip)
    expect(withManualNote(trip, 'packing', 'Content', 'n1', 'x'.repeat(MAX_NOTE_TITLE_LENGTH + 1))).toBe(trip)
  })

  test('legacy notes gain a title without losing their original content', () => {
    localStorage.setItem(
      'perch.trip.v1',
      JSON.stringify({
        ...trip,
        manualNotes: {
          takeCare: [{ id: 'old', text: 'Keep passport copies separate.' }],
          packing: [{ id: 'named', title: 'Chargers', text: 'Bring two.' }]
        }
      })
    )
    expect(load().manualNotes).toEqual({
      takeCare: [{ id: 'old', title: 'Trip Note', text: 'Keep passport copies separate.' }],
      packing: [{ id: 'named', title: 'Chargers', text: 'Bring two.' }]
    })
  })

  test('old stored trips without manualNotes get empty notes on load', () => {
    const old = { ...trip, budgetRM: 777 } as unknown as Record<string, unknown>
    delete old.manualNotes
    save(old as Trip)
    const loaded = load()
    expect(loaded.budgetRM).toBe(777)
    expect(loaded.manualNotes).toEqual({ takeCare: [], packing: [] })
  })

  test('malformed manualNotes falls back to empty notes without discarding the trip', () => {
    const broken = { ...trip, budgetRM: 777, manualNotes: { takeCare: 'not an array' } } as unknown as Trip
    save(broken)
    const loaded = load()
    expect(loaded.budgetRM).toBe(777)
    expect(loaded.manualNotes).toEqual({ takeCare: [], packing: [] })
  })
})

describe('handbook titles', () => {
  test('every handbook entry has a title and umbrella is exact', () => {
    for (const e of [...TAKE_CARE, ...PACKING]) {
      expect(e.title).toBeTruthy()
      expect(typeof e.title).toBe('string')
    }
    const umbrella = PACKING.find((e) => e.id === 'umbrella')
    expect(umbrella?.title).toBe('Umbrella')
  })
})
