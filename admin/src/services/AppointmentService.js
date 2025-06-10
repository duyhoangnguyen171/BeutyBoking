import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "https://localhost:7169/api",
});

// Hàm thiết lập token vào header Authorization
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Hàm lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Thiết lập token khi app load
const token = getToken();
if (token) {
  setAuthToken(token);
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, proceeding without Authorization header.");
    return { headers: { "Content-Type": "application/json" } };
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// AppointmentService
const AppointmentService = {
  getAll: ({
    page = 1,
    pageSize = 10,
    excludeCanceled = false,
    sort = "",
  } = {}) => {
    let url = `/appointments?page=${page}&pageSize=${pageSize}`;
    if (excludeCanceled) url += "&status!=4";
    if (sort) url += `&sort=${sort}`;
    return api.get(url, getAuthHeader()).catch((err) => {
      console.error("Get all appointments failed:", err.response || err);
      throw err;
    });
  },
  getByUserId: (userId) =>
    api.get(`/appointments/user/${userId}`, getAuthHeader()).catch((err) => {
      console.error("Get appointments by user ID failed:", err.response || err);
      throw err;
    }),
  getById: (id) =>
    api.get(`/appointments/${id}`, getAuthHeader()).catch((err) => {
      console.error("Get appointment by ID failed:", err.response || err);
      throw err;
    }),
  create: (appointmentData) =>
    api.post("/appointments", appointmentData, getAuthHeader()).catch((err) => {
      console.error("Create appointment failed:", err.response || err);
      throw err;
    }),
  update: (id, appointmentData) =>
    api
      .put(`/appointments/${id}`, appointmentData, getAuthHeader())
      .catch((err) => {
        console.error("Update appointment failed:", err.response || err);
        throw err;
      }),
  cancelAppointment: (appointmentId) =>
    api
      .put(
        `/appointments/${appointmentId}/cancel`,
        { status: 4 },
        getAuthHeader()
      )
      .catch((err) => {
        console.error(
          `Cancel appointment ${appointmentId} failed:`,
          err.response || err
        );
        throw err;
      }),
  getCanceled: () =>
    api.get("/appointments?status=4", getAuthHeader()).catch((err) => {
      console.error("Get canceled appointments failed:", err.response || err);
      throw err;
    }),
  delete: (id) =>
    api.delete(`/appointments/${id}`, getAuthHeader()).catch((err) => {
      console.error("Delete appointment failed:", err.response || err);
      throw err;
    }),
  updateStatus: (appointmentId, newStatus) =>
    api
      .put(
        `/appointments/${appointmentId}/status`,
        { status: newStatus },
        getAuthHeader()
      )
      .catch((err) => {
        console.error(
          `Update status for appointment ${appointmentId} failed:`,
          err.response || err
        );
        throw err;
      }),
};

export default AppointmentService;
