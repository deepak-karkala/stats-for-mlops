"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CHAPTERS = [
  {
    id: "chapter-1",
    title: "The City That Learned Too Fast",
    description: "Baseline distributions & drift detection",
  },
  {
    id: "chapter-2",
    title: "The Weather Event",
    description: "Covariate drift (when P(X) changes)",
  },
  {
    id: "chapter-3",
    title: "The Vanishing Commuter",
    description: "Concept drift (when P(Y|X) changes)",
  },
  {
    id: "chapter-4",
    title: "The Duel of Engines",
    description: "A/B testing, SRM detection, power analysis",
  },
  {
    id: "chapter-5",
    title: "The CUPED Control Tower",
    description: "Variance reduction & sequential testing",
  },
  {
    id: "chapter-6",
    title: "The City Restored",
    description: "Continuous monitoring, guardrails, observability",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className="toggle-icon" />
        <span className="toggle-icon" />
        <span className="toggle-icon" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar nav */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Chapters">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chapters</h2>
        </div>

        <ul className="chapters-list">
          {CHAPTERS.map(chapter => {
            const href = `/chapters/${chapter.id}`;
            const isActive = pathname === href;

            return (
              <li key={chapter.id}>
                <Link
                  href={href}
                  className={`chapter-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="chapter-link-content">
                    <div className="chapter-number">{CHAPTERS.indexOf(chapter) + 1}</div>
                    <div className="chapter-text">
                      <div className="chapter-link-title">{chapter.title}</div>
                      <div className="chapter-link-desc">{chapter.description}</div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <style>{`
        .sidebar-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-3);
          z-index: var(--z-fixed);
          position: fixed;
          top: var(--space-4);
          left: var(--space-4);
        }

        .toggle-icon {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--color-text);
          transition: all var(--duration-fast) var(--easing-ease-in-out);
          border-radius: 1px;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: var(--header-height);
          width: var(--sidebar-width);
          height: calc(100vh - var(--header-height));
          background-color: var(--color-sidebar);
          border-right: 1px solid var(--color-border);
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--space-6);
          transition: transform var(--duration-normal) var(--easing-ease-in-out);
          z-index: var(--z-dropdown);
        }

        .sidebar-header {
          margin-bottom: var(--space-6);
        }

        .sidebar-title {
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .chapters-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .chapter-link {
          display: block;
          padding: var(--nav-link-padding);
          border-radius: var(--nav-link-radius);
          color: var(--nav-link-text-color);
          text-decoration: none;
          transition: all var(--duration-fast) var(--easing-ease-in-out);
          border: 1px solid transparent;
          outline-offset: 2px;
        }

        .chapter-link:hover {
          background-color: var(--nav-link-hover-bg);
          border-color: var(--color-border-light);
        }

        .chapter-link:focus-visible {
          outline: 2px solid var(--color-blue);
        }

        .chapter-link.active {
          background-color: var(--color-bg);
          border-color: var(--color-blue);
          color: var(--nav-link-active-color);
          font-weight: var(--weight-semibold);
        }

        .chapter-link-content {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }

        .chapter-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background-color: var(--color-bg-secondary);
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
          color: var(--color-blue);
        }

        .chapter-link.active .chapter-number {
          background-color: var(--color-blue);
          color: var(--color-bg);
        }

        .chapter-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .chapter-link-title {
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          line-height: var(--leading-snug);
        }

        .chapter-link-desc {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          line-height: var(--leading-snug);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: calc(var(--z-dropdown) - 1);
        }

        /* Tablet and below */
        @media (max-width: 768px) {
          .sidebar-toggle {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--color-border);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
          }

          .chapter-link-title {
            font-size: var(--text-base);
          }

          .chapter-link-desc {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
