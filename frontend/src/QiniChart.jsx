import Plot from "react-plotly.js";

function QiniChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No Qini data available.</p>;
  }

  const sortedData = [...data].sort((a, b) => b.ITE - a.ITE);

  const x = sortedData.map((_, index) => index + 1);

  let cumulative = 0;

  const qini = sortedData.map((item) => {
    cumulative += item.ITE;
    return cumulative;
  });

  const random = x.map((value) => {
    return qini[qini.length - 1] * (value / x.length);
  });

  return (
    <div className="chart-card">
      <h2>🎯 Qini Curve</h2>
      <p>Model performance compared with random targeting</p>

      <Plot
        data={[
          {
            x,
            y: qini,
            type: "scatter",
            mode: "lines",
            name: "DML Model"
          },
          {
            x,
            y: random,
            type: "scatter",
            mode: "lines",
            name: "Random"
          }
        ]}
        layout={{
          title: "Qini Curve",
          xaxis: {
            title: "Customers Targeted"
          },
          yaxis: {
            title: "Cumulative Gain"
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

export default QiniChart;