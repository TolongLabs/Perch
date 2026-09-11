"""Deck QRs: the two links on the closing slide, with the Perch seal in the middle.

Adapted from the same approach MyTakziah's deck uses. Correction level H tolerates
roughly 30 per cent damage, so a centre patch at 28 per cent of the width is well
inside budget. The script decodes its own output before writing and refuses to
write a code it cannot read back, because a QR that does not scan on a projector
is worse than no QR at all.

The seal is drawn here rather than loaded, so this script has no asset
dependency: it is the same geometry as the inline <svg> in slides.html.

    python make-qr.py
"""

import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

# docs/DESIGN.md. The code stays ink-on-paper even though the closing slide is
# dark: inverted QRs are a coin flip on cheap scanners, so the tile is a light
# square sitting on the dark ground.
INK = (0x2E, 0x26, 0x1F)
PAPER = (0xFB, 0xF8, 0xF2)

QUIET = 4      # modules; 4 is the spec minimum
TARGET = 1200  # px
PATCH = 0.28   # knockout width as a fraction of the full image
LOGO = 0.225   # seal width as a fraction of the full image

TARGETS = [
    ("https://prototype-yskhynz4la-as.a.run.app", "qr-prototype.png"),
    ("https://github.com/TolongLabs/Perch", "qr-github.png"),
]


def seal(side: int) -> Image.Image:
    """The Perch seal: one bar, three birds, the largest one ahead."""
    s = side / 168.0
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, side - 1, side - 1], radius=int(28 * s), fill=(*INK, 255))
    d.rounded_rectangle([32 * s, 92 * s, 136 * s, 97 * s], radius=int(2.5 * s), fill=(*PAPER, 255))
    for cx, cy, r in ((54, 76, 16), (90, 81, 12), (118, 85, 9)):
        d.ellipse([(cx - r) * s, (cy - r) * s, (cx + r) * s, (cy + r) * s], fill=(*PAPER, 255))
    return img


def build(url: str, out: str) -> None:
    p = cv2.QRCodeEncoder_Params()
    p.correction_level = cv2.QRCodeEncoder_CORRECT_LEVEL_H
    m = cv2.QRCodeEncoder_create(p).encode(url)
    n = m.shape[0]

    padded = np.pad(m, QUIET, constant_values=255)
    scale = TARGET // padded.shape[0]
    big = np.kron(padded, np.ones((scale, scale), dtype=np.uint8))

    rgb = np.zeros((*big.shape, 3), dtype=np.uint8)
    rgb[big == 0] = INK
    rgb[big == 255] = PAPER
    img = Image.fromarray(rgb).convert("RGBA")
    w = img.size[0]

    # Square the knockout to the module grid so no edge cuts a module in half.
    patch = round(w * PATCH / scale) * scale
    x0 = (w - patch) // 2
    img.paste(Image.new("RGBA", (patch, patch), (*PAPER, 255)), (x0, x0))

    side = int(w * LOGO)
    img.alpha_composite(seal(side), ((w - side) // 2, (w - side) // 2))

    check = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    decoded, _, _ = cv2.QRCodeDetector().detectAndDecode(check)
    if decoded != url:
        sys.exit(f"{out}: decoded to {decoded!r}, expected {url!r}. Not written.")

    img.convert("RGB").save(out, dpi=(300, 300))
    print(f"{out}: matrix {n}x{n} (v{(n - 17) // 4}), module {scale}px, image {w}px, decoded ok")


for url, out in TARGETS:
    build(url, out)
