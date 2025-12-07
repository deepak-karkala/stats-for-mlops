// Timeline showing guardrail events with color-coded status
const GuardrailSpec = (
  dates: string[],
  psi: number[],
  rmse: number[],
  status: string[]
) => {
  const colorMap: { [k: string]: string } = {
    ok: "#00D8FF",
    warn: "#FFB347",
    rollback: "#FF6347",
    recovered: "#32CD32",
  };

  return {
    data: [
      {
        type: "scatter",
        mode: "markers",
        x: dates,
        y: rmse,
        marker: {
          color: status.map(s => colorMap[s] || "#999"),
          size: 12,
          line: {
            color: "#fff",
            width: 2
          }
        },
        text: status.map((s, i) => `${s.toUpperCase()}<br>PSI: ${psi[i].toFixed(3)}<br>RMSE: ${rmse[i].toFixed(2)}`),
        hovertemplate: "%{text}<extra></extra>",
        name: "Guardrail Status",
      },
    ],
    layout: {
      height: 320,
      margin: { t: 40, r: 20, b: 80, l: 60 },
      title: {
        text: "Guardrail Events Timeline",
        font: { size: 16 }
      },
      xaxis: {
        title: "Date",
        gridcolor: "#e0e0e0",
      },
      yaxis: {
        title: "RMSE (Prediction Error)",
        gridcolor: "#e0e0e0",
      },
      shapes: [
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: 2.7,
          y1: 2.7,
          line: {
            dash: "dot",
            color: "#FF6347",
            width: 2
          },
        },
      ],
      annotations: [
        {
          x: 0.5,
          y: -0.25,
          xref: "paper",
          yref: "paper",
          text: "🔵 OK   🟡 Warning   🔴 Rollback   🟢 Recovered",
          showarrow: false,
          xanchor: "center",
          font: { size: 12 }
        },
        {
          x: 0.98,
          y: 2.7,
          xref: "paper",
          yref: "y",
          text: "Rollback Threshold",
          showarrow: false,
          xanchor: "right",
          yanchor: "bottom",
          font: { color: "#FF6347", size: 10 }
        }
      ],
      showlegend: false,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    },
    config: { displayModeBar: false, responsive: true },
  };
};

export default GuardrailSpec;
