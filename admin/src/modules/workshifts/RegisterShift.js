import {
  AccessTime,
  AdminPanelSettings,
  CheckCircle,
  Person,
  Schedule,
  WorkOutline,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkShiftService from "../../services/WorkShiftService";

const RegisterShift = () => {
  const [staffList, setStaffList] = useState([]);
  const [shiftId, setShiftId] = useState();
  const [selectedStaff, setSelectedStaff] = useState("");
  const [shiftDetails, setShiftDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shiftLoading, setShiftLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shiftIdFromURL = searchParams.get("shiftId");

  useEffect(() => {
    if (shiftIdFromURL) setShiftId(Number(shiftIdFromURL));
  }, [shiftIdFromURL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload?.role || payload?.roles || [];
        const roleArray = Array.isArray(roles) ? roles : [roles];
        setIsAdmin(roleArray.includes("admin"));
        setCurrentUser({
          name: payload.fullName || payload.name || "Người dùng",
          staffId: payload.staffId,
        });
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        toast.error("Lỗi khi giải mã thông tin đăng nhập.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setShiftLoading(true);
        if (shiftId) {
          const shiftResponse = await WorkShiftService.getById(shiftId);
          setShiftDetails(shiftResponse);

          if (isAdmin) {
            const staffResponse = await WorkShiftService.getStaffNotRegistered(
              shiftId
            );
            setStaffList(staffResponse.$values || []);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error(
          "Không thể lấy thông tin ca làm hoặc danh sách nhân viên.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      } finally {
        setShiftLoading(false);
      }
    };

    fetchData();
  }, [shiftId, isAdmin]);

  const handleRegisterShift = async (e) => {
  e.preventDefault();

  if (isAdmin && !selectedStaff) {
    toast.error("Vui lòng chọn nhân viên.", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    return;
  }

  let staffIdToSend;

  if (isAdmin) {
    staffIdToSend = Number(selectedStaff); // Chọn nhân viên từ danh sách
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", decoded);

      const staffIdFromToken = Number(decoded.StaffId); // Sử dụng đúng tên trường

      if (isNaN(staffIdFromToken)) {
        toast.error(
          "Không tìm thấy mã nhân viên trong token hoặc mã không hợp lệ.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        return;
      }

      staffIdToSend = staffIdFromToken; // Gán staffId đã chuyển đổi cho biến staffIdToSend
      console.log("staffIdToSend:", staffIdToSend);
    } catch (err) {
      toast.error("Lỗi khi đọc token.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Lỗi giải mã token:", err);
      return;
    }
  }

  try {
    setLoading(true);

    if (isAdmin) {
      // Gọi API cho admin đăng ký và gán TimeSlot ngay lập tức
      await WorkShiftService.registerShiftForAdmin(shiftId, staffIdToSend); 
      toast.success("Đăng ký ca làm thành công và gán time slot!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      // Nếu là admin, làm mới danh sách nhân viên
      const staffResponse = await WorkShiftService.getStaffNotRegistered(shiftId);
      setStaffList(staffResponse.$values || []);
      setSelectedStaff("");
    } else {
      // Gọi API cho staff đăng ký (chỉ đăng ký mà không gán TimeSlot)
      await WorkShiftService.registerShiftForStaff(shiftId); // Bạn cần viết API này trong WorkShiftService
      toast.success("Đăng ký ca làm thành công, vui lòng chờ admin duyệt.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  } catch (error) {
    toast.error(error.response?.data || "Đã xảy ra lỗi.", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    console.error("Lỗi khi đăng ký ca làm:", error);
  } finally {
    setLoading(false);
  }
};

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  const getShiftDuration = () => {
    if (!shiftDetails?.startTime || !shiftDetails?.endTime) return "";

    const start = new Date(`2000-01-01T${shiftDetails.startTime}`);
    const end = new Date(`2000-01-01T${shiftDetails.endTime}`);
    const diff = (end - start) / (1000 * 60 * 60); // hours

    return `${diff}h`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                mx: "auto",
                mb: 2,
              }}
            >
              <WorkOutline fontSize="large" />
            </Avatar>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Đăng ký ca làm việc
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isAdmin
                ? "Quản lý đăng ký ca làm cho nhân viên"
                : "Đăng ký ca làm việc của bạn"}
            </Typography>
          </Box>

          {/* User Info */}
          {!isAdmin && currentUser && (
            <Card sx={{ mb: 3, bgcolor: "primary.50" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {currentUser.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mã NV: {currentUser.staffId}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <Box display="flex" justifyContent="center" mb={3}>
              <Chip
                icon={<AdminPanelSettings />}
                label="Quản trị viên"
                color="secondary"
                variant="filled"
                size="large"
              />
            </Box>
          )}

          {/* Main Content */}
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            {/* Shift Details */}
            <Box sx={{ bgcolor: "white", p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
                Thông tin ca làm
              </Typography>

              {shiftLoading ? (
                <Stack spacing={2}>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="rectangular" height={60} />
                </Stack>
              ) : shiftDetails ? (
                <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          {shiftDetails.name}
                        </Typography>
                      </Box>

                      <Divider />

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                      >
                        <Box flex={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <AccessTime color="action" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              Thời gian bắt đầu
                            </Typography>
                          </Stack>
                          <Typography variant="h6" fontWeight="bold">
                            {formatTime(shiftDetails.startTime)}
                          </Typography>
                        </Box>

                        <Box flex={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <AccessTime color="action" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              Thời gian kết thúc
                            </Typography>
                          </Stack>
                          <Typography variant="h6" fontWeight="bold">
                            {formatTime(shiftDetails.endTime)}
                          </Typography>
                        </Box>

                        <Box flex={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Schedule color="action" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              Thời lượng
                            </Typography>
                          </Stack>
                          <Chip
                            label={getShiftDuration()}
                            color="primary"
                            variant="outlined"
                            size="large"
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  Không thể tải thông tin ca làm
                </Alert>
              )}
            </Box>

            <Divider />

            {/* Registration Form */}
            <Box sx={{ bgcolor: "white", p: 3 }}>
              <form onSubmit={handleRegisterShift}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Đăng ký ca làm
                  </Typography>

                  {isAdmin && (
                    <FormControl fullWidth>
                      <InputLabel>Chọn nhân viên</InputLabel>
                      <Select
                        value={selectedStaff}
                        onChange={(e) =>
                          setSelectedStaff(Number(e.target.value))
                        }
                        label="Chọn nhân viên"
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>-- Chọn nhân viên --</em>
                        </MenuItem>
                        {staffList.length > 0 ? (
                          staffList.map((staff) => (
                            <MenuItem key={staff.id} value={staff.id}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {staff.fullName.charAt(0)}
                                </Avatar>
                                <Typography>{staff.fullName}</Typography>
                              </Stack>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            <Typography color="text.secondary">
                              Không có nhân viên nào khả dụng
                            </Typography>
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={
                      loading || shiftLoading || (isAdmin && !selectedStaff)
                    }
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckCircle />
                      )
                    }
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      background: loading
                        ? undefined
                        : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: loading
                        ? undefined
                        : "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    }}
                  >
                    {loading ? "Đang xử lý..." : "Đăng ký ca làm"}
                  </Button>

                  {!isAdmin && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      Bạn đang đăng ký ca làm với tài khoản:{" "}
                      <strong>{currentUser?.name}</strong>
                    </Alert>
                  )}
                </Stack>
              </form>
            </Box>
          </Paper>
        </Box>
      </Fade>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
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

export default RegisterShift;
