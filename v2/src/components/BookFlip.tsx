import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type FlipCorner, PageFlip, type SizeType } from 'page-flip'
import { useEffect, useRef } from 'react'
import './BookFlip.css'

type Props = {
  /** The day's `.book-page` elements, in reading order. Two pages form one open spread. */
  children: React.ReactNode
}

/**
 * A page-flip book for one day of The Book. It wraps the day's authored pages and, on a wide screen with motion
 * enabled, turns them with the page-flip library (click an edge, drag, or the prev/next controls). Everywhere else —
 * a phone, a reduced-motion reader, or the printed sheet — it is the day's static pages, laid out by the Book's own
 * CSS, so the flip is a desktop delight and never a dependency for reading or printing.
 *
 * The library moves the elements it is given into its own structure and destroys them on teardown, so it is handed
 * clones, built inside its own element (the host), which is appended beside the stage and removed when the book is
 * torn down. The authored pages stay with React as the flat and print layout, and are hidden only while the book is
 * showing on screen.
 *
 * The prev/next controls and the "Spread X of Y" line are driven imperatively through refs and the library's own
 * events, because a React state update after `init` would reconcile the very pages the library just rearranged and
 * tear them out of the book.
 *
 * The pages are the printed object and are `aria-hidden`; the host, which holds their clones, is hidden the same
 * way. The day's ordered stops live in the Book's `sr-only` list, which is a sibling of this book and stays the
 * single accessible source. The controls are the only focusable part, and they sit outside the hidden pages, so
 * nothing focusable is trapped in `aria-hidden` content. The wrapper itself carries no role or name: the day is
 * already named by its heading in the Book, and naming it a second time here would put the same content in the tree
 * twice.
 */
export const BookFlip = ({ children }: Props) => {
  const stage = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLDivElement>(null)
  const prev = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const status = useRef<HTMLParagraphElement>(null)
  const flip = useRef<PageFlip | null>(null)
  const count = useRef(0)

  useEffect(() => {
    const el = stage.current
    const navEl = nav.current
    if (!el || !navEl) return
    // Desktop with motion is the only place a page is turned; a phone stacks the pages, a reduced-motion reader and
    // the print sheet read them flat, so the library is built and torn down exactly when the reader can turn a page.
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')

    const show = (page: number) => {
      if (!status.current || !prev.current || !next.current) return
      const spreads = Math.ceil(count.current / 2)
      status.current.textContent = `Spread ${Math.min(Math.floor(page / 2) + 1, spreads)} of ${spreads}`
      // The last turnable spread's left page sits at `count - 2`, not `count - 1`: a book ends on an open spread, so
      // the final pair is reached, not turned.
      prev.current.disabled = page === 0
      next.current.disabled = page >= count.current - 2
    }

    const teardown = () => {
      flip.current?.destroy()
      flip.current = null
      count.current = 0
      // The library removes its own wrappers inside the host; dropping the host takes the moved page clones with it
      // and restores the authored pages.
      host.current?.remove()
      host.current = null
      el.classList.remove('bookflip-live')
      navEl.hidden = true
    }

    const build = () => {
      teardown()
      if (!mq.matches) {
        // Flat mode: no book, no controls.
        return
      }
      const pages = el.querySelectorAll<HTMLElement>('.book-page')
      if (pages.length < 2) return
      // The clones are the book's pages, not the authored ones: page-flip moves its pages into its own structure and
      // removes that structure on `destroy()`, which would empty the stage React renders. `cloneNode` keeps every
      // attribute the pages carry, and nothing inside a page is focusable or carries an id, so nothing is trapped or
      // duplicated in the tree.
      const hostEl = document.createElement('div')
      hostEl.className = 'bookflip-host'
      hostEl.setAttribute('aria-hidden', 'true')
      host.current = hostEl
      pages.forEach((page) => {
        hostEl.appendChild(page.cloneNode(true))
      })
      const book = new PageFlip(hostEl, {
        width: 600,
        height: 780,
        size: 'stretch' as SizeType,
        minWidth: 1,
        maxWidth: 2400,
        minHeight: 1,
        maxHeight: 2400,
        drawShadow: true,
        flippingTime: 760,
        usePortrait: true,
        startZIndex: 1,
        autoSize: true,
        maxShadowOpacity: 0.4,
        showCover: false,
        mobileScrollSupport: false,
        clickEventForward: true,
        useMouseEvents: true,
        swipeDistance: 24,
        showPageCorners: true,
        disableFlipByClick: false
      })
      book.loadFromHTML(hostEl.querySelectorAll<HTMLElement>('.book-page'))
      book.on('flip', (event) => show(Number(event.data)))
      flip.current = book
      count.current = book.getPageCount()
      // The book shows, so the authored pages it now duplicates on screen step aside. The print sheet reads them
      // directly instead, with the host hidden, so this class is screen-only and never touches the sheet.
      el.classList.add('bookflip-live')
      // Appended after the stage rather than inside it: at 1024px the stage is a two-column grid, and a grid item
      // would halve the book's width.
      el.after(hostEl)
      // Two pages form one spread, and a single spread has nowhere to turn, so the controls appear only from the
      // third page on: a lone spread still turns nothing.
      navEl.hidden = count.current <= 2
      show(0)
    }

    build()
    const onToggle = () => build()
    mq.addEventListener('change', onToggle)
    return () => {
      mq.removeEventListener('change', onToggle)
      teardown()
    }
  }, [])

  const go = (dir: -1 | 1) => {
    const book = flip.current
    if (!book) return
    if (dir < 0) book.flipPrev('bottom' as FlipCorner)
    else book.flipNext('bottom' as FlipCorner)
  }

  return (
    <div className="bookflip">
      {/* The printed pages, hidden from the tree: the day's stops are read once from the Book's `sr-only` list. */}
      <div className="bookflip-stage" ref={stage} aria-hidden="true">
        {children}
      </div>

      {/* Driven imperatively (see above); `hidden` rather than unmounted so it can be toggled without a re-render. */}
      <div className="bookflip-nav" ref={nav} hidden>
        <button type="button" className="bookflip-turn" aria-label="Previous Spread" ref={prev} onClick={() => go(-1)}>
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <p className="bookflip-status t-specimen" ref={status}>
          Spread 1 of 1
        </p>
        <button type="button" className="bookflip-turn" aria-label="Next Spread" ref={next} onClick={() => go(1)}>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
