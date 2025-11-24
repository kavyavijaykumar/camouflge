import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    axios.get("http://localhost:8000/history").then((res) => {
      setHistory(res.data);
    });
  };

  const clearHistory = async () => {
    if (!window.confirm("Delete all history?")) return;
    await axios.delete("http://localhost:8000/clear_history");
    loadHistory();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <h2>Detection History</h2>

      <button onClick={clearHistory} style={{ background: "red", color: "white" }}>
        🗑 Clear History
      </button>

      {history.map((item, index) => (
        <div key={index} className="history-item">
          <p><strong>Time:</strong> {item.timestamp}</p>
          <p><strong>Detected:</strong> {item.labels.join(", ")}</p>
          <img src={"data:image/jpg;base64," + item.image} alt="detected" />
        </div>
      ))}
    </div>
  );
}

export default History;
