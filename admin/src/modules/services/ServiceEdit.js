// ServiceEdit.jsx
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { UploadFile } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesService from "../../services/CategoriesService";
import ServiceService from "../../services/Serviceservice";
import { uploadFile } from "../../utils/uploadfile";

const getToken = () => localStorage.getItem("token");

const ServiceEdit = ({ open, onClose, serviceId, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    price: "",
    description: "",
    duration: "",
    categoryId: 0,
    imageurl: [],
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const inpRef = useRef();

  useEffect(() => {
    if (open && serviceId) {
      ServiceService.getById(serviceId)
        .then((response) => {
          const {
            id,
            name,
            price,
            description,
            duration,
            imageurl,
            categoryId,
          } = response.data;
          setFormData({
            id: id || 0,
            name: name || "",
            price: price || "",
            description: description || "",
            duration: duration || "",
            imageurl: imageurl || [],
            categoryId: categoryId || 0,
          });
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
          toast.error("Không thể lấy thông tin dịch vụ.");
        });
    }
  }, [open, serviceId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoriesService.getAll();
        const categoriesData = response?.$values || response || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Vui lòng đăng nhập để cập nhật dịch vụ.");
      return;
    }

    // Validate
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.duration
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error("Giá phải là số dương!");
      return;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Tên dịch vụ phải có ít nhất 3 ký tự!");
      return;
    }

    if (formData.description.trim().length < 3) {
      toast.error("Mô tả phải có ít nhất 3 ký tự!");
      return;
    }

    if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      toast.error("Thời gian phải là số dương!");
      return;
    }

    try {
      let downloadURL = formData.imageurl;

      if (file) {
        downloadURL = await uploadFile(file, "images");
        if (!downloadURL || typeof downloadURL !== "string") {
          throw new Error("Tải ảnh thất bại!");
        }
        downloadURL = [downloadURL];
      }

      const submitData = {
        id: serviceId,
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        categoryId: Number(formData.categoryId),
        imageurl: downloadURL,
        appointments: null,
      };

      await axios.put(
        `https://localhost:7169/api/services/${serviceId}`,
        submitData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Cập nhật dịch vụ thành công!", {
        onClose: () => {
          onSuccess();
          onClose();
        },
      });

      setFormData({
        id: 0,
        name: "",
        price: "",
        description: "",
        duration: "",
        imageurl: [],
        categoryId: 0,
      });
      setFile(null);
      if (inpRef.current) inpRef.current.value = "";
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhật dịch vụ</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            margin="normal"
            label="Tên dịch vụ"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Giá"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            select
            fullWidth
            label="Danh mục"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </TextField>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prev) => ({ ...prev, description: data }));
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Thời gian (phút)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <label>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              component="span"
              startIcon={<UploadFile />}
              onClick={() => inpRef.current?.click()}
            >
              Thêm ảnh
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={inpRef}
              onChange={handleFileChange}
              hidden
            />
          </label>
          {(file || formData.imageurl.length > 0) && (
            <img
              src={file ? URL.createObjectURL(file) : formData.imageurl[0]}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                marginTop: "10px",
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default ServiceEdit;
