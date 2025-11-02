# 🌆 Chapter 6 — _The City Restored_

_(Continuous Monitoring, Guardrails, and the Observability Loop)_

Here we integrate **drift detection, performance monitoring, experimentation, and guardrails** into a single continuous observability loop.

---

## 🧭 0) Route & Files

```
/app
  /chapters/chapter-6/
    page.tsx
    content.mdx
    fixtures/
      monitoring_dashboard.csv      # simulated live metrics
      drift_signals.csv             # feature PSI & RMSE
      guardrail_events.csv          # violations / recovery logs
    plots/
      metricDashboardSpec.ts        # unified monitoring dashboard
      driftVsPerfSpec.ts            # PSI vs RMSE correlation
      guardrailTimelineSpec.ts      # timeline of guardrail triggers
```

**MDX imports expected:**

```tsx
import { Aside, Callout, Figure } from "@/components/content";
import { MonitoringDashboard } from "@/components/plots/MonitoringDashboard";
import { DriftPerfScatter } from "@/components/plots/DriftPerfScatter";
import { GuardrailTimeline } from "@/components/plots/GuardrailTimeline";
import { CodeTabs } from "@/components/code/CodeTabs";
import DashboardSpec from "./plots/metricDashboardSpec";
import DriftPerfSpec from "./plots/driftVsPerfSpec";
import GuardrailSpec from "./plots/guardrailTimelineSpec";
```

---

## 🧩 1) `content.mdx`

```mdx
# The City Restored

<Aside tone="story">
  The storms have passed. The engines duel less and cooperate more. DriftCity’s models no longer run
  blind — they live inside a **continuous feedback loop** that keeps learning from their world.
</Aside>

<Callout title="What you'll learn">
  - How to connect monitoring, drift detection, and experimentation into a single MLOps loop - How
  to visualize model health in production - How to enforce automated guardrails and incident
  recovery
</Callout>

---

## 1. The MLOps Feedback Loop

Modern ML systems operate in **closed feedback loops**:

<Figure
  src="/images/ch6_observability_loop.png"
  caption="Continuous monitoring: detect drift → diagnose → retrain → revalidate → redeploy."
/>

| Stage           | Role                | Example Metric             |
| --------------- | ------------------- | -------------------------- |
| Ingestion       | Data Quality Checks | Missing feature %          |
| Monitoring      | Drift Detection     | PSI, KS                    |
| Evaluation      | Model Performance   | RMSE, MAE                  |
| Experimentation | Controlled Tests    | A/B outcomes               |
| Governance      | Guardrails          | SLA breach, fairness, bias |
| Retraining      | Continuous Learning | Model refresh pipeline     |

---

## 2. Live Monitoring Dashboard

<MonitoringDashboard
  dataUrl="/chapters/chapter-6/fixtures/monitoring_dashboard.csv"
  spec={DashboardSpec}
/>

This unified dashboard tracks:

- PSI (input drift)
- RMSE (model error)
- Bias (direction of residuals)
- Volume of predictions (traffic)

**Interpretation:**

- Blue stability zone = within normal bounds
- Amber = early warning
- Red = out of tolerance → trigger retraining or rollback

---

## 3. Drift vs Performance Relationship

<DriftPerfScatter dataUrl="/chapters/chapter-6/fixtures/drift_signals.csv" spec={DriftPerfSpec} />

**Observation:**  
High PSI correlates with increased RMSE — confirming that **covariate shifts** often precede performance degradation.  
This correlation is monitored automatically to prioritize retraining only when drift is _impactful_, not just noisy.

---

## 4. Guardrails & Auto-Recovery

Guardrails ensure that even during experiments or drift, the system **fails safely**.

<GuardrailTimeline
  dataUrl="/chapters/chapter-6/fixtures/guardrail_events.csv"
  spec={GuardrailSpec}
/>

- Amber points: guardrail warnings (metric breach)
- Red points: model rollback triggered
- Green points: model redeployed after retraining

Guardrails examples:

- **Latency ≤ 300 ms**
- **MAE ≤ 2.5 min**
- **Fairness gap ≤ 5 %**
- **PSI ≤ 0.25**

---

## 5. Run It Yourself

<CodeTabs
  tabs={[
    {
      label: "Python: simulate monitoring stream",
      language: "python",
      code: `
