"use client";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";
import Plot from "./_Plot";
import { srmGaugeSpec } from "@/app/chapters/chapter-4/plots/srmGaugeSpec";
import { usePlotVisibility } from "./usePlotVisibility";

interface SRMGaugeProps {
  id?: string;
  dataUrl: string;
  height?: number;
}

export const SRMGauge = ({ id = "srm-gauge", dataUrl, height = 300 }: SRMGaugeProps) => {
  const { containerRef, isVisible } = usePlotVisibility();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [srmData, setSRMData] = useState<{
    controlRatio: number;
    treatmentRatio: number;
    chi2Value: number;
    chi2Critical: number;
    passed: boolean;
  }>({
    controlRatio: 0.5,
    treatmentRatio: 0.5,
    chi2Value: 0,
    chi2Critical: 3.841,
    passed: true,
  });

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

        // Extract control and treatment counts
        const controlRow = rows.find((row: any) => row.group === "control");
        const treatmentRow = rows.find((row: any) => row.group === "treatment");
        const chi2Row = rows.find((row: any) => row.group === "chi2_result");

        if (!controlRow || !treatmentRow || !chi2Row) {
          throw new Error("Missing SRM data rows");
        }

        const controlRatio = parseFloat((controlRow as any).ratio);
        const treatmentRatio = parseFloat((treatmentRow as any).ratio);
        const chi2Value = parseFloat((chi2Row as any).observed_count);
        const chi2Critical = parseFloat((chi2Row as any).expected_count);
        const passed = chi2Value < chi2Critical;

        setSRMData({
          controlRatio,
          treatmentRatio,
          chi2Value,
          chi2Critical,
          passed,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, isVisible]);

  const plotSpec = useMemo(() => {
    return srmGaugeSpec(
      srmData.controlRatio,
      srmData.treatmentRatio,
      srmData.chi2Value,
      srmData.chi2Critical,
      srmData.passed,
      height
    );
  }, [srmData, height]);

  if (loading) {
    return (
      <div className="srm-gauge" id={id} ref={containerRef}>
        <div className="srm-loading">
          <p>Loading SRM check...</p>
        </div>
        <style jsx>{`
          .srm-gauge {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .srm-loading {
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

  if (error) {
    return (
      <div className="srm-gauge" id={id} ref={containerRef}>
        <div className="srm-error">
          <p>Error: {error}</p>
        </div>
        <style jsx>{`
          .srm-gauge {
            margin: var(--space-6) 0;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            background-color: var(--color-bg);
          }
          .srm-error {
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
    <div className="srm-gauge" id={id} ref={containerRef}>
      <Plot
        data={plotSpec.data}
        layout={{ ...plotSpec.layout, height, autosize: true }}
        config={{ ...plotSpec.config, responsive: true, displayModeBar: false }}
        style={{ width: "100%", height }}
        useResizeHandler
      />
      <style jsx>{`
        .srm-gauge {
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

export default SRMGauge;
