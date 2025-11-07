"use client";

import { useState, useEffect, useRef } from "react";
import { csvParse } from "d3-dsv";
import { gaugeSpecs, GaugeSpecKey } from "./specRegistry";

const DEFAULT_GAUGE_SPEC_KEY: GaugeSpecKey = "psiGauge";

interface DriftGaugeProps {
  id: string;
  referenceUrl: string;
  currentUrl: string;
  feature: string;
  thresholds: {
    warn: number;
    alert: number;
  };
  specKey?: GaugeSpecKey;
}

// Calculate PSI (Population Stability Index)
function calculatePSI(
  reference: number[],
  current: number[],
  bins: number = 10
): number {
  // Sort reference to get quantile cuts
  const refSorted = [...reference].sort((a, b) => a - b);
  const cuts: number[] = [];
  for (let i = 0; i <= bins; i++) {
    const index = Math.floor((i * (refSorted.length - 1)) / bins);
    cuts.push(refSorted[index]);
  }

  // Create histograms
  const hist = (arr: number[]) => {
    const h = new Array(bins).fill(0);
    for (const v of arr) {
      if (!Number.isFinite(v)) continue;
      let j = cuts.findIndex((c) => v < c);
      if (j === -1) j = bins; // right edge
      j = Math.max(1, Math.min(bins, j)) - 1;
      h[j] += 1;
    }
    return h;
  };

  const e = hist(reference).map((x) => x + 1e-6);
  const a = hist(current).map((x) => x + 1e-6);

  // Normalize
  const eSum = e.reduce((s, y) => s + y, 0);
  const aSum = a.reduce((s, y) => s + y, 0);
  const es = e.map((x) => x / eSum);
  const as = a.map((x) => x / aSum);

  // Calculate PSI
  const psi = as.reduce((s, ap, i) => s + (ap - es[i]) * Math.log(ap / es[i]), 0);
  return psi;
}

export const DriftGauge = ({
  id,
  referenceUrl,
  currentUrl,
  feature,
  thresholds,
  specKey = DEFAULT_GAUGE_SPEC_KEY,
}: DriftGaugeProps) => {
  const [psi, setPsi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadDataAndCalculatePSI() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both CSV files
        const [refResponse, curResponse] = await Promise.all([
          fetch(referenceUrl),
          fetch(currentUrl),
        ]);

        if (!refResponse.ok) {
          throw new Error(`Failed to load reference data: ${refResponse.statusText}`);
        }
        if (!curResponse.ok) {
          throw new Error(`Failed to load current data: ${curResponse.statusText}`);
        }

        const [refText, curText] = await Promise.all([
          refResponse.text(),
          curResponse.text(),
        ]);

        const refData = csvParse(refText);
        const curData = csvParse(curText);

        // Extract feature values
        const refValues = refData
          .map((row: any) => parseFloat(row[feature]))
          .filter((v: number) => Number.isFinite(v));

        const curValues = curData
          .map((row: any) => parseFloat(row[feature]))
          .filter((v: number) => Number.isFinite(v));

        if (refValues.length === 0 || curValues.length === 0) {
          throw new Error("No valid data found for the selected feature");
        }

        // Calculate PSI
        const psiValue = calculatePSI(refValues, curValues);
        setPsi(psiValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to calculate PSI");
      } finally {
        setLoading(false);
      }
    }

    loadDataAndCalculatePSI();
  }, [referenceUrl, currentUrl, feature]);

  useEffect(() => {
    if (!isClient || psi === null || !plotRef.current || loading || error) return;

    const gaugeSpec = gaugeSpecs[specKey] ?? gaugeSpecs[DEFAULT_GAUGE_SPEC_KEY];
    const plotSpec = gaugeSpec(psi, thresholds);

    // Dynamically import and render Plotly
    const renderPlot = async () => {
      try {
        const Plotly = await import("plotly.js-dist-min");

        if (plotRef.current) {
          await Plotly.newPlot(
            plotRef.current,
            plotSpec.data,
            {
              ...plotSpec.layout,
              autosize: true,
            },
            {
              ...plotSpec.config,
              responsive: true,
            }
          );
        }
      } catch (err) {
        console.error("Error rendering plot:", err);
        setError("Failed to render gauge");
      }
    };

    renderPlot();

    // Cleanup
    return () => {
      if (plotRef.current) {
        plotRef.current.innerHTML = "";
      }
    };
  }, [isClient, psi, specKey, thresholds, loading, error]);

  if (loading) {
    return (
      <div className="drift-gauge" id={id}>
        <div className="drift-gauge-loading">
          <p>Calculating PSI...</p>
        </div>
        <style jsx>{`
          .drift-gauge {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
            padding: var(--space-4, 16px);
          }
          .drift-gauge-loading {
            padding: var(--space-6, 24px);
            text-align: center;
            color: var(--color-text-secondary, #6b7280);
            min-height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drift-gauge" id={id}>
        <div className="drift-gauge-error">
          <p>❌ Error: {error}</p>
        </div>
        <style jsx>{`
          .drift-gauge {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
            padding: var(--space-4, 16px);
          }
          .drift-gauge-error {
            padding: var(--space-6, 24px);
            text-align: center;
            color: var(--color-red, #dc2626);
            min-height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  if (psi === null) {
    return (
      <div className="drift-gauge" id={id}>
        <div className="drift-gauge-empty">
          <p>No PSI calculated</p>
        </div>
        <style jsx>{`
          .drift-gauge {
            margin: var(--space-6, 24px) 0;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--color-border, #e5e7eb);
            background-color: var(--color-bg, #ffffff);
            padding: var(--space-4, 16px);
          }
          .drift-gauge-empty {
            padding: var(--space-6, 24px);
            text-align: center;
            color: var(--color-text-secondary, #6b7280);
            min-height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  // Determine status based on thresholds
  let status = "stable";
  if (psi >= thresholds.alert) {
    status = "alert";
  } else if (psi >= thresholds.warn) {
    status = "warning";
  }

  return (
    <div className="drift-gauge" id={id}>
      <div className="drift-gauge-header">
        <span className={`drift-status drift-status-${status}`}>
          PSI: {psi.toFixed(3)} - {status.toUpperCase()}
        </span>
      </div>
      <div ref={plotRef} style={{ width: "100%", height: "220px" }} />
      <style jsx>{`
        .drift-gauge {
          margin: var(--space-6, 24px) 0;
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
          background-color: var(--color-bg, #ffffff);
          padding: var(--space-4, 16px);
        }

        .drift-gauge-header {
          text-align: center;
          margin-bottom: var(--space-2, 8px);
        }

        .drift-status {
          display: inline-block;
          padding: var(--space-2, 8px) var(--space-3, 12px);
          border-radius: var(--radius-md, 8px);
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-semibold, 600);
        }

        .drift-status-stable {
          background-color: rgba(0, 216, 255, 0.1);
          color: var(--color-blue, #00d8ff);
        }

        .drift-status-warning {
          background-color: rgba(255, 179, 71, 0.1);
          color: var(--color-amber, #ffb347);
        }

        .drift-status-alert {
          background-color: rgba(255, 179, 71, 0.2);
          color: var(--color-amber, #ffb347);
          border: 2px solid var(--color-amber, #ffb347);
        }
      `}</style>
    </div>
  );
};

export default DriftGauge;
