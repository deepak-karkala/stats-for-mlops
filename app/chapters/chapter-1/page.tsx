import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 1: The City That Learned Too Fast - DriftCity",
  description: "Learn about baseline distributions and drift detection using PSI and KS tests.",
};

export default function Chapter1() {
  return (
    <div className="chapter-page">
      <h1>The City That Learned Too Fast</h1>
      <p className="chapter-description">Baseline distributions & drift detection (PSI, KS test)</p>

      <section className="chapter-content">
        <p>
          This chapter introduces the fundamental concepts of drift detection in machine learning
          systems. We&apos;ll explore how baseline distributions shift over time and learn to detect
          these changes using statistical tests.
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
