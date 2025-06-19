import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import {
  PhotoCamera,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  Calendar,
  Edit,
  Event,
  Close,
  AccountCircle,
} from "@mui/icons-material";
import { updateStaff } from "../../services/UserService";
import { toast } from "react-toastify";
import { uploadFile } from "../../utils/uploadfile"; // Import uploadFile function

const StaffEdit = ({ open, staffdata, onClose, onSave }) => {
  const [staff, setStaff] = useState({ ...staffdata });
  const [errors, setErrors] = useState({
    general: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null); // To store the file object
  const [loading, setLoading] = useState(false);

  const inpRef = useRef();

  useEffect(() => {
    if (staffdata) {
      setStaff({ ...staffdata });
      if (staffdata.imageurl) {
        setImagePreview(staffdata.imageurl);
      }
    }
  }, [staffdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Save the Base64 string of the image
      };
      reader.readAsDataURL(selectedFile); // Convert file to Base64
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!staff.fullName?.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!staff.email?.trim()) newErrors.email = "Vui lòng nhập email";
    if (!staff.phone?.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let imageUrl = staff.imageurl;

      // Upload image if a new file is selected
      if (file) {
        imageUrl = await uploadFile(file, "staff-images");
        if (!imageUrl || imageUrl === "Error upload") {
          throw new Error("Lỗi tải ảnh lên.");
        }
      }

      const updatedStaff = { ...staff, imageurl: imageUrl };

      const updated = await updateStaff(staff.id, updatedStaff);
      toast.success("Cập nhật nhân viên thành công!");
      onSave(updated);
      onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      setErrors({ general: "Có lỗi khi cập nhật nhân viên. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 800,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Edit sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="600">
              Chỉnh Sửa Thông Tin Nhân Viên
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}

          {/* Avatar Display/Upload Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              p: 3,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "2px dashed",
              borderColor: file ? "primary.main" : "grey.300",
              transition: "all 0.3s ease",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                border: "4px solid",
                borderColor: "primary.main",
                cursor: "pointer",
              }}
              src={file ? imagePreview : staff.imageurl} // Use the Base64 string or image URL
              onClick={() => inpRef.current?.click()}
            >
              {!file && <Person sx={{ fontSize: 40 }} />}
            </Avatar>

            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={() => inpRef.current?.click()}
              disabled={loading}
              sx={{
                borderRadius: 20,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {file ? "Thay đổi ảnh" : "Tải lên ảnh"}
            </Button>

            <input
              type="file"
              ref={inpRef}
              onChange={handleFileChange}
              hidden
              accept="image/*"
            />

            {file && (
              <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                ✓ Đã chọn: {file.name}
              </Typography>
            )}
          </Box>

          {/* Staff ID Display */}
          {staff.id && (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Chip
                icon={<AccountCircle />}
                label={`ID: ${staff.id}`}
                sx={{
                  bgcolor: "#e8f5e8",
                  color: "#2e7d32",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              />
            </Box>
          )}

          <Divider sx={{ mb: 4 }}>
            <Chip label="Thông tin cá nhân" sx={{ bgcolor: "#f8f9fa", fontWeight: 600 }} />
          </Divider>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={staff.fullName || ""}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                InputProps={{
                  startAdornment: <Person sx={{ color: "#4CAF50", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={staff.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <Email sx={{ color: "#4CAF50", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={staff.phone || ""}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: <Phone sx={{ color: "#4CAF50", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={staff.gender || ""}
                  onChange={handleChange}
                  label="Giới tính"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                name="birthDate"
                type="date"
                value={staff.birthDate?.split("T")[0] || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Event sx={{ color: "#4CAF50", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={staff.address || ""}
                onChange={handleChange}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ color: "#4CAF50", mr: 1, mt: 1, alignSelf: "flex-start" }} />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }}>
            <Chip label="Thông tin nghề nghiệp" sx={{ bgcolor: "#f8f9fa", fontWeight: 600 }} />
          </Divider>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kinh nghiệm"
                name="experience"
                value={staff.experience || ""}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: <Work sx={{ color: "#4CAF50", mr: 1, mt: 1, alignSelf: "flex-start" }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kỹ năng"
                name="skills"
                value={staff.skills || ""}
                onChange={handleChange}
                multiline
                rows={3}
                helperText="Các kỹ năng cách nhau bởi dấu phẩy"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thông tin hồ sơ"
                name="profile"
                value={staff.profile || ""}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Mô tả chi tiết về hồ sơ, thành tích, dự án đã tham gia..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              mt: 4,
              pt: 3,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                borderColor: "#cbd5e0",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#94a3b8",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.6)",
                },
                "&:disabled": {
                  background: "#cbd5e0",
                },
              }}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default StaffEdit;
