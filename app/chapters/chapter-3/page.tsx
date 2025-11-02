import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 3: The Vanishing Commuter - DriftCity",
  description: "Understand concept drift and when P(Y|X) changes.",
};

export default function Chapter3() {
  return (
    <div className="chapter-page">
      <h1>The Vanishing Commuter</h1>
      <p className="chapter-description">Concept drift (when P(Y|X) changes)</p>

      <section className="chapter-content">
        <p>
          This chapter explores concept drift, where the relationship between inputs and target
          labels changes over time. Discover techniques to detect and adapt to these fundamental
          shifts in model behavior.
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
