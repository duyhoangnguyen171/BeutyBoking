import React, { useContext, useState } from "react";
// import { setAuthToken } from "../services/authService";
import { login, setAuthToken } from "../services/customDataProvider";
// import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(AppContext);
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email,
        password,
      };
      console.log("Data Input", data); // In ra console để kiểm tra
      // Gửi yêu cầu đăng nhập và nhận phản hồi
      const res = await login(data);
      console.log("Login response:", res);

      const token = res.token; // Chỉ lấy token từ phản hồi
      const user = res.user;
      if (!token) {
        alert("Token không hợp lệ.");
        return;
      }
      setAuthToken(token);
      setToken(token); // Gán token vào state
      setUser(user); // Gán user vào state
      // handleLogin(token); // Lưu token vào context
      toast.success("Đăng nhập thành công");

      // alert("Đăng nhập  thành công");
      navigate("/");
    } catch (err) {
      // Xử lý lỗi nếu đăng nhập thất bại
      toast.error("Đăng nhập thất bại");
      // setToken(null);
      console.error("Login error:", err);
      localStorage.removeItem("user");
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center " onSubmit={submitLogin}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-300  rounded-2xl text-sm shadow-lg  ">
        <p className="text-2xl font-semibold">Login</p>
        <p className="">Plase log in to bool appointment</p>

        <div className="w-full">
          <p className="">Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p className="">Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="bg-blue-500 w-full px-4 py-3 rounded-2xl hover:bg-blue-300 text-white cursor-pointer">
          Login
        </button>

        <p>
          Don't have an account ?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 underline cursor-pointer ml-2"
          >
            Sign up here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
