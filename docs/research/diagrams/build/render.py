# -*- coding: utf-8 -*-
import json, re, html, os

PAD = 18
FS_BODY, LH_BODY = 14.5, 21
HEAD = {1: (23, 31), 2: (18.5, 26), 3: (16, 23)}
CHARW = 0.545          # average glyph width as a fraction of font size

# Colours are emitted as CSS custom properties so the drawing follows the
# page theme. The page defines --n1-bg / --n1-br / --n1-fg and so on.
def swatch(key):
    k = key if key in "123456" else "0"
    return ("var(--n%s-bg)" % k, "var(--n%s-br)" % k, "var(--n%s-fg)" % k)

def runs(line):
    out, i = [], 0
    for m in re.finditer(r"\*\*(.+?)\*\*|~~(.+?)~~|`(.+?)`", line):
        if m.start() > i: out.append((line[i:m.start()], set()))
        if m.group(1) is not None: out.append((m.group(1), {"b"}))
        elif m.group(2) is not None: out.append((m.group(2), {"s"}))
        else: out.append((m.group(3), {"m"}))
        i = m.end()
    if i < len(line): out.append((line[i:], set()))
    return out or [("", set())]

def wrap(text, width):
    avail = width - 2 * PAD
    lines = []
    for para in text.split("\n"):
        if not para.strip():
            lines.append(("blank", [], FS_BODY, LH_BODY)); continue
        lvl = 0
        m = re.match(r"^(#{1,3})\s+", para)
        if m:
            lvl = len(m.group(1)); para = para[m.end():]
        fs, lh = HEAD[lvl] if lvl else (FS_BODY, LH_BODY)
        maxch = max(8, int(avail / (fs * CHARW)))
        rs = runs(para)
        cur, curlen = [], 0
        for txt, st in rs:
            for word in re.findall(r"\S+\s*", txt) or [""]:
                wl = len(word)
                if curlen + wl > maxch and cur:
                    lines.append(("text", cur, fs, lh)); cur, curlen = [], 0
                    word = word.lstrip()
                    wl = len(word)
                if cur and cur[-1][1] == st: cur[-1] = (cur[-1][0] + word, st)
                else: cur.append((word, st))
                curlen += wl
        if cur: lines.append(("text", cur, fs, lh))
    return lines

def measure(n):
    if n.get("file"): return max(110, n["height"])
    ls = wrap(n["text"], n["width"])
    return max(62, sum(l[3] for l in ls) + 2 * PAD)

def relayout(nodes):
    for n in nodes:
        n["height"] = round(measure(n))
    for _ in range(400):
        moved = False
        for i in range(len(nodes)):
            for j in range(len(nodes)):
                if i == j: continue
                a, b = nodes[i], nodes[j]
                if not (a["x"] < b["x"] + b["width"] and b["x"] < a["x"] + a["width"]): continue
                if not (a["y"] < b["y"] + b["height"] + 40 and b["y"] < a["y"] + a["height"] + 40): continue
                if a["y"] <= b["y"]:
                    shift = a["y"] + a["height"] + 40 - b["y"]
                    if shift > 0.5: b["y"] += shift; moved = True
        if not moved: break
    return nodes

def esc(s): return html.escape(s, quote=False)

def node_svg(n):
    fill, stroke, fg = swatch(n.get("color") or "0")
    x, y, w, h = n["x"], n["y"], n["width"], n["height"]
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" '
         f'stroke="{stroke}" stroke-width="1.8"/>']
    if n.get("file"):
        o.append(f'<text x="{x+PAD}" y="{y+34}" font-size="13" fill="{stroke}" '
                 f'font-family="IBM Plex Mono, ui-monospace, Consolas, monospace">&#128196; live note</text>')
        o.append(f'<text x="{x+PAD}" y="{y+62}" font-size="14.5" font-weight="600" fill="{fg}" '
                 f'font-family="IBM Plex Mono, ui-monospace, Consolas, monospace">{esc(os.path.basename(n["file"]))}</text>')
        o.append(f'<text x="{x+PAD}" y="{y+86}" font-size="12" fill="var(--dg-dim)" '
                 f'font-family="IBM Plex Mono, ui-monospace, Consolas, monospace">{esc(os.path.dirname(n["file"]))}/</text>')
        return "".join(o)
    ty = y + PAD
    for kind, rs, fs, lh in wrap(n["text"], w):
        ty += lh
        if kind == "blank": continue
        parts = []
        for txt, st in rs:
            a = []
            if "b" in st: a.append('font-weight="700"')
            if "s" in st: a.append('text-decoration="line-through" opacity="0.62"')
            if "m" in st: a.append('font-family="IBM Plex Mono, ui-monospace, Consolas, monospace" font-size="%.1f"' % (fs*0.92))
            parts.append(f'<tspan {" ".join(a)}>{esc(txt)}</tspan>')
        weight = ' font-weight="700"' if fs > FS_BODY else ""
        o.append(f'<text x="{x+PAD}" y="{round(ty-5,1)}" font-size="{fs}" fill="{fg}"{weight}>'
                 + "".join(parts) + "</text>")
    return "".join(o)

