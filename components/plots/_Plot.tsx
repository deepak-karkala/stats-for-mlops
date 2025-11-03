'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/lib/viewport';

/**
 * Plot specification interface for Plotly-compatible layouts
 */
export interface PlotSpec {
  data: Array<{
    x?: (string | number)[];
    y?: (string | number)[];
    type?: string;
    name?: string;
    [key: string]: unknown;
  }>;
  layout?: {
    title?: string;
    xaxis?: Record<string, unknown>;
    yaxis?: Record<string, unknown>;
    hovermode?: string;
    margin?: Record<string, number>;
    [key: string]: unknown;
  };
  config?: {
    responsive?: boolean;
    displayModeBar?: boolean;
    displaylogo?: boolean;
    [key: string]: unknown;
  };
}

interface PlotProps {
  spec: PlotSpec;
  height?: number;
  width?: string | number;
  className?: string;
}

/**
 * Plot component wrapper for Plotly charts
 * Renders only when element is visible in viewport (lazy mounting)
 * Avoids hydration issues by being a client component
 */
export const Plot = ({
  spec,
  height = 500,
  width = '100%',
  className = '',
}: PlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Detect when container is in viewport
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !isClient) return;

    // Dynamically import Plotly only when needed
    const loadPlotly = async () => {
      try {
        const Plotly = (await import('plotly.js/dist/plotly')).default;
        const PlotlyReact = await import('react-plotly.js');

        // Container should exist at this point
        if (containerRef.current) {
          Plotly.newPlot(
            containerRef.current,
            spec.data,
            spec.layout || {},
            {
              responsive: true,
              displayModeBar: false,
              displaylogo: false,
              ...spec.config,
            }
          );
        }
      } catch (error) {
        console.error('Error loading Plotly:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML =
            '<div style="padding: 20px; color: var(--color-text-secondary);">Chart failed to load. Please refresh the page.</div>';
        }
      }
    };

    loadPlotly();
  }, [isVisible, spec, isClient]);

  const setRef = useIntersectionObserver((visible) => {
    setIsVisible(visible);
  });

  return (
    <div
      ref={(el) => {
        setRef(el);
        containerRef.current = el;
      }}
      className={`plot-container ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        minHeight: '300px',
      }}
    >
      {!isClient && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Loading chart...
          </p>
        </div>
      )}

      <style>{`
        .plot-container {
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: white;
          margin: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
        }

        .plot-container svg {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};
