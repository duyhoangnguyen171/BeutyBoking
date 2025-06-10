// src/component/common/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Giải quyết cả 2 cách đặt role trong token
    const rawRole =
      payload["role"] ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!rawRole) {
      console.warn("Không tìm thấy role trong token");
      return <Navigate to="/login" />;
    }

    const role = rawRole.toLowerCase();

    if (role !== allowedRole.toLowerCase()) {
      console.warn(`Role "${role}" không được phép vào "${allowedRole}"`);
      return <Navigate to="/login" />;
    }

    return <Outlet />;

  } catch (err) {
    console.error("Lỗi khi decode token:", err);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
