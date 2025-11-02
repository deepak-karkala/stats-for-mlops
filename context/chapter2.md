# 🚦 Chapter 2 — _The Weather Event_ (Covariate Drift)

---

## 🧭 0) Route & Files

```
/app
  /chapters/chapter-2/
    page.tsx
    content.mdx
    fixtures/
      rides_baseline.csv      # reuse from Chapter 1
      rides_rainstorm.csv     # generated below
    plots/
      covariateSpec.ts        # overlay histograms
      psiTrendSpec.ts         # PSI over time line chart
```

MDX imports expected:

```tsx
import { Aside, Callout, Figure } from "@/components/content";
import { HistogramCompare } from "@/components/plots/HistogramCompare";
import { DriftGauge } from "@/components/plots/DriftGauge";
import { PSITrend } from "@/components/plots/PSITrend";
import { CodeTabs } from "@/components/code/CodeTabs";
import CovariateSpec from "./plots/covariateSpec";
import PsiTrendSpec from "./plots/psiTrendSpec";
```

---

## 🧩 1) `content.mdx`

````mdx
# The Weather Event

<Aside tone="story">
  It started with rain. Just weather—the kind the system had seen before. But this time, DriftCity’s
  predictions got soaked.
</Aside>

<Callout title="What you'll learn">
  - How to detect **covariate drift**—changes in input distributions P(X) - How to compute
  **Population Stability Index (PSI)** and **Kolmogorov–Smirnov (KS)** tests - How to interpret PSI
  thresholds and visual patterns of shift
</Callout>

---

## 1. What is Covariate Drift?

Covariate drift occurs when the **distribution of features P(X)** changes, but the underlying relationship between features and target P(Y | X) remains the same — for now.  
The model’s learned patterns still apply, but its inputs no longer represent the world it trained on.

<Figure
  src="/images/ch2_rainstorm.png"
  caption="Rainstorm changing commuter behavior — an input shift, not yet a concept change."
/>

---

## 2. Compare Baseline vs Rainstorm

<HistogramCompare
  referenceUrl="/chapters/chapter-2/fixtures/rides_baseline.csv"
  currentUrl="/chapters/chapter-2/fixtures/rides_rainstorm.csv"
  feature="trip_distance_km"
  spec={CovariateSpec}
/>

Observe how the **rainstorm** window (amber) shows fewer short rides (< 2 km) and a heavier right-tail of long trips (> 10 km).  
The model trained on dry-weather patterns will now see more extreme inputs.

---

## 3. Quantifying Shift with PSI and KS

<DriftGauge
  id="psi-gauge"
  referenceUrl="/chapters/chapter-2/fixtures/rides_baseline.csv"
  currentUrl="/chapters/chapter-2/fixtures/rides_rainstorm.csv"
  feature="trip_distance_km"
  thresholds={{ warn: 0.1, alert: 0.25 }}
/>

**Interpretation**

- PSI = 0 → identical distribution
- 0 – 0.1 → stable
- 0.1 – 0.25 → moderate drift
- > 0.25 → major shift → investigate or retrain

Use KS for a _formal_ test:

```python
from scipy.stats import ks_2samp
ks_2samp(baseline["trip_distance_km"], rainstorm["trip_distance_km"])
# → statistic≈0.36,  p<0.001  ⇒  reject same distribution
```
````

---

## 4. Monitoring Drift Over Time

Instead of a single comparison, track PSI daily or weekly to reveal trends.

<PSITrend
dataUrl="/chapters/chapter-2/fixtures/psi_over_time.csv"
spec={PsiTrendSpec}
/>

A steady upward slope warns that inputs are diverging — a signal for data engineering or retraining.

---

## 5. Run it Yourself

<CodeTabs
tabs={[
{
label: "Python: generate rainstorm dataset",
language: "python",
code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(9)
df0 = pd.read_csv("rides_baseline.csv")

# simulate rain: fewer short trips, more long ones

N = len(df0)
trip = np.clip(rng.normal(7.8, 2.5, N), 0.3, None)
surge = np.clip(rng.lognormal(mean=0.12, sigma=0.20, size=N), 1.0, None)
fare = np.clip(38 + trip\*3.5 + rng.normal(0, 6, N), 5, None)

df1 = df0.copy()
df1["trip_distance_km"] = trip
df1["surge_multiplier"] = surge
df1["fare_amount"] = fare
df1.to_csv("rides_rainstorm.csv", index=False)
print("Wrote rides_rainstorm.csv")
`    },
    {
      label: "Python: compute PSI for all features",
      language: "python",
      code:`
import pandas as pd, numpy as np
from utils import psi # reuse from Ch1
base = pd.read_csv("rides_baseline.csv")
curr = pd.read_csv("rides_rainstorm.csv")
for col in ["trip_distance_km","surge_multiplier","fare_amount"]:
print(col, psi(base[col], curr[col], bins=10))
`    },
    {
      label: "Node API: /api/psi endpoint (reuse Ch1)",
      language: "ts",
      code:`// identical to Chapter 1 server action`
}
]}
/>

