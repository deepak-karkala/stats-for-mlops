"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";

type CUPEDDemoProps = {
  dataUrl: string;
  height?: number;
};

export const CUPEDDemo = ({ dataUrl, height = 300 }: CUPEDDemoProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rho, setRho] = useState(0.7); // Correlation slider value
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

  // Calculate actual variance reduction from data
  const calculateActualReduction = () => {
    if (!data || data.length === 0) return 0;

    const preMetric = data.map((row: any) => parseFloat(row.pre_metric)).filter((v: number) => Number.isFinite(v));
    const postMetric = data.map((row: any) => parseFloat(row.post_metric)).filter((v: number) => Number.isFinite(v));

    if (preMetric.length === 0 || postMetric.length === 0) return 0;

    // Calculate covariance and variance
    const meanPre = preMetric.reduce((a: number, b: number) => a + b, 0) / preMetric.length;
    const meanPost = postMetric.reduce((a: number, b: number) => a + b, 0) / postMetric.length;

    let covariance = 0;
    let variancePre = 0;

    for (let i = 0; i < preMetric.length; i++) {
      covariance += (preMetric[i] - meanPre) * (postMetric[i] - meanPost);
      variancePre += (preMetric[i] - meanPre) ** 2;
    }

    covariance /= preMetric.length;
    variancePre /= preMetric.length;

    // Calculate theta and variance reduction
    const theta = variancePre > 0 ? covariance / variancePre : 0;
    const actualCorrelation = theta > 0 ? Math.sqrt(theta * covariance / (variancePre * postMetric.reduce((sum: number, val: number, idx: number) => sum + (val - meanPost) ** 2, 0) / postMetric.length)) : 0;

    // Approximate variance reduction based on correlation squared
    return actualCorrelation ** 2;
  };

  const actualReduction = data ? calculateActualReduction() : 0;

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
        Loading CUPED demo...
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

  // Generate plot spec based on current rho value
  const reduction = rho ** 2;
  const plotSpec = {
    data: [
      {
        type: "bar",
        x: ["Original Variance", "Reduced Variance"],
        y: [1, 1 - reduction],
        marker: { color: ["#00D8FF", "#FFB347"] },
        text: ["100%", `${((1 - reduction) * 100).toFixed(1)}%`],
        textposition: "outside",
        textfont: { size: 14 },
      },
    ],
    layout: {
      height: 300,
      title: {
        text: `Variance Reduction: ${(reduction * 100).toFixed(1)}%`,
        font: { size: 16 }
      },
      margin: { t: 50, r: 10, b: 60, l: 60 },
      yaxis: { range: [0, 1.1], title: "Relative Variance", tickformat: ".0%" },
      xaxis: { title: "" },
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
      <div style={{ marginBottom: "var(--space-3)" }}>
        <label
          htmlFor="rho-slider"
          style={{
            display: "block",
            marginBottom: "var(--space-1)",
            fontWeight: 600,
            fontSize: "var(--text-sm)",
          }}
        >
          Correlation (ρ): {rho.toFixed(2)}
        </label>
        <input
          id="rho-slider"
          type="range"
          min="0"
          max="0.95"
          step="0.05"
          value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            outline: "none",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-1)",
          }}
        >
          <span>0.0 (No correlation)</span>
          <span>0.95 (High correlation)</span>
        </div>
      </div>

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
          <strong>Interpretation:</strong> At correlation ρ = {rho.toFixed(2)}, CUPED reduces variance by approximately{" "}
          <strong>{(rho ** 2 * 100).toFixed(1)}%</strong>. Higher correlation between baseline and experiment metrics leads to greater variance reduction, enabling faster experiment conclusions.
        </p>
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Actual correlation in data: {Math.sqrt(actualReduction).toFixed(2)} (variance reduction: {(actualReduction * 100).toFixed(1)}%)
        </p>
      </div>
    </div>
  );
};
