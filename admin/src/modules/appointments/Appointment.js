import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  MessageCircle,
  CalendarCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useSnackbar } from "notistack";
import AppointmentService from "../../services/AppointmentService";
import ServiceService from "../../services/Serviceservice";
import * as UserService from "../../services/UserService";
import AppointmentAdd from "./AppointmentAdd";
import AppointmentDetail from "./AppointmentDetail";
import AppointmentEdit from "./AppointmentEdit";

const resolveReferences = (data, cache = new Map()) => {
  if (!data) return [];
  if (typeof data !== "object") return data;
  if (data.$id && cache.has(data.$id)) return cache.get(data.$id);

  const resolved = data.$id ? { ...data } : data;
  if (data.$id) cache.set(data.$id, resolved);

  if (Array.isArray(data))
    return data.map((item) => resolveReferences(item, cache));

  if (data.$values) {
    resolved.$values = resolveReferences(data.$values, cache);
    return resolved.$values;
  }

  for (const key in resolved) {
    if (key !== "$ref" && key !== "$id") {
      resolved[key] = resolveReferences(resolved[key], cache);
    }
  }

  delete resolved.$id;
  delete resolved.$ref;

  return resolved;
};

const Appointment = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;
  const [reloadKey, setReloadKey] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page"), 10);
    if (pageParam && pageParam >= 1 && pageParam <= totalPages)
      setPage(pageParam);
    else setPage(1);
    setSearchTerm("");
  }, [location.search, totalPages]);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentRes, serviceRes, userRes] = await Promise.all([
        AppointmentService.getAll({ page, pageSize: rowsPerPage }),
        ServiceService.getAll(),
        UserService.getUsers(),
      ]);

      const appointmentData = appointmentRes.data.data
        ? resolveReferences(appointmentRes.data.data)
        : resolveReferences(appointmentRes.data) || [];

      appointmentData.forEach((app) => {
        if (app.appointmentServices?.length > 0) {
          app.serviceNames = app.appointmentServices
            .map((s) => s.serviceName)
            .join(", ");
        } else if (app.serviceIds?.$values) {
          const ids = app.serviceIds.$values.map((s) =>
            typeof s === "object" ? s.id : s
          );
          app.serviceNames = services
            .filter((s) => ids.includes(s.id))
            .map((s) => s.name)
            .join(", ");
        } else {
          app.serviceNames = "Không có dịch vụ";
        }
      });

      setAppointments(appointmentData);
      if (appointmentRes.data.currentPage && appointmentRes.data.currentPage !== page) {
        setPage(appointmentRes.data.currentPage);
      }
      setTotalPages(appointmentRes.data.totalPages || 1);
      setServices(serviceRes.data.$values || serviceRes.data || []);
      setCustomers(userRes.$values || userRes.data || []);
      setStaffs(userRes.$values || userRes.data || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu");
      toast.error("Lỗi khi tải dữ liệu lịch hẹn hoặc dịch vụ.");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [page, reloadKey]);

