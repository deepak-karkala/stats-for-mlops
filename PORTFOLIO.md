# DriftCity: Statistics for MLOps

An interactive, narrative-driven educational platform that teaches production ML statistical concepts through hands-on visualizations, real-world case studies, and runnable code examples.

**Live Demo:** [Coming Soon]
**Source Code:** [GitHub Repository]

---

## The Problem

Machine Learning teams face a critical knowledge gap when it comes to production model operations. Understanding concepts like data drift, A/B testing, and variance reduction is essential for maintaining reliable ML systems, yet these topics are typically:

- **Scattered across dense textbooks and academic papers** — inaccessible to practitioners
- **Taught through static equations** — abstract and hard to internalize
- **Disconnected from real-world implementation** — theory without production context

The result? ML Engineers ship models to production without fully understanding how to detect when they fail, how to run experiments correctly, or how to build monitoring systems that actually work.

---

## The Solution

DriftCity transforms how teams learn MLOps statistics by combining three powerful forces:

1. **Narrative Cohesion** — A fictional "DriftCity" story where algorithms power urban transportation, making abstract concepts tangible through metaphor
2. **Interactive Exploration** — Live Plotly visualizations with sliders, comparisons, and real-time calculations that let learners experiment and discover
3. **Production Reality** — Code patterns and case studies from Uber, Airbnb, Netflix, and DoorDash showing exactly how these concepts work in practice

---

## Statistical Concepts Covered

### Chapter 1: The City That Learned Too Fast
**Baseline Distributions & Drift Detection**

| Concept | Description |
|---------|-------------|
| **Population Stability Index (PSI)** | Quantifies distribution shift between reference and current windows |
| **Kolmogorov-Smirnov Test** | Non-parametric test comparing empirical CDFs |
| **Reference Windows** | Establishing baseline P(X) for feature monitoring |

**Interactive Component:** Histogram panels with feature toggles and animated PSI gauge showing drift severity (stable < 0.10, watch 0.10-0.25, alert ≥ 0.25)

---

### Chapter 2: The Weather Event
**Covariate Drift (P(X) Changes)**

| Concept | Description |
|---------|-------------|
| **Covariate Shift** | Input distributions change while P(Y|X) remains stable |
| **Distribution Overlay Analysis** | Visual comparison of baseline vs. current histograms |
| **Trend Monitoring** | Tracking PSI over time windows to detect sustained shifts |

**Interactive Component:** Side-by-side histogram comparison (blue baseline vs. amber rainstorm) with feature toggle buttons

**Scenario:** A weather event changes rider behavior — fewer short trips, more long-distance rides, increased surge pricing. The input distribution shifts, but the model's learned relationships still hold.

---

### Chapter 3: The Vanishing Commuter
**Concept Drift (P(Y|X) Changes)**

| Concept | Description |
|---------|-------------|
| **Concept Drift** | The relationship between inputs and outputs breaks down |
| **RMSE/MAE Trend Analysis** | Tracking prediction error over time as drift signal |
| **Residual Analysis** | Identifying spatial/temporal patterns in model failures |
| **Scatter Plot Diagnosis** | Comparing predicted vs. actual to detect slope/spread changes |

**Interactive Components:**
- RMSE trend line showing performance degradation
- Predicted vs. actual scatter plot with y=x reference line
- Residual heatmap (zone × hour) revealing systematic failure patterns

**Scenario:** Remote work changes traffic patterns. The ETA model (trained on rush-hour commuters) now systematically under-predicts journey times.

---

### Chapter 4: The Great Experiment
**A/B Testing & Controlled Experiments**

| Concept | Description |
|---------|-------------|
| **Sample Ratio Mismatch (SRM)** | Chi-square test detecting randomization failures |
| **Statistical Power Analysis** | Determining sample sizes to detect meaningful effects |
| **Type I/II Errors** | Understanding false positive and false negative trade-offs |
| **Primary vs. Guardrail Metrics** | Separating main outcomes from protective metrics |

