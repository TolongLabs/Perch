# -*- coding: utf-8 -*-
"""Render the .canvas files into a browsable page and into dated SVG exports.

Run from the repository root:  python docs/diagrams/build/build.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from render import render

STAMP = "2026-09-06"   # bump this; never overwrite an old export

DIAGRAMS = [
    ("flow", "The user flow", "user-flow",
     "What a group actually does, stage 0 to stage 8 — and the loop back from a stop "
     "closing to the plan re-deriving itself.",
     "docs/diagrams/user-flow.canvas"),
    ("mind", "The ideation mindmap", "ideation-mindmap",
     "Six days of thinking: what we claimed, what got built, three competitor scans, four "
     "dropped branches, and the marks still unclaimed.",
     "docs/diagrams/ideation-mindmap.canvas"),
]

LEGEND = [
    ("n1", "Open question"),
    ("n5", "Live branch"),
    ("n4", "Survived pressure"),
    ("n3", "A cost or caveat"),
    ("n6", "Dropped, kept on purpose"),
]

TOKENS = ("n0-bg n0-br n0-fg n1-bg n1-br n1-fg n2-bg n2-br n2-fg n3-bg n3-br n3-fg "
          "n4-bg n4-br n4-fg n5-bg n5-br n5-fg n6-bg n6-br n6-fg "
          "dg-ground dg-edge dg-dim dg-chip dg-chip-br dg-chip-fg").split()

CSS = """
:root{
  --ground:#e9ece9; --surface:#fbfcfb; --sunk:#f3f5f3;
  --ink:#171d1b; --muted:#5d6764; --line:#d2d8d4; --accent:#0d6b74; --accent-soft:#d7e9ea;
  --n0-bg:#ffffff; --n0-br:#ccd3cf; --n0-fg:#202725;
  --n1-bg:#fbe6e4; --n1-br:#b8392c; --n1-fg:#6f1c14;
  --n2-bg:#fbecdd; --n2-br:#c56c1a; --n2-fg:#7d4310;
  --n3-bg:#faf3d8; --n3-br:#a38200; --n3-fg:#5f4b00;
  --n4-bg:#e2f3e7; --n4-br:#2c8a4b; --n4-fg:#19542d;
  --n5-bg:#dff0f5; --n5-br:#1a7a90; --n5-fg:#0f4a57;
  --n6-bg:#ece6f4; --n6-br:#6642a1; --n6-fg:#3d2662;
  --dg-ground:#f3f5f3; --dg-edge:#96a09c; --dg-dim:#7d8783;
  --dg-chip:#ffffff; --dg-chip-br:#ccd3cf; --dg-chip-fg:#5d6764;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --ground:#0f1313; --surface:#171d1e; --sunk:#12191a;
  --ink:#e4eae7; --muted:#93a09c; --line:#28312f; --accent:#54cdd6; --accent-soft:#16383c;
  --n0-bg:#1d2426; --n0-br:#39433f; --n0-fg:#dde3e0;
  --n1-bg:#33191a; --n1-br:#d4645a; --n1-fg:#f6cdc8;
  --n2-bg:#332314; --n2-br:#d8913f; --n2-fg:#f6dcbc;
  --n3-bg:#2e2a12; --n3-br:#c4a72b; --n3-fg:#f0e6b4;
  --n4-bg:#152a1e; --n4-br:#4fae72; --n4-fg:#c4e9d1;
  --n5-bg:#122a31; --n5-br:#43a8c0; --n5-fg:#bde3ed;
  --n6-bg:#231c33; --n6-br:#9376cf; --n6-fg:#d8ccef;
  --dg-ground:#12191a; --dg-edge:#5c6a67; --dg-dim:#7b8783;
  --dg-chip:#1d2426; --dg-chip-br:#39433f; --dg-chip-fg:#a4b0ac;
}}
:root[data-theme="dark"]{
  --ground:#0f1313; --surface:#171d1e; --sunk:#12191a;
  --ink:#e4eae7; --muted:#93a09c; --line:#28312f; --accent:#54cdd6; --accent-soft:#16383c;
  --n0-bg:#1d2426; --n0-br:#39433f; --n0-fg:#dde3e0;
  --n1-bg:#33191a; --n1-br:#d4645a; --n1-fg:#f6cdc8;
  --n2-bg:#332314; --n2-br:#d8913f; --n2-fg:#f6dcbc;
  --n3-bg:#2e2a12; --n3-br:#c4a72b; --n3-fg:#f0e6b4;
  --n4-bg:#152a1e; --n4-br:#4fae72; --n4-fg:#c4e9d1;
  --n5-bg:#122a31; --n5-br:#43a8c0; --n5-fg:#bde3ed;
  --n6-bg:#231c33; --n6-br:#9376cf; --n6-fg:#d8ccef;
  --dg-ground:#12191a; --dg-edge:#5c6a67; --dg-dim:#7b8783;
  --dg-chip:#1d2426; --dg-chip-br:#39433f; --dg-chip-fg:#a4b0ac;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font:400 15px/1.55 "IBM Plex Sans","Segoe UI",system-ui,sans-serif;
  display:flex;flex-direction:column;min-height:100vh}
