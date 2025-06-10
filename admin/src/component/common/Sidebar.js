import React from "react";
import "../../index.css";
import { Link } from "react-router-dom";

// Hàm lấy role từ localStorage hoặc từ token
const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return (payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])?.toLowerCase();
  } catch (err) {
    console.error("Invalid token format", err);
    return null;
  }
};

const Sidebar = () => {
  const role = getRole(); // Lấy role hiện tại
  const basePath = role === "admin" ? "/admin" : "/staff";

  return (
    <div className="sidebar">
      <h2>Quản Trị</h2>
      <Link to={`${basePath}/users`} className="nav-item">
        Người dùng
      </Link>
      <Link to={`${basePath}/appointments`} className="nav-item">
        Lịch hẹn
      </Link>
      <Link to={`${basePath}/services`} className="nav-item">
        Dịch vụ
      </Link>
      <Link to={`${basePath}/workshifts`} className="nav-item">
        Ca làm
      </Link>
      <Link to={`${basePath}/contact`} className="nav-item">
        Liên hệ
      </Link>
    </div>
  );
};

export default Sidebar;
