# -*- coding: utf-8 -*-
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from render import render

STAMP = "2026-09-06"   # bump this; never overwrite an old export

DIAGRAMS = [
 ("flow", "The user flow", "user-flow",
  "What a group actually does, stage 0 to stage 8 - and the loop back from a stop closing to the plan re-deriving itself.",
  "docs/diagrams/user-flow.canvas"),
 ("mind", "The ideation mindmap", "ideation-mindmap",
  "Six days of thinking: what we claimed, what got built, three competitor scans, four dropped branches, and the marks still unclaimed.",
  "docs/diagrams/ideation-mindmap.canvas"),
]

panels, tabs = [], []
for i, (key, title, slug, blurb, path) in enumerate(DIAGRAMS):
    svg, (w, h) = render(path)
    print(f"{slug}: {w:.0f} x {h:.0f}")
    act = " active" if i == 0 else ""
    tabs.append(f'<button class="tab{act}" data-k="{key}">{title}</button>')
    panels.append(
      f'<section class="panel{act}" id="p-{key}" data-slug="{slug}">'
      f'<div class="bar"><div><h2>{title}</h2><p>{blurb}</p></div>'
      f'<div class="acts"><button class="btn fit">Fit to screen</button>'
      f'<button class="btn png" data-slug="{slug}">Download PNG</button></div></div>'
      f'<div class="stage"><div class="inner">{svg}</div></div></section>')

