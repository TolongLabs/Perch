# Architecture And Implementation Reference

Technical architecture, data contracts, and implementation specifications for **Perch by TolongLabs**. External
submission overview and product rationale live in [`README.md`](README.md).

---

## 1. Architectural Philosophy

Perch is designed as a **deterministic, zero-backend single-page application** for the prototype phase. This
architecture guarantees that evaluation is immune to external API outages, rate limits, or network latency.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Browser Client (React 19)                       │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │   Surfaces & Router   │ ◄─────────► │    LocalStorage Context    │  │
│  │  Deck, Desk, Book, …  │             │   Runtime Type Guards      │  │
│  └──────────┬────────────┘             └────────────────────────────┘  │
│             │                                                          │
│             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Deterministic Heuristic Engine (schedule.ts)        │  │
│  │          Clustering ──► TSP Sequencing ──► Slack Rationale       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────┬──────────────────────────────┘
             │                            │
             ▼                            ▼
┌─────────────────────────┐  ┌───────────────────────────────────────────┐
│   Google Cloud Run      │  │           Static External Media           │
│   Nginx Alpine Reverse  │  │   Google Cloud Storage (Public Reels)     │
│   Proxy & SPA Fallback  │  │   OpenStreetMap (Public Tile Server)      │
└─────────────────────────┘  └───────────────────────────────────────────┘
```

---

## 2. Deterministic Scheduling Engine

The scheduler (`v2/src/lib/schedule.ts`) is a deterministic heuristic algorithm. The user-facing copy never refers to it
as artificial intelligence.

### Three-Stage Scheduling Pipeline

1. **Spatial Clustering**: Filters voted-in places by geographic cluster (e.g. Shinjuku, Shibuya, Asakusa, Ueno) to
   minimize cross-town transit legs between morning, afternoon, and evening slots.
2. **Nearest-Neighbour Sequencing**: Computes optimal stop ordering using a pre-calculated travel matrix, ensuring the
   day progresses along the shortest geographic path.
3. **Temporal Feasibility & Slack Evaluation**: Evaluates opening hours and transit durations against a 21:00 ceiling.
   If transit slack exceeds 1.25× the optimal heuristic baseline, the day state switches from green to gold with an
   explicit minute-difference rationale.

---

## 3. Data Fixtures And Spatial Matrix

### Tokyo Place Dataset

Place data is hand-authored in [`v2/src/data/tokyo.ts`](../v2/src/data/tokyo.ts):

- **24 Curated Places**: Distributed evenly across four Tokyo geographic clusters.
- **Embedded Attributes**: Japanese kanji names, romaji titles, opening hours, closed weekdays, admission prices in JPY
  and MYR, and short field-guide descriptions.
- **24×24 Travel Matrix**: Symmetric transit duration matrix covering transit minutes between all pairs. The diagonal is
  zero; all off-diagonal values are positive integers.

---

## 4. Media Provenance And Assets

### Hero Video Loop

- **Generation Source**: Produced with **Google Gemini Videos** on 9 September 2026 from a team-authored prompt.
- **Framing & Aspect**: A 10-second aerial pan across Tokyo at dawn. The lower-right corner was cropped to eliminate
  generator watermarks rather than masking them.
- **Delivery**: Served as muted, looping WebM and MP4 formats from Google Cloud Storage with a static JPEG poster frame
  fallback for users requesting reduced motion.

### Video Reels

- **Reels Manifest**: Curated short-form vertical videos listed in
  [`v2/src/data/reels.json`](../v2/src/data/reels.json).
- **Attribution**: Every reel is credited with creator handle, origin platform, and direct source link.

---

## 5. CSS 3D Flipbook Mechanics

The Book surface presents itineraries as an authentic physical field guide.

### Pure CSS Perspective

- **Technique Attribution**: Perspective mechanics adapt the transform principles from `create-photo-flipbook-ui` (MIT).
- **Implementation**: Written in clean, dependency-free CSS using `perspective: 2000px`, `transform-style: preserve-3d`,
  and `rotateY` transforms on page leaves.
- **Zero Framework Footprint**: Eliminates heavyweight WebGL, Canvas, or Three.js dependencies, ensuring fast initial
  paint and low memory consumption on mobile devices.

---

## 6. Runtime Contracts And Storage

### LocalStorage Schema Validation

- **Boundary Validation**: Application state is stored under a single local storage key and verified using TypeScript
  type predicates (`isTrip`) before parsing.
- **Schema Migration**: Trips loaded from earlier prototype releases are migrated automatically on load to ensure
  seamless testing.
- **Session Closure Contract**: Voting sessions close deterministically. Unvoted cards are recorded as skipped
  abstentions, ensuring the full-party denominator remains balanced.

---

## 7. Containerization And Deployment

### Docker Multi-Stage Build

The container pipeline in [`Dockerfile`](../Dockerfile) ensures reproducible builds:

```dockerfile
FROM oven/bun:1.3-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 8080
```

### Nginx Routing Configuration

- **Legacy Mockup Route**: `/v1/` resolves directly to static HTML mockups.
- **SPA Fallback**: Resolves all deep trip routes (e.g. `/t/<trip>`) back to `/index.html` to allow client-side router
  resolution.
- **Cloud Run Hosting**: Containerized execution in `asia-southeast1` using Google Cloud Workload Identity Federation.

---

## 8. Build Phase Technical Roadmap

The building phase (21 September – 11 October) bridges the standalone prototype to full multi-user production:

| Service               | Planned Integration                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Supabase**          | PostgreSQL database with Row Level Security, user authentication, and realtime vote sync.  |
| **Place Ingestion**   | Automated seeding from OpenStreetMap, Wikidata, and Wikimedia Commons.                     |
| **Google Routes API** | Real-time transit duration calculation and walking polyline rendering.                     |
| **LLM Rationale**     | Natural language intent extraction on onboarding input (heuristic scheduler remains code). |
