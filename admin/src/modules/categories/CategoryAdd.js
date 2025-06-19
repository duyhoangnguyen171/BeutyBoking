import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesService from "../../services/CategoriesService";
import { uploadFile } from "../../utils/uploadfile";

const CategoryAdd = ({
  open,
  onClose,
  onCategoryAdded,
  category = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    imgarurl: "", // Changed from 'imgarurl' to 'imageUrl'
    services: [], // Assuming services is an array
  });
  const [file, setFile] = useState(null);
  const inpRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form when category changes (for edit case)
  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name: category.name || "",
        imgarurl: category.imgarurl || "", // Ensure this matches your API field
        services: category.services || [], // Default to empty array
      });
    } else {
      // Reset form when opening modal for adding new category
      setFormData({
        name: "",
        imgarurl: "",
        services: [], // Default empty array
      });
    }
    setError(null); // Reset error when modal opens
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
      setError("Tên category không được để trống.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      let imgarurl = formData.imgarurl;

      // Log the form data before making the request
      console.log("Data being submitted:", { ...formData, imgarurl });

      // Upload image if file is selected
      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại.");
        }
        imgarurl = uploadedUrl;
      }

      // Prepare data for submission
      const dataToSubmit = { ...formData, imgarurl };

      // Log the data that will be sent to the server
      console.log("Data after processing (including image URL):", dataToSubmit);

      // Create or update category based on isEdit flag
      if (isEdit && category) {
        result = await CategoriesService.update(category.id, dataToSubmit);
      } else {
        result = await CategoriesService.create(dataToSubmit);
      }

      if (result) {
        onCategoryAdded(result); // Callback with the returned category data
        toast.success(
          isEdit ? "Cập nhật category thành công!" : "Thêm category thành công!"
        );
        onClose(); // Close the modal
      } else {
        throw new Error("Service returned null or failed");
      }
    } catch (err) {
      setError(
        isEdit
          ? "Có lỗi xảy ra khi cập nhật category."
          : "Có lỗi xảy ra khi thêm category."
      );
      console.error(err);
      toast.error(
        isEdit ? "Lỗi khi cập nhật category." : "Lỗi khi thêm category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", imgarurl: "", services: [] }); // Reset services to empty array
    setError(null);
    onClose();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Sửa Category" : "Thêm Category"}
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

      {/* Image upload */}
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
            ? isEdit
              ? "Đang cập nhật..."
              : "Đang thêm..."
            : isEdit
            ? "Cập nhật"
            : "Thêm"}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryAdd;
