import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllStaff } from "../../services/UserService"; // Import service
import StaffAdd from "./StaffAdd"; // Modal thêm nhân viên
import StaffEdit from "./StaffEdit"; // Modal chỉnh sửa nhân viên
import { deleteStaff } from "../../services/UserService";
const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [openEditStaff, setOpenEditStaff] = useState(false);
  const [openViewStaff, setOpenViewStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rowsPerPage = 8;
  const [page, setPage] = useState(1);

  const loadStaff = async () => {
  setLoading(true);
  try {
    const data = await getAllStaff();
    const sortedData = data.sort((a, b) => b.id - a.id);  // Sắp xếp theo ID giảm dần
    setStaffList(sortedData);
    setFilteredStaff(sortedData);
  } catch (error) {
    console.error("Error fetching staff:", error);
    toast.error("Lỗi khi tải danh sách nhân viên", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setLoading(false);
  }
};
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : names[0][0];
  };
  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    let filtered = [...staffList];

    if (searchQuery) {
      filtered = filtered.filter(
        (staff) =>
          (staff.fullName &&
            staff.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (staff.email &&
            staff.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (staff.phone && staff.phone.includes(searchQuery))
      );
    }

    setFilteredStaff(filtered);
    setPage(1); // Reset to first page after filter or search
  }, [searchQuery, staffList]);

  const handleOpenAddStaff = () => setOpenAddStaff(true);
  const handleCloseAddStaff = () => setOpenAddStaff(false);
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      case "Staff":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "Customer":
        return { backgroundColor: "#dcfce7", color: "#16a34a" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };
  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setOpenEditStaff(true);
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setOpenViewStaff(true);
  };

  const handleCloseViewStaff = () => setOpenViewStaff(false);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      setLoading(true); // Set loading state to prevent further actions
      try {
        // Call the deleteStaff function from services
        await deleteStaff(id); // Assuming deleteStaff is properly defined and imported
        toast.success("Nhân viên đã được xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        loadStaff(); // Reload the staff list after deletion
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error("Lỗi khi xóa nhân viên", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedStaff = filteredStaff.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1e293b",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <PeopleIcon sx={{ fontSize: 40, color: "#3b82f6" }} />
          Quản lý Nhân viên
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả nhân viên trong hệ thống
        </Typography>
      </Box>

      {/* Action Bar */}
      <Card sx={{ mb: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenAddStaff}
              disabled={loading}
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              Thêm nhân viên
            </Button>
            <TextField
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
              size="small"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card sx={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress sx={{ mr: 2 }} />
            <Typography color="text.secondary">
              Đang tải danh sách nhân viên...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    {[
                      "ID",
                      "Người dùng",
                      "Thông tin liên hệ",
                      "Vai trò",
                      "Thao tác",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: "bold",
                          color: "#374151",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStaff.length > 0 ? (
                    paginatedStaff.map((staff) => (
                      <TableRow
                        key={staff.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafb" },
                          "&:nth-of-type(even)": { backgroundColor: "#fdfdfd" },
                        }}
                      >
                        <TableCell>{staff.id}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#3b82f6",
                                width: 40,
                                height: 40,
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                              src={staff.imageurl || undefined} // Hiển thị ảnh nếu có, hoặc sử dụng màu nền mặc định
                            >
                              {!staff.imageurl && getInitials(staff.fullName)}{" "}
                              // Hiển thị chữ cái đại diện nếu không có ảnh
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                color="#1e293b"
                              >
                                {staff.fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ID: {staff.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            {staff.email && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <EmailIcon
                                  sx={{ fontSize: 16, color: "#6b7280" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {staff.email}
                                </Typography>
                              </Box>
                            )}
                            {staff.phone && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PhoneIcon
                                  sx={{ fontSize: 16, color: "#6b7280" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {staff.phone}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={staff.role || "N/A"}
                            size="small"
                            sx={{
                              ...getRoleColor(staff.role),
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                onClick={() => handleViewStaff(staff)}
                                disabled={loading}
                                sx={{
                                  color: "#3b82f6",
                                  "&:hover": { backgroundColor: "#dbeafe" },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sửa">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(staff)}
                                disabled={loading}
                                sx={{
                                  color: "#f59e0b",
                                  "&:hover": { backgroundColor: "#fef3c7" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(staff.id)}
                                disabled={loading}
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { backgroundColor: "#fee2e2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                          Không tìm thấy nhân viên
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredStaff.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 2,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Card>

      {/* Add Staff Modal */}
      <StaffAdd
        open={openAddStaff}
        onClose={handleCloseAddStaff}
        onSave={loadStaff}
      />

      {/* Edit Staff Modal */}
      <StaffEdit
        open={openEditStaff}
        onClose={() => setOpenEditStaff(false)}
        staffdata={selectedStaff}
        onSave={loadStaff}
      />

      {/* View Staff Modal */}
      <Modal open={openViewStaff} onClose={handleCloseViewStaff}>
        <Box
          sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Chi tiết nhân viên
          </Typography>
          <Typography variant="body1">
            Họ và tên: {selectedStaff?.fullName}
          </Typography>
          <Typography variant="body1">Email: {selectedStaff?.email}</Typography>
          <Typography variant="body1">
            Số điện thoại: {selectedStaff?.phone}
          </Typography>
          <Typography variant="body1">
            Vai trò: {selectedStaff?.role}
          </Typography>
        </Box>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default Staff;
