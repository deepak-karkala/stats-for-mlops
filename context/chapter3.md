# 🚧 Chapter 3 — _The Vanishing Commuter_ (Concept Drift: P(Y | X) Changes)

---

## 🧭 0) Route & Files

```
/app
  /chapters/chapter-3/
    page.tsx
    content.mdx
    fixtures/
      rides_baseline.csv          # from Ch1
      rides_concept_drift.csv     # new drifted data
      eta_model_performance.csv   # rolling metrics
    plots/
      scatterCompareSpec.ts
      rmseTrendSpec.ts
      residualHeatSpec.ts
```

MDX imports expected:

```tsx
import { Aside, Callout, Figure } from "@/components/content";
import { ScatterCompare } from "@/components/plots/ScatterCompare";
import { RMSETrend } from "@/components/plots/RMSETrend";
import { ResidualHeatmap } from "@/components/plots/ResidualHeatmap";
import { CodeTabs } from "@/components/code/CodeTabs";
import ScatterSpec from "./plots/scatterCompareSpec";
import RmseSpec from "./plots/rmseTrendSpec";
import ResidualSpec from "./plots/residualHeatSpec";
```

---

## 🧩 1) `content.mdx`

```mdx
# The Vanishing Commuter

<Aside tone="story">
  The rain stopped, but DriftCity didn’t go back to normal. The streets were dry—but the commuters
  were gone. Same inputs, different outcomes.
</Aside>

<Callout title="What you'll learn">
  - What **concept drift** means (when P(Y | X) changes). - How to detect it using **performance
  degradation** and **residual analysis**. - How to visualize drift with scatter plots and error
  trends.
</Callout>

---

## 1. From Covariate to Concept Drift

Covariate drift changed the inputs.  
Concept drift changes the **relationship** between inputs and outputs — the model’s mapping itself.

In DriftCity, remote work patterns altered travel times.  
Our ETA model, once perfect on rush-hour traffic, now consistently **under-predicts** duration.

<Figure
  src="/images/ch3_empty_highway.png"
  caption="After the storm, commuter behavior changed — the model’s learned relationship broke."
/>

---

## 2. Detecting Concept Drift with Performance Metrics

The simplest signal: the model’s **error trends** start rising even when inputs look similar.  
We track metrics like:

| Metric | Description             | Indicator                    |
| ------ | ----------------------- | ---------------------------- |
| MAE    | Mean Absolute Error     | Average prediction miss size |
| RMSE   | Root Mean Squared Error | Sensitive to large outliers  |
| Bias   | Mean(pred – actual)     | Directional drift            |

<RMSETrend dataUrl="/chapters/chapter-3/fixtures/eta_model_performance.csv" spec={RmseSpec} />

Notice RMSE climbing over time — the model is failing silently.

---

## 3. Predicted vs Actual: Scatter Comparison

Compare baseline (blue) vs drifted (yellow) predictions.

<ScatterCompare
  referenceUrl="/chapters/chapter-3/fixtures/rides_baseline.csv"
  currentUrl="/chapters/chapter-3/fixtures/rides_concept_drift.csv"
  xField="pred_eta_min"
  yField="actual_eta_min"
  spec={ScatterSpec}
/>

**Interpretation :**  
In baseline data, points hug the y = x line (pred ≈ actual).  
After drift, points flatten (slope < 1): model is under-predicting ETAs.

---

## 4. Residual Analysis (Spatial & Temporal)

Residual = (actual – predicted).  
Patterns in residuals show where the model systematically fails.

<ResidualHeatmap
  csv="/chapters/chapter-3/fixtures/residual_heatmap.csv"
  zoneField="city_zone"
  hourField="hour_of_day"
  residualField="residual_min"
  spec={ResidualSpec}
/>

Orange zones = high positive residuals (under-predictions).  
Downtown is glowing — traffic patterns changed since baseline.

---

## 5. Run It Yourself

<CodeTabs
  tabs={[
    {
      label: "Python: generate concept-drift data",
      language: "python",
      code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(11)
base = pd.read_csv("rides_baseline.csv")

# Add model predictions (baseline model)

base["pred_eta_min"] = 5 + 0.9*base["trip_distance_km"] + rng.normal(0,1, len(base))
base["actual_eta_min"] = 5 + 0.9*base["trip_distance_km"] + rng.normal(0,1, len(base))

# Concept drift: new commuting behavior -> slower traffic

curr = base.sample(frac=0.5, random_state=42).copy()
curr["actual_eta_min"] = 6 + 1.2\*curr["trip_distance_km"] + rng.normal(0,1.5,len(curr))

# Model predictions remain from baseline (not retrained)

curr.to_csv("rides_concept_drift.csv", index=False)
print("Wrote rides_concept_drift.csv")
`    },
    {
      label: "Python: rolling RMSE",
      language: "python",
      code:`
import pandas as pd, numpy as np
from sklearn.metrics import mean_squared_error
from math import sqrt

df = pd.read_csv("rides_concept_drift.csv")
df["date"] = pd.date_range("2025-09-01", periods=len(df), freq="min")
df["day"] = df["date"].dt.date

rmse = (df.groupby("day")
.apply(lambda x: sqrt(mean_squared_error(x["actual_eta_min"], x["pred_eta_min"])))
.reset_index(name="rmse"))
rmse["mae"] = df.groupby("day").apply(
lambda x: np.mean(np.abs(x["actual_eta_min"] - x["pred_eta_min"]))
).values
rmse.to_csv("eta_model_performance.csv", index=False)
print("Wrote eta_model_performance.csv")
`    },
    {
      label: "Python: residual matrix",
      language: "python",
      code:`
import pandas as pd, numpy as np
df = pd.read_csv("rides_concept_drift.csv")
df["hour_of_day"] = np.random.randint(0,24,len(df))
df["city_zone"] = np.random.choice([f"Z{i:03d}" for i in range(10)], len(df))
df["residual_min"] = df["actual_eta_min"] - df["pred_eta_min"]
heat = df.groupby(["city_zone","hour_of_day"])["residual_min"].mean().reset_index()
heat.to_csv("residual_heatmap.csv", index=False)
print("Wrote residual_heatmap.csv")
`
}
]}
/>

