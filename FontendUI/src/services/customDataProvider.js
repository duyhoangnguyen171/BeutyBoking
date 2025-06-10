import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7169/api", // Đảm bảo base URL khớp với Swagger API của bạn
});

export const setAuthToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Thiết lập token xác thực
};

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials); // Gửi yêu cầu đăng nhập
  console.log("Login API response:", res); // In toàn bộ phản hồi để kiểm tra
  return res.data; // Trả về dữ liệu từ phản hồi
};

export const getUsers = async () => {
  const res = await api.get("/users"); // Lấy danh sách người dùng
  return res.data; // Trả về dữ liệu người dùng
};

export default api; // Xuất api instance để sử dụng lại
