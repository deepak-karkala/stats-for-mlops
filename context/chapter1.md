# Chapter 1 — The City That Learned Too Fast (Implementation Pack)

## 0) Route & file layout

```
/app
  /chapters
    /chapter-1
      page.tsx              # Next.js route (RSC) for /chapters/chapter-1
      content.mdx           # The MDX below (paste as-is)
      fixtures/
        rides_baseline.csv  # generated via the Python code below
        rides_today.csv     # generated via the Python code below
      plots/
        baselineSpec.ts     # exports Plotly traces/layout for histograms
        psiGaugeSpec.ts     # exports Plotly spec for PSI gauge
        mapHexSpec.ts       # (optional) placeholder for Chapter 1 teaser
```

**Imports expected in `content.mdx`** (all provided by your component library from Document 3):

```tsx
import { Callout, KPI, InlineCode, Aside, Figure } from "@/components/content";
import { HistogramPanel } from "@/components/plots/HistogramPanel";
import { DriftGauge } from "@/components/plots/DriftGauge";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { DataTable } from "@/components/data/DataTable";
import { CodeTabs } from "@/components/code/CodeTabs";
import BaselineSpec from "./plots/baselineSpec";
import PsiGaugeSpec from "./plots/psiGaugeSpec";
```

---

## 1) Chapter MDX (paste into `content.mdx`)

