import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../asset/styles/sidebar.css";

const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return (
      payload.role ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    )?.toLowerCase();
  } catch (err) {
    console.error("Invalid token format", err);
    return null;
  }
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = getRole();
  const basePath = role === "admin" ? "/admin" : "/staff";

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h1>Quản Trị</h1>
        <Link to={`${basePath}/dashboards`} className="nav-item">Dashboard</Link>
        <Link to={`${basePath}/users`} className="nav-item">Người dùng</Link>
        <Link to={`${basePath}/appointments`} className="nav-item">Lịch hẹn</Link>
        <Link to={`${basePath}/services`} className="nav-item">Dịch vụ</Link>
        <Link to={`${basePath}/workshifts`} className="nav-item">Ca làm</Link>
        <Link to={`${basePath}/contact`} className="nav-item">Liên hệ</Link>
        <Link to={`${basePath}/news`} className="nav-item">Tin tức</Link>
      </div>
    </>
  );
};

export default Sidebar;
