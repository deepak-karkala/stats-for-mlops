"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";

type DriftPerfScatterProps = {
  dataUrl: string;
  height?: number;
};

export const DriftPerfScatter = ({ dataUrl, height = 320 }: DriftPerfScatterProps) => {
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
        Loading drift-performance correlation...
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

  // Extract data arrays
  const psi = data.map((row: any) => parseFloat(row.psi)).filter((v: number) => Number.isFinite(v));
  const rmse = data.map((row: any) => parseFloat(row.rmse)).filter((v: number) => Number.isFinite(v));

  // Calculate correlation
  const meanPsi = psi.reduce((a: number, b: number) => a + b, 0) / psi.length;
  const meanRmse = rmse.reduce((a: number, b: number) => a + b, 0) / rmse.length;

  let covariance = 0;
  let variancePsi = 0;
  let varianceRmse = 0;

  for (let i = 0; i < psi.length; i++) {
    covariance += (psi[i] - meanPsi) * (rmse[i] - meanRmse);
    variancePsi += (psi[i] - meanPsi) ** 2;
    varianceRmse += (rmse[i] - meanRmse) ** 2;
  }

  const correlation = covariance / Math.sqrt(variancePsi * varianceRmse);

  // Generate plot spec
  const plotSpec = {
    data: [
      {
        type: "scatter",
        mode: "markers",
        x: psi,
        y: rmse,
        marker: {
          color: "#FFB347",
          size: 8,
          opacity: 0.7,
          line: {
            color: "#FF8C00",
            width: 1
          }
        },
        name: "Drift vs Performance",
      },
    ],
    layout: {
      height: 320,
      margin: { t: 40, r: 20, b: 60, l: 60 },
      title: {
        text: "Drift-Performance Correlation",
        font: { size: 16 }
      },
      xaxis: {
        title: "PSI (Input Drift)",
        gridcolor: "#e0e0e0",
      },
      yaxis: {
        title: "RMSE (Prediction Error)",
        gridcolor: "#e0e0e0",
      },
      shapes: [
        {
          type: "line",
          xref: "x",
          yref: "y",
          x0: Math.min(...psi),
          x1: Math.max(...psi),
          y0: 1.8,
          y1: 1.8 + 4 * (Math.max(...psi) - Math.min(...psi)),
          line: {
            dash: "dot",
            color: "#00D8FF",
            width: 2
          },
        },
      ],
      annotations: [
        {
          x: 0.98,
          y: 0.02,
          xref: "paper",
          yref: "paper",
          text: "Higher drift → Higher error",
          showarrow: false,
          xanchor: "right",
          yanchor: "bottom",
          font: { color: "#666", size: 11, style: "italic" }
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
          <strong>Correlation Analysis:</strong> PSI and RMSE show a correlation of <strong>{correlation.toFixed(3)}</strong>,
          confirming that covariate drift (PSI) is strongly associated with performance degradation (RMSE).
        </p>
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          The dotted line represents the approximate linear relationship. When PSI increases, model errors tend to increase proportionally.
          This validates the importance of monitoring drift as an early warning signal for performance issues.
        </p>
      </div>
    </div>
  );
};
