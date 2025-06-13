import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import serviceService from "../../services/Serviceservice";

const PopularServicesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    serviceService.getPopularServices()
      .then((res) => {
        const values = res.data?.$values || res.data;

        // Lấy top 5 dịch vụ phổ biến nhất
        const top5 = values
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setData(top5);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu dịch vụ phổ biến:", err));
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ marginBottom: "1rem" }}>Dịch vụ được đặt nhiều nhất</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularServicesChart;
