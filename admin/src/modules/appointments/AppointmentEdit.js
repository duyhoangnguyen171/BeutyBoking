// src/components/appointments/AppointmentEdit.jsx

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppointmentService from "../../services/AppointmentService";
import ServiceService from "../../services/Serviceservice";
import { getUserById } from "../../services/UserService";
import WorkShiftService from "../../services/WorkShiftService";

const AppointmentEdit = ({
  open,
  onClose,
  onSuccess,
  appointmentId,
  initialData,
}) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    customerId: "",
    staffId: "",
    serviceIds: [],
    workShiftId: "",
    timeSlot: "",
    notes: "",
    status: 0,
  });

  const [staffList, setStaffList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [guestData, setGuestData] = useState({ phone: "", fullName: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        let appointment = initialData;

        if (!appointment || !appointment.id) {
          if (!appointmentId)
            throw new Error("Không có ID lịch hẹn để tải dữ liệu.");
          const response = await AppointmentService.getById(appointmentId);
          appointment = response;
        }

        const date = new Date(appointment.appointmentDate);
        const formattedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);

        const serviceIds =
          appointment.appointmentServices?.$values?.map((s) => s.serviceId) ||
          [];

        setAppointmentData({
          appointmentDate: formattedDate,
          customerId: appointment.customerId || "",
          staffId: appointment.staffId || "",
          serviceIds,
          workShiftId: appointment.workShiftId || "",
          timeSlot: appointment.timeSlotId || "",
          notes: appointment.notes || "",
          status: appointment.status || 0,
        });

        if (appointment.customerId) {
          const customer = await getUserById(appointment.customerId);
          if (customer.isGuest) {
            setIsGuest(true);
            setGuestData({
              fullName: customer.fullName || "",
              phone: customer.phone || "",
            });
          }
        }
      } catch (err) {
        setErrorMessage("Không thể tải lịch hẹn: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (open && (appointmentId || initialData)) fetchAppointment();
  }, [open, appointmentId, initialData]);

  useEffect(() => {
    if (appointmentData.appointmentDate) {
      const formattedDate = new Date(appointmentData.appointmentDate)
        .toISOString()
        .split("T")[0];
      WorkShiftService.getStaffByDate(formattedDate).then((res) => {
        setStaffList(res?.$values || []);
      });
    }
  }, [appointmentData.appointmentDate]);

  useEffect(() => {
    const fetchWorkShiftId = async () => {
      if (!appointmentData.staffId || !appointmentData.appointmentDate) return;
      const date = new Date(appointmentData.appointmentDate)
        .toISOString()
        .split("T")[0];
      try {
        const res = await WorkShiftService.getWorkShiftId(
          appointmentData.staffId,
          date
        );
        if (res?.workShiftId) {
          setAppointmentData((prev) => ({
            ...prev,
            workShiftId: res.workShiftId,
          }));
        }
      } catch (err) {
        setErrorMessage("Không lấy được ca làm của nhân viên.");
      }
    };
    fetchWorkShiftId();
  }, [appointmentData.staffId, appointmentData.appointmentDate]);

  useEffect(() => {
    if (appointmentData.appointmentDate && appointmentData.staffId) {
      const formattedDate = new Date(appointmentData.appointmentDate)
        .toISOString()
        .split("T")[0];
      WorkShiftService.getTimeSlotsByStaffAndDate(
        appointmentData.staffId,
        formattedDate
      )
        .then((res) => setTimeSlots(res?.$values || []))
        .catch(() => setTimeSlots([]));
    }
  }, [appointmentData.appointmentDate, appointmentData.staffId]);

  useEffect(() => {
    const getAllService = async () => {
      try {
        const res = await ServiceService.getAll();
        const services = res.data?.$values || res.data || [];
        setServiceList(services);
      } catch (e) {
        setErrorMessage("Lỗi khi lấy danh sách dịch vụ.");
      }
    };
    getAllService();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]:
        name === "serviceIds"
          ? typeof value === "string"
            ? value.split(",")
            : value
          : value,
    }));
  }, []);

  const handleSubmit = async () => {
    setErrorMessage("");
    if (
      !appointmentData.appointmentDate ||
      !appointmentData.staffId ||
      !appointmentData.serviceIds.length ||
      !appointmentData.timeSlot
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (new Date(appointmentData.appointmentDate) < new Date()) {
      setErrorMessage("Thời gian phải ở tương lai.");
      return;
    }
    try {
      const payload = {
        id: appointmentId,
        appointmentDate: new Date(
          appointmentData.appointmentDate
        ).toISOString(),
        customerId: parseInt(appointmentData.customerId),
        staffId: parseInt(appointmentData.staffId),
        workShiftId: parseInt(appointmentData.workShiftId),
        timeSlotId: parseInt(appointmentData.timeSlot), // ✅ Gửi timeSlotId
        serviceIds: appointmentData.serviceIds.map(Number),
        notes: appointmentData.notes,
        status: parseInt(appointmentData.status),
      };
      console.log("pay:", payload);
      await AppointmentService.update(appointmentId, payload);
      toast.success("Cập nhật lịch hẹn thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (e) {
      setErrorMessage(
        "Lỗi cập nhật: " + (e.response?.data?.message || e.message)
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}

          <TextField
            label="Ngày"
            type="date"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Nhân viên</InputLabel>
            <Select
              name="staffId"
              value={appointmentData.staffId}
              onChange={handleChange}
            >
              {staffList.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1">Khung giờ</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {timeSlots.map((t) => {
              const time = new Date(
                `1970-01-01T${t.startTime}`
              ).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              const isSelected = appointmentData.timeSlot === t.id;
              return (
                <Button
                  key={t.id}
                  variant={isSelected ? "contained" : "outlined"}
                  color={isSelected ? "primary" : "inherit"}
                  onClick={() =>
                    setAppointmentData((prev) => ({ ...prev, timeSlot: t.id }))
                  }
                  sx={{
                    borderRadius: "20px",
                    minWidth: "90px",
                    padding: "6px 12px",
                  }}
                >
                  {time}
                </Button>
              );
            })}
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Dịch vụ</InputLabel>
            <Select
              multiple
              name="serviceIds"
              value={appointmentData.serviceIds}
              onChange={handleChange}
              input={<OutlinedInput label="Dịch vụ" />}
              renderValue={(selected) =>
                serviceList
                  .filter((s) => selected.includes(s.id))
                  .map((s) => s.name)
                  .join(", ")
              }
            >
              {serviceList.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox
                    checked={appointmentData.serviceIds.includes(s.id)}
                  />
                  <ListItemText primary={s.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ghi chú"
            name="notes"
            value={appointmentData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={appointmentData.status}
              onChange={handleChange}
            >
              <MenuItem value={0}>Chờ duyệt</MenuItem>
              <MenuItem value={1}>Chờ xác nhận</MenuItem>
              <MenuItem value={2}>Đã xác nhận</MenuItem>
              <MenuItem value={3}>Hoàn thành</MenuItem>
              <MenuItem value={4}>Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Cập nhật"}
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default AppointmentEdit;
