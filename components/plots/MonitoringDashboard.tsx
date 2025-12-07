"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";

type MonitoringDashboardProps = {
  dataUrl: string;
  height?: number;
};

export const MonitoringDashboard = ({ dataUrl, height = 350 }: MonitoringDashboardProps) => {
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
          height: height + 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "var(--radius)",
        }}
      >
        Loading monitoring dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: height + 100,
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
          height: height + 100,
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "var(--radius)",
        }}
      />
    );
  }

  // Extract data arrays
  const dates = data.map((row: any) => row.date);
  const psi = data.map((row: any) => parseFloat(row.psi)).filter((v: number) => Number.isFinite(v));
  const rmse = data.map((row: any) => parseFloat(row.rmse)).filter((v: number) => Number.isFinite(v));

  // Calculate summary statistics
  const avgPsi = psi.reduce((a: number, b: number) => a + b, 0) / psi.length;
  const avgRmse = rmse.reduce((a: number, b: number) => a + b, 0) / rmse.length;
  const maxPsi = Math.max(...psi);
  const maxRmse = Math.max(...rmse);
  const psiExceeded = psi.filter((v: number) => v > 0.25).length;

  // Generate plot spec
  const plotSpec = {
    data: [
      {
        type: "scatter",
        mode: "lines+markers",
        x: dates,
        y: psi,
        name: "PSI (Drift)",
        line: { color: "#00D8FF", width: 2 },
        marker: { size: 6 },
      },
      {
        type: "scatter",
        mode: "lines+markers",
        x: dates,
        y: rmse,
        name: "RMSE (Error)",
        yaxis: "y2",
        line: { color: "#FFB347", width: 3 },
        marker: { size: 6 },
      },
    ],
    layout: {
      height: 350,
      margin: { t: 40, r: 70, b: 60, l: 60 },
      title: {
        text: "Model Health: Drift & Performance Metrics",
        font: { size: 16 }
      },
      xaxis: {
        title: "Date",
        gridcolor: "#e0e0e0",
      },
      yaxis: {
        title: "PSI (Population Stability Index)",
        range: [0, 0.4],
        gridcolor: "#e0e0e0",
      },
      yaxis2: {
        title: "RMSE (Root Mean Squared Error)",
        overlaying: "y",
        side: "right",
        range: [1, 3.5],
        gridcolor: "#f0f0f0",
      },
      shapes: [
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: 0.25,
          y1: 0.25,
          line: {
            dash: "dot",
            color: "#00D8FF",
            width: 2
          },
        },
      ],
      annotations: [
        {
          x: 0.02,
          y: 0.25,
          xref: "paper",
          yref: "y",
          text: "PSI Threshold (0.25)",
          showarrow: false,
          xanchor: "left",
          yanchor: "bottom",
          font: { color: "#00D8FF", size: 10 }
        }
      ],
      legend: {
        orientation: "h",
        x: 0.02,
        xanchor: "left",
        y: -0.25,
        yanchor: "top",
      },
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
          <strong>Monitoring Summary:</strong> This dashboard tracks model health over time using drift detection (PSI) and performance metrics (RMSE).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
          <div>
            <strong>PSI Stats:</strong>
            <ul style={{ margin: "var(--space-1) 0 0 0", paddingLeft: "var(--space-3)", fontSize: "var(--text-xs)" }}>
              <li>Average: {avgPsi.toFixed(3)}</li>
              <li>Max: {maxPsi.toFixed(3)}</li>
              <li>Threshold breaches: {psiExceeded} days</li>
            </ul>
          </div>
          <div>
            <strong>RMSE Stats:</strong>
            <ul style={{ margin: "var(--space-1) 0 0 0", paddingLeft: "var(--space-3)", fontSize: "var(--text-xs)" }}>
              <li>Average: {avgRmse.toFixed(2)}</li>
              <li>Max: {maxRmse.toFixed(2)}</li>
              <li>Trend: {maxRmse > avgRmse * 1.2 ? "⚠️ Degrading" : "✓ Stable"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