HTML = """<title>CodeNection diagrams</title>
<style>
:root{--bg:#f4f1ea;--card:#fffdf8;--ink:#2f2c28;--mut:#6f6a62;--line:#ddd8cd;--acc:#1e7f96}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,-apple-system,sans-serif}
header{padding:20px 26px 0;max-width:1600px;margin:0 auto}
h1{margin:0 0 4px;font-size:22px;letter-spacing:-.2px}
header p{margin:0;color:var(--mut);font-size:13.5px}
.tabs{display:flex;gap:8px;margin:16px 0 0;flex-wrap:wrap}
.tab{background:transparent;border:1px solid var(--line);border-bottom:none;border-radius:9px 9px 0 0;
padding:9px 16px;font:inherit;font-size:14px;color:var(--mut);cursor:pointer}
.tab.active{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 -1px 0 var(--acc) inset}
main{max-width:1600px;margin:0 auto;padding:0 26px 26px}
.panel{display:none;background:var(--card);border:1px solid var(--line);border-radius:0 12px 12px 12px}
.panel.active{display:block}
.bar{display:flex;gap:20px;justify-content:space-between;align-items:flex-start;
padding:16px 20px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.bar h2{margin:0 0 3px;font-size:16px}
.bar p{margin:0;color:var(--mut);font-size:13px;max-width:70ch}
.acts{display:flex;gap:8px}
.btn{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 13px;
font:inherit;font-size:13px;color:var(--ink);cursor:pointer;white-space:nowrap}
.btn:hover{border-color:var(--acc);color:var(--acc)}
.stage{height:calc(100vh - 235px);min-height:440px;overflow:hidden;position:relative;
cursor:grab;background:#faf8f4;border-radius:0 0 12px 12px}
.stage.drag{cursor:grabbing}
.inner{transform-origin:0 0}
.inner svg{display:block}
.hint{position:absolute;left:14px;bottom:12px;background:#fffdf8cc;border:1px solid var(--line);
border-radius:7px;padding:5px 10px;font-size:12px;color:var(--mut);pointer-events:none}
</style>
<header>
<h1>CodeNection 2026 &mdash; the ideation, drawn</h1>
<p>Generated from the JSON Canvas files in <code>docs/diagrams/</code>. Scroll to zoom, drag to pan.
The canvas files remain the source &mdash; open them in Obsidian to rearrange.</p>
<div class="tabs">__TABS__</div>
</header>
<main>__PANELS__</main>
<script>
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
  document.querySelectorAll('.tab,.panel').forEach(e=>e.classList.remove('active'));
  t.classList.add('active');
  const p=document.getElementById('p-'+t.dataset.k);
  p.classList.add('active'); fit(p);
});
const st=new WeakMap();
function fit(p){
  const s=p.querySelector('.stage'),i=p.querySelector('.inner'),g=i.querySelector('svg');
  const k=Math.min(s.clientWidth/g.width.baseVal.value, s.clientHeight/g.height.baseVal.value)*0.97;
  const v={k:k, x:(s.clientWidth-g.width.baseVal.value*k)/2, y:(s.clientHeight-g.height.baseVal.value*k)/2};
  st.set(p,v); apply(p);
}
function apply(p){const v=st.get(p);
  p.querySelector('.inner').style.transform=`translate(${v.x}px,${v.y}px) scale(${v.k})`;}
document.querySelectorAll('.panel').forEach(p=>{
  const s=p.querySelector('.stage');
  const h=document.createElement('div');h.className='hint';
  h.textContent='scroll to zoom \u00b7 drag to pan';s.appendChild(h);
  s.addEventListener('wheel',e=>{e.preventDefault();const v=st.get(p);
    const r=s.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    const f=Math.exp(-e.deltaY*0.0014),nk=Math.min(4,Math.max(0.04,v.k*f));
    v.x=mx-(mx-v.x)*(nk/v.k); v.y=my-(my-v.y)*(nk/v.k); v.k=nk; apply(p);},{passive:false});
  let d=null;
  s.addEventListener('pointerdown',e=>{d={x:e.clientX,y:e.clientY};s.classList.add('drag');
    s.setPointerCapture(e.pointerId);});
  s.addEventListener('pointermove',e=>{if(!d)return;const v=st.get(p);
    v.x+=e.clientX-d.x; v.y+=e.clientY-d.y; d={x:e.clientX,y:e.clientY}; apply(p);});
  s.addEventListener('pointerup',()=>{d=null;s.classList.remove('drag');});
  p.querySelector('.fit').onclick=()=>fit(p);
  p.querySelector('.png').onclick=ev=>{
    const b=ev.target, svg=p.querySelector('svg'), slug=b.dataset.slug;
    b.textContent='Rendering\u2026'; b.disabled=true;
    const W=svg.width.baseVal.value, H=svg.height.baseVal.value, S=2;
    const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(
      new XMLSerializer().serializeToString(svg));
    const img=new Image();
    img.onload=()=>{const c=document.createElement('canvas');
      c.width=W*S; c.height=H*S; const x=c.getContext('2d');
      x.fillStyle='#faf8f4'; x.fillRect(0,0,c.width,c.height);
      x.drawImage(img,0,0,c.width,c.height);
      c.toBlob(bl=>{const a=document.createElement('a');
        a.href=URL.createObjectURL(bl);
        a.download=new Date().toISOString().slice(0,10)+'-'+slug+'.png';
        a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
        b.textContent='Download PNG'; b.disabled=false;},'image/png');};
    img.onerror=()=>{b.textContent='Failed \u2014 use Obsidian'; b.disabled=false;};
    img.src=src;};
  fit(p);
});
addEventListener('resize',()=>document.querySelectorAll('.panel.active').forEach(fit));
</script>"""

open("docs/diagrams/preview.html", "w", encoding="utf-8").write(
    HTML.replace("__TABS__", "".join(tabs)).replace("__PANELS__", "".join(panels)))
print("wrote docs/diagrams/preview.html")

# Also write standalone SVG exports.
os.makedirs("docs/diagrams/exports", exist_ok=True)
for _k, _t, _slug, _b, _path in DIAGRAMS:
    _svg, (_w, _h) = render(_path)
    _out = "docs/diagrams/exports/%s-%s.svg" % (STAMP, _slug)
    open(_out, "w", encoding="utf-8").write(_svg)
    print(_out, "%.0f x %.0f" % (_w, _h))
