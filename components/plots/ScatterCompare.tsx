"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import scatterCompareSpec from "@/app/chapters/chapter-3/plots/scatterCompareSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface ScatterCompareProps {
  id?: string;
  referenceUrl: string;
  currentUrl: string;
  xField: string;
  yField: string;
  height?: number;
}

export const ScatterCompare = ({
  id = "scatter-compare",
  referenceUrl,
  currentUrl,
  xField,
  yField,
  height = 360,
}: ScatterCompareProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<{
    refX: number[];
    refY: number[];
    curX: number[];
    curY: number[];
  }>({ refX: [], refY: [], curX: [], curY: [] });

  useEffect(() => {
    if (!isVisible) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [refResponse, curResponse] = await Promise.all([
          fetch(referenceUrl, { cache: "force-cache" }),
          fetch(currentUrl, { cache: "force-cache" }),
        ]);

        if (!refResponse.ok || !curResponse.ok) {
          throw new Error("Failed to load scatter data");
        }

        const [refText, curText] = await Promise.all([refResponse.text(), curResponse.text()]);
        const refRows = csvParse(refText);
        const curRows = csvParse(curText);

        const refX = refRows
          .map(row => parseFloat((row as Record<string, string>)[xField]))
          .filter(Number.isFinite);
        const refY = refRows
          .map(row => parseFloat((row as Record<string, string>)[yField]))
          .filter(Number.isFinite);
        const curX = curRows
          .map(row => parseFloat((row as Record<string, string>)[xField]))
          .filter(Number.isFinite);
        const curY = curRows
          .map(row => parseFloat((row as Record<string, string>)[yField]))
          .filter(Number.isFinite);

        if (!refX.length && !curX.length) {
          throw new Error("No valid scatter data for the requested fields");
        }

        setSeries({ refX, refY, curX, curY });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUrl, referenceUrl, xField, yField, isVisible]);

  const plotSpec = useMemo(() => {
    if (!series.refX.length && !series.curX.length) return null;
    return scatterCompareSpec(series.refX, series.refY, series.curX, series.curY, height);
  }, [series, height]);

  if (loading) {
    return (
      <div className="scatter-compare" id={id} ref={containerRef}>
        <div className="scatter-loading">
          <p>Loading scatter plot...</p>
        </div>
        <style jsx>{`
          .scatter-compare {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .scatter-loading {
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
      <div className="scatter-compare" id={id} ref={containerRef}>
        <div className="scatter-error">
          <p>Error: {error ?? "Unable to render scatter plot"}</p>
        </div>
        <style jsx>{`
          .scatter-compare {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .scatter-error {
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
    <div className="scatter-compare" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, displayModeBar: false, responsive: true }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .scatter-compare {
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

export default ScatterCompare;
