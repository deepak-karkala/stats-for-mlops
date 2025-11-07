// Overlay baseline (blue) and rainstorm (amber) histograms
const CovariateSpec = (values: number[], feature: string) => ({
  data: [
    {
      type: "histogram" as const,
      x: values,
      nbinsx: 40,
      name: "Rainstorm",
      opacity: 0.6,
      marker: { color: "#FFB347" },
      hovertemplate: `${feature}: %{x:.2f}<br>count: %{y}<extra></extra>`,
    },
  ],
  layout: {
    height: 360,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: feature },
    yaxis: { title: "count" },
    bargap: 0.05,
  },
  config: { displayModeBar: false, responsive: true },
});

export default CovariateSpec;
