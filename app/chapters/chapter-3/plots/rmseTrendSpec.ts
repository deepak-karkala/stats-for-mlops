// RMSE and MAE trend lines over time
const RmseTrendSpec = (
  dates: string[],
  rmse: number[],
  mae: number[],
  height: number = 280
) => ({
  data: [
    {
      type: "scatter" as const,
      mode: "lines+markers" as const,
      x: dates,
      y: rmse,
      line: { color: "#FFB347", width: 3 },
      marker: { size: 6 },
      name: "RMSE",
      hovertemplate: "Date: %{x}<br>RMSE: %{y:.3f} min<extra></extra>",
    },
    {
      type: "scatter" as const,
      mode: "lines+markers" as const,
      x: dates,
      y: mae,
      line: { color: "#00D8FF", width: 2 },
      marker: { size: 5 },
      name: "MAE",
      hovertemplate: "Date: %{x}<br>MAE: %{y:.3f} min<extra></extra>",
    },
  ],
  layout: {
    height,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Date" },
    yaxis: { title: "Error (min)" },
    legend: { orientation: "h" as const, x: 0, y: 1.1 },
  },
  config: { displayModeBar: false, responsive: true },
});

export default RmseTrendSpec;