import numpy as np, pandas as pd
rng = np.random.default_rng(21)
days = pd.date_range("2025-09-01", periods=30)
psi = np.clip(np.linspace(0.05,0.3,30) + rng.normal(0,0.01,30), 0, 1)
rmse = 1.8 + 4*psi + rng.normal(0,0.1,30)
bias = rng.normal(0,0.2,30)
volume = np.random.randint(8000,12000,30)
pd.DataFrame({"date":days,"psi":psi,"rmse":rmse,"bias":bias,"volume":volume}).to_csv("monitoring_dashboard.csv", index=False)
print("Wrote monitoring_dashboard.csv")
`,
    },
    {
      label: "Python: drift–performance correlation",
      language: "python",
      code: `
import pandas as pd
df = pd.read_csv("monitoring_dashboard.csv")
corr = df[["psi","rmse"]].corr().iloc[0,1]
print(f"Correlation PSI–RMSE: {corr:.2f}")
df[["psi","rmse"]].to_csv("drift_signals.csv", index=False)
`,
    },
    {
      label: "Python: generate guardrail events",
      language: "python",
      code: `
import pandas as pd, numpy as np
days = pd.date_range("2025-09-01", periods=30)
events=[]
for i,d in enumerate(days):
    psi = 0.05 + i*0.008
    rmse = 1.8 + 4*psi + np.random.normal(0,0.1)
    status = "ok"
    if psi>0.25 or rmse>2.7:
        status = "rollback" if np.random.rand()<0.5 else "warn"
    if psi<0.1 and status!="ok":
        status="recovered"
    events.append((d,psi,rmse,status))
pd.DataFrame(events,columns=["date","psi","rmse","status"]).to_csv("guardrail_events.csv",index=False)
print("Wrote guardrail_events.csv")
`,
    },
  ]}
/>

---

## 6. Real-World Implementations

| Company     | Monitoring Stack         | Guardrail Logic                                 |
| ----------- | ------------------------ | ----------------------------------------------- |
| **Uber**    | Michelangelo + MonStitch | Auto-drain traffic on drift or SLA breach       |
| **Airbnb**  | Experiment Guardrails    | Blocks metric regressions in concurrent tests   |
| **Netflix** | Atlas + XPGuard          | Real-time anomaly detection on KPIs             |
| **Google**  | TFX + Vertex Pipelines   | Data & model drift checks before auto-promotion |

---

## 7. Key Takeaways

<Callout tone="success" title="Continuous Observability Checklist">
  - Centralize metrics across **drift, performance, and fairness**. - Automate guardrail checks with
  alert thresholds. - Correlate drift with performance degradation for prioritization. - Trigger
  retraining or rollback automatically when thresholds breach. - Feed experiment results back into
  retraining → **closed learning loop**.
</Callout>

---

<Aside tone="story">
  The city hums quietly again. Models train, serve, and self-correct — learning not just from data,
  but from their own mistakes.
</Aside>
```

---

## 🧮 2) Plotly Specs

### `plots/metricDashboardSpec.ts`

```ts
const DashboardSpec = (
  dates: string[],
  psi: number[],
  rmse: number[],
  bias: number[],
  volume: number[]
) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: psi,
      name: "PSI (Drift)",
      line: { color: "#00D8FF", width: 2 },
    },
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: rmse,
      name: "RMSE",
      yaxis: "y2",
      line: { color: "#FFB347", width: 3 },
    },
  ],
  layout: {
    height: 300,
    margin: { t: 10, r: 40, b: 40, l: 50 },
    xaxis: { title: "Date" },
    yaxis: { title: "PSI", range: [0, 0.4] },
    yaxis2: { title: "RMSE", overlaying: "y", side: "right", range: [1, 3] },
    shapes: [
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
    legend: { orientation: "h" },
  },
  config: { displayModeBar: false, responsive: true },
});
export default DashboardSpec;
```

---

### `plots/driftVsPerfSpec.ts`

```ts
const DriftPerfSpec = (psi: number[], rmse: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "markers",
      x: psi,
      y: rmse,
      marker: { color: "#FFB347", size: 6, opacity: 0.8 },
      name: "PSI vs RMSE",
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "PSI (Input Drift)" },
    yaxis: { title: "RMSE (Error)" },
    shapes: [
      {
        type: "line",
        xref: "x",
        yref: "y",
        x0: 0,
        x1: 0.3,
        y0: 1.5,
        y1: 3,
        line: { dash: "dot", color: "#00D8FF" },
      },
    ],
  },
  config: { displayModeBar: false, responsive: true },
});
export default DriftPerfSpec;
```

