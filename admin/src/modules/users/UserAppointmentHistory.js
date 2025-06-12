import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import { getAppointmentHistory,getUserById } from "../../services/UserService";

const getStatusText = (statusText) => statusText ?? "Không rõ";

const rowsPerPage = 10;

const UserAppointmentHistory = () => {
  const { id: userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchHistory = async () => {
      try {
         const user = await getUserById(userId);
         setUserName(user.fullName || `ID ${userId}`);
        const history = await getAppointmentHistory(userId); // ❗ Bỏ .data
        
        setAppointments(history); // ✅ history là mảng đã xử lý sẵn
      } catch (err) {
        console.error("Lỗi khi tải lịch sử đặt lịch:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const paged = appointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="container mt-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">
          Lịch sử đặt lịch của khách hàng {userName}
        </Typography>
        <Button variant="outlined" component={Link} to="/admin/users">
          ← Quay lại danh sách người dùng
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress className="mt-4" />
      ) : error ? (
        <Typography color="error" className="mt-4">
          {error}
        </Typography>
      ) : appointments.length === 0 ? (
        <Typography className="mt-4">Không có lịch sử đặt lịch.</Typography>
      ) : (
        <>
          <Table className="mt-4">
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.date}</TableCell>
                  <TableCell>{`${app.startTime} - ${app.endTime}`}</TableCell>
                  <TableCell>{app.staffFullName}</TableCell>
                  <TableCell>{app.services.join(", ")}</TableCell>
                  <TableCell>{app.notes || "-"}</TableCell>
                  <TableCell>{getStatusText(app.statusText)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            count={Math.ceil(appointments.length / rowsPerPage)}
            page={page}
            onChange={(e, val) => setPage(val)}
            className="mt-3"
          />
        </>
      )}
    </div>
  );
};

export default UserAppointmentHistory;
