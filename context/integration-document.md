# 🧩 DriftCity MVP — Integration Document

**Scope:** How Chapters 1–6 link together technically — routing, shared components, nav metadata, data/plots, and deployment on Vercel.
**Stack:** Next.js (App Router) + MDX + React + Plotly (client-only) + static CSV fixtures.

---

## 1) Architectural Overview

- **Pattern:** Content-first app. Each chapter is an MDX document rendered within a **two-column shell** (sidebar + content).
- **Authoring:** MDX files under `/content/…` with **shortcodes** that map to React components (plots, callouts, figures).
- **Rendering:** Next.js App Router, static generation where possible; Plotly charts loaded as **client components** via dynamic import.
- **Data:** Static CSV fixtures in `/public/data` or per-chapter `/app/chapters/chapter-X/fixtures/…` for easy versioning.
- **Styling:** CSS variables (tokens) and utility classes (optionally Tailwind) for consistency and speed.

---

## 2) Repository Structure (final)

```
driftcity/
├─ app/
│  ├─ layout.tsx                   # Root shell -> TwoColumnShell
│  ├─ globals.css                  # Normalize + base + tokens import
│  ├─ page.tsx                     # redirects to first chapter
│  └─ chapters/
│     ├─ [slug]/
│     │  ├─ page.tsx               # Reads compiled MDX by slug
│     │  └─ head.tsx               # Per-page metadata (optional)
│     ├─ chapter-1/
│     │  ├─ page.tsx
│     │  ├─ content.mdx
│     │  ├─ fixtures/…             # CSVs for chapter 1
│     │  └─ plots/…                # Plot spec ts modules
│     ├─ chapter-2/ …              # same pattern through chapter-6
│     └─ chapter-6/ …
├─ components/
│  ├─ layout/
│  │  ├─ TwoColumnShell.tsx
│  │  ├─ HeaderBar.tsx
│  │  └─ Sidebar.tsx
│  ├─ mdx/
│  │  ├─ MDXRenderer.tsx           # client renderer
│  │  └─ shortcodes.tsx            # MDX component map
│  ├─ content/                      # Presentational content components
│  │  ├─ Aside.tsx Callout.tsx Figure.tsx KPI.tsx …
│  ├─ plots/                        # Plot wrappers (client)
│  │  ├─ InteractivePlot.tsx HistogramPanel.tsx
│  │  ├─ HistogramCompare.tsx PSITrend.tsx DriftGauge.tsx
│  │  ├─ RMSETrend.tsx ScatterCompare.tsx ResidualHeatmap.tsx
│  │  ├─ ABDistribution.tsx SRMGauge.tsx PowerCurve.tsx
│  │  ├─ CUPEDDemo.tsx SequentialChart.tsx
│  │  ├─ MonitoringDashboard.tsx DriftPerfScatter.tsx GuardrailTimeline.tsx
│  ├─ ui/
│  │  ├─ CodeBlock.tsx ToggleGroup.tsx Slider.tsx DataTable.tsx CodeTabs.tsx
│  └─ lib/
│     ├─ chapters.ts               # nav metadata (titles, slugs, order)
│     ├─ mdx.ts                    # compile/bundle helpers
│     ├─ csv.ts                    # CSV fetch + cache + parse
│     └─ viewport.ts               # in-viewport lazy render util
├─ content/                         # (optional) alternative authoring root
│  └─ chapter-*.mdx                # if you prefer keeping MDX here
├─ public/
│  ├─ images/…                     # static illustrations
│  └─ data/…                       # shared datasets (if any)
├─ styles/
│  ├─ tokens.css                   # color/type/spacing variables
│  └─ theme.css                    # global typography + components
├─ next.config.js
├─ package.json
└─ README.md
```

> You can keep chapter-specific fixtures & plot-specs inside each chapter’s directory to make them easy to move/copy and to keep PRs scoped.

---

## 3) Routing Map

- `/` → redirect to first chapter (`/chapters/chapter-1`).
- `/chapters/[slug]` → dynamic chapter route rendering `content.mdx`.
- **Slugs:** `chapter-1` … `chapter-6`. You can alias “friendly” slugs later (e.g., `data-distributions`) by updating metadata.

