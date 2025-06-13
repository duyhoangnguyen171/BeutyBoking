import { useEffect, useState } from "react";
import AppointmentsChart from "../charts/AppointmentsChart";
import PopularServicesChart from "../charts/PopularServicesChart";
import TopReturningCustomers from "../charts/TopReturningCustomers";
import ShiftStatsCard from "../charts/ShiftStatsCard"; // hiển thị số ca làm
import AppointmentService from "../../services/AppointmentService";
import "../../asset/styles/dashboard/dashboard.css";
const Dashboard = () => {
  // Giả lập dữ liệu mẫu
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    AppointmentService.getAppointmentStatistics("day").then(setDailyData);
    AppointmentService.getAppointmentStatistics("week").then(setWeeklyData);
    AppointmentService.getAppointmentStatistics("month").then(setMonthlyData);
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard Thống Kê</h2>

      <div className="chart-container">
        <ShiftStatsCard title="Ca hôm nay" value={3} />
        <ShiftStatsCard title="Ca tuần này" value={18} />
        <ShiftStatsCard title="Người đã đăng ký" value={42} />
      </div>

      <div className="chart-card">
        <AppointmentsChart
          dailyData={dailyData}
          weeklyData={weeklyData}
          monthlyData={monthlyData}
        />
      </div>

      <div className="chart-footer">
        <PopularServicesChart />
        <TopReturningCustomers />
      </div>
    </div>
  );
};

export default Dashboard;
