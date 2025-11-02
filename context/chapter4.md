# ⚙️ Chapter 4 — _The Duel of Engines_

_(A/B Testing: Champion vs. Challenger Models)_

We now move into **Chapter 4: “The Duel of Engines”**, where the DriftCity narrative transitions into experimentation and controlled testing.

This chapter’s implementation focuses on **A/B testing concepts** — including randomization, SRM (Sample Ratio Mismatch), power analysis, and test interpretation — all supported by live interactive charts and real datasets.

Below is the **complete, implementation-ready content pack** for **Chapter 4**, ready for direct integration into your Next.js + MDX MVP.

---

## 🧭 0) Route & Files

```
/app
  /chapters/chapter-4/
    page.tsx
    content.mdx
    fixtures/
      ab_test_results.csv          # synthetic sample-level A/B data
      srm_check.csv                # control vs treatment counts
      power_curve.csv              # precomputed power/sample data
    plots/
      abDistributionSpec.ts        # outcome histograms (control vs treatment)
      srmGaugeSpec.ts              # SRM p-value gauge
      powerCurveSpec.ts            # power curve plot
```

**MDX imports expected:**

```tsx
import { Aside, Callout, Figure } from "@/components/content";
import { ABDistribution } from "@/components/plots/ABDistribution";
import { SRMGauge } from "@/components/plots/SRMGauge";
import { PowerCurve } from "@/components/plots/PowerCurve";
import { CodeTabs } from "@/components/code/CodeTabs";
import ABDistSpec from "./plots/abDistributionSpec";
import SRMSpec from "./plots/srmGaugeSpec";
import PowerSpec from "./plots/powerCurveSpec";
```

---

## 🧩 1) `content.mdx`

```mdx
# The Duel of Engines

<Aside tone="story">
  When DriftCity’s ETA model started faltering, engineers built a new engine — *Beta* — to challenge
  the reigning *Alpha*. But in data science, duels aren’t fought with guesses; they’re decided by
  experiments.
</Aside>

<Callout title="What you'll learn">
  - How to design an **A/B test** comparing two ML models - How to detect **Sample Ratio Mismatch
  (SRM)** errors - How to estimate required **sample size and power** for a test - How to interpret
  statistical significance correctly
</Callout>

---

## 1. A/B Testing in MLOps

In production, A/B testing compares a **Champion model (A)** against a **Challenger (B)** by exposing real traffic to both variants.  
The goal: find measurable improvement in KPIs — accuracy, latency, conversion rate — while protecting other guardrails.

| Term          | Meaning                                                |
| ------------- | ------------------------------------------------------ |
| Control (A)   | Existing production model                              |
| Treatment (B) | New model candidate                                    |
| Split         | 50/50 (or configured) random allocation                |
| Metric        | Primary outcome (e.g., ETA error)                      |
| Guardrail     | Secondary metric not to worsen (e.g., driver earnings) |

<Figure
  src="/images/ch4_duel_intro.png"
  caption="Two models in live comparison — Champion vs Challenger."
/>

---

## 2. Visualizing Test Results

<ABDistribution dataUrl="/chapters/chapter-4/fixtures/ab_test_results.csv" spec={ABDistSpec} />

**Interpretation:**  
The Challenger’s distribution (amber) is slightly shifted left (lower error).  
The mean difference corresponds to a 7% improvement in ETA accuracy.

---

## 3. Checking for Sample Ratio Mismatch (SRM)

Before trusting any result, confirm randomization worked.  
SRM occurs when traffic allocation deviates significantly from the intended ratio (often due to assignment bugs).

<SRMGauge dataUrl="/chapters/chapter-4/fixtures/srm_check.csv" spec={SRMSpec} />

**Rule of thumb:**

- **p > 0.05:** OK, no mismatch.
- **p ≤ 0.05:** SRM suspected → invalidate test.

---

## 4. Power and Sample Size

Now that assignment is valid, we need to verify that the experiment had **enough data** to detect a meaningful effect.

<PowerCurve dataUrl="/chapters/chapter-4/fixtures/power_curve.csv" spec={PowerSpec} />

**Interpretation:**

- Power increases with sample size and expected effect.
- Target ≥ 0.8 (80%) for reliable decision-making.

---

## 5. Run It Yourself

<CodeTabs
  tabs={[
    {
      label: "Python: simulate A/B data",
      language: "python",
      code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(12)
N = 10000
variant = rng.choice(["A","B"], size=N, p=[0.5,0.5])
# ETA error (lower is better)
error_A = np.clip(rng.normal(2.4, 0.7, sum(variant=="A")), 0, None)
error_B = np.clip(rng.normal(2.2, 0.7, sum(variant=="B")), 0, None)
df = pd.DataFrame({
  "variant": variant,
  "eta_error_min": np.concatenate([error_A,error_B])
})
df.to_csv("ab_test_results.csv", index=False)
print("Wrote ab_test_results.csv")
`
    },
    {
      label: "Python: SRM check (Chi-square)",
      language: "python",
      code: `
import pandas as pd, scipy.stats as st
df = pd.read_csv("ab_test_results.csv")
counts = df["variant"].value_counts()
chi2, p = st.chisquare(f_obs=counts, f_exp=[len(df)/2]*2)
print("SRM p-value:", p)
pd.DataFrame({"variant":counts.index, "count":counts.values}).to_csv("srm_check.csv", index=False)
`
    },
    {
      label: "Python: Power analysis",
      language: "python",
      code: `
import numpy as np, pandas as pd
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()
alpha = 0.05
effect_sizes = np.linspace(0.1, 0.8, 8)
sample_sizes = np.arange(500, 20001, 500)
records = []
for es in effect_sizes:
for n in sample_sizes:
pwr = analysis.solve_power(effect_size=es, nobs1=n, alpha=alpha)
records.append((es,n,pwr))
pd.DataFrame(records, columns=["effect","n","power"]).to_csv("power_curve.csv", index=False)
`
}
]}
/>

