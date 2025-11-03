'use client';

import { useEffect, useState } from 'react';
import { Plot, PlotSpec } from './_Plot';
import { loadCSV } from '@/lib/csv';

interface DistributionPlotProps {
  csvPath: string;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

/**
 * Distribution plot component
 * Loads CSV data and renders as a bar chart
 */
export const DistributionPlot = ({
  csvPath,
  title = 'Distribution',
  xAxisLabel = 'Value',
  yAxisLabel = 'Frequency',
  height = 400,
}: DistributionPlotProps) => {
  const [spec, setSpec] = useState<PlotSpec | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await loadCSV(csvPath);

        // Extract x (value) and y (count) from CSV
        const xValues = csvData.rows.map((row) => row.value);
        const yValues = csvData.rows.map((row) => row.count);

        const plotSpec: PlotSpec = {
          data: [
            {
              x: xValues,
              y: yValues,
              type: 'bar',
              marker: {
                color: 'var(--color-blue)',
              },
            },
          ],
          layout: {
            title,
            xaxis: {
              title: xAxisLabel,
            },
            yaxis: {
              title: yAxisLabel,
            },
            hovermode: 'closest',
            margin: {
              l: 60,
              r: 20,
              t: 60,
              b: 60,
            },
          },
          config: {
            responsive: true,
            displayModeBar: false,
          },
        };

        setSpec(plotSpec);
      } catch (err) {
        console.error('Error loading distribution data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load chart data'
        );
      }
    };

    loadData();
  }, [csvPath, title, xAxisLabel, yAxisLabel]);

  if (error) {
    return (
      <div
        style={{
          padding: 'var(--space-6)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <strong>Error loading chart:</strong> {error}
      </div>
    );
  }

  if (!spec) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        Loading chart...
      </div>
    );
  }

  return <Plot spec={spec} height={height} />;
};