h1,h2{font-family:Newsreader,Georgia,"Times New Roman",serif;font-weight:500;
  letter-spacing:-.01em;text-wrap:balance;margin:0}

header{display:flex;flex-wrap:wrap;gap:18px 28px;align-items:baseline;
  padding:22px 30px 18px;max-width:1720px;width:100%;margin:0 auto}
h1{font-size:27px;line-height:1.1}
.sub{color:var(--muted);font-size:13.5px;max-width:62ch;flex:1 1 320px}
.sub code{font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace;font-size:12.5px;
  color:var(--ink)}

.switch{display:flex;gap:2px;padding:3px;background:var(--surface);
  border:1px solid var(--line);border-radius:11px;margin:0 30px;max-width:1720px}
.switch button{flex:0 0 auto;background:none;border:0;border-radius:8px;cursor:pointer;
  font:inherit;font-size:13.5px;color:var(--muted);padding:8px 17px;text-align:left}
.switch button:hover{color:var(--ink)}
.switch button[aria-selected="true"]{background:var(--accent-soft);color:var(--accent);
  font-weight:600}
.switch button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

main{flex:1;display:flex;flex-direction:column;padding:14px 30px 0;
  max-width:1720px;width:100%;margin:0 auto;min-height:0}
.panel{display:none;flex:1;flex-direction:column;min-height:0}
.panel[data-on]{display:flex}
.bar{display:flex;gap:20px;justify-content:space-between;align-items:baseline;
  flex-wrap:wrap;padding:0 2px 11px}
.bar h2{font-size:18px}
.bar p{margin:3px 0 0;color:var(--muted);font-size:13px;max-width:76ch}
.acts{display:flex;gap:7px}
button.act{background:var(--surface);border:1px solid var(--line);border-radius:8px;
  padding:7px 13px;font:inherit;font-size:13px;color:var(--ink);cursor:pointer}
button.act:hover{border-color:var(--accent);color:var(--accent)}
button.act:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.stage{flex:1;min-height:380px;position:relative;overflow:hidden;cursor:grab;
  background:var(--sunk);border:1px solid var(--line);border-radius:12px}
.stage:active{cursor:grabbing}
.stage:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.inner{transform-origin:0 0}
.inner svg{display:block}
.hint{position:absolute;left:13px;bottom:11px;pointer-events:none;
  background:color-mix(in srgb, var(--surface) 86%, transparent);
  border:1px solid var(--line);border-radius:7px;padding:4px 10px;
  font-size:12px;color:var(--muted)}
.shot{position:absolute;inset:0;background:var(--surface);display:none;
  flex-direction:column;gap:11px;padding:15px;overflow:auto}
.shot[data-on]{display:flex}
.shot p{margin:0;font-size:13px;color:var(--muted)}
.shot img{max-width:100%;border:1px solid var(--line);border-radius:8px}

