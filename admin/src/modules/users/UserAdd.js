import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser } from "../../services/UserService";

const UserAdd = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const roles = ["Admin", "Staff", "Customer"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage(""); // Clear error message on change
  };

  const validateForm = () => {
    if (!formData.fullName) return "Họ tên là bắt buộc.";
    if (!formData.email) return "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Email không hợp lệ.";
    if (!formData.password) return "Mật khẩu là bắt buộc.";
    if (formData.password.length < 6) return "Mật khẩu phải dài ít nhất 6 ký tự.";
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) return "Số điện thoại không hợp lệ (10-11 chữ số).";
    if (!formData.role) return "Vai trò là bắt buộc.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      toast.error(validationError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await addUser(formData);
      toast.success("Thêm người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onSuccess();
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
      });
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      const errorMsg = error.response?.data?.message || "Thêm người dùng thất bại.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="add-user-modal"
        aria-describedby="add-user-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="add-user-modal" variant="h6" component="h2" gutterBottom>
            Thêm người dùng
          </Typography>
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Họ tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            <TextField
              select
              label="Vai trò"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                onClick={onClose}
                color="secondary"
                style={{ marginRight: 8 }}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Thêm"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
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
      />
    </>
  );
};

export default UserAdd;