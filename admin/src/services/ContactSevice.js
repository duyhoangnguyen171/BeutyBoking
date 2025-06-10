// src/component/ContactService.js
import api from '../services/customDataProvider';  // Import the correct 'api' instance

const ContactService = {
  getAll: () => api.get("/Contact"),  // Use 'api' instead of 'axiosInstance'
  getById: (id) => api.get(`/Contact/${id}`),
  create: (contactData) => api.post("/Contact", contactData),
  delete: (id) => api.delete(`/Contact/${id}`),
};

export default ContactService;
