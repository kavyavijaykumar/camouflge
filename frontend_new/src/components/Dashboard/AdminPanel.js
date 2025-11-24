import React from "react";

function AdminPanel() {
  return (
    <div>
      <h2>Admin Control Panel</h2>
      <p>Here you can manage users, models, and settings.</p>

      <div
        style={{
          background: "var(--card-bg)",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <p><strong>Example Features (to add later):</strong></p>
        <ul>
          <li>Manage user accounts</li>
          <li>View detection stats globally</li>
          <li>Upload new YOLO model weights</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
