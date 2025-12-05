"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";

type SequentialChartProps = {
  dataUrl: string;
  height?: number;
};

export const SequentialChart = ({ dataUrl, height = 320 }: SequentialChartProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);

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

  if (loading) {
    return (
      <div
        style={{
          height: height + 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "var(--radius)",
        }}
      >
        Loading sequential test data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: height + 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "var(--radius)",
          color: "var(--color-error)",
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!isClient || !data) {
    return (
      <div
        style={{
          height: height + 80,
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "var(--radius)",
        }}
      />
    );
  }

  // Extract n and p_value arrays from data
  const n = data
    .map((row: any) => parseFloat(row.n))
    .filter((v: number) => Number.isFinite(v));

  const pValues = data
    .map((row: any) => parseFloat(row.p_value))
    .filter((v: number) => Number.isFinite(v));

  // Find when p-value first crosses significance thresholds
  const firstSignificantAt005 = data.findIndex((row: any) => parseFloat(row.p_value) < 0.05);
  const firstSignificantAt001 = data.findIndex((row: any) => parseFloat(row.p_value) < 0.01);

  // Generate plot spec
  const plotSpec = {
    data: [
      {
        type: "scatter",
        mode: "lines+markers",
        x: n,
        y: pValues,
        line: { color: "#FFB347", width: 3 },
        marker: { color: "#FFB347", size: 6 },
        name: "p-value evolution",
      },
    ],
    layout: {
      height: 320,
      margin: { t: 30, r: 20, b: 60, l: 70 },
      title: { text: "Sequential Test: P-value Evolution", font: { size: 16 } },
      xaxis: { title: "Samples per Group", gridcolor: "#e0e0e0" },
      yaxis: { title: "P-value", range: [0, Math.max(0.15, Math.max(...pValues) * 1.1)], gridcolor: "#e0e0e0" },
      shapes: [
        {
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          y0: 0.05,
          y1: 0.05,
          line: { dash: "dot", color: "#00D8FF", width: 2 },
        },
        {
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          y0: 0.01,
          y1: 0.01,
          line: { dash: "dot", color: "#1E88E5", width: 2 },
        },
      ],
      annotations: [
        { x: 0.98, y: 0.05, xref: "paper", yref: "y", text: "α = 0.05", showarrow: false, xanchor: "right", font: { color: "#00D8FF", size: 11 } },
        { x: 0.98, y: 0.01, xref: "paper", yref: "y", text: "α = 0.01", showarrow: false, xanchor: "right", font: { color: "#1E88E5", size: 11 } }
      ],
      showlegend: true,
      legend: { x: 0.02, y: 0.98, xanchor: "left", yanchor: "top" },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    },
    config: { displayModeBar: false, responsive: true },
  };

  return (
    <div
      style={{
        marginBottom: "var(--space-4)",
        padding: "var(--space-3)",
        backgroundColor: "var(--color-bg-secondary)",
        borderRadius: "var(--radius)",
      }}
    >
      <div ref={plotRef}>
        <Plot {...plotSpec} style={{ width: "100%", height: "auto" }} />
      </div>

      <div
        style={{
          marginTop: "var(--space-2)",
          padding: "var(--space-2)",
          backgroundColor: "var(--color-bg)",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--text-sm)",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Interpretation:</strong> This chart shows how the p-value evolves as more samples are collected.
          The dashed lines represent significance thresholds (α = 0.05 and α = 0.01).
        </p>
        <ul style={{ margin: "var(--space-1) 0 0 0", paddingLeft: "var(--space-3)" }}>
          <li>
            <strong>Orange line:</strong> P-value evolution over time
          </li>
          <li>
            <strong>Blue dashed line:</strong> α = 0.05 threshold
          </li>
          <li>
            <strong>Dark blue dashed line:</strong> α = 0.01 threshold
          </li>
        </ul>
        {firstSignificantAt005 >= 0 && (
          <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            P-value first crossed 0.05 at n = {n[firstSignificantAt005].toLocaleString()} samples per group.
            {firstSignificantAt001 >= 0 && ` Crossed 0.01 at n = ${n[firstSignificantAt001].toLocaleString()}.`}
          </p>
        )}
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Sequential testing allows early stopping when evidence is overwhelming, typically 30-40% faster than fixed-horizon tests while controlling Type I error.
        </p>
      </div>
    </div>
  );
};
