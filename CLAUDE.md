# DriftCity - Statistics for MLOps

## Project Overview

Educational web application teaching MLOps statistical concepts through interactive visualizations. Built with Next.js (App Router) + MDX + React + Plotly.js.

**Target:** 4-week MVP launch → Vercel deployment
**Audience:** ML Engineers, Data Scientists, PMs, Students

## Core Architecture

### Stack

- **Framework:** Next.js 14+ (App Router), TypeScript (strict mode)
- **Content:** MDX via `mdx-bundler` or `next-mdx-remote`
- **Charts:** Plotly.js (client-only, dynamic import with `ssr: false`)
- **Styling:** CSS variables (tokens.css) + optional Tailwind
- **Deployment:** Vercel (static generation)

### Key Directories

```
/app/chapters/chapter-{1..6}/  → Chapter routes (page.tsx + content.mdx + fixtures/ + plots/)
/components/layout/            → TwoColumnShell, Sidebar, HeaderBar
/components/mdx/               → MDXRenderer, shortcodes
/components/plots/             → Chart wrappers (all client components)
/components/content/           → Aside, Callout, Figure, KPI
/components/ui/                → CodeBlock, CodeTabs, DataTable, Slider, ToggleGroup
/components/lib/               → chapters.ts, mdx.ts, csv.ts, viewport.ts
/public/data/                  → Shared CSV fixtures
/styles/                       → tokens.css, theme.css
/context/                      → Project documentation (PRD, architecture, chapters)
```

## Common Commands

### Development

