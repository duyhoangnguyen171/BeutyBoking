import {
  Close,
  Email,
  Event,
  LocationOn,
  Person,
  Phone,
  PhotoCamera,
  Security,
  Work,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addStaff } from "../../services/UserService";
import { uploadFile } from "../../utils/uploadfile"; // Import uploadFile function
const StaffAdd = ({ open, onClose, onSave }) => {
  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    experience: "",
    address: "",
    birthDate: "",
    skills: "",
    profile: "",
    password: "",
    imageurl: null,
  });
  const [file, setFile] = useState(null); // To store the file object
  const inpRef = useRef();
  const [errors, setErrors] = useState({
    password: "",
    general: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });

    // Clear specific field errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  useEffect(() => {
    if (staff) {
      setStaff({ ...staff });
      if (staff.imageurl) {
        setImagePreview(staff.imageurl);
      }
    }
  }, [staff]);
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

    if (!staff.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!staff.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!staff.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!staff.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (staff.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Validate form before submission

    setLoading(true); // Set loading state to true

    // Prepare form data
    const formData = new FormData();

    // Add staff data to formData
    Object.keys(staff).forEach((key) => {
      if (key !== "imageurl" && staff[key]) {
        formData.append(key, staff[key]);
      }
    });

    // Handle image upload if a new file is selected
    if (file) {
      try {
        const imageUrl = await uploadFile(file, "staff-images"); // Upload image using uploadFile function
        if (imageUrl && imageUrl !== "Error upload") {
          formData.append("image", imageUrl); // Append the uploaded image URL to formData
        } else {
          throw new Error("Lỗi tải ảnh lên.");
        }
      } catch (error) {
        toast.error("Lỗi tải ảnh lên, vui lòng thử lại.");
        setLoading(false);
        return;
      }
    }

    // Console log formData before submission (to inspect the data)
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // Submit the form data (including the image)
      const newStaff = await addStaff(formData); // Send data to backend
      onSave(newStaff); // Pass the new staff data to the parent component
      onClose(); // Close the modal
      // Reset form
      setStaff({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        experience: "",
        address: "",
        birthDate: "",
        skills: "",
        profile: "",
        password: "",
        imageurl: null,
      });
      setImagePreview(null); // Clear image preview
      setFile(null); // Clear selected file
      toast.success("Thêm nhân viên thành công!");
    } catch (error) {
      setErrors({ general: "Có lỗi khi thêm nhân viên. Vui lòng thử lại." });
      toast.error("Có lỗi khi thêm nhân viên.");
    } finally {
      setLoading(false); // Reset loading state
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            <Person sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="600">
              Thêm Nhân Viên Mới
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
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

          {/* Avatar Upload Section */}
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

          <Divider sx={{ mb: 4 }}>
            <Chip
              label="Thông tin cá nhân"
              sx={{ bgcolor: "#f8f9fa", fontWeight: 600 }}
            />
          </Divider>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={staff.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                InputProps={{
                  startAdornment: <Person sx={{ color: "#667eea", mr: 1 }} />,
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
                value={staff.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <Email sx={{ color: "#667eea", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={staff.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: <Phone sx={{ color: "#667eea", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={staff.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: <Security sx={{ color: "#667eea", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                name="birthDate"
                type="date"
                value={staff.birthDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Event sx={{ color: "#667eea", mr: 1 }} />,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={staff.gender}
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={staff.address}
                onChange={handleChange}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <LocationOn
                      sx={{
                        color: "#667eea",
                        mr: 1,
                        mt: 1,
                        alignSelf: "flex-start",
                      }}
                    />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }}>
            <Chip
              label="Thông tin nghề nghiệp"
              sx={{ bgcolor: "#f8f9fa", fontWeight: 600 }}
            />
          </Divider>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kinh nghiệm"
                name="experience"
                value={staff.experience}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <Work
                      sx={{
                        color: "#667eea",
                        mr: 1,
                        mt: 1,
                        alignSelf: "flex-start",
                      }}
                    />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kỹ năng"
                name="skills"
                value={staff.skills}
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                },
                "&:disabled": {
                  background: "#cbd5e0",
                },
              }}
            >
              {loading ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default StaffAdd;
