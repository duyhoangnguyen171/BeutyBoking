import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // Import CKEditor build
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState,useRef } from "react";
import BannerService from "../../services/BannerService";
import { uploadFile } from "../../utils/uploadfile";
const BannerAdd = ({ open, onClose, onSuccess }) => {
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    link: "",
    status: 1,
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const inpRef = useRef();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBanner({ ...newBanner, [name]: value });
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData(); // Get the content from CKEditor
    setNewBanner({ ...newBanner, description: data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageurl = newBanner.imageurl;
      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
        imageurl = uploadedUrl;
      }
      await BannerService.create({ ...newBanner, imageurl }); // Call API to create new banner
      toast.success("Thêm tin Banner thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      }); // Notify parent component to reload banners
      setNewBanner({ title: "", description: "", imageurl: "" });
      setFile(null);
      inpRef.current.value = "";
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Có lỗi khi thêm banner. Vui lòng thử lại!", {
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
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 }, // Increase width for larger modal
            maxWidth: "100%", // Set a max width to ensure responsiveness
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Thêm Banner Mới
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tiêu đề"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={newBanner.title}
              onChange={handleInputChange}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Mô tả
            </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={newBanner.description}
              onChange={handleDescriptionChange} // Set description on CKEditor change
            />
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              margin="normal"
              name="link"
              value={newBanner.link}
              onChange={handleInputChange}
            />
            <TextField
              select
              label="Trạng thái"
              variant="outlined"
              fullWidth
              margin="normal"
              name="status"
              value={newBanner.status}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Tạm dừng</option>
            </TextField>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button variant="contained" color="primary" type="submit">
                Thêm
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Hủy
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BannerAdd;
