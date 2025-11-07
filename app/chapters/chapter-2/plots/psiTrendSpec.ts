// PSI trend line chart with threshold bands
const PsiTrendSpec = (dates: string[], psi: number[]) => ({
  data: [
    {
      type: "scatter" as const,
      mode: "lines+markers" as const,
      x: dates,
      y: psi,
      line: { color: "#FFB347", width: 3 },
      marker: { size: 6, color: "#FFB347" },
      name: "PSI",
      hovertemplate: `Date: %{x}<br>PSI: %{y:.4f}<extra></extra>`,
    },
  ],
  layout: {
    height: 280,
    margin: { t: 10, r: 10, b: 40, l: 50 },
    xaxis: { title: "Date" },
    yaxis: { title: "PSI", range: [0, 0.5] },
    shapes: [
      {
        type: "line" as const,
        xref: "paper" as const,
        x0: 0,
        x1: 1,
        y0: 0.1,
        y1: 0.1,
        line: { dash: "dot" as const, color: "#00D8FF", width: 2 },
      },
      {
        type: "line" as const,
        xref: "paper" as const,
        x0: 0,
        x1: 1,
        y0: 0.25,
        y1: 0.25,
        line: { dash: "dot" as const, color: "#FF6B6B", width: 2 },
      },
    ],
    annotations: [
      {
        x: 1.01,
        y: 0.1,
        xref: "paper" as const,
        yref: "y" as const,
        text: "Warn (0.1)",
        showarrow: false,
        xanchor: "left" as const,
        font: { size: 10, color: "#00D8FF" },
      },
      {
        x: 1.01,
        y: 0.25,
        xref: "paper" as const,
        yref: "y" as const,
        text: "Alert (0.25)",
        showarrow: false,
        xanchor: "left" as const,
        font: { size: 10, color: "#FF6B6B" },
      },
    ],
  },
  config: { displayModeBar: false, responsive: true },
});

export default PsiTrendSpec;
