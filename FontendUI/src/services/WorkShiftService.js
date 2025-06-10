// src/services/WorkShiftService.js

import axios from "axios";

const BASE_URL = "https://localhost:7169/api";
const API_URL = `${BASE_URL}/WorkShifts`;
const API_URL_ARS= `${BASE_URL}/UserWorkShift`;
const STAFF_NOT_REGISTERED_URL = `${BASE_URL}/UserWorkShift/staff-not-registered`;
const REGISTER_URL = `${BASE_URL}/UserWorkShift/Register`;
const BOOKED_BY_STAFF_URL = `${BASE_URL}/Users/bookedByStaff`;

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

const WorkShiftService = {
  // Lấy tất cả ca làm
getAll: async () => {
  try {
    const authHeader = getAuthHeader();
    console.log("📌 Header gửi đi:", authHeader); // 👈 Xem token ở đây
    const res = await axios.get(API_URL, authHeader);
    console.log("✅ Dữ liệu lấy được từ API:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách ca làm:", error);
    throw error;
  }
},


  // Lấy ca làm theo ID
  getById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi khi lấy ca làm với ID ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh sách nhân viên chưa đăng ký ca làm
  getStaffNotRegistered: async (workShiftId) => {
    try {
      const res = await axios.get(
        `${STAFF_NOT_REGISTERED_URL}/${workShiftId}`,
        getAuthHeader()
      );
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi gọi API getStaffNotRegistered:", error);
      return [];
    }
  },

  // Đăng ký ca làm
  registerShift: async (workShiftId, userId) => {
    try {
      const data = { workShiftId };

      // Chỉ nếu là admin thì gửi thêm userId
      if (userId !== undefined && userId !== null) {
        data.userId = userId; // đúng tên theo backend
      }

      const res = await axios.post(REGISTER_URL, data, getAuthHeader());
      return res.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi đăng ký ca làm:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Gán nhân viên vào ca làm
  assignStaff: async (shiftId, appointmentId, staffId) => {
    try {
      await axios.post(
        `${API_URL}/${shiftId}/assign`,
        { appointmentId, staffId },
        getAuthHeader()
      );
    } catch (error) {
      console.error("❌ Lỗi khi gán nhân viên:", error);
      throw error;
    }
  },
  approveStaff: async (workshiftId, userId) => {
  const authHeader = getAuthHeader();

  const response = await axios.put(
    `${API_URL_ARS}/Approve`,
    null,
    {
      params: {
        workShiftId: workshiftId,
        userId: userId,
      },
      headers: authHeader.headers,
    }
  );

  return response.data;
},

  // Lấy ca làm theo StaffId
  getByStaffId: async (staffId) => {
    try {
      const res = await axios.get(
        `${API_URL}/staff/${staffId}`,
        getAuthHeader()
      );
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi khi lấy ca làm cho staffId ${staffId}:`, error);
      throw error;
    }
  },

  // Tạo ca làm mới
  create: async (data) => {
    try {
      console.log("📤 Dữ liệu gửi đi:", data);
      await axios.post(`${API_URL}/by-type`, data, getAuthHeader());
    } catch (error) {
      console.error("❌ Lỗi khi tạo ca làm mới:", error);
      throw error;
    }
  },

  // Cập nhật ca làm
  update: async (id, data) => {
    try {
      console.log("📤 Dữ liệu cập nhật:", data);
      await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật ca làm với ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa ca làm
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    } catch (error) {
      console.error(`❌ Lỗi khi xóa ca làm với ID ${id}:`, error);
      throw error;
    }
  },

  // Lấy các ca đã được nhân viên đặt
  getBookedByStaffId: async (staffId) => {
    try {
      const res = await axios.get(
        `${BOOKED_BY_STAFF_URL}/${staffId}`,
        getAuthHeader()
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy các ca đã đặt cho staffId ${staffId}:`,
        error
      );
      throw error;
    }
  },
};

export default WorkShiftService;
