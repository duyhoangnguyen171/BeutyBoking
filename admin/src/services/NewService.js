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

const NewService = {
  // Lấy tất cả bài viết
  getAll: () => api.get("/News", getAuthHeader()),

  // Lấy bài viết theo ID
  getById: (id) => api.get(`/News/${id}`, getAuthHeader()),

  // Thêm bài viết mới
  create: (newsData) => api.post("/News", newsData, getAuthHeader()),

  // Cập nhật bài viết theo ID
  update: (id, newsData) => api.put(`/News/${id}`, newsData, getAuthHeader()),

  // Xóa bài viết theo ID
  delete: (id) => api.delete(`/News/${id}`, getAuthHeader()),
};

export default NewService;
