import { ReactNode } from "react";

interface AsideProps {
  children: ReactNode;
  type?: "info" | "warning" | "tip" | "note" | "calm";
  tone?: "info" | "warning" | "tip" | "note" | "calm";
}

export const Aside = ({ children, type, tone }: AsideProps) => {
  const asideType = tone || type || "info";
  const icons = {
    info: "💡",
    warning: "⚠️",
    tip: "✨",
    note: "📝",
    calm: "🌆",
  };

  return (
    <aside className={`aside aside-${asideType}`}>
      <span className="aside-icon">{icons[asideType]}</span>
      <div className="aside-content">{children}</div>

      <style>{`
        .aside {
          margin: var(--space-6) 0;
          padding: var(--space-4);
          border-left: 4px solid var(--color-blue);
          background-color: rgba(0, 216, 255, 0.05);
          border-radius: var(--radius-md);
          display: flex;
          gap: var(--space-3);
        }

        .aside-info {
          border-color: var(--color-blue);
          background-color: rgba(0, 216, 255, 0.05);
        }

        .aside-warning {
          border-color: var(--color-amber);
          background-color: rgba(255, 179, 71, 0.05);
        }

        .aside-tip {
          border-color: var(--color-green);
          background-color: rgba(50, 205, 50, 0.05);
        }

        .aside-note {
          border-color: var(--color-text-secondary);
          background-color: var(--color-bg-secondary);
        }

        .aside-calm {
          border-color: var(--color-blue);
          background-color: rgba(0, 216, 255, 0.03);
        }

        .aside-icon {
          font-size: var(--text-xl);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
        }

        .aside-content {
          flex: 1;
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }

        .aside-content p {
          margin: 0;
        }

        .aside-content p + p {
          margin-top: var(--space-2);
        }
      `}</style>
    </aside>
  );
};

interface CalloutProps {
  children: ReactNode;
  heading?: string;
  title?: string;
}

export const Callout = ({ children, heading, title }: CalloutProps) => {
  const calloutTitle = title || heading;
  return (
    <div className="callout">
      {calloutTitle && <h4 className="callout-heading">{calloutTitle}</h4>}
      <div className="callout-body">{children}</div>

      <style>{`
        .callout {
          margin: var(--space-6) 0;
          padding: var(--space-6);
          background: linear-gradient(
            135deg,
            var(--color-bg-secondary) 0%,
            var(--color-bg-tertiary) 100%
          );
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }

        .callout-heading {
          margin: 0 0 var(--space-3) 0;
          font-size: var(--text-lg);
          font-weight: var(--weight-semibold);
          color: var(--color-text);
        }

        .callout-body {
          font-size: var(--text-base);
          color: var(--color-text);
          line-height: var(--leading-relaxed);
        }

        .callout-body p {
          margin: 0;
        }

        .callout-body p + p {
          margin-top: var(--space-3);
        }

        .callout-body ul,
        .callout-body ol {
          margin: var(--space-3) 0 0 var(--space-6);
        }
      `}</style>
    </div>
  );
};

interface FigureProps {
  children: ReactNode;
  caption?: string;
  alt?: string;
}

export const Figure = ({ children, caption, alt }: FigureProps) => {
  return (
    <figure className="figure" role="doc-figure">
      <div className="figure-content">{children}</div>
      {caption && (
        <figcaption className="figure-caption">
          {alt && <span className="sr-only">{alt}:</span>} {caption}
        </figcaption>
      )}

      <style>{`
        .figure {
          margin: var(--space-8) 0;
          text-align: center;
        }

        .figure-content {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-4);
        }

        .figure-content img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .figure-caption {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          font-style: italic;
          line-height: var(--leading-relaxed);
          margin: 0;
        }
      `}</style>
    </figure>
  );
};

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ children, language = "text", title }: CodeBlockProps) => {
  return (
    <div className="code-block">
      {title && <div className="code-block-title">{title}</div>}
      <pre className={`code-block-pre language-${language}`}>
        <code>{children}</code>
      </pre>

      <style>{`
        .code-block {
          margin: var(--space-6) 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--code-bg);
        }

        .code-block-title {
          padding: var(--space-3) var(--space-4);
          background-color: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .code-block-pre {
          margin: 0 !important;
          padding: var(--code-padding) !important;
          font-size: var(--code-font-size) !important;
          line-height: var(--code-line-height) !important;
          overflow-x: auto;
        }

        .code-block-pre code {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
};

// Import UI components
import CodeTabs from "../ui/CodeTabs";
import DataTable from "../ui/DataTable";
import ToggleGroup from "../ui/ToggleGroup";

// Import plot components
import HistogramPanel from "../plots/HistogramPanel";
import HistogramPanelWithToggle from "../plots/HistogramPanelWithToggle";
import HistogramCompare from "../plots/HistogramCompare";
import DriftGauge from "../plots/DriftGauge";
import ScatterCompare from "../plots/ScatterCompare";
import RMSETrend from "../plots/RMSETrend";
import ResidualHeatmap from "../plots/ResidualHeatmap";

export const mdxComponents = {
  Aside,
  Callout,
  Figure,
  CodeBlock,
  CodeTabs,
  DataTable,
  ToggleGroup,
  HistogramPanel,
  HistogramPanelWithToggle,
  HistogramCompare,
  DriftGauge,
  ScatterCompare,
  RMSETrend,
  ResidualHeatmap,
};