- `pnpm dev` → Start dev server (http://localhost:3000)
- `pnpm build` → Production build
- `pnpm start` → Preview production build locally
- `pnpm lint` → Run ESLint
- `pnpm format` → Run Prettier

### Deployment

- `vercel --prod` → Deploy to production
- Vercel auto-deploys on push to `main`
- PR preview URLs created automatically

## Code Style Guidelines

### TypeScript

- **IMPORTANT:** Use strict TypeScript. All component props must have explicit types.
- Prefer named exports for components
- Use `type` for props, `interface` for extensible contracts

```tsx
// Good
type HistogramPanelProps = {
  id: string;
  dataUrl: string;
  traceSpec: (values: number[], feature: string) => Plotly.Spec;
  height?: number;
};
```

### Component Patterns

- **Server Components (RSC):** Layout components (TwoColumnShell, Sidebar, HeaderBar)
- **Client Components:** ALL Plotly charts, interactive widgets
  - Must include `"use client"` directive
  - Dynamic import Plotly: `dynamic(() => import("react-plotly.js"), { ssr: false })`
- **MDX Components:** Export via `shortcodes.tsx` map

### File Naming

- Components: PascalCase (e.g., `DriftGauge.tsx`)
- Utilities: camelCase (e.g., `csv.ts`)
- Specs: camelCase with Spec suffix (e.g., `psiGaugeSpec.ts`)
- Data: snake_case (e.g., `rides_baseline.csv`)

### CSS & Styling

- Use CSS variables from `tokens.css`:
  - Colors: `--color-blue` (#00D8FF), `--color-amber` (#FFB347)
  - Spacing: `--space-1` (8px), `--space-2` (16px), `--space-3` (24px)
  - Radius: `--radius` (12px)
- Class naming: BEM-lite (e.g., `nav-link`, `nav-link--active`)

## Chapter Structure

### YOU MUST follow this template for each chapter:

```mdx
# Chapter Title

<Aside tone="story|calm|info|next">Context paragraph</Aside>

<Callout title="What you'll learn">- Learning objective 1 - Learning objective 2</Callout>

## 1. Concept Overview

(3-5 sentences + optional Figure)

## 2. Interactive Exploration

<ChartComponent dataUrl="./fixtures/data.csv" spec={SpecFunction} />
(1-2 sentences explaining what to observe)

## 3. Code Example

<CodeTabs tabs={[{ label, language, code }]} />

## 4. Real-World Examples

(Table or bullets with industry case studies)

## 5. Key Takeaways

<Callout tone="success" title="Checklist">
  - Bullet 1 - Bullet 2
</Callout>

<Aside tone="next">Next chapter teaser</Aside>
```

### Chapter Content Guidelines

- **Length:** 400-600 words (2-3 min read)
- **Tone:** Clear, direct, slightly narrative
- **Visuals:** 1-2 figures per chapter
- **Interactivity:** 1 main widget (optional secondary)
- **Code:** 1 short, runnable snippet (3-10 lines)
- **NO EMOJIS** in content unless explicitly requested

## Testing Requirements

### Before Committing

- [ ] No TypeScript errors: `pnpm build` succeeds
- [ ] No ESLint warnings
- [ ] Plotly charts load without SSR hydration errors
- [ ] CSV fixtures exist at specified paths
- [ ] Mobile/tablet responsive (test at 768px, 1024px, 1440px)

### Accessibility Checklist

- [ ] All images have `alt` text
- [ ] Charts have 1-2 sentence textual summaries below them
- [ ] Sidebar navigable via keyboard (Tab, Enter)
- [ ] Color contrast ≥ 4.5:1 (use tokens for safety)
- [ ] Skip link to main content present
- [ ] ARIA landmarks: `<header>`, `<nav aria-label="Chapters">`, `<main>`

### Performance Targets

- Lighthouse scores ≥ 80 (Performance, Accessibility, Best Practices)
- Initial load < 1s locally, < 3s on Vercel
- Charts lazy-load on visibility (IntersectionObserver)

## Data & Plot Patterns

### CSV Requirements

- Place in chapter-specific `fixtures/` folder
- Use descriptive names: `rides_baseline.csv`, `rides_rainstorm.csv`
- **IMPORTANT:** First row MUST be headers matching component contracts
- Cache with immutable headers in `vercel.json`

### Plot Spec Pattern

```ts
// plots/exampleSpec.ts
const ExampleSpec = (data: number[], feature: string) => ({
  data: [{ type: "histogram", x: data, ... }],
  layout: { height: 360, margin: { t: 10, r: 10, b: 40, l: 50 }, ... },
  config: { displayModeBar: false, responsive: true },
});
export default ExampleSpec;
```

### Component Contract Template

```tsx
type PlotComponentProps = {
  dataUrl: string; // Path to CSV fixture
  spec: (...args) => Plotly.Spec; // Factory function
  // Additional props as needed
};
```

## Git Workflow

### Branch Naming

- Feature: `feat/chapter-1-content`
- Fix: `fix/sidebar-keyboard-nav`
- Docs: `docs/readme-update`

### Commit Messages

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Be descriptive: `feat(ch2): add covariate drift histogram compare widget`

### Pull Requests

- **IMPORTANT:** All PRs must pass CI (lint + build) before merge
- Squash merge to `main`
- Reference issues: `Fixes #123`
- Include Vercel preview URL in PR description
- Test checklist in PR template

## Common Issues & Solutions

### Plotly SSR Errors

**Problem:** `window is not defined` or hydration mismatch
**Solution:** Ensure `"use client"` directive + dynamic import with `ssr: false`

```tsx
"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
```

### CSV Not Loading

**Problem:** 404 on CSV fetch
**Solution:**

1. Verify path is correct (relative to public root or chapter dir)
2. Check filename casing (case-sensitive on Vercel)
3. Ensure file exists in build output

### MDX Compilation Errors

**Problem:** MDX fails to compile
**Solution:**

1. Check JSX syntax in embedded components
2. Ensure all imported components exist
3. Verify shortcodes map includes component

### Sidebar Active State Not Working

**Problem:** Active chapter not highlighted
**Solution:** Use `useSelectedLayoutSegments()` in client component or pass slug as prop

## Project-Specific Notes

### Chapter Order & Dependencies

- Chapters 1-3: Drift detection concepts (build on each other)
- Chapters 4-5: Experimentation (Ch5 extends Ch4)
- Chapter 6: Integration (references all prior concepts)
- **IMPORTANT:** Keep each chapter self-contained; users may skip around

### Industry Case Study Sources

Reference real implementations when possible:

- Uber Michelangelo
- Airbnb Experimentation Platform
- Netflix Atlas/XPGuard
- DoorDash Feature Store
- Cite specific features, not general systems

### Design Tokens (DO NOT MODIFY without team discussion)

```css
:root {
  --color-blue: #00d8ff; /* Stability, primary */
  --color-amber: #ffb347; /* Alert, warning */
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --color-sidebar: #f2f3f5;
}
```

### Performance Budget

- **Plotly bundle:** Use `plotly.js-basic-dist` if possible (smaller)
- **Images:** SVG/PNG < 200KB
- **Total JS:** Target < 500KB gzipped (main bundle)

## Documentation Files to Reference

- [context/prd.md](context/prd.md) → Product requirements & success metrics
- [context/architecture.md](context/architecture.md) → Technical architecture details
- [context/frontend-specification.md](context/frontend-specification.md) → UI/UX specs + wireframes
- [context/chapter_template.md](context/chapter_template.md) → Chapter structure guide
- [context/chapter1.md](context/chapter1.md) through [context/chapter6.md](context/chapter6.md) → Full chapter implementations
- [context/integration-document.md](context/integration-document.md) → How chapters link together
- [context/implementation-plan.md](context/implementation-plan.md) → Phased milestones & GitHub issues

## Quick Reference

### Adding a New Chapter

1. Create `/app/chapters/chapter-X/page.tsx`
2. Create `content.mdx` with template structure
3. Add `fixtures/` folder with CSV data
4. Create `plots/*.ts` spec functions
5. Build components in `/components/plots/`
6. Add to `chapters.ts` metadata
7. Update `shortcodes.tsx` if new components added
8. Test locally, create PR

### Debugging Chart Issues

1. Check browser console for errors
2. Verify CSV headers match component expectations
3. Confirm `spec` function returns valid Plotly config
4. Test with minimal data first
5. Use React DevTools to inspect props

### Deploy Checklist

- [ ] `pnpm build` succeeds
- [ ] All fixtures committed
- [ ] No hardcoded localhost URLs
- [ ] Lighthouse audit passes
- [ ] Test on Vercel preview
- [ ] Check mobile responsiveness
- [ ] Verify CSV cache headers

---

**Last Updated:** January 2025
**For questions or clarifications, see documentation in `/context/` folder**
