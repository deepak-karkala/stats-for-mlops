# **Chapter Template**

### **Purpose**

Each chapter is a **self-contained learning module** that:

1. introduces one key MLOps statistical concept,
2. illustrates it through visuals or data examples,
3. provides an interactive component to explore it,
4. reinforces learning with a code example and concise takeaway.

This keeps chapters **modular, visually consistent, and technically actionable.**

---

## 🧩 **Chapter MDX Layout Structure**

Each chapter’s MDX file will follow this consistent sequence:

````mdx
# Chapter Title (e.g., “The City That Learned Too Fast”)

<ChapterIntro>
  A short paragraph (2–3 sentences) setting context — introduces the concept simply and connects it
  to real-world ML system behavior.
</ChapterIntro>

---

## 📊 Concept Overview

A concise description (3–5 sentences) of what this chapter covers, including intuitive explanation and visual metaphor if applicable.

<Figure src="/images/{chapter}.png" caption="High-level conceptual illustration" />

---

## 🧠 Why It Matters

Explain _why_ this concept is critical in MLOps — what happens if it’s ignored in real-world systems.
Keep it in bullet format (3–5 points).

---

## 🧩 Interactive Exploration

Describe how users can **see** or **manipulate** this concept using interactive widgets.  
Include one of the interactive components like:

- `<InteractivePlot />` — for histogram, scatter, RMSE, etc.
- `<PSIWidget />` — for drift detection
- `<PowerCurve />` — for A/B testing power analysis
- `<CUPEDDemo />` — for variance reduction
- `<ResidualHeatmap />` — for concept drift residuals

Example:

```mdx
<PSIWidget
  baselineCsv="/data/rides_baseline.csv"
  currentCsv="/data/rides_rainstorm.csv"
  feature="trip_distance_km"
  bins={30}
  threshold={0.25}
/>
```
````

Add a **short paragraph below each widget** explaining what users should notice or learn by interacting.

---

## 💻 Code Example

Provide a small, runnable code snippet (3–10 lines max).
It should show how the concept is implemented statistically using Python.

Example:

```python
from scipy.stats import ks_2samp
ks_2samp(baseline['trip_distance_km'], current['trip_distance_km'])
```

Each code block should:

- demonstrate one main operation (e.g., computing PSI, KS test, RMSE, power analysis),
- match the concept introduced in the interactive above.

---

## 📈 Example Output or Graph

Optionally, show a static Plotly figure or image output to illustrate expected results.

```mdx
<Figure src="/images/chapter1_histogram.png" caption="Baseline distribution of trip distances" />
```

---

## 🧩 Real-World Connection

Short paragraph or bullet list linking this concept to industry practice.
E.g., _“Uber’s Michelangelo platform monitors feature drift using PSI weekly across production models.”_

---

## 🧭 Key Takeaways

Conclude with **3–5 bullet points** summarizing:

- the intuition,
- practical action items,
- key metrics introduced.

Example:

```mdx
<ChapterTakeaway>
  - Always define a reference distribution before deploying a model. - Drift detection relies on
  comparing current data to that baseline. - Early anomalies prevent cascading model failures.
</ChapterTakeaway>
```

---

## 🧩 Optional Add-ons (for later versions)

_(These are placeholders you can comment out for MVP but keep ready for V2)_

```mdx
<!--
## 🌀 Further Exploration
Add scrollytelling sequences, motion effects, or video loops here in future.
-->
```

---

# ✅ **MVP Content Principles**

| Aspect            | Guideline                                             |
| ----------------- | ----------------------------------------------------- |
| **Length**        | 2–3 min reading time (≈400–600 words)                 |
| **Visuals**       | 1–2 figures per chapter                               |
| **Interactivity** | 1 main widget (optional secondary chart)              |
| **Code**          | 1 short snippet                                       |
| **Tone**          | Clear, direct, slightly narrative (“in DriftCity...”) |
| **Style**         | Accessible to ML engineers, data scientists, PMs      |

---

# 🧠 **Example Chapter Layout Snapshot (Visual Structure)**

```
[Chapter Title]
-----------------------------------------------------
| Short intro paragraph (context)
|
| Concept overview: 3–4 sentences
|
| [Illustration image]
|
| Why It Matters (bullet points)
|
| [Interactive chart or slider widget]
| (short note below explaining outcome)
|
| [Python code block]
| [Static figure or chart output]
|
| Real-world tie-in (Uber, Lyft, Netflix examples)
|
| [Key takeaways box]
-----------------------------------------------------
```

---

# 🧩 **Reusable Content Elements Across Chapters**

| Component           | Use Case                    | Example                              |
| ------------------- | --------------------------- | ------------------------------------ |
| `<Figure>`          | Visuals & diagrams          | Concept illustration or static chart |
| `<InteractivePlot>` | General interactive chart   | Distribution, performance trend      |
| `<PSIWidget>`       | Drift visualization         | Covariate shift detection            |
| `<ResidualHeatmap>` | Concept drift visualization | Residual clusters by zone            |
| `<PowerCurve>`      | A/B testing                 | Sample size & power analysis         |
| `<CUPEDDemo>`       | Variance reduction          | CUPED adjustment simulation          |
| `<ChapterIntro>`    | Context narrative           | Sets tone for each topic             |
| `<ChapterTakeaway>` | Learning summary            | 3–5 bullets, visually boxed          |
| `<CodeBlock>`       | Code demo                   | Short, focused snippet               |

---

# 🧩 **Implementation Notes for Authors**

- Use **plain English** and intuitive analogies.
- Each section should be **independent**, allowing readers to jump directly to it.
- Add **one new concept per chapter** only (no nested digressions).
- Keep **figures lightweight (SVG/PNG < 200 KB)** for fast load.
- Ensure every widget includes an explanatory paragraph below it.

---
