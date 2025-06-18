import { UploadFile, Person, Email, Lock, Phone, AdminPanelSettings, Close } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Box,
  Typography,
  Modal,
  CircularProgress,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Fade,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef } from "react";
import { addUser } from "../../services/UserService";
import { uploadFile } from "../../utils/uploadfile";

const UserAdd = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    imageurl: "",
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const inpRef = useRef();

  const roles = [
    { value: "Admin", label: "Quản trị viên", color: "#e74c3c" },
    { value: "Staff", label: "Nhân viên", color: "#3498db" },
    { value: "Customer", label: "Khách hàng", color: "#27ae60" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
        imageUrl = await uploadFile(file, "user-images");
        if (!imageUrl || imageUrl === "Error upload") {
          throw new Error("Lỗi tải ảnh lên.");
        }
      }

      const userData = {
        ...formData,
        imageurl: imageUrl,
      };

      await addUser(userData);
      toast.success("Thêm người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      onSuccess();

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        imageurl: "",
      });
      setFile(null);
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

  const handleClose = () => {
    if (!loading) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        imageurl: "",
      });
      setFile(null);
      setErrors({});
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <>
      <Modal 
        open={open} 
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={open}>
          <Paper
            elevation={24}
            sx={{
              width: { xs: '90vw', sm: 500 },
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              position: 'relative',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 3,
                pb: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px 12px 0 0',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={handleClose}
                disabled={loading}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                }}
              >
                <Close />
              </IconButton>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    Thêm người dùng mới
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điền thông tin để tạo tài khoản mới
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
              {errorMessage && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: 'error.light',
                    color: 'error.contrastText',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'error.main',
                  }}
                >
                  <Typography variant="body2">{errorMessage}</Typography>
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                {/* Avatar Upload Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                    p: 3,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: file ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                    }}
                    src={file ? URL.createObjectURL(file) : undefined}
                    onClick={() => inpRef.current?.click()}
                  >
                    {!file && <Person sx={{ fontSize: 40 }} />}
                  </Avatar>
                  
                  <Button
                    variant="outlined"
                    startIcon={<UploadFile />}
                    onClick={() => inpRef.current?.click()}
                    disabled={loading}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {file ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                  </Button>
                  
                  <input
                    type="file"
                    ref={inpRef}
                    onChange={handleImageChange}
                    hidden
                    accept="image/*"
                  />
                  
                  {file && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                      ✓ Đã chọn: {file.name}
                    </Typography>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      InputProps={{
                        startAdornment: (
                          <Person sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Địa chỉ email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      InputProps={{
                        startAdornment: (
                          <Phone sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Vai trò"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading}
                      error={!!errors.role}
                      helperText={errors.role}
                      InputProps={{
                        startAdornment: (
                          <AdminPanelSettings sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: role.color,
                              }}
                            />
                            {role.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      }
                    }}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        Đang xử lý...
                      </Box>
                    ) : (
                      'Tạo tài khoản'
                    )}
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default UserAdd;