---

### `plots/guardrailTimelineSpec.ts`

```ts
const GuardrailSpec = (dates: string[], psi: number[], rmse: number[], status: string[]) => {
  const colorMap: { [k: string]: string } = {
    ok: "#00D8FF",
    warn: "#FFB347",
    rollback: "#FF6347",
    recovered: "#32CD32",
  };
  return {
    data: [
      {
        type: "scatter",
        mode: "markers",
        x: dates,
        y: rmse,
        marker: { color: status.map(s => colorMap[s] || "#999"), size: 10 },
        name: "Guardrail Events",
      },
    ],
    layout: {
      height: 280,
      margin: { t: 10, r: 10, b: 40, l: 50 },
      xaxis: { title: "Date" },
      yaxis: { title: "RMSE" },
    },
    config: { displayModeBar: false, responsive: true },
  };
};
export default GuardrailSpec;
```

---

## 🧠 3) Component Contracts

**`<MonitoringDashboard />`**

```ts
type MonitoringDashboardProps = {
  dataUrl: string; // CSV columns: date, psi, rmse, bias, volume
  spec: (
    dates: string[],
    psi: number[],
    rmse: number[],
    bias: number[],
    volume: number[]
  ) => Plotly.Spec;
};
```

**`<DriftPerfScatter />`**

```ts
type DriftPerfScatterProps = {
  dataUrl: string; // CSV columns: psi, rmse
  spec: (psi: number[], rmse: number[]) => Plotly.Spec;
};
```

**`<GuardrailTimeline />`**

```ts
type GuardrailTimelineProps = {
  dataUrl: string; // CSV columns: date, psi, rmse, status
  spec: (dates: string[], psi: number[], rmse: number[], status: string[]) => Plotly.Spec;
};
```

---

## ✅ 4) QA Checklist

| Check                                                          | Expected |
| -------------------------------------------------------------- | -------- |
| Dashboard shows PSI+RMSE dual axis chart                       | ✅       |
| Drift vs Perf scatter displays upward correlation              | ✅       |
| Guardrail timeline shows colored points (blue/amber/red/green) | ✅       |
| CSVs load correctly client-side                                | ✅       |
| Responsive on tablet/mobile                                    | ✅       |

---

## 📘 5) Pedagogical Notes

- This chapter **connects all prior lessons**: baseline, drift, concept shift, experimentation, and variance control.
- Introduce the “Closed-Loop MLOps” mental model: _Detect → Diagnose → Act → Validate → Redeploy_.
- Emphasize that monitoring ≠ alerting — we need actionable guardrails.
- Tie back to real systems: Uber’s _MonStitch_, Airbnb’s _XP Platform_, Netflix’s _Atlas/XPGuard_.

---

## 🧱 6) Developer Deliverables

| File                       | Purpose                      |
| -------------------------- | ---------------------------- |
| `content.mdx`              | Complete chapter content     |
| `monitoring_dashboard.csv` | Combined metric dataset      |
| `drift_signals.csv`        | PSI–RMSE correlation data    |
| `guardrail_events.csv`     | Guardrail trigger events     |
| `metricDashboardSpec.ts`   | Dual-axis dashboard spec     |
| `driftVsPerfSpec.ts`       | Scatter correlation spec     |
| `guardrailTimelineSpec.ts` | Event timeline spec          |
| Components                 | Reuse from previous chapters |

---

## ✅ 7) Summary

**Concept Focus:** Continuous MLOps observability & feedback
**Widgets:** MonitoringDashboard, DriftPerfScatter, GuardrailTimeline
**Code:** Generate live metrics + drift correlation + guardrail events
**Industry Reference:** Uber Michelangelo, Netflix XPGuard, Airbnb Guardrails
**Outcome:** Readers understand how to close the loop — continuously monitor, detect, respond, and learn.

---

This concludes _DriftCity — Statistics for MLOps (MVP)_.
Each chapter now maps directly to one implementation domain in production MLOps pipelines — from drift detection to automated experimentation and governance.
