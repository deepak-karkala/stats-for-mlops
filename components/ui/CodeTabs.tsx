"use client";

import { ReactNode, useState } from "react";

interface CodeTab {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
}

export const CodeTabs = ({ tabs }: CodeTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="code-tabs">
      <div className="code-tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`code-tabs-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="code-tabs-content">
        <pre className={`language-${tabs[activeTab].language}`}>
          <code>{tabs[activeTab].code}</code>
        </pre>
      </div>

      <style jsx>{`
        .code-tabs {
          margin: var(--space-6, 24px) 0;
          border-radius: var(--radius-md, 8px);
          overflow: hidden;
          border: 1px solid var(--color-border, #e5e7eb);
          background-color: var(--color-bg-secondary, #f9fafb);
        }

        .code-tabs-header {
          display: flex;
          gap: 0;
          background-color: var(--color-bg-secondary, #f3f4f6);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          overflow-x: auto;
        }

        .code-tabs-button {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          background: transparent;
          border: none;
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-medium, 500);
          color: var(--color-text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .code-tabs-button:hover {
          color: var(--color-text, #111827);
          background-color: rgba(0, 0, 0, 0.02);
        }

        .code-tabs-button.active {
          color: var(--color-blue, #00d8ff);
          border-bottom-color: var(--color-blue, #00d8ff);
          background-color: var(--color-bg, #ffffff);
        }

        .code-tabs-content {
          padding: 0;
          background-color: var(--code-bg, #1e1e1e);
        }

        .code-tabs-content pre {
          margin: 0;
          padding: var(--space-4, 16px);
          overflow-x: auto;
          font-size: var(--text-sm, 14px);
          line-height: 1.6;
          color: #d4d4d4;
        }

        .code-tabs-content code {
          background: transparent;
          padding: 0;
          border-radius: 0;
          color: inherit;
        }
      `}</style>
    </div>
  );
};

export default CodeTabs;
