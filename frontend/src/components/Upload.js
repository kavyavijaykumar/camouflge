import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [resultImg, setResultImg] = useState(null);
  const [labels, setLabels] = useState([]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let fd = new FormData();
    fd.append("file", file);

    const res = await axios.post("http://localhost:8000/upload", fd);

    setResultImg("data:image/jpg;base64," + res.data.image);
    setLabels(res.data.labels);
  };

  return (
    <div>
      <h2>Upload Image</h2>

      <input type="file" onChange={uploadImage} style={{ marginTop: 15 }} />

      {resultImg && (
        <>
          <img src={resultImg} alt="result" />

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
            <h3 style={{ marginBottom: 10 }}>Detection Result</h3>

            <p><strong>Detected Objects:</strong>  
              {labels.length ? labels.join(", ") : "No objects detected"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Upload;
