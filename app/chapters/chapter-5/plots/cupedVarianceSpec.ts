// CI width vs. correlation slider
const CupedSpec = (rho: number) => {
  const reduction = rho ** 2;
  return {
    data: [
      {
        type: "bar",
        x: ["Original Variance", "Reduced Variance"],
        y: [1, 1 - reduction],
        marker: { color: ["#00D8FF", "#FFB347"] },
        text: [
          "100%",
          `${((1 - reduction) * 100).toFixed(1)}%`
        ],
        textposition: "outside",
        textfont: { size: 14 },
      },
    ],
    layout: {
      height: 300,
      title: {
        text: `Variance Reduction: ${(reduction * 100).toFixed(1)}%`,
        font: { size: 16 }
      },
      margin: { t: 50, r: 10, b: 60, l: 60 },
      yaxis: {
        range: [0, 1.1],
        title: "Relative Variance",
        tickformat: ".0%"
      },
      xaxis: {
        title: ""
      },
      showlegend: false,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default CupedSpec;
