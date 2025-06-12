import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkShiftService from "../../services/WorkShiftService"; // Import service

const WorkShiftEdit = ({ open = true, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL

  const [formData, setFormData] = useState({
    name: "",
    shiftType: 0, // 0 - sáng, 1 - chiều, 2 - tối
    date: "",
    dayOfWeek: 0,
    maxUsers: 1,
    startTime: "08:00", // Default start time
    endTime: "22:00", // Default end time
  });

  const [loading, setLoading] = useState(false); // Loading state for async operations
  const [error, setError] = useState(""); // For error messages

  // Toast utility function for better code reuse
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "center-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Fetch data when form opens and the ID is available
  useEffect(() => {
    const fetchWorkShift = async () => {
      if (!id || isNaN(id)) {
        setError("ID ca làm không hợp lệ.");
        showToast("ID ca làm không hợp lệ.");
        return;
      }

      try {
        const response = await WorkShiftService.getById(id);
        const shift = response.data || response;

        const dayOfWeek = Number(shift.dayOfWeek) || 0;
        if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
          throw new Error("Invalid dayOfWeek value");
        }

        const today = new Date();
        const currentDay = today.getDay();
        const diff = dayOfWeek - currentDay;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        if (isNaN(targetDate.getTime())) {
          throw new Error("Invalid date calculated");
        }

        const formattedDate = targetDate.toISOString().split("T")[0];

        setFormData({
          name: shift.name || "",
          shiftType: Number(shift.shiftType) || 0,
          date: formattedDate,
          dayOfWeek: dayOfWeek,
          maxUsers: Number(shift.maxUsers) || 1,
          startTime: shift.startTime || "08:00",
          endTime: shift.endTime || "22:00",
        });
      } catch (err) {
        setError("Không thể tải thông tin ca làm.");
        showToast("Không thể tải thông tin ca làm.");
      }
    };

    fetchWorkShift();
  }, [id]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "maxUsers" || name === "shiftType" ? Number(value) : value;

    const updatedFormData = {
      ...formData,
      [name]: newValue,
    };

    console.log("Updated formData:", updatedFormData); // ← Log dữ liệu mới

    setFormData(updatedFormData);
  };

  // Handle date field change
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (isNaN(selectedDate.getTime())) {
      setError("Ngày không hợp lệ.");
      showToast("Ngày không hợp lệ.");
      return;
    }
    const weekday = selectedDate.getDay();
    setFormData((prev) => ({
      ...prev,
      date: e.target.value,
      dayOfWeek: weekday,
    }));
  };

  // Handle save form data
  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error messages

    // Validation checks
    if (!formData.name.trim()) {
      setError("Tên ca làm không được để trống.");
      showToast("Tên ca làm không được để trống.");
      return;
    }
    if (formData.maxUsers <= 0) {
      setError("Số lượng người tối đa phải lớn hơn 0.");
      showToast("Số lượng người tối đa phải lớn hơn 0.");
      return;
    }
    if (!formData.date) {
      setError("Vui lòng chọn ngày làm việc.");
      showToast("Vui lòng chọn ngày làm việc.");
      return;
    }

    // Validate startTime and endTime
    if (!formData.startTime || !formData.endTime) {
      setError("Vui lòng nhập thời gian bắt đầu và kết thúc.");
      showToast("Vui lòng nhập thời gian bắt đầu và kết thúc.");
      return;
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.startTime) ||
      !timeRegex.test(formData.endTime)
    ) {
      setError("Thời gian phải có định dạng HH:mm (ví dụ: 08:00).");
      showToast("Thời gian phải có định dạng HH:mm (ví dụ: 08:00).");
      return;
    }

    // Remove seconds (HH:mm)
    const startTime = formData.startTime.split(":").slice(0, 2).join(":");
    const endTime = formData.endTime.split(":").slice(0, 2).join(":");

    // Prepare the payload to send to the server
    const payload = {
      id: id,
      name: formData.name.trim(),
      maxUsers: formData.maxUsers,
      date: new Date(formData.date).toISOString(), // Make sure date is in ISO format
      startTime: startTime,
      endTime: endTime,
    };

    // Log the entire payload
    console.log("Payload data to be sent:", payload); // Log the payload

    try {
      setLoading(true); // Show loading while the request is being processed
      // Send data to backend (use the correct API endpoint)
      await WorkShiftService.update(id, payload);
      showToast("Cập nhật ca làm thành công!", "success");
      navigate("/admin/workshifts");
      if (onClose) onClose(); // Close modal or perform action after saving
    } catch (err) {
      setLoading(false);
      let errorMessage = err.message || "Đã xảy ra lỗi khi cập nhật ca làm.";

      // Handle errors based on response status
      if (err.response?.status === 400) {
        errorMessage =
          err.response.data.message ||
          "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (err.response?.status === 401) {
        errorMessage = "Bạn không có quyền thực hiện hành động này.";
      } else if (err.response?.status === 404) {
        errorMessage = "Ca làm không tồn tại.";
      } else if (err.response?.status === 415) {
        errorMessage = "Định dạng dữ liệu không được hỗ trợ.";
      }

      setError(errorMessage);
      showToast(errorMessage);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      name: "",
      shiftType: 0,
      date: "",
      dayOfWeek: 0,
      maxUsers: 1,
      startTime: "08:00",
      endTime: "22:00",
    });
    setError("");
    if (onClose) onClose();
    navigate("/admin/workshifts");
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh Sửa Ca Làm</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Tên ca làm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={!!error && formData.name.trim() === ""}
            helperText={error && formData.name.trim() === "" ? error : ""}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Chọn ngày"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            required
            InputLabelProps={{ shrink: true }}
            error={!!error && !formData.date}
            helperText={error && !formData.date ? error : ""}
          />
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
          <TextField
            fullWidth
            margin="normal"
            label="Số lượng người tối đa"
            name="maxUsers"
            type="number"
            value={formData.maxUsers}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
            error={!!error && formData.maxUsers <= 0}
            helperText={error && formData.maxUsers <= 0 ? error : ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Dialog>
  );
};

export default WorkShiftEdit;
