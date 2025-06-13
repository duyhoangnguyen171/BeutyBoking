import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Fade,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  Add,
  History,
  Edit,
  Visibility,
  PersonAdd,
  Schedule,
  People,
  FilterList,
  CalendarToday,
  Archive,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkShiftService from "../../services/WorkShiftService";

const Workshift = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [bookedFilter, setBookedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 6; // Increased for better grid layout

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      
      const exp = payload["exp"];
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp && exp < currentTime) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const userRole =
        payload["role"] ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const nameId =
        payload["nameid"] ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"];

      if (!userRole || !nameId) {
        toast.error("Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      setRole(userRole);
      setUserId(nameId);

      if (userRole === "admin" || userRole === "staff") {
        loadShifts(nameId);
      } else {
        toast.error("Bạn không có quyền truy cập vào trang này.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Lỗi khi giải mã thông tin người dùng.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const response = await WorkShiftService.getAll();
      const data = response?.$values ?? response;
      const shiftData = Array.isArray(data) ? data : [];
      setShifts(shiftData);
      setFilteredShifts(shiftData);
    } catch (err) {
      console.error("Error loading shifts:", err);
      toast.error("Lỗi khi tải danh sách ca làm.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShifts([]);
      setFilteredShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...shifts];

    if (selectedDay !== "") {
      filtered = filtered.filter(
        (shift) => shift.dayOfWeek === parseInt(selectedDay)
      );
    }

    if (bookedFilter !== "all") {
      filtered = filtered.filter(
        (shift) => shift.booked === (bookedFilter === "booked")
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((shift) =>
        shift.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShifts(filtered);
    setPage(1);
  }, [selectedDay, bookedFilter, searchTerm, shifts]);

  const handleRegisterShift = (shift) => {
    const path =
      role === "admin"
        ? `/admin/workshifts/register?shiftId=${shift.id}`
        : `/staff/workshifts/register?shiftId=${shift.id}`;
    navigate(path);
  };

  const handleMoveToHistory = async (id) => {
    if (window.confirm("Bạn có chắc muốn chuyển ca làm này vào lịch sử?")) {
      try {
        await WorkShiftService.moveToHistory(id);
        toast.success("Ca làm đã được chuyển vào lịch sử.");
        loadShifts();
      } catch (err) {
        console.error("Lỗi khi chuyển ca làm vào lịch sử:", err);
        toast.error("Lỗi khi chuyển ca làm vào lịch sử.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleEditShift = (shift) => {
    window.location.href = `http://localhost:3001/admin/workshifts/edit/${shift.id}`;
  };

  const handleViewDetails = (shiftId) => {
    window.location.href = `http://localhost:3001/admin/workshifts/details/view/${shiftId}`;
  };

  const getSpecificDate = (dayOfWeek, date) => {
    const today = new Date(date);
    const currentDay = today.getDay();
    const diff = (dayOfWeek - currentDay + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const day = String(targetDate.getDate()).padStart(2, "0");
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const year = targetDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDayName = (dayNumber) => {
    const days = [
      "Chủ Nhật",
      "Thứ Hai", 
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return days[dayNumber] || `Thứ ${dayNumber}`;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedShifts = filteredShifts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredShifts.length / rowsPerPage);

  const getStatusColor = (shift) => {
    if (shift.booked) return "success";
    return "default";
  };

  const getStatusText = (shift) => {
    if (shift.booked) return "Đã đăng ký";
    return "Còn trống";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Quản lý ca làm việc
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Quản lý và theo dõi các ca làm việc của nhân viên
        </Typography>
      </Box>

      {/* Action Buttons */}
      {role === "admin" && (
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              (window.location.href = "http://localhost:3001/admin/workshifts/create")
            }
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
              }
            }}
          >
            Tạo ca làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<History />}
            onClick={() =>
              (window.location.href = "http://localhost:3001/admin/workshifts/history")
            }
            sx={{
              background: 'linear-gradient(45deg, #FF9800 30%, #F57C00 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #FF9800 90%)',
              }
            }}
          >
            Lịch sử ca làm
          </Button>
        </Stack>
      )}

      {/* Filters Section */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            alignItems="center"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList color="primary" />
              <Typography variant="h6" color="primary">
                Bộ lọc
              </Typography>
            </Box>
            
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Lọc theo ngày</InputLabel>
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                label="Lọc theo ngày"
                startAdornment={<CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="">Tất cả các ngày</MenuItem>
                <MenuItem value="1">Thứ Hai</MenuItem>
                <MenuItem value="2">Thứ Ba</MenuItem>
                <MenuItem value="3">Thứ Tư</MenuItem>
                <MenuItem value="4">Thứ Năm</MenuItem>
                <MenuItem value="5">Thứ Sáu</MenuItem>
                <MenuItem value="6">Thứ Bảy</MenuItem>
                <MenuItem value="0">Chủ Nhật</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={bookedFilter}
                onChange={(e) => setBookedFilter(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="booked">Đã đăng ký</MenuItem>
                <MenuItem value="unbooked">Còn trống</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Tìm kiếm ca làm"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Đang tải danh sách ca làm...
          </Typography>
        </Box>
      )}

      {/* Content */}
      {!loading && (
        <>
          {filteredShifts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
              <CardContent>
                <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Không tìm thấy ca làm nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thử thay đổi bộ lọc hoặc tạo ca làm mới
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Fade in={!loading}>
              <Grid container spacing={3}>
                {paginatedShifts.map((shift) => (
                  <Grid item xs={12} sm={6} lg={4} key={shift.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        boxShadow: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: 8,
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                          <Box>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                              {shift.name}
                            </Typography>
                            <Chip 
                              label={getStatusText(shift)}
                              color={getStatusColor(shift)}
                              size="small"
                              sx={{ borderRadius: 2 }}
                            />
                          </Box>
                          <Avatar 
                            sx={{ 
                              bgcolor: shift.booked ? 'success.main' : 'primary.main',
                              width: 40,
                              height: 40
                            }}
                          >
                            <Schedule />
                          </Avatar>
                        </Stack>

                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {shift.startTime} - {shift.endTime}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {getSpecificDate(shift.dayOfWeek, shift.date)} ({getDayName(shift.dayOfWeek)})
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Tối đa: {shift.maxUsers} người
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleViewDetails(shift.id)}
                              sx={{ 
                                border: '1px solid',
                                borderColor: 'info.main',
                                '&:hover': { bgcolor: 'info.50' }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {role === "admin" && (
                            <Tooltip title="Chỉnh sửa">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleEditShift(shift)}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'warning.main',
                                  '&:hover': { bgcolor: 'warning.50' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {(role === "staff" || role === "admin") && !shift.booked && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PersonAdd fontSize="small" />}
                              onClick={() => handleRegisterShift(shift)}
                              sx={{ 
                                flex: 1,
                                borderRadius: 2,
                                textTransform: 'none'
                              }}
                            >
                              Đăng ký
                            </Button>
                          )}

                          <Tooltip title="Chuyển vào lịch sử">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleMoveToHistory(shift.id)}
                              sx={{ 
                                border: '1px solid',
                                borderColor: 'error.main',
                                '&:hover': { bgcolor: 'error.50' }
                              }}
                            >
                              <Archive fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      <ToastContainer />
    </Container>
  );
};

export default Workshift;