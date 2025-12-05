// Residual heatmap: zones vs hours
const ResidualHeatSpec = (
  matrix: number[][],
  zones: string[],
  hours: number[],
  height: number = 400
) => ({
  data: [
    {
      z: matrix,
      x: hours,
      y: zones,
      type: "heatmap" as const,
      colorscale: "YlOrRd" as const,
      reversescale: false,
      colorbar: { title: "Residual (min)" },
      hovertemplate: "Zone: %{y}<br>Hour: %{x}<br>Residual: %{z:.2f} min<extra></extra>",
    },
  ],
  layout: {
    height,
    margin: { t: 20, r: 80, b: 40, l: 80 },
    xaxis: { title: "Hour of Day" },
    yaxis: { title: "City Zone" },
  },
  config: { displayModeBar: false, responsive: true },
});

export default ResidualHeatSpec;
