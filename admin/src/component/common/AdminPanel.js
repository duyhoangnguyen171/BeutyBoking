import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../index.css";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const AdminPanel = () => {
  useEffect(() => {
    document.title = "Trang quản lý";
  }, []);
  
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Optional header bar */}
        {/* <div className="admin-header">
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div> */}
        
        {/* Outlet wrapper with proper overflow handling */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;