useEffect(() => {
  let filtered = [...appointments].filter((app) => app.status !== 4);

  if (searchTerm) {
    filtered = filtered.filter((app) => {
      const customerName = app.customerFullName || "";
      return customerName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  filtered.sort((a, b) => b.appointmentId - a.appointmentId);

  setFilteredAppointments(filtered);
}, [appointments, searchTerm]);
const confirmCancel = async () => {
  try {
    await AppointmentService.updateStatus(selectedAppointmentId, 4);
    toast.success("Lịch hẹn đã được đưa vào thùng rác.");
    
    setReloadKey(prev => prev + 1);
    
    setOpenCancelDialog(false);
    setSelectedAppointmentId(null);
  } catch (err) {
    console.error("Lỗi khi hủy lịch:", err);
    toast.error("Không thể hủy lịch hẹn.");
  }
};

const handleStatusChange = async (appointmentId, newStatus) => {
  try {
    await AppointmentService.updateStatus(appointmentId, newStatus);
    
    setReloadKey(prev => prev + 1);
    
    toast.success("Cập nhật trạng thái thành công!");
  } catch (error) {
    toast.error("Không thể cập nhật trạng thái.");
  }
};

const handleRemind = async (id) => {
  try {
    await AppointmentService.remindAppointment(id);
    enqueueSnackbar("Đã gửi nhắc lịch thành công.", { variant: "success" });
  } catch (err) {
    enqueueSnackbar("Gửi nhắc lịch thất bại.", { variant: "error" });
  }
};

const handleCancel = (appointmentId) => {
  setSelectedAppointmentId(appointmentId);
  setOpenCancelDialog(true);
};

const handleCancelDialogClose = () => {
  setOpenCancelDialog(false);
  setSelectedAppointmentId(null);
};

  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: "Mới tạo", color: "default", icon: <AlertCircle size={16} /> },
      1: { label: "Chờ xác nhận", color: "warning", icon: <Clock size={16} /> },
      2: { label: "Đã xác nhận", color: "success", icon: <CheckCircle size={16} /> },
      3: { label: "Hoàn thành", color: "primary", icon: <CalendarCheck size={16} /> },
      4: { label: "Hủy", color: "error", icon: <XCircle size={16} /> }
    };
    return statusMap[status] || statusMap[0];
  };

  const statsData = [
    {
      title: "Mới tạo",
      count: appointments.filter(a => a.status === 0).length,
      color: "default",
      icon: <AlertCircle size={24} />
    },
    {
      title: "Chờ xác nhận", 
      count: appointments.filter(a => a.status === 1).length,
      color: "warning",
      icon: <Clock size={24} />
    },
    {
      title: "Đã xác nhận",
      count: appointments.filter(a => a.status === 2).length, 
      color: "success",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Hoàn thành",
      count: appointments.filter(a => a.status === 3).length,
      color: "primary", 
      icon: <CalendarCheck size={24} />
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={32} />
                Quản lý lịch hẹn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý và theo dõi tất cả các cuộc hẹn
              </Typography>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => setOpenAddDialog(true)}
                sx={{ textTransform: 'none' }}
              >
                Thêm lịch hẹn
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/admin/appointments/canceled"
                startIcon={<Trash2 size={20} />}
                sx={{ textTransform: 'none' }}
              >
                Thùng rác
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.count}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: `${stat.color === 'default' ? 'grey' : stat.color}.100`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: `${stat.color === 'default' ? 'grey' : stat.color}.600`
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              label="Tìm kiếm khách hàng"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="outlined"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              startIcon={<Filter size={20} />}
              sx={{ textTransform: 'none' }}
            >
              Sắp xếp ({sortOrder === "asc" ? "Tăng" : "Giảm"})
            </Button>
            <Typography variant="body2" color="text.secondary">
              Tổng: <strong>{filteredAppointments.length}</strong> lịch hẹn
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Main Content */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Calendar size={64} style={{ color: '#ccc', marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              Không có lịch hẹn nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Chưa có lịch hẹn nào được tạo hoặc không khớp với bộ lọc của bạn.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ textTransform: 'none' }}
            >
              Tạo lịch hẹn đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Khách hàng</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Nhân viên</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Thời gian</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Dịch vụ</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Trạng thái</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((app, index) => {
                    const statusInfo = getStatusInfo(app.status);
                    return (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '16px' }}>
                          <Typography variant="body2" fontWeight={500}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </Typography>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: 'primary.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <User size={16} />
                            </Box>
                            <Typography variant="body2" fontWeight={500}>
                              {app.customerFullName}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Users size={16} />
                            <Typography variant="body2">
                              {app.staffFullName}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Clock size={16} />
                            <Typography variant="body2">
                              {new Date(app.appointmentDate).toLocaleString("vi-VN")}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Typography variant="body2">
                            {app.serviceNames || "Không có dịch vụ"}
                          </Typography>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, parseInt(e.target.value))}
                            >
                              <MenuItem value={0}>Mới tạo</MenuItem>
                              <MenuItem value={1}>Chờ xác nhận</MenuItem>
                              <MenuItem value={2}>Đã xác nhận</MenuItem>
                              <MenuItem value={3}>Hoàn thành</MenuItem>
                              <MenuItem value={4}>Hủy</MenuItem>
                            </Select>
                          </FormControl>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedAppointment(app);
                                  setOpenViewDialog(true);
                                }}
                              >
                                <Eye size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedAppointment(app);
                                  setOpenEditDialog(true);
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Nhắc lịch">
                              <IconButton
                                size="small"
                                onClick={() => handleRemind(app.id)}
                              >
                                <MessageCircle size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy lịch">
                              <IconButton
                                size="small"
                                onClick={() => handleCancel(app.id)}
                                color="error"
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Card>
          
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Dialogs */}
      <AppointmentAdd
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={() => {
          setOpenAddDialog(false);
          setReloadKey(prev => prev + 1);
        }}
      />

      <AppointmentEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        appointmentId={selectedAppointment?.id}
        initialData={selectedAppointment}
        onSuccess={() => {
          setOpenEditDialog(false);
          setReloadKey(prev => prev + 1);
        }}
      />

      <AppointmentDetail
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        appointment={selectedAppointment}
        customers={customers}
        staffs={staffs}
        services={services}
      />

      <Dialog open={openCancelDialog} onClose={handleCancelDialogClose}>
        <DialogTitle>Xác nhận hủy</DialogTitle>
        <DialogContent>
          <Typography>Bạn chắc chắn muốn hủy lịch hẹn này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>Không</Button>
          <Button color="error" onClick={confirmCancel}>
            Có
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
    </Box>
  );
};

export default Appointment;