**`app/page.tsx`**

```tsx
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/chapters/chapter-1");
}
```

**`app/chapters/[slug]/page.tsx` (SSG-friendly)**

```tsx
import { getChapterMeta, getAllChapters, loadMDX } from "@/components/lib/mdx";
import MDXRenderer from "@/components/mdx/MDXRenderer";

export async function generateStaticParams() {
  return getAllChapters().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = await getChapterMeta(params.slug);
  return { title: `${meta.title} • DriftCity` };
}

export default async function ChapterPage({ params }: { params: { slug: string } }) {
  const { code } = await loadMDX(params.slug); // returns compiled code string
  return <MDXRenderer code={code} />;
}
```

---

## 4) Navigation Metadata

**`components/lib/chapters.ts`**

```ts
export type ChapterMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  order: number;
};
export const chapters: ChapterMeta[] = [
  { slug: "chapter-1", title: "The City That Learned Too Fast", order: 1 },
  { slug: "chapter-2", title: "The Weather Event", order: 2 },
  { slug: "chapter-3", title: "The Vanishing Commuter", order: 3 },
  { slug: "chapter-4", title: "The Duel of Engines", order: 4 },
  { slug: "chapter-5", title: "The CUPED Control Tower", order: 5 },
  { slug: "chapter-6", title: "The City Restored", order: 6 },
];
```

**`Sidebar.tsx`** reads this and highlights the active slug:

```tsx
import Link from "next/link";
import { chapters } from "@/components/lib/chapters";
import { useSelectedLayoutSegments } from "next/navigation";

export default function Sidebar() {
  const seg = useSelectedLayoutSegments(); // ["chapters","chapter-2"] in RSC
  const active = seg[1];
  return (
    <nav aria-label="Chapters" className="sidebar">
      <ul>
        {chapters
          .sort((a, b) => a.order - b.order)
          .map(c => (
            <li key={c.slug}>
              <Link
                href={`/chapters/${c.slug}`}
                aria-current={active === c.slug ? "page" : undefined}
                className={`nav-link ${active === c.slug ? "nav-link--active" : ""}`}
              >
                {c.order}. {c.title}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
```

---

## 5) MDX Pipeline & Shortcodes

- **Compilation:** Use `mdx-bundler` (build time) or `next-mdx-remote` for flexibility. In MVP we compile at build to keep runtime simple.
- **Shortcodes:** Map MDX tags to React components.

**`components/mdx/shortcodes.tsx`**

```tsx
import Aside from "@/components/content/Aside";
import Callout from "@/components/content/Callout";
import Figure from "@/components/content/Figure";
import CodeTabs from "@/components/ui/CodeTabs";
import DataTable from "@/components/ui/DataTable";
// Plots
import HistogramPanel from "@/components/plots/HistogramPanel";
import HistogramCompare from "@/components/plots/HistogramCompare";
import DriftGauge from "@/components/plots/DriftGauge";
import PSITrend from "@/components/plots/PSITrend";
import RMSETrend from "@/components/plots/RMSETrend";
import ScatterCompare from "@/components/plots/ScatterCompare";
import ResidualHeatmap from "@/components/plots/ResidualHeatmap";
import ABDistribution from "@/components/plots/ABDistribution";
import SRMGauge from "@/components/plots/SRMGauge";
import PowerCurve from "@/components/plots/PowerCurve";
import CUPEDDemo from "@/components/plots/CUPEDDemo";
import SequentialChart from "@/components/plots/SequentialChart";
import MonitoringDashboard from "@/components/plots/MonitoringDashboard";
import DriftPerfScatter from "@/components/plots/DriftPerfScatter";
import GuardrailTimeline from "@/components/plots/GuardrailTimeline";

const shortcodes = {
  Aside,
  Callout,
  Figure,
  CodeTabs,
  DataTable,
  HistogramPanel,
  HistogramCompare,
  DriftGauge,
  PSITrend,
  RMSETrend,
  ScatterCompare,
  ResidualHeatmap,
  ABDistribution,
  SRMGauge,
  PowerCurve,
  CUPEDDemo,
  SequentialChart,
  MonitoringDashboard,
  DriftPerfScatter,
  GuardrailTimeline,
};

export default shortcodes;
```

