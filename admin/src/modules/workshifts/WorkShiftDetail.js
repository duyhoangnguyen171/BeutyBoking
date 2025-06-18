import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Skeleton,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
} from "@mui/material";
import {
  Person,
  PersonAdd,
  Schedule,
  CheckCircle,
  Pending,
  Assignment,
  Group,
  Business,
  AccessTime,
  Refresh,
  Info,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkShiftService from "../../services/WorkShiftService";

const WorkShiftDetail = () => {
  const { shiftId } = useParams();
  const [data, setData] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableStaffs, setAvailableStaffs] = useState({});
const [loadingStaffs, setLoadingStaffs] = useState({});
  const [selectedStaff, setSelectedStaff] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    
    open: false,
    userId: null,
    userName: "",
  });

  useEffect(() => {
    fetchData();
  }, [shiftId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await WorkShiftService.getById(shiftId);
      setData(result);
      setError(null);
    } catch (error) {
      console.error("Không thể tải dữ liệu ca làm:", error);
      setError("Không thể tải dữ liệu ca làm.");
      toast.error("Không thể tải dữ liệu ca làm.");
    } finally {
      setLoading(false);
    }
  };
const fetchAvailableStaffs = async (timeSlotId, appointmentId) => {
  if (availableStaffs[appointmentId]) return; // Đã load rồi thì không load lại

  setLoadingStaffs(prev => ({ ...prev, [appointmentId]: true }));
  
  try {
    const response = await WorkShiftService.getAvailableStaff(timeSlotId);
    setAvailableStaffs(prev => ({
      ...prev,
      [appointmentId]: response.staffs || []
    }));
  } catch (error) {
    console.error('Không thể tải danh sách nhân viên khả dụng:', error);
    toast.error('Không thể tải danh sách nhân viên khả dụng');
    setAvailableStaffs(prev => ({
      ...prev,
      [appointmentId]: []
    }));
  } finally {
    setLoadingStaffs(prev => ({ ...prev, [appointmentId]: false }));
  }
};
  const assignStaff = async (appointmentId, staffId) => {
    if (!staffId) return;
    setAssigning(true);
    try {
      // Gọi API với PUT và các tham số trong query string
      await WorkShiftService.assignStaff(appointmentId, staffId);

      setError(null);
      toast.success("Gán nhân viên thành công!");

      // Cập nhật lại dữ liệu sau khi gán
      const updated = await WorkShiftService.getById(shiftId);
      setData(updated);

      // Reset lại trạng thái lựa chọn nhân viên
      setSelectedStaff((prev) => ({ ...prev, [appointmentId]: "" }));
    } catch (err) {
      setError("Lỗi khi gán nhân viên.");
      toast.error("Lỗi khi gán nhân viên.");
    } finally {
      setAssigning(false);
    }
  };

  const approveStaff = async (userId) => {
    try {
      const workshiftId = parseInt(shiftId, 10);
      const userIdNumber = parseInt(userId, 10);

      await WorkShiftService.approveStaff(workshiftId, userIdNumber);
      const updated = await WorkShiftService.getById(workshiftId);
      setData(updated);
      setError(null);
      toast.success("Nhân viên đã được duyệt thành công!");
      setConfirmDialog({ open: false, userId: null, userName: "" });
    } catch (err) {
      console.error("Lỗi khi duyệt nhân viên:", err);
      setError("Lỗi khi duyệt nhân viên.");
      toast.error("Lỗi khi duyệt nhân viên.");
    }
  };

  const handleApproveClick = (userId, userName) => {
    setConfirmDialog({ open: true, userId, userName });
  };

  const renderName = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return "Không xác định";
  };

  const handleStaffSelectChange = (appointmentId, staffId) => {
    setSelectedStaff((prev) => ({ ...prev, [appointmentId]: staffId }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={60} />
          <Skeleton variant="text" width={200} height={30} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={120} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          <Typography variant="h6">Không thể tải dữ liệu</Typography>
          <Typography>
            Vui lòng thử lại sau hoặc liên hệ quản trị viên.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const appointments = data.appointments?.$values ?? [];
  const registeredStaffs = data.registeredStaffs?.$values ?? [];
  const approvedStaffs = registeredStaffs.filter((staff) => staff.isApproved);
  const pendingStaffs = registeredStaffs.filter((staff) => !staff.isApproved);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 4,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Chi tiết ca làm việc
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Quản lý lịch hẹn và nhân viên cho ca làm việc
            </Typography>
          </Box>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton
              onClick={fetchData}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Progress */}
      {assigning && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Đang xử lý...
          </Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Appointments Section - Left Side */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Assignment />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 600 }}
                    >
                      Danh sách lịch hẹn
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointments.length} lịch hẹn được tìm thấy
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {appointments.length === 0 ? (
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <Schedule
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Chưa có lịch hẹn nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Các lịch hẹn sẽ xuất hiện ở đây khi có khách đặt lịch
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {appointments.map((appt) => (
                      <Grid item xs={12} key={appt.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              boxShadow: 4,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={3} alignItems="center">
                              <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Person color="primary" />
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {renderName(appt.customerName) ||
                                        "Chưa có thông tin"}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Business fontSize="small" color="action" />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Nhân viên phụ trách:{" "}
                                      {renderName(appt.staffName) || "Chưa gán"}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ mt: 2 }}>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <AccessTime color="action" />
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Ngày hẹn:{" "}
                                        {new Date(
                                          appt.appointmentDate
                                        ).toLocaleDateString("vi-VN")}
                                      </Typography>
                                    </Stack>

                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ mt: 1 }}
                                    >
                                      <Schedule color="action" />
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Khung giờ: {appt.timeSlotStart} -{" "}
                                        {appt.timeSlotEnd}
                                      </Typography>
                                    </Stack>

                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ mt: 1 }}
                                    >
                                      <Assignment color="action" />
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Dịch vụ:{" "}
                                        {appt.services?.$values
                                          ?.map((s) => s.serviceName)
                                          .join(", ") || "Không có"}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Gán nhân viên</InputLabel>
                                    <Select
                                      value={selectedStaff[appt.id] || ""}
                                      onChange={
                                        (e) =>
                                          handleStaffSelectChange(
                                            appt.id,
                                            e.target.value
                                          ) // Khi người dùng chọn nhân viên
                                      }
                                      label="Gán nhân viên"
                                      disabled={assigning} // Vô hiệu hóa khi đang gán nhân viên
                                    >
                                      <MenuItem value="">
                                        <em>-- Chọn nhân viên --</em>
                                      </MenuItem>
                                      {approvedStaffs.map((staff) => (
                                        <MenuItem
                                          key={staff.id}
                                          value={staff.id}
                                        >
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                          >
                                            <Avatar
                                              sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor: "success.main",
                                              }}
                                            >
                                              <Person fontSize="small" />
                                            </Avatar>
                                            <Typography>
                                              {renderName(staff.fullName)}
                                            </Typography>
                                          </Stack>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>

                                  <Button
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    onClick={
                                      () =>
                                        assignStaff(
                                          appt.id,
                                          selectedStaff[appt.id]
                                        ) // Gán nhân viên khi nhấn nút
                                    }
                                    disabled={
                                      assigning || !selectedStaff[appt.id]
                                    } // Vô hiệu hóa nút nếu không có nhân viên chọn
                                    sx={{ minWidth: 120, borderRadius: 2 }}
                                  >
                                    Gán
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Section - Right Side */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Statistics Cards */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ borderRadius: 2, bgcolor: "success.50" }}>
                  <CardContent sx={{ textAlign: "center", p: 2 }}>
                    <Badge badgeContent={approvedStaffs.length} color="success">
                      <CheckCircle
                        sx={{ fontSize: 32, color: "success.main" }}
                      />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      Đã duyệt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ borderRadius: 2, bgcolor: "warning.50" }}>
                  <CardContent sx={{ textAlign: "center", p: 2 }}>
                    <Badge badgeContent={pendingStaffs.length} color="warning">
                      <Pending sx={{ fontSize: 32, color: "warning.main" }} />
                    </Badge>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      Chờ duyệt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Registered Staff */}
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <Group />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Nhân viên đăng ký
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {registeredStaffs.length} nhân viên
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {registeredStaffs.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Person
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Chưa có nhân viên đăng ký
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      {registeredStaffs.map((staff) => (
                        <Card
                          key={staff.id}
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { boxShadow: 2 },
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: staff.isApproved
                                    ? "success.main"
                                    : "warning.main",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <Person />
                              </Avatar>

                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {renderName(staff.fullName)}
                                </Typography>
                                <Chip
                                  label={
                                    staff.isApproved ? "Đã duyệt" : "Chờ duyệt"
                                  }
                                  color={
                                    staff.isApproved ? "success" : "warning"
                                  }
                                  size="small"
                                  sx={{ borderRadius: 2 }}
                                />
                              </Box>

                              {!staff.isApproved && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<CheckCircle />}
                                  onClick={() =>
                                    handleApproveClick(
                                      staff.id,
                                      renderName(staff.fullName)
                                    )
                                  }
                                  sx={{ borderRadius: 2, minWidth: 80 }}
                                >
                                  Duyệt
                                </Button>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, userId: null, userName: "" })
        }
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 400 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <Info />
            </Avatar>
            <Typography variant="h6">Xác nhận duyệt nhân viên</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn duyệt nhân viên{" "}
            <strong>{confirmDialog.userName}</strong> cho ca làm việc này không?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, userId: null, userName: "" })
            }
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => approveStaff(confirmDialog.userId)}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ borderRadius: 2 }}
          >
            Xác nhận duyệt
          </Button>
        </DialogActions>
      </Dialog>

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
      />
    </Container>
  );
};

export default WorkShiftDetail;
