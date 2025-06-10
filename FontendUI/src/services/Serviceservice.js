import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "https://localhost:7169/api",
});
// Hàm lấy token và trả về header Authorization
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};
// Hàm này sẽ thiết lập token vào header Authorization
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"]; // Nếu không có token, xóa header
  }
};

// Hàm để lấy token từ localStorage (hoặc sessionStorage) nếu có
export const getToken = () => {
  return localStorage.getItem("token"); // Lấy token từ localStorage
};

// Đảm bảo rằng token được thiết lập vào header nếu có khi app load
const token = getToken(); // Lấy token từ localStorage (hoặc sessionStorage)
if (token) {
  setAuthToken(token); // Nếu có token, thêm vào header
}

const ServiceService = {
  getAll: () => api.get("/services", getAuthHeader),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post("/services", serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

export default ServiceService;
