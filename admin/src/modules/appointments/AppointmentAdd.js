// src/components/appointments/AppointmentAdd.jsx

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppointmentService from "../../services/AppointmentService";
import ServiceService from "../../services/Serviceservice";
import { createGuest, getCustomerByPhone } from "../../services/UserService";
import WorkShiftService from "../../services/WorkShiftService";

const AppointmentAdd = ({ open, onClose, onSuccess, currentUserId }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    customerId: "",
    staffId: "",
    workShiftId: "",
    serviceIds: [],
    timeSlot: "",
    notes: "",
    status: 2,
  });
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ fullName: "", phone: "" });
  const [phoneQuery, setPhoneQuery] = useState("");
  const [matchedCustomers, setMatchedCustomers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      resetState();
      fetchServices();
    }
  }, [open]);

  const resetState = () => {
    setErrorMessage("");
    setAppointmentData({
      appointmentDate: "",
      customerId: "",
      staffId: "",
      workShiftId: "",
      serviceIds: [],
      timeSlot: "",
      notes: "",
      status: 0,
    });
    setGuestInfo({ fullName: "", phone: "" });
    setPhoneQuery("");
    setMatchedCustomers([]);
    setTimeSlots([]);
  };

  const fetchServices = async () => {
    try {
      const response = await ServiceService.getAll();
      const services = response.data?.$values || response.data || [];
      setServiceList(services);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách dịch vụ.");
    }
  };

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
      } catch (error) {
        console.error("Không lấy được workShiftId:", error);
        setErrorMessage("Không lấy được ca làm cho nhân viên này.");
      }
    };

    fetchWorkShiftId();
  }, [appointmentData.staffId, appointmentData.appointmentDate]);

  useEffect(() => {
    if (appointmentData.appointmentDate) {
      const fetchStaff = async () => {
        const formattedDate = new Date(appointmentData.appointmentDate)
          .toISOString()
          .split("T")[0];
        const result = await WorkShiftService.getStaffByDate(formattedDate);
        setStaffList(result.$values || []);
      };
      fetchStaff();
    }
  }, [appointmentData.appointmentDate]);

  useEffect(() => {
    if (appointmentData.appointmentDate && appointmentData.staffId) {
      const formattedDate = new Date(appointmentData.appointmentDate)
        .toISOString()
        .split("T")[0];
      WorkShiftService.getTimeSlotsByStaffAndDate(
        appointmentData.staffId,
        formattedDate
      ).then((res) => {
        const availableTimeSlots = res.$values || [];
        const currentAppointments = []; // Call API to get the current appointments

        // Map booked time slots
        const bookedTimeSlots = currentAppointments.map((appointment) => appointment.timeSlotId);
        const updatedTimeSlots = availableTimeSlots.map((timeSlot) => ({
          ...timeSlot,
          isAvailable: !bookedTimeSlots.includes(timeSlot.id),
        }));

        setTimeSlots(updatedTimeSlots);
      });
    }
  }, [appointmentData.appointmentDate, appointmentData.staffId]);

  const handlePhoneSearch = async () => {
    try {
      const result = await getCustomerByPhone(phoneQuery);
      setMatchedCustomers(result);
    } catch (e) {
      toast.error("Không tìm thấy khách hàng");
      setMatchedCustomers([]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let customerId = currentUserId;
      if (isGuest) {
        const guest = await createGuest(guestInfo);
        customerId = guest.id;
      } else if (matchedCustomers.length > 0) {
        customerId = appointmentData.customerId;
      }

      const payload = {
        ...appointmentData,
        customerId,
        timeSlotId: appointmentData.timeSlot,
        appointmentDate: new Date(
          appointmentData.appointmentDate
        ).toISOString(),
      };

      await AppointmentService.create(payload);
      toast.success("Thêm lịch hẹn thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      toast.error("Lỗi khi thêm lịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm lịch hẹn</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Ngày giờ"
            type="date"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={(e) =>
              setAppointmentData((p) => ({
                ...p,
                appointmentDate: e.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isGuest}
                onChange={() => setIsGuest((v) => !v)}
              />
            }
            label="Khách vãng lai"
          />

          {!isGuest ? (
            <Stack spacing={1}>
              <TextField
                label="Số điện thoại khách"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                fullWidth
              />
              <Button onClick={handlePhoneSearch}>Tìm</Button>
              {matchedCustomers.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel>Chọn khách hàng</InputLabel>
                  <Select
                    name="customerId"
                    value={appointmentData.customerId}
                    onChange={(e) =>
                      setAppointmentData((p) => ({
                        ...p,
                        customerId: e.target.value,
                      }))
                    }
                  >
                    {matchedCustomers.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          ) : (
            <Stack spacing={1}>
              <TextField
                label="Họ tên khách"
                value={guestInfo.fullName}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, fullName: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Số điện thoại"
                value={guestInfo.phone}
                onChange={(e) =>
                  setGuestInfo((p) => ({ ...p, phone: e.target.value }))
                }
                fullWidth
              />
            </Stack>
          )}

          <FormControl fullWidth>
            <InputLabel>Nhân viên</InputLabel>
            <Select
              name="staffId"
              value={appointmentData.staffId}
              onChange={(e) =>
                setAppointmentData((p) => ({ ...p, staffId: e.target.value }))
              }
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
              const isDisabled = !t.isAvailable;

              return (
                <Button
                  key={t.id}
                  variant={isSelected ? "contained" : "outlined"}
                  color={isSelected ? "primary" : "inherit"}
                  onClick={() =>
                    t.isAvailable &&
                    setAppointmentData((prev) => ({ ...prev, timeSlot: t.id }))
                  }
                  disabled={!t.isAvailable}
                  sx={{
                    borderRadius: "20px",
                    minWidth: "90px",
                    padding: "6px 12px",
                    opacity: t.isAvailable ? 1 : 0.5,
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
              value={appointmentData.serviceIds}
              onChange={(e) =>
                setAppointmentData((p) => ({
                  ...p,
                  serviceIds: e.target.value,
                }))
              }
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
            value={appointmentData.notes}
            onChange={(e) =>
              setAppointmentData((p) => ({ ...p, notes: e.target.value }))
            }
            fullWidth
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Thêm"}
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default AppointmentAdd;
