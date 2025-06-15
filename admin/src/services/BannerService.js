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

const BannerService = {
  // Lấy tất cả banner
  getAll: () => api.get("/Banner", getAuthHeader()),

  // Lấy banner theo ID
  getById: (id) => api.get(`/Banner/${id}`, getAuthHeader()),

  // Tạo banner mới
  create: (bannerData) => api.post("/Banner", bannerData, getAuthHeader()),

  // Cập nhật banner theo ID
  update: (id, bannerData) => api.put(`/Banner/${id}`, bannerData, getAuthHeader()),

  // Xóa banner theo ID
  delete: (id) => api.delete(`/Banner/${id}`, getAuthHeader()),
};

export default BannerService;