def anchor(n, side):
    x, y, w, h = n["x"], n["y"], n["width"], n["height"]
    return {"left": (x, y+h/2), "right": (x+w, y+h/2),
            "top": (x+w/2, y), "bottom": (x+w/2, y+h)}[side]

def edge_svg(e, byid):
    a, b = byid[e["fromNode"]], byid[e["toNode"]]
    fs, ts = e.get("fromSide", "right"), e.get("toSide", "left")
    x1, y1 = anchor(a, fs); x2, y2 = anchor(b, ts)
    d = max(60, abs(x2-x1) * 0.42, abs(y2-y1) * 0.42)
    off = {"left": (-d, 0), "right": (d, 0), "top": (0, -d), "bottom": (0, d)}
    c1 = (x1 + off[fs][0], y1 + off[fs][1]); c2 = (x2 + off[ts][0], y2 + off[ts][1])
    p = (f'<path d="M{x1:.0f},{y1:.0f} C{c1[0]:.0f},{c1[1]:.0f} {c2[0]:.0f},{c2[1]:.0f} '
         f'{x2:.0f},{y2:.0f}" fill="none" stroke="var(--dg-edge)" stroke-width="1.9" '
         f'marker-end="url(#ar)"/>')
    if e.get("label"):
        mx = (x1 + c1[0] + c2[0] + x2) / 4; my = (y1 + c1[1] + c2[1] + y2) / 4
        lab = e["label"]; wpx = len(lab) * 6.6 + 16
        p += (f'<rect x="{mx-wpx/2:.0f}" y="{my-12:.0f}" width="{wpx:.0f}" height="23" rx="11.5" '
              f'fill="var(--dg-chip)" stroke="var(--dg-chip-br)" stroke-width="1.2"/>'
              f'<text x="{mx:.0f}" y="{my+4:.0f}" font-size="11.5" fill="var(--dg-chip-fg)" '
              f'text-anchor="middle" font-style="italic">{esc(lab)}</text>')
    return p

LIGHT_TOKENS = (
    "--n0-bg:#ffffff;--n0-br:#ccd3cf;--n0-fg:#202725;"
    "--n1-bg:#fbe6e4;--n1-br:#b8392c;--n1-fg:#6f1c14;"
    "--n2-bg:#fbecdd;--n2-br:#c56c1a;--n2-fg:#7d4310;"
    "--n3-bg:#faf3d8;--n3-br:#a38200;--n3-fg:#5f4b00;"
    "--n4-bg:#e2f3e7;--n4-br:#2c8a4b;--n4-fg:#19542d;"
    "--n5-bg:#dff0f5;--n5-br:#1a7a90;--n5-fg:#0f4a57;"
    "--n6-bg:#ece6f4;--n6-br:#6642a1;--n6-fg:#3d2662;"
    "--dg-ground:#f3f5f3;--dg-edge:#96a09c;--dg-dim:#7d8783;"
    "--dg-chip:#ffffff;--dg-chip-br:#ccd3cf;--dg-chip-fg:#5d6764;"
)

def render(path, standalone=False):
    d = json.load(open(path, encoding="utf-8"))
    nodes = relayout(d["nodes"])
    json.dump({"nodes": nodes, "edges": d["edges"]}, open(path, "w", encoding="utf-8"), indent=2)
    byid = {n["id"]: n for n in nodes}
    M = 90
    x0 = min(n["x"] for n in nodes) - M; y0 = min(n["y"] for n in nodes) - M
    x1 = max(n["x"] + n["width"] for n in nodes) + M
    y1 = max(n["y"] + n["height"] for n in nodes) + M
    body = ("".join(edge_svg(e, byid) for e in d["edges"])
            + "".join(node_svg(n) for n in nodes))
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.0f} {y0:.0f} '
        f'{x1-x0:.0f} {y1-y0:.0f}" width="{x1-x0:.0f}" height="{y1-y0:.0f}" '
        f'font-family="IBM Plex Sans, Segoe UI, system-ui, sans-serif">'
        f'<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
        f'markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0,0 L10,5 L0,10 z" fill="var(--dg-edge)"/></marker></defs>'
        + (f'<style>svg{{{LIGHT_TOKENS}}}</style>' if standalone else "")
        + f'<rect x="{x0:.0f}" y="{y0:.0f}" width="{x1-x0:.0f}" height="{y1-y0:.0f}" '
          f'fill="var(--dg-ground)"/>'
        + body
        + '</svg>')
    return svg, (x1 - x0, y1 - y0)
