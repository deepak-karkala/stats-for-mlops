import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 4: The Duel of Engines - DriftCity",
  description: "Master A/B testing, SRM detection, and power analysis.",
};

export default function Chapter4() {
  return (
    <div className="chapter-page">
      <h1>The Duel of Engines</h1>
      <p className="chapter-description">A/B testing, SRM detection, power analysis</p>

      <section className="chapter-content">
        <p>
          This chapter covers the statistical foundations of A/B testing, including how to detect
          Sample Ratio Mismatch (SRM), perform power analysis, and design experiments that lead to
          reliable conclusions.
        </p>
      </section>

      <style>{`
        .chapter-page {
          width: 100%;
        }

        .chapter-page h1 {
          margin-bottom: var(--space-2);
        }

        .chapter-description {
          color: var(--color-text-secondary);
          font-size: var(--text-lg);
          margin-bottom: var(--space-8);
        }

        .chapter-content {
          max-width: 800px;
        }
      `}</style>
    </div>
  );
}