footer{padding:15px 30px 26px;max-width:1720px;width:100%;margin:0 auto;
  display:flex;gap:14px 34px;flex-wrap:wrap;align-items:center;
  border-top:1px solid var(--line);margin-top:15px}
.key{display:flex;gap:16px;flex-wrap:wrap}
.key span{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--muted)}
.key i{width:13px;height:13px;border-radius:4px;display:block}
.band{margin-left:auto;font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace;
  font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.band b{color:var(--ink);font-weight:600}
@media (max-width:760px){
  header,main,footer{padding-left:18px;padding-right:18px}
  .switch{margin:0 18px}
  .band{margin-left:0}
}
"""

JS = """
const TOKENS=__TOKENS__;
const S=new WeakMap();
function fit(p){
  const st=p.querySelector('.stage'), g=p.querySelector('svg');
  const w=g.width.baseVal.value, h=g.height.baseVal.value;
  const k=Math.min(st.clientWidth/w, st.clientHeight/h)*0.96;
  S.set(p,{k, x:(st.clientWidth-w*k)/2, y:(st.clientHeight-h*k)/2}); draw(p);
}
function draw(p){const v=S.get(p);
  p.querySelector('.inner').style.transform=
    'translate('+v.x+'px,'+v.y+'px) scale('+v.k+')';}

document.querySelectorAll('.switch button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.switch button').forEach(o=>
    o.setAttribute('aria-selected', String(o===b)));
  document.querySelectorAll('.panel').forEach(o=>o.removeAttribute('data-on'));
  const p=document.getElementById('p-'+b.dataset.k);
  p.setAttribute('data-on','');
  fit(p);
}));

