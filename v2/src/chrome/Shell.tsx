import { type ReactNode, useEffect, useRef } from 'react'
import { Footer } from './Footer'
import './chrome.css'

/**
 * The page folds over the footer. The footer is fixed behind at z-index 0; this column is opaque, sits above it, and
 * reserves its height as bottom margin, so nothing of the footer shows until the reader reaches the end of the page.
 */
export const Shell = ({ children, footer = true }: { children: ReactNode; footer?: boolean }) => {
  const foot = useRef<HTMLElement>(null)

  // Tabbing past the page lands in a footer this column is still covering, and the browser cannot rescue it:
  // scrolling an element into view is a no-op on a fixed one, which is always inside the viewport already, so the
  // ring paints underneath. WCAG 2.4.11 Focus Not Obscured. A native focusin listener rather than an onFocus prop,
  // because a handler in the JSX would make the footer an interactive static element.
  // footer is not read in the body. It gates whether the ref has an element to bind to at all, so the effect
  // has to re-run when it flips, which is the shape the rule below does not model.
  // biome-ignore lint/correctness/useExhaustiveDependencies: footer is the trigger, not an input
  useEffect(() => {
    const el = foot.current
    if (!el) return
    const reveal = () => window.scrollTo({ top: document.documentElement.scrollHeight })
    el.addEventListener('focusin', reveal)
    return () => el.removeEventListener('focusin', reveal)
  }, [footer])

  return (
    <>
      <div className="shell" data-footer={footer}>
        {children}
      </div>
      {footer && (
        <footer className="app-foot" ref={foot}>
          <Footer />
        </footer>
      )}
    </>
  )
}
