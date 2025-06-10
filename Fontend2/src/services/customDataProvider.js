import { api } from "./auth";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials); // Gửi yêu cầu đăng nhập
  console.log("Login API response:", res); // In toàn bộ phản hồi để kiểm tra
  return res.data; // Trả về dữ liệu từ phản hồi
};
export const register = async (credentials) => {
  const res = await api.post("/auth/register", credentials); // Gửi yêu cầu đăng nhập
  console.log("Login API response:", res); // In toàn bộ phản hồi để kiểm tra
  return res.data; // Trả về dữ liệu từ phản hồi
};

export const getUsers = async () => {
  const res = await api.get("/users"); // Lấy danh sách người dùng
  return res.data; // Trả về dữ liệu người dùng
};

export default api; // Xuất api instance để sử dụng lại
