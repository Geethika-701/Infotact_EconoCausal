import Plot from "react-plotly.js";

function UpliftChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No uplift data available.</p>;
  }

  const sortedData = [...data].sort((a, b) => b.ITE - a.ITE);

  const x = sortedData.map((_, index) => index + 1);

  const y = sortedData.map((item, index) => {
    const previous = index === 0 ? 0 : sortedData[index - 1].ITE;
    return previous + item.ITE;
  });

  return (
    <div className="chart-card">
      <h2>📈 Uplift Curve</h2>
      <p>Customer ranking based on Individual Treatment Effect</p>

      <Plot
        data={[
          {
            x,
            y,
            type: "scatter",
            mode: "lines",
            name: "Model Uplift"
          }
        ]}
        layout={{
          title: "Cumulative Uplift",
          xaxis: {
            title: "Customers Targeted"
          },
          yaxis: {
            title: "Cumulative Uplift"
          },
          autosize: true
        }}
        style={{
          width: "100%",
          height: "450px"
        }}
        useResizeHandler
      />
    </div>
  );
}

export default UpliftChart;