---

## 6) Shared Plot Core (client-only)

- **Plotly import:** `react-plotly.js` via dynamic import with `ssr:false`.
- **CSV parsing:** `d3-dsv` or `papaparse` on client.
- **Visibility:** Use `IntersectionObserver` to mount heavy charts only when visible.

**`components/plots/_Plot.tsx`**

```tsx
"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
export default Plot;
```

**`components/lib/csv.ts`**

```ts
export async function loadCsv(url: string) {
  const res = await fetch(url, { cache: "force-cache" });
  const text = await res.text();
  const { csvParse } = await import("d3-dsv");
  return csvParse(text);
}
```

**`components/lib/viewport.ts`**

```ts
export function onVisible(el: Element, cb: () => void) {
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cb();
          io.disconnect();
        }
      });
    },
    { rootMargin: "150px" }
  );
  io.observe(el);
  return () => io.disconnect();
}
```

Each plot wrapper:

- fetches CSV via `loadCsv`
- transforms to arrays
- builds a spec using the chapter’s `plots/*.ts` factory
- renders `_Plot` only **after** visibility triggers (for perf)

---

## 7) Per-Chapter Linkage Summary

| Chapter                | Key Components                                                 | CSV / Plots                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Distributions      | `HistogramPanel`, `DriftGauge`, `CodeTabs`                     | `rides_baseline.csv`, `rides_today.csv`, `baselineSpec.ts`, `psiGaugeSpec.ts`                                                                       |
| 2 — Covariate Drift    | `HistogramCompare`, `DriftGauge`, `PSITrend`                   | `rides_baseline.csv`, `rides_rainstorm.csv`, `psi_over_time.csv`, `covariateSpec.ts`, `psiTrendSpec.ts`                                             |
| 3 — Concept Drift      | `RMSETrend`, `ScatterCompare`, `ResidualHeatmap`               | `eta_model_performance.csv`, `rides_concept_drift.csv`, `residual_heatmap.csv`, `rmseTrendSpec.ts`, `scatterCompareSpec.ts`, `residualHeatSpec.ts`  |
| 4 — A/B Testing        | `ABDistribution`, `SRMGauge`, `PowerCurve`                     | `ab_test_results.csv`, `srm_check.csv`, `power_curve.csv`, `abDistributionSpec.ts`, `srmGaugeSpec.ts`, `powerCurveSpec.ts`                          |
| 5 — CUPED & Sequential | `CUPEDDemo`, `SequentialChart`                                 | `cuped_demo.csv`, `sequential_sim.csv`, `cupedVarianceSpec.ts`, `sequentialBoundarySpec.ts`                                                         |
| 6 — Observability Loop | `MonitoringDashboard`, `DriftPerfScatter`, `GuardrailTimeline` | `monitoring_dashboard.csv`, `drift_signals.csv`, `guardrail_events.csv`, `metricDashboardSpec.ts`, `driftVsPerfSpec.ts`, `guardrailTimelineSpec.ts` |

> All components follow the same prop shape: `dataUrl` + `spec(...)` → `<Plot />`.

---

## 8) Performance & Loading Strategy

- **Charts:** dynamic import `react-plotly.js` with `ssr:false`.
- **Lazy mount:** only when a chart wrapper becomes visible (IO).
- **Cache:** `fetch(url, { cache: "force-cache" })` for CSVs (immutable filenames recommended).
- **Bundle size:** prefer `plotly.js-basic-dist` if possible; keep specs simple.
- **Image optimization:** static `/public/images` (SVG/PNG < 200KB).

---

## 9) Accessibility & SEO

- **Landmarks:** `<header>`, `<nav aria-label="Chapters">`, `<main id="content">`.
- **Skip link:** “Skip to content” focuses `#content`.
- **Contrast:** tokens designed for WCAG AA; verify per chart background.
- **Alt text:** always provide `alt` for `<Figure>`.
- **Chart summaries:** a short textual interpretation under each chart.
- **Metadata:** `generateMetadata` per chapter title; optional `og:image`.

