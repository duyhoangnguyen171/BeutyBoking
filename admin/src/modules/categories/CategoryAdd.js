import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import CategoriesService from "../../services/CategoriesService";
import { uploadFile } from "../../utils/uploadfile";

const CategoryAdd = ({ 
  open, 
  onClose, 
  onCategoryAdded, 
  category = null, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    services: '', 
    imageurl: '' 
  });
  const [file, setFile] = useState(null);
  const inpRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cập nhật form khi category thay đổi (cho trường hợp edit)
  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name: category.name || '',
        services: category.services || '',
        imageurl: category.imageurl || ''
      });
    } else {
      // Reset form khi mở modal thêm mới
      setFormData({
        name: '',
        services: '',
        imageurl: ''
      });
    }
    setError(null); // Reset error khi modal mở
  }, [category, isEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Tên category không được để trống.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      // Upload ảnh nếu có file được chọn
      let imageurl = formData.imageurl;
      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại.");
        }
        imageurl = uploadedUrl;
      }

      // Cập nhật hoặc thêm mới category
      const dataToSubmit = { ...formData, imageurl };
      if (isEdit && category) {
        result = await CategoriesService.update(category.id, dataToSubmit);
      } else {
        result = await CategoriesService.create(dataToSubmit);
      }

      onCategoryAdded(result); // Gọi callback với dữ liệu trả về
    } catch (err) {
      setError(isEdit ? 'Có lỗi xảy ra khi cập nhật category.' : 'Có lỗi xảy ra khi thêm category.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', services: '', imageurl: '' });
    setError(null);
    onClose();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Sửa Category' : 'Thêm Category'}
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <TextField
        label="Tên Category"
        variant="outlined"
        fullWidth
        margin="normal"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      
      {/* Thêm phần tải lên hình ảnh */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inpRef}
        style={{ marginTop: 10 }}
      />
      
      {file && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleCancel}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading || !formData.name.trim()}
        >
          {loading 
            ? (isEdit ? 'Đang cập nhật...' : 'Đang thêm...') 
            : (isEdit ? 'Cập nhật' : 'Thêm')
          }
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryAdd;
