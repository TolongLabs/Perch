"""Repair the middle glyph of the ramen shop sign: it should read 休.

The generator malformed two of the three characters, not one. 走 was repaired to
定 first; this fixes the second, which is a symmetrical blob rather than 休 - the
person radical on the left, 木 on the right.

The replacement is fitted rather than guessed: it searches ink level and blur
radius until the patch's mean and standard deviation land inside the range set
by the two glyphs either side of it, which is what stops a crisp modern render
reading as pasted onto printed art.

    python scripts/fix-6koma-kyuu.py [--dry-run] [review.png]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "docs" / "assets" / "problem-6koma.png"
CJK = "C:/Windows/Fonts/YuGothM.ttc"

# Measured off the image: the three glyph cells between the parentheses.
CELL = (793, 695, 808, 713)          # the one to repair
NEIGHBOURS = [(779, 699, 792, 713), (808, 695, 821, 709)]   # 定 and 日, untouched


def stats(a, box):
    r = a[box[1]:box[3], box[0]:box[2]].astype(np.float32)
    return float(r.mean()), float(r.std())


def render(w, h, size_ratio, blur, ink, paper_rows):
    """One candidate 休, at this weight and softness, on the sign's own paper."""
    scale = 10
    layer = Image.new("L", (w * scale, h * scale), 255)
    d = ImageDraw.Draw(layer)
    font = ImageFont.truetype(CJK, int(h * scale * size_ratio))
    tw = d.textlength("休", font=font)
    d.text(((w * scale - tw) / 2, h * scale * 0.52), "休", font=font, fill=0, anchor="lm")
    layer = layer.rotate(-1.4, resample=Image.BICUBIC, fillcolor=255)
    layer = layer.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur))
    mask = np.asarray(layer, dtype=np.float32) / 255.0
    return paper_rows * mask + ink * (1.0 - mask)


def main():
    original = Image.open(TARGET).convert("RGB")
    grey = np.asarray(original.convert("L"))

    target_mean = float(np.mean([stats(grey, b)[0] for b in NEIGHBOURS]))
    target_std = float(np.mean([stats(grey, b)[1] for b in NEIGHBOURS]))

    x0, y0, x1, y1 = CELL
    w, h = x1 - x0, y1 - y0
    # Paper that follows the sign's own gradient, taken row by row from the ink
    # free margins to either side of the glyph run.
    paper = np.zeros((h, w), dtype=np.float32)
    for i in range(h):
        near = np.concatenate([grey[y0 + i, 762:776], grey[y0 + i, 826:840]]).astype(np.float32)
        keep = near[(near > 140) & (near < 245)]
        paper[i, :] = keep.mean() if keep.size else 185.0

    best = None
    for ratio in (0.76, 0.82, 0.88, 0.94):
        for blur in (0.30, 0.45, 0.60, 0.80):
            for ink in (10, 18, 26, 34, 45, 60):
                cand = render(w, h, ratio, blur, ink, paper)
                cost = abs(cand.mean() - target_mean) / target_mean + abs(cand.std() - target_std) / target_std
                if best is None or cost < best[0]:
                    best = (cost, ratio, blur, ink, cand)

    cost, ratio, blur, ink, cand = best
    rng = np.random.default_rng(11)
    cand = np.clip(cand + rng.integers(-4, 5, cand.shape), 0, 255)

    im = original.copy()
    im.paste(Image.fromarray(np.repeat(cand[..., None], 3, axis=2).astype("uint8")), (x0, y0))

    after = np.asarray(im.convert("L"))
    changed = np.argwhere(np.asarray(original, np.int16).sum(2) != np.asarray(im, np.int16).sum(2))
    outside = [(y, x) for y, x in changed if not (y0 <= y < y1 and x0 <= x < x1)]
    if outside:
        raise SystemExit(f"{len(outside)} pixels changed outside the cell; refusing to write")

    print(f"fitted: size {ratio}, blur {blur}, ink {ink}  (cost {cost:.4f})")
    print(f"neighbours mean {target_mean:.1f} std {target_std:.1f}")
    print(f"repaired   mean {stats(after, CELL)[0]:.1f} std {stats(after, CELL)[1]:.1f}")
    print(f"{len(changed)} pixels changed, all inside the cell")

    if len(sys.argv) > 1 and sys.argv[-1].endswith(".png"):
        b = (760, 688, 845, 718)
        k = 9
        sheet = Image.new("RGB", ((b[2] - b[0]) * k, (b[3] - b[1]) * k * 2 + 8), (20, 20, 20))
        sheet.paste(original.crop(b).resize(((b[2] - b[0]) * k, (b[3] - b[1]) * k), Image.LANCZOS), (0, 0))
        sheet.paste(im.crop(b).resize(((b[2] - b[0]) * k, (b[3] - b[1]) * k), Image.LANCZOS), (0, (b[3] - b[1]) * k + 8))
        sheet.save(sys.argv[-1])

    if "--dry-run" not in sys.argv:
        im.save(TARGET)


if __name__ == "__main__":
    main()