**Interactive Components:**
- A/B distribution overlay (control vs. treatment revenue)
- SRM gauge for allocation validation
- Power curve showing sample size vs. detection probability trade-off

---

### Chapter 5: The CUPED Control Tower
**Variance Reduction & Sequential Testing**

| Concept | Description |
|---------|-------------|
| **CUPED** | Controlled-experiment Using Pre-Experiment Data |
| **Formula** | Y_CUPED = Y - θ(X - X̄) where θ = Cov(X,Y)/Var(X) |
| **Variance Reduction** | Reduction ≈ ρ² (correlation squared) |
| **Sequential Testing** | O'Brien-Fleming boundaries for early stopping |

**Interactive Components:**
- CUPED correlation slider (0 to 0.95) showing real-time variance reduction
- Sequential testing chart with significance boundaries

**Key Insight:** Using pre-period correlated metrics can reduce experiment variance by 30-40%, enabling faster statistical conclusions with fewer samples.

---

### Chapter 6: The City Restored
**Continuous Monitoring & Guardrails**

| Concept | Description |
|---------|-------------|
| **Closed Feedback Loop** | Detect → Diagnose → Retrain → Revalidate → Redeploy |
| **Dual-Metric Correlation** | Tracking PSI against RMSE to quantify drift impact |
| **Automated Guardrails** | Threshold-based triggers for SLA breaches |
| **Auto-Recovery** | Traffic drain and rollback on drift detection |

**Interactive Components:**
- Monitoring dashboard with dual-axis PSI/RMSE time series
- Drift vs. performance scatter plot
- Guardrail timeline showing state transitions (OK → Warning → Rollback → Recovered)

---

## Technical Implementation

### Architecture

```
Next.js 14 (App Router) + TypeScript + MDX + Plotly.js
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | App Router, static generation, TypeScript strict mode |
| **Content** | MDX | Markdown with embedded React components |
| **Visualization** | Plotly.js | Interactive charts with client-only rendering |
| **Styling** | CSS Variables | Design tokens for consistent theming |
| **Deployment** | Vercel | Auto-deploy on main branch push |

### Key Technical Patterns

**Dynamic Plotly Import (SSR Handling)**
```typescript
const Plot = dynamic(async () => {
  const Plotly = await import("plotly.js-dist-min");
  const createPlotlyComponent = (await import("react-plotly.js/factory")).default;
  return createPlotlyComponent(Plotly);
}, { ssr: false });
```

**Lazy Loading with IntersectionObserver**
- Charts defer CSV loading until scrolled into viewport
- Single-use observer disconnects after first intersection
- 120px rootMargin for early triggering

**CSV Data Pipeline**
- D3-DSV for parsing with type coercion
- Parallel fetching for comparison charts
- Laplace smoothing for PSI calculation (prevents log(0))

**Component Architecture**
```
/components/
├── plots/          # 16 Plotly chart components
├── mdx/            # MDX renderer + shortcodes registry
├── layout/         # TwoColumnShell, Sidebar, HeaderBar
├── content/        # Aside, Callout, Figure, KPI
└── ui/             # CodeBlock, Slider, DataTable
```

---

## Teaching Methodology

### Narrative-Driven Learning

Each chapter uses metaphor to make abstract concepts concrete:

| Chapter | Metaphor | Statistical Concept |
|---------|----------|-------------------|
| 1 | City establishing equilibrium | Baseline distributions |
| 2 | Weather event | Covariate drift |
| 3 | Commuter behavior change | Concept drift |
| 4 | Engine competition | A/B testing |
| 5 | Control tower precision | Variance reduction |
| 6 | City recovery | Monitoring & feedback loops |

### Three Evidence Layers

Every concept is taught through multiple lenses:

1. **Mathematical** — Formulas and statistical tests (PSI, KS, CUPED)
2. **Visual** — Interactive charts with threshold indicators
3. **Operational** — Decision rules and production thresholds

### Progressive Complexity

```
Detect Problems → Understand Problems → Test Solutions → Automate Response
   (Ch 1-2)           (Ch 3)              (Ch 4-5)         (Ch 6)
