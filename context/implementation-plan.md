# Milestones (Phases)

Here’s a **practical, step-by-step implementation plan** you can drop into GitHub as Issues & Milestones. It’s split into **phases**, each with **tasks → GitHub issue cards** that include: title, description, files touched, definition of done/acceptance criteria, and an estimate. Follow it top-to-bottom and you’ll have a clean MVP on Vercel, then ship each chapter in sequence.

1. **Phase 0 – Project Setup & CI** (Day 0–1)
2. **Phase 1 – MVP Shell + Deploy** (Day 1–3)
3. **Phase 2 – Chapter Production (1→6)** (Week 1–3)
4. **Phase 3 – QA, Accessibility, Docs** (Week 4)
5. **Phase 4 – Post-MVP Enhancements** (Backlog)

> Tip: Make a GitHub **Milestone per Phase**, label issues with: `phase:X`, `type:feature|infra|docs|qa`, `priority:P1|P2`, and use a simple Kanban.

---

## Phase 0 — Project Setup & CI (Milestone: `P0-Setup`)

### Issue 0.1 — Initialize repo & base Next.js project

**Title:** Init Next.js (App Router) + TS + ESLint + Prettier
**Desc:** Scaffold project `driftcity` with App Router, TypeScript, ESLint+Prettier.
**Files:** root, `package.json`, `.eslintrc`, `.prettierrc`
**Acceptance Criteria**

- `pnpm dev` starts site on `localhost:3000`.
- ESLint+Prettier run without errors: `pnpm lint` / `pnpm format`.
- README includes quick start.
  **Estimate:** 0.5d

### Issue 0.2 — Add design tokens & global CSS

**Title:** Add tokens.css + global theme scaffolding
**Desc:** Create `styles/tokens.css` and wire in `app/globals.css`.
**Files:** `/styles/tokens.css`, `/app/globals.css`
**AC**

- CSS variables available: primary blue/amber, text, bg, spacing, radius.
- Tokens applied to body text & h1/h2.
  **Estimate:** 0.25d

### Issue 0.3 — CI (GitHub Actions) + Preview protection

**Title:** Configure CI for lint/build + PR checks
**Desc:** Add GitHub Actions to run `pnpm i`, `pnpm lint`, `pnpm build`.
**Files:** `.github/workflows/ci.yml`
**AC**

- CI must pass on PRs to `main`.
- Failing lint/build blocks merge.
  **Estimate:** 0.25d

---

## Phase 1 — MVP Shell + Deploy (Milestone: `P1-Shell`)

### Issue 1.1 — Two-column layout & routing skeleton

**Title:** Implement TwoColumnShell + Sidebar + Header
**Desc:** Build shell with sticky sidebar, main content area, header.
**Files:**
`/components/layout/TwoColumnShell.tsx`, `/components/layout/Sidebar.tsx`, `/components/layout/HeaderBar.tsx`, `/app/layout.tsx`
**AC**

- Sidebar width ~280px desktop, collapsible on tablet.
- Keyboard focus & `aria-label="Chapters"`.
- `/` redirects to `/chapters/chapter-1`.
  **Estimate:** 0.5d

### Issue 1.2 — MDX pipeline & shortcodes map

**Title:** MDX bundling + shortcodes integration
**Desc:** Add `mdx-bundler` (or next-mdx-remote), `MDXRenderer`, `shortcodes`.
**Files:** `/components/mdx/MDXRenderer.tsx`, `/components/mdx/shortcodes.tsx`, `/components/lib/mdx.ts`
**AC**

- A test MDX renders with `<Aside/> <Callout/> <Figure/>`.
- Build is SSG-friendly; no SSR errors.
  **Estimate:** 0.5d

### Issue 1.3 — Plotly client wrapper & CSV loader

**Title:** Plot core + CSV loader + lazy mount on visibility
**Desc:** Create `_Plot` (dynamic `react-plotly.js`), CSV parse helper, IO visibility util.
**Files:** `/components/plots/_Plot.tsx`, `/components/lib/csv.ts`, `/components/lib/viewport.ts`
**AC**

