import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "https://localhost:7169/api", // URL của API
});
const API_URL = "https://localhost:7169/api/appointments";
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
  return localStorage.getItem("token");
};

// Đảm bảo rằng token được thiết lập vào header nếu có khi app load
const token = getToken(); // Lấy token từ localStorage (hoặc sessionStorage)
if (token) {
  setAuthToken(token); // Nếu có token, thêm vào header
}

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

// AppointmentService.js
const AppointmentService = {
  getAll: () => api.get("/appointments", getAuthHeader()),
  getByUserId: (userId) => api.get(`/appointments/user/${userId}`),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointmentData) => {
  const token = JSON.parse(localStorage.getItem("token"));
  return api.post("/appointments", appointmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
},
  update: (id, appointmentData) =>
    api
      .put(`/appointments/${id}`, appointmentData, getAuthHeader())
      .catch((err) => {
        console.error("Update request failed:", err.response || err);
        throw err;
      }),
  cancelAppointment(appointmentId) {
    return axios.put(
      `${API_URL}/${appointmentId}/cancel`,
      { status: 4 },
      getAuthHeader()
    );
  },
  getCanceled: () => api.get("/appointments?status=4", getAuthHeader()),
  delete: (id) => api.delete(`/appointments/${id}`, getAuthHeader()),
};

export default AppointmentService;
