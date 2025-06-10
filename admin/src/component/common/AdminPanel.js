import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../index.css";
import Sidebar from "./Sidebar";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Nút đăng xuất */}
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
