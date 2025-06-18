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
  CardMedia,
  Chip,
  IconButton,
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
  Article as ArticleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewService from "../../services/NewService";
import NewsAdd from "./NewsAdd";
import NewsEdit from "./NewsEdit";
import { Avatar } from "@mui/material";

const News = () => {
  useEffect(() => {
    document.title = "Tin tức";
  }, []);
  
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const loadNews = async () => {
    try {
      const response = await NewService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setNews(data.$values);
        setFilteredNews(data.$values);
      } else {
        setNews([]);
        setFilteredNews([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
      setNews([]);
      setFilteredNews([]);
      toast.error("Có lỗi khi tải tin tức. Vui lòng thử lại!", {
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
    loadNews();
  }, []);

  useEffect(() => {
    let filtered = [...news];
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredNews(filtered);
    setPage(1);
  }, [searchTerm, news]);

  const handleAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setSelectedNewsId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tin tức này?")) {
      try {
        await NewService.delete(id);
        toast.success("Tin tức đã bị xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        loadNews();
      } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
        toast.error("Có lỗi khi xóa tin tức. Vui lòng thử lại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleView = (newsItem) => {
    setSelectedNews(newsItem);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedNews = filteredNews.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredNews.length / rowsPerPage);
  
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ArticleIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quản lý Tin tức
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Quản lý và theo dõi tất cả tin tức của hệ thống
        </Typography>
      </Box>

      {/* Action Bar */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              Thêm tin tức mới
            </Button>
            
            <TextField
              placeholder="Tìm kiếm theo tiêu đề tin tức..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                minWidth: { xs: '100%', sm: 350 },
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
          </Stack>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction="row" spacing={4} alignItems="center">
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {filteredNews.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Tổng số tin tức
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {totalPages}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Trang
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <NewsAdd
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={() => {
          loadNews();
          handleCloseAdd();
        }}
      />

      {/* Table Card */}
      <Card sx={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Nội dung</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNews.length > 0 ? (
                paginatedNews.map((newsItem, index) => (
                  <TableRow 
                    key={newsItem.id}
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
                        label={newsItem.id} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {newsItem.imageurl ? (
                        <Avatar
                          src={newsItem.imageurl}
                          alt={newsItem.title}
                          variant="rounded"
                          sx={{
                            width: 70,
                            height: 70,
                            border: '3px solid',
                            borderColor: 'primary.light',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 70,
                            height: 70,
                            backgroundColor: 'grey.200',
                            color: 'grey.500'
                          }}
                        >
                          <ArticleIcon />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        {newsItem.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" color="text.secondary">
                        {stripHtml(newsItem.content).length > 100
                          ? `${stripHtml(newsItem.content).substring(0, 100)}...`
                          : stripHtml(newsItem.content)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={new Date(newsItem.createdAt).toLocaleDateString('vi-VN')}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => handleView(newsItem)}
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
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(newsItem.id)}
                          sx={{ 
                            color: 'warning.main',
                            '&:hover': { 
                              backgroundColor: 'warning.lighter',
                              transform: 'scale(1.1)' 
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(newsItem.id)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { 
                              backgroundColor: 'error.lighter',
                              transform: 'scale(1.1)' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ArticleIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Không có tin tức nào để hiển thị
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm tin tức đầu tiên'}
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
      {filteredNews.length > 0 && (
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

      <NewsEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        newsId={selectedNewsId}
        onSuccess={() => {
          loadNews();
          setOpenEdit(false);
        }}
      />

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
            {selectedNews && (
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
                  <Typography variant="h5" fontWeight="bold" sx={{ pr: 6 }}>
                    Chi tiết tin tức
                  </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        TIÊU ĐỀ
                      </Typography>
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        {selectedNews.title}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        NỘI DUNG
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.primary"
                        sx={{ 
                          lineHeight: 1.7,
                          '& p': { mb: 1 }
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        NGÀY TẠO
                      </Typography>
                      <Chip
                        label={new Date(selectedNews.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    {(selectedNews.imageUrl || selectedNews.imageurl) && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                          HÌNH ẢNH
                        </Typography>
                        <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                          <CardMedia
                            component="img"
                            image={selectedNews.imageUrl || selectedNews.imageurl}
                            alt={selectedNews.title}
                            sx={{ 
                              maxHeight: 300,
                              objectFit: 'cover',
                              borderRadius: 2
                            }}
                          />
                        </Card>
                      </Box>
                    )}

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

export default News;