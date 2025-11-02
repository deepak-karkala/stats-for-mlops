import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter 5: The CUPED Control Tower - DriftCity",
  description: "Learn variance reduction techniques and sequential testing.",
};

export default function Chapter5() {
  return (
    <div className="chapter-page">
      <h1>The CUPED Control Tower</h1>
      <p className="chapter-description">Variance reduction & sequential testing</p>

      <section className="chapter-content">
        <p>
          This chapter introduces CUPED (Controlled Experiment Using Prior Events as Data) for
          variance reduction and explores sequential testing approaches that allow for faster, more
          efficient experimentation without sacrificing statistical rigor.
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
