import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import {
  WorkOutline,
  CalendarToday,
  AccessTime,
  People,
  Save,
  Schedule,
  BusinessCenter,
} from "@mui/icons-material";
import WorkShiftService from "../../services/WorkShiftService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Helper function to get day name
  const getDayName = (dayOfWeek) => {
    const days = [
      "Chủ nhật",
      "Thứ hai", 
      "Thứ ba", 
      "Thứ tư", 
      "Thứ năm", 
      "Thứ sáu", 
      "Thứ bảy"
    ];
    return days[dayOfWeek];
  };

  // Calculate work duration
  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diff = (end - start) / (1000 * 60 * 60); // hours
      return diff > 0 ? `${diff} giờ` : "Giờ kết thúc phải sau giờ bắt đầu";
    }
    return "";
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
            position: "relative",
          }}
        >
          <BusinessCenter
            sx={{
              fontSize: 48,
              mb: 2,
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              mb: 1,
            }}
          >
            Tạo Ca Làm Việc
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Thiết lập thông tin ca làm việc mới
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSave}>
            <Stack spacing={4}>
              {/* Shift Name */}
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <WorkOutline color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Thông tin ca làm
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    label="Tên ca làm"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Ca sáng, Ca chiều, Ca tối..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Date and Day Info */}
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Ngày làm việc
                    </Typography>
                    {formData.date && (
                      <Chip
                        label={getDayName(formData.dayOfWeek)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>
                  <TextField
                    fullWidth
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Time and Duration */}
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <AccessTime color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Thời gian làm việc
                    </Typography>
                    {calculateDuration() && (
                      <Chip
                        label={`Thời lượng: ${calculateDuration()}`}
                        color={calculateDuration().includes("phải sau") ? "error" : "success"}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Giờ bắt đầu"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                            "&.Mui-focused": {
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Giờ kết thúc"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                            "&.Mui-focused": {
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Max Users */}
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <People color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Số lượng nhân viên
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số người tối đa"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">người</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Box sx={{ pt: 2 }}>
                <Divider sx={{ mb: 3 }} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Save />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(25,118,210,0.4)",
                    },
                  }}
                >
                  Tạo Ca Làm Việc
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Paper>

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
    </Container>
  );
};

export default WorkShiftCreate;