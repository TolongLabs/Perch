import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { applyTheme, readTheme } from './theme'

const KEY = 'perch.theme.v1'

// The seed at the app root and the toggle-bearing surfaces all lean on these two helpers, so the regression
// coverage pins their contract: a stored choice wins, anything but the two known strings is nothing stored, and
// with nothing stored the operating system answers. `applyTheme` writes the attribute on the document element and
// persists the choice, and it must not throw on a machine with storage disabled.
//
// The suite is SSR, so `localStorage`, `window`, and `document` are all absent; each is stubbed the way
// `state.test.ts` does, and restored in `afterEach`.
let localStorageDescriptor: PropertyDescriptor | undefined
let windowDescriptor: PropertyDescriptor | undefined
let documentDescriptor: PropertyDescriptor | undefined

const store: Record<string, string> = {}
let osPrefersDark = false
let storageThrows = false
const dataset: Record<string, string> = {}

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key]
  osPrefersDark = false
  storageThrows = false
  for (const key of Object.keys(dataset)) delete dataset[key]

  localStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error('storage disabled')
        return store[key] ?? null
      },
      setItem: (key: string, value: string) => {
        if (storageThrows) throw new Error('storage disabled')
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      }
    },
    configurable: true,
    writable: true
  })

  windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', {
    value: {
      matchMedia: (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? osPrefersDark : false
      })
    },
    configurable: true,
    writable: true
  })

  documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', {
    value: { documentElement: { dataset } },
    configurable: true,
    writable: true
  })
})

afterEach(() => {
  if (localStorageDescriptor) Object.defineProperty(globalThis, 'localStorage', localStorageDescriptor)
  else delete (globalThis as unknown as { localStorage?: unknown }).localStorage
  if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor)
  else delete (globalThis as unknown as { window?: unknown }).window
  if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor)
  else delete (globalThis as unknown as { document?: unknown }).document
})

describe('readTheme', () => {
  test('a stored choice wins over the operating system', () => {
    store[KEY] = 'dark'
    osPrefersDark = false
    expect(readTheme()).toBe('dark')

    store[KEY] = 'light'
    osPrefersDark = true
    expect(readTheme()).toBe('light')
  })

  test('anything but the two known strings is treated as nothing stored', () => {
    store[KEY] = 'garbage'
    osPrefersDark = true
    expect(readTheme()).toBe('dark')

    store[KEY] = 'Dark'
    osPrefersDark = false
    expect(readTheme()).toBe('light')
  })

  test('with nothing stored, the operating system answers', () => {
    osPrefersDark = true
    expect(readTheme()).toBe('dark')

    osPrefersDark = false
    expect(readTheme()).toBe('light')
  })

  test('a machine with storage disabled still runs, following the OS every time', () => {
    storageThrows = true
    osPrefersDark = true
    expect(readTheme()).toBe('dark')

    osPrefersDark = false
    expect(readTheme()).toBe('light')
  })
})

describe('applyTheme', () => {
  test('writes the attribute on the document element and persists the choice', () => {
    applyTheme('dark')
    expect(dataset.theme).toBe('dark')
    expect(store[KEY]).toBe('dark')

    applyTheme('light')
    expect(dataset.theme).toBe('light')
    expect(store[KEY]).toBe('light')
  })

  test('still applies for the session when storage is disabled', () => {
    storageThrows = true
    expect(() => applyTheme('dark')).not.toThrow()
    expect(dataset.theme).toBe('dark')
    expect(store[KEY]).toBeUndefined()
  })
})
