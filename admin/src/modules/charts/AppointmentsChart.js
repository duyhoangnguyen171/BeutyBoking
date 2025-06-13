import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AppointmentsChart = ({ dailyData, weeklyData, monthlyData }) => {
  const [mode, setMode] = useState("daily");

  const chartData =
    mode === "daily"
      ? dailyData
      : mode === "weekly"
      ? weeklyData
      : monthlyData;

  const xKey =
    mode === "daily" ? "date" : mode === "weekly" ? "week" : "month";

  const title =
    mode === "daily"
      ? "Số lượng lịch hẹn theo ngày"
      : mode === "weekly"
      ? "Số lượng lịch hẹn theo tuần"
      : "Số lượng lịch hẹn theo tháng";

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            padding: "6px 12px",
            minWidth: "120px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="daily">Theo ngày</option>
          <option value="weekly">Theo tuần</option>
          <option value="monthly">Theo tháng</option>
        </select>
      </div>

      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AppointmentsChart;