```mdx
# The City That Learned Too Fast

<Aside tone="calm">
  Every movement in DriftCity is orchestrated by algorithms. They learn, predict, and adjust—until
  tiny statistical tremors hint that the city is changing.
</Aside>

<Callout title="What you’ll learn">
  - How to establish **baseline distributions** for an ML system’s inputs and predictions. - How to
  create a **reference window** and use it for drift detection. - Which **tests and distances** to
  use (KS, PSI), and why.
</Callout>

## 1. Baseline first: define normal

Monitoring and observability start with a clear definition of “normal.” In production ML, that means:

- a **reference window** of data (e.g., last 14 days before launch)
- **feature profiles** (summary stats + histograms)
- an initial **prediction score profile** (if available)

This is the _known state_ we compare against later windows. Monitoring answers _that_ something changed; observability helps us ask _why_【:contentReference[oaicite:0]{index=0}】.

### 1.1 Example schema (rides table)

We’ll use a simple ride-sharing schema throughout the guide:

<DataTable
  caption="rides_baseline schema"
  columns={[
    { key: "column", label: "column" },
    { key: "type", label: "type" },
    { key: "notes", label: "notes" },
  ]}
  rows={[
    { column: "ride_id", type: "string", notes: "unique id" },
    { column: "timestamp", type: "datetime", notes: "event time (UTC)" },
    { column: "pickup_zone", type: "string", notes: "city grid cell id" },
    { column: "dropoff_zone", type: "string", notes: "city grid cell id" },
    { column: "trip_distance_km", type: "float", notes: "continuous" },
    { column: "surge_multiplier", type: "float", notes: "continuous (>=1)" },
    { column: "fare_amount", type: "float", notes: "continuous" },
    { column: "driver_eta_min", type: "float", notes: "model output (optional in Ch1)" },
  ]}
/>

<Aside>
  In later chapters, we’ll add labels/actuals and more outputs. For Chapter 1, the focus is
  **P(X)**: input distributions.
</Aside>

## 2. Visualizing the baseline

Below are baseline histograms and descriptive stats. These serve as your reference profiles for **P(X)** features—trip distance, surge multiplier, and fare.

<ToggleGroup
  label="Select feature"
  options={[
    { label: "trip_distance_km", value: "trip_distance_km" },
    { label: "surge_multiplier", value: "surge_multiplier" },
    { label: "fare_amount", value: "fare_amount" },
  ]}
/>

<HistogramPanel
  id="baseline-histos"
  dataUrl="/chapters/chapter-1/fixtures/rides_baseline.csv"
  traceSpec={BaselineSpec}
  height={360}
/>

**Why histograms?**  
Two-sample tests (e.g., KS for continuous features; Chi-squared for categorical) tell you if today’s window likely came from the same distribution as the baseline window【:contentReference[oaicite:1]{index=1}】. But pictures (plus summary stats) help engineers reason quickly about _where_ the change is (center, spread, tails)【:contentReference[oaicite:2]{index=2}】.

## 3. Today vs. Baseline: measuring shift

When labels lag, compare inputs **P(X)** and model outputs **P(ŷ)** over time. That’s standard in industry monitoring stacks【:contentReference[oaicite:3]{index=3}】.

We’ll use:

- **KS test** (continuous): simple, non-parametric, compares empirical CDFs【:contentReference[oaicite:4]{index=4}】
- **PSI** (binned, symmetric): widely used for production drift dashboards; easy thresholds for alerting【:contentReference[oaicite:5]{index=5}】

<DriftGauge
  id="psi-gauge"
  referenceUrl="/chapters/chapter-1/fixtures/rides_baseline.csv"
  currentUrl="/chapters/chapter-1/fixtures/rides_today.csv"
  feature="trip_distance_km"
  spec={PsiGaugeSpec}
  thresholds={{ warn: 0.1, alert: 0.25 }}
/>

<Figure caption="PSI thresholds (rule-of-thumb)">
- **< 0.10**: stable  
- **0.10–0.25**: moderate shift (watch)  
- **≥ 0.25**: major shift (investigate, retrain or fix)  
</Figure>

<Aside tone="info">
  Use KS for statistical testing and PSI for **operational dashboards** with human-friendly
  thresholds. This combo is common because PSI is robust for ongoing monitoring and easy to
  interpret for on-call engineers【:contentReference[oaicite:6]{(index = 6)}】.
</Aside>

## 4. Run it yourself (data + code)

<CodeTabs
  tabs={[
    {
      label: "Python: generate baseline & today",
      language: "python",
      code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(7)

N0, N1 = 20000, 8000 # baseline, today

# Baseline distributions

trip0 = np.clip(rng.normal(6.5, 2.0, N0), 0.5, None)
surge0 = np.clip(rng.lognormal(mean=0.05, sigma=0.15, size=N0), 1.0, None)
fare0 = np.clip(35 + trip0\*3.2 + rng.normal(0, 5, N0), 5, None)

df0 = pd.DataFrame({
"ride*id": [f"b*{i}" for i in range(N0)],
"timestamp": pd.date_range("2025-09-01", periods=N0, freq="min"),
"pickup_zone": rng.choice([f"Z{i:03d}"]\*1 + [f"Z{i:03d}" for i in range(1,40)], size=N0),
"dropoff_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N0),
"trip_distance_km": trip0,
"surge_multiplier": surge0,
"fare_amount": fare0,
})

# Today's window with subtle shift (slightly longer trips, heavier tail)

trip1 = np.clip(rng.normal(7.2, 2.3, N1), 0.5, None)
surge1 = np.clip(rng.lognormal(mean=0.08, sigma=0.18, size=N1), 1.0, None)
fare1 = np.clip(36 + trip1\*3.4 + rng.normal(0, 6, N1), 5, None)

df1 = pd.DataFrame({
"ride*id": [f"t*{i}" for i in range(N1)],
"timestamp": pd.date_range("2025-10-01", periods=N1, freq="min"),
"pickup_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N1),
"dropoff_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N1),
"trip_distance_km": trip1,
"surge_multiplier": surge1,
"fare_amount": fare1,
})

df0.to_csv("rides_baseline.csv", index=False)
df1.to_csv("rides_today.csv", index=False)
print("Wrote rides_baseline.csv and rides_today.csv")
`    },
    {
      label: "Python: KS & PSI utilities",
      language: "python",
      code:`
import numpy as np, pandas as pd
from scipy.stats import ks_2samp

def ks_test(baseline: pd.Series, current: pd.Series):
stat, p = ks_2samp(baseline.dropna(), current.dropna())
return {"ks_stat": float(stat), "p_value": float(p)}

def psi(baseline: pd.Series, current: pd.Series, bins=10): # Fixed bin edges from baseline quantiles (stable over time)
qs = np.quantile(baseline.dropna(), np.linspace(0,1,bins+1))
e = np.histogram(baseline, bins=qs)[0].astype(float)
a = np.histogram(current, bins=qs)[0].astype(float) # Laplace smoothing to avoid zero-bin instability
e, a = e + 1e-6, a + 1e-6
e, a = e/e.sum(), a/a.sum()
return float(np.sum((a - e) _ np.log(a / e)))
`    },
    {
      label: "Node: server action to compute PSI",
      language: "ts",
      code:`
// app/api/psi/route.ts
import { NextResponse } from "next/server";
import _ as d3 from "d3-dsv";
export async function POST(req: Request) {
const { referenceUrl, currentUrl, feature } = await req.json();
const [refCsv, curCsv] = await Promise.all([
fetch(new URL(referenceUrl, req.url)).then(r => r.text()),
fetch(new URL(currentUrl, req.url)).then(r => r.text())
]);
const ref = d3.csvParse(refCsv).map(r => Number(r[feature]));
const cur = d3.csvParse(curCsv).map(r => Number(r[feature]));

// PSI with fixed quantile bins from reference
const bins = 10;
const refSorted = ref.filter(Number.isFinite).sort((a,b)=>a-b);
const cuts = Array.from({length: bins+1}, (\_,i)=>refSorted[Math.floor(i*(refSorted.length-1)/bins)]);
const hist = (arr:number[]) => {
const h = new Array(bins).fill(0);
for (const v of arr) {
if (!Number.isFinite(v)) continue;
let j = cuts.findIndex((c)=>v<c);
if (j === -1) j = bins; // right edge
j = Math.max(1, Math.min(bins, j)) - 1;
h[j] += 1;
}
return h;
};
const e = hist(ref).map(x=>x+1e-6);
const a = hist(cur).map(x=>x+1e-6);
const es = e.map(x=>x/e.reduce((s,y)=>s+y,0));
const as = a.map(x=>x/a.reduce((s,y)=>s+y,0));
const psi = as.reduce((s,ap,i)=> s + (ap-es[i])\*Math.log(ap/es[i]), 0);
return NextResponse.json({ psi });
}
`
}
]}
/>

