import axios from 'axios';

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: 'https://localhost:7169/api',
});

const getAuthHeader = () => {
  const rawToken = localStorage.getItem("token");
  if (!rawToken) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }

  // Loại bỏ dấu ngoặc kép nếu có
  const token = rawToken.replace(/^"|"$/g, "");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Hàm để thiết lập token vào header Authorization
export const setAuthToken = (token) => {
  if (token) {
    const cleanToken = token.replace(/^"|"$/g, "");
    api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Hàm để lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Đảm bảo rằng token được thiết lập vào header nếu có khi app load
const token = getToken();
if (token) {
  setAuthToken(token);
}

const ServiceService = {
  getAll: () => api.get("/services", getAuthHeader()),
  getById: (id) => api.get(`/services/${id}`, getAuthHeader()),
  create: (serviceData) => api.post("/services", serviceData, getAuthHeader()),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData, getAuthHeader()),
  delete: (id) => api.delete(`/services/${id}`, getAuthHeader()),
};

export default ServiceService;