- Plot renders only on client, no hydration warnings.
- CSV fetched & parsed (`d3-dsv`).
- Plot mounts when scrolled into view.
  **Estimate:** 0.5d

### Issue 1.4 — Chapter directory skeletons (1–6)

**Title:** Create /app/chapters/chapter-\*/ (page.tsx + content.mdx)
**Desc:** Add empty content files and route.
**Files:** `/app/chapters/chapter-{1..6}/page.tsx`, `content.mdx`
**AC**

- Navigating each chapter route loads an empty MDX page with title.
  **Estimate:** 0.25d

### Issue 1.5 — Vercel deploy

**Title:** Configure Vercel project + environment
**Desc:** Connect repo to Vercel, set production branch.
**Files:** `vercel.json` (optional headers for csv caching)
**AC**

- Preview deploy works for PRs.
- Production deploy from `main` succeeds; public URL shared.
  **Estimate:** 0.25d

---

## Phase 2 — Chapter Production (Milestone per chapter: `P2-Ch1`, `P2-Ch2`, …)

> Repeat the following pattern **per chapter** (1 through 6).
> Each chapter has 4 issues: Content, Components, Data Fixtures, Plots.
> Close a chapter milestone only when all 4 pass AC.

### Chapter 1 (Milestone: `P2-Ch1`)

**Issue 2.1.1 — Ch1 content.mdx (baseline distributions)**
**Desc:** Paste full Ch1 MDX (implementation pack).
**Files:** `/app/chapters/chapter-1/content.mdx`
**AC:**

- Sections render: Intro, Concept, Interactive, Code, Takeaway.
- Links & captions present.
  **Estimate:** 0.25d

**Issue 2.1.2 — Ch1 components (HistogramPanel, DriftGauge)**
**Desc:** Implement or import components; wire props/contracts.
**Files:** `/components/plots/HistogramPanel.tsx`, `/components/plots/DriftGauge.tsx`
**AC:**

- HistogramPanel loads baseline CSV, 40 bins.
- DriftGauge calls `/api/psi` and displays threshold colors.
  **Estimate:** 0.5d

**Issue 2.1.3 — Ch1 data fixtures & API**
**Desc:** Add `rides_baseline.csv`, `rides_today.csv`; PSI endpoint.
**Files:** `/app/chapters/chapter-1/fixtures/*.csv`, `/app/api/psi/route.ts`
**AC:**

- API returns PSI JSON with fixed quantile bins.
- CSVs accessible under expected paths.
  **Estimate:** 0.25d

**Issue 2.1.4 — Ch1 plot specs**
**Desc:** Create `baselineSpec.ts`, `psiGaugeSpec.ts`.
**AC:**

- Plots render as designed; no mode bar.
  **Estimate:** 0.25d

> Repeat for Chapters 2–6 with the corresponding components/fixtures/specs you already have from the chapter packs:

- **Ch2:** `HistogramCompare`, `PSITrend` + `rides_rainstorm.csv`, `psi_over_time.csv`, `covariateSpec.ts`, `psiTrendSpec.ts`.
- **Ch3:** `RMSETrend`, `ScatterCompare`, `ResidualHeatmap` + `rides_concept_drift.csv`, `eta_model_performance.csv`, `residual_heatmap.csv`, plot specs.
- **Ch4:** `ABDistribution`, `SRMGauge`, `PowerCurve` + `ab_test_results.csv`, `srm_check.csv`, `power_curve.csv`, plot specs.
- **Ch5:** `CUPEDDemo`, `SequentialChart` + `cuped_demo.csv`, `sequential_sim.csv`, plot specs.
- **Ch6:** `MonitoringDashboard`, `DriftPerfScatter`, `GuardrailTimeline` + `monitoring_dashboard.csv`, `drift_signals.csv`, `guardrail_events.csv`, plot specs.

> **Acceptance Criteria (common across all chapters):**
>
> - All CSVs fetched; charts render without console errors.
> - Interactivity visible (hover tooltips, sliders where applicable).
> - MDX sections match template (Intro → Concept → Interactive → Code → Takeaway).
> - Tablet breakpoint (≥768px) shows clean stacking; no overflow.

