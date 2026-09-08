const KEY = 'perch.theme.v1'

export type Theme = 'light' | 'dark'

/**
 * The reader's own setting wins over the operating system's, because a choice made in the product is a stronger
 * signal than a machine-wide default. With nothing stored, the OS answers, which is how a first visit at night
 * lands on the dark palette without anyone asking for it.
 */
const fromSystem = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/** Storage is a boundary, so anything but the two known strings is treated as nothing stored. */
export const readTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* A machine with storage disabled still runs; it just follows the OS every time. */
  }
  return fromSystem()
}

/**
 * The attribute goes on the document element rather than on a React root, because the tokens are declared on
 * :root and the page ground is painted by html and body, both of which sit outside anything React owns.
 */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* The theme still applies for this session; it is only the memory of it that is lost. */
  }
}
