# Technical Architecture

**Project:** DriftCity — _Statistics for MLOps (MVP)_
**Stack:** Next.js (App Router) + MDX + React + Plotly.js
**Focus:** Two-column layout, MDX chapters, interactive charts, rapid build & deploy on Vercel

---

## 1) Architectural Goals & Constraints

- **Goals**
  - Content-first MVP: fast to ship, easy to extend.
  - Author chapters in **MDX** (markdown + React components).
  - Keep interactivity simple (Plotly charts, sliders) and **CSR-only** for heavy viz.
  - Reusable two-column layout with persistent sidebar.
  - Zero backend; use static files for demo datasets.

- **Constraints**
  - Prefer **static generation (SSG)** where possible.
  - Avoid SSR for Plotly (hydrate client components; use `dynamic()`).
  - Keep bundle light (lazy-load charts; tree-shake Plotly submodules if needed).

---

## 2) High-Level Architecture

```
Browser ↔ Next.js (App Router)
  ├── /app
  │    ├── (site shell) layout.tsx  → Header + TwoColumnShell
  │    ├── page.tsx                 → / (Chapter 1 default)
  │    ├── chapters/[slug]/page.tsx → dynamic MDX chapter route
  │    └── api/* (none in MVP)
  ├── MDX loader (next-mdx-remote / mdx-bundler via contentlayer)
  ├── Components (client/server split)
  ├── Public assets (images, CSV demo datasets)
  └── Theming (CSS variables, Tailwind optional)
```

**Routing strategy**

- `/` → loads Chapter 1 by default.
- `/chapters/[slug]` → each chapter as MDX (e.g., `data-distributions`, `covariate-shift`, …).

---

## 3) File/Folder Structure (proposed)

```
driftcity/
├─ app/
│  ├─ layout.tsx                 # Global shell (header + grid)
│  ├─ globals.css                # CSS reset + tokens
│  ├─ page.tsx                   # Home → loads first chapter
│  └─ chapters/
│     └─ [slug]/
│        └─ page.tsx            # Dynamic chapter renderer (MDX)
├─ content/                      # MDX source (authoring)
│  ├─ 1_data-distributions.mdx
│  ├─ 2_covariate-shift.mdx
│  ├─ 3_concept-drift.mdx
│  ├─ 4_ab-testing.mdx
│  ├─ 5_variance-reduction.mdx
│  └─ 6_monitoring-guardrails.mdx
├─ components/
│  ├─ layout/
│  │  ├─ TwoColumnShell.tsx      # Sidebar + content area
│  │  └─ Sidebar.tsx
│  ├─ mdx/
│  │  ├─ MDXRenderer.tsx         # Compiles & renders MDX (client)
│  │  └─ shortcodes.tsx          # <Figure/InteractivePlot/.../>
│  ├─ charts/
│  │  ├─ InteractivePlot.tsx     # dynamic Plotly wrapper (client)
│  │  ├─ PSIWidget.tsx
│  │  ├─ PowerCurve.tsx
│  │  ├─ CUPEDDemo.tsx
│  │  └─ ResidualHeatmap.tsx
│  ├─ ui/
│  │  ├─ ChapterIntro.tsx
│  │  ├─ ChapterTakeaway.tsx
│  │  ├─ CodeBlock.tsx
│  │  └─ Slider.tsx
│  └─ lib/
│     ├─ chapters.ts             # Chapter metadata (title, slug)
│     └─ mdx.ts                  # MDX bundling helpers
├─ public/
│  ├─ images/…                   # Static illustrations
│  └─ data/
│     ├─ rides_baseline.csv
│     ├─ rides_rainstorm.csv
│     └─ eta_model_performance.csv
├─ styles/
│  └─ tokens.css                 # :root CSS variables (colors, spacing)
├─ next.config.js
├─ package.json
└─ README.md
```

---

## 4) MDX Integration

**Option A (recommended for App Router):** `next-mdx-remote` + `mdx-bundler` (or `contentlayer`)

- Pros: Works well with file-based content; supports rehype/remark plugins; code fences; MDX shortcodes.
- For MVP simplicity, load MDX **on the client** (CSR) to avoid SSR + Plotly issues.
  If you prefer static build of MDX, render server-side but keep chart blocks as client components.

**MDX Renderer pattern (client)**

```tsx
// components/mdx/MDXRenderer.tsx
"use client";

import { useEffect, useState } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import shortcodes from "./shortcodes";

export default function MDXRenderer({ code }: { code: string }) {
  const [Comp, setComp] = useState<any>(null);
  useEffect(() => {
    setComp(() => getMDXComponent(code));
  }, [code]);

  if (!Comp) return null;
  return <Comp components={shortcodes} />;
}
```

**Shortcodes example**

