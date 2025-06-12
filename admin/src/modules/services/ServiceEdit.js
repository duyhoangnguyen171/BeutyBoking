import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceService from "../../services/Serviceservice";
import { uploadFile } from "../../utils/uploadfile";
import { UploadFile } from "@mui/icons-material";
import { CKEditor } from "@ckeditor/ckeditor5-react"; // Thêm CKEditor
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // CKEditor build
import axios from "axios";

const getToken = () => localStorage.getItem("token");

const ServiceEdit = ({ open, onClose, serviceId, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    price: "",
    description: "",
    duration: "",
    imageurl: [],
  });
  const [file, setFile] = useState(null); // For new file upload
  const inpRef = useRef();

  useEffect(() => {
    if (open && serviceId) {
      ServiceService.getById(serviceId)
        .then((response) => {
          const { id, name, price, description, duration, imageurl } =
            response.data;
          setFormData({
            id: id || 0,
            name: name || "",
            price: price || "",
            description: description || "",
            duration: duration || "",
            imageurl: imageurl || [],
          });
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
          toast.error("Không thể lấy thông tin dịch vụ.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });
    }
  }, [open, serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Handle single file (consistent with ServiceAdd)
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Vui lòng đăng nhập để cập nhật dịch vụ.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    // Validation checks
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.duration
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error("Giá phải là một số dương!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (formData.name.trim().length < 3) {
      toast.error("Tên dịch vụ phải có ít nhất 3 ký tự!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (formData.description.trim().length < 3) {
      toast.error("Mô tả phải có ít nhất 3 ký tự!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      toast.error("Thời gian phải là một số dương!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      let downloadURL = formData.imageurl; // Keep existing imageurl by default
      if (file) {
        downloadURL = await uploadFile(file, "images");
        if (!downloadURL || typeof downloadURL !== "string") {
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
        downloadURL = [downloadURL]; // Wrap in array to match ServiceAdd
      }

      const submitData = {
        id: serviceId,
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        imageurl: downloadURL, // Include imageurl
        appointments: null, // Keep null if server handles it
      };

      await axios.put(
        `https://localhost:7169/api/services/${serviceId}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Cập nhật dịch vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        onClose: () => {
          onSuccess();
          onClose();
        },
      });

      // Reset form
      setFormData({
        id: 0,
        name: "",
        price: "",
        description: "",
        duration: "",
        imageurl: [],
      });
      setFile(null);
      if (inpRef.current) inpRef.current.value = "";
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật dịch vụ:",
        error.response?.data || error.message
      );
      toast.error("Cập nhật dịch vụ thất bại. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
            inputProps={{ min: 0, step: 1 }}
          />
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prevData) => ({
                ...prevData,
                description: data,
              }));
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
            inputProps={{ min: 0, step: 1 }}
          />
          <label>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              component="span"
              startIcon={<UploadFile />}
              onClick={() => inpRef.current.click()}
              aria-label="Upload image"
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
              src={file ? URL.createObjectURL(file) : formData.imageurl[0] || ""}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
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
      />
    </Dialog>
  );
};

export default ServiceEdit;
