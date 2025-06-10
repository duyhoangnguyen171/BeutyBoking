import React, { useState } from "react";
import WorkShiftService from "../../services/WorkShiftService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../asset/styles/workshift/WorkShiftCreate.css";

const WorkShiftCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    dayOfWeek: 0, // vẫn dùng nội bộ để hiển thị nếu cần
    startTime: "08:00",
    endTime: "22:00",
    maxUsers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxUsers" ? parseInt(value) : value,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const weekday = selectedDate.getDay();
    setFormData((prev) => ({
      ...prev,
      date: e.target.value,
      dayOfWeek: weekday,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Tên ca làm không được để trống.");
      return;
    }

    if (formData.maxUsers <= 0) {
      toast.error("Số lượng người tối đa phải lớn hơn 0.");
      return;
    }

    if (!formData.date) {
      toast.error("Vui lòng chọn ngày làm việc.");
      return;
    }

    // Chỉ gửi những thuộc tính đúng định nghĩa DTO
    const { name, date, startTime, endTime, maxUsers } = formData;
    const payload = { name, date, startTime, endTime, maxUsers };

    try {
      await WorkShiftService.create(payload);
      toast.success("Tạo ca làm thành công!");
      // setTimeout(() => navigate("/admin/workshifts"), 3500);
    } catch (err) {
      console.error("Lỗi tạo ca làm:", err);
      if (err.response?.status === 401) {
        toast.error("Bạn không có quyền thực hiện hành động này.");
      } else {
        toast.error("Đã xảy ra lỗi khi tạo ca làm.");
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tạo Ca Làm</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>Tên ca làm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Chọn ngày:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            required
          />
        </div>

        <div>
          <label>Số lượng người tối đa:</label>
          <input
            type="number"
            name="maxUsers"
            value={formData.maxUsers}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Giờ bắt đầu:</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Giờ kết thúc:</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Lưu</button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default WorkShiftCreate;