```tsx
// components/mdx/shortcodes.tsx
import Figure from "../ui/Figure";
import ChapterIntro from "../ui/ChapterIntro";
import ChapterTakeaway from "../ui/ChapterTakeaway";
import InteractivePlot from "../charts/InteractivePlot";
import PSIWidget from "../charts/PSIWidget";
import PowerCurve from "../charts/PowerCurve";
import CUPEDDemo from "../charts/CUPEDDemo";
import ResidualHeatmap from "../charts/ResidualHeatmap";
import CodeBlock from "../ui/CodeBlock";

export default {
  Figure,
  ChapterIntro,
  ChapterTakeaway,
  InteractivePlot,
  PSIWidget,
  PowerCurve,
  CUPEDDemo,
  ResidualHeatmap,
  CodeBlock,
};
```

**MDX build helper**

- If using `mdx-bundler`, pre-bundle MDX files (during build) and pass compiled code as prop to the client `MDXRenderer`.
- Alternatively, fetch raw `.mdx` text at runtime (CSR) for MVP, then bundle client-side.

---

## 5) Component Hierarchy & Responsibilities

**Layout**

- `layout/TwoColumnShell.tsx` (server)
  - Grid template: `sidebar 280px | content auto`
  - Provides sticky sidebar, scrollable content pane.

- `layout/Sidebar.tsx` (server)
  - Renders chapter list from `lib/chapters.ts` with active slug highlighting.

**MDX Rendering**

- `mdx/MDXRenderer.tsx` (client)
  - Receives compiled MDX code (or raw) → renders with shortcodes.

**Charts (client components)**

- `charts/InteractivePlot.tsx`
  - Thin wrapper around **dynamic-imported** `react-plotly.js`.

- `charts/PSIWidget.tsx`
  - Accepts two datasets (baseline/current), renders overlay histograms + PSI calc.

- `charts/PowerCurve.tsx`
  - Sliders: effect size (MDE), alpha, sample size → renders power curve.

- `charts/CUPEDDemo.tsx`
  - Slider: correlation (ρ) → shows variance reduction on CI bands.

- `charts/ResidualHeatmap.tsx`
  - Heatmap from CSV or synthetic grid (zone × hour).

**UI**

- `ui/ChapterIntro`, `ui/ChapterTakeaway` – visually distinct callouts.
- `ui/CodeBlock` – Prism-powered, copy-to-clipboard.
- `ui/Slider` – shared slider with label & value bubble.
- `ui/Figure` – image + caption.

---

## 6) Two-Column Layout & Navigation

- **Header**: Logo, “All Chapters” dropdown (optional), basic links.
- **Left Column (Sidebar)**:
  - List of 6 chapters with active indicator.
  - Anchor links to sections inside a chapter (optional later).

- **Right Column (Content)**:
  - MDX content: intro → overview → interactive widgets → code → takeaway.

**Layout snippet**

```tsx
// app/layout.tsx
import "./globals.css";
import TwoColumnShell from "@/components/layout/TwoColumnShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TwoColumnShell>{children}</TwoColumnShell>
      </body>
    </html>
  );
}
```

