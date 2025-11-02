import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 6: The City Restored - DriftCity",
  description: "Master continuous monitoring, guardrails, and observability loops.",
};

export default function Chapter6() {
  return (
    <div className="chapter-page">
      <h1>The City Restored</h1>
      <p className="chapter-description">Continuous monitoring, guardrails, observability loops</p>

      <section className="chapter-content">
        <p>
          This final chapter ties everything together, exploring how to build robust monitoring
          systems, set intelligent guardrails, and create feedback loops that keep your ML systems
          healthy in production.
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
