import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../../services/customDataProvider";
import "../../asset/styles/auth/login.css"; // Import CSS

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const token = res.token;

      if (!token) {
        alert("Token không hợp lệ.");
        return;
      }

      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const role = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (!role || (role.toLowerCase() !== "admin" && role.toLowerCase() !== "staff")) {
        alert("Bạn không có quyền truy cập.");
        return;
      }

      localStorage.setItem("token", token);
      setAuthToken(token);

      if (role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/staff");
      }
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu.");
      console.error("Login error:", err);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Mật khẩu"
        required
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default LoginForm;
