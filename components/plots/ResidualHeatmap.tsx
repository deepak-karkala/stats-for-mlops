"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import residualHeatSpec from "@/app/chapters/chapter-3/plots/residualHeatSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface ResidualHeatmapProps {
  id?: string;
  dataUrl: string;
  zoneField: string;
  hourField: string;
  residualField: string;
  height?: number;
}

export const ResidualHeatmap = ({
  id = "residual-heatmap",
  dataUrl,
  zoneField,
  hourField,
  residualField,
  height = 400,
}: ResidualHeatmapProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [matrixData, setMatrixData] = useState<{
    zones: string[];
    hours: number[];
    matrix: number[][];
  }>({ zones: [], hours: [], matrix: [] });

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

        const zoneSet = new Set<string>();
        const hourSet = new Set<number>();

        data.forEach(row => {
          const zone = (row as Record<string, string>)[zoneField];
          const hour = parseInt((row as Record<string, string>)[hourField], 10);
          if (zone) zoneSet.add(zone);
          if (Number.isFinite(hour)) hourSet.add(hour);
        });

        const zones = Array.from(zoneSet).sort();
        const hours = Array.from(hourSet).sort((a, b) => a - b);

        if (!zones.length || !hours.length) {
          throw new Error("No residual data available");
        }

        const matrix: number[][] = zones.map(() => Array(hours.length).fill(0));
        const zoneMap = Object.fromEntries(zones.map((z, i) => [z, i]));
        const hourMap = Object.fromEntries(hours.map((h, i) => [h, i]));

        data.forEach(row => {
          const zoneIdx = zoneMap[(row as Record<string, string>)[zoneField]];
          const hourIdx = hourMap[parseInt((row as Record<string, string>)[hourField], 10)];
          if (zoneIdx !== undefined && hourIdx !== undefined) {
            matrix[zoneIdx][hourIdx] =
              parseFloat((row as Record<string, string>)[residualField]) || 0;
          }
        });

        setMatrixData({ zones, hours, matrix });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, hourField, residualField, zoneField, isVisible]);

  const plotSpec = useMemo(() => {
    if (!matrixData.zones.length) return null;
    return residualHeatSpec(matrixData.matrix, matrixData.zones, matrixData.hours, height);
  }, [matrixData, height]);

  if (loading) {
    return (
      <div className="residual-heatmap" id={id} ref={containerRef}>
        <div className="heatmap-loading">
          <p>Loading heatmap...</p>
        </div>
        <style jsx>{`
          .residual-heatmap {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .heatmap-loading {
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
      <div className="residual-heatmap" id={id} ref={containerRef}>
        <div className="heatmap-error">
          <p>Error: {error ?? "Unable to render residual heatmap"}</p>
        </div>
        <style jsx>{`
          .residual-heatmap {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .heatmap-error {
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
    <div className="residual-heatmap" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, responsive: true, displayModeBar: false }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .residual-heatmap {
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

export default ResidualHeatmap;
