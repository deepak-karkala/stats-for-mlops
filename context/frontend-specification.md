# Frontend Spec + ASCII Wireframe

**Project:** DriftCity — _Statistics for MLOps (MVP)_
**Scope:** Two-column UI, component contracts (props/state), interaction flows, accessibility, and exact ASCII wireframes.

---

## 1) UX Goals & Principles

- **Fast comprehension:** Persistent sidebar, predictable section structure.
- **Content-first:** MDX chapters with inline interactive widgets.
- **Minimal friction:** No SSR for charts, lazy/hydrated client widgets.
- **Consistency:** Reusable components + design tokens.
- **A11y:** Keyboard-first navigation, ARIA roles, sufficient contrast.

---

## 2) Page Layout & Regions

### 2.1 Global Regions (semantic + ARIA)

- `<header role="banner">` — site title/logo, menu.
- `<nav aria-label="Chapters">` — persistent sidebar.
- `<main id="content" tabindex="-1">` — chapter body (MDX).
- `<footer role="contentinfo">` — credits, repo link (optional, MVP can omit).

### 2.2 Grid & Breakpoints

- **Desktop (≥ 1200px)**: Sidebar 280px fixed; content fluid up to 1040px.
- **Tablet (768–1199px)**: Sidebar collapsible (toggle button), content 100%.
- **Mobile (≤ 767px)**: MVP is desktop/tablet-first; mobile can stack with top-nav list.

---

## 3) ASCII Wireframe (Exact)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Header (banner)                                                           │
│ ┌───────────────┐  DriftCity: Statistics for MLOps        [All Chapters] │
│ │  Logo ▦       │                                          [About]        │
│ └───────────────┘                                                         │
├───────────────────────────────────────────────────────────────────────────┤
│                            App Grid                                       │
│ ┌─────────────────────────┬──────────────────────────────────────────────┐ │
│ │ <nav aria-label="Chapters">                                           │ │
│ │ ┌───────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 1. The City That Learned Too Fast (Data Distributions)           │ │ │
│ │ │ 2. The Weather Event (Covariate Shift)                           │ │ │
│ │ │ 3. The Vanishing Commuter (Concept Drift)                        │ │ │
│ │ │ 4. The Duel of Engines (A/B Testing)                             │ │ │
│ │ │ 5. The CUPED Control Tower (Variance Reduction)                  │ │ │
│ │ │ 6. The City Restored (Monitoring & Guardrails)                   │ │ │
│ │ └───────────────────────────────────────────────────────────────────┘ │ │
│ │ [Collapse ▸] (tablet only)                                           │ │
│ └─────────────────────────┴──────────────────────────────────────────────┘ │
│                           <main id="content">                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ H1  Chapter Title                                                      │ │
│ │ <ChapterIntro> short context line(s).                                 │ │
│ │                                                                       │ │
│ │ H2  Concept Overview                                                  │ │
│ │ <Figure src="/images/chX.png" caption="Illustration">                 │ │
│ │                                                                       │ │
│ │ H2  Interactive                                                        │ │
│ │ [ PSIWidget ]  [ PowerCurve ]  [ CUPEDDemo ]  [ ResidualHeatmap ]     │ │
│ │                                                                       │ │
│ │ H2  Code                                                              │ │
│ │ <CodeBlock language="python">...</CodeBlock>                          │ │
│ │                                                                       │ │
│ │ <ChapterTakeaway> key learning bullets </ChapterTakeaway>             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────┤
│ Footer (optional)                                                         │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 4) Component Contracts (Props, State, Events)

### 4.1 Layout

#### `TwoColumnShell` (server)

- **Children:** `ReactNode`
- **Structure:** header + grid (aside + main)
- **Responsiveness:** adds `isSidebarCollapsed` CSS class via container on tablet breakpoint (CSS-only in MVP).

#### `Sidebar` (server)

- **Props:**
  - `chapters: {slug: string; title: string}[]`
  - `activeSlug: string`

