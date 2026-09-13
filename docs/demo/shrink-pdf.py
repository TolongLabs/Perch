"""Shrink a printed deck without touching a pixel of it.

    python shrink-pdf.py slides.pdf

Chromium writes each object separately and leaves the cross-reference data
uncompressed. Packing the objects into object streams and recompressing the flate
streams is worth about six per cent on these decks, and it is structure only: no
image is re-encoded, no font is re-subsetted, no stream is resampled. The pages
render bit-identical afterwards, which is checked here before the file is
replaced rather than assumed.

Where the rest of the weight actually is, measured on the 19-slide deck:

    content and structure   886 KB   the two ideation canvases, vector, must stay
    images                  811 KB   already JPEG at about 1.5x display size
    fonts                    55 KB   subsets, nothing to win
    cross-reference etc.    255 KB   this is what the pass below compresses

So past this point the only lever left is the screenshots, and that is a trade,
not a saving.

How the PDFs are printed, since nothing in this repo does it for you: Chrome via
Playwright at a 1920x1080 viewport, `emulateMedia({media:'print'})`, then
`page.pdf()` with width 1920px, height 1080px, zero margins, printBackground on
and pageRanges pinned to the slide count. Load every font face by name first -
`document.fonts.load('italic 400 16px Newsreader', 'Ag')` and the rest - because
Newsreader is named only by SVG presentation attributes, so nothing requests it,
`document.fonts.ready` resolves without it, and it silently fails to embed while
the browser still looks perfect (#113).
"""

import os
import shutil
import sys
import tempfile

try:
    import pikepdf
except ImportError:
    sys.exit("pikepdf is not installed (pip install pikepdf); leaving the PDF as printed")


def render_pages(path, scale=0.35):
    """Every page as an array, for the before-and-after comparison."""
    try:
        import numpy as np
        import pypdfium2 as pdfium
    except ImportError:
        return None
    doc = pdfium.PdfDocument(path)
    try:
        return [np.asarray(doc[i].render(scale=scale).to_pil().convert("RGB"), dtype="int16") for i in range(len(doc))]
    finally:
        # Windows will not let the temporary file be moved while pdfium still
        # holds it open, so the handle has to go before the caller replaces it.
        doc.close()


def shrink(path):
    before = os.path.getsize(path)
    original = render_pages(path)

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        out = tmp.name
    with pikepdf.open(path) as pdf:
        pdf.save(
            out,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            compress_streams=True,
            stream_decode_level=pikepdf.StreamDecodeLevel.generalized,
            recompress_flate=True,
            linearize=False,
        )

    if original is not None:
        import numpy as np

        after_pages = render_pages(out)
        if after_pages is None or len(after_pages) != len(original):
            os.unlink(out)
            sys.exit("page count changed; the original is untouched")
        worst = max(int(np.abs(a - b).max()) for a, b in zip(original, after_pages))
        if worst != 0:
            os.unlink(out)
            sys.exit("pages render differently (max delta %d); the original is untouched" % worst)

    after = os.path.getsize(out)
    if after >= before:
        os.unlink(out)
        print("%s: already minimal, left alone" % os.path.basename(path))
        return
    shutil.move(out, path)
    print(
        "%s: %.0f KB -> %.0f KB (%.1f%% smaller, pages identical)"
        % (os.path.basename(path), before / 1024, after / 1024, 100 * (1 - after / before))
    )


for target in sys.argv[1:] or sys.exit(__doc__):
    shrink(target)
