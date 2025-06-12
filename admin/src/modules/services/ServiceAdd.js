import { UploadFile } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesService from "../../services/CategoriesService ";
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
  const [categoryId, setCategoryId] = useState(""); // Lưu id danh mục được chọn
  const [categories, setCategories] = useState([]); // Danh sách danh mục từ API
  const [duration, setDuration] = useState(0);
  const inpRef = useRef();

  // Fetch danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoriesService.getAll(); // API lấy danh sách categories
        const categoriesData = response?.$values || []; // Truy cập vào $values nếu có
        setCategories(categoriesData); // Lưu danh sách danh mục
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddService = async () => {
    // Kiểm tra thông tin nhập vào
    if (!name || !price || !description || !categoryId) {
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

    if (isNaN(price) || Number(price) <= 0) {
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

    if (name.trim().length < 3) {
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

    if (description.trim().length < 3) {
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

    try {
      let downloadURL = "";
      if (file) {
        downloadURL = await uploadFile(file, "images");
        if (typeof downloadURL !== "string" || downloadURL === "Error upload") {
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
      }

      const serviceData = {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imageurl: downloadURL ? [downloadURL] : [],
        categoryId: categoryId, // Dùng categoryId từ dropdown
      };

      await ServiceService.create(serviceData);
      toast.success("Thêm dịch vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      onSuccess();
      setName("");
      setPrice("");
      setDescription("");
      setImage([]);
      setFile(null);
      setCategoryId(""); // Reset categoryId
      inpRef.current.value = "";
      // Delay onClose to allow toast to display
      setTimeout(() => {
        console.log("Closing modal");
        onClose();
      }, 3500);
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Có lỗi khi thêm dịch vụ. Vui lòng thử lại!", {
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
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "8px",
          marginTop: "50px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Thêm dịch vụ mới
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tên dịch vụ"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Giá"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
          <TextField
            label="Thời gian (phút)"
            variant="outlined"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            inputProps={{ min: 1 }} // Đảm bảo nhập giá trị tối thiểu là 1 phút
          />
          <Typography>Mô tả</Typography>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onReady={(editor) => {
              // Vô hiệu hóa kiểm tra chính tả
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
            }}
          />
          <TextField
            select
            label="Chọn danh mục"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
            variant="outlined"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <label>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              component="span"
              startIcon={<UploadFile />}
              onClick={() => inpRef.current.click()}
            >
              Thêm ảnh
            </Button>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={inpRef}
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddService}
          >
            Thêm
          </Button>
        </Stack>
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
      </div>
    </Modal>
  );
};

export default ServiceAdd;
