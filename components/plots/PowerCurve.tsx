"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import { powerCurveSpec } from "@/app/chapters/chapter-4/plots/powerCurveSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface PowerCurveProps {
  id?: string;
  dataUrl: string;
  height?: number;
}

export const PowerCurve = ({ id = "power-curve", dataUrl, height = 360 }: PowerCurveProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [curveData, setCurveData] = useState<{
    sampleSizes: number[];
    powers: number[];
  }>({ sampleSizes: [], powers: [] });

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

        const sampleSizes = rows
          .map((row: any) => parseFloat(row.sample_size_per_group))
          .filter(Number.isFinite);

        const powers = rows
          .map((row: any) => parseFloat(row.power))
          .filter(Number.isFinite);

        if (!sampleSizes.length || !powers.length) {
          throw new Error("No valid power curve data");
        }

        setCurveData({ sampleSizes, powers });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, isVisible]);

  const plotSpec = useMemo(() => {
    if (!curveData.sampleSizes.length || !curveData.powers.length) return null;
    return powerCurveSpec(curveData.sampleSizes, curveData.powers, height);
  }, [curveData, height]);

  if (loading) {
    return (
      <div className="power-curve" id={id} ref={containerRef}>
        <div className="power-loading">
          <p>Loading power curve...</p>
        </div>
        <style jsx>{`
          .power-curve {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .power-loading {
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
      <div className="power-curve" id={id} ref={containerRef}>
        <div className="power-error">
          <p>Error: {error ?? "Unable to render power curve"}</p>
        </div>
        <style jsx>{`
          .power-curve {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .power-error {
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
    <div className="power-curve" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, responsive: true, displayModeBar: false }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .power-curve {
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

export default PowerCurve;
