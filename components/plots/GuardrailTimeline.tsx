"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";

type GuardrailTimelineProps = {
  dataUrl: string;
  height?: number;
};

export const GuardrailTimeline = ({ dataUrl, height = 320 }: GuardrailTimelineProps) => {
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
        Loading guardrail timeline...
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
  const status = data.map((row: any) => row.status);

  // Color mapping
  const colorMap: { [k: string]: string } = {
    ok: "#00D8FF",
    warn: "#FFB347",
    rollback: "#FF6347",
    recovered: "#32CD32",
  };

  // Count status types
  const statusCounts = status.reduce((acc: any, s: string) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Generate plot spec
  const plotSpec = {
    data: [
      {
        type: "scatter",
        mode: "markers",
        x: dates,
        y: rmse,
        marker: {
          color: status.map((s: string) => colorMap[s] || "#999"),
          size: 12,
          line: {
            color: "#fff",
            width: 2
          }
        },
        text: status.map((s: string, i: number) => `${s.toUpperCase()}<br>PSI: ${psi[i].toFixed(3)}<br>RMSE: ${rmse[i].toFixed(2)}`),
        hovertemplate: "%{text}<extra></extra>",
        name: "Guardrail Status",
      },
    ],
    layout: {
      height: 320,
      margin: { t: 40, r: 20, b: 80, l: 60 },
      title: {
        text: "Guardrail Events Timeline",
        font: { size: 16 }
      },
      xaxis: {
        title: "Date",
        gridcolor: "#e0e0e0",
      },
      yaxis: {
        title: "RMSE (Prediction Error)",
        gridcolor: "#e0e0e0",
      },
      shapes: [
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: 2.7,
          y1: 2.7,
          line: {
            dash: "dot",
            color: "#FF6347",
            width: 2
          },
        },
      ],
      annotations: [
        {
          x: 0.5,
          y: -0.25,
          xref: "paper",
          yref: "paper",
          text: "🔵 OK   🟡 Warning   🔴 Rollback   🟢 Recovered",
          showarrow: false,
          xanchor: "center",
          font: { size: 12 }
        },
        {
          x: 0.98,
          y: 2.7,
          xref: "paper",
          yref: "y",
          text: "Rollback Threshold",
          showarrow: false,
          xanchor: "right",
          yanchor: "bottom",
          font: { color: "#FF6347", size: 10 }
        }
      ],
      showlegend: false,
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
          <strong>Guardrail System:</strong> Automated checks monitor model health and trigger actions when thresholds are breached.
        </p>
        <div style={{ marginTop: "var(--space-2)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "bold", color: "#00D8FF" }}>{statusCounts.ok || 0}</div>
            <div style={{ color: "var(--color-text-secondary)" }}>OK</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "bold", color: "#FFB347" }}>{statusCounts.warn || 0}</div>
            <div style={{ color: "var(--color-text-secondary)" }}>Warnings</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "bold", color: "#FF6347" }}>{statusCounts.rollback || 0}</div>
            <div style={{ color: "var(--color-text-secondary)" }}>Rollbacks</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "bold", color: "#32CD32" }}>{statusCounts.recovered || 0}</div>
            <div style={{ color: "var(--color-text-secondary)" }}>Recovered</div>
          </div>
        </div>
        <p style={{ margin: "var(--space-2) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Guardrails provide automatic protection: warnings alert teams, rollbacks revert to safe versions, and recovery confirms fixes.
        </p>
      </div>
    </div>
  );
};
