// src/modules/charts/ShiftStatsCard.js
import React from "react";

const cardStyle = {
  backgroundColor: "#f5f5f5",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  flex: 1,
  textAlign: "center",
};

const ShiftStatsCard = ({ title, value }) => {
  return (
    <div style={cardStyle}>
      <h4>{title}</h4>
      <h2 style={{ color: "#1976d2" }}>{value}</h2>
    </div>
  );
};

export default ShiftStatsCard;
