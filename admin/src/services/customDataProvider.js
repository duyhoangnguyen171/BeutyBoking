import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7169/api", 
});

export const setAuthToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
};

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials); 
  return res.data; 
};

export const getUsers = async () => {
  const res = await api.get("/users"); 
  return res.data; // Trả về dữ liệu người dùng
};

export default api;  