```tsx
// components/layout/TwoColumnShell.tsx
import Sidebar from "./Sidebar";
export default function TwoColumnShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <header className="header">DriftCity</header>
      <div className="grid">
        <aside>
          <Sidebar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

---

## 7) Plotly Integration (Performance-Safe)

- Use **`react-plotly.js`** via **dynamic import** to avoid SSR:

```tsx
// components/charts/InteractivePlot.tsx
"use client";

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function InteractivePlot({ data, layout, config }: any) {
  return <Plot data={data} layout={layout} config={config} style={{ width: "100%" }} />;
}
```

- Consider **partial bundles** (`plotly.js-basic-dist-min`) if charts are basic.
- Lazy-load heavy widgets when visible (IntersectionObserver).

---

## 8) Data Handling Flow (Static CSVs)

- **Where:** `/public/data/*.csv`
- **How:** fetch with `fetch('/data/rides_baseline.csv')` (client) → parse with `Papaparse` or simple `d3-fetch`.
- **Why:** Keeps MVP backend-less and reproducible.

**Example (PSIWidget)**

```tsx
useEffect(() => {
  async function load() {
    const [baseRes, currRes] = await Promise.all([
      fetch("/data/rides_baseline.csv"),
      fetch("/data/rides_rainstorm.csv"),
    ]);
    const baseText = await baseRes.text();
    const currText = await currRes.text();
    // parse → compute PSI → set state → render
  }
  load();
}, []);
```

---

## 9) Styling & Theming

- **Tokens** in `styles/tokens.css`:

```css
:root {
  --color-blue: #00d8ff;
  --color-amber: #ffb347;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --color-sidebar: #f2f3f5;
  --radius: 12px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
}
```

- Global typography (Inter for body; Orbitron for h1/h2).
- Optional Tailwind: speeds layout; if used, include `tailwind.config.js` with tokens.

---

## 10) Accessibility & SEO

- **A11y**
  - Landmark roles: `<header>`, `<nav>`, `<main>`.
  - Keyboard focus styles for sidebar and sliders.
  - Color contrast check for Blue/Amber on light background.

- **SEO**
  - `metadata` in App Router per page (title/description).
  - OpenGraph image per chapter (static).

---

## 11) Build, Linting, Testing

- **Build**: `next build && next start` (Vercel recommended).
- **Lint/Format**: ESLint + Prettier; TypeScript strict.
- **Testing (minimal MVP)**
  - Component smoke tests (Jest + React Testing Library) for charts and MDXRenderer.
  - Lighthouse accessibility/performance check.

---

## 12) Deployment & Environments

- **Hosting**: Vercel (zero-config for Next.js).
- **Env config**: None required for static CSVs.
- **Caching**: `Cache-Control` for images/data; consider immutable for CSVs (version filenames).

---

## 13) Security & Privacy

- No user data collection in MVP.
- Ensure third-party libs are up-to-date.
- License images appropriately (note sources).

---

## 14) Chapter Slugs & Metadata

```ts
// components/lib/chapters.ts
export const chapters = [
  { slug: "data-distributions", title: "The City That Learned Too Fast" },
  { slug: "covariate-shift", title: "The Weather Event" },
  { slug: "concept-drift", title: "The Vanishing Commuter" },
  { slug: "ab-testing", title: "The Duel of Engines" },
  { slug: "variance-reduction", title: "The CUPED Control Tower" },
  { slug: "monitoring-guardrails", title: "The City Restored" },
];
```

---

## 15) Example Dynamic Route

```tsx
// app/chapters/[slug]/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { compileMDX } from "@/components/lib/mdx"; // wrapper for mdx-bundler

export default async function ChapterPage({ params }: { params: { slug: string } }) {
  const mdxPath = path.join(process.cwd(), "content", `${mapSlugToFile(params.slug)}.mdx`);
  const source = await fs.readFile(mdxPath, "utf-8");
  const { code } = await compileMDX(source);
  return <MDXRenderer code={code} />;
}
```

> For MVP, `compileMDX` can run at build-time (SSG) or in a simple server action. If you want fully static, pre-bundle all MDX in a small build script and write JSON code blobs to `.cache/` that `MDXRenderer` consumes.

---

## 16) Interactive Widgets (Spec Summaries)

- **PSIWidget**
  - Props: `baselineCsv`, `currentCsv`, `feature`, `bins`, `threshold`.
  - Outputs overlay histograms + PSI numeric + threshold color state.

- **PowerCurve**
  - Props: `alpha`, `effectRange`, `nRange`.
  - Renders power vs. sample size; sliders for `effect`, `n`.

- **CUPEDDemo**
  - Props: `correlation` (0–0.9 slider), `variance`.
  - Shows CI narrowing; displays `% variance reduction`.

- **ResidualHeatmap**
  - Props: `csv`, `zoneField`, `hourField`, `residualField`.
  - Heatmap with hover tooltips.

---

## 17) Progressive Enhancement Plan

- V2: Add anchor TOC per chapter and “Back to top”.
- V3: Light motion with Framer for section fades (still two-column).
- V4: Scrollytelling landing page; reuse same content modules.

---

## 18) Example MDX Snippet (Chapter 2)

```mdx
# The Weather Event

<ChapterIntro>
  A sudden storm altered rider behavior. Inputs changed — the model didn’t.
</ChapterIntro>

### Compare Distributions

<PSIWidget
  baselineCsv="/data/rides_baseline.csv"
  currentCsv="/data/rides_rainstorm.csv"
  feature="trip_distance_km"
  bins={30}
  threshold={0.25}
/>

### Code

<CodeBlock language="python">
  {`from scipy.stats import ks_2samp
ks_2samp(baseline['trip_distance_km'], current['trip_distance_km'])`}
</CodeBlock>

<ChapterTakeaway>
  Covariate drift whispers through features you thought were stable.
</ChapterTakeaway>
```

---

## 19) Risks & Mitigations (Tech)

| Risk                    | Mitigation                                                                     |
| ----------------------- | ------------------------------------------------------------------------------ |
| Plotly bundle size      | Dynamic import; basic-dist; lazy render on viewport                            |
| MDX + App Router quirks | Keep MDX compilation minimal; use proven recipes (contentlayer or mdx-bundler) |
| CSV parse cost          | Cache parsed results in component state; debounce re-renders                   |
| Layout CLS              | Reserve heights for figures; avoid layout shifts                               |

---

## 20) Developer Setup

```bash
pnpm create next-app driftcity --ts --eslint
pnpm add react-plotly.js plotly.js-basic-dist
pnpm add mdx-bundler next-mdx-remote remark-gfm rehype-slug rehype-autolink-headings
pnpm add prismjs
# optional
pnpm add -D tailwindcss postcss autoprefixer
```

---

### ✅ Summary

This architecture prioritizes **MDX-first authoring**, **client-only interactive charts**, and a **simple two-column UX**. It’s optimized for **speed to MVP** with a clean path to scale into richer storytelling (scrollytelling, motion) later—without rewriting the content system.

---