---

## 10) Testing & QA

- **Unit:** Smoke tests for MDXRenderer and each plot wrapper (mount without data; then with mock CSV).
- **Lighthouse:** ≥ 80 on Performance/A11y/Best Practices.
- **Visual:** Quick glance checks on tablet breakpoint (≥768px).
- **Data contract:** CI step that validates expected CSV headers per component (simple Node script).

---

## 11) Content Authoring Workflow

1. Create/modify `content.mdx` for a chapter.
2. Add/update fixtures in that chapter’s `fixtures/` folder.
3. If needed, author a `plots/*.ts` spec function (data → Plotly config).
4. Use shortcodes in MDX to embed components:

   ```mdx
   <HistogramCompare
     referenceUrl="./fixtures/rides_baseline.csv"
     currentUrl="./fixtures/rides_rainstorm.csv"
     feature="trip_distance_km"
     spec={CovariateSpec}
   />
   ```

5. Run local preview and commit.

---

## 12) Deployment Workflow (Vercel)

### Build Commands

- **Scripts (`package.json`)**

  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    }
  }
  ```

- **Vercel detects Next.js automatically.** No custom server needed.

### Environments

- **Preview:** Every PR → `*.vercel.app` preview URL.
- **Production:** Merge to `main` triggers production deploy.
- **Env vars:** None required for MVP (all static). If later adding APIs, set `VERCEL_ENV` vars.

### `vercel.json` (optional)

```json
{
  "functions": {
    "app/**": { "memory": 1024, "maxDuration": 10 }
  },
  "headers": [
    {
      "source": "/(.*).csv",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### Caching

- CSV fixtures named with stable filenames (or include hashes if you plan frequent updates).
- Images: serve with long `Cache-Control`; change name to bust cache.

### Preview QA Checklist

- Sidebar works & highlights current chapter.
- All charts mount when scrolled into view.
- No SSR errors (Plotly client-only).
- Lighthouse pass on preview.

---

## 13) Progressive Enhancement Hooks (post-MVP)

- **Scrollytelling landing page** at `/intro`: reuse chapters’ plots; orchestrate with ScrollTrigger/Framer.
- **Anchored section TOC** on the right (per chapter headings).
- **Analytics**: track interactions (slider moves, code-copy events) with a simple beacon endpoint or Vercel Analytics.
- **Dark mode**: attach to tokens `data-theme="dark"` and switch colors on CSS vars.

---

## 14) Security & Licensing

- No PII or real user data.
- Keep third-party deps updated.
- Record art asset license sources (Midjourney/DALL·E/SD) in `/docs/licenses.md`.
- Avoid inline eval in MDX; compile at build with a safe plugin set.

---

## 15) “Everything Works” Checklist

- [ ] `/` redirects to `/chapters/chapter-1`.
- [ ] Sidebar lists 1–6 with active state and keyboard focus.
- [ ] Each chapter renders MDX + at least one interactive plot.
- [ ] CSV fixtures exist and load; parsing stable.
- [ ] Plotly loads only on client; no hydration mismatch warnings.
- [ ] Images render with captions and alt.
- [ ] Lighthouse ≥ 80 (Perf/A11y/Best).
- [ ] Vercel preview + production deploys succeed.

---

## 16) Quick Start (Developer Onboarding)

```bash
# 1) bootstrap
pnpm i
pnpm dev   # http://localhost:3000

# 2) visit any chapter
open http://localhost:3000/chapters/chapter-1

# 3) build
pnpm build

# 4) deploy (Vercel CLI optional)
vercel --prod
```

---

### Final Notes

- The integration is intentionally **modular**: each chapter is self-contained while sharing a common shell and plot/runtime.
- The **MDX + shortcodes** approach lets content authors iterate without touching framework code.
- Vercel’s previews enable quick feedback loops — treat each chapter PR as a small release.

This document, together with the six chapter packs and the earlier architecture/spec docs, is **complete for MVP implementation and deployment.**
