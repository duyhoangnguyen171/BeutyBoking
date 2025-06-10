import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkShiftService from "../../services/WorkShiftService";

const WorkShiftEdit = ({ open = true, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    shiftType: 0, // 0 - sáng, 1 - chiều, 2 - tối
    date: "",
    dayOfWeek: 0,
    maxUsers: 1,
    startTime: "08:00", // Default start time
    endTime: "16:00", // Default end time
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reusable toast function
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    const fetchWorkShift = async () => {
      if (!id || isNaN(id)) {
        setError("ID ca làm không hợp lệ.");
        setLoading(false);
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
          endTime: shift.endTime || "16:00",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching work shift:", err);
        setError("Không thể tải thông tin ca làm.");
        setLoading(false);
        showToast("Không thể tải thông tin ca làm.");
      }
    };

    fetchWorkShift();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxUsers" || name === "shiftType" ? Number(value) : value,
    }));
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); // Reset error messages

    // Validation
    if (!formData.name || formData.name.trim() === "") {
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

    // In ra payload để kiểm tra
    const payload = {
      name: formData.name.trim(),
      dayOfWeek: formData.dayOfWeek,
      maxUsers: formData.maxUsers,
      date: new Date(formData.date).toISOString(), // Chuyển đổi date sang ISO string
      startTime: formData.startTime, // Giữ nguyên định dạng HH:mm
      endTime: formData.endTime, // Giữ nguyên định dạng HH:mm
    };
    console.log(payload); // Kiểm tra payload trước khi gửi lên server

    try {
      setLoading(true);
      // Gửi dữ liệu lên backend
      await WorkShiftService.update(Number(id), payload);
      showToast("Cập nhật ca làm thành công!", "success");
      navigate("/admin/workshifts");
      if (onClose) onClose(); // Đóng modal hoặc thực hiện hành động sau khi lưu thành công
    } catch (err) {
      setLoading(false);
      let errorMessage = err.message || "Đã xảy ra lỗi khi cập nhật ca làm.";

      // Cải thiện xử lý lỗi
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
      console.error("Error updating work shift:", err.response?.data || err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      shiftType: 0,
      date: "",
      dayOfWeek: 0,
      maxUsers: 1,
      startTime: "08:00",
      endTime: "16:00",
    });
    setError("");
    if (onClose) onClose();
    navigate("/admin/workshifts");
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>Đang tải thông tin ca làm...</Box>
    );
  }

  if (error && !formData.name) {
    return (
      <Box sx={{ textAlign: "center", p: 3, color: "error.main" }}>{error}</Box>
    );
  }

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
            aria-label="Tên ca làm"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Loại ca</InputLabel>
            <Select
              name="shiftType"
              value={formData.shiftType}
              onChange={handleChange}
              label="Loại ca"
            >
              <MenuItem value={0}>Ca sáng</MenuItem>
              <MenuItem value={1}>Ca chiều</MenuItem>
              <MenuItem value={2}>Ca tối</MenuItem>
            </Select>
          </FormControl>
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
            aria-label="Chọn ngày"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Thời gian bắt đầu (HH:mm)"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            error={!!error && !formData.startTime}
            helperText={error && !formData.startTime ? error : ""}
            aria-label="Thời gian bắt đầu"
            placeholder="08:00"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Thời gian kết thúc (HH:mm)"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            error={!!error && !formData.endTime}
            helperText={error && !formData.endTime ? error : ""}
            aria-label="Thời gian kết thúc"
            placeholder="16:00"
          />
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
            aria-label="Số lượng người tối đa"
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
        position="bottom-right"
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
