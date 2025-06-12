import axios from 'axios';

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: 'https://localhost:7169/api',
});

// Hàm để thiết lập token vào header Authorization
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

const CategoriesService = {
  // Lấy tất cả danh mục
  getAll: async () => {
    try {
      const response = await api.get("/categories", getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh mục theo ID:", error);
      throw error;
    }
  },

  // Thêm danh mục mới
  create: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo danh mục mới:", error);
      throw error;
    }
  },

  // Cập nhật danh mục
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      throw error;
    }
  },

  // Xóa danh mục
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  },
};

export default CategoriesService;