---

## 6. Industry Case Studies

| Company               | Practice                                                                       | Note                                                                    |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Lyft ETA Service**  | Tracks model error distributions daily using MAE/percentile bands.             | Detect concept drift before SLA breach.                                 |
| **Uber Michelangelo** | Auto-computes residual features and flags zones where error > 2σ for > 3 days. | Combines drift metrics with spatial telemetry to prioritize retraining. |
| **Airbnb Pricing**    | Monitors prediction bias separately for high-demand markets.                   | Bias = mean(pred – actual); systematic sign change → concept shift.     |

---

## 7. Key Takeaways

<Callout tone="success" title="Concept Drift Checklist">
  - Track **model error metrics** (RMSE, MAE, Bias) over time. - Visualize **pred vs actual
  scatter** — slope and spread tell the story. - Use **residual heatmaps** to localize drift
  (spatial or temporal). - Retrain when pattern changes persist > a few windows. - Concept drift =
  relationship change → relearn the world.
</Callout>

---

<Aside tone="next">
  Next → **Chapter 4: The Duel of Engines** — A/B testing two models to decide which handles the new
  world better.
</Aside>
```

---

## 🧮 2) Plotly Specs

### `plots/scatterCompareSpec.ts`

```ts
const ScatterSpec = (ref: { x: number[]; y: number[] }, cur: { x: number[]; y: number[] }) => ({
  data: [
    {
      type: "scatter",
      mode: "markers",
      x: ref.x,
      y: ref.y,
      name: "Baseline",
      marker: { color: "#00D8FF", size: 5, opacity: 0.6 },
    },
    {
      type: "scatter",
      mode: "markers",
      x: cur.x,
      y: cur.y,
      name: "Current",
      marker: { color: "#FFB347", size: 5, opacity: 0.6 },
    },
    { type: "line", x: [0, 40], y: [0, 40], line: { color: "#888", dash: "dot" }, name: "y=x" },
  ],
  layout: {
    height: 360,
    margin: { t: 10, r: 10, b: 50, l: 60 },
    xaxis: { title: "Predicted ETA (min)" },
    yaxis: { title: "Actual ETA (min)" },
    legend: { orientation: "h" },
  },
  config: { displayModeBar: false, responsive: true },
});
export default ScatterSpec;
```

### `plots/rmseTrendSpec.ts`

```ts
const RmseSpec = (dates: string[], rmse: number[], mae: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: rmse,
      line: { color: "#FFB347", width: 3 },
      name: "RMSE",
    },
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: mae,
      line: { color: "#00D8FF", width: 2 },
      name: "MAE",
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Date" },
    yaxis: { title: "Error (min)", range: [0, 10] },
  },
  config: { displayModeBar: false, responsive: true },
});
export default RmseSpec;
```

### `plots/residualHeatSpec.ts`

```ts
const ResidualSpec = (zones: string[], hours: number[], matrix: number[][]) => ({
  data: [
    {
      z: matrix,
      x: hours,
      y: zones,
      type: "heatmap",
      colorscale: "YlOrRd",
      reversescale: false,
      colorbar: { title: "Residual (min)" },
    },
  ],
  layout: {
    height: 400,
    margin: { t: 20, r: 20, b: 40, l: 80 },
    xaxis: { title: "Hour of Day" },
    yaxis: { title: "City Zone" },
  },
  config: { displayModeBar: false, responsive: true },
});
export default ResidualSpec;
```

---

## 🧠 3) Component Contracts

**`<ScatterCompare />`**

```ts
type ScatterCompareProps = {
  referenceUrl: string;
  currentUrl: string;
  xField: string;
  yField: string;
  spec: (ref: { x: number[]; y: number[] }, cur: { x: number[]; y: number[] }) => Plotly.Spec;
};
```

**`<RMSETrend />`**

```ts
type RMSETrendProps = {
  dataUrl: string; // CSV columns: date, rmse, mae
  spec: (dates: string[], rmse: number[], mae: number[]) => Plotly.Spec;
};
```

**`<ResidualHeatmap />`**

```ts
type ResidualHeatmapProps = {
  csv: string;
  zoneField: string;
  hourField: string;
  residualField: string;
  spec: (zones: string[], hours: number[], matrix: number[][]) => Plotly.Spec;
};
```

---

## ✅ 4) QA Checklist

| Check                                                  | Expected |
| ------------------------------------------------------ | -------- |
| RMSETrend loads with two lines (RMSE amber, MAE blue)  | ✅       |
| ScatterCompare shows baseline ≈ y=x, current flattened | ✅       |
| ResidualHeatmap highlights zones with positive errors  | ✅       |
| CSV fixtures load client-side without SSR errors       | ✅       |
| Responsive layout on tablet                            | ✅       |

---

## 🧾 5) Pedagogical Notes

- Contrast with Chapter 2: inputs stable, outputs shift.
- Explain residuals = model’s “blind spots.”
- Mention concept drift is inevitable in temporal systems (user behavior, economy, seasonality).
- Reinforce monitoring **P(Y|X)** via errors and bias.

---

## 🧱 6) Developer Deliverables

| File                        | Purpose                        |
| --------------------------- | ------------------------------ |
| `content.mdx`               | Full copy above                |
| `rides_concept_drift.csv`   | Drifted dataset                |
| `eta_model_performance.csv` | Rolling RMSE/MAE               |
| `residual_heatmap.csv`      | Spatial/temporal residual data |
| `scatterCompareSpec.ts`     | Plotly scatter spec            |
| `rmseTrendSpec.ts`          | Plotly trend spec              |
| `residualHeatSpec.ts`       | Heatmap spec                   |
| Components                  | Reuse from existing library    |

---

## ✅ 7) Summary

**Concept Focus:** P(Y | X) change
**Widgets:** ScatterCompare + RMSETrend + ResidualHeatmap
**Code:** Generate drifted ETA data + compute metrics
**Industry Alignment:** Michelangelo / Lyft ETA / Airbnb Pricing
**Outcome:** Readers learn to detect and localize concept drift via errors and residuals.

---
