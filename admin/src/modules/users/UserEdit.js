import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserById, updateUser } from "../../services/UserService";
import { uploadFile } from "../../utils/uploadfile";
const UserEdit = ({ open, onClose, userId, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    imageurl: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !open) return;
      setLoading(true);
      try {
        const user = await getUserById(userId);
        if (user) {
          setForm({
            id: user.id || "",
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "",
            imageurl: user.imageurl || "",
          });
          setErrorMessage("");
        } else {
          setErrorMessage("Không tìm thấy người dùng.");
          toast.error("Không tìm thấy người dùng.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setErrorMessage(
          "Lỗi khi lấy thông tin người dùng: " +
            (error.response?.data?.message || error.message)
        );
        toast.error("Lỗi khi lấy thông tin người dùng.", {
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
    fetchUser();
  }, [userId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(""); // Clear error message on change
  };
  const handleRemoveImage = async () => {
    if (!form.imageurl) return;

    setLoading(true);
    try {
      // Gửi yêu cầu tới backend để xóa ảnh
      await updateUser(userId, { ...form, imageurl: "" }); // Cập nhật imageurl thành rỗng
      setForm((prev) => ({
        ...prev,
        imageurl: "", // Cập nhật form để không có ảnh
      }));
      toast.success("Ảnh đã được xóa thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Lỗi khi xóa ảnh!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Lấy file ảnh người dùng chọn
    if (file) {
      try {
        const uploadUrl = await uploadFile(file); // Hàm này cần bạn định nghĩa hoặc thay thế bằng một API tải lên ảnh
        setForm((prev) => ({
          ...prev,
          imageurl: uploadUrl, // Cập nhật form với URL ảnh
        }));
      } catch (error) {
        toast.error("Tải ảnh lên thất bại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const validateForm = () => {
    if (!form.fullName) return "Họ tên là bắt buộc.";
    if (!form.email) return "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Email không hợp lệ.";
    if (form.phone && !/^\d{10,11}$/.test(form.phone))
      return "Số điện thoại không hợp lệ (10-11 chữ số).";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      toast.error(validationError, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await updateUser(userId, form); // Gửi ảnh cùng các thông tin khác
      toast.success("Cập nhật người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      const errorMsg =
        error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!";
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Sửa người dùng</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography align="center" sx={{ py: 2 }}>
              <CircularProgress size={30} /> Đang tải thông tin...
            </Typography>
          ) : (
            <Stack spacing={2} mt={1}>
              {errorMessage && (
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              )}
              <TextField
                name="fullName"
                label="Họ tên"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                name="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                name="phone"
                label="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
              <TextField
                name="role"
                label="Vai trò"
                value={form.role}
                InputProps={{
                  readOnly: true, // Make the field read-only
                }}
                fullWidth
                disabled={loading}
              />
              <TextField
                name="imageurl"
                type="file"
                onChange={handleImageChange}
                fullWidth
                disabled={loading}
              />
              {form.imageurl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="#1e293b" fontWeight="600">
                    Ảnh đại diện
                  </Typography>
                  <img
                    src={form.imageurl}
                    alt="User Avatar"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={handleRemoveImage} // Khi người dùng nhấn vào nút này
                    disabled={loading}
                  >
                    Xóa ảnh
                  </Button>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
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

UserEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func,
};

export default UserEdit;
