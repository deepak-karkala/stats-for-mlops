"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import { histogramSpecs, HistogramSpecKey } from "./specRegistry";

const DEFAULT_HISTOGRAM_SPEC_KEY: HistogramSpecKey = "baseline";

interface HistogramPanelProps {
  id: string;
  dataUrl: string;
  height?: number;
  specKey?: HistogramSpecKey;
  selectedFeature?: string;
}

export const HistogramPanel = ({
  id,
  dataUrl,
  specKey = DEFAULT_HISTOGRAM_SPEC_KEY,
  height = 360,
  selectedFeature = "trip_distance_km",
}: HistogramPanelProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const text = await response.text();
        const parsed = csvParse(text);
        setData(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dataUrl]);

  useEffect(() => {
    if (!isClient || !data || !plotRef.current || loading || error) return;

    // Extract feature values
    const values = data
      .map((row: any) => parseFloat(row[selectedFeature]))
      .filter((v: number) => !isNaN(v));

    const traceSpec =
      histogramSpecs[specKey] ?? histogramSpecs[DEFAULT_HISTOGRAM_SPEC_KEY];
    const plotSpec = traceSpec(values, selectedFeature);

    // Dynamically import and render Plotly
    const renderPlot = async () => {
      try {
        const Plotly = await import("plotly.js-dist-min");

        if (plotRef.current) {
          await Plotly.newPlot(
            plotRef.current,
            plotSpec.data,
            {
              ...plotSpec.layout,
              autosize: true,
            },
            {
              ...plotSpec.config,
              responsive: true,
            }
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
  }, [isClient, data, specKey, selectedFeature, loading, error]);

  if (loading) {
    return (
      <div className="histogram-panel" id={id}>
        <div className="histogram-loading">
          <p>Loading histogram data...</p>
        </div>
        <style jsx>{`
          .histogram-panel {
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
      <div className="histogram-panel" id={id}>
        <div className="histogram-error">
          <p>❌ Error loading histogram: {error}</p>
        </div>
        <style jsx>{`
          .histogram-panel {
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

  if (!data || data.length === 0) {
    return (
      <div className="histogram-panel" id={id}>
        <div className="histogram-empty">
          <p>No data available</p>
        </div>
        <style jsx>{`
          .histogram-panel {
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
    <div className="histogram-panel" id={id}>
      <div ref={plotRef} style={{ width: "100%", height: `${height}px` }} />
      <style jsx>{`
        .histogram-panel {
          margin: var(--space-6, 24px) 0;
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
          background-color: var(--color-bg, #ffffff);
          padding: var(--space-4, 16px);
        }
      `}</style>
    </div>
  );
};

export default HistogramPanel;
