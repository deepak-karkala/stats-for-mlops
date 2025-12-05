"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import { abDistributionSpec } from "@/app/chapters/chapter-4/plots/abDistributionSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface ABDistributionProps {
  id?: string;
  dataUrl: string;
  height?: number;
}

export const ABDistribution = ({ id = "ab-distribution", dataUrl, height = 360 }: ABDistributionProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<{
    controlRevenue: number[];
    treatmentRevenue: number[];
  }>({ controlRevenue: [], treatmentRevenue: [] });

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
        const rows = csvParse(text);

        const controlRevenue = rows
          .filter((row: any) => row.variant === "control")
          .map((row: any) => parseFloat(row.revenue_per_ride))
          .filter(Number.isFinite);

        const treatmentRevenue = rows
          .filter((row: any) => row.variant === "treatment")
          .map((row: any) => parseFloat(row.revenue_per_ride))
          .filter(Number.isFinite);

        if (!controlRevenue.length || !treatmentRevenue.length) {
          throw new Error("No valid revenue data for control or treatment");
        }

        setSeries({ controlRevenue, treatmentRevenue });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, isVisible]);

  const plotSpec = useMemo(() => {
    if (!series.controlRevenue.length || !series.treatmentRevenue.length) return null;
    return abDistributionSpec(series.controlRevenue, series.treatmentRevenue, height);
  }, [series, height]);

  if (loading) {
    return (
      <div className="ab-distribution" id={id} ref={containerRef}>
        <div className="ab-loading">
          <p>Loading distribution...</p>
        </div>
        <style jsx>{`
          .ab-distribution {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .ab-loading {
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
      <div className="ab-distribution" id={id} ref={containerRef}>
        <div className="ab-error">
          <p>Error: {error ?? "Unable to render distribution"}</p>
        </div>
        <style jsx>{`
          .ab-distribution {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .ab-error {
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
    <div className="ab-distribution" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, responsive: true, displayModeBar: false }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .ab-distribution {
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

export default ABDistribution;