document.querySelectorAll('.panel').forEach(p=>{
  const st=p.querySelector('.stage');
  st.addEventListener('wheel',e=>{
    e.preventDefault(); const v=S.get(p); if(!v) return;
    const r=st.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top;
    const nk=Math.min(4,Math.max(0.03, v.k*Math.exp(-e.deltaY*0.0014)));
    v.x=mx-(mx-v.x)*(nk/v.k); v.y=my-(my-v.y)*(nk/v.k); v.k=nk; draw(p);
  },{passive:false});
  let d=null;
  st.addEventListener('pointerdown',e=>{d={x:e.clientX,y:e.clientY};
    st.setPointerCapture(e.pointerId);});
  st.addEventListener('pointermove',e=>{if(!d)return; const v=S.get(p);
    v.x+=e.clientX-d.x; v.y+=e.clientY-d.y; d={x:e.clientX,y:e.clientY}; draw(p);});
  st.addEventListener('pointerup',()=>{d=null;});
  st.addEventListener('keydown',e=>{
    const v=S.get(p), step=e.shiftKey?260:80; let hit=true;
    if(e.key==='ArrowLeft') v.x+=step; else if(e.key==='ArrowRight') v.x-=step;
    else if(e.key==='ArrowUp') v.y+=step; else if(e.key==='ArrowDown') v.y-=step;
    else if(e.key==='+'||e.key==='=') v.k=Math.min(4,v.k*1.2);
    else if(e.key==='-') v.k=Math.max(0.03,v.k/1.2);
    else if(e.key==='0') {fit(p); return;} else hit=false;
    if(hit){e.preventDefault(); draw(p);}
  });
  p.querySelector('.fit').addEventListener('click',()=>fit(p));
  p.querySelector('.pic').addEventListener('click',ev=>{
    const b=ev.currentTarget, shot=p.querySelector('.shot'), svg=p.querySelector('svg');
    b.textContent='Rendering\\u2026'; b.disabled=true;
    const cs=getComputedStyle(document.documentElement);
    const decl=TOKENS.map(t=>'--'+t+':'+cs.getPropertyValue('--'+t).trim()).join(';');
    const clone=svg.cloneNode(true);
    const style=document.createElementNS('http://www.w3.org/2000/svg','style');
    style.textContent='svg{'+decl+'}';
    clone.insertBefore(style, clone.firstChild);
    const W=svg.width.baseVal.value, H=svg.height.baseVal.value, SC=2;
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas'); c.width=W*SC; c.height=H*SC;
      const x=c.getContext('2d');
      x.fillStyle=cs.getPropertyValue('--dg-ground').trim();
      x.fillRect(0,0,c.width,c.height);
      x.drawImage(img,0,0,c.width,c.height);
      shot.querySelector('img').src=c.toDataURL('image/png');
      shot.setAttribute('data-on',''); b.textContent='Save as image'; b.disabled=false;
    };
    img.onerror=()=>{b.textContent='Could not render'; b.disabled=false;};
    img.src='data:image/svg+xml;charset=utf-8,'+
      encodeURIComponent(new XMLSerializer().serializeToString(clone));
  });
  p.querySelector('.back').addEventListener('click',()=>
    p.querySelector('.shot').removeAttribute('data-on'));
});
addEventListener('resize',()=>document.querySelectorAll('.panel[data-on]').forEach(fit));
document.querySelectorAll('.panel[data-on]').forEach(fit);
"""


def main():
    panels, tabs = [], []
    for i, (key, title, slug, blurb, path) in enumerate(DIAGRAMS):
        svg, (w, h) = render(path)
        svg = svg.replace('id="ar"', 'id="ar-%s"' % slug).replace("url(#ar)", "url(#ar-%s)" % slug)
        print("%-18s %.0f x %.0f" % (slug, w, h))
        on = " data-on" if i == 0 else ""
        tabs.append('<button data-k="%s" role="tab" aria-selected="%s">%s</button>'
                    % (key, "true" if i == 0 else "false", title))
        panels.append(
            '<section class="panel" id="p-%s"%s role="tabpanel">'
            '<div class="bar"><div><h2>%s</h2><p>%s</p></div>'
            '<div class="acts"><button class="act fit">Fit to screen</button>'
            '<button class="act pic">Save as image</button></div></div>'
            '<div class="stage" tabindex="0" role="img" aria-label="%s"><div class="inner">%s</div>'
            '<div class="hint">scroll to zoom · drag to pan · press 0 to fit</div>'
            '<div class="shot"><p>Right-click the image and choose <b>Save image as…</b> '
            '— rendered at 2× in the theme you are viewing. '
            '<button class="act back">Back to the canvas</button></p>'
            '<img alt="%s rendered as a bitmap"></div>'
            '</section>' % (key, on, title, blurb, blurb, svg, title))

    key_html = "".join(
        '<span><i style="background:var(--%s-bg);'
        'box-shadow:inset 0 0 0 1.5px var(--%s-br)"></i>%s</span>' % (t, t, label)
        for t, label in LEGEND)

    html = """<title>The Ideation, Drawn</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>%s</style>
<header>
<h1>The ideation, drawn</h1>
<p class="sub">Two canvases from the CodeNection&nbsp;2026 research notebook, generated from the
JSON Canvas files in <code>docs/diagrams/</code>. The canvas files stay the source — these are
a picture of them.</p>
</header>
<div class="switch" role="tablist">%s</div>
<main>%s</main>
<footer>
<div class="key">%s</div>
<p class="band"><b>Visual diagrams and mindmaps — 8%%</b> of the prototype score.
The top band asks for a mindmap <b>plus</b> a problem tree or user flow.</p>
</footer>
<script>%s</script>
""" % (CSS, "".join(tabs), "".join(panels), key_html,
       JS.replace("__TOKENS__", repr(TOKENS).replace("'", '"')))

    open("docs/diagrams/preview.html", "w", encoding="utf-8").write(html)
    print("wrote docs/diagrams/preview.html")

    os.makedirs("docs/diagrams/exports", exist_ok=True)
    for _k, _t, slug, _b, path in DIAGRAMS:
        svg, (w, h) = render(path, standalone=True)
        out = "docs/diagrams/exports/%s-%s.svg" % (STAMP, slug)
        open(out, "w", encoding="utf-8").write(svg)
        print("wrote %s" % out)


main()