<Aside tone="note">
  - KS is useful when you need a formal two-sample statistical test【:contentReference[oaicite:7]
  {(index = 7)}】. - PSI is robust and interpretable for **continuous monitoring** dashboards with
  thresholds【:contentReference[oaicite:8]{(index = 8)}】.
</Aside>

## 5. What to alert on in Chapter 1

- **PSI ≥ 0.25** on any high-importance feature → **Alert**
- **0.10 ≤ PSI < 0.25** → **Warn**, annotate and watch next window
- **KS p-value < 0.01** for major features → annotate **Drift suspected**

Why this mix? Labels can be delayed; monitoring **P(X)** and **P(ŷ)** is crucial in those situations【:contentReference[oaicite:9]{index=9}】. Summary stats + tests help quickly narrow the _where_ and _how_ of change【:contentReference[oaicite:10]{index=10}】.

## 6. Where this connects (foreshadow)

This chapter ends with a subtle alert (PSI rising) that will carry into **Chapter 2: Covariate Shift**. We’ll add spatial hexbins and a control-room view of evolving frequencies across zones, then step into concept drift later. Observability widens from “that it changed” to “why it changed”【:contentReference[oaicite:11]{index=11}】.
```

---

## 2) Plotly specs (TypeScript)

Create `plots/baselineSpec.ts`:

```ts
// plots/baselineSpec.ts
import type { PlotParams } from "@/types/plots";

