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
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Divider,
  InputAdornment,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../asset/styles/service/service.css";
import CategoryService from "../../services/CategoriesService";
import ServiceService from "../../services/Serviceservice";
import ServiceAdd from "./ServiceAdd";
import ServiceEdit from "./ServiceEdit";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;
  const inpRef = useRef();

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await ServiceService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setServices(data.$values);
        setFilteredServices(data.$values);
        console.log("Danh sách dịch vụ:", data.$values);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      setServices([]);
      setFilteredServices([]);
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
    setPage(1);
  }, [searchTerm, services]);

  const handleAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setSelectedServiceId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await ServiceService.delete(id);
        toast.success("Dịch vụ đã được xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        loadServices();
      } catch (error) {
        console.error("Lỗi khi xoá dịch vụ:", error);
        toast.error("Có lỗi xảy ra khi xóa dịch vụ", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Chưa phân loại";
  };

  const paginatedServices = filteredServices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage);

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
          <CategoryIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý Dịch vụ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả dịch vụ trong hệ thống
        </Typography>
      </Box>

      {/* Action Bar */}
      <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
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
              Thêm dịch vụ mới
            </Button>
            
            <TextField
              placeholder="Tìm kiếm dịch vụ..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                minWidth: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
              size="small"
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

      {/* Services Table */}
      <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                {['ID', 'Hình ảnh', 'Tên dịch vụ', 'Danh mục', 'Giá tiền', 'Thời gian', 'Mô tả', 'Thao tác'].map((header) => (
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedServices.length > 0 ? (
                paginatedServices.map((service, index) => (
                  <TableRow 
                    key={service.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9fafb' },
                      '&:nth-of-type(even)': { backgroundColor: '#fdfdfd' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      #{service.id}
                    </TableCell>
                    
                    <TableCell>
                      <Avatar
                        src={service.imageurl}
                        alt={service.name}
                        variant="rounded"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          border: '2px solid #e5e7eb'
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
                          {service.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={getCategoryName(service.categoryId)}
                        size="small"
                        sx={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MoneyIcon sx={{ fontSize: 16, color: '#059669' }} />
                        <Typography variant="body2" fontWeight="600" color="#059669">
                          {formatPrice(service.price)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                        <Typography variant="body2" color="#7c3aed" fontWeight="500">
                          {service.duration} phút
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        dangerouslySetInnerHTML={{ __html: service.description }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleView(service)}
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
                            onClick={() => handleEdit(service.id)}
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
                            onClick={() => handleDelete(service.id)}
                            sx={{ 
                              color: '#ef4444',
                              '&:hover': { backgroundColor: '#fee2e2' }
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
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="h6" gutterBottom>
                        Không có dịch vụ nào
                      </Typography>
                      <Typography variant="body2">
                        Hãy thêm dịch vụ đầu tiên của bạn
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredServices.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
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
      </Card>

      {/* Add Service Modal */}
      <ServiceAdd
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={() => {
          loadServices();
          handleCloseAdd();
        }}
      />

      {/* Edit Service Modal */}
      <ServiceEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        serviceId={selectedServiceId}
        onSuccess={() => {
          loadServices();
          setOpenEdit(false);
        }}
      />

      {/* View Service Modal */}
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
              width: { xs: '90%', sm: '600px' },
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {selectedService && (
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
                    Chi tiết dịch vụ
                  </Typography>
                  <IconButton onClick={handleCloseView} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3, maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
                  {/* Service Image */}
                  {selectedService.imageurl && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <img
                        src={selectedService.imageurl}
                        alt={selectedService.name}
                        style={{
                          width: '100%',
                          maxHeight: '250px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </Box>
                  )}

                  {/* Service Info */}
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                        {selectedService.name}
                      </Typography>
                      <Chip
                        label={getCategoryName(selectedService.categoryId)}
                        size="small"
                        sx={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          fontWeight: 500
                        }}
                      />
                    </Box>

                    <Divider />

                    <Stack direction="row" spacing={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon sx={{ color: '#059669' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Giá tiền
                          </Typography>
                          <Typography variant="h6" fontWeight="600" color="#059669">
                            {formatPrice(selectedService.price)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ color: '#7c3aed' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Thời gian
                          </Typography>
                          <Typography variant="h6" fontWeight="600" color="#7c3aed">
                            {selectedService.duration} phút
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" color="#1e293b" gutterBottom>
                        Mô tả chi tiết
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#f8fafc',
                          borderRadius: 2,
                          border: '1px solid #e5e7eb'
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedService.description }}
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* Modal Footer */}
                <Box sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
                  <Button
                    variant="contained"
                    onClick={handleCloseView}
                    fullWidth
                    sx={{
                      backgroundColor: '#3b82f6',
                      '&:hover': { backgroundColor: '#2563eb' },
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Đóng
                  </Button>
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

export default Services;