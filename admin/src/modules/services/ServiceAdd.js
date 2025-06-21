import { UploadFile, Close } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesService from "../../services/CategoriesService";
import ServiceService from "../../services/Serviceservice";
import { uploadFile } from "../../utils/uploadfile";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ServiceAdd = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageurl, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const inpRef = useRef();

  // Fetch danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await CategoriesService.getAll();
        const categoriesData = response || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh sách danh mục!");
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Tên dịch vụ là bắt buộc";
    } else if (name.trim().length < 3) {
      newErrors.name = "Tên dịch vụ phải có ít nhất 3 ký tự";
    }

    if (!price) {
      newErrors.price = "Giá là bắt buộc";
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Giá phải là số dương";
    }

    if (!duration) {
      newErrors.duration = "Thời gian là bắt buộc";
    } else if (isNaN(duration) || Number(duration) <= 0) {
      newErrors.duration = "Thời gian phải là số dương";
    }

    if (!description.trim() || description.trim() === "<p></p>") {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (description.trim().length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (!categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      setLoading(true);
      let downloadURL = "";
      
      if (file) {
        downloadURL = await uploadFile(file, "images");
        if (typeof downloadURL !== "string" || downloadURL === "Error upload") {
          throw new Error("Tải ảnh lên thất bại");
        }
      }

      const serviceData = {
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
        description: description.trim(),
        imageurl: downloadURL ? [downloadURL] : [],
        categoryId: categoryId,
      };

      await ServiceService.create(serviceData);
      
      toast.success("Thêm dịch vụ thành công!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      // Reset form
      resetForm();
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        error.message || "Có lỗi khi thêm dịch vụ. Vui lòng thử lại!",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setDescription("");
    setImage([]);
    setFile(null);
    setCategoryId("");
    setErrors({});
    if (inpRef.current) {
      inpRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB!");
        return;
      }
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file hình ảnh!");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inpRef.current) {
      inpRef.current.value = "";
    }
  };

  return (
    <>
      <Modal 
        open={open} 
        onClose={handleClose}
        disableEscapeKeyDown={loading}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 600 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="h6" component="h2" fontWeight="bold">
              Thêm dịch vụ mới
            </Typography>
            <IconButton 
              onClick={handleClose} 
              disabled={loading}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
            }}
          >
            <Stack spacing={3}>
              {/* Tên dịch vụ */}
              <TextField
                label="Tên dịch vụ"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: null }));
                  }
                }}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                placeholder="Nhập tên dịch vụ..."
              />

              {/* Giá và thời gian */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Giá (VNĐ)"
                  variant="outlined"
                  fullWidth
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) {
                      setErrors(prev => ({ ...prev, price: null }));
                    }
                  }}
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price}
                  disabled={loading}
                  placeholder="0"
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Thời gian (phút)"
                  variant="outlined"
                  fullWidth
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    if (errors.duration) {
                      setErrors(prev => ({ ...prev, duration: null }));
                    }
                  }}
                  type="number"
                  error={!!errors.duration}
                  helperText={errors.duration}
                  disabled={loading}
                  placeholder="0"
                  inputProps={{ min: 1 }}
                />
              </Stack>

              {/* Danh mục */}
              <TextField
                select
                label="Danh mục"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.categoryId) {
                    setErrors(prev => ({ ...prev, categoryId: null }));
                  }
                }}
                fullWidth
                variant="outlined"
                error={!!errors.categoryId}
                helperText={errors.categoryId}
                disabled={loading || categoriesLoading}
                placeholder="Chọn danh mục..."
              >
                {categoriesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Đang tải...
                  </MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem disabled>Không có danh mục nào</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </TextField>

              {/* Mô tả */}
              <Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Mô tả dịch vụ {errors.description && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                <Box
                  sx={{
                    border: errors.description ? '2px solid #d32f2f' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& .ck-editor__editable': {
                      minHeight: '150px',
                      maxHeight: '200px',
                      overflow: 'auto',
                      padding: '12px',
                      fontSize: '14px',
                      lineHeight: 1.5,
                    },
                    '& .ck-toolbar': {
                      borderBottom: '1px solid #e0e0e0',
                    },
                  }}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    disabled={loading}
                    config={{
                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'undo',
                        'redo'
                      ],
                      placeholder: 'Nhập mô tả chi tiết về dịch vụ...',
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setAttribute(
                          "spellcheck",
                          "false",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDescription(data);
                      if (errors.description) {
                        setErrors(prev => ({ ...prev, description: null }));
                      }
                    }}
                  />
                </Box>
                {errors.description && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.description}
                  </Typography>
                )}
              </Box>

              {/* Upload ảnh */}
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Hình ảnh dịch vụ
                </Typography>
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadFile />}
                  onClick={() => inpRef.current?.click()}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  Chọn hình ảnh
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inpRef}
                  onChange={handleFileChange}
                  hidden
                />
                
                {file && (
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      mt: 1,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        display: 'block',
                      }}
                    />
                    <Chip
                      label={file.name}
                      onDelete={removeFile}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              bgcolor: 'grey.50',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              size="large"
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleAddService}
              disabled={loading}
              size="large"
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Đang thêm..." : "Thêm dịch vụ"}
            </Button>
          </Box>
        </Box>
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
        theme="colored"
        style={{ zIndex: 10000 }}
      />
    </>
  );
};

export default ServiceAdd;