**Rough Estimates per Chapter:** ~1–1.5 days each (content 0.25d + components 0.5d + fixtures 0.25d + plots 0.25d).

---

## Phase 3 — QA, Accessibility, Docs (Milestone: `P3-QA`)

### Issue 3.1 — A11y pass (ARIA + keyboard)

**Title:** Accessibility audit & fixes
**Desc:** Ensure `<nav aria-label>`, skip link, focus rings, alt text on figures, chart summaries.
**AC:**

- “Tab” navigates sidebar → content → footer.
- All figures have `alt`; each chart has 1–2 sentence textual summary under it.
  **Estimate:** 0.5d

### Issue 3.2 — Lighthouse & perf tune

**Title:** Lighthouse ≥ 80 Perf/A11y/Best Practices
**Desc:** Run Lighthouse against preview build; optimize images, lazy mount charts.
**AC:**

- Scores ≥ 80 on desktop.
- No large JS warnings beyond Plotly core.
  **Estimate:** 0.5d

### Issue 3.3 — CSV caching headers

**Title:** Add immutable caching for fixtures
**Desc:** Configure `vercel.json` headers for `.csv`.
**AC:**

- Response headers show `Cache-Control: public, max-age=31536000, immutable`.
  **Estimate:** 0.25d

### Issue 3.4 — Developer README & Contribution Guide

**Title:** Write README + CONTRIBUTING
**Desc:** Onboarding, folder structure, how to add a chapter, coding standards.
**AC:**

- Following steps gets a dev from clone → preview → deploy in <15 min.
  **Estimate:** 0.5d

### Issue 3.5 — Data contract check (script)

**Title:** Validate CSV headers per component contract
**Desc:** Node script checks required columns exist; run in CI.
**AC:**

- CI fails if any component’s CSV is missing required headers.
  **Estimate:** 0.25d

---

## Phase 4 — Post-MVP Enhancements (Milestone: `P4-Enhancements`)

_(Backlog—optional for later)_

- **Issue 4.1:** Scrollytelling landing page (`/intro`) with sticky scenes.
- **Issue 4.2:** Chapter right-side anchor TOC.
- **Issue 4.3:** Dark mode via CSS vars.
- **Issue 4.4:** Analytics (widget-used, code-copied events).
- **Issue 4.5:** More datasets (fintech/ads variants).

**AC (generic):** Feature visible on preview, passes A11y, no regressions.

---

# GitHub Project Board Setup

**Columns:** `Backlog` → `In Progress` → `Review` → `Done`
**Automation:**

- New issues default to **Backlog**.
- Open PR references an issue (`Fixes #123`) to auto-close on merge.
- CI required to pass before merging to `main`.

---

# Testing Playbook (per PR)

1. Open Vercel preview → visit `/chapters/chapter-X`.
2. Scroll until plots mount (watch for console errors).
3. Interact with sliders/toggles (if present).
4. Resize to ~1024px (tablet) — check sidebar toggle & chart stacking.
5. Run Lighthouse (Chrome) → verify ≥80.
6. Verify CSV requests return 200 & cache headers present (Phase 3+).

---

# Timeline (suggested)

- **Week 1:** Phase 0–1 (setup, shell, deploy).
- **Week 2–3:** Phase 2 (chapters 1–6).
- **Week 4:** Phase 3 (QA/A11y/docs) → Production release.

---

## Copy-Paste Issue Template (use as GitHub Issue form)

**Title:** `[Phase X] <Feature/Chapter>: <Short summary>`
**Labels:** `phase:X`, `type:feature|infra|qa|docs`, `priority:P1|P2`
**Estimate:** `0.25d / 0.5d / 1d / 1.5d`

**Description**

- What: …
- Why: …
- Files/Modules: …

**Tasks**

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

**Acceptance Criteria (DoD)**

- [ ] Behavior/Visual …
- [ ] No console errors / SSR hydration OK
- [ ] A11y: …
- [ ] Tests/CI: …

---
