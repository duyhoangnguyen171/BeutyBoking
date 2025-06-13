import { useEffect, useState } from "react";
import { getTopReturningCustomers } from "../../services/UserService";

const TopReturningCustomers = () => {
  const [customers, setCustomers] = useState([]);

useEffect(() => {
    getTopReturningCustomers()
      .then((data) => {
        setCustomers(data.$values); // LẤY đúng mảng
      })
      .catch((err) => {
        console.error("Lỗi khi tải top khách hàng:", err);
        setCustomers([]); // fallback rỗng để tránh lỗi map
      });
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <h4>Khách quay lại nhiều nhất</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {customers.map((cust, idx) => (
          <li key={idx} style={{
            background: "#fff",
            marginBottom: "0.5rem",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <strong>{cust.fullName}</strong> – {cust.visits} lần
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopReturningCustomers;
