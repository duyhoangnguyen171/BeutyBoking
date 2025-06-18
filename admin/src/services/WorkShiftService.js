// src/services/WorkShiftService.js

import axios from "axios";

const BASE_URL = "https://localhost:7169/api";
const API_URL = `${BASE_URL}/WorkShifts`;
const API_URL_ARS = `${BASE_URL}/UserWorkShift`;
const STAFF_NOT_REGISTERED_URL = `${BASE_URL}/UserWorkShift/staff-not-registered`;
const REGISTER_URL = `${BASE_URL}/UserWorkShift/Register`;
const BOOKED_BY_STAFF_URL = `${BASE_URL}/Users/bookedByStaff`;

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

const WorkShiftService = {
  // Lấy tất cả ca làm
  getAll: async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
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
  assignStaff: async (appointmentId, newStaffId) => {
    try {
      // Đảm bảo URL là chính xác và sử dụng query parameters
      await axios.put(
        `${BASE_URL}/UserWorkShift/AssignStaff?appointmentId=${appointmentId}&newStaffId=${newStaffId}`,
        getAuthHeader()  // Cung cấp header xác thực nếu cần
      );
    } catch (error) {
      console.error("Lỗi khi gán nhân viên:", error);
      throw error;
    }
  },
  approveStaff: async (workshiftId, userId) => {
    const authHeader = getAuthHeader();

    const response = await axios.put(`${API_URL_ARS}/Approve`, null, {
      params: {
        workShiftId: workshiftId,
        userId: userId,
      },
      headers: authHeader.headers,
    });

    return response.data;
  },
   getAvailableStaff : async (timeSlotId) => {
  try {
    const response = await axios.get(`/api/StaffTimeSlots/GetAvailableStaff/${timeSlotId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available staff:', error);
    throw error;
  }
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
      await axios.post(`${API_URL}/with-time-slots`, data, getAuthHeader());
    } catch (error) {
      console.error("❌ Lỗi khi tạo ca làm mới:", error);
      throw error;
    }
  },
  getStaffByDate: async (date) => {
    try {
      const formattedDate = new Date(date).toISOString(); // Đảm bảo chuyển ngày thành định dạng chuẩn ISO
      const res = await axios.get(
        `${API_URL}/getStaffByDate/${formattedDate}`, // Điều chỉnh URL API theo yêu cầu của bạn
        getAuthHeader()
      );
      return res.data; // Dữ liệu trả về là danh sách nhân viên
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy danh sách nhân viên đăng ký vào ngày ${date}:`,
        error
      );
      throw error;
    }
  },
  getTimeSlotsByStaffAndDate: async (staffId, date) => {
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0]; // ✅ chỉ lấy yyyy-MM-dd
      const res = await axios.get(
        `${BASE_URL}/WorkShifts/GetAvailableTimeSlots/${staffId}/${formattedDate}`,
        getAuthHeader()
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy danh sách time slots của nhân viên ${staffId} vào ngày ${date}:`,
        error
      );
      throw error;
    }
  },
  getWorkShiftId: async (staffId, date) => {
    const res = await axios.get(
      `https://localhost:7169/api/WorkShifts/GetWorkShiftId?staffId=${staffId}&date=${date}`,
      getAuthHeader()
    );
    return res.data;
  },

  // Cập nhật ca làm
  update: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid work shift ID");
    }
    try {
      console.log("📤 Dữ liệu cập nhật:", data);
      const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật ca làm với ID ${id}:`, error);
      throw error.response?.data?.message || error.message;
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
  moveToHistory: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/move-to-history/${id}`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi chuyển ca làm vào lịch sử:", error);
      throw error;
    }
  },
  // src/services/WorkShiftService.js

  getHistory : async () => {
    try {
      const response = await axios.get(
        `${API_URL}/history`,
        getAuthHeader()
      );

      // Kiểm tra xem API trả về có thuộc tính $values hay không
      if (response.data && Array.isArray(response.data.$values)) {
        return response.data.$values; // Trả về mảng trong $values
      } else {
        console.error("API trả về dữ liệu không hợp lệ:", response.data);
        return []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ca làm:", error);
      throw error;
    }
  },
};

export default WorkShiftService;
