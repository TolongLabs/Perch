# 01 - Canvas UI

|              |                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Source**   | https://canvasui.dev , docs and component pages                                                                                                   |
| **Read**     | 2026-09-07, **opened in a real browser**, not fetched. Chrome 152 on Windows                                                                      |
| **Kind**     | Open-source component library, 40 effects, 4.5k GitHub stars. Built by David Haz, of `reactbits.dev`                                              |
| **Why this** | It was on the list as a "beautiful UI repository". The question was whether any of it is usable on a page judged from a video and a deployed link |

## What It Actually Does

**One mechanism, applied forty ways: it paints real DOM into a canvas and lets a shader distort it.** The library calls
this `html-in-canvas` - "an experimental browser capability that lets a canvas element lay out and paint live DOM
content. Your components become a texture that shaders can sample and distort, **without screenshots, iframes, or
DOM-to-image hacks**."

The consequence is the interesting part, and it is stated plainly in the docs: **"They render over real HTML, so the
content underneath stays interactive."** The text stays selectable, the buttons stay clickable, the accessibility tree
survives. The effect is a layer, not a replacement.

**The catalogue.** ASCII Object, ASCII Sweep, Asciify, Bend, Blaze, Bubble, Canvas, Cloth, Clouds, Decrypt Reveal,
Dithered Object, Displacement, Droplets, Flame Wrap, Force Field, Frost, Glass, Glass Object, Glitch, Glyph Rain, Grid,
Hex Float, Ink Object, Laser, Liquid, Liquid Object, Magnify, Particle Object, Particle Reveal, Particle Scroll, Peel,
Retro Dither, Ripple, Shatter, VHS.

**How it ships.** Six framework builds - React, Vue, Svelte, Solid, Preact, vanilla TypeScript - each a single
standalone file, distributed through a shadcn registry rather than a package:

```
npx shadcn@latest add @canvas-ui/ripple-react
```

Installing drops the source into your project. There is no dependency to update and nothing to lock you in. There is
also an MCP server, so `npx shadcn@latest mcp init --client claude` lets an agent browse and install components.

**Two renderer builds, one public API.** WebGL uses GLSL and has no dependencies except `three` for the object effects;
WebGPU uses WGSL and adds `vgpu`. Both expose `create<Base>()`, `<Base>Options`, `setOptions()` and `destroy()`, so
switching renderer is replacing one file.

## The Decision Behind It

**The whole library is built on a graceful-degradation contract, and that is the part worth stealing.** It is written
into the docs rather than left as an implementation detail:

> Components detect support at runtime and degrade gracefully: without it, your content renders as normal HTML and the
> parts of the effect that can still run, still do. **Nothing breaks for users on other browsers.**

The WebGPU path goes further - it "returns `null` synchronously when `navigator.gpu` or an adapter is missing so
framework wrappers can fall back without throwing". **The failure mode was designed before the effect was.**

**Measured on this machine, because the docs' claim needed testing.** Chrome 152, Windows:

| Probe                                             | Result                      |
| ------------------------------------------------- | --------------------------- |
| `navigator.gpu`                                   | present                     |
| `drawElement` / `layoutSubtree` on the 2D context | absent                      |
| `CanvasRenderingContext2D.prototype`, DOM-related | **`drawElementImage`** only |

So the API surface exists in current Chrome under the name `drawElementImage`, but the docs are explicit that
html-in-canvas is **"an experimental Chrome feature, currently in origin trial"**. It works on `canvasui.dev` because
that origin holds a trial token. It does not follow that it works on ours.

## What Transfers To Us

**The fallback discipline, and it transfers whole.** Our prototype is judged from a deployed link that judges open on
their own machines, and from a recorded video. We do not control the browser. **Every visual decision we make has to
have a defined answer to "and if this does not run?"** Canvas UI answers it per component; we should answer it per
screen, and say so in `DESIGN.md`.

**The content-stays-real principle.** Effects render _over_ live HTML rather than replacing it with a picture of itself.
Any decoration we add to the itinerary has to leave the itinerary readable, selectable and clickable underneath. **A
decorative layer that eats the content is how a demo becomes a screenshot.**

**One effect, in one place, if any.** If a single Canvas UI component earns its place in our build it is a **reveal on
the substituted card** - `Decrypt Reveal` or `Particle Reveal` - fired at the exact moment a closed stop is replaced
from the bench. That is the one instant where our whole claim becomes visible, and it is currently a card quietly
changing its text. **A reveal there is not ornament, it is the argument.** Anywhere else on the page it is ornament.

## What Does Not, And Why

**The origin trial is a Feasibility risk, not a feature.** Scope realism is 5 marks and resource awareness is 4, and the
honest reading is that betting a headline visual on an experimental API means one of two outcomes: it silently falls
back and the judge sees the plain page, so the effort bought nothing; or it does not, and the demo differs from what we
recorded. **Neither is worth a mark.**

**The catalogue is mostly the tells, itemised.** `Frost`, `Glass` and `Glass Object` are glassmorphism; `VHS`, `Glitch`
and `Retro Dither` are texture for its own sake; `Flame Wrap`, `Blaze` and `Laser` are spectacle with no information in
them. AGENTS.md names "glassmorphism with no reason for depth" as a tell, and a library of forty effects is a very
efficient way to acquire several tells at once.

**And the user we named cannot afford it.** `personas.md` puts Aisyah on a phone at midnight, re-checking whether a
place opens on Sunday. A fluid simulation running over that page costs battery and reading speed and gives her nothing.
**The effects are built for a hero section on a desktop portfolio, which is not the screen we are judged on.**

## Checked Against The Tells

**Yes, and knowingly.** Adopting this library broadly would import glassmorphism, unmotivated depth and decorative
motion in a single install - three of the eleven shapes AGENTS.md lists.

**The one exception argued above passes the "structure must mean something" test**: a reveal animation on a substituted
itinerary card carries real information, namely _this is the thing that just changed and here is why_. It is a state
change made visible. **Every other effect in the catalogue would be decoration on content that is already doing the
work**, and should be declined.
