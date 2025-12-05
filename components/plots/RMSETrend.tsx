"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import rmseTrendSpec from "@/app/chapters/chapter-3/plots/rmseTrendSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface RMSETrendProps {
  id?: string;
  dataUrl: string;
  height?: number;
}

export const RMSETrend = ({
  id = "rmse-trend",
  dataUrl,
  height = 280,
}: RMSETrendProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [plotData, setPlotData] = useState<{ dates: string[]; rmse: number[]; mae: number[] }>({
    dates: [],
    rmse: [],
    mae: [],
  });

  useEffect(() => {
    if (!isVisible) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(dataUrl, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }

        const text = await response.text();
        const data = csvParse(text);

        const dates = data.map(row => row.date as string).filter(Boolean);
        const rmse = data
          .map(row => parseFloat((row as Record<string, string>).rmse))
          .filter(Number.isFinite);
        const mae = data
          .map(row => parseFloat((row as Record<string, string>).mae))
          .filter(Number.isFinite);

        if (!dates.length || !rmse.length) {
          throw new Error("No RMSE data found in CSV");
        }

        setPlotData({ dates, rmse, mae });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, isVisible]);

  const plotSpec = useMemo(() => {
    if (!plotData.dates.length) return null;
    return rmseTrendSpec(plotData.dates, plotData.rmse, plotData.mae, height);
  }, [plotData, height]);

  if (loading) {
    return (
      <div className="rmse-trend" id={id} ref={containerRef}>
        <div className="rmse-loading">
          <p>Loading RMSE trend...</p>
        </div>
        <style jsx>{`
          .rmse-trend {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .rmse-loading {
            padding: var(--space-8);
            text-align: center;
            color: var(--color-text-secondary);
            min-height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  if (error || !plotSpec) {
    return (
      <div className="rmse-trend" id={id} ref={containerRef}>
        <div className="rmse-error">
          <p>Error: {error ?? "Unable to render RMSE chart"}</p>
        </div>
        <style jsx>{`
          .rmse-trend {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .rmse-error {
            padding: var(--space-8);
            text-align: center;
            color: var(--color-red);
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
    <div className="rmse-trend" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, responsive: true, displayModeBar: false }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .rmse-trend {
          margin: var(--space-6) 0;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          padding: var(--space-4);
        }
      `}</style>
    </div>
  );
};

export default RMSETrend;