```

---

## Industry Case Studies

The content references real implementations from leading tech companies:

### Uber Michelangelo
- Nightly feature monitoring computing PSI/KS for all continuous features
- Residual analysis flagging zones where error exceeds 2σ
- Auto-drain traffic on drift or SLA breach

### Airbnb Experimentation Platform
- CUPED on booking conversion achieving ~40% sample reduction
- Guardrail blocking for metric regressions
- XP Guards preventing concurrent test interference

### Netflix XP
- Thousands of concurrent A/B tests daily
- Auto-checks for SRM, power, and guardrail violations
- Sequential testing ending ~10% of experiments early

### DoorDash Feature Store
- Streaming feature store with 7-day moving PSI average
- Drift detection combined with volume metrics
- Upstream ETL failure detection via missing-data drift

---

## Key Features

| Metric | Value |
|--------|-------|
| Interactive Components | 16 Plotly visualizations |
| Chapters | 6 comprehensive modules |
| Reading Time | 2-3 minutes per chapter |
| Code Examples | Python + TypeScript per chapter |
| Data Fixtures | 15+ realistic CSV datasets |
| Accessibility | WCAG AA compliant |

---

## Skills Demonstrated

### Statistical Analysis & Data Science
- Population Stability Index (PSI) implementation
- Kolmogorov-Smirnov test application
- CUPED variance reduction methodology
- Sequential testing with O'Brien-Fleming boundaries
- A/B test power analysis and SRM detection

<!--
### Full-Stack Web Development
- Next.js 14 App Router with TypeScript
- Server/Client component architecture
- Dynamic imports for bundle optimization
- Lazy loading with IntersectionObserver
- Responsive design system
-->

### Educational Content Design
- Narrative framing for complex concepts
- Visual-first learning approach
- Progressive complexity structure
- Industry-grounded examples

### UX & Interaction Design
- Interactive parameter exploration (sliders, toggles)
- Real-time calculation feedback
- Intuitive threshold visualization (color-coded gauges)
- Two-column layout for navigation + content

### Technical Writing
- Clear, concise explanations (400-600 words/chapter)
- Code examples with production patterns
- Actionable takeaways and checklists

---

## Project Structure

```
driftcity/
├── app/chapters/chapter-{1..6}/
│   ├── page.tsx              # Route handler
│   ├── content.mdx           # Chapter narrative
│   ├── fixtures/             # CSV datasets
│   └── plots/                # Plotly spec factories
├── components/
│   ├── plots/                # Chart components (16 total)
│   ├── mdx/                  # MDX integration
│   ├── layout/               # Shell, Sidebar, Header
│   └── ui/                   # Reusable UI components
├── styles/
│   └── tokens.css            # Design system variables
└── context/
    └── *.md                  # Documentation
```

---

## Screenshots

*[Add screenshots of key interactive components here]*

- Histogram comparison showing covariate drift
- PSI gauge transitioning from stable to alert
- CUPED demo with correlation slider
- Monitoring dashboard with dual-axis metrics
- Sequential testing boundary chart

---

## What Makes This Project Distinctive

1. **Narrative Cohesion** — Unlike fragmented tutorials, DriftCity weaves statistical concepts into a consistent story where readers understand the "why" behind each metric

2. **Hands-On Interactivity** — Sliders, comparisons, and live simulations let learners explore concepts, not just read about them

3. **Production-Grade Examples** — Code snippets aren't academic—they're patterns used by Uber, Airbnb, and Netflix

4. **Accessibility** — WCAG AA compliance and simple visual metaphors make MLOps accessible to non-statisticians

5. **Extensible Architecture** — Modular MDX + component design allows rapid chapter additions without framework changes

---

## Future Enhancements

- Scrollytelling landing page with sticky scroll scenes
- Dark mode via CSS variable toggle
- Video/audio narration for accessibility
- Community datasets (fintech, ads, healthcare variants)
- Analytics tracking interaction patterns

---

*Built with Next.js, TypeScript, Plotly.js, and MDX. Deployed on Vercel.*
