import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Stack, Typography } from '@mui/material';

const AppointmentDetail = ({ open, onClose, appointment, customers, staffs, services }) => {
  if (!appointment) return null;

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.fullName : 'Chưa xác định';
  };

  const getStaffName = (staffId) => {
    const staff = staffs.find((s) => s.id === staffId);
    return staff ? staff.fullName : 'Chưa xác định';
  };

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.name : 'Không rõ';
  };

  const getStatusText = (status) => {
    const statusMap = {
      1: 'Chờ xác nhận',
      2: 'Đã xác nhận',
      3: 'Đã hoàn thành',
      4: 'Đã hủy',
    };
    return statusMap[status] || 'Chưa xác định';
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      return 'Invalid Date';
    }
    return newDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ padding: 2 }}>
          <Typography>
            <strong>Tên khách hàng:</strong> {getCustomerName(appointment.customerId)}
          </Typography>
          <Typography>
            <strong>Nhân viên:</strong> {getStaffName(appointment.staffId)}
          </Typography>
          <Typography>
            <strong>Thời gian:</strong> {formatDate(appointment.appointmentDate)}
          </Typography>
          <Typography>
            <strong>Dịch vụ:</strong> {getServiceName(appointment.serviceId)}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong> {getStatusText(appointment.status)}
          </Typography>
        </Stack>
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Đóng
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetail;
