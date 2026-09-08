import { useEffect, useRef, useState } from 'react'
import './CopyLink.css'

/**
 * The invite link is the swipe link, so this is how a trip gets shared. Flips to Copied for two seconds, because a
 * copy that gives no feedback gets pressed three times.
 */
export const CopyLink = ({ url, label = 'Copy Link' }: { url: string; label?: string }) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // A browser that refuses the clipboard still gets the link on screen to select by hand, so say nothing here
      // rather than claiming a copy that did not happen.
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" className="copy t-label" data-copied={copied} onClick={copy}>
      {copied ? 'Copied' : label}
    </button>
  )
}
