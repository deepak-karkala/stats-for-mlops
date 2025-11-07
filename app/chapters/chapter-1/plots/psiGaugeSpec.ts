interface Thresholds {
  warn: number;
  alert: number;
}

const PsiGaugeSpec = (psi: number, thresholds: Thresholds) => {
  const { warn, alert } = thresholds;
  // Map PSI to 0..1 needle arc
  const level = Math.min(psi, 0.5);
  return {
    data: [
      {
        type: "indicator" as const,
        mode: "gauge+number",
        value: psi,
        number: { valueformat: ".3f" },
        gauge: {
          axis: { range: [0, 0.5] },
          bar: { color: "#00D8FF" },
          steps: [
            { range: [0, warn], color: "#0B0E17" },
            { range: [warn, alert], color: "#FFB34733" },
            { range: [alert, 0.5], color: "#FFB34766" },
          ],
          threshold: {
            line: { color: "#FFB347", width: 3 },
            thickness: 0.75,
            value: alert,
          },
        },
        domain: { x: [0, 1], y: [0, 1] },
      },
    ],
    layout: {
      height: 220,
      margin: { t: 0, r: 10, b: 0, l: 10 },
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default PsiGaugeSpec;
