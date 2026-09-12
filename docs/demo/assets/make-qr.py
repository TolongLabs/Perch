"""Deck QRs: the two links on the closing slide, each with its own mark in the middle.

Adapted from the same approach MyTakziah's deck uses. Correction level H tolerates
roughly 30 per cent damage, so a centre patch at 28 per cent of the width is well
inside budget. The script decodes its own output before writing and refuses to
write a code it cannot read back, because a QR that does not scan on a projector
is worse than no QR at all.

The Perch seal is drawn here rather than loaded: it is the same geometry as the
inline <svg> in slides.html. The GitHub code carries GitHub's own mark instead,
from github-mark.svg - Primer octicons `mark-github`, GitHub's own icon library -
rasterised to github-mark.png beside this file, because PIL cannot read SVG.

    python make-qr.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

# docs/DESIGN.md. The code stays ink-on-paper even though the closing slide is
# dark: inverted QRs are a coin flip on cheap scanners, so the tile is a light
# square sitting on the dark ground.
INK = (0x2E, 0x26, 0x1F)
PAPER = (0xFB, 0xF8, 0xF2)

QUIET = 4      # modules; 4 is the spec minimum
TARGET = 520   # px; the deck draws these at 214, and a PNG four times
               # its display size is paid for again inside the PDF
PATCH = 0.28   # knockout width as a fraction of the full image
LOGO = 0.225   # seal width as a fraction of the full image

TARGETS = [
    ("https://prototype-yskhynz4la-as.a.run.app", "qr-prototype.png", "perch"),
    ("https://github.com/TolongLabs/Perch", "qr-github.png", "github"),
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


def octocat(side: int) -> Image.Image:
    """GitHub's own mark on the same dark tile the Perch seal uses, so the pair reads as a pair."""
    s = side / 168.0
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle([0, 0, side - 1, side - 1], radius=int(28 * s), fill=(*INK, 255))
    glyph = Image.open(Path(__file__).with_name("github-mark.png")).convert("RGBA")
    box = int(side * 0.66)
    glyph = glyph.resize((box, box), Image.LANCZOS)
    img.alpha_composite(glyph, ((side - box) // 2, (side - box) // 2))
    return img


MARKS = {"perch": seal, "github": octocat}


def build(url: str, out: str, mark: str) -> None:
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
    img.alpha_composite(MARKS[mark](side), ((w - side) // 2, (w - side) // 2))

    check = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    decoded, _, _ = cv2.QRCodeDetector().detectAndDecode(check)
    if decoded != url:
        sys.exit(f"{out}: decoded to {decoded!r}, expected {url!r}. Not written.")

    img.convert("RGB").save(out, dpi=(300, 300))
    print(f"{out}: matrix {n}x{n} (v{(n - 17) // 4}), module {scale}px, image {w}px, decoded ok")


for url, out, mark in TARGETS:
    build(url, out, mark)
