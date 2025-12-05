export interface SRMGaugeData {
  controlRatio: number;
  treatmentRatio: number;
  chi2Value: number;
  chi2Critical: number;
  passed: boolean;
  height: number;
}

export function srmGaugeSpec(
  controlRatio: number,
  treatmentRatio: number,
  chi2Value: number,
  chi2Critical: number,
  passed: boolean,
  height: number
) {
  const data = [
    {
      type: "bar",
      x: ["Control", "Treatment"],
      y: [controlRatio * 100, treatmentRatio * 100],
      marker: {
        color: [controlRatio > 0.45 && controlRatio < 0.55 ? "#32CD32" : "#FF6B6B",
                treatmentRatio > 0.45 && treatmentRatio < 0.55 ? "#32CD32" : "#FF6B6B"],
      },
      text: [
        `${(controlRatio * 100).toFixed(1)}%`,
        `${(treatmentRatio * 100).toFixed(1)}%`,
      ],
      textposition: "outside",
      hovertemplate: "%{x}<br>Ratio: %{y:.1f}%<extra></extra>",
    },
  ];

  const layout = {
    height,
    margin: { t: 40, r: 10, b: 60, l: 60 },
    xaxis: { title: "Group" },
    yaxis: { title: "Sample Ratio (%)", range: [0, 100] },
    shapes: [
      {
        type: "rect",
        x0: -0.5,
        x1: 1.5,
        y0: 45,
        y1: 55,
        fillcolor: "rgba(50, 205, 50, 0.1)",
        line: { color: "#32CD32", width: 2, dash: "dash" },
        layer: "below",
      },
    ],
    annotations: [
      {
        text: "Healthy range (45-55%)",
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 0.95,
        showarrow: false,
        bgcolor: passed ? "rgba(50, 205, 50, 0.1)" : "rgba(255, 107, 107, 0.1)",
        bordercolor: passed ? "#32CD32" : "#FF6B6B",
        borderwidth: 2,
        borderpad: 8,
      },
    ],
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  return { data, layout, config };
}
