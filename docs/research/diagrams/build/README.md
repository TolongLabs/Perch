# Regenerating the pictures

The `.canvas` files one folder up are **the source**. Open them in Obsidian, drag the boxes until
they read well, then run this from the repository root:

```
python docs/diagrams/build/build.py
```

It rewrites `docs/diagrams/preview.html` - a browsable version with pan, zoom and a
**Download PNG** button - and writes fresh `.svg` files into `docs/diagrams/exports/`.

**Bump `STAMP` in `build.py` before regenerating on a new day.** Old exports are never overwritten;
v1 sitting beside v2 is itself the evidence of iteration.

`render.py` also normalises each canvas: it re-measures every box against the text actually inside
it and pushes anything overlapping apart, then writes the corrected geometry back into the
`.canvas` file. So running the build tidies Obsidian's copy too.
