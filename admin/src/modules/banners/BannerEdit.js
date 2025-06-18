import { Button, Modal, Box, TextField, Typography, Fade, Backdrop } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BannerService from "../../services/BannerService";
import { uploadFile } from "../../utils/uploadfile";

const BannerEdit = ({ open, onClose, bannerId, onSuccess }) => {
  const [banner, setBanner] = useState({
    title: "",
    description: "",
    link: "",
    status: 1,
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const inpRef = useRef();

  // Reset state khi modal đóng
  useEffect(() => {
    if (!open) {
      setBanner({
        title: "",
        description: "",
        link: "",
        status: 1,
        imageurl: "",
      });
      setFile(null);
      setDataLoaded(false);
    }
  }, [open]);

  // Fetch banner data khi modal mở và có bannerId
  const fetchBanner = async (bannerId) => {
  try {
    const response = await BannerService.getById(bannerId);
    console.log("Fetched Banner Data:", response.data);
    // Cập nhật dữ liệu vào state
    setBanner({
      title: response.data.title || "",
      description: response.data.description || "",
      link: response.data.link || "",
      status: response.data.status || 1,
      imageurl: response.data.imageurl || "",
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
    toast.error("Không thể tải dữ liệu banner.");
  }
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBanner({ ...banner, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setBanner({ ...banner, description: data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      let imageurl = banner.imageurl;
      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
        imageurl = uploadedUrl;
      }

      const updatedData = { ...banner, imageurl };
      await BannerService.update(bannerId, updatedData);

      toast.success("Cập nhật banner thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Reset form sau khi thành công
      setBanner({ title: "", description: "", link: "", status: 1, imageurl: "" });
      setFile(null);
      setDataLoaded(false);
      if (inpRef.current) {
        inpRef.current.value = "";
      }

      if (onSuccess) onSuccess();
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Có lỗi khi cập nhật banner. Vui lòng thử lại!", {
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
            width: { xs: "90%", sm: 600 },
            maxWidth: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Cập nhật Banner
          </Typography>

          {loading && (
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Đang tải dữ liệu...
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Tiêu đề"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={banner.title}
              onChange={handleInputChange}
              disabled={loading}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Mô tả
            </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={banner.description}
              onChange={handleDescriptionChange}
              disabled={loading}
            />
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              margin="normal"
              name="link"
              value={banner.link}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextField
              select
              label="Trạng thái"
              variant="outlined"
              fullWidth
              margin="normal"
              name="status"
              value={banner.status}
              onChange={handleInputChange}
              disabled={loading}
              SelectProps={{
                native: true,
              }}
            >
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Tạm dừng</option>
            </TextField>
            <Button
              onClick={() => inpRef.current?.click()}
              variant="outlined"
              color="primary"
              disabled={loading}
            >
              Chọn ảnh
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={inpRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {(file || banner.imageurl) && (
              <img
                src={file ? URL.createObjectURL(file) : banner.imageurl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "10px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BannerEdit;
