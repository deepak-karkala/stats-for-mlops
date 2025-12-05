"use client";

import dynamic from "next/dynamic";

/**
 * Client-only Plotly wrapper built from the factory API so we can pair
 * `react-plotly.js` with the smaller `plotly.js-dist-min` bundle.
 */
const Plot = dynamic(async () => {
  const Plotly = await import("plotly.js-dist-min");
  const createPlotlyComponent = (await import("react-plotly.js/factory")).default;
  return createPlotlyComponent(Plotly);
}, { ssr: false });

export default Plot;