- **Behavior:**
  - Highlights active item (`aria-current="page"`).
  - Links are `<Link href="/chapters/[slug]">`.

- **A11y:**
  - `<nav aria-label="Chapters">`
  - Keyboard focus ring + visible skip link to content.

#### `HeaderBar` (server)

- **Props:** none (MVP)
- **Slots:** brand/logo, “All Chapters” link, “About”
- **A11y:** role="banner"

---

### 4.2 MDX Rendering

#### `MDXRenderer` (client)

- **Props:** `{ code: string }` (compiled MDX from mdx-bundler)
- **State:** internal compiled component
- **Behavior:** mounts compiled MDX with **shortcodes** map
- **Error:** renders fallback message if compilation fails

#### Shortcodes Registry

- `Figure`, `ChapterIntro`, `ChapterTakeaway`, `InteractivePlot`,
  `PSIWidget`, `PowerCurve`, `CUPEDDemo`, `ResidualHeatmap`, `CodeBlock`

---

### 4.3 UI Elements

#### `Figure`

- **Props:**
  - `src: string`
  - `alt?: string`
  - `caption?: string`
  - `width?: number | string` (default 100%)

- **A11y:** `<figure><img alt/><figcaption/></figure>`

#### `CodeBlock`

- **Props:**
  - `language: "python" | "js" | "ts" | "bash" | ...`
  - `children: string`
  - `showCopy?: boolean` (default true)

- **Events:** copy-to-clipboard with toast (aria-live polite)

#### `Slider` (shared)

- **Props:**
  - `min: number`, `max: number`, `step?: number`, `value: number`, `onChange(value)`
  - `label?: string`, `format?(n): string`

- **A11y:** `<input type="range">` + `<label for=>`

---

### 4.4 Charts (client, lazy-loaded Plotly)

#### `InteractivePlot`

- **Props:**
  - `data: Partial<Plotly.Data>[]`
  - `layout?: Partial<Plotly.Layout>`
  - `config?: Partial<Plotly.Config>`
  - `height?: number | string`

- **State:** none (pure)
- **Notes:** dynamic import `react-plotly.js`, `ssr: false`

#### `PSIWidget`

- **Purpose:** Compare baseline vs current distributions; compute PSI.
- **Props:**
  - `baselineCsv: string`
  - `currentCsv: string`
  - `feature: string` (e.g., `"trip_distance_km"`)
  - `bins?: number` (default 30)
  - `threshold?: number` (default 0.25)

- **State:**
  - `baseline: number[]`
  - `current: number[]`
  - `psi: number`
  - `loading: boolean`, `error?: string`

- **Events/Behavior:**
  - On mount: fetch CSVs, parse → compute histogram + PSI.
  - Display KPI chip: PSI value; color states:
    - `psi < 0.1` = stable (blue)
    - `0.1 ≤ psi < 0.25` = watch (amber)
    - `≥ 0.25` = drift (red/amber)

- **A11y:** live region for PSI updates.

#### `PowerCurve`

- **Purpose:** Visualize power as function of sample size & effect (MDE).
- **Props:**
  - `alpha?: number` (default 0.05)
  - `nMin?: number` (default 500)
  - `nMax?: number` (default 50000)

- **State:**
  - `effect: number` (slider 0.05–0.8)
  - `n: number` (slider `nMin`–`nMax`)
  - computed `power: number` (0–1)

- **Notes:** uses closed-form t-test approx; visualizes curve + cursor.

#### `CUPEDDemo`

- **Purpose:** Demonstrate variance reduction via correlation with pre-metric.
- **Props:**
  - `initialCorr?: number` (default 0.4)

- **State:**
  - `rho` slider (0–0.9)
  - compute `% variance reduction = rho^2`

- **UI:** two vertical CI bands (Before vs After), “%↓ variance” label.

#### `ResidualHeatmap`

