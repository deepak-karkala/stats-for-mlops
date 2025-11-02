"use client";

export const HeaderBar = () => {
  return (
    <header className="header-bar">
      <div className="header-content">
        <div className="header-branding">
          <h1 className="header-title">DriftCity</h1>
          <p className="header-subtitle">Statistics for MLOps</p>
        </div>
      </div>

      <style>{`
        .header-bar {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          height: var(--header-height);
          background-color: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          padding: 0 var(--space-6);
          transition: border-color var(--duration-normal) var(--easing-ease-in-out),
            background-color var(--duration-normal) var(--easing-ease-in-out);
        }

        .header-content {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-branding {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .header-title {
          font-size: var(--text-2xl);
          font-family: var(--font-display);
          font-weight: var(--weight-bold);
          color: var(--color-blue);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .header-subtitle {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin: 0;
          font-weight: var(--weight-normal);
        }

        @media (max-width: 768px) {
          .header-bar {
            padding: 0 var(--space-4);
          }

          .header-title {
            font-size: var(--text-xl);
          }

          .header-subtitle {
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </header>
  );
};
