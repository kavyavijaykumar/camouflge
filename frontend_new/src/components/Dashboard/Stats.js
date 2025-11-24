import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { api } from "../../api";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/history").then((res) => setData(res.data));
  }, []);

  const labelCount = {};
  data.forEach((item) => {
    item.labels.forEach((l) => {
      labelCount[l] = (labelCount[l] || 0) + 1;
    });
  });

  const labels = Object.keys(labelCount);
  const counts = Object.values(labelCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Detections per Label",
        data: counts,
        backgroundColor: ["#00f5ff", "#8aff6c", "#ffdd57", "#ff8080"],
      },
    ],
  };

  return (
    <div>
      <h2>Detection Statistics</h2>
      {labels.length > 0 ? (
        <>
          <div style={{ width: "400px", marginTop: "20px" }}>
            <Pie data={chartData} />
          </div>
          <div style={{ width: "500px", marginTop: "40px" }}>
            <Bar data={chartData} />
          </div>
        </>
      ) : (
        <p>No detection data to display.</p>
      )}
    </div>
  );
}

export default Stats;
