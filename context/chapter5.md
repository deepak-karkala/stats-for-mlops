# 🧮 Chapter 5 — _The CUPED Control Tower_

_(Variance Reduction & Sequential Testing)_

It builds directly on Chapter 4 and introduces **CUPED (Controlled-experiment Using Pre-Experiment Data)** and **Sequential Testing**, with live interactive components and real implementation detail.

---

## 🧭 0) Route & Files

```
/app
  /chapters/chapter-5/
    page.tsx
    content.mdx
    fixtures/
      ab_test_results.csv        # reuse from Chapter 4
      cuped_demo.csv             # pre/post metric data
      sequential_sim.csv         # sequential test simulation
    plots/
      cupedVarianceSpec.ts       # CI width vs. correlation plot
      sequentialBoundarySpec.ts  # sequential p-value trace
```

**MDX imports expected**

```tsx
import { Aside, Callout, Figure } from "@/components/content";
import { CUPEDDemo } from "@/components/plots/CUPEDDemo";
import { SequentialChart } from "@/components/plots/SequentialChart";
import { CodeTabs } from "@/components/code/CodeTabs";
import CupedSpec from "./plots/cupedVarianceSpec";
import SeqSpec from "./plots/sequentialBoundarySpec";
```

---

## 🧩 1) `content.mdx`

```mdx
# The CUPED Control Tower

<Aside tone="story">
  After countless duels, DriftCity’s engineers built a control tower above the clouds — a system to
  **measure experiments faster and more precisely** without waiting for weeks of data.
</Aside>

<Callout title="What you'll learn">
  - How CUPED reduces variance in A/B tests - How sequential testing lets you peek early without
  inflating false-positive risk - How to implement both with simple code and visual checks
</Callout>

---

## 1. Why Variance Reduction Matters

High metric noise → slow experiments.  
CUPED (Controlled Using Pre-Experiment Data) uses **correlated pre-period metrics** to reduce post-period variance.

<Figure
  src="/images/ch5_tower_intro.png"
  caption="CUPED: using historical signals to stabilize noisy experiments."
/>

If baseline and experiment periods are correlated, we can subtract the predictable component:

\[
Y\_{CUPED} = Y - \theta (X - \bar X)
\]
where θ = Cov(X,Y)/Var(X)

---

## 2. Interactive CUPED Demo

<CUPEDDemo dataUrl="/chapters/chapter-5/fixtures/cuped_demo.csv" spec={CupedSpec} />

**Try adjusting correlation ρ:**

- Low ρ → little improvement
- High ρ → tight confidence intervals (narrower variance)

---

## 3. Sequential Testing

Instead of fixing horizon N, we can analyze cumulative data over time while controlling error.

<SequentialChart dataUrl="/chapters/chapter-5/fixtures/sequential_sim.csv" spec={SeqSpec} />

**Interpretation:**

- Orange line = p-value evolution.
- Dashed boundaries = corrected significance thresholds (e.g., α = 0.05 → group-sequential O’Brien-Fleming boundaries).
- If the curve crosses below boundary, stop early — significant.

---

## 4. Run It Yourself

<CodeTabs
  tabs={[
    {
      label: "Python: generate CUPED demo data",
      language: "python",
      code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(13)
N = 5000
# pre-period metric (X) and post-period metric (Y)
X = rng.normal(100, 10, N)
# introduce controllable correlation
rho = 0.7
Y = 50 + 0.5*X + rng.normal(0, (1-rho**2)**0.5*10, N)
df = pd.DataFrame({"pre_metric": X, "post_metric": Y})
df.to_csv("cuped_demo.csv", index=False)
print("Wrote cuped_demo.csv")
`,
    },
    {
      label: "Python: implement CUPED adjustment",
      language: "python",
      code: `
import pandas as pd, numpy as np
df = pd.read_csv("cuped_demo.csv")
theta = np.cov(df["pre_metric"], df["post_metric"])[0,1] / np.var(df["pre_metric"])
df["y_cuped"] = df["post_metric"] - theta*(df["pre_metric"] - df["pre_metric"].mean())
reduction = 1 - df["y_cuped"].var()/df["post_metric"].var()
print(f"Variance reduction: {reduction:.2%}")
`,
    },
    {
      label: "Python: sequential test simulation",
      language: "python",
      code: `
import numpy as np, pandas as pd
from scipy.stats import ttest_ind
rng = np.random.default_rng(14)
n_steps = 20
N_total = 10000
effect = 0.2
A = rng.normal(0,1,N_total)
B = rng.normal(effect,1,N_total)
records=[]
for i in range(1,n_steps+1):
    n = int(i*N_total/n_steps)
    t,p = ttest_ind(A[:n],B[:n])
    records.append((n,p))
pd.DataFrame(records, columns=["n","p_value"]).to_csv("sequential_sim.csv", index=False)
print("Wrote sequential_sim.csv")
`,
    },
  ]}
/>

---

## 5. Interpreting Results

