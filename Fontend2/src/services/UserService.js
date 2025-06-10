import { api, getAuthHeader } from "./auth";

// Lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/Users/${id}`, getAuthHeader());
    if (response.status === 401) {
      throw new Error("Token không hợp lệ hoặc hết hạn");
    }
    return response.data;
  } catch (error) {
    console.error("Chi tiết lỗi:", {
      config: error.config, // Log request config
      response: error.response?.data,
    });
    throw error;
  }
};

export const getStaff = async () => {
  const res = await api.get("/Users/GetStaffs");
  return res.data;
};

// Cập nhật người dùng
// , data
export const updateUser = (userId, data) => {
  const token = localStorage.getItem("token"); // hoặc sessionStorage tùy bạn lưu ở đâu
  return api.post(`/Users/PutUser`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getCustomerByPhone = async (phone) => {
  const res = await api.get(
    `/Users/get-customer-by-phone?phone=${phone}`,
    getAuthHeader()
  );
  return res.data?.$values || res.data;
};

//tao khach van lai
export const createGuest = async (data) => {
  try {
    // Nếu không có email, gán giá trị null
    if (!data.email) {
      data.email = null; // Gửi email là null
    }

    // In ra dữ liệu gửi đi để kiểm tra

    const response = await api.post(
      "/Users/guest", // Đảm bảo URL đúng
      data, // Dữ liệu gửi đi
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
        },
      }
    );

    // Trả về dữ liệu khách vãng lai vừa tạo
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo khách vãng lai:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi ra ngoài để xử lý
  }
};
