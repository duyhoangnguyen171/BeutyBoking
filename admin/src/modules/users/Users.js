import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  AccountCircle as AccountCircleIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteUser, getUsers } from "../../services/UserService";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openViewUser, setOpenViewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;

  const navigate = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      console.log("Fetched Users:", data);
      const userList = Array.isArray(data.$values) ? data.$values : [];
      setUsers(userList);
      setFilteredUsers(userList);
      if (userList.length === 0) {
        toast.info("Không tìm thấy người dùng nào.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
      toast.error("Lỗi khi tải danh sách người dùng: " + (error.response?.data?.message || error.message), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.phone && user.phone.includes(searchQuery)) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
    setPage(1);
  }, [filterRole, searchQuery, users]);

  const handleOpenAddUser = () => setOpenAddUser(true);
  const handleCloseAddUser = () => setOpenAddUser(false);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setOpenEditUser(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewUser(true);
  };

  const handleCloseViewUser = () => {
    setOpenViewUser(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setLoading(true);
      try {
        await deleteUser(id);
        toast.success("Người dùng đã được xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        loadUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        toast.error("Lỗi khi xóa người dùng: " + (error.response?.data?.message || error.message), {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getAccountType = (isGuest) => {
    return isGuest ? "Khách vãng lai" : "Thành viên";
  };

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

  const getAccountTypeColor = (isGuest) => {
    return isGuest 
      ? { backgroundColor: "#fef2f2", color: "#dc2626" }
      : { backgroundColor: "#eff6ff", color: "#2563eb" };
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    return names.length > 1 
      ? names[0][0] + names[names.length - 1][0] 
      : names[0][0];
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1e293b',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý Người dùng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả người dùng trong hệ thống
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Tổng người dùng</Typography>
            <Typography variant="h3" fontWeight="bold">{users.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Thành viên</Typography>
            <Typography variant="h3" fontWeight="bold">
              {users.filter(u => !u.isGuest).length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Khách vãng lai</Typography>
            <Typography variant="h3" fontWeight="bold">
              {users.filter(u => u.isGuest).length}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Action Bar */}
      <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenAddUser}
              disabled={loading}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5
              }}
            >
              Thêm người dùng
            </Button>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white'
                  }
                }}
                disabled={loading}
              >
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterListIcon sx={{ fontSize: 16 }} />
                    Lọc theo vai trò
                  </Box>
                </InputLabel>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  label="Lọc theo vai trò"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  flex: 1,
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white'
                  }
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
          </Stack>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ mr: 2 }} />
            <Typography color="text.secondary">Đang tải danh sách người dùng...</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    {['ID', 'Người dùng', 'Thông tin liên hệ', 'Vai trò', 'Loại tài khoản', 'Thao tác'].map((header) => (
                      <TableCell 
                        key={header}
                        sx={{ 
                          fontWeight: 'bold',
                          color: '#374151',
                          borderBottom: '2px solid #e5e7eb'
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f9fafb' },
                          '&:nth-of-type(even)': { backgroundColor: '#fdfdfd' }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          #{user.id}
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: '#3b82f6',
                                width: 40,
                                height: 40,
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              {getInitials(user.fullName)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
                                {user.fullName || "Chưa cập nhật"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Stack spacing={1}>
                            {user.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {user.email}
                                </Typography>
                              </Box>
                            )}
                            {user.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {user.phone}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={user.role || "N/A"}
                            size="small"
                            sx={{
                              ...getRoleColor(user.role),
                              fontWeight: 600,
                              fontSize: '12px'
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={getAccountType(user.isGuest)}
                            size="small"
                            sx={{
                              ...getAccountTypeColor(user.isGuest),
                              fontWeight: 600,
                              fontSize: '12px'
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                onClick={() => handleViewUser(user)}
                                disabled={loading}
                                sx={{ 
                                  color: '#3b82f6',
                                  '&:hover': { backgroundColor: '#dbeafe' }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(user.id)}
                                disabled={loading}
                                sx={{ 
                                  color: '#f59e0b',
                                  '&:hover': { backgroundColor: '#fef3c7' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(user.id)}
                                disabled={loading}
                                sx={{ 
                                  color: '#ef4444',
                                  '&:hover': { backgroundColor: '#fee2e2' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Lịch sử đặt lịch">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/admin/users/${user.id}/appointments-history`)}
                                sx={{ 
                                  color: '#8b5cf6',
                                  '&:hover': { backgroundColor: '#f3e8ff' }
                                }}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" gutterBottom>
                            Không tìm thấy người dùng
                          </Typography>
                          <Typography variant="body2">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid #e5e7eb' }}>
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

      {/* Add User Modal */}
      <UserAdd
        open={openAddUser}
        onClose={handleCloseAddUser}
        onSuccess={() => {
          loadUsers();
          handleCloseAddUser();
        }}
      />

      {/* Edit User Modal */}
      <UserEdit
        open={openEditUser}
        onClose={() => setOpenEditUser(false)}
        userId={selectedUserId}
        onSuccess={() => {
          loadUsers();
          setOpenEditUser(false);
        }}
      />

      {/* View User Modal */}
      <Modal
        open={openViewUser}
        onClose={handleCloseViewUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openViewUser}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '600px' },
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {selectedUser && (
              <>
                {/* Modal Header */}
                <Box sx={{ 
                  p: 3, 
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc'
                }}>
                  <Typography variant="h5" fontWeight="bold" color="#1e293b">
                    Chi tiết người dùng
                  </Typography>
                  <IconButton onClick={handleCloseViewUser} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3, maxHeight: 'calc(90vh - 160px)', overflowY: 'auto' }}>
                  {/* User Avatar & Basic Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#3b82f6',
                        width: 80,
                        height: 80,
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(selectedUser.fullName)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="#1e293b" gutterBottom>
                        {selectedUser.fullName || "Chưa cập nhật"}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={selectedUser.role || "N/A"}
                          size="small"
                          sx={{ ...getRoleColor(selectedUser.role), fontWeight: 600 }}
                        />
                        <Chip
                          label={getAccountType(selectedUser.isGuest)}
                          size="small"
                          sx={{ ...getAccountTypeColor(selectedUser.isGuest), fontWeight: 600 }}
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* User Details */}
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
                        Thông tin cơ bản
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <BadgeIcon sx={{ color: '#6b7280' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              ID người dùng
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              #{selectedUser.id}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AccountCircleIcon sx={{ color: '#6b7280' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Họ và tên
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {selectedUser.fullName || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
                        Thông tin liên hệ
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <EmailIcon sx={{ color: '#6b7280' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {selectedUser.email || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <PhoneIcon sx={{ color: '#6b7280' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Số điện thoại
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {selectedUser.phone || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>

                    {selectedUser.isGuest && (
                      <>
                        <Divider />
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: '#fef2f2', 
                          borderRadius: 2,
                          border: '1px solid #fecaca'
                        }}>
                          <Typography variant="body2" color="error.main" fontWeight="500">
                            💡 Lưu ý: Đây là tài khoản khách vãng lai
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Tài khoản này được tạo tự động khi khách hàng đặt lịch mà không đăng ký thành viên.
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Box>

                {/* Modal Footer */}
                <Box sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/admin/users/${selectedUser.id}/appointments-history`)}
                      startIcon={<HistoryIcon />}
                      sx={{ 
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Xem lịch sử đặt lịch
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCloseViewUser}
                      sx={{
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4
                      }}
                    >
                      Đóng
                    </Button>
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

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
        theme="light"
      />
    </Box>
  );
};

export default Users;