- **Purpose:** Residual bias across (zone × hour).
- **Props:**
  - `csv: string`
  - `zoneField: string`
  - `hourField: string`
  - `residualField: string`

- **State:** parsed matrix + color scale
- **UI:** heatmap + hover tooltip (zone, hour, mean residual)

---

## 5) Navigation & Routing

- **Routes**
  - `/` → redirect to `/chapters/data-distributions`
  - `/chapters/[slug]` → MDX page

- **Active state**
  - Sidebar item with matching slug: `aria-current="page"`; left border accent (blue).

- **Skip link**
  - At top: “Skip to content” → focuses `#content`

---

## 6) Interaction Rules

- Charts load **on visibility** (IntersectionObserver) to reduce initial cost.
- CSV fetches **in parallel** and cache in-memory per session (simple Map).
- If a widget errors (CSV missing), show inline alert with retry.
- Responsive:
  - Tablet: “Collapse ▸” hides sidebar (overlay drawer toggle).
  - Sidebar keyboard navigation: Up/Down to move; Enter to activate.

---

## 7) Theming & Tokens (class names / CSS vars)

- **CSS Vars** (in `:root`):
  - `--blue:#00D8FF; --amber:#FFB347; --text:#1A1A1A; --bg:#fff; --sidebar:#F2F3F5;`
  - `--radius:12px; --gap-1:8px; --gap-2:16px; --gap-3:24px;`

- **Classes**:
  - `.header`, `.grid`, `.sidebar`, `.nav-link`, `.nav-link--active`,
    `.content`, `.figure`, `.kpi-chip.stable|warn|drift`

Example KPI chip:

```
.kpi-chip { border-radius: 9999px; padding: 2px 10px; font: 12px/18px Inter; }
.kpi-chip.stable { background: rgba(0,216,255,.12); color:#007B92; }
.kpi-chip.warn   { background: rgba(255,179,71,.12); color:#A36200; }
.kpi-chip.drift  { background: rgba(255,71,71,.12);  color:#A30000; }
```

---

## 8) Accessibility Details

- Focus outlines: visible for sidebar links and sliders.
- Sliders: `<label>` with current value (e.g., “PSI threshold: 0.25”).
- Charts: provide `aria-label` and short textual summary beneath (two sentences max).
- Color contrast: ensure > 4.5:1 for text vs background.

---

## 9) Loading & Error States

- **Widget Skeletons:** gray boxes with shimmer for chart areas (min-height 260px).
- **Error Banner (inline):**
  - Text: “Couldn’t load data. [Retry]”
  - `role="alert"` + keyboard focus on appear.

---

## 10) Example MDX (Chapter block)

```mdx
# The Weather Event (Covariate Shift)

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

## 11) Component States (Checklist)

| Component       | Loading   | Empty       | Error          | Success           |
| --------------- | --------- | ----------- | -------------- | ----------------- |
| PSIWidget       | Skeleton  | “No data”   | Alert w/ Retry | Chart + PSI chip  |
| PowerCurve      | Immediate | N/A         | N/A            | Curve + sliders   |
| CUPEDDemo       | Immediate | N/A         | N/A            | CIs + % reduction |
| ResidualHeatmap | Skeleton  | “No matrix” | Alert w/ Retry | Heatmap           |

---

## 12) Analytics Hooks (optional, post-MVP)

- Track “widget-used” events (e.g., slider changes).
- Track “code-copied”.
- Track chapter dwell time.

_(Not needed for MVP; leave hooks baked-in but disabled.)_

---

## 13) Dev Handoff Notes

- Use TypeScript types for widget props.
- Keep Plotly minimal bundle (`plotly.js-basic-dist-min`) if possible.
- Ensure all CSVs exist in `/public/data` with expected headers:
  - `rides_baseline.csv` → at least `trip_distance_km`
  - `rides_rainstorm.csv` → same schema
  - `eta_model_performance.csv` → `date, rmse, mae`
  - Residual heatmap CSV → `city_zone, hour, residual`

---