// Produces a single histogram for the selected feature.
// The HistogramPanel will provide the feature's array.
const BaselineSpec: PlotParams = (values: number[], feature: string) => {
  return {
    data: [
      {
        type: "histogram",
        x: values,
        nbinsx: 40,
        hovertemplate: `${feature}: %{x:.2f}<br>count: %{y}<extra></extra>`,
      },
    ],
    layout: {
      height: 360,
      bargap: 0.05,
      margin: { t: 10, r: 10, b: 40, l: 50 },
      xaxis: { title: feature },
      yaxis: { title: "count" },
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default BaselineSpec;
```

Create `plots/psiGaugeSpec.ts`:

```ts
// plots/psiGaugeSpec.ts
import type { PlotParamsGauge } from "@/types/plots";

const PsiGaugeSpec: PlotParamsGauge = (psi: number, thresholds) => {
  const { warn, alert } = thresholds;
  // Map PSI to 0..1 needle arc
  const level = Math.min(psi, 0.5);
  return {
    data: [
      {
        type: "indicator",
        mode: "gauge+number",
        value: psi,
        number: { valueformat: ".3f" },
        gauge: {
          axis: { range: [0, 0.5] },
          bar: { color: "#00D8FF" },
          steps: [
            { range: [0, warn], color: "#0B0E17" },
            { range: [warn, alert], color: "#FFB34733" },
            { range: [alert, 0.5], color: "#FFB34766" },
          ],
          threshold: {
            line: { color: "#FFB347", width: 3 },
            thickness: 0.75,
            value: alert,
          },
        },
        domain: { x: [0, 1], y: [0, 1] },
      },
    ],
    layout: {
      height: 220,
      margin: { t: 0, r: 10, b: 0, l: 10 },
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default PsiGaugeSpec;
```

---

## 3) Component contracts (props & behavior)

**`<HistogramPanel />`**

```ts
type HistogramPanelProps = {
  id: string;
  dataUrl: string; // CSV with at least the selected feature column
  traceSpec: (values: number[], feature: string) => Plotly.Spec;
  height?: number;
  // Reads feature selection from a global store or context set by <ToggleGroup/>
};
```

- **Data flow:** fetch CSV (stream/edge OK), parse, memoize per feature, render Plotly with `traceSpec`.
- **Accessibility:** provide `aria-label` and keyboard focus for toggle + histogram bars (Plotly default tooltips OK).

**`<DriftGauge />`**

```ts
type DriftGaugeProps = {
  id: string;
  referenceUrl: string;
  currentUrl: string;
  feature: string;
  thresholds: { warn: number; alert: number };
  spec: (psi: number, thresholds: DriftGaugeProps["thresholds"]) => Plotly.Spec;
};
```

- **Data flow:** POST to `/api/psi` (server action above), get `{ psi }`, render gauge. Recompute when `feature` changes.
- **States:** loading, ok, warn, alert; color ring around the gauge based on thresholds.

---

## 4) Acceptance checks (QA list)

1. Baseline histograms render for all three features with 40 bins and responsive layout.
2. PSI gauge computes from server endpoint within 250 ms locally on sample CSVs.
3. **Threshold coloring:**
   - PSI < 0.10 → neutral ring
   - 0.10–0.25 → amber ring
   - ≥ 0.25 → amber ring + “Investigate” badge

4. KS/PSI code produces stable results when reloading (bins fixed by reference quantiles).
5. All plots degrade gracefully on mobile (stacked, 100% width).
6. No blocking data fetches on main thread; histograms stream after initial content.

---

## 5) Content notes (copywriting & pedagogy)

- Keep the tone calm/curious; Chapter 1 is equilibrium + first tremors.
- End with a **gentle warning** (PSI ~0.12–0.18) to motivate Chapter 2.
- One sentence call-forward: “Inputs changed before the labels could.” (bridges to covariate drift)【】.

---

## 6) Why these stats (for reviewers)

- **Monitoring vs. Observability** framing opens Chapter 1 and justifies “baseline first”【】.
- **KS** chosen as the simplest, widely understood two-sample test for continuous features【】.
- **PSI** chosen for operational dashboards with interpretable thresholds and stable binning against a fixed baseline【】.
- This aligns with standard ML observability practices when labels are delayed【】.

---

## 7) Optional: add a tiny “spatial teaser” (hexbin)

If you want a teaser (no deep map yet), add a static “hexbin frequency delta” image and caption “Where is demand growing?” You’ll formalize it in Chapter 2.

---

This is plug-and-play for your Next.js + MDX stack. Drop in the CSV fixtures, paste the MDX, and include the two Plotly spec files. The chapter renders with (1) baseline histograms, (2) a live PSI gauge, and (3) runnable code for readers.
