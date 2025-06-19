import {
  Button,
  Modal,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Fade,
  Backdrop,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  ContactMail as ContactMailIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactService from "../../services/ContactService";

const Contact = () => {
  useEffect(() => {
    document.title = "Liên hệ";
  }, []);
  
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openView, setOpenView] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const loadContacts = async () => {
    try {
      const response = await ContactService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
         const sortedContacts = data.$values.sort((a, b) => b.id - a.id); 
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
      } else {
        setContacts([]);
        setFilteredContacts([]);
        toast.error("Không có dữ liệu liên hệ.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải liên hệ:", error);
      setContacts([]);
      setFilteredContacts([]);
      toast.error("Có lỗi khi tải liên hệ. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    let filtered = [...contacts];
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredContacts(filtered);
    setPage(1);
  }, [searchTerm, contacts]);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedContacts = filteredContacts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to get random color for avatar
  const getAvatarColor = (id) => {
    const colors = [
      '#1976d2', '#dc004e', '#9c27b0', '#673ab7', 
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    return colors[id % colors.length];
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ContactMailIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #e91e63, #f06292)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quản lý Liên hệ
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Xem và quản lý tất cả tin nhắn liên hệ từ người dùng
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <TextField
            placeholder="Tìm kiếm theo tên hoặc email..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white' 
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ContactMailIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {filteredContacts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tổng số liên hệ
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white' 
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <MessageIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {totalPages}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Trang
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Table Card */}
      <Card sx={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Người gửi</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Tin nhắn</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Ngày gửi</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContacts.length > 0 ? (
                paginatedContacts.map((contact, index) => (
                  <TableRow 
                    key={contact.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#f8fafc',
                        transition: 'background-color 0.2s ease'
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: '#fafbfc'
                      }
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={contact.id} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: getAvatarColor(contact.id),
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          {getInitials(contact.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {contact.name}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" color="text.secondary">
                        {contact.message.length > 100
                          ? `${contact.message.substring(0, 100)}...`
                          : contact.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<ScheduleIcon />}
                        label={new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<BadgeIcon />}
                        label={contact.userId}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleView(contact)}
                        sx={{ 
                          color: 'info.main',
                          '&:hover': { 
                            backgroundColor: 'info.lighter',
                            transform: 'scale(1.1)' 
                          }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ContactMailIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Không có liên hệ nào để hiển thị
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có tin nhắn liên hệ nào'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      {filteredContacts.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                fontWeight: 500,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }
            }}
          />
        </Box>
      )}

      {/* View Modal with improved design */}
      <Modal 
        open={openView} 
        onClose={handleCloseView}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openView}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: '60%' },
              maxWidth: 700,
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
              p: 0,
            }}
          >
            {selectedContact && (
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Modal Header */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 3,
                  position: 'relative'
                }}>
                  <IconButton
                    onClick={handleCloseView}
                    sx={{ 
                      position: 'absolute',
                      right: 16,
                      top: 16,
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ pr: 6 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        fontSize: '1.5rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(selectedContact.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        Chi tiết liên hệ
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Thông tin chi tiết tin nhắn liên hệ
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    {/* Contact Info */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        THÔNG TIN NGƯỜI GỬI
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <PersonIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Họ tên
                            </Typography>
                            <Typography variant="body1" fontWeight="600">
                              {selectedContact.name}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <EmailIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body1" fontWeight="600">
                              {selectedContact.email}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <BadgeIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              User ID
                            </Typography>
                            <Chip
                              label={selectedContact.userId}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Stack>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Message */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        TIN NHẮN
                      </Typography>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          backgroundColor: 'grey.50',
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.7,
                            fontStyle: 'italic'
                          }}
                        >
                          "{selectedContact.message}"
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Date */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        THỜI GIAN GỬI
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ScheduleIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          {new Date(selectedContact.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                      <Button 
                        variant="contained" 
                        onClick={handleCloseView}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)'
                        }}
                      >
                        Đóng
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}
      />
    </Box>
  );
};

export default Contact;