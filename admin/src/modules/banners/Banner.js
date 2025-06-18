import { 
  Avatar, 
  Button, 
  TableCell, 
  Paper, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  Chip, 
  Box, 
  Typography, 
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import { useEffect, useState } from "react";
import { Add, Edit, Delete, Launch, Image } from "@mui/icons-material";
import BannerService from "../../services/BannerService";
import BannerAdd from "./BannerAdd";
import BannerEdit from "./BannerEdit";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  useEffect(() => {
    document.title = "Banner";
  }, []);
  
  const [banners, setBanners] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    link: "",
    status: 1,
  });

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      const response = await BannerService.getAll();
      if (Array.isArray(response.data.$values)) {
        setBanners(response.data.$values);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (error) {
      setError("Không thể tải danh sách banner.");
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle modal open and close
  const handleAdd = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleEdit = (id) => {
    setSelectedBannerId(id);
    setOpenEdit(true);
  };

  // QUAN TRỌNG: Chỉ reset selectedBannerId sau khi modal đã đóng hoàn toàn
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBanner({ ...newBanner, [name]: value });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await BannerService.create(newBanner);
      setIsFormOpen(false);
      fetchBanners();
      setNewBanner({ title: "", description: "", link: "", status: 1 });
    } catch (error) {
      setError("Không thể thêm banner.");
      console.error("Error adding banner:", error);
    }
  };

  const handleEditSuccess = () => {
    fetchBanners();
    handleCloseEdit();
  };

  const handleModalExited = () => {
    setSelectedBannerId(null);
  };

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
            <Image sx={{ fontSize: 32, color: '#3b82f6' }} />
            Quản lý Banner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý và cấu hình các banner hiển thị trên website
          </Typography>
        </Box>

        {/* Action Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Thêm Banner Mới
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
        {banners.length === 0 ? (
          <Paper 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              bgcolor: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: 3
            }}
          >
            <Image sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có banner nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhấn vào nút "Thêm Banner Mới" để tạo banner đầu tiên
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
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Hình ảnh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Tiêu đề
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Mô tả
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Link
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Trạng thái
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banners.map((banner, index) => (
                  <TableRow 
                    key={banner.id}
                    sx={{ 
                      '&:hover': { bgcolor: '#f8fafc' },
                      bgcolor: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                  >
                    <TableCell sx={{ py: 2, fontWeight: 600, color: '#64748b' }}>
                      #{banner.id}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {banner.imageurl ? (
                        <Avatar
                          src={banner.imageurl}
                          alt={banner.title}
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
                    <TableCell sx={{ py: 2, maxWidth: 200 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {banner.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, maxWidth: 300 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4
                        }}
                      >
                        {stripHtml(banner.description).length > 100
                          ? `${stripHtml(banner.description).substring(0, 100)}...`
                          : stripHtml(banner.description)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, maxWidth: 200 }}>
                      {banner.link ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2"
                            sx={{
                              color: '#3b82f6',
                              textDecoration: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 150
                            }}
                            component="a"
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {banner.link}
                          </Typography>
                          <IconButton 
                            size="small" 
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#64748b' }}
                          >
                            <Launch fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          Không có link
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={banner.status === 1 ? "Đang hoạt động" : "Tạm dừng"}
                        color={banner.status === 1 ? "success" : "default"}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 2,
                          ...(banner.status === 1 && {
                            bgcolor: '#f0fdf4',
                            borderColor: '#22c55e',
                            color: '#166534'
                          })
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(banner.id)}
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
                            onClick={() => console.log(`Xóa banner có ID: ${banner.id}`)}
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* BannerEdit Modal */}
        <BannerEdit
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onExited={handleModalExited}
          bannerId={selectedBannerId}
          onSuccess={() => {
            fetchBanners();
            setOpenEdit(false);
          }}
        />

        {/* BannerAdd Modal */}
        <BannerAdd
          open={isFormOpen}
          onClose={handleCloseForm}
          onSuccess={() => {
            fetchBanners();
            setIsFormOpen(false);
          }}
        />
      </Paper>
    </Box>
  );
};

export default Banner;