---

## 6. Interpreting the Duel

| Check          | Result                            | Action                    |
| -------------- | --------------------------------- | ------------------------- |
| SRM            | p = 0.42 → ✅                     | Valid randomization       |
| Primary Metric | Challenger RMSE ↓ 7%              | Candidate performs better |
| Guardrails     | Neutral impact on driver earnings | No harm detected          |
| Power          | 0.84 → ✅                         | Test sufficiently powered |

**Decision:** Promote Challenger → Beta becomes the new production model.

---

## 7. Real-World Examples

| Company     | Experimentation System                                   | Highlight                                                      |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| **Airbnb**  | Experimentation Platform + CUPED variance reduction      | Uses pre-experiment covariates to reduce variance (Chapter 5). |
| **Netflix** | XP platform runs thousands of concurrent A/B tests daily | Automates SRM, power, and guardrail checks in UI.              |
| **Uber**    | Michelangelo ML experiments                              | Auto-tracks primary/secondary metrics with SRM alerts.         |

---

## 8. Key Takeaways

<Callout tone="success" title="A/B Testing Checklist">
  - Ensure **randomization validity** (no SRM). - Track both **primary** and **guardrail** metrics.
  - Use **power analysis** to determine sample needs. - Don’t overinterpret low p-values — ensure
  effect is meaningful. - Keep test duration long enough to smooth seasonality.
</Callout>

---

<Aside tone="next">
  Next → **Chapter 5: The CUPED Control Tower** — learn how to make experiments faster and more
  precise using variance reduction and sequential testing.
