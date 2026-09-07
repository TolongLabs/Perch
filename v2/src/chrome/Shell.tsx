import type { ReactNode } from 'react'
import { Footer } from './Footer'
import './chrome.css'

/**
 * The page folds over the footer. The footer is fixed behind at z-index 0; this column is opaque, sits above it, and
 * reserves its height as bottom margin, so nothing of the footer shows until the reader reaches the end of the page.
 */
export const Shell = ({ children, footer = true }: { children: ReactNode; footer?: boolean }) => (
  <>
    <div className="shell" data-footer={footer}>
      {children}
    </div>
    {footer && (
      <footer className="app-foot">
        <Footer />
      </footer>
    )}
  </>
)

/** The landing stands the same footer on the floor, because a page with no scroll can never uncover a fixed one. */
export const FlatShell = ({ children }: { children: ReactNode }) => (
  <div className="flat-shell">
    <div className="flat-shell-body">{children}</div>
    <footer className="flat-foot">
      <Footer />
    </footer>
  </div>
)
