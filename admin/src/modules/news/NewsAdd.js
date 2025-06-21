// newsadd.js - Thêm tin tức mới dưới dạng Modal

import React, { useRef, useState } from "react";
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
  Add as AddIcon,
} from "@mui/icons-material";

const NewsAdd = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inpRef = useRef();

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
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
        imageurl = uploadedUrl;
      }

      const response = await NewService.create({ ...formData, imageurl });

      toast.success("Thêm tin tức thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setFormData({ title: "", content: "", imageurl: "" });
      setFile(null);
      if (inpRef.current) {
        inpRef.current.value = "";
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
      toast.error("Có lỗi khi thêm tin tức. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AddIcon sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Thêm tin tức mới
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
                  required
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
                      minHeight: "300px",
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
                    config={{
                      height: "400px", // không có tác dụng ở đây
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
                    backgroundColor: "#f0f8ff",
                    borderColor: "#4facfe",
                    color: "#4facfe",
                    "&:hover": {
                      borderColor: "#00d4ff",
                      backgroundColor: "#e6f7ff",
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
                  onChange={handleFileChange}
                  ref={inpRef}
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
              {file && (
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
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      style={{
                        display: "block",
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
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #3d8bfe 0%, #00d4aa 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(79, 172, 254, 0.4)",
                    },
                    "&:disabled": {
                      background: "#ccc",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Đang thêm..." : "Thêm mới"}
                </Button>
              </Box>
            </form>
          </Box>

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
            theme="colored"
            style={{ zIndex: 9999 }}
          />
        </Paper>
      </Fade>
    </Backdrop>
  );
};

export default NewsAdd;