</Aside>
```

---

## 🧮 2) Plotly Specs

### `plots/abDistributionSpec.ts`

```ts
const ABDistSpec = (dataA: number[], dataB: number[]) => ({
  data: [
    {
      type: "histogram",
      x: dataA,
      nbinsx: 40,
      name: "Control (A)",
      marker: { color: "#00D8FF" },
      opacity: 0.5,
    },
    {
      type: "histogram",
      x: dataB,
      nbinsx: 40,
      name: "Treatment (B)",
      marker: { color: "#FFB347" },
      opacity: 0.5,
    },
  ],
  layout: {
    barmode: "overlay",
    height: 360,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "ETA Error (min)" },
    yaxis: { title: "Count" },
    legend: { orientation: "h" },
  },
  config: { displayModeBar: false, responsive: true },
});
export default ABDistSpec;
```

---

### `plots/srmGaugeSpec.ts`

```ts
const SRMSpec = (pValue: number) => ({
  data: [
    {
      type: "indicator",
      mode: "gauge+number",
      value: pValue,
      number: { valueformat: ".3f" },
      gauge: {
        axis: { range: [0, 1] },
        bar: { color: "#00D8FF" },
        steps: [
          { range: [0, 0.05], color: "#FFB34755" },
          { range: [0.05, 1], color: "#00D8FF33" },
        ],
        threshold: {
          line: { color: "#FFB347", width: 3 },
          value: 0.05,
        },
      },
    },
  ],
  layout: { height: 220, margin: { t: 0, b: 0, l: 10, r: 10 } },
  config: { displayModeBar: false, responsive: true },
});
export default SRMSpec;
```

---

### `plots/powerCurveSpec.ts`

```ts
const PowerSpec = (data: { effect: number[]; n: number[]; power: number[] }) => ({
  data: [
    {
      type: "scatter",
      mode: "lines",
      x: data.n,
      y: data.power,
      line: { color: "#FFB347", width: 3 },
      name: "Power Curve",
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Sample Size (per variant)" },
    yaxis: { title: "Power", range: [0, 1] },
    shapes: [
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.8,
        y1: 0.8,
        line: { dash: "dot", color: "#00D8FF" },
      },
    ],
  },
  config: { displayModeBar: false, responsive: true },
});
export default PowerSpec;
```

---

## 🧠 3) Component Contracts

**`<ABDistribution />`**

```ts
type ABDistributionProps = {
  dataUrl: string; // CSV with columns: variant, eta_error_min
  spec: (dataA: number[], dataB: number[]) => Plotly.Spec;
};
```

**`<SRMGauge />`**

```ts
type SRMGaugeProps = {
  dataUrl: string; // CSV with variant,count
  spec: (pValue: number) => Plotly.Spec;
};
```

**`<PowerCurve />`**

```ts
type PowerCurveProps = {
  dataUrl: string; // CSV: effect, n, power
  spec: (data: { effect: number[]; n: number[]; power: number[] }) => Plotly.Spec;
};
```

---

## ✅ 4) QA Checklist

| Check                                      | Expected |
| ------------------------------------------ | -------- |
| Histogram overlay loads, B shifted left    | ✅       |
| SRM gauge shows p > 0.05 (blue zone)       | ✅       |
| Power curve crosses 0.8 line around n≈8000 | ✅       |
| CSV fixtures load correctly client-side    | ✅       |
| Mobile responsive (stacked layout)         | ✅       |

---

## 📘 5) Pedagogical Notes

- Reinforce experimental discipline: check SRM first, then metrics.
- Introduce statistical power in simple terms (probability of detecting true effect).
- Show how to connect to real-time A/B testing dashboards in MLOps systems (Michelangelo, XP).
- Emphasize: not just “significant” → _practically_ meaningful.

---

## 🧱 6) Developer Deliverables

| File                    | Purpose                |
| ----------------------- | ---------------------- |
| `content.mdx`           | Chapter content        |
| `ab_test_results.csv`   | Simulated test results |
| `srm_check.csv`         | SRM test counts        |
| `power_curve.csv`       | Power/sample size data |
| `abDistributionSpec.ts` | Histogram spec         |
| `srmGaugeSpec.ts`       | SRM gauge spec         |
| `powerCurveSpec.ts`     | Power curve spec       |

---

## ✅ 7) Summary

**Concept Focus:** A/B Testing, SRM, Power Analysis
**Widgets:** ABDistribution, SRMGauge, PowerCurve
**Code:** Generate A/B data, SRM chi-square, power calculations
**Industry Examples:** Uber, Netflix, Airbnb experimentation platforms
**Outcome:** Reader can design and validate an ML A/B test and understand experiment reliability.

---
