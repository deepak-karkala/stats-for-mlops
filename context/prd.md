# Product Requirements Document (PRD)

**Project:** DriftCity — _Statistics for MLOps (MVP Phase)_
**Version:** v1.0
**Date:** October 2025

---

## 1. 📘 **Overview**

**Goal:**
To rapidly launch a content-first educational MVP website that teaches _Statistics for MLOps_ using the **DriftCity** narrative and visual style, while focusing on interactivity and simplicity over cinematic storytelling.

**Objective:**
Deliver an engaging, structured, and technically insightful learning experience with:

- Modular **two-column layout** (sidebar navigation + content area).
- Six conceptual chapters (Data Drift → Monitoring).
- Interactive educational elements (charts, sliders, code snippets).
- Ready base for future expansion (scrollytelling, animation, and audio).

---

## 2. 🎯 **Product Vision**

DriftCity aims to make **statistical concepts in MLOps** intuitive through visuals and small interactive demos — turning dense math and metrics (PSI, CUPED, SRM, RMSE) into simple, clickable, explorable experiences.

**MVP Vision Statement:**

> _“Launch a lean, modular web app that explains the statistical heart of MLOps — fast to build, easy to extend, and delightful to explore.”_

---

## 3. 🧩 **MVP Scope**

### ✅ **In Scope**

| Category          | Included                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Content**       | 6 core chapters (from DriftCity Volume I) with narrative intros, code examples, and takeaways. |
| **UI/UX**         | Two-column layout with persistent sidebar, responsive design, minimal animations.              |
| **Interactivity** | Plotly/Chart.js visualizations (histogram, PSI, power curve, CUPED slider, etc.).              |
| **Theming**       | Blue–Amber color scheme, clean typography (Orbitron + Inter).                                  |
| **Deployment**    | Hosted via Vercel (Next.js + MDX build).                                                       |
| **Documentation** | Developer handoff files (README, color tokens, structure guide).                               |

### 🚫 **Out of Scope (Deferred to Future Versions)**

| Deferred Feature                      | Reason                                   |
| ------------------------------------- | ---------------------------------------- |
| Scroll-based cinematic storytelling   | To be added post-MVP for branding impact |
| Audio narration / ambient sound       | Non-essential for core learning          |
| Real-time data input or API ingestion | Adds backend complexity                  |
| Authentication, analytics dashboard   | Not required for first release           |

---

## 4. 🧱 **Product Structure**

**Main Sections:**

1. **Header:** Logo + simple navigation (Home, All Chapters, About).
2. **Sidebar:** Persistent chapter list for navigation.
3. **Content Area:** Displays selected chapter’s content (intro, explanation, interactive visuals, code).
4. **Footer:** Minimal, with project credits and GitHub link.

**Chapter List:**

1. The City That Learned Too Fast (Data Distributions)
2. The Weather Event (Covariate Drift)
3. The Vanishing Commuter (Concept Drift)
4. The Duel of Engines (A/B Testing)
5. The CUPED Control Tower (Variance Reduction)
6. The City Restored (Monitoring & Guardrails)

---

## 5. 🎓 **Learning Outcomes per Chapter**

| Chapter | Core Concept                       | Outcome                                     |                                         |
| ------- | ---------------------------------- | ------------------------------------------- | --------------------------------------- |
| 1       | P(X), P(Y), Baseline Distributions | Understand normal model behavior            |                                         |
| 2       | Covariate Drift (P(X) changes)     | Detect input distribution changes           |                                         |
| 3       | Concept Drift (P(Y                 | X) changes)                                 | Recognize changing target relationships |
| 4       | A/B Testing                        | Design and interpret controlled experiments |                                         |
| 5       | CUPED, Sequential Testing          | Reduce variance and test faster             |                                         |
| 6       | Guardrails, Monitoring             | Integrate feedback loops for ML stability   |                                         |

---

## 6. 🧠 **User Personas**

| Persona               | Description                         | Goal                                                    |
| --------------------- | ----------------------------------- | ------------------------------------------------------- |
| **ML Engineer**       | Works with models in production     | Understand drift detection and testing workflows        |
| **Data Scientist**    | Builds models, monitors performance | Learn how to analyze and reduce statistical noise       |
| **Product Manager**   | Oversees model experiments          | Grasp impact of metrics and tests in decision-making    |
| **Student / Learner** | Studying MLOps fundamentals         | Gain conceptual + visual intuition for model operations |

---

## 7. 🧩 **Key Features (MVP)**

