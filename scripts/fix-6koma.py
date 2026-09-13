"""Surgical Pillow repair; pass --source ORIGINAL --review REVIEW.png.

The source must be the unedited 1536x1024 comic. Keeping it separately permits
repeatable review passes without accumulating blur. No Git operations are used.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'docs/assets/problem-6koma.png'
SIGN = (779, 698, 792, 713)
LOGO = (1033, 519, 1092, 572)
REFERENCES = {'休': (794, 697, 807, 711), '日': (808, 695, 821, 709)}


def stats(im, box):
    a = np.asarray(im.convert('L').crop(box), dtype=float)
    # Ink-only levels avoid comparing the different amounts of whitespace in
    # three different characters. Edge strength uses adjacent pixel differences.
    ink = a[a < 135]
    edges = np.concatenate((np.abs(np.diff(a, axis=0)).ravel(),
                            np.abs(np.diff(a, axis=1)).ravel()))
    return {'mean': float(a.mean()), 'std': float(a.std()),
            'ink_mean': float(ink.mean()), 'ink_std': float(ink.std()),
            'edge_gradient': float(edges.mean())}


def sign_repair(im):
    original = np.asarray(im, dtype=float)
    a = original.copy()
    # Reuse the sign's own nearby paper, preserving grain and illumination.
    # Only lift the old top radical's ink; retain the lower horizontal and foot.
    for y in range(698, 705):
        for x in range(779, 792):
            paper = original[y - 6, x]
            strength = max(0, min(1, (y < 703) + (y == 703) * .9))
            weight = np.clip((190 - original[y, x, 0]) / 35, 0, 1) * strength
            a[y, x] = original[y, x] * (1 - weight) + paper * weight
    # A softly printed 宀 roof, slanted with the sign. The lower component is
    # original ink, including its uneven stroke ends and print texture.
    s = 16
    mask = Image.new('L', (13 * s, 15 * s))
    d = ImageDraw.Draw(mask)
    def stroke(points, width):
        pts = [((x - 779) * s, (y - 698) * s) for x, y in points]
        d.line(pts, fill=255, width=round(width * s), joint='curve')
        r = width * s / 2
        for x, y in (pts[0], pts[-1]):
            d.ellipse((x-r, y-r, x+r, y+r), fill=255)
    stroke([(785.2, 700.0), (785.5, 701.0)], 1.25)
    stroke([(781.9, 703.4), (782.1, 701.9), (789.5, 701.0), (789.2, 702.9)], 1.5)
    mask = mask.resize((13, 15), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.43))
    alpha = np.asarray(mask, dtype=float) / 255
    patch = a[698:713, 779:792]
    grain = original[692:707, 779:792, 0]
    ink = 30 + (grain - np.median(grain)) * .10
    a[698:713, 779:792] = patch * (1-alpha[..., None]) + ink[..., None] * alpha[..., None]
    return Image.fromarray(np.clip(a, 0, 255).round().astype('uint8'))


def logo_repair(im, original):
    # The old bird actually occupies x1035..1086, y523..569 in this source.
    # A 52px mark matches its width, fits inside the frame, and shares the
    # heading's optical centre. The text and frame are never painted over.
    a = np.asarray(im, dtype=float).copy()
    src = np.asarray(original, dtype=float)
    x0, y0, x1, y1 = LOGO
    for y in range(y0, y1):
        for x in range(x0, x1):
            # Copy clean bubble paper at the same height, not a flat fill.
            weight = np.clip((246 - src[y, x, 0]) / 35, 0, 1)
            a[y, x] = src[y, x] * (1-weight) + src[y, 1090 + (x % 3)] * weight
    s = 8
    side = 52
    mark = Image.new('RGB', (168*s, 168*s), '#FBF8F2')
    d = ImageDraw.Draw(mark)
    d.rounded_rectangle((0, 0, 168*s-1, 168*s-1), radius=28*s, fill='#2E261F')
    d.rounded_rectangle((32*s, 92*s, 136*s, 97*s), radius=2.5*s, fill='#FBF8F2')
    for cx, cy, r in ((54, 76, 16), (90, 81, 12), (118, 85, 9)):
        d.ellipse(((cx-r)*s, (cy-r)*s, (cx+r)*s, (cy+r)*s), fill='#FBF8F2')
    # Convert the specified brand colours to the comic's greyscale ink/paper.
    mark = mark.convert('L').resize((side, side), Image.Resampling.LANCZOS)
    mark = mark.filter(ImageFilter.GaussianBlur(.28))
    shape = Image.new('L', (168*s, 168*s))
    ImageDraw.Draw(shape).rounded_rectangle((0, 0, 168*s-1, 168*s-1), 28*s, fill=255)
    shape = shape.resize((side, side), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.28))
    alpha = np.asarray(shape, dtype=float)/255
    pixels = ((np.asarray(mark, dtype=float) - 40) * (237 / 208) + 10).clip(0, 255)
    # A little of the existing paper texture remains in the printed mark.
    pixels += (src[519:571, 1036:1088, 0] - 245).clip(-2, 2) * .3
    a[519:571, 1036:1088] = a[519:571, 1036:1088]*(1-alpha[..., None]) + pixels[..., None]*alpha[..., None]
    return Image.fromarray(a.clip(0, 255).round().astype('uint8'))


def review_sheet(before, after, path):
    rows = [((758, 691, 834, 719), 8), ((1025, 511, 1295, 581), 3)]
    sheet = Image.new('RGB', (1660, 540), '#dddddd')
    d = ImageDraw.Draw(sheet)
    y = 8
    for box, scale in rows:
        d.text((12, y), 'Before', fill='black')
        d.text((842, y), 'After', fill='black')
        size = ((box[2]-box[0])*scale, (box[3]-box[1])*scale)
        for x, im in ((12, before), (842, after)):
            sheet.paste(im.crop(box).resize(size, Image.Resampling.NEAREST), (x, y+20))
        y += size[1]+36
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--review', type=Path, required=True)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    before = Image.open(args.source).convert('RGB')
    assert before.size == (1536, 1024)
    after = logo_repair(sign_repair(before), before)
    changed = np.any(np.asarray(before) != np.asarray(after), axis=2)
    allowed = np.zeros(changed.shape, dtype=bool)
    for x0, y0, x1, y1 in (SIGN, LOGO):
        allowed[y0:y1, x0:x1] = True
    assert not np.any(changed & ~allowed)
    for box in (*REFERENCES.values(), (764, 694, 779, 714), (824, 694, 842, 716)):
        assert before.crop(box).tobytes() == after.crop(box).tobytes()
    measurements = {name: stats(after, box) for name, box in REFERENCES.items()}
    measurements['定'] = stats(after, (779, 699, 792, 713))
    reference = {k: np.mean([v[k] for v in list(measurements.values())[:2]]) for k in measurements['定']}
    for key, tolerance in [('mean', .20), ('std', .20), ('ink_mean', .25), ('ink_std', .30), ('edge_gradient', .30)]:
        assert abs(measurements['定'][key]/reference[key]-1) < tolerance, (key, measurements)
    review_sheet(before, after, args.review)
    if not args.dry_run:
        after.save(TARGET)
        assert Image.open(TARGET).tobytes() == after.tobytes()
    print(json.dumps({'glyphs': measurements, 'changed_pixels': int(changed.sum()),
                      'outside_regions': int((changed & ~allowed).sum())}, indent=2, ensure_ascii=True))


if __name__ == '__main__':
    main()
