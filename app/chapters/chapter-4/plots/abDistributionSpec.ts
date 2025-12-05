export interface ABDistributionData {
  controlRevenue: number[];
  treatmentRevenue: number[];
  height: number;
}

export function abDistributionSpec(
  controlRevenue: number[],
  treatmentRevenue: number[],
  height: number
) {
  const data = [
    {
      type: "histogram",
      x: controlRevenue,
      name: "Control",
      marker: { color: "#00D8FF", opacity: 0.6 },
      nbinsx: 40,
      hovertemplate: "Revenue: $%{x:.2f}<br>Count: %{y}<extra></extra>",
    },
    {
      type: "histogram",
      x: treatmentRevenue,
      name: "Treatment",
      marker: { color: "#FFB347", opacity: 0.6 },
      nbinsx: 40,
      hovertemplate: "Revenue: $%{x:.2f}<br>Count: %{y}<extra></extra>",
    },
  ];

  const layout = {
    height,
    margin: { t: 10, r: 10, b: 50, l: 60 },
    xaxis: { title: "Revenue per Ride ($)" },
    yaxis: { title: "Frequency" },
    barmode: "overlay",
    legend: { orientation: "h", x: 0, y: 1.1 },
    hovermode: "x unified",
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  return { data, layout, config };
}
