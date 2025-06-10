import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  CircularProgress,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";
import { deleteUser, getUsers } from "../../services/UserService";

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
  const rowsPerPage = 7; // Maximum 7 users per page

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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
      toast.error("Lỗi khi tải danh sách người dùng: " + (error.response?.data?.message || error.message), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on role and search query
  useEffect(() => {
    let filtered = [...users];

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          (user.fullName &&
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.phone && user.phone.includes(searchQuery))
      );
    }

    setFilteredUsers(filtered);
    setPage(1); // Reset to page 1 when filter or search changes
  }, [filterRole, searchQuery, users]);

  const handleOpenAddUser = () => {
    setOpenAddUser(true);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

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
        toast.success("Người dùng đã bị xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loadUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        toast.error("Lỗi khi xóa người dùng: " + (error.response?.data?.message || error.message), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Display account type
  const getAccountType = (isGuest) => {
    return isGuest ? "Khách vãng lai" : "Thành viên";
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate pagination
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <>
      <div>
        <h1>Người dùng</h1>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          style={{ marginBottom: "20px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddUser}
            disabled={loading}
          >
            Thêm người dùng
          </Button>
          <FormControl style={{ minWidth: 150 }} disabled={loading}>
            <InputLabel>Lọc theo vai trò</InputLabel>
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
            label="Tìm kiếm theo tên hoặc số điện thoại"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: 250 }}
            disabled={loading}
          />
        </Stack>

        <UserAdd
          open={openAddUser}
          onClose={handleCloseAddUser}
          onSuccess={() => {
            loadUsers();
            handleCloseAddUser();
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang tải danh sách người dùng...</Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Loại tài khoản</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(paginatedUsers) && paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.fullName || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.role || "N/A"}</TableCell>
                        <TableCell>{user.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Typography color={user.isGuest ? "error" : "primary"}>
                            {getAccountType(user.isGuest)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              onClick={() => handleViewUser(user)}
                              disabled={loading}
                            >
                              Xem
                            </Button>
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => handleEdit(user.id)}
                              disabled={loading}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(user.id)}
                              disabled={loading}
                            >
                              Xoá
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography>Không có người dùng nào phù hợp.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredUsers.length > 0 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
                siblingCount={1}
                boundaryCount={1}
              />
            )}
          </>
        )}

        <UserEdit
          open={openEditUser}
          onClose={() => setOpenEditUser(false)}
          userId={selectedUserId}
          onSuccess={() => {
            loadUsers();
            setOpenEditUser(false);
          }}
        />

        <Modal open={openViewUser} onClose={handleCloseViewUser}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: "8px",
              p: 3,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Chi tiết người dùng
            </Typography>
            {selectedUser && (
              <>
                <Typography><strong>ID:</strong> {selectedUser.id}</Typography>
                <Typography><strong>Họ tên:</strong> {selectedUser.fullName || "N/A"}</Typography>
                <Typography><strong>Email:</strong> {selectedUser.email || "N/A"}</Typography>
                <Typography><strong>Số điện thoại:</strong> {selectedUser.phone || "N/A"}</Typography>
                <Typography><strong>Vai trò:</strong> {selectedUser.role || "N/A"}</Typography>
                <Typography>
                  <strong>Loại tài khoản:</strong>{" "}
                  <Typography
                    component="span"
                    color={selectedUser.isGuest ? "error" : "primary"}
                  >
                    {getAccountType(selectedUser.isGuest)}
                  </Typography>
                </Typography>
                {selectedUser.isGuest && (
                  <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                    Lưu ý: Đây là khách vãng lai, không có email hoặc mật khẩu.
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  onClick={handleCloseViewUser}
                  style={{ marginTop: "10px" }}
                  disabled={loading}
                >
                  Đóng
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </div>
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
    </>
  );
};

export default Users;