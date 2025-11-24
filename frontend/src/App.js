import React, { useState } from "react";
import Upload from "./components/Upload";
import LiveCamera from "./components/LiveCamera";
import History from "./components/History";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div className="App">
      <h1>CamouSense</h1>

      <div className="card">
        {screen === "home" && (
          <>
           <button onClick={() => setScreen("upload")}>📤 Upload Image</button>
<button onClick={() => setScreen("live")}>🎥 Live Surveillance</button>
<button onClick={() => setScreen("history")}>🗂 Detection History</button>
          </>
        )}

        {screen === "upload" && <Upload />}
        {screen === "live" && <LiveCamera />}
        {screen === "history" && <History />}
      </div>

      {screen !== "home" && (
        <button className="back" onClick={() => setScreen("home")}>⬅ Back to Home</button>
      )}
    </div>
  );
}

export default App;
