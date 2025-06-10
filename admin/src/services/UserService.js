import axios from 'axios';
const BASE_URL = "https://localhost:7169/api";
const GET_BY_PHONE_URL = `${BASE_URL}/Users/get-customer-by-phone`;
const API_URL = 'https://localhost:7169/api/Users';

const token = localStorage.getItem('authToken');
// Lấy token từ localStorage
const getToken = () => localStorage.getItem('token');
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
// Cấu hình header cho request, kèm token Authorization
const authHeader = () => {
  const token = getToken();
  if (!token) {
    console.warn('⚠️ No token found in localStorage');
  }
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
};

// Lấy danh sách người dùng
export const getUsers = () => {
  return axios.get(API_URL, authHeader()).then(res => res.data);
};

// Lấy thông tin người dùng theo ID
export const getUserById = (id) => {
  return axios.get(`${API_URL}/${id}`, authHeader()).then(res => res.data);
};

// Cập nhật người dùng
// , data
export const updateUser = (userId,data) => {

  const token = localStorage.getItem("token"); // hoặc sessionStorage tùy bạn lưu ở đâu
  return axios.post(
    `https://localhost:7169/api/Users/PutUser`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getCustomerByPhone = async (phone) => {
   const res = await axios.get(`${GET_BY_PHONE_URL}?phone=${phone}`, getAuthHeader());
  return res.data?.$values || res.data;
};
// Xóa người dùng
export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`, authHeader()).then(res => res.data);
};
export const addUser = (data) => {
  return axios.post("https://localhost:7169/api/Auth/register", data, authHeader())
    .then(res => res.data);
};
export const getStaff = async () => {
  try {
    const response = await axios.get(
      'https://localhost:7169/api/Users',
      getAuthHeader() // dùng hàm để thêm headers
    );

    const staffList = response.data.$values.filter(
      (user) => user.role.toLowerCase() === 'staff'
    );
    return staffList;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    throw error;
  }
};
//tao khach van lai
export const createGuest = async (data) => {
  try {
    // Nếu không có email, gán giá trị null
    if (!data.email) {
      data.email = null;  // Gửi email là null
    }

    // In ra dữ liệu gửi đi để kiểm tra
    console.log("Dữ liệu gửi đi khi tạo khách vãng lai:", data);

    const response = await axios.post(
      'https://localhost:7169/api/Users/guest', // Đảm bảo URL đúng
      data, // Dữ liệu gửi đi
      {
        headers: {
          'Content-Type': 'application/json', // Đảm bảo Content-Type là application/json
        }
      }
    );

    // Trả về dữ liệu khách vãng lai vừa tạo
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo khách vãng lai:", error.response?.data || error.message);
    throw error; // Ném lỗi ra ngoài để xử lý
  }
};