| Feature                   | Description                                       | Example                                        |
| ------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| **Interactive Charts**    | Embedded charts to visualize drift, power, RMSE   | Plotly histograms, PSI slider                  |
| **Code Blocks**           | Syntax-highlighted, collapsible Python snippets   | `plotly`, `scipy`, `numpy` examples            |
| **Chapter Navigation**    | Sidebar-based navigation with active highlighting | Two-column layout                              |
| **Illustrations**         | Static images explaining concepts                 | Midjourney / DALL·E renders                    |
| **Light Narrative Layer** | Short paragraph intros per chapter                | “Scene-style” intros with one or two sentences |

---

## 8. 🎨 **Design Guidelines**

- **Layout:** Clean, academic, modular.
- **Fonts:** Orbitron (headers), Inter (body).
- **Primary Colors:**
  - Blue `#00D8FF` (stability)
  - Amber `#FFB347` (alert)

- **Typography Size:**
  - Headings: 28–36px
  - Body: 18px
  - Code: 16px monospace

- **Visual Consistency:** Reuse DriftCity icons and branding (simple skyline watermark in header).

---

## 9. ⚙️ **Functional Requirements**

| ID   | Requirement                                   | Priority |
| ---- | --------------------------------------------- | -------- |
| FR-1 | Display all 6 chapters in sidebar navigation  | High     |
| FR-2 | Render MDX content dynamically in right panel | High     |
| FR-3 | Support embedded interactive Plotly charts    | High     |
| FR-4 | Support collapsible Python code blocks        | Medium   |
| FR-5 | Responsive layout for desktop and tablet      | High     |
| FR-6 | Theming via global CSS tokens                 | Medium   |
| FR-7 | Light/Dark mode toggle (optional)             | Low      |

---

## 10. 🧰 **Non-Functional Requirements**

| Category            | Requirement                                      |
| ------------------- | ------------------------------------------------ |
| **Performance**     | Each page should load < 1s locally, < 3s on web. |
| **Accessibility**   | Proper ARIA roles, high contrast text.           |
| **Maintainability** | Content updates via markdown only.               |
| **Scalability**     | Easy to add future chapters or case files.       |
| **Deployment**      | Static export ready for Vercel or Netlify.       |

---

## 11. 🚀 **Success Metrics**

| Metric                              | Target                                          |
| ----------------------------------- | ----------------------------------------------- |
| MVP launch timeline                 | ≤ 4 weeks                                       |
| Content coverage                    | 100% of 6 chapters live                         |
| Avg. engagement time per page       | ≥ 3 minutes                                     |
| Interactive element completion rate | ≥ 60% of users interact with at least one chart |
| Technical feedback satisfaction     | ≥ 80% positive among beta readers               |

---

## 12. 🧩 **Dependencies**

| Type              | Dependency                             | Status    |
| ----------------- | -------------------------------------- | --------- |
| **Framework**     | Next.js + MDX plugin                   | Confirmed |
| **Charts**        | Plotly.js React integration            | Confirmed |
| **Hosting**       | Vercel                                 | Planned   |
| **Illustrations** | AI-generated + licensed static images  | Pending   |
| **Content**       | Final text from DriftCity chapters 1–6 | Complete  |

---

## 13. 📅 **High-Level Timeline**

| Week   | Milestone                                   |
| ------ | ------------------------------------------- |
| Week 1 | Project setup, structure, MDX integration   |
| Week 2 | Add chapter content and basic interactivity |
| Week 3 | Visual polish, mobile responsiveness        |
| Week 4 | Testing and deployment                      |

---

## 14. 🧭 **Risks & Mitigation**

| Risk                      | Impact                    | Mitigation                              |
| ------------------------- | ------------------------- | --------------------------------------- |
| Overdesign of MVP         | Delays launch             | Strict scope adherence                  |
| Plotly performance issues | Page lag                  | Lazy-load charts                        |
| Content complexity        | Overwhelms casual readers | Use short intros + collapsibles         |
| Style inconsistency       | Poor UX                   | Shared design tokens & layout templates |

---

## 15. ✅ **Deliverables**

| Deliverable            | Description                          |
| ---------------------- | ------------------------------------ |
| MVP Web App            | Functional two-column web experience |
| Documentation          | Tech architecture + dev setup guide  |
| Interactive Components | Reusable widgets (PSI, power, CUPED) |
| Illustrations          | 6 static visuals (one per chapter)   |
| Deployment             | Hosted version on Vercel             |

---

### 💡 Summary

The **DriftCity MVP PRD** defines a lean, interactive, and visually coherent educational product that brings advanced MLOps statistical ideas to life without cinematic overhead.
This MVP will validate concept engagement, measure user learning outcomes, and serve as the foundation for **Volume II: Expanded Visual Storytelling** later.

---
