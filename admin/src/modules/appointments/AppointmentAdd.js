// src/components/appointments/AppointmentAdd.jsx

import {
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Notes as NotesIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  RoomService as ServiceIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
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
  const [searchLoading, setSearchLoading] = useState(false);

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
    if (!phoneQuery.trim()) {
      toast.warning("Vui lòng nhập số điện thoại");
      return;
    }
    
    setSearchLoading(true);
    try {
      const result = await getCustomerByPhone(phoneQuery);
      setMatchedCustomers(result);
      if (result.length === 0) {
        toast.info("Không tìm thấy khách hàng với số điện thoại này");
      }
    } catch (e) {
      toast.error("Không tìm thấy khách hàng");
      setMatchedCustomers([]);
    } finally {
      setSearchLoading(false);
    }
  };
const getSelectedServices = () => {
  return serviceList
    .filter((s) => appointmentData.serviceIds.includes(s.id))
    .map((s) => s.name);
};
  const handleSubmit = async () => {
  // Validation
  if (!appointmentData.appointmentDate) {
    toast.error("Vui lòng chọn ngày hẹn");
    return;
  }

  // Log the appointment date before submitting
  console.log("Appointment Date:", appointmentData.appointmentDate);

  // Convert appointmentDate from local time (e.g., Vietnam) to UTC
  const localAppointmentDate = new Date(appointmentData.appointmentDate);  // This is local time (Vietnam time)
  const utcAppointmentDate = new Date(localAppointmentDate).toISOString();  // Convert to UTC and format as ISO string

  // Additional validation
  if (!appointmentData.staffId) {
    toast.error("Vui lòng chọn nhân viên");
    return;
  }
  if (!appointmentData.timeSlot) {
    toast.error("Vui lòng chọn khung giờ");
    return;
  }
  if (appointmentData.serviceIds.length === 0) {
    toast.error("Vui lòng chọn ít nhất một dịch vụ");
    return;
  }
  if (!isGuest && !appointmentData.customerId) {
    toast.error("Vui lòng chọn khách hàng hoặc chọn khách vãng lai");
    return;
  }
  if (isGuest && (!guestInfo.fullName.trim() || !guestInfo.phone.trim())) {
    toast.error("Vui lòng điền đầy đủ thông tin khách vãng lai");
    return;
  }

  setLoading(true);
  try {
    let customerId = currentUserId;

    // Handle guest customer creation
    if (isGuest) {
      const guest = await createGuest(guestInfo);
      customerId = guest.id; // Get the newly created guest ID
    } else if (matchedCustomers.length > 0) {
      customerId = appointmentData.customerId;  // Use the matched customer's ID
    }

    const payload = {
      ...appointmentData,
      customerId,
      timeSlotId: appointmentData.timeSlot,
      appointmentDate: utcAppointmentDate,  // Ensure appointmentDate is in UTC
    };

    // Call API to create appointment
    await AppointmentService.create(payload);

    toast.success("Thêm lịch hẹn thành công!");
    setTimeout(() => {
      window.location.reload();  // Refresh page or update state as needed
    }, 1500);
  } catch (e) {
    toast.error("Lỗi khi thêm lịch");
  } finally {
    setLoading(false);
  }
};




  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CalendarIcon />
        Thêm lịch hẹn mới
        <IconButton
          sx={{ ml: 'auto', color: 'white' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {errorMessage && (
          <Fade in={!!errorMessage}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          </Fade>
        )}

        <Grid container spacing={3}>
          {/* Date Selection */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Thời gian
              </Typography>
              <TextField
                label="Ngày hẹn"
                type="datetime-local"
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
                sx={{ mb: 2 }}
              />
            </Paper>
          </Grid>

          {/* Customer Selection */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Khách hàng
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isGuest}
                    onChange={() => {
                      setIsGuest((v) => !v);
                      setMatchedCustomers([]);
                      setPhoneQuery("");
                      setAppointmentData(p => ({ ...p, customerId: "" }));
                    }}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon fontSize="small" />
                    Khách vãng lai
                  </Box>
                }
                sx={{ mb: 2 }}
              />

              {!isGuest ? (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Số điện thoại khách"
                      value={phoneQuery}
                      onChange={(e) => setPhoneQuery(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handlePhoneSearch();
                        }
                      }}
                    />
                    <Tooltip title="Tìm kiếm khách hàng">
                      <IconButton 
                        onClick={handlePhoneSearch}
                        disabled={searchLoading}
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        {searchLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {matchedCustomers.length > 0 && (
                    <Fade in={matchedCustomers.length > 0}>
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon fontSize="small" />
                                {c.fullName}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Fade>
                  )}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <TextField
                    label="Họ tên khách"
                    value={guestInfo.fullName}
                    onChange={(e) =>
                      setGuestInfo((p) => ({ ...p, fullName: e.target.value }))
                    }
                    fullWidth
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <TextField
                    label="Số điện thoại"
                    value={guestInfo.phone}
                    onChange={(e) =>
                      setGuestInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                    fullWidth
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Staff Selection */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" />
                Nhân viên
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Chọn nhân viên</InputLabel>
                <Select
                  name="staffId"
                  value={appointmentData.staffId}
                  onChange={(e) =>
                    setAppointmentData((p) => ({ ...p, staffId: e.target.value }))
                  }
                  disabled={!appointmentData.appointmentDate}
                >
                  {staffList.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon fontSize="small" />
                        {s.fullName}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!appointmentData.appointmentDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng chọn ngày hẹn trước
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Time Slots */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon color="primary" />
                Khung giờ
              </Typography>
              
              {timeSlots.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                      <Chip
                        key={t.id}
                        label={time}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        onClick={() =>
                          t.isAvailable &&
                          setAppointmentData((prev) => ({ ...prev, timeSlot: t.id }))
                        }
                        disabled={!t.isAvailable}
                        sx={{
                          cursor: t.isAvailable ? 'pointer' : 'not-allowed',
                          '&:hover': t.isAvailable ? {
                            backgroundColor: isSelected ? 'primary.dark' : 'primary.light',
                            color: 'white'
                          } : {},
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {appointmentData.appointmentDate && appointmentData.staffId 
                    ? "Không có khung giờ khả dụng" 
                    : "Vui lòng chọn ngày hẹn và nhân viên"}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Services */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ServiceIcon color="primary" />
            Dịch vụ
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Chọn dịch vụ</InputLabel>
            <Select
              multiple
              value={appointmentData.serviceIds}
              onChange={(e) =>
                setAppointmentData((p) => ({
                  ...p,
                  serviceIds: e.target.value,
                }))
              }
              input={<OutlinedInput label="Chọn dịch vụ" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {getSelectedServices().map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {serviceList.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox
                    checked={appointmentData.serviceIds.includes(s.id)}
                    color="primary"
                  />
                  <ListItemText primary={s.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {appointmentData.serviceIds.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Đã chọn {appointmentData.serviceIds.length} dịch vụ
            </Typography>
          )}
        </Paper>

        {/* Notes */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotesIcon color="primary" />
            Ghi chú
          </Typography>
          <TextField
            label="Ghi chú thêm"
            value={appointmentData.notes}
            onChange={(e) =>
              setAppointmentData((p) => ({ ...p, notes: e.target.value }))
            }
            fullWidth
            multiline
            rows={3}
            placeholder="Nhập ghi chú về lịch hẹn..."
          />
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          size="large"
          sx={{ 
            minWidth: 120,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Đang thêm...
            </>
          ) : (
            "Thêm lịch hẹn"
          )}
        </Button>
      </DialogActions>
      
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
    </Dialog>
  );
};

export default AppointmentAdd;