---

## 6. Real-World Practices

| Company               | Implementation                                                                  | Key Idea                                                      |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Uber Michelangelo** | Nightly feature monitoring jobs compute PSI and KS for all continuous features. | Automate drift alerts before training pipelines run【】       |
| **DoorDash**          | Streaming feature store includes drift detectors with 7-day moving PSI average. | Smooth short-term noise; alert only on sustained shifts【】   |
| **Pinterest Ads**     | Combine PSI with volume metrics to catch missing-data drift.                    | Detect upstream ETL failures that change feature sparsity【】 |

---

## 7. Key Takeaways

<Callout tone="success" title="Drift Detection Checklist">
- Establish **reference histograms** per feature.  
- Compute **PSI & KS** between live and baseline windows.  
- Alert if PSI ≥ 0.25 or KS p < 0.01.  
- Track drift **trends** – one spike can be noise; sustained growth = real issue.  
- Covariate drift is often a precursor to concept drift → watch closely.  
</Callout>

---

<Aside tone="next">
Next → **Chapter 3: The Vanishing Commuter** — when the relationship P(Y | X) itself changes, and model errors surge.
</Aside>
```

---

## 🧮 2) Plotly Specs

### `plots/covariateSpec.ts`

```ts
// overlay baseline (blue) and rainstorm (amber)
const CovariateSpec = (ref: number[], cur: number[], feature: string) => ({
  data: [
    {
      type: "histogram",
      x: ref,
      nbinsx: 40,
      name: "Baseline",
      opacity: 0.5,
      marker: { color: "#00D8FF" },
    },
    {
      type: "histogram",
      x: cur,
      nbinsx: 40,
      name: "Rainstorm",
      opacity: 0.5,
      marker: { color: "#FFB347" },
    },
  ],
  layout: {
    barmode: "overlay",
    height: 360,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: feature },
    yaxis: { title: "count" },
    legend: { orientation: "h" },
  },
  config: { displayModeBar: false, responsive: true },
});
export default CovariateSpec;
```

### `plots/psiTrendSpec.ts`

```ts
const PsiTrendSpec = (dates: string[], psi: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: psi,
      line: { color: "#FFB347", width: 3 },
      marker: { size: 6, color: "#FFB347" },
      name: "PSI",
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Date" },
    yaxis: { title: "PSI", range: [0, 0.5] },
    shapes: [
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.1,
        y1: 0.1,
        line: { dash: "dot", color: "#00D8FF" },
      },
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.25,
        y1: 0.25,
        line: { dash: "dot", color: "#FFB347" },
      },
    ],
  },
  config: { displayModeBar: false, responsive: true },
});
export default PsiTrendSpec;
```

---

## 🧠 3) Component Contracts

**`<HistogramCompare />`**

```ts
type HistogramCompareProps = {
  referenceUrl: string;
  currentUrl: string;
  feature: string;
  spec: (ref: number[], cur: number[], feature: string) => Plotly.Spec;
};
```

Fetch both CSVs → render overlay histograms using `spec`.

**`<PSITrend />`**

```ts
type PSITrendProps = {
  dataUrl: string; // CSV columns: date, feature, psi
  spec: (dates: string[], psi: number[]) => Plotly.Spec;
};
```

---

## 🧩 4) QA Checklist

| Check                                   | Expected |
| --------------------------------------- | -------- |
| Overlay histogram renders blue vs amber | ✅       |
| PSI gauge value ≈ 0.27 → amber state    | ✅       |
| KS test p < 0.01                        | ✅       |
| PSI trend chart loads from CSV          | ✅       |
| Layout responsive, no overflow          | ✅       |

---

## 📘 5) Pedagogical Notes

- Emphasize **inputs** (covariates) changing, not labels.
- Use PSI/KS thresholds exactly as in industry (see your `guide_monitor_observe_drift.md`).
- Mention that drift here is environmental, not conceptual — prepares reader for next chapter.
- Keep numeric examples realistic (mean + σ slight shift).

---

## ✅ Developer Deliverables Summary

| File                                 | Purpose                            |
| ------------------------------------ | ---------------------------------- |
| `content.mdx`                        | Complete copy above                |
| `rides_rainstorm.csv`                | Data fixture (generated from code) |
| `covariateSpec.ts`                   | Overlay histogram spec             |
| `psiTrendSpec.ts`                    | PSI trend line spec                |
| `psi_over_time.csv`                  | Synthetic daily PSI values         |
| `DriftGauge` & `PSITrend` components | Reuse from Chapter 1 templates     |

---

This chapter now stands alone as an interactive lesson on **covariate drift**, with live comparison plots, operational PSI/KS implementation, and clear industry alignment.

---
