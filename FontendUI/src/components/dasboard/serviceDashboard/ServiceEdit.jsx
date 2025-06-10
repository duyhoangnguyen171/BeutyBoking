import React, { useEffect, useState } from "react";
import ServiceService from "../../../services/serviceServices";
import axios from "axios";

const getToken = () => localStorage.getItem("token");

const ServiceEdit = ({ open, onClose, serviceId, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    price: "",
    description: "",
    durationMinutes: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch service data
  useEffect(() => {
    const fetchServiceData = async () => {
      if (open && serviceId) {
        setIsLoading(true);
        try {
          const response = await ServiceService.getById(serviceId);
          const { id, name, price, description, durationMinutes } =
            response.data;
          setFormData({
            id: id || 0,
            name: name || "",
            price: price || "",
            description: description || "",
            durationMinutes: durationMinutes || "",
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
          setErrors({ fetchError: "Không thể tải thông tin dịch vụ" });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchServiceData();
  }, [open, serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên dịch vụ";
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Giá dịch vụ phải là số dương";
    }

    if (
      isNaN(formData.durationMinutes) ||
      Number(formData.durationMinutes) <= 0
    ) {
      newErrors.durationMinutes = "Thời gian phải là số phút dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = getToken();
    if (!token) {
      setErrors({ auth: "Vui lòng đăng nhập để cập nhật dịch vụ" });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        id: serviceId,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        durationMinutes: Number(formData.durationMinutes),
      };

      await axios.put(
        `https://localhost:7169/api/Services/${serviceId}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error);
      setErrors({
        submit: error.response?.data?.message || "Cập nhật dịch vụ thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Cập nhật dịch vụ
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Error messages */}
              {(errors.fetchError || errors.auth || errors.submit) && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {errors.fetchError || errors.auth || errors.submit}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên dịch vụ *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giá (VND) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="durationMinutes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thời gian (phút) *
                  </label>
                  <input
                    id="durationMinutes"
                    name="durationMinutes"
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.durationMinutes
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.durationMinutes && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.durationMinutes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </span>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ServiceEdit;
