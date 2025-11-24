import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const IP_CAM_URL = "http://10.66.56.85:8080/shot.jpg"; // Replace your IP

function LiveCamera() {
  const [frame, setFrame] = useState(null);
  const [labels, setLabels] = useState([]);

  const fetchFrame = async () => {
    try {
      const response = await fetch(IP_CAM_URL);
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setFrame(imgUrl);

      let fd = new FormData();
      fd.append("file", blob, "frame.jpg");

      const res = await axios.post("http://localhost:8000/upload", fd);
      setLabels(res.data.labels);

    } catch (error) {
      console.error("IP webcam error:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchFrame, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Camera</h2>

      {frame && <img src={frame} alt="live-stream" />}

      <div
        style={{
          marginTop: 20,
          padding: "15px 20px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 15px rgba(0,255,255,0.25)",
          textAlign: "left",
          color: "white"
        }}
      >
        <h3 style={{ marginBottom: 10 }}>Live Detection Result</h3>
        <p><strong>Detected Objects:</strong>  
          {labels.length ? labels.join(", ") : "No detections yet"}
        </p>
      </div>
    </div>
  );
}

export default LiveCamera;