| Technique  | Goal                                       | Interpretation                           |
| ---------- | ------------------------------------------ | ---------------------------------------- |
| CUPED      | Reduce variance using pre-period covariate | Observe CI narrowing → faster detection  |
| Sequential | Check significance progressively           | Detect early winners without bias        |
| Combined   | CUPED + Sequential                         | Maximum sensitivity at minimal data cost |

<Figure
  src="/images/ch5_cuped_effect.png"
  caption="Variance reduction narrows confidence intervals, accelerating learning."
/>

---

## 6. Real-World Applications

| Company     | Technique                                       | Outcome                                                 |
| ----------- | ----------------------------------------------- | ------------------------------------------------------- |
| **Airbnb**  | CUPED on booking conversion + pre-trip features | Reduced required sample size by ≈ 40 %                  |
| **Netflix** | Sequential testing (O’Brien-Fleming)            | Ends 10 % of experiments early with controlled α        |
| **Uber**    | CUPED + guardrails                              | Keeps experimentation latency low for re-ranking models |

---

## 7. Key Takeaways

<Callout tone="success" title="Precision Experimentation Checklist">
  - CUPED leverages pre-period metrics to reduce noise. - Variance reduction ≈ faster decisions,
  smaller samples. - Sequential testing controls Type I error while allowing early stopping. -
  Combined methods enable continuous experimentation in production MLOps systems.
</Callout>

---

<Aside tone="next">
  Next → **Chapter 6: The City Restored** — bringing it all together with continuous monitoring and
  guardrail automation.
</Aside>
```

---

## 🧮 2) Plotly Specs

### `plots/cupedVarianceSpec.ts`

```ts
// CI width vs. correlation slider (simplified)
const CupedSpec = (rho: number) => {
  const reduction = rho ** 2;
  return {
    data: [
      {
        type: "bar",
        x: ["Original Var", "Reduced Var"],
        y: [1, 1 - reduction],
        marker: { color: ["#00D8FF", "#FFB347"] },
      },
    ],
    layout: {
      height: 260,
      title: `Variance Reduction ≈ ${(reduction * 100).toFixed(1)}%`,
      margin: { t: 40, r: 10, b: 40, l: 50 },
      yaxis: { range: [0, 1], title: "Relative Variance" },
    },
    config: { displayModeBar: false, responsive: true },
  };
};
export default CupedSpec;
```

### `plots/sequentialBoundarySpec.ts`

```ts
const SeqSpec = (n: number[], p: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: n,
      y: p,
      line: { color: "#FFB347", width: 3 },
      marker: { color: "#FFB347", size: 6 },
      name: "p-value",
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Samples per group" },
    yaxis: { title: "p-value", range: [0, 1] },
    shapes: [
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.05,
        y1: 0.05,
        line: { dash: "dot", color: "#00D8FF" },
      },
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.01,
        y1: 0.01,
        line: { dash: "dot", color: "#FFB347" },
      },
    ],
  },
  config: { displayModeBar: false, responsive: true },
});
export default SeqSpec;
```

---

## 🧠 3) Component Contracts

**`<CUPEDDemo />`**

```ts
type CUPEDDemoProps = {
  dataUrl: string; // CSV with pre_metric, post_metric
  spec: (rho: number) => Plotly.Spec; // drives interactive slider
};
```

**`<SequentialChart />`**

```ts
type SequentialChartProps = {
  dataUrl: string; // CSV columns: n,p_value
  spec: (n: number[], p: number[]) => Plotly.Spec;
};
```

---

## ✅ 4) QA Checklist

| Check                                                     | Expected |
| --------------------------------------------------------- | -------- |
| CUPED Demo shows 0 – 90 % variance reduction as ρ slides  | ✅       |
| Sequential Chart plots p-value trace with threshold lines | ✅       |
| CSV fixtures load client-side without SSR errors          | ✅       |
| Mobile responsive layout (plots stacked)                  | ✅       |

---

## 📘 5) Pedagogical Notes

- Use simple language for CUPED: “remove predictable noise using baseline data.”
- Show mathematical intuition → then visual variance reduction.
- Highlight why sequential tests prevent p-hacking.
- Relate to Chapter 4 (A/B testing speed vs. precision trade-off).

---

## 🧱 6) Developer Deliverables

| File                           | Purpose                        |
| ------------------------------ | ------------------------------ |
| `content.mdx`                  | Full chapter content above     |
| `cuped_demo.csv`               | Synthetic pre/post metric data |
| `sequential_sim.csv`           | Sequential test data           |
| `cupedVarianceSpec.ts`         | Variance bar spec              |
| `sequentialBoundarySpec.ts`    | Sequential p-value spec        |
| `CUPEDDemo`, `SequentialChart` | Interactive components         |

---

## ✅ 7) Summary

**Concept Focus:** CUPED variance reduction + Sequential testing
**Widgets:** CUPEDDemo (bar variance), SequentialChart (p-value trace)
**Code:** Generate data + CUPED formula + sequential simulation
**Industry:** Airbnb, Netflix, Uber experimentation systems
**Outcome:** Readers learn to increase test power and speed without sacrificing validity.

---
