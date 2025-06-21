import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile } from "../../utils/uploadfile";
import NewService from "../../services/NewService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Paper,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const NewsEdit = ({ open, onClose, onSuccess, newsId }) => {
  const [formData, setFormData] = useState({
    id: newsId,
    title: "",
    content: "",
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inpRef = useRef();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await NewService.getById(newsId);
        setFormData(res.data);
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
        toast.error("Không thể tải dữ liệu tin tức!");
      } finally {
        setLoading(false);
      }
    };

    if (open && newsId) {
      fetchNews();
    }
  }, [open, newsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageurl = formData.imageurl;

      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại.");
        }
        imageurl = uploadedUrl;
      }

      const updatedData = { ...formData, imageurl };
      await NewService.update(newsId, updatedData);

      toast.success("Cập nhật tin tức thành công!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Lỗi khi cập nhật tin tức. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1300,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            width: "95%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EditIcon sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Chỉnh sửa tin tức
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 200,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Đang tải...
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mb: 1.5 }}
                  >
                    Tiêu đề bài viết
                  </Typography>
                  <TextField
                    fullWidth
                    name="title"
                    placeholder="Nhập tiêu đề bài viết..."
                    value={formData.title}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Content Editor */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mb: 1.5 }}
                  >
                    Nội dung bài viết
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "white",
                      "& .ck-editor__editable": {
                        minHeight: "250px",
                        padding: "16px",
                      },
                    }}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData.content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFormData((prev) => ({ ...prev, content: data }));
                      }}
                    />
                  </Box>
                </Box>

                {/* Image Upload */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    color="text.primary"
                    sx={{ mb: 1.5 }}
                  >
                    Hình ảnh bài viết
                  </Typography>
                  <Button
                    onClick={() => inpRef.current?.click()}
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      py: 1.5,
                      px: 3,
                      backgroundColor: "#f8f9ff",
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5a67d8",
                        backgroundColor: "#f0f2ff",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {file ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={inpRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  
                  {file && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: "italic" }}
                    >
                      Đã chọn: {file.name}
                    </Typography>
                  )}
                </Box>

                {/* Image Preview */}
                {(file || formData.imageurl) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      color="text.primary"
                      sx={{ mb: 1.5 }}
                    >
                      Xem trước ảnh
                    </Typography>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <img
                        src={file ? URL.createObjectURL(file) : formData.imageurl}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Paper>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      borderColor: "#d0d0d0",
                      color: "#666",
                      "&:hover": {
                        borderColor: "#999",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                    disabled={loading}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a67d8 0%, #6b46a3 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                      },
                      "&:disabled": {
                        background: "#ccc",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                  </Button>
                </Box>
              </form>
            )}
          </Box>

          <ToastContainer
            theme="colored"
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Paper>
      </Fade>
    </Backdrop>
  );
};

export default NewsEdit;