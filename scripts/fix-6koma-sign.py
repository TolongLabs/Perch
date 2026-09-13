"""Repair the ramen shop sign in the 6-koma: it must read （定休日）.

The generator malformed two of the three characters. It produced 走 for 定, and
a symmetrical blob for 休. Both are redrawn here; 日 and both parentheses are
never touched.

Two earlier attempts failed and are worth recording, because both failed the
same way. The first rendered crisp black type on a flat grey rectangle, which
against printed art reads as a paste-up. The second tried to fix that by fitting
brightness and variance to the neighbouring glyphs - and at fourteen pixels the
blur that bought the match closed 定's middle stroke and turned 休 to mush. The
statistics matched and the characters were unreadable, which is the wrong thing
to optimise.

So: no blur, ink at full strength, and MS Gothic, whose strokes survive the
downscale where Yu Gothic's thin horizontals do not. The paper underneath still
follows the sign's own gradient, row by row, taken from the ink-free margins
either side of the glyph run - that part was right and is kept.

    python scripts/fix-6koma-sign.py [--dry-run] [review.png]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "docs" / "assets" / "problem-6koma.png"
FONT = "C:/Windows/Fonts/msgothic.ttc"

# Measured off the image. The parentheses sit at x 764-778 and x 824-841 and are
# outside every cell below.
CELLS = {"定": (778, 694, 794, 714), "休": (793, 694, 809, 714)}
RATIO = 0.85       # of the cell height; 1.0 collides with the parentheses
INK = 18
TILT = -1.4        # the sign hangs very slightly off level


def paper_under(grey, x0, y0, x1, y1):
    """The sign's own paper for this cell, row by row, so the gradient survives."""
    out = np.zeros((y1 - y0, x1 - x0), dtype=np.float32)
    for i in range(y1 - y0):
        near = np.concatenate([grey[y0 + i, 760:775], grey[y0 + i, 827:842]]).astype(np.float32)
        keep = near[(near > 140) & (near < 245)]
        out[i, :] = keep.mean() if keep.size else 185.0
    return out


def main():
    original = Image.open(TARGET).convert("RGB")
    grey = np.asarray(original.convert("L"))
    im = original.copy()

    for char, (x0, y0, x1, y1) in CELLS.items():
        w, h = x1 - x0, y1 - y0
        scale = 12
        layer = Image.new("L", (w * scale, h * scale), 255)
        d = ImageDraw.Draw(layer)
        font = ImageFont.truetype(FONT, int(h * scale * RATIO))
        width = d.textlength(char, font=font)
        d.text(((w * scale - width) / 2, h * scale * 0.52), char, font=font, fill=0, anchor="lm")
        layer = layer.rotate(TILT, resample=Image.BICUBIC, fillcolor=255)
        layer = layer.resize((w, h), Image.LANCZOS)

        mask = np.asarray(layer, dtype=np.float32) / 255.0
        cell = paper_under(grey, x0, y0, x1, y1) * mask + INK * (1.0 - mask)
        rng = np.random.default_rng(3)
        cell = np.clip(cell + rng.integers(-4, 5, cell.shape), 0, 255)
        im.paste(Image.fromarray(np.repeat(cell[..., None], 3, axis=2).astype("uint8")), (x0, y0))

    before = np.asarray(original, dtype=np.int16).sum(2)
    after = np.asarray(im, dtype=np.int16).sum(2)
    changed = np.argwhere(before != after)
    for y, x in changed:
        if not any(x0 <= x < x1 and y0 <= y < y1 for x0, y0, x1, y1 in CELLS.values()):
            raise SystemExit(f"pixel ({x},{y}) changed outside both cells; refusing to write")
    print(f"{len(changed)} pixels changed, all inside the two glyph cells")

    if len(sys.argv) > 1 and sys.argv[-1].endswith(".png"):
        box, k = (760, 688, 845, 718), 11
        w, h = (box[2] - box[0]) * k, (box[3] - box[1]) * k
        sheet = Image.new("RGB", (w, h * 2 + 8), (20, 20, 20))
        sheet.paste(original.crop(box).resize((w, h), Image.LANCZOS), (0, 0))
        sheet.paste(im.crop(box).resize((w, h), Image.LANCZOS), (0, h + 8))
        sheet.save(sys.argv[-1])

    if "--dry-run" not in sys.argv:
        im.save(TARGET)


if __name__ == "__main__":
    main()
