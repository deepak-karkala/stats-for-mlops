"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";

interface HistogramCompareProps {
  id: string;
  referenceUrl: string;
  currentUrl: string;
  height?: number;
  features?: Array<{ label: string; value: string }>;
  defaultFeature?: string;
}

export const HistogramCompare = ({
  id,
  referenceUrl,
  currentUrl,
  height = 360,
  features = [
    { label: "trip_distance_km", value: "trip_distance_km" },
    { label: "surge_multiplier", value: "surge_multiplier" },
    { label: "fare_amount", value: "fare_amount" },
  ],
  defaultFeature = "trip_distance_km",
}: HistogramCompareProps) => {
  const [refData, setRefData] = useState<any>(null);
  const [curData, setCurData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState(defaultFeature);
  const plotRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [refResponse, curResponse] = await Promise.all([
          fetch(referenceUrl),
          fetch(currentUrl),
        ]);

        if (!refResponse.ok) {
          throw new Error(`Failed to load reference data: ${refResponse.statusText}`);
        }
        if (!curResponse.ok) {
          throw new Error(`Failed to load current data: ${curResponse.statusText}`);
        }

        const [refText, curText] = await Promise.all([
          refResponse.text(),
          curResponse.text(),
        ]);

        const refParsed = csvParse(refText);
        const curParsed = csvParse(curText);
        setRefData(refParsed);
        setCurData(curParsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [referenceUrl, currentUrl]);

  useEffect(() => {
    if (!isClient || !refData || !curData || !plotRef.current || loading || error) return;

    // Extract feature values from both datasets
    const refValues = refData
      .map((row: any) => parseFloat(row[selectedFeature]))
      .filter((v: number) => Number.isFinite(v));

    const curValues = curData
      .map((row: any) => parseFloat(row[selectedFeature]))
      .filter((v: number) => Number.isFinite(v));

    const plotSpec = {
      data: [
        {
          type: "histogram" as const,
          x: refValues,
          nbinsx: 40,
          name: "Baseline",
          opacity: 0.5,
          marker: { color: "#00D8FF" },
          hovertemplate: `${selectedFeature}: %{x:.2f}<br>count: %{y}<extra></extra>`,
        },
        {
          type: "histogram" as const,
          x: curValues,
          nbinsx: 40,
          name: "Rainstorm",
          opacity: 0.5,
          marker: { color: "#FFB347" },
          hovertemplate: `${selectedFeature}: %{x:.2f}<br>count: %{y}<extra></extra>`,
        },
      ],
      layout: {
        barmode: "overlay" as const,
        height,
        margin: { t: 10, r: 10, b: 40, l: 50 },
        xaxis: { title: selectedFeature },
        yaxis: { title: "count" },
        bargap: 0.05,
        legend: { orientation: "h" as const, x: 0, y: 1.1 },
      },
      config: { displayModeBar: false, responsive: true },
    };

    // Dynamically import and render Plotly
    const renderPlot = async () => {
      try {
        const Plotly = await import("plotly.js-dist-min");

        if (plotRef.current) {
          await Plotly.newPlot(
            plotRef.current,
            plotSpec.data,
            plotSpec.layout,
            plotSpec.config
          );
        }
      } catch (err) {
        console.error("Error rendering plot:", err);
        setError("Failed to render chart");
      }
    };

    renderPlot();

    // Cleanup
    return () => {
      if (plotRef.current) {
        plotRef.current.innerHTML = "";
      }
    };
  }, [isClient, refData, curData, selectedFeature, loading, error, height]);

  if (loading) {
    return (
      <div className="histogram-compare" id={id}>
        <div className="histogram-loading">
          <p>Loading histogram data...</p>
        </div>
        <style jsx>{`
          .histogram-compare {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
          }
          .histogram-loading {
            padding: var(--space-8, 32px);
            text-align: center;
            color: var(--color-text-secondary, #6b7280);
            min-height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="histogram-compare" id={id}>
        <div className="histogram-error">
          <p>❌ Error loading histogram: {error}</p>
        </div>
        <style jsx>{`
          .histogram-compare {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
          }
          .histogram-error {
            padding: var(--space-8, 32px);
            text-align: center;
            color: var(--color-red, #dc2626);
            min-height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  if (!refData || !curData || refData.length === 0 || curData.length === 0) {
    return (
      <div className="histogram-compare" id={id}>
        <div className="histogram-empty">
          <p>No data available</p>
        </div>
        <style jsx>{`
          .histogram-compare {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
          }
          .histogram-empty {
            padding: var(--space-8, 32px);
            text-align: center;
            color: var(--color-text-secondary, #6b7280);
            min-height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="histogram-compare" id={id}>
      <div className="histogram-controls">
        <label className="histogram-label">Select feature:</label>
        <div className="histogram-buttons">
          {features.map((feature) => (
            <button
              key={feature.value}
              className={`histogram-button ${selectedFeature === feature.value ? "active" : ""}`}
              onClick={() => setSelectedFeature(feature.value)}
            >
              {feature.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={plotRef} style={{ width: "100%", height: `${height}px` }} />
      <style jsx>{`
        .histogram-compare {
          margin: var(--space-6, 24px) 0;
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
          background-color: var(--color-bg, #ffffff);
          padding: var(--space-4, 16px);
        }

        .histogram-controls {
          margin-bottom: var(--space-4, 16px);
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 8px);
        }

        .histogram-label {
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-medium, 500);
          color: var(--color-text-secondary, #6b7280);
        }

        .histogram-buttons {
          display: flex;
          gap: var(--space-2, 8px);
          flex-wrap: wrap;
        }

        .histogram-button {
          padding: var(--space-2, 8px) var(--space-3, 12px);
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-medium, 500);
          color: var(--color-text-secondary, #6b7280);
          background-color: var(--color-bg, #ffffff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          transition: all 0.2s;
        }

        .histogram-button:hover {
          border-color: var(--color-blue, #00d8ff);
          color: var(--color-text, #111827);
        }

        .histogram-button.active {
          background-color: var(--color-blue, #00d8ff);
          border-color: var(--color-blue, #00d8ff);
          color: #ffffff;
        }

        .histogram-button:focus-visible {
          outline: 2px solid var(--color-blue, #00d8ff);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default HistogramCompare;
