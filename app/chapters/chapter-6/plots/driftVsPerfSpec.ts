// Scatter plot showing correlation between drift (PSI) and performance (RMSE)
const DriftPerfSpec = (psi: number[], rmse: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "markers",
      x: psi,
      y: rmse,
      marker: {
        color: "#FFB347",
        size: 8,
        opacity: 0.7,
        line: {
          color: "#FF8C00",
          width: 1
        }
      },
      name: "Drift vs Performance",
    },
  ],
  layout: {
    height: 320,
    margin: { t: 40, r: 20, b: 60, l: 60 },
    title: {
      text: "Drift-Performance Correlation",
      font: { size: 16 }
    },
    xaxis: {
      title: "PSI (Input Drift)",
      gridcolor: "#e0e0e0",
    },
    yaxis: {
      title: "RMSE (Prediction Error)",
      gridcolor: "#e0e0e0",
    },
    shapes: [
      {
        type: "line",
        xref: "x",
        yref: "y",
        x0: Math.min(...psi),
        x1: Math.max(...psi),
        y0: 1.8,
        y1: 1.8 + 4 * (Math.max(...psi) - Math.min(...psi)),
        line: {
          dash: "dot",
          color: "#00D8FF",
          width: 2
        },
      },
    ],
    annotations: [
      {
        x: 0.98,
        y: 0.02,
        xref: "paper",
        yref: "paper",
        text: "Higher drift → Higher error",
        showarrow: false,
        xanchor: "right",
        yanchor: "bottom",
        font: { color: "#666", size: 11, style: "italic" }
      }
    ],
    showlegend: false,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  },
  config: { displayModeBar: false, responsive: true },
});

export default DriftPerfSpec;
