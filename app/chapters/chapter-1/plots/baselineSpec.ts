// Produces a single histogram for the selected feature.
// The HistogramPanel will provide the feature's array.
const BaselineSpec = (values: number[], feature: string) => {
  return {
    data: [
      {
        type: "histogram" as const,
        x: values,
        nbinsx: 40,
        hovertemplate: `${feature}: %{x:.2f}<br>count: %{y}<extra></extra>`,
      },
    ],
    layout: {
      height: 360,
      bargap: 0.05,
      margin: { t: 10, r: 10, b: 40, l: 50 },
      xaxis: { title: feature },
      yaxis: { title: "count" },
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default BaselineSpec;
