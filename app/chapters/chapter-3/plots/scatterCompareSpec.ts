// Predicted vs Actual ETA scatter plot with y=x reference line
const ScatterCompareSpec = (
  refX: number[],
  refY: number[],
  curX: number[],
  curY: number[],
  height: number = 360
) => ({
  data: [
    {
      type: "scatter" as const,
      mode: "markers" as const,
      x: refX,
      y: refY,
      name: "Baseline",
      marker: { color: "#00D8FF", size: 5, opacity: 0.6 },
      hovertemplate: "Pred: %{x:.2f} min<br>Actual: %{y:.2f} min<extra></extra>",
    },
    {
      type: "scatter" as const,
      mode: "markers" as const,
      x: curX,
      y: curY,
      name: "Concept Drift",
      marker: { color: "#FFB347", size: 5, opacity: 0.6 },
      hovertemplate: "Pred: %{x:.2f} min<br>Actual: %{y:.2f} min<extra></extra>",
    },
    {
      type: "scatter" as const,
      mode: "lines" as const,
      x: [0, 40],
      y: [0, 40],
      line: { color: "#999", dash: "dash" as const, width: 2 },
      name: "y=x (perfect)",
      hoverinfo: "none" as const,
    },
  ],
  layout: {
    height,
    margin: { t: 10, r: 10, b: 50, l: 60 },
    xaxis: { title: "Predicted ETA (min)", range: [0, 40] },
    yaxis: { title: "Actual ETA (min)", range: [0, 40] },
    legend: { orientation: "h" as const, x: 0, y: 1.1 },
  },
  config: { displayModeBar: false, responsive: true },
});

export default ScatterCompareSpec;
