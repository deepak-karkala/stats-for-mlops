// Sequential p-value evolution with significance boundaries
const SeqSpec = (n: number[], p: number[]) => ({
  data: [
    {
      type: "scatter",
      mode: "lines+markers",
      x: n,
      y: p,
      line: { color: "#FFB347", width: 3 },
      marker: { color: "#FFB347", size: 6 },
      name: "p-value evolution",
    },
  ],
  layout: {
    height: 320,
    margin: { t: 30, r: 20, b: 60, l: 70 },
    title: {
      text: "Sequential Test: P-value Evolution",
      font: { size: 16 }
    },
    xaxis: {
      title: "Samples per Group",
      gridcolor: "#e0e0e0"
    },
    yaxis: {
      title: "P-value",
      range: [0, Math.max(0.15, Math.max(...p) * 1.1)],
      gridcolor: "#e0e0e0"
    },
    shapes: [
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.05,
        y1: 0.05,
        line: {
          dash: "dot",
          color: "#00D8FF",
          width: 2
        },
      },
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        y0: 0.01,
        y1: 0.01,
        line: {
          dash: "dot",
          color: "#1E88E5",
          width: 2
        },
      },
    ],
    annotations: [
      {
        x: 0.98,
        y: 0.05,
        xref: "paper",
        yref: "y",
        text: "α = 0.05",
        showarrow: false,
        xanchor: "right",
        font: { color: "#00D8FF", size: 11 }
      },
      {
        x: 0.98,
        y: 0.01,
        xref: "paper",
        yref: "y",
        text: "α = 0.01",
        showarrow: false,
        xanchor: "right",
        font: { color: "#1E88E5", size: 11 }
      }
    ],
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      xanchor: "left",
      yanchor: "top"
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  },
  config: { displayModeBar: false, responsive: true },
});

export default SeqSpec;
