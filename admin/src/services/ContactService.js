import axios from 'axios';

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: 'https://localhost:7169/api',
});

// Lấy token từ localStorage và thiết lập header
const getAuthHeader = () => {
  const rawToken = localStorage.getItem("token");
  if (!rawToken) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }

  const token = rawToken.replace(/^"|"$/g, "");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Tự động gán token nếu có khi khởi tạo
const token = localStorage.getItem("token");
if (token) {
  const cleanToken = token.replace(/^"|"$/g, "");
  api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
}

const ContactService = {
  // Lấy tất cả liên hệ
  getAll: () => api.get("/Contact", getAuthHeader()),

  // Lấy liên hệ theo ID
  getById: (id) => api.get(`/Contact/${id}`, getAuthHeader()),

  // Thêm liên hệ mới
  create: (contactData) => api.post("/Contact", contactData, getAuthHeader()),

  // Xóa liên hệ theo ID
  delete: (id) => api.delete(`/Contact/${id}`, getAuthHeader()),
};

export default ContactService;