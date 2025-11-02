import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 2: The Weather Event - DriftCity",
  description: "Explore covariate drift and understand when P(X) changes.",
};

export default function Chapter2() {
  return (
    <div className="chapter-page">
      <h1>The Weather Event</h1>
      <p className="chapter-description">Covariate drift (when P(X) changes)</p>

      <section className="chapter-content">
        <p>
          This chapter examines covariate drift, where the distribution of input features changes
          while the relationship between features and predictions remains the same. Learn to
          identify and handle these distribution shifts.
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
