# DriftCity - Statistics for MLOps

An interactive educational web application that teaches statistical concepts in MLOps through narrative-driven visualizations and hands-on examples.

## 🎯 Project Overview

**DriftCity** makes complex MLOps statistical concepts (drift detection, A/B testing, CUPED, etc.) intuitive through:

- Interactive Plotly visualizations
- A narrative set in a fictional city where algorithms learn and adapt
- Real-world case studies from Uber, Airbnb, Netflix, and more
- Hands-on Python code examples

**Target:** 4-week MVP → Vercel deployment
**Audience:** ML Engineers, Data Scientists, Product Managers, Students

## 📚 Chapters

1. **The City That Learned Too Fast** - Baseline distributions & drift detection (PSI, KS test)
2. **The Weather Event** - Covariate drift (when P(X) changes)
3. **The Vanishing Commuter** - Concept drift (when P(Y|X) changes)
4. **The Duel of Engines** - A/B testing, SRM detection, power analysis
5. **The CUPED Control Tower** - Variance reduction & sequential testing
6. **The City Restored** - Continuous monitoring, guardrails, observability loops

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stats-for-mlops

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Content:** MDX (Markdown + React components)
- **Visualization:** Plotly.js
- **Styling:** CSS Variables + Tailwind CSS
- **Deployment:** Vercel

## 📁 Project Structure

```
stats-for-mlops/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── chapters/            # Chapter routes (to be added)
├── components/              # React components (to be added)
│   ├── layout/             # Layout components
│   ├── mdx/                # MDX rendering
│   ├── plots/              # Chart components
│   └── ui/                 # UI components
├── context/                # Project documentation
│   ├── prd.md              # Product requirements
│   ├── architecture.md     # Technical architecture
│   ├── chapter1.md - chapter6.md  # Chapter implementations
│   └── implementation-plan.md     # Development phases
├── public/                 # Static assets (to be added)
├── styles/                 # CSS files (to be added)
├── CLAUDE.md              # Claude Code assistant guide
└── README.md              # This file
```

## 🎨 Design System

**Color Tokens:**

- Primary Blue: `#00D8FF` (stability, primary actions)
- Amber: `#FFB347` (alerts, warnings)
- Text: `#1A1A1A`
- Background: `#FFFFFF`
- Sidebar: `#F2F3F5`

**Typography:**

- Headers: Orbitron
- Body: Inter
- Code: Monospace

## 🧪 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Prefer named exports for components
- Use `"use client"` directive for interactive components
- Dynamic import Plotly with `ssr: false`

### Component Patterns

- **Server Components:** Layout, static content
- **Client Components:** Charts, interactive widgets
- **MDX Components:** Exportable shortcodes

### Testing Before Commit

- [ ] `npm run build` succeeds
- [ ] No ESLint warnings
- [ ] Charts load without hydration errors
- [ ] Responsive on mobile/tablet (768px, 1024px)

## 📖 Documentation

- See [CLAUDE.md](CLAUDE.md) for Claude Code assistant guidelines
- See [context/](context/) folder for detailed specifications
- See [context/implementation-plan.md](context/implementation-plan.md) for development roadmap

## 🗓️ Development Timeline

- **Week 1:** Phase 0-1 (Setup, shell, deploy)
- **Week 2-3:** Phase 2 (Chapters 1-6)
- **Week 4:** Phase 3 (QA, A11y, docs) → Production release

## 🤝 Contributing

This is an active development project. Please check:

1. [CLAUDE.md](CLAUDE.md) for coding standards
2. [context/implementation-plan.md](context/implementation-plan.md) for current phase
3. Open issues and milestones on GitHub

### Git Workflow

- Branch naming: `feat/feature-name`, `fix/bug-name`, `docs/doc-name`
- Commit messages: Use conventional commits (`feat:`, `fix:`, `docs:`)
- Pull requests must pass CI (lint + build)
- Squash merge to `main`

## 📝 License

[To be determined]

## 🙏 Acknowledgments

- Statistical concepts based on industry practices from Uber, Airbnb, Netflix, DoorDash
- Built with Next.js, React, and Plotly.js
- Educational content inspired by real MLOps challenges

---

**Status:** Phase 0 - Project Setup ✅
**Last Updated:** January 2025
