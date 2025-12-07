// Dual-axis monitoring dashboard showing PSI and RMSE over time
const DashboardSpec = (
  dates: string[],
  psi: number[],
  rmse: number[]
) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: psi,
      name: "PSI (Drift)",
      line: { color: "#00D8FF", width: 2 },
      marker: { size: 6 },
    },
    {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: rmse,
      name: "RMSE (Error)",
      yaxis: "y2",
      line: { color: "#FFB347", width: 3 },
      marker: { size: 6 },
    },
  ],
  layout: {
    height: 350,
    margin: { t: 40, r: 70, b: 60, l: 60 },
    title: {
      text: "Model Health: Drift & Performance Metrics",
      font: { size: 16 }
    },
    xaxis: {
      title: "Date",
      gridcolor: "#e0e0e0",
    },
    yaxis: {
      title: "PSI (Population Stability Index)",
      range: [0, 0.4],
      gridcolor: "#e0e0e0",
    },
    yaxis2: {
      title: "RMSE (Root Mean Squared Error)",
      overlaying: "y",
      side: "right",
      range: [1, 3.5],
      gridcolor: "#f0f0f0",
    },
    shapes: [
      {
        type: "line",
        xref: "paper",
        yref: "y",
        x0: 0,
        x1: 1,
        y0: 0.25,
        y1: 0.25,
        line: {
          dash: "dot",
          color: "#00D8FF",
          width: 2
        },
      },
    ],
    annotations: [
      {
        x: 0.02,
        y: 0.25,
        xref: "paper",
        yref: "y",
        text: "PSI Threshold (0.25)",
        showarrow: false,
        xanchor: "left",
        yanchor: "bottom",
        font: { color: "#00D8FF", size: 10 }
      }
    ],
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.1,
      yanchor: "bottom"
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  },
  config: { displayModeBar: false, responsive: true },
});

export default DashboardSpec;
