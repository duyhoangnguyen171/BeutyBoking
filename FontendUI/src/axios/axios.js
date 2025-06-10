import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7169/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      // Server trả về response với status code nằm ngoài range 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("No response received:", error.request);
      return Promise.reject({ message: "Không thể kết nối đến server" });
    } else {
      // Có lỗi khi setting up request
      console.error("Error setting up request:", error.message);
      return Promise.reject({ message: "Lỗi kết nối" });
    }
  }
);

export default axiosInstance;
