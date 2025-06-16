import { UploadFile } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Box,
  Typography,
  Modal,
  CircularProgress,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef } from "react";
import { addUser } from "../../services/UserService";
import { uploadFile } from "../../utils/uploadfile"; // Hàm upload file

const UserAdd = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    imageurl: "", // Thêm trường imageurl
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // Trường lưu file ảnh
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const inpRef = useRef(); // Dùng để mở input file

  const roles = ["Admin", "Staff", "Customer"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error of this field
    }));
    setErrorMessage(""); // Clear general error
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Lưu file để gửi lên backend
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Họ tên là bắt buộc.";
    if (!formData.email) newErrors.email = "Email là bắt buộc.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ.";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc.";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải dài ít nhất 6 ký tự.";
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số).";
    if (!formData.role) newErrors.role = "Vai trò là bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường nhập.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (file) {
        // Nếu có ảnh, tải ảnh lên và lấy URL
        imageUrl = await uploadFile(file, "user-images");
        if (!imageUrl || imageUrl === "Error upload") {
          throw new Error("Lỗi tải ảnh lên.");
        }
      }

      const userData = {
        ...formData,
        imageurl: imageUrl, // Đính kèm URL ảnh
      };

      await addUser(userData); // Gửi dữ liệu lên backend
      toast.success("Thêm người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      onSuccess();

      // Reset form sau khi thêm người dùng
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        imageurl: "", // Reset ảnh
      });
      setFile(null); // Reset file
      setErrors({});
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      setErrorMessage(error.message || "Thêm người dùng thất bại.");
      toast.error(error.message || "Thêm người dùng thất bại.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
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
          <Typography variant="h6" component="h2" gutterBottom>
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
              error={!!errors.fullName}
              helperText={errors.fullName}
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
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
              error={!!errors.phone}
              helperText={errors.phone}
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
              error={!!errors.role}
              helperText={errors.role}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>

            <label>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                component="span"
                startIcon={<UploadFile />}
                onClick={() => inpRef.current.click()}
              >
                Thêm ảnh
              </Button>
              <input
                type="file"
                ref={inpRef}
                onChange={handleImageChange}
                hidden
                accept="image/*"
              />
            </label>
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}

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
      <ToastContainer />
    </>
  );
};

export default UserAdd;
