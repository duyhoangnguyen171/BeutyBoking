import React, { useEffect, useState } from "react";
import WorkShiftService from "../../services/WorkShiftService";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

const WorkshiftHistory = () => {
  const [historyShifts, setHistoryShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await WorkShiftService.getHistory();
        console.log("Dữ liệu lịch sử:", response); // Kiểm tra dữ liệu trả về

        // Chuyển đổi thời gian thành chuỗi có thể đọc được
        const formattedShifts = response.map((shift) => ({
          ...shift,
          // Chuyển startTime thành định dạng giờ đúng
          startTime: shift.startTime
            ? new Date(`1970-01-01T${shift.startTime}`).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )
            : "Không hợp lệ",

          // Chuyển endTime thành định dạng giờ đúng
          endTime: shift.endTime
            ? new Date(`1970-01-01T${shift.endTime}`).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )
            : "Không hợp lệ",

          // Chuyển date thành định dạng ngày đúng
          date: shift.date
            ? new Date(shift.date).toLocaleDateString("vi-VN")
            : "Không hợp lệ",
        }));

        setHistoryShifts(formattedShifts);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử ca làm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lịch Sử Ca Làm
      </Typography>
      {loading ? (
        <Typography variant="body1">Đang tải...</Typography>
      ) : historyShifts.length === 0 ? (
        <Typography variant="body1">
          Không có ca làm nào trong lịch sử.
        </Typography>
      ) : (
        <List>
          {historyShifts.map((shift) => (
            <ListItem
              key={shift.id}
              sx={{
                bgcolor: "#f9f9f9",
                mb: 1,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <ListItemText
                primary={<strong>{shift.name}</strong>}
                secondary={`Thời gian: ${shift.startTime} - ${shift.endTime}, Ngày: ${shift.date}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default WorkshiftHistory;
