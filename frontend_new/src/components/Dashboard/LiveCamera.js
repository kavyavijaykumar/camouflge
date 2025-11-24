import React, { useRef, useState } from "react";

function LiveCamera() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setActive(true);
    } catch (err) {
      alert("Unable to access camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setActive(false);
  };

  return (
    <div>
      <h2>Live Camera Detection</h2>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline style={{ borderRadius: "10px" }}></video>
      <div style={{ marginTop: "20px" }}>
        {!active ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
      </div>
    </div>
  );
}

export default LiveCamera;
