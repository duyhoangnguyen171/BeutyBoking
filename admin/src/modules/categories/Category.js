import React, { useState, useEffect } from "react";
import CategoriesService from "../../services/CategoriesService";
import {
  Backdrop,
  Box,
  Fade,
  Typography,
  Avatar,
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
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Category as CategoryIcon,
  Image,
  Visibility
} from "@mui/icons-material";
import CategoryAdd from "./CategoryAdd";

const Category = () => {
  useEffect(() => {
    document.title = "Danh mục";
  }, []);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch categories từ API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoriesService.getAll();
      
      let data = response;
      if (response && response.$values) {
        data = response.$values;
      }
      
      const processedCategories = Array.isArray(data) ? data.map(category => ({
        ...category,
        services: category.services && category.services.$values 
          ? category.services.$values 
          : (Array.isArray(category.services) ? category.services : [])
      })) : [];
      
      setCategories(processedCategories);
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
      setLoading(false);
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  
  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setOpenEdit(true);
  };
  
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCurrentCategory(null);
  };

  const handleDeleteClick = async (categoryId) => {
    try {
      await CategoriesService.delete(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa category.");
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderServices = (services) => {
    if (!services) return 'N/A';
    
    if (Array.isArray(services)) {
      return services.length > 0 
        ? services.map(service => service.name || service).join(', ')
        : 'Chưa có dịch vụ';
    }
    
    if (typeof services === 'string') {
      return services || 'N/A';
    }
    
    return 'N/A';
  };

  const handleCategoryAdded = (newCategory) => {
    if (newCategory) {
      const processedCategory = {
        ...newCategory,
        services: newCategory.services && newCategory.services.$values 
          ? newCategory.services.$values 
          : (Array.isArray(newCategory.services) ? newCategory.services : [])
      };
      
      setCategories(prevCategories => [...prevCategories, processedCategory]);
    } else {
      fetchCategories();
    }
    handleCloseAdd();
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    handleCloseEdit();
  };

  // Paginate categories
  const paginatedCategories = categories.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Hình ảnh</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Tên Category</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="rounded" width={60} height={60} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={200} height={30} />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="rounded" width={60} height={36} />
                  <Skeleton variant="rounded" width={60} height={36} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={400} height={24} />
          </Box>
          <Skeleton variant="rounded" width={180} height={48} sx={{ mb: 3 }} />
          <LoadingSkeleton />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          bgcolor: 'white'
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <CategoryIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
            Quản lý Danh mục
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý các danh mục dịch vụ và sản phẩm
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0} 
              sx={{ 
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {categories.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Tổng danh mục
                    </Typography>
                  </Box>
                  <CategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.5)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Thêm Danh mục Mới
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Content */}
        {categories.length === 0 ? (
          <Paper 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              bgcolor: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: 3
            }}
          >
            <CategoryIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có danh mục nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhấn vào nút "Thêm Danh mục Mới" để tạo danh mục đầu tiên
            </Typography>
          </Paper>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                      Hình ảnh
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                      Tên Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category, index) => (
                      <TableRow 
                        key={category.id || Math.random()}
                        sx={{ 
                          '&:hover': { bgcolor: '#f8fafc' },
                          bgcolor: index % 2 === 0 ? 'white' : '#fafbfc'
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          {category.imageurl ? (
                            <Avatar
                              src={category.imageurl}
                              alt={category.name || 'Category'}
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 60,
                                border: "2px solid #e2e8f0",
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: '#f1f5f9',
                                border: "2px solid #e2e8f0",
                                borderRadius: 2
                              }}
                            >
                              <Image sx={{ color: '#94a3b8' }} />
                            </Avatar>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#1e293b',
                              mb: 0.5
                            }}
                          >
                            {category.name || 'N/A'}
                          </Typography>
                          <Chip
                            label={`ID: ${category.id}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              height: 20,
                              borderColor: '#e2e8f0',
                              color: '#64748b'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#3b82f6',
                                  bgcolor: '#dbeafe',
                                  '&:hover': {
                                    bgcolor: '#bfdbfe',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(category)}
                                sx={{
                                  color: '#f59e0b',
                                  bgcolor: '#fef3c7',
                                  '&:hover': {
                                    bgcolor: '#fde68a',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(category.id)}
                                sx={{
                                  color: '#ef4444',
                                  bgcolor: '#fecaca',
                                  '&:hover': {
                                    bgcolor: '#fca5a5',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <CategoryIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Pagination */}
        {categories.length > rowsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(categories.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Modal thêm category */}
        <Modal
          open={openAdd}
          onClose={handleCloseAdd}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
          }}
        >
          <Fade in={openAdd}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: '90%', sm: 500 },
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                p: 0,
                outline: 'none'
              }}
            >
              <CategoryAdd
                open={openAdd}
                onClose={handleCloseAdd}
                onCategoryAdded={handleCategoryAdded}
              />
            </Box>
          </Fade>
        </Modal>

        {/* Modal sửa category */}
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
          }}
        >
          <Fade in={openEdit}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: '90%', sm: 500 },
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                p: 0,
                outline: 'none'
              }}
            >
              <CategoryAdd
                open={openEdit}
                category={currentCategory}
                onClose={handleCloseEdit}
                onCategoryAdded={handleCategoryUpdated}
                isEdit={true}
              />
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </Box>
  );
};

export default Category;