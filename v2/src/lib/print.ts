type Paper = 'portrait' | 'landscape'

/**
 * The browser's own save-as-PDF rather than a generated file. The print stylesheet is the layout, so there is no
 * second rendering path to keep in step with the screen, and nothing joins the dependency tree. Chrome names the
 * saved file from `document.title`, which is why the title is the file name.
 *
 * The paper is set for the length of the action rather than declared in a stylesheet, because `@page` is
 * document-wide: a `size` in `Book.css` would put the Desk on landscape paper too, and every surface shares one
 * bundled stylesheet. `margin` stays declared, because 14mm is right for anything that prints.
 */
export const saveAsPdf = async (title: string, paper: Paper = 'landscape'): Promise<void> => {
  const previous = document.title
  const style = document.createElement('style')
  style.textContent = `@page { size: A4 ${paper} }`
  document.head.appendChild(style)
  document.title = title

  const restore = () => {
    document.title = previous
    style.remove()
    window.removeEventListener('afterprint', restore)
  }
  window.addEventListener('afterprint', restore)

  // The fonts have to be resolved before the page is measured for paper, or a line breaks differently on the sheet
  // than it does on the screen.
  await document.fonts.ready
  window.print()
  // A headless Chromium fires no `afterprint` at all, so the listener alone would leave the title changed.
  window.setTimeout(restore, 1000)
}
