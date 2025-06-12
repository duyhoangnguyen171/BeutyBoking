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
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../../asset/styles/appointment/appointment.css";
import AppointmentService from "../../services/AppointmentService";
import ServiceService from "../../services/Serviceservice";
import * as UserService from "../../services/UserService";
import AppointmentAdd from "./AppointmentAdd";
import AppointmentDetail from "./AppointmentDetail";
import AppointmentEdit from "./AppointmentEdit";
import { useSnackbar } from "notistack";
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
        setTotalPages(appointmentRes.data.totalPages || 1);
        setServices(serviceRes.data.$values || serviceRes.data || []);
        setCustomers(userRes.$values || userRes.data || []);
        setStaffs(userRes.$values || userRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu");
        toast.error("Lỗi khi tải dữ liệu lịch hẹn hoặc dịch vụ.");
        setLoading(false);
      }
    };
    fetchData();
  }, [page, reloadKey]);
  const handleRemind = async (id) => {
    try {
      await AppointmentService.remindAppointment(id);
      enqueueSnackbar("Đã gửi nhắc lịch thành công.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Gửi nhắc lịch thất bại.", { variant: "error" });
    }
  };
  useEffect(() => {
    let filtered = [...appointments].filter((app) => app.status !== 4);

    if (searchTerm) {
      filtered = filtered.filter((app) => {
        const customerName = app.customerFullName || "";
        return customerName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredAppointments(filtered);
    if (filtered.length === 0 && page < totalPages) setPage(page + 1);
  }, [searchTerm, sortOrder, appointments, page, totalPages]);

  const handleCancel = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setOpenCancelDialog(true);
  };

  const confirmCancel = async () => {
    try {
      await AppointmentService.updateStatus(selectedAppointmentId, 4);
      toast.success("Lịch hẹn đã được đưa vào thùng rác.");
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === selectedAppointmentId ? { ...app, status: 4 } : app
        )
      );
      setOpenCancelDialog(false);
      setSelectedAppointmentId(null);
    } catch (err) {
      console.error("Lỗi khi hủy lịch:", err);
      toast.error("Không thể hủy lịch hẹn.");
    }
  };

  const handleCancelDialogClose = () => {
    setOpenCancelDialog(false);
    setSelectedAppointmentId(null);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await AppointmentService.updateStatus(appointmentId, newStatus);
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Danh sách cuộc hẹn</h2>
      <Stack direction="row" spacing={2} className="mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
          Thêm lịch hẹn
        </Button>
        <TextField
          label="Tìm kiếm khách hàng"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sắp xếp ({sortOrder === "asc" ? "Tăng" : "Giảm"})
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/admin/appointments/canceled"
        >
          Thùng rác
        </Button>
      </Stack>

      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : filteredAppointments.length === 0 ? (
        <div>Không có cuộc hẹn nào.</div>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Nhân viên</th>
                <th>Thời gian</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app, index) => (
                <tr key={app.id}>
                  <td>{(page - 1) * rowsPerPage + index + 1}</td>
                  <td>{app.customerFullName}</td>
                  <td>{app.staffFullName}</td>
                  <td>
                    {new Date(app.appointmentDate).toLocaleString("vi-VN")}
                  </td>
                  <td>{app.serviceNames || "Không có dịch vụ"}</td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, parseInt(e.target.value))
                      }
                    >
                      <option value={0}>Mới tạo</option>
                      <option value={1}>Chờ xác nhận</option>
                      <option value={2}>Đã xác nhận</option>
                      <option value={3}>Hoàn thành</option>
                      <option value={4}>Hủy</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      size="small"
                      color="info"
                      onClick={() => {
                        setSelectedAppointment(app);
                        setOpenViewDialog(true);
                      }}
                    >
                      Xem
                    </Button>
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => {
                        setSelectedAppointment(app);
                        setOpenEditDialog(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancel(app.id)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleRemind(app.id)}
                    >
                      Nhắc lịch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
          />
        </>
      )}

      <AppointmentAdd
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={() => {
          setOpenAddDialog(false);
          setPage((prev) => prev); // Trigger reload nếu cần
        }}
      />

      <AppointmentEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        appointmentId={selectedAppointment?.id}
        initialData={selectedAppointment}
        onSuccess={() => {
          setOpenEditDialog(false);
          setPage((prev) => prev); // Reload lại dữ liệu để cập nhật khung giờ và dịch vụ
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
    </div>
  );
};

export default Appointment;
