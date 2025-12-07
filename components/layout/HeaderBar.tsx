import Link from "next/link";

export const HeaderBar = () => {
  return (
    <header className="header-bar">
      <div className="header-content">
        <Link href="/" className="back-link">
          Back to Portfolio
        </Link>

        <div className="header-branding">
          <h1 className="header-title">DriftCity</h1>
          <p className="header-subtitle">Statistics for MLOps</p>
        </div>

        <Link href="/about" className="about-link">
          About
        </Link>
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
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }

        .back-link {
          color: var(--color-blue);
          font-weight: var(--weight-semibold);
          text-decoration: none;
          font-size: var(--text-sm);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          transition: background-color var(--duration-fast) var(--easing-ease-in-out);
          min-width: 140px;
        }

        .back-link:hover {
          background-color: var(--color-bg-secondary);
        }

        .header-branding {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          align-items: center;
          text-align: center;
          flex: 1;
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

        .about-link {
          color: var(--color-text);
          font-weight: var(--weight-semibold);
          text-decoration: none;
          font-size: var(--text-sm);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          transition: background-color var(--duration-fast) var(--easing-ease-in-out),
            color var(--duration-fast) var(--easing-ease-in-out);
          min-width: 80px;
        }

        .about-link:hover {
          background-color: var(--color-bg-secondary);
          color: var(--color-blue);
        }

        @media (max-width: 768px) {
          .header-bar {
            padding: 0 var(--space-4);
          }

          .back-link {
            font-size: var(--text-xs);
          }

          .header-title {
            font-size: var(--text-xl);
          }

          .header-subtitle {
            font-size: var(--text-xs);
          }

          .about-link {
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </header>
  );
};
