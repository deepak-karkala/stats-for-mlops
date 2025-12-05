export interface PowerCurveData {
  sampleSizes: number[];
  powers: number[];
  height: number;
}

export function powerCurveSpec(
  sampleSizes: number[],
  powers: number[],
  height: number
) {
  const data = [
    {
      type: "scatter",
      mode: "lines+markers",
      x: sampleSizes,
      y: powers,
      line: { color: "#FFB347", width: 3 },
      marker: { size: 6, color: "#FFB347" },
      name: "Statistical Power",
      hovertemplate: "Sample size: %{x}<br>Power: %{y:.1%}<extra></extra>",
      fill: "tozeroy",
      fillcolor: "rgba(255, 179, 71, 0.1)",
    },
    {
      type: "scatter",
      mode: "lines",
      x: [sampleSizes[0], sampleSizes[sampleSizes.length - 1]],
      y: [0.8, 0.8],
      line: { color: "#999", width: 2, dash: "dash" },
      name: "80% Power Target",
      hoverinfo: "none",
    },
  ];

  const layout = {
    height,
    margin: { t: 20, r: 10, b: 50, l: 60 },
    xaxis: {
      title: "Sample Size per Group",
      type: "log",
    },
    yaxis: {
      title: "Statistical Power",
      range: [0, 1.05],
    },
    legend: { orientation: "h", x: 0, y: 1.1 },
    hovermode: "x unified",
    shapes: [
      {
        type: "rect",
        x0: sampleSizes[0],
        x1: sampleSizes[sampleSizes.length - 1],
        y0: 0.8,
        y1: 1.0,
        fillcolor: "rgba(50, 205, 50, 0.05)",
        line: { color: "rgba(50, 205, 50, 0)" },
        layer: "below",
      },
    ],
    annotations: [
      {
        text: "High power region (80%+)",
        xref: "paper",
        yref: "paper",
        x: 0.98,
        y: 0.9,
        showarrow: false,
        align: "right",
        bgcolor: "rgba(50, 205, 50, 0.1)",
        bordercolor: "#32CD32",
        borderwidth: 1,
        borderpad: 6,
        font: { size: 11 },
      },
    ],
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  return { data, layout, config };
}
